<template>
  <div class="available-widget">
    <div class="available-widget__header">
      <div class="available-widget__header-left"></div>
      <div class="available-widget__header-right">
        <v-btn
          v-if="!editMode"
          id="btn-edit--dashboard-widgets"
          class="widget-button"
          rounded
          color="transparent"
          :disabled="isEditModeDisabled"
          @click="handleEdit"
          ><v-icon class="mr-2" style="font-size: 22px;">{{ mdiViewDashboard }}</v-icon
          >Edit Dashboard</v-btn
        >
        <template v-else>
          <v-btn
            id="btn-cancel--dashboard-widgets"
            class="widget-button mr-2"
            rounded
            color="transparent"
            @click="handleCancel"
            ><v-icon class="mr-2" style="font-size: 22px;">mdi-close</v-icon>Cancel</v-btn
          >
          <v-menu bottom offset-y max-height="500" content-class="no-box-shadow">
            <template v-slot:activator="{ on }">
              <div v-on="on" style="display: inline-block;">
                <v-btn
                  id="btn-add--dashboard-widgets"
                  :class="['widget-button mr-2', { 'widget-button--disabled': !canRenderMenu }]"
                  style="font-size: 20px;"
                  rounded
                  color="transparent"
                  ><v-icon class="mr-2" style="font-size: 22px;">mdi-plus</v-icon>Add Widgets</v-btn
                >
              </div>
            </template>
            <v-list v-if="canRenderMenu">
              <v-list-item
                v-if="widget.isAllowed"
                v-for="widget in widgets"
                @click="handleAddWidget(widget)"
                :key="widget.key"
              >
                <v-list-item-title :id="`text--widget-${widget.key}`">{{
                  widget.name
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            id="btn-save--dashboard-widgets"
            class="widget-button"
            rounded
            color="transparent"
            @click="handleSave"
            ><v-icon class="mr-2" style="font-size: 22px;">mdi-content-save</v-icon>Save
            Changes</v-btn
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiViewDashboard } from '@mdi/js'
export default {
  name: 'AvailableWidgets',
  props: {
    availableWidgets: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean
    },
    permissions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      mdiViewDashboard,
      widgets: []
    }
  },
  computed: {
    isEditModeDisabled() {
      return !this?.permissions?.widgets
    },
    canRenderMenu() {
      return this.widgets.length && this.widgets.some((widget) => widget.isAllowed)
    }
  },
  methods: {
    handleAddWidget(widget) {
      this.$emit('addWidget', widget)
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
    handleEdit() {
      this.$emit('handleEdit')
    },
    handleSave() {
      this.$emit('handleSave')
    },
    handleOpenMenu() {
      this.$emit('handleOpenMenu')
    }
  },
  watch: {
    availableWidgets: {
      immediate: true,
      deep: true,
      handler(val) {
        const currentAvailableWidgets = structuredClone(val)
        const currentAvailableWidgetKeys = currentAvailableWidgets.map((widget) => widget.key)
        const uniqueWidgetKeys = [...new Set(currentAvailableWidgetKeys)]
        const uniqueWidgets = currentAvailableWidgets
          .map((widget) => {
            if (uniqueWidgetKeys.includes(widget.key)) {
              return widget
            } else return undefined
          })
          .filter(Boolean)
        this.widgets = structuredClone(uniqueWidgets)
      }
    }
  }
}
</script>
