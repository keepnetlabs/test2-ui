<template>
  <div class="delivery-method">
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
        <template #item="{ item }">
          <v-tooltip bottom :disabled="!item.tooltip">
            <template #activator="{ on, attrs }">
              <div
                class="d-flex flex-column py-2"
                :class="{ 'delivery-option--disabled': item.isDisabled }"
                v-bind="item.isDisabled ? attrs : {}"
                v-on="item.isDisabled ? on : {}"
                @click="item.isDisabled ? $event.stopPropagation() : null"
              >
                <span>{{ item.label }}</span>
                <span v-if="item.description" class="tlp_subtitle">
                  {{ item.description }}
                </span>
              </div>
            </template>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </template>
      </KSelect>
    </FormGroup>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import KSelect from '../Inputs/KSelect.vue'
import { deliveryMethodOptions } from './utils'
import MicrosoftTeamsSettingsService from '@/api/microsoftTeamsSettings'

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
    },
    type: {
      type: String,
      default: 'Training'
    }
  },
  data() {
    const deliveryOptions = deliveryMethodOptions(this.isLMS, this.type)
    return {
      deliveryOptions,
      selectedValue: this.value || (deliveryOptions.length > 0 ? deliveryOptions[0].value : ''),
      isTeamsIntegrationEnabled: true
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
    this.checkTeamsIntegration()
  },
  methods: {
    handleInput(value) {
      const selectedOption = this.deliveryOptions.find((option) => option.value === value)
      if (selectedOption?.isDisabled) {
        return
      }
      this.selectedValue = value
      this.$emit('input', value)
      this.$emit('change', this.selectedOption)
    },
    checkTeamsIntegration() {
      MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings()
        .then((response) => {
          const { data } = response
          this.isTeamsIntegrationEnabled = data?.isFound
          const teamsIntegrationOption = this.deliveryOptions.find(
            (option) => option.value === 'microsoft-teams'
          )
          this.$set(teamsIntegrationOption, 'isDisabled', !data?.isFound)
          if (!data?.isFound) {
            this.$set(
              teamsIntegrationOption,
              'tooltip',
              'Enable the Microsoft Teams integration to send notifications.'
            )
          }
        })
        .catch(() => {
          this.isTeamsIntegrationEnabled = false
          const teamsIntegrationOption = this.deliveryOptions.find(
            (option) => option.value === 'microsoft-teams'
          )
          this.$set(teamsIntegrationOption, 'isDisabled', true)
          this.$set(
            teamsIntegrationOption,
            'tooltip',
            'Enable the Microsoft Teams integration to send notifications.'
          )
        })
    }
  }
}
</script>
<style>
.delivery-method {
  &__teams-integration {
    border-top: 1px solid #e0e0e0;
    padding-top: 24px;
  }
}
.delivery-option--disabled {
  opacity: 0.6;
  cursor: not-allowed !important;

  span {
    pointer-events: none;
  }
}
</style>
