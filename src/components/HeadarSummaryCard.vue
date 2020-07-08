<template>
  <div class="phishing-reporter__header__container">
    <div class="phishing-reporter__header__container__stats">
      <div class="phishing-reporter__header__container__stats__cards">
        <div class="phishing-reporter__header__container__stats__cards__card">
          <div class="phishing-reporter__header__container__stats__cards__card-left">
            <div
              class="phishing-reporter__header__container__stats__cards__card-left__icon"
              style="background-color: #00bcd4;"
            >
              <v-icon color="white" left medium>mdi-account</v-icon>
            </div>
          </div>
          <div class="phishing-reporter__header__container__stats__cards__card-right">
            <h3
              class="phishing-reporter__header__container__stats__cards__card-right__title"
              style="color: #00bcd4;"
            >
              {{ (phishingReportSummary && phishingReportSummary.onlineUsersCount) || 0 }}
            </h3>
            <p class="phishing-reporter__header__container__stats__cards__card-right__stats">
              Online Users
            </p>
          </div>
        </div>
      </div>
      <div class="phishing-reporter__header__container__stats__cards">
        <div class="phishing-reporter__header__container__stats__cards__card">
          <div class="phishing-reporter__header__container__stats__cards__card-left">
            <div
              class="phishing-reporter__header__container__stats__cards__card-left__icon"
              style="background-color: #2196f3;"
            >
              <v-icon color="white" left medium>mdi-puzzle</v-icon>
            </div>
          </div>
          <div class="phishing-reporter__header__container__stats__cards__card-right">
            <h3
              class="phishing-reporter__header__container__stats__cards__card-right__title"
              style="color: #2196f3;"
            >
              {{ getAddOnStatus }}
            </h3>
            <p class="phishing-reporter__header__container__stats__cards__card-right__stats">
              Users have the add-on
            </p>
          </div>
        </div>
      </div>
      <div class="phishing-reporter__header__container__stats__cards">
        <div class="phishing-reporter__header__container__stats__cards__card">
          <div class="phishing-reporter__header__container__stats__cards__card-left">
            <div
              class="phishing-reporter__header__container__stats__cards__card-left__icon"
              style="background-color: #f56c6c;"
            >
              <v-icon color="white" left medium>mdi-account-outline</v-icon>
            </div>
          </div>
          <div class="phishing-reporter__header__container__stats__cards__card-right">
            <h3
              class="phishing-reporter__header__container__stats__cards__card-right__title"
              style="color: #f56c6c;"
            >
              {{ (phishingReportSummary && phishingReportSummary.offlineUsersCount) || 0 }}
            </h3>
            <p class="phishing-reporter__header__container__stats__cards__card-right__stats">
              Users Stayed Offline
            </p>
          </div>
        </div>
      </div>
      <div class="phishing-reporter__header__container__stats__cards">
        <div class="phishing-reporter__header__container__stats__cards__card">
          <div class="phishing-reporter__header__container__stats__cards__card-left">
            <div
              class="phishing-reporter__header__container__stats__cards__card-left__icon"
              style="background-color: #2196f3;"
            >
              <img src="../assets/img/account-tree.png" />
            </div>
          </div>
          <div class="phishing-reporter__header__container__stats__cards__card-right">
            <h3
              class="phishing-reporter__header__container__stats__cards__card-right__title"
              style="color: #2196f3;"
            >
              {{ (phishingReportSummary && phishingReportSummary.addInVersion) || 0 }}
            </h3>
            <p class="phishing-reporter__header__container__stats__cards__card-right__stats">
              Latest Release
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="phishing-reporter__header__container__panel">
      <v-menu bottom offset-y min-width="133">
        <template v-slot:activator="{ on }">
          <div v-on="on" class="phishing-reporter__header__container__panel-right-col">
            <div class="phishing-reporter__header__container__panel-text">{{ selectedDate }}</div>
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
.phishing-reporter__header {
  padding: 16px;
  padding-top: 10px;

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

      &__cards {
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

    &__content {
      display: flex;
      flex-flow: row;
      padding: 24px;

      &--left-menu {
        display: flex;
        flex-flow: column;
        min-width: 220px;
        margin-right: 16px;

        &--time {
          display: flex;
          flex-flow: column;

          &--labels {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
            margin-bottom: 4px;
          }

          &--progress {
            font-family: 'Open Sans', sans-serif;
            font-size: 10px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.9;
            letter-spacing: normal;
            text-align: center;
            color: rgba(0, 0, 0, 0.87);
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;

            &--bar {
              margin-bottom: 2px;

              .v-progress-linear {
                border-radius: 20px;
              }
            }
          }

          &--left-date {
            opacity: 0.64;
            font-family: 'Open Sans', sans-serif;
            font-size: 10px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.9;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }
        }

        &--mail-menu {
          .v-card {
            box-shadow: none !important;
            margin-top: 24px;

            .v-navigation-drawer {
              width: 100% !important;
              align-items: center;

              ::v-deep &__content {
                width: 100% !important;

                .v-list {
                  padding: 0 !important;
                }
              }

              .v-list {
                .v-divider {
                  padding: 0;
                }

                &-item {
                  &:first-child {
                    margin-top: 10px;
                    margin-bottom: 24px;
                  }

                  &__archived {
                    display: flex;
                    width: 100%;

                    &--main {
                      flex-flow: column;

                      .v-list-item-title__value {
                        top: 22px;
                      }
                    }

                    &--title {
                      font-family: 'Open Sans', sans-serif;
                      font-size: 12px;
                      font-weight: 600;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: normal;
                      letter-spacing: normal;
                      color: rgba(0, 0, 0, 0.87);
                      margin-bottom: 0;
                    }

                    &--link {
                      display: flex;
                      width: 100%;
                    }
                  }

                  position: relative;
                  font-family: 'Open Sans', sans-serif;
                  font-size: 14px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: normal;
                  letter-spacing: normal;
                  color: #212121;
                  background: #fafafa;
                  margin-bottom: 0;

                  &--active {
                    i {
                      color: #2196f3 !important;
                    }
                  }

                  &__title {
                    line-height: 18px;
                  }

                  &-title {
                    &__value {
                      position: absolute;
                      right: 8px;
                      top: 8px;
                      border-radius: 4px;
                      background-color: #2196f3;
                      color: #ffffff;
                      min-width: 24px;
                      min-height: 23px;
                      justify-content: center;
                      align-items: center;
                      display: flex;
                      padding: 2px;
                    }
                  }

                  &__icon {
                    margin-right: 18px;
                  }
                }
              }
            }
          }
        }
      }

      &--right-menu {
        width: calc(100% - 220px);

        ::v-deep .card.v-card.v-sheet.theme--light {
          padding: 0 !important;
          border-radius: 0 !important;
          -webkit-box-shadow: none !important;
          box-shadow: none !important;
        }

        &__summary {
          display: flex;
          flex-flow: column;
          width: 85%;

          &__item {
            display: flex;
            flex-flow: row;

            &:first-child {
              margin-bottom: 8px;
            }

            &--text-header {
              font-size: 14px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
              margin-right: 8px;
            }

            &--text-content {
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
            }

            &--action-button {
              position: absolute;
              right: 20px;
              top: 20px;

              button {
                border-radius: 18px;
                font-size: 14px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.71;
                letter-spacing: normal;
                color: #2196f3;
              }
            }
          }
        }

        &__target-users {
          &--header {
            margin-top: 25px;
            margin-bottom: 0;
            font-size: 12px;
            font-weight: 600;
            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }

          &--list {
            .v-chip {
              font-size: 14px;
              font-weight: normal;
              line-height: 1.71;
              letter-spacing: normal;
              text-align: center;
              color: #000000;

              &:first-child {
                margin-left: 0 !important;
              }
            }
          }
        }

        &__filters {
          margin-bottom: 24px;

          &--header {
            margin-top: 25px;
            margin-bottom: 0;
            font-size: 12px;
            font-weight: 600;

            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }

          &--list {
            .v-chip {
              font-size: 14px;
              line-height: 1.71;
              letter-spacing: normal;
              text-align: center;
              color: #000000;

              &:first-child {
                margin-left: 0 !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
