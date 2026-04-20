<template>
  <AppModal v-if="status" icon-name="mdi-file" :status="status" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Template Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Page Settings</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="email-template-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Landing Page Template Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this landing page template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Template Name" has-hint class-name="mt-8">
                  <v-text-field
                    v-bind="commonRules"
                    v-model.trim="formValues.name"
                    id="input--new-email-templates-template-name"
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
                    v-model.trim="formValues.description"
                    id="input--new-email-templates-description"
                    outlined
                    dense
                    no-resize
                    persistent-hint
                    rows="2"
                    placeholder="Description"
                    height="100"
                    :rules="[
                      (v) =>
                        Validations.maxLength(
                          v,
                          300,
                          labels.getMaxLengthMessage(labels.Description, 300)
                        )
                    ]"
                  ></v-textarea>
                </form-group>
                <InputPhishingMethod
                  v-model.trim="formValues.methodTypeId"
                  subtitle="Select the quishing technique for this template"
                  item-text-key="text"
                  item-value-key="value"
                  :max-length="256"
                  :items="landingPageData.methodTypes"
                />
                <form-group title="Tags" sub-title="Define tags for the template">
                  <InputTag
                    v-model="formValues.tags"
                    ref="refTags"
                    :id="`input--action-tags`"
                    :items="[]"
                    class="hide-caret"
                  />
                </form-group>
                <form-group
                  title="Difficulty"
                  sub-title="Select a detection difficulty level for this quishing email"
                  class-name="mb-8"
                >
                  <v-radio-group
                    v-model="formValues.difficultyTypeId"
                    class="send-welcome-email__radio-group mt-4"
                    hide-details
                    row
                    persistent-hint
                  >
                    <v-radio
                      v-for="item in landingPageData.difficultyTypes"
                      :key="item.text"
                      :value="item.value"
                      :label="item.text"
                      color="#2196f3"
                    ></v-radio>
                  </v-radio-group>
                </form-group>
                <make-available-for
                  v-model="availableForRequests"
                  ref="refMakeAvailableFor"
                  open-direction="above"
                  sub-title="Select companies that should see this landing page template in their libraries"
                  placeholder="Select companies or company groups"
                  :disabled="!showMakeAvailableFor"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Page Settings</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this email template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="mt-4">
                <v-list-item-content>
                  <v-form ref="refEmailTemplateContent" style="padding-right: 68px;">
                    <InputPhishingLink
                      ref="refInputPhishingLink"
                      v-model="formValues.phishingLink"
                      title="QR code link"
                      subtitle="Create a QR code link for users to click and be directed to the landing page"
                      :url-schema-types="getUrlSchemaTypes"
                      :domain-records="getDomainRecordTypes"
                      :extension-types="getExtensionTypes"
                      :parameter-types="getParameterTypes"
                      :path-types="getPathTypes"
                      :is-edit="isEdit"
                      @invisible-captcha="isInvisibleCaptchaDisabled = $event"
                      @captcha-default-value="formValues.isInvisibleCaptchaEnabled = $event"
                    />
                    <VCheckbox
                      v-model="formValues.isInvisibleCaptchaEnabled"
                      color="#2196f3"
                      hide-details
                      :class="[
                        'mb-10',
                        isInvisibleCaptchaDisabled ? 'invisible-captcha-checkbox' : ''
                      ]"
                      :ripple="false"
                      :readonly="isInvisibleCaptchaDisabled"
                      :style="
                        isInvisibleCaptchaDisabled
                          ? { opacity: 0.38, cursor: 'default !important' }
                          : ''
                      "
                    >
                      <template #label>
                        Stop bots to prevent false clicks.
                        <VTooltip bottom max-width="260" z-index="9999999">
                          <template #activator="{ on }">
                            <v-icon v-on="on" class="ml-2" color="#757575">mdi-information</v-icon>
                          </template>
                          <span
                            >Once enabled, bot activity is automatically detected and stopped to
                            prevent false clicks, ensuring genuine traffic to the landing
                            page.</span
                          >
                        </VTooltip>
                      </template>
                    </VCheckbox>
                    <div
                      v-show="!isGenerateWithAIDisabled"
                      :class="{
                        'd-flex align-center justify-space-between':
                          !isGenerateWithAIDisabled
                      }"
                    >
                      <div class="d-flex align-center">
                        <InputLanguagePreview
                          :value="activeLanguage"
                          ref="refInputLanguagePreview"
                          style="max-width: 240px;"
                          hide-details
                          label="View/Edit Template"
                          :items="selectedLanguages"
                          :disabled="selectedLanguages.length === 0"
                          @input="handleActiveLanguageChange"
                        />
                      </div>
                      <InputLanguagesSettings
                        v-model="selectedLanguages"
                        :active-language="activeLanguage"
                        :can-remove-languages="formValues.canRemoveLanguages"
                        :initial-disabled-language-ids="initialDisabledLanguageIds"
                        :language-items="languageItems"
                        :translated-language-resource-ids="translatedLanguageResourceIds"
                        :language-options="languageOptions"
                        :is-notification-template="true"
                        :is-landing-page="true"
                        :is-show-localize-button="true"
                        :is-generate-with-a-i-disabled="isGenerateWithAIDisabled"
                        @input="handleSelectedLanguagesChange"
                        @on-active-language-change="handleActiveLanguageChange"
                        @on-generate-with-ai="handleGenerateWithAI"
                        @on-relocalize-replace="handleRelocalizeReplace"
                        @on-language-removed="handleLanguageRemoved"
                      />
                    </div>
                    <FormGroup title="Landing Page Template" class-name="mt-4"></FormGroup>
                    <el-tabs
                      v-model="tab"
                      class="landing-page-tab-content"
                      id="landing-page-tab-content-quishing"
                    >
                      <el-tab-pane
                        v-for="(page, index) in formValues.landingPages"
                        :key="`page-${index + 1}`"
                        :label="`Page ${index + 1}`"
                        :name="`page${index + 1}`"
                        :id="`landingPage-content-${index + 1}`"
                      >
                        <template #label>
                          <div
                            style="display: flex;"
                            :style="
                              formValues.landingPages.length > 1 && {
                                width: '68px'
                              }
                            "
                          >
                            <span class="landing-page-tab__label">
                              {{ `Page ${index + 1}` }}
                            </span>
                            <v-menu
                              v-if="formValues.landingPages.length > 1"
                              :min-width="128"
                              :offset-y="true"
                              nudge-left="50"
                              bottom
                            >
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  v-ripple="false"
                                  v-on="on"
                                  class="landing-page-tab-content__button"
                                  >mdi-dots-horizontal</v-icon
                                >
                              </template>
                              <v-list>
                                <v-list-item
                                  style="cursor: pointer;"
                                  @click="handleDeleteLandingPage(index)"
                                >
                                  <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </template>
                        <email-template
                          ref="refEmailTemplate"
                          template-type="landing"
                          :active-block-manager-components="activeBlockManagerComponents"
                          :edit-items-disabled="editItemsDisabled"
                          :template.sync="page.content"
                          :is-edit="!!isEdit"
                          :onlyGrapes="true"
                          :show-edit-button="true"
                          @setAttachmentFile="setAttachmentFile"
                        />
                      </el-tab-pane>
                      <el-tab-pane v-if="formValues.landingPages.length <= 1" name="addPage">
                        <template #label>
                          <div style="display: flex;">
                            <span
                              class="landing-page-tab__label"
                              style="cursor: pointer; margin-right: 4px; display: block;"
                              @click.stop="isSelectClickOnlyPageOpen = true"
                            >
                              <v-icon class="mr-1" size="18" color="#2196f3">mdi-plus-circle-outline</v-icon>
                              Add Template
                            </span>
                            <v-menu
                              :min-width="128"
                              :offset-y="true"
                              bottom
                              id="add-page-menu"
                              :z-index="10000"
                            >
                              <template #activator="{ on: menu }">
                                <v-icon
                                  v-on="menu"
                                  @click.stop
                                  color="#757575"
                                  size="20"
                                  class="landing-page-tab__dots"
                                >mdi-dots-vertical</v-icon>
                              </template>
                              <v-list>
                                <v-list-item
                                  class="px-4"
                                  style="cursor: pointer;"
                                  @click="handleAddBlankPage"
                                >
                                  <v-list-item-title>Blank page</v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  class="px-4"
                                  style="cursor: pointer;"
                                  @click="handleUploadHTML"
                                >
                                  <v-list-item-title>Upload HTML</v-list-item-title>
                                </v-list-item>
                                <input
                                  v-show="false"
                                  ref="refHtmlFile"
                                  type="file"
                                  @change="handleHTMLUploadChange"
                                />
                              </v-list>
                            </v-menu>
                          </div>
                        </template>
                      </el-tab-pane>
                    </el-tabs>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <SelectClickOnlyPageModal
        :status="isSelectClickOnlyPageOpen"
        :method="clickOnlyMethodText"
        :scenario-details-lookup="{ difficultyTypes: landingPageData && landingPageData.difficultyTypes || [], methodTypes: landingPageData && landingPageData.methodTypes || [] }"
        :languages="languageOptions"
        :api-funcs="quishingApiFuncs"
        type="Quishing"
        @close="isSelectClickOnlyPageOpen = false"
        @add="handleClickOnlyPageAdded"
      />
      <EditLanguagesLeavingDialog
        v-if="showEditLanguagesLeavingDialog"
        :status="showEditLanguagesLeavingDialog"
        @on-close="handleCloseEditLanguagesLeavingDialog"
        @on-discard="handleDiscardEditLanguagesLeavingDialog"
        @on-confirm="handleConfirmEditLanguagesLeavingDialog"
      />
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
        @on-submit="submit"
      />
    </template>
  </AppModal>
