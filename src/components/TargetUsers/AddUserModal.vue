<template>
  <app-modal
    :status="status"
    @closeOverlay="status = false"
    :icon-name="getIcon"
    :title="getTitle"
    className="add-user-overlay"
  >
    <template v-slot:overlay-body>
      <v-form ref="refForm">
        <app-modal-body-header
          :title="editData ? 'Edit  User Manually' : 'Add New User Manually'"
          sub-title="Define user properties"
        />
        <form-group title="First Name" has-hint>
          <InputFirstName v-model.trim="formValues.firstName" id="firstName" />
        </form-group>
        <form-group title="Last Name" has-hint>
          <InputLastName v-model.trim="formValues.lastName" id="lastName" />
        </form-group>
        <form-group has-hint title="Email">
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            v-model.trim="formValues.email"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.mail(v, 'Invalid email address')
            ]"
            id="email"
          />
        </form-group>
        <form-group title="Department">
          <InputDepartment v-model.trim="formValues.department" />
        </form-group>
        <form-group
          :title="item.name"
          :has-hint="item.isRequired"
          :key="index"
          v-for="(item, index) in customFields"
        >
          <v-text-field
            outlined
            dense
            v-model.trim="customFieldsModels[item.resourceId]"
            :placeholder="`Enter ${item.name}`"
            height="40"
            v-bind="getCustomFieldItemProps(item)"
            v-mask="item.fieldDataType === 'Number' ? '##########' : ''"
            v-if="item.fieldDataType === 'String' || item.fieldDataType === 'Number'"
          ></v-text-field>
          <div
            v-else-if="item.fieldDataType === 'DateTime' || item.fieldDataType === 'Date'"
            class="mb-5"
            :class="[
              'mb-5',
              item.isRequired && validatePicker(item) && 'add-user-overlay__picker--error',
              'add-user-overlay__picker'
            ]"
          >
            <el-date-picker
              v-model.trim="customFieldsModels[item.resourceId]"
              :placeholder="`Enter ${item.name}`"
              popper-class="filter__date-picker"
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

          <v-checkbox
            v-model.trim="customFieldsModels[item.resourceId]"
            :label="item.name"
            color="#2196f3"
            v-bind="getCustomFieldItemProps(item)"
            v-if="item.fieldDataType === 'Boolean'"
          />
        </form-group>
        <form-group title="Priority">
          <k-select
            :items="priorityItems"
            outlined
            dense
            v-model.trim="formValues.priority"
            id="department"
          />
        </form-group>
        <form-group title="Active">
          <v-switch
            id="isActive"
            v-model="formValues.isActive"
            color="#2196f3"
            :label="formValues.isActive ? 'Yes' : 'No'"
          />
        </form-group>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="add-user-overlay__footer-btn-cancel" rounded @click="closeOverlay">
        CANCEL
      </v-btn>
      <v-btn
        class="add-user-overlay__footer-btn-save white--text"
        color="#2196f3"
        rounded
        @click="submit"
      >
        SAVE
      </v-btn>
    </template>
  </app-modal>
</template>

<script>
import { required, mail, maxLength } from '@/utils/validations'
import { createTargetUser, getTargetGroups, updateTargetUser } from '@/api/targetUsers'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import { scrollToComponent } from '@/utils/functions'
import InputDepartment from '@/components/Common/Inputs/InputDepartment'
import InputLastName from '@/components/Common/Inputs/InputLastName'
import InputFirstName from '@/components/Common/Inputs/InputFirstName'
import KSelect from '@/components/Common/Inputs/KSelect'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'AddUserModal',
  components: {
    FormGroup,
    AppModalBodyHeader,
    InputDepartment,
    AppModal,
    KSelect,
    InputFirstName,
    InputLastName
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
    }
  },
  computed: {
    getTitle() {
      return this.editData ? 'Edit User' : 'Add New User'
    },
    getIcon() {
      return this.editData ? 'mdi-account-edit' : 'mdi-account-plus'
    }
  },
  data() {
    return {
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
  methods: {
    closeOverlay() {
      this.$emit('closeAddUserModal')
    },
    validatePicker(item = {}) {
      return (
        (item.fieldDataType === 'DateTime' || item.fieldDataType === 'Date') &&
        !this.customFieldsModels[item.name] &&
        this.isPickersValidated[item.name]
      )
    },
    submit() {
      const keys = Object.keys(this.isPickersValidated)
      for (let key of keys) {
        if (!this.customFieldsModels[key]) {
          this.$set(this.isPickersValidated, key, true)
        }
      }
      this.$forceUpdate()
      if (!this.$refs.refForm.validate()) {
        return this.$nextTick(() => {
          const el = this.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      if (this.editData) {
        this.callForUpdateTargetUser()
      } else {
        this.callForCreateTargetUser()
      }
    },
    getCustomFieldItemProps(item) {
      const props = {}
      const { isRequired } = item
      if (isRequired) {
        props['persistentHint'] = true
        props['hint'] = '*Required'
        props['rules'] = this.getCustomFieldRules(item)
      }

      return props
    },
    getCustomFieldRules(item = {}) {
      const rules = []
      rules.push((v) => this.validations.required(v, 'Required'))
      item.fieldDataType === 'Email' &&
        rules.push((v) => this.validations.email(v, 'Invalid email address'))
      return rules
    },
    callForCreateTargetUser() {
      const payload = this.getCustomFieldsPayload()

      createTargetUser(payload)
        .then(({ data }) => {
          if (data.status === 'FAILED') {
            this.$store.dispatch('common/createSnackBar', {
              message: data.message,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
            })
          } else {
            this.$store.dispatch('common/createSnackBar', {
              message: '1 user added to Users List ',
              icon: 'mdi-check-circle',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
            })
            this.$emit('closeAddUserModalWithUpdate')
          }
        })
        .catch((error) => {
          debugger
        })
    },
    getCustomFieldsPayload() {
      const keys = Object.keys(this.customFieldsModels)
      return {
        ...this.formValues,
        customFields: keys.reduce((acc, key) => {
          acc.push({ resourceId: key, value: this.customFieldsModels[key] })
          return acc
        }, [])
      }
    },
    callForUpdateTargetUser() {
      const payload = this.getCustomFieldsPayload()
      delete payload.status
      updateTargetUser(payload).then((response) => {
        if (response.data && response.data.message) {
          this.$store.dispatch('common/createSnackBar', {
            message: response.data.message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
        }
        this.$emit('closeAddUserModalWithUpdate')
      })
    },
    callForTargetGroups() {
      getTargetGroups().then((response) => {
        const { data } = response.data
      })
    }
  },
  created() {
    for (let field of this.customFields) {
      const { fieldDataType, name } = field
      if (fieldDataType === 'Date' || fieldDataType === 'DateTime') {
        this.$set(this.isPickersValidated, name, false)
      }
    }
    if (this.editData) {
      const editedData = { ...this.editData }
      const customFieldProp = 'customFieldValues'
      const customFields = editedData[customFieldProp]
      for (let { resourceId, value, name } of customFields) {
        this.$set(this.customFieldsModels, resourceId, value)
        delete editedData[name]
      }
      delete customFields[customFieldProp]
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
