<template>
  <VNavigationDrawer
    v-click-outside="handleDrawerClickOutside"
    :value="navigationDrawerValue"
    class="k-navigation-drawer"
    temporary
    fixed
    stateless
    overlay-color="rgba(0, 0, 0, 0.17)"
    overlay-opacity="1"
    right
    width="calc(100% - 72px)"
    height="100%"
    @input="$emit('navigation-drawer-change', $event)"
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
                >Overview of phishing scenarios available on the platform
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </div>
        <div>
          <VIcon
            class="cursor-pointer"
            color="#757575"
            @click="$emit('navigation-drawer-change', false)"
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
            :is-loading="isLoading"
            :resizable="false"
            :edit-mode="false"
            :data="getComponentData(item.key)"
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
import CampaignManagerStatisticsAttackType from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsAttackType.vue'
import CampaignManagerStatisticsIndustry from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsIndustry.vue'
import { getCampaignScenarioStatistics } from '@/api/phishingsimulator'

export default {
  name: 'CampaignManagerScenarioStatisticsModal',
  components: { KSmartGrid },
  props: {
    navigationDrawerValue: {
      type: Boolean,
      default: false
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: true,
      activeBreakpoint: 'lg',
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
          title: 'Industry',
          key: 'StatisticsIndustryWidget',
          isAllowed: true,
          parentKey: 'Number of phishing templates by industry',
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
          x: 0,
          y: 12,
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
          x: 6,
          y: 12,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Attack Type',
          key: 'StatisticsAttackTypeWidget',
          isAllowed: true,
          parentKey: 'Number of phishing templates by attack type',
          chartType: 'pie',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          resourceId: 'fSy5K85rhGCD'
        }
      ],
      data: {
        brand: [],
        industry: [],
        attackType: [],
        region: [],
        emotion: [],
        language: []
      },
      colNum: 12
    }
  },
  created() {
    this.callForData()
    if (document.querySelector('.page-nav__fixed-content'))
      document.querySelector('.page-nav__fixed-content').style.background = 'transparent'
    if (document.querySelector('.user-wrapper'))
      document.querySelector('.user-wrapper').style.background = 'transparent'
    if (document.querySelector('.user-name-dropdown'))
      document.querySelector('.user-name-dropdown').style.background = 'transparent'
    if (document.querySelector('html')) document.querySelector('html').style.overflowY = 'hidden'
    setTimeout(() => {
      this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
    }, 100)
  },
  beforeDestroy() {
    setTimeout(() => {
      if (document.querySelector('.page-nav__fixed-content'))
        document.querySelector('.page-nav__fixed-content').style.background = ''
      if (document.querySelector('.user-wrapper'))
        document.querySelector('.user-wrapper').style.background = ''
      if (document.querySelector('.user-name-dropdown'))
        document.querySelector('.user-name-dropdown').style.background = ''
      if (document.querySelector('html')) document.querySelector('html').style.overflowY = 'auto'
    }, 250)
  },
  methods: {
    callForData() {
      this.isLoading = true
      getCampaignScenarioStatistics()
        .then((response) => {
          const {
            data: { data }
          } = response || { data: {} }
          const { brand, industry, region, emotion, language, attackType } = data
          this.data = {
            brand: this.transformStatisticData(brand),
            industry: this.transformStatisticData(industry),
            region: this.transformStatisticData(region),
            emotion: this.transformStatisticData(emotion),
            language: this.transformStatisticData(
              language.map((item) => ({
                ...item,
                name:
                  this?.languages?.find((lang) => lang.languageName === item.name)?.text ||
                  item.name
              }))
            ),
            attackType: this.transformStatisticData(attackType)
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    transformStatisticData(data) {
      const unknownDataIndex = data.findIndex((item) => item.name.toLocaleLowerCase() === 'unknown')
      const naDataIndex = data.findIndex((item) => item.name.toLocaleLowerCase() === 'n/a')
      let unknownData, naData
      if (unknownDataIndex !== -1) {
        unknownData = data[unknownDataIndex]
        data.splice(unknownDataIndex, 1)
      }
      if (naDataIndex !== -1) {
        naData = data[naDataIndex]
        data.splice(naDataIndex, 1)
      }
      data.sort((a, b) => (a.percentage > b.percentage ? -1 : 1))
      const totalExcludedData = {
        count: (Number.parseInt(naData?.count) || 0) + (Number.parseInt(unknownData?.count) || 0),
        percentage: (Number.parseInt(naData?.percentage) || 0) + (Number.parseInt(unknownData?.percentage) || 0)
      }
      const firstData = data.slice(0, 5)
      const otherData = data.slice(5)
      const firstDataTotal = firstData.reduce(
        (a, b) => {
          return {
            ...a,
            count: a.count + b.count,
            percentage: a.percentage + b.percentage
          }
        },
        {
          count: 0,
          name: 'Other',
          percentage: 0
        }
      )
      const totalOtherData = otherData.reduce(
        (a, b) => {
          return {
            ...a,
            count: a.count + b.count,
            percentage: a.percentage + b.percentage
          }
        },
        {
          count: totalExcludedData.count || 0,
          name: 'Other',
          percentage: totalExcludedData.percentage || 0
        }
      )
      totalOtherData.percentage = (100 - firstDataTotal.percentage).toFixed(2)
      if (totalOtherData?.percentage?.includes('.00'))
        totalOtherData.percentage = totalOtherData.percentage.replace('.00', '')
      if (data.length <= 5 && !totalOtherData.count) return firstData
      return [...firstData, totalOtherData]
    },
    handleDrawerClickOutside() {
      this.$emit('navigation-drawer-change', false)
    },
    breakpointChanged({ newBreakpoint }) {
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
        case 'StatisticsAttackTypeWidget':
          return CampaignManagerStatisticsAttackType
        case 'StatisticsIndustryWidget':
          return CampaignManagerStatisticsIndustry
        default:
          return CampaignManagerStatisticsRegion
      }
    },
    getComponentData(componentString) {
      switch (componentString) {
        case 'StatisticsRegionWidget':
          return this.data.region
        case 'StatisticsLanguageWidget':
          return this.data.language
        case 'StatisticsEmotionalTriggerWidget':
          return this.data.emotion
        case 'StatisticsBrandWidget':
          return this.data.brand
        case 'StatisticsAttackTypeWidget':
          return this.data.attackType
        case 'StatisticsIndustryWidget':
          return this.data.industry
        default:
          return this.data.industry
      }
    },
    getBdCol() {
      return 12
    }
  }
}
</script>
