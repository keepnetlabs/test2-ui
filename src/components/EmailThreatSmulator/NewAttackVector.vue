<template>
  <div class="new-attack-vector">
    <app-dialog
      v-if="showActiveStatusModal"
      :status="showActiveStatusModal"
      icon="mdi-power-standby"
      title="Enable Attack Vectors?"
      @changeStatus="handleCloseStatusDialog(true)"
    >
      <template #app-dialog-body>
        <span>Are you sure you want to enable these attack vectors?</span>
      </template>
      <template #app-dialog-footer>
        <app-dialog-footer
          type="confirm"
          @handleClose="handleCloseStatusDialog(false)"
          @handleConfirm="handleCloseStatusDialog(true)"
        />
      </template>
    </app-dialog>
    <app-modal :status="status" custom-icon="shield-icon.svg" :title="pageTitle">
      <template #overlay-body>
        <v-form ref="refAttackVectorForm">
          <app-modal-body-header
            class="mt-8"
            :title="isEdit ? 'Edit Attack Vector' : 'Add New Attack Vector'"
            sub-title="Enter attack vector information and upload file"
          />
          <form-group title="Vector Name" hint>
            <InputEntityName
              v-model.trim="formValues.name"
              entity-name="name"
              initial-placeholder="Enter a name for the vector"
              :initial-rules="baseRules"
            />
          </form-group>
          <form-group title="Category" sub-title="Select type of the vector" hint>
            <KSelect
              v-model="formValues.categoryResourceId"
              persistentHint
              item-text="name"
              item-value="resourceId"
              outlined
              :items="categoryResources"
              :hint="'*Required'"
            />
          </form-group>
          <form-group
            title="Severity"
            sub-title="Enter between 1-10 (1 being the lowest and 10 being the highest)"
            hint
          >
            <InputNumber
              v-model="formValues.riskFactor"
              entity-name="severity"
              initial-placeholder="Enter severity degree"
              :initial-rules="numberRangeRule"
            />
          </form-group>
          <form-group title="Upload file" sub-title="Upload attack vector file" hint>
            <KFileUpload
              width="216"
              hint="Max. file size 200MB"
              ref="refFileUpload"
              :deletable="isFileDeletable"
              :filePreviews="getFilePreviews"
              :extensions="[]"
              :size="200"
              :errorText="fileErrorText"
              :hasError="!!fileErrorText"
              @inputFile="onFileChanged"
            />
          </form-group>
          <form-group
            className="mt-6"
            title="Status"
            sub-title="This attack vector will be included to continuous scans and new scans."
            hint
          >
            <v-switch
              v-model="formValues.isActive"
              color="#2196F3"
              hide-details
              @change="isActiveChange()"
            >
              <template #prepend>
                <v-label>
                  <span v-if="formValues.isActive" class="is-active-label">ENABLED</span>
                  <span v-else class="is-active-label passive">DISABLED</span>
                </v-label>
              </template>
            </v-switch>
          </form-group>
        </v-form>
      </template>
      <template #overlay-footer>
        <v-btn
          id="btn-cancel--add-or-edit-attack-vector-modal"
          class="add-user-overlay__footer-btn-cancel"
          rounded
          @click="closeAttackVectorPopup"
        >
          {{ labels.Cancel }}
        </v-btn>
        <v-btn
          id="btn-save--add-or-edit-attack-vector-modal"
          class="add-user-overlay__footer-btn-save white--text"
          color="#2196f3"
          rounded
          :disabled="saveDisable"
          @click="submit"
        >
          {{ labels.Save }}
        </v-btn>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '../AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import * as Validations from '@/utils/validations'
