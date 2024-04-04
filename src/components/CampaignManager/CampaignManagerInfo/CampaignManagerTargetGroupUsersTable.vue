<template>
  <div>
    <div
      v-if="!isLoading && !isTargetGroupEmpty && !isTargetGroupLoading"
      class="campaign-manager-target-user-groups-header"
    >
      <div>
        <v-icon color="#000000">mdi-account-multiple</v-icon>
        <span class="campaign-manager-target-user-groups-header__text">{{ groupName }}</span>
      </div>
      <div>
        <span class="campaign-manager-target-user-groups-header__badge"
          >Total {{ totalUserCount }} users:
          <span class="campaign-manager-target-user-groups-header__active-and-inactive-users">{{
            getActiveAndInactiveUserCountText
          }}</span></span
        >
      </div>
      <AlertBox
        v-if="canRenderAlertbox"
        :text="getUnverifiedDomainsText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderPhoneNumberAlertBox"
        :text="getPhoneNumberWarningText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderPhoneNumberAwarenessAlertBox"
        :text="getAwarenessPhoneNumberWarningText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
    </div>
    <div>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        is-server-side
        :showPagination="false"
        :loading="getLoadingStatus"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :add-row-class-name="addRowClassName"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import { getTargetGroupCountDetail, searchTargetGroupUsers } from '@/api/targetUsers'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { cancellableAxiosRequest, getDefaultAxiosPayload } from '@/utils/functions'
import AlertBox from '@/components//AlertBox'

