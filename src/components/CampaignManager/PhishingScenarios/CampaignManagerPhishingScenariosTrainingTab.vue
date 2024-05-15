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
    <div class="d-flex">
      <InputContentLanguage
        :key="inputContentLanguageKey"
        ref="inputContentLanguage"
        v-model="value.trainingLanguageIds"
        class="ml-3 mt-6"
        :is-add-default-value="false"
        :training-id="getTrainingId"
        :disabled="isInputLanguageDisabled"
        @on-api-call-finished="handleApiCallFinished"
      />
      <VBtn
        id="btn-preview--campaign-manager-training-tab"
        class="white--text btn-util no-box-shadow mt-1 btn-download-add-in ml-4"
        style="margin-bottom: -32px; align-self: center;"
        color="#757575"
        rounded
        :disabled="isPreviewButtonDisabled"
        @click="handlePreview"
      >
        <v-icon left>mdi-eye</v-icon>
        {{ labels.TrainingPreview }}
      </VBtn>
    </div>
    <FormGroup
      v-if="isShowReminder"
      class-name="ml-3 mt-3"
      has-hint
      title="Enrollment"
      sub-title="Training enrollment setting when users fail in the simulation"
    >
      <k-select
        v-model="value.enrollmentSendTypeId"
        id="input--campaign-manager-notification-templates"
        class="tlp-select"
        outlined
        persistent-hint
        hint="*Required"
        placeholder="Select an option"
        item-text="title"
        :items="enrollmentItemsTrainingTab"
        :disabled="!isInputsEditable || isInputLanguageDisabled"
        :rules="[(v) => !!v || 'Required']"
        :return-object="false"
        :slots="{ item: true, selection: false }"
      >
        <template #item="{ item }">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle class="tlp_subtitle">{{ item.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </k-select>
    </FormGroup>
    <FormGroup
      v-if="isShowReminder"
      class="ml-3 mt-3"
      :title="labels.Reminder"
      style="max-width: 875px;"
    >
      <div class="campaign-manager-advanced-settings__other-settings-last">
        <VCheckbox
          v-model="value.enrollmentReminder.sendReminderEvery"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          color="#2196f3"
          :disabled="!isInputsEditable || isInputLanguageDisabled"
          hide-details
        />
        <span :style="(!isInputsEditable || isInputLanguageDisabled) && { opacity: '0.5' }"
          >Set reminder every</span
        >
        <VTextField
          v-model="value.enrollmentReminder.periodCount"
          v-mask="'#######'"
          id="input--edit-enrollment-reminder-period-count"
          placeholder="Enter number"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!value.enrollmentReminder.sendReminderEvery"
          :rules="rules.number"
        />
        <KSelect
          v-model.trim="value.enrollmentReminder.periodType"
          id="input--edit-enrollment-reminder-period-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 120px;"
          :items="getPeriodTypeItems"
          :disabled="!value.enrollmentReminder.sendReminderEvery"
        />
        <span
          class="ml-2"
          :style="(!isInputsEditable || isInputLanguageDisabled) && { opacity: '0.5' }"
          >ends</span
        >
        <KSelect
          v-model.trim="value.enrollmentReminder.endType"
          id="input--edit-enrollment-reminder-end-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 282px; min-width: 282px;"
          :items="getEndTypeItems"
          :disabled="!value.enrollmentReminder.sendReminderEvery"
        />
        <VTextField
          v-if="value.enrollmentReminder.endType === 'AfterOccurrences'"
          v-model="value.enrollmentReminder.occurrenceCount"
          v-mask="'#######'"
          id="input--campaign-manager-advanced-settings-other-settings-occurence-count"
          placeholder="Enter number"
          outlined
          class="ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!value.enrollmentReminder.sendReminderEvery"
          :rules="rules.number"
        />
        <span
          v-if="value.enrollmentReminder.endType === 'AfterOccurrences'"
          class="ml-2"
          :style="(!isInputsEditable || isInputLanguageDisabled) && { opacity: '0.5' }"
          >times</span
        >
        <InputDate
          v-if="value.enrollmentReminder.endType === 'OnDate'"
          v-model="value.enrollmentReminder.stopTime"
          class="date-picker-height-40 ml-2"
          type="date"
          ref="refPicker"
          placeholder="Select Date"
          format="dd/MM/yyyy"
          style="width: 100%; max-width: 180px;"
          :picker-options="datePickerOptions"
          :disabled="!value.enrollmentReminder.sendReminderEvery"
        />
      </div>
    </FormGroup>
    <FormGroup v-if="isShowReminder" class="ml-3 mt-6 mb-6" :title="labels.Certificate">
      <v-checkbox
        v-model="value.awardCertificate"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Award certificate when a user completes the training"
        :disabled="!isInputsEditable || isInputLanguageDisabled"
      >
      </v-checkbox>
    </FormGroup>
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
import { enrollmentItemsTrainingTab } from '@/components/CampaignManager/PhishingScenarios/utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { endTypeItems, periodTypeItems } from '@/components/AwarenessEducator/SendTraining/utils'
export default {
  name: 'CampaignManagerPhishingScenariosTrainingTab',
  components: { InputDate, InputContentLanguage, KSelect, AlertBox, FormGroup },
  props: {
    value: {
      type: Object,
      default() {
        return new TrainingTabModel()
      }
    },
    enumTypes: {
      type: Object,
      default() {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isShowReminder: {
      type: Boolean,
      default: false
    },
    isCategory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputContentLanguageKey: createRandomCryptStringNumber(),
      labels,
      trainingItems: [],
      enrollmentItemsTrainingTab,
      rules: {
        number: [
          (v) => /\d/.test(v) || 'Enter valid number',
          (v) => v > 0 || 'Enter number greater than 0',
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      periodTypeItems,
      endTypeItems
    }
  },
  watch: {
    value() {
      this.inputContentLanguageKey = createRandomCryptStringNumber()
    }
  },
  computed: {
    getPeriodTypeItems() {
      return (
        this?.enumTypes?.EmailPeriodTypeEnum?.map((type, index) => ({
          text: this.periodTypeItems[index].text,
          value: type.name
        })) || this.periodTypeItems
      )
    },
    getEndTypeItems() {
      return (
        this?.enumTypes?.ReminderEndTypeEnum?.map((type, index) => ({
          text: this.endTypeItems[index].text,
          value: type.name
        })) || this.endTypeItems
      )
    },
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
          break
        default:
          break
      }
      return `A ${scenarioText} scenario should be selected in order to be able to choose a training`
    },
    isInputsEditable() {
      return this?.value?.isCheckboxSelected || this.isCategory
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
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    }
  }
}
</script>
