<template>
  <div
    class="investigation-details"
    v-if="investigationDetailsListData && statsAndMenuData && investigationDetailsData"
  >
    <div class="investigation-details__container">
      <v-overlay
        id="add-new-community-overlay"
        :value="isWantToAddNewCommunity"
        :class="{ newInvestigationOverlay: isWantToAddNewCommunity }"
        :opacity="1"
        :z-index="999"
        color="white"
      >
        <new-investigation
          :isEdit="true"
          :statsAndMenuData="statsAndMenuData"
          :investigationDetailsTargetUsersListData="investigationDetailsTargetUsersListData"
          :investigationDetailsData="investigationDetailsData"
          @closeAdd="onAddClose"
          @refreshDatatable="refreshDatatable"
        />
      </v-overlay>
      <v-overlay fixed :opacity="0.46" :value="isWantToDelete" :z-index="999">
        <v-card
          light
          class="download-card investigation-details__alerts pb-4 pa-6"
          style="max-width: 580px;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper investigation-details__alerts-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-alert</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title
                class="v-card-headline investigation-details__alerts-title"
              >Delete Ongoing Investigation
              </v-list-item-title>
              <v-list-item-subtitle
                class="v-card-sub-header investigation-details__alerts-sub-title"
              >{{deleteMessage()}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="check-wrapper investigation-details__alerts-content pl-0 pr-0">
            <p>Do you want to delete emails or move to trash?</p>
          </v-list-item>
          <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
            <div>
              <v-btn class="pa-0" text color="#f56c6c" @click="isWantToDelete = false">CANCEL
              </v-btn>
            </div>
            <div class="d-flex flex-row flex-end">
              <v-btn
                class="pa-0 mr-3"
                text
                color="#00bcd4"
                @click="isWantToDeleteConfirm(false)"
              >Move to trash
              </v-btn>
              <v-btn
                class="pa-0"
                text
                color="#2196f3"
                @click="isWantToDeleteConfirm(true)"
              >Delete Permenantly
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-overlay>
      <v-overlay fixed :opacity="0.46" :value="isWantToWarn" :z-index="999">
        <v-card
          light
          class="download-card investigation-details__alerts pb-4 pa-6"
          style="max-width: 580px;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper investigation-details__alerts-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-alert</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title
                class="v-card-headline investigation-details__alerts-title"
              >{{warningMessage}}
              </v-list-item-title>
              <v-list-item-subtitle
                class="v-card-sub-header investigation-details__alerts-sub-title"
              >Type a message to reporting user
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="check-wrapper investigation-details__alerts-content pl-0 pr-0">
            <v-text-field
              placeholder="Dangerous Email"
              outlined
              class="edit-name-textfield edit-select standard-height"
              v-model="notifyMessage"
              required
              height="40"
            ></v-text-field>
          </v-list-item>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn class="pa-0" text color="#f56c6c" @click="isWantToWarn = false">CANCEL</v-btn>
            <v-btn class="pa-0" text color="#2196f3" @click="isWantToWarnConfirm">Send</v-btn>
          </div>
        </v-card>
      </v-overlay>
      <v-overlay fixed :opacity="0.46" :value="isWantToStop" :z-index="999">
        <v-card
          light
          class="download-card investigation-details__alerts pb-4 pa-6"
          style="max-width: 580px;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper investigation-details__alerts-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-alert</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title
                class="v-card-headline investigation-details__alerts-title"
              >Stop Ongoing Investigation
              </v-list-item-title>
              <v-list-item-subtitle
                class="v-card-sub-header investigation-details__alerts-sub-title"
              >Do you want to stop this investigation?
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="check-wrapper investigation-details__alerts-content pl-0 pr-0">
            <p>Once stopped, you cannot resume this investigation</p>
          </v-list-item>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn text color="#f56c6c" @click="isWantToStop = false">CANCEL</v-btn>
            <v-btn text color="#2196f3" @click="isWantToStopConfirm">Stop</v-btn>
          </div>
        </v-card>
      </v-overlay>
      <v-overlay fixed :opacity="0.46" :value="isWantToWarnAndDelete" :z-index="999">
        <v-card
          light
          class="download-card investigation-details__alerts pb-4 pa-6"
          style="max-width: 580px;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper investigation-details__alerts-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-alert</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title
                class="v-card-headline investigation-details__alerts-title"
              >Delete Emails and Notify Users?
              </v-list-item-title>
              <v-list-item-subtitle
                class="v-card-sub-header investigation-details__alerts-sub-title"
              >{{deleteMessage()}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            class="check-wrapper investigation-details__alerts-content pl-0 pr-0 d-block"
          >
            <p class="mb-0">Type a message to users</p>
            <v-text-field
              placeholder="Dangerous Email"
              outlined
              class="edit-name-textfield edit-select standard-height"
              v-model="notifyMessageWithDelete"
              required
              height="40"
            ></v-text-field>
          </v-list-item>
          <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
            <div>
              <v-btn class="pa-0" text color="#f56c6c" @click="isWantToWarnAndDelete = false">
                CANCEL
              </v-btn>
            </div>
            <div class="d-flex flex-row flex-end">
              <v-btn
                class="pa-0 mr-3"
                text
                color="#00bcd4"
                @click="isWantToDeleteConfirm(false, notifyMessageWithDelete )"
              >Move to trash
              </v-btn>
              <v-btn
                class="pa-0"
                text
                color="#2196f3"
                @click="isWantToDeleteConfirm(true, notifyMessageWithDelete )"
              >Delete Permenantly
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-overlay>
      <div class="investigation-details__container__stats">
        <div class="investigation-details__container__stats__cards">
          <div class="investigation-details__container__stats__cards__card">
            <div class="investigation-details__container__stats__cards__card-left">
              <div
                class="investigation-details__container__stats__cards__card-left__icon"
                :class="statsAndMenuData.status == 'Running' ? 'bg-blue' : (statsAndMenuData.status == 'Finished' ? 'bg-green' : (statsAndMenuData.status == 'Expired' ? 'bg-salmon' : 'bg-salmon'))"
              >
                <v-icon medium left color="white">{{statusIcon}}</v-icon>
              </div>
            </div>
            <div class="investigation-details__container__stats__cards__card-right">
              <h3
                class="investigation-details__container__stats__cards__card-right__title"
              >{{statsAndMenuData.status}}</h3>
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
                  <p class="tooltip-wrapper" >Actual remaining time may be different from estimated time and is depended on
                    conditions such as online user count, mailbox size, etc.
                  </p>
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
      <div class="investigation-details__container__content card v-card v-sheet theme--light">
        <div class="investigation-details__container__content--left-menu">
          <div class="investigation-details__container__content--left-menu--time">
            <div
              class="investigation-details__container__content--left-menu--time--labels"
            >Expiry Time
            </div>
            <div class="investigation-details__container__content--left-menu--time--progress">
              <span>{{investigationDetailsData.createDate}}</span>
              <span>{{investigationDetailsData.expireDate}}</span>
            </div>
            <div class="investigation-details__container__content--left-menu--time--progress--bar">
              <v-progress-linear :value="progressValue" background-color="#b3d4fc"
                                 color="#2196f3"></v-progress-linear>
            </div>
            <div
              class="investigation-details__container__content--left-menu--time--left-date"
            >{{diffDays === 0 ? 0 : diffDays}} {{diffDays > 1 ? 'days' : 'day'}}
            </div>
          </div>
          <div class="investigation-details__container__content--left-menu--mail-menu">
            <v-card>
              <v-navigation-drawer permanent>
                <v-list dense nav>
                  <v-list-item
                    link
                    @click="menuClick('targetUsers')"
                    :class="{'v-list-item--active': activeMenu =='targetUsers'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-account-multiple</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Target Users
                        <span
                          class="v-list-item-title__value"
                          v-if="investigationDetailsTargetUsersListData && investigationDetailsTargetUsersListData.results"
                        >{{investigationDetailsTargetUsersListData && investigationDetailsTargetUsersListData.results.length}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('Inbox')"
                    :class="{'v-list-item--active': activeMenu =='Inbox'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-inbox</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Inbox
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Inbox') && statsAndMenuData.folders.find(item => item.folderName == 'Inbox').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Inbox') && statsAndMenuData.folders.find(item => item.folderName == 'Inbox').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('JunkEmail')"
                    :class="{'v-list-item--active': activeMenu =='JunkEmail'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-alert</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Junk
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'JunkEmail') && statsAndMenuData.folders.find(item => item.folderName == 'JunkEmail').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'JunkEmail') && statsAndMenuData.folders.find(item => item.folderName == 'JunkEmail').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('Drafts')"
                    :class="{'v-list-item--active': activeMenu =='Drafts'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-file</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Draft
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Drafts') && statsAndMenuData.folders.find(item => item.folderName == 'Drafts').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Drafts') && statsAndMenuData.folders.find(item => item.folderName == 'Drafts').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('SentItems')"
                    :class="{'v-list-item--active': activeMenu =='SentItems'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-send</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Sent
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'SentItems') && statsAndMenuData.folders.find(item => item.folderName == 'SentItems').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'SentItems') && statsAndMenuData.folders.find(item => item.folderName == 'SentItems').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('DeletedItems')"
                    :class="{'v-list-item--active': activeMenu =='DeletedItems'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-delete</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Deleted Items
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'DeletedItems') && statsAndMenuData.folders.find(item => item.folderName == 'DeletedItems').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'DeletedItems') && statsAndMenuData.folders.find(item => item.folderName == 'DeletedItems').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('Others')"
                    :class="{'v-list-item--active': activeMenu =='Others'}"
                  >
                    <v-list-item-icon>
                      <v-icon medium left color="#909399">mdi-plus-box</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Others
                        <span
                          class="v-list-item-title__value"
                          v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item && item.folderName && item.folderName == 'Others') && statsAndMenuData.folders.find(item => item && item.folderName && item.folderName == 'Others').mailCount"
                        >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item && item.folderName && item.folderName == 'Others') && statsAndMenuData.folders.find(item => item && item.folderName && item.folderName == 'Others').mailCount}}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-divider></v-divider>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="menuClick('stored')"
                    class="v-list-item__archived--main"
                    :class="{'v-list-item--active': activeMenu =='stored'}"
                  >
                    <div class="v-list-item__archived">
                      <p class="v-list-item__archived--title">Archived</p>
                    </div>
                    <div class="v-list-item__archived--link">
                      <v-list-item-icon>
                        <v-icon medium left color="#909399">mdi-clipboard-arrow-down</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>
                          Stored
                          <span
                            class="v-list-item-title__value"
                            v-if="statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Stored') && statsAndMenuData.folders.find(item => item.folderName == 'Stored').mailCount"
                          >{{statsAndMenuData.folders && statsAndMenuData.folders.find(item => item.folderName == 'Inbox') && statsAndMenuData.folders.find(item => item.folderName == 'Inbox').mailCount}}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </div>
                  </v-list-item>
                  <v-list-item></v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-card>
          </div>
        </div>
        <div class="investigation-details__container__content--right-menu">
          <div class="investigation-details__container__content--right-menu__summary">
            <div class="investigation-details__container__content--right-menu__summary__item">
              <div
                class="investigation-details__container__content--right-menu__summary__item--text-header"
              >Investigation Name:
              </div>
              <div
                class="investigation-details__container__content--right-menu__summary__item--text-content"
              >{{investigationDetailsData.name}} - {{investigationDetailsData.startDate}}
              </div>
              <div
                class="investigation-details__container__content--right-menu__summary__item--action-button"
                v-if="statsAndMenuData.status == 'Running'"
              >
                <v-btn class="ma-2" outlined color="#2196f3" @click="stopInvestigationFunc">
                  <v-icon medium left color="#2196f3">mdi-stop</v-icon>
                  Stop
                </v-btn>
              </div>
              <div
                class="investigation-details__container__content--right-menu__summary__item--action-button"
                v-if="statsAndMenuData.status != 'Running'"
              >
                <v-btn class="ma-2" outlined color="#2196f3" @click="startInvestigationFunc">
                  <v-icon medium left color="#2196f3">mdi-content-copy</v-icon>
                  Duplicate
                </v-btn>
              </div>
            </div>
            <div class="investigation-details__container__content--right-menu__summary__item">
              <div
                class="investigation-details__container__content--right-menu__summary__item--text-header"
              >Email Date Range:
              </div>
              <div
                class="investigation-details__container__content--right-menu__summary__item--text-content"
              >{{investigationDetailsData.startDate}} - {{investigationDetailsData.endDate}}
              </div>
            </div>
          </div>
          <div class="investigation-details__container__content--right-menu__target-users">
            <p
              class="investigation-details__container__content--right-menu__target-users--header"
            >Target Users:</p>
            <div
              class="investigation-details__container__content--right-menu__target-users--list"
              v-if="investigationDetailsData.targetUserType != 'AllUsers'"
            >
              <v-chip
                class="ma-2"
                v-for="(item,index) in investigationDetailsData.targetUsers"
                :key="index"
              >{{item.targetUser && `User: ${item.targetUser}`}}{{item.targetGroup && `Group:
                ${item.targetGroup}`}}
              </v-chip>
            </div>
            <div
              class="investigation-details__container__content--right-menu__target-users--list"
              v-else
            >
              <v-chip class="ma-2">All Users</v-chip>
            </div>
          </div>
          <div class="investigation-details__container__content--right-menu__filters">
            <p
              class="investigation-details__container__content--right-menu__filters--header"
            >Filters:</p>
            <div
              class="investigation-details__container__content--right-menu__filters--list d-flex"
            >
              <div v-for="(item) in investigationDetailsData.headers" class="mr-2">
                <v-chip
                  class="ma-2"
                  v-for="(value,key) in item"
                  v-if="value && key != 'resourceId'"
                >{{ key }}: {{ value }}
                </v-chip>
              </div>
              <div v-for="(item) in investigationDetailsData.bodies">
                <v-chip class="ma-2" v-for="(value,key) in item" v-if="value">{{ key }}: {{ value
                  }}
                </v-chip>
              </div>
              <div v-for="(item) in investigationDetailsData.attachments">
                <v-chip class="ma-2" v-for="(value,key) in item" v-if="value">{{ key }}: {{ value
                  }}
                </v-chip>
              </div>
            </div>
          </div>
          <div v-if="activeMenu != 'targetUsers'">
            <datatable
              id="investigationDetailsList"
              :refName="'investigationDetailsListTable'"
              :columns="columns"
              :table="investigationDetailsListData && investigationDetailsListData.results"
              :countRow="5"
              :pageSizes="pageSizes"
              :defaultSort="'date'"
              :selectable="true"
              :filterable="true"
              :options="true"
              :rowActions="rowActions"
              :empty="iEmpty"
              :selectEvent="selectEvent"
              :chartOptions="chartOptions"
              :clusterItems="clusterItems"
              :groupable="true"
              @deleteInvestigationDetailsFunction="deleteInvestigationDetailsFunction($event)"
              @sendInvestigationdetailsWarningMessage="sendInvestigationdetailsWarningMessage($event)"
              @deleteAndNotifyInvestigationDetailsFunction="deleteAndNotifyInvestigationDetailsFunction($event)"
              :rowActionsMinWidth="80"
              v-if="showEmails"

            />
          </div>
          <div v-if="activeMenu == 'targetUsers' && showTargetUsersDetails">
            <datatable
              id="investigationDetailsTargetUsersList"
              :refName="'investigationDetailsTargetUsersListTable'"
              :columns="columnsTargetUsers"
              :table="investigationDetailsTargetUsersListData && investigationDetailsTargetUsersListData.results"
              :countRow="5"
              :pageSizes="pageSizes"
              :defaultSort="'date'"
              :selectable="true"
              :filterable="true"
              :options="true"
              :empty="iEmpty"
              :selectEvent="selectEvent"
              :chartOptions="chartOptions"
              :clusterItems="clusterItems"
              :groupable="true"
              @deleteInvestigationDetailsFunction="deleteInvestigationDetailsFunction($event)"
              @sendInvestigationdetailsWarningMessage="sendInvestigationdetailsWarningMessage($event)"
              @deleteAndNotifyInvestigationDetails="deleteAndNotifyInvestigationDetails($event)"
              v-if="showTargetUsersDetails"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Datatable from "../components/DataTable";
  import newInvestigation from "../components/Investigation/NewInvestigation";
  import {mapActions, mapGetters} from "vuex";


  export default {
    components: {
      Datatable,
      newInvestigation
    },
    data: () => ({
      isWantToAddNewCommunity: false,
      progressValue: null,
      notifyMessage: null,
      notifyMessageWithDelete: null,
      diffDays: null,
      activeMenu: "Inbox",
      warningMessage: "Notify user about this email",
      statusIcon: "mdi-check",
      showEmails: false,
      showTargetUsersDetails: false,
      isWantToDelete: false,
      isWantToWarn: false,
      isWantToStop: false,
      isWantToWarnAndDelete: false,
      totalSelectedItemsCount: [],
      investigationListBodyData: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: "ReceivedTime",
        ascending: true,
        filter: {
          Condition: "AND",
          FilterGroups: [
            {
              Condition: "AND",
              FilterItems: [
                {
                  FieldName: "Folder",
                  Operator: "Include",
                  Value: "Inbox"
                }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      investigationTargetUsersListBodyData: {
        pageNumber: 1,
        pageSize: 3,
        orderBy: "Email",
        ascending: true,
        filter: {
          Condition: "AND",
          FilterGroups: []
        }
      },
      columns: [
        // Should be defined to show the table
        {
          property: "from",
          align: "left",
          editable: false,
          label: "From",
          fixed: "left",
          sortable: true,
          show: true,
          type: "text",
          minWidth: 208
        },
        {
          property: "to",
          align: "left",
          editable: false,
          label: "To",
          fixed: false,
          sortable: true,
          show: true,
          type: "array",
          minWidth: 208
        },
        {
          property: "subject",
          align: "left",
          editable: false,
          label: "Subject",
          fixed: false,
          sortable: true,
          show: true,
          type: "text",
          minWidth: 208
        },
        {
          property: "attachmentCount",
          align: "center",
          editable: false,
          label: "File",
          fixed: false,
          sortable: true,
          show: true,
          type: "attachment",
          width: 80
        },
        {
          property: "scanType",
          align: "center",
          editable: false,
          label: "Service",
          fixed: false,
          sortable: true,
          show: true,
          type: "service",
          width: 110
        }
      ],
      columnsTargetUsers: [
        {
          property: "email",
          align: "left",
          editable: false,
          label: "Email Address",
          fixed: "left",
          sortable: true,
          show: true,
          type: "text"
        },
        {
          property: "userStatus",
          align: "left",
          editable: false,
          label: "User Status",
          fixed: false,
          sortable: true,
          show: true,
          type: "userStatus"
        },
        {
          property: "duration",
          align: "left",
          editable: false,
          label: "Duration",
          fixed: false,
          sortable: true,
          show: true,
          type: "text"
        },
        {
          property: "status",
          align: "center",
          editable: false,
          label: "Status",
          fixed: false,
          sortable: true,
          show: true,
          type: "status"
        },
        {
          property: "scanType",
          align: "left",
          editable: false,
          label: "Service",
          fixed: false,
          sortable: true,
          show: true,
          type: "text"
        }
      ],
      pageSizes: [5, 10, 25, 50, 100],
      rowActions: [
        {
          name: "Delete",
          icon: "mdi-delete",
          action: "deleteInvestigationDetails"
        },
        {
          name: "Send user a warning message",
          icon: "mdi-alert",
          action: "sendWarningMessage"
        },
        {
          name: "Delete and notify user",
          icon: "mdi-delete",
          action: "deleteAndNotifyInvestigationDetails"
        },
        {
          name: "Analyze suspicious email",
          icon: "mdi-sync",
          action: "analyzeAuspiciousEmail"
        }
      ],

      clusterItems: [
        {
          name: "Name",
          action: "nameCluster",
          seledted: false
        },
        {
          name: "City",
          action: "cityCluster",
          seledted: false
        },
        {
          name: "Address",
          action: "addressCluster",
          seledted: false
        }
      ],
      addUsers: {
        show: true,
        popUp: false,
        action: "createCommunityFromMobileInfo"
      },
      iEmpty: {
        message: "No email has been found, yet"
      },
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: true,
        download: false,
        warning: true,
        deleteAndNotify: true
      },
      chartOptions: {
        chart: {
          width: 60,
          height: 60,
          type: "pie",
          offsetX: -1,
          offsetY: 1
        },
        labels: ["Team A", "Team B"],
        colors: ["#3f51b5", "#00bcd4"],
        legend: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        dataLabels: {
          enabled: false
        }
      },
      bodyData: {
        // @todo pagesize is not statci shoudl be dynamic. Discsss with back end @arda
        pageNumber: 1,
        pageSize: 5000,
        orderBy: "ExpireDate",
        ascending: false,
        filter: {
          Condition: "AND",
          FilterGroups: [
            {
              Condition: "AND",
              FilterItems: [
                {
                  FieldName: "Status",
                  Operator: "Include",
                  Value: "Cancelled,Running,Idle"
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
    }),
    methods: {
      deleteMessage() {
        return `${this.totalSelectedItemsCount} ${
          this.totalSelectedItemsCount > 1 ? "emails" : "email"
        } will be deleted from mailbox`;
      },
      calculateProgressData() {
        let today = new Date();
        let createDate = new Date(this.investigationDetailsData.createDate);
        let expireDate = new Date(this.investigationDetailsData.expireDate);
        let startDate = new Date(this.investigationDetailsData.startDate);
        let diffDays = parseInt((expireDate - today) / (1000 * 60 * 60 * 24), 10);
        let totalDays = parseInt((expireDate - createDate) / (1000 * 60 * 60 * 24), 10);
        this.diffDays = diffDays;
        let progressValue = (diffDays === 0 ? 100 : diffDays * 100) / totalDays;
        if (diffDays < 0) {
          this.diffDays = 0;
          this.progressValue = 100;
        } else {
          this.progressValue = progressValue;
        }
      },
      showRemainingDays() {
      },
      isWantToStopConfirm() {
        this.$store
          .dispatch("investigations/cancelInvestigation", this.$route.params.id)
          .catch(() => {
          })
          .finally(() => {
            this.isWantToStop = false;
            this.refreshDatatable();
            this.restartStopInvestigationData();
          });
      },
      stopInvestigationFunc(value) {
        this.isWantToStop = true;
      },
      iconType() {
        this.statsAndMenuData.status == "Running"
          ? (this.statusIcon = "mdi-play")
          : this.statsAndMenuData.status == "Finished"
          ? (this.statusIcon = "mdi-check")
          : this.statsAndMenuData.status == "Expired"
            ? (this.statusIcon = "mdi-clock")
            : (this.statusIcon = "mdi-close");
      },
      getStatusText(section, val) {
        if (val == null) val = 0;
        this.iconType();
        //this.statsAndMenuData.estimatedTime = 'asd'

        switch (section) {
          case "statusTime":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return this.statsAndMenuData.estimatedTime
                  ? this.statsAndMenuData.estimatedTime
                  : "Estimated time can not be calculated at the moment";
              case "Cancelled":
                return this.investigationDetailsData.endDate;
              case "Expired":
                return this.investigationDetailsData.expireDate;
              case "Finished":
                return this.investigationDetailsData.endDate;
              default:
                break;
            }
            break;
          case "notScannedUserCount":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `${val} Online Users`;
              case "Cancelled":
                return `${val} Users`;
              case "Expired":
                return `${val} Users`;
              case "Finished":
                return "All users scanned";
              default:
                break;
            }
            break;
          case "totalUserCount":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `of remaining ${val} users`;
              case "Cancelled":
                return `Could not be scanned`;
              case "Expired":
                return `Could not be scanned`;
              case "Finished":
                return "No remaining users";
              default:
                break;
            }
            break;
          case "scannedUserCount":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `${val} Scanned Users`;
              case "Cancelled":
                return `${val} Scanned Users`;
              case "Expired":
                return `${val} Scanned Users`;
              case "Finished":
                return `${val} Scanned Users`;
              default:
                break;
            }
            break;
          case "totalUserCountScannedUser":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `of total ${val} users`;
              case "Cancelled":
                return `of total ${val} users`;
              case "Expired":
                return `of total ${val} users`;
              case "Finished":
                return `of total ${val} users`;
              default:
                break;
            }
            break;
          case "scannedEmailCount":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `${val} Emails Scanned`;
              case "Cancelled":
                return `${val} Emails Scanned`;
              case "Expired":
                return `${val} Emails Scanned`;
              case "Finished":
                return `${val} Emails Scanned`;
              default:
                break;
            }
            break;
          case "totalEmailCount":
            switch (this.statsAndMenuData.status) {
              case "Running":
                return `of total ${val} emails`;
              case "Cancelled":
                return `of total ${val} emails`;
              case "Expired":
                return `of total ${val} emails`;
              case "Finished":
                return `of total ${val} emails`;
              default:
                break;
            }
            break;

          default:
            break;
        }
      },
      menuClick(menu) {
        this.activeMenu = menu;
        this.showTargetUsersDetails = false;
        this.showEmails = false;
        if (menu != "targetUsers") {
          let dataBody = this.investigationListBodyData;
          dataBody.filter.FilterGroups[0].FilterItems[0].Value = menu;
          this.$store
            .dispatch("investigations/getInvestigationDetailsListData", {
              data: dataBody,
              id: this.$route.params.id
            })
            .finally(() => {
              this.showEmails = true;
              vm.$forceUpdate();
            });
        } else {
          this.$store
            .dispatch(
              "investigations/getInvestigationDetailsTargetUsersListData",
              {
                data: this.investigationTargetUsersListBodyData,
                id: this.$route.params.id
              }
            )
            .finally(() => {
              this.showTargetUsersDetails = true;
              vm.$forceUpdate();
            });
        }
      },
      restartStopInvestigationData() {
        this.$store
          .dispatch("investigations/getStatsAndMenuData", this.$route.params.id)
          .finally(() => {
            this.$store
              .dispatch(
                "investigations/getInvestigationDetailsData",
                this.$route.params.id
              )
              .finally(() => {
                this.$store
                  .dispatch("investigations/getInvestigationDetailsListData", {
                    data: this.investigationListBodyData,
                    id: this.$route.params.id
                  })
                  .finally(() => {
                    this.showEmails = false;
                    this.showTargetUsersDetails = false;
                    this.showEmails = true;
                    vm.$forceUpdate();
                  });
              });
          });
      },
      restartAllData() {
        this.showEmails = false;
        this.showTargetUsersDetails = false;
        if (this.activeMenu == "targetUsers") {
          this.$store
            .dispatch(
              "investigations/getInvestigationDetailsTargetUsersListData",
              {
                data: this.investigationTargetUsersListBodyData,
                id: this.$route.params.id
              }
            )
            .finally(() => {
              this.showTargetUsersDetails = true;
              vm.$forceUpdate();
            });
        } else {
          this.$store
            .dispatch(
              "investigations/getInvestigationDetailsTargetUsersListData",
              {
                data: this.investigationTargetUsersListBodyData,
                id: this.$route.params.id
              }
            )
            .finally(() => {
              vm.$forceUpdate();
              this.showEmails = true;
            });
        }
      },
      refreshDatatable() {

        this.$store
          .dispatch("investigations/getStatsAndMenuData", this.$route.params.id)
          .finally(() => {
            this.$store
              .dispatch(
                "investigations/getInvestigationDetailsData",
                this.$route.params.id
              )
              .finally(() => {
                this.$store
                  .dispatch("investigations/getInvestigationDetailsListData", {
                    data: this.investigationListBodyData,
                    id: this.$route.params.id
                  })
                  .finally(() => {
                    this.calculateProgressData();
                    this.showEmails = false;
                    this.showTargetUsersDetails = false;
                    this.showTargetUsersDetails = this.activeMenu === "targetUsers";
                    this.showEmails = this.activeMenu !== "targetUsers";
                  });
              });
          });
        this.$store
          .dispatch("investigations/getInvestigationDetailsTargetUsersListData", {
            data: this.investigationTargetUsersListBodyData,
            id: this.$route.params.id
          })
          .finally(() => {
            //this.showTargetUsersDetails = true;
            //vm.$forceUpdate();
          });
      },
      onAddClose() {
        // set mobile vision
        if (this.isMobileVisible && this.windowWidth < 769) {
          this.isMobileInfo = true;
        }
        this.isWantToAddNewCommunity = false;
      },
      createCommunityFromMobileInfo() {
        // open new investigation overlay
        this.isWantToAddNewCommunity = true;
      },
      sendInvestigationdetailsWarningMessage(value, multi) {
        this.isWantToWarn = true
        this.warningMessage = Array.isArray(value) && value.length && value.length > 1 ? "Notify users about this email" : "Notify user about this email"
        this.soloWarningMessageValue = value
      },
      isWantToWarnConfirm() {
        let isArray = Array.isArray(this.soloWarningMessageValue);
        let data = [];
        isArray
          ? (data = this.soloWarningMessageValue.map(item => item.resourceId))
          : data.push(this.soloWarningMessageValue.resourceId);
        this.$store
          .dispatch("investigations/sendInvestigationWarningMessage", {
            data: {
              items: data,
              warningMessage: this.notifyMessage
            },
            id: this.$route.params.id
          })
          .finally(() => {
            this.refreshDatatable();
            this.isWantToWarn = false;
          });
      },
      deleteInvestigationDetailsFunction(value, multi) {
        let isArray = Array.isArray(value);
        this.totalSelectedItemsCount = isArray ? value.length : 1;
        this.isWantToDelete = true;
        this.deleteValue = value;
      },
      isWantToDeleteConfirm(val, message) {
        let isArray = Array.isArray(this.deleteValue);
        let data = [];
        isArray
          ? (data = this.deleteValue.map(item => item.resourceId))
          : data.push(this.deleteValue.resourceId);
        this.$store
          .dispatch("investigations/deleteInvestigationDetailsItem", {
            data: {
              items: data,
              isNotify: !!message,
              IsPermanentDelete: val,
              warningMessage: message
            },
            id: this.$route.params.id
          })
          .finally(() => {
            this.refreshDatatable();
            this.isWantToDelete = false;
            this.isWantToWarnAndDelete = false;
          });
      },
      deleteAndNotifyInvestigationDetailsFunction(value) {
        let isArray = Array.isArray(value);
        this.totalSelectedItemsCount = isArray ? value.length : 1;
        this.isWantToWarnAndDelete = true;
        this.deleteValue = value;
      },

      startInvestigationFunc() {
        this.isWantToAddNewCommunity = true;
      }
    },
    computed: {
      ...mapGetters({
        // get table data via vuex.
        tableData: "investigations/getInvestigationDetailsListGetter", // for using getters,
        statsAndMenuData: "investigations/statsAndMenuGetter", // for stats getters,
        investigationDetailsData: "investigations/investigationDetailsDataGetter", // for stats getters,
        investigationDetailsListData:
          "investigations/getInvestigationDetailsListGetter", // for stats getters,
        investigationDetailsTargetUsersListData:
          "investigations/getInvestigationDetailsTargetUsersListGetter"
      })
    },
    created() {
    },
    mounted() {
      // triggered to relevant action at investigations.js
      //this.$store.dispatch("investigations/getInvestigationList", this.bodyData);
      const _this = this;
      this.refreshDatatable();
      this.autoRequest = setInterval(function () {
        if (_this.statsAndMenuData && _this.statsAndMenuData.status == "Running")
          _this.refreshDatatable();
      }, 15000);
    },
    beforeDestroy() {
      clearInterval(this.autoRequest);
    }
  };
</script>
<style lang="scss" scoped>
  .standard-height {
    ::v-deep .v-input__slot {
      //max-height: 40px !important;
      min-height: 40px !important;
    }
  }

  ::v-deep .v-list-item--disabled{
    opacity: 0.5 !important;
  }

  ::v-deep .v-text-field > .v-input__control > .v-input__slot:after {
    border-color: currentColor;
    border-style: none;
    border-width: unset;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
  }

  ::v-deep .v-input__control {
    input {
      &::placeholder {
        font-family: "Open Sans", sans-serif !important;
        font-size: 13px !important;
        font-weight: normal !important;
        font-stretch: normal !important;
        font-style: normal !important;
        line-height: normal !important;
        letter-spacing: normal !important;
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }

    .v-select__slot {
      margin-bottom: 3px !important;

      .v-label {
        font-family: "Open Sans", sans-serif !important;
        font-size: 13px !important;
        font-weight: normal !important;
        font-stretch: normal !important;
        font-style: normal !important;
        letter-spacing: normal !important;
        color: rgba(0, 0, 0, 0.54) !important;
      }

      input {
        &::placeholder {
          font-family: "Open Sans", sans-serif !important;
          font-size: 13px !important;
          font-weight: normal !important;
          font-stretch: normal !important;
          font-style: normal !important;
          line-height: normal !important;
          letter-spacing: normal !important;
          color: rgba(0, 0, 0, 0.54) !important;
        }
      }
    }
  }

  .text-selected {
    border-radius: 1px !important;
    background-color: #d1e9fc !important;
    border-bottom: 1px solid #2196f3 !important;
    color: rgba(0, 0, 0, 0.87) !important;
    width: max-content;
  }

  .clean-link {
    padding: 0 2px !important;
    border-radius: 1px !important;
    border-bottom: 1px solid #2196f3 !important;
    color: #2196f3 !important;
  }

  .selected-link {
    background-color: #d1e9fc !important;
  }

  .phishing-link {
    background-color: #f3e1e5 !important;
    border-bottom: 1px solid #bb2a45 !important;
    color: #bb2a45 !important;
    width: max-content;
  }

  ::v-deep .v-application input {
    border-radius: 8px !important;
    border: solid 1px rgba(0, 0, 0, 0.16) !important;
  }

  ::v-deep .v-text-field > .v-input__control > .v-input__slot {
    font-family: "Open Sans", sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54) !important;
  }

  ::v-deep .v-select__slot {
    .v-label {
      top: 10px !important;
    }

    .v-label--active {
      top: 16px !important;
    }

    .v-input__append-inner {
      margin-top: 9px !important;
    }
  }

  ::v-deep .v-autocomplete {
    .v-label {
      top: 10px !important;
    }

    .v-label--active {
      top: 8px !important;
    }
  }

  ::v-deep .v-text-field--outlined {
    .v-input__slot {
      margin-bottom: 2px !important;
    }
  }

  ::v-deep .v-text-field__slot {
    label {
      font-family: "Open Sans", sans-serif !important;
      font-size: 13px !important;
      font-weight: normal !important;
      font-stretch: normal !important;
      font-style: normal !important;
      letter-spacing: normal !important;
      color: rgba(0, 0, 0, 0.54) !important;
    }
  }

  ::v-deep .v-input__slot {
    //max-height: 40px !important;
    min-height: 40px !important;
  }

  ::v-deep .v-text-field--outlined {
    .v-input__slot {
      margin-bottom: 2px !important;
    }
  }

  ::v-deep .investigation-details__alerts {
    &-sub-title {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: "Open Sans", sans-serif;
    }

    &-content {
      p {
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.72);
        font-family: "Open Sans", sans-serif;
      }

      margin-top: 24px;
    }

    &-title {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #2196f3;
      font-family: "Open Sans", sans-serif;
    }

    &-icon-wrapper {
      box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
      border: solid 1px rgba(100, 181, 246, 0.5);
      background-color: #e3f2fd;
      height: 48px;
      width: 48px;
      margin-right: 24px;
      font-family: "Open Sans", sans-serif;
    }
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
                font-family: "Open Sans", sans-serif;
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
                font-family: "Open Sans", sans-serif;
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
              font-family: "Open Sans", sans-serif;
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
              font-family: "Open Sans", sans-serif;
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
              font-family: "Open Sans", sans-serif;
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
                        font-family: "Open Sans", sans-serif;
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
                    font-family: "Open Sans", sans-serif;
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
                font-family: "Open Sans", sans-serif;
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
                font-family: "Open Sans", sans-serif;
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
                  font-family: "Open Sans", sans-serif;
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
              font-family: "Open Sans", sans-serif;
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
                font-family: "Open Sans", sans-serif;
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
              font-family: "Open Sans", sans-serif;
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
                font-family: "Open Sans", sans-serif;
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

  .newInvestigationOverlay {
    background-color: #fff !important;
    overflow: auto !important;
    height: 100% !important;
    max-width: 100vw !important;
    width: 100% !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;

    > ::v-deep .v-overlay__content {
      height: auto;
      width: 100%;
    }
  }
</style>
