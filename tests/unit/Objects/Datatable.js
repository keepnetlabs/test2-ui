import { mount } from '@vue/test-utils'
import { getDefaultPropsData } from '../Datatable/utils'
import DataTableComponent from '@/components/DataTable'
import Vuetify from 'vuetify'
export default class DataTable {
  constructor(localVue, store, props = {}, vuetify = new Vuetify({}), ...restParams) {
    this.wrapper = mount(DataTableComponent, {
      localVue,
      store,
      vuetify,
      ...getDefaultPropsData(props),
      ...restParams
    })
  }
}
