<template>
  <div class="emailTemplatePreview" style="min-height: auto !important;">
    <AppDialog
      icon="mdi-eye"
      custom-size="1600"
      max-height
      max-height-size="900"
      :subtitle="labels.TemplatePreview"
      :status="isShowTemplate"
      :title="getTemplateHeader"
      style="overflow: hidden;"
      @changeStatus="toggleTemplateDialog"
    >
      <template #app-dialog-body>
        <KEmailPreview v-if="!!getTemplatePreviewContent" :html="getTemplatePreviewContent" />
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="toggleTemplateDialog"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </AppDialog>
    <div class="emailTemplatePreview__container pt-0" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main">
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <v-text-field
                    v-model.trim="search"
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter pr-2"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="
                      max-width: 328px;
                      min-width: 328px;
                      width: 100%;
                      padding-right: 4px !important;
                    "
                  ></v-text-field>
                </div>
                <div>
                  <k-select
                    v-model="method"
                    :items="methods"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  ></k-select>
                </div>
                <div>
                  <k-select
                    v-model="difficulty"
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  >
                  </k-select>
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
                  pointerEvents: isPhishingScenariosLoading ? 'none' : 'inherit'
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
                        {{ item.method }}
                        &#8226;
                        <span class="template-list--item__sub-header--span">by</span>
                        {{ item['createdBy'] }}
                      </div>
                    </div>
                    <div
                      class="template-list--item template-list--item__difficulty mr-8"
                      :class="
                        item.difficulty === 'Easy'
                          ? 'difficulty-easy'
                          : item.difficulty === 'Medium'
                          ? 'difficulty-medium'
                          : 'difficulty-hard'
                      "
                    >
                      {{ item.difficulty }}
                    </div>
                  </div>

                  <div class="template-list--item">
                    {{ item.description || '\xa0' }}
                  </div>
                  <div class="template-list--item mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                    <div v-if="!item.tags.length">{{ '\xa0' }}</div>
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <el-tabs v-model="tab">
                  <el-tab-pane
                    id="campaign-manager-info--email-content"
                    name="email"
                    :label="labels.JustEmail"
                  >
                    <div class="template-preview pt-3">
                      <div class="template-preview__icon">
                        <v-icon
                          v-if="!!emailTemplate"
                          :color="'#2196f3'"
                          left
                          medium
                          @click="handleClickPreview"
                        >
                          mdi-eye
                        </v-icon>
                      </div>
                      <div class="template-preview__text pl-2" v-if="!!emailTemplate">
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
                        <div
                          v-if="!!getPhishingFile"
                          class="attachment-wrapper mt-2"
                          style="position: relative;"
                        >
                          <div class="attachment blue-attach mb-0">
                            <AttachmentsPreview
                              :deletable="false"
                              :att="getPhishingFile"
                              :isEmailTemplate="true"
                            />
                          </div>
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
                    id="campaign-manager-info--landing-content"
                  >
                    <el-tabs v-if="isLandingPageTabsVisible" v-model="selectedLandingPageTab">
                      <el-tab-pane
                        v-for="(template, index) in landingPageTemplates"
                        :key="index"
                        :label="`Page ${index + 1}`"
                        :name="`${index + 1}`"
                      >
                        <div class="template-preview pt-3">
                          <div class="template-preview__icon">
                            <v-icon
                              v-if="!!template.content"
                              :color="'#2196f3'"
                              left
                              medium
                              @click="handleClickPreview"
                            >
                              mdi-eye
                            </v-icon>
                          </div>
                          <div v-if="!!template.content" class="template-preview__text pl-2">
                            <div>
                              <span class="template-preview__text--title">Name: </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.name
                              }}</span>
                            </div>
                            <div>
                              <span class="template-preview__text--title">Description: </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.description
                              }}</span>
                            </div>
                          </div>
                          <hr class="mt-2" v-if="!!template.content" />
                          <KEmailPreview v-if="!!template.content" :html="template.content" />
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <div v-else class="template-preview pt-3">
                      <div class="template-preview__icon">
                        <v-icon
                          v-if="!!getSingleTemplateDetails"
                          :color="'#2196f3'"
                          left
                          medium
                          @click="handleClickPreview"
                        >
                          mdi-eye
                        </v-icon>
                      </div>
                      <div class="template-preview__text pl-2" v-if="!!getSingleTemplateDetails">
                        <div>
                          <span class="template-preview__text--title">Name: </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.name
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">Description: </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.description
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
                </el-tabs>
              </div>
            </template>
            <div class="custom-empty-table-message" v-else>
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
import { getScenario, getScenariosList } from '@/api/scenarios'

