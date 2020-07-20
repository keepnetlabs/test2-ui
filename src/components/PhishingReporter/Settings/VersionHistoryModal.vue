<template>
  <app-dialog
    :status="status"
    icon="mdi-timer-sand-full"
    title="Version History"
    subtitle="Last 5 versions of the add-in"
    @changeStatus="$emit('changeVersionHistoryModalStatus', false)"
    size="maximum"
    class-name="matching-modal version-history"
  >
    <template v-slot:app-dialog-body>
      <v-card light>
        <v-list-item class="matching-modal__list-item">
          <v-list-item-content>
            <data-table
              :refName="'versionHistory'"
              ref="refVersionHistory"
              :columns="table.columns"
              :countRow="5"
              :border="false"
              :showHeader="true"
              :selectable="false"
              :pageSizes="[5, 10, 20, 50, 100]"
              :filterable="true"
              :options="true"
              :rowActions="table.rowActions"
              class="no-sub-border-datatable"
              :empty="table.iEmpty"
            />
          </v-list-item-content>
        </v-list-item>
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
import { getStoreValue, PROPERTY_STORE } from '../../../model/constants/commonConstants'
import { searchGeneratedApplicationHistory } from '../../../api/phishingReporter'
export default {
  name: 'VersionHistoryModal',
  components: {
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      table: {
        columns: [
          {
            property: 'applicationType',
            align: 'left',
            editable: false,
            label: 'Application Type',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 33
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            sortable: true,
            show: true,
            type: 'badge',
            minWidth: 33
          },
          {
            property: 'createTime',
            align: 'center',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 34
          }
        ],
        rowActions: [],
        iEmpty: {
          message: 'You do not have any versions, yet'
        }
      }
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
    searchGeneratedApplicationHistory(searchPayload).then((response) => {
      const {
        data: { data }
      } = response
      this.$refs.refVersionHistory.loadWithDataArray(data.results || [])
    })
  }
}
</script>

<style lang="scss">
.matching-modal.version-history {
  .k-table__wrapper {
    .card .table-wrapper .el-table td > .cell {
      padding-left: 38px !important;
    }
  }
}
</style>
