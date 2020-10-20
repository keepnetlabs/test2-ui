<template>
  <app-modal :status="status" iconName="mdi-magnify" :title="`Start New Manual Investigation`">
    <template v-slot:overlay-body>
      <div class="new-investigation-wrapper">
        <v-card flat light style="max-width: 554px;">
          <app-modal-body-header
            title="Start New Investigation"
            sub-title="Select filters and date options to start an investigation"
          />
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-list-item class="edit-name-area 0 pa-0 investigation-name">
              <v-list-item-content class>
                <label class="pb-2 edit-labels">Investigation Name</label>
                <v-text-field
                  placeholder="Manual Investigation - 09.09.2019  16:25"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model.trim="investgationName"
                  :rules="[investigationNameRules.required, investigationNameRules.empty]"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area pt-2 pb-4 pa-0 target-users-select">
              <v-list-item-content class>
                <label class="edit-labels">Target Users</label>
                <label class="edit-sub-labels"
                  >Select departments, groups or users to investigate</label
                >
                <div class="target-users-select__radio-group">
                  <v-radio-group
                    v-model="targetUserType"
                    :mandatory="false"
                    @change="targetUsersValue = []"
                    row
                  >
                    <v-radio value="AllUsers" label="All Users" color="primary"></v-radio>
                    <v-radio value="Groups" label="User Groups" color="primary"></v-radio>
                    <v-radio value="SpecificUsers" label="Specific Users" color="primary"></v-radio>
                  </v-radio-group>
                </div>
                <div class="target-users-select__input-area">
                  <v-combobox
                    :items="[]"
                    :placeholder="
                      targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
                    "
                    outlined
                    class="edit-select standard-height"
                    item-text="name"
                    multiple
                    dense
                    persistent-hint
                    small-chips
                    deletable-chips
                    autocomplete="disabled"
                    :return-object="false"
                    v-if="targetUserType === 'AllUsers'"
                    :disabled="targetUserType === 'AllUsers'"
                    required
                  ></v-combobox>
                  <v-combobox
                    :items="userGroupsItems"
                    :placeholder="targetUserType == 'AllUsers' ? 'All Users' : 'Select user groups'"
                    outlined
                    class="edit-select new-investigation__combo target-users-select-multi"
                    v-model.trim="targetUsersValue"
                    :search-input.sync="searchTargetUsersGroupsValue"
                    :rules="[targetUsers.required]"
                    item-text="name"
                    multiple
                    dense
                    persistent-hint
                    auto-select-first
                    small-chips
                    deletable-chips
                    :return-object="true"
                    autocomplete="disabled"
                    v-if="targetUserType === 'Groups'"
                  ></v-combobox>
                  <v-combobox
                    :items="specificUserItems"
                    v-if="targetUserType == 'SpecificUsers'"
                    placeholder="Enter user email Addresses"
                    item-text="email"
                    item-value="email"
                    :search-input.sync="searchTargetUsersSpecificValue"
                    multiple
                    dense
                    persistent-hint
                    auto-select-first
                    deletable-chips
                    autocomplete="disabled"
                    small-chips
                    :return-object="false"
                    :rules="[targetUsers.required]"
                    :no-data-text="'no data'"
                    outlined
                    class="edit-select new-investigation__combo target-users-select-multi"
                    v-model.trim="targetUsersValue"
                  ></v-combobox>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area pb-4 pa-0">
              <v-list-item-content class="filter-container">
                <label class="edit-labels">Search Criteria</label>
                <label class="edit-sub-labels"
                  >Define criteria for the investigation. Emails that match any of the criteria will
                  be found</label
                >
                <div class="filter-item" v-for="(list, index) in filterList" :key="index">
                  <div class="filter-item__selectbox">
                    <v-select
                      :items="filterListOption"
                      v-model.trim="list.option"
                      placeholder="Select filter"
                      outlined
                      class="edit-select standard-height"
                      required
                      :rules="[filterSelectRules.required]"
                    ></v-select>
                  </div>
                  <div class="filter-item__input">
                    <v-text-field
                      :placeholder="
                        placeholders[list.option]
                          ? placeholders[list.option]
                          : 'Select filter for investigation'
                      "
                      outlined
                      class="edit-name-textfield edit-select standard-height"
                      :rules="[
                        list.option && generalRules[list.option].required,
                        list.option && generalRules[list.option].format
                      ]"
                      v-model.trim="list.text"
                      required
                    ></v-text-field>
                  </div>
                  <div class="filter-item__delete-button">
                    <v-icon
                      medium
                      left
                      class="ml-2"
                      v-if="filterList.length > 1"
                      @click="filterList.splice(index, 1)"
                      >mdi-close</v-icon
                    >
                  </div>
                </div>
                <button class="filter-item__button" type="button" @click="addNewFilterListOption()">
                  <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>ADD CRITERIA
                </button>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area pb-4 pa-0">
              <v-list-item-content class>
                <label class="edit-labels">Email Date Range</label>
                <label class="edit-sub-labels">Select range of emails’ sending date</label>
                <div class="date-row" :class="[!isDateValid && 'date-picker-container']">
                  <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    range-separator="To"
                    format="yyyy-MM-dd HH:mm:ss"
                    ref="refPicker"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    :rules="[]"
                  >
                  </el-date-picker>

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
            <v-list-item class="edit-industry-area mt-2 pb-0 pa-0">
              <v-list-item-content class>
                <label class="edit-labels">Select Sources</label>
                <label class="edit-sub-labels"
                  >Select sources to investigate with conditions above</label
                >
                <div class="select-sources flex">
                  <v-checkbox
                    class="v-input--checkbox"
                    v-model="scanTypes"
                    :label="item"
                    :value="item"
                    v-for="(item, index) in sources"
                    @change="checkCheckboxValidation()"
                    :key="index"
                  ></v-checkbox>
                  <div class="v-text-field__details checkbox-error" v-if="checkboxError">
                    <div class="v-messages theme--light error--text" role="alert">
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">Source Select required</div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>

            <v-list-item class="edit-industry-area mt-2 pb-4 pa-0">
              <v-list-item-content class>
                <label class="edit-labels">Duration</label>
                <label class="edit-sub-labels"
                  >Select how many days the investigation will run</label
                >
                <v-select
                  :items="durations"
                  outlined
                  class="input-select standard-height"
                  v-model.trim="selectedDuration"
                  :rules="[(v) => !!v || 'Duration is required']"
                  item-text="durationLabel"
                  item-value="durationValue"
                  placeholder="3 Days"
                ></v-select>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="edit-industry-area mt-2 pa-0">
              <v-list-item-content class>
                <label class="edit-labels">Action</label>
                <label class="edit-sub-labels"
                  >Select action to be executed if email is found</label
                >
                <v-select
                  :items="actions"
                  outlined
                  class="input-select standard-height"
                  v-model.trim="selectedAction"
                  :rules="[(v) => !!v || 'Action is required']"
                  item-text="actionLabel"
                  item-value="actionValue"
                  placeholder="Delete Email"
                ></v-select>
              </v-list-item-content>
            </v-list-item>
          </v-form>
        </v-card>
      </div>
    </template>
    <template v-slot:overlay-footer>
      <div class="new-investigation-footer">
        <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">CANCEL</v-btn>
        <v-btn class="create-btn" text color="#2196f3" @click="onCreateClicked"
          >START INVESTIGATION</v-btn
        >
      </div>
    </template>
  </app-modal>
