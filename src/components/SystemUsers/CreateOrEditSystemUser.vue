<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getTitle"
    icon-name="mdi-account-outline"
    class-name="create-edit-system-user"
  >
    <template v-slot:overlay-body>
      <send-welcome-email-to-new-user-modal
        v-if="showWelcomeEmailModal"
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
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            v-model.trim="formValues.email"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.mail(v, 'Invalid email address')
            ]"
          ></v-text-field>
        </form-group>
        <form-group title="Phone Number" class-name="mb-6">
          <vue-tel-input
            v-model="formValues.phoneNumber"
            validCharactersOnly
            defaultCountry="GB"
            :inputOptions="{
              showDialCode: true
            }"
            :maxLen="maxLen"
            mode="international"
            :class="['k-tel-input', !isPhoneNumberValid && 'phone-number-invalid']"
            ref="refTelInput"
            @blur="handleTelBlur"
            @input="handleTelChange"
          />
          <div class="v-text-field__details checkbox-error" v-if="!isPhoneNumberValid">
            <transition appear name="bounce">
              <div class="v-messages theme--light error--text" role="alert">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message" style="padding-left: 10px;">
                    {{ getErrorText }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="v-messages theme--light" v-else>
            <div class="v-messages__wrapper">
              <div class="v-messages__message" style="padding-left: 12px; font-size: 9px;">
                *Required
              </div>
            </div>
          </div>
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
            item-text="roleName"
            item-value="resourceId"
            :rules="[(v) => validations.required(v, 'Required')]"
          />
        </form-group>
        <form-group v-if="false">
          <v-btn color="#2196f3" rounded class="white--text btn-util">
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
import { createSystemUser, updateSystemUser } from '@/api/systemUsers'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { scrollToComponent } from '@/utils/functions'
import { VueTelInput } from 'vue-tel-input'
import { getUserRoles } from '@/api/systemUsers'
import InputFirstName from '@/components/Common/Inputs/InputFirstName'
import InputLastName from '@/components/Common/Inputs/InputLastName'
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'CreateOrEditSystemUser',
  components: {
    InputFirstName,
    InputLastName,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    SendWelcomeEmailToNewUserModal,
    VueTelInput,
    KSelect
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      formValues: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        statusName: '',
        roleResourceIdList: [],
        isTwoStep: false,
        isLdap: false,
        statusId: 1
      },
      maxLen: 17,
      isPhoneNumberValid: true,
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
    getErrorText() {
      if (this.formValues.phoneNumber) {
        return 'Invalid Phone Number'
      }
      return 'Required'
    },
    getBodyTitle() {
      return this.selectedRow ? 'Edit System User' : 'Create New System User'
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleTelChange(val) {
      this.$refs.refTelInput.phone = val
    },
    handleChangeStatus(val) {
      this.formValues.statusName = this.statusItems.find((item) => item.val === val).name
    },
    handleTelBlur() {
      this.validatePhoneNumber()
    },
    submit() {
      this.validatePhoneNumber()
      if (this.$refs.refForm.validate() && this.isPhoneNumberValid) {
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
        setTimeout(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        }, 100)
      }
    },
    toggleWelcomeEmailModal() {
      this.showWelcomeEmailModal = !this.showWelcomeEmailModal
    },
    handleSendEmail() {
      this.toggleWelcomeEmailModal()
    },
    callForCreateSystemUser(payload) {
      createSystemUser(payload).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'System user has been created',
          icon: 'mdi-check-circle',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
        })
        this.$emit('closeOverlayWithUpdate')
      })
    },
    callForUpdateSystemUser(payload) {
      updateSystemUser(payload).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'System user has been updated',
          icon: 'mdi-check-circle',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
        })
        this.$emit('closeOverlayWithUpdate')
      })
    },
    validatePhoneNumber() {
      this.isPhoneNumberValid = this.$refs.refTelInput.phoneObject.isValid
    },
    updatePhoneNumber() {
      this.validatePhoneNumber()
      this.$refs.refTelInput.$forceUpdate()
    }
  },
  watch: {
    'formValues.phoneNumber'(newVal, oldVal) {
      if (newVal.length > 12 && this.$refs.refTelInput.phoneObject.possibility === 'too-long') {
        this.formValues.phoneNumber = oldVal
        this.$refs.refTelInput.phone = oldVal
        this.updatePhoneNumber()
      } else if (
        //CHINA BUG
        newVal.length === 17 &&
        this.$refs.refTelInput.phoneObject.regionCode === 'CN' &&
        newVal[4] !== '1'
      ) {
        const val = newVal.substring(0, 16)
        this.formValues.phoneNumber = val
        this.$refs.refTelInput.phone = val
        this.updatePhoneNumber()
      }
      this.$nextTick(() => {
        this.updatePhoneNumber()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.refForm.resetValidation()
    })
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
    getUserRoles(payload).then((response) => {
      allRoles = response.data.data.results
      availableRoles = []
      if (_this.$store.state.auth.userRoleName === 'CompanyAdmin') {
        availableRoles = allRoles.filter((item) => item.roleName === 'CompanyAdmin')
      } else if (this.$store.state.auth.userRoleName === 'Reseller') {
        availableRoles = allRoles.filter(
          (item) => item.roleName === 'Reseller' || item.roleName === 'CompanyAdmin'
        )
      } else if (this.$store.state.auth.userRoleName === 'Root') {
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
        this.formValues.phoneNumber = phoneNumber.split(' ').join('')
        this.$nextTick(() => {
          this.formValues.phoneNumber = this.$refs.refTelInput.phoneObject.number.international
        })
        _this.formValues.roleResourceIdList =
          allRoles &&
          allRoles.find((item) => {
            return item.roleName.replace(/\s/g, '') === roles
          }).resourceId
        if (_this.$store.state.auth.userRoleName === 'CompanyAdmin') {
          availableRoles = allRoles.filter((item) => item.roleName === 'CompanyAdmin')
          if (roles === 'Reseller') {
            availableRoles = allRoles.filter((item) => item.roleName === 'Reseller')
          } else if (roles === 'Root') {
            availableRoles = allRoles.filter((item) => item.roleName === 'Root')
          }
        } else if (this.$store.state.auth.userRoleName === 'Reseller') {
          availableRoles = allRoles.filter(
            (item) => item.roleName === 'Reseller' || item.roleName === 'CompanyAdmin'
          )
          if (roles === 'Root') {
            availableRoles = allRoles.filter((item) => item.roleName === 'Root')
          }
        }
        this.roleItems = availableRoles.map((item) => {
          let data = {
            roleName: item.roleName.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1'),
            resourceId: item.resourceId
          }
          return data
        })
      } else {
        this.roleItems = availableRoles.map((item) => {
          let data = {
            roleName: item.roleName.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1'),
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
