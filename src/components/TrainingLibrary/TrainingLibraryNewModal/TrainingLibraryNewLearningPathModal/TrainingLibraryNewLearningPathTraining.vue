<template>
  <div class="learning-path-content__training">
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
      alt="Learning path cover"
    />
    <div class="learning-path-content__training--info">
      <div ref="refTitle">
        <VTooltip :disabled="!isRenderTitleTooltip" right :max-width="300">
          <template #activator="{ on }">
            <div class="learning-path-content__training--info-name" v-on="on">
              {{ truncatedTrainingName || getTrainingName }}
            </div>
          </template>
          <span>{{ getTrainingName }}</span>
        </VTooltip>
      </div>
      <div class="learning-path-content__training--info-created-by--container">
        <div class="learning-path-content__training--info-type">
          {{ training.hasQuiz ? 'Survey' : training.type }}
        </div>
        <v-icon center size="8" color="#E0E0E0">mdi-circle</v-icon>
        <VTooltip :disabled="!isRenderCategoryTooltip" right :max-width="300">
          <template #activator="{ on }">
            <div v-on="on" class="learning-path-content__training--info-created-by">
              {{ truncatedCategory || training.categoryName }}
            </div>
          </template>
          <span>{{ getCategoryName }}</span>
        </VTooltip>
      </div>
    </div>
    <div class="learning-path-content__training--buttons">
      <v-btn icon color="#757575" @click="onClickPreview()">
        <v-icon center>mdi-eye</v-icon>
      </v-btn>
      <template v-if="!isSelected">
        <v-btn v-if="!isInavailable" icon color="#757575" @click="onSelectTraining">
          <v-icon center>mdi-plus-circle</v-icon>
        </v-btn>
        <VTooltip v-else right :max-width="300">
          <template #activator="{ on }">
            <v-icon v-on="on" center color="#E6A23C" style="width: 36px; height: 36px;">
              mdi-alert
            </v-icon>
          </template>
          <span
            >“Make available for” setting of the learning path doesn’t match with the setting of
            this material.</span
          >
        </VTooltip>
      </template>
      <template v-else>
        <v-btn icon color="#757575" @click="onRemoveTraining">
          <v-icon center>mdi-minus-circle</v-icon>
        </v-btn>
        <VTooltip v-if="isDisabled" right :max-width="300">
          <template #activator="{ on }">
            <v-icon v-on="on" center color="#F56C6C" style="width: 36px; height: 36px;">
              mdi-alert
            </v-icon>
          </template>
          <span
            >“Make available for” setting of the learning path doesn’t match with the setting of
            this material.</span
          >
        </VTooltip>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryNewLearningPathTraining',
  props: {
    training: {
      type: Object
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isInavailable: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isRenderTitleTooltip: false,
      isRenderCategoryTooltip: false,
      truncatedTrainingName: '',
      truncatedCategory: ''
    }
  },
  computed: {
    getTrainingName() {
      return this.training?.trainingName || this.training?.name || ''
    },
    getCategoryName() {
      return this.training?.categoryName || this.training?.category || ''
    }
  },
  watch: {
    training: {
      deep: true,
      handler() {
        this.checkTrainingInfoTooltips()
      }
    }
  },
  methods: {
    getCoverImage(training) {
      return (
        training?.coverImage?.imageUrl ||
        require('../../../../assets/img/learning-path-cover-image-placeholder.svg')
      )
    },
    onClickPreview() {
      this.$emit('preview')
    },
    onSelectTraining() {
      this.$emit('select')
    },
    onRemoveTraining() {
      this.$emit('remove')
    },
    checkTrainingInfoTooltips() {
      if (this.getTrainingName?.length > 20) {
        this.truncatedTrainingName = this.getTrainingName.substring(0, 20) + '...'
        this.isRenderTitleTooltip = true
      } else {
        this.truncatedTrainingName = ''
        this.isRenderTitleTooltip = false
      }
      if (this.getCategoryName?.length > 14) {
        this.truncatedCategory = this.getCategoryName.substring(0, 14) + '...'
        this.isRenderCategoryTooltip = true
      } else {
        this.truncatedCategory = ''
        this.isRenderCategoryTooltip = false
      }
    }
  },
  mounted() {
    this.checkTrainingInfoTooltips()
  }
}
</script>
