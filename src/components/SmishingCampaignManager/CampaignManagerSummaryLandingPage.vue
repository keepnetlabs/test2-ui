<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="$domain"
    detailable-button-id="btn-preview--campaign-report-landing-page-template"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowLandingPageTemplate"
    :title="labels.LandingPageWhoUsersSmishing"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__landing-page-template-body pb-4">
        <ElTabs v-if="templates.length > 1 || isMethodMfa" v-model="selectedTab">
          <ElTabPane
            v-for="(template, index) in templates"
            :key="index"
            :name="`${index + 1}`"
            :label="`Page ${index + 1}`"
          >
            <div class="campaign-manager-last-step__landing-page-template-body-header">
              <div class="campaign-manager-last-step__landing-page-template-body-header-left">
                <div class="campaign-manager-last-step__email-template-body-header-left">
                  {{ formData.name }}
                </div>
              </div>
              <div class="campaign-manager-last-step__landing-page-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(formData.difficulty)"
                  :text="getBadgeText(formData.difficulty)"
                  :outline="false"
                />
                <Badge
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(formData.method)"
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
                >URL:</span
              >
              {{ formData.urlTemplate }}
            </div>
          </ElTabPane>
          <ElTabPane v-if="isMethodMfa" label="MFA Settings" name="mfa">
            <div class="campaign-manager-last-step__landing-page-template-body-header">
              <div class="campaign-manager-last-step__landing-page-template-body-header-left">
                <div class="campaign-manager-last-step__email-template-body-header-left">
                  {{ formData.name }}
                </div>
              </div>
              <div class="campaign-manager-last-step__landing-page-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(formData.difficulty)"
                  :text="getBadgeText(formData.difficulty)"
                  :outline="false"
                />
                <Badge
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(formData.method)"
                  :outline="false"
                />
                <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                  <template #content>
                    <v-icon>mdi-web</v-icon>{{ formData.languageShortCode }}
                  </template>
                </Badge>
              </div>
            </div>
            <div class="template-preview mt-4 pt-0">
              <div>
                <span style="font-weight: 600;" class="template-preview__text--title"
                  >Sender Phone Number:
                </span>
                <span class="template-preview__text--body">{{ formData.mfaSmsSenderNumber }}</span>
              </div>
              <div class="mt-2">
                <span style="font-weight: 600;" class="template-preview__text--title"
                  >Verification Message:
                </span>
                <span class="template-preview__text--body">{{ formData.mfaTextTemplate }}</span>
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
        <div v-else>
          <div class="campaign-manager-last-step__landing-page-template-body-header">
            <div class="campaign-manager-last-step__landing-page-template-body-header-left">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ formData.name }}
              </div>
            </div>
            <div class="campaign-manager-last-step__landing-page-template-body-header-right">
              <v-btn style="display: none;"></v-btn>
              <Badge
                size="mini"
                :color="getBadgeColor(formData.difficulty)"
                :text="getBadgeText(formData.difficulty)"
                :outline="false"
              />
              <Badge
                size="mini"
                color="#E0E0E0"
                class-name="badge-middle px-2 py-2"
                :text="getBadgeText(formData.method)"
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
              >URL:</span
            >
            {{ formData.urlTemplate }}
          </div>
        </div>
      </div>
      <div
        v-if="isShowLandingPageTemplate && !(selectedTab === 'mfa')"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview
            v-else
            ref="refPreview"
            :key="getCurrentTemplate"
            :html="getCurrentTemplate"
            is-extra-height
            is-landing-page
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
    isMethodMfa: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedTab: '1',
      labels,
      isShowLandingPageTemplate: false,
      templates: []
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData || {}).length
    },
    getCurrentTemplate() {
      return this.templates?.length > 1
        ? this.templates?.[Number.parseInt(this.selectedTab) - 1]?.content || ''
        : this.templates?.[0]?.content || ''
    }
  },
  watch: {
    formData: {
      handler(fd) {
        this.selectedTab = '1'
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
