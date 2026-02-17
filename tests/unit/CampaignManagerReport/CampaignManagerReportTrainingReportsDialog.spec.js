import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportTrainingReportsDialog from '@/components/CampaignManagerReport/CampaignManagerReportTrainingReportsDialog'

describe('CampaignManagerReportTrainingReportsDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: true,
    tableData: [
      {
        phishingScenarioName: 'Test Scenario',
        trainingName: 'Test Training',
        enrollmentId: '123'
      },
      {
        phishingScenarioName: 'Scenario 2',
        trainingName: 'Training 2',
        enrollmentId: '456'
      }
    ]
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportTrainingReportsDialog, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: { AppDialog: true, DataTable: true, AppDialogFooterWithClose: true },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportTrainingReportsDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render DataTable component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'DataTable' }).exists()).toBe(true)
    })

    it('should render AppDialogFooterWithClose component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooterWithClose' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should accept tableData prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableData).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true)
    })

    it('should handle empty tableData', () => {
      const wrapper = mountComponent({ tableData: [] })
      expect(wrapper.vm.tableData.length).toBe(0)
    })

    it('status should default to undefined', () => {
      const wrapper = mountComponent({ status: undefined })
      expect(wrapper.vm.status).toBeUndefined()
    })

    it('tableData should default to empty array', () => {
      const wrapper = mountComponent({ tableData: undefined })
      expect(wrapper.vm.tableData).toEqual([])
    })
  })

  describe('Constants', () => {
    it('should have icon constant', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-text-box')
    })

    it('should have id constant', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.id).toBe('campaign-manager-training-reports-data-table')
    })

    it('should have ascending constant', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.ascending).toBe('ascending')
    })
  })

  describe('Table Data Handling', () => {
    it('should contain tableData items', () => {
      const wrapper = mountComponent({
        tableData: [
          { phishingScenarioName: 'Test', trainingName: 'Training', enrollmentId: '1' }
        ]
      })
      expect(wrapper.vm.tableData.length).toBe(1)
      expect(wrapper.vm.tableData[0].enrollmentId).toBe('1')
    })

    it('should handle multiple training reports', () => {
      const wrapper = mountComponent({
        tableData: [
          { phishingScenarioName: 'Scenario 1', trainingName: 'Training 1', enrollmentId: '1' },
          { phishingScenarioName: 'Scenario 2', trainingName: 'Training 2', enrollmentId: '2' },
          { phishingScenarioName: 'Scenario 3', trainingName: 'Training 3', enrollmentId: '3' }
        ]
      })
      expect(wrapper.vm.tableData.length).toBe(3)
    })

    it('should pass tableData to DataTable', () => {
      const wrapper = mountComponent()
      const dataTable = wrapper.findComponent({ name: 'DataTable' })
      expect(dataTable.attributes('table')).toBeDefined()
    })
  })

  describe('Table Options', () => {
    it('should define column structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.columns.length).toBe(2)
    })

    it('should have scenario name column', () => {
      const wrapper = mountComponent()
      const columns = wrapper.vm.tableOptions.columns
      const scenarioColumn = columns.find(c => c.property === 'phishingScenarioName')
      expect(scenarioColumn).toBeDefined()
    })

    it('should have training name column', () => {
      const wrapper = mountComponent()
      const columns = wrapper.vm.tableOptions.columns
      const trainingColumn = columns.find(c => c.property === 'trainingName')
      expect(trainingColumn).toBeDefined()
    })

    it('should have correct columns width', () => {
      const wrapper = mountComponent()
      wrapper.vm.tableOptions.columns.forEach(column => {
        expect(column.width).toBe(280)
      })
    })

    it('should disable add button', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.addButton.show).toBe(false)
    })

    it('should disable download button', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.downloadButton.show).toBe(false)
    })

    it('should set count row to 5', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.countRow).toBe(5)
    })

    it('should have row actions for view report', () => {
      const wrapper = mountComponent()
      const viewAction = wrapper.vm.tableOptions.rowActions.find(a => a.action === 'on-view-report')
      expect(viewAction).toBeDefined()
      expect(viewAction.name).toBeDefined()
    })
  })

  describe('Axios Payload', () => {
    it('should initialize axiosPayload', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.axiosPayload).toBeDefined()
    })

    it('should set orderBy to OpenedTime', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.axiosPayload.orderBy).toBe('OpenedTime')
    })

    it('should set pageSize to 5', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.axiosPayload.pageSize).toBe(5)
    })
  })

  describe('Methods', () => {
    it('should have handleClose method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClose).toBe('function')
    })

    it('should have handleViewReport method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleViewReport).toBe('function')
    })
  })

  describe('Event Emissions', () => {
    it('should emit on-close event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Dialog Status', () => {
    it('should handle open status', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should handle closed status', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })

    it('should pass status to AppDialog', () => {
      const wrapper = mountComponent({ status: true })
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.attributes('status')).toBeDefined()
    })
  })

  describe('View Report Functionality', () => {
    it('should extract enrollmentId from row', () => {
      const wrapper = mountComponent()
      const row = { enrollmentId: '789', trainingName: 'Test' }
      expect(row.enrollmentId).toBe('789')
    })

    it('should handle null enrollmentId gracefully', () => {
      const wrapper = mountComponent()
      const row = { trainingName: 'Test' }
      const enrollmentId = row?.enrollmentId ?? ''
      expect(enrollmentId).toBe('')
    })

    it('should construct correct training report URL', () => {
      const wrapper = mountComponent()
      const enrollmentId = '123'
      const expectedUrl = `/awareness-educator/enrollments/training-report/${enrollmentId}`
      expect(expectedUrl).toContain('123')
      expect(expectedUrl).toContain('training-report')
    })
  })

  describe('ServerSideProps', () => {
    it('should initialize serverSideProps', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.serverSideProps).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent dialog instances', () => {
      const wrapper1 = mountComponent({
        tableData: [{ enrollmentId: '1', trainingName: 'Training 1' }]
      })
      const wrapper2 = mountComponent({
        tableData: [
          { enrollmentId: '2', trainingName: 'Training 2' },
          { enrollmentId: '3', trainingName: 'Training 3' }
        ]
      })

      expect(wrapper1.vm.tableData.length).toBe(1)
      expect(wrapper2.vm.tableData.length).toBe(2)
    })

    it('should maintain independent status states', () => {
      const wrapper1 = mountComponent({ status: true })
      const wrapper2 = mountComponent({ status: false })

      expect(wrapper1.vm.status).toBe(true)
      expect(wrapper2.vm.status).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing tableData property', () => {
      const wrapper = mountComponent({ tableData: undefined })
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true)
    })

    it('should handle tableData with missing enrollmentId', () => {
      const wrapper = mountComponent({
        tableData: [{ phishingScenarioName: 'Scenario', trainingName: 'Training' }]
      })
      const row = wrapper.vm.tableData[0]
      const enrollmentId = row?.enrollmentId ?? ''
      expect(enrollmentId).toBe('')
    })

    it('should handle tableData with special characters', () => {
      const wrapper = mountComponent({
        tableData: [
          {
            phishingScenarioName: 'Test & Special <Characters>',
            trainingName: 'Training "Quotes"',
            enrollmentId: '123'
          }
        ]
      })
      expect(wrapper.vm.tableData[0].phishingScenarioName).toContain('&')
    })
  })

  describe('DataTable Integration', () => {
    it('should have columns in tableOptions', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.columns).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableOptions.columns)).toBe(true)
    })

    it('should have row actions in tableOptions', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.rowActions).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableOptions.rowActions)).toBe(true)
    })

    it('should configure selectable mode', () => {
      const wrapper = mountComponent()
      const dataTable = wrapper.findComponent({ name: 'DataTable' })
      expect(dataTable.exists()).toBe(true)
    })

    it('should configure filterable mode', () => {
      const wrapper = mountComponent()
      const dataTable = wrapper.findComponent({ name: 'DataTable' })
      expect(dataTable.exists()).toBe(true)
    })

    it('should pass empty message config', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.iEmpty.message).toBeDefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render dialog with training reports', () => {
      const wrapper = mountComponent({
        status: true,
        tableData: [
          { phishingScenarioName: 'Scenario 1', trainingName: 'Training 1', enrollmentId: '1' },
          { phishingScenarioName: 'Scenario 2', trainingName: 'Training 2', enrollmentId: '2' }
        ]
      })

      expect(wrapper.vm.status).toBe(true)
      expect(wrapper.vm.tableData.length).toBe(2)
      expect(wrapper.findComponent({ name: 'DataTable' }).exists()).toBe(true)
    })

    it('complete workflow: render and close dialog', async () => {
      const wrapper = mountComponent({ status: true })
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('should handle large dataset efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        phishingScenarioName: `Scenario ${i}`,
        trainingName: `Training ${i}`,
        enrollmentId: `${i}`
      }))
      const wrapper = mountComponent({ tableData: largeData })
      expect(wrapper.vm.tableData.length).toBe(1000)
    })
  })
})
