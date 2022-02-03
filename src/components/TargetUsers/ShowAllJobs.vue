<template>
  <div>
    <v-expansion-panels style="margin-top: 50px; margin-bottom: 50px;" popout v-model="panelIndex">
      <v-expansion-panel
        v-for="(item, index) in jobs"
        :key="index"
        :disabled="panelIndex && panelIndex !== index"
      >
        <v-expansion-panel-header>
          <span>{{ item.name }}</span>
          <span class="ml-auto text-right">{{ item.progress }} %</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <template v-for="(process, index) in item.process">
            <v-list-item two-line :key="index">
              <v-list-item-content>
                <v-alert
                  dense
                  outlined
                  :type="process.targetCount === process.currentCount ? 'success' : 'info'"
                >
                  <v-list-item-title>{{ process.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ process.currentCount }} /
                    {{ process.targetCount }}
                  </v-list-item-subtitle>
                </v-alert>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import { getAllJobs, getJobDetail } from '@/api/targetUsers'

export default {
  name: 'ShowAllJobsInline',
  props: {
    status: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      labels,
      jobs: [],
      panelIndex: null,
      jobInterval: null,
      processInterval: null
    }
  },
  watch: {
    panelIndex: function () {
      if (this.panelIndex >= 0) {
        clearInterval(this.processInterval)
      }
      this.getProcess(this.jobs[this.panelIndex]?.resourceId)
    }
  },
  methods: {
    handleAllJobs() {
      this.handleJobs()
      this.jobInterval = setInterval(() => {
        this.handleJobs()
      }, 5000)
    },
    handleJobs() {
      getAllJobs().then((response) => {
        const {
          data: { data }
        } = response
        this.jobs = [...data]
      })
    },
    handleJobDetail(resourceId) {
      getJobDetail(resourceId).then((response) => {
        const {
          data: {
            data: { progress, processResults }
          }
        } = response
        const job = this.jobs.find((job) => job.resourceId === resourceId)
        job.process = processResults
        job.progress = progress
        this.jobs = [...this.jobs]
      })
    },
    getProcess(resourceId) {
      if (resourceId) {
        clearInterval(this.jobInterval)
        this.handleJobDetail(resourceId)
        this.processInterval = setInterval(() => {
          this.handleJobDetail(resourceId)
        }, 5000)
      } else {
        clearInterval(this.processInterval)
        this.handleAllJobs()
      }
    },
    closeOverlay() {
      this.$emit('closeShowAllJobs')
    }
  },
  created() {
    this.handleAllJobs()
  }
}
</script>

<style scoped lang="scss">
.import-users-file {
  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
    }
  }

  &__container {
    padding: 32px 96px 0 96px;
    box-shadow: none;

    .v-list-item {
      padding: 0;

      &__content {
        padding: 0;
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 10;

    @media (max-width: 768px) {
      padding-left: 0 !important;
      padding-right: 0 !important;
      justify-content: space-around;
    }

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 86px;
      height: 36px !important;
    }

    &-btn-next {
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: #2196f3;
    }

    &-btn-back {
      width: 68px;
      height: 36px !important;
      border-radius: 18px;
      border: solid 1px #00bcd4;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      color: #00bcd4 !important;
      box-shadow: none !important;
    }
  }

  &__title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.3;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

.map-fields {
  &__list-item {
    .v-list-item__content {
      padding: 1px;
      overflow-x: auto;
    }

    &--1 {
      margin-top: 24px;
    }

    &--2 {
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    margin-top: -2px;
  }

  &__select {
    max-width: 205px;
  }
}
</style>
