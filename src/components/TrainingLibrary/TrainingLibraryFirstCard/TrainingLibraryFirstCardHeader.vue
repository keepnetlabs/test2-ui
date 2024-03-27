<template>
  <div>
    <DownloadModal
      v-if="isShowDownloadModal"
      :isShow="isShowDownloadModal"
      :download="download"
      :title="downloadModalTitle"
      @downloadEvent="downloadEvent"
      @changeDownloadModalStatus="toggleDownloadModal"
    />
    <div class="training-library-list-view-first-card-header">
      <div>
        <VTextField
          id="input--search-training-library"
          class="training-library-list-view-first-card-header__search"
          ref="searchInput"
          outlined
          prepend-inner-icon="mdi-magnify"
          hide-details
          :value="search"
          :placeholder="placeholder"
          @input="handleDebouncedSearch"
        />
        <div>
          <VBtn
            class="clust-btn btn-hover mr-1 training-library-clust-btn"
            icon
            outlined
            :style="!isListView && { backgroundColor: '#2196f3' }"
            :color="!isListView ? '#2196f3' : '#757575'"
            @click="setListView(false)"
          >
            <img :src="getCardViewIcon" alt="icon" />
          </VBtn>
          <VBtn
            class="clust-btn btn-hover training-library-clust-btn"
            icon
            :style="isListView && { backgroundColor: '#2196f3' }"
            :outlined="!isListView"
            :color="isListView ? '#2196f3' : '#757575'"
            @click="setListView(true)"
          >
            <img :src="getBulletedIcon" alt="icon" />
          </VBtn>
        </div>
      </div>
      <div class="training-library-list-view-first-card-header__right-side">
        <TrainingLibraryFirstCardNewButton />
        <VTooltip bottom opacity="1">
          <template #activator="{ on }">
            <VBtn v-on="on" id="`btn-refresh--training-table" icon>
              <VIcon @click="callForData">mdi-refresh</VIcon>
            </VBtn>
          </template>
          <span class="tooltip-span">Refresh</span>
        </VTooltip>
        <VMenu v-model="isDownloadMenuOpen" bottom offset-y>
          <template #activator="{ on: menu, attrs }">
            <VTooltip bottom opacity="1">
              <template #activator="{ on: tooltip }">
                <VBtn
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  id="btn-download--training-library"
                  class="btn-hover"
                  icon
                >
                  <v-icon>mdi-download</v-icon>
                </VBtn>
              </template>
              <span class="tooltip-span">Download Options</span>
            </VTooltip>
          </template>
          <VListItem
            v-for="(item, index) in downloadButtonOptions"
            :id="`item--download-option-${index}`"
            :key="index"
            @click="handleDownloadButtonClick(item)"
          >
            <VListItemTitle>{{ item }}</VListItemTitle>
          </VListItem>
        </VMenu>
        <TrainingLibraryFirstCardSettings />
      </div>
    </div>
  </div>
</template>

<script>
import TrainingLibraryFirstCardNewButton from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardNewButton'
import { downloadButtonOptions } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import TrainingLibraryFirstCardSettings from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardSettings.vue'
import { mapActions, mapGetters } from 'vuex'
import useDebounce from '@/hooks/useDebounce'
import DownloadModal from '@/components/DataTableComponents/DownloadModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingLibraryFirstCardHeader',
  components: {
    DownloadModal,
    TrainingLibraryFirstCardSettings,
    TrainingLibraryFirstCardNewButton
  },
  mixins: [useDebounce],
  data() {
    return {
      downloadButtonOptions,
      isDownloadMenuOpen: false,
      downloadModalTitle: '',
      isShowDownloadModal: false,
      download: { xls: true, csv: true, pdf: true }
    }
  },
  computed: {
    ...mapGetters({
      search: 'trainingLibrary/getSearch',
      placeholder: 'trainingLibrary/getSearchPlaceholder',
      isListView: 'trainingLibrary/getIsListView',
      axiosPayload: 'trainingLibrary/getAxiosPayload'
    }),
    getBulletedIcon() {
      return this.isListView
        ? require('../../../assets/img/white-bulletin-list.svg')
        : require('../../../assets/img/bulletin-list.svg')
    },
    getCardViewIcon() {
      return this.isListView
        ? require('../../../assets/img/view-module-icon.svg')
        : require('../../../assets/img/view-white-module-icon.svg')
    }
  },
  methods: {
    ...mapActions({
      callForData: 'trainingLibrary/callForTrainingLibrary',
      handleSearch: 'trainingLibrary/setSearch',
      setListView: 'trainingLibrary/setListView'
    }),
    handleDebouncedSearch(event) {
      this.debounce(() => {
        this.handleSearch(event)
      })
    },
    handleDownloadButtonClick(item = '') {
      this.isShowDownloadModal = true
      this.downloadModalTitle = item
    },
    toggleDownloadModal() {
      this.isShowDownloadModal = !this.isShowDownloadModal
    },
    downloadEvent(downloadTypes) {
      downloadTypes.forEach((item) => {
        let payload = {
          pageNumber: this.axiosPayload.pageNumber,
          pageSize: this.axiosPayload.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: this.downloadModalTitle === this.downloadButtonOptions[1],
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter,
          trainingSearchType: this.axiosPayload.trainingSearchType,
          trainingType: this.axiosPayload.trainingType
        }
        AwarenessEducatorService.exportTrainingList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Training-Library-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
