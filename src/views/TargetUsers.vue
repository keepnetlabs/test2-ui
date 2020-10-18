<template>
  <div class="target-users" id="target-users">
    <v-layout wrap class="target-users__container">
      <v-card class="target-users__container-card">
        <el-tabs v-model="tab">
          <el-tab-pane label="People" name="first"><people ref="refPeople" /></el-tab-pane>
          <el-tab-pane label="Group" name="second"> <groups /></el-tab-pane>
        </el-tabs>
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
    People,
    Groups
  },
  data() {
    return {
      tab: 'first'
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
  padding-top: 10px;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
