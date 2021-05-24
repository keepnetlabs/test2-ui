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
        <v-virtual-scroll :key="scrollKey" max-height="300" item-height="48" :items="getItems">
          <template #default="{item,index}">
            <data-container-with-search-item
              v-model="getItems[index]"
              :text-field-rules="textFieldRules"
              :text-field-placeholder="textFieldPlaceholder"
              @on-delete="handleItemDelete"
            />
          </template>
        </v-virtual-scroll>
      </slot>
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
    }
  },
  data() {
    return {
      isFilterChecked: false,
      isFilterActive: false,
      isMenuOpen: false,
      search: '',
      scrollKey: 'scroll-key-aksaks'
    }
  },
  computed: {
    getStyle() {
      return { ...this.customStyle, maxWidth: this.maxWidth }
    },
    getItems() {
      const items = this.search
        ? this.value.filter((item) => item.includes(this.search))
        : this.value
      return this.isFilterActive
        ? items.filter((item) => !this.textFieldRules.every((func) => func(item) === true))
        : items
    }
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.scrollKey = `scroll-key${Math.random().toString().substring(0, 5)}`
      })
    }
  },
  methods: {
    handleItemDelete(item = '') {
      const index = this.value.indexOf(item)
      if (index === -1) return
      this.value.splice(index, 1)
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
  }
}
</style>
