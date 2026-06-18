<template>
  <v-card
    :class="[
      'email-template__container',
      hideNotificationTemplatePreviewOuterShell &&
        'email-template__container--teams-notification-shell'
    ]"
  >
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
          :htmlData="editorHtml"
          :key="grapeJsKey"
          :blockManagerComponents="activeBlockManagerComponents"
          :template-type="templateType"
          :isAttachmentBasedTemplate="isAttachmentBasedScenario"
          :hidePhishingUrlMergeTag="hidePhishingUrlMergeTag"
          :customHeadScripts="customHeadScripts"
          :customHeadScriptsPlacement="customHeadScriptsPlacement"
          :isShowHeadScripts="isShowHeadScripts"
          :isProtocolHttp="isProtocolHttp"
          @on-custom-head-scripts-change="
            (value, pageIndex) => onCustomHeadScriptsChange(value, pageIndex)
          "
          @on-custom-head-scripts-placement-change="
            (value, pageIndex) => onCustomHeadScriptsPlacementChange(value, pageIndex)
          "
        />
      </template>
    </app-modal>
    <div
      v-if="isAiAssistant && isAIAllyEnabled && templateType !== 'landing'"
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
            <VTooltip v-if="isShowRedFlags" bottom max-width="142">
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn
                    class="white--text btn-util email-template__ai-assistant-btn"
                    rounded
                    :ripple="false"
                    :style="isRedFlagButtonDisabledStyle"
                    @click="$emit('update:aiAssistant', true)"
                  >
                    <VIcon class="cursor-pointer mr-1" color="#fff">
                      mdi-creation
                    </VIcon>
                    USE
                  </VBtn>
                </div>
              </template>
              <span>To use this action, first hide the Red Flag.</span>
            </VTooltip>
            <VBtn
              v-else
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
                v-for="(i, index) in displayedBadgeContents"
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
                  style="max-width: 220px;"
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
                v-model="aiTemplateText"
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
                  v-model="isPlainText"
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
                <VTooltip v-if="isShowRedFlags" bottom max-width="142">
                  <template #activator="{ on }">
                    <div v-on="on">
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
                  </template>
                  <span>To use this action, first hide the Red Flag.</span>
                </VTooltip>
                <VBtn
                  v-else
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
    <div
      v-if="
        !onlyGrapes &&
        (
          !hideNotificationTemplateSenderFields ||
          showNameField ||
          showLanguageField ||
          showSubjectField ||
          isNotificationTemplate
        )
      "
      style="display: grid; grid-template-columns: 1fr 1fr;"
      :class="[
        !isAiAssistant && !showEditButton && (showNameField || showLanguageField) ? 'pt-6' : '',
        !isAiAssistant &&
        !showEditButton &&
        !showNameField &&
        !showLanguageField
          ? 'pt-4'
          : ''
      ]"
    >
      <div v-if="!onlyGrapes && showNameField" :class="getTemplateNameFieldClass">
        <FormGroup
          title="Template Name:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <InputEntityName
            id="input--notification-template-name-email"
            initialPlaceholder="Enter template name"
            entityName="template name"
            :value="name"
            :disabled="editItemsDisabled || isShowRedFlags"
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
      <div
        :class="[
          'mx-6',
          getSubjectSubtitle ? 'mt-6' : '',
          isHorizontalFormGroups ? 'pt-2' : 'pt-0'
        ]"
        v-if="!onlyGrapes"
      >
        <FormGroup
          title="Subject:"
          style="max-width: unset;"
          :className="isHorizontalFormGroups ? 'k-form-group--horizontal' : ''"
          :labelClassName="isHorizontalFormGroups ? 'k-form-group__title--horizontal' : ''"
        >
          <div :class="['position-relative']">
            <div
              v-if="getSubjectSubtitle"
              class="text-primary-color fs-3"
              style="position: absolute !important; top: -40px; max-width: 554px;"
            >
              {{ getSubjectSubtitle }}
            </div>
            <InputEntityName
              ref="refInputEntityName"
              id="input--notification-template-subject"
              :className="
                redFlags && redFlags.subject && redFlags.subject.isRedFlagged
                  ? 'red-flag-active'
                  : ''
              "
              initialPlaceholder="Enter email subject"
              entityName="email subject"
              label="Subject"
              persistent-placeholder
              :value="subject"
              :disabled="editItemsDisabled || isShowRedFlags"
              :initialRules="getSubjectRules"
              @input="$emit('update:subject', $event)"
            />
            <RedFlagTooltip
              v-if="redFlags && redFlags.subject && redFlags.subject.tooltipMessage"
              :tooltipContent="redFlags.subject.tooltipMessage"
            />
          </div>
        </FormGroup>
      </div>
      <div
        v-if="!onlyGrapes && !hideNotificationTemplateSenderFields"
        :class="['mx-6', getSubjectSubtitle ? 'mt-6' : '', isHorizontalFormGroups ? 'pt-2' : '']"
      >
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
              :className="
                redFlags && redFlags.fromName && redFlags.fromName.isRedFlagged
                  ? 'red-flag-active'
                  : ''
              "
              entityName="sender name"
              label="From Name"
              persistent-placeholder
              :value="fromName"
              :disabled="editItemsDisabled || isShowRedFlags"
              :initialRules="senderNameRules"
              @input="$emit('update:fromName', $event)"
            />
            <RedFlagTooltip
              v-if="redFlags && redFlags.fromName && redFlags.fromName.tooltipMessage"
              :tooltipContent="redFlags.fromName.tooltipMessage"
            />
          </div>
        </FormGroup>
      </div>
      <div
        v-if="!onlyGrapes && !hideNotificationTemplateSenderFields"
        :class="['mx-6', isHorizontalFormGroups ? 'pt-2' : '']"
      >
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
              :class="
                redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged
                  ? 'red-flag-active'
                  : ''
              "
              persistent-placeholder
              :disabled="editItemsDisabled || isShowRedFlags"
              :value="fromAddress"
              @input="$emit('update:fromAddress', $event)"
            >
              <template v-if="false" #append>
                <AppendableMergeTag @on-add-merge-tag="handleAddMergeTag" />
              </template>
            </InputEmail>
            <RedFlagTooltip
              v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.tooltipMessage"
              :tooltipContent="redFlags.fromAddress.tooltipMessage"
            />
          </div>
        </FormGroup>
      </div>
      <div
        v-if="
          !onlyGrapes &&
          !hideNotificationTemplateSenderFields &&
          (isNotificationEnrollment || isEmailTemplate)
        "
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
            autocomplete="off"
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
        v-if="(isAttachmentBasedScenario || showAttachmentUpload) && !onlyGrapes"
        :class="['d-flex mx-6 align-center', isHorizontalFormGroups ? 'v-list-item__content' : '']"
      >
        <label
          :class="[
            'mr-4',
            isHorizontalFormGroups ? 'k-form-group__title--horizontal mb-4' : 'mb-6'
          ]"
          :for="
            isShowRedFlags && !attachments.length
              ? 'input--email-template-upload-tooltip'
              : 'input--email-template-upload'
          "
          style="font-weight: 600; font-size: 20px;"
          >Attach File:</label
        >
        <v-tooltip v-if="isShowRedFlags && !attachments.length" bottom>
          <template #activator="{ on }">
            <div v-on="on">
              <k-file-upload
                v-if="!attachments.length"
                id="input--email-template-upload-tooltip"
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
                :disabled="true"
                @inputFile="onFileChanged"
              />
            </div>
          </template>
          <span>To use this action, first hide the Red Flag.</span>
        </v-tooltip>
        <k-file-upload
          v-else-if="!attachments.length"
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
                  :red-flags="redFlags"
                  @on-delete="handleFileDelete"
                />
              </div>
              <div v-if="!item.isDeletable" class="attachment-delete-wrapper">
                <v-menu bottom left offset-y transition="scale-transition">
                  <template #activator="{ on }">
                    <v-btn v-on="on" class="btn-hover" icon outlined :disabled="isShowRedFlags">
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
    <v-divider v-if="!onlyGrapes && !isNotificationTemplate" class="email-template__divider mb-6" />
    <div v-if="isEmailGenerating">
      <EmailTemplatesAILoader
        :title="getLoaderTitle"
        :description="getLoaderDescription"
        :loaderTime="isRedFlagsLoading ? 30 : 20"
      />
    </div>
    <div
      v-else
      id="email-template-content"
      class="email-template-content"
      :style="{ 'margin-top': isNotificationTemplate ? '16px' : '24px' }"
    >
      <div>
        <v-btn
          v-if="(!isPhishingTemplate && templateType !== 'landing') || showEditButton"
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
        <div :class="getEmailPreviewClasses">
          <KEmailPreview
            v-if="template"
            :key="template"
            ref="refPreview"
            :is-landing-page="templateType === 'landing'"
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
import {
  scrollToEmailTemplateContent,
  setCompanyLogoSrc,
  AI_ALLY_EMAIL_SUGGESTIONS,
  AI_ALLY_LURE_SUGGESTIONS,
  AI_ALLY_LANDING_SUGGESTIONS
} from '@/components/Company Settings/utils'
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
    // Shows the attachment upload section on its own, WITHOUT the attachment-based
    // behaviour (which would also strip the {PHISHINGURL} merge tag from the editor).
    // Used by the Double Barrel payload editor, where attachments are optional but the
    // body still needs {PHISHINGURL}.
    'showAttachmentUpload',
    'hidePhishingUrlMergeTag',
    'useLureSuggestions',
    'isAttachmentError',
    'isNotificationTemplate',
    'isEnrollmentCategorySelected',
    'isLearningPathEnrollmentSelected',
    'isNotificationEnrollment',
    'isEmailTemplate',
    'hideNotificationTemplateSenderFields',
    'hideNotificationTemplatePreviewOuterShell',
    'isHorizontalFormGroups',
    'showNameField',
    'showSubjectField',
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
    'redFlags',
    'isPlainText',
    'customHeadScripts',
    'customHeadScriptsPlacement',
    'currentPageIndex',
    'isShowHeadScripts',
    'showEditButton',
    'isRedFlagsLoading',
    'isShowRedFlags',
    'isProtocolHttp',
    'isEnhanceWithAi'
  ],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      isEmailGenerating: false,
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
          const matches = v.match(/\{(\w*)\}/g)
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
          const matches = v.match(/\{(\w*)\}/g)
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
      isFeedbackPopupOpened: 'dashboard/isPopupOpened',
      hasAIGenerationOptionsPermission: 'permissions/getEmailTemplatesAIGenerationOptionsPermissions'
    }),
    editorHtml() {
      // GrapesJS editöründe Company Logo merge tag'i {COMPANYLOGO} placeholder'ı
      // ile gösterilmeli. Sebepleri:
      //  - Sidebar'dan yeni sürüklenen Company Logo block'unun src'si zaten
      //    '{COMPANYLOGO}' (companyLogo block tanımına bak). injectLogo ile
      //    URL'ye çevirmek eski/yeni merge tag'ler arasında tutarsızlık yaratır.
      //  - GrapesJS toolbar'ındaki Preview butonu içeriği alıp {COMPANYLOGO}'yu
      //    URL ile değiştirerek yeni sekmede gösteriyor. Editor zaten URL ile
      //    açılırsa Preview butonu no-op olur.
      //  - Asıl WYSIWYG preview KEmailPreview'da gerçekleşiyor; orada watcher
      //    {COMPANYLOGO} → URL dönüşümünü yapıyor.
      return this.template
    },
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
    // AI Ally "TRY SUGGESTIONS". For a Double Barrel lure editor (useLureSuggestions) the
    // prompts must NOT ask for links/CTAs — the lure email carries no phishing URL.
    displayedBadgeContents() {
      if (this.templateType === 'landing') return AI_ALLY_LANDING_SUGGESTIONS
      return this.useLureSuggestions ? AI_ALLY_LURE_SUGGESTIONS : AI_ALLY_EMAIL_SUGGESTIONS
    },
    getGenerateEmailButtonStyle() {
      if (this.isShowRedFlags) return this.isRedFlagButtonDisabledStyle
      return this.aiTemplateText.length > 0 &&
        this.aiTemplateText.length <= 500 &&
        !this.isEmailGenerating &&
        this.languageTypeResourceId
        ? { opacity: 1, pointerEvents: '' }
        : { opacity: 0.5, pointerEvents: 'none' }
    },
    isRedFlagButtonDisabledStyle() {
      return this.isShowRedFlags ? { opacity: 0.5, pointerEvents: 'none' } : {}
    },
    getEmailPreviewClasses() {
      return {
        'email-template-preview email-template-preview-phishing': true,
        'pointer-none': !this.isShowRedFlags
      }
    },
    getAITemplateTextAreaPlaceholder() {
      return this.templateType === 'landing'
        ? 'Describe the scenario and key details for the phishing simulation landing page you want to generate.'
        : 'Describe the scenario and key details for the phishing simulation email you want to generate.'
    },
    getLoaderTitle() {
      if (this.isRedFlagsLoading)
        return 'AI Ally is carefully scanning your email template for Red Flags'
      if (this.isEnhanceWithAi)
        return this.templateType === 'landing'
          ? 'AI Ally is enhancing your Landing Page template'
          : 'AI Ally is enhancing your Email template'
      if (this.isGenerateWithAi) {
        if (this.isNotificationTemplate)
          return 'The notification template is being localized by AI Ally for the selected language.'
        if (this.templateType === 'landing')
          return 'The landing page is being localized by AI Ally for the selected languages.'
        return `The email template is being localized by AI Ally for the selected languages.`
      }
      if (this.isNotificationTemplate)
        return 'AI Ally is carefully crafting your Notification template'
      return this.templateType === 'landing'
        ? 'AI Ally is carefully crafting your Landing Page template'
        : 'AI Ally is carefully crafting your Email template'
    },
    getLoaderDescription() {
      if (this.isRedFlagsLoading)
        return 'The scan may take some time depending on the localization. Please stay on the page while the scan is completed.'
      if (this.isEnhanceWithAi)
        return 'This process may take a few seconds. Please stay on the page while the template is being enhanced.'
      if (this.isGenerateWithAi) {
        if (this.isNotificationTemplate)
          return 'The process may take some time depending on the number of localizations. Please stay on the page.'
        if (this.templateType === 'landing')
          return 'This process may take some time depending on the number of localizations. Please stay on the page while the landing page is being localized.'
        return 'This process may take some time depending on the number of localizations. Please stay on the page.'
      }
      if (this.isNotificationTemplate)
        return 'The process may take some time depending on the number of localizations. Please stay on the page.'
      return 'This process may take some time while the email is being crafted. Please stay on the page during this time.'
    },
    attachmentExtensions() {
      return this.extensions ? this.extensions : ['gif', 'jpg', 'jpeg', 'png', 'bmp']
    },
    attachments() {
      // If both exist, check if they're the same (to avoid duplicates)
      if (
        !!this.attachmentFiles &&
        this.attachmentFiles?.length &&
        !!this.importedEmailAttachments &&
        this.importedEmailAttachments?.length
      ) {
        // Check if first items are the same (same fileName/name)
        const attachmentFile = this.attachmentFiles[0]
        const importedAttachment = this.importedEmailAttachments[0]
        const isSame =
          (attachmentFile?.fileName || attachmentFile?.name) ===
          (importedAttachment?.fileName || importedAttachment?.name)

        // If same, return only attachmentFiles to avoid duplicate
        // If different, merge them (old behavior for backward compatibility)
        return isSame
          ? [...this.attachmentFiles]
          : [...this.attachmentFiles, ...this.importedEmailAttachments]
      }
      // If only attachmentFiles exists
      if (!!this.attachmentFiles && this.attachmentFiles?.length) {
        return [...this.attachmentFiles]
      }
      // If only importedEmailAttachments exists
      if (!!this.importedEmailAttachments && this.importedEmailAttachments?.length) {
        return [...this.importedEmailAttachments]
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
        let url = ''
        if (this.templateType === 'landing') {
          url =
            localStorage.getItem('isSelectCompany') === 'true'
              ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
              : this.$store.state.auth.logoUrl || ''
          if (!url) url = this?.$store?.state?.whitelabel.mainLogoUrl || ''
        } else {
          url = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
        }
        // Önce literal {COMPANYLOGO} placeholder'ını temizle, ardından
        // data-title="Company Logo" olan tüm img'lerin src'sini gerçek URL ile zorla.
        // Bu sayede template kayıtta placeholder yerine eski/farklı URL ile gelse bile
        // preview'da güncel logo görünür.
        const replaced = (val || '').replaceAll('{COMPANYLOGO}', url)
        this.previewTemplate = setCompanyLogoSrc(replaced, url)
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
    if (this.isAiAssistant && this.isAIAllyEnabled && this.hasAIGenerationOptionsPermission) {
      this.getAIGenerationOptions()
    }
    this.defaultTemplate = this.template || this.$refs.refPreview.$el.outerHTML
    this.setDefaultTemplate()
  },
  beforeDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  },
  methods: {
    ...mapActions({ changeFeedbackPopup: 'dashboard/changeFeedbackPopup' }),
    restoreLogo(html = '') {
      // data-title="Company Logo" olan img'lerin src'sini koşulsuz olarak
      // {COMPANYLOGO} placeholder'ına çevirir. Eski mantık yalnızca o anki logo
      // URL'sini arıyordu; URL değişirse veya farklı bir URL kayıtlıysa
      // çalışmıyordu. Yeni mantık attribute'a bakarak güvenle restore eder.
      return setCompanyLogoSrc(html || '', '{COMPANYLOGO}')
    },
    onCustomHeadScriptsChange(value, pageIndex) {
      this.$emit('on-custom-head-scripts-change', value, pageIndex)
    },
    onCustomHeadScriptsPlacementChange(value, pageIndex) {
      this.$emit('on-custom-head-scripts-placement-change', value, pageIndex)
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
        methodTypeId: Number.parseInt(this.methodTypeId),
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
          this.$emit('on-generate-email-template-success', {
            template,
            subject
          })
          this.isEmailGenerating = false
        })
        .catch((error) => {
          if (error?.response?.status === 500) {
            if (this.timeoutId) clearTimeout(this.timeoutId)
            this.isEmailGenerating = false
            this.$nextTick(() => {
              const element = document.querySelector('.email-template__ai-assistant-footer-right')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            })
            return
          }
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
        .catch((error) => {
          if (error?.response?.status === 500) {
            if (this.timeoutId) clearTimeout(this.timeoutId)
            this.isEmailGenerating = false
            this.$nextTick(() => {
              const element = document.querySelector('.email-template__ai-assistant-footer-right')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            })
            return
          }
          this.timeoutId = setTimeout(() => this.callForGetGeneratedAILandingPageTemplate(), 5000)
        })
    },
    setActiveGeneratedTemplate(index) {
      this.activeGeneratedTemplateIndex = index
      this.aiTemplateText = this.generatedTemplates[index].text
      this.isShowRedFlags = false
      this.$emit('update:isPlainText', this.generatedTemplates[index].isPlainText)
      this.$emit(
        'update:languageTypeResourceId',
        this.generatedTemplates[index].languageTypeResourceId
      )
      this.$emit('update:template', this.generatedTemplates[index].content)
      this.$emit('update:subject', this.generatedTemplates[index].subject)
    },
    handleAiAssistantBadgeClick(index) {
      this.aiTemplateText = this.displayedBadgeContents[index].content
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
      // GrapesJS editöründen çıkan template'te company logo gerçek URL ile
      // yer alıyor. Backend'e {COMPANYLOGO} placeholder'ı gitmesi için landing
      // ve notification template'lerinde restore et. Diğer tipler (phishing,
      // quishing, callback vs.) için davranışı değiştirme - kendi yerlerinde
      // farklı placeholder/URL stratejisi olabilir.
      if (this.templateType === 'landing' || this.isNotificationTemplate) {
        const htmlToSave = this.restoreLogo(template)
        this.$emit('on-save-template', htmlToSave)
        this.$emit('update:template', htmlToSave)
      } else {
        this.$emit('on-save-template', template)
        this.$emit('update:template', template)
      }
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
