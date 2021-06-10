<template>
  <app-modal
    :status="status"
    @closeOverlay="status = false"
    :icon-name="getIcon"
    :title="getTitle"
    className="add-user-overlay"
    :saveDisable="saveDisable"
    title-id="text--target-users-people-create-user-modal-title"
    subtitle-id="text--target-users-people-create-user-modal-subtitle"
  >
    <template v-slot:overlay-body>
      <target-users-check-license-dialog
        v-if="showLicenseExceededDialog"
        :status="showLicenseExceededDialog"
        :dialogBody="getDialogBody"
        @close-overlay="toggleShowLicenseExceededDialog"
      >
        <template #footer>
          <app-dialog-footer
            confirm-button-id="btn-confirm--target-users-check-license-dialog"
            cancel-button-id="btn-cancel--target-users-check-license-dialog"
            @handleClose="toggleShowLicenseExceededDialog"
            @handleConfirm="callForCreateTargetUser"
          />
        </template>
      </target-users-check-license-dialog>
      <v-form ref="refForm">
        <app-modal-body-header
          :title="editData ? 'Edit  User Manually' : 'Add New User Manually'"
          sub-title="Define user properties"
        />
        <form-group :title="labels.FirstName" has-hint>
          <InputFirstName v-model.trim="formValues.firstName" id="input--target-user-first-name" />
        </form-group>
        <form-group :title="labels.LastName" has-hint>
          <InputLastName v-model.trim="formValues.lastName" id="input--target-user-last-name" />
        </form-group>
        <form-group has-hint title="Email">
          <InputEmail v-model.trim="formValues.email" id="input--target-user-email" />
        </form-group>
        <form-group title="Department">
          <InputDepartment
            v-model.trim="formValues.department"
            id="input--target-user-department"
          />
        </form-group>
        <form-group
          :title="item.name"
          :has-hint="item.isRequired"
          :key="index"
          v-for="(item, index) in customFields"
        >
          <v-text-field
            v-model.trim="customFieldsModels[item.resourceId]"
            :id="`input--target-user-custom-field-${item.name}`"
            outlined
            dense
            :placeholder="`Enter ${item.name}`"
            height="40"
            :key="item.name"
            v-bind="getCustomFieldItemProps(item)"
            v-mask="item.fieldDataType === 'Number' ? '##########' : ''"
            v-if="
              item.fieldDataType === 'String' ||
              item.fieldDataType === 'Number' ||
              item.fieldDataType === 'Email'
            "
          ></v-text-field>
          <div
            v-else-if="item.fieldDataType === 'DateTime' || item.fieldDataType === 'Date'"
            :class="[
              item.isRequired ? 'mb-2' : 'mb-6',
              item.isRequired && validatePicker(item) && 'add-user-overlay__picker--error',
              'add-user-overlay__picker'
            ]"
          >
            <InputDate
              v-model.trim="customFieldsModels[item.resourceId]"
              :id="`input--target-user-custom-field-${item.name}`"
              popper-class="filter__date-picker"
              :key="item.name"
              v-bind="getDatePickerProps(item)"
              :format="getTimeZone() || 'yyyy/MM/dd HH:mm'"
              :valueFormat="getTimeZone() || `yyyy/MM/dd HH:mm`"
              :type="item.fieldDataType === 'DateTime' ? 'datetime' : 'date'"
            />
            <template v-if="item.isRequired">
              <div class="v-text-field__details checkbox-error" v-if="validatePicker(item)">
                <transition appear name="bounce">
                  <div class="v-messages theme--light error--text" role="alert">
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message" style="padding-left: 10px;">
                        Required
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div v-else>
                <div class="v-messages theme--light" role="alert">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message" style="padding-left: 10px; font-size: 9px;">
                      *Required
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <k-checkbox
            v-model.trim="customFieldsModels[item.resourceId]"
            :id="`input--target-user-custom-field-${item.name}`"
            :label="item.name"
            color="#2196f3"
            class="mb-2 mt-n1"
            v-bind="getCustomFieldItemProps(item)"
            v-if="item.fieldDataType === 'Boolean'"
          />
        </form-group>
        <form-group title="Priority">
          <k-select
            v-model.trim="formValues.priority"
            id="input--target-user-priority"
            :items="priorityItems"
            outlined
            dense
          />
        </form-group>
        <form-group title="Active">
          <v-switch
            v-model="formValues.isActive"
            id="input--target-user-is-active"
            color="#2196f3"
            :label="formValues.isActive ? 'Yes' : 'No'"
          />
        </form-group>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn
        id="btn-cancel--target-users-add-user-to-people-modal"
        class="add-user-overlay__footer-btn-cancel"
        rounded
        @click="closeOverlay"
      >
        {{ labels.Cancel }}
      </v-btn>
      <v-btn
        id="btn-save--target-users-add-user-to-people-modal"
        class="add-user-overlay__footer-btn-save white--text"
        color="#2196f3"
        rounded
        @click="submit"
        :disabled="saveDisable"
      >
        {{ labels.Save }}
      </v-btn>
    </template>
  </app-modal>
