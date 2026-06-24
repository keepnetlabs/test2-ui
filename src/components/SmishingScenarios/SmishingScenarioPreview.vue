<template>
  <SmishingPreviewDrawer
    :status="status"
    :title="getTitle"
    @on-close="handleClose"
  >
    <div class="smishing-scenario-preview">
      <!-- Scenario name row: parity with CommonSimulatorPreviewDialog (bordered bar + edit) -->
      <div
        v-if="selectedRow"
        class="d-flex align-center justify-space-between mt-4 mb-1"
        style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
      >
        <div class="pr-2" style="min-width: 0;">
          <span class="text-primary-color fs-5 fw-600 text-truncate d-block">{{
            scenarioDisplayName
          }}</span>
        </div>
        <div v-if="showEditButton" class="d-flex align-center flex-shrink-0">
          <VTooltip bottom>
            <template #activator="{ on }">
              <div v-on="on">
                <VBtn
                  icon
                  outlined
                  color="#2196F3"
                  small
                  aria-label="Edit scenario"
                  @click="handleEditScenario"
                >
                  <VIcon small>mdi-pencil</VIcon>
                </VBtn>
              </div>
            </template>
            <span>Edit</span>
          </VTooltip>
        </div>
      </div>
      <SmishingPreviewSkeleton
        v-if="isLoading"
        variant="scenario"
        hide-scenario-name-bar
        class="smishing-scenario-preview__skeleton"
      />
      <ElTabs v-else v-model="tab" class="smishing-scenario-preview__main-tabs">
        <ElTabPane
          id="campaign-manager-info--email-content"
          name="textMessage"
          label="Text Message"
        >
          <!-- Same as CommonSimulatorPreviewDialog email tab: template name above card, content in bordered container (EmailTemplateMultipleLanguagePreviewDialog parity) -->
          <div class="email-template-preview">
            <div
              v-if="textTemplateParams.name"
              class="text-primary-color fs-4 fw-600 mb-2 mt-n4"
            >
              {{ textTemplateParams.name }}
            </div>
            <div class="email-template-preview__container">
              <div class="common-simulator-preview__text">
                <div v-if="!!textTemplate" class="template-preview__text">
                  <span class="template-preview__text--title">Text Message</span>
                  <span class="template-preview__text--body d-block mt-0">{{
                    textTemplateParams.template
                  }}</span>
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
            :isMethodMfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
            :is-phishing-scenario="false"
            :is-smishing="true"
            :can-fix-domain="true"
            show-landing-url-open-button
            @domain-fixed="onDomainFixed"
          />
        </ElTabPane>
      </ElTabs>
    </div>
  </SmishingPreviewDrawer>
</template>

<script>
import SmishingPreviewDrawer from '@/components/Common/Simulator/SmishingPreviewDrawer.vue'
import SmishingService from '@/api/smishing'
import labels from '@/model/constants/labels'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import SmishingPreviewSkeleton from '@/components/SkeletonLoading/SmishingPreviewSkeleton.vue'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings'

export default {
  name: 'SmishingScenarioPreview',
  components: {
    SmishingPreviewSkeleton,
    SmishingPreviewDrawer,
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
      isMethodMfa: false,
      selectedLandingPageIndex: 0,
      textTemplateParams: {},
      landingPageParams: {},
      tab: 'textMessage',
      isLoading: false,
      labels,
      timeoutId: ''
    }
  },
  computed: {
    getTitle() {
      return 'Smishing Scenario Preview'
    },
    /** Same rule as CommonSimulatorPreviewDialog.showEditButton */
    showEditButton() {
      return !this.selectedRow || this.selectedRow.isOwner !== false
    },
    scenarioDisplayName() {
      return this.selectedRow?.name || ''
    },
    hasLandingPageTemplate() {
      return this.landingPageTemplates.length > 0
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.selectedLandingPageIndex]?.content
    },
    hasNextTemplate() {
      return this.landingPageTemplates.length - 1 > this.selectedLandingPageIndex
    },
    hasPreviousTemplate() {
      return this.selectedLandingPageIndex > 0
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    onDomainFixed(info = {}) {
      // Template domain updated globally → reflect the new clean URL immediately.
      if (info.urlTemplate && this.landingPageParams) {
        this.landingPageParams.urlTemplate = info.urlTemplate
      }
    },
    callForData() {
      this.setLoading(true)
      SmishingService.previewSmishingScenario(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { textTemplate, landingPageTemplate } = data
          const { template, name, difficultyResourceId } = textTemplate || {}

          this.textTemplateParams = {
            name,
            template,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text
          }
          this.textTemplate = template

          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId,
            resourceId: landingPageResourceId
          } = landingPageTemplate || []

          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            resourceId: landingPageResourceId,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            isAttachmentBasedTemplate: methodTypeId === 3,
            mfaTextTemplate: data.mfaTextTemplate,
            mfaSmsSenderNumber: data.mfaSmsSenderNumber
          }
          this.landingPageTemplates = landingPages
          this.isMethodMfa = data.methodTypeId === 4
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleEditScenario() {
      this.$emit('on-edit')
    },
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    }
  }
}
</script>
