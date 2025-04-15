<template>
  <AppModal
    v-if="status"
    :status="status"
    title="Set Up Your Company Profile"
    icon-name="mdi-domain"
    confirm-button-id="btn-save--certificates-template-modal"
    cancel-button-id="btn-cancel--certificates-template-modal"
    title-id="text--certificates-template-modal-title"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <AppModalBodyHeader :title="labels.CompanyProfile" :sub-title="labels.CompanyProfileSub" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup :title="labels.CompanyName" has-hint>
          <InputEntityName
            v-model.trim="formData.name"
            id="input--company-name"
            entity-name="company"
            initial-placeholder="Enter a name for the company"
          />
        </FormGroup>
        <FormGroup :title="labels.Description" sub-title="Describe the company briefly">
          <InputDescription
            v-model.trim="formData.description"
            id="input--company-description"
            :required="false"
            :max-length="300"
          />
        </FormGroup>
        <FormGroup :title="labels.Industry" has-hint>
          <KSelect
            type="autocomplete"
            v-model="formData.industryResourceId"
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
            :rules="[(v) => Validations.required(v)]"
          ></KSelect>
        </FormGroup>
        <FormGroup title="Country" has-hint>
          <KSelect
            type="autocomplete"
            v-model="formData.countryResourceId"
            id="input--company-country"
            persistent-hint
            item-text="name"
            item-value="resourceId"
            outlined
            placeholder="Select country"
            hint="*Required"
            no-data-text="No country available"
            :items="countries"
            :menu-props="{ offsetY: true }"
            :rules="[(v) => Validations.required(v)]"
          ></KSelect>
        </FormGroup>
        <FormGroup title="Timezone" has-hint>
          <InputTimezone
            v-model="formData.timeZoneId"
            hint="*Required"
            persistent-hint
            is-block
            :rules="[(v) => Validations.required(v)]"
          />
        </FormGroup>
        <FormGroup :title="labels.Address">
          <InputAddress
            v-model="formData.address"
            id="input-ip--company-address"
            initial-placeholder="Enter company address"
          />
        </FormGroup>
        <FormGroup :title="labels.Website">
          <InputUrl
            v-model="formData.websiteUrl"
            id="input--company-website-url"
            placeholder="Enter the URL of your company website"
            :required="false"
            :persistent-hint="false"
            :hint="null"
          />
        </FormGroup>
        <v-list-item class="mb-6">
          <v-list-item-content>
            <FormGroup :title="labels.CompanyLogo">
              <KFileUpload
                hint="Upload, png, jpg, svg. Suggested size: 180px * 60px. Max. file size 2MB"
                id="input--company-logo"
                :extensions="['jpg', 'jpeg', 'png', 'bmp', 'svg']"
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
            </FormGroup>
          </v-list-item-content>
        </v-list-item>
        <FormGroup
          title="Preferred Language"
          sub-title="Sort contents in this language first on lists and tables"
        >
          <KSelect
            v-model="formData.preferredLanguageTypeResourceId"
            :items="languages"
            :return-object="false"
            position="top"
            class="tlp-select"
            id="input--company-preferred-language"
            outlined
            hint="*Required"
            persistent-hint
            placeholder="Select an option"
            item-text="name"
            item-value="resourceId"
          >
          </KSelect>
        </FormGroup>
      </v-form>
    </template>
    <template #overlay-footer>
      <div class="w-100 d-flex justify-end">
        <v-btn
          class="add-user-overlay__footer-btn-save white--text"
          color="#2196f3"
          rounded
          :disabled="isActionButtonDisabled"
          @click="submit"
        >
          {{ labels.Start }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal.vue'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import InputDescription from '@/components/Common/Inputs/InputDescription.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import InputTimezone from '@/components/Common/Inputs/InputTimezone.vue'
import InputAddress from '@/components/Common/Inputs/InputAddress.vue'
import InputUrl from '@/components/Common/Inputs/InputUrl.vue'
import KFileUpload from '@/components/Common/FileUpload/FileUpload.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getCompanyByID, updateInitializeCompany } from '@/api/company'
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'InitializeCompanyModal',
  components: {
    KFileUpload,
    InputUrl,
    InputAddress,
    InputTimezone,
    KSelect,
    InputDescription,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      Validations,
      countries: [],
      industries: [],
      languages: [],
      isActionButtonDisabled: false,
      formData: {
        logoUrl: '',
        name: '',
        description: '',
        industryResourceId: '',
        timeZoneId: '',
        countryResourceId: '',
        preferredLanguageTypeResourceId: '',
        address: '',
        websiteUrl: '',
        resourceId: localStorage.getItem('companyRequestId'),
        file: null
      }
    }
  },
  computed: {
    getPreviewLogoUrl() {
      return this.formData.logoUrl || this.formData.file
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
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.callForLookups()
      this.callForCompany()
    },
    callForLookups() {
      LookupLocalStorage.getMultiple([1, 2, 21]).then((res) => {
        this.countries = res.filter((item) => item.genericCodeTypeId === 1)
        this.industries = res.filter((item) => item.genericCodeTypeId === 2)
        const languages = res?.filter((item) => item.genericCodeTypeId === 21) || []
        this.languages = [{ name: 'All Languages', resourceId: '' }, ...languages]
      })
    },
    callForCompany() {
      getCompanyByID(this.formData.resourceId, false).then((response) => {
        const { data: { data = {} } = {} } = response || {}
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = data[key]
        })
      })
    },
    onFileChanged(file) {
      this.formData.logoUrl = ''
      if (Array.isArray(file)) this.formData.file = file.length ? file : null
      else this.formData.file = file
    },
    handleClose() {
      this.$emit('on-close')
    },
    submit() {
      if (this?.$refs?.refForm?.validate()) {
        this.isActionButtonDisabled = true
        const formData = new FormData()
        for (const key in this.formData) {
          if (Array.isArray(this.formData[key])) {
            this.formData[key].forEach((x) => formData.append(key, x))
          } else {
            this.formData[key] && formData.append(key, this.formData[key])
          }
        }
        updateInitializeCompany(formData)
          .then(() => {
            this.$store.dispatch('auth/setCompanyName', this.formData.name)
            this.handleClose()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.$nextTick(() => {
          scrollToComponent(this.$refs.refForm.$el.querySelector('.error--text'))
        })
      }
    }
  }
}
</script>
