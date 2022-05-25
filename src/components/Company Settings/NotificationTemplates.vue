<template>
  <div class="notification-templates">
    <company-settings-header
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <new-notification-template
      v-if="newNotificationTemplateStatus"
      ref="newNotificationTemplate"
      :edit-items-disabled="editItemsDisabled"
      :selectedItem="selectedItem"
      :isDuplicate="isDuplicate"
      :status="newNotificationTemplateStatus"
      @closeOverlay="toggleNewNotificationTemplate"
      @closeOverlayWithUpdate="closeNotificationTemplateWithUpdate"
    />
    <delete-notification-template-modal
      v-if="showDeleteNotificationTemplateModal"
      :selectedItem="selectedItem"
      :isDeleteButtonDisabled="isDeleteButtonDisabled"
      :status="showDeleteNotificationTemplateModal"
      @handleDelete="handleDeleteNotificationTemplate"
      @closeDialog="toggleDeleteNotificationTemplate"
    />
    <div class="notification-templates__container">
      <data-table
        v-if="getNotificationTemplatesSearchPermissions"
        ref="refNotificationList"
        id="company-settings-notification-templates-data-table"
        filterable
        options
        selectable
        is-server-side
        :columns="tableOptions.columns"
        :table="tableData"
        :empty="tableOptions.empty"
        :loading="loading"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        :addButton="tableOptions.addButton"
        :row-actions="tableOptions.rowActions"
        :select-event="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @downloadEvent="exportNotificationTemplate"
        @handleAddNotificationTemplates="toggleNewNotificationTemplate"
        @onEmptyBtnClicked="toggleNewNotificationTemplate"
        @refreshAction="callForDatas"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      >
        <!-- <template v-slot:datatable-custom-column="{ scope }">
          <div>
            <span>{{ scope.row.name }}</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" v-if="scope.row.isDefault" color="#1173C1"
                class="pl-2"
                  >mdi-star-circle</v-icon
                >
              </template>
              <span>{{
                `Default option for  “${scope.row.typeName}"  template type`
              }}</span>
            </v-tooltip>
          </div>
        </template> -->
        <template #datatable-row-actions="{ scope }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :id="`${tableOptions.rowActions[0].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                class="btn-hover mr-1"
                icon
                :disabled="getDisabledStatusOfAction(scope.row, 'UPDATE')"
                @click.native="handleEdit(scope.row)"
              >
                <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[0].name }}</span>
          </v-tooltip>
          <v-menu bottom left offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="btn-hover" icon v-on="on">
                <v-icon @click.native="selectedMenuIndex = scope.$index">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="v-cart-dropdown-list el-table__action-buttons scenarios__row-actions">
              <v-list-item
                :id="`${tableOptions.rowActions[1].id}-${scope.$index}`"
                class="sub-menu-el"
                :disabled="getDisabledStatusOfAction(scope.row, 'POST')"
              >
                <v-list-item-title @click="handleDuplicate(scope.row, true)">
                  <v-icon class="pr-3">{{ tableOptions.rowActions[1].icon }}</v-icon>
                  <span>{{ tableOptions.rowActions[1].name }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                :id="`${tableOptions.rowActions[2].id}-${scope.$index}`"
                class="sub-menu-el"
                :disabled="getDisabledStatusOfAction(scope.row, 'DELETE')"
              >
                <v-list-item-title @click="handleDelete(scope.row, true)">
                  <v-icon class="pr-3">{{ tableOptions.rowActions[2].icon }}</v-icon>
                  <span>{{ tableOptions.rowActions[2].name }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                class="btn-hover"
                icon
                :disabled="getDisabledStatusOfAction(scope.row, 'DELETE')"
                @click.native="handleDelete(scope.row)"
              >
                <v-icon>{{ tableOptions.rowActions[1].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[1].name }}</span>
          </v-tooltip> -->
          <!-- <v-menu bottom left offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="btn-hover" icon v-on="on">
                <v-icon @click.native="selectedMenuIndex = scope.$index"
                  >mdi-dots-vertical</v-icon
                >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfAction(scope.row, 'DELETE')"
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleDelete(scope.row)"
              >
                <v-list-item-title class="sub-menu-el__title">
                  <v-icon
                    class="
                      notification-templates__row-actions__overflow-menu__icon
                    "
                    >{{ tableOptions.rowActions[1].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[1].name }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfAction(scope.row, 'UPDATE')"
                :id="`${tableOptions.rowActions[2].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleMakeDefault(scope.row)"
              >
                <v-list-item-title @click="() => {}" class="sub-menu-el__title">
                  <v-icon
                    class="
                      notification-templates__row-actions__overflow-menu__icon
                    "
                    >{{ tableOptions.rowActions[2].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[2].name }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate'
import {
  deleteEmailTemplate,
  getCategories,
  searchEmailTemplate,
  exportEmailTemplate,
  getTemplateTypes
} from '@/api/company'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
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
      isDuplicate: false,
      categories: [],
      loading: false,
      tableData: [],
      editItemsDisabled: false,
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
            // type: "slot",
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
            filterableItems: [],
            filterableCustomFieldName: 'CategoryResourceId'
          },
          {
            property: PROPERTY_STORE.TYPENAME,
            align: 'left',
            label: labels.TemplateType,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'TypeResourceId'
          },
          {
            property: PROPERTY_STORE.SUBJECT,
            align: 'left',
            label: labels.EmailSubject,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: false,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: 'left',
            editable: false,
            label: 'Tags',
            fixed: false,
            sortable: true,
            show: true,
            type: 'smallBadge',
            width: 150,
            hasTooltip: true,
            filterableType: 'text',
            filterableCustomFieldName: PROPERTY_STORE.TAGS
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            label: labels.CreateTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'date'
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template',
          id: 'btn-add--notification-template',
          disabled: !this.$store.getters['permissions/getNotificationTemplatesCreatePermissions']
        },
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.NOTIFICATION_TEMPLATE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.NOTIFICATION_TEMPLATE,
        empty: {
          message: labels.EmptyNotificationTemplate,
          subMes: labels.EmptyNotificationTemplateSub,
          btn: 'New',
          id: 'btn-empty--notification-template',
          icon: 'mdi-plus',
          disabled: !this.$store.getters['permissions/getNotificationTemplatesCreatePermissions']
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            id: 'btn-edit--notification-template-row-actions',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getNotificationTemplatesUpdatePermissions']
          },
          {
            name: 'Duplicate',
            icon: 'mdi-eye',
            id: 'btn-duplicate--notification-template-row-actions',
            action: 'handleDuplicate',
            disabled: !this.$store.getters['permissions/getNotificationTemplatesCreatePermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            id: 'btn-delete--notification-template-row-actions',
            action: 'handleDelete',
            disabled: !this.$store.getters['permissions/getNotificationTemplatesDeletePermissions']
          }
          // {
          //   name: "Make Default",
          //   icon: "mdi-star-circle",
          //   id: "btn-make-default--notification-template-row-actions",
          //   action: "makeDefaultAction",
          //   disabled: !this.$store.getters['permissions/getNotificationTemplatesUpdatePermissions']
          // },
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      },
      isDeleteButtonDisabled: false,
      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false,
      selectedItem: null,
      axiosPayload: getDefaultAxiosPayload(),
      defaultAxiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getNotificationTemplatesSearchPermissions:
        'permissions/getNotificationTemplatesSearchPermissions'
    })
  },
  methods: {
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.callForDatas()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForDatas()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForDatas()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForDatas()
    },
    closeNotificationTemplateWithUpdate() {
      this.callForDatas()
      this.toggleNewNotificationTemplate()
    },
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForDatas()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.callForDatas()
    },
    exportNotificationTemplate(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportEmailTemplate(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Notification Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDisabledStatusOfAction(row) {
      return !row.isOwner
    },
    handleDelete(row) {
      this.selectedItem = row
      this.toggleDeleteNotificationTemplate()
    },
    handleDuplicate(row) {
      this.selectedItem = row
      this.isDuplicate = true
      this.toggleNewNotificationTemplate()
    },
    handleMakeDefault(selectedRow) {},
    handleDeleteNotificationTemplate(resourceId) {
      this.isDeleteButtonDisabled = true
      deleteEmailTemplate(resourceId)
        .then(() => {
          this.$refs.refNotificationList.unSelectRow(this.selectedItem)
          this.toggleDeleteNotificationTemplate()
          this.callForDatas()
        })
        .finally(() => (this.isDeleteButtonDisabled = false))
    },
    toggleDeleteNotificationTemplate() {
      if (this.showDeleteNotificationTemplateModal) {
        this.selectedItem = null
      }
      this.showDeleteNotificationTemplateModal = !this.showDeleteNotificationTemplateModal
    },
    checkIfCanCloseNotificationTemplateModal() {
      if (this.$refs.newNotificationTemplate) this.$refs.newNotificationTemplate.closeOverlay()
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newNotificationTemplate) {
        if (this.$refs.newNotificationTemplate.$refs.refEmailTemplate) {
          this.$refs.newNotificationTemplate.$refs.refEmailTemplate.toggleShowGrapesModal()
        }
      }
    },
    toggleNewNotificationTemplate() {
      if (this.newNotificationTemplateStatus) {
        this.selectedItem = null
        this.editItemsDisabled = false
      }
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    },

    callForSearchEmailTemplate() {
      return searchEmailTemplate(this.axiosPayload)
    },
    callForCategories() {
      return getCategories()
    },
    callForTemplateTypes() {
      return getTemplateTypes()
    },
    callForDatas() {
      this.loading = true
      Promise.all([
        this.callForCategories(),
        this.callForSearchEmailTemplate(),
        this.callForTemplateTypes()
      ])
        .then((response) => {
          const [categories, emailTemplates, templateTypes] = response
          const {
            data: { data: templateData }
          } = emailTemplates
          const {
            data: { data: categoriesData }
          } = categories
          const {
            data: { data: templateTypesData }
          } = templateTypes

          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = templateData
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = templateData.results
          // this.tableData = templateData.results.map((item) => ({
          //   ...item,
          //   isDefault: true,
          // }));
          this.categories = categoriesData.map((category) => {
            return { text: category.name, value: category.resourceId }
          })
          this.templateTypeItems = templateTypesData.map((type) => {
            return { text: type.name, value: type.resourceId }
          })
          this.$set(this.tableOptions.columns, 1, {
            ...this.tableOptions.columns[1],
            filterableItems: this.categories
          })
          this.$set(this.tableOptions.columns, 2, {
            ...this.tableOptions.columns[2],
            filterableItems: this.templateTypeItems
          })
          this.$nextTick(() => {
            if (this.$refs.refNotificationList) {
              this.$refs.refNotificationList.columnKey = `column-key${Math.random()
                .toString()
                .substring(0, 5)}`
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleEdit(row) {
      if (!row.isOwner) {
        this.editItemsDisabled = true
      }
      this.selectedItem = row
      this.isDuplicate = false
      this.toggleNewNotificationTemplate()
    }
  },
  created() {
    this.callForDatas()
  }
}
</script>

<style lang="scss" scoped>
.notification-templates__row-actions__overflow-menu__icon {
  margin-right: 16px;
}
.sub-menu-el__title {
  display: flex;
  align-items: center;
}
</style>
