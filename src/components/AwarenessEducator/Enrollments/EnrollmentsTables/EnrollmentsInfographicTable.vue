<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    is-server-side-selection
    filterable
    options
    is-server-side
    row-key="enrollmentId"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :saved-filters-local-storage-key="savedFiltersKey"
    :saved-table-settings-local-storage-key="savedTableSettingsKey"
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
    @on-delete="$emit('on-permanent-delete', $event)"
    @on-view-report="$emit('on-view-report', $event)"
    @on-restore="$emit('on-restore', $event)"
  >
    <template v-if="!isTrash" #datatable-row-actions="{ scope }">
      <EnrollmentsTableRowActions
        :scope="scope"
        :row-actions="tableOptions.rowActions"
        @on-stop-reminder="$emit('on-stop-reminder', $event)"
        @on-stop-auto-enroll="$emit('on-stop-auto-enroll', $event)"
        @on-stop="$emit('on-stop', $event)"
        @on-send="$emit('on-send', $event)"
        @on-edit="$emit('on-edit', $event)"
        @on-delete="$emit('on-delete', $event)"
        @on-preview="$emit('on-preview', $event)"
        @on-download="$emit('on-download', $event)"
        @on-route-to-report="$emit('on-view-report', $event)"
      />
    </template>
    <template #datatable-custom-column="{ scope }">
      <LanguagesColumn
        v-if="scope.column.property === 'languages'"
        :value="scope.row.languages"
        :preferred-language-types="getPreferredLanguageTypes"
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
import { COLUMNS, ENROLLMENT_AUDIENCE } from '../../utils'
import EnrollmentsTableRowActions from '@/components/AwarenessEducator/Enrollments/EnrollmentsTableRowActions'
import LanguagesColumn from '@/components/Common/Simulator/LanguagesColumn/LanguagesColumn.vue'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import { trashRowActions } from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/utils'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import useEnrollmentTableFilters from '@/hooks/enrollments/useEnrollmentTableFilters'
export default {
  name: 'EnrollmentsInfographicTable',
  components: {
    DataTable,
    EnrollmentsTableRowActions,
    LanguagesColumn
  },
  props: {
    languages: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array
    },
    targetAudiences: {
      type: Array
    },
    enrollmentStatusEnum: {
      type: Array,
      required: true
    },
    showDownloadButton: {
      type: Boolean,
      default: true
    },
    apiFunc: {
      type: Function,
      default: AwarenessEducatorService.searchEnrollments
    },
    isTrash: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    useLoading,
    useDefaultTableFunctions,
    useAwarenessColumnBindsFromApi,
    useEnrollmentTableFilters
  ],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-enrollments-data-table'
      },
      axiosPayload: getDefaultAxiosPayload({
        enrollmentType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      }),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.ENROLLMENT_NAME,
          COLUMNS.INFOGRAPHIC_NAME,
          COLUMNS.CATEGORY,
          ENROLLMENT_AUDIENCE,
          COLUMNS.LANGUAGES,
          COLUMNS.ENROLLED_BY,
          COLUMNS.START_DATE,
          COLUMNS.STATUS,
          COLUMNS.DELIVERY,
          COLUMNS.DELIVERY_TYPE,
          COLUMNS.TARGET_USERS,
          COLUMNS.ENROLLMENT_TAGS
        ],
        iEmpty: {
          message: labels.EmptyEnrollmentInfographic
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: this.showDownloadButton,
          disabled: !this.$store.getters['permissions/getExportEnrollmentPermission']
        },
        rowActions: this.isTrash
          ? trashRowActions
          : [
              {
                id: 'btn-send--row-actions-enrollments-list',
                name: labels.SendTraining,
                icon: 'mdi-send'
              },
              {
                id: 'btn-edit--row-actions-enrollments-list',
                name: labels.Edit,
                icon: 'mdi-pencil',
                disabled: !this.$store.getters['permissions/getEnrollmentEditPermission']
              },
              {
                id: 'btn-preview--row-actions-enrollments-list',
                name: labels.Preview,
                icon: 'mdi-eye'
              },
              {
                id: 'btn-delete--row-actions-enrollments-list',
                name: labels.Delete,
                icon: 'mdi-delete',
                disabled: !this.$store.getters['permissions/getDeleteEnrollmentPermission']
              },
              {
                id: 'btn-download-package--row-actions-enrollments-list',
                name: labels.DownloadPackage,
                icon: 'mdi-download',
                disabled: !this.$store.getters['permissions/getDeleteEnrollmentPermission']
              }
            ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  mounted() {
    this.callForData()
  },
  computed: {
    getPreferredLanguageTypes() {
      return this.$store.getters['trainingLibraryHelpers/getPreferredLanguageTypes'] || []
    },
    savedFiltersKey() {
      return this.isTrash
        ? DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_INFOGRAPHIC_LIST
        : DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_INFOGRAPHIC_LIST
    },
    savedTableSettingsKey() {
      return this.isTrash
        ? TABLE_SETTINGS_KEYS.TRASH_INFOGRAPHIC_LIST
        : TABLE_SETTINGS_KEYS.ENROLLMENTS_INFOGRAPHIC_LIST
    }
  },
  methods: {
    callForData() {
      this.setLoading(true)
      this.apiFunc(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response || { data: { data: {} } }
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const enrichedResults = results?.map((item) => {
            return {
              ...item,
              languageCodes: item.languages, // Orijinal kodları sakla
              languages: item.languages?.map((code) => {
                const language = (this.languages || []).find((lang) => lang.code === code)
                return language?.isoFriendlyName || code
              }),
              targetAudience: item.trainingRoles?.map((role) => role.roleName) || []
            }
          })
          this.tableData = enrichedResults || []
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
          filter: this.axiosPayload.filter,
          enrollmentType: this.axiosPayload.enrollmentType
        }
        AwarenessEducatorService.exportEnrollments(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Infographic-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
