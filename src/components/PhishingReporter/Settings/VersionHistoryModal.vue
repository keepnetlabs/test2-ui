<template>
  <app-dialog
    :status="status"
    icon="mdi-email"
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
              :defaultSort="'date'"
              :selectable="false"
              :filterable="true"
              :options="true"
              :rowActions="table.rowActions"
              :cell-padding="15"
              class="no-sub-border-datatable"
              :empty="table.iEmpty"
            />
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="showMatchingModal = false"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../../AppDialog'
import DataTable from '../../DataTable'
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
        columns: [],
        rowActions: [],
        iEmpty: {}
      }
    }
  }
}
</script>

<style scoped></style>
