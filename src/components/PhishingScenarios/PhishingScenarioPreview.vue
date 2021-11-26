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
            <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
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
                <span class="template-preview__text--title">Phishing URL: </span>
                <span class="template-preview__text--body">{{
                  landingPageParams.urlTemplate
                }}</span>
              </div>
            </div>
            <hr class="mt-2" v-if="!!landingPageTemplate" />
            <KEmailPreview
              v-if="!!landingPageTemplate"
              ref="refPreview"
              :html="landingPageTemplate"
            />
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
import { getPhishingScenarioLandingPageAndEmailTemplate } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import { getScenario } from '@/api/scenarios'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'PhishingScenarioPreview',
  components: { KEmailPreview, DatatableLoading, AppDialog },
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
      isLoading: false,
      labels
    }
  },
  computed: {
    getTitle() {
      return 'Scenario Preview'
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
      this.setLoading(true)
      getScenario(this.selectedRow.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        const { emailTemplateResourceId, landingPageTemplateResourceId } = data
        getPhishingScenarioLandingPageAndEmailTemplate(
          emailTemplateResourceId,
          landingPageTemplateResourceId
        )
          .then((response) => {
            const { data: { data = {} } = {} } = response
            const { emailTemplate, landingPageTemplate } = data
            const { template, fromName, fromAddress, name, difficultyResourceId } = emailTemplate

            this.emailTemplateParams = {
              fromName,
              fromAddress,
              name,
              difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text
            }
            this.emailTemplate = template
            const {
              name: landingPageName,
              description,
              landingPages,
              urlTemplate,
              difficultyTypeId,
              methodTypeId
            } = landingPageTemplate
            this.landingPageParams = {
              name: landingPageName,
              description,
              urlTemplate,
              difficulty: difficulties[difficultyTypeId - 1].text,
              method: methods[methodTypeId - 1].text
            }
            this.landingPageTemplate = landingPages[0].content
          })
          .finally(this.setLoading)
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
