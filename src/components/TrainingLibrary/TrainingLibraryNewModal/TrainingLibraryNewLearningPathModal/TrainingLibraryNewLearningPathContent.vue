<template>
  <div class="learning-path-content__container">
    <div class="learning-path-content__training-contents-container">
      <ConfigureCompanyStepHeader
        :title="labels.LearningPathContentTrainingContentsTitle"
        :subtitle="labels.LearningPathContentTrainingContentsSub"
      />
      <TrainingLibraryNewLearningPathFilters />
      <TrainingLibraryNewLearningPathFilterBadges />
      <Draggable
        v-bind="dragOptions"
        class="learning-path-content__training-contents"
        group="a"
        :list="getTrainings"
        handle=".learning-path-content__training--handle"
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
              training.trainingName
            }}</span>
            <span class="learning-path-content__training--info-created-by"
              >{{ training.createdBy }}
              <v-icon center size="8" color="#E0E0E0">mdi-circle</v-icon>
              {{ training.category }}</span
            >
          </div>
          <div class="learning-path-content__training--buttons">
            <v-btn icon color="#757575" @click="onTogglePreview(training)">
              <v-icon center>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon color="#757575" @click="onSelectTraining(training, trainingIndex)">
              <v-icon center>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
        </div>
      </Draggable>
    </div>
    <div class="learning-path-content__learning-path-container">
      <ConfigureCompanyStepHeader
        :title="labels.LearningPathContentLearningPathTitle"
        :subtitle="labels.LearningPathContentLearningPathSub"
      />
      <Draggable
        v-bind="dragOptions"
        class="learning-path-content__learning-path"
        group="a"
        :list="getSelectedTrainings"
        handle=".learning-path-content__training--handle"
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
              training.trainingName
            }}</span>
            <span class="learning-path-content__training--info-created-by"
              >{{ training.createdBy }}
              <v-icon center size="8" color="#E0E0E0">mdi-circle</v-icon>
              {{ training.category }}</span
            >
          </div>
          <div class="learning-path-content__training--buttons">
            <v-btn icon color="#757575" @click="onTogglePreview(training)">
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
</template>

<script>
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import TrainingLibraryNewLearningPathFilters from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilters'
import TrainingLibraryNewLearningPathFilterBadges from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilterBadges'
import { mapActions, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  name: 'TrainingLibraryNewLearningPathContent',
  components: {
    ConfigureCompanyStepHeader,
    TrainingLibraryNewLearningPathFilterBadges,
    TrainingLibraryNewLearningPathFilters,
    Draggable
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
      getTrainings: 'trainingLibrary/getLearningPathTrainings',
      getSelectedTrainings: 'trainingLibrary/getSelectedLearningPathTrainings'
    })
  },
  watch: {
    getSelectedTrainings: {
      deep: true,
      handler(val) {
        console.log('getSelectedTrainings', val)
      }
    }
  },
  methods: {
    ...mapActions({
      clearAllFilters: 'trainingLibrary/learningPathClearAllFilters',
      selectLearningPathTraining: 'trainingLibrary/selectLearningPathTraining',
      removeTrainingFromLearningPath: 'trainingLibrary/removeTrainingFromLearningPath'
    }),
    getCoverImage(training) {
      return (
        training?.coverImage?.imageUrl ||
        require('../../../../assets/img/learning-path-cover-image-placeholder.svg')
      )
    },
    onSelectTraining(training, index) {
      this.selectLearningPathTraining({ training, index })
    },
    onRemoveTraining(training, index) {
      this.removeTrainingFromLearningPath({ training, index })
    }
  },
  beforeDestroy() {
    this.clearAllFilters()
  }
}
</script>
