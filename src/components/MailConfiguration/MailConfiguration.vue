<template>
  <div class="mail-configuration">
    <app-modal
      :status="status"
      v-if="status"
      @closeOverlay="status = false"
      :icon-name="'mdi-book-search'"
      :title="getTitle"
      className="mail-configuration__modal"
      ref="mail-configuration__modal"
      title-id="text--create-o365-mail-configuration-modal-title"
    >
      <template v-slot:overlay-body>
        <v-form ref="mailConfiguration">
          <app-modal-body-header
            :title="editData ? 'Edit O365 Mail Configuration' : 'New O365 Mail Configuration'"
            sub-title="Select filters and date options to start an investigation"
          />
          <form-group title="Name" has-hint>
            <v-text-field
              placeholder="Enter name"
              id="input--mail-configuration-name"
              outlined
              dense
              v-model.trim="formValues.name"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
              ]"
              hint="*Required"
              persistent-hint
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Application (client) ID" has-hint>
            <v-text-field
              placeholder="Enter Application ID"
              id="input--mail-configuration-application-id"
              outlined
              dense
              v-model.trim="formValues.applicationId"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) =>
                  validations.maxLength(v, 64, labels.getMaxLengthMessage('Application ID', 64))
              ]"
              hint="*Required"
              persistent-hint
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Application Secret" has-hint>
            <v-text-field
              placeholder="Enter an application secret"
              id="input--mail-configuration-application-secret"
              outlined
              dense
              v-model.trim="formValues.applicationSecret"
              hint="*Required"
              persistent-hint
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) =>
                  validations.maxLength(v, 64, labels.getMaxLengthMessage('Application secret', 64))
              ]"
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Directory (tenant) ID" has-hint>
            <v-text-field
              placeholder="Enter a directory ID"
              id="input--mail-configuration-directory-id"
              outlined
              dense
              v-model.trim="formValues.directoryId"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Directory ID', 64))
              ]"
              hint="*Required"
              persistent-hint
              autocomplete="disabled"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Test Email Address" has-hint>
            <v-text-field
              placeholder="Enter an email address"
              id="input--mail-configuration-test-email-address"
              outlined
              dense
              hint="*Required"
              persistent-hint
              v-model.trim="formValues.email"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.mail(v, labels.InvalidEmailAddress),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email address', 64))
              ]"
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
                @loading="saveButtonDisabled = false"
              />
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            id="btn-cancel--mail-configurations-modal"
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
            id="btn-save--mail-configurations-modal"
            class="playbook-rule-form__button white--text"
            rounded
            color="#2196f3"
            @click="submit"
            :disabled="saveButtonDisabled"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-modal
      :status="ewsStatus"
      v-if="ewsStatus"
      @closeOverlay="ewsStatus = false"
      :icon-name="'mdi-book-search'"
      :title="this.ewsEditData ? 'Edit EWS Configuration' : 'Create EWS Mail Configuration'"
      className="mail-configuration__modal"
      ref="ews-configuration__modal"
      title-id="text--create-ews-mail-configuration-modal-title"
    >
      <template v-slot:overlay-body>
        <v-form ref="ewsMailConfiguration">
          <app-modal-body-header
            :title="ewsEditData ? 'Edit EWS Configuration' : 'Create EWS Mail Configuration'"
            sub-title="Select filters and date options to start an investigation"
          />
          <form-group title="Name" has-hint>
            <v-text-field
              placeholder="Enter name"
              id="input--ews-configuration-name"
              outlined
              dense
              v-model.trim="ewsFormValues.Name"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
              ]"
              hint="*Required"
              persistent-hint
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Service URL" has-hint>
            <InputUrl
              v-model="ewsFormValues.ServiceUrl"
              :required="true"
              :persistent-hint="true"
              :hint="'*Required'"
              id="input--ews-url"
            />
          </form-group>
          <form-group title="Exchange Version">
            <k-select
              :items="exchangeVersions"
              custom-menu-class="menu--ews-exchange-version"
              placeholder="Select Exchange Version"
              dense
              deletable-chips
              autocomplete="off"
              small-chips
              outlined
              :no-data-text="'No Exchange Version'"
              v-model.trim="ewsFormValues.ExchangeVersionLookupResourceId"
              item-value="resourceId"
              item-text="name"
              required
              :rules="[(v) => validations.required(v, labels.Required)]"
              class="pop-up-card__invite-member"
              :persistent-hint="true"
              :hint="'*Required'"
            ></k-select>
          </form-group>
          <form-group title="Account Type" has-hint>
            <v-radio-group
              v-model="ewsFormValues.AccountType"
              id="input--ews-account-type"
              :mandatory="true"
              row
            >
              <v-radio
                id="input--ews-impersonation"
                color="primary"
                label="Impersonation"
                :value="1"
              ></v-radio>
              <v-radio
                id="input--delegation"
                color="primary"
                label="Delegation"
                :value="2"
              ></v-radio>
            </v-radio-group>
          </form-group>
          <form-group title="Username" has-hint>
            <v-text-field
              placeholder="Enter a username"
              id="input--ews-username"
              outlined
              dense
              v-model.trim="ewsFormValues.Username"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Username', 64))
              ]"
              hint="*Required"
              persistent-hint
              autocomplete="off"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Password" has-hint>
            <v-text-field
              placeholder="Enter a password"
              id="input--ews-password"
              outlined
              dense
              v-model.trim="ewsFormValues.Password"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Password', 64))
              ]"
              hint="*Required"
              persistent-hint
              autocomplete="off"
              height="40"
              type="password"
            ></v-text-field>
          </form-group>
          <form-group title="Test Email Address" has-hint>
            <v-text-field
              placeholder="Enter an email address"
              id="input--ews-test-email-address"
              outlined
              dense
              hint="*Required"
              persistent-hint
              v-model.trim="ewsFormValues.Email"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.mail(v, labels.InvalidEmailAddress),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Email address', 64))
              ]"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="X-Anchor Mail Box Header" has-hint>
            <v-checkbox
              v-model="ewsFormValues.XAnchorMailBoxHeader"
              color="#2196f3"
              class="mt-1"
              label="X-Anchor Mail Box Header"
            />
          </form-group>
          <form-group title="Target Groups" has-hint>
            <div class="ews-target-groups-select__radio-group">
              <v-radio-group
                v-model="ewsFormValues.IsAllTargetGroupsSelected"
                id="input--ews-target-group-type"
                :mandatory="false"
                @change="handleGroupTypeChange"
                row
              >
                <v-radio
                  id="input--ews-all-users"
                  :value="true"
                  label="All Groups"
                  color="#2196f3"
                ></v-radio>
                <v-radio
                  id="input--ews-user-groups"
                  :value="false"
                  label="Specific User Groups"
                  color="#2196f3"
                ></v-radio>
              </v-radio-group>
            </div>
            <k-select
              :items="targetGroupsList"
              custom-menu-class="menu--ews-target-users"
              placeholder="Select Target Groups"
              multiple
              dense
              deletable-chips
              autocomplete="off"
              :disabled="ewsFormValues.IsAllTargetGroupsSelected"
              small-chips
              outlined
              :no-data-text="'No Target Groups'"
              v-model.trim="ewsFormValues.TargetGroupResourceIdList"
              item-text="name"
              item-value="resourceId"
              class="pop-up-card__invite-member"
            ></k-select>
          </form-group>

          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content class="test-connection-wrapper">
              <TestConnectionEWS
                :values="ewsFormValues"
                :isValidate="isValidate"
                :isEdit="ewsEditData"
                ref="testConnectionEWS"
                @testConnectionValues="testConnectionValues"
                @loading="saveButtonDisabled = false"
              />
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            id="btn-cancel--ews-modal"
            class="playbook-rule-form__button"
            outlined
            rounded
            color="error"
            @click="cancelEWS"
            >{{ labels.Cancel }}</v-btn
          >
        </div>
        <div>
          <v-btn
            id="btn-save--ews-modal"
            class="playbook-rule-form__button white--text"
            rounded
            color="#2196f3"
            @click="submitEWS"
            :disabled="saveButtonDisabled"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-modal
      className="mail-configuration__modal"
      title-id="text--create-gsuite-mail-configuration-modal-title"
      icon-name="mdi-book-search-outline"
      :status="statusGoogleWorkSpace"
      :title="getGoogleWorkSpaceTitle"
      @closeOverlay="statusGoogleWorkSpace = false"
    >
      <template v-slot:overlay-body>
        <v-form ref="googleWorkSpaceConfigurationForm">
          <app-modal-body-header :title="getGoogleWorkSpaceTitle">
            <template #subtitle>
              <div>
                {{
                  `${isGoogleWorkSpaceEdit ? labels.Edit : 'Create a new'} ${
                    labels.GoogleWorkSpaceSubTitle
                  }`
                }}
                <a
                  href="https://doc.keepnetlabs.com/technical-guide/phishing-incident-responder/api-settings/gsuite-api-configuration-guide"
                  target="_blank"
                  style="color: #1173c1; cursor: pointer; text-decoration: none;"
                  >{{ labels.HowToCredJSON }}</a
                >
              </div>
            </template>
          </app-modal-body-header>
          <form-group title="Name" has-hint>
            <v-text-field
              placeholder="O365 Mail Configuration"
              outlined
              dense
              v-model.trim="googleWorkSpaceForm.name"
              :rules="[(v) => validations.required(v, 'Required')]"
              hint="*Required"
              persistent-hint
              id="name"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group title="Credential JSON" has-hint>
            <v-textarea
              placeholder="Enter Credential JSON"
              outlined
              dense
              v-model.trim="googleWorkSpaceForm.authJson"
              :rules="[(v) => validations.required(v, labels.Required)]"
              hint="*Required"
              persistent-hint
              id="input--mail-configuration-json-credential"
              rows="2"
              no-resize
              height="160"
            ></v-textarea>
          </form-group>
          <form-group title="Test Email Address" has-hint>
            <v-text-field
              placeholder="user@company.com"
              outlined
              dense
              v-model.trim="googleWorkSpaceForm.email"
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.mail(v, 'Invalid  email address')
              ]"
              hint="*Required"
              persistent-hint
              id="email"
              height="40"
            ></v-text-field>
          </form-group>
          <form-group :title="labels.TestConnection">
            <div class="ldap-info__status">
              <TestConnectionGoogleWorkspace
                ref="testConnectionGoogleWorkspace"
                :values="googleWorkSpaceForm"
                :isValidate="isValidateGoogleWorkSpace"
                :isEdit="googleWorkSpaceEditData"
                @testConnectionValues="testConnectionGoogleWorkspaceValues"
                @loading="isGoogleWorkSpaceButtonDisabled = false"
              />
            </div>
          </form-group>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            id="btn-cancel--mail-configurations-g-suite-modal"
            class="playbook-rule-form__button"
            outlined
            rounded
            color="error"
            @click="cancelGoogleWorkSpace"
            >{{ labels.Cancel }}</v-btn
          >
        </div>
        <div>
          <v-btn
            id="btn-save--mail-configurations-g-suite-modal"
            class="playbook-rule-form__button white--text"
            rounded
            color="#2196f3"
            :disabled="isGoogleWorkSpaceButtonDisabled"
            @click="handleSubmitGoogleWorkspace"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-dialog
      v-if="deleteDialog"
      icon="mdi-delete"
      title="Delete Mail Configuration?"
      :subtitle="`The ${deleteItemType} mail configuration will deleted permanently`"
      title-id="text--mail-configuration-delete-popup-title"
      subtitle-id="text--mail-configuration-delete-popup-subtitle"
      :status="deleteDialog"
      @changeStatus="closeDeleteDialog"
    >
      <template v-slot:app-dialog-body>
        {{ deleteDialogName }} will be deleted and removed from all integrations.
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--mail-configurations-popup"
          confirm-button-id="btn-delete--mail-configurations-popup"
          type="delete"
          @handleClose="closeDeleteDialog"
          @handleConfirm="handleDeleteDialog"
        />
      </template>
    </app-dialog>
    <div class="mail-configuration__content">
      <datatable
        ref="refPeopleTable"
        id="mail-configurations-data-table"
        selectable
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :filterable="true"
        :options="true"
        :show-all-records="showAllRecords"
        :pageSizes="tableOptions.pageSizes"
        :total-number-of-records="totalNumberOfRecords"
        :refName="'peopleTable'"
        :rowActions="tableOptions.rowActions"
        :selectEvent="tableOptions.selectEvent"
        :stored-table-settings="storedTableSettings"
        :setClassName="setCellClassName"
        @syncUser="handleSyncUser"
        @delete="handleDelete"
        @editTargetUsers="handleEditMailConfiguration"
        @onEmptyBtnClicked="status = true"
        :is-downloadable="true"
        @downloadEvent="exportMailConfigurationList"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="getTableData"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @on-table-settings-change="handleSetRenderedColumns"
        :isServerSide="true"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
      >
        <template v-slot:addUsers>
          <v-menu :min-width="128" :offset-y="true" left :nudge-right="5">
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    id="btn-add--mail-configurations"
                    class="button-new"
                    rounded
                    style="margin-right: 10px;"
                    color="#2196f3"
                    v-on="{ ...tooltip, ...menu }"
                    :disabled="!checkPermissions('mail-configurations/o365', 'POST')"
                  >
                    <v-icon color="white" style="font-size: 20px; margin-top: 1px;"
                      >mdi-plus</v-icon
                    >
                    <span class="button-new__text">NEW</span>
                  </v-btn>
                </template>
                <span class="tooltip-span">{{ 'Add Mail Configuration' }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item
                :key="item"
                @click="handleAddMailConfiguration(item)"
                v-for="item in mailConfigurationTypes"
              >
                <v-list-item-title
                  class="add-users__title"
                  :id="`item--mail-configuration-${item}`"
                  >{{ item }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:settings-popup-body>
          <div
            id="btn-edit--mail-configurations-custom-field"
            class="edit-fields"
            @click="handleEditFieldsClick"
          >
            EDIT FIELDS
          </div>
        </template>
        <template v-slot:empty-table-inline>
          <div class="mail-configuration__no-data">
            <p class="mail-configuration__no-data__header">
              {{ labels.EmptyMailConfiguration }}
            </p>
            <p class="mail-configuration__no-data__body">{{ labels.EmptyMailConfigurationSub }}</p>
            <div class="mail-configuration__no-data__buttons">
              <div
                v-if="false"
                id="btn-empty--mail-configurations-google-workspace"
                class="mail-configuration__no-data__buttons--button"
                @click="statusGoogleWorkSpace = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon
                ><img
                  style="margin-bottom: -4px;"
                  alt="outlook"
                  src="../../assets/img/google-workspace.png"
                />
              </div>
              <div
                id="btn-empty--mail-configurations-office-365"
                class="mail-configuration__no-data__buttons--button ml-4"
                @click="status = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon>
                <img alt="outlook" src="../../assets/img/office-365-logo.png" />
              </div>
              <div
                id="btn-empty--mail-configurations-office-EWS"
                class="mail-configuration__no-data__buttons--button"
                @click="ewsStatus = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon>
                <img alt="exchange" src="../../assets/img/office365_logo.png" />
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
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import AppDialog from '../AppDialog'
import {
  createEWS,
  createGoogleWorkSpace,
  createO365,
  deleteEWS,
  deleteGoogleWorkSpace,
  deleteO365,
  exportMailConfiguration,
  getEWSMailData,
  getExchangeVersions,
  getGoogleWorkSpace,
  getMailConfigurationList,
  getO365MailData,
  updateEWS,
  updateGoogleWorkSpace,
  updateO365
} from '@/api/mailConfiguration'
import * as validations from '@/utils/validations'
import TestConnection from './TestConnection'
import TestConnectionEWS from './TestConnectionEWS'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { checkPermission, scrollToComponent } from '@/utils/functions'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import { getTargetGroups } from '@/api/targetUsers'
import TestConnectionGoogleWorkspace from '@/components/MailConfiguration/TestConnectionGoogleWorkspace'
export default {
  name: 'MailConfiguration',
  components: {
    TestConnectionGoogleWorkspace,
    AppDialogFooter,
    Datatable,
    AppModal,
    AppDialog,
    TestConnection,
    TestConnectionEWS,
    AppModalBodyHeader,
    FormGroup,
    KSelect,
    InputUrl
  },
  computed: {
    getTitle() {
      return this.editData ? 'Edit O365 Mail Configuration' : 'Create O365 Mail Configuration'
    },
    getGoogleWorkSpaceTitle() {
      return this.isGoogleWorkSpaceEdit
        ? `${labels.Edit} ${labels.GoogleWorkSpaceTitle}`
        : `${labels.New} ${labels.GoogleWorkSpaceTitle}`
    }
  },
  data: () => ({
    labels,
    isGoogleWorkSpaceEdit: false,
    delaySaveFunction: false,
    showAllRecords: false,
    isGoogleWorkSpaceButtonDisabled: false,
    totalNumberOfRecords: 0,
    saveButtonDisabled: false,
    isTestConnectionWorkedBefore: false,
    selectedGoogleWorkSpaceResourceId: '',
    googleWorkSpaceForm: {
      name: '',
      authJson: '',
      email: ''
    },
    deletedItem: null,
    statusGoogleWorkSpace: false,
    deleteDialogId: null,
    deleteDialog: null,
    deleteDialogName: null,
    deleteItemType: null,
    editData: null,
    ewsEditData: null,
    googleWorkSpaceEditData: null,
    storedTableSettings: null,
    formValues: {
      name: null,
      applicationId: null,
      applicationSecret: null,
      directoryId: null,
      email: null
    },
    exchangeVersions: [],
    targetGroupsList: [],
    defaultTargetGroupsList: [],
    ewsFormValues: {
      Name: null,
      ServiceUrl: null,
      ExchangeVersionLookupResourceId: null,
      AccountType: 1,
      Username: null,
      Password: null,
      Email: null,
      XAnchorMailBoxHeader: false,
      TargetGroupResourceIdList: [],
      IsAllTargetGroupsSelected: true
    },
    initialFormValues: null,
    ewsInitialFormValues: null,
    googleWorkSpaceInitialValues: null,
    status: false,
    ewsStatus: false,
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
          property: PROPERTY_STORE.NAME,
          align: 'left',
          editable: false,
          label: 'Name',
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'text'
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
          type: 'text'
        },
        {
          property: 'statusName',
          align: 'center',
          editable: false,
          label: 'Status',
          sortable: true,
          show: true,
          type: 'badge',
          width: 150,
          props: {
            style: {
              maxWidth: '100px'
            }
          }
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
        message: labels.EmptyMailConfiguration,
        btn: 'O365',
        icon: 'mdi-microsoft-office',
        subMes: labels.EmptyMailConfigurationSub
      },
      addButton: {
        show: true,
        action: 'addButton'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          id: 'btn-empty--mail-configurations',
          action: 'editTargetUsers',
          isNotShow: true,
          disabled: !checkPermission('mail-configurations/o365/{resourceId}', 'PUT')
        },
        {
          name: 'Delete',
          id: 'btn-delete--mail-configurations',
          icon: 'mdi-delete',
          action: 'delete',
          disabled: !checkPermission('mail-configurations/o365/{resourceId}', 'DELETE')
        }
      ]
    },
    mailConfigurationTypes: ['O365', 'EWS'],
    validations: validations,
    requestBody: {
      pageNumber: 1,
      pageSize: 75000,
      orderBy: 'CreateTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    defaultRequestBody: {
      pageNumber: 1,
      pageSize: 75000,
      orderBy: 'CreateTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    serverSideProps: new ServerSideProps()
  }),
  methods: {
    handleGroupTypeChange() {
      if (this.ewsFormValues.IsAllTargetGroupsSelected) {
        this.ewsFormValues.TargetGroupResourceIdList = []
      }
    },
    afterSuccessCreateOrUpdateGoogleWorkSpace() {
      this.statusGoogleWorkSpace = false
      this.resetGoogleWorkSpaceForm()
      this.getTableData()
      this.selectedGoogleWorkSpaceResourceId = ''
    },
    handleSubmitGoogleWorkspace() {
      if (
        JSON.stringify(this.googleWorkSpaceForm) !==
          JSON.stringify(this.googleWorkSpaceInitialValues) &&
        this.googleWorkSpaceEditData
      ) {
        this.isTestConnectionWorkedBefore = false
      }
      if (
        this.$refs.googleWorkSpaceConfigurationForm.validate() &&
        this.isTestConnectionWorkedBefore
      ) {
        this.isGoogleWorkSpaceButtonDisabled = true
        if (this.isGoogleWorkSpaceEdit) {
          updateGoogleWorkSpace(this.googleWorkSpaceForm, this.selectedGoogleWorkSpaceResourceId)
            .then(this.afterSuccessCreateOrUpdateGoogleWorkSpace)
            .finally(() => {
              this.isGoogleWorkSpaceButtonDisabled = false
              this.googleWorkSpaceEditData = null
            })
        } else {
          createGoogleWorkSpace(this.googleWorkSpaceForm)
            .then(this.afterSuccessCreateOrUpdateGoogleWorkSpace)
            .finally(() => {
              this.isGoogleWorkSpaceButtonDisabled = false
              this.googleWorkSpaceEditData = null
            })
        }
      } else if (
        this.$refs.googleWorkSpaceConfigurationForm.validate() &&
        !this.isTestConnectionWorkedBefore
      ) {
        this.isGoogleWorkSpaceButtonDisabled = true
        this.$refs.testConnectionGoogleWorkspace.testConnection(true)
        setTimeout(() => {
          let el = this.$el.querySelector('.test-connection__testing-content__item')
          scrollToComponent(el)
        }, 50)
      } else {
        const el = this.$refs.ewsMailConfiguration.$el
        scrollToComponent(el)
      }
    },
    handleGoogleWorkspaceTestConnection() {},
    cancelEWS() {
      this.ewsStatus = false
      this.ewsInitialFormValues = null
    },
    submitEWS() {
      if (
        JSON.stringify(this.ewsFormValues) !== JSON.stringify(this.ewsInitialFormValues) &&
        this.ewsEditData
      ) {
        this.isTestConnectionWorkedBefore = false
      }
      if (this.$refs.ewsMailConfiguration.validate() && this.isTestConnectionWorkedBefore) {
        this.saveButtonDisabled = true
        if (this.ewsEditData) {
          let ewsEditData = this.ewsFormValues
          updateEWS(ewsEditData, this.ewsEditData.ResourceId).then(() => {
            this.ewsStatus = false
            this.ewsEditData = null
            this.getTableData()
          })
        } else {
          createEWS(this.ewsFormValues).then(() => {
            this.ewsStatus = false
            this.ewsEditData = null
            this.getTableData()
          })
        }
      } else if (this.$refs.ewsMailConfiguration.validate() && !this.isTestConnectionWorkedBefore) {
        this.saveButtonDisabled = true
        this.$refs.testConnectionEWS.testConnection(true)
        setTimeout(() => {
          let el = this.$el.querySelector('.test-connection__testing-content__item')
          scrollToComponent(el)
        }, 50)
      } else {
        const el = this.$refs.ewsMailConfiguration.$el
        scrollToComponent(el)
      }
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.MAILCONFIGURATION, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      //generic
      this.requestBody.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.requestBody.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.getTableData()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.requestBody.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.requestBody.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.requestBody.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.requestBody.ascending = order === 'ascending'
      this.requestBody.orderBy = prop
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getTableData()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.MAILCONFIG))
      if (savedFilter) {
        this.requestBody.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refPeopleTable.filterValues = savedFilter.filterValues
          this.$refs.refPeopleTable.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getTableData()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.requestBody = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refPeopleTable.filterValues = {}
      this.$refs.refPeopleTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.MAILCONFIG)
      this.getTableData()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.MAILCONFIG,
        JSON.stringify({
          filter: this.requestBody.filter,
          filterValues
        })
      )
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    testConnectionValues(isSuccess, isSave) {
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        this.ewsInitialFormValues = JSON.parse(JSON.stringify(this.ewsFormValues))
        if (isSave && !this.delaySaveFunction) {
          this.$nextTick(() => {
            if (this.status) this.submit()
            if (this.ewsStatus) this.submitEWS()
          })
        }
      }
    },
    testConnectionGoogleWorkspaceValues(isSuccess, isSave) {
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        this.googleWorkSpaceInitialValues = JSON.parse(JSON.stringify(this.googleWorkSpaceForm))
        if (isSave && !this.delaySaveFunction) {
          this.$nextTick(() => {
            this.handleSubmitGoogleWorkspace()
          })
        }
      }
    },
    handleAllRecordsClick() {
      this.requestBody.pageSize = 75000
      this.showAllRecords = false
      this.getTableData()
    },
    isValidate() {
      if (this.ewsStatus)
        return this.$refs.ewsMailConfiguration && this.$refs.ewsMailConfiguration.validate()
      return this.$refs.mailConfiguration && this.$refs.mailConfiguration.validate()
    },
    isValidateGoogleWorkSpace() {
      return (
        this.$refs.googleWorkSpaceConfigurationForm &&
        this.$refs.googleWorkSpaceConfigurationForm.validate()
      )
    },
    closeDeleteDialog() {
      this.deleteDialog = false
      this.deleteDialogName = null
      this.deleteDialogId = null
    },
    handleDeleteDialog() {
      if (this.deleteItemType === 'Exchange') {
        deleteEWS(this.deleteDialogId).then(() => {
          this.$refs.refPeopleTable.unSelectRow(this.deletedItem)
          this.closeDeleteDialog()
          this.getTableData()
        })
      } else if (
        this.deleteItemType === 'Google Workspace' ||
        this.deleteItemType === 'GSuite' ||
        this.deleteItemType === 'GoogleWorkspace'
      ) {
        deleteGoogleWorkSpace(this.deleteDialogId).then(() => {
          this.$refs.refPeopleTable.unSelectRow(this.deletedItem)
          this.closeDeleteDialog()
          this.getTableData()
        })
      } else {
        deleteO365(this.deleteDialogId).then(() => {
          this.$refs.refPeopleTable.unSelectRow(this.deletedItem)
          this.closeDeleteDialog()
          this.getTableData()
        })
      }
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
          link.download = `Mail Configurations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
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
      this.initialFormValues = null
    },
    cancelGoogleWorkSpace() {
      this.statusGoogleWorkSpace = false
      this.resetGoogleWorkSpaceForm()
      this.isGoogleWorkSpaceEdit = false
    },
    resetGoogleWorkSpaceForm() {
      this.googleWorkSpaceForm = {
        name: '',
        authJson: '',
        email: ''
      }
    },
    getTableData() {
      this.loading = true
      getMailConfigurationList(this.requestBody)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.tableOptions.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          if (totalNumberOfRecords <= 1000 && this.tableOptions.pageSize === 1000) {
            this.showAllRecords = false
          }
          this.tableData = response.data.data.results
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDelete(item) {
      this.deleteItemType = item.platform
      this.deleteDialogName = item.name
      this.deleteDialogId = item.resourceId
      this.deletedItem = item
      this.deleteDialog = true
    },
    submit() {
      if (
        JSON.stringify(this.formValues) !== JSON.stringify(this.initialFormValues) &&
        this.editData
      ) {
        this.isTestConnectionWorkedBefore = false
      }
      if (this.$refs.mailConfiguration.validate() && this.isTestConnectionWorkedBefore) {
        this.saveButtonDisabled = true
        if (this.editData) {
          let editData = this.formValues
          updateO365(editData, this.editData.resourceId).then(() => {
            this.status = false
            this.editData = null
            this.getTableData()
          })
        } else {
          createO365(this.formValues).then(() => {
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
    handleAddMailConfiguration(item) {
      switch (item) {
        case this.mailConfigurationTypes[0]:
          this.statusGoogleWorkSpace = true
          this.googleWorkSpaceEditData = null
          this.isTestConnectionWorkedBefore = false
          break
        case this.mailConfigurationTypes[1]:
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
        case this.mailConfigurationTypes[2]:
          this.ewsFormValues = {
            Name: null,
            ServiceUrl: null,
            ExchangeVersionLookupResourceId: null,
            AccountType: 1,
            Username: null,
            Password: null,
            Email: null,
            XAnchorMailBoxHeader: false,
            TargetGroupResourceIdList: [],
            IsAllTargetGroupsSelected: true
          }
          this.ewsEditData = null
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
          this.ewsStatus = true
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
    handleEditMailConfiguration(selectedRow) {
      console.log(selectedRow)
      if (selectedRow.platform === 'Exchange') {
        getEWSMailData(selectedRow.resourceId).then((response) => {
          const apiData = response.data.data
          this.ewsFormValues = {
            Name: apiData.name,
            ServiceUrl: apiData.serviceUrl,
            ExchangeVersionLookupResourceId: apiData.ewsSchemaVersionLookupResourceId,
            AccountType: apiData.accountType,
            Username: apiData.userName,
            Password: '********************',
            Email: apiData.email,
            XAnchorMailBoxHeader: apiData.xAnchorMailBoxHeader,
            TargetGroupResourceIdList: apiData.targetGroupResourceIdList,
            IsAllTargetGroupsSelected: apiData.isAllTargetGroupsSelected,
            ResourceId: selectedRow.resourceId
          }
          this.ewsEditData = this.ewsFormValues
          this.ewsInitialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
          this.ewsStatus = true
        })
      } else if (
        selectedRow.platform === 'GSuite' ||
        selectedRow.platform === 'Google Workspace' ||
        selectedRow.platform === 'GoogleWorkspace'
      ) {
        getGoogleWorkSpace(selectedRow.resourceId).then((response) => {
          const apiData = response.data.data
          this.googleWorkSpaceForm = {
            name: apiData.name,
            authJson: apiData.authJson,
            email: apiData.email
          }
          this.googleWorkSpaceEditData = {
            ...this.googleWorkSpaceForm,
            resourceId: selectedRow.resourceId
          }
          this.googleWorkSpaceInitialValues = JSON.parse(JSON.stringify(this.googleWorkSpaceForm))
          this.isGoogleWorkSpaceEdit = true
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
          this.statusGoogleWorkSpace = true
          this.selectedGoogleWorkSpaceResourceId = selectedRow.resourceId
        })
      } else {
        getO365MailData(selectedRow.resourceId).then((response) => {
          const apiData = response.data.data
          this.formValues = {
            name: apiData.name,
            applicationId: apiData.applicationId,
            applicationSecret: apiData.applicationSecret,
            directoryId: apiData.directoryId,
            email: apiData.email,
            resourceId: selectedRow.resourceId
          }
          this.editData = this.formValues
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
          this.status = true
        })
      }
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
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
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
      this.getTableData()
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
      this.getTableData()

      this.tableOptions.isColumnFilterActive =
        this.requestBody.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleSyncUser(scope) {
      this.selectedSyncIndex = scope.$index
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
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.MAILCONFIGURATION)
    )
    getExchangeVersions().then((response) => {
      this.exchangeVersions = response.data.data
    })
    getTargetGroups().then((response) => {
      this.targetGroupsList = response.data.data
      this.defaultTargetGroupsList = response.data.data
    })
  },
  mounted() {
    if (!this.checkPermissions('mail-configurations/search', 'POST')) {
      this.$router.push('/incident-responder')
    } else {
      this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
      this.queryHelper.controlRouteQuery()
      const { page, size } = this.queryHelper.returnQueryValues()
      this.setQueryValuesToPayload(this.$route.query)
      this.tableOptions.pageSize = size
      this.tableOptions.pageNumber = page
      this.serverSideProps.pageSize = size
      this.getDefaultFilterAndSearch()
    }
  }
}
</script>

<style lang="scss">
.mail-configuration {
  padding: 11px 16px 16px 16px;
  min-height: 80vh;

  .v-menu__content.theme--light.menuable__content__active.k-select__menu.menu--ews-target-users {
    z-index: 999999 !important;
  }
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
