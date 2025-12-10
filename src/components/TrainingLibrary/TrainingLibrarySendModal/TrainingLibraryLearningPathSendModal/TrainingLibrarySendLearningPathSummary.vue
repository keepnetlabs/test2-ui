<template>
  <div>
    <NotificationTemplatesPreviewDialog
      v-if="isShowEnrollmentEmail"
      :status="isShowEnrollmentEmail"
      :template-data="formData.enrollmentData"
      :is-nested="true"
      @on-close="isShowEnrollmentEmail = false"
    />
    <NotificationTemplatesPreviewDialog
      v-if="isShowReminderEmailDialog"
      :status="isShowReminderEmailDialog"
      :template-data="formData.reminderData"
      :is-nested="true"
      @on-close="isShowReminderEmailDialog = false"
    />
    <div class="campaign-manager-last-step">
      <div
        class="campaign-manager-last-step__header"
        :style="{
          gridTemplateColumns: '1fr',
        }"
      >
        <CampaignManagerSummaryCardOneLine
          icon="mdi-cog"
          class="campaign-manager-summary-card__body-container-learning-path-original"
          :title="labels.Settings"
          :items="getSettingItems"
        >
          <template #SMSNotification="{ props: { key, val } }">
            <div class="campaign-manager-summary-card__body-item-key">
              {{ key }}
            </div>
            <div
              v-if="val === 'Off'"
              class="campaign-manager-summary-card__body-item-value"
            >
              {{ val }}
            </div>
            <div
              v-else
              class="campaign-manager-summary-card__body-item-value d-flex flex-column"
            >
              <div class="campaign-manager-sender-phone-number justify-end p-0">
                <span class="campaign-manager-sender-phone-number__number mr-2">{{
                  getPhoneNumberFormatted(val.senderPhoneNumber)
                }}</span>
                <span class="campaign-manager-sender-phone-number__country">{{
                  getPhoneNumberCountry(val.senderPhoneNumber)
                }}</span>
              </div>
              <div>
                <span style="font-weight: 600" class="mr-1">SMS Text:</span
                >{{ val.smsText }}
              </div>
            </div>
          </template>
        </CampaignManagerSummaryCardOneLine>
      </div>
      <div v-if="!isProxy" class="campaign-manager-last-step__target-users mt-4">
        <CampaignManagerSummaryCard
          detailable
          icon="mdi-account-multiple"
          :show-body-detail.sync="isShowTargetUserDetail"
          :title="labels.TargetUsers"
        >
          <template #body>
            <div
              v-if="formData.selectedStep2 === 0"
              class="campaign-manager-last-step__target-users-body pb-4"
            >
              <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
              <div v-if="isShowTargetUserDetail" class="mt-4">
                <CampaignManagerTargetGroupsAndUserSummaryInfo
                  :items="getTargetGroupItems"
                />
              </div>
              <AlertBox
                v-if="canRenderAlertbox"
                class="mt-4"
                :text="getUnverifiedDomainsText"
                :slots="{ primaryAction: false, secondaryAction: false }"
              />
              <AlertBox
                v-if="canRenderSmartGroupAlertBox"
                class="mt-4"
                text="Smart Group selected. It updates automatically, removes users who no longer meet its criteria, and excludes them from the next trainings."
                :slots="{ primaryAction: false, secondaryAction: false }"
              />
            </div>
            <div class="campaign-manager-last-step__target-users-body pb-4" v-else>
              <span
                v-if="isRandomlyTargetUser"
                style="background-color: #e0e0e0; color: #383b41"
              >
                {{ getRandomlyTargetUser }}
              </span>
              <span style="background-color: #e0e0e0; color: #383b41">
                {{ getTotalTargetUserByCampaign }}
              </span>
            </div>
          </template>
        </CampaignManagerSummaryCard>
      </div>
      <div v-if="!isProxy" class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          is-training
          detailable
          title="Enrollment email that will be sent to users"
          icon="mdi-email"
          :show-body-detail.sync="isShowEnrollmentEmail"
        />
      </div>
      <div class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          detailable
          :title="getCardTitle"
          icon="mdi-school"
          is-training
          :show-body-detail.sync="isShowTrainingEmail"
        />
      </div>
      <div
        v-if="isCertificateData"
        class="campaign-manager-last-step__email-template mt-4"
      >
        <CampaignManagerSummaryCard
          detailable
          title="Certificate that users will be received"
          icon="mdi-book-open"
          :show-body-detail.sync="isShowCertificate"
        >
          <template #body>
            <div
              v-if="isCertificateData"
              class="campaign-manager-last-step__email-template-body pb-4"
            >
              <div class="campaign-manager-last-step__email-template-body-header">
                <div class="campaign-manager-last-step__email-template-body-header-left">
                  {{ formData.certificateData.name }}
                </div>
              </div>
              <div class="campaign-manager-last-step__email-template-body-header-sub">
                Certificate email template &#8226;
                <span class="template-list--item__sub-header--span">by</span>
                {{ formData.certificateData.createdBy }}
              </div>
            </div>
            <div
              v-if="isShowCertificate && formData.certificateData.languages?.length > 0"
              style="
                display: flex;
                justify-content: flex-start;
                padding: 12px 0;
                margin-left: 24px;
              "
            >
              <InputLanguagePreview
                :value="formData.certificateData.selectedLanguageResourceId"
                style="max-width: 240px"
                hide-details
                :label="certificateTemplateLanguageLabel"
                :items="getCertificateLanguageItems"
                @input="handleCertificateLanguageChange"
              />
            </div>
            <div
              v-if="isShowCertificate"
              class="campaign-manager-last-step__email-template-body-preview-container"
            >
              <div class="campaign-manager-last-step__email-template-body-preview">
                <KEmailPreview
                  v-if="!!formData.certificateData.template"
                  ref="refPreview"
                  :html="formData.certificateData.template"
                  is-extra-height
                />
              </div>
            </div>
          </template>
        </CampaignManagerSummaryCard>
      </div>
      <div
        v-if="isReminderEmailData"
        class="campaign-manager-last-step__email-template mt-4"
      >
        <CampaignManagerSummaryCard
          detailable
          is-training
          title="Reminder email that will be sent to users"
          icon="mdi-email"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from "@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue";
