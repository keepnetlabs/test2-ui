<template>
  <div>
    <FormGroup
      class="mt-6 input-distribution"
      :title="labels.Distribution"
      :sub-title="getDistributionSubtitle"
    >
      <VRadioGroup
        v-model="value.distributionStartTypeId"
        class="mt-2 mb-3 pt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <VRadio
          :id="`input--campaign-manager-radio-distribution-to`"
          class="mb-0"
          color="#2196f3"
          :label="getFirstRadioLabel"
          :value="1"
        />
        <VRadio
          :id="`input--campaign-manager-radio-distribution-to`"
          class="mb-0 mt-4"
          color="#2196f3"
          :label="getSecondRadioLabel"
          :value="2"
        />
      </VRadioGroup>
      <div
        v-if="isRenderDistributionStartScheduled"
        class="input-distribution__distribution-start-container"
      >
        <div class="vishing-campaign-modal__send-calls-on gap-2">
          <div>
            <div class="fs-medium mt-2">{{ getDistributionFirstText }}</div>
          </div>
          <div class="vishing-campaign-modal__send-calls-on__days d-flex gap-2">
            <VCheckbox
              v-for="day in sendCallsOnDaysOptionsShort"
              v-model="value.sendCallsOnDays"
              color="#2196F3"
              :label="day.text"
              :value="day.value"
              :key="day.value"
            />
          </div>
        </div>
        <div class="vishing-campaign-modal__send-calls mb-0 mt-2 gap-2">
          <span class="fs-medium">{{ getDistributionSecondText }}</span>
          <div
            :class="[!value.distributionStartTime && 'date-picker-error']"
            style="position: relative;"
          >
            <el-time-select
              v-model="value.distributionStartTime"
              style="max-width: 116px;"
              placeholder="Start time"
              :picker-options="{
                start: '09:00',
                end: '17:00',
                maxTime: value.distributionEndTime
              }"
            />
          </div>
          <span class="fs-medium">and</span>
          <div
            :class="[!value.distributionEndTime && 'date-picker-error']"
            style="position: relative;"
          >
            <el-time-select
              v-model="value.distributionEndTime"
              style="max-width: 116px;"
              placeholder="End time"
              :picker-options="{
                start: '09:00',
                end: '17:00',
                minTime: value.distributionStartTime
              }"
            />
          </div>
          <span v-if="!!selectedTimeZoneText" class="fs-medium">in</span>
          <span
            v-if="!!selectedTimeZoneText"
            class="form-group-horizontal-content__label fs-medium"
          >
            {{ selectedTimeZoneText }}
          </span>
        </div>
      </div>
      <div
        :class="[
          'campaign-manager-advanced-settings__distribution-item',
          isSendingLimitValid ? 'mb-2' : 'mb-6'
        ]"
      >
        <label for="input--campaign-manager-advanced-settings-time">{{
          getDistributionThirdText
        }}</label>
        <div style="position: relative;">
          <VTextField
            ref="refSendingLimit"
            v-model="value.sendingLimit"
            v-mask="'###########'"
            id="input--campaign-manager-advanced-settings-sending-limit"
            class="ml-6"
            outlined
            hide-details
            placeholder="Enter number"
            style="max-width: 116px;"
            :error="!isSendingLimitValid"
            @input="callForCalculateSendingInfo"
          />
          <CustomError
            v-if="!isSendingLimitValid"
            class="ml-6"
            style="position: absolute; bottom: -16px; width: 500px;"
            :is-valid="isSendingLimitValid"
            :error-message="sendingLimitErrorText"
          />
        </div>
      </div>
      <div class="campaign-manager-advanced-settings__distribution-item gap-2">
        <label for="input--campaign-manager-advanced-settings-time"
          >{{ getDistributionFourthText }}
        </label>
        <v-text-field
          v-model="value.distributionDelayEvery"
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-time"
          outlined
          class="edit-name-textfield edit-select standard-height"
          hide-details
          style="max-width: 48px;"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        ></v-text-field>
        <KSelect
          v-model.trim="value.distributionDelayTimeTypeId"
          id="input--campaign-manager-advanced-settings-time-type"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="distributionDelayTimeItems"
          @change="callForCalculateSendingInfo"
        />
        <label
          v-if="type === DISTRIBUTION_TYPES.PHISHING"
          for="input--campaign-manager-advanced-settings-time fs-medium"
          >between batches</label
        >
      </div>
      <div
        v-if="type === DISTRIBUTION_TYPES.PHISHING && isRenderDistributionStartScheduled"
        class="campaign-manager-advanced-settings__distribution-info"
      >
        Please visit
        <a href="https://doc.keepnetlabs.com" target="_blank">doc.keepnetlabs.com</a> to get more
        information about Distribution.
      </div>
    </FormGroup>
  </div>
