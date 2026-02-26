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
    <template #overlay-body>
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
              <FormGroup title="Map Fields" style="max-width: 740px !important;">
                <DatatableLoading
                  v-if="isLoading"
                  class="map-custom-and-scim-fields-loading"
                  :loading="isLoading"
                />
                <MapCustomAndSCIMFields
                  v-else
                  ref="refMapCustomAndSCIMFields"
                  :custom-fields="customFields"
                  :scim-fields="scimFields"
                  :initial-value="editedMapCustomSCIMFields"
                  :is-edit="isEdit"
                />
              </FormGroup>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <AppModalBodyHeader class="mt-0" :title="getTitle" :sub-title="getBodySubtitle" />
            <v-form ref="refStep2Form">
              <FormGroup :title="labels.GroupName" :sub-title="labels.GroupNameSub">
                <InputTargetGroup
                  v-model.trim="formData.groupResourceId"
                  ref="inputTargetGroup"
                  clearable
                  :placeholder="isEdit ? labels.NoneSelected : 'Select user groups'"
                  :manipulate-items="handleManipulateItems"
                  :payload="targetGroupPayload"
                  :disabled="isEdit"
                />
              </FormGroup>
              <FormGroup title="Grouping Criteria">
                <VRadioGroup
                  v-model="formData.syncPlatformGroup"
                  class="mt-2 mb-3 pt-0 campaign-manager-target-groups-radio"
                  :disabled="isEdit"
                  hide-details
                >
                  <div>
                    <VRadio
                      :id="`input--campaign-manager-radio-distribution-to`"
                      class="mb-4"
                      color="#2196f3"
                      label="Select a SCIM field to determine user groups"
                      :value="false"
                    />
                    <KSelect
                      v-model.trim="formData.groupBySCIMFieldResourceId"
                      id="input--add-or-edit-scim-group"
                      outlined
                      dense
                      :placeholder="isEdit ? labels.NoneSelected : 'Select a item'"
                      clearable
                      :items="groupByItems"
                      :disabled="isEdit || formData.syncPlatformGroup"
                    />
                  </div>
                  <VRadio
                    :id="`input--campaign-manager-radio-distribution-to`"
                    class="mb-0"
                    color="#2196f3"
                    label="Synchronize groups with Identity Management Platform"
                    :value="true"
                  />
                </VRadioGroup>
              </FormGroup>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-scim-settings-modal',
          backButton: 'btn-back--add-or-edit-scim-settings-modal',
          nextButton: 'btn-next--add-or-edit-training-modal',
          saveButton: 'btn-save--add-or-edit-training-modal'
        }"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        @on-cancel="handleClose"
        @on-back="changeStep(-1)"
        @on-next="handleSubmit()"
        @on-submit="handleSubmit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import labels from '@/model/constants/labels'
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
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { isDifferent, copyToClipboard, getDefaultAxiosPayload } from '@/utils/functions'
import StepperFooter from '@/components/Stepper/StepperFooter'
const EMITS = {
  ON_CLOSE: 'on-close'
}
export default {
  name: 'AddOrEditSCIMModal',
  components: {
    StepperFooter,
    DatatableLoading,
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
      formData: {
        name: '',
        groupResourceId: '',
        groupBySCIMFieldResourceId: '',
        syncPlatformGroup: false
      },
      initialFormData: {
        name: '',
        groupResourceId: '',
        groupBySCIMFieldResourceId: '',
        syncPlatformGroup: false
      },
      targetGroupPayload: getDefaultAxiosPayload({
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  Value: 'false',
                  FieldName: 'isscimgroup',
                  Operator: 'Include'
                },
                {
                  Value: 'false',
                  FieldName: 'isgooglegroup',
                  Operator: 'Include'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }),
      Validations,
      labels,
      isLoading: false,
      groupByItems: [],
      scimFields: [],
      customFields: [],
      defaultScimFields: [],
      defaultCustomFields: [],
      editedMapCustomSCIMFields: []
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
  watch: {
    'formData.syncPlatformGroup'(val) {
      if (val) {
        this.formData.groupBySCIMFieldResourceId = ''
      }
    }
  },
  methods: {
    callForData() {
      this.isLoading = true
      getSCIMSetting(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          for (const key of Object.keys(data)) {
            if (key === 'mappingDetails') {
              const mappingDetails = data?.mappingDetails || []
              const fieldMappings = mappingDetails.map(({ scimPath, customFieldName }) => ({
                customFieldResourceId: customFieldName,
                scimFieldResourceId: scimPath
              }))
              this.editedMapCustomSCIMFields = mappingDetails.map(
                ({ scimPath, customFieldName }) => ({
                  customFieldResourceId: customFieldName,
                  scimFieldResourceId: scimPath
                })
              )
              this.customFields = fieldMappings.map(({ customFieldResourceId }) => ({
                text: customFieldResourceId,
                value: customFieldResourceId
              }))
              this.scimFields = fieldMappings.map(({ scimFieldResourceId }) => ({
                text: scimFieldResourceId,
                value: scimFieldResourceId
              }))
            } else if (key === 'groupByCustomFieldName') {
              this.formData.groupBySCIMFieldResourceId = data.groupByCustomFieldName
              if (this.formData.groupBySCIMFieldResourceId) {
                this.groupByItems = [
                  {
                    text: this.formData.groupBySCIMFieldResourceId,
                    value: this.formData.groupBySCIMFieldResourceId
                  }
                ]
              }
            } else if (key === 'groupName') {
              this.formData.groupResourceId = data.groupName
              if (this.formData.groupResourceId) {
                this.$refs.inputTargetGroup.items = [
                  { text: data.groupName, value: data.groupName }
                ]
              }
            } else {
              this.formData[key] = data[key]
            }
          }
          this.initialFormData = structuredClone(this.formData)
        })
        .finally(() => {
          this.isLoading = false
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
        this.defaultScimFields = structuredClone(this.scimFields)
      })
    },
    callForCustomFields() {
      this.isLoading = true
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const customFields = response?.data?.data || []
          this.customFields = customFields
            .filter((cField) => cField.isActive)
            .map(({ name, resourceId }) => ({
              text: name,
              value: resourceId,
              disabled: true
            }))
          this.editedMapCustomSCIMFields = this.customFields.map((cField) => ({
            customFieldResourceId: cField.value,
            scimFieldResourceId: ''
          }))
          this.defaultCustomFields = structuredClone(customFields)
        })
        .finally(() => (this.isLoading = false))
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        const { refStep1Form } = this.$refs
        if (!refStep1Form?.validate()) return
        this.step += 1
        if (this.isEdit) return
        this.setDefaultGroupByFields()
      } else {
        this.step += flag
      }
    },
    setDefaultGroupByFields() {
      this.groupByItems = [
        ...[{ text: 'Department', value: '9fd0afec416c' }],
        ...this.$refs.refMapCustomAndSCIMFields.fieldMappings.reduce(
          (acc, { customFieldResourceId, scimFieldResourceId }) => {
            if (!customFieldResourceId || !scimFieldResourceId) return acc
            const customField = this.defaultCustomFields.find(
              (customField) => customField.resourceId === customFieldResourceId
            )
            if (!customField) return acc
            if (customField.fieldDataType !== 'String') return acc
            acc.push({
              text: customField?.name,
              value: scimFieldResourceId
            })
            return acc
          },
          []
        )
      ]
    },
    handleClose() {
      const isChanged = isDifferent(this.formData, this.initialFormData)
      if (!isChanged) {
        return this.$emit(EMITS.ON_CLOSE)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit(EMITS.ON_CLOSE)
        }
      })
    },
    handleSubmit() {
      if (this.step === 2) {
        this.isActionButtonDisabled = true
        if (this.isEdit) {
          updateSCIMSetting({ name: this.formData.name }, this.selectedRow.resourceId)
            .then(() => {
              this.$emit('on-close')
              this.$emit('on-close-with-update')
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        } else {
          const { refMapCustomAndSCIMFields } = this.$refs
          const payload = {
            name: this.formData.name,
            groupResourceId: this.formData.groupResourceId,
            groupBySCIMFieldResourceId: this.formData.groupBySCIMFieldResourceId,
            fieldMappings: refMapCustomAndSCIMFields.fieldMappings,
            syncPlatformGroup: this.formData.syncPlatformGroup
          }
          if (payload.fieldMappings && payload.fieldMappings.length) {
            payload.fieldMappings = payload.fieldMappings.filter(
              (mapping) => mapping.customFieldResourceId && mapping.scimFieldResourceId
            )
          }
          createSCIMSetting(payload)
            .then((response) => {
              this.$emit('on-success-create', response?.data?.data?.token)
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
      copyToClipboard(data)
    },
    handleManipulateItems(items = []) {
      return items.map(({ name, resourceId }) => ({ text: name, value: resourceId }))
    }
  }
}
</script>
