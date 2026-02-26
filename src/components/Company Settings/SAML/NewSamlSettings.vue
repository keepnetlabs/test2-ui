<template>
  <app-modal
    v-if="status"
    confirm-button-id="btn-save--saml-settings-modal"
    cancel-button-id="btn-cancel--saml-settings-modal"
    title-id="text--create-saml-settings-modal-title"
    :status="status"
    :id="getId"
    :saveDisable="saveDisable"
    :title="getTitle"
    icon-name="mdi-key"
    class-name="new-saml-setting"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template #overlay-body>
      <batch-import-popup
        v-if="isBatchImportPopupOpen"
        :status="isBatchImportPopupOpen"
        @on-close="toggleBatchImportPopup"
        @on-confirm="handleBatchImport"
      />
      <app-modal-body-header
        :title="getTitle"
        :sub-title="isEdit ? labels.SamlModalBodyEditSubTitle : labels.SamlModalBodySubTitle"
      />
      <v-form ref="refForm">
        <form-group
          :title="labels.SAMLSettingName"
          :sub-title="labels.SAMLSettingNameSubtitle"
          has-hint
        >
          <InputEntityName
            v-model.trim="formValues.name"
            id="input--saml-settings-name"
            entity-name="saml"
          />
        </form-group>
        <form-group
          class-name="input-copy-to-clipboard"
          :title="labels.AllowedDomains"
          :sub-title="labels.SamlDomainSubLabel"
        >
          <v-form
            v-model="isDomainToAddFormValid"
            ref="refDomainToAddForm"
            onSubmit="return false;"
          >
            <div class="copy-to-clipboard__container saml-domain">
              <v-text-field
                v-model.trim="formValues.domainToAdd"
                id="input--saml-settings-domain-to-add"
                placeholder="Enter Domain name"
                style="max-width: 428px;"
                outlined
                dense
                persistent-hint
                hint="*Required"
                :rules="[
                  (v) => {
                    if (v.length) return true
                    else if (!dataContainerWithSearchItems.length) {
                      return labels.Required
                    } else return true
                  },
                  (v) =>
                    validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Domain, 256)),
                  (v) => {
                    if (v.length) return validations.domain(v, labels.InvalidDomainName)
                    else if (!dataContainerWithSearchItems.length) {
                      return labels.InvalidDomainName
                    } else return true
                  }
                ]"
              ></v-text-field>
              <v-btn
                outlined
                rounded
                color="#2196F3"
                class="btn-domain-add ml-10"
                :style="getAddDomainButtonStyle"
                @click="handleDomainToAddButtonClick"
              >
                <v-icon left>mdi-plus</v-icon>
                Add</v-btn
              >
            </div>
          </v-form>
        </form-group>
        <data-container-with-search
          v-if="dataContainerWithSearchItems.length"
          v-model="dataContainerWithSearchItems"
        />
        <button
          id="btn-import--saml-settings"
          class="ip-restriction__button mb-6 ml-2"
          type="button"
          @click="handleBatchImportClick"
        >
          <v-icon medium left color="blue" class="ml-0">mdi-swap-vertical</v-icon>BATCH IMPORT
        </button>
        <form-group
          style="max-width: 648px;"
          :title="getMetadataLabel"
          :sub-title="labels.SamlMetadataSubLabel"
        >
          <form-group-horizontal-content label="Upload Metadata" class="mt-2">
            <k-file-upload
              key="metadataFile"
              id="input--saml-settings-metadata-file"
              hint="Only .xml files"
              ref="refMetadataFile"
              style="flex-basis: 62%; max-width: 400px;"
              :extensions="['xml']"
              @inputFile="onMetadataFileChange"
            />
          </form-group-horizontal-content>
        </form-group>
        <div class="mt-2" style="display: flex; align-items: center; max-width: 648px;">
          <v-divider />
          <span style="font-size: 14px; color: #383b41; margin: 0 16px;"> or</span>
          <v-divider />
        </div>

        <form-group-horizontal-content label="Issuer URL of the IdP" class="mt-4">
          <input-url
            v-model.trim="formValues.idPEntityID"
            id="input--saml-settings-id-entity-id"
            placeholder="Enter issuer URL from your provider"
            :disabled="isTextFieldsDisabled"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.startsWithSpace(v, labels.CannotStartWithSpace),
              (v) => validations.isDomainUrl(v, labels.InvalidURL),
              (v) => validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000)),
              (v) => validations.noWhitespace(v, labels.InvalidURL)
            ]"
          />
        </form-group-horizontal-content>
        <form-group-horizontal-content label="IdP SSO URL">
          <input-url
            v-model="formValues.idPSSOTargetUrl"
            id="input--saml-settings-target-url"
            :disabled="isTextFieldsDisabled"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.startsWithSpace(v, labels.CannotStartWithSpace),
              (v) => validations.isDomainUrl(v, labels.InvalidURL),
              (v) => validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000)),
              (v) => validations.noWhitespace(v, labels.InvalidURL)
            ]"
          />
        </form-group-horizontal-content>
        <form-group-horizontal-content label="Upload Certificate">
          <k-file-upload
            key="mainLogo"
            style="flex-basis: 62%; max-width: 400px;"
            id="input--saml-settings-certificate-file"
            hint="Only .cert files"
            ref="refMainLogo"
            :extensions="['cert']"
            :readonly="isTextFieldsDisabled"
            @inputFile="onFileChange"
          />
        </form-group-horizontal-content>
        <form-group-horizontal-content
          class="mt-2"
          style="align-items: baseline;"
          label="IdP Certificate"
        >
          <v-textarea
            v-model.trim="certificateText"
            outlined
            dense
            rows="2"
            no-resize
            placeholder="Enter the key from your provider"
            height="160"
            :readonly="(isCertificateTextDisabled || isTextFieldsDisabled)"
            :class="[
              (isCertificateTextDisabled || isTextFieldsDisabled) &&
                'saml-settings-text-area-disabled'
            ]"
          ></v-textarea>
        </form-group-horizontal-content>

        <form-group
          title="SAML Configuration For Your Identity Provider"
          sub-title="Share information below with your identity provider"
        >
          <form-group-horizontal-content class="mt-2 align-baseline" :label="'Download Metadata'">
            <div class="download">
              <v-btn
                outlined
                rounded
                color="#2196F3"
                class="btn-domain-add ml-10"
                @click="downloadMetadata"
              >
                <v-icon left>mdi-download</v-icon>
                DOWNLOAD METADATA</v-btn
              >
            </div>
          </form-group-horizontal-content>
        </form-group>
        <div class="mt-2" style="display: flex; align-items: center; max-width: 648px;">
          <v-divider />
          <span style="font-size: 14px; color: #383b41; margin: 0 16px;"> or</span>
          <v-divider />
        </div>
        <div class="saml-settings-disabled-area">
          <form-group-horizontal-content class="mt-2" :label="labels.IdPEntityID">
            <input-with-copy-to-clipboard copyKey="entityID" @on-copy="handleCopyToClipboard">
              <template #input>
                <v-text-field
                  v-model.trim="formValues.entityID"
                  id="input--saml-settings-entity-id"
                  placeholder="Enter Entity ID"
                  outlined
                  dense
                  disabled
                ></v-text-field>
              </template>
            </input-with-copy-to-clipboard>
          </form-group-horizontal-content>
          <form-group-horizontal-content :label="labels.SSOSignInURL">
            <input-with-copy-to-clipboard copyKey="ssoSignInUrl" @on-copy="handleCopyToClipboard">
              <template #input>
                <v-text-field
                  v-model.trim="formValues.ssoSignInUrl"
                  id="input--saml-settings-sso-sign-in-url"
                  placeholder="Enter SSO Sign-in URL"
                  outlined
                  dense
                  disabled
                ></v-text-field>
              </template>
            </input-with-copy-to-clipboard>
          </form-group-horizontal-content>
          <form-group-horizontal-content :label="labels.MetadataUrl">
            <input-with-copy-to-clipboard copyKey="metadataUrl" @on-copy="handleCopyToClipboard">
              <template #input>
                <v-text-field
                  v-model.trim="formValues.metadataUrl"
                  id="input--saml-settings-metadata-url"
                  placeholder="Enter Metadata URL"
                  outlined
                  dense
                  disabled
                ></v-text-field>
              </template>
            </input-with-copy-to-clipboard>
          </form-group-horizontal-content>
          <form-group-horizontal-content :label="labels.BypassSSOLoginURL">
            <input-with-copy-to-clipboard
              copyKey="bypassSSOLoginUrl"
              @on-copy="handleCopyToClipboard"
            >
              <template #input>
                <v-text-field
                  v-model.trim="formValues.bypassSSOLoginUrl"
                  id="input--saml-settings-bypass-sso-login-url"
                  placeholder="Enter Bypass Sso Login URL"
                  outlined
                  dense
                  disabled
                ></v-text-field>
              </template>
            </input-with-copy-to-clipboard>
          </form-group-horizontal-content>
          <form-group-horizontal-content
            class="mt-2 saml-settings__mapping"
            label="SAML Attributes Mapping"
          >
            <input-with-copy-to-clipboard
              copyKey="attributesMapping"
              @on-copy="handleCopyToClipboard"
            >
              <template #input>
                <v-textarea
                  v-model.trim="attributesMapping"
                  disabled
                  outlined
                  readonly
                  class="saml-settings-text-area-disabled mb-3"
                  dense
                  rows="2"
                  no-resize
                  placeholder="Enter the key from your provider"
                  height="160"
                ></v-textarea>
              </template>
            </input-with-copy-to-clipboard>
          </form-group-horizontal-content>
        </div>
        <div class="form-group-horizontal-content">
          <div class="form-group-horizontal-content--left">
            <v-checkbox v-model="formValues.isDefaultRole" class="saml-default-role__checkbox">
              <template #label>
                <div class="saml-default-role">
                  <label
                    for="input--saml-settings-system-user-role"
                    class="form-group-horizontal-content__label saml-default-role__label"
                  >
                    Default Role
                  </label>
                  <span class="saml-default-role__description">
                    Assign this role to new synced users
                  </span>
                </div>
              </template>
            </v-checkbox>
          </div>
          <k-select
            v-model.trim="formValues.defaultRoleResourceId"
            :key="roleSelectKey"
            id="input--saml-settings-system-user-role"
            placeholder="Select Option"
            outlined
            dense
            hint="*Required"
            persistent-hint
            :return-object="false"
            :items="roleItems"
            :disabled="!formValues.isDefaultRole"
          />
        </div>

        <form-group :title="labels.EnableSAMLSSO">
          <v-switch
            v-model="formValues.enableSAMLSSO"
            id="input--saml-settings-enable-saml-sso"
            :label="formValues.enableSAMLSSO ? labels.Active : labels.InActive"
            class="k-switch"
            color="#2196f3"
          />
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import labels from '@/model/constants/labels'
import * as validations from '@/utils/validations'
import { isDifferent, copyToClipboard, createRandomCryptStringNumber } from '@/utils/functions'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
import {
  createSamlSetting,
  getDefaultSamlSettings,
  getSamlSetting,
  parseMetadata,
  updateSamlSetting,
  downloadMetadata
} from '@/api/samlSettings'
import { downloadExportedFile } from '@/utils/helperFunctions'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
import { mapGetters } from 'vuex'
import { getSystemUsersRole } from '@/api/systemUsers'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
export default {
  name: 'NewSamlSettings',
  components: {
    InputEntityName,
    KSelect,
    FormGroupHorizontalContent,
    KFileUpload,
    BatchImportPopup,
    DataContainerWithSearch,
    InputWithCopyToClipboard,
    InputUrl,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  emits: ['on-close', 'on-success'],
  data() {
    return {
      attributesMapping:
        '{\t' +
        "    email: 'john.doe@keepnetlabs.com', //required\n" +
        "        firstName: 'John', //required\n" +
        "        lastName: 'Doe', //required\n" +
        '        spRole: \'CompanyAdmin\', //required. \n        Default is "CompanyAdmin"\n' +
        "        phoneNumber: 'Phone' //optional     } \n" +
        '',
      labels,
      validations,
      isDomainToAddFormValid: false,
      isCertificateTextDisabled: false,
      resourceId: null,
      certificateText: '',
      roleSelectKey: `key-${createRandomCryptStringNumber()}`,
      isBatchImportPopupOpen: false,
      saveDisable: false,
      dataContainerWithSearchItems: [],
      isTextFieldsDisabled: false,
      roleItems: [],
      initialFormValues: null,
      formValues: {
        name: '',
        idPEntityID: '',
        file: null,
        idPSSOTargetUrl: '',
        idPCertFingerprint: '',
        idPCertFingerprintTypeId: 1,
        entityID: '',
        metadataUrl: '',
        ssoSignInUrl: '',
        ssoSignOutUrl: '',
        ssoCallbackUrl: '',
        bypassSSOLoginUrl: '',
        enableSAMLSSO: true,
        domain: [],
        domainToAdd: '',
        defaultRoleResourceId: '',
        isDefaultRole: true
      }
    }
  },
  computed: {
    ...mapGetters({
      brandName: 'whitelabel/getBrandName'
    }),
    getMetadataLabel() {
      return `${labels.SamlConfigurationFor} ${this.brandName}`
    },
    getId() {
      return this.isEdit ? 'edit-saml-settings-modal' : 'new-saml-settings-modal'
    },
    getTitle() {
      return this.isEdit ? labels.SamlModalBodyEditTitle : labels.SamlModalBodyTitle
    },
    getAddDomainButtonStyle() {
      const style = {}
      if (!this.isDomainToAddFormValid || !this.formValues.domainToAdd) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    }
  },
  watch: {
    certificateText(val) {
      this.formValues.idPCertFingerprint = val
    }
  },
  created() {
    if (this.isEdit && this.selectedRow) {
      this.callForSamlSetting()
    }
    this.callForGetDefaultSettings().then(() => {
      this.callForRoles().then(() => {
        this.initialFormValues = structuredClone(this.formValues)
      })
    })
  },
  methods: {
    downloadMetadata() {
      downloadMetadata(this.formValues.entityID).then((response) => {
        const { data } = response
        downloadExportedFile(data, 'SAML Settings', 'XML')
      })
    },
    callForSamlSetting() {
      getSamlSetting(this.selectedRow.resourceId).then((response) => {
        const {
          data: { data }
        } = response

        const {
          entityID,
          idPCertFingerprint,
          idPCertFingerprintTypeId,
          idPSSOTargetUrl,
          name,
          domain,
          resourceId,
          statusId,
          idPEntityID,
          idPCertificateFileContent,
          defaultRoleResourceId,
          isDefaultRole
        } = data
        this.formValues.entityID = entityID
        this.formValues.idPEntityID = idPEntityID
        this.formValues.idPCertFingerprint = idPCertFingerprint
        this.formValues.idPCertFingerprintTypeId = idPCertFingerprintTypeId
        this.formValues.idPSSOTargetUrl = idPSSOTargetUrl
        this.formValues.name = name
        this.resourceId = resourceId
        this.formValues.enableSAMLSSO = !!statusId
        this.formValues.domain = domain
        this.formValues.isDefaultRole = isDefaultRole
        this.formValues.defaultRoleResourceId = defaultRoleResourceId
        this.dataContainerWithSearchItems = domain?.concat()
        this.certificateText = idPCertificateFileContent
        if (this.certificateText) {
          this.isCertificateTextDisabled = true
        }
        this.roleSelectKey = `key-${createRandomCryptStringNumber()}`
        this.$refs.refDomainToAddForm.validate()
      })
    },
    callForRoles() {
      return new Promise((res, rej) => {
        getSystemUsersRole({
          pageNumber: 1,
          pageSize: 10000,
          orderBy: 'RoleName',
          ascending: true,
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'OR',
                FilterItems: [],
                FilterGroups: []
              },
              {
                Condition: 'AND',
                FilterItems: [],
                FilterGroups: []
              }
            ]
          }
        })
          .then((response) => {
            const { data } = response.data
            this.roleItems = data.map((item) => ({
              text: item.name,
              value: item.resourceId
            }))
            if (!this.isEdit && !this.selectedRow) {
              this.formValues.defaultRoleResourceId = data.find(
                (role) => role.name === labels.CompanyAdmin
              )?.resourceId
            }
            this.roleSelectKey = `key-${createRandomCryptStringNumber()}`
            res()
          })
          .catch(() => rej('something went wrong'))
      })
    },
    handleBatchImportClick() {
      this.toggleBatchImportPopup()
    },
    callForGetDefaultSettings() {
      return new Promise((res, rej) => {
        getDefaultSamlSettings()
          .then((response) => {
            const {
              data: { data }
            } = response
            if (this.isEdit) {
              delete data.defaultRoleResourceId
              delete data.entityID
            }
            for (const key of Object.keys(data)) {
              this.formValues[key] = data[key]
            }
            res()
          })
          .catch(() => rej('something went wrong'))
      })
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (isChanged) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('on-close')
          }
        })
      } else {
        return this.$emit('on-close')
      }
    },
    handleCopyToClipboard(key = '') {
      copyToClipboard(this.formValues[key] || this[key])
    },
    handleDomainToAddButtonClick() {
      if (
        this.$refs.refDomainToAddForm.validate() &&
        !this.dataContainerWithSearchItems.some((item) => item === this.formValues.domainToAdd)
      ) {
        this.dataContainerWithSearchItems.unshift(this.formValues.domainToAdd)
        this.formValues.domainToAdd = ''
        this.$refs.refDomainToAddForm.resetValidation()
      }
    },
    onFileChange(file) {
      this.certificateText = ''
      this.formValues.file = file
      this.setCertificateText(file)
    },
    async setCertificateText(file) {
      try {
        this.certificateText = await file.text()
        this.isCertificateTextDisabled = true
      } catch (e) {
        this.certificateText = ''
      }
    },
    onMetadataFileChange(file) {
      this.callForParseMetadata(file)
    },
    callForParseMetadata(file) {
      const formData = new FormData()
      formData.append('File', file)
      parseMetadata(formData).then((response) => {
        const {
          data: { data }
        } = response
        Object.keys(data).forEach((key) => {
          this.formValues[key] = data[key]
          if (key === 'idPCertificate' && this.formValues[key]) {
            this.certificateText = this.formValues[key]
            this.formValues.idPCertFingerprint = this.formValues[key]
          }
        })
        this.isTextFieldsDisabled = true
      })
    },
    submit() {
      if (this.$refs.refForm.validate()) {
        const {
          name,
          idPSSOTargetUrl,
          idPCertFingerprint,
          idPCertFingerprintTypeId,
          entityID,
          enableSAMLSSO,
          idPEntityID,
          file,
          defaultRoleResourceId,
          isDefaultRole
        } = this.formValues
        const formData = {
          name,
          idPSSOTargetUrl,
          idPEntityID,
          idPCertFingerprint,
          idPCertFingerprintTypeId,
          entityID,
          statusId: Number(enableSAMLSSO),
          file,
          defaultRoleResourceId: isDefaultRole ? defaultRoleResourceId : null,
          domain: this.dataContainerWithSearchItems,
          isDefaultRole
        }
        this.saveDisable = true
        const payload = this.createFormDataPayload(formData)
        const promise = this.isEdit
          ? updateSamlSetting(payload, this.resourceId)
          : createSamlSetting(payload)
        promise
          .then(() => {
            this.$emit('on-success')
          })
          .finally(() => {
            this.saveDisable = false
          })
      }
    },
    createFormDataPayload(payload = {}) {
      const formData = new FormData()
      for (const key of Object.keys(payload)) {
        formData.append(key.slice(0, 1).toUpperCase() + key.slice(1), payload[key])
      }
      return formData
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems.unshift(...data)
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    }
  }
}
</script>
