<template>
  <div class="incident-responder-parent">
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
      <app-dialog
        size="big"
        icon="mdi-cog"
        subtitle="To calculate saving in time and money for automating the email analysis"
        class-name="roi-modal"
        title-id="text--incident-responder-roi-summary-title"
        subtitle-id="text--incident-responder-roi-summary-subtitle"
        :status="isShowRoi"
        :title="'ROI Summary Settings'"
        @changeStatus="isShowRoi = false"
      >
        <template v-slot:app-dialog-body>
          <v-form ref="form" lazy-validation>
            <v-list-item class="roi-modal__list-item">
              <v-list-item-content>
                <label class="roi-modal__label">{{ labels.RoiSummarySavedTimeLabel }}</label>
                <v-text-field
                  v-mask="'###'"
                  v-model="baseManHour"
                  id="input--incident-responder-roi-popup-saved-time"
                  placeholder="Enter saved time"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
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
                  v-mask="'###'"
                  v-model="baseManHourCost"
                  id="input--incident-responder-roi-popup-hourly-rate"
                  placeholder="Enter hourly rate"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
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
            <app-dialog-footer
              cancel-button-id="btn-cancel--incident-responder-roi-popup"
              confirm-button-id="btn-save--incident-responder-roi-popup"
              :actionButtonText="labels.Save"
              :confirmButtonDisabled="isConfirmButtonDisabled"
              @handleClose="isShowRoi = false"
              @handleConfirm="submitRoiModal"
            />
          </div>
        </template>
      </app-dialog>
      <new-investigation
        v-if="isWantToAddNewInvestigation"
        ref="refNewInvestigation"
        :status="isWantToAddNewInvestigation"
        :selectedMail="selectedEmail"
        :is-ir="true"
        @closeWithRoute="handleRouteToInvestigationDetails"
        @closeAdd="isWantToAddNewInvestigation = false"
      />
      <div v-if="getIncidentResponderSummaryPermission" class="columns-row">
        <CardLoading
          :loading="incidentLoading"
          :class="[
            'dashboard-cards__skeleton-loading',
            incidentLoading && 'dashboard-cards-loading'
          ]"
        >
          <template v-slot:skeleton-content>
            <div
              id="card--incident-responder-phishing-reporter"
              :class="[
                'dashboard-cards phishing-reporter mr-2',
                {
                  'no-data__opacity-blue': isPhishingEmpty
                }
              ]"
            >
              <div class="card-header">
                <span class="head">Phishing Reporter</span>
                <router-link
                  to="/phishing-reporter"
                  id="btn-link--incident-responder-to-phishing-reporter"
                >
                  <v-icon style="opacity: 0.8;" :color="'white'">mdi-open-in-new</v-icon>
                </router-link>
              </div>
              <div v-if="!isPhishingEmpty" class="columns-row__body">
                <div class="card-body">
                  <div
                    class="biggest"
                    id="card--incident-responder-phishing-reporter-online-users-count"
                  >
                    {{ getPhishingReporterOnlineUserCount }}
                  </div>
                </div>
                <div
                  class="card-footer"
                  id="card--incident-responder-phishing-reporter-total-users-count"
                >
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
                <div class="card-status">{{ labels.Online }}</div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">
                  Add-in isn’t installed at any users’ account
                </div>
              </div>
              <div
                class="bg-image"
                style="bottom: 10px; right: -11px;"
                :style="[isPhishingEmpty && { opacity: 0.4 }]"
              >
                <img src="../assets/img/ph-crone.svg" />
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
              id="card--incident-responder-incident-analysis"
              :class="[
                'dashboard-cards mr-2',
                {
                  'no-data__opacity-red': isNotifiedEmailEmpty,
                  'bg-image-incident-analysis': !isNotifiedEmailEmpty
                }
              ]"
            >
              <div class="card-header">
                <span class="head">{{ labels.IncidentAnalysis }}</span>
              </div>
              <div v-if="!isNotifiedEmailEmpty" class="columns-row__body">
                <div class="card-body">
                  <div
                    class="biggest"
                    id="card--incident-responder-incident-analysis-notified-harmful-count"
                  >
                    {{
                      (irSummary &&
                        irSummary.notifiedEmailResultCount &&
                        irSummary.notifiedEmailResultCount.harmfulCount) ||
                      0
                    }}
                  </div>
                </div>
                <div
                  id="card--incident-responder-incident-analysis-reported-mail-count"
                  class="card-footer"
                >
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
                <div class="card-footer no-data-text">
                  {{ labels.NoEmailAnalysed }}
                </div>
              </div>
              <div class="bg-image" :style="[isNotifiedEmailEmpty && { opacity: 0.3 }]">
                <img src="../assets/img/ic-warning.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
        <CardLoading
          :loading="incidentLoading"
          :class="[
            'dashboard-cards__skeleton-loading',
            incidentLoading && 'dashboard-cards-loading'
          ]"
        >
          <template v-slot:skeleton-content>
            <div
              id="card--incident-responder-investigations"
              :class="[
                'dashboard-cards investigations mr-2',
                {
                  'no-data__opacity-green': !isInvestigationsEmpty
                }
              ]"
            >
              <div class="card-header">
                <span class="head">Investigations</span>
                <router-link
                  id="btn-link--incident-responder-to-investigations"
                  to="/investigations"
                >
                  <v-icon style="opacity: 0.8;" color="white">mdi-open-in-new</v-icon>
                </router-link>
              </div>
              <div v-if="isInvestigationsEmpty" class="columns-row__body" style="margin-top: 13px;">
                <div class="card-body d-flex">
                  <div class="body-row">
                    <span
                      id="card--incident-responder-investigations-automatic-investigation-count"
                      class="body-row__number"
                    >
                      {{ getAutomaticInvestigationCount }}
                    </span>

                    <span class="body-row__text" style="margin-left: 4px;">{{
                      labels.LowerAuto
                    }}</span>
                  </div>
                  <div class="body-row" style="margin-left: 64px;">
                    <span
                      class="body-row__number"
                      id="card--incident-responder-investigations-manual-investigation-count"
                      >{{ getManuelInvestigationCount }}
                    </span>

                    <span class="body-row__text">{{ labels.LowerManual }}</span>
                  </div>
                </div>
                <div class="card-status mt-7">
                  {{ labels.IncidentsResolved }}
                </div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">
                  {{ labels.NoInvestigationStarted }}
                </div>
              </div>
              <div class="bg-image" :style="[!isInvestigationsEmpty && { opacity: 0.4 }]">
                <img src="../assets/img/ic-check-box.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
        <CardLoading
          :loading="incidentLoading"
          :class="[
            'dashboard-cards__skeleton-loading',
            incidentLoading && 'dashboard-cards-loading'
          ]"
        >
          <template #skeleton-content>
            <div
              id="card--incident-responder-roi-summary"
              :class="[
                'dashboard-cards',
                {
                  'no-data__opacity-purple': isRoiSummaryEmpty,
                  'roi-summary': !isRoiSummaryEmpty
                }
              ]"
            >
              <div class="card-header">
                <span class="head">{{ labels.RoiSummary }}</span>
                <v-icon
                  id="btn-show--incident-responder-roi-summary"
                  color="#fff"
                  @click="isShowRoi = true"
                  >mdi-cog</v-icon
                >
              </div>
              <div v-if="!isRoiSummaryEmpty" class="card-body d-flex roi-summary__body-container">
                <div class="body-row">
                  <span
                    id="card--incident-responder-roi-summary-time"
                    class="body-row__number"
                    style="white-space: nowrap;"
                  >
                    {{ getROISummaryTime }}
                  </span>

                  <span class="body-row__text" style="margin-left: 2px;">Hour(s)</span>
                </div>
                <div class="body-row body-row--2">
                  <span class="body-row__number" id="card--incident-responder-roi-summary-revenue">
                    ${{ getROISummaryRevenue }}
                  </span>

                  <span class="body-row__text" style="margin-left: 2px;">{{ labels.Money }}</span>
                </div>
                <div class="card-status">{{ labels.Saved }}</div>
              </div>
              <div class="columns-row__body" v-else>
                <div class="card-footer no-data-text">
                  You haven’t saved any work
                </div>
              </div>
              <div class="bg-image">
                <img src="../assets/img/ic-insert-chart.svg" />
              </div>
            </div>
          </template>
        </CardLoading>
      </div>
      <div class="double-table">
        <div v-if="getIncidentResponderTopRulesPermission" class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2 id="text--incident-responder-playbook-top-rules">
                  {{ labels.TopRules }}
                </h2>
                <p id="text--incident-responder-most-triggered-playbook-top-rules">
                  {{ labels.MostTriggeredPlaybookRules }}
                </p>
              </div>
              <div class="action">
                <v-btn
                  id="btn-link--incident-responder-playbook"
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
                ref="refTopRules"
                id="incident-responder-top-rules-data-table"
                class="no-sub-border-datatable"
                :loading="investigationsLoading || topRulesLoading"
                :refName="'topRules'"
                :columns="topRules.columns"
                :table="topRules.table"
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
              >
                <template v-slot:datatable-column-popup="{ scope, col }">
                  <span v-if="scope.row[col.property] === 0">
                    {{ labels.NoMatchEmptyText }}
                  </span>
                  <span v-else class="popup-link" @click="matchingPopupClick(scope.row)">
                    {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }}
                    {{ labels.Matches }}
                  </span>
                  <matching-incident-modal
                    v-if="showMatchingModal"
                    :status="scope.row.resourceId === selectedMatch.resourceId"
                    :selectedMatch="selectedMatch"
                    @closeOverlay="showMatchingModal = false"
                  />
                </template>
                <template v-slot:datatable-custom-column="{ scope }">
                  <span
                    v-if="scope.row.ruleName"
                    class="datatable-link"
                    @click="handeRuleNameClick(scope.row.resourceId)"
                  >
                    {{ scope.row.ruleName }}
                  </span>
                  <span v-else> </span>
                </template>
              </datatable>
            </div>
          </v-card>
        </div>
        <div v-if="getIncidentResponderRunningInvestigationsPermission" class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2 id="text--incident-responder-investigations-recent-investigations">
                  {{ labels.RecentInvestigations }}
                </h2>
                <p id="text--incident-responder-investigations-most-recent-investigations">
                  {{ labels.MostRecentInvestigations }}
                </p>
              </div>
              <div class="action">
                <v-btn
                  id="btn-link--incident-responder-investigation"
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
                :loading="investigationsLoading || topRulesLoading"
                :table="investigationsData"
                :refName="'recentInv'"
                ref="refRecentInv"
                id="incident-responder-investigations-data-table"
                :columns="recentInv.columns"
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
                class="no-sub-border-datatable"
                @onEmptyBtnClicked="onEmptyBtnClicked"
              />
            </div>
          </v-card>
        </div>
      </div>
      <div v-if="getIncidentResponderNotifiedEmailPermission" class="table-row">
        <v-card>
          <div class="header">
            <div class="title">
              <h2>
                {{
                  isShowingClusteredTable
                    ? clusteredRow[getClusteredField(selectedCluster)]
                    : labels.ReportedEmails
                }}
              </h2>
              <p class="mb-10">
                {{
                  isShowingClusteredTable
                    ? `Reported emails clustered by ${this.selectedCluster}`
                    : labels.SummaryOfReportedEmails
                }}
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
            filterable
            is-server-side
            options
            :table="clusteredTableData"
            :serverSideProps="serverSideClusteredProps"
            :server-side-events="{ pagination: true, search: true, sort: true }"
            :extended-view-loading="extendedViewLoading"
            :is-column-filter-active="clusteredTable.isColumnFilterActive"
            :extended-view-options="clusteredTable.extendedViewOptions"
            :columns="clusteredTable.columns"
            :empty="clusteredTable.iEmpty"
            :stored-table-settings="storedReportedEmailClusteredSettings"
            :loading="isReportedEmailsClusteredLoading"
            :row-actions="clusteredTable.rowActions"
            :extendedViewValue="extendedViewValue"
            :select-event="clusteredTable.selectEvent"
            :extendedViewDisableChanger="extendedViewDisableChanger"
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
            @set-default-search="handleSetDefaultSearchReportedEmailClustered"
            @restore-default-search="handleRestoreDefaultSearchReportedEmailClustered"
            @clear-filters="handleClearFiltersReportedEmailClustered"
            @on-table-settings-change="handleSetRenderedColumnsClusteredReportedEmail"
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
            is-server-side
            ref="refReportedEmails"
            id="incident-responder-reported-emails-data-table"
            active-cluster=""
            is-server-side-selection
            :loading="reportedEmailsLoading"
            :server-side-events="{ pagination: true, search: true, sort: true }"
            :is-column-filter-active="emails.isColumnFilterActive"
            :extendedViewDisableChanger="extendedViewDisableChanger"
            :table="reportedEmailsData"
            :refName="'reportedEmails'"
            :columns="emails.columns"
            :extended-view-loading="extendedViewLoading"
            :clusterItems="[{ name: 'Subject' }, { name: 'Reported By' }]"
            :changeFooterPosition="true"
            :is-custom-overflowed-column="isCustomOverflowedColumn"
            :extended-view-options="emails.extendedViewOptions"
            :extendedViewValue="extendedViewValue"
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
            :server-side-props="serverSideProps"
            :stored-table-settings="storedReportedEmailTableSettings"
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
            @set-default-search="handleSetDefaultSearchReportedEmail"
            @restore-default-search="handleRestoreDefaultSearchReportedEmail"
            @clear-filters="handleClearFiltersReportedEmail"
            @on-table-settings-change="handleSetRenderedColumnsReportedEmail"
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
    </div>
    <app-modal
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
    </app-modal>
  </div>
