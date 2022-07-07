<template>
  <AppModal :status="status" icon-name="mdi-phone-in-talk" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
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
          <v-stepper-content class="k-stepper__content vishing-template" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Template Info"
              subtitle="Enter basic information about this template"
            />
            <v-form ref="refFormStep1" lazy-validation>
              <FormGroup title="Template Name" has-hint>
                <InputEntityName
                  v-model.trim="formValues.name"
                  id="input--new-vishing-templates-template-name"
                  entityName="template name"
                  initialPlaceholder="Enter a name"
                />
              </FormGroup>
              <FormGroup title="Description" sub-title="Describe the template briefly">
                <InputDescription
                  v-model.trim="formValues.description"
                  id="input--new-vishing-templates-description"
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
                subTitle="Select a detection difficulty level for this vishing template"
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
              </FormGroup>
              <MakeAvailableFor
                v-if="isRenderMakeAvailableFor"
                ref="refMakeAvailableFor"
                v-model="formValues.availableForRequests"
                open-direction="above"
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
                title="Language"
                sub-title="Select the language of this template and text-to-speech speaker"
              >
                <KSelect
                  v-model="formValues.languageResourceId"
                  :items="languageItems"
                  placeholder="Select language"
                  item-disabled="disabled"
                  item-text="text"
                  item-value="value"
                  outlined
                  persistent-hint
                  class="filter-field-scenarios"
                  style="padding-right: 4px !important; padding-left: 4px !important;"
                />
              </FormGroup>
              <FormGroup title="Steps" sub-title="Define your vishing template step by step">
                <div
                  :class="{
                    'vishing-template__steps': true,
                    'vishing-template__steps--error': !isFailStepSelected
                  }"
                >
                  <draggable
                    v-bind="dragOptions"
                    v-model="formValues.steps"
                    group="a"
                    handle=".vishing-template-dialog-step__header"
                  >
                    <VishingTemplateDialogStep
                      v-for="(step, index) in formValues.steps"
                      v-model="formValues.steps[index]"
                      :index="index"
                      :key="index"
                      @removeStep="onRemoveStep(index)"
                      @failStepChange="onFailStepChange"
                    />
                  </draggable>
                </div>
                <span v-if="!isFailStepSelected" class="vishing-template__steps-error-text mt-2">
                  One step must be selected as fail step
                </span>
                <div class="mb-6">
                  <v-menu :offset-y="true" bottom right>
                    <template v-slot:activator="{ on: menu }">
                      <v-tooltip bottom opacity="1" :disabled="!isAddStepDisabled">
                        <template v-slot:activator="{ on: tooltip }">
                          <div v-on="tooltip" style="display: inline-block;">
                            <v-btn
                              v-on="{ ...menu }"
                              class="add-step-button button-new mt-3"
                              rounded
                              color="#2196f3"
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
                title="Invalid Dialing Notice"
                subTitle="This notice will be played when the user fails to enter a number correctly"
              >
                <v-card class="px-4 pt-3 mt-2">
                  <span class="vishing-template__invalid-dialing-notice-title">Notice</span>
                  <FormGroup
                    title="Method"
                    subTitle="Choose playback method"
                    labelClassName="vishing-template-dialog-step__form-label"
                  >
                    <k-select
                      type="select"
                      v-model.trim="formValues.dialogNoticeType"
                      :items="dialogNoticeItems"
                      persistent-hint
                      dense
                      item-text="text"
                      item-value="value"
                      outlined
                    ></k-select>
                  </FormGroup>
                  <FormGroup
                    v-if="formValues.dialogNoticeType === 'textToSpeech'"
                    className="mt-2"
                    labelClassName="vishing-template-dialog-step__form-label"
                    title="Text"
                    subTitle="Enter your text to be voiced by AI"
                  >
                    <InputDescription
                      v-model.trim="formValues.dialogNoticeTextToSpeech"
                      initialPlaceholder="Enter text here"
                    />
                  </FormGroup>
                  <div v-if="formValues.dialogNoticeType === 'uploadAudio'" class="mt-2 pb-3">
                    <div class="vishing-template-dialog-step__form-title">
                      <div class="vishing-template-dialog-step__form-title-left">
                        <label class="vishing-template-dialog-step__form-label">Audio File</label>
                        <span class="vishing-template-dialog-step__form-subtitle"
                          >Upload an audio file</span
                        >
                      </div>
                      <div class="vishing-template-dialog-step__form--title-right">
                        <AudioPlayer
                          v-if="
                            formValues.dialogNoticeType === 'uploadAudio' &&
                            formValues.dialogNoticeFileUrl
                          "
                          isPreview
                          :src="formValues.dialogNoticeFileUrl"
                        />
                      </div>
                    </div>
                    <KFileUpload
                      hint="Only MP3 files. Max. file size 1MB"
                      :extensions="['mp3']"
                      :size="1"
                      @inputFile="onFileChanged"
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
        @on-cancel="changeVishingTemplateModalStatus"
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
import VishingTemplateDialogStep from '@/components/VishingTemplates/VishingTemplateDialogStep'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import Draggable from 'vuedraggable'
import AudioPlayer from '@/components/AudioPlayer'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import { updateVishingTemplate, createVishingTemplate, getVishingTemplate } from '@/api/vishing'

