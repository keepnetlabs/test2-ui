<template>
  <div class="people">
    <GamificationReportUserDetailsDrawer
      v-if="isUserDetailsDrawerOpen"
      :status="isUserDetailsDrawerOpen"
      :selectedRow="selectedRow"
      :formDetails="formDetails"
      :datePayload="getDatePayload"
      isTargetUser
      @on-close="handleCloseDrawer"
    />
    <default-error-dialog
      v-if="!!bulkDeleteErrorMessage"
      :status="!!bulkDeleteErrorMessage"
      :error-message="bulkDeleteErrorMessage"
      @on-close="bulkDeleteErrorMessage = ''"
    />
    <delete-user-modal
      v-if="isWantToShowDeleteUserModal"
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      :isMultiple="isMultipleDelete"
      :user-count="multipleDeletedUserCount"
      :confirmButtonDisabled="deleteButtonDisabled"
      @deleteAction="handleDeleteUser"
      @deleteMultiple="handleDeleteUsers"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <add-user-modal
      v-if="isWantToShowAddUsersModal"
      ref="addUserModal"
      :status="isWantToShowAddUsersModal"
      :editData="selectedRow"
      :custom-fields="customFields"
      :company-license="companyLicense"
      :language-items="languageFilterOptions"
      @closeAddUserModal="closeAddUserModal"
      @closeAddUserModalWithUpdate="closeAddUserModalWithUpdate"
    />
    <custom-fields-modal
      v-if="isWantToShowCustomFieldsModal"
      :status="isWantToShowCustomFieldsModal"
      :bulk-delete-error-message.sync="bulkDeleteErrorMessage"
      @closeCustomFieldsModal="toggleCustomFieldsModal"
      @closeCustomFieldsModalWithUpdate="closeCustomFieldsModalWithUpdate"
    />
    <target-user-import-from-a-file
      v-if="isWantToImportFile"
      ref="targetUserFromAFile"
      :status="isWantToImportFile"
      :columns="tableOptions.columns"
      :companyLicense="companyLicense"
      @closeAddUserModal="closeImportModal"
      @closeOverlay="isWantToImportFile = false"
    />
    <TargetUsersViewTargetUserGroups
      v-if="isShowingTargetUserViewTargetGroups"
      :item="selectedUserToViewGroups"
      :status="isShowingTargetUserViewTargetGroups"
      @on-close="toggleShowingTargetUserViewTargetGroups"
    />
    <TargetUserLDAPImportModal
      v-if="isShowImportLDAPModal"
      :status="isShowImportLDAPModal"
      :resource-id="ldapResourceId"
      :field-mappings="ldapFieldMappings"
      :custom-fields="customFields"
      @on-close="toggleImportLDAPModal"
      @on-close-with-update="callForGetTargetUserCustomFieldsByCompanyId"
    />
    <TargetUserAddToAnExistingGroupModal
      v-if="isShowingTargetUserAddToGroup"
      :status="isShowingTargetUserAddToGroup"
      :bulkImportPayload="bulkImportPayload"
      @closeOverlay="toggleShowingTargetUserAddToGroup"
      @closeOverlayWithUpdate="closeAddToAnExistingGroupModalWithUpdate"
      @on-empty-target-group-route="$emit('on-empty-target-group-route')"
    />
    <TargetUserCreateGroupWithUserDialog
      v-if="isShowingTargetUserCreateGroupWithUser"
      :status="isShowingTargetUserCreateGroupWithUser"
      @onConfirm="handleConfirmCreateUserWithGroup"
      @onClose="toggleShowingTargetUserCreateGroupWithUser"
    />
    <UnverifiedDomainsModal
      v-if="isUnverifiedDomainsModalVisible"
      :status="isUnverifiedDomainsModalVisible"
      :domains="unverifiedDomains"
      @closeOverlay="changeUnverifiedDomainsModalStatus(false)"
    />
    <AlertBox
      v-if="canRenderAlertbox"
      class="mb-6"
      :text="getUnverifiedDomainsText"
      :slots="{ primaryAction: true, secondaryAction: true }"
    >
      <template #secondaryAction>
        <v-btn class="people__alert-box__secondary-action" rounded @click="handleSecondaryAction">
          {{ unverifiedDomains.length > 1 ? labels.SeeDomains : labels.SeeDomain }}</v-btn
        >
      </template>
      <template #primaryAction>
        <v-btn class="people__alert-box__primary-action" rounded @click="handlePrimaryAction">
          {{ unverifiedDomains.length > 1 ? labels.VerifyDomains : labels.VerifyDomain }}</v-btn
        >
      </template>
    </AlertBox>
    <AlertBox
      v-if="canRenderRepeatedOffendersAlertBox"
      class="my-2 mb-6"
      style="background-color: #fafafa; border: 1px solid #e0e0e0;"
      icon-color="#000000"
      icon-name="mdi-account-voice"
      :slots="{ primaryAction: true, secondaryAction: false }"
    >
      <template #text>
        <div class="d-flex flex-column">
          <span style="color: #383b41; font-weight: 600; font-size: 18px;" class="ml-3 mb-1"
            >{{ repeatedOffendersCount }} users repeatedly failed campaigns in last three
            months</span
          >
          <span style="color: #757575; font-size: 14px; margin-left: -24px;"
            >Identify users who repeatedly failed campaigns in the last three months for extra
            training.</span
          >
        </div>
      </template>
      <template #primaryAction>
        <VBtn
          class="fw-600 no-box-shadow"
          color="#2196f3"
          rounded
          outlined
          @click="handleSeeRepeatOffenders"
        >
          See repeat offenders
          <v-icon right dark>
            mdi-account-multiple
          </v-icon>
        </VBtn>
      </template>
    </AlertBox>
    <datatable
      ref="refPeopleTable"
      id="target-users-people-data-table"
      is-server-side
      is-server-side-selection
      filterable
      options
      selectable
      :loading="loading"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :settingsPopupStyle="{ top: '-15px' }"
      :download-button="{ show: true, disabled: false }"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="payload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @handleSelectionChange="handleSelectionChange"
      @deleteAction="handleDelete"
      @editTargetUsers="handleEditTargetUsers"
      @onEmptyBtnClicked="handleClickEmptyBtnClicked"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @handleMultipleDelete="handleMultipleDelete"
      @downloadEvent="exportTargetUserList"
      @refreshAction="callForGetTargetUserCustomFieldsByCompanyId"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @viewUserGroups="handleViewUserGroups"
      @userTimeline="handleUserTimeline"
    >
      <template #selection-all-slot>
        <v-tooltip bottom opacity="1">
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn-selected-hover mr-1"
              icon
              v-on="on"
              @click="handleAddUsersSelectionClick"
            >
              <v-icon class="selection-icons" color="white">mdi-account-plus</v-icon>
            </v-btn>
          </template>
          <span class="tooltip-span">Add users to a group</span>
        </v-tooltip>
      </template>
      <template #addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  :disabled="!getTargetUsersCreatePermissions"
                  id="btn-add--target-users-people"
                  class="button-new"
                  style="margin-right: 10px;"
                  rounded
                  color="#2196f3"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                  <span class="button-new__text">NEW</span>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Add User' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="item in addUsersItems"
              :key="item.id"
              :id="item.id"
              :disabled="item.disabled"
              @click="handleAddUsers(item.text)"
            >
              <v-list-item-title class="add-users__title">{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:settings-popup-body>
        <div
          id="btn-edit--target-user-custom-fields"
          class="edit-fields"
          @click="handleEditFieldsClick"
        >
          EDIT FIELDS
        </div>
      </template>
      <template #empty-table-inline>
        <div class="people__no-data">
          <p id="text--empty-table-title" class="people__no-data__header">
            {{ labels.EmptyTargetUsersPeople }}
          </p>
          <p id="text--empty-table-subtitle" class="people__no-data__body">
            {{ labels.EmptyTargetUsersPeopleSub }}
          </p>
          <div class="people__no-data__buttons">
            <v-menu offset-y transition="scale-transition" nudge-bottom="4">
              <template v-slot:activator="{ on }">
                <div
                  class="people__no-data__buttons--button"
                  v-on="on"
                  id="btn-empty--target-users-people"
                >
                  <v-icon color="#fff" style="margin-top: 1px;" class="mr-1">mdi-plus</v-icon>
                  <span style="font-weight: 600;">NEW</span>
                </div>
              </template>
              <div>
                <v-list dense flat class="people__no-data__buttons--button__list">
                  <v-list-item-group color="primary">
                    <v-list-item @click="handleClickEmptyBtnClicked">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-add-users-manually">
                          Add users manually</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="isWantToImportFile = true">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-import-from-file"
                          >Import from a file</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      :disabled="isLDAPDisabled || !getLDAPCreateConfigPermission"
                      @click="toggleImportLDAPModal"
                    >
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-import-from-ldap"
                          >Import from LDAP</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="handleRedirectToSCIMSync">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-scim-sync"
                          >SCIM Sync</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="handleRedirectToGoogleSync">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-google-sync"
                          >Google Sync</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-menu>
          </div>
        </div>
      </template>
      <template #datatable-custom-column="{ scope, col }">
        <span v-if="col.property === 'manager'">
          {{
            scope.row.managerFirstName || scope.row.managerLastName
              ? `${scope.row.managerFirstName || ''} ${scope.row.managerLastName || ''}`.trim()
              : ''
          }}
        </span>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :id="tableOptions.rowActions[0].id"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleUserTimeline(scope.row)"
        />
        <RowActionsMenu>
          <TargetUserMenuActionsEditButton
            :scope="scope"
            :id="tableOptions.rowActions[1].id"
            @on-click="handleEditTargetUsers"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :id="tableOptions.rowActions[3].id"
            :text="tableOptions.rowActions[3].name"
            :icon="tableOptions.rowActions[3].icon"
            @on-click="handleAddUserToGroup(scope.row)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :id="tableOptions.rowActions[4].id"
            :text="tableOptions.rowActions[4].name"
            :icon="tableOptions.rowActions[4].icon"
            @on-click="handleViewUserGroups(scope.row)"
          />
          <TargetUserRowActionsDeleteButton
            :scope="scope"
            :id="tableOptions.rowActions[2].id"
            @on-delete="handleDelete"
          />
        </RowActionsMenu>
      </template>
    </datatable>
  </div>
</template>

<script>
import { getLeaderboardFormDetails } from '@/api/reports'
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'
import AddUserModal from './AddUserModal'
import labels from '@/model/constants/labels'
import {
  bulkDeleteTargetUsers,
  deleteTargetUser,
  exportTargetUsers,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers,
  searchTargetGroups
} from '@/api/targetUsers'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CustomFieldsModal from './CustomFieldsModal'
import TargetUserImportFromAFile from './TargetUserImportFromAFile'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import TargetUsersViewTargetUserGroups from '@/components/TargetUsers/TargetUsersViewTargetUserGroups'
import {
  columnFilterChanged,
  columnFilterCleared,
  createCustomFieldColumns
} from '@/utils/helperFunctions'
import TargetUserMenuActionsEditButton from '@/components/SmallComponents/RowActions/TargetUserMenuActionsEditButton'
import TargetUserRowActionsDeleteButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsDeleteButton'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import { mapGetters } from 'vuex'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal'
import LDAPService from '@/api/ldap'
import { getUnverifiedDomains } from '@/api/allowList'
import {
  defaultFieldMappings,
  getDefaultFieldMappingsWithCurrent
} from '@/components/Company Settings/LDAP/utils'
import TargetUserCreateGroupWithUserDialog from '@/components/TargetUsers/TargetUserCreateGroupWithUserDialog'
import TargetGroupUsersAddToAnExistingGroupModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal'
import AlertBox from '@/components//AlertBox'
import UnverifiedDomainsModal from '@/components/TargetUsers/UnverifiedDomainsModal'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
export default {
  name: 'People',
  components: {
    GamificationReportUserDetailsDrawer,
    TargetUserLDAPImportModal,
    RowActionsMenu,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    DefaultErrorDialog,
    TargetUserRowActionsDeleteButton,
    TargetUserMenuActionsEditButton,
    TargetUsersViewTargetUserGroups,
    CustomFieldsModal,
    DeleteUserModal,
    Datatable,
    AddUserModal,
    TargetUserImportFromAFile,
    TargetUserCreateGroupWithUserDialog,
    TargetUserAddToAnExistingGroupModal: TargetGroupUsersAddToAnExistingGroupModal,
    AlertBox,
    UnverifiedDomainsModal
  },
  props: {
    companyLicense: {
      type: Object
    }
  },
  emits: ['call-for-company-licenses'],
  data() {
    return {
      languageFilterOptions: [],
      formDetails: null,
      isUserDetailsDrawerOpen: false,
      isUnverifiedDomainsLoading: true,
      unverifiedDomains: [],
      isUnverifiedDomainsModalVisible: false,
      selection: [],
      labels,
      ldapResourceId: '',
      isInitial: true,
      isShowingTargetUserAddToGroup: false,
      isShowImportLDAPModal: false,
      isShowingTargetUserCreateGroupWithUser: false,
      selectedUserToCreateGroupWith: null,
      selectedUserToAddToGroup: null,
      selectedUserToViewGroups: null,
      payload: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      targetGroupsPayload: getDefaultAxiosPayload(),
      repeatedOffendersCount: 0,
      repeatedOffendersGroup: null,
      isWantToImportFile: false,
      isShowingTargetUserViewTargetGroups: false,
      tableData: [],
      loading: true,
      bulkDeleteErrorMessage: '',
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      multipleTargetUserPayload: {},
      bulkImportPayload: {},
      isWantToShowDeleteUserModal: false,
      selectedRow: null,
      customFields: [],
      isWantToShowAddUsersModal: false,
      isWantToShowCustomFieldsModal: false,
      deleteButtonDisabled: false,
      isLDAPDisabled: false,
      ldapFieldMappings: [],
      tableOptions: {
        lastColumns: [
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            width: 150,
            fullWidth: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            dbName: 'Priority'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 150,
            isEditable: true,
            hasTooltip: true,
            fullWidth: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.STATUS_ITEMS,
            dbName: 'Status'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'date',
            dbName: 'CreateTime'
          }
        ],
        columns: [],
        defaultColumns: [
          // Should be defined to show the table
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            fixed: 'left',
            sortable: true,
            show: true,
            width: 140,
            type: 'text',
            filterableType: 'text',
            dbName: 'FirstName'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'text',
            dbName: 'LastName'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            width: 275,
            filterableType: 'text',
            dbName: 'Email'
          },
          {
            property: PROPERTY_STORE.PHONENUMBER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text',
            dbName: 'PhoneNumber'
          },
          {
            property: PROPERTY_STORE.DEPARTMENT,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'text',
            dbName: 'Department'
          },
          {
            property: 'preferredLanguage',
            align: 'left',
            editable: false,
            label: labels.PreferredLanguage,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 200,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'preferredLanguageId'
          },
          {
            property: PROPERTY_STORE.TIME_ZONE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TIME_ZONE),
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'select',
            filterableItems: [],
            dbName: 'TimeZone',
            filterableCustomFieldName: 'TimeZoneId'
          },
          {
            property: 'manager',
            align: 'left',
            editable: false,
            label: 'Manager',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'slot',
            width: 200,
            filterableType: 'text',
            dbName: 'ManagerFirstName'
          },
          {
            property: 'managerEmail',
            align: 'left',
            editable: false,
            label: 'Manager Email',
            sortable: true,
            show: true,
            type: 'text',
            width: 250,
            filterableType: 'text',
            dbName: 'ManagerEmail'
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TARGET_USERS_PEOPLE,
        downloadButton: {
          show: true
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_USER_ADDED,
          btn: 'ADD A USER',
          id: 'btn-empty--target-users-people',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addButton',
          id: 'btn-add--target-users-people'
        },
        rowActions: [
          {
            name: 'User Activity Timeline',
            icon: 'mdi-account-clock',
            action: 'userTimeline',
            id: 'btn-user-timeline--target-users-people-row-actions',
            isNotShow: true
          },
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editTargetUsers',
            id: 'btn-edit--target-users-people-row-actions',
            isNotShow: true,
            disabled: !this.$store.getters['permissions/getTargetUsersEditPermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--target-users-people-row-actions',
            disabled: !this.$store.getters['permissions/getTargetUsersDeletePermissions']
          },
          {
            name: 'Add user to group',
            id: 'btn-add-users-to-group--target-users-people-row-actions',
            icon: 'mdi-account-multiple-plus',
            action: 'add-user-to-group'
          },
          {
            name: 'View user’s groups',
            icon: 'mdi-account-supervisor-outline',
            action: 'viewUserGroups',
            id: 'btn-view--target-users-people-row-actions'
          }
        ]
      },
      addUsersItems: [
        {
          text: 'Add users manually',
          id: 'btn-add-users-manually--target-users-people'
        },
        {
          text: 'Import from a file',
          id: 'btn-add-users-import-from-file--target-users-people'
        },
        {
          text: 'Import from LDAP',
          id: 'btn-add-users-import-from-ldap--target-users-people',
          disabled:
            this.isLDAPDisabled || !this.$store.getters['permissions/getLDAPCreateConfigPermission']
        },
        { text: 'SCIM Sync', id: 'btn-scim-sync--target-users-people' },
        {
          text: 'Google Sync',
          id: 'btn-google-sync--target-users-people'
        }
      ],
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getTargetUsersCreatePermissions: 'permissions/getTargetUsersCreatePermissions',
      getLDAPCreateConfigPermission: 'permissions/getLDAPCreateConfigPermission',
      getLDAPDetailPermission: 'permissions/getLDAPDetailPermission',
      getTimezones: 'common/getTimezones'
    }),
    getDatePayload() {
      return {
        datePeriod: 4,
        startDate: null,
        endDate: null
      }
    },
    getSelectedRow() {
      if (this.selectedUserToAddToGroup.constructor.name === 'Array') {
        return this.selectedUserToAddToGroup
      }
      return [this.selectedUserToAddToGroup]
    },
    getUnverifiedDomainsText() {
      if (this.unverifiedDomains?.length) {
        return `There ${this.unverifiedDomains.length > 1 ? 'are' : 'is'} ${
          this.unverifiedDomains.length > 1 ? this.unverifiedDomains.length : ''
        } unverified ${
          this.unverifiedDomains.length > 1 ? 'domains' : 'domain'
        }. Please verify the domains in order to send emails.`
      }
      return ''
    },
    canRenderAlertbox() {
      return !this.isUnverifiedDomainsLoading && this.unverifiedDomains?.length > 0
    },
    canRenderRepeatedOffendersAlertBox() {
      return this.repeatedOffendersCount > 0
    }
  },
  watch: {
    getTimezones: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.timeZoneList?.length) this.setTimeZoneFilterableItems()
      }
    }
  },
  created() {
    this.callForLanguages()
    this.callForFormDetails()
    this.callForGetTargetUserCustomFieldsByCompanyId()
    this.callForGetTimeZones()
    this.callForTargetGroups()
    if (this.getLDAPDetailPermission) this.checkIsLDAPConfigured()
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageFilterOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            name: language.name,
            value: language.resourceId
          })) || []
        this.$set(
          this.tableOptions.defaultColumns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageFilterOptions
        )
      })
    },
    callForFormDetails() {
      getLeaderboardFormDetails().then((res) => {
        this.formDetails = res?.data?.data || []
      })
    },
    handleUserTimeline(row) {
      this.selectedRow = row
      this.isUserDetailsDrawerOpen = true
    },
    handleCloseDrawer() {
      document.querySelector('.k-navigation-drawer').style.right = '-100%'
      setTimeout(() => {
        this.selectedRow = null
        this.isUserDetailsDrawerOpen = false
      }, 250)
    },
    handleRedirectToSCIMSync() {
      this.$router.push('/company/company-settings?tab=scim-settings&showModal=true')
    },
    handleRedirectToGoogleSync() {
      this.$router.push('/company/company-settings?tab=google-user-provisioning')
    },
    handleSeeRepeatOffenders() {
      if (this.repeatedOffendersGroup)
        this.$router.push({
          name: 'Target Group Users',
          params: {
            id: this.repeatedOffendersGroup.resourceId,
            label: this.repeatedOffendersGroup.name,
            isGroupEditable: this.repeatedOffendersGroup.isEditable
          }
        })
    },
    callForTargetGroups() {
      searchTargetGroups(this.targetGroupsPayload, true).then((res) => {
        const repeatedOffendersIndex = res?.data?.data?.results?.findIndex?.(
          (group) => group.name === 'Repeat Offenders'
        )
        if (repeatedOffendersIndex !== -1) {
          this.repeatedOffendersCount = res.data.data.results[repeatedOffendersIndex].userCount
          this.repeatedOffendersGroup = {
            ...res.data.data.results[repeatedOffendersIndex]
          }
        }
      })
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    setTimeZoneFilterableItems() {
      const filterableItems = this.getTimezones?.timeZoneList?.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
      filterableItems.unshift({ text: 'Blank', value: 'Blank' })
      this.$set(
        this.tableOptions.defaultColumns.find((col) => col.property === PROPERTY_STORE.TIME_ZONE),
        'filterableItems',
        filterableItems
      )
      this?.$refs?.refPeopleTable?.reRenderFilters()
    },
    checkIsLDAPConfigured() {
      LDAPService.getLDAPSettingDetailForMyCompany()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.ldapResourceId = data?.resourceId
          this.ldapFieldMappings = getDefaultFieldMappingsWithCurrent(
            defaultFieldMappings,
            data?.fieldMappings
          )
          this.isLDAPDisabled = !data.isActive
        })
        .catch(() => {
          this.isLDAPDisabled = true
        })
        .finally(() => {
          if (this.isLDAPDisabled) {
            this.addUsersItems.splice(2, 1, {
              ...this.addUsersItems[2],
              disabled: true
            })
          }
        })
    },
    toggleImportLDAPModal() {
      this.isShowImportLDAPModal = !this.isShowImportLDAPModal
    },
    handleViewUserGroups(selectedRow = {}) {
      this.selectedUserToViewGroups = selectedRow
      this.toggleShowingTargetUserViewTargetGroups()
    },
    handleAddUserToGroup(selectedRow = {}) {
      this.selectedUserToAddToGroup = selectedRow
      this.bulkImportPayload = {
        targetUserResourceIds: [selectedRow.resourceId],
        selectAll: false,
        excludedResourceIdList: [],
        filter: this.payload.filter,
        selectedRowCount: 1
      }
      this.toggleShowingTargetUserAddToGroup()
    },
    handleConfirmAddUserToGroup(groups = []) {
      this.selectedUserToAddToGroup = null
      this.toggleShowingTargetUserAddToGroup()
    },
    handleConfirmCreateUserWithGroup(groupName = '') {
      this.selectedUserToCreateGroupWith = null
      this.toggleShowingTargetUserCreateGroupWithUser()
    },
    handleCreateGroupWithUser(selectedRow = {}) {
      this.selectedUserToCreateGroupWith = selectedRow
      this.toggleShowingTargetUserCreateGroupWithUser()
    },
    toggleShowingTargetUserViewTargetGroups() {
      this.isShowingTargetUserViewTargetGroups = !this.isShowingTargetUserViewTargetGroups
    },
    toggleShowingTargetUserAddToGroup() {
      if (this.isShowingTargetUserAddToGroup) {
        this.selectedUserToAddToGroup = null
        this.bulkImportPayload = {
          targetUserResourceIds: [],
          selectAll: false,
          excludedResourceIdList: [],
          filter: this.payload.filter,
          selectedRowCount: 0
        }
      }
      this.isShowingTargetUserAddToGroup = !this.isShowingTargetUserAddToGroup
    },
    toggleShowingTargetUserCreateGroupWithUser() {
      if (this.isShowingTargetUserCreateGroupWithUser) {
        this.selectedUserToCreateGroupWith = null
      }
      this.isShowingTargetUserCreateGroupWithUser = !this.isShowingTargetUserCreateGroupWithUser
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      if (prop === 'timeZone') {
        prop = 'TimeZoneId'
      }
      this.payload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    columnFilterChanged(filter) {
      this.resetPageNumber()
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleSearchChange(searchFilter = {}) {
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      const timeZoneIndex = this.payload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'TimeZone'
      )
      if (timeZoneIndex !== -1) {
        this.payload.filter.FilterGroups[1].FilterItems.splice(timeZoneIndex, 1)
      }
      const preferredLanguageIndex = this.payload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'PreferredLanguage'
      )
      if (preferredLanguageIndex !== -1) {
        this.payload.filter.FilterGroups[1].FilterItems.splice(preferredLanguageIndex, 1)
      }
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    closeImportModal() {
      this.isWantToImportFile = false
    },
    toggleCustomFieldsModal() {
      this.isWantToShowCustomFieldsModal = !this.isWantToShowCustomFieldsModal
    },
    handleAddUsers(item) {
      if (item === this.addUsersItems[0].text) {
        this.selectedRow = null
        this.isWantToShowAddUsersModal = true
      }
      if (item === this.addUsersItems[1].text) {
        this.isWantToImportFile = true
      }
      if (item === this.addUsersItems[2].text) {
        this.toggleImportLDAPModal()
      }
      if (item === this.addUsersItems[3].text) {
        this.handleRedirectToSCIMSync()
      }
      if (item === this.addUsersItems[4].text) {
        this.handleRedirectToGoogleSync()
      }
    },
    handleClickEmptyBtnClicked() {
      this.selectedRow = null
      this.isWantToShowAddUsersModal = true
    },
    closeCustomFieldsModalWithUpdate() {
      this.toggleCustomFieldsModal()
      this.callForGetTargetUserCustomFieldsByCompanyId(true)
    },
    closeAddUserModalWithUpdate(showMainModal = false) {
      this.isWantToShowAddUsersModal = false
      this.$emit('call-for-company-licenses', showMainModal)
      this.callForTargetUsers()
    },
    handleEditTargetUsers(selectedRow) {
      this.selectedRow = selectedRow
      this.isWantToShowAddUsersModal = true
    },
    handleEditFieldsClick() {
      if (this.$refs && this.$refs.refPeopleTable) {
        this.$refs.refPeopleTable.toggleIsSettingsOpened()
      }
      this.toggleCustomFieldsModal()
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedUserCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleTargetUserPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.payload.filter
      }
      this.changeDeleteModalStatus(true)
    },
    handleDelete(row) {
      this.isMultipleDelete = false
      this.changeDeleteModalStatus(true)
      this.selectedRow = row
    },
    checkIfCanCloseAddUserModal() {
      if (this.$refs.addUserModal) {
        this.$refs.addUserModal.closeOverlay()
      }
    },
    closeAddUserModal() {
      this.isWantToShowAddUsersModal = false
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status
      if (!status) {
        this.selectedRow = null
        this.multipleTargetUserPayload = {}
        this.isMultipleDelete = false
        this.multipleDeletedUserCount = 0
      }
    },
    handleDeleteUsers() {
      this.callForMultipleDelete()
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true
      this.loading = true
      bulkDeleteTargetUsers(this.multipleTargetUserPayload)
        .then(() => {
          this?.$refs?.refPeopleTable?.resetSelectableParams()
          this.callForTargetUsers()
          this.changeDeleteModalStatus(false)
        })
        .catch((error) => {
          this.bulkDeleteErrorMessage = error?.response?.data?.message
        })
        .finally(() => {
          this.loading = false
          this.deleteButtonDisabled = false
        })
    },
    handleDeleteUser(selectedUser, selections) {
      this.loading = true
      deleteTargetUser(selectedUser.resourceId).then((response) => {
        if (response.data && response.data.message) {
          if (
            this.$refs.refPeopleTable.multipleSelection.find(
              (item) => item.resourceId === selectedUser.resourceId
            )
          ) {
            this?.$refs?.refPeopleTable?.$refs?.elTableRef?.toggleRowSelection(selectedUser, false)
            this.$refs.refPeopleTable.serverSideSelectionCount -= 1
          }
          if (selections?.[selections.length - 1]?.resourceId === selectedUser?.resourceId) {
            this.$emit('call-for-company-licenses')
            this.callForTargetUsers()
          }
          this.callForTargetUsers()
        }
      })
    },
    callForTargetUsers() {
      this.loading = true
      getTargetUsers(this.payload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber, results } =
            response?.data?.data || {}
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results?.map((item) => {
            return {
              ...item,
              preferredLanguage: this.languageFilterOptions.find(
                (language) => language.name === item.preferredLanguage
              )?.text
            }
          })
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => {
          this.loading = false
        })
      this.getUnverifiedDomains()
    },
    callForGetTargetUserCustomFieldsByCompanyId(forceUpdate = false) {
      this.loading = true
      if (!this.isInitial && !this.customFields.length && !forceUpdate) {
        return this.callForTargetUsers()
      }
      this.isInitial = false
      if (this.customFields.length && !forceUpdate) {
        this.callForTargetUsers()
      } else {
        getTargetUserCustomFieldsByCompanyId()
          .then((response) => {
            const { data } = response
            this.customFields = data.data.filter((item) => {
              return item.isActive
            })
            const sortProp = 'sortOrder'
            this.customFields.sort((a, b) => {
              if (a[sortProp] > b[sortProp]) {
                return 1
              } else if (a[sortProp] === b[sortProp]) {
                return 0
              }
              return -1
            })

            const columnsOfCustomFields = createCustomFieldColumns(this.customFields)

            const newColumns = [
              ...this.tableOptions.defaultColumns,
              ...columnsOfCustomFields,
              ...this.tableOptions.lastColumns
            ]

            if (this.tableOptions.columns.length) {
              this.tableOptions.columns.forEach((column) => {
                const findedColumn = newColumns.find(
                  (newColumn) => newColumn.property === column.property
                )
                if (!findedColumn) {
                  return
                }
                findedColumn.show = column.show
              })
            }
            const renderedColumns = this?.$refs.refPeopleTable?.renderedColumns
            if (renderedColumns?.length) {
              newColumns.forEach((column) => {
                const item = renderedColumns.find(
                  (renderedColumnProp) => renderedColumnProp === column.property
                )
                column.show = !!item
              })
            }
            this.tableOptions.columns = newColumns
          })
          .catch(() => {
            this.tableOptions.columns = [
              ...this.tableOptions.defaultColumns,
              ...this.tableOptions.lastColumns
            ]
          })
          .finally(() => {
            this.callForTargetUsers()
          })
      }
    },
    exportTargetUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.payload.filter
        }
        exportTargetUsers(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Users.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    closeAddToAnExistingGroupModalWithUpdate() {
      this.toggleShowingTargetUserAddToGroup()
      const refTable = this.$refs.refPeopleTable
      if (refTable) {
        refTable.$refs.elTableRef.clearSelection()
        refTable.serverSideSelectionCount = 0
        refTable.excludedResourceIdList = []
        refTable.isSelectedAllEver = false
      }
      this.callForGetTargetUserCustomFieldsByCompanyId(true)
    },
    handleSelectionChange(selection = []) {
      this.selection = selection
    },
    handleAddUsersSelectionClick() {
      this.selectedUserToAddToGroup = this.selection
      const serverSideParams = this.$refs?.refPeopleTable?.getServerSideSelectionParams() || {
        isSelectedAllEver: false,
        excludedResourceIdList: []
      }
      this.bulkImportPayload = {
        targetUserResourceIds: serverSideParams?.isSelectedAllEver
          ? []
          : this.selection.map((item) => item.resourceId),
        selectAll: serverSideParams?.isSelectedAllEver || false,
        excludedResourceIdList: serverSideParams?.excludedResourceIdList || [],
        filter: this.payload.filter,
        selectedRowCount: serverSideParams?.isSelectedAllEver
          ? this.serverSideProps.totalNumberOfRecords -
            serverSideParams?.excludedResourceIdList.length
          : this.selection.length
      }
      this.toggleShowingTargetUserAddToGroup()
    },
    getUnverifiedDomains() {
      this.isUnverifiedDomainsLoading = true
      getUnverifiedDomains()
        .then((response) => {
          this.unverifiedDomains = response?.data?.data || []
        })
        .catch(() => {
          this.unverifiedDomains = []
        })
        .finally(() => {
          this.isUnverifiedDomainsLoading = false
        })
    },
    changeUnverifiedDomainsModalStatus(status = false) {
      this.isUnverifiedDomainsModalVisible = status
    },
    handleSecondaryAction() {
      this.changeUnverifiedDomainsModalStatus(true)
    },
    handlePrimaryAction() {
      this.$router.push('/company/company-settings?tab=allowed-list')
    }
  }
}
</script>
