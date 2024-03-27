<template>
  <Fragment>
    <TrainingLibraryTrainingPreviewDialog
      v-if="
        getLearningPathModalTrainingPreviewDialog.status &&
        getLearningPathModalTrainingPreviewDialog.type === 'SCORM'
      "
      v-bind="getLearningPathModalTrainingPreviewDialog"
      @close="onClosePreviewModal"
    />
    <TrainingLibraryPosterPreviewDialog
      v-if="
        getLearningPathModalTrainingPreviewDialog.status &&
        getLearningPathModalTrainingPreviewDialog.type === 'Poster'
      "
      v-bind="getLearningPathModalTrainingPreviewDialog"
      @close="onClosePreviewModal"
    />
    <TrainingLibraryInfographicPreviewDialog
      v-if="
        getLearningPathModalTrainingPreviewDialog.status &&
        getLearningPathModalTrainingPreviewDialog.type === 'Infographic'
      "
      v-bind="getLearningPathModalTrainingPreviewDialog"
      @close="onClosePreviewModal"
    />
    <div class="learning-path-content__container">
      <div class="learning-path-content__training-contents-container">
        <ConfigureCompanyStepHeader
          :title="labels.LearningPathContentTrainingContentsTitle"
          :subtitle="labels.LearningPathContentTrainingContentsSub"
        />
        <TrainingLibraryNewLearningPathFilters />
        <TrainingLibraryNewLearningPathFilterBadges />
        <div class="learning-path-content__training-contents" @scroll="handleScroll">
          <Draggable
            v-bind="dragOptions"
            group="a"
            handle=".learning-path-content__training--handle"
            :list="getTrainings"
          >
            <div
              v-for="(training, trainingIndex) in getTrainings"
              :key="training.trainingId"
              class="learning-path-content__training"
            >
              <v-icon
                center
                medium
                size="32"
                color="#757575"
                class="learning-path-content__training--handle"
                style="cursor: move;"
                >mdi-drag-vertical</v-icon
              >
              <img
                class="learning-path-content__training--cover-image"
                :src="getCoverImage(training)"
              />
              <div class="learning-path-content__training--info">
                <span class="learning-path-content__training--info-name">{{
                  training.trainingName || training.name
                }}</span>
                <span class="learning-path-content__training--info-created-by"
                  >{{ training.type }}
                  <v-icon center size="8" color="#E0E0E0">mdi-circle</v-icon>
                  {{ training.category }}</span
                >
              </div>
              <div class="learning-path-content__training--buttons">
                <v-btn icon color="#757575" @click="onClickPreview(training)">
                  <v-icon center>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon color="#757575" @click="onSelectTraining(training, trainingIndex)">
                  <v-icon center>mdi-plus-circle</v-icon>
                </v-btn>
              </div>
            </div>
          </Draggable>
        </div>
      </div>
      <div class="learning-path-content__learning-path-container">
        <ConfigureCompanyStepHeader
          :title="labels.LearningPathContentLearningPathTitle"
          :subtitle="labels.LearningPathContentLearningPathSub"
        />
        <Draggable
          v-if="!getSelectedTrainings.length"
          v-bind="dragOptions"
          class="learning-path-content__learning-path"
          group="a"
          handle=".learning-path-content__training--handle"
          :list="getSelectedTrainings"
        >
          <div
            v-if="!getSelectedTrainings.length"
            class="learning-path-content__learning-path--empty"
          >
            <span class="learning-path-content__learning-path--empty-text">
              Drag and drop training from left side or add using the add button
            </span>
          </div>
        </Draggable>
        <Draggable
          v-if="getSelectedTrainings.length"
          v-bind="dragOptions"
          class="learning-path-content__learning-path"
          group="a"
          handle=".learning-path-content__training--handle"
          :list="getSelectedTrainings"
        >
          <div
            v-for="(training, trainingIndex) in getSelectedTrainings"
            :key="training.trainingId"
            class="learning-path-content__training"
          >
            <v-icon
              center
              medium
              size="32"
              color="#757575"
              class="learning-path-content__training--handle"
              style="cursor: move;"
              >mdi-drag-vertical</v-icon
            >
            <div class="learning-path-content__training--order">
              {{ trainingIndex + 1 }}
            </div>
            <img
              class="learning-path-content__training--cover-image"
              :src="getCoverImage(training)"
            />
            <div class="learning-path-content__training--info">
              <span class="learning-path-content__training--info-name">{{
                training.trainingName || training.name
              }}</span>
              <span class="learning-path-content__training--info-created-by"
                >{{ training.type }}
                <v-icon center size="8" color="#E0E0E0">mdi-circle</v-icon>
                {{ training.categoryName || training.category }}</span
              >
            </div>
            <div class="learning-path-content__training--buttons">
              <v-btn icon color="#757575" @click="onClickPreview(training)">
                <v-icon center>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon color="#757575" @click="onRemoveTraining(training, trainingIndex)">
                <v-icon center>mdi-minus-circle</v-icon>
              </v-btn>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  </Fragment>
