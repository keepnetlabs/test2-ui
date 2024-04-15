<template>
  <div class="training-library-card">
    <div :class="['training-library-card__type', getBgColor]">
      {{ item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING ? 'Training' : item.type }}
    </div>
    <div class="training-library-card__img">
      <TrainingLibraryNewBadge v-if="item.isNew" class="training-library-card__new-btn" />
      <TrainingLibraryFavoriteButton
        class="training-library-card__favorite-btn"
        :is-default-favourite="item.isFavourite"
        :training-id="item.trainingId"
        @on-favorite-remove="handleFavoriteRemove"
      />
      <img v-if="item.coverImage" :src="item.coverImage.imageUrl" :alt="item.trainingName" />
      <div class="training-library-card__img--no-img" v-else>
        <VIcon size="82" color="#fff">mdi-image</VIcon>
        <div class="training-library-card__img--no-img-text">No Cover Image</div>
      </div>
    </div>
    <div class="training-library-card__body">
      <VTooltip v-if="isRenderTitleTooltip" bottom>
        <template #activator="{ on }">
          <div v-on="on" ref="refBodyTitle" class="training-library-card__body-title">
            {{ item.trainingName }}
          </div>
        </template>
        <span>{{ item.trainingName }}</span>
      </VTooltip>
      <div ref="refBodyTitle" v-else class="training-library-card__body-title">
        {{ item.trainingName }}
      </div>
      <div class="training-library-card__body-sub">
        <VTooltip v-if="isRenderCreatedByTooltip" bottom>
          <template #activator="{ on }">
            <div ref="refBodyCreatedBy" v-on="on" class="training-library-card__body-sub-category">
              {{ item.createdBy }}
            </div>
          </template>
          <span>{{ item.createdBy }}</span>
        </VTooltip>
        <div v-else ref="refBodyCreatedBy" class="training-library-card__body-sub-category">
          {{ item.createdBy }}
        </div>
        <div class="training-library-card__body-sub-bull"></div>
        <VTooltip v-if="isRenderCategoryTooltip" bottom>
          <template #activator="{ on }">
            <div ref="refBodyCategory" v-on="on" class="training-library-card__body-sub-category">
              {{ item.category }}
            </div>
          </template>
          <span>{{ item.category }}</span>
        </VTooltip>
        <div v-else ref="refBodyCategory" class="training-library-card__body-sub-category">
          {{ item.category }}
        </div>
      </div>
      <div class="training-library-card__body-description">
        <div class="d-flex gap-2">
          <div v-if="item.tags.length" class="training-library-card__body-tag">
            {{ item.tags[0] }}
          </div>
          <VTooltip v-if="item.tags.length > 1" bottom>
            <template #activator="{ on }">
              <div v-on="on" class="training-library-card__body-tag">
                + {{ item.tags.length - 1 }}
              </div>
            </template>
            <span>{{ item.tags.slice(1).toString() }}</span>
          </VTooltip>
        </div>
        <div class="training-library-card__body-languages">
          <VIcon>mdi-web</VIcon>
          <div v-for="(language, languageIndex) in item.languages.slice(0, 2)" :key="language">
            {{ language
            }}<span v-if="item.languages.slice(0, 2).length - 1 > languageIndex" class="ml-1"
              >|</span
            >
          </div>
          <VTooltip v-if="item.languages.length > 3" bottom>
            <template #activator="{ on }">
              <span v-on="on"
                >| +{{ item.languages.length - item.languages.slice(0, 2).length }}
              </span>
            </template>
            <span>{{ item.languages.slice(2).toString() }}</span>
          </VTooltip>
        </div>
      </div>
      <div class="training-library-card__footer">
        <div class="training-library-card__footer-left-side">
          <VTooltip bottom>
            <template #activator="{ on }">
              <VBtn
                v-on="on"
                class="w-100 training-library-card__footer-btn"
                color="#fff"
                rounded
                :ripple="false"
                @click="handlePreviewClick(item)"
              >
                <VIcon class="mr-1" left>mdi-eye</VIcon>
                Preview
              </VBtn>
            </template>
            <span>{{ item.type === 'SCORM' ? 'Training' : item.type }} Preview</span>
          </VTooltip>
        </div>
        <div class="training-library-card__footer-right-side">
          <VTooltip v-if="item.type !== TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER" bottom>
            <template #activator="{ on }">
              <VIcon
                v-on="on"
                color="#2196f3"
                class="training-library-card__footer-btn"
                small
                @click="handleFastLaunchClick(item)"
                >mdi-send</VIcon
              >
            </template>
            <span>Send {{ item.type === 'SCORM' ? 'Training' : item.type }}</span>
          </VTooltip>
          <VTooltip v-else bottom>
            <template #activator="{ on }">
              <VIcon
                v-on="on"
                color="#2196f3"
                class="training-library-card__footer-btn"
                small
                @click="handleDownloadItem(item)"
                >mdi-download</VIcon
              >
            </template>
            <span>Download {{ item.type === 'SCORM' ? 'Training' : item.type }}</span>
          </VTooltip>
          <VMenu bottom offset-y min-width="240" max-width="240">
            <template #activator="{ on }">
              <VIcon v-on="on" color="#2196f3" class="training-library-card__footer-btn" small
                >mdi-dots-vertical</VIcon
              >
            </template>
            <VListItem
              v-for="actions in getActionsByType"
              :key="actions.text"
              class="training-library-filtering-options-parent-list-item"
              @click="handleListItemClick(actions.text, item)"
            >
              <VListItemTitle
                class="training-library-filtering-options-parent-list-item-title justify-start"
              >
                <VIcon>{{ actions.icon }}</VIcon>
                <span class="ml-3">{{ actions.text }}</span></VListItemTitle
              >
            </VListItem>
          </VMenu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrainingLibraryNewBadge from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryNewBadge.vue'
