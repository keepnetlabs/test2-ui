<template>
  <div class="email-template-preview-skeleton">
    <!-- Title Skeleton -->
    <v-skeleton-loader type="heading" width="250" class="mb-4 mt-6" />

    <!-- Container -->
    <div class="email-template-preview-skeleton__container mt-6">
      <!-- Header Skeleton -->
      <div class="email-template-preview-skeleton__header">
        <v-skeleton-loader type="text" width="300" class="mb-0" />
        <div class="d-flex gap-2">
          <v-skeleton-loader type="button" width="36" height="36" />
          <v-skeleton-loader type="button" width="36" height="36" />
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Template Info Skeleton -->
      <div class="email-template-preview-skeleton__info">
        <!-- Subject with Button -->
        <div class="d-flex align-center justify-space-between mb-2">
          <v-skeleton-loader type="text" width="400" class="mb-0" />
          <v-skeleton-loader type="button" width="140" height="36" />
        </div>

        <!-- From Name -->
        <v-skeleton-loader type="text" width="350" class="mb-2" />

        <!-- From Email -->
        <v-skeleton-loader type="text" width="380" class="mb-2" />

        <!-- CC (optional) -->
        <v-skeleton-loader type="text" width="320" class="mb-2" />
      </div>

      <v-divider class="my-4" />

      <!-- Email Content Skeleton -->
      <div class="email-template-preview-skeleton__content">
        <v-skeleton-loader type="image" height="500" class="mb-0" :boilerplate="false" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailTemplatePreviewSkeleton'
}
</script>

<style scoped lang="scss">
.email-template-preview-skeleton {
  &__container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  &__info {
    margin-bottom: 16px;
  }

  &__content {
    border-radius: 8px;
    overflow: hidden;
    min-height: 500px;

    ::v-deep .v-skeleton-loader__image {
      height: 500px !important;
    }
  }
}
</style>
