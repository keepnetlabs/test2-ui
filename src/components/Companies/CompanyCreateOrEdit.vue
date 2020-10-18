<template>
  <div class="fullscreen-form company-create-modal">
    <v-card flat light class="header">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-domain</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="">{{ edit ? 'Edit' : 'New' }} Company</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <div class="flex-grow-1 no-gutters">
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step :complete="activeStep > 1" step="1">Company Info</v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="activeStep > 2" step="2">License</v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="activeStep > 3" step="3">Groups</v-stepper-step>
            <v-divider />
            <v-stepper-step step="4">Content Management</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- STEP 1 -->
            <v-stepper-content step="1">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    Company Information
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Enter company information
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-form ref="refStep1Form" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content>
                    <label class="bottom-margin">Company Name</label>
                    <v-text-field
                      placeholder="Enter a name for the company"
                      outlined
                      dense
                      hint="*Required"
                      persistent-hint
                      autocomplete="off"
                      v-model.trim="formData.Name"
                      :rules="[
                        (v) => validations.required(v, 'Required'),
                        (v) => validations.maxLength(v, 150, 'Max 150 characters')
                      ]"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">Description</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Describe the company briefly
                    </v-list-item-title>
                    <v-textarea
                      placeholder="Describe the rule"
                      outlined
                      dense
                      no-resize
                      v-model="formData.Description"
                      hint="*Required"
                      persistent-hint
                      :rules="[(v) => !!v || 'Required']"
                      autocomplete="disabled"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Industry</label>
                    <v-select
                      :items="industries"
                      v-model="formData.IndustryResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select industry"
                      :rules="[(v) => !!v || 'Required']"
                      hint="*Required"
                      persistent-hint
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Country</label>
                    <v-select
                      v-model="formData.CountryResourceId"
                      :items="countries"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select country"
                      :rules="[(v) => !!v || 'Required']"
                      hint="*Required"
                      persistent-hint
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">Address</label>

                    <v-textarea
                      placeholder="Enter company address"
                      outlined
                      dense
                      no-resize
                      v-model="formData.Address"
                      autocomplete="disabled"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Website URL</label>
                    <v-text-field
                      placeholder="Enter a URL"
                      outlined
                      dense
                      autocomplete="off"
                      v-model="formData.WebsiteUrl"
                      :rules="[checkURL]"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Company Logo</label>
                    <k-file-upload
                      @inputFile="onFileChanged"
                      hint="Upload gif, png, jpg, svg. Suggested size: 180px * 60px"
                    />
                    <div>
                      <img
                        v-if="edit && this.formData.logoURL"
                        :src="this.formData.logoURL"
                        style="max-height: 60px; object-fit: contain;"
                      />
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-switch
                      :ripple="false"
                      v-model="isActive"
                      dense
                      :label="isActive ? 'Active' : 'Inactive'"
                      class="playbook-rule-form__switch"
                      color="#2196f3"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    License Information
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Define licence settings
                    <a
                      v-if="edit && stepLock"
                      @click.prevent="editStepLock"
                      class="company-create-modal__edit-link"
                      >Click here to edit</a
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-form ref="refStep2Form" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content class="mb-2">
                    <label class="bottom-margin">Licence Type</label>
                    <v-select
                      :items="licenceTypes"
                      v-model="formData.LicenseTypeResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select an option"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="stepLock"
                      hint="*Required"
                      persistent-hint
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="mb-2">
                    <label class="bottom-margin">Expiry Period</label>
                    <v-select
                      :items="expiryPeriods"
                      v-model="formData.LicensePeriodTypeResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select an option"
                      :rules="[expiryPeriodValidation]"
                      @change="expiryPeriodChange"
                      :disabled="stepLock"
                      hint="*Required"
                      persistent-hint
                    >
                      <template v-slot:selection="{ item }">
                        <span>
                          {{ item.name }}
                          <template
                            v-if="
                              (stepLock && formData.LicenseStartDate && formData.LicenseEndDate) ||
                              (item.name !== 'Custom' &&
                                formData.LicenseStartDate &&
                                formData.LicenseEndDate)
                            "
                            >({{ formData.LicenseStartDate | moment('YYYY.MM.DD') }} -
                            {{ formData.LicenseEndDate | moment('YYYY.MM.DD') }})</template
                          >
                        </span>
                      </template>
                    </v-select>
                    <el-form>
                      <el-form-item
                        class="mt-2"
                        v-show="
                          !stepLock && formData.LicensePeriodTypeResourceId === 'MaR9NJslgSGW'
                        "
                        prop="LicenseDates"
                        :error="datePickerValidation()"
                      >
                        <el-date-picker
                          v-model="LicenseDates"
                          start-placeholder="Start Date"
                          end-placeholder="End Date"
                          type="daterange"
                          :picker-options="datePickerOptions"
                          :default-time="['00:00:00']"
                          :rules="[(v) => !!v || 'Required']"
                          value-format="yyyy-MM-dd"
                          @change="dataPickerChange"
                          :disabled="stepLock"
                          hint="*Required"
                          persistent-hint
                        />
                      </el-form-item>
                    </el-form>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label>Number of users</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Number of end-users who will recieve emails and will be tracked
                    </v-list-item-title>
                    <div class="d-flex align-items-center">
                      <v-text-field
                        ref="userLimit"
                        :placeholder="
                          formData.IsNumberOfUsersLimited ? 'Enter number of users' : 'Unlimited'
                        "
                        outlined
                        dense
                        type="text"
                        autocomplete="off"
                        v-model.number="formData.NumberOfUsers"
                        :disabled="!formData.IsNumberOfUsersLimited || stepLock"
                        :rules="
                          formData.IsNumberOfUsersLimited
                            ? [
                                (v) => /^\d+$/gi.test(v) || 'Invalid number',
                                (v) => validations.required(v, 'Required')
                              ]
                            : [true]
                        "
                        hint="*Required"
                        persistent-hint
                        @keydown="onlyNumbers"
                      ></v-text-field>
                      <v-btn
                        height="40"
                        class="company-create-modal__btn-unlimited"
                        color="#2196f3"
                        text
                        @click="clickUnlimited"
                        :disabled="stepLock"
                        >{{
                          formData.IsNumberOfUsersLimited ? 'MAKE UNLIMITED' : 'LIMIT USER'
                        }}</v-btn
                      >
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    Groups that this company belongs to
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Select company groups
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-form ref="refStep3Form" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content>
                    <label class="bottom-margin">Company Groups</label>
                    <v-autocomplete
                      :items="companyGroupList"
                      v-model="formData.CompanyGroupResourceIdArray"
                      chips
                      clearable
                      item-text="name"
                      item-value="resourceId"
                      multiple
                      small-chips
                      outlined
                      placeholder="Select company groups (optional)"
                    ></v-autocomplete>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 4 -->
            <v-stepper-content step="4">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    Content Management
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Select which content this company can access
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-form ref="refStep4Form" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content>
                    <label class="bottom-margin">Notification Templates</label>
                    <v-select
                      :items="notificationTemplates"
                      v-model="formData.NotificationTemplateTypeResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      :rules="[(v) => !!v || 'Required']"
                      hint="*Required"
                      persistent-hint
                      placeholder="Select an option"
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Training Content</label>
                    <v-select
                      :items="trainingContents"
                      v-model="formData.TrainingContentTypeResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      :rules="[(v) => !!v || 'Required']"
                      hint="*Required"
                      persistent-hint
                      placeholder="Select an option"
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">SMTP Configurations</label>
                    <v-select
                      :items="smtpConfigurations"
                      v-model="formData.SmtpConfigurationTypeResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      :rules="[(v) => !!v || 'Required']"
                      hint="*Required"
                      persistent-hint
                      placeholder="Select an option"
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label>Release Information</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Show version and release notes link at the bottom of the navigation menu
                    </v-list-item-title>
                    <div>
                      <v-checkbox
                        v-model="formData.IsVersionVisible"
                        class="k-checkbox"
                        color="#2196f3"
                        :ripple="false"
                        label="Show version"
                        hide-details
                      ></v-checkbox>
                    </div>
                    <div class="d-flex justify-space-between">
                      <v-checkbox
                        v-model="formData.IsReleaseNotesVisible"
                        style="margin-top: 4px;"
                        color="#2196f3"
                        :ripple="false"
                        label="Show release notes"
                      ></v-checkbox>
                      <template v-if="formData.IsReleaseNotesVisible">
                        <label class="company-create-modal__side-label">URL</label>
                        <v-text-field
                          placeholder="https://doc.sitename.com/"
                          outlined
                          dense
                          autocomplete="off"
                          v-model="formData.ReleaseNotesUrl"
                          :rules="[checkURL, (v) => !!v || 'Required']"
                        ></v-text-field>
                      </template>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </div>
    <div class="wizard__footer">
      <div class="text-left">
        <v-btn
          class="playbook-rule-form__button"
          outlined
          rounded
          color="error"
          @click="$emit('cancelForm')"
          >CANCEL</v-btn
        >
      </div>

      <div>
        <v-btn
          v-if="canPrev"
          class="playbook-rule-form__button mr-4"
          outlined
          rounded
          color="cyan"
          @click="prevStep"
        >
          BACK
        </v-btn>

        <v-btn
          v-if="canNext"
          class="playbook-rule-form__button"
          style="color: white;"
          rounded
          color="#2196f3"
          @click="nextStep"
        >
          NEXT
        </v-btn>

        <v-btn
          v-if="!canNext"
          class="playbook-rule-form__button white--text"
          rounded
          color="#2196f3"
          @click="handleSave"
        >
          SAVE
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { maxLength, required } from '@/utils/validations'
import { getLookupListByTypeId } from '../../api/common'
import { createCompany, getCompanyGroups, searchCompanies, updateCompany } from '../../api/company'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AuthenticationService from '@/services/authentication'
import AuthenticationStatus from '@/model/constants/authenticationStatus'
import { scrollToComponent } from '@/utils/functions'

