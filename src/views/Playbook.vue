<template>
  <KContainer id="integrations">
    <el-tabs v-model="tab">
      <el-tab-pane label="Rules" name="rules" id="playbook--rules-content">
        <rules :PERMISSIONS="permissions" ref="refRules" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import Rules from '../components/Playbook/Rules'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'Playbook',
  components: {
    KContainer,
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
