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
        :filterable="true"
        :row-key="'id'"
        :groupable="true"
        :options="true"
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
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: 'Company Name',
            fixed: true,
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            label: 'Email',
            fixed: true,
            sortable: true,
            show: true,
            type: 'text',
            width: 280,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            label: 'Description',
            fixed: true,
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
            fixed: true,
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            isEditable: true
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'left',
            label: 'Status',
            fixed: true,
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
        pageSizes: [5, 10, 25, 50, 100],
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
      newNotificationTemplateStatus: false
    }
  },
  methods: {
    toggleNewNotificationTemplate() {
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    }
  },
  created() {
    this.tableOptions.tableData = [
      {
        id: 3,
        name: '1',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        status: 'Active',
        description: 'Description Description',
        children: [
          {
            id: 33,
            name: '1.1',
            email: 'gurkan.ugurlu@keepnetlabs.com',
            status: 'Active',
            description: 'Description Description',
            children: [
              {
                id: 38,
                name: '1.1.1',
                email: 'gurkan.ugurlu@keepnetlabs.com',
                status: 'Active',
                description: 'Description Description'
              }
            ]
          }
        ]
      },
      {
        id: 34,
        name: '2',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        description: 'Description Description',
        status: 'Active',
        children: [
          {
            id: 40,
            name: '2.1',
            email: 'gurkan.ugurlu@keepnetlabs.com',
            description: 'Description Description',
            status: 'Active'
          }
        ]
      },
      {
        id: 55,
        name: '3',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        description: 'Description Description',
        status: 'Active'
      }
    ]
  }
}
</script>

<style lang="scss"></style>
