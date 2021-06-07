<template>
  <v-menu
    :offset-y="true"
    bottom
    :min-width="getWidth"
    :max-width="getWidth"
    :close-on-content-click="false"
    class="filter__container"
    v-if="filterableType"
    max-height="260px"
    v-model="menu"
    z-index="999"
  >
    <template v-slot:activator="{ on }">
      <v-icon
        v-on="on"
        class="filter__icon"
        :style="!sortable && { marginTop: '1px' }"
        :color="isFilterActive === true ? '#409eff' : ''"
        >mdi-filter-variant</v-icon
      >
    </template>
    <div class="filter__body-container">
      <template v-if="filterableType === 'text'">
        <v-select
          :items="getTextFilterItems"
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
          v-if="filteredSelectValue !== 'between'"
        ></v-text-field>
        <div class="d-flex" v-if="filteredSelectValue === 'between'">
          <v-text-field
            placeholder="Enter Value"
            class="filter__text"
            outlined
            dense
            v-model="filterValueBetween[0]"
            height="40"
            type="number"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          ></v-text-field>
          <span class="ml-2 mr-2" style="line-height: 12px;">-</span>
          <v-text-field
            placeholder="Enter Value"
            class="filter__text"
            outlined
            dense
            v-model="filterValueBetween[1]"
            height="40"
            type="number"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          ></v-text-field>
        </div>
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
          :key="$store.state.auth.user.userCompany.timeZone"
        ></v-select>
        <InputDate
          v-if="filteredSelectValueDate !== 'between'"
          v-model="filteredDateValue"
          type="datetime"
          ref="refPicker"
          style="width: 100%; max-width: 260px; margin-bottom: 14px;"
          :key="`${$store.state.auth.user.userCompany.timeZone}1`"
          :picker-options="this.defaultDate ? inBetweenDatesPickerOptions : ''"
        />
        <InputDate
          v-if="filteredSelectValueDate === 'between'"
          v-model="filteredDateRangeValue"
          ref="refPicker2"
          type="datetimerange"
          style="margin-bottom: 14px;"
          @change="handleChangeBetweenDatepicker"
          :key="`${$store.state.auth.user.userCompany.timeZone}2`"
          :picker-options="this.defaultDate ? inBetweenDatesPickerOptions : ''"
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
      <template v-if="filterableType === 'number'">
        <v-select
          :items="numberFilterItems"
          dense
          height="40"
          outlined
          required
          :menu-props="{ offsetY: true }"
          v-model="filteredSelectValueNumber"
        ></v-select>
        <v-text-field
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          v-model="filterValue"
          height="40"
          type="number"
          onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
        >
          ></v-text-field
        >
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
import { getTimeZoneForMoment } from '@/utils/functions'