</template>

<script>
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import TrainingLibraryNewLearningPathFilters from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilters'
import TrainingLibraryNewLearningPathFilterBadges from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilterBadges'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryInfographicPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'
import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'
import Draggable from 'vuedraggable'
import { Fragment } from 'vue-frag'
import useDebounce from '@/hooks/useDebounce'

export default {
  name: 'TrainingLibraryNewLearningPathContent',
  components: {
    ConfigureCompanyStepHeader,
    TrainingLibraryNewLearningPathFilterBadges,
    TrainingLibraryNewLearningPathFilters,
    TrainingLibraryInfographicPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    TrainingLibraryTrainingPreviewDialog,
    Draggable,
    Fragment
  },
  props: {
    isActionButtonDisabled: {
      type: Boolean
    },
    resourceId: {
      type: String
    },
    step: {
      type: Number
    },
    isEdit: {
      type: Boolean
    }
  },
  mixins: [useDebounce],
  data() {
    return {
      labels,
      Validations,
      formData: {},
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost'
      }
    }
  },
  computed: {
    ...mapGetters({
      getLearningPathModalTrainingPreviewDialog:
        'learningPath/getLearningPathModalTrainingPreviewDialog',
      getTrainings: 'learningPath/getLearningPathTrainings',
      getSelectedTrainings: 'learningPath/getSelectedLearningPathTrainings'
    })
  },
  methods: {
    ...mapActions({
      clearAllFilters: 'learningPath/learningPathClearAllFilters',
      selectLearningPathTraining: 'learningPath/selectLearningPathTraining',
      removeTrainingFromLearningPath: 'learningPath/removeTrainingFromLearningPath',
      setLearningPathModalTrainingPreviewDialog:
        'learningPath/setLearningPathModalTrainingPreviewDialog',
      setSelectedTrainings: 'learningPath/setSelectedLearningPathTrainings',
      getDataAfterValidScroll: 'learningPath/getDataAfterValidScroll'
    }),
    handleScroll(e) {
      const scrollPosition = e.target.scrollTop + e.target.offsetHeight
      const scrollHeight = e.target.scrollHeight - 30
      if (scrollPosition > scrollHeight) {
        this.debounce(() => {
          this.getDataAfterValidScroll()
        }, 250)
      }
    },
    getCoverImage(training) {
      return (
        training?.coverImage?.imageUrl ||
        require('../../../../assets/img/learning-path-cover-image-placeholder.svg')
      )
    },
    onClickPreview(training) {
      this.setLearningPathModalTrainingPreviewDialog({
        status: true,
        selectedRow: training,
        type: training.type,
        showSendButton: false
      })
    },
    onClosePreviewModal() {
      this.setLearningPathModalTrainingPreviewDialog({
        status: false,
        selectedRow: null,
        type: 'Training',
        showSendButton: false
      })
    },
    onSelectTraining(training, index) {
      this.selectLearningPathTraining({ training, index })
    },
    onRemoveTraining(training, index) {
      this.removeTrainingFromLearningPath({ training, index })
    }
  },
  beforeDestroy() {
    this.clearAllFilters({ isFetch: false })
  }
}
</script>
