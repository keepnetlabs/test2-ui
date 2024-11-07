<template>
  <VNavigationDrawer
    :value="value"
    class="k-navigation-drawer"
    temporary
    fixed
    overlay-color="rgba(0, 0, 0, 0.17)"
    overlay-opacity="1"
    right
    width="calc(100% - 72px)"
    height="100%"
    @input="$emit('input', $event)"
  >
    <div class="campaign-manager-scenario-statistics-modal__header--sticky">
      <div class="campaign-manager-scenario-statistics-modal__header">
        <div>
          <VListItem class="">
            <div class="v-btn v-cart-icon-wrapper">
              <VIcon color="#2196F3">mdi-chart-bar</VIcon>
            </div>
            <VListItemContent>
              <VListItemTitle class="k-overlay__title">
                Scenario Statistics
              </VListItemTitle>
              <VListItemSubtitle
                >Statistics for phishing scenarios available on the platform
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </div>
        <div>
          <VIcon class="cursor-pointer" color="#757575" @click="$emit('input', false)"
            >mdi-close</VIcon
          >
        </div>
      </div>
    </div>
    <div class="campaign-manager-scenario-statistics-modal__body">
      <k-smart-grid
        class="executive-report-grid"
        ref="refGrid"
        :cols="{ lg: 12, sm: 12, xs: 12, xxs: 2 }"
        :layout="layout"
        :col-num="colNum"
        :is-static="true"
        :row-height="50"
        @breakpointChanged="breakpointChanged"
      >
        <smart-widget
          v-for="(item, index) in layout"
          :key="item.i + index"
          :slot="item.i"
          :padding="[0, 0]"
          :ref="`ref${item.i}`"
          :shadow="'never'"
          :simple="true"
        >
          <component
            :id="item.key"
            :is="getComponent(item.key, item.name, item)"
            :resizable="false"
            :edit-mode="false"
            :card="item"
          />
        </smart-widget>
      </k-smart-grid>
    </div>
  </VNavigationDrawer>
</template>
<script>
import KSmartGrid from '@/components/Common/Widget/KSmartGrid.vue'
import CampaignManagerStatisticsRegion from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsRegion'
import { createRandomCryptStringNumber, getTimeZoneForMoment } from '@/utils/functions'
import CampaignManagerStatisticsLanguage from './CampaignManagerStatistics/CampaignManagerStatisticsLanguage.vue'
import CampaignManagerStatisticsEmotionalTrigger from './CampaignManagerStatistics/CampaignManagerStatisticsEmotionalTrigger.vue'
import CampaignManagerStatisticsBrand from './CampaignManagerStatistics/CampaignManagerStatisticsBrand.vue'

export default {
  name: 'CampaignManagerScenarioStatisticsModal',
  components: { KSmartGrid },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layout: [
        {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Region',
          subtitle: 'Number of phishing templates by region',
          key: 'StatisticsRegionWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          resourceId: 'cwyB7gFFBGpl'
        },
        {
          x: 6,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Language',
          subtitle: 'Number of phishing templates by language',
          key: 'StatisticsLanguageWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          resourceId: 'cwyB7gFFBGpl'
        },
        {
          x: 0,
          y: 6,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Emotional Trigger',
          subtitle: 'Number of phishing templates by emotional trigger',
          key: 'StatisticsEmotionalTriggerWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          resourceId: 'cwyB7gFFBGpl'
        },
        {
          x: 6,
          y: 6,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Brand',
          subtitle: 'Number of phishing templates by brand',
          key: 'StatisticsBrandWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          resourceId: 'cwyB7gFFBGpl'
        }
      ],
      colNum: 12
    }
  },
  created() {
    document.querySelector('.page-nav__fixed-content').style.background = 'transparent'
    document.querySelector('.user-wrapper').style.background = 'transparent'
    document.querySelector('.user-name-dropdown').style.background = 'transparent'
    document.querySelector('html').style.overflowY = 'hidden'
  },
  beforeDestroy() {
    document.querySelector('.page-nav__fixed-content').style.background = ''
    document.querySelector('.user-wrapper').style.background = ''
    document.querySelector('.user-name-dropdown').style.background = ''
    document.querySelector('html').style.overflowY = 'auto'
  },
  methods: {
    breakpointChanged({ newBreakpoint }) {
      return 12
      this.activeBreakpoint = newBreakpoint
      const bdCol = this.getBdCol(newBreakpoint)
      if (bdCol > 2) return
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
    getComponent(componentString) {
      switch (componentString) {
        case 'StatisticsRegionWidget':
          return CampaignManagerStatisticsRegion
        case 'StatisticsLanguageWidget':
          return CampaignManagerStatisticsLanguage
        case 'StatisticsEmotionalTriggerWidget':
          return CampaignManagerStatisticsEmotionalTrigger
        case 'StatisticsBrandWidget':
          return CampaignManagerStatisticsBrand
        default:
          return CampaignManagerStatisticsRegion
      }
    },
    getBdCol(newBreakpoint = '') {
      if (newBreakpoint === 'xs') return 12
      return newBreakpoint === 'xxs' ? 2 : 12
    }
  }
}
</script>
