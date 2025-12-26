<template>
  <article id="advanced-settings-ip-addresses">
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
      :labels="{
        title: labels.IpAddresses,
        subtitle: labels.IPAddressesSubtitle
      }"
      :input-value="ipAddressSearch"
      @on-add-click="handleIpAddressesAdd"
    >
      <template #search-input>
        <InputIpAddress id="input--advanced-settings-ip-addresses" v-model.trim="ipAddressSearch" />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-if="dataContainerWithSearchItems.length"
      v-model.trim="dataContainerWithSearchItems"
      ref="dataContainerWithSearch"
      text-field-error-message="This Ip address is not valid!"
      text-field-placeholder="Enter an Ip address"
      invalid-message="There are invalid entries, please change them."
      :text-field-rules="[(v) => Validations.ip(v), (v) => Validations.startsWithSpace(v)]"
      :getEditability="getEditability"
      :disabledTooltipText="labels.ExcludedIPTooltipText"
      @on-delete="handleDeleteItem"
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
import {
  getFormData,
  setFormData,
  getFormDataWithObjects
} from '@/components/Integrations/AdvancedSettings/util'
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
    },
    isActionButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Validations,
      isBatchImportPopupOpen: false,
      ipAddressSearch: '',
      dataContainerWithSearchItems: [],
      initialData: [],
      dataWithObjects: [],
      labels
    }
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
    formData(val = []) {
      this.setFormDataToIpAddresses(val)
    }
  },
  created() {
    this.setFormDataToIpAddresses()
  },
  methods: {
    getEditability(value) {
      return this.dataWithObjects?.find((item) => item.value === value)?.isEditable
    },
    setFormDataToIpAddresses(val = this.formData) {
      this.dataContainerWithSearchItems = getFormData(val, 'IP')
      this.initialData = JSON.parse(JSON.stringify(this.dataContainerWithSearchItems))
      this.dataWithObjects = getFormDataWithObjects(val, 'IP')
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
      this.dataWithObjects.unshift({
        value: this.ipAddressSearch,
        exclusionType: 'IP',
        isEditable: true
      })
      this.resetIpAddresses()
    },
    handleDeleteItem(index) {
      this.dataWithObjects.splice(index, 1)
    },
    resetIpAddresses() {
      this.ipAddressSearch = ''
    },
    handleSaveChanges() {
      if (this.$refs.dataContainerWithSearch && !this.$refs.dataContainerWithSearch.isAllValid)
        return
      for (let i = 0; i < this.dataWithObjects.length; i++) {
        this.dataWithObjects[i].value = this.dataContainerWithSearchItems[i]
      }
      const editableItems = this.dataWithObjects.filter((item) => item.isEditable)
      const payload = setFormData(editableItems, 'IP')
      this.$emit('on-submit', payload, 'IP')
    }
  }
}
</script>
