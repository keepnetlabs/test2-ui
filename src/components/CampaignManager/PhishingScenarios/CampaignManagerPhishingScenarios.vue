<template>
  <div
    class="emailTemplatePreview campaign-manager-phishing-scenarios pt-0"
    style="min-height: auto !important;"
  >
    <EmailTemplateMultipleLanguagePreviewDialog
      v-if="isShowEmailTemplatePreview && emailTemplatePreviewSelectedRow"
      ref="emailTemplatePreviewDialog"
      :status="isShowEmailTemplatePreview"
      :selected-row="emailTemplatePreviewSelectedRow"
      :type="type"
      :languages="languages"
      is-nested
      :should-control-html-overflow="false"
      @on-close="isShowEmailTemplatePreview = false"
    />
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isShowLandingPagePreview && landingPagePreviewSelectedRow"
      ref="landingPagePreviewDialog"
      :status="isShowLandingPagePreview"
      :selected-row="landingPagePreviewSelectedRow"
      :type="type"
      :languages="languages"
      is-nested
      :should-control-html-overflow="false"
      @on-close="isShowLandingPagePreview = false"
    />
    <CampaignManagerPhishingScenariosPreviewDialog
      v-if="isShowTemplate"
      :status="isShowTemplate"
      :landing-page-params="landingPageParams"
      :email-template="emailTemplate"
      :email-template-params="emailTemplateParams"
      :tab="tab"
      :landing-page-templates="landingPageTemplates"
      @on-close="toggleTemplateDialog"
    />
    <TrainingLibraryCommonComponents />
    <div class="emailTemplatePreview__container pt-0" ref="topOfTheTemplate">
      <div class="emailTemplatePreview__container-main" :style="getContainerStyle">
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <VTextField
                    v-model.trim="search"
                    placeholder="Search"
                    outlined
                    class="filter-field filter-field-scenarios search-wrapper__search-filter campaign-manager-phishing-scenarios__search pr-2"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="padding-right: 4px !important;"
                  />
                </div>
                <div>
                  <KSelect
                    v-model="method"
                    :items="getMethodItems"
                    placeholder="Type"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    customMenuClass="campaign-manager-phishing-scenarios__filter-menu"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 172px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-if="data.index === 0">Type ({{ method.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="language"
                    placeholder="Language"
                    item-disabled="disabled"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    type="combobox"
                    multiple
                    min-width-type="medium"
                    :items="languages"
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-if="data.index === 0">Language ({{ language.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="difficulty"
                    :items="difficulties"
                    placeholder="Difficulty"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 196px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-if="data.index === 0">Difficulty ({{ difficulty.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div>
                  <KSelect
                    v-model="category"
                    :items="getCategoryItems"
                    placeholder="Category"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="text"
                    outlined
                    persistent-hint
                    class="filter-field-scenarios"
                    customMenuClass="campaign-manager-phishing-scenarios__filter-menu"
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 205px;
                    "
                    type="combobox"
                    multiple
                    :slots="{ selection: true }"
                    @change="isShowSelectedScenarios = false"
                  >
                    <template #selection="data">
                      <span v-if="data.index === 0">Category ({{ category.length }})</span>
                    </template>
                  </KSelect>
                </div>
                <div style="position: relative;">
                  <VSnackbar
                    :value="isAIAllyHighlightVisible"
                    :timeout="-1"
                    absolute
                    multi-line
                    top
                    color="#2195f3"
                    class="emailTemplatePreview__ai-ally-highlight"
                    content-class="emailTemplatePreview__ai-ally-highlight-content"
                  >
                    <VIcon color="#FFFFFF" class="mr-2" :size="24">mdi-creation</VIcon>
                    <div class="emailTemplatePreview__ai-ally-highlight-content-center">
                      <span style="font-weight: 600;">NEW!</span>
                      <span style="font-weight: 400; font-size: 12px;">
                        {{
                          isPreferredLanguage
                            ? `AI Ally customizes scenarios based on user details, including location, department, phone number, and preferred language. Select a category to enable this feature.`
                            : `AI Ally customizes scenarios based on user details, including location, department, and phone number. Select a category to enable this feature.`
                        }}
                      </span>
                    </div>
                    <v-btn color="#FFFFFF" icon @click="isAIAllyHighlightVisible = false">
                      <VIcon color="#FFFFFF" :size="24">mdi-close</VIcon>
                    </v-btn>
                    <div class="triangle">
                      <div class="over-triangle"></div>
                    </div>
                  </VSnackbar>
                  <VTooltip bottom :disabled="!!category.length" nudge-top="26">
                    <template #activator="{ on }">
                      <div v-on="on">
                        <KSelect
                          v-model="scenarioDistribution"
                          :items="scenarioDistributionItems"
                          placeholder="Select scenarios manually"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="filter-field-scenarios campaign-manager-phishing-scenarios__distribution-type"
                          customMenuClass="campaign-manager-phishing-scenarios__filter-menu"
                          style="padding-right: 4px !important; padding-left: 4px !important;"
                          :disabled="!category.length"
                          :slots="{ item: true, selection: true }"
                        >
                          <template #selection="{ item }">
                            <div
                              class="d-flex align-center campaign-manager-phishing-scenarios__distribution-type-selection"
                            >
                              <VIcon v-if="item.value === 3" color="#2196F3" class="mr-2" small
                                >mdi-creation</VIcon
                              >
                              {{ item.text }}
                            </div>
                          </template>
                          <template #item="{ item, on }">
                            <VListItem v-on="on" :class="getListItemClasses(item.value)">
                              <VListItemTitle>
                                <VIcon v-if="item.value === 3" color="#2196F3" class="mr-2" small
                                  >mdi-creation</VIcon
                                >
                                <span
                                  :class="[
                                    item.value !== 3 && scenarioDistribution === item.value
                                      ? 'ml-5'
                                      : item.value !== 3
                                      ? 'ml-6'
                                      : ''
                                  ]"
                                  >{{ item.text }}</span
                                >
                              </VListItemTitle>
                            </VListItem>
                          </template>
                        </KSelect>
                      </div>
                    </template>
                    <span>Select category first.</span>
                  </VTooltip>
                </div>
              </div>
            </div>
            <div v-if="getBadges.length" class="campaign-manager-phishing-scenarios__badges">
              <div class="campaign-manager-phishing-scenarios__badge-container">
                <div
                  v-for="(filterBadge, index) in getBadges"
                  :key="index"
                  class="campaign-manager-phishing-scenarios__badge"
                >
                  <span class="campaign-manager-phishing-scenarios__badge-key"
                    >{{ filterBadge.key }}:</span
                  >
                  <span class="campaign-manager-phishing-scenarios__badge-value">{{
                    filterBadge.value
                  }}</span>
                  <div>
                    <VIcon
                      class="fw-600 cursor-pointer"
                      style="font-size: 20px; margin-top: -2px;"
                      color="#757575"
                      @click="handleRemoveFilter(filterBadge)"
                      >mdi-close</VIcon
                    >
                  </div>
                </div>
              </div>
              <VBtn
                class="campaign-manager-phishing-scenarios__clear-all"
                color="#2196F3"
                text
                :ripple="false"
                @click="resetFilters"
              >
                Clear All
              </VBtn>
            </div>
          </div>
          <div class="px-6 pt-4 d-flex justify-space-between align-center">
            <div>
              <ElTabs v-model="upperTab" class="phishing-campaign-tab-container">
                <ElTabPane name="scenarios" label="Scenarios" />
                <ElTabPane
                  v-if="
                    scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY &&
                    getTrainingSearchPermission
                  "
                  name="training"
                  label="Training"
                >
                  <CampaignManagerPhishingScenariosTrainingTab
                    v-model="trainingForCategory"
                    ref="categoryTrainingTab"
                    class="pb-4"
                    :is-show-reminder="isShowReminder"
                    :type="type"
                    :is-edit="isEdit"
                    isCategory
                    :enum-types="enumTypes"
                    :isAttachmentBasedScenario="isAttachmentBasedScenario"
                    @on-preview="handleCategoryTrainingPreviewButtonClick"
                  />
                </ElTabPane>
              </ElTabs>
            </div>
            <div v-if="isPhishing">
              <v-btn
                class="emailTemplatePreview__edit-button"
                color="#2196F3"
                outlined
                rounded
                @click="handleCreatePhishingScenarioClick"
              >
                <v-icon left color="#2196f3" medium> mdi-plus </v-icon>
                <span class="emailTemplatePreview__edit-button-text">Create Scenario</span>
              </v-btn>
            </div>
          </div>
          <multipane
            v-if="upperTab === 'scenarios'"
            class="vertical-panes"
            layout="vertical"
            :style="getStyle"
          >
            <template v-if="getItems.length">
              <div
                class="pane"
                :style="{
                  width: '25% !important',
                  minWidth: '360px'
                }"
                @scroll="handleScroll"
              >
                <div v-if="!isSingle || !isDistributionManually" class="my-5 mx-6">
                  <VSwitch
                    v-model="isShowSelectedScenarios"
                    id="input--campaign-manager-show-selected-status"
                    class="k-switch selected-scenario-switch"
                    hide-details
                    color="#2196f3"
                    :label="getSelectedScenarioSwitchLabel"
                    :disabled="isShowSelectedScenariosSwitchDisabled"
                  />
                </div>
                <div
                  v-for="item in getItems"
                  :key="item.resourceId"
                  :class="getItemClasses(item.resourceId)"
                  @click="callForSelectedPhishingScenario(item.resourceId, item)"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <div class="d-flex overflow-hidden">
                      <VCheckbox
                        v-if="!isSingle && scenarioDistribution === SCENARIO_DISTRIBUTION.MANUALLY"
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
                          {{ item.method }}
                          &#8226;
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

                  <div class="template-list--item">
                    {{ getItemDescription(item) }}
                  </div>
                  <div class="template-list--item d-flex justify-space-between align-center mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                    <div v-if="!item.tags || !item.tags.length">
                      {{ '\xa0' }}
                    </div>
                    <EmailTemplateListLeftSideLanguages v-if="isPhishing" :item="item" />
                    <div v-else class="d-flex align-center">
                      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
                      <span class="template-list--item__language">{{ item.languageTypeName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <ElTabs v-model="tab" class="phishing-scenario-tab-container">
                  <ElTabPane
                    id="campaign-manager-info--email-content"
                    name="email"
                    :label="labels.JustEmail"
                  >
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
                          <span class="fw-600 text-primary-color">Template Name: </span>
                          <span class="fw-400 text-primary-color">{{
                            emailTemplateParams && emailTemplateParams.name
                          }}</span>
                        </div>
                        <div style="background: #e0e0e0; height: 1px; max-width: 554px;"></div>
                        <div class="mb-4">
                          <InputLanguagePreview
                            v-model="languagePreview"
                            persistent-hint
                            class="max-w-554 campaign-manager-phishing-scenario-input-language"
                            :hint="getEmailTemplatePreviewLanguageHint"
                            :items="selectedTemplateLanguages"
                            :hide-details="false"
                            :languages="languages"
                            @input="handleEmailTemplatePreviewLanguageChange"
                          />
                          <div class="mb-2">
                            <span class="fw-600 text-primary-color">Subject: </span>
                            <span class="fw-400 text-primary-color">{{
                              emailTemplateParams && emailTemplateParams.subject
                            }}</span>
                          </div>
                          <div class="mb-2">
                            <span class="fw-600 text-primary-color">From Name: </span>
                            <span class="fw-400 text-primary-color">{{
                              emailTemplateParams && emailTemplateParams.fromName
                            }}</span>
                          </div>
                          <div class="mb-2">
                            <span class="fw-600 text-primary-color">From Email Address:</span>
                            <span class="fw-400 text-primary-color">{{
                              emailTemplateParams && emailTemplateParams.fromAddress
                            }}</span>
                          </div>
                          <div>
                            <span class="fw-600 text-primary-color">CC:</span>
                            <span class="fw-400 text-primary-color">{{
                              emailTemplateParams && emailTemplateParams.cc
                            }}</span>
                          </div>
                        </div>
                        <div
                          v-if="!!getPhishingFile"
                          class="attachment-wrapper mt-2"
                          style="position: relative;"
                        >
                          <div class="attachment blue-attach mb-0">
                            <AttachmentsPreview
                              :deletable="false"
                              :att="getPhishingFile"
                              :isEmailTemplate="true"
                            />
                          </div>
                        </div>
                      </div>
                      <hr v-if="!!emailTemplate" />
                      <KEmailPreview
                        v-if="!!emailTemplate"
                        :key="emailTemplate"
                        :html="emailTemplate"
                      />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    v-if="!isAttachmentBasedScenario"
                    :key="getLandingPageKey"
                    :label="labels.LandingPage"
                    name="landing-page"
                    id="campaign-manager-info--landing-content"
                  >
                    <TabsWithMfaSettings
                      v-if="isLandingPageTabsVisible || isMethodMfa"
                      class="tabs-with-mfa-settings"
                      :is-sub-tab="false"
                      :is-phishing-scenario="true"
                      :isMethodMfa="isMethodMfa"
                      :landing-page-params="landingPageParams"
                      :landing-page-templates="landingPageTemplates"
                      :selected-languages="selectedLandingPageLanguages"
                      :language-preview="landingPageLanguagePreview"
                      @language-change="handleLandingPageLanguageChange"
                    />
                    <div v-else class="template-preview pt-0">
                      <div class="template-preview__icon">
                        <v-btn
                          v-if="!!getSingleTemplateDetails"
                          :color="'#2196f3'"
                          icon
                          outlined
                          @click="handleClickPreview"
                        >
                          <v-icon color="#2196f3" medium>
                            mdi-fullscreen
                          </v-icon>
                        </v-btn>
                      </div>
                      <div class="template-preview__text pl-2" v-if="!!getSingleTemplateDetails">
                        <div>
                          <span
                            class="template-preview__text--title"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '600' } : {}"
                            >Template Name:
                          </span>
                          <span
                            class="template-preview__text--body"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '400' } : {}"
                            >{{ landingPageParams.name }}
                          </span>
                        </div>
                        <div
                          v-if="
                            isPhishing &&
                            selectedLandingPageLanguages &&
                            selectedLandingPageLanguages.length > 1
                          "
                          style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
                        ></div>
                        <div
                          v-if="
                            isPhishing &&
                            selectedLandingPageLanguages &&
                            selectedLandingPageLanguages.length > 1
                          "
                          style="max-width: 554px; margin-top: 8px; margin-bottom: 8px;"
                        >
                          <InputLanguagePreview
                            v-model="landingPageLanguagePreview"
                            class="campaign-manager-phishing-scenario-input-language"
                            persistent-hint
                            :hint="`This template is available in ${
                              selectedLandingPageLanguages.length
                            } language${selectedLandingPageLanguages.length > 1 ? 's' : ''}.`"
                            :items="selectedLandingPageLanguages"
                            :hide-details="false"
                            @input="handleLandingPageLanguageChange"
                          />
                        </div>
                        <div :class="isPhishing ? 'mt-n3' : ''">
                          <span
                            class="template-preview__text--title"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '600' } : {}"
                            >Phishing URL:
                          </span>
                          <span
                            class="template-preview__text--body"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '400' } : {}"
                            >{{ landingPageParams.urlTemplate }}
                          </span>
                        </div>
                        <div>
                          <span
                            class="template-preview__text--title"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '600' } : {}"
                            >Stop Bot Activity:
                          </span>
                          <span
                            class="template-preview__text--body"
                            :style="isPhishing ? { 'font-size': '16px', 'font-weight': '400' } : {}"
                            >{{ landingPageParams.isInvisibleCaptchaEnabled }}
                          </span>
                        </div>
                      </div>
                      <hr class="mt-4" v-if="!!getSingleTemplateDetails" />
                      <KEmailPreview
                        v-if="!!getSingleTemplateDetails"
                        is-landing-page
                        :html="previewLandingHtml"
                        :is-red-flagged-template="isSelectedLandingTemplateRedFlagged"
                      />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    v-if="isShowTrainingTab"
                    :label="labels.Training"
                    name="training"
                    id="campaign-manager-info--training-content"
                  >
                    <CampaignManagerPhishingScenariosTrainingTab
                      v-if="isShowTrainingTab"
                      ref="trainingTab"
                      v-model="trainingTabModel[selectedTemplateResourceId]"
                      :is-show-reminder="isShowReminder"
                      :type="type"
                      :is-edit="isEdit"
                      :enum-types="enumTypes"
                      :isAttachmentBasedScenario="isAttachmentBasedScenario"
                      @on-preview="handleTrainingPreviewButtonClick"
                    />
                  </ElTabPane>
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
import { getScenario, getScenariosList } from '@/api/scenarios'
import labels from '@/model/constants/labels'
import {
  difficulties,
  PHISHING_SCENARIOS_METHOD_TYPE_BY_ID,
  quishingMethods,
  methods
} from '@/components/CampaignManager/CampaignManagerInfo/utils'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import KEmailPreview from '@/components/KEmailPreview.vue'
import ShowMoreTags from '@/components/ShowMoreTags.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import useDebounce from '@/hooks/useDebounce'
import { getDefaultAxiosPayload, createRandomCryptStringNumber } from '@/utils/functions'
import TabsWithMfaSettings from '../../PhishingScenarios/TabsWithMfaSettings.vue'
import CampaignManagerPhishingScenariosTrainingTab from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosTrainingTab.vue'
import CampaignManagerPhishingScenariosPreviewDialog from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosPreviewDialog.vue'
import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import TrainingTabModel, {
  QuishingTrainingTabModel
} from '@/components/CampaignManager/PhishingScenarios/trainingTabModel'
import { mapGetters } from 'vuex'
import { SCENARIO_TYPES, getItemDifficultyClass } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getEnrollmentSendTypeIdByEnum } from '@/components/CampaignManager/PhishingScenarios/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import {
  scenarioDistributionItems,
  SCENARIO_DISTRIBUTION
} from '@/components/CampaignManager/utils'
import InputLanguagePreview from '../../Common/Inputs/InputLanguagePreview.vue'
import EmailTemplateListLeftSideLanguages from '@/components/workshop/EmailTemplateListLeftSideLanguages.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
export default {
  name: 'CampaignManagerPhishingScenarios',
  components: {
    InputLanguagePreview,
    TrainingLibraryCommonComponents,
    CampaignManagerPhishingScenariosPreviewDialog,
    EmailTemplateMultipleLanguagePreviewDialog,
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    CampaignManagerPhishingScenariosTrainingTab,
    TabsWithMfaSettings,
    ShowMoreTags,
    KEmailPreview,
    KSelect,
    Multipane,
    MultipaneResizer,
    AttachmentsPreview,
    EmailTemplateListLeftSideLanguages
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
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    isShowReminder: {
      type: Boolean,
      default: false
    },
    formDetails: {
      type: Object
    },
    initialCategoryFilter: {
      type: Object
    },
    initialTrainingForCategory: {
      type: Object
    },
    initialScenarioDistribution: {
      type: Number
    },
    isPreferredLanguage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAIAllyHighlightVisible: true,
      SCENARIO_DISTRIBUTION,
      scenarioDistributionItems,
      tab: 'email',
      upperTab: 'scenarios',
      axiosPayload: getDefaultAxiosPayload(),
      checkboxModel: {},
      trainingTabModel: {},
      trainingForCategory:
        this.type === SCENARIO_TYPES.QUISHING
          ? new QuishingTrainingTabModel()
          : new TrainingTabModel(),
      labels,
      quishingMethods,
      difficulties,
      search: '',
      isShowTemplate: false,
      selectedTemplateResourceId: null,
      isAttachmentBasedScenario: false,
      isShowSelectedScenarios: false,
      method: '',
      difficulty: '',
      language: '',
      category: '',
      totalPhishingScenariosCount: 0,
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null,
      landingPageTemplates: [],
      phishingScenarioItems: [],
      isMethodMfa: false,
      isShowTrainingDialog: false,
      languagePreview: [],
      selectedTemplateLanguages: [],
      isShowCategoryTrainingDialog: false,
      enumTypes: {},
      phishingEmailTemplates: [],
      isShowEmailTemplatePreview: false,
      emailTemplatePreviewSelectedRow: null,
      isShowLandingPagePreview: false,
      landingPagePreviewSelectedRow: null,
      landingPageLanguagePreview: '',
      selectedLandingPageLanguages: []
    }
  },
  computed: {
    ...mapGetters({
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog'
    }),
    getLandingPageKey() {
      return this.tab === 'landing-page' ? `key-${createRandomCryptStringNumber()}` : ''
    },
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    isDistributionManually() {
      return this.scenarioDistribution === SCENARIO_DISTRIBUTION.MANUALLY
    },
    getCategoryItems() {
      return this.formDetails?.categories?.map((item) => item.text) || []
    },
    isShowTrainingTab() {
      return (
        this.getTrainingSearchPermission &&
        this.scenarioDistribution === SCENARIO_DISTRIBUTION.MANUALLY
      )
    },
    isShowSelectedScenariosSwitchDisabled() {
      return !this.value.length || this.scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY
    },
    getBadges() {
      const badges = []
      if (this.method.length) {
        const methodBadges = this.method.map((item) => ({
          key: 'Type',
          value: item.text
        }))
        badges.push(...methodBadges)
      }
      if (this.language.length) {
        const languageBadges = this.language.map((item) => ({
          key: 'Language',
          value: item.text
        }))
        badges.push(...languageBadges)
      }
      if (this.difficulty.length) {
        const difficultyBadges = this.difficulty.map((item) => ({
          key: 'Difficulty',
          value: item.text
        }))
        badges.push(...difficultyBadges)
      }
      if (this.category.length) {
        const categoryBadges = this.category.map((item) => ({
          key: 'Category',
          value: item
        }))
        badges.push(...categoryBadges)
      }
      return badges
    },
    getMethodItems() {
      if (this.type === SCENARIO_TYPES.QUISHING) {
        return quishingMethods
      }
      return methods
    },
    getContainerStyle() {
      return !this.isValid && this.scenarioDistribution === SCENARIO_DISTRIBUTION.MANUALLY
        ? { border: '1px solid #ff5252 !important', borderRadius: '20px' }
        : {}
    },
    getPhishingFile() {
      return this.emailTemplateParams?.phishingFileName
        ? {
            name: this.emailTemplateParams?.phishingFileName
          }
        : null
    },
    getSelectedScenarioSwitchLabel() {
      return `Only show selected scenarios (${this.value.length})`
    },
    getTableEmptyTextMessage() {
      const message = this.isPhishing
        ? 'You do not have any Phishing Scenarios'
        : 'You do not have any Quishing Scenarios'
      return this.isFilterOrSearchActive
        ? 'Sorry, that search and filter criteria has no results.'
        : message
    },
    getTableEmptySubMessage() {
      const message = this.isPhishing
        ? 'Go to Phishing Simulator > Phishing Scenarios to create a new scenario'
        : 'Go to Quishing Simulator > Quishing Scenarios to create a new scenario'
      return this.isFilterOrSearchActive ? message : 'Please try adjusting your search or filter'
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
    isLandingPageTabsVisible() {
      return this.landingPageTemplates?.length > 1
    },
    getSingleTemplateDetails() {
      return this.landingPageTemplates?.[0]?.content || ''
    },
    isSelectedLandingTemplateRedFlagged() {
      const html = this.getSingleTemplateDetails || ''
      return typeof html === 'string' && html.includes('data-redflag')
    },
    previewLandingHtml() {
      const html = this.getSingleTemplateDetails || ''
      if (this.isSelectedLandingTemplateRedFlagged && typeof html === 'string') {
        let logo =
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl || ''
        if (!logo) logo = this?.$store?.state?.whitelabel?.mainLogoUrl || ''
        return html.replace(/\{COMPANYLOGO\}/g, logo)
      }
      return html
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    }
  },
  watch: {
    initialTrainingForCategory: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        this.trainingForCategory =
          this.type === SCENARIO_TYPES.QUISHING
            ? { ...new QuishingTrainingTabModel(), ...val }
            : { ...new TrainingTabModel(), ...val }
      }
    },
    initialCategoryFilter: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        this.search = val.filterGroups?.[1]?.filterItems?.[0]?.value || ''
        const methodIndex = val.filterGroups[0].filterItems.findIndex(
          (item) => item.fieldName === 'method'
        )
        if (methodIndex !== -1) {
          if (val.filterGroups[0].filterItems[methodIndex].value.includes(',')) {
            const methodValues = val.filterGroups[0].filterItems[methodIndex].value.split(',')
            this.method = methodValues.map((item) => ({
              text: item,
              value: item
            }))
          } else {
            const methodValue = val.filterGroups[0].filterItems[methodIndex].value
            this.method = [{ text: methodValue, value: methodValue }]
          }
        }
        const languageIndex = val.filterGroups[0].filterItems.findIndex(
          (item) => item.fieldName === 'LanguageTypeResourceId'
        )
        if (languageIndex !== -1) {
          if (val.filterGroups[0].filterItems[languageIndex].value.includes(',')) {
            const languageValues = val.filterGroups[0].filterItems[languageIndex].value.split(',')
            const findedLanguageValues = this.languages.filter((item) =>
              languageValues.includes(item.value)
            )
            this.language = findedLanguageValues.map((item) => ({
              text: item.text,
              value: item.value
            }))
          } else {
            const languageValue = val.filterGroups[0].filterItems[languageIndex].value
            const findedLanguage = this.languages.find((item) => item.value === languageValue)
            this.language = [{ text: findedLanguage.text, value: findedLanguage.value }]
          }
        }
        const difficultyIndex = val.filterGroups[0].filterItems.findIndex(
          (item) => item.fieldName === 'difficulty'
        )
        if (difficultyIndex !== -1) {
          if (val.filterGroups[0].filterItems[difficultyIndex].value.includes(',')) {
            const difficultyValues = val.filterGroups[0].filterItems[difficultyIndex].value.split(
              ','
            )
            this.difficulty = difficultyValues.map((item) => ({
              text: item,
              value: item
            }))
          } else {
            const difficultyValue = val.filterGroups[0].filterItems[difficultyIndex].value
            this.difficulty = [{ text: difficultyValue, value: difficultyValue }]
          }
        }
        const categoryIndex = val.filterGroups[0].filterItems.findIndex(
          (item) => item.fieldName === 'Category'
        )
        if (categoryIndex !== -1) {
          this.category = val.filterGroups[0].filterItems[categoryIndex].value.includes(',')
            ? val.filterGroups[0].filterItems[categoryIndex].value.split(',')
            : [val.filterGroups[0].filterItems[categoryIndex].value]
        }
      }
    },
    initialScenarioDistribution: {
      immediate: true,
      handler(val) {
        if (!val) return
        this.scenarioDistribution = val
      }
    },
    axiosPayload: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('categoryFilterChanged', val)
      }
    },
    phishingScenarioItems: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('phishingScenarioItemsChanged', val)
      }
    },
    trainingForCategory: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.$emit('trainingForCategoryChanged', val)
        }
      }
    },
    scenarioDistribution(val) {
      this.$emit('distributionChanged', val)
      if (val === SCENARIO_DISTRIBUTION.MANUALLY) {
        this.upperTab = 'scenarios'
      } else {
        this.tab = 'email'
        this.isShowSelectedScenarios = false
        this.$emit('input', [])
        this.checkboxModel = {}
      }
    },
    defaultPhishingScenariosValuesMapped(val) {
      const setCheckbox = (resourceId = '') => {
        this.checkboxModel[resourceId] = true
      }
      const addTrainingKeyToTabModel = (val) => {
        this.$set(
          this.trainingTabModel,
          val.value,
          new TrainingTabModel(
            val.trainingId,
            val.trainingName,
            val.trainingLanguageIds,
            true,
            getEnrollmentSendTypeIdByEnum(val.enrollmentSendTypeId),
            val.awardCertificate,
            val.certificateConfigSendType,
            {
              periodCount: val.periodCount || 1,
              periodType: val.emailPeriodTypeId || 'Day',
              endType: val.reminderEndTypeId || 'TrainingCompleted',
              occurrenceCount: 1,
              stopTime: '',
              sendReminderEvery: val.isEnrollmentReminderActive || false
            },
            {
              ...val.trainingRedirectPage
            }
          )
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
    search(val) {
      this.debounce(() => {
        this.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Method', Operator: 'Contains', Value: val },
          { FieldName: 'Tags', Operator: 'Contains', Value: val },
          { FieldName: 'Difficulty', Operator: 'Contains', Value: val },
          { FieldName: 'CreatedBy', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val },
          {
            FieldName: 'LanguageTypeResourceId',
            Operator: 'Contains',
            Value: val
          }
        ]
        this.callForPhishingScenarios()
        this.isShowSelectedScenarios = false
      }, 500)
    },
    difficulty(val) {
      this.debounce(() => {
        const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => item.FieldName === 'difficulty'
        )
        const obj = {
          Value: val?.map?.((item) => item.text)?.join(',') || '',
          FieldName: 'difficulty',
          Operator: 'Include'
        }
        if (index > -1) {
          if (!val?.length) {
            this.axiosPayload.filter.FilterGroups[0].FilterItems.splice(index, 1)
          } else {
            this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
          }
        } else {
          this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
        }
        this.callForPhishingScenarios()
      }, 500)
    },
    method(val) {
      this.debounce(() => {
        const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => item.FieldName === 'method'
        )
        const obj = {
          Value: val?.map?.((item) => item.text)?.join(',') || '',
          FieldName: 'method',
          Operator: 'Include'
        }
        if (index > -1) {
          if (!val?.length) {
            this.axiosPayload.filter.FilterGroups[0].FilterItems.splice(index, 1)
          } else {
            this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
          }
        } else {
          this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
        }
        this.callForPhishingScenarios()
      }, 500)
    },
    language(val) {
      this.debounce(() => {
        const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => item.FieldName === 'LanguageTypeResourceId'
        )
        const obj = {
          Value: val?.map?.((item) => item.value)?.join(',') || '',
          FieldName: 'LanguageTypeResourceId',
          Operator: 'Include'
        }
        if (index > -1) {
          if (!val) {
            this.axiosPayload.filter.FilterGroups[0].FilterItems.splice(index, 1)
          } else {
            this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
          }
        } else {
          this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
        }
        this.callForPhishingScenarios()
      }, 500)
    },
    category(val) {
      this.debounce(() => {
        if (!val?.length) {
          this.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
        }
        const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => item.FieldName === 'Category'
        )
        const obj = {
          Value: val?.map?.((item) => item)?.join(',') || '',
          FieldName: 'Category',
          Operator: 'Include'
        }
        if (index > -1) {
          if (!val?.length) {
            this.axiosPayload.filter.FilterGroups[0].FilterItems.splice(index, 1)
          } else {
            this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj
          }
        } else {
          this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj)
        }
        this.callForPhishingScenarios()
      }, 500)
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
    },
    'getTrainingPreviewDialog.status': {
      handler(newVal) {
        if (newVal === false) {
          this.isShowTrainingDialog = false
          this.isShowCategoryTrainingDialog = false
        }
      }
    }
  },
  created() {
    if (!this.isEdit) this.callForPhishingScenarios()
    if (this.getTrainingSearchPermission) this.callForEnrollmentFormDetails()
  },
  methods: {
    getItemDifficultyClass,
    handleCreatePhishingScenarioClick() {
      this.$emit('on-create-phishing-scenario')
    },
    getListItemClasses(itemResourceId = '') {
      return {
        'v-list-item--active': this.scenarioDistribution === itemResourceId
      }
    },
    handleRemoveFilter(filter) {
      if (filter.key === 'Type') {
        const index = this.method.findIndex((item) => item.text === filter.value)
        if (index !== -1) {
          this.method.splice(index, 1)
        }
      }
      if (filter.key === 'Language') {
        this.language = ''
      }
      if (filter.key === 'Difficulty') {
        const index = this.difficulty.findIndex((item) => item.text === filter.value)
        if (index !== -1) {
          this.difficulty.splice(index, 1)
        }
      }
      if (filter.key === 'Category') {
        const index = this.category.findIndex((item) => item === filter.value)
        if (index !== -1) {
          this.category.splice(index, 1)
        }
      }
    },
    callForEnrollmentFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        const { enumNameValuePairs = {} } = response?.data?.data || {}
        this.enumTypes = enumNameValuePairs
      })
    },
    getItemClasses(itemResourceId = '') {
      return [
        'template-list',
        {
          'bg-phishing-gray': this.selectedTemplateResourceId === itemResourceId
        },
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
    callForSelectedPhishingScenario(resourceId = '', item = {}) {
      this.adjustTrainingModel(resourceId)
      const apiFunc = this.isPhishing ? getScenario : QuishingService.getScenario
      apiFunc(resourceId).then((response) => {
        const {
          data: { data }
        } = response
        if (!this.phishingScenarioItems.find((item) => item.resourceId === data.resourceId))
          this.phishingScenarioItems.push(data)
        this.isAttachmentBasedScenario =
          data.methodTypeId === PHISHING_SCENARIOS_METHOD_TYPE_BY_ID.ATTACHMENT
        this.selectedTemplateResourceId = resourceId
        const previewFunc = this.isPhishing
          ? getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId
          : QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
        const params = [resourceId]
        if (
          item.quishingType.toLowerCase() ===
          QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
        )
          params.push(QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT)
        previewFunc(...params).then((response) => {
          const { data: { data = {} } = {} } = response
          let {
            emailTemplate,
            landingPageTemplate,
            quishingTemplate,
            methodTypeId,
            mfaTextTemplate,
            mfaSmsSenderNumber
          } = data
          if (!emailTemplate) emailTemplate = quishingTemplate
          let {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            attachments,
            languageTypeResourceId: languageOfEmailTemplate,
            phishingFileName,
            subject,
            ccAddresses,
            languageTypeName,
            resourceId: emailTemplateResourceId
          } = emailTemplate || {}
          if (this.type === SCENARIO_TYPES.QUISHING)
            template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            ccAddresses,
            subject,
            difficulty:
              difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
            attachments,
            languageTypeResourceId: languageOfEmailTemplate,
            languageTypeName:
              this.languages.find((lang) => lang.languageTypeName === languageTypeName)?.text ||
              languageTypeName,
            phishingFileName,
            resourceId: emailTemplateResourceId
          }
          if (this.isPhishing) {
            this.phishingEmailTemplates = []
            this.selectedTemplateLanguages = []

            this.selectedTemplateLanguages.push({
              value: languageOfEmailTemplate,
              text:
                this.languages.find((lang) => lang.languageTypeName === languageTypeName)?.text ||
                languageTypeName
            })
            this.phishingEmailTemplates.push({
              fromName: fromName,
              fromAddress: fromAddress,
              subject: subject,
              template: template,
              ccAddresses: ccAddresses,
              languageTypeName:
                this.languages.find((lang) => lang.languageTypeName === languageTypeName)?.text ||
                languageTypeName,
              languageTypeResourceId: languageOfEmailTemplate
            })
            this.languagePreview = languageOfEmailTemplate
            if (emailTemplate?.languages?.length) {
              emailTemplate?.languages?.forEach((item) => {
                this.selectedTemplateLanguages.push({
                  value: item.languageTypeResourceId,
                  text:
                    this.languages.find((lang) => lang.languageTypeName === item.languageTypeName)
                      ?.text || item.languageTypeName
                })
              })
              this.phishingEmailTemplates.push(
                ...(emailTemplate?.languages?.map((item) => {
                  return {
                    fromName: item.fromName,
                    fromAddress: item.fromAddress,
                    subject: item.subject,
                    template: item.template,
                    ccAddresses: item.ccAddresses,
                    languageTypeName:
                      this.languages.find((lang) => lang.languageTypeName === item.languageTypeName)
                        ?.text || item.languageTypeName,
                    languageTypeResourceId: item.languageTypeResourceId
                  }
                }) || [])
              )
            }
          }
          this.emailTemplate = template
          const {
            name: landingPageName = '',
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            languageTypeResourceId,
            isInvisibleCaptchaEnabled = false,
            resourceId: landingPageResourceId
          } = landingPageTemplate || {}
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: quishingMethods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            mfaSmsSenderNumber,
            mfaTextTemplate,
            isInvisibleCaptchaEnabled: isInvisibleCaptchaEnabled ? 'Enabled' : 'Disabled',
            resourceId: landingPageResourceId
          }
          this.applyLandingPageTemplatePayload({
            landingPages: landingPages || [],
            languageTypeResourceId,
            languageTypeName: landingPageTemplate?.languageTypeName || ''
          })
          this.tab = 'email'
          this.isMethodMfa = data.methodTypeId === PHISHING_SCENARIOS_METHOD_TYPE_BY_ID.MFA
        })
      })
      if (this.isSingle) {
        Object.keys(this.trainingTabModel).forEach((key) => {
          if (key !== resourceId) {
            this.$set(this.trainingTabModel[key], 'isCheckboxSelected', false)
          }
        })
        this.setSelectedTemplate(item, true)
      }
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
    callForPhishingScenarios(isSelectFirstItem = true) {
      if (this.isEdit && this.defaultPhishingScenariosValuesMapped.length && !this.value.length) {
        if (this.isDistributionManually) {
          this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
        }
        this.axiosPayload.pageSize =
          this.defaultPhishingScenariosValuesMapped.length < 10
            ? 10
            : this.defaultPhishingScenariosValuesMapped.length
      } else if (this.value.length && this.isEdit) {
        if (this.isDistributionManually) {
          this.axiosPayload.resourceId = this.campaignManagerResourceId || ''
        }
      }
      const apiFunc = this.isPhishing ? getScenariosList : QuishingService.searchScenarios
      if (this.type === SCENARIO_TYPES.QUISHING) {
        this.axiosPayload.templateTypes = [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
      }
      return apiFunc(this.axiosPayload).then((response) => {
        const {
          data: { data }
        } = response
        this.phishingScenarioItems =
          data.results?.map((item) => {
            if (Array.isArray(item.languageTypeName)) {
              return {
                ...item,
                languageTypeName: item.languageTypeName.map(
                  (language) =>
                    this.languages.find((lang) => lang.languageTypeName === language)?.text ||
                    language
                )
              }
            }
            return {
              ...item,
              languageTypeName:
                this.languages.find((lang) => lang.languageTypeName === item.languageTypeName)
                  ?.text || item.languageTypeName
            }
          }) || []
        this.totalPhishingScenariosCount = data?.totalNumberOfRecords || 0
        this.$emit('totalPhishingScenariosCountChange', this.totalPhishingScenariosCount)
        this.phishingScenarioItems.forEach((item) => {
          if (!item.isSelected || this.value.find((pItem) => pItem.resourceId === item.resourceId))
            return
          this.value.push(item)
        })
        if (isSelectFirstItem && this.phishingScenarioItems.length) {
          this.callForSelectedPhishingScenario(
            this.phishingScenarioItems[0].resourceId,
            this.phishingScenarioItems[0]
          )
        }
        return this.phishingScenarioItems
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
      // Email template button
      if (this.tab === 'email') {
        if (this.emailTemplateParams && this.emailTemplateParams.resourceId) {
          this.emailTemplatePreviewSelectedRow = {
            resourceId: this.emailTemplateParams.resourceId,
            name: this.emailTemplateParams.name
          }
          this.isShowEmailTemplatePreview = true
        }
      } else if (this.tab === 'landing-page') {
        // Landing page button
        if (this.landingPageParams && this.landingPageParams.resourceId) {
          this.landingPagePreviewSelectedRow = {
            resourceId: this.landingPageParams.resourceId,
            name: this.landingPageParams.name
          }
          this.isShowLandingPagePreview = true
        }
      }
    },
    resetFilters() {
      this.search = ''
      this.difficulty = []
      this.method = []
      this.language = ''
      this.category = []
      this.axiosPayload = getDefaultAxiosPayload()
      this.callForPhishingScenarios(false)
    },
    handleTrainingPreviewButtonClick() {
      this.toggleShowTrainingDialog()
    },
    handleCategoryTrainingPreviewButtonClick() {
      this.toggleShowCategoryTrainingDialog()
    },
    toggleShowTrainingDialog() {
      if (this.isShowTrainingDialog) {
        // Kapatma
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: false
        })
      } else {
        // Açma
        const selectedTraining = this.trainingTabModel[this.selectedTemplateResourceId]
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: true,
          selectedRow: {
            ...selectedTraining,
            trainingId: selectedTraining.trainingId,
            name: selectedTraining.trainingName,
            languages: selectedTraining.trainingLanguageIds?.filter((id) => id !== labels.All) || []
          },
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: true
        })
      }
      this.isShowTrainingDialog = !this.isShowTrainingDialog
    },
    toggleShowCategoryTrainingDialog() {
      if (this.isShowCategoryTrainingDialog) {
        // Kapatma
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: false
        })
      } else {
        // Açma
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: true,
          selectedRow: {
            ...this.trainingForCategory,
            trainingId: this.trainingForCategory.trainingId,
            name: this.trainingForCategory.trainingName,
            languages:
              this.trainingForCategory.trainingLanguageIds?.filter((id) => id !== labels.All) || []
          },
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: true
        })
      }
      this.isShowCategoryTrainingDialog = !this.isShowCategoryTrainingDialog
    },
    handleEmailTemplatePreviewLanguageChange(val) {
      const findedTemplate = this.phishingEmailTemplates.find(
        (item) => item.languageTypeResourceId === val
      )
      if (!findedTemplate) return
      this.emailTemplateParams.fromName = findedTemplate.fromName
      this.emailTemplateParams.fromAddress = findedTemplate.fromAddress
      this.emailTemplateParams.subject = findedTemplate.subject
      this.emailTemplateParams.template = findedTemplate.template
      this.emailTemplateParams.ccAddresses = findedTemplate.ccAddresses
      this.emailTemplate = findedTemplate.template
    },
    transformLandingPages(landingPages = [], mainLanguageId = '', mainLanguageTypeName = '') {
      const languages = []
      const landingPageTemplates = []

      // Add main language to language options
      if (mainLanguageId && mainLanguageTypeName) {
        const mainLanguage = this.languages.find(
          (lang) =>
            lang.value === mainLanguageId ||
            lang.languageTypeResourceId === mainLanguageId ||
            lang.id === mainLanguageId
        )
        languages.push({
          value: mainLanguageId,
          text: mainLanguage?.text || mainLanguage?.isoFriendlyName || mainLanguageTypeName
        })
      }

      // Process each landing page (each page can have multiple language versions)
      landingPages.forEach((landingPage) => {
        // Create languages object for this page (languageId -> content mapping)
        const pageLanguages = {}

        // Add main language content
        if (landingPage.languageTypeResourceId && landingPage.content) {
          pageLanguages[landingPage.languageTypeResourceId] = landingPage.content
          if (!languages.find((lang) => lang.value === landingPage.languageTypeResourceId)) {
            const lang = this.languages.find(
              (l) =>
                l.value === landingPage.languageTypeResourceId ||
                l.languageTypeResourceId === landingPage.languageTypeResourceId ||
                l.id === landingPage.languageTypeResourceId
            )
            languages.push({
              value: landingPage.languageTypeResourceId,
              text:
                lang?.text ||
                lang?.isoFriendlyName ||
                landingPage.languageTypeName ||
                mainLanguageTypeName
            })
          }
        }

        // Add other language versions from languages array
        if (landingPage.languages && Array.isArray(landingPage.languages)) {
          landingPage.languages.forEach((languagePage) => {
            if (languagePage.languageTypeResourceId && languagePage.content) {
              pageLanguages[languagePage.languageTypeResourceId] = languagePage.content
              if (!languages.find((lang) => lang.value === languagePage.languageTypeResourceId)) {
                const lang = this.languages.find(
                  (l) =>
                    l.value === languagePage.languageTypeResourceId ||
                    l.languageTypeResourceId === languagePage.languageTypeResourceId ||
                    l.id === languagePage.languageTypeResourceId
                )
                languages.push({
                  value: languagePage.languageTypeResourceId,
                  text: lang?.text || lang?.isoFriendlyName || languagePage.languageTypeName
                })
              }
            }
          })
        }

        // Create template object for this page
        landingPageTemplates.push({
          name: landingPage.name,
          order: landingPage.order,
          prompt: landingPage.prompt,
          content: landingPage.content, // Default content (main language)
          languageTypeResourceId: landingPage.languageTypeResourceId || mainLanguageId,
          languages: pageLanguages // All language versions for this page
        })
      })

      return {
        templates: landingPageTemplates,
        languages
      }
    },
    applyLandingPageTemplatePayload(payload = {}) {
      const landingPages = payload.landingPages || []
      const mainLanguageId =
        payload.languageTypeResourceId ||
        landingPages[0]?.languageTypeResourceId ||
        this.landingPageLanguagePreview
      const mainLanguageTypeName =
        landingPages[0]?.languageTypeName || payload.languageTypeName || ''
      const { templates, languages } = this.transformLandingPages(
        landingPages,
        mainLanguageId,
        mainLanguageTypeName
      )

      this.landingPageTemplates = templates
      this.selectedLandingPageLanguages = languages

      if (languages.length) {
        const hasCurrentLang = languages.some(
          (lang) =>
            lang.value === this.landingPageLanguagePreview ||
            lang.value?.toString() === this.landingPageLanguagePreview?.toString()
        )
        if (!hasCurrentLang) {
          this.landingPageLanguagePreview = languages[0].value
        }
      } else {
        this.landingPageLanguagePreview = mainLanguageId || ''
      }
    },
    getLandingPageContent(template = {}) {
      if (!template) return ''
      const languageId = this.landingPageLanguagePreview || template.languageTypeResourceId

      // If template has languages object and languageId is set, get content for that language
      if (languageId && template.languages && template.languages[languageId]) {
        return template.languages[languageId]
      }

      // Fallback to current template's content (main language)
      if (template.content) return template.content

      // If no content found, try to get first available language content
      if (template.languages && Object.keys(template.languages).length > 0) {
        const firstLanguageId = Object.keys(template.languages)[0]
        return template.languages[firstLanguageId]
      }

      return ''
    },
    handleLandingPageLanguageChange(languageId) {
      if (!languageId) return
      this.landingPageLanguagePreview = languageId
    }
  }
}
</script>
