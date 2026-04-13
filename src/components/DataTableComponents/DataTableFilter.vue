<template>
  <v-menu
    v-if="filterableType"
    ref="refMenu"
    :value="menu"
    class="filter__container"
    :content-class="getMenuContentClass"
    bottom
    offset-y
    nudge-bottom="12"
    :nudge-left="getHorizontalNudge"
    :max-height="getMenuMaxHeight"
    :z-index="zIndex"
    :min-width="getWidth"
    :max-width="getMaxWidth"
    :close-on-content-click="false"
    :close-on-click="isCloseOnClick"
    @input="handleMenuVisibilityChange"
  >
    <app-dialog
      v-if="status"
      :icon="'mdi-alert'"
      title="Invalid Selection"
      title-id="text--invalid-section"
      :status="status"
      :body="'Selected date range cannot exceed 14 days'"
      @changeStatus="closeDialog"
    >
      <template #app-dialog-footer>
        <slot name="footer">
          <div class="d-flex justify-end">
            <v-btn text color="#2196f3" class="k-dialog__button" @click="closeDialog">
              OKAY
            </v-btn>
          </div>
        </slot>
      </template>
    </app-dialog>
    <template v-slot:activator="{ on }">
      <v-icon
        v-on="on"
        class="filter__icon"
        :style="!sortable && { marginTop: '1px' }"
        :color="isFilterActive === true ? '#409eff' : ''"
        >mdi-filter-variant</v-icon
      >
    </template>
    <div
      :class="[
        'filter__body-container',
        { 'filter__body-container--nested-select': filterableType === 'nestedSelect' }
      ]"
    >
      <template v-if="filterableType === 'text'">
        <v-select
          v-model="filteredSelectValue"
          :items="getTextFilterItems"
          dense
          height="40"
          outlined
          :menu-props="{ offsetY: true }"
          required
        ></v-select>
        <v-text-field
          v-if="filteredSelectValue !== 'between'"
          v-model="filterValue"
          class="filter__text"
          placeholder="Enter Value"
          outlined
          dense
          height="40"
        ></v-text-field>
        <div class="d-flex" v-if="filteredSelectValue === 'between'">
          <v-text-field
            v-model="filterValueBetween[0]"
            placeholder="Enter Value"
            class="filter__text"
            outlined
            dense
            height="40"
            type="number"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          ></v-text-field>
          <span class="ml-2 mr-2" style="line-height: 12px;">-</span>
          <v-text-field
            v-model="filterValueBetween[1]"
            placeholder="Enter Value"
            class="filter__text"
            outlined
            dense
            height="40"
            type="number"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          ></v-text-field>
        </div>
      </template>
      <template v-if="filterableType === 'numeric'">
        <v-select
          v-model="filteredSelectValueNum"
          :items="numericFilterItems"
          dense
          height="40"
          outlined
          required
          :menu-props="{ offsetY: true }"
        ></v-select>
        <v-text-field
          v-model="filterValue"
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          height="40"
        ></v-text-field>
      </template>
      <template v-if="filterableType === 'date'">
        <v-select
          v-if="filterableOptions.showSelect"
          v-model="filteredSelectValueDate"
          class="data-table-filter__date-picker-select"
          :items="dateFilterItems"
          dense
          height="40"
          outlined
          required
          :menu-props="{
            offsetY: true,
            contentClass: 'data-table-filter__date-picker-select-menu'
          }"
          placeholder="Select an option"
          :key="getDateKey"
          @click="handleDateSelectClick"
        ></v-select>
        <p class="datatable-filter-header" v-if="!filterableOptions.showSelect">
          Between
        </p>
        <InputDate
          v-if="filteredSelectValueDate !== 'between'"
          v-model="filteredDateValue"
          type="datetime"
          ref="refPicker"
          style="width: 100%; max-width: 260px; margin-bottom: 14px;"
          :key="`${getDateKey}1`"
          @change="handlePickerChange"
        />
        <InputDate
          v-if="filteredSelectValueDate === 'between'"
          v-model="filteredDateRangeValue"
          :key="`${getDateKey}2`"
          ref="refPicker2"
          type="datetimerange"
          style="margin-bottom: 14px;"
          @change="handleChangeBetweenDatepicker"
        />
      </template>
      <template v-if="filterableType === 'dateOnly'">
        <v-select
          v-if="filterableOptions.showSelect"
          v-model="filteredSelectValueDate"
          :items="dateFilterItems"
          ref="refPickerDateOnly"
          dense
          height="40"
          outlined
          required
          :menu-props="{ offsetY: true }"
          placeholder="Select an option"
          :key="getDateKey"
          @click="handleDateSelectClick"
        ></v-select>
        <p class="datatable-filter-header" v-if="!filterableOptions.showSelect">
          Between
        </p>
        <InputDate
          v-if="filteredSelectValueDate !== 'between'"
          v-model="filteredDateValue"
          type="date"
          ref="refPicker"
          style="width: 100%; max-width: 260px; margin-bottom: 14px;"
          :key="`${getDateKey}1`"
          :format="getTimeZone(true) || 'yyyy/MM/dd HH:mm'"
          :valueFormat="getTimeZone(true) || `yyyy/MM/dd HH:mm`"
          @change="handlePickerChange"
        />
        <InputDate
          v-if="filteredSelectValueDate === 'between'"
          v-model="filteredDateRangeValue"
          ref="refPicker2"
          type="daterange"
          style="margin-bottom: 14px;"
          :format="getTimeZone(true) || 'yyyy/MM/dd HH:mm'"
          :valueFormat="getTimeZone(true) || `yyyy/MM/dd HH:mm`"
          :key="`${getDateKey}2`"
          @change="handleChangeBetweenDatepicker"
        />
      </template>
      <template v-if="filterableType === 'select'">
        <div>
          <v-text-field
            v-if="isShowSearchTextField"
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
      <template v-if="filterableType === 'nestedSelect'">
        <div class="nested-select-filter">
          <div class="nested-select-filter__left">
            <v-list class="nested-select-filter__list">
              <v-list-item
              v-for="group in nestedFilterGroups"
              :key="group.key"
              :class="[
                'nested-select-filter__group',
                {
                  'nested-select-filter__group--active': activeNestedGroup === group.key,
                  'nested-select-filter__group--selected': hasAppliedNestedGroupSelection(group.key)
                }
              ]"
              tabindex="0"
              @click.stop="setActiveNestedGroup(group.key)"
              @keydown.enter.stop.prevent="setActiveNestedGroup(group.key)"
            >
              <v-list-item-title class="nested-select-filter__group-title">
                <div class="nested-select-filter__group-primary">
                  <v-icon
                    v-if="group.icon"
                    class="nested-select-filter__group-icon"
                  >
                    {{ group.icon }}
                  </v-icon>
                  <span class="nested-select-filter__group-label">{{ group.label }}</span>
                </div>
                <div class="nested-select-filter__group-meta">
                  <span
                    v-if="getAppliedNestedGroupSelectionCount(group.key) > 0"
                    class="nested-select-filter__group-count"
                  >
                    {{ getAppliedNestedGroupSelectionCount(group.key) }}
                  </span>
                  <v-icon class="nested-select-filter__group-arrow">mdi-menu-right</v-icon>
                </div>
              </v-list-item-title>
            </v-list-item>
            </v-list>
          </div>
          <div v-if="activeNestedGroupConfig" class="nested-select-filter__right">
            <div class="nested-select-filter__right-container">
              <v-text-field
                v-if="activeNestedGroupConfig.showSearch !== false"
                v-model="nestedSearchValues[activeNestedGroupConfig.key]"
                placeholder="Search"
                class="filter__text nested-select-filter__search"
                outlined
                dense
                height="40"
              ></v-text-field>
              <div class="nested-select-filter__items">
                <v-checkbox
                  v-for="item in getFilteredNestedGroupItems(activeNestedGroupConfig)"
                  :key="`${activeNestedGroupConfig.key}-${item.value}`"
                  v-model="nestedFilterSelections[activeNestedGroupConfig.key]"
                  color="#2196f3"
                  :value="item.value"
                  :label="item.text"
                  :ripple="false"
                  hide-details
                  class="mt-0 pt-0 nested-select-filter__checkbox"
                  @change="handleNestedSelectionChange(activeNestedGroupConfig.key)"
                >
                </v-checkbox>
              </div>
            </div>
            <div class="nested-select-filter__right-footer">
              <v-btn
                text
                class="filter__footer-button"
                color="#f56c6c"
                @click="clearNestedGroupSelection(activeNestedGroupConfig.key)"
              >
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
        </div>
      </template>
      <template v-if="filterableType === 'singleSelect'">
        <v-select
          v-model="filteredSingleValue"
          :items="convertedFilterableItems"
          item-text="text"
          item-value="value"
          dense
          height="40"
          outlined
          placeholder="Select an option"
          :menu-props="{ offsetY: true, contentClass: 'single-select-filter__menu' }"
          hide-details
          style="margin-bottom: 12px;"
        />
      </template>
      <template v-if="filterableType === 'compositeSelect'">
        <label style="font-size: 13px; font-weight: 600; margin-bottom: 4px; display: block;">Month</label>
        <v-select
          v-model="filteredSingleValue"
          :items="convertedFilterableItems"
          item-text="text"
          item-value="value"
          dense
          height="40"
          outlined
          placeholder="Select a month"
          :menu-props="{ offsetY: true, contentClass: 'single-select-filter__menu' }"
          hide-details
          style="margin-bottom: 12px;"
        />
        <label style="font-size: 13px; font-weight: 600; margin-bottom: 4px; display: block;">Status</label>
        <v-select
          v-model="compositeSecondValue"
          :items="compositeSecondItems"
          item-text="text"
          item-value="value"
          dense
          height="40"
          outlined
          placeholder="Select status"
          :menu-props="{ offsetY: true, contentClass: 'single-select-filter__menu' }"
          hide-details
          style="margin-bottom: 12px;"
        />
      </template>
      <template v-if="filterableType === 'number' || filterableType === 'negativeNumber'">
        <v-select
          v-model="filteredSelectValueNumber"
          :items="numberFilterItems"
          dense
          height="40"
          outlined
          required
          :menu-props="{ offsetY: true }"
        ></v-select>
        <v-text-field
          v-if="filterableType === 'number'"
          v-model="filterValue"
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          height="40"
          type="number"
          onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
        ></v-text-field>
        <v-text-field
          v-else-if="filterableType === 'negativeNumber'"
          v-model="filterValue"
          ref="refInputNumber"
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          height="40"
          type="number"
          onkeypress="return event.target.value.includes('--') ? false : event.target.value.length ? event.target.value.indexOf('-') === 0 ? (event.keyCode === 8 || (event.charCode >= 48 && event.charCode <= 57)) : (!event.target.value.includes('-') && event.charCode !== 45 && (event.charCode >= 48 && event.charCode <= 57)) : event.charCode === 45 || (event.charCode >= 48 && event.charCode <= 57);"
        ></v-text-field>
      </template>
      <div v-if="filterableType !== 'nestedSelect'" class="filter__footer">
        <v-btn text class="filter__footer-button" color="#f56c6c" @click="clearFilter">
          Clear
        </v-btn>
        <v-btn
          :key="btnKeySafariFix"
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
import { createRandomCryptStringNumber, getTimeZoneForMoment, getTimeZone } from '@/utils/functions'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DataTableFilter',
  components: { InputDate, AppDialog },
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
    filterableConfig: {
      type: Object,
      default: null
    },
    isSettingsOpened: {
      type: Boolean,
      default: false
    },
    filterableCustomFieldName: {
      type: String,
      default: null
    },
    showSelectSearch: {
      type: Boolean,
      default: true
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
    showSelect: {
      required: false,
      default: true
    },
    filterableOptions: {
      default() {
        return {
          exactDate: true,
          after: true,
          before: true,
          between: true,
          showSelect: true
        }
      }
    },
    filterOptionProps: {
      required: false
    },
    compositeSecondItems: {
      type: Array,
      default: () => []
    },
    compositeSecondFieldName: {
      type: String,
      default: null
    },
    defaultFilterValue: {
      default: null
    },
    defaultCompositeSecondValue: {
      default: null
    },
    defaultDate: {
      required: false
    }
  },
  data() {
    let filteredSelectValueDate = '<='
    if (this.filterableType === 'date') {
      filteredSelectValueDate =
        this.value.selectValue || this.defaultDate ? this.value.selectValue : '<='
    }
    let filterChecked = []
    if (this.filterableType === 'select') {
      filterChecked = this.value.selectValue === '' ? [] : this.value.selectValue.split(',')
    }
    const filteredSingleValue =
      ['singleSelect', 'compositeSelect'].includes(this.filterableType)
        ? this.value.selectValue || this.defaultFilterValue || null
        : null
    const nestedFilterSelections =
      this.filterableType === 'nestedSelect'
        ? this.getInitialNestedFilterSelections()
        : {}
    const nestedSearchValues =
      this.filterableType === 'nestedSelect'
        ? this.getEmptyNestedSearchValues()
        : {}
    return {
      isCloseOnClick: true,
      status: false,
      zIndex: this.filterableType === 'nestedSelect' ? 302 : 202,
      menu: null,
      btnKeySafariFix: `btn-key-${createRandomCryptStringNumber()}`,
      isFilterActive:
        this.filterableType === 'nestedSelect'
          ? this.hasAnyNestedSelection(nestedFilterSelections)
          : ['select', 'singleSelect', 'compositeSelect'].includes(this.filterableType)
          ? !!this.value.selectValue
          : !!this.value.textValue,
      activeNestedGroup: '',
      nestedFilterSelections,
      nestedSearchValues,
      filteredSingleValue,
      filteredSelectValue: this.filterProps
        ? this.filterProps.items && this.filterProps.items[0]
        : this.value.selectValue || 'Contains',
      filteredSelectValueNum: '=',
      filteredSelectValueNumber: '=',
      filteredSelectValueDate,
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
      filterChecked,
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
        { text: 'Less than or equal', value: '<=' }
      ],
      numberFilterItems: [
        { text: 'Equal', value: '=' },
        { text: 'Not Equal', value: '!=' },
        { text: 'Greater than', value: '>' },
        { text: 'Greater than or equal', value: '>=' },
        { text: 'Less than', value: '<' },
        { text: 'Less than or equal', value: '<=' }
      ],
      dateFilterItems: [
        {
          text: 'Exact date',
          value: '=',
          show: this.filterableOptions.exactDate
        },
        { text: 'After', value: '>=', show: this.filterableOptions.after },
        { text: 'Before', value: '<=', show: this.filterableOptions.before },
        {
          text: 'Between',
          value: 'between',
          show: this.filterableOptions.between
        }
      ],
      compositeSecondValue: this.defaultCompositeSecondValue || null,
      pickerOptions: {},
      convertedFilterableItems: []
    }
  },
  watch: {
    menu(newVal) {
      if (newVal) {
        this.zIndex = ['date', 'dateOnly'].includes(this.filterableType) ? 252 : 202
        this.$emit('update:isSettingsOpened', false)
        if (this.filterableType === 'nestedSelect') {
          this.syncNestedFilterConfig()
        }
      }
    },
    getFilterButtonDisabled() {
      this.btnKeySafariFix = `btn-key-${createRandomCryptStringNumber()}`
    },
    filterableConfig: {
      handler() {
        if (this.filterableType === 'nestedSelect') {
          this.syncNestedFilterConfig()
        }
      },
      deep: true
    },
    filterableItems(newItems) {
      if (['select', 'singleSelect', 'compositeSelect'].includes(this.filterableType)) {
        this.convertedFilterableItems = newItems.map((x) =>
          typeof x === 'string' ? { text: x, value: x } : { text: x.text, value: x.value }
        )
      }
    }
  },
  created() {
    if (this.filterableType === 'nestedSelect') {
      this.syncNestedFilterConfig()
    }
    if (['select', 'singleSelect', 'compositeSelect'].includes(this.filterableType)) {
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
    if (this.defaultDate) {
      this.isFilterActive = true
      this.emitValue(...this.filteredDateRangeValue, this.filteredSelectValueDate, this.fieldName)
    }
  },
  beforeDestroy() {
    if (this.isFilterActive) {
      this.clearDataParams()
    }
  },
  methods: {
    handleMenuVisibilityChange(val) {
      const { refPicker, refPicker2, refPickerDateOnly, refMenu } = this.$refs
      if (
        (refPicker && refPicker.pickerVisible) ||
        (refPicker2 && refPicker2.pickerVisible) ||
        (refPickerDateOnly && refPickerDateOnly.pickerVisible)
      ) {
        this.isCloseOnClick = false
        this.menu = true
        refMenu.isActive = true
        return
      }
      this.isCloseOnClick = true
      this.menu = val
      if (this.filterableType === 'nestedSelect') {
        if (val) {
          this.activeNestedGroup = this.nestedFilterGroups[0]?.key || ''
        } else {
          this.activeNestedGroup = ''
          this.nestedSearchValues = this.getEmptyNestedSearchValues()
        }
      }
    },
    handlePickerChange() {
      const { refMenu } = this.$refs
      this.isCloseOnClick = true
      this.menu = true
      refMenu.isActive = true
    },
    getTimeZone(isDate) {
      return getTimeZone(isDate)
    },
    closeDialog() {
      this.status = false
    },
    handleChangeBetweenDatepicker(val) {
      this.handlePickerChange()
      if (!val) {
        this.filteredDateRangeValue = [
          this.defaultDate
            ? this.$moment(Date.now()).subtract(2, 'weeks').format(getTimeZoneForMoment())
            : this.$moment(Date.now()).subtract(1, 'months').format(getTimeZoneForMoment()),
          this.$moment(Date.now()).format(getTimeZoneForMoment())
        ]
      } else {
        const value1 = this.$moment(val[0], getTimeZoneForMoment())
        const value2 = this.$moment(val[1], getTimeZoneForMoment())
        const diff = value2.diff(value1, 'days')
        if (diff > 14 && this.defaultDate) {
          this.status = true
          this.filteredDateRangeValue = [
            this.$moment(Date.now()).subtract(2, 'weeks').format(getTimeZoneForMoment()),
            this.$moment(Date.now()).format(getTimeZoneForMoment())
          ]
        }
      }
    },
    handleDateSelectClick() {
      const { refPicker, refPicker2, refPickerDateOnly } = this.$refs
      this.hidePicker(refPicker)
      this.hidePicker(refPicker2)
      this.hidePicker(refPickerDateOnly)
    },
    hidePicker(refPicker) {
      if (refPicker && refPicker.pickerVisible) {
        refPicker.hidePicker()
      }
    },
    clearFilter(isEmit = true) {
      if (this.filterableType === 'nestedSelect') {
        this.clearAllNestedSelections(isEmit)
        return
      }
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
      this.filteredDateRangeValue = [
        this.defaultDate
          ? this.$moment(Date.now()).subtract(2, 'weeks').format(getTimeZoneForMoment())
          : this.$moment(Date.now()).subtract(1, 'months').format(getTimeZoneForMoment()),
        this.$moment(Date.now()).format(getTimeZoneForMoment())
      ]
      // Reset number filter selects to default value '=' instead of empty string
      this.filteredSelectValueNum = '='
      this.filteredSelectValueNumber = '='
      this.filteredSingleValue = null
      this.compositeSecondValue = null
      if (this.filterableType === 'nestedSelect') {
        this.activeNestedGroup = ''
        this.nestedFilterSelections = this.getEmptyNestedFilterSelections()
        this.nestedSearchValues = this.getEmptyNestedSearchValues()
      }
    },
    emitValue(textValue = '', selectValue = '', fieldName = '') {
      this.$emit('input', { textValue, selectValue, fieldName })
    },
    emitNestedValue(nestedSelections = this.getSerializableNestedSelections()) {
      this.$emit('input', {
        textValue: '',
        selectValue: '',
        fieldName: this.fieldName,
        nestedSelections
      })
    },
    getNormalizedNestedGroups() {
      return (this.filterableConfig?.groups || []).map((group) => ({
        ...group,
        items: (group.items || []).map((item) =>
          typeof item === 'string' ? { text: item, value: item } : item
        )
      }))
    },
    getEmptyNestedFilterSelections() {
      return this.getNormalizedNestedGroups().reduce((acc, group) => {
        acc[group.key] = []
        return acc
      }, {})
    },
    getEmptyNestedSearchValues() {
      return this.getNormalizedNestedGroups().reduce((acc, group) => {
        acc[group.key] = ''
        return acc
      }, {})
    },
    getInitialNestedFilterSelections() {
      const baseSelections = this.getEmptyNestedFilterSelections()
      const valueSelections = this.value?.nestedSelections || {}
      Object.keys(baseSelections).forEach((key) => {
        if (Array.isArray(valueSelections[key])) {
          baseSelections[key] = [...valueSelections[key]]
        }
      })
      return baseSelections
    },
    getSerializableNestedSelections() {
      return Object.keys(this.nestedFilterSelections).reduce((acc, key) => {
        acc[key] = [...(this.nestedFilterSelections[key] || [])]
        return acc
      }, {})
    },
    hasAnyNestedSelection(selections = this.nestedFilterSelections) {
      return Object.values(selections).some((items) => Array.isArray(items) && items.length > 0)
    },
    getExclusiveNestedGroupKey(selections = {}) {
      if (!this.isNestedGroupsExclusive) return ''
      const activeGroupHasSelection = Array.isArray(selections[this.activeNestedGroup])
        ? selections[this.activeNestedGroup].length > 0
        : false
      if (activeGroupHasSelection) return this.activeNestedGroup
      const firstSelectedGroup = this.nestedFilterGroups.find(
        (group) => Array.isArray(selections[group.key]) && selections[group.key].length > 0
      )
      return firstSelectedGroup?.key || ''
    },
    normalizeExclusiveNestedSelections(selections = {}) {
      if (!this.isNestedGroupsExclusive) return selections
      const activeGroupKey = this.getExclusiveNestedGroupKey(selections)
      if (!activeGroupKey) return selections
      return Object.keys(selections).reduce((acc, key) => {
        acc[key] = key === activeGroupKey ? [...(selections[key] || [])] : []
        return acc
      }, {})
    },
    syncNestedFilterConfig() {
      const nextSelections = this.getEmptyNestedFilterSelections()
      const nextSearchValues = this.getEmptyNestedSearchValues()
      const valueSelections = this.value?.nestedSelections || {}
      Object.keys(nextSelections).forEach((key) => {
        if (Array.isArray(this.nestedFilterSelections[key])) {
          nextSelections[key] = [...this.nestedFilterSelections[key]]
        } else if (Array.isArray(valueSelections[key])) {
          nextSelections[key] = [...valueSelections[key]]
        }
      })
      const normalizedSelections = this.normalizeExclusiveNestedSelections(nextSelections)
      this.nestedFilterSelections = normalizedSelections
      Object.keys(nextSearchValues).forEach((key) => {
        if (typeof this.nestedSearchValues[key] === 'string') {
          nextSearchValues[key] = this.nestedSearchValues[key]
        }
      })
      this.nestedSearchValues = nextSearchValues
      this.isFilterActive = this.hasAnyNestedSelection(normalizedSelections)
      if (
        this.activeNestedGroup &&
        !this.nestedFilterGroups.some((group) => group.key === this.activeNestedGroup)
      ) {
        this.activeNestedGroup = ''
      }
    },
    setActiveNestedGroup(groupKey = '') {
      if (!groupKey) return
      this.activeNestedGroup = groupKey
    },
    buildNestedFilterItems(groupKey = '') {
      const groupsToApply = groupKey
        ? this.nestedFilterGroups.filter((group) => group.key === groupKey)
        : this.nestedFilterGroups
      return groupsToApply.reduce((acc, group) => {
        const selectedValues = this.nestedFilterSelections[group.key] || []
        if (!selectedValues.length) return acc
        acc.push({
          Value: selectedValues.toString(),
          FieldName: group.fieldName,
          Operator: group.operator || 'Include'
        })
        return acc
      }, [])
    },
    getNestedFieldNames() {
      return this.nestedFilterGroups.map((group) => group.fieldName)
    },
    getAppliedNestedSelections() {
      return this.value?.nestedSelections || {}
    },
    getAppliedNestedGroupSelectionCount(groupKey = '') {
      return (this.getAppliedNestedSelections()[groupKey] || []).length
    },
    hasAppliedNestedGroupSelection(groupKey = '') {
      return this.getAppliedNestedGroupSelectionCount(groupKey) > 0
    },
    getNestedGroupSelectionCount(groupKey = '') {
      return (this.nestedFilterSelections[groupKey] || []).length
    },
    hasNestedGroupSelection(groupKey = '') {
      return this.getNestedGroupSelectionCount(groupKey) > 0
    },
    clearInactiveNestedSelections(activeGroupKey = '') {
      if (!this.isNestedGroupsExclusive || !activeGroupKey) return
      this.nestedFilterGroups.forEach((group) => {
        if (group.key !== activeGroupKey) {
          this.$set(this.nestedFilterSelections, group.key, [])
          this.$set(this.nestedSearchValues, group.key, '')
        }
      })
    },
    getFilteredNestedGroupItems(group = {}) {
      const items = group.items || []
      const searchValue = this.nestedSearchValues[group.key] || ''
      if (!searchValue) return items
      return items.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    },
    handleNestedSelectionChange(groupKey = '') {
      if (!groupKey) return
      this.clearInactiveNestedSelections(groupKey)
      this.isFilterActive = this.hasAnyNestedSelection()
    },
    clearNestedGroupSelection(groupKey = '') {
      if (!groupKey) return
      this.$set(this.nestedFilterSelections, groupKey, [])
      this.$set(this.nestedSearchValues, groupKey, '')
      const nestedFilterItems = this.buildNestedFilterItems()
      this.menu = false
      this.isFilterActive = this.hasAnyNestedSelection()
      if (!nestedFilterItems.length) {
        this.$emit('handleClearColumnFilter', this.getNestedFieldNames())
        return
      }
      this.emitNestedValue()
      this.$emit('handleFilterColumn', {
        filters: nestedFilterItems,
        clearFieldNames: this.getNestedFieldNames()
      })
    },
    clearAllNestedSelections(isEmit = true) {
      this.clearDataParams()
      if (isEmit) {
        this.$emit('handleClearColumnFilter', this.getNestedFieldNames())
      }
    },
    handleFilter() {
      this.menu = false
      this.isFilterActive = true

      if (this.filterableType === 'nestedSelect') {
        this.clearInactiveNestedSelections(this.activeNestedGroup)
        const nestedFilterItems = this.buildNestedFilterItems(
          this.isNestedGroupsExclusive ? this.activeNestedGroup : ''
        )
        this.isFilterActive = nestedFilterItems.length > 0
        if (!nestedFilterItems.length) {
          this.$emit('handleClearColumnFilter', this.getNestedFieldNames())
          return
        }
        this.emitNestedValue()
        this.$emit('handleFilterColumn', {
          filters: nestedFilterItems,
          clearFieldNames: this.getNestedFieldNames()
        })
        return
      }

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
      if (this.filterableType === 'number' || this.filterableType === 'negativeNumber') {
        this.$emit('handleFilterColumn', {
          Value: this.filterValue,
          FieldName: this.fieldName,
          Operator: this.filteredSelectValueNumber
        })
        this.emitValue(this.filterValue, this.filteredSelectValueNumber, this.fieldName)
      }
      if (this.filterableType === 'date' || this.filterableType === 'dateOnly') {
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
      if (this.filterableType === 'singleSelect') {
        this.$emit('handleFilterColumn', {
          Value: this.filteredSingleValue,
          FieldName: this.fieldName,
          Operator: '='
        })
        this.emitValue(this.filteredSingleValue, this.filteredSingleValue, this.fieldName)
      }
      if (this.filterableType === 'compositeSelect') {
        const items = [
          {
            Value: this.filteredSingleValue,
            FieldName: this.fieldName,
            Operator: '='
          }
        ]
        if (this.compositeSecondValue && this.compositeSecondFieldName) {
          items.push({
            Value: this.compositeSecondValue,
            FieldName: this.compositeSecondFieldName,
            Operator: 'Include'
          })
        }
        this.$emit('handleFilterColumn', items)
        this.emitValue(this.filteredSingleValue, this.filteredSingleValue, this.fieldName)
      }
    }
  },
  computed: {
    getMenuContentClass() {
      return this.filterableType === 'nestedSelect'
        ? 'data-table-filter__menu-content data-table-filter__menu-content--nested'
        : 'data-table-filter__menu-content'
    },
    getMenuMaxHeight() {
      return this.filterableType === 'nestedSelect' ? 420 : 260
    },
    isShowSearchTextField() {
      return this.showSelectSearch && (this.filterValue || this.searchInItems.length > 4)
    },
    nestedFilterGroups() {
      return this.getNormalizedNestedGroups()
    },
    activeNestedGroupConfig() {
      if (!this.activeNestedGroup) return null
      return this.nestedFilterGroups.find((group) => group.key === this.activeNestedGroup) || null
    },
    isNestedGroupsExclusive() {
      return this.filterableConfig?.exclusiveGroups === true
    },
    getDateKey() {
      return this.$store?.state?.auth?.user?.userCompany?.timeZone
    },
    getTextFilterItems() {
      if (this.filterOptionProps && this.filterOptionProps.length > 0) {
        return this.filterOptionProps
      }
      return this.filterProps ? this.filterProps.items : this.textFilterItems
    },
    getWidth() {
      if (this.filterableType === 'nestedSelect') {
        return '606px'
      }
      return this.filteredSelectValueDate === 'between' ? '450px' : '260px'
    },
    getMaxWidth() {
      if (this.filterableType === 'nestedSelect') {
        return null
      }
      return this.getWidth
    },
    getHorizontalNudge() {
      return this.filterableType === 'nestedSelect' ? 200 : 0
    },
    searchInItems: function () {
      return this.filterValue.length > 0
        ? this.convertedFilterableItems.filter((item) => {
            return item.text.toLowerCase().includes(this.filterValue.toLowerCase())
          })
        : this.convertedFilterableItems
    },
    checkTextFilterButtonIsDisabled() {
      if (this.filterValueBetween[0] && this.filterValueBetween[1]) {
        return false
      }
      return !this.filterValue
    },
    getFilterButtonDisabled() {
      if (this.filterableType === 'text') {
        return this.checkTextFilterButtonIsDisabled
      }
      if (this.filterableType === 'select') {
        return !this?.filterChecked?.length
      }
      if (this.filterableType === 'nestedSelect') {
        return this.isNestedGroupsExclusive
          ? !this.hasNestedGroupSelection(this.activeNestedGroup)
          : !this.hasAnyNestedSelection()
      }
      if (this.filterableType === 'singleSelect') {
        return !this.filteredSingleValue
      }
      if (this.filterableType === 'compositeSelect') {
        return !this.filteredSingleValue
      }
      if (this.filterableType === 'numeric') {
        return !this.filterValue
      }
      if (this.filterableType === 'date') {
        if (this.filteredSelectValueDate === 'between') {
          return !this?.filteredDateRangeValue?.length
        }
        return !this.filteredDateValue
      }

      return false
    },
    fieldName: function () {
      return this.filterableCustomFieldName || this.column.property
    }
  }
}
</script>
