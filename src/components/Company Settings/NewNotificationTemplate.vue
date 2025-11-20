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
    <template #overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            v-bind="commonRules"
            id="input--notification-template-name"
            initialPlaceholder="Enter template name"
            entityName="Template Name"
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
        <form-group
          :title="labels.EmailDelivery"
          sub-title="Select email delivery configuration for this Notification Template"
          has-hint
        >
          <KSelect
            v-if="isAwarenessEducatorTemplateSelected"
            v-bind="emailDeliveryProps"
            v-model.trim="emailDelivery"
            id="input--company-manager-advanced-settings-smtp"
            class="new-integration__select"
            dense
            outlined
            item-text="name"
            placeholder="Select configuration"
            no-data-text="No Email Delivery configuration available"
            return-object
            :items="emailDeliveryItems"
            :slots="{ item: true, selection: false }"
            @change="handleChangeEmailDelivery"
          >
            <template #item="{ item }">
              <v-list-item-content :disabled="item.disabled">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.description" class="tlp_subtitle">{{
                  item.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </KSelect>
          <KSelect
            v-else
            v-bind="emailDeliveryProps"
            v-model.trim="formValues.smtpSettingResourceId"
            id="input--company-manager-advanced-settings-smtp"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select configuration"
            no-data-text="No Email Delivery configuration available"
            :items="smtpItems"
          />
        </form-group>
        <FormGroup v-if="canRenderAlertBox">
          <AlertBox
            style="margin-top: -20px;"
            class="bg-aqua-light mb-4"
            icon-color="#2196F3"
            icon-name="mdi-information"
            text="If a DEC configuration exists for both the reseller and its sub-companies, you can conduct an email phishing simulation using the respective company's DEC configuration. In the absence of a specific configuration, the system will send the simulation via SMTP using the relevant company's default SMTP settings as a fallback."
            :slots="{ primaryAction: false, secondaryAction: false }"
          />
        </FormGroup>
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
          <EmailTemplate
            v-else
            ref="refEmailTemplate"
            class="email-template-languages-settings-template-preview-container"
            :active-block-manager-components="activeBlockManagerComponents"
            :edit-items-disabled="editItemsDisabled"
            :from-address.sync="getSelectedLanguagePayload.fromAddress"
            :from-name.sync="getSelectedLanguagePayload.fromName"
            :subject.sync="getSelectedLanguagePayload.subject"
            :template.sync="getSelectedLanguagePayload.template"
            :is-edit="!!selectedItem"
            :is-phishing-template="true"
            :isEnrollmentCategorySelected="isEnrollmentCategorySelected"
            :isLearningPathEnrollmentSelected="isLearningPathEnrollmentSelected"
            :isNotificationTemplate="true"
            :is-notification-enrollment="isSelectedNotificationEnrollment"
            :cc-addresses.sync="getSelectedLanguagePayload.ccAddresses"
            @handleEditHtmlTemplate="handleEditHtmlTemplate"
          >
            <!-- YENI: Language Preview (Seç) -->
            <template #template-header-left>
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
            </template>

            <template #template-header-right>
              <InputLanguagesSettings
                v-model="selectedLanguages"
                :active-language="activeLanguage"
                :can-remove-languages="formValues.canRemoveLanguages"
                :initial-disabled-language-ids="initialDisabledLanguageIds"
                :language-items="groupedLanguageItems"
                :translated-language-resource-ids="translatedLanguageResourceIds"
                :from-address="getSelectedLanguagePayload.fromAddress"
                :from-name="getSelectedLanguagePayload.fromName"
                :subject="getSelectedLanguagePayload.subject"
                :is-from-address-valid="isFromAddressFieldValid"
                :company-preferred-language-id="getCompanyPreferredLanguageId"
                :is-notification-template="true"
                @input="handleSelectedLanguagesChange"
                @on-active-language-change="handleActiveLanguageChange"
                @on-relocalize-replace="handleRelocalizeReplace"
                @on-language-removed="handleLanguageRemoved"
                @on-edit-mode="handleEditModeClick"
              />
            </template>
          </EmailTemplate>
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
import InputLanguagesSettings from '@/components/Common/Inputs/InputLanguagesSettings.vue'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import {
  createEmailTemplate,
  getEmailTemplate,
  getMergedTags,
  getTemplateTypes,
  updateEmailTemplate,
  getNotificationTemplatesDeliverySettings
} from '@/api/company'
import { searchSmtpSettings } from '@/api/smtpSettings'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputTag from '@/components/Common/Inputs/InputTag'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { MERGED_TEXTS_MAP } from '@/components/Company Settings/utils'
import { getDefaultEmailDeliverySetting } from '@/api/phishingsimulator'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { EMAIL_TEMPLATE_DETAIL_ACTION_TYPES } from '@/components/PhishingScenarios/utils'
import { mapGetters } from 'vuex'
import AlertBox from '@/components/AlertBox'
export default {
  name: 'NewNotificationTemplate',
  components: {
    DatatableLoading,
    InputTag,
    MakeAvailableFor,
    KSelect,
    InputLanguagesSettings,
    InputLanguagePreview,
    EmailTemplate,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputEntityName,
    AlertBox
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
    },
    languageItems: {
      type: Array,
      default: () => []
    },
    preferredLanguageTypes: {
      type: Array,
      default: () => []
    },
    companyLanguageTypeResourceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labels,
      emailDeliveryItems: [],
      loading: false,
      isSelectedNotificationEnrollment: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      saveDisable: this.editItemsDisabled,
      Validations: Validations,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v)
        ]
      },
      emailDeliveryProps: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      emailDelivery: null,
      initialFormValues: null,
      formValues: {
        availableForRequests: [],
        tags: [],
        name: '',
        emailTemplateCategoryResourceId: '',
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.SMTP,
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        fromAddress: '',
        fromName: '',
        subject: '',
        template: undefined,
        ccAddresses: [],
        canRemoveLanguages: true
      },
      // YENI: Language Management
      languagesPayload: [],
      editedLanguages: [],
      selectedLanguages: [],
      activeLanguage: '',
      initialDisabledLanguageIds: [],
      groupedLanguageItems: [],
      categoryItems: [],
      smtpItems: [],
      defaultDECSettingResourceId: null,
      defaultSMTPSettingResourceId: null,
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
    ...mapGetters({
      getUser: 'auth/userGetter'
    }),
    getCompanyName() {
      return (
        localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName') || ''
      )
    },
    canRenderAlertBox() {
      return (
        this.emailDelivery?.name === `First Use Company's DEC config then Fallback to default SMTP`
      )
    },
    isAwarenessEducatorTemplateSelected() {
      if (!this.formValues.emailTemplateCategoryResourceId) return false
      const selectedTemplateCategoryName =
        this.categoryItems?.find?.(
          (template) => template.value === this.formValues.emailTemplateCategoryResourceId
        )?.text || ''
      return [
        'Training Enrollment',
        'Survey Enrollment',
        'Survey Reminder',
        'Learning Path Enrollment Reminder',
        'Poster Enrollment',
        'Learning Path Enrollment',
        'Infographic Enrollment',
        'Enrollment after Failed in a Simulation',
        'Enrollment Reminder',
        'Certificate'
      ].includes(selectedTemplateCategoryName)
    },
    getEnrollmentTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Enrollment')?.value
    },
    getLearningPathEnrollmentTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Learning Path Enrollment')
        ?.value
    },
    getTrainingEnrollmentTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Training Enrollment')?.value
    },
    getPosterEnrollmentTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Poster Enrollment')?.value
    },
    getInfographicEnrollmentTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Infographic Enrollment')
        ?.value
    },
    getEnrollmentReminderTemplateResourceId() {
      return this.categoryItems?.find((template) => template.text === 'Enrollment Reminder')?.value
    },
    getEnrollmentAfterFailedInASimulationTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === 'Enrollment after Failed in a Simulation'
      )?.value
    },
    isEnrollmentCategorySelected() {
      if (!this.formValues?.emailTemplateCategoryResourceId) return false
      return [
        this.getEnrollmentTemplateResourceId,
        this.getEnrollmentReminderTemplateResourceId,
        this.getEnrollmentAfterFailedInASimulationTemplateResourceId,
        this.getTrainingEnrollmentTemplateResourceId,
        this.getLearningPathEnrollmentTemplateResourceId,
        this.getPosterEnrollmentTemplateResourceId,
        this.getInfographicEnrollmentTemplateResourceId
      ].includes(this.formValues.emailTemplateCategoryResourceId)
    },
    isLearningPathEnrollmentSelected() {
      return (
        this.formValues?.emailTemplateCategoryResourceId ===
        this.getLearningPathEnrollmentTemplateResourceId
      )
    },
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
    },
    // YENI: Language Management Computed
    translatedLanguageResourceIds() {
      return this.languagesPayload
        .filter((item) => item && item.isTranslated)
        .map((item) => item.languageTypeResourceId)
    },
    getSelectedLanguagePayload() {
      return (
        this.languagesPayload.find((item) => item.languageTypeResourceId === this.activeLanguage) ||
        {}
      )
    },
    isFromAddressFieldValid() {
      const v = (this.getSelectedLanguagePayload.fromAddress || '').trim()
      return this.Validations.email(v, '') === true
    },
    getCompanyPreferredLanguageId() {
      return this.formValues.languageTypeResourceId || ''
    }
  },
  watch: {
    languageItems: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.setLanguageItems()
        }
      }
    },
    'formValues.emailTemplateCategoryResourceId'(resourceId) {
      this.handleCategoryChange(resourceId)
    },
    selectedLanguages(val) {
      if (!val.length) {
        this.activeLanguage = ''
      } else if (this.activeLanguage) {
        const isInSelected = val.find((item) => item.value === this.activeLanguage)
        if (!isInSelected) {
          this.activeLanguage = val[0].value
        }
      } else {
        this.activeLanguage = val[0].value
      }
    }
  },
  created() {
    if (!this.selectedItem) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    this.callForCategories()
    this.callForNotificationTemplate()
    this.callForEmailDeliveries()
    this.callForSMTPSettings()
    this.callForDefaultEmailDeliverySetting()
  },
  mounted() {
    this.$watch(
      (vm) => [vm.formValues, vm.emailDeliveryItems],
      ([formValues, emailDeliveryItems]) => {
        if (!formValues || !emailDeliveryItems.length || !this.selectedItem) return
        if (formValues.emailDeliverySettingType === EMAIL_DELIVERY_TYPES.SMTP) {
          const selectedSMTPSettingIndex = emailDeliveryItems.findIndex(
            (item) => item.resourceId === formValues.smtpSettingResourceId
          )
          if (selectedSMTPSettingIndex === -1) return
          this.emailDelivery = emailDeliveryItems[selectedSMTPSettingIndex]
        } else {
          const selectedDECSettingIndex = emailDeliveryItems.findIndex(
            (item) => item.resourceId === formValues.directEmailSettingResourceId
          )
          if (selectedDECSettingIndex === -1) return
          this.emailDelivery = emailDeliveryItems[selectedDECSettingIndex]
        }
      },
      {
        deep: true
      }
    )
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForSMTPSettings() {
      searchSmtpSettings(this.smtpAxiosPayload).then((response) => {
        const { data: { data: smtpSettingsData = {} } = {} } = response
        this.smtpItems = smtpSettingsData.results.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId }
        })
      })
    },
    callForEmailDeliveries() {
      getNotificationTemplatesDeliverySettings().then((res) => {
        const {
          data: { data: { results = [] } = {} }
        } = res || {}
        const deliveries = []
        const smtpItems = results.filter((item) => item.type === EMAIL_DELIVERY_TYPES.SMTP)
        if (smtpItems.length) {
          deliveries.push({ header: 'SMTP' })
          deliveries.push(...smtpItems)
        }
        const directEmailItems = results.filter(
          (item) => item.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        )
        if (directEmailItems.length) {
          deliveries.push({ header: 'Direct Email Creation' })
          deliveries.push(...directEmailItems)
        }
        this.emailDeliveryItems = deliveries
      })
    },
    callForDefaultEmailDeliverySetting() {
      if (this.selectedItem) return
      getDefaultEmailDeliverySetting().then((res) => {
        if (res?.data?.data?.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL) {
          this.defaultDECSettingResourceId = res?.data?.data?.resourceId
        } else {
          this.defaultSMTPSettingResourceId = res?.data?.data?.resourceId
        }
      })
    },
    handleChangeEmailDelivery(delivery = {}) {
      if (delivery.type === EMAIL_DELIVERY_TYPES.SMTP) {
        this.formValues.smtpSettingResourceId = delivery.resourceId
        this.formValues.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP
        this.formValues.directEmailSettingResourceId = null
      } else {
        this.formValues.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        this.formValues.directEmailSettingResourceId = delivery.resourceId
        this.formValues.smtpSettingResourceId = null
      }
    },
    callForNotificationTemplate() {
      if (!this?.selectedItem?.resourceId) return
      this.loading = true
      getEmailTemplate(this.selectedItem.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response
          for (let [key, value] of Object.entries(data)) {
            if (key === 'availableForList') {
              this.formValues['availableForRequests'] = getAvailableForValueFromList(value)
              continue
            }
            this.formValues[key] = value
          }

          this.formValues.emailDeliverySettingType =
            response?.data?.data?.emailDeliveryType ||
            response?.data?.data?.emailDeliverySettingType ||
            EMAIL_DELIVERY_TYPES.SMTP
          if (this.isDuplicate) this.formValues.name = this.formValues.name + ' - COPY'
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isSelectedNotificationEnrollment = this.selectedItem.categoryName
            .toLowerCase()
            .includes('enrollment')

          // YENI: Initialize languages for edit mode
          this.languagesPayload.push({
            languageTypeResourceId: this.formValues.languageTypeResourceId,
            subject: this.formValues.subject,
            fromName: this.formValues.fromName,
            fromAddress: this.formValues.fromAddress,
            ccAddresses: this.formValues.ccAddresses || [],
            template: this.formValues.template,
            isTranslated: true
          })
          this.selectedLanguages.push({
            text: this.formValues.languageTypeName || '',
            value: this.formValues.languageTypeResourceId
          })
          if (response?.data?.data?.languages && response?.data?.data?.languages.length) {
            response?.data?.data?.languages.forEach((item) => {
              this.selectedLanguages.push({
                text: item.languageTypeName || '',
                value: item.languageTypeResourceId
              })
              this.languagesPayload.push({
                languageTypeResourceId: item.languageTypeResourceId,
                subject: item.subject,
                fromName: item.fromName,
                fromAddress: item.fromAddress,
                ccAddresses: item.ccAddresses || [],
                template: item.template,
                resourceId: item.resourceId,
                isTranslated: true
              })
            })
          }
          this.activeLanguage = this.formValues.languageTypeResourceId
          this.editedLanguages = JSON.parse(JSON.stringify(this.languagesPayload))
          this.initialDisabledLanguageIds = [
            this.formValues.languageTypeResourceId,
            ...this.languagesPayload
              .filter((item) => item.isTranslated)
              .map((item) => item.languageTypeResourceId)
          ]
        })
        .finally(() => {
          this.loading = false
        })
    },
    callForCategories() {
      getTemplateTypes().then((response) => {
        const {
          data: { data: categoriesData }
        } = response
        this.categoryItems = categoriesData.map((category) => {
          return {
            text: category.name,
            value: category.resourceId,
            template: category?.template
          }
        })
      })
    },
    setLanguageItems() {
      const languageTypes = this.languageItems || []
      const preferredLanguageTypes = this.preferredLanguageTypes || []
      const companyLanguageTypeResourceId = this.companyLanguageTypeResourceId || ''

      const grouped = []
      grouped.push({
        value: 1,
        text: 'Preferred Languages',
        children: preferredLanguageTypes
      })
      grouped.push({
        value: 5,
        text: 'All Languages',
        children: languageTypes.filter(
          (item) => !preferredLanguageTypes?.find((pItem) => pItem.value === item.value)
        )
      })
      this.groupedLanguageItems = grouped
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
      return MERGED_TEXTS_MAP[item]
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
        this.isSelectedNotificationEnrollment = this.categoryItems[categoryIndex].text
          .toLowerCase()
          .includes('enrollment')
        if (!this.isSelectedNotificationEnrollment) this.formValues.ccAddresses = []
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
        // Active language'dan formValues'i güncelle
        const activePayload = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === this.activeLanguage
        )
        if (activePayload) {
          this.formValues.subject = activePayload.subject
          this.formValues.fromName = activePayload.fromName
          this.formValues.fromAddress = activePayload.fromAddress
          this.formValues.ccAddresses = activePayload.ccAddresses || []
          this.formValues.template = activePayload.template
          this.formValues.languageTypeResourceId = activePayload.languageTypeResourceId
        }

        let languagesPayload = this.languagesPayload.filter(
          (lang) => lang.languageTypeResourceId !== this.formValues.languageTypeResourceId
        )

        // Edit modundaysa detailActionType'ları set et
        if (this.selectedItem && !this.isDuplicate) {
          this.editedLanguages.forEach((item) => {
            const payloadLanguage = languagesPayload.find(
              (language) => language.languageTypeResourceId === item.languageTypeResourceId
            )
            if (payloadLanguage) {
              const isEqual = JSON.stringify(item) === JSON.stringify(payloadLanguage)
              payloadLanguage.detailActionType = isEqual
                ? EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.NO_CHANGE
                : EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.EDIT
            } else {
              // Silinen diller
              languagesPayload.push({
                ...item,
                detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.DELETE
              })
            }
          })
        }

        // Boş alanları preferred language'dan doldur
        languagesPayload = this.setEmptyLanguagesPayload(languagesPayload)

        const payload = {
          ...this.formValues,
          tags: this.formValues.tags.filter((item) => item.length > 0),
          availableForRequests: refMakeAvailableFor.getAvailableForValues(
            this.formValues.availableForRequests
          ),
          languages: languagesPayload
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
    },
    handleEditHtmlTemplate(template = '') {
      this.formValues.template = template
    },
    // YENI: Language Management Methods
    handleSelectedLanguagesChange(languages) {
      this.languagesPayload = languages.map((language) => {
        const item = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === language.value
        )
        if (item) return item
        return {
          languageTypeResourceId: language.value,
          subject: this.getSelectedLanguagePayload.subject,
          fromName: this.getSelectedLanguagePayload.fromName,
          fromAddress: this.getSelectedLanguagePayload.fromAddress,
          ccAddresses: this.getSelectedLanguagePayload.ccAddresses || [],
          template: this.formValues.template,
          detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD,
          isTranslated: false
        }
      })
    },
    handleActiveLanguageChange(value) {
      this.activeLanguage = value
    },
    handleRelocalizeReplace({ language }) {
      // Emit event for localization/re-localization of the language
      this.$emit('relocalize-language', {
        languageId: language.value,
        languageName: language.text
      })
    },
    handleLanguageRemoved({ languageName }) {
      // Show notification that language was removed
      this.$store.dispatch('common/showSuccessSnackBar', {
        message: `${languageName} language has been removed.`
      })
    },
    handleEditModeClick() {
      this.$refs.refEmailTemplate.toggleShowGrapesModal()
    },
    setEmptyLanguagesPayload(languages) {
      const preferredLanguagePayload = this.getPreferredLanguagePayload()
      return languages.map((item) => {
        return {
          ...item,
          fromName: item.fromName || preferredLanguagePayload.fromName,
          fromAddress: item.fromAddress || preferredLanguagePayload.fromAddress,
          subject: item.subject || preferredLanguagePayload.subject,
          template: item.template || preferredLanguagePayload.template,
          ccAddresses: item.ccAddresses && item.ccAddresses.length
            ? item.ccAddresses
            : preferredLanguagePayload.ccAddresses
        }
      })
    },
    getPreferredLanguagePayload() {
      // Önce company'nin preferred language'ını bul
      let preferredLanguagePayload = this.languagesPayload.find(
        (item) => item.languageTypeResourceId === this.companyLanguageTypeResourceId
      )
      if (preferredLanguagePayload?.fromName && preferredLanguagePayload?.fromAddress)
        return preferredLanguagePayload

      // Yoksa fromName ve fromAddress dolu olan ilk dili bul
      preferredLanguagePayload = this.languagesPayload.find(
        (item) => item?.fromName && item?.fromAddress
      )
      return preferredLanguagePayload || this.languagesPayload[0]
    }
  }
}
</script>
