<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getTitle"
    :icon-name="getIconName"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm">
        <form-group :title="labels.ClientName" :sub-title="labels.CustomApiSubtitle" has-hint>
          <v-text-field
            placeholder="Enter client name"
            outlined
            dense
            class="auth-key__textfield"
            hint="*Required"
            persistent-hint
            v-model.trim="formValues.name"
            :rules="[
              (v) => Validations.required(v, labels.Required),
              (v) => Validations.startsWithSpace(v),
              (v) =>
                Validations.maxLength(
                  v,
                  64,
                  labels.getMaxLengthMessage(labels.ClientNameSecondLower)
                )
            ]"
          ></v-text-field>
          <v-btn
            v-if="isShowGenerateCredentialsBtn"
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
            <v-text-field
              :placeholder="labels.GeneratedClientId"
              outlined
              dense
              hint="*Required"
              persistent-hint
              class="auth-key__textfield"
              :disabled="true"
              v-model.trim="formValues.clientId"
            ></v-text-field>
            <v-btn
              v-if="formValues.clientId"
              text
              color="#2196f3"
              class="ml-2"
              @click="handleCopyToClipboard(formValues.clientId)"
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
            <v-text-field
              :placeholder="labels.GeneratedClientSecret"
              outlined
              dense
              hint="*Required"
              persistent-hint
              class="auth-key__textfield"
              :disabled="true"
              v-model.trim="formValues.clientSecret"
            ></v-text-field>
            <v-btn
              v-if="isShowGenerateCredentialsBtn && formValues.clientSecret"
              text
              color="#2196f3"
              class="ml-2"
              @click="handleCopyToClipboard(formValues.clientSecret)"
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
            <v-radio-group v-model="formValues.hasIpAddressRestriction" :mandatory="false" row>
              <v-radio :value="false" label="Allow all IPs" color="#2196f3"></v-radio>
              <v-radio
                :value="true"
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
                  medium
                  left
                  class="ml-2"
                  v-if="formValues.allowedIpAddresses.length > 1"
                  @click="formValues.allowedIpAddresses.splice(index, 1)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
            <button
              :disabled="!formValues.hasIpAddressRestriction"
              class="ip-restriction__button mb-2"
              :class="{ 'disabled-button': !formValues.hasIpAddressRestriction }"
              type="button"
              @click="formValues.allowedIpAddresses.push({ name: '', value: '' })"
            >
              <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>ADD IP ADDRESS
            </button>
          </div>
        </form-group>
        <form-group title="Status">
          <v-switch
            v-model="formValues.status"
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
import { scrollToComponent } from '@/utils/functions'
import RestApiModel from '@/components/Company Settings/RestApi/model'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import * as validations from '../../../utils/validations'

export default {
  name: 'NewCustomApi',
  components: {
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
      validations: validations,
      isGenerateClientBtnDisabled: false,
      editedClientSecret: '',
      saveDisable: false,
      labels,
      formValues: new RestApiModel(),
      Validations
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
    }
  },
  watch: {
    'formValues.status'(newVal) {
      this.formValues.statusId = Number(newVal)
    }
  },
  created() {
    if (this.selectedRow && this.selectedRow.resourceId) {
      getRestApi(this.selectedRow.resourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        this.fillForm(data)
      })
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
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
        } else {
          this.formValues[key] = data[key]
        }
      }
      if (!this.formValues.allowedIpAddresses)
        this.formValues.allowedIpAddresses = [{ name: '', value: '' }]
    },
    handleCopyToClipboard(data = '') {
      navigator.clipboard.writeText(data)
      this.$store.dispatch('common/createSnackBar', {
        message: 'COPIED TO CLIPBOARD',
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
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
          allowedIpAddresses: this.formValues.allowedIpAddresses.map((item) => item.value)
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

<style lang="scss">
.ip-restriction {
  &__delete-button {
    width: 44px;
    height: 40px;
    color: #757575;
    position: absolute;
    right: -40px;
    top: 0px;
    justify-content: center;
    display: flex;
  }
  &__button {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .v-input--selection-controls {
    margin-top: 0 !important;
  }
  .v-input--radio-group__input {
    display: flex;
    flex-flow: column;
  }
  .v-radio {
    &:first-child {
      margin-bottom: 8px !important;
    }
    label {
      font-size: 14px !important;
      font-weight: normal !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.5 !important;
      letter-spacing: normal !important;
      color: #383b41 !important;
    }
  }
}
.copy-to-clipboard {
  max-width: 720px !important;
  &__container {
    display: flex;
    .v-btn {
      padding: 0 8px !important;
      font-size: 14px;
      font-weight: 600;
      margin-top: 1px;
    }
  }
}
</style>
