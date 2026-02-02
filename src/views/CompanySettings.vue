<template>
  <KContainer id="company-settings">
    <el-tabs v-model="tab" ref="refTabContainer">
      <el-tab-pane
        v-if="getAccountPrivacyPermission"
        label="Privacy"
        name="privacy"
        id="privacy-content"
      >
        <Privacy v-if="tab === 'privacy'"
      /></el-tab-pane>
      <el-tab-pane
        v-if="hasAgenticAILicense"
        label="Agentic AI Settings"
        name="agentic-ai-settings"
        id="agentic-ai-settings-content"
      >
        <AgenticAISettings v-if="tab === 'agentic-ai-settings' && hasAgenticAILicense"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getAIAllySettingsGetPermissions"
        label="AI Ally Settings"
        name="ai-ally-settings"
        id="ai-ally-settings-content"
      >
        <AIAllySettings v-if="tab === 'ai-ally-settings'"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getSMTPSettingsSearchPermissions"
        label="SMTP Settings"
        name="smtp-settings"
        id="smtp-settings-content"
      >
        <SMTPSettings v-if="tab === 'smtp-settings'" ref="refSmtpSettings"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getDirectEmailCreationSearchPermissions"
        label="Direct Email Creation"
        name="direct-email-creation"
        id="direct-email-creation-content"
      >
        <DirectEmailCreation v-if="tab === 'direct-email-creation'" ref="refDirectEmailCreation"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getNotificationTemplatesSearchPermissions"
        label="Notification Templates"
        name="notification-template"
        id="notification-template-content"
      >
        <notification-templates
          v-if="tab === 'notification-template'"
          ref="refNotificationTemplates"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getGoogleUserProvisionGetPermissions"
        label="Microsoft Teams Settings"
        name="microsoft-teams-settings"
        id="microsoft-teams-settings-content"
      >
        <MicrosoftTeamsSettings
          v-if="tab === 'microsoft-teams-settings'"
          ref="refMicrosoftTeamsSettings"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getGoogleUserProvisionGetPermissions"
        label="Google User Provisioning"
        name="google-user-provisioning"
        id="google-user-provisioning-content"
      >
        <GoogleUserProvisioning
          v-if="tab === 'google-user-provisioning'"
          ref="refGoogleUserProvisioning"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getRestApiSearchPermissions"
        label="Rest API"
        name="custom-api"
        id="custom-api-content"
      >
        <custom-api v-if="tab === 'custom-api'" ref="refCustomApi"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getWhiteLabelingGetPermissions"
        label="White Labeling"
        name="white-labeling"
        id="white-labeling-content"
      >
        <white-labeling v-if="tab === 'white-labeling'" ref="refWhitelabeling"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getProxySettingsSearchPermissions"
        label="Proxy Settings"
        name="proxy-settings"
        id="proxy-settings-content"
      >
        <proxy-settings v-if="tab === 'proxy-settings'" ref="refProxySettings"></proxy-settings>
      </el-tab-pane>
      <el-tab-pane
        v-if="getSAMLIntegrationSearchPermissions"
        label="SAML Settings"
        name="saml-settings"
        id="saml-settings-content"
      >
        <saml-settings v-if="tab === 'saml-settings'" ref="refSamlSettings"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getSCIMSettingsSearchPermissions"
        label="SCIM Settings"
        name="scim-settings"
        id="scim-settings-content"
      >
        <s-c-i-m-settings v-if="tab === 'scim-settings'" ref="refScimSettings" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSIEMIntegrationSearchPermissions"
        name="siem-integrations"
        :label="labels.SIEMIntegrations"
        :id="`${labels.SIEMIntegrations.toLowerCase()}-content`"
      >
        <s-i-e-m-integrations
          v-if="tab === 'siem-integrations'"
          ref="refSIEMIntegrations"
        ></s-i-e-m-integrations>
      </el-tab-pane>
      <el-tab-pane
        v-if="getLDAPDetailPermission"
        name="ldap-settings"
        :label="labels.LDAP"
        :id="`${labels.LDAP.toLowerCase()}-content`"
      >
        <LDAP v-if="tab === 'ldap-settings'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getAllowListPermissionsSearch"
        name="allowed-list"
        :label="labels.AllowedDomain"
        :id="`${labels.AllowedDomain.toLowerCase()}-content`"
      >
        <allowed-list v-if="tab === 'allowed-list'" ref="refAllowedList" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import SMTPSettings from '@/components/Company Settings/SmtpSettings/SMTPSettings'
