<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New SMTP Setting'"
    icon-name="mdi-mailbox"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="SMTP Server Settings"
        sub-title="Fill information and credentials"
      />
      <form-group title="SMTP Setting Name" has-hint>
        <v-text-field
          placeholder="Enter SMTP setting name"
          outlined
          dense
          v-model.trim="formValues.name"
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
        ></v-text-field>
      </form-group>
      <form-group title="Service Provider" has-hint>
        <v-select
          v-model.trim="formValues.serviceProvider"
          :items="serviceProviderItems"
          class="new-integration__select"
          dense
          multiple
          outlined
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
          placeholder="Select option"
        ></v-select>
      </form-group>
      <form-group title="SMTP Server Address" has-hint>
        <div class="new-smtp-setting__server-address-container">
          <v-text-field
            placeholder="Server URL or IP Address"
            outlined
            dense
            v-model.trim="formValues.serverAddress"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
          <v-text-field
            placeholder="Port"
            outlined
            ref="refTextField"
            dense
            @input="onPortChange"
            :rules="[(v) => validations.required(v, 'Required')]"
            :value="formValues.serverPort"
          ></v-text-field>
        </div>
      </form-group>
      <form-group title="User Name or Email Address" has-hint>
        <v-text-field
          placeholder="Enter username"
          outlined
          dense
          v-model.trim="formValues.userName"
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
        ></v-text-field>
      </form-group>
      <form-group title="Password" has-hint>
        <v-text-field
          placeholder="Enter password"
          outlined
          dense
          v-model.trim="formValues.password"
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
        ></v-text-field>
      </form-group>
      <form-group>
        <v-checkbox
          v-model="formValues.isAuth"
          class="mt-n3 mb-1"
          color="#2196f3"
          label="Use Authentication"
        />
        <v-checkbox v-model="formValues.isSSL" class="mb-1" color="#2196f3" label="Use SSL" />
        <v-checkbox
          v-model="formValues.isSmtpRelay"
          class="mb-2"
          color="#2196f3"
          label="Has SMTP Relay"
        />
      </form-group>
      <form-group
        title="Make Available For"
        sub-title="Companies that will see this setting in their libraries"
        has-hint
      >
        <v-select
          v-model.trim="formValues.company"
          :items="companyItems"
          class="new-integration__select"
          dense
          multiple
          outlined
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
          placeholder="Select option"
        ></v-select>
      </form-group>
      <form-group title="Reply to">
        <v-text-field
          placeholder="Enter Reply to"
          outlined
          dense
          :rules="[(v) => validations.mail(v, 'Invalid email address')]"
          v-model.trim="formValues.replyTo"
        ></v-text-field>
      </form-group>
      <form-group title="Error to">
        <v-text-field
          placeholder="Enter Error to"
          outlined
          dense
          :rules="[(v) => validations.mail(v, 'Invalid email address')]"
          v-model.trim="formValues.errorTo"
        ></v-text-field>
      </form-group>
      <form-group title="CC">
        <v-text-field
          placeholder="Enter CC address"
          outlined
          :rules="[(v) => validations.mail(v, 'Invalid email address')]"
          dense
          v-model.trim="formValues.cc"
        ></v-text-field>
      </form-group>
      <form-group title="BCC">
        <v-text-field
          placeholder="Enter BCC address"
          outlined
          dense
          :rules="[(v) => validations.mail(v, 'Invalid email address')]"
          v-model.trim="formValues.bcc"
        ></v-text-field>
      </form-group>
      <form-group title="Custom Header">
        <v-textarea
          outlined
          dense
          rows="2"
          no-resize
          placeholder="Enter Custom Header"
          height="100"
          hint="*Required"
          persistent-hint
          :rules="[(v) => validations.required(v, 'Required')]"
          v-model.trim="formValues.customHeader"
        ></v-textarea>
      </form-group>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { maxLength, required, mail } from '@/utils/validations'
export default {
  name: 'NewSmtpSettings',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValues: {
        name: '',
        serviceProvider: '',
        serverAddress: '',
        serverPort: '',
        userName: '',
        password: '',
        isAuth: false,
        isSSL: false,
        isSmtpRelay: false,
        company: '',
        replyTo: '',
        errorTo: '',
        cc: '',
        bcc: '',
        customHeader: ''
      },
      serviceProviderItems: [],
      companyItems: [],
      validations: {
        maxLength,
        required,
        mail
      }
    }
  },
  methods: {
    submit() {},
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    onPortChange(val) {
      const numberVal = Number(val)
      const newVal = isNaN(numberVal) ? '' : val
      const renderedValue = /[0-9]/gi.test(newVal) ? newVal : this.formValues.serverPort
      this.formValues.serverPort = renderedValue
      this.$refs.refTextField.lazyValue = renderedValue
    }
  }
}
</script>

<style lang="scss">
.new-smtp-setting {
  &__server-address-container {
    display: flex;
    & > div:first-child {
      flex-basis: 90%;
    }
    & > div:last-child {
      flex-basis: 15%;
      margin-left: 16px;
    }
  }
}
</style>
