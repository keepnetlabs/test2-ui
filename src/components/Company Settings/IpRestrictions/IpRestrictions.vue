<template>
  <article class="company-ip-restrictions">
    <company-settings-header
      title="IP Restrictions"
      sub-title="Manage the IP ranges that are allowed to access this company account."
    />
    <DatatableLoading v-if="isLoading" class="mt-5" :loading="isLoading" />
    <div v-else class="company-ip-restrictions__content">
      <BatchImportPopup
        v-if="isBatchImportPopupOpen"
        text-area-placeholder="192.168.1.1, 192.168.1.0/24"
        subtitle="Add single IP addresses or CIDR ranges separated by commas or new lines."
        :status="isBatchImportPopupOpen"
        @on-close="toggleBatchImportPopup"
        @on-confirm="handleBatchImport"
      />
      <AlertBox
        v-if="canRenderDefaultAlert"
        class="alert-box--info-custom company-ip-restrictions__alert mb-6"
        icon-name="mdi-information"
        icon-color="#2196F3"
        text="No IP restrictions are configured. This is the default state and users can sign in from any IP address."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />

      <DataContainerWithSearchInput
        ref="refSearchInput"
        :labels="{
          title: 'Allowed IP Range',
          subtitle: 'Add a single IP address or CIDR range, for example 192.168.1.0/24.'
        }"
        :input-value="ipAddressSearch"
        @on-add-click="handleIpAddressesAdd"
      >
        <template #search-input>
          <InputIpAddress
            v-model.trim="ipAddressSearch"
            id="input--company-ip-restriction-range"
            placeholder="Enter an IP address or CIDR range"
            errorMessage="This is not a valid IP range"
            :rules="inputRules"
          />
        </template>
      </DataContainerWithSearchInput>
      <DataContainerWithSearch
        v-model.trim="dataContainerWithSearchItems"
        removeDuplicates
        showValidationErrorMesssage
        ref="dataContainerWithSearch"
        text-field-error-message="Invalid IP range"
        text-field-placeholder="Enter IP address or CIDR range"
        invalid-message="There are invalid entries, please change them."
        :text-field-rules="ipRangeRules"
        @input="handleInput"
      />
      <button
        id="btn-import--company-ip-restriction"
        class="ip-restriction__button mb-6 ml-2"
        type="button"
        @click="toggleBatchImportPopup"
      >
        <v-icon medium left color="blue" class="ml-0">mdi-swap-vertical</v-icon>
        {{ labels.BatchImport.toUpperCase() }}
      </button>
      <v-btn
        id="btn-save--company-ip-restriction"
        class="white--text btn-util btn-save-changes"
        color="#2196f3"
        rounded
        :style="getSaveButtonStyle"
        @click="handleSaveChanges"
      >
        {{ labels.SaveChanges }}
      </v-btn>
    </div>
  </article>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import AlertBox from '@/components/AlertBox'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import {
  createCompanyIpRestrictions,
  deleteCompanyIpRestriction,
  getCompanyIpRestrictions
} from '@/api/companyIpRestrictions'

