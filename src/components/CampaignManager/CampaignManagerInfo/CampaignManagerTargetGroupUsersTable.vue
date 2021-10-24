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
        :refName="'campaignManagerTargetGroupUsersTable'"
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
const axiosPayload = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'CreateTime',
  ascending: false,
  filter: {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'AND',
        FilterItems: [],
        FilterGroups: []
      },
      {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
    ]
  }
}
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
    }
  },
  data() {
    return {
      axiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
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
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
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
  watch: {
    resourceId() {
      this.callForData()
    }
  },
  computed: {
    getLoadingStatus() {
      return this.isTargetGroupLoading || this.isLoading
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
<style lang="scss">
#campaign-manager-target-group-users-data-table.k-table__wrapper {
  padding-bottom: 0;
  .table-wrapper {
    padding-top: 0;
  }

  .card .pagination {
    padding: 12px 0;
  }

  .card .table-wrapper .selection-row {
    top: 1px;
  }
}
.campaign-manager-target-user-groups-header {
  background-color: #f2f2f2;
  display: flex;
  color: #383b41;
  padding: 16px 6px;
  align-items: center;
  padding-left: 20px;
  &__text {
    font-size: 14px;
    line-height: 21px;
    margin-left: 8px;
    font-weight: 600;
  }
  &__badge {
    font-weight: 600;
    font-size: 12px;
    padding: 4px 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-left: 8px;
  }
}
</style>
