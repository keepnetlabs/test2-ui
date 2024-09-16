<template>
  <AppModal :status="status" icon-name="$callback" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper callback-template">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Template Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Dialog Settings</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Template Info"
              subtitle="Enter basic information about this template"
            />
            <v-form ref="refFormStep1" lazy-validation>
              <FormGroup title="Template Name" has-hint>
                <InputEntityName
                  v-model.trim="formValues.name"
                  id="input--new-callback-templates-template-name"
                  entityName="template name"
                  initialPlaceholder="Enter a name"
                />
              </FormGroup>
              <FormGroup title="Description" sub-title="Describe the template briefly">
                <InputDescription
                  v-model.trim="formValues.description"
                  id="input--new-callback-templates-description"
                  initialPlaceholder="Description"
                  rows="2"
                  height="100"
                  :maxLength="300"
                />
              </FormGroup>
              <FormGroup title="Tags" sub-title="Define tags for the template">
                <InputTag
                  ref="refTags"
                  v-model="formValues.tags"
                  :items="[]"
                  :id="`input--action-tags`"
                  class="hide-caret"
                />
              </FormGroup>
              <FormGroup
                title="Difficulty"
                subTitle="Select a detection difficulty level for this callback template"
                class-name="mb-6"
              >
                <v-radio-group
                  v-model="formValues.difficulty"
                  class="send-welcome-email__radio-group mt-4"
                  hide-details
                  row
                  persistent-hint
                >
                  <v-radio
                    v-for="item in difficultyItems"
                    :key="item.text"
                    :value="item.value"
                    :label="item.text"
                    color="#2196f3"
                  ></v-radio>
                </v-radio-group>
              </FormGroup>
              <MakeAvailableFor
                v-if="isRenderMakeAvailableFor"
                ref="refMakeAvailableFor"
                v-model="formValues.availableForRequests"
                open-direction="above"
                subTitle="Select companies that should see this template in their libraries"
              />
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Dialog Settings"
              subtitle="Enter basic information about this template"
            />
            <v-form ref="refFormStep2" lazy-validation>
              <FormGroup
                style="max-width: 610px;"
                title="Language and Voice"
                sub-title="Select the language of this template and the text-to-speech voice"
              >
                <div class="d-flex flex-row">
                  <KSelect
                    v-model="selectedCallbackLanguage"
                    type="autocomplete"
                    :items="languages"
                    placeholder="Select language"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    hint="*Required"
                    :rules="[(v) => Validations.required(v, labels.Required)]"
                    class="filter-field-scenarios mr-4"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @input="onCallbackLanguageChange"
                  />
                  <KSelect
                    v-model="selectedCallbackVoice"
                    type="autocomplete"
                    :disabled="!selectedCallbackLanguage"
                    :items="getVoiceItems"
                    placeholder="Select voice"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    hint="*Required"
                    :rules="[(v) => Validations.required(v, labels.Required)]"
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  />
                </div>
              </FormGroup>
              <FormGroup
                class="mt-4"
                style="max-width: 610px;"
                title="Call Greeting"
                sub-title="This will be played as a greeting message to the user"
              >
                <CallbackTemplateDialogStep
                  v-model="formValues.callGreeting"
                  :language="selectedCallbackLanguage"
                  :voice="selectedCallbackVoice"
                  :dialingNoticeItems="dialingNoticeItems"
                  :phishingCodeDigitCount="6"
                  :isVoiceTextToSpeechCompatible="isVoiceTextToSpeechCompatible"
                  :voiceResourceId="getVoiceResourceId"
                  isCallGreeting
                  class="pb-3"
                />
              </FormGroup>
              <FormGroup
                class="mt-4"
                style="max-width: 610px;"
                title="Steps"
                sub-title="Define your callback template step by step"
              >
                <div
                  :class="{
                    'callback-template__steps': true
                  }"
                >
                  <draggable
                    v-bind="dragOptions"
                    v-model="formValues.steps"
                    group="a"
                    handle=".callback-template-dialog-step__header"
                  >
                    <CallbackTemplateDialogStep
                      v-for="(step, index) in formValues.steps"
                      v-model="formValues.steps[index]"
                      :index="index"
                      :key="index"
                      :isRemoveDisabled="formValues.steps.length === 1"
                      :language="selectedCallbackLanguage"
                      :voice="selectedCallbackVoice"
                      :isVoiceTextToSpeechCompatible="isVoiceTextToSpeechCompatible"
                      :voiceResourceId="getVoiceResourceId"
                      @removeStep="onRemoveStep(index)"
                      @vishingStepChange="onVishingStepChange"
                    />
                  </draggable>
                </div>
                <div class="mb-6">
                  <v-menu :offset-y="true" bottom right>
                    <template v-slot:activator="{ on: menu }">
                      <v-tooltip bottom opacity="1" :disabled="!isAddStepDisabled">
                        <template v-slot:activator="{ on: tooltip }">
                          <div v-on="tooltip" style="display: inline-block;">
                            <v-btn
                              v-on="{ ...menu }"
                              rounded
                              color="#2196f3"
                              :id="'callback-template-add-step-button'"
                              :class="[
                                'add-step-button',
                                'button-new',
                                'mt-3',
                                isAddStepDisabled ? 'add-step-button--disabled' : ''
                              ]"
                              :disabled="isAddStepDisabled"
                            >
                              <v-icon color="#ffffff" style="font-size: 20px; margin-top: 1px;"
                                >mdi-plus</v-icon
                              >
                              <span class="add-step-button__text">ADD STEP</span>
                            </v-btn>
                          </div>
                        </template>
                        <span class="tooltip-span"> Only 5 steps can be added. </span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in addStepItems"
                        :key="index"
                        @click="onAddStep(item.value)"
                      >
                        <v-list-item-title class="add-users__title">
                          <div class="add-step-menu-item">
                            <span class="add-step-menu-item__text">
                              {{ item.text }}
                            </span>
                            <span class="add-step-menu-item__description">
                              {{ item.description }}
                            </span>
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </FormGroup>
              <FormGroup
                style="max-width: 610px;"
                title="Invalid Dialing Notice"
                subTitle="This notice will be played when the user fails to enter a number correctly"
              >
                <v-card class="px-4 pt-3 mt-2 callback-template__invalid-dialing-notice-card">
                  <span class="callback-template__invalid-dialing-notice-title">Notice</span>
                  <FormGroup
                    style="max-width: 610px;"
                    title="Method"
                    subTitle="Choose playback method"
                    labelClassName="callback-template-dialog-step__form-label"
                  >
                    <KSelect
                      type="select"
                      persistent-hint
                      dense
                      item-text="text"
                      item-value="value"
                      outlined
                      :value="formValues.dialingNoticeStepInputType"
                      :items="dialingNoticeItems"
                      @input="onDialingNoticeInputTypeChange"
                    />
                  </FormGroup>
                  <FormGroup
                    v-if="formValues.dialingNoticeStepInputType === 'TextToSpeech'"
                    className="mt-2"
                    style="max-width: 603px;"
                    labelClassName="callback-template-dialog-step__form-label"
                    title="Text"
                    subTitle="Enter your text to be voiced by AI"
                  >
                    <InputMergeTag
                      v-model.trim="formValues.dialingNoticeStepInputText"
                      :mergeTags="[]"
                      :max-length="500"
                      :language="selectedCallbackLanguage"
                      :voice="selectedCallbackVoice"
                      :isVoiceTextToSpeechCompatible="isVoiceTextToSpeechCompatible"
                      :voiceResourceId="getVoiceResourceId"
                      initial-placeholder="Enter text here"
                      entity-name="Text to speech"
                      isTextToSpeech
                      isCallback
                      required
                    />
                  </FormGroup>
                  <div
                    v-if="formValues.dialingNoticeStepInputType === 'FileUpload'"
                    class="mt-2 pb-3"
                  >
                    <div class="callback-template-dialog-step__form-title">
                      <div class="callback-template-dialog-step__form-title-left">
                        <label class="callback-template-dialog-step__form-label">Audio File</label>
                        <span class="callback-template-dialog-step__form-subtitle"
                          >Upload an audio file</span
                        >
                      </div>
                    </div>
                    <KFileUpload
                      hint="Only MP3 files. Max. file size 1MB"
                      :extensions="['mp3']"
                      :size="1"
                      :filePreviews="getDialingNoticeFilePreviews"
                      @inputFile="onFileChanged"
                      @on-clear="onClearFile"
                    />
                    <div
                      v-if="
                        formValues.dialingNoticeStepInputUrl || formValues.dialingNoticeStepContent
                      "
                      class="callback-template-dialog-step__audio-file-preview-container"
                    >
                      <div class="callback-template-dialog-step__audio-badge-container">
                        <div class="callback-template-dialog-step__audio-badge">
                          <v-icon class="mr-1" color="#757575" size="large">$playfile-gray</v-icon
                          >Audio File
                        </div>
                        <v-btn
                          rounded
                          color="#2196f3"
                          :id="'callback-template-dialog-step__play-audio-button'"
                          :class="[
                            'add-step-button',
                            'button-new',
                            isPlayAudioDisabled ? 'add-step-button--disabled' : ''
                          ]"
                          :disabled="isPlayAudioDisabled"
                          @click="handlePlayAudio"
                        >
                          <v-icon color="#ffffff" style="font-size: 20px; margin-top: 1px;"
                            >mdi-play</v-icon
                          >
                          <span class="add-step-button__text" style="text-transform: none;"
                            >Play Audio</span
                          >
                        </v-btn>
                      </div>
                      <div
                        v-if="isPlayAudioClicked"
                        class="callback-template-dialog-step__audio-player-container"
                      >
                        <AudioPlayer
                          class="callback-template-dialog-step__audio-player"
                          :src="getDialingNoticeFileSrc"
                        />
                      </div>
                    </div>
                    <CustomError
                      class="mb-4"
                      style="margin-top: 2px;"
                      :showValidMessage="false"
                      :isValid="!fileUploadErrorText"
                      :errorMessage="fileUploadErrorText"
                    />
                  </div>
                </v-card>
              </FormGroup>
            </v-form>
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
        @on-cancel="changeCallbackTemplateModalStatus"
        @on-back="backStep(-1)"
        @on-next="nextStep(+1)"
        @on-submit="submit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import InputTag from '@/components/Common/Inputs/InputTag'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { isDifferent, scrollToComponent } from '@/utils/functions'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import KSelect from '@/components/Common/Inputs/KSelect'
