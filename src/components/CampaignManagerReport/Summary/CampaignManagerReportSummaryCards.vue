<template>
  <div id="campaign-manager-report-summary-cards" class="campaign-manager-report-summary-cards">
    <div class="campaign-manager-report-summary-cards__left">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getNoResponseData"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#E6A23C"
        :title="labels.OpenedEmail"
        :is-loading="isLoading"
        :icon-src="openedEmailIcon"
      />
    </div>
    <div class="campaign-manager-report-summary-cards__right">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getClickedData"
        background-color="#F56C6C"
        :title="labels.ClickedLink"
        :is-loading="isLoading"
        :icon-src="clickedLinkIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getSubmittedData"
        class="campaign-manager-report-summary-info-card--submitted-data"
        background-color="#B83A3A"
        :title="labels.SubmittedData"
        :is-loading="isLoading"
      >
        <template #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
          </div>
        </template>
      </CampaignManagerReportSummaryInfoCard>
    </div>
  </div>
</template>

<script>
import CampaignManagerReportSummaryInfoCard from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryInfoCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryCards',
  components: { CampaignManagerReportSummaryInfoCard },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      openedEmailIcon: require('../../../assets/img/ic-opened-email.svg'),
      noResponseIcon: require('../../../assets/img/ic-check-box.svg'),
      clickedLinkIcon: require('../../../assets/img/ic-exclude.svg'),
      submittedDataIcon: require('../../../assets/img/enhanced_encryption.png')
    }
  },
  computed: {
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ? noResponse : {}
    },
    getOpenedData() {
      const { openedEmail } = this.items
      return openedEmail ? openedEmail : {}
    },
    getSubmittedData() {
      const { submittedEmail } = this.items
      return submittedEmail ? submittedEmail : {}
    },
    getClickedData() {
      const { clickedEmail } = this.items
      return clickedEmail ? clickedEmail : {}
    }
  },
  created() {
    window.addEventListener('resize', this.addQuery)
  },
  mounted() {
    this.addQuery()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.addQuery)
  },
  methods: {
    addQuery() {
      const navigatorWidth = document.querySelector('nav.page-nav').style.width
      const width = window.innerWidth - Number(navigatorWidth.slice(0, -2))
      console.log('width', width)
      if (width < 1200 && width > 700) {
        document.querySelector(
          '.campaign-manager-report-summary-cards__right'
        ).style.flexDirection = 'row'
        document.querySelector('.campaign-manager-report-summary-cards__left').style.flexDirection =
          'row'
        document.querySelector('.campaign-manager-report-summary-cards__right').style.marginLeft =
          '0'
        document
          .querySelectorAll(
            '.campaign-manager-report-summary-cards .campaign-manager-report-summary-info-card'
          )
          .forEach((item, index) => {
            switch (index) {
              case 1:
                item.style.marginLeft = '16px'
                break
              case 2:
                item.style.marginLeft = '0'
                break
              case 3:
                item.style.marginLeft = '16px'
            }
          })

        document.querySelector('.campaign-manager-report-summary-cards').style = 'flex-wrap:wrap;'
      } else if (width < 700) {
        document.querySelector('.campaign-manager-report-summary-cards').style = 'flex-wrap:wrap;'
        document.querySelector(
          '.campaign-manager-report-summary-cards__right'
        ).style.flexDirection = 'column'
        document.querySelector('.campaign-manager-report-summary-cards__left').style.flexDirection =
          'column'
        document.querySelector('.campaign-manager-report-summary-cards__right').style.marginLeft =
          '0'
        document
          .querySelectorAll(
            '.campaign-manager-report-summary-cards .campaign-manager-report-summary-info-card'
          )
          .forEach((item, index) => {
            item.style.marginLeft = '0'
          })
      } else {
        document.querySelector(
          '.campaign-manager-report-summary-cards__right'
        ).style.flexDirection = 'row'
        document.querySelector('.campaign-manager-report-summary-cards__left').style.flexDirection =
          'row'
        document.querySelector('.campaign-manager-report-summary-cards__right').style.marginLeft =
          '16px'
        document
          .querySelectorAll(
            '.campaign-manager-report-summary-cards .campaign-manager-report-summary-info-card'
          )
          .forEach((item, index) => {
            if (index === 2) {
              item.style.marginLeft = '16px'
            }
            item.style.width = 'calc(24%) !important'
            item.style.maxWidth = 'calc(24%) !important'
          })
        const columnsRowContainer = document.querySelector('.campaign-manager-report-summary-cards')
        if (columnsRowContainer)
          document.querySelector('.campaign-manager-report-summary-cards').style = ''
      }
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-cards {
  display: flex;
  &__left {
    display: flex;
    .campaign-manager-report-summary-info-card:last-child {
      margin-left: 16px;
    }
    @media (min-width: 1201px) {
      flex-basis: 50%;
    }
    .campaign-manager-report-summary-info-card {
      flex-basis: 50%;
    }
  }
  &__right {
    display: flex;
    margin-left: 16px;
    & > div:last-child {
      margin-left: 16px;
    }
    @media (min-width: 1201px) {
      flex-basis: 50%;
    }
    .campaign-manager-report-summary-info-card {
      flex-basis: 50%;
    }
  }
  .campaign-manager-report-summary-info-card {
    margin-top: 24px;
    margin-left: 16px;

    &:first-child {
      margin-left: 0 !important;
      .campaign-manager-report-summary-info-card-body__icon {
        right: -10px;
        bottom: -12px;
        img {
          max-height: 80px;
          max-width: 80px;
        }
      }
    }
    &:nth-child(3) {
      @media (max-width: 1024px) {
        margin-left: 0;
      }
      margin-right: 16px;
    }

    &--submitted-data {
      &-icon {
        background-color: #ffffff;
        mix-blend-mode: normal;
        opacity: 0.3;
        border-radius: 6px;
        height: 64px;
        width: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .campaign-manager-report-summary-info-card-body__icon {
        bottom: 4px;
      }
    }
  }
}
</style>
