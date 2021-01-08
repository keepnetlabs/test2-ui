<template>
  <div>
    <app-modal
      :status="status"
      @closeOverlay="$emit('closeOverlay')"
      icon-name="mdi-domain"
      title="Phishing Reporter Add-in Configuration"
      class-name="add-in-configuration"
    >
      <template v-slot:overlay-body>
        <download-add-in-modal :status="showModal" @handleClose="handleContinue" />
        <v-stepper v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
              >Add-in Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
              >Email Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
              >Other Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
              >Diagnostic Tool
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="k-stepper__items">
            <v-stepper-content class="k-stepper__content" :step="1">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Add-in Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle mb-6">
                    General add-in settings
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <addin-settings
                :showFooter="false"
                @getFormValues="getAddinSettingsValues"
                ref="refAddInSettings"
                :inModal="true"
                :showHeader="false"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Email Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle">
                    Reported emails will be sent to specified recipients
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <email-settings
                :showFooter="false"
                :showHeader="false"
                @getFormValues="getEmailSettingsValues"
                ref="refEmailSettings"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="3">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Other Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle mb-3">
                    Additional settings for add-in and archive
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <other-settings
                :showFooter="false"
                @getFormValues="getOtherSettingsValues"
                ref="refOtherSettings"
                :inModal="true"
                :show-header="false"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="4">
              <diagnostic-tool
                ref="refDiagnosticTool"
                :show-footer="false"
                :show-header-link="false"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template v-slot:overlay-footer>
        <v-btn @click="closeOverlay" class="add-in-configuration__footer-btn-cancel" rounded>
          {{ labels.Cancel }}
        </v-btn>
        <div class="add-in-configuration__footer__right-col">
          <v-btn
            @click="changeStep(-1)"
            class="add-in-configuration__footer-btn-back mr-4"
            rounded
            v-if="step > 1"
          >
            {{ labels.Back }}
          </v-btn>
          <v-btn
            @click="changeStep(+1)"
            class="add-in-configuration__footer-btn-next"
            color="#2196f3"
            rounded
            v-if="step < 4"
          >
            {{ labels.Next }}
          </v-btn>
          <v-btn
            @click="submit"
            class="add-in-configuration__footer-btn-next"
            color="#2196f3"
            rounded
            v-if="step === 4"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AddinSettings from './Settings/AddinSettings'
import EmailSettings from './Settings/EmailSettings'
import OtherSettings from './Settings/OtherSettings'
import DownloadAddInModal from './DownloadAddInModal'
import {
  createPhishingReporter,
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  generateDiagnosticTool,
  generateOutlookAddIn
} from '@/api/phishingReporter'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import DiagnosticTool from './Settings/DiagnosticTool'
import labels from '@/model/constants/labels'

export default {
  name: 'AddInConfiguration',
  components: {
    DiagnosticTool,
    AddinSettings,
    EmailSettings,
    OtherSettings,
    AppModal,
    DownloadAddInModal
  },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      step: 1,
      addingSettings: {},
      emailSettings: {},
      otherSettings: {},
      diagnosticTool: {},
      showModal: false,
      outlookSpinnerStatus: false,
      diagnosticToolSpinnerStatus: false
    }
  },
  methods: {
    closeOverlay() {
      this.resetValues()
      this.$emit('changeAddInConfigurationStatus', false)
    },
    callForGenerateOutlookAddIn() {
      generateOutlookAddIn().then((response) => {
        response.data.data && this.callForDownloadOutlookAddIn(response.data.data.resourceId)
      })
    },
    callForDownloadOutlookAddIn(resourceId) {
      downloadOutlookAddIn(resourceId)
        .then((response) => {
          this.outlookSpinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `OutlookPhishingReporter.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.outlookSpinnerStatus = true
            setTimeout(() => {
              this.callForDownloadOutlookAddIn(resourceId)
            }, 7500)
          } else {
            this.outlookSpinnerStatus = false
          }
        })
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        response.data.data && this.callForDownloadDiagnosticTool(response.data.data.resourceId)
      })
    },
    callForDownloadDiagnosticTool(id) {
      this.diagnosticToolSpinnerStatus = true
      downloadDiagnosticTool(id)
        .then((response) => {
          this.diagnosticToolSpinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `DiagnosticTool.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.diagnosticToolSpinnerStatus = true
            setTimeout(() => {
              this.callForDownloadDiagnosticTool(id)
            }, 7500)
          } else {
            this.diagnosticToolSpinnerStatus = false
          }
        })
    },
    changeStep(flag) {
      let hasValidationError = false
      let ret = null
      switch (this.step) {
        case 1:
          ret = this.$refs.refAddInSettings.submit()
          if (ret) {
            this.addingSettings = ret
            hasValidationError = false
          } else {
            hasValidationError = true
          }
          break
        case 2:
          ret = this.$refs.refEmailSettings.submit()
          if (ret) {
            this.emailSettings = ret
            hasValidationError = false
          } else {
            hasValidationError = true
          }
          break
        case 3:
          ret = this.$refs.refOtherSettings.submit()
          if (ret) {
            this.otherSettings = ret
            hasValidationError = false
          } else {
            hasValidationError = true
          }
          break
        case 4:
          ret = this.$refs.refDiagnosticTool.formValues
          this.diagnosticTool = ret
          hasValidationError = false
          break
        default:
          break
      }
      if (!hasValidationError || flag === -1) {
        this.step += flag
      }
      ret = null
    },
    submit() {
      const isOtherSettingsValid = this.$refs.refOtherSettings.submit()
      if (isOtherSettingsValid) {
        this.diagnosticTool = this.$refs.refDiagnosticTool.formValues
        this.callForCreatePhishingReporter()
      }
    },
    getEmailSettingsValues(formValues) {
      this.addingSettings = formValues
    },
    getAddinSettingsValues(formValues) {
      this.emailSettings = formValues
    },
    getOtherSettingsValues(formValues) {
      this.otherSettings = formValues
    },
    handleContinue() {
      this.showModal = false
      this.$emit('getPhishingReport')
    },
    resetValues() {
      this.addingSettings = {}
      this.emailSettings = {}
      this.otherSettings = {}
    },
    callForCreatePhishingReporter() {
      const payload = {
        ...this.addingSettings,
        ...this.emailSettings,
        ...this.otherSettings,
        ...this.diagnosticTool,
        isProcessAttachmentOnTheFly: true
      }
      const formData = new FormData()
      Object.keys(payload).map((key) => {
        formData.append(key.charAt(0).toLocaleUpperCase('en-US') + key.slice(1), payload[key])
      })

      createPhishingReporter(formData).then(() => {
        this.showModal = true
      })
    }
  }
}
</script>

