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
                        :class="
                          scanData.status ? scanData.status.toLowerCase().replace(/\s/g, '') : ''
                        "
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
                  <img
                    src="../../assets/img/web-icon.svg"
                    class="mr-4"
                    alt="attack types description"
                  />
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
                  <img src="../../assets/img/web-icon.svg" class="mr-4" alt="email status" />
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
