<template>
  <div>
    <v-btn
      @click="
        addWidget('Users', {
          x: 0,
          y: 12,
          w: 6,
          minW: 3,
          minH: 3,
          h: 6,
          i: Math.random().toString(),
          name: 'Users'
        })
      "
      >Add Users</v-btn
    >
    <v-btn
      @click="
        addWidget('IncidentResponder', {
          x: 0,
          y: 12,
          w: 6,
          minW: 3,
          minH: 3,
          h: 6,
          i: Math.random().toString(),
          name: 'IncidentResponder'
        })
      "
      >Add IR</v-btn
    >
    <v-btn
      @click="
        addWidget('Comp', {
          x: 0,
          y: 12,
          w: 3,
          minW: 2,
          minH: 2,
          h: 3,
          i: Math.random().toString(),
          name: 'Comp'
        })
      "
      >Add Comp</v-btn
    >
    <smart-widget-grid :layout="layout" :col-num="6" @layout-updated="layoutUpdated" @>
      <smart-widget
        :padding="[32, 32]"
        :key="item.i"
        v-for="(item, index) in layout"
        :slot="item.i"
      >
        <template v-slot:title>
          <label>{{ item.i }}</label>
          <v-icon
            style="position: absolute; top: 12px; right: 10px; z-index: 999999; cursor: pointer;"
            color="red"
            @click="deleteWidget(item, index)"
            class="widget__header-icon"
            >mdi-close-circle</v-icon
          >
        </template>
        <component :is="getComponent(item.name)" />
      </smart-widget>
    </smart-widget-grid>
  </div>
</template>

<script>
import Users from '@/components/PhishingReporter/Users'
import IncidentResponder from '@/views/IncidentResponder'
import Comp from '@/components/Common/Widget/Comp'
export default {
  name: 'Widgets',
  data() {
    return {
      layout: []
    }
  },
  methods: {
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      localStorage.setItem('widgetLayout', JSON.stringify(this.layout))
    },
    addWidget(name, obj) {
      this.layout.unshift(obj)
    },
    layoutUpdated(newLayout) {
      localStorage.setItem('widgetLayout', JSON.stringify(newLayout))
    },

    getComponent(componentString) {
      switch (componentString) {
        case 'Users':
          return Users
        case 'IncidentResponder':
          return IncidentResponder
        case 'Comp':
          return Comp
        default:
          break
      }
    }
  },
  created() {
    this.layout = JSON.parse(localStorage.getItem('widgetLayout')) || []
  }
}
</script>

<style lang="scss">
::v-deep .widget__header-icon {
  position: absolute;
  top: 12px;
  right: 10px;
  z-index: 999999;
  cursor: pointer;
}
::v-deep .widget-body__content {
  overflow-y: auto;
}
.widget-body__content {
  overflow-y: auto;
}
</style>
