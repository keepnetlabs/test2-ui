<template>
  <v-card class="email-template__container" :style="'overflow-y:hidden'">
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
          :htmlData="template"
          :key="grapeJsKey"
          :blockManagerComponents="activeBlockManagerComponents"
          :template-type="templateType"
          :isAttachmentBasedTemplate="isPhishingTemplate"
        />
      </template>
    </app-modal>
    <div
      v-if="isAiAssistant"
      :class="[
        'email-template__ai-assistant',
        templateType === 'landing' ? 'email-template__ai-assistant--landing' : '',
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
                templateType === "landing"
                  ? "Let your intelligent AI assistant craft perfect landing page templates for you—effortlessly and on demand!"
                  : "Let your intelligent AI assistant craft perfect email templates for you—effortlessly and on demand!"
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
              USE AI ALLY
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
                  :disabled="isEmailGenerating"
                  @input="$emit('update:languageTypeResourceId', $event)"
                />
                <KSelect
                  :value="selectedTone"
                  class="add-in-settings__default-language-select"
                  style="max-width: 160px;"
                  :items="toneOptions"
                  outlined
                  hide-details
                  required
                  label="Tone"
                  placeholder="Set a tone"
                  :disabled="isEmailGenerating"
                  @input="$emit('update:selectedTone', $event)"
                ></KSelect>
                <KSelect
                  :value="selectedLocale"
                  class="add-in-settings__default-language-select"
                  style="max-width: 200px;"
                  :items="localeOptions"
                  item-test="text"
                  item-value="value"
                  outlined
                  hide-details
                  required
                  label="Locale"
                  placeholder="Set a locale"
                  :selectable="(option) => option.isVisible"
                  :disabled="isEmailGenerating"
                  :slots="{ item: true }"
                  @input="$emit('update:selectedLocale', $event)"
                >
                  <template #item="data">
                    <VMenu
                      v-if="!!data.item.children"
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
                        >
                          <div class="mail-configuration-select-sources__item">
                            <div style="font-size: 14px;" class="mr-2 mr-auto">
                              {{ data.item.text }}
                            </div>
                            <v-icon>mdi-menu-right</v-icon>
                          </div>
                        </div>
                      </template>
                      <VListItem
                        v-for="state in data.item.children"
                        :key="state.text"
                        :class="{
                          'training-library-filtering-options-parent-list-item': true,
                          'v-list-item--active': selectedLocale === state.value,
                        }"
                        @click="handleStateChange(state)"
                      >
                        <VListItemTitle
                          class="training-library-filtering-options-parent-list-item-title justify-start"
                        >
                          {{ state.text }}
                        </VListItemTitle>
                      </VListItem>
                    </VMenu>
                    <div v-else :class="['mail-configuration-select-sources__item-container']">
                      <div style="font-size: 14px;" class="mail-configuration-select-sources__item">
                        {{ data.item.text }}
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
                    Selected template method is <span class="fw-600">{{ selectedMethod }}</span>
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
                generatedTemplates.length > 1 ? 'justify-space-between' : 'justify-end',
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
                  >Generated {{ templateType === "landing" ? "landing page" : "email" }}
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
    <div
      :class="['mx-4', isHorizontalFormGroups ? 'pt-4' : 'pt-4']"
      v-if="!onlyGrapes && showNameField"
    >
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
    <div :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : 'pt-6']" v-if="!onlyGrapes">
      <FormGroup
        title="Subject:"
        :sub-title="getSubjectSubtitle"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
        <InputEntityName
          id="input--notification-template-subject"
          initialPlaceholder="Enter email subject"
          entityName="email subject"
          :value="subject"
          :disabled="editItemsDisabled"
          :initialRules="getSubjectRules"
          @input="$emit('update:subject', $event)"
        />
      </FormGroup>
    </div>
    <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : '']">
      <FormGroup
        title="From Name:"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
        <InputEntityName
          id="input--notification-template-sender-name"
          initialPlaceholder="Enter sender name"
          entityName="sender name"
          :value="fromName"
          :disabled="editItemsDisabled"
          :initialRules="senderNameRules"
          @input="$emit('update:fromName', $event)"
        />
      </FormGroup>
    </div>
    <div v-if="!onlyGrapes" :class="['mx-6', isHorizontalFormGroups ? 'pt-2 pb-4' : '']">
      <FormGroup
        title="From Email Address:"
        style="max-width: unset;"
        :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
        :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
      >
        <InputEmail
          id="input--notification-template-from-email"
          :disabled="editItemsDisabled"
          :value="fromAddress"
          @input="$emit('update:fromAddress', $event)"
        />
      </FormGroup>
    </div>
    <div
      v-if="!onlyGrapes && isNotificationEnrollment"
      :class="['mx-4', isHorizontalFormGroups ? 'pt-2' : '']"
    >
      <FormGroup title="CC" style="max-width: unset;">
        <KSelect
          :value="ccAddresses"
          id="input--threat-sharing-incident-share-email"
          type="combobox"
          :items="[]"
          placeholder="Enter an email address"
          multiple
          dense
          deletable-chips
          autocomplete="disabled"
          small-chips
          outlined
          class="pop-up-card__invite-member"
          hint="Press enter to separate email addresses"
          :rules="[ccEmailRules.email]"
          @input="$emit('update:ccAddresses', $event)"
        ></KSelect>
      </FormGroup>
    </div>
    <div :class="[isHorizontalFormGroups ? 'k-form-group k-form-group--horizontal' : '']">
      <div
        :class="['d-flex mx-4 align-center', isHorizontalFormGroups ? 'v-list-item__content' : '']"
        v-if="isPhishingTemplate && !onlyGrapes"
      >
        <label
          :class="[
            'mr-4',
            isHorizontalFormGroups ? 'k-form-group__title--horizontal mb-4' : 'mb-6',
          ]"
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
      <EmailTemplatesAILoader :title="getLoaderTitle" />
    </div>
    <div v-else id="email-template-content">
      <v-btn
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
      <div class="email-template-preview" style="pointer-events: none;">
        <k-email-preview v-if="template" :key="template" ref="refPreview" :html="previewTemplate" />
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
  </v-card>
