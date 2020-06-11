<template>
  <div class="target-users" id="target-users">
    <v-container class="target-users__container" fluid>
      <v-card class="target-users__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          class="target-users__tabs"
          v-model="tab"
        >
          <v-tab
            @click="changeTabStatus(0)"
            class="target-users__tab target-users__tab--people p-2"
            id="pr-tab-people"
          >
            People
          </v-tab>
          <v-tab @click="changeTabStatus(1)" class="target-users__tab p-2">Groups</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="target-users__tabs-items">
          <v-tab-item>
            <people ref="refPeople" />
          </v-tab-item>
          <v-tab-item>
            <groups />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import People from '../components/TargetUsers/People'
import Groups from '../components/TargetUsers/Groups'
export default {
  components: {
    People,
    Groups
  },
  data() {
    return {
      tab: 0
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs && this.$refs.refPeople && this.$refs.refPeople.isWantToShowDeleteUserModal) {
      this.$refs.refPeople.changeDeleteModalStatus(false)
      next(false)
    } else {
      next()
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
  }
}
</script>
<style lang="scss">
.target-users {
  &__container {
    padding: 24px 16px !important;

    &-card {
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12);
      padding: 15px 5px 18px 24px !important;
      border-radius: 20px !important;
      height: 646px;
    }
  }

  &__tabs {
    .v-slide-group__content {
      border-bottom: 2px solid #e4e7ed;
    }

    .v-tabs-slider-wrapper {
      bottom: -1px !important;
      color: #0486fe !important;
    }
    .v-slide-group__content.v-tabs-bar__content:after {
      display: none;
    }
    .v-tabs-slider {
      width: 79%;
    }
  }
  &__tab {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    text-transform: capitalize;
    color: rgba(0, 0, 0, 0.87) !important;
    padding: 0;
    display: flex;
    justify-content: flex-start;

    &:before {
      background-color: white;
    }

    &--people {
      margin-right: 25px !important;
    }

    &-active {
      color: #2196f3 !important;
    }
  }
}
</style>
