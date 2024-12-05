<template>
  <div class="campaign-manager-reply-tracking">
    <FormGroup :title="labels.ReplyTracking" :sub-title="labels.ReplyTrackingSub">
      <template #title>
        <div class="campaign-manager-reply-tracking__title">
          <label class="k-form-group__title">
            {{ labels.ReplyTracking }}
          </label>
          <VSwitch v-model="value.isReplyTracking" hide-details color="#2196f3" />
        </div>
      </template>
      <div
        :class="[
          'campaign-manager-reply-tracking__content',
          !value.isReplyTracking ? 'campaign-manager-reply-tracking__content--disabled' : ''
        ]"
      >
        <div>
          <VTextField
            :value="value.subDomain"
            ref="refSubdomain"
            required
            placeholder="Enter custom address"
            outlined
            dense
            :rules="value.isReplyTracking && subdomainRules"
            :disabled="!value.isReplyTracking"
            @input="handleDomainChange"
          />
          <span class="campaign-manager-reply-tracking__content-span">@</span>
          <KSelect
            v-model.trim="value.domain"
            outlined
            dense
            placeholder="example.com"
            :items="domainItems"
            :rules="value.isReplyTracking && domainRules"
            :disabled="!value.isReplyTracking"
          />
        </div>
        <div>
          <VCheckbox
            v-model="value.isSaveForReview"
            hide-details
            :ripple="false"
            class="pt-1"
            color="#2196f3"
            label="Save reply email content for review"
            :disabled="!value.isReplyTracking"
            @click.stop
          />
        </div>
        <div>
          <VCheckbox
            v-model="value.isSaveOutOfOfficeForReview"
            hide-details
            :ripple="false"
            color="#2196f3"
            label="Save out of office auto reply content for review"
            :disabled="!value.isReplyTracking"
            @click.stop
          />
        </div>
      </div>
    </FormGroup>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
export default {
  name: 'CampaignManagerReplyTracking',
  components: { KSelect, FormGroup },
  props: {
    value: {
      type: Object,
      default() {
        return {
          isReplyTracking: false,
          subDomain: '',
          domain: '',
          isSaveForReview: false,
          isSaveOutOfOfficeForReview: false
        }
      }
    }
  },
  data() {
    return {
      labels,
      domainItems: [],
      subdomainRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlacklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ],
      domainRules: [(v) => Validations.required(v, labels.Required)]
    }
  },
  methods: {
    handleDomainChange(subDomain) {
      this.$emit('input', { ...this.value, subDomain })
    }
  }
}
</script>
