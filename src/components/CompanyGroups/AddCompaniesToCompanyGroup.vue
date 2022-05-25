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
        selectable
        filterable
        options
        is-server-side
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
        :axios-payload.sync="payload"
        @handleSelectionChange="handleSelectionChange"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
        @searchChangedEvent="handleSearchChange"
        @sortChangedEvent="sortChanged"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
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
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { addCompanyToCompanyGroup, searchCompanies } from '@/api/company'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
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
      defaultPayload: {
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
    this.callForSearch()
  },
  methods: {
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
      this.payload.pageNumber = pageNumber
      this.callForSearch()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.callForSearch()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearch()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    isNumberOfUsersExceed({ numberOfUsers, targetUserCount, isNumberOfUsersLimited } = {}) {
      return isNumberOfUsersLimited && targetUserCount > Number(numberOfUsers)
    },
    handleChangeIsSettingsOpen(val) {
      if (val) {
        this.isShowExtended = false
      }
    },
    handleSearchChange(searchFilter = {}) {
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.callForSearch()
    },
    callForSearch() {
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
