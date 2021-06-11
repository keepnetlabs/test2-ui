import DataTable from '@/components/DataTable'
import { mount, createLocalVue } from '@vue/test-utils'
import CONSTANTS from './constants'
import { getDefaultPropsData, getDefaultVuex } from './utils'

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

  it
})
