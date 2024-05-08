<template>
  <div class="campaign-manager-sending-report-event mt-2">
    <h4 class="campaign-manager-sending-report-event__title mb-2">{{ item.title }}</h4>
    <div class="campaign-manager-sending-report-event__content">
      <div class="campaign-manager-sending-report-event__content-left">
        <v-btn style="display: none;"></v-btn>
        <badge :outline="false" :text="getBadgeText" :color="getBadgeColor" />
        <div class="campaign-manager-sending-report-event__date ml-4">
          <span>{{ getDate }}</span>
          <span v-if="getLocalTime" style="font-size: 9px;">User's Time: {{ getLocalTime }}</span>
        </div>
      </div>
      <div class="campaign-manager-sending-report-event__content-right">
        <v-icon @click="toggleDetail" v-if="item.reason">{{ getIconName }}</v-icon>
      </div>
    </div>
    <div class="campaign-manager-sending-report-event__content-detail" v-if="showDetail">
      {{ item.reason }}
    </div>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
import { getBtnStatusColor } from '@/utils/functions'
export default {
  name: 'CampaignManagerReportSendingReportEvent',
  components: { Badge },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showDetail: false
    }
  },
  computed: {
    getBadgeText() {
      const { status } = this.item
      return status
    },
    getBadgeColor() {
      const { status } = this.item
      return getBtnStatusColor(status)
    },
    getIconName() {
      return this.showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    getDate() {
      const { status, date, attemptNum } = this.item
      if (status === 'deferred') return `${date} - Attempt #${attemptNum}`
      return date
    },
    getLocalTime() {
      return this.item?.localTime || ''
    }
  },
  methods: {
    toggleDetail() {
      this.showDetail = !this.showDetail
    }
  }
}
</script>
