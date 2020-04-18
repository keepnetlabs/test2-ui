<template>
  <div class="d-flex flex-row flex-wrap align-content-start flex-lg-grow-0 account-dd">
    <div v-if="companyDD && companyDD.length > 0" class="account-wrapper flex-grow-1">
      <v-select
        v-model="selectedCompany"
        :items="getDropdown"
        item-text="manager"
        item-value="companyId"
        single-line
        return-object
        :menu-props="{ contentClass: 'select-company-dd' }"
      ></v-select>
    </div>
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

<style scoped lang="scss">
.account-button {
  align-items: center;
  background-color: white;
}

::v-deep .v-list-item {
  min-height: 40px !important;
  margin: 0 10px;
  padding: 3px !important;
}

::v-deep .v-list-item:first-child {
  border-bottom: 1px solid rgba(155, 155, 155, 0.7);
}

.account-dd {
  @media only screen and (max-width: 769px) {
    justify-content: center !important;
    margin-right: 20px;
  }
}

.account-wrapper {
  align-items: center;
  margin-left: 35px;
  margin-top: 0;
  height: 40px;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  padding-top: 3px;
  width: 400px;

  @media only screen and (max-width: 900px) {
    width: 250px !important;
    flex-grow: unset !important;
  }
  @media only screen and (max-width: 683px) {
    display: none !important;
  }

  ::v-deep .v-select__slot {
    margin-left: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
  }

  ::v-deep .v-text-field > .v-input__control > .v-input__slot:before {
    border-style: none;
    border-width: none;
  }

  ::v-deep .v-input__slot {
    padding-bottom: 7px !important;
  }
  ::v-deep .v-text-field > .v-input__control > .v-input__slot:after {
    border: unset !important;
  }
  ::v-deep .v-text-field .v-input__append-inner {
    padding-right: 3px;
  }
}
</style>
