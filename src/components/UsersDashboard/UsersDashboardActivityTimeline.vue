<template>
  <VCard class="users-dashboard-activity-timeline">
    <div class="users-dashboard-activity-timeline__header">
      <h2
        id="text--users-dashboard-activity-timeline-title"
        class="users-dashboard-activity-timeline__title"
      >
        {{ labels.activityTimelineTitle }}
      </h2>
      <p
        id="text--users-dashboard-activity-timeline-subtitle"
        class="users-dashboard-activity-timeline__subtitle"
      >
        {{ labels.activityTimelineSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-activity-timeline__content">
      <ThreeListItemLoading v-if="isTimelineLoading" :loading="isTimelineLoading" />
      <div v-else class="users-dashboard-activity-timeline__items">
        <div v-if="filteredTimeline.length === 0" class="users-dashboard-activity-timeline__empty">
          <span class="users-dashboard-activity-timeline__empty-text">
            {{ labels.activityTimelineEmptyMessage }}
          </span>
        </div>
        <div
          v-for="(item, index) in filteredTimeline"
          v-else
          :key="`item-${index}`"
          class="users-dashboard-activity-timeline__item"
        >
          <div class="users-dashboard-activity-timeline__item-content">
            <div class="users-dashboard-activity-timeline__item-left">
              <div
                class="users-dashboard-activity-timeline__item-icon"
                :style="{
                  backgroundColor: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] || '#757575'
                }"
              >
                <img
                  style="width: 32px; height: 32px;"
                  :src="getProductIconPath(item)"
                  :alt="`${item.productType || ''} - ${item.ActionType || ''}`"
                  @error="handleImageError"
                />
              </div>
              <div class="users-dashboard-activity-timeline__item-text">
                <span
                  class="users-dashboard-activity-timeline__item-status"
                  :style="{
                    color: ACTIVITY_TYPE_COLOR_MAP[item.ActionType] || '#757575'
                  }"
                >
                  {{ item.ActionType }}
                </span>
                <span class="users-dashboard-activity-timeline__item-description">
                  <template v-if="item.productType === 'Incident Responder'.toUpperCase()">
                    The reported email with
                    <strong>{{ item.name }}</strong>
                    <span> subject </span>
                    was analyzed by the incident responder and resulted in
                    <strong>{{ item.result }}.</strong>
                  </template>
                  <template v-else-if="ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]">
                    <template v-if="isProductAwareness(item)">
                      Enrollment email sent to
                      <span>{{ userInfo.name }} </span>
                      for
                      <strong>{{ item.name }}</strong>
                      <span> enrollment </span>
                      in the
                      <strong>{{ item.categoryDescription }}</strong>
                      category.
                    </template>
                    <template v-else>
                      <strong>{{ item.name }}</strong>
                      <span> {{ getProductType(item) }} </span>
                      with
                      <strong>{{
                        isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                      }}</strong>
                      {{ isProductAwareness(item) ? 'category' : 'difficulty' }}
                      has been sent to
                      <span> {{ userInfo.name }}. </span>
                    </template>
                  </template>
                  <template
                    v-else-if="
                      ['smishing', 'vishing', 'quishing'].includes(
                        item.productType.split(' - ')[0].toLowerCase()
                      ) && ACTIVITY_TYPES_FAIL_MAP[item.ActionType]
                    "
                  >
                    <strong>{{ item.name }}</strong>
                    {{ ` ${item.campaignType} ` }}
                    at
                    <strong>{{
                      isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                    }}</strong>
                    {{ isProductAwareness(item) ? 'category' : 'difficulity' }}.
                  </template>
                  <template v-else>
                    <template
                      v-if="isProductAwareness(item) && ACTIVITY_TYPES_OPENED_MAP[item.ActionType]"
                    >
                      {{ userInfo.name }}
                      <span> opened the email for </span>
                      <strong>{{ item.name }}</strong>
                      <span> enrollment </span>
                      in the
                      <strong>{{ item.categoryDescription }}</strong>
                      <span> category. </span>
                    </template>
                    <template v-else-if="isProductAwareness(item)">
                      {{ userInfo.name }}
                      <strong>
                        {{ item.points > 0 ? 'earned' : 'lost' }}
                      </strong>
                      <strong>{{ item?.points?.toString().replace('-', '') }} points</strong>
                      in the
                      <strong>{{ item.name }}</strong>
                      <span> enrollment </span>
                      in the
                      <strong>{{ item.categoryDescription }}</strong>
                      {{ isProductAwareness(item) ? 'category' : 'difficulty' }}, with an enrollment
                      performance of
                      <strong>{{ item.campaignPerformance }}%.</strong>
                    </template>
                    <template v-else-if="ACTIVITY_TYPES_OPENED_MAP[item.ActionType]">
                      {{ userInfo.name }}
                      <span> opened the email for </span>
                      <strong>{{ item.name }}</strong>
                      <span> {{ getProductType(item) }} </span>
                      with
                      <strong>{{ item.difficultyType }}</strong>
                      <span> difficulty. </span>
                    </template>
                    <template v-else>
                      {{ userInfo.name }}
                      <strong>
                        {{ item.points > 0 ? 'earned' : 'lost' }}
                      </strong>
                      <strong>{{ item?.points?.toString().replace('-', '') }} points</strong>
                      in the
                      <strong>{{ item.name }}</strong>
                      <span> {{ getProductType(item) }} </span>
                      at
                      <strong>{{
                        isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                      }}</strong>
                      {{ isProductAwareness(item) ? 'category' : 'difficulty' }}, with a campaign
                      performance of
                      <strong>{{ item.campaignPerformance }}%.</strong>
                    </template>
                  </template>
                </span>
              </div>
            </div>
            <div class="users-dashboard-activity-timeline__item-timestamp">
              {{ item.ActionTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isLoadMoreVisible"
      class="users-dashboard-activity-timeline__load-more-button-container"
    >
      <VHover v-slot="{ hover }" class="users-dashboard-activity-timeline__load-more-button">
        <VBtn
          block
          outlined
          text
          style="border: none;"
          :style="getLoadMoreButtonStyle(hover)"
          @click="handleLoadMore"
        >
          <span style="color: #2196f3; font-weight: 600;">{{
            labels.activityTimelineLoadMore
          }}</span>
        </VBtn>
      </VHover>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACTIVITY_TYPE_COLOR_MAP,
  ACTIVITY_TYPES_FAIL_MAP,
  ACTIVITY_TYPES_NEUTRAL_MAP,
  ACTIVITY_TYPES_OPENED_MAP
} from '@/components/GamificationReport/utils'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getUserTimeline } from '@/api/reports'
import ThreeListItemLoading from '@/components/SkeletonLoading/ThreeListItemLoading'