import CampaignManagerSummaryCardOneLine from "@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine.vue";
import labels from "@/model/constants/labels";
import KEmailPreview from "@/components/KEmailPreview.vue";
import CampaignManagerTargetGroupsAndUserSummaryInfo from "@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo.vue";
import AlertBox from "@/components/AlertBox.vue";
import InputLanguagePreview from "@/components/Common/Inputs/InputLanguagePreview.vue";
import NotificationTemplatesPreviewDialog from "@/components/Company Settings/NotificationTemplatesPreviewDialog.vue";
import { mapActions } from "vuex";
import PhoneNumber from "awesome-phonenumber";
export default {
  name: "TrainingLibrarySendLearningPathSummary",
  components: {
    KEmailPreview,
    CampaignManagerSummaryCard,
    CampaignManagerSummaryCardOneLine,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    AlertBox,
    InputLanguagePreview,
    NotificationTemplatesPreviewDialog,
  },
  props: {
    formData: {
      type: Object,
    },
    selectedRow: {
      type: Object,
    },
  },
  data() {
    return {
      labels,
      isShowEnrollmentEmail: false,
      isShowTrainingEmail: false,
      isShowCertificate: false,
      isShowReminderEmailDialog: false,
      isShowTargetUserDetail: false,
    };
  },
  computed: {
    getEnrollmentPreviewDialogSelectedRow() {
      return {
        name: this.formData.enrollmentData?.name,
        resourceId: this.formData.enrollmentData?.resourceId,
      };
    },
    canRenderSmartGroupAlertBox() {
      console.log(this.formData?.selectedTargetGroups);
      return this.formData?.selectedTargetGroups?.some(
        (group) => group.isCreatedBySystem
      );
    },
    getCardTitle() {
      return `Learning Path: ${this.formData?.trainingData?.name}`;
    },
    getTargetGroupItems() {
      const activeItems =
        this.formData?.userCountDetailResponse?.data?.data?.filter?.(
          (row) => row.status === "Active"
        ) || [];
      return activeItems;
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = "";
      if (Object.keys(this.formData)?.length && this.formData.selectedTargetGroups) {
        const { selectedTargetGroups } = this.formData;
        text = `${this.getTotalActiveUsers} active user(s) with verified domain(s) from ${selectedTargetGroups.length} group(s)`;
      }
      return text;
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing;
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`;
    },
    getUsersFromUnverifiedDomainsCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== "Active") return acc;
        const unverifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === "Unverified")?.count || 0;
        return acc + unverifiedUserCount;
      }, 0);
    },
    getTotalActiveUsers() {
      const { userCountDetailResponse } = this.formData;
      return userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== "Active") return acc;
        const verifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === "Verified")?.count || 0;
        return acc + verifiedUserCount;
      }, 0);
    },
    getEnrollmentTemplate() {
      return this.formData?.enrollmentData?.template || "";
    },
    getSettingItems() {
      return this?.formData?.settings;
    },
    isReminder() {
      return this.getSettingItems?.Reminder || this.getSettingItems?.Distribution;
    },
    isProxy() {
      return this?.formData?.isProxy;
    },
    isEnrollmentData() {
      return this?.formData?.enrollmentData;
    },
    isTrainingData() {
      return this?.formData?.trainingData;
    },
    isCertificateData() {
      return this?.formData?.certificateData;
    },
    isReminderEmailData() {
      return this?.formData?.reminderData;
    },
    isRandomlyTargetUser() {
      return this?.formData?.selectedCampaign?.targetUsers?.sendRandomlyUsers;
    },
    getRandomlyTargetUser() {
      return `Randomly selected ${this?.formData?.selectedCampaign?.targetUsers?.targetGroupsCount} from`;
    },
    getTotalTargetUserByCampaign() {
      return `${this?.formData?.selectedCampaign?.total} active users from ${this?.formData?.selectedCampaign?.targetUsers?.targetGroupsCount} group(s)`;
    },
    enrollmentTemplateLanguageLabel() {
      const count = this.formData.enrollmentData?.languages?.length || 0;
      return `Template Language${count > 1 ? "s" : ""} (${count})`;
    },
    certificateTemplateLanguageLabel() {
      const count = this.formData.certificateData?.languages?.length || 0;
      return `Template Language${count > 1 ? "s" : ""} (${count})`;
    },
    reminderTemplateLanguageLabel() {
      const count = this.formData.reminderData?.languages?.length || 0;
      return `Template Language${count > 1 ? "s" : ""} (${count})`;
    },
    getEnrollmentLanguageItems() {
      return (
        this.formData?.enrollmentData?.languages?.map((lang) => ({
          text: lang.languageTypeName,
          value: lang.languageTypeResourceId,
        })) || []
      );
    },
    getCertificateLanguageItems() {
      return (
        this.formData?.certificateData?.languages?.map((lang) => ({
          text: lang.languageTypeName,
          value: lang.languageTypeResourceId,
        })) || []
      );
    },
    getReminderLanguageItems() {
      return (
        this.formData?.reminderData?.languages?.map((lang) => ({
          text: lang.languageTypeName,
          value: lang.languageTypeResourceId,
        })) || []
      );
    },
  },
  watch: {
    isShowTrainingEmail(val) {
      if (val) {
        this.setLearningPathPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          showSendButton: false,
          onlyPreview: true,
        });
        this.isShowTrainingEmail = false;
      }
    },
  },
  methods: {
    ...mapActions({
      setLearningPathPreviewDialog: "trainingLibrary/setLearningPathPreviewDialog",
    }),
    createPhoneNumberObj(phoneNumber = "") {
      return new PhoneNumber(phoneNumber);
    },
    getPhoneNumberFormatted(phoneNumber) {
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber);
      return phoneNumberObj?.g?.number?.international;
    },
    getPhoneNumberCountry(phoneNumber) {
      if (!phoneNumber) return "";
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber);
      const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
        type: "region",
      });
      return regionNamesInEnglish.of(phoneNumberObj?.getRegionCode());
    },
    handleEnrollmentLanguageChange(languageResourceId) {
      this.formData.enrollmentData.selectedLanguageResourceId = languageResourceId;
      const selectedLanguage = this.formData.enrollmentData.languages.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      );
      if (selectedLanguage) {
        this.formData.enrollmentData.selectedLanguageName =
          selectedLanguage.languageTypeName;
        this.formData.enrollmentData.template = selectedLanguage.template;
      }
    },
    handleCertificateLanguageChange(languageResourceId) {
      this.formData.certificateData.selectedLanguageResourceId = languageResourceId;
      const selectedLanguage = this.formData.certificateData.languages.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      );
      if (selectedLanguage) {
        this.formData.certificateData.selectedLanguageName =
          selectedLanguage.languageTypeName;
        this.formData.certificateData.template = selectedLanguage.template;
      }
    },
    handleReminderLanguageChange(languageResourceId) {
      this.formData.reminderData.selectedLanguageResourceId = languageResourceId;
      const selectedLanguage = this.formData.reminderData.languages.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      );
      if (selectedLanguage) {
        this.formData.reminderData.selectedLanguageName =
          selectedLanguage.languageTypeName;
        this.formData.reminderData.template = selectedLanguage.template;
      }
    },
  },
};
</script>
