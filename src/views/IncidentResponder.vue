<template>
  <div class="incident-responder-parent">
    <div class="incident-responder">
      <app-dialog
        size="big"
        :status="isShowRoi"
        icon="mdi-cog"
        :title="'ROI Summary Settings'"
        @changeStatus="isShowRoi = false"
        subtitle="To calculate saving in time and money for automating the email analysis"
        class-name="roi-modal"
      >
        <template v-slot:app-dialog-body>
          <v-form ref="form" lazy-validation>
            <v-list-item class="roi-modal__list-item">
              <v-list-item-content>
                <label class="roi-modal__label">{{ labels.RoiSummarySavedTimeLabel }}</label>
                <v-text-field
                  placeholder="Enter saved time"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model="baseManHour"
                  v-mask="'###'"
                  :rules="[
                    (v) => validations.required(v, labels.Required),
                    (v) => validations.startsWith(v, 'Cannot start with 0', 0)
                  ]"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="roi-modal__list-item">
              <v-list-item-content>
                <label class="roi-modal__label">{{ labels.RoiSummaryHourlyLabel }}</label>
                <v-text-field
                  placeholder="Enter hourly rate"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model="baseManHourCost"
                  v-mask="'###'"
                  :rules="[
                    (v) => validations.required(v, labels.Required),
                    (v) => validations.startsWith(v, 'Cannot start with 0', 0)
                  ]"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-form>
        </template>
        <template v-slot:app-dialog-footer>
          <div class="download-modal__footer justify-end">
            <v-btn
              class="ml-n4 download-modal__button"
              @click="isShowRoi = false"
              color="#f56c6c"
              text
              >{{ labels.Cancel }}</v-btn
            >
            <v-btn
              class="mr-n2 download-modal__button"
              @click="submitRoiModal"
              color="#2196f3"
              text
              >{{ labels.Save }}</v-btn
            >
          </div>
        </template>
      </app-dialog>
      <new-investigation
        @closeWithRoute="handleRouteToInvestigationDetails"
        @closeAdd="isWantToAddNewInvestigation = false"
        ref="refNewInvestigation"
        :status="isWantToAddNewInvestigation"
        v-if="isWantToAddNewInvestigation"
        :selectedMail="selectedEmail"
      />
      <div class="columns-row">
        <CardLoading
          :loading="incidentLoading"
          class="dashboard-cards__skeleton-loading"
          :class="[incidentLoading && 'dashboard-cards-loading']"
        >
          <template v-slot:skeleton-content>
            <div
              class="dashboard-cards phishing-reporter mr-2"
              :class="{
                'no-data__opacity-blue': isPhishingEmpty(irSummary)
              }"
            >
              <div class="card-header">
                <span class="head">Phishing Reporter</span>
                <router-link to="/phishing-reporter">
                  <v-icon :color="'white'">mdi-open-in-new</v-icon>
                </router-link>
              </div>
              <div class="columns-row__body" v-if="!isPhishingEmpty(irSummary)">
                <div class="card-body">
                  <div class="biggest">
                    {{
                      (irSummary &&
                        irSummary.phishingReporterUserStatusCount &&
                        irSummary.phishingReporterUserStatusCount.onlineUsersCount) ||
                      0
                    }}
                  </div>
                </div>
                <div class="card-footer">
                  of
                  {{
                    (irSummary &&
                      irSummary.phishingReporterUserStatusCount &&
                      irSummary.phishingReporterUserStatusCount.onlineUsersCount +
                        irSummary.phishingReporterUserStatusCount.offlineUsersCount) ||
                    0
                  }}
                  user(s) are
                </div>
                <div class="card-status">{{ labels.CurrentlyOnline }}</div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">
                  No add-ins installed
                </div>
                <v-btn
                  class="btn-action btn-playbook btn-playbook__no-data"
                  rounded
                  color="white"
                  style="box-shadow: none !important; margin-top: 16px;"
                  @click="emptyPhishingButtonClick"
                >
                  {{ labels.InstallNow }}
                </v-btn>
              </div>
              <div
                class="bg-image"
                style="bottom: 10px; right: 0;"
                :style="[isPhishingEmpty(irSummary) && { opacity: 0.4 }]"
              >
                <img src="../assets/img/shape.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
        <CardLoading
          :loading="incidentLoading"
          class="dashboard-cards__skeleton-loading"
          :class="[incidentLoading && 'dashboard-cards-loading']"
        >
          <template v-slot:skeleton-content>
            <div
              class="dashboard-cards incident-analysis mr-2"
              :class="{
                'no-data__opacity-red': isNotifiedEmailEmpty(irSummary)
              }"
            >
              <div class="card-header">
                <span class="head">{{ labels.IncidentAnalysis }}</span>
              </div>
              <div class="columns-row__body" v-if="!isNotifiedEmailEmpty(irSummary)">
                <div class="card-body">
                  <div class="biggest">
                    {{
                      (irSummary &&
                        irSummary.notifiedEmailResultCount &&
                        irSummary.notifiedEmailResultCount.harmfulCount) ||
                      0
                    }}
                  </div>
                </div>
                <div class="card-footer">
                  of
                  {{
                    (irSummary &&
                      irSummary.notifiedEmailResultCount &&
                      irSummary.notifiedEmailResultCount.reportedMailCount) ||
                    0
                  }}
                  reported email(s)
                </div>
                <div class="card-status">{{ labels.FoundHarmful }}</div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">{{ labels.NoEmailAnalysed }}</div>
                <!--<button class="btn-action btn-playbook btn-playbook__no-data" block rounded
                  @click="emptyNotifiedEmailButtonClick">
            Start Now
          </button>-->
              </div>
              <div class="bg-image" :style="[isNotifiedEmailEmpty(irSummary) && { opacity: 0.3 }]">
                <img src="../assets/img/ic-warning.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
        <CardLoading
          :loading="incidentLoading"
          class="dashboard-cards__skeleton-loading"
          :class="[incidentLoading && 'dashboard-cards-loading']"
        >
          <template v-slot:skeleton-content>
            <div
              class="dashboard-cards investigations mr-2"
              :class="{
                'no-data__opacity-green': !isInvestigationsEmpty(irSummary)
              }"
            >
              <div class="card-header">
                <span class="head">Investigations</span>
                <router-link :to="'/investigations'">
                  <v-icon :color="'white'">mdi-open-in-new</v-icon>
                </router-link>
              </div>
              <div
                class="columns-row__body"
                style="margin-top: 13px;"
                v-if="isInvestigationsEmpty(irSummary)"
              >
                <div class="card-body d-flex">
                  <div class="body-row">
                    <span class="body-row__number">
                      {{
                        (irSummary &&
                          irSummary.investigationTypeCount &&
                          irSummary.investigationTypeCount.automaticInvestigationCount) ||
                        0
                      }}
                    </span>

                    <span class="body-row__text">{{ labels.Auto.toLowerCase() }}</span>
                  </div>
                  <div class="body-row" style="margin-left: 81px;">
                    <span class="body-row__number"
                      >{{
                        (irSummary &&
                          irSummary.investigationTypeCount &&
                          irSummary.investigationTypeCount.manualInvestigationCount) ||
                        0
                      }}
                    </span>

                    <span class="body-row__text">{{ labels.Manual.toLowerCase() }}</span>
                  </div>
                </div>
                <div class="card-status mt-7">{{ labels.IncidentsResolved }}</div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">{{ labels.NoInvestigationStarted }}</div>
                <v-btn
                  class="btn-action btn-playbook btn-playbook__no-data"
                  rounded
                  color="white"
                  style="box-shadow: none !important; margin-top: 16px;"
                  @click="emptyInvestigationButtonClick"
                >
                  {{ labels.StartNow }}
                </v-btn>
              </div>
              <div
                class="bg-image"
                :style="[!isInvestigationsEmpty(irSummary) && { opacity: 0.4 }]"
              >
                <img src="../assets/img/ic-check-box.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
        <CardLoading
          :loading="incidentLoading"
          class="dashboard-cards__skeleton-loading"
          :class="[incidentLoading && 'dashboard-cards-loading']"
        >
          <template v-slot:skeleton-content>
            <div
              class="dashboard-cards roi-summary"
              :class="{
                'no-data__opacity-purple': isRoiSummaryEmpty(irSummary)
              }"
            >
              <div class="card-header">
                <span class="head">{{ labels.RoiSummary }}</span>
                <v-icon color="#fff" @click="isShowRoi = true">mdi-cog</v-icon>
              </div>
              <div class="card-body d-flex roi-summary__body-container">
                <div class="body-row">
                  <span class="body-row__number" style="white-space: nowrap;">
                    {{ `${irSummary && irSummary.roiSummary && irSummary.roiSummary.time}` || '0' }}
                  </span>

                  <span class="body-row__text" style="margin-left: 2px;">Hour(s)</span>
                </div>
                <div class="body-row">
                  <span class="body-row__number">
                    ${{ (irSummary && irSummary.roiSummary && irSummary.roiSummary.revenue) || 0 }}
                  </span>

                  <span class="body-row__text" style="margin-left: 2px;">{{ labels.Money }}</span>
                </div>
              </div>
              <div class="card-status">{{ labels.Saved }}</div>
              <div class="bg-image">
                <img src="../assets/img/ic-insert-chart.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
      </div>
      <div class="double-table">
        <div class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2>{{ labels.TopRules }}</h2>
                <p>{{ labels.MostTriggeredPlaybookRules }}</p>
              </div>
              <div class="action">
                <v-btn
                  class="btn-action btn-playbook"
                  block
                  rounded
                  @click="$router.push('/playbook')"
                >
                  {{ labels.Playbook }}
                  <v-icon class="pl-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="table">
              <datatable
                :loading="topRulesLoading"
                :refName="'topRules'"
                ref="refTopRules"
                :columns="topRules.columns"
                :table="topRules.table"
                id="incident-responder-top-rules-data-table"
                :countRow="5"
                :pageSizes="[]"
                :defaultSort="'status'"
                :selectable="false"
                :filterable="false"
                :rowActions="[]"
                :addUsers="topRules.addMenu"
                :empty="topRules.iEmpty"
                :selectEvent="topRules.selectEvent"
                :border="false"
                :showHeader="false"
                @onEmptyBtnClicked="onTopRulesEmptyBtnClicked"
                class="no-sub-border-datatable"
              >
                <template v-slot:datatable-column-popup="{ scope, col }">
                  <span v-if="scope.row[col.property] === 0">
                    {{ labels.NoMatchEmptyText }}
                  </span>
                  <span v-else @click="matchingPopupClick(scope.row)" class="popup-link">
                    {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }}
                    {{ labels.Matches }}
                  </span>
                  <app-dialog
                    :status="scope.row.resourceId === selectedMatch.resourceId"
                    icon="mdi-email"
                    title="Matching Incidents"
                    v-if="showMatchingModal"
                    :subtitle="getSelectedMatchingIncidentsSubtitle"
                    @changeStatus="showMatchingModal = false"
                    size="maximum"
                    class-name="matching-modal"
                    maxHeightSize="665"
                  >
                    <template v-slot:app-dialog-body>
                      <v-card light>
                        <v-list-item class="matching-modal__list-item">
                          <v-list-item-content>
                            <datatable
                              :refName="'matchingInvestigation'"
                              ref="refMatchingInvestigation"
                              :table="matchingInvestigationData"
                              :loading="isMatchingInvestigationLoading"
                              :columns="matchingInvestigation.columns"
                              id="incident-responder-matching-investigations-data-table"
                              :countRow="5"
                              :pageSizes="[5, 10, 25]"
                              :showHeader="true"
                              :defaultSort="'subject'"
                              :selectable="false"
                              :filterable="true"
                              :options="true"
                              :rowActions="[]"
                              :cell-padding="15"
                              :empty="matchingInvestigation.iEmpty"
                            />
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </template>
                    <template v-slot:app-dialog-footer>
                      <div class="d-flex" style="justify-content: flex-end;">
                        <v-btn
                          class="pa-0 k-dialog__button"
                          text
                          color="#2196f3"
                          @click="closeMatchingModal"
                          >{{ labels.Close.toUpperCase() }}
                        </v-btn>
                      </div>
                    </template>
                  </app-dialog>
                </template>
                <template v-slot:datatable-custom-column="{ scope }">
                  <span
                    @click="handeRuleNameClick(scope.row.resourceId)"
                    class="datatable-link"
                    v-if="scope.row.ruleName"
                  >
                    {{ scope.row.ruleName }}
                  </span>
                  <span v-else> </span>
                </template>
              </datatable>
            </div>
          </v-card>
        </div>
        <div class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2>{{ labels.RecentInvestigations }}</h2>
                <p>{{ labels.MostRecentInvestigations }}</p>
              </div>
              <div class="action">
                <v-btn
                  class="btn-action btn-investigations"
                  style="padding: 0 13px !important;"
                  block
                  rounded
                  @click.native="$router.push('/investigations')"
                >
                  {{ labels.Investigations }}
                  <v-icon class="pl-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="table investigations">
              <datatable
                :loading="investigationsLoading"
                :table="investigationsData"
                :refName="'recentInv'"
                ref="refRecentInv"
                id="incident-responder-investigations-data-table"
                :columns="recentInv.columns"
                :countRow="5"
                :pageSizes="[]"
                :defaultSort="'priority'"
                :selectable="false"
                :filterable="false"
                :rowActions="[]"
                :addUsers="recentInv.addMenu"
                :empty="recentInv.iEmpty"
                :selectEvent="recentInv.selectEvent"
                :border="false"
                :showHeader="false"
                @onEmptyBtnClicked="onEmptyBtnClicked"
                class="no-sub-border-datatable"
              />
            </div>
          </v-card>
        </div>
      </div>
      <div class="table-row">
        <v-card>
          <div class="header">
            <div class="title">
              <h2>{{ labels.ReportedEmails }}</h2>
              <p class="mb-10">
                {{ labels.SummaryOfReportedEmails }}
              </p>
            </div>
          </div>
          <datatable
            :loading="reportedEmailsLoading"
            :is-column-filter-active="emails.isColumnFilterActive"
            :table="reportedEmailsData"
            :refName="'reportedEmails'"
            ref="refReportedEmails"
            id="incident-responder-reported-emails-data-table"
            :columns="emails.columns"
            :countRow="5"
            :extended-view-loading="extendedViewLoading"
            :clusterItems="[{ name: 'Subject' }]"
            active-cluster="Subject"
            :changeFooterPosition="true"
            @handleClusterLazyLoad="handleClusterLoad"
            :extended-view-options="emails.extendedViewOptions"
            :extendedViewValue="extendedViewValue"
            hideParentRowActions
            :pageSizes="emails.pageSizes"
            :selectable="true"
            :filterable="true"
            :options="true"
            @clusterChanged="clusterChanged"
            :rowActions="emails.rowActions"
            :addUsers="emails.addUsers"
            :empty="emails.iEmpty"
            :groupable="true"
            :selectEvent="emails.selectEvent"
            :disableExtendedViewTransition="true"
            @downloadEvent="exportReportedListEmails"
            @onEmptyBtnClicked="onEmptyReportedEmailsBtnClicked"
            @irPreview="irPreviewOnClick"
            @handleListBulleted="handleListBulletedClick"
            @handleInvestigate="handleReportedEmailInvestigate"
            @handleDetails="irDetailsOnClick"
            @onEditClick="onEditClick"
            @handleEdit="handleEdit"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
            :extendedViewDisableChanger="extendedViewDisableChanger"
          >
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
                  v-for="item in scope.row.matchingPlaybooks"
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
                      <img src="../assets/img/spinner.png" class="add-in-settings__spinner" />
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
                  color="#2196f3"
                  label="Notify reporting user about this update"
                  v-model="extendedView.isNotify"
                  @change="handleIsNotify"
                  :disabled="selectedRowsOfReportedEmailsLength > 1"
                ></v-checkbox>
              </div>
              <div class="row-edit-div">
                <v-checkbox
                  color="#2196f3"
                  label="Add Custom Message"
                  v-model="extendedView.isMessage"
                  :disabled="!extendedView.isNotify || selectedRowsOfReportedEmailsLength > 1"
                ></v-checkbox>
              </div>
              <div
                class="row-edit-div"
                v-if="
                  extendedView.isMessage &&
                  extendedView.isNotify &&
                  selectedRowsOfReportedEmailsLength <= 1
                "
              >
                <v-textarea
                  outlined
                  dense
                  v-model="extendedView.customMessage"
                  rows="3"
                  placeholder="Write custom messages for recipients"
                  row-height="30"
                ></v-textarea>
              </div>
            </template>
          </datatable>
        </v-card>
      </div>
    </div>
    <app-modal
      :status="showPlaybookModal"
      v-if="showPlaybookModal"
      :icon-name="getIconName"
      :title="getTitle"
      :show-footer="false"
      class-name="incident-responder__playbook"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          :playbookId="selectedPlaybookId"
          @cancelForm="togglePlaybookModal"
          @closeFormWithUpdate="closePlaybookWithUpdate"
          v-if="showPlaybookModal"
        />
      </template>
    </app-modal>
  </div>
