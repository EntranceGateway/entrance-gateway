'use client'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const parseMarkdown = (markdown: string): string => {
    let html = markdown

    // 1. Code blocks (preserve content) - must be first
    const codeBlocks: string[] = []
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
      const language = lang ? `<span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">${lang}</span>` : ''
      codeBlocks.push(`<div class="bg-gray-900 rounded-lg overflow-hidden my-6 shadow-md">${language ? `<div class="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">${language}</div>` : ''}<pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-gray-100 leading-relaxed">${escapeHtml(code.trim())}</code></pre></div>`)
      return placeholder
    })

    // 2. Inline code
    const inlineCodes: string[] = []
    html = html.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `__INLINE_CODE_${inlineCodes.length}__`
      inlineCodes.push(`<code class="bg-gray-100 text-red-600 px-2 py-0.5 rounded text-sm font-mono border border-gray-200">${escapeHtml(code)}</code>`)
      return placeholder
    })

    // 3. Tables
    const tables: string[] = []
    html = html.replace(/\n(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g, (_, header, separator, rows) => {
      const placeholder = `__TABLE_${tables.length}__`
      
      const headerCells = header.split('|').filter((c: string) => c.trim()).map((c: string) => 
        `<th class="px-4 py-3 text-left font-bold text-brand-navy border-b-2 border-brand-blue bg-gray-50">${c.trim()}</th>`
      ).join('')
      
      const rowsHtml = rows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => 
          `<td class="px-4 py-3 border-b border-gray-200 text-gray-700">${c.trim()}</td>`
        ).join('')
        return `<tr class="hover:bg-gray-50 transition-colors">${cells}</tr>`
      }).join('')
      
      tables.push(`\n<div class="overflow-x-auto my-8"><table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm"><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table></div>\n`)
      return placeholder
    })

    // 4. Headers with anchor links (remove {#id} syntax)
    html = html.replace(/^### (.*?)(?:\s*\{#[\w-]+\})?\s*$/gim, '\n<h3 class="text-xl font-semibold text-brand-blue mt-8 mb-3 border-b border-gray-200 pb-2">$1</h3>\n')
    html = html.replace(/^## (.*?)(?:\s*\{#[\w-]+\})?\s*$/gim, '\n<h2 class="text-2xl font-bold text-brand-navy mt-10 mb-4 tracking-tight border-b-2 border-brand-gold pb-2">$1</h2>\n')
    html = html.replace(/^# (.*?)(?:\s*\{#[\w-]+\})?\s*$/gim, '\n<h1 class="text-3xl font-bold text-brand-navy mt-12 mb-6 tracking-tight">$1</h1>\n')

    // 5. Horizontal rules
    html = html.replace(/^(---|\*\*\*)$/gim, '\n<hr class="my-10 border-t-2 border-gray-300" />\n')

    // 6. Blockquotes (including multi-line)
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-brand-gold bg-amber-50 pl-4 pr-4 py-3 italic text-gray-700 my-4 rounded-r">$1</blockquote>')

    // 7. Checkboxes
    html = html.replace(/^(□|☐)\s+(.+)$/gim, '<div class="flex items-start gap-2 mb-2 pl-4"><span class="text-gray-400 mt-0.5">☐</span><span class="text-gray-700">$2</span></div>')
    html = html.replace(/^(✅|✓)\s+(.+)$/gim, '<div class="flex items-start gap-2 mb-2 pl-4"><span class="text-green-600 mt-0.5 font-bold">✓</span><span class="text-gray-700">$2</span></div>')

    // 8. Unordered lists (including nested)
    html = html.replace(/^[\*\-]\s+(.+)$/gim, '<li class="mb-2 pl-2 text-gray-700">$1</li>')
    html = html.replace(/(<li class="mb-2 pl-2 text-gray-700">[\s\S]*?<\/li>)/g, '\n<ul class="list-disc list-outside ml-6 mb-6 space-y-1">$1</ul>\n')

    // 9. Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gim, '<li class="mb-2 pl-2 text-gray-700">$1</li>')
    
    // 10. Bold (must be before italic)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900">$1</strong>')

    // 11. Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-800">$1</em>')

    // 12. Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
      const imageUrl = url.startsWith('http') ? url : `https://api.entrancegateway.com/api/v1/resources/${url}`
      return `\n<img src="${imageUrl}" alt="${escapeHtml(alt)}" class="w-full h-auto rounded-lg my-8 shadow-md border border-gray-200" />\n`
    })

    // 13. Links (including anchor links)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      let href = url
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('#')) {
        href = `https://${url}`
      }
      const target = url.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'
      return `<a href="${href}" class="text-brand-blue hover:text-brand-navy underline decoration-2 underline-offset-2 transition-colors font-medium" ${target}>${text}</a>`
    })

    // 14. Split by double newlines to create paragraphs (before restoring code blocks)
    const blocks = html.split(/\n\n+/)
    html = blocks
      .map(block => {
        block = block.trim()
        if (!block) return ''
        
        // Don't wrap if already wrapped in block element or is a placeholder
        if (
          block.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|img|div|table)/) || 
          block.match(/__(CODE_BLOCK|TABLE|INLINE_CODE)_\d+__/)
        ) {
          return block
        }
        
        // Wrap text in paragraph
        return `<p class="text-gray-700 leading-relaxed mb-6 text-base">${block}</p>`
      })
      .filter(block => block)
      .join('\n')

    // 15. Restore tables (use global replace)
    tables.forEach((table, index) => {
      html = html.replace(new RegExp(`__TABLE_${index}__`, 'g'), table)
    })

    // 16. Restore code blocks (use global replace)
    codeBlocks.forEach((block, index) => {
      html = html.replace(new RegExp(`__CODE_BLOCK_${index}__`, 'g'), block)
    })

    // 17. Restore inline codes (use global replace)
    inlineCodes.forEach((code, index) => {
      html = html.replace(new RegExp(`__INLINE_CODE_${index}__`, 'g'), code)
    })

    return html
  }

  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  const htmlContent = parseMarkdown(content)

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
