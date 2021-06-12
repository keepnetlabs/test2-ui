import DataTable from '@/components/DataTable'
import { mount, createLocalVue } from '@vue/test-utils'
import CONSTANTS from './constants'
import { getDefaultPropsData, getDefaultVuex } from './utils'
import Vuetify from 'vuetify'
describe('Datatable test cases suite', () => {
  const localVue = createLocalVue()
  let store

  beforeEach(() => {
    store = getDefaultVuex(store)
  })

  it('Refresh Button case', async () => {
    //Mounting table
    localVue.use(store)
    const wrapper = mount(DataTable, {
      localVue,
      store,
      ...getDefaultPropsData()
    })
    //getting refreshButton
    const refreshButton = wrapper.find(CONSTANTS.SELECTORS.REFRESH_BUTTON)
    //clicking button
    await refreshButton.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    //expecting custom event throwing
    expect(wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.REFRESH_ACTION]).toBeTruthy()
  })

  it('Download Button case', async () => {
    //mounting table
    const wrapper = mount(DataTable, {
      localVue,
      store,
      vuetify: new Vuetify({}),
      ...getDefaultPropsData()
    })

    const checkingDownloadModalButtonDisabled = (downloadModal) =>
      getDownloadModalButtons(downloadModal).filter((wrapper) => wrapper.classes('v-btn--disabled'))

    const getDownloadModalButtons = (downloadModal) =>
      downloadModal.findAll('.download-modal__footer button')

    const setMenuItemClickCases = async (menu, index, title = 'Download Current Page') => {
      const selector = `DOWNLOAD_MENU_ITEM_${index}`
      console.log('selector', selector)
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
    const wrapper = mount(DataTable, {
      localVue,
      store,
      vuetify: new Vuetify({}),
      ...getDefaultPropsData({
        addButton: {
          show: true,
          action: 'handleClickAction',
          id: 'btn-add--action-button',
          tooltip: '',
          disabled: false
        }
      })
    })
    const button = wrapper.find('#btn-add--action-button')
    await button.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.ACTION_BUTTON]
    expect(emittedEvent).toBeTruthy()
  })
})
