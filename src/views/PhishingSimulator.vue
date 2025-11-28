<template>
  <KContainer id="phishing-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getPhishingScenariosSearchPermissions"
        label="Scenarios"
        name="scenarios"
        id="emailTemplates-scenarios"
      >
        <Scenarios
          v-if="tab === 'scenarios'"
          ref="refScenarios"
          :scenario-details-lookup="scenarioDetailsLookup"
        />
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
          :scenario-details-lookup="scenarioDetailsLookup"
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
          :scenario-details-lookup="scenarioDetailsLookup"
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
import useScenarioDetailsLookup from '@/hooks/useScenarioDetailsLookup'
export default {
  name: 'PhishingSimulator',
  mixins: [useScenarioDetailsLookup],
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
    this.callForScenarioDetails()
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
    if (refScenarios?.modalStatus) {
      refScenarios.checkIfCanCLoseNewScenarioModal()
      next(false)
    } else if (refScenarios?.isShowFastLaunch) {
      if (refScenarios?.$refs?.fastLaunch?.isSubmitted) return next()
      refScenarios.checkIfCanCloseFastLaunchModal()
      next(false)
    } else if (
      refEmailTemplates?.$refs?.newEmailTemplate?.$refs?.refEmailTemplate?.showGrapesModal
    ) {
      refEmailTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refEmailTemplates?.modalStatus) {
      refEmailTemplates.checkIfCanCloseNewEmailTemplate()
      next(false)
    } else if (
      refLandingPageList?.$refs?.newLandingPage?.$refs?.refEmailTemplate?.showGrapesModal
    ) {
      refLandingPageList.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refLandingPageList?.modalStatus) {
      refLandingPageList.checkIfCanCloseNewLandingPage()
      next(false)
    } else {
      next()
    }
  }
}
</script>