export default {
  name: 'DataTableFilter',
  components: { InputDate },
  props: {
    column: {
      type: Object
    },
    filterProps: {
      type: Object
    },
    filterableType: {
      type: String
    },
    filterableItems: {
      type: Array,
      default: () => []
    },
    isSettingsOpened: {
      type: Boolean,
      default: false
    },
    filterableCustomFieldName: {
      type: String,
      default: null
    },
    sortable: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number
    },
    value: {
      default() {
        return {
          textValue: '',
          selectValue: ''
        }
      }
    },
    filterableOptions: {
      default() {
        return { exactDate: true, after: true, before: true, between: true }
      }
    },
    filterOptionProps: {
      required: false
    },
    defaultDate: {
      required: false
    }
  },
  data() {
    return {
      menu: null,
      isFilterActive:
        this.filterableType === 'select' ? !!this.value.selectValue : !!this.value.textValue,
      filteredSelectValue: this.filterProps
        ? this.filterProps.items && this.filterProps.items[0]
        : this.value.selectValue || 'Contains',
      filteredSelectValueNum: '=',
      filteredSelectValueNumber: '=',
      filteredSelectValueDate:
        this.filterableType === 'date'
          ? this.value.selectValue || this.defaultDate
            ? '>='
            : '<='
          : '<=',
      filteredDateValue:
        this.filterableType === 'date' &&
        this.value.selectValue !== 'between' &&
        this.value.selectValue
          ? this.value.textValue || this.$moment(Date.now()).format(getTimeZoneForMoment())
          : this.$moment(Date.now()).subtract(2, 'weeks').format(getTimeZoneForMoment()),
      filteredDateRangeValue:
        this.value.selectValue === 'between'
          ? [this.value.textValue[0], this.value.textValue[1]]
          : [
              this.defaultDate
                ? this.$moment(Date.now()).subtract(2, 'weeks').format(getTimeZoneForMoment())
                : this.$moment(Date.now()).subtract(1, 'months').format(getTimeZoneForMoment()),
              this.$moment(Date.now()).format(getTimeZoneForMoment())
            ],
      filterValue: this.value.textValue || '',
      filterValueBetween:
        this.value.selectValue === 'between'
          ? [this.value.textValue[0], this.value.textValue[1]]
          : [],
      filterChecked:
        this.filterableType === 'select'
          ? this.value.selectValue === ''
            ? []
            : this.value.selectValue.split(',')
          : [],
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
      numberFilterItems: [
        { text: 'Equal', value: '=' },
        { text: 'Not Equal', value: '!=' },
        { text: 'Greater than', value: '>' },
        { text: 'Greater than or equal', value: '>=' },
        { text: 'Less than', value: '<' },
        { text: 'Less than equal', value: '<=' }
      ],
      dateFilterItems: [
        { text: 'Exact date', value: '=', show: this.filterableOptions.exactDate },
        { text: 'After', value: '>=', show: this.filterableOptions.after },
        { text: 'Before', value: '<=', show: this.filterableOptions.before },
        { text: 'Between', value: 'between', show: this.filterableOptions.between }
      ],
      pickerOptions: {},
      convertedFilterableItems: []
    }
  },
  watch: {
    menu(newVal) {
      if (newVal) {
        this.$emit('update:isSettingsOpened', false)
      }
    }
  },
  created() {
    if (this.filterableType === 'select') {
      this.filterableItems.forEach((x) => {
        this.convertedFilterableItems.push(
          typeof x == 'string' ? { text: x, value: x } : { text: x.text, value: x.value }
        )
      })
    }
    this.dateFilterItems = this.dateFilterItems.reduce((acc, item) => {
      if (item.show) {
        acc.push(item)
      }
      return acc
    }, [])
  },
  beforeDestroy() {
    if (this.isFilterActive) {
      this.clearDataParams()
    }
  },
  methods: {
    changeDateSelect() {},
    handleChangeBetweenDatepicker(val) {
      if (!val) {
        this.filteredDateRangeValue = []
      }
    },
    clearFilter(isEmit = true) {
      this.clearDataParams()
      if (isEmit) {
        this.emitValue()
      }
      this.$emit('handleClearColumnFilter', this.fieldName)
    },
    clearDataParams() {
      this.menu = false
      this.isFilterActive = false
      this.filterValue = ''
      this.filterValueBetween = []
      this.filteredDateValue = null
      this.filterChecked = []
      this.filteredDateRangeValue = []
      this.filteredSelectValueNum = ''
      this.filteredSelectValueNumber = ''
    },
    emitValue(textValue = '', selectValue = '', fieldName = '') {
      this.$emit('input', { textValue, selectValue, fieldName })
    },
    handleFilter() {
      this.menu = false
      this.isFilterActive = true

      if (this.filterableType === 'text') {
        if (this.filteredSelectValue === 'between') {
          this.$emit('handleFilterColumn', [
            {
              Value: this.filterValueBetween[0],
              FieldName: this.fieldName,
              Operator: '>='
            },
            {
              value: this.filterValueBetween[1],
              FieldName: this.fieldName,
              Operator: '<='
            }
          ])
          this.emitValue(
            [this.filterValueBetween[0], this.filterValueBetween[1]],
            this.filteredSelectValue,
            this.fieldName
          )
        } else {
          this.$emit('handleFilterColumn', {
            Value: this.filterValue,
            FieldName: this.fieldName,
            Operator: this.filteredSelectValue
          })
          this.emitValue(this.filterValue, this.filteredSelectValue, this.fieldName)
        }
      }
      if (this.filterableType === 'numeric') {
        this.$emit('handleFilterColumn', {
          Value: this.filterValue,
          FieldName: this.fieldName,
          Operator: this.filteredSelectValueNum
        })
        this.emitValue(this.filterValue, this.filteredSelectValueNum, this.fieldName)
      }
      if (this.filterableType === 'number') {
        this.$emit('handleFilterColumn', {
          Value: this.filterValue,
          FieldName: this.fieldName,
          Operator: this.filteredSelectValueNumber
        })
        this.emitValue(this.filterValue, this.filteredSelectValueNumber, this.fieldName)
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
          this.emitValue(
            [this.filteredDateRangeValue[0], this.filteredDateRangeValue[1]],
            this.filteredSelectValueDate,
            this.fieldName
          )
        } else {
          this.$emit('handleFilterColumn', {
            Value: this.filteredDateValue,
            FieldName: this.fieldName,
            Operator: this.filteredSelectValueDate
          })
          this.emitValue(this.filteredDateValue, this.filteredSelectValueDate, this.fieldName)
        }
      }
      if (this.filterableType === 'select') {
        const Value = this.filterChecked.toString()
        const Operator = 'Include'
        this.$emit('handleFilterColumn', {
          Value,
          FieldName: this.fieldName,
          Operator
        })
        this.emitValue(this.filterValue, Value, this.fieldName)
      }
    }
  },
  computed: {
    inBetweenDatesPickerOptions() {
      return {
        disabledDate: (time) => {
          return !this.$moment(time.getTime()).isBetween(
            this.$moment(Date.now()).subtract(15, 'days').format(getTimeZoneForMoment()),
            this.$moment(Date.now()).format(getTimeZoneForMoment())
          )
        }
      }
    },
    getTextFilterItems() {
      if (this.filterOptionProps && this.filterOptionProps.length > 0) {
        return this.filterOptionProps
      }
      return this.filterProps
        ? this.filterProps.items && this.filterProps.items
        : this.textFilterItems
    },
    getWidth() {
      return this.filteredSelectValueDate === 'between' ? '450px' : '260px'
    },
    searchInItems: function () {
      return this.filterValue.length > 0
        ? this.convertedFilterableItems.filter((item) => {
            return item.text.toLowerCase().startsWith(this.filterValue.toLowerCase())
          })
        : this.convertedFilterableItems
    },
    checkTextFilterButtonIsDisabled() {
      if (this.filterValueBetween[0] && this.filterValueBetween[1]) {
        return false
      }
      if (this.filterValue) {
        return false
      }
      return true
    },
    getFilterButtonDisabled() {
      switch (this.filterableType) {
        case 'text':
          return this.checkTextFilterButtonIsDisabled
        case 'select':
          return !this.filterChecked.length
        case 'numeric':
          return !this.filterValue
        case 'date':
          if (this.filteredSelectValueDate === 'between') {
            return !this.filteredDateRangeValue.length
          }
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
