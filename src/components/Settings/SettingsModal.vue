<template>
  <app-dialog
    :status="showSettingsModalStatus"
    v-if="showSettingsModalStatus"
    icon="mdi-cog"
    :title="getTitle"
    size="big"
    @changeStatus="$emit('changeSettings')"
    :max-height-size="'500'"
  >
    <template v-slot:app-dialog-body>
      <div v-if="loadingSettingsModal">
        <PostCardLoading :loading="loadingSettingsModal" />
      </div>
      <div v-else>
        <v-card-text class="setting-modal">
          <div class="settings-modal-wrapper">
            <v-row align="center" justify="center">
              <v-col sm="12" class="p-0">
                <v-form ref="settingsRef">
                  <div class="mb-8">
                    <label class="settings-modal-wrapper__label d-block">Timezone</label>
                    <label class="settings-modal-wrapper__label--sub d-block mb-2"
                      >Select your timezone</label
                    >
                    <k-select
                      type="autocomplete"
                      v-model.trim="formValues.timeZoneId"
                      id="input--settings-modal"
                      :items="timeZoneList"
                      persistent-hint
                      dense
                      item-text="displayName"
                      item-value="id"
                      outlined
                      placeholder="Select your timezone"
                      :search-input.sync="timeZoneSearchVal"
                    ></k-select>
                  </div>
                  <div class="mb-8">
                    <label class="settings-modal-wrapper__label d-block mb-2">Date Format</label>
                    <v-radio-group
                      v-model="formValues.dateFormat"
                      id="input--settings-modal-type"
                      :mandatory="true"
                      hide-details
                    >
                      <v-radio
                        v-for="item in dateFormatList"
                        :key="item"
                        :id="`input--settings-modal-type-${item}`"
                        :value="item"
                        :label="`${item} ${moment(new Date()).format(item)}`"
                        color="#2196f3"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <div>
                    <label class="settings-modal-wrapper__label d-block mb-2">Time Format</label>
                    <v-radio-group
                      v-model="formValues.timeFormat"
                      id="input--settings-modal-type"
                      :mandatory="true"
                      hide-details
                    >
                      <v-radio
                        v-for="item in timeFormatList"
                        :key="item"
                        id="input--settings-modal-type-12h"
                        :value="item"
                        :label="`${item} ${item === '12h' ? '06:25 PM' : '18:25'}`"
                        color="#2196f3"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" class="k-dialog__button" @click="$emit('changeSettings')">{{
            labels.Cancel
          }}</v-btn>
          <v-btn text color="#2196f3" class="k-dialog__button" @click="setSystemUserSettings()">{{
            labels.Confirm
          }}</v-btn>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getSystemUserSettings, getTimezone, setSystemUserSettings } from '@/api/settings'
import KSelect from '@/components/Common/Inputs/KSelect'
import { deepCopyArray } from '@/utils/functions'
import moment from 'moment'

export default {
  name: 'SettingsModal',
  props: {
    showSettingsModalStatus: { required: true }
  },
  components: {
    PostCardLoading,
    KSelect,
    AppDialog
  },
  data() {
    return {
      moment,
      labels,
      loadingSettingsModal: false,
      formValues: {
        timeZoneId: null,
        timeZoneName: null,
        dateFormat: null,
        timeFormat: null
      },
      dateFormatList: [],
      timeFormatList: [],
      timeZoneList: [],
      defaultTimeZoneList: [],
      timeZoneSearchVal: null
    }
  },
  created() {
    this.getTimezone()
  },
  computed: {
    getTitle() {
      let title = labels.Settings
      return title
    }
  },
  methods: {
    setSystemUserSettings() {
      setSystemUserSettings(this.formValues).then((response) => {
        this.$emit('changeSettings')
      })
    },
    getTimezone() {
      this.loadingSettingsModal = true
      getTimezone()
        .then((response) => {
          let data = response.data.data
          this.timeZoneList = data.timeZoneList
          this.defaultTimeZoneList = deepCopyArray(data.timeZoneList)
          this.dateFormatList = data.dateFormatList
          this.timeFormatList = data.timeFormatList
          this.getSystemUserSettings()
        })
        .catch(() => {
          this.loadingSettingsModal = false
        })
    },
    getSystemUserSettings() {
      getSystemUserSettings()
        .then((response) => {
          this.formValues = response.data.data
        })
        .finally(() => {
          this.loadingSettingsModal = false
        })
    }
  },
  watch: {
    timeZoneSearchVal(newVal, oldVal) {
      if (newVal && newVal.length && oldVal !== null) {
        this.timeZoneList = this.defaultTimeZoneList.reduce((acc, item) => {
          if (item.displayName.toLocaleLowerCase().includes(newVal.toLocaleLowerCase())) {
            acc.push(item)
          }
          return acc
        }, [])
      } else {
        this.timeZoneList = this.defaultTimeZoneList
      }
    }
  }
}
</script>

