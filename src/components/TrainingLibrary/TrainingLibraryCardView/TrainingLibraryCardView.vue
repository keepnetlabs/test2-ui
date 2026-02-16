<template>
  <div>
    <div class="training-library-card-view">
      <div v-if="isLoading">
        <div class="d-flex justify-space-between">
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
        </div>
        <div class="d-flex justify-space-between mt-4">
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="32%"
            :elevation="10"
            boilerplate
            type="image, article"
          ></v-skeleton-loader>
        </div>
      </div>
      <div v-else>
        <div class="training-library-card-view__cards">
          <TrainingLibraryCard v-for="(card, index) in tableData" :key="index" :item="card" />
        </div>
        <div v-if="isRenderEmpty" class="empty-inline training-library-card-view__empty">
          <h2 id="text--empty-table-title" class="people__no-data__header">
            {{ getEmptyTableText }}
          </h2>
          <p
            v-if="getEmptyTableSubtitleText"
            id="text--empty-table-subtitle"
            class="people__no-data__body"
          >
            {{ getEmptyTableSubtitleText }}
          </p>
          <div
            v-if="
              getEmptyTableBtnText &&
              selectedSubTrainingContent !== TRAINING_LIBRARY_TYPES.ALL_TYPES &&
              !isFilterActive &&
              !(selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.SURVEY && !isRootUser)
            "
            class="people__no-data__buttons--button"
            style="height: 36px;"
            id="btn-empty--target-users-people-training-card-view"
            @click="handleEmptyButtonClick"
          >
            <VIcon color="#fff" class="mr-1">mdi-plus</VIcon>
            <span class="fw-600">{{ getEmptyTableBtnText.toUpperCase() }}</span>
          </div>
          <div
            v-else-if="
              getEmptyTableBtnText &&
              selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.ALL_TYPES &&
              !isFilterActive
            "
            class="people__no-data__buttons mt-0"
          >
            <VMenu offset-y transition="scale-transition" nudge-bottom="4">
              <template #activator="{ on }">
                <div
                  class="people__no-data__buttons--button"
                  style="height: 36px;"
                  v-on="on"
                  id="btn-empty--target-users-people-training-card-view-menu"
                >
                  <VIcon color="#fff" class="mr-1">mdi-plus</VIcon>
                  <span class="fw-600">{{ labels.CreateNewMaterial.toUpperCase() }}</span>
                </div>
              </template>
              <div>
                <VList>
                  <VListItem
                    v-for="item in getFilteredTrainingItems"
                    :key="item.id"
                    :id="item.id"
                    @click="handleAddTrainingLibraryContent(item.text)"
                  >
                    <VListItemTitle class="add-users__title">{{ item.text }}</VListItemTitle>
                  </VListItem>
                </VList>
              </div>
            </VMenu>
          </div>
        </div>
        <div
          v-if="tableData.length"
          class="pagination block justify-end training-library-card-view__pagination d-flex mt-6"
        >
          <el-pagination
            :current-page="serverSideProps.pageNumber"
            :page-size="serverSideProps.pageSize"
            :page-sizes="[9, 18, 27]"
            :total="serverSideProps.totalNumberOfRecords"
            layout="sizes, prev, pager, next,slot"
            @current-change="handleServerSideCurrentChange"
            @size-change="handleServerSideSizeChange"
          >
            <template>
              <span class="el-pagination__text el-pagination__text--1">Cards per page: </span>
              <span class="el-pagination__text el-pagination__text--2">
                {{
                  serverSideProps.pageNumber === 1
                    ? 1
                    : (serverSideProps.pageNumber - 1) * serverSideProps.pageSize + 1 > 0
                    ? (serverSideProps.pageNumber - 1) * serverSideProps.pageSize + 1
                    : 0
                }}-{{
                  serverSideProps.pageNumber * serverSideProps.pageSize >
                  serverSideProps.totalNumberOfRecords
                    ? serverSideProps.totalNumberOfRecords
                    : serverSideProps.pageNumber * serverSideProps.pageSize
                }}
                of
                {{ serverSideProps.totalNumberOfRecords }}
              </span>
            </template>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryCard from '../TrainingLibraryCard/TrainingLibraryCard.vue'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import labels from '@/model/constants/labels'
import useAddTrainingLibraryContent from '@/hooks/useAddTrainingLibraryContent'
import { addTrainingItems } from '@/components/TrainingLibrary/utils'
export default {
  name: 'TrainingLibraryCardView',
  components: { TrainingLibraryCard },
  mixins: [useAddTrainingLibraryContent],
  data() {
    return {
      TRAINING_LIBRARY_TYPES,
      labels,
      addTrainingItems
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'trainingLibrary/getTableData',
      serverSideProps: 'trainingLibrary/getServerSideProps',
      axiosPayload: 'trainingLibrary/getAxiosPayload',
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent',
      selectedSubTrainingContent: 'trainingLibrary/getSelectedSubTrainingContent',
      getFilters: 'trainingLibrary/getFilters',
      search: 'trainingLibrary/getSearch',
      isLoading: 'trainingLibrary/getIsLoading'
    }),
    isRenderEmpty() {
      return !this.tableData.length
    },
    isFilterActive() {
      return this.getFilters.some((filter) => filter.isFilterActive) || this.search
    },
    getEmptyTableText() {
      if (this.isFilterActive) return 'Sorry, that search and filter criteria has no results.'
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES)
        return labels.EmptyTrainingFavorites
      return this.getEmptyTableTextBySelectedSubTab
    },
    getEmptyTableTextBySelectedSubTab() {
      if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.ALL_TYPES) {
        return labels.EmptyTrainingMaterial
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.TRAINING) {
        return labels.EmptyTraining
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) {
        return labels.EmptyInfographic
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.POSTER) {
        return labels.EmptyPoster
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.SCREENSAVER) {
        return labels.EmptyScreensaver
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.SURVEY) {
        return labels.EmptySurvey
      } else return labels.EmptyLearningPath
    },
    getEmptyTableSubtitleText() {
      if (this.isFilterActive) return 'Please try adjusting your search or filter'
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES) return ''
      return ''
    },
    getEmptyTableBtnText() {
      if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES) return ''
      return this.getEmptyTableBtnTextBySelectedSubTab
    },
    getEmptyTableBtnTextBySelectedSubTab() {
      if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.ALL_TYPES) {
        return labels.CreateNewMaterial
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.TRAINING) {
        return labels.CreateNewTraining
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) {
        return labels.CreateNewInfographic
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.POSTER) {
        return labels.CreateNewPoster
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.SCREENSAVER) {
        return labels.CreateNewScreensaver
      } else if (this.selectedSubTrainingContent === TRAINING_LIBRARY_TYPES.SURVEY) {
        return labels.CreateNewSurvey
      } else return labels.CreateNewLearningPath
    },
    isRootUser() {
      return this.$store.getters['auth/userGetter']?.role?.name === 'Root'
    },
    getFilteredTrainingItems() {
      if (this.isRootUser) {
        return this.addTrainingItems
      }
      return this.addTrainingItems.filter((item) => item.text !== 'Survey')
    }
  },
  methods: {
    ...mapActions({
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    handleServerSideCurrentChange(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForTrainingLibrary()
    },
    handleServerSideSizeChange(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.callForTrainingLibrary()
    },
    handleEmptyButtonClick() {
      this.handleAddTrainingLibraryContent(this.selectedSubTrainingContent)
    }
  }
}
</script>
