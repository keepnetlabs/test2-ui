<template>
  <app-modal
    v-if="status"
    icon-name="mdi-account-outline"
    class-name="create-edit-system-user"
    confirm-button-id="btn-save--system-users-people-modal"
    cancel-button-id="btn-cancel--system-users-people-modal"
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
      <v-form ref="refForm" lazy-validation>
        <form-group title="First Name" has-hint>
          <InputFirstName v-model.trim="formValues.firstName" />
        </form-group>
        <form-group title="Last Name" has-hint>
          <InputLastName v-model.trim="formValues.lastName" />
        </form-group>
        <form-group title="Email Address" has-hint>
          <InputEmail v-model.trim="formValues.email" />
        </form-group>
        <form-group title="Phone Number">
          <InputPhone v-model.trim="formValues.phoneNumber" ref="refPhone" />
        </form-group>
        <form-group title="Status">
          <k-select
            placeholder="Select Option"
            outlined
            dense
            :items="statusItems"
            item-text="name"
            item-value="val"
            v-model.trim="formValues.statusId"
            @change="handleChangeStatus"
          />
        </form-group>
        <form-group title="Role">
          <k-select
            placeholder="Select Option"
            outlined
            dense
            :items="roleItems"
            v-model.trim="formValues.roleResourceIdList"
            hint="*Required"
            persistent-hint
            item-text="name"
            item-value="resourceId"
            :rules="[(v) => validations.required(v, 'Required')]"
          />
        </form-group>
        <form-group v-if="selectedRow">
          <v-btn
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
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import { mail, maxLength, required } from '@/utils/validations'
import FormGroup from '@/components/SmallComponents/FormGroup'
import SendWelcomeEmailToNewUserModal from '@/components/SystemUsers/SendWelcomeEmailToNewUserModal'
import { createSystemUser, sendInformationEmail, updateSystemUser } from '@/api/systemUsers'
import { scrollToComponent } from '@/utils/functions'
import InputFirstName from '@/components/Common/Inputs/InputFirstName'
import InputLastName from '@/components/Common/Inputs/InputLastName'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPhone from '@/components/Common/Inputs/InputPhone'
import { getSystemUsersRole } from '@/api/systemUsers'
import jwt_decode from 'jwt-decode'

export default {
  name: 'CreateOrEditSystemUser',
  components: {
    InputFirstName,
    InputLastName,
    InputEmail,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    SendWelcomeEmailToNewUserModal,
    KSelect,
    InputPhone
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
      formValues: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        statusName: '',
        roleResourceIdList: [],
        statusId: 1
      },
      maxLen: 17,
      showWelcomeEmailModal: false,
      statusItems: [
        { name: 'Active', val: 1 },
        { name: 'Inactive', val: 0 }
      ],
      roleItems: [],
      validations: {
        maxLength,
        required,
        mail
      }
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
      this.$refs.refPhone.validatePhoneNumber()
      if (this.$refs.refForm.validate() && this.$refs.refPhone.isPhoneNumberValid) {
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
  watch: {},
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
      if (_this.role === 'CompanyAdmin') {
        availableRoles = allRoles.filter((item) => item.name === 'CompanyAdmin')
      } else if (this.role === 'Reseller') {
        availableRoles = allRoles.filter(
          (item) => item.name === 'Reseller' || item.name === 'CompanyAdmin'
        )
      } else if (this.role === 'Root') {
        availableRoles = allRoles
      }

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
        /*
        this.$nextTick(() => {
          this.formValues.phoneNumber = this.$refs.refTelInput.phoneObject.number.international
        })

         */
        _this.formValues.roleResourceIdList =
          allRoles &&
          allRoles.find((item) => {
            return item.name === roles
          }).resourceId
        if (_this.role === 'CompanyAdmin') {
          availableRoles = allRoles.filter((item) => item.name === 'CompanyAdmin')
          if (roles === 'Reseller') {
            availableRoles = allRoles.filter((item) => item.name === 'Reseller')
          } else if (roles === 'Root') {
            availableRoles = allRoles.filter((item) => item.name === 'Root')
          }
        } else if (this.role === 'Reseller') {
          availableRoles = allRoles.filter(
            (item) => item.name === 'Reseller' || item.name === 'CompanyAdmin'
          )
          if (roles === 'Root') {
            availableRoles = allRoles.filter((item) => item.name === 'Root')
          }
        }
        this.roleItems = availableRoles.map((item) => {
          let data = {
            name: item.name,
            resourceId: item.resourceId
          }
          return data
        })
      } else {
        this.roleItems = availableRoles.map((item) => {
          let data = {
            name: item.name,
            resourceId: item.resourceId
          }
          return data
        })
        this.formValues.roleResourceIdList =
          availableRoles && availableRoles.length && availableRoles[0].resourceId
      }
    })
  }
}
</script>

<style lang="scss">
.create-edit-system-user {
}
.phone-number-invalid {
  border-color: #ff5252 !important;
}
</style>
