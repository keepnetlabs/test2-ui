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
      <el-tabs v-show="!isLoading" v-model="tab">
        <el-tab-pane
          id="campaign-manager-info--email-content"
          name="email"
          :label="labels.JustEmail"
        >
          <div class="template-preview pt-3">
            <div class="template-preview__text" v-if="!!emailTemplate">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">From Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">From Email Address: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div>
                <span
                  class="template-preview__text--title"
                  style="
                    font-style: normal;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 24px;
                    color: #383b41;
                  "
                  >Subject:
                </span>
                <span
                  class="template-preview__text--body"
                  style="
                    font-style: normal;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 24px;
                    color: #383b41;
                  "
                  >{{ emailTemplateParams.subject }}</span
                >
              </div>
            </div>
            <div
              v-if="emailTemplateParams.attachment"
              class="attachment-wrapper mt-2"
              style="position: relative;"
            >
              <div class="attachment blue-attach mb-0">
                <AttachmentsPreview
                  :deletable="false"
                  :att="emailTemplateParams.attachment"
                  :isEmailTemplate="true"
                />
              </div>
            </div>
            <hr class="mt-2" v-if="!!emailTemplate" />
            <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="!isAttachmentBasedScenario"
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <LandingPageTemplateModalPreview
            :landingPageTemplates="landingPageTemplates"
            :phishingUrl="landingPageParams.urlTemplate"
          />
        </el-tab-pane>
      </el-tabs>
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
import { getCampaignManagerPreview } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'

export default {
  name: 'CampaignManagerPreview',
  components: {
    AttachmentsPreview,
    KEmailPreview,
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
      emailTemplateParams: {},
      landingPageParams: {},
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: ''
    }
  },
  computed: {
    getTitle() {
      return 'Campaign Template Preview'
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
          const { data: { data: { phishingScenarioPreviewDto } = {} } = {} } = response
          const { landingPageTemplate: landingPage, methodTypeId } =
            phishingScenarioPreviewDto || {}
          this.isAttachmentBasedScenario = methodTypeId === 3
          this.emailTemplate = phishingScenarioPreviewDto?.emailTemplate?.template || ''
          this.emailTemplateParams = {
            name: phishingScenarioPreviewDto?.emailTemplate?.name || '',
            fromName: phishingScenarioPreviewDto?.emailTemplate?.fromName || '',
            fromAddress: phishingScenarioPreviewDto?.emailTemplate?.fromAddress || '',
            subject: phishingScenarioPreviewDto?.emailTemplate?.subject || '',
            attachment: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
              ? {
                  name: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
                }
              : null
          }
          this.landingPageTemplates = landingPage?.landingPages || []
          this.landingPageParams = {
            name: landingPage?.name || '',
            description: landingPage?.description || '',
            urlTemplate: landingPage?.urlTemplate || ''
          }
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
    }
  }
}
</script>
