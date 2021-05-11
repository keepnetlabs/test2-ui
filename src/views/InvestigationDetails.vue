<template>
  <div class="investigation-details-wrapper">
    <div
      class="investigation-details"
      v-if="investigationDetailsListData && statsAndMenuData && investigationDetailsData"
    >
      <div class="investigation-details__container">
        <new-investigation
          :isEdit="true"
          :statsAndMenuData="statsAndMenuData"
          :status="isWantToAddNewCommunity"
          :investigationDetailsTargetUsersListData="investigationDetailsTargetUsersListData"
          :investigationDetailsData="investigationDetailsData"
          @closeWithRoute="onAddClose"
          @closeAdd="isWantToAddNewCommunity = false"
          v-if="isWantToAddNewCommunity"
          @refreshDatatable="refreshDatatable"
        />
        <app-dialog
          v-if="isWantToDelete"
          :status="isWantToDelete"
          icon="mdi-alert"
          size="small"
          title="Delete Emails?"
          title-id="text--investigation-details-delete-emails-popup-title"
          subtitle-id="text--investigation-details-delete-emails-popup-subtitle"
          :subtitle="deleteMessage()"
          @changeStatus="isWantToDelete = false"
          body="Do you want to delete emails or move to trash?"
          className="investigation-details__modal-footer"
        >
          <template v-slot:app-dialog-footer>
            <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
              <div>
                <v-btn
                  id="btn-cancel--investigation-details-delete-emails-popup"
                  class="k-dialog__button"
                  text
                  color="#f56c6c"
                  @click="isWantToDelete = false"
                  >{{ labels.Cancel }}
                </v-btn>
              </div>
              <div class="d-flex flex-row flex-end">
                <v-btn
                  id="btn-move-to-trash--investigation-details-delete-emails-popup"
                  class="k-dialog__button"
                  text
                  :disabled="warnAndDeleteButtonDisabled"
                  color="#00bcd4"
                  @click="isWantToDeleteConfirm(false, null, false)"
                  >Move to trash
                </v-btn>
                <v-btn
                  id="btn-delete--investigation-delete-emails-details-popup"
                  class="k-dialog__button"
                  text
                  color="#2196f3"
                  :disabled="warnAndDeleteButtonDisabled"
                  @click="isWantToDeleteConfirm(true, null, false)"
                  >Delete Permanently
                </v-btn>
              </div>
            </div>
          </template>
        </app-dialog>
        <app-dialog
          v-if="isWantToWarn"
          :status="isWantToWarn"
          size="big"
          @changeStatus="isWantToWarn = false"
          icon="mdi-alert"
          :title="warningMessage"
          subtitle="Type a message to reporting user"
          title-id="text--investigation-details-warning-message-popup-title"
          subtitle-id="text--investigation-details-warning-message-popup-subtitle"
          class-name="investigation-details__warning-modal"
        >
          <template v-slot:app-dialog-body>
            <v-list-item class="check-wrapper investigation-details__alerts-content pl-0 pr-0">
              <v-form
                class="w-100"
                lazy-validation
                ref="refWarnForm"
                @submit="isWantToWarnConfirm"
                onSubmit="return false;"
              >
                <v-text-field
                  id="input--investigation-details-warning-message"
                  placeholder="Dangerous Email"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model.trim="notifyMessage"
                  height="40"
                  :rules="[
                    (v) => validations.required(v, 'Required'),
                    (v) => validations.trim(v, 'Required')
                  ]"
                ></v-text-field>
              </v-form>
            </v-list-item>
          </template>
          <template v-slot:app-dialog-footer>
            <app-dialog-footer
              cancel-button-id="btn-cancel--investigation-details-warning-message-popup"
              confirm-button-id="btn-save--investigation-details-warning-message-popup"
              :confirm-button-disabled="warningButtonDisabled"
              @handleClose="isWantToWarn = false"
              @handleConfirm="isWantToWarnConfirm"
            />
          </template>
        </app-dialog>
        <app-dialog
          v-if="isWantToStop"
          :status="isWantToStop"
          size="small"
          @changeStatus="isWantToStop = false"
          icon="mdi-alert"
          title="Stop Ongoing Investigation"
          subtitle="Do you want to stop this investigation?"
          body="Once stopped, you cannot resume this investigation"
          title-id="text--investigation-details-warning-message-popup-title"
          subtitle-id="text--investigation-details-warning-message-popup-subtitle"
        >
          <template v-slot:app-dialog-footer>
            <app-dialog-footer
              cancel-button-id="btn-cancel--investigation-details-warning-message-popup"
              confirm-button-id="btn-save--investigation-details-warning-message-popup"
              :confirm-button-disabled="stopButtonDisabled"
              @handleConfirm="isWantToStopConfirm"
              @handleClose="isWantToStop = false"
            />
          </template>
        </app-dialog>

        <app-dialog
          v-if="isWantToWarnAndDelete"
          :status="isWantToWarnAndDelete"
          @changeStatus="isWantToWarnAndDelete = false"
          size="big"
          icon="mdi-alert"
          title="Delete Emails and Notify Users?"
          :subtitle="deleteMessage()"
          title-id="text--investigation-details-delete-emails-and-notify-user-popup-title"
          subtitle-id="text--investigation-details-delete-emails-and-notify-user-popup-subtitle"
          class-name="investigation-details__warning-modal investigation-details__modal-footer"
        >
          <template v-slot:app-dialog-body>
            <v-form
              lazy-validation
              @submit="isWantToDeleteConfirm(true, notifyMessageWithDelete)"
              ref="refFormDeleteAndNotify"
              onSubmit="return false;"
            >
              <v-list-item
                class="check-wrapper investigation-details__alerts-content pl-0 pr-0 d-block"
              >
                <v-text-field
                  id="input--investigation-details-delete-emails-and-notify-user"
                  placeholder="Dangerous Email"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model.trim="notifyMessageWithDelete"
                  :rules="[
                    (v) => validations.required(v, 'Required'),
                    (v) => validations.trim(v, 'Required')
                  ]"
                ></v-text-field>
              </v-list-item>
            </v-form>
          </template>
          <template v-slot:app-dialog-footer>
            <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
              <div>
                <v-btn
                  id="btn-cancel--investigation-details-delete-emails-and-notify-user-popup"
                  class="k-dialog__button"
                  text
                  color="#f56c6c"
                  @click="isWantToWarnAndDelete = false"
                >
                  {{ labels.Cancel }}
                </v-btn>
              </div>
              <div class="d-flex flex-row flex-end">
                <v-btn
                  id="btn-move-to-trash--investigation-details-delete-emails-and-notify-user-popup"
                  class="k-dialog__button"
                  text
                  color="#00bcd4"
                  :disabled="warnAndDeleteButtonDisabled"
                  @click="isWantToDeleteConfirm(false, notifyMessageWithDelete)"
                  >Move to trash
                </v-btn>
                <v-btn
                  id="btn-delete-permanently--investigation-details-delete-emails-and-notify-user-popup"
                  class="k-dialog__button"
                  text
                  :disabled="warnAndDeleteButtonDisabled"
                  color="#2196f3"
                  @click="isWantToDeleteConfirm(true, notifyMessageWithDelete)"
                  >Delete Permanently
                </v-btn>
              </div>
            </div>
          </template>
        </app-dialog>

        <div class="investigation-details__container__stats">
          <div class="investigation-details__container__stats-left-col">
            <InvestigationDetailsTopBarLoading :loading="topMenuLoading" class="w-100">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__stats__cards">
                  <div class="investigation-details__container__stats__cards__card">
                    <div class="investigation-details__container__stats__cards__card-left">
                      <div
                        class="investigation-details__container__stats__cards__card-left__icon"
                        :class="
                          statsAndMenuData && statsAndMenuData.status == 'Running'
                            ? 'bg-blue'
                            : statsAndMenuData && statsAndMenuData.status == 'Finished'
                            ? 'bg-green'
                            : statsAndMenuData && statsAndMenuData.status == 'Expired'
                            ? 'bg-salmon'
                            : 'bg-salmon'
                        "
                      >
                        <v-icon medium left color="white">{{ statusIcon }}</v-icon>
                      </div>
                    </div>
                    <div class="investigation-details__container__stats__cards__card-right">
                      <h3 class="investigation-details__container__stats__cards__card-right__title">
                        {{ statsAndMenuData && statsAndMenuData.status }}
                      </h3>
                      <p class="investigation-details__container__stats__cards__card-right__stats">
                        <v-tooltip
                          v-if="
                            statsAndMenuData &&
                            statsAndMenuData.status == 'Running' &&
                            statsAndMenuData.estimatedTime
                          "
                          bottom
                          opacity="1"
                          max-width="230"
                        >
                          <template v-slot:activator="{ on }">
                            <div v-on="on">
                              {{ statsAndMenuData && statsAndMenuData.estimatedTime }} remaining
                            </div>
                          </template>
                          <p class="tooltip-wrapper">
                            Actual remaining time may be different from estimated time and is
                            depended on conditions such as online user count, mailbox size, etc.
                          </p>
                        </v-tooltip>
                        <span v-else>{{ getStatusText('statusTime', null) }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </InvestigationDetailsTopBarLoading>
            <InvestigationDetailsTopBarLoading :loading="topMenuLoading" class="w-100">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__stats__cards">
                  <div class="investigation-details__container__stats__cards__card">
                    <div class="investigation-details__container__stats__cards__card-left">
                      <div
                        class="investigation-details__container__stats__cards__card-left__icon"
                        :class="
                          statsAndMenuData && statsAndMenuData.status == 'Running'
                            ? 'bg-macaroni'
                            : statsAndMenuData && statsAndMenuData.status == 'Finished'
                            ? 'bg-turquoise'
                            : statsAndMenuData && statsAndMenuData.status == 'Expired'
                            ? 'bg-macaroni'
                            : 'bg-macaroni'
                        "
                      >
                        <v-icon medium left color="white">mdi-account</v-icon>
                      </div>
                    </div>
                    <div class="investigation-details__container__stats__cards__card-right">
                      <h3 class="investigation-details__container__stats__cards__card-right__title">
                        {{
                          getStatusText(
                            'notScannedUserCount',
                            statsAndMenuData && statsAndMenuData.notScannedUserCount
                          )
                        }}
                      </h3>
                      <p class="investigation-details__container__stats__cards__card-right__stats">
                        {{
                          getStatusText(
                            'totalUserCount',
                            statsAndMenuData && statsAndMenuData.totalUserCount
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </InvestigationDetailsTopBarLoading>
          </div>
          <div class="investigation-details__container__stats-right-col">
            <InvestigationDetailsTopBarLoading :loading="topMenuLoading" class="w-100">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__stats__cards">
                  <div class="investigation-details__container__stats__cards__card">
                    <div class="investigation-details__container__stats__cards__card-left">
                      <div
                        class="investigation-details__container__stats__cards__card-left__icon bg-green"
                      >
                        <v-icon medium left color="white">mdi-account-circle</v-icon>
                      </div>
                    </div>
                    <div class="investigation-details__container__stats__cards__card-right">
                      <h3 class="investigation-details__container__stats__cards__card-right__title">
                        {{
                          getStatusText(
                            'scannedUserCount',
                            statsAndMenuData.completedScannedUserCount
                          )
                        }}
                      </h3>
                      <p class="investigation-details__container__stats__cards__card-right__stats">
                        {{
                          getStatusText(
                            'totalUserCountScannedUser',
                            statsAndMenuData.totalUserCount
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </InvestigationDetailsTopBarLoading>
            <InvestigationDetailsTopBarLoading :loading="topMenuLoading" class="w-100">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__stats__cards">
                  <div class="investigation-details__container__stats__cards__card">
                    <div class="investigation-details__container__stats__cards__card-left">
                      <div
                        class="investigation-details__container__stats__cards__card-left__icon bg-blue"
                      >
                        <v-icon medium left color="white">mdi-email</v-icon>
                      </div>
                    </div>
                    <div class="investigation-details__container__stats__cards__card-right">
                      <h3 class="investigation-details__container__stats__cards__card-right__title">
                        {{ getStatusText('scannedEmailCount', statsAndMenuData.scannedEmailCount) }}
                      </h3>
                      <p class="investigation-details__container__stats__cards__card-right__stats">
                        {{ getStatusText('totalEmailCount', statsAndMenuData.totalEmailCount) }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </InvestigationDetailsTopBarLoading>
          </div>
        </div>

        <div class="investigation-details__container__content card v-card v-sheet theme--light">
          <div class="investigation-details__container__content--left-menu">
            <InvestigationDetailsLeftBarLoading :loading="leftMenuLoading">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__content--left-menu--time">
                  <div
                    id="text--investigation-details-expiry-time"
                    class="investigation-details__container__content--left-menu--time--labels"
                  >
                    Expiry Time
                  </div>
                  <div class="investigation-details__container__content--left-menu--time--progress">
                    <span id="text--investigation-details-create-time">{{
                      investigationDetailsData.createTime
                    }}</span>
                    <span id="text--investigation-details-expire-date">{{
                      investigationDetailsData.expireDate
                    }}</span>
                  </div>
                  <div
                    class="investigation-details__container__content--left-menu--time--progress--bar"
                  >
                    <v-progress-linear
                      :value="progressValue"
                      id="input--investigation-details-progress"
                      background-color="#b3d4fc"
                      color="#2196f3"
                    ></v-progress-linear>
                  </div>
                  <div
                    class="investigation-details__container__content--left-menu--time--left-date"
                  >
                    {{ diffDays === 0 ? 0 : diffDays }} {{ diffDays > 1 ? 'days' : 'day' }}
                  </div>
                </div>
                <div class="investigation-details__container__content--left-menu--mail-menu">
                  <v-card>
                    <v-navigation-drawer permanent>
                      <v-list dense nav>
                        <v-list-item
                          id="btn--investigation-details-target-users"
                          link
                          @click="menuClick('targetUsers')"
                          :class="{ 'v-list-item--active': activeMenu == 'targetUsers' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-account-multiple</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Target Users
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  investigationDetailsTargetUsersListData &&
                                  investigationDetailsTargetUsersListData.results
                                "
                                >{{
                                  investigationDetailsTargetUsersListData &&
                                  investigationDetailsTargetUsersListData.results.length
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <p class="v-list-item__archived--title pt-4 pb-2">
                          Folders
                        </p>
                        <v-list-item
                          id="btn--investigation-details-inbox"
                          link
                          @click="menuClick('Inbox')"
                          :class="{ 'v-list-item--active': activeMenu == 'Inbox' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-inbox</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Inbox
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Inbox'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Inbox'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Inbox'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Inbox'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-junk"
                          link
                          @click="menuClick('JunkEmail')"
                          :class="{ 'v-list-item--active': activeMenu == 'JunkEmail' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-alert</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Junk
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'JunkEmail'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'JunkEmail'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'JunkEmail'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'JunkEmail'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          link
                          id="btn--investigation-details-draft"
                          @click="menuClick('Drafts')"
                          :class="{ 'v-list-item--active': activeMenu == 'Drafts' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-file</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Draft
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Drafts'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Drafts'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Drafts'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'Drafts'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-sent"
                          link
                          @click="menuClick('SentItems')"
                          :class="{ 'v-list-item--active': activeMenu == 'SentItems' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-send</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Sent
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'SentItems'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'SentItems'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'SentItems'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'SentItems'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-deleted-items"
                          link
                          @click="menuClick('DeletedItems')"
                          :class="{ 'v-list-item--active': activeMenu == 'DeletedItems' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-delete</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Deleted Items
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'DeletedItems'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'DeletedItems'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'DeletedItems'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item.folderName == 'DeletedItems'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-others"
                          link
                          @click="menuClick('Others')"
                          :class="{ 'v-list-item--active': activeMenu == 'Others' }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-plus-box</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Others
                              <span
                                class="v-list-item-title__value"
                                v-if="
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item && item.folderName && item.folderName == 'Others'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item && item.folderName && item.folderName == 'Others'
                                  ).mailCount
                                "
                                >{{
                                  statsAndMenuData.folders &&
                                  statsAndMenuData.folders.find(
                                    (item) => item && item.folderName && item.folderName == 'Others'
                                  ) &&
                                  statsAndMenuData.folders.find(
                                    (item) => item && item.folderName && item.folderName == 'Others'
                                  ).mailCount
                                }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-divider></v-divider>
                        </v-list-item>
                        <p class="v-list-item__archived--title">
                          Archived
                        </p>
                        <v-list-item
                          id="btn--investigation-details-stored"
                          link
                          @click="menuClick('Stored')"
                          class="v-list-item__archived--main"
                          :class="{ 'v-list-item--active': activeMenu == 'Stored' }"
                        >
                          <div class="v-list-item__archived"></div>
                          <div class="v-list-item__archived--link">
                            <v-list-item-icon>
                              <v-icon medium left color="#909399">mdi-clipboard-arrow-down</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                              <v-list-item-title>
                                Stored
                                <span
                                  class="v-list-item-title__value"
                                  v-if="
                                    statsAndMenuData.folders &&
                                    statsAndMenuData.folders.find(
                                      (item) => item.folderName == 'Stored'
                                    ) &&
                                    statsAndMenuData.folders.find(
                                      (item) => item.folderName == 'Stored'
                                    ).mailCount
                                  "
                                  >{{
                                    statsAndMenuData.folders &&
                                    statsAndMenuData.folders.find(
                                      (item) => item.folderName == 'Inbox'
                                    ) &&
                                    statsAndMenuData.folders.find(
                                      (item) => item.folderName == 'Inbox'
                                    ).mailCount
                                  }}</span
                                >
                              </v-list-item-title>
                            </v-list-item-content>
                          </div>
                        </v-list-item>
                        <v-list-item></v-list-item>
                      </v-list>
                    </v-navigation-drawer>
                  </v-card>
                </div>
              </template>
            </InvestigationDetailsLeftBarLoading>
          </div>
          <div class="investigation-details__container__content--right-menu">
            <ThreeRowLoading :loading="contentMenuLoading">
              <template v-slot:skeleton-content>
                <div class="investigation-details__container__content--right-menu__summary">
                  <div
                    class="investigation-details__container__content--right-menu__summary__item"
                    style="flex-direction: column;"
                  >
                    <div
                      id="card--investigation-details-investigation-name"
                      class="investigation-details__container__content--right-menu__summary__item--text-header"
                    >
                      Investigation Name:<span
                        class="investigation-details__container__content--right-menu__summary__item--text-content ml-2"
                        >{{ investigationDetailsData.name }}
                      </span>
                    </div>
                    <div
                      id="card--investigation-details-email-date-range"
                      class="investigation-details__container__content--right-menu__summary__item mt-2"
                    >
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-header"
                      >
                        Email Date Range:
                      </div>
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-content ml-2"
                      >
                        {{ investigationDetailsData.startDate }} -
                        {{ investigationDetailsData.endDate }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="investigation-details__container__content--right-menu__summary__item--action-button-container"
                  >
                    <div
                      class="investigation-details__container__content--right-menu__summary__item--action-button"
                      v-if="statsAndMenuData.status === 'Running'"
                    >
                      <v-btn
                        id="btn-stop--investigation-details-card"
                        class="ma-2"
                        outlined
                        color="#2196f3"
                        @click="stopInvestigationFunc"
                      >
                        <v-icon medium left color="#2196f3">mdi-stop</v-icon>
                        Stop
                      </v-btn>
                    </div>
                    <div
                      id="btn-duplicate--investigation-details-card"
                      class="investigation-details__container__content--right-menu__summary__item--action-button"
                    >
                      <v-btn class="ma-2" outlined color="#2196f3" @click="startInvestigationFunc">
                        <v-icon medium left color="#2196f3">mdi-content-copy</v-icon>
                        Duplicate
                      </v-btn>
                    </div>
                  </div>
                </div>
                <div
                  id="container--investigation-details-target-users"
                  class="investigation-details__container__content--right-menu__target-users"
                >
                  <p
                    id="text--investigation-details-card-target-users"
                    class="investigation-details__container__content--right-menu__target-users--header"
                  >
                    Target Users:
                  </p>
                  <div
                    class="investigation-details__container__content--right-menu__target-users--list"
                    v-if="investigationDetailsData.targetUserType !== 'AllUsers'"
                  >
                    <show-more
                      :data="targetUserChips"
                      btn-show-more-id="btn-show-more--target-users"
                    />
                  </div>
                  <div
                    id="badge--investigation-details-card-all-users"
                    class="investigation-details__container__content--right-menu__target-users--list"
                    v-else
                  >
                    <v-chip>All Users</v-chip>
                  </div>
                </div>
                <div
                  id="container--investigation-details-criteria"
                  class="investigation-details__container__content--right-menu__filters"
                >
                  <p
                    id="text--investigation-details-card-criteria"
                    class="investigation-details__container__content--right-menu__filters--header"
                  >
                    Criteria:
                  </p>
                  <show-more :data="criteriaChips" btn-show-more-id="btn-show-more--criteria" />
                </div>
              </template>
            </ThreeRowLoading>
            <DatatableLoading :loading="loading" v-if="loading" />
            <div v-show="activeMenu !== 'targetUsers'">
              <datatable
                :is-column-filter-active="isColumnFilterActive"
                id="investigationDetailsList"
                :refName="'investigationDetailsListTable'"
                ref="refInvestigationListData"
                :columns="columns"
                :table="investigationDetailsList"
                :show-all-records="showAllRecordsFolder"
                :total-number-of-records="totalNumberOfRecordsFolder"
                :pageSizes="pageSizes"
                :selectable="true"
                :filterable="true"
                :options="true"
                :rowActions="rowActions"
                :empty="iEmpty"
                :selectEvent="selectEvent"
                :stored-table-settings="storedTableDetailsList"
                :chartOptions="chartOptions"
                :clusterItems="clusterItems"
                @deleteInvestigationDetailsFunction="deleteInvestigationDetailsFunction($event)"
                @sendInvestigationdetailsWarningMessage="
                  sendInvestigationdetailsWarningMessage($event)
                "
                @deleteAndNotifyInvestigationDetailsFunction="
                  deleteAndNotifyInvestigationDetailsFunction($event)
                "
                @downloadEvent="exportInvestigationEmails"
                v-show="showEmails"
                @columnFilterChanged="columnFilterChanged"
                @columnFilterCleared="columnFilterCleared"
                @refreshAction="refreshDatatable"
                @on-all-records-button-click="handleAllRecordsInboxClick"
                @set-default-search="handleSetDefaultSearch"
                @restore-default-search="handleRestoreDefaultSearch"
                @clear-filters="handleClearFilters"
                @on-table-settings-change="handleSetRenderedColumnsDetailsList"
                :show-filter-options="false"
                @server-side-page-number-changed="serverSidePageNumberChanged"
                @server-side-size-changed="serverSideSizeChanged"
                @sortChangedEvent="sortChanged"
                @searchChangedEvent="handleSearchChange"
                :isServerSide="true"
                :server-side-props="serverSideProps"
                :server-side-events="{ pagination: true, search: true, sort: true }"
              >
                <template v-slot:datatable-custom-column="{ scope }">
                  <template v-if="scope.row.emailLastAction">
                    <span class="d-flex align-center">
                      <span class="ml-2">
                        <v-tooltip
                          bottom
                          max-width="250"
                          content-class="investigation-details__tooltip"
                          v-if="getActionStatusOptions(scope.row.emailLastAction).isTooltip"
                        >
                          <template v-slot:activator="{ on }">
                            <div class="d-flex" v-on="on">
                              <v-icon
                                small
                                class="mr-1"
                                v-if="getActionStatusOptions(scope.row.emailLastAction).icon"
                                :color="getActionStatusOptions(scope.row.emailLastAction).color"
                                >{{
                                  getActionStatusOptions(scope.row.emailLastAction).icon
                                }}</v-icon
                              >
                              <span style="text-overflow: ellipsis; overflow: hidden;">{{
                                getActionStatusOptions(scope.row.emailLastAction).text
                              }}</span>
                            </div>
                          </template>
                          <span
                            >{{ getActionStatusOptions(scope.row.emailLastAction).tooltipText }}
                          </span>
                        </v-tooltip>
                        <span v-else>
                          <v-icon
                            small
                            class="mr-1"
                            max-width="250"
                            v-if="getActionStatusOptions(scope.row.emailLastAction).icon"
                            :color="getActionStatusOptions(scope.row.emailLastAction).color"
                            >{{ getActionStatusOptions(scope.row.emailLastAction).icon }}</v-icon
                          >
                          <span style="text-overflow: ellipsis; overflow: hidden;">{{
                            getActionStatusOptions(scope.row.emailLastAction).text
                          }}</span>
                        </span>
                      </span>
                    </span>
                  </template>
                  <span v-else> </span>
                </template>
              </datatable>
            </div>
            <div
              v-show="activeMenu === 'targetUsers' && showTargetUsersDetails"
              class="investigationDetails__target-users-table-container"
            >
              <datatable
                :is-column-filter-active="isColumnFilterActiveTargetUsers"
                id="investigationDetailsTargetUsersList"
                :refName="'investigationDetailsTargetUsersListTable'"
                ref="investigationDetailsTargetUsersList"
                :columns="columnsTargetUsers"
                :table="
                  investigationDetailsTargetUsersListData &&
                  investigationDetailsTargetUsersListData.results
                "
                :pageSizes="pageSizes"
                :defaultSort="'date'"
                :selectable="false"
                :filterable="true"
                :options="true"
                :total-number-of-records="totalNumberOfRecordsTargetUser"
                :empty="iEmpty"
                :show-all-records="showAllRecordsTargetUser"
                :stored-table-settings="storedTableTargetUser"
                :selectEvent="selectEvent"
                :chartOptions="chartOptions"
                :clusterItems="clusterItems"
                @deleteInvestigationDetailsFunction="deleteInvestigationDetailsFunction($event)"
                @sendInvestigationdetailsWarningMessage="
                  sendInvestigationdetailsWarningMessage($event)
                "
                @deleteAndNotifyInvestigationDetails="deleteAndNotifyInvestigationDetails($event)"
                v-if="showTargetUsersDetails"
                @downloadEvent="exportTargetUsers"
                @columnFilterChanged="columnFilterChangedTargetUsers"
                @columnFilterCleared="columnFilterClearedTargetUsers"
                @refreshAction="refreshDatatable"
                @on-all-records-button-click="handleAllRecordsTargetUsersClick"
                @set-default-search="handleSetDefaultSearchForTargetUsers"
                @restore-default-search="handleRestoreDefaultSearchForTargetUsers"
                @clear-filters="handleClearFiltersForTargetUsers"
                @on-table-settings-change="handleSetRenderedColumnsTargetUser"
                :show-filter-options="false"
                @server-side-page-number-changed="serverSidePageNumberChangedForTargetUsers"
                @server-side-size-changed="serverSideSizeChangedForTargetUsers"
                @sortChangedEvent="sortChangedForTargetUsers"
                @searchChangedEvent="handleSearchChangeForTargetUsers"
                :isServerSide="true"
                :server-side-props="serverSideProps"
                :server-side-events="{ pagination: true, search: true, sort: true }"
              >
                <template v-slot:datatable-custom-column="{ scope }">
                  <div class="datatable-progress">
                    <template v-if="scope.row && parseInt(scope.row.analyzedMailCount) >= 0">
                      <span
                        :class="[
                          Math.floor(scope.row.analyzedMailCount / scope.row.filteredMailCount) !==
                            1 && 'ml-1'
                        ]"
                        class="datatable-progress__per"
                        >{{ getProgressText(scope) }}</span
                      >
                      <v-progress-linear
                        :value="getProgressValue(scope)"
                        background-color="#b3d4fc"
                        color="#2196f3"
                        height="4"
                        reactive
                        rounded
                      />
                      <span class="datatable-progress__stats">
                        {{ scope.row.analyzedMailCount + ' / ' + scope.row.filteredMailCount }}
                        mails
                      </span>
                    </template>
                    <span v-else>
                      <v-progress-linear
                        :value="0"
                        background-color="#e0e0e0"
                        color="#2196f3"
                        height="4"
                        reactive
                        rounded
                    /></span>
                  </div>
                </template>
              </datatable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
import newInvestigation from '../components/Investigation/NewInvestigation'
import { mapGetters } from 'vuex'
import moment from 'moment'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '../model/constants/commonConstants'
import AppDialog from '../components/AppDialog'
import { exportInvestigationEmailList, exportInvestigationUserList } from '../api/incidentResponder'
import ShowMore from '../components/Common/ShowMore/ShowMore'
import { getDataTableFieldLabel, getTimeZoneForMoment } from '../utils/functions'
import { required, trim } from '@/utils/validations'
import InvestigationDetailsLeftBarLoading from '../components/SkeletonLoading/InvestigationDetailsLeftBarLoading'
import InvestigationDetailsTopBarLoading from '../components/SkeletonLoading/InvestigationDetailsTopBarLoading'
import ThreeRowLoading from '../components/SkeletonLoading/ThreeRowLoading'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { deleteAndMessageInvestigationDetailsItem } from '@/api/investigations'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
export default {
  components: {
    DatatableLoading,
    AppDialogFooter,
    Datatable,
    newInvestigation,
    AppDialog,
    ShowMore,
    InvestigationDetailsLeftBarLoading,
    InvestigationDetailsTopBarLoading,
    ThreeRowLoading
  },
  data: () => ({
    showAllRecordsTargetUser: false,
    totalNumberOfRecordsTargetUser: 0,
    showAllRecordsFolder: false,
    storedTableDetailsList: null,
    storedTableTargetUser: null,
    totalNumberOfRecordsFolder: 0,
    warningButtonDisabled: false,
    warnAndDeleteButtonDisabled: false,
    stopButtonDisabled: false,
    labels,
    isColumnFilterActive: false,
    isColumnFilterActiveTargetUsers: false,
    loading: true,
    topMenuLoading: true,
    leftMenuLoading: true,
    contentMenuLoading: true,
    isWantToAddNewCommunity: false,
    progressValue: null,
    notifyMessage: null,
    notifyMessageWithDelete: null,
    diffDays: null,
    activeMenu: 'Inbox',
    warningMessage: 'Send a warning message for this email',
    statusIcon: 'mdi-check',
    showEmails: false,
    showTargetUsersDetails: false,
    isWantToDelete: false,
    isWantToWarn: false,
    isWantToStop: false,
    targetUserChips: [],
    criteriaChips: [],
    isWantToWarnAndDelete: false,
    totalSelectedItemsCount: [],
    investigationDetailsList: [],
    validations: {
      required,
      trim
    },
    investigationListBodyData: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'ReceivedTime',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'Folder',
                Operator: 'Include',
                Value: 'Inbox'
              }
            ],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    defaultRequestBody: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'ReceivedTime',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'Folder',
                Operator: 'Include',
                Value: 'Inbox'
              }
            ],
            FilterGroups: []
          }
        ]
      }
    },
    investigationTargetUsersListBodyData: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'Email',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    defaultRequestBodyForTargetUsers: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'Email',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    columns: [
      // Should be defined to show the table
      {
        property: 'from',
        align: 'left',
        editable: false,
        label: getStoreValue('from'),
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        minWidth: 260,
        filterableType: 'text'
      },
      {
        property: 'recipient',
        align: 'left',
        editable: false,
        label: getStoreValue('to'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'textWithBadge',
        width: 260,
        cellPadding: 8
      },
      {
        property: 'subject',
        align: 'left',
        editable: false,
        label: getStoreValue('subject'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'text'
      },
      {
        property: 'attachmentCount',
        align: 'center',
        editable: false,
        label: getStoreValue('attachmentCount'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'attachment',
        width: 120
      },
      {
        property: 'scanType',
        align: 'center',
        editable: false,
        label: getStoreValue('scanType'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'service',
        width: 120,
        filterableType: 'select',
        filterableItems: ['Outlook', 'O365', 'Exchange', 'GSuite']
      },
      {
        property: 'filterTags',
        align: 'left',
        isEditable: false,
        type: 'textWithBadge',
        show: true,
        label: 'Filtered By',
        width: 160,
        cellPadding: 8,
        hasMapper: true
      },
      {
        property: 'investigationStatus',
        align: 'left',
        sortable: true,
        label: 'Status',
        show: true,
        width: 280,
        type: 'slot'
      }
    ],
    columnsTargetUsers: [
      {
        property: PROPERTY_STORE.EMAIL,
        align: 'left',
        editable: false,
        label: getStoreValue(PROPERTY_STORE.EMAIL),
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'text',
        width: 260
      },
      {
        property: 'userStatus',
        align: 'center',
        editable: false,
        label: getStoreValue('userStatus'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'detected',
        filterableType: 'select',
        width: 150,
        filterableItems: ['Online', 'Offline']
      },

      {
        property: 'duration',
        align: 'left',
        editable: false,
        label: getStoreValue('duration'),
        fixed: false,
        sortable: true,
        show: true,
        width: 140,
        type: 'text'
      },
      {
        property: PROPERTY_STORE.LASTSEEN,
        align: 'left',
        editable: false,
        label: getStoreValue(PROPERTY_STORE.LASTSEEN),
        fixed: false,
        sortable: true,
        width: 180,
        show: true,
        type: 'text'
      },
      {
        property: 'status',
        align: 'center',
        editable: false,
        label: 'Scan Status',
        fixed: false,
        sortable: true,
        show: true,
        width: 150,
        type: 'status'
      },
      {
        property: 'scanType',
        align: 'center',
        editable: false,
        label: getStoreValue('scanType'),
        fixed: false,
        sortable: true,
        show: true,
        width: 180,
        type: 'service',
        filterableType: 'select',
        filterableItems: ['Outlook', 'O365', 'Exchange', 'GSuite']
      },
      {
        property: 'analyzedMailCount',
        align: 'center',
        label: 'Progress',
        fixed: false,
        sortable: false,
        show: true,
        minWidth: 120,
        type: 'slot'
      }
    ],
    pageSizes: [5, 10, 25],
    rowActions: [
      {
        id: 'btn-delete--investigation-details-row-actions',
        name: 'Delete',
        icon: 'mdi-delete',
        action: 'deleteInvestigationDetails',
        isNotShow: true
      },
      {
        id: 'btn-send-warning-message--investigation-details-row-actions',
        name: 'Send user a warning message',
        icon: 'mdi-alert',
        action: 'sendWarningMessage'
      },
      {
        id: 'btn-delete-and-notify--investigation-details-row-actions',
        name: 'Delete and notify user',
        icon: 'mdi-delete',
        action: 'deleteAndNotifyInvestigationDetails'
      }
    ],

    clusterItems: [
      {
        name: 'Name',
        action: 'nameCluster',
        seledted: false
      },
      {
        name: 'City',
        action: 'cityCluster',
        seledted: false
      },
      {
        name: 'Address',
        action: 'addressCluster',
        seledted: false
      }
    ],
    addUsers: {
      show: true,
      popUp: false,
      action: 'createCommunityFromMobileInfo'
    },
    iEmpty: {
      message: 'No email has been found, yet'
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
      backgroundColor: ['#3f51b5', '#00bcd4']
    },
    bodyData: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'ExpireDate',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'Status',
                Operator: 'Include',
                Value: 'Canceled,Running,Idle'
              }
            ],
            FilterGroups: []
          }
        ]
      }
    },
    serverSideProps: new ServerSideProps()
  }),
  methods: {
    serverSideSizeChangedForTargetUsers(pageSize = 10) {
      //generic
      this.investigationTargetUsersListBodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumberForTargetUsers()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.refreshDatatable()
    },
    resetPageNumberForTargetUsers() {
      //generic
      this.investigationTargetUsersListBodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChangeForTargetUsers(searchFilter = {}, filterActive = false) {
      //generic
      this.investigationTargetUsersListBodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.isColumnFilterActive = filterActive
      this.refreshDatatable()
    },
    setQueryValuesToPayloadForTargetUsers({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.investigationTargetUsersListBodyData.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.investigationTargetUsersListBodyData.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChangedForTargetUsers(pageNumber = 1) {
      //generic
      this.investigationTargetUsersListBodyData.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.refreshDatatable()
    },
    sortChangedForTargetUsers({ order, prop } = {}) {
      //generic
      this.investigationTargetUsersListBodyData.ascending = order === 'ascending'
      this.investigationTargetUsersListBodyData.orderBy = prop
      this.refreshDatatable()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.investigationListBodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.refreshDatatable()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_LIST,
        JSON.stringify(tableSettings)
      )
    },
    resetPageNumber() {
      //generic
      this.investigationListBodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.investigationListBodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.isColumnFilterActive = filterActive
      this.refreshDatatable()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.investigationListBodyData.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.investigationListBodyData.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.investigationListBodyData.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.refreshDatatable()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.investigationListBodyData.ascending = order === 'ascending'
      this.investigationListBodyData.orderBy = prop
      this.refreshDatatable()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSFOLDER)
      )
      if (savedFilter) {
        this.investigationListBodyData.filter = savedFilter.filter
        this.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refInvestigationListData.filterValues = savedFilter.filterValues
          this.$refs.refInvestigationListData.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.refreshDatatable()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.investigationListBodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refInvestigationListData.filterValues = {}
      this.$refs.refInvestigationListData.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSFOLDER)
      this.refreshDatatable()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSFOLDER,
        JSON.stringify({
          filter: this.investigationListBodyData.filter,
          filterValues
        })
      )
    },
    handleSetRenderedColumnsTargetUser(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_TARGET_USER,
        JSON.stringify(tableSettings)
      )
    },
    handleSetRenderedColumnsDetailsList(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_LIST,
        JSON.stringify(tableSettings)
      )
    },
    getDefaultFilterAndSearchForTargetUsers() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSTARGETUSERS)
      )
      if (savedFilter) {
        this.investigationTargetUsersListBodyData.filter = savedFilter.filter
        this.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.investigationDetailsTargetUsersList.filterValues = savedFilter.filterValues
          this.$refs.investigationDetailsTargetUsersList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.refreshDatatable()
    },
    handleClearFiltersForTargetUsers() {
      this.isRestoredOrClearedFilters = true
      this.investigationTargetUsersListBodyData = JSON.parse(
        JSON.stringify(this.defaultRequestBodyForTargetUsers)
      )
      this.$refs.investigationDetailsTargetUsersList.filterValues = {}
      this.$refs.investigationDetailsTargetUsersList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSTARGETUSERS)
      this.refreshDatatable()
    },
    handleRestoreDefaultSearchForTargetUsers() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearchForTargetUsers()
    },
    handleSetDefaultSearchForTargetUsers(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONSTARGETUSERS,
        JSON.stringify({
          filter: this.investigationTargetUsersListBodyData.filter,
          filterValues
        })
      )
    },
    getUserFriendlyName(activeMenu) {
      let name
      switch (activeMenu) {
        case 'SentItems':
          name = 'Sent'
          break
        case 'DeletedItems':
          name = 'Deleted Items'
          break
        case 'JunkEmail':
          name = 'Junk'
          break
        case 'Drafts':
          name = 'Draft'
          break
        case 'Others':
          name = 'Others'
          break
        case 'Stored':
          name = 'Stored'
          break
        default:
          name = 'Inbox'
          break
      }
      return name
    },
    handleAllRecordsTargetUsersClick() {
      this.investigationTargetUsersListBodyData.pageSize = 75000
      this.showAllRecordsTargetUser = false
      this.refreshDatatable()
    },
    handleAllRecordsInboxClick() {
      this.investigationListBodyData.pageSize = 75000
      this.showAllRecordsFolder = false
      this.refreshDatatable()
    },
    getActionStatusOptions(
      actionStatusItem,
      { actionType, status, isPermanentDelete, isTooltip, tooltipText, text } = actionStatusItem
    ) {
      let returnValue = {
        isTooltip: isTooltip,
        color: null,
        icon: null,
        tooltipText: tooltipText,
        text: text
      }
      //exampple
      //status = 'CompletedWithError'
      //actionType = 'Warning'
      //isPermanentDelete = false
      switch (status) {
        case 'Idle':
          if (actionType === 'Delete') {
            if (isPermanentDelete) {
              returnValue.icon = null
              returnValue.color = '#fff'
            } else {
              returnValue.icon = null
              returnValue.color = '#fff'
            }
          } else if (actionType === 'DeleteAndNotify') {
            if (isPermanentDelete) {
              returnValue.icon = null
              returnValue.color = '#fff'
            } else {
              returnValue.icon = null
              returnValue.color = '#fff'
            }
          } else if (actionType === 'Warning') {
            returnValue.icon = 'mdi-check-circle'
            returnValue.color = '#43a047'
          }
          break
        case 'Completed':
          if (actionType === 'Delete') {
            if (isPermanentDelete) {
              returnValue.icon = 'mdi-close-circle'
              returnValue.color = '#6d6d6d'
            } else {
              returnValue.icon = 'mdi-delete'
              returnValue.color = '#6d6d6d'
            }
          } else if (actionType === 'DeleteAndNotify') {
            if (isPermanentDelete) {
              returnValue.icon = 'mdi-close-circle'
              returnValue.color = '#6d6d6d'
            } else {
              returnValue.icon = 'mdi-close-circle'
              returnValue.color = '#6d6d6d'
            }
          } else if (actionType === 'Warning') {
            returnValue.icon = 'mdi-check-underline-circle'
            returnValue.color = '#43a047'
          }
          break
        case 'CompletedWithError':
          if (actionType === 'Delete') {
            if (isPermanentDelete) {
              returnValue.icon = 'mdi-alert-circle'
              returnValue.color = '#f56c6c'
            } else {
              returnValue.icon = 'mdi-alert-circle'
              returnValue.color = '#f56c6c'
            }
          } else if (actionType === 'DeleteAndNotify') {
            if (isPermanentDelete) {
              returnValue.icon = 'mdi-alert-circle'
              returnValue.color = '#f56c6c'
            } else {
              returnValue.icon = 'mdi-alert-circle'
              returnValue.color = '#f56c6c'
            }
          } else if (actionType === 'Warning') {
            returnValue.icon = 'mdi-alert-circle'
            returnValue.color = '#f56c6c'
          }
          break
        case 'ItemNotFound':
          returnValue.icon = 'mdi-alert-circle'
          returnValue.color = '#f56c6c'
          break
        default:
          break
      }
      return returnValue
    },
    getProgressText(scope) {
      return Math.floor(scope.row.analyzedMailCount / scope.row.filteredMailCount) === 1 ||
        scope.row.status === 'Completed'
        ? 'Completed'
        : !isNaN(scope.row.analyzedMailCount / scope.row.filteredMailCount)
        ? Math.floor((scope.row.analyzedMailCount / scope.row.filteredMailCount) * 100) + '%'
        : 0 + '%'
    },
    getProgressValue(scope) {
      if (scope.row.analyzedMailCount === 0 && scope.row.filteredMailCount === 0) {
        return 100
      }
      return Math.floor((scope.row.analyzedMailCount / scope.row.filteredMailCount) * 100)
    },
    getIconColor(status) {
      let retValue
      switch (status) {
        case 'Running':
        case 'Completed':
          retValue = '#43a047'
          break
        case 'CompletedWithError':
        case 'ItemNotFound':
          retValue = '#f56c6c'
          break
        default:
          break
      }
      return retValue
    },
    getInboxStatus(status) {
      return getDataTableFieldLabel(status)
    },
    getIconName(status) {
      let retValue
      switch (status) {
        case 'Running':
          retValue = 'mdi-check-circle'
          break
        case 'Completed':
          retValue = 'mdi-check-underline-circle'
          break
        case 'CompletedWithError':
        case 'ItemNotFound':
          retValue = 'mdi-alert-circle'
          break
        default:
          break
      }
      return retValue
    },
    getTooltipText(action) {
      let retValue = ''
      if (action.warningMessage) {
        retValue += action.warningMessage
      }
      if (action.actionResultErrorMessage && action.warningMessage) {
        retValue = `${retValue}\n\n"${action.actionResultErrorMessage}"`
      } else if (action.actionResultErrorMessage) {
        retValue = `${action.actionResultErrorMessage}"`
      }
      return retValue
    },
    exportInvestigationEmails({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      let fileName = 'Investigation Details '
      switch (this.activeMenu) {
        case 'SentItems':
          fileName += 'Sent'
          break
        case 'DeletedItems':
          fileName += 'Deleted Items'
          break
        case 'JunkEmail':
          fileName += 'Junk'
          break
        case 'Drafts':
          fileName += 'Draft'
          break
        case 'Others':
          fileName += 'Others'
          break
        case 'Stored':
          fileName += 'Stored'
          break
        default:
          fileName += 'Inbox'
          break
      }

      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.investigationListBodyData.filter)),
        this.$refs.refInvestigationListData,
        'ReceivedTime'
      )
      if (this.$refs.refInvestigationListData.search) {
        clientTableExportHelper.addSearchItems(this.columns)
      }
      if (
        this.$refs.refInvestigationListData.sortProps &&
        this.$refs.refInvestigationListData.sortProps.order
      ) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper

      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: reportAllPages ? this.investigationDetailsList.length + 25 : pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportInvestigationEmailList(payload, this.$route.params.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `${fileName}.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    exportTargetUsers({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.investigationTargetUsersListBodyData.filter)),
        this.$refs.investigationDetailsTargetUsersList,
        'Email'
      )
      if (this.$refs.investigationDetailsTargetUsersList.search) {
        clientTableExportHelper.addSearchItems(this.columnsTargetUsers)
      }
      if (
        this.$refs.investigationDetailsTargetUsersList.sortProps &&
        this.$refs.investigationDetailsTargetUsersList.sortProps.order
      ) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper

      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber,
          pageSize: reportAllPages ? 50000 : pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }

        exportInvestigationUserList(payload, this.$route.params.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Investigation Details Target Users.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    deleteMessage() {
      return `${this.totalSelectedItemsCount} ${
        this.totalSelectedItemsCount > 1 ? 'emails' : 'email'
      } will be deleted from ${this.getUserFriendlyName(this.activeMenu)}`
    },
    calculateProgressData() {
      let today = moment(new Date()).toDate()
      let createDate = moment(
        this.investigationDetailsData.createTime.split(' ')[0],
        getTimeZoneForMoment()
      ).toDate()
      let expireDate = moment(
        this.investigationDetailsData.expireDate.split(' ')[0],
        getTimeZoneForMoment()
      ).toDate()
      let startDate = moment(
        this.investigationDetailsData.startDate.split(' ')[0],
        getTimeZoneForMoment()
      ).toDate()
      let diffDays = parseInt((expireDate - today) / (1000 * 60 * 60 * 24), 10)
      let totalDays = parseInt((expireDate - createDate) / (1000 * 60 * 60 * 24), 10)
      this.diffDays = diffDays
      let progressValue = 100 - (diffDays === 0 ? 100 : diffDays * 100) / totalDays
      if (diffDays <= 0) {
        this.diffDays = 0
        this.progressValue = 100
      } else {
        this.progressValue = progressValue
      }
    },
    isWantToStopConfirm() {
      this.stopButtonDisabled = true
      this.$store
        .dispatch('investigations/cancelInvestigation', this.$route.params.id)
        .catch(() => {})
        .finally(() => {
          this.isWantToStop = false
          this.stopButtonDisabled = false
          this.refreshDatatable()
          this.restartStopInvestigationData()
        })
    },
    stopInvestigationFunc(value) {
      this.isWantToStop = true
    },
    iconType() {
      this.statsAndMenuData.status == 'Running'
        ? (this.statusIcon = 'mdi-play')
        : this.statsAndMenuData.status == 'Finished'
        ? (this.statusIcon = 'mdi-check')
        : this.statsAndMenuData.status == 'Expired'
        ? (this.statusIcon = 'mdi-clock')
        : (this.statusIcon = 'mdi-close')
    },
    getStatusText(section, val) {
      if (val == null) val = 0
      this.iconType()
      //this.statsAndMenuData.estimatedTime = 'asd'

      switch (section) {
        case 'statusTime':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return this.statsAndMenuData.estimatedTime
                ? this.statsAndMenuData.estimatedTime
                : 'Estimated time can not be calculated at the moment'
            case 'Canceled':
              return this.investigationDetailsData.endDate
            case 'Expired':
              return this.investigationDetailsData.expireDate
            case 'Finished':
              return this.investigationDetailsData.endDate
            default:
              break
          }
          break
        case 'notScannedUserCount':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `${val} User(s)`
            case 'Canceled':
              return `${val} User(s)`
            case 'Expired':
              return `${val} User(s)`
            case 'Finished':
              return 'All users scanned'
            default:
              break
          }
          break
        case 'totalUserCount':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `Could not be scanned`
            case 'Canceled':
              return `Could not be scanned`
            case 'Expired':
              return `Could not be scanned`
            case 'Finished':
              return 'No remaining users'
            default:
              break
          }
          break
        case 'scannedUserCount':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `${val} Scanned User(s)`
            case 'Canceled':
              return `${val} Scanned User(s)`
            case 'Expired':
              return `${val} Scanned User(s)`
            case 'Finished':
              return `${val} Scanned User(s)`
            default:
              break
          }
          break
        case 'totalUserCountScannedUser':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `of total ${val} user(s)`
            case 'Canceled':
              return `of total ${val} user(s)`
            case 'Expired':
              return `of total ${val} user(s)`
            case 'Finished':
              return `of total ${val} user(s)`
            default:
              break
          }
          break
        case 'scannedEmailCount':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `${val} Email(s) Scanned`
            case 'Canceled':
              return `${val} Email(s) Scanned`
            case 'Expired':
              return `${val} Email(s) Scanned`
            case 'Finished':
              return `${val} Email(s) Scanned`
            default:
              break
          }
          break
        case 'totalEmailCount':
          switch (this.statsAndMenuData.status) {
            case 'Running':
              return `of total ${val} email(s)`
            case 'Canceled':
              return `of total ${val} email(s)`
            case 'Expired':
              return `of total ${val} email(s)`
            case 'Finished':
              return `of total ${val} email(s)`
            default:
              break
          }
          break

        default:
          break
      }
    },
    menuClick(menu) {
      this.activeMenu = menu
      this.showTargetUsersDetails = false
      this.showEmails = false
      this.investigationDetailsList = []

      if (menu != 'targetUsers') {
        this.loading = true
        let dataBody = this.investigationListBodyData
        while (dataBody.filter.FilterGroups[0].FilterItems.length > 1) {
          dataBody.filter.FilterGroups[0].FilterItems.pop()
        }
        dataBody.filter.FilterGroups[0].FilterItems[0].Value = menu
        this.refreshDatatable()
        /*this.$store
          .dispatch('investigations/getInvestigationDetailsListData', {
            data: dataBody,
            id: this.$route.params.id
          })
          .finally(() => {
            this.loading = false
            this.showEmails = true
            //vm.$forceUpdate()
          })*/
      } else {
        //this.getDefaultFilterAndSearchForTargetUsers()
        this.$store
          .dispatch('investigations/getInvestigationDetailsTargetUsersListData', {
            data: this.investigationTargetUsersListBodyData,
            id: this.$route.params.id
          })
          .then((response) => {
            this.adjustTargetUserShowRecords(response)
          })
          .finally(() => {
            this.showTargetUsersDetails = true
            this.loading = false
            vm.$forceUpdate()
          })
      }
    },
    adjustTargetUserShowRecords(response = {}) {
      const {
        data: { data }
      } = response
      const { totalNumberOfRecords = 0 } = data
      this.totalNumberOfRecordsTargetUser = totalNumberOfRecords
      if (
        this.investigationTargetUsersListBodyData.pageSize === 1000 &&
        this.totalNumberOfRecordsTargetUser > 1000
      ) {
        this.showAllRecordsTargetUser = true
      }
      if (
        this.totalNumberOfRecordsTargetUser <= 1000 &&
        this.investigationTargetUsersListBodyData.pageSize === 1000
      ) {
        this.showAllRecordsTargetUser = false
      }
    },
    adjustInboxShowRecords(response = {}) {
      if (response.data) {
        const {
          data: { data }
        } = response
        this.totalNumberOfRecordsFolder = totalNumberOfRecords
        const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
        this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
        this.serverSideProps.totalNumberOfPages = totalNumberOfPages
        this.serverSideProps.pageNumber = pageNumber
        const { results = [] } = data
        this.tableData = results
        this.totalNumberOfRecords = totalNumberOfRecords
        if (
          this.investigationListBodyData.pageSize === 1000 &&
          this.totalNumberOfRecordsFolder > 1000
        ) {
          this.showAllRecordsFolder = true
        }
        if (
          this.totalNumberOfRecordsFolder <= 1000 &&
          this.investigationListBodyData.pageSize === 1000
        ) {
          this.showAllRecordsFolder = false
        }
      }
    },
    restartStopInvestigationData() {
      this.$store
        .dispatch('investigations/getStatsAndMenuData', this.$route.params.id)
        .finally(() => {
          this.$store
            .dispatch('investigations/getInvestigationDetailsData', this.$route.params.id)
            .finally(() => {
              this.$store
                .dispatch('investigations/getInvestigationDetailsListData', {
                  data: this.investigationListBodyData,
                  id: this.$route.params.id
                })
                .finally(() => {
                  this.showEmails = false
                  this.showTargetUsersDetails = false
                  this.showEmails = true
                  vm.$forceUpdate()
                })
            })
        })
    },
    refreshDatatable() {
      this.leftMenuLoading = true
      this.topMenuLoading = true
      this.loading = true
      this.$store
        .dispatch('investigations/getStatsAndMenuData', this.$route.params.id)
        .finally(() => {
          this.$store
            .dispatch('investigations/getInvestigationDetailsData', this.$route.params.id)
            .finally(() => {
              this.$store
                .dispatch('investigations/getInvestigationDetailsListData', {
                  data: this.investigationListBodyData,
                  id: this.$route.params.id
                })
                .then((response) => {
                  this.adjustInboxShowRecords(response)
                })
                .finally(() => {
                  this.calculateProgressData()
                  this.showEmails = false
                  this.showTargetUsersDetails = false
                  this.showTargetUsersDetails = this.activeMenu === 'targetUsers'
                  this.showEmails = this.activeMenu !== 'targetUsers'
                  this.$forceUpdate()
                  this.leftMenuLoading = false
                  this.topMenuLoading = false
                  this.loading = false
                })
            })
        })
      this.$store
        .dispatch('investigations/getInvestigationDetailsTargetUsersListData', {
          data: this.investigationTargetUsersListBodyData,
          id: this.$route.params.id
        })
        .then((response) => {
          this.adjustTargetUserShowRecords(response)
        })
    },
    onAddClose(resp) {
      // set mobile vision
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
      this.refreshDatatable()
      this.isWantToAddNewCommunity = false
    },
    createCommunityFromMobileInfo() {
      // open new investigation overlay
      this.isWantToAddNewCommunity = true
    },
    sendInvestigationdetailsWarningMessage(value, multi) {
      if (value && value.emailLastAction && value.emailLastAction.actionType === 'Warning') {
        this.notifyMessage = value.emailLastAction.warningMessage
      } else {
        this.notifyMessage = ''
      }

      this.isWantToWarn = true
      this.warningMessage =
        Array.isArray(value) && value.length && value.length > 1
          ? 'Send a warning message for this email'
          : 'Send a warning message for this email'
      this.soloWarningMessageValue = value
    },
    isWantToWarnConfirm() {
      if (this.$refs.refWarnForm.validate()) {
        let isArray = Array.isArray(this.soloWarningMessageValue)
        let data = []
        isArray
          ? (data = this.soloWarningMessageValue.map((item) => item.resourceId))
          : data.push(this.soloWarningMessageValue.resourceId)
        this.warningButtonDisabled = true
        this.$store
          .dispatch('investigations/sendInvestigationWarningMessage', {
            data: {
              items: data,
              warningMessage: this.notifyMessage
            },
            id: this.$route.params.id
          })
          .finally(() => {
            this.refreshDatatable()
            this.isWantToWarn = false
            this.warningButtonDisabled = false
          })
      }
    },
    deleteInvestigationDetailsFunction(value, multi) {
      let isArray = Array.isArray(value)
      this.totalSelectedItemsCount = isArray ? value.length : 1
      this.isWantToDelete = true
      this.deleteValue = value
    },
    isWantToDeleteConfirm(val, message, hasForm = true) {
      if (hasForm && !this.$refs.refFormDeleteAndNotify.validate() && val && !message) {
        return
      }
      let isArray = Array.isArray(this.deleteValue)
      let data = []
      isArray
        ? (data = this.deleteValue.map((item) => item.resourceId))
        : data.push(this.deleteValue.resourceId)
      if (message) {
        const payload = {
          items: data,
          warningMessage: message,
          isPermanentDelete: val
        }
        this.warnAndDeleteButtonDisabled = true
        deleteAndMessageInvestigationDetailsItem(payload, this.$route.params.id).finally(() => {
          this.refreshDatatable()
          this.isWantToDelete = false
          this.isWantToWarnAndDelete = false
          this.warnAndDeleteButtonDisabled = false
        })
      } else {
        this.warnAndDeleteButtonDisabled = true
        this.$store
          .dispatch('investigations/deleteInvestigationDetailsItem', {
            data: {
              items: data,
              isNotify: !!message,
              IsPermanentDelete: val,
              warningMessage: message
            },
            id: this.$route.params.id
          })
          .finally(() => {
            this.warnAndDeleteButtonDisabled = false
            this.refreshDatatable()
            this.isWantToDelete = false
            this.isWantToWarnAndDelete = false
          })
      }
    },
    deleteAndNotifyInvestigationDetailsFunction(value) {
      if (value && value.emailLastAction && value.emailLastAction.actionType === 'Delete') {
        this.notifyMessageWithDelete = value.emailLastAction.warningMessage
      } else {
        this.notifyMessageWithDelete = ''
      }
      let isArray = Array.isArray(value)
      this.totalSelectedItemsCount = isArray ? value.length : 1
      this.isWantToWarnAndDelete = true
      this.deleteValue = value
    },

    startInvestigationFunc() {
      this.isWantToAddNewCommunity = true
    },
    columnFilterChanged(filter) {
      this.isColumnFilterActive = true
      let items = []
      let filterPayload = this.investigationListBodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1))
          items.push(x)
      })

      filterPayload = [...items]

      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName =
            filter[i].FieldName.charAt(0).toUpperCase() + filter[i].FieldName.slice(1)
          filterPayload.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)
        const { FieldName, Value } = filter
        if (FieldName === 'ScanType' && Value === '') {
        } else {
          filterPayload.push(elem)
        }
      }

      this.investigationListBodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.refreshDatatable()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.investigationListBodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName.charAt(0).toUpperCase() + fieldName.slice(1)) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.investigationListBodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.refreshDatatable()

      this.isColumnFilterActive =
        this.investigationListBodyData.filter.FilterGroups[0].FilterItems.length >= 1
    },
    columnFilterChangedTargetUsers(filter) {
      this.isColumnFilterActiveTargetUsers = true
      let items = []
      let filterPayload = this.investigationTargetUsersListBodyData.filter.FilterGroups[0]
        .FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1))
          items.push(x)
      })

      filterPayload = [...items]

      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName =
            filter[i].FieldName.charAt(0).toUpperCase() + filter[i].FieldName.slice(1)
          filterPayload.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)
        const { FieldName, Value } = filter
        if ((FieldName === 'ScanType' || FieldName === 'UserStatus') && Value === '') {
        } else {
          filterPayload.push(elem)
        }
      }

      this.investigationTargetUsersListBodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.refreshDatatable()

      this.isColumnFilterActiveTargetUsers =
        this.investigationTargetUsersListBodyData.filter.FilterGroups[0].FilterItems.length >= 1
    },
    columnFilterClearedTargetUsers(fieldName) {
      let items = []
      let filterPayload = this.investigationTargetUsersListBodyData.filter.FilterGroups[0]
        .FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName.charAt(0).toUpperCase() + fieldName.slice(1)) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.investigationTargetUsersListBodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.refreshDatatable()
    },
    setStoredTableSettings() {
      this.storedTableDetailsList = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_LIST)
      )
      this.storedTableTargetUser = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_TARGET_USER)
      )
    }
  },
  computed: {
    ...mapGetters({
      // get table data via vuex.
      tableData: 'investigations/getInvestigationDetailsListGetter', // for using getters,
      statsAndMenuData: 'investigations/statsAndMenuGetter', // for stats getters,
      investigationDetailsData: 'investigations/investigationDetailsDataGetter', // for stats getters,
      investigationDetailsListData: 'investigations/getInvestigationDetailsListGetter', // for stats getters,
      investigationDetailsTargetUsersListData:
        'investigations/getInvestigationDetailsTargetUsersListGetter'
    })
  },
  watch: {
    statsAndMenuData(val) {
      if (this.statsAndMenuData) this.topMenuLoading = false
    },
    tableData() {},
    investigationDetailsData(val) {
      const tempArr = []
      if (val.targetUserType === 'Groups') {
        for (let user of val.targetUsers) {
          tempArr.push({ Group: user.targetUser })
        }
      } else {
        for (let user of val.targetUsers) {
          tempArr.push({ User: user.targetUser })
        }
      }
      this.targetUserChips = tempArr
      const headers = JSON.parse(JSON.stringify(this.investigationDetailsData.headers))
      headers.forEach((header) => {
        const ipAddress = header.ip
        const senderName = header.senderName
        delete header.ip
        delete header.senderName
        header['Ip Address'] = ipAddress
        header['Sender Name'] = senderName
      })
      const attachments = JSON.parse(JSON.stringify(this.investigationDetailsData.attachments))

      attachments.forEach((attachment) => {
        const name = attachment.name
        const extension = attachment.extension
        const size = attachment.size
        delete attachment.name
        delete attachment.extension
        delete attachment.size
        attachment['Attachment Name'] = name
        attachment['Attachment Extension'] = extension
        attachment['Attachment Size'] = size
      })

      this.criteriaChips = [...headers, ...this.investigationDetailsData.bodies, ...attachments]
      this.leftMenuLoading = false
      this.contentMenuLoading = false
    },
    investigationDetailsListData(val) {
      this.loading = false
      vm.$forceUpdate()
      this.investigationDetailsList = val.results || []
      if (this.$refs.refInvestigationListData) {
        this.investigationDetailsList = val.results || []
      }
    }
  },
  created() {
    this.setStoredTableSettings()
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.investigationListBodyData.pageSize = size
    this.investigationListBodyData.pageNumber = page
    this.serverSideProps.pageSize = size
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.INTEGRATION))
    this.getDefaultFilterAndSearch()
  },
  mounted() {
    // triggered to relevant action at investigations.js
    //this.$store.dispatch("investigations/getInvestigationList", this.bodyData);
  }
}
</script>
<style lang="scss">
.investigation-details-wrapper {
  .table-wrapper {
    .table-search {
      @media (max-width: 1150px) {
        min-width: 250px !important;
      }
      @media (min-width: 1151px) and (max-width: 1250px) {
        min-width: 400px !important;
      }
    }
  }

  .el-pagination {
    @media (max-width: 896px) {
      padding: 2px 0 !important;
    }
    &__sizes {
      @media (max-width: 896px) {
        margin-right: 4px !important;
      }
    }
    &__text {
      @media (max-width: 896px) {
        margin-right: 4px !important;
      }
    }
  }
  min-height: 90vh;
  .v-navigation-drawer__border {
    display: none;
  }
  .v-navigation-drawer {
    z-index: 3;
  }
  .investigation-details__alerts {
    &-sub-title {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: 'Open Sans', sans-serif;
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
        font-family: 'Open Sans', sans-serif;
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
      font-family: 'Open Sans', sans-serif;
    }

    &-icon-wrapper {
      box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
      border: solid 1px rgba(100, 181, 246, 0.5);
      background-color: #e3f2fd;
      height: 48px;
      width: 48px;
      margin-right: 24px;
      font-family: 'Open Sans', sans-serif;
    }
  }

  .investigation-details {
    padding: 16px;
    padding-top: 10px;

    .v-list-item--disabled {
      opacity: 0.5 !important;
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

    &__container {
      &__stats {
        @media (max-width: 768px) {
          justify-content: space-around;
        }
        @media (max-width: 992px) {
          align-items: stretch;
        }
        align-items: center;
        &-left-col {
          display: flex;
          align-items: center;
          @media (max-width: 992px) {
            flex-direction: column;
          }
          @media (max-width: 1600px) {
            flex-basis: 50%;
          }
          flex-basis: 50%;
          justify-content: space-between;
        }
        &-right-col {
          display: flex;
          flex-basis: 50%;
          @media (max-width: 992px) {
            margin-top: 6px;
          }
          justify-content: space-evenly;
          @media (max-width: 992px) {
            flex-direction: column;
          }
          @media (max-width: 1400px) {
            flex-basis: 50%;
          }
        }
        border-radius: 20px;
        box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
        background-color: #ffffff;
        padding: 24px;
        margin-bottom: 24px;
        display: flex;

        &__cards {
          display: flex;
          justify-content: space-between;

          @media (max-width: 768px) {
            margin-left: 0 !important;
            &:first-child {
              margin-bottom: 10px !important;
            }
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
                font-size: 20px;
                font-weight: 600;
                line-height: 1.15;
                letter-spacing: normal;
                color: #2196f3;
                margin-bottom: 5px;
              }

              &__stats {
                margin-bottom: 0 !important;
                font-size: 16px;

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
        .k-table__wrapper {
          padding-bottom: 0;
          .pagination {
          }
        }

        &--left-menu {
          display: flex;
          flex-flow: column;
          min-width: 220px;
          margin-right: 16px;

          &--time {
            display: flex;
            flex-flow: column;

            &--labels {
              font-size: 12px;
              font-weight: 600;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
              margin-bottom: 4px;
            }

            &--progress {
              font-size: 10px;
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
              font-size: 10px;
              line-height: 1.9;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
            }
          }

          &--mail-menu {
            .v-card {
              box-shadow: none !important;
              margin-top: 14px;

              .v-navigation-drawer {
                width: 100% !important;
                align-items: center;

                @media (max-width: 1025px) {
                  position: relative !important;
                }

                &__content {
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
                      margin-bottom: 24px !important;
                    }

                    &__archived {
                      display: flex;
                      width: 100%;

                      &--main {
                        flex-flow: column;
                        max-height: 40px;
                        .v-list-item-title__value {
                          top: 8px;
                          right: 18px;
                        }
                      }

                      &--title {
                        margin-bottom: 0;
                        background: #fafafa;
                        padding-left: 16px;
                        padding-bottom: 5px;
                        font-size: 12px;
                        font-weight: 600;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: normal;
                        letter-spacing: normal;
                        color: #383b41 !important;
                      }

                      &--link {
                        position: absolute;
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        width: 100%;
                        left: 10px;
                      }
                    }

                    position: relative;

                    font-size: 14px;
                    letter-spacing: normal;
                    color: #212121;
                    background: #fafafa;
                    margin-bottom: 0 !important;

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
          width: calc(100% - 236px);
          transition: none !important;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;

          .k-table__wrapper {
            //padding-bottom: 0;
          }

          .card.v-card.v-sheet.theme--light {
            /*
            padding: 0 !important;
            border-radius: 0 !important;
            -webkit-box-shadow: none !important;
            box-shadow: none !important;

            */
          }

          &__summary {
            display: flex;
            justify-content: space-between;
            &__item {
              display: flex;
              flex-flow: row;

              &--text-header {
                font-size: 14px;
                font-weight: 600;
                line-height: 1.5;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87) !important;
                text-transform: uppercase;
              }

              &--text-content {
                font-size: 14px;
                font-style: normal;
                line-height: 1.5;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87);
                font-weight: normal;
                text-transform: capitalize;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              &--action-button {
                button {
                  border-radius: 18px;
                  font-size: 14px;
                  font-weight: 600;
                  line-height: 1.71;
                  letter-spacing: normal;
                  color: #2196f3;
                }
                &-container {
                  display: flex;
                  @media (max-width: 1024px) {
                    flex-direction: column;
                  }
                }
              }
            }
          }

          &__target-users {
            &--header {
              margin-top: 20px;
              margin-bottom: 0;
              font-size: 12px;
              font-weight: 600;
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
                line-break: anywhere;
                height: auto !important;
                margin-top: 8px;
                margin-right: 4px;
                &:first-child {
                  //margin-left: 0 !important;
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
                height: auto !important;
                margin-top: 8px;
                margin-right: 4px;
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

    > .v-overlay__content {
      height: auto;
      width: 100%;
    }
  }
}
.investigation__attachments .v-chip:last-child {
  margin-left: 0 !important;
}

.investigation-details__container__content--right-menu {
  .v-chip__content {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: block !important;
    line-break: anywhere;
    white-space: pre-wrap;
    text-align: left;
  }

  .v-chip {
    padding: 4px 12px !important;
  }
}
.investigation-details__tooltip {
  white-space: pre-wrap;
}
.investigation-details__warning-modal {
  .k-dialog__body {
    padding: 24px 24px 2px 24px;
  }
}
.investigation-details__modal-footer {
  .k-dialog__footer {
    padding: 8px 16px;
  }
}

.investigationDetails__target-users-table-container {
  .k-table__wrapper {
    .card .table-wrapper .el-table td > .cell {
      padding-left: 10.5px !important;
    }
    .card .table-wrapper .el-table th > .cell.actions-label {
      margin-left: 0 !important;
    }
    .card .table-wrapper .el-table th > .cell {
      margin-left: 8px;
    }
  }
}
</style>
