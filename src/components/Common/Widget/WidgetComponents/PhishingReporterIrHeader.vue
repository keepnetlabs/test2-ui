<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        id="card--incident-responder-phishing-reporter"
        class="dashboard-cards phishing-reporter"
        :class="{
          'no-data__opacity-blue': isPhishingEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">{{ labels.PhishingReporter }}</span>
          <router-link to="/phishing-reporter" id="btn-link--dashboard-to-phishing-reporter">
            <v-icon style="opacity: 0.8;" :color="'white'">mdi-open-in-new</v-icon>
          </router-link>
          <v-icon
            v-if="editMode"
            id="btn-close--dashboard-widgets-phishing-reporter-card"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </div>
        <div class="columns-row__body" v-if="!isPhishingEmpty(irSummary)">
          <div class="card-body">
            <div class="biggest" id="card--incident-responder-phishing-reporter-online-users-count">
              {{
                (irSummary &&
                  irSummary.phishingReporterUserStatusCount &&
                  irSummary.phishingReporterUserStatusCount.onlineUsersCount) ||
                0
              }}
            </div>
          </div>
          <div
            class="card-footer"
            id="card--incident-responder-phishing-reporter-total-users-count"
          >
            of
            {{
              (irSummary &&
                irSummary.phishingReporterUserStatusCount &&
                irSummary.phishingReporterUserStatusCount.onlineUsersCount +
                  irSummary.phishingReporterUserStatusCount.offlineUsersCount) ||
              0
            }}
            user(s) are
          </div>
          <div class="card-status">{{ labels.CurrentlyOnline }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            Add-in isn’t installed at any users’ account, yet
          </div>
        </div>
        <div
          class="bg-image"
          style="bottom: 10px; right: -11px;"
          :style="[isPhishingEmpty(irSummary) && { opacity: 0.4 }]"
        >
          <img src="../../../../assets/img/ph-crone.svg" alt="link" />
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import { mapGetters } from 'vuex'
import labels from '@/model/constants/labels'
export default {
  name: 'PhishingReporterIrHeader',
  components: {
    CardLoading
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
      labels
    }
  },
  data() {
    return {
      isLoading: true,
      labels
    }
  },
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      irSummary: 'investigations/irSummaryGetter' // for using getters
    })
  },
  methods: {
    isPhishingEmpty(data) {
      if (data && !data['phishingReporterUserStatusCount']) {
        return true
      } else
        return !(
          data &&
          data['phishingReporterUserStatusCount'] &&
          (data['phishingReporterUserStatusCount']['onlineUsersCount'] ||
            data['phishingReporterUserStatusCount']['offlineUsersCount'])
        )
    },
    emptyPhishingButtonClick() {
      this.$router.push('/phishing-reporter')
    }
  },
  created() {
    this.$store
      .dispatch('investigations/getIrSummary')
      .then(() => {
        this.isLoading = false
      })
      .catch(() => {
        this.isLoading = false
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
.dashboard-cards {
  min-height: 170px;
  max-height: 170px;
  border-radius: 8px;
  padding: 16px;

  &.investigations {
    padding: 16px 16px 16px 16px;
  }
  .card-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    .head {
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a {
      text-decoration: none;
    }
  }

  .card-body {
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: normal;
    color: #fff;
    .biggest {
      font-size: 44px;
      line-height: 1;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
    }
    .body-row {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      &__number {
        font-size: 44px;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
      }
      &__text {
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 1;
        white-space: nowrap;
      }
    }
  }

  .card-footer {
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    color: #fff;
    opacity: 1;
    line-height: 1.15;
    letter-spacing: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.no-data-text {
      font-size: 16px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      opacity: 0.7;
      color: #fff;
      margin-top: 62px;
      max-width: 85%;
      white-space: normal !important;
    }
  }

  .card-status {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    color: #fff;
    bottom: 16px;
    position: absolute;
  }

  &.phishing-reporter {
    background-color: #2196f3 !important;
  }

  &.no-data__opacity-blue {
    background-color: #5c7f9b !important;
  }

  &.no-data__opacity-red {
    background-color: #9b7879 !important;
  }

  &.no-data__opacity-purple {
    background-color: #7b6c81;
  }
  &.no-data__opacity-green {
    background-color: #668267 !important;
  }
  .columns-row__body {
    margin-top: 16px;
  }
  .btn-playbook__no-data {
    border-radius: 18px;
    background-color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    height: 36px;
  }
}
.widget-card-loading {
  width: 100%;
}
.bg-image {
  position: absolute;
  right: -15px;
  bottom: 0;
}
</style>
