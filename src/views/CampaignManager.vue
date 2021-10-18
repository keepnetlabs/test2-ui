<template>
  <div class="campaign-manager" id="campaign-manager">
    <CampaignManagerParentTable
      :axiosPayload.sync="axiosPayload"
      :is-loading="isParentTableLoading"
    />
  </div>
</template>

<script>
import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable'
import { axiosPayload } from '@/components/CampaignManager/utils'
export default {
  name: 'CampaignManager',
  components: { CampaignManagerParentTable },
  data() {
    return {
      axiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
      isParentTableLoading: false
    }
  }
}
</script>

<style lang="scss">
.campaign-manager {
  min-height: 80vh;
  padding: 11px 16px 16px 16px;
}
</style>
