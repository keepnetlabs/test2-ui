<template>
  <div class="fullscreen-form company-create-modal">
    <configure-new-company-dialog
      v-if="isShowConfigureNewCompany"
      :company-name="formData.Name"
      :status="isShowConfigureNewCompany"
      @on-close="closeConfigureNewCompanyDialog"
      @on-confirm="confirmConfigureNewCompanyDialog"
    />
    <CallbackNumberWarningModal
      v-if="isWarningModalVisible"
      :status="isWarningModalVisible"
      :availableNumberCount="callbackNumberItems.length"
      @closeOverlay="handleCloseWarningModal"
    />
    <v-card flat light class="header" style="padding: 32px 96px 0 96px;">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-domain</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0 mb-0">
          <v-list-item-title id="text--create-company-modal-title" class=""
            >{{ edit ? 'Edit' : 'New' }} Company</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <div class="flex-grow-1 no-gutters">
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step
              id="step--create-company-company-info"
              :complete="activeStep > 1"
              step="1"
              >Company Info</v-stepper-step
            >
            <v-divider />
            <v-stepper-step id="step--create-company-license" :complete="activeStep > 2" step="2"
              >License</v-stepper-step
            >
            <v-divider />
            <v-stepper-step id="step--create-company-groups" :complete="activeStep > 3" step="3"
              >Groups</v-stepper-step
            >
            <v-divider />
            <v-stepper-step id="step--create-content-management" step="4"
              >Content Management</v-stepper-step
            >
          </v-stepper-header>

          <v-stepper-items>
            <!-- STEP 1 -->
            <v-stepper-content step="1">
              <ConfigureCompanyStepHeader
                class="mb-6"
                title="Company Information"
                subtitle="Enter company information"
              />
              <v-form ref="refStep1Form" lazy-validation>
                <FormGroup :title="labels.CompanyName" has-hint>
                  <InputEntityName
                    v-model.trim="formData.Name"
                    id="input--company-name"
                    entity-name="company"
                    :initialRules="[(v) => validations.required(v)]"
                    initial-placeholder="Enter a name for the company"
                  />
                </FormGroup>
                <FormGroup :title="labels.Description" sub-title="Describe the company briefly">
                  <InputDescription
                    v-model.trim="formData.Description"
                    id="input--company-description"
                    :required="false"
                    :max-length="300"
                  />
                </FormGroup>
                <FormGroup :title="labels.Industry" has-hint>
                  <k-select
                    type="autocomplete"
                    v-model="formData.IndustryResourceId"
                    id="input--company-industry"
                    :items="industries"
                    persistent-hint
                    item-text="name"
                    item-value="resourceId"
                    outlined
                    placeholder="Select industry"
                    hint="*Required"
                    no-data-text="No industry available"
                    :menu-props="{ offsetY: true }"
                    :rules="[(v) => validations.required(v)]"
                  ></k-select>
                </FormGroup>
                <FormGroup title="Country" has-hint>
                  <k-select
                    type="autocomplete"
                    v-model="formData.CountryResourceId"
                    id="input--company-country"
                    :items="countries"
                    persistent-hint
                    item-text="name"
                    item-value="resourceId"
                    outlined
                    placeholder="Select country"
                    hint="*Required"
                    no-data-text="No country available"
                    :menu-props="{ offsetY: true }"
                    :rules="[(v) => validations.required(v)]"
                  ></k-select>
                </FormGroup>
                <FormGroup title="Timezone" has-hint>
                  <InputTimezone
                    v-model="formData.timeZoneId"
                    hint="*Required"
                    persistent-hint
                    is-block
                    :rules="[(v) => validations.required(v)]"
                  />
                </FormGroup>
                <FormGroup
                  title="Time Format"
                  has-hint
                  sub-title="Time format in notification templates"
                >
                  <k-select
                    v-model="formData.TimeFormat"
                    id="input--company-time-format"
                    :items="timeFormatList"
                    persistent-hint
                    outlined
                    placeholder="Select time format"
                    hint="*Required"
                    no-data-text="No data"
                    :menu-props="{ offsetY: true }"
                    :rules="[(v) => validations.required(v)]"
                  ></k-select>
                </FormGroup>
                <FormGroup
                  title="Date Format"
                  has-hint
                  sub-title="Date format in notification templates"
                >
                  <k-select
                    v-model="formData.DateFormat"
                    id="input--company-date-format"
                    :items="dateFormatList"
                    persistent-hint
                    outlined
                    placeholder="Select date format"
                    hint="*Required"
                    no-data-text="No data"
                    :menu-props="{ offsetY: true }"
                    :rules="[(v) => validations.required(v)]"
                  ></k-select>
                </FormGroup>
                <FormGroup :title="labels.Address">
                  <InputAddress
                    v-model="formData.Address"
                    id="input-ip--company-address"
                    initial-placeholder="Enter company address"
                  />
                </FormGroup>
                <FormGroup :title="labels.WebsiteUrl">
                  <InputUrl
                    v-model="formData.WebsiteUrl"
                    :required="false"
                    :persistent-hint="false"
                    :hint="null"
                    id="input--company-website-url"
                  />
                </FormGroup>
                <v-list-item>
                  <v-list-item-content :class="[getPreviewLogoUrl && 'mb-0']">
                    <label for="input--company-logo" class="bottom-margin">{{
                      labels.CompanyLogo
                    }}</label>
                    <k-file-upload
                      hint="Upload png, jpg or jpeg. Suggested size: 180px * 60px. Max. file size 2MB"
                      id="input--company-logo"
                      :extensions="['jpg', 'jpeg', 'png']"
                      :size="2"
                      @inputFile="onFileChanged"
                    />
                    <div>
                      <v-list-item
                        v-if="getPreviewLogoUrl"
                        class="px-0 add-in-settings__list-item add-in-settings__logo-container"
                      >
                        <v-list-item-content>
                          <div>
                            <div class="add-in-settings__image-container">
                              <img
                                v-if="!!getImagePreview"
                                class="add-in-settings__image"
                                :src="getImagePreview"
                                alt="logo-preview"
                              />
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <form-group class-name="mt-6" title="Tags" sub-title="Define tags for the company">
                  <InputTag
                    v-model="formData.tags"
                    ref="refTags"
                    :id="`input--action-tags`"
                    :items="[]"
                    class="hide-caret"
                  />
                </form-group>
                <v-list-item>
                  <v-list-item-content>
                    <v-switch
                      v-model="formData.statusId"
                      id="input--company-status"
                      :ripple="false"
                      dense
                      :label="formData.statusId === '1' ? 'ACTIVE' : 'INACTIVE'"
                      class="playbook-rule-form__switch"
                      color="#2196f3"
                      :true-value="'1'"
                      :false-value="'0'"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
              <v-list-item>
                <v-list-item-content class="mb-0">
                  <v-list-item-title class="v-card-form-title">
                    License Information
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Define licence settings
                    <a
                      v-if="edit && stepLock"
                      id="btn-edit--company-form-step-2"
                      class="company-create-modal__edit-link"
                      @click.prevent="editStepLock"
                      >Click here to edit</a
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-form ref="refStep2Form" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content class="mb-2">
                    <label for="input--company--license-type" class="bottom-margin">{{
                      labels.LicenceType
                    }}</label>
                    <k-select
                      :items="licenceTypes"
                      v-model="formData.LicenseTypeResourceId"
                      id="input--company--license-type"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select an option"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="stepLock"
                      hint="*Required"
                      :menu-props="{ offsetY: true }"
                      @input="handleLicenseTypeChange"
                      persistent-hint
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="mb-6 company-checkbox__container">
                    <v-checkbox
                      v-for="(item, index) in allModuleLicences"
                      :id="`input--company-module-license-${index}`"
                      :key="item.resourceId"
                      v-model="formData.LicenseModuleResourceIdArray"
                      :disabled="stepLock || !item.isAvailable"
                      :value="item.resourceId"
                      class="k-checkbox"
                      color="#2196f3"
                      :ripple="false"
                      :label="item.name"
                      hide-details
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="mb-4">
                    <label for="input--company-license-start-date" class="bottom-margin">{{
                      labels.StartDate
                    }}</label>
                    <el-form>
                      <el-form-item class="mb-2" :error="startDateValidation">
                        <InputDate
                          v-model="formData.LicenseStartDate"
                          id="input--company-license-start-date"
                          type="date"
                          :format="getDateFormat"
                          :disabled="stepLock"
                          :rules="[(v) => !!v || 'Required']"
                        />
                      </el-form-item>
                    </el-form>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="mb-2">
                    <label for="input--company-expiry-period" class="bottom-margin">{{
                      labels.ExpiryPeriod
                    }}</label>
                    <div class="company__license-end-date__container">
                      <k-select
                        :items="expiryPeriods"
                        v-model="formData.LicensePeriodTypeResourceId"
                        id="input--company-expiry-period"
                        item-text="name"
                        item-value="resourceId"
                        outlined
                        persistent-hint
                        placeholder="Select an option"
                        hint="*Required"
                        :disabled="stepLock || isExpiryDateLimited"
                        :rules="[expiryPeriodValidation]"
                        :menu-props="{ offsetY: true }"
                        @change="expiryPeriodChange"
                      >
                        <template v-slot:selection="{ item }">
                          <span>
                            {{ item.name }}
                            <template
                              v-if="
                                (stepLock &&
                                  formData.LicenseStartDate &&
                                  formData.LicenseEndDate) ||
                                (item.name !== 'Custom' &&
                                  formData.LicenseStartDate &&
                                  formData.LicenseEndDate)
                              "
                              >({{ formData.LicenseStartDate | moment('YYYY.MM.DD') }}
                              -
                              {{ formData.LicenseEndDate | moment('YYYY.MM.DD') }})</template
                            >
                          </span>
                        </template>
                      </k-select>
                      <el-form>
                        <el-form-item :error="endDateValidation">
                          <InputDate
                            v-model="formData.LicenseEndDate"
                            id="input--company-license-end-date"
                            type="date"
                            :format="getDateFormat"
                            :disabled="stepLock || isEndDateDisabled"
                            :picker-options="datePickerOptions"
                            :rules="[(v) => !!v || 'Required']"
                          />
                        </el-form-item>
                      </el-form>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label for="input--company-numbers-limited">{{ labels.NumberOfUsers }}</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Number of end-users who will recieve emails and will be tracked
                    </v-list-item-title>
                    <div class="d-flex align-items-center">
                      <v-text-field
                        v-mask="'######'"
                        ref="userLimit"
                        :placeholder="numberOfUsersPlaceholder"
                        id="input--company-numbers-limited"
                        outlined
                        dense
                        type="text"
                        autocomplete="off"
                        v-model.number="formData.NumberOfUsers"
                        :disabled="!formData.IsNumberOfUsersLimited || stepLock"
                        :rules="numberOfUsersRules"
                        hint="*Required"
                        persistent-hint
                      ></v-text-field>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="isCallbackSelected" class="mt-4">
                  <v-list-item-content class="mb-2">
                    <label
                      for="input--company--callback-number-booking-count"
                      class="bottom-margin"
                    >
                      Number Of Callback Phone Numbers
                    </label>
                    <v-list-item-title class="v-card-sub-header bottom-margin"
                      >Number of phone numbers that will be used in callback campaigns
                    </v-list-item-title>
                    <AlertBox
                      class="bg-aqua-light mb-4"
                      icon-color="#2196F3"
                      icon-name="mdi-information"
                      :slots="{ primaryAction: false, secondaryAction: false }"
                    >
                      <template #text>
                        <p class="mb-0 mb-n1">
                          There are only
                          <strong>{{ callbackNumberItems.length }}</strong>
                          available callback phone numbers in the system. If you would like to
                          execute up to
                          <strong>12</strong> callback scenarios, then get in touch with your
                          support representative to add more callback phone numbers to the system.
                        </p>
                      </template>
                    </AlertBox>
                    <k-select
                      :items="callbackNumberItems"
                      v-model="formData.CallBackNumberBookingCount"
                      id="input--company--callback-number-booking-count"
                      outlined
                      placeholder="Select number of callback phone numbers"
                      :rules="callbackNumberItems.length === 0 ? [] : [(v) => !!v || 'Required']"
                      :disabled="stepLock || callbackNumberItems.length === 0"
                      hint="*Required"
                      position="top"
                      :menu-props="{ offsetY: true }"
                      persistent-hint
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <ConfigureCompanyStepHeader
                class="mb-6"
                title="Groups that this company belongs to"
                subtitle="Select company groups"
              />
              <v-form ref="refStep3Form" lazy-validation onSubmit="return false;">
                <v-list-item class="mt-6">
                  <v-list-item-content>
                    <label for="input--company-group-groups" class="bottom-margin">
                      Company Groups
                    </label>
                    <k-select
                      v-infinite-scroll="{
                        target: '#input--company-group-groups .k-select__menu',
                        callback: getCompanyGroups
                      }"
                      v-select-search-handler="{
                        callback: searchCompanyGroupsWithParents,
                        isLoadingKey: 'isCompanyGroupsLoading'
                      }"
                      type="autocomplete"
                      v-model="formData.CompanyGroupResourceIdArray"
                      id="input--company-group-groups"
                      chips
                      clearable
                      item-text="name"
                      item-value="resourceId"
                      multiple
                      small-chips
                      deletable-chips
                      outlined
                      :no-data-text="noCompanyGroupText"
                      placeholder="Select company groups (optional)"
                      :items="companyGroupList"
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 4 -->
            <v-stepper-content step="4">
              <ConfigureCompanyStepHeader
                class="mb-6"
                title=" Content Management"
                subtitle="Select which content this company can access"
              />
              <v-form ref="refStep4Form" lazy-validation>
                <FormGroup has-hint title="Notification Templates">
                  <k-select
                    v-model="formData.NotificationTemplateTypeResourceId"
                    :items="notificationTemplates"
                    :return-object="false"
                    class="tlp-select"
                    id="input--company-notification-templates"
                    :rules="[(v) => !!v || 'Required']"
                    outlined
                    hint="*Required"
                    persistent-hint
                    placeholder="Select an option"
                    item-text="name"
                    item-value="resourceId"
                    no-data-text="No notification template available"
                    :slots="{ item: true, selection: false }"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title :id="item.titleId">{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle :id="item.descriptionId" class="tlp_subtitle">{{
                          item.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </k-select>
                </FormGroup>
                <FormGroup has-hint title="Training Content">
                  <k-select
                    v-model="formData.TrainingContentTypeResourceId"
                    :items="trainingContents"
                    :return-object="false"
                    class="tlp-select"
                    id="input--company-training-content"
                    :rules="[(v) => !!v || 'Required']"
                    outlined
                    hint="*Required"
                    persistent-hint
                    placeholder="Select an option"
                    item-text="name"
                    item-value="resourceId"
                    no-data-text="No training content available"
                    :slots="{ item: true, selection: false }"
                  >
                    <template #item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title :id="item.titleId"> {{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle :id="item.descriptionId" class="tlp_subtitle">{{
                          item.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </k-select>
                </FormGroup>
                <FormGroup has-hint title="SMTP Configurations">
                  <k-select
                    v-model="formData.SmtpConfigurationTypeResourceId"
                    :items="smtpConfigurations"
                    :return-object="false"
                    class="tlp-select"
                    id="input--company-smtp-configurations"
                    :rules="[(v) => !!v || 'Required']"
                    outlined
                    hint="*Required"
                    persistent-hint
                    placeholder="Select an option"
                    item-text="name"
                    item-value="resourceId"
                    :slots="{ item: true, selection: false }"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title :id="item.titleId">{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle :id="item.descriptionId" class="tlp_subtitle">{{
                          item.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </k-select>
                </FormGroup>
                <FormGroup
                  title="Preferred Language"
                  sub-title="Sort contents in this language first on lists and tables"
                >
                  <k-select
                    v-model="formData.PreferredLanguageTypeResourceId"
                    :items="languageItems"
                    :return-object="false"
                    position="top"
                    class="tlp-select"
                    id="input--company-preferred-language"
                    outlined
                    hint="*Required"
                    persistent-hint
                    placeholder="Select an option"
                    item-text="isoFriendlyName"
                    item-value="resourceId"
                  >
                  </k-select>
                </FormGroup>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </div>
    <div class="wizard__footer">
      <StepperFooter
        max-step="4"
        :step="activeStep"
        :ids="stepperButtonsIds"
        :disabled-statuses="{
          nextButton: isSecondStepDisabled,
          submitButton: saveDisable
        }"
        @on-cancel="handleCancel"
        @on-back="prevStep"
        @on-next="nextStep"
        @on-submit="handleSave"
      />
    </div>
  </div>
</template>
<script>
import * as validations from '@/utils/validations'
import {
  createCompany,
  expiryDateLimited,
  searchCompanies,
  searchCompanyGroupsWithParents,
  updateCompany
} from '@/api/company'
import CallbackService from '@/api/callback'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import {
  getSelectSearchPayload,
  scrollToComponent,
  isDifferent,
  getDefaultAxiosPayload
} from '@/utils/functions'
import { getLicences } from '@/api/common'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import InputDate from '@/components/Common/Inputs/InputDate'
import ConfigureNewCompanyDialog from '@/components/Companies/ConfigureNewCompanyDialog'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputAddress from '@/components/Common/Inputs/InputAddress'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import StepperFooter from '@/components/Stepper/StepperFooter'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import FormGroup from '@/components/SmallComponents/FormGroup'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import AlertBox from '@/components/AlertBox'
import CallbackNumberWarningModal from '@/components/Companies/CallbackNumberWarningModal'
import moment from 'moment'
import countryDefaultValues from '@/utils/countryDefaultValues'
import countryLanguageMap from '@/utils/countryLanguageMap'
import { getTimeZoneForMoment } from '../../utils/functions'
import InputTag from '@/components/Common/Inputs/InputTag.vue'
export default {
  name: 'CompanyCreateOrEdit',
  props: {
    edit: { type: Boolean, default: false },
    selectedRow: { type: Object },
    selectedExtend: { type: Object }
  },
  components: {
    InputTag,
    ConfigureCompanyStepHeader,
    FormGroup,
    InputTimezone,
    StepperFooter,
    InputAddress,
    InputDescription,
    ConfigureNewCompanyDialog,
    KSelect,
    InputUrl,
    KFileUpload,
    InputDate,
    InputEntityName,
    AlertBox,
    CallbackNumberWarningModal
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  data() {
    return {
      moment,
      dateFormat: localStorage.getItem('selectedDateFormat'),
      timeFormat: localStorage.getItem('selectedTimeFormat'),
      languageItems: [],
      isExpiryDateLimited: false,
      startDateValidation: '',
      endDateValidation: '',
      stepperButtonsIds: {
        cancelButton: 'btn-cancel--company-modal',
        backButton: 'btn-back--company-modal',
        nextButton: 'btn-next--company-modal',
        saveButton: 'btn-save--company-modal'
      },
      saveDisable: false,
      totalNumberOfPagesOfCompanyGroups: 1,
      createdCompanyResourceId: null,
      isShowConfigureNewCompany: false,
      labels,
      isCompanyGroupsLoading: false,
      stepLock: false,
      totalStep: 4,
      activeStep: 1,
      allModuleLicences: [],
      formData: {
        File: null,
        logoURL: null,
        Name: '',
        PreferredLanguageTypeResourceId: '',
        Description: '',
        IndustryResourceId: '',
        CountryResourceId: '',
        Address: '',
        WebsiteUrl: '',
        LicenseTypeResourceId: '',
        LicenseTypeName: '',
        LicensePeriodTypeResourceId: 'MaR9NJslgSGW',
        LicenseStartDate: '',
        LicenseEndDate: '',
        IsNumberOfUsersLimited: true,
        CallBackNumberBookingCount: null,
        NumberOfUsers: '',
        NotificationTemplateTypeResourceId: '',
        TrainingContentTypeResourceId: '',
        SmtpConfigurationTypeResourceId: '',
        IsVersionVisible: false,
        IsReleaseNotesVisible: false,
        ReleaseNotesUrl: '',
        CompanyGroupResourceIdArray: [],
        LicenseModuleResourceIdArray: [],
        statusId: '1',
        DateFormat: 'dd/MM/yyyy',
        TimeFormat: '24h',
        timeZoneId: '',
        tags: []
      },
      dateFormatList: [
        {
          text: `DD/MM/YYYY ${moment(new Date()).format('DD/MM/YYYY')}`,
          value: 'dd/MM/yyyy'
        },
        {
          text: `MM/DD/YYYY ${moment(new Date()).format('MM/DD/YYYY')}`,
          value: 'MM/dd/yyyy'
        },
        {
          text: `YYYY/MM/DD ${moment(new Date()).format('YYYY/MM/DD')}`,
          value: 'yyyy/MM/dd'
        }
      ],
      timeFormatList: [
        {
          text: '24h 18:25',
          value: '24h'
        },
        {
          text: '12h 06:25 PM',
          value: '12h'
        }
      ],
      defaultFormData: null,
      LicenseDates: [],
      isActive: true,
      expiryPeriods: [],
      countries: [],
      industries: [],
      licenceTypes: [],
      companyGroupList: [],
      comapnyGroups: [],
      notificationTemplates: [],
      trainingContents: [],
      smtpConfigurations: [],
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      validations: validations,
      companyGroupPayload: getDefaultAxiosPayload({ pageSize: 100 }),
      callbackNumberItems: [],
      isWarningModalVisible: false
    }
  },
  computed: {
    getSelectedCountry() {
      if (this.formData.CountryResourceId) {
        const selectedCountryIndex = this.countries.findIndex(
          (country) => country.resourceId === this.formData.CountryResourceId
        )
        if (selectedCountryIndex !== -1) {
          return this.countries[selectedCountryIndex].name
        }
      }
      return null
    },
    getDateFormat() {
      if (this.dateFormat) {
        return this.dateFormat.replaceAll('/', '.').replaceAll('Y', 'y').replaceAll('D', 'd')
      }

      return `dd.MM.yyyy`
    },
    getTimeFormat() {
      if (this.timeFormat) {
        if (this.timeFormat === '12h') return 'hh:mm a'
        else return 'hh:mm'
      }
      return 'hh:mm'
    },
    getImagePreview() {
      if (Array.isArray(this.getPreviewLogoUrl) && this.getPreviewLogoUrl.length > 0) {
        return this.getPreviewLogoUrl[0]
      }

      if (Array.isArray(this.getPreviewLogoUrl) && this.getPreviewLogoUrl.length === 0) {
        return null
      }

      if (typeof this.getPreviewLogoUrl === 'string') {
        return this.getPreviewLogoUrl
      }

      return URL.createObjectURL(this.getPreviewLogoUrl)
    },
    noCompanyGroupText() {
      return this.isCompanyGroupsLoading ? 'Loading...' : 'No company group available'
    },
    numberOfUsersRules() {
      return this.formData.IsNumberOfUsersLimited
        ? [
            (v) => this.validations.required(v, 'Required'),
            (v) => /^\d+$/gi.test(v) || 'Invalid number',
            (v) => {
              return parseInt(v) > 200000
                ? 'Number of users has exceeded 200,000. Please reduce the number of users to continue.'
                : null
            }
          ]
        : [true]
    },
    numberOfUsersPlaceholder() {
      return 'Enter number of users'
    },
    isEndDateDisabled() {
      return (
        this.formData.LicensePeriodTypeResourceId === 'HTHpWWXGJshG' ||
        this.formData.LicensePeriodTypeResourceId === '6EXwfaM5ZDT4' ||
        this.isExpiryDateLimited
      )
    },
    isSecondStepDisabled() {
      return (
        this.activeStep === 2 && (!this.formData.LicenseStartDate || !this.formData.LicenseEndDate)
      )
    },
    canNext() {
      return this.activeStep < this.totalStep
    },
    getPreviewLogoUrl() {
      return this.formData.logoURL || this.formData.File
    },
    canPrev() {
      return this.activeStep > 1
    },
    isCallbackSelected() {
      return this.formData?.LicenseModuleResourceIdArray?.includes('AYAPp3vt3SvS')
    }
  },
  watch: {
    getSelectedCountry(val) {
      if (this.edit || !val) return

      const countryDefaultValuesIndex = countryDefaultValues.findIndex(
        (country) => country.name === val
      )

      const englishResourceId = this.languageItems.find((item) => item.name === 'English')
        ?.resourceId
      if (countryDefaultValuesIndex !== -1) {
        this.formData.DateFormat = countryDefaultValues[countryDefaultValuesIndex].dateFormat
        this.formData.TimeFormat = countryDefaultValues[countryDefaultValuesIndex].timeFormat
        this.formData.timeZoneId = countryDefaultValues[countryDefaultValuesIndex].timezone
        const nativeLanguageIndex = countryLanguageMap.findIndex((clm) => clm.country === val)
        if (nativeLanguageIndex !== -1) {
          this.formData.PreferredLanguageTypeResourceId =
            this.languageItems.find(
              (language) => language.name === countryLanguageMap[nativeLanguageIndex].language
            )?.resourceId || englishResourceId
        }
      } else {
        this.formData.PreferredLanguageTypeResourceId = englishResourceId
      }
    },
    isCallbackSelected(val) {
      if (!val) {
        this.formData.CallBackNumberBookingCount = null
      } else {
        this.getAvailableCallbackNumbers()
      }
    },
    'formData.LicensePeriodTypeResourceId'(newVal, oldVal) {
      if (oldVal && newVal === 'MaR9NJslgSGW' && this.edit) {
        this.formData.LicenseEndDate = this.selectedExtend.licenseEndDate
      }
    },
    'formData.LicenseStartDate'(newVal, oldVal) {
      if (this.isExpiryDateLimited) {
        if (!newVal) this.formData.LicenseEndDate = ''
        else {
          let endDate = ''
          const [firstPart, secondPart, thirdPart] =
            this.formData?.LicenseStartDate?.split(' ')?.[0]?.split('/') || []
          if (this.dateFormat === 'YYYY/MM/DD') {
            endDate = new Date(parseInt(firstPart), parseInt(secondPart) + 2, parseInt(thirdPart))
          } else if (this.dateFormat === 'MM/DD/YYYY') {
            endDate = new Date(parseInt(thirdPart), parseInt(firstPart) + 2, parseInt(secondPart))
          } else if (this.dateFormat === 'DD/MM/YYYY') {
            endDate = new Date(parseInt(thirdPart), parseInt(secondPart) + 2, parseInt(firstPart))
          } else {
            endDate = new Date(parseInt(thirdPart), parseInt(secondPart) + 2, parseInt(firstPart))
          }
          this.formData.LicenseEndDate = this.$moment(endDate).format(getTimeZoneForMoment())
        }
        return
      }
      this.startDateValidation = oldVal && !newVal ? 'Start date should be picked' : ''
      this.expiryPeriodValidation(this.formData.LicensePeriodTypeResourceId)
      if (this.formData.LicensePeriodTypeResourceId !== 'MaR9NJslgSGW') {
        this.expiryPeriodChange()
      }
      if (
        this.formData.LicensePeriodTypeResourceId &&
        this.formData.LicensePeriodTypeResourceId === 'MaR9NJslgSGW'
      ) {
        if (!newVal && oldVal && !this.edit) {
          this.formData.LicenseEndDate = ''
          return
        }
        if (newVal && oldVal) {
          const newSelectedDate = newVal?.split(' ')?.[0]
          const oldSelectedDate = oldVal?.split(' ')?.[0]
          if (newSelectedDate !== oldSelectedDate && !this.edit) {
            this.formData.LicenseEndDate = ''
          }
        }
      }
    },
    'formData.LicenseEndDate'(newVal, oldVal) {
      if (oldVal && !newVal) {
        this.endDateValidation = 'End date should be picked'
      } else {
        this.endDateValidation = ''
      }
      this.expiryPeriodValidation(this.formData.LicensePeriodTypeResourceId)
    },
    'formData.LicenseModuleResourceIdArray'(newVal) {
      if (newVal.length) {
        const findedLicense = this.licenceTypes.find((license) => {
          const { licenseModules = [] } = license
          if (licenseModules && licenseModules.length && licenseModules.length === newVal.length) {
            return newVal.every((resourceId) => {
              return licenseModules.some((item) => {
                return item.resourceId === resourceId
              })
            })
          }
        })
        let selectedLicenceTypeResourceId
        if (!findedLicense) {
          const customLicense = this.licenceTypes.find((item) => item.name === 'Custom')
          if (customLicense) {
            selectedLicenceTypeResourceId = customLicense.resourceId
          }
        } else {
          selectedLicenceTypeResourceId = findedLicense.resourceId
        }
        if (selectedLicenceTypeResourceId) {
          this.$nextTick(() => {
            this.formData.LicenseTypeResourceId = selectedLicenceTypeResourceId
          })
        }
      }
    },
    isActive(value) {
      this.formData.statusId = value ? 1 : 0
    },
    search(val) {
      if (val && val.length > 2) {
        this.debounce(() => {
          this.payload.filter.FilterGroups[0].FilterItems[0].Value = val
          searchCompanies(this.payload).then((response) => {
            this.companies =
              response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
                ? response.data.data.results
                : []
          })
        }, 1000)
      }
    }
  },
  mounted() {
    this.callForExpiryDateLimited()
    this.defaultFormData = JSON.parse(JSON.stringify(this.formData))
    this.getLookupContents()
    this.getCompanyGroups()
    if (this.edit) {
      this.formData.PreferredLanguageTypeResourceId =
        this.selectedExtend.preferredLanguageTypeResourceId === ''
          ? this.formData.PreferredLanguageTypeResourceId
          : this.selectedExtend.preferredLanguageTypeResourceId
      this.stepLock = this.edit
      this.formData.logoURL = this.selectedExtend.logoUrl
      this.formData.Name = this.selectedExtend.name
      this.formData.Description = this.selectedExtend.description
      this.formData.IndustryResourceId = this.selectedExtend.industryResourceId
      this.formData.CountryResourceId = this.selectedExtend.countryResourceId
      this.formData.Address = this.selectedExtend.address
      this.formData.WebsiteUrl = this.selectedExtend.websiteUrl
      this.formData.LicenseTypeResourceId = this.selectedExtend.licenseTypeResourceId
      this.formData.LicensePeriodTypeResourceId = this.selectedExtend.licensePeriodTypeResourceId
      this.formData.LicenseStartDate = this.selectedExtend.licenseStartDate
      this.formData.LicenseEndDate = this.selectedExtend.licenseEndDate
      this.formData.IsNumberOfUsersLimited = this.selectedExtend.isNumberOfUsersLimited
      this.formData.tags = this.selectedExtend.tags || []
      this.formData.LicenseModuleResourceIdArray = this.selectedExtend.licenseModules
      this.formData.licenseTypeName = this.selectedExtend.licenseTypeName
      this.formData.NumberOfUsers = this.selectedExtend.isNumberOfUsersLimited
        ? this.selectedExtend.numberOfUsers
        : ''
      this.formData.NotificationTemplateTypeResourceId = this.selectedExtend.notificationTemplateTypeResourceId
      this.formData.TrainingContentTypeResourceId = this.selectedExtend.trainingContentTypeResourceId
      this.formData.SmtpConfigurationTypeResourceId = this.selectedExtend.smtpConfigurationTypeResourceId
      this.formData.IsVersionVisible = this.selectedExtend.isVersionVisible
      this.formData.IsReleaseNotesVisible = this.selectedExtend.isReleaseNotesVisible
      this.formData.ReleaseNotesUrl = this.selectedExtend.releaseNotesUrl
      this.formData.TimeFormat = this.selectedExtend?.timeFormat || '24h'
      this.formData.DateFormat = this.selectedExtend?.dateFormat || 'dd/MM/yyyy'
      this.correctDateFormat()
      this.formData.statusId = this.selectedExtend.statusId.toString()
      this.formData.timeZoneId = this.selectedExtend.timeZoneId
      this.formData.CallBackNumberBookingCount =
        this.selectedExtend?.callBackNumberBookingCount || null
      Array.isArray(this.selectedExtend.companyGroups) &&
        this.selectedExtend.companyGroups.forEach((x) => {
          this.formData.CompanyGroupResourceIdArray.push(x.resourceId)
          this.companyGroupList.push(x)
        })
      this.defaultFormData = JSON.parse(JSON.stringify(this.formData))
    }
  },
  methods: {
    callForExpiryDateLimited() {
      expiryDateLimited(this.$moment(Date.now()).format(getTimeZoneForMoment())).then(
        (response) => {
          if (Object.keys(response?.data?.data).length) {
            this.isExpiryDateLimited = true
            if (this.edit) return
            this.formData.LicenseStartDate = this.$moment(Date.now()).format(getTimeZoneForMoment())
            this.formData.LicenseEndDate = this.$moment(
              Date.now() + 90 * 60 * 60 * 24 * 1000
            ).format(getTimeZoneForMoment())
          }
        }
      )
    },
    correctDateFormat() {
      if (this.formData.DateFormat.toLocaleLowerCase() === 'dd/mm/yyyy') {
        this.formData.DateFormat = 'dd/MM/yyyy'
      }
      if (this.formData.DateFormat.toLocaleLowerCase() === 'mm/dd/yyyy') {
        this.formData.DateFormat = 'MM/dd/yyyy'
      }
      if (this.formData.DateFormat.toLocaleLowerCase() === 'yyyy/mm/dd') {
        this.formData.DateFormat = 'yyyy/MM/dd'
      }
    },
    handleCloseWarningModal() {
      this.isWarningModalVisible = false
    },
    disabledEndDates(val) {
      let selectedStartDate = new Date()
      if (this.formData.LicenseStartDate) {
        const [day, month, year] =
          this.formData?.LicenseStartDate?.split(' ')?.[0]?.split('/') || []
        selectedStartDate = new Date(year, month - 1, day)
      }
      const selectedStartDateInMs = selectedStartDate.getTime() + 1000 * 60 * 60 * 24
      return selectedStartDateInMs > val.getTime() || val.getTime() < new Date().getTime()
    },
    handleCancel() {
      if (this.isFormDataChanged()) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('cancelForm')
          }
        })
      } else {
        this.$emit('cancelForm')
      }
    },
    isFormDataChanged() {
      return isDifferent(this.formData, this.defaultFormData)
    },
    confirmConfigureNewCompanyDialog() {
      this.formData = []
      this.LicenseDates = []
      this.activeStep = 1
      this.$emit('closeFormConfigureNewCompanyModal', this.createdCompanyResourceId)
    },
    getLookupContents() {
      Promise.all([LookupLocalStorage.getMultiple([1, 2, 4, 5, 6, 7, 21]), getLicences()]).then(
        (responses) => {
          const res = responses[0] || []
          this.countries = res.filter((item) => item.genericCodeTypeId === 1)
          this.industries = res.filter((item) => item.genericCodeTypeId === 2)
          this.expiryPeriods = res.filter((item) => item.genericCodeTypeId === 4)
          const languageItems = res?.filter((item) => item.genericCodeTypeId === 21) || []
          this.languageItems = [...languageItems]
          this.notificationTemplates = res
            .filter((item) => item.genericCodeTypeId === 5)
            .map((notificationTemplate, ind) => {
              return {
                ...notificationTemplate,
                titleId: `item--notification-template-title-${ind}`,
                descriptionId: `item--notification-template-description-${ind}`
              }
            })
          this.trainingContents = res
            .filter((item) => item.genericCodeTypeId === 6)
            .map((trainingContent, ind) => {
              return {
                ...trainingContent,
                titleId: `item--training-content-title-${ind}`,
                descriptionId: `item--training-content-description-${ind}`
              }
            })
          this.smtpConfigurations = res
            .filter((item) => item.genericCodeTypeId === 7)
            .map((smtpConfiguration, ind) => {
              return {
                ...smtpConfiguration,
                titleId: `item--smtp-configuration-title-${ind}`,
                descriptionId: `item--smtp-configuration-description-${ind}`
              }
            })
          this.licenceTypes = responses[1].data.data.licenses
          this.allModuleLicences = responses[1].data.data.allLicenseModules
          if (this.edit) {
            const license = this.licenceTypes.find(
              (licence) => licence.name === this.formData.licenseTypeName
            )
            if (license.name !== 'Custom') {
              this.formData.LicenseModuleResourceIdArray = license.licenseModules.reduce(
                (acc, item) => {
                  acc.push(item.resourceId)
                  return acc
                },
                []
              )
              if (this.defaultFormData) {
                this.defaultFormData.LicenseModuleResourceIdArray = JSON.parse(
                  JSON.stringify(this.formData.LicenseModuleResourceIdArray)
                )
              }
            }
            if (!this.formData.PreferredLanguageTypeResourceId) {
              const englishResourceId = this.languageItems.find((item) => item.name === 'English')
              this.formData.PreferredLanguageTypeResourceId = englishResourceId?.resourceId
            }
          }
        }
      )
    },
    searchCompanyGroupsWithParents(search = '') {
      if (search) {
        searchCompanyGroupsWithParents(getSelectSearchPayload(this.companyGroupPayload, search))
          .then(this.setCompanyGroups)
          .finally(() => {
            this.isCompanyGroupsLoading = false
          })
      } else {
        this.getCompanyGroups()
      }
    },
    setCompanyGroups(response) {
      const { data: { data = [] } = [] } = response
      this.comapnyGroups = [...this.comapnyGroups, ...data.results]
      this.companyGroupList = []
      if (this.comapnyGroups.some((group) => !group.isOwner)) {
        this.companyGroupList.push({ header: 'Groups That Company Belongs To' })
        const companyGroupsThatCompanyBelongsTo = this.comapnyGroups.filter(
          (group) => !group.isOwner
        )
        this.companyGroupList.push(...companyGroupsThatCompanyBelongsTo)
      }
      if (this.comapnyGroups.some((group) => group.isOwner)) {
        this.companyGroupList.push({
          header: 'Groups That Created By The Company'
        })
        const companyGroupsThatCompanyCreated = this.comapnyGroups.filter((group) => group.isOwner)
        this.companyGroupList.push(...companyGroupsThatCompanyCreated)
      }
      return data
    },
    getCompanyGroups(addPage) {
      if (addPage) {
        this.companyGroupPayload.pageNumber += 1
        if (this.companyGroupPayload.pageNumber > this.totalNumberOfPagesOfCompanyGroups) return
      }
      searchCompanyGroupsWithParents(this.companyGroupPayload)
        .then(this.setCompanyGroups)
        .then((data) => {
          this.totalNumberOfPagesOfCompanyGroups = data.totalNumberOfPages
        })
        .finally(() => {
          this.isCompanyGroupsLoading = false
        })
    },
    getAvailableCallbackNumbers() {
      const companyId = this.edit
        ? this.selectedExtend?.resourceId || this.selectedRow?.companyResourceId || ''
        : ''
      CallbackService.getAvailableCallbackNumbers(companyId).then((res) => {
        if (res?.data?.data?.length > 12) {
          this.callbackNumberItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
        if (res?.data?.data?.length === 0) {
          this.callbackNumberItems = []
          return
        }
        if (res?.data?.data?.length <= 12) {
          this.callbackNumberItems = Array.from({ length: res.data.data.length }, (_, i) => i + 1)
        }
      })
    },
    closeConfigureNewCompanyDialog() {
      this.isShowConfigureNewCompany = false
      this.cancelForm()
    },
    handleSave() {
      if (this.activeStep === this.totalStep && this.$refs.refStep4Form.validate()) {
        this.saveDisable = true
        if (!this.formData.IsNumberOfUsersLimited) this.formData.NumberOfUsers = 9999
        this.formData.LicenseTypeName = this.licenceTypes.find((item) => {
          return item.resourceId === this.formData.LicenseTypeResourceId
        }).name
        const [startFirstPart, startSecondPart, startThirdPart] =
          this.formData?.LicenseStartDate?.split(' ')?.[0]?.split('/') || []
        const [endFirstPart, endSecondPart, endThirdPart] =
          this.formData?.LicenseEndDate?.split(' ')?.[0]?.split('/') || []
        let LicenseStartDate, LicenseEndDate
        if (this.dateFormat === 'YYYY/MM/DD') {
          LicenseStartDate = `${startFirstPart}-${startSecondPart}-${startThirdPart}`
          LicenseEndDate = `${endFirstPart}-${endSecondPart}-${endThirdPart}`
        } else if (this.dateFormat === 'MM/DD/YYYY') {
          LicenseStartDate = `${startThirdPart}-${startFirstPart}-${startSecondPart}`
          LicenseEndDate = `${endThirdPart}-${endFirstPart}-${endSecondPart}`
        } else {
          LicenseStartDate = `${startThirdPart}-${startSecondPart}-${startFirstPart}`
          LicenseEndDate = `${endThirdPart}-${endSecondPart}-${endFirstPart}`
        }

        const payload = { ...this.formData, LicenseStartDate, LicenseEndDate }
        if (!this.isCallbackSelected) {
          delete payload.CallBackNumberBookingCount
        }

        if (this.edit) {
          updateCompany(this.selectedExtend.resourceId, payload)
            .then(() => {
              this.saveDisable = false
              this.cancelForm()
            })
            .catch(() => {
              this.saveDisable = false
            })
        } else {
          createCompany(payload)
            .then((response) => {
              const {
                data: { data }
              } = response
              this.createdCompanyResourceId = data.resourceId
              this.saveDisable = false
              this.isShowConfigureNewCompany = true
            })
            .catch(() => {
              this.saveDisable = false
            })
        }
      }
    },
    handleLicenseTypeChange(resourceId = '') {
      const selectedLicenceType = this.licenceTypes.find((item) => item.resourceId === resourceId)
      this.formData.LicenseModuleResourceIdArray =
        selectedLicenceType?.licenseModules?.reduce((acc, item) => {
          if (item.isAvailable) {
            acc.push(item.resourceId)
          }
          return acc
        }, []) || []
    },
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 3) {
        isFormValid = this.$refs.refStep3Form.validate()
      } else if (this.activeStep === 2) {
        if (this.callbackNumberItems.length === 0 && this.isCallbackSelected) {
          this.isWarningModalVisible = true
          return
        }
        isFormValid = this.$refs.refStep2Form.validate()
      } else if (this.activeStep === 1) {
        isFormValid = this.$refs.refStep1Form.validate()
      }
      if (isFormValid) {
        this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
      } else {
        if (this.activeStep === 1) {
          return this.$nextTick(() => {
            const el = this.$refs.refStep1Form.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        } else if (this.activeStep === 2) {
          return this.$nextTick(() => {
            const el = this.$refs.refStep2Form.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
        return this.$nextTick(() => {
          const el = this.$refs.refStep3Form.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      return isFormValid
    },
    prevStep() {
      this.activeStep = this.activeStep <= 1 ? 1 : this.activeStep - 1
    },
    onFileChanged(file) {
      this.formData.logoURL = ''
      this.formData.File = file
    },
    cancelForm() {
      this.formData = []
      this.LicenseDates = []
      this.activeStep = 1
      this.$emit('cancelForm')
    },
    expiryPeriodValidation(value) {
      let validation = true
      if (!value) {
        validation = 'Required'
      }
      return validation
    },
    expiryPeriodChange() {
      let end = new Date()
      let start = new Date()
      if (this.formData.LicenseStartDate) {
        const [datePart, timePart] = this.formData?.LicenseStartDate?.split(' ') || []
        const [firstPart, secondPart, thirdPart] = datePart?.split('/') || []
        let minutes, hours
        if (this.timeFormat && this.timeFormat === '12h') {
          // remove PM - AM part
          const [hoursPart, minutesPart] = timePart?.split(' ')?.[0]?.split(':') || []
          minutes = minutesPart
          hours = hoursPart
        } else {
          const [hoursPart, minutesPart] = timePart?.split(':') || []
          minutes = minutesPart
          hours = hoursPart
        }
        if (this.dateFormat === 'YYYY/MM/DD') {
          start = new Date(firstPart, secondPart - 1, thirdPart, hours, minutes)
        } else if (this.dateFormat === 'MM/DD/YYYY') {
          start = new Date(thirdPart, firstPart - 1, secondPart, hours, minutes)
        } else if (this.dateFormat === 'DD/MM/YYYY') {
          start = new Date(thirdPart, secondPart - 1, firstPart, hours, minutes)
        } else {
          start = new Date(thirdPart, secondPart - 1, firstPart, hours, minutes)
        }
      }
      if (this.formData.LicensePeriodTypeResourceId === 'HTHpWWXGJshG') {
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 365) // 1 year
        this.formData.LicenseStartDate = this.$moment(start).format(
          `${this.dateFormat} ${this.getTimeFormat}`
        )
        this.formData.LicenseEndDate = this.$moment(end).format(
          `${this.dateFormat} ${this.getTimeFormat}`
        )
      } else if (this.formData.LicensePeriodTypeResourceId === '6EXwfaM5ZDT4') {
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 3) // 3 year
        this.formData.LicenseStartDate = this.$moment(start).format(
          `${this.dateFormat} ${this.getTimeFormat}`
        )
        this.formData.LicenseEndDate = this.$moment(end).format(
          `${this.dateFormat} ${this.getTimeFormat}`
        )
      }
    },
    editStepLock() {
      this.stepLock = false
    }
  }
}
</script>
