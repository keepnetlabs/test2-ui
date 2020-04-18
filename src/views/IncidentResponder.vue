<template>
  <div class="incident-responder">
    <div class="columns-row">
      <div class="dashboard-cards phishing-reporter mr-2">
        <div class="card-header">
          <span class="head">Phishing Reporter</span>
          <v-icon color="#fff">mdi-open-in-new</v-icon>
        </div>
        <div class="card-body">
          <span class="biggest">122</span>
        </div>
        <div class="card-footer">of 145 users are</div>
        <div class="card-status">Active</div>
        <div class="bg-image" style="bottom: 10px;">
          <img src="../assets/img/shape.svg" />
        </div>
      </div>
      <div class="dashboard-cards incident-analysis mr-2">
        <div class="card-header">
          <span class="head">Incident Analysis</span>
          <v-icon color="#fff">mdi-open-in-new</v-icon>
        </div>
        <div class="card-body">
          <span class="biggest">57</span>
        </div>
        <div class="card-footer">of 102 reported emails</div>
        <div class="card-status">Found harmful</div>
        <div class="bg-image">
          <img src="../assets/img/ic-warning.svg" />
        </div>
      </div>
      <div class="dashboard-cards investigations mr-2">
        <div class="card-header">
          <span class="head">Investigations</span>
          <v-icon color="#fff">mdi-open-in-new</v-icon>
        </div>
        <div class="card-body">
          <div class="body-row">
            45
            <span>automated</span>
          </div>
          <div class="body-row">
            12
            <span>manual</span>
          </div>
        </div>
        <div class="card-status">Incidents resolved</div>
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
            134h
            <span>and</span>
          </div>
          <div class="body-row">$550k</div>
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
              <v-btn class="btn-action btn-playbook" block rounded>
                Playbook
                <v-icon class="pl-2">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="table">
            <datatable
              :refName="'topRules'"
              :columns="topRules.columns"
              :table="topRules.table"
              :title="{}"
              :countRow="5"
              :pageSizes="[]"
              :defaultSort="'status'"
              :selectable="false"
              :filterable="false"
              :rowActions="[]"
              :addUsers="topRules.addMenu"
              :empty="topRules.iEmpty"
              :selectEvent="topRules.selectEvent"
              :chartOptions="topRules.chartOptions"
            />
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
                All Investigations
                <v-icon class="pl-2">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="table investigations">
            <datatable
              :refName="'topRules'"
              :columns="recentInv.columns"
              :table="recentInv.table"
              :title="{}"
              :countRow="5"
              :pageSizes="[]"
              :defaultSort="'priority'"
              :selectable="false"
              :filterable="false"
              :rowActions="[]"
              :addUsers="recentInv.addMenu"
              :empty="recentInv.iEmpty"
              :selectEvent="recentInv.selectEvent"
              :chartOptions="recentInv.chartOptions"
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
            <p>
              Suspicious emails reported by users via Phishing Reporter and their analyze results
            </p>
          </div>
        </div>
        <datatable
          :refName="'topRules'"
          :columns="emails.columns"
          :table="emails.table"
          :title="{}"
          :countRow="5"
          :pageSizes="emails.pageSizes"
          :defaultSort="'subject'"
          :selectable="true"
          :filterable="true"
          :options="true"
          :rowActions="emails.rowActions"
          :addUsers="emails.addUsers"
          :empty="emails.iEmpty"
          :selectEvent="emails.selectEvent"
          :chartOptions="emails.chartOptions"
        />
      </v-card>
    </div>
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
export default {
  components: {
    Datatable
  },
  data: () => ({
    topRules: {
      table: [
        {
          id: 1,
          ruleName: 'Has Attachment',
          matching: '13 matches',
          status: 'Active'
        },
        {
          id: 2,
          ruleName: 'Sender: Spam',
          matching: '8 matches',
          status: 'Active'
        },
        {
          id: 3,
          ruleName: 'contains XLS file',
          matching: '8 matches',
          status: 'Active'
        },
        {
          id: 4,
          ruleName: 'Rule Name',
          matching: '5 matches',
          status: 'Inactive'
        },
        {
          id: 5,
          ruleName: 'Rule Name',
          matching: 'No match',
          status: 'Inactive'
        }
      ],
      columns: [
        {
          property: 'ruleName',
          align: 'left',
          editable: false,
          label: 'Rule Name',
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
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
          type: 'text',
          minWidth: '31'
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
          minWidth: '30'
        }
      ],
      iEmpty: {
        message: 'No rules triggered, yet',
        subMes: 'Start now',
        btn: 'PLAYBOOK',
        icon: 'mdi-arrow-right'
      },
      addUsers: {
        show: false,
        popUp: false
      },
      addMenu: {
        show: false,
        popUp: false
      },
      selectEvent: {},
      chartOptions: {}
    },
    recentInv: {
      table: [
        {
          id: 1,
          invName: 'Has Attachment',
          progress: 77,
          priority: 'High'
        },
        {
          id: 2,
          invName: 'Sender: Spam',
          progress: 50,
          priority: 'High'
        },
        {
          id: 3,
          invName: 'contains XLS file',
          progress: 87,
          priority: 'Medium'
        },
        {
          id: 4,
          invName: 'Rule Name',
          progress: 87,
          priority: 'Low'
        },
        {
          id: 5,
          invName: 'Rule Name',
          progress: 100,
          priority: 'Medium'
        }
      ],
      columns: [
        {
          property: 'invName',
          align: 'left',
          editable: false,
          label: 'Investigation Name',
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '40'
        },
        {
          property: 'progress',
          align: 'center',
          editable: false,
          label: 'Progress',
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
          label: 'Priority',
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
        message: 'No rules triggered, yet',
        subMes: 'Start now',
        btn: 'PLAYBOOK',
        icon: 'mdi-arrow-right'
      },
      selectEvent: {},
      chartOptions: {}
    },
    emails: {
      table: [
        {
          id: 1,
          subject: 'File Format Exploit',
          reported: 'Pratima Muzopadhyay',
          source: 'Auto',
          priority: 'High',
          status: 'Phishing',
          created: '08.17.2019'
        },
        {
          id: 2,
          subject: 'Suspicious Email Analysis Report',
          reported: 'Kobe Byrant',
          source: 'Manual',
          priority: 'High',
          status: 'Malicious',
          created: '05.13.2019'
        },
        {
          id: 3,
          subject: 'File Format Exploit',
          reported: 'Chinmay Sarasvati',
          source: 'Auto',
          priority: 'Medium',
          status: 'Clean',
          created: '12.19.2019'
        },
        {
          id: 4,
          subject: 'Email subject',
          reported: 'Benedita Tavares',
          source: 'Attachment',
          priority: 'Low',
          status: 'Phishing',
          created: '11.04.2018'
        },
        {
          id: 5,
          subject: 'File Format Exploit',
          reported: 'Abbie Wilson',
          source: 'Rule Name',
          priority: 'Medium',
          status: 'Clean',
          created: '04.13.2017'
        }
      ],
      columns: [
        {
          property: 'subject',
          align: 'left',
          editable: false,
          label: 'Subject',
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: '300'
        },
        {
          property: 'reported',
          align: 'left',
          editable: false,
          label: 'Reported by',
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '200'
        },
        {
          property: 'source',
          align: 'left',
          editable: false,
          label: 'Source',
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '120'
        },
        {
          property: 'priority',
          align: 'left',
          editable: false,
          label: 'Priority',
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '90'
        },
        {
          property: 'status',
          align: 'center',
          editable: false,
          label: 'Status',
          fixed: 'right',
          sortable: true,
          show: true,
          type: 'status',
          width: '120'
        },
        {
          property: 'created',
          align: 'right',
          editable: false,
          label: 'Created',
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: '120'
        }
      ],
      pageSizes: [5, 10, 25, 50, 100],
      rowActions: [
        {
          name: 'Go to the report',
          icon: 'mdi-text-box-multiple',
          action: 'goToReport'
        }
      ],
      addUsers: {
        show: true,
        popUp: true
      },
      addMenu: {
        show: true,
        popUp: false
      },
      iEmpty: {
        message: 'No emails analyzed, yet',
        subMes: 'Start now',
        btn: 'REPORT',
        icon: 'mdi-arrow-right'
      },
      selectEvent: {
        clipboard: true,
        edit: true,
        delete: true,
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
  })
}
</script>
<style lang="scss" scoped>
.incident-responder {
  padding: 0 8px;
  padding-bottom: 35px;
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
    max-width: 300px;
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
        font-family: 'Open Sans', sans-serif;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.15;
        letter-spacing: normal;
      }
      i {
        font-size: 20px !important;
      }
    }
    .card-body {
      font-family: 'Open Sans', sans-serif;
      font-size: 48px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
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
      font-family: 'Open Sans', sans-serif;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      color: #fff;
      padding-bottom: 16px;
    }
    .card-status {
      font-family: 'Open Sans', sans-serif;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #fff;
      bottom: 24px;
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
  }
}
.double-table {
  align-items: center;
  display: flex;
  flex-direction: row;
  padding-top: 8px;
  width: 100%;

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
      min-height: 500px;
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

          h2 {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.6;
            letter-spacing: normal;
            color: #2196f3;
          }
          p {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.7);
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
            max-width: 100%;

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
    min-height: 500px;
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
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.6;
          letter-spacing: normal;
          color: #2196f3;
        }
        p {
          font-family: 'Open Sans', sans-serif;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.7);
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
          padding: 12px 0 !important;
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
</style>