</template>

<script>
import AppModal from "@/components/AppModal";
import InputEmail from "@/components/Common/Inputs/InputEmail";
import labels from "@/model/constants/labels";
import * as Validations from "@/utils/validations";
import { createRandomCryptStringNumber, isDifferent } from "@/utils/functions";
import GrapesNewsletterModal from "@/components/GrapesJs/Newsletter/GrapesNewsletterModal";
import { mapActions, mapGetters } from "vuex";
import KFileUpload from "@/components/Common/FileUpload/FileUpload";
import AttachmentsPreview from "@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview";
import KEmailPreview from "@/components/KEmailPreview";
import EmailTemplateDefault from "@/components/EmailTemplates/EmailTemplateDefault";
import LandingPageTemplateDefault from "@/components/EmailTemplates/LandingPageTemplateDefault";
import InputEntityName from "@/components/Common/Inputs/InputEntityName";
import IndividualPrintOutTemplateDefault from "@/components/EmailTemplates/IndividualPrintOutTemplateDefault.vue";
import { QUISHING_EMAIL_TEMPLATE_TYPES } from "@/components/QuishingEmailTemplates/utils";
import { qrCodeString } from "@/components/GrapesJs/Newsletter/mergedTexts/qrCode";
import FormGroup from "@/components/SmallComponents/FormGroup";
import QuishingEmailTemplateDefault from "@/components/EmailTemplates/QuishingEmailTemplateDefault.vue";
import KSelect from "@/components/Common/Inputs/KSelect.vue";
import EmailTemplatesAILoader from "@/components/EmailTemplates/EmailTemplatesAILoader.vue";
import {
  generateAIEmailTemplate,
  generateAILandingPageTemplate,
  getGeneratedAIEmailTemplate,
  getGeneratedAILandingPageTemplate,
} from "@/api/phishingsimulator";
import InputSelectLanguage from "@/components/Common/Inputs/InputSelectLanguage.vue";
import FeedbackPopup from "@/components/FeedbackPopup.vue";

