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
        :scope="scope"
        :disabled="rowActions[1].disabled"
        :icon="rowActions[1].icon"
        :text="rowActions[1].name"
        @on-click="handleAction(scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[2].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="handleAction(scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :disabled="rowActions[4].disabled"
        :icon="rowActions[4].icon"
        :text="rowActions[4].name"
        @on-click="handleAction(scope.row)"
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
    getFirstActionParams() {
      const status = scope.row.status
      const obj = {
        icon: '',
        text: ''
      }
      if (
        [
          ENROLLMENT_STATUSES.AUTO_ENROLL,
          ENROLLMENT_STATUSES.FINISHED,
          ENROLLMENT_STATUSES.ERROR
        ].includes(status)
      ) {
        obj.icon = 'mdi-text-box'
        obj.text = 'View Report'
      } else if (ENROLLMENT_STATUSES.SENDING) {
        obj.icon = 'mdi-pause'
        obj.text = 'Pause'
      } else if (ENROLLMENT_STATUSES.SCHEDULED) {
        obj.icon = 'mdi-send'
        obj.text = 'Send'
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
        //TODO route to training report
        this.$router.push({
          name: 'trainingName',
          params: {
            id: row.id
          }
        })
      } else if (ENROLLMENT_STATUSES.SENDING) {
        this.$emit('on-stop', row)
      } else if (ENROLLMENT_STATUSES.SCHEDULED) {
        this.$emit('on-send', row)
      }
    }
  }
}
</script>
