import React from 'react'
import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownRenderer } from '../components/shared/MarkdownRenderer/MarkdownRenderer'

test('Markdown keeps formatting while blocking stored HTML and unsafe links', () => {
  const html = renderToStaticMarkup(<MarkdownRenderer content={'# Title\n\n**bold**\n\n<img src=x onerror=alert(1)>\n\n<script>alert(1)</script>\n\n[bad](javascript:alert)'} />)
  assert.match(html, /<h1/); assert.match(html, /<strong>bold<\/strong>/)
  assert.doesNotMatch(html, /<script|onerror=|javascript:|<img/i)
})
