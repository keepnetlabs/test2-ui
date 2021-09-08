<template>
  <section id="advanced-settings-url">
    <BatchImportPopup
      v-if="isBatchImportPopupOpen"
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
  </section>
</template>

<script>
import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import BatchImportPopup from '@/components/Company Settings/SAML/BatchImportPopup'
export default {
  name: 'AdvancedSettingsURLs',
  components: { BatchImportPopup, DataContainerWithSearch, InputUrl, DataContainerWithSearchInput },
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      urlSearch: '',
      dataContainerWithSearchItems: [],
      isBatchImportPopupOpen: false,
      isActionButtonDisabled: false,
      labels
    }
  },
  methods: {
    handleUrlAdd() {
      this.dataContainerWithSearchItems.unshift(this.urlSearch)
      this.resetUrlSearch()
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
      if (this.$refs.refSearchInput.validateForm()) {
        //todo let the create
      }
    }
  }
}
</script>
