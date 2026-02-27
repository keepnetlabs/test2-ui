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
      :input-value="ipAddressSearch"
      :labels="{
        title: labels.ExcludeIPAddress,
        subtitle: labels.ExcludeIPAddressSubtitle
      }"
      @on-add-click="handleIpAddressesAdd"
    >
      <template #search-input>
        <InputIpAddress
          v-model.trim="ipAddressSearch"
          id="input--settings-exclude-ip-address"
          errorMessage="This is not a valid IP address"
          :rules="rules"
        />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-model.trim="dataContainerWithSearchItems"
      removeDuplicates
      showValidationErrorMesssage
      ref="dataContainerWithSearch"
      text-field-error-message="Invalid IP address"
      text-field-placeholder="Enter IP address"
      invalid-message="There are invalid entries, please change them."
      :text-field-rules="[(v) => Validations.ipv4Oripv6(v), (v) => Validations.startsWithSpace(v)]"
      @input="handleInput"
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
      :style="getSaveButtonStyle"
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
import SmishingService from '@/api/smishing'

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
      isActionButtonDisabled: !this.$store.getters[
        'permissions/getSmishingExcludedIpPostPermissions'
      ],
      isBatchImportPopupOpen: false,
      ipAddressSearch: '',
      initialData: [],
      dataContainerWithSearchItems: [],
      labels,
      ipRules: [
        (v) => Validations.ipv4Oripv6(v, 'This is not a valid IP address'),
        (v) => Validations.startsWithSpace(v)
      ],
      rules: []
    }
  },
  created() {
    this.getExcludedIPAddresses()
  },
  computed: {
    isInitialDataAndModelEqual() {
      return JSON.stringify(this.dataContainerWithSearchItems) === JSON.stringify(this.initialData)
    },
    getIsActionButtonDisabled() {
      return this.isActionButtonDisabled || this.isInitialDataAndModelEqual
    },
    getSaveButtonStyle() {
      return {
        opacity: this.getIsActionButtonDisabled ? 0.5 : 1,
        cursor: this.getIsActionButtonDisabled ? 'default' : 'pointer',
        pointerEvents: this.getIsActionButtonDisabled ? 'none' : 'auto'
      }
    }
  },
  watch: {
    ipAddressSearch(val) {
      if (val) {
        this.rules = this.ipRules
      } else {
        this.rules = []
      }
    }
  },
  methods: {
    getExcludedIPAddresses() {
      this.isLoading = true
      SmishingService.getExcludedIPAddresses()
        .then((response) => {
          this.dataContainerWithSearchItems =
            response?.data?.data?.phishingCampaignExcludedIPList.map((item) => item.excludedIP) ||
            []
          this.initialData = structuredClone(this.dataContainerWithSearchItems)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems.unshift(...data)
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    },
    handleInput(newItems) {
      this.dataContainerWithSearchItems = newItems
    },
    handleIpAddressesAdd() {
      if (this.ipAddressSearch) {
        this.dataContainerWithSearchItems.unshift(this.ipAddressSearch)
        this.resetIpAddresses()
      }
    },
    resetIpAddresses() {
      this.ipAddressSearch = ''
    },
    handleSaveChanges() {
      if (this.$refs.dataContainerWithSearch) {
        this.$refs.dataContainerWithSearch.checkAllValid()
        if (!this.$refs.dataContainerWithSearch.isAllValid) {
          return
        }
        this.isActionButtonDisabled = true
        const payload = {
          excludedIPs: structuredClone(this.dataContainerWithSearchItems)
        }
        SmishingService.postExcludedIPAddresses(payload)
          .then(() => {
            this.getExcludedIPAddresses()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
