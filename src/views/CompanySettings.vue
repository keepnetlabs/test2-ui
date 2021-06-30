<template>
  <div class="company-settings" id="company-settings">
    <v-layout wrap class="company-settings__container">
      <v-card class="company-settings__container-card">
        <el-tabs v-model="tab" ref="refTabContainer">
          <el-tab-pane label="SMTP Settings" name="smtp-settings" id="smtp-settings-content">
            <s-m-t-p-settings
              :PERMISSIONS="PERMISSIONS['SMTP_SETTINGS_PERMISSIONS']"
              v-if="tab === 'smtp-settings'"
              ref="refSmtpSettings"
          /></el-tab-pane>
          <el-tab-pane
            label="Notification Templates"
            name="notification-template"
            id="notification-template-content"
          >
            <notification-templates
              v-if="tab === 'notification-template'"
              ref="refNotificationTemplates"
          /></el-tab-pane>
          <el-tab-pane label="Rest API" name="custom-api" id="custom-api-content">
            <custom-api v-if="tab === 'custom-api'" ref="refCustomApi"
          /></el-tab-pane>
          <el-tab-pane label="White Labeling" name="white-labeling" id="white-labeling-content">
            <white-labeling
              v-if="tab === 'white-labeling'"
              ref="refWhitelabeling"
              :PERMISSIONS="PERMISSIONS['WHITE_LABEL_PERMISSIONS']"
          /></el-tab-pane>
          <el-tab-pane label="Proxy Settings" name="proxy-settings" id="proxy-settings-content">
            <proxy-settings v-if="tab === 'proxy-settings'" ref="refProxySettings"></proxy-settings>
          </el-tab-pane>
          <el-tab-pane
            v-if="checkPermissions('companies/saml-settings/search', 'POST')"
            label="SAML Settings"
            name="saml-settings"
            id="saml-settings-content"
          >
            <saml-settings v-if="tab === 'saml-settings'" ref="refSamlSettings"
          /></el-tab-pane>
        </el-tabs>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import SMTPSettings from '@/components/Company Settings/SmtpSettings/SMTPSettings'
import NotificationTemplates from '@/components/Company Settings/NotificationTemplates'
import CustomApi from '@/components/Company Settings/RestApi/CustomApi'
import WhiteLabeling from '@/components/Company Settings/WhiteLabeling'
import PERMISSIONS from '@/permissions'
import { getPermissionsOfAllItems } from '@/utils/functions'
import SamlSettings from '@/components/Company Settings/SAML/SamlSettings'
import ProxySettings from '@/components/Company Settings/SmtpSettings/ProxySettings'
import { checkPermission } from '@/utils/functions'
export default {
  name: 'CompanySettings',
  components: {
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
      ENUM: {
        COMPANYSETTINGS: 'Company Settings'
      },
      PERMISSIONS: {
        SMTP_SETTINGS_PERMISSIONS: {},
        NOTIFICATION_TEMPLATES_PERMISSIONS: {},
        REST_API_PERMISSIONS: {},
        WHITE_LABEL_PERMISSIONS: {}
      }
    }
  },
  methods: {
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    changeTabStatus(status) {
      this.tab = status
    },
    getPermissions() {
      const { SMTP_SETTINGS_PERMISSIONS, WHITE_LABEL_PERMISSIONS } = PERMISSIONS
      this.$set(
        this.PERMISSIONS,
        'SMTP_SETTINGS_PERMISSIONS',
        getPermissionsOfAllItems(SMTP_SETTINGS_PERMISSIONS)
      )
      this.$set(
        this.PERMISSIONS,
        'WHITE_LABEL_PERMISSIONS',
        getPermissionsOfAllItems(WHITE_LABEL_PERMISSIONS)
      )
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
    this.getPermissions()
    this.changeTabByRoute()
  },
  beforeRouteLeave(to, from, next) {
    const { refSmtpSettings, refNotificationTemplates, refCustomApi } = this.$refs
    if (refSmtpSettings && refSmtpSettings.newSmtpModalStatus) {
      refSmtpSettings.toggleSmtpModalStatus()
      next(false)
    } else if (refNotificationTemplates && refNotificationTemplates.newNotificationTemplateStatus) {
      refNotificationTemplates.toggleNewNotificationTemplate()
      next(false)
    } else if (refCustomApi && refCustomApi.showNewCustomApi) {
      refCustomApi.toggleNewCustomApiStatus()
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.company-settings {
  min-height: 80vh !important;
  padding-top: 10px;
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
    font-size: 24px;
    opacity: 0.9;
    font-weight: normal;
    line-height: 1.29 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__subtitle {
    font-size: 14px;
    opacity: 0.9;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    margin-bottom: 24px;
    color: rgba(0, 0, 0, 0.87) !important;
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
