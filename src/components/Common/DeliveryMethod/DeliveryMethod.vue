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
  </div>
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
      teamsIntegrationSteps: [
        {
          title: 'Step 1: Integrate with Microsoft Teams',
          description: 'Allow the platform to connect with your Microsoft Teams account.',
          disabled: false,
          completed: false,
          accesses: [
            {
              title: 'Access 1: Connect to Teams',
              description: 'Allows platform to link your Teams account.',
              status: 'pending',
              loading: false,
              disabled: false
            }
          ]
        },
        {
          title: 'Step 2: Configure Training Delivery',
          description: 'Set up training delivery mechanisms through Microsoft Teams.',
          disabled: true,
          completed: false,
          accesses: [
            {
              title: 'Access 2: Training Delivery',
              description: 'Allows the platform to send training notifications to Teams users.',
              status: 'pending',
              loading: false,
              disabled: true
            }
          ]
        }
      ]
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
    },
    getButtonColor(status) {
      switch (status) {
        case 'enabled':
          return '#4CAF50'
        case 'disabled':
          return '#f44336'
        case 'pending':
        default:
          return '#2196f3'
      }
    },
    getButtonText(status) {
      switch (status) {
        case 'enabled':
          return 'ENABLED'
        case 'disabled':
          return 'DISABLED'
        case 'pending':
        default:
          return 'ENABLE ACCESS'
      }
    },
    async handleTeamsAccessClick(step, access, stepIndex, accessIndex) {
      try {
        this.setTeamsAccessLoading(stepIndex, accessIndex, true)

        if (stepIndex === 0 && accessIndex === 0) {
          await this.connectToTeams()
        } else if (stepIndex === 1 && accessIndex === 0) {
          await this.enableTeamsTrainingDelivery()
        }
      } catch (error) {
        this.$emit('teams-integration-error', error.message || 'An unexpected error occurred')
      } finally {
        this.setTeamsAccessLoading(stepIndex, accessIndex, false)
      }
    },
    async connectToTeams() {
      await this.simulateApiCall()

      this.updateTeamsAccessStatus(0, 0, 'enabled')
      this.updateTeamsStepStatus(0, false, true)
      this.updateTeamsStepStatus(1, false, false)
      this.updateTeamsAccessStatus(1, 0, 'pending')

      this.$emit('teams-integration-success', 'Successfully connected to Microsoft Teams!')
    },
    async enableTeamsTrainingDelivery() {
      await this.simulateApiCall()

      this.updateTeamsAccessStatus(1, 0, 'enabled')
      this.updateTeamsStepStatus(1, false, true)

      this.$emit(
        'teams-integration-success',
        'Training delivery has been enabled for Microsoft Teams!'
      )
    },
    simulateApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve()
          } else {
            reject(new Error('Connection failed. Please try again.'))
          }
        }, 2000)
      })
    },
    setTeamsAccessLoading(stepIndex, accessIndex, loading) {
      this.teamsIntegrationSteps[stepIndex].accesses[accessIndex].loading = loading
    },
    updateTeamsAccessStatus(stepIndex, accessIndex, status) {
      this.teamsIntegrationSteps[stepIndex].accesses[accessIndex].status = status
    },
    updateTeamsStepStatus(stepIndex, disabled, completed) {
      this.teamsIntegrationSteps[stepIndex].disabled = disabled
      this.teamsIntegrationSteps[stepIndex].completed = completed

      this.teamsIntegrationSteps[stepIndex].accesses.forEach((access) => {
        access.disabled = disabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.delivery-method {
  &__teams-integration {
    border-top: 1px solid #e0e0e0;
    padding-top: 24px;
  }
}

.teams-integration-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &__header {
    padding: 24px 32px;
    background: linear-gradient(135deg, #6264a7 0%, #5b5fc7 100%);
    color: white;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
    line-height: 1.4;
  }

  &__content {
    padding: 0;
  }
}

.teams-step {
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &--disabled {
    opacity: 0.6;
    background-color: #fafafa;
  }

  &--completed {
    background-color: #f8fff8;
    border-left: 4px solid #4caf50;
  }

  &__header {
    padding: 20px 32px 12px 32px;
    background: #f8f9fa;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 6px 0;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.4;
  }

  &__content {
    padding: 0 32px 20px 32px;
  }
}

.teams-access {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: #6264a7;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &__info {
    flex: 1;
    margin-right: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
  }

  &__description {
    font-size: 13px;
    color: #666;
    margin: 0;
    line-height: 1.4;
  }

  &__action {
    flex-shrink: 0;
  }

  &__button {
    min-width: 120px;
    height: 36px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 12px;

    &.v-btn--disabled {
      box-shadow: none;
    }
  }
}

@media (max-width: 768px) {
  .teams-integration-card {
    &__header {
      padding: 20px 24px;
    }

    &__title {
      font-size: 20px;
    }

    &__subtitle {
      font-size: 13px;
    }
  }

  .teams-step {
    &__header {
      padding: 16px 24px 10px 24px;
    }

    &__content {
      padding: 0 24px 16px 24px;
    }
  }

  .teams-access {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    &__info {
      margin-right: 0;
    }

    &__action {
      align-self: stretch;
    }

    &__button {
      width: 100%;
    }
  }
}
</style>
