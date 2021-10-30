<template>
  <AppDialog
    :status="status"
    icon="mdi-eye"
    :title="getTitle"
    :subtitle="getSubtitle"
    :size="'ultraMaximum'"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <el-tabs v-model="tab">
        <el-tab-pane
          id="campaign-manager-info--email-content"
          name="email"
          :label="labels.JustEmail"
        >
          <div class="template-preview pt-3">
            <div class="template-preview__text" v-if="!!emailTemplate">
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
            </div>
            <hr class="mt-2" v-if="!!emailTemplate" />
            <k-shadow-frame :content="emailTemplate" :key="emailTemplate + 'vue'" />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <div class="template-preview pt-3">
            <div class="template-preview__text" v-if="!!landingPageTemplate">
              <div>
                <span class="template-preview__text--title">Name: </span>
                <span class="template-preview__text--body">{{ landingPageParams.name }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">Description: </span>
                <span class="template-preview__text--body">{{
                  landingPageParams.description
                }}</span>
              </div>
            </div>
            <hr class="mt-2" v-if="!!landingPageTemplate" />
            <k-shadow-frame :content="landingPageTemplate" :key="landingPageTemplate + 'vue'" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
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
export default {
  name: 'CampaignManagerPreview',
  components: { AppDialog },
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
      emailTemplate: null,
      landingPageTemplate: null,
      emailTemplateParams: {},
      landingPageParams: {},
      tab: 'email',
      labels
    }
  },
  computed: {
    getTitle() {
      return 'Landing Page Template Preview'
    },
    getSubtitle() {
      return this.selectedRow.name
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      getCampaignManagerPreview(this.selectedRow.resourceId).then((response) => {
        const { data: { data: { phishingScenarioPreviewDto } = {} } = {} } = response
        const { emailTemplate, landingPageTemplate: landingPage } = phishingScenarioPreviewDto
        this.emailTemplate = emailTemplate.template
        this.emailTemplateParams = {
          fromName: emailTemplate.fromName,
          fromAddress: emailTemplate.fromAddress
        }
        this.landingPageTemplate = landingPage.landingPages[0].content
        this.landingPageParams = {
          name: landingPage.name,
          description: landingPage.description
        }
      })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-preview-dialog {
  .k-dialog__body {
    padding-top: 8px;
  }
}
</style>
