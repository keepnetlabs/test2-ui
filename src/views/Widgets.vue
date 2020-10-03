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
      :col-num="colNum"
      @layout-mounted="layoutMounted"
      :is-static="!editMode"
      :row-height="50"
      ref="refGrid"
    >
      <smart-widget
        :key="item.i"
        v-for="(item, index) in layout"
        :slot="item.i"
        :padding="[0, 0]"
        :ref="`ref${item.i}`"
        :shadow="'never'"
        :simple="true"
      >
        <component
          :is="getComponent(item.key)"
          :resizable="false"
          :editMode="editMode"
          @deleteWidget="deleteWidget(item, index)"
        />
      </smart-widget>
    </smart-widget-grid>
  </div>
</template>

<script>
import AvailableWidgets from '@/components/Common/Widget/AvailableWidgets'
import RecentInvestigations from '@/components/Common/Widget/WidgetComponents/RecentInvestigations'
import Reporters from '@/components/Common/Widget/WidgetComponents/Reporters'
import TopRules from '@/components/Common/Widget/WidgetComponents/TopRules'
import IncidentClusters from '@/components/Common/Widget/WidgetComponents/IncidentClusters'
import TopPosts from '@/components/Common/Widget/WidgetComponents/TopPosts'

import RecentlyPostedThreats from '@/components/Common/Widget/WidgetComponents/RecentlyPostedThreats'
import RecentlyReportedIncidents from '@/components/Common/Widget/WidgetComponents/RecentlyReportedIncidents'
import ReportedEmailTrends from '@/components/Common/Widget/WidgetComponents/ReportedEmailTrends'
export default {
  name: 'Widgets',
  components: {
    AvailableWidgets
  },
  data() {
    /*

        IncidentResponderHeader: {
          x: 0,
          y: 0,
          w: 6,
          defaultW: 6,
          minW: 4,
          h: 5,
          defaultH: 5,
          minH: 5,
          i: Math.random().toString(),
          title: 'Incident Responder Header',
          key: 'IncidentResponderHeader',
          icon: 'mdi-view-dashboard'
        },
    */

    return {
      activeBreakpoint: 'lg',
      layout: [],
      newItemY: 0,
      colNum: 12,
      editMode: false,
      allWidgets: {
        RecentInvestigations: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          title: 'Recent Investigations',
          key: 'RecentInvestigations'
        },
        RecentlyReportedIncidents: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          title: 'Recently Reported Incidents',
          key: 'RecentlyReportedIncidents'
        },
        RecentlyPostedThreats: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          title: 'Recently Posted Threats',
          key: 'RecentlyPostedThreats'
        },
        TopRules: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          key: 'TopRules',
          title: 'Top Rules'
        },
        TopPosts: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          key: 'TopPosts',
          title: 'Top Posts'
        },
        Reporters: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          key: 'Reporters',
          title: 'Reporters'
        },
        IncidentClusters: {
          x: 0,
          y: 0,
          w: 8,
          minW: 8,
          defaultW: 8,
          h: 7,
          midW: 12,
          defaultH: 7,
          minH: 7,
          maxH: 7,
          i: Math.random().toString(),
          key: 'IncidentClusters',
          title: 'Incident Clusters'
        },
        ReportedEmailTrends: {
          x: 0,
          y: 0,
          w: 8,
          minW: 8,
          defaultW: 8,
          h: 7,
          midW: 12,
          defaultH: 7,
          minH: 7,
          maxH: 7,
          i: Math.random().toString(),
          key: 'ReportedEmailTrends',
          title: 'Reported Email Trends'
        }
      },
      availableWidgets: [
        { name: 'Recent Investigations', key: 'RecentInvestigations' },
        { name: 'Top Rules', key: 'TopRules' },
        { name: 'Top Posts', key: 'TopPosts' },
        { name: 'Reporters', key: 'Reporters' },
        { name: 'Incident Clusters', key: 'IncidentClusters' },
        { name: 'Recently Posted Threats', key: 'RecentlyPostedThreats' },
        { name: 'Recently Reported Incidents', key: 'RecentlyReportedIncidents' },
        { name: 'Reported Email Trends', key: 'ReportedEmailTrends' }
      ],
      style:
        '.vue-grid-layout.smartwidget {box-shadow:none;' +
        'background:transparent ;' +
        ' border:none}'
    }
    /*

      { name: 'Overall Stats', key: 'OverallStats' },
       { name: 'Phishing Campaigns', key: 'PhishingCampaigns' },
      */
  },
  methods: {
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.availableWidgets.push({ key: item.key, name: item.title })
    },
    addWidget(widget) {
      this.removeAvailableWidget(widget)
      let newItem
      const widgetObj = { ...this.allWidgets[widget.key] }
      if (window.innerWidth < 1100 && window.innerWidth > 900) {
        widgetObj.w = 6
      } else if (window.innerWidth < 900) {
        widgetObj.w = 6
        if (widget.key === 'IncidentResponderHeader') {
          widgetObj.h = widgetObj.h + 4
        } else if (widget.key === 'PhishingReporterHeader') {
          widgetObj.h = widgetObj.h + 1
        }
      } else {
        this.allWidgets[widget.key].w = this.allWidgets[widget.key].defaultW
      }
      newItem = widgetObj
      newItem['y'] = this.newItemY
      this.newItemY += newItem.h
      this.layout.unshift(widgetObj)
    },
    removeAvailableWidget(widget) {
      this.availableWidgets.splice(
        this.availableWidgets.findIndex((item) => {
          return item.key === widget.key
        }),
        1
      )
    },
    layoutResized() {},
    changeWidgetStatus() {
      this.editMode = !this.editMode
    },
    layoutMounted() {
      /*
      newLayout.map((item, index) => {
        if (newLayout[index].h === 1) {
          this.$refs[`ref${item.i}`][0].$el.querySelector('.widget-body').style.display = 'none'
        }
        this.newItemY += item.h
      })
       */
      this.handleDeleteShadows()
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
        case 'RecentInvestigations':
          return RecentInvestigations
        case 'Reporters':
          return Reporters
        case 'TopRules':
          return TopRules
        case 'TopPosts':
          return TopPosts
        case 'IncidentClusters':
          return IncidentClusters
        case 'RecentlyPostedThreats':
          return RecentlyPostedThreats
        case 'RecentlyReportedIncidents':
          return RecentlyReportedIncidents
        case 'ReportedEmailTrends':
          return ReportedEmailTrends
        default:
          break
      }
    },
    handleDeleteShadows() {
      document.querySelectorAll('.smartwidget').forEach((item) => {
        item.style.boxShadow = 'none'
        item.style.backgroundColor = 'transparent'
        item.style.border = 'none'
      })
    },
    handleAddShadows() {
      document.querySelectorAll('.smartwidget').forEach((item) => {
        item.style.boxShadow = ''
        item.style.backgroundColor = ''
        item.style.border = ''
      })
    },
    getDefaultLayoutObject() {
      const width = window.innerWidth
      let retValue = ''
      if (width > 1023) {
        retValue = [
          {
            x: 0,
            y: 9,
            w: 3,
            minW: 3,
            h: 6,
            defaultH: 6,
            minH: 6,
            i: '0.9609571524431146',
            icon: 'mdi-ruler',
            title: 'Top Rules',
            key: 'TopRules'
          },
          {
            x: 0,
            y: 0,
            w: 6,
            minW: 4,
            h: 4,
            defaultH: 5,
            minH: 5,
            i: '0.013946941616145292',
            title: 'Incident Responder Header',
            key: 'IncidentResponderHeader',
            icon: 'mdi-view-dashboard',
            moved: false
          },
          {
            x: 0,
            y: 5,
            w: 6,
            minW: 2,
            h: 3,
            defaultH: 4,
            minH: 3,
            i: '0.4881174107990931',
            title: 'Phishing Reporter Header',
            key: 'PhishingReporterHeader',
            icon: 'mdi-page-layout-header',
            moved: false
          },
          {
            x: 3,
            y: 9,
            w: 3,
            minW: 3,
            h: 6,
            defaultH: 7,
            minH: 7,
            i: '0.9192270992839009',
            icon: 'mdi-briefcase-variant',
            title: 'Recent Investigations',
            key: 'RecentInvestigations',
            moved: false
          },
          {
            x: 0,
            y: 16,
            w: 3,
            minW: 2,
            h: 5,
            defaultH: 6,
            minH: 6,
            i: '0.6093637144487283',
            icon: 'mdi-information',
            title: 'Company Information',
            key: 'CompanyInformation',
            moved: false
          }
        ]
      } else {
        retValue = [
          {
            x: 0,
            y: 27,
            w: 6,
            minW: 2,
            h: 5,
            defaultH: 6,
            minH: 6,
            i: '0.8439874928535207',
            icon: 'mdi-information',
            title: 'Company Information',
            key: 'CompanyInformation',
            moved: false
          },
          {
            x: 0,
            y: 20,
            w: 6,
            minW: 3,
            h: 6,
            defaultH: 7,
            minH: 7,
            i: '0.0027368488746000175',
            icon: 'mdi-briefcase-variant',
            title: 'Recent Investigations',
            key: 'RecentInvestigations',
            moved: false
          },
          {
            x: 0,
            y: 13,
            w: 6,
            minW: 3,
            h: 6,
            defaultH: 7,
            minH: 7,
            i: '0.5387173486278651',
            icon: 'mdi-ruler',
            title: 'Top Rules',
            key: 'TopRules',
            moved: false
          },
          {
            x: 0,
            y: 9,
            w: 6,
            minW: 2,
            h: 4,
            defaultH: 4,
            minH: 3,
            i: '0.12610356662045974',
            title: 'Phishing Reporter Header',
            key: 'PhishingReporterHeader',
            icon: 'mdi-page-layout-header',
            moved: false
          },
          {
            x: 0,
            y: 0,
            w: 6,
            minW: 4,
            h: 8,
            defaultH: 5,
            minH: 5,
            i: '0.4797311077466353',
            title: 'Incident Responder Header',
            key: 'IncidentResponderHeader',
            icon: 'mdi-view-dashboard',
            moved: false
          }
        ]
      }
      retValue.map((widget) => {
        this.removeAvailableWidget(widget)
      })
      return retValue
    }
  },
  created() {
    this.layout = JSON.parse(localStorage.getItem('widget-layout')) || []
    this.availableWidgets =
      JSON.parse(localStorage.getItem('available-widgets')) || this.availableWidgets
  },
  mounted() {
    /*
    this.$nextTick(() => {
      const that = this
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1025 && this.oldLayout) {
          //that.layout = [...that.oldLayout]
        } else if (window.innerWidth < 1025 && window.innerWidth > 768) {
          let x = 0,
            y = 0,
            row = 0,
            col = 0,
            beforeX = 0
          that.oldLayout = [...that.layout]
          that.layout.sort((a, b) => {
            if (a.y > b.y) {
              return 1
            } else if (a.y === b.y) {
              return 0
            } else {
              return -1
            }
          })
          that.layout = that.layout.map((item) => {
            debugger
            const itemWidth = item.w > item.midW ? item.w : item.midW
            beforeX = x
            x += itemWidth || 6

            if (x > 12) {
              x = 0
              beforeX = 0
              y += item.h
            } else if (x === 12 && beforeX === 0) {
              x = 0
              beforeX = 0
              y += item.h
            }

            return { ...item, w: itemWidth, x, y }
          })
        } else if (window.innerWidth < 768) {
          that.oldLayout = [...that.layout]
          that.layout.sort((a, b) => {
            if (a.y > b.y) {
              return 1
            } else if (a.y === b.y) {
              return 0
            } else {
              return -1
            }
          })
          let x = 0,
            y = 0,
            row = 0,
            col = 0
          that.layout = that.layout.map((item) => {
            y += item.y
            return { ...item, w: 12, x: 0, y }
          })
        }
      })
    })

     */
  },
  watch: {
    editMode(val) {
      if (!val) {
        this.handleDeleteShadows()
        localStorage.setItem('widget-layout', JSON.stringify(this.layout))
        localStorage.setItem('available-widgets', JSON.stringify(this.availableWidgets))
      } else {
        this.handleAddShadows()
      }
    }
  }
}
</script>

<style lang="scss">
.k-widget {
  &__container {
    padding: 11px 16px 16px 16px;
    width: 100%;
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
  //n overflow-y: auto;
}
.widget-body__content {
  //overflow-y: auto;
  overflow: hidden;
  .incident-responder-parent .columns-row .dashboard-cards .card-body .body-row__text {
    line-height: 1;
  }
  .incident-responder-parent .columns-row .dashboard-cards .card-footer {
    line-height: 1;
  }
  .users {
    padding-top: 0;
    .v-card {
      padding-bottom: 0 !important;
    }
  }
  &::-webkit-scrollbar {
    //display: none;
  }

  //  -ms-overflow-style: none; /* IE and Edge */
  // scrollbar-width: none;
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
