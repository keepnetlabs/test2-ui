<template>
  <Fragment>
    <CreateNewUserGroupModal
      v-if="isTargetGroupModalVisible"
      :status="isTargetGroupModalVisible"
      :is-create-button-disabled="isCreateTargetGroupButtonDisabled"
      @changeNewUserGroupStatus="handleCloseTargetGroupModal"
      @handleSave="handleConfirmTargetGroupModal"
    />
    <app-modal
      :status="status"
      :icon-name="getIcon"
      :title="getTitle"
      className="add-user-overlay"
      :saveDisable="saveDisable"
      title-id="text--target-users-people-create-user-modal-title"
      subtitle-id="text--target-users-people-create-user-modal-subtitle"
      @closeOverlay="status = false"
    >
      <template #overlay-body>
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
            <InputEntityName
              v-model.trim="formValues.firstName"
              entityName="first name"
              initialPlaceholder="Enter first name"
              id="input--target-user-first-name"
            />
          </form-group>
          <form-group :title="labels.LastName" has-hint>
            <InputEntityName
              v-model.trim="formValues.lastName"
              entityName="last name"
              initialPlaceholder="Enter last name"
              id="input--target-user-last-name"
            />
          </form-group>
          <form-group has-hint title="Email">
            <InputEmail v-model.trim="formValues.email" id="input--target-user-email" />
          </form-group>
          <form-group title="Phone Number">
            <InputPhone
              v-model.trim="formValues.phoneNumber"
              ref="refPhone"
              id="input--target-user-phone-number"
              :required="false"
            />
          </form-group>
          <form-group title="Department">
            <InputDepartment
              v-model.trim="formValues.department"
              id="input--target-user-department"
            />
          </form-group>
          <FormGroup title="Preferred Language">
            <k-select
              v-model="formValues.preferredLanguageId"
              :items="languageItems"
              :return-object="false"
              clearable
              class="tlp-select"
              id="input--company-preferred-language"
              outlined
              placeholder="Select an option"
            >
            </k-select>
          </FormGroup>
          <FormGroup
            class="mb-6"
            title="Time Zone"
            subTitle="By selecting the appropriate time zone, you can send campaigns to the target user in their own time zone."
          >
            <InputTimezone v-model="formValues.timeZoneId" class="black-placeholder" isBlock />
          </FormGroup>
          <FormGroup
            v-if="!editData"
            title="Target Group"
            sub-title="Select a target group to add users to"
          >
            <k-select
              v-infinite-scroll="{
                target: '#input--target-group-groups .k-select__menu',
                callback: callForTargetGroups
              }"
              ref="refTargetGroupSelect"
              v-select-search-handler="{
                callback: searchTargetGroups,
                isLoadingKey: 'isTargetGroupsLoading'
              }"
              type="autocomplete"
              v-model="formValues.targetGroupResourceIds"
              id="input--target-group-groups"
              chips
              clearable
              item-text="name"
              item-value="resourceId"
              multiple
              small-chips
              deletable-chips
              outlined
              :no-data-text="noTargetGroupText"
              placeholder="Select a target group"
              :items="targetGroupList"
              :slots="{ prependItem: true }"
            >
              <template #prependItem>
                <v-list-item ripple @mousedown.prevent @click="handleCreateGroup">
                  <v-list-item-action>
                    <v-icon color="#757575">
                      mdi-plus
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span style="font-weight: 600;">Create new group</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </k-select>
          </FormGroup>
          <form-group
            v-for="(item, index) in customFields"
            :title="item.name"
            :has-hint="item.isRequired"
            :key="index"
          >
            <v-text-field
              v-if="
                item.fieldDataType === 'String' ||
                item.fieldDataType === 'Number' ||
                item.fieldDataType === 'Email'
              "
              v-bind="getCustomFieldItemProps(item)"
              v-mask="item.fieldDataType === 'Number' ? '##########' : ''"
              v-model.trim="customFieldsModels[item.resourceId]"
              :id="`input--target-user-custom-field-${item.name}`"
              outlined
              dense
              :placeholder="`Enter ${item.name}`"
              height="40"
              :key="item.name"
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
                v-if="item.fieldDataType === 'DateTime'"
                v-model.trim="customFieldsModels[item.resourceId]"
                :id="`input--target-user-custom-field-${item.name}`"
                popper-class="filter__date-picker"
                :key="item.name"
                v-bind="getDatePickerProps(item)"
                :format="getTimeZone() || 'yyyy/MM/dd HH:mm'"
                :valueFormat="getTimeZone() || `yyyy/MM/dd HH:mm`"
                :type="'datetime'"
              />
              <InputDate
                v-if="item.fieldDataType === 'Date'"
                v-model.trim="customFieldsModels[item.resourceId]"
                :id="`input--target-user-custom-field-${item.name}`"
                popper-class="filter__date-picker"
                :key="item.name"
                v-bind="getDatePickerProps(item)"
                :format="getTimeZone(true) || 'yyyy/MM/dd'"
                :valueFormat="getTimeValueFormatZone(true) || `yyyy/MM/dd`"
                :type="'date'"
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
          :id="getSubmitButtonId"
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
  </Fragment>
