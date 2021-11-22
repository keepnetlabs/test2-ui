<template>
  <div class="data-container-with-search" :style="getStyle">
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
            <v-checkbox v-model="isFilterChecked" color="#2196f3" label="Only show invalid entries">
            </v-checkbox>
            <div class="filter__footer">
              <v-btn text class="filter__footer-button" color="#00BCD4" @click="clearFilter">
                Clear
              </v-btn>
              <v-btn
                text
                class="filter__footer-button"
                :color="isFilterChecked ? '#409eff' : '#2196f3'"
                :disabled="!isFilterChecked"
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
          item-height="48"
          :items="getItems"
        >
          <template #default="{item,index}">
            <data-container-with-search-item
              :key="getItems[index].key"
              :value="getItems[index].val"
              :index="index"
              :text-field-rules="textFieldRules"
              :text-field-placeholder="textFieldPlaceholder"
              :text-field-error-message="textFieldErrorMessage"
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
export default {
  name: 'DataContainerWithSearch',
  components: { DataContainerWithSearchItem },
  props: {
    value: {
      type: Array,
      default() {
        return {}
      }
    },
    textFieldPlaceholder: {
      type: String,
      default: 'Enter Domain name'
    },
    textFieldErrorMessage: {
      type: String,
      default: 'This Domain is not valid!'
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
    }
  },
  data() {
    return {
      isFilterChecked: false,
      isAllValid: true,
      isFilterActive: false,
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
      const items = this.search
        ? this.options.filter((item) => item.val.includes(this.search))
        : this.options
      return this.isFilterActive
        ? items.filter((item) => !this.textFieldRules.every((func) => func(item.val) === true))
        : items
    }
  },
  watch: {
    value() {
      this.setOptions()
      this.checkAllValid()
      this.$nextTick(() => {
        this.scrollKey = `scroll-key${Math.random().toString().substring(0, 5)}`
      })
    }
  },
  created() {
    this.setOptions('push')
  },
  methods: {
    handleInputChange(newVal = '', oldVal, index) {
      const item = this.getItems[index]
      item.val = newVal
      const indexOfOldValue = this.value.findIndex((val) => val === oldVal)
      this.value[indexOfOldValue] = newVal
      this.$set(item, 'isEdit', false)
      item.key = Math.random().toString(8)
      this.checkAllValid()
    },
    checkAllValid() {
      this.isAllValid = this.value.every((value) =>
        this.textFieldRules.every((func) => func(value) === true)
      )
    },
    setOptions(funcName = 'unshift') {
      this.value.forEach((val) => {
        if (!this.options.find((item) => item.val === val)) this.addItemToOptions(val, funcName)
      })
    },
    addItemToOptions(val, funcName = 'unshift') {
      this.options[funcName]({
        val,
        key: Math.random().toString(8),
        isEdit: false,
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
      this.checkAllValid()
    },
    handleFilter() {
      this.setCommonProperties(true)
    },
    clearFilter() {
      this.setCommonProperties()
    },
    setCommonProperties(val = false) {
      this.isFilterChecked = val
      this.isFilterActive = val
      this.isMenuOpen = false
    }
  }
}
</script>

<style lang="scss">
.data-container-with-search {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 24px;
  &__menu {
    .filter__body-container {
      padding: 16px 16px 6px 16px;
    }
    .filter__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .v-btn__content {
        font-weight: 600;
      }
    }
  }
  &__input {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .filter__icon {
      margin-left: 16px;
      cursor: pointer;
    }
  }
  &__content {
    background: #fafafa;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  &__error {
    position: absolute;
    margin-top: 4px;
    margin-left: -4px;
    font-size: 9px;
    line-height: 12px;
    color: #f56c6c;
  }
}
</style>
