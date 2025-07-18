<template>
  <app-modal
    v-if="status"
    icon-name="mdi-file"
    :status="status"
    :title="getTitle"
    :should-remove-overflow="shouldRemoveOverflow"
  >
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Template Info</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Page Settings</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="email-template-info">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Landing Page Template Info</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this landing page template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refFormStep1" lazy-validation>
                <form-group title="Template Name" has-hint class-name="mt-8">
                  <v-text-field
                    v-bind="commonRules"
                    v-model.trim="formValues.name"
                    id="input--new-email-templates-template-name"
                    placeholder="Enter a name"
                    hint="*Required"
                    required
                    outlined
                    dense
                    persistent-hint
                    :disabled="editItemsDisabled"
                  />
                </form-group>
                <form-group title="Description" sub-title="Describe the template briefly">
                  <v-textarea
                    v-model.trim="formValues.description"
                    id="input--new-email-templates-description"
                    outlined
                    dense
                    no-resize
                    persistent-hint
                    rows="2"
                    placeholder="Description"
                    height="100"
                    :rules="[
                      (v) =>
                        Validations.maxLength(
                          v,
                          300,
                          labels.getMaxLengthMessage(labels.Description, 300)
                        )
                    ]"
                  ></v-textarea>
                </form-group>
                <InputPhishingMethod
                  v-model.trim="formValues.methodTypeId"
                  item-text-key="text"
                  item-value-key="value"
                  :max-length="256"
                  :items="landingPageData.methodTypes"
                  :disabled="selectedMethodText ? selectedMethodText !== 'MFA' : false"
                />
                <form-group
                  has-hint
                  title="Language"
                  sub-title="Select the language you are writing this webpage template in"
                >
                  <input-select-language
                    v-model="formValues.languageTypeResourceId"
                    v-bind="commonRules"
                    item-text="text"
                    item-value="value"
                    required
                    :items="languageOptions"
                    :menu-props="{ offsetY: true }"
                  />
                </form-group>
                <form-group title="Tags" sub-title="Define tags for the template">
                  <InputTag
                    v-model="formValues.tags"
                    ref="refTags"
                    :id="`input--action-tags`"
                    :items="[]"
                    class="hide-caret"
                  />
                </form-group>
                <form-group
                  title="Difficulty"
                  sub-title="Select a detection difficulty level for this phishing email"
                  class-name="mb-8"
                >
                  <v-radio-group
                    v-model="formValues.difficultyTypeId"
                    class="send-welcome-email__radio-group mt-4"
                    hide-details
                    row
                    persistent-hint
                  >
                    <v-radio
                      v-for="item in landingPageData.difficultyTypes"
                      :key="item.text"
                      :value="item.value"
                      :label="item.text"
                      color="#2196f3"
                    ></v-radio>
                  </v-radio-group>
                </form-group>
                <make-available-for
                  v-model="availableForRequests"
                  ref="refMakeAvailableFor"
                  open-direction="above"
                  sub-title="Select companies that should see this landing page template in their libraries"
                  placeholder="Select companies or company groups"
                  :disabled="!showMakeAvailableFor"
                />
              </v-form>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="email-settings">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="new-email-template__title">
                    Page Settings</v-list-item-title
                  >
                  <v-list-item-subtitle class="new-email-template__sub-title"
                    >Enter basic information about this email template</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="mt-4">
                <v-list-item-content>
                  <v-form ref="refEmailTemplateContent" style="padding-right: 68px;">
                    <InputPhishingLink
                      ref="refInputPhishingLink"
                      v-model="formValues.phishingLink"
                      :url-schema-types="getUrlSchemaTypes"
                      :domain-records="getDomainRecordTypes"
                      :extension-types="getExtensionTypes"
                      :parameter-types="getParameterTypes"
                      :path-types="getPathTypes"
                      :is-edit="isEdit"
                      @invisible-captcha="isInvisibleCaptchaDisabled = $event"
                      @captcha-default-value="formValues.isInvisibleCaptchaEnabled = $event"
                    />
                    <VCheckbox
                      v-model="formValues.isInvisibleCaptchaEnabled"
                      color="#2196f3"
                      hide-details
                      :class="[
                        'mb-10',
                        isInvisibleCaptchaDisabled ? 'invisible-captcha-checkbox' : ''
                      ]"
                      :ripple="false"
                      :readonly="isInvisibleCaptchaDisabled"
                      :style="
                        isInvisibleCaptchaDisabled
                          ? { opacity: 0.38, cursor: 'default !important' }
                          : ''
                      "
                    >
                      <template #label>
                        Stop bots to prevent false clicks.
                        <VTooltip bottom max-width="260" z-index="9999999">
                          <template #activator="{ on }">
                            <v-icon v-on="on" class="ml-2" color="#757575">mdi-information</v-icon>
                          </template>
                          <span
                            >Once enabled, bot activity is automatically detected and stopped to
                            prevent false clicks, ensuring genuine traffic to the landing
                            page.</span
                          >
                        </VTooltip>
                      </template>
                    </VCheckbox>
                    <FormGroup title="Landing Page Template"></FormGroup>
                    <el-tabs
                      v-model="tab"
                      class="landing-page-tab-content"
                      id="landing-page-tab-content"
                    >
                      <el-tab-pane
                        v-for="(page, index) in formValues.landingPages"
                        :key="`page-${index + 1}`"
                        :label="`Page ${index + 1}`"
                        :name="`page${index + 1}`"
                        :id="`landingPage-content-${index + 1}`"
                      >
                        <template #label>
                          <div
                            style="display: flex;"
                            :style="
                              formValues.landingPages.length > 1 && {
                                width: '68px'
                              }
                            "
                          >
                            <span class="landing-page-tab__label">
                              {{ `Page ${index + 1}` }}
                            </span>
                            <v-menu
                              v-if="formValues.landingPages.length > 1"
                              :min-width="128"
                              :offset-y="true"
                              nudge-left="50"
                              bottom
                              :value="isPageAddMenuOpen[index]"
                              @input="isPageAddMenuOpen[index] = $event"
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
                          :name="formValues.name"
                          :is-ai-assistant="true"
                          :ai-assistant.sync="aiAssistant"
                          :ai-assistant-remaining-right="aiAssistantRemainingRights"
                          :ai-assistant-total-right="aiAssistantTotalRights"
                          :language-type-resource-id.sync="formValues.languageTypeResourceId"
                          :is-assisted-by-a-i-template.sync="isAssistedByAI"
                          :isAIAllyEnabled="isAIAllyEnabled"
                          :active-block-manager-components="activeBlockManagerComponents"
                          :edit-items-disabled="editItemsDisabled"
                          :template.sync="page.content"
                          :method-type-id="formValues.methodTypeId"
                          :language-options="languageOptions"
                          :selected-method="getSelectedMethod"
                          :is-edit="!!isEdit"
                          :onlyGrapes="true"
                          :prompt.sync="page.prompt"
                          @setAttachmentFile="setAttachmentFile"
                        />
                      </el-tab-pane>
                      <el-tab-pane v-if="formValues.landingPages.length <= 1" name="addPage">
                        <template #label>
                          <v-menu
                            :min-width="128"
                            :nudge-right="83"
                            :nudge-bottom="240"
                            id="add-page-menu"
                            attach="#landing-page-tab-content"
                            :z-index="10000"
                          >
                            <template #activator="{ on: menu }">
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
                      </el-tab-pane>
                    </el-tabs>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :step.sync="step"
        :disabled-statuses="{
          nextButton: isSubmitDisabled,
          submitButton: isSubmitDisabled
        }"
        :ids="footerButtonsIds"
        @on-cancel="changeNewEmailTemplateModalStatus"
        @on-back="backStep(-1)"
        @on-next="nextStep(+1)"
        @on-submit="submit"
      />
    </template>
  </app-modal>
</template>

