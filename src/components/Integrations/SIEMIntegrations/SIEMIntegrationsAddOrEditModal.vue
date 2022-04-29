<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    icon-name="mdi-plus"
    :id="selectedItem ? 'edit-siem-integrations-modal' : 'new-siem-integrations-modal'"
    confirm-button-id="btn-save--siem-integrations-template-modal"
    cancel-button-id="btn-siem-integrations--notification-template-modal"
    title-id="text--siem-integrations-modal-title"
    :saveDisable="isActionButtonDisabled"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template v-slot:overlay-body>
      <AppModalBodyHeader :title="getModalTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup has-hint :title="ENUMS.URL">
          <InputUrl
            v-model.trim="formData.url"
            id="input--siem-integrations-url"
            placeholder="Enter URL"
          />
        </FormGroup>
        <FormGroup :title="labels.SecretToken" has-hint>
          <v-text-field
            v-model.trim="formData.secretToken"
            id="input--siem-integrations-secret-token"
            outlined
            dense
            persistent-hint
            placeholder="Enter Secret Token"
            hint="*Required"
            :rules="secretTokenRules"
          ></v-text-field>
        </FormGroup>
        <form-group :title="labels.TestConnection" class="mt-2">
          <TestConnection ref="testConnection" />
        </form-group>
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'

import { scrollToComponent } from '@/utils/functions'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import TestConnection from '@/components/MailConfiguration/TestConnection'
export default {
  name: 'SIEMIntegrationsAddOrEditModal',
  components: { TestConnection, InputUrl, FormGroup, AppModalBodyHeader, AppModal },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        url: '',
        secretToken: ''
      },
      ENUMS: {
        URL: labels.URL.toUpperCase()
      },
      secretTokenRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.SecretToken, 2000))
      ],
      isActionButtonDisabled: false,
      labels,
      Validations
    }
  },
  computed: {
    getModalTitle() {
      return this.selectedItem ? labels.EditSEIMIntegration : labels.NewSEIMIntegartion
    },
    getBodySubtitle() {
      return labels.SIEMSettingSubtitle
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSubmit() {
      if (this.$refs.refForm.validate()) {
        this.isActionButtonDisabled = true
      } else {
        this.$nextTick(() => {
          scrollToComponent(this.$refs.refForm)
        })
      }
    }
  }
}
</script>
