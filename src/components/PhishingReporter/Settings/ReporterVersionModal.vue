<template>
  <app-dialog
    :status="status"
    icon="mdi-timer-sand-full"
    :title="getTitle"
    subtitle="Version configurations"
    @changeStatus="$emit('changeReporterVersionModalStatus', false)"
    :custom-size="'800'"
    class-name="matching-modal version-history"
    max-height
    v-if="status"
    maxHeightSize="520px"
  >
    <template v-slot:app-dialog-body>
      <phishing-settings
        :applicationType="selectedVersionRow.applicationType"
        ref="refSettings"
        :form-data="formData"
        :inModal="true"
      />
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="$emit('changeReporterVersionModalStatus', false)"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../../AppDialog'

export default {
  name: 'ReporterVersionModal',
  components: {
    AppDialog
  },
  props: {
    selectedVersionRow: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      formData: null
    }
  },
  computed: {
    getTitle() {
      return `Phishing Reporter Version ${this.selectedVersionRow.version}`
    }
  },
  created() {
    const payload = JSON.parse(this.selectedVersionRow.argument)
    const formData = {}
    for (let key of Object.keys(payload)) {
      formData[key.charAt(0).toLocaleLowerCase('en-US') + key.slice(1)] = payload[key]
    }
    this.formData = formData
  }
}
</script>

<style lang="scss"></style>
