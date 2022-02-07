<template>
  <div class="k-container" id="playbook">
    <v-layout id="ts-layout" style="min-height: 80vh;" wrap>
      <v-col class="k-container__tab-container" cols="12">
        <v-card class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane label="Rules" name="rules" id="playbook--rules-content">
              <rules :PERMISSIONS="PERMISSIONS" ref="refRules" />
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Rules from '../components/Playbook/Rules'
import { getPermissionsOfAllItems } from '@/utils/functions'
import PERMISSIONS from '@/permissions'
export default {
  name: 'Playbook',
  components: {
    Rules
  },
  props: {
    playbookId: {
      type: String
    }
  },
  data() {
    return {
      tab: 'rules',
      PERMISSIONS: []
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    getPermissions() {
      const { PLAYBOOK_PERMISSIONS } = PERMISSIONS
      this.PERMISSIONS = getPermissionsOfAllItems(PLAYBOOK_PERMISSIONS)
    }
  },
  created() {
    this.getPermissions()
  },
  beforeRouteLeave(to, from, next) {
    const { refRules } = this.$refs
    if (refRules && refRules.showRuleModal) {
      refRules.checkIfCanCloseRuleModal()
      next(false)
    } else {
      next()
    }
  }
}
</script>
