<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    icon-name="mdi-send"
    confirm-button-id="btn-save--certificates-template-modal"
    cancel-button-id="btn-cancel--certificates-template-modal"
    title-id="text--certificates-template-modal-title"
    :saveDisable="saveDisable"
    @closeOverlay="handleClose"
    @submit="submit"
  >
    <template v-slot:overlay-body>
      <AppModalBodyHeader :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup has-hint :title="labels.CertificateName">
          <InputEntityName
            v-model.trim="formData.name"
            id="input--certificate-name"
            entity-name="certificate"
          />
        </FormGroup>
        <FormGroup
          :title="labels.Description"
          :sub-title="labels.DescriptionCertificateSub"
          has-hint
        >
          <InputDescription
            v-model.trim="formData.description"
            id="input--certificate-description"
            required
            :max-length="300"
          />
        </FormGroup>
        <MakeAvailableFor
          v-model="formData.makeAvailableFor"
          ref="refMakeAvailableFor"
          sub-title="Companies that will see this setting in their libraries"
        />
        <FormGroup :title="labels.CertificateTemplate"> </FormGroup>
        <EmailTemplate
          ref="refEmailTemplate"
          onlyGrapes="true"
          :is-edit="!!selectedItem"
          :activeBlockManagerComponents="{}"
          :template.sync="formData.template"
          @handleEditHtmlTemplate="formData.template = $event"
        />
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import { EMITS } from '@/components/AwarenessEducator/utils'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
export default {
  name: 'NewCertificatesModal',
  components: {
    EmailTemplate,
    MakeAvailableFor,
    InputDescription,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
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
      labels,
      saveDisable: false,
      formData: {
        name: '',
        description: '',
        template: ''
      }
    }
  },
  computed: {
    getModalTitle() {
      return this.selectedItem ? labels.EditCertificate : labels.CreateNewCertificate
    },
    getBodyTitle() {
      return labels.TrainingCertificateInformation
    },
    getBodySubtitle() {
      return this.selectedItem ? labels.EditCertificateSub : labels.CreateNewCertificateSub
    }
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    submit() {}
  }
}
</script>
