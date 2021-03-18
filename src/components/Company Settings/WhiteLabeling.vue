<template>
  <div class="white-labeling mt-6">
    <v-form ref="refForm" lazy-validation>
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
            v-model.trim="formValues.mainDomainPrefix"
            placeholder="Select option"
            outlined
            dense
            class="white-labeling__main-domain-prefix"
            :items="mainDomainItems"
          />
          <v-text-field
            v-model.trim="formValues.domain"
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
          class="white-labeling__file-upload"
          hint="Upload png, jpg, svg. Suggested size: 180px * 60px"
          ref="refMainLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onMenuLogoChange"
        />
      </form-group>
      <form-group
        title="Minimized Menu Logo"
        sub-title="Appears on the minimized menu as platform logo"
      >
        <k-file-upload
          class="white-labeling__file-upload"
          hint="Upload png, jpg, svg. Suggested size: 40px * 40px"
          ref="refMinimizedLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onMinimizedLogoChange"
        />
      </form-group>
      <form-group title="Favicon" sub-title="Favicon for browser tab">
        <k-file-upload
          class="white-labeling__file-upload"
          hint="Upload .ico file. Suggested size: 32px * 32px"
          ref="refFavIcon"
          :extensions="['ico']"
          @inputFile="onFavIconChange"
        />
      </form-group>
      <form-group title="Notification Template Logo" sub-title="Default logo for email templates">
        <k-file-upload
          class="white-labeling__file-upload"
          hint="Upload png, jpg, svg. Suggested size: 320px * 320px"
          ref="refNotificationTemplateLogo"
          :extensions="['png', 'jpg', 'svg']"
          @inputFile="onNotificationTemplateLogoChange"
        />
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
          <input-url placeholder="Enter URL" v-model.trim="formValues.privacyPolicyUrl" />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Terms and Conditions </span>
          <input-url placeholder="Enter URL" v-model.trim="formValues.termsAndConditionsUrl" />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> EULA </span>
          <input-url placeholder="Enter URL" v-model.trim="formValues.EULAUrl" />
        </div>
        <div class="white-labeling__footer-links-item">
          <span class="white-labeling__footer-links-span"> Cookie Policy </span>
          <input-url placeholder="Enter URL" v-model.trim="formValues.cookiePolicyUrl" />
        </div>
      </form-group>
      <form-group
        class="white-labeling__release-information"
        :title="labels.ReleaseInformation"
        :sub-title="labels.ReleaseInformationSubTitle"
      >
        <div class="white-labeling__release-information-item">
          <v-checkbox v-model="formValues.isShowReleaseVersion" color="#2196f3">
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
                v-model.trim="formValues.relaseNotesUrl"
                style="max-width: 324px;"
                placeholder="https://doc.sitename.com/releasenotes"
              />
            </div>
          </div>
        </div>
      </form-group>
      <div>
        <v-btn
          @click="submit"
          class="white--text btn-util btn-save-changes mb-6"
          color="#2196f3"
          rounded
          :style="formValues.isShowReleaseNotes ? { marginTop: '21px' } : { marginTop: '23px' }"
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
export default {
  name: 'WhiteLabeling',
  components: {
    KSelect,
    InputUrl,
    InputEmail,
    KFileUpload,
    FormGroup
  },
  data() {
    return {
      formValues: {
        brandName: '',
        lmsDomain: '',
        poweredBy: '',
        mainSiteDomain: '',
        mainDomainPrefix: 'https://',
        menuLogo: null,
        minimizedLogo: null,
        favIcon: null,
        supportEmailAddress: '',
        privacyPolicyUrl: '',
        termsAndConditionsUrl: '',
        EULAUrl: '',
        cookiePolicyUrl: '',
        relaseNotesUrl: '',
        isShowReleaseVersion: true,
        isShowReleaseNotes: true,
        notificationTemplateLogo: null
      },
      mainDomainItems: ['https://', 'http://'],
      labels,
      validations
    }
  },
  created() {
    this.formValues.brandName =
      localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
  },
  methods: {
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
      this.formValues.menuLogo = file
    },
    onMinimizedLogoChange(file) {
      this.formValues.minimizedLogo = file
    },
    onFavIconChange(file) {
      this.formValues.favIcon = file
    },
    onNotificationTemplateLogoChange(file) {
      this.formValues.notificationTemplateLogo = file
    },
    submit() {
      const { refForm } = this.$refs
      if (refForm.validate()) {
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
    margin-bottom: 24px;
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
