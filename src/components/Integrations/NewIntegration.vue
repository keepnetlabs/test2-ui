<template>
  <div class="new-integration">
    <v-overlay
      fixed
      :value="showConfirmModal"
      :z-index="9999"
      class="new-integration__confirm-modal"
      :style="showConfirmModal ? 'background-color:white' : ''"
    >
      <v-card light class="new-integration__confirm-modal__container">
        <h2 class="new-integration__confirm-modal__header">
          Are you sure to upload files to this service?
        </h2>
        <p class="new-integration__confirm-modal__content">
          Files may carry sensitive information about your company
        </p>
        <div class="new-integration__confirm-modal__footer">
          <button
            class="new-integration__confirm-modal__btn-continue mr-3"
            color="#2196f3"
            rounded
            @click="saveButtonClickOnConfirmModal"
          >
            YES, CONTINUE
          </button>
          <button
            class="new-integration__confirm-modal__btn-cancel"
            rounded
            @click="cancelClickOnConfirmModal"
          >
            CANCEL
          </button>
        </div>
      </v-card>
    </v-overlay>
    <app-modal
      :status="showModal"
      v-if="showModal"
      icon-name="mdi-plus"
      :title="integrationId ? 'Edit Integration' : 'New Integration'"
    >
      <template v-slot:overlay-body>
        <v-list-item class="pl-0 pr-0">
          <v-list-item-content>
            <v-list-item-title class="new-integration__title">
              {{ integrationId ? 'Edit Integration' : 'Add New Integration' }}
            </v-list-item-title>
            <v-list-item-subtitle class="new-integration__subtitle">
              Add new integration to your Integrations
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-form ref="form" lazy-validation>
          <v-list-item class="px-0 mt-8">
            <v-list-item-content>
              <label class="new-integration__label" for="integration-name">Integration Name</label>
              <v-text-field
                placeholder="Enter Name"
                outlined
                dense
                class="new-integration__textfield mt-2"
                v-model.trim="formValues.name"
                required
                :rules="[nameValidation.required, nameValidation.empty]"
                id="integration-name"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-content>
              <label class="new-integration__label" for="description">Description</label>
              <v-text-field
                placeholder="Enter description"
                outlined
                dense
                class="new-integration__textfield mt-2"
                v-model.trim="formValues.description"
                required
                :rules="[descriptionValidation.required, descriptionValidation.empty]"
                id="description"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-content>
              <label class="new-integration__label" for="integration-type">Integration Type</label>
              <v-select
                :items="integrationTypes"
                v-model.trim="formValues.analysisEngineTypeResourceId"
                outlined
                class="new-integration__select mt-2"
                required
                :rules="[integrationTypeRules.required, integrationTypeRules.empty]"
                dense
                placeholder="Select integration type"
                item-text="name"
                item-value="resourceId"
                height="40"
                @input="handleIntegrationTypeChange"
              ></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-content>
              <label class="new-integration__label" for="api-url">API URL</label>
              <v-text-field
                placeholder="Enter API URL"
                outlined
                dense
                class="new-integration__textfield mt-2"
                v-model.trim="formValues.apiUrl"
                required
                :rules="[apiUrlRules.required, apiUrlRules.format]"
                @input="handleApiKeyChange"
                id="api-url"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-content>
              <v-list-item-title class="new-integration__label">
                API Key
              </v-list-item-title>
              <v-list-item-subtitle class="new-integration__api-key__subtitle">
                Enter API Key generated by the provider
              </v-list-item-subtitle>
              <div
                v-for="(item, index) in formValues.apiKeys"
                :key="item.status"
                class="position-relative new-integration__api-keys"
              >
                <div class="max-width__form">
                  <v-text-field
                    placeholder="Enter API Key"
                    outlined
                    dense
                    class="new-integration__textfield new-integration__api-key__textfield mt-2"
                    :class="item.status === 'failed' ? 'connection-error-state__border' : ''"
                    v-model.trim="item.value"
                    required
                    :rules="[apiKeyRules.required]"
                    @input="handleApiKeyChange"
                    height="40"
                  ></v-text-field>
                  <div
                    class="connection-error-state"
                    v-if="item.status === 'failed' && item.value.length > 0"
                  >
                    {{ item.errorMessage || 'Error' }}
                  </div>
                  <div class="new-integration__api-keys__connection-status" v-if="!!item.status">
                    <v-icon
                      medium
                      left
                      class="ml-1 loading-spin"
                      v-if="item.status == 'loading'"
                      color="#00bcd4"
                      >mdi-rotate-left</v-icon
                    >
                    <v-icon medium left class="ml-1" v-if="item.status == 'success'" color="#43a047"
                      >mdi-check</v-icon
                    >
                    <v-icon
                      medium
                      left
                      class="ml-1"
                      color="#f56c6c"
                      v-if="item.status == 'failed' && loadingState.length"
                      >mdi-close</v-icon
                    >
                    <div v-if="item.status == 'failed' && !loadingState.length">
                      <button
                        class="retry-button"
                        @click="retryTestConnection(item)"
                        :class="{
                          'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                        }"
                      >
                        RETRY
                      </button>
                    </div>
                  </div>
                  <div
                    class="new-integration__api-keys__delete"
                    :style="{ right: item.status ? '-100px' : '-40px' }"
                  >
                    <v-icon
                      medium
                      left
                      class="ml-2"
                      v-if="formValues.apiKeys.length > 1"
                      @click="formValues.apiKeys.splice(index, 1)"
                      >mdi-delete</v-icon
                    >
                  </div>
                </div>
              </div>
              <div></div>
              <div class="new-integration__api-key__footer">
                <div class="new-integration__api-key__footer-left-side" @click="addApiKey">
                  <v-icon color="#2196f3" style="cursor: pointer !important;">mdi-plus</v-icon>
                  <div class="ml-2 new-integration__api-key__text">ADD API KEY</div>
                </div>
                <div
                  class="new-integration__api-key__text"
                  :class="{
                    'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                  }"
                  @click="testConnection(false)"
                >
                  <div v-if="loadingState.length" class="test-connection">
                    <v-icon medium left class="ml-1 loading-spin" color="#00bcd4"
                      >mdi-rotate-left</v-icon
                    >
                    TESTING CONNECTION
                  </div>
                  <div
                    v-else
                    class="test-connection"
                    :class="{
                      'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                    }"
                  >
                    TEST CONNECTION
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0 mt-3">
            <v-list-item-content>
              <v-list-item-title class="new-integration__label">
                Tags
              </v-list-item-title>
              <v-list-item-subtitle class="new-integration__api-key__subtitle">
                Use enter key to use tags
              </v-list-item-subtitle>
              <div class="max-width__form new-integration__api-key__combobox">
                <v-combobox
                  :items="[]"
                  placeholder="Enter Tag"
                  outlined
                  class="edit-select standard-height mt-2"
                  item-text="name"
                  multiple
                  dense
                  deletable-chips
                  persistent-hint
                  small-chips
                  :return-object="false"
                  v-model.trim="formValues.tags"
                  required
                ></v-combobox>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-content class="pl-3">
              <v-switch v-model="formValues.isActive" color="#2196f3" label="Active" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0" v-if="selectedIntegrationType.isSendUrl">
            <v-list-item-content class="pl-3">
              <v-switch v-model="formValues.isSendUrl" label="Send URL" />
            </v-list-item-content>
          </v-list-item>
          <div
            class="new-integration__api-key__subtitle__upload-subtitle position-relative checkbox-tooltip"
            v-if="formValues.isSendUrl && selectedIntegrationType.isSendUrl"
          >
            <v-checkbox
              class="black--text"
              dense
              v-model="formValues.isHideUrlParameter"
              color="#2196f3"
              :label="`Hide URL Parameters`"
            ></v-checkbox>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-icon v-on="{ ...tooltip }">mdi-help-circle</v-icon>
              </template>
              <span class="tooltip-span">{{ 'Send URLs without query string parameters' }}</span>
            </v-tooltip>
          </div>
          <v-list-item class="px-0" v-if="selectedIntegrationType.isSendFileHash">
            <v-list-item-content class="pl-3">
              <v-switch v-model="formValues.isSendFileHash" label="Send file hash" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0" v-if="selectedIntegrationType.isSendFile">
            <v-list-item-content class="pl-3">
              <v-switch
                v-model="formValues.isUploadExecutableFile"
                label="Upload executables files"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0" v-if="selectedIntegrationType.isSendFile">
            <v-list-item-content class="pl-3">
              <v-switch
                v-model="formValues.isUploadOtherFileType"
                @change="
                  formValues.isUploadOtherFileType
                    ? (showConfirmModal = true)
                    : (showConfirmModal = false)
                "
                label="Upload other files"
              />
            </v-list-item-content>
          </v-list-item>
          <div class="mb-8 new-integration__api-key__subtitle__upload-subtitle">
            Uploading the originally attached files to integrated services may lead sensitive
            information to be compromised
          </div>
          <div
            class="mb-8 new-integration__api-key__subtitle__upload-subtitle"
            v-if="formValues.isUploadOtherFileType"
          >
            <div class="d-flex align-center">
              <span class="mb-7 mr-4 type-text">File Types</span>
              <v-select
                :items="uploadFileTypes"
                v-model.trim="formValues.uploadFileTypes"
                outlined
                class="new-integration__select"
                required
                dense
                placeholder="Select integration type"
                height="40"
                item-text="name"
                item-value="resourceId"
                multiple
              ></v-select>
            </div>
          </div>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <v-btn class="new-integration__footer-btn-cancel" rounded @click="closeOverlay">
          CANCEL
        </v-btn>
        <div class="new-integration__footer__right-col">
          <v-btn
            class="new-integration__footer-btn-save white--text"
            color="#2196f3"
            rounded
            @click="submit"
          >
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import {
  getIntegrationTypes,
  getFileTypes,
  createIntegration,
  getIntegrationDetails,
  updateIntegration,
  testAnalysis
} from '../../api/integrations'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppModal from '../AppModal'
export default {
  name: 'NewIntegration',
  components: {
    AppModal
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    integrationId: {
      type: String
    }
  },
  data() {
    return {
      loadingState: [],
      formValues: {
        description: null,
        analysisEngineTypeResourceId: null,
        tags: [],
        isActive: true,
        isSendUrl: false,
        isSendFileHash: false,
        isUploadExecutableFile: false,
        isUploadOtherFileType: false,
        apiKeys: [{ value: '', status: null }],
        isHideUrlParameter: false,
        uploadFileTypes: [],
        name: null,
        apiUrl: null
      },
      selectedIntegrationType: {
        isSendUrl: false,
        isSendFileHash: false,
        isSendFile: false
      },
      integrationTypes: [],
      uploadFileTypes: [],
      isTestConnectionDisabled: true,
      showConfirmModal: false,
      nameValidation: {
        required: (v) => (v && v.length <= 150) || 'Integration Name must between 1-150 characters',
        empty: (v) => (v && !v.startsWith(' ')) || 'Integration Name cannot start with space'
      },
      descriptionValidation: {
        required: (v) => (v && v.length <= 150) || 'Description must between 1-150 characters',
        empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      integrationTypeRules: {
        required: (v) => !!v || 'Integration Select required',
        format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space'
      },
      apiUrlRules: {
        required: (v) => (v && v.length <= 1000) || 'It must between 1 - 1000 characters',
        format: (v) =>
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
            v
          ) || 'invalid url'
      },
      apiKeyRules: {
        required: (v) => (v && v.length <= 150) || 'Api key must between 1-150 characters',
        format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space'
      }
    }
  },
  created() {
    if (this.integrationId) this.updateVModel(this.integrationId)
    getIntegrationTypes()
      .then((response) => {
        const {
          data: { data, status }
        } = response

        this.integrationTypes = data
        this.selectedIntegrationType =
          this.integrationTypes.find(
            (item) => item.resourceId === this.formValues.analysisEngineTypeResourceId
          ) || {}
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting integrations type!'
        })
      })
  },
  methods: {
    saveIntegration() {
      const data = { ...this.formValues }
      data.apiKeys = data.apiKeys.map((i) => i.value)
      if (this.integrationId) {
        updateIntegration(this.integrationId, data)
          .then((response) => {
            this.closeOverlay()
            this.showConfirmModal = false
            this.$store.dispatch('common/createSnackBar', {
              errorState: false,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Integration updated successfuly!'
            })
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when updating integration!'
            })
          })
      } else {
        createIntegration(data)
          .then((response) => {
            this.closeOverlay()
            this.showConfirmModal = false
            this.$store.dispatch('common/createSnackBar', {
              errorState: false,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Integration created successfuly!'
            })
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when creating new integration!'
            })
          })
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.testConnection(true)
      }
    },
    closeOverlay() {
      this.$emit('closeOverlay', false, true)
    },
    getTestConnectionDisableStatus() {
      if (
        this.formValues.apiUrl &&
        this.formValues.apiKeys[0].value.length > 0 &&
        typeof this.apiUrlRules.format(this.formValues.apiUrl) !== 'string'
      ) {
        return false
      } else {
        return true
      }
    },
    saveButtonClickOnConfirmModal() {
      if (!this.uploadFileTypes.length) this.getFileTypes()
      this.showConfirmModal = false
    },
    getFileTypes() {
      getFileTypes()
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.uploadFileTypes = data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting file types! '
          })
        })
    },
    addApiKey() {
      this.isTestConnectionDisabled = true
      this.formValues.apiKeys.push({ value: '', status: null })
    },
    handleApiKeyChange() {
      if (!this.formValues.apiUrl) return true
      this.formValues.apiKeys.map((item) => {
        this.isTestConnectionDisabled = false
        if (!item.value.length) {
          this.isTestConnectionDisabled = true
          return true
        }
      })
    },
    cancelClickOnConfirmModal() {
      this.formValues.uploadFileTypes = []
      this.formValues.isUploadOtherFileType = false
      this.showConfirmModal = false
    },
    updateIntegration() {
      updateIntegration()
        .then((response) => {})
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when updating the integration!'
          })
        })
    },
    updateVModel(id) {
      this.getFileTypes()
      getIntegrationDetails(id)
        .then((response) => {
          response['data'].data.apiKeys = response['data'].data.apiKeys.map((item) => {
            return { value: item, status: null }
          })
          const integrationData = response['data'].data
          this.formValues = integrationData
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting integration details!'
          })
        })
    },
    resetValues() {
      this.formValues = {
        description: null,
        analysisEngineTypeResourceId: null,
        tags: null,
        isActive: true,
        isSendUrl: false,
        isSendFileHash: true,
        isUploadExecutableFile: true,
        isUploadOtherFileType: false,
        apiKeys: [{ value: '', status: null }],
        isHideUrlParameter: false,
        uploadFileTypes: [],
        name: null,
        apiUrl: null
      }
    },
    retryTestConnection(item) {
      item.status = 'loading'
      this.loadingState.push('loading')
      testAnalysis(this.formValues.analysisEngineTypeResourceId, item.value)
        .then((response) => {
          if (response.data.status === 'FAILED') {
            item.status = 'failed'
            this.formValues.apiKeys[i].errorMessage = response.data.message
          } else {
            item.status = 'success'
          }
          item.status = 'success'
        })
        .catch((error) => {
          item.status = 'failed'
          if (error.response.data.Message === 'Internal server error') {
            item.errorMessage = 'Error when testing connections!'
          } else {
            item.errorMessage = error.response.data.message || error.response.data.Message
          }
        })
        .finally(() => this.loadingState.shift('loading'))
    },
    testConnection(isSave) {
      for (let i = 0; i < this.formValues.apiKeys.length; i++) {
        const item = this.formValues.apiKeys[i]
        this.formValues.apiKeys[i].status = 'loading'
        this.loadingState.push('loading')
        testAnalysis(this.formValues.analysisEngineTypeResourceId, item.value)
          .then((response) => {
            if (response.data.status === 'FAILED') {
              this.formValues.apiKeys[i].status = 'failed'
              this.formValues.apiKeys[i].errorMessage = response.data.message
            } else {
              this.formValues.apiKeys[i].status = 'success'
            }
          })
          .catch((error) => {
            this.formValues.apiKeys[i].status = 'failed'
            if (error.response.data.Message === 'Internal server error') {
              this.formValues.apiKeys[i].errorMessage = 'Error when testing connections!'
            } else {
              this.formValues.apiKeys[i].errorMessage =
                error.response.data.message || error.response.data.Message
            }
          })
          .finally(() => {
            this.loadingState.shift('loading')
            if (
              isSave &&
              !this.loadingState.length &&
              !this.formValues.apiKeys.find((item) => item.status === 'failed')
            )
              this.saveIntegration()
          })
      }
    },
    handleIntegrationTypeChange(val) {
      this.selectedIntegrationType = this.integrationTypes.find((item) => item.resourceId === val)
    }
  },
  destroyed() {},
  watch: {
    formValues(val) {
      this.selectedIntegrationType =
        this.integrationTypes.find(
          (item) => item.resourceId === val.analysisEngineTypeResourceId
        ) || {}
    }
  }
}
</script>

