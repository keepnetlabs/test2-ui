<template>
  <div class="campaign-manager-last-step">
    <div
      class="campaign-manager-last-step__header"
      :style="{
        gridTemplateColumns: '1fr 1fr'
      }"
    >
      <CampaignManagerSummaryCard
        icon="mdi-alert-circle"
        :title="labels.TrainingInfo"
        :items="getTrainingInfoItems"
      />
      <CampaignManagerSummaryCard
        icon="mdi-cog"
        :title="labels.Settings"
        :items="getSettingItems"
      />
    </div>
    <div class="campaign-manager-last-step__target-users mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-account-multiple"
        :show-body-detail.sync="isShowTargetUserDetail"
        :title="labels.TargetUsers"
      >
        <template #body>
          <div class="campaign-manager-last-step__target-users-body pb-4">
            <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
          </div>
          <div v-if="isShowTargetUserDetail">
            <CampaignManagerTargetGroupsAndUserSummaryInfo :items="formData.selectedTargetGroups" />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__email-template mt-4">
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
        title="Training that users will be directed to"
        icon="mdi-application"
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
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'

export default {
  name: 'SendTrainingSummary',
  components: {
    KEmailPreview,
    CampaignManagerSummaryCard,
    CampaignManagerTargetGroupsAndUserSummaryInfo
  },
  props: {
    formData: {
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
      if (Object.keys(this.formData)?.length && this.formData?.selectedTargetGroups) {
        const { selectedTargetGroups } = this.formData
        text = `${this.getTotalActiveUsers} active user(s) from ${selectedTargetGroups.length} group(s)`
      }
      return text
    },
    getTotalActiveUsers() {
      const { selectedTargetGroups } = this.formData
      return selectedTargetGroups.reduce((acc, item) => {
        acc += item?.activeUserCount
        return acc
      }, 0)
    },
    getEnrollmentTemplate() {
      return this.formData?.enrollmentData?.template || ''
    },
    getSettingItems() {
      return this?.formData?.settings
    },
    getTrainingInfoItems() {
      if (
        this?.formData?.trainingInfo &&
        this?.formData?.trainingInfo.Languages.includes('All Languages')
      ) {
        return {
          'Content Type': this?.formData?.trainingInfo?.['Content Type'],
          Languages: 'All Languages'
        }
      }
      return this?.formData?.trainingInfo
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
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        console.log(val)
      }
    },
    isShowTrainingEmail(val) {
      if (val) {
        this.$emit('on-show-training-summary')
        this.isShowTrainingEmail = false
      }
    }
  }
}
</script>
