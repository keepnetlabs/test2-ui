<template>
  <div class="callback-template-select-list">
    <div class="callback-template-select-list__container" ref="topOfTheTemplate">
      <div class="callback-template-select-list__container-main">
        <div class="callback-template-select-list-content">
          <div class="callback-template-select-list-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <v-text-field
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter pr-2"
                    v-model.trim="search"
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
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[0].value"
                    :items="getLanguageItems"
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
                <div>
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    :items="getVoiceItems"
                    :disabled="!bodyData.filter.FilterGroups[0].FilterItems[0].value"
                    placeholder="Voice"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="getTemplatesForSearch"
                  >
                  </v-select>
                </div>
                <div>
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[2].value"
                    :items="difficulties"
                    placeholder="Difficulty"
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
                class="template-list"
                v-for="(item, index) in listData"
                :key="item.name + index"
                :class="{ 'template-list--selected': item['selected'] }"
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
                      <span class="template-list--item__sub-header--span">by</span>
                      {{ item['createdBy'] }}
                    </div>
                  </div>
                  <div
                    class="template-list--item template-list--item__difficulty"
                    :class="
                      item['difficulty'] === 'Easy'
                        ? 'difficulty-easy'
                        : item['difficulty'] === 'Medium'
                        ? 'difficulty-medium'
                        : 'difficulty-hard'
                    "
                  >
                    {{ item['difficulty'] }}
                  </div>
                </div>

                <div class="template-list--item">
                  {{ getItemDescription(item) }}
                </div>
                <div class="template-list--item__tags flex-column align-stretch">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div class="template-list--item__narrator">
                      <v-icon :size="16" color="#757575">mdi-web</v-icon>
                      <span class="template-list--item__language">{{ item.language }}</span>
                    </div>
                    <div class="template-list--item__narrator">
                      <v-icon :size="16" color="#757575">mdi-microphone-outline</v-icon>
                      <span class="template-list--item__language">{{ item.voice }}</span>
                    </div>
                  </div>
                  <ShowMoreTags :showMaximumBadgeCount="1" :default-badges="item.tags" />
                  <div v-if="!item.tags.length">{{ '\xa0' }}</div>
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
                You do not have any callback templates
              </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1 }">
              <div class="template-preview" v-if="!!template">
                <div class="template-preview__steps">
                  <CallbackTemplatePreviewSteps
                    :template="template"
                    :isTextToSpeechCompatible="isTextToSpeechCompatible"
                    :voiceResourceId="voiceResourceId"
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
import CallbackService from '@/api/callback'
import ShowMoreTags from '@/components/ShowMoreTags'
import InfiniteScroll from '@/directives/infinite-scroll'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import useDebounce from '@/hooks/useDebounce'