import {
  getAttackVectorCreate,
  getAttackVectorUpdate,
  getAttackVectorById,
  getLookupNameList
} from '@/api/emailThreatSimlator'
import { getLookupListByTypeId } from '@/api/common'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AppDialog from '@/components/AppDialog'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputNumber from '@/components/Common/Inputs/InputNumber'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'NewScan',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    KFileUpload,
    AppDialog,
    AppDialogFooter,
    InputEntityName,
    InputNumber,
    KSelect
  },
  data() {
    return {
      saveDisable: false,
      categoryResources: [],
      labels,
      Validations,
      fileErrorText: '',
      formValues: {
        name: '',
        categoryResourceId: null,
        content: '',
        riskFactor: 1,
        isActive: false
      },
      baseRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.maxLength(v, 160, labels.getMaxLengthMessage('Vector Name', 160))
      ],
      numberRangeRule: [(v) => Validations.numberRangeRule(v, 1, 10)],
      isSubmitDisabled: false,
      isFormValuesChanged: false,
      showActiveStatusModal: false
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    attackVectorDetails: {
      required: true,
      type: Object
    }
  },
  watch: {
    formValues: {
      handler: function (value) {
        this.isFormValuesChanged = true
        if (this.formValues.riskFactor !== '') {
          this.formValues.riskFactor = value.riskFactor?.toString().replaceAll(/\D*/g, '')
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    pageTitle() {
      return this.isEdit ? 'Edit Attack Vector' : 'Create Attack Vector'
    },
    isFileDeletable() {
      return !!this.formValues?.content?.name
    },
    getFilePreviews() {
      return this.formValues?.content || (this.formValues?.fileName && this.formValues?.extension)
        ? [
            {
              name:
                this.formValues?.content?.name ||
                this.formValues?.fileName + this.formValues?.extension ||
                ''
            }
          ]
        : []
    }
  },
  created() {
    getLookupNameList().then((lookupNameList) => {
      const lookups = lookupNameList.data.data.find((x) => x.name == 'PluginCategory')
      getLookupListByTypeId(lookups.id).then((categories) => {
        const categoryList = categories.data.data
        this.categoryResources = categoryList
        this.formValues.categoryResourceId = categoryList[0].resourceId
        if (this.isEdit) {
          getAttackVectorById(this.attackVectorDetails.resourceId).then((response) => {
            const details = response.data.data
            this.formValues.categoryResourceId = categoryList.find(
              (x) => x.resourceId == details.categoryResourceId
            ).resourceId
            details.isActive = details.status == 'Enabled'
            this.formValues = details
          })
        }
      })
    })
  },
  methods: {
    setNumberRangeRule(isNeed) {
      if (isNeed) {
        return this.numberRangeRule
      }
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.content = ''
        this.formValues.fileName = ''
        this.formValues.extension = ''
        this.fileErrorText = 'Attack vector file is required'
      } else {
        this.formValues.content = file
        this.fileErrorText = ''
      }
    },
    closeAttackVectorPopup() {
      if (!this.isFormValuesChanged) {
        return this.$emit('changeNewAttackVectorModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewAttackVectorModalStatus', false)
        }
      })
    },
    isActiveChange() {
      if (this.formValues.isActive) {
        this.showActiveStatusModal = true
      }
    },
    submit() {
      if (!this.formValues.content && !(this.formValues.fileName && this.formValues.extension)) {
        this.$refs.refAttackVectorForm.validate()
        this.fileErrorText = 'Attack vector file is required'
        return
      }
      if (this.$refs.refAttackVectorForm.validate() && !this.fileErrorText) {
        const { name, categoryResourceId, content, riskFactor, isActive } = this.formValues
        const formData = {
          name,
          categoryResourceId,
          content,
          riskFactor,
          isActive
        }
        const payload = this.createFormDataPayload(formData)
        const requestFunc = this.isEdit
          ? getAttackVectorUpdate(payload, this.attackVectorDetails.resourceId)
          : getAttackVectorCreate(payload)
        this.saveDisable = true
        requestFunc
          .then(() => {
            this.$store.dispatch('common/createSnackBar', {
              message: this.isEdit
                ? 'Attack Vector successfully updated.'
                : 'Attack Vector successfully added.',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.$emit('changeNewAttackVectorModalStatus', false, true)
          })
          .catch((error) => {
            const errorResponse = error.response.data
            this.$store.dispatch('common/createSnackBar', {
              message: errorResponse?.message || '',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
          })
          .finally(() => {
            this.saveDisable = false
          })
      }
    },
    createFormDataPayload(payload = {}) {
      const formData = new FormData()
      for (const key of Object.keys(payload)) {
        formData.append(key.slice(0, 1).toUpperCase() + key.slice(1), payload[key])
      }
      return formData
    },
    handleCloseStatusDialog(status = false) {
      this.formValues.isActive = status
      this.showActiveStatusModal = false
    }
  }
}
</script>
