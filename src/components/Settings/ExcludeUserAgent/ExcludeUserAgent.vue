<template>
  <DatatableLoading v-if="isLoading" class="mt-5" :loading="isLoading" />
  <article v-else id="settings-exclude-user-agent">
    <BatchImportPopup
      v-if="isBatchImportPopupOpen"
      :text-area-placeholder="labels.ExcludeUserAgentBatchImportPlaceholder"
      :subtitle="labels.ExcludeUserAgentBatchImportSubtitle"
      :status="isBatchImportPopupOpen"
      :overrideDelimiter="'\n'"
      @on-close="toggleBatchImportPopup"
      @on-confirm="handleBatchImport"
    />
    <DataContainerWithSearchInput
      ref="refSearchInput"
      :labels="{ title: labels.ExcludeUserAgent, subtitle: labels.ExcludeUserAgentSubtitle }"
      :input-value="userAgentInput"
      @on-add-click="handleUserAgentAdd"
    >
      <template #search-input>
        <InputEntityName
          v-model.trim="userAgentInput"
          :initialRules="[]"
          initialPlaceholder="Enter user agent"
          id="input--settings-exclude-user-agent"
        />
      </template>
    </DataContainerWithSearchInput>
    <DataContainerWithSearch
      v-if="dataContainerWithSearchItems.length"
      v-model.trim="dataContainerWithSearchItems"
      ref="dataContainerWithSearch"
      text-field-placeholder="Search"
      itemHeight="96"
      :textFieldRules="[]"
    />
    <button
      id="btn-import--exclude-user-agent"
      class="ip-restriction__button mb-6 ml-2"
      type="button"
      @click="toggleBatchImportPopup"
    >
      <v-icon medium left color="blue" class="ml-0">mdi-swap-vertical</v-icon
      >{{ labels.BatchImport.toUpperCase() }}
    </button>
    <v-btn
      id="btn-save--exclude-user-agent"
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
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'

export default {
  name: 'ExcludeUserAgent',
  components: {
    DataContainerWithSearch,
    InputEntityName,
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
      userAgentInput: '',
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
    },
    handleBatchImport(data = []) {
      if (!data.length) return
      this.dataContainerWithSearchItems.unshift(...data)
    },
    toggleBatchImportPopup() {
      this.isBatchImportPopupOpen = !this.isBatchImportPopupOpen
    },
    handleUserAgentAdd() {
      if (!this.userAgentInput.trim()) return
      this.dataContainerWithSearchItems.unshift(this.userAgentInput)
      this.resetIpAddresses()
    },
    resetIpAddresses() {
      this.userAgentInput = ''
    },
    handleSaveChanges() {
      if (this.$refs.dataContainerWithSearch && !this.$refs.dataContainerWithSearch.isAllValid)
        return
    }
  }
}
</script>
