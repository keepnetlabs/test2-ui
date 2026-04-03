<template>
  <CommonCampaignManagerSmishingPreviewDialog
    :status="status"
    :selected-row="selectedRow"
    @on-close="$emit('on-close')"
    @on-edit-campaign="$emit('on-edit-campaign', $event)"
  />
</template>

<script>
import CommonCampaignManagerSmishingPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerSmishingPreviewDialog.vue'

export default {
  name: 'CampaignManagerPreview',
  components: {
    CommonCampaignManagerSmishingPreviewDialog
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  }
}
</script>
