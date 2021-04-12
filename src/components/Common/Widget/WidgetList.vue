<template>
  <div>
    <data-table-tooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
    <table
      :class="['k-widget-list', className]"
      :style="getTableStyle"
      :id="tableId"
      v-if="getTableStatus"
    >
      <thead class="k-widget-list__header-container">
        <th
          :key="col.label"
          v-for="col in columns"
          :class="[
            'k-widget-list__header',
            `k-widget-list__th-${col.label.split(' ').join('').toLowerCase()}`
          ]"
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
              <span class="k-widget-list__item" v-if="row[columns[index].property]">
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
export default {
  name: 'WidgetList',
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
      tableId: `table-${Math.random()}`
    }
  },
  computed: {
    getTableStyle() {
      return this.auto ? 'table-layout:auto' : 'table-layout:fixed'
    },
    getTableStatus() {
      return this.data.length > 0
    }
  },
  methods: {
    handleMouseEnterTd(event = {}, value = '', index = 0) {
      const { target: parent } = event
      const parentRECT = parent.getBoundingClientRect()
      const parentWidth = Math.floor(parentRECT.width)
      const childRECT =
        parent.querySelector('.k-widget-list__item') &&
        parent.querySelector('.k-widget-list__item').getBoundingClientRect()
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
  },
  created() {}
}
</script>

<style lang="scss">
.k-widget-list {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  @media (max-width: 1300px) {
    table-layout: fixed !important;
  }

  &__empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &-inline {
      h2 {
        font-size: 16px;
        line-height: 1.29;
        letter-spacing: normal;
        font-weight: 600;
        text-align: center;
      }
      p {
        font-size: 16px;
        letter-spacing: normal;
        margin-bottom: 14px !important;
      }
    }
  }
  position: relative;
  tr {
    border-bottom: 1px solid #e0e0e0;
    height: 48px;
  }
  td {
    color: #2196f3 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
  }
  th {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  td,
  th {
    padding-left: 16px;
  }
  &__header {
    opacity: 0.7;
    font-size: 9px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #474747 !important;
    &-container {
    }
  }
  &__item {
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    text-decoration: none;
    color: #2196f3 !important;
  }

  &__no-match {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.17;
    opacity: 0.3;
    letter-spacing: normal;
    color: #212121;
  }
  &__sub-item {
    font-size: 9px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #757575;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
