<template>
  <KContainer id="callback-settings">
    <CompanySettingsHeader
      title="Callback Phone Numbers"
      sub-title="Manage your callback phone numbers"
    />
    <SelectPhoneNumbersModal
      v-if="isShowSelectPhoneNumbersModal"
      :isLoading="isMutating"
      :status="isShowSelectPhoneNumbersModal"
      :selectablePhoneNumberCount="selectablePhoneNumberCount"
      @confirm="handleConfirmSelectPhoneNumbers"
      @close="handleCloseSelectPhoneNumbersModal"
    />
    <ExchangePhoneNumberModal
      v-if="isShowExchangePhoneNumberModal"
      :isLoading="isMutating"
      :status="isShowExchangePhoneNumberModal"
      :selectedRow="selectedRow"
      @confirm="handleConfirmExchangePhoneNumber"
      @close="handleCloseExchangePhoneNumberModal"
    />
    <DataTable
      v-if="getCallbackSettingsSearchPermissions"
      ref="refCallbackSettings"
      id="callback-phone-numbers-table"
      is-server-side
      selectable
      filterable
      options
      :showPagination="true"
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :add-button="tableOptions.addButton"
      :select-event="tableOptions.selectEvent"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :download-button="tableOptions.downloadButton"
      :row-actions="tableOptions.rowActions"
      @onEmptyBtnClicked="handleSelectPhoneNumbers"
      @selectPhoneNumbers="handleSelectPhoneNumbers"
      @columnFilterChanged="columnFilterChanged"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @downloadEvent="exportData"
      @refreshAction="callForNumberUsage"
    >
      <template v-slot:datatable-custom-column="{ scope, col }">
        <div class="callback-settings-table__status-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.isUsing)" :col="col" size="medium" />
        </div>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :scope="scope"
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled || scope.row.isUsing === 'In Use'"
          :text="scope.row.isUsing === 'In Use' ? 'Number in use' : 'Exchange'"
          :checkIsOwnerProperty="false"
          @on-click="handleExchange(scope.row)"
        />
      </template>
    </DataTable>
  </KContainer>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { useLoading } from '@/hooks/useLoading'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CallbackService from '@/api/callback'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import SelectPhoneNumbersModal from '@/components/CallbackSettings/SelectPhoneNumbersModal'
import ExchangePhoneNumberModal from '@/components/CallbackSettings/ExchangePhoneNumberModal'
import Badge from '@/components/Badge'

