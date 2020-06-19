<template>
  <div class="incident-wrapper">
    <div class="incident-responder">
      <v-overlay
        id="add-new-community-overlay"
        :value="openInvestigationOverlay"
        :class="{ newInvestigationOverlay: openInvestigationOverlay }"
        :opacity="1"
        :z-index="999"
        color="white"
      >
        <new-investigation @closeAdd="openInvestigationOverlay = false" />
      </v-overlay>
      <div class="columns-row">
        <div
          class="dashboard-cards phishing-reporter mr-2"
          :class="{
            'no-data__opacity-blue': isPhishingEmpty(irSummary)
          }"
        >
          <div class="card-header">
            <span class="head">Phishing Reporter</span>
            <v-icon color="#fff">mdi-open-in-new</v-icon>
          </div>
          <div class="columns-row__body" v-if="!isPhishingEmpty(irSummary)">
            <div class="card-body">
              <span class="biggest">{{
                (irSummary &&
                  irSummary.phishingReporterUserStatusCount &&
                  irSummary.phishingReporterUserStatusCount.onlineUsersCount) ||
                0
              }}</span>
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
              users are
            </div>
            <div class="card-status">Online</div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">
              Add-in isn’t installed at any users’ account, yet
            </div>
            <button
              class="btn-action btn-playbook btn-playbook__no-data"
              block
              rounded
              @click="emptyPhishingButtonClick"
            >
              Start Now
            </button>
          </div>
          <div class="bg-image" style="bottom: 10px;">
            <img src="../assets/img/shape.svg" />
          </div>
        </div>
        <div
          class="dashboard-cards incident-analysis mr-2"
          :class="{
            'no-data__opacity-red': isNotifiedEmailEmpty(irSummary)
          }"
        >
          <div class="card-header">
            <span class="head">Incident Analysis</span>
            <v-icon color="#fff">mdi-open-in-new</v-icon>
          </div>
          <div class="columns-row__body" v-if="!isNotifiedEmailEmpty(irSummary)">
            <div class="card-body">
              <span class="biggest">{{
                (irSummary &&
                  irSummary.notifiedEmailResultCount &&
                  irSummary.notifiedEmailResultCount.maliciousCount) ||
                0
              }}</span>
            </div>
            <div class="card-footer">
              of
              {{
                (irSummary &&
                  irSummary.notifiedEmailResultCount &&
                  irSummary.notifiedEmailResultCount.maliciousCount) ||
                0
              }}
              reported emails
            </div>
            <div class="card-status">Found harmful</div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">You haven’t analysed any emails, yet</div>
            <!--<button class="btn-action btn-playbook btn-playbook__no-data" block rounded
                  @click="emptyNotifiedEmailButtonClick">
            Start Now
          </button>-->
          </div>
          <div class="bg-image">
            <img src="../assets/img/ic-warning.svg" />
          </div>
        </div>
        <div
          class="dashboard-cards investigations mr-2"
          :class="{
            'no-data__opacity-green': investigationListData && !investigationListData.length
          }"
        >
          <div class="card-header">
            <span class="head">Investigations</span>
            <v-icon color="#fff">mdi-open-in-new</v-icon>
          </div>
          <div
            class="columns-row__body"
            v-if="investigationListData && investigationListData.length"
          >
            <div class="card-body">
              <div class="body-row">
                {{
                  (irSummary &&
                    irSummary.investigationTypeCount &&
                    irSummary.investigationTypeCount.automaticInvestigationCount) ||
                  0
                }}
                <span>automated</span>
              </div>
              <div class="body-row">
                {{
                  (irSummary &&
                    irSummary.investigationTypeCount &&
                    irSummary.investigationTypeCount.manualInvestigationCount) ||
                  0
                }}
                <span>manual</span>
              </div>
            </div>
            <div class="card-status">Incidents resolved</div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">You haven’t started any investigations, yet</div>
            <button
              class="btn-action btn-playbook btn-playbook__no-data"
              block
              rounded
              @click="emptyInvestigationButtonClick"
            >
              Start Now
            </button>
          </div>
          <div class="bg-image">
            <img src="../assets/img/ic-check-box.svg" />
          </div>
        </div>
        <div class="dashboard-cards roi-summary">
          <div class="card-header">
            <span class="head">ROI Summary</span>
          </div>
          <div class="card-body">
            <div class="body-row">
              {{ (irSummary && irSummary.roiSummary && irSummary.roiSummary.time) || 0 }}h
              <span>and</span>
            </div>
            <div class="body-row">
              ${{ (irSummary && irSummary.roiSummary && irSummary.roiSummary.revenue) || 0 }}k
            </div>
          </div>
          <div class="card-status">Saved</div>
          <div class="bg-image">
            <img src="../assets/img/ic-insert-chart.svg" />
          </div>
        </div>
      </div>
      <div class="double-table">
        <div class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2>Top Rules</h2>
                <p>Most triggered rules from Playbook</p>
              </div>
              <div class="action">
                <v-btn
                  class="btn-action btn-playbook"
                  block
                  rounded
                  @click="$router.push('/playbook')"
                >
                  Playbook
                  <v-icon class="pl-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="table">
              <datatable
                :refName="'topRules'"
                ref="refTopRules"
                :columns="topRules.columns"
                :table="topRules.table"
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
              </datatable>
            </div>
          </v-card>
        </div>
        <div class="column">
          <v-card>
            <div class="header">
              <div class="title">
                <h2>Recent Investigations</h2>
                <p>Recently performed investigations</p>
              </div>
              <div class="action">
                <v-btn
                  class="btn-action btn-investigations"
                  style="padding: 0 13px !important;"
                  block
                  rounded
                  @click.native="$router.push('/investigations')"
                >
                  Investigations
                  <v-icon class="pl-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="table investigations">
              <datatable
                :refName="'recentInv'"
                ref="refRecentInv"
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
              <h2>Reported Emails</h2>
              <p class="mb-8">
                Suspicious emails reported by users via Phishing Reporter and their analyze results
              </p>
            </div>
          </div>
          <datatable
            :refName="'reportedEmails'"
            ref="refReportedEmails"
            :columns="emails.columns"
            :countRow="5"
            :pageSizes="emails.pageSizes"
            :defaultSort="'subject'"
            :selectable="true"
            :filterable="true"
            :options="true"
            :rowActions="emails.rowActions"
            :addUsers="emails.addUsers"
            :empty="emails.iEmpty"
            :groupable="true"
            :selectEvent="emails.selectEvent"
            @downloadEvent="exportReportedListEmails"
            @onEmptyBtnClicked="onEmptyReportedEmailsBtnClicked"
            @irPreview="irPreviewOnClick"
            @handleInvestigate="handleReportedEmailInvestigate"
            @handleDetails="irDetailsOnClick"
            @handleEdit="handleEdit"
          >
            <template v-slot:data-table-edit-popup-body>
              <div class="row-edit-div" style="order: 59;">
                <div>
                  <label>
                    Notes
                  </label>
                  <v-text-field
                    dense
                    solo
                    v-model="notes"
                    placeholder="Write Notes For This Incident"
                  />
                </div>
              </div>

              <div class="row-edit-div" style="order: 60;">
                <v-checkbox
                  v-model="isNotifyMail"
                  color="#2196f3"
                  label="Notify Reporting User Aborting this Update"
                />
              </div>
              <div class="row-edit-div mt-n2" style="order: 70;">
                <v-checkbox v-model="isCustomMessage" color="#2196f3" label="Add Custom Message" />
              </div>
            </template>
          </datatable>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import { exportReportedEmails } from '../api/integrations'
