<template>
  <div>
    <EnrollmentsSubTabs
      is-trash
      :enrollment-status-enum="enrollmentStatusEnum"
      :languages="languages"
    />
    <!--
    <TrashDeletePermanentlyDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteDialog"
    />
    <TrashTable
      ref="refTable"
      @on-delete="handleDeleteRowClick"
      @on-restore="handleRestoreRowClick"
    />
    -->
  </div>
</template>

<script>
/*
import TrashTable from '@/components/AwarenessEducator/Enrollments/TrashTable'
import TrashDeletePermanentlyDialog from '@/components/AwarenessEducator/Enrollments/TrashDeletePermanentlyDialog'

 */
import AwarenessEducatorService from '@/api/awarenessEducator'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Trash',
  components: { EnrollmentsSubTabs /*TrashDeletePermanentlyDialog, TrashTable*/ },
  data() {
    return {
      enrollmentStatusEnum: [],
      isShowDeleteDialog: false,
      selectedRow: null
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    })
  },
  methods: {
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteDialog()
    },
    handleRestoreRowClick(row) {
      AwarenessEducatorService.restoreEnrollment(row.enrollmentId).then(() => {
        this.$refs.refTable.callForData()
      })
    },
    toggleShowDeleteDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowDeleteDialog) this.selectedRow = null
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
