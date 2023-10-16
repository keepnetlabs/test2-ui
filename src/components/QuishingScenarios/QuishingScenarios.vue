<template>
  <div id="quishing-scenarios">
    <QuishingScenariosTable
      @on-edit-or-new="toggleNewScenarioModal"
      @on-fast-launch="toggleFastLaunchDialog"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>

<script>
import QuishingScenariosTable from '@/components/QuishingScenarios/QuishingScenariosTable'

export default {
  name: 'QuishingScenarios',
  components: { QuishingScenariosTable },
  data() {
    return {
      isShowDeleteDialog: false,
      isShowNewScenarioDialog: false,
      isShowFastLaunchDialog: false,
      selectedScenario: null,
      isDuplicate: false
    }
  },
  methods: {
    toggleNewScenarioModal(selectedRow = null, isDuplicate = false) {
      this.selectedScenario = selectedRow
      this.isDuplicate = isDuplicate
      this.isShowNewScenarioDialog = !this.isShowNewScenarioDialog
    },
    toggleFastLaunchDialog(selectedRow = null) {
      this.selectedScenario = selectedRow
      this.isShowFastLaunchDialog = !this.isShowFastLaunchDialog
    },
    togglePreviewDialog(selectedRow = null) {
      this.selectedScenario = selectedRow
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog(selectedRow = null) {
      this.selectedScenario = selectedRow
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