import NotificationTemplates from '@/components/Company Settings/NotificationTemplates'
import CustomApi from '@/components/Company Settings/RestApi/CustomApi'
import WhiteLabeling from '@/components/Company Settings/WhiteLabeling'
import SamlSettings from '@/components/Company Settings/SAML/SamlSettings'
import ProxySettings from '@/components/Company Settings/SmtpSettings/ProxySettings'
import SCIMSettings from '@/components/Company Settings/SCIM/SCIMSettings'
import SIEMIntegrations from '@/components/Integrations/SIEMIntegrations/SIEMIntegrations'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import LDAP from '@/components/Company Settings/LDAP/LDAP'
import AllowedList from '@/components/Company Settings/AllowedList/AllowedList'
import DirectEmailCreation from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreation'
import Privacy from '@/components/Company Settings/Privacy/Privacy'
import AgenticAISettings from '@/components/Company Settings/AgenticAISettings.vue'
import GoogleUserProvisioning from '@/components/Company Settings/GoogleUserProvisioning/GoogleUserProvisioning'
import MicrosoftTeamsSettings from '@/components/Company Settings/MicrosoftTeamsSettings/MicrosoftTeamsSettings'
import AIAllySettings from '../components/Company Settings/AiAllySettings.vue'

export default {
  name: 'CompanySettings',
  components: {
    GoogleUserProvisioning,
    MicrosoftTeamsSettings,
    AIAllySettings,
    AgenticAISettings,
    DirectEmailCreation,
    LDAP,
    KContainer,
    SIEMIntegrations,
    SCIMSettings,
    SamlSettings,
    SMTPSettings,
    NotificationTemplates,
    CustomApi,
    WhiteLabeling,
    ProxySettings,
    AllowedList,
    Privacy
  },
  data() {
    return {
      tab: 'smtp-settings',
      labels,
      timeoutId: null
    }
  },
  watch: {
    tab(val) {
      if (val === 'agentic-ai-settings' && this.hasAgenticAILicense) {
        this.$store.dispatch('login/getAgenticAIEnabled')
      }
    }
  },
  computed: {
    ...mapGetters({
      getSMTPSettingsSearchPermissions: 'permissions/getSMTPSettingsSearchPermissions',
      getNotificationTemplatesSearchPermissions:
        'permissions/getNotificationTemplatesSearchPermissions',
      getRestApiSearchPermissions: 'permissions/getRestApiSearchPermissions',
      getWhiteLabelingGetPermissions: 'permissions/getWhiteLabelingGetPermissions',
      getGoogleUserProvisionGetPermissions: 'permissions/getGoogleUserProvisionGetPermissions',
      getProxySettingsSearchPermissions: 'permissions/getProxySettingsSearchPermissions',
      getSAMLIntegrationSearchPermissions: 'permissions/getSAMLIntegrationSearchPermissions',
      getSCIMSettingsSearchPermissions: 'permissions/getSCIMSettingsSearchPermissions',
      getSIEMIntegrationSearchPermissions: 'permissions/getSIEMIntegrationSearchPermissions',
      getLDAPDetailPermission: 'permissions/getLDAPDetailPermission',
      getAllowListPermissionsSearch: 'permissions/getAllowListPermissionsSearch',
      getDirectEmailCreationSearchPermissions:
        'permissions/getDirectEmailCreationSearchPermissions',
      getAccountPrivacyPermission: 'permissions/getAccountPrivacyPermission',
      getAIAllySettingsGetPermissions: 'permissions/getAIAllySettingsGetPermissions',
      getMicrosoftTeamsSettingsGetPermissions:
        'permissions/getMicrosoftTeamsSettingsGetPermissions',
      hasAgenticAILicense: 'login/getHasAgenticAILicense'
    })
  },
  created() {
    this.tab = [
      { permission: this.getAccountPrivacyPermission, name: 'privacy' },
      {
        permission: this.hasAgenticAILicense,
        name: 'agentic-ai-settings'
      },
      {
        permission: this.getAIAllySettingsGetPermissions,
        name: 'ai-ally-settings'
      },
      {
        permission: this.getSMTPSettingsSearchPermissions,
        name: 'smtp-settings'
      },
      {
        permission: this.getDirectEmailCreationSearchPermissions,
        name: 'direct-email-creation'
      },
      {
        permission: this.getNotificationTemplatesSearchPermissions,
        name: 'notification-template'
      },
      {
        permission: this.getMicrosoftTeamsSettingsGetPermissions,
        name: 'microsoft-teams-settings'
      },
      {
        permission: this.getGoogleUserProvisionGetPermissions,
        name: 'google-user-provisioning'
      },
      { permission: this.getRestApiSearchPermissions, name: 'custom-api' },
      {
        permission: this.getWhiteLabelingGetPermissions,
        name: 'white-labeling'
      },
      {
        permission: this.getProxySettingsSearchPermissions,
        name: 'proxy-settings'
      },
      {
        permission: this.getSAMLIntegrationSearchPermissions,
        name: 'saml-settings'
      },
      {
        permission: this.getSCIMSettingsSearchPermissions,
        name: 'scim-settings'
      },
      {
        permission: this.getSIEMIntegrationSearchPermissions,
        name: 'siem-integrations'
      },
      {
        permission: this.getLDAPDetailPermission,
        name: 'ldap-settings'
      },
      {
        permission: this.getAllowListPermissionsSearch,
        name: 'allowed-list'
      }
    ].find((item) => item.permission)?.name
    this.changeTabByRoute()
  },
  beforeRouteLeave(to, from, next) {
    const {
      refSmtpSettings,
      refNotificationTemplates,
      refCustomApi,
      refProxySettings,
      refSamlSettings,
      refScimSettings,
      refAllowedList
    } = this.$refs
    if (refSmtpSettings?.newSmtpModalStatus) {
      refSmtpSettings.checkIfCanCloseSmtpModal()
      next(false)
    } else if (
      refNotificationTemplates?.$refs?.newNotificationTemplate?.$refs?.refEmailTemplate
        ?.showGrapesModal
    ) {
      refNotificationTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refNotificationTemplates?.newNotificationTemplateStatus) {
      refNotificationTemplates.checkIfCanCloseNotificationTemplateModal()
      next(false)
    } else if (refCustomApi?.showNewCustomApi) {
      refCustomApi.checkIfCanCloseCustomApiModal()
      next(false)
    } else if (refProxySettings?.newProxyModalStatus) {
      refProxySettings.checkIfCanCloseProxyModal()
      next(false)
    } else if (refSamlSettings?.isEditOrNewModalOpen) {
      refSamlSettings.checkIfCanCloseSamlSettingsModal()
      next(false)
    } else if (refScimSettings?.isShowAddOrEditModal) {
      refScimSettings.checkIfCanCloseScimAddOrEditModal()
    } else if (refAllowedList?.modalStatus) {
      refAllowedList.checkIfCanCLoseNewModal()
    } else {
      next()
    }
  },
  beforeDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    changeTabByRoute() {
      const { $route: { query } = {} } = this
      if (query?.tab === 'google-user-provisioning' && query?.state && query?.code) {
        this.timeoutId = setTimeout(() => {
          this.tab = 'google-user-provisioning'
        }, 750)
        return
      }
      if (
        (query?.code && query?.state) ||
        (query?.admin_consent && query?.error && query?.error_description && query?.state) ||
        (query?.admin_consent && query?.tenant && query?.scope) ||
        (query?.error && query?.error_subcode && query?.state)
      ) {
        this.timeoutId = setTimeout(() => {
          this.tab = 'microsoft-teams-settings'
        }, 750)
        return
      } else if (
        query?.tenant ||
        (query?.error && (query?.error_description || query?.error_subcode))
      ) {
        this.tab = 'direct-email-creation'
        return
      }
      if (!query || !query.tab) return
      if (query.tab === 'agentic-ai-settings' && !this.hasAgenticAILicense) {
        return
      }
      this.tab = query.tab
      this.$nextTick(() => {
        this.$router.replace(this.$route.fullPath.replace(`tab=${this.tab}`, ''))
      })
    }
  }
}
</script>
