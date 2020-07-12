<template>
  <app-dialog
    :status="status"
    icon="mdi-timer-sand-full"
    title="Version History"
    subtitle="Last 5 versions of the add-in"
    @changeStatus="$emit('changeVersionHistoryModalStatus', false)"
    size="maximum"
    class-name="matching-modal"
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
            property: PROPERTY_STORE.ADDINVERSION,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.ADDINVERSION),
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 140
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            sortable: true,
            show: true,
            type: 'text',
            width: 140
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDBY),
            sortable: true,
            show: true,
            type: 'text',
            width: 140
          }
        ],
        rowActions: [],
        iEmpty: {
          message: 'You do not have any versions, yet'
        }
      }
    }
  },
  mounted() {}
}
</script>

<style scoped></style>
