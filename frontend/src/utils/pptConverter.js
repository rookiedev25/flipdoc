import JSZip from 'jszip'
import yaml from 'js-yaml'
import { postProcess } from './markdownPostProcessor'

/**
 * PPT/PPTX Converter Utility
 * Extracts text content from PPTX slides and converts to Markdown
 * Note: Layout, animations, and embedded media are not preserved — text and structure only.
 */

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
 * @param {File} file - The PPTX file to convert
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
    await animateProgress(onProgress, 'extracting', 0, 15, 'Opening PPTX archive...', 200)
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)

    // Get slide files sorted by slide number
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)[1])
        const numB = parseInt(b.match(/slide(\d+)/)[1])
        return numA - numB
      })

    if (slideFiles.length === 0) {
      throw new Error('No slides found. Make sure the file is a valid .pptx file.')
    }

    await animateProgress(onProgress, 'extracting', 15, 20, `Found ${slideFiles.length} slides...`, 150)

    // Extract images
    const imageFiles = Object.keys(zip.files).filter((name) =>
      /^ppt\/media\/.+\.(png|jpg|jpeg|gif|svg)$/i.test(name)
    )
    result.stats.totalImages = imageFiles.length

    // Extract text from each slide
    const slides = []
    for (let i = 0; i < slideFiles.length; i++) {
      const slideXml = await zip.files[slideFiles[i]].async('string')
      const slideData = parseSlideXml(slideXml, i + 1)
      slides.push(slideData)

      const progress = Math.round(20 + ((i / slideFiles.length) * 30))
      onProgress('extracting', progress, `Parsing slide ${i + 1} of ${slideFiles.length}...`)
    }

    await animateProgress(onProgress, 'converting', 50, 65, 'Converting to Markdown...', 200)
    result.markdown = convertSlidesToMarkdown(slides)

    await animateProgress(onProgress, 'cleaning', 65, 75, 'Cleaning formatting...', 200)
    result.cleanedMarkdown = postProcess(result.markdown, file.name).cleanedMarkdown

    await animateProgress(onProgress, 'metadata', 75, 87, 'Generating metadata...', 150)
    const headings = parseHeadings(result.cleanedMarkdown)
    result.stats.totalHeadings = headings.length
    result.yamlContent = generateYaml(headings, file.name, slideFiles.length)

    await animateProgress(onProgress, 'splitting', 87, 95, 'Splitting sections...', 150)
    // Each slide becomes its own section
    result.splitDocs = slides.map((slide) => ({
      title: slide.title || `Slide ${slide.slideNum}`,
      content: slide.markdown,
      filename: `slide-${slide.slideNum}.md`,
    }))
    result.stats.totalSections = result.splitDocs.length

    await animateProgress(onProgress, 'complete', 95, 100, 'Conversion complete!', 100)
    return result
  } catch (error) {
    console.error('PPTX conversion error:', error)
    throw new Error(`PPTX conversion failed: ${error.message}`)
  }
}

/**
 * Parse a single slide's XML and extract structured text
 * Uses PPTX placeholder types (title/ctrTitle) for accurate heading detection
 * and indent levels (lvl attr) for nested list structure
 */
function parseSlideXml(xml, slideNum) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  const NS_P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
  const NS_A = 'http://schemas.openxmlformats.org/drawingml/2006/main'

  const slide = { slideNum, title: '', bullets: [], markdown: '' }

  let titleText = ''
  const bodyParagraphs = []

  // Iterate over all shapes on the slide
  const shapes = doc.getElementsByTagNameNS(NS_P, 'sp')
  for (const shape of shapes) {
    // Determine placeholder type: title shapes have <p:ph type="title"> or <p:ph type="ctrTitle">
    const phElements = shape.getElementsByTagNameNS(NS_P, 'ph')
    const phType = phElements[0]?.getAttribute('type') || 'body'
    const isTitle = phType === 'title' || phType === 'ctrTitle'

    const txBody = shape.getElementsByTagNameNS(NS_P, 'txBody')[0]
    if (!txBody) continue

    const paragraphs = txBody.getElementsByTagNameNS(NS_A, 'p')
    for (const para of paragraphs) {
      // Read indent level (0 = top-level bullet, 1+ = nested)
      const pPr = para.getElementsByTagNameNS(NS_A, 'pPr')[0]
      const level = pPr ? parseInt(pPr.getAttribute('lvl') || '0', 10) : 0

      const runs = para.getElementsByTagNameNS(NS_A, 'r')
      let text = ''
      for (const run of runs) {
        const t = run.getElementsByTagNameNS(NS_A, 't')[0]
        if (t) text += t.textContent
      }
      text = text.trim()
      if (!text) continue

      if (isTitle) {
        titleText += (titleText ? ' ' : '') + text
      } else {
        bodyParagraphs.push({ text, level })
      }
    }
  }

  slide.title = titleText
  slide.bullets = bodyParagraphs

  // Build per-slide markdown with proper nesting
  const lines = [`## ${slide.title || `Slide ${slideNum}`}`]
  for (const { text, level } of bodyParagraphs) {
    const indent = '  '.repeat(level)
    lines.push(`${indent}- ${text}`)
  }
  slide.markdown = lines.join('\n')

  return slide
}

/**
 * Combine all slides into a single Markdown document
 */
function convertSlidesToMarkdown(slides) {
  return slides.map((slide) => slide.markdown).join('\n\n---\n\n')
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

function generateYaml(headings, filename, totalSlides) {
  return yaml.dump({
    source: filename,
    converted_at: new Date().toISOString(),
    converter: 'pptConverter',
    total_slides: totalSlides,
    total_headings: headings.length,
    headings: headings.map((h) => ({ level: h.level, text: h.text })),
  })
}
