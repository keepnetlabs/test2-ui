<template>
  <AppDialog
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs
        v-if="!isLoading"
        v-model="selectedScenario"
        class="campaign-manager-last-step__phishing-scenario-tab mb-6"
        @tab-click="callForScenarioDetail"
      >
        <ElTabPane
          v-for="(template, index) in phishingScenarios"
          :key="index"
          :name="template.name"
          :label="template.name"
        />
      </ElTabs>
      <ElTabs v-if="!isLoading" v-model="tab" class="k-sub-tab">
        <ElTabPane
          id="campaign-manager-info--text-message-content"
          name="textMessage"
          label="Text Message"
        >
          <div class="template-preview pt-6">
            <div v-if="!!textTemplate" class="template-preview__text">
              <div class="mb-1 d-flex flex-column">
                <span class="template-preview__text--body">{{
                  textMessageTemplateParams.textMessage
                }}</span>
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
            :is-method-mfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
          />
        </ElTabPane>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--close-campaign-manager-preview-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import SmishingService from '@/api/smishing'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings'

export default {
  name: 'CampaignManagerPreview',
  components: {
    DatatableLoading,
    AppDialog,
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
          const { data: { data: { smishingScenarioPreviewList } = [] } = {} } = response
          this.phishingScenarios = smishingScenarioPreviewList
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
        name: phishingScenarioPreviewDto?.textTemplate?.name || '',
        textMessage: phishingScenarioPreviewDto?.textTemplate?.template
      }
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      this.landingPageParams = {
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || '',
        mfaTextTemplate: phishingScenarioPreviewDto?.mfaTextTemplate,
        mfaSmsSenderNumber: phishingScenarioPreviewDto?.mfaSmsSenderNumber
      }
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[event.index])
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
