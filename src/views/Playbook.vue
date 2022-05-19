<template>
  <div class="k-container" id="playbook">
    <v-layout id="ts-layout" style="min-height: 80vh;" wrap>
      <v-col class="k-container__tab-container" cols="12">
        <v-card class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane label="Rules" name="rules" id="playbook--rules-content">
              <rules :PERMISSIONS="permissions" ref="refRules" />
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Rules from '../components/Playbook/Rules'
import { mapGetters } from 'vuex'
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
      tab: 'rules'
    }
  },
  computed: {
    ...mapGetters({
      permissions: 'permissions/getPlaybookPermissions'
    })
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
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
