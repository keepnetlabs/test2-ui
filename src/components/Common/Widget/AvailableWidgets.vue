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
          :disabled="!checkPermissions('dashboard/widgets', 'GET')"
          @click="handleEdit"
          ><v-icon class="mr-2" style="font-size: 22px;">mdi-view-dashboard</v-icon>Edit
          Dashboard</v-btn
        >
        <template v-else>
          <v-menu bottom offset-y max-height="500" content-class="no-box-shadow">
            <template v-slot:activator="{ on }">
              <div v-on="on" style="display: inline-block;">
                <v-btn
                  id="btn-add--dashboard-widgets"
                  :class="[
                    'widget-button mr-2',
                    { 'widget-button--disabled': !availableWidgets.length }
                  ]"
                  style="font-size: 20px;"
                  rounded
                  color="transparent"
                  ><v-icon class="mr-2" style="font-size: 22px;">mdi-plus</v-icon>Add Widgets</v-btn
                >
              </div>
            </template>
            <v-list v-if="availableWidgets.length">
              <v-list-item
                v-if="widget.isAllowed"
                v-for="widget in availableWidgets"
                @click="handleAddWidget(widget)"
                :key="widget.key"
              >
                <v-list-item-title>{{ widget.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            id="btn-save--dashboard-widgets"
            class="widget-button"
            rounded
            color="transparent"
            @click="handleEdit"
            ><v-icon class="mr-2" style="font-size: 22px;">mdi-content-save</v-icon>Save
            Changes</v-btn
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/functions'

export default {
  name: 'AvailableWidgets',
  props: {
    availableWidgets: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isMinimized: false
    }
  },
  methods: {
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    handleAddWidget(widget) {
      this.$emit('addWidget', widget)
    },
    handleMinimize() {
      this.isMinimized = !this.isMinimized
    },
    handleEdit() {
      this.$emit('handleEdit')
    },
    handleOpenMenu() {
      this.$emit('handleOpenMenu')
    }
  }
}
</script>

<style lang="scss">
.available-widget {
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
    &-left {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #2196f3;
    }
  }
  &__body {
    display: flex;
    flex-wrap: wrap;
    span {
      margin: 5px;
    }
  }
  &__item {
    display: flex;
    align-items: center;
    .v-btn__content {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: center;
    }
  }
  &__icon {
    cursor: pointer;
  }
}
.widget-button {
  box-shadow: none !important;
  padding: 6px 16px !important;
  height: auto !important;
  &.v-btn {
    border: 1px solid white !important;
  }

  .v-btn {
    &__content {
      color: white;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
    }
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
.no-box-shadow {
  box-shadow: none !important;
}
</style>
