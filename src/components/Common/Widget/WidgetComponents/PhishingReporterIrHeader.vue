<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        class="dashboard-cards phishing-reporter"
        :class="{
          'no-data__opacity-blue': isPhishingEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">Phishing Reporter</span>
          <router-link to="/phishing-reporter">
            <v-icon :color="'white'">mdi-open-in-new</v-icon>
          </router-link>
          <v-icon
            v-if="editMode"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </div>
        <div class="columns-row__body" v-if="!isPhishingEmpty(irSummary)">
          <div class="card-body">
            <div class="biggest">
              {{
                (irSummary &&
                  irSummary.phishingReporterUserStatusCount &&
                  irSummary.phishingReporterUserStatusCount.onlineUsersCount) ||
                0
              }}
            </div>
          </div>
          <div class="card-footer">
            of
            {{
              (irSummary &&
                irSummary.phishingReporterUserStatusCount &&
                irSummary.phishingReporterUserStatusCount.onlineUsersCount +
                  irSummary.phishingReporterUserStatusCount.offlineUsersCount) ||
              0
            }}
            users are
          </div>
          <div class="card-status">Currently Online</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            No add-ins installed
          </div>
          <v-btn
            class="btn-action btn-playbook btn-playbook__no-data"
            rounded
            color="white"
            style="box-shadow: none !important; margin-top: 16px;"
            @click="emptyPhishingButtonClick"
          >
            Install Now
          </v-btn>
        </div>
        <div
          class="bg-image"
          style="bottom: 10px; right: 0;"
          :style="[isPhishingEmpty(irSummary) && { opacity: 0.4 }]"
        >
          <img src="../../../../assets/img/shape.svg" alt="link" />
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import { mapGetters } from 'vuex'
export default {
  name: 'PhishingReporterIrHeader',
  components: {
    CardLoading
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: true
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
  padding-right: 24px;
  position: relative;
  &.investigations {
    padding: 16px 24px 16px 16px;
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
      font-size: 48px;
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
        font-size: 48px;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
      }
      &__text {
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 0.7;
        white-space: nowrap;
      }
    }
  }

  .card-footer {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.no-data-text {
      font-size: 20px;
      line-height: 1.25;
      letter-spacing: normal;
      color: #ffffff;
      margin-top: 36px;
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
    background-image: linear-gradient(to bottom, #5bcffd, #2196f3);
  }

  &.no-data__opacity-blue {
    background-image: linear-gradient(to bottom, #3c768e, #25608a) !important;
  }

  &.no-data__opacity-red {
    background-image: linear-gradient(to bottom, #895f5f, #8a4646) !important;
  }

  &.no-data__opacity-purple {
    background-image: linear-gradient(to bottom, #b27fc2, #66257a 96%);
  }
  &.no-data__opacity-green {
    background-image: linear-gradient(to bottom, #268a50, #265229) !important;
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
