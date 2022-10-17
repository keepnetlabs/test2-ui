<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    icon="$domain"
    :isLoading="isFetchingSummary"
    :title="labels.VishingTemplate"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-enrollment-template__body pb-4">
        <div class="training-report-enrollment-template__template-name">
          {{ formData.name }}
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import { useLoading } from '@/hooks/useLoading'
import labels from '@/model/constants/labels'

export default {
  name: 'VishingReportTemplate',
  components: {
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    },
    trainingEmailNotificationTemplateTypeResourceId: {
      type: String
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  }
}
</script>
