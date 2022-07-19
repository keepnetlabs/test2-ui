<template>
  <div class="target-users-map table-box-shadow">
    <v-form ref="refMapTableForm">
      <table class="table">
        <tr class="target-users-map__header">
          <th
            v-for="(header, index) in mapTableData && mapTableData.headers"
            :key="`${header.name + index} `"
          >
            {{ header.name }}
            <v-select
              v-model="mapTableData.headers[index].selectedValue"
              :items="mapTableData.columns"
              outlined
              class="input-select standard-height mt-4 target-users-map__header-select"
              placeholder="- None Selected -"
              item-text="name"
              hide-details
              return-object
              :menu-props="{ offsetY: true }"
              :disabled="header.isSelectDisabled"
              @input="setSelectDisableItems"
              @change="setSelectDisableItemsChange($event, header, index)"
            >
            </v-select>
          </th>
        </tr>
        <tr
          class="target-users-map__body"
          v-for="(item, index) in mapTableData && mapTableData.tableData"
          :key="`${item + index + 1} `"
        >
          <td v-for="excel in item" :key="`${excel + index + 2} `">
            <span>
              <v-tooltip bottom opacity="1" v-if="excel && excel.length > 23">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ excel }}</span>
                </template>
                <span class="tooltip-span">{{ excel }}</span>
              </v-tooltip>
              <span v-else>{{ excel }}</span>
            </span>
          </td>
        </tr>
      </table>
    </v-form>
  </div>
</template>

<script>
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'MapTable',
  computed: {
    columns() {
      return !this.mapTableData ? [] : this.mapTableData.columns
    }
  },
  data() {
    return {
      select: [],
      changeItemName: null
    }
  },
  props: { mapTableData: { required: true } },
  methods: {
    showErrorSelect() {
      setTimeout(() => {
        let el = this.$refs.refMapTableForm.$el.querySelector('.error--text')
        scrollToComponent(el)
      }, 250)
    },
    checkItem(item) {
      return item['required']
    },
    setSelectDisableItemsToFalse(item) {
      this.mapTableData.columns = this.mapTableData.columns.map((i) => {
        let item = { ...i, disabled: false }
        return item
      })
    },
    setSelectDisableItems(item) {
      this.changeItemName = item.name
    },
    setSelectDisableItemsChange(item, header, index) {
      item.disabled = true
      let _this = this
      item.selectedValue = item.name
      this.mapTableData.columns = this.mapTableData.columns.map((i) => {
        let isDisabled = _this.mapTableData.headers.find((x) => {
          return x.selectedValue && x.selectedValue.name === i.name
        })
        let obj = {
          ...i,
          disabled: isDisabled
        }
        return obj
      })
      this.mapTableData.columns[0].disabled = false
      this.$emit('on-change', { ...item, header, index })
    },
    setDisabilityOfSelect() {
      this.mapTableData.columns = this.mapTableData.columns.map((i) => {
        let isDisabled = this.mapTableData.headers.find((x) => {
          return x.selectedValue && x.selectedValue.name === i.name
        })
        return {
          ...i,
          disabled: isDisabled
        }
      })
      this.mapTableData.columns[0].disabled = false
    },
    setExistItems() {
      this.mapTableData.columns = this.mapTableData.columns.map((i) => {
        const isExist = this.mapTableData.headers.find((hItem) => {
          if (!hItem.selectedValue?.dbName || !i?.dbName) {
            return false
          }
          return (
            hItem.selectedValue?.name?.replace(/\s+/g, '')?.toLowerCase() ===
            i?.name?.replace(/\s+/g, '')?.toLowerCase()
          )
        })
        return {
          ...i,
          disabled: !!isExist || false,
          selected: !!isExist || false,
          selectedValue: isExist || null
        }
      })
    },
    exportMapTableData() {
      let data = this.mapTableData.headers.map((item) => {
        let dataObject = {
          name: item.name,
          selected: item.disabled,
          selectedValue: item.selectedValue
        }
        return dataObject
      })
      return data
    },
    getMapTableDataValidation() {
      return this.$refs.refMapTableForm.validate()
    },
    getMapTableData() {
      return this.mapTableData
    }
  }
}
</script>
