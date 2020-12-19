<template>
  <div class="k-widget__container">
    <app-modal
      :status="showPlaybookModal"
      v-if="showPlaybookModal"
      :icon-name="'mdi-pencil'"
      :title="'Edit Rule'"
      :show-footer="false"
      class-name="incident-responder__playbook"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          :playbookId="selectedPlaybookId"
          @cancelForm="togglePlaybookModal"
          @closeFormWithUpdate="closePlaybookWithUpdate"
          v-if="showPlaybookModal"
        />
      </template>
    </app-modal>
    <div class="k-widget__header" id="onur">
      <available-widgets
        @handleEdit="changeWidgetStatus"
        :edit-mode="editMode"
        :available-widgets="availableWidgets"
        @addWidget="addWidget"
        @handleOpenMenu="handleOpenMenu"
      />
    </div>

    <k-smart-grid
      :layout="layout"
      :col-num="colNum"
      @layout-mounted="layoutMounted"
      :is-static="!editMode"
      :row-height="50"
      ref="refGrid"
      @breakpointChanged="breakpointChanged"
      @layout-updated="layoutUpdated"
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
          :id="item.key"
          :is="getComponent(item.key)"
          :resizable="false"
          :editMode="editMode"
          @deleteWidget="deleteWidget(item, index)"
          @handleSelectPlaybookId="handleSelectedPlaybook"
        />
      </smart-widget>
    </k-smart-grid>
  </div>
</template>

