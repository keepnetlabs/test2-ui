import { createLocalVue } from '@vue/test-utils'
import CONSTANTS from './constants'
import { getDefaultVuex } from './utils'
import DataTableWrapper from '../Objects/Datatable'
import { wait } from '../utils'
import MOCKS from '../Mocks'
import ServerSideProps from '@/helper-classes/server-side-table-props'

describe('Datatable test cases suite', () => {
  const localVue = createLocalVue()
  let store

  beforeEach(() => {
    store = getDefaultVuex(store)
  })

  it('Refresh Button case', async () => {
    //Mounting table
    localVue.use(store)
    const { wrapper } = new DataTableWrapper(localVue, store)
    //getting refreshButton
    const refreshButton = wrapper.find(CONSTANTS.SELECTORS.REFRESH_BUTTON)
    //clicking button
    await refreshButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expecting custom event throwing
    expect(wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.REFRESH_ACTION]).toBeTruthy()
  })

  it('Download Button case', async () => {
    //mounting table
    const { wrapper } = new DataTableWrapper(localVue, store)

    const checkingDownloadModalButtonDisabled = (downloadModal) =>
      getDownloadModalButtons(downloadModal).filter((wrapper) => wrapper.classes('v-btn--disabled'))

    const getDownloadModalButtons = (downloadModal) =>
      downloadModal.findAll('.download-modal__footer button')

    const setMenuItemClickCases = async (menu, index, title = 'Download Current Page') => {
      const selector = `DOWNLOAD_MENU_ITEM_${index}`
      //finding menu
      const item = menu.find(CONSTANTS.SELECTORS[selector])
      //clicking  element
      await item.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      //checking downloadModalOpen
      expect(store.getters['common/getDownloadModalStatus']).toBe(true)
      //getting modal
      const downloadModal = wrapper.find('.v-dialog.download-modal.v-dialog--active')
      //Containing title
      expect(downloadModal.text()).toContain(title)
      //Containing subtitle
      expect(downloadModal.text()).toContain('Select file type')
      return downloadModal
    }

    //getting download button
    const downloadButton = wrapper.find(CONSTANTS.SELECTORS.DOWNLOAD_BUTTON)
    //clicking button
    await downloadButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //controlling isMenuOpen
    expect(wrapper.vm['isDownloadMenuOpen']).toBe(true)
    const menu = wrapper.find(CONSTANTS.SELECTORS.ACTIVE_MENU)
    let downloadModal = await setMenuItemClickCases(menu, 0)
    //checking download modal button status

    expect(checkingDownloadModalButtonDisabled(downloadModal).length).toEqual(1)
    //getting modal body
    const modalBody = downloadModal.find('.download-modal__body')
    //getting checkboxes
    const checkboxes = modalBody.findAll('.download-modal__checkbox')
    //selecting checkbox
    await checkboxes
      .at(1)
      .find('.v-input__control .v-input__slot')
      .trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checkbox clicked now download button is not disabled
    expect(checkingDownloadModalButtonDisabled(downloadModal).length).toEqual(0)
    //clicking download button
    getDownloadModalButtons(downloadModal).at(1).trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is Event emitted
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.DOWNLOAD_ACTION]
    expect(emittedEvent).toBeTruthy()
    //Checking emitted event like this
    expect(emittedEvent[0][0]).toStrictEqual({
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
  })
  it('Action Button case', async () => {
    //mounting table
    const { wrapper } = new DataTableWrapper(localVue, store, {
      addButton: MOCKS.ADD_BUTTON
    })
    //getting action button
    const button = wrapper.find('#btn-add--action-button')
    //clicking button
    await button.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is event emitted
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.ACTION_BUTTON]
    expect(emittedEvent).toBeTruthy()
  })

  it('Search Field case', async () => {
    //mounting table
    const { wrapper } = new DataTableWrapper(localVue, store, {
      isServerSide: true,
      serverSideEvents: { pagination: true, search: true, sort: true }
    })
    //getting search input
    const inputWrapper = wrapper.find('.table-search input')
    //setting input value
    inputWrapper.element.value = 'custom data'
    wrapper.vm.search = 'custom data'
    await inputWrapper.trigger('keyup')
    //checking is data writed to the dom
    expect(inputWrapper.element.value).toBe('custom data')
    //adding wait function to make function async
    await wait()
    //checking is event throwed
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.SEARCH_INPUT]
    expect(emittedEvent).toBeTruthy()
    //checking is event object
    expect(emittedEvent[0][0]).toStrictEqual({
      filter: MOCKS.SEARCH_FIELD_CASE
    })
  })

  it('Datatable filtering options', async () => {
    //mounting table
    const { wrapper } = new DataTableWrapper(localVue, store)
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ]
    })
    //checking filter options
    const filterOptions = wrapper.find('.filter-options')
    //clicking filter options
    await filterOptions.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is menu open
    expect(filterOptions.classes('filter-options--menu-active'))
    //getting menu items
    const filterOptionsItems = wrapper.findAll('.filter-options__menu .v-list-item')
    //checking there is 3 items
    expect(filterOptionsItems.length).toEqual(3)
    //clicking first item
    await filterOptionsItems.at(0).trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is event is throwed
    expect(
      wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_SET_DEFAULT_SEARCH]
    ).toBeTruthy()
    //clicking second item
    await filterOptionsItems.at(1).trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is event is throwed
    expect(
      wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_RESET_DEFAULT_SEARCH]
    ).toBeTruthy()
    //clicking third item
    await filterOptionsItems.at(2).trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is event is throwed
    expect(wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_CLEAR_FILTER]).toBeTruthy()
  })

  it('Selection case', async () => {
    const { wrapper } = new DataTableWrapper(localVue, store, { selectable: true })
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting first row
    const firstRow = wrapper.find('.el-table__fixed-body-wrapper .el-table__row')
    //getting first row checkbox
    const checkbox = firstRow.find('.el-checkbox')
    //clicking checkbox
    await checkbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is row selected
    expect(firstRow.classes('selected-row')).toBe(true)
    //checking is event throwed
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.SELECTION]
    expect(emittedEvent).toBeTruthy()
    //comparing event object
    const selectionObject = emittedEvent[0][0]
    expect(selectionObject).toStrictEqual([
      {
        name: 'Gürkan',
        surname: 'Uğurlu'
      }
    ])
  })
  it('Multi selection case selection that lower than table length', async () => {
    const { wrapper } = new DataTableWrapper(localVue, store, { selectable: true })
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        },
        {
          name: 'Arda',
          surname: 'Dura'
        }
      ]
    })
    //getting all rows
    const row = wrapper.find('.el-table__fixed-body-wrapper .el-table__row')
    //checking  checkbox

    const checkbox = row.find('.el-checkbox')
    await checkbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)

    const selectionRow = wrapper.find('.selection-row')
    //is selection row exists
    expect(selectionRow.exists()).toBe(true)
    //checking icon is minus-box
    expect(selectionRow.find('i').classes('mdi-minus-box')).toBe(true)
    //because every checkbox is clicked
    expect(selectionRow.text()).toContain(`1 item(s) selected`)
  })
  it('Multi selection case all selection', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, { selectable: true })
    const { wrapper } = datatableWrapper
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        },
        {
          name: 'Arda',
          surname: 'Dura'
        }
      ]
    })
    await datatableWrapper.checkAllCheckboxes()
    const selectionRow = wrapper.find('.selection-row')
    //is selection row exists
    expect(selectionRow.exists()).toBe(true)
    //checking icon is checkbox-marked
    expect(selectionRow.find('i').classes('mdi-checkbox-marked')).toBe(true)
    //because every checkbox is clicked
    expect(selectionRow.text()).toContain(`All selected`)
  })
  it('Multi selection case removing selection', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, { selectable: true })
    const { wrapper } = datatableWrapper
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        },
        {
          name: 'Arda',
          surname: 'Dura'
        }
      ]
    })
    const rows = await datatableWrapper.checkAllCheckboxes()
    const selectionRowCheckbox = wrapper.find('.selection-row .v-input__control .v-input__slot')
    //clicking checkbox to remove selection
    await selectionRowCheckbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //selection component is not rendered
    expect(wrapper.find('.selection-row').exists()).toBe(false)
    //checking is rows selected
    for (const row of rows.wrappers) {
      expect(row.classes('selected-row')).toBe(false)
    }
  })

  it('Checking tooltip', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, { selectable: true })
    const { wrapper } = datatableWrapper
    //adding data
    await wrapper.setProps({
      table: [
        {
          name:
            'GürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnn',
          surname: 'UğurluUğurluUğurluUğurluUğurluUğurluUğurluUğurluUğurlu'
        },
        {
          name: 'ArdaArdaArdaArdaArdaArdaArdaArda',
          surname: 'DuraDuraDuraDuraDuraDura'
        }
      ]
    })
    //getting first row
    const firstRow = wrapper.find('.el-table__body-wrapper .el-table__row')
    //getting second column
    const secondTd = firstRow.find('td:nth-child(2)')
    //entering cell
    await secondTd.trigger('mouseenter')
    //checking is tooltip is open
    expect(wrapper.vm.showOverFlowTooltip).toBe(true)
    //checking is tooltip rendered
    const datatableTooltip = wrapper.find('.datatable-tooltip')
    expect(datatableTooltip.exists()).toBe(true)
    //checking text is equal to what was expecte
    expect(datatableTooltip.text()).toContain(
      'GürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnnGürkannnnnnn'
    )
  })

  it('Text Filter case', async () => {
    //mounting table
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'text',
          filterableType: 'text',
          width: 150
        }
      ]
    })
    const { wrapper } = datatableWrapper
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting filter cell
    const cell = wrapper.findAll('.el-table__fixed-header-wrapper .k-table-header th .cell').at(1)
    //getting filter button
    const button = cell.find('button')
    //clicking
    await button.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //getting menu
    const filterMenu = wrapper.find('.v-menu__content')
    filterMenu.element.style.display = ''
    //checking is filter button disabled
    expect(filterMenu.find('button[disabled="disabled"]').exists()).toBe(true)
    //adding text to input
    const input = filterMenu.find('.filter__text input')
    input.element.value = 'asasa'
    await input.trigger('input')
    //checking is filter is not disabled
    expect(filterMenu.find('button[disabled="disabled"]').exists()).toBe(false)
    //Throwing event
    await cell.find('.filter__footer-button:last-child').trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expected is event throwing
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.COLUMN_FILTER]
    expect(emittedEvent).toBeTruthy()
    //expecting event is
    expect(emittedEvent[0][0]).toStrictEqual({
      Value: 'asasa',
      FieldName: 'name',
      Operator: 'Contains'
    })
  })
  it('Checkbox Filter case', async () => {
    //mounting table
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'text',
          filterableType: 'select',
          filterableItems: ['Yes', 'No'],
          width: 150
        }
      ]
    })
    const { wrapper } = datatableWrapper
    //adding data
    await wrapper.setProps({
      table: [
        {
          name: 'Name',
          surname: 'Surname'
        }
      ]
    })
    //getting filter cell
    const cell = wrapper.findAll('.el-table__fixed-header-wrapper .k-table-header th .cell').at(1)
    //getting filter button
    const button = cell.find('button')
    //clicking
    await button.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //getting menu
    const filterMenu = wrapper.find('.v-menu__content')
    filterMenu.element.style.display = ''
    //checking checkboxes to be rendered
    expect(cell.findAll('.v-input--checkbox').length).toEqual(2)
    //clicking first checkbox
    await cell
      .findAll('.v-input--checkbox')
      .at(0)
      .find('.v-input__control .v-input__slot')
      .trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //Throwing event
    await cell.find('.filter__footer-button:last-child').trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expected is event throwing
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.COLUMN_FILTER]
    expect(emittedEvent).toBeTruthy()
    //expecting event is
    expect(emittedEvent[0][0]).toStrictEqual({
      Value: 'Yes',
      FieldName: 'name',
      Operator: 'Include'
    })
  })

  it('Cluster Case', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      clusterItems: [{ name: 'Company Name' }],
      activeCluster: '',
      hideActionOptions: false,
      options: true,
      loading: false,
      groupable: true
    })
    const { wrapper } = datatableWrapper
    //setting data
    await wrapper.setProps({
      table: [
        {
          name: 'Mamını',
          surname: 'Uğurlu'
        }
      ]
    })
    //checking is cluster buttons is active
    const bulletedButton = wrapper.find('.clust-btn')
    const clusterButton = wrapper.find('.cluster__right i')
    expect(bulletedButton.exists()).toBe(true)
    expect(clusterButton.exists()).toBe(true)
    //Clicking button
    await clusterButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    const menu = wrapper.find('.cluster-view')
    console.log('wrapper.html', wrapper.html())
    //checking is menu rendered
    expect(wrapper.vm.clusterChevron).toBe(true)
    expect(menu.exists()).toBe(true)
    //clicking first item
    await menu.find('.cluster-view__item').trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expecting is event is throwed
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.CLUSTER]
    expect(emittedEvent).toBeTruthy()
    //expecting is event is what we wanted
    expect(emittedEvent[0][0]).toStrictEqual('Company Name')
    //clicking bulleted button
    await bulletedButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expecting bulleted event
    const emittedBulletedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.BULLETED]
    expect(emittedBulletedEvent).toBeTruthy()
    expect(emittedBulletedEvent[0]).toStrictEqual([])
  })
  it('Server side Select all', async () => {
    const { wrapper } = new DataTableWrapper(localVue, store, {
      selectable: true,
      isServerSide: true,
      serverSideEvents: { pagination: true, search: true, sort: true },
      isServerSideSelection: true,
      serverSideProps: new ServerSideProps()
    })
    //setting total number of records
    wrapper.vm.serverSideProps.totalNumberOfRecords = 2
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        },
        {
          name: 'Arda',
          surname: 'Dura'
        }
      ]
    })

    //getting all rows
    const row = wrapper.find('.el-table__fixed-body-wrapper .el-table__row')
    //checking  checkbox
    const checkbox = row.find('.el-checkbox')
    await checkbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //serverSideSelection variable must be 1
    expect(wrapper.vm.serverSideSelectionCount).toEqual(1)
    const selectAllButton = wrapper.find('.selection-row .btn-all-selection')
    //expecting selectAllButton to exist.
    expect(selectAllButton.exists()).toBe(true)
    //Clicking select All button
    await selectAllButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //it has to be equal 2
    expect(wrapper.vm.serverSideSelectionCount).toEqual(2)
    //expect selection row to be all selected
    const selectionRow = wrapper.find('.selection-row')
    expect(selectionRow.text()).toContain(`All selected`)
    await selectAllButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //it has to be equal 0
    expect(wrapper.vm.serverSideSelectionCount).toEqual(0)
  })
})
