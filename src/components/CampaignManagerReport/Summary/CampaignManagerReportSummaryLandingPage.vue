<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="$domain"
    detailable-button-id="btn-preview--campaign-report-landing-page-template"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowLandingPageTemplate"
    :title="getTitle"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__landing-page-template-body pb-4">
        <ElTabs v-if="templates.length > 1" v-model="selectedTab">
          <ElTabPane
            v-for="(template, index) in templates"
            :key="index"
            :name="`${index + 1}`"
            :label="`Page ${index + 1}`"
          >
            <div class="campaign-manager-last-step__landing-page-template-body-header">
              <div class="campaign-manager-last-step__landing-page-template-body-header-left">
                <div class="campaign-manager-last-step__email-template-body-header-left">
                  <span>{{ name || formData.name }}</span>
                  <VTooltip v-if="isAssistedByAI || formData.isAssistedByAI" bottom>
                    <template #activator="{ on }">
                      <VIcon v-on="on" class="ml-1" color="#2196F3" small>mdi-creation</VIcon>
                    </template>
                    <span>This template was generated with AI</span>
                  </VTooltip>
                </div>
              </div>
              <div class="campaign-manager-last-step__landing-page-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(difficulty || formData.difficulty)"
                  :text="getBadgeText(difficulty || formData.difficulty)"
                  :outline="false"
                />
                <Badge
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(method || formData.method)"
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
              <span class="campaign-manager-last-step__landing-page-template-body-header-left-url"
                >{{ getLandingPageUrlText }}:</span
              >
              {{ urlTemplate || formData.urlTemplate }}
            </div>
          </ElTabPane>
        </ElTabs>
        <div v-else>
          <div class="campaign-manager-last-step__landing-page-template-body-header">
            <div class="campaign-manager-last-step__landing-page-template-body-header-left">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                <span>{{ name || formData.name }}</span>
                <VTooltip v-if="isAssistedByAI || formData.isAssistedByAI" bottom>
                  <template #activator="{ on }">
                    <VIcon v-on="on" color="#2196F3" class="ml-1" small>mdi-creation</VIcon>
                  </template>
                  <span>This template was generated with AI</span>
                </VTooltip>
              </div>
            </div>
            <div class="campaign-manager-last-step__landing-page-template-body-header-right">
              <v-btn style="display: none;"></v-btn>
              <Badge
                size="mini"
                :color="getBadgeColor(difficulty || formData.difficulty)"
                :text="getBadgeText(difficulty || formData.difficulty)"
                :outline="false"
              />
              <Badge
                size="mini"
                color="#E0E0E0"
                class-name="badge-middle px-2 py-2"
                :text="getBadgeText(method || formData.method)"
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
            <span class="campaign-manager-last-step__landing-page-template-body-header-left-url"
              >{{ getLandingPageUrlText }}:</span
            >
            {{ urlTemplate || formData.urlTemplate }}
          </div>
        </div>
      </div>
      <div
        v-if="isShowLandingPageTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview
            v-else
            ref="refPreview"
            :key="getCurrentTemplate"
            :html="previewHtml"
            is-extra-height
            is-landing-page
            :is-red-flagged-template="isRedFlaggedTemplate"
          />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import Badge from '@/components/Badge'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import { useLoading } from '@/hooks/useLoading'
import { getCampaignManagerLandingPageTemplatePreviewContent } from '@/api/landingPage'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { getDifficultyBadgeColor } from '@/utils/functions'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'CampaignManagerReportSummaryLandingPage',
  components: {
    DatatableLoading,
    KEmailPreview,
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
      type: Array,
      default: () => []
    },
    methods: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      selectedTab: '1',
      labels,
      isShowLandingPageTemplate: false,
      templates: [],
      name: '',
      urlTemplate: '',
      method: '',
      difficulty: '',
      isAssistedByAI: false
    }
  },
  computed: {
    getTitle() {
      return this.type === SCENARIO_TYPES.PHISHING
        ? labels.LandingPageWhoUsers
        : labels.LandingPageWhoQuishing
    },
    isFormData() {
      return Object.keys(this.formData || {}).length
    },
    getCurrentTemplate() {
      return this.templates?.length > 1
        ? this.templates?.[parseInt(this.selectedTab) - 1]?.content || ''
        : this.templates?.[0]?.content || ''
    },
    isRedFlaggedTemplate() {
      const html = this.getCurrentTemplate || ''
      return typeof html === 'string' && html.includes('data-redflag')
    },
    previewHtml() {
      const html = this.getCurrentTemplate || ''
      if (this.isRedFlaggedTemplate && typeof html === 'string') {
        const logo =
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl || ''
        return html.replace(/\{COMPANYLOGO\}/g, logo)
      }
      return html
    },
    getLandingPageUrlText() {
      return this.type === SCENARIO_TYPES.PHISHING ? labels.PhishingURL : labels.QuishingURL
    }
  },
  watch: {
    formData: {
      handler(fd) {
        if (fd?.landingPageTemplates) {
          this.templates = fd.landingPageTemplates
        } else if (fd?.resourceId && fd?.jobResourceId) {
          this.callForTemplate(fd.resourceId, fd.jobResourceId, fd.instanceGroup)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    callForTemplate(resourceId = '', jobResourceId = '', instanceGroup = '') {
      if (this.isFetchingSummary) {
        this.setLoading(true)
      }
      getCampaignManagerLandingPageTemplatePreviewContent(resourceId, jobResourceId, instanceGroup)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.templates = data?.landingPages || []
          this.name = data?.name || ''
          this.urlTemplate = data?.urlTemplate || ''
          this.method = this.methods[data.methodTypeId - 1].text
          this.difficulty = this.difficulties[data.difficultyTypeId - 1].text
          this.isAssistedByAI = data?.isAssistedByAI || data?.isAssistedbyAI
        })
        .finally(this.setLoading)
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
