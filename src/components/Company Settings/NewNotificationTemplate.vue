<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getModalTitle"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
    :id="selectedItem ? 'edit-notification-template-modal' : 'new-notification-template-modal'"
    confirm-button-id="btn-save--notification-template-modal"
    cancel-button-id="btn-cancel--notification-template-modal"
    title-id="text--notification-template-modal-title"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name" has-hint>
          <v-text-field
            v-model.trim="formValues.name"
            v-bind="commonRules"
            id="input--notification-template-name"
            placeholder="Enter template name"
            outlined
            dense
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
            dense
            :disabled="!!selectedItem || editItemsDisabled"
            outlined
            placeholder="Select Option"
            @change="changeTemplateType"
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
        <make-available-for
          v-if="isRenderMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
        />
        <form-group title="Email Template" class-name="email-template mt-2" onsubmit="return false">
          <email-template
            ref="refEmailTemplate"
            :active-block-manager-components="activeBlockManagerComponents"
            :edit-items-disabled="editItemsDisabled"
            :from-address.sync="formValues.fromAddress"
            :from-name.sync="formValues.fromName"
            :subject.sync="formValues.subject"
            :template.sync="formValues.template"
            :is-edit="!!selectedItem"
            @handleEditHtmlTemplate="formValues.template = $event"
            v-if="!reRender"
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
import { scrollToComponent } from '@/utils/functions'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
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

