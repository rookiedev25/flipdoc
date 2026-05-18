import TurndownService from 'turndown'
import yaml from 'js-yaml'
import { postProcess } from './markdownPostProcessor'

/**
 * TXT Converter Utility
 * Converts plain text files to Markdown with metadata and section splits
 */

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
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
 * @param {File} file - The TXT file to convert
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
    await animateProgress(onProgress, 'extracting', 0, 20, 'Reading text file...', 200)
    const text = await file.text()

    await animateProgress(onProgress, 'converting', 20, 45, 'Converting to Markdown...', 200)
    result.markdown = convertTextToMarkdown(text)

    await animateProgress(onProgress, 'cleaning', 45, 65, 'Cleaning formatting...', 200)
    result.cleanedMarkdown = postProcess(result.markdown, file.name).cleanedMarkdown

    await animateProgress(onProgress, 'metadata', 65, 80, 'Generating metadata...', 150)
    const headings = parseHeadings(result.cleanedMarkdown)
    result.stats.totalHeadings = headings.length
    result.yamlContent = generateYaml(headings, file.name)

    await animateProgress(onProgress, 'splitting', 80, 95, 'Splitting sections...', 150)
    result.splitDocs = splitByHeadings(result.cleanedMarkdown)
    result.stats.totalSections = result.splitDocs.length

    await animateProgress(onProgress, 'complete', 95, 100, 'Conversion complete!', 100)
    return result
  } catch (error) {
    console.error('TXT conversion error:', error)
    throw new Error(`Conversion failed: ${error.message}`)
  }
}

/**
 * Convert plain text to Markdown
 * Detection priority:
 *  1. Setext headings (=== / --- underlines)
 *  2. Document title — first short non-punctuated line becomes H1
 *  3. ALL CAPS short lines → H2
 *  4. Numbered sections (1. / 1.1) → H2 / H3
 *  5. Short lines ending with ':' → H3
 *  6. Existing list markers (-, *, •) → preserved as GFM list items
 */
function convertTextToMarkdown(text) {
  const lines = text.split('\n')
  const output = []
  let foundFirstHeading = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const nextTrimmed = (lines[i + 1] || '').trim()

    if (!trimmed) {
      output.push('')
      continue
    }

    // Setext H1: line followed by ===...
    if (nextTrimmed && /^={3,}$/.test(nextTrimmed)) {
      output.push(`# ${trimmed}`)
      i++ // skip underline
      foundFirstHeading = true
      continue
    }

    // Setext H2: line followed by ---...
    if (nextTrimmed && /^-{3,}$/.test(nextTrimmed) && trimmed.length < 80) {
      output.push(`## ${trimmed}`)
      i++ // skip underline
      foundFirstHeading = true
      continue
    }

    // Document title: first short, non-sentence-ending line → H1
    if (!foundFirstHeading && trimmed.length < 80 && !/[.?!,;]$/.test(trimmed)) {
      output.push(`# ${trimmed}`)
      foundFirstHeading = true
      continue
    }

    // ALL CAPS short line → H2
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length < 60 &&
      /[A-Z]/.test(trimmed) &&
      !/^\d/.test(trimmed)
    ) {
      output.push(`## ${trimmed}`)
      continue
    }

    // Numbered section like "1. Introduction" or "1.1 Overview"
    if (/^\d+(\.\d+)*[\s.]\s*[A-Za-z]/.test(trimmed) && trimmed.length < 80) {
      const depth = (trimmed.match(/\./g) || []).length
      output.push(`${'#'.repeat(depth === 0 ? 2 : 3)} ${trimmed}`)
      continue
    }

    // Short line ending with ':' → H3 label
    if (trimmed.endsWith(':') && trimmed.length < 50 && i < lines.length - 1) {
      output.push(`### ${trimmed.slice(0, -1)}`)
      continue
    }

    // Existing list markers → GFM bullets
    if (/^[-*+•]\s+/.test(trimmed)) {
      output.push(`- ${trimmed.replace(/^[-*+•]\s+/, '')}`)
      continue
    }

    output.push(line)
  }

  return output.join('\n')
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

function generateYaml(headings, filename) {
  return yaml.dump({
    source: filename,
    converted_at: new Date().toISOString(),
    converter: 'txtConverter',
    total_headings: headings.length,
    headings: headings.map((h) => ({ level: h.level, text: h.text })),
  })
}

function splitByHeadings(content) {
  const sections = content.split(/^(?=#{1,2} )/m).filter(Boolean)
  return sections.map((section) => {
    const firstLine = section.split('\n')[0]
    const title = firstLine.replace(/^#+\s*/, '').trim() || 'Introduction'
    return {
      title,
      content: section.trim(),
      filename: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md',
    }
  })
}
