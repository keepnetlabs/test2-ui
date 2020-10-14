<template>
  <div class="mail-configuration">
    <app-modal
      :status="status"
      @closeOverlay="status = false"
      :icon-name="'mdi-book-search'"
      :title="getTitle"
      className="mail-configuration__modal"
    >
      <template v-slot:overlay-body>
        <v-form ref="mailConfiguration">
          <v-list-item class="add-user-overlay__list-item mt-8">
            <v-list-item-content>
              <v-list-item-title class="add-user-overlay__main-title">
                {{ editData ? 'Edit O365 Mail Configuration' : 'New O365 Mail Configuration' }}
              </v-list-item-title>
              <v-list-item-subtitle class="add-user-overlay__main-sub-title"
                >Select filters and date options to start an investigation
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item mt-6">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="name">Name</label>
              <v-text-field
                placeholder="O365 Mail Configuration"
                outlined
                dense
                v-model.trim="formValues.name"
                :rules="[(v) => validations.required(v, 'Required')]"
                hint="*Required"
                persistent-hint
                id="name"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="appClientId"
                >Application (client) ID</label
              >
              <v-text-field
                placeholder="Enter Application ID"
                outlined
                dense
                v-model.trim="formValues.applicationId"
                :rules="[(v) => validations.required(v, 'Required')]"
                hint="*Required"
                persistent-hint
                id="appClientId"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item" style="margin-bottom: 14px;">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="applicationSecret"
                >Application Secret</label
              >
              <v-text-field
                placeholder="Enter Application Secret"
                outlined
                dense
                v-model.trim="formValues.applicationSecret"
                hint="*Required"
                persistent-hint
                :rules="[(v) => validations.required(v, 'Required')]"
                id="applicationSecret"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="directoryId">Directory (tenant) ID</label>
              <v-text-field
                placeholder="Enter Directory ID"
                outlined
                dense
                v-model.trim="formValues.directoryId"
                :rules="[(v) => validations.required(v, 'Required')]"
                hint="*Required"
                persistent-hint
                id="directoryId"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="emailAddress">Test Email Address</label>
              <v-text-field
                placeholder="user@company.com"
                outlined
                dense
                hint="*Required"
                persistent-hint
                v-model.trim="formValues.email"
                :rules="[
                  (v) => validations.required(v, 'Required'),
                  (v) => validations.mail(v, 'Invalid  email address')
                ]"
                id="emailAddress"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content>
              <TestConnection />
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            class="playbook-rule-form__button"
            outlined
            rounded
            color="error"
            @click="cancelO365"
            >CANCEL</v-btn
          >
        </div>
        <div>
          <v-btn
            class="playbook-rule-form__button white--text"
            rounded
            color="#2196f3"
            @click="submit"
          >
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-modal
      :status="statusGsuite"
      @closeOverlay="statusGsuite = false"
      :icon-name="'mdi-book-search'"
      :title="'Create GSuite Mail Configuration'"
      className="mail-configuration__modal"
    >
      <template v-slot:overlay-body>
        <v-form ref="gsuiteConfiguration">
          <v-list-item class="add-user-overlay__list-item mt-8">
            <v-list-item-content>
              <v-list-item-title class="add-user-overlay__main-title">
                New GSuite Mail Configuration
              </v-list-item-title>
              <v-list-item-subtitle class="add-user-overlay__main-sub-title"
                >Select filters and date options to start an investigation
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item mt-6">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="name">Name</label>
              <v-text-field
                placeholder="O365 Mail Configuration"
                outlined
                dense
                v-model.trim="gsuite.name"
                :rules="[(v) => validations.required(v, 'Required')]"
                hint="*Required"
                persistent-hint
                id="name"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item mt-6">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="json">Credential JSON</label>
              <v-text-field
                placeholder="Enter Credential JSON"
                outlined
                dense
                v-model.trim="gsuite.json"
                :rules="[(v) => validations.required(v, 'Required')]"
                hint="*Required"
                persistent-hint
                id="json"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="add-user-overlay__list-item mt-6">
            <v-list-item-content>
              <label class="add-user-overlay__label" for="email">Email Address</label>
              <v-text-field
                placeholder="user@company.com"
                outlined
                dense
                v-model.trim="gsuite.email"
                :rules="[
                  (v) => validations.required(v, 'Required'),
                  (v) => validations.mail(v, 'Invalid  email address')
                ]"
                hint="*Required"
                persistent-hint
                id="email"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            class="playbook-rule-form__button"
            outlined
            rounded
            color="error"
            @click="statusGsuite = false"
            >CANCEL</v-btn
          >
        </div>
        <div>
          <v-btn class="playbook-rule-form__button white--text" rounded color="#2196f3">
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-dialog
      :status="deleteDialog"
      icon="mdi-delete"
      title="Delete Mail Configuration?"
      subtitle="The O365 mail configuration will  deleted permanently"
    >
      <template v-slot:app-dialog-body>
        {{ deleteDialogName }} will be deleted and removed from all integrations.
      </template>
      <template v-slot:app-dialog-footer>
        <div class="delete-user__footer">
          <v-btn @click="closeDeleteDialog" color="#f56c6c" class="delete-user__footer-button" text
            >CANCEL</v-btn
          >
          <v-btn
            @click="handleDeleteDialog"
            color="#2196f3"
            class="delete-user__footer-button"
            style="padding: 0;"
            text
            >DELETE</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <div class="mail-configuration__content">
      <DatatableLoading :loading="loading">
        <template v-slot:skeleton-content>
          <datatable
            :table="tableData"
            :addButton="tableOptions.addButton"
            :columns="tableOptions.columns"
            :countRow="5"
            :empty="tableOptions.iEmpty"
            :filterable="true"
            :options="true"
            :pageSizes="tableOptions.pageSizes"
            :refName="'peopleTable'"
            :rowActions="tableOptions.rowActions"
            :selectEvent="tableOptions.selectEvent"
            :setClassName="setCellClassName"
            @syncUser="handleSyncUser"
            @delete="handleDelete"
            ref="refPeopleTable"
            @editTargetUsers="handleEditTargetUsers"
            @onEmptyBtnClicked="status = true"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
          >
            <template v-slot:addUsers>
              <v-menu :offset-y="true" bottom left>
                <template v-slot:activator="{ on: menu }">
                  <v-tooltip bottom opacity="1">
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn class="btn-add mr-1" icon v-on="{ ...tooltip, ...menu }">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span class="tooltip-span">{{ 'Add Mail Configuration' }}</span>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item
                    :key="item"
                    @click="handleAddUsers(item)"
                    v-for="item in addUsersItems"
                  >
                    <v-list-item-title class="add-users__title">{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-slot:settings-popup-body>
              <div class="edit-fields" @click="handleEditFieldsClick">
                EDIT FIELDS
              </div>
            </template>
          </datatable>
        </template>
      </DatatableLoading>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import {
  deleteTargetUser,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers
} from '../../api/targetUsers'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import DatatableLoading from '../SkeletonLoading/DatatableLoading'
import AppModal from '../AppModal'
import AppDialog from '../AppDialog'
import {
  createO365,
  deleteO365,
  getMailConfigurationList,
  updateO365
} from '../../api/mailConfiguration'
import { mail, required } from '../../utils/validations'
import TestConnection from './TestConnection'
export default {
  name: 'MailConfiguration',
  components: {
    Datatable,
    DatatableLoading,
    AppModal,
    AppDialog,
    TestConnection
  },
  computed: {
    getTitle() {
      return this.editData ? 'Edit O365 Mail Configuration' : 'Create O365 Mail Configuration'
    }
  },
  data: () => ({
    gsuite: {
      name: null,
      json: null,
      email: null
    },
    statusGsuite: null,
    deleteDialogId: null,
    deleteDialog: null,
    deleteDialogName: null,
    editData: null,
    formValues: {
      name: null,
      applicationId: null,
      applicationSecret: null,
      directoryId: null,
      email: null
    },
    status: false,
    isWantToImportFile: false,
    tableData: [],
    loading: true,
    isWantToShowDeleteUserModal: false,
    selectedSyncIndex: null,
    isWantToShowAddUsersManuallyModal: false,
    selectedRow: null,
    customFields: [],
    isWantToShowAddUsersModal: false,
    showPopupModal: false,
    isWantToShowImportUsersFromFileModal: false,
    isWantToShowCustomFieldsModal: false,
    items: [
      { title: 'Click Me1' },
      { title: 'Click Me2' },
      { title: 'Click Me3' },
      { title: 'Click Me4' }
    ],
    tableOptions: {
      lastColumns: [],
      columns: [
        {
          property: 'name',
          align: 'left',
          editable: false,
          label: 'Name',
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          showHeaderTooltip: true
        },
        {
          property: 'applicationId',
          align: 'left',
          editable: false,
          label: 'Application ID',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: 'applicationSecret',
          align: 'left',
          editable: false,
          label: 'Application Secret',
          sortable: true,
          show: true,
          type: 'text',
          width: 275
        },
        {
          property: 'directoryId',
          align: 'left',
          editable: false,
          label: 'Directory ID',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: PROPERTY_STORE.EMAIL,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.EMAIL),
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: 'status',
          align: 'left',
          editable: false,
          label: 'Status',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        }
      ],
      defaultColumns: [
        // Should be defined to show the table
      ],
      pageSizes: [5, 10, 25, 50, 100],
      selectEvent: {
        clipboard: true,
        edit: true,
        delete: true,
        download: true
      },
      iEmpty: {
        message: 'No mail configuration has been created, yet',
        btn: 'O365',
        icon: 'mdi-microsoft-office',
        subMes: 'Create now!'
      },
      addButton: {
        show: true,
        action: 'addButton'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'editTargetUsers',
          isNotShow: true
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'delete'
        }
      ]
    },
    addUsersItems: ['GSuite', 'O365'],
    validations: {
      required,
      mail
    }
  }),
  methods: {
    closeDeleteDialog() {
      this.deleteDialog = false
      this.deleteDialogName = null
      this.deleteDialogId = null
    },
    handleDeleteDialog() {
      deleteO365(this.deleteDialogId).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'O365 Mail Configuration deleted successfully'
        })
        this.closeDeleteDialog()
        this.getTableData()
      })
    },
    cancelO365() {
      this.status = false
      this.editData = null
      this.formValues = {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null
      }
    },
    getTableData() {
      this.loading = true
      getMailConfigurationList()
        .then((response) => {
          this.tableData = response.data.data
          //this.tableData = []
        })
        .finally((response) => {
          this.loading = false
        })
    },
    handleDelete(item) {
      this.deleteDialogName = item.name
      this.deleteDialogId = item.resourceId
      this.deleteDialog = true
    },
    submit() {
      if (this.$refs.mailConfiguration.validate()) {
        if (this.editData) {
          updateO365(this.formValues, this.editData.resourceId)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                message: 'O365 Mail Configuration updated successfully'
              })
              this.status = false
              this.getTableData()
            })
            .finally((response) => {})
        } else {
          createO365(this.formValues)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                message: 'O365 Mail Configuration created successfully'
              })
              this.status = false
              this.getTableData()
            })
            .finally((response) => {})
        }
      }
    },
    closeImportModal() {
      this.isWantToImportFile = false
    },
    handleAddUsers(item) {
      switch (item) {
        case this.addUsersItems[0]:
          this.statusGsuite = true
          break
        case this.addUsersItems[1]:
          this.status = true
          break
        default:
          break
      }
    },
    closeCustomFieldsModalWithUpdate() {
      this.isWantToShowCustomFieldsModal = false
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    closeAddUserModalWithUpdate() {
      this.isWantToShowAddUsersModal = false
      this.callForTargetUsers()
    },
    handleEditTargetUsers(selectedRow) {
      this.editData = selectedRow
      this.formValues = {
        name: selectedRow.name,
        applicationId: selectedRow.applicationId,
        applicationSecret: selectedRow.applicationSecret,
        directoryId: selectedRow.directoryId,
        email: selectedRow.email
      }
      this.status = true
    },
    handleEditFieldsClick() {
      this.isWantToShowCustomFieldsModal = true
    },
    setCellClassName(obj) {
      if (obj.rowIndex === this.selectedSyncIndex && obj.columnIndex === 8) {
        return 'clock-wise'
      }
    },
    columnFilterChanged(filter) {
      let items = []
      let requestBody = this.requestBody.filter.FilterGroups[0].FilterItems
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

      this.requestBody.filter.FilterGroups[0].FilterItems = requestBody
      this.callForListSystemUsers()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.requestBody.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.requestBody.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForListSystemUsers()
    },
    handleSyncUser(scope) {
      this.selectedSyncIndex = scope.$index
      this.tableOptions.rowActions = [
        {
          name: 'Sync User',
          icon: 'mdi-sync',
          action: 'syncUser'
        }
      ]
      setTimeout(() => {
        this.tableOptions.rowActions = [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Add to a group',
            icon: 'mdi-account-multiple-plus',
            action: 'addToGroup'
          },
          {
            name: 'Create a group with user',
            icon: 'mdi-account-multiple',
            action: 'createGroupWithUser'
          },
          {
            name: 'Download',
            icon: 'mdi-download',
            action: 'download',
            subElements: ['PDF', 'CSV', 'XLS']
          },
          {
            name: 'Sync User',
            icon: 'mdi-sync',
            action: 'syncUser'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete'
          }
        ]
        this.selectedSyncIndex = null
      }, 5000)
    }
  },
  created() {},
  mounted() {
    this.getTableData()
  }
}
</script>

<style lang="scss">
.mail-configuration {
  padding: 11px 16px 16px 16px;
  &__modal {
    padding: 0 6rem;
  }
  &__content {
    background: white;
    box-shadow: 0 10px 15px -5px hsla(0, 0%, 80.4%, 0.5) !important;
    padding: 24px 24px 0 24px !important;
    border-radius: 20px !important;
  }
  .v-skeleton-loader {
    border-radius: 0 !important;
  }
  .add-users__title {
    font-size: 14px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .edit-fields {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    margin-top: 10px;
    cursor: pointer;
    color: #2196f3;
  }
  .btn-add {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
    background-color: #2196f3;
    color: white;

    .v-icon {
      font-size: 18px !important;
      color: white;
    }
  }
}
.clock-wise {
  .cell {
    * {
      visibility: visible !important;
    }
  }
  i {
    animation: antiClockwiseSpin 1s infinite ease-in;
    animation-delay: 0s;
    color: #2196f3 !important;
  }
}
@keyframes antiClockwiseSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
