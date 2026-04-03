<template>
  <div
    :class="[
      'smishing-preview-skeleton',
      {
        'smishing-preview-skeleton--scenario-inline':
          hideScenarioNameBar && variant === 'scenario'
      }
    ]"
  >
    <!-- Scenario preview: name bar + Text/Message|Landing tabs + text tab (matches SmishingScenarioPreview loaded layout) -->
    <template v-if="variant === 'scenario'">
      <div v-if="!hideScenarioNameBar" class="smishing-preview-skeleton__scenario-bar">
        <v-skeleton-loader type="text" width="220" height="22" />
        <v-skeleton-loader type="avatar" width="36" height="36" />
      </div>
      <div class="smishing-preview-skeleton__tab-row">
        <v-skeleton-loader type="text" width="110" height="20" class="mr-8" />
        <v-skeleton-loader type="text" width="130" height="20" />
      </div>
      <div class="email-template-preview smishing-preview-skeleton__text-tab">
        <div class="email-template-preview__title">
          <v-skeleton-loader type="text" width="220" height="22" />
        </div>
        <div class="email-template-preview__container">
          <v-skeleton-loader type="text" width="72" height="14" class="mb-2" />
          <v-skeleton-loader type="text" width="100%" class="mb-3" />
          <v-skeleton-loader type="text" width="95%" class="mb-3" />
          <v-skeleton-loader type="text" width="88%" class="mb-3" />
          <v-skeleton-loader type="text" width="72%" />
        </div>
      </div>
    </template>

    <!-- Smishing campaign preview: matches CommonCampaignManagerSmishingPreviewDialog (bar + scenario tabs + inner tabs + text tab) -->
    <template v-else-if="variant === 'campaign'">
      <div class="smishing-preview-skeleton__campaign-bar">
        <v-skeleton-loader type="text" width="220" height="22" />
        <v-skeleton-loader type="avatar" width="36" height="36" />
      </div>
      <div class="smishing-preview-skeleton__scenario-tabs">
        <v-skeleton-loader type="text" width="140" height="20" />
        <v-skeleton-loader type="text" width="160" height="20" />
      </div>
      <div class="smishing-preview-skeleton__tab-row">
        <v-skeleton-loader type="text" width="110" height="20" class="mr-8" />
        <v-skeleton-loader type="text" width="130" height="20" />
      </div>
      <div class="email-template-preview smishing-preview-skeleton__text-tab">
        <div class="email-template-preview__title">
          <v-skeleton-loader type="text" width="220" height="22" />
        </div>
        <div class="email-template-preview__container">
          <v-skeleton-loader type="text" width="72" height="14" class="mb-2" />
          <v-skeleton-loader type="text" width="100%" class="mb-3" />
          <v-skeleton-loader type="text" width="95%" class="mb-3" />
          <v-skeleton-loader type="text" width="88%" class="mb-3" />
          <v-skeleton-loader type="text" width="72%" />
        </div>
      </div>
    </template>

    <!-- Text message template preview (drawer without tabs above — keep default title spacing) -->
    <template v-else-if="variant === 'text'">
      <div class="email-template-preview">
        <div class="email-template-preview__title">
          <v-skeleton-loader type="text" width="220" height="22" />
        </div>
        <div class="email-template-preview__container">
          <v-skeleton-loader type="text" width="72" height="14" class="mb-2" />
          <v-skeleton-loader type="text" width="100%" class="mb-3" />
          <v-skeleton-loader type="text" width="95%" class="mb-3" />
          <v-skeleton-loader type="text" width="88%" class="mb-3" />
          <v-skeleton-loader type="text" width="72%" />
        </div>
      </div>
    </template>

    <!-- Landing page template preview -->
    <template v-else-if="variant === 'landing'">
      <div class="smishing-preview-skeleton__card">
        <div class="mb-3">
          <v-skeleton-loader type="text" width="120" height="16" class="mb-2" />
          <v-skeleton-loader type="text" width="260" height="18" />
        </div>
        <div class="mb-4">
          <v-skeleton-loader type="text" width="100" height="16" class="mb-2" />
          <v-skeleton-loader type="text" width="90%" height="18" />
        </div>
        <v-skeleton-loader
          type="image"
          height="320"
          class="smishing-preview-skeleton__preview-block"
          :boilerplate="false"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SmishingPreviewSkeleton',
  props: {
    variant: {
      type: String,
      default: 'scenario',
      validator: (v) => ['scenario', 'text', 'landing', 'campaign'].includes(v)
    },
    /** When true (scenario variant), skip the fake name bar — use when the parent already shows the real scenario strip (e.g. SmishingScenarioPreview). */
    hideScenarioNameBar: {
      type: Boolean,
      default: false
    }
  }
}
</script>
