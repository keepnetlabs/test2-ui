<template>
  <AppModal
    :status="status"
    icon-name="mdi-briefcase-variant"
    :title="labels.NewCompanyQuickSetup"
    class-name="add-in-configuration"
    title-id="text--configure-new-company-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--configure-new-company-white-labeling"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.WhiteLabeling }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-first-system-user"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.FirstSystemUser }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-next-steps"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.NextSteps }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              :title="labels.WhiteLabeling"
              :subtitle="labels.WhiteLabelingSubTitle"
            />
            <WhiteLabeling
              ref="refWhiteLabeling"
              is-company-configure
              :created-company-id="createdCompanyResourceId"
              @on-configure-company-submit="saveWhiteLabeling"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-6"
              :title="labels.CreateFirstSystemUser"
              :subtitle="labels.CreateFirstSystemUserSubTitle"
            />
            <CreateOrEditSystemUserForm
              ref="refForm"
              :form-values="systemUserFormData"
              :status-items="statusItems"
              :role-items="roleItems"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              :title="labels.NextSteps"
              :subtitle="labels.NextStepsSubTitle"
            />
            <ConfigureNewCompanyNextSteps />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <v-btn
        id="btn-cancel--configure-new-company-modal"
        class="add-in-configuration__footer-btn-cancel"
        rounded
        @click="closeOverlay"
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          v-if="step > 1"
          id="btn-back--configure-new-company-modal"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          @click="changeStep(-1)"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          v-if="step === 2"
          id="btn-skip--configure-new-company-modal"
          class="add-in-configuration__footer-btn-next mr-4"
          color="#00BCD4"
          rounded
          @click="changeStep()"
        >
          {{ labels.Skip }}
        </v-btn>

        <v-btn
          id="btn-next-or-save--configure-new-company-modal"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :style="[1, 2].includes(step) && { width: '176px' }"
          :disabled="isSaveDisabled"
          @click="handleSaveAndContinue"
        >
          {{
            [1, 2].includes(step) ? labels.SaveAndContinue : step === 3 ? labels.Close : labels.Next
          }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import WhiteLabeling from '@/components/Company Settings/WhiteLabeling'
import { getDefaultAxiosPayload, scrollToComponent } from '@/utils/functions'
import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm'
import SystemUserModel from '@/components/SystemUsers/system-user-model'
import { createSystemUser, getSystemUsersRole } from '@/api/systemUsers'
import ConfigureNewCompanyNextSteps from '@/components/Companies/ConfigureNewCompanyNextSteps'
import { updateWhiteLabel } from '@/api/whitelabel'
export default {
  name: 'ConfigureNewCompanyModal',
  components: {
    ConfigureNewCompanyNextSteps,
    CreateOrEditSystemUserForm,
    WhiteLabeling,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    createdCompanyResourceId: {
      type: String
    }
  },
  data() {
    return {
      labels,
      isSaveDisabled: false,
      step: 1,
      systemUserFormData: new SystemUserModel(),
      statusItems: [
        { name: 'Active', val: 1 },
        { name: 'Inactive', val: 0 }
      ],
      roleItems: []
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    callForCreateSystemUser(payload) {
      if (this.createdCompanyResourceId) {
        payload.CompanyResourceId = this.createdCompanyResourceId
      }
      createSystemUser(payload)
        .then(() => {
          this.changeStep()
        })
        .finally(() => (this.isSaveDisabled = false))
    },
    closeOverlay() {
      this.$emit('on-close')
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    getRoles() {
      let payload = getDefaultAxiosPayload({ pageSize: 1000 }, 'RoleName')
      let allRoles = []
      let availableRoles = []
      getSystemUsersRole(payload).then((response) => {
        allRoles = response.data.data
        availableRoles = []
        availableRoles = allRoles
        this.roleItems = availableRoles.map((item) => {
          return {
            name: item.name,
            resourceId: item.resourceId
          }
        })
        this.systemUserFormData.roleResourceIdList =
          availableRoles &&
          availableRoles.length &&
          availableRoles.find((role) => ['CompanyAdmin', 'Company Admin'].includes(role.name))
            .resourceId
      })
    },
    handleChangeStatus(val) {
      this.systemUserFormData.statusName = this.statusItems.find((item) => item.val === val).name
    },
    saveWhiteLabeling(refWhiteLabeling = this.$refs.refWhiteLabeling || {}) {
      const formData = new FormData()
      const id = refWhiteLabeling.configureCompanyWhitelabelingResourceId
      const payload = refWhiteLabeling.formValues
      Object.keys(payload).forEach((key) => {
        formData.append(key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1), payload[key])
      })
      updateWhiteLabel(formData, id, {
        headers: { 'X-IR-COMPANY-ID': this.createdCompanyResourceId }
      })
        .then(() => {
          refWhiteLabeling.formValues.acceptDnsRecordSettings = false
          refWhiteLabeling.acceptedDnsRecordSettingsDomain = ''
          refWhiteLabeling.isWhiteLabelLoading = false
          refWhiteLabeling.isShowDomainDialog = false
          this.changeStep()
        })
        .catch((e) => {
          if (e && e.response && e.response.status === 404) {
            const [title, message] = e?.response?.data?.validationMessages || []
            refWhiteLabeling.whiteLabelingErrorMessage = message
            refWhiteLabeling.whiteLabelingErrorTitle = title
            refWhiteLabeling.acceptedDnsRecordSettingsDomain =
              refWhiteLabeling.formValues.mainDomainUrl
            refWhiteLabeling.toggleWhiteLabelingDomainDialog()
          }
        })
    },
    handleSaveAndContinue() {
      const { refWhiteLabeling } = this.$refs
      if (this.step === 1) {
        if (refWhiteLabeling?.$refs?.refForm?.validate?.()) {
          this.saveWhiteLabeling(refWhiteLabeling)
        }
        return
      }

      if (this.step === 2) {
        const isNumberValid = this.$refs.refForm.validatePhoneNumber()
        const isFormValid = this.$refs.refForm.validate()
        if (isFormValid && isNumberValid) {
          this.isSaveDisabled = true
          const { phoneNumber } = this.systemUserFormData
          const formData = {
            ...this.systemUserFormData,
            phoneNumber: phoneNumber?.split(' ')?.join('')
          }
          formData.roleResourceIdList = [this.systemUserFormData.roleResourceIdList]
          this.callForCreateSystemUser(formData)
        } else {
          this.$forceUpdate()
          this.$nextTick(() => {
            const el = this.$refs.refForm.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
        return
      }
      if (this.step === 3) {
        this.closeOverlay()
      }
    }
  }
}
</script>
