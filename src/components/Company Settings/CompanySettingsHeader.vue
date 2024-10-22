<template>
  <div class="company-settings__header mt-6">
    <v-list-item>
      <v-list-item-content>
        <template v-if="slots.title">
          <slot name="title"> </slot>
        </template>
        <v-list-item-title v-else class="company-settings__title">
          {{ title }}
        </v-list-item-title>
        <v-list-item-subtitle class="company-settings__subtitle">
          {{ subTitle }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'CompanySettingsHeader',
  props: {
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    slots: {
      type: Object,
      default: () => ({ title: false })
    }
  }
}
</script>
