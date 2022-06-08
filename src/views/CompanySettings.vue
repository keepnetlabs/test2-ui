<template>
  <KContainer id="company-settings">
    <el-tabs v-model="tab" ref="refTabContainer">
      <el-tab-pane
        v-if="getSMTPSettingsSearchPermissions"
        label="SMTP Settings"
        name="smtp-settings"
        id="smtp-settings-content"
      >
        <s-m-t-p-settings v-if="tab === 'smtp-settings'" ref="refSmtpSettings"
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
        <LDAP v-if="getLDAPDetailPermission" />
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
export default {
  name: 'CompanySettings',
  components: {
    LDAP,
    KContainer,
    SIEMIntegrations,
    SCIMSettings,
    SamlSettings,
    SMTPSettings,
    NotificationTemplates,
    CustomApi,
    WhiteLabeling,
    ProxySettings
  },
  data() {
    return {
      tab: 'smtp-settings',
      labels,
      ENUM: {
        COMPANYSETTINGS: 'Company Settings'
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
      getProxySettingsSearchPermissions: 'permissions/getProxySettingsSearchPermissions',
      getSAMLIntegrationSearchPermissions: 'permissions/getSAMLIntegrationSearchPermissions',
      getSCIMSettingsSearchPermissions: 'permissions/getSCIMSettingsSearchPermissions',
      getSIEMIntegrationSearchPermissions: 'permissions/getSIEMIntegrationSearchPermissions',
      getLDAPDetailPermission: 'permissions/getLDAPDetailPermission'
    })
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    changeTabByRoute() {
      const { $route: { query } = {} } = this
      if (!query || !query.tab) return
      this.tab = query.tab
      this.$nextTick(() => {
        this.$router.replace(this.$route.fullPath.replace('tab=notification-template&', ''))
      })
    }
  },
  created() {
    this.tab = [
      { permission: this.getSMTPSettingsSearchPermissions, name: 'smtp-settings' },
      { permission: this.getNotificationTemplatesSearchPermissions, name: 'notification-template' },
      { permission: this.getRestApiSearchPermissions, name: 'custom-api' },
      { permission: this.getWhiteLabelingGetPermissions, name: 'white-labeling' },
      { permission: this.getProxySettingsSearchPermissions, name: 'proxy-settings' },
      { permission: this.getSAMLIntegrationSearchPermissions, name: 'saml-settings' },
      { permission: this.getSCIMSettingsSearchPermissions, name: 'scim-settings' },
      {
        permission: this.getSIEMIntegrationSearchPermissions,
        name: 'siem-integrations'
      },
      {
        permission: this.getLDAPDetailPermission,
        name: 'ldap-settings'
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
      refScimSettings
    } = this.$refs
    if (refSmtpSettings && refSmtpSettings.newSmtpModalStatus) {
      refSmtpSettings.checkIfCanCloseSmtpModal()
      next(false)
    } else if (
      refNotificationTemplates &&
      refNotificationTemplates.$refs.newNotificationTemplate &&
      refNotificationTemplates.$refs.newNotificationTemplate.$refs.refEmailTemplate &&
      refNotificationTemplates.$refs.newNotificationTemplate.$refs.refEmailTemplate.showGrapesModal
    ) {
      refNotificationTemplates.checkIfCanCloseGrapesJSModal()
      next(false)
    } else if (refNotificationTemplates && refNotificationTemplates.newNotificationTemplateStatus) {
      refNotificationTemplates.checkIfCanCloseNotificationTemplateModal()
      next(false)
    } else if (refCustomApi && refCustomApi.showNewCustomApi) {
      refCustomApi.checkIfCanCloseCustomApiModal()
      next(false)
    } else if (refProxySettings && refProxySettings.newProxyModalStatus) {
      refProxySettings.checkIfCanCloseProxyModal()
      next(false)
    } else if (refSamlSettings && refSamlSettings.isEditOrNewModalOpen) {
      refSamlSettings.checkIfCanCloseSamlSettingsModal()
      next(false)
    } else if (refScimSettings && refScimSettings.isShowAddOrEditModal) {
      refScimSettings.checkIfCanCloseScimAddOrEditModal()
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.company-settings {
  &__header {
    .v-list-item {
      padding: 0;

      .v-list-item__content {
        padding: 0;
      }

      .v-list-item__content > *:not(:last-child) {
        margin-bottom: 0;
      }
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.29 !important;
    letter-spacing: normal;
    color: #383b41 !important;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    margin-bottom: 24px;
    color: #383b41 !important;
  }
  &__container {
    padding: 0 16px 24px 16px !important;
    width: 100%;
    .v-window__container {
      margin-top: 24px;
    }
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
  .v-slide-group__prev.v-slide-group__prev--disabled,
  .v-slide-group__prev {
    margin-left: -32px;
    margin-top: 1px;

    i {
      margin-right: -8px;
    }
  }
  .v-slide-group__next {
    margin-right: -24px;
    margin-top: 1px;
    i {
      margin-left: -8px;
    }
  }
}
</style>
