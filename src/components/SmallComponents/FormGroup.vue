<template>
  <v-list-item :class="['k-form-group', className]">
    <v-list-item-content>
      <label class="k-form-group__title" v-if="title">
        {{ title }}
      </label>
      <v-list-item-subtitle class="k-form-group__sub-title" v-if="subTitle">
        {{ subTitle }}
      </v-list-item-subtitle>
      <div :class="['k-form-group__content', hasHint && 'k-form-group__content-hint']">
        <slot></slot>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'FormGroup',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    hasHint: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.k-form-group {
  min-height: auto !important;
  max-width: 554px;
  margin-bottom: 1px;
  .v-list-item__content {
    overflow: visible;
    padding: 0;
  }
  &.v-list-item {
    padding: 0;
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  &__sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  &__content {
    margin-top: 8px;
    &-hint {
      margin-bottom: 13px;
    }
  }
}
</style>