import CallbackTemplateDialogStep from '@/components/CallbackScenarios/CallbackTemplateDialogStep'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import Draggable from 'vuedraggable'
import AudioPlayer from '@/components/AudioPlayer'
import CallbackService from '@/api/callback'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag'
import CustomError from '@/components/CustomError'

const initialFormValues = {
  resourceId: null,
  name: '',
  description: '',
  tags: [],
  difficulty: 1,
  vishingLanguageResourceId: '',
  availableForRequests: [],
  dialingNoticeStepResourceId: null,
  dialingNoticeStepInputType: 'TextToSpeech',
  dialingNoticeStepInputText:
    'I am sorry, I cannot recognize your request. Please enter your request again.',
  dialingNoticeStepContent: null,
  dialingNoticeStepInputUrl: null,
  callGreeting: {
    inputType: 'TextToSpeech',
    inputText: '',
    content: null,
    duration: 0,
    isVishingStep: false,
    inputUrl: null,
    isExpanded: true
  },
  steps: [
    {
      inputType: 'TextToSpeech',
      inputText: '',
      inputDigit: 0,
      duration: 0,
      content: null,
      isVishingStep: false,
      inputUrl: null,
      isExpanded: true
    }
  ]
}

export default {
  name: 'CallbackTemplateModal',
  components: {
    AppModal,
    StepperFooter,
    ConfigureCompanyStepHeader,
    FormGroup,
    InputTag,
    InputEntityName,
    InputDescription,
    MakeAvailableFor,
    KSelect,
    CallbackTemplateDialogStep,
    KFileUpload,
    Draggable,
    AudioPlayer,
    InputMergeTag,
    CustomError
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: String
    },
    languageItems: {
      type: Array,
      default: () => []
    },
    languages: {
      type: Array,
      default: () => []
    },
    voices: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isPlayAudioClicked: false,
      fileUploadErrorText: '',
      mergeTags: [
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
        }
        // {
        //   text: 'Date Sent',
        //   value: '{DATE_SENT}'
        // },
        // {
        //   text: 'Current Date',
        //   value: '{CURRENT_DATE}'
        // },
        // {
        //   text: 'Current Date Plus 10 Days',
        //   value: '{CURRENT_DATE_PLUS_10_DAYS}'
        // },
        // {
        //   text: 'Current Date Minus 10 Days',
        //   value: '{CURRENT_DATE_MINUS_10_DAYS}'
        // },
        // {
        //   text: 'Random Number 1 Digit',
        //   value: '{RANDOM_NUMBER_1_DIGIT}'
        // },
        // {
        //   text: 'Random Number 2 Digits',
        //   value: '{RANDOM_NUMBER_2_DIGITS}'
        // },
        // {
        //   text: 'Random Number 3 Digits',
        //   value: '{RANDOM_NUMBER_3_DIGITS}'
        // }
      ],
      Validations,
      labels,
      isDigitEnteringStepSelected: false,
      editItemsDisabled: false,
      step: 1,
      isSubmitDisabled: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost'
      },
      initialFormValues: JSON.parse(JSON.stringify(initialFormValues)),
      formValues: JSON.parse(JSON.stringify(initialFormValues)),
      addStepItems: [
        {
          value: 'TextToSpeech',
          text: 'Text to speech',
          description: 'Create AI dub from text'
        },
        {
          value: 'FileUpload',
          text: 'File upload',
          description: 'Upload a sound file'
        },
        {
          value: 'Pause',
          text: 'Pause',
          description: 'Give a pause'
        }
      ],
      dialingNoticeItems: [
        {
          value: 'TextToSpeech',
          text: 'Text to speech'
        },
        {
          value: 'FileUpload',
          text: 'File upload'
        }
      ],
      difficultyItems: [
        {
          value: 1,
          text: 'Easy'
        },
        {
          value: 2,
          text: 'Medium'
        },
        {
          value: 3,
          text: 'Hard'
        }
      ],
      selectedCallbackLanguage: '',
      selectedCallbackVoice: ''
    }
  },
  computed: {
    isPlayAudioDisabled() {
      return (
        (!this.formValues.dialingNoticeStepInputUrl && !this.formValues.dialingNoticeStepContent) ||
        this.isPlayAudioClicked
      )
    },
    getVoiceResourceId() {
      const callbackLanguageIndex = this.languageItems.findIndex(
        (language) =>
          language.language === this.selectedCallbackLanguage &&
          language.name === this.selectedCallbackVoice
      )

      if (callbackLanguageIndex !== -1) return this.languageItems[callbackLanguageIndex].resourceId
      return ''
    },
    isVoiceTextToSpeechCompatible() {
      const callbackLanguageIndex = this.languageItems.findIndex(
        (language) =>
          language.language === this.selectedCallbackLanguage &&
          language.name === this.selectedCallbackVoice
      )

      if (callbackLanguageIndex !== -1)
        return [2, 3].includes(this.languageItems[callbackLanguageIndex].voiceProviderTypeId)
      return false
    },
    getVoiceItems() {
      if (this.selectedCallbackLanguage) {
        const voiceItems = this.languageItems.filter(
          (language) => language.language === this.selectedCallbackLanguage
        )
        const voices = voiceItems.map((voice) => voice.name)
        return voices
      }

      return []
    },
    getTitle() {
      if (!this.isEdit) return 'New Callback Template'
      return this.isDuplicate ? 'Duplicate Callback Template' : 'Edit Callback Template'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    isAddStepDisabled() {
      return this.formValues.steps.length > 4
    },
    getDialingNoticeFileSrc() {
      if (this.formValues?.dialingNoticeStepContent) {
        return URL.createObjectURL(this.formValues.dialingNoticeStepContent)
      }

      if (this.formValues?.dialingNoticeStepInputUrl) {
        return this.formValues.dialingNoticeStepInputUrl
      }

      return null
    },
    getDialingNoticeFilePreviews() {
      if (this.formValues?.dialingNoticeStepContent) {
        return [
          {
            name: this.formValues.dialingNoticeStepContent.name,
            size: this.formValues?.dialingNoticeStepContent.size
          }
        ]
      }

      if (this.formValues?.dialingNoticeStepInputUrl) {
        const lastSlashIndex = this.formValues.dialingNoticeStepInputUrl.lastIndexOf('/') + 1
        const fileName = this.formValues.dialingNoticeStepInputUrl.substring(lastSlashIndex)
        return [{ name: fileName }]
      }

      return []
    }
  },
  created() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit || this.isDuplicate) {
      CallbackService.getCallbackTemplate(this.templateId).then((response) => {
        this.formValues = { ...this.formValues, ...(response?.data?.data || {}) }
        for (const step of this.formValues.steps) {
          step['isExpanded'] = false
        }
        this.formValues.dialingNoticeStepInputType = this.formValues.steps[0].inputType
        this.formValues.dialingNoticeStepInputText = this.formValues.steps[0].inputText
        this.formValues.dialingNoticeStepInputUrl = this.formValues.steps[0].inputUrl
        this.formValues.dialingNoticeStepContent = this.formValues.steps[0].content
        this.formValues.steps.splice(0, 1)
        this.formValues.callGreeting = { ...this.formValues.steps[0] }
        this.formValues.steps.splice(0, 1)
        this.formValues.difficulty = this.getDifficultyValue(this.formValues.difficulty)
        const callbackItemIndex = this.languageItems.findIndex(
          (language) => this.formValues.vishingLanguageResourceId === language.resourceId
        )
        if (callbackItemIndex !== -1) {
          this.selectedCallbackLanguage = this.languageItems[callbackItemIndex].language
          this.selectedCallbackVoice = this.languageItems[callbackItemIndex].name
        }
        delete this.formValues.availableForList
        delete this.formValues.createTime
        delete this.formValues.callbackLanguage
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.formValues.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  },
  methods: {
    handlePlayAudio() {
      this.isPlayAudioClicked = true
    },
    onVishingStepChange(index) {
      for (let i = 0; i < this.formValues.steps.length; i++) {
        if (index === i) {
          this.formValues.steps[i].isVishingStep = true
        } else {
          this.formValues.steps[i].isVishingStep = false
        }
      }
    },
    onCallbackLanguageChange() {
      this.selectedCallbackVoice = ''
    },
    onRemoveStep(index) {
      this.formValues.steps.splice(index, 1)
      for (let i = 0; i < this.formValues.steps.length; i++) {
        this.formValues.steps[i].order = i + 1
      }
    },
    onAddStep(type) {
      for (const step of this.formValues.steps) {
        step.isExpanded = false
      }
      const order = this.formValues.steps.length + 1
      let newItem
      switch (type) {
        case 'TextToSpeech':
          newItem = {
            inputType: 'TextToSpeech',
            inputText: '',
            inputUrl: null,
            inputDigit: 0,
            duration: 0,
            isVishingStep: false,
            order,
            isExpanded: true
          }
          break
        case 'FileUpload':
          newItem = {
            inputType: 'FileUpload',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 0,
            isVishingStep: false,
            order,
            isExpanded: true
          }
          break
        case 'Pause':
          newItem = {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 0,
            isVishingStep: false,
            order,
            isExpanded: true
          }
          break
        default:
          break
      }
      this.formValues.steps.push(newItem)
    },
    validateFailStep() {
      return this.formValues.steps.some((step) => step.isVishingStep)
    },
    validateSteps() {
      let valid = true
      let invalidStepIndex = 0
      for (let i = 0; i < this.formValues.steps.length; i++) {
        if (this.formValues.steps[i].inputType === 'Pause') {
          if (
            this.formValues.steps[i].duration === null ||
            this.formValues.steps[i].duration > 10 ||
            this.formValues.steps[i].duration < 0
          ) {
            valid = false
            invalidStepIndex = i
            break
          }
        }
        if (this.formValues.steps[i].inputType === 'FileUpload') {
          if (
            (!this.formValues.steps[i].inputUrl && !this.formValues.steps[i].content) ||
            this.formValues.steps[i].inputDigit === null ||
            this.formValues.steps[i].inputDigit > 20 ||
            this.formValues.steps[i].inputDigit < 0
          ) {
            valid = false
            invalidStepIndex = i
            break
          }
        }
        if (this.formValues.steps[i].inputType === 'TextToSpeech') {
          if (
            !this.formValues.steps[i].inputText ||
            this.formValues.steps[i].inputDigit === null ||
            this.formValues.steps[i].inputDigit > 20 ||
            this.formValues.steps[i].inputDigit < 0
          ) {
            valid = false
            invalidStepIndex = i
            break
          }
        }
      }

      if (!valid) {
        for (let i = 0; i < this.formValues.steps.length; i++) {
          if (i === invalidStepIndex) {
            this.$set(this.formValues.steps, i, {
              ...this.formValues.steps[i],
              isExpanded: true
            })
            this.$nextTick(() => {
              this.$refs.refFormStep2.validate()
            })
          } else {
            this.$set(this.formValues.steps, i, {
              ...this.formValues.steps[i],
              isExpanded: false
            })
          }
        }
      }

      return valid
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.dialingNoticeStepContent = null
        this.formValues.dialingNoticeStepInputUrl = null
        this.fileUploadErrorText = `Audio file can't be empty.`
      } else {
        this.formValues.dialingNoticeStepContent = file
        this.fileUploadErrorText = ''
      }
      this.isPlayAudioClicked = false
    },
    onClearFile() {
      this.formValues.dialingNoticeStepContent = null
      this.formValues.dialingNoticeStepInputUrl = null
    },
    changeCallbackTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeCallbackTemplateModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeCallbackTemplateModalStatus', false)
        }
      })
    },
    getInputTypeValue(inputType = 'TextToSpeech') {
      switch (inputType) {
        case 'TextToSpeech':
          return 1
        case 'FileUpload':
          return 2
        case 'Pause':
          return 3
        default:
          return 1
      }
    },
    getDifficultyValue(difficulty = 'Easy') {
      switch (difficulty) {
        case 'Easy':
          return 1
        case 'Medium':
          return 2
        case 'Hard':
          return 3
        default:
          return 1
      }
    },
    onDialingNoticeInputTypeChange(value) {
      this.formValues.dialingNoticeStepInputType = value
      if (value === 'TextToSpeech') {
        this.formValues.dialingNoticeStepInputUrl = null
        this.formValues.dialingNoticeStepContent = null
      } else {
        this.formValues.dialingNoticeStepInputText = null
      }
    },
    nextStep() {
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
        isValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refFormStep1.validate() && isValid) {
        this.step += 1
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    },
    backStep() {
      this.step -= 1
    },
    submit() {
      this.isSubmitDisabled = true
      this.isDigitEnteringStepSelected = this.validateFailStep()
      if (!this.isDigitEnteringStepSelected) {
        this.$store.dispatch('common/createSnackBar', {
          message: 'One step should be chosen as digit entering step.',
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert'
        })
        this.isSubmitDisabled = false
        return
      }

      if (!this.$refs.refFormStep2.validate() || !this.validateSteps()) {
        const el = this.$refs.refFormStep2.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }
      this.formValues.vishingLanguageResourceId = this.getVoiceResourceId
      const formData = new FormData()
      formData.append('Name', this.formValues.name)
      formData.append('Description', this.formValues.description || '')
      for (let i = 0; i < this.formValues.tags.length; i++) {
        formData.append(`Tags[${i}]`, this.formValues.tags[i])
      }
      const callbackLanguageIndex = this.languageItems.findIndex(
        (language) =>
          language.language === this.selectedCallbackLanguage &&
          language.name === this.selectedCallbackVoice
      )
      if (callbackLanguageIndex !== -1) {
        formData.append(
          'vishingLanguageResourceId',
          this.languageItems[callbackLanguageIndex].resourceId
        )
      }
      formData.append('Difficulty', this.formValues.difficulty)
      for (let i = 0; i < this.formValues.availableForRequests.length; i++) {
        formData.append(
          `AvailableForRequests[${i}].ResourceId`,
          this.formValues.availableForRequests[i].resourceId
        )
        formData.append(
          `AvailableForRequests[${i}].Type`,
          this.formValues.availableForRequests[i].type
        )
      }
      if (
        (this.formValues.dialingNoticeStepInputType === 'TextToSpeech' &&
          this.formValues.dialingNoticeStepInputText) ||
        (this.formValues.dialingNoticeStepInputType === 'FileUpload' &&
          (this.formValues.dialingNoticeStepInputUrl || this.formValues.dialingNoticeStepContent))
      ) {
        formData.append('Steps[0].Order', 0)
        formData.append(
          'Steps[0].InputType',
          this.getInputTypeValue(this.formValues.dialingNoticeStepInputType)
        )
        formData.append('Steps[0].Content', this.formValues.dialingNoticeStepContent)
        formData.append('Steps[0].InputUrl', this.formValues.dialingNoticeStepInputUrl)
        formData.append('Steps[0].InputText', this.formValues.dialingNoticeStepInputText)
        if (this.isEdit && !this.formValues.dialingNoticeStepContent) {
          formData.delete(`Steps[0].Content`)
          formData.delete(`Steps[0].InputUrl`)
        }
        if (
          this.isDuplicate &&
          !this.formValues.dialingNoticeStepContent &&
          this.formValues.dialingNoticeStepInputUrl
        ) {
          formData.set(`Steps[0].InputUrl`, this.formValues.dialingNoticeStepInputUrl)
          formData.delete(`Steps[0].Content`)
        }
        if (this.isDuplicate && this.formValues.dialingNoticeStepContent) {
          formData.delete(`Steps[0].InputUrl`)
          formData.set(`Steps[0].Content`, this.formValues.dialingNoticeStepContent)
        }
      }
      formData.append(
        'Steps[1].InputType',
        this.getInputTypeValue(this.formValues.callGreeting.inputType)
      )
      formData.append('Steps[1].InputText', this.formValues.callGreeting.inputText)
      formData.append('Steps[1].Content', this.formValues.callGreeting.content)
      formData.append('Steps[1].Duration', this.formValues.callGreeting.duration)
      formData.append('Steps[1].InputUrl', this.formValues.callGreeting.inputUrl)
      formData.append('Steps[1].IsVishingStep', this.formValues.callGreeting.isVishingStep)
      formData.append('Steps[1].Order', 1)
      for (let i = 0; i < this.formValues.steps.length; i++) {
        formData.append(
          `Steps[${i + 2}].InputType`,
          this.getInputTypeValue(this.formValues.steps[i].inputType)
        )
        formData.append(`Steps[${i + 2}].Order`, i + 2)
        formData.append(
          `Steps[${i + 2}].IsVishingStep`,
          this.formValues.steps[i].isVishingStep || false
        )
        formData.append(`Steps[${i + 2}].InputText`, this.formValues.steps[i].inputText)
        formData.append(`Steps[${i + 2}].InputDigit`, this.formValues.steps[i].inputDigit)
        formData.append(`Steps[${i + 2}].Duration`, this.formValues.steps[i].duration)
        formData.append(`Steps[${i + 2}].InputUrl`, this.formValues.steps[i].inputUrl)
        formData.append(`Steps[${i + 2}].Content`, this.formValues.steps[i].content)
      }
      if (this.isEdit && !this.isDuplicate) {
        CallbackService.updateCallbackTemplate(this.templateId, formData)
          .then(() => {
            this.$emit('changeCallbackTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        CallbackService.createCallbackTemplate(formData)
          .then(() => {
            this.$emit('changeCallbackTemplateModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    }
  }
}
</script>
