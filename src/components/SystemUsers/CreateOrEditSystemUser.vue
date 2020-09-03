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
      <app-modal-body-header :title="bodyTitle" sub-title="Fill information below" />
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
          <phone-number v-model="formValues.phoneNumber" />
        </form-group>
        <form-group title="Status">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="statusItems"
            v-model="formValues.status"
          ></v-select>
        </form-group>
        <form-group title="Role">
          <v-select
            placeholder="Select Option"
            outlined
            dense
            :items="roleItems"
            v-model="formValues.role"
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
        <form-group v-if="systemUserId"> </form-group>
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
export default {
  name: 'CreateOrEditSystemUser',
  components: {
    AppModal,
    AppModalBodyHeader,
    PhoneNumber,
    FormGroup
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
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        status: '',
        role: '',
        isTwoStep: false,
        isLdap: false
      },
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
      }
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
