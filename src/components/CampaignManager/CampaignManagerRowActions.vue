<template>
  <div>
    <v-tooltip bottom>
      <template #activator="{ on }">
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
    <v-menu bottom left offset-y transition="scale-transition">
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="`btn-dots--row-actions-list-${Math.random().toString().substring(2)}`"
          class="btn-hover ml-1"
          icon
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="v-cart-dropdown-list el-table__action-buttons">
        <v-list-item
          v-for="(act, ind) of getItems"
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
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

export default {
  name: 'CampaignManagerRowActions',
  props: {
    scope: {
      type: Object
    },
    rowActions: {
      type: Array
    }
  },
  computed: {
    getId() {
      return `btn-${this.actionStatus}-row-action-${Math.random().toString().substring(2)}`
    },
    actionStatus() {
      return this.scope.row.status
    },
    getIconName() {
      switch (this.actionStatus) {
        case ACTION_STATUSES.COMPLETE:
        case ACTION_STATUSES.IDLE:
        case ACTION_STATUSES.CANCEL:
          return 'mdi-send'
        case ACTION_STATUSES.RUNNING:
        case ACTION_STATUSES.PAUSE:
        case ACTION_STATUSES.RESUME:
          return 'mdi-pause'
        default:
          return 'mdi-send'
      }
    },
    getTooltipText() {
      switch (this.actionStatus) {
        case ACTION_STATUSES.COMPLETE:
        case ACTION_STATUSES.IDLE:
        case ACTION_STATUSES.CANCEL:
          return labels.Launch
        case ACTION_STATUSES.PAUSE:
          return labels.Resume
        case ACTION_STATUSES.RUNNING:
        case ACTION_STATUSES.RESUME:
          return labels.Pause
        default:
          return labels.Launch
      }
    },
    getStyle() {
      const style = {}
      if (this.actionStatus === ACTION_STATUSES.PAUSE) {
        style.backgroundColor = '#E6A23C'
        style.opacity = 0.66
      }
      return style
    },
    getItems() {
      const copyOfRowActions = JSON.parse(JSON.stringify(this.rowActions))
      if (
        [ACTION_STATUSES.PAUSE, ACTION_STATUSES.RESUME, ACTION_STATUSES.RUNNING].includes(
          this.actionStatus
        )
      ) {
        copyOfRowActions.unshift({
          name: labels.Stop,
          id: 'btn-stop--row-actions-campaign-manager',
          icon: 'mdi-stop',
          action: 'on-stop'
        })
      }
      return copyOfRowActions
    }
  },
  methods: {
    handleItemClick(act = {}) {
      let eventName = ''
      switch (act.action) {
        case ACTION_STATUSES.RUNNING:
          eventName = 'on-pause'
          break
        case ACTION_STATUSES.PAUSE:
          eventName = 'on-run'
          break
        case ACTION_STATUSES.COMPLETE:
        case ACTION_STATUSES.IDLE:
        case ACTION_STATUSES.CANCEL:
          eventName = 'on-launch'
          break
        default:
          eventName = act.action
      }
      this.$emit(eventName, this.scope.row)
    }
  }
}
</script>