export default {
  name: 'IpRestrictions',
  components: {
    AlertBox,
    BatchImportPopup,
    CompanySettingsHeader,
    DataContainerWithSearch,
    DataContainerWithSearchInput,
    DatatableLoading,
    InputIpAddress
  },
  data() {
    return {
      dataContainerWithSearchItems: [],
      initialData: [],
      initialIpRestrictionItems: [],
      ipAddressSearch: '',
      isBatchImportPopupOpen: false,
      isLoading: false,
      isSaving: false,
      labels,
      ipRangeRules: [
        (v) => Validations.required(v, 'Required'),
        (v) => Validations.startsWithSpace(v),
        (v) => this.validateIpRange(v)
      ],
      inputRules: []
    }
  },
  watch: {
    ipAddressSearch(val) {
      this.inputRules = val ? this.ipRangeRules : []
    }
  },
  computed: {
    canCreateIpRestrictions() {
      return this.$store.getters['permissions/getCompanyIpRestrictionsCreatePermissions']
    },
    canDeleteIpRestrictions() {
      return this.$store.getters['permissions/getCompanyIpRestrictionsDeletePermissions']
    },
    canRenderDefaultAlert() {
      return !this.initialIpRestrictionItems.length && !this.dataContainerWithSearchItems.length
    },
    addedIpRanges() {
      return this.dataContainerWithSearchItems.filter((item) => !this.initialData.includes(item))
    },
    deletedIpRestrictionItems() {
      return this.initialIpRestrictionItems.filter(
        (item) => !this.dataContainerWithSearchItems.includes(item.ipRange)
      )
    },
    isInitialDataAndModelEqual() {
      return JSON.stringify(this.dataContainerWithSearchItems) === JSON.stringify(this.initialData)
    },
    getIsActionButtonDisabled() {
      return this.isSaving || this.isInitialDataAndModelEqual
    },
    getSaveButtonStyle() {
      return {
        opacity: this.getIsActionButtonDisabled ? 0.5 : 1,
        cursor: this.getIsActionButtonDisabled ? 'default' : 'pointer',
        pointerEvents: this.getIsActionButtonDisabled ? 'none' : 'auto'
      }
    }
  },
  created() {
    this.callForIpRestrictions()
  },
  methods: {
    callForIpRestrictions() {
      this.isLoading = true
      return getCompanyIpRestrictions()
        .then((response) => {
          this.initialIpRestrictionItems = this.normalizeIpRestrictions(response?.data?.data)
          this.initialData = this.initialIpRestrictionItems.map((item) => item.ipRange)
          this.dataContainerWithSearchItems = structuredClone(this.initialData)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    normalizeIpRestrictions(data) {
      const items = Array.isArray(data)
        ? data
        : data?.results || data?.ipRestrictions || data?.ipRanges || []

      return items.map((item, index) => {
        const ipRange = typeof item === 'string' ? item : item?.ipRange || item?.ipAddress || ''
        const resourceId =
          typeof item === 'string'
            ? ''
            : item?.resourceId || item?.id || item?.ipRestrictionId || ''

        return {
          key: resourceId || `${ipRange}-${index}`,
          ipRange,
          resourceId
        }
      })
    },
    validateIpRange(value = '') {
      if (value.includes('*')) return 'Invalid IP range'
      return Validations.ipv4Oripv6(value, 'Invalid IP range')
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems = [
        ...new Set([...data, ...this.dataContainerWithSearchItems])
      ]
    },
    handleInput(newItems) {
      this.dataContainerWithSearchItems = newItems
    },
    handleIpAddressesAdd() {
      if (!this.ipAddressSearch) return
      this.dataContainerWithSearchItems = [
        ...new Set([this.ipAddressSearch, ...this.dataContainerWithSearchItems])
      ]
      this.resetIpAddresses()
    },
    resetIpAddresses() {
      this.ipAddressSearch = ''
    },
    handleSaveChanges() {
      if (!this.$refs.dataContainerWithSearch) return false
      this.$refs.dataContainerWithSearch.checkAllValid()
      if (!this.$refs.dataContainerWithSearch.isAllValid) return false

      const requests = []
      const deletedItemsWithResourceId = this.deletedIpRestrictionItems.filter(
        (item) => item.resourceId
      )

      if (this.addedIpRanges.length) {
        requests.push(createCompanyIpRestrictions({ ipRanges: this.addedIpRanges }))
      }
      deletedItemsWithResourceId.forEach((item) => {
        requests.push(deleteCompanyIpRestriction(item.resourceId))
      })

      if (!requests.length) {
        return this.callForIpRestrictions()
      }

      this.isSaving = true
      return Promise.all(requests)
        .then(() => {
          this.showSuccessSnackbar()
          this.callForIpRestrictions()
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    showSuccessSnackbar() {
      this.$store.dispatch('common/createSnackBar', {
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle',
        message: 'IP restrictions updated successfully.'
      })
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    }
  }
}
</script>
