<template>
  <el-table ref="refTable" :key="tableKey" :data="tableData" style="width: 100%;" class="mapper">
    <el-table-column
      :key="col.property"
      v-for="col in columns"
      :width="col.width"
      :label="col.label"
      :prop="col.property"
      v-if="col.show"
    >
      <template v-slot:header="{}">
        <div>
          <div class="mapper__header-title">{{ col.label }}</div>
          <div>
            <v-select
              class="mt-3 mb-1"
              :items="getSelectItems(selectValues[col.property], col.property, col.isCustom)"
              item-disabled="disabled"
              item-text="text"
              :value="selectValues[col.property]"
              @input="handleSelectChange(col.property, $event)"
              item-value="value"
              outlined
              :placeholder="col.label || 'None'"
            ></v-select>
          </div>
        </div>
      </template>
      <template slot-scope="scope">
        <div>
          <span
            v-if="scope.row && scope.row[col.property] && selectValues[col.property] !== 'none'"
          >
            {{ getColumnValue(col.property, scope) }}
          </span>
          <span v-else></span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Mapper',
  data() {
    return {
      tableData: [],
      selectValues: {},
      tableKey: `table${Math.random()}`
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    columns() {}
  },
  methods: {
    loadWithDataArray(data) {
      this.tableData = data
    },
    getSelectItems(property, colProp, isCustom) {
      const items = this.columns.map((item) => {
        return {
          text: item.label,
          value: item.property,
          disabled:
            (property === 'none' && colProp === item.property) ||
            colProp === this.selectValues[item.property]
              ? false
              : !this.getSelectItemDisabled(item.property)
        }
      })
      if (isCustom) {
        return [{ text: 'None', value: 'none', disabled: false }, ...items]
      }
      return items.map((a) => {
        return { ...a, disabled: a.value !== property }
      })
    },
    handleSelectChange(prop, value) {
      this.selectValues[prop] = value
      this.tableKey = `table${Math.random()}`
    },
    getSelectItemDisabled(prop) {
      console.log(prop)
      return this.selectValues[prop] === 'none'
    },
    getColumnValue(property, scope) {
      return this.selectValues[property] === 'none' ? '' : scope.row[this.selectValues[property]]
    }
  },
  mounted() {
    this.columns.map((item) => {
      this.selectValues[item.property] = item.property
    })
  }
}
</script>

<style lang="scss">
.mapper {
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);
  border-radius: 12px;
  max-width: 1500pxD;
  .v-text-field__details {
    display: none;
  }
  &__header-title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    text-align: center;
  }
  .el-table__header-wrapper {
    padding: 10px 0 0 6px;
  }

  td {
    border-right: solid 1px #ebeef5 !important;
    padding-left: 9px;
  }

  th.is-leaf {
    border-bottom: solid 1px #9e9e9e;
    border-right: solid 1px #ebeef5;
  }
  th > .cell {
    padding-right: 16px;
    padding-left: 16px;
  }
  .el-table__body-wrapper {
    padding-left: 5px;
  }
}
</style>
