<template>
  <FormGroup :title="title" :sub-title="subTitle" has-hint>
    <KSelect
      v-model="selectedValue"
      :items="deliveryOptions"
      :outlined="outlined"
      :dense="dense"
      :placeholder="placeholder"
      :hint="hint"
      :persistent-hint="persistentHint"
      :rules="validationRules"
      :disabled="disabled"
      item-text="label"
      item-value="value"
      color="#2196f3"
      :slots="{ item: true }"
      @input="handleInput"
    >
      <template v-slot:item="{ item }">
        <div class="d-flex flex-column py-2">
          <span>{{ item.label }}</span>
          <span v-if="item.description" class="tlp_subtitle">
            {{ item.description }}
          </span>
        </div>
      </template>
    </KSelect>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import KSelect from '../Inputs/KSelect.vue'
import { deliveryMethodOptions } from './utils'
export default {
  name: 'DeliveryMethod',
  components: {
    FormGroup,
    KSelect
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      default: 'Delivery Method'
    },
    subTitle: {
      type: String,
      default: 'Select how the training will be delivered to the target audience.'
    },
    outlined: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Email'
    },
    hint: {
      type: String,
      default: '*Required'
    },
    persistentHint: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLMS: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const deliveryOptions = deliveryMethodOptions(this.isLMS)
    return {
      deliveryOptions,
      selectedValue: this.value || (deliveryOptions.length > 0 ? deliveryOptions[0].value : '')
    }
  },
  computed: {
    selectedOption() {
      return this.deliveryOptions.find((option) => option.value === this.selectedValue)
    },
    validationRules() {
      const rules = []
      if (this.required) {
        rules.push((v) => Validations.required(v, labels.Required))
      }
      return rules
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.selectedValue) {
        this.selectedValue = newVal
      }
    }
  },
  mounted() {
    if (!this.value && this.deliveryOptions.length > 0) {
      this.$emit('input', this.selectedValue)
    }
  },
  methods: {
    handleInput(value) {
      this.selectedValue = value
      this.$emit('input', value)
      this.$emit('change', this.selectedOption)
    }
  }
}
</script>