export default {
  name: 'CampaignManagerTargetGroupUsersTable',
  components: { DataTable, AlertBox },
  props: {
    resourceId: {
      type: String
    },
    groupName: {
      type: String
    },
    isTargetGroupEmpty: {
      type: Boolean
    },
    isTargetGroupLoading: {
      type: Boolean
    },
    lastColumnName: {
      type: String,
      default: 'email'
    },
    addRowClassName: {
      type: Function
    },
    isVishing: {
      type: Boolean,
      default: false
    },
    isSmishing: {
      type: Boolean,
      default: false
    },
    isAwareness: {
      type: Boolean,
      default: false
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    },
    addPhoneNumberColumn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload(),
      totalUserCount: 0,
      activeUserCount: 0,
      activeUsersWithPhoneNumberCount: 0,
      activeUsersWithoutPhoneNumberCount: 0,
      inactiveUserCount: 0,
      usersFromUnverifiedDomainsCount: 0,
      CONSTANTS: {
        id: 'campaign-manager-target-group-users-data-table',
        ascending: 'ascending'
      },
      isLoading: false,
      tableData: [],
      tableOptions: {
        iEmpty: {
          message: labels.EmptyTargetUsersPeople,
          id: 'btn-empty--target-users-people'
        },
        columns: this.getColumns()
      }
    }
  },
  computed: {
    getActiveAndInactiveUserCountText() {
      let text = ''
      if (this.isVishing) {
        if (!!this.activeUsersWithPhoneNumberCount) {
          text += `${this.activeUsersWithPhoneNumberCount} active`
        }
      } else {
        if (!!this.activeUserCount) {
          text += `${this.activeUserCount} active`
        }
      }

      if (text !== '' && !!this.inactiveUserCount) {
        text += ', '
      }

      if (!!this.inactiveUserCount) {
        text += `${this.inactiveUserCount} inactive`
      }

      return text
    },
    getLoadingStatus() {
      return this.isTargetGroupLoading || this.isLoading
    },
    canRenderAlertbox() {
      if (this.isAwareness) return false
      return this.usersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    canRenderPhoneNumberAlertBox() {
      if (this.isAwareness) return false
      return this.activeUsersWithoutPhoneNumberCount > 0 && this.isMFAScenarioSelected
    },
    canRenderPhoneNumberAwarenessAlertBox() {
      return this.activeUsersWithoutPhoneNumberCount > 0 && this.isAwareness
    },
    getUnverifiedDomainsText() {
      return `There ${this.usersFromUnverifiedDomainsCount > 1 ? 'are' : 'is'} ${
        this.usersFromUnverifiedDomainsCount
      } active user${
        this.usersFromUnverifiedDomainsCount > 1 ? 's' : ''
      } with unverified domains in this group. Please verify the domains in order to send emails.`
    },
    getPhoneNumberWarningText() {
      return `There ${this.activeUsersWithPhoneNumberCount > 1 ? 'are' : 'is'} ${
        this.activeUsersWithPhoneNumberCount
      } active user${this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''} with phone number${
        this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''
      } and ${this.activeUsersWithoutPhoneNumberCount} active user${
        this.activeUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } without phone number${
        this.activeUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } in this group. Only the ${this.activeUsersWithPhoneNumberCount} user${
        this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''
      } with phone number${
        this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''
      } will receive MFA scenario.`
    },
    getAwarenessPhoneNumberWarningText() {
      return `There ${this.activeUsersWithPhoneNumberCount > 1 ? 'are' : 'is'} ${
        this.activeUsersWithPhoneNumberCount
      } active user${this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''} with phone numbers and ${
        this.activeUsersWithoutPhoneNumberCount
      } active users without phone numbers in this group. Only the ${
        this.activeUsersWithPhoneNumberCount
      } user${
        this.activeUsersWithPhoneNumberCount > 1 ? 's' : ''
      } with phone numbers will receive training email and SMS.`
    }
  },
  watch: {
    isMFAScenarioSelected: {
      immediate: true,
      handler(val) {
        if (this.isSmishing || this.isVishing) return
        if (val) {
          this.tableOptions.columns.push({
            property: 'phoneNumber',
            align: 'left',
            editable: false,
            label: 'Phone Number',
            sortable: true,
            show: true,
            width: 150,
            type: 'text',
            overrideWidth: true,
            hideSort: true
          })
        } else {
          const phoneNumberColumnIndex = this.tableOptions.columns.findIndex(
            (column) => column.property === 'phoneNumber'
          )
          if (phoneNumberColumnIndex !== -1) {
            this.tableOptions.columns.splice(phoneNumberColumnIndex, 1)
          }
        }
      }
    },
    resourceId() {
      this.callForData()
    },
    addPhoneNumberColumn() {
      this.tableOptions.columns = this.getColumns()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getColumns() {
      const columns = [
        {
          property: PROPERTY_STORE.FIRSTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          hideSort: true
        },
        {
          property: PROPERTY_STORE.LASTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LASTNAME),
          sortable: true,
          show: true,
          type: 'text',
          hideSort: true
        },
        {
          property: this.lastColumnName,
          align: 'left',
          editable: false,
          label: this.lastColumnName === 'email' ? 'Email' : 'Phone Number',
          sortable: true,
          show: true,
          type: 'text',
          overrideWidth: true,
          hideSort: true
        }
      ]
      if (this.addPhoneNumberColumn) {
        columns.push({
          property: 'phoneNumber',
          align: 'left',
          editable: false,
          label: 'Phone Number',
          sortable: true,
          show: true,
          type: 'text',
          width: 200,
          overrideWidth: true,
          hideSort: true
        })
      }
      return columns
    },
    cancellableSearchTargetGroupUsers: cancellableAxiosRequest(searchTargetGroupUsers),
    callForData() {
      if (!this.resourceId) return
      this.setLoading(true)
      this.cancellableSearchTargetGroupUsers(this.resourceId, this.axiosPayload)
        .then((response) => {
          if (!Object.keys(response).length) return
          const {
            data: { data }
          } = response
          this.tableData = data.results || []
        })
        .then(() => {
          getTargetGroupCountDetail([this.resourceId])
            .then((response) => {
              if (!Object.keys(response).length) return
              const {
                data: { data }
              } = response

              const activeUserCount = data.find((row) => row.status === 'Active')?.count || 0
              const activeUsersWithPhoneNumberCount =
                data
                  .find((row) => row.status === 'Active')
                  ?.hasPhoneNumber?.find((row) => row.status === 'Yes')?.count || 0
              const activeUsersWithoutPhoneNumberCount =
                data
                  .find((row) => row.status === 'Active')
                  ?.hasPhoneNumber?.find((row) => row.status === 'No')?.count || 0
              const inactiveUserCount = data.find((row) => row.status === 'Passive')?.count || 0
              const usersFromUnverifiedDomainsCount =
                data
                  .find((row) => row.status === 'Active')
                  ?.domainAllowList?.find((row) => row.status === 'Unverified')?.count || 0
              this.totalUserCount = activeUserCount + inactiveUserCount
              this.activeUserCount = activeUserCount
              this.inactiveUserCount = inactiveUserCount
              this.usersFromUnverifiedDomainsCount = usersFromUnverifiedDomainsCount
              this.activeUsersWithPhoneNumberCount = activeUsersWithPhoneNumberCount
              this.activeUsersWithoutPhoneNumberCount = activeUsersWithoutPhoneNumberCount
              this.setLoading(false)
            })
            .catch(() => {
              this.setLoading(false)
            })
        })
    },
    setLoading(flag = false) {
      this.isLoading = flag
    }
  }
}
</script>
