<template>
  <div>
    <data-table-tooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
    <table class="k-widget-list">
      <thead class="k-widget-list__header-container">
        <th
          :key="col.label"
          v-for="col in columns"
          class="k-widget-list__header"
          :style="col['thStyle'] && col['thStyle']"
        >
          {{ col.label }}
        </th>
      </thead>
      <tbody>
        <tr :key="JSON.stringify(row + rowIndex)" v-for="(row, rowIndex) in data">
          <td
            v-if="columns[index]"
            :key="JSON.stringify(value + key + index)"
            :style="columns[index]['tdStyle'] && columns[index]['tdStyle']"
            v-for="(value, key, index) in row"
            @mouseenter="handleMouseEnterTd($event, row[columns[index].property], rowIndex)"
            @mouseleave="handleMouseLeaveTd($event, row[columns[index].property], rowIndex)"
          >
            <slot
              :name="columns[index].property"
              :row="row"
              :value="row[columns[index].property]"
              :prop="columns[index].property"
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
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array
    },
    colStyle: {
      type: Object
    }
  },
  data() {
    return {
      showOverFlowTooltip: false,
      overFlowTooltipStyle: {},
      overFlowTooltipContent: ''
    }
  },
  methods: {
    handleMouseEnterTd(event, value, index) {
      const { target: parent } = event
      const parentRECT = parent.getBoundingClientRect()
      const parentWidth = Math.floor(parentRECT.width)
      const childRECT =
        parent.querySelector('.k-widget-list__item') &&
        parent.querySelector('.k-widget-list__item').getBoundingClientRect()
      if (childRECT && parentRECT) {
        const childWidth = Math.floor(childRECT.width) + 14
        value = value.toString()
        if (value && childWidth > parentWidth) {
          this.overFlowTooltipStyle = {
            top: `${80 + (index + 1) * 40}px`
          }
          this.overFlowTooltipContent = value
          this.showOverFlowTooltip = true
        }
      }
    },
    handleMouseLeaveTd(e) {
      this.showOverFlowTooltip = false
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
  position: relative;
  tr {
    border-bottom: 1px solid #e0e0e0;
    height: 40px;
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
  }
}
</style>
