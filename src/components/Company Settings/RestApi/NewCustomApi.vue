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
          class-name="auth-key"
          has-hint
        >
          <div class="auth-key__container">
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
          </div>
        </form-group>
        <form-group :title="labels.ClientSecret" :sub-title="labels.ClientSecretSubtitle" has-hint>
          <v-text-field
            :placeholder="labels.GenearetedClientSecret"
            outlined
            dense
            hint="*Required"
            persistent-hint
            class="auth-key__textfield"
            :disabled="true"
            v-model.trim="formValues.clientSecret"
          ></v-text-field>
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
import { createRestApi, generateClientCredentials } from '@/api/restApi'
import { scrollToComponent } from '@/utils/functions'
import RestApiModel from '@/components/Company Settings/RestApi/model'
import * as Validations from '@/utils/validations'
export default {
  name: 'NewCustomApi',
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
  emits: ['closeOverlayWithUpdate', 'closeOverlay'],
  data() {
    return {
      isGenerateClientBtnDisabled: false,
      saveDisable: false,
      labels,
      formValues: new RestApiModel(),
      Validations
    }
  },
  watch: {
    'formValues.status'(newVal) {
      this.formValues.statusId = Number(newVal)
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleGenerateClientBtnClick() {
      this.isGenerateClientBtnDisabled = true
      generateClientCredentials()
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { clientId, clientSecret } = data
          this.formValues.clientId = clientId
          this.formValues.clientSecret = clientSecret
        })
        .finally(() => (this.isGenerateClientBtnDisabled = false))
    },
    submit() {
      const { refForm } = this.$refs
      debugger
      if (refForm.validate()) {
        this.saveDisable = true
        createRestApi(this.formValues)
          .then(() => {
            this.$emit('closeOverlayWithUpdate')
          })
          .finally(() => {
            this.saveDisable = false
          })
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

<style lang="scss"></style>