</template>
<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import {
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES
} from '@/components/SmishingCampaignManager/utils'
import { sendCallsOnDaysOptionsShort } from '@/components/VishingCampaignManager/utils'
import CustomError from '@/components/CustomError'

export default {
  name: 'InputDistribution',
  components: { FormGroup, KSelect, CustomError },
  props: {
    value: {
      type: Object,
      default: () => ({
        sendingLimit: 50,
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        distributionDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW,
        distributionEmailOver: 8,
        distributionDelayTimeTypeId: '1',
        sendCallsOnDays: [1, 2, 4, 8, 16],
        distributionStartTime: '09:00',
        distributionEndTime: '17:00'
      })
    },
    distributionDelayTimeItems: {
      type: Array,
      default() {
        return []
      }
    },
    selectedTimeZoneText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: DISTRIBUTION_TYPES.PHISHING
    }
  },
  data() {
    return {
      isSendingLimitValid: true,
      sendingLimitErrorText: '',
      DISTRIBUTION_TYPES,
      labels,
      sendCallsOnDaysOptionsShort,
      rules: {
        number: [
          (v) => Validations.required(v, 'Enter a number higher than 0'),
          (v) => Validations.startsWith(v, 'Cannot start with 0', '0'),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      }
    }
  },
  computed: {
    getDistributionSubtitle() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? labels.DistributionSub
        : labels.DistributionSubSmishing
    },
    getFirstRadioLabel() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? 'Send emails when the campaign starts'
        : 'Send text messages when the campaign starts'
    },
    getSecondRadioLabel() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? 'Send emails on defined days and hours'
        : 'Send text messages on defined days and hours'
    },
    getDistributionFirstText() {
      return this.type === DISTRIBUTION_TYPES.PHISHING ? 'Send emails on' : 'Send text messages on'
    },
    getDistributionSecondText() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? 'Send emails between'
        : 'Send text messages between'
    },
    getDistributionThirdText() {
      return this.type === DISTRIBUTION_TYPES.PHISHING ? 'Sending limit per batch' : 'Sending Limit'
    },
    getDistributionFourthText() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? 'Send emails with delay every'
        : 'Send SMS with delay every'
    },
    isRenderDistributionStartScheduled() {
      return this.value.distributionStartTypeId === DISTRIBUTION_START_TYPES.SCHEDULED
    }
  },
  watch: {
    'value.sendingLimit': {
      immediate: true,
      handler(val) {
        if (val <= 0) {
          this.isSendingLimitValid = false
          this.sendingLimitErrorText = `Enter a number higher than 0.`
          return
        }
        if (String(val).startsWith('0')) {
          this.isSendingLimitValid = false
          this.sendingLimitErrorText = `Cannot start with 0.`
          return
        }
        if (val > 1000000) {
          this.isSendingLimitValid = false
          this.sendingLimitErrorText = `Sending limit has exceeded 999,999. Please reduce the sending limit.`
          return
        }
        this.isSendingLimitValid = true
        this.sendingLimitErrorText = ''
      }
    }
  },
  methods: {
    callForCalculateSendingInfo() {
      this.$emit('call-for-calculate-sending-info')
    }
  }
}
</script>
