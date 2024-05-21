<template>
  <CardLoading v-if="isLoading" :loading="isLoading" />
  <div class="campaign-manager-summary-card campaign-manager-summary-card--one-line" v-else>
    <slot name="header">
      <div class="campaign-manager-summary-card__header">
        <div class="campaign-manager-summary-card__header-left">
          <v-icon color="#2196f3" medium>
            {{ icon }}
          </v-icon>
          <div class="campaign-manager-summary-card__title ml-4">
            {{ title }}
          </div>
        </div>
        <slot name="header-right">
          <v-btn
            v-if="detailable"
            :id="detailableButtonId"
            class="campaign-manager-summary-card__button mr-6"
            rounded
            outlined
            color="#2196f3"
            @click="handlePreviewClick"
          >
            <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
            Preview
            <v-icon :color="'#2196f3'" class="ml-2" left medium>
              {{ showBodyDetail ? 'mdi-menu-up' : 'mdi-menu-down' }}
            </v-icon></v-btn
          >
        </slot>
      </div>
    </slot>
    <slot name="body">
      <div class="campaign-manager-summary-card__body">
        <div
          class="campaign-manager-summary-card__body-container campaign-manager-summary-card__body-container-one-line"
        >
          <div
            v-for="(val, key) in items"
            :key="key"
            class="campaign-manager-summary-card__body-item campaign-manager-summary-card__body-item-one-line"
          >
            <slot :name="key.replace(' ', '')" :props="{ key }">
              <div v-if="!hideLabel" class="campaign-manager-summary-card__body-item-key">
                {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
              </div>
              <div class="campaign-manager-summary-card__body-item-value">
                {{ val }}
              </div>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/IRCardLoading'

export default {
  name: 'CampaignManagerSummaryCardOneLine',
  components: { CardLoading },
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
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    detailableButtonId: {
      type: String
    }
  },
  methods: {
    handlePreviewClick() {
      this.$emit('previewClicked')
      this.$emit('update:showBodyDetail', !this.showBodyDetail)
    }
  }
}
</script>
