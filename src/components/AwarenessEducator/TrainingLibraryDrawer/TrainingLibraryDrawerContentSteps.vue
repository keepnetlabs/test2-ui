<template>
  <div class="training-library-drawer-content-steps">
    <div class="training-library-drawer-content-steps__header">
      <h3 class="training-library-drawer-content-steps__title">Learning Path Steps</h3>
      <span class="training-library-drawer-content-steps__total">Total: {{ totalSteps }} steps</span>
    </div>

    <div class="training-library-drawer-content-steps__list">
      <div
        v-for="(step, index) in displayedSteps"
        :key="index"
        class="training-library-drawer-content-steps__item"
      >
        <div class="training-library-drawer-content-steps__item-number">{{ index + 1 }}</div>
        <div class="training-library-drawer-content-steps__item-content">
          <h4 class="training-library-drawer-content-steps__item-title">{{ step.title }}</h4>
          <div class="training-library-drawer-content-steps__item-meta">
            <span>{{ step.type }}</span>
          </div>
        </div>
        <VIcon class="training-library-drawer-content-steps__item-icon" size="20">
          mdi-eye
        </VIcon>
      </div>
    </div>

    <div v-if="hasMoreSteps" class="training-library-drawer-content-steps__show-more">
      <VBtn text color="primary" small @click="toggleShowMore">
        <VIcon left size="16">mdi-chevron-{{ showAll ? 'up' : 'down' }}</VIcon>
        {{ showAll ? 'Show Less Steps' : 'Show More Steps' }}
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
    }
  }
}
</script>

<style lang="scss" scoped>
.training-library-drawer-content-steps {
  margin-top: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #212121;
    margin: 0;
  }

  &__total {
    font-size: 14px;
    color: #757575;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
      background: #eeeeee;
    }
  }

  &__item-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #ffffff;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    color: #212121;
    flex-shrink: 0;
  }

  &__item-content {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    font-size: 14px;
    font-weight: 500;
    color: #212121;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #757575;

    span {
      line-height: 1;
    }
  }

  &__item-icon {
    color: #757575;
    flex-shrink: 0;
  }

  &__show-more {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
