<template>
  <div class="campaign-manager-summary-card">
    <slot name="header">
      <div class="campaign-manager-summary-card__header">
        <div class="campaign-manager-summary-card__header-left">
          <v-icon color="#2196f3" medium>
            {{ icon }}
          </v-icon>
          <div class="campaign-manager-summary-card__title ml-4">{{ title }}</div>
        </div>
        <slot name="header-right">
          <v-btn
            v-if="detailable"
            class="campaign-manager-summary-card__button mr-6"
            rounded
            outlined
            color="#2196f3"
            @click="$emit('update:showBodyDetail', !showBodyDetail)"
            >Details
            <v-icon :color="'#2196f3'" class="ml-2" left medium>
              {{ showBodyDetail ? 'mdi-menu-up' : 'mdi-menu-down' }}
            </v-icon></v-btn
          >
        </slot>
      </div>
    </slot>
    <slot name="body">
      <div class="campaign-manager-summary-card__body">
        <div class="campaign-manager-summary-card__body-container">
          <div
            v-for="(val, key) in items"
            :key="key"
            class="campaign-manager-summary-card__body-item"
          >
            <div v-if="!hideLabel" class="campaign-manager-summary-card__body-item-key">
              {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
            </div>
            <div class="campaign-manager-summary-card__body-item-value">{{ val }}</div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'CampaignManagerSummaryCard',
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    },
    items: {
      type: Object
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    showBodyDetail: {
      type: Boolean
    },
    detailable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-summary-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    &-left {
      display: flex;
      padding: 24px;
    }
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
    color: #2196f3;
  }
  &__body {
    background-color: #fafafa;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    height: calc(100% - 73px);
    &-container {
      padding: 24px;
    }
    &-item {
      display: flex;
      font-size: 12px;
      line-height: 19px;
      color: #383b41;
      word-break: break-all;
      padding: 16px;
      &:first-child {
        padding: 0 16px 16px 16px !important;
        border-bottom: 1px solid #e0e0e0;
      }
      &:last-child {
        padding-bottom: 0;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #e0e0e0;
      }
      &-key {
        display: flex;
        font-weight: 600;
        flex-basis: 30%;
        @media (max-width: 768px) {
          flex-basis: 50%;
        }
      }
    }
  }
  &__button {
    padding-right: 4px !important;
    .v-btn__content {
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      text-transform: capitalize;
    }
  }
}
</style>
