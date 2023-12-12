<template>
  <div class="emailTemplatePreview">
    <app-dialog
      style="overflow: hidden;"
      custom-size="1600"
      max-height
      max-height-size="900"
      icon="mdi-eye"
      subtitle="Email Template Preview"
      :title="selectedTemplateHeader"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
    >
      <template #app-dialog-body>
        <KEmailPreview v-if="!!templateHTML" :html="templateHTML" :key="templateHTML" />
      </template>
      <template #app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <div class="emailTemplatePreview__container" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main">
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
                <div v-if="isCallback" style="max-width: 140px;">
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[2].value"
                    :items="languages"
                    placeholder="Language"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="getTemplatesForSearch"
                  >
                  </v-select>
                </div>
                <div style="max-width: 140px;">
                  <KSelect
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    :items="difficulties"
                    @change="getTemplatesForSearch"
                  />
                </div>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical">
            <div
              class="pane"
              :style="{
                width: '25% !important',
                minWidth: '360px',
                pointerEvents: loadingTemplates ? 'none' : 'inherit'
              }"
              @scroll="handleScroll"
            >
              <div
                v-for="(item, index) in listData"
                :key="item.name + index"
                :class="{
                  'template-list': true,
                  'template-list--selected': item['selected']
                }"
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
                      <template v-if="!isCallback">
                        {{ item['categoryName'] }}
                      </template>
                      <span class="template-list--item__sub-header--span"
                        ><span v-if="!isCallback" style="font-size: 20px; vertical-align: sub;"
                          >&bull;</span
                        >
                        by</span
                      >
                      {{ item['createdBy'] }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'template-list--item template-list--item__difficulty',
                      getItemDifficultyClass(item['difficultyName'])
                    ]"
                  >
                    {{ item['difficultyName'] }}
                  </div>
                </div>

                <div class="template-list--item">
                  {{ getItemDescription(item) }}
                </div>
                <div class="template-list--item d-flex justify-space-between align-center mt-2">
                  <ShowMoreTags :default-badges="item.tags" />
                  <div v-if="!item.tags || !item.tags.length">{{ '\xa0' }}</div>
                  <div class="d-flex align-center">
                    <div class="template-list--item__narrator mr-2">
                      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
                      <span class="template-list--item__language">{{ item.languageTypeName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  !loadingTemplatePreview &&
                  (search ||
                    bodyData.filter.FilterGroups[0].FilterItems[0].value ||
                    bodyData.filter.FilterGroups[0].FilterItems[1].value) &&
                  !listData.length
                "
                class="pl-5 pt-5"
              >
                Search criteria has no results
              </div>
              <div
                v-else-if="
                  !loadingTemplates && !loadingTemplatePreview && !search && !listData.length
                "
                class="pl-5 pt-5"
              >
                {{
                  isQuishingTypeIndividualPrintOut
                    ? 'You do not have any individual printout templates'
                    : 'You do not have Email Template'
                }}
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  !loadingTemplatePreview &&
                  !search &&
                  !listData.length &&
                  isQuishingTypeIndividualPrintOut
                "
                class="pl-5 pt-5"
              >
                Go to Quishing Simulator > Quishing Scenarios > Quishing Templates to create a new
                individual printout template
              </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1 }">
              <div class="template-preview">
                <div class="template-preview__icon">
                  <v-btn
                    v-if="!!templateHTML"
                    color="#2196F3"
                    icon
                    outlined
                    @click="isTemplateDetails = true"
                  >
                    <v-icon color="#2196f3" medium> mdi-fullscreen </v-icon>
                  </v-btn>
                </div>
                <div class="template-preview__text pl-2" v-if="!!templateHTML">
                  <div>
                    <span class="template-preview__text--title">Template Name: </span>
                    <span class="template-preview__text--body">{{ selectedTemplateHeader }}</span>
                  </div>
                  <div>
                    <span class="template-preview__text--title">Subject: </span>
                    <span class="template-preview__text--body">{{ templateSubject }}</span>
                  </div>
                  <div>
                    <span class="template-preview__text--title">From Name: </span>
                    <span class="template-preview__text--body">{{ templateFromName }}</span>
                  </div>
                  <div>
                    <span class="template-preview__text--title">From Email Address: </span>
                    <span class="template-preview__text--body">{{ templateFromEmail }}</span>
                  </div>
                  <div
                    v-if="phishingFile"
                    class="attachment-wrapper mt-2"
                    style="position: relative;"
                  >
                    <div class="attachment blue-attach mb-0">
                      <AttachmentsPreview
                        :deletable="false"
                        :att="phishingFile"
                        :isEmailTemplate="true"
                      />
                    </div>
                  </div>
                </div>
                <hr class="mt-4" v-if="!!templateHTML" />
                <k-email-preview
                  v-if="templateHTML"
                  :key="templateHTML"
                  :html="templateHTML"
                  is-extra-height
                />
              </div>
            </div>
          </multipane>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import AppDialog from '../AppDialog'
import { getEmailTemplatePreviewContent, getEmailTemplatesList } from '@/api/phishingsimulator'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
import InfiniteScroll from '@/directives/infinite-scroll'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import {
  getDefaultEmailTemplatePayload,
  SCENARIO_DIFFICULTIES,
  SCENARIO_METHODS
} from '@/components/PhishingScenarios/utils'
import useDebounce from '@/hooks/useDebounce'
import KSelect from '@/components/Common/Inputs/KSelect'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
export default {
  name: 'EmailTemplateListPreview',
  props: {
    scenarioDetailsLookup: { required: true },
    emailTemplateResourceId: { required: false },
    categoryResourceId: { type: String, default: '' },
    defaultBodyData: {
      type: Object
    },
    apiFuncs: {
      type: Object,
      default: () => ({
        list: getEmailTemplatesList,
        content: getEmailTemplatePreviewContent
      })
    },
    quishingType: {
      type: String,
      default: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL
    },
    languages: {
      type: Array
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  directives: {
    'infinite-scroll': InfiniteScroll
  },
  components: {
    KSelect,
    ShowMoreTags,
    KEmailPreview,
    Multipane,
    MultipaneResizer,
    AppDialog,
    AttachmentsPreview
  },
  mixins: [useDebounce],
  data() {
    return {
      phishingFile: null,
      search: null,
      listData: [],
      defaultListData: [],
      templateFromName: null,
      templateSubject: null,
      totalNumberOfPages: 1,
      templateFromEmail: null,
      methods: SCENARIO_METHODS,
      difficulties: SCENARIO_DIFFICULTIES,
      bodyData: this.defaultBodyData || getDefaultEmailTemplatePayload(this.categoryResourceId),
      loadingTemplatePreview: false,
      templateHTML: null,
      activeTemplateHTML: null,
      isTemplateDetails: null,
      selectedTemplateHeader: null,
      loadingTemplates: false,
      selectedTemplateId: null,
      selectedPreviousIndex: 0
    }
  },
  computed: {
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isQuishingTypeEmail() {
      if (!this.isQuishing) return false
      return this.quishingType.toLowerCase() === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL.toLowerCase()
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this.quishingType.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    }
  },
  watch: {
    search(newVal, oldVal) {
      if (!newVal) {
        if (
          this.bodyData.filter.FilterGroups[0].FilterItems[0].value ||
          this.bodyData.filter.FilterGroups[0].FilterItems[1].value
        ) {
          this.getTemplates(true)
        } else {
          this.listData = [...this.defaultListData].map((item) => ({
            ...item,
            selected: item.resourceId === this.emailTemplateResourceId
          }))
          this.templateHTML = this.activeTemplateHTML || this.templateHTML
        }
      } else {
        if (newVal !== oldVal) {
          this.callForSearch()
        }
      }
    }
  },
  mounted() {
    this.getTemplates(true, this.emailTemplateResourceId)
  },
  methods: {
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
    callForSearch() {
      this.debounce(() => {
        const copyOfBodyData = JSON.parse(JSON.stringify(this.bodyData))
        copyOfBodyData.pageNumber = 1
        copyOfBodyData.pageSize = 100
        copyOfBodyData.filter.FilterGroups[1].FilterItems[0].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[1].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[2].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[3].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[4].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[5].value = this.search
        this.checkAndAddResourceIdToPayload(true, copyOfBodyData)
        this.apiFuncs
          .list(copyOfBodyData)
          .then((response) => {
            const { data } = response
            if (!response.data.data.results.length) {
              this.listData = []
              this.activeTemplateHTML = this.templateHTML
              this.templateHTML = null
            } else {
              this.listData = data.data.results.map((item) => {
                return {
                  ...item,
                  selected: item.resourceId === this.emailTemplateResourceId
                }
              })
            }
          })
          .finally(() => {
            this.loadingTemplates = false
            this.showLoader = false
            this.$emit('loading', false)
          })
      }, 500)
    },
    getTemplatesForSearch() {
      this.bodyData.pageSize = 100
      if (this.search) {
        this.callForSearch()
      } else {
        this.getTemplates(true, this.emailTemplateResourceId, this.bodyData, true)
      }
    },
    checkAndAddResourceIdToPayload(isInitial, bodyData) {
      this.loadingTemplates = true
      this.$emit('loading', true)
      if (isInitial && this.emailTemplateResourceId) {
        bodyData.filter.FilterGroups[1].FilterItems.push({
          FieldName: 'ResourceId',
          Operator: 'Include',
          value: this.emailTemplateResourceId
        })
      }
    },
    getTemplates(
      isInitial = false,
      emailTemplateResourceId = '',
      bodyData = this.bodyData,
      isSearch = false
    ) {
      this.checkAndAddResourceIdToPayload(isInitial, bodyData)
      console.log(this.quishingType)
      if (this.isQuishingTypeIndividualPrintOut)
        bodyData.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT]
      else if (this.isQuishingTypeEmail)
        bodyData.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
      this.apiFuncs
        .list(bodyData)
        .then((response) => {
          const { data } = response
          this.totalNumberOfPages = data.data.totalNumberOfPages
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            data.data.results = data.data.results.map((item) => {
              return { ...item, selected: false }
            })
            if (isSearch) {
              this.listData = data.data.results
            } else {
              this.listData = [...this.listData, ...data.data.results]
              this.defaultListData = [...this.listData]
            }
            if (!emailTemplateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (!isInitial) return
            if (!!emailTemplateResourceId) {
              const index = this.listData.findIndex(
                (item) => item.resourceId === emailTemplateResourceId
              )
              if (index > -1) {
                this.setSelectedTemplate(this.listData[index], index, true)
                this.listData[index].selected = true
              }
            } else {
              this.setSelectedTemplate(this.listData[0], 0, true)
            }
            this.defaultListData = [...this.listData]
          }
        })
        .finally(() => {
          this.loadingTemplates = false
          this.showLoader = false
          this.$emit('loading', false)
        })
    },
    handleScroll(e) {
      const scrollPosition = e.target.scrollTop + e.target.offsetHeight
      const scrollHeight = e.target.scrollHeight - 30
      if (scrollPosition > scrollHeight) {
        this.debounce(() => {
          this.getDataAfterValidScroll()
        }, 250)
      }
    },
    getDataAfterValidScroll() {
      if (this.bodyData.pageNumber < this.totalNumberOfPages && !this.search) {
        this.bodyData.pageNumber += 1
        this.loadingTemplates = true
        this.getTemplates()
      }
    },
    setSelectedTemplate(item, index, isInitial = false) {
      this.listData = this.listData.map((item) => {
        return { ...item, selected: false }
      })
      if (index !== undefined) {
        if (this.listData[index]) {
          this.listData[index].selected = true
        }
        this.selectedPreviousIndex = index
      }
      this.loadingTemplatePreview = true
      this.$emit('selectedEmailTemplateChange', item.id, item)
      this.$emit('selectedEmailTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialEmailTemplateId', item.id)
      }
      this.apiFuncs
        .content(item.resourceId)
        .then((response) => {
          let template = response?.data?.data?.template || ''
          template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.selectedTemplateHeader = response?.data?.data?.name || ''
          this.templateHTML = template
          this.templateFromName = response?.data?.data?.fromName || ''
          this.templateSubject = response?.data?.data?.subject || ''
          this.templateFromEmail = response?.data?.data?.fromAddress || ''
          this.phishingFile = response?.data?.data?.phishingFileName
            ? {
                name: response?.data?.data?.phishingFileName
              }
            : null
        })
        .finally(() => {
          this.loadingTemplatePreview = false
        })
    }
  }
}
</script>
