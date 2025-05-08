<template>
  <div class="emailTemplatePreview">
    <app-dialog
      style="overflow: hidden;"
      custom-size="1600"
      max-height
      max-height-size="900"
      icon="mdi-eye"
      :subtitle="getEmailTemplateDialogSubtitle"
      :title="selectedTemplateHeader"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
    >
      <template #app-dialog-body>
        <KEmailPreview v-if="!!templateHTML" :html="templateHTML" :key="templateHTML" />
      </template>
      <template #app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <AppDialog
      :status="isRenameAttachmentModalVisible"
      title="Rename The Attachment"
      @changeStatus="handleCloseRenameAttachmentModal"
    >
      <template #app-dialog-body>
        <v-form ref="refAttachmentNameForm" @submit.prevent>
          <v-text-field
            v-model.trim="attachmentName"
            v-bind="commonRules"
            id="input--new-email-templates-template-name"
            placeholder="Enter a name"
            hint="*Required"
            required
            outlined
            dense
            persistent-hint
            @keyup.enter="handleConfirmRenameAttachment"
          />
        </v-form>
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          @handleClose="handleCloseRenameAttachmentModal"
          @handleConfirm="handleConfirmRenameAttachment"
        />
      </template>
    </AppDialog>
    <div class="emailTemplatePreview__container" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main">
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between align-center mr-6">
              <div class="d-flex">
                <div>
                  <VTextField
                    v-model.trim="search"
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter pr-2"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="
                      max-width: 328px;
                      min-width: 328px;
                      width: 100%;
                      padding-right: 4px !important;
                    "
                  />
                </div>
                <div>
                  <KSelect
                    v-model="languageSelectValue"
                    :items="languages"
                    placeholder="Language"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios filter-field-scenarios__language"
                    custom-menu-class="filter-field-scenarios__language-menu"
                    :min-width-type="isPhishing ? 'medium' : ''"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      min-width: 150px;
                    "
                    :type="isPhishing ? 'autocomplete' : 'select'"
                    :multiple="isPhishing"
                    :slots="isPhishing ? { selection: true } : {}"
                    @change="handleInputLanguageChange"
                  >
                    <template v-if="isPhishing" #selection="data">
                      <span v-if="data.index === 0"
                        >Language ({{ languageSelectValue.length }})</span
                      >
                    </template>
                  </KSelect>
                </div>
                <div style="max-width: 140px;">
                  <KSelect
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    :items="difficulties"
                    @change="getTemplatesForSearch"
                  />
                </div>
              </div>
              <div v-if="isPhishing">
                <v-btn
                  class="emailTemplatePreview__edit-button"
                  color="#2196F3"
                  outlined
                  rounded
                  @click="handleCreateEmailTemplateClick"
                >
                  <v-icon left color="#2196f3" medium> mdi-plus </v-icon>
                  <span class="emailTemplatePreview__edit-button-text">Create Email Template</span>
                </v-btn>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical">
            <div
              class="pane"
              :style="{
                width: '25% !important',
                minWidth: '360px',
                pointerEvents: loadingTemplates ? 'none' : 'inherit'
              }"
              @scroll="handleScroll"
            >
              <div
                v-for="(item, index) in listData"
                :key="item.name + index"
                :class="{
                  'template-list': true,
                  'template-list--selected': item['selected'],
                  'template-list--editing': isEditMode
                }"
                @click="setSelectedTemplate(item, index)"
              >
                <div class="d-flex justify-space-between mb-2">
                  <div class="d-flex flex-column wrapWord">
                    <div
                      class="template-list--item template-list--item__header"
                      :id="`template-${index}`"
                    >
                      <span>{{ item.name }}</span>
                      <VTooltip v-if="item.isAssistedByAI" bottom :attach="`#template-${index}`">
                        <template #activator="{ on }">
                          <VIcon
                            v-on="on"
                            class="ml-1"
                            style="margin-top: -2px;"
                            color="#2196F3"
                            small
                            >mdi-creation</VIcon
                          >
                        </template>
                        <span>This template was generated with AI</span>
                      </VTooltip>
                    </div>
                    <div
                      class="template-list--item template-list--item__sub-header"
                      style="overflow: hidden; text-overflow: ellipsis;"
                    >
                      <template v-if="!isCallback">
                        {{ item['categoryName'] }}
                      </template>
                      <span class="template-list--item__sub-header--span"
                        ><span v-if="!isCallback" style="font-size: 20px; vertical-align: sub;"
                          >&bull;</span
                        >
                        by</span
                      >
                      {{ item['createdBy'] }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'template-list--item template-list--item__difficulty',
                      getItemDifficultyClass(item['difficultyName'])
                    ]"
                  >
                    {{ item['difficultyName'] }}
                  </div>
                </div>

                <div class="template-list--item">
                  {{ getItemDescription(item) }}
                </div>
                <div class="template-list--item d-flex justify-space-between align-center mt-2">
                  <ShowMoreTags :default-badges="item.tags" />
                  <div v-if="!item.tags || !item.tags.length">{{ '\xa0' }}</div>
                  <div class="d-flex align-center">
                    <div class="template-list--item__narrator mr-2">
                      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
                      <span class="template-list--item__language">{{ item.languageTypeName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  !loadingTemplatePreview &&
                  (search ||
                    bodyData.filter.FilterGroups[0].FilterItems[0].value ||
                    bodyData.filter.FilterGroups[0].FilterItems[1].value) &&
                  !listData.length
                "
                class="pl-5 pt-5"
              >
                Search criteria has no results
              </div>
              <div
                v-else-if="
                  !loadingTemplates && !loadingTemplatePreview && !search && !listData.length
                "
                class="pl-5 pt-5"
              >
                {{
                  isQuishingTypeIndividualPrintOut
                    ? 'You do not have any individual printout templates'
                    : 'You do not have Email Template'
                }}
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  !loadingTemplatePreview &&
                  !search &&
                  !listData.length &&
                  isQuishingTypeIndividualPrintOut
                "
                class="pl-5 pt-5"
              >
                Go to Quishing Simulator > Quishing Scenarios > Quishing Templates to create a new
                individual printout template
              </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1, position: 'relative' }">
              <template v-if="listData.length">
                <div v-if="isPhishing" class="emailTemplatePreview__buttons-container">
                  <template v-if="!isEditMode">
                    <v-btn
                      class="emailTemplatePreview__edit-button"
                      color="#2196F3"
                      outlined
                      rounded
                      @click="handleEdit"
                    >
                      <v-icon left color="#2196f3" medium> mdi-pencil </v-icon>
                      <span class="emailTemplatePreview__edit-button-text"
                        >Edit Email Template</span
                      >
                    </v-btn>
                    <v-btn
                      v-if="!!templateHTML"
                      color="#2196F3"
                      icon
                      outlined
                      @click="isTemplateDetails = true"
                    >
                      <v-icon color="#2196f3" small> mdi-eye </v-icon>
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      class="emailTemplatePreview__exit-editing-button"
                      color="#F56C6C"
                      outlined
                      rounded
                      :disabled="isSaving"
                      @click="handleExitEditing"
                    >
                      <span class="emailTemplatePreview__exit-editing-text">Exit Editing</span>
                    </v-btn>
                    <div>
                      <v-btn
                        class="emailTemplatePreview__save-as-new-button mr-4"
                        color="#2196F3"
                        outlined
                        rounded
                        :disabled="isSaving"
                        @click="handleSaveAsNew"
                      >
                        <span class="emailTemplatePreview__save-as-new-text">Save As New</span>
                      </v-btn>
                      <VTooltip :disabled="emailTemplateData.createdBy !== 'System'" bottom>
                        <template #activator="{ on }">
                          <v-btn
                            v-on="on"
                            id="emailTemplatePreview__save-changes-button"
                            class="emailTemplatePreview__save-changes-button mr-4"
                            color="#2196F3"
                            rounded
                            :disabled="isSaving || emailTemplateData.createdBy === 'System'"
                            @click="handleSaveChanges"
                          >
                            <span class="emailTemplatePreview__save-changes-text"
                              >Save Changes</span
                            >
                          </v-btn>
                        </template>
                        <span>You are not authorized to edit this template</span>
                      </VTooltip>
                      <v-btn
                        v-if="!!templateHTML"
                        color="#2196F3"
                        icon
                        outlined
                        :disabled="isSaving"
                        @click="isTemplateDetails = true"
                      >
                        <v-icon color="#2196f3" small> mdi-eye </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </div>
                <template v-if="isEditMode">
                  <EmailTemplate
                    ref="refEmailTemplate"
                    :show-name-field="true"
                    :active-block-manager-components="activeBlockManagerComponents"
                    :name.sync="editData.name"
                    :from-address.sync="editData.fromAddress"
                    :ccAddresses.sync="editData.ccAddresses"
                    :from-name.sync="editData.fromName"
                    :subject.sync="editData.subject"
                    :template.sync="editData.template"
                    :attachmentFiles.sync="editData.phishingFile"
                    :isAttachmentError="isAttachmentError"
                    :is-edit="true"
                    :is-phishing-template="isAttachmentBasedScenario"
                    :isNotificationTemplate="true"
                    :isEmailTemplate="isPhishing"
                    :extensions="['doc', 'docx', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx']"
                    :size="5"
                    fileUploadHint="Only word, excel, powerpoint, html files. Max. file size 5MB"
                    :isHorizontalFormGroups="true"
                    @handleEditHtmlTemplate="editData.template = $event"
                    @setAttachmentFile="setAttachmentFile"
                    @handleRenameAttachment="handleShowRenameAttachmentModal"
                    @handleDeleteAttachment="handleDeleteAttachment"
                    @template-edit="handleTemplateEdit"
                  />
                </template>
                <template v-else>
                  <div class="template-preview" :style="isPhishing ? 'padding-bottom:8px;' : ''">
                    <div v-if="!isPhishing" class="template-preview__icon">
                      <v-btn
                        v-if="!!templateHTML"
                        color="#2196F3"
                        icon
                        outlined
                        @click="isTemplateDetails = true"
                      >
                        <v-icon color="#2196f3" small> mdi-eye </v-icon>
                      </v-btn>
                    </div>
                    <div class="template-preview__text pl-2" v-if="!!templateHTML">
                      <div>
                        <span class="template-preview__text--title fw-600 text-primary-color"
                          >Template Name:
                        </span>
                        <span class="template-preview__text--body fw-400 text-primary-color">{{
                          selectedTemplateHeader
                        }}</span>
                      </div>
                      <div
                        v-if="isPhishing"
                        style="background: #e0e0e0; height: 1px; max-width: 554px;"
                      ></div>
                      <div v-if="isPhishing">
                        <InputLanguagePreview
                          v-model="languagePreview"
                          persistent-hint
                          class="max-w-554 campaign-manager-phishing-scenario-input-language"
                          :hint="`This template is available in ${selectedTemplateLanguages.length} languages.`"
                          :items="selectedTemplateLanguages"
                          :hide-details="false"
                          @input="handleEmailTemplatePreviewLanguageChange"
                        />
                      </div>
                      <div
                        :class="isPhishing ? 'mt-n2' : ''"
                        v-if="!isQuishingTypeIndividualPrintOut"
                      >
                        <span class="template-preview__text--title fw-600 text-primary-color"
                          >Subject:
                        </span>
                        <span class="template-preview__text--body fw-400 text-primary-color">{{
                          templateSubject
                        }}</span>
                      </div>
                      <div v-if="!isQuishingTypeIndividualPrintOut">
                        <span class="template-preview__text--title fw-600 text-primary-color"
                          >From Name:
                        </span>
                        <span class="template-preview__text--body fw-400 text-primary-color">{{
                          templateFromName
                        }}</span>
                      </div>
                      <div v-if="!isQuishingTypeIndividualPrintOut">
                        <span class="template-preview__text--title fw-600 text-primary-color"
                          >From Email Address:
                        </span>
                        <span class="template-preview__text--body fw-400 text-primary-color">{{
                          templateFromEmail
                        }}</span>
                      </div>
                      <div v-if="isPhishing">
                        <span class="template-preview__text--title fw-600 text-primary-color"
                          >CC:
                        </span>
                        <span class="template-preview__text--body fw-400 text-primary-color">{{
                          templateCCAddresses.join(', ')
                        }}</span>
                      </div>
                      <div
                        v-if="phishingFile && phishingFile.length"
                        class="attachment-wrapper d-flex align-center"
                        style="position: relative;"
                      >
                        <span class="template-preview__text--title mr-2">Attach File: </span>
                        <div class="attachment blue-attach mb-0">
                          <AttachmentsPreview
                            :deletable="false"
                            :att="phishingFile[0]"
                            :isEmailTemplate="true"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr v-if="!!templateHTML" />
                  <k-email-preview
                    v-if="templateHTML"
                    :key="templateHTML"
                    :html="templateHTML"
                    is-extra-height
                  />
                </template>
              </template>
            </div>
          </multipane>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import AppDialog from '@/components/AppDialog'
import {
  getEmailTemplatePreviewContent,
  getEmailTemplatesList,
  getMergedTextForPhishing,
  updatePhishingEmailTemplate,
  createPhishingEmailTemplate
} from '@/api/phishingsimulator'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
import InfiniteScroll from '@/directives/infinite-scroll'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import {
  getDefaultEmailTemplatePayload,
  SCENARIO_DIFFICULTIES,
  SCENARIO_METHODS,
  MERGED_TEXTS
} from '@/components/PhishingScenarios/utils'
import useDebounce from '@/hooks/useDebounce'
import KSelect from '@/components/Common/Inputs/KSelect'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { SCENARIO_TYPES, getItemDifficultyClass } from '@/components/Common/Simulator/utils'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import { isDifferent } from '@/utils/functions'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
export default {
  name: 'EmailTemplateListPreview',
  props: {
    scenarioDetailsLookup: { required: true },
    emailTemplateResourceId: { required: false },
    categoryResourceId: { type: String, default: '' },
    defaultBodyData: {
      type: Object
    },
    apiFuncs: {
      type: Object,
      default: () => ({
        list: getEmailTemplatesList,
        content: getEmailTemplatePreviewContent
      })
    },
    quishingType: {
      type: String,
      default: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL
    },
    languages: {
      type: Array
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    isAttachmentBasedScenario: {
      type: Boolean
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  directives: {
    'infinite-scroll': InfiniteScroll
  },
  components: {
    InputLanguagePreview,
    KSelect,
    ShowMoreTags,
    KEmailPreview,
    Multipane,
    MultipaneResizer,
    AppDialog,
    AttachmentsPreview,
    EmailTemplate,
    AppDialogFooter
  },
  mixins: [useDebounce],
  data() {
    return {
      labels,
      languagePreview: '',
      selectedTemplateLanguages: [],
      isSaving: false,
      emailTemplateData: {},
      languageSelectValue: this.isPhishing ? [] : '',
      attachmentName: '',
      isRenameAttachmentModalVisible: false,
      isAttachmentError: false,
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      isEditMode: false,
      phishingFile: null,
      search: null,
      listData: [],
      defaultListData: [],
      templateFromName: null,
      templateSubject: null,
      totalNumberOfPages: 1,
      templateFromEmail: null,
      templateCCAddresses: [],
      methods: SCENARIO_METHODS,
      difficulties: SCENARIO_DIFFICULTIES,
      bodyData: this.defaultBodyData || getDefaultEmailTemplatePayload(this.categoryResourceId),
      loadingTemplatePreview: false,
      templateHTML: null,
      activeTemplateHTML: null,
      isTemplateDetails: null,
      selectedTemplateHeader: null,
      loadingTemplates: false,
      selectedTemplateId: null,
      selectedPreviousIndex: 0,
      initialEditData: {},
      editData: {
        name: '',
        fromAddress: null,
        ccAddresses: [],
        fromName: null,
        subject: null,
        template: null,
        phishingFile: null,
        phishingFileName: ''
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      }
    }
  },
  computed: {
    getEmailTemplateDialogSubtitle() {
      if (this.isQuishing)
        return this.isQuishingTypeIndividualPrintOut
          ? 'Individual Printout Template Preview'
          : 'Quishing Email Template Preview'
      return 'Email Template Preview'
    },
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    isQuishingTypeEmail() {
      if (!this.isQuishing) return false
      return this.quishingType.toLowerCase() === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL.toLowerCase()
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this.quishingType.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    }
  },
  watch: {
    isEditMode(val) {
      this.$emit('edit-mode', val)
    },
    search(newVal, oldVal) {
      if (!newVal) {
        if (
          this.bodyData.filter.FilterGroups[0].FilterItems[0].value ||
          this.bodyData.filter.FilterGroups[0].FilterItems[1].value
        ) {
          this.getTemplates(true)
        } else {
          this.listData = [...this.defaultListData].map((item) => ({
            ...item,
            selected: item.resourceId === this.emailTemplateResourceId
          }))
          this.templateHTML = this.activeTemplateHTML || this.templateHTML
        }
      } else if (newVal !== oldVal) {
        this.callForSearch()
      }
    }
  },
  mounted() {
    this.callForMergedTags()
    this.getTemplates(true, this.emailTemplateResourceId)
  },
  methods: {
    getItemDifficultyClass,
    handleCreateEmailTemplateClick() {
      this.$emit('on-create-email-template')
    },
    handleShowRenameAttachmentModal() {
      this.isRenameAttachmentModalVisible = true
    },
    handleCloseRenameAttachmentModal() {
      this.attachmentName = ''
      this.isRenameAttachmentModalVisible = false
    },
    handleConfirmRenameAttachment() {
      if (this.$refs.refAttachmentNameForm && this.$refs.refAttachmentNameForm.validate()) {
        let fileExtension = ''
        const type = this.editData.phishingFile[0].type
        if (this.editData.phishingFile[0].name) {
          fileExtension = this.editData.phishingFile?.[0]?.name.split('.')[1]
          const file = this.editData.phishingFile[0]
          this.editData.phishingFile = [
            new File([file], `${this.attachmentName}.${fileExtension}`, {
              type
            })
          ]
        } else {
          fileExtension = this.editData.phishingFile?.[0]?.fileName?.split('.')?.[1]
          this.editData.phishingFile = [
            {
              ...this.editData.phishingFile[0],
              fileName: `${this.attachmentName}.${fileExtension}`
            }
          ]
        }
        this.isPhishingFileModified = true
        this.handleCloseRenameAttachmentModal()
      }
    },
    callForMergedTags() {
      getMergedTextForPhishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    getTagsComponent(item) {
      return MERGED_TEXTS[item]
    },
    handleEdit() {
      this.initialEditData = {
        name: this.selectedTemplateHeader,
        fromAddress: this.templateFromEmail,
        ccAddresses: this.templateCCAddresses,
        fromName: this.templateFromName,
        subject: this.templateSubject,
        template: this.templateHTML,
        phishingFile: this.phishingFile
      }
      this.editData = { ...this.initialEditData }
      this.isEditMode = true
    },
    handleExitEditing() {
      const isChanged = isDifferent(this.editData, this.initialEditData)
      if (!isChanged) {
        this.isEditMode = false
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.isEditMode = false
        }
      })
    },
    handleSaveAsNew() {
      if (!this.validateEditData()) return
      this.isSaving = true
      let payload = {
        ...this.emailTemplateData,
        ...this.editData,
        name:
          this.editData.name !== this.emailTemplateData.name
            ? this.editData.name
            : `${this.editData.name} - Copy`,
        isDuplicated: true,
        duplicatedTemplateResourceId: this.emailTemplateData.resourceId,
        availableForRequests: this.emailTemplateData.availableForList,
        isAttachmentBasedTemplate: this.isAttachmentBasedScenario,
        isPhishingFileModified: this.isPhishingFileModified,
        isAddedNewPhishingFile: this.isAddedNewPhishingFile,
        attachmentFiles: this.editData.phishingFile,
        importedEmailAttachments: this.editData.phishingFile,
        phishingFileName:
          !this.isAddedNewPhishingFile && !!this.editData?.phishingFile?.length
            ? this.editData.phishingFile[0]?.fileName
            : null
      }
      delete payload.attachments
      delete payload.resourceId
      createPhishingEmailTemplate(payload, this.emailTemplateData.resourceId)
        .then((response) => {
          this.insertTemplate(response?.data?.data?.resourceId, {
            ...payload,
            ...response?.data?.data?.searchPsEmailTemplate
          })
        })
        .finally(() => {
          this.isSaving = false
          this.isEditMode = false
        })
    },
    handleSaveChanges() {
      if (!this.validateEditData()) return
      this.isSaving = true
      let payload = {
        ...this.emailTemplateData,
        ...this.editData,
        isDuplicated: false,
        duplicatedTemplateResourceId: null,
        availableForRequests: this.emailTemplateData.availableForList,
        isAttachmentBasedTemplate: this.isAttachmentBasedScenario,
        isPhishingFileModified: this.isPhishingFileModified,
        isAddedNewPhishingFile: this.isAddedNewPhishingFile,
        attachmentFiles: this.editData.phishingFile,
        importedEmailAttachments: this.editData.phishingFile,
        phishingFileName:
          !this.isAddedNewPhishingFile && !!this.editData?.phishingFile?.length
            ? this.editData.phishingFile[0]?.fileName
            : null
      }
      delete payload.attachments
      updatePhishingEmailTemplate(payload, this.emailTemplateData.resourceId)
        .then(() => {
          this.updateTemplate(this.emailTemplateData.resourceId, payload)
        })
        .finally(() => {
          this.isSaving = false
          this.isEditMode = false
        })
    },
    updateTemplate(resourceId, newTemplate) {
      const templateIndex = this.listData.findIndex(
        (template) => template.resourceId === resourceId
      )
      if (templateIndex !== -1) {
        this.listData[templateIndex] = {
          ...this.listData[templateIndex],
          ...newTemplate
        }
        this.selectedTemplateHeader = this.listData[templateIndex].name || ''
        this.templateHTML = this.listData[templateIndex].template
        this.templateFromName = this.listData[templateIndex].fromName || ''
        this.templateSubject = this.listData[templateIndex].subject || ''
        this.templateFromEmail = this.listData[templateIndex].fromAddress || ''
        this.templateCCAddresses = this.listData[templateIndex].ccAddresses || ''
        this.phishingFile = this.listData[templateIndex].phishingFileName
          ? [
              {
                fileName: this.listData[templateIndex].phishingFileName,
                url: this.listData[templateIndex].phishingFileUrl
              }
            ]
          : []
      }
    },
    insertTemplate(resourceId, newTemplate) {
      this.selectedTemplateHeader = newTemplate.name || ''
      this.templateHTML = newTemplate.template
      this.templateFromName = newTemplate.fromName || ''
      this.templateSubject = newTemplate.subject || ''
      this.templateFromEmail = newTemplate.fromAddress || ''
      this.templateCCAddresses = newTemplate.ccAddresses || ''
      this.phishingFile = newTemplate.phishingFileName
        ? [
            {
              fileName: newTemplate.phishingFileName,
              url: newTemplate.phishingFileUrl
            }
          ]
        : []
      this.listData.unshift({ resourceId, ...newTemplate })
      this.listData[0].selected = true
      this.listData.forEach((item, index) => {
        if (index !== 0) {
          item.selected = false
        }
      })
      this.emailTemplateData = { resourceId, ...newTemplate }
      this.setSelectedTemplate({ resourceId, ...newTemplate }, 0)
    },
    validateEditData() {
      if (!this.editData.name) return false
      if (!this.editData.subject) return false
      if (!this.editData.fromName) return false
      if (!this.editData.fromAddress || Validations.email(this.editData.fromAddress) !== true)
        return false
      if (!this.editData.template) return false
      return !(this.isAttachmentBasedScenario && !this.editData.phishingFile)
    },
    setAttachmentFile(file) {
      if (Array.isArray(file) && file.length === 0) return
      if (file && !file.type) {
        let newFile = null
        let fileExtension = ''
        if (file?.name.includes('.')) {
          fileExtension = file?.name?.split('.')?.pop()
        }
        if (fileExtension === '.doc') {
          newFile = new File([file], file.name, { type: 'application/msword' })
        } else if (fileExtension === 'docx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
        } else if (fileExtension === 'ppt') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.ms-powerpoint'
          })
        } else if (fileExtension === 'pptx') {
          newFile = new File([file], file.name, {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          })
        }
        this.editData.phishingFile = Array.isArray(newFile) ? newFile : [newFile] || []
        this.isAttachmentError = false
      } else {
        this.editData.phishingFile = Array.isArray(file) ? file : [file] || []
        this.isAttachmentError = false
      }
      this.isPhishingFileModified = true
      this.isAddedNewPhishingFile = true
    },
    handleDeleteAttachment() {
      this.editData.phishingFile = null
      this.isAddedNewPhishingFile = false
    },
    getItemDescription(item = {}) {
      if (!item?.description) {
        return '\xa0'
      }

      if (item?.description === 'null' || item?.description === 'undefined') {
        return '\xa0'
      }

      return item?.description || '\xa0'
    },
    callForSearch() {
      this.debounce(() => {
        const copyOfBodyData = JSON.parse(JSON.stringify(this.bodyData))
        copyOfBodyData.pageNumber = 1
        copyOfBodyData.pageSize = 100
        copyOfBodyData.filter.FilterGroups[1].FilterItems[0].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[1].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[2].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[3].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[4].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[5].value = this.search
        this.checkAndAddResourceIdToPayload(true, copyOfBodyData)
        this.apiFuncs
          .list(copyOfBodyData)
          .then((response) => {
            const { data } = response
            if (!response.data.data.results.length) {
              this.listData = []
              this.activeTemplateHTML = this.templateHTML
              this.templateHTML = null
            } else {
              this.listData = data.data.results.map((item) => {
                return {
                  ...item,
                  selected: item.resourceId === this.emailTemplateResourceId
                }
              })
            }
          })
          .finally(() => {
            this.loadingTemplates = false
            this.showLoader = false
            this.$emit('loading', false)
          })
      }, 500)
    },
    handleInputLanguageChange(value) {
      this.bodyData.filter.FilterGroups[0].FilterItems[2].value = this.isPhishing
        ? value.join(',')
        : value
      this.getTemplatesForSearch()
    },
    getTemplatesForSearch() {
      this.bodyData.pageSize = 100
      if (this.search) {
        this.callForSearch()
      } else {
        this.getTemplates(true, this.emailTemplateResourceId, this.bodyData, true)
      }
    },
    checkAndAddResourceIdToPayload(isInitial, bodyData) {
      this.loadingTemplates = true
      this.$emit('loading', true)
      if (isInitial && this.emailTemplateResourceId) {
        bodyData.filter.FilterGroups[1].FilterItems.push({
          FieldName: 'ResourceId',
          Operator: 'Include',
          value: this.emailTemplateResourceId
        })
      }
    },
    getTemplates(
      isInitial = false,
      emailTemplateResourceId = '',
      bodyData = this.bodyData,
      isSearch = false
    ) {
      this.checkAndAddResourceIdToPayload(isInitial, bodyData)
      if (this.isQuishingTypeIndividualPrintOut)
        bodyData.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT]
      else if (this.isQuishingTypeEmail)
        bodyData.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
      return this.apiFuncs
        .list(bodyData)
        .then((response) => {
          const { data } = response
          this.totalNumberOfPages = data.data.totalNumberOfPages
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            data.data.results = data.data.results.map((item) => {
              return { ...item, selected: false }
            })
            if (isSearch) {
              this.listData = data.data.results
            } else {
              this.listData = [...this.listData, ...data.data.results]
              this.defaultListData = [...this.listData]
            }
            if (!emailTemplateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (!isInitial) return
            if (emailTemplateResourceId) {
              const index = this.listData.findIndex(
                (item) => item.resourceId === emailTemplateResourceId
              )
              if (index > -1) {
                this.setSelectedTemplate(this.listData[index], index, true)
                this.listData[index].selected = true
              }
            } else {
              this.setSelectedTemplate(this.listData[0], 0, true)
            }
            this.defaultListData = [...this.listData]
          }
        })
        .finally(() => {
          this.loadingTemplates = false
          this.showLoader = false
          this.$emit('loading', false)
        })
    },
    setItemToFirstIndex(resourceId = '') {
      const itemIndex = this.listData.findIndex((item) => item.resourceId === resourceId)
      if (itemIndex === -1) return
      this.listData = [
        this.listData[itemIndex],
        ...this.listData.slice(0, itemIndex),
        ...this.listData.slice(itemIndex + 1)
      ]
    },
    handleScroll(e) {
      const scrollPosition = e.target.scrollTop + e.target.offsetHeight
      const scrollHeight = e.target.scrollHeight - 30
      if (scrollPosition > scrollHeight) {
        this.debounce(() => {
          this.getDataAfterValidScroll()
        }, 250)
      }
    },
    getDataAfterValidScroll() {
      if (this.bodyData.pageNumber < this.totalNumberOfPages && !this.search) {
        this.bodyData.pageNumber += 1
        this.loadingTemplates = true
        this.getTemplates()
      }
    },
    handleTemplateEdit(val) {
      this.$emit('template-edit', val)
    },
    setSelectedTemplate(item, index, isInitial = false) {
      if (this.isSaving) return
      const isChanged = isDifferent(this.editData, this.initialEditData)
      if (this.isEditMode && isChanged) {
        this.handleExitEditing()
        return
      }
      this.isEditMode = false
      this.listData = this.listData.map((item) => {
        return { ...item, selected: false }
      })
      if (index !== undefined) {
        if (this.listData[index]) {
          this.listData[index].selected = true
        }
        this.selectedPreviousIndex = index
      }
      this.loadingTemplatePreview = true
      this.$emit('selectedEmailTemplateChange', item.id, item)
      this.$emit('selectedEmailTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialEmailTemplateId', item.id)
      }
      this.apiFuncs
        .content(item.resourceId)
        .then((response) => {
          let template = response?.data?.data?.template || ''
          template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.emailTemplateData = { ...item, ...response?.data?.data } || {}
          this.selectedTemplateHeader = response?.data?.data?.name || ''
          this.templateHTML = template
          this.templateFromName = response?.data?.data?.fromName || ''
          this.templateSubject = response?.data?.data?.subject || ''
          this.templateFromEmail = response?.data?.data?.fromAddress || ''
          this.templateCCAddresses = response?.data?.data?.ccAddresses || ''
          this.phishingFile = response?.data?.data?.phishingFileName
            ? [
                {
                  fileName: response?.data?.data?.phishingFileName,
                  url: response?.data?.data?.phishingFileUrl
                }
              ]
            : []
        })
        .finally(() => {
          this.loadingTemplatePreview = false
        })
    },
    handleEmailTemplatePreviewLanguageChange() {}
  }
}
</script>
