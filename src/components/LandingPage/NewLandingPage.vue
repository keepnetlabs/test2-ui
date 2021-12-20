<template>
  <app-modal
    v-if="status"
    :status="status"
    icon-name="mdi-file"
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
                  >
                    <template #item="{item}">
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
                                : 'Send a trackable macro file '
                            }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-select>
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
                  <v-form ref="refEmailTemplateContent">
                    <form-group
                      title="Phishing Link"
                      class-name="email-template mt-2 p-4"
                      sub-title="Create a phishing link for users to click and be directed to the landing page"
                    >
                      <div class="d-flex" style="max-width: 980px;">
                        <v-select
                          :items="landingPageData.urlSchemaTypes"
                          item-disabled="disabled"
                          item-text="text"
                          item-value="value"
                          v-model="formValues.urlSchemaTypeId"
                          outlined
                          persistent-hint
                          class="same-width"
                          style="max-width: 102px;"
                          placeholder="Select URL schema"
                          @change="changeDisabledLabel"
                        ></v-select>
                        <v-text-field
                          v-model.trim="formValues.subDomain"
                          required
                          :rules="[(v) => validations.required(v, labels.Required)]"
                          placeholder="Enter subdomain"
                          hint="*Required"
                          outlined
                          dense
                          persistent-hint
                          class="same-width"
                          @input="changeDisabledLabel"
                        />
                        <v-select
                          :items="landingPageData.domainRecords"
                          item-disabled="disabled"
                          item-text="text"
                          v-model="formValues.domainRecordId"
                          item-value="value"
                          outlined
                          persistent-hint
                          label="Domain"
                          class="same-width"
                          placeholder="Select domain record"
                          required
                          :rules="[(v) => validations.required(v, labels.Required)]"
                          @change="handleChangeDomainRecord"
                        ></v-select>
                        <v-select
                          :items="landingPageData.pathTypes"
                          item-disabled="disabled"
                          item-text="text"
                          v-model="formValues.pathTypeId"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="same-width"
                          placeholder="Select path type"
                          @input="changeDisabledLabel"
                        ></v-select>
                        <v-select
                          :items="landingPageData.extensionTypes"
                          item-disabled="disabled"
                          item-text="text"
                          v-model="formValues.extensionTypeId"
                          item-value="value"
                          outlined
                          persistent-hint
                          class="same-width"
                          placeholder="Select extension type"
                          @input="changeDisabledLabel"
                        ></v-select>
                        <v-select
                          :items="landingPageData.parameterTypes"
                          item-disabled="disabled"
                          item-text="text"
                          v-model="formValues.parameterTypeId"
                          item-value="value"
                          outlined
                          persistent-hint
                          label="Parameter"
                          class="same-width"
                          placeholder="Select Parameter"
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
                      <el-tabs v-model="tab" class="landing-page-tab-content">
                        <el-tab-pane label="Page 1" name="page1" id="landingPage-content">
                          <email-template
                            ref="refEmailTemplate"
                            :active-block-manager-components="activeBlockManagerComponents"
                            :edit-items-disabled="editItemsDisabled"
                            :template.sync="formValues.landingPages[0].content"
                            :is-edit="!!isEdit"
                            :is-phishing-template="true"
                            @setAttachmentFile="setAttachmentFile"
                            @handleEditHtmlTemplate="formValues.landingPages[0].ontent = $event"
                            :onlyGrapes="true"
                          />
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
import AppModal from '../AppModal'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import {
  createPhishingEmailTemplate,
  getEmailTemplatePreviewContent,
  getLookups,
  getMergedTextForPhishing,
  updatePhishingEmailTemplate
} from '@/api/phishingsimulator'
import { scrollToComponent } from '@/utils/functions'
import { getMergedTags } from '@/api/company'
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
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import { createLandingPage, getLandingPageTemplate, updateLandingPage } from '@/api/landingPage'