<style lang="scss">
.setting-modal {
  padding: 0 !important;

  .v-radio .v-label {
    font-size: 14px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.5 !important;
    letter-spacing: normal !important;
    color: #383b41 !important;
  }
  .v-input--selection-controls {
    margin-top: 8px !important;
  }
  .v-text-field__details {
    display: none !important;
  }
  .v-text-field__slot {
    input {
      pointer-events: none;
    }
  }
  &__list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .settings-modal-wrapper {
    .row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .v-btn {
      min-width: 95px;
    }
    &__label {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      &--sub {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #383b41;
      }
    }
  }
  .reset-pass-textfield {
    padding: 0 15px !important;
  }
  .login-error-container {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
    width: 100%;
  }

  .login-error-wrapper {
    width: 300px;
    border-radius: 3px;
    background-color: rgba(245, 108, 108, 0.2);
    padding: 22px 16px;
    display: flex;
    flex-direction: row;

    .login-error-icon {
      i {
        font-size: 24px !important;
        margin-bottom: -1px;
      }
    }

    .login-error-message {
      align-self: center;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
    }
  }

  .reset-password-wrapper {
    .v-text-field.v-text-field--solo .v-input__control {
      min-height: 20px !important;
      padding: 0;
    }
    &__success {
      min-height: 300px;
    }
  }

  .forgot-password {
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
    font-size: 11px;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
  }

  .login-remember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-input--checkbox {
      label.v-label.theme--light {
        font-size: 11px;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87) !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light {
        font-size: 20px !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.accent--text {
        font-size: 20px !important;
      }
    }
  }

  .mdi-eye-off-outline::before {
    color: rgba(0, 0, 0, 0.26);
  }

  .v-input .v-label {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    height: 20px;
    font-weight: 600;
  }

  .login-desc {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
    margin-bottom: 32px;
  }

  .login-title {
    margin-top: 88px;
    margin-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 36px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }

  .v-sheet {
    border-radius: 20px;
  }

  .v-card-login-wrapper {
    border-radius: 20px !important;
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
  }

  .background {
    height: 100%;
    width: 100%;
    background-image: url('../../assets/img/login-bg.svg') !important;
    background-position: left top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }

  .v-input--selection-controls__ripple {
    margin-right: 0 !important;
    width: 20px !important;
    height: 20px !important;
    left: -5px !important;
    top: calc(50% - 17px) !important;
  }

  .remember-me-check {
    &.v-input--checkbox.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
      height: auto !important;
    }
    padding-left: 5px;

    label {
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400 !important;
      font-size: 9px;
      left: -8px !important;
    }
  }

  .login-btn {
    height: 36px !important;
    min-width: 132px !important;
  }

  .captcha-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    width: 100%;
    margin-top: 16px;

    > div {
      max-width: 300px;
    }
  }

  .login-user-pass-wrapper > .row > div {
    max-width: 300px;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .login-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  @media only screen and (max-width: 769px) {
    .login-card-wrapper {
      padding: 10px !important;
      padding-right: 16px !important;
    }
  }
}
</style>
