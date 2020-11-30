<template>
  <div class="mail-configuration">
    <app-modal
      :status="status"
      v-if="status"
      @closeOverlay="status = false"
      :icon-name="'mdi-book-search'"
      :title="getTitle"
      className="mail-configuration__modal"
    >
      <template v-slot:overlay-body>
        <v-form ref="mailConfiguration">
          <app-modal-body-header
            :title="editData ? 'Edit O365 Mail Configuration' : 'New O365 Mail Configuration'"
            sub-title="Select filters and date options to start an investigation"
          />
          <form-group title="Name" has-hint>
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
          </form-group>
          <form-group title="Application (client) ID" has-hint>
            <v-text-field
              placeholder="Enter Application ID"
              outlined
              dense
              v-model.trim="formValues.applicationId"
              :rules="[(v) => validations.required(v, 'Required')]"
              hint="*Required"
              persistent-hint
              id="appClientId"
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Application Secret" has-hint>
            <v-text-field
              placeholder="Enter Application Secret"
              outlined
              dense
              v-model.trim="formValues.applicationSecret"
              hint="*Required"
              persistent-hint
              :rules="[(v) => validations.required(v, 'Required')]"
              id="applicationSecret"
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Directory (tenant) ID" has-hint>
            <v-text-field
              placeholder="Enter Directory ID"
              outlined
              dense
              v-model.trim="formValues.directoryId"
              :rules="[(v) => validations.required(v, 'Required')]"
              hint="*Required"
              persistent-hint
              id="directoryId"
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Test Email Address" has-hint>
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
          </form-group>

          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content class="test-connection-wrapper">
              <TestConnection
                :values="formValues"
                :isValidate="isValidate"
                :isEdit="editData"
                ref="testConnection"
                @testConnectionValues="testConnectionValues"
              />
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
            >{{ labels.Cancel }}</v-btn
          >
        </div>
        <div>
          <v-btn
            class="playbook-rule-form__button white--text"
            rounded
            color="#2196f3"
            @click="submit"
            :disabled="saveButtonDisabled"
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
      v-if="false"
    >
      <template v-slot:overlay-body>
        <v-form ref="gsuiteConfiguration">
          <app-modal-body-header
            title="New GSuite Mail Configuration"
            sub-title="Select filters and date options to start an investigation"
          />
          <form-group title="Name" has-hint>
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
          </form-group>
          <form-group title="Credential JSON" has-hint>
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
          </form-group>
          <form-group title="Email Address" has-hint>
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
          </form-group>
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
      v-if="deleteDialog"
      icon="mdi-delete"
      title="Delete Mail Configuration?"
      subtitle="The O365 mail configuration will  deleted permanently"
    >
      <template v-slot:app-dialog-body>
        {{ deleteDialogName }} will be deleted and removed from all integrations.
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer @handleClose="closeDeleteDialog" @handleConfirm="handleDeleteDialog" />
      </template>
    </app-dialog>
    <div class="mail-configuration__content">
      <datatable
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.iEmpty"
        :filterable="true"
        :options="true"
        :pageSizes="tableOptions.pageSizes"
        :refName="'peopleTable'"
        id="mail-configurations-data-table"
        :rowActions="tableOptions.rowActions"
        :selectEvent="tableOptions.selectEvent"
        :setClassName="setCellClassName"
        @syncUser="handleSyncUser"
        @delete="handleDelete"
        ref="refPeopleTable"
        @editTargetUsers="handleEditTargetUsers"
        @onEmptyBtnClicked="status = true"
        :is-downloadable="true"
        @downloadEvent="exportMailConfigurationList"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
      >
        <template v-slot:addUsers>
          <v-menu :min-width="128" :offset-y="true" left :nudge-right="5">
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
              <v-list-item :key="item" @click="handleAddUsers(item)" v-for="item in addUsersItems">
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
        <template v-slot:empty-table-inline>
          <div class="mail-configuration__no-data">
            <p class="mail-configuration__no-data__header">
              No mail configuration has been created, yet
            </p>
            <p class="mail-configuration__no-data__body">Create now!</p>
            <div class="mail-configuration__no-data__buttons">
              <div
                v-if="false"
                class="mail-configuration__no-data__buttons--button"
                @click="statusGsuite = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon
                ><img alt="outlook" src="../../assets/img/gsuite-logo.png" />
              </div>
              <div class="mail-configuration__no-data__buttons--button" @click="status = true">
                <v-icon color="#2196f3">mdi-plus-circle</v-icon>
                <img alt="outlook" src="../../assets/img/office-365-logo.png" />
              </div>
            </div>
          </div>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import {COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE} from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import AppDialog from '../AppDialog'