const initialFormValues = {
  name: '',
  description: '',
  tags: [],
  difficultyResourceId: 'mT0CeYGgKsVb',
  languageResourceId: 'WNZt0sCVCWB3',
  availableForRequests: [],
  dialogNoticeType: 'textToSpeech',
  dialogNoticeTextToSpeech: '',
  dialogNoticeFile: null,
  dialogNoticeFileUrl: '',
  steps: []
}

export default {
  name: 'VishingTemplateModal',
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
    VishingTemplateDialogStep,
    KFileUpload,
    Draggable,
    AudioPlayer
  },
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
    templateId: {
      type: String
    }
  },
  data() {
    return {
      isFailStepSelected: true,
      editItemsDisabled: false,
      step: 1,
      isSubmitDisabled: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost'
      },
      initialFormValues: JSON.parse(JSON.stringify(initialFormValues)),
      formValues: JSON.parse(JSON.stringify(initialFormValues)),
      nonEditableAvailableForRequests: [],
      addStepItems: [
        {
          value: 'textToSpeech',
          text: 'Text to speech',
          description: 'Create AI dub from text'
        },
        {
          value: 'uploadAudio',
          text: 'File upload',
          description: 'Upload a sound file'
        },
        {
          value: 'pause',
          text: 'Pause',
          description: 'Give a pause'
        }
      ],
      dialogNoticeItems: [
        {
          value: 'textToSpeech',
          text: 'Text to speech'
        },
        {
          value: 'uploadAudio',
          text: 'File upload'
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
      languageItems: [
        { text: 'English - Male', value: 'WNZt0sCVCWB3' },
        { text: 'English - Female', value: 'DYC0gugxJMjT' }
      ]
    }
  },
  computed: {
    getTitle() {
      return !this.isEdit
        ? 'New Vishing Template'
        : this.isDuplicate
        ? 'Duplicate Vishing Template'
        : 'Edit Vishing Template'
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    isAddStepDisabled() {
      return this.formValues.steps.length > 4
    }
  },
  watch: {
    'formValues.steps': {
      handler(val) {
        this.isFailStepSelected = this.validateFailStep()
      },
      deep: true
    }
  },
  created() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit || this.isDuplicate) {
      getVishingTemplate(this.templateId).then((response) => {
        // TODO: Make necessary assignments
        //  this.formValues = {
        //   ...response.data.data,
        // }
        // if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        // if (this.$refs.refMakeAvailableFor && availableForList.length) {
        //   const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
        //     availableForList
        //   )
        //   if (!availableForListFromBackend.length) {
        //     this.availableForRequests = [
        //       {
        //         id: 'MyCompanyOnly',
        //         label: 'My company only',
        //         type: 'MyCompanyOnly',
        //         resourceId: null
        //       }
        //     ]
        //   } else {
        //     this.availableForRequests = availableForListFromBackend
        //   }
        // } else {
        //   this.availableForRequests = [
        //     {
        //       id: 'MyCompanyOnly',
        //       label: 'My company only',
        //       type: 'MyCompanyOnly',
        //       resourceId: null
        //     }
        //   ]
        //   this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
        //     response.data.data.availableForList
        //   )
        // }
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  },
  methods: {
    onRemoveStep(index) {
      this.formValues.steps.splice(index, 1)
    },
    onAddStep(type) {
      let newItem
      switch (type) {
        case 'textToSpeech':
          newItem = {
            type: 'textToSpeech',
            textToSpeech: '',
            requiredDigitCount: 0,
            pauseDuration: 0,
            isFailStep: false,
            fileName: '',
            fileUrl: ''
          }
          break
        case 'uploadAudio':
          newItem = {
            type: 'uploadAudio',
            textToSpeech: '',
            requiredDigitCount: 0,
            pauseDuration: 0,
            isFailStep: false,
            fileName: '',
            fileUrl: ''
          }
          break
        case 'pause':
          newItem = {
            type: 'pause',
            textToSpeech: '',
            requiredDigitCount: 0,
            pauseDuration: 0,
            isFailStep: false,
            fileName: '',
            fileUrl: ''
          }
        default:
          break
      }
      this.formValues.steps.push(newItem)
    },
    onFailStepChange(index) {
      for (let i = 0; i < this.formValues.steps.length; i++) {
        if (index === i) {
          this.formValues.steps[i].isFailStep = true
        } else {
          this.formValues.steps[i].isFailStep = false
        }
      }
    },
    validateFailStep() {
      return this.formValues.steps.some((step) => step.isFailStep)
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.dialogNoticeFile = null
        this.formValues.dialogNoticeFileUrl = ''
      } else {
        this.formValues.dialogNoticeFile = file
        this.formValues.dialogNoticeFileUrl = URL.createObjectURL(file)
      }
    },
    changeVishingTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeVishingTemplateModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeVishingTemplateModalStatus', false)
        }
      })
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
      this.isFailStepSelected = this.validateFailStep()
      if (!this.isFailStepSelected) {
        const el = this.$refs.refFormStep2.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }

      if (!this.$refs.refFormStep2.validate()) {
        const el = this.$refs.refFormStep2.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
        return
      }

      if (this.isEdit) {
        updateVishingTemplate(this.templateId, this.formValues)
          .then(() => {
            this.$emit('changeVishingTemplateModalStatus', false)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        createVishingTemplate(this.formValues)
          .then(() => {
            this.$emit('changeVishingTemplateModalStatus', false)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    }
  }
}
</script>
