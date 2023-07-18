<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    icon="mdi-message-alert"
    title="Text Message Template that will be sent to users"
    :isLoading="isFetchingSummary"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__email-template-body pb-4">
        <div class="campaign-manager-last-step__email-template-body-header">
          <div class="campaign-manager-last-step__email-template-body-header-left">
            {{ formData.name }}
          </div>
          <div class="campaign-manager-last-step__email-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              size="mini"
              :color="getBadgeColor(difficulty)"
              :text="getBadgeText(difficulty)"
              :outline="false"
            />
            <Badge
              size="mini"
              color="#E0E0E0"
              class-name="badge-middle px-2 py-2"
              :text="getBadgeText(method)"
              :outline="false"
            />
            <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
              <template #content>
                <v-icon>mdi-web</v-icon>{{ formData.languageShortCode }}
              </template>
            </Badge>
          </div>
        </div>
        <div class="campaign-manager-last-step__email-template-body-header-sub">
          <span class="font-weight-bold">Text Message:</span> {{ textTemplate }}
        </div>
        <div></div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
import { useLoading } from '@/hooks/useLoading'
import SmishingService from '@/api/smishing'
import { getDifficultyBadgeColor } from '@/utils/functions'

export default {
  name: 'CampaignManagerReportSummaryTextTemplate',
  components: {
    Badge,
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    },
    difficulties: {
      type: Array
    },
    methods: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      textTemplate: null,
      difficulty: '',
      method: ''
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  watch: {
    'formData.resourceId': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) this.callForTemplate(true)
      }
    }
  },
  methods: {
    callForTemplate(showLoader = true) {
      if (showLoader) this.setLoading(true)
      SmishingService.getTextMessageTemplate(this.formData.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.textTemplate = data.template
          this.difficulty = this.difficulties.find(
            (item) => item.value === data.difficultyResourceId
          )?.text
          this.method = this.methods.find((item) => item.value === data.categoryResourceId)?.text
        })
        .finally(() => {
          if (showLoader) this.setLoading()
        })
    },
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
