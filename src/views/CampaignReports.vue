<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <CampaignReportsDeleteDialog
        v-if="isShowDeleteDialog"
        :status="isShowDeleteDialog"
        :is-action-button-disabled="isActionButtonDisabled"
        :resource-id="selectedRowResourceId"
        @on-close="toggleShowDeleteDialog"
        @on-delete="handleDeleteItem"
      />
      <CampaignReportsTable ref="refTable" @on-delete="handleTableDeleteClick" />
    </div>
  </div>
</template>

<script>
import CampaignReportsTable from '@/components/CampaignReports/CampaignReportsTable'
import CampaignReportsDeleteDialog from '@/components/CampaignReports/CampaignReportsDeleteDialog'
import { deletePhishingCampaignJob } from '@/api/phishingsimulator'
export default {
  name: 'CampaignReports',
  components: { CampaignReportsDeleteDialog, CampaignReportsTable },
  data() {
    return {
      isShowDeleteDialog: false,
      selectedRowResourceId: '',
      isActionButtonDisabled: false
    }
  },
  methods: {
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRowResourceId = ''
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleDeleteItem(resourceId = '') {
      this.setDeleteDialogActionButtonDisabled(true)
      deletePhishingCampaignJob(resourceId)
        .then(() => {
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.toggleShowDeleteDialog()
          this.setDeleteDialogActionButtonDisabled()
        })
    },
    setDeleteDialogActionButtonDisabled(status = false) {
      this.isActionButtonDisabled = status
    },
    handleTableDeleteClick(resourceId = '') {
      this.selectedRowResourceId = resourceId
      this.toggleShowDeleteDialog()
    }
  }
}
</script>

<style lang="scss">
.campaign-reports {
  min-height: 80vh;
  padding: 11px 16px 16px 16px;
  &__content {
    background: white;
    box-shadow: 0 10px 15px -5px hsla(0, 0%, 80.4%, 0.5) !important;
    padding: 24px 24px 0 24px !important;
    border-radius: 20px !important;
  }
}
</style>
