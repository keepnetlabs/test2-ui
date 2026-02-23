<template>
  <div class="emailTemplatePreview pt-0" style="min-height: auto !important;">
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
      <template #app-dialog-footer>
        <AppDialogFooterWithClose @on-close="toggleTemplateDialog" />
      </template>
    </AppDialog>
    <TrainingLibraryCommonComponents />
    <div class="emailTemplatePreview__container pt-0" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main" :style="getContainerStyle">
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
                  <KSelect
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
                    @change="isShowSelectedScenarios = false"
                  />
                </div>
                <div>
                  <KSelect
                    v-model="language"
                    placeholder="Language"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      min-width: 250px;
                    "
                    :items="languages"
                    @change="isShowSelectedScenarios = false"
                  />
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
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="isShowSelectedScenarios = false"
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
                  minWidth: '25% !important'
                }"
                @scroll="handleScroll"
              >
                <div class="my-5 mx-6">
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
                  @click="callForSelectedPhishingScenario(item.resourceId)"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <div class="d-flex overflow-hidden">
                      <VCheckbox
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
                    <div v-if="!item.tags || !item.tags.length">
                      {{ '\xa0' }}
                    </div>
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
                    name="textMessage"
                    label="Text Message"
                  >
                    <div class="template-preview pt-0">
                      <div class="template-preview__text pl-2" v-if="!!textTemplate">
                        <div>
                          <span>{{ textTemplateParams.textMessage }}</span>
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
                    <TabsWithMfaSettings
                      v-if="isLandingPageTabsVisible || isMethodMfa"
                      class="tabs-with-mfa-settings"
                      is-smishing
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
                          <v-icon color="#2196f3" medium>
                            {{ 'mdi-fullscreen' }}
                          </v-icon>
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
                      <hr class="mt-2" v-if="!!getSingleTemplateDetails" />
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
                      is-show-reminder
                      v-model="trainingTabModel[selectedTemplateResourceId]"
                      :type="SCENARIO_TYPES.SMISHING"
                      :is-edit="isEdit"
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
import SmishingService from '@/api/smishing'
const EMITS = {
  ON_ITEM_CHANGE: 'on-item-change'
}
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'
import { methods, difficulties } from '@/components/SmishingCampaignManager/utils'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import KEmailPreview from '@/components/KEmailPreview.vue'
import ShowMoreTags from '@/components/ShowMoreTags.vue'
import useDebounce from '@/hooks/useDebounce'
import { getDefaultAxiosPayload } from '@/utils/functions'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import CampaignManagerPhishingScenariosTrainingTab from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingTab.vue'
import { mapGetters } from 'vuex'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { SCENARIO_TYPES, getItemDifficultyClass } from '@/components/Common/Simulator/utils'
import { getEnrollmentSendTypeIdByEnum } from '@/components/CampaignManager/PhishingScenarios/utils'

