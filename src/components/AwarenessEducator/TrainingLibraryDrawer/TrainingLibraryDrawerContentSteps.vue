<template>
  <div class="training-library-drawer-content-steps">
    <div class="training-library-drawer-content-steps__header">
      <h3 class="training-library-drawer-content-steps__title">
        Learning Path Steps
      </h3>
      <span class="training-library-drawer-content-steps__total"
        >Total: {{ totalSteps }} {{ totalSteps === 1 ? 'step' : 'steps' }}</span
      >
    </div>

    <div class="training-library-drawer-content-steps__list">
      <div
        v-for="(step, index) in displayedSteps"
        :key="index"
        class="training-library-drawer-content-steps__item"
      >
        <div class="training-library-drawer-content-steps__item-number">
          {{ index + 1 }}
        </div>
        <div class="training-library-drawer-content-steps__item-content">
          <h4 class="training-library-drawer-content-steps__item-title">
            {{ step.title }}
          </h4>
          <div class="training-library-drawer-content-steps__item-meta">
            <span>{{ step.type }}</span>
          </div>
        </div>
        <VBtn icon small @click="handlePreviewStep(step)">
          <VIcon class="training-library-drawer-content-steps__item-icon" size="20">
            mdi-eye
          </VIcon>
        </VBtn>
      </div>
    </div>

    <div v-if="hasMoreSteps" class="training-library-drawer-content-steps__show-more">
      <VBtn class="fw-600" text color="#2196F3" small @click="toggleShowMore">
        <VIcon left size="16" class="mr-1">mdi-menu-{{ showAll ? 'up' : 'down' }}</VIcon>
        <span class="text-capitalize">{{ showAll ? 'Show Less Steps' : 'Show More Steps' }}</span>
      </VBtn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryDrawerContentSteps',
  props: {
    steps: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAll: false,
      initialDisplayCount: 5
    }
  },
  computed: {
    totalSteps() {
      return this.steps.length
    },
    hasMoreSteps() {
      return this.totalSteps > this.initialDisplayCount
    },
    displayedSteps() {
      if (this.showAll) {
        return this.steps
      }
      return this.steps.slice(0, this.initialDisplayCount)
    }
  },
  methods: {
    toggleShowMore() {
      this.showAll = !this.showAll
    },
    handlePreviewStep(step) {
      this.$emit('preview-step', step)
    }
  }
}
</script>
