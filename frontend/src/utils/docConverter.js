import mammoth from 'mammoth'
import TurndownService from 'turndown'
import JSZip from 'jszip'
import yaml from 'js-yaml'
import { postProcess } from "./markdownPostProcessor";

/**
 * Document Converter Utility
 * Converts DOCX files to Markdown with images, metadata, and split documents
 */

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

// Custom rules for better markdown output
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~~${content}~~`,
})

// Smooth progress animation helper
async function animateProgress(onProgress, step, fromPercent, toPercent, message, duration = 300) {
  const steps = 10
  const increment = (toPercent - fromPercent) / steps
  const delay = duration / steps
  
  for (let i = 0; i <= steps; i++) {
    const current = Math.round(fromPercent + (increment * i))
    onProgress(step, current, message)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

/**
 * Main conversion function - orchestrates the entire conversion process
 * @param {File} file - The DOCX file to convert
 * @param {Function} onProgress - Progress callback (step, percentage, message)
 * @returns {Promise<Object>} - Conversion result with all generated files
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
    // Step 1: Convert DOCX to HTML with images
    await animateProgress(onProgress, 'extracting', 0, 10, 'Extracting document content...', 200)
    const { html, images } = await extractDocxContent(file)
    result.images = images
    result.stats.totalImages = images.length
    await animateProgress(onProgress, 'extracting', 10, 25, 'Content extracted...', 150)

    // Step 2: Convert HTML to Markdown
    await animateProgress(onProgress, 'converting', 25, 30, 'Converting to Markdown...', 100)
    result.markdown = turndownService.turndown(html)
    await animateProgress(onProgress, 'converting', 30, 45, 'Markdown generated...', 200)

    // Step 3: Clean the Markdown
    await animateProgress(onProgress, 'cleaning', 45, 50, 'Cleaning formatting...', 100)
    result.cleanedMarkdown = postProcess(
      result.markdown,
      file.name,
    ).cleanedMarkdown;
    await animateProgress(onProgress, 'cleaning', 50, 65, 'Formatting complete...', 200)

    // Step 4: Parse headings and generate YAML
    await animateProgress(onProgress, 'metadata', 65, 70, 'Generating metadata...', 100)
    const headings = parseHeadings(result.cleanedMarkdown)
    result.stats.totalHeadings = headings.length
    result.yamlContent = generateYaml(headings, file.name)
    await animateProgress(onProgress, 'metadata', 70, 80, 'Metadata ready...', 150)

    // Step 5: Split document by headings
    await animateProgress(onProgress, 'splitting', 80, 85, 'Splitting sections...', 100)
    result.splitDocs = splitByHeadings(result.cleanedMarkdown)
    result.stats.totalSections = result.splitDocs.length
    await animateProgress(onProgress, 'splitting', 85, 95, 'Sections created...', 200)

    // Complete
    await animateProgress(onProgress, 'complete', 95, 100, 'Conversion complete!', 150)
    return result
  } catch (error) {
    console.error('Conversion error:', error)
    throw new Error(`Conversion failed: ${error.message}`)
  }
}

/**
 * Extract content from DOCX using mammoth
 */
async function extractDocxContent(file) {
  const arrayBuffer = await file.arrayBuffer()
  const images = []
  let imageIndex = 1

  const options = {
    convertImage: mammoth.images.imgElement((image) => {
      return image.read('base64').then((imageData) => {
        const extension = image.contentType.split('/')[1] || 'png'
        const filename = `image${imageIndex}.${extension}`
        images.push({
          filename,
          data: imageData,
          contentType: image.contentType,
        })
        imageIndex++
        return { src: `media/${filename}` }
      })
    }),
  }

  const result = await mammoth.convertToHtml({ arrayBuffer }, options)
  return { html: result.value, images }
}

/**
 * Clean markdown content (ported from Python script)
 */
function cleanMarkdown(content, imageCount) {
  let cleaned = content

  // Replace backslashes with forward slashes
  cleaned = cleaned.replace(/\\/g, '/')

  // Replace double slashes with single
  cleaned = cleaned.replace(/\/\//g, '/')

  // Remove leading '>' from lines (blockquotes cleanup)
  cleaned = cleaned.replace(/^> ?/gm, '')

  // Remove Word underline artifacts
  cleaned = cleaned.replace(/\{\.underline\}/g, '')

  // Fix double brackets
  cleaned = cleaned.replace(/\[\[/g, '[')

  // Clean up list formatting
  cleaned = cleaned.replace(/-   /g, '- ')

  // Remove empty HTML comments
  cleaned = cleaned.replace(/\n<!-- -->\n\n/g, '')
  cleaned = cleaned.replace(/<!-- -->/g, '')

  // Remove unnecessary linebreaks
  cleaned = cleaned.replace(/\n   /g, '')

  // Remove dimension attributes
  cleaned = cleaned.replace(/\{width="[\d.]+in"\s*height="[\d.]+in"\}/g, '')
  cleaned = cleaned.replace(/height="[\d.]+in"\}\n/g, '')

  // Clean up image references - renumber them
  let imgIndex = 1
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, () => {
    const newRef = `![alt text](media/image${imgIndex}.png)`
    imgIndex++
    return newRef
  })

  // Remove lines starting with "Files/"
  cleaned = cleaned
    .split('\n')
    .filter((line) => !line.startsWith('Files/'))
    .join('\n')

  // Clean up multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  return cleaned.trim()
}

/**
 * Parse headings from markdown content
 */
function parseHeadings(content) {
  const headingPattern = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match

  while ((match = headingPattern.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      filename: generateFilename(match[2].trim()),
    })
  }

  return headings
}

/**
 * Generate filename from heading text
 */
function generateFilename(heading) {
  return (
    heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '.md'
  )
}

/**
 * Generate YAML metadata file (based on Python script)
 */
function generateYaml(headings, originalFilename) {
  const productName = originalFilename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')

  // Build navigation structure from level-1 headings
  const nav = {}
  headings
    .filter((h) => h.level === 1)
    .forEach((h) => {
      nav[h.text] = h.filename
    })

  const yamlData = {
    site_name: `${productName} Online Help`,
    copyright: `© Siemens ${new Date().getFullYear()}`,
    ft_options: {
      copy_button_on_content_code: false,
      nav_mapping: 'first_heading_as_page',
    },
    ft_metadata: {
      'ft:title': `${productName} Online Help`,
      'ft:clusterId': productName.toLowerCase().replace(/\s+/g, '-') + '-online-help',
      Region: ['Americas', 'Global (without Americas)'],
      language: 'en-US',
      Asset_ID: '<ENTER_ID>',
      Download_No: '<ENTER_ID>',
      Publication_Deep_Link: '<ENTER_ID>',
      Author: 'ENTER_AUTHOR',
      File_type: 'md',
      'ft:lastEdition': new Date().toISOString().split('T')[0],
      Publication_version: 'ENTER_QUARTER',
      Document_ID: '<ENTER_DOC_ID>',
      ProductName: productName,
      ProductType: 'Building X',
      Content_type: 'Online Help',
      Assortment: ['AVA0267'],
      Security: 'Extranet',
      SID_Access_Allocation: 'Extranet_BA-HQ',
    },
    nav: Object.keys(nav).length > 0 ? nav : { 'Getting Started': 'index.md' },
    markdown_extensions: [
      'admonition',
      'abbr',
      'tables',
      'footnotes',
      'pymdownx.details',
      'pymdownx.caret',
      'pymdownx.tilde',
    ],
  }

  return yaml.dump(yamlData, { indent: 2, lineWidth: -1 })
}

/**
 * Split markdown by headings into separate files
 */
function splitByHeadings(content) {
  const lines = content.split('\n')
  const sections = []
  let currentHeading = null
  let currentContent = []

  const saveSection = () => {
    if (currentHeading) {
      sections.push({
        heading: currentHeading,
        filename: generateFilename(currentHeading),
        content: currentContent.join('\n').trim(),
      })
    }
  }

  for (const line of lines) {
    // Check for heading (# to ####)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      saveSection()
      currentHeading = headingMatch[2].trim()
      currentContent = [line]
    } else {
      currentContent.push(line)
    }
  }

  // Save last section
  saveSection()

  return sections
}

/**
 * Create a ZIP file with all converted content
 */
export async function createDownloadZip(conversionResult, originalFilename) {
  const zip = new JSZip()
  const baseName = originalFilename.replace(/\.[^/.]+$/, '')

  // Add main markdown file
  zip.file(`${baseName}.md`, conversionResult.cleanedMarkdown)

  // Add YAML file
  zip.file('mkdocs.yml', conversionResult.yamlContent)

  // Add split documents in docs folder
  const docsFolder = zip.folder('docs')
  conversionResult.splitDocs.forEach((doc) => {
    docsFolder.file(doc.filename, doc.content)
  })

  // Add images in media folder
  if (conversionResult.images.length > 0) {
    const mediaFolder = zip.folder('media')
    conversionResult.images.forEach((img) => {
      // Convert base64 to binary
      const binaryData = atob(img.data)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }
      mediaFolder.file(img.filename, bytes)
    })
  }

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob' })
  return blob
}

/**
 * Download the ZIP file
 */
export function downloadZip(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
