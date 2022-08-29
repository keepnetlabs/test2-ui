<template>
  <app-modal
    :status="status"
    iconName="mdi-magnify"
    :title="`Start New Manual Investigation`"
    title-id="text--incident-responder-new-investigation-modal-title"
  >
    <template v-slot:overlay-body>
      <div class="new-investigation-wrapper">
        <v-card flat light style="max-width: 554px;">
          <app-modal-body-header
            title="Start New Investigation"
            sub-title="Select filters and date options to start an investigation"
          />
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-list-item class="edit-name-area 0 pa-0 investigation-name">
              <FormGroup id="label--investigation-name" :title="labels.InvestigationName" has-hint>
                <InputEntityName
                  v-model.trim="investigationName"
                  id="input--investigation-name"
                  initial-placeholder="Enter an investigation name"
                />
              </FormGroup>
            </v-list-item>
            <v-list-item class="edit-industry-area pt-2 pb-4 pa-0 target-users-select">
              <v-list-item-content class>
                <label id="label--investigation-target-users" class="edit-labels">{{
                  labels.TargetUsers
                }}</label>
                <label id="label--investigation-target-users-sub" class="edit-sub-labels">{{
                  labels.InvestigateSubLabel
                }}</label>
                <div class="target-users-select__radio-group">
                  <v-radio-group
                    v-model="targetUserType"
                    id="input--investigation-target-user-type"
                    :mandatory="false"
                    @change="handleTargetUserTypeChange"
                    row
                  >
                    <v-radio
                      id="input--investigation-target-user-type-all-users"
                      value="AllUsers"
                      label="All Users"
                      color="#2196f3"
                    ></v-radio>
                    <v-radio
                      id="input--investigation-target-user-type-user-groups"
                      value="Groups"
                      label="User Groups"
                      color="#2196f3"
                    ></v-radio>
                    <v-radio
                      id="input--investigation-target-user-type-specific-users"
                      value="SpecificUsers"
                      label="Specific Users"
                      color="#2196f3"
                    ></v-radio>
                  </v-radio-group>
                </div>
                <div class="target-users-select__input-area">
                  <v-text-field
                    v-if="targetUserType === 'AllUsers'"
                    id="input--investigation-target-user-all-users"
                    placeholder="All Users"
                    outlined
                    dense
                    disabled
                  />
                  <k-select
                    v-if="targetUserType === 'Groups'"
                    key="groups"
                    v-infinite-scroll="{
                      target: '#input--investigation-target-user-groups .k-select__menu',
                      callback: callForTargetGroups
                    }"
                    v-select-search-handler="{
                      callback: callForSearchTargetGroups,
                      isLoadingKey: 'isUserGroupsLoading'
                    }"
                    type="autocomplete"
                    id="input--investigation-target-user-groups"
                    custom-menu-class="menu--investigation-target-user-groups"
                    :items="userGroupsItems"
                    :placeholder="
                      targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
                    "
                    outlined
                    class="edit-select new-investigation__combo target-users-select-multi select-specific-users"
                    v-model.trim="targetUsersValue"
                    :rules="[targetUsers.required]"
                    item-text="name"
                    multiple
                    dense
                    persistent-hint
                    auto-select-first
                    small-chips
                    deletable-chips
                    :return-object="true"
                    prepend-inner-icon="mdi-magnify"
                    autocomplete="disabled"
                    :no-data-text="isUserGroupsLoading ? 'Loading...' : 'No user group available'"
                  />
                  <k-select
                    v-if="targetUserType === 'SpecificUsers'"
                    key="users"
                    v-infinite-scroll="{
                      target: '#input--investigation-target-user-specific-users .k-select__menu',
                      callback: callForTargetUsers
                    }"
                    v-select-search-handler="{
                      callback: callForSearchTargetUsers,
                      isLoadingKey: 'isTargetUsersLoading'
                    }"
                    v-model.trim="targetUsersValue"
                    type="autocomplete"
                    id="input--investigation-target-user-specific-users"
                    custom-menu-class="menu--investigation-target-user-specific-users"
                    :items="specificUserItems"
                    placeholder="Select target users"
                    item-text="email"
                    item-value="email"
                    multiple
                    dense
                    persistent-hint
                    auto-select-first
                    deletable-chips
                    autocomplete="disabled"
                    small-chips
                    :return-object="false"
                    :rules="[targetUsers.required]"
                    :no-data-text="
                      isTargetUsersLoading ? 'Loading...' : 'No specific user available'
                    "
                    outlined
                    class="edit-select new-investigation__combo target-users-select-multi select-specific-users"
                    prepend-inner-icon="mdi-magnify"
                  />
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area pb-4 pa-0">
              <v-list-item-content class="filter-container">
                <label id="label--investigation-search-criteria" class="edit-labels">{{
                  labels.Filters
                }}</label>
                <label id="label--investigation-search-criteria-sub" class="edit-sub-labels"
                  >Define filters for the investigation</label
                >
                <div
                  class="filter-item"
                  v-for="(list, index) in filterList"
                  :key="`${list.renderKey}-${index}`"
                >
                  <div class="filter-item__selectbox">
                    <Treeselect
                      disable-branch-nodes
                      open-direction="below"
                      v-model="list.option"
                      :key="`${list.renderKey}-${index}`"
                      :id="`input--investigation-search-criteria-${list.option}-${index}`"
                      :class="[
                        'filter-list-select',
                        'k-treeselect',
                        { 'k-treeselect--error': isSubmitted && !list.option }
                      ]"
                      :clearable="false"
                      :options="filterListOption"
                      :max-height="320"
                    />
                    <div
                      v-if="isSubmitted && !list.option"
                      class="v-text-field__details checkbox-error"
                      style="left: 2px !important; bottom: -17px !important;"
                    >
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
                  </div>
                  <div
                    :class="{
                      'filter-item__input': list.option !== 'size',
                      'filter-item__file-size-option-input': list.option === 'size'
                    }"
                  >
                    <v-text-field
                      v-model.trim="list.text"
                      :key="`${list.renderKey}-${index}`"
                      :id="`input--investigation-search-criteria-value-${list.option}-${index}`"
                      :placeholder="
                        placeholders[list.option]
                          ? placeholders[list.option]
                          : 'Select filter for investigation'
                      "
                      outlined
                      :class="[
                        'edit-name-textfield edit-select standard-height',
                        { 'edit-name-textfield__flagged': list.isFlagged }
                      ]"
                      :rules="getSearchCriteriaItemRules(list.option)"
                      :label="list.isFlagged ? list.label : ''"
                      :error-messages="errorMessages[index]"
                      @input="handleInputSingularityChange(list, index)"
                    ></v-text-field>
                  </div>
                  <div class="filter-item__delete-button">
                    <v-icon
                      :id="`btn-close--investigation-search-criteria-${list.option}-${index}`"
                      medium
                      left
                      class="ml-2"
                      v-if="filterList.length > 1"
                      @click="handleDeleteListItem(index)"
                      >mdi-close</v-icon
                    >
                  </div>
                </div>
                <button
                  id="btn-add--investigation-search-criteria"
                  class="filter-item__button"
                  type="button"
                  @click="addNewFilterListOption()"
                >
                  <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>ADD FILTER
                </button>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area pb-4 pa-0">
              <v-list-item-content class>
                <label id="label--investigation-email-date-range" class="edit-labels"
                  >Email Date Range</label
                >
                <label id="label--investigation-email-date-range-sub" class="edit-sub-labels"
                  >Select range of emails’ sending date</label
                >
                <div class="date-row" :class="[!isDateValid && 'date-picker-container']">
                  <InputDate
                    v-model="date"
                    id="input--investigation-email-date-range"
                    type="datetimerange"
                    ref="refPicker"
                    :picker-options="pickerOptions"
                    :rules="[]"
                    :defaultTime="['00:00:00', '23:59:00']"
                    :prefix-icon="'el-icon-date'"
                  />
                  <div class="v-text-field__details checkbox-error" v-if="!isDateValid">
                    <transition appear name="bounce">
                      <div class="v-messages theme--light error--text" role="alert">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message" style="padding-left: 10px;">
                            Date is required
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="mt-2 pb-0 pa-0">
              <v-list-item-content class>
                <label id="label--investigation-select-sources" class="edit-labels"
                  >Select Sources</label
                >
                <label id="label--investigation-select-sources-sub" class="edit-sub-labels"
                  >Select mail configurations to conduct this investigation in</label
                >
                <MailConfigurationSelectSources v-model="scanTypes" />
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area mt-2 pb-4 pa-0">
              <v-list-item-content class>
                <label id="label--investigation-duration" class="edit-labels">Duration</label>
                <label id="label--investigation-duration-sub" class="edit-sub-labels"
                  >Select how many days the investigation will run</label
                >
                <k-select
                  id="input--investigation-duration"
                  custom-menu-class="menu--investigation-duration"
                  :items="durations"
                  outlined
                  class="input-select standard-height"
                  v-model.trim="duration"
                  :rules="[(v) => !!v || 'Duration is required']"
                  item-text="durationLabel"
                  item-value="durationValue"
                  placeholder="3 Days"
                ></k-select>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area mt-2 pa-0">
              <v-list-item-content class>
                <label id="label--investigation-action" class="edit-labels">Action</label>
                <label id="label--investigation-action-sub" class="edit-sub-labels"
                  >Select action to be executed if email is found</label
                >
                <k-select
                  id="input--investigation-action"
                  :items="actions"
                  custom-menu-class="menu--investigation-action"
                  outlined
                  class="input-select standard-height"
                  v-model.trim="selectedAction"
                  :rules="[(v) => !!v || 'Action is required']"
                  item-text="actionLabel"
                  item-value="actionValue"
                  position="top"
                  placeholder="Select an action"
                  @change="actionChanged"
                ></k-select>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              class="edit-industry-area mt-2 pa-0"
              v-if="selectedAction === 'DeleteAndNotify' || selectedAction === 'Warning'"
            >
              <v-list-item-content class>
                <label id="label--investigation-message" class="edit-labels">Message</label>
                <v-text-field
                  v-if="selectedAction === 'DeleteAndNotify' || selectedAction === 'Warning'"
                  id="input--investigation-message"
                  placeholder="Enter a message"
                  outlined
                  class="edit-name-textfield edit-select standard-height warning-message"
                  v-model.trim="warningMessage"
                  :rules="[messageRules.required, messageRules.empty, messageRules.maxLength]"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-form>
        </v-card>
      </div>
    </template>
    <template v-slot:overlay-footer>
      <div class="new-investigation-footer">
        <v-btn
          class="k-overlay__btn-cancel"
          id="btn-cancel--investigation-modal"
          rounded
          @click="onCancelClicked"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          :disabled="saveDisable"
          id="btn-save--investigation-modal"
          class="k-overlay__btn-save white--text"
          style="width: auto;"
          rounded
          color="#2196f3"
          @click="onCreateClicked"
          >{{ labels.StartInvestigation }}</v-btn
        >
      </div>
    </template>
  </app-modal>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import AppModal from '../AppModal'
