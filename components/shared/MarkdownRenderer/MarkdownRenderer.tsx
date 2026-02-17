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
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push(`<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono text-gray-800">${escapeHtml(code.trim())}</code></pre>`)
      return placeholder
    })

    // 2. Inline code
    const inlineCodes: string[] = []
    html = html.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `__INLINE_CODE_${inlineCodes.length}__`
      inlineCodes.push(`<code class="bg-gray-100 text-brand-blue px-1.5 py-0.5 rounded text-sm font-mono">${escapeHtml(code)}</code>`)
      return placeholder
    })

    // 3. Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-brand-blue mt-3 mb-1.5">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-brand-navy mt-4 mb-2 tracking-tight">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-brand-navy mt-5 mb-2.5 tracking-tight">$1</h1>')

    // 4. Horizontal rules
    html = html.replace(/^(---|\*\*\*)$/gim, '<hr class="my-8 border-t border-gray-200" />')

    // 5. Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-brand-gold pl-4 italic text-gray-600 my-4">$1</blockquote>')

    // 6. Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li class="mb-2 pl-2">$1</li>')
    html = html.replace(/(<li class="mb-2 pl-2">[\s\S]*?<\/li>)/g, '<ul class="list-disc list-outside ml-6 mb-6 text-gray-700 leading-8">$1</ul>')

    // 7. Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="mb-2 pl-2">$1</li>')
    html = html.replace(/(<li class="mb-2 pl-2">[\s\S]*?<\/li>)/g, '<ol class="list-decimal list-outside ml-6 mb-6 text-gray-700 leading-8">$1</ol>')

    // 8. Bold (must be before italic)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900">$1</strong>')

    // 9. Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>')

    // 10. Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
      // If URL doesn't start with http, assume it's a resource ID
      const imageUrl = url.startsWith('http') ? url : `https://api.entrancegateway.com/api/v1/resources/${url}`
      return `<img src="${imageUrl}" alt="${escapeHtml(alt)}" class="w-full h-auto rounded-lg my-6 shadow-sm" />`
    })

    // 11. Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      // Add protocol if missing
      let href = url
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('#')) {
        href = `https://${url}`
      }
      return `<a href="${href}" class="text-brand-blue hover:text-brand-navy underline transition-colors" target="_blank" rel="noopener noreferrer">${text}</a>`
    })

    // 12. Line breaks (two spaces + newline or explicit \n)
    html = html.replace(/  \n/g, '<br />')
    html = html.replace(/\n/g, '<br />')

    // 13. Restore code blocks
    codeBlocks.forEach((block, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, block)
    })

    // 14. Restore inline codes
    inlineCodes.forEach((code, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, code)
    })

    // 15. Wrap in paragraphs (split by double line breaks)
    const paragraphs = html.split(/<br \/><br \/>/)
    html = paragraphs
      .map(p => {
        // Don't wrap if already wrapped in block element
        if (p.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|img)/)) {
          return p
        }
        return `<p class="text-gray-700 leading-8 mb-6">${p}</p>`
      })
      .join('')

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
