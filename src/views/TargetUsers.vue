<template>
  <div class="target-users" id="target-users">
    <v-container class="target-users__container" fluid>
      <v-card class="target-users__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          id="pr-tabs"
          v-model="tab"
        >
          <v-tab @click="changeTabStatus(0)" class="pr-tab pr-tab-people p-2" id="pr-tab-people">
            People
          </v-tab>
          <v-tab @click="changeTabStatus(1)" class="pr-tab p-2" id="pr-tab-groups">Groups</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
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
<style lang="scss" scoped>
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
}

.pr-tab {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  text-transform: capitalize;
  padding-left: 0 !important;
  padding-right: 0 !important;
  display: flex;
  justify-content: flex-start;

  &-people {
    margin-right: 35px !important;
  }

  &-active {
    color: #2196f3 !important;
  }
}

::v-deep {
  .v-slide-group__content {
    border-bottom: 2px solid #e4e7ed;
    margin-right: 20px;
  }

  .v-tabs-slider-wrapper {
    bottom: -1px !important;
    color: #0486fe !important;
  }

  .v-tabs-slider {
    width: 92% !important;
  }
}
</style>
