<template>
  <AppModal
    v-if="status"
    :status="status"
    id="new-scim-settings-modal"
    icon-name="mdi-key"
    confirm-button-id="btn-save--scim-settings-modal"
    cancel-button-id="btn-cancel--scim-settings-modal"
    title-id="text--create-scim-settings-modal-title"
    :title="getTitle"
    @closeOverlay="handleClose"
  >
    <template v-slot:overlay-body>
      <AppModalBodyHeader :title="labels.NewScimTitle" :sub-title="labels.ScimSubtitle" />
      <v-form ref="refForm">
        <FormGroup :title="labels.ScimName" :sub-title="labels.ScimNameSub" has-hint>
          <InputEntityName
            v-model.trim="formData.name"
            id="input--scim-settings-name"
            entity-name="SCIM setting"
          />
        </FormGroup>
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import labels from '@/model/constants/labels'
import KSelect from '@/components/Common/Inputs/KSelect'
const EMITS = {
  ON_CLOSE: 'on-close'
}
export default {
  name: 'AddOrEditSCIMItem',
  components: { InputEntityName, FormGroup, AppModalBodyHeader, AppModal },
  emits: ['on-close'],
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        group: []
      },
      labels
    }
  },
  computed: {
    getTitle() {
      return this.isEdit ? labels.NewScimTitle : labels.EditScimTitle
    }
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