export default {
  name: 'NewEmailTemplates',
  components: {
    KSelect,
    AppModal,
    FormGroup,
    MakeAvailableFor,
    EmailTemplate
  },
  data() {
    return {
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
        landingPages: [
          {
            name: 'Page1',
            order: 1,
            content:
              '<table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" role="presentation" valign="top" width="100%" id="i1t0e" class="nl-container" style="box-sizing: border-box; line-height: inherit; table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"><tbody id="ick8f" style="box-sizing: border-box; line-height: inherit;"><tr valign="top" id="icxow" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; vertical-align: top;"><td valign="top" id="i6sbf" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]--><div id="i6s7i" style="box-sizing: border-box; line-height: inherit; background-color: transparent;"><div id="ivfzk" class="block-grid" style="box-sizing: border-box; line-height: inherit; Margin: 0 auto; min-width: 320px; max-width: 595px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"><div id="i3puj" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; display: table; width: 100%; background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:595px"><tr class="layout-full-width" style="background-color:transparent"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="595" style="background-color:transparent;width:595px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]--><div id="in56t" class="col num12" style="box-sizing: border-box; line-height: inherit; min-width: 320px; max-width: 595px; display: table-cell; vertical-align: top; width: 595px;"><div id="iu1pg" style="box-sizing: border-box; line-height: inherit; width: 100%;"><!--[if (!mso)&(!IE)]><!--><div id="if6si" style="box-sizing: border-box; line-height: inherit; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top: 5px; padding-bottom: 5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><table border="0" cellpadding="0" cellspacing="0" role="presentation" valign="top" width="100%" id="ih2ff" class="divider" style="box-sizing: border-box; line-height: inherit; table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"><tbody id="i6t0o" style="box-sizing: border-box; line-height: inherit;"><tr valign="top" id="is7wf" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; vertical-align: top;"><td valign="top" id="ix3uz" class="divider_inner" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 30px; padding-right: 30px; padding-bottom: 30px; padding-left: 30px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" valign="top" width="100%" id="ijbof" class="divider_content" style="box-sizing: border-box; line-height: inherit; table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid transparent; width: 100%;"><tbody id="i32pw" style="box-sizing: border-box; line-height: inherit;"><tr valign="top" id="ihlja" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; vertical-align: top;"><td valign="top" id="igpzz" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">&nbsp;\n' +
              '                                          </td></tr></tbody></table></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div id="i67l3" style="box-sizing: border-box; line-height: inherit; background-color: transparent;"><div id="i5c5j" class="block-grid mixed-two-up" style="box-sizing: border-box; line-height: inherit; Margin: 0 auto; min-width: 320px; max-width: 595px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"><div id="ivld2" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; display: table; width: 100%; background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:595px"><tr class="layout-full-width" style="background-color:transparent"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="396" style="background-color:transparent;width:396px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:15px;"><![endif]--><div id="iyznl" class="col num8" style="box-sizing: border-box; line-height: inherit; display: table-cell; vertical-align: top; min-width: 320px; max-width: 392px; width: 396px;"><div id="iqgsy" style="box-sizing: border-box; line-height: inherit; width: 100%;"><!--[if (!mso)&(!IE)]><!--><div id="iikw8" style="box-sizing: border-box; line-height: inherit; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top: 0px; padding-bottom: 15px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]--><div id="ix4yh" style="box-sizing: border-box; color: #1f1f1f; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif; line-height: 1.2; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"><div id="i63cw" style="box-sizing: border-box; line-height: 1.2; font-size: 12px; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif; color: #1f1f1f; mso-line-height-alt: 14px;"><p id="idi9f" style="box-sizing: border-box; font-size: 14px; line-height: 1.2; word-break: break-word; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif; mso-line-height-alt: 17px; margin: 0; border-radius: 0 0 0 0; border: 0 solid rgb(31, 31, 31);"><strong id="ia2ak" style="box-sizing: border-box; line-height: inherit;"><span id="izcvj" style="box-sizing: border-box; line-height: inherit; font-size: 28px; border-radius: 0 0 0 0; border: 0 solid rgb(31, 31, 31);">Create Account</span></strong></p></div></div><!--[if mso]></td></tr></table><![endif]--><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--><!--[if (mso)|(IE)]></td><td align="center" width="198" style="background-color:transparent;width:198px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]--><div id="i9285" class="col num4" style="box-sizing: border-box; line-height: inherit; display: table-cell; vertical-align: top; max-width: 320px; min-width: 196px; width: 198px;"><div id="iixxj" style="box-sizing: border-box; line-height: inherit; width: 100%;"><!--[if (!mso)&(!IE)]><!--><div id="igmib" style="box-sizing: border-box; line-height: inherit; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><div id="ityh6" class="mobile_hide" style="box-sizing: border-box; line-height: inherit;"><div align="right" id="i79ch" class="img-container right fixedwidth" style="box-sizing: border-box; line-height: inherit; padding-right: 5px; padding-left: 5px;"><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="right"><![endif]--><div id="izrof" style="box-sizing: border-box; font-size: 1px; line-height: 20px;">&nbsp;\n' +
              '                                </div><img align="right" alt="Alternate text" border="0" src="https://www.keepnetlabs.com/Home/Logos/Keepnet-Logos/Icon.png" title="Alternate text" width="37" id="io86q" class="right fixedwidth" style="box-sizing: border-box; line-height: inherit; text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 30px; float: none; display: block;"><div id="iip9h" style="box-sizing: border-box; font-size: 1px; line-height: 15px;">&nbsp;\n' +
              '                                </div><!--[if mso]></td></tr></table><![endif]--></div></div><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div id="i42xi" style="box-sizing: border-box; line-height: inherit; background-color: transparent; border-radius: 0 0 0 0;"><div id="im25t" class="block-grid" style="box-sizing: border-box; line-height: inherit; Margin: 0 auto; min-width: 320px; max-width: 595px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"><div id="ihpk3" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; display: table; width: 100%; background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:595px"><tr class="layout-full-width" style="background-color:transparent"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="595" style="background-color:transparent;width:595px; border-top: 1px solid #D0D0D0; border-left: 1px solid #D0D0D0; border-bottom: 1px solid #D0D0D0; border-right: 1px solid #D0D0D0;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top:15px; padding-bottom:15px;"><![endif]--><div id="i528y" class="col num12" style="box-sizing: border-box; line-height: inherit; min-width: 320px; max-width: 595px; display: table-cell; vertical-align: top; width: 593px;"><div id="i01rv" style="box-sizing: border-box; line-height: inherit; width: 100%;"><!--[if (!mso)&(!IE)]><!--><div draggable="true" data-highlightable="1" id="i8mop" style="box-sizing: border-box; line-height: inherit; border-top: 1px solid #D0D0D0; border-left: 1px solid #D0D0D0; border-bottom: 1px solid #D0D0D0; border-right: 1px solid #D0D0D0; padding-top: 15px; padding-bottom: 15px; padding-right: 15px; padding-left: 15px; border-radius: 10px;"><!--<![endif]--><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]--><div draggable="true" data-highlightable="1" id="iyncb" style="box-sizing: border-box; color: #000000; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; line-height: 1.5; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px; border-radius: 0 0 0 0;"><div draggable="true" data-highlightable="1" id="izmoi" style="box-sizing: border-box; line-height: 1.5; font-size: 12px; color: #000000; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; mso-line-height-alt: 18px;"><p draggable="true" data-highlightable="1" id="iq3pr" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0; border-radius: 0 0 0 0;">Dear {FULLNAME},\n' +
              '                                </p><p draggable="true" data-highlightable="1" id="icgpb" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">&nbsp;\n' +
              '                                </p><p draggable="true" data-highlightable="1" id="ilcfp" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0;"><span draggable="true" data-highlightable="1" id="iwglw" style="box-sizing: border-box; line-height: inherit; font-size: 14px; border-radius: 0 0 0 0;">Your {PRODUCTNAME} account is created by {CREATORUSERFULLNAME} :</span></p><p draggable="true" data-highlightable="1" id="iynvcy" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0; border-radius: 0 0 0 0;">&nbsp;\n' +
              '                                </p><p draggable="true" data-highlightable="1" id="itxe3g" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0; border-radius: 0 0 0 0;">Your username is :&nbsp;\n' +
              '                                  <b id="ihrbtm" style="box-sizing: border-box;">{USERNAME}\n' +
              '                                  </b></p><p draggable="true" data-highlightable="1" id="ijkp5y" style="box-sizing: border-box; font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0; border-radius: 0 0 0 0;">&nbsp;\n' +
              '                                </p><div align="center" id="i9ebmf" class="button-container" style="box-sizing: border-box; border-radius: 0 0 0 0; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{URL}" style="height:31.5pt; width:93.75pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#2196f3"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="{URL}" target="_blank" id="iexf3k" style="box-sizing: border-box; -webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #2196f3; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; border-top: 1px solid #2196f3; border-right: 1px solid #2196f3; border-bottom: 1px solid #2196f3; border-left: 1px solid #2196f3; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"><span id="i95lhq" style="box-sizing: border-box; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; border-radius: 0 0 0 0; border: 0 solid rgb(255, 255, 255);"><span id="ietbuo" style="box-sizing: border-box; font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong id="ifiyjw" style="box-sizing: border-box; border-radius: 0 0 0 0; border: 0 solid rgb(255, 255, 255);">Confirm Email Address</strong></span></span></a><!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]--></div><span style="box-sizing: border-box;"><a href="{PASSWORDURL}" isurl="" id="i5heva" style="box-sizing: border-box;">{PASSWORDURL}</a></span><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if mso]></td></tr></table><![endif]--><!--[if (!mso)&(!IE)]><!--><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><div id="i2guck" style="box-sizing: border-box; line-height: inherit; background-color: transparent; border-radius: 0 0 0 0;"><div id="ix64a4" class="block-grid" style="box-sizing: border-box; line-height: inherit; Margin: 0 auto; min-width: 320px; max-width: 595px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"><div id="iwlcd5" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; display: table; width: 100%; background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:595px"><tr class="layout-full-width" style="background-color:transparent"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="595" style="background-color:transparent;width:595px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]--><div id="ignvd3" class="col num12" style="box-sizing: border-box; line-height: inherit; min-width: 320px; max-width: 595px; display: table-cell; vertical-align: top; width: 595px;"><div id="iebgfj" style="box-sizing: border-box; line-height: inherit; width: 100%;"><!--[if (!mso)&(!IE)]><!--><div id="i9aexm" style="box-sizing: border-box; line-height: inherit; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top: 5px; padding-bottom: 5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]--><table cellpadding="0" cellspacing="0" role="presentation" valign="top" width="100%" id="iw6l8g" class="social_icons" style="box-sizing: border-box; line-height: inherit; table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><tbody id="isk23b" style="box-sizing: border-box; line-height: inherit;"><tr valign="top" id="i1hv26" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; vertical-align: top;"><td valign="top" id="ibwh15" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px; border-radius: 0 0 0 0;"><table align="center" cellpadding="0" cellspacing="0" role="presentation" valign="top" id="i6mjbj" class="social_table" style="box-sizing: border-box; line-height: inherit; table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;"><tbody id="ixie3g" style="box-sizing: border-box; line-height: inherit;"><tr align="center" valign="top" id="icv1r7" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; vertical-align: top; display: inline-block; text-align: center;"><td valign="top" id="iporbq" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 1px; padding-left: 1px;"><a href="https://www.facebook.com/Keepnet-Labs-122039658449818" target="_blank" id="ifwa3r" style="box-sizing: border-box; line-height: inherit;"><img alt="Facebook" height="32" src="https://www.keepnetlabs.com/Home/Logos/Keepnet-Logos/facebook2x.png" title="Facebook" width="33" id="inq0pw" style="box-sizing: border-box; line-height: inherit; margin-right: 4px; text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0 solid rgb(0, 0, 238); display: block; border-radius: 0 0 0 0;"></a></td><td valign="top" id="imomvh" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 1px; padding-left: 1px;"><a href="https://www.twitter.com/keepnetlabs" target="_blank" id="ihchk2" style="box-sizing: border-box; line-height: inherit;"><img alt="Twitter" height="32" src="https://www.keepnetlabs.com/Home/Logos/Keepnet-Logos/twitter2x.png" title="Twitter" width="33" id="i93juh" style="box-sizing: border-box; line-height: inherit; margin-right: 4px; text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0 solid rgb(0, 0, 238); display: block; border-radius: 0 0 0 0;"></a></td><td valign="top" id="imacv5" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 1px; padding-left: 1px;"><a href="https://www.instagram.com/keepnetlabs" target="_blank" id="ibobp1" style="box-sizing: border-box; line-height: inherit;"><img alt="Instagram" height="32" src="https://www.keepnetlabs.com/Home/Logos/Keepnet-Logos/instagram2x.png" title="Instagram" width="33" id="i5o5r9" style="box-sizing: border-box; line-height: inherit; text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0 solid rgb(0, 0, 238); display: block; border-radius: 0 0 0 0;"></a></td><td valign="top" id="iw6znn" style="box-sizing: border-box; line-height: inherit; border-collapse: collapse; word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 1px; padding-left: 1px;"><a href="https://tr.linkedin.com/company/keepnetlabs" target="_blank" id="i3ss2i" style="box-sizing: border-box; line-height: inherit;"><img alt="LinkedIn" height="32" src="https://www.keepnetlabs.com/Home/Logos/Keepnet-Logos/linkedin2x.png" title="LinkedIn" width="33" id="id5z1g" style="box-sizing: border-box; line-height: inherit; margin-left: 4px; text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0 solid rgb(0, 0, 238); display: block; border-radius: 0 0 0 0;"></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]--><div id="ins9kr" style="box-sizing: border-box; color: #a8a8a8; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 1.2; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"><div id="islza9" style="box-sizing: border-box; line-height: 1.2; font-size: 12px; color: #a8a8a8; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"><div id="ia3onj" style="box-sizing: border-box; line-height: inherit; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"><div id="if9evq" style="box-sizing: border-box; line-height: inherit;"><p id="ifj5yp" style="box-sizing: border-box; line-height: inherit; text-align: center; margin: 0;"><span id="ihmos2" style="box-sizing: border-box; line-height: inherit; color: #a8a8a8;"><span id="in89rf" style="box-sizing: border-box; line-height: inherit; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;"><span id="ik1yx2" style="box-sizing: border-box; line-height: 1.2;"><span id="io594n" style="box-sizing: border-box; line-height: inherit; font-size: 12px;"><span id="ig173b" style="box-sizing: border-box; line-height: 1.2;"><span id="iytusz" style="box-sizing: border-box; line-height: inherit; color: #a8a8a8;"><span id="i7whmm" style="box-sizing: border-box; line-height: inherit; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;"><span id="ip9p0k" style="box-sizing: border-box; line-height: inherit; font-size: 11px;"><span id="i6eg2k" style="box-sizing: border-box; line-height: 1.2;"><span id="itpmev" style="box-sizing: border-box; line-height: inherit; word-break: break-word;"><span id="i6fmqj" style="box-sizing: border-box; line-height: inherit; font-size: 11px;">Keepnet Labs Limited © 2018 | White Collar Factory 1 Old Street Yard London EC1Y 8AF</span></span></span></span></span></span></span></span></span></span></span></p></div></div><div id="i9ktlg" style="box-sizing: border-box; line-height: inherit; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"><div id="i6ws6t" style="box-sizing: border-box; line-height: inherit;"><p id="i0jqs6" style="box-sizing: border-box; line-height: inherit; text-align: center; margin: 0;"><span id="iuvcpk" style="box-sizing: border-box; line-height: inherit; color: #3e3e3e;"><span id="ic1jka" style="box-sizing: border-box; line-height: inherit; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;"><span id="iaprx4" style="box-sizing: border-box; line-height: 1.2;"><span id="iffvli" style="box-sizing: border-box; line-height: inherit; font-size: 12px;"><span id="ie13r1" style="box-sizing: border-box; line-height: 1.2;"><span id="i8qqe1" style="box-sizing: border-box; line-height: inherit; color: #3e3e3e;"><span id="inswcx" style="box-sizing: border-box; line-height: inherit; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;"><span id="i4tfr2" style="box-sizing: border-box; line-height: inherit; font-size: 11px;"><span id="ix9lhw" style="box-sizing: border-box; line-height: 1.2;"><span id="ipwfl1" style="box-sizing: border-box; line-height: inherit; word-break: break-word;"><span id="i1bohb" style="box-sizing: border-box; line-height: inherit; font-size: 11px;"><a href="https://www.keepnetlabs.com/terms-conditions/" rel="noopener" target="_blank" id="ihdmty" style="box-sizing: border-box; line-height: inherit; text-decoration: none; color: #4b4b4b;">Terms &amp; Conditions </a>| <a href="https://www.keepnetlabs.com/privacy-policy/" rel="noopener" target="_blank" id="i3hgkj" style="box-sizing: border-box; line-height: inherit; text-decoration: none; color: #4b4b4b;">Privacy Policy</a> | <a href="https://www.keepnetlabs.com/how-we-use-cookies/" rel="noopener" target="_blank" id="i70cpl" style="box-sizing: border-box; line-height: inherit; text-decoration: none; color: #4b4b4b;">Cookie Policy</a> | <a href="https://www.keepnetlabs.com/end-user-license-agreement-eula/" rel="noopener" target="_blank" id="ixjagg" style="box-sizing: border-box; line-height: inherit; text-decoration: none; color: #4b4b4b;">EULA</a></span></span></span></span></span></span></span></span></span></span></span></p></div></div></div></div><!--[if mso]></td></tr></table><![endif]--><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table>'
          }
        ]
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
      methodItems: [],
      difficultyItems: []
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
    handleChangeDomainRecord(value) {
      const domainRecord = this.landingPageData.domainRecords.find((item) => item.value === value)
      this.landingPageData.urlSchemaTypes = this.landingPageData.urlSchemaTypes.map((schema) => {
        const activeVal = domainRecord.extraDatas[0].value
        if (activeVal === '3') {
          schema.disabled = false
        } else {
          schema.disabled = !(domainRecord.extraDatas[0].value === schema.value)
        }
        return schema
      })
      this.formValues.urlSchemaTypeId =
        domainRecord.extraDatas[0].text === 'Both' ? '2' : domainRecord.extraDatas[0].value
      this.changeDisabledLabel()
    },
    changeDisabledLabel() {
      this.disabledLabel = `${
        this.landingPageData.urlSchemaTypes.find(
          (item) => item.value == this.formValues.urlSchemaTypeId.toString()
        ).text
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
      this.$emit('changeNewEmailTemplateModalStatus', false)
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
            .then((response) => {
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
      (val) => {
        this.disabledLabel = `${
          this.landingPageData.urlSchemaTypes.find(
            (item) => item.value == this.formValues.urlSchemaTypeId.toString()
          ).text
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
    this.formValues.urlSchemaTypeId = this.landingPageData.urlSchemaTypes[0].value
    this.formValues.domainRecordId = this.landingPageData.domainRecords[0].value
    this.formValues.pathTypeId = this.landingPageData.pathTypes[0].value
    this.formValues.extensionTypeId = this.landingPageData.extensionTypes[0].value
    this.formValues.parameterTypeId = this.landingPageData.parameterTypes[0].value
    if (!this.isEdit) this.formValues.methodTypeId = this.landingPageData.methodTypes[0].value
    this.formValues.difficultyTypeId = '1'
    getLookups('Phishing Simulator Categories').then((response) => {
      this.methodItems = response.data.data
    })
    getLookups('Phishing Simulator Difficulties').then((response) => {
      this.difficultyItems = response.data.data
    })
    this.callForMergedTags()
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
      })
    }
  }
}
</script>

<style lang="scss">
.email-template {
  .email-template__container {
    padding: 24px !important;
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
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 31px;
    color: #383b41;
  }
  &__sub-title {
    font-family: Open Sans;
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
  box-shadow: 0px 3px 1px -2px rgba(80, 80, 80, 0.12), 0px 2px 2px rgba(80, 80, 80, 0.14),
    0px 1px 5px rgba(80, 80, 80, 0.2);
  padding: 24px;
  .el-tabs__content {
    margin-top: 0 !important;
  }
  .email-template__container {
    box-shadow: none !important;
  }
}
</style>
