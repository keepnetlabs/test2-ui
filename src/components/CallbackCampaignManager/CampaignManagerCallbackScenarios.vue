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
        <KEmailPreview v-if="!!emailTemplate" :html="emailTemplate" />
      </template>
      <template #app-dialog-footer>
        <AppDialogFooterWithClose @on-close="toggleTemplateDialog" />
      </template>
    </AppDialog>
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
                  <v-select
                    v-model="axiosPayload.filter.FilterGroups[0].FilterItems[0].Value"
                    :items="languages"
                    placeholder="Language"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="callForPhishingScenarios"
                  >
                  </v-select>
                </div>
                <div>
                  <v-select
                    v-model="axiosPayload.filter.FilterGroups[0].FilterItems[1].Value"
                    :items="getVoiceItems"
                    placeholder="Voice"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    :disabled="!getSelectedLanguageShortCode"
                    @change="callForPhishingScenarios"
                  >
                  </v-select>
                </div>
                <div>
                  <v-select
                    v-model="axiosPayload.filter.FilterGroups[0].FilterItems[2].Value"
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="callForPhishingScenarios"
                  >
                  </v-select>
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

                  <div class="template-list--item ml-8">
                    {{ getItemDescription(item) }}
                  </div>
                  <div class="template-list--item d-flex justify-space-between align-center mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                    <div v-if="!item.tags || !item.tags.length">{{ '\xa0' }}</div>
                    <div class="d-flex align-center">
                      <div class="template-list--item__narrator mr-2">
                        <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
                        <span class="template-list--item__language">{{ item.languageCode }}</span>
                      </div>
                      <div class="template-list--item__narrator">
                        <v-icon :size="16" color="#757575" class="mr-1"
                          >mdi-microphone-outline</v-icon
                        >
                        <span class="template-list--item__language">{{ item.voice }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <ElTabs v-model="tab" class="phishing-scenario-tab-container">
                  <ElTabPane id="campaign-manager-info--email-content" name="email" label="Email">
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
                    label="Callback Template"
                    name="callbackTemplate"
                    id="campaign-manager-info--callback-content"
                  >
                    <CallbackTemplatePreviewSteps
                      v-if="!!callbackTemplate"
                      :template="callbackTemplate"
                      :isTextToSpeechCompatible="isTextToSpeechCompatible"
                      :voiceResourceId="getVoiceResourceId"
                    />
                  </ElTabPane>
                  <!-- <ElTabPane
                    v-if="!isAttachmentBasedScenario && getTrainingSearchPermission"
                    :label="labels.Training"
                    name="training"
                    id="campaign-manager-info--training-content"
                  >
                    <CampaignManagerPhishingScenariosTrainingTab
                      ref="trainingTab"
                      v-model="trainingTabModel[selectedTemplateResourceId]"
                      :type="SCENARIO_TYPES.CALLBACK"
                      :is-edit="isEdit"
                      @on-preview="handleTrainingPreviewButtonClick"
                    />
                  </ElTabPane> -->
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
const EMITS = {
  ON_ITEM_CHANGE: 'on-item-change'
}
import CallbackService from '@/api/callback'
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'
import { methods, difficulties } from '@/components/SmishingCampaignManager/utils'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import KEmailPreview from '@/components/KEmailPreview.vue'
import ShowMoreTags from '@/components/ShowMoreTags.vue'
import useDebounce from '@/hooks/useDebounce'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import { mapGetters } from 'vuex'
import TrainingTabModel from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import TrainingLibraryPreviewDialog from '@/components/AwarenessEducator/TrainingLibraryPreviewDialog.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
export default {
  name: 'CampaignManagerCallbackScenarios',
  components: {
    TrainingLibraryPreviewDialog,
    AppDialogFooterWithClose,
    ShowMoreTags,
    KEmailPreview,
    AppDialog,
    Multipane,
    MultipaneResizer,
    CallbackTemplatePreviewSteps
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
    languageItems: {
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
              FilterItems: [
                { FieldName: 'LanguageTypeResourceId', Operator: 'Contains', Value: '' },
                {
                  Value: '',
                  FieldName: 'voice',
                  Operator: '='
                },
                { Value: '', FieldName: 'difficulty', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'name', Operator: 'Contains', Value: '' },
                { FieldName: 'difficulty', Operator: 'Contains', Value: '' },
                { FieldName: 'createdBy', Operator: 'Contains', Value: '' },
                { FieldName: 'tags', Operator: 'Contains', Value: '' },
                { FieldName: 'createTime', Operator: 'Contains', Value: '' }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      trainingTabModel: {},
      checkboxModel: {},
      labels,
      methods,
      difficulties: ['Easy', 'Medium', 'Hard'],
      search: '',
      isShowTemplate: false,
      selectedTemplateResourceId: null,
      isAttachmentBasedScenario: false,
      isShowSelectedScenarios: false,
      method: '',
      difficulty: '',
      language: '',
      emailTemplate: null,
      emailTemplateParams: null,
      callbackTemplate: null,
      phishingScenarioItems: [],
      isMethodMfa: false,
      isShowTrainingDialog: false,
      isTextToSpeechCompatible: false
    }
  },
  computed: {
    ...mapGetters({
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission'
    }),
    getVoiceResourceId() {
      return this.callbackTemplate?.vishingLanguageResourceId || null
    },
    getLanguageItems() {
      return this.languageItems?.map((language) => language.language)
    },
    getVoiceItems() {
      if (this.getSelectedLanguageShortCode) {
        return this.languageItems
          .filter((language) =>
            language.languageCode
              .toLowerCase()
              .includes(this.getSelectedLanguageShortCode.toLowerCase())
          )
          .map((language) => language.name)
      }
      return this.languageItems.map((language) => language.name)
    },

    getSelectedLanguage() {
      return this.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value
    },
    getSelectedLanguageShortCode() {
      if (this.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value) {
        const languageTypeResourceId = this.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value
        const selectedLanguageItemIndex = this.languages.findIndex(
          (language) => language.value === languageTypeResourceId
        )
        if (selectedLanguageItemIndex !== -1) {
          return this.languages[selectedLanguageItemIndex].text
        }
      }
      return ''
    },
    getContainerStyle() {
      return !this.isValid ? { border: '1px solid #ff5252 !important', borderRadius: '20px' } : {}
    },
    getSelectedScenarioSwitchLabel() {
      return `Only show selected scenarios (${this.value.length})`
    },
    getTableEmptyTextMessage() {
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : 'You do not have any Callback Scenarios'
    },
    getTableEmptySubMessage() {
      return this.isFilterOrSearchActive
        ? 'Go to Callback Simulator>Callback Scenarios to create a new scenario'
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
      return this.emailTemplate
    },
    getTemplateHeader() {
      return this.emailTemplateParams?.name || ''
    }
  },
  watch: {
    getSelectedLanguageShortCode(val) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems[1].Value = ''
    },
    defaultPhishingScenariosValuesMapped(val) {
      const setCheckbox = (resourceId = '') => {
        this.checkboxModel[resourceId] = true
      }
      const addTrainingKeyToTabModel = (val) => {
        this.$set(
          this.trainingTabModel,
          val.value,
          new TrainingTabModel(val.trainingId, val.trainingName, val.trainingLanguageIds, true)
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
          { FieldName: 'name', Operator: 'Contains', Value: val },
          { FieldName: 'difficulty', Operator: 'Contains', Value: val },
          { FieldName: 'createdBy', Operator: 'Contains', Value: val },
          { FieldName: 'tags', Operator: 'Contains', Value: val },
          { FieldName: 'createTime', Operator: 'Contains', Value: val }
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
    }
  },
  created() {
    if (!this.isEdit) {
      this.callForPhishingScenarios()
    }
  },
  methods: {
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
    callForSelectedPhishingScenario(resourceId = '') {
      CallbackService.getCallbackScenario(resourceId).then((response) => {
        const {
          data: { data }
        } = response
        if (!this.phishingScenarioItems.find((item) => item.resourceId === data.resourceId)) {
          this.phishingScenarioItems.push(data)
        }
        this.selectedTemplateResourceId = resourceId
        CallbackService.getCallbackScenarioPreview(resourceId).then((response) => {
          const { data: { data = {} } = {} } = response
          const { callbackTemplate, emailTemplate } = data
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
          const languageIndex = this.languageItems.findIndex(
            (language) => language.resourceId === callbackTemplate.vishingLanguageResourceId
          )
          this.callbackTemplate = {
            ...callbackTemplate,
            language: this.languageItems[languageIndex].language,
            voice: this.languageItems[languageIndex].name
          }
          this.callbackTemplate.invalidDialingNotice = { ...callbackTemplate.steps[0] }
          this.callbackTemplate.callGreeting = { ...callbackTemplate.steps[1] }
          this.callbackTemplate.steps.splice(0, 2)
          this.isTextToSpeechCompatible = [2, 3].includes(callbackTemplate.voiceProviderTypeId)
          this.tab = 'email'
        })
      })
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
      CallbackService.searchCallbackScenarios(this.axiosPayload).then((response) => {
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
      this.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value = ''
      this.axiosPayload.filter.FilterGroups[0].FilterItems[1].Value = ''
      this.axiosPayload.filter.FilterGroups[0].FilterItems[2].Value = ''
      this.axiosPayload = {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { FieldName: 'LanguageTypeResourceId', Operator: 'Contains', Value: '' },
                {
                  Value: '',
                  FieldName: 'voice',
                  Operator: '='
                },
                { Value: '', FieldName: 'difficulty', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'name', Operator: 'Contains', Value: '' },
                { FieldName: 'difficulty', Operator: 'Contains', Value: '' },
                { FieldName: 'createdBy', Operator: 'Contains', Value: '' },
                { FieldName: 'tags', Operator: 'Contains', Value: '' },
                { FieldName: 'createTime', Operator: 'Contains', Value: '' }
              ],
              FilterGroups: []
            }
          ]
        }
      }
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
