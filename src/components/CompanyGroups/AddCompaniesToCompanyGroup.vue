<template>
  <app-dialog
    :status="status"
    title-id="text--company-group-details-add-company-to-company-group-popup-title"
    subtitle-id="text--company-group-details-add-company-to-company-group-popup-subtitle"
    icon="mdi-account-multiple-plus"
    max-height-size="auto"
    class-name="add-to-group-modal"
    custom-size="800"
    :title="getTitle"
    :subtitle="labels.AddCompaniesToCompanyGroupSubtitle"
    @changeStatus="closeOverlay"
  >
    <template #app-dialog-body>
      <DataTable
        id="companies-data-table"
        ref="refDataList"
        row-key="companyName"
        selectable
        filterable
        options
        is-server-side
        no-padding-bottom
        :show-filter-options="false"
        :loading="loading"
        :table="tableData"
        :count-row="5"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :download-button="{ show: false }"
        :empty="tableOptions.iEmpty"
        :selectEvent="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="axiosPayload"
        @handleSelectionChange="handleSelectionChange"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @searchChangedEvent="handleSearchChange"
        @sortChangedEvent="sortChanged"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
      />
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--add-companies-to-company-group-modal"
        confirm-button-id="btn-save--add-companies-to-company-group-modal"
        :confirm-button-disabled="(selectedArray && selectedArray.length === 0) || saveDisable"
        @handleClose="closeOverlay"
        @handleConfirm="confirm"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { addCompanyToCompanyGroup, searchCompanies } from '@/api/company'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getDefaultAxiosPayload } from '@/utils/functions'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'AddCompaniesToCompanyGroup',
  components: {
    AppDialogFooter,
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean
    },
    selectedGroup: {
      type: Object
    }
  },
  mixins: [useDefaultTableFunctions],
  emits: ['close-overlay-with-update', 'close-overlay'],
  data() {
    return {
      labels,
      saveDisable: false,
      loading: true,
      selectedArray: [],
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
            property: PROPERTY_STORE.INDUSTRYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.INDUSTRYNAME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'IndustryResourceId',
            width: 150
          },
          {
            property: PROPERTY_STORE.LICENSETYPENAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LICENSETYPENAME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'LicenseTypeResourceId',
            width: 150
          },
          {
            property: PROPERTY_STORE.NUMBEROFUSERS,
            align: 'right',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.NUMBEROFUSERS),
            sortable: true,
            show: true,
            type: 'text',
            width: 130
          },
          {
            property: PROPERTY_STORE.LICENSEENDDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LICENSEENDDATE),
            sortable: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            fixed: 'right',
            sortable: true,
            show: true,
            filterableType: 'date',
            type: 'text',
            width: 180
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: labels.EmptyCompany,
          btn: labels.New,
          icon: 'mdi-plus'
        },
        addButton: {
          show: false,
          action: 'addButton',
          tooltip: 'Add Company',
          disabled: !this.$store.getters['permissions/getCompaniesCreatePermissions']
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !this.$store.getters['permissions/getCompaniesEditPermissions']
          },
          {
            name: 'Add to a company group',
            icon: 'mdi-account-multiple-plus',
            action: 'AddGroupToModal',
            disabled: !this.$store.getters['permissions/getCompanyGroupsSearchPermissions']
          },
          {
            name: 'Create a new company group with company',
            icon: 'mdi-account-multiple',
            action: 'createNewGroupWithCompany',
            disabled: !this.$store.getters['permissions/getCompaniesSearchPermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.$store.getters['permissions/getCompaniesDeletePermissions']
          }
        ]
      },
      axiosPayload: getDefaultAxiosPayload({ pageSize: 5 }),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getTitle() {
      return `Add companies to ${this.selectedGroup.name}`
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      LookupLocalStorage.getMultiple([2, 3])
        .then((response) => {
          const res = response
          this.$set(
            this.tableOptions.columns[1],
            'filterableItems',
            res
              .filter((item) => item.genericCodeTypeId === 2)
              .map((item) => ({ text: item.name, value: item.resourceId }))
          )
          this.$set(
            this.tableOptions.columns[2],
            'filterableItems',
            res
              .filter((item) => item.genericCodeTypeId === 3)
              .map((item) => ({ text: item.name, value: item.resourceId }))
          )
        })
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          searchCompanies(this.axiosPayload)
            .then((response) => {
              const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
              this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
              this.serverSideProps.totalNumberOfPages = totalNumberOfPages
              this.serverSideProps.pageNumber = pageNumber
              this.tableData =
                response.data.data.hasOwnProperty('results') &&
                response.data.data.results.length > 0
                  ? response.data.data.results
                  : []
            })
            .catch(() => {
              this.tableData = []
            })
            .finally(() => (this.loading = false))
        })
    },
    toggleConfigureNewCompanyModal() {
      if (this.isShowConfigureCompanyModal) {
        this.callForData()
      }
      this.isShowConfigureCompanyModal = !this.isShowConfigureCompanyModal
      if (!this.isShowConfigureCompanyModal) {
        this.createdCompanyResourceIdForConfigureCompany = ''
      }
    },
    handleSwitchCompany(account = {}) {
      this.$router.go(0)
      localStorage.setItem('isSelectCompany', true)
      localStorage.setItem('companyId', account.companyResourceId)
      localStorage.setItem('companyRequestId', account.companyResourceId)
      localStorage.setItem('selectedCompanyRequestId', account.companyResourceId)
      localStorage.setItem('selectedCompanyName', account.companyName)
    },
    isNumberOfUsersExceed({ numberOfUsers, targetUserCount, isNumberOfUsersLimited } = {}) {
      return isNumberOfUsersLimited && targetUserCount > Number(numberOfUsers)
    },
    handleChangeIsSettingsOpen(val) {
      if (val) {
        this.isShowExtended = false
      }
    },
    closeOverlay() {
      this.$emit('close-overlay')
    },
    confirm() {
      this.saveDisable = true
      addCompanyToCompanyGroup(this.selectedGroup.resourceId, {
        companyResourceIdArray: this.selectedArray.map((item) => item['companyResourceId'])
      })
        .then(() => {
          this.$emit('close-overlay-with-update')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    handleSelectionChange(arr = []) {
      this.selectedArray = arr
    }
  }
}
</script>
