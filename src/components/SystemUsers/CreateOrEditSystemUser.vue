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
        <form-group title="Phone Number">
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
            v-model.trim="formValues.statusName"
          ></v-select>
        </form-group>
        <form-group title="Role">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="roleItems"
            v-model.trim="formValues.role"
            hint="*Required"
            persistent-hint
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
        role: '',
        isTwoStep: false,
        isLdap: false
      },
      showWelcomeEmailModal: false,
      statusItems: ['Active'],
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
          this.callForUpdateSystemUser(formData)
        } else {
          const { phoneNumber } = this.formValues
          const formData = {
            ...this.formValues,
            phoneNumber: phoneNumber.split(' ').join(''),
            roleResourceIdList: ['VwwzEXkFHHCe'],
            companyResourceId: localStorage.getItem('companyResourceId')
          }
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
          message: response.data.message,
          icon: 'mdi-check-circle',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
        })
        this.$emit('closeOverlayWithUpdate')
      })
    },
    callForUpdateSystemUser(payload) {
      updateSystemUser(payload).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          message: response.data.message,
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
    if (this.selectedRow) {
      const { firstName, lastName, phoneNumber, roles, statusName, email } = this.selectedRow
      this.formValues.firstName = firstName
      this.formValues.lastName = lastName
      this.formValues.role = roles
      this.formValues.statusName = statusName
      this.formValues.email = email
      this.formValues.phoneNumber = phoneNumber.split(' ').join('')
    }
  }
}
</script>

<style lang="scss">
.create-edit-system-user {
}
</style>
