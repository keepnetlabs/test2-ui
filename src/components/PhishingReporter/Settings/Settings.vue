<template>
  <div class="settings" id="settings">
    <v-tabs
      id="settings-tabs"
      class="k-sub-tabs"
      v-model="tab"
      background-color="#f5f7fa"
      color="basil"
      active-class="k-sub-tabs__tab--active"
    >
      <v-tab id="pr-tab-users" class="k-sub-tabs__tab p-2" @click="changeTabStatus(0)">
        Add-in Settings
      </v-tab>
      <v-tab class="k-sub-tabs__tab p-2" @click="changeTabStatus(1)">Email Settings </v-tab>
      <v-tab class="k-sub-tabs__tab p-2" @click="changeTabStatus(2)">Other Settings </v-tab>
      <v-tab class="k-sub-tabs__tab p-2" @click="changeTabStatus(3)">Diagnostic Tool </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="k-sub-tabs__container">
      <v-tab-item>
        <addin-settings
          ref="refAddinSettings"
          :formData="formData"
          @updateForm="callForCreatePhishingReporter"
        />
      </v-tab-item>
      <v-tab-item>
        <email-settings
          ref="refEmailSettings"
          :formData="formData"
          @updateForm="callForCreatePhishingReporter"
        />
      </v-tab-item>
      <v-tab-item>
        <other-settings
          :formData="formData"
          ref="refOtherSettings"
          @updateForm="callForCreatePhishingReporter"
        />
      </v-tab-item>
      <v-tab-item>
        <diagnostic-tool
          ref="refDiagnosticTool"
          :formData="formData"
          @updateForm="callForCreatePhishingReporter"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AddinSettings from './AddinSettings'
import DiagnosticTool from './DiagnosticTool'
import EmailSettings from './EmailSettings'
import OtherSettings from './OtherSettings'
import { createPhishingReporter } from '../../../api/phishingReporter'
import { COMMON_CONSTANTS } from '../../../model/constants/commonConstants'

export default {
  name: 'Settings',
  props: {
    formData: {
      type: Object,
      default: null
    }
  },
  components: {
    AddinSettings,
    EmailSettings,
    OtherSettings,
    DiagnosticTool
  },
  data() {
    return {
      tab: 0
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    callForCreatePhishingReporter(updatedValues) {
      const addinSettings =
        this.$refs.refAddinSettings && this.$refs.refAddinSettings.getFormValues()
      const emailSettings =
        this.$refs.refEmailSettings && this.$refs.refEmailSettings.getFormValues()
      const otherSettings =
        this.$refs.refOtherSettings && this.$refs.refOtherSettings.getFormValues()
      const diagnosticTool =
        this.$refs.refDiagnosticTool && this.$refs.refDiagnosticTool.getFormValues()

      const newFormData = {
        ...this.formData,
        ...addinSettings,
        ...emailSettings,
        ...otherSettings,
        ...diagnosticTool,
        ...updatedValues
      }

      const formData = new FormData()
      Object.keys(newFormData).map((key) => {
        formData.append(
          key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1),
          newFormData[key] === null ? '' : newFormData[key]
        )
      })
      createPhishingReporter(formData)
        .then((response) => {
          this.$emit('getPhishingReport')
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: error.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
          })
          this.$emit('getPhishingReport')
        })
    }
  }
}
</script>

<style lang="scss"></style>
