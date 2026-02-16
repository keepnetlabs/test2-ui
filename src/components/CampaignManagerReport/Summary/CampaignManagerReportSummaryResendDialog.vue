<template>
  <AppDialog
    title-id="text--campaign-manager-report-resend-popup-title"
    subtitle-id="text--campaign-manager-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="phishingScenarioName"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div>
        <div class="mb-3">Resend this campaign to:</div>
        <div>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-failed-to-send"
                  color="#2196f3"
                  class="d-inline-block"
                  :disabled="!items.notDelivered || campaignDurationExpired()"
                  :value="5"
                >
                  <template #label>
                    Email failed to send {{ `(${items.notDelivered || 0})` }}</template
                  >
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-opened-email"
                  color="#2196f3"
                  :disabled="!items.openedEmail || campaignDurationExpired()"
                  :value="1"
                >
                  <template #label> Only opened email {{ `(${items.openedEmail || 0})` }}</template>
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-clicked-link"
                  color="#2196f3"
                  :disabled="!items.clickedEmail || campaignDurationExpired()"
                  :value="2"
                >
                  <template #label>
                    Clicked phishing link {{ `(${items.clickedEmail || 0})` }}</template
                  >
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-submitted-data"
                  color="#2196f3"
                  :disabled="!items.submittedEmail || campaignDurationExpired()"
                  :value="3"
                >
                  <template #label> Submitted data {{ `(${items.submittedEmail || 0})` }}</template>
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-mfa"
                  color="#2196f3"
                  :disabled="!items.mfa"
                  :value="8"
                >
                  <template #label> Submitted MFA code {{ `(${items.mfa || 0})` }}</template>
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-attachment"
                  color="#2196f3"
                  :disabled="!items.attachmentOpenedEmail || campaignDurationExpired()"
                  :value="7"
                >
                  <template #label>
                    Opened attachment
                    {{ `(${items.attachmentOpenedEmail || 0})` }}</template
                  >
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
          <v-tooltip :disabled="!campaignDurationExpired()" nudge-bottom="-16" bottom opacity="1">
            <template #activator="{ on }">
              <div v-on="on">
                <v-checkbox
                  v-model="types"
                  id="input--campaign-manager-report-resend-no-response"
                  color="#2196f3"
                  hide-details
                  :disabled="!items.noResponseEmail || campaignDurationExpired()"
                  :value="4"
                >
                  <template #label> No response {{ `(${items.noResponseEmail || 0})` }}</template>
                </v-checkbox>
              </div>
            </template>
            <span class="tooltip-span"
              >You cannot resend this campaign because its lifetime has expired</span
            >
          </v-tooltip>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-report-resend-popup"
        confirm-button-id="btn-delete--campaign-manager-report-resend-popup"
        :action-button-text="labels.Resend"
        :confirm-button-disabled="getActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryResendDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    items: {
      type: Object
    },
    phishingScenarioName: {
      type: String
    }
  },
  inject: {
    campaignDurationExpired: {
      type: Function
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-refresh',
        title: labels.ResendCampaign
      },
      labels,
      types: []
    }
  },
  computed: {
    getActionButtonDisabled() {
      return this.isActionButtonDisabled || !this.types.length
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.types)
    }
  }
}
</script>
