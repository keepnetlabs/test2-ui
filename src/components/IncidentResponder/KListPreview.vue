<template>
  <div class="k-list-preview">
    <div class="k-list-preview-card">
      <div class="k-list-preview-card__header">
        <slot v-if="searchable" name="search">
          <v-text-field
            v-model.trim="search"
            ref="searchInput"
            id="input--k-list-preview-search"
            class="k-list-preview-search"
            hide-details
            placeholder="Search"
            outlined
            prepend-inner-icon="mdi-magnify"
          />
        </slot>
      </div>
      <div class="k-list-preview-card__content">
        <slot name="content">
          <div class="k-list-preview-card__content-left">
            <slot v-if="options.length" name="left-content">
              <KListPreviewItem
                v-for="item in getOptions"
                :key="item.resourceId"
                :item="item"
                :is-selected="value === item[valueKey]"
                :is-default="item.isDefault"
                @on-item-click="handleItemClick"
              />
            </slot>
          </div>
          <div class="k-list-preview-card__content-right">
            <slot name="right-content">
              <k-email-preview
                v-if="selectedItemTemplate"
                :key="selectedItemTemplate"
                :html="selectedItemTemplate"
              />
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import KListPreviewItem from '@/components/IncidentResponder/KListPreviewItem'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'KListPreview',
  components: { KEmailPreview, KListPreviewItem },
  props: {
    searchable: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    },
    options: {
      type: Array
    },
    valueKey: {
      type: String,
      default: 'resourceId'
    },
    itemPreviewFunc: {
      type: Function
    }
  },
  data() {
    return {
      search: '',
      selectedItemTemplate: null,
      searchedOptions: [],
      itemTemplates: {}
    }
  },
  computed: {
    getOptions() {
      return this.search ? this.searchedOptions : this.options
    }
  },
  watch: {
    search(searchValue) {
      this.searchedOptions = this.options.reduce((acc, item) => {
        let isFinded = false
        for (const value of Object.values(item)) {
          if (!value) continue
          if (value.toString().trim().includes(searchValue.trim())) {
            isFinded = true
            break
          }
        }
        if (isFinded) acc.push(item)
        return acc
      }, [])
    }
  },
  created() {
    if (this.value) {
      this.callForSelectedItemData({ resourceId: this.value })
    }
  },
  methods: {
    handleItemClick(item = {}) {
      this.$emit('input', item[this.valueKey])
      this.callForSelectedItemData(item)
    },
    callForSelectedItemData(item = {}) {
      if (this.itemTemplates[item.resourceId]) {
        this.selectedItemTemplate = this.itemTemplates[item.resourceId]
      } else {
        this.itemPreviewFunc(item.resourceId).then((response) => {
          const {
            data: { data }
          } = response
          this.selectedItemTemplate = data.template
          this.itemTemplates[item.resourceId] = this.selectedItemTemplate
        })
      }
    }
  }
}
</script>
