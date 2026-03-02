<template>
  <div class="landingPagePreview">
    <AppDialog
      style="overflow: hidden;"
      subtitle="Landing Page Template Preview"
      custom-size="1600"
      max-height
      max-height-size="900"
      icon="mdi-eye"
      :status="isTemplateDetails"
      :title="getSelectedTemplateHeader"
      @changeStatus="isTemplateDetails = false"
    >
      <template #app-dialog-body>
        <KEmailPreview
          v-if="!!getSelectedTemplateDetails"
          :html="getSelectedTemplateDetails"
          :key="getSelectedTemplateDetails"
        />
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
    </AppDialog>
    <div class="landingPagePreview__container" ref="topOfTheTemplate">
      <div class="landingPagePreview__container-main">
        <div class="landingPagePreview-content">
          <div class="landingPagePreview-content--search px-6 py-6">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <VTextField
                    v-model.trim="search"
                    style="
                      max-width: 328px;
                      min-width: 328px;
                      width: 100%;
                      padding-right: 4px !important;
                    "
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                  />
                </div>
                <div>
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    :items="languageOptions"
                    placeholder="Language"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
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
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[2].value"
                    :items="scenarioDetailsLookup.difficultyTypes"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    hide-details
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
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
                width: '25%',
                pointerEvents: loadingTemplates ? 'none' : 'inherit'
              }"
              @scroll="handleScroll"
            >
              <div
                v-for="(item, index) in listData"
                class="template-list pr-6"
                :key="item.name + index"
                :class="{ 'template-list--selected': item['selected'] }"
                @click="setSelectedTemplate(item, index)"
              >
                <div class="d-flex justify-space-between mb-2">
                  <div class="d-flex flex-column wrapWord">
                    <div class="template-list--item template-list--item__header">
                      {{ item.name }}
                    </div>
                    <div class="template-list--item template-list--item__sub-header">
                      {{ item.method }}
                      <span class="template-list--item__sub-header--span">
                        <span style="font-size: 20px; vertical-align: sub;">&#8226;</span>
                        by</span
                      >
                      {{ item['createdBy'] }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'template-list--item template-list--item__difficulty',
                      getItemDifficultyClass(item.difficulty)
                    ]"
                  >
                    {{ item.difficulty }}
                  </div>
                </div>

                <div class="template-list--item">
                  {{ getItemDescription(item) }}
                </div>
                <div class="template-list--item d-flex justify-space-between align-center mt-2">
                  <ShowMoreTags :default-badges="item.tags" />
                  <div v-if="!item.tags.length">{{ '\xa0' }}</div>
                  <EmailTemplateListLeftSideLanguages :item="item" />
                </div>
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  !loadingTemplatePreview &&
                  search &&
                  !!search.length &&
                  !listData.length
                "
                class="pl-5 pt-5"
              >
                Search criteria has no results
              </div>
              <div
                v-if="
                  !loadingTemplates &&
                  search &&
                  !search.length &&
                  !loadingTemplatePreview &&
                  !listData.length
                "
                class="pl-5 pt-5"
              >
                You do not have Landing Page Template
              </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane pt-4" :style="{ flexGrow: 1 }">
              <ElTabs v-if="landingPageTemplates.length > 1 || isMethodMfa" v-model="selectedTab">
                <ElTabPane
                  v-for="(template, index) in landingPageTemplates"
                  :key="index"
                  :name="`${index + 1}`"
                  :label="`Page ${index + 1}`"
                >
                  <div class="template-preview">
                    <div class="template-preview__icon">
                      <VBtn
                        v-if="!!template.content"
                        color="#2196F3"
                        icon
                        outlined
                        @click="isTemplateDetails = true"
                      >
                        <VIcon color="#2196f3" medium>
                          mdi-fullscreen
                        </VIcon>
                      </VBtn>
                    </div>
                    <div class="template-preview__text pl-2" v-if="!!template.content">
                      <div>
                        <span class="template-preview__text--title">Template Name: </span>
                        <span class="template-preview__text--body">{{ templateName }}</span>
                      </div>
                      <div>
                        <span class="template-preview__text--title">Phishing URL: </span>
                        <span class="template-preview__text--body">{{ templateURL }}</span>
                      </div>
                    </div>
                    <hr class="mt-2" v-if="!!template.content" />
                    <KEmailPreview
                      v-if="!!template.content"
                      is-extra-height
                      :key="template.content"
                      :html="template.content"
                    />
                  </div>
                </ElTabPane>
                <ElTabPane v-if="isMethodMfa" label="MFA Settings" name="mfa">
                  <div class="ml-6">
                    <ConfigureCompanyStepHeader
                      class="mb-6"
                      :title="labels.MultiFactorAuthentication"
                      :subtitle="labels.MultiFactorAuthenticationSub"
                    />
                    <VForm ref="refMfaForm">
                      <InputCallerPhoneNumber
                        v-model="mfaData.mfaSenderNumberResourceId"
                        select-first-item
                        isSmishing
                        :caller-phone-number.sync="mfaData.mfaCallerPhoneNumber"
                        :title="labels.SenderPhoneNumber"
                        :sub-title="labels.SenderPhoneNumberSub"
                      />
                      <FormGroup
                        :title="labels.VerificationMessage"
                        :sub-title="labels.VerificationMessageSub"
                      >
                        <div class="d-flex mt-2">
                          <span class="mr-4 fs-4">SMS Message</span>
                          <VTextarea
                            v-model.trim="mfaData.mfaTextTemplate"
                            outlined
                            dense
                            no-resize
                            persistent-hint
                            rows="2"
                            height="76"
                            hint="SMS supports the GSM-7 character set and can contain up to 148 characters"
                            placeholder="Enter your SMS message"
                            :rules="mfaMessageRules"
                          />
                        </div>
                      </FormGroup>
                    </VForm>
                  </div>
                </ElTabPane>
              </ElTabs>
              <div v-else>
                <div class="template-preview">
                  <div class="template-preview__icon">
                    <VBtn
                      v-if="!!getSingleTemplateDetails"
                      icon
                      outlined
                      color="#2196f3"
                      @click="isTemplateDetails = true"
                    >
                      <VIcon color="#2196f3" medium>
                        mdi-fullscreen
                      </VIcon>
                    </VBtn>
                  </div>
                  <div class="template-preview__text pl-2" v-if="!!getSingleTemplateDetails">
                    <div>
                      <span class="template-preview__text--title">Template Name: </span>
                      <span class="template-preview__text--body">{{ templateName }}</span>
                    </div>
                    <div>
                      <span class="template-preview__text--title">Phishing URL: </span>
                      <span class="template-preview__text--body">{{ templateURL }}</span>
                    </div>
                  </div>
                  <hr class="mt-2" v-if="!!getSingleTemplateDetails" />
                  <KEmailPreview
                    v-if="!!getSingleTemplateDetails"
                    :html="getSingleTemplateDetails"
                    :key="getLandingPageHtmlKey"
                    is-extra-height
                  />
                </div>
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
import InfiniteScroll from '@/directives/infinite-scroll'
import AppDialog from '../AppDialog'
import SmishingService from '@/api/smishing'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { SCENARIO_DIFFICULTIES, SCENARIO_METHODS } from '@/components/PhishingScenarios/utils'
import useDebounce from '@/hooks/useDebounce'
import ConfigureCompanyStepHeader from '../Companies/ConfigureCompanyStepHeader'
import labels from '@/model/constants/labels'
import InputCallerPhoneNumber from '../Common/Inputs/InputCallerPhoneNumber'
import FormGroup from '../SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getItemDifficultyClass } from '@/components/Common/Simulator/utils'
import EmailTemplateListLeftSideLanguages from '@/components/workshop/EmailTemplateListLeftSideLanguages.vue'

