<template>
  <div class="fullscreen-form company-create-modal">
    <v-card flat light class="header">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-domain</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0 mb-0">
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
                <v-list-item-content class="mb-0">
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
                    <label class="bottom-margin">{{ labels.CompanyName }}</label>
                    <InputCompany v-model.trim="formData.Name" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">{{ labels.Description }}</label>
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
                      :rules="[
                        (v) => validations.required(v),
                        (v) =>
                          validations.maxLength(
                            v,
                            300,
                            labels.getMaxLengthMessage(labels.Description, 300)
                          )
                      ]"
                      autocomplete="disabled"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">{{ labels.Industry }}</label>
                    <k-select
                      type="autocomplete"
                      :items="industries"
                      v-model="formData.IndustryResourceId"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select industry"
                      :rules="[(v) => validations.required(v)]"
                      hint="*Required"
                      :menu-props="{ offsetY: true }"
                      persistent-hint
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Country</label>
                    <k-select
                      type="autocomplete"
                      v-model="formData.CountryResourceId"
                      :items="countries"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select country"
                      :rules="[(v) => validations.required(v)]"
                      hint="*Required"
                      :menu-props="{ offsetY: true }"
                      persistent-hint
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">{{ labels.Address }}</label>
                    <v-textarea
                      placeholder="Enter company address"
                      outlined
                      dense
                      no-resize
                      v-model="formData.Address"
                      :rules="[
                        (v) =>
                          validations.maxLength(
                            v,
                            300,
                            labels.getMaxLengthMessage(labels.Address, 200)
                          )
                      ]"
                      autocomplete="disabled"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">{{ labels.WebsiteUrl }}</label>
                    <InputUrl
                      :persistent-hint="false"
                      hint=""
                      v-model="formData.WebsiteUrl"
                      :rules="[
                        (v) => {
                          return v === '' || v === null || validations.url(v)
                        },
                        (v) =>
                          validations.maxLength(
                            v,
                            2000,
                            labels.getMaxLengthMessage(labels.WebsiteUrl, 2000)
                          )
                      ]"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">{{ labels.CompanyLogo }}</label>
                    <k-file-upload
                      @inputFile="onFileChanged"
                      hint="Upload gif, png, jpg, svg. Suggested size: 180px * 60px"
                    />
                    <div>
                      <img
                        v-if="edit && this.formData.logoURL"
                        :src="this.formData.logoURL"
                        style="max-height: 60px; object-fit: contain; margin-top: 16px;"
                      />
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-switch
                      :ripple="false"
                      v-model="formData.statusId"
                      dense
                      :label="formData.statusId == '1' ? 'Active' : 'Inactive'"
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
                    <label class="bottom-margin">{{ labels.LicenceType }}</label>
                    <k-select
                      :items="licenceTypes"
                      v-model="formData.LicenseTypeResourceId"
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
                      v-for="item in allModuleLicences"
                      :key="item.resourceId"
                      v-model="formData.LicenseModuleResourceIdArray"
                      :disabled="stepLock"
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
                  <v-list-item-content class="mb-2">
                    <label class="bottom-margin">{{ labels.ExpiryPeriod }}</label>
                    <k-select
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
                      :menu-props="{ offsetY: true }"
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
                    </k-select>
                    <el-form>
                      <el-form-item
                        class="mt-2"
                        v-show="
                          !stepLock && formData.LicensePeriodTypeResourceId === 'MaR9NJslgSGW'
                        "
                        prop="LicenseDates"
                        :error="datePickerValidation()"
                      >
                        <InputDate
                          v-model="LicenseDates"
                          type="daterange"
                          :picker-options="datePickerOptions"
                          :rules="[(v) => !!v || 'Required']"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          @change="dataPickerChange"
                          :disabled="stepLock"
                        />
                      </el-form-item>
                    </el-form>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label>{{ labels.NumberOfUsers }}</label>
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
                <v-list-item-content class="mb-0">
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
                    <k-select
                      type="autocomplete"
                      :items="companyGroupList"
                      v-model="formData.CompanyGroupResourceIdArray"
                      chips
                      clearable
                      item-text="name"
                      item-value="resourceId"
                      multiple
                      small-chips
                      deletable-chips
                      outlined
                      placeholder="Select company groups (optional)"
                    ></k-select>
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 4 -->
            <v-stepper-content step="4">
              <v-list-item>
                <v-list-item-content class="mb-0">
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
                    <k-select
                      v-model="formData.NotificationTemplateTypeResourceId"
                      :items="notificationTemplates"
                      :return-object="false"
                      class="tlp-select"
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
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle class="tlp_subtitle">{{
                            item.description
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </k-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">Training Content</label>
                    <k-select
                      v-model="formData.TrainingContentTypeResourceId"
                      :items="trainingContents"
                      :return-object="false"
                      class="tlp-select"
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
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle class="tlp_subtitle">{{
                            item.description
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </k-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="bottom-margin">SMTP Configurations</label>
                    <k-select
                      v-model="formData.SmtpConfigurationTypeResourceId"
                      :items="smtpConfigurations"
                      :return-object="false"
                      class="tlp-select"
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
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle class="tlp_subtitle">{{
                            item.description
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </k-select>
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
                        <InputUrl
                          placeholder="https://doc.sitename.com/"
                          v-model="formData.ReleaseNotesUrl"
                        ></InputUrl>
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
          >{{ labels.Cancel }}</v-btn
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
          {{ labels.Back }}
        </v-btn>

        <v-btn
          v-if="canNext"
          class="playbook-rule-form__button"
          style="color: white;"
          rounded
          color="#2196f3"
          @click="nextStep"
        >
          {{ labels.Next }}
        </v-btn>

        <v-btn
          v-if="!canNext"
          class="playbook-rule-form__button white--text"
          rounded
          color="#2196f3"
          @click="handleSave"
          :disabled="saveDisable"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import * as validations from '@/utils/validations'
import {
  createCompany,
  searchCompanies,
  searchCompanyGroups,
  updateCompany
} from '../../api/company'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { scrollToComponent } from '@/utils/functions'
import { getLicences, getLookupListByTypeIdList } from '@/api/common'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputCompany from '@/components/Common/Inputs/InputCompany'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import InputDate from '@/components/Common/Inputs/InputDate'

export default {
  name: 'CompanyCreateOrEdit',
  props: {
    edit: { type: Boolean, default: false },
    selectedRow: { type: Object },
    selectedExtend: { type: Object }
  },
  components: { KSelect, InputCompany, InputUrl, KFileUpload, InputDate },
  data() {
    return {
      saveDisable: false,
      labels,
      stepLock: false,
      totalStep: 4,
      activeStep: 1,
      allModuleLicences: [],
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
        LicenseTypeName: '',
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
        LicenseModuleResourceIdArray: [],
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
      validations: validations,
      companyGroupPayload: {
        pageSize: 3000,
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
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
    this.getLookupContents()
    this.getCompanyGroups()

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
      this.formData.statusId = this.selectedExtend.statusId.toString()
      this.LicenseDates = [this.formData.LicenseStartDate, this.formData.LicenseEndDate]
      Array.isArray(this.selectedExtend.companyGroups) &&
        this.selectedExtend.companyGroups.forEach((x) => {
          this.formData.CompanyGroupResourceIdArray.push(x.resourceId)
          this.companyGroupList.push(x)
        })
    }
  },
  methods: {
    getLookupContents() {
      Promise.all([
        getLookupListByTypeIdList({ typeidlist: [1, 2, 4, 5, 6, 7] }),
        getLicences()
      ]).then((responses) => {
        const res = responses[0].data.data
        this.countries = res.filter((item) => item.genericCodeTypeId === 1)
        this.industries = res.filter((item) => item.genericCodeTypeId === 2)
        this.expiryPeriods = res.filter((item) => item.genericCodeTypeId === 4)
        this.notificationTemplates = res.filter((item) => item.genericCodeTypeId === 5)
        this.trainingContents = res.filter((item) => item.genericCodeTypeId === 6)
        this.smtpConfigurations = res.filter((item) => item.genericCodeTypeId === 7)
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
          }
        }
      })
    },
    getCompanyGroups() {
      searchCompanyGroups(this.companyGroupPayload)
        .then((response) => {
          const { data: { data = [] } = [] } = response
          this.companyGroupList = data.results
        })
        .catch((error) => {})
    },
    handleSave() {
      if (this.activeStep === this.totalStep && this.$refs.refStep4Form.validate()) {
        this.saveDisable = true
        !this.formData.IsNumberOfUsersLimited ? (this.formData.NumberOfUsers = 9999) : null
        this.formData.LicenseTypeName = this.licenceTypes.find((item) => {
          return item.resourceId === this.formData.LicenseTypeResourceId
        }).name

        if (this.edit) {
          updateCompany(this.selectedExtend.resourceId, this.formData)
            .then(() => {
              this.saveDisable = false
              this.cancelForm()
            })
            .catch(() => {
              this.saveDisable = false
            })
        } else {
          createCompany(this.formData)
            .then(() => {
              this.saveDisable = false
              this.cancelForm()
            })
            .catch(() => {
              this.saveDisable = false
            })
        }
      }
    },
    handleLicenseTypeChange(resourceId = '') {
      const selectedLicenceType = this.licenceTypes.find((item) => item.resourceId === resourceId)
      const licenceModules = selectedLicenceType.licenseModules.reduce((acc, item) => {
        acc.push(item.resourceId)
        return acc
      }, [])
      this.formData.LicenseModuleResourceIdArray = licenceModules
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
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
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
    margin-bottom: 18px;
    overflow: visible;
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
  overflow: visible;
  .v-stepper__items {
    //overflow: visible;
  }
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
.company-checkbox__container {
  .k-checkbox:nth-child(n) {
    min-width: 200px;
  }
  .k-checkbox:nth-child(2n) {
    margin-left: 120px;
  }
}
</style>
