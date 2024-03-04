<template>
  <KContainer tabless id="training-library">
    <TrainingLibraryFirstCard />
    <TrainingLibraryListViewCard />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import TrainingLibraryFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'
import { mapActions } from 'vuex'
import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
export default {
  name: 'TrainingLibrary',
  components: { TrainingLibraryListViewCard, TrainingLibraryFirstCard, KContainer },
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
