<template>
  <app-dialog
    :status="status"
    icon="mdi-account-multiple-plus"
    :title="getTitle"
    :subtitle="labels.AddCompaniesToCompanyGroupSubtitle"
    @changeStatus="closeOverlay"
    :custom-size="dialogWidth"
    maxHeightSize="auto"
    class-name="add-to-group-modal"
    title-id="text--company-group-details-add-company-to-company-group-popup-title"
    subtitle-id="text--company-group-details-add-company-to-company-group-popup-subtitle"
  >
    <template v-slot:app-dialog-body>
      <DataTable
        id="companies-data-table"
        ref="refDataList"
        row-key="companyName"
        refName="companyList"
        selectable
        is-server-side
        :show-filter-options="false"
        :loading="loading"
        :table="tableData"
        :count-row="5"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :download-button="{ show: false }"
        :empty="tableOptions.iEmpty"
        :filterable="true"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :options="true"
        :selectEvent="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @handleSelectionChange="handleSelectionChange"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
        @searchChangedEvent="handleSearchChange"
        @sortChangedEvent="sortChanged"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
      />
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          @click="closeOverlay"
          id="btn-cancel--add-companies-to-company-group-modal"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--add-companies-to-company-group-modal"
          @click="confirm"
          :disabled="(selectedArray && selectedArray.length === 0) || saveDisable"
          color="#2196f3"
          class="delete-user__footer-button"
          text
          >{{ labels.Confirm }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { checkPermission } from '@/utils/functions'
import { addCompanyToCompanyGroup, searchCompanies } from '@/api/company'
import { getLookupListByTypeIdList } from '@/api/common'

import ServerSideProps from '@/helper-classes/server-side-table-props'
export default {
  name: 'AddCompaniesToCompanyGroup',
  components: {
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
  emits: ['close-overlay-with-update', 'close-overlay'],
  data() {
    return {
      labels,
      saveDisable: false,
      loading: true,
      selectedArray: [],
      dialogWidth: '650',
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
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
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
          disabled: !checkPermission('companies', 'POST')
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !checkPermission('companies/{resourceId}', 'PUT')
          },
          {
            name: 'Add to a company group',
            icon: 'mdi-account-multiple-plus',
            action: 'AddGroupToModal',
            disabled: !checkPermission('company-groups/search', 'POST')
          },
          {
            name: 'Create a new company group with company',
            icon: 'mdi-account-multiple',
            action: 'createNewGroupWithCompany',
            disabled: !checkPermission('companies/search', 'POST')
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !checkPermission('companies/{resourceId}', 'DELETE')
          }
        ]
      },
      payload: {
        pageNumber: 1,
        pageSize: 5,
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
      },
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getTitle() {
      return `Add companies to ${this.selectedGroup.name}`
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.COMPANY_LIST))

    this.getDefaultFilterAndSearch()
    this.callForSearch()
  },
  methods: {
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.COMPANY_LIST, JSON.stringify(tableSettings))
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      const copyOfFilter = JSON.parse(JSON.stringify(this.payload.filter))
      copyOfFilter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_LIST,
        JSON.stringify({
          filter: copyOfFilter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.getDefaultFilterAndSearch()
      this.callForSearch()
    },
    handleClearFilters() {
      this.payload = JSON.parse(JSON.stringify(this.defaultPayload))
      this.payload.pageNumber = 1
      this.$refs.refDataList.filterValues = {}
      this.$refs.refDataList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.ADD_COMPANY_LIST)
      this.callForSearch()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.ADD_COMPANY_LIST)
      )
      if (savedFilter) {
        this.payload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refDataList.filterValues = savedFilter.filterValues
          this.$refs.refDataList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
        })
      }
    },

    toggleConfigureNewCompanyModal() {
      if (this.isShowConfigureCompanyModal) {
        this.callForSearch()
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
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.payload.pageNumber = pageNumber
      this.callForSearch()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.callForSearch()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearch()
    },
    resetPageNumber() {
      //generic
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    isNumberOfUsersExceed({ numberOfUsers, targetUserCount, isNumberOfUsersLimited } = {}) {
      return isNumberOfUsersLimited && targetUserCount > Number(numberOfUsers)
    },
    handleChangeIsSettingsOpen(val) {
      if (val) {
        this.isShowExtended = false
      }
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForSearch()
    },
    callForSearch() {
      this.loading = true
      getLookupListByTypeIdList({ typeidlist: [2, 3] })
        .then((response) => {
          const res = response.data.data
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
          searchCompanies(this.payload)
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
              this.dialogWidth = this.tableData.length > 1000 ? '750' : '650'
            })
            .catch(() => {
              this.tableData = []
            })
            .finally(() => (this.loading = false))
        })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.payload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.payload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForSearch()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.payload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.payload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearch()

      this.tableOptions.isColumnFilterActive =
        this.payload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    closeOverlay() {
      this.$emit('close-overlay')
    },
    confirm() {
      const payload = {
        companyResourceIdArray: this.selectedArray.map((item) => item['companyResourceId'])
      }
      this.saveDisable = true
      addCompanyToCompanyGroup(this.selectedGroup.resourceId, payload)
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

<style scoped></style>
