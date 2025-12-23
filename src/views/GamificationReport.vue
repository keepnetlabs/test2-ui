<template>
  <Fragment>
    <GamificationReportUserDetailsDrawer
      v-if="isUserDetailsDrawerOpen"
      :status="isUserDetailsDrawerOpen"
      :selectedRow="selectedRow"
      :formDetails="formDetails"
      :datePayload="getDatePayload"
      @on-close="handleCloseDrawer"
    />
    <SendWithAIDialog
      v-if="isSendWithAIDialogOpen"
      :status="isSendWithAIDialogOpen"
      :options="sendWithAIOptions"
      @closeOverlay="handleCloseSendWithAIDialog"
      @confirm="handleConfirmSendWithAI"
    />
    <KContainer id="gamification-report">
      <CompanySettingsHeader title="Leaderboard" :slots="{ title: true }">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            <span style="font-weight: 600;" class="company-settings__title">
              Leaderboard
            </span>
            <div class="d-flex align-center">
              <span class="d-flex align-center" style="flex-shrink: 0;">{{
                getDateRangeText
              }}</span>
              <InputDate
                v-model="selectedDateRange"
                type="datetimerange"
                ref="refInputDate"
                style="visibility: hidden; position: absolute; min-width: 128px;"
                :format="parsedFormat"
                :valueFormat="parsedFormat"
                :picker-options="pickerOptions"
                :prefix-icon="'el-icon-date'"
                :clearable="false"
              />
              <VBtn
                class="training-library-card__footer-btn ml-6"
                color="#fff"
                rounded
                :ripple="false"
                @click="handleDateRangeClick"
              >
                <VIcon class="mr-1" left>mdi-calendar-range</VIcon>
                DATE RANGE
              </VBtn>
            </div>
          </div>
        </template>
      </CompanySettingsHeader>
      <DatatableLoading v-if="isTopPerformersLoading" :loading="isTopPerformersLoading" />
      <div v-else class="gamification-report__top-performers mb-6">
        <div class="gamification-report__top-performers-header">
          Top Performers
        </div>
        <div
          v-if="topPerformers && !!topPerformers.length"
          class="gamification-report__top-performers-content"
        >
          <LeaderboardTopPerformerCard
            v-for="(performer, index) in topPerformers"
            :performer="performer"
            :isAllDepartmentsEmpty="topPerformers.every((tp) => !tp.department)"
            :key="index"
            @click="handleDetails(performer)"
          />
        </div>
        <div v-else class="gamification-report__top-performers-content-empty">
          <figure>
            <img
              src="@/assets/img/top-performers-empty-icon.svg"
              alt="Top performers will be seen here."
            />
          </figure>
          <span class="gamification-report__top-performers-content-empty-text"
            >Top performers will be seen here.</span
          >
        </div>
      </div>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        filterable
        options
        is-server-side
        row-key="targetUserResourceId"
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
        @downloadEvent="exportLeaderboard"
        @on-details="handleDetails"
        @on-send-with-ai="handleSendWithAI"
      />
    </KContainer>
  </Fragment>
</template>

