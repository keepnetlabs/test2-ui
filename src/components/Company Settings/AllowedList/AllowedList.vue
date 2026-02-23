<template>
  <div id="allow-list-list">
    <CompanySettingsHeader
      title="Domains"
      sub-title="Manage and verify your allowed list domain to use with our platform"
    />
    <v-overlay
      v-if="modalStatus"
      id="add-new-quick-domain-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
    >
      <new-domaim
        ref="NewDomainModal"
        :status="modalStatus"
        :changeNewDomainPopupStatus="changeNewDomainPopupStatus"
      />
    </v-overlay>
    <delete-domain
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selectedItems="selectedDeleteItems"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal=";(showDeleteModal = false), (selectedDeleteItems = [])"
      @handleDelete="handleDelete($event)"
    />
    <verify-domain
      v-if="verifyPopupStatus"
      :selectedDomain="selectedDomain"
      :status="verifyPopupStatus"
      @handleCloseModal="verifyPopupStatus = false"
      @handleVerifyDomainPopup="handleVerifyDomainPopup"
      @getDatatableList="callForData"
    />
    <MarkAsVerifiedModal
      v-if="markAsVerifiedPopupStatus"
      :selectedDomain="selectedDomain"
      :status="markAsVerifiedPopupStatus"
      @handleCloseModal="markAsVerifiedPopupStatus = false"
      @handleMarkAsVerifiedSuccess="handleMarkAsVerifiedSuccess"
    />
    <MarkAsVerifiedSuccessModal
      v-if="markAsVerifiedSuccessPopupStatus"
      :selectedDomain="selectedDomain"
      :status="markAsVerifiedSuccessPopupStatus"
      @handleCloseModal="markAsVerifiedSuccessPopupStatus = false"
    />
    <domain-verified
      v-if="verifiedDomainStatus"
      :status="verifiedDomainStatus"
      @handleCloseModal="verifiedDomainStatus = false"
      :selectedDomain="selectedDomain.domain"
    />
    <data-table
      v-if="getAllowListPermissionsSearch"
      id="allow-list-data-table"
      class="allow-list-table"
      ref="refAllowList"
      is-server-side
      selectable
      filterable
      options
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      row-key="allowListResourceId"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewDomainPopupStatus(true)"
      @downloadEvent="exportTableData"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @handleMultipleDelete="handleMultipleDelete"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="scope.column.property === 'status'"
          :id="`text-allow-list-status-${scope.$index}`"
          class="datatable-link cursor-default"
        >
          <div
            class="allow-list-status py-1 cursor-default"
            :style="setStatusColor(scope.row.status)"
          >
            {{ scope.row.status }}
          </div>
        </span>
      </template>
      <template #datatable-row-actions="{ scope }">
        <template v-if="isRootOrReseller && scope.row.status !== 'Verified'">
          <DefaultButtonRowAction
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[0].disabled"
            :checkIsOwnerProperty="false"
            @on-click=";(selectedDomain = scope.row), (verifyPopupStatus = true)"
          />
          <RowActionsMenu>
            <DefaultMenuRowAction
              :scope="scope"
              :check-is-owner-property="false"
              :disabled="tableOptions.rowActions[2].disabled"
              :icon="tableOptions.rowActions[2].icon"
              :text="tableOptions.rowActions[2].name"
              @on-click="handleMarkAsVerified(scope.row)"
            />
            <DefaultMenuRowAction
              :icon="tableOptions.rowActions[1].icon"
              :text="tableOptions.rowActions[1].name"
              :scope="scope"
              :disabled="tableOptions.rowActions[1].disabled"
              :check-is-owner-property="false"
              @on-click="handleDelete(scope.row)"
            />
          </RowActionsMenu>
        </template>
        <template v-else>
          <DefaultButtonRowAction
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[0].disabled"
            :checkIsOwnerProperty="false"
            @on-click=";(selectedDomain = scope.row), (verifyPopupStatus = true)"
          />
          <DefaultButtonRowAction
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :checkIsOwnerProperty="false"
            @on-click="handleDelete(scope.row)"
          />
        </template>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../../DataTable'
import {
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getAllowListList, exportAllowList } from '@/api/allowList'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DeleteDomain from '@/components/Company Settings/AllowedList/DeleteDomain'
import NewDomaim from '@/components/Company Settings/AllowedList/NewDomain'
import VerifyDomain from '@/components/Company Settings/AllowedList/VerifyDomain'
import DomainVerified from '@/components/Company Settings/AllowedList/DomainVerified'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import MarkAsVerifiedModal from './MarkAsVerifiedModal'
import MarkAsVerifiedSuccessModal from './MarkAsVerifiedSuccessModal'

