<template>
  <div class="emailTemplatePreview">
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else class="emailTemplatePreview__container" style="padding-top: 13px !important;">
      <div class="emailTemplatePreview__container-main">
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between" style="padding: 20px;">
              <div class="d-flex">
                <div>
                  <v-text-field
                    v-model.trim="search"
                    placeholder="Search"
                    outlined
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="
                      max-width: 328px;
                      min-width: 328px;
                      width: 100%;
                      padding-right: 24px !important;
                    "
                  ></v-text-field>
                </div>
                <div v-if="false">
                  <KSelect
                    v-model="scenarioType"
                    placeholder="Scenario Type"
                    outlined
                    persistent-hint
                    style="padding-right: 4px !important;"
                    :items="scenarioTypeItems"
                  />
                </div>
                <div v-if="false">
                  <KSelect
                    v-model="language"
                    placeholder="Language"
                    outlined
                    persistent-hint
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    :items="languageItems"
                  />
                </div>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical" :style="getStyle">
            <template v-if="getItems.length">
              <div
                class="pane"
                :style="{
                  maxWidth: '25% !important',
                  minWidth: '25% !important',
                  pointerEvents: isLoading ? 'none' : 'inherit'
                }"
                @scroll="handleScroll"
              >
                <div
                  v-for="(item, index) in getItems"
                  :key="index"
                  :class="[
                    'template-list',
                    { 'template-list--selected': item.resourceId === value }
                  ]"
                  @click="setSelectedTemplate(item, index)"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <div class="d-flex flex-column wrapWord">
                      <div class="template-list--item template-list--item__header">
                        {{ item.name }}
                      </div>
                      <div
                        class="template-list--item template-list--item__sub-header"
                        style="overflow: hidden; text-overflow: ellipsis;"
                      >
                        {{ item.method || 'Clicked-only' }}
                        &#8226;
                        <span class="template-list--item__sub-header--span">by</span>
                        {{ item['createdBy'] }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <div
                      class="template-list--item template-list--item__sub-header"
                      style="overflow: hidden; text-overflow: ellipsis;"
                    >
                      started on {{ item.createTime }} &#8226; ended on {{ item.lastLaunch }}
                    </div>
                  </div>

                  <div class="template-list--item mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <el-tabs v-model="tab" @tab-click="handleTabChange">
                  <el-tab-pane name="email" :label="labels.JustEmail" id="send-training-email-page">
                    <div class="template-preview mt-n1 pt-0">
                      <div class="template-preview__text pl-2" v-if="!!emailTemplate">
                        <div>
                          <span class="template-preview__text--title">Name: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.name
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">Subject: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.subject
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">From Name: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.fromName
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">From Email Address: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.fromAddress
                          }}</span>
                        </div>
                      </div>
                      <hr class="mt-2" v-if="!!emailTemplate" />
                      <KEmailPreview
                        v-if="!!emailTemplate"
                        :key="emailTemplate"
                        :html="emailTemplate"
                      />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane
                    v-if="!isAttachmentBasedScenario"
                    :label="labels.LandingPage"
                    name="landing-page"
                    id="send-training-landing-page"
                  >
                    <el-tabs v-if="isLandingPageTabsVisible" v-model="selectedLandingPageTab">
                      <el-tab-pane
                        v-for="(template, index) in landingPageTemplates"
                        :key="index"
                        :label="`Page ${index + 1}`"
                        :name="`${index + 1}`"
                      >
                        <div class="template-preview mt-n1 pt-0">
                          <div v-if="!!template.content" class="template-preview__text pl-2">
                            <div>
                              <span class="template-preview__text--title">Name: </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.name
                              }}</span>
                            </div>
                            <div>
                              <span class="template-preview__text--title">Phishing URL: </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.urlTemplate
                              }}</span>
                            </div>
                          </div>
                          <hr class="mt-2" v-if="!!template.content" />
                          <KEmailPreview v-if="!!template.content" :html="template.content" />
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <div v-else class="template-preview mt-n1 pt-0">
                      <div class="template-preview__text pl-2" v-if="!!getSingleTemplateDetails">
                        <div>
                          <span class="template-preview__text--title">Name: </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.name
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">Phishing URL: </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.urlTemplate
                          }}</span>
                        </div>
                      </div>
                      <hr class="mt-2" v-if="!!getSingleTemplateDetails" />
                      <KEmailPreview
                        v-if="!!getSingleTemplateDetails"
                        :html="getSingleTemplateDetails"
                      />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane
                    :label="labels.CampaignResults"
                    name="campaign-results"
                    id="send-training-campaign-results"
                  >
                    <div class="send-training-campaign-results-container">
                      <FormGroupHorizontalContent
                        :label="labels.SelectInstance"
                        style="max-width: 700px;"
                      >
                        <KSelect
                          v-model.trim="phishingCampaignResourceId"
                          id="input--campaign-manager-advanced-settings-other-settings-percent"
                          class="ml-2"
                          style="min-width: 548px;"
                          outlined
                          dense
                          hide-details
                          :items="phishingCampaignReportItems"
                        />
                      </FormGroupHorizontalContent>
                    </div>
                    <DatatableLoading
                      v-if="isCampaignLoading"
                      :loading="isCampaignLoading"
                      class="mt-2"
                    />
                    <div v-show="!isCampaignLoading" style="margin-top: 40px;">
                      <div class="campaign-manager-target-user-groups-header">
                        <v-icon color="#000000">mdi-account-multiple</v-icon>
                        <span class="campaign-manager-target-user-groups-header__text"
                          >Total {{ totalCampaignUsers }} users from
                          {{ totalCampaignGroups }} groups</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="!isCampaignLoading"
                      style="
                        display: flex;
                        align-items: center;
                        margin-top: 32px;
                        margin-left: 20px;
                        max-height: 300px;
                        max-width: 300px;
                      "
                    >
                      <Pie :data="pieData" :chart-options="chartOptions" />
                      <div style="position: absolute; left: 500px; top: 269px;">
                        <div>No response{{ `(${pieData[0]})` }}</div>
                        <div>
                          Opened Email{{ `(${pieData[isAttachmentBasedScenario ? 1 : 2]})` }}
                        </div>
                        <div>
                          Reported as suspicious{{
                            `(${pieData[isAttachmentBasedScenario ? 4 : 5]})`
                          }}
                        </div>
                        <div v-if="!isAttachmentBasedScenario">
                          Clicked the phishing link{{ `(${pieData[1]})` }}
                        </div>
                        <div v-if="!isAttachmentBasedScenario">
                          Submitted data{{ `(${pieData[3]})` }}
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
            <div
              class="custom-empty-table-message d-flex align-center"
              style="min-height: 60vh;"
              v-else
            >
              <div class="empty-inline">
                <slot name="empty-table-inline">
                  <h2 :id="`text--empty-message-${Math.random().toString().substring(2)}`">
                    {{ getTableEmptyTextMessage }}
                  </h2>
                  <p :id="`text--empty-sub-message-${Math.random().toString().substring(2)}`">
                    {{ getTableEmptySubMessage }}
                  </p>
                </slot>
              </div>
            </div>
          </multipane>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import ShowMoreTags from '@/components/ShowMoreTags'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import KEmailPreview from '@/components/KEmailPreview'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { EMITS } from '../utils'
