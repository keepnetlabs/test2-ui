<template>
  <div class="sandbox">
    <div class="incident-responder-parent">
      <div class="incident-responder">
        <div class="columns-row">
          <CardLoading
            :loading="incidentLoading"
            class="dashboard-cards__skeleton-loading"
            :class="[incidentLoading && 'dashboard-cards-loading']"
          >
            <template v-slot:skeleton-content>
              <div
                id="card--incident-responder-phishing-reporter"
                class="dashboard-cards phishing-reporter mr-2"
              >
                <div class="card-header">
                  <span class="head">Total Analysis Request</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-phishing-reporter-online-users-count"
                    >
                      {{ summaryData.totalAnalysisRequest || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-phishing-reporter-total-users-count"
                  >
                    from
                    {{ summaryData.clientCount || 0 }}
                    clients
                  </div>
                </div>
                <div class="bg-image" style="bottom: 10px; right: -11px;">
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
                class="dashboard-cards incident-analysis mr-2"
              >
                <div class="card-header">
                  <span class="head">Found Phishing</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count"
                    >
                      {{ summaryData.totalHarmfulUrl || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count"
                  >
                    of
                    {{ summaryData.totalAnalyzedUrl || 0 }}
                    analysed URLs
                  </div>
                </div>
                <div class="bg-image">
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
                id="card--incident-responder-investigations"
                class="dashboard-cards investigations mr-2"
              >
                <div class="card-header">
                  <span class="head">Found Malicious</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count2"
                    >
                      {{ summaryData.totalHarmfulAttachment || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count3"
                  >
                    of
                    {{ summaryData.totalAnalyzedAttachment || 0 }}
                    analysed files
                  </div>
                </div>
                <div class="bg-image">
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
              <div id="card--incident-responder-roi-summary" class="dashboard-cards roi-summary">
                <div class="card-header">
                  <span class="head">Undetected</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count11"
                    >
                      {{ summaryData.totalUndetected || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count12"
                  >
                    of
                    {{ 0 }}
                    analysed emails
                  </div>
                </div>
                <div class="bg-image">
                  <img src="../assets/img/ic-warning.svg" />
                </div>
              </div>
            </template>
          </CardLoading>
        </div>
        <div class="mt-4 pa-2">
          <SandboxLog />
        </div>
        <div class="mt-4 pa-2">
          <SandboxStats />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/functions'
import CardLoading from '../components/SkeletonLoading/CardLoading'
import labels from '@/model/constants/labels'
import { getSandboxSummaryData } from '@/api/sandbox'
import SandboxLog from '@/components/Sandbox/SandboxLog'
import SandboxStats from '@/components/Sandbox/SandboxStats'

export default {
  name: 'Sandbox',
  components: {
    CardLoading,
    SandboxLog,
    SandboxStats
  },
  data() {
    return {
      incidentLoading: true,
      labels,
      summaryOptions: {
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  Value: '',
                  FieldName: 'AnalysisEngineTypeId',
                  Operator: 'Include'
                },
                {
                  Value: '',
                  FieldName: 'ClientResourceId',
                  Operator: 'Include'
                },
                {
                  FieldName: 'CreateTime',
                  Operator: 'Contains',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      summaryData: {}
    }
  },
  created() {
    this.getSummaryData()
  },
  methods: {
    getSummaryData() {
      this.incidentLoading = true
      getSandboxSummaryData(this.summaryOptions)
        .then((response) => {
          this.summaryData = response.data.data[0]
        })
        .finally(() => {
          this.incidentLoading = false
        })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    }
  }
}
</script>

<style lang="scss">
.sandbox {
  .incident-analysis {
    background: #f56c6c;
  }
  .roi-summary {
    background: #1173c1;
  }
  .dashboard-cards-loading {
    height: 150px;
  }
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
        min-height: 150px;
        max-height: 150px;
        border-radius: 8px;
        margin: 8px;
        padding: 16px;
        position: relative;
        overflow: hidden;

        &__skeleton-loading {
          width: 25%;
          min-height: 150px;
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
        background-color: #b83a3a;
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
          margin-top: 0 !important;
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
}
</style>
