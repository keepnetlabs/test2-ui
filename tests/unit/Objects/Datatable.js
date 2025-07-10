import { mount } from '@vue/test-utils'
import { getDefaultPropsData } from '../Datatable/utils'
import DataTableComponent from '@/components/DataTable'
import Vuetify from 'vuetify'
import CONSTANTS from '../Datatable/constants'

export default class DataTable {
  constructor(localVue, store, props = {}, vuetify = new Vuetify({}), ...restParams) {
    // Create component stubs for functional components
    const componentStubs = {
      Badge: {
        template: '<button :class="[className, \'k-badge\']">{{ text }}</button>',
        props: [
          'text',
          'color',
          'textBlack',
          'size',
          'className',
          'outline',
          'isErrorState',
          'errorStateValue',
          'hideBorder',
          'fullWidth',
          'style',
          'col',
          'listeners',
          'id',
          'isBlackText',
          'defaultBackgroundColor'
        ]
      },
      'data-table-text': {
        template: '<span>{{ col.value || (scope.row && scope.row[col.property]) }}</span>',
        props: ['col', 'scope']
      },
      'data-table-colorful-text': {
        template:
          '<span class="datatable__colorful-text">{{ col.value || (scope.row && scope.row[col.property]) }}</span>',
        props: ['col', 'scope', 'text']
      },
      'data-table-attachment': {
        template:
          '<div><i v-if="col.value || (scope.row && scope.row[col.property])" class="mdi-check"></i></div>',
        props: ['col', 'scope']
      },
      'data-table-detected': {
        template:
          '<div class="cell"><button class="k-badge">{{ col.value || (scope.row && scope.row[col.property]) }}</button></div>',
        props: ['col', 'scope']
      },
      'data-table-user-status': {
        template:
          '<div class="cell"><button class="k-badge">{{ col.value || (scope.row && scope.row[col.property]) }}</button></div>',
        props: ['col', 'scope']
      },
      'data-table-fiber': {
        template:
          '<div class="cell"><div class="datatable-fiber__item"><img src="../../assets/img/fiber-manual-record-offline.svg" /></div>{{ col.value || (scope.row && scope.row[col.property]) }}</div>',
        props: ['col', 'scope']
      },
      'data-table-progress': {
        template:
          '<div class="cell"><div role="progressbar" :aria-valuenow="col.value || (scope.row && scope.row[col.property])">{{ (col.value || (scope.row && scope.row[col.property])) }}%</div></div>',
        props: ['col', 'scope']
      },
      'data-table-service': {
        template:
          '<div class="cell"><img v-if="(col.value || (scope.row && scope.row[col.property])) === \'Outlook\'" alt="outlook" /><img v-else-if="(col.value || (scope.row && scope.row[col.property])) === \'Microsoft 365\'" alt="o365" /><img v-else-if="(col.value || (scope.row && scope.row[col.property])) === \'GSuite\'" alt="gsuite" /><img v-else-if="(col.value || (scope.row && scope.row[col.property])) === \'Exchange\'" alt="exchange" /></div>',
        props: ['col', 'scope']
      },
      'datatable-text-with-badge': {
        template:
          '<div class="data-table-text-with-badge"><span v-for="(item, index) in (col.value || (scope.row && scope.row[col.property]))" :key="index" class="data-table-text-with-badge__span">{{ item }}</span></div>',
        props: ['col', 'scope']
      },
      'data-table-small-badge': {
        template:
          '<div class="cell"><div class="small-badge__container"><button v-for="(item, index) in (col.value || (scope.row && scope.row[col.property]))" :key="index" class="k-badge k-badge__sizes--small">{{ item }}</button></div></div>',
        props: ['col', 'scope']
      },
      'data-table-status': {
        template:
          '<div class="cell"><button class="k-badge">{{ col.value || (scope.row && scope.row[col.property]) }}</button></div>',
        props: ['col', 'scope']
      }
    }

    this.wrapper = mount(DataTableComponent, {
      localVue,
      store,
      vuetify,
      stubs: componentStubs,
      ...getDefaultPropsData(props),
      ...restParams
    })
  }

  getTableRows() {
    // Support both normal and fixed column table modes
    const normalRows = this.wrapper.findAll('.el-table__body-wrapper .el-table__row')
    const fixedRows = this.wrapper.findAll('.el-table__fixed-body-wrapper .el-table__row')
    return normalRows.length > 0 ? normalRows : fixedRows
  }

  getFirstRow() {
    const rows = this.getTableRows()
    return rows.length > 0 ? rows.at(0) : null
  }

  getNthRow(index) {
    const rows = this.getTableRows()
    return rows.length > index ? rows.at(index) : null
  }

  getRows() {
    return this.getTableRows()
  }

  async checkAllCheckboxes() {
    //getting all rows
    const rows = this.getTableRows()
    //checking all checkboxes
    for (const row of rows.wrappers) {
      const checkbox = row.find('.el-checkbox')
      await checkbox.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    }
    return rows
  }
}
