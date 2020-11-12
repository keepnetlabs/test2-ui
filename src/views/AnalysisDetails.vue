<template>
  <div class="analysis-details">
    <div class="main-column">
      <v-card class="parent-card">
        <p class="card-header">Email Details - File Format Exploit</p>
        <v-card class="inline-card">
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab>
              Details
            </v-tab>
            <v-tab>
              Email Preview
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <div class="card-content">
                <div class="one-row">
                  <div class="double-col">
                    To
                  </div>
                  <div class="double-col">
                    sedatozdemirtest3@outlook.com
                  </div>
                </div>
                <div class="one-row">
                  <div class="double-col">
                    From
                  </div>
                  <div class="double-col">
                    ets@securelogout.com
                  </div>
                </div>
                <div class="one-row">
                  <div class="double-col">
                    Subject
                  </div>
                  <div class="double-col">
                    File Format Exploits
                  </div>
                </div>
                <div class="one-row">
                  <div class="double-col">
                    Analysis Date
                  </div>
                  <div class="double-col">
                    7/26/2019 5:22:30 PM
                  </div>
                </div>
                <div class="one-row">
                  <div class="double-col">
                    <span style="color: #2196f3;">Preview Email</span>
                  </div>
                  <div class="double-col"></div>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="card-content">
                Email preview
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-card>
      <v-card class="parent-card mt-6">
        <p class="card-header">Attachment Analysis</p>
        <v-card class="inline-card mt-10">
          <div class="card-content attachment-content">
            <div class="one-row">
              <div class="double-col">
                Attachment Name
              </div>
              <div class="download-row double-col">
                <span class="name">watermark_master.wcf</span>
                <div class="download">
                  <v-icon>mdi-download</v-icon>
                  DOWNLOAD FILE
                </div>
                <span class="message">
                  *This file was not uploaded to any integration
                </span>
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                SHA512
              </div>
              <div class="double-col">
                ad332bacf12da20cdcf84c6ed5dd590a8cb428acd1f636fc1a5c9fb4cf06e584b3b3c2fc97b6e0bab2d27cea60d13cd053ade7e7f2cb0aaa7117d9b1401a37a0
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                MD5
              </div>
              <div class="double-col">
                1f0e84c265ebe2911565c091afa36df9
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                Content Type
              </div>
              <div class="double-col">
                application/octet-stream
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                VirusTotal
              </div>
              <div class="double-col">
                File Format Exploits
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                Valkyre
              </div>
              <div class="double-col">
                File Format Exploits
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                Roksit
              </div>
              <div class="double-col">
                File Format Exploits
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                PhishTank
              </div>
              <div class="double-col">
                File Format Exploits
              </div>
            </div>
            <div class="one-row">
              <div class="double-col">
                Hybrid Analysis
              </div>
              <div class="double-col">
                File Format Exploits
              </div>
            </div>
          </div>
        </v-card>
      </v-card>
      <v-card class="parent-card mt-6">
        <p class="card-header">URL Analysis</p>
        <div class="table-wrapper">
          <datatable
            :refName="'topRules'"
            :columns="emails.columns"
            :table="emails.table"
            :title="{}"
            :countRow="5"
            :pageSizes="[]"
            :defaultSort="'subject'"
            :selectable="true"
            :filterable="true"
            :options="true"
            :rowActions="emails.rowActions"
            :addUsers="false"
            :empty="emails.iEmpty"
          />
        </div>
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
    tab: null,
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
      pageSizes: [5, 10, 25],
      rowActions: [
        {
          name: 'Preview',
          icon: 'mdi-eye',
          action: 'preview'
        },
        {
          name: 'Details',
          icon: 'mdi-text-box-multiple',
          action: 'details'
        },
        {
          name: 'Investigate',
          icon: 'mdi-magnify',
          action: 'investigate'
        }
      ],
      iEmpty: {
        message: 'No emails analyzed, yet',
        subMes: 'Start now',
        btn: 'REPORT',
        icon: 'mdi-arrow-right'
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.analysis-details {
  padding: 16px;
  position: relative;

  .parent-card {
    padding: 24px;
    position: relative;
    border-radius: 12px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);

    .card-header {
      font-family: 'Open Sans', sans-serif;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.6;
      letter-spacing: normal;
      color: #2196f3;
    }
    .inline-card {
      padding: 24px;
      padding-top: 10px;
      margin-top: 24px;
      border-radius: 20px;
      box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
      min-height: 300px;

      .v-tab {
        padding: 0 !important;
        font-size: 20px;
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.15;
        letter-spacing: normal;
        text-transform: none;
        color: rgba(0, 0, 0, 0.87);
        min-width: min-content !important;
        text-align: left !important;
      }
      .v-card.v-sheet.theme--light {
        padding-top: 0;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 20px;
      }
      ::v-deep .v-slide-group__content {
        border-bottom: 2px solid #e4e7ed;
        margin-right: 20px;
      }
      ::v-deep .v-tabs-slider-wrapper {
        bottom: 0 !important;
        color: #0486fe !important;
      }

      ::v-deep .v-tabs-bar {
        height: 60px !important;

        .v-tab {
          font-family: 'Open Sans', sans-serif !important;
          font-weight: 400;
          line-height: 31px;
          margin-right: 48px;
        }
      }

      .card-content {
        margin-top: 26px;
        position: relative;

        .one-row {
          display: flex;
          justify-content: flex-start;
          padding-bottom: 16px;

          .double-col:first-child {
            font-weight: 600;
            min-width: 130px;
            width: max-content;
          }
          .double-col {
            font-family: 'Open Sans', sans-serif !important;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }
        }
      }
      .attachment-content {
        .one-row {
          .double-col:first-child {
            text-align: right;
            min-width: 170px !important;
            padding-right: 24px;
          }
          .double-col:nth-child(2) {
            max-width: 600px;
          }
          .download-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            max-width: 800px !important;

            > div,
            span {
              padding-right: 24px;
            }
          }
        }
      }
    }
    .table-wrapper {
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
  }
}
</style>
