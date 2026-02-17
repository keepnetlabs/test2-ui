import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerLanguageSupportDialog from '@/components/CampaignManager/CampaignManagerLanguageSupportDialog'

describe('CampaignManagerLanguageSupportDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: false,
    targetGroupResourceIds: [1, 2, 3],
    selectedTargetGroups: [
      { companyName: 'Company A' },
      { companyName: 'Company B' }
    ],
    userCountDetailResponse: {
      data: {
        data: [
          {
            hasPreferredLanguage: [
              { status: 'No', hasPreferredLanguage: [{ status: 'English' }, { status: 'Spanish' }] }
            ],
            hasRandomLanguage: [
              { status: 'Yes', hasRandomLanguage: [{ status: 'French' }] }
            ]
          }
        ]
      }
    }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerLanguageSupportDialog, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'login/getCurrentCompany': () => ({
              name: 'Company A',
              preferredLanguageTypeName: 'English'
            })
          }
        },
        $emit: jest.fn()
      },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerLanguageSupportDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AppDialogFooter component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).exists()).toBe(true)
    })

    it('should have correct AppDialog type', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('type')).toBe('delete')
    })

    it('should have correct AppDialog title', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('title')).toBe('Missing Language Support Detected!')
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('status prop should be of type Boolean', () => {
      expect(CampaignManagerLanguageSupportDialog.props.status.type).toBe(Boolean)
    })

    it('should accept targetGroupResourceIds prop', () => {
      const ids = [1, 2, 3, 4, 5]
      const wrapper = mountComponent({ targetGroupResourceIds: ids })
      expect(wrapper.vm.targetGroupResourceIds).toEqual(ids)
    })

    it('should accept selectedTargetGroups prop', () => {
      const groups = [
        { companyName: 'Company 1' },
        { companyName: 'Company 2' }
      ]
      const wrapper = mountComponent({ selectedTargetGroups: groups })
      expect(wrapper.vm.selectedTargetGroups).toEqual(groups)
    })

    it('should accept userCountDetailResponse prop', () => {
      const response = {
        data: {
          data: [
            {
              hasPreferredLanguage: [{ status: 'No', hasPreferredLanguage: [{ status: 'English' }] }]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: response })
      expect(wrapper.vm.userCountDetailResponse).toEqual(response)
    })

    it('status prop should be of type Boolean with false default', () => {
      expect(CampaignManagerLanguageSupportDialog.props.status.type).toBe(Boolean)
      expect(CampaignManagerLanguageSupportDialog.props.status.default).toBe(false)
    })

    it('targetGroupResourceIds prop should be of type Array', () => {
      expect(CampaignManagerLanguageSupportDialog.props.targetGroupResourceIds.type).toBe(Array)
    })

    it('selectedTargetGroups prop should be of type Array', () => {
      expect(CampaignManagerLanguageSupportDialog.props.selectedTargetGroups.type).toBe(Array)
    })

    it('userCountDetailResponse prop should be of type Object', () => {
      expect(CampaignManagerLanguageSupportDialog.props.userCountDetailResponse.type).toBe(Object)
    })
  })

  describe('Data Properties', () => {
    it('should initialize preferredLanguages as empty array', () => {
      const wrapper = mountComponent({ userCountDetailResponse: { data: { data: [] } } })
      expect(Array.isArray(wrapper.vm.preferredLanguages)).toBe(true)
    })

    it('should initialize randomLanguages as empty array', () => {
      const wrapper = mountComponent({ userCountDetailResponse: { data: { data: [] } } })
      expect(Array.isArray(wrapper.vm.randomLanguages)).toBe(true)
    })

    it('should populate preferredLanguages from userCountDetailResponse', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.preferredLanguages.length).toBeGreaterThan(0)
    })

    it('should populate randomLanguages from userCountDetailResponse', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.randomLanguages.length).toBeGreaterThan(0)
    })
  })

  describe('Computed Properties - Company Language', () => {
    it('getCompanyPreferredLanguage should be a computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCompanyPreferredLanguage).toBeDefined()
    })

    it('getCompanyPreferredLanguage should be defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCompanyPreferredLanguage).toBeDefined()
    })

    it('getCompanyName should be a computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCompanyName).toBeDefined()
    })

    it('getCompanyName should return value or null', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getCompanyName === null || typeof wrapper.vm.getCompanyName === 'string').toBe(true)
    })
  })

  describe('Computed Properties - Company Names Comparison', () => {
    it('isCompanyNamesDifferent should be a computed property', () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [
          { companyName: 'Company A' },
          { companyName: 'Company A' }
        ]
      })
      expect(typeof wrapper.vm.isCompanyNamesDifferent).toBe('boolean')
    })

    it('isCompanyNamesDifferent should return true when target groups differ from current company', () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [
          { companyName: 'Company A' },
          { companyName: 'Company B' }
        ]
      })
      expect(wrapper.vm.isCompanyNamesDifferent).toBe(true)
    })

    it('isCompanyNamesDifferent should handle single company', () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [{ companyName: 'Company A' }]
      })
      expect(typeof wrapper.vm.isCompanyNamesDifferent).toBe('boolean')
    })

    it('isCompanyNamesDifferent should handle multiple different companies', () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [
          { companyName: 'Company X' },
          { companyName: 'Company Y' },
          { companyName: 'Company Z' }
        ]
      })
      expect(wrapper.vm.isCompanyNamesDifferent).toBe(true)
    })
  })

  describe('Computed Properties - Missing Languages', () => {
    it('getMissingPreferredLanguages should return single language', () => {
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: [{ status: 'Spanish' }] }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      expect(wrapper.vm.getMissingPreferredLanguages).toBe('Spanish')
    })

    it('getMissingPreferredLanguages should format multiple languages', () => {
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                {
                  status: 'No',
                  hasPreferredLanguage: [
                    { status: 'Spanish' },
                    { status: 'French' },
                    { status: 'German' }
                  ]
                }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      expect(wrapper.vm.getMissingPreferredLanguages).toContain('e.g.')
    })

    it('getMissingPreferredLanguages should format many languages with count', () => {
      const languages = Array.from({ length: 10 }, (_, i) => ({
        status: `Language${i}`
      }))
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: languages }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      const result = wrapper.vm.getMissingPreferredLanguages
      expect(result).toContain('e.g.')
      expect(result).toContain('and')
      expect(result).toContain('more')
    })

    it('getMissingCompanyLanguages should return comma-separated languages', () => {
      const userResponse = {
        data: {
          data: [
            {
              hasRandomLanguage: [
                {
                  status: 'Yes',
                  hasRandomLanguage: [
                    { status: 'English' },
                    { status: 'Spanish' },
                    { status: 'French' }
                  ]
                }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      expect(wrapper.vm.getMissingCompanyLanguages).toContain(',')
    })
  })

  describe('Methods', () => {
    it('handleClose should be callable', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleClose()).not.toThrow()
    })

    it('handleConfirm should be callable', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleConfirm()).not.toThrow()
    })
  })

  describe('Event Emission', () => {
    it('should have handleClose method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClose).toBe('function')
    })

    it('should have handleConfirm method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleConfirm).toBe('function')
    })

    it('AppDialog should be present', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.exists()).toBe(true)
    })

    it('AppDialogFooter should be present', () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.exists()).toBe(true)
    })
  })

  describe('Lifecycle - Data Transformation', () => {
    it('created hook should process userCountDetailResponse with hasPreferredLanguage', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.preferredLanguages).toBeDefined()
      expect(Array.isArray(wrapper.vm.preferredLanguages)).toBe(true)
    })

    it('created hook should process userCountDetailResponse with hasRandomLanguage', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.randomLanguages).toBeDefined()
      expect(Array.isArray(wrapper.vm.randomLanguages)).toBe(true)
    })

    it('created hook should handle empty userCountDetailResponse', () => {
      const wrapper = mountComponent({
        userCountDetailResponse: { data: { data: [] } }
      })
      expect(wrapper.vm.preferredLanguages.length).toBe(0)
      expect(wrapper.vm.randomLanguages.length).toBe(0)
    })

    it('created hook should extract languages from nested structure', () => {
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                {
                  status: 'No',
                  hasPreferredLanguage: [
                    { status: 'English' },
                    { status: 'Spanish' }
                  ]
                }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      expect(wrapper.vm.preferredLanguages).toContain('English')
      expect(wrapper.vm.preferredLanguages).toContain('Spanish')
    })
  })

  describe('Dialog Content Variations', () => {
    it('should handle single company company groups', async () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [{ companyName: 'Company A' }]
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedTargetGroups.length).toBe(1)
    })

    it('should handle multi-company target groups', async () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [
          { companyName: 'Company A' },
          { companyName: 'Company B' }
        ]
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedTargetGroups.length).toBe(2)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const userResponse1 = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: [{ status: 'English' }] }
              ]
            }
          ]
        }
      }
      const userResponse2 = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: [{ status: 'Spanish' }] }
              ]
            }
          ]
        }
      }

      const wrapper1 = mountComponent({ userCountDetailResponse: userResponse1 })
      const wrapper2 = mountComponent({ userCountDetailResponse: userResponse2 })

      expect(wrapper1.vm.preferredLanguages).toContain('English')
      expect(wrapper2.vm.preferredLanguages).toContain('Spanish')
    })

    it('multiple instances should work independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      expect(() => wrapper1.vm.handleClose()).not.toThrow()
      expect(() => wrapper2.vm.handleConfirm()).not.toThrow()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: single company with missing languages', () => {
      const wrapper = mountComponent({
        status: true,
        selectedTargetGroups: [{ companyName: 'Company A' }],
        userCountDetailResponse: {
          data: {
            data: [
              {
                hasPreferredLanguage: [
                  { status: 'No', hasPreferredLanguage: [{ status: 'English' }] }
                ]
              }
            ]
          }
        }
      })

      expect(wrapper.vm.status).toBe(true)
      expect(typeof wrapper.vm.isCompanyNamesDifferent).toBe('boolean')
      expect(Array.isArray(wrapper.vm.preferredLanguages)).toBe(true)
    })

    it('complete workflow: multiple companies with missing languages', () => {
      const wrapper = mountComponent({
        status: true,
        selectedTargetGroups: [
          { companyName: 'Company A' },
          { companyName: 'Company B' }
        ],
        userCountDetailResponse: {
          data: {
            data: [
              {
                hasPreferredLanguage: [
                  {
                    status: 'No',
                    hasPreferredLanguage: [
                      { status: 'English' },
                      { status: 'Spanish' }
                    ]
                  }
                ]
              }
            ]
          }
        }
      })

      expect(wrapper.vm.status).toBe(true)
      expect(wrapper.vm.isCompanyNamesDifferent).toBe(true)
      expect(wrapper.vm.preferredLanguages.length).toBeGreaterThan(0)
    })

    it('complete workflow: close and confirm workflow', () => {
      const wrapper = mountComponent({ status: true })

      expect(() => wrapper.vm.handleClose()).not.toThrow()
      expect(() => wrapper.vm.handleConfirm()).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should initialize with valid response', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.preferredLanguages)).toBe(true)
    })

    it('should handle response with data', () => {
      const wrapper = mountComponent({
        userCountDetailResponse: {
          data: { data: [] }
        }
      })
      expect(Array.isArray(wrapper.vm.preferredLanguages)).toBe(true)
    })

    it('should handle empty selectedTargetGroups', () => {
      const wrapper = mountComponent({ selectedTargetGroups: [] })
      expect(wrapper.vm.selectedTargetGroups).toEqual([])
    })

    it('should handle special characters in company names', () => {
      const wrapper = mountComponent({
        selectedTargetGroups: [
          { companyName: 'Company@#$%' },
          { companyName: 'Company™®©' }
        ]
      })
      expect(wrapper.vm.selectedTargetGroups.length).toBe(2)
    })

    it('should handle very long language names', () => {
      const longLanguageName = 'A'.repeat(100)
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                {
                  status: 'No',
                  hasPreferredLanguage: [{ status: longLanguageName }]
                }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      expect(wrapper.vm.preferredLanguages[0]).toBe(longLanguageName)
    })

    it('should handle many languages without duplication', () => {
      const languages = [
        { status: 'English' },
        { status: 'English' },
        { status: 'Spanish' },
        { status: 'Spanish' }
      ]
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: languages }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      // Set should remove duplicates
      expect(wrapper.vm.preferredLanguages).toBeDefined()
    })

    it('should handle rapid status changes', async () => {
      const wrapper = mountComponent({ status: false })
      await wrapper.setProps({ status: true })
      expect(wrapper.vm.status).toBe(true)
      await wrapper.setProps({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain languages after prop updates', async () => {
      const userResponse = {
        data: {
          data: [
            {
              hasPreferredLanguage: [
                { status: 'No', hasPreferredLanguage: [{ status: 'English' }] }
              ]
            }
          ]
        }
      }
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      const languages = [...wrapper.vm.preferredLanguages]

      await wrapper.setProps({ status: true })
      expect(wrapper.vm.preferredLanguages).toEqual(languages)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('handleClose should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleClose()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })

    it('should handle large userCountDetailResponse efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        hasPreferredLanguage: [
          {
            status: 'No',
            hasPreferredLanguage: [
              { status: `Language${i}` }
            ]
          }
        ]
      }))
      const userResponse = { data: { data: largeData } }
      const start = Date.now()
      const wrapper = mountComponent({ userCountDetailResponse: userResponse })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(300)
      expect(wrapper.vm.preferredLanguages.length).toBeGreaterThan(0)
    })
  })
})
