<template>
  <div class="smtp-settings">
    <CompanySettingsHeader
      title="Data Privacy"
      sub-title="Setting the visibility of target users' data"
    />
    <FormGroup
      class="input-distribution"
      title="Store and Display Option"
      sub-title="This option allows you to store and display the data that target users entered into the landing page. The change does not affect the existing data."
    >
      <VRadioGroup
        v-model="pentesterMasked"
        class="mt-2 mb-3 pt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <VRadio
          :id="`input--data-privacy-masked`"
          class="mb-0"
          color="#2196f3"
          label="Store and display masked (Default and recommended)"
          :value="true"
        />
        <VRadio
          :id="`input--data-privacy-clear`"
          class="mb-0 mt-4"
          color="#2196f3"
          label="Store encrypted and display clear text"
          :value="false"
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
    isActionButtonDisabled() {
      return this.defaultPentesterValue === this.pentesterMasked || this.isApiCalling
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
