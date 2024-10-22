<template>
  <Fragment>
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
                @input="dateRange = ''"
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
      <div class="gamification-report__top-performers mb-6">
        <div class="gamification-report__top-performers-header">
          Top Performers for Selected Period
        </div>
        <div class="gamification-report__top-performers-content">
          <LeaderboardTopPerformerCard
            v-for="(performer, index) in performers"
            :performer="performer"
            :key="index"
          />
        </div>
      </div>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        filterable
        options
        is-server-side
        row-key="resourceId"
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
      />
    </KContainer>
  </Fragment>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import { Fragment } from 'vue-frag'
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import LeaderboardTopPerformerCard from '@/components/GamificationReport/LeaderboardTopPerformerCard'
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
export default {
  name: 'GamificationReport',
  components: {
    KContainer,
    Fragment,
    DataTable,
    CompanySettingsHeader,
    LeaderboardTopPerformerCard,
    InputDate
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'leaderboard-data-table'
      },
      dateRange: '',
      parsedFormat: getTimeZone(false),
      selectedDateRange: [
        this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
        this.$moment(Date.now()).format(getTimeZoneForMoment())
      ],
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refInputDate
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
          // this.formData.datePeriod = 5
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
              // this.formData.datePeriod = 0
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
              // this.formData.datePeriod = 1
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
              // this.formData.datePeriod = 2
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
              // this.formData.datePeriod = 3
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
              // this.formData.datePeriod = 4
            }
          }
        ],
        disabledDate: this.disabledDates
      },
      performers: [
        {
          type: 'gold',
          name: 'Trevon Duffy',
          email: 'trevon@example.com',
          department: 'Management',
          score: '12500'
        },
        {
          type: 'silver',
          name: 'Trevon Duffy',
          email: 'trevon@example.com',
          department: 'Management',
          score: '12500'
        },
        {
          type: 'bronze',
          name: 'Trevon Duffy',
          email: 'trevon@example.com',
          department: 'Management',
          score: '12500'
        }
      ],
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.LEADERBOARD,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.LEADERBOARD,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          {
            property: 'rank',
            align: 'center',
            label: 'Rank',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 120
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
            overrideWidth: 175
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
            overrideWidth: 175
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
            overrideWidth: 175
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
            overrideWidth: 175
          },
          {
            property: 'performance',
            align: 'center',
            editable: false,
            label: 'Performance',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'totalPoints',
            align: 'center',
            fixed: 'right',
            editable: false,
            label: 'Total Points',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number'
          }
        ],
        iEmpty: {
          message: 'No leaderboard data'
        },
        addButton: {
          show: false
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  computed: {
    getDateRangeText() {
      if (this.dateRange) return this.dateRange
      if (this.selectedDateRange?.length < 2) return
      const firstDateLeft = this.selectedDateRange?.[0]?.split?.(' ')?.[0] || ''
      const lastDateLeft = this.selectedDateRange?.[1]?.split?.(' ')?.[0] || ''
      if (!firstDateLeft || !lastDateLeft) return ''
      return `${firstDateLeft} - ${lastDateLeft}`
    }
  },
  methods: {
    callForData() {
      // TODO: Add search endpoint
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
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        // TODO: Add export endpoint
        // AwarenessEducatorService.exportCertificates(payload).then((response) => {
        //   const { data } = response
        //   const link = document.createElement('a')
        //   link.href = window.URL.createObjectURL(data)
        //   link.download = `Leaderboard.${
        //     item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
        //   }`
        //   link.click()
        // })
      })
    }
  }
}
</script>
