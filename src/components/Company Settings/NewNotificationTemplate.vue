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
      <EditLanguagesLeavingDialog
        v-if="showEditLanguagesLeavingDialog"
        :status="showEditLanguagesLeavingDialog"
        :before-save-language="beforeSaveLanguage"
        @on-close="handleCloseEditLanguagesLeavingDialog"
        @on-discard="handleDiscardEditLanguagesLeavingDialog"
        @on-confirm="handleConfirmEditLanguagesLeavingDialog"
      />
      <app-modal-body-header
        :title="getBodyTitle"
        :sub-title="getBodySubtitle"
      />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            v-bind="commonRules"
            id="input--notification-template-name-new"
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
            :disabled="getIsTemplateTypeDisabled"
            outlined
            :placeholder="
              formValues.emailTemplateCategoryResourceId ? '' : 'Select Option'
            "
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
            id="input--notification-template-email-delivery-awareness"
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
                <v-list-item-subtitle
                  v-if="item.description"
                  class="tlp_subtitle"
                  >{{ item.description }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </template>
          </KSelect>
          <KSelect
            v-else
            v-bind="emailDeliveryProps"
            v-model.trim="formValues.smtpSettingResourceId"
            id="input--notification-template-email-delivery-smtp"
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
        <form-group
          title="Tags"
          sub-title="Define tags for the notification template"
        >
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
        <form-group class-name="email-template mt-2" onsubmit="return false">
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
            :is-notification-template="true"
            :is-notification-enrollment="isSelectedNotificationEnrollment"
            :cc-addresses.sync="getSelectedLanguagePayload.ccAddresses"
            @handleEditHtmlTemplate="handleEditHtmlTemplate"
            @handleInitialTemplate="handleInitialTemplate"
            @on-save-template="handleSaveTemplate"
            @on-generate-email-template-success="
              handleGenerateEmailTemplateSuccess
            "
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
                :is-generate-with-a-i-disabled="getIsGenerateWithAIDisabled"
                :is-template-type-selected="
                  !!formValues.emailTemplateCategoryResourceId
                "
                :can-remove-languages="formValues.canRemoveLanguages"
                :initial-disabled-language-ids="initialDisabledLanguageIds"
                :language-items="groupedLanguageItems"
                :translated-language-resource-ids="
                  translatedLanguageResourceIds
                "
                :from-address="getSelectedLanguagePayload.fromAddress"
                :from-name="getSelectedLanguagePayload.fromName"
                :subject="getSelectedLanguagePayload.subject"
                :is-from-address-valid="isFromAddressFieldValid"
                :company-preferred-language-id="getCompanyPreferredLanguageId"
                :is-notification-template="true"
                @input="handleSelectedLanguagesChange"
                @on-active-language-change="handleActiveLanguageChange"
                @on-generate-with-ai="handleGenerateWithAI"
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
import AppModal from "@/components/AppModal";
import AppModalBodyHeader from "@/components/SmallComponents/AppModalBodyHeader";
import FormGroup from "@/components/SmallComponents/FormGroup";
import { mail } from "@/utils/validations";
import EmailTemplate from "@/components/Company Settings/EmailTemplate";
import KSelect from "@/components/Common/Inputs/KSelect";
import InputLanguagesSettings from "@/components/Common/Inputs/InputLanguagesSettings.vue";
import InputLanguagePreview from "@/components/Common/Inputs/InputLanguagePreview.vue";
import EditLanguagesLeavingDialog from "@/components/PhishingScenarios/EditLanguagesLeavingDialog.vue";
import {
  createEmailTemplate,
  getEmailTemplate,
  getMergedTags,
  getTemplateTypes,
  updateEmailTemplate,
  getNotificationTemplatesDeliverySettings,
  generateNotificationTemplateTranslation,
  getNotificationTemplateTranslation
} from "@/api/company";
import { searchSmtpSettings } from "@/api/smtpSettings";
import MakeAvailableFor from "@/components/Common/MakeAvailableFor/MakeAvailableFor";
import * as Validations from "@/utils/validations";
import labels from "@/model/constants/labels";
import { scrollToComponent, isDifferent } from "@/utils/functions";
import { getAvailableForValueFromList } from "@/utils/helperFunctions";
import InputEntityName from "@/components/Common/Inputs/InputEntityName";
import InputTag from "@/components/Common/Inputs/InputTag";
import DatatableLoading from "@/components/SkeletonLoading/WidgetLoading";
import {
  scrollToEmailTemplateContent,
  MERGED_TEXTS_MAP
} from "@/components/Company Settings/utils";
import { getDefaultEmailDeliverySetting } from "@/api/phishingsimulator";
import { EMAIL_DELIVERY_TYPES } from "@/components/CampaignManager/AdvancedSettings/utils";
import { EMAIL_TEMPLATE_DETAIL_ACTION_TYPES } from "@/components/PhishingScenarios/utils";
import { mapGetters } from "vuex";
import AlertBox from "@/components/AlertBox";
import { COMMON_CONSTANTS } from "@/model/constants/commonConstants";
export default {
  name: "NewNotificationTemplate",
  components: {
    DatatableLoading,
    InputTag,
    MakeAvailableFor,
    KSelect,
    InputLanguagesSettings,
    InputLanguagePreview,
    EditLanguagesLeavingDialog,
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
      default: ""
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
        hint: "*Required",
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v)
        ]
      },
      emailDeliveryProps: {
        hint: "*Required",
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      emailDelivery: null,
      initialFormValues: {},
      formValues: {
        availableForRequests: [],
        tags: [],
        name: "",
        emailTemplateCategoryResourceId: "",
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.SMTP,
        smtpSettingResourceId: "",
        directEmailSettingResourceId: "",
        fromAddress: "",
        fromName: "",
        subject: "",
        template: undefined,
        ccAddresses: [],
        canRemoveLanguages: true
      },
      // YENI: Language Management
      languagesPayload: [],
      editedLanguages: [],
      selectedLanguages: [],
      activeLanguage: "",
      initialDisabledLanguageIds: [],
      groupedLanguageItems: [],
      categoryItems: [],
      isEverythingLocalized: true,
      timeoutId: null,
      isRelocalizeOperation: false,
      relocalizeLanguageName: "",
      isGenerateWithAIDisabled: false,
      isEmailGenerating: false,
      selectedLanguagePayloadItemBeforeSave: null,
      showEditLanguagesLeavingDialog: false,
      beforeSaveLanguage: "",
      isDefault: false,
      smtpItems: [],
      defaultDECSettingResourceId: null,
      defaultSMTPSettingResourceId: null,
      validations: {
        mail
      },
      smtpAxiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: "CreateTime",
        ascending: false,
        filter: {
          Condition: "AND",
          FilterGroups: [
            {
              Condition: "AND",
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      getUser: "auth/userGetter"
    }),
    getCompanyName() {
      return (
        localStorage.getItem("selectedCompanyName") ||
        localStorage.getItem("companyName") ||
        ""
      );
    },
    canRenderAlertBox() {
      return (
        this.emailDelivery?.name ===
        `First Use Company's DEC config then Fallback to default SMTP`
      );
    },
    isAwarenessEducatorTemplateSelected() {
      if (!this.formValues.emailTemplateCategoryResourceId) return false;
      const selectedTemplateCategoryName =
        this.categoryItems?.find?.(
          (template) =>
            template.value === this.formValues.emailTemplateCategoryResourceId
        )?.text || "";
      return [
        "Training Enrollment",
        "Survey Enrollment",
        "Survey Reminder",
        "Learning Path Enrollment Reminder",
        "Poster Enrollment",
        "Learning Path Enrollment",
        "Infographic Enrollment",
        "Enrollment after Failed in a Simulation",
        "Enrollment Reminder",
        "Certificate",
        "Suspicious Email Analysis Report",
        "Suspicious Email Analysis Report Update",
        "Investigation Started",
        "Investigation Expired",
        "Investigation Finished",
        "Security Growth Login"
      ].includes(selectedTemplateCategoryName);
    },
    getEnrollmentTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Enrollment"
      )?.value;
    },
    getLearningPathEnrollmentTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Learning Path Enrollment"
      )?.value;
    },
    getTrainingEnrollmentTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Training Enrollment"
      )?.value;
    },
    getPosterEnrollmentTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Poster Enrollment"
      )?.value;
    },
    getInfographicEnrollmentTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Infographic Enrollment"
      )?.value;
    },
    getEnrollmentReminderTemplateResourceId() {
      return this.categoryItems?.find(
        (template) => template.text === "Enrollment Reminder"
      )?.value;
    },
    getEnrollmentAfterFailedInASimulationTemplateResourceId() {
      return this.categoryItems?.find(
        (template) =>
          template.text === "Enrollment after Failed in a Simulation"
      )?.value;
    },
    isEnrollmentCategorySelected() {
      if (!this.formValues?.emailTemplateCategoryResourceId) return false;
      return [
        this.getEnrollmentTemplateResourceId,
        this.getEnrollmentReminderTemplateResourceId,
        this.getEnrollmentAfterFailedInASimulationTemplateResourceId,
        this.getTrainingEnrollmentTemplateResourceId,
        this.getLearningPathEnrollmentTemplateResourceId,
        this.getPosterEnrollmentTemplateResourceId,
        this.getInfographicEnrollmentTemplateResourceId
      ].includes(this.formValues.emailTemplateCategoryResourceId);
    },
    isLearningPathEnrollmentSelected() {
      return (
        this.formValues?.emailTemplateCategoryResourceId ===
        this.getLearningPathEnrollmentTemplateResourceId
      );
    },
    getModalId() {
      return this.selectedItem
        ? this.getSelectedItemTitleId
        : "new-notification-template-modal";
    },
    getSelectedItemTitleId() {
      return this.isDuplicate
        ? "duplicate-notification-template-modal"
        : "edit-notification-template-modal";
    },
    getModalTitle() {
      return this.selectedItem
        ? this.getSelectedItemModalTitle
        : labels.NewNotificationTemplate;
    },
    getSelectedItemModalTitle() {
      return this.isDuplicate
        ? labels.DuplicateNotificationTemplate
        : labels.EditNotificationTemplate;
    },
    getBodyTitle() {
      return this.selectedItem
        ? this.getSelectedItemModalTitle
        : labels.CreateNewNotificationTemplate;
    },
    getBodySubtitle() {
      return this.selectedItem
        ? this.getSelectedItemBodySubtitle
        : labels.NewNotificationTemplateSubtitle;
    },
    getSelectedItemBodySubtitle() {
      return this.isDuplicate
        ? labels.DuplicateNotificationTemplateSubtitle
        : labels.EditNotificationTemplateSubtitle;
    },
    isRenderMakeAvailableFor() {
      return !this.editItemsDisabled;
    },
    // YENI: Language Management Computed
    translatedLanguageResourceIds() {
      return this.languagesPayload
        .filter((item) => item && item.isTranslated)
        .map((item) => item.languageTypeResourceId);
    },
    getSelectedLanguagePayload() {
      return (
        this.languagesPayload.find(
          (item) => item.languageTypeResourceId === this.activeLanguage
        ) || {}
      );
    },
    isFromAddressFieldValid() {
      const v = (this.getSelectedLanguagePayload.fromAddress || "").trim();
      return this.Validations.email(v, "") === true;
    },
    getCompanyPreferredLanguageId() {
      return this.formValues.languageTypeResourceId || "";
    },
    getIsGenerateWithAIDisabled() {
      // Disable if template type is not selected
      const templateType = this.formValues.emailTemplateCategoryResourceId;
      if (
        !templateType ||
        templateType === "" ||
        templateType === null ||
        templateType === undefined
      ) {
        return true;
      }
      return this.isGenerateWithAIDisabled;
    },
    getIsTemplateTypeDisabled() {
      // Disable if editing or disabled by parent
      if (!!this.selectedItem || this.editItemsDisabled) {
        return true;
      }
      // Create mode'da, categories yüklenene kadar disable
      if (!this.selectedItem && this.categoryItems.length === 0) {
        return true;
      }
      // Disable if AI is generating
      if (this.isGenerateWithAIDisabled || this.isEmailGenerating) {
        return true;
      }
      return false;
    }
  },
  watch: {
    languageItems: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.setLanguageItems();
        }
      }
    },
    "formValues.emailTemplateCategoryResourceId"(resourceId) {
      this.handleCategoryChange(resourceId);
    },
    selectedLanguages(val) {
      if (!val.length) {
        this.activeLanguage = "";
      } else if (this.activeLanguage) {
        const isInSelected = val.find(
          (item) => item.value === this.activeLanguage
        );
        if (!isInSelected) {
          this.activeLanguage = val[0].value;
          this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
            JSON.stringify(this.getSelectedLanguagePayload)
          );
        }
      } else {
        this.activeLanguage = val[0].value;
      }
    }
  },
  created() {
    if (!this.selectedItem) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues));
    }
    this.callForCategories();
    this.callForNotificationTemplate();
    this.callForEmailDeliveries();
    this.callForSMTPSettings();
    this.callForDefaultEmailDeliverySetting();

    // New modda company'nin preferred language'ını formValues'a set et
    if (!this.selectedItem && !this.isDuplicate) {
      this.formValues.languageTypeResourceId =
        this.getUser?.companyLanguageTypeResourceId || "862249c19aad";
    }
  },
  beforeDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
  mounted() {
    this.$watch(
      (vm) => [vm.formValues, vm.emailDeliveryItems],
      ([formValues, emailDeliveryItems]) => {
        if (!formValues || !emailDeliveryItems.length || !this.selectedItem)
          return;
        if (formValues.emailDeliverySettingType === EMAIL_DELIVERY_TYPES.SMTP) {
          const selectedSMTPSettingIndex = emailDeliveryItems.findIndex(
            (item) => item.resourceId === formValues.smtpSettingResourceId
          );
          if (selectedSMTPSettingIndex === -1) return;
          this.emailDelivery = emailDeliveryItems[selectedSMTPSettingIndex];
        } else {
          const selectedDECSettingIndex = emailDeliveryItems.findIndex(
            (item) =>
              item.resourceId === formValues.directEmailSettingResourceId
          );
          if (selectedDECSettingIndex === -1) return;
          this.emailDelivery = emailDeliveryItems[selectedDECSettingIndex];
        }
      },
      {
        deep: true
      }
    );
  },
  methods: {
    callForSMTPSettings() {
      searchSmtpSettings(this.smtpAxiosPayload).then((response) => {
        const { data: { data: smtpSettingsData = {} } = {} } = response;
        this.smtpItems = smtpSettingsData.results.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId };
        });
      });
    },
    callForEmailDeliveries() {
      getNotificationTemplatesDeliverySettings().then((res) => {
        const {
          data: { data: { results = [] } = {} }
        } = res || {};
        const deliveries = [];
        const smtpItems = results.filter(
          (item) => item.type === EMAIL_DELIVERY_TYPES.SMTP
        );
        if (smtpItems.length) {
          deliveries.push({ header: "SMTP" }, ...smtpItems);
        }
        const directEmailItems = results.filter(
          (item) => item.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        );
        if (directEmailItems.length) {
          deliveries.push({ header: "Direct Email Creation" });
          deliveries.push(...directEmailItems);
        }
        this.emailDeliveryItems = deliveries;
      });
    },
    callForDefaultEmailDeliverySetting() {
      if (this.selectedItem) return;
      getDefaultEmailDeliverySetting().then((res) => {
        if (res?.data?.data?.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL) {
          this.defaultDECSettingResourceId = res?.data?.data?.resourceId;
        } else {
          this.defaultSMTPSettingResourceId = res?.data?.data?.resourceId;
        }
      });
    },
    handleChangeEmailDelivery(delivery = {}) {
      if (delivery.type === EMAIL_DELIVERY_TYPES.SMTP) {
        this.formValues.smtpSettingResourceId = delivery.resourceId;
        this.formValues.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP;
        this.formValues.directEmailSettingResourceId = null;
      } else {
        this.formValues.emailDeliverySettingType =
          EMAIL_DELIVERY_TYPES.DIRECT_EMAIL;
        this.formValues.directEmailSettingResourceId = delivery.resourceId;
        this.formValues.smtpSettingResourceId = null;
      }
    },
    callForNotificationTemplate() {
      if (!this?.selectedItem?.resourceId) return;
      this.loading = true;
      getEmailTemplate(this.selectedItem.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response;
          for (let [key, value] of Object.entries(data)) {
            if (key === "availableForList") {
              this.formValues[
                "availableForRequests"
              ] = getAvailableForValueFromList(value);
              continue;
            }
            this.formValues[key] = value;
          }

          this.formValues.emailDeliverySettingType =
            response?.data?.data?.emailDeliveryType ||
            response?.data?.data?.emailDeliverySettingType ||
            EMAIL_DELIVERY_TYPES.SMTP;
          if (this.isDuplicate)
            this.formValues.name = this.formValues.name + " - COPY";
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues));
          this.isSelectedNotificationEnrollment = this.isNotificationEnrollmentCategory(
            this.selectedItem.categoryName
          );
          // YENI: Initialize languages for edit mode
          this.languagesPayload.push({
            languageTypeResourceId: this.formValues.languageTypeResourceId,
            subject: this.formValues.subject,
            fromName: this.formValues.fromName,
            fromAddress: this.formValues.fromAddress,
            ccAddresses: this.formValues.ccAddresses || [],
            template: this.formValues.template,
            isTranslated: true
          });

          this.selectedLanguages.push({
            text: this.formValues.languageTypeName || "",
            value: this.formValues.languageTypeResourceId
          });
          if (
            response?.data?.data?.languages &&
            response?.data?.data?.languages.length
          ) {
            response?.data?.data?.languages.forEach((item) => {
              // Ana dili ekleme, zaten eklendi
              if (
                item.languageTypeResourceId ===
                this.formValues.languageTypeResourceId
              ) {
                return;
              }
              this.selectedLanguages.push({
                text: item.languageTypeName || "",
                value: item.languageTypeResourceId
              });
              this.languagesPayload.push({
                languageTypeResourceId: item.languageTypeResourceId,
                ...(!this.isDuplicate && { resourceId: item.resourceId }),
                subject: item.subject,
                fromName: item.fromName,
                fromAddress: item.fromAddress,
                ccAddresses: item.ccAddresses || [],
                template: item.template,
                isTranslated: true,
                ...(this.isDuplicate && {
                  detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD
                })
              });
            });
          }
          this.activeLanguage = this.formValues.languageTypeResourceId;
          this.editedLanguages = JSON.parse(
            JSON.stringify(this.languagesPayload)
          );
          this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
            JSON.stringify(this.getSelectedLanguagePayload)
          );
          // Only set initialDisabledLanguageIds if canRemoveLanguages is false
          if (!this.formValues.canRemoveLanguages) {
            this.initialDisabledLanguageIds = [
              this.formValues.languageTypeResourceId,
              ...this.languagesPayload
                .filter((item) => item.isTranslated)
                .map((item) => item.languageTypeResourceId)
            ];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    callForCategories() {
      getTemplateTypes().then((response) => {
        const {
          data: { data: categoriesData }
        } = response;
        this.categoryItems = categoriesData.map((category) => {
          return {
            text: category.name,
            value: category.resourceId,
            template: category?.template
          };
        });
      });
    },
    setLanguageItems() {
      const languageTypes = this.languageItems || [];
      const preferredLanguageTypes = this.preferredLanguageTypes || [];
      const companyLanguageTypeResourceId =
        this.companyLanguageTypeResourceId || "";

      const grouped = [];
      grouped.push({
        value: 1,
        text: "Preferred Languages",
        children: preferredLanguageTypes
      });
      grouped.push({
        value: 5,
        text: "All Languages",
        children: languageTypes.filter(
          (item) =>
            !preferredLanguageTypes?.find((pItem) => pItem.value === item.value)
        )
      });
      this.groupedLanguageItems = grouped;

      // Initial açılışta category'den template set et
      if (this.selectedItem || this.isDuplicate) return;
      const findedLanguage = languageTypes?.find(
        (item) => item.value === companyLanguageTypeResourceId
      );
      if (!findedLanguage) return;

      // Eğer template type seçilmişse ve formValues.template boşsa, category'den template set et
      if (
        this.formValues.emailTemplateCategoryResourceId &&
        (!this.formValues.template || !this.formValues.template.trim())
      ) {
        const categoryIndex = this.categoryItems.findIndex(
          (item) =>
            item.value === this.formValues.emailTemplateCategoryResourceId
        );
        if (
          categoryIndex !== -1 &&
          this.categoryItems[categoryIndex].template
        ) {
          this.formValues.template = this.categoryItems[categoryIndex].template;
          // initialFormValues'a da set et
          this.initialFormValues.template = this.categoryItems[
            categoryIndex
          ].template;
        }
      }

      // Eğer selectedLanguages'da yoksa ekle ve handleSelectedLanguagesChange çağır
      if (
        !this.selectedLanguages.some(
          (lang) => lang.value === companyLanguageTypeResourceId
        )
      ) {
        this.selectedLanguages.push({
          text: findedLanguage.text,
          value: companyLanguageTypeResourceId
        });
        this.activeLanguage = companyLanguageTypeResourceId;
        this.$nextTick(() => {
          this.handleSelectedLanguagesChange(this.selectedLanguages);
          this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
            JSON.stringify(this.getSelectedLanguagePayload)
          );
          const isCompanyLanguageEnglish = findedLanguage?.text
            ?.toLowerCase()
            .includes("english");
          // Eğer dil İngilizce DEĞİLSE API çağrısı yap
          if (
            this.getSelectedLanguagePayload.template &&
            !this.selectedItem &&
            !isCompanyLanguageEnglish
          ) {
            this.isDefault = true;
            this.handleGenerateWithAI();
          }
        });
      }
    },
    isNotificationEnrollmentCategory(categoryName = "") {
      const normalized = (categoryName || "").toString().toLowerCase();
      return (
        normalized.includes("enrollment") ||
        normalized.includes("scheduled report")
      );
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues);
      if (!isChanged) {
        return this.$emit("closeOverlay");
      } else {
        this.$store.dispatch("common/setIsShowLeavingDialog", {
          show: true,
          callback: () => {
            this.$emit("closeOverlay");
          }
        });
      }
    },
    callForMergedTags(resourceId = "") {
      getMergedTags(resourceId).then((response) => {
        this.blockManagerComponents[resourceId] =
          response.data.data["mergeTags"];
        this.setActiveBlockManagerComponents(
          this.blockManagerComponents[resourceId]
        );
      });
    },
    getTagsComponent(item) {
      return MERGED_TEXTS_MAP[item];
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce(
        (acc, item) => {
          acc[item] = this.getTagsComponent(item);
          return acc;
        },
        {}
      );
    },
    handleCategoryChange(resourceId = "") {
      const categoryIndex = this.categoryItems.findIndex(
        (item) => item.value === resourceId
      );
      if (categoryIndex !== -1) {
        this.isSelectedNotificationEnrollment = this.isNotificationEnrollmentCategory(
          this.categoryItems[categoryIndex].text
        );
        if (!this.isSelectedNotificationEnrollment)
          this.formValues.ccAddresses = [];
        const newTemplate = this.categoryItems[categoryIndex].template;
        this.formValues.template = newTemplate;
        // initialFormValues'a da set et (handleSelectedLanguagesChange için gerekli)
        this.initialFormValues.template = newTemplate;
        // Reset isTranslated flag for all languages when category changes
        this.languagesPayload.forEach((payload) => {
          payload.isTranslated = false;
        });
        // Update active language's template in languagesPayload if exists
        if (this.activeLanguage && this.languagesPayload.length > 0) {
          const activePayload = this.languagesPayload.find(
            (item) => item.languageTypeResourceId === this.activeLanguage
          );
          if (activePayload) {
            activePayload.template = newTemplate;
            if (this.selectedLanguagePayloadItemBeforeSave) {
              this.selectedLanguagePayloadItemBeforeSave.template = newTemplate;
            }
          }
        }

        // Auto-localize for selected languages when template type changes
        // Only if not in edit mode, there are selected languages, and company language is NOT English
        if (
          !this.selectedItem &&
          this.selectedLanguages.length > 0 &&
          newTemplate
        ) {
          const companyLanguage = this.languageItems.find(
            (lang) => lang.value === this.companyLanguageTypeResourceId
          );
          const isEnglish = companyLanguage?.text
            ?.toLowerCase()
            .includes("english");
          // Eğer sadece bir dil seçiliyse VE İngilizce ise, translate etme
          // Birden fazla dil varsa, İngilizce olsa bile translate et
          if (isEnglish && this.selectedLanguages.length === 1) {
            return;
          }
          // Set states immediately to disable template type
          this.$nextTick(() => {
            // Update all selected languages' templates with new default template
            this.isGenerateWithAIDisabled = true;
            this.isEmailGenerating = true;
            this.languagesPayload.forEach((payload) => {
              const isSelected = this.selectedLanguages.some(
                (lang) => lang.value === payload.languageTypeResourceId
              );
              if (isSelected) {
                payload.template = newTemplate;
                payload.isTranslated = false;
              }
            });
            // Trigger auto-localization
            this.isDefault = true;
            this.handleGenerateWithAI();
          });
        }
      }
      if (!this.blockManagerComponents.hasOwnProperty(resourceId)) {
        this.callForMergedTags(resourceId);
      } else {
        this.setActiveBlockManagerComponents(
          this.blockManagerComponents[resourceId]
        );
      }
    },
    submit() {
      const { refForm, refMakeAvailableFor } = this.$refs;
      let isValid = true;
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(
          this.formValues.availableForRequests
        );
        isValid = refMakeAvailableFor.isAvailableForValid;
      }

      if (refForm.validate() && isValid) {
        this.saveDisable = true;

        let languagesPayload = [...this.languagesPayload];

        // Ana dil mantığı: languages[0]'ı formValues'e ata
        let mainLanguage = null;
        let mainLanguageIndex = -1;

        // Önce formValues.languageTypeResourceId ile eşleşen dili bul
        if (this.formValues.languageTypeResourceId) {
          mainLanguageIndex = languagesPayload.findIndex(
            (lang) =>
              lang.languageTypeResourceId ===
              this.formValues.languageTypeResourceId
          );
          if (mainLanguageIndex !== -1) {
            mainLanguage = languagesPayload[mainLanguageIndex];
          }
        }

        // Eğer bulunamazsa, languages[0]'ı kullan
        if (!mainLanguage && languagesPayload.length > 0) {
          mainLanguage = languagesPayload[0];
        }

        // Ana dili formValues'e ata
        if (mainLanguage) {
          this.formValues.subject =
            mainLanguage.subject || this.formValues.subject || "";
          this.formValues.fromName =
            mainLanguage.fromName || this.formValues.fromName || "";
          this.formValues.fromAddress =
            mainLanguage.fromAddress || this.formValues.fromAddress || "";
          this.formValues.ccAddresses =
            mainLanguage.ccAddresses || this.formValues.ccAddresses || [];
          this.formValues.template =
            mainLanguage.template || this.formValues.template || "";
          this.formValues.languageTypeResourceId =
            mainLanguage.languageTypeResourceId ||
            this.formValues.languageTypeResourceId ||
            "";
          this.formValues.languageTypeName =
            mainLanguage.languageTypeName ||
            this.formValues.languageTypeName ||
            "";
          mainLanguage.detailActionType =
            EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.DELETE;
        }

        // Company Logo kontrolü - formValues.template'de
        if (
          document.querySelectorAll('[data-title="Company Logo"]') &&
          document.querySelectorAll('[data-title="Company Logo"]').length
        ) {
          for (
            let i =
              document.querySelectorAll('[data-title="Company Logo"]').length -
              1;
            i >= 0;
            i--
          ) {
            document.querySelectorAll('[data-title="Company Logo"]')[i].src =
              "{COMPANYLOGO}";
          }
        }

        // Company Logo kontrolü - her language objesinin template'inde
        languagesPayload.forEach((language) => {
          if (language.template && typeof language.template === "string") {
            // Regex ile [data-title="Company Logo"] içeren img src'lerini {COMPANYLOGO} ile değiştir
            language.template = language.template.replace(
              /<img([^>]*data-title=["']Company Logo["'][^>]*)src=["'][^"']*["']/gi,
              '<img$1src="{COMPANYLOGO}"'
            );
          }
        });
        const payload = {
          ...this.formValues,
          tags: this.formValues.tags.filter((item) => item.length > 0),
          availableForRequests: refMakeAvailableFor.getAvailableForValues(
            this.formValues.availableForRequests
          ),
          languages: languagesPayload
        };

        // Edit modundaysa detailActionType'ları set et
        if (
          this.selectedItem &&
          this.selectedItem.resourceId &&
          !this.isDuplicate
        ) {
          this.editedLanguages.forEach((item) => {
            // Ana dili skip et (formValues'de zaten var)
            if (
              item.languageTypeResourceId ===
              this.formValues.languageTypeResourceId
            ) {
              return;
            }

            const payloadLanguage = payload.languages.find(
              (language) =>
                language.languageTypeResourceId === item.languageTypeResourceId
            );
            if (payloadLanguage) {
              const isEqual =
                JSON.stringify(item) === JSON.stringify(payloadLanguage);
              payloadLanguage.detailActionType = isEqual
                ? EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.NO_CHANGE
                : EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.EDIT;
            } else {
              payload.languages.push({
                ...item,
                detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.DELETE
              });
            }
          });
          // Boş alanları preferred language'dan doldur
          payload.languages = this.setEmptyLanguagesPayload(payload.languages);
          updateEmailTemplate(this.selectedItem.resourceId, payload)
            .then(() => {
              this.$emit("closeOverlayWithUpdate");
            })
            .finally(() => (this.saveDisable = false));
        } else {
          // Boş alanları preferred language'dan doldur
          payload.languages = this.setEmptyLanguagesPayload(payload.languages);
          createEmailTemplate(payload)
            .then(() => {
              this.$emit("closeOverlayWithUpdate");
            })
            .finally(() => {
              this.saveDisable = false;
            });
        }
      } else {
        this.$nextTick(() => {
          const el = refForm.$el.querySelector(".error--text");
          scrollToComponent(el);
        });
      }
    },
    handleEditHtmlTemplate(template = "") {
      this.formValues.template = template;
    },
    handleInitialTemplate(value) {
      if (!this.initialFormValues) {
        this.initialFormValues = {};
      }
      this.initialFormValues.template = value;
    },
    // YENI: Language Management Methods
    handleSelectedLanguagesChange(languages) {
      this.languagesPayload = languages.map((language) => {
        const item = this.languagesPayload.find(
          (item) => item.languageTypeResourceId === language.value
        );
        if (item) {
          item.languageTypeName = language.text;
          return item;
        }
        return {
          languageTypeResourceId: language.value,
          languageTypeName: language.text,
          subject: this.getSelectedLanguagePayload.subject,
          fromName: this.getSelectedLanguagePayload.fromName,
          fromAddress: this.getSelectedLanguagePayload.fromAddress,
          ccAddresses: this.getSelectedLanguagePayload.ccAddresses || [],
          template:
            (this.initialFormValues && this.initialFormValues.template) || "",
          detailActionType: EMAIL_TEMPLATE_DETAIL_ACTION_TYPES.ADD,
          isTranslated: false
        };
      });
    },
    handleActiveLanguageChange(value) {
      this.activeLanguage = value;
      this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
        JSON.stringify(this.getSelectedLanguagePayload)
      );
    },
    handleCloseEditLanguagesLeavingDialog() {
      this.showEditLanguagesLeavingDialog = false;
    },
    handleDiscardEditLanguagesLeavingDialog(beforeSaveLanguage) {
      this.showEditLanguagesLeavingDialog = false;
      let selectedTemplateIndex = this.languagesPayload.findIndex(
        (item) => item.languageTypeResourceId === this.activeLanguage
      );
      if (selectedTemplateIndex !== -1) {
        this.$set(this.languagesPayload, selectedTemplateIndex, {
          ...this.selectedLanguagePayloadItemBeforeSave
        });
      }
      this.activeLanguage = beforeSaveLanguage;
      this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
        JSON.stringify(this.getSelectedLanguagePayload)
      );
    },
    handleConfirmEditLanguagesLeavingDialog(beforeSaveLanguage) {
      this.showEditLanguagesLeavingDialog = false;
      this.activeLanguage = beforeSaveLanguage;
      this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
        JSON.stringify(this.getSelectedLanguagePayload)
      );
    },
    handleSaveTemplate(template) {
      if (this.getSelectedLanguagePayload.template.trim() !== template.trim()) {
        this.selectedLanguagePayloadItemBeforeSave = JSON.parse(
          JSON.stringify(this.getSelectedLanguagePayload)
        );
        this.getSelectedLanguagePayload.isTranslated = false;
      }
    },
    handleGenerateEmailTemplateSuccess({ template, subject }) {
      this.getSelectedLanguagePayload.isTranslated = true;
      if (this.selectedLanguagePayloadItemBeforeSave) {
        this.selectedLanguagePayloadItemBeforeSave.template = template;
        this.selectedLanguagePayloadItemBeforeSave.subject = subject;
      }
    },
    handleRelocalizeReplace({ language }) {
      const payload = this.languagesPayload.find(
        (p) => p.languageTypeResourceId === language.value
      ) || { subject: "", template: "" };
      const subject =
        payload.subject || this.getSelectedLanguagePayload.subject || "";
      const template =
        payload.template || this.getSelectedLanguagePayload.template || "";
      const languages = [
        {
          languageResourceId: language.value,
          languageName: language.text
        }
      ];
      // Set relocalize flag and disable button
      this.isGenerateWithAIDisabled = true;
      this.isEmailGenerating = true;
      this.$refs.refEmailTemplate.isEmailGenerating = true;
      this.isRelocalizeOperation = true;
      this.relocalizeLanguageName = language.text;
      generateNotificationTemplateTranslation({ languages, template, subject })
        .then((response) => {
          if (!response?.data?.data?.isSuccess) {
            this.resetGenerateWithAIDisabled();
            return;
          }
          this.isEverythingLocalized = false;
          this.askForNotificationTemplateTranslation();
        })
        .catch(() => {
          this.resetGenerateWithAIDisabled();
        });
    },
    handleLanguageRemoved({ languageName }) {
      // Show notification that language was removed
      const message = `The ${languageName} language has been removed.`;
      this.$store.dispatch("common/createSnackBar", {
        message: message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: "mdi-check-circle"
      });
    },
    handleEditModeClick() {
      this.$refs.refEmailTemplate.toggleShowGrapesModal();
    },
    setEmptyLanguagesPayload(languages = null) {
      const languagesToProcess = languages || this.languagesPayload;
      const preferredLanguagePayload = this.getPreferredLanguagePayload();
      return languagesToProcess.map((item) => {
        return {
          ...item,
          fromName: item.fromName || preferredLanguagePayload.fromName,
          fromAddress: item.fromAddress || preferredLanguagePayload.fromAddress,
          subject: item.subject || preferredLanguagePayload.subject,
          template: item.template || preferredLanguagePayload.template,
          ccAddresses:
            item.ccAddresses && item.ccAddresses.length
              ? item.ccAddresses
              : preferredLanguagePayload.ccAddresses || []
        };
      });
    },
    getPreferredLanguagePayload() {
      // Önce company'nin preferred language'ını bul
      let preferredLanguagePayload = this.languagesPayload.find(
        (item) =>
          item.languageTypeResourceId === this.companyLanguageTypeResourceId
      );
      if (
        preferredLanguagePayload?.fromName &&
        preferredLanguagePayload?.fromAddress
      )
        return preferredLanguagePayload;

      // Yoksa fromName ve fromAddress dolu olan ilk dili bul
      preferredLanguagePayload = this.languagesPayload.find(
        (item) => item?.fromName && item?.fromAddress
      );
      return preferredLanguagePayload || this.languagesPayload[0];
    },
    askForNotificationTemplateTranslation(
      count = 0,
      maxCount = null,
      timeoutId = 0
    ) {
      if (this.isEverythingLocalized) return;
      const languagesLength = Array.isArray(this.selectedLanguages)
        ? this.selectedLanguages.length
        : 0;
      const calculatedMax = Math.max((languagesLength || 1) * 20, 20);
      const effectiveMax =
        typeof maxCount === "number" && maxCount > 0 ? maxCount : calculatedMax;
      if (count >= effectiveMax) {
        this.resetGenerateWithAIDisabled(timeoutId);
        this.languagesPayload.forEach((lPayload) => {
          if (!lPayload.isTranslated) {
            lPayload.template = '<div style="height:300px"></div>';
          }
        });
        return;
      }
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        getNotificationTemplateTranslation()
          .then((response) => {
            const {
              data: { data }
            } = response;
            if (this.timeoutId) {
              clearTimeout(this.timeoutId);
            }

            this.isEverythingLocalized = true;
            const errorLanguages = [];
            const successLanguages = [];
            data.forEach((item) => {
              if (item.error) {
                errorLanguages.push(item);
              } else {
                successLanguages.push(item);
              }
            });

            if (this.isDefault) {
              this.selectedLanguagePayloadItemBeforeSave.template =
                data[0]?.template;
              this.selectedLanguagePayloadItemBeforeSave.subject =
                data[0]?.subject;
            }
            errorLanguages.forEach((item) => {
              this.showLocalizationErrorMessage(item);
            });
            successLanguages.forEach((item) => {
              const languagePayload = this.languagesPayload.find(
                (language) =>
                  language.languageTypeResourceId === item.languageResourceId
              );
              if (!languagePayload) return;
              languagePayload.template = item.template;
              languagePayload.subject = item.subject || languagePayload.subject;
              languagePayload.fromName =
                item.fromName || languagePayload.fromName;
              languagePayload.fromAddress =
                item.fromAddress || languagePayload.fromAddress;
              languagePayload.isTranslated = true;
            });
            // Show success snackbar with dynamic message based on language count
            this.showLocalizationSuccessMessage(data);
            this.resetGenerateWithAIDisabled(timeoutId);
            const lastData = data[data.length - 1];
            if (lastData) {
              this.handleActiveLanguageChange(lastData.languageResourceId);
            }
          })
          .catch(() => {
            this.askForNotificationTemplateTranslation(
              count + 1,
              effectiveMax,
              timeoutId
            );
          });
      }, 3000);
    },
    showLocalizationErrorMessage(item) {
      this.$store.dispatch("common/createSnackBar", {
        message: `${item.error}`,
        color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
        icon: "mdi-alert-circle"
      });
    },
    showLocalizationSuccessMessage(data) {
      if (!data || !data.length || this.isDefault) return;

      let message = "";

      // Check if this is a relocalize operation
      if (this.isRelocalizeOperation) {
        message = `The ${this.relocalizeLanguageName} localization has been updated.`;
        // Reset relocalize flags
        this.isRelocalizeOperation = false;
        this.relocalizeLanguageName = "";
      } else {
        // Normal localization
        if (data.length === 1) {
          // Single language: "The [LANGUAGE] language was successfully localized."
          const languageName = this.getLanguageNameById(
            data[0].languageResourceId
          );
          message = `The ${languageName} language was successfully localized.`;
        } else {
          // Multiple languages: "+n languages were successfully localized."
          message = `${data.length} languages were successfully localized.`;
        }
      }

      this.$store.dispatch("common/createSnackBar", {
        message: message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: "mdi-check-circle"
      });
    },
    getLanguageNameById(languageResourceId) {
      // Find language name from selectedLanguages or groupedLanguageItems
      const language = this.selectedLanguages.find(
        (lang) => lang.value === languageResourceId
      );
      if (language) {
        return language.text;
      }

      // If not found in selectedLanguages, search in groupedLanguageItems
      for (const group of this.groupedLanguageItems) {
        if (group.children) {
          const foundLang = group.children.find(
            (lang) => lang.value === languageResourceId
          );
          if (foundLang) {
            return foundLang.text;
          }
        }
      }

      return "Unknown";
    },
    handleGenerateWithAI() {
      this.isGenerateWithAIDisabled = true;
      this.isEmailGenerating = true;
      this.$refs.refEmailTemplate.isEmailGenerating = true;
      let template = this.getSelectedLanguagePayload.template;
      let subject = this.getSelectedLanguagePayload.subject;
      this.saveDisable = true;
      const languagesToLocalize = this.selectedLanguages.filter((lang) => {
        const payload = this.languagesPayload.find(
          (p) => p.languageTypeResourceId === lang.value
        );
        return !(payload && payload.isTranslated);
      });
      // İlk açılışta (isDefault) scroll yapma
      if (!this.isDefault) {
        scrollToEmailTemplateContent();
      }
      generateNotificationTemplateTranslation({
        languages: languagesToLocalize.map((item) => ({
          languageResourceId: item.value,
          languageName: item.text
        })),
        template,
        subject
      }).then((response) => {
        if (!response?.data?.data?.isSuccess) {
          this.resetGenerateWithAIDisabled();
          return;
        }
        this.isEverythingLocalized = false;
        this.askForNotificationTemplateTranslation();
      });
    },
    resetGenerateWithAIDisabled(timeoutId) {
      this.isGenerateWithAIDisabled = false;
      this.isEmailGenerating = false;
      this.$refs.refEmailTemplate.isEmailGenerating = false;
      this.saveDisable = false;
      this.isDefault = false;
      clearTimeout(timeoutId);
    }
  }
};
</script>
