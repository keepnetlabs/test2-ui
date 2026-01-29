describe('preventClickScript.js utility', () => {
  describe('getPreventClickScript', () => {
    it('should export getPreventClickScript function', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      expect(typeof getPreventClickScript).toBe('function')
    })

    it('should return a string', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(typeof result).toBe('string')
    })

    it('should return script tag wrapped string', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('<script>')
      expect(result).toContain('</script>')
    })

    it('should start with <script> tag', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result.startsWith('<script>')).toBe(true)
    })

    it('should end with </script> tag', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result.endsWith('</script>')).toBe(true)
    })

    it('should contain IIFE pattern', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('(function()')
    })

    it('should contain use strict', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain("'use strict'")
    })

    it('should prevent click events', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('click')
    })

    it('should prevent form submit', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('submit')
    })

    it('should handle multiple event types', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('click')
      expect(result).toContain('keydown')
      expect(result).toContain('mousedown')
    })

    it('should prevent anchor links', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('anchor')
    })

    it('should use preventDefault', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('preventDefault')
    })

    it('should use stopPropagation', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('stopPropagation')
    })

    it('should handle DOMContentLoaded event', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('DOMContentLoaded')
    })

    it('should check document.readyState', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('document.readyState')
    })

    it('should have proper event handling', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('addEventListener')
    })

    it('should handle form detection', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('FORM')
      expect(result).toContain('tagName')
    })

    it('should return consistent results', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result1 = getPreventClickScript()
      const result2 = getPreventClickScript()
      expect(result1).toBe(result2)
    })

    it('should be injectable into HTML', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toMatch(/^<script>[\s\S]*<\/script>$/)
    })
  })

  describe('script content validation', () => {
    it('should have proper closing tag', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      const scriptEnd = result.lastIndexOf('</script>')
      const scriptStart = result.lastIndexOf('<script>')
      expect(scriptEnd).toBeGreaterThan(scriptStart)
    })

    it('should contain event types array', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('eventTypes')
    })

    it('should handle both click and auxclick', () => {
      const { getPreventClickScript } = require('../../../src/utils/preventClickScript.js')
      const result = getPreventClickScript()
      expect(result).toContain('auxclick')
    })
  })
})
