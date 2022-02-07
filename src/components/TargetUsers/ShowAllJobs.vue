<template>
  <div>
    <v-expansion-panels class="my-10" popout v-model="panelIndex">
      <v-expansion-panel
        v-for="(item, index) in jobs"
        :key="index"
        :disabled="panelIndex && panelIndex !== index"
      >
        <v-expansion-panel-header>
          <span class="w-5" style="width: 100px;">{{ item.jobId }}</span>
          <span class="w-25">{{ item.name }}</span>
          <span class="w-25 text-center">{{ item.createTime }}</span>
          <span class="w-25 text-right">{{ item.progress }} %</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-progress-linear
              class="mt-3"
              rounded
              :color="item.isFinished ? 'success lighten-1' : 'primary'"
              :value="item.progress"
              height="25"
            >
              <strong>{{ item.progress }}%</strong>
            </v-progress-linear>
          </v-list-item>
          <template v-for="(process, index) in item.process">
            <v-list-item three-line :key="index">
              <v-list-item-content>
                <v-alert
                  dense
                  outlined
                  :type="
                    (process.targetCount === process.currentCount && process.isFinished) ||
                    (process.targetCount === 0 && process.currentCount === 0)
                      ? 'success'
                      : 'info'
                  "
                >
                  <v-list-item-title class="d-flex">
                    <span>{{ process.name }}</span>
                    <template v-if="process.targetCount !== 0">
                      <span class="ml-auto" v-if="process.isFinished"
                        >Finished at {{ process.endTime }}</span
                      >
                      <span class="ml-auto" v-else
                        >{{ process.estimatedTime.toFixed(0) }} seconds left</span
                      >
                    </template>
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >{{ process.currentCount }} /
                    {{ process.targetCount }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-progress-linear
                      v-if="!process.isFinished && process.targetCount !== 0"
                      :color="
                        process.existError
                          ? 'red'
                          : process.isFinished
                          ? 'success lighten-1'
                          : 'primary'
                      "
                      :value="process.progress"
                      height="25"
                      rounded
                    >
                      <strong>{{ process.progress }}%</strong>
                    </v-progress-linear>
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
            data: { progress, processResults, isFinished }
          }
        } = response
        const job = this.jobs.find((job) => job.resourceId === resourceId)
        job.process = processResults
        job.progress = progress
        job.isFinished = isFinished
        this.jobs = [...this.jobs]
      })
    },
    getProcess(resourceId) {
      if (resourceId) {
        clearInterval(this.jobInterval)
        this.handleJobDetail(resourceId)
        this.processInterval = setInterval(() => {
          this.handleJobDetail(resourceId)
        }, 2500)
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
  },
  destroyed() {
    clearInterval(this.jobInterval)
    clearInterval(this.processInterval)
  }
}
</script>

<style scoped lang="scss">
.w-25 {
  width: 25%;
}
.w-5 {
  width: 5%;
}
</style>
