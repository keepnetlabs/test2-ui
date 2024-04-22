<template>
  <KContainer tabless id="campaign-reports">
    <CampaignReportsDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :is-action-button-disabled="isActionButtonDisabled"
      :item="selectedRow"
      @on-close="toggleShowDeleteDialog"
      @on-delete="handleDeleteItem"
    />
    <CampaignReportsTable
      ref="refTable"
      @on-delete="handleTableDeleteClick"
      @on-view-report="handleViewReport"
    />
  </KContainer>
</template>

<script>
import CampaignReportsTable from '@/components/CampaignReports/CampaignReportsTable'
import CampaignReportsDeleteDialog from '@/components/CampaignReports/CampaignReportsDeleteDialog'
import { deletePhishingCampaignJob } from '@/api/phishingsimulator'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'CampaignReports',
  components: { KContainer, CampaignReportsDeleteDialog, CampaignReportsTable },
  data() {
    return {
      isShowDeleteDialog: false,
      selectedRow: {},
      isActionButtonDisabled: false
    }
  },
  created() {
    if (this.$route.name === 'Campaign Reports') this.$router.push({ name: 'Dashboard' })
  },
  methods: {
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = {}
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleDeleteItem(row = {}) {
      this.setDeleteDialogActionButtonDisabled(true)
      deletePhishingCampaignJob(row.phishingCampaignResourceId, row.instanceGroup)
        .then(() => {
          this.$refs.refTable.$refs.refTable.unSelectRow(row)
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
    handleTableDeleteClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteDialog()
    },
    handleViewReport(row = {}) {
      this.$router.push({
        name: 'Campaign Report',
        params: { id: row.phishingCampaignResourceId, instanceGroup: row.instanceGroup }
      })
    }
  }
}
</script>
