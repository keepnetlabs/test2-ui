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
              :items="mapTableData.columns"
              outlined
              class="input-select standard-height mt-4 target-users-map__header-select"
              placeholder="- None Selected -"
              item-text="name"
              @change="setSelectDisableItems"
              v-model="mapTableData.headers[index].selectedValue"
              hide-details
              return-object
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
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export default {
  name: 'MapTable',
  computed: {
    columns() {
      return !this.mapTableData ? [] : this.mapTableData.columns
    }
  },
  data() {
    return {
      select: []
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
      if (item.name !== PROPERTY_STORE.NONE_SELECTED) {
        item.disabled = true
        let _this = this
        item.selectedValue = item.name
        this.mapTableData.columns = this.mapTableData.columns.map((i) => {
          let isDisabled = _this.mapTableData.headers.find((x) => {
            return (
              x.selectedValue &&
              x.selectedValue.name === i.name &&
              x.selectedValue.name !== PROPERTY_STORE.NONE_SELECTED
            )
          })
          let obj = { ...i, disabled: isDisabled }
          return obj
        })
      }
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

<style lang="scss">
.target-users-map {
  .table {
    border-spacing: 0px;
  }

  .table th {
    text-align: left;
    padding: 24px 16px 16px;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
  }
  .table td {
    text-align: left;
    padding: 0 32px;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #212121;
    display: flex;
    align-items: center;
    span {
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }

  .table tr {
    border-bottom: 1px solid #ddd;
  }
  td.edit-buttons {
    text-align: right;
  }
  button {
    border-radius: 3px;
    border: none;
    margin: 0 0.25em;
    transition: all 0.3s;
  }

  button:hover {
    box-shadow: 0 0 4px rgba(3, 3, 3, 0.8);
    opacity: 0.9;
  }

  button.edit {
    background: #6f9;
  }
  button.delete {
    background: #f69;
  }

  tr {
    display: flex;
    flex-direction: row;
  }
  td,
  th {
    flex: 1 1 235px;
    min-width: 235px;
    max-width: 235px;
    min-height: 60px;
    border: 0.5px solid rgba(3, 3, 3, 0.2);
  }
  td {
    min-height: 48px;
    max-height: 48px;
  }
  td.edit-buttons,
  td.empty {
    /*flex: 1 0 90%;
    text-align: center;*/
  }

  * {
    box-model: border-box;
  }
  &__header {
    &-select {
      .v-select__selection {
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
      }
    }
    th {
      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
      border-top: none !important;
      border: 1px solid #f2f2f2;
      border-bottom: 1px solid #9e9e9e;
      text-align: center;
    }
  }
  &__body {
    td {
      //height: 24px;
      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
      border: 1px solid #f2f2f2;
      border-top: none;
      border-bottom: 1px solid #b3d4fc;
      text-align: center;
    }
    &:last-child {
      border-bottom: none !important;
      td {
        border-bottom: none;
      }
    }
  }
}
</style>
