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

        <FormGroup :title="labels.GroupName" :sub-title="labels.GroupNameSub">
          <KSelect
            v-model.trim="formData.group"
            id="input--add-or-edit-scim-group"
            outlined
            dense
            placeholder="Select a item"
            :items="groupItems"
          />
        </FormGroup>
        <FormGroup
          style="max-width: 750px;"
          :title="labels.SecretToken"
          :sub-title="labels.SecretTokenSub"
        >
          <InputWithCopyToClipboard copyKey="secretToken" @on-copy="handleCopyToClipboard">
            <template #input>
              <v-text-field
                v-model.trim="formData.secretToken"
                id="input--scim-settings-secret-token"
                placeholder="Enter Secret Token"
                outlined
                dense
                disabled
              ></v-text-field>
            </template>
          </InputWithCopyToClipboard>
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
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getSCIMSetting } from '@/api/scimSettings'
const EMITS = {
  ON_CLOSE: 'on-close'
}
export default {
  name: 'AddOrEditSCIMModal',
  components: {
    InputWithCopyToClipboard,
    KSelect,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  emits: ['on-close'],
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        name: '',
        group: [],
        secretToken: ''
      },
      labels,
      groupItems: []
    }
  },
  computed: {
    getTitle() {
      return this.isEdit ? labels.EditScimTitle : labels.NewScimTitle
    }
  },
  created() {
    if (this.isEdit && this.selectedRow && typeof this.selectedRow === 'object') {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      getSCIMSetting(this.selectedRow.resourceId).then((response) => {
        debugger
      })
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    handleCopyToClipboard(data = '') {
      navigator.clipboard.writeText(data).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'COPIED TO CLIPBOARD',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle'
        })
      })
    }
  }
}
</script>
