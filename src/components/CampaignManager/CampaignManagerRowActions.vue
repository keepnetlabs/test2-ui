<template>
  <div>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="getId"
          class="btn-hover"
          icon
          @click="handleItemClick({ action: 'on-preview' })"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
      <span>Preview</span>
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
            <img
              v-if="act.id === 'btn-new-instance-item-row-actions-campaign-manager'"
              class="pr-3"
              :src="act.icon"
              alt="icon"
            />
            <v-icon v-else class="pr-3">{{ act.icon }}</v-icon>
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
    },
    PERMISSIONS: {
      type: Object
    }
  },
  computed: {
    getId() {
      return `btn-${this.actionStatus}-row-action-${Math.random().toString().substring(2)}`
    },
    actionStatus() {
      return this.scope.row.status
    },
    getItems() {
      const copyOfRowActions = []
      const newInstanceItem = {
        name: labels.CreateNewInstance,
        isNotShow: true,
        id: 'btn-new-instance-item-row-actions-campaign-manager',
        icon: require('../../assets/img/icon_left.svg'),
        action: 'on-launch',
        disabled: !this.PERMISSIONS.UPDATE.hasPermission
      }
      const duplicateItem = {
        name: labels.Duplicate,
        id: 'btn-duplicate--row-actions-campaign-manager',
        icon: 'mdi-content-copy',
        action: 'on-duplicate',
        disabled: !this.PERMISSIONS.GET.hasPermission
      }
      const deleteItem = {
        name: labels.Delete,
        id: 'btn-delete--row-actions-campaign-manager',
        icon: 'mdi-delete',
        action: 'on-delete',
        disabled: !this.PERMISSIONS.DELETE.hasPermission
      }
      const editItem = {
        name: labels.Edit,
        isNotShow: true,
        id: 'btn-edit--row-actions-campaign-manager',
        icon: 'mdi-pencil',
        action: 'on-edit',
        disabled: !this.PERMISSIONS.UPDATE.hasPermission
      }
      switch (this.actionStatus) {
        case ACTION_STATUSES.IDLE:
          copyOfRowActions.push(editItem)
          copyOfRowActions.push(newInstanceItem)
          copyOfRowActions.push(duplicateItem)
          copyOfRowActions.push(deleteItem)
          break
        case ACTION_STATUSES.RUNNING:
          copyOfRowActions.push(editItem)
          copyOfRowActions.push(newInstanceItem)
          copyOfRowActions.push(duplicateItem)
          copyOfRowActions.push(deleteItem)
          break
        case ACTION_STATUSES.COMPLETE:
          copyOfRowActions.push(editItem)
          copyOfRowActions.push(newInstanceItem)
          copyOfRowActions.push(deleteItem)
          break
        case ACTION_STATUSES.CANCEL:
          copyOfRowActions.push(editItem)
          copyOfRowActions.push(newInstanceItem)
          copyOfRowActions.push(deleteItem)
          break
        default:
          copyOfRowActions.push(editItem)
          copyOfRowActions.push(deleteItem)
          break
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
