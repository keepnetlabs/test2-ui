<template>
  <VishingCampaignModalSummaryVishingTemplate class="mt-4" :form-values="formData" />
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import labels from '@/model/constants/labels'
import VishingCampaignModalSummaryVishingTemplate from '@/components/VishingCampaignManager/VishingCampaignModalSummaryVishingTemplate'

export default {
  name: 'VishingReportTemplate',
  components: {
    VishingCampaignModalSummaryVishingTemplate
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
