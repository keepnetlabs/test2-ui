<template>
  <div>
    <DefaultButtonRowAction
      v-bind="getFirstActionParams"
      :scope="scope"
      :disabled="rowActions[0].disabled"
      :checkIsOwnerProperty="false"
      @on-click="handleAction(scope.row)"
    />
    <RowActionsMenu>
      <DefaultMenuRowAction
        v-if="isRenderEditButton"
        :scope="scope"
        :disabled="rowActions[1].disabled"
        :icon="rowActions[1].icon"
        :text="rowActions[1].name"
        @on-click="$emit('on-edit', scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[2].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="$emit('on-preview', scope.row)"
      />
      <DefaultMenuRowAction
        v-if="!isShowReport"
        :scope="scope"
        :disabled="false"
        icon="mdi-text-box"
        text="View Report"
        @on-click="routeToTrainingReport(scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :disabled="rowActions[3].disabled"
        :icon="rowActions[3].icon"
        :text="rowActions[3].name"
        @on-click="$emit('on-delete', scope.row)"
      />
    </RowActionsMenu>
  </div>
</template>

<script>
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import { ENROLLMENT_STATUSES } from '@/components/AwarenessEducator/utils'
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
    isRenderEditButton() {
      return [ENROLLMENT_STATUSES.AUTO_ENROLL, ENROLLMENT_STATUSES.SCHEDULED].includes(
        this.scope.row.status
      )
    },
    isShowReport() {
      return [
        ENROLLMENT_STATUSES.AUTO_ENROLL,
        ENROLLMENT_STATUSES.FINISHED,
        ENROLLMENT_STATUSES.ERROR
      ].includes(this.scope.row.status)
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
      } else if (ENROLLMENT_STATUSES.SENDING) {
        obj.icon = 'mdi-stop'
        obj.text = 'Stop'
      } else if (ENROLLMENT_STATUSES.SCHEDULED) {
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
          ENROLLMENT_STATUSES.ERROR
        ].includes(status)
      ) {
        this.routeToTrainingReport(row)
      } else if (ENROLLMENT_STATUSES.SENDING) {
        this.$emit('on-stop', row)
      } else if (ENROLLMENT_STATUSES.SCHEDULED) {
        this.$emit('on-send', row)
      }
    },
    routeToTrainingReport(row) {
      this.$router.push({
        name: 'Training Report',
        params: {
          id: row.enrollmentId
        }
      })
    }
  }
}
</script>
