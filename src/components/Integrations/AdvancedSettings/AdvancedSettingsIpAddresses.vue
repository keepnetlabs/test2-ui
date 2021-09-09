<template>
  <article id="advanced-settings-ip-addresses">
    <BatchImportPopup
      v-if="isBatchImportPopupOpen"
      :subtitle="labels.BatchImportPopupIpAddressSubtitle"
      :status="isBatchImportPopupOpen"
      @on-close="toggleBatchImportPopup"
      @on-confirm="handleBatchImport"
    />
    <DataContainerWithSearchInput
      ref="refSearchInput"
      :labels="{ title: labels.IpAddresses, subtitle: labels.IPAddressesSubtitle }"
      @on-add-click="handleIpAddressesAdd"
    >
      <template #search-input>
        <InputIpAddress id="input--advanced-settings-ip-addresses" v-model.trim="ipAddressSearch" />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-if="dataContainerWithSearchItems.length"
      v-model.trim="dataContainerWithSearchItems"
      text-field-error-message="This Ip address is not valid!"
      text-field-placeholder="Enter an Ip address"
      :text-field-rules="[(v) => Validations.ip(v), (v) => Validations.startsWithSpace(v)]"
    />
    <button
      id="btn-import--advanced-settings-url"
      class="ip-restriction__button mb-6 ml-2"
      type="button"
      @click="toggleBatchImportPopup"
    >
      <v-icon medium left color="blue" class="ml-0">mdi-swap-vertical</v-icon
      >{{ labels.BatchImport.toUpperCase() }}
    </button>
    <v-btn
      id="btn-save--advanced-settings-url"
      class="white--text btn-util btn-save-changes mb-6"
      color="#2196f3"
      rounded
      :disabled="isActionButtonDisabled"
      @click="handleSaveChanges"
    >
      {{ labels.SaveChanges }}
    </v-btn>
  </article>
</template>

<script>
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'AdvancedSettingsIpAddresses',
  components: {
    DataContainerWithSearch,
    InputIpAddress,
    DataContainerWithSearchInput,
    BatchImportPopup
  },
  props: {
    formData: {
      type: Array
    }
  },
  data() {
    return {
      Validations,
      isBatchImportPopupOpen: false,
      ipAddressSearch: '',
      dataContainerWithSearchItems: [],
      isActionButtonDisabled: false,
      labels
    }
  },
  watch: {
    formData(val = []) {
      this.setFormDataToIpAddresses(val)
    }
  },
  created() {
    this.setFormDataToIpAddresses()
  },
  methods: {
    setFormDataToIpAddresses(val = this.formData) {
      this.dataContainerWithSearchItems = val.reduce((acc, item) => {
        const { exclusionType, value } = item
        if (exclusionType === 'IP') {
          acc.push(value)
        }
        return acc
      }, [])
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems.unshift(...data)
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    },
    handleIpAddressesAdd() {
      this.dataContainerWithSearchItems.unshift(this.ipAddressSearch)
      this.resetIpAddresses()
    },
    resetIpAddresses() {
      this.ipAddressSearch = ''
    },
    handleSaveChanges() {
      if (this.dataContainerWithSearchItems.length) {
        const payload = this.dataContainerWithSearchItems.reduce((acc, item) => {
          acc.push({ attachmentExtensionType: null, exclusionType: 'IP', value: item })
          return acc
        }, [])
        this.$emit('on-submit', payload, 'IP')
      }
    }
  }
}
</script>
