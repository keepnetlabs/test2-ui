<template>
  <div class="white-labeling">
    <company-settings-header
      title="White Labeling"
      sub-title="Change branding, company name, logo and other settings throughout the application for you and your users."
    />
    <div class="white-labeling__container">
      <v-form ref="refForm" lazy-validation>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Brand Name</label>
            <v-text-field
              placeholder="Company Name"
              outlined
              dense
              v-model.trim="formValues.brandName"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">LMS Domain</label>
            <v-text-field
              placeholder="lms.company.com"
              outlined
              dense
              v-model.trim="formValues.lmsDomain"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Powered by</label>
            <v-text-field
              placeholder="Enter powered by"
              outlined
              dense
              v-model.trim="formValues.poweredBy"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Main Site Domain</label>
            <v-text-field
              placeholder="Enter main site domain"
              outlined
              dense
              v-model.trim="formValues.mainSiteDomain"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item white-labeling__file-upload">
          <v-list-item-content>
            <label class="add-user-overlay__label">Menu Logo</label>
            <k-file-upload
              @inputFile="onMenuLogoChange"
              hint="Upload png, jpg, svg. Suggested size: 180px * 180px"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item white-labeling__file-upload">
          <v-list-item-content>
            <label class="add-user-overlay__label">Minimized Logo</label>
            <k-file-upload
              @inputFile="onMinimizedLogoChange"
              hint="Upload png, jpg, svg. Suggested size: 60px * 60px"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item white-labeling__file-upload">
          <v-list-item-content>
            <label class="add-user-overlay__label">Large Logo</label>
            <k-file-upload
              @inputFile="onLargeLogoChange"
              hint="Upload png, jpg, svg. Suggested size: 500px * 500px"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="white-labeling__list-item white-labeling__file-upload mb-8">
          <v-list-item-content>
            <label class="add-user-overlay__label">Training Icon</label>
            <k-file-upload
              @inputFile="onTrainingIconChange"
              hint="Upload png, jpg, svg. Suggested size: 180px * 180px"
            />
          </v-list-item-content>
        </v-list-item>
        <div>
          <v-btn
            @click="submit"
            class="white--text btn-util btn-save-changes mb-6"
            color="#2196f3"
            rounded
            style="margin-top: 3px;"
          >
            SAVE CHANGES
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
export default {
  name: 'WhiteLabeling',
  components: {
    CompanySettingsHeader,
    KFileUpload
  },
  data() {
    return {
      formValues: {
        brandName: '',
        lmsDomain: '',
        poweredBy: '',
        mainSiteDomain: '',
        menuLogo: null,
        minimizedLogo: null,
        largeLogo: null,
        trainingIcon: null
      }
    }
  },
  methods: {
    onMenuLogoChange(file) {
      this.menuLogo = file
    },
    onMinimizedLogoChange(file) {
      this.minimizedLogo = file
    },
    onLargeLogoChange(file) {
      this.largeLogo = file
    },
    onTrainingIconChange(file) {
      this.trainingIcon = file
    },
    submit() {}
  }
}
</script>

<style lang="scss">
.white-labeling {
  &__container {
    .v-list-item {
      padding: 0;
    }
  }
  &__list-item {
    min-height: auto !important;
    max-width: 554px;
    margin-bottom: 1px;
    .v-list-item__content {
      padding: 0;
    }
    .v-card-headline {
      white-space: normal;
    }
  }
  &__file-upload {
    margin-bottom: 24px;
    max-width: 230px;
  }
}
</style>
