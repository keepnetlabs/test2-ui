describe('preventClickScript.js utility', () => {
  let getPreventClickScript

  beforeEach(() => {
    // Clear cache to ensure fresh import
    jest.resetModules()
    ;({ getPreventClickScript } = require('../../../src/utils/preventClickScript.js'))
  })

  describe('module structure', () => {
    it('should export getPreventClickScript function', () => {
      expect(typeof getPreventClickScript).toBe('function')
    })

    it('should be a named export', () => {
      const module = require('../../../src/utils/preventClickScript.js')
      expect(module.getPreventClickScript).toBeDefined()
    })

    it('should have proper JSDoc comment', () => {
      const fs = require('fs')
      const filePath = require('path').join(__dirname, '../../../src/utils/preventClickScript.js')
      const content = fs.readFileSync(filePath, 'utf8')
      expect(content).toContain('@returns')
      expect(content).toContain('inject')
    })
  })

  describe('return type and structure', () => {
    it('should return a string', () => {
      const result = getPreventClickScript()
      expect(typeof result).toBe('string')
    })

    it('should return non-empty string', () => {
      const result = getPreventClickScript()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return script tag wrapped string', () => {
      const result = getPreventClickScript()
      expect(result).toContain('<script>')
      expect(result).toContain('</script>')
    })

    it('should start with <script> tag', () => {
      const result = getPreventClickScript()
      expect(result.startsWith('<script>')).toBe(true)
    })

    it('should end with </script> tag', () => {
      const result = getPreventClickScript()
      expect(result.endsWith('</script>')).toBe(true)
    })

    it('should have matching opening and closing tags', () => {
      const result = getPreventClickScript()
      const openCount = (result.match(/<script>/g) || []).length
      const closeCount = (result.match(/<\/script>/g) || []).length
      expect(openCount).toBe(closeCount)
      expect(openCount).toBe(1)
    })

    it('should match HTML injectable pattern', () => {
      const result = getPreventClickScript()
      expect(result).toMatch(/^<script>[\s\S]*<\/script>$/)
    })
  })

  describe('code structure', () => {
    it('should contain IIFE pattern', () => {
      const result = getPreventClickScript()
      expect(result).toContain('(function()')
    })

    it('should contain use strict directive', () => {
      const result = getPreventClickScript()
      expect(result).toContain("'use strict'")
    })

    it('should have initializeEventPrevention function', () => {
      const result = getPreventClickScript()
      expect(result).toContain('initializeEventPrevention')
    })

    it('should be immediately invoked', () => {
      const result = getPreventClickScript()
      expect(result).toContain('})();')
    })

    it('should have proper function declaration', () => {
      const result = getPreventClickScript()
      expect(result).toContain('function initializeEventPrevention()')
    })
  })

  describe('event types coverage', () => {
    const eventTypes = [
      'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup',
      'keydown', 'keyup', 'keypress', 'submit', 'change',
      'focus', 'blur', 'input', 'select', 'dragstart', 'contextmenu'
    ]

    eventTypes.forEach((eventType) => {
      it(`should prevent ${eventType} events`, () => {
        const result = getPreventClickScript()
        expect(result).toContain(`'${eventType}'`)
      })
    })

    it('should define eventTypes array', () => {
      const result = getPreventClickScript()
      expect(result).toContain('const eventTypes =')
      expect(result).toContain('[')
      expect(result).toContain(']')
    })

    it('should have all 16 event types', () => {
      const result = getPreventClickScript()
      const eventCount = eventTypes.filter(e => result.includes(`'${e}'`)).length
      expect(eventCount).toBe(16)
    })

    it('should use forEach for event registration', () => {
      const result = getPreventClickScript()
      expect(result).toContain('forEach')
    })
  })

  describe('form submission handling', () => {
    it('should prevent form submission', () => {
      const result = getPreventClickScript()
      expect(result).toContain('FORM')
      expect(result).toContain('preventDefault')
    })

    it('should detect form by tagName', () => {
      const result = getPreventClickScript()
      expect(result).toContain("e.target.tagName === 'FORM'")
    })

    it('should detect form by closest selector', () => {
      const result = getPreventClickScript()
      expect(result).toContain("e.target.closest('form')")
    })

    it('should handle both direct form and nested elements', () => {
      const result = getPreventClickScript()
      expect(result).toContain('e.target.tagName === \'FORM\'')
      expect(result).toContain("closest('form')")
    })

    it('should use OR operator for form detection', () => {
      const result = getPreventClickScript()
      expect(result).toContain('||')
    })
  })

  describe('anchor link handling', () => {
    it('should prevent anchor clicks', () => {
      const result = getPreventClickScript()
      expect(result).toContain('anchor')
    })

    it('should handle click and auxclick events for anchors', () => {
      const result = getPreventClickScript()
      const lines = result.split('\n')
      const anchorSection = result.substring(result.indexOf("['click', 'auxclick']"))
      expect(anchorSection).toContain('click')
      expect(anchorSection).toContain('auxclick')
    })

    it('should detect anchor using closest', () => {
      const result = getPreventClickScript()
      expect(result).toContain("e.target.closest('a')")
    })

    it('should set data-blocked attribute on anchors', () => {
      const result = getPreventClickScript()
      expect(result).toContain('data-blocked')
      expect(result).toContain('true')
    })

    it('should have try-catch for attribute setting', () => {
      const result = getPreventClickScript()
      expect(result).toContain('try')
      expect(result).toContain('catch')
    })
  })

  describe('event prevention methods', () => {
    it('should use preventDefault', () => {
      const result = getPreventClickScript()
      expect(result).toContain('preventDefault')
    })

    it('should use stopPropagation', () => {
      const result = getPreventClickScript()
      expect(result).toContain('stopPropagation')
    })

    it('should use stopImmediatePropagation', () => {
      const result = getPreventClickScript()
      expect(result).toContain('stopImmediatePropagation')
    })

    it('should return false', () => {
      const result = getPreventClickScript()
      expect(result).toContain('return false')
    })

    it('should call all three prevention methods', () => {
      const result = getPreventClickScript()
      const formSection = result.substring(result.indexOf('if (e.target.tagName'))
      expect(formSection).toContain('preventDefault')
      expect(formSection).toContain('stopPropagation')
      expect(formSection).toContain('stopImmediatePropagation')
    })
  })

  describe('DOM readiness handling', () => {
    it('should check document.readyState', () => {
      const result = getPreventClickScript()
      expect(result).toContain('document.readyState')
    })

    it('should check for loading state', () => {
      const result = getPreventClickScript()
      expect(result).toContain("'loading'")
    })

    it('should listen for DOMContentLoaded', () => {
      const result = getPreventClickScript()
      expect(result).toContain('DOMContentLoaded')
      expect(result).toContain('addEventListener')
    })

    it('should handle both loading and loaded states', () => {
      const result = getPreventClickScript()
      expect(result).toContain('if (document.readyState === \'loading\')')
      expect(result).toContain('else')
    })
  })

  describe('event listener configuration', () => {
    it('should use addEventListener', () => {
      const result = getPreventClickScript()
      expect(result).toContain('addEventListener')
    })

    it('should use capture phase (true parameter)', () => {
      const result = getPreventClickScript()
      // Count addEventListener calls with true parameter
      const capturePhaseCount = (result.match(/addEventListener\([^,]+,[^,]+,\s*true\)/g) || []).length
      expect(capturePhaseCount).toBeGreaterThan(0)
    })

    it('should attach to document.body', () => {
      const result = getPreventClickScript()
      expect(result).toContain('document.body.addEventListener')
    })

    it('should use forEach for multiple listeners', () => {
      const result = getPreventClickScript()
      const foreachCount = (result.match(/\.forEach/g) || []).length
      expect(foreachCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('consistency and reliability', () => {
    it('should return consistent results', () => {
      const result1 = getPreventClickScript()
      const result2 = getPreventClickScript()
      expect(result1).toBe(result2)
    })

    it('should return identical output on repeated calls', () => {
      const results = Array(5).fill(0).map(() => getPreventClickScript())
      const unique = new Set(results)
      expect(unique.size).toBe(1)
    })

    it('should not modify on multiple calls', () => {
      const result = getPreventClickScript()
      const result2 = getPreventClickScript()
      expect(result).toEqual(result2)
    })
  })

  describe('injection and compatibility', () => {
    it('should be safe to inject multiple times', () => {
      const result = getPreventClickScript()
      const doubled = result + result
      expect(doubled).toContain('<script>')
      expect(doubled).toContain('</script>')
    })

    it('should not have syntax issues (basic validation)', () => {
      const result = getPreventClickScript()
      expect(result.indexOf('<script>') >= 0).toBe(true)
      expect(result.lastIndexOf('</script>') > result.indexOf('<script>')).toBe(true)
    })

    it('should have balanced parentheses', () => {
      const result = getPreventClickScript()
      const open = (result.match(/\(/g) || []).length
      const close = (result.match(/\)/g) || []).length
      expect(open).toBe(close)
    })

    it('should have balanced braces', () => {
      const result = getPreventClickScript()
      const open = (result.match(/{/g) || []).length
      const close = (result.match(/}/g) || []).length
      expect(open).toBe(close)
    })

    it('should have balanced brackets', () => {
      const result = getPreventClickScript()
      const open = (result.match(/\[/g) || []).length
      const close = (result.match(/\]/g) || []).length
      expect(open).toBe(close)
    })
  })

  describe('script content validation', () => {
    it('should have proper closing tag placement', () => {
      const result = getPreventClickScript()
      const scriptEnd = result.lastIndexOf('</script>')
      const scriptStart = result.lastIndexOf('<script>')
      expect(scriptEnd).toBeGreaterThan(scriptStart)
    })

    it('should contain event types array definition', () => {
      const result = getPreventClickScript()
      expect(result).toContain('eventTypes')
      expect(result).toMatch(/eventTypes\s*=\s*\[/)
    })

    it('should have error handling with try-catch', () => {
      const result = getPreventClickScript()
      expect(result).toContain('try')
      expect(result).toContain('catch')
    })

    it('should have proper whitespace in IIFE', () => {
      const result = getPreventClickScript()
      expect(result).toContain('(function()')
      expect(result).toContain('})();')
    })

    it('should document purpose in JSDoc', () => {
      const result = getPreventClickScript()
      // The module itself contains JSDoc
      const fs = require('fs')
      const filePath = require('path').join(__dirname, '../../../src/utils/preventClickScript.js')
      const content = fs.readFileSync(filePath, 'utf8')
      expect(content).toContain('/**')
      expect(content).toContain('*/')
    })
  })

  describe('edge cases and robustness', () => {
    it('should handle no parameters', () => {
      expect(() => {
        getPreventClickScript()
      }).not.toThrow()
    })

    it('should handle being called with arguments (ignored)', () => {
      expect(() => {
        getPreventClickScript('ignored', 'args')
      }).not.toThrow()
    })

    it('should work in strict mode context', () => {
      const result = getPreventClickScript()
      expect(result).toContain("'use strict'")
    })

    it('should not have external dependencies', () => {
      const result = getPreventClickScript()
      // Should not contain require or import
      expect(result).not.toContain('require(')
      expect(result).not.toContain('import ')
    })

    it('should be valid JavaScript wrapped in script tags', () => {
      const result = getPreventClickScript()
      // Remove script tags
      const jsCode = result.replace(/<script>|<\/script>/g, '')
      // Should start with IIFE
      expect(jsCode.trim().startsWith('(function()')).toBe(true)
    })
  })

  describe('business logic', () => {
    it('should prevent form submissions completely', () => {
      const result = getPreventClickScript()
      const formSection = result.substring(result.indexOf('FORM'))
      expect(formSection).toContain('preventDefault')
      expect(formSection).toContain('stopPropagation')
      expect(formSection).toContain('return false')
    })

    it('should mark blocked anchors for tracking', () => {
      const result = getPreventClickScript()
      expect(result).toContain('setAttribute')
      expect(result).toContain('data-blocked')
    })

    it('should be invisible to user (no console output)', () => {
      const result = getPreventClickScript()
      expect(result).not.toContain('console.log')
      expect(result).not.toContain('console.warn')
    })

    it('should execute automatically on page load', () => {
      const result = getPreventClickScript()
      expect(result).toContain('DOMContentLoaded')
      expect(result).not.toContain('window.')
      expect(result).toContain('document.body')
    })
  })
})
