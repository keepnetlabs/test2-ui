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
    <CommonSimulatorPreviewDialog
      v-if="isShowPreviewDialog"
      :type="PREVIEW_DIALOG_TYPES.QUISHING"
      :status="isShowPreviewDialog"
      :selected-row="selectedScenario"
      :api-func="getQuishingScenarioLandingPageAndEmailTemplate"
      @on-close="togglePreviewDialog"
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
import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'QuishingScenarios',
  components: {
    CommonSimulatorPreviewDialog,
    CommonSimulatorDeleteScenario,
    QuishingScenariosTable
  },
  data() {
    return {
      PREVIEW_DIALOG_TYPES,
      isShowDeleteDialog: false,
      isShowNewScenarioDialog: false,
      isShowFastLaunchDialog: false,
      isShowPreviewDialog: false,
      selectedScenario: null,
      isDuplicate: false
    }
  },
  methods: {
    deleteScenario: QuishingService.deleteScenario,
    getQuishingScenarioLandingPageAndEmailTemplate:
      QuishingService.getQuishingScenarioLandingPageAndEmailTemplate,
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
