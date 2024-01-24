<template>
  <ElTabs v-model="tab" class="k-sub-tab" ref="refTabContainer">
    <ElTabPane
      v-if="getAccountPrivacyPermission"
      label="Account Privacy"
      name="account-privacy"
      id="account-privacy-content"
    >
      <AccountPrivacy v-if="tab === 'account-privacy'" ref="refAccountPrivacy"
    /></ElTabPane>
    <ElTabPane
      v-if="getAccountPrivacyPermission"
      label="Data Privacy"
      name="data-privacy"
      id="data-privacy-content"
    >
      <DataPrivacy ref="refDataPrivacy"
    /></ElTabPane>
  </ElTabs>
</template>
<script>
import DataPrivacy from '@/components/Company Settings/Privacy/DataPrivacy'
import AccountPrivacy from '@/components/Company Settings/AccountPrivacy/AccountPrivacy'
import { mapGetters } from 'vuex'

export default {
  name: 'Privacy',
  components: {
    DataPrivacy,
    AccountPrivacy
  },
  data() {
    return {
      tab: 'account-privacy'
    }
  },
  computed: {
    ...mapGetters({
      getAccountPrivacyPermission: 'permissions/getAccountPrivacyPermission'
    })
  }
}
</script>
