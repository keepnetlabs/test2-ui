<template>
  <div class="playbook investigation-details" id="playbook">
    <v-layout id="ts-layout" style="min-height: 80vh;" wrap>
      <v-col class="p-0" cols="12">
        <v-card class="pr-card">
          <v-tabs
            active-class="pr-tab-active"
            background-color="transparent"
            color="basil"
            id="pr-tabs"
            v-model="tab"
          >
            <v-tab @click="changeTabStatus(0)" class="pr-tab pr-tab-users p-2" id="pr-tab-users">
              Rules
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <Rules />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Rules from '../components/Playbook/Rules'

export default {
  name: 'Playbook',
  components: {
    Rules
  },
  data() {
    return {
      tab: 0
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
  },

  mounted() {}
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  position: relative;
}

.pr-tab {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.87) !important;

  &-users {
    margin-right: 35px !important;
  }

  &-active {
    color: #2196f3 !important;
  }
}

::v-deep .v-card {
  padding: 0 !important;
}

::v-deep .v-slide-group__content {
  border-bottom: 2px solid #e4e7ed;
  margin-right: 20px;
}

::v-deep .v-tabs-slider-wrapper {
  bottom: -1px !important;
  color: #0486fe !important;
}

.pr-card {
  box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 1px -1px rgba(204, 204, 204, 0.12);
  padding: 10px 5px 18px 20px !important;
  border-radius: 20px !important;
}

::v-deep .v-window {
  margin-top: 30px;
}

.investigation-details {
  padding: 16px;
  padding-top: 10px;

  &__container {
    &__stats {
      border-radius: 20px;
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
      background-color: #ffffff;
      padding: 24px;
      margin-bottom: 34px;
      display: flex;
      flex-wrap: wrap;
      flex-flow: row;

      &__cards {
        display: flex;
        flex-basis: 25%;
        flex-grow: 0;

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
              font-family: 'Open Sans', sans-serif;
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
              font-family: 'Open Sans', sans-serif;
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
                font-family: 'Open Sans', sans-serif;
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
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }

          &--list {
            .v-chip {
              font-family: 'Open Sans', sans-serif;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
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
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }

          &--list {
            .v-chip {
              font-family: 'Open Sans', sans-serif;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
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
