<template>
  <v-container fill-height fluid tag="div">
    <v-list-item class="pl-0 other-settings__list-item" style="max-width: 100%;" v-if="showHeader">
      <v-list-item-content>
        <v-list-item-title class="diagnostic-tool__title">
          Diagnostic Tool
        </v-list-item-title>
        <v-list-item-subtitle class="diagnostic-tool__sub-title mb-6">
          Helper tool for checking status of add-in and diagnose problems
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <a
          href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
          class="other-settings__link"
          target="_blank"
        >
          Installation and configuration guide
        </a>
      </v-list-item-content>
    </v-list-item>
    <div class="diagnostic-tool" id="diagnostic-tool">
      <v-list-item class="px-0 diagnostic-tool__list-item">
        <v-list-item-content>
          <div class="diagnostic-tool__list-item-header" v-if="!isInModal">Optional Features</div>
          <v-checkbox
            class="diagnostic-tool__checkbox k-checkbox"
            color="#2196f3"
            label="Check and enable all disabled add-ins automatically"
            v-model="formValues.isEnableAddIn"
          ></v-checkbox>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div class="diagnostic-tool__footer" v-if="showFooter">
      <v-btn
        @click="submit()"
        class="white--text diagnostic-tool__btn-util diagnostic-tool__btn-save-changes"
        color="#2196f3"
        rounded
      >
        SAVE CHANGES
      </v-btn>
      <v-btn
        @click="submit(true)"
        class="white--text diagnostic-tool__btn-util ml-3"
        color="#00bcd4"
        rounded
      >
        <v-icon left>mdi-download</v-icon>
        Save And Download
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateDiagnosticTool, downloadDiagnosticTool } from '../../../api/phishingReporter'

export default {
  name: 'DiagnosticTool',
  props: {
    isInModal: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formValues: {
        isEnableAddIn: false
      },
      spinnerStatus: false,
      menu2: false,
      showTimePicker: false,
      intervalItems: ['Daily', 'Weekly', 'Monthly'],
      dayItems: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  computed: {
    ...mapGetters({
      timezones: 'common/getTimezones'
    })
  },
  methods: {
    submit(isAddIn = false) {
      this.$emit('updateForm', { ...this.formValues, isAddIn })
      return this.formValues
    },
    getFormValues() {
      return this.formValues
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        this.callForDownloadDiagnosticTool(response.data.data.transactionId)
      })
    },
    callForDownloadDiagnosticTool(id) {
      this.spinnerStatus = true
      downloadDiagnosticTool(id)
        .then((response) => {
          this.spinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `DiagnosticTool.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.spinnerStatus = true
            setTimeout(() => {
              this.callForDownloadDiagnosticTool(id)
            }, 7500)
          } else {
            this.spinnerStatus = false
          }
        })
    }
  },
  created() {
    if (this.formData) {
      this.formValues.isEnableAddIn = this.formData.isEnableAddIn
    }
  }
}
</script>

<style lang="scss">
.diagnostic-tool {
  width: 100%;

  &__form-container {
    display: flex;
    margin-left: 16px !important;
    margin-top: -4px;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0 !important;
    }
  }

  .mdi-clock-outline {
    margin-top: 3.5px !important;
    margin-right: -8px;
  }

  .v-label {
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__title {
    font-size: 24px;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__sub-title {
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: normal;
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__select {
    max-width: 125px;
    @media (max-width: 768px) {
      max-width: 100% !important;
      width: 100% !important;
    }
  }

  &__checkbox {
    @media (min-width: 768px) {
      margin-top: 12px !important;
    }
    @media (max-width: 768px) {
      margin-top: 9px !important;
    }
    .v-input__slot {
      margin-bottom: 0 !important;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 6px;
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      margin-top: 0;
    }
  }

  &__link {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    text-align: center;

    &-container {
      display: flex;
      justify-content: flex-end;
      flex-basis: 100%;
    }
  }

  &__textfield {
    max-width: 123px;
    @media (max-width: 768px) {
      max-width: 104% !important;
      //width: 100% !important;
    }
  }

  &__list-item {
    padding: 0;
    &-text {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;

      &--special {
        &-1 {
          margin-left: 25px;
        }

        &-2 {
          margin-top: -8px !important;
        }
      }
    }

    .v-list-item__content {
      padding: 0 !important;
      overflow: visible;
    }
    &-header {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    &-sub-header {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
    }
  }

  &__text {
    margin: 12px 8px !important;
    @media (max-width: 768px) {
      margin: 0 !important;
    }

    &--timezone {
      margin-left: 32px !important;
      margin-right: 16px !important;
      font-size: 14px;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      @media (max-width: 768px) {
        margin-left: 0 !important;
        margin-top: 0 !important;
      }
    }
  }

  &__btn-util {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    max-height: 36px;

    @media (max-width: 768px) {
      margin: 8px 0;
    }

    .v-icon {
      font-size: 19px;
    }

    &.v-btn--disabled {
      .v-btn__content {
        color: white !important;
        .v-icon {
          color: white !important;
        }
      }
    }
  }

  &__btn-save-changes {
    @media (max-width: 768px) {
    }
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }
}

.p-0 {
  padding: 0 !important;
}

.timezone-in-modal {
  width: 104px !important;
  margin-top: -1px !important;
  margin-left: 0 !important;
  @media (max-width: 768px) {
    width: 100% !important;
  }
}

.select-in-modal {
  margin-top: -15px !important;
  margin-left: -44px !important;
  @media (max-width: 768px) {
    margin: 0 !important ;
  }
}
</style>
