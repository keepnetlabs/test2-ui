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
    <CommonSimulatorFastLaunch
      v-if="isShowFastLaunchDialog"
      ref="fastLaunch"
      :status="isShowFastLaunchDialog"
      :type="SCENARIO_TYPES.QUISHING"
      :selected-scenario="selectedScenario"
      @on-close="toggleFastLaunchDialog"
    />
    <CommonSimulatorDeleteScenario
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selectedScenario="selectedScenario"
      :api-func="deleteScenario"
      :scenarioCount="multipleDeletedScenariosCount"
      :multipleDeleteApiFunc="bulkDeleteScenarios"
      :multipleDeletePayload="multipleScenariosPayload"
      :isMultiple="isMultipleDelete"
      @on-success="toggleDeleteDialog(null, true)"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
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
      @on-multiple-delete="handleMultipleDelete"
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
import CommonSimulatorFastLaunch from '@/components/Common/Simulator/CommonSimulatorFastLaunch.vue'
import useQuishingScenarioDetailsLookup from '@/hooks/useQuishingScenarioDetailsLookup'

export default {
  name: 'QuishingScenarios',
  components: {
    CommonSimulatorFastLaunch,
    CommonSimulatorNewScenario,
    CommonSimulatorPreviewDialog,
    CommonSimulatorDeleteScenario,
    QuishingScenariosTable
  },
  mixins: [useQuishingScenarioDetailsLookup],
  data() {
    return {
      PREVIEW_DIALOG_TYPES,
      SCENARIO_TYPES,
      isShowDeleteDialog: false,
      isShowNewScenarioModal: false,
      isShowPreviewDialog: false,
      isShowFastLaunchDialog: false,
      selectedScenario: null,
      isDuplicate: false,
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      isEdit: false
    }
  },
  computed: {
    getSelectedScenarioId() {
      return this.selectedScenario?.resourceId || ''
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
    bulkDeleteScenarios: QuishingService.bulkDeleteScenarios,
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
      this.isMultipleDelete = false
      if (forceUpdate) this.$refs.refTable.callForData()
      this.selectedScenario = selectedRow
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refTable?.$refs?.refScenariosList?.resetSelectableParams()
      this.isShowDeleteDialog = false
      this.$refs?.refTable?.callForData()
    },
    changeNewScenarioModalStatus(status, restart) {
      if (restart) this.$refs.refTable.callForData()
      this.toggleNewScenarioModal()
    },
    checkIfCanCLoseNewScenarioModal() {
      if (this.$refs.newScenarioModal) {
        this.$refs.newScenarioModal.changeNewScenarioModalStatus()
      }
    },
    checkIfCanCloseFastLaunchModal() {
      if (this.$refs.fastLaunch) {
        this.$refs.fastLaunch.closeOverlay()
      }
    },
    handleMultipleDelete({ selections, excludedItems, selectAll, axiosPayload, serverSideProps }) {
      this.isMultipleDelete = true
      this.multipleDeletedScenariosCount = selectAll
        ? serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleScenariosPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: axiosPayload.filter
      }
      this.isShowDeleteDialog = true
    }
  }
}
</script>
