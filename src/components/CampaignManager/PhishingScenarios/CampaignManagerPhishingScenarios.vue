<template>
  <div
    class="emailTemplatePreview campaign-manager-phishing-scenarios pt-0"
    style="min-height: auto !important;"
  >
    <CampaignManagerPhishingScenariosPreviewDialog
      v-if="isShowTemplate"
      :status="isShowTemplate"
      :landing-page-params="landingPageParams"
      :email-template="emailTemplate"
      :tab="tab"
      :landing-page-templates="landingPageTemplates"
      @on-close="toggleTemplateDialog"
    />
    <TrainingLibraryPreviewDialog
      v-if="isShowTrainingDialog"
      :status="isShowTrainingDialog"
      :selected-row="trainingTabModel[selectedTemplateResourceId]"
      @on-close="toggleShowTrainingDialog"
    />
    <div class="emailTemplatePreview__container pt-0" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main" :style="getContainerStyle">
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <VTextField
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
                  />
                </div>
                <div>
                  <KSelect
                    v-model="method"
                    :items="getMethodItems"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    customMenuClass="campaign-manager-phishing-scenarios__filter-menu"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 172px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-show="data.index === 0">Type ({{ method.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="language"
                    placeholder="Language"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    :items="languages"
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-show="data.index === 0">Language (1)</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="difficulty"
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 196px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-show="data.index === 0">Difficulty ({{ difficulty.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="category"
                    :items="categories"
                    placeholder="Category"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    customMenuClass="campaign-manager-phishing-scenarios__filter-menu"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 205px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-show="data.index === 0">Category ({{ category.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="scenarioDistribution"
                    :items="scenarioDistributionItems"
                    placeholder="Select scenarios manually"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: unset;
                      width: 300px;
                    "
                    :disabled="!category.length"
                  />
                </div>
              </div>
            </div>
            <div v-if="getBadges.length" class="campaign-manager-phishing-scenarios__badges">
              <div class="campaign-manager-phishing-scenarios__badge-container">
                <div
                  v-for="(filterBadge, index) in getBadges"
                  :key="index"
                  class="campaign-manager-phishing-scenarios__badge"
                >
                  <span class="campaign-manager-phishing-scenarios__badge-key"
                    >{{ filterBadge.key }}:</span
                  >
                  <span class="campaign-manager-phishing-scenarios__badge-value">{{
                    filterBadge.value
                  }}</span>
                  <div>
                    <VIcon
                      class="fw-600 cursor-pointer"
                      style="font-size: 20px; margin-top: -2px;"
                      color="#757575"
                      @click="handleRemoveFilter(filterBadge)"
                      >mdi-close</VIcon
                    >
                  </div>
                </div>
              </div>
              <VBtn
                class="campaign-manager-phishing-scenarios__clear-all"
                color="#2196F3"
                text
                :ripple="false"
                @click="resetFilters"
              >
                Clear All
              </VBtn>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical" :style="getStyle">
            <template v-if="getItems.length">
              <div
                class="pane"
                :style="{
                  width: '25% !important',
                  minWidth: '360px'
                }"
                @scroll="handleScroll"
              >
                <div v-if="!isSingle" class="my-5 mx-6">
                  <VSwitch
                    v-model="isShowSelectedScenarios"
                    id="input--campaign-manager-show-selected-status"
                    class="k-switch selected-scenario-switch"
                    hide-details
                    color="#2196f3"
                    :label="getSelectedScenarioSwitchLabel"
                    :disabled="!value.length"
                  />
                </div>
                <div
                  v-for="item in getItems"
                  :key="item.resourceId"
                  :class="getItemClasses(item.resourceId)"
                  @click="callForSelectedPhishingScenario(item.resourceId, item)"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <div class="d-flex overflow-hidden">
                      <VCheckbox
                        v-if="!isSingle"
                        v-model="checkboxModel[item.resourceId]"
                        color="#2196f3"
                        hide-details
                        @click.stop
                        :ripple="false"
                        @change="setSelectedTemplate(item, $event)"
                      />
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
                    </div>
                    <div
                      class="template-list--item template-list--item__difficulty"
                      :class="getItemDifficultyClass(item.difficulty)"
                    >
                      {{ item.difficulty }}
                    </div>
                  </div>

                  <div class="template-list--item">
                    {{ getItemDescription(item) }}
                  </div>
                  <div class="template-list--item d-flex justify-space-between align-center mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                    <div v-if="!item.tags || !item.tags.length">{{ '\xa0' }}</div>
                    <div class="d-flex align-center">
                      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
                      <span class="template-list--item__language">{{ item.languageTypeName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <ElTabs v-model="tab" class="phishing-scenario-tab-container">
                  <ElTabPane
                    id="campaign-manager-info--email-content"
                    name="email"
                    :label="labels.JustEmail"
                  >
                    <div class="template-preview pt-0">
                      <div class="template-preview__icon">
                        <VBtn
                          v-if="!!emailTemplate"
                          :color="'#2196f3'"
                          icon
                          outlined
                          @click="handleClickPreview"
                        >
                          <VIcon color="#2196f3" medium> mdi-fullscreen </VIcon>
                        </VBtn>
                      </div>
                      <div class="template-preview__text pl-2" v-if="!!emailTemplate">
                        <div>
                          <span class="template-preview__text--title">Template Name: </span>
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
                      <hr class="mt-4" v-if="!!emailTemplate" />
                      <KEmailPreview
                        v-if="!!emailTemplate"
                        :key="emailTemplate"
                        :html="emailTemplate"
                      />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    v-if="!isAttachmentBasedScenario"
                    :label="labels.LandingPage"
                    name="landing-page"
                    id="campaign-manager-info--landing-content"
                  >
                    <TabsWithMfaSettings
                      v-if="isLandingPageTabsVisible || isMethodMfa"
                      class="tabs-with-mfa-settings"
                      :is-sub-tab="false"
                      :is-phishing-scenario="false"
                      :isMethodMfa="isMethodMfa"
                      :landing-page-params="landingPageParams"
                      :landing-page-templates="landingPageTemplates"
                    />
                    <div v-else class="template-preview pt-0">
                      <div class="template-preview__icon">
                        <v-btn
                          v-if="!!getSingleTemplateDetails"
                          :color="'#2196f3'"
                          icon
                          outlined
                          @click="handleClickPreview"
                        >
                          <v-icon color="#2196f3" medium> mdi-fullscreen </v-icon>
                        </v-btn>
                      </div>
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
                      <hr class="mt-4" v-if="!!getSingleTemplateDetails" />
                      <KEmailPreview
                        v-if="!!getSingleTemplateDetails"
                        :html="getSingleTemplateDetails"
                      />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    v-if="!isAttachmentBasedScenario && getTrainingSearchPermission"
                    :label="labels.Training"
                    name="training"
                    id="campaign-manager-info--training-content"
                  >
                    <CampaignManagerPhishingScenariosTrainingTab
                      ref="trainingTab"
                      v-model="trainingTabModel[selectedTemplateResourceId]"
                      :is-show-reminder="isShowReminder"
                      :type="type"
                      :is-edit="isEdit"
                      :enum-types="enumTypes"
                      @on-preview="handleTrainingPreviewButtonClick"
                    />
                  </ElTabPane>
                </ElTabs>
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
import labels from '@/model/constants/labels'
import {
  difficulties,
  PHISHING_SCENARIOS_METHOD_TYPE_BY_ID,
  quishingMethods,
  methods
} from '@/components/CampaignManager/CampaignManagerInfo/utils'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import KEmailPreview from '@/components/KEmailPreview.vue'
import ShowMoreTags from '@/components/ShowMoreTags.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import useDebounce from '@/hooks/useDebounce'
import { getDefaultAxiosPayload } from '@/utils/functions'
import TabsWithMfaSettings from '../../PhishingScenarios/TabsWithMfaSettings.vue'
import CampaignManagerPhishingScenariosTrainingTab from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingTab.vue'
import CampaignManagerPhishingScenariosPreviewDialog from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosPreviewDialog.vue'
import TrainingLibraryPreviewDialog from '@/components/AwarenessEducator/TrainingLibraryPreviewDialog.vue'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import { mapGetters } from 'vuex'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getEnrollmentSendTypeIdByEnum } from '@/components/CampaignManager/PhishingScenarios/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { scenarioDistributionItems } from '@/components/CampaignManager/utils'
export default {
  name: 'CampaignManagerPhishingScenarios',
  components: {
    TrainingLibraryPreviewDialog,
    CampaignManagerPhishingScenariosPreviewDialog,
    CampaignManagerPhishingScenariosTrainingTab,
    TabsWithMfaSettings,
    ShowMoreTags,
    KEmailPreview,
    KSelect,
    Multipane,
    MultipaneResizer,
    AttachmentsPreview
  },
  mixins: [useDebounce],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array
    },
    languages: {
      type: Array
    },
    value: {
      type: Array
    },
    isValid: {
      type: Boolean,
      default: true
    },
    defaultPhishingScenariosValuesMapped: {
      type: [Array, Object]
    },
    campaignManagerResourceId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    isShowReminder: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array
    }
  },
  data() {
    return {
      scenarioDistributionItems,
      tab: 'email',
      axiosPayload: getDefaultAxiosPayload(),
      checkboxModel: {},
      trainingTabModel: {},
      labels,
      quishingMethods,
      difficulties,
      search: '',
      isShowTemplate: false,
      selectedTemplateResourceId: null,
      isAttachmentBasedScenario: false,
      isShowSelectedScenarios: false,
      method: '',
      difficulty: '',
      language: '',
      languageText: '',
      category: '',
      scenarioDistribution: null,
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null,
      landingPageTemplates: [],
      phishingScenarioItems: [],
      isMethodMfa: false,
      isShowTrainingDialog: false,
      enumTypes: {}
    }
  },
  computed: {
    ...mapGetters({
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission'
    }),
    getBadges() {
      const badges = []
      if (this.method.length) {
        const methodBadges = this.method.map((item) => ({
          key: 'Type',
          value: item.text
        }))
        badges.push(...methodBadges)
      }
      if (this.languageText) {
        const languageBadge = { key: 'Language', value: this.languageText }
        badges.push(languageBadge)
      }
      if (this.difficulty.length) {
        const difficultyBadges = this.difficulty.map((item) => ({
          key: 'Difficulty',
          value: item.text
        }))
        badges.push(...difficultyBadges)
      }
      if (this.category.length) {
        const categoryBadges = this.category.map((item) => ({
          key: 'Category',
          value: item
        }))
        badges.push(...categoryBadges)
      }
      return badges
    },
    getMethodItems() {
      if (this.type === SCENARIO_TYPES.QUISHING) {
        return quishingMethods
      }
      return methods
    },
    getContainerStyle() {
      return !this.isValid ? { border: '1px solid #ff5252 !important', borderRadius: '20px' } : {}
    },
    getPhishingFile() {
      return this.emailTemplateParams?.phishingFileName
        ? {
            name: this.emailTemplateParams?.phishingFileName
          }
        : null
    },
    getSelectedScenarioSwitchLabel() {
      return `Only show selected scenarios (${this.value.length})`
    },
    getTableEmptyTextMessage() {
      const message =
        this.type === SCENARIO_TYPES.PHISHING
          ? 'You do not have any Phishing Scenarios'
          : 'You do not have any Quishing Scenarios'
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : message
    },
    getTableEmptySubMessage() {
      const message =
        this.type === SCENARIO_TYPES.PHISHING
          ? 'Go to Phishing Simulator > Phishing Scenarios to create a new scenario'
          : 'Go to Quishing Simulator > Quishing Scenarios to create a new scenario'
      return this.isFilterOrSearchActive ? message : 'Please try adjusting your search or filter'
    },
    isFilterOrSearchActive() {
      const { method, difficulty, search } = this
      return method || difficulty || search
    },
    getItems() {
      return this.isShowSelectedScenarios ? this.value : this.phishingScenarioItems
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
    isLandingPageTabsVisible() {
      return this.landingPageTemplates?.length > 1
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    }
  },
  watch: {
    axiosPayload: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('axiosPayload', val)
      }
    },
    defaultPhishingScenariosValuesMapped(val) {
      const setCheckbox = (resourceId = '') => {
        this.checkboxModel[resourceId] = true
      }
      const addTrainingKeyToTabModel = (val) => {
        this.$set(
          this.trainingTabModel,
          val.value,
          new TrainingTabModel(
            val.trainingId,
            val.trainingName,
            val.trainingLanguageIds,
            true,
            getEnrollmentSendTypeIdByEnum(val.enrollmentSendTypeId),
            val.awardCertificate,
            {
              periodCount: val.periodCount || 1,
              periodType: val.emailPeriodTypeId || 'Day',
              endType: val.reminderEndTypeId || 'TrainingCompleted',
              occurrenceCount: 1,
              stopTime: '',
              sendReminderEvery: val.isEnrollmentReminderActive || false
            }
          )
        )
      }
      if (Array.isArray(val)) {
        val.forEach((item) => {
          addTrainingKeyToTabModel(item)
          setCheckbox(item.value)
        })
      } else {
        addTrainingKeyToTabModel(val)
        setCheckbox(val.value)
      }
      this.callForPhishingScenarios()
    },
    search(val) {
      this.debounce(() => {
        this.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Method', Operator: 'Contains', Value: val },
          { FieldName: 'Tags', Operator: 'Contains', Value: val },
          { FieldName: 'Difficulty', Operator: 'Contains', Value: val },
          { FieldName: 'CreatedBy', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val },
          { FieldName: 'LanguageTypeResourceId', Operator: 'Contains', Value: val }
          // { FieldName: 'Category', Operator: 'Contains', Value: val }
        ]
        this.callForPhishingScenarios()
        this.isShowSelectedScenarios = false
      }, 500)
    },
    difficulty(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'difficulty'
      )
      const obj = {
        Value: val?.map?.((item) => item.text)?.join(',') || '',
        FieldName: 'difficulty',
        Operator: 'Include'
      }
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
      const obj = {
        Value: val?.map?.((item) => item.text)?.join(',') || '',
        FieldName: 'method',
        Operator: 'Include'
      }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForPhishingScenarios()
    },
    language(val) {
      if (val) {
        const languageIndex = this.languages.findIndex((lang) => lang.value === val)
        if (languageIndex !== -1) {
          this.languageText = this.languages?.[languageIndex]?.name || ''
        }
      } else {
        this.languageText = ''
      }
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'LanguageTypeResourceId'
      )
      const obj = {
        Value: val,
        FieldName: 'LanguageTypeResourceId',
        Operator: 'Contains'
      }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForPhishingScenarios()
    },
    category(val) {
      if (!val.length) {
        this.scenarioDistribution = null
      }
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'Category'
      )
      const obj = {
        Value: val?.map?.((item) => item)?.join(',') || '',
        FieldName: 'Category',
        Operator: 'Include'
      }
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
      }
      this.callForPhishingScenarios()
    },
    items(val) {
      this.phishingScenarioItems = val?.map((item) => ({
        ...item,
        tags: item?.tags || []
      }))
    },
    value(val = false) {
      if (val.length === 0) this.isShowSelectedScenarios = false
    },
    isShowSelectedScenarios(val = false) {
      if (val) {
        this.resetFilters()
      }
    }
  },
  created() {
    if (!this.isEdit) this.callForPhishingScenarios()
    if (this.getTrainingSearchPermission) this.callForEnrollmentFormDetails()
  },
  methods: {
    handleRemoveFilter(filter) {
      if (filter.key === 'Type') {
        const index = this.method.findIndex((item) => item.text === filter.value)
        if (index !== -1) {
          this.method.splice(index, 1)
        }
      }
      if (filter.key === 'Language') {
        this.language = ''
      }
      if (filter.key === 'Difficulty') {
        const index = this.difficulty.findIndex((item) => item.text === filter.value)
        if (index !== -1) {
          this.difficulty.splice(index, 1)
        }
      }
      if (filter.key === 'Category') {
        const index = this.category.findIndex((item) => item === filter.value)
        if (index !== -1) {
          this.category.splice(index, 1)
        }
      }
    },
    callForEnrollmentFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        const { enumNameValuePairs = {} } = response?.data?.data || {}
        this.enumTypes = enumNameValuePairs
      })
    },
    getItemClasses(itemResourceId = '') {
      return [
        'template-list',
        { 'bg-phishing-gray': this.selectedTemplateResourceId === itemResourceId },
        {
          'template-list--selected': this.value.find((item) => item.resourceId === itemResourceId)
        }
      ]
    },
    getItemDescription(item = {}) {
      if (!item?.description) {
        return '\xa0'
      }
      if (item?.description === 'null' || item?.description === 'undefined') {
        return '\xa0'
      }
      return item?.description || '\xa0'
    },
    getItemDifficultyClass(difficulty = '') {
      return difficulty === 'Easy'
        ? 'difficulty-easy'
        : difficulty === 'Medium'
        ? 'difficulty-medium'
        : 'difficulty-hard'
    },
    callForSelectedPhishingScenario(resourceId = '', item = {}) {
      this.adjustTrainingModel(resourceId)
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING ? getScenario : QuishingService.getScenario
      apiFunc(resourceId).then((response) => {
        const {
          data: { data }
        } = response
        if (!this.phishingScenarioItems.find((item) => item.resourceId === data.resourceId))
          this.phishingScenarioItems.push(data)
        this.isAttachmentBasedScenario =
          data.methodTypeId === PHISHING_SCENARIOS_METHOD_TYPE_BY_ID.ATTACHMENT
        this.selectedTemplateResourceId = resourceId
        const previewFunc =
          this.type === SCENARIO_TYPES.PHISHING
            ? getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId
            : QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
        const params = [resourceId]
        if (
          item.quishingType.toLowerCase() ===
          QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
        )
          params.push(QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT)
        previewFunc(...params).then((response) => {
          const { data: { data = {} } = {} } = response
          let {
            emailTemplate,
            landingPageTemplate,
            quishingTemplate,
            methodTypeId,
            mfaTextTemplate,
            mfaSmsSenderNumber
          } = data
          if (!emailTemplate) emailTemplate = quishingTemplate
          let {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            attachments,
            languageTypeResourceId: languageOfEmailTemplate,
            phishingFileName,
            subject
          } = emailTemplate || {}
          if (this.type === SCENARIO_TYPES.QUISHING)
            template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
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
            method: quishingMethods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            mfaSmsSenderNumber,
            mfaTextTemplate
          }
          this.landingPageTemplates = landingPages || []
          this.tab = 'email'
          this.isMethodMfa = data.methodTypeId === PHISHING_SCENARIOS_METHOD_TYPE_BY_ID.MFA
        })
      })
      if (this.isSingle) {
        Object.keys(this.trainingTabModel).forEach((key) => {
          if (key !== resourceId) {
            this.$set(this.trainingTabModel[key], 'isCheckboxSelected', false)
          }
        })
        this.setSelectedTemplate(item, true)
      }
    },
    adjustTrainingModel(resourceId = '') {
      if (!resourceId) return
      if (!this.trainingTabModel[resourceId]) {
        this.$set(this.trainingTabModel, resourceId, new TrainingTabModel())
      } else if (
        this.trainingTabModel?.[resourceId].trainingId &&
        !this.trainingTabModel?.[resourceId]?.trainingLanguageIds?.length
      )
        this?.$refs?.trainingTab?.$refs?.inputContentLanguage?.setDefaultValue()
    },
    callForPhishingScenarios(isSelectFirstItem = true) {
      if (this.isEdit && this.defaultPhishingScenariosValuesMapped.length && !this.value.length) {
        this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
        this.axiosPayload.pageSize =
          this.defaultPhishingScenariosValuesMapped.length < 10
            ? 10
            : this.defaultPhishingScenariosValuesMapped.length
      } else if (this.value.length && this.isEdit) {
        this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
      }
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING ? getScenariosList : QuishingService.searchScenarios
      if (this.type === SCENARIO_TYPES.QUISHING) {
        this.axiosPayload.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
      }
      apiFunc(this.axiosPayload).then((response) => {
        const {
          data: { data }
        } = response
        this.phishingScenarioItems = data.results || []
        this.phishingScenarioItems.forEach((item) => {
          if (!item.isSelected || this.value.find((pItem) => pItem.resourceId === item.resourceId))
            return
          this.value.push(item)
        })
        if (isSelectFirstItem && this.phishingScenarioItems.length) {
          this.callForSelectedPhishingScenario(
            this.phishingScenarioItems[0].resourceId,
            this.phishingScenarioItems[0]
          )
        }
      })
    },
    handleScroll(e) {
      if (this.isShowSelectedScenarios) return
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        this.axiosPayload.pageSize += 10
        this.debounce(() => {
          this.callForPhishingScenarios(false)
        }, 500)
      }
    },
    toggleTemplateDialog() {
      this.isShowTemplate = !this.isShowTemplate
    },
    setSelectedTemplate(item = {}, value = false) {
      if (this.trainingTabModel[item.resourceId]) {
        this.$set(this.trainingTabModel[item.resourceId], 'isCheckboxSelected', value)
      } else {
        this.$set(this.trainingTabModel, item.resourceId, new TrainingTabModel('', '', [], value))
      }
      if (value) {
        this.$emit('input', [...this.value, item])
      } else {
        this.$emit(
          'input',
          this.value.filter((phishingScenario) => item.resourceId !== phishingScenario.resourceId)
        )
      }
    },
    handleClickPreview() {
      this.toggleTemplateDialog()
    },
    resetFilters() {
      this.search = ''
      this.difficulty = []
      this.method = []
      this.language = ''
      this.category = []
      this.axiosPayload = getDefaultAxiosPayload()
      this.callForPhishingScenarios(false)
    },
    handleTrainingPreviewButtonClick() {
      this.toggleShowTrainingDialog()
    },
    toggleShowTrainingDialog() {
      this.isShowTrainingDialog = !this.isShowTrainingDialog
    }
  }
}
</script>
