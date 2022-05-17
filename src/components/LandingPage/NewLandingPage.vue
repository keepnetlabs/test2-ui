<template>
  <app-modal
    v-if="status"
    icon-name="mdi-file"
    :status="status"
    :title="
      !isEdit
        ? 'New Landing Page Template'
        : isDuplicate
        ? 'Duplicate Landing Page Template'
        : 'Edit Landing Page Template'
    "
  >
    <template v-slot:overlay-body>
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
                    v-model.trim="formValues.name"
                    v-bind="commonRules"
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
                    id="input--new-email-templates-description"
                    outlined
                    dense
                    rows="2"
                    no-resize
                    placeholder="Description"
                    height="100"
                    v-model.trim="formValues.description"
                    persistent-hint
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
                <form-group
                  has-hint
                  title="Method"
                  sub-title="Select the phishing technique for this template"
                >
                  <v-select
                    :items="landingPageData.methodTypes"
                    item-disabled="disabled"
                    item-text="text"
                    v-model="formValues.methodTypeId"
                    item-value="value"
                    outlined
                    v-bind="commonRules"
                    hint="*Required"
                    required
                    persistent-hint
                    :menu-props="{ offsetY: true }"
                  >
                    <template #item="{ item }">
                      <div :class="['mail-configuration-select-sources__item-container']">
                        <div class="mail-configuration-select-sources__item">
                          <div class="mail-configuration-select-sources__item-left">
                            {{ item.text }}
                          </div>
                          <div class="mail-configuration-select-sources__item-right-platform">
                            {{
                              item.text === 'Click-Only'
                                ? 'See who falls for phishing links'
                                : item.text === 'Data Submission'
                                ? 'Gather information from users'
                                : 'Send a trackable file '
                            }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-select>
                </form-group>
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
                  <k-select
                    type="combobox"
                    :id="`input--action-tags`"
                    v-model="formValues.tags"
                    :items="[]"
                    chips
                    deletable-chips
                    outlined
                    class="hide-caret"
                    multiple
                    dense
                    persistent-hint
                    small-chips
                    :return-object="false"
                    @input="handleTagItemChange"
                    placeholder="Enter tags and press enter key"
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
                  :disabled="!showMakeAvailableFor"
                  :subTitle="'Select companies that should see this landing page template in their libraries'"
                  :placeholder="'Select companies or company groups'"
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
                    <form-group
                      title="Phishing Link"
                      class-name="email-template mt-2 p-4"
                      sub-title="Create a phishing link for users to click and be directed to the landing page"
                    >
                      <div class="d-flex" style="max-width: 980px;">
                        <v-select
                          v-model="formValues.urlSchemaTypeId"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="same-width"
                          style="max-width: 102px;"
                          placeholder="Select URL schema"
                          :menu-props="{ offsetY: true }"
                          :items="landingPageData.urlSchemaTypes"
                          @change="changeDisabledLabel"
                        ></v-select>
                        <v-text-field
                          v-model.trim="formValues.subDomain"
                          required
                          placeholder="Enter subdomain"
                          hint="*Required"
                          outlined
                          dense
                          persistent-hint
                          class="same-width"
                          :rules="[(v) => validations.required(v, labels.Required)]"
                          @input="changeDisabledLabel"
                        />
                        <v-select
                          v-model="formValues.domainRecordId"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          label="Domain"
                          class="same-width"
                          placeholder="Select domain record"
                          required
                          :menu-props="{ offsetY: true }"
                          :items="landingPageData.domainRecords"
                          :rules="[(v) => validations.required(v, labels.Required)]"
                          @change="handleChangeDomainRecord"
                        ></v-select>
                        <v-select
                          v-model="formValues.pathTypeId"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="same-width"
                          placeholder="Select path type"
                          :items="landingPageData.pathTypes"
                          :menu-props="{ offsetY: true }"
                          @input="changeDisabledLabel"
                        ></v-select>
                        <v-select
                          v-model="formValues.extensionTypeId"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="same-width"
                          placeholder="Select extension type"
                          :items="landingPageData.extensionTypes"
                          :menu-props="{ offsetY: true }"
                          @input="changeDisabledLabel"
                        ></v-select>
                        <v-select
                          v-model="formValues.parameterTypeId"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          outlined
                          persistent-hint
                          label="Parameter"
                          class="same-width"
                          placeholder="Select Parameter"
                          :items="landingPageData.parameterTypes"
                          :menu-props="{ offsetY: true }"
                          @change="changeDisabledLabel"
                        ></v-select>
                      </div>
                      <div style="max-width: 980px;">
                        <v-text-field
                          outlined
                          dense
                          persistent-hint
                          v-model="disabledLabel"
                          disabled
                          label="Your link is"
                        />
                      </div>
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
                              :style="formValues.landingPages.length > 1 && { width: '68px' }"
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
                          <email-template
                            ref="refEmailTemplate"
                            template-type="landing"
                            :active-block-manager-components="activeBlockManagerComponents"
                            :edit-items-disabled="editItemsDisabled"
                            :template.sync="page.content"
                            :is-edit="!!isEdit"
                            :is-phishing-template="true"
                            :onlyGrapes="true"
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
                        </el-tab-pane>
                      </el-tabs>
                    </form-group>
                  </v-form>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template v-slot:overlay-footer>
      <v-btn
        @click="changeNewEmailTemplateModalStatus"
        class="new-email-template__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="new-email-template__right-col">
        <v-btn
          @click="backStep(-1)"
          class="new-email-template__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>
        <v-btn
          @click="nextStep(+1)"
          class="new-email-template__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step < 2"
        >
          {{ labels.Next }}
        </v-btn>
        <v-btn
          @click="submit"
          class="new-email-template__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step === 2"
          :disabled="isSubmitDisabled"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import AppModal from '../AppModal'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputSelectLanguage from '@/components/Common/Inputs/InputSelectLanguage'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { getMergedTextForPhishing } from '@/api/phishingsimulator'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'
import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'
import passwordURL from '@/components/GrapesJs/Newsletter/mergedTexts/passwordURL'
import postDate from '@/components/GrapesJs/Newsletter/mergedTexts/postDate'
import shareUserName from '@/components/GrapesJs/Newsletter/mergedTexts/shareUserName'
import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'
import communityName from '@/components/GrapesJs/Newsletter/mergedTexts/communityName'
import communityDescription from '@/components/GrapesJs/Newsletter/mergedTexts/communityDescription'
import postTitle from '@/components/GrapesJs/Newsletter/mergedTexts/postTitle'
import postDesc from '@/components/GrapesJs/Newsletter/mergedTexts/postDesc'
import postUserName from '@/components/GrapesJs/Newsletter/mergedTexts/postUserName'
import postCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/postCompanyName'
import webUrl from '@/components/GrapesJs/Newsletter/mergedTexts/webUrl'
import postUrl from '@/components/GrapesJs/Newsletter/mergedTexts/postUrl'
import currentDate from '@/components/GrapesJs/Newsletter/mergedTexts/currentDate'
import description from '@/components/GrapesJs/Newsletter/mergedTexts/description'
import shareCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/shareCompanyName'
import link from '@/components/GrapesJs/Newsletter/mergedTexts/link'
import communityTitle from '@/components/GrapesJs/Newsletter/mergedTexts/communityTitle'
import communityUser from '@/components/GrapesJs/Newsletter/mergedTexts/communityUser'
import category from '@/components/GrapesJs/Newsletter/mergedTexts/category'
import communityDesc from '@/components/GrapesJs/Newsletter/mergedTexts/communityDesc'
import status from '@/components/GrapesJs/Newsletter/mergedTexts/status'
import activeUsers from '@/components/GrapesJs/Newsletter/mergedTexts/activeUsers'
import analysedEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysedEmail'
import foundEmailCount from '@/components/GrapesJs/Newsletter/mergedTexts/foundEmailCount'
import startedBy from '@/components/GrapesJs/Newsletter/mergedTexts/startedBy'
import startDate from '@/components/GrapesJs/Newsletter/mergedTexts/startDate'
import investigationName from '@/components/GrapesJs/Newsletter/mergedTexts/investigationName'
import invitedUserName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedUserName'
import invitedByCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedByCompanyName'
import communityUrl from '@/components/GrapesJs/Newsletter/mergedTexts/communityUrl'
import memberCount from '@/components/GrapesJs/Newsletter/mergedTexts/memberCount'
import communityIndustry from '@/components/GrapesJs/Newsletter/mergedTexts/communityIndustry'
import analysisEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysisEmail'
import owner from '@/components/GrapesJs/Newsletter/mergedTexts/owner'
import date from '@/components/GrapesJs/Newsletter/mergedTexts/date'
import reportBy from '@/components/GrapesJs/Newsletter/mergedTexts/reportBy'
import fromText from '@/components/GrapesJs/Newsletter/mergedTexts/from'
import to from '@/components/GrapesJs/Newsletter/mergedTexts/to'
import subject from '@/components/GrapesJs/Newsletter/mergedTexts/subject'
import attachment from '@/components/GrapesJs/Newsletter/mergedTexts/attachment'
import createDate from '@/components/GrapesJs/Newsletter/mergedTexts/createDate'
import senderIP from '@/components/GrapesJs/Newsletter/mergedTexts/senderIP'
import caseID from '@/components/GrapesJs/Newsletter/mergedTexts/caseID'
import userEmail from '@/components/GrapesJs/Newsletter/mergedTexts/userEmail'
import userAgent from '@/components/GrapesJs/Newsletter/mergedTexts/userAgent'
import actionDate from '@/components/GrapesJs/Newsletter/mergedTexts/actionDate'
import actionIP from '@/components/GrapesJs/Newsletter/mergedTexts/actionIP'
import productName from '@/components/GrapesJs/Newsletter/mergedTexts/productName'
import analysisDetailUrl from '@/components/GrapesJs/Newsletter/mergedTexts/analysisDetailUrl'
import investigationUrl from '@/components/GrapesJs/Newsletter/mergedTexts/investigationUrl'
import companyLogo from '@/components/GrapesJs/Newsletter/mergedTexts/companyLogo'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import dateEmailSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateEmailSent'
import emailMergedText from '@/components/GrapesJs/Newsletter/mergedTexts/emailMergedText'
import firstName from '@/components/GrapesJs/Newsletter/mergedTexts/firstName'
import fromEmail from '@/components/GrapesJs/Newsletter/mergedTexts/fromEmail'
import fromName from '@/components/GrapesJs/Newsletter/mergedTexts/fromName'
import lastName from '@/components/GrapesJs/Newsletter/mergedTexts/lastName'
import phishingUrl from '@/components/GrapesJs/Newsletter/mergedTexts/phishingUrl'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import { createLandingPage, getLandingPageTemplate, updateLandingPage } from '@/api/landingPage'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'NewEmailTemplates',
  components: {
    KSelect,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate,
    InputSelectLanguage
  },
  data() {
    return {
      languageOptions: [],
      disabledLabel: null,
      tab: 'page1',
      isSubmitDisabled: false,
      activeBlockManagerComponents: {},
      blockManagerComponents: {},
      nonEditableAvailableForRequests: [],
      labels,
      step: 1,
      Validations: Validations,
      validations: Validations,
      availableForRequests: [],
      initialFormValues: {},
      formValues: {
        name: null,
        description: null,
        methodTypeId: null,
        difficultyTypeId: null,
        urlSchemaTypeId: null,
        subDomain: null,
        domainRecordId: null,
        pathTypeId: null,
        extensionTypeId: null,
        parameterTypeId: null,
        tags: [],
        landingPages: [{ name: 'landing-page', content: '', order: 1 }],
        languageTypeResourceId: '862249c19aad'
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      editItemsDisabled: false,
      methodItems: [
        {
          resourceId: 'WNZt0sCVCWB3',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Click Only',
          code: '1',
          description: null,
          orderNumber: 1
        },
        {
          resourceId: 'DYC0gugxJMjT',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Data Submission',
          code: '2',
          description: null,
          orderNumber: 2
        },
        {
          resourceId: '7dLrW2kdBTDs',
          genericCodeTypeId: 19,
          genericCodeTypeName: 'Phishing Simulator Categories',
          name: 'Attachment',
          code: '3',
          description: null,
          orderNumber: 3
        }
      ],
      difficultyItems: [
        {
          resourceId: 'mT0CeYGgKsVb',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Easy',
          code: '1',
          description: null,
          orderNumber: 1
        },
        {
          resourceId: 'Z5XeVlpw6Dps',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Medium',
          code: '2',
          description: null,
          orderNumber: 2
        },
        {
          resourceId: 'c4LCGEB9MayB',
          genericCodeTypeId: 20,
          genericCodeTypeName: 'Phishing Simulator Difficulties',
          name: 'Hard',
          code: '3',
          description: null,
          orderNumber: 3
        }
      ]
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    editableFormValues: {
      required: false
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    emailTemplateId: {
      type: String
    },
    landingPageData: {
      retuired: false
    }
  },
  methods: {
    handleAddBlankPage() {
      this.formValues.landingPages.push({
        name: `Page ${this.formValues.landingPages.length + 1}`,
        order: 2,
        content: '<html><head></head><body></body></html>'
      })
      this.tab = this.formValues.landingPages.length === 1 ? 'page1' : 'page2'
    },
    handleDeleteLandingPage(index) {
      this.formValues.landingPages.splice(index, 1)
      if (index === 1 || index === 0) {
        this.tab = 'page1'
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
        that.formValues.landingPages.push({
          name: `Page 2`,
          order: 2,
          content: result
        })
        that.tab = 'page2'
      }
      reader.readAsText(file)
    },
    handleChangeDomainRecord(value) {
      const domainRecord = this.landingPageData.domainRecords.find((item) => item.value === value)
      this.landingPageData.urlSchemaTypes = this.landingPageData.urlSchemaTypes.map((schema) => {
        const activeVal = domainRecord?.extraDatas[0]?.value
        if (activeVal === '3') {
          schema.disabled = false
        } else {
          schema.disabled = !(domainRecord?.extraDatas[0]?.value === schema.value)
        }
        return schema
      })
      this.formValues.urlSchemaTypeId =
        domainRecord?.extraDatas[0]?.text === 'Both' ? '2' : domainRecord?.extraDatas[0]?.value
      this.changeDisabledLabel()
    },
    changeDisabledLabel() {
      this.disabledLabel = `${
        this.landingPageData.urlSchemaTypes.find(
          (item) => item.value === this.formValues.urlSchemaTypeId?.toString() || ''
        )?.text
      }${this.formValues.subDomain || 'subDomain'}.${
        this.landingPageData.domainRecords.find(
          (item) => item.value === this.formValues.domainRecordId?.toString() || ''
        )?.text || 'noDomain'
      }/${
        this.landingPageData.pathTypes.find(
          (item) => item.value === this.formValues.pathTypeId?.toString() || ''
        )?.text || 'noPath'
      }${
        this.landingPageData.extensionTypes.find(
          (item) => item.value === this.formValues.extensionTypeId?.toString() || ''
        )?.text || 'noExtension'
      }?${
        this.landingPageData.parameterTypes.find(
          (item) => item.value === this.formValues.parameterTypeId?.toString() || ''
        )?.text
      }=${(Math.random() * 10 + 1).toString().replace('.', '')}`
    },
    setAttachmentFile(file) {
      this.formValues.attachmentFiles = file
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    handleTagItemChange() {},
    changeNewEmailTemplateModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('changeNewEmailTemplateModalStatus', false)
      }
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
      if (this.$refs.refEmailTemplateContent.validate() && isValid) {
        let payload = {
          ...this.formValues,
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
            .then(() => {
              this.$emit('changeNewEmailTemplateModalStatus', false, true)
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
          response?.map((language) => ({ text: language.name, value: language.resourceId })) || []
      })
    },
    callForMergedTags() {
      getMergedTextForPhishing().then((response) => {
        this.blockManagerComponents = response.data.data['mergeTags']
        this.setActiveBlockManagerComponents(this.blockManagerComponents)
      })
    },
    getTagsComponent(item) {
      switch (item) {
        case '{FULLNAME}':
          return fullName
        case '{USERNAME}':
          return userName
        case '{PASSWORDURL}':
          return passwordURL
        case '{POSTDATE}':
          return postDate
        case '{SHAREUSERNAME}':
          return shareUserName
        case '{COMPANYNAME}':
          return companyName
        case '{COMMUNITYNAME}':
          return communityName
        case '{COMMUNITYDESCRIPTION}':
          return communityDescription
        case '{POSTTITLE}':
          return postTitle
        case '{POSTDESC}':
          return postDesc
        case '{POSTUSERNAME}':
          return postUserName
        case '{POSTCOMPANYNAME}':
          return postCompanyName
        case '{WEBURL}':
          return webUrl
        case '{POSTURL}':
          return postUrl
        case '{CURRENTDATE}':
          return currentDate
        case '{DESCRIPTION}':
          return description
        case '{SHARECOMPANYNAME}':
          return shareCompanyName
        case '{LINK}':
          return link
        case '{COMMUNITYTITLE}':
          return communityTitle
        case '{COMMUNITYUSER}':
          return communityUser
        case '{CATEGORY}':
          return category
        case '{COMMUNITYDESC}':
          return communityDesc
        case '{STATUS}':
          return status
        case '{ACTIVEUSERS}':
          return activeUsers
        case '{ANALYSEDEMAIL}':
          return analysedEmail
        case '{FOUNDEMAILCOUNT}':
          return foundEmailCount
        case '{STARTEDBY}':
          return startedBy
        case '{STARTDATE}':
          return startDate
        case '{INVESTIGATIONNAME}':
          return investigationName
        case '{INVITEDUSERNAME}':
          return invitedUserName
        case '{INVITEDBYCOMPANYNAME}':
          return invitedByCompanyName
        case '{COMMUNITYURL}':
          return communityUrl
        case '{MEMBERCOUNT}':
          return memberCount
        case '{COMMUNITYINDUSTRY}':
          return communityIndustry
        case '{ANALYSISEMAIL}':
          return analysisEmail
        case '{OWNER}':
          return owner
        case '{DATE}':
          return date
        case '{REPORTBY}':
          return reportBy
        case '{FROM}':
          return fromText
        case '{TO}':
          return to
        case '{SUBJECT}':
          return subject
        case '{ATTACHMENT}':
          return attachment
        case '{CREATEDATE}':
          return createDate
        case '{SENDERIP}':
          return senderIP
        case '{CASEID}':
          return caseID
        case '{USEREMAIL}':
          return userEmail
        case '{USERAGENT}':
          return userAgent
        case '{ACTIONDATE}':
          return actionDate
        case '{ACTIONIP}':
          return actionIP
        case '{PRODUCTNAME}':
          return productName
        case '{ANALYSISDETAILURL}':
          return analysisDetailUrl
        case '{INVESTIGATIONURL}':
          return investigationUrl
        case '{COMPANYLOGO}':
          return companyLogo
        case '{DATEMAILSENT}':
          return dateEmailSent
        case '{EMAIL}':
          return emailMergedText
        case '{FIRSTNAME}':
          return firstName
        case '{FROMEMAIL}':
          return fromEmail
        case '{FROMNAME}':
          return fromName
        case '{LASTNAME}':
          return lastName
        case '{PHISHINGURL}':
          return phishingUrl
        default:
          break
      }
    },
    setActiveBlockManagerComponents(activeComponent = []) {
      this.activeBlockManagerComponents = activeComponent.reduce((acc, item) => {
        acc[item] = this.getTagsComponent(item)
        return acc
      }, {})
    }
  },
  computed: {
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
    }
  },
  mounted() {
    this.$watch(
      (vm) => [
        vm.formValues.urlSchemaTypeId,
        vm.formValues.domainRecordId,
        vm.formValues.parameterTypeId
      ],
      () => {
        this.disabledLabel = `${
          this.landingPageData.urlSchemaTypes.find(
            (item) => item.value == this.formValues.urlSchemaTypeId?.toString() || ''
          )?.text
        }${this.formValues.subDomain || 'subDomain'}.${
          this.landingPageData.domainRecords.find(
            (item) => item.value == this.formValues.domainRecordId.toString()
          )?.text || 'noDomain'
        }/${
          this.landingPageData.pathTypes.find(
            (item) => item.value == this.formValues.pathTypeId.toString()
          )?.text || 'noPath'
        }${
          this.landingPageData.extensionTypes.find(
            (item) => item.value == this.formValues.extensionTypeId.toString()
          )?.text || 'noExtension'
        }?${
          this.landingPageData.parameterTypes.find(
            (item) => item.value == this.formValues.parameterTypeId.toString()
          ).text
        }=${(Math.random() * 10 + 1).toString().replace('.', '')}`
      },
      {
        immediate: true, // run immediately
        deep: true // detects changes inside objects. not needed here, but maybe in other cases
      }
    )
  },
  created() {
    this.formValues.urlSchemaTypeId = this.landingPageData.urlSchemaTypes[0]?.value || ''
    this.formValues.domainRecordId = this.landingPageData.domainRecords[0]?.value || ''
    this.formValues.pathTypeId = this.landingPageData.pathTypes[0]?.value || ''
    this.formValues.extensionTypeId = this.landingPageData.extensionTypes[0]?.value || ''
    this.formValues.parameterTypeId = this.landingPageData.parameterTypes[0]?.value || ''
    if (!this.isEdit)
      this.formValues.methodTypeId = this.landingPageData.methodTypes[0]?.value || ''
    this.formValues.difficultyTypeId = '1'
    this.callForMergedTags()
    this.callForLanguages()
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      getLandingPageTemplate(this.emailTemplateId).then((response) => {
        this.formValues = response.data.data
        this.formValues.methodTypeId = this.formValues.methodTypeId.toString()
        this.formValues.domainRecordId = response.data.data.domainRecordId.toString()
        this.formValues.urlSchemaTypeId = this.formValues.urlSchemaTypeId.toString()
        this.formValues.pathTypeId = this.formValues.pathTypeId.toString()
        this.formValues.extensionTypeId = this.formValues.extensionTypeId.toString()
        this.formValues.parameterTypeId = this.formValues.parameterTypeId.toString()
        this.formValues.difficultyTypeId = this.formValues.difficultyTypeId.toString()
        this.formValues.name = `${this.formValues.name}`
        this.handleChangeDomainRecord(this.formValues.domainRecordId)
        if (this.isDuplicate) this.formValues.name = `${this.formValues.name} - Copy`
        if (this.$refs.refMakeAvailableFor) {
          this.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
            response.data.data.availableForList
          )
        } else {
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
            response.data.data.availableForList
          )
        }
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  }
}
</script>

<style lang="scss">
.email-template {
  .email-template__container {
  }
}
.new-email-template__footer-btn-cancel {
  color: #ff5252 !important;
  border: 1px solid #ff5252 !important;
  box-shadow: none !important;
  caret-color: #ff5252 !important;
  font-weight: 600 !important;
}
.new-email-template__footer-btn-back {
  color: #00bcd4 !important;
  border: 1px solid #00bcd4 !important;
  caret-color: #00bcd4 !important;
  box-shadow: none !important;
  font-weight: 600 !important;
}
.new-email-template__footer-btn-next {
  background-color: rgb(33, 150, 243) !important;
  border-color: rgb(33, 150, 243) !important;
  caret-color: #00bcd4 !important;
  font-weight: 600 !important;

  color: white !important;
}
.new-email-template {
  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
    }
  }
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 31px;
    color: #383b41;
  }
  &__sub-title {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px !important;
    color: #383b41 !important;
  }
}

.same-width {
  flex: 1 1 0;
  width: 0;
}
.landing-page-tab-content {
  box-shadow: 0 3px 1px -2px rgba(80, 80, 80, 0.12), 0px 2px 2px rgba(80, 80, 80, 0.14),
    0px 1px 5px rgba(80, 80, 80, 0.2);
  padding: 24px;
  .el-tabs__content {
    margin-top: 0 !important;
  }
  .email-template__container {
    box-shadow: none !important;
  }
  #tab-addPage {
    padding-left: 0 !important;
  }
  &__button {
    background: none !important;
    font-size: 20px !important;
    margin-left: 4px;
    margin-top: 1px;
    &:after {
      background: none !important;
    }
  }
}
.landing-page-tab__label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #2196f3;
  text-transform: none;
}
</style>
