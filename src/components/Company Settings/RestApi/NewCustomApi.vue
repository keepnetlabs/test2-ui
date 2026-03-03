<template>
  <app-modal
    v-if="status"
    title-id="text--rest-api-modal-title"
    :status="status"
    :title="getTitle"
    :icon-name="getIconName"
    class-name="new-smtp-setting"
    :id="selectedRow ? 'edit-rest-api-modal' : 'new-rest-api-modal'"
    confirm-button-id="btn-save--rest-api-modal"
    cancel-button-id="btn-cancel--rest-api-modal"
    :saveDisable="getConfirmButtonDisabled"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm">
        <form-group :title="labels.ClientName" :sub-title="labels.CustomApiSubtitle" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            id="input--rest-api-name"
            entity-name="client"
          />
          <v-btn
            v-if="isShowGenerateCredentialsBtn"
            id="btn-generate--rest-api"
            @click="handleGenerateClientBtnClick"
            class="white--text btn-util"
            style="margin-bottom: 10px; box-shadow: none !important;"
            color="#2196f3"
            rounded
            :disabled="isGenerateClientBtnDisabled"
          >
            {{ labels.GenerateClientCred }}
          </v-btn>
        </form-group>
        <form-group
          :title="labels.ClientId"
          :sub-title="labels.GeneratedClientId"
          :class-name="formValues.clientId ? 'copy-to-clipboard' : ''"
          has-hint
        >
          <div class="copy-to-clipboard__container">
            <InputEntityName
              v-model.trim="formValues.clientId"
              id="input--rest-api-generated-client-id"
              class="auth-key__textfield"
              entityName="Client Id"
              :disabled="true"
              :initialPlaceholder="labels.GeneratedClientId"
              :initialRules="[]"
            />
            <v-btn
              v-if="formValues.clientId"
              id="input--rest-api-client-id"
              text
              color="#2196f3"
              class="ml-2"
              @click="copyToClipboard(formValues.clientId)"
              >{{ labels.CopyToClipboard }}</v-btn
            >
          </div>
        </form-group>
        <form-group
          :title="labels.ClientSecret"
          :sub-title="
            isShowGenerateCredentialsBtn
              ? labels.ClientSecretSubtitle
              : labels.GeneratedClientSecret
          "
          :class-name="
            isShowGenerateCredentialsBtn && formValues.clientSecret ? 'copy-to-clipboard' : ''
          "
          has-hint
        >
          <div class="copy-to-clipboard__container">
            <InputEntityName
              v-model.trim="formValues.clientSecret"
              id="input--rest-api-client-secret"
              class="auth-key__textfield"
              entityName="Client Secret"
              :disabled="true"
              :initialPlaceholder="labels.GeneratedClientSecret"
              :initialRules="[]"
            />
            <v-btn
              v-if="isShowGenerateCredentialsBtn && formValues.clientSecret"
              text
              color="#2196f3"
              class="ml-2"
              @click="copyToClipboard(formValues.clientSecret)"
              >{{ labels.CopyToClipboard }}</v-btn
            >
          </div>
        </form-group>
        <form-group
          title="IP Restriction"
          sub-title="Restrict access to API by IP addresses"
          class-name="ip-restriction"
        >
          <div class="ip-restriction__container">
            <v-radio-group
              v-model="formValues.hasIpAddressRestriction"
              id="input--rest-api-is-ip-restriction"
              :mandatory="false"
              row
            >
              <v-radio
                :value="false"
                id="input--rest-api-allow-all-ip"
                label="Allow all IPs"
                color="#2196f3"
              ></v-radio>
              <v-radio
                :value="true"
                id="input--rest-api-restrict-ip"
                label="Restrict access by IP address"
                color="#2196f3"
              ></v-radio>
            </v-radio-group>
            <div
              v-for="(item, index) in formValues.allowedIpAddresses"
              :key="item.name"
              style="position: relative;"
            >
              <InputIpAddress
                :id="`input--rest-api-allowed-ip-address-${index}`"
                :placeholder="labels.EnterIpAdress"
                :rules="
                  formValues.hasIpAddressRestriction ? [(v) => validations.ipWithStars(v)] : []
                "
                class="auth-key__textfield"
                :disabled="!formValues.hasIpAddressRestriction"
                v-model.trim="item.value"
              />
              <div class="ip-restriction__delete-button">
                <v-icon
                  v-if="formValues.allowedIpAddresses.length > 1"
                  medium
                  left
                  class="ml-2"
                  @click="formValues.allowedIpAddresses.splice(index, 1)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
            <button
              id="btn-add--rest-api-add-ip-address"
              :disabled="!formValues.hasIpAddressRestriction"
              class="ip-restriction__button mb-2"
              :class="{
                'disabled-button': !formValues.hasIpAddressRestriction
              }"
              type="button"
              @click="formValues.allowedIpAddresses.push({ name: '', value: '' })"
            >
              <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>ADD IP ADDRESS
            </button>
          </div>
        </form-group>

        <form-group title="Client Role" class-name="ip-restriction mt-4">
          <v-select
            :items="roleItems"
            outlined
            class="input-select standard-height"
            placeholder="Select role"
            item-text="name"
            item-value="resourceId"
            v-model="formValues.roleResourceIdList"
            hide-details
            required
            :rules="[(v) => validations.required(v, labels.Required)]"
          >
          </v-select>
        </form-group>
        <form-group title="Status" class-name="mt-4">
          <v-switch
            v-model="formValues.status"
            id="input--rest-api-status"
            :label="formValues.status ? labels.Active : labels.InActive"
            class="k-switch"
            color="#2196f3"
          />
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import { createRestApi, generateClientCredentials, getRestApi, updateRestApi } from '@/api/restApi'
import { scrollToComponent, isDifferent, copyToClipboard } from '@/utils/functions'
import RestApiModel from '@/components/Company Settings/RestApi/model'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import * as validations from '../../../utils/validations'
import { getAvailableSystemUsersRole } from '@/api/systemUsers'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'

