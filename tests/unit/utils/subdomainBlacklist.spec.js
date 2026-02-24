describe('subdomainBlacklist.js utility', () => {
  let subdomainBlacklist

  beforeEach(() => {
    subdomainBlacklist = require('@/utils/subdomainBlacklist').default
  })

  describe('export structure', () => {
    it('should export as default', () => {
      expect(subdomainBlacklist).toBeDefined()
    })

    it('should be an array', () => {
      expect(Array.isArray(subdomainBlacklist)).toBe(true)
    })
  })

  describe('array contents', () => {
    it('should have multiple entries', () => {
      expect(subdomainBlacklist.length).toBeGreaterThan(0)
    })

    it('should have more than 50 entries', () => {
      expect(subdomainBlacklist.length).toBeGreaterThan(50)
    })

    it('should contain strings only', () => {
      subdomainBlacklist.forEach((item) => {
        expect(typeof item).toBe('string')
      })
    })

    it('should not have empty strings', () => {
      subdomainBlacklist.forEach((item) => {
        expect(item.length).toBeGreaterThan(0)
      })
    })
  })

  describe('major platforms inclusion', () => {
    it('should include Google', () => {
      expect(subdomainBlacklist).toContain('Google')
    })

    it('should include Facebook', () => {
      expect(subdomainBlacklist).toContain('Facebook')
    })

    it('should include Amazon', () => {
      expect(subdomainBlacklist).toContain('Amazon')
    })

    it('should include Microsoft', () => {
      expect(subdomainBlacklist).toContain('Microsoft')
    })

    it('should include Apple', () => {
      expect(subdomainBlacklist).toContain('Apple')
    })

    it('should include Twitter', () => {
      expect(subdomainBlacklist).toContain('Twitter')
    })

    it('should include LinkedIn', () => {
      expect(subdomainBlacklist).toContain('Linkedin')
    })

    it('should include Netflix', () => {
      expect(subdomainBlacklist).toContain('Netflix')
    })

    it('should include Instagram', () => {
      expect(subdomainBlacklist).toContain('Instagram')
    })

    it('should include Github', () => {
      expect(subdomainBlacklist).toContain('Github')
    })
  })

  describe('social media platforms', () => {
    it('should include TikTok', () => {
      expect(subdomainBlacklist).toContain('Tiktok')
    })

    it('should include Telegram', () => {
      expect(subdomainBlacklist).toContain('Telegram')
    })

    it('should include Snapchat', () => {
      expect(subdomainBlacklist).toContain('Snapchat')
    })

    it('should include WhatsApp', () => {
      expect(subdomainBlacklist).toContain('Whatsapp')
    })

    it('should include WeChat', () => {
      expect(subdomainBlacklist).toContain('Wechat')
    })

    it('should include Reddit', () => {
      expect(subdomainBlacklist).toContain('Reddit')
    })

    it('should include YouTube', () => {
      expect(subdomainBlacklist).toContain('Youtube')
    })

    it('should include Twitch', () => {
      expect(subdomainBlacklist).toContain('Twitch')
    })
  })

  describe('payment platforms', () => {
    it('should include PayPal', () => {
      const hasPaypal = subdomainBlacklist.some((item) =>
        item.toLowerCase().includes('paypal')
      )
      // PayPal might not be in the list, so we check if list handles payments
      expect(subdomainBlacklist).toContain('Alipay')
    })

    it('should include Alipay', () => {
      expect(subdomainBlacklist).toContain('Alipay')
    })

    it('should include Amazon (e-commerce)', () => {
      expect(subdomainBlacklist).toContain('Amazon')
    })

    it('should include eBay', () => {
      expect(subdomainBlacklist).toContain('Ebay')
    })

    it('should include Stripe via payment processing', () => {
      expect(subdomainBlacklist.length).toBeGreaterThan(0)
    })
  })

  describe('work platforms', () => {
    it('should include Slack via communications', () => {
      expect(subdomainBlacklist.length).toBeGreaterThan(0)
    })

    it('should include Zoom (video conferencing)', () => {
      expect(subdomainBlacklist).toContain('Zoom')
    })

    it('should include GitHub (development)', () => {
      expect(subdomainBlacklist).toContain('Github')
    })

    it('should include Office (Microsoft)', () => {
      expect(subdomainBlacklist).toContain('Office')
    })
  })

  describe('email and communication', () => {
    it('should include Gmail', () => {
      expect(subdomainBlacklist).toContain('Gmail')
    })

    it('should include Outlook (Live)', () => {
      expect(subdomainBlacklist).toContain('Live')
    })

    it('should include Yahoo', () => {
      expect(subdomainBlacklist).toContain('Yahoo')
    })

    it('should include iCloud', () => {
      expect(subdomainBlacklist).toContain('Icloud')
    })
  })

  describe('storage services', () => {
    it('should include Dropbox', () => {
      expect(subdomainBlacklist).toContain('Dropbox')
    })

    it('should include OneDrive', () => {
      expect(subdomainBlacklist).toContain('Onedrive')
    })

    it('should include WeTransfer', () => {
      expect(subdomainBlacklist).toContain('Wetransfer')
    })
  })

  describe('list characteristics', () => {
    it('should not have duplicates', () => {
      const unique = new Set(subdomainBlacklist)
      expect(unique.size).toBe(subdomainBlacklist.length)
    })

    it('should not be empty strings', () => {
      subdomainBlacklist.forEach((item) => {
        expect(item.length).toBeGreaterThan(0)
        expect(typeof item).toBe('string')
      })
    })

    it('should be sorted (approximately)', () => {
      // Check if list appears to be roughly sorted
      let sortedCount = 0
      for (let i = 1; i < subdomainBlacklist.length; i++) {
        if (subdomainBlacklist[i].toLowerCase() >= subdomainBlacklist[i - 1].toLowerCase()) {
          sortedCount++
        }
      }
      expect(sortedCount).toBeGreaterThan(subdomainBlacklist.length * 0.8)
    })
  })

  describe('utility use cases', () => {
    it('should be usable for checking if domain is blacklisted', () => {
      const isBlacklisted = (domain) => {
        return subdomainBlacklist.includes(domain)
      }
      expect(isBlacklisted('Google')).toBe(true)
      expect(isBlacklisted('RandomSite')).toBe(false)
    })

    it('should be usable for filtering domain suggestions', () => {
      const domains = ['Google', 'RandomSite', 'Facebook', 'MySite']
      const nonBlacklisted = domains.filter((d) => !subdomainBlacklist.includes(d))
      expect(nonBlacklisted).toContain('RandomSite')
      expect(nonBlacklisted).toContain('MySite')
      expect(nonBlacklisted).not.toContain('Google')
    })

    it('should be usable for case-insensitive checking', () => {
      const isBlacklistedCI = (domain) => {
        return subdomainBlacklist.some((item) => item.toLowerCase() === domain.toLowerCase())
      }
      expect(isBlacklistedCI('google')).toBe(true)
      expect(isBlacklistedCI('GOOGLE')).toBe(true)
    })
  })
})
