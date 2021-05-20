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
      search: '',
      scrollKey: 'scroll-key-aksaks'
    }
  },
  computed: {
    getStyle() {
      return { ...this.customStyle, maxWidth: this.maxWidth }
    },
    getItems() {
      return this.search ? this.value.filter((item) => item.includes(this.search)) : this.value
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
  &__input {
    padding: 16px;
  }
  &__content {
    background: #fafafa;
  }
}
</style>
