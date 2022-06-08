<template>
  <DatatableLoading v-if="isLoading" class="mt-5" :loading="isLoading" />
  <article v-else id="settings-exclude-ip-address">
    <BatchImportPopup
      v-if="isBatchImportPopupOpen"
      text-area-placeholder="192.168.1.1"
      :subtitle="labels.BatchImportPopupIpAddressSubtitle"
      :status="isBatchImportPopupOpen"
      @on-close="toggleBatchImportPopup"
      @on-confirm="handleBatchImport"
    />
    <DataContainerWithSearchInput
      ref="refSearchInput"
      :labels="{ title: labels.ExcludeIPAddress, subtitle: labels.ExcludeIPAddressSubtitle }"
      @on-add-click="handleIpAddressesAdd"
    >
      <template #search-input>
        <InputIpAddress id="input--settings-exclude-ip-address" v-model.trim="ipAddressSearch" />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-if="dataContainerWithSearchItems.length"
      v-model.trim="dataContainerWithSearchItems"
      ref="dataContainerWithSearch"
      text-field-error-message="This is not a valid IP address"
      text-field-placeholder="Enter IP address"
      invalid-message="There are invalid entries, please change them."
      :text-field-rules="[(v) => Validations.ip(v), (v) => Validations.startsWithSpace(v)]"
    />
    <button
      id="btn-import--exclude-ip-address"
      class="ip-restriction__button mb-6 ml-2"
      type="button"
      @click="toggleBatchImportPopup"
    >
      <v-icon medium left color="blue" class="ml-0">mdi-swap-vertical</v-icon
      >{{ labels.BatchImport.toUpperCase() }}
    </button>
    <v-btn
      id="btn-save--exclude-ip-address"
      class="white--text btn-util btn-save-changes"
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
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'

export default {
  name: 'ExcludeIPAddress',
  components: {
    DataContainerWithSearch,
    InputIpAddress,
    DataContainerWithSearchInput,
    BatchImportPopup,
    DatatableLoading
  },
  data() {
    return {
      isLoading: false,
      Validations,
      isActionButtonDisabled: false,
      isBatchImportPopupOpen: false,
      ipAddressSearch: '',
      dataContainerWithSearchItems: [],
      labels
    }
  },
  created() {
    this.getExcludedIPAddresses()
  },
  methods: {
    getExcludedIPAddresses() {
      this.isLoading = true
      return new Promise((res) => setTimeout(() => res(), 2000)).finally(() => {
        this.isLoading = false
      })
      // TODO: Make API call to get excluded IP addresses
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
      if (this.$refs.dataContainerWithSearch && !this.$refs.dataContainerWithSearch.isAllValid)
        return
      // TODO: Make API call to save changes
    }
  }
}
</script>
