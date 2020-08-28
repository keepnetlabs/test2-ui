<template>
  <div class="ip-addresses">
    <company-settings-header title="IP Addresses" sub-title="Define IP Addresses" />
    <div class="ip-addresses__container">
      <data-table
        id="ipAdressesList"
        ref="refIpAddressesList"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
        :extended-view-options="extendedViewOptions"
        :extended-view-value="extendedViewValue"
        @closeCreateMode="isIpAddressCreate = false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :refName="'ipAddressesList'"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :is-extended-view-create-mode="isIpAddressCreate"
        @handleAddIpAddress="handleAddIpAddress"
        :sizeable="true"
        @onEmptyBtnClicked="isIpAddressCreate = true"
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import { ip, maxLength, required } from '@/utils/validations'

export default {
  name: 'IpAddresses',
  components: {
    CompanySettingsHeader,
    DataTable
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.IPADDRESS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.IPADDRESS),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        empty: {
          message: LABEL_STORE.NO_IP_ADDRESS_DEFINED,
          btn: 'Add a New IP Address',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddIpAddress',
          tooltip: 'Add an Ip Address'
        }
      },
      isIpAddressCreate: false,
      extendedViewOptions: {
        title: 'New Ip Address',
        col: [
          {
            property: PROPERTY_STORE.IPADDRESS,
            label: 'Ip Address:',
            type: 'text',
            show: true,
            isEditable: true,
            editOptions: {
              component: 'textfield',
              props: {
                rules: [
                  (v) => this.validations.required(v, 'Required'),
                  (v) => this.validations.ip(v, 'Invalid ip address')
                ]
              }
            }
          }
        ]
      },
      validations: {
        maxLength,
        required,
        ip
      },
      extendedViewValue: [
        {
          ipAddress: ''
        }
      ]
    }
  },
  created() {},
  methods: {
    handleAddIpAddress() {}
  }
}
</script>

<style lang="scss">
.ip-addresses {
  &__container {
  }
}
</style>
