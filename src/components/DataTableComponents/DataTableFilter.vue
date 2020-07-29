<template>
  <v-menu
    :offset-y="true"
    bottom
    min-width="260px"
    max-width="{filteredSelectValueDate === 'Between' ? '330px' : '260px'}"
    :close-on-content-click="false"
    class="filter__container"
    v-if="filterableType"
    v-model="menu"
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" class="filter__icon" :color="isFilterActive === true ? '#409eff' : ''"
        >mdi-filter-variant</v-icon
      >
    </template>
    <div class="filter__body-container">
      <template v-if="filterableType === 'text'">
        <v-select
          :items="textFilterItems"
          dense
          height="40"
          outlined
          required
          v-model="filteredSelectValue"
        ></v-select>
        <v-text-field
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          v-model="filterValue"
          height="40"
        ></v-text-field>
      </template>
      <template v-if="filterableType === 'numeric'">
        <v-select
          :items="numericFilterItems"
          dense
          height="40"
          outlined
          required
          v-model="filteredSelectValueNum"
        ></v-select>
        <v-text-field
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          v-model="filterValue"
          height="40"
        ></v-text-field>
      </template>
      <template v-if="filterableType === 'date'">
        <v-select
          :items="dateFilterItems"
          dense
          height="40"
          outlined
          required
          v-model="filteredSelectValueDate"
          @change="changeDateSelect"
        ></v-select>
        <el-date-picker
          v-show="filteredSelectValueDate !== 'Between'"
          v-model="filteredDateValue"
          type="datetime"
          style="width: 100%; max-width: 260px; margin-bottom: 14px;"
          :default-time="['12:00:00']"
        />
        <el-date-picker
          v-show="filteredSelectValueDate === 'Between'"
          v-model="filteredDateValue"
          type="datetimerange"
          style="margin-bottom: 14px;"
          :default-time="['12:00:00']"
        />
      </template>
      <template v-if="filterableType === 'select'">
        <div>
          <v-text-field
            placeholder="Search"
            class="filter__text"
            outlined
            dense
            v-model="filterValue"
            height="40"
            style="margin-top: 1px;"
          ></v-text-field>
        </div>
        <v-checkbox
          v-for="item in searchInItems"
          :key="item"
          v-model="filterChecked"
          :value="item"
          :label="item"
        >
        </v-checkbox>
      </template>
      <div class="filter__footer">
        <v-btn text class="filter__footer-button" color="#f56c6c" @click="clearFilter">
          Clear
        </v-btn>
        <v-btn text class="filter__footer-button" color="#2196f3" @click="handleFilter">
          Filter
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'DataTableFilter',
  props: {
    column: {
      type: Object
    },
    filterableType: {
      type: String
    },
    filterableItems: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      menu: null,
      isFilterActive: false,
      filteredSelectValue: 'Contains',
      filteredSelectValueNum: 'Equal',
      filteredSelectValueDate: 'Before',
      filteredDateValue: null,
      filterValue: '',
      filterChecked: [],
      textFilterItems: ['Contains', 'Equal', 'Not Equal'],
      numericFilterItems: [
        'Equal',
        'Not equal',
        'Greater than',
        'Greater than or equal',
        'Less than',
        'Less than equal'
      ],
      dateFilterItems: ['Exact date', 'Before', 'After', 'Between'],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.filteredDateValue = Date.now() - 3600 * 1000 * 24 * 30
  },
  methods: {
    changeDateSelect(val) {
      this.filteredDateValue = Date.now() - 3600 * 1000 * 24 * 30
    },
    clearFilter() {
      this.menu = false
      this.isFilterActive = false
      this.filterValue = ''
      this.filteredDateValue = null
      this.filterChecked = []
      this.filteredSelectValueNum = ''
      this.$emit('handleClearColumnFilter', this.column.property)
    },
    handleFilter() {
      this.menu = false
      this.isFilterActive = true
      if (this.filterableType === 'text') {
        this.$emit('handleFilterColumn', {
          value: this.filterValue,
          FieldName: this.column.property,
          Operator: this.filteredSelectValue
        })
      }
      if (this.filterableType === 'numeric') {
        this.$emit('handleFilterColumn', {
          value: this.filterValue,
          FieldName: this.column.property,
          Operator: this.filteredSelectValueNum
        })
      }
      if (this.filterableType === 'date') {
        this.$emit('handleFilterColumn', {
          value: this.filteredDateValue,
          FieldName: this.column.property,
          Operator: this.filteredSelectValueDate
        })
      }
      if (this.filterableType === 'select') {
        this.$emit('handleFilterColumn', {
          value: this.filterChecked,
          FieldName: this.column.property,
          Operator: 'Equal'
        })
      }
    }
  },
  computed: {
    searchInItems: function () {
      return this.filterValue.length > 0
        ? this.filterableItems.filter((item) => item.startsWith(this.filterValue))
        : this.filterableItems
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  &__icon {
    float: right;
    font-size: 20px;
    order: 1;
    margin-top: 7px;
  }
  &__container {
    // background-color: white;
  }
  &__body-container {
    background-color: white;
    padding: 20px 20px 0px 20px;
  }
  &__footer {
    display: flex;
    margin-right: -13px;
    margin-top: -10px !important;
    justify-content: flex-end;

    &-button {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }

  &__text {
    margin-top: -13px;
  }

  &__textfield {
    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
  }

  &__footer {
    background: #fff;
    padding: 10px 0;
  }
}
::v-deep {
  .v-input__slot {
    fieldset {
      border-radius: 8px;
      border: solid 1px rgba(0, 0, 0, 0.16);
      background-color: #ffffff;
    }
  }
}
</style>