import {
  getCampaignJobSummary,
  getCampaignJobSummaryTargetGroups,
  getCampaignManagerPreview,
  searchCampaignManager,
  searchCampaignPhishingJob
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import labels from '@/model/constants/labels'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'SendTrainingSelectUsersByCampaign',
  components: {
    Pie,
    FormGroupHorizontalContent,
    KEmailPreview,
    ShowMoreTags,
    KSelect,
    Multipane,
    MultipaneResizer,
    DatatableLoading
  },
  props: {
    value: {
      type: String
    }
  },
  mixins: [useLoading],
  data() {
    return {
      labels,
      axiosPayload: getDefaultAxiosPayload(),
      search: '',
      scenarioType: '',
      language: '',
      scenarioTypeItems: [],
      tab: '',
      languageItems: [],
      campaignItems: [],
      totalCampaignUsers: 0,
      isCampaignLoading: false,
      totalCampaignGroups: 0,
      isAttachmentBasedScenario: false,
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageTemplates: null,
      landingPageParams: null,
      selectedCampaign: null,
      phishingCampaignResourceId: '',
      selectedLandingPageTab: 1,
      phishingCampaignReportItems: [],
      timeout: null,
      initial: true,
      pieData: [],
      chartOptions: {},
      searchCampaignReportAxiosPayload: getDefaultAxiosPayload({
        orderBy: 'CreatedDate',
        pageSize: 100
      })
    }
  },
  computed: {
    getStyle() {
      const style = {}
      if (!this.getItems.length) {
        style.maxHeight = '360px'
        style.display = 'flex'
        style.justifyContent = 'center'
        style.alignItems = 'center'
      }
      return style
    },
    isLandingPageTabsVisible() {
      return this.landingPageTemplates?.length > 1
    },
    getItems() {
      return this.campaignItems
    },
    getTableEmptyTextMessage() {
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : 'You do not have any Campaigns yet.'
    },
    getTableEmptySubMessage() {
      return !this.isFilterOrSearchActive
        ? 'Go to Phishing Simulator>Campaign Manager to create a new campaign'
        : 'Please try adjusting your search or filter'
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    },
    isFilterOrSearchActive() {
      const { search } = this
      return search
    }
  },
  watch: {
    search(val) {
      this.debounce(() => {
        this.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Method', Operator: 'Contains', Value: val },
          { FieldName: 'Tags', Operator: 'Contains', Value: val },
          { FieldName: 'Difficulty', Operator: 'Contains', Value: val },
          { FieldName: 'CreatedBy', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val }
        ]
        this.callForData()
      }, 500)
    },
    language(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'language'
      )
      const obj = { Value: val, FieldName: 'language', Operator: 'Include' }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForData()
    },
    scenarioType(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'scenarioType'
      )
      const obj = { Value: val, FieldName: 'scenarioType', Operator: 'Include' }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForData()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    isItemHaveTags(item) {
      return !item?.tags?.length
    },
    callForData() {
      if (this.initial) this.setLoading(true)
      searchCampaignManager(this.axiosPayload)
        .then((response) => {
          const {
            data: { data = [] }
          } = response
          const { results = [] } = data
          this.campaignItems = results.map((item) => {
            const newItem = JSON.parse(JSON.stringify(item))
            delete newItem['instanceCount']
            newItem.targetUsers = Number(newItem.targetUsers)
            newItem.total = Number(item['instanceCount'])
            return newItem
          })
          if (this.campaignItems.length) {
            this.setSelectedTemplate(this.campaignItems[0])
          }
        })
        .finally(() => {
          if (this.initial) this.setLoading()
          if (this.initial) this.initial = false
        })
    },
    handleScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        this.axiosPayload.pageSize += 10
        this.debounce(() => {
          this.callForData()
        }, 500)
      }
    },
    setSelectedTemplate(row) {
      this.tab = 'email'
      this.selectedCampaign = row
      getCampaignManagerPreview(row.resourceId).then((response) => {
        const { data: { data: { phishingScenarioPreviewDto } = {} } = {} } = response
        const { landingPageTemplate: landingPage, methodTypeId } = phishingScenarioPreviewDto
        this.isAttachmentBasedScenario = methodTypeId === 3
        this.emailTemplate = phishingScenarioPreviewDto?.emailTemplate?.template || ''
        this.emailTemplateParams = {
          name: phishingScenarioPreviewDto?.emailTemplate?.name || '',
          subject: phishingScenarioPreviewDto?.emailTemplate?.subject || '',
          fromName: phishingScenarioPreviewDto?.emailTemplate?.fromName || '',
          fromAddress: phishingScenarioPreviewDto?.emailTemplate?.fromAddress || ''
        }
        this.landingPageTemplates = landingPage?.landingPages || []
        this.landingPageParams = {
          name: landingPage?.name || '',
          urlTemplate: landingPage?.urlTemplate || ''
        }
        this.$emit(EMITS.ON_ITEM_CHANGE, {
          ...row,
          methodTypeId: response?.data?.data?.methodTypeId
        })
      })
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    handleTabChange({ label }) {
      if (label === 'Campaign Results') {
        searchCampaignPhishingJob(
          this.searchCampaignReportAxiosPayload,
          this.selectedCampaign.resourceId
        ).then((response) => {
          const {
            data: { data = [] }
          } = response
          const { results = [] } = data
          this.phishingCampaignReportItems = results.map((result) => ({
            text: `${result.startDate}(${result.status})`,
            value: result.resourceId
          }))
          if (this.phishingCampaignReportItems.length) {
            this.phishingCampaignResourceId = this.phishingCampaignReportItems[0].value
            this.callForCampaignSummary()
          }
        })
      }
    },
    callForCampaignSummary() {
      this.isCampaignLoading = true
      getCampaignJobSummary(this.phishingCampaignResourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          if (this.isAttachmentBasedScenario) {
            this.chartOptions = {
              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                  fontColor: '#757575',
                  fontFamily: 'Open-sans,sans-serif',
                  padding: 16,
                  fontSize: 12
                }
              },
              backgroundColor: ['#67C23A', '#FBF280', '#F56C6C', '#217124', '#43A047'],
              labels: [
                labels.NoResponse,
                labels.Opened,
                labels.OpenedAttachment,
                labels.NotDelivered,
                labels.ReportedAsSuspicious
              ],
              showTooltipLine: true
            }
          } else {
            this.chartOptions = {
              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                  fontColor: '#757575',
                  fontFamily: 'Open-sans,sans-serif',
                  padding: 16,
                  fontSize: 12
                }
              },
              backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C', '#217124', '#43A047'],
              labels: [
                labels.NoResponse,
                labels.Clicked,
                labels.Opened,
                labels.Submitted,
                labels.NotDelivered,
                labels.ReportedAsSuspicious
              ],
              showTooltipLine: true
            }
          }
          const {
            attachmentOpenedEmail,
            clickedEmail,
            noResponseEmail,
            notDelivered,
            openedEmail,
            reportedEmail,
            submittedEmail
          } = data?.scenarioStats
          const pieData = []
          pieData.push(noResponseEmail)
          if (!this.isAttachmentBasedScenario) pieData.push(clickedEmail)
          pieData.push(openedEmail)
          if (!this.isAttachmentBasedScenario) pieData.push(submittedEmail)
          else pieData.push(attachmentOpenedEmail)
          pieData.push(notDelivered)
          pieData.push(reportedEmail)
          this.pieData = JSON.parse(JSON.stringify(pieData))
        })
        .finally(() => {
          this.isCampaignLoading = false
        })
      getCampaignJobSummaryTargetGroups(this.phishingCampaignResourceId).then((response) => {
        this.totalCampaignGroups = response?.data?.data?.groups?.length || 0
        this.totalCampaignUsers = response?.data?.data?.groups?.reduce((acc, item) => {
          acc += item.usersCount
          return acc
        }, 0)
      })
    }
  }
}
</script>
