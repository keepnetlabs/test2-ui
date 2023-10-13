<template>
  <div>
    <AlertBox
      v-if="!isInputsEditable"
      class="mb-4 mr-4 ml-3 bg-aqua-light"
      text="A phishing scenario should be selected in order to be able to choose a training"
      icon-color="#2196F3"
      icon-name="mdi-information"
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <FormGroup
      :class-name="getTrainingInputClassName"
      title="Select Training"
      sub-title="The system sends the selected training to the target users who click on the phishing link, and the enrollment is created"
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
      ref="inputContentLanguage"
      v-model="value.trainingLanguageIds"
      class="ml-4 mt-4"
      :training-id="getTrainingId"
      :disabled="isInputLanguageDisabled"
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
export default {
  name: 'CampaignManagerPhishingScenariosTrainingTab',
  components: { InputContentLanguage, KSelect, AlertBox, FormGroup },
  props: {
    value: {
      type: Object,
      default() {
        return new TrainingTabModel()
      }
    }
  },
  data() {
    return {
      labels,
      trainingItems: []
    }
  },
  computed: {
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
    }
  }
}
</script>
