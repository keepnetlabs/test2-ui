<template>
  <div class="white-labeling mt-6">
    <ResetToDefaultWhiteLabelingDialog
      v-if="!isCompanyConfigure"
      :status="resetToDefaultWhiteLabelingDialogStatus"
      :is-reset-to-default-action-button-disabled="isResetToDefaultActionButtonDisabled"
      @handleCloseDialog="toggleWhiteLabelingDialog"
      @handleConfirm="handleResetWhiteLabeling"
    />
    <DatatableLoading class="mt-5" :loading="isWhiteLabelLoading" v-if="isWhiteLabelLoading" />
    <v-form v-show="!isWhiteLabelLoading" ref="refForm" lazy-validation>
      <form-group has-hint :title="labels.BrandName" :sub-title="labels.BrandNameSubTitle">
        <v-text-field
          v-model.trim="formValues.brandName"
          id="input--whitelabeling-brand-name"
          outlined
          persistent-hint
          dense
          hint="*Required"
          :placeholder="labels.BrandNamePlaceHolder"
          :rules="[
            (v) => validations.required(v, labels.Required),
            (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
            (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Brand Name'))
          ]"
        ></v-text-field>
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
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
              (v) => mainDomainCustomValidation(v),
              (v) => validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.URL, 2000))
            ]"
          ></v-text-field>
        </div>
      </form-group>
      <form-group :title="labels.MainLogo" :sub-title="labels.MainLogoSubTitle">
        <k-file-upload
          key="mainLogo"
          id="input--whitelabeling-main-logo"
          :class="getFileUploadClasses(getMainLogo)"
          hint="Upload png, jpg, svg. Suggested size: 180px * 60px. Max. file size 2MB"
          ref="refMainLogo"
          :extensions="['png', 'jpg', 'svg']"
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
          hint="Upload png, jpg, svg. Suggested size: 320px * 320px. Max. file size 2MB"
          ref="refNotificationTemplateLogo"
          :extensions="['png', 'jpg', 'svg']"
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
          <span class="white-labeling__footer-links-span"> Privacy Policy </span>
          <input-url
            id="input--whitelabeling-footer-privacy-policy"
            placeholder="Enter URL"
            v-model.trim="formValues.footerPrivacyPolicyUrl"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Terms and Conditions </span>
          <input-url
            id="input--whitelabeling-footer-terms-and-conditions"
            placeholder="Enter URL"
            v-model.trim="formValues.footerTermsAndConditionsUrl"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> EULA </span>
          <input-url
            id="input--whitelabeling-footer-eula"
            placeholder="Enter URL"
            v-model.trim="formValues.footerEulaUrl"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Cookie Policy </span>
          <input-url
            id="input--whitelabeling-footer-cookie-policy-url"
            placeholder="Enter URL"
            v-model.trim="formValues.footerCookiePolicyUrl"
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
          :disabled="getActionButtonDisabled"
          :style="formValues.isShowReleaseNotes ? { marginTop: '21px' } : { marginTop: '23px' }"
          @click="submit"
        >
          {{ labels.SaveChanges }}
        </v-btn>
        <v-btn
          id="btn-reset-to-default--whitelabeling"
          class="white-labeling__footer-reset-to-default"
          text
          color="#2196f3"
          :disabled="!hasDeletePermission"
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
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import KSelect from '@/components/Common/Inputs/KSelect'
import { scrollToComponent } from '@/utils/functions'
import * as validations from '@/utils/validations'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import ResetToDefaultWhiteLabelingDialog from '@/components/Company Settings/ResetToDefaultWhiteLabelingDialog'
import { getWhiteLabel } from '@/api/whitelabel'
export default {
  name: 'WhiteLabeling',
  components: {
    ResetToDefaultWhiteLabelingDialog,
    DatatableLoading,
    KSelect,
    InputUrl,
    InputEmail,
    KFileUpload,
    FormGroup
  },
  props: {
    PERMISSIONS: {
      type: Object,
      required: true
    },
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
      isActionButtonDisabled: false,
      isResetToDefaultActionButtonDisabled: false,
      resetToDefaultWhiteLabelingDialogStatus: false,
      formValues: {
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
        isShowReleaseVersionNumber: true,
        isShowReleaseNotes: true,
        emailTemplateLogoUrl: null,
        emailTemplateLogoFile: null
      },
      mainDomainItems: ['https://', 'http://'],
      configureCompanyWhitelabelingResourceId: '',
      labels,
      validations
    }
  },
  computed: {
    isWhiteLabelLoading() {
      return this.$store.state['whitelabel'].loading
    },
    getActionButtonDisabled() {
      return this.isActionButtonDisabled || !this.PERMISSIONS['UPDATE'].hasPermission
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
    hasDeletePermission() {
      const { DELETE } = this.PERMISSIONS
      return DELETE.hasPermission
    }
  },
  watch: {
    '$store.state.whitelabel.loading'(loading) {
      this.loadDatas(loading)
    }
  },
  created() {
    const { GET } = this.PERMISSIONS
    if (GET.hasPermission) {
      this.loadDatas(this.$store.state.whitelabel.loading)
    }
    if (this.isCompanyConfigure) {
      getWhiteLabel({
        overrideCompanyId: true,
        headers: { 'X-IR-COMPANY-ID': this.createdCompanyId },
        loading: true
      }).then((response) => {
        const payload = response.data.data
        this.configureCompanyWhitelabelingResourceId = payload.resourceId
        delete payload.resourceId
        for (const key of Object.keys(payload)) {
          if (key !== 'systemVersion') {
            this.formValues[key] = payload[key]
          }
        }
      })
    }
  },
  methods: {
    getFileUploadClasses(url = '') {
      return ['white-labeling__file-upload', { 'mb-6': !url }]
    },
    getImagePreview(url) {
      return url && typeof url === 'string' ? url : URL.createObjectURL(url)
    },
    loadDatas(loading = true) {
      if (!loading && !this.isCompanyConfigure) {
        const state = JSON.parse(JSON.stringify(this.$store.state.whitelabel))
        delete state.loading
        for (const key of Object.keys(state)) {
          this.formValues[key] = state[key]
        }
      }
    },
    mainDomainCustomValidation(value = '') {
      if (value.startsWith('http') || value.startsWith('https')) {
        return labels.InvalidURL
      }
      return value
        ? /[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
            value
          ) || labels.InvalidURL
        : true
    },
    onMenuLogoChange(file) {
      this.formValues.mainLogoFile = file
    },
    onMinimizedLogoChange(file) {
      this.formValues.minimizedMenuLogoFile = file
    },
    onFavIconChange(file) {
      this.formValues.favIconFile = file
    },
    onNotificationTemplateLogoChange(file) {
      this.formValues.emailTemplateLogoFile = file
    },
    submit() {
      const { refForm } = this.$refs
      const { UPDATE } = this.PERMISSIONS
      if (UPDATE.hasPermission) {
        if (refForm.validate()) {
          this.isActionButtonDisabled = true
          this.$store
            .dispatch('whitelabel/updateData', this.formValues)
            .finally(() => (this.isActionButtonDisabled = false))
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
      if (this.hasDeletePermission) {
        this.isResetToDefaultActionButtonDisabled = true
        this.$store.dispatch('whitelabel/resetToDefault').finally(() => {
          this.toggleWhiteLabelingDialog()
          this.isResetToDefaultActionButtonDisabled = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
.white-labeling {
  &__file-upload {
    //margin-bottom: 24px;
    max-width: 230px;
  }
  &__main-domain {
    &-prefix {
      max-width: 95px;
      .v-select__selection {
        margin-right: 0 !important;
        overflow: visible !important;
      }
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-reset-to-default {
      padding: 0 8px !important;
      margin-right: -2px;
      .v-btn__content {
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.71;
        letter-spacing: normal;
        color: #2196f3;
      }
    }
  }
  &__footer-links {
    max-width: 570px !important;
    &-item {
      display: flex;
      justify-content: space-between;
    }
    &-span {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #383b41;
      margin-top: 11px;
    }
    .v-text-field {
      max-width: 403px;
    }
  }
  &__release-information {
    &-item {
    }
    &-span {
      font-size: 9px;
      font-weight: normal;
      letter-spacing: normal;
      color: #757575;
      position: absolute;
      top: 14px;
    }
  }
}
</style>
