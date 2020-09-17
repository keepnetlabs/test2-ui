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
        :empty="tableOptions.empty"
        :filterable="true"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :refName="'notificationList'"
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
import { LABEL_STORE } from '@/model/constants/commonConstants'
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
        columns: [],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template'
        },
        pageSizes: [5, 10, 25, 50, 100],
        empty: {
          message: LABEL_STORE.NO_NOTIFICATION_TEMPLATE_DEFINED,
          subMes: 'Create a new user directory integration',
          btn: 'Create Integration',
          icon: 'mdi-plus'
        }
      },
      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false
    }
  },
  methods: {
    handleAddNotificationTemplates() {}
  }
}
</script>

<style lang="scss"></style>
