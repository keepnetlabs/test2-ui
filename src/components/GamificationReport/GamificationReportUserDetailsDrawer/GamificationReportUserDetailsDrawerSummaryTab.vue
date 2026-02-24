<template>
  <div class="gamification-report-user-details-summary-tab">
    <div class="gamification-report-user-details-summary-tab__row">
      <div class="gamification-report-user-details-summary-tab__card">
        <div class="gamification-report-user-details-summary-tab__card-header">
          <div>
            <h3 class="gamification-report-user-details-summary-tab__card-title">
              Overall Performance
            </h3>
            <p class="gamification-report-user-details-summary-tab__card-subtitle">
              Track {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s performance, points,
              and rank.
            </p>
          </div>
          <a
            href="#"
            class="gamification-report-user-details-summary-tab__link"
            @click.prevent="$emit('go-to-tab', 'performanceDetails')"
          >
            See Performance Details
          </a>
        </div>
        <div class="gamification-report-user-details-summary-tab__card-content">
          <template v-if="isPerformanceRatesLoading">
            <div class="gamification-report-user-details-summary-tab__percentage-box">
              <v-skeleton-loader type="avatar" size="120" />
            </div>
            <div class="gamification-report-user-details-summary-tab__metrics">
              <div class="gamification-report-user-details-summary-tab__metric-item">
                <v-skeleton-loader type="text" width="80" />
                <v-skeleton-loader type="text" width="60" />
              </div>
              <div class="gamification-report-user-details-summary-tab__metric-item">
                <v-skeleton-loader type="text" width="80" />
                <v-skeleton-loader type="text" width="60" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="gamification-report-user-details-summary-tab__percentage-box">
              <span class="gamification-report-user-details-summary-tab__percentage">
                {{ overallScore.percentage || 0 }}%
              </span>
            </div>
            <div class="gamification-report-user-details-summary-tab__metrics">
              <div class="gamification-report-user-details-summary-tab__metric-item">
                <span class="gamification-report-user-details-summary-tab__metric-label">Points</span>
                <span class="gamification-report-user-details-summary-tab__metric-value">
                  {{ overallScore.points || selectedRow.points || 0 }}
                </span>
              </div>
              <div class="gamification-report-user-details-summary-tab__metric-item">
                <span class="gamification-report-user-details-summary-tab__metric-label">Rank</span>
                <span class="gamification-report-user-details-summary-tab__metric-value">
                  {{ getRankText() }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="gamification-report-user-details-summary-tab__card">
        <div class="gamification-report-user-details-summary-tab__card-header">
          <div>
            <h3 class="gamification-report-user-details-summary-tab__card-title">
              Recent Badges
            </h3>
            <p class="gamification-report-user-details-summary-tab__card-subtitle">
              View {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s last 3 badges earned.
            </p>
          </div>
          <a
            href="#"
            class="gamification-report-user-details-summary-tab__link"
            @click.prevent="$emit('go-to-tab', 'badges')"
          >
            See All Badges
          </a>
        </div>
        <div class="gamification-report-user-details-summary-tab__badges-content">
          <template v-if="isBadgesLoading">
            <div
              v-for="n in badgeCount"
              :key="`badge-skeleton-${n}`"
              :class="[
                'gamification-report-user-details-summary-tab__badge-item',
                'gamification-report-user-details-summary-tab__badge-item--skeleton',
                `gamification-report-user-details-summary-tab__badge-item--count-${badgeCount}`
              ]"
            >
              <div class="gamification-report-user-details-summary-tab__badge-skeleton">
                <div class="gamification-report-user-details-summary-tab__badge-skeleton-icon">
                  <v-skeleton-loader type="avatar" size="80" />
                </div>
                <div class="gamification-report-user-details-summary-tab__badge-skeleton-text">
                  <v-skeleton-loader type="text" width="100" height="16" />
                  <v-skeleton-loader type="text" width="70" height="12" />
                </div>
              </div>
            </div>
          </template>
          <div
            v-else-if="recentBadges.length === 0"
            class="gamification-report-user-details-summary-tab__badges-empty"
          >
            <span class="gamification-report-user-details-summary-tab__badges-empty-text">
              The user has not earned any badge
            </span>
          </div>
          <template v-else>
            <div
              v-for="(badge, index) in recentBadges"
              :key="getBadgeKey(badge, index)"
              :class="[
                'gamification-report-user-details-summary-tab__badge-item',
                `gamification-report-user-details-summary-tab__badge-item--count-${badgeCount}`
              ]"
            >
              <VTooltip
                bottom
                opacity="1"
                :disabled="!getTooltipContent(badge)"
              >
                <template #activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    class="gamification-report-user-details-summary-tab__badge-item-inner"
                  >
                    <div class="gamification-report-user-details-summary-tab__badge-icon">
                      <img
                        v-if="getBadgeImage(normalizeBadge(badge))"
                        :src="getBadgeImage(normalizeBadge(badge))"
                        :alt="badge.badgeName || badge.name"
                        class="gamification-report-user-details-summary-tab__badge-img"
                      />
                      <div v-else class="gamification-report-user-details-summary-tab__badge-placeholder">
                        <VIcon size="48" color="#2196F3">mdi-trophy</VIcon>
                      </div>
                    </div>
                    <span class="gamification-report-user-details-summary-tab__badge-name">
                      {{ badge.badgeName || badge.name }}
                    </span>
                  </div>
                </template>
                <span>{{ getTooltipContent(badge) }}</span>
              </VTooltip>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="gamification-report-user-details-summary-tab__activity-wrapper">
      <div class="gamification-report-user-details-summary-tab__activity-header">
        <div>
          <h3 class="gamification-report-user-details-summary-tab__card-title">
            Activity Timeline
          </h3>
          <p class="gamification-report-user-details-summary-tab__card-subtitle">
            A timeline of {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s last 3
            activities.
          </p>
        </div>
        <a
          href="#"
          class="gamification-report-user-details-summary-tab__link"
          @click.prevent="$emit('go-to-tab', 'activityTimeline')"
        >
          See All User Activities
        </a>
      </div>
      <div class="gamification-report-user-details-summary-tab__activity-section">
      <div class="gamification-report-user-details-summary-tab__activity-content">
        <DatatableLoading v-if="isTimelineLoading" :loading="isTimelineLoading" />
        <div v-else-if="timelinePreview.length === 0" class="gamification-report-user-details-summary-tab__empty">
          The user does not have any activity.
        </div>
        <div v-else class="gamification-report-user-details-summary-tab__activity-list">
          <div
            v-for="(item, index) in timelinePreviewActivities"
            :key="index"
            class="gamification-report-user-details-summary-tab__activity-item"
          >
            <img
              class="gamification-report-user-details-summary-tab__activity-icon"
              :src="getProductIconPath(item)"
              :alt="`${item.productType} - ${item.ActionType}`"
            />
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
                >{{ item.ActionType }}</span>
                <span class="gamification-report__timeline-item-date">{{ item.ActionTime }}</span>
              </div>
              <span class="gamification-report__timeline-item-middle-text">
                <template
                  v-if="
                    item.ActionType === 'Reported Email' &&
                    ['Malicious', 'Phishing'].includes(item.result) &&
                    item.points
                  "
                >
                  <span class="gamification-report__timeline-item-middle-text ml-0"
                    >{{ selectedRow.firstName }} {{ selectedRow.lastName }}</span
                  >
                  <span class="gamification-report__timeline-item-bold-text">
                    earned {{ getPointText(item) }} points </span
                  >
                  after reporting the email
                  <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span
                  >, which resulted in
                  <span class="gamification-report__timeline-item-bold-text">{{ item.result }}.</span>
                </template>
                <template v-else>
                  The reported email with
                  <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                  subject was analyzed by the incident responder and resulted in
                  <span class="gamification-report__timeline-item-bold-text">{{ item.result }}.</span>
                </template>
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
                >{{ item.ActionType }}</span>
                <span class="gamification-report__timeline-item-date">{{ item.ActionTime }}</span>
              </div>
              <span
                v-if="isProductAwareness(item)"
                class="gamification-report__timeline-item-middle-text"
              >
                Enrollment email sent to
                <span>{{ selectedRow.firstName }} {{ selectedRow.lastName }} </span>
                for
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                enrollment in the
                <span class="gamification-report__timeline-item-bold-text">{{
                  item.categoryDescription
                }}</span>
                category.
              </span>
              <span v-else class="gamification-report__timeline-item-middle-text">
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                <span> {{ getProductType(item) }} </span>
                with
                <span class="gamification-report__timeline-item-bold-text">{{
                  isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                }}</span>
                {{ isProductAwareness(item) ? 'category' : 'difficulty' }}
                has been sent to
                <span> {{ selectedRow.firstName }} {{ selectedRow.lastName }}. </span>
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
                  ((item.productType || '').split(' - ')[0] || '').toLowerCase()
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
                >{{ item.ActionType }}</span>
                <span class="gamification-report__timeline-item-date">{{ item.ActionTime }}</span>
              </div>
              <span class="gamification-report__timeline-item-middle-text">
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
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
                >{{ item.ActionType }}</span>
                <span class="gamification-report__timeline-item-date">{{ item.ActionTime }}</span>
              </div>
              <span
                v-if="isProductAwareness(item) && ACTIVITY_TYPES_OPENED_MAP[item.ActionType]"
                class="gamification-report__timeline-item-middle-text"
              >
                {{ selectedRow.firstName }} {{ selectedRow.lastName }}
                <span> opened the email for </span>
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                enrollment in the
                <span class="gamification-report__timeline-item-bold-text">{{
                  item.categoryDescription
                }}</span>
                <span> category. </span>
              </span>
              <span
                v-else-if="isProductAwareness(item)"
                class="gamification-report__timeline-item-middle-text"
              >
                {{ selectedRow.firstName }} {{ selectedRow.lastName }}
                <span class="gamification-report__timeline-item-bold-text">
                  {{ item.points > 0 ? 'earned' : 'lost' }}
                </span>
                <span class="gamification-report__timeline-item-bold-text"
                  >{{ getPointText(item) }} points</span
                >
                in the
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                enrollment in the
                <span class="gamification-report__timeline-item-bold-text">{{
                  item.categoryDescription
                }}</span>
                {{ isProductAwareness(item) ? 'category' : 'difficulty' }}, with an enrollment
                performance of
                <span class="gamification-report__timeline-item-bold-text"
                  >{{ item.campaignPerformance }}%.</span
                >
                <span v-if="item.pointRule">
                  and
                  <span
                    class="gamification-report__timeline-item-bold-text"
                    v-if="item.pointRule.ruleName === 'Joined After 3 Days'"
                    >lost</span
                  >
                  <span class="gamification-report__timeline-item-bold-text" v-else
                    >received</span
                  >
                  <span class="gamification-report__timeline-item-bold-text"
                    ><span class="gamification-report__timeline-item-bold-text">{{
                      item.pointRule.ruleName === 'Joined After 3 Days'
                        ? ''
                        : item.pointRule.ruleName === 'Joined 1-3 Days'
                        ? ''
                        : '+'
                    }}</span
                    >{{ item.pointRule.rulePoint }}
                  </span>
                  <span class="gamification-report__timeline-item-bold-text"
                    >{{ item.pointRule.ruleName === 'Joined After 3 Days' ? '' : 'extra' }}</span
                  >
                  <span class="gamification-report__timeline-item-bold-text">points</span>
                  for joining the training
                  <span>{{
                    item.pointRule.ruleName === 'Joined After 3 Days'
                      ? 'more than 3 days after invitation.'
                      : item.pointRule.ruleName === 'Joined 1-3 Days'
                      ? '1-3 days after invitation.'
                      : 'within 24 hours.'
                  }}</span>
                </span>
              </span>
              <span
                v-else-if="ACTIVITY_TYPES_OPENED_MAP[item.ActionType]"
                class="gamification-report__timeline-item-middle-text"
              >
                {{ selectedRow.firstName }} {{ selectedRow.lastName }}
                <span> opened the email for </span>
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                {{ getProductType(item) }} with
                <span class="gamification-report__timeline-item-bold-text">{{
                  item.difficultyType
                }}</span>
                <span> difficulty. </span>
              </span>
              <span v-else class="gamification-report__timeline-item-middle-text">
                {{ selectedRow.firstName }} {{ selectedRow.lastName }}
                <span class="gamification-report__timeline-item-bold-text">
                  {{ item.points > 0 ? 'earned' : 'lost' }}
                </span>
                <span class="gamification-report__timeline-item-bold-text"
                  >{{ getPointText(item) }} points</span
                >
                in the
                <span class="gamification-report__timeline-item-bold-text">{{ item.name }}</span>
                {{ getProductType(item) }} at
                <span class="gamification-report__timeline-item-bold-text">{{
                  isProductAwareness(item) ? item.categoryDescription : item.difficultyType
                }}</span>
                {{ isProductAwareness(item) ? 'category' : 'difficulty' }}, with a campaign
                performance of
                <span class="gamification-report__timeline-item-bold-text"
                  >{{ item.campaignPerformance }}%.</span
                >
              </span>
              <div>
                <span class="gamification-report__timeline-item-bottom-text">{{
                  item.productType
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'
import { getUserTimeline } from '@/api/reports'
import {
  ACTIVITY_TYPE_COLOR_MAP,
  ACTIVITY_TYPES_FAIL_MAP,
  ACTIVITY_TYPES_NEUTRAL_MAP,
  ACTIVITY_TYPES_OPENED_MAP
} from '../utils.js'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'

export default {
  name: 'GamificationReportUserDetailsDrawerSummaryTab',
  components: { DatatableLoading },
  mixins: [usersDashboardBadgeMixin],
  props: {
    selectedRow: { type: Object, required: true },
    datePayload: { type: Object, required: true },
    overallScore: { type: Object, default: () => ({}) },
    productScores: { type: Array, default: () => [] },
    isPerformanceRatesLoading: { type: Boolean, default: false }
  },
  data() {
    return {
      ACTIVITY_TYPE_COLOR_MAP,
      ACTIVITY_TYPES_FAIL_MAP,
      ACTIVITY_TYPES_NEUTRAL_MAP,
      ACTIVITY_TYPES_OPENED_MAP,
      isTimelineLoading: false,
      timelinePreview: []
    }
  },
  computed: {
    ...mapGetters({
      getBadgesForUser: 'gamificationBadges/getBadgesForUser',
      hasValidBadgesCache: 'gamificationBadges/hasValidCache',
      isBadgesCalculating: 'gamificationBadges/isCalculating',
      isBadgesFetching: 'gamificationBadges/isFetching',
      labels: 'usersDashboard/getLabels',
      language: 'usersDashboard/getLanguage'
    }),
    targetUserResourceId() {
      return this.selectedRow?.targetUserResourceId || this.selectedRow?.resourceId
    },
    badges() {
      const raw = this.getBadgesForUser(this.targetUserResourceId)
      return Array.isArray(raw) ? raw : []
    },
    recentBadges() {
      return this.badges
        .filter((b) => b.earned === true)
        .sort((a, b) => {
          const dA = new Date(a.earnedDate || a.earnedOn || 0).getTime()
          const dB = new Date(b.earnedDate || b.earnedOn || 0).getTime()
          return dB - dA
        })
        .slice(0, 3)
    },
    isBadgesLoading() {
      if (!this.targetUserResourceId) return false
      const hasCache = this.hasValidBadgesCache(this.targetUserResourceId)
      return !hasCache && (this.isBadgesCalculating || this.isBadgesFetching)
    },
    badgeCount() {
      if (this.isBadgesLoading) return 3
      return Math.min(this.recentBadges.length, 3)
    },
    timelinePreviewActivities() {
      return (this.timelinePreview || [])
        .filter((i) => i.type !== 'header')
        .slice(0, 3)
    }
  },
  created() {
    this.callForTimelinePreview()
  },
  methods: {
    getRankText() {
      if (this.overallScore && this.overallScore.rank !== null && this.overallScore.rank !== undefined) {
        return this.overallScore.rank
      }
      if (this.selectedRow && this.selectedRow.rank !== null && this.selectedRow.rank !== undefined) {
        return this.selectedRow.rank
      }
      return '-'
    },
    getPointText(item) {
      const points = item && item.points !== null && item.points !== undefined ? String(item.points) : ''
      return points.replace('-', '')
    },
    callForTimelinePreview() {
      if (!this.targetUserResourceId) return
      this.isTimelineLoading = true
      const payload = {
        targetUserResourceId: this.targetUserResourceId,
        actionTypes: [],
        difficultyTypes: [],
        products: [],
        datePeriod: this.datePayload.datePeriod,
        startDate: this.datePayload.startDate,
        endDate: this.datePayload.endDate,
        pagination: {
          pageNumber: 1,
          pageSize: 3,
          orderBy: 'ActionTime',
          ascending: false
        },
        showOnlyFailedEvents: false
      }
      getUserTimeline(payload)
        .then((res) => {
          const results = res?.data?.data?.results || []
          this.timelinePreview = results
        })
        .catch(() => {})
        .finally(() => {
          this.isTimelineLoading = false
        })
    },
    normalizeBadge(badge) {
      if (!badge) return {}
      return {
        name: badge.badgeName ?? badge.name,
        type: badge.badgeType ?? badge.type,
        level: badge.level,
        description: badge.description
      }
    },
    getTooltipContent(badge) {
      const desc = this.getBadgeDescription(this.normalizeBadge(badge))
      if (desc) return desc
      return badge.badgeName || badge.name || ''
    },
    getBadgeKey(badge, index) {
      return `${badge?.badgeType ?? badge?.type ?? ''}-${badge?.level ?? 0}-${index}`
    },
    getBadgeEarnedDateFormatted(badge) {
      const date = badge?.earnedDate || badge?.earnedOn || badge?.earnedAt || badge?.createdAt || badge?.earned_at || badge?.dateEarned
      return this.formatBadgeEarnedDate(date)
    },
    formatBadgeEarnedDate(dateString) {
      if (!dateString) return ''
      try {
        let date = new Date(dateString)
        if (Number.isNaN(date.getTime())) {
          const match = String(dateString).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/)
          if (match) {
            const day = Number.parseInt(match[1], 10)
            const month = Number.parseInt(match[2], 10) - 1
            const year = Number.parseInt(match[3], 10)
            const hour = Number.parseInt(match[4], 10) || 0
            const min = Number.parseInt(match[5], 10) || 0
            date = new Date(year, month, day, hour, min)
          }
        }
        if (Number.isNaN(date.getTime())) return ''
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      } catch {
        return ''
      }
    },
    isProductAwareness(item) {
      const productType = (item?.productType || '').split(' - ')[0] || ''
      return (
        productType === 'AWARENESS EDUCATOR' ||
        item?.productType === 'SECURITY AWARENESS' ||
        productType === 'SECURITY AWARENESS'
      )
    },
    getProductType(product) {
      const productType = (product?.productType || '').split(' - ')[0] || ''
      if (productType === 'PHISHING SIMULATOR') {
        return 'phishing campaign'
      }
      if (productType === 'SMISHING SIMULATOR') {
        return 'smishing campaign'
      }
      if (productType === 'CALLBACK SIMULATOR') {
        return 'callback campaign'
      }
      if (productType === 'VISHING SIMULATOR') {
        return 'vishing campaign'
      }
      if (productType === 'QUISHING SIMULATOR') {
        return 'quishing campaign'
      }
      return ''
    },
    getProductIconPath(item) {
      const productType = (item.productType || '').split(' - ')[0] || ''
      if (productType === 'PHISHING SIMULATOR') {
        if (this.ACTIVITY_TYPES_OPENED_MAP[item.ActionType]) {
          return require('@/assets/img/ir-email-opened.png')
        }
        if (this.ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-fail-icon.png')
        }
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-phishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-phishing-success-icon.png')
      }
      if (productType === 'CALLBACK SIMULATOR') {
        if (this.ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-fail-icon.png')
        }
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-callback-neutral-icon.png')
        }
        return require('@/assets/img/timeline-callback-success-icon.png')
      }
      if (productType === 'VISHING SIMULATOR') {
        if (this.ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-fail-icon.png')
        }
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-vishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-vishing-answered-icon.png')
      }
      if (productType === 'SMISHING SIMULATOR') {
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-smishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-smishing-fail-icon.png')
      }
      if (productType === 'QUISHING SIMULATOR') {
        if (this.ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-fail-icon.png')
        }
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-quishing-neutral-icon.png')
        }
        return require('@/assets/img/timeline-quishing-success-icon.png')
      }
      if (productType === 'SECURITY AWARENESS') {
        if (this.ACTIVITY_TYPES_FAIL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-fail-icon.png')
        }
        if (this.ACTIVITY_TYPES_NEUTRAL_MAP[item.ActionType]) {
          return require('@/assets/img/timeline-awareness-neutral-icon.png')
        }
        if (this.ACTIVITY_TYPES_OPENED_MAP[item.ActionType]) {
          return require('@/assets/img/opened-email-yellow.png')
        }
        return require('@/assets/img/timeline-awareness-success-icon.png')
      }
      if (productType === 'INCIDENT RESPONDER') {
        return require('@/assets/img/timeline-ir-success-icon.png')
      }
      return require('@/assets/img/timeline-phishing-success-icon.png')
    }
  }
}
</script>

