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
      <app-modal-body-header :title="bodyTitle" sub-title="Fill information below" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="First Name" has-hint>
          <v-text-field
            placeholder="Enter first name"
            outlined
            dense
            v-model.trim="formValues.FirstName"
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
            v-model.trim="formValues.LastName"
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
            v-model.trim="formValues.Email"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.mail(v, 'Invalid email address')
            ]"
          ></v-text-field>
        </form-group>
        <form-group title="Phone Number">
          <phone-number v-model="formValues.PhoneNumber" />
        </form-group>
        <form-group title="Status">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="statusItems"
            v-model.trim="formValues.status"
          ></v-select>
        </form-group>
        <form-group title="Role">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="roleItems"
            v-model.trim="formValues.role"
          ></v-select>
        </form-group>
        <form-group>
          <v-checkbox
            v-model="formValues.isTwoStep"
            color="#2196f3"
            class="mt-n3"
            label="Two Step Authentication"
          />
        </form-group>
        <form-group>
          <v-checkbox
            class="mt-n1"
            v-model="formValues.isLdap"
            color="#2196f3"
            label="LDAP Authentication"
          />
        </form-group>
        <form-group v-if="systemUserId">
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
import { createSystemUser } from '@/api/systemUsers'
export default {
  name: 'CreateOrEditSystemUser',
  components: {
    AppModal,
    AppModalBodyHeader,
    PhoneNumber,
    FormGroup,
    SendWelcomeEmailToNewUserModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    systemUserId: {
      type: String
    },
    bodyTitle: {
      type: String,
      default: 'Create New System User'
    }
  },
  data() {
    return {
      formValues: {
        FirstName: '',
        LastName: '',
        Email: '',
        PhoneNumber: '',
        status: '',
        role: '',
        isTwoStep: false,
        isLdap: false
      },
      showWelcomeEmailModal: false,
      statusItems: [],
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
      return this.systemUserId ? 'Edit System User' : 'New System User'
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      if (this.$refs.refForm.validate()) {
        const { PhoneNumber } = this.formValues
        const formData = {
          ...this.formValues,
          PhoneNumber: PhoneNumber.val ? `${PhoneNumber.code}${PhoneNumber.val}` : ''
        }
        /*
        createSystemUser(formData).then((response) => {})

         */
      }
    },
    toggleWelcomeEmailModal() {
      this.showWelcomeEmailModal = !this.showWelcomeEmailModal
    },
    handleSendEmail() {
      this.toggleWelcomeEmailModal()
    },
    callForCreateSystemUser() {
      createSystemUser().then((response) => {})
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.refForm.resetValidation()
    })
  }
}
</script>

<style lang="scss">
.create-edit-system-user {
}
</style>
