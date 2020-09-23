<template>
  <div class="company-settings__header">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="company-settings__title">
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
    }
  }
}
</script>

<style lang="scss"></style>
