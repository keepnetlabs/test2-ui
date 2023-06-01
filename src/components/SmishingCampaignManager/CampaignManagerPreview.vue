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
            <div v-if="!!emailTemplate" class="template-preview__text">
              <div class="mb-1 d-flex flex-column">
                <span class="template-preview__text--title mb-1">Text Message</span>
                <span class="template-preview__text--body">{{
                  textMessageTemplateParams.textMessage
                }}</span>
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane
          v-if="!isAttachmentBasedScenario"
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <LandingPageTemplateModalPreview
            :landingPageTemplates="landingPageTemplates"
            :phishingUrl="landingPageParams.urlTemplate"
            :template-name="textMessageTemplateParams.name"
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
// TODO: Import smishing endpoints
import { getCampaignManagerPreview } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'

export default {
  name: 'CampaignManagerPreview',
  components: {
    DatatableLoading,
    AppDialog,
    LandingPageTemplateModalPreview
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
      isAttachmentBasedScenario: false,
      emailTemplate: null,
      landingPageTemplates: [],
      textMessageTemplateParams: {},
      landingPageParams: {},
      tab: 'textMessage',
      isLoading: false,
      labels,
      timeoutId: '',
      selectedScenario: null,
      phishingScenarios: []
    }
  },
  computed: {
    getTitle() {
      return 'Smishing Campaign Preview'
    },
    getSubtitle() {
      return this.selectedRow.name || ''
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
      getCampaignManagerPreview(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data: { phishingScenarioPreviewList } = [] } = {} } = response
          this.phishingScenarios = phishingScenarioPreviewList
          const phishingScenarioPreviewDto = phishingScenarioPreviewList[0] || {}
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
      this.isAttachmentBasedScenario = phishingScenarioPreviewDto.methodTypeId === 3
      this.emailTemplate = phishingScenarioPreviewDto?.emailTemplate?.template || ''
      this.textMessageTemplateParams = {
        name: phishingScenarioPreviewDto?.emailTemplate?.name || '',
        fromName: phishingScenarioPreviewDto?.emailTemplate?.fromName || '',
        fromAddress: phishingScenarioPreviewDto?.emailTemplate?.fromAddress || '',
        subject: phishingScenarioPreviewDto?.emailTemplate?.subject || '',
        attachment: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
          ? {
              name: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
            }
          : null,
        textMessage:
          phishingScenarioPreviewDto?.textMessage ||
          'Please confirm your Microsoft account. {PHISHING_LINK}'
      }
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      this.landingPageParams = {
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || ''
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
