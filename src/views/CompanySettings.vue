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
        v-if="getGoogleWorkspaceProvisioningPermissions"
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
        vif="getWhiteLabelingGetPermissions"
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
import GoogleUserProvisioning from '@/components/Company Settings/GoogleUserProvisioning/GoogleUserProvisioning'
export default {
  name: 'CompanySettings',
  components: {
    GoogleUserProvisioning,
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
      labels
    }
  },
  computed: {
    ...mapGetters({
      getSMTPSettingsSearchPermissions: 'permissions/getSMTPSettingsSearchPermissions',
      getNotificationTemplatesSearchPermissions:
        'permissions/getNotificationTemplatesSearchPermissions',
      // TODO: Change permissions
      getGoogleWorkspaceProvisioningPermissions:
        'permissions/getNotificationTemplatesSearchPermissions',
      getRestApiSearchPermissions: 'permissions/getRestApiSearchPermissions',
      getWhiteLabelingGetPermissions: 'permissions/getWhiteLabelingGetPermissions',
      getProxySettingsSearchPermissions: 'permissions/getProxySettingsSearchPermissions',
      getSAMLIntegrationSearchPermissions: 'permissions/getSAMLIntegrationSearchPermissions',
      getSCIMSettingsSearchPermissions: 'permissions/getSCIMSettingsSearchPermissions',
      getSIEMIntegrationSearchPermissions: 'permissions/getSIEMIntegrationSearchPermissions',
      getLDAPDetailPermission: 'permissions/getLDAPDetailPermission',
      getAllowListPermissionsSearch: 'permissions/getAllowListPermissionsSearch',
      getDirectEmailCreationSearchPermissions:
        'permissions/getDirectEmailCreationSearchPermissions',
      getAccountPrivacyPermission: 'permissions/getAccountPrivacyPermission'
    })
  },
  created() {
    this.tab = [
      { permission: true, name: 'privacy' },
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
        permission: this.getGoogleWorkspaceProvisioningPermissions,
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
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    changeTabByRoute() {
      const { $route: { query } = {} } = this
      if (query?.tenant || (query?.error && (query?.error_description || query?.error_subcode))) {
        this.tab = 'direct-email-creation'
        return
      }
      if (!query || !query.tab) return
      this.tab = query.tab
      this.$nextTick(() => {
        this.$router.replace(this.$route.fullPath.replace(`tab=${this.tab}`, ''))
      })
    }
  }
}
</script>
