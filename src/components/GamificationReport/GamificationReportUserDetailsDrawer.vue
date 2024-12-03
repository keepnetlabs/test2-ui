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
            <ThreeListItemLoading
              v-if="isPerformanceRatesLoading"
              :loading="isPerformanceRatesLoading"
            />
            <template v-else>
              <div class="gamification-report__user-details-drawer-card__overall-score">
                <span class="gamification-report__user-details-drawer-card__overall-score-text"
                  >Overall performance</span
                >
                <span
                  class="gamification-report__user-details-drawer-card__overall-score-percentage"
                  >{{ overallScore.percentage }}%</span
                >
                <span class="gamification-report__user-details-drawer-card__overall-score-points"
                  >{{ overallScore.points }} points</span
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
            </template>
          </div>
        </div>
        <div class="gamification-report__user-details-drawer-body">
          <h2 class="gamification-report__user-details-drawer-body-header">
            User Activity Timeline
          </h2>
          <div class="gamification-report__user-details-drawer-filters-container">
            <div class="gamification-report__user-details-drawer-filters">
              <div class="gamification-report__user-details-drawer-filters-left">
                <!-- <VTextField
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
                /> -->
                <VMenu
                  :value="menu"
                  ref="refMenu"
                  bottom
                  offset-y
                  nudge-bottom="12"
                  :close-on-content-click="false"
                  :close-on-click="isCloseOnClick"
                  content-class="filter-options__menu-content"
                  class="filter-options__menu training-library-filtering-options"
                  @input="handleMenuVisibilityChange"
                >
                  <template #activator="{ on }">
                    <div v-on="on">
                      <VTextField
                        ref="refFiltersInput"
                        class="pointer-none"
                        id="input--training-library-filters"
                        outlined
                        hide-details
                        autocomplete="off"
                        placeholder="Filters"
                        prepend-inner-icon="mdi-filter-variant"
                        append-icon="mdi-menu-down"
                      />
                    </div>
                  </template>
                  <div class="training-library-filters-container">
                    <div class="training-library-filters-container__left">
                      <div v-for="filter in filters" v-if="filter.show" :key="filter.key">
                        <VListItem
                          :class="[
                            'training-library-filtering-options-parent-list-item cursor-pointer',
                            filter && activeFilter.key === filter.key
                              ? 'training-library-filter-active'
                              : ''
                          ]"
                          @click="handleSetActiveFilter(filter)"
                        >
                          <VListItemTitle
                            class="training-library-filtering-options-parent-list-item-title"
                          >
                            <div
                              class="training-library-filtering-options-parent-list-item-title__left-side"
                            >
                              <VIcon
                                :color="
                                  filter && activeFilter.key === filter.key ? '#2196F3' : '#757575'
                                "
                                >{{ filter.icon }}</VIcon
                              >
                              <span
                                :style="
                                  filter && activeFilter.key === filter.key ? 'color: #2196F3' : ''
                                "
                                >{{ filter.text }}</span
                              >
                            </div>
                            <div
                              class="training-library-filtering-options-parent-list-item-title__right-side"
                            >
                              <div
                                v-if="filter.isFilterActive"
                                class="training-library-filter-number"
                              >
                                {{
                                  filter.filterType === 'search' ||
                                  filter.filterType === 'longTextSearch'
                                    ? filter.activeValue.length
                                    : 1
                                }}
                              </div>
                              <VIcon
                                :color="
                                  filter && activeFilter.key === filter.key ? '#2196F3' : '#757575'
                                "
                                >mdi-menu-right</VIcon
                              >
                            </div>
                          </VListItemTitle>
                        </VListItem>
                      </div>
                    </div>
                    <div class="training-library-filters-container__right">
                      <div class="training-library-filters-container__right-container">
                        <TrainingLibrarySearchFilter
                          :total-filter-length="getTotalFilterLength"
                          :items="activeFilter.items"
                          :filter="activeFilter"
                        />
                      </div>
                      <div class="training-library-filters-container__right-footer">
                        <v-btn
                          text
                          class="filter__footer-button"
                          color="#00BCD4"
                          @click="handleClearFilter(activeFilter)"
                        >
                          Clear
                        </v-btn>
                        <v-btn
                          text
                          class="filter__footer-button"
                          color="#2196F3"
                          :disabled="isFilterButtonDisabled"
                          @click="handleFilter(activeFilter)"
                        >
                          Filter
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </VMenu>
                <VCheckbox
                  v-model="isOnlyShowFailedEvents"
                  color="#2196F3"
                  label="Show only failed activities"
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
                <VTooltip bottom opacity="1">
                  <template #activator="{ on }">
                    <VBtn
                      v-on="on"
                      :id="`btn-download--table-${Math.random().toString().substring(2)}`"
                      class="btn-hover mr-1"
                      icon
                      style="order: 5;"
                      @click="handleDownloadButtonClick('Download All')"
                    >
                      <v-icon>mdi-download</v-icon>
                    </VBtn>
                  </template>
                  <span class="tooltip-span">Download Options</span>
                </VTooltip>
              </div>
            </div>
            <div v-if="isRenderFilters" class="training-library-filters-badges">
              <div class="training-library-filters-badges__left-side">
                <div class="training-library-filters-badges__container">
                  <GamificationReportUserDetailsDrawerFilterBadge
                    v-for="(filter, filterIndex) in filters"
                    :key="filterIndex"
                    :filter="filter"
                    :activityTypeFilterItems="activityTypeFilterItems"
                    :productFilterItems="productFilterItems"
                    :difficulityFilterItems="difficulityFilterItems"
                    @remove="handleRemoveFilter($event, filterIndex)"
                  />
                </div>
              </div>
              <div>
                <VBtn
                  class="training-library-filters-badges__clear"
                  color="#2196F3"
                  text
                  :ripple="false"
                  @click="clearAllFilters"
                >
                  Clear All
                </VBtn>
              </div>
            </div>
          </div>
          <DatatableLoading v-if="isTimelineLoading" :loading="isTimelineLoading" />
          <div v-else class="gamification-report__user-details-drawer-timeline">
            <VTimeline v-if="!!timeline.length" dense clipped>
              <template v-for="(item, index) in timeline">
                <VTimelineItem v-if="item.type !== 'header'" medium :key="index">
                  <template #icon>
                    <img
                      :src="getProductIconPath(item)"
                      :alt="`${item.productType} - ${item.ActionType}`"
                    />
                  </template>
                  <div
                    v-if="item.productType === 'Incident Responder'.toUpperCase()"
                    :class="[
                      'gamification-report__timeline-item',
                      index === 0 ? 'gamification-report__timeline-item--first' : ''
                    ]"
                  >
                    <div class="d-flex justify-space-between align-items-center">
                      <span
                        class="gamification-report__timeline-item-activity-type"
                        :style="{ color: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] }"
                        >{{ item.ActionType }}</span
                      >
                      <span class="gamification-report__timeline-item-date">{{
                        item.ActionTime
                      }}</span>
                    </div>
                    <span class="gamification-report__timeline-item-middle-text">
                      <span class="gamification-report__timeline-item-bold-text">{{
                        item.name
                      }}</span>
                      resulted in a
                      <span class="gamification-report__timeline-item-bold-text">{{
                        item.result
                      }}</span>
                      after analysis.
                    </span>
                    <div>
                      <span class="gamification-report__timeline-item-bottom-text">{{
                        item.productType
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]"
                    :class="[
                      'gamification-report__timeline-item',
                      index === 0 ? 'gamification-report__timeline-item--first' : ''
                    ]"
                  >
                    <div class="d-flex justify-space-between align-items-center">
                      <span
                        class="gamification-report__timeline-item-activity-type"
                        :style="{ color: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] }"
                        >{{ item.ActionType }}</span
                      >
                      <span class="gamification-report__timeline-item-date">{{
                        item.ActionTime
                      }}</span>
                    </div>
                    <span class="gamification-report__timeline-item-middle-text">
                      <span class="gamification-report__timeline-item-bold-text">{{
                        item.name
                      }}</span>
                      {{ ` ${item.campaignType} ` }}
                      at
                      <span class="gamification-report__timeline-item-bold-text">{{
                        isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                      }}</span>
                      {{ isProductAwareness(item) ? 'category' : 'difficulity' }}.
                    </span>
                    <div>
                      <span class="gamification-report__timeline-item-bottom-text">{{
                        item.productType
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="
                      ['smishing', 'vishing', 'quishing'].includes(
                        item.productType.split(' - ')[0].toLowerCase()
                      ) && ACTIVITY_TYPES_FAIL_MAP[item.ActionType]
                    "
                    :class="[
                      'gamification-report__timeline-item',
                      index === 0 ? 'gamification-report__timeline-item--first' : ''
                    ]"
                  >
                    <div class="d-flex justify-space-between align-items-center">
                      <span
                        class="gamification-report__timeline-item-activity-type"
                        :style="{ color: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] }"
                        >{{ item.ActionType }}</span
                      >
                      <span class="gamification-report__timeline-item-date">{{
                        item.ActionTime
                      }}</span>
                    </div>
                    <span class="gamification-report__timeline-item-middle-text">
                      <span class="gamification-report__timeline-item-bold-text">{{
                        item.name
                      }}</span>
                      {{ ` ${item.campaignType} ` }}
                      at
                      <span class="gamification-report__timeline-item-bold-text">{{
                        isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                      }}</span>
                      {{ isProductAwareness(item) ? 'category' : 'difficulity' }}.
                    </span>
                    <div>
                      <span class="gamification-report__timeline-item-bottom-text">{{
                        item.productType
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-else
                    :class="[
                      'gamification-report__timeline-item',
                      index === 0 ? 'gamification-report__timeline-item--first' : ''
                    ]"
                  >
                    <div class="d-flex justify-space-between align-items-center">
                      <span
                        class="gamification-report__timeline-item-activity-type"
                        :style="{ color: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] }"
                        >{{ item.ActionType }}</span
                      >
                      <span class="gamification-report__timeline-item-date">{{
                        item.ActionTime
                      }}</span>
                    </div>
                    <span class="gamification-report__timeline-item-middle-text">
                      <span class="gamification-report__timeline-item-bold-text"
                        >{{ item.points }} points</span
                      >
                      with
                      <span class="gamification-report__timeline-item-bold-text"
                        >{{ item.campaignPerformance }}%</span
                      >
                      total score on
                      <span class="gamification-report__timeline-item-bold-text">{{
                        item.name
                      }}</span>
                      {{ ` ${item.campaignType} ` }}
                      at
                      <span class="gamification-report__timeline-item-bold-text">{{
                        isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                      }}</span>
                      {{ isProductAwareness(item) ? 'category' : 'difficulity' }}.
                    </span>
                    <div>
                      <span class="gamification-report__timeline-item-bottom-text">{{
                        item.productType
                      }}</span>
                    </div>
                  </div>
                </VTimelineItem>
                <VTimelineItem
                  class="gamification-report__timeline-item-date-header"
                  v-else
                  small
                  :key="index"
                >
                  <template #icon>
                    <img src="@/assets/img/timeline-date-header-icon.svg" :alt="item.text" />
                  </template>
                  <div
                    :class="[
                      'gamification-report__timeline-item pt-6',
                      index === 0 ? 'gamification-report__timeline-item--first' : ''
                    ]"
                  >
                    <span class="gamification-report__timeline-item-middle-text">{{
                      item.text
                    }}</span>
                  </div>
                </VTimelineItem>
              </template>
            </VTimeline>
            <div v-else class="gamification-report__user-details-drawer-timeline-empty">
              <span class="gamification-report__user-details-drawer-timeline-empty-text"
                >The user does not have any activity</span
              >
            </div>
          </div>
          <div
            v-if="isLoadMoreVisible"
            class="gamification-report__user-details-drawer-load-more-button-container"
          >
            <VHover
              v-slot="{ hover }"
              class="gamification-report__user-details-drawer-load-more-button"
            >
              <VBtn
                block
                outlined
                text
                style="border: none;"
                :style="{ 'background-color': hover ? '#F2F2F2' : '#FFFFFF' }"
                @click="handleLoadMore"
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
import {
  ACTIVITY_TYPE_COLOR_MAP,
  ACTIVITY_TYPES_FAIL_MAP,
  ACTIVITY_TYPES_NEUTRAL_MAP,
  userActivityDetailsFilters
} from './utils'
import useDebounce from '@/hooks/useDebounce'
import DownloadModal from '@/components/DataTableComponents/DownloadModal'
import { mapGetters } from 'vuex'
import { getDefaultAxiosPayload, createRandomCryptStringNumber } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import TrainingLibrarySearchFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySearchFilter.vue'
import GamificationReportUserDetailsDrawerFilterBadge from './GamificationReportUserDetailsDrawerFilterBadge.vue'
import { getUserPerformanceRates, getUserTimeline, exportUserActivityDetails } from '@/api/reports'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import ThreeListItemLoading from '@/components/SkeletonLoading/ThreeListItemLoading'
export default {
  name: 'GamificationReportUserDetailsDrawer',
  components: {
    Fragment,
    DownloadModal,
    TrainingLibrarySearchFilter,
    GamificationReportUserDetailsDrawerFilterBadge,
    DatatableLoading,
    ThreeListItemLoading
  },
  mixins: [useDebounce],
  props: {
    isTargetUser: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      required: true
    },
    datePayload: {
      type: Object,
      required: true
    },
    formDetails: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isTimelineLoading: false,
      isPerformanceRatesLoading: false,
      menu: false,
      isCloseOnClick: true,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      activeFilter: {},
      filters: JSON.parse(JSON.stringify(userActivityDetailsFilters)),
      isOnlyShowFailedEvents: false,
      downloadModalTitle: '',
      isShowDownloadModal: false,
      downloadButtonOptions: ['Download Current Page', 'Download All'],
      isDownloadMenuOpen: false,
      search: '',
      ACTIVITY_TYPES_NEUTRAL_MAP,
      ACTIVITY_TYPE_COLOR_MAP,
      overallScore: {},
      productScores: [],
      timeline: [],
      activityTypeFilterItems: [],
      productFilterItems: [],
      difficulityFilterItems: []
    }
  },
  computed: {
    ...mapGetters({
      isWantToDownload: 'common/getDownloadModalStatus' // for using getters
    }),
    isRenderFilters() {
      return this.filters.some((filter) => filter.isFilterActive)
    },
    getTotalFilterLength() {
      return this.filters.filter((item) => item.show).length
    },
    isFilterButtonDisabled() {
      if (
        this.activeFilter.filterType === 'search' ||
        this.activeFilter.filterType === 'longTextSearch'
      ) {
        return this.activeFilter.value.length === 0
      } else {
        return !this.activeFilter.value
      }
    },
    timezones() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    },
    isLoadMoreVisible() {
      return this.serverSideProps.pageNumber < this.serverSideProps.totalNumberOfPages
    }
  },
  watch: {
    formDetails: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        const activityTypeFilterItems = val?.gamificationActionTypes || []
        const productFilterItems = val?.gamificationProductTypes || []
        const difficulityFilterItems = val?.gamificationScenarioDifficultyTypes || []
        const activityTypeFilterIndex = this.filters.findIndex(
          (item) => item.key === 'activityType'
        )
        if (activityTypeFilterIndex !== -1) {
          this.filters[activityTypeFilterIndex].items = activityTypeFilterItems
          this.activityTypeFilterItems = activityTypeFilterItems
        }
        const productFilterIndex = this.filters.findIndex((item) => item.key === 'product')
        if (productFilterIndex !== -1) {
          this.filters[productFilterIndex].items = productFilterItems
          this.productFilterItems = productFilterItems
        }
        const difficulityFilterIndex = this.filters.findIndex((item) => item.key === 'difficulty')
        if (difficulityFilterIndex !== -1) {
          this.filters[difficulityFilterIndex].items = difficulityFilterItems
          this.difficulityFilterItems = difficulityFilterItems
        }
      }
    },
    isOnlyShowFailedEvents() {
      this.serverSideProps.pageNumber = 1
      this.callForTimeline()
    }
  },
  created() {
    if (this.filters) this.handleSetActiveFilter(this.filters[0])
    this.callForTimeline()
    this.callForPerformanceRates()
    this.callForGetTimeZones()
    document.querySelector('.page-nav__fixed-content').style.background = 'transparent'
    document.querySelector('.user-wrapper').style.background = 'transparent'
    document.querySelector('.user-name-dropdown').style.background = 'transparent'
    document.querySelector('html').style.overflowY = 'hidden'
  },
  beforeDestroy() {
    document.querySelector('.page-nav__fixed-content').style.background = ''
    document.querySelector('.user-wrapper').style.background = ''
    document.querySelector('.user-name-dropdown').style.background = ''
    document.querySelector('html').style.overflowY = 'auto'
  },
  methods: {
    callForTimeline(isAppend = false) {
      const actionTypes =
        this.filters.find((filter) => filter.key === 'activityType')?.activeValue || []
      const difficultyTypes =
        this.filters.find((filter) => filter.key === 'difficulty')?.activeValue || []
      const productTypes =
        this.filters.find((filter) => filter.key === 'product')?.activeValue || []
      const payload = {
        targetUserResourceId: this.selectedRow.targetUserResourceId || this.selectedRow.resourceId,
        actionTypes,
        difficultyTypes,
        products: productTypes,
        datePeriod: this.datePayload.datePeriod,
        startDate: this.datePayload.startDate,
        endDate: this.datePayload.endDate,
        pagination: {
          pageNumber: this.serverSideProps.pageNumber,
          pageSize: 25,
          orderBy: 'ActionTime',
          ascending: true
        },
        showOnlyFailedEvents: this.isOnlyShowFailedEvents
      }
      if (!isAppend) {
        this.isTimelineLoading = true
      }
      getUserTimeline(payload)
        .then((res) => {
          this.serverSideProps.totalNumberOfRecords = res?.data?.data?.totalNumberOfRecords || 0
          this.serverSideProps.totalNumberOfPages = res?.data?.data?.totalNumberOfPages || 0
          this.serverSideProps.pageNumber = res?.data?.data?.pageNumber || 1
          if (isAppend) {
            const newTimeline = this.addDateHeaders(res?.data?.data?.results || [])
            this.timeline = [...this.timeline, ...newTimeline]
          } else {
            this.timeline = this.addDateHeaders(res?.data?.data?.results || [])
          }
        })
        .finally(() => {
          this.isTimelineLoading = false
        })
    },
    addDateHeaders(timeline) {
      const timelineWithHeaders = [...timeline]
      const uniqueDates = [
        ...new Set(timelineWithHeaders.map((activity) => activity.ActionTimeWithDay))
      ]
      for (let i = 0; i < uniqueDates.length; i++) {
        if (this.timeline.some((activity) => activity.ActionTimeWithDay === uniqueDates[i]))
          continue
        const firstActivityIndex = timelineWithHeaders.findIndex(
          (activity) => activity.ActionTimeWithDay === uniqueDates[i]
        )
        if (firstActivityIndex === -1) continue
        timelineWithHeaders.splice(firstActivityIndex, 0, {
          type: 'header',
          text: timelineWithHeaders[firstActivityIndex].ActionTimeWithDay
        })
      }
      return timelineWithHeaders
    },
    callForPerformanceRates() {
      const payload = {
        targetUserResourceId: this.selectedRow.targetUserResourceId || this.selectedRow.resourceId,
        ...this.datePayload
      }
      this.isPerformanceRatesLoading = true
      getUserPerformanceRates(payload)
        .then((res) => {
          const newProductScores = res?.data?.data?.map?.((product) => ({
            percentage: `${product.performance}%`,
            product: product.phishingType,
            totalPerformance: product.totalPerformance,
            totalPoints: product.totalPoints
          }))
          this.productScores = newProductScores
          this.overallScore = {
            points: newProductScores[0].totalPoints,
            percentage: newProductScores[0].totalPerformance
          }
        })
        .finally(() => {
          this.isPerformanceRatesLoading = false
        })
    },
    handleSearch(event) {
      this.debounce(() => {})
    },
    isProductAwareness(item) {
      return (
        item.productType.split(' - ')[0] === 'AWARENESS EDUCATOR' ||
        item.productType === 'SECURITY AWARENESS' ||
        item.productType.split(' - ')[0] === 'SECURITY AWARENESS'
      )
    },
    handleSetActiveFilter(filter) {
      if (filter && this.activeFilter.key === filter.key) return
      this.checkFilter(filter)
      this.activeFilter = filter
    },
    checkFilter(filter) {
      if (filter.isFilterActive) {
        filter.value = filter.activeValue
        filter.operator = filter.activeOperator
      } else {
        let filterValue
        if (filter.filterType === 'search' || filter.filterType === 'longTextSearch')
          filterValue = []
        else filterValue = ''
        filter.value = filterValue
      }
    },
    handleClearFilter(filter) {
      filter.isFilterActive = false
      let filterValue, filterOperator
      if (filter.filterType === 'search' || filter.filterType === 'longTextSearch') {
        filterValue = []
        filterOperator = 'Include'
      } else if (filter.filterType === 'select') {
        filterValue = ''
        filterOperator = 'Contains'
      } else {
        filterValue = ''
        filterOperator = '='
      }
      filter.value = filterValue
      filter.activeValue = filterValue
      filter.operator = filterOperator
      filter.activeOperator = filterOperator
      this.removeFilterFromPayload(filter)
      this.callForTimeline()
    },
    handleFilter(filter) {
      filter.isFilterActive = true
      filter.activeValue = filter.value
      filter.activeOperator = filter.operator
      this.setFilterToPayload(filter)
      this.callForTimeline()
    },
    setFilterToPayload(payload) {
      const filterItems = this.axiosPayload.filter.FilterGroups[0].FilterItems
      const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
      let value
      if (typeof payload.activeValue === 'string') {
        value = payload.activeValue.trim()
      } else if (Array.isArray(payload.activeValue)) {
        if (payload.activeOperator === 'between') {
          filterItems.push({
            FieldName: payload.key,
            Value: payload.activeValue[0],
            Operator: '>='
          })
          filterItems.push({
            FieldName: payload.key,
            Value: payload.activeValue[1],
            Operator: '<='
          })
          return
        }
        value = payload.activeValue.join(',')
      }
      if (fIndex !== -1) {
        filterItems[fIndex].Value = value
      } else {
        filterItems.push({
          FieldName: payload.key,
          Value: value,
          Operator: payload.activeOperator
        })
      }
    },
    removeFilterFromPayload(payload) {
      const filterItems = this.axiosPayload.filter.FilterGroups[0].FilterItems
      if (payload.filterType === 'date' && payload.activeOperator === 'between') {
        const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
        if (fIndex !== -1) filterItems.splice(fIndex, 2)
        return
      }
      const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
      if (fIndex === -1) return
      if (payload.filterType === 'search' || payload.filterType === 'longTextSearch') {
        if (!payload.activeValue.length) filterItems.splice(fIndex, 1)
        else filterItems[fIndex].Value = payload.activeValue.join(',')
      } else filterItems.splice(fIndex, 1)
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    clearAllFilters() {
      this.axiosPayload = getDefaultAxiosPayload()
      const oldPageSize = this.serverSideProps.pageSize
      this.serverSideProps = new ServerSideProps()
      this.axiosPayload.pageSize = oldPageSize
      this.serverSideProps.pageSize = oldPageSize
      this.search = ''
      this.filters.forEach((f) => {
        if (f.filterType === 'search' || f.filterType === 'longTextSearch') {
          f.value = []
          f.activeValue = []
          f.operator = 'Include'
          f.activeOperator = 'Include'
          f.show = userActivityDetailsFilters?.find((tF) => tF.key === f.key)?.show || false
        } else if (f.filterType === 'select') {
          f.value = ''
          f.activeValue = ''
          f.operator = 'Contains'
          f.activeOperator = 'Contains'
          f.show = userActivityDetailsFilters?.find((tF) => tF.key === f.key)?.show || false
        } else {
          f.value = ''
          f.activeValue = ''
          f.operator = '='
          f.activeOperator = '='
          f.show = userActivityDetailsFilters?.find((tF) => tF.key === f.key)?.show || false
        }
        f.isFilterActive = false
      })
      this.filtersRenderKey = `filters-key-${createRandomCryptStringNumber()}`
      this.callForTimeline()
    },
    handleRemoveFilter({ filter, index }, filterIndex) {
      this.filters[filterIndex].activeValue.splice(index, 1)
      this.filters[filterIndex].value = this.filters[filterIndex].activeValue
      this.filters[filterIndex].isFilterActive = !!this.filters[filterIndex].activeValue.length
      this.removeFilterFromPayload(filter)
      this.callForTimeline()
    },
    handleMenuVisibilityChange(val) {
      if (this.activeFilter.filterType === 'date') {
        const { refPicker, refPicker2 } = this.$refs.refDateFilter.$refs
        const { refMenu } = this.$refs
        if ((refPicker && refPicker.pickerVisible) || (refPicker2 && refPicker2.pickerVisible)) {
          this.isCloseOnClick = false
          this.menu = true
          refMenu.isActive = true
          return
        }
      }
      this.isCloseOnClick = true
      this.menu = val
      if (!this.menu) this.checkFilter(this.activeFilter)
    },
    handleRefresh() {
      this.serverSideProps.pageNumber = 1
      this.callForTimeline()
    },
    handleDownloadButtonClick(item = '') {
      this.isShowDownloadModal = true
      this.downloadModalTitle = item
      this.changeDownloadModalStatus(true)
    },
    changeDownloadModalStatus(status) {
      this.$store.dispatch('common/changeDownloadModalStatus', status)
    },
    handleLoadMore() {
      this.serverSideProps.pageNumber += 1
      this.callForTimeline(true)
    },
    exportUserDetails(downloadTypes) {
      const downloadSettings = {
        exportTypes: downloadTypes,
        pageNumber: this.serverSideProps.pageNumber,
        pageSize: this.serverSideProps.pageSize,
        reportAllPages: this.downloadModalTitle === this.downloadButtonOptions[1]
      }
      downloadSettings.exportTypes.forEach((item) => {
        const actionTypes =
          this.filters.find((filter) => filter.key === 'activityType')?.activeValue || []
        const difficultyTypes =
          this.filters.find((filter) => filter.key === 'difficulty')?.activeValue || []
        const productTypes =
          this.filters.find((filter) => filter.key === 'product')?.activeValue || []
        let payload = {
          exportType: item === 'XLS' ? 'Excel' : item,
          reportAllPages: downloadSettings.reportAllPages,
          targetUserResourceId:
            this.selectedRow.targetUserResourceId || this.selectedRow.resourceId,
          actionTypes,
          difficultyTypes,
          products: productTypes,
          datePeriod: this.axiosPayload.datePeriod,
          showOnlyFailedEvents: this.isOnlyShowFailedEvents,
          pagination: {
            pageNumber: downloadSettings.pageNumber,
            pageSize: downloadSettings.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending
          }
        }
        exportUserActivityDetails(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          if (this.isTargetUser) {
            link.download = `Target-User-Timeline.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
          } else {
            link.download = `Leaderboard-User-Timeline.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
          }
          link.click()
        })
      })
    },
    getCardProductIcon(product) {
      if (product === 'Phishing Simulator')
        return require('@/assets/img/gamification-report-user-details-phishing-icon.svg')
      if (product === 'Callback Simulator')
        return require('@/assets/img/gamification-report-user-details-callback-icon.svg')
      if (product === 'Vishing Simulator')
        return require('@/assets/img/gamification-report-user-details-vishing-icon.svg')
      if (product === 'Security Awareness')
        return require('@/assets/img/gamification-report-user-details-awareness-icon.svg')
      if (product === 'Smishing Simulator')
        return require('@/assets/img/gamification-report-user-details-smishing-icon.svg')
      if (product === 'Quishing Simulator')
        return require('@/assets/img/gamification-report-user-details-quishing-icon.svg')
      return require('@/assets/img/gamification-report-user-details-phishing-icon.svg')
    },
    getProductIconPath(item) {
      const productType = item.productType.split(' - ')[0]
      if (productType === 'Phishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-fail-icon.svg')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-phishing-success-icon.svg')
      }
      if (productType === 'Callback Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-fail-icon.svg')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-callback-success-icon.svg')
      }
      if (productType === 'Vishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-fail-icon.svg')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-vishing-answered-icon.svg')
      }
      if (productType === 'Smishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-smishing-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-smishing-fail-icon.svg')
      }
      if (productType === 'Quishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-fail-icon.svg')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-quishing-success-icon.svg')
      }
      if (productType === 'SECURITY AWARENESS'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-fail-icon.svg')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-neutral-icon.svg')
        }
        return require('@/assets/img/timeline-awareness-success-icon.svg')
      }
      if (productType === 'Incident Responder'.toUpperCase()) {
        return require('@/assets/img/timeline-ir-success-icon.svg')
      }
      return require('@/assets/img/timeline-phishing-success-icon.svg')
    },
    getScenarioMethodText(item) {
      if (['Vishing Simulator', 'Callback Simulator'].includes(item.product)) {
        return ''
      }
      if (item.product === 'Awareness Educator' || item.product === 'Security Awareness') {
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
    getTimezoneText(item) {
      const timezoneText = this.timezones?.find?.((tz) => tz.value === item.timezoneId)?.text || ''
      const timzoneLeftText = timezoneText.split(' ')[0]
      return timzoneLeftText
    }
  }
}
</script>
