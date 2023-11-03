<template>
  <div class="smtp-settings">
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
      title="Store and Display Option"
      sub-title="This option allows you to store and display the data that target users entered into the landing page. The change does not affect the existing data."
    >
      <VRadioGroup
        v-model="pentesterMasked"
        :class="[
          'mt-2 mb-3 pt-0 campaign-manager-target-groups-radio',
          isReturnMainAccountVisible && 'k-radio-group-custom'
        ]"
        hide-details
        :disabled="isReturnMainAccountVisible"
      >
        <VRadio
          :id="`input--data-privacy-masked`"
          class="mb-0"
          color="#2196f3"
          label="Store and display masked (Default and recommended)"
          :value="true"
          :disabled="isReturnMainAccountVisible"
        />
        <VRadio
          :id="`input--data-privacy-clear`"
          class="mb-0 mt-4"
          color="#2196f3"
          label="Store encrypted and display clear text"
          :value="false"
          :disabled="isReturnMainAccountVisible"
        />
      </VRadioGroup>
    </FormGroup>
    <div>
      <SaveButton
        class="mt-1"
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
export default {
  name: 'DataPrivacy',
  components: {
    CompanySettingsHeader,
    FormGroup,
    SaveButton
  },
  data() {
    return {
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
      this.isApiCalling = true
      saveCompanyDataPrivacy({ pentesterMasked: this.pentesterMasked }).then(() => {
        this.isApiCalling = false
        this.defaultPentesterValue = this.pentesterMasked
      })
    }
  }
}
</script>
