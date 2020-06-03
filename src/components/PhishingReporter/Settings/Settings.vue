<template>
  <div class="settings" id="settings">
    <v-tabs
      id="settings-tabs"
      class="settings-tabs"
      v-model="tab"
      background-color="#f5f7fa"
      color="basil"
      active-class="settings-tab-active"
    >
      <v-tab id="pr-tab-users" class="settings-tab  p-2" @click="changeTabStatus(0)">
        Add-in Settings
      </v-tab>
      <v-tab class="settings-tab p-2" @click="changeTabStatus(1)">Email Settings </v-tab>
      <v-tab class="settings-tab  p-2" @click="changeTabStatus(2)">Other Settings </v-tab>
      <v-tab class="settings-tab p-2" @click="changeTabStatus(3)">Diagnostic Tool </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="settings-tabs__container">
      <v-tab-item>
        <addin-settings :formData="formData" @updateForm="callForCreatePhishingReporter" />
      </v-tab-item>
      <v-tab-item>
        <email-settings :formData="formData" @updateForm="callForCreatePhishingReporter" />
      </v-tab-item>
      <v-tab-item>
        <other-settings :formData="formData" @updateForm="callForCreatePhishingReporter" />
      </v-tab-item>
      <v-tab-item>
        <diagnostic-tool :formData="formData" @updateForm="callForCreatePhishingReporter" />
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
      const newFormData = {
        ...this.formData,
        ...updatedValues
      }
      const formData = new FormData()
      Object.keys(newFormData).map(key => {
        formData.append(
          key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1),
          newFormData[key] === null ? '' : newFormData[key]
        )
      })
      createPhishingReporter(formData)
        .then(response => {
          this.formData = newFormData
        })
        .catch(error => {})
    }
  }
}
</script>

<style lang="scss">
.settings {
  &-tabs {
    &__container {
      margin-top: 24px !important;
    }
    .v-tabs-slider-wrapper {
      bottom: 0 !important;
      color: #0486fe !important;
    }

    .v-slide-group__wrapper {
      padding-left: 8px !important;
    }
  }

  &-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #212121 !important;
    text-transform: capitalize;
    margin: 0 24px 0 0 !important;
    padding: 0 !important;
    &-active {
      color: #2196f3 !important;
      font-weight: 600 !important;
    }
  }
}
</style>
