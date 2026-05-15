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
        :disabled="isSameUser"
      />
    </form-group>
    <form-group class-name="system-user-authentication-overrides width-auto">
      <template #title>
        <div class="system-user-authentication-overrides__header">
          <div class="system-user-authentication-overrides__heading">
            <v-icon size="22" color="#6b7280">mdi-shield-outline</v-icon>
            <span class="system-user-authentication-overrides__heading-title">
              Authentication Overrides
            </span>
          </div>
          <span
            :class="[
              'system-user-authentication-overrides__status',
              hasAuthenticationOverrides && 'system-user-authentication-overrides__status--active'
            ]"
          >
            {{ authenticationOverrideStatus }}
          </span>
        </div>
      </template>
      <div class="system-user-authentication-overrides__list">
        <div class="system-user-authentication-overrides__item">
          <div class="system-user-authentication-overrides__icon">
            <v-icon size="24" color="#2196f3">mdi-lock-outline</v-icon>
          </div>
          <div class="system-user-authentication-overrides__content">
            <span class="system-user-authentication-overrides__title">Bypass SSO Redirect</span>
            <span class="system-user-authentication-overrides__description">
              Sign in directly with a password, skipping the domain's SSO policy.
            </span>
            <span v-if="!isSsoConfigured" class="system-user-authentication-overrides__warning">
              SSO is not configured for this user's domain.
            </span>
          </div>
          <v-switch
            v-model="formValues.bypassSsoRedirect"
            id="input--system-user-bypass-sso-redirect"
            :label="getSwitchLabel(formValues.bypassSsoRedirect)"
            class="k-switch system-user-authentication-overrides__switch"
            color="#2196f3"
            :disabled="!isSsoConfigured"
            inset
            hide-details
          />
        </div>
        <div class="system-user-authentication-overrides__item">
          <div class="system-user-authentication-overrides__icon">
            <v-icon size="24" color="#2196f3">mdi-shield-check-outline</v-icon>
          </div>
          <div class="system-user-authentication-overrides__content">
            <span class="system-user-authentication-overrides__title">Bypass MFA</span>
            <span class="system-user-authentication-overrides__description">
              No one-time code or authenticator app required at sign-in.
            </span>
          </div>
          <v-switch
            v-model="formValues.bypassMfa"
            id="input--system-user-bypass-mfa"
            :label="getSwitchLabel(formValues.bypassMfa)"
            class="k-switch system-user-authentication-overrides__switch"
            color="#2196f3"
            inset
            hide-details
          />
        </div>
        <div class="system-user-authentication-overrides__item">
          <div class="system-user-authentication-overrides__icon">
            <v-icon size="24" color="#2196f3">mdi-ip-network-outline</v-icon>
          </div>
          <div class="system-user-authentication-overrides__content">
            <span class="system-user-authentication-overrides__title">
              Bypass IP Restriction
            </span>
            <span class="system-user-authentication-overrides__description">
              Allow this system user to sign in outside the company's allowed IP ranges.
            </span>
            <span v-if="!hasIpRestrictions" class="system-user-authentication-overrides__warning">
              IP restriction is not configured for this company.
            </span>
          </div>
          <v-switch
            v-model="formValues.bypassIpRestriction"
            id="input--system-user-bypass-ip-restriction"
            :label="getSwitchLabel(formValues.bypassIpRestriction)"
            class="k-switch system-user-authentication-overrides__switch"
            color="#2196f3"
            :disabled="!hasIpRestrictions"
            inset
            hide-details
          />
        </div>
      </div>
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
    },
    isSameUser: {
      type: Boolean,
      default: false
    },
    isSsoConfigured: {
      type: Boolean,
      default: true
    },
    hasIpRestrictions: {
      type: Boolean,
      default: true
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
  computed: {
    hasAuthenticationOverrides() {
      return (
        this.formValues.bypassSsoRedirect ||
        this.formValues.bypassMfa ||
        this.formValues.bypassIpRestriction
      )
    },
    authenticationOverrideStatus() {
      const { bypassSsoRedirect, bypassMfa, bypassIpRestriction } = this.formValues
      const activeOverrides = []
      if (bypassSsoRedirect) activeOverrides.push('SSO')
      if (bypassMfa) activeOverrides.push('MFA')
      if (bypassIpRestriction) activeOverrides.push('IP restriction')

      return activeOverrides.length ? `${activeOverrides.join(' + ')} bypassed` : 'No overrides active'
    }
  },
  methods: {
    getSwitchLabel(value) {
      return value ? 'On' : 'Off'
    },
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