export default {
  name: 'NewCustomApi',
  components: {
    InputEntityName,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputIpAddress
  },
  props: {
    selectedRow: {
      type: Object
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeOverlayWithUpdate', 'closeOverlay'],
  data() {
    return {
      validations,
      isGenerateClientBtnDisabled: false,
      editedClientSecret: '',
      saveDisable: false,
      labels,
      initialFormValues: null,
      formValues: new RestApiModel(),
      roleItems: [],
      systemUserFormData: null
    }
  },
  computed: {
    getBodyTitle() {
      return this.selectedRow && this.selectedRow.resourceId
        ? labels.CustomApiEditBodyTitle
        : labels.CustomApiBodyTitle
    },
    getBodySubtitle() {
      return this.selectedRow && this.selectedRow.resourceId
        ? labels.CustomApiEditBodySubtitle
        : labels.CustomApiBodySubtitle
    },
    getTitle() {
      return this.selectedRow && this.selectedRow.resourceId ? labels.EditClient : labels.NewClient
    },
    getIconName() {
      return this.selectedRow && this.selectedRow.resourceId ? 'mdi-pencil' : 'mdi-plus'
    },
    isShowGenerateCredentialsBtn() {
      return !(this.selectedRow && this.selectedRow.resourceId)
    },
    getConfirmButtonDisabled() {
      const { clientId, clientSecret } = this.formValues
      return this.saveDisable || (!clientId && !clientSecret)
    }
  },
  watch: {
    'formValues.status'(newVal) {
      this.formValues.statusId = Number(newVal)
    }
  },
  created() {
    this.getRoles().then(() => {
      if (!this.selectedRow) {
        this.initialFormValues = structuredClone(this.formValues)
      }
      if (this.selectedRow && this.selectedRow.resourceId) {
        getRestApi(this.selectedRow.resourceId).then((response) => {
          const { data: { data = {} } = {} } = response
          const allowedIpAddresses = data?.allowedIpAddresses?.map((ip) => ({
            name: ip,
            value: ip
          }))
          this.fillForm({ ...data, allowedIpAddresses })
          this.initialFormValues = structuredClone(this.formValues)
        })
      }
    })
  },
  methods: {
    copyToClipboard,
    getRoles() {
      return new Promise((res, rej) => {
        let allRoles = []
        let availableRoles = []
        getAvailableSystemUsersRole()
          .then((response) => {
            allRoles = response.data.data
            availableRoles = []
            availableRoles = allRoles
            this.roleItems = availableRoles.map((item) => {
              return {
                name: item.name,
                resourceId: item.resourceId
              }
            })
            if (!this.selectedRow) {
              const adminRole = availableRoles?.find((role) =>
                ['CompanyAdmin', 'Company Admin'].includes(role.name)
              )
              this.formValues.roleResourceIdList = adminRole?.resourceId
            }
            res()
          })
          .catch(() => rej('something went wrong'))
      })
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (isChanged) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeOverlay')
          }
        })
      } else {
        return this.$emit('closeOverlay')
      }
    },
    fillForm(data = {}) {
      for (const key of Object.keys(this.formValues)) {
        if (key === 'statusId') {
          this.formValues['status'] = Boolean(data[key])
        }
        if (key === 'clientSecret') {
          this.editedClientSecret = data[key]
          this.formValues['clientSecret'] = '*************************************'
        }
        if (key === 'allowedIpAddresses') {
          this.formValues['allowedIpAddresses'] =
            data.allowedIpAddresses &&
            data.allowedIpAddresses.map((item) => {
              return { name: '', value: item }
            })
        }
        if (key === 'roleResourceIdList') {
          this.formValues[key] = data.roleResourceIdList[0]
        } else {
          this.formValues[key] = data[key]
        }
      }
      if (!this.formValues.allowedIpAddresses)
        this.formValues.allowedIpAddresses = [{ name: '', value: '' }]
    },
    handleGenerateClientBtnClick() {
      if (!(this.selectedRow && this.selectedRow.resourceId)) {
        this.isGenerateClientBtnDisabled = true
        generateClientCredentials()
          .then((response) => {
            const { data: { data = {} } = {} } = response
            const { clientId, clientSecret } = data
            this.formValues.clientId = clientId
            this.formValues.clientSecret = clientSecret
          })
          .finally(() => (this.isGenerateClientBtnDisabled = false))
      }
    },
    submit() {
      const { refForm } = this.$refs

      if (refForm.validate()) {
        this.saveDisable = true
        let values = {
          ...this.formValues,
          allowedIpAddresses: this.formValues.allowedIpAddresses.map((item) => item.value),
          roleResourceIdList: this.formValues?.roleResourceIdList?.split()
        }
        if (!values.allowedIpAddresses[0]) values.allowedIpAddresses = []
        if (!values.hasIpAddressRestriction) values.allowedIpAddresses = []
        if (this.selectedRow && this.selectedRow.resourceId) {
          updateRestApi(this.selectedRow.resourceId, values)
            .then(() => {
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => {
              this.saveDisable = false
            })
        } else {
          createRestApi(values)
            .then(() => {
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => {
              this.saveDisable = false
            })
        }
      } else {
        this.$nextTick(() => {
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    }
  }
}
</script>
