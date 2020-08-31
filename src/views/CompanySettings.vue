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
            <ip-addresses />
          </v-tab-item>
          <v-tab-item>
            <user-directories />
          </v-tab-item>
          <v-tab-item>
            <s-m-t-p-settings />
          </v-tab-item>
          <v-tab-item>
            <notification-templates />
          </v-tab-item>
          <v-tab-item>
            <data-anonymization />
          </v-tab-item>
          <v-tab-item>
            <white-labeling />
          </v-tab-item>
          <v-tab-item>
            Tab 7
          </v-tab-item>
          <v-tab-item>
            Tab 8
          </v-tab-item>
          <v-tab-item>
            Tab 9
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import IpAddresses from '@/components/Company Settings/IpAddresses'
import UserDirectories from '@/components/Company Settings/UserDirectories'
import SMTPSettings from '@/components/Company Settings/SMTPSettings'
import NotificationTemplates from '@/components/Company Settings/NotificationTemplates'
import DataAnonymization from '@/components/Company Settings/DataAnonymization'
import WhiteLabeling from '@/components/Company Settings/WhiteLabeling'
export default {
  name: 'CompanySettings',
  components: {
    SMTPSettings,
    UserDirectories,
    IpAddresses,
    NotificationTemplates,
    DataAnonymization,
    WhiteLabeling
  },
  data() {
    return {
      tab: 0,
      tabItems: [
        'IP Addresses',
        'User Directories',
        'SMTP Settings',
        'Notification Templates',
        'Data Anonymization',
        'White Labeling',
        'Rest API',
        'SMS Settings',
        'Custom API'
      ]
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
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
    .v-slide-group__next--disabled,
    .v-slide-group__prev--disabled {
      display: none;
    }
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
}
</style>