import TrainingLibraryFavoriteButton from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_PAYLOAD_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { mapActions, mapGetters } from 'vuex'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
let that = null
export default {
  name: 'TrainingLibraryCard',
  components: { TrainingLibraryFavoriteButton, TrainingLibraryNewBadge },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isRenderTitleTooltip: true,
      isRenderCreatedByTooltip: true,
      isRenderCategoryTooltip: true
    }
  },
  computed: {
    getActionsByType() {
      const actions = [
        {
          text: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          text: labels.Duplicate,
          icon: 'mdi-content-copy'
        },
        {
          text: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
      if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        actions.unshift({
          text: labels.DownloadInfographic,
          icon: 'mdi-download'
        })
      } else if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        actions.unshift({
          text: labels.DownloadPoster,
          icon: 'mdi-download'
        })
      }
      return actions
    },
    TRAINING_LIBRARY_PAYLOAD_TYPES() {
      return TRAINING_LIBRARY_PAYLOAD_TYPES
    },
    ...mapGetters({
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    }),
    getBgColor() {
      let bgColorClass = ''
      if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) bgColorClass = 'training'
      else if (
        this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.item.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        bgColorClass = 'learning-path'
      else if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) bgColorClass = 'poster'
      else if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        bgColorClass = 'infographic'
      else if (this.item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER)
        bgColorClass = 'screensaver'
      return `training-library-card__type--${bgColorClass}`
    }
  },
  mounted() {
    that = this
    window.addEventListener('resize', this.checkTooltipStasuses)
    this.$nextTick(() => this.checkTooltipStasuses())
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkTooltipStasuses)
  },
  methods: {
    ...mapActions({
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setScreenSaverPreviewDialog: 'trainingLibrary/setScreenSaverPreviewDialog',
      setTrainingSendModal: 'trainingLibrary/setTrainingSendModal',
      setLearningPathSendModal: 'trainingLibrary/setLearningPathSendModal',
      setPosterSendModal: 'trainingLibrary/setPosterSendModal',
      setInfographicSendModal: 'trainingLibrary/setInfographicSendModal',
      setNewTrainingModal: 'trainingLibrary/setNewTrainingModal',
      setNewLearningPathModal: 'trainingLibrary/setNewLearningPathModal',
      setNewPosterModal: 'trainingLibrary/setNewPosterModal',
      setNewInfographicModal: 'trainingLibrary/setNewInfographicModal',
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal',
      setDeleteDialog: 'trainingLibrary/setDeleteDialog'
    }),
    checkTooltipStasuses() {
      const { refBodyTitle, refBodyCreatedBy, refBodyCategory } = that.$refs
      this.isRenderTitleTooltip = refBodyTitle
        ? refBodyTitle.offsetWidth < refBodyTitle.scrollWidth
        : false
      this.isRenderCreatedByTooltip = refBodyCreatedBy
        ? refBodyCreatedBy.offsetWidth < refBodyCreatedBy.scrollWidth
        : false
      this.isRenderCategoryTooltip = refBodyCategory
        ? refBodyCategory.offsetWidth < refBodyCategory.scrollWidth
        : false
    },
    handleFavoriteRemove() {
      if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES)
        this.callForTrainingLibrary()
    },
    handlePreviewClick(row) {
      if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
        this.setTrainingPreviewDialog({
          status: true,
          selectedRow: row,
          showSendButton: true
        })
      } else if (
        row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        row.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        this.setLearningPathPreviewDialog({
          status: true,
          selectedRow: row,
          showSendButton: true
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setPosterPreviewDialog({
          status: true,
          selectedRow: row,
          type: 'poster',
          title: labels.PosterPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showPosterName: true,
          showFavoriteButton: true,
          showSendButton: true,
          icon: 'mdi-eye'
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setInfographicPreviewDialog({
          status: true,
          selectedRow: row,
          type: 'infographic',
          title: labels.InfographicPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showPosterName: true,
          showFavoriteButton: true,
          showSendButton: true,
          icon: 'mdi-eye'
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        this.setScreenSaverPreviewDialog({
          status: true,
          selectedRow: row,
          type: 'screensaver',
          title: labels.ScreensaverPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showSendButton: false,
          showScreensaverName: true,
          showFavoriteButton: true,
          icon: 'mdi-eye'
        })
      }
    },
    handleFastLaunchClick(row) {
      if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
        this.setTrainingSendModal({
          status: true,
          selectedRow: row
        })
      } else if (
        row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        row.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        this.setLearningPathSendModal({
          status: true,
          selectedRow: row
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setPosterSendModal({
          selectedRow: row,
          status: true
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setInfographicSendModal({
          status: true,
          selectedRow: row
        })
      } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        this.setScreenSaverPreviewDialog({
          status: true,
          selectedRow: row,
          type: 'screensaver',
          title: labels.ScreensaverPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showSendButton: true,
          showScreensaverName: true,
          showFavoriteButton: true,
          icon: 'mdi-eye'
        })
      }
    },
    handleDownloadItem(item) {
      if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setInfographicPreviewDialog({
          status: true,
          selectedRow: item,
          type: 'downloadInfographic',
          title: labels.DownloadInfographic,
          subtitle: '',
          showDetails: false,
          showTabs: false,
          showFavoriteButton: false,
          showSendButton: false,
          icon: 'mdi-download'
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setPosterPreviewDialog({
          status: true,
          selectedRow: item,
          type: 'downloadPoster',
          title: labels.DownloadPoster,
          subtitle: '',
          showDetails: false,
          showTabs: false,
          showSendButton: false,
          showPosterName: true,
          showFavoriteButton: false,
          icon: 'mdi-download'
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        this.setScreenSaverPreviewDialog({
          status: true,
          selectedRow: item,
          type: 'downloadScreensaver',
          title: labels.DownloadScreensaver,
          showSendButton: false,
          subtitle: '',
          showDetails: false,
          showTabs: false,
          showFavoriteButton: false,
          icon: 'mdi-download'
        })
      }
    },
    handleListItemClick(text, item) {
      if (text === labels.Edit) this.handleEditModalByType(text, item)
      else if (text === labels.Duplicate) this.handleDuplicateModal(item.trainingId)
      else if (text === labels.Delete) this.handleDeleteModalByType(text, item)
      else if (text === labels.DownloadInfographic) this.handleDownloadItem(item)
      else if (text === labels.DownloadPoster) this.handleDownloadItem(item)
      else if (text === labels.DownloadScreensaver) this.handleDownloadItem(item)
    },
    handleEditModalByType(text, item) {
      if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
        this.setNewTrainingModal({
          status: true,
          selectedRow: item,
          isEdit: true,
          isDuplicate: false
        })
      } else if (
        item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        item.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        this.setNewLearningPathModal({
          status: true,
          selectedRow: item,
          isEdit: true,
          isDuplicate: false
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setNewPosterModal({
          status: true,
          isEdit: true,
          selectedRow: item,
          isDuplicate: false
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setNewInfographicModal({
          status: true,
          isEdit: true,
          selectedRow: item,
          isDuplicate: false
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        this.setNewScreensaverModal({
          status: true,
          isEdit: true,
          selectedRow: item,
          isDuplicate: false
        })
      }
    },
    handleDuplicateModal(trainingId) {
      AwarenessEducatorService.duplicateTraining(trainingId).then(() => {
        this.callForTrainingLibrary()
      })
    },
    handleDeleteModalByType(text, item) {
      if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
        this.setDeleteDialog({
          status: true,
          title: 'Delete Training Material?',
          body: 'Are you sure you want to delete this training material?',
          selectedRow: item,
          type: 'training',
          apiFunc: AwarenessEducatorService.deleteTraining,
          onClose: (forceUpdate) => {
            if (forceUpdate) this.callForTrainingLibrary()
          }
        })
      } else if (
        item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        item.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        this.setDeleteDialog({
          status: true,
          title: 'Delete Learning Path Material?',
          body: 'Are you sure you want to delete this learning path material?',
          selectedRow: item,
          type: 'learning-path',
          apiFunc: AwarenessEducatorService.deleteTraining,
          onClose: (forceUpdate) => {
            if (forceUpdate) this.callForTrainingLibrary()
          }
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setDeleteDialog({
          status: true,
          title: 'Delete Poster Material?',
          body: 'Are you sure you want to delete this poster material? ',
          selectedRow: item,
          type: 'poster',
          apiFunc: AwarenessEducatorService.deleteTraining,
          onClose: (forceUpdate) => {
            if (forceUpdate) this.callForTrainingLibrary()
          }
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setDeleteDialog({
          status: true,
          title: 'Delete Infographic Material?',
          body: 'Are you sure you want to delete this infographic material?',
          selectedRow: item,
          type: 'infographic',
          apiFunc: AwarenessEducatorService.deleteTraining,
          onClose: (forceUpdate) => {
            if (forceUpdate) this.callForTrainingLibrary()
          }
        })
      } else if (item.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        this.setDeleteDialog({
          status: true,
          title: 'Delete Screensaver Material?',
          body: 'Are you sure you want to delete this screensaver material?',
          selectedRow: item,
          type: 'screensaver',
          apiFunc: AwarenessEducatorService.deleteTraining,
          onClose: (forceUpdate) => {
            if (forceUpdate) this.callForTrainingLibrary()
          }
        })
      }
    }
  }
}
</script>
