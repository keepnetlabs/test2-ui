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
        <form-group :title="labels.SAMLSettingName" has-hint>
          <v-text-field
            v-model.trim="formValues.name"
            id="input--saml-settings-name"
            placeholder="Enter SAML setting name"
            outlined
            dense
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) =>
                validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.SAMLSettingName))
            ]"
          ></v-text-field>
        </form-group>
        <form-group :title="labels.IdPEntityID" has-hint>
          <v-text-field
            v-model.trim="formValues.idPEntityID"
            id="input--saml-settings-id-entity-id"
            placeholder="Enter SAML idp entity id"
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
          ></v-text-field>
        </form-group>
        <form-group :title="labels.SAMLIdpTargetUrl" has-hint>
          <input-url v-model="formValues.idPSSOTargetUrl" id="input--saml-settings-target-url" />
        </form-group>
        <form-group :title="labels.CertificateName" has-hint>
          <k-file-upload
            key="mainLogo"
            id="input--saml-settings-file"
            hint="Upload certification file. Max. file size 2MB"
            ref="refMainLogo"
            :extensions="['cer', 'cert', 'pk12']"
            @inputFile="onFileChange"
          />
          <div class="saml-settings__certificate-text" v-if="certificateText">
            {{ certificateText }}
          </div>
        </form-group>

        <form-group :title="labels.SAMLIdpCert" has-hint>
          <v-text-field
            v-model.trim="formValues.idPCertFingerprint"
            id="input--saml-settings-idp-fingerprint"
            placeholder="Enter the key from your provider"
            outlined
            dense
            hint="*Required"
            persistent-hint
            :rules="getCertRules"
          ></v-text-field>
          <v-radio-group
            v-model.trim="formValues.idPCertFingerprintTypeId"
            id="input--saml-cert-type"
            class="mt-0"
            row
            hide-details
            dense
          >
            <v-radio
              id="input--saml-cert-type-sha1"
              :value="1"
              label="SHA1"
              color="#2196f3"
            ></v-radio>
            <v-radio
              id="input--saml-cert-type-sha216"
              :value="2"
              label="SHA256"
              color="#2196f3"
            ></v-radio>
          </v-radio-group>
        </form-group>
        <input-with-copy-to-clipboard
          copyKey="entityID"
          :title="labels.EntityId"
          @on-copy="handleCopyToClipboard"
        >
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
        <input-with-copy-to-clipboard
          copyKey="ssoSignInUrl"
          :title="labels.SSOSignInURL"
          @on-copy="handleCopyToClipboard"
        >
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
        <input-with-copy-to-clipboard
          copyKey="ssoSignOutUrl"
          :title="labels.SSOSignOutURL"
          @on-copy="handleCopyToClipboard"
        >
          <template #input>
            <v-text-field
              v-model.trim="formValues.ssoSignOutUrl"
              id="input--saml-settings-sso-sign-in-url"
              placeholder="Enter SSO Sign-out URL"
              outlined
              dense
              disabled
            ></v-text-field>
          </template>
        </input-with-copy-to-clipboard>
        <input-with-copy-to-clipboard
          copyKey="ssoCallbackUrl"
          :title="labels.SSOCallbackURL"
          @on-copy="handleCopyToClipboard"
        >
          <template #input>
            <v-text-field
              v-model.trim="formValues.ssoCallbackUrl"
              id="input--saml-settings-sso-callback-url"
              placeholder="Enter SSO Callback URL"
              outlined
              dense
              disabled
            ></v-text-field>
          </template>
        </input-with-copy-to-clipboard>
        <input-with-copy-to-clipboard
          copyKey="metadataUrl"
          :title="labels.MetadataUrl"
          @on-copy="handleCopyToClipboard"
        >
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
        <input-with-copy-to-clipboard
          copyKey="bypassSSOLoginUrl"
          :title="labels.BypassSSOLoginURL"
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
        <form-group class-name="input-copy-to-clipboard" :title="labels.Domain">
          <v-form ref="refDomainToAddForm" onSubmit="return false;">
            <div class="copy-to-clipboard__container">
              <v-text-field
                v-model.trim="formValues.domainToAdd"
                id="input--saml-settings-domain-to-add"
                placeholder="Enter Domain name"
                style="max-width: 554px;"
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
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import * as Validations from '@/utils/validations'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
import {
  createSamlSetting,
  getDefaultSamlSettings,
  getSamlSetting,
  updateSamlSetting
} from '@/api/samlSettings'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
export default {
  name: 'NewSamlSettings',
  components: {
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
      labels,
      validations,
      resourceId: null,
      certificateText: '',
      isBatchImportPopupOpen: false,
      saveDisable: false,
      dataContainerWithSearchItems: [],
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
        domainToAdd: ''
      }
    }
  },
  computed: {
    getCertRules() {
      return [
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.required(v),
        (v) => Validations.maxLength(v, 3000, labels.getMaxLengthMessage(labels.SAMLIdpCert, 3000))
      ]
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
          idPCertificateFileContent
        } = data
        this.formValues.entityID = entityID
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
    handleBatchImportClick() {
      this.toggleBatchImportPopup()
    },
    callForGetDefaultSettings() {
      getDefaultSamlSettings().then((response) => {
        const {
          data: { data }
        } = response

        for (const key of Object.keys(data)) {
          this.formValues[key] = data[key]
        }
      })
    },
    closeOverlay() {
      this.$emit('on-close')
    },
    handleCopyToClipboard(key = '') {
      navigator.clipboard.writeText(this.formValues[key])
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
  margin-top: 4px;
}
</style>