import Datatable from '../components/DataTable'
import NewInvestigation from '../components/Investigation/NewInvestigation'
import { getTopRules, getRunningInvestigations, searchNotifiedMail } from '../api/incidentResponder'
import { mapActions, mapGetters } from 'vuex'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '../model/constants/commonConstants'
import { exportPhishingReporterUserList } from '../api/phishingReporter'

export default {
  components: {
    Datatable,
    NewInvestigation
  },

  data: () => ({
    openInvestigationOverlay: false,
    investigationListData: [],
    notes: '',
    isNotifyMail: true,
    isCustomMessage: false,
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
          type: 'link',
          href: '/playbook',
          hrefKey: 'resourceId',
          minWidth: '40'
        },
        {
          property: 'matching',
          align: 'right',
          editable: false,
          label: 'Matching Incidents',
          fixed: false,
          sortable: false,
          show: true,
          type: 'link',
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
        message: "There isn't any rules, yet",
        btn: 'CREATE NEW RULE',
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
          label: 'Investigation Name',
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
          property: 'priority',
          align: 'center',
          editable: false,
          label: getStoreValue('priority'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
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
        message: "There isn't any investigations, yet",
        btn: 'START A NEW INVESTIGATION',
        icon: 'mdi-plus'
      },
      selectEvent: {},
      chartOptions: {}
    },
    emails: {
      table: [],
      columns: [
        {
          property: PROPERTY_STORE.SUBJECT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.SUBJECT),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: '300',
          isEditable: false
          //minWidth: 80
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
          width: 80
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
          isEditable: false
          //minWidth: 100
        },
        {
          property: PROPERTY_STORE.RESULT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.RESULT),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          isEditable: false,
          editComponent: 'select',
          editComponentItems: ['Very Low', 'Low', 'Medium', 'High', 'Very High', 'N/A'],
          width: '150'
          //minWidth: 80
        },
        {
          property: PROPERTY_STORE.STATUS,
          isEditable: true,
          align: 'center',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: false,
          sortable: false,
          show: true,
          type: 'status',
          width: '150',
          fullWidth: true,
          editComponent: 'select',
          editComponentItems: ['Open', 'Malicious', 'Phishing', 'Clean']
          // minWidth: 80
        },
        {
          property: PROPERTY_STORE.CREATEDATE,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATEDATE),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          editComponent: 'datepicker',
          width: '230'
        }
      ],
      pageSizes: [5, 10, 25, 50, 100],
      rowActions: [
        {
          name: 'Edit',
          icon: 'mdi-pencil',
          action: 'edit',
          isNotShow: true
        },
        {
          name: 'Preview Email',
          icon: 'mdi-eye',
          action: 'irPreview'
        },
        {
          name: 'Details',
          icon: 'mdi-text-box-multiple',
          action: 'handleDetails'
        },
        {
          name: 'Investigate',
          icon: 'mdi-magnify',
          action: 'handleInvestigate'
        }
      ],
      addMenu: {
        show: true,
        popUp: false
      },
      iEmpty: {
        message: "There isn't any reported mail, yet",
        subMes:
          'Emails that are reported by your users via Keepnet Phishing Reporter add-in analysed and listed here',
        btn: 'PHISHING REPORTER SETTINGS',
        icon: 'mdi-arrow-right'
      },
      selectEvent: {
        clipboard: true,
        edit: true,
        download: true
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
    }
  }),
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      irSummary: 'investigations/irSummaryGetter' // for using getters
    })
  },
  mounted() {
    this.$store.dispatch('investigations/getIrSummary').finally(() => (this.showDatatable = true)) //module name than method name
  },
  created() {
    getRunningInvestigations()
      .then((response) => {
        const {
          data: { data, status }
        } = response
        this.investigationListData = data
        this.$refs.refRecentInv.loadWithDataArray(data || [])
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the recent investigations! '
        })
      })
    getTopRules()
      .then((response) => {
        const {
          data: { data, status }
        } = response
        this.$refs.refTopRules.loadWithDataArray(data || [])
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the top rules!'
        })
      })
    const payload = {
      pageNumber: 1,
      pageSize: 5,
      orderBy: 'CreateDate',
      ascending: true
    }
    searchNotifiedMail(payload)
      .then((response) => {
        const {
          data: {
            data: { results },
            status
          }
        } = response
        const tableData = results.map((item) => {
          const result = { ...item, result: item.resultTag + `,${item.result}` }
          return result
        })
        this.$refs.refReportedEmails.loadWithDataArray(tableData || [])
      })
      .catch((error) => {
        /*this.$store.dispatch('common/createSnackBar', {
          errorState: true,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the notified emails!'
        })*/
      })
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    onEmptyBtnClicked() {
      this.$router.push({ path: '/investigations', query: { openPopup: true } })
    },
    onTopRulesEmptyBtnClicked() {
      this.$router.push({ path: '/playbook', query: { openPopup: true } })
    },
    onEmptyReportedEmailsBtnClicked() {
      this.$router.push({ path: '/phishing-reporter', hash: '#settings' })
    },
    irPreviewOnClick(row) {
      this.$router.push({
        name: 'Analysis Details',
        params: { id: row.resourceId }
      })
    },
    handleEdit(selectedRow) {},
    irDetailsOnClick(row) {
      this.$router.push({
        name: 'Analysis Details',
        params: { id: row.resourceId }
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
        data.notifiedEmailResultCount.maliciousCount
      ) {
        return false
      } else {
        return true
      }
    },
    handleReportedEmailInvestigate(row) {
      this.$router.push({
        name: 'Investigations',
        params: {
          selectedEmail: row,
          isSelectedEmail: true
        }
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

    exportReportedListEmails({ exportTypes, reportAllPages, pageNumber }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: 1,
          pageSize: 3,
          orderBy: 'Name',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportReportedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `users.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
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
.incident-wrapper {
  .incident-responder {
    padding: 0 8px;
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
        max-width: 112px;
        min-width: 112px;
        height: 36px;
      }
    }
  }

  .columns-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media only screen and (max-width: 1023px) {
      flex-wrap: wrap;

      .dashboard-cards {
        width: calc(50% - 16px) !important;
        max-width: calc(50% - 16px) !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .dashboard-cards {
        width: calc(100% - 16px) !important;
        max-width: calc(100% - 16px) !important;
      }
    }

    .dashboard-cards {
      width: 25%;
      min-height: 250px;
      border-radius: 8px;
      margin: 8px;
      padding: 10px 15px;
      position: relative;

      .card-header {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 34px;

        .head {
          color: #fff;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: normal;
        }

        i {
          font-size: 20px !important;
        }
      }

      .card-body {
        font-size: 48px;
        font-weight: normal;
        line-height: 1.13;
        letter-spacing: normal;
        color: #fff;

        span {
          font-size: 20px;
        }

        .biggest {
          font-size: 80px;
        }

        .body-row:first-child {
          width: 100%;
          padding-bottom: 14px;
        }

        .body-row:nth-child(2) {
          padding-bottom: 24px;
        }
      }

      .card-footer {
        font-size: 20px;
        font-weight: normal;
        line-height: 1.25;
        letter-spacing: normal;
        color: #fff;
        padding-bottom: 16px;

        &.no-data-text {
          font-size: 20px;
          line-height: 1.25;
          letter-spacing: normal;
          color: #ffffff;
          margin-top: 40px;
          min-height: 80px;
        }
      }

      .card-status {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: normal;
        color: #fff;
        bottom: 24px;
        position: absolute;
      }

      .bg-image {
        position: absolute;
        right: 0;
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
    }
  }

  .double-table {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    padding-top: 8px;
    width: 100%;

    .k-table__wrapper .card {
      justify-content: unset;
      box-shadow: none !important;
      padding: 0px !important;
      border: none !important;
      border-radius: 0 !important;
      .table-wrapper {
        padding-top: 0;
        border: none !important;
        border-radius: 0 !important;
      }
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
        min-height: 260px;
        padding: 24px;
        padding-bottom: 0;

        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          @media only screen and (max-width: 1024px) {
            flex-direction: column;
            .title,
            .action {
              min-width: 100% !important;
              max-width: 100% !important;
              width: 100% !important;
            }
          }

          .title {
            width: 65%;

            margin-bottom: 24px;

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
            min-width: 25%;
            max-width: 35%;

            .btn-action {
              font-size: 14px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.71;
              letter-spacing: normal;
              color: #2196f3;
              background-color: #ffffff !important;
              font-family: 'Open Sans', sans-serif !important;
              padding: 0 !important;
              height: 36px !important;
              border-radius: 18px;
              box-shadow: none !important;
              max-width: 100%;
              border-radius: 18px;
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
          min-width: 25%;
          max-width: 35%;

          .btn-action {
            background-color: #2196f3 !important;
            color: #fff;
            font-family: 'Open Sans', sans-serif !important;
            font-size: 14px;
            font-weight: 400;
            font-stretch: normal;
            font-style: normal;
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
</style>
