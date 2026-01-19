<template>
  <div class="white-labeling mt-6">
    <ResetToDefaultWhiteLabelingDialog
      v-if="!isCompanyConfigure"
      :status="resetToDefaultWhiteLabelingDialogStatus"
      :is-reset-to-default-action-button-disabled="isResetToDefaultActionButtonDisabled"
      @handleCloseDialog="toggleWhiteLabelingDialog"
      @handleConfirm="handleResetWhiteLabeling"
    />
    <WhiteLabelingDomainDialog
      v-if="isShowDomainDialog"
      :status="isShowDomainDialog"
      :is-action-button-disabled="getActionButtonDisabled"
      :error-message="whiteLabelingErrorMessage"
      :title="whiteLabelingErrorTitle"
      @on-close="toggleWhiteLabelingDomainDialog"
      @on-confirm="handleConfirmWhiteLabelingDomainDialog"
    />
    <DatatableLoading class="mt-5" :loading="isWhiteLabelLoading" v-if="isWhiteLabelLoading" />
    <v-form v-show="!isWhiteLabelLoading" ref="refForm" lazy-validation>
      <form-group has-hint :title="labels.BrandName" :sub-title="labels.BrandNameSubTitle">
        <InputEntityName
          v-model.trim="formValues.brandName"
          id="input--whitelabeling-brand-name"
          entityName="brand"
          :initialPlaceholder="labels.BrandNamePlaceHolder"
          :initialRules="brandRules"
        />
      </form-group>
      <form-group has-hint :title="labels.MainDomain" :sub-title="labels.MainDomainSubTitle">
        <div class="d-flex">
          <k-select
            v-model.trim="formValues.mainDomainProtocol"
            id="input--whitelabeling-main-domain-protocol"
            placeholder="Select option"
            outlined
            dense
            class="white-labeling__main-domain-prefix"
            :items="mainDomainItems"
          />
          <v-text-field
            v-model.trim="formValues.mainDomainUrl"
            id="input--whitelabeling-main-domain-url"
            outlined
            dense
            persistent-hint
            class="ml-2"
            hint="*Required"
            :placeholder="labels.MainDomainPlaceHolder"
            :rules="[...urlRules, (v) => mainDomainCustomValidation(v)]"
            :error="!!mainDomainValidationError"
            :error-messages="mainDomainValidationError"
          ></v-text-field>
          <v-btn
            v-if="mainDomainValidationSuccess === null"
            outlined
            class="new-training-content-by-language__button"
            style="color: #2196f3; align-self: center; margin-bottom: 10px;"
            :ripple="false"
            :disabled="isCheckingMainDomainValidation"
            @click="checkMainDomainValidation"
          >
            {{ isCheckingMainDomainValidation ? 'CHECKING' : 'CHECK' }}
            <v-icon
              v-if="isCheckingMainDomainValidation"
              class="ml-1 loading-spin-clockwise"
              color="#2196F3"
              right
              medium
              >mdi-rotate-right
            </v-icon>
          </v-btn>
          <v-icon
            v-else-if="mainDomainValidationSuccess === true"
            class="ml-4"
            style="align-self: center; margin-bottom: 24px;"
            color="#217124"
            medium
            >mdi-check-circle
          </v-icon>
          <v-icon
            v-else-if="mainDomainValidationSuccess === false"
            class="ml-4"
            style="align-self: center; margin-bottom: 24px;"
            color="#B83A3A"
            medium
            >mdi-alert
          </v-icon>
        </div>
        <AlertBox
          class="white-labeling__main-domain-alert-box"
          icon-color="#2196F3"
          :text="getMainDomainInformationText"
          :slots="{ primaryAction: false, secondaryAction: false }"
        />
      </form-group>
      <div :key="fileUploadKey">
        <form-group :title="labels.MainLogo" :sub-title="labels.MainLogoSubTitle">
          <k-file-upload
            key="mainLogo"
            id="input--whitelabeling-main-logo"
            :class="getFileUploadClasses(getMainLogo)"
            hint="Upload png, jpg. Suggested size: 180px * 60px. Max. file size 2MB"
            ref="refMainLogo"
            :extensions="['png', 'jpg']"
            @inputFile="onMenuLogoChange"
            :size="2"
          />
          <v-list-item
            v-if="getMainLogo"
            class="px-0 add-in-settings__list-item add-in-settings__logo-container"
          >
            <v-list-item-content>
              <div>
                <div class="add-in-settings__image-container">
                  <img
                    class="add-in-settings__image"
                    :src="getImagePreview(getMainLogo)"
                    alt="logo-preview"
                  />
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </form-group>
        <form-group
          title="Minimized Menu Logo"
          sub-title="Appears on the minimized menu as platform logo"
        >
          <k-file-upload
            key="minimizedLogo"
            id="input--whitelabeling-minimized-logo"
            :class="getFileUploadClasses(getMinimizedLogo)"
            hint="Upload png, jpg, svg. Suggested size: 40px * 40px. Max. file size 2MB"
            ref="refMinimizedLogo"
            :extensions="['png', 'jpg', 'svg']"
            @inputFile="onMinimizedLogoChange"
            :size="2"
          />
          <v-list-item
            v-if="getMinimizedLogo"
            class="px-0 add-in-settings__list-item add-in-settings__logo-container"
          >
            <v-list-item-content>
              <div>
                <div class="add-in-settings__image-container">
                  <img
                    class="add-in-settings__image"
                    :src="getImagePreview(getMinimizedLogo)"
                    alt="logo-preview"
                  />
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </form-group>
        <form-group title="Favicon" sub-title="Favicon for browser tab">
          <k-file-upload
            key="favIcon"
            id="input--whitelabeling-fav-icon"
            :class="getFileUploadClasses(getFavIcon)"
            hint="Upload .ico file. Suggested size: 32px * 32px. Max. file size 2MB"
            ref="refFavIcon"
            :extensions="['ico']"
            @inputFile="onFavIconChange"
            :size="2"
          />
          <v-list-item
            v-if="getFavIcon"
            class="px-0 add-in-settings__list-item add-in-settings__logo-container"
          >
            <v-list-item-content>
              <div>
                <div class="add-in-settings__image-container">
                  <img
                    class="add-in-settings__image"
                    :src="getImagePreview(getFavIcon)"
                    alt="logo-preview"
                  />
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </form-group>
        <form-group title="Notification Template Logo" sub-title="Default logo for email templates">
          <k-file-upload
            id="input--whitelabeling-notification-template-logo"
            key="emailTemplateLogo"
            :class="getFileUploadClasses(getEmailTemplateLogo)"
            hint="Upload png, jpg. Suggested size: 320px * 320px. Max. file size 2MB"
            ref="refNotificationTemplateLogo"
            :extensions="['png', 'jpg']"
            @inputFile="onNotificationTemplateLogoChange"
            :size="2"
          />
          <v-list-item
            v-if="getEmailTemplateLogo"
            class="px-0 add-in-settings__list-item add-in-settings__logo-container"
          >
            <v-list-item-content>
              <div>
                <div class="add-in-settings__image-container">
                  <img
                    class="add-in-settings__image"
                    :src="getImagePreview(getEmailTemplateLogo)"
                    alt="logo-preview"
                  />
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </form-group>
      </div>
      <form-group title="Support Email Address" sub-title="Email address of your support service">
        <input-email
          v-model.trim="formValues.supportEmailAddress"
          :required="false"
          :persistentHint="false"
          :hint="null"
        />
      </form-group>
      <form-group
        class="white-labeling__footer-links"
        title="Footer Links"
        sub-title="Set links for necessary policies"
        has-hint
      >
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span">
            Privacy Policy
          </span>
          <input-url
            id="input--whitelabeling-footer-privacy-policy"
            placeholder="Enter URL"
            v-model.trim="formValues.footerPrivacyPolicyUrl"
            :rules="urlRules"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span">
            Terms and Conditions
          </span>
          <input-url
            id="input--whitelabeling-footer-terms-and-conditions"
            placeholder="Enter URL"
            v-model.trim="formValues.footerTermsAndConditionsUrl"
            :rules="urlRules"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> EULA </span>
          <input-url
            id="input--whitelabeling-footer-eula"
            placeholder="Enter URL"
            v-model.trim="formValues.footerEulaUrl"
            :rules="urlRules"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Cookie Policy </span>
          <input-url
            id="input--whitelabeling-footer-cookie-policy-url"
            placeholder="Enter URL"
            v-model.trim="formValues.footerCookiePolicyUrl"
            :rules="urlRules"
          />
        </div>
      </form-group>
      <form-group
        class="white-labeling__release-information"
        :title="labels.ReleaseInformation"
        :sub-title="labels.ReleaseInformationSubTitle"
      >
        <div class="white-labeling__release-information-item">
          <v-checkbox
            v-model="formValues.isDocumentationLinkEnabled"
            id="input--whitelabeling-is-documentation-link-enabled"
            color="#2196f3"
          >
            <template #label>
              <div>Show documentation link</div>
              <div class="white-labeling__release-information-span">
                Show documentation link at the bottom of navigation menu
              </div>
            </template>
          </v-checkbox>
          <v-checkbox
            v-model="formValues.isShowReleaseVersionNumber"
            id="input--whitelabeling-is-show-relase-version-number"
            color="#2196f3"
          >
            <template #label>
              <div>Show release version number</div>
              <div class="white-labeling__release-information-span">
                Show version number at the bottom of navigation menu
              </div>
            </template>
          </v-checkbox>
          <v-checkbox
            v-model="formValues.isShowReleaseNotes"
            id="input--whitelabeling-is-show-relase-notes"
            color="#2196f3"
          >
            <template #label>
              <div>Show release notes</div>
              <div class="white-labeling__release-information-span">
                Show what’s new in the latest release with a link at the bottom of navigation menu
              </div>
            </template>
          </v-checkbox>
          <div v-if="formValues.isShowReleaseNotes">
            <div style="display: flex;">
              <span class="mt-3 mr-2 ml-8">URL</span>
              <input-url
                v-model.trim="formValues.releaseNotesUrl"
                id="input--whitelabeling-release-notes-url"
                style="max-width: 324px;"
                placeholder="https://doc.sitename.com/releasenotes"
                :rules="urlRules"
              />
            </div>
          </div>
        </div>
      </form-group>
      <div v-if="!isCompanyConfigure" class="white-labeling__footer">
        <v-btn
          id="btn-save--whitelabeling"
          class="white--text btn-util btn-save-changes mb-6"
          color="#2196f3"
          rounded
          :style="getActionButtonStyle"
          @click="submit"
        >
          {{ labels.SaveChanges }}
        </v-btn>
        <v-btn
          id="btn-reset-to-default--whitelabeling"
          class="white-labeling__footer-reset-to-default"
          text
          color="#2196f3"
          :disabled="!getWhiteLabelingUpdatePermissions || isCompanyAdmin"
          @click="toggleWhiteLabelingDialog"
        >
          RESET TO DEFAULT</v-btn
        >
      </div>
    </v-form>
  </div>
