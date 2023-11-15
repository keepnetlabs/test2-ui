<template>
  <div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <v-form v-show="!isLoading" v-model="isFormValid" ref="refForm">
      <FormGroup :title="labels.Path" has-hint>
        <InputUrl
          v-model="formData.url"
          id="input--ldap-path"
          placeholder="Enter LDAP path"
          hint="Example: ldap[s]://ldapserver.acme.corp[:port]. (Standard LDAP port is 389)"
          :rules="pathRules"
        />
      </FormGroup>
      <FormGroup :title="labels.UserName" has-hint>
        <v-text-field
          v-model="formData.username"
          id="input--ldap-username"
          outlined
          dense
          persistent-hint
          placeholder="Your LDAP username"
          hint="*Required"
          :rules="[(v) => Validations.required(v, labels.Required)]"
        ></v-text-field>
      </FormGroup>
      <FormGroup :title="labels.Password" has-hint>
        <v-text-field
          v-model="formData.password"
          id="input--ldap-password"
          type="password"
          outlined
          dense
          persistent-hint
          hint="*Required"
          placeholder="LDAP password"
          :rules="[(v) => Validations.required(v, labels.Required)]"
        ></v-text-field>
      </FormGroup>
      <FormGroup :title="labels.Status" class="mb-6">
        <v-switch
          v-model.trim="formData.isActive"
          id="input--switch-ldap"
          class="k-switch mt-0"
          hide-details
          color="#2196f3"
          style="max-width: 100px;"
          :label="getSwitchLabel"
        />
      </FormGroup>
      <FormGroup :title="labels.Connection">
        <v-btn
          id="btn-test-connection--ldap-settings"
          class="fw-600 no-box-shadow"
          color="#2196f3"
          rounded
          outlined
          :style="getTestConnectionButtonStyle"
          :loading="isTestingConnection"
          @click="handleTestConnection()"
        >
          Test Connection
          <template #loader>
            <span style="font-size: 14px; text-transform: capitalize;">
              TESTING CONNECTION
            </span>
            <img
              src="../../../assets/img/spinner-turquaz.svg"
              class="add-in-settings__spinner"
              alt="spinner"
            />
          </template>
          <v-icon
            v-if="isTestConnectionValid && !isTestingConnection"
            :id="`btn--siem-integration-api-key-check`"
            class="ml-1 mr-0"
            color="#43a047"
            left
            medium
            >mdi-check
          </v-icon>
        </v-btn>
      </FormGroup>
      <SaveChangesButton
        id="btn-save--ldap-settings"
        class="mt-8"
        :style="getButtonStyle"
        @click="handleSubmit"
      />
    </v-form>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import SaveChangesButton from '@/components/Common/Buttons/SaveChangesButton'
import LDAPService from '@/api/ldap'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { mapGetters } from 'vuex'
import { isDifferent } from '@/utils/functions'
export default {
  name: 'LDAPSettings',
  components: { DatatableLoading, SaveChangesButton, InputUrl, FormGroup },
  props: {
    initialFormData: {
      type: Object
    },
    isLoading: {
      type: Boolean
    },
    fieldMappings: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      Validations,
      formData: {
        url: '',
        username: '',
        password: '',
        isActive: true
      },
      isTestingConnection: false,
      isTestConnectionValid: false,
      isFormValid: false,
      disabledStyle: { pointerEvents: 'none', opacity: '.5' },
      pathRules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.ldapConnectionStringUrl(v, 'Incorrect path format'),
        (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.URL, 2000)),
        (v) => Validations.noWhitespace(v, labels.InvalidURL)
      ]
    }
  },
  computed: {
    ...mapGetters({
      getLDAPSettingCreatePermission: 'permissions/getLDAPSettingCreatePermission',
      getLDAPSettingUpdatePermission: 'permissions/getLDAPSettingUpdatePermission'
    }),
    getTestConnectionButtonStyle() {
      let width = ''
      if (this.isTestingConnection) width = '210px'
      else if (this.isTestConnectionValid) width = '185px'
      else width = '160px'
      return {
        width,
        ...this.getDisabledStyle
      }
    },
    getDisabledStyle() {
      return this.isFormValid ? {} : this.disabledStyle
    },
    getButtonStyle() {
      const permissionIsValid = this.initialFormData
        ? this.getLDAPSettingUpdatePermission
        : this.getLDAPSettingCreatePermission
      if (!permissionIsValid) return this.disabledStyle
      const isDiff = this.initialFormData ? isDifferent(this.formData, this.initialFormData) : true
      if (!isDiff) return this.disabledStyle
      return this.isTestingConnection || !this.isFormValid ? this.disabledStyle : {}
    },
    getSwitchLabel() {
      return this.formData.isActive ? 'Enable' : 'Disable'
    }
  },
  watch: {
    'formData.url': 'checkTestConnectionValidityByParam',
    'formData.password': 'checkTestConnectionValidityByParam',
    'formData.username': 'checkTestConnectionValidityByParam',
    initialFormData(newVal) {
      if (newVal) {
        const copyOfFormData = JSON.parse(JSON.stringify(newVal))
        delete copyOfFormData.fieldMappings
        this.formData = { ...copyOfFormData }
      }
    }
  },
  methods: {
    checkTestConnectionValidityByParam(newVal, oldVal) {
      if (newVal !== oldVal) this.isTestConnectionValid = false
    },
    handleTestConnection(callApi = false) {
      this.isTestingConnection = true
      const { url, password, username } = this.formData
      LDAPService.testLDAPConnection({ url, password, username })
        .then(() => {
          this.isTestingConnection = false
          this.isTestConnectionValid = true
          if (callApi) this.handleSubmit()
        })
        .catch(() => {
          this.isTestingConnection = false
        })
    },
    handleSubmit() {
      if (this.isTestConnectionValid)
        this.$emit('on-submit', {
          ...this.formData,
          fieldMappings: this.fieldMappings.filter((fMap) => fMap.ldapFieldResourceId)
        })
      else this.handleTestConnection(true)
    }
  }
}
</script>
