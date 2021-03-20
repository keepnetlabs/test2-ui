<template>
  <div class="white-labeling mt-6">
    <DatatableLoading class="mt-5" :loading="isWhiteLabelLoading" v-if="isWhiteLabelLoading" />
    <v-form v-show="!isWhiteLabelLoading" ref="refForm" lazy-validation>
      <form-group has-hint :title="labels.BrandName" :sub-title="labels.BrandNameSubTitle">
        <v-text-field
          v-model.trim="formValues.brandName"
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
            placeholder="Select option"
            outlined
            dense
            class="white-labeling__main-domain-prefix"
            :items="mainDomainItems"
          />
          <v-text-field
            v-model.trim="formValues.mainDomainUrl"
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
          :class="getFileUploadClasses(getMainLogo)"
          hint="Upload png, jpg, svg. Suggested size: 180px * 60px"
          ref="refMainLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onMenuLogoChange"
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
          :class="getFileUploadClasses(getMinimizedLogo)"
          hint="Upload png, jpg, svg. Suggested size: 40px * 40px"
          ref="refMinimizedLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onMinimizedLogoChange"
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
          :class="getFileUploadClasses(getFavIcon)"
          hint="Upload .ico file. Suggested size: 32px * 32px"
          ref="refFavIcon"
          :extensions="['ico']"
          @inputFile="onFavIconChange"
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
          key="emailTemplateLogo"
          :class="getFileUploadClasses(getEmailTemplateLogo)"
          hint="Upload png, jpg, svg. Suggested size: 320px * 320px"
          ref="refNotificationTemplateLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onNotificationTemplateLogoChange"
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
          <input-url placeholder="Enter URL" v-model.trim="formValues.footerPrivacyPolicyUrl" />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Terms and Conditions </span>
          <input-url
            placeholder="Enter URL"
            v-model.trim="formValues.footerTermsAndConditionsUrl"
          />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> EULA </span>
          <input-url placeholder="Enter URL" v-model.trim="formValues.footerEulaUrl" />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Cookie Policy </span>
          <input-url placeholder="Enter URL" v-model.trim="formValues.footerCookiePolicyUrl" />
        </div>
      </form-group>
      <form-group
        class="white-labeling__release-information"
        :title="labels.ReleaseInformation"
        :sub-title="labels.ReleaseInformationSubTitle"
      >
        <div class="white-labeling__release-information-item">
          <v-checkbox v-model="formValues.isShowReleaseVersionNumber" color="#2196f3">
            <template #label>
              <div>Show release version number</div>
              <div class="white-labeling__release-information-span">
                Show version number at the bottom of navigation menu
              </div>
            </template>
          </v-checkbox>
          <v-checkbox v-model="formValues.isShowReleaseNotes" color="#2196f3">
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
                style="max-width: 324px;"
                placeholder="https://doc.sitename.com/releasenotes"
              />
            </div>
          </div>
        </div>
      </form-group>
      <div>
        <v-btn
          class="white--text btn-util btn-save-changes mb-6"
          color="#2196f3"
          rounded
          :disabled="isActionButtonDisabled"
          :style="formValues.isShowReleaseNotes ? { marginTop: '21px' } : { marginTop: '23px' }"
          @click="submit"
        >
          {{ labels.SaveChanges }}
        </v-btn>
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
export default {
  name: 'WhiteLabeling',
  components: {
    DatatableLoading,
    KSelect,
    InputUrl,
    InputEmail,
    KFileUpload,
    FormGroup
  },
  data() {
    return {
      isActionButtonDisabled: false,
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
      labels,
      validations
    }
  },
  computed: {
    isWhiteLabelLoading() {
      return this.$store.state['whitelabel'].loading
    },
    getMainLogo() {
      return this.formValues.mainLogoUrl || this.formValues.mainLogoFile
    },
    getMinimizedLogo() {
      return this.formValues.minimizedMenuLogoUrl || this.formValues.minimizedMenuLogoFile
    },
    getFavIcon() {
      return this.formValues.faviconUrl || this.formValues.favIconFile
    },
    getEmailTemplateLogo() {
      return this.formValues.emailTemplateLogoUrl || this.formValues.emailTemplateLogoFile
    }
  },
  watch: {
    '$store.state.whitelabel.loading'(loading) {
      this.loadDatas(loading)
    }
  },
  created() {
    this.loadDatas(this.$store.state.whitelabel.loading)
  },
  methods: {
    getFileUploadClasses(url = '') {
      return ['white-labeling__file-upload', { 'mb-6': !url }]
    },
    getImagePreview(url) {
      return url && typeof url === 'string' ? url : URL.createObjectURL(url)
    },
    loadDatas(loading = true) {
      if (!loading) {
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
      debugger
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
