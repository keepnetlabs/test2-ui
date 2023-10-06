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
        v-model.trim="value['trainingResourceId']"
        type="autocomplete"
        id="input--campaign-manager-training-tab"
        outlined
        dense
        hide-details
        placeholder="Select training"
        :items="trainingItems"
        :disabled="!isInputsEditable"
      />
    </FormGroup>
    <InputContentLanguage
      v-model="value['trainingLanguage']"
      class="ml-4 mt-4"
      :training-id="value['trainingResourceId']"
      :disabled="isInputLanguageDisabled"
    />
    <v-btn
      id="btn-preview--campaign-manager-training-tab"
      class="white--text btn-util no-box-shadow mt-1 btn-download-add-in ml-4"
      color="#757575"
      rounded
      :disabled="isPreviewButtonDisabled"
      @click="handlePreview"
    >
      <v-icon left>mdi-eye</v-icon>
      {{ labels.TrainingPreview }}
    </v-btn>
  </div>
</template>
<script>
import labels from '@/model/constants/labels'
import AlertBox from '@/components/AlertBox'
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputContentLanguage from '@/components/Common/Inputs/InputContentLanguage'
export default {
  name: 'CampaignManagerPhishingScenariosTrainingTab',
  components: { InputContentLanguage, KSelect, AlertBox, FormGroup },
  props: {
    selectedTemplateResourceId: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
          trainingResourceId: '',
          trainingLanguage: [],
          isCheckboxSelected: false
        }
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
      return !this.isInputsEditable || !this.value.trainingResourceId
    },
    isPreviewButtonDisabled() {
      return (
        !this.isInputsEditable ||
        !this.value.trainingResourceId ||
        !this.value.trainingLanguage.length
      )
    },
    getTrainingInputClassName() {
      const classes = ['ml-3', this.isInputsEditable && 'mt-6']
      return classes.filter(Boolean).join(' ')
    }
  },
  methods: {
    handlePreview() {}
  }
}
</script>
