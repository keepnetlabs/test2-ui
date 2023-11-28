<template>
  <div class="smtp-settings">
    <PrivacyOptionsDialog
      v-if="isShowPrivacyOptionsDialog"
      :status="isShowPrivacyOptionsDialog"
      @on-close="toggleShowPrivacyOptionsDialog"
      @on-success="handleSuccess"
    />
    <CompanySettingsHeader
      title="Data Privacy"
      sub-title="Setting the visibility of target users' data"
    />
    <div
      v-if="isReturnMainAccountVisible"
      class="bg-warning px-4 py-4 max-w-554 mb-2 text-primary-color align-start fs-medium d-flex br-2"
    >
      <VIcon color="#B6791D">mdi-alert-circle</VIcon>
      <span class="ml-2"
        >You need to be a company system user to change the account privacy settings</span
      >
    </div>
    <FormGroup
      class="input-distribution"
      title="Privacy Options"
      sub-title="Password, email address, username, and similar fields are transferred to the platform encrypted and could be displayed in two options:"
    >
      <VRadioGroup
        v-model="pentesterMasked"
        :class="[
          'mt-2 pt-0 campaign-manager-target-groups-radio',
          isReturnMainAccountVisible && 'k-radio-group-custom'
        ]"
        hide-details
        :disabled="isReturnMainAccountVisible"
      >
        <VRadio
          :id="`input--data-privacy-masked`"
          class="mb-0 align-start"
          color="#2196f3"
          :value="false"
          :disabled="isReturnMainAccountVisible"
        >
          <template #label>
            <div>
              Display user entered data including passwords as it is.
              <p class="mb-0 font-italic">
                For an email address like alex@company.com, it will be shown as is
              </p>
              <p class="mb-0 font-italic">
                only to your company’s system users.
              </p>
            </div>
          </template>
        </VRadio>
        <VRadio
          :id="`input--data-privacy-clear`"
          class="mb-4 mt-2 align-start"
          color="#2196f3"
          :value="true"
          :disabled="isReturnMainAccountVisible"
        >
          <template #label>
            <div>
              (Default) Mask original data, e.g., a***********m
              <p class="mb-0 font-italic">
                An email like alex@company.com would appear as a***********m.
              </p>
              <p class="mb-0 font-italic">
                There is no way to revert back masked data with this option!
              </p>
            </div>
          </template>
        </VRadio>
      </VRadioGroup>
    </FormGroup>
    <div>
      <SaveButton
        :style="isActionButtonDisabled && { opacity: '0.5', pointerEvents: 'none' }"
        @click="handleSave"
      />
    </div>
  </div>
</template>
<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import SaveButton from '@/components/Common/Buttons/SaveButton'

import { getCompanyDataPrivacy, saveCompanyDataPrivacy } from '@/api/company'
import PrivacyOptionsDialog from '@/components/Company Settings/Privacy/PrivacyOptionsDialog.vue'
export default {
  name: 'DataPrivacy',
  components: {
    PrivacyOptionsDialog,
    CompanySettingsHeader,
    FormGroup,
    SaveButton
  },
  data() {
    return {
      isShowPrivacyOptionsDialog: false,
      pentesterMasked: true,
      defaultPentesterValue: true,
      isApiCalling: false
    }
  },
  computed: {
    isReturnMainAccountVisible() {
      return (
        localStorage.getItem('companyResourceId') !==
        localStorage.getItem('selectedCompanyRequestId')
      )
    },
    isActionButtonDisabled() {
      return (
        this.defaultPentesterValue === this.pentesterMasked ||
        this.isApiCalling ||
        this.isReturnMainAccountVisible
      )
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      getCompanyDataPrivacy().then((response) => {
        this.pentesterMasked = response?.data?.data.pentesterMasked ?? true
        this.defaultPentesterValue = this.pentesterMasked
      })
    },
    handleSave() {
      if (!this.pentesterMasked) {
        this.isShowPrivacyOptionsDialog = true
      } else {
        this.callForSubmitApi()
      }
    },
    callForSubmitApi() {
      this.isApiCalling = true
      saveCompanyDataPrivacy({ pentesterMasked: this.pentesterMasked }).then(() => {
        this.isApiCalling = false
        this.defaultPentesterValue = this.pentesterMasked
      })
    },
    handleSuccess() {
      this.callForSubmitApi()
      this.toggleShowPrivacyOptionsDialog(false)
    },
    toggleShowPrivacyOptionsDialog(changeValue = true) {
      if (changeValue) this.pentesterMasked = !this.pentesterMasked
      this.isShowPrivacyOptionsDialog = !this.isShowPrivacyOptionsDialog
    }
  }
}
</script>