import {
  createO365,
  deleteO365,
  exportMailConfiguration,
  getMailConfigurationList,
  updateO365
} from '@/api/mailConfiguration'
import {mail, required} from '@/utils/validations'
import TestConnection from './TestConnection'
import FormGroup from '@/components/SmallComponents/FormGroup'
import {scrollToComponent} from '@/utils/functions'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'MailConfiguration',
  components: {
    AppDialogFooter,
    Datatable,
    AppModal,
    AppDialog,
    TestConnection,
    AppModalBodyHeader,
    FormGroup
  },
  computed: {
    getTitle() {
      return this.editData ? 'Edit O365 Mail Configuration' : 'Create O365 Mail Configuration'
    }
  },
  data: () => ({
    delaySaveFunction: false,
    saveButtonDisabled: false,
    isTestConnectionWorkedBefore: false,
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
      isColumnFilterActive: false,
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
          property: 'platform',
          align: 'left',
          editable: false,
          label: 'Platform',
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
          property: 'statusName',
          align: 'center',
          editable: false,
          label: 'Status',
          sortable: true,
          show: true,
          type: 'detected',
          width: 150
        },
        {
          property: PROPERTY_STORE.CREATETIME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATETIME),
          sortable: true,
          show: true,
          fixed: false,
          type: 'text',
          width: 180
        }
      ],
      defaultColumns: [
        // Should be defined to show the table
      ],
      pageSizes: [5, 10, 25],
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: false,
        download: false
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
    addUsersItems: ['O365'],
    validations: {
      required,
      mail
    }
  }),
  methods: {
    testConnectionValues(isSuccess, isSave) {
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        this.saveButtonDisabled = false
        if (isSave && !this.delaySaveFunction) {
          this.$nextTick(() => {
            this.submit()
          })
        }
      }
    },
    isValidate() {
      return this.$refs.mailConfiguration && this.$refs.mailConfiguration.validate()
    },
    closeDeleteDialog() {
      this.deleteDialog = false
      this.deleteDialogName = null
      this.deleteDialogId = null
    },
    handleDeleteDialog() {
      deleteO365(this.deleteDialogId).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'O365 mail configuration has been deleted'
        })
        this.closeDeleteDialog()
        this.getTableData()
      })
    },
    exportMailConfigurationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: PROPERTY_STORE.CREATETIME,
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportMailConfiguration(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `mail-configuration.${exportType.toLocaleLowerCase()}`
          link.click()
        })
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
      let payload = {
        pageNumber: 1,
        pageSize: 100,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
      getMailConfigurationList(payload)
        .then((response) => {
          this.tableData = response.data.data.results
          //this.tableData = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDelete(item) {
      this.deleteDialogName = item.name
      this.deleteDialogId = item.resourceId
      this.deleteDialog = true
    },
    submit() {
      if (this.$refs.mailConfiguration.validate() && this.isTestConnectionWorkedBefore) {
        if (this.editData) {
          let editData = this.formValues
          updateO365(editData, this.editData.resourceId).then(() => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'O365 mail configuration has been updated'
            })
            this.status = false
            this.editData = null
            this.getTableData()
          })
        } else {
          createO365(this.formValues).then(() => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'O365 mail configuration has been created'
            })
            this.status = false
            this.editData = null
            this.getTableData()
          })
        }
      } else if (this.$refs.mailConfiguration.validate() && !this.isTestConnectionWorkedBefore) {
        this.saveButtonDisabled = true
        this.$refs.testConnection.testConnection(true)
        setTimeout(() => {
          let el = this.$el.querySelector('.test-connection__testing-content__item')
          scrollToComponent(el)
        }, 50)
      } else {
        const el = this.$refs.mailConfiguration.$el
        scrollToComponent(el)
      }
    },
    closeImportModal() {
      this.isWantToImportFile = false
    },
    handleAddUsers(item) {
      switch (item) {
        case this.addUsersItems[0]:
          this.formValues = {
            name: null,
            applicationId: null,
            applicationSecret: null,
            directoryId: null,
            email: null
          }
          this.editData = null
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
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
      this.isTestConnectionWorkedBefore = false
      this.saveButtonDisabled = false
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
      this.tableOptions.isColumnFilterActive = true
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

      this.tableOptions.isColumnFilterActive =
        this.requestBody.filter.FilterGroups[0].FilterItems.length >= 1
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
  min-height: 80vh;

  &__no-data {
    &__header {
      font-size: 24px !important;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29 !important;
      letter-spacing: normal !important;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
    }
    &__body {
      font-size: 14px !important;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal !important;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
    }
    &__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      &--button {
        border-radius: 18px;
        box-shadow: 0 2px 5px 0 rgba(33, 150, 243, 0.3), 0 0 3px 0 rgba(0, 0, 0, 0.1);
        border: solid 1px #2196f3;
        background-color: #ffffff;
        align-items: center;
        justify-content: center;
        display: flex;
        padding: 6px 16px;
        cursor: pointer;
        &:last-child {
          margin-left: 16px;
        }
        img {
          margin-left: 8px;
          height: 24px;
        }
      }
    }
  }
  .add-user-overlay {
    max-width: 774px;
    &__list-item {
      margin-bottom: 24px;
    }
  }
  .test-connection-wrapper {
    max-width: 774px !important;
  }
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
