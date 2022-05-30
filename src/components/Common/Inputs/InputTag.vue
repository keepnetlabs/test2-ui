<template>
  <k-select
    ref="refTags"
    type="combobox"
    :value="value"
    :search-input.sync="tagSearch"
    :items="items"
    :class="['hide-caret', className]"
    :slots="{ selection: true }"
    chips
    deletable-chips
    outlined
    multiple
    dense
    persistent-hint
    small-chips
    :return-object="false"
    class="px-0"
    placeholder="Enter tags and press enter key"
    @input="handleTagItemChange"
  >
    <template #selection="{ item, index }">
      <v-chip v-if="isValidItem(item)" small class="ml-0 my-1">
        <span class="mr-2">
          {{ item }}
        </span>
        <v-icon size="19" style="margin-right: -8px;" @click="handleRemoveTag(index)"
          >mdi-close-circle</v-icon
        >
      </v-chip>
    </template>
  </k-select>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'InputTag',
  components: {
    KSelect
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      tagSearch: '',
      tags: []
    }
  },
  watch: {
    tags(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.tags = newVal
    }
  },
  methods: {
    isValidItem(item) {
      return item?.trim().length > 0
    },
    handleRemoveTag(index) {
      this.tags.splice(index, 1)
    },
    handleTagItemChange(newTags) {
      if (newTags.length < this.tags.length) {
        this.tags = newTags
      } else {
        const tagSearch = this.tagSearch?.trim() || ''
        if (
          !tagSearch ||
          tagSearch === '' ||
          (newTags.length > 0 && newTags[newTags.length - 1].trim() === '')
        ) {
          newTags.splice(0, newTags[newTags.length - 1])
          return
        }
        newTags.splice(newTags.length - 1, 1)
        if (tagSearch.includes(',')) {
          const tags = tagSearch.split(',')
          tags.forEach((tag) => {
            if (tag.trim() && !newTags.includes(tag)) {
              this.tags.push(tag.trim().substring(0, 20))
            }
          })
        } else {
          if (!newTags.includes(tagSearch)) {
            this.tags.push(tagSearch.trim().substring(0, 20))
          }
        }
        this.$nextTick(() => {
          if (this.$refs.refTags.$refs.refComponent) {
            this.$refs.refTags.$refs.refComponent.initialValue = this.tags
            this.$refs.refTags.$refs.refComponent.lazyValue = this.tags
          }
        })
      }
    }
  }
}
</script>
