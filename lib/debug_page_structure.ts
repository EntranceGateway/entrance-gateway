export function debug_page_structure() {
  if (typeof document === 'undefined') {
    return { error: 'document is not available' }
  }

  const elements = Array.from(document.querySelectorAll('[data-role]'))

  return elements.map((element) => {
    const htmlElement = element as HTMLElement
    const style = window.getComputedStyle(htmlElement)

    return {
      tag: htmlElement.tagName.toLowerCase(),
      role: htmlElement.dataset.role || null,
      text: (htmlElement.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
      hiddenByClass: htmlElement.classList.contains('hidden') || htmlElement.classList.contains('opacity-0'),
      hiddenByStyle: style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0',
    }
  })
}

if (typeof window !== 'undefined') {
  ;(window as typeof window & { debug_page_structure?: typeof debug_page_structure }).debug_page_structure = debug_page_structure
}