<style lang="scss">
.loading-spin {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.position-relative {
  position: relative;
}
.max-width__form {
  position: relative;
  max-width: 554px !important;
}
.new-integration {
  .edit-select {
    .v-input__append-inner {
      display: none;
    }
  }
  .new-integration__api-key__textfield {
    .v-text-field__details {
      margin-bottom: 0;
    }
  }
  .connection-error-state {
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ff5252 !important;

    position: absolute;
    top: 42px;
    left: 13px;
    &__border {
      fieldset {
        border-color: #d0021b;
      }
    }
  }
  .test-connection {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #00bcd4;
  }
  .retry-button {
    color: #f56c6c;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
  }
  &__container {
    padding: 24px 0 0 96px !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  &__api-keys {
    &:hover {
      .new-integration__api-keys__delete {
        display: flex;
      }
    }
    &__connection-status {
      width: 44px;
      height: 40px;
      color: #757575;
      position: absolute;
      right: -50px;
      top: 6px;
      justify-content: center;
    }
    &__delete {
      width: 44px;
      height: 40px;
      color: #757575;
      position: absolute;
      right: -40px;
      top: -2px;
      justify-content: center;
      display: none;
    }
  }

  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      background-color: white;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      padding-bottom: 68px !important;
    }
  }

  &__title {
    font-family: 'Open Sans', sans-serif !important;
    opacity: 0.9;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    margin-top: 31px !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__subtitle {
    opacity: 0.9;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  &__select {
    max-width: 554px !important;
  }

  &__textfield {
    max-width: 554px !important;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;

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

    &-btn-save {
      color: #ffffff;
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
  }

  &__api-key {
    &__subtitle {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      &__upload-subtitle {
        margin-left: 60px;
      }
    }

    &__combobox {
      .v-input input {
        max-height: 38px !important;
      }
    }

    &__textfield {
      ::v-deep .v-text-field__details {
        display: none !important;
      }
    }

    &__footer {
      display: flex;
      max-width: 554px !important;
      justify-content: space-between;
      align-items: center;
      margin-top: -7px;

      &-left-side {
        display: flex;
        justify-content: center;
        align-items: center;
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
      cursor: pointer;
    }

    &__test-text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #757575 !important;
      opacity: 0.8;
    }
    &__disabled-text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #757575 !important;
      opacity: 0.8;
      pointer-events: none !important;
    }
  }

  &.v-card {
    padding: 24px 0 0 96px !important;
  }

  .v-input--switch {
    .v-label {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .type-text {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .v-list-item__content {
    padding: 0 !important;
  }
  .v-input--checkbox {
    .v-messages {
      display: none;
    }
  }
  .checkbox-tooltip {
    .mdi-help-circle {
      position: absolute;
      top: 3px;
      left: 180px;
    }
  }
}
.new-integration__confirm-modal {
  .v-overlay__scrim {
    opacity: 0 !important;
    background-color: white !important;
  }
  &__header {
    padding: 32px 24px;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3;
  }
  &__content {
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
    padding: 8px 24px;
  }
  &__footer {
    padding: 16px 24px;
    text-align: right;
  }
  &__btn-continue {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
  }
  &__btn-cancel {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #f56c6c;
  }
}
</style>
