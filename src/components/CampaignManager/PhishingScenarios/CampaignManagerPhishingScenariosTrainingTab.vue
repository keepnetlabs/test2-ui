<template>
  <div>
    <AlertBox
      v-if="!isInputsEditable"
      class="mb-4 mr-4 ml-3 bg-aqua-light"
      icon-color="#2196F3"
      icon-name="mdi-information"
      :text="getAlertBoxText"
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <FormGroup
      :class-name="getTrainingInputClassName"
      title="Select Training"
      :sub-title="getSubtitle"
    >
      <KSelect
        :value="value.trainingId"
        type="autocomplete"
        id="input--campaign-manager-training-tab"
        outlined
        dense
        hide-details
        return-object
        clearable
        placeholder="Select training"
        :items="trainingItems"
        :disabled="!isInputsEditable"
        @input="handleTrainingItemSelect"
        @click:clear="handleTrainingItemSelect(null)"
      />
    </FormGroup>
    <InputContentLanguage
      :key="inputContentLanguageKey"
      ref="inputContentLanguage"
      v-model="value.trainingLanguageIds"
      class="ml-4 mt-4"
      :is-add-default-value="false"
      :training-id="getTrainingId"
      :disabled="isInputLanguageDisabled"
      @on-api-call-finished="handleApiCallFinished"
    />
    <VBtn
      id="btn-preview--campaign-manager-training-tab"
      class="white--text btn-util no-box-shadow mt-1 btn-download-add-in ml-4"
      color="#757575"
      rounded
      :disabled="isPreviewButtonDisabled"
      @click="handlePreview"
    >
      <v-icon left>mdi-eye</v-icon>
      {{ labels.TrainingPreview }}
    </VBtn>
  </div>
</template>
<script>
import labels from '@/model/constants/labels'
import AlertBox from '@/components/AlertBox'
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputContentLanguage from '@/components/Common/Inputs/InputContentLanguage'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { createRandomCryptStringNumber, getDefaultAxiosPayload } from '@/utils/functions'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
export default {
  name: 'CampaignManagerPhishingScenariosTrainingTab',
  components: { InputContentLanguage, KSelect, AlertBox, FormGroup },
  props: {
    value: {
      type: Object,
      default() {
        return new TrainingTabModel()
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      inputContentLanguageKey: createRandomCryptStringNumber(),
      labels,
      trainingItems: []
    }
  },
  watch: {
    value() {
      this.inputContentLanguageKey = createRandomCryptStringNumber()
    }
  },
  computed: {
    getSubtitle() {
      let type = SCENARIO_TYPES.PHISHING
      if (this.type === SCENARIO_TYPES.QUISHING) type = SCENARIO_TYPES.QUISHING
      else if (this.type === SCENARIO_TYPES.SMISHING) type = SCENARIO_TYPES.SMISHING
      else if (this.type === SCENARIO_TYPES.CALLBACK) {
        type = SCENARIO_TYPES.CALLBACK
        return `The system sends the selected training to the target users who call the callback phone number, and enrollment is created`
      }
      return `The system sends the selected training to the target users who click on the ${type.toLowerCase()} link, and the enrollment is created`
    },
    getAlertBoxText() {
      let scenarioText = ''
      switch (this.type) {
        case SCENARIO_TYPES.PHISHING:
          scenarioText = 'phishing'
          break
        case SCENARIO_TYPES.QUISHING:
          scenarioText = 'quishing'
          break
        case SCENARIO_TYPES.SMISHING:
          scenarioText = 'smishing'
          break
        case SCENARIO_TYPES.CALLBACK:
          scenarioText = 'callback'
        default:
          break
      }
      return `A ${scenarioText} scenario should be selected in order to be able to choose a training`
    },
    isInputsEditable() {
      return this?.value?.isCheckboxSelected
    },
    isInputLanguageDisabled() {
      return !this.isInputsEditable || !this.value.trainingId
    },
    isPreviewButtonDisabled() {
      return (
        !this.isInputsEditable || !this.value.trainingId || !this.value.trainingLanguageIds.length
      )
    },
    getTrainingInputClassName() {
      const classes = ['ml-3', this.isInputsEditable && 'mt-6']
      return classes.filter(Boolean).join(' ')
    },
    getTrainingId() {
      return this?.value?.trainingId || ''
    }
  },
  created() {
    this.callForTrainingItems()
  },
  methods: {
    callForTrainingItems() {
      AwarenessEducatorService.getTrainingItems(getDefaultAxiosPayload({ pageSize: 100000 })).then(
        (response) => {
          const {
            data: { data = {} }
          } = response
          const { results = [] } = data
          this.trainingItems = results.map((result) => ({
            text: result.trainingName,
            value: result.trainingId
          }))
        }
      )
    },
    handlePreview() {
      this.$emit('on-preview', this.value)
    },
    handleTrainingItemSelect(item) {
      this.$set(this.value, 'trainingId', item?.value ?? '')
      this.$set(this.value, 'trainingName', item?.text ?? '')
      this.$set(this.value, 'trainingLanguageIds', [])
      this.$nextTick(() => {
        this.$refs.inputContentLanguage.$refs.refSelect.$refs.refComponent.resetValidation()
      })
    },
    handleApiCallFinished() {
      if (!this.value.trainingLanguageIds.length) this.$refs.inputContentLanguage.setDefaultValue()
    }
  }
}
</script>
