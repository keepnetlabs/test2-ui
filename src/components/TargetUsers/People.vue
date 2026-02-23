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
    <TargetUsersSummaryCards
      :items="summaryCardItems"
      :active-key="activeSummaryKeys"
      :loading="summaryLoading"
      @select="handleSummaryCardSelect"
      @period-select="handleMonthlyPeriodSelect"
    />
    <AlertBox
      v-if="canRenderAlertbox"
      class="mb-6"
      :text="getUnverifiedDomainsText"
      :slots="{ primaryAction: true, secondaryAction: true }"
    >
      <template #secondaryAction>
        <v-btn
          class="people__alert-box__secondary-action"
          rounded
          @click="handleSecondaryAction"
        >
          {{
            unverifiedDomains.length > 1 ? labels.SeeDomains : labels.SeeDomain
          }}</v-btn
        >
      </template>
      <template #primaryAction>
        <v-btn
          class="people__alert-box__primary-action"
          rounded
          @click="handlePrimaryAction"
        >
          {{
            unverifiedDomains.length > 1
              ? labels.VerifyDomains
              : labels.VerifyDomain
          }}</v-btn
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
          <span
            style="color: #383b41; font-weight: 600; font-size: 18px;"
            class="ml-3 mb-1"
            >{{ repeatedOffendersCount }} users repeatedly failed campaigns in
            last three months</span
          >
          <span style="color: #757575; font-size: 14px; margin-left: -24px;"
            >Identify users who repeatedly failed campaigns in the last three
            months for extra training.</span
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
      :handle-set-cell-class="getDeletedRowCellClass"
      :get-cell-tooltip-text="getDeletedRowTooltipText"
      :add-row-class-name="getDeletedRowClassName"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="payload"
      :saved-filters-local-storage-key="
        tableOptions.savedFiltersLocalStorageKey
      "
      :saved-table-settings-local-storage-key="
        tableOptions.savedTableSettingsLocalStorageKey
      "
      @handleSelectionChange="handleSelectionChange"
      @deleteAction="handleDelete"
      @editTargetUsers="handleEditTargetUsers"
      @onEmptyBtnClicked="handleClickEmptyBtnClicked"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @handleMultipleDelete="handleMultipleDelete"
      @downloadEvent="exportTargetUserList"
      @clear-filters="handleClearFilters"
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
            <span v-on="on">
              <v-btn
                class="btn-selected-hover mr-1"
                icon
                :style="getAddUsersButtonStyle"
                @click="handleAddUsersSelectionClick"
              >
                <v-icon class="selection-icons" color="white"
                  >mdi-account-plus</v-icon
                >
              </v-btn>
            </span>
          </template>
          <span class="tooltip-span">{{ addUsersTooltip }}</span>
        </v-tooltip>
        <v-tooltip bottom opacity="1">
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-btn
                class="btn-selected-hover mr-1"
                icon
                :style="getDeleteSelectionButtonStyle"
                @click="handleDeleteSelectionClick"
              >
                <v-icon class="selection-icons" color="white"
                  >mdi-delete</v-icon
                >
              </v-btn>
            </span>
          </template>
          <span class="tooltip-span">{{ deleteSelectionTooltip }}</span>
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
                  <v-icon style="font-size: 20px; margin-top: 1px;"
                    >mdi-plus</v-icon
                  >
                  <span class="button-new__text">NEW</span>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ "Add User" }}</span>
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
              <v-list-item-title class="add-users__title">{{
                item.text
              }}</v-list-item-title>
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
                  id="btn-empty--target-users-people-page"
                >
                  <v-icon color="#fff" style="margin-top: 1px;" class="mr-1"
                    >mdi-plus</v-icon
                  >
                  <span style="font-weight: 600;">NEW</span>
                </div>
              </template>
              <div>
                <v-list
                  dense
                  flat
                  class="people__no-data__buttons--button__list"
                >
                  <v-list-item-group color="primary">
                    <v-list-item @click="handleClickEmptyBtnClicked">
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--target-user-empty-add-users-manually"
                        >
                          Add users manually</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="isWantToImportFile = true">
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--target-user-empty-import-from-file"
                          >Import from a file</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      :disabled="
                        isLDAPDisabled || !getLDAPCreateConfigPermission
                      "
                      @click="toggleImportLDAPModal"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--target-user-empty-import-from-ldap"
                          >Import from LDAP</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="handleRedirectToSCIMSync">
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--target-user-empty-scim-sync"
                          >SCIM Sync</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="handleRedirectToGoogleSync">
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--target-user-empty-google-sync"
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
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :id="tableOptions.rowActions[0].id"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="
            tableOptions.rowActions[0].disabled || isRowTypeDeleted(scope.row)
          "
          :disabledTooltipText="
            isRowTypeDeleted(scope.row)
              ? getDeletedRowActionsTooltipText()
              : null
          "
          @on-click="handleUserTimeline(scope.row)"
        />

        <DefaultButtonRowAction
          v-if="isRowTypeDeleted(scope.row)"
          :id="`btn-more--target-user-${scope.$index}`"
          :scope="scope"
          :checkIsOwnerProperty="false"
          icon="mdi-dots-vertical"
          text="More"
          :disabled="true"
          :disabledTooltipText="getDeletedRowActionsTooltipText()"
        />
        <RowActionsMenu v-else>
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
import { getLeaderboardFormDetails } from "@/api/reports";
import Datatable from "../../components/DataTable";
import DeleteUserModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import labels from "@/model/constants/labels";
import {
  bulkDeleteTargetUsers,
  deleteTargetUser,
  exportTargetUsers,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsersCountSummary,
  getTargetUsers,
  searchTargetGroups
} from "@/api/targetUsers";
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from "@/model/constants/commonConstants";
import CustomFieldsModal from "./CustomFieldsModal";
import TargetUserImportFromAFile from "./TargetUserImportFromAFile";
import { getDefaultAxiosPayload } from "@/utils/functions";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import TargetUsersViewTargetUserGroups from "@/components/TargetUsers/TargetUsersViewTargetUserGroups";
import {
  columnFilterChanged,
  columnFilterCleared,
  createCustomFieldColumns
} from "@/utils/helperFunctions";
import TargetUserMenuActionsEditButton from "@/components/SmallComponents/RowActions/TargetUserMenuActionsEditButton";
import TargetUserRowActionsDeleteButton from "@/components/SmallComponents/RowActions/TargetUserRowActionsDeleteButton";
import DefaultErrorDialog from "@/components/Common/Others/DefaultErrorDialog";
import moment from "moment";
import { mapGetters } from "vuex";
import DefaultMenuRowAction from "@/components/SmallComponents/RowActions/DefaultMenuRowAction";
import RowActionsMenu from "@/components/SmallComponents/RowActions/RowActionsMenu";
import TargetUserLDAPImportModal from "@/components/TargetUsers/LDAP/TargetUserLDAPImportModal";
import LDAPService from "@/api/ldap";
import { getUnverifiedDomains } from "@/api/allowList";
import {
  defaultFieldMappings,
  getDefaultFieldMappingsWithCurrent
} from "@/components/Company Settings/LDAP/utils";
import TargetUserCreateGroupWithUserDialog from "@/components/TargetUsers/TargetUserCreateGroupWithUserDialog";
import TargetGroupUsersAddToAnExistingGroupModal from "@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal";
import AlertBox from "@/components//AlertBox";
import UnverifiedDomainsModal from "@/components/TargetUsers/UnverifiedDomainsModal";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import GamificationReportUserDetailsDrawer from "@/components/GamificationReport/GamificationReportUserDetailsDrawer";
import LookupLocalStorage from "@/helper-classes/lookup-local-storage";
import TargetUsersSummaryCards from "@/components/TargetUsers/TargetUsersSummaryCards";
import ActiveTargetUserIcon from "@/assets/img/target-users/Active.svg";
import InactiveTargetUserIcon from "@/assets/img/target-users/Inactive.svg";
import DeletedTargetUserIcon from "@/assets/img/target-users/Deleted.svg";
import MonthlyTargetUserIcon from "@/assets/img/target-users/Monthly.svg";
export default {
  name: "People",
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
    UnverifiedDomainsModal,
    TargetUsersSummaryCards
  },
  props: {
    companyLicense: {
      type: Object
    }
  },
  emits: ["call-for-company-licenses"],
  data() {
    return {
      summaryLoading: true,
      summaryCounts: {
        active: 0,
        inactive: 0,
        deleted: 0,
        monthly: 0
      },
      monthlyPeriodLabel: "",
      monthlyActiveUsers: [],
      monthlySelectedIndex: 0,
      monthlyPeriodKey: "",
      activeSummaryKeys: [],
      languageFilterOptions: [],
      formDetails: null,
      isUserDetailsDrawerOpen: false,
      isUnverifiedDomainsLoading: true,
      unverifiedDomains: [],
      isUnverifiedDomainsModalVisible: false,
      selection: [],
      labels,
      ldapResourceId: "",
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
      bulkDeleteErrorMessage: "",
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
            align: "center",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: "priority",
            width: 150,
            fullWidth: true,
            filterableType: "select",
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            dbName: "Priority"
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: "center",
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: "status",
            width: 150,
            isEditable: true,
            hasTooltip: true,
            fullWidth: true,
            filterableType: "select",
            filterableItems: [
              { text: labels.Active, value: "1" },
              { text: labels.InActive, value: "0" },
              { text: "Deleted", value: "Deleted" }
            ],
            dbName: "Status"
          },
          {
            property: "updateTime",
            align: "left",
            editable: false,
            label: "Status Updated",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            width: 180,
            filterableType: "date",
            dbName: "UpdateTime"
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            width: 180,
            filterableType: "date",
            dbName: "CreateTime"
          }
        ],
        columns: [],
        defaultColumns: [
          // Should be defined to show the table
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            fixed: "left",
            sortable: true,
            show: true,
            width: 140,
            type: "text",
            filterableType: "text",
            dbName: "FirstName"
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: "text",
            width: 150,
            filterableType: "text",
            dbName: "LastName"
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: "text",
            width: 275,
            filterableType: "text",
            dbName: "Email"
          },
          {
            property: PROPERTY_STORE.PHONENUMBER,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            type: "text",
            width: 200,
            filterableType: "text",
            dbName: "PhoneNumber"
          },
          {
            property: PROPERTY_STORE.DEPARTMENT,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
            sortable: true,
            show: true,
            type: "text",
            width: 160,
            filterableType: "text",
            dbName: "Department"
          },
          {
            property: "preferredLanguage",
            align: "left",
            editable: false,
            label: labels.PreferredLanguage,
            sortable: true,
            show: true,
            type: "text",
            fixed: false,
            width: 200,
            filterableType: "select",
            filterableItems: [],
            filterableCustomFieldName: "preferredLanguageId"
          },
          {
            property: PROPERTY_STORE.TIME_ZONE,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TIME_ZONE),
            sortable: false,
            hideSort: true,
            show: true,
            type: "text",
            width: 160,
            filterableType: "select",
            filterableItems: [],
            dbName: "TimeZone",
            filterableCustomFieldName: "TimeZoneId"
          },
          {
            property: "managerFullName",
            align: "left",
            editable: false,
            label: "Manager",
            sortable: true,
            show: true,
            type: "text",
            width: 200,
            filterableType: "text",
            dbName: "ManagerFullName"
          },
          {
            property: "managerEmail",
            align: "left",
            editable: false,
            label: "Manager Email",
            sortable: true,
            show: true,
            type: "text",
            width: 250,
            filterableType: "text",
            dbName: "ManagerEmail"
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.TARGET_USERS_PEOPLE,
        downloadButton: {
          show: true
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_USER_ADDED,
          btn: "ADD A USER",
          id: "btn-empty--target-users-people-datatable",
          icon: "mdi-account-plus"
        },
        addButton: {
          show: true,
          action: "addButton",
          id: "btn-add--target-users-people"
        },
        rowActions: [
          {
            name: "User Activity Timeline",
            icon: "mdi-account-clock",
            action: "userTimeline",
            id: "btn-user-timeline--target-users-people-row-actions",
            isNotShow: true
          },
          {
            name: "Edit this row",
            icon: "mdi-pencil",
            action: "editTargetUsers",
            id: "btn-edit--target-users-people-row-actions",
            isNotShow: true,
            disabled: !this.$store.getters[
              "permissions/getTargetUsersEditPermissions"
            ]
          },
          {
            name: "Delete",
            icon: "mdi-delete",
            action: "deleteAction",
            id: "btn-delete--target-users-people-row-actions",
            disabled: !this.$store.getters[
              "permissions/getTargetUsersDeletePermissions"
            ]
          },
          {
            name: "Add user to group",
            id: "btn-add-users-to-group--target-users-people-row-actions",
            icon: "mdi-account-multiple-plus",
            action: "add-user-to-group"
          },
          {
            name: "View user’s groups",
            icon: "mdi-account-supervisor-outline",
            action: "viewUserGroups",
            id: "btn-view--target-users-people-row-actions"
          }
        ]
      },
      addUsersItems: [
        {
          text: "Add users manually",
          id: "btn-add-users-manually--target-users-people"
        },
        {
          text: "Import from a file",
          id: "btn-add-users-import-from-file--target-users-people"
        },
        {
          text: "Import from LDAP",
          id: "btn-add-users-import-from-ldap--target-users-people",
          disabled:
            this.isLDAPDisabled ||
            !this.$store.getters["permissions/getLDAPCreateConfigPermission"]
        },
        { text: "SCIM Sync", id: "btn-scim-sync--target-users-people" },
        {
          text: "Google Sync",
          id: "btn-google-sync--target-users-people"
        }
      ],
      serverSideProps: new ServerSideProps()
    };
  },
  computed: {
    ...mapGetters({
      getTargetUsersCreatePermissions:
        "permissions/getTargetUsersCreatePermissions",
      getLDAPCreateConfigPermission:
        "permissions/getLDAPCreateConfigPermission",
      getLDAPDetailPermission: "permissions/getLDAPDetailPermission",
      getTimezones: "common/getTimezones"
    }),
    summaryCardItems() {
      const { active, inactive, deleted, monthly } = this.summaryCounts;
      const monthlyOptions = this.monthlyActiveUsers || [];
      const selectedMonthly = monthlyOptions[this.monthlySelectedIndex] || {};
      const monthlySubtitle = selectedMonthly.period || this.monthlyPeriodLabel;
      const monthlyCount = selectedMonthly.count || monthly;
      return [
        {
          key: "active",
          title: "Active Users",
          value: active,
          tooltip:
            "Users who are active and can receive emails and be tracked on the platform.",
          color: "success",
          iconType: "image",
          icon: ActiveTargetUserIcon,
          disabled: !this.summaryLoading && active === 0
        },
        {
          key: "inactive",
          title: "Inactive Users",
          value: inactive,
          tooltip:
            "Users temporarily disabled on the platform, with delivery paused and data retained.",
          color: "warning",
          iconType: "image",
          icon: InactiveTargetUserIcon,
          disabled: !this.summaryLoading && inactive === 0
        },
        {
          key: "deleted",
          title: "Deleted Users",
          value: deleted,
          tooltip:
            "Users removed from active use on the platform, with historical data retained.",
          color: "error",
          iconType: "image",
          icon: DeletedTargetUserIcon,
          disabled: !this.summaryLoading && deleted === 0
        },
        {
          key: "monthly",
          title: "Monthly Users",
          subtitle: monthlySubtitle,
          value: monthlyCount,
          tooltip:
            "Users added to the platform during the selected month, regardless of their current status.",
          color: "info",
          iconType: "image",
          icon: MonthlyTargetUserIcon,
          menuOptions: monthlyOptions,
          disabled: !this.summaryLoading && monthlyCount === 0
        }
      ];
    },
    getDatePayload() {
      return {
        datePeriod: 4,
        startDate: null,
        endDate: null
      };
    },
    getSelectedRow() {
      if (this.selectedUserToAddToGroup.constructor.name === "Array") {
        return this.selectedUserToAddToGroup;
      }
      return [this.selectedUserToAddToGroup];
    },
    getUnverifiedDomainsText() {
      if (this.unverifiedDomains?.length) {
        return `There ${this.unverifiedDomains.length > 1 ? "are" : "is"} ${
          this.unverifiedDomains.length > 1 ? this.unverifiedDomains.length : ""
        } unverified ${
          this.unverifiedDomains.length > 1 ? "domains" : "domain"
        }. Please verify the domains in order to send emails.`;
      }
      return "";
    },
    canRenderAlertbox() {
      return (
        !this.isUnverifiedDomainsLoading && this.unverifiedDomains?.length > 0
      );
    },
    canRenderRepeatedOffendersAlertBox() {
      return this.repeatedOffendersCount > 0;
    },
    hasDeletedSelection() {
      return this.selection.some((item) => {
        if (item?.isDeleted) return true;
        return String(item?.status || "").trim().toLowerCase() === "deleted";
      });
    },
    getAddUsersButtonStyle() {
      if (!this.hasDeletedSelection) return null;
      return {
        opacity: 0.5,
        pointerEvents: "none"
      };
    },
    addUsersTooltip() {
      if (!this.hasDeletedSelection) return "Add users to a group";
      return "Deleted users cannot be added to a group.";
    },
    getDeleteSelectionButtonStyle() {
      if (!this.hasDeletedSelection) return null;
      return {
        opacity: 0.5,
        pointerEvents: "none"
      };
    },
    deleteSelectionTooltip() {
      if (!this.hasDeletedSelection) return "Delete";
      return "Deleted users cannot be deleted.";
    }
  },
  watch: {
    getTimezones: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.timeZoneList?.length) this.setTimeZoneFilterableItems();
      }
    },
    "payload.filter.FilterGroups": {
      deep: true,
      immediate: true,
      handler() {
        this.syncSummaryKeysFromPayload();
      }
    }
  },
  created() {
    this.callForLanguages();
    this.callForFormDetails();
    this.callForGetTargetUserCustomFieldsByCompanyId();
    this.callForGetTimeZones();
    this.callForTargetGroups();
    this.callForTargetUsersCountSummary();
    this.toggleStatusFilterVisibility(true);
    if (this.getLDAPDetailPermission) this.checkIsLDAPConfigured();
  },
  methods: {
    getDeletedRowClassName({ row } = {}) {
      return this.isRowTypeDeleted(row) ? " people__deleted-row" : "";
    },
    getDeletedRowCellClass({ row, column } = {}) {
      if (!this.isRowTypeDeleted(row)) return "";
      if (column?.property === PROPERTY_STORE.STATUS) return "";
      return "people__deleted-row-cell";
    },
    getDeletedRowTooltipText({ row, column } = {}) {
      if (!this.isRowTypeDeleted(row)) return "";
      if (!column?.property || column.property === PROPERTY_STORE.STATUS) {
        return "";
      }
      return "This user has been deleted";
    },
    isRowTypeDeleted(row) {
      if (row?.isDeleted) return true;
      return String(row?.status || "").trim().toLowerCase() === "deleted";
    },
    getDeletedRowActionsTooltipText() {
      return "Historical activity data is retained and will be available here in an upcoming update.";
    },
    handleSummaryCardSelect(key) {
      if (this.activeSummaryKeys.includes(key)) {
        this.activeSummaryKeys = this.activeSummaryKeys.filter(
          (item) => item !== key
        );
      } else {
        this.activeSummaryKeys = [...this.activeSummaryKeys, key];
      }
      this.applySummaryFilter();
    },
    applySummaryFilter() {
      const filterGroup = this.payload?.filter?.FilterGroups?.[0];
      const orFilterGroup = this.payload?.filter?.FilterGroups?.[1];
      if (!filterGroup) return;

      const clearedItems = (filterGroup.FilterItems || []).filter(
        (item) =>
          !["IsDeleted", "Status", "MonthlyActiveUser"].includes(item.FieldName)
      );
      if (orFilterGroup) {
        orFilterGroup.FilterItems = (orFilterGroup.FilterItems || []).filter(
          (item) =>
            !["IsDeleted", "Status", "MonthlyActiveUser"].includes(
              item.FieldName
            )
        );
      }

      const statusValues = this.getSummaryStatusFilterValuesForPayload();
      const includesDeleted = this.activeSummaryKeys.includes("deleted");

      if (this.activeSummaryKeys.includes("monthly")) {
        clearedItems.push({
          FieldName: "MonthlyActiveUser",
          Value: this.monthlyPeriodKey,
          Operator: "="
        });
        this.payload.orderBy = "";
      }

      if (includesDeleted && statusValues.length) {
        const nextOrItems = [
          ...(orFilterGroup?.FilterItems || []),
          {
            FieldName: "IsDeleted",
            Value: true,
            Operator: "Contains"
          },
          {
            FieldName: "Status",
            Value: statusValues.join(","),
            Operator: "Include"
          }
        ];
        if (orFilterGroup) orFilterGroup.FilterItems = nextOrItems;
        this.payload.orderBy = "";
      } else if (includesDeleted) {
        clearedItems.push({
          FieldName: "IsDeleted",
          Value: true,
          Operator: "Contains"
        });
        this.payload.orderBy = "";
      } else if (statusValues.length) {
        clearedItems.push(
          {
            FieldName: "Status",
            Value: statusValues.join(","),
            Operator: "Include"
          },
          {
            FieldName: "IsDeleted",
            Value: false,
            Operator: "Contains"
          }
        );
        this.payload.orderBy = "";
      } else if (!this.activeSummaryKeys.includes("monthly")) {
        this.payload.orderBy = this.defaultRequestBody.orderBy;
      }

      this.payload.filter.FilterGroups[0].FilterItems = clearedItems;
      this.updateStatusFilterSelection();
      this.toggleStatusFilterVisibility(true);
      this.resetPageNumber();
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    updateStatusFilterSelection() {
      const refTable = this.$refs?.refPeopleTable;
      if (!refTable) return;
      const statusValues = this.getSummaryStatusFilterValuesForUi();
      if (!statusValues.length) {
        if (
          refTable?.filterValues &&
          refTable.filterValues[PROPERTY_STORE.STATUS]
        ) {
          this.$delete(refTable.filterValues, PROPERTY_STORE.STATUS);
          refTable.reRenderFilters(refTable.filterValues);
        }
        return;
      }
      const nextValue = {
        textValue: "",
        selectValue: statusValues.join(","),
        fieldName: PROPERTY_STORE.STATUS
      };
      this.$set(refTable.filterValues, PROPERTY_STORE.STATUS, nextValue);
      refTable.reRenderFilters(refTable.filterValues);
    },
    getSummaryStatusFilterValuesForPayload() {
      const values = [];
      if (this.activeSummaryKeys.includes("active")) values.push("1");
      if (this.activeSummaryKeys.includes("inactive")) values.push("0");
      return values;
    },
    getSummaryStatusFilterValuesForUi() {
      const values = this.getSummaryStatusFilterValuesForPayload();
      if (this.activeSummaryKeys.includes("deleted")) values.push("Deleted");
      return values;
    },
    clearAllTableFilters() {
      const refTable = this.$refs?.refPeopleTable;
      if (refTable?.filterValues) {
        refTable.filterValues = {};
        refTable.reRenderFilters(refTable.filterValues);
      }
    },
    getSummaryKeysFromStatusValue(rawValue) {
      const values = Array.isArray(rawValue)
        ? rawValue.map(String)
        : String(rawValue || "")
            .split(",")
            .map((val) => val.trim())
            .filter(Boolean);
      const keys = [];
      if (values.includes("1")) keys.push("active");
      if (values.includes("0")) keys.push("inactive");
      if (values.includes("Deleted")) keys.push("deleted");
      return keys;
    },
    clearMonthlyFilterFromPayload() {
      const filterGroup = this.payload?.filter?.FilterGroups?.[0];
      const orFilterGroup = this.payload?.filter?.FilterGroups?.[1];
      if (filterGroup?.FilterItems) {
        filterGroup.FilterItems = filterGroup.FilterItems.filter(
          (item) => item.FieldName !== "MonthlyActiveUser"
        );
      }
      if (orFilterGroup?.FilterItems) {
        orFilterGroup.FilterItems = orFilterGroup.FilterItems.filter(
          (item) => item.FieldName !== "MonthlyActiveUser"
        );
      }
      this.activeSummaryKeys = this.activeSummaryKeys.filter(
        (item) => item !== "monthly"
      );
    },
    toggleStatusFilterVisibility(isVisible = true) {
      const statusColumn =
        this.tableOptions.columns.find(
          (col) => col.property === PROPERTY_STORE.STATUS
        ) ||
        this.tableOptions.lastColumns.find(
          (col) => col.property === PROPERTY_STORE.STATUS
        );
      if (!statusColumn) return;
      this.$set(statusColumn, "filterableType", isVisible ? "select" : null);
      this?.$refs?.refPeopleTable?.reRenderFilters();
    },
    handleMonthlyPeriodSelect({ index } = {}) {
      this.monthlySelectedIndex = index || 0;
      const selected = this.monthlyActiveUsers[this.monthlySelectedIndex] || {};
      this.monthlyPeriodLabel = selected.period || "";
      this.monthlyPeriodKey = selected.periodKey || "";
      if (selected.count !== undefined) {
        this.summaryCounts.monthly = selected.count;
      }
      if (!this.activeSummaryKeys.includes("monthly")) {
        this.activeSummaryKeys = [...this.activeSummaryKeys, "monthly"];
      }
      this.applySummaryFilter();
    },
    formatMonthlyPeriodKey(periodStart = "") {
      if (!periodStart) return "";

      const raw = String(periodStart).trim();
      const datePart = raw.split(" ")[0] || "";
      if (!datePart) return "";

      const selectedDateFormat =
        localStorage.getItem("selectedDateFormat") || "";
      const candidateFormats = [
        ...(selectedDateFormat ? [selectedDateFormat] : []),
        "YYYY/MM/DD",
        "MM/DD/YYYY",
        "DD/MM/YYYY",
        "YYYY-MM-DD",
        "DD.MM.YYYY",
        "MM.DD.YYYY"
      ];

      const parsed = moment(datePart, candidateFormats, true);
      const m = parsed.isValid() ? parsed : moment(raw);
      if (!m.isValid()) return "";

      return m.format("YYYY-MM");
    },
    getCountByKeys(summary, keys) {
      return keys.reduce((acc, key) => {
        if (acc !== null) return acc;
        const value = summary?.[key];
        return value !== undefined && value !== null ? value : null;
      }, null);
    },
    autoClearEmptySummarySelection() {
      const keysToCheck = ["active", "inactive", "deleted"];
      const nextKeys = this.activeSummaryKeys.filter((key) => {
        if (!keysToCheck.includes(key)) return true;
        return (this.summaryCounts?.[key] || 0) > 0;
      });
      if (nextKeys.length !== this.activeSummaryKeys.length) {
        this.activeSummaryKeys = nextKeys;
        this.applySummaryFilter();
      }
    },
    normalizeCountSummary(data) {
      const summaryData = data?.data || data || {};
      const monthlyActiveUsers = summaryData?.monthlyActiveUsers || [];
      const monthlyEntries = monthlyActiveUsers.map((entry) => ({
        ...entry,
        periodKey: this.formatMonthlyPeriodKey(entry.periodStart)
      }));
      const monthlyEntry = monthlyEntries[monthlyEntries.length - 1] || {};
      const monthlyPeriod = monthlyEntry.period || "";
      return {
        counts: {
          active: summaryData?.totalNumberOfActiveUsers || 0,
          inactive: summaryData?.totalNumberOfInActiveUsers || 0,
          deleted: summaryData?.totalNumberOfDeletedUsers || 0,
          monthly: monthlyEntry.count || 0
        },
        periodLabel: monthlyPeriod,
        monthlyActiveUsers: monthlyEntries
      };
    },
    callForTargetUsersCountSummary() {
      this.summaryLoading = true;
      getTargetUsersCountSummary()
        .then((response) => {
          const normalized = this.normalizeCountSummary(response?.data);
          this.summaryCounts = normalized.counts;
          this.monthlyPeriodLabel = normalized.periodLabel;
          this.monthlyActiveUsers = normalized.monthlyActiveUsers;
          this.monthlySelectedIndex = this.monthlyActiveUsers.length
            ? this.monthlyActiveUsers.length - 1
            : 0;
          const selectedMonthly =
            this.monthlyActiveUsers[this.monthlySelectedIndex] || {};
          this.monthlyPeriodKey = selectedMonthly.periodKey || "";
          if (selectedMonthly.count !== undefined) {
            this.summaryCounts.monthly = selectedMonthly.count;
          }
          this.autoClearEmptySummarySelection();
        })
        .catch(() => {
          this.summaryCounts = {
            active: 0,
            inactive: 0,
            deleted: 0,
            monthly: 0
          };
          this.monthlyPeriodLabel = "";
          this.monthlyActiveUsers = [];
          this.monthlySelectedIndex = 0;
          this.monthlyPeriodKey = "";
          this.autoClearEmptySummarySelection();
        })
        .finally(() => {
          this.summaryLoading = false;
        });
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageFilterOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            name: language.name,
            value: language.resourceId
          })) || [];
        this.$set(
          this.tableOptions.defaultColumns.find(
            (col) => col.property === "preferredLanguage"
          ),
          "filterableItems",
          this.languageFilterOptions
        );
      });
    },
    callForFormDetails() {
      getLeaderboardFormDetails().then((res) => {
        this.formDetails = res?.data?.data || [];
      });
    },
    handleUserTimeline(row) {
      this.selectedRow = row;
      this.isUserDetailsDrawerOpen = true;
    },
    handleCloseDrawer() {
      document.querySelector(".k-navigation-drawer").style.right = "-100%";
      setTimeout(() => {
        this.selectedRow = null;
        this.isUserDetailsDrawerOpen = false;
      }, 250);
    },
    handleRedirectToSCIMSync() {
      this.$router.push(
        "/company/company-settings?tab=scim-settings&showModal=true"
      );
    },
    handleRedirectToGoogleSync() {
      this.$router.push(
        "/company/company-settings?tab=google-user-provisioning"
      );
    },
    handleSeeRepeatOffenders() {
      if (this.repeatedOffendersGroup)
        this.$router.push({
          name: "Target Group Users",
          params: {
            id: this.repeatedOffendersGroup.resourceId,
            label: this.repeatedOffendersGroup.name,
            isGroupEditable: this.repeatedOffendersGroup.isEditable
          }
        });
    },
    callForTargetGroups() {
      searchTargetGroups(this.targetGroupsPayload, true).then((res) => {
        const repeatedOffendersIndex = res?.data?.data?.results?.findIndex?.(
          (group) => group.name === "Repeat Offenders"
        );
        if (repeatedOffendersIndex !== -1) {
          this.repeatedOffendersCount =
            res.data.data.results[repeatedOffendersIndex].userCount;
          this.repeatedOffendersGroup = {
            ...res.data.data.results[repeatedOffendersIndex]
          };
        }
      });
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters["common/getTimezones"] &&
        !this.$store?.getters["common/getTimezones"]?.timeZoneList?.length
      ) {
        this.$store.dispatch("common/getTimezone");
      }
    },
    setTimeZoneFilterableItems() {
      const filterableItems = this.getTimezones?.timeZoneList?.map((item) => ({
        text: item.displayName,
        value: item.id
      }));
      filterableItems.unshift({ text: "Blank", value: "Blank" });
      this.$set(
        this.tableOptions.defaultColumns.find(
          (col) => col.property === PROPERTY_STORE.TIME_ZONE
        ),
        "filterableItems",
        filterableItems
      );
      this?.$refs?.refPeopleTable?.reRenderFilters();
    },
    checkIsLDAPConfigured() {
      LDAPService.getLDAPSettingDetailForMyCompany()
        .then((response) => {
          const {
            data: { data }
          } = response;
          this.ldapResourceId = data?.resourceId;
          this.ldapFieldMappings = getDefaultFieldMappingsWithCurrent(
            defaultFieldMappings,
            data?.fieldMappings
          );
          this.isLDAPDisabled = !data.isActive;
        })
        .catch(() => {
          this.isLDAPDisabled = true;
        })
        .finally(() => {
          if (this.isLDAPDisabled) {
            this.addUsersItems.splice(2, 1, {
              ...this.addUsersItems[2],
              disabled: true
            });
          }
        });
    },
    toggleImportLDAPModal() {
      this.isShowImportLDAPModal = !this.isShowImportLDAPModal;
    },
    handleViewUserGroups(selectedRow = {}) {
      this.selectedUserToViewGroups = selectedRow;
      this.toggleShowingTargetUserViewTargetGroups();
    },
    handleAddUserToGroup(selectedRow = {}) {
      this.selectedUserToAddToGroup = selectedRow;
      this.bulkImportPayload = {
        targetUserResourceIds: [selectedRow.resourceId],
        selectAll: false,
        excludedResourceIdList: [],
        filter: this.payload.filter,
        selectedRowCount: 1
      };
      this.toggleShowingTargetUserAddToGroup();
    },
    handleConfirmAddUserToGroup(groups = []) {
      this.selectedUserToAddToGroup = null;
      this.toggleShowingTargetUserAddToGroup();
    },
    handleConfirmCreateUserWithGroup(groupName = "") {
      this.selectedUserToCreateGroupWith = null;
      this.toggleShowingTargetUserCreateGroupWithUser();
    },
    handleCreateGroupWithUser(selectedRow = {}) {
      this.selectedUserToCreateGroupWith = selectedRow;
      this.toggleShowingTargetUserCreateGroupWithUser();
    },
    toggleShowingTargetUserViewTargetGroups() {
      this.isShowingTargetUserViewTargetGroups = !this
        .isShowingTargetUserViewTargetGroups;
    },
    toggleShowingTargetUserAddToGroup() {
      if (this.isShowingTargetUserAddToGroup) {
        this.selectedUserToAddToGroup = null;
        this.bulkImportPayload = {
          targetUserResourceIds: [],
          selectAll: false,
          excludedResourceIdList: [],
          filter: this.payload.filter,
          selectedRowCount: 0
        };
      }
      this.isShowingTargetUserAddToGroup = !this.isShowingTargetUserAddToGroup;
    },
    toggleShowingTargetUserCreateGroupWithUser() {
      if (this.isShowingTargetUserCreateGroupWithUser) {
        this.selectedUserToCreateGroupWith = null;
      }
      this.isShowingTargetUserCreateGroupWithUser = !this
        .isShowingTargetUserCreateGroupWithUser;
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber;
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === "ascending";
      if (prop === "timeZone") {
        prop = "TimeZoneId";
      }
      this.payload.orderBy = prop;
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize;
      this.serverSideProps.pageSize = pageSize;
      this.resetPageNumber();
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    resetPageNumber() {
      this.payload.pageNumber = 1;
      this.serverSideProps.pageNumber = 1;
    },
    columnFilterChanged(filter) {
      this.resetPageNumber();
      const updatedFilters = columnFilterChanged(filter, this.payload);
      const normalized = this.normalizeStatusFilterItems(
        updatedFilters,
        this.payload.filter.FilterGroups[1].FilterItems
      );
      this.payload.filter.FilterGroups[0].FilterItems = normalized.andItems;
      this.payload.filter.FilterGroups[1].FilterItems = normalized.orItems;
      let statusFilter = null;
      if (Array.isArray(filter)) {
        statusFilter = filter.find((item) => item.FieldName === PROPERTY_STORE.STATUS);
      } else if (filter?.FieldName === PROPERTY_STORE.STATUS) {
        statusFilter = filter;
      }
      if (statusFilter) {
        const nextKeys = this.getSummaryKeysFromStatusValue(statusFilter.Value);
        const hasMonthly = this.activeSummaryKeys.includes("monthly");
        this.activeSummaryKeys = hasMonthly
          ? [...nextKeys, "monthly"]
          : nextKeys;
      }
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    columnFilterCleared(fieldName) {
      let nextFilters = columnFilterCleared(fieldName, this.payload);
      if (fieldName === PROPERTY_STORE.STATUS) {
        nextFilters = nextFilters.filter(
          (item) => item.FieldName !== "IsDeleted"
        );
        this.payload.filter.FilterGroups[1].FilterItems = this.payload.filter.FilterGroups[1].FilterItems.filter(
          (item) => !["IsDeleted", "Status", "status"].includes(item.FieldName)
        );
        this.activeSummaryKeys = this.activeSummaryKeys.filter(
          (item) => item === "monthly"
        );
      }
      this.payload.filter.FilterGroups[0].FilterItems = nextFilters;
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    handleClearFilters() {
      this.activeSummaryKeys = [];
      this.updateStatusFilterSelection();
    },
    syncSummaryKeysFromPayload() {
      const filterGroups = this.payload?.filter?.FilterGroups || [];
      const items = filterGroups.flatMap((group) => group?.FilterItems || []);
      const nextKeys = new Set();
      const statusValues = new Set();
      items.forEach((item) => {
        const fieldName = String(item?.FieldName || "");
        if (fieldName === "MonthlyActiveUser") {
          nextKeys.add("monthly");
        }
        if (fieldName === "IsDeleted" && item?.Value === true) {
          nextKeys.add("deleted");
        }
        if (fieldName.toLowerCase() === "status") {
          this.normalizeStatusValues(item?.Value).forEach((val) =>
            statusValues.add(val)
          );
        }
      });
      if (statusValues.has("1")) nextKeys.add("active");
      if (statusValues.has("0")) nextKeys.add("inactive");
      const nextArray = Array.from(nextKeys);
      if (this.activeSummaryKeys.join(",") !== nextArray.join(",")) {
        this.activeSummaryKeys = nextArray;
      }
    },
    normalizeStatusValues(rawValue) {
      if (Array.isArray(rawValue)) {
        return rawValue.map(String);
      }
      return String(rawValue || "")
        .split(",")
        .map((val) => val.trim())
        .filter((val) => val && val !== "Deleted");
    },
    normalizeStatusFilterItems(filterItems = [], orItems = []) {
      const normalizeFieldName = (fieldName = "") =>
        String(fieldName).toLowerCase();
      const statusFilter = filterItems.find(
        (item) => normalizeFieldName(item.FieldName) === "status"
      );
      const cleanedOrItems = orItems.filter(
        (item) =>
          !["isdeleted", "status"].includes(normalizeFieldName(item.FieldName))
      );
      if (!statusFilter)
        return { andItems: filterItems, orItems: cleanedOrItems };

      const withoutIsDeleted = filterItems.filter(
        (item) =>
          !["isdeleted", "status"].includes(normalizeFieldName(item.FieldName))
      );
      const operator = statusFilter.Operator || "Include";
      const rawValue = statusFilter.Value;
      const values = Array.isArray(rawValue)
        ? rawValue.map(String)
        : String(rawValue || "")
            .split(",")
            .map((val) => val.trim())
            .filter(Boolean);

      const includesDeleted = values.includes("Deleted");
      const remainingValues = values.filter((val) => val !== "Deleted");

      if (includesDeleted && remainingValues.length) {
        const nextOrItems = cleanedOrItems.concat([
          {
            FieldName: "IsDeleted",
            Value: true,
            Operator: "Contains"
          },
          {
            FieldName: statusFilter.FieldName,
            Value:
              operator === "Include"
                ? remainingValues.join(",")
                : remainingValues[0],
            Operator: operator
          }
        ]);
        return { andItems: withoutIsDeleted, orItems: nextOrItems };
      }

      const nextFilters = [...withoutIsDeleted];
      if (includesDeleted) {
        nextFilters.push({
          FieldName: "IsDeleted",
          Value: true,
          Operator: "Contains"
        });
      } else {
        nextFilters.push({
          FieldName: "IsDeleted",
          Value: false,
          Operator: "Contains"
        });
      }

      if (remainingValues.length) {
        nextFilters.push({
          FieldName: statusFilter.FieldName,
          Value:
            operator === "Include"
              ? remainingValues.join(",")
              : remainingValues[0],
          Operator: operator
        });
      }

      return { andItems: nextFilters, orItems: cleanedOrItems };
    },
    handleSearchChange(searchFilter = {}) {
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ];
      const timeZoneIndex = this.payload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === "TimeZone"
      );
      if (timeZoneIndex !== -1) {
        this.payload.filter.FilterGroups[1].FilterItems.splice(
          timeZoneIndex,
          1
        );
      }
      const preferredLanguageIndex = this.payload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === "PreferredLanguage"
      );
      if (preferredLanguageIndex !== -1) {
        this.payload.filter.FilterGroups[1].FilterItems.splice(
          preferredLanguageIndex,
          1
        );
      }
      this.resetPageNumber();
      this.callForGetTargetUserCustomFieldsByCompanyId();
    },
    closeImportModal() {
      this.isWantToImportFile = false;
    },
    toggleCustomFieldsModal() {
      this.isWantToShowCustomFieldsModal = !this.isWantToShowCustomFieldsModal;
    },
    handleAddUsers(item) {
      if (item === this.addUsersItems[0].text) {
        this.selectedRow = null;
        this.isWantToShowAddUsersModal = true;
      }
      if (item === this.addUsersItems[1].text) {
        this.isWantToImportFile = true;
      }
      if (item === this.addUsersItems[2].text) {
        this.toggleImportLDAPModal();
      }
      if (item === this.addUsersItems[3].text) {
        this.handleRedirectToSCIMSync();
      }
      if (item === this.addUsersItems[4].text) {
        this.handleRedirectToGoogleSync();
      }
    },
    handleClickEmptyBtnClicked() {
      this.selectedRow = null;
      this.isWantToShowAddUsersModal = true;
    },
    closeCustomFieldsModalWithUpdate() {
      this.toggleCustomFieldsModal();
      this.callForGetTargetUserCustomFieldsByCompanyId(true);
    },
    closeAddUserModalWithUpdate(showMainModal = false) {
      this.isWantToShowAddUsersModal = false;
      this.$emit("call-for-company-licenses", showMainModal);
      this.callForTargetUsers();
      this.callForTargetUsersCountSummary();
    },
    handleEditTargetUsers(selectedRow) {
      this.selectedRow = selectedRow;
      this.isWantToShowAddUsersModal = true;
    },
    handleEditFieldsClick() {
      if (this.$refs && this.$refs.refPeopleTable) {
        this.$refs.refPeopleTable.toggleIsSettingsOpened();
      }
      this.toggleCustomFieldsModal();
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      if (
        selections.some((item) => {
          if (item?.isDeleted) return true;
          return String(item?.status || "").trim().toLowerCase() === "deleted";
        })
      ) {
        return;
      }
      this.isMultipleDelete = true;
      this.multipleDeletedUserCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length;
      this.multipleTargetUserPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.payload.filter
      };
      this.changeDeleteModalStatus(true);
    },
    handleDelete(row) {
      this.isMultipleDelete = false;
      this.changeDeleteModalStatus(true);
      this.selectedRow = row;
    },
    checkIfCanCloseAddUserModal() {
      if (this.$refs.addUserModal) {
        this.$refs.addUserModal.closeOverlay();
      }
    },
    closeAddUserModal() {
      this.isWantToShowAddUsersModal = false;
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status;
      if (!status) {
        this.selectedRow = null;
        this.multipleTargetUserPayload = {};
        this.isMultipleDelete = false;
        this.multipleDeletedUserCount = 0;
      }
    },
    handleDeleteUsers() {
      this.callForMultipleDelete();
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true;
      this.loading = true;
      bulkDeleteTargetUsers(this.multipleTargetUserPayload)
        .then(() => {
          this?.$refs?.refPeopleTable?.resetSelectableParams();
          this.callForTargetUsers();
          this.callForTargetUsersCountSummary();
          this.changeDeleteModalStatus(false);
        })
        .catch((error) => {
          this.bulkDeleteErrorMessage = error?.response?.data?.message;
        })
        .finally(() => {
          this.loading = false;
          this.deleteButtonDisabled = false;
        });
    },
    handleDeleteUser(selectedUser, selections) {
      if (
        selectedUser?.isDeleted ||
        String(selectedUser?.status || "").trim().toLowerCase() === "deleted"
      ) {
        return;
      }
      this.loading = true;
      deleteTargetUser(selectedUser.resourceId).then((response) => {
        if (response.data && response.data.message) {
          if (
            this.$refs.refPeopleTable.multipleSelection.some(
              (item) => item.resourceId === selectedUser.resourceId
            )
          ) {
            this?.$refs?.refPeopleTable?.$refs?.elTableRef?.toggleRowSelection(
              selectedUser,
              false
            );
            this.$refs.refPeopleTable.serverSideSelectionCount -= 1;
          }
          if (
            selections?.[selections.length - 1]?.resourceId ===
            selectedUser?.resourceId
          ) {
            this.$emit("call-for-company-licenses");
            this.callForTargetUsers();
          }
          this.callForTargetUsers();
          this.callForTargetUsersCountSummary();
        }
      });
    },
    callForTargetUsers() {
      this.loading = true;
      getTargetUsers(this.payload)
        .then((response) => {
          const {
            totalNumberOfRecords,
            totalNumberOfPages,
            pageNumber,
            results
          } = response?.data?.data || {};
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords;
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages;
          this.serverSideProps.pageNumber = pageNumber;
          this.tableData = results?.map((item) => {
            return {
              ...item,
              status: item.isDeleted ? "Deleted" : item.status,
              preferredLanguage: this.languageFilterOptions.find(
                (language) => language.name === item.preferredLanguage
              )?.text
            };
          });
        })
        .catch(() => {
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
        });
      this.getUnverifiedDomains();
    },
    callForGetTargetUserCustomFieldsByCompanyId(forceUpdate = false) {
      this.loading = true;
      if (!this.isInitial && !this.customFields.length && !forceUpdate) {
        return this.callForTargetUsers();
      }
      this.isInitial = false;
      if (this.customFields.length && !forceUpdate) {
        this.callForTargetUsers();
      } else {
        getTargetUserCustomFieldsByCompanyId()
          .then((response) => {
            const { data } = response;
            this.customFields = data.data.filter((item) => {
              return item.isActive;
            });
            const sortProp = "sortOrder";
            this.customFields.sort((a, b) => {
              if (a[sortProp] > b[sortProp]) {
                return 1;
              } else if (a[sortProp] === b[sortProp]) {
                return 0;
              }
              return -1;
            });

            const columnsOfCustomFields = createCustomFieldColumns(
              this.customFields
            );

            const newColumns = [
              ...this.tableOptions.defaultColumns,
              ...columnsOfCustomFields,
              ...this.tableOptions.lastColumns
            ];

            if (this.tableOptions.columns.length) {
              this.tableOptions.columns.forEach((column) => {
                const findedColumn = newColumns.find(
                  (newColumn) => newColumn.property === column.property
                );
                if (!findedColumn) {
                  return;
                }
                findedColumn.show = column.show;
              });
            }
            const renderedColumns = this?.$refs.refPeopleTable?.renderedColumns;
            if (renderedColumns?.length) {
              newColumns.forEach((column) => {
                const item = renderedColumns.find(
                  (renderedColumnProp) => renderedColumnProp === column.property
                );
                column.show = !!item;
              });
            }
            this.tableOptions.columns = newColumns;
          })
          .catch(() => {
            this.tableOptions.columns = [
              ...this.tableOptions.defaultColumns,
              ...this.tableOptions.lastColumns
            ];
          })
          .finally(() => {
            this.callForTargetUsers();
          });
      }
    },
    exportTargetUserList({
      exportTypes,
      reportAllPages,
      pageNumber,
      pageSize
    }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages,
          exportType: exportType === "XLS" ? "Excel" : exportType,
          filter: this.payload.filter
        };
        exportTargetUsers(payload).then((response) => {
          const { data } = response;
          const link = document.createElement("a");
          link.href = globalThis.URL.createObjectURL(data);
          link.download = `Target Users.${
            exportType.toLocaleLowerCase() === "xls"
              ? "xlsx"
              : exportType.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
    closeAddToAnExistingGroupModalWithUpdate() {
      this.toggleShowingTargetUserAddToGroup();
      const refTable = this.$refs.refPeopleTable;
      if (refTable) {
        refTable.$refs.elTableRef.clearSelection();
        refTable.serverSideSelectionCount = 0;
        refTable.excludedResourceIdList = [];
        refTable.isSelectedAllEver = false;
      }
      this.callForGetTargetUserCustomFieldsByCompanyId(true);
    },
    handleSelectionChange(selection = []) {
      this.selection = selection;
    },
    handleDeleteSelectionClick() {
      if (this.hasDeletedSelection) return;
      this.$refs?.refPeopleTable?.handleDelete?.(this.selection);
    },
    handleAddUsersSelectionClick() {
      this.selectedUserToAddToGroup = this.selection;
      const serverSideParams = this.$refs?.refPeopleTable?.getServerSideSelectionParams() || {
        isSelectedAllEver: false,
        excludedResourceIdList: []
      };
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
      };
      this.toggleShowingTargetUserAddToGroup();
    },
    getUnverifiedDomains() {
      this.isUnverifiedDomainsLoading = true;
      getUnverifiedDomains()
        .then((response) => {
          this.unverifiedDomains = response?.data?.data || [];
        })
        .catch(() => {
          this.unverifiedDomains = [];
        })
        .finally(() => {
          this.isUnverifiedDomainsLoading = false;
        });
    },
    changeUnverifiedDomainsModalStatus(status = false) {
      this.isUnverifiedDomainsModalVisible = status;
    },
    handleSecondaryAction() {
      this.changeUnverifiedDomainsModalStatus(true);
    },
    handlePrimaryAction() {
      this.$router.push("/company/company-settings?tab=allowed-list");
    }
  }
};
</script>
