<template>
  <app-dialog
    :status="status"
    icon="mdi-email"
    title="Matching Incidents"
    :subtitle="getSelectedMatchingIncidentsSubtitle"
    size="ultraMaximum"
    class-name="matching-modal"
    maxHeightSize="665"
    customSize="800"
    @changeStatus="closeOverlay"
  >
    <template #app-dialog-body>
      <v-card light>
        <v-list-item class="matching-modal__list-item">
          <v-list-item-content>
            <data-table
              ref="refMatchingInvestigation"
              id="matching-incident-data-table"
              is-server-side
              filterable
              options
              show-header
              :show-filter-options="false"
              :count-row="5"
              :table="tableData"
              :columns="columns"
              :loading="isMatchingModalLoading"
              :selectable="false"
              :rowActions="[]"
              :cell-padding="15"
              :empty="empty"
              :server-side-props="serverSideProps"
              :server-side-events="{ pagination: true, search: true, sort: true }"
              :download-button="{ show: false }"
              :axios-payload.sync="payload"
              @refreshAction="callForMatchingIncident"
              @columnFilterChanged="columnFilterChanged"
              @columnFilterCleared="columnFilterCleared"
              @server-side-page-number-changed="serverSidePageNumberChanged"
              @server-side-size-changed="serverSideSizeChanged"
              @searchChangedEvent="handleSearchChange"
              @sortChangedEvent="sortChanged"
            />
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex justify-end">
        <v-btn
          id="btn-close--matching-incident-dialog"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="closeOverlay"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import { getStoreValue } from '@/model/constants/commonConstants'
import { getMatchingIncidents } from '@/api/incidentResponder'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'MatchingIncidentModal',
  components: {
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean
    },
    selectedMatch: {
      type: Object
    },
    subtitleProp: {
      type: String,
      default: 'ruleName'
    }
  },
  data() {
    return {
      columns: [
        {
          property: 'subject',
          align: 'left',
          editable: false,
          label: 'Subject',
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          filterableType: 'text',
          minWidth: '33'
        },
        {
          property: 'createDate',
          align: 'left',
          editable: false,
          label: getStoreValue('createDate'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          filterableType: 'date',
          minWidth: '33'
        },
        {
          property: 'reportedBy',
          align: 'left',
          editable: false,
          label: getStoreValue('reportedBy'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          filterableType: 'text',
          minWidth: '34'
        }
      ],
      payload: getDefaultAxiosPayload({ pageSize: 5, orderBy: 'createDate' }),
      serverSideProps: new ServerSideProps(),
      empty: { message: "There isn't any matching Incidents, yet", btn: '', icon: 'mdi-plus' },
      tableData: [],
      isMatchingModalLoading: true
    }
  },
  computed: {
    getSelectedMatchingIncidentsSubtitle() {
      return (
        this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch[this.subtitleProp]}`
      )
    }
  },
  methods: {
    columnFilterChanged(filter) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.callForMatchingIncident()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.callForMatchingIncident()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.callForMatchingIncident()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForMatchingIncident()
    },
    handleSearchChange(searchFilter = {}) {
      const searchItems = searchFilter?.filter?.FilterGroups?.[0]?.FilterItems || []
      const filterItems = searchItems.filter((filterItem) => {
        const column = this.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column && column.filterableType
      })
      this.payload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForMatchingIncident()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.callForMatchingIncident()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    callForMatchingIncident() {
      this.isMatchingModalLoading = true
      getMatchingIncidents(this.payload, this.selectedMatch.resourceId)
        .then((response) => {
          const {
            data: {
              data: { results = [], totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(() => (this.isMatchingModalLoading = false))
    }
  },
  created() {
    if (this.selectedMatch) {
      this.serverSideProps.pageSize = 5
      this.callForMatchingIncident()
    }
  }
}
</script>
