<template>
  <KContainer id="system-users">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getSystemUsersSearchPermission"
        label="People"
        name="system-users--people"
        id="system-users--people-content"
      >
        <people v-if="tab === 'system-users--people'" ref="refPeople"
      /></el-tab-pane>

      <el-tab-pane
        v-if="getSystemRolesSearchPermission"
        label="Roles"
        name="system-users--roles"
        id="system-users--roles-content"
      >
        <Permissions v-if="tab === 'system-users--roles'" ref="refPermissions" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import People from '@/components/SystemUsers/People'
import Permissions from '../views/Permissions'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'SystemUsers',
  components: {
    KContainer,
    People,
    Permissions
  },
  data() {
    return {
      tab: 'system-users--people'
    }
  },
  computed: {
    ...mapGetters({
      getSystemUsersSearchPermission: 'permissions/getSystemUsersSearchPermission',
      getSystemRolesSearchPermission: 'permissions/getSystemRolesSearchPermission'
    })
  },
  methods: {
    changeTabStatus(index) {
      this.tab = index
    }
  },

  beforeRouteLeave(to, from, next) {
    const { refPeople, refPermissions } = this.$refs
    if (refPeople && refPeople.showCreateOrEditSystemUserModal) {
      refPeople.checkIfCanCloseSystemUserModal()
      next(false)
    } else if (refPermissions && refPermissions.newPermissionsModalStatus) {
      refPermissions.checkIfCanClosePermissionsModal()
      next(false)
    } else {
      next()
    }
  },
  created() {
    if (!this.getSystemUsersSearchPermission && this.getSystemRolesSearchPermission) {
      this.tab = 'system-users--roles'
    }
  }
}
</script>
