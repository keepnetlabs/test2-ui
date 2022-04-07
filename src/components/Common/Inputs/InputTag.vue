<template>
  <k-select
    :value="value"
    :search-input.sync="tagSearch"
    type="combobox"
    ref="refTags"
    :items="items"
    chips
    deletable-chips
    outlined
    multiple
    dense
    persistent-hint
    small-chips
    :return-object="false"
    placeholder="Enter tags and press enter key"
    @input="handleTagItemChange"
  />
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'InputTag',
  components: {
    KSelect
  },
  data() {
    return {
      tagSearch: '',
      tags: []
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
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
          this.$refs.refTags.$refs.refComponent.initialValue = this.tags
          this.$refs.refTags.$refs.refComponent.lazyValue = this.tags
        })
      }
    }
  }
}
</script>