</template>

<script>
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import AppModal from '../AppModal'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { mapGetters } from 'vuex'
import StepperFooter from '@/components/Stepper/StepperFooter'
import InputTag from '@/components/Common/Inputs/InputTag'
import { MERGED_TEXTS_MAP } from '@/components/LandingPage/utils'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import EditLanguagesLeavingDialog from '@/components/PhishingScenarios/EditLanguagesLeavingDialog.vue'
import QuishingService, {
  generateQuishingLandingPageTranslation,
  getQuishingLandingPageTranslation
} from '@/api/quishing'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'
import '@/styles/landing-page-tabs.css'

const getLandingPageNameByIndex = (index) =>
  index === 0 ? 'landing-page' : `Page ${index + 1}`

const getLandingPageTabNameByIndex = (index) => `page${index + 1}`

const getLandingPageTabIndex = (tab = '') => {
  const matches = /^page(\d+)$/.exec(tab)

  if (!matches) {
    return 0
  }

  return Math.max(Number(matches[1]) - 1, 0)
}

const getValidLandingPageTab = (landingPages = [], preferredIndex = 0) => {
  if (!landingPages.length) {
    return 'page1'
  }

  const safeIndex = Math.min(Math.max(preferredIndex, 0), landingPages.length - 1)

  return getLandingPageTabNameByIndex(safeIndex)
}