<script>
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import AppModal from '../AppModal'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { getMergedTextForPhishing } from '@/api/phishingsimulator'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import { createLandingPage, getLandingPageTemplate, updateLandingPage } from '@/api/landingPage'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { mapGetters } from 'vuex'
import StepperFooter from '@/components/Stepper/StepperFooter'
import InputTag from '@/components/Common/Inputs/InputTag'
import { MERGED_TEXTS_MAP } from '@/components/LandingPage/utils'
import { getAvailableForValueFromList } from '@/utils/helperFunctions'
import InputPhishingLink from '@/components/Common/Inputs/InputPhishingLink.vue'
import InputPhishingMethod from '@/components/Common/Inputs/InputPhishingMethod.vue'
export default {
  name: 'NewLandingPage',
  components: {
    InputPhishingMethod,
    InputPhishingLink,
    StepperFooter,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputSelectLanguage,
    InputTag
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean
    },
    shouldRemoveOverflow: {
      type: Boolean,
      default: true
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    emailTemplateId: {
      type: String
    },
    landingPageData: {
      type: Object
    },
    isAIAllyEnabled: {
      type: Boolean
    },
    showLeavingDialog: {
      type: Boolean,
      default: true
    },
    selectedMethodText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      footerButtonsIds: {
        cancelButton: 'btn-cancel--add-or-edit-landing-page-templates-modal',
        backButton: 'btn-back--add-or-edit-landing-page-templates-modal',
        nextButton: 'btn-next--add-or-edit-landing-page-templates-modal',
        saveButton: 'btn-save--add-or-edit-landing-page-templates-modal'
      },
      isInvisibleCaptchaDisabled: false,
      languageOptions: [],
      isPageAddMenuOpen: [],
      disabledLabel: null,
      tab: 'page1',
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      labels,
      step: 1,
      Validations,
      availableForRequests: [],
      initialFormValues: {},
      editedLandingPages: [],
      isAssistedByAI: false,
      aiAssistant: false,
      formValues: {
        isInvisibleCaptchaEnabled: false,
        phishingLink: {
          urlSchemaTypeId: '',
          subDomain: '',
          domainRecordId: '',
          pathTypeId: '',
          extensionTypeId: '',
          parameterTypeId: ''
        },
        name: null,
        description: null,
        methodTypeId: null,
        difficultyTypeId: null,
        tags: [],
        landingPages: [{ name: 'landing-page', content: '', order: 1, prompt: '' }],
        languageTypeResourceId: '862249c19aad'
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 200, labels.getMaxLengthMessage(labels.TemplateName, 200))
        ]
      },
      editItemsDisabled: false,
      aiAssistantRemainingRights: 0,
      aiAssistantTotalRights: 0
    }
  },
  methods: {
    handleAddBlankPage() {
      let newPageText
      if (this.isEdit) newPageText = this.getNewIndexForPageText()
      else newPageText = this.getAndUpdateFirstIndexForPageText()
      this.formValues.landingPages.push({
        name: `Page ${newPageText}`,
        order: 2,
        prompt: '',
        content: `<table style="padding-top: 24px; border-spacing: 0; border: none !important; width: 100%;">    <tbody>      <tr        style="          margin-left: 24px;          font-family: 'Open Sans', sans-serif;          font-size: 24px;          line-height: 1.29;          letter-spacing: normal;          color: rgba(0, 0, 0, 0.87);          opacity: 0.7;          max-width: 200px;          min-height: 72px;          display: flex;          border-radius: 4px;          margin-bottom: 24px;          vertical-align: middle;          background-color: #e0e0e0;        "      >        <td>          <img            alt="notification-template-logo"            style="display: block; width: 100%; max-width: 200px; min-height: 72px;"            src=${this.emailTemplateLogo}          />        </td>      </tr>      <tr style="font-family: 'Open Sans', sans-serif; margin-left: 24px;">        <td style="width: 65%; padding-left: 24px;">          <h1            style="              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Let’s design a landing page template          </h1>          <h2            style="              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            To design an email template, first click the Edit button to enter design mode          </h2>          <p            style="              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Once there choose the layout, use blocks, text, images and other features you need to            design a responsive page, really fast            <img              style="margin-bottom: -10px;"              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzEwNzZfMTA2MjYiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjciIHk9IjgiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC41MTIxIDguNDU3NjNMOC41MDk4OCAxMS4xMTg2TDE5LjA0OTggMTEuMTE5Mkw3LjU1NjY5IDIyLjYxMjRMOS40NDIzMSAyNC40OThMMjAuOTM1NSAxMy4wMDQ4TDIwLjkzNjEgMjMuNTQ0OEwyMy41OTcgMjMuNTQyNkwyMy42MDk2IDguNDQ1MDRMOC41MTIxIDguNDU3NjNaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMTA3Nl8xMDYyNikiPgo8cmVjdCB4PSItMTcuMzM1OSIgeT0iLTE3LjMzMyIgd2lkdGg9IjY2Ljc3OCIgaGVpZ2h0PSI2Ni42NjY3IiBmaWxsPSIjNzU3NTc1Ii8+CjxtYXNrIGlkPSJtYXNrMV8xMDc2XzEwNjI2IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSItMTgiIHk9Ii0xOCIgd2lkdGg9IjY4IiBoZWlnaHQ9IjY4Ij4KPHJlY3QgeD0iLTE3LjMzNTkiIHk9Ii0xNy4zMzMiIHdpZHRoPSI2Ni43NzgiIGhlaWdodD0iNjYuNjY2NyIgZmlsbD0id2hpdGUiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2sxXzEwNzZfMTA2MjYpIj4KPC9nPgo8L2c+Cjwvc3ZnPgo="              alt="show-button"            />          </p>          <p            style="              margin-top: 8px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Give your content a style by changing fonts, colors, borders and other properties          </p>        </td>        <td style="width: 35%;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              margin-left: 96px;              width: 480px;              height: 270px;              margin-bottom: 30px;            "          >            <p              style="                padding: 24px 46px;                font-weight: 600;                font-size: 18px;                line-height: 25px;                color: #383b41;                margin-bottom: 8px;              "            >              Drag & drop layouts, blocks, images and text            </p>            <div style="margin: 0 auto; position: relative; width: 111px;">              <div                style="                  height: 111px;                  margin-left: 22px;                  width: 100%;                  border-radius: 8px;                  background-color: #eaf7ff;                  border: 1px dashed #40abec;                "              ></div>              <img                style="position: absolute; left: -26px; top: 45px;"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTExIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMSAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTExIDEyLjQ0NDRDMTExIDUuNiAxMDUuNDUgMCA5OC42NjY3IDBIMTIuMzMzM0M1LjU1IDAgMCA1LjYgMCAxMi40NDQ0Vjk5LjU1NTZDMCAxMDYuNCA1LjU1IDExMiAxMi4zMzMzIDExMkg5OC42NjY3QzEwNS40NSAxMTIgMTExIDEwNi40IDExMSA5OS41NTU2VjEyLjQ0NDRaIiBmaWxsPSIjQjNENEZDIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzQuMzQ2OSA0Ni4xNTk4TDQ5Ljc4MTYgNjUuMDQyMkw3MS4zOTAyIDM2Ljc1TDk5LjE3MjcgNzQuMzg5M0gxMi43MzgzTDM0LjM0NjkgNDYuMTU5OFoiIGZpbGw9IiNGMUY4RkUiLz4KPC9zdmc+Cg=="                alt="drop-layout-logo"              />              <img                style="position: absolute; left: -12px;"                alt="drop-layout-logo-cursor"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjIiIGhlaWdodD0iNjMiIHZpZXdCb3g9IjAgMCA2MiA2MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjMzNzggMjIuNzU0NEMxNy44MTc4IDIyLjMyNDIgMTcuMDUzNCAyMi40MDUgMTYuNjMxMyAyMi45MzVMMTUuNDkzOSAyNC4zNjE1VjE1Ljc3NDZIMjMuOTI3OUwyMi41MjY2IDE2LjkzMjdDMjIuMDA2NCAxNy4zNjI3IDIxLjkyNyAxOC4xNDA1IDIyLjM0OTQgMTguNjcwMkMyMi41ODkxIDE4Ljk3MSAyMi45MzkxIDE5LjEyNyAyMy4yOTIxIDE5LjEyN0MyMy41NjA4IDE5LjEyNyAyMy44MzEyIDE5LjAzNjYgMjQuMDU2MSAxOC44NTA3TDI4LjExMjYgMTUuNDk4NEMyOC4xMTM1IDE1LjQ5NzUgMjguMTE0NCAxNS40OTY0IDI4LjExNTUgMTUuNDk1N0MyOC4xNDgyIDE1LjQ2ODQgMjguMTc5NSAxNS40MzkyIDI4LjIwOTQgMTUuNDA4NkMyOC4yMTc2IDE1LjQwMDIgMjguMjI0OSAxNS4zOTEgMjguMjMyOSAxNS4zODIzQzI4LjI1NCAxNS4zNTk1IDI4LjI3NDQgMTUuMzM2MiAyOC4yOTM3IDE1LjMxMThDMjguMzAzMiAxNS4yOTk5IDI4LjMxMTcgMTUuMjg3NSAyOC4zMjA3IDE1LjI3NTJDMjguMzM3MiAxNS4yNTI1IDI4LjM1MzMgMTUuMjI5NiAyOC4zNjgzIDE1LjIwNTdDMjguMzc2NSAxNS4xOTI5IDI4LjM4NDEgMTUuMTc5OCAyOC4zOTE2IDE1LjE2NjZDMjguNDA1OSAxNS4xNDE5IDI4LjQxOTcgMTUuMTE2NyAyOC40MzIyIDE1LjA5MUMyOC40Mzg2IDE1LjA3OCAyOC40NDQ4IDE1LjA2NTMgMjguNDUwNyAxNS4wNTIxQzI4LjQ2MjkgMTUuMDI0OCAyOC40NzQgMTQuOTk2NyAyOC40ODQzIDE0Ljk2ODNDMjguNDg4OCAxNC45NTYgMjguNDkzNSAxNC45NDM3IDI4LjQ5NzcgMTQuOTMxMkMyOC41MDc1IDE0LjkwMTIgMjguNTE1OSAxNC44NzA3IDI4LjUyMzQgMTQuODM5OEMyOC41MjY0IDE0LjgyNzkgMjguNTI5OCAxNC44MTYyIDI4LjUzMjQgMTQuODA0M0MyOC41Mzk0IDE0Ljc3MTYgMjguNTQ0NSAxNC43Mzg0IDI4LjU0ODkgMTQuNzA0OUMyOC41NTAzIDE0LjY5NDIgMjguNTUyNSAxNC42ODM4IDI4LjU1MzcgMTQuNjcyOUMyOC41NTgzIDE0LjYyOTEgMjguNTYxMSAxNC41ODQ1IDI4LjU2MTEgMTQuNTM5M0MyOC41NjExIDE0LjQ5NDEgMjguNTU4MyAxNC40NDk2IDI4LjU1MzcgMTQuNDA1NkMyOC41NTI1IDE0LjM5NDggMjguNTUwMyAxNC4zODQ0IDI4LjU0ODkgMTQuMzczNkMyOC41NDQ1IDE0LjM0MDIgMjguNTM5NCAxNC4zMDY5IDI4LjUzMjQgMTQuMjc0NEMyOC41Mjk4IDE0LjI2MjMgMjguNTI2NCAxNC4yNTA3IDI4LjUyMzQgMTQuMjM4OUMyOC41MTU5IDE0LjIwNzkgMjguNTA3NSAxNC4xNzcyIDI4LjQ5NzcgMTQuMTQ3MkMyOC40OTM1IDE0LjEzNSAyOC40ODg5IDE0LjEyMjcgMjguNDg0NCAxNC4xMTA0QzI4LjQ3NCAxNC4wODE5IDI4LjQ2MjkgMTQuMDUzOCAyOC40NTA2IDE0LjAyNjRDMjguNDQ0OCAxNC4wMTMzIDI4LjQzODYgMTQuMDAwNyAyOC40MzI0IDEzLjk4OEMyOC40MTk3IDEzLjk2MTkgMjguNDA1OCAxMy45MzY2IDI4LjM5MTQgMTMuOTExNkMyOC4zODQgMTMuODk4OCAyOC4zNzY1IDEzLjg4NTggMjguMzY4NSAxMy44NzMxQzI4LjM1MzMgMTMuODQ4OSAyOC4zMzY5IDEzLjgyNTcgMjguMzIgMTMuODAyN0MyOC4zMTEzIDEzLjc5MDcgMjguMzAzMSAxMy43Nzg3IDI4LjI5NDEgMTMuNzY3MUMyOC4yNzM5IDEzLjc0MTcgMjguMjUyNiAxMy43MTc2IDI4LjIzMDcgMTMuNjkzN0MyOC4yMjM2IDEzLjY4NjIgMjguMjE3MiAxMy42Nzc5IDI4LjIwOTggMTMuNjcwNEMyOC4xNzk3IDEzLjYzOTQgMjguMTQ3OSAxMy42MTAxIDI4LjExNDggMTMuNTgyNEMyOC4xMTM5IDEzLjU4MTcgMjguMTEzMiAxMy41ODA5IDI4LjExMjQgMTMuNTgwMkwyNC4wNTYxIDEwLjIyOEMyMy41MzU3IDkuNzk3NzQgMjIuNzcxNSA5Ljg3ODY1IDIyLjM0OTQgMTAuNDA4NkMyMS45MjcgMTAuOTM4MiAyMi4wMDY1IDExLjcxNjEgMjIuNTI2NyAxMi4xNDZMMjMuOTI3OSAxMy4zMDRIMTUuNDkzOVY0LjcxNzIyTDE2LjYzMTIgNi4xNDM3NEMxNi44NzA5IDYuNDQ0NjUgMTcuMjIxIDYuNjAwNjcgMTcuNTczOSA2LjYwMDU1QzE3Ljg0MjUgNi42MDA1NSAxOC4xMTMgNi41MTAyNSAxOC4zMzc4IDYuMzI0NDZDMTguODU4MSA1Ljg5NDQ1IDE4LjkzNzUgNS4xMTY1OSAxOC41MTUzIDQuNTg2ODlMMTUuMjIyNiAwLjQ1NjgxMkMxNS4yMjE4IDAuNDU1NyAxNS4yMjA4IDAuNDU0NzEyIDE1LjIxOTggMC40NTM3MjRDMTUuMTkzIDAuNDIwMjQ3IDE1LjE2NDUgMC4zODgzNzYgMTUuMTM0NCAwLjM1Nzk4OEMxNS4xMjYzIDAuMzQ5ODM1IDE1LjExNzMgMC4zNDI0MjQgMTUuMTA5MSAwLjMzNDUxOEMxNS4wODY0IDAuMzEzMDI0IDE1LjA2MzYgMC4yOTE5IDE1LjAzOTMgMC4yNzIyNTlDMTUuMDI3OCAwLjI2Mjc0NyAxNS4wMTU0IDAuMjUzOTc2IDE1LjAwMzUgMC4yNDQ4MzVDMTQuOTgxMiAwLjIyODAzNSAxNC45NTg1IDAuMjExNjA2IDE0LjkzNTEgMC4xOTYyODhDMTQuOTIyNiAwLjE4ODAxMiAxNC45MDk3IDAuMTgwMjI5IDE0Ljg5NjkgMC4xNzI0NDdDMTQuODcyNSAwLjE1Nzg3MSAxNC44NDc2IDAuMTQ0MDM1IDE0LjgyMjIgMC4xMzEwNjVDMTQuODA5NyAwLjEyNDc2NSAxNC43OTcxIDAuMTE4NDY1IDE0Ljc4NDQgMC4xMTI1MzVDMTQuNzU3MyAwLjA5OTkzNTMgMTQuNzI5OSAwLjA4ODY5NDEgMTQuNzAxOSAwLjA3ODA3MDZDMTQuNjg5OSAwLjA3MzYyMzUgMTQuNjc3NyAwLjA2ODY4MjQgMTQuNjY1NSAwLjA2NDQ4MjRDMTQuNjM2MSAwLjA1NDQ3NjUgMTQuNjA2IDAuMDQ2MDc2NSAxNC41NzU2IDAuMDM4Mjk0MUMxNC41NjM5IDAuMDM1MzI5NCAxNC41NTI2IDAuMDMxODcwNiAxNC41NDA4IDAuMDI5MTUyOUMxNC41MDg3IDAuMDIyMTExOCAxNC40NzYyIDAuMDE2OTIzNSAxNC40NDMyIDAuMDEyMzUyOUMxNC40MzI3IDAuMDEwOTk0MSAxNC40MjI1IDAuMDA4NjQ3MDYgMTQuNDExOSAwLjAwNzQxMTc2QzE0LjM2ODcgMC4wMDI3MTc2NSAxNC4zMjUgMCAxNC4yODA2IDBDMTQuMjM2MSAwIDE0LjE5MjQgMC4wMDI3MTc2NSAxNC4xNDkzIDAuMDA3NDExNzZDMTQuMTM4NyAwLjAwODY0NzA2IDE0LjEyODUgMC4wMTA5OTQxIDE0LjExNzkgMC4wMTIzNTI5QzE0LjA4NDkgMC4wMTY5MjM1IDE0LjA1MjQgMC4wMjIxMTE4IDE0LjAyMDQgMC4wMjkxNTI5QzE0LjAwODUgMC4wMzE4NzA2IDEzLjk5NzIgMC4wMzUzMjk0IDEzLjk4NTUgMC4wMzgyOTQxQzEzLjk1NTEgMC4wNDYwNzY1IDEzLjkyNSAwLjA1NDQ3NjUgMTMuODk1NiAwLjA2NDQ4MjRDMTMuODgzNCAwLjA2ODY4MjQgMTMuODcxMyAwLjA3MzYyMzUgMTMuODU5MiAwLjA3ODA3MDZDMTMuODMxMiAwLjA4ODY5NDEgMTMuODAzOCAwLjA5OTkzNTMgMTMuNzc2NyAwLjExMjUzNUMxMy43NjQgMC4xMTg0NjUgMTMuNzUxNCAwLjEyNDc2NSAxMy43Mzg5IDAuMTMxMDY1QzEzLjcxMzUgMC4xNDQwMzUgMTMuNjg4NyAwLjE1Nzg3MSAxMy42NjQzIDAuMTcyNDQ3QzEzLjY1MTQgMC4xODAyMjkgMTMuNjM4NyAwLjE4ODAxMiAxMy42MjYgMC4xOTYyODhDMTMuNjAyNiAwLjIxMTYwNiAxMy41Nzk5IDAuMjI4MDM1IDEzLjU1NzcgMC4yNDQ4MzVDMTMuNTQ1NyAwLjI1Mzk3NiAxMy41MzMzIDAuMjYyNzQ3IDEzLjUyMTggMC4yNzIyNTlDMTMuNDk3NiAwLjI5MTkgMTMuNDc0NyAwLjMxMzAyNCAxMy40NTIxIDAuMzM0NTE4QzEzLjQ0MzggMC4zNDI0MjQgMTMuNDM0OCAwLjM0OTgzNSAxMy40MjY3IDAuMzU3OTg4QzEzLjM5NjYgMC4zODgzNzYgMTMuMzY4MSAwLjQyMDI0NyAxMy4zNDEzIDAuNDUzNzI0QzEzLjM0MDQgMC40NTQ3MTIgMTMuMzM5MyAwLjQ1NTcgMTMuMzM4NSAwLjQ1NjgxMkwxMC4wNDU4IDQuNTg2ODlDOS42MjM1OSA1LjExNjU5IDkuNzAzMDYgNS44OTQ0NSAxMC4yMjMzIDYuMzI0NDZDMTAuNzQzMiA2Ljc1NDIyIDExLjUwNzYgNi42NzM2OCAxMS45MyA2LjE0Mzc0TDEzLjA2NzMgNC43MTcyMlYxMy4zMDRINC42MzMyNkw2LjAzNDM4IDEyLjE0NkM2LjU1NDY1IDExLjcxNjEgNi42MzQxMiAxMC45MzgyIDYuMjExNzcgMTAuNDA4NkM1Ljc4OTMgOS44Nzg3NyA1LjAyNTQgOS43OTc3NCA0LjUwNTAxIDEwLjIyOEwwLjQ0ODgwMiAxMy41ODAyQzAuNDQ3OTUzIDEzLjU4MDkgMC40NDcyMjUgMTMuNTgxNyAwLjQ0NjM3NiAxMy41ODI0QzAuNDEzMjUyIDEzLjYxMDEgMC4zODE0NjQgMTMuNjM5NCAwLjM1MTM3NCAxMy42NzA0QzAuMzQ0MDk0IDEzLjY3NzggMC4zMzc2NjMgMTMuNjg2MSAwLjMzMDUwNSAxMy42OTM3QzAuMzA4NTQ0IDEzLjcxNzYgMC4yODczMTEgMTMuNzQxNyAwLjI2NzE3IDEzLjc2NzFDMC4yNTgwNyAxMy43Nzg3IDAuMjQ5ODIgMTMuNzkwNyAwLjI0MTIwNSAxMy44MDI0QzAuMjI0MjE5IDEzLjgyNTcgMC4yMDc4NCAxMy44NDg5IDAuMTkyNjczIDEzLjg3MzFDMC4xODQ2NjUgMTMuODg1OCAwLjE3NzE0MyAxMy44OTg4IDAuMTY5NzQyIDEzLjkxMTZDMC4xNTUzMDMgMTMuOTM2NiAwLjE0MTQ3MiAxMy45NjE5IDAuMTI4NzMyIDEzLjk4OEMwLjEyMjU0NCAxNC4wMDA3IDAuMTE2MzU2IDE0LjAxMzMgMC4xMTA1MzIgMTQuMDI2NEMwLjA5ODI3NzkgMTQuMDUzOCAwLjA4NzExNTUgMTQuMDgxOSAwLjA3NjY4MSAxNC4xMTA0QzAuMDcyMTkxOCAxNC4xMjI3IDAuMDY3NTgxMiAxNC4xMzUgMC4wNjM0NTYgMTQuMTQ3MkMwLjA1MzYyODIgMTQuMTc3MyAwLjA0NTI1NjQgMTQuMjA4IDAuMDM3NjEyNSAxNC4yMzkxQzAuMDM0NzAwNiAxNC4yNTA4IDAuMDMxMzAzMyAxNC4yNjIzIDAuMDI4NzU1NCAxNC4yNzQzQzAuMDIxNzE4MiAxNC4zMDY4IDAuMDE2NjIyMyAxNC4zNDAzIDAuMDEyMTMzMSAxNC4zNzM4QzAuMDEwNjc3MSAxNC4zODQ0IDAuMDA4NjE0NDggMTQuMzk0OSAwLjAwNzQwMTE3IDE0LjQwNTZDMC4wMDI3OTA2MSAxNC40NDk2IDAgMTQuNDk0MSAwIDE0LjUzOTNDMCAxNC41ODQ1IDAuMDAyNzkwNjEgMTQuNjI5MSAwLjAwNzQwMTE3IDE0LjY3MjlDMC4wMDg2MTQ0OCAxNC42ODM4IDAuMDEwNzk4NCAxNC42OTQyIDAuMDEyMjU0NCAxNC43MDQ5QzAuMDE2NjIyMyAxNC43Mzg0IDAuMDIxNzE4MiAxNC43NzE2IDAuMDI4NzU1NCAxNC44MDQzQzAuMDMxMzAzMyAxNC44MTYyIDAuMDM0NzAwNiAxNC44Mjc5IDAuMDM3NzMzOSAxNC44Mzk4QzAuMDQ1MjU2NCAxNC44NzA3IDAuMDUzNjI4MiAxNC45MDEyIDAuMDYzNDU2IDE0LjkzMTJDMC4wNjc1ODEyIDE0Ljk0MzcgMC4wNzIzMTMxIDE0Ljk1NiAwLjA3NjgwMjQgMTQuOTY4M0MwLjA4NzExNTUgMTQuOTk2NyAwLjA5ODI3NzkgMTUuMDI0OCAwLjExMDQxMSAxNS4wNTIxQzAuMTE2MzU2IDE1LjA2NTMgMC4xMjI1NDQgMTUuMDc4IDAuMTI4OTc1IDE1LjA5MUMwLjE0MTQ3MiAxNS4xMTY3IDAuMTU1MTgyIDE1LjE0MTkgMC4xNjk0OTkgMTUuMTY2NkMwLjE3NzAyMiAxNS4xNzk4IDAuMTg0NjY1IDE1LjE5MjkgMC4xOTI3OTUgMTUuMjA1N0MwLjIwNzg0IDE1LjIyOTYgMC4yMjM5NzcgMTUuMjUyNSAwLjI0MDQ3OCAxNS4yNzUyQzAuMjQ5NDU2IDE1LjI4NzUgMC4yNTc5NDkgMTUuMjk5OSAwLjI2NzQxMyAxNS4zMTE4QzAuMjg2NzA0IDE1LjMzNjIgMC4zMDcyMDkgMTUuMzU5NSAwLjMyODIgMTUuMzgyM0MwLjMzNjIwNyAxNS4zOTEgMC4zNDM0ODcgMTUuNDAwMiAwLjM1MTczOCAxNS40MDg2QzAuMzgxNTg1IDE1LjQzOTIgMC40MTI4ODggMTUuNDY4NCAwLjQ0NTY0OCAxNS40OTU3QzAuNDQ2NzQgMTUuNDk2NCAwLjQ0NzU4OSAxNS40OTc1IDAuNDQ4NjgxIDE1LjQ5ODRMNC41MDUwMSAxOC44NTA3QzQuNzI5OTYgMTkuMDM2NiA1LjAwMDI4IDE5LjEyNyA1LjI2OTAzIDE5LjEyN0M1LjYyMTk4IDE5LjEyNyA1Ljk3MjAyIDE4Ljk3MSA2LjIxMTc3IDE4LjY3MDJDNi42MzQxMiAxOC4xNDA1IDYuNTU0NzcgMTcuMzYyNyA2LjAzNDUgMTYuOTMyN0w0LjYzMzI2IDE1Ljc3NDZIMTMuMDY3M1YyNC4zNjE1TDExLjkzIDIyLjkzNUMxMS41MDc2IDIyLjQwNSAxMC43NDM1IDIyLjMyNDIgMTAuMjIzMyAyMi43NTQ0QzkuNzAzMDYgMjMuMTg0MiA5LjYyMzU5IDIzLjk2MjIgMTAuMDQ1OSAyNC40OTE5TDEzLjMzODYgMjguNjIxOEMxMy4zMzkzIDI4LjYyMjYgMTMuMzQwMSAyOC42MjM0IDEzLjM0MDcgMjguNjI0MkMxMy4zNjc5IDI4LjY1OCAxMy4zOTY2IDI4LjY5MDMgMTMuNDI3MSAyOC43MjFDMTMuNDM0NSAyOC43MjgyIDEzLjQ0MjUgMjguNzM0OSAxMy40NTAxIDI4Ljc0MjJDMTMuNDczNCAyOC43NjQ0IDEzLjQ5NzIgMjguNzg2MiAxMy41MjIyIDI4LjgwNjdDMTMuNTMzNSAyOC44MTU4IDEzLjU0NTIgMjguODI0NCAxMy41NTY5IDI4LjgzMzFDMTMuNTc5NiAyOC44NTA0IDEzLjYwMjUgMjguODY3IDEzLjYyNjMgMjguODgyNEMxMy42Mzg4IDI4Ljg5MDcgMTMuNjUxNCAyOC44OTgyIDEzLjY2NCAyOC45MDU5QzEzLjY4ODcgMjguOTIwNiAxMy43MTM1IDI4LjkzNDUgMTMuNzM5MSAyOC45NDc2QzEzLjc1MTUgMjguOTUzOSAxMy43NjQgMjguOTYwMSAxMy43NzY3IDI4Ljk2NkMxMy44MDM4IDI4Ljk3ODYgMTMuODMxMiAyOC45OSAxMy44NTk0IDI5LjAwMDVDMTMuODcxNCAyOS4wMDUyIDEzLjg4MzQgMjkuMDA5OSAxMy44OTU1IDI5LjAxNDFDMTMuOTI1MSAyOS4wMjQxIDEzLjk1NTIgMjkuMDMyNSAxMy45ODU4IDI5LjA0MDRDMTMuOTk3MyAyOS4wNDMyIDE0LjAwODUgMjkuMDQ2NyAxNC4wMjAzIDI5LjA0OTRDMTQuMDUyMyAyOS4wNTY2IDE0LjA4NSAyOS4wNjE4IDE0LjExOCAyOS4wNjYzQzE0LjEyODUgMjkuMDY3NyAxNC4xMzg4IDI5LjA2OTkgMTQuMTQ5MyAyOS4wNzEyQzE0LjE5MjQgMjkuMDc1OSAxNC4yMzYxIDI5LjA3ODYgMTQuMjgwNiAyOS4wNzg2QzE0LjMyNSAyOS4wNzg2IDE0LjM2ODcgMjkuMDc1OSAxNC40MTE5IDI5LjA3MTJDMTQuNDIyMyAyOS4wNjk5IDE0LjQzMjcgMjkuMDY3NyAxNC40NDMxIDI5LjA2NjNDMTQuNDc2MSAyOS4wNjE4IDE0LjUwODggMjkuMDU2NiAxNC41NDA5IDI5LjA0OTRDMTQuNTUyNiAyOS4wNDY3IDE0LjU2MzkgMjkuMDQzMiAxNC41NzUzIDI5LjA0MDRDMTQuNjA1OSAyOS4wMzI1IDE0LjYzNiAyOS4wMjQxIDE0LjY2NTYgMjkuMDE0MUMxNC42Nzc3IDI5LjAwOTkgMTQuNjg5OCAyOS4wMDUyIDE0LjcwMTggMjkuMDAwNUMxNC43Mjk5IDI4Ljk5IDE0Ljc1NzMgMjguOTc4NiAxNC43ODQ0IDI4Ljk2NkMxNC43OTcxIDI4Ljk2MDEgMTQuODA5NiAyOC45NTM5IDE0LjgyMiAyOC45NDc2QzE0Ljg0NzYgMjguOTM0NSAxNC44NzI1IDI4LjkyMDYgMTQuODk3MSAyOC45MDU5QzE0LjkwOTcgMjguODk4MiAxNC45MjI1IDI4Ljg5MDcgMTQuOTM0OCAyOC44ODI0QzE0Ljk1ODYgMjguODY3IDE0Ljk4MTYgMjguODUwNCAxNS4wMDQyIDI4LjgzMzFDMTUuMDE1OSAyOC44MjQ0IDE1LjAyNzcgMjguODE1OCAxNS4wMzkxIDI4LjgwNjdDMTUuMDY0MSAyOC43ODYyIDE1LjA4NzcgMjguNzY0NCAxNS4xMTEgMjguNzQyMkMxNS4xMTg3IDI4LjczNDkgMTUuMTI2NyAyOC43MjgyIDE1LjEzNDEgMjguNzIxQzE1LjE2NDUgMjguNjkwMyAxNS4xOTMzIDI4LjY1OCAxNS4yMjA1IDI4LjYyNDJDMTUuMjIxMiAyOC42MjM0IDE1LjIyMTggMjguNjIyNiAxNS4yMjI1IDI4LjYyMThMMTguNTE1MiAyNC40OTE5QzE4LjkzNzUgMjMuOTYyMiAxOC44NTgxIDIzLjE4NDIgMTguMzM3OCAyMi43NTQ0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTU3LjM2OTQgMzIuMDkxQzU2LjU5NDMgMzIuMDkxIDU1Ljg1NjkgMzIuMjk4MyA1NS4yMDkyIDMyLjY2NzVWMzIuNTY0MUM1NS4yMDkyIDI5Ljg2ODcgNTMuMTUxNSAyNy42NzYgNTAuNjIyNCAyNy42NzZDNDkuODQxOCAyNy42NzYgNDkuMTA2MyAyNy44ODQ3IDQ4LjQ2MjIgMjguMjUyN1YyOC4xNDIzQzQ4LjQ2MjIgMjUuNDQ3IDQ2LjQwNDUgMjMuMjU0MSA0My44NzUzIDIzLjI1NDFDNDMuMDk1MSAyMy4yNTQxIDQyLjM2MSAyMy40NTg5IDQxLjcxODQgMjMuODIyVjEwLjcwMzNDNDEuNzE4NCA4LjAzOTk3IDM5LjcxOTIgNS44MTM5NyAzNy4yNjE3IDUuNzQwOTZDMzYuMDUyNCA1LjcwNzQ5IDM0Ljg5NzMgNi4xNjc2MyAzNC4wMTE5IDcuMDQzMDlDMzMuMDc5NSA3Ljk2NTExIDMyLjU0NDggOS4yNzE1NiAzMi41NDQ4IDEwLjYyNzNWMzkuODMyNEwyOC45NDA4IDM0Ljg4MzNDMjYuOTc1MyAzMi4xODQzIDIzLjUwOTEgMzEuNDEwNyAyMC42OTkxIDMzLjA0NDJDMTkuNTMwNiAzMy43MjM1IDE5LjEwNTEgMzUuMjc1IDE5Ljc1MDcgMzYuNTAzQzIxLjkyMTggNDAuNjMzMiAyNy4zMTg2IDUwLjY5MzcgMzAuNjEyIDU1LjA0NzlDMzEuMDU3MiA1NS43MDc1IDM2LjE4MjQgNjMuMDAwMSA0NS4wNjQzIDYzLjAwMDFDNDkuOTgzMSA2My4wMDAxIDU0LjEyMTUgNjEuMjA5OSA1Ny4wMzIyIDU3LjgyMzFDNTkuMTY0NSA1NS4zNDE2IDYwLjUyMTMgNTIuMDY1NiA2MC44NTIyIDQ4LjU5ODZMNjEuOTUwNSAzNy4wOTg4QzYxLjk1NDMgMzcuMDU5MSA2MS45NTYyIDM3LjAxOTEgNjEuOTU2MiAzNi45NzkyQzYxLjk1NjIgMzQuMjgzOSA1OS44OTg2IDMyLjA5MSA1Ny4zNjk0IDMyLjA5MVoiIGZpbGw9IiMwMTAxMDEiLz4KPHBhdGggZD0iTTU4LjQzNjggNDguMzU5N0M1OC4xNTQ1IDUxLjMxNzMgNTcuMDA3IDU0LjEwMDQgNTUuMjA1NiA1Ni4xOTY1QzUyLjczNDcgNTkuMDcxOCA0OS4zMjI2IDYwLjUyOTcgNDUuMDY0MSA2MC41Mjk3QzM3LjI3NjUgNjAuNTI5NyAzMi42NDY1IDUzLjcwMTIgMzIuNjAxOSA1My42MzQyQzMyLjU4NyA1My42MTE1IDMyLjU3MTIgNTMuNTg5MiAzMi41NTQ4IDUzLjU2NzVDMjkuMjg1OSA0OS4yNTg5IDIzLjU2NTQgMzguNTI0NyAyMS44OSAzNS4zMzc0QzIxLjg1NiAzNS4yNzI4IDIxLjg4ODYgMzUuMTk3NyAyMS45MDIgMzUuMTlDMjIuNTAzNSAzNC44NDAzIDIzLjE1NSAzNC42NzE5IDIzLjgwMDYgMzQuNjcxOUMyNS4wMDgyIDM0LjY3MTkgMjYuMTk0NyAzNS4yNjEyIDI2Ljk5MTIgMzYuMzU1TDMyLjc4MzIgNDQuMzA4NUMzMy4wOTUgNDQuNzM2NSAzMy42NDExIDQ0LjkxMyAzNC4xMzgzIDQ0Ljc0NTdDMzQuNjM1NCA0NC41Nzg2IDM0Ljk3MTIgNDQuMTA1NiAzNC45NzEyIDQzLjU3MjdWMTAuNjI3NkMzNC45NzEyIDkuOTM1NTYgMzUuMjM3OCA5LjI3NTI5IDM1LjcwMjUgOC44MTU2NEMzNi4xMTMzIDguNDA5MzUgMzYuNjQwMyA4LjE5NDQxIDM3LjE5MDkgOC4yMTA4NEMzOC4zNDkxIDguMjQ1MyAzOS4yOTE2IDkuMzYzMzcgMzkuMjkxNiAxMC43MDM1VjI4LjAwMzZDMzkuMjkxNiAyOC42NzczIDM5LjgyMTkgMjkuMjI2OCA0MC40ODM1IDI5LjIzODZDNDEuMTQwNyAyOS4yNDg0IDQxLjY5NDIgMjguNzIwNCA0MS43MTc1IDI4LjA0NjlDNDEuNzYyNSAyNi43NDQ4IDQyLjcxMDMgMjUuNzI1IDQzLjg3NTEgMjUuNzI1QzQ1LjA2NjMgMjUuNzI1IDQ2LjAzNTQgMjYuODA5NCA0Ni4wMzU0IDI4LjE0MjZWMzIuNTY0NEM0Ni4wMzU0IDMzLjI0NjUgNDYuNTc4NyAzMy43OTk3IDQ3LjI0ODcgMzMuNzk5N0M0Ny45MTg4IDMzLjc5OTcgNDguNDYyIDMzLjI0NjUgNDguNDYyIDMyLjU2NDRDNDguNDYyIDMxLjIzMTMgNDkuNDMxMSAzMC4xNDY4IDUwLjYyMjMgMzAuMTQ2OEM1MS44MTM0IDMwLjE0NjggNTIuNzgyMyAzMS4yMzEzIDUyLjc4MjMgMzIuNTY0NFYzNi4xMjIxQzUyLjc4MjMgMzYuMjc2IDUyLjgxMDcgMzYuNDI4NyA1Mi44NjU4IDM2LjU3Mkw1Mi45Mjc4IDM2LjczMzNDNTMuMTI1MyAzNy4yNDc4IDUzLjYzNjQgMzcuNTY1NCA1NC4xNzQ3IDM3LjUxMjhDNTQuNzE0OSAzNy40NTk1IDU1LjE1NDYgMzcuMDQ3NSA1NS4yNTE0IDM2LjUwMzlDNTUuNDUyIDM1LjM3ODUgNTYuMzQyNyAzNC41NjE5IDU3LjM2OTMgMzQuNTYxOUM1OC41NDQyIDM0LjU2MTkgNTkuNTAzIDM1LjYxNzEgNTkuNTI4OCAzNi45MjUyIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"              />            </div>          </div>        </td>      </tr>      <tr style="margin-left: 24px;">        <td style="width: 65%; padding-left: 24px;">          <h1            style="              font-family: 'Open Sans', sans-serif;              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Shortcodes for automation          </h1>          <h2            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            Use shortcodes for every automatized text and link you need          </h2>          <p            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Use shortcodes to set links between pages, define user names, email addresses, URLs,            training pieces, dates and many more properties          </p>        </td>        <td style="width: 35%; padding-right: 24px;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              margin-left: 96px;              width: 480px;              height: 270px;              margin-bottom: 30px;            "          >            <div              style="                height: 100%;                margin: 0 auto;                position: relative;                display: flex;                align-items: center;                justify-content: center;              "            >              <img                style="position: absolute; left: 80px;"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTExIiB2aWV3Qm94PSIwIDAgNzAgMTExIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY5LjI1ODMgOTguMDVMMjYuNTE2NyA1NS41TDY5LjI1ODMgMTIuOTVMNTYuMjUgMEwwLjUgNTUuNUw1Ni4yNSAxMTFMNjkuMjU4MyA5OC4wNVoiIGZpbGw9IiMwMEJDRDQiLz4KPC9zdmc+Cg=="                alt="drop-layout-logo"              />              <p                style="                  font-style: normal;                  font-weight: 600;                  font-size: 22px;                  line-height: 30px;                  color: #00bcd4;                  text-align: center;                  vertical-align: middle;                "              >                user_name              </p>              <img                style="position: absolute; right: 80px;"                alt="drop-layout-logo-cursor"                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTExIiB2aWV3Qm94PSIwIDAgNzAgMTExIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAuNSA5OC4wNUw0My4yNDE3IDU1LjVMMC41IDEyLjk1TDEzLjUwODMgMEw2OS4yNTgzIDU1LjVMMTMuNTA4MyAxMTFMMC41IDk4LjA1SDAuNVoiIGZpbGw9IiMwMEJDRDQiLz4KPC9zdmc+Cg=="              />            </div>          </div>        </td>      </tr>      <tr style="margin-left: 24px;">        <td style="width: 35%; padding-left: 24px;">          <div            style="              font-family: 'Open Sans', sans-serif;              background-color: #f1f8fe;              border-radius: 8px;              width: 480px;              height: 270px;              margin-bottom: 32px;            "          >            <div style="height: 100%; position: relative; padding: 45px 50px;">              <p                style="                  font-weight: 600;                  font-size: 20px;                  line-height: 24px;                  margin: 0;                  color: #383b41;                "              >                Login              </p>              <form type="POST" style="margin-bottom: 16px;">                <input                  style="                    display: block;                    margin-top: 16px;                    margin-bottom: 8px;                    background: #ffffff;                    border: 1px solid #dcdfe6;                    padding: 12px;                    width: 360px;                    box-sizing: border-box;                    border-radius: 8px;                  "                  placeholder="Username"                  name="username"                />                <input                  style="                    font-family: 'Open Sans', sans-serif;                    display: block;                    background: #ffffff;                    border: 1px solid #dcdfe6;                    padding: 12px;                    width: 360px;                    box-sizing: border-box;                    border-radius: 8px;                  "                  name="password"                  type="password"                  placeholder="Password"                />                <input                  type="submit"                  value="LOGIN"                  style="                    font-family: 'Open Sans', sans-serif;                    background: #fbf280;                    border-radius: 2px;                    padding: 6px 16px;                    font-weight: 600;                    font-size: 14px;                    line-height: 24px;                    color: #b6791d;                    margin-top: 16px;                  "                />              </form>            </div>          </div>        </td>        <td style="width: 65%; padding-right: 24px;">          <h1            style="              font-family: 'Open Sans', sans-serif;              font-style: normal;              font-weight: normal;              font-size: 34px;              line-height: 39px;              color: #383b41;            "          >            Create forms for realistic phishing simulations          </h1>          <h2            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              font-style: normal;              font-weight: 600;              font-size: 18px;              line-height: 25px;              color: #383b41;            "          >            Use input fields and submit buttons to see who takes the bait!          </h2>          <p            style="              font-family: 'Open Sans', sans-serif;              margin-top: 16px;              margin-bottom: 0;              font-style: normal;              font-weight: normal;              font-size: 14px;              line-height: 21px;            "          >            Drag and drop form elements, labels, placeholders and give them style          </p>        </td>      </tr>      <tr style="background: #f2f2f2; font-family: 'Open Sans', sans-serif;">        <td          style="            font-family: 'Open Sans', sans-serif;            font-style: normal;            font-weight: 600;            font-size: 18px;            line-height: 25px;            padding: 8px 0 8px 48px;          "        >          Copyright 2021 - Privacy Policy        </td>        <td style="padding: 8px 48px 8px 0; text-align: right;">          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM0NTYxOUQiLz4KPHBhdGggZD0iTTE4LjU0MTkgMy44Mzk4NEMxNC4yMDM3IDMuODM5ODQgMTIuNzcxOSA1LjgzMDI4IDEyLjc3MTkgOS4yNDM4NFYxMS45NDU4SDkuOTIxODhWMTYuMDAxOEgxMi43NzE5VjI4LjE1OThIMTguMDI3OVYxNi4wMDE4SDIxLjU5OTlMMjIuMDc5OSAxMS45NDU4SDE4LjAyNzlWOS41MzU4NEMxOC4wMjc5IDguNDQ2NTQgMTguMjY2OSA3Ljg5Mzg0IDE5Ljk1NzkgNy44OTM4NEgyMi4wNzk5VjMuODM5ODRIMTguNTQxOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="facebook-icon"            style="margin-right: 24px; margin-bottom: -2px;"          />          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM1NUFDRUUiLz4KPHBhdGggZD0iTTE5LjgzMjEgNy42NzcxNkMxNy41NjIgNy43MzQ2OSAxNS43NDA5IDkuNTkyNzcgMTUuNzQwOSAxMS44NzcyQzE1Ljc0MDkgMTIuMjA2IDE1Ljc3NjIgMTIuNTI3NSAxNS44NDgxIDEyLjgzNTZDMTIuMzU1OSAxMi42NjAxIDkuMjU5NzggMTAuOTg3NCA3LjE4NzMyIDguNDQ1MTZDNi44MjU2MiA5LjA2NTQ1IDYuNjE3NzIgOS43ODc5OSA2LjYxNzcyIDEwLjU1ODhDNi42MTc3MiAxMi4wMTYzIDcuMzYwNjQgMTMuMzAxNCA4LjQ4ODEyIDE0LjA1NDhDNy43OTk2NiAxNC4wMzI3IDcuMTUwNzcgMTMuODQzMSA2LjU4NDEyIDEzLjUyODRDNi41ODM4IDEzLjU0NTggNi41ODQxMiAxMy41NjQ5IDYuNTg0MTIgMTMuNTgyOEM2LjU4NDEyIDE1LjYxODIgOC4wMzI5NCAxNy4zMTQ1IDkuOTU1MzIgMTcuNzAxMkM5LjYwMjc3IDE3Ljc5NjggOS4yMzE0MyAxNy44NDg0IDguODQ4MTIgMTcuODQ4NEM4LjU3NzA2IDE3Ljg0ODQgOC4zMTQyMyAxNy44MjI2IDguMDU3NzIgMTcuNzczMkM4LjU5Mjc3IDE5LjQ0MjQgMTAuMTQyNSAyMC42NTc5IDExLjk4MDkgMjAuNjkxNkMxMC41NDI5IDIxLjgxODYgOC43MzM4NiAyMi40OSA2Ljc2NDkyIDIyLjQ5QzYuNDI2MDkgMjIuNDkgNi4wOTA1NyAyMi40NzE0IDUuNzYxNzIgMjIuNDMyNEM3LjYyMTczIDIzLjYyNTEgOS44MjkxIDI0LjMyMDQgMTIuMjAxNyAyNC4zMjA0QzE5LjkzMDcgMjQuMzIwNCAyNC4xNTY5IDE3LjkxNzggMjQuMTU2OSAxMi4zNjUyQzI0LjE1NjkgMTIuMTgzMSAyNC4xNTM2IDEyIDI0LjE0NTcgMTEuODE5NkMyNC45NjY0IDExLjIyODQgMjUuNjc4OCAxMC40ODc5IDI2LjI0MTcgOS42NDUxNkMyNS40ODg4IDkuOTc5ODMgMjQuNjc5MSAxMC4yMDY1IDIzLjgyODkgMTAuMzA3NkMyNC42OTcgOS43ODc4OSAyNS4zNjMgOC45NjQ3NCAyNS42NzY5IDcuOTgyNzZDMjQuODY1IDguNDY0NjEgMjMuOTY1NiA4LjgxNDgyIDIzLjAwODEgOS4wMDM1NkMyMi4yNDE5IDguMTg3MDUgMjEuMTQ5NSA3LjY3NzE2IDE5Ljk0MDkgNy42NzcxNkMxOS45MDQ3IDcuNjc3MTYgMTkuODY4MiA3LjY3NjI1IDE5LjgzMjEgNy42NzcxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="twitter-icon"            style="margin-right: 24px; margin-bottom: -2px;"          />          <img            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiMyQTVCODMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjY0NTc5IDUuNzc3NDNDNy42ODg5OSA1Ljc3MjYyIDcuNzMyMzQgNS43Njc3OSA3Ljc3NjAzIDUuNzU5NzdIMjQuMjI3NEMyNC4yNDI5IDUuNzYyNDggMjQuMjU2NSA1Ljc2NTUzIDI0LjI2OTkgNS43Njg1MUMyNC4yODk2IDUuNzcyOTIgMjQuMzA4NiA1Ljc3NzE4IDI0LjMzMTggNS43Nzk5OEMyNS4yNjExIDUuOTA3NTYgMjYuMDE5NyA2LjYyNTQ0IDI2LjE5OTYgNy41NDMzNUMyNi4yMTQyIDcuNjIwNzQgMjYuMjI0NSA3LjY4NjY1IDI2LjIzNjIgNy43NjA5OEwyNi4yMzYyIDcuNzYxMTlMMjYuMjM2MyA3Ljc2MTMxTDI2LjI0MTcgNy43OTU5OFYyNC4yMDM2QzI2LjIzNTggMjQuMjQwMyAyNi4yMzA1IDI0LjI3NjggMjYuMjI1MiAyNC4zMTMzQzI2LjIxNzQgMjQuMzY3NCAyNi4yMDk2IDI0LjQyMTQgMjYuMTk5NiAyNC40NzY0QzI2LjAzNTggMjUuMzE3OCAyNS4zNTcxIDI2LjAxOTcgMjQuNTIwNSAyNi4xOTc3QzI0LjQ1OTcgMjYuMjEwOCAyNC4zOTk4IDI2LjIxNyAyNC4zMzk1IDI2LjIyMzJMMjQuMzM5NCAyNi4yMjMyTDI0LjMzOTQgMjYuMjIzMkMyNC4yOTUxIDI2LjIyNzggMjQuMjUwNyAyNi4yMzI0IDI0LjIwNTUgMjYuMjM5OEg3Ljc5NzkzQzcuNzc3NzUgMjYuMjM3IDcuNzU4NDIgMjYuMjMzNiA3LjczOTIyIDI2LjIzMDJMNy43MzkwOSAyNi4yMzAyQzcuNzE2OCAyNi4yMjYzIDcuNjk0NjggMjYuMjIyNCA3LjY3MTYxIDI2LjIxOTZDNi43Njk4MiAyNi4xMDM0IDYuMDI0ODEgMjUuNDI4MSA1LjgyNDAzIDI0LjU0MDRDNS44MDA1MyAyNC40MzcgNS43ODA1MiAyNC4zMjg5IDUuNzYxNzIgMjQuMjI1NFY3Ljc3NDA4QzUuNzY0NTUgNy43NTYxNSA1Ljc2Nzk5IDcuNzQwNTEgNS43NzEzOSA3LjcyNUM1Ljc3NTI2IDcuNzA3NDEgNS43NzkwOCA3LjY5MDAxIDUuNzgxOTMgNy42Njk2NkM1LjkxMTUyIDYuNzQ5NzQgNi41NzUxNSA2LjAwODY5IDcuNDgyOTggNS44MDE4N0M3LjUzNzI1IDUuNzg5NTIgNy41OTE0IDUuNzgzNDkgNy42NDU3OSA1Ljc3NzQzWk0yMi41NTM5IDcuNDE2ODdIMjIuNTUzOEgyMi41NTM2QzIyLjEyNTUgNy40MTY3MiAyMS42OTgxIDcuNDE2NTYgMjEuMjY4MiA3LjQxNzAzQzIwLjgwNjMgNy40MTc3IDIwLjQyOTUgNy43OTM0NiAyMC40Mjk1IDguMjU3NDVDMjAuNDI5MyA4LjQzMzU3IDIwLjQyODkgOC42MTAxOCAyMC40Mjg0IDguNzg2OTlWOC43ODczMVY4Ljc4NzMzQzIwLjQyNzMgOS4yNTQxOCAyMC40MjYxIDkuNzIyNTMgMjAuNDI5NSAxMC4xODc2QzIwLjQzMDEgMTAuMjc2NSAyMC40NTcxIDEwLjM1NyAyMC40ODUxIDEwLjQ0MDRMMjAuNDkxOCAxMC40NjA0QzIwLjYwOCAxMC44MDE1IDIwLjkwNzQgMTEuMDI0MyAyMS4yOTAxIDExLjAyNjNDMjEuNDQ1NiAxMS4wMjYzIDIxLjYwMzcgMTEuMDIxMiAyMS43NjE3IDExLjAxNjJDMjEuOTE5OCAxMS4wMTExIDIyLjA3NzkgMTEuMDA2MSAyMi4yMzMzIDExLjAwNjFDMjIuMzQ1OCAxMS4wMDYxIDIyLjQ1NzcgMTEuMDA3IDIyLjU2OTUgMTEuMDA3OUgyMi41Njk1SDIyLjU2OTZDMjIuNzkyOCAxMS4wMDk3IDIzLjAxNTQgMTEuMDExNCAyMy4yNDA1IDExLjAwNjFDMjMuNjc0MiAxMC45OTUzIDI0LjAxNjkgMTAuNjIyIDI0LjAxNjkgMTAuMTg3NlY4LjI1NzQ1QzI0LjAxNjkgNy43OTM0NiAyMy42NjEgNy40MTc3MyAyMy4xOTgzIDcuNDE3MDNMMjIuNTUzOSA3LjQxNjg3Wk0xNi4wMDE3IDExLjg0NDhDMTguMzI2NCAxMS44NDM1IDIwLjIwNyAxMy43NjA3IDIwLjE1NjcgMTYuMDg0QzIwLjEwNzYgMTguMzM4MSAxOC4yMTY2IDIwLjIwNDQgMTUuODk3MyAyMC4xNTQ3QzEzLjY2OCAyMC4xMDcgMTEuODEzOSAxOC4yNjA4IDExLjg0NjggMTUuOTM3NUMxMS44NzgzIDEzLjY3NTkgMTMuNzI5NCAxMS44NDM1IDE2LjAwMTcgMTEuODQ0OFpNOS45MTY2NyAxNC4wNjk3SDcuOTY0NjdWMTQuMTExOEM3Ljk2NDY3IDE1LjEyMTkgNy45NjQ1OSAxNi4xMzMzIDcuOTY0NTEgMTcuMTQ1MkM3Ljk2NDM2IDE5LjE3MDEgNy45NjQyIDIxLjE5NjcgNy45NjQ2NyAyMy4yMTgzQzcuOTY0NjcgMjMuNjU0MSA4LjM0NjczIDI0LjAxNDkgOC43ODMxOSAyNC4wMTQ5QzEzLjU5MSAyNC4wMTU2IDE4LjQxMjUgMjQuMDE1NiAyMy4yMjAyIDI0LjAxNDlDMjMuNjYwNyAyNC4wMTQ5IDI0LjAxNjkgMjMuNjU4MSAyNC4wMTY5IDIzLjIxODNDMjQuMDE3MyAyMS4xOTk2IDI0LjAxNzIgMTkuMTc5MiAyNC4wMTcgMTcuMTU5NkMyNC4wMTcgMTYuMTUwMSAyNC4wMTY5IDE1LjE0MDggMjQuMDE2OSAxNC4xMzJWMTQuMDY5N0gyMi4wNjY2QzIyLjM0MjUgMTQuOTUyIDIyLjQyNTYgMTUuODQwOCAyMi4zMTc1IDE2Ljc1NkMyMi4yMDk0IDE3LjY3MTIgMjEuOTE2OCAxOC41MjkgMjEuNDM2NyAxOS4zMTZDMjAuOTU2NiAyMC4xMDI5IDIwLjMzMSAyMC43NDcyIDE5LjU2ODkgMjEuMjY2M0MxNy41OTIxIDIyLjYxMzMgMTQuOTk0NCAyMi43Mzg4IDEyLjg5NiAyMS41NjFDMTEuODM1OCAyMC45NjY4IDExLjAwMTcgMjAuMTMzIDEwLjQyMDIgMTkuMDYzM0M5LjU1NDcxIDE3LjQ2OTkgOS40MDkwMyAxNS44MDYxIDkuOTE2NjcgMTQuMDY5N1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="            alt="instagram-icon"            style="margin-bottom: -2px;"          />        </td>      </tr>    </tbody>  </table>`
      })
      this.tab = this.formValues.landingPages.length === 1 ? 'page1' : 'page2'
    },
    getAndUpdateFirstIndexForPageText() {
      let newPageText
      if (this.formValues.landingPages.length === 1) {
        const firstPageText = parseInt(this.formValues.landingPages[0].name.split(' ')[1])
        if (firstPageText === 2) {
          this.formValues.landingPages[0].name = 'landing-page'
        }
        newPageText = this.formValues.landingPages.length + 1
      }
      return newPageText
    },
    getNewIndexForPageText() {
      const defaultIndex = this.formValues.landingPages.length + 1
      let newPageIndex =
        this.editedLandingPages.length === 2
          ? parseInt(this.editedLandingPages[1].name.split(' ')[1]) + 1
          : defaultIndex
      const firstPageIndex = parseInt(this?.formValues?.landingPages[0].name.split(' ')[1])
      if (isNaN(firstPageIndex)) return newPageIndex
      if (firstPageIndex === newPageIndex) newPageIndex += 1
      if (firstPageIndex > newPageIndex) newPageIndex = firstPageIndex + 1
      return newPageIndex
    },
    handleDeleteLandingPage(index) {
      this.formValues.landingPages.splice(index, 1)
      if (index === 1 || index === 0) {
        this.tab = 'page1'
        this.formValues.landingPages[0].order = 1
      }
      setTimeout(() => (this.isPageAddMenuOpen[index] = false), 100)
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
          return that.$store.dispatch('common/createSnackBar', {
            message: `Empty file`,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        let newPageText
        if (that.isEdit) newPageText = that.getNewIndexForPageText()
        else newPageText = that.getAndUpdateFirstIndexForPageText()
        that.formValues.landingPages.push({
          name: `Page ${newPageText}`,
          order: 2,
          prompt: '',
          content: result
        })
        that.tab = 'page2'
      }
      reader.readAsText(file)
    },
    setAttachmentFile(file) {
      this.formValues.attachmentFiles = file
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    changeNewEmailTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeNewEmailTemplateModalStatus', false)
      }
      if (!this.showLeavingDialog) return this.$emit('changeNewEmailTemplateModalStatus', false)
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewEmailTemplateModalStatus', false)
        }
      })
    },
    nextStep() {
      let isValid = true
      if (this.$refs.refMakeAvailableFor) {
        this.$refs.refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = this.$refs.refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.refFormStep1.validate() && isValid) {
        this.step += 1
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    },
    backStep() {
      this.step -= 1
    },
    submit() {
      this.isSubmitDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      if (
        this.$refs.refEmailTemplateContent.validate() &&
        isValid &&
        this.formValues.languageTypeResourceId
      ) {
        const formValues = {
          ...this.formValues.phishingLink,
          ...this.formValues
        }
        delete formValues.phishingLink
        const payload = {
          ...formValues,
          isAssistedByAI: this.isAssistedByAI,
          availableForRequests: this.$refs.refMakeAvailableFor.getAvailableForValues(
            this.availableForRequests
          )
        }
        if (this.isEdit && !this.isDuplicate) {
          updateLandingPage(payload, this.emailTemplateId)
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        } else {
          createLandingPage(payload)
            .then((response) => {
              this.$emit(
                'changeNewEmailTemplateModalStatus',
                false,
                true,
                response?.data?.data?.resourceId
              )
            })
            .finally(() => {
              this.isSubmitDisabled = false
            })
        }
      } else {
        const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
        this.isSubmitDisabled = false
      }
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.name,
            value: language.resourceId
          })) || []
      })
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
    }
  },
  computed: {
    ...mapGetters({
      emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl',
      getCurrentCompany: 'login/getCurrentCompany'
    }),
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
    getTitle() {
      if (!this.isEdit) return 'New Landing Page Template'
      return this.isDuplicate ? 'Duplicate Landing Page Template' : 'Edit Landing Page Template'
    },
    isRenderMakeAvailableFor() {
      if (this.editItemsDisabled) {
        return false
      }
      if (this.$store.state.auth.userRoleName === 'CompanyAdmin') {
        return !!this.selectedItem
      }
      return true
    },
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    },
    getSelectedMethod() {
      return this.landingPageData.methodTypes?.find(
        (item) => item.value === this.formValues.methodTypeId
      )?.text
    }
  },
  created() {
    if (this.isDuplicate) {
      this.footerButtonsIds = {
        cancelButton: 'btn-duplicate-cancel--landing-page-templates-modal',
        backButton: 'btn-duplicate-back--landing-page-templates-modal',
        nextButton: 'btn-duplicate-next--landing-page-templates-modal',
        saveButton: 'btn-duplicate-save--landing-page-templates-modal'
      }
    }
    if (!this.isEdit)
      this.formValues.methodTypeId = this.landingPageData.methodTypes[0]?.value || ''
    if (this.landingPageData && this.selectedMethodText)
      this.formValues.methodTypeId = this.selectedMethodText.startsWith('Click') ? '1' : '2'
    this.formValues.difficultyTypeId = '1'
    this.callForMergedTags()
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      getLandingPageTemplate(this.emailTemplateId).then((response) => {
        const { data: { data = {} } = {} } = response || {}
        const phishingLink = {
          subDomain: data.subDomain,
          urlSchemaTypeId: data.urlSchemaTypeId.toString(),
          pathTypeId: data.pathTypeId.toString(),
          extensionTypeId: data.extensionTypeId.toString(),
          parameterTypeId: data.parameterTypeId.toString(),
          domainRecordId: data.domainRecordId.toString()
        }
        this.isAssistedByAI = data.isAssistedByAI
        this.aiAssistant = this.isAssistedByAI || false
        delete data.urlSchemaTypeId
        delete data.pathTypeId
        delete data.extensionTypeId
        delete data.parameterTypeId
        delete data.domainRecordId
        delete data.subDomain
        delete data.isAssistedByAI
        this.editedLandingPages = JSON.parse(JSON.stringify(data.landingPages))
        this.formValues = data
        this.$set(this.formValues, 'phishingLink', phishingLink)
        this?.$refs?.refInputPhishingLink?.checkSchemaTypes(phishingLink.domainRecordId, true)
        this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
        this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
        this.formValues.name = `${this.formValues.name}`
        const findedDomain = this.landingPageData?.domainRecords?.find(
          (domain) => domain.value === phishingLink?.domainRecordId?.toString()
        )
        this.isInvisibleCaptchaDisabled = findedDomain ? !findedDomain?.extraDatas[1]?.value : false
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        this.availableForRequests = getAvailableForValueFromList(
          response?.data?.data?.availableForList
        )
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
    if (!(this.isEdit || this.isDuplicate)) {
      this.formValues.languageTypeResourceId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || '862249c19aad'
    }
  }
}
</script>
