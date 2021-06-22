import { mount } from '@vue/test-utils'
import { getDefaultPropsData } from '../Datatable/utils'
import DataTableComponent from '@/components/DataTable'
import Vuetify from 'vuetify'
import CONSTANTS from '../Datatable/constants'
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

  async checkAllCheckboxes() {
    //getting all rows
    const rows = this.wrapper.findAll('.el-table__fixed-body-wrapper .el-table__row')
    //checking all checkboxes
    for (const row of rows.wrappers) {
      const checkbox = row.find('.el-checkbox')
      await checkbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    }
    return rows
  }
}
