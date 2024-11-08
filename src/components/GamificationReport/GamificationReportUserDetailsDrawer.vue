<template>
  <Fragment>
    <DownloadModal
      v-if="isShowDownloadModal"
      :isShow="isWantToDownload"
      :download="{ xls: true, csv: true, pdf: true }"
      :title="downloadModalTitle"
      @downloadEvent="exportUserDetails"
      @changeDownloadModalStatus="changeDownloadModalStatus"
    />
    <VNavigationDrawer
      :value="status"
      class="k-navigation-drawer"
      temporary
      fixed
      overlay-color="rgba(0, 0, 0, 0.17)"
      overlay-opacity="1"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
      style="z-index: 10;"
    >
      <div class="gamification-report__user-details-drawer-content">
        <div class="gamification-report__user-details-drawer-header">
          <div class="gamification-report__user-details-drawer-header__user-info">
            <span class="gamification-report__user-details-drawer-header__user-name">
              {{ selectedRow.firstName }} {{ selectedRow.lastName }}
            </span>
            <span class="gamification-report__user-details-drawer-header__user-email">
              {{ selectedRow.email }} {{ !!selectedRow.department ? ' - ' : '' }}
              {{ selectedRow.department }}
            </span>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#FFFFFF" large @click="$emit('on-close')"
              >mdi-close</VIcon
            >
          </div>
        </div>
        <div class="gamification-report__user-details-drawer-card">
          <div
            class="gamification-report__user-details-drawer-card-content"
            :style="{ gridTemplateColumns: `repeat(${productScores.length + 1}, 1fr)` }"
          >
            <div class="gamification-report__user-details-drawer-card__overall-score">
              <span class="gamification-report__user-details-drawer-card__overall-score-text"
                >Overall score</span
              >
              <span
                class="gamification-report__user-details-drawer-card__overall-score-percentage"
                >{{ overallScore.percentage }}</span
              >
              <span class="gamification-report__user-details-drawer-card__overall-score-points"
                >{{ overallScore.points }} pts</span
              >
            </div>
            <div
              v-for="(item, index) in productScores"
              :key="index"
              class="gamification-report__user-details-drawer-card__product"
            >
              <img :src="getCardProductIcon(item.product)" :alt="item.product" />
              <span class="gamification-report__user-details-drawer-card__product-text">{{
                item.product
              }}</span>
              <span class="gamification-report__user-details-drawer-card__product-percentage">{{
                item.percentage
              }}</span>
            </div>
          </div>
        </div>
        <div class="gamification-report__user-details-drawer-body">
          <span class="gamification-report__user-details-drawer-body-header">
            User Activity Timeline
          </span>
          <div class="gamification-report__user-details-drawer-filters">
            <div class="gamification-report__user-details-drawer-filters-left">
              <VTextField
                :value="search"
                style="max-width: 300px;"
                id="input--search-training-library"
                class="training-library-list-view-first-card-header__search"
                ref="searchInput"
                outlined
                prepend-inner-icon="mdi-magnify"
                hide-details
                placeholder="Search"
                @input="handleSearch"
              />
              <VCheckbox
                v-model="isOnlyShowFailedEvents"
                color="#2196F3"
                label="Show only failed events"
                hide-details
                style="padding: 0px;"
              />
            </div>
            <div class="gamification-report__user-details-drawer-filters-right">
              <VTooltip bottom opacity="1">
                <template #activator="{ on }">
                  <VBtn
                    v-on="on"
                    :id="`btn-refresh--table-${Math.random().toString().substring(2)}`"
                    icon
                    style="order: 4;"
                  >
                    <VIcon @click="handleRefresh">mdi-refresh</VIcon>
                  </VBtn>
                </template>
                <span class="tooltip-span">{{ 'Refresh' }}</span>
              </VTooltip>
              <VMenu v-model="isDownloadMenuOpen" bottom left offset-y>
                <template #activator="{ on: menu, attrs }">
                  <VTooltip bottom opacity="1">
                    <template #activator="{ on: tooltip }">
                      <VBtn
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                        :id="`btn-download--table-${Math.random().toString().substring(2)}`"
                        class="btn-hover mr-1"
                        icon
                        style="order: 5;"
                      >
                        <v-icon>mdi-download</v-icon>
                      </VBtn>
                    </template>
                    <span class="tooltip-span">Download Options</span>
                  </VTooltip>
                </template>
                <VListItem
                  v-for="(item, index) in downloadButtonOptions"
                  :id="`item--download-option-${index}`"
                  :key="index"
                  @click="handleDownloadButtonClick(item)"
                >
                  <VListItemTitle>{{ item }}</VListItemTitle>
                </VListItem>
              </VMenu>
            </div>
          </div>
          <div class="gamification-report__user-details-drawer-timeline">
            <VTimeline v-if="!!timeline.length" dense clipped>
              <VTimelineItem v-for="(item, index) in timeline" :key="index" medium>
                <template #icon>
                  <img
                    :src="getProductIconPath(item)"
                    :alt="`${item.product} - ${item.activityType}`"
                  />
                </template>
                <div
                  :class="[
                    'gamification-report__timeline-item',
                    index === 0 ? 'gamification-report__timeline-item--first' : ''
                  ]"
                >
                  <div class="d-flex justify-space-between align-items-center">
                    <span
                      class="gamification-report__timeline-item-activity-type"
                      :style="{ color: ACTIVITY_TYPE_COLOR_MAP[item.activityType] }"
                      >{{ item.activityType }}</span
                    >
                    <span class="gamification-report__timeline-item-date">{{
                      getDateText(item)
                    }}</span>
                  </div>
                  <span class="gamification-report__timeline-item-middle-text">
                    <span class="gamification-report__timeline-item-bold-text">{{
                      item.points
                    }}</span>
                    with
                    <span class="gamification-report__timeline-item-bold-text">{{
                      item.campaignPerformanceRate || item.trainingPerformanceRate
                    }}</span>
                    total score on
                    <span class="gamification-report__timeline-item-bold-text">{{
                      item.campaignName || item.trainingName
                    }}</span>
                    with
                    <span class="gamification-report__timeline-item-bold-text">{{
                      item.difficulty || item.category
                    }}</span>
                    {{ item.product === 'Awareness Educator' ? 'category' : 'difficulity' }}.
                  </span>
                  <div>
                    <span class="gamification-report__timeline-item-bottom-text"
                      >{{ item.product }}{{ !!getScenarioMethodText(item) ? ' - ' : ''
                      }}{{ getScenarioMethodText(item) }}</span
                    >
                  </div>
                </div>
              </VTimelineItem>
            </VTimeline>
            <div v-else class="gamification-report__user-details-drawer-timeline-empty">
              <span class="gamification-report__user-details-drawer-timeline-empty-text"
                >The user does not have any activity</span
              >
            </div>
            <VHover v-slot="{ hover }">
              <VBtn
                block
                outlined
                text
                style="border: none;"
                class="mt-2"
                :style="{ 'background-color': hover ? '#F2F2F2' : '#FFFFFF' }"
              >
                <span style="color: #2196f3; font-weight: 600;">LOAD MORE</span>
              </VBtn>
            </VHover>
          </div>
        </div>
      </div>
    </VNavigationDrawer>
  </Fragment>
