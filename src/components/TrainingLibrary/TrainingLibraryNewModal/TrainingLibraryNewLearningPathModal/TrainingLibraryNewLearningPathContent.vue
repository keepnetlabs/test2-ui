<template>
  <Fragment>
    <TrainingLibraryTrainingPreviewDialog
      v-if="
        getLearningPathModalTrainingPreviewDialog.status &&
        (getLearningPathModalTrainingPreviewDialog.type === 'SCORM' ||
          getLearningPathModalTrainingPreviewDialog.type === 'SCORM12')
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
            <TrainingLibraryNewLearningPathTraining
              v-for="(training, trainingIndex) in getTrainings"
              :key="trainingIndex"
              :class="[
                isInavailable(training) ? 'learning-path-content__training--inavailable' : ''
              ]"
              :training="training"
              :isInavailable="isInavailable(training)"
              @preview="onClickPreview(training)"
              @select="onSelectTraining(training, trainingIndex)"
            />
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
          <TrainingLibraryNewLearningPathTraining
            v-for="(training, trainingIndex) in getSelectedTrainings"
            :key="trainingIndex"
            :class="[isDisabled(training) ? 'learning-path-content__training--disabled' : '']"
            :training="training"
            :isDisabled="isDisabled(training)"
            isSelected
            @preview="onClickPreview(training)"
            @remove="onRemoveTraining(training, trainingIndex)"
          />
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
import TrainingLibraryNewLearningPathTraining from './TrainingLibraryNewLearningPathTraining'
import { isInavailable } from '../../utils'

export default {
  name: 'TrainingLibraryNewLearningPathContent',
  components: {
    ConfigureCompanyStepHeader,
    TrainingLibraryNewLearningPathFilterBadges,
    TrainingLibraryNewLearningPathFilters,
    TrainingLibraryInfographicPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    TrainingLibraryTrainingPreviewDialog,
    TrainingLibraryNewLearningPathTraining,
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
    },
    availableForRequests: {
      type: Array,
      default: () => []
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
    }),
    getCompanyResourceId() {
      return localStorage.getItem('companyRequestId') || ''
    },
    getCompanyName() {
      return (
        localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName') || ''
      )
    }
  },
  watch: {
    availableForRequests: {
      deep: true,
      handler(val) {
        if (val.length) {
          this.orderLearningPathData(val)
        }
      }
    }
  },
  methods: {
    ...mapActions({
      clearAllFilters: 'learningPath/learningPathClearAllFilters',
      selectLearningPathTraining: 'learningPath/selectLearningPathTraining',
      removeTrainingFromLearningPath: 'learningPath/removeTrainingFromLearningPath',
      setLearningPathModalTrainingPreviewDialog:
        'learningPath/setLearningPathModalTrainingPreviewDialog',
      setSelectedTrainings: 'learningPath/setSelectedLearningPathTrainings',
      getDataAfterValidScroll: 'learningPath/getDataAfterValidScroll',
      orderLearningPathData: 'learningPath/orderLearningPathData'
    }),
    isInavailable(training) {
      return isInavailable(
        this.availableForRequests,
        training,
        this.getCompanyResourceId,
        this.getCompanyName
      )
    },
    isDisabled(training) {
      if (this.getCompanyName === 'System') {
        return false
      }
      const isMyCompanyOnly =
        this.availableForRequests?.includes('MyCompanyOnly') &&
        (training?.availableFor?.includes('MyCompanyOnly') ||
          training?.availableFor?.includes(this.getCompanyResourceId))

      const isAllCompanies = training?.availableFor?.includes('AllCompanies')

      const isEveryItemIncluded = this.availableForRequests.every((item) =>
        training?.availableFor?.includes(item)
      )
      if (isMyCompanyOnly || isAllCompanies || isEveryItemIncluded) {
        return false
      }
      return true
    },
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