<script>
import AvailableWidgets from '@/components/Common/Widget/AvailableWidgets'
import RecentInvestigations from '@/components/Common/Widget/WidgetComponents/RecentInvestigations'
import Reporters from '@/components/Common/Widget/WidgetComponents/Reporters'
import TopRules from '@/components/Common/Widget/WidgetComponents/TopRules'
import PhishingReporterIrHeader from '@/components/Common/Widget/WidgetComponents/PhishingReporterIrHeader'
import IncidentClusters from '@/components/Common/Widget/WidgetComponents/IncidentClusters'
import TopPosts from '@/components/Common/Widget/WidgetComponents/TopPosts'
import RecentlyPostedThreats from '@/components/Common/Widget/WidgetComponents/RecentlyPostedThreats'
import RecentlyReportedIncidents from '@/components/Common/Widget/WidgetComponents/RecentlyReportedIncidents'
import ReportedEmailTrends from '@/components/Common/Widget/WidgetComponents/ReportedEmailTrends'
import KSmartGrid from '@/components/Common/Widget/KSmartGrid'
import IncidentAnalysisIrHeader from '@/components/Common/Widget/WidgetComponents/IncidentAnalysisIrHeader'
import InvestigationsIrHeader from '@/components/Common/Widget/WidgetComponents/InvestigationsIrHeader'
import RoiSummaryIrHeader from '@/components/Common/Widget/WidgetComponents/RoiSummaryIrHeader'
import { getWidgets, postWidgets } from '@/api/widgets'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import CreateOrEditRule from '@/components/Playbook/CreateOrEditRule'
import AppModal from '@/components/AppModal'
import { checkPermission } from '@/utils/functions'
export default {
  name: 'Widgets',
  components: {
    KSmartGrid,
    AvailableWidgets,
    AppModal,
    CreateOrEditRule
  },
  data() {
    return {
      activeBreakpoint: 'lg',
      layout: [],
      showPlaybookModal: false,
      selectedPlaybookId: null,
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
        PhishingReporterIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: Math.random().toString(),
          key: 'PhishingReporterIrHeader',
          title: 'Phishing Reporter Ir Header'
        },
        IncidentAnalysisIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: Math.random().toString(),
          key: 'IncidentAnalysisIrHeader',
          title: 'Incident Analysis Ir Header'
        },
        InvestigationsIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: Math.random().toString(),
          key: 'InvestigationsIrHeader',
          title: 'Investigations Ir Header'
        },
        ROISummaryIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: Math.random().toString(),
          key: 'ROISummaryIrHeader',
          title: 'ROI Summary Ir Header'
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
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: Math.random().toString(),
          key: 'IncidentClusters',
          title: 'Incident Clusters'
        },
        ReportedEmailTrends: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
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
        { name: 'Reported Email Trends', key: 'ReportedEmailTrends' },
        { name: 'Phishing Reporter Ir Header', key: 'PhishingReporterIrHeader' },
        { name: 'Incident Analysis Ir Header', key: 'IncidentAnalysisIrHeader' },
        { name: 'Investigations Ir Header', key: 'InvestigationsIrHeader' },
        { name: 'ROI Summary Ir Header', key: 'ROISummaryIrHeader' }
      ],
      style:
        '.vue-grid-layout.smartwidget {box-shadow:none;' +
        'background:transparent ;' +
        ' border:none}',
      callbackOfPlaybook: null
    }
  },
  methods: {
    breakpointChanged({ newBreakpoint }) {
      this.activeBreakpoint = newBreakpoint
      const bdCol = newBreakpoint === 'xs' ? 6 : newBreakpoint === 'xxs' ? 2 : 12
      let x = 0,
        xValue = 0,
        y = 0
      this.layout.sort((a, b) => {
        if (a.y > b.y) {
          return 1
        } else if (a.y === b.y) {
          if (a.x > b.x) {
            return 1
          } else if (a.x < b.x) {
            return -1
          }
          return 0
        } else {
          return -1
        }
      })
      this.layout = this.layout.map((item) => {
        const itemWidth = item.w
        xValue = x
        x += itemWidth
        if (x > bdCol) {
          x = itemWidth
          y += item.h
          xValue = 0
        }

        return { ...item, w: itemWidth, x: xValue, y }
      })
    },
    layoutUpdated(newLayout) {},
    togglePlaybookModal() {
      this.showPlaybookModal = !this.showPlaybookModal
    },
    handleSelectedPlaybook({ resourceId, callback }) {
      this.selectedPlaybookId = resourceId
      this.callbackOfPlaybook = callback
      this.togglePlaybookModal()
    },
    closePlaybookWithUpdate() {
      this.callbackOfPlaybook()
      this.togglePlaybookModal()
    },
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.availableWidgets.push({ key: item.key, name: item.title })
    },
    handleOpenMenu() {
      this.editMode = true
    },
    addWidget(widget) {
      this.removeAvailableWidget(widget)
      let newItem
      const widgetObj = { ...this.allWidgets[widget.key] }
      if (window.innerWidth < 1100 && window.innerWidth > 900) {
        widgetObj.w = 6
      } else if (window.innerWidth < 900) {
        widgetObj.w = 6
      } else {
        this.allWidgets[widget.key].w = this.allWidgets[widget.key].defaultW
      }
      newItem = widgetObj
      newItem['y'] = this.newItemY
      this.newItemY += newItem.h
      this.layout.push(widgetObj)
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
        case 'PhishingReporterIrHeader':
          return PhishingReporterIrHeader
        case 'IncidentAnalysisIrHeader':
          return IncidentAnalysisIrHeader
        case 'InvestigationsIrHeader':
          return InvestigationsIrHeader
        case 'ROISummaryIrHeader':
          return RoiSummaryIrHeader
        default:
          break
      }
    },
    handleDeleteShadows() {
      document.querySelectorAll('.smartwidget').forEach((item) => {
        item.style.boxShadow = 'none'
        item.style.backgroundColor = 'transparent'
        item.style.border = 'none'
        item.setAttribute('title', '')
      })
      document.querySelectorAll('.vue-grid-item').forEach((item) => {
        item.setAttribute('title', '')
      })
    },
    handleAddShadows() {
      document.querySelectorAll('.smartwidget').forEach((item) => {
        item.style.boxShadow = ''
        item.style.backgroundColor = ''
        item.style.border = ''
        item.setAttribute('title', '')
      })
      document.querySelectorAll('.vue-grid-item').forEach((item) => {
        item.setAttribute('title', '')
      })
    },
    getDefaultLayoutObject() {
      const widgets = [
        {
          x: 3,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: '0.4439548718965418',
          key: 'IncidentAnalysisIrHeader',
          title: 'Incident Analysis Ir Header'
        },
        {
          x: 9,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: '0.8129690089605317',
          key: 'ROISummaryIrHeader',
          title: 'ROI Summary Ir Header'
        },
        {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: '0.36222415873736824',
          key: 'PhishingReporterIrHeader',
          title: 'Phishing Reporter Ir Header'
        },
        {
          x: 6,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: '0.955736738495951',
          key: 'InvestigationsIrHeader',
          title: 'Investigations Ir Header'
        },
        {
          x: 0,
          y: 3,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.9531283031364617',
          key: 'IncidentClusters',
          title: 'Incident Clusters'
        },
        {
          x: 6,
          y: 3,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.5602556581402198',
          key: 'ReportedEmailTrends',
          title: 'Reported Email Trends'
        },
        {
          x: 0,
          y: 9,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.30768881243195656',
          title: 'Recent Investigations',
          key: 'RecentInvestigations'
        },
        {
          x: 6,
          y: 9,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.1349604029153395',
          key: 'TopPosts',
          title: 'Top Posts'
        },
        {
          x: 0,
          y: 15,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.6104982760663944',
          title: 'Recently Reported Incidents',
          key: 'RecentlyReportedIncidents'
        },
        {
          x: 6,
          y: 15,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.15876452855409506',
          title: 'Recently Posted Threats',
          key: 'RecentlyPostedThreats'
        },
        {
          x: 0,
          y: 21,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.3901775633662319',
          key: 'Reporters',
          title: 'Reporters'
        },
        {
          x: 6,
          y: 21,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.8761474288298772',
          key: 'TopRules',
          title: 'Top Rules'
        }
      ]
      for (let widget of widgets) {
        this.removeAvailableWidget(widget)
      }

      return widgets
    },
    callForPostWidgets() {
      const payload = this.layout.reduce(
        (acc, widget) => {
          const { settings } = acc
          const { x, y, w, h, title, key } = widget
          settings.push({ x, y, w, h, title, key })
          return acc
        },
        { settings: [] }
      )
      postWidgets(payload)
    },
    callForGetWidgets() {
      return getWidgets()
        .then((response) => {
          return response.data.data || []
        })
        .catch(() => {
          return []
        })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    }
  },
  created() {
    if (this.checkPermissions('dashboard/widgets', 'GET')) {
      this.callForGetWidgets()
        .then((response) => {
          if (response.settings.length) {
            this.layout = response.settings.reduce((acc, item) => {
              const widget = { ...this.allWidgets[item.key], ...item }
              this.removeAvailableWidget(item)
              acc.push(widget)
              return acc
            }, [])

            this.newItemY = this.layout.reduce((acc, item) => {
              return (acc += item.h)
            }, 0)
            setTimeout(() => {
              this.handleDeleteShadows()
              this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
            }, 20)
          }
        })
        .catch(() => {
          this.layout = this.getDefaultLayoutObject()
          setTimeout(() => {
            this.handleDeleteShadows()
            this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
          }, 20)
        })
    }
  },
  mounted() {},
  watch: {
    editMode(val) {
      if (!val) {
        this.handleDeleteShadows()
        this.callForPostWidgets()
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
  border-radius: 12px;
  .incident-responder-parent .columns-row .dashboard-cards .card-body .body-row__text {
    white-space: nowrap;
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
  margin-right: -10px;
}
.widget-header__title {
  padding-left: 12px !important;
  font-weight: 600 !important;
  color: #2196f3;
  display: flex !important;
  align-items: center;
}
[title] {
  content: none;
}
</style>
