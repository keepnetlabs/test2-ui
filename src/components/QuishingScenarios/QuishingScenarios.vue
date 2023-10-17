<template>
  <div id="quishing-scenarios">
    <CommonSimulatorNewScenario
      v-if="isShowNewScenarioModal"
      ref="newScenarioModal"
      :type="SCENARIO_TYPES.QUISHING"
      :status="isShowNewScenarioModal"
      :scenario-id="getSelectedScenarioId"
      :is-edit="isEdit"
      :is-duplicate="isDuplicate"
      :scenario-details-lookup="scenarioDetailsLookup"
      :is-attachment-based="isAttachmentBasedScenario"
      @changeNewScenarioModalStatus="changeNewScenarioModalStatus"
    />
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
      :scenario-details-lookup="scenarioDetailsLookup"
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
import { PREVIEW_DIALOG_TYPES, SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario.vue'
import labels from '@/model/constants/labels'
import useScenarioDetailsLookup from '@/hooks/useScenarioDetailsLookup'

export default {
  name: 'QuishingScenarios',
  components: {
    CommonSimulatorNewScenario,
    CommonSimulatorPreviewDialog,
    CommonSimulatorDeleteScenario,
    QuishingScenariosTable
  },
  mixins: [useScenarioDetailsLookup],
  data() {
    return {
      PREVIEW_DIALOG_TYPES,
      SCENARIO_TYPES,
      isShowDeleteDialog: false,
      isShowNewScenarioModal: false,
      isShowFastLaunchDialog: false,
      isShowPreviewDialog: false,
      selectedScenario: null,
      isDuplicate: false,
      isEdit: false
    }
  },
  computed: {
    getSelectedScenarioId() {
      return this.selectedScenario?.id || ''
    },
    isAttachmentBasedScenario() {
      return this.selectedRow?.method === labels.Attachment
    }
  },
  created() {
    this.callForScenarioDetails()
  },
  methods: {
    deleteScenario: QuishingService.deleteScenario,
    getQuishingScenarioLandingPageAndEmailTemplate:
      QuishingService.getQuishingScenarioLandingPageAndEmailTemplate,
    toggleNewScenarioModal(selectedRow = null, isDuplicate = false) {
      this.selectedScenario = selectedRow
      this.isDuplicate = isDuplicate
      this.isEdit = !!this.selectedScenario
      this.isShowNewScenarioModal = !this.isShowNewScenarioModal
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
    },
    changeNewScenarioModalStatus(status, restart) {
      if (restart) this.$refs.refTable.callForData()
      this.toggleNewScenarioModal()
    }
  }
}
</script>
