<template>
  <v-menu
    :offset-y="true"
    bottom
    min-width="260px"
    :max-width="filteredSelectValueDate === 'between' ? '450px' : '260px'"
    :close-on-content-click="false"
    class="filter__container"
    v-if="filterableType"
    max-height="260px"
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
          :menu-props="{ offsetY: true }"
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
          :menu-props="{ offsetY: true }"
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
          :menu-props="{ offsetY: true }"
          @change="changeDateSelect"
          placeholder="Select an option"
        ></v-select>
        <InputDate
          :key="column.property + 'a'"
          v-if="filteredSelectValueDate !== 'between'"
          v-model="filteredDateValue"
          type="datetime"
          ref="refPicker"
          style="width: 100%; max-width: 260px; margin-bottom: 14px;"
        />
        <InputDate
          :key="column.property"
          v-if="filteredSelectValueDate === 'between'"
          v-model="filteredDateRangeValue"
          ref="refPicker2"
          type="datetimerange"
          style="margin-bottom: 14px;"
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
          v-model="filterChecked"
          :key="item.value"
          color="#2196f3"
          :value="item.value"
          :label="item.text"
        >
        </v-checkbox>
      </template>
      <div class="filter__footer">
        <v-btn text class="filter__footer-button" color="#f56c6c" @click="clearFilter">
          Clear
        </v-btn>
        <v-btn
          :disabled="getFilterButtonDisabled"
          text
          class="filter__footer-button"
          color="#2196f3"
          @click="handleFilter"
        >
          Filter
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
import InputDate from '@/components/Common/Inputs/InputDate'

export default {
  name: 'DataTableFilter',
  components: { InputDate },
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
    filterableCustomFieldName: {
      type: String,
      default: null
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
      filteredSelectValueNum: '=',
      filteredSelectValueDate: '<=',
      filteredDateValue: this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      filteredDateRangeValue: [
        this.$moment(Date.now()).subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
        this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      ],
      filterValue: '',
      filterChecked: [],
      textFilterItems: [
        { text: 'Contains', value: 'Contains' },
        { text: 'Equal', value: '=' },
        { text: 'Not Equal', value: '!=' }
      ],
      numericFilterItems: [
        { text: 'Equal', value: '=' },
        { text: 'Not Equal', value: '!=' },
        { text: 'Greater than', value: '>' },
        { text: 'Greater than or equal', value: '>=' },
        { text: 'Less than', value: '<' },
        { text: 'Less than equal', value: '<=' }
      ],
      dateFilterItems: [
        { text: 'Exact date', value: '=' },
        { text: 'After', value: '>=' },
        { text: 'Before', value: '<=' },
        { text: 'Between', value: 'between' }
      ],
      pickerOptions: {},
      convertedFilterableItems: []
    }
  },
  mounted() {},
  created() {
    if (this.filterableType === 'select') {
      this.filterableItems.forEach((x) => {
        this.convertedFilterableItems.push(
          typeof x == 'string' ? { text: x, value: x } : { text: x.text, value: x.value }
        )
      })
    }
  },
  methods: {
    changeDateSelect() {},
    clearFilter() {
      this.menu = false
      this.isFilterActive = false
      this.filterValue = ''
      this.filteredDateValue = null
      this.filterChecked = []
      this.filteredSelectValueNum = ''
      this.$emit('handleClearColumnFilter', this.fieldName)
    },
    handleFilter() {
      this.menu = false
      this.isFilterActive = true

      if (this.filterableType === 'text') {
        this.$emit('handleFilterColumn', {
          Value: this.filterValue,
          FieldName: this.fieldName,
          Operator: this.filteredSelectValue
        })
      }
      if (this.filterableType === 'numeric') {
        this.$emit('handleFilterColumn', {
          Value: this.filterValue,
          FieldName: this.fieldName,
          Operator: this.filteredSelectValueNum
        })
      }
      if (this.filterableType === 'date') {
        if (this.filteredSelectValueDate === 'between') {
          this.$emit('handleFilterColumn', [
            {
              Value: this.filteredDateRangeValue[0],
              FieldName: this.fieldName,
              Operator: '>='
            },
            {
              value: this.filteredDateRangeValue[1],
              FieldName: this.fieldName,
              Operator: '<='
            }
          ])
        } else {
          this.$emit('handleFilterColumn', {
            Value: this.filteredDateValue,
            FieldName: this.fieldName,
            Operator: this.filteredSelectValueDate
          })
        }
      }
      if (this.filterableType === 'select') {
        this.$emit('handleFilterColumn', {
          Value: this.filterChecked.toString(),
          FieldName: this.fieldName,
          Operator: 'Include'
        })
      }
    }
  },
  computed: {
    searchInItems: function () {
      return this.filterValue.length > 0
        ? this.convertedFilterableItems.filter((item) => {
            return item.text.toLowerCase().startsWith(this.filterValue.toLowerCase())
          })
        : this.convertedFilterableItems
    },
    getFilterButtonDisabled() {
      switch (this.filterableType) {
        case 'text':
          return !this.filterValue
        case 'select':
          return !this.filterChecked.length
        case 'numeric':
          return !this.filterValue
        case 'date':
          return !this.filteredDateValue
        default:
          return false
      }
    },
    fieldName: function () {
      return this.filterableCustomFieldName || this.column.property
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
  }
  &__body-container {
    background-color: white;
    padding: 20px 20px 0 20px;
    position: relative;
  }
  &__footer {
    display: flex;
    margin-right: -13px;
    margin-top: -10px !important;
    justify-content: flex-end;
    position: sticky;
    bottom: 0;

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
    }
  }
}
.data-table-filter__date-picker {
}
</style>
