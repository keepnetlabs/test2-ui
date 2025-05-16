<template>
  <div>
    <datatable-loading v-if="jobLoading" :loading="jobLoading"></datatable-loading>
    <v-expansion-panels popout v-model="panelIndex" v-else>
      <v-expansion-panel
        v-for="(job, index) in jobs"
        :key="index"
        :disabled="panelDisabled(job, index)"
        :job="job"
        :panelIndex="panelIndex"
      >
        <v-expansion-panel-header>
          <span class="w-5" style="width: 100px;">{{ job.jobId }}</span>
          <span class="w-25">{{ job.name }}</span>
          <span class="w-25 text-center">{{ job.createTime }}</span>
          <span class="w-25 text-right"
            >{{ job.status === 0 ? 'Waiting' : job.progress + '%' }}
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <datatable-loading v-if="processLoading" :loading="processLoading"></datatable-loading>
          <div v-else>
            <v-list-item>
              <v-progress-linear
                class="mt-3"
                rounded
                :color="job.isFinished ? 'success lighten-1' : 'primary'"
                :value="job.progress"
                height="25"
              >
                <strong>{{ job.progress }}%</strong>
              </v-progress-linear>
            </v-list-item>
            <template v-for="(process, index) in job.processResults">
              <v-list-item three-line :key="index">
                <v-list-item-content>
                  <v-alert dense outlined :type="processType(process)">
                    <v-list-item-title class="d-flex">
                      <v-tooltip :disabled="!process.isFinished || !process.existsError" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ process.name }}</span>
                        </template>
                        <span>Process has finished with some errors!</span>
                      </v-tooltip>
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
                        :color="getProcessColor(process)"
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
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { getAllJobs, getJobDetail } from '@/api/targetUsers'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'

export default {
  name: 'ShowAllJobsInline',
  components: { DatatableLoading },
  data() {
    return {
      jobs: [],
      panelIndex: null,
      jobTimeout: null,
      processTimeout: null,
      jobLoading: false,
      processLoading: false,
      isDestroyed: false
    }
  },
  watch: {
    panelIndex: function () {
      if (this.panelIndex >= 0) {
        clearTimeout(this.jobTimeout)
        this.processLoading = true
        this.handleProcess(this.jobs[this.panelIndex]?.resourceId)
      } else {
        this.handleJobs()
        clearTimeout(this.processTimeout)
      }
    }
  },
  methods: {
    panelDisabled(job, index) {
      return job.status === 0 || (!!this.panelIndex?.toString() && this.panelIndex !== index)
    },
    handleJobs() {
      getAllJobs().then((response) => {
        const {
          data: { data }
        } = response
        this.jobs = [...data]
        this.jobLoading = false
        if (!this.isDestroyed) {
          this.jobTimeout = setTimeout(() => {
            this.handleJobs()
          }, 2500)
        }
      })
    },
    handleProcess(resourceId) {
      getJobDetail(resourceId)
        .then((response) => {
          const {
            data: {
              data: { progress, processResults, isFinished }
            }
          } = response
          const job = this.jobs.find((job) => job.resourceId === resourceId)
          job.processResults = processResults
          job.progress = progress
          job.isFinished = isFinished
          this.jobs = [...this.jobs]
          this.processLoading = false
          if (!this.isDestroyed) {
            this.processTimeout = setTimeout(() => {
              this.handleProcess(resourceId)
            }, 2500)
          }
        })
        .catch((error) => {
          if (!this.isDestroyed) {
            this.processTimeout = setTimeout(() => {
              this.handleProcess(resourceId)
            }, 2500)
          }
        })
    },
    processType(process) {
      if (process.existsError && process?.isFinished) {
        return 'warning'
      } else {
        return (process.targetCount === process.currentCount && process.isFinished) ||
          (process.targetCount === 0 && process.currentCount === 0)
          ? 'success'
          : 'info'
      }
    },
    getProcessColor(process) {
      if (process.existError) {
        return 'red'
      } else if (process.isFinished) {
        return 'success lighten-1'
      }
      return 'primary'
    }
  },
  created() {
    this.jobLoading = true
    this.handleJobs()
  },
  destroyed() {
    this.isDestroyed = true
    clearTimeout(this.jobTimeout)
    clearTimeout(this.processTimeout)
  }
}
</script>
