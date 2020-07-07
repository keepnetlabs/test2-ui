<template>
  <div class="target-users" id="target-users">
    <v-layout wrap class="target-users__container">
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
    </v-layout>
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
    const refs = this.$refs
    if (refs && refs.refPeople) {
      const refPeople = refs.refPeople
      if (refPeople.isWantToShowDeleteUserModal) {
        refPeople.changeDeleteModalStatus(false)
        next(false)
      } else if (refPeople.isWantToShowAddUsersManuallyModal) {
        refPeople.isWantToShowAddUsersManuallyModal = false
        next(false)
      } else if (refPeople.isWantToShowAddUsersModal) {
        refPeople.isWantToShowAddUsersModal = false
        next(false)
      } else if (refPeople.isWantToShowImportUsersFromFileModal) {
        refPeople.isWantToShowImportUsersFromFileModal = false
        next(false)
      } else if (refPeople.isWantToShowCustomFieldsModal) {
        next(false)
      } else {
        next()
      }
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
  min-height: 80vh !important;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 5px 18px 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
