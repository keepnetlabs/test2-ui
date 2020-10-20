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
          <v-text-field
            placeholder="Enter first name"
            outlined
            dense
            v-model.trim="formValues.firstName"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
        </form-group>
        <form-group title="Last Name" has-hint>
          <v-text-field
            placeholder="Enter last name"
            outlined
            dense
            v-model.trim="formValues.lastName"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
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
          />
        </form-group>
        <form-group title="Status">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="statusItems"
            item-text="name"
            item-value="val"
            v-model.trim="formValues.statusId"
          ></v-select>
        </form-group>
        <form-group title="Role">
          <v-select
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
          ></v-select>
        </form-group>
        <form-group v-if="selectedRow">
          <v-btn
            color="#2196f3"
            rounded
            class="white--text btn-util"
            @click="toggleWelcomeEmailModal"
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
import PhoneNumber from '@/components/SmallComponents/PhoneNumber'
import FormGroup from '@/components/SmallComponents/FormGroup'
import SendWelcomeEmailToNewUserModal from '@/components/SystemUsers/SendWelcomeEmailToNewUserModal'
import { createSystemUser, updateSystemUser } from '@/api/systemUsers'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { scrollToComponent } from '@/utils/functions'
import { VueTelInput } from 'vue-tel-input'
import { getUserRoles } from '../../api/systemUsers'
export default {
  name: 'CreateOrEditSystemUser',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    SendWelcomeEmailToNewUserModal,
    VueTelInput
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
        isLdap: false
      },
      showWelcomeEmailModal: false,
      statusItems: [
        { name: 'Active', val: 1 },
        { name: 'Passive', val: 0 }
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
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      if (this.$refs.refForm.validate()) {
        if (this.selectedRow) {
          const { phoneNumber } = this.formValues
          const formData = {
            resourceId: this.selectedRow.resourceId,
            ...this.formValues,
            phoneNumber: phoneNumber.split(' ').join('')
          }
          formData.roleResourceIdList = [this.roleResourceIdList]
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
      createSystemUser(payload).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'System user has been created',
          icon: 'mdi-check-circle',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
        })
        this.$emit('closeOverlayWithUpdate')
      })
    },
    callForUpdateSystemUser(payload) {
      updateSystemUser(payload).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'System user has been updated',
          icon: 'mdi-check-circle',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
        })
        this.$emit('closeOverlayWithUpdate')
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
    getUserRoles(payload).then((response) => {
      this.roleItems = response.data.data.results.map((item) => {
        let data = {
          roleName: item.roleName.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1'),
          resourceId: item.resourceId
        }
        return data
      })
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
        _this.formValues.roleResourceIdList = _this.roleItems.find((item) => {
          return item.roleName.replace(/\s/g, '') === roles
        }).resourceId
      }
    })
  }
}
</script>

<style lang="scss">
.create-edit-system-user {
}
</style>