</template>

<script>
import { mail, maxLength, required } from '@/utils/validations'
import { createTargetUser, getTargetGroups, updateTargetUser } from '@/api/targetUsers'
import AppModal from '../AppModal'
import { scrollToComponent } from '@/utils/functions'
import InputDepartment from '@/components/Common/Inputs/InputDepartment'
import InputLastName from '@/components/Common/Inputs/InputLastName'
import InputFirstName from '@/components/Common/Inputs/InputFirstName'
import KSelect from '@/components/Common/Inputs/KSelect'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import labels from '@/model/constants/labels'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox'
import { getTimeZone } from '@/utils/functions'
export default {
  name: 'AddUserModal',
  components: {
    KCheckbox,
    AppDialogFooter,
    InputEmail,
    FormGroup,
    AppModalBodyHeader,
    InputDepartment,
    AppModal,
    KSelect,
    InputFirstName,
    InputLastName,
    InputDate,
    TargetUsersCheckLicenseDialog
  },
  props: {
    status: {
      type: Boolean
    },
    editData: {
      type: Object
    },
    customFields: {
      type: Array
    },
    companyLicense: {
      type: Object
    }
  },
  data() {
    return {
      saveDisable: false,
      labels,
      formValues: {
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        priority: 'Medium',
        isActive: true
      },
      isPickersValidated: {},
      customFieldsModels: {},
      showLicenseExceededDialog: false,
      priorityItems: [
        { text: 'Very Low', value: 'VeryLow' },
        'Low',
        'Medium',
        'High',
        { text: 'Very High', value: 'VeryHigh' }
      ],
      validations: {
        required,
        mail,
        maxLength
      }
    }
  },
  computed: {
    getDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense['licenseLimit']} target users. Current target user count is ${this.companyLicense['totalUserCount']}. Do you want to save this user?`
        : ''
    },
    getTitle() {
      return this.editData ? 'Edit User' : 'Add New User'
    },
    getIcon() {
      return this.editData ? 'mdi-account-edit' : 'mdi-account-plus'
    }
  },
  methods: {
    getTimeZone() {
      return getTimeZone()
    },
    closeOverlay() {
      this.$emit('closeAddUserModal')
    },
    validatePicker(item = {}) {
      return (
        (item.fieldDataType === 'DateTime' || item.fieldDataType === 'Date') &&
        !this.customFieldsModels[item.resourceId] &&
        this.isPickersValidated[item.resourceId]
      )
    },
    submit() {
      const keys = Object.keys(this.isPickersValidated)
      let isPickersValid = true

      for (let key of keys) {
        if (
          !this.customFieldsModels[key] &&
          this.customFields.find((item) => item.resourceId === key)['isRequired']
        ) {
          this.$set(this.isPickersValidated, key, true)
          isPickersValid = false
        }
      }
      this.$forceUpdate()
      if (!this.$refs.refForm.validate() || !isPickersValid) {
        return this.$nextTick(() => {
          const el = this.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      } else {
        if (this.editData) {
          this.callForUpdateTargetUser()
        } else {
          const { activeUserCount, licenseLimit, isLimited } = this.companyLicense
          if (
            isLimited &&
            (this.companyLicense['isLicenseExceeded'] || activeUserCount === licenseLimit)
          ) {
            this.toggleShowLicenseExceededDialog()
          } else {
            this.callForCreateTargetUser()
          }
        }
      }
    },
    toggleShowLicenseExceededDialog() {
      this.showLicenseExceededDialog = !this.showLicenseExceededDialog
    },
    getCustomFieldItemProps(item) {
      const props = {}
      const { isRequired, fieldDataType } = item
      if (fieldDataType === 'Boolean' && !this.editData) {
        props['defaultValue'] = 'indeterminate'
      }
      if (isRequired) {
        props['persistentHint'] = true
        props['hint'] = '*Required'
      }
      props['rules'] = this.getCustomFieldRules(item)

      return props
    },
    getDatePickerProps(item) {
      const props = {}
      const { fieldDataType, name } = item
      props['type'] = fieldDataType.toLowerCase()
      props['placeholder'] = `Enter ${name}`
      props['value-format'] =
        fieldDataType.toLowerCase() === 'datetime' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
      props['format'] =
        fieldDataType.toLowerCase() === 'datetime' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
      return props
    },
    getCustomFieldRules(item = {}) {
      const rules = []
      if (item.fieldDataType !== 'Boolean') {
        item.isRequired && rules.push((v) => this.validations.required(v, 'Required'))
        rules.push((v) =>
          this.validations.maxLength(v, 256, labels.getMaxLengthMessage(item.name, 256))
        )
      } else {
        if (item.isRequired) {
          rules.push(() => {
            return this.customFieldsModels[item.resourceId] !== 'indeterminate' || 'Required'
          })
        }
      }
      item.fieldDataType === 'Email' &&
        rules.push((v) => this.validations.mail(v, 'Invalid email address'))
      return rules
    },
    callForCreateTargetUser() {
      const { activeUserCount, licenseLimit, isLimited } = this.companyLicense
      if (
        isLimited &&
        (this.companyLicense['isLicenseExceeded'] || activeUserCount === licenseLimit)
      ) {
        this.toggleShowLicenseExceededDialog()
      }
      const payload = this.getCustomFieldsPayload()
      this.saveDisable = true
      createTargetUser(payload)
        .then(() => {
          this.$emit('closeAddUserModalWithUpdate')
        })
        .finally(() => (this.saveDisable = false))
    },
    getCustomFieldsPayload() {
      const keys = Object.keys(this.customFieldsModels)
      return {
        ...this.formValues,
        customFields: keys.reduce((acc, key) => {
          const item = this.customFields.find((item) => item.resourceId === key)
          let value = this.customFieldsModels[key]
          let timestampValue = ''
          if (item.fieldDataType === 'Boolean') {
            value = this.setStringBoolean(value)
          } else if (['Date', 'DateTime'].includes(item.fieldDataType)) {
            timestampValue = value
          }
          if (!(value === null || value === undefined || value === '')) {
            acc.push({ resourceId: key, value, timestampValue })
          }

          return acc
        }, [])
      }
    },
    setStringBoolean(value) {
      if (value === true) {
        value = 'True'
      } else if (value === false) {
        value = 'False'
      } else if (value === 'indeterminate') {
        value = 'False'
      } else {
        value = !!value
      }
      return value
    },
    getBooleanValue(value) {
      if (value === 'True') {
        value = true
      } else if (value === 'False') {
        value = false
      } else if (!value) {
        value = 'indeterminate'
      } else {
        value = !!value
      }
      return value
    },
    callForUpdateTargetUser() {
      this.saveDisable = true
      const payload = this.getCustomFieldsPayload()
      delete payload.status
      updateTargetUser(payload)
        .then(() => {
          this.$emit('closeAddUserModalWithUpdate')
        })
        .finally(() => (this.saveDisable = false))
    },
    callForTargetGroups() {
      getTargetGroups().then(() => {
        //const { data } = response.data
      })
    }
  },
  created() {
    for (let field of this.customFields) {
      const { fieldDataType, resourceId } = field
      if (fieldDataType === 'Date' || fieldDataType === 'DateTime') {
        this.$set(this.isPickersValidated, resourceId, false)
      }
    }
    if (this.editData) {
      const editedData = { ...this.editData }
      const customFieldProp = 'customFieldValues'
      const customFields = editedData[customFieldProp]
      for (let { resourceId, value, name, dataType, timestampValue } of customFields) {
        if (dataType === 'Boolean') {
          value = this.getBooleanValue(value)
        } else if (['Date', 'DateTime'].includes(dataType)) {
          value = timestampValue
        }
        this.$set(this.customFieldsModels, resourceId, value)
        delete editedData[name]
      }
      delete editedData[customFieldProp]
      this.formValues = {
        ...editedData,
        isActive: editedData.status === 'Active'
      }
    }
  }
}
</script>

<style lang="scss">
.add-user-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
  }

  &__picker {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;
    }
    &--error {
      .el-input__inner {
        border: 1px solid #ff5252 !important;
      }
    }
  }
  &__list-item {
    padding: 0 !important;
    margin-top: 1px;
    .v-list-item__content {
      padding: 0;
      max-width: 554px;
      overflow: visible;
    }
  }

  &__container {
    padding: 32px 96px 0 96px;
    box-shadow: none;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 9;

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 86px;
      height: 36px !important;
    }

    &-btn-save {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      background-color: #2196f3;
    }
  }

  &__main-title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__main-sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    margin-bottom: 8px !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .v-input--switch {
    margin-top: 0;
    label {
      font-size: 16px;
      font-weight: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      margin-left: 8px;
    }
    .v-messages {
      display: none;
    }
  }
}
</style>
