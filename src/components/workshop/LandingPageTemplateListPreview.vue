<template>
  <div class="landingPagePreview">
    <app-dialog
      custom-size="1600"
      max-height
      max-height-size="900"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
      icon="mdi-eye"
      :title="selectedTemplateHeader"
      :subtitle="'Landing Page Template Preview'"
      style="overflow: hidden;"
    >
      <template v-slot:app-dialog-body>
        <KEmailPreview v-if="!!templateHTML" :html="templateHTML" />
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
        <div class="d-flex justify-space-between align-center mb-4">
          <v-select
            :items="listData"
            placeholder="Type"
            item-text="name"
            v-model="selectChangeValue"
            item-value="resourceId"
            outlined
            persistent-hint
            @change="selectChange"
            return-object
            class="selectChange"
          ></v-select>
          <span
            @click="showAdvancedSearch = !showAdvancedSearch"
            class="toggle-advanced-search ml-4 mr-4"
            style="cursor: pointer; min-width: 190px;"
            >{{ showAdvancedSearch ? 'Close Advanced Search' : 'Open Advanced Search' }}</span
          >
        </div>
        <div class="landingPagePreview-content" v-if="showAdvancedSearch">
          <div class="landingPagePreview-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <v-text-field
                    @mouseover.native="hover = true"
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter"
                    v-model.trim="search"
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
                    :items="scenarioDetailsLookup.methodTypes"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[0].value"
                    item-value="text"
                    outlined
                    persistent-hint
                    @change="getTemplatesForSearch"
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  ></v-select>
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
                :key="index"
                @click="setSelectedTemplate(item, index)"
                :class="{ 'template-list--selected': item['selected'] }"
              >
                <div class="d-flex justify-space-between mb-2">
                  <div class="d-flex flex-column wrapWord">
                    <div class="template-list--item template-list--item__header">
                      {{ item.name }}
                    </div>
                    <div class="template-list--item template-list--item__sub-header">
                      {{ item.categoryName }}
                      <span class="template-list--item__sub-header--span">by</span>
                      {{ item.createdBy }}
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
                  <v-chip
                    class="template-list--item template-list--item__chip p"
                    v-for="(value, key) in item.tags"
                    :key="value + key"
                  >
                    {{ value }}
                  </v-chip>
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
            <div class="pane" :style="{ flexGrow: 1 }">
              <div class="template-preview">
                <div class="template-preview__icon">
                  <v-icon
                    :color="'#2196f3'"
                    left
                    medium
                    @click="isTemplateDetails = true"
                    v-if="!!templateHTML"
                  >
                    {{ 'mdi-eye' }}
                  </v-icon>
                </div>
                <div class="template-preview__text pl-2" v-if="!!templateHTML">
                  <div>
                    <span class="template-preview__text--title">URL: </span>
                    <span class="template-preview__text--body">{{ templateURL }}</span>
                  </div>
                </div>
                <hr class="mt-2" v-if="!!templateHTML" />
                <KEmailPreview v-if="!!templateHTML" :html="templateHTML" />
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
import { getSelectedEmailPreview, searchNotifiedMail } from '@/api/threadSharing'
import AppDialog from '../AppDialog'
import { getLandingPageList, getLandingPageTemplatePreviewContent } from '@/api/landingPage'
import { scrollToComponent } from '@/utils/functions'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'LandingPageListPreview',
  props: {
    scenarioDetailsLookup: { required: true },
    landingPageTemplateResourceId: { required: false }
  },

  components: { KEmailPreview, Multipane, MultipaneResizer, AppDialog },
  data() {
    return {
      showAdvancedSearch: true,
      search: null,
      listData: [],
      backupListData: [],
      templateFromName: null,
      templateFromEmail: null,
      methods: [
        { text: 'Click Only', value: 'WNZt0sCVCWB3' },
        { text: 'Data Submission', value: 'DYC0gugxJMjT' },
        { text: 'Attachment', value: '7dLrW2kdBTDs' }
      ],
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
                { Value: '', FieldName: 'method', Operator: 'Include' },
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
      templateHTML: null,
      isTemplateDetails: null,
      selectedTemplateHeader: null,
      loadingTemplates: false,
      selectedLandingPageId: null,
      templateURL: null,
      selectedPreviousIndex: 0,
      selectChangeValue: null
    }
  },
  mounted() {
    this.getTemplates(true, this.landingPageTemplateResourceId)
  },
  methods: {
    selectChange(item) {
      this.setSelectedTemplate(
        this.listData[
          this.listData.findIndex((lItem) => lItem.resourceId === this.selectChangeValue.resourceId)
        ],
        this.listData.findIndex((lItem) => lItem.resourceId === this.selectChangeValue.resourceId)
      )
      this.$emit('selectedLandingPageChange', this.selectChangeValue.id)
      this.$emit('selectedLandingPageTemplateResourceId', this.selectChangeValue.resourceId)
    },
    getTemplatesForSearch() {
      this.bodyData.pageSize = 10
      this.getTemplates(true)
    },
    getTemplates(isInitial, landingPageTemplateResourceId) {
      this.loadingTemplates = true
      getLandingPageList(this.bodyData)
        .then((response) => {
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            const { data } = response
            data.data.results = data.data.results.map((item) => {
              return { ...item, selected: false }
            })
            this.listData = data.data.results
            if (!landingPageTemplateResourceId)
              this.listData[this.selectedPreviousIndex].selected = true
            if (isInitial) {
              if (!!landingPageTemplateResourceId) {
                this.setSelectedTemplate(
                  this.listData[
                    this.listData.findIndex(
                      (item) => item.resourceId === landingPageTemplateResourceId
                    )
                  ],
                  this.listData.findIndex(
                    (item) => item.resourceId === landingPageTemplateResourceId
                  )
                )
                this.listData[
                  this.listData.findIndex(
                    (item) => item.resourceId === landingPageTemplateResourceId
                  )
                ].selected = true
              } else {
                if (!landingPageTemplateResourceId) this.setSelectedTemplate(this.listData[0], 0)
              }
            }
          }
        })
        .finally(() => {
          this.loadingTemplates = false
          this.showLoader = false
        })
    },
    handleScroll(e) {
      const scrollPosition = e.target.scrollTop + e.target.offsetHeight
      const scrollHeight = e.target.scrollHeight - 30
      if (scrollPosition > scrollHeight) {
        if (this.bodyData.pageSize === this.listData.length) {
          this.bodyData.pageSize += 10
          this.debounce(() => {
            this.getTemplates()
          }, 250)
        }
      }
    },
    setSelectedTemplate(item, index) {
      this.listData = this.listData.map((item) => {
        return { ...item, selected: false }
      })
      this.backupListData = this.backupListData.map((item) => {
        return { ...item, selected: false }
      })
      this.listData[index].selected = true
      this.selectedPreviousIndex = index
      this.loadingTemplatePreview = true
      this.$emit('selectedLandingPageChange', item.id)
      this.$emit('selectedLandingPageTemplateResourceId', item.resourceId)
      getLandingPageTemplatePreviewContent(item.resourceId)
        .then((response) => {
          const { data } = response
          this.selectedTemplateHeader = response.data.data.landingPages[0].name
          this.templateHTML = response.data.data.landingPages[0].content
          this.templateURL = response.data.data.urlTemplate
        })
        .finally(() => {
          this.loadingTemplatePreview = false
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
      let _this = this
      this.loadingTemplates = true
      if (newVal != oldVal) {
        this.debounce(() => {
          this.bodyData.filter.FilterGroups[1].FilterItems[0].value = this.search
          this.bodyData.filter.FilterGroups[1].FilterItems[1].value = this.search
          this.bodyData.filter.FilterGroups[1].FilterItems[2].value = this.search
          this.bodyData.filter.FilterGroups[1].FilterItems[3].value = this.search
          this.bodyData.filter.FilterGroups[1].FilterItems[4].value = this.search
          this.bodyData.filter.FilterGroups[1].FilterItems[5].value = this.search
          this.getTemplates(true)
        }, 500)
      }
    },
    landingPageTemplateResourceId(newVal, oldVal) {
      this.selectChangeValue = newVal
    }
  }
}
</script>

