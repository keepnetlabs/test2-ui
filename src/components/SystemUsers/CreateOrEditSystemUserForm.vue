<template>
  <v-form ref="refForm" lazy-validation>
    <form-group title="First Name" has-hint>
      <InputFirstName v-model.trim="formValues.firstName" id="input--system-user-first-name" />
    </form-group>
    <form-group title="Last Name" has-hint>
      <InputLastName v-model.trim="formValues.lastName" id="input--system-user-last-name" />
    </form-group>
    <form-group title="Email Address" has-hint>
      <InputEmail v-model.trim="formValues.email" id="input--system-user-email" />
    </form-group>
    <form-group title="Phone Number">
      <InputPhone
        v-model.trim="formValues.phoneNumber"
        ref="refPhone"
        id="input--system-user-phone-number"
      />
    </form-group>
    <form-group title="Status">
      <k-select
        v-model.trim="formValues.statusId"
        id="input--sytem-user-status"
        placeholder="Select Option"
        outlined
        dense
        :items="statusItems"
        item-text="name"
        item-value="val"
        @change="$emit('on-status-change')"
      />
    </form-group>
    <form-group title="Role">
      <k-select
        v-model.trim="formValues.roleResourceIdList"
        id="input--sytem-user-role"
        position="top"
        placeholder="Select Option"
        outlined
        dense
        hint="*Required"
        persistent-hint
        item-text="name"
        item-value="resourceId"
        :items="roleItems"
        :rules="[(v) => validations.required(v, 'Required')]"
      />
    </form-group>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputFirstName from '@/components/Common/Inputs/InputFirstName'
import InputLastName from '@/components/Common/Inputs/InputLastName'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPhone from '@/components/Common/Inputs/InputPhone'
import KSelect from '@/components/Common/Inputs/KSelect'
import { mail, maxLength, required } from '@/utils/validations'
export default {
  name: 'CreateOrEditSystemUserForm',
  components: { KSelect, InputPhone, InputEmail, InputLastName, InputFirstName, FormGroup },
  props: {
    formValues: {
      type: Object
    },
    roleItems: {
      type: Array
    },
    statusItems: {
      type: Array
    }
  },
  data() {
    return {
      validations: {
        maxLength,
        required,
        mail
      }
    }
  },
  methods: {
    validatePhoneNumber() {
      this.$refs.refPhone.validatePhoneNumber()
      return this.$refs.refPhone.isPhoneNumberValid
    },
    validate() {
      return this.$refs.refForm.validate()
    },
    resetValidation() {
      this.$refs.refForm.resetValidation()
    }
  }
}
</script>

<style></style>