export default {
  name: 'LandingPageListPreview',
  mixins: [useDebounce],
  components: {
    FormGroup,
    InputCallerPhoneNumber,
    ConfigureCompanyStepHeader,
    KSelect,
    ShowMoreTags,
    KEmailPreview,
    Multipane,
    MultipaneResizer,
    AppDialog,
    EmailTemplateListLeftSideLanguages
  },
  directives: {
    'infinite-scroll': InfiniteScroll
  },
  props: {
    scenarioDetailsLookup: { required: true },
    landingPageTemplateResourceId: { required: false },
    categoryResourceId: { type: String, default: '' },
    method: { type: String, default: '' },
    isMethodMfa: { type: Boolean, default: false },
    mfaData: {
      type: Object,
      default: () => ({})
    },
    languageOptions: {
      type: Array,
      default: () => []
    },
    textTemplateMethod: {
      type: String
    }
  },
  data() {
    return {
      Validations,
      labels,
      templateName: '',
      selectedTab: '1',
      landingPageTemplates: [],
      search: null,
      listData: [],
      totalNumberOfPages: 1,
      defaultListData: [],
      methods: SCENARIO_METHODS,
      difficulties: SCENARIO_DIFFICULTIES,
      bodyData: {
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
                {
                  value: this.method,
                  FieldName: 'method',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'LanguageTypeResourceId',
                  Operator: 'Include'
                },
                { Value: '', FieldName: 'difficulty', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'Name', Operator: 'Contains', Value: '' },
                { FieldName: 'Method', Operator: 'Contains', Value: '' },
                { FieldName: 'Difficulty', Operator: 'Contains', Value: '' },
                { FieldName: 'CreatedBy', Operator: 'Contains', Value: '' },
                { FieldName: 'Tags', Operator: 'Contains', Value: '' },
                { FieldName: 'CreateTime', Operator: 'Contains', Value: '' }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      loadingTemplatePreview: false,
      isTemplateDetails: null,
      loadingTemplates: false,
      templateURL: null,
      selectedPreviousIndex: 0,
      mfaMessageRules: [
        (v) => Validations.required(v),
        (v) => {
          if (v && v.toLowerCase().includes('{mfa_code}')) {
            if (v.includes('{MFA_CODE}')) return true
            return 'Only use uppercase letters for the merge tag'
          }
          return true
        },
        (v) => Validations.maxLength(v, 148, labels.getMaxLengthMessage(labels.SMS, 148)),
        (v) => Validations.isGsm7(v)
      ]
    }
  },
  computed: {
    getSelectedTemplateHeader() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[Number.parseInt(this.selectedTab) - 1]?.name || ''
        : this.landingPageTemplates?.[0]?.name || ''
    },
    getSelectedTemplateDetails() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[Number.parseInt(this.selectedTab) - 1]?.content || ''
        : this.landingPageTemplates?.[0]?.content || ''
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    },
    getLandingPageHtmlKey() {
      return `${this.getSingleTemplateDetails}-${this.templateName}`
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
            selected: item.resourceId === this.landingPageTemplateResourceId
          }))
        }
      } else if (newVal !== oldVal) {
        this.callForSearch()
      }
    }
  },
  mounted() {
    this.getTemplates(true, this.landingPageTemplateResourceId)
  },
  methods: {
    getItemDifficultyClass,
    getItemDescription(item = {}) {
      if (!item?.description) {
        return '\xa0'
      }

      if (item?.description === 'null' || item?.description === 'undefined') {
        return '\xa0'
      }

      return item?.description || '\xa0'
    },
    callForSearch() {
      this.debounce(() => {
        const copyOfBodyData = structuredClone(this.bodyData)
        copyOfBodyData.pageNumber = 1
        copyOfBodyData.pageSize = 100
        copyOfBodyData.filter.FilterGroups[1].FilterItems[0].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[1].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[2].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[3].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[4].value = this.search
        copyOfBodyData.filter.FilterGroups[1].FilterItems[5].value = this.search
        this.checkAndAddResourceIdToPayload(true, copyOfBodyData)
        SmishingService.searchLandingPageTemplates(copyOfBodyData)
          .then((response) => {
            const { data } = response
            if (!response.data.data.results.length) {
              this.listData = []
            } else {
              data.data.results = data.data.results.map((item) => {
                return {
                  ...item,
                  selected: item.resourceId === this.landingPageTemplateResourceId,
                  languageTypeName:
                    this.languageOptions.find(
                      (lang) => lang.languageTypeName === item.languageTypeName
                    )?.text || item.languageTypeName
                }
              })
              this.listData = data.data.results
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
        this.getTemplates(true, this.landingPageTemplateResourceId, this.bodyData, true)
      }
    },
    checkAndAddResourceIdToPayload(isInitial, bodyData) {
      this.loadingTemplates = true
      this.$emit('loading', true)
      if (isInitial && this.landingPageTemplateResourceId) {
        bodyData.filter.FilterGroups[1].FilterItems.push({
          FieldName: 'ResourceId',
          Operator: 'Include',
          value: this.landingPageTemplateResourceId
        })
      }
    },
    getTemplates(
      isInitial = false,
      landingPageTemplateResourceId = '',
      bodyData = this.bodyData,
      isSearch = false
    ) {
      this.loadingTemplates = true
      this.$emit('loading', true)
      if (isInitial && this.landingPageTemplateResourceId) {
        this.bodyData.filter.FilterGroups[1].FilterItems.push({
          FieldName: 'ResourceId',
          Operator: 'Include',
          value: this.landingPageTemplateResourceId
        })
      }
      if (this.isMethodMfa) {
        this.bodyData.filter.FilterGroups[0].FilterItems[0].value = this.textTemplateMethod
      }
      SmishingService.searchLandingPageTemplates(this.bodyData)
        .then((response) => {
          const { data } = response
          this.totalNumberOfPages = data.data.totalNumberOfPages
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            data.data.results = data.data.results.map((item) => {
              return {
                ...item,
                selected: false,
                languageTypeName:
                  this.languageOptions.find(
                    (lang) => lang.languageTypeName === item.languageTypeName
                  )?.text || item.languageTypeName
              }
            })
            if (isSearch) {
              this.listData = data.data.results
            } else {
              this.listData = [...this.listData, ...data.data.results]
              this.defaultListData = [...this.listData]
            }
            if (!landingPageTemplateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (!isInitial) return
            if (landingPageTemplateResourceId) {
              const index = this.listData.findIndex(
                (item) => item.resourceId === landingPageTemplateResourceId
              )
              if (index > -1) {
                this.setSelectedTemplate(this.listData[index], index, true)
                this.listData[index].selected = true
              } else {
                this.setSelectedTemplate(this.listData[0], 0, true)
                this.listData[0].selected = true
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
      this.$emit('selectedLandingPageTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialLandingPageTemplateId', item.id)
      }
      SmishingService.getLandingPageTemplate(item.resourceId)
        .then((response) => {
          this.templateURL = response?.data?.data?.urlTemplate || ''
          this.templateName = response?.data?.data?.name
          this.selectedTemplateHeader = response?.data?.data?.landingPages[0]?.name || ''
          this.landingPageTemplates = response?.data?.data?.landingPages || []
          this.$emit('selectedLandingPageChange', {
            ...item,
            ...response.data.data
          })
        })
        .finally(() => {
          this.loadingTemplatePreview = false
          this.selectedTab = '1'
        })
    },
    validateMfaForm() {
      if (!this.isMethodMfa) return true
      if (this.$refs.refMfaForm.validate()) {
        if (this.mfaData.mfaTextTemplate.includes('{MFA_CODE}')) return true
        this.$store.dispatch('common/createSnackBar', {
          message:
            'You cannot iterate to next step without adding an {MFA_CODE} to the verification message field.',
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-information'
        })
        return false
      }
      return false
    }
  }
}
</script>
