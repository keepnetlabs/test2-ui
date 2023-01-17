<template>
  <app-modal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
    :id="getModalId"
    confirm-button-id="btn-save--notification-template-modal"
    cancel-button-id="btn-cancel--notification-template-modal"
    title-id="text--notification-template-modal-title"
    :saveDisable="saveDisable"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            v-bind="commonRules"
            id="input--notification-template-name"
            initialPlaceholder="Enter template name"
            :initialRules="commonRules.rules"
            :disabled="editItemsDisabled"
          />
        </form-group>
        <form-group title="Template Type" has-hint>
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.emailTemplateCategoryResourceId"
            id="input--notification-template-type"
            :items="categoryItems"
            class="new-integration__select"
            no-data-text="No template type available"
            dense
            :disabled="!!selectedItem || editItemsDisabled"
            outlined
            :placeholder="formValues.emailTemplateCategoryResourceId ? '' : 'Select Option'"
          />
        </form-group>
        <form-group title="SMTP" has-hint>
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.smtpSettingResourceId"
            id="input--notification-template-smtp"
            :items="smtpItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
            :disabled="editItemsDisabled"
          />
        </form-group>
        <form-group title="Tags" sub-title="Define tags for the notification template">
          <InputTag
            ref="refTags"
            id="input--action-tags-new-notification-template"
            v-model="formValues.tags"
            :items="[]"
            class="hide-caret"
          />
        </form-group>
        <make-available-for
          v-if="isRenderMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
        />
        <form-group title="Email Template" class-name="email-template mt-2" onsubmit="return false">
          <DatatableLoading v-if="loading" :loading="loading" />
          <email-template
            v-else
            ref="refEmailTemplate"
            :active-block-manager-components="activeBlockManagerComponents"
            :edit-items-disabled="editItemsDisabled"
            :from-address.sync="formValues.fromAddress"
            :from-name.sync="formValues.fromName"
            :subject.sync="formValues.subject"
            :template.sync="formValues.template"
            :is-edit="!!selectedItem"
            @handleEditHtmlTemplate="formValues.template = $event"
          />
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { mail } from '@/utils/validations'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import KSelect from '@/components/Common/Inputs/KSelect'
import {
  createEmailTemplate,
  getEmailTemplate,
  getMergedTags,
  getTemplateTypes,
  updateEmailTemplate
} from '@/api/company'
import { searchSmtpSettings } from '@/api/smtpSettings'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'
import message from '@/components/GrapesJs/Newsletter/mergedTexts/message'
import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'
import passwordURL from '@/components/GrapesJs/Newsletter/mergedTexts/passwordURL'
import postDate from '@/components/GrapesJs/Newsletter/mergedTexts/postDate'
import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'
import shareUserName from '@/components/GrapesJs/Newsletter/mergedTexts/shareUserName'
import postTitle from '@/components/GrapesJs/Newsletter/mergedTexts/postTitle'
import postDesc from '@/components/GrapesJs/Newsletter/mergedTexts/postDesc'
import postUserName from '@/components/GrapesJs/Newsletter/mergedTexts/postUserName'
import postCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/postCompanyName'
import webUrl from '@/components/GrapesJs/Newsletter/mergedTexts/webUrl'
import postUrl from '@/components/GrapesJs/Newsletter/mergedTexts/postUrl'
import currentDate from '@/components/GrapesJs/Newsletter/mergedTexts/currentDate'
import description from '@/components/GrapesJs/Newsletter/mergedTexts/description'
import shareCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/shareCompanyName'
import link from '@/components/GrapesJs/Newsletter/mergedTexts/link'
import communityTitle from '@/components/GrapesJs/Newsletter/mergedTexts/communityTitle'
import communityUser from '@/components/GrapesJs/Newsletter/mergedTexts/communityUser'
import category from '@/components/GrapesJs/Newsletter/mergedTexts/category'
import communityDesc from '@/components/GrapesJs/Newsletter/mergedTexts/communityDesc'
import status from '@/components/GrapesJs/Newsletter/mergedTexts/status'
import activeUsers from '@/components/GrapesJs/Newsletter/mergedTexts/activeUsers'
import analysedEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysedEmail'
import foundEmailCount from '@/components/GrapesJs/Newsletter/mergedTexts/foundEmailCount'
import startedBy from '@/components/GrapesJs/Newsletter/mergedTexts/startedBy'
import startDate from '@/components/GrapesJs/Newsletter/mergedTexts/startDate'
import investigationName from '@/components/GrapesJs/Newsletter/mergedTexts/investigationName'
import invitedUserName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedUserName'
import invitedByCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedByCompanyName'
import communityUrl from '@/components/GrapesJs/Newsletter/mergedTexts/communityUrl'
import memberCount from '@/components/GrapesJs/Newsletter/mergedTexts/memberCount'
import communityIndustry from '@/components/GrapesJs/Newsletter/mergedTexts/communityIndustry'
import communityDescription from '@/components/GrapesJs/Newsletter/mergedTexts/communityDescription'
import analysisEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysisEmail'
import communityName from '@/components/GrapesJs/Newsletter/mergedTexts/communityName'
import owner from '@/components/GrapesJs/Newsletter/mergedTexts/owner'
import date from '@/components/GrapesJs/Newsletter/mergedTexts/date'
import reportBy from '@/components/GrapesJs/Newsletter/mergedTexts/reportBy'
import fromText from '@/components/GrapesJs/Newsletter/mergedTexts/from'
import to from '@/components/GrapesJs/Newsletter/mergedTexts/to'
import subject from '@/components/GrapesJs/Newsletter/mergedTexts/subject'
import attachment from '@/components/GrapesJs/Newsletter/mergedTexts/attachment'
import createDate from '@/components/GrapesJs/Newsletter/mergedTexts/createDate'
import senderIP from '@/components/GrapesJs/Newsletter/mergedTexts/senderIP'
import caseID from '@/components/GrapesJs/Newsletter/mergedTexts/caseID'
import userEmail from '@/components/GrapesJs/Newsletter/mergedTexts/userEmail'
import userAgent from '@/components/GrapesJs/Newsletter/mergedTexts/userAgent'
import actionDate from '@/components/GrapesJs/Newsletter/mergedTexts/actionDate'
import actionIP from '@/components/GrapesJs/Newsletter/mergedTexts/actionIP'
import productName from '@/components/GrapesJs/Newsletter/mergedTexts/productName'
import analysisDetailUrl from '@/components/GrapesJs/Newsletter/mergedTexts/analysisDetailUrl'
import companyLogo from '@/components/GrapesJs/Newsletter/mergedTexts/companyLogo'
import investigationUrl from '@/components/GrapesJs/Newsletter/mergedTexts/investigationUrl'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputTag from '@/components/Common/Inputs/InputTag'
import trainingName from '@/components/GrapesJs/Newsletter/mergedTexts/trainingName'
import trainingDescription from '@/components/GrapesJs/Newsletter/mergedTexts/trainingDescription'
import trainingUrl from '@/components/GrapesJs/Newsletter/mergedTexts/trainingUrl'
import trainingLanguageSelection from '@/components/GrapesJs/Newsletter/mergedTexts/trainingLanguageSelection'
import dateEmailSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateEmailSent'
import trainingEnrollDate from '@/components/GrapesJs/Newsletter/mergedTexts/trainingEnrollDate'
import trainingReminderCount from '@/components/GrapesJs/Newsletter/mergedTexts/trainingReminderCount'
import fromEmail from '@/components/GrapesJs/Newsletter/mergedTexts/fromEmail'
import fromName from '@/components/GrapesJs/Newsletter/mergedTexts/fromName'
import email from '@/components/GrapesJs/Newsletter/mergedTexts/email'
import firstName from '@/components/GrapesJs/Newsletter/mergedTexts/firstName'
import lastName from '@/components/GrapesJs/Newsletter/mergedTexts/lastName'
import trainingCompleteDate from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCompleteDate'
import trainingCoverImageUrl from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCoverImageUrl'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'