</template>
<script>
import { Fragment } from 'vue-frag'
import { PRODUCTS, ACTIVITY_TYPE_COLOR_MAP, ACTIVITY_TYPES_FAIL_MAP } from './utils'
import useDebounce from '@/hooks/useDebounce'
import DownloadModal from '@/components/DataTableComponents/DownloadModal'
import { mapGetters } from 'vuex'
import { VNavigationDrawer } from 'vuetify/lib'
export default {
  name: 'GamificationReportUserDetailsDrawer',
  components: { Fragment, DownloadModal },
  mixins: [useDebounce],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOnlyShowFailedEvents: false,
      downloadModalTitle: '',
      isShowDownloadModal: false,
      downloadButtonOptions: ['Download Current Page', 'Download All'],
      isDownloadMenuOpen: false,
      search: '',
      ACTIVITY_TYPE_COLOR_MAP,
      overallScore: {
        percentage: '82%',
        points: 2302
      },
      productScores: [
        {
          product: 'Phishing Simulation',
          percentage: '80%'
        },
        {
          product: 'Callback Simulation',
          percentage: '80%'
        },
        {
          product: 'Vishing Simulation',
          percentage: '80%'
        },
        {
          product: 'Awareness Educator',
          percentage: '80%'
        },
        {
          product: 'Smishing Simulation',
          percentage: '80%'
        },
        {
          product: 'Quishing Simulation',
          percentage: '80%'
        }
      ],
      timeline: [
        {
          activityType: 'Clicked Link',
          product: 'Phishing Simulator',
          scenarioMethod: 'Click Only',
          points: -100,
          campaignPerformanceRate: '50%',
          campaignName: 'New Campaign',
          difficulty: 'Hard',
          date: new Date(),
          timezoneId: 'Dateline Standard Time'
        },
        {
          activityType: 'Answered',
          product: 'Vishing Simulator',
          points: -100,
          campaignPerformanceRate: '50%',
          campaignName: 'New Campaign',
          difficulty: 'Hard',
          date: new Date(),
          timezoneId: 'Dateline Standard Time'
        },
        {
          activityType: 'Training Completed',
          product: 'Awareness Educator',
          materialType: 'Training',
          points: 100,
          trainingPerformanceRate: '50%',
          trainingName: 'New Campaign',
          category: 'Remote Working Security',
          date: new Date(),
          timezoneId: 'Dateline Standard Time'
        },
        {
          activityType: 'Training Not Completed',
          product: 'Awareness Educator',
          materialType: 'Training',
          points: -100,
          trainingPerformanceRate: '50%',
          trainingName: 'New Campaign',
          category: 'Remote Working Security',
          date: new Date(),
          timezoneId: 'Dateline Standard Time'
        },
        {
          activityType: 'Exam Failed',
          product: 'Awareness Educator',
          materialType: 'Training',
          points: -50,
          trainingPerformanceRate: '50%',
          trainingName: 'New Campaign',
          category: 'Remote Working Security',
          date: new Date(),
          timezoneId: 'Dateline Standard Time'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isWantToDownload: 'common/getDownloadModalStatus' // for using getters
    }),
    timezones() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    }
  },
  created() {
    this.callForData()
    this.callForGetTimeZones()
  },
  methods: {
    callForData() {
      // TODO: Call for activity
    },
    handleSearch(event) {
      this.debounce(() => {
        // TODO: Call for search
      })
    },
    handleRefresh() {
      this.callForData()
    },
    handleDownloadButtonClick(item = '') {
      this.isShowDownloadModal = true
      this.downloadModalTitle = item
      this.changeDownloadModalStatus(true)
    },
    changeDownloadModalStatus(status) {
      this.$store.dispatch('common/changeDownloadModalStatus', status)
    },
    exportUserDetails(downloadTypes) {
      const downloadSettings = {
        exportTypes: downloadTypes,
        pageNumber: this.serverSideEvents.pagination
          ? this.serverSideProps.pageNumber
          : this.currentPage,
        pageSize: this.serverSideEvents.pagination ? this.serverSideProps.pageSize : this.rowCount,
        reportAllPages: this.downloadModalTitle === this.downloadButtonOptions[1]
      }
      downloadSettings.exportTypes.forEach((item) => {
        let payload = {
          exportType: item === 'XLS' ? 'Excel' : item,
          reportAllPages: downloadSettings.reportAllPages,
          datePeriod: this.axiosPayload.datePeriod,
          filter: this.axiosPayload.filter,
          pagination: {
            pageNumber: downloadSettings.pageNumber,
            pageSize: downloadSettings.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending
          }
        }
        // TODO: Add export endpoint
        // exportLeaderboardData(payload).then((response) => {
        //   const { data } = response
        //   const link = document.createElement('a')
        //   link.href = window.URL.createObjectURL(data)
        //   link.download = `Leaderboard-User-Details.${
        //     item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
        //   }`
        //   link.click()
        // })
      })
    },
    getCardProductIcon(product) {
      if (product === 'Phishing Simulation')
        return require('@/assets/img/gamification-report-user-details-phishing-icon.svg')
      if (product === 'Callback Simulation')
        return require('@/assets/img/gamification-report-user-details-callback-icon.svg')
      if (product === 'Vishing Simulation')
        return require('@/assets/img/gamification-report-user-details-vishing-icon.svg')
      if (product === 'Awareness Educator')
        return require('@/assets/img/gamification-report-user-details-awareness-icon.svg')
      if (product === 'Smishing Simulation')
        return require('@/assets/img/gamification-report-user-details-smishing-icon.svg')
      if (product === 'Quishing Simulation')
        return require('@/assets/img/gamification-report-user-details-quishing-icon.svg')
      return require('@/assets/img/gamification-report-user-details-phishing-icon.svg')
    },
    getProductIconPath(item) {
      if (item.product === 'Phishing Simulator') {
        if (ACTIVITY_TYPES_FAIL_MAP[item.activityType]) {
          return require('@/assets/img/timeline-phishing-fail-icon.svg')
        }
        return require('@/assets/img/timeline-phishing-success-icon.svg')
      }
      if (item.product === 'Callback Simulator') {
        if (ACTIVITY_TYPES_FAIL_MAP[item.activityType]) {
          return require('@/assets/img/timeline-callback-fail-icon.svg')
        }
        return require('@/assets/img/timeline-callback-success-icon.svg')
      }
      if (item.product === 'Vishing Simulator') {
        if (ACTIVITY_TYPES_FAIL_MAP[item.activityType]) {
          return require('@/assets/img/timeline-vishing-fail-icon.svg')
        }
        return require('@/assets/img/timeline-vishing-answered-icon.svg')
      }
      if (item.product === 'Smishing Simulator') {
        return require('@/assets/img/timeline-smishing-fail-icon.svg')
      }
      if (item.product === 'Quishing Simulator') {
        if (ACTIVITY_TYPES_FAIL_MAP[item.activityType]) {
          return require('@/assets/img/timeline-quishing-fail-icon.svg')
        }
        return require('@/assets/img/timeline-quishing-success-icon.svg')
      }
      if (item.product === 'Awareness Educator') {
        if (ACTIVITY_TYPES_FAIL_MAP[item.activityType]) {
          return require('@/assets/img/timeline-awareness-fail-icon.svg')
        }
        return require('@/assets/img/timeline-awareness-success-icon.svg')
      }
      return require('@/assets/img/timeline-phishing-success-icon.svg')
    },
    getScenarioMethodText(item) {
      if (['Vishing Simulator', 'Callback Simulator'].includes(item.product)) {
        return ''
      }
      if (item.product === 'Awareness Educator') {
        return item?.materialType || ''
      }
      return item.scenarioMethod
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    getDateText(item) {
      const timezoneText = this.timezones?.find?.((tz) => tz.value === item.timezoneId)?.text || ''
      const timzoneLeftText = timezoneText.split(' ')[0]
      let timeFormat = localStorage.getItem('selectedTimeFormat') || '24h'
      let is12H = timeFormat === '12h'
      if (is12H) {
        timeFormat = 'hh'
      } else {
        timeFormat = 'HH'
      }
      const timeZoneRightText = is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`
      return `${this.$moment(item.date).format(`MMM D ${timeZoneRightText}`)} ${timzoneLeftText}`
    }
  }
}
</script>
