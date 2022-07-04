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
                sub-title="Select a detection difficulty level for this vishing template"
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
            <v-form ref="refDialogSettingsForm" lazy-validation>
              <FormGroup
                title="Language"
                sub-title="Select the language of this template and text-to-speech speaker"
              >
                <KSelect
                  v-model="formValues.language"
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
                <VishingTemplateDialogStep
                  v-for="(step, index) in formValues.steps"
                  :step="step"
                  :index="index + 1"
                  :key="index"
                  @removeStep="onRemoveStep(index)"
                />
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
    VishingTemplateDialogStep
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
      editItemsDisabled: false,
      step: 1,
      isSubmitDisabled: false,
      initialFormValues: {},
      formValues: {
        name: '',
        description: '',
        tags: [],
        difficultyResourceId: 'mT0CeYGgKsVb',
        availableForRequests: [],
        steps: [
          {
            type: 'textToSpeech'
          },
          {
            type: 'uploadAudio'
          },
          {
            type: 'pause'
          }
        ]
      },
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
    }
  },
  created() {},
  methods: {
    onRemoveStep(index) {
      this.formValues.steps.splice(index, 1)
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
    submit() {}
  }
}
</script>
