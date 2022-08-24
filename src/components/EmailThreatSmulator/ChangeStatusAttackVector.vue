<template>
  <app-dialog
    icon="mdi-power-standby"
    :title="selectedItem.status == 'Enabled' ? 'Disable Attack Vectors?' : 'Enable Attack Vectors?'"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      <span v-if="selectedItem.status == 'Enabled'">
        Are you sure you want to disable these attack vectors?
      </span>
      <span v-else>
        Are you sure you want to enable these attack vectors?
      </span>
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer type="confirm" @handleClose="closeModal" @handleConfirm="handleStatus" />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from "../AppDialog";
import AppDialogFooter from "@/components/SmallComponents/AppDialogFooter";
import { disableAttackVector, enableAttackVector } from "@/api/emailThreatSimlator";
export default {
  name: "ChangeStatusAttackVector",
  components: {
    AppDialog,
    AppDialogFooter,
  },
  props: {
    status: {
      type: Boolean,
    },
    selectedItem: {
      type: Object,
    },
  },
  methods: {
    closeModal() {
      this.$emit("handleCloseModal");
    },
    handleStatus() {
      const payload = { resourceIds: [] };
      payload.resourceIds.push(this.selectedItem.pluginResourceId);
      const requestFunc =
        this.selectedItem.status == "Enabled"
          ? disableAttackVector(payload)
          : enableAttackVector(payload);
      requestFunc.then(() => {
        this.$emit("handleSuccessStatusAction");
      });
      this.closeModal();
    },
  },
};
</script>
