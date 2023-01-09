<template>
  <section id="advanced-settings-url">
    <BatchImportPopup
      v-if="isBatchImportPopupOpen"
      text-area-placeholder="https://subdomain.domain.com"
      :status="isBatchImportPopupOpen"
      @on-close="toggleBatchImportPopup"
      @on-confirm="handleBatchImport"
    />
    <DataContainerWithSearchInput
      ref="refSearchInput"
      :labels="{ title: labels.URLS, subtitle: labels.URLSSubtitle }"
      @on-add-click="handleUrlAdd"
    >
      <template #search-input>
        <InputUrl
          id="input--advanced-settings-url"
          placeholder="Enter URL"
          v-model.trim="urlSearch"
        />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-if="dataContainerWithSearchItems.length"
      v-model.trim="dataContainerWithSearchItems"
      ref="dataContainerWithSearch"
      :filters="['invalid', 'custom']"
      :text-field-rules="[...COMMON_CONSTANTS.DEFAULT_URL_RULES]"
      :getEditability="getEditability"
      :disabledTooltipText="labels.ExcludedURLTooltipText"
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
      :disabled="isActionButtonDisabled"
      @click="handleSaveChanges"
    >
      {{ labels.SaveChanges }}
    </v-btn>
  </section>
</template>

<script>
import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import {
  getFormData,
  setFormData,
  getFormDataWithObjects
} from '@/components/Integrations/AdvancedSettings/util'
export default {
  name: 'AdvancedSettingsURLs',
  components: { BatchImportPopup, DataContainerWithSearch, InputUrl, DataContainerWithSearchInput },
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
      urlSearch: '',
      dataContainerWithSearchItems: [],
      dataWithObjects: [],
      isBatchImportPopupOpen: false,
      labels,
      COMMON_CONSTANTS
    }
  },
  watch: {
    formData(val = []) {
      this.setFormDataToURL(val)
    }
  },
  created() {
    this.setFormDataToURL()
  },
  methods: {
    getEditability(value) {
      return this.dataWithObjects?.find((item) => item.value === value)?.isEditable
    },
    setFormDataToURL(val = this.formData) {
      this.dataContainerWithSearchItems = getFormData(val, 'URL')
      this.dataWithObjects = getFormDataWithObjects(val, 'URL')
    },
    handleUrlAdd() {
      this.dataContainerWithSearchItems.unshift(this.urlSearch)
      this.dataWithObjects.unshift({
        value: this.urlSearch,
        exclusionType: 'URL',
        isEditable: true
      })
      this.resetUrlSearch()
    },
    handleDeleteItem(index) {
      this.dataWithObjects.splice(index, 1)
    },
    resetUrlSearch() {
      this.urlSearch = ''
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems.unshift(...data)
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    },
    handleSaveChanges() {
      if (this.$refs.dataContainerWithSearch && !this.$refs.dataContainerWithSearch.isAllValid)
        return
      for (let i = 0; i < this.dataWithObjects.length; i++) {
        this.dataWithObjects[i].value = this.dataContainerWithSearchItems[i]
      }
      const editableItems = this.dataWithObjects.filter((item) => item.isEditable)
      const payload = setFormData(editableItems, 'URL')
      this.$emit('on-submit', payload, 'URL')
    }
  }
}
</script>
