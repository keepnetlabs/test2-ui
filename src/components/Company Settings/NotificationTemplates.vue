<template>
  <div class="notification-templates">
    <company-settings-header
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <new-notification-template
      :status="newNotificationTemplateStatus"
      @closeOverlay="toggleNewNotificationTemplate"
    />
    <delete-notification-template-modal :status="showDeleteNotificationTemplateModal" />
    <div class="notification-templates__container">
      <data-table
        ref="refNotificationList"
        :columns="tableOptions.columns"
        :countRow="5"
        :table="tableOptions.tableData"
        :empty="tableOptions.empty"
        id="company-settings-notification-templates-data-table"
        :filterable="true"
        :row-key="'name'"
        :clusterItems="[{ name: 'Email Address' }]"
        :groupable="true"
        :is-downloadable="false"
        @clusterChanged="clusterChanged"
        :options="true"
        @handleListBulleted="handleListBulleted"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :refName="'notificationList'"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        @handleAddNotificationTemplates="toggleNewNotificationTemplate"
        @onEmptyBtnClicked="toggleNewNotificationTemplate"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate'
export default {
  name: 'NotificationTemplates',
  components: {
    NewNotificationTemplate,
    DeleteNotificationTemplateModal,
    DataTable,
    CompanySettingsHeader
  },
  data() {
    return {
      tableOptions: {
        tableData: [],
        columns: [
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            label: 'Email',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 280,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: 'Company Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            isEditable: true
          },
          {
            property: 'createDate',
            align: 'left',
            label: 'Date Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            label: 'Description',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'badge',
            width: 200,
            isEditable: true
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template'
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_NOTIFICATION_TEMPLATE_DEFINED,
          subMes: 'Create a new user directory integration',
          btn: 'Create Notification Template',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'handleEdit'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ]
      },
      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false,
      listData: [
        {
          id: 3,
          name: '1',
          email: 'gurkan@keepnetlabs.com',
          status: 'Active',
          createDate: '2020-10-30 15:10:44',
          description: 'Description'
        },
        {
          id: 33,
          name: '1.1',
          email: 'gurkan@keepnetlabs.com',
          status: 'Inactive',
          createDate: '2020-10-18 15:10:44',
          description: 'Description'
        },
        {
          id: 33,
          name: '1.2',
          email: 'gurkan@keepnetlabs.com',
          status: 'Active',
          createDate: '2020-10-08 19:10:22',
          description: 'Description'
        },
        {
          id: 34,
          name: '2',
          email: 'ozan@keepnetlabs.com',
          description: 'Description Description',
          status: 'Active',
          createDate: '2020-10-03 10:58:12'
        },
        {
          id: 40,
          name: '2.1',
          email: 'ozan@keepnetlabs.com',
          description: 'Description Description',
          createDate: '2020-10-01 10:58:59',
          status: 'Active'
        },
        {
          id: 55,
          name: '3',
          email: 'ali@keepnetlabs.com',
          description: 'Description Description',
          createDate: '2020-10-01 10:51:59',
          status: 'Active'
        }
      ],
      clusterData: [
        {
          id: 3,
          name: '1',
          email: 'gurkan@keepnetlabs.com',
          status: 'Active',
          createDate: '2020-10-30 15:10:44',
          description: 'Description',
          children: [
            {
              id: 33,
              name: '1.1',
              email: 'gurkan@keepnetlabs.com',
              status: 'Inactive',
              createDate: '2020-10-18 15:10:44',
              description: 'Description'
            },
            {
              id: 33,
              name: '1.2',
              email: 'gurkan@keepnetlabs.com',
              status: 'Active',
              createDate: '2020-10-08 19:10:22',
              description: 'Description'
            }
          ]
        },
        {
          id: 34,
          name: '2',
          email: 'ozan@keepnetlabs.com',
          description: 'Description Description',
          status: 'Active',
          createDate: '2020-10-03 10:58:12',
          children: [
            {
              id: 40,
              name: '2.1',
              email: 'ozan@keepnetlabs.com',
              description: 'Description Description',
              createDate: '2020-10-01 10:58:59',
              status: 'Active'
            }
          ]
        },
        {
          id: 55,
          name: '3',
          email: 'ali@keepnetlabs.com',
          description: 'Description Description',
          createDate: '2020-10-01 10:51:59',
          status: 'Active'
        }
      ]
    }
  },
  methods: {
    toggleNewNotificationTemplate() {
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    },
    handleListBulleted() {
      this.$refs.refNotificationList.loadWithDataArray(this.listData)
    },
    clusterChanged() {
      this.$refs.refNotificationList.loadWithDataArray(this.clusterData)
    }
  },
  created() {
    this.tableOptions.tableData = this.listData
  }
}
</script>

<style lang="scss"></style>
