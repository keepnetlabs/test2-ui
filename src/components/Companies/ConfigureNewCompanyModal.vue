<template>
  <AppModal
    :status="status"
    icon-name="mdi-briefcase-variant"
    :title="labels.NewCompanyQuickSetup"
    class-name="add-in-configuration"
    title-id="text--configure-new-company-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template v-slot:overlay-body>
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
            id="step--configure-new-company-white-listing"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.WhiteListing }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-first-system-user"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.FirstSystemUser }}</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--configure-new-company-next-steps"
            class="k-stepper__step"
            :complete="step > 4"
            :step="4"
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
              :PERMISSIONS="PERMISSIONS['WHITE_LABEL_PERMISSIONS']"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              :title="labels.WhiteListing"
              :subtitle="labels.WhiteListingSubTitle"
            />
            <WhiteListing />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
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
          <v-stepper-content class="k-stepper__content" :step="4">
            <ConfigureCompanyStepHeader
              :title="labels.NextSteps"
              :subtitle="labels.NextStepsSubTitle"
            />
            <ConfigureNewCompanyNextSteps />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template v-slot:overlay-footer>
      <v-btn
        @click="closeOverlay"
        id="btn-cancel--configure-new-company-modal"
        class="add-in-configuration__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          @click="changeStep(-1)"
          id="btn-back--configure-new-company-modal"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          @click="changeStep()"
          id="btn-skip--configure-new-company-modal"
          class="add-in-configuration__footer-btn-next mr-4"
          color="#00BCD4"
          rounded
          v-if="step === 3"
        >
          {{ labels.Skip }}
        </v-btn>

        <v-btn
          id="btn-next--phishing-reporter-settings-add-in-configuration"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :style="[1, 3].includes(step) && { width: '176px' }"
          :disabled="isSaveDisabled"
          @click="handleSaveAndContinue"
        >
          {{
            [1, 3].includes(step) ? labels.SaveAndContinue : step === 4 ? labels.Close : labels.Next
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
import PERMISSIONS from '@/permissions'
import { getPermissionsOfAllItems, scrollToComponent } from '@/utils/functions'
import WhiteListing from '@/components/Company Settings/WhiteListing'
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
    WhiteListing,
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
      PERMISSIONS: {
        WHITE_LABEL_PERMISSIONS: {}
      },
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
    this.getPermissions()
    this.getRoles()
  },
  methods: {
    closeOverlay() {
      this.$emit('on-close')
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    getRoles() {
      let payload = {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'RoleName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
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
          availableRoles.find((role) => role.name === 'CompanyAdmin').resourceId
      })
    },
    getPermissions() {
      const { WHITE_LABEL_PERMISSIONS } = PERMISSIONS
      this.$set(
        this.PERMISSIONS,
        'WHITE_LABEL_PERMISSIONS',
        getPermissionsOfAllItems(WHITE_LABEL_PERMISSIONS)
      )
    },
    handleChangeStatus(val) {
      this.systemUserFormData.statusName = this.statusItems.find((item) => item.val === val).name
    },
    handleSaveAndContinue() {
      const { refWhiteLabeling } = this.$refs
      switch (this.step) {
        case 1:
          if (refWhiteLabeling.$refs.refForm.validate()) {
            const formData = new FormData()
            const id = refWhiteLabeling.configureCompanyWhitelabelingResourceId
            const payload = refWhiteLabeling.formValues

            Object.keys(payload).map((key) => {
              formData.append(key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1), payload[key])
            })
            updateWhiteLabel(formData, id, {
              headers: { 'X-IR-COMPANY-ID': this.createdCompanyResourceId }
            }).then(() => {
              this.changeStep()
            })
          }
          break
        case 2:
          this.changeStep()
          break
        case 3:
          const isNumberValid = this.$refs.refForm.validatePhoneNumber()
          const isFormValid = this.$refs.refForm.validate()
          if (isFormValid && isNumberValid) {
            this.isSaveDisabled = true
            const { phoneNumber } = this.systemUserFormData
            const formData = {
              ...this.systemUserFormData,
              phoneNumber: phoneNumber.split(' ').join('')
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
          break
        case 4:
          this.closeOverlay()
      }
    },
    callForCreateSystemUser(payload) {
      if (this.createdCompanyResourceId) {
        payload.CompanyResourceId = this.createdCompanyResourceId
      }

      createSystemUser(payload)
        .then(() => {
          this.changeStep()
        })
        .finally(() => (this.isSaveDisabled = false))
    }
  }
}
</script>

<style lang="scss"></style>
