<template>
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
        @input="handleSearch"
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
</template>

<script>
import TrainingLibraryFirstCardNewButton from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardNewButton'
import { downloadButtonOptions } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import TrainingLibraryFirstCardSettings from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardSettings.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TrainingLibraryFirstCardHeader',
  components: { TrainingLibraryFirstCardSettings, TrainingLibraryFirstCardNewButton },
  data() {
    return {
      downloadButtonOptions,
      isDownloadMenuOpen: false
    }
  },
  computed: {
    ...mapGetters({
      search: 'trainingLibrary/getSearch',
      placeholder: 'trainingLibrary/getSearchPlaceholder',
      isListView: 'trainingLibrary/getIsLastView'
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
    handleDownloadButtonClick(item) {}
  }
}
</script>
