import * as pdfjsLib from 'pdfjs-dist'
import yaml from 'js-yaml'
import { postProcess } from './markdownPostProcessor'

/**
 * PDF Converter Utility
 * Extracts text from PDFs and converts to Markdown
 * Note: Works best with text-based PDFs. Scanned/image PDFs require OCR (not supported client-side).
 */

// Use CDN worker for compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

async function animateProgress(onProgress, step, fromPercent, toPercent, message, duration = 300) {
  const steps = 10
  const increment = (toPercent - fromPercent) / steps
  const delay = duration / steps
  for (let i = 0; i <= steps; i++) {
    onProgress(step, Math.round(fromPercent + increment * i), message)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

/**
 * Main conversion function
 * @param {File} file - The PDF file to convert
 * @param {Function} onProgress - Progress callback (step, percentage, message)
 * @returns {Promise<Object>} - Conversion result matching docConverter interface
 */
export async function convertDocument(file, onProgress = () => {}) {
  const result = {
    markdown: '',
    cleanedMarkdown: '',
    splitDocs: [],
    yamlContent: '',
    images: [],
    stats: {
      totalImages: 0,
      totalHeadings: 0,
      totalSections: 0,
    },
  }

  try {
    await animateProgress(onProgress, 'extracting', 0, 10, 'Loading PDF...', 200)
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const totalPages = pdf.numPages

    await animateProgress(onProgress, 'extracting', 10, 15, `Found ${totalPages} pages...`, 150)

    // Extract text from all pages
    const pageTexts = []
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Reconstruct lines by grouping items with similar Y positions
      const lines = reconstructLines(textContent.items)
      pageTexts.push({ pageNum, lines })

      const progress = Math.round(15 + ((pageNum / totalPages) * 30))
      onProgress('extracting', progress, `Extracting page ${pageNum} of ${totalPages}...`)
    }

    await animateProgress(onProgress, 'converting', 45, 60, 'Converting to Markdown...', 200)
    result.markdown = convertPagesToMarkdown(pageTexts)

    await animateProgress(onProgress, 'cleaning', 60, 72, 'Cleaning formatting...', 200)
    result.cleanedMarkdown = postProcess(result.markdown, file.name).cleanedMarkdown

    await animateProgress(onProgress, 'metadata', 72, 85, 'Generating metadata...', 150)
    const headings = parseHeadings(result.cleanedMarkdown)
    result.stats.totalHeadings = headings.length
    result.yamlContent = generateYaml(headings, file.name, totalPages)

    await animateProgress(onProgress, 'splitting', 85, 95, 'Splitting sections...', 150)
    result.splitDocs = splitByHeadings(result.cleanedMarkdown)
    result.stats.totalSections = result.splitDocs.length

    await animateProgress(onProgress, 'complete', 95, 100, 'Conversion complete!', 100)
    return result
  } catch (error) {
    console.error('PDF conversion error:', error)
    throw new Error(`PDF conversion failed: ${error.message}`)
  }
}

/**
 * Reconstruct lines from pdfjs text items grouped by Y position
 */
function reconstructLines(items) {
  if (!items.length) return []

  const Y_THRESHOLD = 2 // items within 2px vertically are on the same line
  const groups = []

  for (const item of items) {
    const y = item.transform[5]
    const existing = groups.find((g) => Math.abs(g.y - y) < Y_THRESHOLD)
    if (existing) {
      // Add space between joined items if neither side has one
      const needsSpace =
        existing.text.length > 0 &&
        !existing.text.endsWith(' ') &&
        !item.str.startsWith(' ')
      existing.text += (needsSpace ? ' ' : '') + item.str
      if (item.fontName?.toLowerCase().includes('bold')) existing.isBold = true
    } else {
      groups.push({
        y,
        text: item.str,
        height: item.height || 12,
        isBold: item.fontName?.toLowerCase().includes('bold') ?? false,
      })
    }
  }

  // Sort top-to-bottom
  return groups.sort((a, b) => b.y - a.y)
}

/**
 * Convert extracted page data to Markdown
 * Infers headings from font size, bold weight, and ALL CAPS patterns
 */
function convertPagesToMarkdown(pageTexts) {
  const lines = []

  // Collect all heights to determine median (body text size)
  const allHeights = pageTexts.flatMap((p) => p.lines.map((l) => l.height)).filter(Boolean)
  allHeights.sort((a, b) => a - b)
  const medianHeight = allHeights[Math.floor(allHeights.length / 2)] || 12

  for (const { lines: pageLines } of pageTexts) {
    for (const line of pageLines) {
      const text = line.text.trim()
      if (!text) continue

      const ratio = line.height / medianHeight
      const isBold = line.isBold ?? false
      const isAllCaps = text === text.toUpperCase() && /[A-Z]/.test(text)
      const isShort = text.length < 80

      if (ratio >= 1.8 || (ratio >= 1.4 && isBold)) {
        lines.push(`# ${text}`)
      } else if (ratio >= 1.4 || (ratio >= 1.15 && isBold) || (isAllCaps && isShort && ratio >= 1.0)) {
        lines.push(`## ${text}`)
      } else if (ratio >= 1.15 || (isBold && isShort)) {
        lines.push(`### ${text}`)
      } else {
        lines.push(text)
      }
    }
  }

  return lines.join('\n')
}

function cleanMarkdown(content) {
  return content
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parseHeadings(content) {
  const headingPattern = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  while ((match = headingPattern.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      filename: match[2].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md',
    })
  }
  return headings
}

function generateYaml(headings, filename, totalPages) {
  return yaml.dump({
    source: filename,
    converted_at: new Date().toISOString(),
    converter: 'pdfConverter',
    total_pages: totalPages,
    total_headings: headings.length,
    headings: headings.map((h) => ({ level: h.level, text: h.text })),
  })
}

function splitByHeadings(content) {
  const sections = content.split(/^(?=#{1,2} )/m).filter(Boolean)
  return sections.map((section) => {
    const firstLine = section.split('\n')[0]
    const title = firstLine.replace(/^#+\s*/, '').trim() || 'Content'
    return {
      title,
      content: section.trim(),
      filename: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md',
    }
  })
}
