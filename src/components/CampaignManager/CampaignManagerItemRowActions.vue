<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :id="getId"
          class="btn-hover"
          :style="getStyle"
          icon
          @click="handleItemClick({ action: actionStatus })"
        >
          <v-icon>{{ getIconName }}</v-icon>
        </v-btn>
      </template>
      <span>{{ getTooltipText }}</span>
    </v-tooltip>
    <v-menu v-if="isMenuRender" bottom left offset-y transition="scale-transition">
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="`btn-dots--row-actions-list-${Math.random().toString().substring(2)}`"
          class="btn-hover"
          icon
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="v-cart-dropdown-list el-table__action-buttons">
        <v-list-item
          v-for="(act, ind) of getRowActions"
          :key="ind"
          :id="`${act.id}-${scope.$index}-${ind}-${Math.random().toString().substring(2)}`"
          class="sub-menu-el datatable-row-action-list"
        >
          <v-list-item-title @click="handleItemClick(act)">
            <v-icon class="pr-3">{{ act.icon }}</v-icon>
            <span>{{ act.name }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip v-else bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="`btn--delete-row-action-${Math.random().toString().substring(2)}`"
          class="btn-hover"
          icon
          @click="$emit('on-delete', scope.row)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <span>{{ labels.Delete }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'

export default {
  name: 'CampaignManagerItemRowActions',
  props: {
    rowActions: {
      type: Array
    },
    scope: {
      type: Object
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    isMenuRender() {
      return ![
        ACTION_STATUSES.COMPLETE,
        ACTION_STATUSES.IDLE,
        ACTION_STATUSES.DELETE,
        ACTION_STATUSES.CANCEL
      ].includes(this.actionStatus)
    },
    getId() {
      return `btn-${this.actionStatus}-row-action-${Math.random().toString().substring(2)}`
    },
    actionStatus() {
      return this.scope.row.status
    },
    getRowActions() {
      const rowActions = this.rowActions
      if (this.actionStatus === ACTION_STATUSES.RUNNING) {
        const copyOfRowActions = JSON.parse(JSON.stringify(rowActions))
        copyOfRowActions.splice(1, 0, {
          name: labels.ViewReport,
          id: 'btn-view-report-row-actions-campaign-item-manager',
          icon: 'mdi-text-box',
          action: 'on-view-report'
        })
        return copyOfRowActions
      }
      return rowActions
    },
    getIconName() {
      switch (this.actionStatus) {
        case ACTION_STATUSES.COMPLETE:
        case ACTION_STATUSES.IDLE:
        case ACTION_STATUSES.CANCEL:
          return 'mdi-text-box'
        case ACTION_STATUSES.PAUSE:
        case ACTION_STATUSES.RUNNING:
          return 'mdi-pause'
        default:
          return 'mdi-eye'
      }
    },
    getTooltipText() {
      switch (this.actionStatus) {
        case ACTION_STATUSES.COMPLETE:
        case ACTION_STATUSES.IDLE:
        case ACTION_STATUSES.CANCEL:
          return labels.ViewReport
        case ACTION_STATUSES.PAUSE:
          return labels.Resume
        case ACTION_STATUSES.RUNNING:
          return labels.Pause
        case ACTION_STATUSES.DELETE:
          return labels.Delete
        default:
          return labels.Preview
      }
    },
    getStyle() {
      const style = {}
      if (this.actionStatus === ACTION_STATUSES.PAUSE) {
        style.backgroundColor = '#E6A23C'
        style.opacity = 0.66
      }
      return style
    }
  },
  methods: {
    handleItemClick(act) {
      if (!this.isMenuRender || act.action === 'on-view-report') {
        return this.$router.push({
          name: 'Campaign Report',
          params: { id: this.scope.row.resourceId }
        })
      }
      let eventName = act.action
      switch (act.action) {
        case ACTION_STATUSES.RUNNING:
          eventName = 'on-pause'
          break
        case ACTION_STATUSES.PAUSE:
          eventName = 'on-resume'
          break
        default:
          eventName = act.action
      }
      this.$emit(eventName, this.scope.row)
    }
  }
}
</script>
