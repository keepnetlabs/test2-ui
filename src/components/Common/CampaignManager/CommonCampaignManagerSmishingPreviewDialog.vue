<template>
  <CommonCampaignManagerPreviewFrame
    :status="status"
    :title="getTitle"
    :campaign-name="getSubtitle"
    :loading="isLoading"
    @on-close="$emit('on-close')"
    @edit-campaign="handleEditCampaign"
  >
    <template #loading>
      <SmishingPreviewSkeleton variant="campaign" />
    </template>
    <div class="smishing-campaign-preview">
      <ElTabs
        v-model="selectedScenario"
        class="campaign-manager-last-step__phishing-scenario-tab campaign-manager-last-step__phishing-scenario-tab--wide mb-4"
        @tab-click="callForScenarioDetail"
      >
        <ElTabPane
          v-for="template in phishingScenarios"
          :key="template.customKey"
          :name="template.name"
          :label="template.name"
        />
      </ElTabs>
      <ElTabs v-model="tab" class="k-sub-tab">
        <ElTabPane
          id="campaign-manager-info--text-message-content"
          name="textMessage"
          label="Text Message"
        >
          <!-- Same vertical rhythm as SmishingScenarioPreview (landing parity: tight under tabs) -->
          <div class="email-template-preview">
            <div
              v-if="textMessageTemplateParams.name"
              class="text-primary-color fs-4 fw-600 mb-2 mt-n4"
            >
              {{ textMessageTemplateParams.name }}
            </div>
            <div class="email-template-preview__container">
              <div class="common-simulator-preview__text">
                <div v-if="!!textTemplate" class="template-preview__text">
                  <span class="template-preview__text--title">Text Message</span>
                  <span class="template-preview__text--body d-block mt-0">{{ textTemplate }}</span>
                </div>
              </div>
            </div>
          </div>
        </ElTabPane>
      <ElTabPane
        :label="labels.LandingPage"
        name="landing-page"
        id="campaign-manager-info--landing-content"
      >
        <TabsWithMfaSettings
          class="tabs-with-mfa-settings"
          preview-layout="simulator"
          :flush-drawer-align="true"
          :is-method-mfa="isMethodMfa"
          :landing-page-params="landingPageParams"
          :landing-page-templates="landingPageTemplates"
          :is-phishing-scenario="false"
          :is-smishing="true"
          show-landing-url-open-button
        />
      </ElTabPane>
    </ElTabs>
    </div>
  </CommonCampaignManagerPreviewFrame>
</template>

<script>
import CommonCampaignManagerPreviewFrame from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewFrame.vue'
import SmishingPreviewSkeleton from '@/components/SkeletonLoading/SmishingPreviewSkeleton.vue'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings'
import SmishingService from '@/api/smishing'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'CommonCampaignManagerSmishingPreviewDialog',
  components: {
    CommonCampaignManagerPreviewFrame,
    SmishingPreviewSkeleton,
    TabsWithMfaSettings
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      textTemplate: null,
      landingPageTemplates: [],
      textMessageTemplateParams: {},
      landingPageParams: {},
      tab: 'textMessage',
      isLoading: false,
      labels,
      timeoutId: '',
      selectedScenario: null,
      phishingScenarios: [],
      isMethodMfa: false
    }
  },
  computed: {
    getTitle() {
      return 'Smishing Campaign Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForData() {
      this.setLoading(true)
      SmishingService.previewSmishingCampaign(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data: { smishingScenarioPreviewList = [] } = {} } = {} } = response
          this.phishingScenarios = smishingScenarioPreviewList.map((scenario) => ({
            ...scenario,
            customKey: createRandomCryptStringNumber()
          }))
          const phishingScenarioPreviewDto = smishingScenarioPreviewList[0] || {}
          this.selectedScenario = phishingScenarioPreviewDto.name
          this.setActiveScenario(phishingScenarioPreviewDto || {})
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setActiveScenario(phishingScenarioPreviewDto = {}) {
      this.isMethodMfa = phishingScenarioPreviewDto?.methodTypeId?.toString() === '4'
      this.textTemplate = phishingScenarioPreviewDto?.textTemplate?.template || ''
      this.textMessageTemplateParams = {
        name: phishingScenarioPreviewDto?.textTemplate?.name || ''
      }
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      this.landingPageParams = {
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || '',
        mfaTextTemplate: phishingScenarioPreviewDto?.mfaTextTemplate,
        mfaSmsSenderNumber: phishingScenarioPreviewDto?.mfaSmsSenderNumber,
        isAssistedByAI:
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedByAI ||
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedbyAI
      }
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[event.index])
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleEditCampaign() {
      this.$emit('on-edit-campaign', this.selectedRow)
    }
  }
}
</script>
