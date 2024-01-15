<template>
  <div class="investigation-details-wrapper" style="margin-top: 6px;">
    <div
      v-if="investigationDetailsListData && statsAndMenuData && investigationDetailsData"
      class="investigation-details"
    >
      <div class="investigation-details__container">
        <new-investigation
          v-if="isWantToAddNewInvestigation"
          :is-duplicate="true"
          :status="isWantToAddNewInvestigation"
          :investigation-details-data="investigationDetailsData"
          @closeWithRoute="onAddClose"
          @closeAdd="isWantToAddNewInvestigation = false"
        />
        <app-dialog
          v-if="isWantToDelete"
          icon="mdi-alert"
          size="small"
          title="Delete Emails?"
          body="Do you want to delete emails or move to trash?"
          className="investigation-details__modal-footer"
          title-id="text--investigation-details-delete-emails-popup-title"
          subtitle-id="text--investigation-details-delete-emails-popup-subtitle"
          :status="isWantToDelete"
          :subtitle="deleteMessage()"
          @changeStatus="isWantToDelete = false"
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
                  :disabled="isMoveToTrashDisabled"
                  color="#00bcd4"
                  @click="isWantToDeleteConfirm(false, null, false)"
                  >Move to trash
                </v-btn>
                <v-btn
                  id="btn-delete--investigation-delete-emails-details-popup"
                  class="k-dialog__button"
                  text
                  color="#2196f3"
                  :disabled="isPermanentlyDeleteDisabled"
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
          :subtitle="warningMessageSubtitle"
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
          v-if="isWantToDeleteAndNotify"
          size="big"
          icon="mdi-alert"
          title-id="text--investigation-details-delete-and-notify-title"
          subtitle-id="text--investigation-details-delete-and-notify-subtitle"
          class-name="investigation-details__delete-and-notify-modal"
          :status="isWantToDeleteAndNotify"
          :title="deleteAndNotifyMessage"
          :subtitle="deleteAndNotifyMessageSubtitle"
          @changeStatus="isWantToDeleteAndNotify = false"
        >
          <template v-slot:app-dialog-body>
            <v-list-item class="check-wrapper investigation-details__alerts-content pl-0 pr-0">
              <v-form
                class="w-100"
                lazy-validation
                ref="refDeleteAndNotifyForm"
                onSubmit="return false;"
                @submit="isWantToDeleteAndNotifyConfirm"
              >
                <v-text-field
                  id="input--investigation-details-warning-message"
                  placeholder="Dangerous Email"
                  outlined
                  class="edit-name-textfield edit-select standard-height"
                  v-model.trim="deleteAndNotifyMessage"
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
            <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
              <div>
                <v-btn
                  id="btn-cancel--investigation-details-delete-emails-popup"
                  class="k-dialog__button"
                  text
                  color="#f56c6c"
                  @click="isWantToDeleteAndNotify = false"
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
          <InvestigationDetailsTopBarLoading :loading="topMenuLoading">
            <template #skeleton-content>
              <div class="investigation-details__container__stats__cards__card">
                <div class="investigation-details__container__stats__cards__card-left">
                  <div
                    class="investigation-details__container__stats__cards__card-left__icon"
                    :class="
                      statsAndMenuData && statsAndMenuData.status === 'Running'
                        ? 'bg-blue'
                        : statsAndMenuData && statsAndMenuData.status === 'Finished'
                        ? 'bg-green'
                        : statsAndMenuData &&
                          (statsAndMenuData.status === 'Expired' ||
                            statsAndMenuData.status === 'Canceled')
                        ? 'bg-red'
                        : 'bg-salmon'
                    "
                    :style="getHeaderCardBoxShadow"
                  >
                    <v-icon medium left color="white">{{ statusIcon }}</v-icon>
                  </div>
                </div>
                <div class="investigation-details__container__stats__cards__card-right">
                  <h3 class="investigation-details__container__stats__cards__card-right__title">
                    {{ statsAndMenuData && statsAndMenuData.status }}
                  </h3>
                  <div class="investigation-details__container__stats__cards__card-right__stats">
                    <v-tooltip
                      v-if="
                        statsAndMenuData &&
                        statsAndMenuData.status === 'Running' &&
                        statsAndMenuData.estimatedTime
                      "
                      bottom
                      opacity="1"
                      max-width="230"
                    >
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          {{ statsAndMenuData && statsAndMenuData.estimatedTime }}
                          remaining
                        </div>
                      </template>
                      <p class="tooltip-wrapper">
                        Actual remaining time may be different from estimated time and is depended
                        on conditions such as online user count, mailbox size, etc.
                      </p>
                    </v-tooltip>
                    <span v-else>{{ getStatusText('statusTime', null) }}</span>
                  </div>
                </div>
              </div>
            </template>
          </InvestigationDetailsTopBarLoading>
          <InvestigationDetailsTopBarLoading
            v-if="statsAndMenuData.status !== 'Running'"
            :loading="topMenuLoading"
          >
            <template v-slot:skeleton-content>
              <div class="investigation-details__container__stats__cards__card">
                <div class="investigation-details__container__stats__cards__card-left">
                  <div
                    class="investigation-details__container__stats__cards__card-left__icon"
                    :class="getHeaderCardBoxClassSecond"
                    :style="getHeaderCardBoxShadowSecond"
                  >
                    <v-icon medium left color="white">mdi-account</v-icon>
                  </div>
                </div>
                <div class="investigation-details__container__stats__cards__card-right">
                  <h3 class="investigation-details__container__stats__cards__card-right__title">
                    {{
                      getStatusText(
                        'onlineUserCount',
                        statsAndMenuData && statsAndMenuData['onlineUserCount']
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
            </template>
          </InvestigationDetailsTopBarLoading>
          <InvestigationDetailsTopBarLoading :loading="topMenuLoading">
            <template v-slot:skeleton-content>
              <div class="investigation-details__container__stats__cards__card">
                <div class="investigation-details__container__stats__cards__card-left">
                  <div
                    class="investigation-details__container__stats__cards__card-left__icon bg-green"
                    :style="{
                      boxShadow:
                        '0px 2px 5px rgba(67, 160, 71, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
                    }"
                  >
                    <v-icon medium left color="white">mdi-account-circle</v-icon>
                  </div>
                </div>
                <div class="investigation-details__container__stats__cards__card-right">
                  <h3 class="investigation-details__container__stats__cards__card-right__title">
                    {{
                      getStatusText('scannedUserCount', statsAndMenuData.completedScannedUserCount)
                    }}
                  </h3>
                  <p class="investigation-details__container__stats__cards__card-right__stats">
                    {{
                      getStatusText('totalUserCountScannedUser', statsAndMenuData.totalUserCount)
                    }}
                  </p>
                </div>
              </div>
            </template>
          </InvestigationDetailsTopBarLoading>
          <InvestigationDetailsTopBarLoading :loading="topMenuLoading">
            <template v-slot:skeleton-content>
              <div class="investigation-details__container__stats__cards__card">
                <div class="investigation-details__container__stats__cards__card-left">
                  <div
                    class="investigation-details__container__stats__cards__card-left__icon bg-blue"
                    :style="{
                      boxShadow:
                        '0px 2px 5px rgba(33, 150, 243, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
                    }"
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
            </template>
          </InvestigationDetailsTopBarLoading>
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
                    {{ getTimeLeftText }}
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
                          :class="{
                            'v-list-item--active': activeMenu === 'targetUsers'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-account-multiple</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Found Users
                              <span
                                :class="getLeftMenuItemClasses('targetUsers')"
                                v-if="statsAndMenuData && statsAndMenuData.scannedUserCount"
                                >{{ itemStats.targetUsers.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <p class="v-list-item__archived--title pt-4 pb-2">Folders</p>
                        <v-list-item
                          id="btn--investigation-details-inbox"
                          link
                          @click="menuClick('Inbox')"
                          :class="{
                            'v-list-item--active': activeMenu === 'Inbox'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-inbox</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Inbox
                              <span
                                :class="getLeftMenuItemClasses('Inbox')"
                                v-if="!!itemStats.Inbox.count"
                                >{{ itemStats.Inbox.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-junk"
                          link
                          @click="menuClick('JunkEmail')"
                          :class="{
                            'v-list-item--active': activeMenu === 'JunkEmail'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-alert</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Junk
                              <span
                                :class="getLeftMenuItemClasses('JunkEmail')"
                                v-if="!!itemStats.JunkEmail.count"
                                >{{ itemStats.JunkEmail.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          link
                          id="btn--investigation-details-draft"
                          @click="menuClick('Drafts')"
                          :class="{
                            'v-list-item--active': activeMenu === 'Drafts'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-file</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Draft
                              <span
                                :class="getLeftMenuItemClasses('Drafts')"
                                v-if="!!itemStats.Drafts.count"
                                >{{ itemStats.Drafts.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-sent"
                          link
                          @click="menuClick('SentItems')"
                          :class="{
                            'v-list-item--active': activeMenu === 'SentItems'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-send</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Sent
                              <span
                                :class="getLeftMenuItemClasses('SentItems')"
                                v-if="!!itemStats.SentItems.count"
                                >{{ itemStats.SentItems.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-deleted-items"
                          link
                          @click="menuClick('DeletedItems')"
                          :class="{
                            'v-list-item--active': activeMenu === 'DeletedItems'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-delete</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Deleted Items
                              <span
                                :class="getLeftMenuItemClasses('DeletedItems')"
                                v-if="!!itemStats.DeletedItems.count"
                                >{{ itemStats.DeletedItems.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          id="btn--investigation-details-others"
                          link
                          @click="menuClick('Others')"
                          :class="{
                            'v-list-item--active': activeMenu === 'Others'
                          }"
                        >
                          <v-list-item-icon>
                            <v-icon medium left color="#909399">mdi-plus-box</v-icon>
                          </v-list-item-icon>

                          <v-list-item-content>
                            <v-list-item-title>
                              Others
                              <span
                                :class="getLeftMenuItemClasses('Others')"
                                v-if="!!itemStats.Others.count"
                                >{{ itemStats.Others.count }}</span
                              >
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-divider></v-divider>
                        </v-list-item>
                        <p class="v-list-item__archived--title">Archived</p>
                        <v-list-item
                          id="btn--investigation-details-stored"
                          link
                          @click="menuClick('Stored')"
                          class="v-list-item__archived--main"
                          :class="{
                            'v-list-item--active': activeMenu === 'Stored'
                          }"
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
                                  :class="getLeftMenuItemClasses('Stored')"
                                  v-if="!!itemStats.Stored.count"
                                  >{{ itemStats.Stored.count }}</span
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
                    <div
                      id="card--investigation-details-trigger"
                      class="investigation-details__container__content--right-menu__summary__item mt-2"
                    >
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-header"
                      >
                        TRIGGER:
                      </div>
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-content ml-2"
                      >
                        {{ getInvestigationType }}
                      </div>
                    </div>
                    <div
                      id="card--investigation-details-trigger-source"
                      class="investigation-details__container__content--right-menu__summary__item mt-2"
                    >
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-header"
                      >
                        SOURCE:
                      </div>
                      <div
                        class="investigation-details__container__content--right-menu__summary__item--text-content ml-2 d-flex flex-row"
                      >
                        <div
                          class="mr-2 align-center d-flex"
                          v-if="getGoogleData && getGoogleData.length"
                        >
                          <img
                            src="../assets/img/google.svg"
                            alt="g-suite-logo"
                            style="width: 16px; margin-right: 2px;"
                          />
                          {{ getGoogleData.toString() }}
                        </div>
                        <div
                          class="mr-2 align-center d-flex"
                          v-if="getOfficeData && getOfficeData.length"
                        >
                          <img
                            src="../assets/img/outlook@2x.png"
                            alt="outlook-logo"
                            style="width: 16px; margin-right: 2px;"
                          />
                          {{ getOfficeData.toString() }}
                        </div>
                        <div
                          v-if="getWordData && getWordData.length"
                          class="align-center d-flex mr-2"
                        >
                          <img
                            src="../assets/img/microsoft365Mini.svg"
                            alt="office-logo"
                            style="width: 16px; margin-right: 2px;"
                          />
                          {{ getWordData.toString() }}
                        </div>
                        <div
                          v-if="getExchangeData && getExchangeData.length"
                          class="align-center d-flex"
                        >
                          <img
                            src="../assets/img/exchange@2x.png"
                            alt="office-logo"
                            style="width: 16px; margin-right: 2px;"
                          />
                          {{ getExchangeData.toString() }}
                        </div>
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
                        class="ma-1"
                        outlined
                        color="#2196f3"
                        @click="stopInvestigationFunc"
                      >
                        <v-icon medium left color="#2196f3">mdi-stop</v-icon>
                        Stop
                      </v-btn>
                    </div>
                    <div
                      id="btn-duplicate--investigation-details-card-container"
                      class="investigation-details__container__content--right-menu__summary__item--action-button"
                    >
                      <v-btn class="ma-1" outlined color="#2196f3" @click="startInvestigationFunc">
                        <v-icon medium left color="#2196f3">mdi-content-copy</v-icon>
                        Duplicate
                      </v-btn>
                    </div>
                    <div
                      v-if="['Idle', 'Running'].includes(investigationDetailsData.status)"
                      id="btn-duplicate--investigation-details-card"
                      class="investigation-details__container__content--right-menu__summary__item--action-button--rounded"
                    >
                      <v-menu
                        :min-width="300"
                        :offset-y="true"
                        left
                        :nudge-right="0"
                        :nudge-bottom="5"
                      >
                        <template v-slot:activator="{ on: menu }">
                          <v-btn v-on="menu" class="ma-1" outlined color="#2196f3">
                            <v-icon medium color="#2196f3">mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item id="btn-auto-refresh--investigation" @click="setAutoRefresh">
                            <v-list-item-title>
                              <div class="menu-item__content">
                                Auto-Refresh every 15 seconds
                                <v-icon v-if="isAutoRefreshActive" color="#000000"
                                  >mdi-check</v-icon
                                >
                              </div>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
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
                v-show="showEmails && !loading"
                id="investigationDetailsList"
                ref="refInvestigationListData"
                is-server-side
                selectable
                filterable
                options
                rowKey="resourceId"
                just-compare-row-key
                is-server-side-selection
                :rowCount="investigationListBodyData.pageSize"
                :show-filter-options="false"
                :refName="'investigationDetailsListTable'"
                :manage-column-filter-status-from-parent="emailsColumnFilterStatus"
                :columns="columns"
                :table="investigationDetailsList"
                :axios-payload.sync="investigationListBodyData"
                :rowActions="rowActions"
                :empty="iEmpty"
                :selectEvent="selectEvent"
                :saved-table-settings-local-storage-key="savedTableSettingsLocalStorageKey"
                :chartOptions="chartOptions"
                :server-side-props="serverSideProps"
                :server-side-events="{
                  pagination: true,
                  search: true,
                  sort: true
                }"
                @deleteInvestigationDetails="deleteInvestigationDetails"
                @sendInvestigationDetailsWarningMessage="sendInvestigationDetailsWarningMessage"
                @deleteAndNotifyInvestigationDetailsFunction="
                  deleteAndNotifyInvestigationDetailsFunction($event)
                "
                @downloadEvent="exportInvestigationEmails"
                @columnFilterChanged="columnFilterChanged"
                @columnFilterCleared="columnFilterCleared"
                @refreshAction="refreshDatatable"
                @on-all-records-button-click="handleAllRecordsInboxClick"
                @server-side-page-number-changed="serverSidePageNumberChanged"
                @server-side-size-changed="serverSideSizeChanged"
                @sortChangedEvent="sortChanged"
                @searchChangedEvent="handleSearchChange"
              >
                <template #datatable-row-actions="{ scope }">
                  <DefaultButtonRowAction
                    :id="rowActions[0].id"
                    :icon="rowActions[0].icon"
                    :text="rowActions[0].name"
                    :scope="scope"
                    :disabled="rowActions[0].disabled"
                    @on-click="deleteInvestigationDetails(scope.row)"
                  />
                  <DefaultButtonRowAction
                    :id="rowActions[1].id"
                    :icon="rowActions[1].icon"
                    :text="rowActions[1].name"
                    :scope="scope"
                    :disabled="rowActions[1].disabled || getWarningEmailDisableStatus(scope.row)"
                    @on-click="sendInvestigationDetailsWarningMessage(scope.row)"
                  />
                </template>
                <template v-slot:datatable-custom-column="{ scope }">
                  <template v-if="scope.row.emailLastAction">
                    <span class="d-flex align-center">
                      <span class="ml-2">
                        <v-tooltip
                          v-if="getActionStatusOptions(scope.row.emailLastAction).isTooltip"
                          bottom
                          max-width="250"
                          content-class="investigation-details__tooltip"
                        >
                          <template v-slot:activator="{ on }">
                            <div class="d-flex" v-on="on">
                              <v-icon
                                v-if="getActionStatusOptions(scope.row.emailLastAction).icon"
                                small
                                class="mr-1"
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
              v-show="activeMenu === 'targetUsers' && showTargetUsersDetails && !loading"
              class="investigationDetails__target-users-table-container"
            >
              <datatable
                v-show="showTargetUsersDetails && !loading"
                id="investigationDetailsTargetUsersList"
                ref="investigationDetailsTargetUsersList"
                refName="investigationDetailsTargetUsersListTable"
                :manage-column-filter-status-from-parent="targetUserColumnFilterStatus"
                is-server-side
                filterable
                options
                :rowCount="investigationTargetUsersListBodyData.pageSize"
                :columns="columnsTargetUsers"
                :table="
                  investigationDetailsTargetUsersListData &&
                  investigationDetailsTargetUsersListData.results
                "
                :selectable="false"
                :show-filter-options="false"
                :empty="iEmpty"
                :stored-table-settings="storedTableTargetUser"
                :selectEvent="selectEvent"
                :chartOptions="chartOptions"
                :server-side-props="serverSidePropsForTargetUsers"
                :saved-table-settings-local-storage-key="
                  savedTableSettingsLocalStorageKeyForTargetUsers
                "
                :axios-payload.sync="investigationTargetUsersListBodyData"
                :server-side-events="{
                  pagination: true,
                  search: true,
                  sort: true
                }"
                @downloadEvent="exportTargetUsers"
                @columnFilterChanged="columnFilterChangedTargetUsers"
                @columnFilterCleared="columnFilterClearedTargetUsers"
                @refreshAction="refreshDatatable"
                @server-side-page-number-changed="serverSidePageNumberChangedForTargetUsers"
                @server-side-size-changed="serverSideSizeChangedForTargetUsers"
                @sortChangedEvent="sortChangedForTargetUsers"
                @searchChangedEvent="handleSearchChangeForTargetUsers"
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
                <template v-slot:empty-table-inline>
                  <div class="empty-table">
                    <div
                      class="empty-inline"
                      v-if="
                        investigationDetailsTargetUsersListData &&
                        investigationDetailsTargetUsersListData.results &&
                        investigationDetailsTargetUsersListData.results.length === 0
                      "
                    >
                      <slot name="empty-table-inline-sort">
                        <h2>Sorry, that search and filter criteria has no results.</h2>
                        <p>Please try adjusting your search or filter</p>
                      </slot>
                    </div>
                    <div class="empty-inline" v-else>
                      <slot name="empty-table-inline-sort">
                        <h2>No email has been found, yet</h2>
                      </slot>
                    </div>
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
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AppDialog from '../components/AppDialog'
import { exportInvestigationEmailList, exportInvestigationUserList } from '@/api/incidentResponder'
import ShowMore from '../components/Common/ShowMore/ShowMore'
import { getDefaultAxiosPayload, getTimeZoneForMoment } from '@/utils/functions'
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
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import { OPERATORS, TEXT_OPERATORS } from '@/components/Investigation/utils'

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
    ThreeRowLoading,
    DefaultButtonRowAction
  },
  data: () => ({
    deleteValue: null,
    isInvestigationWarningSelectAll: false,
    isInvestigationDeleteSelectAll: false,
    investigationWarningExcludedResourceIdList: [],
    investigationDeleteExcludedResourceIdList: [],
    isAutoRefreshActive: true,
    autoRefreshInterval: null,
    timeoutId: null,
    isRunning: false,
    savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_LIST,
    savedTableSettingsLocalStorageKeyForTargetUsers:
      TABLE_SETTINGS_KEYS.INVESTIGATION_DETAILS_TARGET_USER,
    storedTableTargetUser: null,
    totalNumberOfRecordsFolder: 0,
    warningButtonDisabled: false,
    warnAndDeleteButtonDisabled: false,
    stopButtonDisabled: false,
    labels,
    loading: true,
    topMenuLoading: true,
    leftMenuLoading: true,
    contentMenuLoading: true,
    isWantToAddNewInvestigation: false,
    progressValue: null,
    notifyMessage: null,
    notifyMessageWithDelete: null,
    targetUserColumnFilterStatus: { status: false },
    emailsColumnFilterStatus: { status: false },
    diffDays: null,
    totalHours: 0,
    totalMinutes: 0,
    activeMenu: 'Inbox',
    warningMessage: 'Send a warning message for this email',
    warningMessageSubtitle: 'Type a message to reporting user',
    isWantToDeleteAndNotify: false,
    deleteAndNotifyMessage: 'Delete Emails and Notify Users?',
    deleteAndNotifyMessageSubtitle: '1 email will be deleted from inbox',
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
    investigationListBodyData: getDefaultAxiosPayload({
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
    }),
    defaultRequestBody: getDefaultAxiosPayload({
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
    }),
    investigationTargetUsersListBodyData: getDefaultAxiosPayload({
      ascending: true,
      orderBy: 'Email'
    }),
    defaultRequestBodyForTargetUsers: getDefaultAxiosPayload({
      ascending: true,
      orderBy: 'Email'
    }),
    columns: [
      // Should be defined to show the table
      {
        property: 'ownerEmail',
        align: 'left',
        editable: false,
        label: 'Owner',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        minWidth: 260,
        filterableType: 'text'
      },
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
        minWidth: 260,
        width: 260,
        cellPadding: 8
      },
      {
        property: 'senderName',
        align: 'left',
        editable: false,
        label: 'Sender Name',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'text',
        width: 180
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
        minWidth: 150
      },
      {
        property: 'scanType',
        align: 'center',
        editable: false,
        label: getStoreValue('source'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'service',
        width: 160,
        filterableType: 'select',
        filterableItems: [
          'Outlook',
          'Microsoft 365',
          'Exchange',
          { text: 'Google Workspace', value: 'GoogleWorkspace' }
        ]
      },
      {
        property: 'filterTags',
        align: 'left',
        isEditable: false,
        type: 'textWithBadge',
        show: true,
        label: 'Filtered By',
        minWidth: 160,
        cellPadding: 8,
        hasMapper: true
      },
      {
        property: 'emailLastAction',
        align: 'left',
        sortable: false,
        filterable: false,
        hideFilter: true,
        hideSort: true,
        label: 'Status',
        show: true,
        minWidth: 280,
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
        minWidth: 260
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
        minWidth: 170,
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
        minWidth: 140,
        type: 'text'
      },
      {
        property: PROPERTY_STORE.LASTSEEN,
        align: 'left',
        editable: false,
        label: getStoreValue(PROPERTY_STORE.LASTSEEN),
        fixed: false,
        sortable: true,
        minWidth: 180,
        show: true,
        type: 'text'
      },
      {
        property: 'investigationStatus',
        align: 'center',
        editable: false,
        label: 'Scan Status',
        fixed: false,
        sortable: true,
        show: true,
        minWidth: 170,
        type: 'badge',
        filterableType: 'select',
        filterableItems: ['Completed', 'Interrupted', 'Running', 'Expired'],
        errorStateFor: true
      },
      {
        property: 'scanType',
        align: 'center',
        editable: false,
        label: getStoreValue('source'),
        fixed: false,
        sortable: true,
        show: true,
        minWidth: 180,
        type: 'service',
        filterableType: 'select',
        filterableItems: ['Outlook', 'Microsoft 365', 'Exchange', 'Google Workspace']
      },
      {
        property: 'analyzedMailCount',
        align: 'center',
        label: 'Progress',
        fixed: false,
        sortable: false,
        show: true,
        minWidth: 140,
        type: 'slot'
      }
    ],
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
        action: 'sendInvestigationDetailsWarningMessage'
      }
    ],
    addUsers: {
      show: true,
      popUp: false,
      action: 'createCommunityFromMobileInfo'
    },
    iEmpty: {
      message: 'No email were found that match your criteria'
    },
    selectEvent: {
      clipboard: true,
      edit: false,
      delete: true,
      download: false,
      warning: true,
      deleteAndNotify: false
    },
    chartOptions: {
      backgroundColor: ['#3f51b5', '#00bcd4']
    },
    serverSideProps: new ServerSideProps(),
    serverSidePropsForTargetUsers: new ServerSideProps()
  }),
  methods: {
    getLeftMenuItemClasses(item) {
      return {
        'v-list-item-title__value': true,
        'v-list-item-title__value--blue': this.activeMenu === item,
        'v-list-item-title__value--gray': this.activeMenu !== item,
        'v-list-item-title__value--orange': this.activeMenu !== item && this.itemStats[item].notify
      }
    },
    setAutoRefresh() {
      this.isAutoRefreshActive = !this.isAutoRefreshActive
    },
    calculateInvestigateListFilterActive() {
      this.emailsColumnFilterStatus.status = this.isColumnFilterActive(
        this.investigationListBodyData
      )
    },
    calculateTargetUserListFilterActive() {
      this.targetUserColumnFilterStatus.status = this.isColumnFilterActive(
        this.investigationTargetUsersListBodyData
      )
    },
    isColumnFilterActive(axiosPayload) {
      return !!(
        axiosPayload?.filter?.FilterGroups[0]?.FilterItems?.length > 1 ||
        axiosPayload?.filter?.FilterGroups[1]?.FilterItems?.length
      )
    },
    serverSideSizeChangedForTargetUsers(pageSize = 10) {
      this.investigationTargetUsersListBodyData.pageSize = pageSize
      this.serverSidePropsForTargetUsers.pageSize = pageSize
      this.resetPageNumberForTargetUsers()
      this.refreshDatatable()
    },
    resetPageNumberForTargetUsers() {
      this.investigationTargetUsersListBodyData.pageNumber = 1
      this.serverSidePropsForTargetUsers.pageNumber = 1
    },
    handleSearchChangeForTargetUsers(searchFilter = {}) {
      this.investigationTargetUsersListBodyData.filter.FilterGroups[1].FilterItems =
        Object.keys(searchFilter).length > 0
          ? [...searchFilter?.filter?.FilterGroups?.[0]?.FilterItems]
          : []
      this.resetPageNumberForTargetUsers()
      this.calculateTargetUserListFilterActive()
      this.refreshDatatable()
    },
    serverSidePageNumberChangedForTargetUsers(pageNumber = 1) {
      this.investigationTargetUsersListBodyData.pageNumber = pageNumber
      this.refreshDatatable()
    },
    sortChangedForTargetUsers({ order, prop } = {}) {
      this.investigationTargetUsersListBodyData.ascending = order === 'ascending'
      this.investigationTargetUsersListBodyData.orderBy = prop
      this.refreshDatatable()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.investigationListBodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.refreshDatatable()
    },
    resetPageNumber() {
      this.investigationListBodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.investigationListBodyData.filter.FilterGroups[1].FilterItems =
        Object.keys(searchFilter).length > 0
          ? [...searchFilter?.filter?.FilterGroups?.[0]?.FilterItems]
          : []
      this.resetPageNumber()
      this.calculateInvestigateListFilterActive()
      this.refreshDatatable()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.investigationListBodyData.pageNumber = pageNumber
      this.refreshDatatable(false, false, true)
    },
    sortChanged({ order, prop } = {}) {
      this.investigationListBodyData.ascending = order === 'ascending'
      this.investigationListBodyData.orderBy = prop
      this.refreshDatatable()
    },
    handleClearFilters(isAutoTrue) {
      if (!isAutoTrue) return false
      this.investigationListBodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.refreshDatatable(isAutoTrue)
    },
    getUserFriendlyName(activeMenu) {
      let name
      if (activeMenu === 'SentItems') {
        name = 'Sent'
      } else if (activeMenu === 'DeletedItems') {
        name = 'Deleted Items'
      } else if (activeMenu === 'JunkEmail') {
        name = 'Junk'
      } else if (activeMenu === 'Drafts') {
        name = 'Draft'
      } else if (activeMenu === 'Others') {
        name = 'Others'
      } else if (activeMenu === 'Stored') {
        name = 'Stored'
      } else {
        name = 'Inbox'
      }
      return name
    },
    handleAllRecordsInboxClick() {
      this.investigationListBodyData.pageSize = 75000
      this.refreshDatatable()
    },
    getActionStatusOptions({
      actionType,
      status,
      isPermanentDelete,
      isTooltip,
      tooltipText,
      text
    }) {
      let returnValue = {
        isTooltip: isTooltip,
        color: null,
        icon: null,
        tooltipText: tooltipText,
        text: text
      }
      if (['Idle', 'Running'].includes(status)) {
        if (actionType === 'Delete' || actionType === 'DeleteAndNotify') {
          returnValue.icon = null
          returnValue.color = '#fff'
        } else if (actionType === 'Warning') {
          returnValue.icon = 'mdi-check-circle'
          returnValue.color = '#43a047'
        }
      }
      if (status === 'Completed') {
        if (actionType === 'Delete') {
          returnValue.color = '#6d6d6d'
          if (isPermanentDelete) returnValue.icon = 'mdi-close-circle'
          else returnValue.icon = 'mdi-delete'
        } else if (actionType === 'DeleteAndNotify') {
          returnValue.icon = 'mdi-close-circle'
          returnValue.color = '#6d6d6d'
        } else if (actionType === 'Warning') {
          returnValue.icon = 'mdi-check-underline-circle'
          returnValue.color = '#43a047'
        }
      }
      if (status === 'CompletedWithError') {
        if (
          actionType === 'Delete' ||
          actionType === 'DeleteAndNotify' ||
          actionType === 'Warning'
        ) {
          returnValue.icon = 'mdi-alert-circle'
          returnValue.color = '#f56c6c'
        }
      }
      if (status === 'ItemNotFound') {
        returnValue.icon = 'mdi-alert-circle'
        returnValue.color = '#f56c6c'
      }
      return returnValue
    },
    getProgressText(scope) {
      if (scope.row.status === 'Completed' || scope.row.progress === 100) return 'Completed'
      return `${scope.row.progress}%`
    },
    getProgressValue(scope) {
      if (scope.row.analyzedMailCount === 0 && scope.row.filteredMailCount === 0) {
        return 100
      }
      return Math.floor((scope.row.analyzedMailCount / scope.row.filteredMailCount) * 100)
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
          ascending: this.investigationListBodyData.ascending,
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
          ascending: this.investigationTargetUsersListBodyData.ascending,
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
      if (!this.investigationDetailsData || !Object.keys(this.investigationDetailsData).length)
        return
      let today = moment(new Date()).toDate()
      let createDate = moment(
        this.investigationDetailsData.createTime?.split(' '),
        getTimeZoneForMoment()
      ).toDate()
      let expireDate = moment(
        this.investigationDetailsData.expireDate?.split(' '),
        getTimeZoneForMoment()
      ).toDate()
      let diffSeconds = parseInt((expireDate - today) / 1000, 10)
      this.diffDays = diffSeconds / (60 * 60 * 24)
      if (this.diffDays <= 0) {
        this.diffDays = 0
        this.progressValue = 100
      } else {
        let progressSeconds = diffSeconds
        this.diffDays = Math.floor(progressSeconds / (60 * 60 * 24))
        let remainingTime = progressSeconds
        if (this.diffDays > 0) {
          remainingTime = progressSeconds % (60 * 60 * 24)
        }

        this.totalHours = Math.floor(remainingTime / (60 * 60))
        if (this.totalHours > 0) {
          remainingTime = remainingTime % (60 * 60)
        }
        this.totalMinutes = Math.floor(remainingTime / 60)
        const totalSeconds = parseInt((expireDate - createDate) / 1000, 10)
        this.progressValue =
          this?.statsAndMenuData?.status === 'Finished'
            ? 100
            : (parseInt((today - createDate) / 1000, 10) / totalSeconds) * 100
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
    stopInvestigationFunc() {
      this.isWantToStop = true
    },
    iconType() {
      if (this.statsAndMenuData.status === 'Running') this.statusIcon = 'mdi-play'
      else if (this.statsAndMenuData.status === 'Finished') this.statusIcon = 'mdi-check'
      else if (this.statsAndMenuData.status === 'Expired') this.statusIcon = 'mdi-clock'
      else if (this.statsAndMenuData.status === 'Canceled') this.statusIcon = 'mdi-close-circle'
      else this.statusIcon = 'mdi-close'
    },
    getStatusText(section, val) {
      if (val == null) val = 0
      this.iconType()
      if (section === 'statusTime') {
        if (this.statsAndMenuData.status === 'Running')
          return this.statsAndMenuData.estimatedTime
            ? this.statsAndMenuData.estimatedTime
            : 'Estimated time can not be calculated at the moment'
        if (this.statsAndMenuData.status === 'Canceled')
          return this.investigationDetailsData['finishedTime']
        if (this.statsAndMenuData.status === 'Expired')
          return this.investigationDetailsData.expireDate
        if (this.statsAndMenuData.status === 'Finished')
          return this.investigationDetailsData['finishedTime']
      }
      if (section === 'onlineUserCount') {
        if (this.statsAndMenuData.status === 'Running') return `${val} Online User(s)`
        if (this.statsAndMenuData.status === 'Canceled')
          return `${this.statsAndMenuData.notScannedUserCount} User(s)`
        if (this.statsAndMenuData.status === 'Expired')
          return `${this.statsAndMenuData.notScannedUserCount} User(s)`
        if (this.statsAndMenuData.status === 'Finished') return 'All users scanned'
      }
      if (section === 'totalUserCount') {
        if (this.statsAndMenuData.status === 'Running')
          return this.statsAndMenuData['onlineUserCount']
            ? `of remaining ${this.statsAndMenuData.notScannedUserCount} users`
            : `Waiting for users`
        if (['Expired', 'Canceled'].includes(this.statsAndMenuData.status))
          return `Could not be scanned`
        if (this.statsAndMenuData.status === 'Finished') return 'No remaining users'
      }
      if (section === 'scannedUserCount') {
        if (this.statsAndMenuData.status === 'Running') return `${val} Scanned User(s)`
        if (this.statsAndMenuData.status === 'Canceled') return `${val} Scanned User(s)`
        if (this.statsAndMenuData.status === 'Expired') return `${val} Scanned User(s)`
        if (this.statsAndMenuData.status === 'Finished') return `${val} Scanned User(s)`
      }
      if (section === 'totalUserCountScannedUser') {
        if (this.statsAndMenuData.status === 'Running') return `of total ${val} user(s)`
        if (this.statsAndMenuData.status === 'Canceled') return `of total ${val} user(s)`
        if (this.statsAndMenuData.status === 'Expired') return `of total ${val} user(s)`
        if (this.statsAndMenuData.status === 'Finished') return `of total ${val} user(s)`
      }
      if (section === 'scannedEmailCount') {
        if (this.statsAndMenuData.status === 'Running') return `${val} Email(s) Scanned`
        if (this.statsAndMenuData.status === 'Canceled') return `${val} Email(s) Scanned`
        if (this.statsAndMenuData.status === 'Expired') return `${val} Email(s) Scanned`
        if (this.statsAndMenuData.status === 'Finished') return `${val} Email(s) Scanned`
      }
      if (section === 'totalEmailCount') {
        if (this.statsAndMenuData.status === 'Running') return `of total ${val} email(s)`
        if (this.statsAndMenuData.status === 'Canceled') return `of total ${val} email(s)`
        if (this.statsAndMenuData.status === 'Expired') return `of total ${val} email(s)`
        if (this.statsAndMenuData.status === 'Finished') return `of total ${val} email(s)`
      }
    },
    menuClick(menu) {
      this.itemStats[menu].notify = false
      if (menu !== this.activeMenu && menu !== 'targetUsers') {
        this.$nextTick(() => {
          const refTable = this.$refs.refInvestigationListData
          if (refTable) {
            if (refTable.$refs.elTableRef) {
              refTable.$refs.elTableRef.clearSelection()
              refTable.search = ''
              this.handleSearchChange()
            }
            refTable.serverSideSelectionCount = 0
            refTable.excludedResourceIdList = []
            refTable.isSelectedAllEver = false
          }
        })
      }
      this.activeMenu = menu
      this.showTargetUsersDetails = false
      this.showEmails = false
      if (menu !== 'targetUsers') {
        this.loading = true
        this.investigationListBodyData.pageNumber = 1
        this.investigationListBodyData.filter.FilterGroups[0].FilterItems[0].Value = menu
        this.getDatatableByMenuClick()
      } else {
        this.leftMenuLoading = true
        this.loading = true
        this.getDatatableByMenuClick()
      }
    },
    adjustTargetUserShowRecords(response = {}) {
      if (response?.data?.data) {
        const { totalNumberOfRecords = 0, totalNumberOfPages, pageNumber } = response.data.data
        this.serverSidePropsForTargetUsers.totalNumberOfRecords = totalNumberOfRecords
        this.serverSidePropsForTargetUsers.totalNumberOfPages = totalNumberOfPages
        this.serverSidePropsForTargetUsers.pageNumber = pageNumber
      }
    },
    adjustInboxShowRecords(response = {}) {
      if (response.data) {
        const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response?.data?.data || {}
        this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
        this.serverSideProps.totalNumberOfPages = totalNumberOfPages
        this.serverSideProps.pageNumber = pageNumber
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
    getDatatableByMenuClick() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.leftMenuLoading = true
      this.topMenuLoading = true
      this.loading = true
      this.$store
        .dispatch('investigations/getStatsAndMenuData', this.$route.params.id)
        .finally(() => {
          this.isRunning = this.statsAndMenuData.status === 'Running'
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
                  this.showTargetUsersDetails = false
                  this.showTargetUsersDetails = this.activeMenu === 'targetUsers'
                  this.showEmails = this.activeMenu !== 'targetUsers'
                  this.$forceUpdate()
                  this.leftMenuLoading = false
                  this.topMenuLoading = false
                  this.loading = false
                  if (this.autoRefreshInterval) {
                    clearInterval(this.autoRefreshInterval)
                  }
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
    refreshDatatable(isOnBackground = false, isInitial = false) {
      this.leftMenuLoading = !isOnBackground
      this.topMenuLoading = !isOnBackground
      this.loading = !isOnBackground
      if (this.activeMenu !== 'targetUsers') {
        this.investigationListBodyData.filter.FilterGroups[0].FilterItems[0].Value = this.activeMenu
      }

      this.$store
        .dispatch('investigations/getStatsAndMenuData', this.$route.params.id)
        .finally(() => {
          this.isRunning =
            this.statsAndMenuData &&
            this.statsAndMenuData.status &&
            this.statsAndMenuData.status === 'Running'
          if (!isInitial) {
            this.itemStats.targetUsers.isInitial = false
            this.itemStats.Inbox.isInitial = false
            this.itemStats.JunkEmail.isInitial = false
            this.itemStats.Drafts.isInitial = false
            this.itemStats.SentItems.isInitial = false
            this.itemStats.DeletedItems.isInitial = false
            this.itemStats.Others.isInitial = false
            this.itemStats.Stored.isInitial = false
          }
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
                  this.showTargetUsersDetails = this.activeMenu === 'targetUsers'
                  this.showEmails = this.activeMenu !== 'targetUsers'
                  this.$forceUpdate()
                  this.leftMenuLoading = false
                  this.topMenuLoading = false
                  this.loading = false
                  if (
                    this.isRunning &&
                    this.$route.name === 'Investigation Details' &&
                    this.isAutoRefreshActive
                  ) {
                    if (this.autoRefreshInterval) {
                      clearInterval(this.autoRefreshInterval)
                    }
                  }
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
      if (resp?.data?.data?.resourceId) {
        this.$router.push(
          `/incident-responder/investigations/investigation-details/${resp.data.data.resourceId}`
        )
      }
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.refreshDatatable()
      this.isWantToAddNewInvestigation = false
    },
    createCommunityFromMobileInfo() {
      this.isWantToAddNewInvestigation = true
    },
    isWantToDeleteAndNotifyConfirm() {},
    sendInvestigationDetailsWarningMessage(value, excludedResourceIdList, isSelectedAllEver) {
      this.isInvestigationWarningSelectAll = isSelectedAllEver
      this.investigationWarningExcludedResourceIdList = excludedResourceIdList || []
      if (value && value.emailLastAction && value.emailLastAction.actionType === 'Warning') {
        this.notifyMessage = value.emailLastAction.warningMessage
      } else {
        this.notifyMessage = ''
      }
      this.isWantToWarn = true
      this.warningMessageSubtitle =
        Array.isArray(value) && value.length && value.length > 1
          ? 'Type a message to reporting users'
          : 'Type a message to reporting user'

      this.soloWarningMessageValue = value
    },
    isWantToWarnConfirm() {
      if (this.$refs.refWarnForm.validate()) {
        let isArray = Array.isArray(this.soloWarningMessageValue)
        let data = []
        if (isArray) data = this.soloWarningMessageValue.map((item) => item.resourceId)
        else data.push(this.soloWarningMessageValue.resourceId)
        this.warningButtonDisabled = true
        this.$store
          .dispatch('investigations/sendInvestigationWarningMessage', {
            data: {
              items: data,
              warningMessage: this.notifyMessage,
              selectAll: !!this.isInvestigationWarningSelectAll,
              excludedItems: this.investigationWarningExcludedResourceIdList,
              filter: this.investigationListBodyData.filter
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
    deleteInvestigationDetails(value, excludedResourceIdList, isSelectedAllEver) {
      this.isInvestigationDeleteSelectAll = isSelectedAllEver
      this.investigationDeleteExcludedResourceIdList = excludedResourceIdList || []
      let isArray = Array.isArray(value)
      let totalCount = 1
      if (isArray) {
        if (isSelectedAllEver)
          totalCount = this.serverSideProps.totalNumberOfRecords - excludedResourceIdList.length
        else totalCount = value.length
      }
      this.totalSelectedItemsCount = totalCount
      this.isWantToDelete = true
      this.deleteValue = value
    },
    getWarningEmailDisableStatus(row) {
      if (!row.emailLastAction) {
        return false
      }

      return (
        row.emailLastAction.actionType === 'Warning' &&
        row.emailLastAction.status !== 'CompletedWithError'
      )
    },
    isWantToDeleteConfirm(val, message, hasForm = true) {
      if (hasForm && !this.$refs.refFormDeleteAndNotify.validate() && val && !message) {
        return
      }
      let isArray = Array.isArray(this.deleteValue)
      let data = []
      if (isArray) data = this.deleteValue.map((item) => item.resourceId)
      else data.push(this.deleteValue.resourceId)
      if (message) {
        const payload = {
          items: data,
          warningMessage: message,
          selectAll: this.isInvestigationDeleteSelectAll,
          excludedItems: this.investigationDeleteExcludedResourceIdList,
          isPermanentDelete: val,
          filter: this.investigationListBodyData.filter
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
              isNotify: false,
              isPermanentDelete: val,
              selectAll: this.isInvestigationDeleteSelectAll,
              excludedItems: this.investigationDeleteExcludedResourceIdList,
              filter: this.investigationListBodyData.filter,
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
      this.isWantToAddNewInvestigation = true
    },
    columnFilterChanged(filter) {
      this.resetPageNumber()
      this.emailsColumnFilterStatus.status = true
      this.investigationListBodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.investigationListBodyData
      )
      this.refreshDatatable()
    },
    columnFilterCleared(fieldName) {
      this.resetPageNumber()
      this.investigationListBodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.investigationListBodyData
      )
      this.calculateInvestigateListFilterActive()
      this.refreshDatatable()
    },
    columnFilterChangedTargetUsers(filter) {
      this.resetPageNumberForTargetUsers()
      this.targetUserColumnFilterStatus.status = true
      this.investigationTargetUsersListBodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.investigationTargetUsersListBodyData
      )
      this.refreshDatatable()
    },
    columnFilterClearedTargetUsers(fieldName) {
      this.resetPageNumberForTargetUsers()
      this.investigationTargetUsersListBodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.investigationTargetUsersListBodyData
      )
      this.calculateTargetUserListFilterActive()
      this.refreshDatatable()
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'investigations/getInvestigationDetailsListGetter', // for using getters,
      statsAndMenuData: 'investigations/statsAndMenuGetter', // for stats getters,
      investigationDetailsData: 'investigations/investigationDetailsDataGetter', // for stats getters,
      investigationDetailsListData: 'investigations/getInvestigationDetailsListGetter', // for stats getters,
      investigationDetailsTargetUsersListData:
        'investigations/getInvestigationDetailsTargetUsersListGetter'
    }),
    getInvestigationType() {
      const { investigationType = '', matchingPlaybookName = '' } =
        this.investigationDetailsData || {}
      const autoText = matchingPlaybookName || 'Auto'
      return investigationType.toLowerCase() === 'auto' ? autoText : investigationType
    },
    isMoveToTrashDisabled() {
      if (!this.deleteValue?.emailLastAction) {
        return false
      }
      return (
        this.deleteValue?.emailLastAction?.actionType === 'Delete' &&
        this.deleteValue?.emailLastAction?.status !== 'CompletedWithError' &&
        this.deleteValue?.emailLastAction?.isPermanentDelete === false
      )
    },
    isPermanentlyDeleteDisabled() {
      if (!this.deleteValue?.emailLastAction) {
        return false
      }
      return (
        this.deleteValue?.emailLastAction?.actionType === 'Delete' &&
        this.deleteValue?.emailLastAction?.status !== 'CompletedWithError' &&
        this.deleteValue?.emailLastAction?.isPermanentDelete === true
      )
    },
    itemStats() {
      return {
        targetUsers: {
          count: this.statsAndMenuData?.scannedUserCount || 0,
          notify: false,
          isInitial: true
        },
        Inbox: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'Inbox')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        JunkEmail: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'JunkEmail')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        Drafts: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'Drafts')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        SentItems: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'SentItems')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        DeletedItems: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'DeletedItems')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        Others: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'Others')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        },
        Stored: {
          count:
            this.statsAndMenuData?.folders?.find((item) => item['folderName'] === 'Stored')
              ?.mailCount || 0,
          notify: false,
          isInitial: true
        }
      }
    },
    getTimeLeftText() {
      const { diffDays, totalHours, totalMinutes } = this
      const diffDaysText = `${diffDays === 0 ? 0 : diffDays} day(s) `
      const totalHoursText = totalHours > 0 ? `${totalHours} hour(s) ` : ''
      if (this.loading) return 'Loading...'
      else if (this.statsAndMenuData.status === 'Finished') return 'Finished'
      else if (this.statsAndMenuData.status === 'Canceled') return 'Canceled'
      else if (this.statsAndMenuData.status === 'Expired') return 'Expired'
      else
        return `${diffDays > 0 ? diffDaysText : ''}${totalHoursText}${totalMinutes} minute(s) left`
    },
    getHeaderCardBoxShadow() {
      const { statsAndMenuData } = this
      const style = { boxShadow: '' }
      if (!statsAndMenuData) {
        return style
      } else if (statsAndMenuData.status === 'Running') {
        style.boxShadow = '0px 2px 5px rgba(33, 150, 243, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      } else if (statsAndMenuData.status === 'Finished') {
        style.boxShadow = '0px 2px 5px rgba(67, 160, 71, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      } else if (statsAndMenuData.status === 'Expired' || statsAndMenuData.status === 'Canceled') {
        style.boxShadow = '0px 2px 5px rgba(245, 108, 108, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      } else style.boxShadow = '0px 2px 5px rgba(230, 162, 60, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      return style
    },
    getHeaderCardBoxShadowSecond() {
      const { statsAndMenuData } = this
      const style = { boxShadow: '' }
      if (!statsAndMenuData) {
        return style
      } else if (statsAndMenuData.status === 'Running') {
        style.boxShadow = statsAndMenuData['onlineUserCount']
          ? '0px 2px 5px rgba(0, 188, 212, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
          : '0px 2px 5px rgba(230, 162, 60, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      } else if (statsAndMenuData.status === 'Finished') {
        style.boxShadow = '0px 2px 5px rgba(0, 188, 212, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      } else if (statsAndMenuData.status === 'Expired' || statsAndMenuData.status === 'Canceled') {
        style.boxShadow = '0px 2px 5px rgba(230, 162, 60, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1)'
      }
      return style
    },
    getHeaderCardBoxClassSecond() {
      const { statsAndMenuData } = this
      if (!statsAndMenuData) return ''
      if (statsAndMenuData.status === 'Running') {
        return statsAndMenuData['onlineUserCount'] ? 'bg-turquoise' : 'bg-macaroni'
      } else if (statsAndMenuData.status === 'Finished') return 'bg-turquoise'
      else if (statsAndMenuData.status === 'Expired' || statsAndMenuData.status === 'Canceled')
        return 'bg-macaroni'
      else return ''
    },
    getGoogleData() {
      return (
        this.investigationDetailsData &&
        this.investigationDetailsData.scanConfigurationDetails &&
        this.investigationDetailsData.scanConfigurationDetails.reduce((acc, item) => {
          if (item.type === 'GoogleWorkspace') acc.push(item.mailConfigurationName)
          return acc
        }, [])
      )
    },
    getOfficeData() {
      return (
        this.investigationDetailsData &&
        this.investigationDetailsData.scanConfigurationDetails &&
        this.investigationDetailsData.scanConfigurationDetails.reduce((acc, item) => {
          if (item.type === 'Outlook') acc.push(item.mailConfigurationName)
          return acc
        }, [])
      )
    },
    getWordData() {
      return (
        this.investigationDetailsData &&
        this.investigationDetailsData.scanConfigurationDetails &&
        this.investigationDetailsData.scanConfigurationDetails.reduce((acc, item) => {
          if (item.type === 'Microsoft 365' || item.type === 'O365')
            acc.push(item.mailConfigurationName)
          return acc
        }, [])
      )
    },
    getExchangeData() {
      return (
        this.investigationDetailsData &&
        this.investigationDetailsData.scanConfigurationDetails &&
        this.investigationDetailsData.scanConfigurationDetails.reduce((acc, item) => {
          if (item.type === 'Exchange') acc.push(item.mailConfigurationName)
          return acc
        }, [])
      )
    }
  },
  mounted() {
    if (this.statsAndMenuData && this.statsAndMenuData.status === 'Running') {
      this.isAutoRefreshActive = true
    }
  },
  watch: {
    itemStats: {
      handler(newValue, oldValue) {
        if (
          newValue.targetUsers.count !== oldValue.targetUsers.count &&
          !newValue.targetUsers.notify &&
          this.activeMenu !== 'targetUsers' &&
          (!oldValue.targetUsers.isInitial || !newValue.targetUsers.isInitial)
        ) {
          this.itemStats.targetUsers.isInitial = false
          this.itemStats.targetUsers.notify = true
        }
        if (
          newValue.Inbox.count !== oldValue.Inbox.count &&
          !newValue.Inbox.notify &&
          this.activeMenu !== 'Inbox' &&
          (!oldValue.Inbox.isInitial || !newValue.Inbox.isInitial)
        ) {
          this.itemStats.Inbox.isInitial = false
          this.itemStats.Inbox.notify = true
        }
        if (
          newValue.JunkEmail.count !== oldValue.JunkEmail.count &&
          !newValue.JunkEmail.notify &&
          this.activeMenu !== 'JunkEmail' &&
          (!oldValue.JunkEmail.isInitial || !newValue.JunkEmail.isInitial)
        ) {
          this.itemStats.JunkEmail.isInitial = false
          this.itemStats.JunkEmail.notify = true
        }
        if (
          newValue.Drafts.count !== oldValue.Drafts.count &&
          !newValue.Drafts.notify &&
          this.activeMenu !== 'Drafts' &&
          (!oldValue.Drafts.isInitial || !newValue.Drafts.isInitial)
        ) {
          this.itemStats.Drafts.isInitial = false
          this.itemStats.Drafts.notify = true
        }
        if (
          newValue.SentItems.count !== oldValue.SentItems.count &&
          !newValue.SentItems.notify &&
          this.activeMenu !== 'SentItems' &&
          (!oldValue.SentItems.isInitial || !newValue.SentItems.isInitial)
        ) {
          this.itemStats.SentItems.isInitial = false
          this.itemStats.SentItems.notify = true
        }
        if (
          newValue.DeletedItems.count !== oldValue.DeletedItems.count &&
          !newValue.DeletedItems.notify &&
          this.activeMenu !== 'DeletedItems' &&
          (!oldValue.DeletedItems.isInitial || !newValue.DeletedItems.isInitial)
        ) {
          this.itemStats.DeletedItems.isInitial = false
          this.itemStats.DeletedItems.notify = true
        }
        if (
          newValue.Others.count !== oldValue.Others.count &&
          !newValue.Others.notify &&
          this.activeMenu !== 'Others' &&
          (!oldValue.Others.isInitial || !newValue.Others.isInitial)
        ) {
          this.itemStats.Others.isInitial = false
          this.itemStats.Others.notify = true
        }
        if (
          newValue.Stored.count !== oldValue.Stored.count &&
          !newValue.Stored.notify &&
          this.activeMenu !== 'Stored' &&
          (!oldValue.Stored.isInitial || !newValue.Stored.isInitial)
        ) {
          this.itemStats.Stored.isInitial = false
          this.itemStats.Stored.notify = true
        }
      },
      deep: true,
      immediate: false
    },
    isAutoRefreshActive: {
      immediate: true,
      handler(isActive) {
        if (!this.autoRefreshInterval && isActive) {
          this.autoRefreshInterval = setInterval(() => this.refreshDatatable(true), 15000)
        } else {
          clearInterval(this.autoRefreshInterval)
        }
      }
    },
    statsAndMenuData() {
      if (this.statsAndMenuData) this.topMenuLoading = false
    },
    investigationDetailsData(val) {
      const tempArr = []
      if (val?.targetUsers) {
        if (val?.targetUserType === 'Groups') {
          for (let user of val.targetUsers) {
            tempArr.push({ Group: user.targetUser })
          }
        } else {
          for (let user of val.targetUsers) {
            tempArr.push({ User: user.targetUser })
          }
        }
      }
      this.targetUserChips = tempArr
      const headers = JSON.parse(JSON.stringify(this?.investigationDetailsData?.headers || []))
      headers.forEach((header) => {
        const ipAddress = header.ip
        const senderName = header.senderName
        delete header.ip
        delete header.senderName
        header['Ip Address'] = ipAddress
        header['Sender Name'] = senderName
      })
      const attachments = JSON.parse(
        JSON.stringify(this?.investigationDetailsData?.attachments || [])
      )

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

      this.criteriaChips = [
        {
          criteria:
            this?.investigationDetailsData?.logicalOperator === OPERATORS.AND
              ? TEXT_OPERATORS.And
              : TEXT_OPERATORS.Or
        },
        ...headers,
        ...(this.investigationDetailsData?.bodies || []),
        ...attachments
      ]
      this.leftMenuLoading = false
      this.contentMenuLoading = false
    },
    investigationDetailsListData(val) {
      this.loading = false
      vm.$forceUpdate()
      const data = val.results || []
      this.investigationDetailsList = data
      if (this.$refs.refInvestigationListData) {
        this.investigationDetailsList = data
      }
    }
  },
  created() {
    this.refreshDatatable(false, true)
  },
  beforeDestroy() {
    this.isRunning = false
    this.isAutoRefreshActive = false
    clearInterval(this.autoRefreshInterval)
    clearTimeout(this.timeoutId)
    this.autoRefreshInterval = null
  }
}
</script>
