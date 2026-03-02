<template>
  <div class="mail-configuration" style="margin-top: 5px;">
    <app-modal
      v-if="status"
      ref="mail-configuration__modal"
      title-id="text--create-o365-mail-configuration-modal-title"
      className="mail-configuration__modal"
      icon-name="mdi-book-search"
      :title="getTitle"
      :status="status"
      @closeOverlay="status = false"
    >
      <template #overlay-body>
        <v-form ref="mailConfiguration">
          <app-modal-body-header
            :title="getTitle"
            sub-title="Select filters and date options to start an investigation"
          />
          <form-group title="Name" has-hint>
            <InputEntityName
              v-model.trim="formValues.name"
              id="input--mail-configuration-name"
              entityName="Configuration name"
              initialPlaceholder="Enter configuration name"
            />
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
              autocomplete="off"
              height="40"
              @change="getDomainList"
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
              autocomplete="off"
              height="40"
              @change="getDomainList"
            ></v-text-field>
          </form-group>
          <form-group title="Directory (tenant) ID" has-hint>
            <v-text-field
              v-model.trim="formValues.directoryId"
              placeholder="Enter a directory ID"
              id="input--mail-configuration-directory-id"
              outlined
              dense
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Directory ID', 64))
              ]"
              hint="*Required"
              persistent-hint
              autocomplete="off"
              height="40"
              @change="getDomainList"
            ></v-text-field>
          </form-group>
          <form-group title="Test Email Address" has-hint>
            <v-text-field
              v-model.trim="formValues.email"
              placeholder="Enter an email address"
              id="input--mail-configuration-test-email-address"
              outlined
              dense
              hint="*Required"
              persistent-hint
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.startsWithSpace(v, labels.CannotStartWithSpace),
                (v) => validations.email(v, labels.InvalidEmailAddress),
                (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
                (v) => {
                  if (validations.email(v)) {
                    return validations.controlEmailLength(v) || labels.InvalidEmailAddress
                  }
                  return false
                }
              ]"
              height="40"
              @change="getDomainList"
            ></v-text-field>
          </form-group>
          <form-group title="Domain Selection">
            <k-select
              v-model.trim="formValues.allowedDomains"
              :items="domainList"
              custom-menu-class="menu--domain"
              placeholder="Select Domain"
              dense
              deletable-chips
              autocomplete="off"
              small-chips
              outlined
              item-value="resourceId"
              item-text="name"
              class="pop-up-card__invite-member"
              multiple
              no-data-text="No domain available"
              :disabled="
                !formValues.applicationId ||
                !formValues.applicationSecret ||
                !formValues.directoryId ||
                !formValues.email
              "
            ></k-select>
          </form-group>

          <v-list-item class="add-user-overlay__list-item">
            <v-list-item-content class="test-connection-wrapper">
              <TestConnection
                ref="testConnection"
                :values="formValues"
                :isValidate="isValidate"
                :isEdit="editData"
                @testConnectionValues="testConnectionValues"
                @loading="saveButtonDisabled = false"
              />
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template #overlay-footer>
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
            :disabled="saveButtonDisabled"
            @click="submit"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
    <app-modal
      v-if="ewsStatus"
      :status="ewsStatus"
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
            <InputEntityName
              v-model.trim="ewsFormValues.Name"
              id="input--ews-configuration-name"
              entityName="Configuration name"
              initialPlaceholder="Enter configuration name"
            />
          </form-group>
          <form-group title="Service URL" has-hint>
            <InputUrl
              v-model="ewsFormValues.ServiceUrl"
              placeholder="https://exchange.devkeepnet.com/ews/exchange.asmx"
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
              class="ews-target-groups-select__radio-group"
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
                (v) => validations.startsWithSpace(v, labels.CannotStartWithSpace),
                (v) => validations.email(v, labels.InvalidEmailAddress),
                (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
                (v) => {
                  if (validations.email(v)) {
                    return validations.controlEmailLength(v) || labels.InvalidEmailAddress
                  }
                  return false
                }
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
      v-if="statusGoogleWorkSpace"
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
                  href="https://doc.keepnetlabs.com/Next-Generation-Product/platform/incident-responder/mail-configurations/google-workspace"
                  target="_blank"
                  rel="noopener"
                  style="color: #1173c1; cursor: pointer; text-decoration: none;"
                  >{{ labels.HowToCredJSON }}</a
                >
              </div>
            </template>
          </app-modal-body-header>
          <form-group title="Name" has-hint>
            <InputEntityName
              v-model.trim="googleWorkSpaceForm.name"
              id="name"
              entityName="Configuration name"
              initialPlaceholder="Enter configuration name"
            />
          </form-group>
          <form-group title="Credential JSON" has-hint>
            <v-textarea
              v-model.trim="googleWorkSpaceForm.authJson"
              id="input--mail-configuration-json-credential"
              outlined
              dense
              persistent-hint
              no-resize
              hint="*Required"
              placeholder="Enter Credential JSON"
              rows="2"
              height="160"
              :rules="[(v) => validations.required(v, labels.Required)]"
            ></v-textarea>
          </form-group>
          <form-group title="Test Email Address" has-hint>
            <v-text-field
              v-model.trim="googleWorkSpaceForm.email"
              placeholder="user@company.com"
              outlined
              dense
              :rules="[
                (v) => validations.required(v, labels.Required),
                (v) => validations.startsWithSpace(v, labels.CannotStartWithSpace),
                (v) => validations.email(v, labels.InvalidEmailAddress),
                (v) => validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
                (v) => {
                  if (validations.email(v)) {
                    return validations.controlEmailLength(v) || labels.InvalidEmailAddress
                  }
                  return false
                }
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
      type="delete"
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
        filterable
        options
        is-downloadable
        is-server-side
        :loading="loading"
        :table="tableData"
        :addButton="tableOptions.addButton"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :rowActions="tableOptions.rowActions"
        :selectEvent="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="requestBody"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @delete="handleDelete"
        @editTargetUsers="handleEditMailConfiguration"
        @onEmptyBtnClicked="status = true"
        @downloadEvent="exportMailConfigurationList"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="getTableData"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
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
                    :disabled="!PERMISSIONS.O365_POST.hasPermission"
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
                v-for="item in mailConfigurationTypes"
                :key="item"
                @click="handleAddMailConfiguration(item)"
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
        <template v-slot:empty-table-inline>
          <div class="mail-configuration__no-data">
            <p class="mail-configuration__no-data__header">
              {{ labels.EmptyMailConfiguration }}
            </p>
            <p class="mail-configuration__no-data__body">
              {{ labels.EmptyMailConfigurationSub }}
            </p>
            <div class="mail-configuration__no-data__buttons">
              <div
                id="btn-empty--mail-configurations-google-workspace"
                class="mail-configuration__no-data__buttons--button"
                @click="statusGoogleWorkSpace = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon
                ><img
                  style="margin-bottom: -4px;"
                  alt="google-workspace"
                  src="../../assets/img/google-workspace.png"
                  width="175"
                />
              </div>
              <div
                id="btn-empty--mail-configurations-office-365"
                class="mail-configuration__no-data__buttons--button ml-4"
                @click="status = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon>
                <img alt="microsoft365" src="../../assets/img/microsoft-365-logo.svg" width="175" />
              </div>
              <div
                id="btn-empty--mail-configurations-office-EWS"
                class="mail-configuration__no-data__buttons--button"
                @click="ewsStatus = true"
              >
                <v-icon color="#2196f3">mdi-plus-circle</v-icon>
                <img alt="exchange" src="../../assets/img/office365_logo.svg" width="150" />
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
  getDomainList,
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
import { getDefaultAxiosPayload, isDifferent, scrollToComponent } from '@/utils/functions'
import TestConnection from './TestConnection'
import TestConnectionEWS from './TestConnectionEWS'
import FormGroup from '@/components/SmallComponents/FormGroup'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import { getTargetGroups } from '@/api/targetUsers'
import TestConnectionGoogleWorkspace from '@/components/MailConfiguration/TestConnectionGoogleWorkspace'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

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
    InputUrl,
    InputEntityName
  },
  props: {
    PERMISSIONS: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      labels,
      isGoogleWorkSpaceEdit: false,
      delaySaveFunction: false,
      isGoogleWorkSpaceButtonDisabled: false,
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
      domainList: [],
      formValues: {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null,
        allowedDomains: []
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
      formValuesAfterO365Test: {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null,
        allowedDomains: []
      },
      initialFormValues: {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null,
        allowedDomains: []
      },
      formValuesAfterEWSTest: {
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
      ewsInitialFormValues: {
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
      formValuesAfterGWSTest: {
        name: '',
        authJson: '',
        email: ''
      },
      googleWorkSpaceInitialValues: {
        name: '',
        authJson: '',
        email: ''
      },
      status: false,
      ewsStatus: false,
      tableData: [],
      loading: true,
      selectedRow: null,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.MAILCONFIG,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.MAILCONFIGURATION,
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
            width: 150,
            filterableType: 'select',
            filterableItems: [
              { text: 'Google Workspace', value: 'Google Workspace' },
              'Microsoft 365',
              'Exchange'
            ]
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text'
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
            },
            filterableType: 'select',
            filterableItems: ['Running', 'Not Running']
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
            width: 180,
            filterableType: 'date'
          }
        ],
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
            disabled: !this?.PERMISSIONS?.O365_UPDATE?.hasPermission
          },
          {
            name: 'Delete',
            id: 'btn-delete--mail-configurations',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this?.PERMISSIONS?.O365_DELETE?.hasPermission
          }
        ]
      },
      mailConfigurationTypes: ['Google Workspace', 'Microsoft 365', 'EWS'],
      validations: validations,
      requestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getTitle() {
      return this.editData
        ? 'Edit Microsoft 365 Mail Configuration'
        : 'Create Microsoft 365 Mail Configuration'
    },
    getGoogleWorkSpaceTitle() {
      return this.isGoogleWorkSpaceEdit
        ? `${labels.Edit} ${labels.GoogleWorkSpaceTitle}`
        : `${labels.New} ${labels.GoogleWorkSpaceTitle}`
    }
  },
  methods: {
    getDomainList(selectedRow) {
      if (
        !!this.formValues?.applicationId &&
        !!this.formValues?.applicationSecret &&
        !!this.formValues?.directoryId &&
        !!this.formValues?.email
      ) {
        const payload = {
          applicationId: this.formValues?.applicationId,
          applicationSecret: this.formValues?.applicationSecret,
          directoryId: this.formValues?.directoryId,
          email: this.formValues?.email,
          resourceId: selectedRow?.resourceId
        }
        getDomainList(payload).then((response) => (this.domainList = response.data.data))
      }
    },
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
        if (
          JSON.stringify(this.googleWorkSpaceForm) !== JSON.stringify(this.formValuesAfterGWSTest)
        )
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
        this.scrollToTestConnectionButton()
      } else {
        this.scrollToEWSMailConfiguration()
      }
    },
    scrollToTestConnectionButton() {
      this.$nextTick(() => {
        let el = this.$el.querySelector('.test-connection__testing-content__item')
        if (el) {
          scrollToComponent(el)
        }
      })
    },
    scrollToEWSMailConfiguration() {
      this.$nextTick(() => {
        const el = this?.$refs?.ewsMailConfiguration?.$el
        if (el) {
          scrollToComponent(el)
        }
      })
    },
    resetEWSForm() {
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
      this.ewsInitialFormValues = {
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
    },
    cancelEWS() {
      const isChanged = isDifferent(this.ewsInitialFormValues, this.ewsFormValues)
      if (!isChanged) {
        this.ewsStatus = false
        this.resetEWSForm()
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.ewsStatus = false
          this.resetEWSForm()
        }
      })
    },
    submitEWS() {
      if (
        JSON.stringify(this.ewsFormValues) !== JSON.stringify(this.ewsInitialFormValues) &&
        this.ewsEditData
      ) {
        if (JSON.stringify(this.ewsFormValues) !== JSON.stringify(this.formValuesAfterEWSTest))
          this.isTestConnectionWorkedBefore = false
      }
      if (this.$refs.ewsMailConfiguration.validate() && this.isTestConnectionWorkedBefore) {
        this.saveButtonDisabled = true
        if (this.ewsEditData) {
          let ewsEditData = this.ewsFormValues
          updateEWS(ewsEditData, this.ewsEditData.ResourceId).then(() => {
            this.ewsStatus = false
            this.resetEWSForm()
            this.getTableData()
          })
        } else {
          createEWS(this.ewsFormValues).then(() => {
            this.ewsStatus = false
            this.resetEWSForm()
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
    resetPageNumber() {
      this.requestBody.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.requestBody.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.getTableData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.requestBody.pageNumber = pageNumber
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      this.requestBody.ascending = order === 'ascending'
      this.requestBody.orderBy = prop
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getTableData()
    },
    testConnectionValues(isSuccess, isSave) {
      this.formValuesAfterO365Test = structuredClone(this.formValues)
      this.formValuesAfterEWSTest = structuredClone(this.ewsFormValues)
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        if (isSave && !this.delaySaveFunction) {
          this.$nextTick(() => {
            if (this.status) this.submit()
            if (this.ewsStatus) this.submitEWS()
          })
        }
      }
    },
    testConnectionGoogleWorkspaceValues(isSuccess, isSave) {
      this.formValuesAfterGWSTest = structuredClone(this.googleWorkSpaceForm)
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        if (isSave && !this.delaySaveFunction) {
          this.$nextTick(() => {
            this.handleSubmitGoogleWorkspace()
          })
        }
      }
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
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Mail Configurations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    resetO365Form() {
      this.formValues = {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null,
        allowedDomains: []
      }
      this.initialFormValues = {
        name: null,
        applicationId: null,
        applicationSecret: null,
        directoryId: null,
        email: null,
        allowedDomains: []
      }
    },
    cancelO365() {
      const isChanged = isDifferent(this.initialFormValues, this.formValues)
      if (!isChanged) {
        this.status = false
        this.editData = null
        this.resetO365Form()
        this.domainList = []
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.status = false
          this.editData = null
          this.resetO365Form()
          this.domainList = []
        }
      })
    },
    cancelGoogleWorkSpace() {
      const isChanged = isDifferent(this.googleWorkSpaceInitialValues, this.googleWorkSpaceForm)
      if (!isChanged) {
        this.statusGoogleWorkSpace = false
        this.resetGoogleWorkSpaceForm()
        this.isGoogleWorkSpaceEdit = false
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.statusGoogleWorkSpace = false
          this.resetGoogleWorkSpaceForm()
          this.isGoogleWorkSpaceEdit = false
        }
      })
    },
    resetGoogleWorkSpaceForm() {
      this.googleWorkSpaceForm = {
        name: '',
        authJson: '',
        email: ''
      }
      this.googleWorkSpaceInitialValues = {
        name: '',
        authJson: '',
        email: ''
      }
    },
    getTableData() {
      this.loading = true
      getMailConfigurationList(this.requestBody)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
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
        if (JSON.stringify(this.formValues) !== JSON.stringify(this.formValuesAfterO365Test))
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
    handleAddMailConfiguration(item) {
      if (item === this.mailConfigurationTypes[0]) {
        this.statusGoogleWorkSpace = true
        this.googleWorkSpaceEditData = null
        this.isTestConnectionWorkedBefore = false
        this.googleWorkSpaceInitialValues = structuredClone(this.googleWorkSpaceForm)
        return
      }
      if (item === this.mailConfigurationTypes[1]) {
        this.formValues = {
          name: null,
          applicationId: null,
          applicationSecret: null,
          directoryId: null,
          email: null,
          allowedDomains: []
        }
        this.initialFormValues = structuredClone(this.formValues)
        this.editData = null
        this.isTestConnectionWorkedBefore = false
        this.saveButtonDisabled = false
        this.status = true
        return
      }
      if (item === this.mailConfigurationTypes[2]) {
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
        this.ewsInitialFormValues = structuredClone(this.ewsFormValues)
        this.ewsEditData = null
        this.isTestConnectionWorkedBefore = false
        this.saveButtonDisabled = false
        this.ewsStatus = true
      }
    },
    handleEditMailConfiguration(selectedRow) {
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
          this.ewsInitialFormValues = structuredClone(this.formValues)
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
          this.googleWorkSpaceInitialValues = structuredClone(this.googleWorkSpaceForm)
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
            resourceId: selectedRow.resourceId,
            allowedDomains: apiData.allowedDomains
          }
          this.getDomainList(selectedRow)
          this.editData = this.formValues
          this.initialFormValues = structuredClone(this.formValues)
          this.isTestConnectionWorkedBefore = false
          this.saveButtonDisabled = false
          this.status = true
        })
      }
    },
    columnFilterChanged(filter) {
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.requestBody
      )
      this.getTableData()
    },
    columnFilterCleared(fieldName) {
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.requestBody
      )
      this.getTableData()
    }
  },
  created() {
    if (this?.PERMISSIONS?.SEARCH?.hasPermission) {
      this.getTableData()
    } else {
      this.$router.push('/incident-responder')
    }
    getExchangeVersions().then((response) => {
      this.exchangeVersions = response.data.data
    })
    getTargetGroups().then((response) => {
      this.targetGroupsList = response.data.data
      this.defaultTargetGroupsList = response.data.data
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.status) {
      this.cancelO365()
      next(false)
    } else if (this.statusGoogleWorkSpace) {
      this.cancelGoogleWorkSpace()
      next(false)
    } else if (this.ewsStatus) {
      this.cancelEWS()
      next(false)
    } else {
      next()
    }
  }
}
</script>