const EMITS = {
  ON_ITEM_CHANGE: 'on-item-change'
}
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import { methods, difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import KSelect from '@/components/Common/Inputs/KSelect'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'

export default {
  name: 'CampaignManagerPhishingScenarios',
  components: {
    ShowMoreTags,
    KEmailPreview,
    KSelect,
    AppDialog,
    Multipane,
    MultipaneResizer,
    AttachmentsPreview
  },
  props: {
    items: {
      type: Array
    },
    value: {
      type: String
    },
    isPhishingScenariosLoading: {
      type: Boolean
    },
    isAttachmentBasedScenario: {
      type: Boolean
    }
  },
  data() {
    return {
      tab: 'email',
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      labels,
      search: '',
      isShowTemplate: false,
      selectedTemplate: null,
      methods,
      difficulties,
      method: '',
      difficulty: '',
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null,
      selectedLandingPageTab: '1',
      landingPageTemplates: [],
      phishingScenarioItems: []
    }
  },
  computed: {
    getPhishingFile() {
      return this.emailTemplateParams?.phishingFileName
        ? {
            name: this.emailTemplateParams?.phishingFileName
          }
        : null
    },
    getTableEmptyTextMessage() {
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : 'You do not have any Phishing Scenarios'
    },
    getTableEmptySubMessage() {
      return this.isFilterOrSearchActive
        ? 'Go to Phishing Simulator>Phishing Scenarios to create a new scenario'
        : 'Please try adjusting your search or filter'
    },
    isFilterOrSearchActive() {
      const { method, difficulty, search } = this
      return method || difficulty || search
    },
    getItems() {
      return this.phishingScenarioItems
    },
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
    getTemplatePreviewContent() {
      if (this.tab === 'email') {
        return this.emailTemplate
      } else {
        return this.getCurrentLandingPageTemplate
      }
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[parseInt(this.selectedLandingPageTab) - 1]?.content || ''
        : this.landingPageTemplates?.[0]?.content || ''
    },
    getTemplateHeader() {
      return this.landingPageParams?.name || ''
    },
    isLandingPageTabsVisible() {
      return this.landingPageTemplates?.length > 1
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    }
  },
  watch: {
    value() {
      this.tab = 'email'
      this.selectedLandingPageTab = '1'
      this.callForSelectedPhishingScenario()
    },
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
        this.callForPhishingScenarios()
      }, 500)
    },
    difficulty(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'difficulty'
      )
      const obj = { Value: val, FieldName: 'difficulty', Operator: 'Include' }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForPhishingScenarios()
    },
    method(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'method'
      )
      const obj = { Value: val, FieldName: 'method', Operator: 'Include' }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForPhishingScenarios()
    },
    items(val) {
      this.phishingScenarioItems = val?.map((item) => ({ ...item, tags: item?.tags || [] }))
    }
  },
  methods: {
    callForSelectedPhishingScenario() {
      getScenario(this.value).then((response) => {
        const {
          data: { data }
        } = response

        if (!this.phishingScenarioItems.find((item) => item.resourceId === data.resourceId)) {
          this.phishingScenarioItems.push(data)
        }

        this.$emit('onItemDetailsChange', data)
        getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId(this.value).then(
          (response) => {
            const { data: { data = {} } = {} } = response
            const { emailTemplate, landingPageTemplate, methodTypeId } = data
            const {
              template,
              fromName,
              fromAddress,
              name,
              difficultyResourceId,
              attachments,
              languageTypeResourceId: languageOfEmailTemplate,
              phishingFileName
            } = emailTemplate || {}

            this.emailTemplateParams = {
              fromName,
              fromAddress,
              name,
              difficulty:
                difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
              attachments,
              languageTypeResourceId: languageOfEmailTemplate,
              phishingFileName
            }
            this.emailTemplate = template
            const {
              name: landingPageName = '',
              description,
              landingPages,
              urlTemplate,
              difficultyTypeId,
              languageTypeResourceId
            } = landingPageTemplate || {}
            this.landingPageParams = {
              name: landingPageName,
              description,
              urlTemplate,
              difficulty: difficulties[difficultyTypeId - 1]?.text || '',
              method: methods[methodTypeId - 1]?.text || '',
              languageTypeResourceId
            }
            this.landingPageTemplates = landingPages || []
          }
        )
      })
    },
    callForPhishingScenarios() {
      getScenariosList(this.axiosPayload).then((response) => {
        const {
          data: { data }
        } = response

        this.phishingScenarioItems = data.results || []
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
          this.callForPhishingScenarios()
        }, 500)
      }
    },
    toggleTemplateDialog() {
      this.isShowTemplate = !this.isShowTemplate
    },
    setSelectedTemplate(val) {
      this.$emit(EMITS.ON_ITEM_CHANGE, val)
    },
    handleClickPreview() {
      this.toggleTemplateDialog()
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    }
  }
}
</script>
