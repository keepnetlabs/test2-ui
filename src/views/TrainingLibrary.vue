<template>
  <KContainer tabless id="training-library">
    <TrainingLibraryListViewFirstCard />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import TrainingLibraryListViewFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'
import { mapActions } from 'vuex'
export default {
  name: 'TrainingLibrary',
  components: { TrainingLibraryListViewFirstCard, KContainer },
  provide() {
    return {
      handleRefresh: this.handleRefresh
    }
  },
  data() {
    return {}
  },
  created() {
    this.initDefaultTableSettings()
  },
  methods: {
    ...mapActions({
      initDefaultTableSettings: 'trainingLibrary/initDefaultTableSettings'
    }),
    callForData() {},
    handleRefresh() {}
  }
}
</script>
