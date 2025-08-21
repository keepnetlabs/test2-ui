<template>
  <v-card class="email-template__container">
    <v-dialog v-if="feedbackDialog" v-model="feedbackDialog" persistent :width="600">
      <feedback-popup></feedback-popup>
    </v-dialog>
    <app-modal
      v-if="showGrapesModal"
      :status="showGrapesModal"
      icon-name="mdi-check"
      :title="labels.NotificationTemplate"
      z-index="9999"
      :style="{ 'z-index': '999999' }"
      :show-header="false"
      :should-remove-overflow="false"
      @submit="saveGrapeJs"
      @closeOverlay="toggleShowGrapesModal"
    >
      <template #overlay-body>
        <GrapesNewsletterModal
          v-if="showGrapesModal"
          ref="grapesJsPostIncident"
          :isEdit="isEdit"
          :htmlData="template"
          :key="grapeJsKey"
          :blockManagerComponents="activeBlockManagerComponents"
          :template-type="templateType"
          :isAttachmentBasedTemplate="isAttachmentBasedScenario"
          :customHeadScripts="customHeadScripts"
          :isShowHeadScripts="isShowHeadScripts"
          @on-custom-head-scripts-change="
            (value, pageIndex) => onCustomHeadScriptsChange(value, pageIndex)
          "
        />
      </template>
    </app-modal>
    <div
      v-if="isAiAssistant && isAIAllyEnabled"
      :class="[
        'email-template__ai-assistant',
        templateType === 'landing' ? 'email-template__ai-assistant--landing' : ''
      ]"
    >
      <div class="email-template__ai-assistant-header">
        <div class="email-template__ai-assistant-left">
          <div class="mr-4">
            <VIcon style="font-size: 32px;" color="#00559B">
              mdi-creation
            </VIcon>
          </div>
          <div>
            <div class="email-template__ai-assistant-left-title">AI Ally</div>
            <div class="email-template__ai-assistant-left-description">
              {{
                templateType === 'landing'
                  ? 'Let your intelligent AI assistant craft perfect landing page templates for you—effortlessly and on demand!'
                  : 'Let your intelligent AI assistant craft perfect email templates for you—effortlessly and on demand!'
              }}
            </div>
          </div>
        </div>
        <div
          :style="
            !aiAssistant &&
            'padding: 3px;background: linear-gradient(90deg, #1173c1 0%, #79c4ff 100%);border-radius: 18px;max-height:38px;'
          "
        >
          <div v-if="!aiAssistant">
            <VBtn
              class="white--text btn-util email-template__ai-assistant-btn"
              rounded
              :ripple="false"
              @click="$emit('update:aiAssistant', true)"
            >
              <VIcon class="cursor-pointer mr-1" color="#fff">
                mdi-creation
              </VIcon>
              USE
            </VBtn>
          </div>
          <VIcon
            v-else
            class="cursor-pointer email-template__ai-assistant-btn-close"
            color="#1173C1"
            @click="$emit('update:aiAssistant', false)"
          >
            mdi-close
          </VIcon>
        </div>
      </div>
      <transition>
        <div v-show="aiAssistant" class="email-template__ai-assistant-content">
          <div class="email-template__ai-assistant-content__left">
            <div class="email-template__ai-assistant-content__left-title mb-2">
              TRY SUGGESTIONS
            </div>
            <div class="d-flex gap-2 flex-column">
              <div
                v-for="(i, index) in templateType === 'landing'
                  ? landingPageBadgeContents
                  : badgeContents"
                :key="index"
                class="email-template__ai-assistant-content-badge"
                @click="handleAiAssistantBadgeClick(index)"
              >
                {{ i.title }}
              </div>
            </div>
          </div>
          <div class="email-template__ai-assistant-content__right">
            <div class="d-flex flex-column">
              <div class="email-template__ai-assistant__selects">
                <InputSelectLanguage
                  v-bind="selectLanguageRules"
                  style="max-width: 160px;"
                  :value="languageTypeResourceId"
                  class="email-template__ai-assistant-footer-left-select"
                  required
                  hide-details
                  item-text="text"
                  item-value="value"
                  label="Language"
                  :items="languageOptions"
                  :menu-props="{ offsetY: true }"
                  disabled
                  @input="$emit('update:languageTypeResourceId', $event)"
                />
                <KSelect
                  v-if="templateType !== 'landing'"
                  :value="toneResourceId"
                  class="email-template__ai-assistant-tone-select"
                  style="max-width: 160px;"
                  :items="toneOptions"
                  item-text="name"
                  item-value="resourceId"
                  outlined
                  hide-details
                  required
                  label="Tone"
                  placeholder="Set a tone"
                  :disabled="isEmailGenerating"
                  @input="$emit('update:toneResourceId', $event)"
                ></KSelect>
                <KSelect
                  v-if="templateType !== 'landing'"
                  :value="localizationResourceId"
                  class="email-template__ai-assistant-localization-select"
                  style="max-width: 200px;"
                  :items="localeOptions"
                  item-text="name"
                  item-value="resourceId"
                  outlined
                  hide-details
                  required
                  label="Locale"
                  placeholder="Set a locale"
                  :selectable="(option) => option.isVisible"
                  :disabled="isEmailGenerating"
                  :slots="{ item: true, selection: true }"
                  :value-comparator="handleValueComparator"
                  @input="$emit('update:localizationResourceId', $event)"
                >
                  <template #selection="data">
                    <span v-if="isUSAStateSelected">USA, {{ getSelectedStateName }}</span>
                    <span v-else>{{ data.item.name }}</span>
                  </template>
                  <template #item="data">
                    <VMenu
                      v-if="!!data.item.states"
                      right
                      offset-x
                      nudge-top="50"
                      min-width="240"
                      max-width="240"
                      open-on-hover
                      close-on-content-click
                    >
                      <template #activator="{ on }">
                        <div
                          v-on="on"
                          :class="['mail-configuration-select-sources__item-container']"
                          @click="$emit('update:localizationResourceId', data.item.resourceId)"
                        >
                          <div class="mail-configuration-select-sources__item">
                            <div style="font-size: 14px;" class="mr-2 mr-auto">
                              {{ data.item.name }}
                            </div>
                            <v-icon :color="isUSAStateSelected ? '#1976d2' : '#757575'"
                              >mdi-menu-right</v-icon
                            >
                          </div>
                        </div>
                      </template>
                      <VListItem
                        v-for="state in data.item.states"
                        :key="state.resourceId"
                        :class="getListItemClass(state)"
                        @click="handleStateChange(state)"
                      >
                        <VListItemTitle
                          class="training-library-filtering-options-parent-list-item-title justify-start"
                        >
                          {{ state.name }}
                        </VListItemTitle>
                      </VListItem>
                    </VMenu>
                    <div v-else :class="['mail-configuration-select-sources__item-container']">
                      <div style="font-size: 14px;" class="mail-configuration-select-sources__item">
                        {{ data.item.name }}
                      </div>
                    </div>
                  </template>
                </KSelect>
              </div>
              <VTextarea
                v-model.trim="aiTemplateText"
                class="email-template__ai-assistant-textarea"
                id="email-template__ai-assistant-textarea"
                outlined
                dense
                no-resize
                hide-details
                persistent-hint
                rows="2"
                height="143"
                :disabled="isEmailGenerating"
                :rules="aiTemplateTextRules"
                :placeholder="getAITemplateTextAreaPlaceholder"
              >
                <template #append>
                  <div
                    class="email-template__ai-assistant-footer-text"
                    :style="aiTemplateText.length > 500 ? { color: '#B83A3A', opacity: '1' } : ''"
                  >
                    <VTooltip v-if="aiTemplateText.length > 500" bottom max-width="300">
                      <template #activator="{ on }">
                        <VIcon style="font-size: 20px;" v-on="on" color="#B83A3A" small
                          >mdi-information</VIcon
                        >
                      </template>
                      <span
                        >Description cannot exceed the 500 character limit. Please shorten
                        description.</span
                      >
                    </VTooltip>
                    {{ aiTemplateText.length }} / 500 characters
                  </div>
                  <div class="email-template__ai-assistant-footer-method">
                    <VIcon>mdi-information-outline</VIcon>
                    Selected template method is
                    <span class="fw-600">{{ selectedMethod }}</span>
                  </div>
                </template>
              </VTextarea>
            </div>
            <div class="email-template__ai-assistant-footer">
              <div class="email-template__ai-assistant-footer-left">
                <VCheckbox
                  v-if="templateType !== 'landing'"
                  :value="isPlainText"
                  class="email-template__ai-assistant-footer-left-checkbox"
                  :style="isEmailGenerating ? 'opacity: 0.5;pointer-events:none;' : ''"
                  hide-details
                  :ripple="false"
                  color="#2196f3"
                  label="Enable styled HTML format"
                  @click.stop
                  @change="$emit('update:isPlainText', !!$event)"
                />
              </div>
              <div class="email-template__ai-assistant-footer-right">
                <VBtn
                  class="white--text btn-util btn-download-add-in pl-4"
                  style="text-transform: capitalize;"
                  color="#2196F3"
                  rounded
                  :style="getGenerateEmailButtonStyle"
                  @click="handleGenerateEmail"
                >
                  {{ getGenerateButtonLabel }}
                </VBtn>
              </div>
            </div>
            <div
              :class="[
                'd-flex mt-2 w-full items-center',
                generatedTemplates.length > 1 ? 'justify-space-between' : 'justify-end'
              ]"
            >
              <div v-if="generatedTemplates.length > 1">
                <VIcon
                  class="cursor-pointer"
                  color="#757575"
                  :disabled="activeGeneratedTemplateIndex < 1"
                  @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex - 1)"
                  >mdi-chevron-left</VIcon
                >
                <VIcon
                  class="ml-1 cursor-pointer"
                  color="#757575"
                  :disabled="activeGeneratedTemplateIndex === generatedTemplates.length - 1"
                  @click="setActiveGeneratedTemplate(activeGeneratedTemplateIndex + 1)"
                  >mdi-chevron-right</VIcon
                >
                <span class="email-template__ai-assistant-footer-left-text"
                  >Generated
                  {{ templateType === 'landing' ? 'landing page' : 'email' }}
                  {{ activeGeneratedTemplateIndex + 1 }} of {{ generatedTemplates.length }}</span
                >
              </div>
              <div
                class="email-template__ai-assistant-footer-right-feedback cursor-pointer"
                @click="changeFeedbackPopup(true)"
              >
                Give us feedback!
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 24px;">
      <div v-if="!onlyGrapes && showNameField" :class="getTemplateNameFieldClass">
        <FormGroup
          title="Template Name:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <InputEntityName
            id="input--notification-template-name"
            initialPlaceholder="Enter template name"
            entityName="template name"
            :value="name"
            :disabled="editItemsDisabled"
            @input="$emit('update:name', $event)"
          />
        </FormGroup>
      </div>
      <div
        v-if="!onlyGrapes && showLanguageField"
        :class="['mx-6', isHorizontalFormGroups ? 'pt-2 ' : 'pt-6']"
      >
        <FormGroup
          title="Languages:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <InputLanguagePreview
            :value="languagePreview"
            persistent-hint
            class="campaign-manager-phishing-scenario-input-language"
            :hint="getEmailTemplatePreviewLanguageHint"
            :items="selectedTemplateLanguages"
            hide-details
            @input="handleEmailTemplatePreviewLanguageChange($event, languagePreview)"
          />
        </FormGroup>
      </div>
      <div :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : 'pt-0']" v-if="!onlyGrapes">
        <FormGroup
          title="Subject:"
          :sub-title="getSubjectSubtitle"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <div class="position-relative">
            <InputEntityName
              ref="refInputEntityName"
              id="input--notification-template-subject"
              :className="isShowRedFlags ? 'red-flag-active' : ''"
              initialPlaceholder="Enter email subject"
              entityName="email subject"
              label="Subject"
              persistent-placeholder
              :value="subject"
              :disabled="editItemsDisabled"
              :initialRules="getSubjectRules"
              @input="$emit('update:subject', $event)"
            />
            <RedFlagTooltip
              v-if="isShowRedFlags"
              tooltipContent="The subject line uses urgency (“Action required”) and threats (“prevent suspension”)—classic phishing tactics"
            />
          </div>
        </FormGroup>
      </div>
      <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : '']">
        <FormGroup
          title="From Name:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <div class="position-relative">
            <InputEntityName
              id="input--notification-template-sender-name"
              initialPlaceholder="Enter sender name"
              :className="isShowRedFlags ? 'red-flag-active' : ''"
              entityName="sender name"
              label="From Name"
              persistent-placeholder
              :value="fromName"
              :disabled="editItemsDisabled"
              :initialRules="senderNameRules"
              @input="$emit('update:fromName', $event)"
            />
            <RedFlagTooltip
              v-if="isShowRedFlags"
              tooltipContent="The sender’s display name is misspelled (“M1crosoft Account Team”); the correct name is “Microsoft Account Team.”"
            />
          </div>
        </FormGroup>
      </div>
      <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : '']">
        <FormGroup
          title="From Email Address:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <div class="position-relative">
            <InputEmail
              label="From Email"
              id="input--notification-template-from-email"
              placeholder="Enter sender email address"
              :class="isShowRedFlags ? 'red-flag-active' : ''"
              persistent-placeholder
              :disabled="editItemsDisabled"
              :value="fromAddress"
              @input="$emit('update:fromAddress', $event)"
            >
              <template v-if="false" #append>
                <AppendableMergeTag @on-add-merge-tag="handleAddMergeTag" />
              </template>
            </InputEmail>
            <RedFlagTooltip
              v-if="isShowRedFlags"
              tooltipContent="The sender’s domain is misspelled (“m1crosoft.com”); legitimate Microsoft emails come from “microsoft.com.”"
            />
          </div>
        </FormGroup>
      </div>
      <div
        v-if="!onlyGrapes && (isNotificationEnrollment || isEmailTemplate)"
        :class="['mx-6', isHorizontalFormGroups ? 'pt-2 pb-4' : '']"
      >
        <FormGroup
          title="CC:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <KSelect
            :value="ccAddresses"
            id="input--threat-sharing-incident-share-email"
            type="combobox"
            :items="[]"
            :class="getEmailTemplateCCSelectClasses"
            placeholder="Enter an email address"
            multiple
            dense
            deletable-chips
            autocomplete="disabled"
            small-chips
            outlined
            persistent-hint
            persistent-placeholder
            label="CC"
            hint="Press enter to separate email addresses"
            :rules="[ccEmailRules.email]"
            @input="$emit('update:ccAddresses', $event)"
          >
          </KSelect>
        </FormGroup>
      </div>
    </div>
    <div :class="[isHorizontalFormGroups ? 'k-form-group k-form-group--horizontal' : '']">
      <div
        v-if="isAttachmentBasedScenario && !onlyGrapes"
        :class="['d-flex mx-6 align-center', isHorizontalFormGroups ? 'v-list-item__content' : '']"
      >
        <label
          :class="[
            'mr-4',
            isHorizontalFormGroups ? 'k-form-group__title--horizontal mb-4' : 'mb-6'
          ]"
          for="input--email-template-upload"
          style="font-weight: 600; font-size: 20px;"
          >Attach File:</label
        >
        <k-file-upload
          v-if="!attachments.length"
          id="input--email-template-upload"
          is-stand-alone
          class="mb-2"
          ref="refFileUpload"
          :hint="fileUploadHint"
          :extensions="attachmentExtensions"
          :is-show-file-progress="false"
          :value="attachmentFiles"
          :is-preview-visible="false"
          :size="size"
          :hasError="!!isAttachmentError"
          :errorText="isAttachmentError || ''"
          @inputFile="onFileChanged"
        />
        <div
          v-else
          :class="['email-template__attachment-list', isHorizontalFormGroups ? 'ml-0' : '']"
          :style="
            isHorizontalFormGroups
              ? {}
              : { display: 'flex', 'align-self': 'start', 'flex-wrap': 'wrap' }
          "
        >
          <div v-for="(item, index) in attachments" :key="index">
            <div class="attachment-wrapper" style="position: relative;">
              <div
                :class="['attachment blue-attach mr-2', isHorizontalFormGroups ? 'full-width' : '']"
                :id="'email-template-' + item.name"
              >
                <AttachmentsPreview
                  :deletable="item.isDeletable"
                  :att="item"
                  :index="index"
                  :isEmailTemplate="true"
                  :isAttachmentNameFullWidth="isHorizontalFormGroups"
                  @on-delete="handleFileDelete"
                />
              </div>
              <div v-if="!item.isDeletable" class="attachment-delete-wrapper">
                <v-menu bottom left offset-y transition="scale-transition">
                  <template #activator="{ on }">
                    <v-btn v-on="on" class="btn-hover" icon outlined>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="v-cart-dropdown-list el-table__action-buttons">
                    <v-list-item class="sub-menu-el datatable-row-action-list">
                      <v-list-item-title @click="handleRenameItem">
                        <span>Rename</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item class="sub-menu-el datatable-row-action-list">
                      <v-list-item-title @click="handleDeleteItem">
                        <span>Delete</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-divider v-if="!onlyGrapes" class="email-template__divider mb-6" />
    <div v-if="isEmailGenerating">
      <EmailTemplatesAILoader :title="getLoaderTitle" :description="getLoaderDescription" />
    </div>
    <div v-else id="email-template-content" class="email-template-content">
      <div>
        <v-btn
          v-if="!isPhishingTemplate || showEditButton"
          id="btn-edit--notification-template-email-template"
          style="text-transform: none;"
          :disabled="editItemsDisabled"
          rounded
          color="#2196f3"
          class="email-template-preview__button"
          @click="editHtmlTemplate"
        >
          <v-icon style="margin-right: 2px; margin-top: -1px;" class="text-h6">mdi-pencil</v-icon>
          EDIT
        </v-btn>
        <div v-else>
          <div class="email-template-preview__template-header">
            <div class="email-template-preview__template-header-left">
              <slot name="template-header-left" />
            </div>
            <div>
              <slot name="template-header-right" />
            </div>
          </div>
        </div>
        <div class="email-template-preview" style="pointer-events: none;">
          <k-email-preview
            v-if="template"
            :key="template"
            ref="refPreview"
            :html="previewTemplate"
          />
          <template v-else>
            <landing-page-template-default
              v-if="templateType === 'landing'"
              ref="refPreview"
              :email-template-logo="emailTemplateLogo"
            />
            <individual-print-out-template-default
              v-else-if="templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT"
              ref="refPreview"
              :email-template-logo="emailTemplateLogo"
            />
            <quishing-email-template-default
              v-else-if="templateType === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL"
              ref="refPreview"
              :email-template-logo="emailTemplateLogo"
            />
            <email-template-default
              v-else
              ref="refPreview"
              :email-template-logo="emailTemplateLogo"
            />
          </template>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import AppModal from '@/components/AppModal'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { createRandomCryptStringNumber, isDifferent } from '@/utils/functions'
