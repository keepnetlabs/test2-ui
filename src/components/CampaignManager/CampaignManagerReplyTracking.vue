<template>
  <div
    :class="[
      'campaign-manager-reply-tracking',
      !value.isEnabled ? 'campaign-manager-reply-tracking--disabled' : ''
    ]"
  >
    <FormGroup :title="labels.ReplyTracking" :sub-title="labels.ReplyTrackingSub">
      <template #title>
        <div class="campaign-manager-reply-tracking__title">
          <label for="campaign-manager-reply-tracking__switch" class="k-form-group__title">
            {{ labels.ReplyTracking }}
          </label>
          <VSwitch
            id="campaign-manager-reply-tracking__switch"
            v-model="value.isEnabled"
            hide-details
            color="#2196f3"
          />
        </div>
      </template>
      <div
        :class="[
          'campaign-manager-reply-tracking__content',
          !value.isEnabled ? 'campaign-manager-reply-tracking__content--disabled' : ''
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
            :rules="value.isEnabled ? subdomainRules : []"
            :disabled="!value.isEnabled"
            @input="handleDomainChange"
          />
          <span class="campaign-manager-reply-tracking__content-span">@</span>
          <KSelect
            v-model.trim="value.domain"
            type="autocomplete"
            outlined
            dense
            placeholder="example.com"
            :items="domainItems"
            :rules="value.isEnabled ? domainRules : []"
            :disabled="!value.isEnabled"
          />
        </div>
        <div>
          <VCheckbox
            v-model="value.isSaveContentEnabled"
            hide-details
            :ripple="false"
            class="pt-1"
            color="#2196f3"
            label="Save reply email content for review"
            :disabled="!value.isEnabled"
            @click.stop
          />
        </div>
        <div v-if="false">
          <VCheckbox
            v-model="value.isOutOfOfficeEnabled"
            hide-details
            :ripple="false"
            color="#2196f3"
            label="Save out of office auto reply content for review"
            :disabled="!value.isEnabled"
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
import { getDomainsList } from '@/api/domains'
import { getDefaultAxiosPayload } from '@/utils/functions'
export default {
  name: 'CampaignManagerReplyTracking',
  components: { KSelect, FormGroup },
  props: {
    value: {
      type: Object,
      default() {
        return {
          isEnabled: false,
          subDomain: '',
          domain: '',
          isSaveContentEnabled: false,
          isOutOfOfficeEnabled: false
        }
      }
    }
  },
  data() {
    return {
      labels,
      domainItems: [],
      axiosPayload: getDefaultAxiosPayload({ pageSize: 1000 }),
      subdomainRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlacklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ],
      domainRules: [(v) => Validations.required(v, labels.Required)]
    }
  },
  created() {
    this.callForDomains()
  },
  methods: {
    callForDomains() {
      getDomainsList(this.axiosPayload).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response || {}
        this.domainItems = results.map(({ domain }) => ({
          text: domain,
          value: domain
        }))
      })
    },
    handleDomainChange(subDomain) {
      this.$emit('input', { ...this.value, subDomain })
    }
  }
}
</script>
