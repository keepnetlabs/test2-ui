<template>
  <div class="download-add-in-microsoft365-content">
    <section class="download-add-in-microsoft365-content__section">
      <h3 class="download-add-in-microsoft365-content__section-title">
        Microsoft Graph Permissions
      </h3>
      <p class="download-add-in-microsoft365-content__section-subtitle">
        Required to enable email reporting from Outlook.
      </p>

      <DownloadAddInListItem
        :is-loading="false"
        class="flex-nowrap align-start"
        title-class="download-add-in__list-item-margin-title"
        hide-border
        title="Authorize GRAPH APIs (Delegated Access)"
        description="Enables phishing email reporting from Outlook Ribbon and Page Views using delegated permissions."
      >
        <template #buttons>
          <div class="d-flex justify-end align-self-center mt-8 flex-column gap-6">
            <VBtn
              id="btn-download-g-suite--phishing-reporter-settings-add-in-modal-delegated"
              class="btn-util btn-download-add-in"
              :class="{ 'white--text': !isAccountConnected }"
              style="
                margin-left: 5px !important;
                text-transform: capitalize;
                box-shadow: none !important;
              "
              :color="isAccountConnected ? '#F56C6C' : '#2196f3'"
              rounded
              :outlined="isAccountConnected"
              @click="$emit('delegated-graph-access')"
            >
              <v-icon left>mdi-check-circle</v-icon>
              {{ isAccountConnected ? 'Revoke Authorization' : 'Authorize' }}
            </VBtn>
          </div>
        </template>
      </DownloadAddInListItem>
      <AlertBox
        class="w-100"
        :style="{
          backgroundColor: isAccountConnected ? 'rgba(67, 160, 71, 0.15)' : '#f2f2f2',
          padding: '8px !important',
          paddingLeft: '12px !important'
        }"
        :icon-name="isAccountConnected ? 'mdi-lock-check' : 'mdi-lock'"
        :icon-color="isAccountConnected ? '#43A047' : '#757575'"
        :icon-props="{ size: 16 }"
        :slots="{ primaryAction: false, secondaryAction: false }"
      >
        <template #text>
          <div class="ml-2" style="font-size: 12px; color: #383b41;">
            <div class="text-primary-color">
              {{
                isAccountConnected
                  ? 'Delegated access successfully authorized.'
                  : 'Required for all user-based Outlook reporting.'
              }}
            </div>
          </div>
        </template>
      </AlertBox>

      <DownloadAddInListItem
        class="flex-nowrap align-start mt-0"
        hide-border
        is-optional
        title="Authorize GRAPH APIs (Application-Level Access)"
        description="Provides organization-wide authentication and identity mapping, powered by Microsoft Graph."
      >
        <template #buttons>
          <div class="d-flex justify-end align-end flex-column gap-6">
            <VTooltip
              v-if="!isAccountConnected && !isApplicationLevelAuthorized"
              bottom
              max-width="200"
            >
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn
                    id="btn-download-g-suite--phishing-reporter-settings-add-in-modal-app-level-disabled"
                    class="btn-util btn-download-add-in"
                    style="
                      margin-left: 5px !important;
                      text-transform: capitalize;
                      box-shadow: none !important;
                      margin-top: 4px;
                    "
                    :style="{ opacity: 0.5, pointerEvents: 'none' }"
                    :color="isApplicationLevelAuthorized ? '#F56C6C' : '#2196f3'"
                    rounded
                    outlined
                    @click="$emit('application-level-graph-access')"
                  >
                    <v-icon left>mdi-check-circle</v-icon>
                    {{ isApplicationLevelAuthorized ? 'Revoke Authorization' : 'Authorize' }}
                  </VBtn>
                </div>
              </template>
              <span>Delegated Access authorization is required to enable this option.</span>
            </VTooltip>
            <VBtn
              v-else
              id="btn-download-g-suite--phishing-reporter-settings-add-in-modal-app-level"
              class="btn-util btn-download-add-in"
              style="
                margin-left: 5px !important;
                text-transform: capitalize;
                box-shadow: none !important;
                margin-top: 4px;
              "
              :color="isApplicationLevelAuthorized ? '#F56C6C' : '#2196f3'"
              rounded
              outlined
              @click="$emit('application-level-graph-access')"
            >
              <v-icon left>mdi-check-circle</v-icon>
              {{ isApplicationLevelAuthorized ? 'Revoke Authorization' : 'Authorize' }}
            </VBtn>
          </div>
        </template>
      </DownloadAddInListItem>
      <AlertBox
        class="w-100"
        :style="{
          backgroundColor: isApplicationLevelAuthorized ? 'rgba(67, 160, 71, 0.15)' : '#f2f2f2',
          padding: '8px !important',
          paddingLeft: '12px !important'
        }"
        :icon-name="isApplicationLevelAuthorized ? 'mdi-lock-check' : 'mdi-lock'"
        :icon-color="isApplicationLevelAuthorized ? '#43A047' : '#757575'"
        :icon-props="{ size: 16 }"
        :slots="{ primaryAction: false, secondaryAction: false }"
      >
        <template #text>
          <div class="ml-2" style="font-size: 12px; color: #383b41;">
            <div class="text-primary-color">
              {{
                isApplicationLevelAuthorized
                  ? 'Application-level access successfully authorized.'
                  : 'Recommended for organizations using Conditional Access or Advanced Identity Policies.'
              }}
            </div>
          </div>
        </template>
      </AlertBox>
    </section>

    <section class="download-add-in-microsoft365-content__section">
      <h3 class="download-add-in-microsoft365-content__section-title">
        Available Reporting Add-ins
      </h3>
      <p class="download-add-in-microsoft365-content__section-subtitle">
        Download the add-in used to report suspicious emails in Outlook.
      </p>

      <v-row class="mt-2 download-add-in-microsoft365-content__cards-row">
        <v-col cols="6" class="d-flex">
          <div class="download-add-in-microsoft365-content__card">
            <h4 class="download-add-in-microsoft365-content__card-title">Ribbon View</h4>
            <p class="download-add-in-microsoft365-content__card-desc">
              Requires Microsoft Graph API access to report suspicious emails from the Outlook
              ribbon.
            </p>
            <VTooltip bottom max-width="200" :disabled="isAccountConnected">
              <template #activator="{ on }">
                <span v-on="on">
                  <VBtn
                    id="btn-download-ribbon-view--phishing-reporter-settings-add-in-modal"
                    class="white--text btn-util btn-download-add-in"
                    style="margin-left: 5px !important; text-transform: capitalize;"
                    color="#2196f3"
                    rounded
                    :style="{
                      opacity: !isAccountConnected ? 0.5 : 1,
                      pointerEvents: !isAccountConnected ? 'none' : 'auto'
                    }"
                    :loading="o365SpinnerStatus"
                    @click="$emit('download-ribbon-view')"
                  >
                    <v-icon left small>mdi-download</v-icon>
                    Download
                    <template #loader>
                      <img
                        src="@/assets/img/spinner.svg"
                        class="add-in-settings__spinner"
                        alt="spinner"
                      />
                      <span style="font-size: 14px; text-transform: capitalize;">
                        Generating...
                      </span>
                    </template>
                  </VBtn>
                </span>
              </template>
              <span>
                Ribbon View is disabled because delegated access has not been granted.
              </span>
            </VTooltip>
          </div>
        </v-col>
        <v-col cols="6" class="d-flex">
          <div class="download-add-in-microsoft365-content__card">
            <h4 class="download-add-in-microsoft365-content__card-title">Page View</h4>
            <p class="download-add-in-microsoft365-content__card-desc">
              Allows users to report suspicious emails from the Outlook side panel.
            </p>
            <VBtn
              id="btn-download-page-view--phishing-reporter-settings-add-in-modal"
              class="white--text btn-util btn-download-add-in"
              style="margin-left: 5px !important; text-transform: capitalize;"
              color="#2196f3"
              rounded
              :loading="pageViewSpinnerStatus"
              @click="$emit('download-page-view')"
            >
              <v-icon left small>mdi-download</v-icon>
              Download
              <template #loader>
                <img
                  src="@/assets/img/spinner.svg"
                  class="add-in-settings__spinner"
                  alt="spinner"
                />
                <span style="font-size: 14px; text-transform: capitalize;">
                  Generating...
                </span>
              </template>
            </VBtn>
          </div>
        </v-col>
      </v-row>
    </section>

    <section class="download-add-in-microsoft365-content__section">
      <v-expansion-panels class="download-add-in-microsoft365-content__platform-accordion">
        <v-expansion-panel>
          <v-expansion-panel-header class="download-add-in-microsoft365-content__expansion-header">
            <div class="download-add-in-microsoft365-content__accordion-header-content">
              <h3 class="download-add-in-microsoft365-content__section-title mb-0">
                Check Platform Compatibility
              </h3>
              <p class="download-add-in-microsoft365-content__section-subtitle mb-0">
                Make sure the selected add-in is supported in your environment.
              </p>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <table class="download-add-in-microsoft365-content__platform-table">
              <thead>
                <tr>
                  <th>Feature / Platform</th>
                  <th>Ribbon View</th>
                  <th>Page View</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in platformCompatibilityData"
                  :key="index"
                  :class="{ 'download-add-in-microsoft365-content__platform-table-row--alt': index % 2 === 1 }"
                >
                  <td>{{ row.platform }}</td>
                  <td>
                    <span class="d-flex align-center">
                      <VIcon
                        :color="row.ribbonView.supported ? '#43A047' : '#F56C6C'"
                        small
                        class="mr-1"
                      >
                        {{ row.ribbonView.supported ? 'mdi-check-circle-outline' : 'mdi-close' }}
                      </VIcon>
                      {{ row.ribbonView.supported ? 'Supported' : 'Not Supported' }}
                      <span v-if="row.ribbonView.note" class="download-add-in-microsoft365-content__platform-table-note ml-1">
                        {{ row.ribbonView.note }}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span class="d-flex align-center">
                      <VIcon
                        :color="row.pageView.supported ? '#43A047' : '#F56C6C'"
                        small
                        class="mr-1"
                      >
                        {{ row.pageView.supported ? 'mdi-check-circle-outline' : 'mdi-close' }}
                      </VIcon>
                      {{ row.pageView.supported ? 'Supported' : 'Not Supported' }}
                      <span v-if="row.pageView.note" class="download-add-in-microsoft365-content__platform-table-note ml-1">
                        {{ row.pageView.note }}
                      </span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>
  </div>
