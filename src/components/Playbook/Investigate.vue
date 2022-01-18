<template>
  <div :id="`card--playbook-action-investigate-${getParentIndex}`">
    <v-row align="center" class="mb-4 mt-n3">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label :id="`text--playbook-investigate-target-users-title-${getParentIndex}`"
              >Target users</label
            >
            <v-list-item-title
              :id="`text--playbook-investigate-target-users-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
              Select departments, groups or users to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="6">
        <div class="target-users-select__radio-group mb-2">
          <v-radio-group
            v-model="investigateData.targetUserType"
            :id="`input--action-investigate-target-user-type${getParentIndex}`"
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
            :id="`input--action-investigate-target-users-${getParentIndex}`"
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
            v-if="investigateData.targetUserType === 'Groups'"
            v-infinite-scroll="{
              target: `#input--action-investigate-target-user-type${getParentIndex} .k-select__menu`,
              callback: callForTargetGroups
            }"
            v-select-search-handler="{
              callback: callForSearchTargetGroups,
              isLoadingKey: 'isUserGroupsLoading'
            }"
            type="autocomplete"
            key="groups"
            :items="userGroupsItems"
            :placeholder="
              investigateData.targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
            "
            outlined
            :id="`input--action-investigate-target-user-type${getParentIndex}`"
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
            :no-data-text="isUserGroupsLoading ? 'Loading...' : 'No user group available'"
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
                    return item.resourceId === data.item.resourceId
                  }).name
                }}
                <v-icon
                  right
                  @click="data.parent.selectItem(data.item.resourceId)"
                  style="font-size: 18px;"
                  >mdi-close-circle</v-icon
                >
              </v-chip>
            </template>
          </k-select>
          <k-select
            v-if="investigateData.targetUserType === 'SpecificUsers'"
            v-infinite-scroll="{
              target: `#input--action-investigate-target-user-type${getParentIndex} .k-select__menu`,
              callback: callForTargetUsers
            }"
            v-select-search-handler="{
              callback: callForSearchTargetUsers,
              isLoadingKey: 'isTargetUsersLoading'
            }"
            v-model="investigateData.targetUsers"
            :id="`input--action-investigate-target-user-type${getParentIndex}`"
            type="autocomplete"
            key="users"
            :items="specificUserItems"
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
            hide-details
          ></k-select>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label :id="`text--playbook-investigate-filters-${getParentIndex}`">Filters</label>
            <v-list-item-title
              :id="`text--playbook-investigate-filters-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
              Select attributes of the email to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <k-select
          v-model="investigateData.filters"
          :id="`input--action-investigate-filters-${getParentIndex}`"
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
            <label :id="`text--playbook-investigate-email-date-range-title-${getParentIndex}`"
              >Email Date Range</label
            >
            <v-list-item-title
              :id="`text--playbook-investigate-email-date-range-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
              Select range of emails sending date according to email received date
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <k-select
          v-model="investigateData.emailDateRangeType"
          :id="`input--action-investigate-ranges-${getParentIndex}`"
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
            <label :id="`text--playbook-investigate-select-sources-title-${getParentIndex}`"
              >Select Sources</label
            >
            <v-list-item-title
              :id="`text--playbook-investigate-select-sources-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
              Select sources to investigate with conditions above
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="6">
        <MailConfigurationSelectSources v-model="scanTypes" />
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label :id="`text--playbook-investigate-duration-title-${getParentIndex}`"
              >Duration</label
            >
            <v-list-item-title
              :id="`text--playbook-investigate-duration-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
              Select how many days the investigation will run
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="3">
        <k-select
          v-model="investigateData.durationType"
          :id="`input--action-investigate-sources-${getParentIndex}-${index}`"
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
            <label :id="`text--playbook-investigate-actions-title-${getParentIndex}`"
              >Actions</label
            >
            <v-list-item-title
              :id="`text--playbook-investigate-actions-subtitle-${getParentIndex}`"
              class="v-card-sub-header bottom-margin"
            >
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
              :id="`input--action-investigate-auto-action-type-${getParentIndex}`"
              :items="act.investigateActions"
              outlined
              hide-details
              :position="'top'"
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
              :id="`input--action-investigate-auto-action-warning-${getParentIndex}`"
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
import { required, minLength, maxLength } from '@/utils/validations'
import { mapGetters } from 'vuex'
import { getTargetUsers, getTargetUsersByEmail, searchTargetGroups } from '@/api/targetUsers'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import MailConfigurationSelectSources from '@/components/Common/Others/MailConfigurationSelectSources'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
export default {
  name: 'Investigate',
  components: { MailConfigurationSelectSources, KSelect },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
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
          scanTypes: [],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTemplateId: 1,
          durationType: 'ThreeDays',
          emailDateRangeType: 'ThreeDays'
        }
      }
    }
  },
  data() {
    return {
      targetGroupsAxiosPayload: getDefaultAxiosPayload(),
      targetUsersAxiosPayload: getDefaultAxiosPayload(),
      totalNumberOfPagesOfTargetUsers: 1,
      totalNumberOfPagesOfTargetGroups: 1,
      labels,
      filters: ['URLs', 'Attachments'],
      investigationRange: 3,
      investigationDuration: 3,
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      investigateActionMessage: null,
      targetUsersValue: [],
      timeout: null,
      targetUserType: 'AllUsers',
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
      isUserGroupsLoading: false,
      searchUser: ''
    }
  },
  computed: {
    ...mapGetters({
      targetUsersList: 'investigations/getTargetUsersListGetter' // for using getters
    }),
    getParentIndex() {
      return this.index
    }
  },
  watch: {
    'investigateData.autoAction.type'(newValue, oldValue) {
      if (newValue !== oldValue) {
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
    scanTypes(newVal) {
      this.investigateData.scanTypes = newVal.map((item) => {
        const { type, mailConfigurationResourceId } = item
        return { type, mailConfigurationResourceId }
      })
    }
  },
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
      console.log('this.userGroupsItems', this.userGroupsItems)
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
      this.specificUserItems = [...this.specificUserItems, ...data.results]
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
    this.callForTargetGroups()
    this.callForTargetUsers()
    this.scanTypes = JSON.parse(JSON.stringify(this.investigateData.scanTypes))
  }
}
</script>
