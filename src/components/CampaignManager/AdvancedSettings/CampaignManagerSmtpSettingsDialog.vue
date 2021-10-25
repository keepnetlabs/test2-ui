<template>
  <AppDialog
    icon="mdi-mail"
    title-id="text--campaign-manager-smtp-settings-title"
    subtitle-id="text-campaign-manager-smtp-settings-subtitle"
    size="ultraMaximum"
    maxHeightSize="630"
    custom-size="700"
    :title="labels.CustomizeSmtpForEachCompany"
    :status="status"
    :subtitle="labels.CustomizeSmtpForEachCompanySub"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        id="campaign-manager-smtp-settings-data-table"
        filterable
        selectable
        options
        :show-filter-options="tableOptions.showFilterOptions"
        :download-button="tableOptions.downloadButton"
        :count-row="5"
        :refName="'refSmtpSettingsTable'"
        :loading="loading"
        :columns="tableOptions.columns"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        :is-settings-popup="tableOptions.isSettingsPopup"
        :empty="tableOptions.iEmpty"
        :downloadButton="tableOptions.downloadButton"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
      >
        <template #datatable-custom-column="{ scope }">
          <v-select
            v-model.trim="scope.row.smtp"
            id="input--notification-template-smtp"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
            hide-details
            :menu-props="{ offsetY: true }"
            :items="smtpItems"
          />
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        @handleClose="handleClose"
        :confirmButtonDisabled="getConfirmButtonDisabled"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'CampaignManagerSmtpSettingsDialog',
  components: { AppDialogFooter, DataTable, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    smtpItems: {
      type: Array
    }
  },
  emits: ['on-close'],
  data() {
    return {
      labels,
      loading: false,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 180
          },
          {
            property: PROPERTY_STORE.USERS,
            align: 'left',
            editable: false,
            label: labels.Users,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'numeric',
            width: 180
          },
          {
            property: PROPERTY_STORE.SMTP,
            align: 'left',
            editable: false,
            label: labels.Smtp,
            sortable: true,
            show: true,
            type: 'slot'
          }
        ],
        isColumnFilterActive: false,
        downloadButton: { show: false },
        showFilterOptions: false,
        isSettingsPopup: false,
        iEmpty: {
          message: labels.EmptyCompany
        }
      }
    }
  },
  computed: {
    getConfirmButtonDisabled() {
      return false
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.tableData = [
        {
          resourceId: 'akskasksa2ksakas',
          companyName: 'asjasj',
          users: 20,
          smtp: 'denemee'
        },
        {
          resourceId: 'akskasksakasakas',
          companyName: 'asjasj',
          users: 20,
          smtp: 'denemee'
        },
        {
          resourceId: 'akskasksaksakas',
          companyName: 'asjasj',
          users: 20,
          smtp: 'denemee'
        },
        {
          resourceId: 'ssss',
          companyName: 'asjasj',
          users: 20,
          smtp: 'Keepnet Default'
        },
        {
          resourceId: 'asassasas',
          companyName: 'asjasj',
          users: 20,
          smtp: 'denemee'
        }
      ]
    },
    columnFilterChanged() {},
    columnFilterCleared() {},
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {}
  }
}
</script>
<style lang="scss">
#campaign-manager-smtp-settings-data-table {
  padding-bottom: 0;
}
</style>
