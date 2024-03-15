<template>
  <div class="campaign-manager-last-step">
    <div
      class="campaign-manager-last-step__header"
      :style="{
        gridTemplateColumns: '1fr'
      }"
    >
      <CampaignManagerSummaryCardOneLine
        :class="{
          'campaign-manager-summary-card__body-container-poster': true,
          'campaign-manager-summary-card__body-container-poster-reminder': isReminder,
          'campaign-manager-summary-card__body-container-poster-phone-number': isPhoneNumber
        }"
        icon="mdi-cog"
        :title="labels.Settings"
        :items="getSettingItems"
      />
    </div>
    <div v-if="!isProxy" class="campaign-manager-last-step__target-users mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-account-multiple"
        :show-body-detail.sync="isShowTargetUserDetail"
        :title="labels.TargetUsers"
      >
        <template #body>
          <div class="campaign-manager-last-step__target-users-body pb-4">
            <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
            <div v-if="isShowTargetUserDetail" class="mt-4">
              <CampaignManagerTargetGroupsAndUserSummaryInfo
                :items="formData.selectedTargetGroups"
              />
            </div>
            <AlertBox
              v-if="canRenderAlertbox"
              class="mt-4"
              :text="getUnverifiedDomainsText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div v-if="!isProxy" class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        title="Enrollment email that will be sent to users"
        icon="mdi-email"
        :show-body-detail.sync="isShowEnrollmentEmail"
      >
        <template #body>
          <div v-if="isEnrollmentData" class="campaign-manager-last-step__email-template-body pb-4">
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ formData.enrollmentData.name }}
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              Training enrollment email template &#8226;
              <span class="template-list--item__sub-header--span">by</span>
              {{ formData.enrollmentData.createdBy }}
            </div>
          </div>
          <div
            v-if="isShowEnrollmentEmail"
            class="campaign-manager-last-step__email-template-body-preview-container"
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
              <KEmailPreview
                v-if="!!getEnrollmentTemplate"
                ref="refPreview"
                is-extra-height
                :html="getEnrollmentTemplate"
              />
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        title="Screensaver that users will be directed to"
        icon="mdi-post"
        :show-body-detail.sync="isShowTrainingEmail"
      >
        <template #body>
          <div v-if="isTrainingData" class="campaign-manager-last-step__email-template-body pb-4">
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ formData.trainingData.name }}
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              {{ formData.trainingData.category }} &#8226;
              <span class="template-list--item__sub-header--span">by</span>
              {{ formData.trainingData.createdBy }}
            </div>
            <div
              style="
                font-weight: 400;
                font-size: 12px;
                line-height: 19px;
                color: #383b41;
                margin-top: 8px;
              "
            >
              {{ formData.trainingData.description }}
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div v-if="isCertificateData" class="campaign-manager-last-step__email-template mt-4">
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
    <div v-if="isReminderEmailData" class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        title="Reminder email that will be sent to users"
        icon="mdi-email"
        :show-body-detail.sync="isShowReminderEmail"
      >
        <template #body>
          <div
            v-if="isReminderEmailData"
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ formData.reminderData.name }}
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              Training reminder email template &#8226;
              <span class="template-list--item__sub-header--span">by</span>
              {{ formData.reminderData.createdBy }}
            </div>
          </div>
          <div
            v-if="isShowReminderEmail"
            class="campaign-manager-last-step__email-template-body-preview-container"
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
              <KEmailPreview
                v-if="!!formData.reminderData.template"
                ref="refPreview"
                :html="formData.reminderData.template"
                is-extra-height
              />
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue'
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine.vue'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview.vue'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo.vue'
import AlertBox from '@/components/AlertBox.vue'
import { mapActions } from 'vuex'

export default {
  name: 'TrainingLibrarySendScreensaverSummary',
  components: {
    KEmailPreview,
    CampaignManagerSummaryCard,
    CampaignManagerSummaryCardOneLine,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    AlertBox
  },
  props: {
    formData: {
      type: Object
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowEnrollmentEmail: false,
      isShowTrainingEmail: false,
      isShowCertificate: false,
      isShowReminderEmail: false,
      isShowTargetUserDetail: false
    }
  },
  computed: {
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formData)?.length && this.formData.selectedTargetGroups) {
        const { selectedTargetGroups } = this.formData
        text = `${this.getTotalActiveUsers} active user(s) with verified domain(s) from ${selectedTargetGroups.length} group(s)`
      }
      return text
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`
    },
    getUsersFromUnverifiedDomainsCount() {
      return (
        this.formData.userCountDetailResponse?.data?.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Unverified')?.count || 0
      )
    },
    getTotalActiveUsers() {
      const { userCountDetailResponse } = this.formData
      const totalActiveUsersCount =
        userCountDetailResponse?.data?.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Verified')?.count || 0
      return totalActiveUsersCount
    },
    getEnrollmentTemplate() {
      return this.formData?.enrollmentData?.template || ''
    },
    getSettingItems() {
      return this?.formData?.settings
    },
    isProxy() {
      return this?.formData?.isProxy
    },
    isEnrollmentData() {
      return this?.formData?.enrollmentData
    },
    isTrainingData() {
      return this?.formData?.trainingData
    },
    isCertificateData() {
      return this?.formData?.certificateData
    },
    isReminderEmailData() {
      return this?.formData?.reminderData
    },
    isReminder() {
      return this.getSettingItems?.Reminder
    },
    isPhoneNumber() {
      return this.getSettingItems && this.getSettingItems['Sender Phone Number']
    }
  },
  watch: {
    isShowTrainingEmail(val) {
      if (val) {
        this.setScreenSaverPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          type: 'screensaver',
          title: labels.ScreensaverPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showSendButton: false,
          showScreensaverName: true,
          showFavoriteButton: true,
          icon: 'mdi-eye'
        })
        this.isShowTrainingEmail = false
      }
    }
  },
  methods: {
    ...mapActions({
      setScreenSaverPreviewDialog: 'trainingLibrary/setScreenSaverPreviewDialog'
    })
  }
}
</script>
