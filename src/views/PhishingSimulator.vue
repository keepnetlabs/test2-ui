<template>
  <KContainer id="phishing-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getPhishingScenariosSearchPermissions"
        label="Scenarios"
        name="scenarios"
        id="emailTemplates-scenarios"
      >
        <Scenarios v-if="tab === 'scenarios'" ref="refScenarios" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getEmailTemplatesSearchPermissions"
        label="Email Templates"
        name="emailTemplates"
        id="emailTemplates-content"
      >
        <EmailTemplates
          v-if="tab === 'emailTemplates'"
          ref="refEmailTemplates"
          :isAIAllyEnabled="aiAllySettings.psEmailTemplateGenerationAssistant"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="getLandingPageTemplatesSearchPermissions"
        label="Landing Page Templates"
        name="landingPage"
        id="landing-page-content"
      >
        <LandingPageList
          v-if="tab === 'landingPage'"
          ref="refLandingPageList"
          :isAIAllyEnabled="aiAllySettings.landingPageTemplateGenerationAssistant"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import EmailTemplates from '@/components/PhishingScenarios/EmailTemplates'
import LandingPageList from '@/components/LandingPage/LandingPageList'
import Scenarios from '@/components/PhishingScenarios/Scenarios'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import { getAIAllySettings } from '@/api/company'

export default {
  name: 'PhishingSimulator',
  components: {
    KContainer,
    EmailTemplates,
    LandingPageList,
    Scenarios
  },
  data() {
    return {
      tab: 'scenarios',
      aiAllySettings: {
        psEmailTemplateGenerationAssistant: false,
        landingPageTemplateGenerationAssistant: false
      }
    }
  },
  computed: {
    ...mapGetters({
      getPhishingScenariosSearchPermissions: 'permissions/getPhishingScenariosSearchPermissions',
      getEmailTemplatesSearchPermissions: 'permissions/getEmailTemplatesSearchPermissions',
      getLandingPageTemplatesSearchPermissions:
        'permissions/getLandingPageTemplatesSearchPermissions'
    })
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    },
    getAIAllySettings() {
      getAIAllySettings().then((res) => {
        this.aiAllySettings = res?.data?.data || {
          psEmailTemplateGenerationAssistant: false,
          landingPageTemplateGenerationAssistant: false
        }
      })
    }
  },
  created() {
    this.getAIAllySettings()
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
  beforeRouteLeave(to, from, next) {
    const { refScenarios, refEmailTemplates, refLandingPageList } = this.$refs
    if (refScenarios && refScenarios.modalStatus) {
      refScenarios.checkIfCanCLoseNewScenarioModal()
      next(false)
    } else if (refScenarios && refScenarios.isShowFastLaunch) {
      if (refScenarios?.$refs?.fastLaunch?.isSubmitted) return next()
      refScenarios.checkIfCanCloseFastLaunchModal()
      next(false)
    } else if (
      refEmailTemplates &&
      refEmailTemplates.$refs.newEmailTemplate &&
      refEmailTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate &&
      refEmailTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal
    ) {
      refEmailTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refEmailTemplates && refEmailTemplates.modalStatus) {
      refEmailTemplates.checkIfCanCloseNewEmailTemplate()
      next(false)
    } else if (
      refLandingPageList &&
      refLandingPageList.$refs.newLandingPage &&
      refLandingPageList.$refs.newLandingPage.$refs.refEmailTemplate &&
      refLandingPageList.$refs.newLandingPage.$refs.refEmailTemplate.showGrapesModal
    ) {
      refLandingPageList.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refLandingPageList && refLandingPageList.modalStatus) {
      refLandingPageList.checkIfCanCloseNewLandingPage()
      next(false)
    } else {
      next()
    }
  }
}
</script>
