<template>
  <div class="campaign-manager" id="campaign-manager">
    <div class="campaign-manager__content">
      <CampaignManagerParentTable
        v-show="!isItemTableShowing"
        :axiosPayload.sync="axiosPayload"
        :is-loading="isParentTableLoading"
        @on-record-button-click="handleOnRecordButtonClick"
      />
      <CampaignManagerItemTable
        v-if="isItemTableShowing"
        :axiosPayload="axiosPayloadOfItem"
        :is-loading="isItemTableLoading"
        @on-back-click="handleOnBackClick"
      />
    </div>
  </div>
</template>

<script>
import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable'
import { axiosPayload } from '@/components/CampaignManager/utils'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable'
export default {
  name: 'CampaignManager',
  components: { CampaignManagerItemTable, CampaignManagerParentTable },
  data() {
    return {
      axiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
      axiosPayloadOfItem: JSON.parse(JSON.stringify(axiosPayload)),
      isParentTableLoading: false,
      isItemTableLoading: false,
      isItemTableShowing: false
    }
  },
  methods: {
    handleOnRecordButtonClick(row) {
      this.toggleItemTableShowing()
    },
    handleOnBackClick() {
      this.toggleItemTableShowing()
    },
    toggleItemTableShowing() {
      this.isItemTableShowing = !this.isItemTableShowing
    }
  }
}
</script>

<style lang="scss">
.campaign-manager {
  min-height: 80vh;
  padding: 11px 16px 16px 16px;
  &__content {
    background: white;
    box-shadow: 0 10px 15px -5px hsla(0, 0%, 80.4%, 0.5) !important;
    padding: 24px 24px 0 24px !important;
    border-radius: 20px !important;
  }
  &__table-all-records {
    color: #2196f3;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    margin-left: 24px;
    margin-bottom: 24px;
  }
}
</style>
