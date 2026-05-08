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
                      :is-duplicate="isDuplicate"
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
                    <FormGroup title="Landing Page Template"></FormGroup>
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
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
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
import QuishingService from '@/api/quishing'
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
    InputSelectLanguage,
    InputTag,
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
      isInvisibleCaptchaDisabled: false,
      isSelectClickOnlyPageOpen: false,
      quishingApiFuncs: {
        list: QuishingService.getLandingPageList,
        content: QuishingService.getLandingPageTemplatePreviewContent
      },
      tab: 'page1',
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      labels,
      step: 1,
      Validations,
      availableForRequests: [],
      initialFormValues: {},
      formValues: {
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
      this.tab = getValidLandingPageTab(
        this.formValues.landingPages,
        this.formValues.landingPages.length - 1
      )
    },
    handleDeleteLandingPage(index) {
      const activeTabIndex = getLandingPageTabIndex(this.tab)
      this.formValues.landingPages.splice(index, 1)
      syncLandingPagesMetadata(this.formValues.landingPages)
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
        if (Array.isArray(payload.landingPages)) {
          payload.landingPages = normalizeLandingPages(payload.landingPages).map((page) => {
            const landingPage = { ...page }
            delete landingPage.languages
            return landingPage
          })
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
