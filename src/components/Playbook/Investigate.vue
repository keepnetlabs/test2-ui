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
          <k-select
            type="combobox"
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
          />
          <k-select
            type="combobox"
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
            :slots="{ selection: true, item: false }"
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
          </k-select>
          <k-select
            type="combobox"
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
          ></k-select>
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
        <k-select
          v-model="investigateData.filters"
          :items="act.investigateFilters"
          placeholder="Select Filters"
          outlined
          hide-details
          multiple
          small-chips
          :menu-props="{ offsetY: true }"
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
              Select range of emails sending date according to email received date
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <k-select
          v-model="investigateData.emailDateRangeType"
          :items="act.investigateRanges"
          outlined
          :menu-props="{ offsetY: true }"
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
        <div class="select-sources d-flex" style="flex-wrap: wrap;">
          <v-checkbox
            v-for="(item, index) in sources"
            :key="index"
            v-model="scanTypes"
            class="v-input--checkbox mr-4"
            color="#2196f3"
            :label="item['mailConfigurationName']"
            :value="item"
          ></v-checkbox>
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
        <k-select
          v-model="investigateData.durationType"
          :items="act.investigateDurations"
          outlined
          :menu-props="{ offsetY: true }"
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
            <k-select
              v-model="investigateData.autoAction.type"
              :items="act.investigateActions"
              outlined
              hide-details
              @change="
                $forceUpdate()
                investigateData.autoAction.type === 'Delete'
                  ? (investigateData.autoAction.warningMessage = '')
                  : ''
              "
            />
          </v-col>
          <v-col v-if="investigateData.autoAction.type === 'Warning'">
            <v-text-field
              placeholder="Message"
              outlined
              dense
              no-resize
              v-model="investigateData.autoAction.warningMessage"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) =>
                  validations.maxLength(v, 300, labels.getMaxLengthMessage(labels.Message, 300)),
                (v) => validations.minLength(v, 5, labels.getMinLengthMessage(labels.Message, 5))
              ]"
            /> </v-col
          ><v-col v-if="false">
            <k-select
              v-model="investigateData.actionNotifyTargetUserType"
              :items="act.investigateActionNotifications"
              outlined
              hide-details
            />
          </v-col>
          <v-col style="padding-right: 0 !important ;" v-if="false">
            <k-select
              v-model="investigateActionNotificationTemplate"
              :items="act.notifyTemplates"
              item-text="label"
              item-value="value"
              outlined
              min-width-type="big"
              nudge-width="170"
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required, minLength, maxLength } from '../../utils/validations'
import { mapGetters } from 'vuex'
import {
  getTargetGroups,
  getTargetGroupsByName,
  getTargetUsersByEmail
} from '../../api/targetUsers'
import { getInvestigationScanTypes } from '@/api/investigations'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'

export default {
  name: 'Investigate',
  components: { KSelect },
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
          scanTypes: [
            { type: 'Outlook', mailConfigurationResourceId: null, mailConfigurationName: 'Outlook' }
          ],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'Notify',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTemplateId: 1,
          durationType: 'ThreeDays',
          emailDateRangeType: 'ThreeDays'
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
    'investigateData.autoAction.type'(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$forceUpdate()
      }
    },
    investigationDuration(val) {},
    investigateData(val) {},
    'investigateData.targetUsers'(newVal) {
      if (newVal[0] === '') {
        newVal.splice(0, 1)
      }
    },
    scanTypes(newVal, oldVal) {
      this.investigateData.scanTypes = newVal.map((item) => {
        const { type, mailConfigurationResourceId } = item
        return { type, mailConfigurationResourceId }
      })
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
        }, 1000)
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
        }, 1000)
      } else {
        this.specificUserItems = this.defaultSpecificUserItems
      }
    }
  },
  beforeDestroy() {},
  data() {
    return {
      labels,
      filters: ['URLs', 'Attachments'],
      investigationRange: 3,
      investigationDuration: 3,
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      investigateActionMessage: null,
      targetUsersValue: [],
      defaultUserGroupItems: [],
      timeout: null,
      targetUserType: 'AllUsers',
      sources: [],
      validations: {
        required,
        minLength,
        maxLength
      },
      scanTypes: [],
      targetUsers: {
        required: (v) => (!!v && v.length > 0) || 'Required'
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
      const {
        data: { data }
      } = response
      this.sources = data.map((item) => {
        if (item.type.toLowerCase() === 'outlook') {
          item['mailConfigurationName'] = 'Outlook'
        }
        return item
      })
      this.scanTypes = JSON.parse(JSON.stringify(this.investigateData.scanTypes))
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
  },
  updated() {}
}
</script>

<style lang="scss"></style>
