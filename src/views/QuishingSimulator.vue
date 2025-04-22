<template>
  <KContainer id="phishing-simulator">
    <ElTabs v-model="tab">
      <ElTabPane
        v-if="getPhishingScenariosSearchPermissions"
        label="Scenarios"
        name="scenarios"
        id="quishing-simulator-scenarios"
      >
        <QuishingScenarios v-if="tab === 'scenarios'" ref="refScenarios" />
      </ElTabPane>
      <ElTabPane
        v-if="getEmailTemplatesSearchPermissions"
        label="Quishing Templates"
        name="email-templates"
        id="email-templates-content"
      >
        <QuishingEmailTemplates v-if="tab === 'email-templates'" ref="refEmailTemplates" />
      </ElTabPane>
      <ElTabPane
        v-if="getLandingPageTemplatesSearchPermissions"
        label="Landing Page Templates"
        name="landing-page"
        id="landing-page-content"
      >
        <QuishingLandingPageTemplates v-if="tab === 'landing-page'" ref="refLandingPageList" />
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer'
import QuishingScenarios from '@/components/QuishingScenarios/QuishingScenarios'
import QuishingEmailTemplates from '@/components/QuishingEmailTemplates/QuishingEmailTemplates'
import QuishingLandingPageTemplates from '@/components/QuishingLandingPageTemplates/QuishingLandingPageTemplates.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'QuishingSimulator',
  components: {
    QuishingLandingPageTemplates,
    QuishingEmailTemplates,
    QuishingScenarios,
    KContainer
  },
  data() {
    return {
      tab: 'scenarios'
    }
  },
  computed: {
    ...mapGetters({
      getPhishingScenariosSearchPermissions: 'permissions/getQuishingScenariosSearchPermissions',
      getEmailTemplatesSearchPermissions: 'permissions/getQuishingEmailTemplatesSearchPermissions',
      getLandingPageTemplatesSearchPermissions:
        'permissions/getQuishingLandingPageTemplatesSearchPermissions'
    })
  },
  created() {
    if (!this.getPhishingScenariosSearchPermissions && this.getEmailTemplatesSearchPermissions) {
      this.tab = 'emailTemplates'
    } else if (
      !this.getPhishingScenariosSearchPermissions &&
      !this.getEmailTemplatesSearchPermissions &&
      this.getLandingPageTemplatesSearchPermissions
    ) {
      this.tab = 'landingPage'
    }
  },
  beforeRouteLeave(_, _2, next) {
    const { refScenarios, refEmailTemplates, refLandingPageList } = this.$refs
    if (refScenarios?.isShowNewScenarioModal) {
      refScenarios.checkIfCanCLoseNewScenarioModal()
      next(false)
    } else if (refScenarios?.isShowFastLaunchDialog) {
      if (refScenarios?.$refs?.fastLaunch?.isSubmitted) return next()
      refScenarios.checkIfCanCloseFastLaunchModal()
      next(false)
    } else if (
      refEmailTemplates?.$refs?.newEmailTemplate?.$refs?.refEmailTemplate?.showGrapesModal
    ) {
      refEmailTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refEmailTemplates?.isShowNewEmailTemplateModal) {
      if (typeof refEmailTemplates.checkIfCanCloseNewEmailTemplate === 'function')
        refEmailTemplates.checkIfCanCloseNewEmailTemplate()
      next(false)
    } else if (
      refLandingPageList?.$refs?.newLandingPage?.$refs?.refEmailTemplate?.showGrapesModal
    ) {
      refLandingPageList.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refLandingPageList?.isShowNewLandingPageTemplateModal) {
      refLandingPageList.checkIfCanCloseNewLandingPage()
      next(false)
    } else {
      next()
    }
  }
}
</script>
