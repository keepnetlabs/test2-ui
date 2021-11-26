<template>
  <div class="workshop">
    <app-dialog
      custom-size="1600"
      max-height
      max-height-size="900"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
      icon="mdi-eye"
      :title="selectedTemplateHeader"
      :subtitle="'Email Template Preview'"
    >
      <template v-slot:app-dialog-body>
        <k-shadow-frame
          class="grapesjs-reset-css"
          style="pointer-events: none;"
          :content="templateHTML"
          :key="templateHTML + 'appDialog'"
        />
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
    <div class="workshop__container">
      <div class="workshop__container-main">
        <v-list-item class="k-dialog__header" :class="['k-dialog__header-max-height']">
          <div class="v-btn v-cart-icon-wrapper workshop-class">
            <v-icon :color="'#2196f3'" class="ml-2" left medium>
              {{ 'mdi-information' }}
            </v-icon>
          </div>
          <div>
            <v-list-item-title class="k-dialog__title"
              >Phishing Scenario List Preview</v-list-item-title
            >
          </div>
        </v-list-item>
        <div class="workshop-title">Phishing Scenario</div>
        <div class="workshop-subtitle">
          Select a scenario to view and edit. You can also create a template from scratch
        </div>
        <div class="workshop-content">
          <div class="workshop-content--search">
            <div class="d-flex justify-space-between">
              <v-text-field
                @mouseover.native="hover = true"
                placeholder="Search"
                outlined
                class="filter-field filter-field-scenarios search-wrapper__search-filter"
                v-model.trim="search"
                hide-details
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
              <div class="filter-field filter-field-scenarios">
                <v-icon right color="#2196f3" style="font-size: 24px; cursor: pointer;"
                  >mdi-close-circle-outline</v-icon
                >
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical">
            <div
              class="pane"
              :style="{
                width: '50%',
                minWidth: '25%',
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
                <div class="template-list--item template-list--item__header">
                  {{ item.subject }}
                </div>
                <div class="template-list--item">
                  <v-icon :color="'#909399'" class="mr-2" left medium> {{ 'mdi-web' }} </v-icon
                  >English (UK), English (US), Turkish
                </div>
                <div class="template-list--item">
                  <v-icon :color="'#909399'" class="mr-2" left medium> {{ 'mdi-shape' }} </v-icon
                  >{{ item.result }}
                </div>
                <div class="template-list--item">
                  <v-icon :color="'#909399'" class="mr-2" left medium>
                    {{ 'mdi-television' }} </v-icon
                  >{{ item.source }}
                </div>
                <div class="template-list--item">
                  <v-icon :color="'#909399'" class="mr-2" left medium>
                    {{ 'mdi-account-multiple' }} </v-icon
                  >{{ item.reportedBy }}
                </div>
                <div class="template-list--item">
                  <v-chip
                    class="template-list--item__chip"
                    color="#2196f3"
                    v-for="(value, key) in item.tags"
                    :key="value + key"
                  >
                    {{ value }}
                  </v-chip>
                </div>
              </div>
              <div v-if="this.search && !listData.length">Search criteria has no results</div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1 }">
              <div class="template-preview" v-if="tabOptions.length">
                <div class="template-preview__icon">
                  <v-icon
                    :color="'#2196f3'"
                    left
                    medium
                    @click="isTemplateDetails = true"
                    v-if="!!templateHTML"
                  >
                    {{ 'mdi-open-in-app' }}
                  </v-icon>
                </div>
                <v-tabs v-model="selectedTab">
                  <v-tab v-for="n in tabOptions" :key="n"> {{ n }} </v-tab>
                </v-tabs>
                <v-tabs-items v-model="selectedTab">
                  <v-tab-item v-for="item in tabOptions" :key="item">
                    <v-card flat>
                      <v-card-text>{{ item }}</v-card-text>
                      <k-shadow-frame
                        class="grapesjs-reset-css"
                        style="pointer-events: none;"
                        :content="templateHTML"
                        :key="templateHTML + '_'"
                      />
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
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
export default {
  name: 'PhishingScenarioPreview',
  props: {},
  components: { Multipane, MultipaneResizer, AppDialog },
  data() {
    return {
      tabOptions: [],
      search: null,
      listData: [],
      backupListData: [],
      templatePayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'createTime',
        ascending: false,
        clusteredBy: ''
      },
      loadingTemplatePreview: false,
      templateHTML: null,
      isTemplateDetails: null,
      selectedTemplateHeader: null,
      loadingTemplates: false,
      selectedTab: 'tab-1'
    }
  },
  mounted() {
    this.getTemplates()
  },
  methods: {
    getTemplates() {
      this.loadingTemplates = true
      searchNotifiedMail(this.templatePayload)
        .then((response) => {
          const { data } = response
          data.data.results = data.data.results.map((item) => {
            return { ...item, selected: false }
          })
          if (this.search) {
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
            this.$nextTick(() => {
              this.listData = this.backupListData.reduce((acc, item) => {
                Object.values(item).find((i) => {
                  if (
                    typeof i === 'string' &&
                    i.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
                  )
                    return acc.push(item)
                })
                return acc
              }, [])
            })
          } else {
            this.listData = data.data.results
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
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
        this.templatePayload.pageSize += 10
        this.debounce(() => {
          this.getTemplates()
        }, 250)
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
      this.loadingTemplatePreview = true
      this.tabOptions = this.listData[index].tags
      getSelectedEmailPreview(item.resourceId)
        .then((response) => {
          const { data } = response
          this.selectedTemplateHeader = response.data.data.subject
          this.templateHTML = response.data.data.initialBody
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
      if (newVal != oldVal) {
        this.debounce(() => {
          if (!newVal) {
            _this.listData = _this.backupListData
          } else {
            if (_this.listData && _this.backupListData) {
              _this.listData = _this.backupListData.reduce((acc, item) => {
                Object.values(item).find((i) => {
                  if (
                    typeof i === 'string' &&
                    i.toLocaleLowerCase().includes(newVal.toLocaleLowerCase())
                  )
                    return acc.push(item)
                })
                return acc
              }, [])
            }
            setTimeout(() => {
              this.$forceUpdate()
            }, 50)
          }
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss">
.workshop {
  min-height: 80vh !important;
  padding-top: 10px;
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
    padding: 0 16px 24px 16px !important;
    width: 100%;
    &-main {
      border-radius: 20px;
      -webkit-box-shadow: 0 10px 15px -5px rgb(205 205 205 / 50%);
      box-shadow: 0 10px 15px -5px rgb(205 205 205 / 50%);
      background-color: #ffffff;
      padding: 24px !important;
    }
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
  .workshop-class {
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
    max-width: 330px;
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
    }
    &--selected {
      .template-list--item__header {
        font-weight: 600 !important;
      }
    }
    &--item {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &__header {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #383b41;
      }
      &__chip {
        padding: 4px 6px;
        border-radius: 4px;
        background-color: #2196f3;
        color: #ffffff;
        &:not(:last-child) {
          margin-right: 4px;
        }
      }
    }
  }
  .template-preview {
    max-width: 620px;
    margin: 0 auto;
    padding: 24px 0;
    &__icon {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
      z-index: 9;
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