</template>

<script>
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'
import AlertBox from '@/components/AlertBox.vue'

export default {
  name: 'DownloadAddInMicrosoft365Content',
  components: {
    DownloadAddInListItem,
    AlertBox
  },
  props: {
    isAccountConnected: {
      type: Boolean,
      default: false
    },
    isApplicationLevelAuthorized: {
      type: Boolean,
      default: false
    },
    o365SpinnerStatus: {
      type: Boolean,
      default: false
    },
    pageViewSpinnerStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      platformCompatibilityData: [
        {
          platform: 'Outlook on Windows (Classic)',
          ribbonView: { supported: true, note: '(only version 2404 build 17530.15000)' },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on Windows (New)',
          ribbonView: { supported: true },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook Classic 2016+ on Windows (Exchange)',
          ribbonView: { supported: true },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on MacOS (Microsoft 365)',
          ribbonView: { supported: false },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on MacOS (Exchange)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        },
        {
          platform: 'Outlook on Web MacOS (Exchange)',
          ribbonView: { supported: false },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on the Web (Microsoft 365)',
          ribbonView: { supported: true, note: '(Version 16.81 (23121700) or later)' },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on the Web (Exchange)',
          ribbonView: { supported: false },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on iOS (Microsoft 365)',
          ribbonView: { supported: false },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on Android (Microsoft 365)',
          ribbonView: { supported: false },
          pageView: { supported: true }
        },
        {
          platform: 'Outlook on iOS (Exchange)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        },
        {
          platform: 'Outlook on Android (Exchange)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        },
        {
          platform: 'Shared Mailboxes (Outlook Desktop)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        },
        {
          platform: 'Shared Mailboxes (Microsoft 365)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        },
        {
          platform: 'Mobile Browser (OWA)',
          ribbonView: { supported: false },
          pageView: { supported: false }
        }
      ]
    }
  }
}
</script>
