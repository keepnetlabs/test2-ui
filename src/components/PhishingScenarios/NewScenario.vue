<template>
  <app-modal
    :status="status"
    icon-name="mdi-hook"
    :title="
      !isEdit
        ? 'New Phishing Scenario'
        : isDuplicate
        ? 'Duplicate Phishing Scenario'
        : 'Edit Phishing Scenario'
    "
  >
    <template v-slot:overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Scenario Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Email Template</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />

          <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
            >Landing Page</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />

          <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
            >Summary</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="phishing-scenario-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Scenario Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Enter basic information about this scenario</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Scenario Name" has-hint class-name="mt-8">
                  <v-text-field
                    v-model.trim="formValues.name"
                    v-bind="commonRules"
                    id="input--new-phishing-scenarios-template-name"
                    placeholder="Enter a name"
                    hint="*Required"
                    required
                    outlined
                    dense
                    persistent-hint
                    :disabled="editItemsDisabled"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the template briefly">
                  <v-textarea
                    id="input--new-phishing-scenarios-description"
                    outlined
                    dense
                    rows="2"
                    no-resize
                    placeholder="Description"
                    height="100"
                    v-model.trim="formValues.description"
                    persistent-hint
                  ></v-textarea>
                </form-group>
                <form-group
                  has-hint
                  title="Method"
                  sub-title="Select the phishing technique for this scenario"
                >
                  <v-select
                    :items="scenarioDetailsLookup.methodTypes"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="formValues.methodTypeId"
                    item-value="value"
                    outlined
                    v-bind="commonRules"
                    hint="*Required"
                    required
                    persistent-hint
                  >
                    <template #item="{item}">
                      <div :class="['mail-configuration-select-sources__item-container']">
                        <div class="mail-configuration-select-sources__item">
                          <div class="mail-configuration-select-sources__item-left">
                            {{ item.text }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{
                              item.text === 'Click-Only'
                                ? 'See who fails for phishing links'
                                : item.text === 'Data Submission'
                                ? 'Gather information from users'
                                : 'Send a trackable macro file '
                            }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-select>
                </form-group>
                <form-group title="Tags" sub-title="Define tags for the scenario">
                  <k-select
                    :value="formValues.tags"
                    :search-input.sync="tagSearch"
                    ref="refTags"
                    type="combobox"
                    id="input--action-tags-new-scenario"
                    :items="[]"
                    chips
                    deletable-chips
                    outlined
                    class="hide-caret"
                    multiple
                    dense
                    persistent-hint
                    small-chips
                    :return-object="false"
                    @input="handleTagItemChange"
                    placeholder="Enter tags and press enter key"
                  />
                </form-group>
                <make-available-for
                  v-if="isRenderMakeAvailableFor"
                  ref="refMakeAvailableFor"
                  v-model="formValues.availableForRequests"
                  sub-title="Select companies that should see this scenario in their libraries"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Select Email Template</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Choose your email template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <EmailTemplateListPreview
                    v-if="step === 2"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    ref="RefEmailTemplateListPreview"
                    :emailTemplateResourceId="emailTemplateResourceId"
                    @selectedEmailTemplateChange="selectedEmailTemplateChange"
                    @selectedEmailTemplateResourceId="selectedEmailTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                  ></EmailTemplateListPreview>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Select Landing Page Template</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Choose your landing page template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="margin-top: -10px;">
                <v-list-item-content>
                  <LandingPageListPreview
                    v-if="step === 3"
                    :scenarioDetailsLookup="scenarioDetailsLookup"
                    ref="RefEmailTemplateListPreview"
                    @selectedLandingPageChange="selectedLandingPageChange"
                    @selectedLandingPageTemplateResourceId="selectedLandingPageTemplateResourceId"
                    :landingPageTemplateResourceId="landingPageTemplateResourceId"
                    @loading="isSubmitDisabled = $event"
                  ></LandingPageListPreview
                ></v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content summary-step" :step="4">
            <div class="email-settings" v-if="step === 4">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-phishing-scenario__title">
                    Scenario Summary</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                    >Preview what this scenario will look like</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-information' }}
                        </v-icon>
                        Scenario Info
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="summary-content-details">
                        <span class="summary-content__title">Name</span
                        ><span class="summary-content__body">{{ formValues.name }}</span>
                      </div>
                      <div class="summary-content-details">
                        <span class="summary-content__title">Method</span
                        ><span class="summary-content__body">{{
                          scenarioDetailsLookup.methodTypes.find(
                            (item) => item.value === formValues.methodTypeId
                          ).text
                        }}</span>
                      </div>
                      <div class="summary-content-details" style="border-bottom: none !important;">
                        <span class="summary-content__title">Difficulty</span
                        ><span class="summary-content__body">{{ getDifficultyType }}</span>
                      </div>
                    </div>
                    <div class="summary-content__collapsable"></div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-email' }}
                        </v-icon>
                        Email that will be sent to users
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate1 = !showTemplate1"
                          >Details
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ showTemplate1 ? 'mdi-menu-up' : 'mdi-menu-down' }}
                          </v-icon></v-btn
                        >
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!summaryData">
                          <div class="template-summary__title">
                            {{ summaryData.emailTemplate.name }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            From: {{ summaryData.emailTemplate.fromAddress }}
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
                          <v-chip
                            class="template-list--item template-list--item__chip p mr-2"
                            style="color: white;"
                            :color="
                              difficulties.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.difficultyResourceId
                              ).text === 'Easy'
                                ? '#217124'
                                : difficulties.find(
                                    (item) =>
                                      item.value === summaryData.emailTemplate.difficultyResourceId
                                  ).text === 'Medium'
                                ? '#2196F3'
                                : '#F56C6C'
                            "
                            v-if="!!summaryData"
                          >
                            {{
                              difficulties.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.difficultyResourceId
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            class="template-list--item template-list--item__chip p"
                            v-if="!!summaryData"
                          >
                            {{
                              methods.find(
                                (item) =>
                                  item.value === summaryData.emailTemplate.categoryResourceId
                              ).text
                            }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                    <div class="summary-content" style="border: none; padding-top: 0;">
                      <div
                        v-for="(att, ind) of summaryData.emailTemplate.attachments"
                        :key="ind + att.name"
                        class="preview-attch-wrapper"
                      >
                        <div class="attachment-wrapper">
                          <div
                            class="attachment blue-attach"
                            :id="'single-post-attachments-' + att.name"
                          >
                            <v-tooltip bottom opacity="1" z-index="9999">
                              <template v-slot:activator="{ on }">
                                <div
                                  v-on="on"
                                  id="text--attachment-preview-no-flaged"
                                  class="attach-icon blue-icon"
                                >
                                  <v-icon color="white" style="font-size: 20px;"
                                    >mdi-paperclip</v-icon
                                  >
                                </div>
                                <div
                                  v-on="on"
                                  id="text--attachment-preview-name"
                                  class="file-name safari-hide-tooltip max-char pl-2"
                                >
                                  {{ att.fileName }}
                                </div>
                              </template>
                              <span id="text--attachment-preview-tooltip-email-template">{{
                                att.fileName
                              }}</span>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="summary-content summary-content__collapsable"
                      v-if="showTemplate1"
                      style="border: none;"
                    >
                      <div class="summary-template">
                        <KEmailPreview
                          v-if="!!summaryData.emailTemplate.template"
                          :key="summaryData.emailTemplate.template"
                          :html="summaryData.emailTemplate.template"
                          is-extra-height
                        />
                      </div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <div class="summary">
                    <div class="summary-header">
                      <div style="color: #2196f3;">
                        <v-icon :color="'#2196f3'" class="ml-2" left medium>
                          {{ 'mdi-application' }}
                        </v-icon>
                        Landing Page for users who clicked the phishing link
                      </div>
                      <div>
                        <v-btn
                          class="campaign-manager-summary-card__button"
                          rounded
                          outlined
                          color="#2196f3"
                          @click="showTemplate2 = !showTemplate2"
                          >Details
                          <v-icon :color="'#2196f3'" class="ml-2" left medium>
                            {{ showTemplate2 ? 'mdi-menu-up' : 'mdi-menu-down' }}
                          </v-icon></v-btn
                        >
                      </div>
                    </div>
                    <div class="summary-content">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex flex-column" v-if="!!summaryData">
                          <div class="template-summary__title">
                            {{ summaryData.landingPageTemplate.name }}
                          </div>
                          <div class="template-summary__sub-title mt-2">
                            <b>URL:</b> {{ summaryData.landingPageTemplate.urlTemplate }}
                          </div>
                        </div>
                        <div class="d-flex" v-if="!!summaryData">
                          <v-chip
                            class="template-list--item template-list--item__chip p mr-2"
                            style="color: white;"
                            :color="
                              scenarioDetailsLookup.difficultyTypes.find(
                                (item) =>
                                  item.value ===
                                  summaryData.landingPageTemplate.difficultyTypeId.toString()
                              ).text === 'Easy'
                                ? '#217124'
                                : scenarioDetailsLookup.difficultyTypes.find(
                                    (item) =>
                                      item.value ===
                                      summaryData.landingPageTemplate.difficultyTypeId.toString()
                                  ).text === 'Medium'
                                ? '#2196F3'
                                : '#F56C6C'
                            "
                            v-if="!!summaryData"
                          >
                            {{
                              scenarioDetailsLookup.difficultyTypes.find(
                                (item) =>
                                  item.value ===
                                  summaryData.landingPageTemplate.difficultyTypeId.toString()
                              ).text
                            }}
                          </v-chip>
                          <v-chip
                            class="template-list--item template-list--item__chip p"
                            v-if="!!summaryData"
                          >
                            {{
                              scenarioDetailsLookup.methodTypes.find(
                                (item) =>
                                  item.value ===
                                  summaryData.landingPageTemplate.methodTypeId.toString()
                              ).text
                            }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                    <div
                      class="summary-content summary-content__collapsable"
                      v-if="showTemplate2"
                      style="border: none;"
                    >
                      <div class="summary-template">
                        <KEmailPreview
                          v-if="!!summaryData.landingPageTemplate.landingPages[0].content"
                          :key="summaryData.landingPageTemplate.landingPages[0].content"
                          :html="summaryData.landingPageTemplate.landingPages[0].content"
                          is-extra-height
                        />
                      </div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template v-slot:overlay-footer>
      <v-btn
        @click="changeNewScenarioModalStatus"
        class="new-phishing-scenario__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="new-phishing-scenario__right-col">
        <v-btn
          @click="backStep(-1)"
          class="new-phishing-scenario__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>
        <v-btn
          @click="nextStep(+1)"
          class="new-phishing-scenario__footer-btn-next"
          color="#2196f3"
          rounded
          :disabled="isSubmitDisabled"
          v-if="step < 4"
        >
          {{ labels.Next }}
        </v-btn>
        <v-btn
          @click="submit"
          class="new-phishing-scenario__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step === 4"
          :disabled="isSubmitDisabled"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import { createScenario, getScenario, getSummaryOfScenario, updateScenario } from '@/api/scenarios'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview'
import LandingPageListPreview from '@/components/workshop/LandingPageTemplateListPreview'
import { scrollToComponent } from '@/utils/functions'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'NewScenarios',
  components: {
    KEmailPreview,
    KSelect,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplateListPreview,
    LandingPageListPreview
  },
  data() {
    return {
      summaryData: {},
      showTemplate1: false,
      showTemplate2: false,
      methods: [
        { text: 'Click Only', value: 'WNZt0sCVCWB3' },
        { text: 'Data Submission', value: 'DYC0gugxJMjT' },
        { text: 'Attachment', value: '7dLrW2kdBTDs' }
      ],
      difficulties: [
        { text: 'Easy', value: 'mT0CeYGgKsVb' },
        { text: 'Medium', value: 'Z5XeVlpw6Dps' },
        { text: 'Hard', value: 'c4LCGEB9MayB' }
      ],
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      nonEditableAvailableForRequests: [],
      availableForRequests: [],
      tagSearch: '',
      generalDifficultyTypeId: '',
      labels,
      step: 1,
      Validations: Validations,
      formValues: {
        name: '',
        description: '',
        methodTypeId: '1',
        difficultyTypeId: '1',
        emailTemplateId: null,
        landingPageTemplateId: null,
        availableForRequests: [],
        tags: []
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      editItemsDisabled: false,
      methodItems: [],
      difficultyItems: [],
      emailTemplateResourceId: null,
      landingPageTemplateResourceId: null
    }
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
    scenarioId: {
      type: String
    },
    scenarioDetailsLookup: {
      required: true
    }
  },
  methods: {
    selectedEmailTemplateResourceId(id) {
      this.emailTemplateResourceId = id
    },
    selectedLandingPageTemplateResourceId(id) {
      this.landingPageTemplateResourceId = id
    },
    selectedEmailTemplateChange(id) {
      this.formValues.emailTemplateId = id
    },
    selectedLandingPageChange(id) {
      this.formValues.landingPageTemplateId = id
    },
    setAttachmentFile(file) {
      this.formValues.attachmentFiles = file
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    handleTagItemChange(value) {
      if (value.length < this.formValues.tags.length) {
        this.formValues.tags = value
      } else {
        const tagSearch = this.tagSearch.trim()
        if (!tagSearch && value[value.length - 1].trim() === '') {
          value.splice(0, value[value.length - 1])
          return
        }
        value.splice(value.length - 1, 1)
        if (tagSearch.includes(',')) {
          const tags = tagSearch.split(',')
          tags.forEach((tag) => {
            if (tag.trim() && !value.includes(tag)) {
              this.formValues.tags.push(tag.trim().substring(0, 20))
            }
          })
        } else {
          if (!value.includes(tagSearch)) {
            this.formValues.tags.push(tagSearch.trim().substring(0, 20))
          }
        }
        this.$refs.refTags.$refs.refComponent.initialValue = this.formValues.tags
        this.$refs.refTags.$refs.refComponent.lazyValue = this.formValues.tags
      }
    },
    changeNewScenarioModalStatus() {
      this.$emit('changeNewScenarioModalStatus', false)
    },
    nextStep() {
      const prevStep = JSON.parse(JSON.stringify(this.step))
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
        isValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (prevStep === 1) {
        if (this.$refs.refFormStep1.validate() && isValid) {
          this.step += 1
        } else {
          const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
          scrollToComponent(el)
        }
      }
      if (prevStep === 2) {
        if (!!this.formValues.emailTemplateId || !!this.emailTemplateResourceId) {
          this.step += 1
        }
      }
      if (prevStep === 3) {
        if (!!this.formValues.landingPageTemplateId || !!this.landingPageTemplateResourceId) {
          this.isSubmitDisabled = true
          getSummaryOfScenario(this.emailTemplateResourceId, this.landingPageTemplateResourceId)
            .then((response) => {
              this.summaryData = response.data.data
              this.generalDifficultyTypeId = response.data.data.difficultyTypeId.toString()
              this.step += 1
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      }
    },
    backStep() {
      this.step -= 1
    },
    submit() {
      this.isSubmitDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      if (this.isEdit && !this.isDuplicate) {
        updateScenario(this.formValues, this.scenarioId)
          .then((response) => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        createScenario(this.formValues)
          .then((response) => {
            this.$emit('changeNewScenarioModalStatus', false, true)
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      }
    }
  },

  computed: {
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    },
    getDifficultyType() {
      return (
        this.scenarioDetailsLookup['difficultyTypes'].find(
          (item) => item.value === this.generalDifficultyTypeId
        )?.text || ''
      )
    }
  },
  created() {
    let _this = this
    if (this.isEdit) {
      this.isSubmitDisabled = true
      getScenario(this.scenarioId)
        .then((response) => {
          _this.formValues = response.data.data
          _this.formValues.name = `${this.formValues.name}`
          _this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
          _this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
          this.formValues.emailTemplateId = response.data.data.emailTemplateResourceId
          this.formValues.landingPageTemplateId = response.data.data.landingPageTemplateResourceId
          this.emailTemplateResourceId = response.data.data.emailTemplateResourceId
          this.landingPageTemplateResourceId = response.data.data.landingPageTemplateResourceId
          if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
          if (this.$refs.refMakeAvailableFor) {
            this.formValues.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
              response.data.data.availableForList
            )
          } else {
            this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
              response.data.data.availableForList
            )
          }
        })
        .finally(() => {
          this.isSubmitDisabled = false
        })
    }
  }
}
</script>

<style lang="scss">
.summary-step {
  .summary-template {
    border-top: 1px solid #b3d4fc;
  }
  .template-summary {
    &__title {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      color: #383b41;
    }
    &__subtitle {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #383b41;
    }
  }
  .summary {
    max-width: calc(100% - 96px);
    display: flex;
    flex-flow: column;
    margin-top: 32px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 12px;

    &-header {
      justify-content: space-between;
      display: flex;
      padding: 24px 24px 16px 24px;
      align-items: center;
      div {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: #2196f3 !important;
      }
    }
    &-content {
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
      border-radius: 0px 0px 12px 12px;
      padding: 24px;
      &__title {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 19px;
        color: #383b41;
        width: 55px;
        min-width: 55px;
        max-width: 55px;
        margin-right: 30px;
        display: inline-block;
      }
      &__body {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 19px;
        color: #383b41;
      }
      &-details {
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
      }
    }
  }
}
.phishing-scenario {
  .phishing-scenario__container {
    padding: 24px !important;
  }
}
#input--action-tags-new-scenario.hide-caret {
  .v-input__append-inner {
    display: none !important;
  }
}
.new-phishing-scenario__footer-btn-cancel {
  color: #ff5252 !important;
  border: 1px solid #ff5252 !important;
  box-shadow: none !important;
  caret-color: #ff5252 !important;
  font-weight: 600 !important;
}
.new-phishing-scenario__footer-btn-back {
  color: #00bcd4 !important;
  border: 1px solid #00bcd4 !important;
  caret-color: #00bcd4 !important;
  box-shadow: none !important;
  font-weight: 600 !important;
}
.new-phishing-scenario__footer-btn-next {
  background-color: rgb(33, 150, 243) !important;
  border-color: rgb(33, 150, 243) !important;
  caret-color: #00bcd4 !important;
  font-weight: 600 !important;

  color: white !important;
}
.new-phishing-scenario {
  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
    }
  }
  &__title {
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 31px;
    color: #383b41;
  }
  &__sub-title {
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px !important;
    color: #383b41 !important;
  }
}
</style>
