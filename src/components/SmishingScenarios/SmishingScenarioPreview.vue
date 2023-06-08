<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <el-tabs v-show="!isLoading" v-model="tab">
        <el-tab-pane
          id="campaign-manager-info--email-content"
          name="textMessage"
          label="Text Message"
        >
          <div class="template-preview pt-4">
            <div class="template-preview__text" v-if="!!textTemplate">
              <span class="template-preview__text--body">{{ textTemplateParams.template }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <LandingPageTemplateModalPreview
            :templateName="landingPageParams.name"
            :landingPageTemplates="landingPageTemplates"
            :phishingUrl="landingPageParams.urlTemplate"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--scenario-preview"
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
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'
export default {
  name: 'SmishingScenarioPreview',
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
      textTemplate: null,
      landingPageTemplates: [],
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
    getSubtitle() {
      return this.selectedRow.name
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
            methodTypeId
          } = landingPageTemplate || []

          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            isAttachmentBasedTemplate: methodTypeId === 3
          }
          this.landingPageTemplates = landingPages
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
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    }
  }
}
</script>
