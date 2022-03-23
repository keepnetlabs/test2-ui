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
      <SCIMSuccessDialog
        v-if="isShowSuccessDialog"
        :status="isShowSuccessDialog"
        :api-key="successApiKey"
        @on-close="handleCloseSuccessDialog"
      />
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >Map Fields
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-advanced-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >Group Settings
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <AppModalBodyHeader class="mt-0" :title="getTitle" :sub-title="getBodySubtitle" />
            <v-form ref="refStep1Form">
              <FormGroup :title="labels.ScimName" :sub-title="labels.ScimNameSub" has-hint>
                <InputEntityName
                  v-model.trim="formData.name"
                  id="input--scim-settings-name"
                  entity-name="SCIM setting"
                />
              </FormGroup>
              <FormGroup title="Map Fields">
                <MapCustomAndSCIMFields
                  ref="refMapCustomAndSCIMFields"
                  :custom-fields="customFields"
                  :scim-fields="scimFields"
                  :is-edit="isEdit"
                />
              </FormGroup>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <AppModalBodyHeader class="mt-0" :title="getTitle" :sub-title="getBodySubtitle" />
            <v-form ref="refStep2Form">
              <FormGroup :title="labels.GroupName" :sub-title="labels.GroupNameSub" has-hint>
                <InputTargetGroup
                  v-model.trim="formData.groupResourceId"
                  persistent-hint
                  hint="*Required"
                  :manipulate-items="handleManipulateItems"
                  :rules="[(v) => Validations.required(v)]"
                />
              </FormGroup>
              <FormGroup :title="labels.GroupBy" :sub-title="labels.GroupBySub" has-hint>
                <KSelect
                  v-model.trim="formData.groupBySCIMFieldResourceId"
                  id="input--add-or-edit-scim-group"
                  outlined
                  dense
                  persistent-hint
                  hint="*Required"
                  placeholder="Select a item"
                  :items="groupByItems"
                />
              </FormGroup>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <v-btn
        id="btn-cancel--add-or-edit-scim-settings-modal"
        class="add-in-configuration__footer-btn-cancel"
        rounded
        @click="handleClose"
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          v-if="step > 1"
          id="btn-back--add-or-edit-scim-settings-modal"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          @click="changeStep(-1)"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          id="btn-next--add-or-edit-scim-settings-modal"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :disabled="isActionButtonDisabled"
          @click="handleSubmit"
        >
          {{ [1].includes(step) ? labels.Next : labels.Save }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import {
  getSCIMFields,
  getSCIMSetting,
  createSCIMSetting,
  updateSCIMSetting
} from '@/api/scimSettings'
import MapCustomAndSCIMFields from '@/components/Company Settings/SCIM/MapCustomAndSCIMFields'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'
import SCIMSuccessDialog from '@/components/Company Settings/SCIM/SCIMSuccessDialog'
const EMITS = {
  ON_CLOSE: 'on-close'
}
export default {
  name: 'AddOrEditSCIMModal',
  components: {
    SCIMSuccessDialog,
    KSelect,
    InputTargetGroup,
    MapCustomAndSCIMFields,
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
      step: 1,
      isActionButtonDisabled: false,
      isShowSuccessDialog: false,
      formData: {
        name: '',
        groupResourceId: '',
        groupBySCIMFieldResourceId: ''
      },
      Validations,
      labels,
      successApiKey: '',
      groupByItems: [],
      scimFields: [],
      customFields: [],
      defaultScimFields: [],
      defaultCustomFields: []
    }
  },
  computed: {
    getTitle() {
      return this.isEdit ? labels.EditScimTitle : labels.NewScimTitle
    },
    getBodySubtitle() {
      return this.isEdit ? labels.EditScimTitle : labels.ScimSubtitle
    }
  },
  created() {
    if (this.isEdit && this.selectedRow && typeof this.selectedRow === 'object') {
      this.callForData()
    } else {
      this.callForGetSCIMFields()
      this.callForCustomFields()
    }
  },
  methods: {
    callForData() {
      getSCIMSetting(this.selectedRow.resourceId).then((response) => {
        console.log('response', response)
        const { data: { data = {} } = {} } = response
        for (const key of Object.keys(data)) {
          if (key === 'mappingDetails') {
            const { refMapCustomAndSCIMFields } = this.$refs
            refMapCustomAndSCIMFields.fieldMappings = data.mappingDetails
          } else {
            this.formData[key] = data[key]
          }
        }
      })
    },
    callForGetSCIMFields() {
      getSCIMFields().then((response) => {
        const scimFields = response?.data?.data.fields || []
        this.scimFields = scimFields.map(({ name, resourceId }) => ({
          text: name,
          value: resourceId,
          disabled: false
        }))
        this.defaultScimFields = JSON.parse(JSON.stringify(this.scimFields))
      })
    },
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId().then((response) => {
        const customFields = response?.data?.data || []
        this.customFields = customFields.map(({ name, resourceId }) => ({
          text: name,
          value: resourceId,
          disabled: false
        }))
        this.defaultCustomFields = JSON.parse(JSON.stringify(this.customFields))
      })
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        const { refStep1Form } = this.$refs
        if (refStep1Form.validate()) {
          this.step += 1
          this.groupByItems = this.$refs.refMapCustomAndSCIMFields.fieldMappings.map(
            ({ customFieldResourceId, scimFieldResourceId }) => ({
              text: this.defaultCustomFields.find(
                (customField) => customField.value === customFieldResourceId
              )?.text,
              value: scimFieldResourceId
            })
          )
          console.log(this.groupByItems)
        }
      } else {
        this.step += flag
      }
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    handleSubmit() {
      if (this.step === 2) {
        this.isActionButtonDisabled = true
        if (this.isEdit) {
          updateSCIMSetting({ name: this.formData.name }, this.selectedRow.resourceId)
            .then(() => {
              this.$emit('on-close-with-update')
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        } else {
          const { refMapCustomAndSCIMFields } = this.$refs
          debugger
          const payload = {
            name: this.formData.name,
            groupResourceId: this.formData.groupResourceId,
            groupBySCIMFieldResourceId: this.formData.groupBySCIMFieldResourceId,
            fieldMappings: refMapCustomAndSCIMFields.fieldMappings
          }
          createSCIMSetting(payload)
            .then((response) => {
              debugger
              this.isShowSuccessDialog = true
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        }
      } else {
        this.changeStep()
      }
    },
    handleCopyToClipboard(data = '') {
      navigator.clipboard.writeText(data).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'COPIED TO CLIPBOARD',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle'
        })
      })
    },
    handleManipulateItems(items = []) {
      return items.map(({ name, resourceId }) => ({ text: name, value: resourceId }))
    },
    handleCloseSuccessDialog() {
      this.successApiKey = ''
      this.isShowSuccessDialog = false
      this.$emit('on-close-with-update')
    }
  }
}
</script>
<style lang="scss">
#new-scim-settings-modal .k-stepper {
  overflow: visible;
  &__items {
    overflow: visible;
  }
}
.map-custom-and-scim-fields {
  &-item {
    display: flex;
    align-items: center;
  }
}
</style>
