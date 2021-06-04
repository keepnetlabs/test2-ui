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
          <v-text-field
            v-model.trim="formValues.name"
            id="input--saml-settings-name"
            placeholder="Enter a name"
            outlined
            dense
            persistent-hint
            :hint="labels.DefaultHint"
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) =>
                validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.SAMLSettingName))
            ]"
          ></v-text-field>
        </form-group>
        <form-group
          class-name="input-copy-to-clipboard"
          :title="labels.AllowedDomains"
          :sub-title="labels.SamlDomainSubLabel"
        >
          <v-form ref="refDomainToAddForm" onSubmit="return false;">
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
                  (v) => validations.required(v, labels.Required),
                  (v) =>
                    validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Domain, 256)),
                  (v) => validations.domain(v, labels.InvalidDomainName)
                ]"
              ></v-text-field>
              <v-btn
                outlined
                rounded
                color="#2196F3"
                class="btn-domain-add ml-10"
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
        <div class="mt-9" style="display: flex; align-items: center; max-width: 648px;">
          <v-divider />
          <span style="font-size: 14px; color: #383b41; margin: 0 16px;"> or</span>
          <v-divider />
        </div>

        <form-group-horizontal-content label="Issuer URL of the IdP" class="mt-11">
          <v-text-field
            v-model.trim="formValues.issuerUrlOfTheIdp"
            id="input--saml-settings-id-entity-id"
            placeholder="Enter issuer URL from your provider"
            outlined
            dense
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) =>
                validations.maxLength(
                  v,
                  256,
                  labels.getMaxLengthMessage(labels.SAMLSettingName, 256)
                )
            ]"
            :disabled="isTextFieldsDisabled"
          ></v-text-field>
        </form-group-horizontal-content>
        <form-group-horizontal-content label="IdP SSO URL">
          <input-url
            v-model="formValues.idPSSOTargetUrl"
            id="input--saml-settings-target-url"
            :disabled="isTextFieldsDisabled"
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
        </form-group>
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
        <form-group-horizontal-content label="Default Role">
          <k-select
            v-model.trim="formValues.roleResourceIdList"
            id="input--sytem-user-role"
            placeholder="Select Option"
            outlined
            dense
            :items="roleItems"
            hint="*Required"
            persistent-hint
            item-text="name"
            item-value="resourceId"
            :rules="[(v) => validations.required(v, labels.Required)]"
          />
        </form-group-horizontal-content>
        <form-group :title="labels.EnableSAMLSSO">
          <v-switch
            v-model="formValues.enableSAMLSSO"
            id="input--saml-settings-enable-saml-sso"
            :label="formValues.enableSAMLSSO ? labels.Active : labels.InActive"
            class="k-switch"
            color="#2196f3"
          />
        </form-group>
        <form-group :title="labels.TestConnection">
          <div class="test-connection__button" style="width: 160px; cursor: pointer;">
            TEST CONNECTION
          </div>
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
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import * as Validations from '@/utils/validations'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
import {
  createSamlSetting,
  getDefaultSamlSettings,
  getSamlSetting,
  parseMetadata,
  updateSamlSetting
} from '@/api/samlSettings'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
import { mapGetters } from 'vuex'
import { getSystemUsersRole } from '@/api/systemUsers'
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'NewSamlSettings',
  components: {
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
        "    email: 'john.doe@keepnetlabs.com', //optional\n" +
        "        firstName: 'John', //required\n" +
        "        lastName: 'Doe', //required\n" +
        '        spRole: \'Company Admin\', //optional. \n        Default is "Company Admin"\n' +
        "        phoneNumber: 'Phone' //optional     } \n" +
        '',
      labels,
      validations,
      isCertificateTextDisabled: false,
      resourceId: null,
      certificateText: '',
      isBatchImportPopupOpen: false,
      saveDisable: false,
      dataContainerWithSearchItems: [],
      isTextFieldsDisabled: false,
      roleItems: [],
      formValues: {
        name: '',
        idPEntityID: '',
        file: null,
        idPSSOTargetUrl: '',
        issuerUrlOfTheIdp: '',
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
        roleResourceIdList: []
      }
    }
  },
  computed: {
    ...mapGetters({
      brandName: 'whitelabel/getBrandName'
    }),
    getCertRules() {
      return [
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 3000, labels.getMaxLengthMessage(labels.SAMLIdpCert, 3000))
      ]
    },
    getMetadataLabel() {
      return `${labels.SamlConfigurationFor} ${this.brandName}`
    },
    getId() {
      return this.isEdit ? 'edit-saml-settings-modal' : 'new-saml-settings-modal'
    },
    getTitle() {
      return this.isEdit ? labels.SamlModalBodyEditTitle : labels.SamlModalBodyTitle
    }
  },
  created() {
    if (this.isEdit && this.selectedRow) {
      this.callForSamlSetting()
    }
    this.callForRoles()
    this.callForGetDefaultSettings()
  },
  methods: {
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
          idPCertificateFileContent
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
        this.dataContainerWithSearchItems = domain.concat()
        this.certificateText = idPCertificateFileContent
      })
    },
    callForRoles() {
      let allRoles = []
      let availableRoles = []
      getSystemUsersRole({
        pageNumber: 1,
        pageSize: 1000,
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
      }).then((response) => {
        allRoles = response.data.data
        availableRoles = allRoles

        if (this.isEdit) {
          allRoles &&
            allRoles.find((item) => {
              return item.name === roles
            }).resourceId
          availableRoles = allRoles
          this.roleItems = availableRoles.map((item) => {
            let data = {
              name: item.name,
              resourceId: item.resourceId
            }
            return data
          })
        } else {
          this.roleItems = availableRoles.map((item) => {
            return {
              name: item.name,
              resourceId: item.resourceId
            }
          })
          this.formValues.roleResourceIdList =
            availableRoles &&
            availableRoles.length &&
            availableRoles.find((role) => role.name === 'CompanyAdmin').resourceId
        }
      })
    },
    handleBatchImportClick() {
      this.toggleBatchImportPopup()
    },
    callForGetDefaultSettings() {
      getDefaultSamlSettings().then((response) => {
        const {
          data: { data }
        } = response
        console.log('data', data)
        for (const key of Object.keys(data)) {
          this.formValues[key] = data[key]
        }
      })
    },
    closeOverlay() {
      this.$emit('on-close')
    },
    handleCopyToClipboard(key = '') {
      navigator.clipboard.writeText(this.formValues[key] || this[key])
      this.$store.dispatch('common/createSnackBar', {
        message: 'COPIED TO CLIPBOARD',
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
    },
    handleDomainToAddButtonClick() {
      if (
        this.$refs.refDomainToAddForm.validate() &&
        !this.dataContainerWithSearchItems.find((item) => item === this.formValues.domainToAdd)
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
      this.certificateText = await file.text()
      this.isCertificateTextDisabled = true
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
          file
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
          domain: this.dataContainerWithSearchItems
        }
        this.saveDisable = true
        const payload = this.createFormDataPayload(formData)
        const promise = !this.isEdit
          ? createSamlSetting(payload)
          : updateSamlSetting(payload, this.resourceId)
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

<style lang="scss">
.btn-domain-add {
  .v-btn__content {
    margin: 0 10px;
  }
  .v-icon {
    margin-right: 4px !important;
  }
}
.saml-settings__certificate-text {
  max-height: 100px;
  overflow: auto;
  padding: 12px;
  line-height: 1.4;
  border: 1px solid darkgray;
  font-size: 13px;
  background: #f2f2f2 !important;
  border-radius: 4px;
  word-break: break-all;
  margin-top: 4px;
}
.saml-settings {
  .form-group-horizontal-content {
    max-width: 648px;
    margin-bottom: 8px;
  }
  &-text-area-disabled {
    .v-input__slot {
      background: #e0e0e0 !important;
    }
  }
  &-disabled-area {
    .form-group-horizontal-content {
      max-width: 840px;
      margin-bottom: 8px;
      > *:first-child {
        margin-top: 0;
      }
    }
  }
  &__mapping {
    align-items: flex-start;
    label {
      margin-top: 16px !important;
    }
    button {
      align-self: center;
    }
  }
}
.copy-to-clipboard__container.saml-domain {
  .v-text-field__details {
    display: block !important;
  }
}
</style>
