<template>
  <div id="quishing-scenarios">
    <CommonSimulatorDeleteScenario
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selectedScenario="selectedScenario"
      :api-func="deleteScenario"
      @on-success="toggleDeleteDialog(null, true)"
      @on-close="toggleDeleteDialog"
    />
    <QuishingScenariosTable
      ref="refTable"
      @on-edit-or-new="toggleNewScenarioModal"
      @on-fast-launch="toggleFastLaunchDialog"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>

<script>
import QuishingScenariosTable from '@/components/QuishingScenarios/QuishingScenariosTable'
import CommonSimulatorDeleteScenario from '@/components/Common/Simulator/CommonSimulatorDeleteScenario'
import QuishingService from '@/api/quishing'

export default {
  name: 'QuishingScenarios',
  components: { CommonSimulatorDeleteScenario, QuishingScenariosTable },
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
    deleteScenario: QuishingService.deleteScenario,
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
    toggleDeleteDialog(selectedRow = null, forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.selectedScenario = selectedRow
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
