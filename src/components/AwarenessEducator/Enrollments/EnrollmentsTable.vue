<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @refreshAction="callForData"
    @downloadEvent="exportEnrollments"
  >
    <template #datatable-row-actions="{ scope }">
      <EnrollmentsTableRowActions
        :scope="scope"
        :row-actions="tableOptions.rowActions"
        @on-stop="$emit('on-stop', $event)"
        @on-send="$emit('on-send', $event)"
        @on-edit="$emit('on-edit', $event)"
        @on-delete="$emit('on-delete', $event)"
        @on-preview="handlePreviewRowClick"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { COLUMNS } from '../utils'
import EnrollmentsTableRowActions from '@/components/AwarenessEducator/Enrollments/EnrollmentsTableRowActions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
export default {
  name: 'EnrollmentsTable',
  components: {
    EnrollmentsTableRowActions,
    DataTable
  },
  props: {
    mainLanguages: {
      type: Array,
      required: true
    }
  },
  mixins: [useLoading, useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-enrollments-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ENROLLMENTS_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        columns: [
          COLUMNS.NAME,
          COLUMNS.CATEGORY,
          COLUMNS.AUDIENCE,
          COLUMNS.LANGUAGES,
          COLUMNS.TYPE,
          COLUMNS.ENROLLED_BY,
          COLUMNS.START_DATE,
          COLUMNS.STATUS,
          COLUMNS.DELIVERY,
          COLUMNS.TAGS
        ],
        iEmpty: {
          message: labels.EmptyEnrollments
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: true
        },
        rowActions: [
          {
            name: labels.SendTraining,
            icon: 'mdi-send'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil'
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete'
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchEnrollments(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    exportEnrollments(downloadTypes) {
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
        AwarenessEducatorService.exportEnrollments(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Training-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handlePreviewRowClick(row) {
      AwarenessEducatorService.getEnrollment(row.enrollmentId).then((response) => {
        const {
          data: { data }
        } = response
        AwarenessEducatorService.getTrainingUrlForPreview(
          data?.trainingId,
          this.mainLanguages.find((lang) => lang.code === row.languages[0]).id
        ).then((response) => {
          const {
            data: { data }
          } = response
          window.open(
            `${window.location.origin}/training/scorm?isPreview=true&template=${data?.trainingUrl}`
          )
        })
      })
    }
  }
}
</script>
