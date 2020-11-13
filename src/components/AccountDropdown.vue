<template>
  <div
    v-if="isRootOrResellar && companyDD && getDropdown[0].companyId !== 'default'"
    class="account-select d-none d-md-block"
  >
    <v-select
      v-model="selectedCompany"
      :items="getDropdown"
      item-text="name"
      item-value="companyResourceId"
      single-line
      return-object
      :menu-props="{ offsetY: true }"
      solo
      flat
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AccountDropdown',
  data() {
    return {}
  },
  methods: {
    ...mapActions({
      selectCompany: 'dashboard/selectCompany',
      setDialogSwitch: 'dashboard/setSwitchDialog'
    })
  },
  computed: {
    ...mapGetters({
      getDropdown: 'dashboard/getSwitchAccountDropdown',
      selectedCompanyFromStore: 'dashboard/getSelectedCompany',
      companyDD: 'dashboard/getCompanyDropdowns'
    }),
    isRootOrResellar() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    },
    selectedCompany: {
      get() {
        return this.selectedCompanyFromStore
      },
      set(newValue) {
        if (newValue.companyId == 'default') {
          this.$store.commit('SET_CURRENTUSER', this.selectedCompany)
          this.setDialogSwitch(true)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.account-select {
  align-items: center;
  margin-left: 35px;
  margin-top: 0;
  height: 40px;
  border-radius: 8px;
  width: 400px;

  .v-text-field--outlined {
    fieldset {
      border-color: white;
    }
  }
}
</style>
