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
        @on-status-change="handleChangeStatus"
      />
      <form-group v-if="selectedRow">
        <v-btn
          id="btn-send-information-email--system-users-people-modal"
          @click="callForSendInformationEmail(selectedRow.resourceId)"
          color="#2196f3"
          rounded
          :disabled="sendInformationEmailDisabled"
          class="white--text btn-util"
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
import { createSystemUser, sendInformationEmail, updateSystemUser } from '@/api/systemUsers'
import { scrollToComponent } from '@/utils/functions'
import { getSystemUsersRole } from '@/api/systemUsers'
import jwt_decode from 'jwt-decode'
import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm'
import SystemUserModel from '@/components/SystemUsers/system-user-model'

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
    }
  },
  data() {
    return {
      role: null,
      saveDisable: false,
      sendInformationEmailDisabled: false,
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
    getTitle() {
      return this.selectedRow ? 'Edit System User' : 'New System User'
    },
    getBodyTitle() {
      return this.selectedRow ? 'Edit System User' : 'Create New System User'
    }
  },
  methods: {
    callForSendInformationEmail(resourceId = '') {
      this.sendInformationEmailDisabled = true
      sendInformationEmail(resourceId).finally(() => {
        this.sendInformationEmailDisabled = false
      })
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleChangeStatus(val) {
      this.formValues.statusName = this.statusItems.find((item) => item.val === val).name
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
            phoneNumber: phoneNumber.split(' ').join('')
          }
          formData.roleResourceIdList = [this.formValues.roleResourceIdList]
          this.callForUpdateSystemUser(formData)
        } else {
          const { phoneNumber } = this.formValues
          const formData = {
            ...this.formValues,
            //roleResourceIdList: this.role,
            //companyResourceId: localStorage.getItem('companyResourceId')
            phoneNumber: phoneNumber.split(' ').join('')
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
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.refForm.resetValidation()
    })
    let token = JSON.parse(localStorage.getItem('auth-token')).token
    let tokenData = jwt_decode(token)
    this.role = tokenData.role
  },
  created() {
    let payload = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'RoleName',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'OR',
            FilterItems: [
              {
                FieldName: 'RoleName',
                Operator: 'Contains',
                Value: 'ro'
              },
              {
                FieldName: 'CompanyName',
                Operator: 'Contains',
                Value: 'ro'
              }
            ],
            FilterGroups: []
          },
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'TypeId',
                Operator: 'Include',
                Value: '1,2'
              }
            ],
            FilterGroups: []
          }
        ]
      }
    }
    let _this = this
    let allRoles = []
    let availableRoles = []
    getSystemUsersRole(payload).then((response) => {
      allRoles = response.data.data
      availableRoles = []
      availableRoles = allRoles

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
        this.formValues.phoneNumber = phoneNumber
        _this.formValues.roleResourceIdList =
          allRoles &&
          allRoles.find((item) => {
            return item.name === roles
          }).resourceId
        availableRoles = allRoles
        this.roleItems = availableRoles.map((item) => {
          return {
            name: item.name,
            resourceId: item.resourceId
          }
        })
      } else {
        this.roleItems = availableRoles.map((item) => {
          return {
            name: item.name,
            resourceId: item.resourceId
          }
        })
        this.formValues.roleResourceIdList =
          availableRoles &&
          availableRoles.length &&
          availableRoles.find((role) => role.name === 'CompanyAdmin').resourceId
      }
    })
  }
}
</script>

<style lang="scss">
.phone-number-invalid {
  border-color: #ff5252 !important;
}
</style>
