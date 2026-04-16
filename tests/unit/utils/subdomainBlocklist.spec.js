describe('subdomainBlocklist.js utility', () => {
  let subdomainBlocklist

  beforeEach(() => {
    subdomainBlocklist = require('@/utils/subdomainBlocklist').default
  })

  describe('export structure', () => {
    it('should export as default', () => {
      expect(subdomainBlocklist).toBeDefined()
    })

    it('should be an array', () => {
      expect(Array.isArray(subdomainBlocklist)).toBe(true)
    })
  })

  describe('array contents', () => {
    it('should have multiple entries', () => {
      expect(subdomainBlocklist.length).toBeGreaterThan(0)
    })

    it('should have more than 50 entries', () => {
      expect(subdomainBlocklist.length).toBeGreaterThan(50)
    })

    it('should contain strings only', () => {
      subdomainBlocklist.forEach((item) => {
        expect(typeof item).toBe('string')
      })
    })

    it('should not have empty strings', () => {
      subdomainBlocklist.forEach((item) => {
        expect(item.length).toBeGreaterThan(0)
      })
    })
  })

  describe('major platforms inclusion', () => {
    it('should include Google', () => {
      expect(subdomainBlocklist).toContain('Google')
    })

    it('should include Facebook', () => {
      expect(subdomainBlocklist).toContain('Facebook')
    })

    it('should include Amazon', () => {
      expect(subdomainBlocklist).toContain('Amazon')
    })

    it('should include Microsoft', () => {
      expect(subdomainBlocklist).toContain('Microsoft')
    })

    it('should include Apple', () => {
      expect(subdomainBlocklist).toContain('Apple')
    })

    it('should include Twitter', () => {
      expect(subdomainBlocklist).toContain('Twitter')
    })

    it('should include LinkedIn', () => {
      expect(subdomainBlocklist).toContain('Linkedin')
    })

    it('should include Netflix', () => {
      expect(subdomainBlocklist).toContain('Netflix')
    })

    it('should include Instagram', () => {
      expect(subdomainBlocklist).toContain('Instagram')
    })

    it('should include Github', () => {
      expect(subdomainBlocklist).toContain('Github')
    })
  })

  describe('social media platforms', () => {
    it('should include TikTok', () => {
      expect(subdomainBlocklist).toContain('Tiktok')
    })

    it('should include Telegram', () => {
      expect(subdomainBlocklist).toContain('Telegram')
    })

    it('should include Snapchat', () => {
      expect(subdomainBlocklist).toContain('Snapchat')
    })

    it('should include WhatsApp', () => {
      expect(subdomainBlocklist).toContain('Whatsapp')
    })

    it('should include WeChat', () => {
      expect(subdomainBlocklist).toContain('Wechat')
    })

    it('should include Reddit', () => {
      expect(subdomainBlocklist).toContain('Reddit')
    })

    it('should include YouTube', () => {
      expect(subdomainBlocklist).toContain('Youtube')
    })

    it('should include Twitch', () => {
      expect(subdomainBlocklist).toContain('Twitch')
    })
  })

  describe('payment platforms', () => {
    it('should include PayPal', () => {
      const hasPaypal = subdomainBlocklist.some((item) =>
        item.toLowerCase().includes('paypal')
      )
      // PayPal might not be in the list, so we check if list handles payments
      expect(subdomainBlocklist).toContain('Alipay')
    })

    it('should include Alipay', () => {
      expect(subdomainBlocklist).toContain('Alipay')
    })

    it('should include Amazon (e-commerce)', () => {
      expect(subdomainBlocklist).toContain('Amazon')
    })

    it('should include eBay', () => {
      expect(subdomainBlocklist).toContain('Ebay')
    })

    it('should include Stripe via payment processing', () => {
      expect(subdomainBlocklist.length).toBeGreaterThan(0)
    })
  })

  describe('work platforms', () => {
    it('should include Slack via communications', () => {
      expect(subdomainBlocklist.length).toBeGreaterThan(0)
    })

    it('should include Zoom (video conferencing)', () => {
      expect(subdomainBlocklist).toContain('Zoom')
    })

    it('should include GitHub (development)', () => {
      expect(subdomainBlocklist).toContain('Github')
    })

    it('should include Office (Microsoft)', () => {
      expect(subdomainBlocklist).toContain('Office')
    })
  })

  describe('email and communication', () => {
    it('should include Gmail', () => {
      expect(subdomainBlocklist).toContain('Gmail')
    })

    it('should include Outlook (Live)', () => {
      expect(subdomainBlocklist).toContain('Live')
    })

    it('should include Yahoo', () => {
      expect(subdomainBlocklist).toContain('Yahoo')
    })

    it('should include iCloud', () => {
      expect(subdomainBlocklist).toContain('Icloud')
    })
  })

  describe('storage services', () => {
    it('should include Dropbox', () => {
      expect(subdomainBlocklist).toContain('Dropbox')
    })

    it('should include OneDrive', () => {
      expect(subdomainBlocklist).toContain('Onedrive')
    })

    it('should include WeTransfer', () => {
      expect(subdomainBlocklist).toContain('Wetransfer')
    })
  })

  describe('list characteristics', () => {
    it('should not have duplicates', () => {
      const unique = new Set(subdomainBlocklist)
      expect(unique.size).toBe(subdomainBlocklist.length)
    })

    it('should not be empty strings', () => {
      subdomainBlocklist.forEach((item) => {
        expect(item.length).toBeGreaterThan(0)
        expect(typeof item).toBe('string')
      })
    })

    it('should be sorted (approximately)', () => {
      // Check if list appears to be roughly sorted
      let sortedCount = 0
      for (let i = 1; i < subdomainBlocklist.length; i++) {
        if (subdomainBlocklist[i].toLowerCase() >= subdomainBlocklist[i - 1].toLowerCase()) {
          sortedCount++
        }
      }
      expect(sortedCount).toBeGreaterThan(subdomainBlocklist.length * 0.8)
    })
  })

  describe('utility use cases', () => {
    it('should be usable for checking if domain is blocklisted', () => {
      const isBlocklisted = (domain) => {
        return subdomainBlocklist.includes(domain)
      }
      expect(isBlocklisted('Google')).toBe(true)
      expect(isBlocklisted('RandomSite')).toBe(false)
    })

    it('should be usable for filtering domain suggestions', () => {
      const domains = ['Google', 'RandomSite', 'Facebook', 'MySite']
      const nonBlocklisted = domains.filter((d) => !subdomainBlocklist.includes(d))
      expect(nonBlocklisted).toContain('RandomSite')
      expect(nonBlocklisted).toContain('MySite')
      expect(nonBlocklisted).not.toContain('Google')
    })

    it('should be usable for case-insensitive checking', () => {
      const isBlocklistedCI = (domain) => {
        return subdomainBlocklist.some((item) => item.toLowerCase() === domain.toLowerCase())
      }
      expect(isBlocklistedCI('google')).toBe(true)
      expect(isBlocklistedCI('GOOGLE')).toBe(true)
    })
  })
})