</template>
<script>
import {
  getMatchingIncidents,
  getRoiSettings,
  getRunningInvestigations,
  getTopRules,
  searchNotifiedMail,
  updateNotifiedEmail,
  updateRoiSettings
} from '../api/incidentResponder'
import { checkPermission, getDataTableFieldLabel } from '../utils/functions'
import DataTableColorfulText from '../components/DataTableComponents/DataTableColorfulText'
import { exportNotifiedEmails, getNotifiedEmail } from '../api/notifiedEmail'
import Datatable from '../components/DataTable'
import NewInvestigation from '../components/Investigation/NewInvestigation'
import AppModal from '@/components/AppModal'
import { mapActions, mapGetters } from 'vuex'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '../model/constants/commonConstants'
import AppDialog from '../components/AppDialog'
import { required, startsWith } from '../utils/validations'
import CreateOrEditRule from '../components/Playbook/CreateOrEditRule'
import CardLoading from '../components/SkeletonLoading/CardLoading'
import labels from '@/model/constants/labels'

export default {
  components: {
    Datatable,
    NewInvestigation,
    AppDialog,
    DataTableColorfulText,
    CreateOrEditRule,
    CardLoading,
    AppModal
  },

  data: () => ({
    labels,
    topRulesLoading: true,
    investigationsLoading: true,
    investigationsData: [],
    reportedEmailsData: [],
    reportedEmailsLoading: true,
    incidentLoading: true,
    showPlaybookModal: false,
    selectedPlaybookId: null,
    roiRate: '',
    selectedEmail: null,
    roiTask: '',
    selectedMatch: null,
    isShowRoi: false,
    extendedViewLoading: true,
    openInvestigationOverlay: false,
    investigationListData: [],
    matchingInvestigationData: [],
    isMatchingInvestigationLoading: true,
    showMatchingModal: false,
    selectedRowsOfReportedEmailsLength: 0,
    selectedReportedMails: null,
    noteDisableStatus: false,
    baseManHour: null,
    baseManHourCost: null,
    validations: {
      required,
      startsWith
    },
    extendedViewValue: [],
    topRules: {
      table: [],
      columns: [
        {
          property: 'ruleName',
          align: 'left',
          editable: false,
          label: 'Rule Name',
          fixed: false,
          sortable: false,
          show: true,
          type: 'slot',
          minWidth: '40'
        },
        {
          property: 'matchCount',
          align: 'left',
          editable: false,
          label: 'Matching Incidents',
          fixed: false,
          sortable: false,
          show: true,
          type: 'popup',
          minWidth: '30',
          emptyText: 'No Match'
        },
        {
          property: 'status',
          align: 'center',
          editable: false,
          label: 'Status',
          fixed: false,
          sortable: false,
          show: true,
          type: 'status',
          minWidth: '30',
          hasTooltip: true
        }
      ],
      iEmpty: {
        message: labels.NoRulesConfigured,
        btn: labels.CreateNewRule,
        icon: 'mdi-plus'
      },
      addUsers: {
        show: false,
        popUp: false
      },
      addMenu: {
        show: false,
        popUp: false
      },
      selectEvent: {}
    },
    recentInv: {
      table: [],
      columns: [
        {
          property: 'name',
          align: 'left',
          editable: false,
          label: labels.InvestigationName,
          fixed: false,
          sortable: false,
          show: true,
          type: 'link',
          href: '/investigation-details',
          hrefKey: 'resourceId',
          minWidth: '40'
        },
        {
          property: 'progress',
          align: 'center',
          editable: false,
          label: getStoreValue('progress'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'progress',
          minWidth: '30'
        },
        {
          property: 'status',
          align: 'center',
          editable: false,
          label: getStoreValue('status'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'status',
          minWidth: '30'
        }
      ],
      addUsers: {
        show: false,
        popUp: false
      },
      addMenu: {
        show: false,
        popUp: false
      },
      iEmpty: {
        message: labels.NoInvestigation,
        btn: labels.StartNewInvestigation,
        icon: 'mdi-plus'
      },
      selectEvent: {},
      chartOptions: {}
    },
    matchingInvestigation: {
      table: [],
      columns: [
        {
          property: 'subject',
          align: 'left',
          editable: false,
          label: 'Subject',
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '33'
        },
        {
          property: 'createDate',
          align: 'left',
          editable: false,
          label: getStoreValue('createDate'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '33'
        },
        {
          property: 'reportedBy',
          align: 'left',
          editable: false,
          label: getStoreValue('reportedBy'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '34'
        }
      ],
      addUsers: {
        show: false,
        popUp: false
      },
      addMenu: {
        show: false,
        popUp: false
      },
      iEmpty: {
        message: labels.EmptyMatchingIncidents,
        btn: '',
        icon: 'mdi-plus'
      },
      selectEvent: {},
      chartOptions: {}
    },
    emails: {
      isColumnFilterActive: false,
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
                if (row.status === 'BeingAnalyzed') {
                  return true
                } else {
                  return false
                }
              },
              props: {
                items: ['Phishing', 'Malicious', { text: 'Clean', value: 'NonMalicious' }]
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
                if (row.status === 'BeingAnalyzed') {
                  return true
                } else {
                  return false
                }
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
            label: 'Notes',
            isEditable: true,
            type: 'text',
            editOptions: {
              component: 'textarea',
              getDisabledValue() {
                return false
              },
              props: {
                placeholder: 'Enter Notes'
              }
            },
            show: true,
            showOnlyPreview: true
          }
        ]
      },
      columns: [
        {
          property: PROPERTY_STORE.SUBJECT,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.SUBJECT),
          fixed: false,
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
          width: 120
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
          width: '300',
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
          filterableItems: [{ text: 'Clean', value: 'NonMalicious' }, 'Malicious', 'Phishing'],
          editOptions: {
            component: 'select',
            getDisabledValue(row) {
              if (row.status === 'BeingAnalyzed') {
                return true
              } else {
                return false
              }
            },
            props: {
              items: ['Phishing', 'Malicious', { text: labels.NonMalicious, value: 'NonMalicious' }]
            }
          },
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
          editOptions: {
            component: 'select',
            getDisabledValue(row) {
              if (row.status === 'BeingAnalyzed') {
                return true
              } else {
                return false
              }
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
          width: '150'
        }
      ],
      pageSizes: [5, 10, 25],
      rowActions: [
        {
          name: labels.Edit,
          icon: 'mdi-pencil',
          action: 'edit',
          isNotShow: true
        },
        {
          name: labels.PreviewEmail,
          icon: 'mdi-eye',
          action: 'irPreview'
        },
        {
          name: labels.Details,
          icon: 'mdi-text-box-multiple',
          action: 'handleDetails'
        },
        {
          name: labels.Investigate,
          icon: 'mdi-magnify',
          action: 'handleInvestigate'
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
        icon: 'mdi-arrow-right'
      },
      selectEvent: {
        clipboard: true,
        edit: true,
        download: false
      },
      chartOptions: {
        chart: {
          width: 60,
          height: 60,
          type: 'pie',
          offsetX: -1,
          offsetY: 1
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        colors: ['#67c23a', '#409eff', '#f56c6c', '#ffcc33'],
        legend: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        dataLabels: {
          enabled: false
        }
      }
    },
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
    requestBodyReportedEmails: {
      isClustered: true,
      pageNumber: 1,
      pageSize: 500000,
      orderBy: 'createTime',
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
    },
    lazyLoadRequestBody: {
      isClustered: false,
      pageNumber: 1,
      pageSize: 500000,
      orderBy: 'createTime',
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
  }),
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      irSummary: 'investigations/irSummaryGetter' // for using getters
    }),
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    },

    getRoiSummaryValue() {
      /*
      if (this.irSummary && this.irSummary.roiSummary && this.irSummary.roiSummary.revenue) {
        let revenue = Number(this.irSummary.roiSummary.revenue)
        if (revenue < 1000) {
          return `$${revenue}`
        } else if (revenue >= 1000 && revenue < 1000000) {
          const newRevenue = revenue / 1000
          const stringRevenue = String(newRevenue)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1 && stringRevenue.charAt(indexOfNewRevenue + 1) !== '0') {
            const beforeDecimal = stringRevenue.split('.')[0]
            return `$${beforeDecimal}.${stringRevenue.charAt(indexOfNewRevenue + 1)}k`
          } else {
            return `$${newRevenue}k`
          }
        } else if (revenue >= 1000000 && revenue < 1000000000) {
          const newRevenu = revenue / 1000000
          const stringRevenue = String(newRevenu)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1 && stringRevenue.charAt(indexOfNewRevenue + 1) !== '0') {
            const beforeDecimal = stringRevenue.split('.')[0]
            const nextDecimalValue = stringRevenue.charAt(indexOfNewRevenue + 2)
            if (nextDecimalValue) {
              return `$${beforeDecimal}.${stringRevenue.charAt(
                indexOfNewRevenue + 1
              )}${nextDecimalValue}M`
            } else {
              return `$${newRevenu}m`
            }
          } else {
            if (stringRevenue.length === 7) {
              return `$${stringRevenue.substring(0, stringRevenue.length - 1)}m`
            }
            return `$${newRevenu}m`
          }
        } else if (revenue >= 1000000000) {
          const newRevenue = revenue / 1000000000
          const stringRevenue = String(newRevenue)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1) {
            return `$${newRevenue.toFixed(3)}b`
          } else {
            return `$${newRevenue}b`
          }
        }
      } else {
        return `$0`
      }
      return `$0`
      */
      return '$0'
    },
    getSelectedMatchingIncidentsSubtitle() {
      return this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch.ruleName}`
    }
  },
  mounted() {
    this.incidentLoading = true
    this.$store.dispatch('investigations/getIrSummary').finally(() => {
      this.showDatatable = true
      this.incidentLoading = false
    }) //module name than method name
    this.addQuery()
  },
  created() {
    this.initMethods()
    window.addEventListener('resize', this.addQuery)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.addQuery)
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    clusterChanged() {
      this.requestBodyReportedEmails.isClustered = true
      this.callForSearchNotifiedMail()
    },
    getManipulatedChildData(data, isChild = false) {
      data.forEach((item) => {
        if (isChild) {
          item.isChild = true
        }
        if (item.children) {
          this.getManipulatedChildData(item.children, true)
        }
      })
      return data
    },
    handleClusterLoad({ tree, treeNode, resolve, callback }) {
      const copyOfRequestBody = JSON.parse(JSON.stringify(this.lazyLoadRequestBody))
      copyOfRequestBody.filter.FilterGroups[0].FilterItems = [
        ...this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems
      ]
      copyOfRequestBody.filter.FilterGroups[0].FilterItems.push({
        FieldName: 'Subject',
        Operator: '=',
        Value: tree.subject
      })
      searchNotifiedMail(copyOfRequestBody).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response

        const data = this.getManipulatedChildData(results, true)
        tree['children'] = data
        treeNode['children'] = data

        resolve(data)
        callback()
      })
    },

    handleListBulletedClick() {
      this.requestBodyReportedEmails.isClustered = false
      this.callForSearchNotifiedMail()
    },
    extendedViewDisableChanger() {
      return JSON.stringify(this.defaultExtendedViewValues) === JSON.stringify(this.extendedView)
    },
    handleSearchChange(bodyData = {}, columnFilterActive = false) {
      this.emails.isColumnFilterActive = columnFilterActive
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = [
        ...bodyData.filter.FilterGroups[0].FilterItems
      ]
      this.emails.isColumnFilterActive = columnFilterActive
      this.callForSearchNotifiedMail()
    },
    closeMatchingModal() {
      this.showMatchingModal = false
      this.matchingInvestigationData = []
    },
    initMethods() {
      this.callForGetRunningInvestigations()
      this.callForGetTopRules()
      this.callForSearchNotifiedMail()
      this.callForGetRoiSettings()
    },
    closePlaybookWithUpdate() {
      this.togglePlaybookModal()
      this.initMethods()
    },
    addQuery() {
      const navigatorWidth = document.querySelector('nav.page-nav').style.width
      const width = window.innerWidth - Number(navigatorWidth.slice(0, -2))
      if (width < 1050 && width > 750) {
        document
          .querySelectorAll(
            '.incident-responder-parent .columns-row .dashboard-cards__skeleton-loading'
          )
          .forEach((item) => {
            item.style =
              'width: calc(50% - 16px) !important;max-width: calc(50% - 16px) !important;'
          })

        document.querySelector('.columns-row').style = 'flex-wrap:wrap;'
      } else {
        document
          .querySelectorAll(
            '.incident-responder-parent .columns-row .dashboard-cards__skeleton-loading'
          )
          .forEach((item) => {
            item.style = ''
          })
        const columnsRowContainer = document.querySelector('.columns-row')
        if (columnsRowContainer) document.querySelector('.columns-row').style = ''
      }
    },
    handleRouteToInvestigationDetails(resp) {
      this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
    },
    handeRuleNameClick(resourceId) {
      this.selectedPlaybookId = resourceId
      this.showPlaybookModal = true
    },
    togglePlaybookModal() {
      this.selectedPlaybookId = null
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    togglePlaybookModalWithSelected(selectedPlaybookId) {
      this.selectedPlaybookId = selectedPlaybookId
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    getDataTableFieldLabel(text) {
      return getDataTableFieldLabel(text)
    },
    callForGetRoiSettings() {
      getRoiSettings().then((response) => {
        const {
          data: { data }
        } = response
        this.baseManHour = data.baseManHour
        this.baseManHourCost = data.baseManHourCost
      })
    },
    submitRoiModal() {
      if (this.$refs.form.validate()) {
        updateRoiSettings({
          baseManHour: this.baseManHour,
          baseManHourCost: this.baseManHourCost
        }).then((response) => {
          this.callForGetRoiSettings()
          this.$store.dispatch('common/createSnackBar', {
            message: 'ROI settings has been updated',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.$store.dispatch('investigations/getIrSummary')
        })
        this.isShowRoi = false
      }
    },
    isRoiSummaryEmpty(summary) {
      const { roiSummary: { revenue = '0', time = '0' } = { revenue, time } } = summary
      return revenue === '0' && time === '0'
    },
    isInvestigationsEmpty(summary) {
      if (summary && summary.investigationTypeCount) {
        const investigationTypeCountKeys = Object.keys(summary.investigationTypeCount)
        if (investigationTypeCountKeys.length > 0) {
          let hasValue = false
          for (let key of investigationTypeCountKeys) {
            if (summary.investigationTypeCount[key]) {
              hasValue = true
            }
          }
          return hasValue
        } else {
          return false
        }
      } else {
        return false
      }
    },
    onEditClick({ selected: selections, isEditPopupOpen }) {
      if (isEditPopupOpen) {
        this.extendedViewLoading = true
        this.selectedRowsOfReportedEmailsLength = selections.length
        this.selectedReportedMails = selections
        if (selections.length === 1) {
          getNotifiedEmail(selections[0].resourceId)
            .then((response) => {
              const selectedItem = response.data.data
              this.extendedView.isNotify = selectedItem.isNotifyUser
              this.extendedView.customMessage = selectedItem.customMessage
              this.extendedView.isMessage = selectedItem.customMessage ? true : false
              this.defaultExtendedViewValues.isNotify = selectedItem.isNotifyUser
              this.defaultExtendedViewValues.customMessage = selectedItem.customMessage
              this.defaultExtendedViewValues.isMessage = selectedItem.customMessage ? true : false
              this.extendedViewValue = [
                {
                  ...selectedItem,
                  resourceId: selections[0].resourceId,
                  reportedBy: selections[0].reportedBy,
                  matchingPlaybooks: selections[0].matchingPlaybooks,
                  source: selections[0].source
                }
              ]
            })
            .finally(() => (this.extendedViewLoading = false))
          this.hasMultipleNoteValue = false
        } else if (selections.length > 1) {
          const rows = []
          let index = 0
          this.extendedView.isNotify = true
          this.extendedView.isMessage = false
          this.extendedView.customMessage = ''
          this.extendedViewLoading = true
          selections.map((a, ind) => {
            getNotifiedEmail(selections[index].resourceId)
              .then((response) => {
                const selectedItem = response.data.data
                rows.push({
                  ...selectedItem,
                  resourceId: selections[ind].resourceId,
                  reportedBy: selections[ind].reportedBy,
                  matchingPlaybooks: selections[ind].matchingPlaybooks,
                  source: selections[ind].source
                })
                if (index === selections.length) {
                  const note = rows[0].note
                  rows.map((item, i) => {
                    if (item.note !== note) {
                      this.hasMultipleNoteValue = true
                    }
                  })
                  this.extendedViewValue = rows
                }
              })
              .finally(() => {
                if (ind === selections.length - 1) {
                  this.extendedViewLoading = false
                }
              })
            index++
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
      }
    },
    closeNewInvestigationModal(value) {
      if (value) {
        this.callForGetRunningInvestigations()
        this.callForGetTopRules()
        this.callForSearchNotifiedMail()
      }
      this.isWantToAddNewInvestigation = false
    },
    callForGetRunningInvestigations() {
      this.investigationsLoading = true
      getRunningInvestigations()
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.investigationListData = data
          this.investigationsData = data || []
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting the recent investigations! '
          })
          this.investigationsData = []
        })
        .finally(() => {
          this.investigationsLoading = false
        })
    },
    callForGetTopRules() {
      checkPermission('ir/dashboard/summary', 'GET')
      this.topRulesLoading = true
      getTopRules()
        .then((response) => {
          const {
            data: { data, status }
          } = response

          this.topRules.table = data || []
        })
        .catch((error) => {
          /* this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting the top rules!'
          })
          */
          this.topRules.table = []
        })
        .finally(() => (this.topRulesLoading = false))
    },
    callForSearchNotifiedMail() {
      this.reportedEmailsLoading = true
      searchNotifiedMail(this.requestBodyReportedEmails)
        .then((response) => {
          const {
            data: {
              data: { results }
            }
          } = response
          const tableData = this.getManipulatedTableData(results || [])
          this.reportedEmailsData = tableData || []
        })
        .catch(() => {
          this.reportedEmailsData = []
        })
        .finally(() => (this.reportedEmailsLoading = false))
    },
    getManipulatedTableData(data, isChild = false) {
      if (this.requestBodyReportedEmails.isClustered) {
        return data.map((item) => {
          return { subject: item.subject, hasChildren: true, resourceId: Math.random().toString() }
        })
      }

      return data
    },
    matchingPopupClick(match) {
      this.selectedMatch = match
      this.showMatchingModal = true
      this.isMatchingInvestigationLoading = true
      const payload = {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'createDate',
        ascending: true
      }
      getMatchingIncidents(payload, match.resourceId)
        .then((response) => {
          const tableData = response.data.data
          this.matchingInvestigationData = tableData.results
        })
        .catch((error) => {
          /*this.$store.dispatch('common/createSnackBar', {
                  errorState: true,
                  color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                  message: 'Error when getting the notified emails!'
                })*/
        })
        .finally(() => (this.isMatchingInvestigationLoading = false))
    },
    onEmptyBtnClicked() {
      this.$router.push({ path: '/investigations', query: { openPopup: true } })
    },
    onTopRulesEmptyBtnClicked() {
      this.$router.push({ path: '/playbook', query: { openPopup: true } })
    },
    onEmptyReportedEmailsBtnClicked() {
      this.$router.push({ name: 'Phishing Reporter', params: { tab: 'second' } })
    },
    irPreviewOnClick(row) {
      this.$router.push({
        name: 'Analysis Details',
        params: { id: row.resourceId, tab: 'third' }
      })
    },
    handleIsNotify(value) {
      if (!value) {
        this.extendedView.isMessage = false
      }
    },
    handleEdit(selectedRow) {
      selectedRow.map((item) => {
        const tag = typeof item.tags === 'string' ? item.tags : item.tags.join(',')
        const payload = {
          result: item.result,
          status: item.status,
          tag: tag || '',
          note: item.note || '',
          isNotifyUser: this.extendedView.isNotify,
          customMessage: this.extendedView.isMessage
            ? this.extendedView.customMessage
            : selectedRow.length > 1
            ? item.customMessage
            : ''
        }

        updateNotifiedEmail(item.resourceId, payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              message: response.data.message,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle'
            })

            this.callForGetRunningInvestigations()
            this.callForGetTopRules()
            this.callForSearchNotifiedMail()
            this.$store.dispatch('investigations/getIrSummary')
          })
          .catch((error) => {})
      })
    },
    irDetailsOnClick(row) {
      this.$router.push({
        name: 'Analysis Details',
        params: { id: row.resourceId, tab: 0 }
      })
    },
    isPhishingEmpty(data) {
      if (data && !data.phishingReporterUserStatusCount) {
        return true
      } else if (
        data &&
        data.phishingReporterUserStatusCount &&
        (data.phishingReporterUserStatusCount.onlineUsersCount ||
          data.phishingReporterUserStatusCount.offlineUsersCount)
      ) {
        return false
      } else {
        return true
      }
    },
    isNotifiedEmailEmpty(data) {
      if (data && !data.notifiedEmailResultCount) {
        return true
      } else if (
        data &&
        data.notifiedEmailResultCount &&
        data.notifiedEmailResultCount.reportedMailCount
      ) {
        return false
      } else {
        return true
      }
    },
    handleReportedEmailInvestigate(row) {
      getNotifiedEmail(row.resourceId).then((response) => {
        this.selectedEmail = response.data.data

        this.isWantToAddNewInvestigation = true
      })
    },
    emptyPhishingButtonClick() {
      this.$router.push('/phishing-reporter')
    },
    emptyNotifiedEmailButtonClick() {
      //this.$router.push('/phishing-reporter')
    },
    emptyInvestigationButtonClick() {
      this.$router.push('/investigations')
    },
    exportReportedListEmails({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: reportAllPages ? 1 : pageNumber,
          pageSize: reportAllPages ? 50000 : pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.requestBodyReportedEmails.filter
        }
        exportNotifiedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `users.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    columnFilterChanged(filter) {
      this.emails.isColumnFilterActive = true
      let items = []
      let requestBody = this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems
      requestBody.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName =
            filter[i].FieldName.charAt(0).toUpperCase() + filter[i].FieldName.slice(1)
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)
        const { FieldName, Value } = filter
        if (FieldName === 'Result' && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }

      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = requestBody
      this.callForSearchNotifiedMail()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName.charAt(0).toUpperCase() + fieldName.slice(1)) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearchNotifiedMail()

      this.emails.isColumnFilterActive =
        this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.openInvestigationOverlay) {
      this.openInvestigationOverlay = false
      next(false)
    } else {
      next(true)
    }
  }
}
</script>
<style lang="scss">
.incident-responder-parent {
  .incident-responder {
    ::v-deep .edit-labels {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
    padding: 0 8px;
    margin-top: 3px;
    padding-bottom: 35px;

    .no-data {
      &__opacity-blue {
        background-image: linear-gradient(to bottom, #3c768e, #25608a) !important;
      }

      &__opacity-red {
        background-image: linear-gradient(to bottom, #895f5f, #8a4646) !important;
      }

      &__opacity-green {
        background-image: linear-gradient(to bottom, #4a764d, #356437) !important;
      }
    }

    .btn-playbook {
      &__no-data {
        border-radius: 18px;
        background-color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.71;
        letter-spacing: normal;
        color: #2196f3;
        height: 36px;
      }
    }
  }

  &__link {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.29;
    letter-spacing: normal;
    color: #2196f3;
    cursor: pointer;
  }
  .columns-row__body {
    margin-top: 16px;
  }
  .columns-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media only screen and (max-width: 1023px) {
      flex-wrap: wrap;

      .dashboard-cards__skeleton-loading {
        width: calc(50% - 16px) !important;
        max-width: calc(50% - 16px) !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .dashboard-cards__skeleton-loading {
        width: calc(100% - 16px) !important;
        max-width: calc(100% - 16px) !important;
      }
    }

    .dashboard-cards {
      min-height: 170px;
      max-height: 170px;
      border-radius: 8px;
      margin: 8px;
      padding: 16px;
      position: relative;

      &__skeleton-loading {
        width: 25%;
        min-height: 170px;
        border-radius: 8px;
        position: relative;
      }

      .card-header {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        .head {
          color: #fff;
          font-size: 20px;
          font-weight: 600;
          //line-height: 1.15;
          letter-spacing: normal;
        }

        a {
          text-decoration: none !important;
        }

        i {
          font-size: 24px !important;
        }
      }

      .card-body {
        //font-size: 48px;
        font-weight: normal;
        line-height: 1.13;
        letter-spacing: normal;
        color: #fff;

        span {
          font-size: 20px;
        }

        .biggest {
          font-size: 44px;
          line-height: 1;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
        }

        .body-row {
          display: flex;
          flex-direction: column;
        }

        .body-row:first-child {
          //width: 100%;
        }

        .body-row__number {
          font-size: 44px;
          line-height: 1;
          letter-spacing: normal;
          color: #ffffff;
        }
        .body-row__text {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: normal;
          color: #ffffff;
          opacity: 0.7;
        }

        .body-row:nth-child(2) {
        }
      }

      .card-footer {
        font-size: 16px;
        font-weight: 600;
        line-height: normal;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 0.7;
        //padding-bottom: 16px;

        &.no-data-text {
          font-size: 20px;
          line-height: 1.25;
          letter-spacing: normal;
          color: #ffffff;
          margin-top: 36px;
        }
      }

      .card-status {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: normal;
        color: #fff;
        bottom: 16px;
        position: absolute;
      }

      .bg-image {
        position: absolute;
        right: -15px;
        bottom: 0;
      }
    }

    .phishing-reporter {
      background-image: linear-gradient(to bottom, #5bcffd, #2196f3);
    }

    .incident-analysis {
      background-image: linear-gradient(to bottom, #f3a0a0, #f56c6c 99%);
    }

    .investigations {
      background-image: linear-gradient(to bottom, #71c876, #43a047);
    }

    .roi-summary {
      background-image: linear-gradient(to bottom, #b27fc2, #66257a 96%);
      &__settings-button {
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }
  }

  .double-table {
    display: flex;
    margin-top: 8px;
    .k-table__wrapper .card {
      justify-content: unset;
      box-shadow: none !important;
      padding: 0px !important;
      border: none !important;
      border-radius: 0 !important;
      .table-wrapper {
        padding-top: 0;
        border: none !important;
        margin-top: 0 !important ;
        border-radius: 0 !important;
      }
    }
    .k-table__wrapper {
      padding-bottom: 24px;
    }

    @media only screen and (max-width: 1023px) {
      flex-wrap: wrap;
      .column {
        width: calc(100% - 16px) !important;
      }
    }

    .column {
      margin: 8px;
      width: calc(50% - 16px);

      .v-card {
        border-radius: 12px;
        box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
        min-height: 236px;
        padding: 24px;
        padding-bottom: 0;
        height: 100%;

        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 24px;

          .title {
            h2 {
              font-family: 'Open Sans', sans-serif;
              font-size: 20px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.15;
              letter-spacing: normal;
              color: #2196f3;
            }

            p {
              font-family: 'Open Sans', sans-serif !important;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
            }
          }

          .action {
            display: flex;

            .btn-action {
              font-size: 14px;
              font-weight: 600;
              line-height: 1.71;
              letter-spacing: normal;
              color: #2196f3;
              background-color: #ffffff !important;
              border-radius: 18px;
              box-shadow: none !important;
              border: solid 1px #2196f3;
              i {
                font-size: 19px !important;
              }
            }
          }
        }

        .table {
          .wrapper {
            padding-bottom: 0 !important;
          }

          ::v-deep .v-card {
            box-shadow: unset !important;
            padding: 0 !important;

            .table-wrapper {
              box-shadow: unset !important;

              .el-table td {
                padding: 16px 0 !important;
              }

              .btn-status {
                max-width: 100px !important;
              }

              .btn-inactive {
                background-color: #f56c6c !important;
              }
            }
          }
        }

        .table.investigations {
          ::v-deep .v-card {
            .el-table td {
              padding: 13px 0 !important;
            }
          }
        }
      }
    }
  }

  .table-row {
    display: flex;
    padding-top: 8px;
    position: relative;
    margin: 8px;
    width: calc(100% - 16px);

    .wrapper {
      width: 100%;
    }

    .k-table__wrapper {
      .v-card {
        padding: 0;
      }
    }

    .v-card {
      border-radius: 12px;
      box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
      padding: 24px;
      padding-bottom: 0;
      width: 100%;

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
          width: 65%;

          h2 {
            font-family: 'Open Sans', sans-serif;
            font-size: 20px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.15;
            letter-spacing: normal;
            color: #2196f3;
          }

          p {
            font-family: 'Open Sans', sans-serif !important;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }
        }

        .action {
          display: flex;

          .btn-action {
            background-color: #2196f3 !important;
            color: #fff;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.71;
            letter-spacing: normal;
            padding: 0 !important;
            height: 36px !important;
            border-radius: 18px;
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);

            i {
              font-size: 19px !important;
            }
          }
        }
      }
    }

    .wrapper {
      padding-top: 20px !important;
      padding-top: 40px !important;

      ::v-deep .v-card {
        box-shadow: unset !important;
        padding: 0 !important;

        .table-wrapper {
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
            0 1px 1px -1px rgba(204, 204, 204, 0.12);

          .el-table td {
            padding: 12px 0;
          }

          .btn-status {
            max-width: 100px !important;
          }

          .btn-inactive {
            background-color: #f56c6c !important;
          }
        }
      }
    }

    .table.investigations {
      ::v-deep .v-card {
        .el-table td {
          padding: 13px 0 !important;
        }
      }
    }

    ::v-deep .el-table th > .cell {
      line-height: 2rem !important;
    }
  }

  @media only screen and (max-width: 500px) {
    ::v-deep .v-card {
      padding: 16px !important;
    }
  }

  @media only screen and (max-width: 1400px) and (min-width: 1025px) {
    .btn-investigations,
    .btn-playbook {
      font-size: 12px !important;
    }
  }

  ::v-deep .newInvestigationOverlay {
    background-color: #fff !important;
    overflow: auto !important;
    height: 100% !important;
    max-width: 100vw !important;
    width: 100% !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;

    > ::v-deep .v-overlay__content {
      height: auto;
      width: 100%;
    }

    .v-overlay__content {
      height: 100%;
      position: absolute;
      left: 0;
      width: 100%;
    }
  }
  .table.investigations {
    padding: 0 !important;
  }
}
.matching-modal {
  &__list-item {
    padding: 0;
    .v-list-item__content {
      padding: 0;
    }
  }
  .k-table__wrapper {
    padding-bottom: 0;
    overflow-x: auto;
    .card .table-wrapper .el-table th > .cell {
      margin-left: 24px;
    }
    .card .table-wrapper .el-table td > .cell {
      padding-left: 32px !important;
    }
  }
  .v-card {
    border-radius: 12px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
  }
}

.roi-modal {
  &__list-item {
    padding: 0;
    .v-list-item__content {
      padding: 0;
    }
  }
  .v-list-item__subtitle {
    white-space: pre-wrap;
  }
  .k-dialog__header {
    padding-top: 24px;
    padding-bottom: 24px;
  }
  .k-dialog__body {
    padding-bottom: 0;
  }
  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    margin-bottom: 8px !important;
  }
}
.popup-link {
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: normal;
  color: #2196f3;
}
.no-data__opacity-green {
  background-image: linear-gradient(to bottom, #268a50, #265229);
}
.no-data__opacity-purple {
  background-image: linear-gradient(to bottom, #72517b, #431d4e) !important;
}

.incident-responder .analysis-link {
  display: flex;
  text-align: left;
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  align-items: center;
  justify-content: center;
}
.dashboard-cards-loading {
  width: 24% !important;
}
.roi-number {
  font-size: 16px !important;
  font-weight: 600 !important;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  opacity: 0.7;
}
.incident-responder__playbook {
  .k-overlay__container {
    padding: 0 !important;
  }
  .v-overlay__content {
    overflow-x: hidden;
  }
  .k-overlay__list-item.k-overlay__header {
    padding: 32px 96px 0 96px;
    margin-bottom: 24px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
}
.el-table .el-table__row--level-1 .data-table__custom-column {
  margin: 0 -8px;
}
</style>
