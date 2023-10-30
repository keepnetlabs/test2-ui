<template>
  <KContainer id="phishing-simulator">
    <ElTabs v-model="tab">
      <ElTabPane v-if="true" label="Scenarios" name="scenarios" id="quishing-simulator-scenarios">
        <QuishingScenarios v-if="tab === 'scenarios'" ref="refScenarios" />
      </ElTabPane>
      <ElTabPane
        v-if="true"
        label="Email Templates"
        name="email-templates"
        id="email-templates-content"
      >
      </ElTabPane>
      <ElTabPane
        v-if="true"
        label="Landing Page Templates"
        name="landing-page"
        id="landing-page-content"
      >
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer'
import QuishingScenarios from '@/components/QuishingScenarios/QuishingScenarios'

export default {
  name: 'QuishingSimulator',
  components: { QuishingScenarios, KContainer },
  data() {
    return {
      tab: 'scenarios'
    }
  }
}
</script>
