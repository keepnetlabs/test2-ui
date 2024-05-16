<template>
  <div>
    <data-table-tooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
    <table
      v-if="getTableStatus"
      :id="tableId"
      :class="['k-widget-list', className]"
      :style="getTableStyle"
      aria-label="widget"
    >
      <thead class="k-widget-list__header-container">
        <th
          v-for="col in columns"
          :key="col.label"
          :class="['k-widget-list__header', `${getThClass(col)}`]"
          :style="col['thStyle'] && col['thStyle']"
        >
          {{ col.label }}
        </th>
      </thead>
      <tbody>
        <tr :key="JSON.stringify(row + rowIndex)" v-for="(row, rowIndex) in data">
          <td
            v-for="(value, key, index) in row"
            v-if="columns[index]"
            class="safari-hide-tooltip"
            :id="row.id"
            :key="JSON.stringify(value + key + index)"
            :style="columns[index]['tdStyle'] && columns[index]['tdStyle']"
            @mouseenter="handleMouseEnterTd($event, row[columns[index].property], rowIndex)"
            @mouseup="handleMouseEnterTd($event, row[columns[index].property], rowIndex)"
            @mouseleave="handleMouseLeaveTd($event, row[columns[index].property], rowIndex)"
          >
            <slot
              :name="columns[index].property"
              :row="row"
              :value="row[columns[index].property]"
              :prop="columns[index].property"
              :index="index"
              :rowIndex="rowIndex"
            >
              <span class="executive-report-table__item" v-if="row[columns[index].property]">
                {{ row[columns[index].property] }}
              </span>
              <span v-else class="k-widget-list__no-match">{{ columns[index].emptyText }}</span>
              <div class="k-widget-list__sub-item" v-if="row[columns[index]['subItem']]">
                {{ row[columns[index]['subItem']] }}
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="k-widget-list__empty" v-else>
      <slot name="empty-widget-list">
        <div class="k-widget-list__empty-inline">
          <h2 v-if="empty.message">{{ empty.message }}</h2>
          <p v-if="empty.subMes">{{ empty.subMes }}</p>
          <v-btn @click="onEmptyBtnClicked" class="empty-btn" v-if="empty.btn">
            <!-- empty action -->
            <v-icon class="mr-2">{{ empty.icon }}</v-icon>
            {{ empty.btn }}
          </v-btn>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip'
import { createRandomCryptStringNumber } from '@/utils/functions'
export default {
  name: 'ExecutiveReportTable',
  components: {
    DataTableTooltip
  },
  props: {
    /*
    Columns of the Widget List
     */
    columns: {
      type: Array,
      required: true
    },
    /*
    Data of the List
     */
    data: {
      type: Array
    },
    colStyle: {
      type: Object
    },
    auto: {
      type: Boolean
    },
    /*
    Empty status of widgetlist.
    has message, subMessage and btn values
    has empty-widget-list slot.
     */
    empty: {
      type: Object
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      showOverFlowTooltip: false,
      overFlowTooltipStyle: {},
      overFlowTooltipContent: '',
      tableId: `table-${createRandomCryptStringNumber()}`
    }
  },
  computed: {
    getTableStyle() {
      return this.auto ? 'table-layout:auto' : 'table-layout:fixed'
    },
    getTableStatus() {
      console.log('this.data', this.data)
      return this.data.length > 0
    }
  },
  methods: {
    getThClass(col) {
      if (col?.label) {
        return `k-widget-list__th-${col.label.split(' ').join('').toLowerCase()}`
      }
      return `k-widget-list__th`
    },
    handleMouseEnterTd(event = {}, value = '', index = 0) {
      const { target: parent } = event
      const parentRECT = parent.getBoundingClientRect()
      const parentWidth = Math.floor(parentRECT.width)
      const childRECT =
        parent.querySelector('.executive-report-table__item') &&
        parent.querySelector('.executive-report-table__item').getBoundingClientRect()
      if (childRECT && parentRECT) {
        const tableLeft = document.getElementById(this.tableId).getBoundingClientRect().left
        const childWidth = Math.floor(childRECT.width) + 16
        value = value.toString()
        if (value && childWidth > parentWidth) {
          this.overFlowTooltipStyle = {
            top: `${80 + (index + 1) * 48}px`,
            left: `${childRECT.left - tableLeft}px`
          }
          this.overFlowTooltipContent = value
          this.showOverFlowTooltip = true
        }
      }
    },
    handleMouseLeaveTd() {
      this.showOverFlowTooltip = false
    },
    onEmptyBtnClicked() {
      this.$emit('onEmptyBtnClicked')
    }
  }
}
</script>
