<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New Client'"
    icon-name="mdi-plus"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        :title="labels.CustomApiBodyTitle"
        :sub-title="labels.CustomApiBodySubtitle"
      />
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
          class-name="copy-to-clipboard"
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
          :class-name="isShowGenerateCredentialsBtn ? 'copy-to-clipboard' : ''"
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
              v-if="isShowGenerateCredentialsBtn"
              text
              color="#2196f3"
              class="ml-2"
              @click="handleCopyToClipboard(formValues.clientSecret)"
              >{{ labels.CopyToClipboard }}</v-btn
            >
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
export default {
  name: 'NewCustomApi',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup
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
      isGenerateClientBtnDisabled: false,
      editedClientSecret: '',
      saveDisable: false,
      labels,
      formValues: new RestApiModel(),
      Validations
    }
  },
  computed: {
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
        } else {
          this.formValues[key] = data[key]
        }
      }
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
        if (this.selectedRow && this.selectedRow.resourceId) {
          const payload = { ...this.formValues, clientSecret: this.editedClientSecret }
          updateRestApi(this.selectedRow.resourceId, payload)
            .then(() => {
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => {
              this.saveDisable = false
            })
        } else {
          createRestApi(this.formValues)
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
