<template>
  <Fragment>
    <CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal
      :status="isPagePreviewModalVisible"
      :languages="languages"
      :trainingLanguageIds="value.trainingLanguageIds"
      :trainingRedirectPage="value.trainingRedirectPage"
      @on-close="handleClosePagePreviewModal"
    />
    <div>
      <AlertBox
        v-if="!isInputsEditable || isEdit"
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
          v-infinite-scroll="{
            target: '#input--campaign-manager-training-tab .k-select__menu',
            callback: callForTrainingItems
          }"
          v-select-search-handler="{
            callback: callForTrainingItemsSearch,
            isLoadingKey: 'isTrainingLoading'
          }"
          type="autocomplete"
          id="input--campaign-manager-training-tab"
          outlined
          dense
          hide-details
          return-object
          clearable
          placeholder="Select training"
          custom-menu-class="input--company-group-add-members"
          :items="trainingItems"
          :disabled="!isInputsEditable || isEdit"
          :no-data-text="isTrainingLoading ? 'Loading...' : 'No training available'"
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
          :language-options="languages"
          :disabled="isInputLanguageDisabled || isEdit"
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
          :items="
            isAttachmentBasedScenario
              ? attachmentScenarioEnrollmentItems
              : enrollmentItemsTrainingTab
          "
          :disabled="!isInputsEditable || isInputLanguageDisabled || isEdit"
          :rules="[(v) => !!v || 'Required']"
          :return-object="false"
          :slots="{ item: true, selection: false }"
        >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="tlp_subtitle">{{
                item.description
              }}</v-list-item-subtitle>
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
            id="input--phishing-scenarios-send-reminder"
            color="#2196f3"
            :disabled="!isInputsEditable || isInputLanguageDisabled || isEdit"
            hide-details
          />
          <span :style="getDisabledLabelStyle">Set reminder every</span>
          <VTextField
            v-model="value.enrollmentReminder.periodCount"
            v-mask="'#######'"
            id="input--edit-enrollment-reminder-period-count"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
            style="max-width: 64px;"
            :disabled="!value.enrollmentReminder.sendReminderEvery || isEdit"
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
            :disabled="!value.enrollmentReminder.sendReminderEvery || isEdit"
          />
          <span class="ml-2" :style="getDisabledLabelStyle">ends</span>
          <KSelect
            v-model.trim="value.enrollmentReminder.endType"
            id="input--edit-enrollment-reminder-end-type"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 282px; min-width: 282px;"
            :items="endTypeItems"
            :disabled="!value.enrollmentReminder.sendReminderEvery || isEdit"
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
            :disabled="!value.enrollmentReminder.sendReminderEvery || isEdit"
            :rules="rules.number"
          />
          <span
            v-if="value.enrollmentReminder.endType === 'AfterOccurrences'"
            class="ml-2"
            :style="getDisabledLabelStyle"
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
            :disabled="!value.enrollmentReminder.sendReminderEvery || isEdit"
          />
        </div>
        <AlertBox
          v-if="
            value.enrollmentReminder.sendReminderEvery &&
            ['QuizCompleted', 'QuizSuccessfullyCompleted'].includes(
              value.enrollmentReminder.endType
            )
          "
          style="max-width: 690px;"
          class="mt-4 align-items-center"
          icon-name="mdi-information"
          text="If this option is selected and there is no exam in the training, the reminder will continue indefinitely."
          :slots="{ primaryAction: false, secondaryAction: false }"
        />
      </FormGroup>
      <FormGroup
        v-if="isShowReminder"
        class="ml-3 mt-6 mb-6"
        :title="labels.Certificate"
        style="max-width: 875px;"
      >
        <div class="d-flex align-center">
          <v-checkbox
            v-model="value.awardCertificate"
            id="input--phishing-scenarios-award-certificate"
            hide-details
            color="#2196f3"
            label="Award certificate when a user completes the training"
            :disabled="!isInputsEditable || isInputLanguageDisabled || isEdit"
          >
          </v-checkbox>
          <KSelect
            v-model.trim="value.certificateConfigSendType"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            position="top"
            style="max-width: 200px;"
            :items="certificateTypeItems"
            :disabled="!value.awardCertificate || isEdit"
          />
        </div>
      </FormGroup>
      <FormGroup v-if="isPhishing || isQuishing" class="ml-3 mt-6 mb-6" style="overflow: visible;">
        <template #title>
          <div class="d-flex flex-row justify-content-between align-items-center">
            <div class="d-flex flex-column mr-10">
              <div class="k-form-group__title">Edit Training Redirect Page</div>
              <span class="v-list-item__subtitle k-form-group__sub-title"
                >This is the page users see after receiving an email for their phishing
                training.</span
              >
            </div>
            <div>
              <VBtn
                style="background-color: transparent;"
                class="btn-util no-box-shadow"
                color="#757575"
                rounded
                @click="handlePagePreview"
              >
                <v-icon left color="#757575">mdi-eye</v-icon>
                <span style="color: #757575;">Page preview</span>
              </VBtn>
            </div>
          </div>
        </template>
        <div
          style="display: grid; grid-template-columns: 1fr 382px;"
          class="campaign-maanger-phishing-scenarios-training-tab__page-field mb-2"
        >
          <label
            for="informationMessage"
            style="font-size: 14px; font-weight: 600; line-height: 45px;"
            >Information Message</label
          >
          <InputDescription
            v-model.trim="value.trainingRedirectPage.informationMessage"
            id="informationMessage"
            :initialPlaceholder="`Because you failed the ${
              isQuishing ? 'quishing' : 'phishing'
            } simulation test, you have been assigned to a training selected by the company admin`"
            rows="4"
            :disabled="isInputLanguageDisabled"
            :max-length="300"
            :initialRules="[
              (v) =>
                Validations.maxLength(v, 300, 'Information message cannot exceed 300 characters')
            ]"
          />
        </div>
        <div
          style="display: grid; grid-template-columns: 1fr 382px;"
          class="campaign-maanger-phishing-scenarios-training-tab__page-field mb-2"
        >
          <label for="redirectMessage" style="font-size: 14px; font-weight: 600; line-height: 45px;"
            >Redirect Message</label
          >
          <InputDescription
            v-model.trim="value.trainingRedirectPage.redirectMessage"
            id="redirectMessage"
            initialPlaceholder="Please start the training and complete the training as soon as possible"
            rows="4"
            :disabled="isInputLanguageDisabled"
            :max-length="300"
            :initialRules="[
              (v) => Validations.maxLength(v, 300, 'Redirect message cannot exceed 300 characters')
            ]"
          />
        </div>
        <div
          style="display: grid; grid-template-columns: 1fr 382px;"
          class="campaign-maanger-phishing-scenarios-training-tab__page-field mb-2"
        >
          <div class="d-flex align-center" style="margin-top: -20px;">
            <label for="startButtonLabel" style="font-size: 14px; font-weight: 600;"
              >Start Button Label</label
            >
            <VTooltip bottom max-width="240" z-index="10000">
              <template #activator="{ on }">
                <v-icon v-on="on" class="ml-2" color="#757575">mdi-information</v-icon>
              </template>
              <span
                >If multiple training languages selected, Start button will be replaced by language
                names. E.g. English.</span
              >
            </VTooltip>
          </div>
          <InputDescription
            v-model.trim="value.trainingRedirectPage.startButtonLabel"
            id="startButtonLabel"
            initialPlaceholder="Start Training"
            rows="1"
            :disabled="isMultipleLanguagesSelected || isInputLanguageDisabled"
            :max-length="40"
            :initialRules="[
              (v) => Validations.maxLength(v, 40, 'Start button label cannot exceed 40 characters')
            ]"
          />
        </div>
      </FormGroup>
    </div>
  </Fragment>
</template>
<script>
import labels from '@/model/constants/labels'
import AlertBox from '@/components/AlertBox'
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputContentLanguage from '@/components/Common/Inputs/InputContentLanguage'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import {
  enrollmentItemsTrainingTab,
  certificateTypeItems,
  attachmentScenarioEnrollmentItems
} from '@/components/CampaignManager/PhishingScenarios/utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { endTypeItems, periodTypeItems } from '@/components/AwarenessEducator/SendTraining/utils'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import * as Validations from '@/utils/validations'
import { Fragment } from 'vue-frag'
import CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal from './CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal.vue'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import { getSelectSearchPayload, createRandomCryptStringNumber } from '@/utils/functions'
export default {
  name: 'CampaignManagerPhishingScenariosTrainingTab',
  components: {
    InputDate,
    InputContentLanguage,
    KSelect,
    AlertBox,
    FormGroup,
    InputDescription,
    Fragment,
    CampaignManagerPhishingScenariosTrainingLandingPagePreviewModal
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
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
    },
    isAttachmentBasedScenario: {
      type: Boolean,
      default: false
    },
    languageOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      languages: [],
      isPagePreviewModalVisible: false,
      Validations,
      inputContentLanguageKey: createRandomCryptStringNumber(),
      labels,
      isTrainingLoading: false,
      trainingItems: [],
      enrollmentItemsTrainingTab,
      attachmentScenarioEnrollmentItems,
      certificateTypeItems,
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
      endTypeItems: structuredClone(endTypeItems),
      totalNumberOfPagesOfTrainings: 1,
      trainingPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'TrainingName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  watch: {
    value(val) {
      if (val?.trainingId && val?.trainingName) {
        const trainingItem = this?.trainingItems?.find((item) => item.value === val.trainingId)
        if (!trainingItem) {
          this.trainingItems.push({
            text: val.trainingName,
            value: val.trainingId
          })
        }
      }
      this.inputContentLanguageKey = createRandomCryptStringNumber()
    },
    isMultipleLanguagesSelected(val) {
      if (val) {
        this.$set(this.value, 'trainingRedirectPage', {
          ...this.value.trainingRedirectPage,
          startButtonLabel: ''
        })
      } else {
        this.$set(this.value, 'trainingRedirectPage', {
          ...this.value.trainingRedirectPage,
          startButtonLabel: 'Start Training'
        })
      }
    }
  },
  computed: {
    getDisabledLabelStyle() {
      const style = {}
      if (!this.isInputsEditable || this.isInputLanguageDisabled || this.isEdit)
        style.opacity = '0.5'
      return style
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isMultipleLanguagesSelected() {
      const languages =
        this.value?.trainingLanguageIds?.filter?.((language) => language !== 'All') || []
      return languages.length > 1
    },
    getPeriodTypeItems() {
      return (
        this?.enumTypes?.EmailPeriodTypeEnum?.map((type, index) => ({
          text: this.periodTypeItems[index].text,
          value: type.name
        })) || this.periodTypeItems
      )
    },
    getSubtitle() {
      let type = SCENARIO_TYPES.PHISHING
      if (this.type === SCENARIO_TYPES.QUISHING) type = SCENARIO_TYPES.QUISHING
      else if (this.type === SCENARIO_TYPES.SMISHING) type = SCENARIO_TYPES.SMISHING
      else if (this.type === SCENARIO_TYPES.CALLBACK) {
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
      if (this.isEdit)
        return `Once a ${scenarioText} campaign has started, it is not allowed to add or change the training material associated with its scenario.`
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
    this.callForAELanguages()
  },
  methods: {
    callForAELanguages() {
      AwarenessEducatorService.getLanguages().then((response) => {
        this.languages = response?.data?.data || []
      })
    },
    handlePagePreview() {
      this.isPagePreviewModalVisible = true
    },
    handleClosePagePreviewModal() {
      this.isPagePreviewModalVisible = false
    },
    callForTrainingItems(addPage) {
      if (addPage) {
        this.trainingPayload.pageNumber += 1
        if (this.trainingPayload.pageNumber > this.totalNumberOfPagesOfTrainings) return
      }
      this.isTrainingLoading = true
      AwarenessEducatorService.getTrainingItems(this.trainingPayload)
        .then((response) => {
          this.totalNumberOfPagesOfTrainings = response.data.data.totalNumberOfPages
          this.setTrainings(response)
        })
        .finally(() => {
          this.isTrainingLoading = false
        })
    },
    callForTrainingItemsSearch(search = '') {
      if (search) {
        AwarenessEducatorService.getTrainingItems(
          getSelectSearchPayload(this.trainingPayload, search, 'trainingName')
        )
          .then(this.setTrainings)
          .finally(() => {
            this.isTrainingLoading = false
          })
      } else {
        this.callForTrainingItems()
      }
    },
    setTrainings(response) {
      const newTrainings =
        response?.data?.data?.results
          ?.filter?.((result) => {
            if (!this.value) return true
            return result.trainingId !== this.value.trainingId
          })
          ?.map?.((result) => ({
            text: result.trainingName,
            value: result.trainingId
          })) || []
      this.trainingItems = [...this.trainingItems, ...newTrainings]
    },
    handlePreview() {
      this.$emit('on-preview', this.value)
    },
    handleTrainingItemSelect(item) {
      this.$set(this.value, 'trainingId', item?.value ?? '')
      this.$set(this.value, 'trainingName', item?.text ?? '')
      this.$set(this.value, 'trainingLanguageIds', [])
      if (this.value.trainingTypeId === 'Survey' || this.value.hasQuiz) {
        this.endTypeItems = endTypeItems.filter(
          (item) => item.value !== 'QuizSuccessfullyCompleted' && item.value !== 'QuizCompleted'
        )
      } else {
        this.endTypeItems = endTypeItems
      }
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
