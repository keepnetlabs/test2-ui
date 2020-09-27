<template>
  <div class="notification-templates">
    <company-settings-header
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <new-notification-template
      :status="newNotificationTemplateStatus"
      @closeOverlay="newNotificationTemplateStatus = false"
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
        @handleAddNotificationTemplates="handleAddNotificationTemplates"
        @onEmptyBtnClicked="newNotificationTemplateStatus = true"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import { getStoreValue, LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
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
    handleAddNotificationTemplates() {}
  },
  created() {
    this.tableOptions.tableData = [
      {
        id: 3,
        name: 'Doğus Holding',
        children: [
          {
            id: 33,
            name: 'Garanti Bankası',
            children: [
              {
                id: 38,
                name: 'Garanti Yatırım'
              }
            ]
          }
        ]
      },
      {
        id: 34,
        name: 'Türk Hava Yolları',
        children: [
          {
            id: 40,
            name: 'Türk Hava Yolları Uçak'
          }
        ]
      },
      {
        id: 55,
        name: 'Mercedes Benz Türk AŞ'
      }
    ]
  }
}
</script>

<style lang="scss"></style>
