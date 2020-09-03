<template>
  <div class="system-users" id="system-users">
    <v-layout wrap class="system-users__container">
      <v-card class="system-users__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          class="k-tabs"
          v-model="tab"
        >
          <v-tab
            :key="tab"
            @click="changeTabStatus(index)"
            class="k-tab"
            v-for="(tab, index) in tabItems"
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item> </v-tab-item>
          <v-tab-item> </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'SystemUsers',
  data() {
    return {
      tabItems: ['People', 'User Roles'],
      tab: 0
    }
  },
  methods: {
    changeTabStatus(index) {
      this.tab = index
    }
  }
}
</script>

<style lang="scss">
.system-users {
  min-height: 80vh !important;
  padding-top: 10px;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    .v-slide-group__next--disabled,
    .v-slide-group__prev--disabled {
      display: none;
    }
    .v-window__container {
      margin-top: 24px;
    }
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
