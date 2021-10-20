<template>
  <div class="emailTemplatePreview">
    <AppDialog
      icon="mdi-eye"
      size="ultraMaximum"
      :subtitle="labels.TemplatePreview"
      :status="isShowTemplate"
      :title="selectedTemplateHeader"
      style="overflow: hidden;"
      @changeStatus="toggleTemplateDialog"
    >
      <template #app-dialog-body>
        <k-shadow-frame :content="templateHTML" :key="templateHTML + 'appDialog'" />
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="toggleTemplateDialog"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </AppDialog>
    <div class="emailTemplatePreview__container" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main">
        <div class="emailTemplatePreview-content">
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
                  <k-select
                    :items="methods"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="method"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  ></k-select>
                </div>
                <div>
                  <k-select
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="difficulty"
                    item-value="value"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                  >
                  </k-select>
                </div>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical">
            <div
              class="pane"
              :style="{
                width: '25% !important',
                pointerEvents: isPhishingScenariosLoading ? 'none' : 'inherit'
              }"
            >
              <div
                v-for="(item, index) in getItems"
                :key="index"
                class="template-list"
                :class="{ 'template-list--selected': item.resourceId === value }"
                @click="setSelectedTemplate(item, index)"
              >
                <div class="d-flex justify-space-between mb-2">
                  <div class="d-flex flex-column wrapWord">
                    <div class="template-list--item template-list--item__header">
                      {{ item.name }}
                    </div>
                    <div class="template-list--item template-list--item__sub-header">
                      {{ item.method }}
                      &bull;
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
                  !isPhishingScenariosLoading &&
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
                  !isPhishingScenariosLoading &&
                  !loadingTemplatePreview &&
                  search &&
                  !search.length &&
                  !listData.length
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
                    @click="isShowTemplate = true"
                    v-if="!!templateHTML"
                  >
                    {{ 'mdi-fullscreen' }}
                  </v-icon>
                </div>
                <div class="template-preview__text pl-2" v-if="!!templateHTML">
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
                </div>
                <hr class="mt-2" v-if="!!templateHTML" />
                <k-shadow-frame :content="templateHTML" :key="templateHTML + 'vue'" />
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
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import { methods, difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import KSelect from '@/components/Common/Inputs/KSelect'
import { Multipane, MultipaneResizer } from 'vue-multipane'
export default {
  name: 'CampaignManagerPhishingScenarios',
  components: { KSelect, AppDialog, Multipane, MultipaneResizer },
  props: {
    items: {
      type: Array
    },
    value: {
      type: String
    },
    isPhishingScenariosLoading: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      search: '',
      isShowTemplate: false,
      selectedTemplateHeader: '',
      templateHTML: null,
      methods,
      difficulties,
      method: '',
      difficulty: ''
    }
  },
  computed: {
    getItems() {
      const { method, difficulty, search } = this
      if (!method && !difficulty && !search) return this.items
      let filteredItems = this.items
      if (search) {
        filteredItems = filteredItems.filter((item) => {
          const values = Object.values(item)
          return values.includes(search)
        })
      }
      if (difficulty) {
        filteredItems = filteredItems.filter((item) => item.difficulty === difficulty)
      }
      if (method) {
        filteredItems = filteredItems.filter((item) => item.method === method)
      }
      return filteredItems
    }
  },
  methods: {
    toggleTemplateDialog() {
      this.isShowTemplate = !this.isShowTemplate
    },
    setSelectedTemplate(val) {
      this.$emit(EMITS.ON_ITEM_CHANGE, val)
    }
  }
}
</script>

<style lang="scss"></style>
