<template>
  <div class="landing-page-preview-skeleton">
    <!-- Header Skeleton -->
    <div class="landing-page-preview-skeleton__header">
      <v-skeleton-loader type="text" width="300" class="mb-0" />
      <div class="d-flex gap-2">
        <v-skeleton-loader type="button" width="36" height="36" />
        <v-skeleton-loader type="button" width="36" height="36" />
      </div>
    </div>

    <!-- Browser Toolbar Skeleton -->
    <div class="landing-page-preview-skeleton__toolbar">
      <div class="landing-page-preview-skeleton__dots">
        <span class="skeleton-dot"></span>
        <span class="skeleton-dot"></span>
        <span class="skeleton-dot"></span>
      </div>
      <v-skeleton-loader type="text" width="400" height="32" class="mb-0" />
    </div>

    <!-- Content Skeleton -->
    <div class="landing-page-preview-skeleton__content">
      <v-skeleton-loader type="image" height="600" class="mb-0" :boilerplate="false" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPagePreviewSkeleton'
}
</script>

<style scoped lang="scss">
.landing-page-preview-skeleton {
  padding: 16px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    padding-left: 0;
    position: relative;
    margin-bottom: 16px;
  }

  &__dots {
    position: absolute;
    left: 4px;
    display: flex;
    gap: 8px;
  }

  .skeleton-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    display: inline-block;
    animation: pulse 1.5s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  &__content {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    min-height: 600px;

    ::v-deep .v-skeleton-loader__image {
      height: 600px !important;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
