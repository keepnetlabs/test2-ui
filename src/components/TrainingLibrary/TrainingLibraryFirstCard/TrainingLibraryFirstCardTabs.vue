<template>
  <div>
    <ElTabs
      :value="selectedTrainingContent"
      class="campaign-manager-last-step__phishing-scenario-tab training-library-first-card-tabs mb-6"
      @tab-click="setSelectedTrainingContent"
    >
      <ElTabPane
        v-for="(template, index) in trainingTabContents"
        :key="index"
        :name="template.name"
        :label="template.name"
      >
        <template #label>
          <div style="display: flex;">
            <span class="training-library-tab-label">
              {{ template.name }} ({{ template.number }})
            </span>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>
    <ElTabs
      :value="selectedSubTrainingContent"
      class="k-sub-tab"
      @tab-click="setSubSelectedTrainingContent"
    >
      <ElTabPane
        v-for="(template, index) in trainingSubTabs"
        :key="index"
        :name="template.name"
        :label="template.name"
      >
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  trainingTabContents,
  trainingSubTabs
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryFirstCardTabs',
  computed: {
    ...mapGetters({
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent',
      selectedSubTrainingContent: 'trainingLibrary/getSelectedSubTrainingContent'
    })
  },
  data() {
    return {
      trainingTabContents,
      trainingSubTabs
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
