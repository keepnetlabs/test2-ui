<template>
  <div class="incident-responder-parent mt-2">
    <div class="incident-responder">
      <ReAnalyzeIncidentDialog
        v-if="showReAnalyzeIncidentDialog"
        :status="showReAnalyzeIncidentDialog"
        :name="mailDetails.name"
        :resourceId="mailDetails.resourceId"
        @on-close-dialog="toggleShowReAnalyzeDialog"
        @on-confirm="initDatas"
      />
      <SelectEmailTemplateModal
        v-if="isShowEmailTemplateModal"
        :status="isShowEmailTemplateModal"
        :template-types="templateTypes"
        :email-templates="emailTemplates"
        :selected-template="selectedTemplateResourceId"
        @on-close="toggleEmailTemplateModal"
        @on-confirm="handleConfirmSelectedEmailTemplate"
      />
      <new-investigation
        v-if="isWantToAddNewInvestigation"
        ref="refNewInvestigation"
        :status="isWantToAddNewInvestigation"
        :selectedMail="selectedEmail"
        :is-ir="true"
        @closeWithRoute="handleRouteToInvestigationDetails"
        @closeAdd="isWantToAddNewInvestigation = false"
      />
      <AppModal
        v-if="showPlaybookModal"
        title-id="text--create-playbook-title"
        class-name="incident-responder__playbook"
        :status="showPlaybookModal"
        :icon-name="getIconName"
        :title="getTitle"
        :show-footer="false"
      >
        <template v-slot:overlay-body>
          <CreateOrEditRule
            v-if="showPlaybookModal"
            :playbookId="selectedPlaybookId"
            @cancelForm="togglePlaybookModal"
            @closeFormWithUpdate="closePlaybookWithUpdate"
          />
        </template>
      </AppModal>
      <FilterByHashModal
        v-model="hashfilterProps"
        v-if="isFilterByHashModalVisible"
        :status="isFilterByHashModalVisible"
        :filterProps="hashfilterProps"
        @confirm="confirmFilterByHash"
        @close="closeFilterByHashModal"
      />
      <ConfirmationRequiredPopup
        v-if="isShowConfirmationRequired"
        :status="isShowConfirmationRequired"
        :payload="confirmationPayload"
        :email-count="confirmationDialogEmailCount"
        :user-count="confirmationDialogUserCount"
        :is-action-button-disabled="confirmationRequiredActionButtonDisabled"
        @on-close="handleConfirmationRequiredClose"
        @on-confirm="handleEditAfterConfirmation"
      />
      <IncidentResponderHeaderCards ref="refIncidentResponderCards" />
      <div
        v-if="getIncidentResponderNotifiedEmailPermission"
        class="table-row"
        style="padding-top: 0;"
      >
        <v-card
          style="
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.12);
            border-radius: 12px;
          "
        >
          <div class="header">
            <div class="title">
              <h2>
                {{ getReportedEmailTitle }}
              </h2>
              <p class="mb-10">
                {{ getReportedEmailDescription }}
              </p>
            </div>
          </div>
          <datatable
            v-if="isShowingClusteredTable"
            v-bind="dynamicClusterProps"
            id="incident-responder-reported-emails-clustered-table"
            refName="clustered-ref-name"
            ref="refReportedEmailsClustered"
            is-server-side-selection
            changeFooterPosition
            disable-extended-view-transition
            selectable
            just-compare-row-key
            filterable
            is-server-side
            options
            wait-extended-view-api
            :table="clusteredTableData"
            :axios-payload.sync="clusteredTableAxios"
            :saved-filters-local-storage-key="clusteredTable.savedFiltersLocalStorageKey"
            :saved-table-settings-local-storage-key="
              clusteredTable.savedTableSettingsLocalStorageKey
            "
            :is-extended-view-cancel-button-disabled="isExtendedViewCancelButtonDisabled"
            :server-side-props="serverSideClusteredProps"
            :server-side-events="{ pagination: true, search: true, sort: true }"
            :extended-view-loading="extendedViewLoading"
            :extended-view-options="clusteredTable.extendedViewOptions"
            :columns="clusteredTable.columns"
            :empty="clusteredTable.iEmpty"
            :loading="isReportedEmailsClusteredLoading"
            :row-actions="clusteredTable.rowActions"
            :extendedViewValue="extendedViewValue"
            :select-event="clusteredTable.selectEvent"
            :extended-view-calling-api="extendedViewCallingApi"
            :extendedViewDisableChanger="extendedViewDisableChanger"
            :add-button="clusteredTable.addButton"
            @on-filter-by-hash="handleFilterByHash"
            @downloadEvent="exportClusteredReportedListEmails"
            @onEmptyBtnClicked="onEmptyReportedEmailsBtnClicked"
            @handleInvestigate="handleReportedEmailInvestigate"
            @handleDetails="irDetailsOnClick"
            @onEditClick="onEditClick"
            @handleEdit="handleEdit"
            @irPreview="irPreviewOnClick"
            @refreshAction="callForClusteredTable"
            @columnFilterChanged="clusteredColumnFilterChanged"
            @columnFilterCleared="clusteredColumnFilterCleared"
            @server-side-page-number-changed="serverSideClusteredPageNumberChanged"
            @server-side-size-changed="serverSideClusteredSizeChanged"
            @searchChangedEvent="handleClusteredSearchChange"
            @sortChangedEvent="sortClusteredChanged"
            @on-extended-view-status-change="handleOnExtendedViewStatusChange"
          >
            <template #table-search-left-side>
              <v-btn
                id="btn-back--incident-responder-clustered-table"
                text
                color="#2196f3"
                class="clustered-table-back-btn"
                @click="handleBackClick"
              >
                <v-icon left>mdi-arrow-left</v-icon> BACK</v-btn
              >
            </template>
            <template v-slot:datatable-custom-column="{ scope, col }">
              <template v-if="scope.column.property === 'source'">
                <span
                  v-if="
                    scope.row &&
                    scope.row.matchingPlaybooks &&
                    scope.row.matchingPlaybooks.length === 0
                  "
                >
                  {{ scope.row.source === 'Auto' ? 'Auto Analysis' : scope.row.source }}
                </span>
                <span
                  v-else
                  v-for="(item, index) in scope.row.matchingPlaybooks"
                  :id="`btn--incident-responder-matching-playbooks-${item.name}-${index}`"
                  :key="item.resourceId"
                  class="incident-responder-parent__link"
                  @click="togglePlaybookModalWithSelected(item.resourceId)"
                  >{{ item.name }}</span
                >
              </template>
              <template v-if="scope.column.property === 'status'">
                <template v-if="scope.row.status === 'BeingAnalyzed'">
                  <span class="analysis-link">
                    <div>{{ labels.InAnalysis }}...</div>
                    <div>
                      <img
                        src="../assets/img/spinner.png"
                        alt="spinner-image"
                        class="add-in-settings__spinner"
                      />
                    </div>
                  </span>
                </template>
                <template v-else>
                  <data-table-colorful-text
                    :col="col"
                    :scope="scope"
                    :text="getDataTableFieldLabel(scope.row.status)"
                  />
                </template>
              </template>
            </template>
            <template v-slot:extended-view-slot>
              <div class="row-edit-div">
                <v-checkbox
                  id="input--incident-responder-extended-view-is-notify"
                  color="#2196f3"
                  label="Notify reporting user about this update"
                  v-model="extendedView.isNotify"
                  @change="handleIsNotify"
                ></v-checkbox>
                <div class="incident-responder-extended-view-is-notify-sub-label">
                  Email Template: {{ getEmailTemplateName }}
                  <span @click="handleEmailTemplateChange">Change</span>
                </div>
              </div>
              <div class="row-edit-div">
                <v-checkbox
                  v-model="extendedView.isMessage"
                  id="input--incident-responder-extended-view-is-message"
                  color="#2196f3"
                  label="Add Custom Message"
                  :disabled="!extendedView.isNotify"
                  @change="handleMessageChange"
                ></v-checkbox>
              </div>
              <div class="row-edit-div" v-if="extendedView.isMessage && extendedView.isNotify">
                <v-textarea
                  id="input--incident-responder-custom-message"
                  outlined
                  dense
                  v-model="extendedView.customMessage"
                  rows="3"
                  :placeholder="
                    isCustomMessageMultiple
                      ? 'Multiple Values'
                      : 'Write custom messages for recipients'
                  "
                  :readonly="isCustomMessageMultiple"
                  row-height="30"
                >
                  <template v-slot:append v-if="isCustomMessageMultiple">
                    <v-btn
                      id="btn-edit--incident-responder-custom-message"
                      text
                      @click.native="isCustomMessageMultiple = false"
                      class="edit-popup__edit-component"
                    >
                      EDIT
                    </v-btn>
                  </template>
                </v-textarea>
              </div>
            </template>
          </datatable>
          <datatable
            v-show="!isShowingClusteredTable"
            v-bind="dynamicReportedEmailProps"
            ref="refReportedEmails"
            id="incident-responder-reported-emails-data-table"
            is-server-side
            selectable
            filterable
            options
            groupable
            just-compare-row-key
            wait-extended-view-api
            is-server-side-selection
            disable-extended-view-transition
            change-footer-position
            active-cluster=""
            :axios-payload.sync="requestBodyReportedEmails"
            :saved-filters-local-storage-key="emails.savedFiltersLocalStorageKey"
            :saved-table-settings-local-storage-key="emails.savedTableSettingsLocalStorageKey"
            :loading="reportedEmailsLoading"
            :server-side-events="{ pagination: true, search: true, sort: true }"
            :table="reportedEmailsData"
            :columns="emails.columns"
            :extended-view-loading="extendedViewLoading"
            :is-extended-view-cancel-button-disabled="isExtendedViewCancelButtonDisabled"
            :extended-view-calling-api="extendedViewCallingApi"
            :clusterItems="[{ name: 'Subject' }, { name: 'Reported By' }]"
            :is-custom-overflowed-column="isCustomOverflowedColumn"
            :extended-view-options="emails.extendedViewOptions"
            :extendedViewValue="extendedViewValue"
            :rowActions="emails.rowActions"
            :addUsers="emails.addUsers"
            :empty="emails.iEmpty"
            :selectEvent="emails.selectEvent"
            :server-side-props="serverSideProps"
            :extendedViewDisableChanger="extendedViewDisableChanger"
            :add-button="emails.addButton"
            @on-filter-by-hash="handleFilterByHash"
            @clusterChanged="clusterChanged"
            @downloadEvent="exportReportedListEmails"
            @onEmptyBtnClicked="onEmptyReportedEmailsBtnClicked"
            @irPreview="irPreviewOnClick"
            @handleListBulleted="handleListBulletedClick"
            @handleInvestigate="handleReportedEmailInvestigate"
            @handleDetails="irDetailsOnClick"
            @onEditClick="onEditClick"
            @handleEdit="handleEdit"
            @handleReAnalyze="handleReAnalyze"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
            @refreshAction="callForSearchNotifiedMail"
            @server-side-page-number-changed="serverSidePageNumberChanged"
            @server-side-size-changed="serverSideSizeChanged"
            @searchChangedEvent="handleSearchChange"
            @sortChangedEvent="sortChanged"
            @on-extended-view-status-change="handleOnExtendedViewStatusChange"
          >
            <template v-slot:datatable-custom-column="{ scope, col }">
              <template
                v-if="scope.column.property === 'subject' || scope.column.property === 'reportedBy'"
              >
                <span v-if="!selectedCluster"> {{ scope.row[col.property] }}</span>
                <div class="reported-email-subject__container" v-else>
                  <div class="reported-email-subject">
                    <span> {{ scope.row[col.property] }}</span>
                  </div>
                  <the-records-button
                    :index="scope.$index"
                    :row="scope.row"
                    @on-click="handleRecordButtonClick"
                  />
                </div>
              </template>
              <template v-if="scope.column.property === 'source'">
                <span
                  v-if="
                    scope.row &&
                    scope.row.matchingPlaybooks &&
                    scope.row.matchingPlaybooks.length === 0
                  "
                >
                  {{ scope.row.source === 'Auto' ? 'Auto Analysis' : scope.row.source }}
                </span>
                <span
                  v-else
                  v-for="(item, index) in scope.row.matchingPlaybooks"
                  :id="`btn--incident-responder-matching-playbooks-${item.name}-${index}`"
                  :key="item.resourceId"
                  class="incident-responder-parent__link"
                  @click="togglePlaybookModalWithSelected(item.resourceId)"
                  >{{ item.name }}</span
                >
              </template>
              <template v-if="scope.column.property === 'status'">
                <template v-if="scope.row.status === 'BeingAnalyzed'">
                  <span class="analysis-link">
                    <div>{{ labels.InAnalysis }}...</div>
                    <div>
                      <img
                        src="../assets/img/spinner.png"
                        alt="spinner-image"
                        class="add-in-settings__spinner"
                      />
                    </div>
                  </span>
                </template>
                <template v-else>
                  <data-table-colorful-text
                    :col="col"
                    :scope="scope"
                    :text="getDataTableFieldLabel(scope.row.status)"
                  />
                </template>
              </template>
            </template>
            <template v-slot:extended-view-slot>
              <div class="row-edit-div">
                <v-checkbox
                  id="input--incident-responder-extended-view-is-notify"
                  color="#2196f3"
                  label="Notify reporting user about this update"
                  v-model="extendedView.isNotify"
                  @change="handleIsNotify"
                ></v-checkbox>
                <div class="incident-responder-extended-view-is-notify-sub-label">
                  Email Template: {{ getEmailTemplateName }}
                  <span @click="handleEmailTemplateChange">Change</span>
                </div>
              </div>
              <div class="row-edit-div">
                <v-checkbox
                  v-model="extendedView.isMessage"
                  id="input--incident-responder-extended-view-is-message"
                  color="#2196f3"
                  label="Add Custom Message"
                  :disabled="!extendedView.isNotify"
                  @change="handleMessageChange"
                ></v-checkbox>
              </div>
              <div class="row-edit-div" v-if="extendedView.isMessage && extendedView.isNotify">
                <v-textarea
                  outlined
                  dense
                  v-model="extendedView.customMessage"
                  id="input--incident-responder-extended-view-custom-message"
                  rows="3"
                  :placeholder="
                    isCustomMessageMultiple
                      ? 'Multiple Values'
                      : 'Write custom messages for recipients'
                  "
                  :readonly="isCustomMessageMultiple"
                  row-height="30"
                >
                  <template v-slot:append v-if="isCustomMessageMultiple">
                    <v-btn
                      id="btn-edit--incident-responder-custom-message"
                      text
                      @click.native="isCustomMessageMultiple = false"
                      class="edit-popup__edit-component"
                    >
                      EDIT
                    </v-btn>
                  </template>
                </v-textarea>
              </div>
            </template>
          </datatable>
        </v-card>
      </div>
      <div class="double-table">
        <div v-if="getIncidentResponderTopRulesPermission" class="column">
          <TopRules
            style="
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.12);
              border-radius: 12px;
              min-height: 300px;
              transform: translateY(0px);
            "
          />
        </div>
        <div v-if="getIncidentResponderRunningInvestigationsPermission" class="column">
          <RecentInvestigations
            style="
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.12);
              border-radius: 12px;
              transform: translateY(0px);
            "
          />
        </div>
      </div>
      <div class="double-table">
        <div
          v-if="getIncidentResponderNotifiedEmailPermission"
          class="column"
          style="width: calc(40% - 16px); min-height: 300px;"
        >
          <RecentlyReportedIncidents
            style="
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.12);
              border-radius: 12px;
              min-height: 300px;
              transform: translateY(0px);
            "
            :has-link="false"
          />
        </div>
        <div
          v-if="getDashboardReportedEmailTrendsPermission"
          class="column"
          style="width: calc(60% - 16px); max-height: 367px;"
        >
          <ReportedEmailTrends
            style="
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.12);
              border-radius: 12px;
              min-height: 300px;
              transform: translateY(0px);
            "
            :has-link="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  confirmationRequiredForEdit,
  searchNotifiedMail,
  updateNotifiedEmail,
  updateNotifiedEmailBulk
} from '@/api/incidentResponder'
import {
  getDataTableFieldLabel,
  getDefaultAxiosPayload,
  handleIsSafari,
  setSafariClusterFix
} from '@/utils/functions'
import DataTableColorfulText from '@/components/DataTableComponents/DataTableColorfulText'
import {
  exportNotifiedEmails,
  getNotifiedEmailForEdit,
  getNotifiedEmail
} from '@/api/notifiedEmail'
import Datatable from '@/components/DataTable'
import FilterByHashModal from '@/components/IncidentResponder/FilterByHashModal'
import NewInvestigation from '@/components/Investigation/NewInvestigation'
import AppModal from '@/components/AppModal'
import { mapActions, mapGetters } from 'vuex'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { required, startsWith, maxLength } from '@/utils/validations'
import CreateOrEditRule from '@/components/Playbook/CreateOrEditRule'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import ReAnalyzeIncidentDialog from '@/components/IncidentResponder/ReAnalyzeIncidentDialog'
import SelectEmailTemplateModal from '@/components/IncidentResponder/SelectEmailTemplateModal'
import { getEmailTypesAndEmailTemplates } from '@/components/IncidentResponder/utils'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import IncidentResponderHeaderCards from '@/components/IncidentResponder/Dashboard/IncidentResponderHeaderCards'
import TopRules from '@/components/Common/Widget/WidgetComponents/TopRules'
import RecentInvestigations from '@/components/Common/Widget/WidgetComponents/RecentInvestigations'
import RecentlyReportedIncidents from '@/components/Common/Widget/WidgetComponents/RecentlyReportedIncidents'
import ReportedEmailTrends from '@/components/Common/Widget/WidgetComponents/ReportedEmailTrends'
import ConfirmationRequiredPopup from '@/components/IncidentResponder/ConfirmationRequiredPopup.vue'
export default {
  components: {
    ConfirmationRequiredPopup,
    ReportedEmailTrends,
    RecentlyReportedIncidents,
    RecentInvestigations,
    TopRules,
    IncidentResponderHeaderCards,
    SelectEmailTemplateModal,
    ReAnalyzeIncidentDialog,
    TheRecordsButton,
    Datatable,
    NewInvestigation,
    DataTableColorfulText,
    CreateOrEditRule,
    AppModal,
    FilterByHashModal
  },
  props: {
    isLoadState: {
      type: Boolean
    }
  },
  data: () => ({
    defaultHashfilterProps: {
      filterBy: 'MD5',
      hash: ''
    },
    hashfilterProps: {
      filterBy: 'MD5',
      hash: ''
    },
    extendedViewCallingApi: false,
    confirmationPayload: {},
    isShowConfirmationRequired: false,
    isExtendedViewSaveButtonDisabled: false,
    isFilterByHashModalVisible: false,
    waitingItemForApiItems: [],
    isShowEmailTemplateModal: false,
    dynamicReportedEmailProps: null,
    dynamicClusterProps: null,
    confirmationRequiredActionButtonDisabled: false,
    emailTemplates: [],
    templateTypes: [],
    confirmationDialogEmailCount: 0,
    confirmationDialogUserCount: 0,
    mailDetails: {
      name: '',
      resourceId: ''
    },
    showReAnalyzeIncidentDialog: false,
    isCustomOverflowedColumn: false,
    selectedCluster: '',
    selectedTemplateResourceId: '',
    isMultipleSelectedTemplateResourceId: false,
    defaultSelectedTemplateResourceId: '',
    labels,
    clusteredRow: null,
    isCustomMessageMultiple: false,
    reportedEmailsData: [],
    bindPropsIsSafari: {},
    reportedEmailsLoading: false,
    showPlaybookModal: false,
    selectedPlaybookId: null,
    selectedEmail: null,
    selectedMatch: null,
    extendedViewLoading: true,
    isShowingClusteredTable: false,
    showMatchingModal: false,
    validations: {
      required,
      startsWith,
      maxLength
    },
    extendedViewValue: [],
    emails: {
      savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL,
      savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.REPORTED_EMAIL,
      table: [],
      extendedViewOptions: {
        titleKey: 'subject',
        footer: [
          {
            label: 'Date Created',
            key: 'createTime'
          },
          {
            label: 'Last update',
            key: 'lastUpdateDate'
          }
        ],
        col: [
          {
            property: PROPERTY_STORE.SUBJECT,
            label: getStoreValue(PROPERTY_STORE.SUBJECT),
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.REPORTEDBY,
            label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.RESOURCEID,
            label: 'Case Id',
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.ANALYSISSOURCE,
            label: 'Analysis Source',
            isEditable: false,
            type: 'analysisSource',
            show: true
          },
          {
            property: PROPERTY_STORE.RESULT,
            label: getStoreValue(PROPERTY_STORE.RESULT),
            isEditable: true,
            type: 'badge',
            editOptions: {
              component: 'select',
              getDisabledValue(row) {
                return row.status === 'BeingAnalyzed'
              },
              props: {
                items: ['Phishing', 'Malicious', 'Undetected', 'Simulation']
              }
            },
            show: true
          },
          {
            property: PROPERTY_STORE.STATUS,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            isEditable: true,
            type: 'colorfulText',
            editOptions: {
              component: 'select',
              getDisabledValue(row) {
                return row.status === 'BeingAnalyzed'
              },
              props: {
                items: [
                  'Open',
                  'Closed',
                  { text: labels.InProgress, value: 'InProgress' },
                  { text: labels.FalsePositive, value: 'FalsePositive' }
                ]
              }
            },
            show: true
          },
          {
            property: 'tags',
            label: 'Tags',
            isEditable: true,
            type: 'smallBadge',
            editOptions: {
              component: 'combobox',
              props: {
                placeholder: 'Enter Tags'
              }
            },
            show: true,
            filterableType: 'text'
          },
          {
            property: 'note',
            label: labels.Notes,
            isEditable: true,
            type: 'text',
            editOptions: {
              component: 'textarea',
              getDisabledValue() {
                return false
              },
              props: {
                placeholder: 'Enter Notes',
                rules: [
                  (v) =>
                    Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Notes, 256))
                ]
              }
            },
            show: true
          }
        ]
      },
      addButton: {
        show: true,
        icon: null,
        label: 'FILTER BY MD5 OR sha512 Hash',
        action: 'on-filter-by-hash',
        tooltip: 'FILTER BY MD5 OR sha512 Hash',
        type: 'secondary',
        id: 'btn-select--show-filter-by-hash'
      },
      columns: [
        {
          property: PROPERTY_STORE.SUBJECT,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.SUBJECT),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'slot',
          width: 200,
          isEditable: false,
          isCustomOverflowedColumn: true,
          filterableType: 'text',
          parentRect: 'reported-email-subject',
          overrideWidth: true
        },
        {
          property: PROPERTY_STORE.ATTACHMENTCOUNT,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.ATTACHMENTCOUNT),
          hideLabel: true,
          fixed: false,
          sortable: true,
          show: true,
          isEditable: false,
          type: 'attachment',
          width: 160
        },
        {
          property: PROPERTY_STORE.REPORTEDBY,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '260',
          isEditable: false,
          filterableType: 'text'
        },
        {
          property: 'senderIp',
          filterableCustomFieldName: 'SenderIp',
          label: 'Sender IP',
          isEditable: false,
          type: 'text',
          show: true,
          filterableType: 'text',
          width: 200
        },
        {
          property: PROPERTY_STORE.RESOURCEID,
          show: false,
          label: 'Case Id',
          type: 'text',
          isEditable: false,
          hideOnSettingsPopup: true
        },
        {
          property: PROPERTY_STORE.ANALYSISSOURCE,
          isEditable: false,
          align: 'center',
          label: 'Analysis Source',
          fixed: false,
          sortable: false,
          show: true,
          type: 'analysisSource',
          filterableType: 'text',
          width: '200',
          fullWidth: true
        },
        {
          property: PROPERTY_STORE.RESULT,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.RESULT),
          fixed: false,
          sortable: false,
          show: true,
          type: 'badge',
          isEditable: true,
          filterableType: 'select',
          filterableItems: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
          editOptions: {
            component: 'select',
            getDisabledValue(row) {
              return row.status === 'BeingAnalyzed'
            },
            props: {
              items: ['Phishing', 'Malicious', { text: labels.NonMalicious, value: 'NonMalicious' }]
            }
          },
          props: {
            style: {
              maxWidth: '100px'
            }
          },
          width: '150'
        },
        {
          property: PROPERTY_STORE.STATUS,
          isEditable: true,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: false,
          sortable: true,
          show: true,
          type: 'slot',
          width: '150',
          showColorfulText: true,
          fullWidth: true,
          filterableType: 'select',
          filterableItems: [
            { text: labels.InAnalysis, value: 'BeingAnalyzed' },
            labels.Open,
            labels.Closed,
            { text: labels.InProgress, value: 'InProgress' },
            { text: labels.FalsePositive, value: 'FalsePositive' }
          ],
          editOptions: {
            component: 'select',
            getDisabledValue(row) {
              return row.status === 'BeingAnalyzed'
            },
            props: {
              items: [
                'Open',
                'Closed',
                { text: 'In Progress', value: 'InProgress' },
                { text: 'False Positive', value: 'FalsePositive' }
              ]
            }
          },
          props: {
            style: { maxWidth: '110px' }
          }
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
          editOptions: {
            component: 'datepicker'
          },
          width: '230',
          filterableType: 'date'
        },
        {
          property: PROPERTY_STORE.SENDERNAME,
          isEditable: false,
          align: 'left',
          label: LABEL_STORE.SENDERNAME,
          fixed: false,
          sortable: false,
          show: false,
          type: 'text',
          width: '200',
          fullWidth: true,
          filterableType: 'text'
        },
        {
          property: PROPERTY_STORE.SENDERADDRESS,
          isEditable: false,
          align: 'left',
          label: LABEL_STORE.SENDERADDRESS,
          fixed: false,
          sortable: false,
          show: false,
          type: 'text',
          width: '200',
          fullWidth: true,
          filterableType: 'text'
        },
        {
          property: 'tags',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.RESULTTAG),
          fixed: false,
          sortable: false,
          show: true,
          type: 'smallBadge',
          isEditable: true,
          editOptions: {
            component: 'combobox',
            props: {
              placeholder: 'Enter Tags'
            }
          },
          width: '150',
          filterableType: 'text'
        }
      ],
      firstColumnProperties: {
        parentRect: 'reported-email-subject',
        overrideWidth: true,
        fixed: 'left',
        isCustomOverflowedColumn: true,
        type: 'slot'
      },
      subjectColumn: {
        property: PROPERTY_STORE.SUBJECT,
        align: 'left',
        label: getStoreValue(PROPERTY_STORE.SUBJECT),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 200,
        isEditable: false,
        filterableType: 'text'
      },
      reportedByColumn: {
        property: PROPERTY_STORE.REPORTEDBY,
        align: 'left',
        editable: false,
        label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: '260',
        isEditable: false,
        filterableType: 'text'
      },
      rowActions: [
        {
          name: labels.Edit,
          id: 'btn-edit--incident-responder-emails-row-actions',
          icon: 'mdi-pencil',
          action: 'edit',
          isNotShow: true
        },
        {
          name: labels.PreviewEmail,
          id: 'btn-preview-email--incident-responder-emails-row-actions',
          icon: 'mdi-eye',
          action: 'irPreview'
        },
        {
          name: labels.Details,
          id: 'btn-details--incident-responder-emails-row-actions',
          icon: 'mdi-text-box-multiple',
          action: 'handleDetails'
        },
        {
          name: labels.Investigate,
          id: 'btn-investigate--incident-responder-emails-row-actions',
          icon: 'mdi-magnify',
          action: 'handleInvestigate'
        },
        {
          name: labels.ReAnalyze,
          id: 'btn-re-analyze--incident-responder-emails-row-actions',
          icon: 'mdi-refresh',
          action: 'handleReAnalyze',
          disabled: false
        }
      ],
      addMenu: {
        show: true,
        popUp: false
      },
      iEmpty: {
        message: labels.EmptyReportedEmailText,
        subMes: labels.EmptyReportedEmailSubText,
        btn: labels.PhishingReporterSettings,
        icon: 'mdi-arrow-right',
        id: 'btn-empty--incident-responder-phishing-reporter'
      },
      selectEvent: {
        clipboard: true,
        edit: true,
        download: false
      }
    },
    serverSideProps: new ServerSideProps(),
    serverSideClusteredProps: new ServerSideProps(),
    isWantToAddNewInvestigation: false,
    extendedView: {
      isNotify: true,
      isMessage: false,
      customMessage: ''
    },
    defaultExtendedViewValues: {
      isNotify: true,
      isMessage: false,
      customMessage: ''
    },
    hasMultipleNoteValue: false,
    requestBodyReportedEmails: getDefaultAxiosPayload(),
    isReportedEmailsClusteredLoading: false,
    clusteredTable: {
      savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL_CLUSTERED,
      savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CLUSTERED_REPORTED_EMAIL,
      addButton: {
        show: true,
        icon: null,
        label: 'FILTER BY MD5 OR sha512 Hash',
        action: 'on-filter-by-hash',
        tooltip: 'FILTER BY MD5 OR sha512 Hash',
        type: 'secondary',
        id: 'btn-select--show-filter-by-hash'
      },
      columns: [
        {
          property: PROPERTY_STORE.SUBJECT,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.SUBJECT),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: '300',
          isEditable: false,
          filterableType: 'text'
        },
        {
          property: PROPERTY_STORE.ATTACHMENTCOUNT,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.ATTACHMENTCOUNT),
          hideLabel: true,
          fixed: false,
          sortable: true,
          show: true,
          isEditable: false,
          type: 'attachment',
          width: 160
        },
        {
          property: PROPERTY_STORE.REPORTEDBY,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '260',
          isEditable: false,
          filterableType: 'text'
        },
        {
          property: PROPERTY_STORE.RESOURCEID,
          show: false,
          label: 'Case Id',
          type: 'text',
          isEditable: false,
          hideOnSettingsPopup: true
        },
        {
          property: PROPERTY_STORE.ANALYSISSOURCE,
          isEditable: false,
          align: 'center',
          label: 'Analysis Source',
          fixed: false,
          sortable: false,
          show: true,
          filterableType: 'text',
          type: 'analysisSource',
          width: '200',
          fullWidth: true
        },
        {
          property: PROPERTY_STORE.RESULT,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.RESULT),
          fixed: false,
          sortable: false,
          show: true,
          type: 'badge',
          isEditable: true,
          filterableType: 'select',
          filterableItems: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
          props: {
            style: {
              maxWidth: '110px'
            }
          },
          width: '150'
        },
        {
          property: PROPERTY_STORE.STATUS,
          isEditable: true,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: false,
          sortable: true,
          show: true,
          type: 'slot',
          width: '150',
          showColorfulText: true,
          fullWidth: true,
          filterableType: 'select',
          filterableItems: [
            { text: labels.InAnalysis, value: 'BeingAnalyzed' },
            labels.Open,
            labels.Closed,
            { text: labels.InProgress, value: 'InProgress' },
            { text: labels.FalsePositive, value: 'FalsePositive' }
          ],
          props: {
            style: { maxWidth: '110px' }
          }
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
          width: '230',
          filterableType: 'date'
        },
        {
          property: 'tags',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.RESULTTAG),
          fixed: false,
          sortable: false,
          show: true,
          type: 'smallBadge',
          isEditable: true,
          width: '150',
          filterableType: 'text'
        }
      ],
      iEmpty: {
        message: labels.EmptyReportedEmailText,
        subMes: labels.EmptyReportedEmailSubText,
        btn: labels.PhishingReporterSettings,
        icon: 'mdi-arrow-right',
        id: 'btn-empty--incident-responder-cluster-phishing-reporter'
      },
      extendedViewOptions: {
        titleKey: 'subject',
        footer: [
          {
            label: 'Date Created',
            key: 'createTime'
          },
          {
            label: 'Last update',
            key: 'lastUpdateDate'
          }
        ],
        col: [
          {
            property: PROPERTY_STORE.SUBJECT,
            label: getStoreValue(PROPERTY_STORE.SUBJECT),
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.REPORTEDBY,
            label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.RESOURCEID,
            label: 'Case Id',
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.ANALYSISSOURCE,
            label: 'Analysis Source',
            isEditable: false,
            type: 'analysisSource',
            show: true
          },
          {
            property: PROPERTY_STORE.RESULT,
            label: getStoreValue(PROPERTY_STORE.RESULT),
            isEditable: true,
            type: 'badge',
            editOptions: {
              component: 'select',
              getDisabledValue(row) {
                return row.status === 'BeingAnalyzed'
              },
              props: {
                items: ['Phishing', 'Malicious', 'Undetected', 'Simulation']
              }
            },
            show: true
          },
          {
            property: PROPERTY_STORE.STATUS,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            isEditable: true,
            type: 'colorfulText',
            editOptions: {
              component: 'select',
              getDisabledValue(row) {
                return row.status === 'BeingAnalyzed'
              },
              props: {
                items: [
                  'Open',
                  'Closed',
                  { text: labels.InProgress, value: 'InProgress' },
                  { text: labels.FalsePositive, value: 'FalsePositive' }
                ]
              }
            },
            show: true
          },
          {
            property: 'tags',
            label: 'Tags',
            isEditable: true,
            type: 'smallBadge',
            editOptions: {
              component: 'combobox',
              props: {
                placeholder: 'Enter Tags'
              }
            },
            show: true
          },
          {
            property: 'note',
            label: labels.Notes,
            isEditable: true,
            type: 'text',
            editOptions: {
              component: 'textarea',
              getDisabledValue() {
                return false
              },
              props: {
                placeholder: 'Enter Notes',
                rules: [
                  (v) =>
                    Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Notes, 256))
                ]
              }
            },
            show: true,
            showOnlyPreview: true
          }
        ]
      },
      selectEvent: {
        clipboard: true,
        edit: true,
        download: false
      },
      rowActions: [
        {
          name: labels.Edit,
          icon: 'mdi-pencil',
          id: 'btn-edit--incident-responder-clustered-emails-row-actions',
          action: 'edit',
          isNotShow: true
        },
        {
          name: labels.PreviewEmail,
          id: 'btn-preview-email--incident-responder-clustered-emails-row-actions',
          icon: 'mdi-eye',
          action: 'irPreview'
        },
        {
          name: labels.Details,
          id: 'btn-details--incident-responder-clustered-emails-row-actions',
          icon: 'mdi-text-box-multiple',
          action: 'handleDetails'
        },
        {
          name: labels.Investigate,
          id: 'btn-investigate--incident-responder-clustered-emails-row-actions',
          icon: 'mdi-magnify',
          action: 'handleInvestigate'
        }
      ]
    },
    clusteredTableData: [],
    clusteredTableAxios: getDefaultAxiosPayload(),
    isExtendedViewCancelButtonDisabled: false
  }),
  computed: {
    ...mapGetters({
      getIncidentResponderTopRulesPermission: 'permissions/getIncidentResponderTopRulesPermission',
      getIncidentResponderRunningInvestigationsPermission:
        'permissions/getIncidentResponderRunningInvestigationsPermission',
      getIncidentResponderNotifiedEmailPermission:
        'permissions/getIncidentResponderNotifiedEmailPermission',
      getIncidentResponderNotifiedEmailReAnalyze:
        'permissions/getIncidentResponderNotifiedEmailReAnalyze',
      getDashboardReportedEmailTrendsPermission:
        'permissions/getDashboardReportedEmailTrendsPermission'
    }),
    isParentTableHashFilterActive() {
      return !!this.requestBodyReportedEmails?.filter?.FilterGroups[0]?.FilterItems.find((item) =>
        ['MD5', 'SHA512'].includes(item.FieldName)
      )
    },
    isClusteredTableHashFilterActive() {
      return !!this.clusteredTableAxios?.filter?.FilterGroups[0]?.FilterItems.find((item) =>
        ['MD5', 'SHA512'].includes(item.FieldName)
      )
    },
    getReportedEmailTitle() {
      return this.isShowingClusteredTable
        ? this.clusteredRow[this.getClusteredField(this.selectedCluster)]
        : labels.ReportedEmails
    },
    getReportedEmailDescription() {
      return this.isShowingClusteredTable
        ? `Reported emails clustered by ${this.selectedCluster}`
        : labels.SummaryOfReportedEmails
    },
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    },
    getEmailTemplateName() {
      if (this.isMultipleSelectedTemplateResourceId) return '(Multiple Values)'
      const template = this.emailTemplates.find(
        (item) => item.resourceId === this.selectedTemplateResourceId
      )
      const rightSideText = template?.isDefault ? `(${labels.Default})` : ''
      return template && `${template.name} ${rightSideText}`
    }
  },
  watch: {
    isParentTableHashFilterActive(val) {
      if (val) {
        this.emails.addButton.label = `CLEAR FILTER BY MD5 OR sha512 Hash`
        this.emails.addButton.tooltip = `CLEAR FILTER BY MD5 OR sha512 Hash`
      } else {
        this.emails.addButton.label = `FILTER BY MD5 OR sha512 Hash`
        this.emails.addButton.tooltip = `FILTER BY MD5 OR sha512 Hash`
      }
    },
    isClusteredTableHashFilterActive(val) {
      if (val) {
        this.clusteredTable.addButton.label = `CLEAR FILTER BY MD5 OR sha512 Hash`
        this.clusteredTable.addButton.tooltip = `CLEAR FILTER BY MD5 OR sha512 Hash`
      } else {
        this.clusteredTable.addButton.label = `FILTER BY MD5 OR sha512 Hash`
        this.clusteredTable.addButton.tooltip = `FILTER BY MD5 OR sha512 Hash`
      }
    },
    getIncidentResponderNotifiedEmailReAnalyze: {
      immediate: true,
      handler(newValue) {
        this.emails.rowActions[4].disabled = !newValue
      }
    }
  },
  created() {
    this.$store.dispatch('widgets/callForWidgets', { isLoading: false })
    this.getReportedEmailPersistentStateAndLoad()
    this.getClusteredEmailPersistentStateAndLoad()
    if (handleIsSafari()) {
      this.bindPropsIsSafari['handleSetCellClass'] = (obj) => {
        return setSafariClusterFix(obj, 'subject')
      }
    }
    this.getEmailTypesAndEmailTemplates()
  },
  beforeDestroy() {
    const tableState = this.$refs.refReportedEmails.getState()
    let clusteredTableState
    if (this.isShowingClusteredTable) {
      clusteredTableState = this.$refs.refReportedEmailsClustered.getState()
    }
    const payload = {
      tableState,
      clusteredTableState,
      serverSideProps: this.serverSideProps,
      serverSideClusteredProps: this.serverSideClusteredProps,
      clusteredRow: this.clusteredRow,
      selectedCluster: this.selectedCluster,
      requestBodyReportedEmails: JSON.parse(JSON.stringify(this.requestBodyReportedEmails)),
      clusteredTableAxios: JSON.parse(JSON.stringify(this.clusteredTableAxios)),
      isShowingClusteredTable: this.isShowingClusteredTable
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'Incident Responder',
      payload
    })
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    handleConfirmationRequiredClose() {
      this.isExtendedViewSaveButtonDisabled = false
      this.isShowConfirmationRequired = false
    },
    handleFilterByHash() {
      if (this.isParentTableHashFilterActive || this.isClusteredTableHashFilterActive) {
        this.clearFilterByHashProps()
      } else {
        this.isFilterByHashModalVisible = true
      }
    },
    clearFilterByHashProps() {
      this.hashfilterProps = { ...this.defaultHashfilterProps }
      if (this.isShowingClusteredTable) {
        const clusteredHashFilterIndex = this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => ['MD5', 'SHA512'].includes(item.FieldName)
        )
        if (clusteredHashFilterIndex !== -1) {
          this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.splice(
            clusteredHashFilterIndex,
            1
          )
        }
        this.callForClusteredTable()
      } else {
        const hashFilterIndex = this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => ['MD5', 'SHA512'].includes(item.FieldName)
        )
        if (hashFilterIndex !== -1) {
          this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems.splice(
            hashFilterIndex,
            1
          )
        }
        this.callForSearchNotifiedMail()
      }
    },
    confirmFilterByHash() {
      if (this.clusteredRow) {
        const hashFilterIndex = this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => ['MD5', 'SHA512'].includes(item.FieldName)
        )
        if (hashFilterIndex !== -1) {
          this.clusteredTableAxios.filter.FilterGroups[0].FilterItems[
            hashFilterIndex
          ].FieldName = this.hashfilterProps.filterBy
          this.clusteredTableAxios.filter.FilterGroups[0].FilterItems[
            hashFilterIndex
          ].Value = this.hashfilterProps.hash
          this.clusteredTableAxios.filter.FilterGroups[0].FilterItems[hashFilterIndex].Operator =
            '='
        } else {
          this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.push({
            FieldName: this.hashfilterProps.filterBy,
            Value: this.hashfilterProps.hash,
            Operator: '='
          })
        }
        this.callForClusteredTable()
      } else {
        const hashFilterIndex = this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems.findIndex(
          (item) => ['MD5', 'SHA512'].includes(item.FieldName)
        )
        if (hashFilterIndex !== -1) {
          this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems[
            hashFilterIndex
          ].FieldName = this.hashfilterProps.filterBy
          this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems[
            hashFilterIndex
          ].Value = this.hashfilterProps.hash
          this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems[
            hashFilterIndex
          ].Operator = '='
        } else {
          this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems.push({
            FieldName: this.hashfilterProps.filterBy,
            Value: this.hashfilterProps.hash,
            Operator: '='
          })
        }
        this.callForSearchNotifiedMail()
      }
      this.closeFilterByHashModal()
    },
    closeFilterByHashModal() {
      this.isFilterByHashModalVisible = false
    },
    handleOnExtendedViewStatusChange(status) {
      if (!status) {
        this.extendedViewValue = []
        this.waitingItemForApiItems = []
      }
    },
    handleEmailTemplateChange() {
      this.toggleEmailTemplateModal()
    },
    getEmailTypesAndEmailTemplates() {
      getEmailTypesAndEmailTemplates().then((response) => {
        const [emailTemplatesResponse, templateTypesResponse] = response
        this.emailTemplates = emailTemplatesResponse.data.data.results
        if (this.emailTemplates[0]) {
          this.emailTemplates[0].isDefault = true
        }
        this.templateTypes = templateTypesResponse
      })
    },
    toggleEmailTemplateModal() {
      this.isShowEmailTemplateModal = !this.isShowEmailTemplateModal
    },
    handleConfirmSelectedEmailTemplate(resourceId = '') {
      this.selectedTemplateResourceId = resourceId
      this.isMultipleSelectedTemplateResourceId = false
      this.toggleEmailTemplateModal()
    },
    getReportedEmailPersistentStateAndLoad() {
      if (this.isLoadState) {
        const persistentStateContainer = this.isPersistentState()
        if (persistentStateContainer) {
          this.requestBodyReportedEmails = persistentStateContainer.requestBodyReportedEmails
          this.initMethods(true)
          const { tableState, serverSideProps, selectedCluster } = persistentStateContainer
          this.serverSideProps = serverSideProps
          if (selectedCluster) {
            this.changeFirstColumnWidth(360)
          }
          this.selectedCluster = selectedCluster
          this.dynamicReportedEmailProps = { persistentState: tableState }
        } else {
          this.initMethods()
        }
      } else {
        this.initMethods()
      }
    },
    initDatas() {
      this.callForSearchNotifiedMail()
      if (this.clusteredRow) {
        this.callForClusteredTable()
      }
      this.$store.dispatch('widgets/callForWidgets', { isLoading: false })
      this.$refs.refIncidentResponderCards.callForData()
    },
    toggleShowReAnalyzeDialog() {
      this.showReAnalyzeIncidentDialog = !this.showReAnalyzeIncidentDialog
    },
    isPersistentState() {
      return (
        this.$store.state['datatable'].tables['Incident Responder'] &&
        this.$store.state['datatable'].tables['Incident Responder'].payload
      )
    },
    handleMessageChange(val) {
      if (!val) {
        this.extendedView.customMessage = ''
      }
    },
    getClusteredEmailPersistentStateAndLoad() {
      if (!this.isLoadState) {
        return
      }
      const persistentStateContainer = this.isPersistentState()
      if (!persistentStateContainer || !persistentStateContainer.isShowingClusteredTable) {
        return
      }
      const {
        isShowingClusteredTable,
        clusteredTableAxios,
        serverSideClusteredProps,
        clusteredRow,
        clusteredTableState
      } = persistentStateContainer

      this.clusteredTableAxios = clusteredTableAxios
      this.serverSideClusteredProps = serverSideClusteredProps
      this.clusteredRow = clusteredRow
      this.dynamicClusterProps = { persistentState: clusteredTableState }
      this.isShowingClusteredTable = isShowingClusteredTable
    },
    handleReAnalyze(row = {}) {
      this.mailDetails.name = row.subject
      this.mailDetails.resourceId = row.resourceId
      this.toggleShowReAnalyzeDialog()
    },
    handleBackClick() {
      this.isShowingClusteredTable = false
      this.clusteredRow = null
      this.clusteredTable.columns[0].fixed = 'left'
      this.resetClusteredTableParams()
    },
    resetClusteredTableParams() {
      this.clusteredTableAxios.pageNumber = 1
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems = []
      this.clusteredTableAxios.filter.FilterGroups[1].FilterItems = []
    },
    serverSideSizeChanged(pageSize = 10) {
      this.requestBodyReportedEmails.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearchNotifiedMail()
    },
    serverSideClusteredSizeChanged(pageSize = 10) {
      this.clusteredTableAxios.pageSize = pageSize
      this.serverSideClusteredProps.pageSize = pageSize
      this.resetClusteredPageNumber()
      this.callForClusteredTable()
    },
    resetClusteredPageNumber() {
      this.clusteredTableAxios.pageNumber = 1
      this.serverSideClusteredProps.pageNumber = 1
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.requestBodyReportedEmails.pageNumber = pageNumber
      this.callForSearchNotifiedMail()
    },
    serverSideClusteredPageNumberChanged(pageNumber = 1) {
      this.clusteredTableAxios.pageNumber = pageNumber
      this.callForClusteredTable()
    },
    sortChanged({ order, prop } = {}) {
      this.requestBodyReportedEmails.ascending = order === 'ascending'
      this.requestBodyReportedEmails.orderBy = prop
      this.callForSearchNotifiedMail()
    },
    sortClusteredChanged({ order, prop } = {}) {
      this.clusteredTableAxios.ascending = order === 'ascending'
      this.clusteredTableAxios.orderBy = prop
      this.callForClusteredTable()
    },
    changeColumnsOrder(selectedCluster = '') {
      selectedCluster = this.getClusteredField(selectedCluster)
      const { columns } = this.emails
      if (selectedCluster === PROPERTY_STORE.SUBJECT) {
        if (columns[0].property !== PROPERTY_STORE.SUBJECT) {
          const copyOfAttachmentCount = JSON.parse(JSON.stringify(columns[2]))
          const copyOfReportedBy = JSON.parse(JSON.stringify(this.emails.reportedByColumn))
          this.$set(this.emails.columns, 0, {
            ...JSON.parse(JSON.stringify(this.emails.subjectColumn)),
            ...this.emails.firstColumnProperties,
            fixed: this.emails.columns[0].fixed
          })
          this.$set(this.emails.columns, 1, copyOfAttachmentCount)
          this.$set(this.emails.columns, 2, copyOfReportedBy)
        }
      } else if (selectedCluster === PROPERTY_STORE.REPORTEDBY) {
        if (columns[0].property !== PROPERTY_STORE.REPORTEDBY) {
          const copyOfAttachmentCount = JSON.parse(JSON.stringify(columns[1]))
          const copyOfSubject = JSON.parse(JSON.stringify(this.emails.subjectColumn))
          this.$set(this.emails.columns, 0, {
            ...JSON.parse(JSON.stringify(this.emails.reportedByColumn)),
            ...this.emails.firstColumnProperties,
            fixed: this.emails.columns[0].fixed
          })
          this.$set(this.emails.columns, 1, copyOfSubject)
          this.$set(this.emails.columns, 2, copyOfAttachmentCount)
        }
      }
    },
    clusterChanged(selectedCluster = '') {
      this.resetTableFilters()
      this.changeColumnsOrder(selectedCluster)
      this.changeFirstColumnWidth(360)
      this.hashfilterProps = { ...this.defaultHashfilterProps }
      this.requestBodyReportedEmails.pageNumber = 1
      this.requestBodyReportedEmails.clusteredBy = this.getClusteredField(selectedCluster)
      this.isCustomOverflowedColumn = true
      this.selectedCluster = selectedCluster
      this.callForSearchNotifiedMail()
    },
    resetTableFilters() {
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = []
      this.requestBodyReportedEmails.filter.FilterGroups[1].FilterItems = []
      if (this.$refs.refReportedEmails) {
        const { refReportedEmails } = this.$refs
        refReportedEmails.search = ''
        refReportedEmails.$refs.elTableRef.clearSelection()
        refReportedEmails.serverSideSelectionCount = 0
        refReportedEmails.excludedResourceIdList = []
        refReportedEmails.isSelectedAllEver = false
      }
      if (this.$refs.refReportedEmailsClustered) {
        const { refReportedEmailsClustered } = this.$refs
        refReportedEmailsClustered.$refs.elTableRef.clearSelection()
        refReportedEmailsClustered.excludedResourceIdList = []
        refReportedEmailsClustered.isSelectedAllEver = false
        refReportedEmailsClustered.serverSideSelectionCount = 0
      }
      this.$refs.refReportedEmails.reRenderFilters({})
    },
    handleRecordButtonClick(row) {
      this.clusteredRow = row
      this.dynamicClusterProps = null
      this.setClusteredTableFilters()
      const persistentStateContainer = this.$refs.refReportedEmails.getState()
      let { filterValues = {}, search, sortProps } = persistentStateContainer
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL_CLUSTERED)
      )

      if (savedFilter && savedFilter.filterValues) {
        filterValues = { ...savedFilter.filterValues, ...filterValues }
      }
      this.dynamicClusterProps = {
        persistentState: {
          currentPage: 1,
          expandedRows: [],
          firstColFixed: true,
          filteredDataLength: 0,
          search: JSON.parse(JSON.stringify(search)),
          showfilteredData: false,
          tableData: [],
          initialData: [],
          filteredData: [],
          filterValues,
          lastColFixed: true,
          rowCount: this.countRow || 10,
          isSelectedAll: false,
          selectedCluster: '',
          sortProps,
          serverSideSelectionCount: 0,
          isSelectedAllEver: false,
          excludedResourceIdList: [],
          unRenderedFilterData: [],
          totalLength: 0,
          renderedColumns: [],
          selectionRowCheckboxDeterminate: false,
          multipleSelection: []
        }
      }
      this.callForClusteredTable()
      this.toggleIsShowingClusteredTable()
    },
    setClusteredTableFilters() {
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems = [
        ...this.clusteredTableAxios.filter.FilterGroups[0].FilterItems,
        ...JSON.parse(
          JSON.stringify(this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems)
        )
      ]

      this.clusteredTableAxios.filter.FilterGroups[1].FilterItems = [
        ...this.clusteredTableAxios.filter.FilterGroups[1].FilterItems,
        ...JSON.parse(
          JSON.stringify(this.requestBodyReportedEmails.filter.FilterGroups[1].FilterItems)
        )
      ]
    },
    callForClusteredTable() {
      if (this.getIncidentResponderNotifiedEmailPermission) {
        this.isReportedEmailsClusteredLoading = true
        this.setClusteredFilter()
        searchNotifiedMail(this.clusteredTableAxios)
          .then((response) => {
            const {
              totalNumberOfRecords,
              totalNumberOfPages,
              pageNumber,
              results
            } = response.data.data
            this.serverSideClusteredProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideClusteredProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideClusteredProps.pageNumber = pageNumber
            this.removeClusteredFilter()
            this.clusteredTableData = results
          })
          .finally(() => (this.isReportedEmailsClusteredLoading = false))
      }
    },
    setClusteredFilter() {
      let fieldName = this.getClusteredField(this.selectedCluster)
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.unshift({
        FieldName: fieldName,
        Operator: '=',
        Value: this.clusteredRow[fieldName] || '{none}'
      })
    },
    getClusteredField(field = '') {
      field = field.replace(/\s/, '')
      return field.substring(0, 1).toLowerCase() + field.substring(1, field.length)
    },
    removeClusteredFilter() {
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems.splice(0, 1)
    },
    toggleIsShowingClusteredTable() {
      this.isShowingClusteredTable = !this.isShowingClusteredTable
    },
    handleListBulletedClick() {
      this.changeFirstColumnWidth()
      this.requestBodyReportedEmails.clusteredBy = ''
      this.isCustomOverflowedColumn = false
      this.selectedCluster = ''
      this.resetTableFilters()
      this.callForSearchNotifiedMail()
    },
    extendedViewDisableChanger() {
      if (this.isExtendedViewSaveButtonDisabled) return true
      return (
        JSON.stringify(this.defaultExtendedViewValues) === JSON.stringify(this.extendedView) &&
        this.selectedTemplateResourceId === this.defaultSelectedTemplateResourceId
      )
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.emails.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.requestBodyReportedEmails.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForSearchNotifiedMail()
    },
    handleClusteredSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.clusteredTable.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.clusteredTableAxios.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetClusteredPageNumber()
      this.callForClusteredTable()
    },
    resetPageNumber() {
      this.requestBodyReportedEmails.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    initMethods(isLoadState = false) {
      if (!isLoadState) {
        this.callForSearchNotifiedMail()
      }
    },
    closePlaybookWithUpdate() {
      this.togglePlaybookModal()
      this.initMethods()
    },
    handleRouteToInvestigationDetails(resp) {
      if (resp?.data?.data?.resourceId) {
        this.$router.push(
          `/incident-responder/investigations/investigation-details/${resp.data.data.resourceId}`
        )
      }
    },
    handeRuleNameClick(resourceId) {
      this.selectedPlaybookId = resourceId
      this.showPlaybookModal = true
    },
    togglePlaybookModal() {
      this.selectedPlaybookId = null
      this.showPlaybookModal = !this.showPlaybookModal
    },
    togglePlaybookModalWithSelected(selectedPlaybookId) {
      this.selectedPlaybookId = selectedPlaybookId
      this.showPlaybookModal = !this.showPlaybookModal
    },
    getDataTableFieldLabel(text) {
      return getDataTableFieldLabel(text)
    },
    onEditClick({ selected: selections, isEditPopupOpen, isMultiple, isSelectedAllEver }) {
      if (isEditPopupOpen && selections.length) {
        this.extendedViewLoading = true
        if (selections.length === 1 && (!isMultiple || !this.extendedViewValue.length)) {
          this.isMultipleSelectedTemplateResourceId = false
          getNotifiedEmailForEdit(selections[0].resourceId)
            .then((response) => {
              const selectedItem = response.data.data
              this.selectedTemplateResourceId =
                selectedItem.notificationTemplateResourceId || this?.emailTemplates[0]?.resourceId
              this.defaultSelectedTemplateResourceId = this.selectedTemplateResourceId
              this.extendedView.isNotify = selectedItem.isNotifyUser
              this.extendedView.customMessage = selectedItem.customMessage
              this.extendedView.isMessage = !!selectedItem.customMessage
              this.defaultExtendedViewValues.isNotify = selectedItem.isNotifyUser
              this.defaultExtendedViewValues.customMessage = selectedItem.customMessage
              this.defaultExtendedViewValues.isMessage = !!selectedItem.customMessage
              this.extendedViewValue = [
                {
                  ...selectedItem,
                  note: selectedItem.note || '',
                  resourceId: selections[0].resourceId,
                  reportedBy: selections[0].reportedBy,
                  matchingPlaybooks: selections[0].matchingPlaybooks,
                  source: selections[0].source
                }
              ]
            })
            .finally(() => (this.extendedViewLoading = false))
          this.hasMultipleNoteValue = false
        } else if (selections.length > 1 || isMultiple) {
          const rows = []
          let index = 0

          this.extendedViewLoading = true
          const promises = []
          if (!isSelectedAllEver) {
            const removedItems = this.extendedViewValue.filter(
              (extendedViewItem) =>
                !selections.find(({ resourceId }) => resourceId === extendedViewItem.resourceId)
            )
            if (removedItems.length) {
              removedItems.forEach((removedItem) => {
                const index = this.extendedViewValue.findIndex(
                  (item) => item.resourceId === removedItem.resourceId
                )
                this.waitingItemForApiItems.splice(
                  this.waitingItemForApiItems.indexOf(removedItem.resourceId),
                  1
                )

                this.extendedViewValue.splice(index, 1)
              })
              if (this.extendedViewValue.length) {
                this.compareAndChangeExtendedViewParams(this.extendedViewValue)
              }
            }
          }

          const newItems = selections.filter(
            (item) =>
              !this.extendedViewValue.find(
                (extendedViewItem) => extendedViewItem.resourceId === item.resourceId
              )
          )

          newItems.map((item) => {
            if (!this.waitingItemForApiItems.includes(item.resourceId)) {
              if (!isSelectedAllEver) {
                this.waitingItemForApiItems.push(item.resourceId)
              }
              promises.push(getNotifiedEmail(item.resourceId))
              index++
            }
          })
          Promise.all(promises)
            .then((responses) => {
              responses.forEach((response, ind) => {
                this.setExtendedViewValue(
                  response.data.data,
                  rows,
                  newItems,
                  ind === responses.length - 1,
                  ind,
                  selections
                )
              })
            })
            .finally(() => {
              this.extendedViewLoading = false
            })
        } else {
          this.extendedView.customMessage = ''
          this.extendedView.isMessage = false
          this.extendedView.isNotify = true
          this.defaultExtendedViewValues.customMessage = ''
          this.defaultExtendedViewValues.isMessage = false
          this.defaultExtendedViewValues.isNotify = true
          this.hasMultipleNoteValue = false
        }
      } else {
        this.isMultipleSelectedTemplateResourceId = false
        this.extendedViewValue = []
      }
    },
    setExtendedViewValue(selectedItem, rows, selections, shouldRender, ind, allSelections) {
      rows.push({
        ...selectedItem,
        note: selectedItem.note || '',
        resourceId: selections[ind].resourceId,
        reportedBy: selections[ind].reportedBy,
        matchingPlaybooks: selections[ind].matchingPlaybooks,
        source: selections[ind].source
      })
      const index = this.waitingItemForApiItems.indexOf(selections[ind].resourceId)
      if (index > -1) this.waitingItemForApiItems.splice(index, 1)

      if (shouldRender) {
        this.compareAndChangeExtendedViewParams(rows, allSelections)
      }
    },
    compareAndChangeExtendedViewParams(rows, allSelections) {
      if (allSelections && allSelections.length !== rows.length) {
        rows = [...this.extendedViewValue, ...rows]
      }
      const note = rows[0].note
      rows.forEach((item) => {
        if (item.note !== note) {
          this.hasMultipleNoteValue = true
        }
      })
      const sets = {
        isNotifyUser: new Set(),
        customMessage: new Set(),
        notificationTemplateResourceId: new Set()
      }
      rows.forEach((item) => {
        sets.isNotifyUser.add(item.isNotifyUser)
        sets.customMessage.add(item.customMessage)
        item.notificationTemplateResourceId =
          item.notificationTemplateResourceId || this?.emailTemplates[0]?.resourceId
        sets.notificationTemplateResourceId.add(item.notificationTemplateResourceId)
      })
      if (sets.notificationTemplateResourceId.size > 1) {
        this.selectedTemplateResourceId = ''
        this.isMultipleSelectedTemplateResourceId = true
      } else {
        if (sets.notificationTemplateResourceId.size === 1) {
          this.selectedTemplateResourceId = [...sets.notificationTemplateResourceId][0]
        }
        this.isMultipleSelectedTemplateResourceId = false
      }
      if (sets.isNotifyUser.size === 1) {
        this.extendedView.isNotify = sets.isNotifyUser.has(true)
      } else {
        this.extendedView.isNotify = true
      }
      if (this.extendedView.isNotify) {
        if (sets.customMessage.size === 1) {
          if (sets.customMessage.has('')) {
            this.extendedView.isMessage = false
            this.extendedView.customMessage = ''
          } else {
            this.extendedView.isMessage = true
            this.extendedView.customMessage = [...sets.customMessage][0]
          }
        } else {
          this.extendedView.isMessage = true
          this.extendedView.customMessage = ''
          this.isCustomMessageMultiple = true
        }
      } else {
        this.extendedView.isMessage = false
        this.extendedView.customMessage = ''
      }
      this.defaultExtendedViewValues.isNotify = this.extendedView.isNotify
      this.defaultExtendedViewValues.customMessage = this.extendedView.customMessage
      this.defaultExtendedViewValues.isMessage = this.extendedView.isMessage

      this.extendedViewValue = rows
    },
    callForSearchNotifiedMail() {
      if (this.getIncidentResponderNotifiedEmailPermission) {
        this.reportedEmailsLoading = true
        searchNotifiedMail(this.requestBodyReportedEmails)
          .then((response) => {
            const {
              totalNumberOfRecords,
              totalNumberOfPages,
              pageNumber,
              results
            } = response.data.data

            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.reportedEmailsData = results || []
            if (this.selectedCluster) {
              this.changeFirstColumnWidth(360)
            }
          })
          .finally(() => {
            this.reportedEmailsLoading = false
          })
      }
    },
    changeFirstColumnWidth(width = 200) {
      if (this?.$refs?.refReportedEmails?.$refs?.elTableRef)
        this.$refs.refReportedEmails.$refs.elTableRef.columns[1].width = width
    },
    matchingPopupClick(match) {
      this.selectedMatch = match
      this.showMatchingModal = true
    },
    onEmptyBtnClicked() {
      this.$router.push({
        path: '/incident-responder/investigations',
        query: { openPopup: true }
      })
    },
    onEmptyReportedEmailsBtnClicked() {
      this.$router.push({
        name: 'Phishing Reporter',
        params: { tab: 'phishing-reporter-settings' }
      })
    },
    irPreviewOnClick(row) {
      window.open(
        `${window.location.href}/reported-emails/email-details/${row.resourceId}?tab=third`
      )
    },
    handleIsNotify(value) {
      if (!value) {
        this.extendedView.isMessage = false
        this.extendedView.customMessage = ''
      }
    },
    handleEdit(selectedRows = [], excludedResourceIdList = [], isSelectedAllEver = false) {
      this.confirmationPayload = { selectedRows, excludedResourceIdList, isSelectedAllEver }
      if (!(selectedRows.length > 1 || (this.selectedCluster && !this.isShowingClusteredTable))) {
        this.handleEditAfterConfirmation(this.confirmationPayload)
        return
      }
      const payload = this.getEditBulkPayload(
        selectedRows,
        excludedResourceIdList,
        isSelectedAllEver
      )
      confirmationRequiredForEdit(payload).then((response) => {
        const {
          data: { data = {} }
        } = response || {}
        this.confirmationDialogUserCount = data.userCount
        this.confirmationDialogEmailCount = data.emailCount
        this.isShowConfirmationRequired = true
      })
    },
    handleEditAfterConfirmation({
      selectedRows = [],
      excludedResourceIdList = [],
      isSelectedAllEver = false
    }) {
      this.confirmationRequiredActionButtonDisabled = true
      this.isExtendedViewSaveButtonDisabled = true
      this.extendedViewCallingApi = true
      if (selectedRows.length > 1 || (this.selectedCluster && !this.isShowingClusteredTable)) {
        const payload = this.getEditBulkPayload(
          selectedRows,
          excludedResourceIdList,
          isSelectedAllEver
        )
        updateNotifiedEmailBulk(payload)
          .then(this.handleUpdateNotifiedEmailResponse)
          .finally(this.handleUpdateNotifiedEmailFinally)
      } else {
        const [item] = selectedRows
        const tag = typeof item?.tags === 'string' ? item?.tags : item?.tags?.join(',')
        const payload = {
          result: item.result,
          status: item.status,
          tag: tag || '',
          note: item.note || '',
          isNotifyUser: this.extendedView.isNotify,
          customMessage: this.extendedView.isMessage ? this.extendedView.customMessage : '',
          notificationTemplateResourceId: this.selectedTemplateResourceId
        }
        updateNotifiedEmail(item.resourceId, payload)
          .then(this.handleUpdateNotifiedEmailResponse)
          .finally(this.handleUpdateNotifiedEmailFinally)
      }
    },
    getEditBulkPayload(selectedRows = [], excludedResourceIdList = [], isSelectedAllEver = false) {
      const payload = {
        resourceIdList: []
      }
      const cluster = this.getClusteredField(this.selectedCluster)
      let selectedFilter = this.isShowingClusteredTable
        ? this.clusteredTableAxios
        : this.requestBodyReportedEmails.filter
      selectedFilter = JSON.parse(JSON.stringify(selectedFilter))
      if (this.isShowingClusteredTable) {
        if (
          !selectedFilter.filter.FilterGroups[0].FilterItems.find(
            (item) => item.FieldName === cluster
          )
        ) {
          selectedFilter.filter.FilterGroups[0].FilterItems.push({
            FieldName: cluster,
            Operator: '=',
            Value: this.clusteredRow[cluster] || '{none}'
          })
        }
      }
      if (isSelectedAllEver) {
        payload['selectAll'] = {
          filter: selectedFilter,
          excludedResourceIdList
        }
      }
      const sets = {
        result: new Set(),
        status: new Set(),
        tag: new Set(),
        note: new Set(),
        isNotifyUser: new Set(),
        customMessage: new Set()
      }
      selectedRows.forEach((row) => {
        payload.resourceIdList.push(row.resourceId)
        if (this.selectedCluster && !this.isShowingClusteredTable) {
          const item = this.reportedEmailsData.find(
            (clusteredRow) => clusteredRow.resourceId === row.resourceId
          )
          if (item) {
            payload.resourceIdList = [
              ...new Set([...payload.resourceIdList, ...item.clusteredResourceIdList])
            ]
          }
        }
        sets.result.add(row.result)
        sets.status.add(row.status)
        const tags = typeof row?.tags === 'string' ? row?.tags : row?.tags?.join(',') || ''
        sets.tag.add(tags)
        sets.note.add(row.note)
        sets.isNotifyUser.add(row.isNotifyUser)
        sets.customMessage.add(row.customMessage)
      })
      for (const key of Object.keys(sets)) {
        if (sets[key].size === 1) {
          payload[key] = [...sets[key]][0]
        }
        if (key === 'isNotifyUser') {
          payload[key] = this.extendedView.isNotify
        }
        if (key === 'customMessage') {
          payload[key] = this.extendedView.customMessage
        }
      }
      payload.notificationTemplateResourceId = this.selectedTemplateResourceId
      return payload
    },
    irDetailsOnClick(row) {
      window.open(`${window.location.href}/reported-emails/email-details/${row.resourceId}`)
    },
    handleReportedEmailInvestigate(row) {
      getNotifiedEmail(row.resourceId).then((response) => {
        this.selectedEmail = response.data.data
        this.isWantToAddNewInvestigation = true
      })
    },
    handleUpdateNotifiedEmailResponse() {
      this.$store.dispatch('widgets/callForWidgets', { isLoading: false })
      this.$refs.refIncidentResponderCards.callForData()
      this?.$refs?.refReportedEmails?.resetSelectableParams()
      this?.$refs?.refReportedEmailsClustered?.resetSelectableParams()
      this.callForSearchNotifiedMail()
      if (this.clusteredRow) {
        this.callForClusteredTable()
      }
    },
    handleUpdateNotifiedEmailFinally() {
      this.isExtendedViewCancelButtonDisabled = false
      this.confirmationRequiredActionButtonDisabled = false
      this.isExtendedViewSaveButtonDisabled = false
      this.extendedViewCallingApi = false
      this.isShowConfirmationRequired = false
    },
    exportReportedListEmails(
      { exportTypes, reportAllPages, pageNumber, pageSize },
      filter = this.requestBodyReportedEmails.filter
    ) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: reportAllPages ? 1 : pageNumber,
          pageSize: reportAllPages ? 50000 : pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportNotifiedEmails(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Reported Emails.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    exportClusteredReportedListEmails({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      this.setClusteredFilter()
      exportTypes.map((exportType, index) => {
        const payload = {
          pageNumber: reportAllPages ? 1 : pageNumber,
          pageSize: reportAllPages ? 50000 : pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.clusteredTableAxios.filter
        }
        exportNotifiedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Reported Emails ${
              this.clusteredRow[this.getClusteredField(this.selectedCluster)]
            }.${exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()}`
            link.click()
          })
          .finally(() => {
            if (index === exportTypes.length - 1) {
              this.removeClusteredFilter()
            }
          })
      })
    },
    clusteredColumnFilterChanged(filter = {}) {
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.clusteredTableAxios
      )
      this.resetClusteredPageNumber()
      this.callForClusteredTable()
    },
    clusteredColumnFilterCleared(fieldName) {
      this.clusteredTableAxios.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.clusteredTableAxios
      )
      if (this.clusteredRow) {
        this.callForClusteredTable()
      }
      this.resetClusteredPageNumber()
    },
    columnFilterChanged(filter) {
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.requestBodyReportedEmails
      )
      this.resetPageNumber()
      this.callForSearchNotifiedMail()
    },
    columnFilterCleared(fieldName) {
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.requestBodyReportedEmails
      )
      this.resetPageNumber()
      this.callForSearchNotifiedMail()
    }
  },

  beforeRouteLeave(to, from, next) {
    const { refNewInvestigation } = this.$refs
    if (refNewInvestigation && this.isWantToAddNewInvestigation) {
      if (to.name === 'Investigation Details') {
        return next()
      }
      refNewInvestigation.handleClose()
      next(false)
    } else {
      next(true)
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'Analysis Details' && !to.params.isLoadState) {
      next({ ...to, params: { isLoadState: true } })
    } else {
      next()
    }
  }
}
</script>