export default {
  name: 'CampaignManagerSmishingScenarios',
  components: {
    TrainingLibraryCommonComponents,
    CampaignManagerPhishingScenariosTrainingTab,
    AppDialogFooterWithClose,
    ShowMoreTags,
    KEmailPreview,
    KSelect,
    AppDialog,
    Multipane,
    MultipaneResizer,
    TabsWithMfaSettings
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
    }
  },
  data() {
    return {
      SCENARIO_TYPES,
      tab: 'textMessage',
      axiosPayload: getDefaultAxiosPayload(),
      trainingTabModel: {},
      checkboxModel: {},
      labels,
      methods,
      difficulties,
      search: '',
      isShowTemplate: false,
      selectedTemplateResourceId: null,
      isAttachmentBasedScenario: false,
      isShowSelectedScenarios: false,
      method: '',
      difficulty: '',
      language: '',
      textTemplate: null,
      textTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null,
      selectedLandingPageTab: '1',
      landingPageTemplates: [],
      phishingScenarioItems: [],
      isMethodMfa: false,
      isShowTrainingDialog: false
    }
  },
  computed: {
    ...mapGetters({
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog'
    }),
    getContainerStyle() {
      return this.isValid ? {} : { border: '1px solid #ff5252 !important', borderRadius: '20px' }
    },
    getSelectedScenarioSwitchLabel() {
      return `Only show selected scenarios (${this.value.length})`
    },
    getTableEmptyTextMessage() {
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : 'You do not have any Smishing Scenarios'
    },
    getTableEmptySubMessage() {
      return this.isFilterOrSearchActive
        ? 'Go to Smishing Simulator>Smishing Scenarios to create a new scenario'
        : 'Please try adjusting your search or filter'
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
    getTemplatePreviewContent() {
      if (this.tab === 'textMessage') {
        return this.emailTemplate
      } else {
        return this.getCurrentLandingPageTemplate
      }
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[Number.parseInt(this.selectedLandingPageTab) - 1]?.content || ''
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
            val.certificateConfigSendType,
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
    search(val) {
      this.debounce(() => {
        this.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Method', Operator: 'Contains', Value: val },
          { FieldName: 'Tags', Operator: 'Contains', Value: val },
          { FieldName: 'Difficulty', Operator: 'Contains', Value: val },
          { FieldName: 'CreatedBy', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val },
          {
            FieldName: 'LanguageTypeResourceId',
            Operator: 'Contains',
            Value: val
          }
        ]
        this.callForPhishingScenarios()
        this.isShowSelectedScenarios = false
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
    language(val) {
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
    },
    'getTrainingPreviewDialog.status': {
      handler(newVal) {
        if (newVal === false) {
          this.isShowTrainingDialog = false
        }
      }
    }
  },
  created() {
    if (!this.isEdit) {
      this.callForPhishingScenarios()
    }
  },
  methods: {
    getItemDifficultyClass,
    getItemClasses(itemResourceId = '') {
      return [
        'template-list',
        {
          'bg-phishing-gray': this.selectedTemplateResourceId === itemResourceId
        },
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
    callForSelectedPhishingScenario(resourceId = '') {
      SmishingService.getSmishingScenario(resourceId).then((response) => {
        const {
          data: { data }
        } = response
        if (!this.phishingScenarioItems.some((item) => item.resourceId === data.resourceId)) {
          this.phishingScenarioItems.push(data)
        }
        this.selectedTemplateResourceId = resourceId
        SmishingService.previewSmishingScenario(resourceId).then((response) => {
          const { data: { data = {} } = {} } = response
          const {
            textTemplate,
            landingPageTemplate,
            methodTypeId,
            mfaTextTemplate,
            mfaSmsSenderNumber
          } = data
          const {
            template,
            name,
            difficultyResourceId,
            languageTypeResourceId: languageOfEmailTemplate
          } = textTemplate || {}

          this.textTemplateParams = {
            textMessage: template,
            name,
            difficulty:
              difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
            languageTypeResourceId: languageOfEmailTemplate
          }
          this.textTemplate = template
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
            languageTypeResourceId,
            mfaSmsSenderNumber,
            mfaTextTemplate
          }
          this.landingPageTemplates = landingPages || []
          this.tab = 'textMessage'
          this.isMethodMfa = data.methodTypeId === 4
        })
      })
    },
    callForPhishingScenarios(isSelectFirstItem = true) {
      if (this.isEdit && this.defaultPhishingScenariosValuesMapped.length && !this.value.length) {
        this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
        this.axiosPayload.pageSize = Math.max(
          this.defaultPhishingScenariosValuesMapped.length,
          10
        )
      } else if (this.value.length && this.isEdit) {
        this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
      }
      SmishingService.searchSmishingScenarios(this.axiosPayload).then((response) => {
        const {
          data: { data }
        } = response
        this.phishingScenarioItems =
          data.results?.map((item) => ({
            ...item,
            languageTypeName:
              this.languages.find((lang) => lang.languageTypeName === item.languageTypeName)
                ?.text || item.languageTypeName
          })) || []
        this.phishingScenarioItems.forEach((item) => {
          if (!item.isSelected || this.value.some((pItem) => pItem.resourceId === item.resourceId))
            return
          this.value.push(item)
        })
        if (isSelectFirstItem && this.phishingScenarioItems.length) {
          this.callForSelectedPhishingScenario(this.phishingScenarioItems[0].resourceId)
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
      this.difficulty = ''
      this.method = ''
      this.language = ''
      this.axiosPayload = getDefaultAxiosPayload()
      this.callForPhishingScenarios(false)
    },
    handleTrainingPreviewButtonClick() {
      this.toggleShowTrainingDialog()
    },
    toggleShowTrainingDialog() {
      if (this.isShowTrainingDialog) {
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: false
        })
      } else {
        const selectedTraining = this.trainingTabModel[this.selectedTemplateResourceId]
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: true,
          selectedRow: {
            ...selectedTraining,
            trainingId: selectedTraining.trainingId,
            name: selectedTraining.trainingName,
            languages: selectedTraining.trainingLanguageIds || []
          },
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: true
        })
      }
      this.isShowTrainingDialog = !this.isShowTrainingDialog
    }
  }
}
</script>
