<template>
  <div class="target-users-map">
    <table class="table">
      <tr class="target-users-map__header">
        <th v-for="(header, index) in mapTableData && mapTableData.headers" :key="index">
          {{ header.name }}
          <v-select
            :items="headerItems"
            outlined
            class="input-select standard-height mt-4 target-users-map__header-select"
            placeholder="- None Selected -"
            item-text="name"
            @change="setSelectDisableItems"
            v-model="header.selectedValue"
            hide-details
          />
        </th>
      </tr>
      <tr
        class="target-users-map__body"
        v-for="(item, index) in mapTableData && mapTableData.tableData"
        :key="index"
      >
        <td v-for="excel in item" :key="excel">{{ excel }}</td>
      </tr>
      <!--<tr class="target-users-map__body">
        <td>This</td>
        <td>is also</td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>This</td>
        <td>is</td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>is</td>
      </tr>
      <tr class="target-users-map__body">
        <td>This</td>
        <td>is also</td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>This</td>
        <td>is</td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>
          equidistributed equidistributed equidistributed equidistributed equidistributed
          equidistributed.
        </td>
        <td>is</td>
      </tr>-->
    </table>
  </div>
</template>

<script>
export default {
  name: 'MapTable',
  computed: {
    headerItems() {
      return !this.mapTableData ? [] : this.mapTableData.headers
    }
  },
  data() {
    return {
      select: []
    }
  },
  props: { mapTableData: { required: true } },
  methods: {
    setSelectDisableItems(item) {
      this.mapTableData.headers.find((i) => i.name === item).disabled = true
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
    }
  }
}
</script>

<style lang="scss">
.target-users-map {
  .table {
    width: 100%;
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
    flex: 1 1 250px;
    min-width: 250px;
    max-width: 250px;
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
      td {
      }
    }
  }
}
</style>
