<template>
  <div class="k-widget__container">
    <div class="k-widget__header">
      <available-widgets :available-widgets="availableWidgets" @addWidget="addWidget" />
      <v-btn color="green" class="ml-4" @click="changeWidgetStatus">
        <v-icon>{{ editMode ? 'mdi-plus' : 'mdi-pencil' }}</v-icon>

        {{ editMode ? 'Save' : 'Edit' }}
      </v-btn>
    </div>

    <smart-widget-grid
      :layout="layout"
      :col-num="6"
      @layout-updated="layoutUpdated"
      @layout-mounted="layoutMounted"
      :is-static="!editMode"
      :row-height="52"
    >
      <smart-widget
        :title="item.title"
        fullscreen
        :key="item.i"
        v-for="(item, index) in layout"
        :slot="item.i"
        :padding="[0, 0]"
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
        <component :is="getComponent(item.key)" />
      </smart-widget>
    </smart-widget-grid>
  </div>
</template>

<script>
import PhishingReporterUsers from '@/components/PhishingReporter/Users'
import AvailableWidgets from '@/components/Common/Widget/AvailableWidgets'
import PhishingReporterHeader from '@/components/Common/Widget/WidgetComponents/PhishingReporterHeader'
import IncidentResponderHeader from '@/components/Common/Widget/WidgetComponents/IncidentResponderHeader'
import PhishingCampaigns from '@/components/Common/Widget/WidgetComponents/PhishingCampaigns'
import RecentInvestigations from '@/components/Common/Widget/WidgetComponents/RecentInvestigations'
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
        PhishingReporterUsers: {
          x: 0,
          y: 0,
          w: 6,
          minW: 2,
          h: 7,
          minH: 3,
          i: Math.random().toString(),
          title: 'Phishing Reporter Users',
          key: 'PhishingReporterUsers'
        },
        IncidentResponderHeader: {
          x: 0,
          y: 0,
          w: 4,
          minW: 4,
          h: 6,
          minH: 3,
          i: Math.random().toString(),
          title: 'Incident Responder Header',
          key: 'IncidentResponderHeader'
        },
        PhishingReporterHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 4,
          minH: 3,
          i: Math.random().toString(),
          title: 'Phishing Reporter Header',
          key: 'PhishingReporterHeader'
        },
        PhishingCampaigns: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 7,
          minH: 7,
          i: Math.random().toString(),
          title: 'Phishing Campaigns',
          key: 'PhishingCampaigns'
        },
        RecentInvestigations: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 8,
          minH: 8,
          i: Math.random().toString(),
          title: 'Recent Investigations',
          key: 'RecentInvestigations'
        }
      },
      availableWidgets: [
        { name: 'Phishing Reporter Users', key: 'PhishingReporterUsers' },
        { name: 'Incident Responder Header', key: 'IncidentResponderHeader' },
        { name: 'Phishing Reporter Header', key: 'PhishingReporterHeader' },
        { name: 'Phishing Campaigns', key: 'PhishingCampaigns' },
        { name: 'Recent Investigations', key: 'RecentInvestigations' }
      ]
    }
  },
  methods: {
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.availableWidgets.push({ key: item.key, name: item.title })
      localStorage.setItem('availableWidgets', JSON.stringify(this.availableWidgets))
      localStorage.setItem('widgetLayout', JSON.stringify(this.layout))
    },
    addWidget(widget) {
      this.availableWidgets.splice(
        this.availableWidgets.findIndex((item) => {
          return JSON.stringify(item) === JSON.stringify(widget)
        }),
        1
      )
      localStorage.setItem('availableWidgets', JSON.stringify(this.availableWidgets))
      this.layout.push(this.allWidgets[widget.key])
    },
    layoutUpdated(newLayout) {
      localStorage.setItem('widgetLayout', JSON.stringify(newLayout))
    },
    changeWidgetStatus() {
      /*
      if (this.editMode) {
        localStorage.setItem('widgetLayout', JSON.stringify(this.layout))
      }

       */
      this.editMode = !this.editMode
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
        this.layout[index].h = this.allWidgets[item.key].minH
      } else {
        this.$refs[ref][0].$el.querySelector('.widget-body').style.display = 'none'
        this.layout[index].h = 1
      }
    },

    getComponent(componentString) {
      switch (componentString) {
        case 'PhishingReporterUsers':
          return PhishingReporterUsers
        case 'IncidentResponderHeader':
          return IncidentResponderHeader
        case 'PhishingReporterHeader':
          return PhishingReporterHeader
        case 'PhishingCampaigns':
          return PhishingCampaigns
        case 'RecentInvestigations':
          return RecentInvestigations
        default:
          break
      }
    }
  },
  created() {
    this.layout = JSON.parse(localStorage.getItem('widgetLayout')) || []
    this.availableWidgets =
      JSON.parse(localStorage.getItem('availableWidgets')) || this.availableWidgets
  }
}
</script>

<style lang="scss">
.k-widget {
  &__container {
    padding: 11px 16px 16px 16px;
  }
  &__header {
    display: flex;
    align-items: center;
  }
}
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
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
}
</style>