export default {
  name: "EmailTemplate",
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
  },
  props: [
    "name",
    "fromAddress",
    "fromName",
    "subject",
    "ccAddresses",
    "template",
    "attachmentFiles",
    "activeBlockManagerComponents",
    "isEdit",
    "editItemsDisabled",
    "isPhishingTemplate",
    "setAttachmentFile",
    "importedEmailAttachments",
    "onlyGrapes",
    "templateType",
    "extensions",
    "fileUploadHint",
    "size",
    "isAttachmentError",
    "isNotificationTemplate",
    "isEnrollmentCategorySelected",
    "isNotificationEnrollment",
    "isHorizontalFormGroups",
    "showNameField",
    "isAiAssistant",
    "aiAssistant",
    "aiAssistantRemainingRight",
    "aiAssistantTotalRight",
    "languageTypeResourceId",
    "selectedTone",
    "selectedLocale",
    "isAssistedByAITemplate",
    "methodTypeId",
    "prompt",
    "languageOptions",
    "selectedMethod",
    "isPlainText",
  ],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      isEmailGenerating: false,
      badgeContents: [
        {
          title: "Finance Department Alert",
          content:
            "Create a template that appears to be from our Finance Department, asking the user to verify a payment that is scheduled for today. Include a link that directs them to a secure page to review the details. The tone should be urgent and professional, with an emphasis on preventing unauthorized transactions.",
        },
        {
          title: "HR Benefits Update",
          content:
            "Make a template that looks like it is coming from our HR department, informing the user about changes to their benefits package. They are asked to log in to the benefits portal via a provided link to review and accept the new terms. The tone should be informative yet urgent, stressing the need to complete this before the end of the week.",
        },
        {
          title: "Suspicious Login Alert",
          content:
            "Make a template that looks like it is coming from the organization’s security team, warning the user about a suspicious login attempt on their account. The email should urge them to click a link to verify their identity and secure their account. The tone should be urgent, with a focus on protecting the user’s account from unauthorized access.",
        },
        {
          title: "Payroll Adjustment Notification",
          content:
            "Make a template that seems to be from the Payroll Department, informing the user of a recent adjustment to their paycheck due to an error. Include a link where they can view the updated payment details. The tone should be apologetic for the error but emphasize the need for the user to verify the correction.",
        },
        {
          title: "Account Deactivation Notice",
          content:
            "Make a template that looks like it’s from the user’s account management system, warning them that their account will be deactivated if they do not confirm their details by clicking a provided link. The tone should be formal and emphasize the importance of maintaining active status.",
        },
      ],
      landingPageBadgeContents: [
        {
          title: "Company Event Registration",
          content:
            'Create a landing page for a company event registration. Include fields for full name, email, phone number, and a dropdown to select the department. Add a "Register" button at the bottom. The page should also include a banner at the top with the company logo and event name. The color scheme should match typical corporate branding with a professional look.',
        },
        {
          title: "Password Reset Page",
          content:
            'Create a landing page for a system password reset. Include a field for entering the email address, a "Submit" button, and a link for "Contact Support" in case the user has trouble resetting their password. The design should be simple with a white background, and include a small company logo at the top. The instructions should be clear and concise.',
        },
        {
          title: "Bank Account Login Page",
          content:
            'Create a landing page that mimics a bank account login page. Include fields for "Username" and "Password", a "Forgot Username or Password?" link, and a "Sign In" button. Add a small bank logo at the top, and include links for "Enroll Now" and "Help". The design should be secure and professional, with a dark blue and white color scheme.',
        },
        {
          title: "Subscription Confirmation Page",
          content:
            'Create a landing page for subscription confirmation. Include a message saying "Thank you for subscribing!", a field for entering an email address to confirm the subscription, and a "Confirm Subscription" button. Add a small note about privacy at the bottom. The design should be clean and modern, with a focus on ease of use.',
        },
        {
          title: "Phishing Awareness Oops Page",
          content:
            "Create a landing page that tells the user they've clicked on a simulated phishing email. The message should say \"Oops! The email you just clicked was a phishing simulation. Don't worry, this is to help you learn.\" Include three key rules: 1. Avoid unknown links/attachments. 2. Verify the sender's email. 3. Be cautious of too-good-to-be-true offers. The design should be clear and educational.",
        },
      ],
      selectLanguageRules: {
        rules: [(v) => Validations.required(v, labels.Required)],
      },
      aiTemplateTextRules: [(v) => v.length <= 500],
      timeoutId: null,
      previewTemplate: null,
      aiTemplateText: "",
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
          "Description cannot exceed the 500 character limit. Please shorten description",
          500
        ),
      ccEmailRules: {
        email: (v) => {
          if (v.length > 0) {
            let booReturn = true;
            for (let i = 0; i < v.length; i++) {
              const chip = document.getElementsByClassName("v-chip--select")[i];
              if (!chip) continue;
              if (!Validations.email(v[i], "")) {
                booReturn = false;
                chip.style.borderColor = "#ff5252";
                chip.style.color = "#ff5252";
                if (v.length === 1) {
                  return v[i] + " email address is not valid";
                }
              } else {
                chip.style.borderColor = "";
                chip.style.color = "rgba(0, 0, 0, 0.87)";
              }
            }
            return booReturn ? booReturn : "One of the email addresses is not valid";
          } else {
            return true;
          }
        },
      },
      mergeTags: [
        {
          text: "Enrollment Name",
          value: "{ENROLLMENT_NAME}",
        },
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true;
          const matches = v.match(/{(.*?)}/gi);
          if (!matches?.length) return true;
          const tags = this.mergeTags.map((tag) => tag.value);
          for (let i = 0; i < matches.length; i++) {
            if (!tags.includes(matches[i].toUpperCase())) {
              return `${matches[i]} is an incorrect merge tag. Please enter an existing merge tag.`;
            }
          }
          return true;
        },
        (v) => {
          if (!v) return true;
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join("|")})`,
            "gi"
          );
          const matches = v.match(regexp);
          if (!matches?.length) return true;
          const mergeTags = this.mergeTags.map((tag) => tag.value);
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          );
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            "Only use uppercase letters for the merge tag"
          );
        },
      ],
      subjectRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 512, labels.getMaxLengthMessage(labels.Subject, 512)),
      ],
      senderNameRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FromName), 40),
      ],
      generatedTemplates: [],
      activeGeneratedTemplateIndex: -1,
      toneOptions: [
        "Semi-formal",
        "Formal",
        "Serious",
        "Confident",
        "Professional",
        "Positive",
        "Empathetic",
        "Neutral",
        "Diplomatic",
        "Urgent",
        "Persuasive",
      ],
      localeOptions: [
        {
          text: "United Kingdom",
          value: "United Kingdom",
          isVisible: true,
        },
        {
          text: "United States",
          value: "United States",
          isVisible: true,
          children: [
            {
              text: "Alabama",
              value: "Alabama",
            },
            {
              text: "Alaska",
              value: "Alaska",
            },
            {
              text: "Arizona",
              value: "Arizona",
            },
            {
              text: "Arkansas",
              value: "Arkansas",
            },
            {
              text: "California",
              value: "California",
            },
            {
              text: "Colorado",
              value: "Colorado",
            },
          ],
        },
        {
          text: "Turkey",
          value: "Turkey",
          isVisible: true,
        },
        {
          text: "France",
          value: "France",
          isVisible: true,
        },
        {
          text: "Arabia",
          value: "Arabia",
          isVisible: true,
        },
        {
          text: "China",
          value: "China",
          isVisible: true,
        },
        {
          text: "Alabama",
          value: "Alabama",
          isVisible: false,
          disabled: true,
        },
        {
          text: "Alaska",
          value: "Alaska",
          isVisible: false,
          disabled: true,
        },
        {
          text: "Arizona",
          value: "Arizona",
          isVisible: false,
          disabled: true,
        },
        {
          text: "Arkansas",
          value: "Arkansas",
          isVisible: false,
          disabled: true,
        },
        {
          text: "California",
          value: "California",
          isVisible: false,
          disabled: true,
        },
        {
          text: "Colorado",
          value: "Colorado",
          isVisible: false,
          disabled: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      emailTemplateLogo: "whitelabel/getEmailTemplateLogoUrl",
      isFeedbackPopupOpened: "dashboard/isPopupOpened",
    }),
    getGenerateButtonLabel() {
      const isLanding = this.templateType === "landing";
      if (isLanding) {
        return this.isEmailGenerating ? "Generating Landing Page..." : "Generate Landing Page";
      }
      return this.isEmailGenerating ? "Generating Email Template..." : "Generate Email Template";
    },
    getGenerateEmailButtonStyle() {
      return this.aiTemplateText.length > 0 &&
        this.aiTemplateText.length <= 500 &&
        !this.isEmailGenerating &&
        this.languageTypeResourceId
        ? { opacity: 1, pointerEvents: "" }
        : { opacity: 0.5, pointerEvents: "none" };
    },
    getAITemplateTextAreaPlaceholder() {
      return this.templateType === "landing"
        ? "Describe the scenario and key details for the phishing simulation landing page you want to generate."
        : "Describe the scenario and key details for the phishing simulation email you want to generate.";
    },
    getLoaderTitle() {
      return this.templateType === "landing"
        ? "AI Ally is carefully crafting your Landing Page template"
        : "AI Ally is carefully crafting your Email template";
    },
    attachmentExtensions() {
      return this.extensions ? this.extensions : ["gif", "jpg", "jpeg", "png", "bmp"];
    },
    attachments() {
      if (
        !!this.attachmentFiles &&
        this.attachmentFiles?.length &&
        !!this.importedEmailAttachments &&
        this.importedEmailAttachments?.length
      ) {
        return [...this.attachmentFiles, ...this.importedEmailAttachments];
      }
      if (!!this.attachmentFiles && this.attachmentFiles?.length) {
        return [...this.attachmentFiles];
      }
      return [];
    },
    isMergeTagSubject() {
      return this.isNotificationTemplate && this.isEnrollmentCategorySelected;
    },
    getSubjectSubtitle() {
      if (!this.isMergeTagSubject) return undefined;
      return `Define a subject for the notification email. Use {ENROLLMENT_NAME} merge tag as a variable for the notification email subject`;
    },
    getSubjectRules() {
      if (this.isMergeTagSubject) {
        return [...this.subjectRules, ...this.mergeTagRules];
      }
      return this.subjectRules;
    },
    feedbackDialog: {
      get() {
        return this.isFeedbackPopupOpened;
      },
      set(newValue) {
        this.changeFeedbackPopup(newValue);
      },
    },
  },
  watch: {
    activeBlockManagerComponents() {
      this.grapeJsKey = `${createRandomCryptStringNumber()}-key`;
    },
    template: {
      handler(val) {
        this.previewTemplate =
          val?.replace(/{COMPANYLOGO}/g, this?.$store?.state?.whitelabel.mainLogoUrl || "") || "";
      },
      immediate: true,
    },
    prompt(val) {
      if (val !== this.aiTemplateText) this.aiTemplateText = val || "";
    },
    aiTemplateText(val) {
      this.$emit("update:prompt", val || "");
    },
  },
  mounted() {
    this.defaultTemplate = this.template || this.$refs.refPreview.$el.outerHTML;
    this.setDefaultTemplate();
    this.$emit("handleInitialTemplate", this.defaultTemplate);
  },
  beforeDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  },
  methods: {
    ...mapActions({ changeFeedbackPopup: "dashboard/changeFeedbackPopup" }),
    handleStateChange(state) {
      this.$emit("update:selectedLocale", state.value);
    },
    handleGenerateEmail() {
      this.isEmailGenerating = true;
      document
        ?.querySelector("#email-template-content")
        ?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
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
      };
      this.$emit("update:isAssistedByAITemplate", true);
      this.$emit("update:aiAssistantRemainingRight", this.aiAssistantRemainingRight - 1);
      if (this.templateType === "landing") {
        generateAILandingPageTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAILandingPageTemplate();
          }
        });
      } else {
        generateAIEmailTemplate(payload).then((response) => {
          if (response?.data?.data?.isSuccess) {
            this.callForGetGeneratedAIEmailTemplate();
          }
        });
      }
    },
    callForGetGeneratedAIEmailTemplate() {
      getGeneratedAIEmailTemplate()
        .then((response) => {
          const { template, subject } = response?.data?.data || {};
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: template,
            subject,
            isPlainText: this.isPlainText,
            languageTypeResourceId: this.languageTypeResourceId,
          });
          this.$emit("update:subject", subject);
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1;
          this.$emit("update:template", template);
          this.isEmailGenerating = false;
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAIEmailTemplate(), 5000);
        });
    },
    callForGetGeneratedAILandingPageTemplate() {
      getGeneratedAILandingPageTemplate()
        .then((response) => {
          const template = response?.data?.data || {};
          this.generatedTemplates.push({
            text: this.aiTemplateText,
            content: template,
            languageTypeResourceId: this.languageTypeResourceId,
          });
          this.activeGeneratedTemplateIndex = this.generatedTemplates.length - 1;
          this.$emit("update:template", template);
          this.isEmailGenerating = false;
        })
        .catch(() => {
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAILandingPageTemplate(), 5000);
        });
    },
    setActiveGeneratedTemplate(index) {
      this.activeGeneratedTemplateIndex = index;
      this.aiTemplateText = this.generatedTemplates[index].text;
      this.$emit("update:isPlainText", this.generatedTemplates[index].isPlainText);
      this.$emit(
        "update:languageTypeResourceId",
        this.generatedTemplates[index].languageTypeResourceId
      );
      this.$emit("update:template", this.generatedTemplates[index].content);
      this.$emit("update:subject", this.generatedTemplates[index].subject);
    },
    handleAiAssistantBadgeClick(index) {
      this.aiTemplateText =
        this.templateType === "landing"
          ? this.landingPageBadgeContents[index].content
          : this.badgeContents[index].content;
    },
    handleRenameItem() {
      this.$emit("handleRenameAttachment");
    },
    handleDeleteItem() {
      this.$emit("handleDeleteAttachment");
    },
    setInitialTemplateData() {
      setTimeout(() => {
        this.initialTemplate = this.$refs?.grapesJsPostIncident?.getGrapesEditorContent?.() || "";
      }, 1000);
    },
    handleFileDelete(index) {
      this.$emit("handleAttachmentRemove", { item: this.attachments[index], index });
    },
    onFileChanged(file) {
      this.$emit("setAttachmentFile", file);
    },
    changeTabStatus(index) {
      this.tab = index;
    },
    editHtmlTemplate() {
      this.toggleShowGrapesModal();
    },
    setDefaultTemplate() {
      this.$emit("update:template", this.defaultTemplate);
    },
    toggleShowGrapesModal(isSubmitted = false) {
      if (!this.showGrapesModal) {
        this.changeGrapesModalStatus();
        this.setInitialTemplateData();
        return;
      }
      if (!this.$refs.grapesJsPostIncident) {
        return this.changeGrapesModalStatus();
      }
      const currentTemplate = this.$refs.grapesJsPostIncident.getGrapesEditorContent();
      const isChanged = isDifferent(currentTemplate, this.initialTemplate);
      if (!isChanged || isSubmitted) {
        this.destroyPostIncidentEditor();
      } else {
        this.$store.dispatch("common/setIsShowLeavingDialog", {
          show: true,
          callback: () => {
            this.destroyPostIncidentEditor();
          },
        });
      }
    },
    destroyPostIncidentEditor() {
      this?.$refs?.grapesJsPostIncident?.destroyEditor();
      this.changeGrapesModalStatus();
    },
    changeGrapesModalStatus() {
      this.showGrapesModal = !this.showGrapesModal;
      this.$emit("template-edit", this.showGrapesModal);
    },
    saveGrapeJs() {
      const template = this.$refs.grapesJsPostIncident.getGrapesEditorContent();
      if (
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT ||
        this.templateType === QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL
      ) {
        if (!template.includes(qrCodeString)) {
          return this.$emit("showErrorDialog");
        }
      }
      this.$emit("update:template", template);
      //this code has to be added otherwise grapesjs throws error
      setTimeout(() => {
        this.toggleShowGrapesModal(true);
      }, 100);
    },
  },
};
</script>
