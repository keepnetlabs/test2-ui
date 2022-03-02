<template>
  <div class="campaign-manager-sending-report-event">
    <h4 class="campaign-manager-sending-report-event__title mb-2">{{ item.title }}</h4>
    <div class="campaign-manager-sending-report-event__content">
      <div class="campaign-manager-sending-report-event__content-left">
        <v-btn style="display: none;"></v-btn>
        <badge :outline="false" :text="getBadgeText" :color="getBadgeColor" />
        <div class="campaign-manager-sending-report-event__date ml-4">{{ item.date }}</div>
      </div>
      <div class="campaign-manager-sending-report-event__content-right">
        <v-icon @click="toggleDetail">{{ getIconName }}</v-icon>
      </div>
    </div>
    <div v-if="showDetail"></div>
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
    }
  },
  methods: {
    toggleDetail() {
      this.showDetail = !this.showDetail
    }
  }
}
</script>

<style lang="scss">
#campaign-manager-sending-report-data-table #container--extended-view {
  width: 532px !important;
}
.campaign-manager-sending-report-event {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #f5f7fa;
  &__content {
    display: flex;
    justify-content: space-between;
    &-left {
      display: flex;
      align-items: center;
    }
    &-right {
    }
  }
  &__title {
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #383b41;
  }
  &__date {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #383b41;
  }
}
</style>
