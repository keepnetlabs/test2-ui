<template>
  <div>
    <v-tooltip bottom max-width="250">
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          :id="getId"
          :disabled="!getCampaignManagerParentPreviewPermissions"
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
        <v-tooltip
          v-for="(act, ind) of getItems"
          :disabled="!act.disabled"
          :key="ind"
          bottom
          max-width="250"
        >
          <template #activator="{ on }">
            <div v-on="on">
              <v-list-item
                :id="`${act.id}-${scope.$index}-${ind}-${Math.random().toString().substring(2)}`"
                :disabled="act.disabled"
                class="sub-menu-el datatable-row-action-list"
              >
                <v-list-item-title @click="handleItemClick(act)">
                  <img
                    v-if="act.id === 'btn-new-instance-item-row-actions-campaign-manager'"
                    :class="[
                      'pr-3',
                      act.disabled && 'v-icon notranslate v-icon--disabled mdi theme--light '
                    ]"
                    :src="act.icon"
                    alt="icon"
                  />
                  <v-icon v-else class="pr-3" :disabled="act.disabled">{{ act.icon }}</v-icon>
                  <span>{{ act.name }}</span>
                </v-list-item-title>
              </v-list-item>
            </div>
          </template>
          <span>{{ act.disabledText || act.name }}</span>
        </v-tooltip>
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
  name: 'CampaignManagerRowActions',
  props: {
    scope: {
      type: Object
    },
    rowActions: {
      type: Array
    },
    isNewInstanceDisabled: {
      type: Boolean,
      default: false
    },
    isQuishingPrintPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getCampaignManagerParentPreviewPermissions:
        'permissions/getCampaignManagerParentPreviewPermissions',
      getCampaignManagerParentCreatePermissions:
        'permissions/getCampaignManagerParentCreatePermissions',
      getCampaignManagerParentDeletePermissions:
        'permissions/getCampaignManagerParentDeletePermissions',
      getCampaignManagerParentUpdatePermissions:
        'permissions/getCampaignManagerParentUpdatePermissions'
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
        icon:
          !this.getCampaignManagerParentCreatePermissions || this.isNewInstanceDisabled
            ? require('../../assets/img/icon_left_disabled.svg')
            : require('../../assets/img/icon_left.svg'),
        action: 'on-launch',
        disabled: !this.getCampaignManagerParentCreatePermissions || this.isNewInstanceDisabled,
        disabledText: this.isNewInstanceDisabled
          ? `A new instance with frequency and random scenarios can’t be created.`
          : 'Create New Instance'
      }
      const duplicateItem = {
        name: labels.Duplicate,
        id: 'btn-duplicate--row-actions-campaign-manager',
        icon: 'mdi-content-copy',
        action: 'on-duplicate'
        // disabled: !this.getCampaignManagerParentCreatePermissions
      }
      const deleteItem = {
        name: labels.Delete,
        id: 'btn-delete--row-actions-campaign-manager',
        icon: 'mdi-delete',
        action: 'on-delete',
        disabled: !this.getCampaignManagerParentDeletePermissions
      }
      const editItem = {
        name: labels.Edit,
        isNotShow: true,
        id: 'btn-edit--row-actions-campaign-manager',
        icon: 'mdi-pencil',
        action: 'on-edit',
        disabled: !this.getCampaignManagerParentUpdatePermissions || this.scope.row.frequency > 0,
        disabledText:
          this.scope.row.frequency > 0
            ? 'Campaigns with random scenarios cannot be edited once their frequency is set.'
            : 'Edit'
      }

      if (
        this.actionStatus === ACTION_STATUSES.IDLE ||
        this.actionStatus === ACTION_STATUSES.RUNNING ||
        this.actionStatus === ACTION_STATUSES.INDIVIDUAL
      ) {
        copyOfRowActions.push(editItem, newInstanceItem)
        if (this.isQuishingPrintPreview) copyOfRowActions.push(printPreviewItem)
        if (!this.isQuishingPrintPreview) copyOfRowActions.push(duplicateItem)
        copyOfRowActions.push(deleteItem)
      } else if (
        this.actionStatus === ACTION_STATUSES.COMPLETE ||
        this.actionStatus === ACTION_STATUSES.CANCEL ||
        this.actionStatus === ACTION_STATUSES.INDIVIDUAL
      ) {
        copyOfRowActions.push(editItem, newInstanceItem)
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
