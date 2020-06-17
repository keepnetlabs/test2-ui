<template>
  <div class="target-users" id="target-users">
    <v-container class="target-users__container" fluid>
      <v-card class="target-users__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          class="k-tabs"
          v-model="tab"
        >
          <v-tab @click="changeTabStatus(0)" class="k-tab p-2" id="pr-tab-people">
            People
          </v-tab>
          <v-tab @click="changeTabStatus(1)" class="k-tab p-2">Groups</v-tab>
          <v-tab @click="changeTabStatus(1)" class="k-tab p-2">Smart Groups</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="target-users__tabs-items">
          <v-tab-item>
            <people ref="refPeople" />
          </v-tab-item>
          <v-tab-item>
            <groups />
          </v-tab-item>
          <v-tab-item>
            <smart-groups />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import People from '../components/TargetUsers/People'
import Groups from '../components/TargetUsers/Groups'
import SmartGroups from '../components/TargetUsers/SmartGroups'
export default {
  components: {
    SmartGroups,
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
    }
  }
}
</style>