export default {
  name: 'CallbackTemplateSelectList',
  props: {
    templateResourceId: {
      type: String,
      default: ''
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  mixins: [useDebounce],
  directives: {
    'infinite-scroll': InfiniteScroll
  },
  components: {
    ShowMoreTags,
    Multipane,
    MultipaneResizer,
    CallbackTemplatePreviewSteps
  },
  data() {
    return {
      isTextToSpeechCompatible: false,
      voiceResourceId: '',
      search: null,
      listData: [],
      template: null,
      defaultListData: [],
      totalNumberOfPages: 1,
      difficulties: [
        { text: 'Easy', value: 'Easy' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Hard', value: 'Hard' }
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
                  value: '',
                  FieldName: 'language',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'voice',
                  Operator: 'Include'
                },
                { value: '', FieldName: 'difficulty', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'name', Operator: 'Contains', value: '' },
                { FieldName: 'difficulty', Operator: 'Contains', value: '' },
                { FieldName: 'createdBy', Operator: 'Contains', value: '' },
                { FieldName: 'tags', Operator: 'Contains', value: '' },
                { FieldName: 'createTime', Operator: 'Contains', value: '' }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      loadingTemplatePreview: false,
      loadingTemplates: false,
      selectedPreviousIndex: 0
    }
  },
  computed: {
    getSelectedLanguage() {
      return this.bodyData.filter.FilterGroups[0].FilterItems[0].value
    },
    getSelectedVoice() {
      return this.bodyData.filter.FilterGroups[0].FilterItems[1].value
    },
    getLanguageItems() {
      return this.languages?.map((language) => language.language)
    },
    getVoiceItems() {
      if (this.getSelectedLanguage) {
        const voiceItems = this.languages?.filter(
          (language) => language.language === this.getSelectedLanguage
        )
        const voices = voiceItems.map((voice) => voice.name)
        return voices
      }

      return []
    }
  },
  watch: {
    getSelectedLanguage() {
      this.bodyData.filter.FilterGroups[0].FilterItems[1].value = ''
    },
    search(newVal, oldVal) {
      if (!newVal) {
        if (
          this.bodyData.filter.FilterGroups[0].FilterItems[0].value ||
          this.bodyData.filter.FilterGroups[0].FilterItems[1].value ||
          this.bodyData.filter.FilterGroups[0].FilterItems[2].value
        ) {
          this.getTemplates(true)
        } else {
          this.listData = [...this.defaultListData].map((item) => ({
            ...item,
            selected: item.resourceId === this.templateResourceId
          }))
        }
      } else {
        if (newVal !== oldVal) {
          this.callForSearch()
        }
      }
    }
  },
  mounted() {
    this.getTemplates(true, this.templateResourceId)
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
        this.checkAndAddResourceIdToPayload(true, copyOfBodyData)
        CallbackService.searchCallbackTemplates(copyOfBodyData)
          .then((response) => {
            if (!response.data.data.results.length) {
              this.listData = []
              this.template = null
            } else {
              this.listData = response.data.data.results.map((item) => {
                return { ...item, selected: item.resourceId === this.templateResourceId }
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
        this.getTemplates(true, this.templateResourceId, this.bodyData, true)
      }
    },
    checkAndAddResourceIdToPayload(isInitial, bodyData) {
      this.loadingTemplates = true
      this.$emit('loading', true)
      if (isInitial && this.templateResourceId) {
        bodyData.filter.FilterGroups[1].FilterItems.push({
          FieldName: 'ResourceId',
          Operator: 'Include',
          value: this.templateResourceId
        })
      }
    },
    getTemplates(
      isInitial = false,
      templateResourceId = '',
      bodyData = this.bodyData,
      isSearch = false
    ) {
      this.checkAndAddResourceIdToPayload(isInitial, bodyData)
      CallbackService.searchCallbackTemplates(bodyData)
        .then((response) => {
          const { data } = response
          this.totalNumberOfPages = data.data.totalNumberOfPages
          if (!response.data.data.results.length) {
            this.listData = []
            this.template = null
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
            if (!templateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (!isInitial) return
            if (templateResourceId) {
              const index = this.listData.findIndex(
                (item) => item.resourceId === templateResourceId
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
      this.$emit('selectedTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialTemplateId', item.resourceId)
      }
      CallbackService.getCallbackTemplatePreview(item.resourceId)
        .then((response) => {
          this.template = response.data.data
          this.template = {
            ...this.template,
            invalidDialingNotice: { ...this.template.steps[0] },
            callGreeting: { ...this.template.steps[1] },
            language: item.language,
            voice: item.voice
          }
          this.template.steps.splice(0, 2)
          const voiceIndex = this.languages.findIndex(
            (language) => language.language === item.language && language.name === item.voice
          )
          if (voiceIndex !== -1) {
            this.isTextToSpeechCompatible = [2, 3].includes(
              this.languages[voiceIndex].voiceProviderTypeId
            )
            this.voiceResourceId = this.languages[voiceIndex].resourceId
          }
          this.$emit('selectedTemplateChange', { ...item, ...this.template })
        })
        .finally(() => {
          this.loadingTemplatePreview = false
        })
    }
  }
}
</script>
