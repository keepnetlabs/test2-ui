<template>
  <div class="notification-templates">
    <company-settings-header
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <new-notification-template
      v-if="newNotificationTemplateStatus"
      :selectedItem="selectedItem"
      :status="newNotificationTemplateStatus"
      @closeOverlay="toggleNewNotificationTemplate"
      @closeOverlayWithUpdate="closeNotificationTemplateWithUpdate"
    />
    <delete-notification-template-modal
      v-if="showDeleteNotificationTemplateModal"
      :selectedItem="selectedItem"
      :status="showDeleteNotificationTemplateModal"
      @handleDelete="handleDeleteNotificationTemplate"
      @closeDialog="toggleDeleteNotificationTemplate"
    />
    <div class="notification-templates__container">
      <data-table
        ref="refNotificationList"
        id="company-settings-notification-templates-data-table"
        :columns="tableOptions.columns"
        :countRow="5"
        :table="tableData"
        :empty="tableOptions.empty"
        :loading="loading"
        :filterable="true"
        :row-key="'name'"
        :is-downloadable="false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :refName="'notificationList'"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :select-event="tableOptions.selectEvent"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @handleAddNotificationTemplates="toggleNewNotificationTemplate"
        @onEmptyBtnClicked="toggleNewNotificationTemplate"
        @refreshAction="callForDatas"
      >
        <template #datatable-row-actions="{scope}">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click.native="handleEdit(scope.row)"
                :disabled="getDisabledStatusOfEdit(scope.row)"
                class="btn-hover mr-1"
                icon
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[0].name }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="getDisabledStatusOfDelete(scope.row)"
                @click.native="handleDelete(scope.row)"
                class="btn-hover"
                icon
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[1].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[1].name }}</span>
          </v-tooltip>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate'
import { deleteEmailTemplate, getCategories, searchEmailTemplate } from '@/api/company'
import labels from '@/model/constants/labels'
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
      categories: [],
      loading: false,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: labels.TemplateName,
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 280,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CATEGORYNAME,
            align: 'left',
            label: labels.Category,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: []
          },
          {
            property: PROPERTY_STORE.SUBJECT,
            align: 'left',
            label: labels.EmailSubject,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 230,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            label: labels.CreateTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            isEditable: true,
            filterableType: 'date'
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template'
        },
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
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
            action: 'handleDelete'
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      },

      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false,
      selectedItem: null,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    closeNotificationTemplateWithUpdate() {
      this.callForDatas()
      this.toggleNewNotificationTemplate()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.axiosPayload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForDatas()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForDatas()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    getDisabledStatusOfEdit(row) {
      return !row.isOwner
    },
    getDisabledStatusOfDelete(row) {
      return !row.isOwner
    },
    handleDelete(row) {
      this.selectedItem = row
      this.toggleDeleteNotificationTemplate()
    },
    handleDeleteNotificationTemplate(resourceId) {
      deleteEmailTemplate(resourceId).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          message: response.data.message,
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle'
        })
        this.toggleDeleteNotificationTemplate()
        this.callForDatas()
      })
    },
    toggleDeleteNotificationTemplate() {
      if (this.showDeleteNotificationTemplateModal) {
        this.selectedItem = null
      }
      this.showDeleteNotificationTemplateModal = !this.showDeleteNotificationTemplateModal
    },
    toggleNewNotificationTemplate() {
      if (this.newNotificationTemplateStatus) {
        this.selectedItem = null
      }
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    },

    callForSearchEmailTemplate() {
      return searchEmailTemplate(this.axiosPayload)
    },
    callForCategories() {
      return getCategories()
    },
    callForDatas() {
      this.loading = true
      Promise.all([this.callForCategories(), this.callForSearchEmailTemplate()])
        .then((response) => {
          const [categories, emailTemplates] = response
          const {
            data: { data: templateData }
          } = emailTemplates
          const {
            data: { data: categoriesData }
          } = categories

          this.tableData = templateData.results
          this.categories = categoriesData.map((category) => {
            return { text: category.name, value: category.resourceId }
          })
          this.$set(this.tableOptions.columns, 1, {
            ...this.tableOptions.columns[1],
            filterableItems: this.categories
          })
        })
        .finally(() => (this.loading = false))
    },
    handleEdit(row) {
      this.selectedItem = row
      this.toggleNewNotificationTemplate()
    }
  },
  created() {
    this.callForDatas()
  }
}
</script>

<style lang="scss"></style>
