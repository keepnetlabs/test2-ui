<template>
  <div class="k-widget__container">
    <div class="k-widget__header">
      <available-widgets
        @handleEdit="changeWidgetStatus"
        :edit-mode="editMode"
        :available-widgets="availableWidgets"
        @addWidget="addWidget"
      />
    </div>

    <smart-widget-grid
      :layout="layout"
      :col-num="6"
      @layout-updated="layoutUpdated"
      @layout-mounted="layoutMounted"
      :is-static="!editMode"
      :row-height="52"
      ref="refGrid"
    >
      <smart-widget
        fullscreen
        :key="item.i"
        v-for="(item, index) in layout"
        :slot="item.i"
        :padding="[0, 0]"
        :ref="`ref${item.i}`"
      >
        <template v-slot:title>
          <div class="widget-header__title">
            <v-icon color="#2196f3">{{ item.icon }}</v-icon>
            <span class="ml-2">{{ item.title }}</span>
          </div>
        </template>
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
import ReportedEmails from '@/components/Common/Widget/WidgetComponents/ReportedEmails'
import OverallStats from '@/components/Common/Widget/WidgetComponents/OverallStatsWidget'
import CompanyInformationWidget from '@/components/Common/Widget/WidgetComponents/CompanyInformationWidget'
export default {
  name: 'Widgets',
  components: {
    AvailableWidgets
  },
  data() {
    return {
      layout: [],
      newItemY: 0,
      editMode: false,
      allWidgets: {
        PhishingReporterUsers: {
          x: 0,
          y: 0,
          w: 6,
          minW: 2,
          h: 7,
          minH: 3,
          defaultH: 7,
          i: Math.random().toString(),
          title: 'Phishing Reporter Users',
          key: 'PhishingReporterUsers',
          icon: 'mdi-account'
        },
        IncidentResponderHeader: {
          x: 0,
          y: 0,
          w: 4,
          minW: 4,
          h: 5,
          defaultH: 5,
          minH: 5,
          i: Math.random().toString(),
          title: 'Incident Responder Header',
          key: 'IncidentResponderHeader',
          icon: 'mdi-view-dashboard'
        },
        PhishingReporterHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 2,
          h: 4,
          defaultH: 4,
          minH: 3,
          i: Math.random().toString(),
          title: 'Phishing Reporter Header',
          key: 'PhishingReporterHeader',
          icon: 'mdi-page-layout-header'
        },
        PhishingCampaigns: {
          x: 0,
          y: 0,
          w: 2,
          minW: 2,
          h: 6,
          defaultH: 6,
          minH: 5,
          i: Math.random().toString(),
          title: 'Phishing Campaigns',
          key: 'PhishingCampaigns',
          icon: 'mdi-chart-pie'
        },
        ReportedEmails: {
          x: 0,
          y: 0,
          w: 6,
          minW: 2,
          h: 10,
          defaultH: 10,
          minH: 3,
          i: Math.random().toString(),
          title: 'Reported Emails',
          key: 'ReportedEmails',
          icon: 'mdi-email'
        },
        RecentInvestigations: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 8,
          defaultH: 8,
          minH: 8,
          i: Math.random().toString(),
          icon: 'mdi-briefcase-variant',
          title: 'Recent Investigations',
          key: 'RecentInvestigations'
        },
        OverallStats: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 11,
          defaultH: 11,
          minH: 8,
          i: Math.random().toString(),
          icon: 'mdi-chart-bar',
          title: 'Overall Stats',
          key: 'OverallStats'
        },
        CompanyInformation: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          h: 5,
          defaultH: 5,
          minH: 5,
          i: Math.random().toString(),
          icon: 'mdi-information',
          title: 'Company Information',
          key: 'CompanyInformation'
        }
      },
      availableWidgets: [
        { name: 'Phishing Reporter Users', key: 'PhishingReporterUsers' },
        { name: 'Incident Responder Header', key: 'IncidentResponderHeader' },
        { name: 'Phishing Reporter Header', key: 'PhishingReporterHeader' },
        { name: 'Phishing Campaigns', key: 'PhishingCampaigns' },
        { name: 'Recent Investigations', key: 'RecentInvestigations' },
        { name: 'Reported Emails', key: 'ReportedEmails' },
        { name: 'Overall Stats', key: 'OverallStats' },
        { name: 'Company Information', key: 'CompanyInformation' }
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
      const newItem = this.allWidgets[widget.key]
      newItem['y'] = this.newItemY
      this.newItemY += newItem.h
      this.layout.unshift(this.allWidgets[widget.key])
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
        this.layout[index].h = this.allWidgets[item.key].defaultH
      } else {
        this.$refs[ref][0].$el.querySelector('.widget-body').style.display = 'none'
        this.layout[index].h = 1
      }
      this.layout = [...this.layout]
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
        case 'ReportedEmails':
          return ReportedEmails
        case 'OverallStats':
          return OverallStats
        case 'CompanyInformation':
          return CompanyInformationWidget
        default:
          break
      }
    }
  },
  created() {
    this.layout = JSON.parse(localStorage.getItem('widgetLayout')) || []
    this.availableWidgets =
      JSON.parse(localStorage.getItem('availableWidgets')) || this.availableWidgets
  },
  watch: {
    layout(newLayout) {
      localStorage.setItem('widgetLayout', JSON.stringify(newLayout))
    }
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
.vue-grid-layout {
  margin-left: -12px;
}
.widget-header__title {
  padding-left: 12px !important;
  font-weight: 600 !important;
  color: #2196f3;
  display: flex !important;
  align-items: center;
}
</style>
