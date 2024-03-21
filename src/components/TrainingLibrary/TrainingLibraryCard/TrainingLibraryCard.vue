<template>
  <div class="training-library-card">
    <div :class="['training-library-card__type', getBgColor]">
      {{ item.type }}
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
      <div class="training-library-card__body-title">{{ item.trainingName }}</div>
      <div class="training-library-card__body-sub">
        <div>{{ item.createdBy }}</div>
        <div class="training-library-card__body-sub-bull"></div>
        <div class="training-library-card__body-sub-category">{{ item.category }}</div>
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
            }}<span v-if="item.languages.slice(0, 2).length - 1 > languageIndex">|</span>
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
          <VBtn
            class="w-100 training-library-card__footer-btn"
            color="#fff"
            rounded
            :ripple="false"
            @click="handlePreviewClick(item)"
          >
            <VIcon class="mr-1" left>mdi-eye</VIcon>
            Preview
          </VBtn>
        </div>
        <div class="training-library-card__footer-right-side">
          <VIcon
            color="#2196f3"
            class="training-library-card__footer-btn"
            small
            @click="handleFastLaunchClick(item)"
            >mdi-send</VIcon
          >
          <VMenu bottom offset-y>
            <template #activator="{ on }">
              <VIcon v-on="on" color="#2196f3" class="training-library-card__footer-btn" small
                >mdi-dots-vertical</VIcon
              >
            </template>
            <VListItem
              class="training-library-filtering-options-parent-list-item"
              @click="handleListItemClick(item.text)"
            >
              <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
                >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
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

export default {
  name: 'TrainingLibraryCard',
  components: { TrainingLibraryFavoriteButton, TrainingLibraryNewBadge },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
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
  methods: {
    ...mapActions({
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setScreensaverPreviewDialog: 'trainingLibrary/setScreenSaverPreviewDialog',
      setTrainingSendModal: 'trainingLibrary/setTrainingSendModal',
      setLearningPathSendModal: 'trainingLibrary/setLearningPathSendModal',
      setPosterSendModal: 'trainingLibrary/setPosterSendModal',
      setInfographicSendModal: 'trainingLibrary/setInfographicSendModal'
    }),
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
          showSendButton: true,
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
    handleListItemClick() {}
  }
}
</script>
