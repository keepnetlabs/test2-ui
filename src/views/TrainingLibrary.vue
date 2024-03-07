<template>
  <KContainer tabless id="training-library">
    <TrainingLibraryCommonComponents />
    <TrainingLibraryFirstCard />
    <TrainingLibraryListViewCard />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import TrainingLibraryFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'
import { mapActions } from 'vuex'
import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
export default {
  name: 'TrainingLibrary',
  components: {
    TrainingLibraryCommonComponents,
    TrainingLibraryListViewCard,
    TrainingLibraryFirstCard,
    KContainer
  },
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
    this.callForLanguages()
  },
  methods: {
    ...mapActions({
      initDefaultTableSettings: 'trainingLibrary/initDefaultTableSettings',
      callForLanguages: 'trainingLibrary/callForLanguages'
    }),
    callForData() {},
    handleRefresh() {}
  }
}
</script>
