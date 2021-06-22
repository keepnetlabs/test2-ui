<template>
  <v-list-item class="pl-0 add-in-configuration__list-item">
    <v-list-item-content>
      <v-list-item-title class="add-in-configuration__title">
        {{ title }}
      </v-list-item-title>
      <v-list-item-subtitle class="add-in-configuration__subtitle">
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ConfigureCompanyStepHeader',
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    }
  }
}
</script>
