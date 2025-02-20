<template>
  <KContainer id="smishing-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getSmishingScenariosSearchPermissions"
        label="Scenarios"
        name="scenarios"
        id="smishing-scenarios-content"
      >
        <Scenarios
          v-if="tab === 'scenarios'"
          ref="refScenarios"
          @handleNoMessageTemplate="handleNoMessageTemplate"
          @handleNoLandingPageTemplate="handleNoLandingPageTemplate"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingTextMessageTemplatesSearchPermissions"
        label="Text Message Templates"
        name="templates"
        id="templates-content"
      >
        <Templates v-if="tab === 'templates'" ref="refTemplates" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingLandingPageTemplatesSearchPermissions"
        label="Landing Page Templates"
        name="landingPage"
        id="landing-page-content"
      >
        <LandingPageList v-if="tab === 'landingPage'" ref="refLandingPageList" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import Templates from '@/components/SmishingTemplates/Templates'
import LandingPageList from '@/components/SmishingLandingPages/LandingPageList'
import Scenarios from '@/components/SmishingScenarios/Scenarios'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'SmishingScenariosParent',
  components: {
    KContainer,
    Templates,
    LandingPageList,
    Scenarios
  },
  data() {
    return {
      tab: 'scenarios'
    }
  },
  computed: {
    ...mapGetters({
      getSmishingScenariosSearchPermissions: 'permissions/getSmishingScenariosSearchPermissions',
      getSmishingTextMessageTemplatesSearchPermissions:
        'permissions/getSmishingTextMessageTemplatesSearchPermissions',
      getSmishingLandingPageTemplatesSearchPermissions:
        'permissions/getSmishingLandingPageTemplatesSearchPermissions'
    })
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    },
    handleNoMessageTemplate() {
      this.tab = 'templates'
      this.$nextTick(() => {
        if (this.$refs?.refTemplates) {
          this.$refs?.refTemplates?.changeNewEmailTemplateModalStatus(true, false)
        }
      })
    },
    handleNoLandingPageTemplate() {
      this.tab = 'landingPage'
      this.$nextTick(() => {
        if (this.$refs?.refLandingPageList) {
          this.$refs?.refLandingPageList?.changeNewEmailTemplateModalStatus(true, false)
        }
      })
    }
  },
  created() {
    if (
      !this.getSmishingScenariosSearchPermissions &&
      this.getSmishingTextMessageTemplatesSearchPermissions
    ) {
      this.tab = 'templates'
    } else if (
      !this.getSmishingScenariosSearchPermissions &&
      !this.getSmishingTextMessageTemplatesSearchPermissions &&
      this.getSmishingLandingPageTemplatesSearchPermissions
    ) {
      this.tab = 'landingPage'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refScenarios, refTemplates, refLandingPageList } = this.$refs
    if (refScenarios && refScenarios.modalStatus) {
      refScenarios.checkIfCanCLoseNewScenarioModal()
      next(false)
    } else if (refScenarios && refScenarios.isShowFastLaunch) {
      if (refScenarios?.$refs?.fastLaunch?.isSubmitted) return next()
      refScenarios.checkIfCanCloseFastLaunchModal()
      next(false)
    } else if (
      refTemplates &&
      refTemplates.$refs.newEmailTemplate &&
      refTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate &&
      refTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal
    ) {
      refTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refTemplates && refTemplates.modalStatus) {
      if (typeof refTemplates.checkIfCanCloseNewEmailTemplate === 'function')
        refTemplates.checkIfCanCloseNewEmailTemplate()
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