import { scrollToEmailTemplateContent } from '@/components/Company Settings/utils'
import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal'
import { mapActions, mapGetters } from 'vuex'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import KEmailPreview from '@/components/KEmailPreview'
import EmailTemplateDefault from '@/components/EmailTemplates/EmailTemplateDefault'
import LandingPageTemplateDefault from '@/components/EmailTemplates/LandingPageTemplateDefault'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import IndividualPrintOutTemplateDefault from '@/components/EmailTemplates/IndividualPrintOutTemplateDefault.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import FormGroup from '@/components/SmallComponents/FormGroup'
import QuishingEmailTemplateDefault from '@/components/EmailTemplates/QuishingEmailTemplateDefault.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'
import {
  generateAIEmailTemplate,
  generateAILandingPageTemplate,
  getGeneratedAIEmailTemplate,
  getGeneratedAILandingPageTemplate,
  getAIGenerationOptions
} from '@/api/phishingsimulator'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage.vue'
import FeedbackPopup from '@/components/FeedbackPopup.vue'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import AppendableMergeTag from '@/components/Common/Others/AppendableMergeTag.vue'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
export default {
  name: 'EmailTemplate',
  components: {
    FeedbackPopup,
    InputSelectLanguage,
    EmailTemplatesAILoader,
    KSelect,
    QuishingEmailTemplateDefault,
    IndividualPrintOutTemplateDefault,
    EmailTemplateDefault,
    LandingPageTemplateDefault,
    KEmailPreview,
    GrapesNewsletterModal,
    AppModal,
    InputEmail,
    KFileUpload,
    AttachmentsPreview,
    InputEntityName,
    FormGroup,
    InputLanguagePreview,
    AppendableMergeTag,
    RedFlagTooltip
  },
  props: [
    'name',
    'fromAddress',
    'fromName',
    'subject',
    'ccAddresses',
    'template',
    'attachmentFiles',
    'activeBlockManagerComponents',
    'isEdit',
    'editItemsDisabled',
    'isPhishingTemplate',
    'setAttachmentFile',
    'importedEmailAttachments',
    'onlyGrapes',
    'templateType',
    'extensions',
    'fileUploadHint',
    'size',
    'isAttachmentBasedScenario',
    'isAttachmentError',
    'isNotificationTemplate',
    'isEnrollmentCategorySelected',
    'isLearningPathEnrollmentSelected',
    'isNotificationEnrollment',
    'isEmailTemplate',
    'isHorizontalFormGroups',
    'showNameField',
    'isAiAssistant',
    'isAIAllyEnabled',
    'aiAssistant',
    'aiAssistantRemainingRight',
    'aiAssistantTotalRight',
    'languageTypeResourceId',
    'selectedTone',
    'selectedLocale',
    'isAssistedByAITemplate',
    'methodTypeId',
    'prompt',
    'toneResourceId',
    'localizationResourceId',
    'languageOptions',
    'selectedMethod',
    'isGenerateWithAi',
    'getEmailTemplatePreviewLanguageHint',
    'selectedTemplateLanguages',
    'languagePreview',
    'showLanguageField',
    'isShowRedFlags',
    'isPlainText',
    'customHeadScripts',
    'currentPageIndex',
    'isShowHeadScripts',
    'showEditButton'
  ],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      isEmailGenerating: false,
      badgeContents: [
        {
          title: 'Finance Department Alert',
          content:
            'Create a template that appears to be from our Finance Department, asking the user to verify a payment that is scheduled for today. Include a link that directs them to a secure page to review the details. The tone should be urgent and professional, with an emphasis on preventing unauthorized transactions.'
        },
        {
          title: 'HR Benefits Update',
          content:
            'Make a template that looks like it is coming from our HR department, informing the user about changes to their benefits package. They are asked to log in to the benefits portal via a provided link to review and accept the new terms. The tone should be informative yet urgent, stressing the need to complete this before the end of the week.'
        },
        {
          title: 'Suspicious Login Alert',
          content:
            'Make a template that looks like it is coming from the organization’s security team, warning the user about a suspicious login attempt on their account. The email should urge them to click a link to verify their identity and secure their account. The tone should be urgent, with a focus on protecting the user’s account from unauthorized access.'
        },
        {
          title: 'Payroll Adjustment Notification',
          content:
            'Make a template that seems to be from the Payroll Department, informing the user of a recent adjustment to their paycheck due to an error. Include a link where they can view the updated payment details. The tone should be apologetic for the error but emphasize the need for the user to verify the correction.'
        },
        {
          title: 'Account Deactivation Notice',
          content:
            'Make a template that looks like it’s from the user’s account management system, warning them that their account will be deactivated if they do not confirm their details by clicking a provided link. The tone should be formal and emphasize the importance of maintaining active status.'
        }
      ],
      landingPageBadgeContents: [
        {
          title: 'Company Event Registration',
          content:
            'Create a landing page for a company event registration. Include fields for full name, email, phone number, and a dropdown to select the department. Add a "Register" button at the bottom. The page should also include a banner at the top with the company logo and event name. The color scheme should match typical corporate branding with a professional look.'
        },
        {
          title: 'Password Reset Page',
          content:
            'Create a landing page for a system password reset. Include a field for entering the email address, a "Submit" button, and a link for "Contact Support" in case the user has trouble resetting their password. The design should be simple with a white background, and include a small company logo at the top. The instructions should be clear and concise.'
        },
        {
          title: 'Bank Account Login Page',
          content:
            'Create a landing page that mimics a bank account login page. Include fields for "Username" and "Password", a "Forgot Username or Password?" link, and a "Sign In" button. Add a small bank logo at the top, and include links for "Enroll Now" and "Help". The design should be secure and professional, with a dark blue and white color scheme.'
        },
        {
          title: 'Subscription Confirmation Page',
          content:
            'Create a landing page for subscription confirmation. Include a message saying "Thank you for subscribing!", a field for entering an email address to confirm the subscription, and a "Confirm Subscription" button. Add a small note about privacy at the bottom. The design should be clean and modern, with a focus on ease of use.'
        },
        {
          title: 'Phishing Awareness Oops Page',
          content:
            "Create a landing page that tells the user they've clicked on a simulated phishing email. The message should say \"Oops! The email you just clicked was a phishing simulation. Don't worry, this is to help you learn.\" Include three key rules: 1. Avoid unknown links/attachments. 2. Verify the sender's email. 3. Be cautious of too-good-to-be-true offers. The design should be clear and educational."
        }
      ],
      selectLanguageRules: {
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      aiTemplateTextRules: [(v) => v.length <= 500],
      timeoutId: null,
      previewTemplate: null,
      aiTemplateText: '',
      initialTemplate: null,
      labels,
      showGrapesModal: false,
      grapeJsKey: `${createRandomCryptStringNumber()}-key`,
      Validations,
      attachmentListKey: `${createRandomCryptStringNumber()}-key`,
      aiTemplateMaxLength: (v) =>
        Validations.maxLength(
          v,
          500,
          'Description cannot exceed the 500 character limit. Please shorten description',
          500
        ),
      ccEmailRules: {
        email: Validations.isEmailChip
      },
      mergeTags: [
        {
          text: 'Enrollment Name',
          value: '{ENROLLMENT_NAME}'
        }
      ],
      learningPathEnrollmentReminderMergeTags: [
        {
          text: 'Enrollment Name',
          value: '{ENROLLMENT_NAME}'
        },
        {
          text: 'Learning Path Step',
          value: '{LEARNING_PATH_STEP}'
        }
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.mergeTags.map((tag) => tag.value)
          for (const match of matches) {
            if (!tags.includes(match.toUpperCase())) {
              return `${match} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.mergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      learningPathMergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.learningPathEnrollmentReminderMergeTags.map((tag) => tag.value)
          for (const match of matches) {
            if (!tags.includes(match.toUpperCase())) {
              return `${match} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.learningPathEnrollmentReminderMergeTags
              .map((mergeTag) => mergeTag.value)
              .join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.learningPathEnrollmentReminderMergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      subjectRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 512, labels.getMaxLengthMessage(labels.Subject, 512))
      ],
      senderNameRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FromName), 40)
      ],
      generatedTemplates: [],
      activeGeneratedTemplateIndex: -1,
      toneOptions: [],
      localeOptions: [],
      usaStateResourceIds: [],
      usaResourceId: ''
    }
  },
  computed: {
    ...mapGetters({
      emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl',
      isFeedbackPopupOpened: 'dashboard/isPopupOpened'
    }),
    getEmailTemplateCCSelectClasses() {
      return {
        'email-template__cc-select': true,
        'email-template__cc-select-selected': this.ccAddresses && this.ccAddresses.length > 0
      }
    },
    getTemplateNameFieldClass() {
      return ['mx-6', 'pt-4']
    },
    getSelectedStateName() {
      return (
        this.localeOptions?.find?.((item) => item.resourceId === this.localizationResourceId)
          ?.name || ''
      )
    },
    isUSAStateSelected() {
      return this.usaStateResourceIds.includes(this.localizationResourceId)
    },
    getGenerateButtonLabel() {
      const isLanding = this.templateType === 'landing'
      if (isLanding) {
        return this.isEmailGenerating ? 'Generating Landing Page...' : 'Generate Landing Page'
      }
      return this.isEmailGenerating ? 'Generating Email Template...' : 'Generate Email Template'
    },
    getGenerateEmailButtonStyle() {
      return this.aiTemplateText.length > 0 &&
        this.aiTemplateText.length <= 500 &&
        !this.isEmailGenerating &&
        this.languageTypeResourceId
        ? { opacity: 1, pointerEvents: '' }
        : { opacity: 0.5, pointerEvents: 'none' }
    },
    getAITemplateTextAreaPlaceholder() {
      return this.templateType === 'landing'
        ? 'Describe the scenario and key details for the phishing simulation landing page you want to generate.'
        : 'Describe the scenario and key details for the phishing simulation email you want to generate.'
    },
    getLoaderTitle() {
      if (this.isGenerateWithAi)
        return 'The email template is being localized by AI for the selected languages.'
      return this.templateType === 'landing'
        ? 'AI Ally is carefully crafting your Landing Page template'
        : 'AI Ally is carefully crafting your Email template'
    },
    getLoaderDescription() {
      if (this.isGenerateWithAi)
        return 'This process may take some time depending on the number of localizations. Please stay on the page.'
      return 'This process may take approximately 20 seconds. Please stay on the page during this time.'
    },
    attachmentExtensions() {
      return this.extensions ? this.extensions : ['gif', 'jpg', 'jpeg', 'png', 'bmp']
    },
    attachments() {
      if (
        !!this.attachmentFiles &&
        this.attachmentFiles?.length &&
        !!this.importedEmailAttachments &&
        this.importedEmailAttachments?.length
      ) {
        return [...this.attachmentFiles, ...this.importedEmailAttachments]
      }
      if (!!this.attachmentFiles && this.attachmentFiles?.length) {
        return [...this.attachmentFiles]
      }
      return []
    },
    isMergeTagSubject() {
      return (
        this.isNotificationTemplate &&
        (this.isEnrollmentCategorySelected || this.isLearningPathEnrollmentSelected)
      )
    },
    getSubjectSubtitle() {
      if (!this.isMergeTagSubject) return undefined
      if (this.isMergeTagSubject && this.isLearningPathEnrollmentSelected) {
        return `Define a subject for the notification email using the {ENROLLMENT_NAME} and {LEARNING_PATH_STEP} merge tags as variables.`
      }
      return `Define a subject for the notification email. Use {ENROLLMENT_NAME} merge tag as a variable for the notification email subject`
    },
    getSubjectRules() {
      if (this.isMergeTagSubject) {
        if (this.isLearningPathEnrollmentSelected) {
          return [...this.subjectRules, ...this.learningPathMergeTagRules]
        }
        return [...this.subjectRules, ...this.mergeTagRules]
      }
      return this.subjectRules
    },
    feedbackDialog: {
      get() {
        return this.isFeedbackPopupOpened
      },
      set(newValue) {
        this.changeFeedbackPopup(newValue)
      }
    }
  },
  watch: {
    activeBlockManagerComponents() {
      this.grapeJsKey = `${createRandomCryptStringNumber()}-key`
    },
    isLearningPathEnrollmentSelected(val) {
      this.$nextTick(() => {
        if (this.$refs?.refInputEntityName?.$refs?.refInput)
          this.$refs.refInputEntityName.$refs.refInput.validate()
      })
    },
    template: {
      handler(val) {
        this.previewTemplate =
          val?.replace(
            /{COMPANYLOGO}/g,
            this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
          ) || ''
      },
      immediate: true
    },
    prompt(val) {
      if (val !== this.aiTemplateText) this.aiTemplateText = val || ''
    },
    aiTemplateText(val) {
      this.$emit('update:prompt', val || '')
    }
  },

  mounted() {
    this.getAIGenerationOptions()
    this.defaultTemplate = this.template || this.$refs.refPreview.$el.outerHTML
    this.setDefaultTemplate()
  },
  beforeDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  },
  methods: {
    ...mapActions({ changeFeedbackPopup: 'dashboard/changeFeedbackPopup' }),
    onCustomHeadScriptsChange(value, pageIndex) {
      this.$emit('on-custom-head-scripts-change', value, pageIndex)
    },
    getListItemClass(state) {
      return {
        'training-library-filtering-options-parent-list-item': true,
        'v-list-item--active': this.localizationResourceId === state.resourceId
      }
    },
    handleValueComparator(a, b) {
      if (a === b) return true
      return a === this.usaResourceId && this.usaStateResourceIds.includes(b)
    },
    getAIGenerationOptions() {
      getAIGenerationOptions().then((res) => {
        this.toneOptions = res?.data?.data?.tones || []
        const localeOptions =
          res?.data?.data?.localizations?.map?.((locale) => ({
            ...locale,
            isVisible: true
          })) || []
        const usaIndex = localeOptions.findIndex((item) => item.name === 'United States')
        if (usaIndex !== -1) {
          localeOptions.push(
            ...localeOptions[usaIndex].states.map((state) => ({
              ...state,
              isVisible: false,
              disabled: true
            }))
          )
          this.usaStateResourceIds = localeOptions[usaIndex].states.map((state) => state.resourceId)
          this.usaResourceId = localeOptions[usaIndex].resourceId
        }
        this.localeOptions = localeOptions
      })
    },
    handleStateChange(state) {
      this.$emit('update:localizationResourceId', state.resourceId)
    },
    handleGenerateEmail() {
      this.isEmailGenerating = true
      scrollToEmailTemplateContent()
      const payload = {
        name: this.name,
        languageTypeResourceId: this.languageTypeResourceId,
        subject: this.subject,
        fromName: this.fromName,
        fromAddress: this.fromAddress,
        prompt: this.aiTemplateText,
        phishingTypeId: 1,
        methodTypeId: parseInt(this.methodTypeId),
        isPlainText: !this.isPlainText,
        toneResourceId: this.toneResourceId,
        localizationResourceId: this.localizationResourceId
      }
      this.$emit('update:isAssistedByAITemplate', true)
      if (this.templateType === 'landing') {
        delete payload.toneResourceId
        delete payload.localizationResourceId
        generateAILandingPageTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAILandingPageTemplate()
            this.$emit('update:aiAssistantRemainingRight', this.aiAssistantRemainingRight - 1)
          }
        })
      } else {
        generateAIEmailTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAIEmailTemplate()
            this.$emit('update:aiAssistantRemainingRight', this.aiAssistantRemainingRight - 1)
          }
        })
      }
    },
    callForGetGeneratedAIEmailTemplate() {
      getGeneratedAIEmailTemplate()
        .then((response) => {
          const { template, subject } = response?.data?.data || {}
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: template,
            subject,
            isPlainText: this.isPlainText,
            languageTypeResourceId: this.languageTypeResourceId
          })
          this.$emit('update:subject', subject)
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1
          this.$emit('update:template', template)
          this.isEmailGenerating = false
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAIEmailTemplate(), 5000)
        })
    },
    callForGetGeneratedAILandingPageTemplate() {
      getGeneratedAILandingPageTemplate()
        .then((response) => {
          const template = response?.data?.data || {}
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: template,
            languageTypeResourceId: this.languageTypeResourceId
          })
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1
          this.$emit('update:template', template)
          this.isEmailGenerating = false
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAILandingPageTemplate(), 5000)
        })
    },
    setActiveGeneratedTemplate(index) {
      this.activeGeneratedTemplateIndex = index
      this.aiTemplateText = this.generatedTemplates[index].text
      this.$emit('update:isPlainText', this.generatedTemplates[index].isPlainText)
      this.$emit(
        'update:languageTypeResourceId',
        this.generatedTemplates[index].languageTypeResourceId
      )
      this.$emit('update:template', this.generatedTemplates[index].content)
      this.$emit('update:subject', this.generatedTemplates[index].subject)
    },
    handleAiAssistantBadgeClick(index) {
      this.aiTemplateText =
        this.templateType === 'landing'
          ? this.landingPageBadgeContents[index].content
          : this.badgeContents[index].content
    },
    handleRenameItem() {
      this.$emit('handleRenameAttachment')
    },
    handleDeleteItem() {
      this.$emit('handleDeleteAttachment')
    },
    setInitialTemplateData() {
      setTimeout(() => {
        this.initialTemplate = this.$refs?.grapesJsPostIncident?.getGrapesEditorContent?.() || ''
      }, 1000)
    },
    handleFileDelete(index) {
      this.$emit('handleAttachmentRemove', {
        item: this.attachments[index],
        index
      })
    },
    onFileChanged(file) {
      this.$emit('setAttachmentFile', file)
    },
    changeTabStatus(index) {
      this.tab = index
    },
    editHtmlTemplate() {
      this.toggleShowGrapesModal()
    },
    setDefaultTemplate() {
      this.$emit('update:template', this.defaultTemplate)
      this.$emit('handleInitialTemplate', this.defaultTemplate)
    },
    toggleShowGrapesModal(isSubmitted = false) {
      if (!this.showGrapesModal) {
        this.changeGrapesModalStatus()
        this.setInitialTemplateData()
        return
      }
      if (!this.$refs.grapesJsPostIncident) {
        return this.changeGrapesModalStatus()
      }
      const currentTemplate = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      const isChanged = isDifferent(currentTemplate, this.initialTemplate)
      if (!isChanged || isSubmitted) {
        this.destroyPostIncidentEditor()
      } else {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.destroyPostIncidentEditor()
          }
        })
      }
    },
    destroyPostIncidentEditor() {
      this?.$refs?.grapesJsPostIncident?.destroyEditor()
      this.changeGrapesModalStatus()
    },
    changeGrapesModalStatus() {
      this.showGrapesModal = !this.showGrapesModal
      this.$emit('template-edit', this.showGrapesModal)
    },
    saveGrapeJs() {
      const template = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      if (
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT ||
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL
      ) {
        if (!template.includes(qrCodeString)) {
          return this.$emit('showErrorDialog')
        }
      }
      this.$emit('update:template', template)
      //this code has to be added otherwise grapesjs throws error
      setTimeout(() => {
        this.toggleShowGrapesModal(true)
      }, 100)
    },
    handleEmailTemplatePreviewLanguageChange(value, languagePreview) {
      this.$nextTick(() => {
        this.$emit('update:languagePreview', value)
        this.$emit('on-email-template-preview-language-change', value, languagePreview)
      })
    },
    handleAddMergeTag(tag) {
      this.fromAddress = this.fromAddress + tag
    }
  }
}
</script>