<script>
import {
  getLeaderboardData,
  getTopPerformersData,
  exportLeaderboardData,
  getLeaderboardFormDetails
} from '@/api/reports'
import KContainer from '@/components/KContainer/KContainer'
import { Fragment } from 'vue-frag'
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import LeaderboardTopPerformerCard from '@/components/GamificationReport/LeaderboardTopPerformerCard'
import { getTimeZone, getTimeZoneForMoment, getDefaultAxiosPayload } from '@/utils/functions'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { DATE_PERIOD_ENUMS } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import { mapGetters } from 'vuex'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer'
import SendWithAIDialog from '@/components/GamificationReport/SendWithAIDialog'
import labels from '@/model/constants/labels'
import axios from 'axios'
import AuthenticationService from '@/services/authentication'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
export default {
  name: 'GamificationReport',
  components: {
    KContainer,
    Fragment,
    DataTable,
    CompanySettingsHeader,
    LeaderboardTopPerformerCard,
    InputDate,
    DatatableLoading,
    GamificationReportUserDetailsDrawer,
    SendWithAIDialog
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    const rowActions = [
      {
        name: labels.Details,
        id: 'btn-interactions--row-actions-training-report-sending-report',
        icon: '$custom-details',
        action: 'on-details'
      }
    ]
    if (
      window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('test-ui.devkeepnet.com')
    ) {
      rowActions.push({
        name: 'Autonomous AI',
        id: 'btn-send-with-ai-gamification-report',
        icon: 'mdi-creation',
        action: 'on-send-with-ai'
      })
    }
    return {
      formDetails: null,
      labels,
      isUserDetailsDrawerOpen: false,
      selectedRow: null,
      isSendWithAIDialogOpen: false,
      selectedRowForAI: null,
      sendWithAIOptions: {
        training: true,
        phishing: true
      },
      CONSTANTS: {
        id: 'leaderboard-data-table'
      },
      isTopPerformersLoading: true,
      parsedFormat: getTimeZone(false),
      selectedDateRange: [
        this.$moment(Date.now()).subtract(1, 'months').format(getTimeZoneForMoment()),
        this.$moment(Date.now()).format(getTimeZoneForMoment())
      ],
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refInputDate
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
          this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.Custom
        },
        shortcuts: [
          {
            text: 'Last month',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              start.setDate(1)
              picker.$emit('pick', [start, end])
              this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.LastMonth
            }
          },
          {
            text: 'Last 3 months',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              start.setMonth(start.getMonth() + 1)
              start.setDate(1)
              picker.$emit('pick', [start, end])
              this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.Last3Months
            }
          },
          {
            text: 'Last 6 months',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              start.setMonth(start.getMonth() + 1)
              start.setDate(1)
              picker.$emit('pick', [start, end])
              this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.Last6Months
            }
          },
          {
            text: 'Last Year',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              start.setMonth(start.getMonth() + 1)
              start.setDate(1)
              picker.$emit('pick', [start, end])
              this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.LastYear
            }
          },
          {
            text: 'This Year',
            onClick: (picker) => {
              const today = new Date()
              const year = today.getFullYear()
              const firstDayOfYear = new Date(year, 0, 1)
              const lastDayOfYear = new Date(year, today.getMonth(), today.getDate())
              picker.$emit('pick', [firstDayOfYear, lastDayOfYear])
              this.axiosPayload.datePeriod = DATE_PERIOD_ENUMS.ThisYear
            }
          }
        ],
        disabledDate: this.disabledDates
      },
      axiosPayload: getDefaultAxiosPayload({
        orderBy: 'rank',
        ascending: true,
        datePeriod: DATE_PERIOD_ENUMS.LastMonth,
        startDate: null,
        endDate: null
      }),
      tableData: [],
      topPerformers: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.LEADERBOARD,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.LEADERBOARD,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        rowActions,
        columns: [
          {
            property: 'rank',
            align: 'center',
            label: 'Rank',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            overrideWidth: true,
            width: 150
          },
          {
            property: 'firstName',
            align: 'left',
            label: 'First Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            overrideWidth: true,
            minWidth: 160
          },
          {
            property: 'lastName',
            align: 'left',
            label: 'Last Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            overrideWidth: true,
            minWidth: 160
          },
          {
            property: 'email',
            align: 'left',
            label: 'Email',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            overrideWidth: true,
            minWidth: 175
          },
          {
            property: 'department',
            align: 'left',
            editable: false,
            label: 'Department',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            overrideWidth: true,
            minWidth: 175
          },
          {
            property: 'preferredLanguage',
            align: 'left',
            editable: false,
            label: 'Preferred Language',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [],
            overrideWidth: true,
            filterableCustomFieldName: 'preferredLanguageId',
            width: 200
          },

          {
            property: 'performance',
            align: 'right',
            editable: false,
            label: 'Performance',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number',
            overrideWidth: true,
            minWidth: 175
          },
          {
            property: 'points',
            align: 'right',
            editable: false,
            label: 'Total Points',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'negativeNumber',
            overrideWidth: true,
            minWidth: 175
          }
        ],
        iEmpty: {
          message: 'The target users will be displayed here based on their total points.'
        },
        addButton: {
          show: false
        }
      }
    }
  },
  created() {
    this.callForData()
    this.callForTopPerformers()
    this.callForFormDetails()
    this.callForLanguages()
  },
  computed: {
    ...mapGetters({
      getGamificationReportSearchPermissions: 'permissions/getGamificationReportSearchPermissions',
      getGamificationReportTopPerformersPermissions:
        'permissions/getGamificationReportTopPerformersPermissions'
    }),
    getDatePayload() {
      return {
        datePeriod: this.axiosPayload.datePeriod,
        startDate: this.axiosPayload.startDate,
        endDate: this.axiosPayload.endDate
      }
    },
    getDateRangeText() {
      if (this.selectedDateRange?.length < 2) return
      const firstDateLeft = this.selectedDateRange?.[0]?.split?.(' ')?.[0] || ''
      const lastDateLeft = this.selectedDateRange?.[1]?.split?.(' ')?.[0] || ''
      if (!firstDateLeft || !lastDateLeft) return ''
      return `${firstDateLeft} - ${lastDateLeft}`
    }
  },
  watch: {
    selectedDateRange: {
      deep: true,
      handler(val) {
        if (val?.length < 2) return
        this.axiosPayload.startDate = val[0]
        this.axiosPayload.endDate = val[1]
        this.callForData()
        this.callForTopPerformers()
      }
    }
  },
  methods: {
    callForFormDetails() {
      getLeaderboardFormDetails().then((res) => {
        this.formDetails = res?.data?.data || []
      })
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        const languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
            value: language.resourceId
          })) || []
        const preferredLanguageColumn = this.tableOptions.columns.find(
          (col) => col.property === 'preferredLanguage'
        )
        if (preferredLanguageColumn) {
          this.$set(preferredLanguageColumn, 'filterableItems', languageOptions)
          // Re-render filters if table is already rendered
          if (this.$refs.refTable) {
            this.$refs.refTable.reRenderFilters()
          }
        }
      })
    },
    callForData() {
      if (!this.getGamificationReportSearchPermissions) return
      this.setLoading(true)
      const arrangedPayload = {
        datePeriod: this.axiosPayload.datePeriod,
        startDate: this.axiosPayload.startDate,
        endDate: this.axiosPayload.endDate,
        filter: this.axiosPayload.filter,
        pagination: {
          pageNumber: this.axiosPayload.pageNumber,
          pageSize: this.axiosPayload.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending
        }
      }
      getLeaderboardData(arrangedPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData =
            results?.map?.((row) => ({
              ...row,
              performance: `${row.performance}%`
            })) || []
        })
        .finally(this.setLoading)
    },
    callForTopPerformers() {
      if (!this.getGamificationReportTopPerformersPermissions) return
      this.isTopPerformersLoading = true
      const { datePeriod, startDate, endDate } = this.axiosPayload
      const payload = {
        datePeriod,
        startDate,
        endDate
      }
      getTopPerformersData(payload)
        .then((response) => {
          this.topPerformers = response?.data?.data?.results || []
        })
        .finally(() => {
          this.isTopPerformersLoading = false
        })
    },
    handleDateRangeChange(dateRange) {
      if (dateRange?.length < 2) return
      this.axiosPayload.startDate = dateRange[0]
      this.axiosPayload.endDate = dateRange[1]
      this.callForData()
      this.callForTopPerformers()
    },
    disabledDates(date) {
      const lastYear = new Date()
      lastYear.setFullYear(lastYear.getFullYear() - 1)
      return date.getTime() < lastYear.getTime() || date.getTime() > new Date().getTime()
    },
    handleDateRangeClick() {
      this.$refs.refInputDate.showPicker()
    },
    exportLeaderboard(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          exportType: item === 'XLS' ? 'Excel' : item,
          reportAllPages: downloadTypes.reportAllPages,
          datePeriod: this.axiosPayload.datePeriod,
          filter: this.axiosPayload.filter,
          pagination: {
            pageNumber: downloadTypes.pageNumber,
            pageSize: downloadTypes.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending
          }
        }
        exportLeaderboardData(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Leaderboard.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleDetails(row) {
      this.selectedRow = row
      this.isUserDetailsDrawerOpen = true
    },
    handleCloseDrawer() {
      document.querySelector('.k-navigation-drawer').style.right = '-100%'
      setTimeout(() => {
        this.selectedRow = null
        this.isUserDetailsDrawerOpen = false
      }, 250)
    },
    handleSearchChange(searchFilter) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]

      let searchText = ''
      if (searchFilter && searchFilter.filter && searchFilter.filter.FilterGroups) {
        const orGroup = searchFilter.filter.FilterGroups[0]
        if (orGroup && orGroup.FilterItems && orGroup.FilterItems.length > 0) {
          const fullNameFilter = orGroup.FilterItems.find((item) => item.FieldName === 'fullName')
          if (fullNameFilter) {
            searchText = fullNameFilter.Value || ''
          } else {
            searchText = searchFilter.filter.FilterGroups[0].FilterItems[0].Value || ''
          }
        }
      }

      if (this.axiosPayload.filter.FilterGroups) {
        const orGroup = this.axiosPayload.filter.FilterGroups.find(
          (group) => group.Condition === 'OR'
        )
        if (orGroup && orGroup.FilterItems) {
          orGroup.FilterItems = orGroup.FilterItems.filter((item) => item.FieldName !== 'fullName')
        }
      }
      if (searchText && searchText.trim()) {
        const searchTerm = searchText.trim()
        let orFilterGroup = this.axiosPayload.filter.FilterGroups.find(
          (group) => group.Condition === 'OR'
        )

        if (!orFilterGroup) {
          orFilterGroup = {
            Condition: 'OR',
            FilterItems: []
          }
          this.axiosPayload.filter.FilterGroups.push(orFilterGroup)
        }

        orFilterGroup.FilterItems.push({
          FieldName: 'fullName',
          Operator: 'Contains',
          Value: searchTerm
        })
      }
      this.resetPageNumber()
      this.callForData()
    },
    handleSendWithAI(row) {
      this.selectedRowForAI = row
      this.sendWithAIOptions = {
        training: true,
        phishing: true
      }
      this.isSendWithAIDialogOpen = true
    },
    handleCloseSendWithAIDialog() {
      this.isSendWithAIDialogOpen = false
      this.selectedRowForAI = null
      this.sendWithAIOptions = {
        training: true,
        phishing: true
      }
    },
    handleConfirmSendWithAI(options) {
      const token = AuthenticationService.getToken()
      const { preferredLanguage, targetUserResourceId, department } = this.selectedRowForAI
      const actions = []

      if (options.training) {
        actions.push('training')
      }
      if (options.phishing) {
        actions.push('phishing')
      }

      const body = {
        token,
        preferredLanguage,
        targetUserResourceId,
        departmentName: department,
        actions,
        sendAfterPhishingSimulation:
          options.training && options.phishing
            ? options.sendAfterPhishingSimulation || false
            : false
      }
      const isLocalhost = window.location.hostname.includes('localhost')
      const url = isLocalhost
        ? 'http://localhost:4111/autonomous'
        : 'https://agentic-ally.keepnet-labs-ltd-business-profile4086.workers.dev/autonomous'
      axios
        .post(url, body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('Response:', response)
          this.handleCloseSendWithAIDialog()
        })
        .catch((error) => {
          console.error('Error sending data to autonomous:', error)
        })
    }
  }
}
</script>
