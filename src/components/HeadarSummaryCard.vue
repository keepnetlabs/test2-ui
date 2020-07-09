<template>
  <div class="header-summary-card">
    <div class="header-summary-card__stats">
      <div class="header-summary-card__stats-cards">
        <div class="header-summary-card__stats-card">
          <div class="header-summary-card__stats-card-left">
            <div
              class="header-summary-card__stats-card-left__icon"
              style="background-color: #00bcd4;"
            >
              <v-icon color="white" left medium>mdi-account</v-icon>
            </div>
          </div>
          <div class="header-summary-card__stats-card-right">
            <h3 class="header-summary-card__stats-card-right__title" style="color: #00bcd4;">
              {{ (phishingReportSummary && phishingReportSummary.onlineUsersCount) || 0 }}
            </h3>
            <p class="header-summary-card__stats-card-right__stats">
              Online Users
            </p>
          </div>
        </div>
      </div>
      <div class="header-summary-card__stats-cards">
        <div class="header-summary-card__stats-card">
          <div class="header-summary-card__stats-card-left">
            <div
              class="header-summary-card__stats-card-left__icon"
              style="background-color: #2196f3;"
            >
              <v-icon color="white" left medium>mdi-puzzle</v-icon>
            </div>
          </div>
          <div class="header-summary-card__stats-card-right">
            <h3 class="header-summary-card__stats-card-right__title" style="color: #2196f3;">
              {{ getAddOnStatus }}
            </h3>
            <p class="header-summary-card__stats-card-right__stats">
              Users have the add-on
            </p>
          </div>
        </div>
      </div>
      <div class="header-summary-card__stats-cards">
        <div class="header-summary-card__stats-card">
          <div class="header-summary-card__stats-card-left">
            <div
              class="header-summary-card__stats-card-left__icon"
              style="background-color: #f56c6c;"
            >
              <v-icon color="white" left medium>mdi-account-outline</v-icon>
            </div>
          </div>
          <div class="header-summary-card__stats-card-right">
            <h3 class="header-summary-card__stats-card-right__title" style="color: #f56c6c;">
              {{ (phishingReportSummary && phishingReportSummary.offlineUsersCount) || 0 }}
            </h3>
            <p class="header-summary-card__stats-card-right__stats">
              Users Stayed Offline
            </p>
          </div>
        </div>
      </div>
      <div class="header-summary-card__stats-cards">
        <div class="header-summary-card__stats-card">
          <div class="header-summary-card__stats-card-left">
            <div
              class="header-summary-card__stats-card-left__icon"
              style="background-color: #2196f3;"
            >
              <img src="../assets/img/account-tree.png" />
            </div>
          </div>
          <div class="header-summary-card__stats-card-right">
            <h3 class="header-summary-card__stats-card-right__title" style="color: #2196f3;">
              {{ (phishingReportSummary && phishingReportSummary.addInVersion) || 0 }}
            </h3>
            <p class="header-summary-card__stats-card-right__stats">
              Latest Release
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="header-summary-card__panel">
      <v-menu bottom offset-y min-width="133">
        <template v-slot:activator="{ on }">
          <div v-on="on" class="header-summary-card__panel-right-col">
            <div class="header-summary-card__panel-text">{{ selectedDate }}</div>
            <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-list>
          <v-list-item @click="handleListItemClick(item)" :key="item" v-for="item in listItems">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadarSummaryCard'
}
</script>

<style lang="scss">
.header-summary-card__header {
  padding: 10px 16px 16px 16px;
  &__container {
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #ffffff;

    &__panel {
      margin: 0 37px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      padding: 14px 0 27px 0;
      align-items: center;

      &-right-col {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding-left: 10px;
      }
      &-text {
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        letter-spacing: normal;
        color: #000000;
      }
    }

    &__stats {
      padding: 24px 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row;
      flex-flow: row;
      border-bottom: 2px solid #e4e7ed;
      margin: 0 28px;

      @media (max-width: 768px) {
        flex-direction: column;
      }

      &-cards {
        display: flex;
        flex-basis: 30%;
        flex-grow: 0;

        @media (max-width: 768px) {
          margin-bottom: 10px;
        }

        &:last-child {
          flex-basis: 12%;
        }

        &__card {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;

          &-left {
            &__icon {
              width: 50px;
              height: 50px;
              align-items: center;
              justify-content: center;
              display: flex;
              box-shadow: 0 2px 5px 0 rgba(112, 177, 115, 0.5);
              border-radius: 30px;
              margin-right: 8px;

              &.bg-green {
                background: #43a047;
              }

              &.bg-turquoise {
                background-color: #00bcd4;
              }

              &.bg-blue {
                background-color: #2196f3;
              }

              &.bg-salmon {
                background-color: #f56c6c;
              }

              &.bg-macaroni {
                background-color: #e6a23c;
              }

              i {
                margin-right: 0 !important;
              }
            }
          }

          &-right {
            &__title {
              font-family: 'Open Sans', sans-serif;
              font-size: 20px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.15;
              letter-spacing: normal;
              color: #2196f3;
              margin-bottom: 5px;
            }

            &__stats {
              margin-bottom: 0 !important;
              font-family: 'Open Sans', sans-serif;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
              max-width: 250px;
            }
          }
        }
      }
    }
  }
}
</style>