export default {
  name: 'UsersDashboardActivityTimeline',
  components: {
    ThreeListItemLoading
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      userInfo: 'usersDashboard/getUserInfo'
    }),
    ACTIVITY_TYPES_FAIL_MAP() {
      return ACTIVITY_TYPES_FAIL_MAP
    },
    isLoadMoreVisible() {
      return (
        this.serverSideProps.totalNumberOfPages > 0 &&
        this.serverSideProps.pageNumber < this.serverSideProps.totalNumberOfPages
      )
    },
    filteredTimeline() {
      return this.timeline.filter((item) => item.type !== 'header')
    }
  },
  data() {
    const serverSideProps = new ServerSideProps()
    serverSideProps.pageSize = 3
    return {
      isTimelineLoading: false,
      serverSideProps,
      timeline: [],
      ACTIVITY_TYPES_NEUTRAL_MAP,
      ACTIVITY_TYPE_COLOR_MAP,
      ACTIVITY_TYPES_OPENED_MAP
    }
  },
  created() {
    this.callForTimeline()
  },
  methods: {
    callForTimeline(isAppend = false) {
      const payload = {
        targetUserResourceId: this.getCurrentUserResourceId(),
        actionTypes: [],
        difficultyTypes: [],
        products: [],
        datePeriod: null,
        startDate: null,
        endDate: null,
        pagination: {
          pageNumber: this.serverSideProps.pageNumber,
          pageSize: 3,
          orderBy: 'ActionTime',
          ascending: true
        },
        showOnlyFailedEvents: false
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
        .catch((err) => {
          console.error('Error fetching timeline:', err)
          // For now, use mock data if API fails
          if (!isAppend) {
            this.timeline = []
          }
        })
        .finally(() => {
          this.isTimelineLoading = false
        })
    },
    addDateHeaders(timeline) {
      // Don't add date headers for simple timeline design
      return timeline
    },
    getCurrentUserResourceId() {
      // TODO: Get actual resourceId from API or store
      // For now, use mock resourceId or get from localStorage
      return '8jDsE5UzS1rd'
    },
    isProductAwareness(item) {
      return (
        item.productType.split(' - ')[0] === 'AWARENESS EDUCATOR' ||
        item.productType === 'SECURITY AWARENESS' ||
        item.productType.split(' - ')[0] === 'SECURITY AWARENESS'
      )
    },
    getProductIconPath(item) {
      if (!item || !item.productType) {
        return require('@/assets/img/timeline-phishing-success-icon.png')
      }
      const productType = item.productType.split(' - ')[0]
      if (productType === 'Phishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_OPENED_MAP[item.ActionType]) {
          return require('@/assets/img/ir-email-opened.png')
        }
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-fail-icon.png')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-phishing-success-icon.png')
      }
      if (productType === 'Callback Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-fail-icon.png')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-neutral-icon.png')
        }
        return require('@/assets/img/timeline-callback-success-icon.png')
      }
      if (productType === 'Vishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-fail-icon.png')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-vishing-answered-icon.png')
      }
      if (productType === 'Smishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-smishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-smishing-fail-icon.png')
      }
      if (productType === 'Quishing Simulator'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-fail-icon.png')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-quishing-success-icon.png')
      }
      if (productType === 'Security Awareness'.toUpperCase()) {
        if (ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-fail-icon.png')
        }
        if (ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-neutral-icon.png')
        }
        if (ACTIVITY_TYPES_OPENED_MAP[item.ActionType]) {
          return require('@/assets/img/opened-email-yellow.png')
        }
        return require('@/assets/img/timeline-awareness-success-icon.png')
      }
      if (productType === 'Incident Responder'.toUpperCase()) {
        return require('@/assets/img/timeline-ir-success-icon.png')
      }
      return require('@/assets/img/timeline-phishing-success-icon.png')
    },
    handleImageError(event) {
      // Fallback to default icon if image fails to load
      event.target.src = require('@/assets/img/timeline-phishing-success-icon.png')
    },
    getProductType(product) {
      if (product.productType.split(' - ')[0] === 'PHISHING SIMULATOR') {
        return 'phishing campaign'
      } else if (product.productType.split(' - ')[0] === 'SMISHING SIMULATOR') {
        return 'smishing campaign'
      } else if (product.productType.split(' - ')[0] === 'CALLBACK SIMULATOR') {
        return 'callback campaign'
      } else if (product.productType.split(' - ')[0] === 'VISHING SIMULATOR') {
        return 'vishing campaign'
      } else if (product.productType.split(' - ')[0] === 'QUISHING SIMULATOR') {
        return 'quishing campaign'
      }
      return ''
    },
    handleLoadMore() {
      this.serverSideProps.pageNumber += 1
      this.callForTimeline(true)
    },
    getLoadMoreButtonStyle(hover) {
      return {
        'background-color': hover ? '#F2F2F2' : '#FFFFFF',
        marginBottom: '16px'
      }
    }
  }
}
</script>