</template>

<script>
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import KSelect from '@/components/Common/Inputs/KSelect'
import { createRandomCryptStringNumber, scrollToComponent } from '@/utils/functions'
import { updateFavicon } from '@/utils/favicon'
import * as validations from '@/utils/validations'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import ResetToDefaultWhiteLabelingDialog from '@/components/Company Settings/ResetToDefaultWhiteLabelingDialog'
import { getWhiteLabel, checkDNS } from '@/api/whitelabel'
import WhiteLabelingDomainDialog from '@/components/Company Settings/WhiteLabelingDomainDialog'
import { mapGetters } from 'vuex'
import AlertBox from '@/components//AlertBox'
const formValues = {
  brandName: '',
  mainDomainUrl: '',
  mainDomainProtocol: 'https://',
  mainLogoUrl: null,
  mainLogoFile: null,
  minimizedMenuLogoUrl: null,
  minimizedMenuLogoFile: null,
  faviconUrl: null,
  favIconFile: null,
  supportEmailAddress: '',
  footerPrivacyPolicyUrl: '',
  footerTermsAndConditionsUrl: '',
  footerEulaUrl: '',
  footerCookiePolicyUrl: '',
  releaseNotesUrl: '',
  pointingUrl: '',
  isDocumentationLinkEnabled: true,
  isShowReleaseVersionNumber: true,
  isShowReleaseNotes: true,
  emailTemplateLogoUrl: null,
  emailTemplateLogoFile: null,
  acceptDnsRecordSettings: false
}
export default {
  name: 'WhiteLabeling',
  components: {
    WhiteLabelingDomainDialog,
    ResetToDefaultWhiteLabelingDialog,
    DatatableLoading,
    KSelect,
    InputUrl,
    InputEmail,
    KFileUpload,
    FormGroup,
    InputEntityName,
    AlertBox
  },
  props: {
    isCompanyConfigure: {
      type: Boolean,
      default: false
    },
    createdCompanyId: {
      type: String
    }
  },
  data() {
    return {
      mainDomainValidationError: '',
      mainDomainValidationSuccess: null,
      isShowDomainDialog: false,
      isCheckingMainDomainValidation: false,
      whiteLabelingErrorMessage: false,
      whiteLabelingErrorTitle: '',
      isActionButtonDisabled: false,
      isWhiteLabelLoading: false,
      isResetToDefaultActionButtonDisabled: false,
      resetToDefaultWhiteLabelingDialogStatus: false,
      acceptedDnsRecordSettingsDomain: '',
      formValues: JSON.parse(JSON.stringify(formValues)),
      initialFormValues: JSON.parse(JSON.stringify(formValues)),
      fileUploadKey: `key-${createRandomCryptStringNumber()}`,
      mainDomainItems: ['https://', 'http://'],
      configureCompanyWhitelabelingResourceId: '',
      labels,
      validations,
      urlRules: [
        (v) => validations.required(v, labels.Required),
        (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
        (v) => validations.isDomainUrl(v),
        (v) => validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
      ],
      brandRules: [
        (v) => validations.required(v, labels.Required),
        (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
        (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Brand Name'))
      ]
    }
  },
  computed: {
    ...mapGetters({
      getWhiteLabelingGetPermissions: 'permissions/getWhiteLabelingGetPermissions',
      getWhiteLabelingUpdatePermissions: 'permissions/getWhiteLabelingUpdatePermissions',
      getWhiteLabelingDeletePermissions: 'permissions/getWhiteLabelingDeletePermissions'
    }),
    getActionButtonDisabled() {
      if (this.isCompanyAdmin) return true
      if (JSON.stringify(this.formValues) === JSON.stringify(this.initialFormValues)) {
        return true
      }
      return this.isActionButtonDisabled || !this.getWhiteLabelingUpdatePermissions
    },
    getActionButtonStyle() {
      const style = {}
      if (this.formValues.isShowReleaseNotes) {
        style.marginTop = '21px'
      } else {
        style.marginTop = '23px'
      }
      if (this.getActionButtonDisabled) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    },
    isCompanyAdmin() {
      return this.$store.state?.auth?.userRoleName === labels.CompanyAdmin
    },
    getMainLogo() {
      return this.formValues.mainLogoFile || this.formValues.mainLogoUrl
    },
    getMinimizedLogo() {
      return this.formValues.minimizedMenuLogoFile || this.formValues.minimizedMenuLogoUrl
    },
    getFavIcon() {
      return this.formValues.favIconFile || this.formValues.faviconUrl
    },
    getEmailTemplateLogo() {
      return this.formValues.emailTemplateLogoFile || this.formValues.emailTemplateLogoUrl
    },
    getMainDomainInformationText() {
      return `A CNAME record pointing to ‘’${this.formValues?.pointingUrl}’’ should be created in your DNS for the entered domain.`
    }
  },
  watch: {
    mainDomainUrl(val) {
      this.formValues.acceptDnsRecordSettings = val === this.acceptedDnsRecordSettingsDomain
    },
    'formValues.mainDomainUrl'(val) {
      this.mainDomainValidationError = ''
      this.mainDomainValidationSuccess = null
    }
  },
  created() {
    if (this.isCompanyConfigure) {
      this.callForData({
        overrideCompanyId: true,
        headers: { 'X-IR-COMPANY-ID': this.createdCompanyId },
        loading: true
      })
    } else if (this.getWhiteLabelingGetPermissions) {
      this.callForData()
    }
  },
  methods: {
    handleConfirmWhiteLabelingDomainDialog() {
      this.formValues.acceptDnsRecordSettings = true
      this.submit()
    },
    getFileUploadClasses(url = '') {
      return ['white-labeling__file-upload', { 'mb-6': !url }]
    },
    getImagePreview(url) {
      return url && typeof url === 'string' ? url : URL.createObjectURL(url)
    },
    toggleWhiteLabelingDomainDialog() {
      this.isShowDomainDialog = !this.isShowDomainDialog
    },
    mainDomainCustomValidation(value = '') {
      if (value.startsWith('http') || value.startsWith('https')) {
        return labels.InvalidURL
      }
      return value
        ? /[(w{3}.)?A-Z0-9@:%_+~#=]{2,256}\.[a-z]{2,6}\b([-A-Z0-9@:%_+.~#?&/=]*)/gi.test(value) ||
            labels.InvalidURL
        : true
    },
    onMenuLogoChange(file) {
      // if image is removed, 'file' variable will be an array with 0 length and "Overload resolution failed" error will be thrown
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.mainLogoFile = null
        return
      }
      this.formValues.mainLogoFile = file
    },
    onMinimizedLogoChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.minimizedMenuLogoFile = null
        return
      }
      this.formValues.minimizedMenuLogoFile = file
    },
    onFavIconChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.favIconFile = null
        return
      }
      this.formValues.favIconFile = file
    },
    onNotificationTemplateLogoChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.emailTemplateLogoFile = null
        return
      }
      this.formValues.emailTemplateLogoFile = file
    },
    submit() {
      if (this.isCompanyConfigure) {
        return this.$emit('on-configure-company-submit')
      }
      const { refForm } = this.$refs
      if (this.getWhiteLabelingUpdatePermissions) {
        if (refForm.validate()) {
          this.isActionButtonDisabled = true
          this.$store
            .dispatch('whitelabel/updateData', {
              ...this.formValues,
              resourceId: this.configureCompanyWhitelabelingResourceId
            })
            .then(() => {
              this.formValues.acceptDnsRecordSettings = false
              this.whiteLabelingErrorMessage = ''
              this.acceptedDnsRecordSettingsDomain = ''
              this.isWhiteLabelLoading = false
              this.isShowDomainDialog = false
              this.callForData()
            })
            .catch((e) => {
              if (e && e.response && e.response.status === 404) {
                this.whiteLabelingErrorTitle = 'CNAME record does not exist'
                this.whiteLabelingErrorMessage = `A CNAME record pointing to “${this.formValues?.pointingUrl}” was not found in your DNS for the ”${this.formValues?.mainDomainUrl}” domain. Create a CNAME record pointing to ‘’${this.formValues?.pointingUrl}’ in your DNS for the ”${this.formValues?.mainDomainUrl}” domain.`
                this.acceptedDnsRecordSettingsDomain = this.formValues.mainDomainUrl
                this.toggleWhiteLabelingDomainDialog()
              } else {
                this.callForData()
              }
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        } else {
          return this.$nextTick(() => {
            const el = refForm.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
      }
    },
    toggleWhiteLabelingDialog() {
      this.resetToDefaultWhiteLabelingDialogStatus = !this.resetToDefaultWhiteLabelingDialogStatus
    },
    handleResetWhiteLabeling() {
      if (this.getWhiteLabelingDeletePermissions) {
        this.isWhiteLabelLoading = true
        this.isResetToDefaultActionButtonDisabled = true
        this.$store.dispatch('whitelabel/resetToDefault').then(() => {
          this.toggleWhiteLabelingDialog()
          this.isResetToDefaultActionButtonDisabled = false
          this.callForData()
          this.formValues = JSON.parse(JSON.stringify(formValues))
          this.fileUploadKey = `key-${createRandomCryptStringNumber()}`
        })
      }
    },
    callForData(config) {
      this.isWhiteLabelLoading = true
      getWhiteLabel(config)
        .then((response) => {
          const payload = response.data.data
          this.$store.dispatch('whitelabel/setState', response.data.data)
          if (payload.faviconUrl) {
            updateFavicon(payload.faviconUrl)
          }
          this.configureCompanyWhitelabelingResourceId = payload.resourceId
          delete payload.resourceId
          for (const key of Object.keys(payload)) {
            if (key !== 'systemVersion') {
              this.formValues[key] = payload[key]
            }
          }
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        })
        .finally(() => {
          this.isWhiteLabelLoading = false
        })
    },
    checkMainDomainValidation() {
      this.isCheckingMainDomainValidation = true
      checkDNS({ MainDomainUrl: this.formValues.mainDomainUrl })
        .then((response) => {
          if (response?.data?.status === 'SUCCESS') {
            this.mainDomainValidationError = ''
            this.mainDomainValidationSuccess = true
          }
        })
        .catch((error) => {
          if (error?.response?.data?.validationMessages?.[0]) {
            this.mainDomainValidationError = error.response.data.validationMessages[0]
            this.mainDomainValidationSuccess = false
          }
        })
        .finally(() => {
          this.isCheckingMainDomainValidation = false
        })
    }
  }
}
</script>
