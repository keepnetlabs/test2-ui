<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getModalTitle"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name" has-hint>
          <v-text-field
            v-bind="commonRules"
            v-model.trim="formValues.name"
            placeholder="Enter template name"
            outlined
            dense
          />
        </form-group>
        <form-group title="Category" has-hint>
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.emailTemplateCategoryResourceId"
            :items="categoryItems"
            class="new-integration__select"
            dense
            :disabled="!!selectedItem"
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <form-group title="SMTP" has-hint>
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.smtpSettingResourceId"
            :items="smtpItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <make-available-for
          v-if="isRenderMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
          :disabled="!showMakeAvailableFor"
        />
        <form-group title="Email Template" class-name="email-template mt-2">
          <email-template
            ref="refEmailTemplate"
            :active-block-manager-components="activeBlockManagerComponents"
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
  getCategories,
  getEmailTemplate,
  getMergedTags,
  updateEmailTemplate
} from '@/api/company'
import { searchSmtpSettings } from '@/api/smtpSettings'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'
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
import communityDescription from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityDescription'
import analysisEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysisEmail'
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
    }
  },
  data() {
    return {
      labels,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      nonEditableAvailableForRequests: [],
      saveDisable: false,
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
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    },
    isRenderMakeAvailableFor() {
      if (this.$store.state.auth.userRoleName === 'CompanyAdmin') {
        return !!this.selectedItem
      }
      return true
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
        const {
          data: { data }
        } = response
        for (let [key, value] of Object.entries(data)) {
          if (key === 'availableForList') {
            this.formValues['availableForRequests'] = getAvailableForListFromBackend(value)
            this.nonEditableAvailableForRequests = getAvailableForListFromBackend(value)
            continue
          }
          this.formValues[key] = value
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.formValues.template = this.$refs.refEmailTemplate.$refs.refPreview.outerHTML
    })
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
          return { text: category.name, value: category.resourceId }
        })
        this.smtpItems = smtpSettingsData.results.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId }
        })
      })
    },
    callForCategories() {
      return getCategories()
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
        console.log("response.data.data['mergeTags']", response.data.data['mergeTags'])
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
        case '{COMMUNITYDESCRIPTION}':
          return communityDescription
        case '{ANALYSISEMAIL}':
          return analysisEmail

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
        const { companyName, selectedCompanyName } = this.$store.state.auth
        this.saveDisable = true
        const payload = {
          ...this.formValues,
          availableForRequests: this.showMakeAvailableFor
            ? refMakeAvailableFor.getAvailableForValues(this.formValues.availableForRequests)
            : companyName === selectedCompanyName
            ? getAvailableForValues(this.nonEditableAvailableForRequests)
            : null
        }
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
