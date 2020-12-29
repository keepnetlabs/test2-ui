<template>
  <app-dialog
    :status="status"
    icon="mdi-account-multiple-plus"
    :title="getTitle"
    :subtitle="labels.AddCompaniesToCompanyGroupSubtitle"
    @changeStatus="closeOverlay"
    size="maximum"
    maxHeightSize="auto"
    class-name="add-to-group-modal"
  >
    <template v-slot:app-dialog-body>
      <DataTable
        :loading="loading"
        :selectable="true"
        :table="tableData"
        id="companies-data-table"
        ref="refDataList"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :countRow="5"
        :download-button="{ show: false }"
        :empty="tableOptions.iEmpty"
        :filterable="true"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :options="true"
        :pageSizes="tableOptions.pageSizes"
        :selectEvent="tableOptions.selectEvent"
        :refName="'companyList'"
        row-key="companyName"
        @handleSelectionChange="handleSelectionChange"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
      />
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="closeOverlay" color="#f56c6c" class="delete-user__footer-button" text>{{
          labels.Cancel
        }}</v-btn>
        <v-btn
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
import { checkPermission } from '@/utils/functions'
import { addCompanyToCompanyGroup, searchCompanies } from '@/api/company'
import { getLookupListByTypeIdList } from '@/api/common'
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
      loading: false,
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
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: 'No company defined',
          btn: 'ADD A COMPANY',
          icon: 'mdi-account-plus'
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
        pageSize: 5000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
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
