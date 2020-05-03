<template>
  <div id="phishing-reporter" class="page-wrapper">
    <div class="investigation-details__container__stats">
      <div class="investigation-details__container__stats__cards">
        <div class="investigation-details__container__stats__cards__card">
          <div class="investigation-details__container__stats__cards__card-left">
            <div
              class="investigation-details__container__stats__cards__card-left__icon"
            >
              <v-icon medium left color="white">{{statusIcon}}</v-icon>
            </div>
          </div>
          <div class="investigation-details__container__stats__cards__card-right">
            <h3
              class="investigation-details__container__stats__cards__card-right__title"
            >500</h3>
            <p class="investigation-details__container__stats__cards__card-right__stats">
              <v-tooltip
                v-if="this.statsAndMenuData.status == 'Running' && this.statsAndMenuData.estimatedTime"
                bottom
                opacity="1"
                max-width="230"
              >
                <template v-slot:activator="{ on }">
                  <div v-on="on">{{statsAndMenuData.estimatedTime}} remaining</div>
                </template>
            <p
              class="tooltip-wrapper"
            >Actual remaining time may be different from estimated time and is depended on
              conditions such as online user count, mailbox size, etc.</p>
            </v-tooltip>
            <span v-else>{{getStatusText('statusTime', null)}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="investigation-details__container__stats__cards">
        <div class="investigation-details__container__stats__cards__card">
          <div class="investigation-details__container__stats__cards__card-left">
            <div
              class="investigation-details__container__stats__cards__card-left__icon"
              :class="statsAndMenuData.status == 'Running' ? 'bg-turquoise' : (statsAndMenuData.status == 'Finished' ? 'bg-turquoise' : (statsAndMenuData.status == 'Expired' ? 'bg-macaroni' : 'bg-macaroni'))"
            >
              <v-icon medium left color="white">mdi-account</v-icon>
            </div>
          </div>
          <div class="investigation-details__container__stats__cards__card-right">
            <h3
              class="investigation-details__container__stats__cards__card-right__title"
            >{{getStatusText('notScannedUserCount', statsAndMenuData.notScannedUserCount)}}</h3>
            <p
              class="investigation-details__container__stats__cards__card-right__stats"
            >{{getStatusText('totalUserCount', statsAndMenuData.totalUserCount)}}</p>
          </div>
        </div>
      </div>
      <div class="investigation-details__container__stats__cards">
        <div class="investigation-details__container__stats__cards__card">
          <div class="investigation-details__container__stats__cards__card-left">
            <div class="investigation-details__container__stats__cards__card-left__icon bg-green">
              <v-icon medium left color="white">mdi-account-circle</v-icon>
            </div>
          </div>
          <div class="investigation-details__container__stats__cards__card-right">
            <h3
              class="investigation-details__container__stats__cards__card-right__title"
            >{{getStatusText('scannedUserCount', statsAndMenuData.scannedUserCount)}}</h3>
            <p
              class="investigation-details__container__stats__cards__card-right__stats"
            >{{getStatusText('totalUserCountScannedUser', statsAndMenuData.totalUserCount)}}</p>
          </div>
        </div>
      </div>
      <div class="investigation-details__container__stats__cards">
        <div class="investigation-details__container__stats__cards__card">
          <div class="investigation-details__container__stats__cards__card-left">
            <div class="investigation-details__container__stats__cards__card-left__icon bg-blue">
              <v-icon medium left color="white">mdi-email</v-icon>
            </div>
          </div>
          <div class="investigation-details__container__stats__cards__card-right">
            <h3
              class="investigation-details__container__stats__cards__card-right__title"
            >{{getStatusText('scannedEmailCount',statsAndMenuData.scannedEmailCount )}}</h3>
            <p
              class="investigation-details__container__stats__cards__card-right__stats"
            >{{getStatusText('totalEmailCount', statsAndMenuData.totalEmailCount)}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Phishing Reporter"
  }
</script>

<style scoped lang="scss">
  .page-wrapper {
    height: 100%;
    position: relative;
  }
</style>