export default {
  name: 'NewNotificationTemplate',
  components: {
    MakeAvailableFor,
    KSelect,
    EmailTemplate,
    AppModal,
    AppModalBodyHeader,
    FormGroup
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object
    },
    editItemsDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reRender: false,
      labels,
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
      formValues: {
        availableForRequests: [],
        name: '',
        emailTemplateCategoryResourceId: '',
        smtpSettingResourceId: '',
        fromAddress: '',
        fromName: '',
        subject: '',
        template: null
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
    getModalTitle() {
      return this.selectedItem ? labels.EditNotificationTemplate : labels.NewNotificationTemplate
    },
    getBodyTitle() {
      return this.selectedItem
        ? labels.EditNewNotificationTemplate
        : labels.CreateNewNotificationTemplate
    },
    getBodySubtitle() {
      return this.selectedItem
        ? labels.EditNotificationTemplateSubtitle
        : labels.NewNotificationTemplateSubtitle
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
    this.callForDatas()
    if (this.selectedItem && this.selectedItem.resourceId) {
      getEmailTemplate(this.selectedItem.resourceId).then((response) => {
        const logoKey = '{COMPANYLOGO}'
        const logoUrl = this.$store.state.dashboard.selectedCompanyObject.logoUrl
        const {
          data: { data }
        } = response
        for (let [key, value] of Object.entries(data)) {
          if (key === 'availableForList') {
            this.formValues['availableForRequests'] = getAvailableForListFromBackend(value)
            this.nonEditableAvailableForRequests = getAvailableForListFromBackend(value)
            continue
          }
          if (key === 'template') {
            value = response.data.data.template.replaceAll(logoKey, logoUrl)
          }
          this.formValues[key] = value
        }
      })
    }
  },
  mounted() {
    let _this = this
    this.$nextTick(() => {
      _this.formValues.template = _this.$refs.refEmailTemplate.$refs.refPreview.outerHTML
    })
  },
  methods: {
    changeTemplateType(resId) {
      let htmlTemplate = this.categoryItems.find((item) => item.value === resId)?.template
      const logoKey = '{COMPANYLOGO}'
      const logoUrl = this.$store.state.dashboard.selectedCompanyObject.logoUrl
      this.formValues.template = htmlTemplate.replaceAll(logoKey, logoUrl)
      this.reRender = true
      setTimeout(() => {
        this.reRender = false
      }, 1)
    },
    callForDatas() {
      Promise.all([this.callForCategories(), this.callForSmtpSettings()]).then((response) => {
        const [categories, smtpSettings] = response
        const {
          data: { data: categoriesData }
        } = categories
        const { data: { data: smtpSettingsData = {} } = {} } = smtpSettings
        this.categoryItems = categoriesData.map((category) => {
          return { text: category.name, value: category.resourceId, template: category?.template }
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
      this.$emit('closeOverlay')
    },
    callForMergedTags(resourceId = '') {
      getMergedTags(resourceId).then((response) => {
        this.blockManagerComponents[resourceId] = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents[resourceId])
      })
    },
    getTagsComponent(item) {
      switch (item) {
        case '{FULLNAME}':
          return fullName
        case '{USERNAME}':
          return userName
        case '{PASSWORDURL}':
          return passwordURL
        case '{POSTDATE}':
          return postDate
        case '{SHAREUSERNAME}':
          return shareUserName
        case '{COMPANYNAME}':
          return companyName
        case '{COMMUNITYNAME}':
          return communityName
        case '{COMMUNITYDESCRIPTION}':
          return communityDescription
        case '{POSTTITLE}':
          return postTitle
        case '{POSTDESC}':
          return postDesc
        case '{POSTUSERNAME}':
          return postUserName
        case '{POSTCOMPANYNAME}':
          return postCompanyName
        case '{WEBURL}':
          return webUrl
        case '{POSTURL}':
          return postUrl
        case '{CURRENTDATE}':
          return currentDate
        case '{DESCRIPTION}':
          return description
        case '{SHARECOMPANYNAME}':
          return shareCompanyName
        case '{MESSAGE}':
          return message
        case '{LINK}':
          return link
        case '{COMMUNITYTITLE}':
          return communityTitle
        case '{COMMUNITYUSER}':
          return communityUser
        case '{CATEGORY}':
          return category
        case '{COMMUNITYDESC}':
          return communityDesc
        case '{STATUS}':
          return status
        case '{ACTIVEUSERS}':
          return activeUsers
        case '{ANALYSEDEMAIL}':
          return analysedEmail
        case '{FOUNDEMAILCOUNT}':
          return foundEmailCount
        case '{STARTEDBY}':
          return startedBy
        case '{STARTDATE}':
          return startDate
        case '{INVESTIGATIONNAME}':
          return investigationName
        case '{INVITEDUSERNAME}':
          return invitedUserName
        case '{INVITEDBYCOMPANYNAME}':
          return invitedByCompanyName
        case '{COMMUNITYURL}':
          return communityUrl
        case '{MEMBERCOUNT}':
          return memberCount
        case '{COMMUNITYINDUSTRY}':
          return communityIndustry
        case '{ANALYSISEMAIL}':
          return analysisEmail
        case '{OWNER}':
          return owner
        case '{DATE}':
          return date
        case '{REPORTBY}':
          return reportBy
        case '{FROM}':
          return fromText
        case '{TO}':
          return to
        case '{SUBJECT}':
          return subject
        case '{ATTACHMENT}':
          return attachment
        case '{CREATEDATE}':
          return createDate
        case '{SENDERIP}':
          return senderIP
        case '{CASEID}':
          return caseID
        case '{USEREMAIL}':
          return userEmail
        case '{USERAGENT}':
          return userAgent
        case '{ACTIONDATE}':
          return actionDate
        case '{ACTIONIP}':
          return actionIP
        case '{PRODUCTNAME}':
          return productName
        case '{ANALYSISDETAILURL}':
          return analysisDetailUrl
        case '{INVESTIGATIONURL}':
          return investigationUrl
        case '{COMPANYLOGO}':
          return companyLogo

        default:
          break
      }
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    handleCategoryChange(resourceId = '') {
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

        payload.template = document.getElementsByClassName('email-template-preview')[0].innerHTML
        if (this.selectedItem && this.selectedItem.resourceId) {
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

<style></style>
