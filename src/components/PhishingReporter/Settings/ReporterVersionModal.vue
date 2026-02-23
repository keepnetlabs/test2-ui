<template>
  <app-dialog
    v-if="status"
    :status="status"
    icon="mdi-timer-sand-full"
    :title="getTitle"
    subtitle="Version configurations"
    custom-size="800"
    title-id="text--phishing-reporters-versions-title"
    subtitle-id="text--phishing-reporters-versions-subtitle"
    :class-name="'matching-modal version-history'"
    :max-height="!this.isDiagnostic"
    :maxHeightSize="!this.isDiagnostic ? '500px' : '310px'"
    @changeStatus="$emit('changeReporterVersionModalStatus', false)"
  >
    <template #app-dialog-body>
      <phishing-settings
        :applicationType="selectedVersionRow.applicationType"
        ref="refSettings"
        :form-data="formData"
        :inModal="true"
      />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--reporter-version-popup"
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
      return `${this.isDiagnostic ? 'Diagnostic Tool Version' : 'Phishing Reporter Version '} ${
        this.selectedVersionRow.version
      }`
    },
    isDiagnostic() {
      return this.selectedVersionRow.applicationType === 'DiagnosticTool'
    }
  },
  created() {
    const payload = JSON.parse(this.selectedVersionRow.argument)
    const formData = {}
    for (let key of Object.keys(payload)) {
      let formKey = key.charAt(0).toLocaleLowerCase('en-US') + key.slice(1)
      if (key === 'EmailFormatErrorMessage') {
        formKey = 'badFormatEmailMessage'
      }
      if (formKey === 'isDefaultProxy') {
        formKey = 'isEnableProxy'
      }
      if (key === 'CompanyId') {
        formKey = 'companyKey'
      }
      if (key === 'DialogBoxSettings') {
        formData['dialogBoxSettings'] = payload.DialogBoxSettings.map((setting) => {
          let row = {}
          for (let settingKey of Object.keys(setting)) {
            const rowKey = settingKey.charAt(0).toLocaleLowerCase('en-US') + settingKey.slice(1)
            row[rowKey] = setting[settingKey]
          }
          return row
        })
      } else {
        formData[formKey] = payload[key]
      }
    }
    this.formData = formData
  }
}
</script>
