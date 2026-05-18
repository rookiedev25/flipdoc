import TurndownService from 'turndown'
import { postProcess } from './markdownPostProcessor'

/**
 * HTML Converter Utility
 * Converts .html files to Markdown using TurndownService.
 * This is the highest-fidelity non-DOCX conversion because HTML already
 * carries semantic structure (h1–h6, ul/ol, table, code, blockquote, etc.)
 * that maps cleanly to Markdown.
 */

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
})

// Strikethrough support
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~~${content}~~`,
})

// Convert <pre><code> blocks with language hint from class (e.g. class="language-js")
turndownService.addRule('fencedCodeBlock', {
  filter: (node) =>
    node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE',
  replacement: (_content, node) => {
    const code = node.firstChild
    const lang =
      (code.getAttribute('class') || '')
        .split(' ')
        .find((c) => c.startsWith('language-'))
        ?.replace('language-', '') ?? ''
    return `\n\n\`\`\`${lang}\n${code.textContent.trim()}\n\`\`\`\n\n`
  },
})

// Preserve <mark> as bold (common in HTML docs for highlighting)
turndownService.addRule('mark', {
  filter: 'mark',
  replacement: (content) => `**${content}**`,
})

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
 * @param {File} file - The HTML file to convert
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
    await animateProgress(onProgress, 'extracting', 0, 20, 'Reading HTML file...', 200)
    const html = await file.text()

    await animateProgress(onProgress, 'extracting', 20, 35, 'Parsing document structure...', 200)

    // Parse the HTML to extract the <body> (or full content if no body tag)
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body || doc.documentElement

    // Count images in the HTML
    result.stats.totalImages = body.querySelectorAll('img').length

    // Collect image references (src paths, alt text)
    const imgElements = body.querySelectorAll('img')
    imgElements.forEach((img, i) => {
      const src = img.getAttribute('src') || `image${i + 1}`
      const alt = img.getAttribute('alt') || ''
      result.images.push({ filename: src, alt, contentType: 'image/unknown' })
    })

    await animateProgress(onProgress, 'converting', 35, 65, 'Converting to Markdown...', 300)
    result.markdown = turndownService.turndown(body.innerHTML)

    await animateProgress(onProgress, 'cleaning', 65, 78, 'Applying Docs-as-Code formatting...', 200)
    result.cleanedMarkdown = postProcess(result.markdown, file.name).cleanedMarkdown

    await animateProgress(onProgress, 'metadata', 78, 88, 'Generating metadata...', 150)
    const headings = parseHeadings(result.cleanedMarkdown)
    result.stats.totalHeadings = headings.length
    result.yamlContent = generateYaml(headings, file.name)

    await animateProgress(onProgress, 'splitting', 88, 96, 'Splitting sections...', 150)
    result.splitDocs = splitByHeadings(result.cleanedMarkdown)
    result.stats.totalSections = result.splitDocs.length

    await animateProgress(onProgress, 'complete', 96, 100, 'Conversion complete!', 100)
    return result
  } catch (error) {
    console.error('HTML conversion error:', error)
    throw new Error(`HTML conversion failed: ${error.message}`)
  }
}

function parseHeadings(content) {
  const headingPattern = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  while ((match = headingPattern.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      filename:
        match[2]
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 50) + '.md',
    })
  }
  return headings
}

function generateYaml(headings, filename) {
  const lines = [
    `source: "${filename}"`,
    `converted_at: "${new Date().toISOString()}"`,
    `converter: htmlConverter`,
    `total_headings: ${headings.length}`,
    'headings:',
    ...headings.map((h) => `  - level: ${h.level}\n    text: "${h.text}"`),
  ]
  return lines.join('\n')
}

function splitByHeadings(content) {
  const sections = content.split(/^(?=#{1,2} )/m).filter(Boolean)
  return sections.map((section) => {
    const firstLine = section.split('\n')[0]
    const title = firstLine.replace(/^#+\s*/, '').trim() || 'Content'
    return {
      title,
      content: section.trim(),
      filename:
        title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') +
        '.md',
    }
  })
}
