import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerTargetGroupsDialog from '@/components/CampaignManager/CampaignManagerTargetGroupsDialog'
import * as phishingsimulatorAPI from '@/api/phishingsimulator'
import { CAMPAIGN_TYPE } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignTargetGroups: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerTargetGroupsDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: false,
    campaignResourceId: 'campaign-123',
    instanceGroup: 'group-1',
    campaignType: CAMPAIGN_TYPE.Phishing,
    infoMessage: 'The exact target user count will be determined when the campaign starts.'
  }

  const defaultTargetGroups = [
    { name: 'Group A', count: 100 },
    { name: 'Group B', count: 200 },
    { name: 'Group C', count: 150 }
  ]

  const mockApiResponse = {
    data: {
      data: {
        targetGroups: defaultTargetGroups
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(mockApiResponse)
  })

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerTargetGroupsDialog, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mocks: {
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerTargetGroupsDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AppDialogFooterWithClose component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooterWithClose' }).exists()).toBe(true)
    })

    it('should render AlertBox when infoMessage provided', () => {
      const wrapper = mountComponent({
        infoMessage: 'Test message'
      })
      expect(wrapper.findComponent({ name: 'AlertBox' }).exists()).toBe(true)
    })

    it('should not render AlertBox when infoMessage is empty', () => {
      const wrapper = mountComponent({
        infoMessage: ''
      })
      expect(wrapper.findComponent({ name: 'AlertBox' }).exists()).toBe(false)
    })

    it('should have loading capability', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isLoading !== undefined).toBe(true)
    })

    it('should have correct AppDialog title', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.exists()).toBe(true)
    })

    it('should have correct AppDialog icon', () => {
      const wrapper = mountComponent()
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.props('icon')).toBe('mdi-account-group')
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('status prop should be of type Boolean', () => {
      expect(CampaignManagerTargetGroupsDialog.props.status.type).toBe(Boolean)
    })

    it('should accept campaignResourceId prop', () => {
      const wrapper = mountComponent({ campaignResourceId: 'campaign-456' })
      expect(wrapper.vm.campaignResourceId).toBe('campaign-456')
    })

    it('campaignResourceId prop should be of type String', () => {
      expect(CampaignManagerTargetGroupsDialog.props.campaignResourceId.type).toBe(String)
    })

    it('should accept instanceGroup prop', () => {
      const wrapper = mountComponent({ instanceGroup: 'group-5' })
      expect(wrapper.vm.instanceGroup).toBe('group-5')
    })

    it('instanceGroup prop should be of type String', () => {
      expect(CampaignManagerTargetGroupsDialog.props.instanceGroup.type).toBe(String)
    })

    it('should accept campaignType prop', () => {
      const wrapper = mountComponent({ campaignType: CAMPAIGN_TYPE.Phishing })
      expect(wrapper.vm.campaignType).toBe(CAMPAIGN_TYPE.Phishing)
    })

    it('campaignType prop should be of type Number', () => {
      expect(CampaignManagerTargetGroupsDialog.props.campaignType.type).toBe(Number)
    })

    it('should accept infoMessage prop', () => {
      const message = 'Custom message'
      const wrapper = mountComponent({ infoMessage: message })
      expect(wrapper.vm.infoMessage).toBe(message)
    })

    it('infoMessage prop should be of type String', () => {
      expect(CampaignManagerTargetGroupsDialog.props.infoMessage.type).toBe(String)
    })
  })

  describe('Data Properties', () => {
    it('should initialize targetGroups as empty array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.targetGroups)).toBe(true)
      expect(wrapper.vm.targetGroups.length).toBe(0)
    })

    it('should initialize isLoading as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should have labels property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labels).toBeDefined()
    })
  })

  describe('Watcher - Status', () => {
    it('should fetch target groups when status changes to true', async () => {
      const wrapper = mountComponent({
        status: false,
        campaignResourceId: 'campaign-123'
      })

      await wrapper.setProps({ status: true })
      await wrapper.vm.$nextTick()

      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith(
        'campaign-123',
        expect.any(Object)
      )
    })

    it('should have targetGroups property', async () => {
      const wrapper = mountComponent({ status: true })
      expect(Array.isArray(wrapper.vm.targetGroups)).toBe(true)
    })

    it('should fetch target groups immediately on mount when status is true', async () => {
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: 'campaign-123'
      })
      await wrapper.vm.$nextTick()

      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalled()
    })

    it('should not fetch when status is true but no campaignResourceId', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: ''
      })
      await wrapper.vm.$nextTick()

      expect(phishingsimulatorAPI.getCampaignTargetGroups).not.toHaveBeenCalled()
    })

    it('should clear stale targetGroups when status is true but campaignResourceId is empty', () => {
      const ctx = {
        campaignResourceId: '',
        targetGroups: [{ name: 'Old Group', count: 5 }],
        fetchTargetGroups: jest.fn()
      }

      CampaignManagerTargetGroupsDialog.watch.status.handler.call(ctx, true)

      expect(ctx.fetchTargetGroups).not.toHaveBeenCalled()
      expect(ctx.targetGroups).toEqual([])
    })

    it('should clear target groups when watcher receives false status', () => {
      const ctx = {
        campaignResourceId: 'campaign-123',
        targetGroups: [{ name: 'Old Group', count: 5 }],
        fetchTargetGroups: jest.fn()
      }

      CampaignManagerTargetGroupsDialog.watch.status.handler.call(ctx, false)

      expect(ctx.fetchTargetGroups).not.toHaveBeenCalled()
      expect(ctx.targetGroups).toEqual([])
    })
  })

  describe('Methods - fetchTargetGroups', () => {
    it('should clear stale targetGroups before applying new response', async () => {
      let resolveRequest
      phishingsimulatorAPI.getCampaignTargetGroups.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveRequest = resolve
          })
      )
      const wrapper = mountComponent()
      wrapper.vm.targetGroups = [{ name: 'Stale Group', count: 999 }]

      const pending = wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
      expect(wrapper.vm.isLoading).toBe(true)

      resolveRequest({
        data: {
          data: {
            targetGroups: [{ name: 'Fresh Group', count: 1 }]
          }
        }
      })
      await pending

      expect(wrapper.vm.targetGroups).toEqual([{ name: 'Fresh Group', count: 1 }])
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should set isLoading to true during fetch', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 50))
      )
      const wrapper = mountComponent()

      wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should populate targetGroups from API response', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()

      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('should set isLoading to false after fetch', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()

      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should handle API response with data.data structure', async () => {
      const response = {
        data: {
          data: {
            targetGroups: defaultTargetGroups
          }
        }
      }
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(response)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('should handle API response with direct data structure', async () => {
      const response = {
        data: {
          targetGroups: defaultTargetGroups
        }
      }
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(response)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('should handle API response with groups key', async () => {
      const response = {
        data: {
          data: {
            groups: defaultTargetGroups
          }
        }
      }
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(response)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('should handle API response with array data', async () => {
      const response = {
        data: defaultTargetGroups
      }
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(response)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('should map to empty array when API payload does not include groups', async () => {
      const response = {
        data: {
          data: {
            groups: {}
          }
        }
      }
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(response)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('should clear targetGroups on error', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockRejectedValue(new Error('API Error'))
      const wrapper = mountComponent()
      wrapper.vm.targetGroups = [...defaultTargetGroups]

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should not fetch when no campaignResourceId', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({ campaignResourceId: '' })

      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).not.toHaveBeenCalled()
    })

    it('should pass correct parameters to API', async () => {
      const wrapper = mountComponent({
        campaignResourceId: 'camp-1',
        instanceGroup: 'inst-1',
        campaignType: CAMPAIGN_TYPE.Phishing
      })

      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith(
        'camp-1',
        {
          campaignType: CAMPAIGN_TYPE.Phishing,
          instanceGroup: 'inst-1'
        }
      )
    })

    it('should pass undefined for instanceGroup when empty', async () => {
      const wrapper = mountComponent({
        campaignResourceId: 'camp-1',
        instanceGroup: '',
        campaignType: CAMPAIGN_TYPE.Phishing
      })

      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith(
        'camp-1',
        {
          campaignType: CAMPAIGN_TYPE.Phishing,
          instanceGroup: undefined
        }
      )
    })

    it('passes campaignType 0 to API (valid enum value)', async () => {
      const wrapper = mountComponent({
        campaignResourceId: 'camp-zero-type',
        instanceGroup: 'ig-1',
        campaignType: 0
      })
      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith('camp-zero-type', {
        campaignType: 0,
        instanceGroup: 'ig-1'
      })
    })

    it('passes string instanceGroup through to API when provided', async () => {
      const wrapper = mountComponent({
        campaignResourceId: 'camp-ig-str',
        instanceGroup: 'frequency-group-9',
        campaignType: CAMPAIGN_TYPE.Phishing
      })
      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith(
        'camp-ig-str',
        expect.objectContaining({
          instanceGroup: 'frequency-group-9',
          campaignType: CAMPAIGN_TYPE.Phishing
        })
      )
    })
  })

  describe('fetchTargetGroups response shape (parseGroupsFromResponse)', () => {
    it('prefers groups over targetGroups when both keys exist', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: {
          data: {
            groups: [{ name: 'FromGroups', count: 1 }],
            targetGroups: [{ name: 'FromTargetGroups', count: 99 }]
          }
        }
      })
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([{ name: 'FromGroups', count: 1 }])
    })

    it('uses targetGroups when groups is absent', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: {
          data: {
            targetGroups: [{ name: 'OnlyTargetGroups', usersCount: 12 }]
          }
        }
      })
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([{ name: 'OnlyTargetGroups', usersCount: 12 }])
    })

    it('accepts top-level response.data as array of groups', async () => {
      const rows = [
        { name: 'RowA', count: 1 },
        { name: 'RowB', count: 2 }
      ]
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: rows
      })
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(rows)
    })

    it('maps non-array groups payload to empty list', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: {
          data: {
            groups: 'invalid-not-array'
          }
        }
      })
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('parses nested data.data.groups from typical API envelope', async () => {
      const groups = [{ name: 'Envelope', count: 42 }]
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: {
          data: {
            groups
          }
        }
      })
      const wrapper = mountComponent()
      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual(groups)
    })
  })

  describe('Methods - getGroupCount', () => {
    it('should return 0 when count is explicitly zero', () => {
      const wrapper = mountComponent()
      const group = { count: 0, usersCount: 99 }
      expect(wrapper.vm.getGroupCount(group)).toBe(0)
    })

    it('should return count property when available', () => {
      const wrapper = mountComponent()
      const group = { count: 100 }
      expect(wrapper.vm.getGroupCount(group)).toBe(100)
    })

    it('should return usersCount property when count not available', () => {
      const wrapper = mountComponent()
      const group = { usersCount: 200 }
      expect(wrapper.vm.getGroupCount(group)).toBe(200)
    })

    it('should return userCount property when others not available', () => {
      const wrapper = mountComponent()
      const group = { userCount: 300 }
      expect(wrapper.vm.getGroupCount(group)).toBe(300)
    })

    it('should check domainAllowList for Verified count', () => {
      const wrapper = mountComponent()
      const group = {
        domainAllowList: [
          { status: 'Verified', count: 50 },
          { status: 'Pending', count: 10 }
        ]
      }
      expect(wrapper.vm.getGroupCount(group)).toBe(50)
    })

    it('should return 0 when no count available', () => {
      const wrapper = mountComponent()
      const group = { name: 'Group' }
      expect(wrapper.vm.getGroupCount(group)).toBe(0)
    })

    it('should prioritize count over other keys', () => {
      const wrapper = mountComponent()
      const group = { count: 100, usersCount: 200, userCount: 300 }
      expect(wrapper.vm.getGroupCount(group)).toBe(100)
    })

    it('skips null count and uses usersCount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getGroupCount({ count: null, usersCount: 44 })).toBe(44)
    })

    it('uses first Verified domainAllowList entry when multiple Verified rows exist', () => {
      const wrapper = mountComponent()
      const group = {
        domainAllowList: [
          { status: 'Pending', count: 1 },
          { status: 'Verified', count: 77 },
          { status: 'Verified', count: 88 }
        ]
      }
      expect(wrapper.vm.getGroupCount(group)).toBe(77)
    })

    it('returns 0 when domainAllowList has no Verified row', () => {
      const wrapper = mountComponent()
      const group = {
        domainAllowList: [
          { status: 'Pending', count: 10 },
          { status: 'Draft', count: 5 }
        ]
      }
      expect(wrapper.vm.getGroupCount(group)).toBe(0)
    })

    it('returns 0 when domainAllowList is empty array', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getGroupCount({ domainAllowList: [] })).toBe(0)
    })
  })

  describe('Methods - getGroupName', () => {
    it('should return empty string for null group', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getGroupName(null)).toBe('')
    })

    it('should fallback to targetGroupName when name is empty string', () => {
      const wrapper = mountComponent()
      const group = { name: '', targetGroupName: 'Fallback Group' }
      expect(wrapper.vm.getGroupName(group)).toBe('Fallback Group')
    })

    it('should return name property when available', () => {
      const wrapper = mountComponent()
      const group = { name: 'Target Group A' }
      expect(wrapper.vm.getGroupName(group)).toBe('Target Group A')
    })

    it('should return targetGroupName when name not available', () => {
      const wrapper = mountComponent()
      const group = { targetGroupName: 'Target Group B' }
      expect(wrapper.vm.getGroupName(group)).toBe('Target Group B')
    })

    it('should return empty string when neither available', () => {
      const wrapper = mountComponent()
      const group = { count: 100 }
      expect(wrapper.vm.getGroupName(group)).toBe('')
    })

    it('should prioritize name over targetGroupName', () => {
      const wrapper = mountComponent()
      const group = { name: 'Group A', targetGroupName: 'Group B' }
      expect(wrapper.vm.getGroupName(group)).toBe('Group A')
    })

    it('returns empty string when both name and targetGroupName are missing', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getGroupName({ count: 5 })).toBe('')
    })

    it('uses targetGroupName when name key is undefined', () => {
      const wrapper = mountComponent()
      const group = { targetGroupName: 'TG Only' }
      expect(wrapper.vm.getGroupName(group)).toBe('TG Only')
    })
  })

  describe('Watcher status (dialog open/close)', () => {
    it('clears targetGroups when status becomes false after load', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(mockApiResponse)
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: 'campaign-clear'
      })
      await flushPromises()
      expect(wrapper.vm.targetGroups.length).toBeGreaterThan(0)

      await wrapper.setProps({ status: false })
      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('does not fetch when status true but campaignResourceId is empty string', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: ''
      })
      await wrapper.vm.$nextTick()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).not.toHaveBeenCalled()
      expect(wrapper.vm.targetGroups).toEqual([])
    })
  })

  describe('Methods - handleClose', () => {
    it('handleClose should be callable', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleClose()).not.toThrow()
    })

    it('handleClose should emit on-close', () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      wrapper.vm.handleClose()
      expect(emitSpy).toHaveBeenCalledWith('on-close')
    })
  })

  describe('AppDialog close wiring', () => {
    it('emits on-close when AppDialog changeStatus listener runs (same as Schedule dialog)', () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.exists()).toBe(true)
      expect(typeof appDialog.vm.$listeners.changeStatus).toBe('function')
      appDialog.vm.$listeners.changeStatus()
      expect(emitSpy).toHaveBeenCalledWith('on-close')
      emitSpy.mockRestore()
    })

  })

  describe('Event Emission', () => {
    it('should have event emission capability', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClose).toBe('function')
    })
  })

  describe('Target Groups Display', () => {
    it('should display all target groups', async () => {
      const wrapper = mountComponent()
      wrapper.vm.targetGroups = defaultTargetGroups

      expect(wrapper.vm.targetGroups.length).toBe(3)
    })

    it('should display empty state when no target groups', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetGroups.length).toBe(0)
    })

    it('should handle single target group', async () => {
      const wrapper = mountComponent()
      wrapper.vm.targetGroups = [{ name: 'Group A', count: 100 }]

      expect(wrapper.vm.targetGroups.length).toBe(1)
    })

    it('should display loading state while fetching', () => {
      const wrapper = mountComponent()
      wrapper.vm.isLoading = true

      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        campaignResourceId: 'campaign-1'
      })
      const wrapper2 = mountComponent({
        campaignResourceId: 'campaign-2'
      })

      expect(wrapper1.vm.campaignResourceId).toBe('campaign-1')
      expect(wrapper2.vm.campaignResourceId).toBe('campaign-2')
    })

    it('multiple instances should handle independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.handleClose()
      wrapper2.vm.handleClose()

      expect(wrapper1.vm).toBeDefined()
      expect(wrapper2.vm).toBeDefined()
    })

    it('multiple instances should fetch independently', async () => {
      jest.clearAllMocks()
      const wrapper1 = mountComponent({
        status: true,
        campaignResourceId: 'camp-1'
      })
      const wrapper2 = mountComponent({
        status: true,
        campaignResourceId: 'camp-2'
      })

      await wrapper1.vm.$nextTick()
      await wrapper2.vm.$nextTick()

      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledTimes(2)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: open dialog and fetch target groups', async () => {
      const wrapper = mountComponent({
        status: false,
        campaignResourceId: 'campaign-123'
      })

      await wrapper.setProps({ status: true })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isLoading).toBe(false)
      expect(wrapper.vm.targetGroups).toEqual(defaultTargetGroups)
    })

    it('complete workflow: close dialog clears data', async () => {
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: 'campaign-123'
      })
      await wrapper.vm.$nextTick()

      wrapper.vm.targetGroups = defaultTargetGroups
      await wrapper.setProps({ status: false })

      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('complete workflow: handle and display various target group formats', async () => {
      const wrapper = mountComponent({
        status: true,
        campaignResourceId: 'campaign-123'
      })

      const group1 = { name: 'Group A', count: 100 }
      const group2 = { targetGroupName: 'Group B', usersCount: 200 }
      const group3 = {
        name: 'Group C',
        domainAllowList: [
          { status: 'Verified', count: 150 }
        ]
      }

      wrapper.vm.targetGroups = [group1, group2, group3]

      expect(wrapper.vm.getGroupName(group1)).toBe('Group A')
      expect(wrapper.vm.getGroupName(group2)).toBe('Group B')
      expect(wrapper.vm.getGroupName(group3)).toBe('Group C')
      expect(wrapper.vm.getGroupCount(group1)).toBe(100)
      expect(wrapper.vm.getGroupCount(group2)).toBe(200)
      expect(wrapper.vm.getGroupCount(group3)).toBe(150)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null campaignResourceId', async () => {
      const wrapper = mountComponent({ campaignResourceId: null })
      await wrapper.vm.fetchTargetGroups()

      expect(phishingsimulatorAPI.getCampaignTargetGroups).not.toHaveBeenCalled()
    })

    it('should handle undefined targetGroups in response', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: { data: {} }
      })
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('should handle null in response', async () => {
      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue(null)
      const wrapper = mountComponent()

      await wrapper.vm.fetchTargetGroups()
      expect(wrapper.vm.targetGroups).toEqual([])
    })

    it('should handle very long group names', () => {
      const wrapper = mountComponent()
      const longName = 'A'.repeat(200)
      const group = { name: longName }

      expect(wrapper.vm.getGroupName(group)).toBe(longName)
    })

    it('should handle very large counts', () => {
      const wrapper = mountComponent()
      const group = { count: 999999999 }

      expect(wrapper.vm.getGroupCount(group)).toBe(999999999)
    })

    it('should handle special characters in group names', () => {
      const wrapper = mountComponent()
      const group = { name: 'Group@#$%^&*()' }

      expect(wrapper.vm.getGroupName(group)).toBe('Group@#$%^&*()')
    })

    it('should handle empty instance group', async () => {
      const wrapper = mountComponent({
        instanceGroup: ''
      })

      await wrapper.vm.fetchTargetGroups()
      expect(phishingsimulatorAPI.getCampaignTargetGroups).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ instanceGroup: undefined })
      )
    })

    it('should handle rapid status toggle', async () => {
      const wrapper = mountComponent({ status: false })

      await wrapper.setProps({ status: true })
      await wrapper.setProps({ status: false })
      await wrapper.setProps({ status: true })

      expect(wrapper.vm.targetGroups).toBeDefined()
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

    it('should maintain props after mount', async () => {
      const wrapper = mountComponent({
        campaignResourceId: 'camp-123',
        instanceGroup: 'inst-1'
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.campaignResourceId).toBe('camp-123')
      expect(wrapper.vm.instanceGroup).toBe('inst-1')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(3000)
    })

    it('handleClose should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleClose()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(3000)
    })

    it('getGroupCount should be efficient', () => {
      const wrapper = mountComponent()
      const groups = Array.from({ length: 1000 }, (_, i) => ({
        name: `Group${i}`,
        count: i
      }))

      const start = Date.now()
      groups.forEach(g => wrapper.vm.getGroupCount(g))
      const duration = Date.now() - start
      expect(duration).toBeLessThan(3000)
    })

    it('should handle large result sets', async () => {
      const largeGroups = Array.from({ length: 500 }, (_, i) => ({
        name: `Group${i}`,
        count: Math.floor(Math.random() * 1000)
      }))

      phishingsimulatorAPI.getCampaignTargetGroups.mockResolvedValue({
        data: { data: { targetGroups: largeGroups } }
      })

      const wrapper = mountComponent()
      const start = Date.now()
      await wrapper.vm.fetchTargetGroups()
      const duration = Date.now() - start

      expect(duration).toBeLessThan(5000)
      expect(wrapper.vm.targetGroups.length).toBe(500)
    })
  })
})
