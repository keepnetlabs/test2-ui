<template>
  <app-dialog
    :status="status"
    icon="mdi-timer-sand-full"
    title="Download History"
    subtitle="Download past versions of the add-in"
    @changeStatus="$emit('changeVersionHistoryModalStatus', false)"
    :custom-size="'800'"
    maxHeightSize="665"
    class-name="matching-modal version-history"
  >
    <template v-slot:app-dialog-body>
      <v-card light>
        <DatatableLoading :loading="isLoading">
          <template v-slot:skeleton-content>
            <data-table
              :refName="'versionHistory'"
              :table="tableData"
              :columns="table.columns"
              :countRow="5"
              :showHeader="true"
              :selectable="false"
              :pageSizes="[5, 10, 25]"
              :filterable="true"
              :options="true"
              :rowActions="table.rowActions"
              :empty="table.iEmpty"
              @handleDetails="handleDetails"
              @handleDownload="handleDownload"
            />
          </template>
        </DatatableLoading>
      </v-card>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="$emit('changeVersionHistoryModalStatus', false)"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../../AppDialog'
import DataTable from '../../DataTable'
import { searchGeneratedApplicationHistory } from '@/api/phishingReporter'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
export default {
  name: 'VersionHistoryModal',
  components: {
    DatatableLoading,
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDetails(row) {
      this.$emit('handleHistoryRow', row)
    },
    handleDownload(row) {}
  },
  data() {
    return {
      tableData: [],
      table: {
        columns: [
          {
            property: 'applicationType',
            align: 'left',
            editable: false,
            label: 'Item Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 200
          },
          {
            property: 'version',
            align: 'left',
            editable: false,
            label: 'Version',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            width: 250
          }
        ],
        rowActions: [
          {
            name: 'Details',
            icon: 'mdi-text-box',
            action: 'handleDetails'
          }
        ],
        iEmpty: {
          message: 'You do not have any versions, yet'
        }
      },
      isLoading: true
    }
  },
  created() {
    const searchPayload = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'CreateTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: []
      }
    }
    searchGeneratedApplicationHistory(searchPayload)
      .then((response) => {
        const {
          data: { data }
        } = response
        this.tableData = data.results
        this.isLoading = false
      })
      .catch(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
.matching-modal.version-history {
  .k-table__wrapper {
    .card .table-wrapper .el-table td > .cell {
      padding-left: 34.5px !important;
    }
    .card .table-wrapper .el-table th > .cell.actions-label {
      margin-left: 0 !important;
    }
  }
}
.matching-modal.version-history::-webkit-scrollbar {
  display: none;
}
.matching-modal.version-history {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
}
</style>
