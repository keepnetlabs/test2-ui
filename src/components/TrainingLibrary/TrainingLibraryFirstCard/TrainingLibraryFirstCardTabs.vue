<template>
  <div>
    <ElTabs
      :value="selectedTrainingContent"
      :class="[
        'campaign-manager-last-step__phishing-scenario-tab training-library-first-card-tabs mb-6'
      ]"
      @tab-click="setSelectedTrainingContent"
    >
      <ElTabPane
        v-for="(template, index) in trainingTabContents"
        :key="index"
        :name="template.name"
        :label="template.name"
      />
    </ElTabs>
    <ElTabs
      :value="selectedSubTrainingContent"
      class="k-sub-tab"
      :class="[
        'k-sub-tab training-library-first-card-sub-tabs',
        isTabsLoading ? 'training-library-first-card-sub-tabs--loading' : ''
      ]"
      @tab-click="setSubSelectedTrainingContent"
    >
      <ElTabPane
        v-for="(template, index) in getTrainingSubtabs"
        :key="index"
        :name="template.name"
        :label="template.name"
      >
        <template #label>
          <div style="display: flex;">
            <v-skeleton-loader v-if="isTabsLoading" :loading="isTabsLoading" type="chip" />
            <span v-else> {{ template.name }} ({{ template.totalCount }}) </span>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { trainingTabContents } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryFirstCardTabs',
  computed: {
    ...mapGetters({
      isTabsLoading: 'trainingLibrary/getTabsLoading',
      getTrainingSubtabs: 'trainingLibrary/getTrainingSubTabs',
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent',
      selectedSubTrainingContent: 'trainingLibrary/getSelectedSubTrainingContent'
    })
  },
  data() {
    return {
      trainingTabContents
    }
  },
  methods: {
    ...mapActions({
      setSelectedTrainingContent: 'trainingLibrary/setSelectedTrainingContent',
      setSubSelectedTrainingContent: 'trainingLibrary/setSubSelectedTrainingContent'
    })
  }
}
</script>
