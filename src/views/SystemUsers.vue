<template>
  <div class="system-users" id="system-users">
    <v-layout wrap class="system-users__container">
      <v-card class="system-users__container-card">
        <el-tabs v-model="tab">
          <el-tab-pane label="People" name="system-users--people" id="system-users--people-content"
            ><people ref="refPeople"
          /></el-tab-pane>

          <el-tab-pane label="Roles" name="system-users--roles" id="system-users--roles-content">
            <Permissions ref="refPermissions" />
          </el-tab-pane>
        </el-tabs>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import People from '@/components/SystemUsers/People'
import Permissions from '../views/Permissions'
export default {
  name: 'SystemUsers',
  components: {
    People,
    Permissions
  },
  data() {
    return {
      tab: 'system-users--people'
    }
  },
  methods: {
    changeTabStatus(index) {
      this.tab = index
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refPeople } = this.$refs
    if (refPeople && refPeople.showCreateOrEditSystemUserModal) {
      refPeople.toggleCreateOrEditSystemUser()
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.system-users {
  min-height: 80vh !important;
  padding-top: 10px;
  .el-tabs__content {
    margin-top: 24px;
  }
  &__container {
    padding: 0 16px 24px 16px !important;
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
