<template>
  <CardLoading
    :loading="isLoading"
    :class="[
      'campaign-manager-report-summary-info-card',
      isLoading && 'campaign-manager-report-summary-info-card--loading'
    ]"
    :style="{ backgroundColor }"
  >
    <template #skeleton-content>
      <div class="campaign-manager-report-summary-info-card-body">
        <div class="campaign-manager-report-summary-info-card-body__header">
          <span>{{ title }}</span>
        </div>
        <div class="campaign-manager-report-summary-info-card-body__content mt-4 mb-7">
          <span>{{ userCount }}</span> <span>users</span>
        </div>
        <div class="campaign-manager-report-summary-info-card-body__footer">
          <span>{{ userPercent }}%</span> <span> of target users</span>
        </div>
        <div class="campaign-manager-report-summary-info-card-body__icon">
          <slot name="icon">
            <img :src="iconSrc" alt="icon" />
          </slot>
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/IRCardLoading'
export default {
  name: 'CampaignManagerReportSummaryInfoCard',
  components: { CardLoading },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    userCount: {
      type: Number,
      default: 0
    },
    userPercent: {
      type: String,
      default: '0'
    },
    backgroundColor: {
      type: String,
      default: '#43A047'
    },
    iconSrc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-info-card {
  min-width: 300px;
  max-height: 170px;
  border-radius: 8px;
  padding: 16px;
  &--loading {
    width: 100%;
  }
  &-body {
    &__header {
      font-weight: 600;
      font-size: 20px;
      line-height: 23px;
      color: #ffffff;
    }
    &__content {
      span {
        color: #ffffff;
        font-weight: normal;
        &:first-child {
          font-size: 48px;
          line-height: 48px;
        }
        &:last-child {
          font-size: 20px;
          line-height: 25px;
        }
      }
    }
    &__footer {
      span {
        color: #ffffff;
        font-weight: 600;
        line-height: 23px;
        &:first-child {
          font-size: 20px;
        }
        &:last-child {
          font-size: 16px;
        }
      }
    }
    &__icon {
      position: absolute;
      right: 0;
      bottom: -2px;
    }
  }
}
</style>