</template>

<script>
import { mail, maxLength, required } from '@/utils/validations'
import {
  createTargetUser,
  searchTargetGroups,
  updateTargetUser,
  createTargetGroup
} from '@/api/targetUsers'
import AppModal from '../AppModal'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDepartment from '@/components/Common/Inputs/InputDepartment'
import KSelect from '@/components/Common/Inputs/KSelect'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import labels from '@/model/constants/labels'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox'
import {
  getTimeZone,
  getTimeValueFormatZone,
  isDifferent,
  scrollToComponent,
  getDefaultAxiosPayload,
  getSelectSearchPayload
} from '@/utils/functions'
import InputPhone from '@/components/Common/Inputs/InputPhone'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import { Fragment } from 'vue-frag'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import countryDefaultValues from '@/utils/countryDefaultValues'
import { mapGetters } from 'vuex'
import useCachableDialog from '@/mixins/useCachableDialog'
export default {
  name: 'AddUserModal',
  components: {
    CreateNewUserGroupModal,
    KCheckbox,
    AppDialogFooter,
    InputEmail,
    FormGroup,
    AppModalBodyHeader,
    AppModal,
    KSelect,
    InputEntityName,
    InputDate,
    InputPhone,
    InputDepartment,
    TargetUsersCheckLicenseDialog,
    InputTimezone,
    Fragment
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
    },
    languageItems: {
      type: Array
    }
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  mixins: [useCachableDialog],
  data() {
    return {
      isTargetGroupModalVisible: false,
      isCreateTargetGroupButtonDisabled: false,
      targetGroupPayload: getDefaultAxiosPayload({ pageSize: 100 }),
      totalNumberOfPagesOfTargetGroups: 1,
      isTargetGroupsLoading: false,
      targetGroups: [],
      targetGroupList: [],
      saveDisable: false,
      labels,
      initialFormValues: null,
      formValues: {
        targetGroupResourceIds: [],
        preferredLanguageId: this.getCurrentCompany?.preferredLanguageTypeResourceId || '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        priority: 'Medium',
        isActive: true,
        timeZoneId: null
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
    ...mapGetters({
      getCountryName: 'whitelabel/getCountryName',
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense['licenseLimit']} target users. Current target user count is ${this.companyLicense['totalUserCount']}. Do you want to save this user?`
        : ''
    },
    noTargetGroupText() {
      return this.isTargetGroupsLoading ? 'Loading...' : 'No target group available'
    },
    getTitle() {
      return this.editData ? 'Edit User' : 'Add New User'
    },
    getIcon() {
      return this.editData ? 'mdi-account-edit' : 'mdi-account-plus'
    },
    getSubmitButtonId() {
      return this.editData
        ? 'btn-edit--target-users-add-user-to-people-modal'
        : 'btn-save--target-users-add-user-to-people-modal'
    },
    getTimeZoneList() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
    }
  },
  watch: {
    getCountryName: {
      immediate: true,
      handler(val) {
        if (!!this.editData || !val) return
        const countryDefaultValuesIndex = countryDefaultValues.findIndex(
          (country) => country.name === val
        )
        if (countryDefaultValuesIndex !== -1) {
          this.formValues.phoneNumber =
            countryDefaultValues[countryDefaultValuesIndex].phoneNumberCode
          this.formValues.timeZoneId = countryDefaultValues[countryDefaultValuesIndex].timezone
        }
      }
    }
  },
  created() {
    if (!this.editData) {
      this.callForTargetGroups()
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    for (let field of this.customFields) {
      const { fieldDataType, resourceId } = field
      if (fieldDataType === 'Date' || fieldDataType === 'DateTime') {
        this.$set(this.isPickersValidated, resourceId, false)
      }
    }
    this.callForGetTimeZones()
    this.setEditData()
  },
  mounted() {
    if (!this.editData)
      this.formValues.preferredLanguageId =
        this.getCurrentCompany?.preferredLanguageTypeResourceId || ''
  },
  methods: {
    handleCreateGroup() {
      this.isTargetGroupModalVisible = true
      if (this.$refs?.refTargetGroupSelect?.$refs?.refComponent)
        this.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive = false
    },
    handleCloseTargetGroupModal() {
      this.isTargetGroupModalVisible = false
    },
    handleConfirmTargetGroupModal(group) {
      this.isCreateTargetGroupButtonDisabled = true
      createTargetGroup(group)
        .then((response) => {
          this.isTargetGroupModalVisible = false
          this.targetGroupList.unshift({
            name: group.name,
            resourceId: response.data.data.resourceId
          })
          this.formValues.targetGroupResourceIds.push(response.data.data.resourceId)
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false))
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    callForTargetGroups(addPage) {
      if (addPage) {
        this.targetGroupPayload.pageNumber += 1
        if (this.targetGroupPayload.pageNumber > this.totalNumberOfPagesOfTargetGroups) return
      }
      this.isTargetGroupsLoading = true
      searchTargetGroups(this.targetGroupPayload)
        .then(this.setTargetGroups)
        .then((data) => {
          this.totalNumberOfPagesOfTargetGroups = data?.data?.totalNumberOfPages || 1
        })
        .finally(() => {
          this.isTargetGroupsLoading = false
        })
    },
    setTargetGroups(response) {
      const { data: { data = [] } = [] } = response
      this.targetGroups = [...this.targetGroups, ...data.results]
      this.targetGroupList = this.targetGroups.map((tg) => ({
        name: tg.name,
        resourceId: tg.resourceId
      }))
    },
    searchTargetGroups(search = '') {
      if (search) {
        searchTargetGroups(getSelectSearchPayload(this.targetGroupPayload, search))
          .then(this.setTargetGroups)
          .finally(() => {
            this.isTargetGroupsLoading = false
          })
      } else {
        this.callForTargetGroups()
      }
    },
    getTimeZone(isDate) {
      return getTimeZone(isDate)
    },
    getTimeValueFormatZone(isDate) {
      return getTimeValueFormatZone(isDate)
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeAddUserModal')
      } else {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeAddUserModal')
          }
        })
      }
    },
    validatePicker(item = {}) {
      return (
        (item.fieldDataType === 'DateTime' || item.fieldDataType === 'Date') &&
        !this.customFieldsModels[item.resourceId] &&
        this.isPickersValidated[item.resourceId]
      )
    },
    validateAllPickers() {
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
      return isPickersValid
    },
    submit() {
      let isPickersValid = this.validateAllPickers()
      this.$forceUpdate()
      this.$refs.refPhone.validatePhoneNumber()
      const isNumberValid = this.$refs.refPhone.isPhoneNumberValid
      if (!this.$refs.refForm.validate() || !isPickersValid || !isNumberValid) {
        return this.$nextTick(() => {
          const el = this.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      } else if (this.editData) {
        this.callForUpdateTargetUser()
      } else {
        if (!this.companyLicense) return
        const { activeUserCount, licenseLimit, isLimited } = this.companyLicense
        if (
          isLimited &&
          (this.companyLicense['isLicenseExceeded'] || activeUserCount === licenseLimit)
        ) {
          const companyId = this.getCurrentCompany?.resourceId
          const storageKey = `licenseExceededDialog_${companyId}`
          if (!this.canShowCachableDialog(storageKey)) {
            this.callForCreateTargetUser()
          } else {
            this.showLicenseExceededDialog = true
            this.saveCachableDialogTimestamp(storageKey)
          }
        } else {
          this.callForCreateTargetUser()
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
      } else if (item.isRequired) {
        rules.push(() => {
          return this.customFieldsModels[item.resourceId] !== 'indeterminate' || 'Required'
        })
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
      payload.phoneNumber = payload?.phoneNumber?.split(' ')?.join('') || ''
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
      payload.phoneNumber = payload?.phoneNumber?.split(' ')?.join('') || ''
      updateTargetUser(payload)
        .then(() => {
          this.$emit('closeAddUserModalWithUpdate')
        })
        .finally(() => (this.saveDisable = false))
    },
    setEditData() {
      if (this.editData) {
        let preferredLanguage = ''
        if (this.languageItems) {
          preferredLanguage = this.languageItems.find(
            (language) => language.text === this.editData.preferredLanguage
          )
        }
        const editedData = { ...this.editData }
        const customFieldProp = 'customFieldValues'
        const customFields = editedData[customFieldProp]
        for (let { resourceId, value, name, dataType, timestampValue } of customFields) {
          let newVal = value
          if (dataType === 'Boolean') {
            newVal = this.getBooleanValue(value)
          } else if (['Date', 'DateTime'].includes(dataType)) {
            newVal = timestampValue
          }
          this.$set(this.customFieldsModels, resourceId, newVal)
          delete editedData[name]
        }
        delete editedData[customFieldProp]
        this.formValues = {
          ...editedData,
          timeZoneId:
            this.getTimeZoneList.find((tz) => tz.text === editedData.timeZone)?.value || null,
          isActive: editedData.status === 'Active',
          preferredLanguageId: preferredLanguage?.value
        }
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      }
    }
  }
}
</script>