import { getTargetUsers, searchTargetGroups } from '../../api/targetUsers'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import {
  getDefaultAxiosPayload,
  getSelectSearchPayload,
  getTimeZoneForMoment,
  scrollToComponent,
  isDifferent,
  convertTo12Hr
} from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import InputDate from '@/components/Common/Inputs/InputDate'
import * as Validations from '@/utils/validations'
import MailConfigurationSelectSources from '@/components/Common/Others/MailConfigurationSelectSources'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  components: {
    FormGroup,
    InputEntityName,
    MailConfigurationSelectSources,
    KSelect,
    AppModalBodyHeader,
    AppModal,
    InputDate,
    Treeselect
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  watch: {
    date(val) {
      if (val && val.length > 0) {
        this.isDateValid = true
      } else {
        this.isDateValid = false
      }
    },
    targetUsersValue(newVal, oldVal) {
      if (newVal[0] === '') {
        newVal.splice(0, 1)
      }
    },
    filterList() {
      this.checkAllSingularity()
    }
  },

  data() {
    return {
      storageTimeFormat: localStorage.getItem('selectedTimeFormat'),
      initialFormValues: null,
      warningMessage: null,
      saveDisable: false,
      isSubmitted: false,
      targetGroupsAxiosPayload: getDefaultAxiosPayload(),
      targetUsersAxiosPayload: getDefaultAxiosPayload(),
      totalNumberOfPagesOfTargetGroups: 1,
      totalNumberOfPagesOfTargetUsers: 1,
      labels,
      timeout: null,
      specificUserItems: [],
      errorMessages: [],
      isUserGroupsLoading: false,
      isTargetUsersLoading: false,
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refPicker
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
        },
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      placeholders: {
        ip: 'Enter an ip address ',
        from: 'Enter an email address',
        to: 'Enter an email address',
        cc: 'Enter an email address',
        bcc: 'Enter an email address',
        subject: 'Enter a subject',
        senderName: 'Enter a from name',
        url: 'Enter a domain name',
        keyword: 'Enter a keyword',
        size: 'Enter file size(byte)',
        name: 'Enter a file name(case sensitive)',
        sha512: 'Enter a sha512 key',
        md5: 'Enter a md5 key',
        extension: 'Enter an file extension',
        regex: 'Enter a regular expression'
      },
      scanTypes: [],
      checkboxError: false,
      investigationName: `Manual Investigation - ${this.$moment(Date.now()).format(
        getTimeZoneForMoment()
      )}`,
      isDateValid: true,
      targetUserType: 'AllUsers',
      targetUsersValue: '',
      date: [],
      startDate: '',
      endDate: '',
      duration: 1,
      selectedAction: 'NoAction',
      name: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      isAllSelected: false,
      userGroupsItems: [],
      durations: [
        { durationLabel: '1 Day', durationValue: 1 },
        { durationLabel: '3 Days', durationValue: 3 },
        { durationLabel: '7 Days', durationValue: 7 }
      ],
      actions: [
        { actionLabel: 'No action', actionValue: 'NoAction' },
        { actionLabel: 'Notify user only', actionValue: 'Warning' },
        { actionLabel: 'Move to trash', actionValue: 'MoveToTrash' },
        { actionLabel: 'Delete email', actionValue: 'Delete' }
      ],
      filterList: [
        {
          renderKey: `column-key${Math.random().toString().substring(0, 5)}`,
          text: ''
        }
      ],
      filterListOption: [
        {
          label: 'Header',
          id: 'header',
          isDefaultExpanded: true,
          children: [
            { label: 'Subject', id: 'subject' },
            { label: 'From', id: 'from' },
            { label: 'To', id: 'to' },
            { label: 'CC', id: 'cc' },
            { label: 'BCC', id: 'bcc' },
            { label: 'Sender Name', id: 'senderName' },
            { label: 'IP Address', id: 'ip' }
          ]
        },
        {
          label: 'Body',
          id: 'body',
          isDefaultExpanded: true,
          children: [
            { label: 'Keyword', id: 'keyword' },
            { label: 'URL', id: 'url' },
            { label: 'Regex', id: 'regex' }
          ]
        },
        {
          label: 'Attachment',
          id: 'attachment',
          isDefaultExpanded: true,
          children: [
            { label: 'File Name', id: 'name' },
            { label: 'File Size', id: 'size' },
            { label: 'File Extension', id: 'extension' },
            { label: 'SHA512', id: 'sha512' },
            { label: 'MD5', id: 'md5' }
          ]
        }
      ],
      // fileSizeOptions: [
      //   {
      //     label: 'Equal',
      //     value: 'equal'
      //   },
      //   {
      //     label: 'Greater than',
      //     value: 'greaterThan'
      //   },
      //   {
      //     label: 'Greater than or equal',
      //     value: 'greaterThanOrEqual'
      //   },
      //   {
      //     label: 'Less than',
      //     value: 'lessThan'
      //   },
      //   {
      //     label: 'Less than or equal',
      //     value: 'lessThanOrEqual'
      //   }
      // ],
      selectedFileSize: null,
      valid: false,
      menu1: '',
      menu2: '',
      investigationNameRules: {
        required: (v) => Validations.required(v),
        empty: (v) => Validations.startsWithSpace(v),
        maxLength: (v) =>
          Validations.maxLength(v, 300, labels.getMaxLengthMessage(labels.InvestigationName, 300))
      },
      messageRules: {
        required: (v) => Validations.required(v),
        empty: (v) => Validations.startsWithSpace(v),
        maxLength: (v) =>
          Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Message, 64))
      },
      filterSelectRules: {
        required: (v) => Validations.required(v),
        format: (v) => Validations.startsWithSpace(v)
      },
      targetUsers: {
        required: (v) => {
          return v.length ? Validations.required(v) : labels.Required
        }
      }
    }
  },
  props: [
    'isEdit',
    'ísDuplicate',
    'statsAndMenuData',
    'investigationDetailsTargetUsersListData',
    'investigationDetailsData',
    'status',
    'selectedMail',
    'isTs',
    'isIr'
  ],
  methods: {
    callForTargetGroups(addPage) {
      if (addPage) {
        this.targetGroupsAxiosPayload.pageNumber += 1
        if (this.targetGroupsAxiosPayload.pageNumber > this.totalNumberOfPagesOfTargetGroups) return
      }
      searchTargetGroups(this.targetGroupsAxiosPayload)
        .then((response) => {
          this.setTargetGroups(response)
          this.totalNumberOfPagesOfTargetGroups = response.data.data.totalNumberOfPages
        })
        .finally(() => (this.isUserGroupsLoading = false))
    },
    setTargetGroups(response) {
      const { data: { data = [] } = [] } = response
      this.userGroupsItems = [...this.userGroupsItems, ...data.results]
    },
    callForSearchTargetGroups(search = '') {
      if (search) {
        searchTargetGroups(getSelectSearchPayload(this.targetGroupsAxiosPayload, search))
          .then(this.setTargetGroups)
          .finally(() => {
            this.isUserGroupsLoading = false
          })
      } else {
        this.callForTargetGroups()
      }
    },
    callForTargetUsers(addPage) {
      if (addPage) {
        this.targetUsersAxiosPayload.pageNumber += 1
        if (this.targetUsersAxiosPayload.pageNumber > this.totalNumberOfPagesOfTargetUsers) return
      }
      getTargetUsers(this.targetUsersAxiosPayload)
        .then((response) => {
          this.setTargetUsers(response)
          this.totalNumberOfPagesOfTargetUsers = response.data.data.totalNumberOfPages
        })
        .finally(() => {
          this.isTargetUsersLoading = false
        })
    },
    callForSearchTargetUsers(search = '') {
      if (search) {
        getTargetUsers(getSelectSearchPayload(this.targetUsersAxiosPayload, search, 'Email'))
          .then(this.setTargetUsers)
          .finally(() => {
            this.isTargetUsersLoading = false
          })
      } else {
        this.callForTargetUsers()
      }
    },
    setTargetUsers(response) {
      const { data: { data = [] } = [] } = response
      const newItems = data.results
        .map((item) => {
          if (this.targetUsersValue.includes(item.email)) return undefined
          return {
            email: item.email
          }
        })
        .filter(Boolean)
      this.specificUserItems = [...this.specificUserItems, ...newItems]
    },
    checkAllSingularity() {
      this.filterList.forEach((item, index) => this.checkSingularity(item, index))
    },
    handleInputSingularityChange(list, index) {
      this.checkSingularity({ ...list }, index)
      this.checkAllSingularity()
    },
    handleDeleteListItem(index) {
      this.filterList.splice(index, 1)
      this.errorMessages.splice(index, 1)
    },
    checkSingularity(list = {}, index = 0) {
      if (!list.option && !list.text) return
      let message = ''
      if (
        this.filterList.find(
          (item, itemIndex) =>
            item.text &&
            item.text === list.text &&
            item.option === list.option &&
            index !== itemIndex &&
            itemIndex < index
        )
      )
        message = `There is already ${list.option} with same value`
      this.$set(this.errorMessages, index, message)
    },
    actionChanged() {
      this.warningMessage = ''
      if (this.selectedAction === 'DeleteAndNotify' || this.selectedAction === 'Warning') {
        setTimeout(() => {
          const el = this.$refs.form.$el.querySelector('.warning-message')
          scrollToComponent(el)
        }, 250)
      }
    },
    checkCheckboxValidation() {
      let isCheckboxEmpty = this.scanTypes.length === 0
      if (isCheckboxEmpty) {
        this.checkboxError = true
      } else {
        this.checkboxError = false
      }
    },
    handleTargetUserTypeChange() {
      this.targetUsersValue = []
      this.$refs.form.resetValidation()
    },
    getSearchCriteriaItemRules(option = '') {
      const rules = []
      if (!option) {
        return rules
      }
      if (['from', 'to', 'cc', 'bcc'].includes(option)) {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.email(v),
          (v) =>
            Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.EmailAddress, 320)),
          (v) => {
            if (Validations.email(v)) {
              return Validations.controlEmailLength(v) || labels.InvalidEmailAddress
            }
            return false
          }
        )
        return rules
      } else if (option === 'ip') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.ip(v),
          (v) => Validations.maxLength(v, 15, labels.getMaxLengthMessage(labels.IpAddress, 15))
        )
        return rules
      } else if (option === 'subject') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Subject))
        )
        return rules
      } else if (option === 'senderName') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.SenderName))
        )
        return rules
      } else if (option === 'url') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.URL, 2000)),
          (v) => Validations.urlOrIpAddress(v)
        )
        return rules
      } else if (option === 'keyword') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Keyword))
        )
        return rules
      } else if (option === 'size') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.isNumber(v),
          (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Size, 320))
        )
        return rules
      } else if (option === 'name') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name))
        )
        return rules
      } else if (option === 'sha512') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.minLength(v, 128, labels.getMinLengthMessage(labels.SHA512, 128)),
          (v) => Validations.maxLength(v, 128, labels.getMaxLengthMessage(labels.SHA512, 128))
        )
        return rules
      } else if (option === 'md5') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 32, labels.getMaxLengthMessage(labels.MD5, 32)),
          (v) => Validations.minLength(v, 32, labels.getMinLengthMessage(labels.MD5, 32))
        )
        return rules
      } else if (option === 'extension') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.minLength(v, 3, labels.getMinLengthMessage(labels.Extension, 3)),
          (v) => Validations.maxLength(v, 10, labels.getMaxLengthMessage(labels.Extension, 10)),
          (v) => Validations.extension(v, labels.InvalidExtension),
          (v) => Validations.isFileExtensionSpecialCharacter(v, labels.InvalidExtension)
        )
        return rules
      } else if (option === 'regex') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.Regex, 10))
        )
      }
      return rules
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    addNewFilterListOption() {
      this.filterList.push({
        renderKey: `column-key${Math.random().toString().substring(0, 5)}`,
        text: ''
      })
    },
    onCancelClicked() {
      if (!this.isSubmitted) {
        const currentFormValues = {
          investigationName: this.investigationName,
          targetUsers: this.targetUsers,
          filterList: this.filterList,
          date: this.date,
          scanTypes: this.scanTypes,
          duration: this.duration,
          selectedAction: this.selectedAction
        }
        const isChanged = isDifferent(currentFormValues, this.initialFormValues)
        if (!isChanged) {
          return this.$emit('closeAdd')
        }
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeAdd')
          }
        })
      }
    },
    filterData(data = []) {
      return data.reduce((acc, item) => {
        if (
          Object.keys(item).some((key) => {
            return item[key]
          })
        )
          acc.push(item)
        return acc
      }, [])
    },
    onCreateClicked() {
      // creating new form data if validation is success
      // data structure is a little bit difficult. The filter values has to be check all time when It's selected.

      this.isSubmitted = true
      if (this.date.length < 1) {
        this.isDateValid = false
      }
      if (this.$refs.form.validate()) {
        if (!this.isDateValid || this.errorMessages.some((item) => item)) {
          this.$nextTick(() => {
            const el = this.$refs.form.$el.querySelector('.date-row')
            scrollToComponent(el)
          })
          this.isSubmitted = false
          return false
        }

        if (!this.filterList.every((filter) => filter.text && filter.option)) {
          this.$nextTick(() => {
            const el = this.$refs.form.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
          this.isSubmitted = false
          return false
        }
        let headersData = [
          {
            ip: null,
            from: null,
            to: null,
            cc: null,
            bcc: null,
            subject: null,
            senderName: null
          }
        ]

        let bodyData = [
          {
            url: null,
            keyword: null,
            regex: null
          }
        ]
        let attachmentsData = [
          {
            size: null,
            name: null,
            md5: null,
            sha512: null,
            extension: null
          }
        ]
        // checking filter status. If there are only 1 filter, it goes to the first element of array
        // If It's already exist, then new element pushs to the array.
        // for more info look at the ip case ( 4 line below)
        for (let index = 0; index < this.filterList.length; index++) {
          switch (this.filterList[index].option) {
            case 'ip':
              if (
                !headersData[headersData.length - 1].ip &&
                headersData[headersData.length - 1].ip != this.filterList[index].text
              ) {
                // in the first array, there is no value at ip value name pair
                // that's why, we can set the our ip value to the first array element
                headersData.filter((s) => s.ip == null)[0].ip = this.filterList[index].text
              } else {
                // ip value name pair is already exist. Thus, we push new array tp the headersData with all values null except ip.
                headersData.push({
                  ip: this.filterList[index].text,
                  from: null,
                  to: null,
                  cc: null,
                  bcc: null,
                  subject: null,
                  senderName: null
                })
              }
              break
            case 'from':
              if (
                !headersData[headersData.length - 1].from &&
                headersData[headersData.length - 1].from != this.filterList[index].text
              ) {
                headersData.filter((s) => s.from == null)[0].from = this.filterList[index].text
              } else {
                headersData.push({
                  ip: null,
                  from: this.filterList[index].text,
                  to: null,
                  cc: null,
                  bcc: null,
                  subject: null,
                  senderName: null
                })
              }
              break
            case 'to':
              if (
                !headersData[headersData.length - 1].to &&
                headersData[headersData.length - 1].to != this.filterList[index].text
              ) {
                headersData.filter((s) => s.to == null)[0].to = this.filterList[index].text
              } else {
                headersData.push({
                  ip: null,
                  from: null,
                  to: this.filterList[index].text,
                  cc: null,
                  bcc: null,
                  subject: null,
                  senderName: null
                })
              }
              break
            case 'cc':
              if (
                !headersData[headersData.length - 1].cc &&
                headersData[headersData.length - 1].cc != this.filterList[index].text
              ) {
                headersData.filter((s) => s.cc == null)[0].cc = this.filterList[index].text
              } else {
                headersData.push({
                  ip: null,
                  from: null,
                  to: null,
                  cc: this.filterList[index].text,
                  bcc: null,
                  subject: null,
                  senderName: null
                })
              }
              break
            case 'bcc':
              if (
                !headersData[headersData.length - 1].bcc &&
                headersData[headersData.length - 1].bcc != this.filterList[index].text
              ) {
                headersData.filter((s) => s.bcc == null)[0].bcc = this.filterList[index].text
              } else {
                headersData.push({
                  ip: null,
                  from: null,
                  to: null,
                  cc: null,
                  bcc: this.filterList[index].text,
                  subject: null,
                  senderName: null
                })
              }
              break
            case 'subject':
              if (
                !headersData[headersData.length - 1].subject &&
                headersData[headersData.length - 1].subject != this.filterList[index].text
              ) {
                headersData.filter((s) => s.subject == null)[0].subject = this.filterList[
                  index
                ].text
              } else {
                headersData.push({
                  ip: null,
                  from: null,
                  to: null,
                  cc: null,
                  bcc: null,
                  subject: this.filterList[index].text,
                  senderName: null
                })
              }
              break
            case 'senderName':
              if (
                !headersData[headersData.length - 1].senderName &&
                headersData[headersData.length - 1].senderName != this.filterList[index].text
              ) {
                headersData.filter((s) => s.senderName == null)[0].senderName = this.filterList[
                  index
                ].text
              } else {
                headersData.push({
                  ip: null,
                  from: null,
                  to: null,
                  cc: null,
                  bcc: null,
                  subject: null,
                  senderName: this.filterList[index].text
                })
              }
              break
            case 'url':
              if (
                !bodyData[bodyData.length - 1].url &&
                bodyData[bodyData.length - 1].url != this.filterList[index].text
              ) {
                bodyData.filter((s) => s.url == null)[0].url = this.filterList[index].text
              } else {
                bodyData.push({
                  url: this.filterList[index].text,
                  keyword: null,
                  isRegex: false
                })
              }
              break
            case 'keyword':
              if (
                !bodyData[bodyData.length - 1].keyword &&
                bodyData[bodyData.length - 1].keyword != this.filterList[index].text
              ) {
                bodyData.filter((s) => s.keyword == null)[0].keyword = this.filterList[index].text
              } else {
                bodyData.push({
                  url: null,
                  keyword: this.filterList[index].text,
                  isRegex: false
                })
              }
              break
            case 'size':
              if (
                !attachmentsData[attachmentsData.length - 1].size &&
                attachmentsData[attachmentsData.length - 1].size != this.filterList[index].text
              ) {
                attachmentsData.filter((s) => s.size == null)[0].size = this.filterList[index].text
              } else {
                attachmentsData.push({
                  size: this.filterList[index].text,
                  name: null,
                  md5: null,
                  sha512: null,
                  extension: null
                })
              }
              break
            case 'name':
              if (
                !attachmentsData[attachmentsData.length - 1].name &&
                attachmentsData[attachmentsData.length - 1].name != this.filterList[index].text
              ) {
                attachmentsData.filter((s) => s.name == null)[0].name = this.filterList[index].text
              } else {
                attachmentsData.push({
                  size: null,
                  name: this.filterList[index].text,
                  md5: null,
                  sha512: null,
                  extension: null
                })
              }
              break
            case 'sha512':
              if (
                !attachmentsData[attachmentsData.length - 1].sha512 &&
                attachmentsData[attachmentsData.length - 1].sha512 != this.filterList[index].text
              ) {
                attachmentsData.filter((s) => s.sha512 == null)[0].sha512 = this.filterList[
                  index
                ].text
              } else {
                attachmentsData.push({
                  size: null,
                  name: null,
                  md5: null,
                  sha512: this.filterList[index].text,
                  extension: null
                })
              }
              break
            case 'md5':
              if (
                !attachmentsData[attachmentsData.length - 1].md5 &&
                attachmentsData[attachmentsData.length - 1].md5 != this.filterList[index].text
              ) {
                attachmentsData.filter((s) => s.md5 == null)[0].md5 = this.filterList[index].text
              } else {
                attachmentsData.push({
                  size: null,
                  name: null,
                  md5: this.filterList[index].text,
                  sha512: null,
                  extension: null
                })
              }
              break
            case 'extension':
              if (
                !attachmentsData[attachmentsData.length - 1].extension &&
                attachmentsData[attachmentsData.length - 1].extension != this.filterList[index].text
              ) {
                attachmentsData.filter((s) => s.extension == null)[0].extension = this.filterList[
                  index
                ].text
              } else {
                attachmentsData.push({
                  size: null,
                  name: null,
                  md5: null,
                  sha512: null,
                  extension: this.filterList[index].text
                })
              }
              break
            case 'regex':
              if (
                !bodyData[bodyData.length - 1].regex &&
                bodyData[bodyData.length - 1].regex !== this.filterList[index].text
              ) {
                bodyData.filter((s) => s.regex == null)[0].regex = this.filterList[index].text
              } else {
                bodyData.push({
                  url: null,
                  keyword: null,
                  regex: this.filterList[index].text
                })
              }
            default:
              break
          }
        }

        const [startDate, endDate] = this.date

        const newInvestigationObj = {
          headers: this.filterData(headersData),
          bodies: this.filterData(bodyData),
          attachments: this.filterData(attachmentsData),
          isScanEnterpriseVault: false,
          name: this.investigationName,
          startDate,
          endDate,
          duration: this.duration,
          targetUserType: this.targetUserType,
          targetUsers:
            this.targetUserType === 'Groups'
              ? this.targetUsersValue.map((item) => item.resourceId)
              : this.targetUsersValue,
          //targetUsersValue: this.targetUsersValue,
          scanTypes: this.scanTypes,
          autoAction: {
            type: this.selectedAction,
            isPermanentDelete: false,
            warningMessage: this.warningMessage
          }
        }
        this.saveDisable = true
        // post request with body data
        this.$store
          .dispatch('investigations/createInvestigation', newInvestigationObj)
          .catch(() => {
            this.saveDisable = false
          })
          .then((resp) => {
            this.saveDisable = false
            this.$emit('closeWithRoute', resp)
            this.$emit('closeAdd', true)
          })
      } else {
        this.isSubmitted = false
        return this.$nextTick(() => {
          this.saveDisable = false
          const el = this.$refs.form.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    checkInvestigationName() {
      // investigaiton rule checking
      if (this.name.length && !this.name.startsWith(' '))
        this.$store.dispatch('threatSharing/checkName', this.name)
    },
    checkIsEdit() {
      if (this.isEdit) {
        this.investigationName = this?.investigationDetailsData?.name || ''
        this.scanTypes = this.investigationDetailsData.scanConfigurationDetails.map(
          ({ mailConfigurationResourceId, type }) => ({
            mailConfigurationResourceId,
            type
          })
        )
        this.duration = 3
        this.targetUserType = this.investigationDetailsData.targetUserType
        if (this.investigationDetailsData.targetUserType === 'Groups') {
          this.targetUsersValue = this.investigationDetailsData.targetUsers.map((item) => {
            let obj = {
              name: item.targetUser,
              resourceId: item.targetGroupResourceId
            }
            return obj
          })
        } else if (this.investigationDetailsData.targetUserType === 'SpecificUsers') {
          this.targetUsersValue = this.investigationDetailsData.targetUsers.map(
            (item) => item.targetUser
          )
          const newItems = this.targetUsersValue.map((email) => ({ email }))
          this.specificUserItems = [...this.specificUserItems, ...newItems]
        }
        const headers = this?.investigationDetailsData?.headers?.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key !== 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        const body = this?.investigationDetailsData?.bodies?.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key !== 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        const attachments = this?.investigationDetailsData?.attachments?.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key != 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        this.selectedAction = 'NoAction'
        this.filterList = [...headers, ...body, ...attachments]
      }
    }
  },
  created() {
    this.callForTargetUsers()
    this.callForTargetGroups()
    this.checkIsEdit()
    if (this.selectedMail) {
      this.filterList = []
      const isTs = this.isTs
      const isIR = this.isIr
      if (isIR) {
        this.selectedMail.urls = this.selectedMail.notifiedEmailInvestigation.urls
        this.selectedMail.attachments = this.selectedMail.notifiedEmailInvestigation.attachments
      }
      this.selectedMail.attachments &&
        this.selectedMail.attachments.map((item) => {
          const attachmentCase = isTs ? !item.isHidden && item.isFlagged : true
          if (attachmentCase)
            this.filterList.push({
              option: 'md5',
              text: item.md5,
              isFlagged: item.isFlagged,
              label: 'Malicious'
            })
          if (attachmentCase)
            this.filterList.push({
              option: 'sha512',
              text: item.sha512,
              isFlagged: item.isFlagged,
              label: 'Malicious'
            })
        })
      const bccCase = isTs ? !this.selectedMail.isBccHidden && this.selectedMail.isBccFlagged : true
      this.selectedMail.bcc &&
        bccCase &&
        this.selectedMail.bcc.map((item) => {
          this.filterList.push({
            option: 'bcc',
            text: item,
            isFlagged: this.selectedMail.isBccFlagged,
            label: 'Harmful sender'
          })
        })
      const ccCase = isTs ? !this.selectedMail.isCcHidden && this.selectedMail.isCcFlagged : true
      this.selectedMail.cc &&
        ccCase &&
        this.selectedMail.cc.map((item) => {
          this.filterList.push({
            option: 'cc',
            text: item,
            isFlagged: this.selectedMail.isCcFlagged,
            label: 'Harmful sender'
          })
        })
      const fromCase = isTs
        ? !this.selectedMail.isFromHidden && this.selectedMail.isFromFlagged
        : true
      this.selectedMail.from &&
        fromCase &&
        this.filterList.push({
          option: 'from',
          text: this.selectedMail.from,
          isFlagged: this.selectedMail.isFromFlagged,
          label: 'Harmful sender'
        })
      const subjectCase = isTs
        ? !this.selectedMail.isSubjectHidden && this.selectedMail.isSubjectFlagged
        : true
      this.selectedMail.subject &&
        subjectCase &&
        this.filterList.push({
          option: 'subject',
          text: this.selectedMail.subject,
          isFlagged: this.selectedMail.isSubjectFlagged,
          label: 'Harmful sender'
        })
      const toCase = isTs ? !this.selectedMail.isToHidden && this.selectedMail.isToFlagged : true
      this.selectedMail.to &&
        toCase &&
        !isIR &&
        this.selectedMail.to.map((item) => {
          this.filterList.push({
            option: 'to',
            text: item,
            isFlagged: this.selectedMail.isToFlagged,
            label: 'Harmful sender'
          })
        })
      this.selectedMail.urls &&
        this.selectedMail.urls.map((item) => {
          const urlCase = isTs ? !item.isHidden && item.isFlagged : true
          if (urlCase)
            this.filterList.push({
              option: 'url',
              text: item.url,
              isFlagged: item.isFlagged,
              label: 'Phishing'
            })
        })
      if (!this.filterList.length) {
        this.filterList.push({})
      }
      this.investigationName = `Manual Investigation - ${this.$moment(Date.now()).format(
        getTimeZoneForMoment()
      )}`
    }
    const pageNav = document.querySelector('.page-nav')
    if (pageNav) {
      pageNav.style.zIndex = 8
    }
    this.initialFormValues = {
      investigationName: this.investigationName,
      targetUsers: this.targetUsers,
      filterList: this.filterList,
      date: this.date,
      scanTypes: this.scanTypes,
      duration: this.duration,
      selectedAction: this.selectedAction
    }
  },
  beforeDestroy() {
    const pageNav = document.querySelector('.page-nav')
    if (pageNav) {
      pageNav.style.zIndex = 19
    }
  }
}
</script>
