<template>
  <KContainer id="smishing-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getSmishingScenariosSearchPermissions"
        label="Scenarios"
        name="scenarios"
        id="smishing-scenarios-content"
      >
        <CallbackScenariosTab
          v-if="tab === 'scenarios'"
          ref="refScenarios"
          :languages="languages"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingLandingPageTemplatesSearchPermissions"
        label="Email Templates"
        name="emailTemplates"
        id="email-templates-content"
      >
        <EmailTemplates v-if="tab === 'emailTemplates'" ref="refEmailTemplates" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingTextMessageTemplatesSearchPermissions"
        label="Callback Templates"
        name="callbackTemplates"
        id="templates-content"
      >
        <CallbackTemplates v-if="tab === 'callbackTemplates'" ref="refTemplates" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import EmailTemplates from '@/components/CallbackScenarios/EmailTemplates'
import CallbackTemplates from '@/components/CallbackScenarios/CallbackTemplates'
import CallbackScenarios from '@/components/CallbackScenarios/CallbackScenarios'
import { mapGetters } from 'vuex'
import CallbackService from '@/api/callback'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'CallbackScenarios',
  components: {
    KContainer,
    EmailTemplates,
    CallbackScenariosTab: CallbackScenarios,
    CallbackTemplates
  },
  data() {
    return {
      languages: [],
      tab: 'scenarios'
    }
  },
  // TODO: Change permissions
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
    callForLanguages() {
      CallbackService.getCallbackTemplateLanguages().then((response) => {
        this.languages = response?.data?.data || []
      })
    },
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    },
    handleNoMessageTemplate() {
      this.tab = 'callbackTemplates'
      this.$nextTick(() => {
        if (this.$refs?.refTemplates) {
          this.$refs?.refTemplates.changeNewEmailTemplateModalStatus(true, false)
        }
      })
    },
    handleNoLandingPageTemplate() {
      this.tab = 'emailTemplates'
      this.$nextTick(() => {
        if (this.$refs?.refEmailTemplates) {
          this.$refs?.refEmailTemplates.changeNewEmailTemplateModalStatus(true, false)
        }
      })
    }
  },
  created() {
    this.callForLanguages()
    if (
      !this.getSmishingScenariosSearchPermissions &&
      this.getSmishingTextMessageTemplatesSearchPermissions
    ) {
      this.tab = 'emailTemplates'
    } else if (
      !this.getSmishingScenariosSearchPermissions &&
      !this.getSmishingTextMessageTemplatesSearchPermissions &&
      this.getSmishingLandingPageTemplatesSearchPermissions
    ) {
      this.tab = 'callbackTemplates'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refScenarios, refTemplates, refEmailTemplates } = this.$refs

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
      refTemplates.checkIfCanCloseNewEmailTemplate()
      next(false)
    } else if (
      refEmailTemplates &&
      refEmailTemplates.$refs.newEmailTemplate &&
      refEmailTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate &&
      refEmailTemplates.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal
    ) {
      refEmailTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else {
      next()
    }
  }
}
</script>
