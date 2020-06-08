<template>
  <div class="integrations" id="integrations">
    <v-layout id="ts-layout" wrap style="min-height: 79vh;">
      <v-col class="pl-0 integrations__tab-container" cols="12">
        <v-card id="pr-card" class="pr-card">
          <v-tabs
            id="pr-tabs"
            v-model="tab"
            background-color="transparent"
            color="basil"
            active-class="pr-tab-active"
          >
            <v-tab id="pr-tab-users" class="pr-tab pr-tab-users p-2" @click="changeTabStatus(0)">
              Integrations
            </v-tab>
            <v-tab id="pr-tab-settings" class="pr-tab p-2" @click="changeTabStatus(1)"
              >Clients
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <integration />
            </v-tab-item>
            <v-tab-item>
              <clients />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Integrations from '../components/Integrations/Integrations'
import Clients from '../components/Integrations/Clients'

export default {
  name: 'Integrations',
  components: {
    integration: Integrations,
    clients: Clients
  },
  data() {
    return {
      tab: 0
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  }
}
</script>

<style lang="scss">
.integrations {
  padding: 16px;
  padding-top: 10px;

  &__tab-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-top: 16px !important;
  }

  .v-slide-group__content {
    border-bottom: 2px solid #e4e7ed;
    margin-right: 20px;
  }

  .v-window__container {
    margin-top: 24px !important;
  }

  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #ffffff;
    padding: 0;
  }

  .v-tabs-slider-wrapper {
    bottom: -1px !important;
    color: #0486fe !important;
  }
}

.pr-tab {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.87) !important;

  &-users {
    margin-right: 35px !important;
  }

  &-active {
    color: #2196f3 !important;
  }
}

.pr-card {
  box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 1px -1px rgba(204, 204, 204, 0.12);
  padding: 10px 5px 18px 24px !important;
  border-radius: 20px;
}
</style>