<style lang="scss">
.landingPagePreview {
  .wrapWord {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }
  .toggle-advanced-search {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-transform: uppercase;
    color: #2196f3;
  }
  min-height: 80vh !important;
  padding-top: 10px;
  .difficulty-easy {
    background: #217124 !important;
  }
  .difficulty-medium {
    background: #2196f3 !important;
  }
  .difficulty-hard {
    background: #f56c6c !important;
  }
  &-title {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #383b41;
  }
  &-subtitle {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #383b41;
    margin-bottom: 16px;
  }
  &-content {
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    &--search {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  &__container {
    padding: 32px 120px 0 0 !important;
    width: 100%;
    &-main {
      .v-text-field__details {
        display: none;
      }
    }
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
  .landingPagePreview-class {
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5) !important;
    border: solid 1px rgba(100, 181, 246, 0.5) !important;
    background-color: #e3f2fd !important;
  }
  .k-dialog__title {
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #2196f3 !important;
  }
  .k-dialog__header-max-height {
    box-shadow: none !important;
    z-index: 9 !important;
    position: relative !important;
  }
  .k-dialog__header {
    padding: 0 !important;
    margin-bottom: 40px;
    border: none !important;
  }
  .filter-field-scenarios {
    padding: 24px 16px !important;
    max-width: 140px;
  }
  .template-list {
    padding: 16px 0 16px 24px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    cursor: pointer;
    &:hover,
    &--selected {
      background-color: #f1f8fe;
      .template-list--item__header {
        color: #2196f3 !important;
      }
      .v-chip .v-chip__content {
        font-family: Open Sans !important;
        font-style: normal !important;
        font-weight: 600 !important;
        font-size: 12px !important;
        line-height: 16px !important;
        color: #1173c1 !important;
      }
      .v-chip {
        background: #ffffff !important;
        border: 1px solid #1173c1 !important;
        box-sizing: border-box !important;
        border-radius: 4px !important;

        &:not(:last-child) {
          margin-right: 4px;
        }
      }
    }
    &--selected {
      .template-list--item__header {
        font-weight: 600 !important;
      }
    }
    &--item {
      .v-chip__content {
        font-family: Open Sans;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 12px !important;
        line-height: 16px !important;
        color: #757575 !important;
      }
      &:not(:last-child) {
        margin-bottom: 0 !important;
      }
      &__difficulty {
        padding: 4px 8px;
        background: #2196f3;
        border-radius: 4px;
        max-height: 24px;
        align-items: center;
        text-align: center;
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        color: #ffffff;
      }
      &__header {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #383b41;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &__sub-header {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 19px;
        color: #757575;
        &--span {
          font-weight: normal;
        }
      }
      &__chip {
        background: #ffffff !important;
        border: 1px solid #757575 !important;
        box-sizing: border-box;
        border-radius: 4px !important;
        font-family: Open Sans;
        font-style: normal;
        font-weight: 600 !important;
        font-size: 12px !important;
        line-height: 16px !important;
        color: #757575 !important;

        &:not(:last-child) {
          margin-right: 4px;
        }
      }
    }
  }
  .template-preview {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 0;
    &__text {
      &--title {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 19px;
        color: #383b41;
      }
      &--body {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 19px;
        color: #383b41;
      }
    }
    &__icon {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }
  }
  .multipane-resizer {
    // background: rgba(0, 0, 0, 0.51);
    // width: 8px;
  }

  .vertical-panes {
    width: 100%;
    height: 600px;
    padding: 0;
  }
  .vertical-panes > .pane {
    text-align: left;
    padding: 0;
    overflow: auto;
    background: #ffffff;
    &:first-child {
      border-bottom-left-radius: 24px;
      border-right: 5px solid #ccc;
    }
    &:last-child {
      border-bottom-right-radius: 24px;
    }
  }
}
</style>
