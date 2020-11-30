<template>
  <div class="data-anonymization">
    <company-settings-header
      title="Data Anonymization"
      sub-title="Encrypt user information and display with placeholders. Select options you want to encypt."
    />
    <v-form lazy-validation ref="refForm">
      <div class="data-anonymization__container">
        <v-list-item class="ldap-info__list-item p-0">
          <v-list-item-content>
            <div>
              <v-checkbox
                v-model="formValues.isEncryptIp"
                color="#2196f3"
                class="mt-n1"
                label="Encypt IP Addresses"
              />
              <v-checkbox
                v-model="formValues.isEncryptUserAgent"
                color="#2196f3"
                class="mt-1"
                label="Encrypt User Agent"
              />
              <v-checkbox
                v-model="formValues.isHideBrowser"
                color="#2196f3"
                class="mt-1"
                label="Hide Browser Information"
              />
              <v-checkbox
                v-model="formValues.isEncryptCapturedData"
                color="#2196f3"
                class="mt-1"
                label="Encrypt Captured Data"
              />
              <v-checkbox
                v-model="formValues.isEncryptEmailAddress"
                color="#2196f3"
                class="mt-1"
                label="Encypt and Mask Email Addresses (e.g. 1@domain.com)"
              />
            </div>
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
      </div>
    </v-form>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
export default {
  name: 'DataAnonymization',
  components: {
    CompanySettingsHeader
  },
  data() {
    return {
      formValues: {
        isEncryptIp: false,
        isEncryptUserAgent: false,
        isHideBrowser: false,
        isEncryptCapturedData: false,
        isEncryptEmailAddress: false
      }
    }
  },
  methods: {
    submit() {}
  }
}
</script>

<style></style>
