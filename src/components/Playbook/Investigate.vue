<template>
  <div>
    <v-row align="center" class="mb-4 mt-n3">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Target users</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select departments, groups or users to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="6">
        <div class="target-users-select__radio-group mb-2">
          <v-radio-group
            v-model="investigateData.targetUserType"
            :mandatory="false"
            @change="handleRadioGroup"
            row
            hide-details
          >
            <v-radio value="AllUsers" label="All Users" color="#2196f3"></v-radio>
            <v-radio value="Groups" label="User Groups" color="#2196f3"></v-radio>
            <v-radio value="SpecificUsers" label="Specific Users" color="#2196f3"></v-radio>
          </v-radio-group>
        </div>
        <div class="target-users-select__input-area">
          <v-combobox
            :items="[]"
            :placeholder="
              investigateData.targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
            "
            outlined
            class="edit-select standard-height"
            item-text="name"
            v-model="investigateData.targetUsers"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="false"
            v-if="investigateData.targetUserType === 'AllUsers'"
            :disabled="investigateData.targetUserType === 'AllUsers'"
            hide-details
            required
          ></v-combobox>
          <v-combobox
            :items="userGroupsItems"
            :placeholder="
              investigateData.targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
            "
            outlined
            v-model="investigateData.targetUsers"
            :search-input.sync="searchUserGroup"
            class="edit-select target-users-select-multi"
            :rules="[(v) => v.length > 0 || 'Required']"
            item-text="name"
            item-value="resourceId"
            multiple
            persistent-hint
            small-chips
            deletable-chips
            auto-select-first
            :return-object="false"
            autocomplete="off"
            v-if="investigateData.targetUserType === 'Groups'"
            hide-details
          >
            <template v-slot:selection="data" v-if="userGroupsItems.length > 0">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                small
              >
                {{
                  userGroupsItems.find((item) => {
                    return item.resourceId === data.item
                  }).name
                }}
                <v-icon right @click="data.parent.selectItem(data.item)" style="font-size: 18px;"
                  >mdi-close-circle</v-icon
                >
              </v-chip>
            </template>
          </v-combobox>
          <v-combobox
            :items="specificUserItems"
            v-if="investigateData.targetUserType === 'SpecificUsers'"
            placeholder="Enter Email Addresses"
            item-text="email"
            item-value="email"
            multiple
            dense
            persistent-hint
            deletable-chips
            small-chips
            :search-input.sync="searchUser"
            auto-select-first
            :return-object="false"
            :rules="[(v) => v.length > 0 || 'Required']"
            required
            outlined
            autocomplete="disabled"
            class="edit-name-textfield edit-select target-users-select__specific-user-input target-users-select-multi"
            v-model="investigateData.targetUsers"
            hide-details
          ></v-combobox>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Filters</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select attributes of the email to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <v-select
          v-model="investigateData.filters"
          :items="act.investigateFilters"
          placeholder="Select Filters"
          outlined
          hide-details
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Email Date Range</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select range of emails sending date according to reporting date
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <v-select
          v-model="investigationRange"
          :items="act.investigateRanges"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Select Sources</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select sources to investigate with conditions above
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="6">
        <div class="select-sources d-flex">
          <v-checkbox
            class="v-input--checkbox"
            v-model="investigateData.scanTypes"
            label="Outlook Desktop"
            value="Outlook"
            color="#2196f3"
            v-if="scanTypes.includes('Outlook')"
          />
          <v-checkbox
            class="v-input--checkbox ml-3"
            v-model="investigateData.scanTypes"
            label="Office 365"
            value="O365"
            color="#2196f3"
            v-if="scanTypes.includes('O365')"
          />
          <v-checkbox
            class="v-input--checkbox ml-3"
            v-model="investigateData.scanTypes"
            label="GSuite"
            value="GSuite"
            color="#2196f3"
            v-if="scanTypes.includes('GSuite')"
          />
          <v-checkbox
            class="v-input--checkbox ml-3"
            v-model="investigateData.scanTypes"
            label="Exchange"
            value="Exchange"
            color="#2196f3"
            v-if="scanTypes.includes('Exchange')"
          />
        </div>
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Duration</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select how many days the investigation will run
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <v-select
          v-model="investigationDuration"
          :items="act.investigateDurations"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Actions</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select action to be executed if email is found
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="6">
        <v-row>
          <v-col>
            <v-select
              v-model="investigateData.actionType"
              :items="act.investigateActions"
              outlined
              hide-details
            />
          </v-col>
          <v-col v-if="investigateData.actionType === 'Notify'">
            <v-select
              v-model="investigateData.actionNotifyTargetUserType"
              :items="act.investigateActionNotifications"
              outlined
              hide-details
            />
          </v-col>
          <v-col
            style="padding-right: 0 !important ;"
            v-if="investigateData.actionType === 'Notify'"
          >
            <v-select
              v-model="investigateActionNotificationTemplate"
              :items="act.notifyTemplates"
              item-text="label"
              item-value="value"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required } from '../../utils/validations'
import { mapGetters } from 'vuex'
import {
  getTargetGroups,
  getTargetGroupsByName,
  getTargetUsersByEmail
} from '../../api/targetUsers'
import { getInvestigationScanTypes } from '@/api/investigations'
export default {
  name: 'Investigate',
  props: {
    act: {
      type: Object
    },
    index: {
      type: Number
    },
    isCreatedByAnalyzer: {
      type: Boolean
    },
    investigateData: {
      type: Object,
      default: () => {
        return {
          isCreatedByAnalyzer: false,
          scanTypes: ['Outlook'],
          filters: [],
          expireDate: new Date(new Date().setDate(new Date().getDate() + 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0],
          startDate: new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0],
          endDate: new Date(new Date().setDate(new Date().getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'Notify',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTemplateId: 1
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      targetUsersList: 'investigations/getTargetUsersListGetter' // for using getters
    })
  },
  watch: {
    investigationRange(val) {
      let date = new Date()
      switch (val) {
        case this.act.investigateRanges[0].value:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          date = new Date()
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[1].value:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          date = new Date()
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[2].value:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          date = new Date()
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[3].value:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 14))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          date = new Date()
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 14))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        default:
          break
      }
    },
    investigationDuration(val) {},
    investigateData(val) {
      /*
      let date = new Date()
      switch (val) {
        case this.act.investigateDurations[0].value:
          date = new Date()
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateDurations[1].value:
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateDurations[2].value:
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        default:
          break
      }

       */
    },
    searchUserGroup(val) {
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
    searchUser(val) {
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
  beforeDestroy() {},
  data() {
    return {
      filters: ['URLs', 'Attachments'],
      investigationRange: 3,
      expireDate: '',
      startDate: '',
      endDate: '',
      investigationDuration: 3,
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      targetUsersValue: [],
      defaultUserGroupItems: [],
      timeout: null,
      targetUserType: 'AllUsers',
      validations: {
        required
      },
      scanTypes: [],
      targetUsers: {
        required: (v) =>
          (!!v && v.length > 0) || 'Target users required for creating a investigation'
      },
      searchUserGroup: '',
      userGroupsItems: [],
      specificUserItems: [],
      searchUser: '',
      defaultSpecificUserItems: []
    }
  },
  methods: {
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
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    handleRadioGroup() {
      this.investigateData.targetUsers = []
      this.$forceUpdate()
    }
  },
  created() {
    getTargetGroups().then((response) => {
      this.userGroupsItems = response.data.data
      this.defaultUserGroupItems = response.data.data
    })
    getInvestigationScanTypes().then((response) => {
      this.scanTypes = response.data.data
    })
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
  }
}
</script>

<style lang="scss"></style>
