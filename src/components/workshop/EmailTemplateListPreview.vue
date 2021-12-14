<template>
  <div class="emailTemplatePreview">
    <app-dialog
      custom-size="1600"
      max-height
      max-height-size="900"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
      icon="mdi-eye"
      :title="selectedTemplateHeader"
      :subtitle="'Email Template Preview'"
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
    <div class="emailTemplatePreview__container" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main">
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
        <div class="emailTemplatePreview-content" v-if="showAdvancedSearch">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <v-text-field
                    @mouseover.native="hover = true"
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
                  ></v-text-field>
                </div>
                <div>
                  <v-select
                    :items="methods"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[0].value"
                    item-value="value"
                    outlined
                    persistent-hint
                    @change="getTemplatesForSearch"
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  ></v-select>
                </div>
                <div>
                  <v-select
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
                    item-value="value"
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
                width: '25% !important',
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
                      <span class="template-list--item__sub-header--span"
                        ><span style="font-size: 20px; vertical-align: sub;">&bull;</span> by</span
                      >
                      {{ item.createdBy }}
                    </div>
                  </div>
                  <div
                    class="template-list--item template-list--item__difficulty mr-8"
                    :class="
                      item.difficultyName === 'Easy'
                        ? 'difficulty-easy'
                        : item.difficultyName === 'Medium'
                        ? 'difficulty-medium'
                        : 'difficulty-hard'
                    "
                  >
                    {{ item.difficultyName }}
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
                You do not have Email Template
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
                  <div class="mb-2">
                    <span class="template-preview__text--title">Subject: </span>
                    <span class="template-preview__text--body">{{ templateSubject }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="template-preview__text--title">From Name: </span>
                    <span class="template-preview__text--body">{{ templateFromName }}</span>
                  </div>
                  <div>
                    <span class="template-preview__text--title">From Email Address: </span>
                    <span class="template-preview__text--body">{{ templateFromEmail }}</span>
                  </div>
                </div>
                <hr class="mt-2" v-if="!!templateHTML" />
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
import { getSelectedEmailPreview, searchNotifiedMail } from '@/api/threadSharing'
import AppDialog from '../AppDialog'
import { getEmailTemplatePreviewContent, getEmailTemplatesList } from '@/api/phishingsimulator'
import { scrollToComponent } from '@/utils/functions'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
export default {
  name: 'EmailTemplateListPreview',
  props: {
    scenarioDetailsLookup: { required: true },
    emailTemplateResourceId: { required: false }
  },
  components: { ShowMoreTags, KEmailPreview, Multipane, MultipaneResizer, AppDialog },
  data() {
    return {
      showAdvancedSearch: true,
      search: null,
      listData: [],
      backupListData: [],
      templateFromName: null,
      templateSubject: null,
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
                { value: '', FieldName: 'CategoryResourceId', Operator: 'Include' },
                { value: '', FieldName: 'DifficultyResourceId', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                { FieldName: 'Name', Operator: 'Contains', value: '' },
                { FieldName: 'CategoryName', Operator: 'Contains', value: '' },
                { FieldName: 'DifficultyName', Operator: 'Contains', value: '' },
                { FieldName: 'CreatedBy', Operator: 'Contains', value: '' },
                { FieldName: 'Tags', Operator: 'Contains', value: '' },
                { FieldName: 'CreateTime', Operator: 'Contains', value: '' }
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
      selectedTemplateId: null,
      selectedPreviousIndex: 0,
      selectChangeValue: null
    }
  },
  mounted() {
    this.getTemplates(true, this.emailTemplateResourceId)
  },
  methods: {
    selectChange(item) {
      this.setSelectedTemplate(
        this.listData[
          this.listData.findIndex((lItem) => lItem.resourceId === this.selectChangeValue.resourceId)
        ],
        this.listData.findIndex((lItem) => lItem.resourceId === this.selectChangeValue.resourceId)
      )
      this.$emit('selectedEmailTemplateChange', this.selectChangeValue.id)
      this.$emit('selectedEmailTemplateResourceId', this.selectChangeValue.resourceId)
    },
    getTemplatesForSearch() {
      this.bodyData.pageSize = 10
      this.getTemplates(true)
    },
    getTemplates(isInitial, emailTemplateResourceId) {
      this.loadingTemplates = true
      getEmailTemplatesList(this.bodyData)
        .then((response) => {
          const { data } = response
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            data.data.results = data.data.results.map((item) => {
              return { ...item, selected: false }
            })
            this.listData = data.data.results
            if (!emailTemplateResourceId) {
              this.listData[this.selectedPreviousIndex].selected = true
            }
            if (isInitial) {
              if (!!emailTemplateResourceId) {
                this.setSelectedTemplate(
                  this.listData[
                    this.listData.findIndex((item) => item.resourceId === emailTemplateResourceId)
                  ],
                  this.listData.findIndex((item) => item.resourceId === emailTemplateResourceId)
                )
                this.listData[
                  this.listData.findIndex((item) => item.resourceId === emailTemplateResourceId)
                ].selected = true
              } else {
                if (!emailTemplateResourceId) this.setSelectedTemplate(this.listData[0], 0)
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
            this.loadingTemplates = true
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
      this.$emit('selectedEmailTemplateChange', item.id)
      this.$emit('selectedEmailTemplateResourceId', item.resourceId)
      getEmailTemplatePreviewContent(item.resourceId)
        .then((response) => {
          const { data } = response
          this.selectedTemplateHeader = response.data.data.name
          this.templateHTML = response.data.data.template
          this.templateFromName = response.data.data.fromName
          this.templateSubject = response.data.data.subject
          this.templateFromEmail = response.data.data.fromAddress
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
    emailTemplateResourceId(newVal, oldVal) {
      this.selectChangeValue = newVal
    }
  }
}
</script>

<style lang="scss">
.emailTemplatePreview {
  .toggle-advanced-search {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-transform: uppercase;
    color: #2196f3;
  }
  .wrapWord {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
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
  .emailTemplatePreview-class {
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
        font-weight: 600;
        letter-spacing: normal;
        color: #383b41;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        margin-right: 24px;
      }
      &__sub-header {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
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
        font-weight: 600 !important;
        padding: 4px 8px;
        max-height: 24px;
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
