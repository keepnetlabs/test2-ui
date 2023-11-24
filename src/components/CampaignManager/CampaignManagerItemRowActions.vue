<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :id="getId"
          class="btn-hover"
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
          :disabled="!getCampaignReportsDeletePermissions"
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
import { mapGetters } from 'vuex'
import { createRandomCryptStringNumber } from '@/utils/functions'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'CampaignManagerItemRowActions',
  props: {
    rowActions: {
      type: Array
    },
    scope: {
      type: Object
    },
    campaignResourceId: {
      type: String
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    ...mapGetters({
      getCampaignReportsDeletePermissions: 'permissions/getCampaignReportsDeletePermissions'
    }),
    isMenuRender() {
      return ![
        ACTION_STATUSES.COMPLETE,
        ACTION_STATUSES.IDLE,
        ACTION_STATUSES.DELETE,
        ACTION_STATUSES.CANCEL
      ].includes(this.actionStatus)
    },
    getId() {
      const iconName = this.getIconName
      let idStart = ''
      if (iconName === 'mdi-text-box') idStart = 'view-report'
      else if (iconName === 'mdi-close') idStart = 'stop'
      else idStart = 'send'
      return `btn-${idStart}--row-action-${createRandomCryptStringNumber()}`
    },
    actionStatus() {
      return this.scope.row.status
    },
    getRowActions() {
      const rowActions = this.rowActions
      if (
        this.actionStatus === ACTION_STATUSES.RUNNING ||
        this.actionStatus === ACTION_STATUSES.ERROR
      ) {
        const copyOfRowActions = JSON.parse(JSON.stringify(rowActions))
        copyOfRowActions.splice(0, 1)
        copyOfRowActions.splice(0, 0, {
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
      if ([ACTION_STATUSES.COMPLETE, ACTION_STATUSES.CANCEL].includes(this.actionStatus)) {
        return 'mdi-text-box'
      }

      if (this.actionStatus === ACTION_STATUSES.RUNNING) {
        return 'mdi-close'
      }

      if (this.actionStatus === ACTION_STATUSES.IDLE) {
        return 'mdi-send'
      }

      return 'mdi-eye'
    },
    getTooltipText() {
      if ([ACTION_STATUSES.COMPLETE, ACTION_STATUSES.CANCEL].includes(this.actionStatus)) {
        return labels.ViewReport
      }

      if (this.actionStatus === ACTION_STATUSES.IDLE) {
        return labels.Launch
      }

      if (this.actionStatus === ACTION_STATUSES.DELETE) {
        return labels.Delete
      }

      if (this.actionStatus === ACTION_STATUSES.RUNNING) {
        return 'Cancel'
      }

      return labels.Preview
    }
  },
  methods: {
    handleItemClick(act) {
      if (
        (!this.isMenuRender && this.actionStatus !== ACTION_STATUSES.IDLE) ||
        act.action === 'on-view-report'
      ) {
        return this.$router.push({
          name: this.type === SCENARIO_TYPES.PHISHING ? 'Campaign Report' : 'Quishing Report',
          params: { id: this.campaignResourceId, instanceGroup: this.scope.row.instanceGroup }
        })
      }
      let eventName = act.action

      if (act.action === ACTION_STATUSES.IDLE) {
        eventName = 'on-launch'
      } else if (act.action === ACTION_STATUSES.RUNNING) {
        eventName = 'on-stop'
      }

      this.$emit(eventName, this.scope.row)
    }
  }
}
</script>
