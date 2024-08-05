<template>
  <Fragment>
    <CampaignManagerSenderPhoneNumbersModal
      v-if="isSenderPhoneNumbersModalVisible"
      :status="isSenderPhoneNumbersModalVisible"
      :phoneNumbers="getPhoneNumbers"
      @on-close="handleCloseSenderPhoneNumbersModal"
    />
    <CampaignManagerSummaryCard
      :isLoading="isLoading"
      icon="mdi-send"
      title="Message Sending"
      :items="items"
    >
      <template #body="{ items }">
        <div class="campaign-manager-summary-card__body">
          <div class="campaign-manager-summary-card__body-container">
            <div
              v-for="(val, key) in items"
              :key="key"
              class="campaign-manager-summary-card__body-item"
            >
              <div
                v-if="key === 'Sender Phone Number'"
                class="campaign-manager-summary-card__body-item-key"
              >
                {{ val.length > 1 ? "Sender Phone Numbers" : "Sender Phone Number" }}
              </div>
              <div v-else class="campaign-manager-summary-card__body-item-key">
                {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
              </div>
              <div
                v-if="key === 'Sending Status'"
                class="campaign-manager-summary-card__body-item-value"
                style="display: flex; align-items: center;"
              >
                <span :style="isNotDelivered && { borderRight: '1px solid #e0e0e0' }"
                  >{{ getDeliveryValue }}
                </span>
                <template v-if="isNotDelivered">
                  <span style="color: #b83a3a; font-weight: 600; font-size: 14px;">
                    <v-icon style="margin-top: -2px;" small class="ml-2" color="#B83A3A"
                      >mdi-alert-circle</v-icon
                    >
                    <span>
                      {{ getNotDeliveredValue }}
                    </span>
                  </span>
                </template>
              </div>
              <div v-else-if="key === 'Sender Phone Number'">
                <div
                  v-if="Array.isArray(val) && val.length > 1"
                  class="campaign-manager-summary-card__body-item-value"
                >
                  <div class="d-flex align-center">
                    <span style="color: #2196f3; font-weight: 600;">Multiple phone numbers</span>
                    <v-btn class="ml-1" icon @click="handleSenderPhoneNumbersClick">
                      <v-icon center size="20" color="#2196F3">mdi-eye</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div v-else class="campaign-manager-summary-card__body-item-value">
                  {{ val[0] }}
                </div>
              </div>
              <div v-else class="campaign-manager-summary-card__body-item-value">
                {{ val }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </Fragment>
</template>

<script>
import CampaignManagerSummaryCard from "@/components/CampaignManager/Summary/CampaignManagerSummaryCard";
import labels from "@/model/constants/labels";
import CampaignManagerSenderPhoneNumbersModal from "@/components/SmishingCampaignManager/CampaignManagerSenderPhoneNumbersModal";
import { Fragment } from "vue-frag";

export default {
  name: "CampaignManagerReportSMSDelivery",
  components: { Fragment, CampaignManagerSummaryCard, CampaignManagerSenderPhoneNumbersModal },
  props: {
    items: {
      type: Object,
    },
    helperData: {
      type: Object,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSenderPhoneNumbersModalVisible: false,
      labels,
    };
  },
  computed: {
    isNotDelivered() {
      return !!(this.helperData?.smsNotDeliveredUserCount || 0);
    },
    getDeliveryValue() {
      const { smsDeliveredUserCount = 0, totalTargetUserCount = 0 } = this.helperData;
      return `${smsDeliveredUserCount} / ${totalTargetUserCount} sent`;
    },
    getNotDeliveredValue() {
      const { smsNotDeliveredUserCount = "" } = this.helperData;
      return `${smsNotDeliveredUserCount} not delivered`;
    },
    getPhoneNumbers() {
      return this.helperData?.phoneNumbers || [];
    },
  },
  methods: {
    handleSenderPhoneNumbersClick() {
      this.isSenderPhoneNumbersModalVisible = true;
    },
    handleCloseSenderPhoneNumbersModal() {
      this.isSenderPhoneNumbersModalVisible = false;
    },
  },
};
</script>