export default {
  name: 'CompanyCreateOrEdit',
  props: {
    edit: { type: Boolean, default: false },
    selectedRow: { type: Object },
    selectedExtend: { type: Object }
  },
  components: { KFileUpload },
  data() {
    return {
      stepLock: false,
      totalStep: 4,
      activeStep: 1,
      formData: {
        File: null,
        logoURL: null,
        Name: '',
        Description: '',
        IndustryResourceId: '',
        CountryResourceId: '',
        Address: '',
        WebsiteUrl: '',
        LicenseTypeResourceId: '',
        LicensePeriodTypeResourceId: '',
        LicenseStartDate: '',
        LicenseEndDate: '',
        IsNumberOfUsersLimited: true,
        NumberOfUsers: '',
        NotificationTemplateTypeResourceId: '',
        TrainingContentTypeResourceId: '',
        SmtpConfigurationTypeResourceId: '',
        IsVersionVisible: false,
        IsReleaseNotesVisible: false,
        ReleaseNotesUrl: '',
        CompanyGroupResourceIdArray: [],
        statusId: '1'
      },

      LicenseDates: [],
      isActive: true,
      expiryPeriods: [],
      countries: [],
      industries: [],
      licenceTypes: [],
      companyGroupList: [],
      notificationTemplates: [],
      trainingContents: [],
      smtpConfigurations: [],
      datePickerOptions: {
        disabledDate(date) {
          return date < new Date() - 3600 * 1000 * 24
        }
      },
      validations: {
        required,
        maxLength
      },
      nameRules: {
        required: (v) => (v && v.length <= 150) || 'Name must between 1-150 characters',
        empty: (v) => (v && !v.startsWith(' ')) || 'Name cannot start with space'
      }
    }
  },
  computed: {
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  mounted() {
    this.getCountries()
    this.getIndustries()
    this.getLicenceTypes()
    this.getExpiryPeriods()
    this.getCompanyGroups()
    this.getNotificationTemplates()
    this.getTrainingContent()
    this.getSmtpConfigurations()

    if (this.edit) {
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
      this.formData.NumberOfUsers = this.selectedExtend.isNumberOfUsersLimited
        ? this.selectedExtend.numberOfUsers
        : ''
      this.formData.NotificationTemplateTypeResourceId = this.selectedExtend.notificationTemplateTypeResourceId
      this.formData.TrainingContentTypeResourceId = this.selectedExtend.trainingContentTypeResourceId
      this.formData.SmtpConfigurationTypeResourceId = this.selectedExtend.smtpConfigurationTypeResourceId
      this.formData.IsVersionVisible = this.selectedExtend.isVersionVisible
      this.formData.IsReleaseNotesVisible = this.selectedExtend.isReleaseNotesVisible
      this.formData.ReleaseNotesUrl = this.selectedExtend.releaseNotesUrl
      this.formData.statusId = this.selectedExtend.statusId
      this.isActive = this.selectedExtend.statusId === 1 ? true : false
      this.LicenseDates = [this.formData.LicenseStartDate, this.formData.LicenseEndDate]
      Array.isArray(this.selectedExtend.companyGroups) &&
        this.selectedExtend.companyGroups.forEach((x) => {
          this.formData.CompanyGroupResourceIdArray.push(x.resourceId)
          this.companyGroupList.push(x)
        })
    }
  },
  methods: {
    getIndustries() {
      getLookupListByTypeId(2)
        .then((response) => {
          this.industries = response.data.data
        })
        .catch((error) => {})
    },
    getCountries() {
      getLookupListByTypeId(1)
        .then((response) => {
          this.countries = response.data.data
        })
        .catch((error) => {})
    },
    getLicenceTypes() {
      getLookupListByTypeId(3)
        .then((response) => {
          this.licenceTypes = response.data.data
        })
        .catch((error) => {})
    },
    getExpiryPeriods() {
      getLookupListByTypeId(4)
        .then((response) => {
          this.expiryPeriods = response.data.data
        })
        .catch((error) => {})
    },
    getNotificationTemplates() {
      getLookupListByTypeId(5)
        .then((response) => {
          this.notificationTemplates = response.data.data
        })
        .catch((error) => {})
    },
    getTrainingContent() {
      getLookupListByTypeId(6)
        .then((response) => {
          this.trainingContents = response.data.data
        })
        .catch((error) => {})
    },
    getSmtpConfigurations() {
      getLookupListByTypeId(7)
        .then((response) => {
          this.smtpConfigurations = response.data.data
        })
        .catch((error) => {})
    },
    getCompanyGroups() {
      getCompanyGroups()
        .then((response) => {
          this.companyGroupList = response.data.data.companyGroups
        })
        .catch((error) => {})
    },
    handleSave() {
      if (this.activeStep === this.totalStep && this.$refs.refStep4Form.validate()) {
        !this.formData.IsNumberOfUsersLimited ? (this.formData.NumberOfUsers = 9999) : null
        if (this.edit) {
          updateCompany(this.selectedExtend.resourceId, this.formData)
            .then((response) => {
              if (response.data && response.data.message) {
                this.$store.dispatch('common/createSnackBar', {
                  message: response.data.message,
                  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                  icon: 'mdi-check-circle-outline'
                })
              }
              this.cancelForm()
            })
            .catch((error) => {})
        } else {
          createCompany(this.formData)
            .then((response) => {
              if (response.data && response.data.message) {
                this.$store.dispatch('common/createSnackBar', {
                  message: response.data.message,
                  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                  icon: 'mdi-check-circle-outline'
                })
              }
              this.cancelForm()
            })
            .catch((error) => {})
        }
      }
    },
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 3) {
        isFormValid = this.$refs.refStep3Form.validate()
      } else if (this.activeStep === 2) {
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
        } else if (this.activeStep === 3) {
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
      this.formData.File = file
    },
    checkURL(value) {
      let validation = true
      if (value && value.length > 0) {
        if (
          !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
            value
          )
        ) {
          validation = 'Invalid URL'
        }
      }
      return validation
    },
    clickUnlimited() {
      this.formData.IsNumberOfUsersLimited = !this.formData.IsNumberOfUsersLimited
      this.formData.NumberOfUsers = ''
    },
    cancelForm() {
      this.formData = []
      this.LicenseDates = null
      this.activeStep = 1
      this.$emit('cancelForm')
    },
    datePickerValidation() {
      return this.formData.LicenseStartDate && this.formData.LicenseEndDate
        ? ''
        : 'Start and end dates should be picked'
    },
    expiryPeriodValidation(value) {
      let validation = true
      if (
        value === 'MaR9NJslgSGW' &&
        !this.formData.LicenseStartDate &&
        !this.formData.LicenseEndDate
      ) {
        validation = 'Required'
      }

      if (!value) {
        validation = 'Required'
      }
      return validation
    },
    expiryPeriodChange() {
      const end = new Date()
      const start = new Date()
      if (this.formData.LicensePeriodTypeResourceId == 'HTHpWWXGJshG') {
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 365) // 1 year
        this.formData.LicenseStartDate = this.$moment(start).format('YYYY-MM-DD')
        this.formData.LicenseEndDate = this.$moment(end).format('YYYY-MM-DD')
      } else if (this.formData.LicensePeriodTypeResourceId == '6EXwfaM5ZDT4') {
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 3) // 3 year
        this.formData.LicenseStartDate = this.$moment(start).format('YYYY-MM-DD')
        this.formData.LicenseEndDate = this.$moment(end).format('YYYY-MM-DD')
      } else {
        this.formData.LicenseStartDate = ''
        this.formData.LicenseEndDate = ''
      }
      this.LicenseDates = null
    },
    dataPickerChange() {
      this.formData.LicenseStartDate = this.LicenseDates ? this.LicenseDates[0] : ''
      this.formData.LicenseEndDate = this.LicenseDates ? this.LicenseDates[1] : ''
      this.datePickerValidation()
      this.$refs.refStep2Form.validate()
    },
    editStepLock() {
      this.stepLock = false
    },
    onlyNumbers(e) {
      //
      const key = e.charCode || e.keyCode || 0
      // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
      // home, end, period, and numpad decimal
      if (
        key == 8 ||
        key == 9 ||
        key == 13 ||
        key == 46 ||
        key == 110 ||
        key == 190 ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105)
      ) {
        return key
      } else {
        e.preventDefault()
      }
    }
  },
  watch: {
    isActive(value) {
      this.formData.statusId = value ? 1 : 2
    },
    search(val) {
      if (val && val.length > 2) {
        this.debounce(() => {
          this.payload.filter.FilterGroups[0].FilterItems[0].Value = val
          searchCompanies(this.payload)
            .then((response) => {
              this.companies =
                response.data.data.hasOwnProperty('results') &&
                response.data.data.results.length > 0
                  ? response.data.data.results
                  : []
            })
            .catch((error) => {})
        }, 500)
      }
    }
  }
}
</script>
<style lang="scss">
.company-create-modal {
  &__btn-unlimited {
    height: 40px !important;
    margin-left: 15px;
  }
  &__side-label {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    height: 40px;
    line-height: 22px;
    margin-left: 32px;
    margin-right: 8px;
  }
  &__edit-link {
    font-size: 14px;
    line-height: 21px;
    color: #2196f3;
  }
}
.fullscreen-form {
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  //overflow-y: auto;

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 6px;
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }

  .v-card.header {
    padding: 32px 96px 0 96px;
    margin-bottom: 24px;
    flex-shrink: 0;
    @media (max-width: 768px) {
      padding: 2rem 2rem;
    }

    .v-btn__icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      margin-right: 24px;
      box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
      border: solid 1px rgba(100, 181, 246, 0.5);
      background-color: #e3f2fd;
    }

    .v-list-item__title {
      font-size: 20px;
      font-weight: 600;
      color: #2196f3;
      line-height: 24px;
    }
  }

  &__radio-group {
    .v-input--selection-controls {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }

    .v-input__slot {
      margin-bottom: 0 !important;
    }

    .v-messages.theme--light {
    }

    .v-input--selection-controls.v-input .v-label {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  &__switch {
    margin-top: 24px;
    padding-top: 0;

    .v-input--selection-controls__input {
      order: -1;
      margin-top: 1px;
    }

    .v-label {
      order: -2;
      font-size: 14px;
      font-weight: 600;
      margin-right: 16px;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }

  .hide-caret {
    .v-input__append-inner {
      display: none !important;
    }
  }

  .v-stepper__items {
    padding-bottom: 68px;
  }

  .v-list-item__content {
    padding: 0;
  }

  .v-autocomplete:not(.v-input--is-focused).v-select--chips input {
    max-height: initial;
  }

  &__button {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
  }
}

.wizard {
  align-self: stretch;
  box-shadow: none;

  &__header.v-stepper__header {
    justify-content: flex-start;
    padding: 0 6rem;
    height: 4rem;
    box-shadow: none;
    background-color: #f5f7fa;
    @media (max-width: 768px) {
      padding: 0 3rem;
    }

    .v-divider {
      max-width: 65px;
      border-color: #757575 !important;
      margin: 0px -8px;
    }

    & > div:nth-child(1) {
      padding-left: 0;
    }

    .v-stepper__step {
      padding: 0 24px;

      .v-stepper__step__step {
        font-size: 14px;
        line-height: 24px;
      }
    }

    .v-stepper__step--active {
      .v-stepper__step__step {
        background-color: transparent !important;
        color: #2196f3 !important;
        border: 1px solid #2196f3 !important;
      }
    }

    .v-stepper__step--inactive {
      .v-stepper__step__step {
        background-color: transparent !important;
        color: #909399 !important;
        border: 1.5px solid #909399 !important;
      }

      .v-stepper__label {
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }

    .v-stepper__step--complete {
      .v-stepper__step__step {
        background-color: #2196f3 !important;
        color: white !important;

        .v-icon.v-icon {
          font-size: 1.325rem;
        }
      }

      .v-stepper__label {
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }
  }

  .v-stepper__content {
    padding: 32px 6rem;
    @media (max-width: 768px) {
      padding: 32px 1rem;
    }

    .v-stepper__wrapper {
      overflow: visible;
    }
  }

  &__footer {
    justify-content: space-between;
    padding: 16px 6rem;
    align-items: center;
    background-color: #f5f7fa;
    height: 68px;
    display: flex;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 999;
  }

  .v-list-item {
    padding: 0;
    max-width: 554px !important;

    &__content {
      & > label {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
      }

      .bottom-margin {
        margin-bottom: 8px;
      }

      .v-radio {
        label {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
