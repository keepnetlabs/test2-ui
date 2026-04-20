<template>
  <FormGroup has-hint :title="title" :sub-title="subTitle">
    <k-select
      v-bind="commonRules"
      :value="value"
      :items="selectableItems"
      :item-text="itemText"
      :item-value="itemValue"
      :disabled="disabled"
      :loading="loading"
      outlined
      multiple
      chips
      small-chips
      deletable-chips
      hint="*Required"
      required
      persistent-hint
      :placeholder="placeholder"
      @input="$emit('input', $event)"
    />
  </FormGroup>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'InputSelectCategories',
  components: { FormGroup, KSelect },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    title: {
      type: String,
      default: 'Category'
    },
    subTitle: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select categories'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => (v.length > 0 ? Validations.required(v, labels.Required) : 'Required')]
      }
    }
  },
  computed: {
    selectableItems() {
      return this.items.filter((item) => {
        const itemValue = item?.[this.itemValue]
        return itemValue !== undefined && itemValue !== null && itemValue !== ''
      })
    }
  }
}
</script>
