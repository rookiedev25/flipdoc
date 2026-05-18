/**
 * Docs-as-Code Post-Processor
 *
 * Applies Docs-as-Code standards to any raw markdown string:
 *  1. Strips Word/PDF conversion artifacts
 *  2. Normalises heading hierarchy (no skipped levels, exactly one H1)
 *  3. Adds YAML frontmatter (title, date, source file)
 *  4. Enriches image alt text with figure numbers
 *  5. Enforces blank lines before/after headings & fenced code blocks (GFM spec)
 *  6. Collapses 3+ consecutive blank lines → 2
 */

// ---------------------------------------------------------------------------
// 1. Artifact Cleanup  (replaces per-converter cleanMarkdown functions)
// ---------------------------------------------------------------------------
function stripArtifacts(md) {
  return md
    .replace(/\\/g, '/')                          // backslash → forward slash
    .replace(/\/\//g, '/')                         // double slash → single
    .replace(/^> ?/gm, '')                         // strip blockquote markers
    .replace(/\{\.underline\}/g, '')               // Word underline artifacts
    .replace(/\[\[/g, '[')                         // double brackets
    .replace(/-   /g, '- ')                        // list indent normalisation
    .replace(/<!-- -->/g, '')                      // empty HTML comments
    .replace(/\n   /g, '\n')                       // hanging indents
    .replace(/\{width="[\d.]+in"\s*height="[\d.]+in"\}/g, '')  // Word image dims
    .replace(/height="[\d.]+in"\}\n/g, '')
    .split('\n')
    .filter(line => !line.startsWith('Files/'))   // ghost file-path lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')                   // max 2 consecutive blank lines
    .trim()
}

// ---------------------------------------------------------------------------
// 2. Heading Hierarchy Normalisation
//    - Ensures the first heading is always H1
//    - Removes level-skips (e.g. H1 → H3 becomes H1 → H2)
// ---------------------------------------------------------------------------
function normaliseHeadings(md) {
  const lines = md.split('\n')
  let firstHeadingLevel = null

  // Find the minimum heading level present
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s/)
    if (m) {
      const level = m[1].length
      if (firstHeadingLevel === null || level < firstHeadingLevel) {
        firstHeadingLevel = level
      }
    }
  }

  if (firstHeadingLevel === null) return md  // no headings — nothing to do

  const shift = firstHeadingLevel - 1  // number of levels to shift up

  if (shift === 0) {
    // Headings start at H1 — still need to fix skipped levels
    return fixSkippedLevels(lines).join('\n')
  }

  // Shift all headings up so the shallowest becomes H1
  const shifted = lines.map(line => {
    const m = line.match(/^(#{1,6})(\s.+)$/)
    if (!m) return line
    const newLevel = Math.max(1, m[1].length - shift)
    return '#'.repeat(newLevel) + m[2]
  })

  return fixSkippedLevels(shifted).join('\n')
}

function fixSkippedLevels(lines) {
  let prevLevel = 0
  return lines.map(line => {
    const m = line.match(/^(#{1,6})(\s.+)$/)
    if (!m) return line
    const currentLevel = m[1].length
    // Allow going deeper only one level at a time
    const allowed = prevLevel === 0 ? 1 : Math.min(currentLevel, prevLevel + 1)
    prevLevel = allowed
    return '#'.repeat(allowed) + m[2]
  })
}

// ---------------------------------------------------------------------------
// 3. Image Alt Text Enrichment
//    Replaces generic "alt text" with "Figure N" labels
// ---------------------------------------------------------------------------
function enrichImageAltText(md) {
  let figureIndex = 1
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
    const label = alt && alt.trim() && alt.trim().toLowerCase() !== 'alt text'
      ? alt.trim()
      : `Figure ${figureIndex}`
    figureIndex++
    return `![${label}](${src})`
  })
}

// ---------------------------------------------------------------------------
// 4. GFM Blank-Line Enforcement
//    Headings and fenced code blocks must be surrounded by blank lines
// ---------------------------------------------------------------------------
function enforceGfmSpacing(md) {
  const lines = md.split('\n')
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const prev = out[out.length - 1] ?? ''
    const isHeading = /^#{1,6}\s/.test(line)
    const isFence  = /^```/.test(line)

    if ((isHeading || isFence) && prev !== '' && prev !== undefined) {
      out.push('')  // blank line before
    }

    out.push(line)

    if (isHeading && lines[i + 1] !== '') {
      out.push('')  // blank line after heading
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ---------------------------------------------------------------------------
// 5. YAML Frontmatter
// ---------------------------------------------------------------------------
function buildFrontmatter(filename, markdown) {
  const title = extractTitle(markdown, filename)
  const today = new Date().toISOString().split('T')[0]
  const ext = filename.split('.').pop().toLowerCase()
  const sourceType = {
    docx: 'Word Document',
    doc:  'Word Document',
    pdf:  'PDF',
    ppt:  'PowerPoint',
    pptx: 'PowerPoint',
    txt:  'Plain Text',
  }[ext] || 'Document'

  return [
    '---',
    `title: "${title}"`,
    `date: "${today}"`,
    `source: "${filename}"`,
    `source_type: "${sourceType}"`,
    `generated_by: "FlipDoc"`,
    '---',
    '',
  ].join('\n')
}

function extractTitle(markdown, filename) {
  const h1 = markdown.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Apply full Docs-as-Code post-processing to raw markdown.
 *
 * @param {string} rawMarkdown   - Markdown string from any converter
 * @param {string} filename      - Original source filename (e.g. "report.pdf")
 * @returns {{ cleanedMarkdown: string }}
 */
export function postProcess(rawMarkdown, filename) {
  let md = stripArtifacts(rawMarkdown)
  md = normaliseHeadings(md)
  md = enrichImageAltText(md)
  md = enforceGfmSpacing(md)

  const frontmatter = buildFrontmatter(filename, md)
  const cleanedMarkdown = frontmatter + md

  return { cleanedMarkdown }
}