const AUTO_GENERATED_PAGE_NAME_REGEX = /^Page\s+\d+$/i

const isAutoGeneratedLandingPageName = (name = '') =>
  name === 'landing-page' || AUTO_GENERATED_PAGE_NAME_REGEX.test(name)

const normalizeLandingPages = (landingPages = []) => {
  const usedPageNames = new Set()

  return landingPages.map((page, index) => {
    let normalizedName = typeof page?.name === 'string' ? page.name.trim() : ''

    if (!normalizedName) {
      normalizedName = getLandingPageNameByIndex(index)
    } else if (usedPageNames.has(normalizedName)) {
      normalizedName = getLandingPageNameByIndex(index)
    } else if (isAutoGeneratedLandingPageName(normalizedName)) {
      normalizedName = getLandingPageNameByIndex(index)
    }

    usedPageNames.add(normalizedName)

    return {
      ...page,
      name: normalizedName,
      order: index + 1
    }
  })
}

const syncLandingPagesMetadata = (landingPages = []) => {
  const normalizedLandingPages = normalizeLandingPages(landingPages)
  landingPages.splice(0, landingPages.length, ...normalizedLandingPages)
  return landingPages
}

export default {
  name: 'QuishingNewLandingPageModal',
  components: {
    InputPhishingMethod,
    InputPhishingLink,
    StepperFooter,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputTag,
    InputLanguagesSettings,
    InputLanguagePreview,
    EditLanguagesLeavingDialog,
    SelectClickOnlyPageModal
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
    emailTemplateId: {
      type: String
    },
    landingPageData: {
      type: Object
    },
    scenarioDetailsLookup: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-quishing-edit-landing-page-templates-modal',
        backButton: 'btn-back--add-or-quishing-edit-landing-page-templates-modal',
        nextButton: 'btn-next--add-or-quishing-edit-landing-page-templates-modal',
        saveButton: 'btn-save--add-or-quishing-edit-landing-page-templates-modal'
      },
      languageOptions: [],
      languageItems: [],
      selectedLanguages: [],
      activeLanguage: '',
      languagesPayload: [],
      initialDisabledLanguageIds: [],
      selectedLanguagePayloadItemBeforeSave: null,
      beforeSaveLanguage: null,
      showEditLanguagesLeavingDialog: false,
      isInvisibleCaptchaDisabled: false,
      isSelectClickOnlyPageOpen: false,
      quishingApiFuncs: {
        list: QuishingService.getLandingPageList,
        content: QuishingService.getLandingPageTemplatePreviewContent
      },
      tab: 'page1',
      isSubmitDisabled: false,
      isGenerateWithAi: false,
      isGenerateWithAIDisabled: false,
      isEverythingLocalized: false,
      isDefault: false,
      translationTempKey: null,
      timeoutId: null,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      labels,
      step: 1,
      Validations,
      availableForRequests: [],
      initialFormValues: {},
      formValues: {
        canRemoveLanguages: true,
        isInvisibleCaptchaEnabled: false,
        phishingLink: {
          urlSchemaTypeId: '',
          subDomain: '',
          domainRecordId: '',
          pathTypeId: '',
          extensionTypeId: '',
          parameterTypeId: ''
        },
        name: null,
        description: null,
        methodTypeId: null,
        difficultyTypeId: null,
        tags: [],
        landingPages: [{ name: 'landing-page', content: '', order: 1 }],
        languageTypeResourceId: '862249c19aad'
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 200, labels.getMaxLengthMessage(labels.TemplateName, 200))
        ]
      },
      editItemsDisabled: false
    }
  },
  watch: {
    scenarioDetailsLookup: {
      immediate: true,
      handler(val) {
        if (!val || this.isDefault) return
        this.setLanguageItems()
      }
    },
    selectedLanguages(newVal) {
      if (!newVal.length) {
        this.activeLanguage = ''
      } else if (this.activeLanguage) {
        const isInSelected = newVal.find((item) => item.value === this.activeLanguage)
        if (!isInSelected) {
          this.activeLanguage = newVal[0].value
          const existingLanguage = this.languagesPayload.find(
            (item) => item.languageTypeResourceId === this.activeLanguage
          )
          if (!existingLanguage) {
            this.languagesPayload.push({
              languageTypeResourceId: this.activeLanguage,
              landingPages: structuredClone(this.formValues.landingPages),
              isTranslated: false
            })
          }
        }
      } else if (newVal.length > 0) {
        this.activeLanguage = newVal[0].value
      }
    }
  },
  created() {
    if (this.isDuplicate) {
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--landing-page-templates-modal',
        backButton: 'btn-duplicate-back--landing-page-templates-modal',
        nextButton: 'btn-duplicate-next--landing-page-templates-modal',
        saveButton: 'btn-duplicate-save--landing-page-templates-modal'
      }
    }
    if (!this.isEdit)
      this.formValues.methodTypeId = this.landingPageData.methodTypes[0]?.value || ''
    this.formValues.difficultyTypeId = '1'
    this.callForMergedTags()
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = structuredClone(this.formValues)
    }
    if (this.isEdit) {
      QuishingService.getLandingPageTemplate(this.emailTemplateId).then((response) => {
        const { data: { data = {} } = {} } = response || {}
        const phishingLink = {
          subDomain: data.subDomain,
          urlSchemaTypeId: data.urlSchemaTypeId.toString(),
          pathTypeId: data.pathTypeId.toString(),
          extensionTypeId: data.extensionTypeId.toString(),
          parameterTypeId: data.parameterTypeId.toString(),
          domainRecordId: data.domainRecordId.toString()
        }
        delete data.urlSchemaTypeId
        delete data.pathTypeId
        delete data.extensionTypeId
        delete data.parameterTypeId
        delete data.domainRecordId
        delete data.subDomain
        data.landingPages = normalizeLandingPages(data.landingPages || [])
        this.formValues = data
        this.$set(this.formValues, 'phishingLink', phishingLink)
        this?.$refs?.refInputPhishingLink?.checkSchemaTypes(phishingLink.domainRecordId, true)
        this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
        this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
        this.formValues.name = `${this.formValues.name}`
        const findedDomain = this.landingPageData?.domainRecords?.find(
          (domain) => domain.value === phishingLink?.domainRecordId?.toString()
        )
        this.isInvisibleCaptchaDisabled = findedDomain ? !findedDomain?.extraDatas[1]?.value : false
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        if (typeof this.populateLanguagesFromExistingTemplate === 'function') {
          this.populateLanguagesFromExistingTemplate(data)
        }
        this.initialFormValues = structuredClone(this.formValues)
      })
    }
    if (!(this.isEdit || this.isDuplicate)) {
      const preferredLanguageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
      this.formValues.languageTypeResourceId = preferredLanguageTypeResourceId
    }
  },
  computed: {
    ...mapGetters({
      emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl',
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    translatedLanguageResourceIds() {
      return (this.languagesPayload || [])
        .filter((item) => item.isTranslated)
        .map((item) => item.languageTypeResourceId)
    },
    getSelectedLanguagePayload() {
      const selected =
        this.languagesPayload.find(
          (item) => item.languageTypeResourceId === this.activeLanguage
        ) || {}
      return selected
    },
    clickOnlyMethodText() {
      if (this.formValues.methodTypeId === '1') {
        return this.landingPageData?.methodTypes?.find((item) => item.value === '1')?.text || 'Click Only'
      }
      return ''
    },
    getUrlSchemaTypes() {
      return this.landingPageData?.urlSchemaTypes || []
    },
    getDomainRecordTypes() {
      return this.landingPageData?.domainRecords || []
    },
    getExtensionTypes() {
      return this.landingPageData?.extensionTypes || []
    },
    getParameterTypes() {
      return this.landingPageData?.parameterTypes || []
    },
    getPathTypes() {
      return this.landingPageData?.pathTypes || []
    },
    getTitle() {
      if (!this.isEdit) return 'New Landing Page Template'
      return this.isDuplicate ? 'Duplicate Landing Page Template' : 'Edit Landing Page Template'
    },
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    },
    isRenderMakeAvailableFor() {
      if (this.editItemsDisabled) {
        return false
      }
      if (this.$store.state.auth.userRoleName === 'CompanyAdmin') {
        return !!this.selectedItem
      }
      return true
    }
  },
  methods: {
    populateLanguagesFromExistingTemplate(data) {
      const mainLanguageId = data.languageTypeResourceId
      if (!mainLanguageId) return
      const languagesPayload = [
        {
          languageTypeResourceId: mainLanguageId,
          landingPages: structuredClone(data.landingPages || []),
          isTranslated: true
        }
      ]
      const seenLanguageIds = new Set([mainLanguageId])
      ;(data.landingPages || []).forEach((page) => {
        ;(page.languages || []).forEach((langPage) => {
          if (!langPage?.languageTypeResourceId) return
          let entry = languagesPayload.find(
            (item) => item.languageTypeResourceId === langPage.languageTypeResourceId
          )
          if (!entry) {
            entry = {
              languageTypeResourceId: langPage.languageTypeResourceId,
              landingPages: [],
              isTranslated: true,
              resourceId: langPage.resourceId
            }
            languagesPayload.push(entry)
            seenLanguageIds.add(langPage.languageTypeResourceId)
          }
          entry.landingPages.push({
            name: langPage.name,
            content: langPage.content,
            order: langPage.order || page.order || entry.landingPages.length + 1,
            prompt: langPage.prompt || ''
          })
        })
      })
      this.languagesPayload = languagesPayload
      this.selectedLanguages = languagesPayload.map((item) => ({
        value: item.languageTypeResourceId,
        text: this.getLanguageNameById(item.languageTypeResourceId)
      }))
      this.activeLanguage = mainLanguageId
      this.initialDisabledLanguageIds = languagesPayload.map((item) => item.languageTypeResourceId)
    },
    getLanguageNameById(languageId) {
      const found = this.languageOptions.find((opt) => opt.value === languageId)
      return found?.text || ''
    },
    setLanguageItems() {
      const languageTypes =
        this.scenarioDetailsLookup?.languageTypes ||
        this.landingPageData?.languageTypes ||
        this.languageOptions ||
        []
      const preferredLanguageTypes =
        this.scenarioDetailsLookup?.preferredLanguageTypes ||
        this.landingPageData?.preferredLanguageTypes ||
        []
      const companyLanguageTypeResourceId =
        this.scenarioDetailsLookup?.companyLanguageTypeResourceId ||
        this.landingPageData?.companyLanguageTypeResourceId ||
        this.getCurrentCompany?.preferredLanguageTypeResourceId ||
        ''

      const languageItems = []
      languageItems.push(
        {
          value: 1,
          text: 'Preferred Languages',
          children: preferredLanguageTypes
        },
        {
          value: 5,
          text: 'All Languages',
          children: languageTypes.filter(
            (item) =>
              !preferredLanguageTypes?.find((pItem) => pItem.value === item.value)
          )
        }
      )
      this.languageItems = languageItems

      if (this.isEdit) return
      const findedLanguage =
        languageTypes?.find(
          (item) => item.value === companyLanguageTypeResourceId
        ) ||
        this.languageOptions?.find(
          (item) => item.value === companyLanguageTypeResourceId
        )
      if (!findedLanguage) return
      if (this.selectedLanguages.find((item) => item.value === companyLanguageTypeResourceId)) return
      this.selectedLanguages.push({
        text: findedLanguage.text,
        value: companyLanguageTypeResourceId
      })
      this.activeLanguage = companyLanguageTypeResourceId
      this.formValues.languageTypeResourceId = companyLanguageTypeResourceId
      this.$nextTick(() => {
        this.handleSelectedLanguagesChange(this.selectedLanguages)
        const isEnglish = (findedLanguage.text || '').toLowerCase().includes('english')
        if (isEnglish) {
          const companyLanguagePayload = this.languagesPayload.find(
            (item) => item.languageTypeResourceId === companyLanguageTypeResourceId
          )
          if (companyLanguagePayload) {
            companyLanguagePayload.isTranslated = true
          }
        }
        this.selectedLanguagePayloadItemBeforeSave = structuredClone(this.getSelectedLanguagePayload)
      })
    },
    handleActiveLanguageChange(languageId) {
      const isChanged = isDifferent(
        this.getSelectedLanguagePayload,
        this.selectedLanguagePayloadItemBeforeSave
      )
      if (isChanged && this.activeLanguage && this.activeLanguage !== languageId) {
        this.beforeSaveLanguage = languageId
        this.showEditLanguagesLeavingDialog = true
        return
      }
      this.applyActiveLanguageChange(languageId)
    },
    applyActiveLanguageChange(languageId) {
      const newLangPayload = this.languagesPayload.find(
        (item) => item.languageTypeResourceId === languageId
      )
      if (newLangPayload?.landingPages) {
        this.formValues.landingPages = structuredClone(newLangPayload.landingPages)
      }
      this.tab = 'page1'
      this.activeLanguage = languageId
      this.selectedLanguagePayloadItemBeforeSave = structuredClone(this.getSelectedLanguagePayload)
    },
    handleSelectedLanguagesChange(languages) {
      this.languagesPayload = languages.map((language) => {
        const item = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === language.value
        )
        if (item) return item
        return {
          languageTypeResourceId: language.value,
          landingPages: structuredClone(this.formValues.landingPages),
          isTranslated: false
        }
      })
      this.selectedLanguages = languages
      this.selectedLanguagePayloadItemBeforeSave = structuredClone(this.getSelectedLanguagePayload)
    },
    handleLanguageRemoved({ languageName }) {
      this.$store.dispatch('common/createSnackBar', {
        message: `The ${languageName} language has been removed.`,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
    },
    handleCloseEditLanguagesLeavingDialog() {
      this.showEditLanguagesLeavingDialog = false
      this.beforeSaveLanguage = null
    },
    handleDiscardEditLanguagesLeavingDialog() {
      this.showEditLanguagesLeavingDialog = false
      const langId = this.beforeSaveLanguage
      this.beforeSaveLanguage = null
      if (langId) this.applyActiveLanguageChange(langId)
    },
    handleConfirmEditLanguagesLeavingDialog() {
      const idx = this.languagesPayload.findIndex(
        (item) => item.languageTypeResourceId === this.activeLanguage
      )
      if (idx !== -1) {
        this.$set(
          this.languagesPayload,
          idx,
          {
            ...this.languagesPayload[idx],
            landingPages: structuredClone(this.formValues.landingPages)
          }
        )
      }
      this.showEditLanguagesLeavingDialog = false
      const langId = this.beforeSaveLanguage
      this.beforeSaveLanguage = null
      if (langId) this.applyActiveLanguageChange(langId)
    },
    handleRelocalizeReplace({ language }) {
      const selectedLanguagePayload = this.getSelectedLanguagePayload
      const landingPages = selectedLanguagePayload.landingPages || []
      const payload = {
        landingPages: landingPages.map((page) => ({
          name: page.name || '',
          content: page.content || '',
          order: page.order || 0
        })),
        targetLanguages: [{ languageResourceId: language.value }]
      }
      this.startTranslationFlow(payload)
    },
    handleGenerateWithAI() {
      const selectedLanguagePayload = this.getSelectedLanguagePayload
      const landingPages = selectedLanguagePayload.landingPages || []
      const languagesToLocalize = this.selectedLanguages.filter((lang) => {
        const payload = this.languagesPayload.find(
          (p) => p.languageTypeResourceId === lang.value
        )
        return !(payload && payload.isTranslated)
      })
      const payload = {
        landingPages: landingPages.map((page) => ({
          name: page.name || '',
          content: page.content || '',
          order: page.order || 0
        })),
        targetLanguages: languagesToLocalize.map((item) => ({
          languageResourceId: item.value
        }))
      }
      this.startTranslationFlow(payload)
    },
    startTranslationFlow(payload) {
      this.isGenerateWithAi = true
      this.isGenerateWithAIDisabled = true
      this.isSubmitDisabled = true
      generateQuishingLandingPageTranslation(payload)
        .then((response) => {
          if (!response?.data?.data || response?.data?.status !== 'SUCCESS') {
            this.resetGenerateWithAIDisabled()
            return
          }
          this.translationTempKey = response.data.data
          this.isEverythingLocalized = false
          this.askForLandingPageTranslation()
        })
        .catch(() => {
          this.resetGenerateWithAIDisabled()
        })
    },
    askForLandingPageTranslation(count = 0, maxCount = null, timeoutId = 0) {
      if (this.isEverythingLocalized || !this.translationTempKey) return
      const languagesLength = Array.isArray(this.selectedLanguages)
        ? this.selectedLanguages.length
        : 0
      const calculatedMax = Math.max((languagesLength || 1) * 20, 20)
      const effectiveMax =
        typeof maxCount === 'number' && maxCount > 0 ? maxCount : calculatedMax
      if (count >= effectiveMax) {
        this.resetGenerateWithAIDisabled(timeoutId)
        return
      }
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        getQuishingLandingPageTranslation(this.translationTempKey)
          .then((response) => {
            const { data } = response?.data || {}
            if (!data) {
              this.askForLandingPageTranslation(count + 1, effectiveMax, timeoutId)
              return
            }
            if (data.isCompleted) {
              this.isEverythingLocalized = true
              const errorLanguages = []
              const successLanguages = []
              if (Array.isArray(data.translatedContents)) {
                data.translatedContents.forEach((item) => {
                  if (item.error || !item.success) errorLanguages.push(item)
                  else successLanguages.push(item)
                })
                errorLanguages.forEach((item) => this.showLocalizationErrorMessage(item))
                const processedLanguageIds = new Set()
                successLanguages.forEach((item) => {
                  if (processedLanguageIds.has(item.languageResourceId)) return
                  const languagePayload = this.languagesPayload.find(
                    (language) => language.languageTypeResourceId === item.languageResourceId
                  )
                  if (!languagePayload) return
                  const languageTranslations = successLanguages.filter(
                    (t) => t.languageResourceId === item.languageResourceId
                  )
                  languageTranslations.forEach((translation) => {
                    const pageIndex = languagePayload.landingPages.findIndex(
                      (page) => page.order === translation.order
                    )
                    if (pageIndex !== -1) {
                      this.$set(
                        languagePayload.landingPages[pageIndex],
                        'content',
                        translation.translatedContent || ''
                      )
                      if (translation.sourceName) {
                        this.$set(
                          languagePayload.landingPages[pageIndex],
                          'name',
                          translation.sourceName
                        )
                      }
                    }
                  })
                  languagePayload.isTranslated = true
                  processedLanguageIds.add(item.languageResourceId)
                })
                this.showLocalizationSuccessMessage(data.translatedContents)
                this.resetGenerateWithAIDisabled(timeoutId)
                const lastTranslation = successLanguages[successLanguages.length - 1]
                if (lastTranslation) {
                  this.applyActiveLanguageChange(lastTranslation.languageResourceId)
                }
              }
            } else {
              this.askForLandingPageTranslation(count + 1, effectiveMax, timeoutId)
            }
          })
          .catch(() => {
            this.askForLandingPageTranslation(count + 1, effectiveMax, timeoutId)
          })
      }, 5000)
    },
    showLocalizationErrorMessage(item) {
      const languageName = item.targetLanguage || item.languageResourceId || 'Unknown'
      const errorMessage = item.error || 'Translation failed'
      this.$store.dispatch('common/createSnackBar', {
        message: `${languageName}: ${errorMessage}`,
        color: 'error'
      })
    },
    showLocalizationSuccessMessage(translatedContents) {
      if (!Array.isArray(translatedContents) || this.isDefault) return
      const successItems = translatedContents.filter((item) => item.success && !item.error)
      if (successItems.length === 0) return
      const uniqueLanguageIds = new Set(
        successItems.map((item) => item.languageResourceId).filter(Boolean)
      )
      const successCount = uniqueLanguageIds.size
      if (successCount === 0) return
      let message = ''
      if (successCount === 1) {
        const item = successItems.find((i) => i.success && !i.error)
        const languageName = item?.targetLanguage || 'language'
        message = `The ${languageName} language was successfully localized.`
      } else {
        message = `${successCount} languages were successfully localized.`
      }
      this.$store.dispatch('common/createSnackBar', { message, color: 'success' })
    },
    resetGenerateWithAIDisabled(timeoutId) {
      this.isGenerateWithAi = false
      this.isGenerateWithAIDisabled = false
      this.isSubmitDisabled = false
      this.isDefault = false
      if (timeoutId) clearTimeout(timeoutId)
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
    },
    buildLandingPagesPayload(payload) {
      const selectedLanguagesList = this.selectedLanguages || []
      const languagesPayloadList = this.languagesPayload || []
      let mainLanguageId =
        this.formValues.languageTypeResourceId || this.activeLanguage
      const isMainLanguageInSelected = selectedLanguagesList.find(
        (item) => item.value === mainLanguageId
      )
      if (!isMainLanguageInSelected && selectedLanguagesList.length > 0) {
        mainLanguageId = selectedLanguagesList[0].value
        this.formValues.languageTypeResourceId = mainLanguageId
        payload.languageTypeResourceId = mainLanguageId
        const newMainLanguagePayload = languagesPayloadList.find(
          (p) => p.languageTypeResourceId === mainLanguageId
        )
        if (newMainLanguagePayload && newMainLanguagePayload.landingPages) {
          const normalized = normalizeLandingPages(newMainLanguagePayload.landingPages)
          this.formValues.landingPages = structuredClone(normalized)
          payload.landingPages = structuredClone(normalized)
        }
      }
      const mainLanguagePayload = languagesPayloadList.find(
        (p) => p.languageTypeResourceId === mainLanguageId
      ) || { landingPages: payload.landingPages }
      const otherLanguagesPayload = languagesPayloadList.filter(
        (p) => p.languageTypeResourceId !== mainLanguageId && p.isTranslated
      )
      const mainLandingPages = normalizeLandingPages(
        mainLanguagePayload.landingPages || payload.landingPages || []
      )
      return mainLandingPages.map((mainPage, pageIndex) => {
        const pagePayload = {
          name: mainPage.name || '',
          content: mainPage.content || '',
          order: mainPage.order || 0,
          prompt: mainPage.prompt || ''
        }
        const languages = otherLanguagesPayload
          .map((langPayload) => {
            const normalized = normalizeLandingPages(langPayload.landingPages || [])
            const translatedPage =
              normalized.find((p) => p.order === mainPage.order) || normalized[pageIndex]
            if (!translatedPage) return null
            const languagePayload = {
              languageTypeResourceId: langPayload.languageTypeResourceId,
              name: translatedPage.name || mainPage.name || '',
              content: translatedPage.content || '',
              order: translatedPage.order || mainPage.order || 0,
              prompt: translatedPage.prompt || mainPage.prompt || ''
            }
            if (this.isEdit && !this.isDuplicate && langPayload.resourceId) {
              languagePayload.resourceId = langPayload.resourceId
            }
            return languagePayload
          })
          .filter(Boolean)
        if (languages.length > 0) {
          pagePayload.languages = languages
        }
        return pagePayload
      })
    },
    async handleClickOnlyPageAdded(resourceId, pageIndex = 0) {
      this.isSelectClickOnlyPageOpen = false
      const response = await QuishingService.getLandingPageTemplatePreviewContent(resourceId)
      const landingPages = response?.data?.data?.landingPages || []
      const templateContent =
        landingPages[pageIndex]?.content || landingPages[0]?.content || ''
      syncLandingPagesMetadata(this.formValues.landingPages)
      this.formValues.landingPages.push({
        name: `Page ${this.formValues.landingPages.length + 1}`,
        order: this.formValues.landingPages.length + 1,
        content: templateContent
      })
      syncLandingPagesMetadata(this.formValues.landingPages)
      ;(this.languagesPayload || []).forEach((language) => {
        if (language && language.landingPages) {
          language.landingPages.push(
            structuredClone(this.formValues.landingPages[this.formValues.landingPages.length - 1])
          )
        }
      })
      this.tab = getValidLandingPageTab(
        this.formValues.landingPages,
        this.formValues.landingPages.length - 1
      )
    },
    handleAddBlankPage() {
      syncLandingPagesMetadata(this.formValues.landingPages)
      this.formValues.landingPages.push({
        name: `Page ${this.formValues.landingPages.length + 1}`,
        order: this.formValues.landingPages.length + 1,
        content: ''
      })
      syncLandingPagesMetadata(this.formValues.landingPages)
      ;(this.languagesPayload || []).forEach((language) => {
        if (language && language.landingPages) {
          language.landingPages.push(
            structuredClone(this.formValues.landingPages[this.formValues.landingPages.length - 1])
          )
        }
      })
      this.tab = getValidLandingPageTab(
        this.formValues.landingPages,
        this.formValues.landingPages.length - 1
      )
    },
    handleDeleteLandingPage(index) {
      const activeTabIndex = getLandingPageTabIndex(this.tab)
      this.formValues.landingPages.splice(index, 1)
      syncLandingPagesMetadata(this.formValues.landingPages)
      ;(this.languagesPayload || []).forEach((language) => {
        if (language && language.landingPages && language.landingPages[index]) {
          language.landingPages.splice(index, 1)
          syncLandingPagesMetadata(language.landingPages)
        }
      })
      const nextTabIndex = activeTabIndex >= index ? activeTabIndex - 1 : activeTabIndex
      this.tab = getValidLandingPageTab(this.formValues.landingPages, nextTabIndex)
    },
    handleUploadHTML() {
      this.$refs.refHtmlFile.click()
    },
    handleHTMLUploadChange(e) {
      const file = e.target.files[0]
      if (file.type !== 'text/html') {
        return this.$store.dispatch('common/createSnackBar', {
          message: `Invalid file type`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      if (file.size > 5242880) {
        return this.$store.dispatch('common/createSnackBar', {
          message: `File size should be less than 5MB`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      const reader = new FileReader()
      const that = this
      reader.onload = function (e) {
        const { result } = e.target
        if (!result?.length) {
          return that.$store.dispatch('common/createSnackBar', {
            message: `Empty file`,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        syncLandingPagesMetadata(that.formValues.landingPages)
        that.formValues.landingPages.push({
          name: `Page ${that.formValues.landingPages.length + 1}`,
          order: that.formValues.landingPages.length + 1,
          content: result
        })
        syncLandingPagesMetadata(that.formValues.landingPages)
        ;(that.languagesPayload || []).forEach((language) => {
          if (language && language.landingPages) {
            language.landingPages.push(
              structuredClone(that.formValues.landingPages[that.formValues.landingPages.length - 1])
            )
          }
        })
        that.tab = getValidLandingPageTab(
          that.formValues.landingPages,
          that.formValues.landingPages.length - 1
        )
      }
      reader.readAsText(file)
    },
    setAttachmentFile(file) {
      this.formValues.attachmentFiles = file
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
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
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
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refEmailTemplateContent.validate() && isValid) {
        if (this.activeLanguage && Array.isArray(this.languagesPayload)) {
          const idx = this.languagesPayload.findIndex(
            (item) => item.languageTypeResourceId === this.activeLanguage
          )
          if (idx !== -1) {
            this.$set(this.languagesPayload, idx, {
              ...this.languagesPayload[idx],
              landingPages: structuredClone(this.formValues.landingPages)
            })
          }
        }
        syncLandingPagesMetadata(this.formValues.landingPages)
        const formValues = {
          ...this.formValues.phishingLink,
          ...this.formValues
        }
        delete formValues.phishingLink
        const payload = {
          ...formValues,
          availableForRequests: this.$refs.refMakeAvailableFor.getAvailableForValues(
            this.availableForRequests
          )
        }
        if (
          typeof this.buildLandingPagesPayload === 'function' &&
          Array.isArray(this.selectedLanguages) &&
          this.selectedLanguages.length > 0
        ) {
          payload.landingPages = this.buildLandingPagesPayload(payload)
        } else if (Array.isArray(payload.landingPages)) {
          payload.landingPages = normalizeLandingPages(payload.landingPages)
        }
        if (this.isEdit && !this.isDuplicate) {
          QuishingService.updateLandingPage(payload, this.emailTemplateId)
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        } else {
          QuishingService.createLandingPage(payload)
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
      }
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
      })
    },
    callForMergedTags() {
      QuishingService.getMergedTextForQuishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    getTagsComponent(item) {
      return MERGED_TEXTS_MAP[item]
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    }
  }
}
</script>
