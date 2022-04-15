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
      <v-form ref="refForm" lazy-validation> </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'

import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'SIEMIntegrationsAddOrEditModal',
  components: { AppModalBodyHeader, AppModal },
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
      isActionButtonDisabled: false,
      labels,
      Validations: Validations
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
