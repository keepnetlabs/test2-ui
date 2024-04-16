<template>
  <div>
    <DefaultButtonRowAction
      v-bind="getFirstActionParams"
      :id="rowActions[0].id"
      :scope="scope"
      :disabled="rowActions[0].disabled"
      :checkIsOwnerProperty="false"
      @on-click="handleAction(scope.row)"
    />
    <RowActionsMenu>
      <DefaultMenuRowAction
        v-if="isRenderStopReminderButton"
        id="btn-stop--row-actions-stop-reminder"
        icon="mdi-stop"
        text="Stop Reminder"
        :scope="scope"
        @on-click="$emit('on-stop-reminder', scope.row)"
      />
      <DefaultMenuRowAction
        v-if="isRenderStopAutoEnrollButton"
        id="btn-stop--row-actions-stop-auto-enroll"
        icon="mdi-stop"
        text="Stop Auto-enroll"
        :scope="scope"
        @on-click="$emit('on-stop-auto-enroll', scope.row)"
      />
      <DefaultMenuRowAction
        v-if="!isShowReport"
        id="btn-view-report--row-actions-enrollments-list"
        :scope="scope"
        :disabled="false"
        icon="mdi-text-box"
        text="View Report"
        @on-click="routeToTrainingReport(scope.row)"
      />
      <DefaultMenuRowAction
        v-if="isShowEdit"
        :id="rowActions[1].id"
        :scope="scope"
        :disabled="rowActions[1].disabled"
        :icon="rowActions[1].icon"
        :text="rowActions[1].name"
        @on-click="$emit('on-edit', scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[2].id"
        :scope="scope"
        :disabled="rowActions[2].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="$emit('on-preview', scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[3].id"
        :scope="scope"
        :disabled="rowActions[3].disabled"
        :icon="rowActions[3].icon"
        :text="rowActions[3].name"
        @on-click="$emit('on-delete', scope.row)"
      />
      <DefaultMenuRowAction
        v-if="false"
        id="btn-stop--row-actions-enrollments-list"
        icon="mdi-stop"
        text="Stop"
        :scope="scope"
        @on-click="$emit('on-stop', scope.row)"
      />
      <DefaultMenuRowAction
        v-if="isScormProxy"
        :id="rowActions[4].id"
        :scope="scope"
        :disabled="rowActions[4].disabled"
        :icon="rowActions[4].icon"
        :text="rowActions[4].name"
        @on-click="$emit('on-download', scope.row)"
      />
    </RowActionsMenu>
  </div>
</template>

<script>
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import { ENROLLMENT_STATUSES } from '@/components/AwarenessEducator/utils'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'EnrollmentsTableRowActions',
  components: {
    DefaultMenuRowAction,
    DefaultButtonRowAction,
    RowActionsMenu
  },
  props: {
    rowActions: {
      type: Array
    },
    scope: {
      type: Object
    }
  },
  computed: {
    isRenderStopAutoEnrollButton() {
      return [ENROLLMENT_STATUSES.AUTO_ENROLL].includes(this.scope.row.status)
    },
    isRenderStopReminderButton() {
      if (
        [
          TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER,
          TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
        ].includes(this.scope.row.type)
      )
        return false
      if (
        [ENROLLMENT_STATUSES.FINISHED, ENROLLMENT_STATUSES.STOPPED].includes(this.scope.row.status)
      )
        return false
      return this.scope?.row?.isReminderActive
    },
    isScheduled() {
      return this.scope.row.status === ENROLLMENT_STATUSES.SCHEDULED
    },
    isScormProxy() {
      return this.scope.row.status === ENROLLMENT_STATUSES.SCORM_PROXY
    },
    isShowReport() {
      return [
        ENROLLMENT_STATUSES.AUTO_ENROLL,
        ENROLLMENT_STATUSES.FINISHED,
        ENROLLMENT_STATUSES.ERROR,
        ENROLLMENT_STATUSES.STOPPED,
        ENROLLMENT_STATUSES.SCORM_PROXY,
        ENROLLMENT_STATUSES.SENDING
      ].includes(this.scope.row.status)
    },
    isShowEdit() {
      return true
    },
    getFirstActionParams() {
      const status = this.scope.row.status
      const obj = {
        icon: '',
        text: ''
      }
      if (this.isShowReport) {
        obj.icon = 'mdi-text-box'
        obj.text = 'View Report'
      } else if (status === ENROLLMENT_STATUSES.SCHEDULED) {
        obj.icon = 'mdi-send'
        obj.text = 'Send Now'
      }

      return obj
    }
  },
  methods: {
    handleAction(row) {
      const { status } = row
      if (
        [
          ENROLLMENT_STATUSES.AUTO_ENROLL,
          ENROLLMENT_STATUSES.FINISHED,
          ENROLLMENT_STATUSES.ERROR,
          ENROLLMENT_STATUSES.STOPPED,
          ENROLLMENT_STATUSES.SCORM_PROXY,
          ENROLLMENT_STATUSES.SENDING
        ].includes(status)
      ) {
        this.routeToTrainingReport(row)
      } else if (status === ENROLLMENT_STATUSES.SCHEDULED) {
        this.$emit('on-send', row)
      }
    },
    routeToTrainingReport(row) {
      this.$emit('on-route-to-report', row)
    }
  }
}
</script>
