<template>
  <div class="ets-report-page" id="ets-report-page">
    <div class="report-title">
      <p>Scan Summary</p>
      Summary of the selected scan
    </div>
    <!--widgets start-->
    <v-container class="mt-4">
      <v-row>
        <v-col v-for="(item, index) in scoreData" :key="index" cols="12" sm="6" lg="3">
          <v-card>
            <card-loading :loading="scoresLoading">
              <template v-slot:skeleton-content>
                <div class="report-scores pa-4 pr-2" :class="item.color">
                  <div class="score-title">{{ item.title }}</div>
                  <div class="score-body mt-4 mb-7">
                    <span>{{ item.count }}</span> email
                  </div>
                  <div v-if="item.percent !== null" class="score-footer">
                    {{ item.percent }}% of attack vectors
                  </div>
                  <div class="score-icon" :class="item.icon"></div>
                </div>
              </template>
            </card-loading>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!--scan info and score chart start-->
    <v-container class="mb-6">
      <v-row>
        <v-col cols="12" lg="6" sm="12">
          <card-loading :loading="scoresLoading">
            <template v-slot:skeleton-content>
              <v-card class="info-details overflow-hidden">
                <div class="detail-header pa-5">
                  <v-icon class="mr-4" color="#2196F3" size="20">mdi-information</v-icon> Scan Info
                </div>
                <div class="detail-body px-6 py-2">
                  <div class="d-flex justify-space-between py-4">
                    <div class="info-title">Status</div>
                    <div class="info-text">
                      <button
                        v-if="!scoresLoading"
                        type="button"
                        :class="scanData.status ? scanData.status.toLowerCase() : ''"
                      >
                        {{ scanData.status }}
                      </button>
                    </div>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between py-4">
                    <div class="info-title">Start Date</div>
                    <div class="info-text">{{ scanData.createTime }}</div>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between py-4">
                    <div class="info-title">Email</div>
                    <div class="info-text">{{ scanData.email }}</div>
                  </div>
                </div>
              </v-card>
            </template>
          </card-loading>
        </v-col>
        <v-col cols="12" lg="6" sm="12">
          <card-loading :loading="scoresLoading">
            <template v-slot:skeleton-content>
              <v-card class="info-details overflow-hidden">
                <div class="detail-header pa-5">
                  <v-icon class="mr-4" color="#2196F3" size="20">mdi-chart-timeline-variant</v-icon>
                  Your Score
                </div>
                <div class="detail-body pa-2">
                  <div class="report-chart">
                    <v-progress-circular
                      :rotate="-90"
                      :size="164"
                      :width="25"
                      :value="score"
                      color="#43A047"
                    >
                      <span>{{ score }}%<br />secure</span>
                    </v-progress-circular>
                  </div>
                </div>
              </v-card>
            </template>
          </card-loading>
        </v-col>
      </v-row>
    </v-container>
    <!--stats start -->
    <div class="type-and-status-container">
      <div class="title my-6">Stats</div>
      <card-loading :loading="scoresLoading">
        <template v-slot:skeleton-content>
          <div class="menu-bar mb-6">
            <div class="d-flex flex-row mb-6">
              <div
                @click="isAttackType = true"
                class="menu-item mx-2 pt-3"
                :class="isAttackType ? 'active' : ''"
              >
                By Attack Types
              </div>
              <div
                @click="isAttackType = false"
                class="menu-item mx-2 pt-3"
                :class="!isAttackType ? 'active' : ''"
              >
                By Email Status
              </div>
            </div>
            <div class="divider"></div>
          </div>
        </template>
      </card-loading>
      <!--by attack types start-->
      <div v-if="isAttackType">
        <card-loading :loading="scoresLoading">
          <template v-slot:skeleton-content>
            <v-card class="info-details overflow-hidden">
              <div class="detail-header pa-5 justify-center">
                <div class="d-flex flex-row">
                  <img src="../../assets/img/web-icon.svg" class="mr-4" />
                  <span>By Attack Types</span>
                </div>
              </div>
              <div class="detail-body">
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12" lg="4" sm="6">
                      <v-card class="stats-item">
                        <div
                          v-if="!scoresLoading"
                          class="types-menu"
                          :class="statsData.quickScanByAttackTypes.length < 5 ? 'no-overflow' : ''"
                        >
                          <div
                            v-for="(item, index) in statsData.quickScanByAttackTypes"
                            :key="index"
                            class="d-flex justify-space-between types-menu-contents"
                            :class="selectedAttackType === item ? 'selected' : ''"
                            @click="selectedAttackType = item"
                          >
                            <div class="types-menu-contents-item pl-6 py-4">
                              {{ item.categoryName }}
                            </div>
                            <div class="types-menu-contents-item pr-6 py-4">
                              <button type="button">{{ item.percent }}%</button>
                            </div>
                          </div>
                        </div>
                      </v-card>
                      <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" lg="8" sm="6">
                      <v-card class="stats-item desc-detail pa-6">
                        <div class="desc-detail-title mb-2">
                          <span>{{ selectedAttackType.categoryName }}</span>
                          <button type="button" class="ml-6">
                            {{ selectedAttackType.count }} Emails
                          </button>
                        </div>
                        <p class="mb-3 mt-0">
                          {{ selectedAttackType.description }}
                        </p>
                        <ul>
                          <li
                            v-for="(item, index) in selectedAttackType.quickScanResultStats"
                            :key="index"
                            :class="item.resultName.toLowerCase()"
                          >
                            <span></span> {{ item.count }} {{ item.resultName }}
                          </li>
                        </ul>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-card>
          </template>
        </card-loading>
      </div>
      <!-- by email status start -->
      <div v-else>
        <card-loading :loading="scoresLoading">
          <template v-slot:skeleton-content>
            <v-card class="info-details overflow-hidden">
              <div class="detail-header pa-5 justify-center">
                <div class="d-flex flex-row">
                  <img src="../../assets/img/web-icon.svg" class="mr-4" />
                  <span>By Email Status</span>
                </div>
              </div>
              <div class="detail-body">
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12" lg="4" sm="6">
                      <v-card class="stats-item">
                        <div v-if="!scoresLoading" class="types-menu no-overflow">
                          <div
                            v-for="(item, index) in statsData.quickScanByEmailStatus"
                            :key="index"
                            class="d-flex justify-space-between types-menu-contents by-mail"
                            :class="selectedEmailStatus === item ? 'selected' : ''"
                            @click="selectedEmailStatus = item"
                          >
                            <div class="types-menu-contents-item pl-6 py-4">
                              <span class="squared" :class="item.resultName.toLowerCase()"></span>
                              {{ item.resultName }} Emails
                            </div>
                            <div class="types-menu-contents-item pr-6 py-4">
                              <button :class="item.resultName.toLowerCase()" type="button">
                                {{ item.percent }}%
                              </button>
                            </div>
                          </div>
                        </div>
                      </v-card>
                      <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" lg="8" sm="6">
                      <v-card class="stats-item desc-detail">
                        <div class="types-menu right-content pa-6">
                          <ul>
                            <li
                              v-for="(item, index) in selectedEmailStatus.quickScanCategory"
                              :key="index"
                              class="normal"
                            >
                              {{ item.count }} {{ item.categoryName }}
                            </li>
                          </ul>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-card>
          </template>
        </card-loading>
      </div>
    </div>
  </div>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import {
  getQuickScanById,
  getQuickScanReportCountById,
  getQuickScanReportStatsById
} from '@/api/emailThreatSimlator'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'Summary',
  components: {
    CardLoading
  },
  data() {
    return {
      scoresLoading: true,
      scoreData: [],
      scanData: {},
      statsData: [],
      score: 0,
      selectedAttackType: {},
      selectedEmailStatus: {},
      isAttackType: true
    }
  },
  methods: {
    getReportData(resourceId) {
      getQuickScanById(resourceId)
        .then((scanData) => {
          const details = scanData.data.data
          this.scanData = details
          getQuickScanReportCountById(resourceId).then((scoreData) => {
            const data = scoreData.data.data
            this.scoreData = [
              {
                title: 'Total Attacks Sent',
                count: data.totalAttackSendCount,
                color: 'blue',
                icon: 'blue-icon',
                percent: null
              },
              {
                title: 'Secure Endpoints',
                count: data.secureEndpointsCount,
                color: 'green',
                icon: 'green-icon',
                percent: data.secureEndpointsPercent
              },
              {
                title: 'Insecure Endpoints',
                count: data.insecureEndpointsCount,
                color: 'red',
                icon: 'red-icon',
                percent: data.insecureEndpointsPercent
              },
              {
                title: 'Unchecked Emails',
                count: data.unckechedEndpointsCount,
                color: 'gray',
                icon: 'gray-icon',
                percent: data.unckechedEndpointsPercent
              }
            ]
            this.score = data.score
            getQuickScanReportStatsById(resourceId).then((statsData) => {
              this.scoresLoading = false
              this.statsData = statsData.data.data
              this.selectedAttackType = this.statsData.quickScanByAttackTypes[0]
              this.selectedEmailStatus = this.statsData.quickScanByEmailStatus[0]
            })
          })
        })
        .catch((error) => {
          const errorResponse = error.response.data
          let msg = errorResponse.message
          this.$store.dispatch('common/createSnackBar', {
            message: msg,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          this.$router.push({ path: '/email-threat-simulator' })
        })
    }
  },
  created() {
    const resourceId = this.$route.params.id
    this.getReportData(resourceId)
  }
}
</script>

<style lang="scss">
.ets-report-page {
  @media screen and (min-width: 1264px) {
    .container {
      max-width: 100% !important;
    }
  }
  @media screen and (max-width: 1388px) {
    .col-sm-6 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
  @media screen and (max-width: 887px) {
    .col-12 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
  .report-title {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    p {
      padding: 0;
      margin: 0;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
  }
  .report-scores {
    height: 170px;
    border-radius: 8px;
    color: white;
    position: relative;
    &.blue {
      background: #1173c1 !important;
    }
    &.green {
      background: #217124 !important;
    }
    &.red {
      background: #b83a3a !important;
    }
    &.gray {
      background: rgba(56, 59, 65, 0.72) !important;
    }
    .score-title {
      font-weight: 600;
      font-size: 20px;
      line-height: 23px;
    }
    .score-body {
      font-weight: 400;
      font-size: 20px;
      line-height: 25px;
      span {
        font-weight: 400;
        font-size: 48px;
        line-height: 48px;
      }
    }
    .score-footer {
      width: 85%;
      font-weight: 600;
      font-size: 16px;
      line-height: 23px;
    }
    .score-icon {
      position: absolute;
      bottom: 4px;
      right: -4px;
      width: 64px;
      height: 64px;
      &.blue-icon {
        background: url('../../assets/img/total-attack-sent-icon.svg') no-repeat center center;
      }
      &.green-icon {
        background: url('../../assets/img/secure-endpoint-icon.svg') no-repeat center center;
      }
      &.red-icon {
        background: url('../../assets/img/insecure-endpoints-icon.svg') no-repeat center center;
      }
      &.gray-icon {
        background: url('../../assets/img/unchecked-emails-icon.svg') no-repeat center center;
      }
    }
  }
  .info-details {
    background: #fafafa !important;
    border: 1px solid #e0e0e0;
    border-radius: 12px !important;
    .detail-header {
      background-color: white;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: #2196f3;
      border-bottom: 1px solid #e0e0e0;
    }
    .detail-body {
      font-size: 14px;
      line-height: 21px;
      color: #383b41;
      .info-title {
        font-weight: 600;
      }
      .info-text {
        font-weight: 400;
        button {
          border: 1px solid #1173c1;
          color: #1173c1;
          border-radius: 4px;
          padding: 4px 8px;
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          &.initial {
            border: 1px solid #1173c1;
            color: #1173c1;
          }
          &.inprogress {
            border: 1px solid #1173c1;
            color: #1173c1;
          }
          &.completed {
            border: 1px solid #217124;
            color: #217124;
          }
        }
      }
      .report-chart {
        width: 164px;
        height: 164px;
        margin: auto;
        text-align: center;
        span {
          font-weight: 600;
          font-size: 18px;
          line-height: 25px;
          color: #091e42;
        }
        background: url('../../assets/img/report-chart-background.svg') no-repeat center center;
        .v-progress-circular__underlay {
          stroke: transparent !important;
        }
      }
    }
  }
  .type-and-status-container {
    .title {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
    }
    .menu-bar {
      position: relative;
      background: #f5f7fa;
      .menu-item {
        position: relative;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        padding-bottom: 14px;
        box-sizing: border-box;
        cursor: pointer;
        z-index: 1;
        &.active {
          font-weight: 600;
          font-size: 14px;
          line-height: 18px;
          color: #2196f3;
          border-bottom: 2px solid #2196f3;
        }
      }
      .divider {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #e4e7ed;
      }
    }
    .info-details {
      background: white !important;
    }
    .stats-item {
      box-shadow: none !important;
      border-radius: 0 !important;
      .types-menu {
        height: 280px;
        overflow-y: scroll;
        scroll-padding: 50px 0 0 50px;
        &.no-overflow {
          overflow-y: hidden;
          border-right: 1px solid #e0e0e0;
        }
        &::-webkit-scrollbar {
          width: 14px;
          background-color: #fafafa;
          border-right: 2px solid #e0e0e0;
          border-left: 1px solid #e0e0e0;
        }

        &::-webkit-scrollbar-thumb {
          border: 4px solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
          border-radius: 9999px;
          background-color: #757575;
        }
        &.right-content {
          &::-webkit-scrollbar {
            width: 14px;
            background-color: transparent;
            border-right: 0;
            border-left: 0;
          }
        }
        .types-menu-contents {
          border-bottom: 1px solid #e0e0e0;
          cursor: pointer;
          .types-menu-contents-item {
            font-weight: 600;
            font-size: 14px;
            line-height: 21px;
            color: #383b41;
            button {
              background: #e0e0e0;
              border-radius: 4px;
              padding: 2px 4px;
              font-weight: 600;
              font-size: 12px;
              line-height: 16px;
              color: #383b41;
            }
            .squared {
              display: -webkit-inline-box;
              border-radius: 100%;
              width: 10px;
              height: 10px;
              background: #217124;
              margin-right: 2px;
              &.unchecked {
                background-color: #e6a23c;
              }
              &.insecure {
                background-color: #b83a3a;
              }
            }
          }
          &.selected {
            background: #fefdf2;
            .types-menu-contents-item {
              button {
                background: #383b41;
                color: #ffffff;
                &.unchecked {
                  background-color: #b6791d;
                  color: white;
                }
                &.insecure {
                  background-color: #b83a3a;
                  color: white;
                }
                &.secure {
                  background-color: #217124;
                  color: white;
                }
              }
            }
          }
        }
      }
      &.desc-detail {
        .desc-detail-title {
          font-weight: 600;
          font-size: 20px;
          line-height: 24px;
          color: #383b41;
          span {
            display: inline-table;
            vertical-align: middle;
          }
          button {
            padding: 4px 8px;
            font-size: 12px;
            line-height: 16px;
            background: #e0e0e0;
            border-radius: 4px;
          }
        }
        p {
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
        }
        ul {
          list-style: none;
          font-weight: 400;
          font-size: 12px;
          line-height: 19px;
          padding: 0;
          li {
            &::before {
              background-color: #217124;
              border-radius: 50%;
              content: '';
              display: inline-block;
              margin-right: 2px;
              margin-bottom: 3px;
              height: 10px;
              width: 10px;
              vertical-align: middle;
            }
            &.unchecked {
              &::before {
                background-color: #e6a23c;
              }
            }
            &.insecure {
              &::before {
                background-color: #b83a3a;
              }
            }
            &.normal {
              font-weight: 400;
              font-size: 14px;
              line-height: 21px;
              margin-bottom: 24px;
              :last-of-type {
                margin-bottom: 0;
              }
              &::before {
                background-color: black;
                height: 5px;
                width: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