export default {
  name: 'List',
  components: {
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    DataTable,
    CompanySettingsHeader,
    DeleteDomain,
    NewDomaim,
    VerifyDomain,
    DomainVerified,
    RowActionsMenu,
    MarkAsVerifiedModal,
    MarkAsVerifiedSuccessModal
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      selectedRow: null,
      loading: true,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedDeleteItems: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ALLOW_LIST_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ALLOW_LIST_TABLE,
        columns: [
          {
            property: 'domain',
            align: 'left',
            editable: false,
            label: 'Domain',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 220
          },
          {
            property: 'status',
            align: 'left',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'select',
            filterableItems: ['Unverified', 'Verified'],
            width: 150
          },
          {
            property: 'verifyType',
            align: 'left',
            editable: false,
            label: 'Verification',
            sortable: true,
            width: 180,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [
              { text: 'By DNS TXT Record', value: 1 },
              { text: 'By System', value: 2 },
              { text: 'As Primary Domain', value: 3 },
              { text: 'By Reseller', value: 4 }
            ]
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'lastCheckTime',
            align: 'left',
            editable: false,
            label: 'Last Check',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'verifyTime',
            align: 'left',
            editable: false,
            label: 'Date Verified',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          }
        ],
        rowActions: [
          {
            name: 'Verify Domain',
            icon: 'mdi-checkbox-marked-circle',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getAllowListPermissionsVerify']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getAllowListPermissionsDelete']
          },
          {
            name: 'Mark as Verified',
            icon: 'mdi-check',
            action: 'handleMarkAsVerified',
            disabled: !this.$store.getters['permissions/getAllowListPermissionsVerify']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getAllowListPermissionsExport']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: this.$store.getters['permissions/getSMTPSettingsDeletePermissions'],
          download: false,
          disabledStatuses: {
            delete: false
          }
        },
        empty: {
          message: LABEL_STORE.NO_ALLOW_LIST,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--domain',
          disabled: !this.$store.getters['permissions/getAllowListPermissionsCreate']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Domain',
          id: 'btn-add--domain',
          disabled: !this.$store.getters['permissions/getAllowListPermissionsCreate']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      verifyPopupStatus: false,
      selectedDomain: {},
      verifiedDomainStatus: false,
      markAsVerifiedPopupStatus: false,
      markAsVerifiedSuccessPopupStatus: false
    }
  },
  computed: {
    ...mapGetters({
      getAllowListPermissionsSearch: 'permissions/getAllowListPermissionsSearch',
      getUserData: 'auth/userGetter'
    }),
    isRootOrReseller() {
      const roleName = this.getUserData?.role?.name
      return roleName && ['Root', 'Reseller'].includes(roleName)
    }
  },
  created() {
    this.callForLanguages('refAllowList')
    this.callForData()
  },
  methods: {
    callForData(resourceId = null) {
      this.loading = true
      if (this.getAllowListPermissionsSearch) {
        getAllowListList(this.axiosPayload)
          .then((response) => {
            const {
              totalNumberOfRecords = 0,
              totalNumberOfPages = 1,
              pageNumber = 1,
              results = []
            } = response?.data?.data || {}
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.tableData = results.map((row) => ({
              ...row,
              verifyType: this.getVerifyTypeText(row)
            }))
            if (resourceId !== null) {
              this.selectedDomain = results.find((x) => x.allowListResourceId === resourceId)
              this.verifyPopupStatus = true
            }
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      } else {
        this.$router.push('/')
      }
    },
    getVerifyTypeText(row) {
      if (row.status === 'Unverified') return ''
      if (row.verifyType === 1) return 'By DNS TXT Record'
      if (row.verifyType === 2) return 'By System'
      if (row.verifyType === 3) return 'As Primary Domain'
      if (row.verifyType === 4) return 'By Reseller'
    },
    setStatusColor(status) {
      let color = '#B6791D'
      if (status === 'Verified') {
        color = '#217124'
      }
      return `border-color: ${color};color: ${color};`
    },
    handleMultipleDelete(selections) {
      this.selectedDeleteItems = selections
      this.showDeleteModal = true
    },
    handleDelete(row) {
      this.selectedDeleteItems.push(row)
      this.showDeleteModal = true
    },
    handleMarkAsVerified(row) {
      this.markAsVerifiedPopupStatus = true
      this.selectedDomain = row
    },
    handleMarkAsVerifiedSuccess() {
      this.markAsVerifiedPopupStatus = false
      this.markAsVerifiedSuccessPopupStatus = true
      this.selectedDomain = {}
      this.callForData()
    },
    handleVerifyDomainPopup() {
      this.verifyPopupStatus = false
      this.verifiedDomainStatus = true
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.selectedDeleteItems = []
      this.$refs.refAllowList.resetSelectableParams()
      this.callForData()
    },
    checkIfCanCLoseNewModal() {
      if (this.$refs.NewDomainModal) {
        this.$refs.NewDomainModal.closeDomainPopup()
      }
    },
    changeNewDomainPopupStatus(status, isSave = false, resourceId = null) {
      this.modalStatus = status
      if (isSave && resourceId !== null) {
        this.callForData(resourceId)
      }
    },
    exportTableData({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportAllowList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Allow-List.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleActionDelete(row) {
      this.selectedDeleteItems = row
      this.showDeleteModal = true
    }
  }
}
</script>
