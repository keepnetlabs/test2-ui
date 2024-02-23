<template>
  <div>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="getId"
          :disabled="!getQuishingCampaignManagerParentPreviewPermissions"
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
          :disabled="act.disabled"
          class="sub-menu-el datatable-row-action-list"
        >
          <v-list-item-title @click="handleItemClick(act)">
            <img
              v-if="act.id === 'btn-new-instance-item-row-actions-campaign-manager'"
              class="pr-3"
              :src="act.icon"
              alt="icon"
            />
            <v-icon v-else class="pr-3" :disabled="act.disabled">{{ act.icon }}</v-icon>
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
import { mapGetters } from 'vuex'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'SmishingCampaignManagerRowActions',
  props: {
    scope: {
      type: Object
    },
    rowActions: {
      type: Array
    },
    isQuishingPrintPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getQuishingCampaignManagerParentPreviewPermissions:
        'permissions/getQuishingCampaignManagerParentPreviewPermissions',
      getQuishingCampaignManagerParentCreatePermissions:
        'permissions/getQuishingCampaignManagerParentCreatePermissions',
      getQuishingCampaignManagerParentDeletePermissions:
        'permissions/getQuishingCampaignManagerParentDeletePermissions',
      getQuishingCampaignManagerParentUpdatePermissions:
        'permissions/getQuishingCampaignManagerParentUpdatePermissions'
    }),
    getId() {
      return `btn-preview--row-action-${createRandomCryptStringNumber()}`
    },
    actionStatus() {
      return this.scope.row.status
    },
    getItems() {
      const copyOfRowActions = []
      const printPreviewItem = {
        name: labels.PrintPreview,
        icon: 'mdi-file-eye',
        action: 'on-print-preview',
        id: 'btn-preview--email-templates-row-actions'
      }
      const newInstanceItem = {
        name: labels.CreateNewInstance,
        isNotShow: true,
        id: 'btn-new-instance-item-row-actions-campaign-manager',
        icon: require('../../assets/img/icon_left.svg'),
        action: 'on-launch',
        disabled: !this.getQuishingCampaignManagerParentCreatePermissions
      }
      const duplicateItem = {
        name: labels.Duplicate,
        id: 'btn-duplicate--row-actions-campaign-manager',
        icon: 'mdi-content-copy',
        action: 'on-duplicate'
        // disabled: !this.getQuishingCampaignManagerParentCreatePermissions
      }
      const deleteItem = {
        name: labels.Delete,
        id: 'btn-delete--row-actions-campaign-manager',
        icon: 'mdi-delete',
        action: 'on-delete',
        disabled: !this.getQuishingCampaignManagerParentDeletePermissions
      }
      const editItem = {
        name: labels.Edit,
        isNotShow: true,
        id: 'btn-edit--row-actions-campaign-manager',
        icon: 'mdi-pencil',
        action: 'on-edit',
        disabled:
          !this.getQuishingCampaignManagerParentUpdatePermissions || this.scope.row.frequency > 0
      }

      if (
        this.actionStatus === ACTION_STATUSES.IDLE ||
        this.actionStatus === ACTION_STATUSES.RUNNING ||
        this.actionStatus === ACTION_STATUSES.INDIVIDUAL
      ) {
        copyOfRowActions.push(editItem)
        copyOfRowActions.push(newInstanceItem)
        if (this.isQuishingPrintPreview) copyOfRowActions.push(printPreviewItem)
        if (!this.isQuishingPrintPreview) copyOfRowActions.push(duplicateItem)
        copyOfRowActions.push(deleteItem)
      } else if (
        this.actionStatus === ACTION_STATUSES.COMPLETE ||
        this.actionStatus === ACTION_STATUSES.CANCEL ||
        this.actionStatus === ACTION_STATUSES.INDIVIDUAL
      ) {
        copyOfRowActions.push(editItem)
        copyOfRowActions.push(newInstanceItem)
        if (this.isQuishingPrintPreview) copyOfRowActions.push(printPreviewItem)
        copyOfRowActions.push(deleteItem)
      } else {
        copyOfRowActions.push(editItem)
        if (this.isQuishingPrintPreview) copyOfRowActions.push(printPreviewItem)
        copyOfRowActions.push(deleteItem)
      }

      return copyOfRowActions
    }
  },
  methods: {
    handleItemClick(act = {}) {
      let eventName = ''
      if (
        [ACTION_STATUSES.COMPLETE, ACTION_STATUSES.IDLE, ACTION_STATUSES.CANCEL].includes(
          act.action
        )
      ) {
        eventName = 'on-launch'
      } else {
        eventName = act.action
      }
      this.$emit(eventName, this.scope.row)
    }
  }
}
</script>
