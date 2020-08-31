<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New SMTP Setting'"
    icon-name="mdi-mailbox"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <v-list-item class="pl-0 pr-0 mt-8">
        <v-list-item-content>
          <v-list-item-title class="new-smtp-setting__title">
            SMTP Server Settings
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-6">
            Fill information and credentials
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form ref="refForm" lazy-validation>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">SMTP Setting Name</label>
            <v-text-field
              placeholder="Enter name"
              outlined
              dense
              v-model.trim="formValues.name"
              hint="*Required"
              persistent-hint
              :rules="[(v) => validations.required(v, 'Required')]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Service Provider</label>
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
              placeholder="Select from the list"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">SMTP Server Address</label>
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
                dense
                type="number"
                v-model.trim="formValues.serverPort"
              ></v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">User Name or Email Address</label>
            <v-text-field
              placeholder="Enter username"
              outlined
              dense
              v-model.trim="formValues.userName"
              hint="*Required"
              persistent-hint
              :rules="[(v) => validations.required(v, 'Required')]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Password</label>
            <v-text-field
              placeholder="Enter password"
              outlined
              dense
              v-model.trim="formValues.password"
              hint="*Required"
              persistent-hint
              type="password"
              :rules="[(v) => validations.required(v, 'Required')]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <div>
              <v-checkbox
                v-model="formValues.isAuth"
                class="mt-n1 mb-1"
                color="#2196f3"
                label="Use Authentication"
              />
              <v-checkbox v-model="formValues.isSSL" class="mb-1" color="#2196f3" label="Use SSL" />
              <v-checkbox
                v-model="formValues.isSmtpRelay"
                class="mb-n1"
                color="#2196f3"
                label="Has SMTP Relay"
              />
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item">
          <v-list-item-content>
            <v-list-item-title class="new-integration__label">
              Make Available For
            </v-list-item-title>
            <v-list-item-subtitle class="new-smtp-setting__sub-title mb-2">
              Companies that will see this setting in their libraries
            </v-list-item-subtitle>
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
              placeholder="Select Companies"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Reply to</label>
            <v-text-field
              placeholder="Reply to"
              outlined
              dense
              :rules="[(v) => validations.mail(v, 'Invalid email address')]"
              v-model.trim="formValues.replyTo"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Error to</label>
            <v-text-field
              placeholder="Error to"
              outlined
              dense
              :rules="[(v) => validations.mail(v, 'Invalid email address')]"
              v-model.trim="formValues.errorTo"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">CC</label>
            <v-text-field
              placeholder="Enter CC address"
              outlined
              :rules="[(v) => validations.mail(v, 'Invalid email address')]"
              dense
              v-model.trim="formValues.cc"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">BCC</label>
            <v-text-field
              placeholder="Enter BCC address"
              outlined
              dense
              :rules="[(v) => validations.mail(v, 'Invalid email address')]"
              v-model.trim="formValues.bcc"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="ldap-info__list-item mb-0">
          <v-list-item-content>
            <label class="add-user-overlay__label">Custom Header</label>
            <v-textarea
              outlined
              dense
              rows="2"
              no-resize
              height="100"
              hint="*Required"
              persistent-hint
              :rules="[(v) => validations.required(v, 'Required')]"
              v-model.trim="formValues.customHeader"
            ></v-textarea>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import { maxLength, required, mail } from '@/utils/validations'
export default {
  name: 'NewSmtpSettings',
  components: {
    AppModal
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
    submit() {
      if (this.$refs.refForm.validate()) {
      }
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>

<style lang="scss">
.new-smtp-setting {
  &__title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    opacity: 0.9;
  }
  &__sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    opacity: 0.9;
  }
  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }
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