<style lang="scss">
.add-in-configuration {
  &__container {
    .v-sheet.v-card {
      @media (max-width: 500px) {
        padding: 0 !important;
      }
    }
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }

  &__right-col {
    display: flex;
  }

  &__title {
    font-size: 24px !important;
    font-weight: normal;
    line-height: 1.29 !important;
    letter-spacing: normal;
    overflow: visible;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    overflow: visible;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 10;

    @media (max-width: 768px) {
      padding-left: 0 !important;
      padding-right: 0 !important;
      justify-content: space-around;
    }

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;

      box-shadow: none !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 86px;
      height: 36px !important;
    }

    &-btn-next {
      color: #ffffff !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: #2196f3;
    }

    &-btn-back {
      width: 68px;
      height: 36px !important;
      border-radius: 18px;
      border: solid 1px #00bcd4;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #00bcd4 !important;
      box-shadow: none !important;
    }
  }

  &__card {
    width: 100%;
    min-height: 100vh;
    padding: 32px 96px !important;
    @media (max-width: 700px) {
      padding: 24px !important;
    }
    padding-bottom: 100px !important;
  }

  &__items {
  }

  &__list-item {
    min-height: auto !important;
    .v-list-item__content {
      padding: 0;
    }
    .v-card-headline {
      white-space: normal;
    }
  }
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}

.btn-util {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  max-height: 36px;
  //max-width: 143px;

  @media (max-width: 768px) {
    margin: 8px 0;
  }

  .v-icon {
    font-size: 19px;
  }
}

.buttons__container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  margin-left: -4px;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 32px;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .btn-util {
    @media (max-width: 768px) {
      max-width: 143px;
    }
  }
}

.link {
  &__container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-right: 24px;
    @media (min-width: 768px) {
      margin-right: 32px;
    }
  }

  &__text {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
  }

  &__header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__sub-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

.overlay {
  &__footer {
    display: flex;
    justify-content: space-between;
    width: 100%;

    &-text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
      cursor: pointer;
      text-transform: uppercase;
      text-decoration: none;
    }
  }

  &__container {
    border-radius: 12px;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(80, 80, 80, 0.12);
    overflow-y: auto;
    height: 100%;
    max-height: 430px !important;

    @media (min-width: 600px) {
      max-width: 600px !important;
    }
  }
}

.v-card-sub-header {
  font-family: 'Open Sans', sans-serif !important;

  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
}

.w-100 {
  width: 100%;
}

.logos {
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }

  &-buttons__container {
    display: flex;
    width: 100%;
    flex-direction: column;
    @media (max-width: 768px) {
      flex-direction: row;
    }
  }
}
.modal__container {
  @media (max-width: 768px) {
    padding: 0 !important;
  }
}

.download-add-in {
  .v-overlay__content {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0) !important;
    height: 100%;
  }
  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
  }
  &__link {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3 !important;
  }
}
</style>