</template>
<script>
import AppModal from '../AppModal'
import {
  getTargetGroups,
  getTargetGroupsByName,
  getTargetUsersByEmail
} from '../../api/targetUsers'
import { getInvestigationScanTypes } from '@/api/investigations'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import { scrollToComponent } from '@/utils/functions'
export default {
  components: {
    AppModalBodyHeader,
    AppModal
  },
  watch: {
    date(val) {
      if (val && val.length > 0) {
        this.isDateValid = true
      } else {
        this.isDateValid = false
      }
    },
    searchTargetUsersGroupsValue(val) {
      if (val && val.length >= 3) {
        this.debounce(() => {
          const payload = {
            pageNumber: 1,
            pageSize: 10,
            orderBy: 'Name',
            ascending: false,
            groupName: val
          }
          this.callForGetTargetGroupItems(payload)
        }, 500)
      } else {
        this.userGroupsItems = this.defaultUserGroupItems
      }
    },
    searchTargetUsersSpecificValue(val) {
      if (val && val.length >= 3) {
        this.debounce(() => {
          const payload = {
            pageNumber: 1,
            pageSize: 10,
            orderBy: 'Email',
            ascending: false,
            email: val
          }
          this.callForGetTargetUsersItems(payload)
        }, 500)
      } else {
        this.specificUserItems = this.defaultSpecificUserItems
      }
    }
  },

  data() {
    return {
      timeout: null,
      defaultUserGroupItems: [],
      searchTargetUsersSpecificValue: '',
      specificUserItems: [],
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
      searchTargetUsersGroupsValue: '',
      placeholders: {
        ip: '1.1.1.1',
        from: 'Email address',
        to: 'Email address',
        cc: 'Email address  ',
        bcc: 'Email address',
        subject: 'Enter a keyword',
        from_name: 'Full name (case sensitive)',
        url: 'https://www.yourdomain.com',
        keyword: 'Enter a keyword',
        size: '1024 bytes',
        name: 'file.jpg (case sensitive)',
        sha512: '3c1cc475fc16e68f41943421301c61c4f7f655…',
        md5: '3c1cc475fc16e68f41943421301c61c4f7f655…',
        extension: 'JPG'
      },
      scanTypes: [],
      checkboxError: false,
      investgationName: 'Manuel Investigation',
      isDateValid: true,
      targetUserType: 'AllUsers',
      targetUsersValue: '',
      date: [],
      startDate: '',
      endDate: '',
      selectedDuration: 3,
      selectedAction: 'deleteEmail',
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
        { actionLabel: 'No action', actionValue: 'noAction' },
        { actionLabel: 'Delete Email', actionValue: 'deleteEmail' },
        {
          actionLabel: 'Delete Email and Notify User',
          actionValue: 'deleteAndNotifyUser'
        },
        { actionLabel: 'Notify user only', actionValue: 'notifyUserOnly' }
      ],
      filterList: [{ option: '', text: '' }],
      sources: [],
      filterListOption: [
        'ip',
        'from',
        'to',
        'cc',
        'bcc',
        'subject',
        'from_name',
        'url',
        'keyword',
        'size',
        'name',
        'sha512',
        'md5',
        'extension'
      ],
      valid: false,
      menu1: '',
      menu2: '',
      investigationNameRules: {
        required: (v) =>
          (v && v.length <= 150) || 'Investigation Name must between 1-150 characters',
        empty: (v) => (v && !v.startsWith(' ')) || 'Investigation Name cannot start with space'
      },
      generalRules: {
        ip: {
          required: (v) => {
            return (v && v.length <= 255) || 'IP must between 1 - 255 characters'
          },
          format: (v) => {
            return (
              /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi.test(
                v
              ) || 'Invalid ip'
            )
          }
        },
        from: {
          required: (v) => (v && v.length <= 255) || 'From must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid from address'
        },
        to: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid to address'
        },
        cc: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid cc address'
        },
        bcc: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid bcc address'
        },
        subject: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // string kontrolü
        },
        from_name: {
          required: (v) => (v && v.length <= 1000) || 'It must between 1 - 1000 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // string kontrolü
        },
        url: {
          required: (v) => (v && v.length <= 1000) || 'It must between 1 - 1000 characters',
          format: (v) =>
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(
              v
            ) || 'invalid url'
        },
        keyword: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => {
            return (v && !v.startsWith(' ')) || 'Cannot start with space'
          } // format ekle
        },
        size: {
          required: (v) => false,
          format: (v) => false
        },
        name: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        sha512: {
          required: (v) => (v && v.length <= 512) || 'It must between 1 - 512 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        md5: {
          required: (v) => (v && v.length <= 128) || 'It must between 1 - 128 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        extension: {
          required: (v) => (v && v.length <= 10) || 'It must between 1 - 10 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        }
      },
      filterSelectRules: {
        required: (v) => !!v || 'Filter Select required',
        format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space'
      },
      descriptionRules: {
        required: (v) =>
          (!!v && v.length <= 150) || 'Description required and must between 5-150 characters.',
        regex: (v) =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      targetUsers: {
        required: (v) =>
          (!!v && v.length > 0) || 'Target users required for creating a investigation'
      },
      checkboxRule: {
        required: (v) => this.sources.find((item) => item.value)
      }
    }
  },
  props: [
    'isEdit',
    'statsAndMenuData',
    'investigationDetailsTargetUsersListData',
    'investigationDetailsData',
    'status',
    'selectedMail'
  ],
  methods: {
    checkCheckboxValidation() {
      let isCheckboxEmpty = this.scanTypes.length === 0
      if (isCheckboxEmpty) {
        this.checkboxError = true
      } else {
        this.checkboxError = false
      }
    },
    callForGetTargetUsersItems(payload, isDefault = false) {
      getTargetUsersByEmail(payload).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response
        if (isDefault) {
          this.defaultSpecificUserItems = results
        }
        this.specificUserItems = results || []
      })
    },
    callForGetTargetGroupItems(payload, isDefault = false) {
      getTargetGroupsByName(payload).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response
        if (isDefault) {
          this.defaultUserGroupItems = results
        }
        this.userGroupsItems = results || []
      })
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
      this.filterList.push({ option: '', text: '' })
    },
    onCancelClicked() {
      this.$emit('closeAdd')
    },
    onCreateClicked() {
      // creating new form data if validation is success
      // data structure is a little bit difficult. The filter values has to be check all time when It's selected.

      if (this.date.length < 1) {
        this.isDateValid = false
      }
      if (this.$refs.form.validate()) {
        let isCheckboxEmpty = this.scanTypes.length === 0
        if (isCheckboxEmpty) {
          this.checkboxError = true
          return false
        } else {
          this.checkboxError = false
        }
        if (!this.isDateValid) {
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
            isRegex: false
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
            case 'from_name':
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

            default:
              break
          }
        }
        // cerate new body data for api call

        const newInvestigationObj = {
          headers: headersData,
          bodies: bodyData,
          attachments: attachmentsData,
          isScanEnterpriseVault: false,
          investigationType: 'Manual',
          name: this.investgationName,
          startDate: this.date[0],
          endDate: this.date[1],
          expireDate: this.newExpireDate(this.date[0], this.selectedDuration),
          targetUserType: this.targetUserType,
          targetUsers:
            this.targetUserType == 'Groups'
              ? this.targetUsersValue.map((item) => item.resourceId)
              : this.targetUsersValue,
          //targetUsersValue: this.targetUsersValue,
          action: this.selectedAction,
          scanTypes: this.scanTypes
        }
        // post request with body data
        this.$store
          .dispatch('investigations/createInvestigation', newInvestigationObj)
          .catch(() => {})
          .then((resp) => {
            this.$emit('closeWithRoute', resp)
            this.$emit('closeAdd', true)
          })
      } else {
        return this.$nextTick(() => {
          const el = this.$refs.form.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    checkInvestigationName() {
      // investigaiton rule checking
      if (this.name.length && !this.name.startsWith(' '))
        this.$store.dispatch('threadSharing/checkName', this.name)
    },
    minDate() {
      // set min date
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year - 1, month, day].join('-')
    },
    maxDate() {
      // set max date
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year + 1, month, day].join('-')
    },
    newExpireDate(endDate, duration) {
      // set expire date with duration value
      // backend allows to iso string
      function addDays(date, days) {
        var result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
      }
      let now = new Date()
      let newDate = addDays(now, duration)
      return new Date(newDate).toISOString()
    },
    allowedDates(val) {
      // return val < this.endDate;
    },
    checkIsEdit() {
      if (this.isEdit) {
        let _this = this

        this.investgationName = this.investigationDetailsData.name
        //this.date.push(this.investigationDetailsData.startDate)
        //this.data.push(this.investigationDetailsData.startDate)
        //this.data.push(this.investigationDetailsData.endDate)

        //this.date.push(this.investigationDetailsData.endDate)
        this.selectedDuration =
          new Date(this.investigationDetailsData.expireDate).getDate() -
          new Date(this.investigationDetailsData.createTime).getDate()
        this.targetUserType = this.investigationDetailsData.targetUserType
        if (this.investigationDetailsData.targetUserType == 'Groups') {
          this.targetUsersValue = this.investigationDetailsData.targetUsers.map((item) => {
            let obj = {
              name: item.targetGroup,
              groupId: item.targetGroupId
            }
            return obj
          })
        } else if (this.investigationDetailsData.targetUserType == 'SpecificUsers') {
          this.targetUsersValue = this.investigationDetailsData.targetUsers.map(
            (item) => item.targetUser
          )
        }

        this.scanTypes = _this.investigationDetailsData.scanTypes.reduce((acc, item) => {
          acc.push(item.scanType)
          return acc
        }, [])
        console.log('scanTypes', this.scanTypes)
        const headers = this.investigationDetailsData.headers.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key != 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        const body = this.investigationDetailsData.bodies.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key != 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        const attachments = this.investigationDetailsData.attachments.reduce((acc, item) => {
          for (let [key, value] of Object.entries(item)) {
            if (value && key != 'resourceId') {
              acc.push({ option: key, text: value })
            }
          }
          return acc
        }, [])
        this.filterList = [...headers, ...body, ...attachments]
        this.selectedAction = 'noAction'
      }
    }
  },
  created() {
    this.callForGetTargetUsersItems(
      {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'Email',
        ascending: false,
        email: ''
      },
      true
    )
    getTargetGroups().then((response) => {
      this.userGroupsItems = response.data.data
      this.defaultUserGroupItems = response.data.data
    })
    getInvestigationScanTypes().then((response) => {
      this.sources = response.data.data
      this.checkIsEdit()
    })
    this.checkIsEdit()
    if (this.selectedMail) {
      this.filterList = []
      this.selectedMail.attachments &&
        this.selectedMail.attachments.map((item) => {
          if (!item.isHidden) this.filterList.push({ option: 'md5', text: item.md5 })
          if (!item.isHidden) this.filterList.push({ option: 'sha512', text: item.sha512 })
        })
      this.selectedMail.bcc &&
        !this.selectedMail.isBccHidden &&
        this.selectedMail.bcc.map((item) => {
          this.filterList.push({ option: 'bcc', text: item })
        })
      this.selectedMail.cc &&
        !this.selectedMail.isCcHidden &&
        this.selectedMail.cc.map((item) => {
          this.filterList.push({ option: 'cc', text: item })
        })
      this.selectedMail.from &&
        !this.selectedMail.isFromHidden &&
        this.filterList.push({
          option: 'from',
          text: this.selectedMail.from
        })
      this.selectedMail.subject &&
        !this.selectedMail.isSubjectHidden &&
        this.filterList.push({
          option: 'subject',
          text: this.selectedMail.subject
        })
      this.selectedMail.to &&
        !this.selectedMail.isToHidden &&
        this.selectedMail.to.map((item) => {
          this.filterList.push({ option: 'to', text: item })
        })
      this.selectedMail.urls &&
        this.selectedMail.urls.map((item) => {
          if (!item.isHidden) this.filterList.push({ option: 'url', text: item.url })
        })
      this.investgationName = 'Manual Investigation'
    }
    document.querySelector('.page-nav').style.zIndex = 8
  },
  mounted() {},
  beforeDestroy() {
    document.querySelector('.page-nav').style.zIndex = 19
  }
}
</script>
<style lang="scss">
.new-investigation-wrapper {
  &__header {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  &__sub-header {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .target-users-select {
    &__radio-group {
      padding: 0px !important;
      margin: 0 !important;

      .v-input--selection-controls {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      .v-input__slot {
        margin-bottom: 0 !important;
      }

      .v-messages.theme--light {
      }

      .v-input--selection-controls.v-input .v-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    &__specific-user-input {
      .v-input__append-inner {
        display: none !important;
      }
      .v-chip {
        margin: 3px !important;
      }
    }
  }

  .investigation-name {
    .v-list-item__content {
      padding-bottom: 0 !important;
    }

    .v-text-field__details {
      margin-bottom: 0px !important;
    }
  }

  .select-sources {
    display: flex;
    flex-wrap: wrap;

    .v-input--checkbox {
      border: none;
      font-size: 11px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      padding-top: 0px;
      margin-top: 0px;

      &:not(:last-child) {
        margin-right: 15px;
      }

      label.v-label.theme--light {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.72) !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light {
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.accent--text {
      }
    }

    .v-application {
      color: #2196f3 !important;
    }

    .accent--text {
      color: #2196f3 !important;
    }
  }

  .v-input--checkbox {
    .v-input__slot {
      input {
        z-index: 9;
      }
    }

    .v-label {
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.72);
      height: 20px !important;
    }
  }

  .standard-height {
    .v-input__slot {
      max-height: 40px !important;
      min-height: 40px !important;
    }
  }

  .v-autocomplete {
    .v-label {
      top: 10px !important;
    }

    .v-label--active {
      top: 8px !important;
    }

    &:not(.v-input--is-focused).v-select--chips input {
      max-height: 25px;
      padding: 0;
    }
  }

  .new-investigation-container {
    height: 100%;
    overflow: auto;
    width: 100%;
  }

  .filter-container {
    .v-input__slot {
      margin-bottom: 0 !important;
    }

    .v-text-field__details {
      //bottom: -25px !important;
    }

    .filter-item {
      display: flex;
      flex-flow: row;
      align-items: center;
      text-align: center;
      justify-content: center;
      position: relative;

      &:not(:first-of-type) {
        margin-top: 11px;
      }

      &:hover {
        .filter-item__delete-button {
          display: flex;
        }
      }

      &__selectbox {
        width: 80%;
        margin-right: 5%;
        max-height: 40px;
      }

      &__input {
        width: 100%;
        max-height: 40px;
      }

      &__button {
        font-size: 14px;
        font-weight: 600;
        margin-top: 8px;
        line-height: 1.71;
        letter-spacing: normal;
        color: #2196f3 !important;
        align-items: center;
        display: flex;
        .v-icon.v-icon {
          margin-left: 0 !important;
        }
        &:focus,
        &:focus-within {
          outline: 0 !important;
        }
      }

      &__delete-button {
        width: 44px;
        height: 40px;
        color: #757575;
        position: absolute;
        right: -40px;
        top: 0px;
        justify-content: center;
        display: flex;
      }
    }
  }

  .new-investigation-inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    overflow: visible;
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .edit-name-textfield,
  .edit-description,
  .edit-select {
    font-size: 13px !important;
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .edit-labels {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
    padding-bottom: 3px;
  }

  .edit-sub-labels {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
    padding-bottom: 14px;
  }

  .edit-privacy-buttons {
    align-items: center;
    display: flex;
    width: 168px;

    button {
      border-radius: 18px !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      padding: 0 16px !important;
    }

    .public-btn {
      border: 1px solid #757575;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      height: 36px;
      margin-left: 4px;
    }

    .private-btn {
      border: 1px solid #757575;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      height: 36px;
      margin-left: 9px;
    }
  }

  .edit-privacy-bottom-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    padding-top: 8px;
    margin: 0 !important;
  }

  .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: unset;
  }

  .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
    opacity: 1;
  }

  .v-btn-toggle > .v-btn.v-btn--active,
  .v-btn-toggle > .v-btn.v-btn--active::before {
    color: #fff;
  }

  .btnActive {
    height: 36px;
    border-radius: 18px;
    border: solid 1px #757575;
  }

  .btnActive,
  .btnActive:active,
  .btnActive:hover,
  .btnActive:focus {
    border: unset !important;
    outline: 0 !important;
  }

  .btnActive,
  .btnActive::before {
    border: unset !important;
    border-color: unset !important;
    color: #fff;
    background-color: #2196f3 !important;
    box-shadow: 0 2px 5px 0 #2196f3 !important;
  }

  .private-btn.v-btn.v-btn--active {
    border-left: transparent !important;
  }

  .v-btn-toggle--group > .v-btn.v-btn {
    border-color: #757575;
    border-left: 1px solid #757575 !important;
  }

  .v-btn:before {
    top: -1px !important;
    left: -1px !important;
  }

  .footer-actions {
    align-items: center;
    bottom: 0;
    background-color: #f5f7fa;
    display: flex;
    left: 0;
    position: fixed;
    justify-content: space-between;
    padding: 0 10vw;
    height: 68px;
    width: 100%;
    z-index: 9999;
  }

  .error-border {
    fieldset {
      border: 2px solid #ff5252 !important;
    }
  }

  .edit-industry-area {
    .v-list-item__content {
      overflow: visible;

      &:first-of-type {
        padding-bottom: 0 !important;
      }
    }

    .v-text-field__details {
      position: absolute;
      left: 0;
      bottom: -23px;
    }

    &:last-child {
      .v-list-item__content {
        //margin-bottom: 100px;
      }
    }
  }

  .date-picker {
    .v-input__slot {
      box-shadow: unset !important;
      border: 1px solid rgba(0, 0, 0, 0.24);
      border-radius: 4px;
      text-align: center;

      input {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.54);
        padding-left: 50px !important;
        padding-top: 8px !important;
      }

      label {
        padding-top: 0 !important;
      }
    }

    .v-input__slot::after,
    .v-input__slot::before {
      display: none;
    }
  }

  .date-col {
    position: relative;

    @media only screen and (max-width: 1025px) {
      width: 35% !important;
      max-width: 35% !important;
      padding: 0 !important;
    }
  }

  .date-icon {
    top: 12px;
    left: 25px;
    position: absolute;
    font-size: 18px !important;
    z-index: 99;
  }

  .date-to {
    position: absolute;
    left: 0;
    top: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    z-index: 13;
  }

  .underlined-warn {
    border-bottom: 1px solid #f56c6c;
    color: inherit;

    .icon {
      color: #f56c6c !important;
      font-size: 24px !important;
      text-decoration: none !important;
      margin-left: 20px;
      margin-bottom: 7px;
    }
  }

  .post-wrapper {
    max-width: 696px;
  }

  .select-error {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #d0021b;
    margin-left: 8px;
    margin-top: 17px;
  }

  .select-row-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 24px;

    .select-row-inline {
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 40%;

      .file-type-wrap {
        display: flex;
      }
    }
  }

  .email-name {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .email-icon {
    font-size: 19px !important;
    padding-right: 24px;
  }

  .email-type {
    height: 25px;
    border-radius: 4px;
    background-color: #f56c6c;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 6px;
  }

  .email-time {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .edit-name-textfield,
  .edit-description,
  .edit-select {
    font-size: 13px !important;
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .preview-header {
    margin-top: 32px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
      width: max-content;
    }

    .header-info {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 43px;
      border-bottom: 1px solid #b3d4fc;
    }
  }

  .preview-body {
    margin-top: 24px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    border-bottom: 1px solid #b3d4fc;
    position: relative;
    padding-bottom: 24px;
    min-height: auto;
    overflow: auto;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
    }

    .company-img {
      display: flex;
      position: absolute;
      right: 0;
      top: 20px;
      width: 84px;
      height: 84px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .first-date {
    .v-input__slot {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-right: none !important;

      label {
        padding-left: 65px !important;
      }
    }
  }

  .sec-date {
    .v-input__slot {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border-left: none !important;

      label {
        padding-left: 60px !important;
      }
    }
  }

  .date-picker {
    font-family: 'Open Sans', sans-serif !important;

    .v-input__slot {
      box-shadow: unset !important;
      border: 1px solid rgba(0, 0, 0, 0.24);
      border-radius: 4px;
      text-align: center;

      input {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.54);
        padding-left: 50px !important;
        padding-top: 8px !important;
      }

      label {
        padding-top: 0 !important;
      }
    }

    .v-input__slot::after,
    .v-input__slot::before {
      display: none;
    }
  }

  .date-col {
    position: relative;
  }

  .date-icon {
    top: 12px;
    left: 25px;
    position: absolute;
    font-size: 18px !important;
    z-index: 99;
  }

  .date-to {
    position: absolute;
    left: 0;
    top: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    z-index: 13;
  }

  .max-char {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    max-width: 100%;
  }

  .text-selected {
    border-radius: 1px !important;
    background-color: #d1e9fc !important;
    border-bottom: 1px solid #2196f3 !important;
    color: rgba(0, 0, 0, 0.87) !important;
    width: max-content;
  }

  .clean-link {
    padding: 0 2px !important;
    border-radius: 1px !important;
    border-bottom: 1px solid #2196f3 !important;
    color: #2196f3 !important;
  }

  .selected-link {
    background-color: #d1e9fc !important;
  }

  .phishing-link {
    background-color: #f3e1e5 !important;
    border-bottom: 1px solid #bb2a45 !important;
    color: #bb2a45 !important;
    width: max-content;
  }

  .clean-attach {
    background-color: #f1f8fe;
    border: 1px solid transparent !important;
  }

  .malicious-attach {
    background-color: #f3e1e5;
    border: 1px solid transparent !important;
  }

  .v-input > .v-input__control > .v-text-field__details {
    // error messages.
  }

  .v-application input {
    border-radius: 8px !important;
    border: solid 1px rgba(0, 0, 0, 0.16) !important;
  }

  .required {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #474747;
    margin-left: 6px;
    margin-top: -2px;
  }

  .close-incident {
    position: absolute;
    right: -13px;
    top: 13px;
  }

  .affect-input.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
    border: none !important;
  }

  .row-with-icon {
    align-items: center;
    display: flex;
    flex-direction: row;
  }

  .icon-btn {
    margin-top: unset;
    margin-left: -5px;
    height: 25px !important;
    width: 25px !important;
  }

  .step-name {
    width: max-content;
  }

  .filter-header {
    align-items: center;
    display: none;
    justify-content: space-between;
    padding-top: 24px;
    width: 240px;
    transition: all 0.3s ease-in-out;

    .select-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      transition: all 0.3s ease-in-out;
    }

    i {
      margin-top: 3px;
      font-size: 27px;
    }
  }

  .minify-filter {
    width: 120px !important;
  }

  .minify-part,
  .minify-switch {
    padding-left: 10px;
    width: 100% !important;
  }

  // Email Preview css
  .preview-header {
    margin-top: 24px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
      width: 100%;
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-height: 80px;
    }

    .header-info {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .preview-body {
    margin-top: 24px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    border-bottom: 1px solid #b3d4fc;
    position: relative;
    padding-bottom: 24px;
    min-height: auto;
    max-height: 500px;
    overflow: auto;

    .company-img {
      display: flex;
      position: absolute;
      right: 0;
      top: 20px;
      width: 84px;
      height: 84px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .bodyExpanded {
    height: 100% !important;
    max-height: 100% !important;
    padding-bottom: 56px;
  }

  .preview-footer {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
    }

    .attachment-wrapper {
      display: flex;
      flex-direction: row;

      .attachment {
        width: 182px;
        height: 32px;
        align-items: center;
        display: flex;
        flex-direction: row;
        margin-right: 16px;

        .attach-icon {
          min-width: 40px;
          height: 32px;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .red-icon {
          background-color: #bb2a45 !important;
        }

        .blue-icon {
          background-color: #2196f3 !important;
        }

        span {
          width: 100%;
          text-align: center;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.58;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .red-attach {
        background-color: #f3e1e5;
      }

      .blue-attach {
        background-color: #f1f8fe;
      }
    }
  }

  .preview-buttons {
    margin-top: 24px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;

    .v-btn {
      border-radius: 18px !important;
      border: solid 1px #909399;
      box-shadow: unset !important;
      background-color: #fff !important;
      margin-right: 16px;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.87);
      padding-left: 16px !important;

      .v-icon {
        color: #909399;
        font-size: 19px !important;
        margin-right: 8px;
        margin-top: 1px;
        border: unset !important;
      }
    }

    .active-act {
      color: #2196f3 !important;
      border: solid 1px #2196f3 !important;
    }
  }

  .preview-border {
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;
  }

  // Details css
  .detail-parts:first-child {
    margin-top: 24px !important;
  }

  .detail-parts {
    margin-top: 16px;

    .detail-black {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 4px !important;
    }

    .detail-red {
      color: rgba(219, 37, 37, 0.87) !important;
    }
  }

  .detail-discovery {
    margin-top: 24px;

    .disc-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 8px;
    }

    .discovery-p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .impact-row {
    display: flex;
    flex-direction: row;
    padding-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    .impact-left {
      min-width: 100px;
      font-weight: 600 !important;
    }

    .impact-right {
      margin-top: 2px;
      max-width: 80%;
    }
  }

  .border-padding {
    padding-bottom: 8px;
    border-bottom: 1px solid #b3d4fc;
  }

  .member-company-body {
    .v-slide-group__content {
      border-bottom: unset !important;
    }
  }

  .expand-contaniner {
    width: 100%;
    height: 50px;
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    bottom: 0;
    background-image: linear-gradient(to bottom, transparent, #fff 50%);

    button,
    .v-btn:not(.v-btn--round).v-size--default {
      width: auto !important;
      height: 24px !important;
      border-radius: 12px !important;
      background-color: #409eff !important;
      box-shadow: unset !important;
      color: #fff;
      text-transform: capitalize !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      padding-left: 13px !important;

      i {
        width: 18px !important;
      }
    }
  }

  .opacityExpanded {
    background-image: none !important;
  }

  .preview-comments {
    height: 0;
    opacity: 0;
    transition: max-height 0.25s ease-in;
    overflow: hidden;

    .comment-row {
      display: flex;
      flex-direction: row;
      padding-top: 6px;

      .comment-input {
        margin-top: 3px;
        margin-right: 16px;

        .v-input__slot {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 13px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.54);
          padding-left: 24px !important;
          max-height: 70px;
          min-height: 40px;

          textarea {
            max-height: 70px;
            overflow: auto;
            margin-bottom: 5px;
            margin-top: 2px;
            margin-right: 2px;
          }

          label {
            top: 10px;
          }

          fieldset {
            padding-left: 18px !important;
          }
        }
      }

      .send-btn {
        border-radius: 18px !important;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
        background-color: #2196f3 !important;
        color: #fff !important;
        height: 36px !important;
        margin-top: 5px;

        i {
          font-size: 18px !important;
          padding-right: 8px;
        }
      }
    }

    .comment-row {
      border-radius: 4px;
      background-color: #f5f7fa;
      display: flex;
      padding: 16px;
      margin-bottom: 8px;

      .user-wrapper {
        .username,
        .company-name {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #2196f3;
          padding-right: 4px;
          cursor: pointer;
        }

        .company-name {
          padding-left: 4px;
        }
      }

      .the-comment {
        margin-bottom: 0 !important;
        padding-top: 8px !important;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .see-all-comments {
      padding-top: 16px;
      padding-bottom: 24px;

      span {
        text-decoration: none;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        cursor: pointer;
      }
    }
  }

  .open-comments {
    min-height: 226px;
    height: auto !important;
    transition: max-height 0.25s ease-in;
    padding-bottom: 24px;
    opacity: 1;
    z-index: -5;
  }

  .add-comment {
    background-color: #fff !important;
    height: 60px;
    padding: 0 !important;
  }

  .unselected-warn {
    border-bottom: 1px solid #bb2a45;
    color: #bb2a45;
    padding: 0 2px !important;
  }

  .hide-buttons {
    opacity: 0;
    padding: 0 !important;
    height: 20px !important;
  }

  .display-none {
    display: none !important;
  }

  .tooltip-wrapper {
    max-width: 250px;
    width: 130px;
    height: 50px;
    border-radius: 4px;
    background-color: #6d6d6d;
    position: absolute;
    top: -55px;
    left: -35px;
    border-radius: 4px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
    padding: 8px;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 34px;
    }

    span {
      color: rgba(255, 255, 255, 0.87) !important;
      font-size: 12px !important;
      line-height: 1.33 !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400;
    }

    span:nth-child(2) {
      padding-top: 4px;
    }
  }

  // Threat sharing Content
  .threat-sharing-content {
    min-height: 200px;
    width: 100%;
    padding: 24px !important;
    background-color: #ffffff;
    border-radius: 20px !important;

    @media only screen and (max-width: 500px) {
      padding: 16px !important;
    }
  }

  .ts-header {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .ts-header-btn-1 {
    display: flex;
  }

  .ts-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    max-width: 79%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  // Threat sharing Content End

  .notification-wrapper {
    background-color: #fff;
    padding: 0;
  }

  .v-menu__content {
    border-radius: 8px !important;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

    .v-list-item {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    .v-list-item__title {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--black-87);
    }
  }

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .ts-user-comp-detail {
    align-items: center;
    display: flex;
    margin-top: 8px;
  }

  .v-btn--contained {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
  }

  .v-data-footer {
    margin-top: 24px !important;
  }

  .v-data-footer__select {
    .v-text-field > .v-input__control > .v-input__slot:after {
      border: none !important;
      display: none !important;
    }

    .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border: none !important;
    }

    .v-input__append-inner {
      margin-left: 0 !important;
      margin-top: 3px !important;
      margin-right: 5px !important;
      padding-left: 0 !important;
    }

    .v-input__icon {
      width: 20px !important;
      min-width: 20px !important;
      height: 20px !important;
    }
  }

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
    margin-left: 4px;
    width: 36px !important;
  }

  .ts-tags {
    align-items: center;
    display: flex;
    flex-direction: row;
    max-width: max-content;

    > .tag-btn,
    > div > .tag-btn {
      border-radius: 18px;
      border: solid 1.5px #c0c4cc;
      background-color: #fff;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
      height: 32px !important;
    }
  }

  .ts-footer {
    align-items: center;
    display: flex;
    margin-top: 22px;
    margin-left: 0;
    margin-right: 0;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-like {
    margin-right: 10px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-message {
    margin-right: 40px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-harmful {
    margin-right: 15px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-success {
    display: flex;
    align-items: center;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-body {
    margin-top: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-user-comp {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    a {
      text-decoration: none;
    }

    .ts-user-date {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .ts-action-counter {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .ts-actions {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-left: 3px;
  }

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .tab-bar {
    width: 100%;
    height: 48px;
    padding: 0;
    background-color: #f5f7fa;
    border-radius: 0 !important;

    .v-slide-group__wrapper {
      padding-left: 0 !important;
    }

    .v-slide-group__content {
      margin-right: 0 !important;
    }

    .v-tab--active {
      color: #2196f3 !important;
    }

    .v-tab {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center !important;
      margin-right: 32px !important;
      padding: 0 !important;
      padding-right: 3px !important;
      min-width: auto !important;
    }

    .v-tabs-bar {
      padding: 0 24px;
      height: 48px !important;
      border-radius: 0 !important;
    }
  }

  .v-window {
    border-radius: 20px !important;
    margin: 0 24px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .title-field {
    .v-text-field__details {
      margin-bottom: 0 !important;
    }
  }

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 8px;
  }

  .disabled-cursor,
  button:disabled {
    cursor: no-drop !important;
    pointer-events: all !important;
  }

  .file-name {
    padding-left: 7px;
  }

  #upload-file-input {
    opacity: 0;
    position: absolute;
  }

  input[type=file], /* FF, IE7+, chrome (except button) */
    input[type=file]::-webkit-file-upload-button {
    /* chromes and blink button */
    cursor: pointer !important;
  }

  @media only screen and (max-width: 1025px) {
    .hide-step {
      display: none !important;
    }
    .filter-header {
      display: flex;
    }
  }

  .display-none {
    display: none !important;
  }

  #share-settings-links {
    display: block;
  }

  .chevron-down {
    transition: 0.3s all ease-in-out;
    transform: rotate(180deg);

    i {
      text-decoration: none !important;
    }
  }

  .mal-list-wrapper {
    .mal-list-row {
      align-items: center;
      display: flex;
      flex-direction: row;

      .mal-icon-wrapper {
        height: 35px;
        width: 35px;
        padding-top: 5px;
      }
    }
  }

  .mal-list-wrapper:hover,
  .mal-list-wrapper:active,
  .mal-list-wrapper:focus {
    background-color: #f2f2f2;
    transition: all 0.2s ease-in-out;
  }

  .malicious-style {
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;
    color: #bb2a45 !important;

    text-decoration: none !important;
    border-bottom: 1px solid;
    position: relative;
    text-indent: 0;

    .share-setting-text {
      text-decoration: none !important;
      text-decoration-color: transparent !important;
      text-decoration-style: unset !important;
      border: none !important;
      border-bottom: transparent !important;
      border-bottom-color: transparent !important;
      border-image: none !important;
      border-image-width: 0 !important;
    }
  }

  .v-btn--icon.v-size--default.chevron-btn-menu {
    height: 20px !important;
    width: 20px !important;

    i {
      height: 20px !important;
      width: 20px !important;
    }
  }
}
.new-investigation-footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .cancel-btn {
    background-color: transparent !important;
    border-radius: 18px !important;
    border: solid 1px #f56c6c !important;
    color: #f56c6c !important;
  }

  .create-btn {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    background-color: #2196f3 !important;
    color: #fff !important;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }
}
.checkbox-error {
  left: 3px !important;
  bottom: -3px !important;
  .v-messages__message {
    font-size: 9px !important;
  }
  .new-investigation__combo {
    .v-chip__content {
      overflow: initial !important;
      display: inline-flex !important;
    }
  }
}
.bounce-enter-active {
  animation: bounce 0.5s;
}
@keyframes bounce {
  0% {
    transform: translateY(-10px);
  }

  100% {
    transform: translate(0, 0);
  }
}
.date-picker-container {
  .el-date-editor {
    border: 1px solid #ff5252 !important;
  }
}
</style>
