<template>
  <div
    v-if="value.length"
    class="data-container-with-search"
    :style="getStyle"
    :class="['data-container-with-search', !isAllValid && 'data-container-with-search--error']"
  >
    <div class="data-container-with-search__input">
      <slot name="search">
        <v-text-field
          v-model.trim="search"
          id="input--data-container-with-search"
          ref="searchInput"
          outlined
          hide-details
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
        />
        <v-menu
          v-model="isMenuOpen"
          :offset-y="true"
          bottom
          min-width="240"
          max-width="240"
          :close-on-content-click="false"
          class="filter__container"
          content-class="data-container-with-search__menu"
          max-height="260px"
          z-index="999"
        >
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="filter__icon">mdi-filter-variant</v-icon>
          </template>
          <div class="filter__body-container">
            <v-checkbox
              v-if="isCustomFilterAvailable"
              v-model="isCustomFilterChecked"
              color="#2196f3"
              label="Only show custom entries"
            >
            </v-checkbox>
            <v-checkbox
              v-if="isInvalidFilterAvailable"
              v-model="isFilterChecked"
              color="#2196f3"
              label="Only show invalid entries"
            >
            </v-checkbox>
            <div class="filter__footer">
              <v-btn text class="filter__footer-button" color="#00BCD4" @click="clearFilter">
                Clear
              </v-btn>
              <v-btn
                text
                class="filter__footer-button"
                :color="isOneOfFiltersChecked ? '#409eff' : '#2196f3'"
                :disabled="!isOneOfFiltersChecked"
                @click="handleFilter"
              >
                Filter
              </v-btn>
            </div>
          </div>
        </v-menu>
      </slot>
    </div>
    <div class="data-container-with-search__content">
      <slot name="content">
        <v-virtual-scroll
          v-if="getItems.length"
          :key="scrollKey"
          max-height="300"
          :item-height="itemHeight"
          :items="getItems"
        >
          <template #default="{index}">
            <data-container-with-search-item
              :key="getItems[index].key"
              :value="getItems[index].val"
              :isEditable="getItems[index].isEditable"
              :disabledTooltipText="getItems[index].disabledTooltipText"
              :index="index"
              :item-height="itemHeight"
              :text-field-rules="textFieldRules"
              :text-field-placeholder="textFieldPlaceholder"
              :text-field-error-message="textFieldErrorMessage"
              :showValidationErrorMesssage="showValidationErrorMesssage"
              :text-field-default-value.sync="getItems[index].textFieldDefaultValue"
              :is-edit.sync="getItems[index].isEdit"
              @on-delete="handleItemDelete"
              @input="handleInputChange"
            />
          </template>
        </v-virtual-scroll>
      </slot>
    </div>
    <div class="data-container-with-search__error">
      <transition appear name="bounce" v-if="!isAllValid">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message" style="padding-left: 10px;">{{ invalidMessage }}</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import DataContainerWithSearchItem from '@/components/Common/Others/DataContainerWithSearchItem'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'DataContainerWithSearch',
  components: { DataContainerWithSearchItem },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    removeDuplicates: {
      type: Boolean,
      default: false
    },
    itemHeight: {
      type: String,
      default: '48'
    },
    textFieldPlaceholder: {
      type: String,
      default: 'Enter Domain name'
    },
    textFieldErrorMessage: {
      type: String,
      default: 'This Domain is not valid!'
    },
    showValidationErrorMesssage: {
      type: Boolean,
      default: false
    },
    textFieldRules: {
      type: Array,
      default: () => [
        (v) => validations.required(v, labels.Required),
        (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Domain, 256)),
        (v) => validations.domain(v, labels.InvalidDomainName)
      ]
    },
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    maxWidth: {
      type: String,
      default: '554px'
    },
    maxHeight: {
      type: String,
      default: '373px'
    },
    invalidMessage: {
      type: String,
      default: labels.InvalidURLS
    },
    getEditability: {
      type: Function,
      default: (item) => true
    },
    disabledTooltipText: {
      type: String,
      default: 'You cannot edit or delete this record.'
    },
    filters: {
      type: Array,
      default: () => ['invalid']
    }
  },
  data() {
    return {
      isFilterChecked: false,
      isCustomFilterChecked: false,
      isAllValid: true,
      isFilterActive: false,
      isCustomFilterActive: false,
      isMenuOpen: false,
      search: '',
      scrollKey: 'scroll-key-aksaks',
      options: []
    }
  },
  computed: {
    getStyle() {
      return { ...this.customStyle, maxWidth: this.maxWidth }
    },
    getItems() {
      let items = this.search
        ? this.options.filter((item) => item.val.includes(this.search))
        : this.options
      if (this.isCustomFilterActive) {
        items = items.filter((item) => item.isEditable)
      }
      return this.isFilterActive
        ? items.filter(
            (item) =>
              item.isEditable && !this.textFieldRules.every((func) => func(item.val) === true)
          )
        : items
    },
    isCustomFilterAvailable() {
      return this.filters.includes('custom')
    },
    isInvalidFilterAvailable() {
      return this.filters.includes('invalid')
    },
    isOneOfFiltersChecked() {
      if (this.isCustomFilterAvailable && this.isInvalidFilterAvailable) {
        return this.isCustomFilterChecked || this.isFilterChecked
      }

      return this.isFilterChecked
    }
  },
  watch: {
    value() {
      this.setOptions('push', true)
      this.checkAllValid()
      this.$nextTick(() => {
        this.scrollKey = `scroll-key-${createRandomCryptStringNumber()}`
      })
    }
  },
  created() {
    this.setOptions('push')
  },
  methods: {
    handleInputChange(newVal = '', oldVal = '', index = 0) {
      const item = this.getItems[index]
      item.val = newVal
      const indexOfOldValue = this.value.findIndex((val) => val === oldVal)
      this.$set(this.value, indexOfOldValue, newVal)
      this.$set(item, 'isEdit', false)
      item.key = createRandomCryptStringNumber()

      if (this.removeDuplicates) {
        const newItems = JSON.parse(JSON.stringify([...new Set(this.value)]))
        this.resetOptions()
        this.setOptions()
        this.$emit('input', newItems)
      } else {
        this.$emit('input', this.value)
      }
      this.checkAllValid()
    },
    checkAllValid() {
      this.isAllValid = this.value.every((value) => {
        const isEditable = this.getEditability(value)
        if (!isEditable) {
          return true
        } else {
          return this.textFieldRules.every((func) => func(value) === true)
        }
      })
    },
    setOptions(funcName = 'unshift', reset = false) {
      if (reset) {
        this.options = []
      }
      for (const row of this.value) {
        if (!this.options.find((item) => item.val === row)) this.addItemToOptions(row, funcName)
      }
    },
    resetOptions() {
      this.options = []
    },
    addItemToOptions(val, funcName = 'unshift') {
      this.options[funcName]({
        val,
        key: createRandomCryptStringNumber(),
        isEdit: false,
        isEditable: this.getEditability(val),
        disabledTooltipText: this.disabledTooltipText,
        textFieldDefaultValue: val
      })
    },
    handleItemDelete(item = '') {
      const index = this.options.findIndex((option) => option.val === item)
      if (index === -1) return
      this.options.splice(index, 1)
      this.value.splice(
        this.value.findIndex((val) => val === item),
        1
      )
      this.$emit('on-delete', index)
      this.checkAllValid()
    },
    handleFilter() {
      this.isFilterActive = this.isFilterChecked
      this.isCustomFilterActive = this.isCustomFilterChecked
      this.isMenuOpen = false
    },
    clearFilter() {
      this.isFilterChecked = false
      this.isCustomFilterChecked = false
      this.isFilterActive = false
      this.isCustomFilterActive = false
      this.isMenuOpen = false
    }
  }
}
</script>