</template>
<script>
import {
  getRoiSettings,
  getRunningInvestigations,
  getTopRules,
  searchNotifiedMail,
  updateNotifiedEmail,
  updateNotifiedEmailBulk,
  updateRoiSettings
} from '@/api/incidentResponder'
import {
  getDataTableFieldLabel,
  getDefaultAxiosPayload,
  handleIsSafari,
  setSafariClusterFix
} from '@/utils/functions'
import DataTableColorfulText from '../components/DataTableComponents/DataTableColorfulText'
import { exportNotifiedEmails, getNotifiedEmail } from '@/api/notifiedEmail'
import Datatable from '../components/DataTable'
import NewInvestigation from '../components/Investigation/NewInvestigation'
import AppModal from '@/components/AppModal'
import { mapActions, mapGetters } from 'vuex'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AppDialog from '../components/AppDialog'
import { required, startsWith, maxLength } from '@/utils/validations'
import CreateOrEditRule from '../components/Playbook/CreateOrEditRule'
import CardLoading from '../components/SkeletonLoading/CardLoading'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import * as Validations from '@/utils/validations'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import ReAnalyzeIncidentDialog from '@/components/IncidentResponder/ReAnalyzeIncidentDialog'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal'
import SelectEmailTemplateModal from '@/components/IncidentResponder/SelectEmailTemplateModal'
import { getEmailTypesAndEmailTemplates } from '@/components/IncidentResponder/utils'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
export default {
  components: {
    SelectEmailTemplateModal,
    MatchingIncidentModal,
    ReAnalyzeIncidentDialog,
    TheRecordsButton,
    AppDialogFooter,
    Datatable,
    NewInvestigation,
    AppDialog,
    DataTableColorfulText,
    CreateOrEditRule,
    CardLoading,
    AppModal
  },
  props: {
    isLoadState: {
      type: Boolean
    }
  },
  data: () => ({
    waitingItemForApiItems: [],
    isShowEmailTemplateModal: false,
    dynamicReportedEmailProps: null,
    dynamicClusterProps: null,
    emailTemplates: [],
    templateTypes: [],
    mailDetails: {
      name: '',
      resourceId: ''
    },
    showReAnalyzeIncidentDialog: false,
    totalNumberOfRecordsMatchingPopup: 0,
    isCustomOverflowedColumn: false,
    selectedCluster: '',
    selectedTemplateResourceId: '',
    isMultipleSelectedTemplateResourceId: false,
    defaultSelectedTemplateResourceId: '',
    labels,
    clusteredRow: null,
    storedReportedEmailTableSettings: null,
    storedReportedEmailClusteredSettings: null,
    isConfirmButtonDisabled: false,
    topRulesLoading: false,
    isCustomMessageMultiple: false,
    investigationsLoading: false,
    investigationsData: [],
    reportedEmailsData: [],
    bindPropsIsSafari: {},
    reportedEmailsLoading: false,
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
    isShowingClusteredTable: false,
    showMatchingModal: false,
    selectedRowsOfReportedEmailsLength: 0,
    selectedReportedMails: null,
    noteDisableStatus: false,
    baseManHour: null,
    baseManHourCost: null,
    validations: {
      required,
      startsWith,
      maxLength
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
        btn: labels.New,
        icon: 'mdi-plus',
        id: 'btn-empty--incident-responder-rules'
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
        btn: labels.New,
        icon: 'mdi-plus',
        id: 'btn-empty--incident-responder-investigation'
      },
      selectEvent: {}
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
      selectEvent: {}
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
      pageSizes: [5, 10, 25],
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
    defaultRequestBodyReportedEmails: getDefaultAxiosPayload(),
    isReportedEmailsClusteredLoading: false,
    clusteredTable: {
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
      isColumnFilterActive: false,
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
    clusteredTableDefaultAxios: getDefaultAxiosPayload()
  }),
  computed: {
    ...mapGetters({
      irSummary: 'investigations/irSummaryGetter',
      getIncidentResponderSummaryPermission: 'permissions/getIncidentResponderSummaryPermission',
      getIncidentResponderTopRulesPermission: 'permissions/getIncidentResponderTopRulesPermission',
      getIncidentResponderRunningInvestigationsPermission:
        'permissions/getIncidentResponderRunningInvestigationsPermission',
      getIncidentResponderNotifiedEmailPermission:
        'permissions/getIncidentResponderNotifiedEmailPermission',
      getIncidentResponderNotifiedEmailReAnalyze:
        'permissions/getIncidentResponderNotifiedEmailReAnalyze'
    }),
    getPhishingReporterOnlineUserCount() {
      return this?.irSummary?.phishingReporterUserStatusCount?.onlineUsersCount || 0
    },
    getManuelInvestigationCount() {
      return this?.irSummary.investigationTypeCount?.manualInvestigationCount || 0
    },
    getAutomaticInvestigationCount() {
      return this?.irSummary?.investigationTypeCount?.automaticInvestigationCount || 0
    },
    getROISummaryTime() {
      return this?.irSummary?.roiSummary?.time || 0
    },
    getROISummaryRevenue() {
      return this?.irSummary?.roiSummary?.revenue || 0
    },
    isRoiSummaryEmpty() {
      const { roiSummary: { revenue = '0', time = '0' } = { revenue, time } } = this.irSummary
      return revenue === '0' && time === '0'
    },
    isPhishingEmpty() {
      const data = this.irSummary
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
    isInvestigationsEmpty() {
      const summary = this.irSummary
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
    isNotifiedEmailEmpty() {
      const data = this.irSummary
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
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    },
    getSelectedMatchingIncidentsSubtitle() {
      return this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch.ruleName}`
    },
    getEmailTemplateName() {
      if (this.isMultipleSelectedTemplateResourceId) return '(Multiple Values)'
      const template = this.emailTemplates.find(
        (item) => item.resourceId === this.selectedTemplateResourceId
      )
      return template && `${template.name} ${template.isDefault ? `(${labels.Default})` : ''}`
    }
  },
  watch: {
    getIncidentResponderNotifiedEmailReAnalyze: {
      immediate: true,
      handler(newValue) {
        this.emails.rowActions[4].disabled = !newValue
      }
    }
  },
  mounted() {
    this.incidentLoading = true
    this.$store.dispatch('investigations/getIrSummary').finally(() => {
      this.showDatatable = true
      this.incidentLoading = false
    })
    this.addQuery()
  },
  updated() {
    console.log('ir updated')
  },
  created() {
    this.setStoredTableSettings()
    this.getReportedEmailPersistentStateAndLoad()
    this.getClusteredEmailPersistentStateAndLoad()
    if (handleIsSafari()) {
      this.bindPropsIsSafari['handleSetCellClass'] = (obj) => {
        return setSafariClusterFix(obj, 'subject')
      }
    }
    this.getEmailTypesAndEmailTemplates()
    window.addEventListener('resize', this.addQuery)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.addQuery)
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
          const { filterValues = {} } = persistentStateContainer.tableState
          this.requestBodyReportedEmails = persistentStateContainer.requestBodyReportedEmails
          if (Object.keys(filterValues).length) {
            this.emails.isColumnFilterActive = true
          }
          this.initMethods(true)
          const { tableState, serverSideProps, selectedCluster } = persistentStateContainer
          this.serverSideProps = serverSideProps
          if (selectedCluster) {
            this.$nextTick(() => {
              this.$refs.refReportedEmails.$refs.elTableRef.columns[1].width = 360
            })
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
      this.callForGetRunningInvestigations()
      this.callForGetTopRules()
      this.callForSearchNotifiedMail()
      if (this.clusteredRow) {
        this.callForClusteredTable()
      }
      this.$store.dispatch('investigations/getIrSummary')
    },
    getDefaultFilterAndSearchReportedEmail(callApi = true) {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL)
      )
      if (savedFilter) {
        this.requestBodyReportedEmails.filter = savedFilter.filter
        this.emails.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refReportedEmails.filterValues = savedFilter.filterValues
          this.$refs.refReportedEmails.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      if (callApi) {
        this.callForSearchNotifiedMail()
      }
    },
    setStoredTableSettings() {
      this.storedReportedEmailTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.REPORTED_EMAIL)
      )
      this.storedReportedEmailClusteredSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CLUSTERED_REPORTED_EMAIL)
      )
    },
    getDefaultFilterAndSearchReportedEmailClustered(callApi = true) {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL_CLUSTERED)
      )
      if (savedFilter) {
        this.clusteredTableAxios.filter = savedFilter.filter
        this.clusteredTable.isColumnFilterActive = true
        this.$nextTick(() => {
          if (callApi) {
            this.$refs.refReportedEmailsClustered.filterValues = savedFilter.filterValues
            this.$refs.refReportedEmailsClustered.columnKey = `column-key${Math.random()
              .toString()
              .substring(0, 5)}`
          }
        })
      }
      if (callApi) {
        this.callForClusteredTable()
      }
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

      const { filterValues = {} } = clusteredTableState
      this.clusteredTableAxios = clusteredTableAxios
      if (Object.keys(filterValues).length) {
        this.clusteredTable.isColumnFilterActive = true
      }
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
        if (!(columns[0].property === PROPERTY_STORE.SUBJECT)) {
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
        if (!(columns[0].property === PROPERTY_STORE.REPORTEDBY)) {
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
      this.getDefaultFilterAndSearchReportedEmail(false)
      this.$nextTick(() => {
        this.$refs.refReportedEmails.$refs.elTableRef.columns[1].width = 360
      })
      this.requestBodyReportedEmails.pageNumber = 1
      this.requestBodyReportedEmails.clusteredBy = this.getClusteredField(selectedCluster)
      this.isCustomOverflowedColumn = true
      this.selectedCluster = selectedCluster
      this.callForSearchNotifiedMail()
    },
    resetTableFilters() {
      this.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems = []
      this.$refs.refReportedEmails.filterValues = {}
      if (this.$refs.refReportedEmails) {
        const { refReportedEmails } = this.$refs
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

      this.$refs.refReportedEmails.columnKey = `key-${Math.random().toString().substring(0, 7)}`
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
    handleRecordButtonClick(row) {
      this.clusteredRow = row
      this.dynamicClusterProps = null
      this.getDefaultFilterAndSearchReportedEmailClustered(false)
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
          search,
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
        Value: this.clusteredRow[fieldName]
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
    handleSetDefaultSearchReportedEmail(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL,
        JSON.stringify({
          filter: this.requestBodyReportedEmails.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearchReportedEmail() {
      this.getDefaultFilterAndSearchReportedEmail()
    },
    handleClearFiltersReportedEmail() {
      this.requestBodyReportedEmails = JSON.parse(
        JSON.stringify(this.defaultRequestBodyReportedEmails)
      )
      if (this.selectedCluster) {
        this.requestBodyReportedEmails.pageNumber = 1
        this.requestBodyReportedEmails.clusteredBy = this.getClusteredField(this.selectedCluster)
      }
      this.$refs.refReportedEmails.filterValues = {}
      this.$refs.refReportedEmails.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.callForSearchNotifiedMail()
    },
    handleSetDefaultSearchReportedEmailClustered(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.REPORTED_EMAIL_CLUSTERED,
        JSON.stringify({
          filter: this.clusteredTableAxios.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearchReportedEmailClustered() {
      this.getDefaultFilterAndSearchReportedEmailClustered()
    },
    handleClearFiltersReportedEmailClustered() {
      this.clusteredTableAxios = JSON.parse(JSON.stringify(this.clusteredTableDefaultAxios))
      this.$refs.refReportedEmailsClustered.filterValues = {}
      this.$refs.refReportedEmailsClustered.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.setClusteredTableFilters()
      this.callForClusteredTable()
    },
    handleListBulletedClick() {
      this.$refs.refReportedEmails.$refs.elTableRef.columns[1].width = 200
      this.requestBodyReportedEmails.clusteredBy = ''
      this.isCustomOverflowedColumn = false
      this.selectedCluster = ''
      this.resetTableFilters()
      this.getDefaultFilterAndSearchReportedEmail(false)
      this.callForSearchNotifiedMail()
    },
    extendedViewDisableChanger() {
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
      this.calculateIsFilterColumnActive()
      this.callForSearchNotifiedMail()
    },
    handleSetRenderedColumnsReportedEmail(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.REPORTED_EMAIL, JSON.stringify(tableSettings))
    },
    handleSetRenderedColumnsClusteredReportedEmail(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.CLUSTERED_REPORTED_EMAIL,
        JSON.stringify(tableSettings)
      )
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
      this.calculateClusteredIsFilterColumnActive()
      this.callForClusteredTable()
    },
    resetPageNumber() {
      this.requestBodyReportedEmails.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    initMethods(isLoadState = false) {
      this.callForGetRunningInvestigations()
      this.callForGetTopRules()
      if (!isLoadState) {
        this.getDefaultFilterAndSearchReportedEmail()
      }
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
            item.style = 'width: calc(50%) !important;max-width: calc(50%) !important;'
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
      if (resp?.data?.data?.resourceId) {
        this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
      }
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
        this.isConfirmButtonDisabled = true
        updateRoiSettings({
          baseManHour: this.baseManHour,
          baseManHourCost: this.baseManHourCost
        })
          .then(() => {
            this.incidentLoading = true
            this.callForGetRoiSettings()
            this.isShowRoi = false
            this.$store.dispatch('investigations/getIrSummary').finally(() => {
              this.incidentLoading = false
            })
          })
          .finally(() => {
            this.isConfirmButtonDisabled = false
          })
      }
    },
    onEditClick({ selected: selections, isEditPopupOpen, isMultiple, isSelectedAllEver }) {
      if (isEditPopupOpen && selections.length) {
        this.extendedViewLoading = true
        this.selectedRowsOfReportedEmailsLength = selections.length
        this.selectedReportedMails = selections
        if (selections.length === 1 && (!isMultiple || !this.extendedViewValue.length)) {
          this.isMultipleSelectedTemplateResourceId = false
          getNotifiedEmail(selections[0].resourceId)
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
    compareAndChangeExtendedViewParams(rows = [], allSelections) {
      if (allSelections && allSelections.length !== rows.length) {
        rows = [...this.extendedViewValue, ...rows]
      }
      const note = rows[0].note
      rows.map((item) => {
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
    closeNewInvestigationModal(value) {
      if (value) {
        this.callForGetRunningInvestigations()
        this.callForGetTopRules()
        this.callForSearchNotifiedMail()
      }
      this.isWantToAddNewInvestigation = false
    },
    callForGetRunningInvestigations() {
      if (this.getIncidentResponderRunningInvestigationsPermission) {
        this.investigationsLoading = true
        getRunningInvestigations()
          .then((response) => {
            const {
              data: { data }
            } = response
            this.investigationListData = data
            this.investigationsData = data || []
          })
          .catch(() => {
            this.investigationsData = []
          })
          .finally(() => {
            this.investigationsLoading = false
          })
      }
    },
    callForGetTopRules() {
      if (this.getIncidentResponderTopRulesPermission) {
        this.topRulesLoading = true
        getTopRules()
          .then((response) => {
            const {
              data: { data }
            } = response

            this.topRules.table = data || []
          })
          .catch(() => {
            this.topRules.table = []
          })
          .finally(() => (this.topRulesLoading = false))
      }
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
              this.$nextTick(() => {
                this.$refs.refReportedEmails.$refs.elTableRef.columns[1].width = 360
              })
            }
          })
          .finally(() => {
            this.reportedEmailsLoading = false
          })
      }
    },
    matchingPopupClick(match) {
      this.selectedMatch = match
      this.showMatchingModal = true
    },
    onEmptyBtnClicked() {
      this.$router.push({
        path: '/investigations',
        query: { openPopup: true }
      })
    },
    onTopRulesEmptyBtnClicked() {
      this.$router.push({ path: '/playbook', query: { openPopup: true } })
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
      if (selectedRows.length > 1 || (this.selectedCluster && !this.isShowingClusteredTable)) {
        const payload = {
          resourceIdList: []
        }
        if (isSelectedAllEver) {
          payload['selectAll'] = {
            filter: this.isShowingClusteredTable
              ? this.clusteredTableAxios
              : this.requestBodyReportedEmails.filter,
            excludedResourceIdList,
            clusteredBy: this.isShowingClusteredTable ? this.clusteredTableAxios.clusteredBy : ''
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
              payload.resourceIdList.push(...item.clusteredResourceIdList)
            }
          }
          sets.result.add(row.result)
          sets.status.add(row.status)
          const tags = typeof row.tags === 'string' ? row.tags : row.tags.join(',') || ''
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

        updateNotifiedEmailBulk(payload).finally(() => {
          this.callForGetRunningInvestigations()
          this.callForGetTopRules()
          this.callForSearchNotifiedMail()
          if (this.clusteredRow) {
            this.callForClusteredTable()
          }
          this.$store.dispatch('investigations/getIrSummary')
        })
      } else {
        const [item] = selectedRows
        const tag = typeof item.tags === 'string' ? item.tags : item.tags.join(',')
        const payload = {
          result: item.result,
          status: item.status,
          tag: tag || '',
          note: item.note || '',
          isNotifyUser: this.extendedView.isNotify,
          customMessage: this.extendedView.isMessage ? this.extendedView.customMessage : '',
          notificationTemplateResourceId: this.selectedTemplateResourceId
        }
        updateNotifiedEmail(item.resourceId, payload).then(() => {
          this.callForGetRunningInvestigations()
          this.callForGetTopRules()
          this.callForSearchNotifiedMail()
          if (this.clusteredRow) {
            this.callForClusteredTable()
          }
          this.$store.dispatch('investigations/getIrSummary')
        })
      }
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
    emptyPhishingButtonClick() {
      this.$router.push('/phishing-reporter')
    },
    emptyInvestigationButtonClick() {
      this.$router.push('/investigations')
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
      this.clusteredTable.isColumnFilterActive = true
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
      this.calculateClusteredIsFilterColumnActive()
    },
    columnFilterChanged(filter) {
      this.emails.isColumnFilterActive = true
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
      this.calculateIsFilterColumnActive()
      this.callForSearchNotifiedMail()
    },
    calculateIsFilterColumnActive() {
      this.emails.isColumnFilterActive = isColumnFilterActive(this.requestBodyReportedEmails)
    },
    calculateClusteredIsFilterColumnActive() {
      this.clusteredTable.isColumnFilterActive = isColumnFilterActive(this.clusteredTableAxios)
    }
  },

  beforeRouteLeave(to, from, next) {
    const { refNewInvestigation } = this.$refs
    if (this.openInvestigationOverlay) {
      this.openInvestigationOverlay = false
      next(false)
    } else if (refNewInvestigation && this.isWantToAddNewInvestigation) {
      if (to.name === 'Investigation Details') {
        return next()
      }
      refNewInvestigation.onCancelClicked()
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
        background-color: #5c7f9b;
      }

      &__opacity-red {
        background-color: #9b7879 !important;
      }

      &__opacity-green {
        background-color: #668267 !important;
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
        width: calc(50%) !important;
        max-width: calc(50%) !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .dashboard-cards__skeleton-loading {
        width: calc(100%) !important;
        max-width: calc(100%) !important;
      }
    }

    .dashboard-cards {
      min-height: 170px;
      max-height: 170px;
      border-radius: 8px;
      margin: 8px;
      padding: 16px;
      position: relative;
      overflow: hidden;

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
          font-size: 20px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.25;
          letter-spacing: normal;
          color: #fff;
          opacity: 1;
        }

        .body-row:nth-child(2) {
        }
      }

      .card-footer {
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.25;
        color: #fff;
        opacity: 1;
        //padding-bottom: 16px;

        &.no-data-text {
          font-size: 16px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          opacity: 0.7;
          color: #fff;
          margin-top: 62px;
          max-width: 85%;
          white-space: normal !important;
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
      background-color: #2196f3;
    }

    .investigations {
      background-color: #43a047;
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
  .filter__icon {
    margin-right: 8px;
  }
  .k-table__wrapper {
    padding-bottom: 0;
    overflow-x: auto;
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
.no-data__opacity-purple {
  background-color: #7b6c81;
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
.reported-email-subject {
  max-width: 75%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 16px;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.clustered-table-back-btn {
  font-size: 14px;
  font-weight: 600;
  padding: 0 8px;
  margin-right: 32px;
  + div {
    min-width: 328px;
  }
}
#text--extended-view-singular-value-Notes-7 {
  white-space: initial;
}
.incident-responder-extended-view-is-notify-sub-label {
  font-size: 9px;
  line-height: 12px;
  color: rgba(56, 59, 65, 0.72);
  margin-left: 32px;
  span {
    margin-left: 8px;
    color: #2196f3;
    font-size: inherit !important;
    font-weight: 600 !important;
    cursor: pointer;
    min-width: 40px;
  }
}
</style>
