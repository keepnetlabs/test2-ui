<template>
  <app-modal :status="status" icon-name="mdi-message-alert" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Template Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Text Message Settings</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="email-template-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Text Message Template Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this scenario</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Template Name" has-hint class-name="mt-8">
                  <InputEntityName
                    v-model.trim="formValues.name"
                    id="input--new-email-templates-template-name"
                    entityName="template name"
                    initialPlaceholder="Enter a name"
                    :disabled="editItemsDisabled"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the template briefly">
                  <InputDescription
                    v-model.trim="formValues.description"
                    id="input--new-email-templates-description"
                    initialPlaceholder="Description"
                    rows="2"
                    height="100"
                    :maxLength="300"
                  />
                </form-group>
                <form-group
                  title="Method"
                  sub-title="Select the phishing technique for this template"
                  has-hint
                >
                  <k-select
                    v-bind="commonRules"
                    v-model.trim="formValues.categoryResourceId"
                    :items="methodItems"
                    item-disabled="disabled"
                    item-text="name"
                    item-value="resourceId"
                    outlined
                    hint="*Required"
                    required
                    persistent-hint
                    :slots="{ item: true }"
                  >
                    <template #item="{ item }">
                      <div :class="['mail-configuration-select-sources__item-container']">
                        <div class="mail-configuration-select-sources__item">
                          <div class="mail-configuration-select-sources__item-left">
                            {{ item.name }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{ item.description }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </k-select>
                </form-group>
                <form-group
                  has-hint
                  title="Language"
                  sub-title="Select the language you are writing this webpage template in"
                >
                  <input-select-language
                    v-model="formValues.languageTypeResourceId"
                    v-bind="commonRules"
                    item-text="text"
                    item-value="value"
                    required
                    :items="languageOptions"
                    :menu-props="{ offsetY: true }"
                  />
                </form-group>
                <form-group title="Tags" sub-title="Define tags for the template">
                  <InputTag
                    ref="refTags"
                    v-model="formValues.tags"
                    :items="[]"
                    :id="`input--action-tags`"
                    class="hide-caret"
                  />
                </form-group>
                <form-group
                  title="Difficulty"
                  sub-title="Select a detection difficulty level for this phishing email"
                  class-name="mb-6"
                >
                  <v-radio-group
                    v-model="formValues.difficultyResourceId"
                    class="send-welcome-email__radio-group mt-4"
                    hide-details
                    row
                    persistent-hint
                  >
                    <v-radio
                      v-for="item in difficultyItems"
                      :key="item.name"
                      :value="item.resourceId"
                      :label="item.name"
                      color="#2196f3"
                    ></v-radio>
                  </v-radio-group>
                </form-group>
                <make-available-for
                  v-if="isRenderMakeAvailableFor"
                  ref="refMakeAvailableFor"
                  v-model="availableForRequests"
                  open-direction="above"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Text Message Settings</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this scenario</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-form ref="refEmailTemplateContent" style="padding-right: 72px;">
                    <form-group
                      class="mt-8"
                      style="max-width: 592px;"
                      title="Text Message"
                      sub-title="Text message to be sent to target users. Use the mandatory merge tag {PHISHINGURL} for the link to be added to the text message"
                    >
                      <InputMergeTag
                        v-model.trim="formValues.template"
                        id="input--new-text-message-template-text-message"
                        initialPlaceholder="Text message {PHISHINGURL}"
                        rows="5"
                        height="160"
                        hint="SMS supports the GSM-7 character set and can contain up to 160 characters"
                        required
                        :maxLength="160"
                        :mergeTags="mergeTags"
                        :initialRules="textMessageRules"
                      >
                        <template #append-inner>
                          <v-btn
                            class="enhance-button"
                            color="#2196F3"
                            rounded
                            :style="getEnhanceButtonStyle"
                            @click="handleEnhance"
                          >
                            <v-icon left color="white" style="margin-right: 4px; font-size: 16px;"
                              >mdi-creation</v-icon
                            >
                            <span
                              style="
                                color: white;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: capitalize;
                              "
                              >Enhance</span
                            >
                          </v-btn>
                        </template>
                      </InputMergeTag>
                      <AlertBox
                        v-if="enhanceAlertText"
                        class="enhance-alert-box"
                        :text="enhanceAlertText"
                        :slots="{ primaryAction: true, secondaryAction: true }"
                      >
                      </AlertBox>
                    </form-group>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :step.sync="step"
        :disabled-statuses="{
          nextButton: isSubmitDisabled,
          submitButton: isSubmitDisabled
        }"
        :ids="footerButtonsIds"
        @on-cancel="changeNewEmailTemplateModalStatus"
        @on-back="backStep(-1)"
        @on-next="nextStep(+1)"
        @on-submit="checkComplianceAndSubmit"
      />
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { MERGED_TEXTS } from '@/components/PhishingScenarios/utils'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag'
import { mapGetters } from 'vuex'
import useSetAttachmentFile from '@/hooks/useSetAttachmentFile'
import AlertBox from '@/components/AlertBox'
export default {
  name: 'NewSmishingTemplate',
  components: {
    StepperFooter,
    KSelect,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    InputSelectLanguage,
    InputTag,
    InputEntityName,
    InputDescription,
    InputMergeTag,
    AlertBox
  },
  mixins: [useSetAttachmentFile],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    editableFormValues: {
      required: false
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    emailTemplateId: {
      type: String
    }
  },
  data() {
    return {
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-email-templates-modal',
        backButton: 'btn-back--add-or-edit-email-templates-modal',
        nextButton: 'btn-next--add-or-edit-email-templates-modal',
        saveButton: 'btn-save--add-or-edit-email-templates-modal'
      },
      isEnhanceDisabled: false,
      isAttachmentError: false,
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false,
      isRenameModalVisible: false,
      attachmentName: '',
      languageOptions: [],
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      availableForRequests: [],
      tagSearch: '',
      enhanceAlertText: '',
      labels,
      step: 1,
      Validations: Validations,
      initialFormValues: {},
      formValues: {
        name: '',
        description: '',
        categoryResourceId: 'WNZt0sCVCWB3',
        tags: [],
        difficultyResourceId: 'mT0CeYGgKsVb',
        languageTypeResourceId: '862249c19aad',
        template: ''
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      textMessageRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          const mergeTagsCharacterLength =
            matches?.reduce((acc, match) => acc + match.length, 0) || 0
          if (v.length - mergeTagsCharacterLength > 160)
            return `SMS supports the GSM-7 character set and can contain up to 160 characters excluding the merge tags.`
          return true
        }
      ],
      editItemsDisabled: false,
      methodItems: [
        {
          resourceId: 'WNZt0sCVCWB3',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Click Only',
          code: '1',
          description: 'See who falls for phishing links',
          orderNumber: 1
        },
        {
          resourceId: 'DYC0gugxJMjT',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Data Submission',
          code: '2',
          description: 'Gather information from users',
          orderNumber: 2
        }
      ],
      difficultyItems: [
        {
          resourceId: 'mT0CeYGgKsVb',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Easy',
          code: '1',
          description: null,
          orderNumber: 1
        },
        {
          resourceId: 'Z5XeVlpw6Dps',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Medium',
          code: '2',
          description: null,
          orderNumber: 2
        },
        {
          resourceId: 'c4LCGEB9MayB',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Hard',
          code: '3',
          description: null,
          orderNumber: 3
        }
      ],
      mergeTags: [
        {
          text: 'Phishing URL',
          value: '{PHISHINGURL}'
        },
        {
          text: 'Full Name',
          value: '{FULLNAME}'
        },
        {
          text: 'First Name',
          value: '{FIRSTNAME}'
        },
        {
          text: 'Last Name',
          value: '{LASTNAME}'
        },
        {
          text: 'Company Name',
          value: '{COMPANYNAME}'
        },
        {
          text: 'Date Sent',
          value: '{DATE_SENT}'
        },
        {
          text: 'Current Date',
          value: '{CURRENT_DATE}'
        },
        {
          text: 'Current Date Plus 10 Days',
          value: '{CURRENT_DATE_PLUS_10_DAYS}'
        },
        {
          text: 'Current Date Minus 10 Days',
          value: '{CURRENT_DATE_MINUS_10_DAYS}'
        },
        {
          text: 'Random Number 1 Digit',
          value: '{RANDOM_NUMBER_1_DIGIT}'
        },
        {
          text: 'Random Number 2 Digits',
          value: '{RANDOM_NUMBER_2_DIGITS}'
        },
        {
          text: 'Random Number 3 Digits',
          value: '{RANDOM_NUMBER_3_DIGITS}'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getTitle() {
      if (this.isEdit && this.isDuplicate) {
        return 'Duplicate Text Message Template'
      }

      if (this.isEdit) {
        return 'Edit Text Message Template'
      }

      return 'New Text Message Template'
    },
    isAttachmentBasedTemplate() {
      return this.formValues.categoryResourceId === '7dLrW2kdBTDs'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    getEnhanceButtonStyle() {
      const defaultStyle = {
        textTransform: 'capitalize',
        maxHeight: '28px'
      }
      if (
        !this.formValues.template ||
        this.formValues.template.length <= 1 ||
        this.isEnhanceDisabled
      ) {
        return {
          opacity: 0.5,
          pointerEvents: 'none',
          ...defaultStyle
        }
      }
      return defaultStyle
    }
  },
  created() {
    this.setFooterButtonIds()
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      SmishingService.getTextMessageTemplate(this.emailTemplateId).then((response) => {
        this.formValues = {
          ...response.data.data,
          description: response.data.data.description || ''
        }
        this.formValues.name = `${this.formValues.name}`
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
    if (!(this.isEdit || this.isDuplicate)) {
      const preferredLanguageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
      this.formValues.languageTypeResourceId = preferredLanguageTypeResourceId
    }
  },
  methods: {
    setFooterButtonIds() {
      if (!this.isDuplicate) return
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--email-templates-modal',
        backButton: 'btn-duplicate-back--email-templates-modal',
        nextButton: 'btn-duplicate-next--email-templates-modal',
        saveButton: 'btn-duplicate-save--email-templates-modal'
      }
    },
    handleDeleteAttachment() {
      this.formValues.attachmentFiles = []
      this.isAddedNewPhishingFile = false
    },
    handleRenameAttachment() {
      this.$emit('showRenameAttachmentModal')
    },
    handleUploadEmailButtonClick() {
      this?.$refs?.refInputFileUpload?.click()
    },
    handleAttachmentRemove({ item, index }) {
      this.formValues.attachmentFilesToRemove = item.fileName
      const newAttachmentFilesFromApi = JSON.parse(
        JSON.stringify(this.formValues.attachmentFilesFromApi)
      )
      if (this.formValues.attachmentFiles && this.formValues.attachmentFiles.length === 1) {
        newAttachmentFilesFromApi.splice(index - 1, 1)
        this.formValues.importedEmailAttachments.splice(index - 1, 1)
      } else {
        newAttachmentFilesFromApi.splice(index, 1)
        this.formValues.importedEmailAttachments.splice(index, 1)
      }
      this.formValues.attachmentFilesFromApi = newAttachmentFilesFromApi
    },
    handleInitialTemplate(value) {
      this.initialFormValues.template = value
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    changeNewEmailTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeNewEmailTemplateModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewEmailTemplateModalStatus', false)
        }
      })
    },
    nextStep() {
      let isMakeAvailableForValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isMakeAvailableForValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refFormStep1.validate() && isMakeAvailableForValid) {
        this.step += 1
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    },
    backStep() {
      this.step -= 1
    },
    checkComplianceAndSubmit() {
      this.isSubmitDisabled = true
      SmishingService.checkSmishingTextRisk(this.formValues.template).then((response) => {
        const { data } = response
        const assistantMessage = data.find((item) => item.role === 'assistant')
        const { approval, reason } = JSON.parse(assistantMessage.content[0].text)
        if (approval === 'Yes') {
          this.enhanceAlertText = ''
          this.submit()
        } else {
          this.enhanceAlertText = reason
          this.isSubmitDisabled = false
        }
      })
    },
    submit() {
      this.isSubmitDisabled = true
      let isMakeAvailableForValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isMakeAvailableForValid = refMakeAvailableFor.isAvailableForValid
      }
      const isFormValid = this.$refs.refEmailTemplateContent.validate() && isMakeAvailableForValid
      if (!isFormValid) {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }

      if (!this.formValues?.template?.includes('{PHISHINGURL}')) {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-information',
          message: `You cannot save without adding a {PHISHINGURL} to the text message field`
        })
        this.isSubmitDisabled = false
        return
      }

      const formData = new FormData()
      let payload = {
        ...this.formValues,
        isDuplicated: this.isDuplicate,
        description: this.formValues.description || ''
      }
      const availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForValues(
        this.availableForRequests
      )
      delete payload['availableForList']
      for (const key in payload) {
        if (Array.isArray(payload[key])) {
          payload[key].forEach((x) => formData.append(key, x))
        } else {
          payload[key] && formData.append(key, payload[key])
        }
      }
      for (let i = 0; i < availableForRequests.length; i++) {
        formData.append(`AvailableForRequests[${i}].ResourceId`, availableForRequests[i].resourceId)
        formData.append(`AvailableForRequests[${i}].Type`, availableForRequests[i].type)
      }
      if (this.isEdit && !this.isDuplicate) {
        SmishingService.updateTextMessageTemplate(this.emailTemplateId, formData)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        SmishingService.createTextMessageTemplate(formData)
          .then(() => {
            this.$emit('changeNewEmailTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.name,
            value: language.resourceId
          })) || []
      })
    },
    getTagsComponent(item) {
      return MERGED_TEXTS[item]
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    handleEnhance() {
      this.isEnhanceDisabled = true
      this.enhanceAlertText = ''
      this.isSubmitDisabled = true
      SmishingService.enhanceSmishingText(this.formValues.template)
        .then((response) => {
          try {
            const { data } = response
            this.isSubmitDisabled = false
            const assistantMessage = data.find((item) => item.role === 'assistant')
            if (assistantMessage && assistantMessage.content && assistantMessage.content[0]) {
              const enhancedData = JSON.parse(assistantMessage.content[0].text)
              if (enhancedData.rewritten_text) {
                this.formValues.template = enhancedData.rewritten_text
              }
            }
          } catch (error) {}
          this.isEnhanceDisabled = false
        })
        .catch(() => {
          this.isEnhanceDisabled = false
          this.isSubmitDisabled = false
        })
    }
  }
}
</script>