export default {
  name: 'NewNotificationTemplate',
  components: {
    DatatableLoading,
    InputTag,
    MakeAvailableFor,
    KSelect,
    EmailTemplate,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputEntityName
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    editItemsDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      loading: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      nonEditableAvailableForRequests: [],
      saveDisable: this.editItemsDisabled,
      Validations: Validations,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      initialFormValues: null,
      formValues: {
        availableForRequests: [],
        tags: [],
        name: '',
        emailTemplateCategoryResourceId: '',
        smtpSettingResourceId: '',
        fromAddress: '',
        fromName: '',
        subject: '',
        template: undefined
      },
      categoryItems: [],
      smtpItems: [],
      validations: {
        mail
      },
      smtpAxiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  computed: {
    getModalId() {
      return this.selectedItem ? this.getSelectedItemTitleId : 'new-notification-template-modal'
    },
    getSelectedItemTitleId() {
      return this.isDuplicate
        ? 'duplicate-notification-template-modal'
        : 'edit-notification-template-modal'
    },
    getModalTitle() {
      return this.selectedItem ? this.getSelectedItemModalTitle : labels.NewNotificationTemplate
    },
    getSelectedItemModalTitle() {
      return this.isDuplicate
        ? labels.DuplicateNotificationTemplate
        : labels.EditNotificationTemplate
    },
    getBodyTitle() {
      return this.selectedItem
        ? this.getSelectedItemModalTitle
        : labels.CreateNewNotificationTemplate
    },
    getBodySubtitle() {
      return this.selectedItem
        ? this.getSelectedItemBodySubtitle
        : labels.NewNotificationTemplateSubtitle
    },
    getSelectedItemBodySubtitle() {
      return this.isDuplicate
        ? labels.DuplicateNotificationTemplateSubtitle
        : labels.EditNotificationTemplateSubtitle
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled
    }
  },
  watch: {
    'formValues.emailTemplateCategoryResourceId'(resourceId) {
      this.handleCategoryChange(resourceId)
    }
  },
  created() {
    if (!this.selectedItem) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    this.callForDatas()
    if (this.selectedItem && this.selectedItem.resourceId) {
      this.loading = true
      getEmailTemplate(this.selectedItem.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response
          for (let [key, value] of Object.entries(data)) {
            if (key === 'availableForList') {
              if (value.length) {
                const availableForListFromBackend = getAvailableForListFromBackend(value)
                if (!availableForListFromBackend.length) {
                  this.formValues['availableForRequests'] = [
                    {
                      id: 'MyCompanyOnly',
                      label: 'My company only',
                      type: 'MyCompanyOnly',
                      resourceId: null
                    }
                  ]
                  this.nonEditableAvailableForRequests = [
                    {
                      id: 'MyCompanyOnly',
                      label: 'My company only',
                      type: 'MyCompanyOnly',
                      resourceId: null
                    }
                  ]
                } else {
                  this.formValues['availableForRequests'] = availableForListFromBackend
                  this.nonEditableAvailableForRequests = availableForListFromBackend
                }
              } else {
                this.formValues['availableForRequests'] = [
                  {
                    id: 'MyCompanyOnly',
                    label: 'My company only',
                    type: 'MyCompanyOnly',
                    resourceId: null
                  }
                ]
              }
              continue
            }
            this.formValues[key] = value
          }
          if (this.isDuplicate) {
            this.formValues.name = this.formValues.name + ' - COPY'
          }
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForDatas() {
      Promise.all([this.callForCategories(), this.callForSmtpSettings()]).then((response) => {
        const [categories, smtpSettings] = response
        const {
          data: { data: categoriesData }
        } = categories
        const { data: { data: smtpSettingsData = {} } = {} } = smtpSettings
        this.categoryItems = categoriesData.map((category) => {
          return {
            text: category.name,
            value: category.resourceId,
            template: category?.template
          }
        })
        this.smtpItems = smtpSettingsData.results.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId }
        })
      })
    },
    callForCategories() {
      return getTemplateTypes()
    },
    callForSmtpSettings() {
      return searchSmtpSettings(this.smtpAxiosPayload)
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeOverlay')
      } else {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeOverlay')
          }
        })
      }
    },
    callForMergedTags(resourceId = '') {
      getMergedTags(resourceId).then((response) => {
        this.blockManagerComponents[resourceId] = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents[resourceId])
      })
    },
    getTagsComponent(item) {
      if (item === '{FULLNAME}') return fullName
      if (item === '{FIRSTNAME}') return firstName
      if (item === '{LASTNAME}') return lastName
      if (item === '{USERNAME}') return userName
      if (item === '{PASSWORDURL}') return passwordURL
      if (item === '{POSTDATE}') return postDate
      if (item === '{EMAIL}') return email
      if (item === '{SHAREUSERNAME}') return shareUserName
      if (item === '{COMPANYNAME}') return companyName
      if (item === '{COMMUNITYNAME}') return communityName
      if (item === '{COMMUNITYDESCRIPTION}') return communityDescription
      if (item === '{POSTTITLE}') return postTitle
      if (item === '{POSTDESC}') return postDesc
      if (item === '{POSTUSERNAME}') return postUserName
      if (item === '{POSTCOMPANYNAME}') return postCompanyName
      if (item === '{WEBURL}') return webUrl
      if (item === '{POSTURL}') return postUrl
      if (item === '{CURRENTDATE}') return currentDate
      if (item === '{DESCRIPTION}') return description
      if (item === '{SHARECOMPANYNAME}') return shareCompanyName
      if (item === '{MESSAGE}') return message
      if (item === '{LINK}') return link
      if (item === '{COMMUNITYTITLE}') return communityTitle
      if (item === '{COMMUNITYUSER}') return communityUser
      if (item === '{CATEGORY}') return category
      if (item === '{COMMUNITYDESC}') return communityDesc
      if (item === '{STATUS}') return status
      if (item === '{ACTIVEUSERS}') return activeUsers
      if (item === '{ANALYSEDEMAIL}') return analysedEmail
      if (item === '{FOUNDEMAILCOUNT}') return foundEmailCount
      if (item === '{STARTEDBY}') return startedBy
      if (item === '{STARTDATE}') return startDate
      if (item === '{INVESTIGATIONNAME}') return investigationName
      if (item === '{INVITEDUSERNAME}') return invitedUserName
      if (item === '{INVITEDBYCOMPANYNAME}') return invitedByCompanyName
      if (item === '{COMMUNITYURL}') return communityUrl
      if (item === '{MEMBERCOUNT}') return memberCount
      if (item === '{FROMEMAIL}') return fromEmail
      if (item === '{FROMNAME}') return fromName
      if (item === '{COMMUNITYINDUSTRY}') return communityIndustry
      if (item === '{ANALYSISEMAIL}') return analysisEmail
      if (item === '{OWNER}') return owner
      if (item === '{DATE}') return date
      if (item === '{REPORTBY}') return reportBy
      if (item === '{FROM}') return fromText
      if (item === '{TO}') return to
      if (item === '{SUBJECT}') return subject
      if (item === '{ATTACHMENT}') return attachment
      if (item === '{CREATEDATE}') return createDate
      if (item === '{SENDERIP}') return senderIP
      if (item === '{CASEID}') return caseID
      if (item === '{USEREMAIL}') return userEmail
      if (item === '{USERAGENT}') return userAgent
      if (item === '{ACTIONDATE}') return actionDate
      if (item === '{ACTIONIP}') return actionIP
      if (item === '{PRODUCTNAME}') return productName
      if (item === '{ANALYSISDETAILURL}') return analysisDetailUrl
      if (item === '{INVESTIGATIONURL}') return investigationUrl
      if (item === '{COMPANYLOGO}') return companyLogo
      if (item === '{TRAININGNAME}') return trainingName
      if (item === '{TRAININGDESCRIPTION}') return trainingDescription
      if (item === '{TRAININGURL}') return trainingUrl
      if (item === '{TRAININGLANGUAGESELECTION}') return trainingLanguageSelection
      if (item === '{DATEEMAILSENT}') return dateEmailSent
      if (item === '{TRAININGENROLLDATE}') return trainingEnrollDate
      if (item === '{TRAININGREMINDERCOUNT}') return trainingReminderCount
      if (item === '{TRAININGCOMPLETEDATE}') return trainingCompleteDate
      if (item === '{TRAININGCOVERIMAGEURL}') return trainingCoverImageUrl
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    handleCategoryChange(resourceId = '') {
      const categoryIndex = this.categoryItems.findIndex((item) => item.value === resourceId)
      if (categoryIndex !== -1) {
        this.formValues.template = this.categoryItems[categoryIndex].template
      }
      if (!this.blockManagerComponents.hasOwnProperty(resourceId)) {
        this.callForMergedTags(resourceId)
      } else {
        this.setActiveBlockManagerComponents(this.blockManagerComponents[resourceId])
      }
    },
    submit() {
      const { refForm, refMakeAvailableFor } = this.$refs
      let isValid = true
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }

      if (refForm.validate() && isValid) {
        this.saveDisable = true
        const payload = {
          ...this.formValues,
          tags: this.formValues.tags.filter((item) => item.length > 0),
          availableForRequests: refMakeAvailableFor.getAvailableForValues(
            this.formValues.availableForRequests
          )
        }

        if (
          document.querySelectorAll('[data-title="Company Logo"]') &&
          document.querySelectorAll('[data-title="Company Logo"]').length
        ) {
          for (
            let i = document.querySelectorAll('[data-title="Company Logo"]').length - 1;
            i >= 0;
            i--
          ) {
            document.querySelectorAll('[data-title="Company Logo"]')[i].src = '{COMPANYLOGO}'
          }
        }

        if (this.selectedItem && this.selectedItem.resourceId && !this.isDuplicate) {
          updateEmailTemplate(this.selectedItem.resourceId, payload)
            .then(() => {
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => (this.saveDisable = false))
        } else {
          createEmailTemplate(payload)
            .then(() => {
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => {
              this.saveDisable = false
            })
        }
      } else {
        this.$nextTick(() => {
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    }
  }
}
</script>
