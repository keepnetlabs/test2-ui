<template>
  <div v-if="companyDD && companyDD.length > 0" class="account-select d-none d-md-block">
    <v-select
      v-model="selectedCompany"
      :items="getDropdown"
      item-text="manager"
      item-value="companyId"
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
  data: () => ({
    selectedItems: ['Company 1', 'Company 2', 'Company 3'],
    drop: [
      {
        companyId: 'b3b48bd1-2625-45f4-b841-0791ddfca7fb',
        Manager: ''
      },
      {
        companyId: '68abe717-0602-4a27-ae6c-6ed7a681f8d1',
        Manager: 'A BANK'
      },
      {
        companyId: 'e3f890ac-4cd7-459b-a4e0-0f0ed41733c7',
        Manager: 'Abdi İbrahim'
      },
      {
        companyId: 'ac02a0e8-23de-478c-ac4f-450166771c57',
        Manager: 'Abdulkerim'
      }
    ]
  }),
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
    selectedCompany: {
      get() {
        return this.selectedCompanyFromStore
      },
      set(newValue) {
        if (newValue.companyId == 'default') {
          this.setDialogSwitch(true)
        } else {
          this.selectCompany(newValue)
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
