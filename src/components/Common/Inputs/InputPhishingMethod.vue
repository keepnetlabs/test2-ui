<template>
  <FormGroup has-hint title="Method" :sub-title="subtitle">
    <k-select
      v-bind="commonRules"
      :value="value"
      :items="items"
      item-disabled="disabled"
      :item-text="itemTextKey"
      :item-value="itemValueKey"
      :disabled="disabled"
      outlined
      hint="*Required"
      required
      persistent-hint
      :slots="{ item: true }"
      @input="$emit('input', $event)"
    >
      <template #item="{ item }">
        <div :class="['mail-configuration-select-sources__item-container']">
          <div class="mail-configuration-select-sources__item">
            <div class="mail-configuration-select-sources__item-left">
              {{ item[itemTextKey] }}
            </div>
            <div class="mail-configuration-select-sources__item-right-platform">
              {{ getMethodTypeDescription(item[itemTextKey]) }}
            </div>
          </div>
        </div>
      </template>
    </k-select>
  </FormGroup>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import { SCENARIO_METHOD_TYPES } from '@/components/PhishingScenarios/utils'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'InputPhishingMethod',
  components: { FormGroup, KSelect },
  props: {
    maxLength: {
      type: Number,
      default: 64
    },
    value: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    },
    subtitle: {
      type: String,
      default: 'Select the phishing technique for this template'
    },
    itemTextKey: {
      type: String,
      default: 'name'
    },
    itemValueKey: {
      type: String,
      default: 'resourceId'
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
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
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) =>
            Validations.maxLength(
              v,
              this.maxLength,
              labels.getMaxLengthMessage(labels.TemplateName)
            )
        ]
      }
    }
  },
  methods: {
    getMethodTypeDescription(method = '') {
      const scenarioType =
        this.type === SCENARIO_TYPES.PHISHING
          ? labels.Phishing.toLowerCase()
          : labels.Quishing.toLowerCase()
      switch (method) {
        case SCENARIO_METHOD_TYPES.CLICK_ONLY:
        case SCENARIO_METHOD_TYPES.CLICK_ONLY_SPACE:
          return `See who fails for ${scenarioType} links`
        case SCENARIO_METHOD_TYPES.DATA_SUBMISSION:
          return 'Gather information from users'
        case SCENARIO_METHOD_TYPES.ATTACHMENT:
          return 'Send a trackable file'
        case SCENARIO_METHOD_TYPES.MFA:
          return 'Send a phishing MFA'
        default:
          return `See who fails for ${scenarioType} links`
      }
    }
  }
}
</script>
