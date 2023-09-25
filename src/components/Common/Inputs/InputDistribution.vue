<template>
  <div>
    <FormGroup class="mt-6" :title="labels.Distribution" :sub-title="labels.DistributionSub">
      <div class="campaign-manager-advanced-settings__distribution-item">
        <label for="input--campaign-manager-advanced-settings-time">Sending limit per batch</label>
        <VTextField
          v-model="value.sendingLimit"
          v-mask="'###########'"
          id="input--campaign-manager-advanced-settings-sending-limit"
          class="ml-6"
          outlined
          hide-details
          placeholder="Enter number"
          style="max-width: 116px;"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        />
      </div>
      <div class="campaign-manager-advanced-settings__distribution-item gap-2 mt-3">
        <label for="input--campaign-manager-advanced-settings-time"
          >Send emails with delay every
        </label>
        <v-text-field
          v-model="value.distributionDelayEvery"
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-time"
          outlined
          class="edit-name-textfield edit-select standard-height"
          hide-details
          style="max-width: 48px;"
          :disabled="!distributionEmailOverTimeDisableStatus"
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
          :disabled="!distributionEmailOverTimeDisableStatus"
          @change="callForCalculateSendingInfo"
        />
        <label for="input--campaign-manager-advanced-settings-time">between batches</label>
      </div>
    </FormGroup>
  </div>
</template>
<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
export default {
  name: 'InputDistribution',
  components: { FormGroup, KSelect },
  props: {
    value: {
      type: Object,
      default: () => ({
        sendingLimit: 50,
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        distributionDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionDelayTimeTypeId: '1'
      })
    },
    distributionDelayTimeItems: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      labels,
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
    distributionEmailOverTimeDisableStatus() {
      return this.value.distributionTypeId === DISTRIBUTION_TYPES.PHISHING
    }
  },
  methods: {
    callForCalculateSendingInfo() {
      this.$emit('call-for-calculate-sending-info')
    }
  }
}
</script>
