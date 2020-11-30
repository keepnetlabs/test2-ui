<template>
  <div class="white-labeling">
    <company-settings-header
      title="White Labeling"
      sub-title="Change branding, company name, logo and other settings throughout the application for you and your users."
    />

    <v-form ref="refForm" lazy-validation>
      <form-group title="Brand Name">
        <v-text-field
          placeholder="Enter Company Name"
          outlined
          dense
          v-model.trim="formValues.brandName"
        ></v-text-field>
      </form-group>
      <form-group title="LMS Domain">
        <v-text-field
          placeholder="Enter domain name"
          outlined
          dense
          v-model.trim="formValues.lmsDomain"
        ></v-text-field>
      </form-group>
      <form-group title="Powered by">
        <v-text-field
          placeholder="Enter powered by"
          outlined
          dense
          v-model.trim="formValues.poweredBy"
        ></v-text-field>
      </form-group>
      <form-group title="Main Site Domain">
        <v-text-field
          placeholder="Enter main site domain"
          outlined
          dense
          v-model.trim="formValues.mainSiteDomain"
        ></v-text-field>
      </form-group>
      <form-group title="Menu Logo" class-name="white-labeling__file-upload">
        <k-file-upload
          @inputFile="onMenuLogoChange"
          hint="Upload png, jpg, svg. Suggested size: 180px * 180px"
        />
      </form-group>
      <form-group title="Minimized Logo" class-name="white-labeling__file-upload">
        <k-file-upload
          @inputFile="onMinimizedLogoChange"
          hint="Upload png, jpg, svg. Suggested size: 60px * 60px"
        />
      </form-group>
      <form-group title="Large Logo" class-name="white-labeling__file-upload">
        <k-file-upload
          @inputFile="onLargeLogoChange"
          hint="Upload png, jpg, svg. Suggested size: 500px * 500px"
        />
      </form-group>
      <form-group title="Training Icon" class-name="white-labeling__file-upload">
        <k-file-upload
          @inputFile="onTrainingIconChange"
          hint="Upload png, jpg, svg. Suggested size: 180px * 180px"
        />
      </form-group>

      <div>
        <v-btn
          @click="submit"
          class="white--text btn-util btn-save-changes mb-6 mt-2"
          color="#2196f3"
          rounded
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroup from '@/components/SmallComponents/FormGroup'

export default {
  name: 'WhiteLabeling',
  components: {
    CompanySettingsHeader,
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
  &__file-upload {
    margin-bottom: 24px;
    max-width: 230px;
  }
}
</style>
