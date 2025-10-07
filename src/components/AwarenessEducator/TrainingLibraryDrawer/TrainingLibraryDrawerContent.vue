<template>
  <div class="training-library-drawer-content">
    <TrainingLibraryDrawerContentSummary
      :training-data="trainingData"
      :type="type"
      @delete-success="$emit('delete-success')"
      @duplicate-success="$emit('duplicate-success')"
      @send-clicked="$emit('send-clicked')"
      @edit-clicked="$emit('edit-clicked')"
      @category-ready="handleCategoryReady"
    />
    <TrainingLibraryDrawerContentRelated
      v-if="!isNested"
      :training-data="trainingData"
      :type="type"
      :category="category"
    />
  </div>
</template>

<script>
import TrainingLibraryDrawerContentSummary from './TrainingLibraryDrawerContentSummary.vue'
import TrainingLibraryDrawerContentRelated from './TrainingLibraryDrawerContentRelated.vue'

export default {
  name: 'TrainingLibraryDrawerContent',
  components: {
    TrainingLibraryDrawerContentSummary,
    TrainingLibraryDrawerContentRelated
  },
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'Training'
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      category: ''
    }
  },
  methods: {
    handleCategoryReady(category) {
      this.category = category
    }
  }
}
</script>
