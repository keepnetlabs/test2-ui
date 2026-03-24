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
          'no-data__opacity-blue': isPhishingEmpty(phishingReporterUserStatusCount)
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
        <div class="columns-row__body" v-if="!isPhishingEmpty(phishingReporterUserStatusCount)">
          <div class="card-body">
            <div class="biggest" id="card--incident-responder-phishing-reporter-online-users-count">
              {{
                (phishingReporterUserStatusCount &&
                  phishingReporterUserStatusCount.onlineUsersCount) ||
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
              (phishingReporterUserStatusCount &&
                phishingReporterUserStatusCount.onlineUsersCount +
                  phishingReporterUserStatusCount.offlineUsersCount) ||
              0
            }}
            user(s) are
          </div>
          <div class="card-status">{{ labels.Online }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            Add-in isn’t installed at any users’ account
          </div>
        </div>
        <div
          class="bg-image"
          style="bottom: 10px; right: -11px;"
          :style="[isPhishingEmpty(phishingReporterUserStatusCount) && { opacity: 0.4 }]"
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
      labels
    }
  },
  computed: {
    ...mapGetters({
      phishingReporterUserStatusCount: 'widgets/getPhishingReporterCard',
      isLoading: 'widgets/getIsLoading'
    })
  },
  methods: {
    isPhishingEmpty(phishingReporterUserStatusCount) {
      if (phishingReporterUserStatusCount) {
        return !(
          phishingReporterUserStatusCount['onlineUsersCount'] ||
          phishingReporterUserStatusCount['offlineUsersCount']
        )
      }
      return true
    },
    emptyPhishingButtonClick() {
      this.$router.push('/phishing-reporter')
    }
  }
}
</script>
