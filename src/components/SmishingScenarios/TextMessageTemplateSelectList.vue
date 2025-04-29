<template>
  <div class="text-message-template-select-list">
    <div class="text-message-template-select-list__container" ref="topOfTheTemplate">
      <div class="text-message-template-select-list__container-main">
        <div class="text-message-template-select-list-content">
          <div class="text-message-template-select-list-content--search">
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
                class="template-list pr-6"
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
                      {{ item.categoryName }}
                      <span class="template-list--item__sub-header--span">by</span>
                      {{ item['createdBy'] }}
                    </div>
                  </div>
                  <div
                    class="template-list--item template-list--item__difficulty"
                    :class="
                      item['difficultyName'] === 'Easy'
                        ? 'difficulty-easy'
                        : item['difficultyName'] === 'Medium'
                        ? 'difficulty-medium'
                        : 'difficulty-hard'
                    "
                  >
                    {{ item['difficultyName'] }}
                  </div>
                </div>
                <div class="template-list--item">
                  {{ getItemDescription(item) }}
                </div>
                <div
                  class="template-list--item__tags d-flex justify-space-between align-center mt-2"
                >
                  <ShowMoreTags :showMaximumBadgeCount="1" :default-badges="item.tags" />
                  <div v-if="!item.tags.length">{{ '\xa0' }}</div>
                  <div class="template-list--item__narrator">
                    <v-icon :size="16" color="#757575">mdi-web</v-icon>
                    <span class="template-list--item__language">{{ item.languageTypeName }}</span>
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
                You do not have any text message templates
              </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane pt-4" :style="{ flexGrow: 1 }">
              <el-tabs value="textMessage">
                <el-tab-pane id="textMessage" label="Text Message" name="textMessage">
                  <div class="text-message-template-select-list__text-message__content">
                    <span class="text-message-template-select-list__text-message__text">{{
                      getTextMessage
                    }}</span>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </multipane>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import SmishingService from '@/api/smishing'
import ShowMoreTags from '@/components/ShowMoreTags'
import InfiniteScroll from '@/directives/infinite-scroll'
import useDebounce from '@/hooks/useDebounce'

export default {
  name: 'TextMessageTemplateSelectList',
  props: {
    templateResourceId: {
      type: String,
      default: ''
    },
    categoryResourceId: {
      type: String,
      required: true
    },
    languageOptions: {
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
    MultipaneResizer
  },
  data() {
    const methods = [
      { text: 'Click Only', value: 'WNZt0sCVCWB3' },
      { text: 'Data Submission', value: 'DYC0gugxJMjT' },
      {},
      { text: 'MFA', value: 'WNZt0sCVCWB3,DYC0gugxJMjT' }
    ]
    return {
      search: null,
      listData: [],
      template: null,
      defaultListData: [],
      totalNumberOfPages: 1,
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
                  value: methods[Number(this.categoryResourceId) - 1].value,
                  FieldName: 'CategoryResourceId',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'LanguageTypeResourceId',
                  Operator: 'Include'
                },
                {
                  value: '',
                  FieldName: 'DifficultyResourceId',
                  Operator: 'Include'
                }
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
    getLanguageItems() {
      return []
    },
    getTextMessage() {
      return this.template?.template
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
            selected: item.resourceId === this.templateResourceId
          }))
        }
      } else if (newVal !== oldVal) {
        this.callForSearch()
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
        SmishingService.searchTextMessageTemplates(copyOfBodyData)
          .then((response) => {
            if (!response.data.data.results.length) {
              this.listData = []
              this.template = null
            } else {
              this.listData = response.data.data.results.map((item) => {
                return {
                  ...item,
                  selected: item.resourceId === this.templateResourceId
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
      SmishingService.searchTextMessageTemplates(bodyData)
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
      SmishingService.getTextMessageTemplate(item.resourceId)
        .then((response) => {
          this.template = response.data.data
          this.$emit('selectedTemplateChange', { ...item, ...this.template })
        })
        .finally(() => {
          this.loadingTemplatePreview = false
        })
    }
  }
}
</script>