export default {
  name: 'CallbackSettings',
  components: {
    DataTable,
    KContainer,
    CompanySettingsHeader,
    DefaultButtonRowAction,
    SelectPhoneNumbersModal,
    ExchangePhoneNumberModal,
    Badge
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      selectablePhoneNumberCount: 0,
      CONSTANTS: {
        id: 'CallbackSettingsSearchContainer',
        ascending: 'ascending'
      },
      isMutating: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isShowSelectPhoneNumbersModal: false,
      isShowExchangePhoneNumberModal: false,
      selectedRow: null,
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CALLBACK_SETTINGS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CALLBACK_SETTINGS,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'number',
            //align: 'left',
            editable: false,
            label: 'Callback Phone Number',
            fixed: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 220,
            filterableType: 'text'
          },
          {
            property: 'region',
            //align: 'left',
            editable: false,
            label: 'Region',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'text'
          },
          {
            property: 'isUsing',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'slot',
            width: 150,
            filterableType: 'select',
            filterableItems: ['Not In Use', 'In Use']
          },
          {
            property: 'campaignName',
            //align: 'left',
            editable: false,
            label: 'Campaign Name',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'scenarioName',
            //align: 'left',
            editable: false,
            label: 'Scenario Name',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'freeOnDate',
            //align: 'left',
            editable: false,
            label: 'Frees On Date',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'date',
            filterableType: 'date'
          }
        ],
        rowActions: [
          {
            name: 'Exchange',
            icon: 'mdi-swap-horizontal',
            action: 'handleExchange',
            id: 'btn-exchange--callback-settings',
            disabled: !this.$store.getters['permissions/getCallbackSettingsExchangePermissions']
          }
        ],
        addButton: {
          show: true,
          icon: 'mdi-phone',
          label: 'Select Phone Numbers',
          action: 'selectPhoneNumbers',
          tooltip: 'Select phone numbers',
          id: 'btn-select--phone-numbers',
          disabled: !this.$store.getters['permissions/getCallbackSettingsMapNumbersPermissions']
        },
        iEmpty: {
          message:
            'You do not have any callback phone numbers, yet <br/> <span class="text-subtitle-1">To start a campaign, you need to select callback phone numbers first</span>',
          btn: 'Select Phone Numbers',
          action: 'selectPhoneNumbers',
          id: 'btn-empty--callback-settings',
          icon: 'mdi-phone',
          disabled: !this.$store.getters['permissions/getCallbackSettingsMapNumbersPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getCallbackSettingsExportPermissions']
        }
      }
    }
  },
  mounted() {
    this.callForNumberUsage()
  },
  computed: {
    ...mapGetters({
      getCallbackSettingsSearchPermissions: 'permissions/getCallbackSettingsSearchPermissions'
    })
  },
  methods: {
    getStatusBadgeProps(status) {
      if (status === 'Not In Use')
        return {
          color: '#757575',
          text: 'Not In Use'
        }

      if (status === 'In Use')
        return {
          color: '#1173C1',
          text: 'In Use'
        }
    },
    callForNumberUsage() {
      this.isLoading = true
      CallbackService.getUsedCallbackNumbers()
        .then((res) => {
          const { companyCount, usedCount } = res.data.data
          if (companyCount === null) companyCount = 0
          if (usedCount === null) usedCount = 0
          this.selectablePhoneNumberCount = companyCount - usedCount
          if (!this.selectablePhoneNumberCount) {
            this.tableOptions.addButton.disabled = true
            this.tableOptions.iEmpty.disabled = true
          }
        })
        .catch(() => {
          this.tableOptions.addButton.disabled = true
          this.tableOptions.iEmpty.disabled = true
        })
        .finally(this.callForData)
    },
    callForData() {
      this.isLoading = true
      CallbackService.searchCallbackSettings(this.axiosPayload)
        .then((response) => {
          const {
            totalNumberOfRecords = 0,
            totalNumberOfPages = 0,
            pageNumber = 1,
            results = []
          } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results.map((row) => ({
            ...row,
            isUsing: row.isUsing ? 'In Use' : 'Not In Use'
          }))
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleExchange(row) {
      this.selectedRow = row
      this.isShowExchangePhoneNumberModal = true
    },
    handleCloseExchangePhoneNumberModal() {
      this.isShowExchangePhoneNumberModal = false
      this.selectedRow = null
    },
    handleConfirmExchangePhoneNumber(newPhoneNumberId) {
      this.isMutating = true
      CallbackService.exchangeCallbackNumbers(this.selectedRow.providerNumberId, newPhoneNumberId)
        .then((res) => {
          this.handleCloseExchangePhoneNumberModal()
          this.callForData()
        })
        .finally(() => {
          this.isMutating = false
        })
    },
    handleSelectPhoneNumbers() {
      this.isShowSelectPhoneNumbersModal = true
    },
    handleCloseSelectPhoneNumbersModal() {
      this.isShowSelectPhoneNumbersModal = false
    },
    handleConfirmSelectPhoneNumbers(phoneNumberIds) {
      this.isMutating = true
      CallbackService.mapCallbackNumbers(phoneNumberIds)
        .then((res) => {
          this.handleCloseSelectPhoneNumbersModal()
          this.callForData()
        })
        .finally(() => {
          this.isMutating = false
        })
    },
    exportData(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        CallbackService.exportCallbackSettings(payload).then((response) => {
          const { data } = response
          if (data && data instanceof Blob) {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Callback-Phone-Numbers.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        })
      })
    }
  }
}
</script>
