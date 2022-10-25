<template>
  <KContainer id="integrations" tabless>
    <rules :PERMISSIONS="permissions" ref="refRules" />
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
  computed: {
    ...mapGetters({
      permissions: 'permissions/getPlaybookPermissions'
    })
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
