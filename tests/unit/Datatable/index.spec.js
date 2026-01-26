import ServerSideProps from '@/helper-classes/server-side-table-props'
import { createLocalVue } from '@vue/test-utils'
import MOCKS from '../Mocks'
import DataTableWrapper from '../Objects/Datatable'
import { wait } from '../utils'
import CONSTANTS from './constants'
import { getDefaultVuex } from './utils'

describe('Datatable test cases suite', () => {
  const localVue = createLocalVue()
  let store

  beforeEach(() => {
    store = getDefaultVuex(store)
  })

  it('Pagination Case', async () => {
    const { wrapper } = new DataTableWrapper(localVue, store, {
      serverSideProps: new ServerSideProps()
    })
    wrapper.vm.serverSideProps.totalNumberOfRecords = MOCKS.PAGINATION_DATA.length
    await wrapper.setProps({
      table: MOCKS.PAGINATION_DATA,
      isServerSide: true,
      serverSideEvents: { pagination: true, search: true, sort: true }
    })
    //getting pagination
    const pagination = wrapper.find('.el-pagination')
    //expecting pagination to be rendered
    expect(pagination.exists()).toBe(true)
    //expecting text message of pagination
    expect(pagination.find('.el-pagination__text--2').text().replace(/\s/g, '')).toContain(
      '1-10of13'
    )
    const elPager = pagination.find('.el-pager')
    //clicking second item
    await elPager.findAll('li').at(1).trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking on dom is second page active
    expect(elPager.findAll('li').at(1).classes('active')).toBe(true)
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.SERVER_SIDE_PAGE_CHANGED]
    //checking is event throwed
    expect(emittedEvent).toBeTruthy()
    //expect emitted event page is 2
    expect(emittedEvent[0][0]).toEqual(2)
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
    await inputWrapper.trigger('input')
    //checking is data writed to the dom
    expect(inputWrapper.element.value).toBe('custom data')
    //adding wait function to make function async
    await wait()
    //checking is event throwed
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.SEARCH_INPUT]
    expect(emittedEvent).toBeTruthy()
    //checking is event object
    expect(emittedEvent[0][0]).toStrictEqual({
      filter: {
        ...MOCKS.SEARCH_FIELD_CASE,
        SearchInputTextValue: 'custom data'
      }
    })
  })

  it('Datatable filtering options', async () => {
    //mounting table
    const { wrapper } = new DataTableWrapper(localVue, store)
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
    //getting menu items
    const filterOptionsItems = document.querySelectorAll(
      '.filter-options__menu-content .v-list-item'
    )
    //checking there is 3 items
    expect(filterOptionsItems.length).toEqual(3)
    //clicking first item
    filterOptionsItems[0].click()
    //checking is event is throwed
    expect(
      wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_SET_DEFAULT_SEARCH]
    ).toBeTruthy()
    //clicking second item
    filterOptionsItems[1].click()
    //checking is event is throwed
    expect(
      wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_RESET_DEFAULT_SEARCH]
    ).toBeTruthy()
    //clicking third item
    filterOptionsItems[2].click()
    //checking is event is throwed
    expect(wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.FILTER_OPTIONS_CLEAR_FILTER]).toBeTruthy()
  })

  it('Selection case', async () => {
    const { wrapper } = new DataTableWrapper(localVue, store, {
      selectable: true
    })
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting first row
    const firstRow = wrapper.find('.el-table__body-wrapper .el-table__row')
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
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true
    })
    const { wrapper } = datatableWrapper
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
    //getting first row
    const row = datatableWrapper.getFirstRow()
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
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true
    })
    const { wrapper } = datatableWrapper
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
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true
    })
    const { wrapper } = datatableWrapper
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
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true
    })
    const { wrapper } = datatableWrapper
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
    await wrapper.setProps({
      table: [
        {
          name: 'Gürkan',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting filter cell
    const cell = wrapper.findAll('.el-table__header-wrapper .k-table-header th .cell').at(1)
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
    await wrapper.setProps({
      table: [
        {
          name: 'Name',
          surname: 'Surname'
        }
      ]
    })
    //getting filter cell
    const cell = wrapper.findAll('.el-table__header-wrapper .k-table-header th .cell').at(1)
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
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      selectable: true,
      isServerSide: true,
      serverSideEvents: { pagination: true, search: true, sort: true },
      isServerSideSelection: true,
      serverSideProps: new ServerSideProps()
    })
    const { wrapper } = datatableWrapper
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

    //getting first row
    const row = datatableWrapper.getFirstRow()
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

  it('Dynamic width', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      selectable: true
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 'Mamını',
          surname: 'Uğurlu'
        }
      ]
    })
    wrapper.vm.columns[0].width = 250
    //waiting dom updates
    await wrapper.vm.$nextTick()
    //expecting is width changed
    expect(wrapper.vm.columns[0].width).toEqual(250)
  })
  it('Text column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 'Mamını',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting firstRow
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it datatableText component
    expect(wrapper.findComponent({ name: 'DataTableText' })).toBeTruthy()
    //checking is dom element is text and equal do what we expect
    expect(firstRow.find('.cell span').text()).toEqual('Mamını')
  })
  it('Colorful text column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'colorfulText'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 'Mamını',
          surname: 'Uğurlu'
        }
      ]
    })
    //getting firstRow
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DataTableColorfulText component
    expect(wrapper.findComponent({ name: 'DataTableColorfulText' })).toBeTruthy()
    //checking is dom element is text and equal do what we expect
    const cell = firstRow.find('.cell span')
    expect(cell.text()).toEqual('Mamını')
    //checking classes
    expect(cell.classes('datatable__colorful-text')).toBe(true)
  })

  it('Text With Badge column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'textWithBadge'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: ['Mamını', 'Leo'],
          surname: 'Uğurlu'
        }
      ]
    })
    //getting firstRow
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DatatableTextWithBadge component
    expect(wrapper.findComponent({ name: 'DatatableTextWithBadge' })).toBeTruthy()
    //getting dom element
    const componentContainer = firstRow.find('.data-table-text-with-badge')
    //getting children and expecting to be 2
    expect(componentContainer.findAll('.data-table-text-with-badge__span').length).toEqual(2)
  })
  it('Attachment column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'attachment'
        },
        {
          property: 'surname',
          align: 'left',
          label: 'Surname',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'attachment'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 1,
          surname: 0
        }
      ]
    })
    //getting firstRow
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DatatableTextWithBadge component
    expect(wrapper.findComponent({ name: 'DataTableAttachment' })).toBeTruthy()
    //getting dom element
    const nameCell = firstRow.find('td:first-child')
    const surnameCell = firstRow.find('td:last-child')
    //expecting icon to be rendered
    expect(nameCell.find('i.mdi-check').exists()).toBeTruthy()
    //expecting icon not to be rendered
    expect(surnameCell.find('i.mdi-check').exists()).toBe(false)
  })

  it('Detected column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'detected'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 'warning'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DatatableTextWithBadge component
    expect(wrapper.findComponent({ name: 'DataTableDetected' })).toBeTruthy()
    //getting dom element
    const cell = firstRow.find('.cell')
    //expecting cell is equal text
    expect(cell.text()).toEqual('warning')
    //expecting is badge component
    expect(cell.find('button').classes('k-badge')).toBe(true)
  })
  it('User status column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'name',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'detected'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          name: 'online'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DatatableTextWithBadge component
    expect(wrapper.findComponent({ name: 'DataTableUserStatus' })).toBeTruthy()
    //getting dom element
    const cell = firstRow.find('.cell')
    //expecting cell is equal text
    expect(cell.text()).toEqual('online')
    //expecting is badge component
    expect(cell.find('button').classes('k-badge')).toBe(true)
  })
  it('Fiber column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'status',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'fiber'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          status: 'Online'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DataTableFiber component
    expect(wrapper.findComponent({ name: 'DataTableFiber' })).toBeTruthy()
    //getting dom element
    const cell = firstRow.find('.cell')
    //expecting cell is equal text
    expect(cell.text()).toEqual('Online')
    //getting fiber item
    const fiberItem = cell.find('.datatable-fiber__item img')
    //checking img source.
    expect(fiberItem.element.getAttribute('src')).toEqual(
      '../../assets/img/fiber-manual-record-offline.svg'
    )
  })
  it('Progress column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'progress',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'progress'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          progress: 100
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it DataTableProgress component
    expect(wrapper.findComponent({ name: 'DataTableProgress' })).toBeTruthy()
    //getting dom element
    const cell = firstRow.find('.cell')
    const progressBar = cell.find('[role="progressbar"]')
    //expecting value to be 100
    expect(progressBar.element.getAttribute('aria-valuenow')).toEqual('100')
  })
  it('Service column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'service',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'service'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          service: 'Outlook'
        },
        {
          service: 'Microsoft 365'
        },
        {
          service: 'GSuite'
        },
        {
          service: 'Exchange'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    expect(wrapper.findComponent({ name: 'DataTableService' }).exists()).toBeTruthy()
    expect(firstRow.find('img[alt="outlook"').exists()).toBe(true)
    const secondRow = datatableWrapper.getNthRow(1)
    expect(secondRow.find('img[alt="o365"').exists()).toBe(true)
    const thirdRow = datatableWrapper.getNthRow(2)
    expect(thirdRow.find('img[alt="gsuite"').exists()).toBe(true)
    const fourthRow = datatableWrapper.getNthRow(3)
    expect(fourthRow.find('img[alt="exchange"').exists()).toBe(true)
  })
  it('Badge column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'status',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'badge'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          status: 'warning'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //getting dom element
    const cell = firstRow.find('.cell')
    //expecting cell is equal text
    expect(cell.text()).toEqual('warning')
    //expecting is badge component
    expect(cell.find('button').classes('k-badge')).toBe(true)
  })
  it('Status column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'status',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'status'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          status: 'warning'
        }
      ]
    })
    const firstRow = datatableWrapper.getFirstRow()
    //checking is it Badge component
    const cell = firstRow.find('.cell')
    //expecting cell is equal text
    expect(cell.text()).toEqual('warning')
    //expecting is badge component
    expect(cell.find('button').classes('k-badge')).toBe(true)
  })
  it('Small badge column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'smallBadge',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'smallBadge'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          smallBadge: ['ab', 'cd']
        }
      ]
    })
    //getting row
    const firstRow = datatableWrapper.getFirstRow()
    //getting dom element
    const cell = firstRow.find('.cell')
    const smallBadgeContainer = cell.find('.small-badge__container')
    const children = smallBadgeContainer.findAll('.k-badge__sizes--small')
    //checking is badges rendered and equal to 2
    expect(children.length).toEqual(2)
  })
  it('Number column type', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: [
        {
          property: 'number',
          align: 'left',
          label: 'Name',
          sortable: true,
          show: true,
          fixed: 'left',
          type: 'number'
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          number: 155
        }
      ]
    })
    //getting row
    const firstRow = datatableWrapper.getFirstRow()
    //getting dom element
    const cell = firstRow.find('.cell')
    //expecting text to be rendered
    expect(cell.find('span').text()).toEqual('155')
  })
  it('Extended View', async () => {
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      columns: MOCKS.EXTENDED_VIEW_COLUMNS,
      extendedViewOptions: MOCKS.EXTENDED_VIEW_OPTIONS,
      extendedViewValue: [],
      extendedViewLoading: false,
      rowActions: MOCKS.EXTENDED_VIEW_ROW_ACTIONS
    })
    const { wrapper } = datatableWrapper
    await wrapper.setProps({
      table: MOCKS.EXTENDED_VIEW_TABLE_DATA,
      isServerSide: true,
      serverSideEvents: { pagination: true, search: true, sort: true }
    })
    //getting first row
    const firstRow = datatableWrapper.getFirstRow()
    //getting edit button
    const editButton = firstRow.find('button')
    //clicking edit button on table
    await editButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.EXTENDED_VIEW_EDIT]
    expect(emittedEvent).toBeTruthy()
    await wrapper.setProps({
      extendedViewValue: JSON.parse(JSON.stringify(emittedEvent[0][0].selected))
    })
    //getting extended view
    const extendedView = wrapper.find('#container--extended-view')
    //expecting extendedView Rendered
    expect(extendedView.exists()).toBe(true)
    //expecting header text to be Some Email
    expect(extendedView.find('.edit-popup__header').text()).toContain('Some Email')
    //getting extendedViewBody
    const extendedViewBody = extendedView.find('.edit-popup__body')
    //checking is exists
    expect(extendedViewBody.exists()).toBe(true)
    //checking subject(text)
    expect(extendedViewBody.find('#label--extended-view-singular-Subject-0').exists()).toBe(true)
    expect(extendedViewBody.find('#text--extended-view-singular-value-Subject-0').exists()).toBe(
      true
    )
    //checking result(tag)
    expect(extendedViewBody.find('#label--extended-view-singular-Result-4').exists()).toBe(true)
    expect(extendedViewBody.find('#container--extended-view-item-Result-4 .k-badge').exists()).toBe(
      true
    )
    //getting footer
    const extendedViewFooter = extendedView.find('.edit-popup__footer')
    //checking is exists
    expect(extendedViewFooter.exists()).toBe(true)
    //checking first value is equal to 2021/07/04 20:24
    expect(extendedViewFooter.find('#text--extended-view-footer-value-0').text()).toEqual(
      '2021/07/04 20:24'
    )
    //checking is second value is equal to 2021/07/04 20:41
    expect(extendedViewFooter.find('#text--extended-view-footer-value-1').text()).toEqual(
      '2021/07/04 20:41'
    )
    //clicking extended view edit mode
    await extendedView
      .find('.edit-popup__edit-actions #btn-edit--extended-view')
      .trigger(CONSTANTS.EVENT_TYPES.CLICK)

    //checking result has select
    const resultContainer = extendedView.find('#container--extended-view-item-Result-4')
    //checking has input
    const resultInput = resultContainer.find('.v-select__selection.v-select__selection--comma')
    expect(resultInput.exists()).toBe(true)
    //Checking value is Undetected
    expect(resultInput.text()).toContain('Undetected')
    //checking status (select)
    const statusContainer = extendedView.find('#container--extended-view-item-Status-5')
    const statusInput = statusContainer.find('.v-select__selection.v-select__selection--comma')
    expect(statusInput.exists()).toBe(true)
    //checking value (select)
    expect(statusInput.text()).toContain('Open')
    //checking notes (textarea)
    const notesContainer = extendedView.find('#container--extended-view-item-Notes-7')
    //expecting rendered
    expect(notesContainer.find('.v-textarea').exists()).toBe(true)
  })

  it('Row Actions Disabled Case(Permissions)', async () => {
    const { PERMISSIONS } = MOCKS
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      rowActions: [
        {
          name: 'Edit',
          icon: 'mdi-pencil',
          action: 'editAction',
          id: 'btn-edit--smtp-settings-row-actions',
          disabled: !PERMISSIONS.UPDATE.hasPermission
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'deleteAction',
          id: 'btn-delete-unit-test-row-actions',
          disabled: !PERMISSIONS.DELETE.hasPermission
        }
      ]
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          number: 155
        }
      ]
    })
    //getting firstRow
    const firstRow = datatableWrapper.getFirstRow()
    //getting RowActionsButtons
    const rowActionsButtons = firstRow.findAll('button')
    //getting edit button
    const editButton = rowActionsButtons.at(0)
    //checking is edit button is disabled because of no permission
    expect(editButton.classes('v-btn--disabled')).toBe(true)
    //getting delete button.
    const deleteButton = rowActionsButtons.at(1)
    //checking is delete button is disabled because of no permission
    expect(deleteButton.classes('v-btn--disabled')).toBe(true)
  })

  it('New Buttons Disabled Case(Permissions)', async () => {
    const { PERMISSIONS } = MOCKS
    const datatableWrapper = new DataTableWrapper(localVue, store, {
      loading: false,
      addButton: {
        show: true,
        action: 'addUnitTestAction',
        tooltip: 'Add Unit test',
        id: 'btn-add--unit-test',
        disabled: !PERMISSIONS.CREATE.hasPermission
      }
    })
    const { wrapper } = datatableWrapper

    await wrapper.setProps({
      table: [
        {
          number: 155
        }
      ]
    })

    //getting button new
    const newButton = wrapper.find('.button-new')
    //expecting is rendered
    expect(newButton.exists()).toBe(true)
    //checking is disabled
    expect(newButton.classes('v-btn--disabled')).toBe(true)
    //clicking button
    await newButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //checking is event throwed
    const emittedEvent = wrapper.emitted()
    //it is disabled it shouldnt throw event
    expect(emittedEvent['addUnitTestAction']).toBe(undefined)
  })
})
