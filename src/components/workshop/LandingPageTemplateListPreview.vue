<template>
  <div :class="`landingPagePreview ${isSafari && showGrapesModal ? 'safari-grapes-js-fix' : ''}`">
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isTemplateDetails"
      ref="landingPagePreviewDialog"
      :status="isTemplateDetails"
      :selected-row="landingPagePreviewSelectedRow"
      :type="type"
      :languages="languages"
      :api-func="apiFuncs.content"
      is-nested
      :should-control-html-overflow="false"
      @on-close="isTemplateDetails = false"
    />
    <div class="landingPagePreview__container" ref="topOfTheTemplate">
      <div class="landingPagePreview__container-main">
        <div class="landingPagePreview-content">
          <div class="landingPagePreview-content--search px-6 py-6">
            <div class="d-flex justify-space-between align-center">
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
                <div style="max-width: 140px;">
                  <KSelect
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[1].value"
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
                <div style="max-width: 140px;">
                  <v-select
                    v-model="bodyData.filter.FilterGroups[0].FilterItems[2].value"
                    :items="languages"
                    placeholder="Language"
                    item-disabled="disabled"
                    item-text="text"
                    item-value="value"
                    outlined
                    persistent-hint
                    hide-details
                    class="filter-field-scenarios"
                    style="padding-right: 4px !important; padding-left: 4px !important;"
                    @change="getTemplatesForSearch"
                  >
                  </v-select>
                </div>
              </div>
              <div v-if="isPhishing">
                <v-btn
                  class="emailTemplatePreview__edit-button"
                  color="#2196F3"
                  outlined
                  rounded
                  @click="handleCreateLandingPageTemplateClick"
                >
                  <v-icon left color="#2196f3" medium> mdi-plus </v-icon>
                  <span class="emailTemplatePreview__edit-button-text"
                    >Create Landing Page Template</span
                  >
                </v-btn>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical">
            <div
              class="pane"
              :style="{
                width: '25%',
                minWidth: '240px',
                pointerEvents: loadingTemplates ? 'none' : 'inherit'
              }"
              @scroll="handleScroll"
            >
              <div
                v-for="(item, index) in listData"
                class="template-list"
                :key="item.name + index"
                :class="{ 'template-list--selected': item['selected'] }"
                @click="setSelectedTemplate(item, index)"
              >
                <div class="d-flex justify-space-between mb-2">
                  <div class="d-flex flex-column wrapWord">
                    <div
                      class="template-list--item template-list--item__header"
                      :id="`template-${index}`"
                    >
                      <span>{{ item.name }}</span>
                      <VTooltip v-if="item.isAssistedByAI" bottom :attach="`#template-${index}`">
                        <template #activator="{ on }">
                          <VIcon v-on="on" class="ml-1" color="#2196F3" small>mdi-creation</VIcon>
                        </template>
                        <span>This template was generated with AI</span>
                      </VTooltip>
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
            <div class="pane" :style="{ flexGrow: 1 }">
              <template v-if="listData.length">
                <ElTabs
                  v-if="isMethodMfa"
                  v-model="selectedTab"
                  class="landingPagePreview__upper-tabs"
                >
                  <ElTabPane name="landingPage" label="Landing Page">
                    <div
                      v-if="isPhishing && listData.length"
                      class="landingPagePreview__buttons-container landingPagePreview__buttons-container--under-tabs"
                    >
                      <template v-if="!isEditMode">
                        <v-btn
                          class="landingPagePreview__edit-button"
                          color="#2196F3"
                          outlined
                          rounded
                          @click="handleEdit"
                        >
                          <v-icon left color="#2196f3" medium>
                            {{
                              isSystemTemplateForNonSystemUser ? 'mdi-content-copy' : 'mdi-pencil'
                            }}
                          </v-icon>
                          <span class="landingPagePreview__edit-button-text">
                            {{
                              isSystemTemplateForNonSystemUser
                                ? 'Duplicate Landing Page'
                                : 'Edit Landing Page'
                            }}
                          </span>
                        </v-btn>
                        <VBtn
                          v-if="!!getSingleTemplateDetails"
                          icon
                          outlined
                          color="#2196f3"
                          @click="isTemplateDetails = true"
                        >
                          <VIcon color="#2196f3" small> mdi-eye </VIcon>
                        </VBtn>
                      </template>
                      <template v-else>
                        <v-btn
                          class="landingPagePreview__exit-editing-button"
                          color="#F56C6C"
                          outlined
                          rounded
                          :disabled="isSaving"
                          @click="handleExitEditing"
                        >
                          <span class="landingPagePreview__exit-editing-text">Exit Editing</span>
                        </v-btn>
                        <div>
                          <v-btn
                            class="landingPagePreview__save-as-new-button mr-4"
                            color="#2196F3"
                            outlined
                            rounded
                            :disabled="isSaving"
                            @click="handleSaveAsNew"
                          >
                            <span class="landingPagePreview__save-as-new-text">Save As New</span>
                          </v-btn>
                          <VTooltip
                            :disabled="landingPageTemplateData.createdBy !== 'System'"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-btn
                                v-on="on"
                                id="landingPagePreview__save-changes-button"
                                class="landingPagePreview__save-changes-button mr-4"
                                color="#2196F3"
                                rounded
                                :disabled="
                                  isSaving || landingPageTemplateData.createdBy === 'System'
                                "
                                @click="handleSaveChanges"
                              >
                                <span class="landingPagePreview__save-changes-text"
                                  >Save Changes</span
                                >
                              </v-btn>
                            </template>
                            <span>You are not authorized to edit this template</span>
                          </VTooltip>
                          <VBtn
                            v-if="!!getSingleTemplateDetails"
                            icon
                            outlined
                            color="#2196f3"
                            @click="isTemplateDetails = true"
                          >
                            <VIcon color="#2196f3" small> mdi-eye </VIcon>
                          </VBtn>
                        </div>
                      </template>
                    </div>
                    <v-list-item v-if="isEditMode" class="mt-4">
                      <v-list-item-content>
                        <v-form ref="refEmailTemplateContent">
                          <div class="px-4 py-4">
                            <FormGroup
                              title="Template Name:"
                              style="max-width: unset;"
                              className="k-form-group--horizontal"
                              labelClassName="k-form-group__title--horizontal mb-5"
                            >
                              <InputEntityName
                                v-model="editData.name"
                                id="input--notification-template-name"
                                initialPlaceholder="Enter template name"
                                entityName="template name"
                              />
                            </FormGroup>
                            <InputPhishingLink
                              ref="refInputPhishingLink"
                              v-model="editData.phishingLink"
                              :isEdit="true"
                              :url-schema-types="getUrlSchemaTypes"
                              :domain-records="getDomainRecordTypes"
                              :extension-types="getExtensionTypes"
                              :parameter-types="getParameterTypes"
                              :path-types="getPathTypes"
                              @link-change="handleLinkChange"
                              @invisible-captcha="isInvisibleCaptchaDisabled = $event"
                              @captcha-default-value="editData.isInvisibleCaptchaEnabled = $event"
                            />
                            <VCheckbox
                              v-model="editData.isInvisibleCaptchaEnabled"
                              color="#2196f3"
                              hide-details
                              :class="[
                                'mb-10',
                                isInvisibleCaptchaDisabled ? 'invisible-captcha-checkbox' : ''
                              ]"
                              :ripple="false"
                              :readonly="isInvisibleCaptchaDisabled"
                              :style="invisibleCaptchaEnabledStyle"
                            >
                              <template #label>
                                Stop bots to prevent false clicks.
                                <VTooltip bottom max-width="260" z-index="9999999">
                                  <template #activator="{ on }">
                                    <v-icon v-on="on" class="ml-2" color="#757575"
                                      >mdi-information</v-icon
                                    >
                                  </template>
                                  <span
                                    >Once enabled, bot activity is automatically detected and
                                    stopped to prevent false clicks, ensuring genuine traffic to the
                                    landing page.</span
                                  >
                                </VTooltip>
                              </template>
                            </VCheckbox>
                          </div>
                          <ElTabs
                            v-model="selectedEditLandingPageTab"
                            class="landing-page-tab-content k-sub-tab py-0 px-0"
                            id="landing-page-tab-content"
                          >
                            <ElTabPane
                              v-for="(page, index) in editData.landingPages"
                              :key="`page-${index + 1}`"
                              :label="`Page ${index + 1}`"
                              :name="`${index + 1}`"
                              :id="`landingPage-content-${index + 1}`"
                            >
                              <template #label>
                                <div
                                  style="display: flex;"
                                  :style="
                                    editData.landingPages.length > 1 && {
                                      width: '68px'
                                    }
                                  "
                                >
                                  <span class="landing-page-tab__label">
                                    {{ `Page ${index + 1}` }}
                                  </span>
                                  <v-menu
                                    v-if="editData.landingPages.length > 1"
                                    :min-width="128"
                                    :offset-y="true"
                                    nudge-left="50"
                                    bottom
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-ripple="false"
                                        v-on="on"
                                        class="landing-page-tab-content__button"
                                        >mdi-dots-horizontal</v-icon
                                      >
                                    </template>
                                    <v-list>
                                      <v-list-item
                                        style="cursor: pointer;"
                                        @click="handleDeleteLandingPage(index)"
                                      >
                                        <v-list-item-title>Delete</v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </div>
                              </template>
                              <EmailTemplate
                                ref="refEmailTemplate"
                                template-type="landing"
                                :active-block-manager-components="activeBlockManagerComponents"
                                :edit-items-disabled="false"
                                :template.sync="page.content"
                                :is-edit="true"
                                :onlyGrapes="true"
                                @template-edit="handleTemplateEdit"
                              />
                            </ElTabPane>
                            <ElTabPane v-if="editData.landingPages.length <= 1" name="addPage">
                              <template #label>
                                <v-menu
                                  :min-width="128"
                                  :nudge-right="83"
                                  :nudge-bottom="240"
                                  id="add-page-menu"
                                  attach="#landing-page-tab-content"
                                  :z-index="10000"
                                >
                                  <template v-slot:activator="{ on: menu }">
                                    <v-btn v-on="menu" text color="#2196f3">
                                      <v-icon class="mr-2" size="18" color="#2196f3"
                                        >mdi-plus-circle-outline</v-icon
                                      >
                                      <span class="landing-page-tab__label">
                                        Add page
                                      </span>
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      class="px-4"
                                      style="cursor: pointer;"
                                      @click="handleAddBlankPage"
                                    >
                                      <v-list-item-title>Blank page</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                      class="px-4"
                                      style="cursor: pointer;"
                                      @click="handleUploadHTML"
                                    >
                                      <v-list-item-title>Upload HTML</v-list-item-title>
                                    </v-list-item>
                                    <input
                                      v-show="false"
                                      ref="refHtmlFile"
                                      type="file"
                                      @change="handleHTMLUploadChange"
                                    />
                                  </v-list>
                                </v-menu>
                              </template>
                            </ElTabPane>
                          </ElTabs>
                        </v-form>
                      </v-list-item-content>
                    </v-list-item>
                    <template v-else>
                      <div class="template-preview px-4 py-4 mx-0">
                        <div class="template-preview__text pl-2">
                          <div>
                            <span class="template-preview__text--title">Template Name: </span>
                            <span class="template-preview__text--body">{{ templateName }}</span>
                          </div>
                          <div
                            style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
                          ></div>
                          <div
                            v-if="selectedTemplateLanguages.length > 1"
                            style="max-width: 554px;"
                          >
                            <InputLanguagePreview
                              v-model="languagePreview"
                              persistent-hint
                              class="max-w-554 campaign-manager-phishing-scenario-input-language"
                              :hint="landingPagePreviewLanguageHint"
                              :items="selectedTemplateLanguages"
                              :hide-details="false"
                              @input="handleLandingPagePreviewLanguageChange"
                            />
                          </div>
                          <div>
                            <span class="template-preview__text--title"
                              >{{ type === SCENARIO_TYPES.PHISHING ? 'Phishing' : 'Quishing' }}
                              URL:
                            </span>
                            <span class="template-preview__text--body">{{ templateURL }}</span>
                          </div>
                          <div>
                            <span class="template-preview__text--title">Stop Bot Activity: </span>
                            <span class="template-preview__text--body">{{
                              isInvisibleCaptchaEnabled ? 'Enabled' : 'Disabled'
                            }}</span>
                          </div>
                        </div>
                      </div>
                      <ElTabs
                        v-if="landingPageTemplates.length > 1"
                        v-model="selectedLandingPageTab"
                        class="k-sub-tab"
                      >
                        <ElTabPane
                          v-for="(template, index) in landingPageTemplates"
                          :key="index"
                          :name="`${index + 1}`"
                          :label="`Page ${index + 1}`"
                          class="mx-4"
                        >
                          <KEmailPreview
                            v-if="!!template.content"
                            is-extra-height
                            is-landing-page
                            :key="`${template.content}-${languagePreview}`"
                            :html="getPreviewLandingHtml(getLandingPageContent(template))"
                            :is-red-flagged-template="
                              checkIsRedFlaggedTemplate(getLandingPageContent(template))
                            "
                          />
                        </ElTabPane>
                      </ElTabs>
                      <template v-else>
                        <hr class="mt-4" v-if="!!getSingleTemplateDetails" />
                        <KEmailPreview
                          v-if="!!getSingleTemplateDetails"
                          is-extra-height
                          is-landing-page
                          :html="getSingleTemplateDetails"
                          :key="getLandingPageHtmlKey"
                        />
                      </template>
                    </template>
                  </ElTabPane>
                  <ElTabPane v-if="isMethodMfa" label="MFA Settings" name="mfaSettings">
                    <div class="ml-6 mt-4">
                      <ConfigureCompanyStepHeader
                        class="mb-6"
                        :title="labels.MultiFactorAuthentication"
                        :subtitle="
                          type === SCENARIO_TYPES.PHISHING
                            ? labels.MultiFactorAuthenticationSub
                            : labels.MultiFactorAuthenticationSubQuishing
                        "
                      />
                      <VForm ref="refMfaForm">
                        <InputCallerPhoneNumber
                          v-model="mfaData.mfaSenderNumberResourceId"
                          select-first-item
                          :is-phishing-scenario="type === SCENARIO_TYPES.PHISHING"
                          :isSmishing="type === SCENARIO_TYPES.SMISHING"
                          :isQuishing="type === SCENARIO_TYPES.QUISHING"
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
                  <div
                    v-if="isPhishing && listData.length"
                    class="landingPagePreview__buttons-container"
                  >
                    <template v-if="!isEditMode">
                      <v-btn
                        class="landingPagePreview__edit-button"
                        color="#2196F3"
                        outlined
                        rounded
                        @click="handleEdit"
                      >
                        <v-icon left color="#2196f3" medium>
                          {{ isSystemTemplateForNonSystemUser ? 'mdi-content-copy' : 'mdi-pencil' }}
                        </v-icon>
                        <span class="landingPagePreview__edit-button-text">
                          {{
                            isSystemTemplateForNonSystemUser
                              ? 'Duplicate Landing Page'
                              : 'Edit Landing Page'
                          }}
                        </span>
                      </v-btn>
                      <VBtn
                        v-if="!!getSingleTemplateDetails"
                        icon
                        outlined
                        color="#2196f3"
                        @click="isTemplateDetails = true"
                      >
                        <VIcon color="#2196f3" small> mdi-eye </VIcon>
                      </VBtn>
                    </template>
                    <template v-else>
                      <v-btn
                        class="landingPagePreview__exit-editing-button"
                        color="#F56C6C"
                        outlined
                        rounded
                        :disabled="isSaving"
                        @click="handleExitEditing"
                      >
                        <span class="landingPagePreview__exit-editing-text">Exit Editing</span>
                      </v-btn>
                      <div>
                        <v-btn
                          class="landingPagePreview__save-as-new-button mr-4"
                          color="#2196F3"
                          outlined
                          rounded
                          :disabled="isSaving"
                          @click="handleSaveAsNew"
                        >
                          <span class="landingPagePreview__save-as-new-text">Save As New</span>
                        </v-btn>
                        <VTooltip :disabled="landingPageTemplateData.createdBy !== 'System'" bottom>
                          <template #activator="{ on }">
                            <v-btn
                              v-on="on"
                              id="landingPagePreview__save-changes-button"
                              class="landingPagePreview__save-changes-button mr-4"
                              color="#2196F3"
                              rounded
                              :disabled="isSaving || landingPageTemplateData.createdBy === 'System'"
                              @click="handleSaveChanges"
                            >
                              <span class="landingPagePreview__save-changes-text"
                                >Save Changes</span
                              >
                            </v-btn>
                          </template>
                          <span>You are not authorized to edit this template</span>
                        </VTooltip>
                        <VBtn
                          v-if="!!getSingleTemplateDetails"
                          icon
                          outlined
                          color="#2196f3"
                          @click="isTemplateDetails = true"
                        >
                          <VIcon color="#2196f3" small> mdi-eye </VIcon>
                        </VBtn>
                      </div>
                    </template>
                  </div>
                  <v-list-item v-if="isEditMode" class="mt-4">
                    <v-list-item-content>
                      <v-form ref="refEmailTemplateContent">
                        <div class="px-4 py-4">
                          <FormGroup
                            title="Template Name:"
                            style="max-width: unset;"
                            className="k-form-group--horizontal"
                            labelClassName="k-form-group__title--horizontal mb-5"
                          >
                            <InputEntityName
                              v-model="editData.name"
                              id="input--notification-template-name"
                              initialPlaceholder="Enter template name"
                              entityName="template name"
                            />
                          </FormGroup>
                          <InputPhishingLink
                            ref="refInputPhishingLink"
                            v-model="editData.phishingLink"
                            :isEdit="true"
                            :url-schema-types="getUrlSchemaTypes"
                            :domain-records="getDomainRecordTypes"
                            :extension-types="getExtensionTypes"
                            :parameter-types="getParameterTypes"
                            :path-types="getPathTypes"
                            @link-change="handleLinkChange"
                            @invisible-captcha="isInvisibleCaptchaDisabled = $event"
                            @captcha-default-value="editData.isInvisibleCaptchaEnabled = $event"
                          />
                          <VCheckbox
                            v-model="editData.isInvisibleCaptchaEnabled"
                            color="#2196f3"
                            hide-details
                            :class="[
                              'mb-10',
                              isInvisibleCaptchaDisabled ? 'invisible-captcha-checkbox' : ''
                            ]"
                            :ripple="false"
                            :readonly="isInvisibleCaptchaDisabled"
                            :style="invisibleCaptchaEnabledStyle"
                          >
                            <template #label>
                              Stop bots to prevent false clicks.
                              <VTooltip bottom max-width="260" z-index="9999999">
                                <template #activator="{ on }">
                                  <v-icon v-on="on" class="ml-2" color="#757575"
                                    >mdi-information</v-icon
                                  >
                                </template>
                                <span
                                  >Once enabled, bot activity is automatically detected and stopped
                                  to prevent false clicks, ensuring genuine traffic to the landing
                                  page.</span
                                >
                              </VTooltip>
                            </template>
                          </VCheckbox>
                        </div>
                        <ElTabs
                          v-model="selectedEditLandingPageTab"
                          class="landing-page-tab-content k-sub-tab py-0 px-0"
                          id="landing-page-tab-content"
                        >
                          <ElTabPane
                            v-for="(page, index) in editData.landingPages"
                            :key="`page-${index + 1}`"
                            :label="`Page ${index + 1}`"
                            :name="`${index + 1}`"
                            :id="`landingPage-content-${index + 1}`"
                          >
                            <template #label>
                              <div
                                style="display: flex;"
                                :style="
                                  editData.landingPages.length > 1 && {
                                    width: '68px'
                                  }
                                "
                              >
                                <span class="landing-page-tab__label">
                                  {{ `Page ${index + 1}` }}
                                </span>
                                <v-menu
                                  v-if="editData.landingPages.length > 1"
                                  :min-width="128"
                                  :offset-y="true"
                                  nudge-left="50"
                                  bottom
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      v-ripple="false"
                                      v-on="on"
                                      class="landing-page-tab-content__button"
                                      >mdi-dots-horizontal</v-icon
                                    >
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      style="cursor: pointer;"
                                      @click="handleDeleteLandingPage(index)"
                                    >
                                      <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </div>
                            </template>
                            <EmailTemplate
                              ref="refEmailTemplate"
                              template-type="landing"
                              :active-block-manager-components="activeBlockManagerComponents"
                              :edit-items-disabled="false"
                              :template.sync="page.content"
                              :is-edit="true"
                              :onlyGrapes="true"
                              @template-edit="handleTemplateEdit"
                            />
                          </ElTabPane>
                          <ElTabPane v-if="editData.landingPages.length <= 1" name="addPage">
                            <template #label>
                              <v-menu
                                :min-width="128"
                                :nudge-right="83"
                                :nudge-bottom="240"
                                id="add-page-menu"
                                attach="#landing-page-tab-content"
                                :z-index="10000"
                              >
                                <template v-slot:activator="{ on: menu }">
                                  <v-btn v-on="menu" text color="#2196f3">
                                    <v-icon class="mr-2" size="18" color="#2196f3"
                                      >mdi-plus-circle-outline</v-icon
                                    >
                                    <span class="landing-page-tab__label">
                                      Add page
                                    </span>
                                  </v-btn>
                                </template>
                                <v-list>
                                  <v-list-item
                                    class="px-4"
                                    style="cursor: pointer;"
                                    @click="handleAddBlankPage"
                                  >
                                    <v-list-item-title>Blank page</v-list-item-title>
                                  </v-list-item>
                                  <v-list-item
                                    class="px-4"
                                    style="cursor: pointer;"
                                    @click="handleUploadHTML"
                                  >
                                    <v-list-item-title>Upload HTML</v-list-item-title>
                                  </v-list-item>
                                  <input
                                    v-show="false"
                                    ref="refHtmlFile"
                                    type="file"
                                    @change="handleHTMLUploadChange"
                                  />
                                </v-list>
                              </v-menu>
                            </template>
                          </ElTabPane>
                        </ElTabs>
                      </v-form>
                    </v-list-item-content>
                  </v-list-item>
                  <div v-else class="template-preview pt-4 mx-0" style="max-width: unset;">
                    <div class="template-preview__text px-4" v-if="!!getSingleTemplateDetails">
                      <div>
                        <span class="template-preview__text--title">Template Name: </span>
                        <span class="template-preview__text--body">{{ templateName }}</span>
                      </div>
                      <div
                        style="background: rgb(224, 224, 224); height: 1px; max-width: 554px;"
                      ></div>
                      <div v-if="selectedTemplateLanguages.length > 1" style="max-width: 554px;">
                        <InputLanguagePreview
                          v-model="languagePreview"
                          persistent-hint
                          class="max-w-554 campaign-manager-phishing-scenario-input-language"
                          :hint="landingPagePreviewLanguageHint"
                          :items="selectedTemplateLanguages"
                          :hide-details="false"
                          @input="handleLandingPagePreviewLanguageChange"
                        />
                      </div>
                      <div>
                        <span class="template-preview__text--title"
                          >{{ type === SCENARIO_TYPES.PHISHING ? 'Phishing' : 'Quishing' }}
                          URL:
                        </span>
                        <span class="template-preview__text--body">{{ templateURL }}</span>
                      </div>
                      <div>
                        <span class="template-preview__text--title">Stop Bot Activity: </span>
                        <span class="template-preview__text--body">{{
                          isInvisibleCaptchaEnabled ? 'Enabled' : 'Disabled'
                        }}</span>
                      </div>
                    </div>
                    <ElTabs
                      v-if="landingPageTemplates.length > 1"
                      v-model="selectedLandingPageTab"
                      class="k-sub-tab mt-4"
                    >
                      <ElTabPane
                        v-for="(template, index) in landingPageTemplates"
                        :key="index"
                        :name="`${index + 1}`"
                        :label="`Page ${index + 1}`"
                        class="mx-4"
                      >
                        <KEmailPreview
                          v-if="!!template.content"
                          is-extra-height
                          is-landing-page
                          :key="`${template.content}-${languagePreview}`"
                          :html="getPreviewLandingHtml(getLandingPageContent(template))"
                          :is-red-flagged-template="
                            checkIsRedFlaggedTemplate(getLandingPageContent(template))
                          "
                        />
                      </ElTabPane>
                    </ElTabs>
                    <template v-else>
                      <hr class="mt-4" v-if="!!getSingleTemplateDetails" />
                      <KEmailPreview
                        v-if="!!getSingleTemplateDetails"
                        is-extra-height
                        is-landing-page
                        :html="getPreviewLandingHtml(getSingleTemplateDetails)"
                        :is-red-flagged-template="
                          checkIsRedFlaggedTemplate(getSingleTemplateDetails)
                        "
                        :key="getLandingPageHtmlKey"
                      />
                    </template>
                  </div>
                </div>
              </template>
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
import {
  getLandingPageList,
  getLandingPageTemplatePreviewContent,
  getLandingPageFormDetails,
  createLandingPage,
  updateLandingPage
} from '@/api/landingPage'
import KEmailPreview from '@/components/KEmailPreview'
import ShowMoreTags from '@/components/ShowMoreTags'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import {
  getDefaultLandingPageTemplatePayload,
  SCENARIO_DIFFICULTIES,
  SCENARIO_METHODS
} from '@/components/PhishingScenarios/utils'
import useDebounce from '@/hooks/useDebounce'
import ConfigureCompanyStepHeader from '../Companies/ConfigureCompanyStepHeader'
import labels from '@/model/constants/labels'
import InputCallerPhoneNumber from '../Common/Inputs/InputCallerPhoneNumber'
import FormGroup from '../SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { SCENARIO_TYPES, getItemDifficultyClass } from '@/components/Common/Simulator/utils'
import { getMergedTextForPhishing } from '@/api/phishingsimulator'
import { MERGED_TEXTS_MAP } from '@/components/LandingPage/utils'
import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { isDifferent } from '@/utils/functions'
import { handleIsSafari } from '@/utils/functions'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import EmailTemplateListLeftSideLanguages from '@/components/workshop/EmailTemplateListLeftSideLanguages.vue'
export default {
  name: 'LandingPageListPreview',
  mixins: [useDebounce],
  components: {
    EmailTemplateListLeftSideLanguages,
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    FormGroup,
    InputCallerPhoneNumber,
    ConfigureCompanyStepHeader,
    KSelect,
    ShowMoreTags,
    KEmailPreview,
    Multipane,
    MultipaneResizer,
    InputPhishingLink,
    InputEntityName,
    InputLanguagePreview,
    EmailTemplate
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
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    languages: {
      type: Array
    },
    apiFuncs: {
      type: Object,
      default: () => ({
        list: getLandingPageList,
        content: getLandingPageTemplatePreviewContent
      })
    }
  },
  data() {
    return {
      SCENARIO_TYPES,
      Validations,
      labels,
      templateName: '',
      isInvisibleCaptchaDisabled: false,
      selectedTab: 'landingPage',
      selectedLandingPageTab: '1',
      selectedEditLandingPageTab: '1',
      isSafari: handleIsSafari(),
      showGrapesModal: false,
      landingPageTemplates: [],
      selectedTemplateLanguages: [],
      languagePreview: '',
      search: null,
      listData: [],
      totalNumberOfPages: 1,
      defaultListData: [],
      methods: SCENARIO_METHODS,
      difficulties: SCENARIO_DIFFICULTIES,
      bodyData: getDefaultLandingPageTemplatePayload(this.method),
      loadingTemplatePreview: false,
      isTemplateDetails: null,
      loadingTemplates: false,
      templateURL: null,
      isInvisibleCaptchaEnabled: false,
      selectedPreviousIndex: 0,
      mfaMessageRules: [
        (v) => Validations.required(v),
        (v) => {
          if (v?.toLowerCase()?.includes('{mfa_code}')) {
            if (v?.includes('{MFA_CODE}')) return true
            return 'Only use uppercase letters for the merge tag'
          }
          return true
        },
        (v) => Validations.maxLength(v, 148, labels.getMaxLengthMessage(labels.SMS, 148)),
        (v) => Validations.isGsm7(v)
      ],
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      isSaving: false,
      isEditMode: false,
      initialEditData: {},
      editData: {
        phishingLink: {
          urlSchemaTypeId: '',
          subDomain: '',
          domainRecordId: '',
          pathTypeId: '',
          extensionTypeId: '',
          parameterTypeId: ''
        },
        name: null,
        landingPages: [{ name: 'landing-page', content: '', order: 1 }],
        isInvisibleCaptchaEnabled: false
      },
      landingPageTemplateData: {},
      newUrlTemplate: '',
      editItemsDisabled: false
    }
  },
  computed: {
    isSystemUser() {
      const company = this.$store.state.login?.company
      return company?.name === 'System' || company?.companyName === 'System'
    },
    isSystemTemplateForNonSystemUser() {
      console.log('this.landingPageTemplateData', this.landingPageTemplateData)
      return (
        this.landingPageTemplateData.createdBy === 'System' &&
        !this.isSystemUser &&
        !this.landingPageTemplateData.isOwner
      )
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    getSelectedTemplateDetails() {
      if (!this.landingPageTemplates?.length) return ''
      const template = this.landingPageTemplates?.[parseInt(this.selectedLandingPageTab) - 1]
      return this.getLandingPageContent(template)
    },
    getSingleTemplateDetails() {
      if (!this.landingPageTemplates?.length) return ''
      const template = this.landingPageTemplates?.[0]
      return this.getLandingPageContent(template)
    },
    getLandingPageHtmlKey() {
      return `${this.getSingleTemplateDetails}-${this.templateName}`
    },
    getUrlSchemaTypes() {
      return this.landingPageData?.urlSchemaTypes || []
    },
    getDomainRecordTypes() {
      return this.landingPageData?.domainRecords || []
    },
    getExtensionTypes() {
      return this.landingPageData?.extensionTypes || []
    },
    getParameterTypes() {
      return this.landingPageData?.parameterTypes || []
    },
    getPathTypes() {
      return this.landingPageData?.pathTypes || []
    },
    invisibleCaptchaEnabledStyle() {
      return this.isInvisibleCaptchaDisabled
        ? {
            opacity: 0.38,
            cursor: 'default !important'
          }
        : {}
    },
    landingPagePreviewSelectedRow() {
      const selectedTemplate = this.listData.find((item) => item.selected)
      if (!selectedTemplate) return {}
      return {
        ...selectedTemplate,
        resourceId: selectedTemplate.resourceId
      }
    },
    landingPagePreviewLanguageHint() {
      const languageCount = this.selectedTemplateLanguages.length
      if (languageCount === 0) return ''
      if (languageCount === 1) {
        return 'This template is available in 1 language.'
      }
      return `This template is available in ${languageCount} languages.`
    }
  },
  watch: {
    isEditMode(val) {
      this.$emit('edit-mode', val)
    },
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
    this.callForMergedTags()
    this.callForLandingPageFormDetails()
    this.getTemplates(true, this.landingPageTemplateResourceId)
  },
  methods: {
    getItemDifficultyClass,
    handleCreateLandingPageTemplateClick() {
      this.$emit('on-create-landing-page-template')
    },
    handleTemplateEdit(val) {
      this.showGrapesModal = val
      this.$emit('template-edit', val)
    },
    handleLinkChange(val) {
      this.newUrlTemplate = val
    },
    handleAddBlankPage() {
      this.editData.landingPages.push({
        name: `Page ${this.editData.landingPages.length + 1}`,
        order: 2,
        content: `<table style="padding-top: 24px; border-spacing: 0; border: none !important; width: 100%;">    <tbody>      <tr        style="          margin-left: 24px;          font-family: 'Open Sans', sans-serif;          font-size: 24px;          line-height: 1.29;          letter-spacing: normal;          color: rgba(0, 0, 0, 0.87);          opacity: 0.7;          max-width: 200px;          min-height: 72px;          display: flex;          border-radius: 4px;          margin-bottom: 24px;          vertical-align: middle;          background-color: #e0e0e0;        "      >        <td>          <img            alt="notification-template-logo"            style="display: block; width: 100%; max-width: 200px; min-height: 72px;"            src=${this.emailTemplateLogo}          />        </td>      </tr>      <tr style="font-family: 'Open Sans', sans-serif; margin-left: 24px;">        <td style="width: 65%; padding-left: 24px;">          <h1            style="              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Let’s design a landing page template          </h1>          <h2            style="              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            To design an email template, first click the Edit button to enter design mode          </h2>          <p            style="              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Once there choose the layout, use blocks, text, images and other features you need to            design a responsive page, really fast            <img              style="margin-bottom: -10px;"              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzEwNzZfMTA2MjYiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjciIHk9IjgiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC41MTIxIDguNDU3NjNMOC41MDk4OCAxMS4xMTg2TDE5LjA0OTggMTEuMTE5Mkw3LjU1NjY5IDIyLjYxMjRMOS40NDIzMSAyNC40OThMMjAuOTM1NSAxMy4wMDQ4TDIwLjkzNjEgMjMuNTQ0OEwyMy41OTcgMjMuNTQyNkwyMy42MDk2IDguNDQ1MDRMOC41MTIxIDguNDU3NjNaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMTA3Nl8xMDYyNikiPgo8cmVjdCB4PSItMTcuMzM1OSIgeT0iLTE3LjMzMyIgd2lkdGg9IjY2Ljc3OCIgaGVpZ2h0PSI2Ni42NjY3IiBmaWxsPSIjNzU3NTc1Ii8+CjxtYXNrIGlkPSJtYXNrMV8xMDc2XzEwNjI2IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSItMTgiIHk9Ii0xOCIgd2lkdGg9IjY4IiBoZWlnaHQ9IjY4Ij4KPHJlY3QgeD0iLTE3LjMzNTkiIHk9Ii0xNy4zMzMiIHdpZHRoPSI2Ni43NzgiIGhlaWdodD0iNjYuNjY2NyIgZmlsbD0id2hpdGUiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2sxXzEwNzZfMTA2MjYpIj4KPC9nPgo8L2c+Cjwvc3ZnPgo="              alt="show-button"            />          </p>          <p            style="              margin-top: 8px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Give your content a style by changing fonts, colors, borders and other properties          </p>        </td>        <td style="width: 35%;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              margin-left: 96px;              width: 480px;              height: 270px;              margin-bottom: 30px;            "          >            <p              style="                padding: 24px 46px;                font-weight: 600;                font-size: 18px;                line-height: 25px;                color: #383b41;                margin-bottom: 8px;              "            >              Drag & drop layouts, blocks, images and text            </p>            <div style="margin: 0 auto; position: relative; width: 111px;">              <div                style="                  height: 111px;                  margin-left: 22px;                  width: 100%;                  border-radius: 8px;                  background-color: #eaf7ff;                  border: 1px dashed #40abec;                "              ></div>              <img                style="position: absolute; left: -26px; top: 45px;"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTExIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMSAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTExIDEyLjQ0NDRDMTExIDUuNiAxMDUuNDUgMCA5OC42NjY3IDBIMTIuMzMzM0M1LjU1IDAgMCA1LjYgMCAxMi40NDQ0Vjk5LjU1NTZDMCAxMDYuNCA1LjU1IDExMiAxMi4zMzMzIDExMkg5OC42NjY3QzEwNS40NSAxMTIgMTExIDEwNi40IDExMSA5OS41NTU2VjEyLjQ0NDRaIiBmaWxsPSIjQjNENEZDIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzQuMzQ2OSA0Ni4xNTk4TDQ5Ljc4MTYgNjUuMDQyMkw3MS4zOTAyIDM2Ljc1TDk5LjE3MjcgNzQuMzg5M0gxMi43MzgzTDM0LjM0NjkgNDYuMTU5OFoiIGZpbGw9IiNGMUY4RkUiLz4KPC9zdmc+Cg=="                alt="drop-layout-logo"              />              <img                style="position: absolute; left: -12px;"                alt="drop-layout-logo-cursor"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjIiIGhlaWdodD0iNjMiIHZpZXdCb3g9IjAgMCA2MiA2MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjMzNzggMjIuNzU0NEMxNy44MTc4IDIyLjMyNDIgMTcuMDUzNCAyMi40MDUgMTYuNjMxMyAyMi45MzVMMTUuNDkzOSAyNC4zNjE1VjE1Ljc3NDZIMjMuOTI3OUwyMi41MjY2IDE2LjkzMjdDMjIuMDA2NCAxNy4zNjI3IDIxLjkyNyAxOC4xNDA1IDIyLjM0OTQgMTguNjcwMkMyMi41ODkxIDE4Ljk3MSAyMi45MzkxIDE5LjEyNyAyMy4yOTIxIDE5LjEyN0MyMy41NjA4IDE5LjEyNyAyMy44MzEyIDE5LjAzNjYgMjQuMDU2MSAxOC44NTA3TDI4LjExMjYgMTUuNDk4NEMyOC4xMTM1IDE1LjQ5NzUgMjguMTE0NCAxNS40OTY0IDI4LjExNTUgMTUuNDk1N0MyOC4xNDgyIDE1LjQ2ODQgMjguMTc5NSAxNS40MzkyIDI4LjIwOTQgMTUuNDA4NkMyOC4yMTc2IDE1LjQwMDIgMjguMjI0OSAxNS4zOTEgMjguMjMyOSAxNS4zODIzQzI4LjI1NCAxNS4zNTk1IDI4LjI3NDQgMTUuMzM2MiAyOC4yOTM3IDE1LjMxMThDMjguMzAzMiAxNS4yOTk5IDI4LjMxMTcgMTUuMjg3NSAyOC4zMjA3IDE1LjI3NTJDMjguMzM3MiAxNS4yNTI1IDI4LjM1MzMgMTUuMjI5NiAyOC4zNjgzIDE1LjIwNTdDMjguMzc2NSAxNS4xOTI5IDI4LjM4NDEgMTUuMTc5OCAyOC4zOTE2IDE1LjE2NjZDMjguNDA1OSAxNS4xNDE5IDI4LjQxOTcgMTUuMTE2NyAyOC40MzIyIDE1LjA5MUMyOC40Mzg2IDE1LjA3OCAyOC40NDQ4IDE1LjA2NTMgMjguNDUwNyAxNS4wNTIxQzI4LjQ2MjkgMTUuMDI0OCAyOC40NzQgMTQuOTk2NyAyOC40ODQzIDE0Ljk2ODNDMjguNDg4OCAxNC45NTYgMjguNDkzNSAxNC45NDM3IDI4LjQ5NzcgMTQuOTMxMkMyOC41MDc1IDE0LjkwMTIgMjguNTE1OSAxNC44NzA3IDI4LjUyMzQgMTQuODM5OEMyOC41MjY0IDE0LjgyNzkgMjguNTI5OCAxNC44MTYyIDI4LjUzMjQgMTQuODA0M0MyOC41Mzk0IDE0Ljc3MTYgMjguNTQ0NSAxNC43Mzg0IDI4LjU0ODkgMTQuNzA0OUMyOC41NTAzIDE0LjY5NDIgMjguNTUyNSAxNC42ODM4IDI4LjU1MzcgMTQuNjcyOUMyOC41NTgzIDE0LjYyOTEgMjguNTYxMSAxNC41ODQ1IDI4LjU2MTEgMTQuNTM5M0MyOC41NjExIDE0LjQ5NDEgMjguNTU4MyAxNC40NDk2IDI4LjU1MzcgMTQuNDA1NkMyOC41NTI1IDE0LjM5NDggMjguNTUwMyAxNC4zODQ0IDI4LjU0ODkgMTQuMzczNkMyOC41NDQ1IDE0LjM0MDIgMjguNTM5NCAxNC4zMDY5IDI4LjUzMjQgMTQuMjc0NEMyOC41Mjk4IDE0LjI2MjMgMjguNTI2NCAxNC4yNTA3IDI4LjUyMzQgMTQuMjM4OUMyOC41MTU5IDE0LjIwNzkgMjguNTA3NSAxNC4xNzcyIDI4LjQ5NzcgMTQuMTQ3MkMyOC40OTM1IDE0LjEzNSAyOC40ODg5IDE0LjEyMjcgMjguNDg0NCAxNC4xMTA0QzI4LjQ3NCAxNC4wODE5IDI4LjQ2MjkgMTQuMDUzOCAyOC40NTA2IDE0LjAyNjRDMjguNDQ0OCAxNC4wMTMzIDI4LjQzODYgMTQuMDAwNyAyOC40MzI0IDEzLjk4OEMyOC40MTk3IDEzLjk2MTkgMjguNDA1OCAxMy45MzY2IDI4LjM5MTQgMTMuOTExNkMyOC4zODQgMTMuODk4OCAyOC4zNzY1IDEzLjg4NTggMjguMzY4NSAxMy44NzMxQzI4LjM1MzMgMTMuODQ4OSAyOC4zMzY5IDEzLjgyNTcgMjguMzIgMTMuODAyN0MyOC4zMTEzIDEzLjc5MDcgMjguMzAzMSAxMy43Nzg3IDI4LjI5NDEgMTMuNzY3MUMyOC4yNzM5IDEzLjc0MTcgMjguMjUyNiAxMy43MTc2IDI4LjIzMDcgMTMuNjkzN0MyOC4yMjM2IDEzLjY4NjIgMjguMjE3MiAxMy42Nzc5IDI4LjIwOTggMTMuNjcwNEMyOC4xNzk3IDEzLjYzOTQgMjguMTQ3OSAxMy42MTAxIDI4LjExNDggMTMuNTgyNEMyOC4xMTM5IDEzLjU4MTcgMjguMTEzMiAxMy41ODA5IDI4LjExMjQgMTMuNTgwMkwyNC4wNTYxIDEwLjIyOEMyMy41MzU3IDkuNzk3NzQgMjIuNzcxNSA5Ljg3ODY1IDIyLjM0OTQgMTAuNDA4NkMyMS45MjcgMTAuOTM4MiAyMi4wMDY1IDExLjcxNjEgMjIuNTI2NyAxMi4xNDZMMjMuOTI3OSAxMy4zMDRIMTUuNDkzOVY0LjcxNzIyTDE2LjYzMTIgNi4xNDM3NEMxNi44NzA5IDYuNDQ0NjUgMTcuMjIxIDYuNjAwNjcgMTcuNTczOSA2LjYwMDU1QzE3Ljg0MjUgNi42MDA1NSAxOC4xMTMgNi41MTAyNSAxOC4zMzc4IDYuMzI0NDZDMTguODU4MSA1Ljg5NDQ1IDE4LjkzNzUgNS4xMTY1OSAxOC41MTUzIDQuNTg2ODlMMTUuMjIyNiAwLjQ1NjgxMkMxNS4yMjE4IDAuNDU1NyAxNS4yMjA4IDAuNDU0NzEyIDE1LjIxOTggMC40NTM3MjRDMTUuMTkzIDAuNDIwMjQ3IDE1LjE2NDUgMC4zODgzNzYgMTUuMTM0NCAwLjM1Nzk4OEMxNS4xMjYzIDAuMzQ5ODM1IDE1LjExNzMgMC4zNDI0MjQgMTUuMTA5MSAwLjMzNDUxOEMxNS4wODY0IDAuMzEzMDI0IDE1LjA2MzYgMC4yOTE5IDE1LjAzOTMgMC4yNzIyNTlDMTUuMDI3OCAwLjI2Mjc0NyAxNS4wMTU0IDAuMjUzOTc2IDE1LjAwMzUgMC4yNDQ4MzVDMTQuOTgxMiAwLjIyODAzNSAxNC45NTg1IDAuMjExNjA2IDE0LjkzNTEgMC4xOTYyODhDMTQuOTIyNiAwLjE4ODAxMiAxNC45MDk3IDAuMTgwMjI5IDE0Ljg5NjkgMC4xNzI0NDdDMTQuODcyNSAwLjE1Nzg3MSAxNC44NDc2IDAuMTQ0MDM1IDE0LjgyMjIgMC4xMzEwNjVDMTQuODA5NyAwLjEyNDc2NSAxNC43OTcxIDAuMTE4NDY1IDE0Ljc4NDQgMC4xMTI1MzVDMTQuNzU3MyAwLjA5OTkzNTMgMTQuNzI5OSAwLjA4ODY5NDEgMTQuNzAxOSAwLjA3ODA3MDZDMTQuNjg5OSAwLjA3MzYyMzUgMTQuNjc3NyAwLjA2ODY4MjQgMTQuNjY1NSAwLjA2NDQ4MjRDMTQuNjM2MSAwLjA1NDQ3NjUgMTQuNjA2IDAuMDQ2MDc2NSAxNC41NzU2IDAuMDM4Mjk0MUMxNC41NjM5IDAuMDM1MzI5NCAxNC41NTI2IDAuMDMxODcwNiAxNC41NDA4IDAuMDI5MTUyOUMxNC41MDg3IDAuMDIyMTExOCAxNC40NzYyIDAuMDE2OTIzNSAxNC40NDMyIDAuMDEyMzUyOUMxNC40MzI3IDAuMDEwOTk0MSAxNC40MjI1IDAuMDA4NjQ3MDYgMTQuNDExOSAwLjAwNzQxMTc2QzE0LjM2ODcgMC4wMDI3MTc2NSAxNC4zMjUgMCAxNC4yODA2IDBDMTQuMjM2MSAwIDE0LjE5MjQgMC4wMDI3MTc2NSAxNC4xNDkzIDAuMDA3NDExNzZDMTQuMTM4NyAwLjAwODY0NzA2IDE0LjEyODUgMC4wMTA5OTQxIDE0LjExNzkgMC4wMTIzNTI5QzE0LjA4NDkgMC4wMTY5MjM1IDE0LjA1MjQgMC4wMjIxMTE4IDE0LjAyMDQgMC4wMjkxNTI5QzE0LjAwODUgMC4wMzE4NzA2IDEzLjk5NzIgMC4wMzUzMjk0IDEzLjk4NTUgMC4wMzgyOTQxQzEzLjk1NTEgMC4wNDYwNzY1IDEzLjkyNSAwLjA1NDQ3NjUgMTMuODk1NiAwLjA2NDQ4MjRDMTMuODgzNCAwLjA2ODY4MjQgMTMuODcxMyAwLjA3MzYyMzUgMTMuODU5MiAwLjA3ODA3MDZDMTMuODMxMiAwLjA4ODY5NDEgMTMuODAzOCAwLjA5OTkzNTMgMTMuNzc2NyAwLjExMjUzNUMxMy43NjQgMC4xMTg0NjUgMTMuNzUxNCAwLjEyNDc2NSAxMy43Mzg5IDAuMTMxMDY1QzEzLjcxMzUgMC4xNDQwMzUgMTMuNjg4NyAwLjE1Nzg3MSAxMy42NjQzIDAuMTcyNDQ3QzEzLjY1MTQgMC4xODAyMjkgMTMuNjM4NyAwLjE4ODAxMiAxMy42MjYgMC4xOTYyODhDMTMuNjAyNiAwLjIxMTYwNiAxMy41Nzk5IDAuMjI4MDM1IDEzLjU1NzcgMC4yNDQ4MzVDMTMuNTQ1NyAwLjI1Mzk3NiAxMy41MzMzIDAuMjYyNzQ3IDEzLjUyMTggMC4yNzIyNTlDMTMuNDk3NiAwLjI5MTkgMTMuNDc0NyAwLjMxMzAyNCAxMy40NTIxIDAuMzM0NTE4QzEzLjQ0MzggMC4zNDI0MjQgMTMuNDM0OCAwLjM0OTgzNSAxMy40MjY3IDAuMzU3OTg4QzEzLjM5NjYgMC4zODgzNzYgMTMuMzY4MSAwLjQyMDI0NyAxMy4zNDEzIDAuNDUzNzI0QzEzLjM0MDQgMC40NTQ3MTIgMTMuMzM5MyAwLjQ1NTcgMTMuMzM4NSAwLjQ1NjgxMkwxMC4wNDU4IDQuNTg2ODlDOS42MjM1OSA1LjExNjU5IDkuNzAzMDYgNS44OTQ0NSAxMC4yMjMzIDYuMzI0NDZDMTAuNzQzMiA2Ljc1NDIyIDExLjUwNzYgNi42NzM2OCAxMS45MyA2LjE0Mzc0TDEzLjA2NzMgNC43MTcyMlYxMy4zMDRINC42MzMyNkw2LjAzNDM4IDEyLjE0NkM2LjU1NDY1IDExLjcxNjEgNi42MzQxMiAxMC45MzgyIDYuMjExNzcgMTAuNDA4NkM1Ljc4OTMgOS44Nzg3NyA1LjAyNTQgOS43OTc3NCA0LjUwNTAxIDEwLjIyOEwwLjQ0ODgwMiAxMy41ODAyQzAuNDQ3OTUzIDEzLjU4MDkgMC40NDcyMjUgMTMuNTgxNyAwLjQ0NjM3NiAxMy41ODI0QzAuNDEzMjUyIDEzLjYxMDEgMC4zODE0NjQgMTMuNjM5NCAwLjM1MTM3NCAxMy42NzA0QzAuMzQ0MDk0IDEzLjY3NzggMC4zMzc2NjMgMTMuNjg2MSAwLjMzMDUwNSAxMy42OTM3QzAuMzA4NTQ0IDEzLjcxNzYgMC4yODczMTEgMTMuNzQxNyAwLjI2NzE3IDEzLjc2NzFDMC4yNTgwNyAxMy43Nzg3IDAuMjQ5ODIgMTMuNzkwNyAwLjI0MTIwNSAxMy44MDI0QzAuMjI0MjE5IDEzLjgyNTcgMC4yMDc4NCAxMy44NDg5IDAuMTkyNjczIDEzLjg3MzFDMC4xODQ2NjUgMTMuODg1OCAwLjE3NzE0MyAxMy44OTg4IDAuMTY5NzQyIDEzLjkxMTZDMC4xNTUzMDMgMTMuOTM2NiAwLjE0MTQ3MiAxMy45NjE5IDAuMTI4NzMyIDEzLjk4OEMwLjEyMjU0NCAxNC4wMDA3IDAuMTE2MzU2IDE0LjAxMzMgMC4xMTA1MzIgMTQuMDI2NEMwLjA5ODI3NzkgMTQuMDUzOCAwLjA4NzExNTUgMTQuMDgxOSAwLjA3NjY4MSAxNC4xMTA0QzAuMDcyMTkxOCAxNC4xMjI3IDAuMDY3NTgxMiAxNC4xMzUgMC4wNjM0NTYgMTQuMTQ3MkMwLjA1MzYyODIgMTQuMTc3MyAwLjA0NTI1NjQgMTQuMjA4IDAuMDM3NjEyNSAxNC4yMzkxQzAuMDM0NzAwNiAxNC4yNTA4IDAuMDMxMzAzMyAxNC4yNjIzIDAuMDI4NzU1NCAxNC4yNzQzQzAuMDIxNzE4MiAxNC4zMDY4IDAuMDE2NjIyMyAxNC4zNDAzIDAuMDEyMTMzMSAxNC4zNzM4QzAuMDEwNjc3MSAxNC4zODQ0IDAuMDA4NjE0NDggMTQuMzk0OSAwLjAwNzQwMTE3IDE0LjQwNTZDMC4wMDI3OTA2MSAxNC40NDk2IDAgMTQuNDk0MSAwIDE0LjUzOTNDMCAxNC41ODQ1IDAuMDAyNzkwNjEgMTQuNjI5MSAwLjAwNzQwMTE3IDE0LjY3MjlDMC4wMDg2MTQ0OCAxNC42ODM4IDAuMDEwNzk4NCAxNC42OTQyIDAuMDEyMjU0NCAxNC43MDQ5QzAuMDE2NjIyMyAxNC43Mzg0IDAuMDIxNzE4MiAxNC43NzE2IDAuMDI4NzU1NCAxNC44MDQzQzAuMDMxMzAzMyAxNC44MTYyIDAuMDM0NzAwNiAxNC44Mjc5IDAuMDM3NzMzOSAxNC44Mzk4QzAuMDQ1MjU2NCAxNC44NzA3IDAuMDUzNjI4MiAxNC45MDEyIDAuMDYzNDU2IDE0LjkzMTJDMC4wNjc1ODEyIDE0Ljk0MzcgMC4wNzIzMTMxIDE0Ljk1NiAwLjA3NjgwMjQgMTQuOTY4M0MwLjA4NzExNTUgMTQuOTk2NyAwLjA5ODI3NzkgMTUuMDI0OCAwLjExMDQxMSAxNS4wNTIxQzAuMTE2MzU2IDE1LjA2NTMgMC4xMjI1NDQgMTUuMDc4IDAuMTI4OTc1IDE1LjA5MUMwLjE0MTQ3MiAxNS4xMTY3IDAuMTU1MTgyIDE1LjE0MTkgMC4xNjk0OTkgMTUuMTY2NkMwLjE3NzAyMiAxNS4xNzk4IDAuMTg0NjY1IDE1LjE5MjkgMC4xOTI3OTUgMTUuMjA1N0MwLjIwNzg0IDE1LjIyOTYgMC4yMjM5NzcgMTUuMjUyNSAwLjI0MDQ3OCAxNS4yNzUyQzAuMjQ5NDU2IDE1LjI4NzUgMC4yNTc5NDkgMTUuMjk5OSAwLjI2NzQxMyAxNS4zMTE4QzAuMjg2NzA0IDE1LjMzNjIgMC4zMDcyMDkgMTUuMzU5NSAwLjMyODIgMTUuMzgyM0MwLjMzNjIwNyAxNS4zOTEgMC4zNDM0ODcgMTUuNDAwMiAwLjM1MTczOCAxNS40MDg2QzAuMzgxNTg1IDE1LjQzOTIgMC40MTI4ODggMTUuNDY4NCAwLjQ0NTY0OCAxNS40OTU3QzAuNDQ2NzQgMTUuNDk2NCAwLjQ0NzU4OSAxNS40OTc1IDAuNDQ4NjgxIDE1LjQ5ODRMNC41MDUwMSAxOC44NTA3QzQuNzI5OTYgMTkuMDM2NiA1LjAwMDI4IDE5LjEyNyA1LjI2OTAzIDE5LjEyN0M1LjYyMTk4IDE5LjEyNyA1Ljk3MjAyIDE4Ljk3MSA2LjIxMTc3IDE4LjY3MDJDNi42MzQxMiAxOC4xNDA1IDYuNTU0NzcgMTcuMzYyNyA2LjAzNDUgMTYuOTMyN0w0LjYzMzI2IDE1Ljc3NDZIMTMuMDY3M1YyNC4zNjE1TDExLjkzIDIyLjkzNUMxMS41MDc2IDIyLjQwNSAxMC43NDM1IDIyLjMyNDIgMTAuMjIzMyAyMi43NTQ0QzkuNzAzMDYgMjMuMTg0MiA5LjYyMzU5IDIzLjk2MjIgMTAuMDQ1OSAyNC40OTE5TDEzLjMzODYgMjguNjIxOEMxMy4zMzkzIDI4LjYyMjYgMTMuMzQwMSAyOC42MjM0IDEzLjM0MDcgMjguNjI0MkMxMy4zNjc5IDI4LjY1OCAxMy4zOTY2IDI4LjY5MDMgMTMuNDI3MSAyOC43MjFDMTMuNDM0NSAyOC43MjgyIDEzLjQ0MjUgMjguNzM0OSAxMy40NTAxIDI4Ljc0MjJDMTMuNDczNCAyOC43NjQ0IDEzLjQ5NzIgMjguNzg2MiAxMy41MjIyIDI4LjgwNjdDMTMuNTMzNSAyOC44MTU4IDEzLjU0NTIgMjguODI0NCAxMy41NTY5IDI4LjgzMzFDMTMuNTc5NiAyOC44NTA0IDEzLjYwMjUgMjguODY3IDEzLjYyNjMgMjguODgyNEMxMy42Mzg4IDI4Ljg5MDcgMTMuNjUxNCAyOC44OTgyIDEzLjY2NCAyOC45MDU5QzEzLjY4ODcgMjguOTIwNiAxMy43MTM1IDI4LjkzNDUgMTMuNzM5MSAyOC45NDc2QzEzLjc1MTUgMjguOTUzOSAxMy43NjQgMjguOTYwMSAxMy43NzY3IDI4Ljk2NkMxMy44MDM4IDI4Ljk3ODYgMTMuODMxMiAyOC45OSAxMy44NTk0IDI5LjAwMDVDMTMuODcxNCAyOS4wMDUyIDEzLjg4MzQgMjkuMDA5OSAxMy44OTU1IDI5LjAxNDFDMTMuOTI1MSAyOS4wMjQxIDEzLjk1NTIgMjkuMDMyNSAxMy45ODU4IDI5LjA0MDRDMTMuOTk3MyAyOS4wNDMyIDE0LjAwODUgMjkuMDQ2NyAxNC4wMjAzIDI5LjA0OTRDMTQuMDUyMyAyOS4wNTY2IDE0LjA4NSAyOS4wNjE4IDE0LjExOCAyOS4wNjYzQzE0LjEyODUgMjkuMDY3NyAxNC4xMzg4IDI5LjA2OTkgMTQuMTQ5MyAyOS4wNzEyQzE0LjE5MjQgMjkuMDc1OSAxNC4yMzYxIDI5LjA3ODYgMTQuMjgwNiAyOS4wNzg2QzE0LjMyNSAyOS4wNzg2IDE0LjM2ODcgMjkuMDc1OSAxNC40MTE5IDI5LjA3MTJDMTQuNDIyMyAyOS4wNjk5IDE0LjQzMjcgMjkuMDY3NyAxNC40NDMxIDI5LjA2NjNDMTQuNDc2MSAyOS4wNjE4IDE0LjUwODggMjkuMDU2NiAxNC41NDA5IDI5LjA0OTRDMTQuNTUyNiAyOS4wNDY3IDE0LjU2MzkgMjkuMDQzMiAxNC41NzUzIDI5LjA0MDRDMTQuNjA1OSAyOS4wMzI1IDE0LjYzNiAyOS4wMjQxIDE0LjY2NTYgMjkuMDE0MUMxNC42Nzc3IDI5LjAwOTkgMTQuNjg5OCAyOS4wMDUyIDE0LjcwMTggMjkuMDAwNUMxNC43Mjk5IDI4Ljk5IDE0Ljc1NzMgMjguOTc4NiAxNC43ODQ0IDI4Ljk2NkMxNC43OTcxIDI4Ljk2MDEgMTQuODA5NiAyOC45NTM5IDE0LjgyMiAyOC45NDc2QzE0Ljg0NzYgMjguOTM0NSAxNC44NzI1IDI4LjkyMDYgMTQuODk3MSAyOC45MDU5QzE0LjkwOTcgMjguODk4MiAxNC45MjI1IDI4Ljg5MDcgMTQuOTM0OCAyOC44ODI0QzE0Ljk1ODYgMjguODY3IDE0Ljk4MTYgMjguODUwNCAxNS4wMDQyIDI4LjgzMzFDMTUuMDE1OSAyOC44MjQ0IDE1LjAyNzcgMjguODE1OCAxNS4wMzkxIDI4LjgwNjdDMTUuMDY0MSAyOC43ODYyIDE1LjA4NzcgMjguNzY0NCAxNS4xMTEgMjguNzQyMkMxNS4xMTg3IDI4LjczNDkgMTUuMTI2NyAyOC43MjgyIDE1LjEzNDEgMjguNzIxQzE1LjE2NDUgMjguNjkwMyAxNS4xOTMzIDI4LjY1OCAxNS4yMjA1IDI4LjYyNDJDMTUuMjIxMiAyOC42MjM0IDE1LjIyMTggMjguNjIyNiAxNS4yMjI1IDI4LjYyMThMMTguNTE1MiAyNC40OTE5QzE4LjkzNzUgMjMuOTYyMiAxOC44NTgxIDIzLjE4NDIgMTguMzM3OCAyMi43NTQ0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTU3LjM2OTQgMzIuMDkxQzU2LjU5NDMgMzIuMDkxIDU1Ljg1NjkgMzIuMjk4MyA1NS4yMDkyIDMyLjY2NzVWMzIuNTY0MUM1NS4yMDkyIDI5Ljg2ODcgNTMuMTUxNSAyNy42NzYgNTAuNjIyNCAyNy42NzZDNDkuODQxOCAyNy42NzYgNDkuMTA2MyAyNy44ODQ3IDQ4LjQ2MjIgMjguMjUyN1YyOC4xNDIzQzQ4LjQ2MjIgMjUuNDQ3IDQ2LjQwNDUgMjMuMjU0MSA0My44NzUzIDIzLjI1NDFDNDMuMDk1MSAyMy4yNTQxIDQyLjM2MSAyMy40NTg5IDQxLjcxODQgMjMuODIyVjEwLjcwMzNDNDEuNzE4NCA4LjAzOTk3IDM5LjcxOTIgNS44MTM5NyAzNy4yNjE3IDUuNzQwOTZDMzYuMDUyNCA1LjcwNzQ5IDM0Ljg5NzMgNi4xNjc2MyAzNC4wMTE5IDcuMDQzMDlDMzMuMDc5NSA3Ljk2NTExIDMyLjU0NDggOS4yNzE1NiAzMi41NDQ4IDEwLjYyNzNWMzkuODMyNEwyOC45NDA4IDM0Ljg4MzNDMjYuOTc1MyAzMi4xODQzIDIzLjUwOTEgMzEuNDEwNyAyMC42OTkxIDMzLjA0NDJDMTkuNTMwNiAzMy43MjM1IDE5LjEwNTEgMzUuMjc1IDE5Ljc1MDcgMzYuNTAzQzIxLjkyMTggNDAuNjMzMiAyNy4zMTg2IDUwLjY5MzcgMzAuNjEyIDU1LjA0NzlDMzEuMDU3MiA1NS43MDc1IDM2LjE4MjQgNjMuMDAwMSA0NS4wNjQzIDYzLjAwMDFDNDkuOTgzMSA2My4wMDAxIDU0LjEyMTUgNjEuMjA5OSA1Ny4wMzIyIDU3LjgyMzFDNTkuMTY0NSA1NS4zNDE2IDYwLjUyMTMgNTIuMDY1NiA2MC44NTIyIDQ4LjU5ODZMNjEuOTUwNSAzNy4wOTg4QzYxLjk1NDMgMzcuMDU5MSA2MS45NTYyIDM3LjAxOTEgNjEuOTU2MiAzNi45NzkyQzYxLjk1NjIgMzQuMjgzOSA1OS44OTg2IDMyLjA5MSA1Ny4zNjk0IDMyLjA5MVoiIGZpbGw9IiMwMTAxMDEiLz4KPHBhdGggZD0iTTU4LjQzNjggNDguMzU5N0M1OC4xNTQ1IDUxLjMxNzMgNTcuMDA3IDU0LjEwMDQgNTUuMjA1NiA1Ni4xOTY1QzUyLjczNDcgNTkuMDcxOCA0OS4zMjI2IDYwLjUyOTcgNDUuMDY0MSA2MC41Mjk3QzM3LjI3NjUgNjAuNTI5NyAzMi42NDY1IDUzLjcwMTIgMzIuNjAxOSA1My42MzQyQzMyLjU4NyA1My42MTE1IDMyLjU3MTIgNTMuNTg5MiAzMi41NTQ4IDUzLjU2NzVDMjkuMjg1OSA0OS4yNTg5IDIzLjU2NTQgMzguNTI0NyAyMS44OSAzNS4zMzc0QzIxLjg1NiAzNS4yNzI4IDIxLjg4ODYgMzUuMTk3NyAyMS45MDIgMzUuMTlDMjIuNTAzNSAzNC44NDAzIDIzLjE1NSAzNC42NzE5IDIzLjgwMDYgMzQuNjcxOUMyNS4wMDgyIDM0LjY3MTkgMjYuMTk0NyAzNS4yNjEyIDI2Ljk5MTIgMzYuMzU1TDMyLjc4MzIgNDQuMzA4NUMzMy4wOTUgNDQuNzM2NSAzMy42NDExIDQ0LjkxMyAzNC4xMzgzIDQ0Ljc0NTdDMzQuNjM1NCA0NC41Nzg2IDM0Ljk3MTIgNDQuMTA1NiAzNC45NzEyIDQzLjU3MjdWMTAuNjI3NkMzNC45NzEyIDkuOTM1NTYgMzUuMjM3OCA5LjI3NTI5IDM1LjcwMjUgOC44MTU2NEMzNi4xMTMzIDguNDA5MzUgMzYuNjQwMyA4LjE5NDQxIDM3LjE5MDkgOC4yMTA4NEMzOC4zNDkxIDguMjQ1MyAzOS4yOTE2IDkuMzYzMzcgMzkuMjkxNiAxMC43MDM1VjI4LjAwMzZDMzkuMjkxNiAyOC42NzczIDM5LjgyMTkgMjkuMjI2OCA0MC40ODM1IDI5LjIzODZDNDEuMTQwNyAyOS4yNDg0IDQxLjY5NDIgMjguNzIwNCA0MS43MTc1IDI4LjA0NjlDNDEuNzYyNSAyNi43NDQ4IDQyLjcxMDMgMjUuNzI1IDQzLjg3NTEgMjUuNzI1QzQ1LjA2NjMgMjUuNzI1IDQ2LjAzNTQgMjYuODA5NCA0Ni4wMzU0IDI4LjE0MjZWMzIuNTY0NEM0Ni4wMzU0IDMzLjI0NjUgNDYuNTc4NyAzMy43OTk3IDQ3LjI0ODcgMzMuNzk5N0M0Ny45MTg4IDMzLjc5OTcgNDguNDYyIDMzLjI0NjUgNDguNDYyIDMyLjU2NDRDNDguNDYyIDMxLjIzMTMgNDkuNDMxMSAzMC4xNDY4IDUwLjYyMjMgMzAuMTQ2OEM1MS44MTM0IDMwLjE0NjggNTIuNzgyMyAzMS4yMzEzIDUyLjc4MjMgMzIuNTY0NFYzNi4xMjIxQzUyLjc4MjMgMzYuMjc2IDUyLjgxMDcgMzYuNDI4NyA1Mi44NjU4IDM2LjU3Mkw1Mi45Mjc4IDM2LjczMzNDNTMuMTI1MyAzNy4yNDc4IDUzLjYzNjQgMzcuNTY1NCA1NC4xNzQ3IDM3LjUxMjhDNTQuNzE0OSAzNy40NTk1IDU1LjE1NDYgMzcuMDQ3NSA1NS4yNTE0IDM2LjUwMzlDNTUuNDUyIDM1LjM3ODUgNTYuMzQyNyAzNC41NjE5IDU3LjM2OTMgMzQuNTYxOUM1OC41NDQyIDM0LjU2MTkgNTkuNTAzIDM1LjYxNzEgNTkuNTI4OCAzNi45MjUyIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"              />            </div>          </div>        </td>      </tr>      <tr style="margin-left: 24px;">        <td style="width: 65%; padding-left: 24px;">          <h1            style="              font-family: 'Open Sans', sans-serif;              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Shortcodes for automation          </h1>          <h2            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            Use shortcodes for every automatized text and link you need          </h2>          <p            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Use shortcodes to set links between pages, define user names, email addresses, URLs,            training pieces, dates and many more properties          </p>        </td>        <td style="width: 35%; padding-right: 24px;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              margin-left: 96px;              width: 480px;              height: 270px;              margin-bottom: 30px;            "          >            <div              style="                height: 100%;                margin: 0 auto;                position: relative;                display: flex;                align-items: center;                justify-content: center;              "            >              <img                style="position: absolute; left: 80px;"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTExIiB2aWV3Qm94PSIwIDAgNzAgMTExIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY5LjI1ODMgOTguMDVMMjYuNTE2NyA1NS41TDY5LjI1ODMgMTIuOTVMNTYuMjUgMEwwLjUgNTUuNUw1Ni4yNSAxMTFMNjkuMjU4MyA5OC4wNVoiIGZpbGw9IiMwMEJDRDQiLz4KPC9zdmc+Cg=="                alt="drop-layout-logo"              />              <p                style="                  font-style: normal;                  font-weight: 600;                  font-size: 22px;                  line-height: 30px;                  color: #00bcd4;                  text-align: center;                  vertical-align: middle;                "              >                user_name              </p>              <img                style="position: absolute; right: 80px;"                alt="drop-layout-logo-cursor"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTExIiB2aWV3Qm94PSIwIDAgNzAgMTExIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAuNSA5OC4wNUw0My4yNDE3IDU1LjVMMC41IDEyLjk1TDEzLjUwODMgMEw2OS4yNTgzIDU1LjVMMTMuNTA4MyAxMTFMMC41IDk4LjA1SDAuNVoiIGZpbGw9IiMwMEJDRDQiLz4KPC9zdmc+Cg=="              />            </div>          </div>        </td>      </tr>      <tr style="margin-left: 24px;">        <td style="width: 35%; padding-left: 24px;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              width: 480px;              height: 270px;              margin-bottom: 32px;            "          >            <div style="height: 100%; position: relative; padding: 45px 50px;">              <p                style="                  font-weight: 600;                  font-size: 20px;                  line-height: 24px;                  margin: 0;                  color: #383b41;                "              >                Login              </p>              <form type="POST" style="margin-bottom: 16px;">                <input                  style="                    display: block;                    margin-top: 16px;                    margin-bottom: 8px;                    background: #ffffff;                    border: 1px solid #dcdfe6;                    padding: 12px;                    width: 360px;                    box-sizing: border-box;                    border-radius: 8px;                  "                  placeholder="Username"                  name="username"                />                <input                  style="                    font-family: 'Open Sans', sans-serif;                    display: block;                    background: #ffffff;                    border: 1px solid #dcdfe6;                    padding: 12px;                    width: 360px;                    box-sizing: border-box;                    border-radius: 8px;                  "                  name="password"                  type="password"                  placeholder="Password"                />                <input                  type="submit"                  value="LOGIN"                  style="                    font-family: 'Open Sans', sans-serif;                    background: #fbf280;                    border-radius: 2px;                    padding: 6px 16px;                    font-weight: 600;                    font-size: 14px;                    line-height: 24px;                    color: #b6791d;                    margin-top: 16px;                  "                />              </form>            </div>          </div>        </td>        <td style="width: 65%; padding-right: 24px;">          <h1            style="              font-family: 'Open Sans', sans-serif;              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Create forms for realistic phishing simulations          </h1>          <h2            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            Use input fields and submit buttons to see who takes the bait!          </h2>          <p            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Drag and drop form elements, labels, placeholders and give them style          </p>        </td>      </tr>      <tr style="background: #f2f2f2; font-family: 'Open Sans', sans-serif;">        <td          style="            font-family: 'Open Sans', sans-serif;            font-style: normal;            font-weight: 600;            font-size: 18px;            line-height: 25px;            padding: 8px 0 8px 48px;          "        >          Copyright 2021 - Privacy Policy        </td>        <td style="padding: 8px 48px 8px 0; text-align: right;">          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM0NTYxOUQiLz4KPHBhdGggZD0iTTE4LjU0MTkgMy44Mzk4NEMxNC4yMDM3IDMuODM5ODQgMTIuNzcxOSA1LjgzMDI4IDEyLjc3MTkgOS4yNDM4NFYxMS45NDU4SDkuOTIxODhWMTYuMDAxOEgxMi43NzE5VjI4LjE1OThIMTguMDI3OVYxNi4wMDE4SDIxLjU5OTlMMjIuMDc5OSAxMS45NDU4SDE4LjAyNzlWOS41MzU4NEMxOC4wMjc5IDguNDQ2NTQgMTguMjY2OSA3Ljg5Mzg0IDE5Ljk1NzkgNy44OTM4NEgyMi4wNzk5VjMuODM5ODRIMTguNTQxOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="facebook-icon"            style="margin-right: 24px; margin-bottom: -2px;"          />          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM1NUFDRUUiLz4KPHBhdGggZD0iTTE5LjgzMjEgNy42NzcxNkMxNy41NjIgNy43MzQ2OSAxNS43NDA5IDkuNTkyNzcgMTUuNzQwOSAxMS44NzcyQzE1Ljc0MDkgMTIuMjA2IDE1Ljc3NjIgMTIuNTI3NSAxNS44NDgxIDEyLjgzNTZDMTIuMzU1OSAxMi42NjAxIDkuMjU5NzggMTAuOTg3NCA3LjE4NzMyIDguNDQ1MTZDNi44MjU2MiA5LjA2NTQ1IDYuNjE3NzIgOS43ODc5OSA2LjYxNzcyIDEwLjU1ODhDNi42MTc3MiAxMi4wMTYzIDcuMzYwNjQgMTMuMzAxNCA4LjQ4ODEyIDE0LjA1NDhDNy43OTk2NiAxNC4wMzI3IDcuMTUwNzcgMTMuODQzMSA2LjU4NDEyIDEzLjUyODRDNi41ODM4IDEzLjU0NTggNi41ODQxMiAxMy41NjQ5IDYuNTg0MTIgMTMuNTgyOEM2LjU4NDEyIDE1LjYxODIgOC4wMzI5NCAxNy4zMTQ1IDkuOTU1MzIgMTcuNzAxMkM5LjYwMjc3IDE3Ljc5NjggOS4yMzE0MyAxNy44NDg0IDguODQ4MTIgMTcuODQ4NEM4LjU3NzA2IDE3Ljg0ODQgOC4zMTQyMyAxNy44MjI2IDguMDU3NzIgMTcuNzczMkM4LjU5Mjc3IDE5LjQ0MjQgMTAuMTQyNSAyMC42NTc5IDExLjk4MDkgMjAuNjkxNkMxMC41NDI5IDIxLjgxODYgOC43MzM4NiAyMi40OSA2Ljc2NDkyIDIyLjQ5QzYuNDI2MDkgMjIuNDkgNi4wOTA1NyAyMi40NzE0IDUuNzYxNzIgMjIuNDMyNEM3LjYyMTczIDIzLjYyNTEgOS44MjkxIDI0LjMyMDQgMTIuMjAxNyAyNC4zMjA0QzE5LjkzMDcgMjQuMzIwNCAyNC4xNTY5IDE3LjkxNzggMjQuMTU2OSAxMi4zNjUyQzI0LjE1NjkgMTIuMTgzMSAyNC4xNTM2IDEyIDI0LjE0NTcgMTEuODE5NkMyNC45NjY0IDExLjIyODQgMjUuNjc4OCAxMC40ODc5IDI2LjI0MTcgOS42NDUxNkMyNS40ODg4IDkuOTc5ODMgMjQuNjc5MSAxMC4yMDY1IDIzLjgyODkgMTAuMzA3NkMyNC42OTcgOS43ODc4OSAyNS4zNjMgOC45NjQ3NCAyNS42NzY5IDcuOTgyNzZDMjQuODY1IDguNDY0NjEgMjMuOTY1NiA4LjgxNDgyIDIzLjAwODEgOS4wMDM1NkMyMi4yNDE5IDguMTg3MDUgMjEuMTQ5NSA3LjY3NzE2IDE5Ljk0MDkgNy42NzcxNkMxOS45MDQ3IDcuNjc3MTYgMTkuODY4MiA3LjY3NjI1IDE5LjgzMjEgNy42NzcxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="twitter-icon"            style="margin-right: 24px; margin-bottom: -2px;"          />          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiMyQTVCODMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjY0NTc5IDUuNzc3NDNDNy42ODg5OSA1Ljc3MjYyIDcuNzMyMzQgNS43Njc3OSA3Ljc3NjAzIDUuNzU5NzdIMjQuMjI3NEMyNC4yNDI5IDUuNzYyNDggMjQuMjU2NSA1Ljc2NTUzIDI0LjI2OTkgNS43Njg1MUMyNC4yODk2IDUuNzcyOTIgMjQuMzA4NiA1Ljc3NzE4IDI0LjMzMTggNS43Nzk5OEMyNS4yNjExIDUuOTA3NTYgMjYuMDE5NyA2LjYyNTQ0IDI2LjE5OTYgNy41NDMzNUMyNi4yMTQyIDcuNjIwNzQgMjYuMjI0NSA3LjY4NjY1IDI2LjIzNjIgNy43NjA5OEwyNi4yMzYyIDcuNzYxMTlMMjYuMjM2MyA3Ljc2MTMxTDI2LjI0MTcgNy43OTU5OFYyNC4yMDM2QzI2LjIzNTggMjQuMjQwMyAyNi4yMzA1IDI0LjI3NjggMjYuMjI1MiAyNC4zMTMzQzI2LjIxNzQgMjQuMzY3NCAyNi4yMDk2IDI0LjQyMTQgMjYuMTk5NiAyNC40NzY0QzI2LjAzNTggMjUuMzE3OCAyNS4zNTcxIDI2LjAxOTcgMjQuNTIwNSAyNi4xOTc3QzI0LjQ1OTcgMjYuMjEwOCAyNC4zOTk4IDI2LjIxNyAyNC4zMzk1IDI2LjIyMzJMMjQuMzM5NCAyNi4yMjMyTDI0LjMzOTQgMjYuMjIzMkMyNC4yOTUxIDI2LjIyNzggMjQuMjUwNyAyNi4yMzI0IDI0LjIwNTUgMjYuMjM5OEg3Ljc5NzkzQzcuNzc3NzUgMjYuMjM3IDcuNzU4NDIgMjYuMjMzNiA3LjczOTIyIDI2LjIzMDJMNy43MzkwOSAyNi4yMzAyQzcuNzE2OCAyNi4yMjYzIDcuNjk0NjggMjYuMjIyNCA3LjY3MTYxIDI2LjIxOTZDNi43Njk4MiAyNi4xMDM0IDYuMDI0ODEgMjUuNDI4MSA1LjgyNDAzIDI0LjU0MDRDNS44MDA1MyAyNC40MzcgNS43ODA1MiAyNC4zMjg5IDUuNzYxNzIgMjQuMjI1NFY3Ljc3NDA4QzUuNzY0NTUgNy43NTYxNSA1Ljc2Nzk5IDcuNzQwNTEgNS43NzEzOSA3LjcyNUM1Ljc3NTI2IDcuNzA3NDEgNS43NzkwOCA3LjY5MDAxIDUuNzgxOTMgNy42Njk2NkM1LjkxMTUyIDYuNzQ5NzQgNi41NzUxNSA2LjAwODY5IDcuNDgyOTggNS44MDE4N0M3LjUzNzI1IDUuNzg5NTIgNy41OTE0IDUuNzgzNDkgNy42NDU3OSA1Ljc3NzQzWk0yMi41NTM5IDcuNDE2ODdIMjIuNTUzOEgyMi41NTM2QzIyLjEyNTUgNy40MTY3MiAyMS42OTgxIDcuNDE2NTYgMjEuMjY4MiA3LjQxNzAzQzIwLjgwNjMgNy40MTc3IDIwLjQyOTUgNy43OTM0NiAyMC40Mjk1IDguMjU3NDVDMjAuNDI5MyA4LjQzMzU3IDIwLjQyODkgOC42MTAxOCAyMC40Mjg0IDguNzg2OTlWOC43ODczMVY4Ljc4NzMzQzIwLjQyNzMgOS4yNTQxOCAyMC40MjYxIDkuNzIyNTMgMjAuNDI5NSAxMC4xODc2QzIwLjQzMDEgMTAuMjc2NSAyMC40NTcxIDEwLjM1NyAyMC40ODUxIDEwLjQ0MDRMMjAuNDkxOCAxMC40NjA0QzIwLjYwOCAxMC44MDE1IDIwLjkwNzQgMTEuMDI0MyAyMS4yOTAxIDExLjAyNjNDMjEuNDQ1NiAxMS4wMjYzIDIxLjYwMzcgMTEuMDIxMiAyMS43NjE3IDExLjAxNjJDMjEuOTE5OCAxMS4wMTExIDIyLjA3NzkgMTEuMDA2MSAyMi4yMzMzIDExLjAwNjFDMjIuMzQ1OCAxMS4wMDYxIDIyLjQ1NzcgMTEuMDA3IDIyLjU2OTUgMTEuMDA3OUgyMi41Njk1SDIyLjU2OTZDMjIuNzkyOCAxMS4wMDk3IDIzLjAxNTQgMTEuMDExNCAyMy4yNDA1IDExLjAwNjFDMjMuNjc0MiAxMC45OTUzIDI0LjAxNjkgMTAuNjIyIDI0LjAxNjkgMTAuMTg3NlY4LjI1NzQ1QzI0LjAxNjkgNy43OTM0NiAyMy42NjEgNy40MTc3MyAyMy4xOTgzIDcuNDE3MDNMMjIuNTUzOSA3LjQxNjg3Wk0xNi4wMDE3IDExLjg0NDhDMTguMzI2NCAxMS44NDM1IDIwLjIwNyAxMy43NjA3IDIwLjE1NjcgMTYuMDg0QzIwLjEwNzYgMTguMzM4MSAxOC4yMTY2IDIwLjIwNDQgMTUuODk3MyAyMC4xNTQ3QzEzLjY2OCAyMC4xMDcgMTEuODEzOSAxOC4yNjA4IDExLjg0NjggMTUuOTM3NUMxMS44NzgzIDEzLjY3NTkgMTMuNzI5NCAxMS44NDM1IDE2LjAwMTcgMTEuODQ0OFpNOS45MTY2NyAxNC4wNjk3SDcuOTY0NjdWMTQuMTExOEM3Ljk2NDY3IDE1LjEyMTkgNy45NjQ1OSAxNi4xMzMzIDcuOTY0NTEgMTcuMTQ1MkM3Ljk2NDM2IDE5LjE3MDEgNy45NjQyIDIxLjE5NjcgNy45NjQ2NyAyMy4yMTgzQzcuOTY0NjcgMjMuNjU0MSA4LjM0NjczIDI0LjAxNDkgOC43ODMxOSAyNC4wMTQ5QzEzLjU5MSAyNC4wMTU2IDE4LjQxMjUgMjQuMDE1NiAyMy4yMjAyIDI0LjAxNDlDMjMuNjYwNyAyNC4wMTQ5IDI0LjAxNjkgMjMuNjU4MSAyNC4wMTY5IDIzLjIxODNDMjQuMDE3MyAyMS4xOTk2IDI0LjAxNzIgMTkuMTc5MiAyNC4wMTcgMTcuMTU5NkMyNC4wMTcgMTYuMTUwMSAyNC4wMTY5IDE1LjE0MDggMjQuMDE2OSAxNC4xMzJWMTQuMDY5N0gyMi4wNjY2QzIyLjM0MjUgMTQuOTUyIDIyLjQyNTYgMTUuODQwOCAyMi4zMTc1IDE2Ljc1NkMyMi4yMDk0IDE3LjY3MTIgMjEuOTE2OCAxOC41MjkgMjEuNDM2NyAxOS4zMTZDMjAuOTU2NiAyMC4xMDI5IDIwLjMzMSAyMC43NDcyIDE5LjU2ODkgMjEuMjY2M0MxNy41OTIxIDIyLjYxMzMgMTQuOTk0NCAyMi43Mzg4IDEyLjg5NiAyMS41NjFDMTEuODM1OCAyMC45NjY4IDExLjAwMTcgMjAuMTMzIDEwLjQyMDIgMTkuMDYzM0M5LjU1NDcxIDE3LjQ2OTkgOS40MDkwMyAxNS44MDYxIDkuOTE2NjcgMTQuMDY5N1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="instagram-icon"            style="margin-bottom: -2px;"          />        </td>      </tr>    </tbody>  </table>`
      })
      this.selectedEditLandingPageTab = this.editData.landingPages.length === 1 ? '1' : '2'
    },
    handleDeleteLandingPage(index) {
      this.editData.landingPages.splice(index, 1)
      if (index === 1 || index === 0) {
        this.selectedEditLandingPageTab = '1'
      }
    },
    handleUploadHTML() {
      this.$refs.refHtmlFile.click()
    },
    handleHTMLUploadChange(e) {
      const file = e.target.files[0]
      if (file.type !== 'text/html') {
        return this.$store.dispatch('common/createSnackBar', {
          message: `Invalid file type`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      if (file.size > 5242880) {
        return this.$store.dispatch('common/createSnackBar', {
          message: `File size should be less than 5MB`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      const reader = new FileReader()
      const that = this
      reader.onload = function (e) {
        const { result } = e.target
        if (!result?.length) {
          return this.$store.dispatch('common/createSnackBar', {
            message: `Empty file`,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        that.editData.landingPages.push({
          name: `Page 2`,
          order: 2,
          content: result
        })
        that.tab = 'page2'
      }
      reader.readAsText(file)
    },
    callForMergedTags() {
      getMergedTextForPhishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    getTagsComponent(item) {
      return MERGED_TEXTS_MAP[item]
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    },
    callForLandingPageFormDetails() {
      getLandingPageFormDetails().then((response) => {
        const domainRecords = response?.data?.data?.domainRecords?.map((item) => {
          return {
            text: item.domain,
            value: item.id.toString(),
            extraDatas: [
              {
                text: item.urlSchemaType,
                value: item.urlSchemaTypeId.toString()
              },
              { text: item.isStopBotActivity, value: item.isStopBotActivity }
            ]
          }
        })
        this.landingPageData = { ...response.data.data, domainRecords }
      })
    },
    handleEdit() {
      this.$emit(
        'on-edit-landing-page-template',
        this.landingPagePreviewSelectedRow,
        this.isSystemTemplateForNonSystemUser
      )
    },
    handleExitEditing() {
      const isChanged = isDifferent(this.editData, this.initialEditData)
      if (!isChanged) {
        this.isEditMode = false
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.isEditMode = false
        }
      })
    },
    handleSaveAsNew() {
      if (!this.$refs.refEmailTemplateContent.validate()) return
      if (!this.editData.phishingLink.subDomain) return
      this.isSaving = true
      let payload = {
        ...this.landingPageTemplateData,
        ...this.editData,
        ...this.editData.phishingLink,
        name:
          this.editData.name !== this.landingPageTemplateData.name
            ? this.editData.name
            : `${this.editData.name} - Copy`,
        availableForRequests: this.landingPageTemplateData.availableForList
      }
      delete payload.resourceId
      delete payload.phishingLink
      createLandingPage(payload)
        .then((response) => {
          const landingPageTemplate = response.data.data.landingPageTemplate
          if (landingPageTemplate) {
            landingPageTemplate.languageTypeName =
              this.languages.find(
                (lang) => lang.languageTypeName === landingPageTemplate.languageTypeName
              )?.text || landingPageTemplate.languageTypeName
          }
          this.insertTemplate({
            ...payload,
            ...response.data.data.landingPageTemplate,
            urlTemplate: this.newUrlTemplate
          })
        })
        .finally(() => {
          this.isSaving = false
          this.isEditMode = false
        })
    },
    handleSaveChanges() {
      if (!this.$refs.refEmailTemplateContent.validate()) return
      if (!this.editData.phishingLink.subDomain) return
      this.isSaving = true
      let payload = {
        ...this.landingPageTemplateData,
        ...this.editData,
        ...this.editData.phishingLink,
        availableForRequests: this.landingPageTemplateData.availableForList
      }
      delete payload.phishingLink
      updateLandingPage(payload, this.landingPageTemplateData.resourceId)
        .then(() => {
          this.updateTemplate(this.landingPageTemplateData.resourceId, {
            ...payload,
            urlTemplate: this.newUrlTemplate
          })
        })
        .finally(() => {
          this.isSaving = false
          this.isEditMode = false
        })
    },
    updateTemplate(resourceId, newTemplate) {
      const templateIndex = this.listData.findIndex(
        (template) => template.resourceId === resourceId
      )
      if (templateIndex !== -1) {
        this.listData[templateIndex] = {
          ...this.listData[templateIndex],
          ...newTemplate
        }
        this.landingPageTemplateData = { ...this.listData[templateIndex] }
        this.templateURL = newTemplate.urlTemplate || ''
        this.templateName = newTemplate.name
        this.isInvisibleCaptchaEnabled = newTemplate.isInvisibleCaptchaEnabled
        this.selectedTemplateHeader = newTemplate.landingPages[0]?.name || ''
        this.applyLandingPageTemplatePayload(newTemplate)
        this.loadingTemplatePreview = false
        this.selectedLandingPageTab = '1'
      }
    },
    insertTemplate(newTemplate) {
      this.templateURL = newTemplate.urlTemplate || ''
      this.isInvisibleCaptchaEnabled = newTemplate.isInvisibleCaptchaEnabled
      this.templateName = newTemplate.name
      this.selectedTemplateHeader = newTemplate.landingPages[0]?.name || ''
      this.applyLandingPageTemplatePayload(newTemplate)
      this.loadingTemplatePreview = false
      this.selectedLandingPageTab = '1'
      this.listData.unshift(newTemplate)
      this.listData[0].selected = true
      this.listData.forEach((item, index) => {
        if (index !== 0) {
          item.selected = false
        }
      })
      this.landingPageTemplateData = { ...newTemplate }
      this.setSelectedTemplate(newTemplate, 0)
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
            } else {
              data.data.results = data.data.results.map((item) => {
                let languageTypeName
                if (Array.isArray(item.languageTypeName)) {
                  languageTypeName = item.languageTypeName.map(
                    (language) =>
                      this.languages.find((lang) => lang.languageTypeName === language)?.text ||
                      language
                  )
                } else if (typeof item.languageTypeName === 'string') {
                  const language = this.languages.find(
                    (lang) => lang.languageTypeName === item.languageTypeName
                  )
                  languageTypeName = language?.text || item.languageTypeName
                }
                return {
                  ...item,
                  languageTypeName: languageTypeName,
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
      this.checkAndAddResourceIdToPayload(isInitial, bodyData)
      return this.apiFuncs
        .list(this.bodyData)
        .then((response) => {
          const { data } = response
          this.totalNumberOfPages = data.data.totalNumberOfPages
          if (!response.data.data.results.length) {
            this.listData = []
            this.templateHTML = null
          } else {
            data.data.results = data.data.results.map((item) => {
              let languageTypeName
              if (Array.isArray(item.languageTypeName)) {
                languageTypeName = item.languageTypeName.map(
                  (language) =>
                    this.languages.find((lang) => lang.languageTypeName === language)?.text ||
                    language
                )
              } else if (typeof item.languageTypeName === 'string') {
                const language = this.languages.find(
                  (lang) => lang.languageTypeName === item.languageTypeName
                )
                languageTypeName = language?.text || item.languageTypeName
              }
              return {
                ...item,
                languageTypeName: languageTypeName,
                selected: false
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
    setItemToFirstIndex(resourceId = '') {
      const itemIndex = this.listData.findIndex((item) => item.resourceId === resourceId)
      if (itemIndex === -1) return
      this.listData = [
        this.listData[itemIndex],
        ...this.listData.slice(0, itemIndex),
        ...this.listData.slice(itemIndex + 1)
      ]
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
    checkIsRedFlaggedTemplate(html) {
      return typeof html === 'string' && html.includes('data-redflag')
    },
    getPreviewLandingHtml(html) {
      if (typeof html === 'string' && html.includes('data-redflag')) {
        let logo =
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl || ''
        if (!logo) logo = this?.$store?.state?.whitelabel?.mainLogoUrl || ''
        return html.replace(/\{COMPANYLOGO\}/g, logo)
      }
      return html
    },
    getLanguageOptionById(languageId = '') {
      if (!languageId) return null
      const languageValues = this.languages || []
      const normalizedId = languageId.toString()
      return languageValues.find(
        (language) =>
          (language.value && language.value.toString() === normalizedId) ||
          (language.languageTypeResourceId &&
            language.languageTypeResourceId.toString() === normalizedId) ||
          (language.id && language.id.toString() === normalizedId)
      )
    },
    getLandingPageContent(template = {}) {
      if (!template) return ''
      const languageId = this.languagePreview || template.languageTypeResourceId

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
    transformLandingPages(landingPages = [], mainLanguageId = '', mainLanguageTypeName = '') {
      const languages = []
      const landingPageTemplates = []

      if (mainLanguageId && mainLanguageTypeName) {
        languages.push({
          value: mainLanguageId,
          text: mainLanguageTypeName
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
            languages.push({
              value: landingPage.languageTypeResourceId,
              text: landingPage.languageTypeName || mainLanguageTypeName
            })
          }
        }

        // Add other language versions from languages array
        if (landingPage.languages && Array.isArray(landingPage.languages)) {
          landingPage.languages.forEach((languagePage) => {
            if (languagePage.languageTypeResourceId && languagePage.content) {
              pageLanguages[languagePage.languageTypeResourceId] = languagePage.content
              if (!languages.find((lang) => lang.value === languagePage.languageTypeResourceId)) {
                languages.push({
                  value: languagePage.languageTypeResourceId,
                  text: languagePage.languageTypeName
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
        this.languagePreview
      const mainLanguageTypeName =
        landingPages[0]?.languageTypeName || payload.languageTypeName || ''
      const { templates, languages } = this.transformLandingPages(
        landingPages,
        mainLanguageId,
        mainLanguageTypeName
      )

      this.landingPageTemplates = templates
      this.selectedTemplateLanguages = languages

      if (languages.length) {
        const hasCurrentLang = languages.some((lang) => lang.value === this.languagePreview)
        if (!hasCurrentLang) {
          this.languagePreview = languages[0].value
        }
      } else {
        this.languagePreview = mainLanguageId || ''
      }
    },
    handleLandingPagePreviewLanguageChange(languageId) {
      if (!languageId) return
      this.languagePreview = languageId
    },
    setSelectedTemplate(item, index, isInitial = false) {
      if (this.isSaving) return
      const isChanged = isDifferent(this.editData, this.initialEditData)
      if (this.isEditMode && isChanged) {
        this.handleExitEditing()
        return
      }
      this.isEditMode = false
      this.listData = this.listData.map((item) => {
        return { ...item, selected: false }
      })
      if (index !== undefined) {
        if (this.listData[index]) {
          this.listData[index].selected = true
        }
        this.selectedPreviousIndex = index
      }
      this.$emit('selectedLandingPageChange', item.id)
      this.$emit('selectedLandingPageTemplateResourceId', item.resourceId)
      if (isInitial) {
        this.$emit('initialLandingPageTemplateId', item.id)
      }
      this.apiFuncs
        .content(item.resourceId)
        .then((response) => {
          this.landingPageTemplateData = {
            ...(item || {}),
            ...(response?.data?.data || {})
          }
          this.templateURL = response?.data?.data?.urlTemplate || ''
          this.isInvisibleCaptchaEnabled = response?.data?.data?.isInvisibleCaptchaEnabled || false
          this.newUrlTemplate = this.templateURL
          this.templateName = response?.data?.data?.name
          this.selectedTemplateHeader = response?.data?.data?.landingPages[0]?.name || ''
          this.applyLandingPageTemplatePayload(this.landingPageTemplateData)
        })
        .finally(() => {
          this.loadingTemplatePreview = false
          this.selectedLandingPageTab = '1'
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
      } else {
        this.selectedTab = 'mfaSettings'
      }
      return false
    }
  }
}
</script>
