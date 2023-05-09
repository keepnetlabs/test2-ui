<template>
  <div class="landingPagePreview">
    <app-dialog
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
        <KEmailPreview v-if="!!getSelectedTemplateDetails" :html="getSelectedTemplateDetails" />
      </template>
      <template v-slot:app-dialog-footer>
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
    <div class="landingPagePreview__container" ref="topOfTheTemplate">
      <div class="landingPagePreview__container-main">
        <div class="landingPagePreview-content">
          <div class="landingPagePreview-content--search px-6 py-6">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <v-text-field
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
                  ></v-text-field>
                </div>
                <div>
                  <v-select
                    :items="scenarioDetailsLookup.difficultyTypes"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    item-value="text"
                    outlined
                    persistent-hint
                    @change="getTemplatesForSearch"
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  >
                  </v-select>
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
                class="template-list"
                v-for="(item, index) in listData"
                :key="item.name + index"
                @click="setSelectedTemplate(item, index)"
                :class="{ 'template-list--selected': item['selected'] }"
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
                  {{ getItemDescription(item) }}
                </div>
                <div class="template-list--item mt-2">
                  <ShowMoreTags :default-badges="item.tags" />
                  <div v-if="!item.tags.length">{{ '\xa0' }}</div>
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
              <el-tabs
                v-if="landingPageTemplates.length > 1"
                v-model="selectedTab"
                class="phishing-scenario-tab-container"
              >
                <el-tab-pane
                  v-for="(template, index) in landingPageTemplates"
                  :key="index"
                  :name="`${index + 1}`"
                  :label="`Page ${index + 1}`"
                >
                  <div class="template-preview">
                    <div class="template-preview__icon">
                      <v-btn
                        v-if="!!template.content"
                        color="#2196F3"
                        icon
                        outlined
                        @click="isTemplateDetails = true"
                      >
                        <v-icon color="#2196f3" medium>
                          {{ 'mdi-fullscreen' }}
                        </v-icon>
                      </v-btn>
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
                      :html="template.content"
                      :key="template.content"
                      is-extra-height
                    />
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div v-else>
                <div class="template-preview">
                  <div class="template-preview__icon">
                    <v-btn
                      v-if="!!getSingleTemplateDetails"
                      :color="'#2196f3'"
                      icon
                      outlined
                      @click="isTemplateDetails = true"
                    >
                      <v-icon color="#2196f3" medium>
                        {{ 'mdi-fullscreen' }}
                      </v-icon>
                    </v-btn>
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
import { getLandingPageList, getLandingPageTemplatePreviewContent } from '@/api/landingPage'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
export default {
  name: 'LandingPageListPreview',
  props: {
    scenarioDetailsLookup: { required: true },
    landingPageTemplateResourceId: { required: false },
    categoryResourceId: { type: String, default: '' },
    method: { type: String, default: '' }
  },
  components: { ShowMoreTags, KEmailPreview, Multipane, MultipaneResizer, AppDialog },
  directives: {
    'infinite-scroll': InfiniteScroll
  },
  data() {
    const methods = [
      { text: 'Click Only', value: 'WNZt0sCVCWB3' },
      { text: 'Data Submission', value: 'DYC0gugxJMjT' },
      { text: 'Attachment', value: '7dLrW2kdBTDs' }
    ]
    return {
      templateName: '',
      selectedTab: '1',
      landingPageTemplates: [],
      search: null,
      listData: [],
      totalNumberOfPages: 1,
      defaultListData: [],
      methods,
      difficulties: [
        { text: 'Easy', value: 'mT0CeYGgKsVb' },
        { text: 'Medium', value: 'Z5XeVlpw6Dps' },
        { text: 'Hard', value: 'c4LCGEB9MayB' }
      ],
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
                  FieldName: 'Method',
                  Operator: '='
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
      selectedPreviousIndex: 0
    }
  },
  computed: {
    getSelectedTemplateHeader() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[parseInt(this.selectedTab) - 1]?.name || ''
        : this.landingPageTemplates?.[0]?.name || ''
    },
    getSelectedTemplateDetails() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[parseInt(this.selectedTab) - 1]?.content || ''
        : this.landingPageTemplates?.[0]?.content || ''
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    },
    getLandingPageHtmlKey() {
      return `${this.getSingleTemplateDetails}-${this.templateName}`
    }
  },
  mounted() {
    this.getTemplates(true, this.landingPageTemplateResourceId)
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
        getLandingPageList(copyOfBodyData)
          .then((response) => {
            const { data } = response
            if (!response.data.data.results.length) {
              this.listData = []
            } else {
              data.data.results = data.data.results.map((item) => {
                return {
                  ...item,
                  selected: item.resourceId === this.landingPageTemplateResourceId
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
      getLandingPageList(this.bodyData)
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
            if (!landingPageTemplateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (!isInitial) return
            if (!!landingPageTemplateResourceId) {
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
      this.$emit('selectedLandingPageChange', item.id)
      this.$emit('selectedLandingPageTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialLandingPageTemplateId', item.id)
      }
      getLandingPageTemplatePreviewContent(item.resourceId)
        .then((response) => {
          this.templateURL = response?.data?.data?.urlTemplate || ''
          this.templateName = response?.data?.data?.name
          this.selectedTemplateHeader = response?.data?.data?.landingPages[0]?.name || ''
          this.landingPageTemplates = response?.data?.data?.landingPages || []
        })
        .finally(() => {
          this.loadingTemplatePreview = false
          this.selectedTab = '1'
        })
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
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
      } else {
        if (newVal !== oldVal) {
          this.callForSearch()
        }
      }
    }
  }
}
</script>
