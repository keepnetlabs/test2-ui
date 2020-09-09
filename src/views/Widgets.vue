<template>
  <div class="k-widget__container">
    <v-btn @click="editMode = true">
      Edit
    </v-btn>
    <available-widgets :available-widgets="availableWidgets" @addWidget="addWidget" />
    <smart-widget-grid
      :layout="layout"
      :col-num="6"
      @layout-updated="layoutUpdated"
      @layout-mounted="layoutMounted"
      :is-static="!editMode"
    >
      <smart-widget
        :title="item.title"
        fullscreen
        :key="item.i"
        v-for="(item, index) in layout"
        :slot="item.i"
        :ref="`ref${item.i}`"
      >
        <template v-slot:toolbar>
          <v-icon
            style="margin-top: -25px; font-size: 18px;"
            small
            @click="collapse(item, index, `ref${item.i}`)"
            class="widget__header-icon ml-1"
            >mdi-window-minimize</v-icon
          >
          <v-icon
            style="margin-top: -25px; font-size: 18px;"
            small
            @click="deleteWidget(item, index)"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </template>
        <component :is="getComponent(item.title)" />
      </smart-widget>
    </smart-widget-grid>
  </div>
</template>

<script>
import Users from '@/components/PhishingReporter/Users'
import IncidentResponder from '@/views/IncidentResponder'
import Comp from '@/components/Common/Widget/Comp'
import AvailableWidgets from '@/components/Common/Widget/AvailableWidgets'
export default {
  name: 'Widgets',
  components: {
    AvailableWidgets
  },
  data() {
    return {
      layout: [],
      editMode: false,
      allWidgets: {
        Users: {
          x: 0,
          y: 12,
          w: 6,
          h: 6,
          i: Math.random().toString(),
          title: 'Users'
        },
        IncidentResponder: {
          x: 0,
          y: 12,
          w: 6,
          h: 6,
          i: Math.random().toString(),
          title: 'Incident Responder'
        },
        Comp: {
          x: 0,
          y: 12,
          w: 3,
          h: 3,
          i: Math.random().toString(),
          name: 'Comp'
        }
      },
      availableWidgets: [
        { name: 'Users', key: 'Users' },
        { name: 'Incident Responder', key: 'IncidentResponder' },
        { name: 'Comp', key: 'Comp' }
      ]
    }
  },
  methods: {
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.availableWidgets.push({ key: item.title.split(' ').join(''), name: item.title })
      localStorage.setItem('widgetLayout', JSON.stringify(this.layout))
    },
    addWidget(widget) {
      this.availableWidgets.splice(
        this.availableWidgets.findIndex((item) => {
          return JSON.stringify(item) === JSON.stringify(widget)
        }),
        1
      )
      this.layout.unshift(this.allWidgets[widget.key])
    },
    layoutUpdated(newLayout) {
      localStorage.setItem('widgetLayout', JSON.stringify(newLayout))
    },
    layoutMounted(newLayout) {
      newLayout.map((item, index) => {
        if (newLayout[index].h === 1) {
          this.$refs[`ref${item.i}`][0].$el.querySelector('.widget-body').style.display = 'none'
        }
      })
    },
    collapse(item, index, ref) {
      if (this.layout[index].h === 1) {
        this.$refs[ref][0].$el.querySelector('.widget-body').style.display = 'block'
        this.layout[index].h = 3
      } else {
        this.$refs[ref][0].$el.querySelector('.widget-body').style.display = 'none'
        this.layout[index].h = 1
      }
    },

    getComponent(componentString) {
      switch (componentString) {
        case 'Users':
          return Users
        case 'Incident Responder':
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
.widget__header {
  &-icon {
    position: absolute;
    top: 12px;
    right: 10px;
    z-index: 999999;
    cursor: pointer;
  }

  &-label {
  }
}
::v-deep .widget-body__content {
  overflow-y: auto;
}
.widget-body__content {
  overflow-y: auto;
}
.k-widget__container {
  padding: 11px 16px 16px 16px;
}
</style>
