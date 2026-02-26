<template>
  <app-modal
    v-if="status"
    icon-name="mdi-account-outline"
    class-name="create-edit-system-user"
    confirm-button-id="btn-save--system-users-people-modal"
    cancel-button-id="btn-cancel--system-users-people-modal"
    title-id="text--create-system-users-modal-title"
    :status="status"
    :title="getTitle"
    :saveDisable="saveDisable"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template v-slot:overlay-body>
      <send-welcome-email-to-new-user-modal
        v-if="false"
        :status="showWelcomeEmailModal"
        @closeOverlay="toggleWelcomeEmailModal"
        @sendEmail="handleSendEmail"
      />
      <app-modal-body-header :title="getBodyTitle" sub-title="Fill information below" />
      <create-or-edit-system-user-form
        ref="refForm"
        :form-values="formValues"
        :role-items="roleItems"
        :status-items="statusItems"
        :isSameUser="isSameUser"
        @on-status-change="handleChangeStatus"
      />
      <form-group v-if="selectedRow">
        <v-btn
          id="btn-send-information-email--system-users-people-modal"
          class="white--text btn-util"
          color="#2196f3"
          rounded
          :disabled="sendInformationEmailDisabled"
          @click="callForSendInformationEmail(selectedRow.resourceId)"
        >
          <v-icon class="ml-0" left color="#fff">mdi-email</v-icon>
          Send Information Email
        </v-btn></form-group
      >
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import SendWelcomeEmailToNewUserModal from '@/components/SystemUsers/SendWelcomeEmailToNewUserModal'
import {
  createSystemUser,
  sendInformationEmail,
  updateSystemUser,
  getAvailableSystemUsersRole
} from '@/api/systemUsers'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import jwt_decode from 'jwt-decode'
import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm'
import SystemUserModel from '@/components/SystemUsers/system-user-model'
import CookieKeys from '@/model/constants/cookieKeys'
import countryDefaultValues from '@/utils/countryDefaultValues'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateOrEditSystemUser',
  components: {
    CreateOrEditSystemUserForm,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    SendWelcomeEmailToNewUserModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object
    },
    createdCompanyResourceId: {
      type: String
    },
    isSameUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      role: null,
      saveDisable: false,
      sendInformationEmailDisabled: false,
      initialFormValues: null,
      formValues: new SystemUserModel(),
      showWelcomeEmailModal: false,
      statusItems: [
        { name: 'Active', val: 1 },
        { name: 'Inactive', val: 0 }
      ],
      roleItems: []
    }
  },
  computed: {
    ...mapGetters({
      getCountryName: 'whitelabel/getCountryName'
    }),
    getTitle() {
      return this.selectedRow ? 'Edit System User' : 'New System User'
    },
    getBodyTitle() {
      return this.selectedRow ? 'Edit System User' : 'Create New System User'
    }
  },
  watch: {
    getCountryName: {
      immediate: true,
      handler(val) {
        if (!!this.selectedRow || !val) return
        const countryDefaultValuesIndex = countryDefaultValues.findIndex(
          (country) => country.name === val
        )
        if (countryDefaultValuesIndex !== -1) {
          this.formValues.phoneNumber =
            countryDefaultValues[countryDefaultValuesIndex].phoneNumberCode
          this.formValues.timeZoneId = countryDefaultValues[countryDefaultValuesIndex].timezone
        }
      }
    }
  },
  async created() {
    if (!this.selectedRow) {
      this.initialFormValues = structuredClone(this.formValues)
    }
    try {
      const response = await getAvailableSystemUsersRole()
      let allRoles = response.data.data
      let availableRoles = allRoles
      if (this.selectedRow) {
        const {
          firstName,
          lastName,
          phoneNumber,
          roles,
          statusName,
          email,
          statusId
        } = this.selectedRow
        this.formValues.firstName = firstName
        this.formValues.lastName = lastName
        this.formValues.statusName = statusName
        this.formValues.email = email
        this.formValues.statusId = statusId
        this.formValues.phoneNumber =
          typeof phoneNumber === 'number' ? phoneNumber.toString() : phoneNumber || ''
        const resourceId =
          allRoles?.find((item) => {
            return item.name === roles
          })?.resourceId || ''
        if (resourceId) this.formValues.roleResourceIdList = resourceId
        availableRoles = allRoles
        this.setRoleItems(availableRoles)
      } else {
        this.setRoleItems(availableRoles)
        this.setDefaultRole(availableRoles)
      }
      this.initialFormValues = structuredClone(this.formValues)
    } catch {}
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.refForm.resetValidation()
    })
    let token = JSON.parse(localStorage.getItem(CookieKeys.AUTH_KEY)).token
    let tokenData = jwt_decode(token)
    this.role = tokenData?.role || ''
  },
  methods: {
    setRoleItems(availableRoles = []) {
      this.roleItems = availableRoles.map((item) => {
        return {
          name: item.name,
          resourceId: item.resourceId
        }
      })
    },
    setDefaultRole(availableRoles = []) {
      if (availableRoles && availableRoles.length) {
        const roleIndex = availableRoles.findIndex((role) => role.name === 'Company Admin')
        if (roleIndex !== -1 && availableRoles[roleIndex].resourceId) {
          this.formValues.roleResourceIdList = availableRoles[roleIndex].resourceId
        }
      }
    },
    callForSendInformationEmail(resourceId = '') {
      this.sendInformationEmailDisabled = true
      sendInformationEmail(resourceId).finally(() => {
        this.sendInformationEmailDisabled = false
      })
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (isChanged) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeOverlay')
          }
        })
      } else {
        return this.$emit('closeOverlay')
      }
    },
    handleChangeStatus(val) {
      this.formValues.statusName = this.statusItems.find((item) => item.val === val)?.name || ''
    },
    submit() {
      const isNumberValid = this.$refs.refForm.validatePhoneNumber()
      const isFormValid = this.$refs.refForm.validate()
      if (isFormValid && isNumberValid) {
        this.saveDisable = true
        if (this.selectedRow) {
          const { phoneNumber } = this.formValues
          const formData = {
            resourceId: this.selectedRow.resourceId,
            ...this.formValues,
            phoneNumber: phoneNumber?.split(' ')?.join('')
          }
          formData.roleResourceIdList = [this.formValues.roleResourceIdList]
          this.callForUpdateSystemUser(formData)
        } else {
          const { phoneNumber } = this.formValues
          const formData = {
            ...this.formValues,
            phoneNumber: phoneNumber?.split(' ')?.join('')
          }
          formData.roleResourceIdList = [this.formValues.roleResourceIdList]
          this.callForCreateSystemUser(formData)
        }
      } else {
        this.$forceUpdate()
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    toggleWelcomeEmailModal() {
      this.showWelcomeEmailModal = !this.showWelcomeEmailModal
    },
    handleSendEmail() {
      this.toggleWelcomeEmailModal()
    },
    callForCreateSystemUser(payload) {
      if (this.createdCompanyResourceId) {
        payload.CompanyResourceId = this.createdCompanyResourceId
      }
      createSystemUser(payload)
        .then(() => {
          this.saveDisable = false
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => (this.saveDisable = false))
    },
    callForUpdateSystemUser(payload) {
      updateSystemUser(payload)
        .then(() => {
          this.saveDisable = false
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => (this.saveDisable = false))
    }
  }
}
</script>
