<template>
  <div>
    <div
      v-if="!isLoading && !isTargetGroupEmpty && !isTargetGroupLoading"
      class="campaign-manager-target-user-groups-header"
    >
      <v-icon color="#000000">mdi-account-multiple</v-icon>
      <span class="campaign-manager-target-user-groups-header__text">{{ groupName }}</span>
      <span class="campaign-manager-target-user-groups-header__badge"
        >{{ totalUserCount }} users</span
      >
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
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import { searchTargetGroupUsers } from '@/api/targetUsers'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
export default {
  name: 'CampaignManagerTargetGroupUsersTable',
  components: { DataTable },
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
    }
  },
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload(),
      totalUserCount: 0,
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
        columns: [
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
      }
    }
  },
  computed: {
    getLoadingStatus() {
      return this.isTargetGroupLoading || this.isLoading
    }
  },
  watch: {
    resourceId() {
      this.callForData()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (!this.resourceId) return
      this.setLoading(true)
      searchTargetGroupUsers(this.resourceId, this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.totalUserCount = data.totalNumberOfRecords
          this.tableData = data.results || []
        })
        .finally(this.setLoading)
    },
    setLoading(flag = false) {
      this.isLoading = flag
    }
  }
}
</script>
