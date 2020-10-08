<template>
  <div class="company-settings" id="company-settings">
    <v-layout wrap class="company-settings__container">
      <v-card class="company-settings__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          class="k-tabs"
          v-model="tab"
          show-arrows
        >
          <v-tab
            :key="tab"
            @click="changeTabStatus(index)"
            class="k-tab"
            v-for="(tab, index) in tabItems"
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <s-m-t-p-settings ref="refSmtpSettings" />
          </v-tab-item>
          <v-tab-item>
            <notification-templates ref="refNotificationTemplates" />
          </v-tab-item>
          <v-tab-item>
            <custom-api ref="refCustomApi" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import SMTPSettings from '@/components/Company Settings/SMTPSettings'
import NotificationTemplates from '@/components/Company Settings/NotificationTemplates'
import RestApi from '@/components/Company Settings/RestApi'
import CustomApi from '@/components/Company Settings/CustomApi'
export default {
  name: 'CompanySettings',
  components: {
    SMTPSettings,
    NotificationTemplates,
    CustomApi
  },
  data() {
    return {
      tab: 0,
      tabItems: ['SMTP Settings', 'Notification Templates', 'Rest API'],
      ENUM: {
        COMPANYSETTINGS: 'Company Settings'
      }
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
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
    padding: 0px 16px 24px 16px !important;
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
