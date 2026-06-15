<template>
  <div class="campaign-manager-barrel-options">
    <FormGroup
      class="campaign-manager-barrel-options__section"
      title="Double Barrel Settings"
      sub-title="Configure how the lure and payload emails are delivered for Double Barrel scenarios."
      has-hint
    >
      <div class="campaign-manager-barrel-options__field campaign-manager-barrel-options__field--order">
        <label class="campaign-manager-barrel-options__label">Send Order</label>
        <VRadioGroup
          :value="value.orderType"
          class="campaign-manager-barrel-options__radio-group mt-0 pt-0"
          hide-details
          :disabled="disabled"
          @change="update('orderType', $event)"
        >
          <VRadio
            v-for="opt in orderTypes"
            :key="opt.value"
            class="campaign-manager-barrel-options__radio"
            color="#2196f3"
            :label="opt.text"
            :value="opt.value"
          />
        </VRadioGroup>
      </div>
      <div class="campaign-manager-barrel-options__grid">
        <div class="campaign-manager-barrel-options__field">
          <label class="campaign-manager-barrel-options__label">Delay Between Emails</label>
          <KSelect
            :value="value.delayMinutes"
            :items="delayOptions"
            item-text="text"
            item-value="value"
            outlined
            dense
            hide-details
            :disabled="disabled"
            @input="update('delayMinutes', $event)"
          />
        </div>
        <div class="campaign-manager-barrel-options__field">
          <label class="campaign-manager-barrel-options__label">
            Urgent Flag
            <VTooltip top max-width="300">
              <template #activator="{ on, attrs }">
                <VIcon
                  class="campaign-manager-barrel-options__hint-icon"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information-outline
                </VIcon>
              </template>
              <span>
                Marks the email as high priority (Importance: high), shown as a red “!” in Outlook
                and similar clients. Choose which emails carry the flag.
              </span>
            </VTooltip>
          </label>
          <KSelect
            :value="value.urgentFlagType"
            :items="urgentFlagTypes"
            item-text="text"
            item-value="value"
            outlined
            dense
            hide-details
            :disabled="disabled"
            @input="update('urgentFlagType', $event)"
          />
        </div>
      </div>
      <div class="campaign-manager-barrel-options__toggles">
        <div class="campaign-manager-barrel-options__switch-row">
          <v-switch
            :input-value="value.skipPayloadIfReported"
            color="#2196f3"
            hide-details
            class="campaign-manager-barrel-options__switch"
            :disabled="disabled"
            @change="update('skipPayloadIfReported', $event)"
          />
          <div class="campaign-manager-barrel-options__switch-content">
            <div class="campaign-manager-barrel-options__switch-label">Skip payload if reported</div>
            <div class="campaign-manager-barrel-options__switch-description">
              Don't send the payload email to users who reported the lure email.
            </div>
          </div>
        </div>
        <div class="campaign-manager-barrel-options__switch-row">
          <v-switch
            :input-value="value.responsiveDelivery"
            color="#2196f3"
            hide-details
            class="campaign-manager-barrel-options__switch"
            :disabled="disabled"
            @change="update('responsiveDelivery', $event)"
          />
          <div class="campaign-manager-barrel-options__switch-content">
            <div class="campaign-manager-barrel-options__switch-label">Responsive delivery</div>
            <div class="campaign-manager-barrel-options__switch-description">
              Send the second email only to users who opened the first one.
            </div>
          </div>
        </div>
      </div>
    </FormGroup>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import {
  BARREL_ORDER_TYPES,
  BARREL_URGENT_FLAG_TYPES,
  BARREL_DELAY_MINUTE_OPTIONS,
  BARREL_DEFAULTS
} from '@/components/PhishingScenarios/utils'

export default {
  name: 'CampaignManagerBarrelOptions',
  components: { FormGroup, KSelect },
  props: {
    value: {
      type: Object,
      default: () => ({ ...BARREL_DEFAULTS })
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orderTypes: BARREL_ORDER_TYPES,
      urgentFlagTypes: BARREL_URGENT_FLAG_TYPES,
      delayOptions: BARREL_DELAY_MINUTE_OPTIONS
    }
  },
  methods: {
    update(key, val) {
      this.$emit('input', { ...this.value, [key]: val })
    }
  }
}
</script>
