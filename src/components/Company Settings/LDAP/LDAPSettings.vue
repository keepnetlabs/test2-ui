<template>
  <div>
    <v-form v-model="isFormValid" ref="refForm">
      <FormGroup :title="labels.Path" has-hint>
        <InputUrl v-model="formData.url" id="input--ldap-path" />
      </FormGroup>
      <FormGroup :title="labels.UserName" has-hint>
        <v-text-field
          v-model="formData.username"
          id="input--ldap-username"
          outlined
          dense
          persistent-hint
          placeholder="Enter LDAP path"
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
          placeholder="Enter LDAP password"
          :rules="[(v) => Validations.required(v, labels.Required)]"
        ></v-text-field>
      </FormGroup>
      <FormGroup :title="labels.Status" class="mb-6">
        <v-switch
          v-model.trim="formData.statusId"
          id="input--switch-ldap"
          class="k-switch mt-0"
          hide-details
          color="#2196f3"
          style="max-width: 100px;"
          :label="formData.statusId ? 'Enable' : 'Disable'"
        />
      </FormGroup>
      <FormGroup :title="labels.Connection">
        <v-btn
          class="fw-600 no-box-shadow"
          color="#00BCD4"
          rounded
          outlined
          :style="getTestConnectionButtonStyle"
          :loading="isTestingConnection"
          @click="handleTestConnection"
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
        </v-btn>
      </FormGroup>
      <SaveChangesButton class="mt-8" :style="getDisabledStyle" />
    </v-form>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import SaveChangesButton from '@/components/Common/Buttons/SaveChangesButton'
import { getLDAPSettingDetailForMyCompany, testLDAPConnection } from '@/api/ldap'
export default {
  name: 'LDAPSettings',
  components: { SaveChangesButton, InputUrl, FormGroup },
  data() {
    return {
      labels,
      Validations,
      formData: {
        url: '',
        username: '',
        password: '',
        statusId: 1
      },
      isTestingConnection: false,
      isTestConnectionValid: false,
      isFormValid: false
    }
  },
  computed: {
    getTestConnectionButtonStyle() {
      return { width: this.isTestingConnection ? '210px' : '160px', ...this.getDisabledStyle }
    },
    getDisabledStyle() {
      return this.isFormValid ? {} : { pointerEvents: 'none', opacity: '.5' }
    }
  },
  watch: {
    formData(newVal, oldVal) {
      const { url, username, password } = newVal
      const { url: oldUrl, username: oldUsername, password: oldPassword } = oldVal
      if (url !== oldUrl || username !== oldUsername || password !== oldPassword) {
        this.isTestConnectionValid = false
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      getLDAPSettingDetailForMyCompany().then((response) => {
        console.log('getLDAPSettingDetailForMyCompany', response)
      })
    },
    handleTestConnection() {
      this.isTestingConnection = true
      const { url, password, username } = this.formData
      testLDAPConnection({ url, password, username }).then((response) => {
        this.isTestingConnection = false
        this.isTestConnectionValid = true
      })
    }
  }
}
</script>
