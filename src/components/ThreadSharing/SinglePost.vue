<template>
  <div class="component-single-post">
    <div id="" class="single-post">
      <div class="threat-sharing-content">
        <div class="ts-header">
          <div class="ts-title">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-clamp autoresize :max-lines="2" v-if="post.title" v-on="on">
                  {{ post.title }}
                </v-clamp>
                <v-clamp autoresize :max-lines="2" v-else v-on="on">Post Title</v-clamp>
              </template>
              <span class="tooltip-span">{{ post.title }}</span>
            </v-tooltip>
          </div>
          <div class="flex-grow-1"></div>
          <div class="ts-header-btn-1">
            <v-expansion-panel-header
              class="pa-0"
              style="min-height: 36px;"
              disable-icon-rotate
              id="single-post-expansion-header"
            >
              <template v-slot:actions mandatory="true">
                <v-btn
                  v-if="post.isToggle"
                  @click.native="getPostDetails(post.communityPostResourceId, postIndex, false)"
                  :id="'single-post-collapse' + post.communityPostResourceId"
                  :key="'single-post-collapse' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  >COLLAPSE
                </v-btn>
                <v-btn
                  v-else
                  @click.native="
                    getPostDetails(post.communityPostResourceId, postIndex, true, post)
                  "
                  :id="'single-post-details' + post.communityPostResourceId"
                  :key="'single-post-details' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  >DETAILS
                </v-btn>
              </template>
            </v-expansion-panel-header>
          </div>
          <v-menu offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn
                :id="'single-post-dots' + post.communityPostResourceId"
                icon
                color="blue"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <div
              :id="'notifications' + post.communityPostResourceId"
              class="notification-wrapper-single-post"
            >
              <v-list dense flat>
                <v-list-item-group color="primary">
                  <v-list-item
                    :id="'edit-btn' + post.communityPostResourceId"
                    v-if="canEdit(post)"
                    @click="editIncident(post, post.communityPostResourceId, post.communityName)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :id="'investigate-btn' + post.communityPostResourceId"
                    @click="openInvestigate()"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-magnify</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Investigate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    style="cursor: not-allowed;"
                    v-if="$route.name == 'Community'"
                    :id="'share-btn' + post.communityPostResourceId"
                  >
                    <v-tooltip bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-list-item-icon v-on="on">
                          <v-icon>mdi-send</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content v-on="on">
                          <v-list-item-title>
                            Share
                          </v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <span class="tooltip-span">
                        You cannot share incident from private communities
                      </span>
                    </v-tooltip>
                  </v-list-item>
                  <v-list-item
                    v-else
                    :id="'share-btn' + post.communityPostResourceId"
                    @click="shareIncident(post.communityPostResourceId, userIdFromStorage)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-send</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Share
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :id="'delete-btn' + post.communityPostResourceId"
                    v-if="canDelete(post)"
                    @click="
                      deleteIncident(
                        post.communityPostResourceId,
                        post.title,
                        post.communityResourceId
                      )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-menu>
        </div>
        <div class="ts-user-comp">
          <div :id="'post-details' + post.communityPostResourceId" class="ts-user-comp-detail">
            by
            <a
              :id="post.postedUserFullName"
              v-if="post.postedUserFullName"
              href="#"
              class="pl-1 pr-1"
              >{{ post.postedUserFullName }}</a
            >
            <a v-else href="#" class="pl-1 pr-1">Okan Yıldız</a> from
            <a
              :id="post.postedUserCompanyName"
              v-if="post.postedUserCompanyName"
              href="#"
              class="pl-1 pr-1"
              >{{ post.postedUserCompanyName }}</a
            >
            <a v-else class="pl-1 pr-1">Company Name</a> on
            <a :id="post.communityName" v-if="post.communityName" href="#" class="pl-1">{{
              post.communityName
            }}</a>
            <a v-else class="pl-1 pr-1">Community Name</a>
          </div>
          <div class="ts-user-date">
            <span :id="'date' + post.postedTime" v-if="post.postedTime">{{ post.postedTime }}</span>
            <span v-else>04.05.2019</span>
          </div>
        </div>
        <div class="ts-body">
          <v-clamp
            :id="'single-post-description-body' + post.communityPostResourceId"
            v-if="post.description"
            autoresize
            :max-lines="3"
            >{{ post.description }}
          </v-clamp>
          <v-clamp v-else autoresize :max-lines="3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </v-clamp>
        </div>
        <div
          :id="'single-post-footer' + post.communityPostResourceId"
          class="ts-footer d-flex row wrap"
        >
          <div class="ts-like mt-1">
            <v-btn
              :id="'single-post-like' + post.communityPostResourceId"
              disabled
              text
              x-small
              icon
              color="grey"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <v-btn
              :id="'single-post-unlike' + post.communityPostResourceId"
              v-if="false"
              disabled
              text
              x-small
              icon
              color="grey"
            >
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{
              (postDetails && postDetails.likeCount) || post.likeCount
            }}</span>
          </div>
          <div class="ts-message mt-1">
            <v-btn
              :id="'single-post-reply' + post.communityPostResourceId"
              text
              x-small
              icon
              color="grey"
              disabled
            >
              <v-icon>mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{ post.commentCount }}</span>
          </div>
          <div :id="'single-post-harmful' + post.communityPostResourceId" class="ts-harmful mt-1">
            <v-btn readonly v-if="post.harmfulItemCount" text x-small icon color="red">
              <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
            </v-btn>
            <span class="ts-actions">{{ post.harmfulItemCount }} harmful items</span>
          </div>
          <!-- solution field missing for now
          <div class="ts-success mt-1">
            <v-btn text x-small icon color="grey">
              <v-icon style="font-size: 14px" color="#43a047">mdi-check-circle</v-icon>
            </v-btn>
            <span class="ts-actions">Solution</span>
          </div>
          -->
          <div class="flex-grow-1"></div>
          <div class="ts-tags">
            <v-btn
              v-if="post.hasAttachment"
              text
              small
              rounded
              outlined
              class="tag-btn text-none"
              id="incident-badge-att"
            >
              <span>Attachment</span>
            </v-btn>
            <v-btn
              v-if="post.categoryResourceIdArray && post.categoryResourceIdArray.length"
              text
              small
              rounded
              outlined
              class="tag-btn ml-1 text-none"
              id="incident-badge--cat"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[0]).name
              }}
            </v-btn>
            <v-btn
              v-if="
                post.categoryResourceIdArray &&
                post.categoryResourceIdArray.length > 1 &&
                !post.hasAttachment
              "
              text
              small
              rounded
              outlined
              class="tag-btn ml-1 text-none"
              id="incident-badge"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[1]).name
              }}
            </v-btn>
            <div style="position: relative;">
              <v-btn
                v-if="
                  (post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length > 1) ||
                  (post.categoryResourceIdArray && post.categoryResourceIdArray.length > 2)
                "
                text
                small
                rounded
                outlined
                class="tag-btn ml-1 text-none"
                :id="'tooltip-btn' + post.categoryResourceIdArray[0]"
                @mouseover="hoverTool = true"
                @mouseleave="hoverTool = false"
              >
                <span v-if="post.hasAttachment"
                  >+{{ post.categoryResourceIdArray.length - 1 }}</span
                >
                <span v-else>+{{ post.categoryResourceIdArray.length - 2 }}</span>
              </v-btn>
              <div
                v-if="
                  hoverTool &&
                  post.categoryResourceIdArray &&
                  post.categoryResourceIdArray.length >= 1
                "
                class="tooltip-wrapper"
              >
                <div v-if="post.hasAttachment">
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                </div>
                <div
                  v-else-if="
                    post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length === 1
                  "
                >
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                </div>
                <div v-else-if="!post.hasAttachment">
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-expansion-panel-content
        v-if="emailData && post.isToggle"
        eager
        class="expand-body member-company-body pa-0"
      >
        <v-tabs v-model="tab" background-color="transparent" color="basil" class="tab-bar">
          <v-tab id="expansion-details">Details</v-tab>
          <v-tab id="expansion-preview">Email Preview</v-tab>
        </v-tabs>

        <v-tabs-items v-show="emailData" v-model="tab">
          <v-tab-item>
            <h1
              v-if="
                (emailData && emailData.subject && emailData.isSubjectFlagged) ||
                (emailData.from && emailData.from.isFromFlagged) ||
                (emailData.urls && emailData.urls.some((a) => a.isFlagged)) ||
                (emailData.attachments && emailData.attachments.some((a) => a.isFlagged))
              "
              class="detected-items"
            >
              Detected Items
            </h1>
            <div class="detail-parts">
              <p
                v-if="
                (emailData &&
                  emailData.subject &&
                  !emailData.subject.isSubjectHidden &&
                  emailData.subject.isFlagged)
              "
                class="detail-black"
              >
                Header
              </p>
              <p
                v-if="
                (emailData &&
                  emailData.from &&
                  !emailData.from.isFromHidden &&
                  emailData.from.isFromFlagged)
              "
                :id="'from' + emailData.from"
                class="detail-black detail-red"
              >
                From: {{ emailData.from }}
              </p>
              <p
                v-if="
                 (emailData &&
                  emailData.from &&
                  !emailData.from.isFromHidden &&
                  emailData.from.isFromFlagged)
              "
                class="detail-black"
              >
                The sender email address has been reported as harmful email sender.
              </p>
            </div>
            <div class="detail-parts">
              <p
                v-if="
                 (emailData &&
                  emailData.to &&
                  !emailData.isToHidden &&
                  emailData.to.isToFlagged)
              "
                :id="'from' + emailData.to[0]"
                class="detail-black detail-red"
              >
                To: {{ emailData.to.toString() }}
              </p>
              <!--<p
                v-if="
                  shareSettings &&
                  shareSettings.receiverInfo &&
                  shareSettings.receiverInfo[0] &&
                  shareSettings.receiverInfo[0].IsShow &&
                  shareSettings.receiverInfo[0].IsMalicious
                "
                class="detail-black"
              >
                The receiver email address has been reported as harmful email sender.
              </p>-->
            </div>
            <div
              v-if="emailData && emailData.urls && emailData.urls.length"
              class="preview-attch-wrapper detail-parts"
            >
              <p
                v-if="
                  emailData &&
                  emailData.urls &&
                  emailData.urls.some((a) => !a.isHidden && a.isFlagged)
                "
                class="detail-black"
              >
                Body
              </p>
              <p
                v-for="(el, ind) of emailData.urls"
                :key="ind + el.url"
                v-if="el && !el.isHidden && el.isFlagged"
                :id="'detail-links-' + el.name"
                class="detail-black detail-red"
              >
                Link: {{ el.url }} <br />
              </p>
              <div
                v-for="(att, ind) of emailData.urls"
                :key="ind + att.name"
                :id="'detail-malicious-' + att.name"
                v-if="att.isFlagged"
              >
                <p class="attach-found-malicious" v-if="ind === 0">
                  This link<span v-if="emailData.urls.length > 1">s</span> has been reported as a
                  phising link
                </p>
              </div>
            </div>
            <div
              class="details-attchments-wrapper preview-footer"
              v-if="emailData.attachments && emailData.attachments.length"
            >
              <div
                v-for="(att, ind) of emailData.attachments"
                :key="ind + att.name"
                v-if="att.isFlagged"
                class="preview-attch-wrapper details-attachments"
              >
                <h2 v-if="ind === 0">Attachments</h2>
                <div>
                  <div :id="'detail-attachs-' + att.name" class="attachment">
                    <div
                      :id="'detail-name-' + att.name"
                      v-if="!att.isHidden"
                      class="file-name max-char"
                    >
                      {{ att.name }}
                    </div>
                    <div
                      :id="'detail-name-' + att.name"
                      v-if="att.isHidden"
                      class="file-name max-char"
                    >
                      hidden by owner
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-for="(att, ind) of emailData.attachments"
                :key="ind + att.name"
                :id="'detail-malicious-' + att.name"
                v-if="att.isFlagged"
              >
                <p class="attach-found-malicious detail-black" v-if="ind === 0">
                  This file<span v-if="emailData.attachments.length > 1">s</span> has been reported
                  as a malicious
                </p>
              </div>
            </div>
            <div class="detail-discovery pb-4">
              <div
                :id="'detail-discovery-empty'"
                v-if="postDetails && postDetails.discoveryAndDetection"
                class="disc-header"
              >
                Discovery and Detection
              </div>
              <p
                :id="'detail-discovery'"
                v-if="postDetails && postDetails.discoveryAndDetection"
                class="discovery-p"
              >
                {{ postDetails && postDetails.discoveryAndDetection }}
              </p>
              <div v-if="postDetails && postDetails.affectArea" class="disc-header mb-1">
                Impact Range
              </div>
              <div
                :id="'detail-effect-area'"
                v-if="postDetails && postDetails.affectArea"
                class="impact-row"
              >
                <div class="impact-left">Effect area:</div>
                <div style="width: max-content; padding-right: 13px;" class="impact-right">
                  {{ postDetails && postDetails.affectArea.toString() }}
                </div>
              </div>
              <div
                :id="'detail-scope' + postDetails"
                v-if="postDetails && postDetails.scope"
                class="impact-row"
              >
                <div class="impact-left">Scope:</div>
                <div class="impact-right">{{ postDetails && postDetails.scope }}</div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="preview-header pt-0">
              <h2 v-if="emailData && emailData.subject && !emailData.isSubjectHidden">
                <span :class="[emailData.isSubjectFlagged ? 'malicious-style' : '']"
                  >Subject: {{ emailData.subject }}</span
                >
                <v-tooltip v-if="emailData.isSubjectFlagged" bottom opacity="1">
                  <template v-slot:activator="{ on }">
                    <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
                  </template>
                  <span>The subject has been reported as a threat source</span>
                </v-tooltip>
              </h2>
              <h2
                v-else-if="emailData && emailData.subject && emailData.isSubjectHidden"
                :id="'detail-subject-' + emailData.subject"
              >
                <span :class="[emailData.isSubjectFlagged ? 'malicious-style' : '']"
                  >Subject: hidden by owner</span
                >
                <v-tooltip v-if="emailData.isSubjectFlagged" bottom opacity="1">
                  <template v-slot:activator="{ on }">
                    <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
                  </template>
                  <span>This email address has been reported as a threat source</span>
                </v-tooltip>
              </h2>
              <div class="header-info pb-5">
                <div v-if="emailData && emailData.from && !emailData.isFromHidden">
                  <span :class="[emailData.isFromFlagged ? 'malicious-style' : '']"
                    >From: {{ emailData.from }}</span
                  >
                  <v-tooltip v-if="emailData.isFromFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                  <br />
                </div>
                <div v-if="emailData && emailData.from && emailData.isFromHidden">
                  <span :class="[emailData.isFromFlagged ? 'malicious-style' : '']"
                    >From: hidden by owner</span
                  >
                  <v-tooltip v-if="emailData.isFromFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.to.length && !emailData.isToHidden">
                  <span :class="[emailData.isToFlagged ? 'malicious-style' : '']"
                    >To: {{ emailData.to }}</span
                  >
                  <v-tooltip v-if="emailData.isToFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.to.length && !emailData.isToHidden">
                  <span :class="[emailData.isToFlagged ? 'malicious-style' : '']"
                    >To: hidden by owner</span
                  >
                  <v-tooltip v-if="emailData.isToFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.cc.length && !emailData.isCcHidden">
                  <span :class="[emailData.isCcFlagged ? 'malicious-style' : '']"
                    >CC: {{ emailData.cc.toString() }}</span
                  >
                  <v-tooltip v-if="emailData.isCcFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.cc && emailData.isCcHidden">
                  <span :class="[emailData.isCcFlagged ? 'malicious-style' : '']"
                    >CC: hidden by owner</span
                  >
                  <v-tooltip v-if="emailData.isCcFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.bcc.length && !emailData.isBccHidden">
                  <span :class="[emailData.isBccFlagged ? 'malicious-style' : '']"
                    >CC: {{ emailData.bcc.toString() }}</span
                  >
                  <v-tooltip v-if="emailData.isBccFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div v-if="emailData && emailData.bcc && emailData.isBccHidden">
                  <span :class="[emailData.isBccFlagged ? 'malicious-style' : '']"
                    >BCC: hidden by owner</span
                  >
                  <v-tooltip v-if="emailData.isBccFlagged" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </div>
                <div id="details-post-date" v-if="emailData.sentTime">
                  Date:
                  {{ emailData.sentTime }}
                  <br />
                </div>
              </div>
            </div>
            <div id="single-post-body" class="preview-body">
              <k-shadow-frame id="sframe" v-bind:content="emailData.body" />
            </div>
            <div
              class="preview-footer"
              v-if="emailData.attachments && emailData.attachments.length"
            >
              <h2>Attachments</h2>
              <div
                v-for="(att, ind) of emailData.attachments"
                :key="ind + att.name"
                class="preview-attch-wrapper"
              >
                <div class="attachment-wrapper">
                  <div
                    class="attachment red-attach"
                    :id="'single-post-attachments-' + att.name"
                    :class="[
                      att.isFlagged ? 'red-attach malicious-style' : '',
                      !att.isFlagged ? 'blue-attach' : ''
                    ]"
                  >
                    <v-tooltip v-if="att.isFlagged" bottom opacity="1" z-index="9999">
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="attach-icon red-icon">
                          <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                        </div>
                      </template>
                      <span>This attachment has been reported as a malicious file</span>
                    </v-tooltip>
                    <div v-else class="attach-icon blue-icon">
                      <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                    </div>
                    <v-tooltip bottom opacity="1" z-index="9999">
                      <template v-slot:activator="{ on }">
                        <div v-on="on" v-if="!att.isHidden" class="file-name max-char pl-2">
                          {{ att.name }}
                        </div>
                        <div v-on="on" v-if="att.isHidden" class="file-name max-char pl-2">
                          hidden by owner
                        </div>
                      </template>
                      <span>{{ !att.isHidden ? att.name : 'hidden by owner' }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="preview-buttons">
              <v-btn
                v-if="!userLiked"
                :disabled="!isJoined(post.communityResourceId)"
                @click="userLikePost(post.communityPostResourceId, post.communityResourceId)"
                :class="{ 'active-act': userLiked }"
                :id="'like-btn' + post.communityPostResourceId"
              >
                <v-icon>mdi-thumb-up</v-icon>
                Useful {{ (postDetails && postDetails.likeCount) || post.likeCount }}
              </v-btn>
              <v-btn
                v-else-if="userLiked"
                :disabled="!isJoined(post.communityResourceId)"
                @click="userUnlikePost(post.communityPostResourceId, post.communityResourceId)"
                color="#2196f3"
                :id="'unlike-btn' + post.communityPostResourceId"
              >
                <v-icon class="active-act">mdi-thumb-up</v-icon>
                Useful {{ (postDetails && postDetails.likeCount) || post.likeCount }}
              </v-btn>
              <v-btn
                :id="'comments-btn' + post.communityPostResourceId"
                :class="{ 'active-act': commentOpened }"
                @click="commentOpened = !commentOpened"
              >
                <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                Comments ({{ post.commentCount }})
              </v-btn>
            </div>
            <div class="preview-comments" :class="{ 'open-comments': commentOpened }">
              <div class="add-comment-row">
                <v-text-field
                  :id="'single-post-comment-' + post.communityPostResourceId"
                  class="comment-input"
                  placeholder="Write your comment here"
                  outlined
                  v-model="addCommentValue"
                  validate-on-blur
                  :rules="[rules.regex, rules.required]"
                />
                <v-btn
                  :id="'single-post-send-comment' + post.communityPostResourceId"
                  :disabled="!isJoined(post.communityResourceId) || !regexChar(addCommentValue)"
                  @click="addPostComment(post.communityPostResourceId, post.communityResourceId)"
                  class="send-btn"
                >
                  <v-icon>mdi-send</v-icon>
                  SEND
                </v-btn>
              </div>
              <div v-if="!seeComments && comments && comments.length" class="hidden-comments">
                <div class="comment-row">
                  <div class="user-wrapper">
                    <span class="username">{{ comments[0].commenterFullName }}</span>
                    from
                    <span class="company-name">{{ comments[0].commenterCompanyName }}</span>
                    <p class="the-comment">
                      {{ comments[0].comment }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="seeComments && comments && comments.length" class="hidden-comments">
                <div v-for="(com, ind) of comments" :key="ind + com.resourceId" class="comment-row">
                  <div class="user-wrapper">
                    <span class="username">{{ com.commenterFullName }}</span>
                    from
                    <span class="company-name">{{ com.commenterCompanyName }}</span>
                    <p class="the-comment">{{ com.comment }}</p>
                  </div>
                </div>
              </div>
              <div
                v-if="!seeComments && comments && comments.length > 1"
                id="single-post-see-all-comments"
                class="see-all-comments"
                @click="seeComments = true"
              >
                <span>See all {{ comments.length }} comments</span>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-expansion-panel-content>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp'
import { mapGetters } from 'vuex'
import vueCustomElement from 'vue-custom-element'
import KShadowFrame from '../KShadowFrame'
import {
  createComments,
  getComments,
  getCommunityPost,
  getSelectedEmailPreview,
  likePost
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
[data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[data-title]:after {
    content: attr(data-title);
    position: absolute;
    padding: 5px 16px 5px 36px;
    bottom: -1.6em;
    left: 100%;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
    border-radius: 4px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
}
[data-title] {
    position: relative;
}
.malicious-style {

  color: #bb2a45 !important;
  text-decoration: underline !important;
}

.malicious-icon {
  margin: 4px;
  font-size: 18px !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
}

.red-malicious-alert {
  border: unset !important;
  border-color: transparent !important;
  border-bottom-color: transparent !important;
  border-image: none !important;
  border-image-width: 0 !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
  text-decoration: unset !important;
  text-decoration-color: transparent !important;
  font-size: 18px !important;
  margin-top: -2px;
  padding-right: 3px;
  height: 16px !important;
  overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}
 `
})
export default {
  components: {
    VClamp
  },
  props: {
    openEditPopupItem: {
      type: Object,
      required: false
    },
    post: {
      type: Object,
      required: false,
      default: () => ({})
    },
    postIndex: {
      type: Number,
      required: true
    },
    totalPostCount: {
      type: Number,
      required: true
    },
    refreshData: {
      required: false
    }
  },
  computed: {},
  data: () => ({
    postDetails: {},
    comments: [],
    emailData: null,
    categories: [
      {
        resourceId: 'Ps0SSyl7rVNe',
        name: 'Malicious'
      },
      {
        resourceId: 'bEuAD1pdbRXF',
        name: 'Non-Malicious'
      },
      {
        resourceId: 'NGLCc9UCxJvw',
        name: 'Phishing'
      }
    ],
    userIdFromStorage: null,
    expanded: false,
    commentOpened: false,
    isWantToShareIncident: false,
    isWantToInvestigate: false,
    isWantToPostIncident: false,
    tab: 1,
    showAllTags: false,
    seeComments: false,
    rules: {
      required: (v) =>
        (!!v && v.length >= 5 && v.length <= 300) || 'Minimum 5 characters - Maximum 300 character',
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    likeCount: 15,
    userLiked: false,
    hasPermission: false,
    valid: false,
    userComment: '',
    hoverTool: false,
    details: {},
    shareSettings: {},
    addCommentValue: ''
  }),
  watch: {},
  mounted() {
    this.userIdFromStorage = localStorage.getItem('userId')
  },
  methods: {
    findCategory(id) {
      switch (id) {
        case 'Ps0SSyl7rVNe':
          return 'Malicious'
        case 'bEuAD1pdbRXF':
          return 'Non-Malicious'
        case 'NGLCc9UCxJvw':
          return 'Phishing'
        default:
          return ''
      }
    },
    openInvestigate() {
      this.$emit('openInvestigateModal', { status: true, title: this.post.Title })
    },
    shareIncident(postId, creatorUserId) {
      this.$store.state.threadSharing.isWantToShareIncident = true
      this.$store.state.threadSharing.sharedPost = postId
      this.$store.state.threadSharing.postCreatorId = creatorUserId
    },
    userLike() {},
    addComment() {},
    openDetails() {
      this.panel.push(0)
    },
    getPostDetails(postId, ind, bool) {
      this.post.isToggle = bool
      //postId = '4pDtxLYSG0mb'
      getComments(this.post.communityPostResourceId)
        .then((response) => {
          const { data } = response
          this.comments = data.data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting comments'
          })
        })
      getCommunityPost(this.post.communityPostResourceId).then((response) => {
        this.postDetails = response.data.data
      })
      //getSelectedEmailPreview(postId)
      getSelectedEmailPreview('4pDtxLYSG0mb')
        .then((response) => {
          const { data } = response
          this.emailData = data.data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting all community list data'
          })
        })
    },
    userLikePost(postId, communId) {
      likePost(postId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Like request success message'
          })
          getCommunityPost(this.post.communityPostResourceId).then((response) => {
            this.postDetails = response.data.data
          })
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when like a comment'
          })
        })
    },
    userUnlikePost(postId, communId) {
      likePost(postId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'UnlLike request success message'
          })
          getCommunityPost(this.post.communityPostResourceId).then((response) => {
            this.postDetails = response.data.data
          })
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when unlike a comments'
          })
        })
    },
    addPostComment(postId, communId) {
      const payload = {
        comment: this.addCommentValue
      }
      createComments(postId, payload)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Comment added has been succesfully'
          })
          getComments(this.post.communityPostResourceId)
            .then((response) => {
              const { data } = response
              this.comments = data.data
            })
            .catch((error) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                message: 'Error when getting comments'
              })
            })
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when creating a comment'
          })
        })
    },
    editIncident(post, communityName) {
      this.$emit('openEditPopupItem', post)
    },
    deleteIncident(postId, name, postCommunityId) {},
    isJoined(communId) {
      /*if (this.myCommunities && this.myCommunities.length) {
        return this.myCommunities.some((cId) => cId.CommunityId === communId)
      } else {
        return false
      }*/
      return true
    },
    isOwnerOfTheCommunity() {
      /*
      const creator = localStorage.getItem('communityCompanyId')
      const user = localStorage.getItem('companyId')
      if (
        user == creator ||
        this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId
      ) {
        return true
      } else {
        return false
      }*/
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
    },
    canDelete(compId) {
      /*if (
        this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId ||
        localStorage.getItem('companyId') === localStorage.getItem('communityCompanyId') ||
        this.getSelectedCompany.companyId === compId
      ) {
        return true
      } else {
        return false
      }*/
    },
    canEdit(compId) {
      /* if (
        this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId ||
        localStorage.getItem('companyId') === localStorage.getItem('communityCompanyId') ||
        this.getSelectedCompany.companyId === compId
      ) {
        return true
      } else {
        return false
      }*/
      return true
    },
    maliciousFound() {
      return this.shareSettings.attachments.some((at) => at.IsMalicious === true)
    }
  }
}
</script>

<style lang="scss">
.notification-wrapper-single-post {
  padding: 0 !important;
  width: 100%;
  box-shadow: 0 8px 10px -3px rgba(255, 255, 255, 0.14), 0 2px 4px 0 rgba(255, 255, 255, 0.14),
    0 3px 14px 2px rgba(255, 255, 255, 0.12);
}
.component-single-post {
  // Threat sharing Content
  .threat-sharing-content {
    min-height: 200px;
    width: 100%;
    padding: 24px !important;
    background-color: #ffffff;
    border-radius: 20px !important;

    @media only screen and (max-width: 500px) {
      padding: 16px !important;
    }
  }

  .ts-header {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .ts-header-btn-1 {
    display: flex;
  }

  .ts-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    max-width: 79%;
    position: relative;
    display: flex;

    @media only screen and (max-width: 1450px) {
      max-width: 70%;
    }
  }

  // Threat sharing Content End

  .notification-wrapper {
    background-color: #fff;
    padding: 0;
  }

  .v-menu__content {
    border-radius: 8px !important;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

    .v-list-item {
      padding-left: 29px !important;
      padding-right: 16px !important;
    }

    .v-list-item__title {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--black-87);
    }
  }

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .ts-user-comp-detail {
    align-items: center;
    display: flex;
    margin-top: 8px;
  }

  .v-btn--contained {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
  }

  .v-data-footer {
    margin-top: 24px !important;
  }

  .v-data-footer__select {
    .v-select {
      margin: 0 !important;
      margin-top: 3px !important;
      margin-left: 32px !important;
      height: 30px !important;
    }

    .v-text-field > .v-input__control > .v-input__slot:after {
      border: none !important;
      display: none !important;
    }

    .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border: none !important;
    }

    .v-input__append-inner {
      margin-left: 0 !important;
      margin-top: 3px !important;
      margin-right: 5px !important;
      padding-left: 0 !important;
    }

    .v-select__slot {
      align-items: center;
      display: flex;
      justify-content: center;
      height: 27px !important;
      background-color: #f2f2f2 !important;

      .v-select__selections {
        margin-left: 10px;
      }
    }

    .v-input__icon {
      width: 20px !important;
      min-width: 20px !important;
      height: 20px !important;
    }
  }

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
    margin-left: 4px;
    width: 36px !important;
  }

  .ts-tags {
    align-items: center;
    display: flex;
    flex-direction: row;
    max-width: max-content;

    > .tag-btn,
    > div > .tag-btn {
      border-radius: 18px;
      border: solid 1.5px #c0c4cc;
      background-color: #fff;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
      height: 32px !important;
    }
  }

  .ts-footer {
    align-items: center;
    display: flex;
    margin-top: 22px;
    margin-left: 0;
    margin-right: 0;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-like {
    margin-right: 10px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-message {
    margin-right: 40px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-harmful {
    margin-right: 15px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-success {
    display: flex;
    align-items: center;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-body {
    margin-top: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-user-comp {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    a:not(:last-child) {
      text-decoration: none;
      display: block;
      width: max-content;
      min-width: max-content;
    }

    a:last-child {
      width: unset !important;
      max-width: 100%;
      display: block;
      overflow: hidden;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ts-user-date {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .ts-action-counter {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .ts-actions {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-left: 3px;
  }

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .tab-bar {
    width: 100%;
    height: 48px;
    padding: 0;
    background-color: #f5f7fa;
    border-radius: 0 !important;

    .v-slide-group__wrapper {
      padding-left: 0 !important;
    }

    .v-slide-group__content {
      margin-right: 0 !important;
    }

    .v-tab--active {
      color: #2196f3 !important;
    }

    .v-tab {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center !important;
      margin-right: 32px !important;
      padding: 0 !important;
      padding-right: 3px !important;
      min-width: auto !important;
    }

    .v-tabs-bar {
      padding: 0 24px;
      height: 48px !important;
      border-radius: 0 !important;
    }
  }

  .v-window {
    border-radius: 20px !important;
    margin: 0 24px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    display: block !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  // Email Preview css
  .preview-header {
    margin-top: 32px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .header-info {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .preview-body {
    margin-top: 24px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    position: relative;
    min-height: auto;
    max-height: 500px;
    overflow: auto;

    .company-img {
      display: flex;
      position: absolute;
      right: 0;
      top: 20px;
      width: 84px;
      height: 84px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .bodyExpanded {
    height: 100% !important;
    max-height: 100% !important;
    padding-bottom: 56px;
  }

  .details-attchments-wrapper {
    display: flex;
    flex-direction: column;

    .details-attachments {
      width: 100% !important;

      h2 {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        padding-bottom: 4px !important;
      }

      .file-name {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(219, 37, 37, 0.87);
      }
    }
  }

  .attach-found-malicious {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 4px;
  }

  .preview-footer {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    flex-wrap: wrap;

    .preview-attch-wrapper {
      width: max-content;
    }

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
      width: 100%;
      padding-top: 13px;
    }

    .attachment-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      max-width: max-content;
      min-height: auto;

      .attachment {
        width: 182px;
        min-width: 182px;
        height: 32px;
        align-items: center;
        display: flex;
        flex-direction: row;
        margin: 16px;
        margin-left: 0;
        margin-top: 0;

        .attach-icon {
          min-width: 40px;
          height: 32px;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .red-icon {
          background-color: #bb2a45 !important;
        }

        .blue-icon {
          background-color: #2196f3 !important;
        }

        span {
          width: 100%;
          text-align: center;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.58;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .red-attach {
        background-color: #f3e1e5;
      }

      .blue-attach {
        background-color: #f1f8fe;
      }

      .file-name {
        display: block;
        max-width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .preview-buttons {
    margin-top: 24px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;

    .v-btn {
      border-radius: 18px !important;
      border: solid 1px #909399;
      box-shadow: unset !important;
      background-color: #fff !important;
      margin-right: 16px;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.87);
      padding-left: 16px !important;

      .v-icon {
        color: #909399;
        font-size: 19px !important;
        margin-right: 8px;
        margin-top: 1px;
        border: unset !important;
      }
    }

    .active-act {
      color: #2196f3 !important;
      border: solid 1px #2196f3 !important;
    }
  }

  .preview-border {
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;
  }

  // Details css
  .detail-parts:first-child {
    margin-top: 24px !important;
  }

  .detail-parts {
    margin-top: 16px;

    .detail-black {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 4px !important;
    }

    .detail-red {
      color: rgba(219, 37, 37, 0.87) !important;
    }
  }

  .detail-discovery {
    margin-top: 24px;

    .disc-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 8px;
    }

    .discovery-p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .impact-row {
    display: flex;
    flex-direction: row;
    padding-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    .impact-left {
      min-width: 100px;
      font-weight: 600 !important;
    }

    .impact-right {
      margin-top: 2px;
      max-width: 80%;
    }
  }

  .border-padding {
    padding-bottom: 8px;
    border-bottom: 1px solid #b3d4fc;
  }

  .member-company-body {
    .v-slide-group__content {
      border-bottom: unset !important;
    }
  }

  .expand-contaniner {
    width: 100%;
    height: 50px;
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    bottom: 0;
    background-image: linear-gradient(to bottom, transparent, #fff 50%);

    button,
    .v-btn:not(.v-btn--round).v-size--default {
      width: auto !important;
      height: 24px !important;
      border-radius: 12px !important;
      background-color: #409eff !important;
      box-shadow: unset !important;
      color: #fff;
      text-transform: capitalize !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      padding-left: 13px !important;

      i {
        width: 18px !important;
      }
    }
  }

  .opacityExpanded {
    background-image: none !important;
  }

  .preview-comments {
    height: 0;
    opacity: 0;
    transition: max-height 0.25s ease-in;
    overflow: hidden;

    .comment-row {
      display: flex;
      flex-direction: row;
      padding-top: 6px;

      .comment-input {
        margin-top: 3px;
        margin-right: 16px;

        .v-input__slot {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 13px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.54);
          padding-left: 24px !important;
          max-height: 70px;
          min-height: 40px;

          textarea {
            max-height: 70px;
            overflow: auto;
            margin-bottom: 5px;
            margin-top: 2px;
            margin-right: 2px;
          }

          label {
            top: 10px;
          }

          fieldset {
            padding-left: 18px !important;
          }
        }
      }

      .send-btn {
        border-radius: 18px !important;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
        background-color: #2196f3 !important;
        color: #fff !important;
        height: 36px !important;
        margin: 3px;

        i {
          font-size: 18px !important;
          padding-right: 8px;
        }
      }
    }

    .comment-row {
      border-radius: 4px;
      background-color: #f5f7fa;
      display: flex;
      padding: 16px;
      margin-bottom: 8px;

      .user-wrapper {
        display: block;
        max-width: 100%;

        .username,
        .company-name {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #2196f3;
          padding-right: 4px;
          cursor: pointer;
        }

        .company-name {
          padding-left: 4px;
        }
      }

      .the-comment {
        margin-bottom: 0 !important;
        padding-top: 8px !important;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        max-width: 100%;
      }
    }

    .see-all-comments {
      padding-top: 16px;
      padding-bottom: 24px;

      span {
        text-decoration: none;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        cursor: pointer;
      }
    }
  }

  .open-comments {
    height: auto !important;
    transition: max-height 0.25s ease-in;
    padding-bottom: 24px;
    opacity: 1;
    z-index: -5;
  }

  .add-comment {
    background-color: #fff !important;
    height: 60px;
    padding: 0 !important;
  }

  .unselected-warn {
    border-bottom: 1px solid #bb2a45;
    color: #bb2a45;
    padding: 0 2px !important;
  }

  .hide-buttons {
    opacity: 0;
    padding: 0 !important;
    height: 20px !important;
  }

  .display-none {
    display: none !important;
  }

  .tooltip-wrapper {
    display: block;
    max-width: 250px;
    width: 130px;
    height: 50px;
    border-radius: 4px;
    background-color: #6d6d6d;
    position: absolute;
    top: -55px;
    left: -35px;
    border-radius: 4px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
    padding: 8px;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 34px;
    }

    span {
      color: rgba(255, 255, 255, 0.87) !important;
      font-size: 12px !important;
      line-height: 1.33 !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400;
    }

    span:nth-child(2) {
      padding-top: 4px;
    }
  }

  .add-comment-row {
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    .comment-input {
      max-width: 80%;
    }

    .send-btn {
      border-radius: 18px !important;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      height: 36px !important;

      i {
        font-size: 18px !important;
        padding-right: 8px;
      }
    }
  }

  .file-name {
    padding-left: 7px;
  }

  #incident-badge {
    padding: 4px 12px;
  }

  .detected-items {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
    padding-top: 24px;
  }

  .malicious-style {
    color: #bb2a45 !important;
    text-decoration: underline !important;
  }

  .malicious-icon {
    font-size: 18px !important;
    color: #bb2a45 !important;
    caret-color: #bb2a45 !important;
  }

  .red-malicious-alert {
    border: unset !important;
    border-color: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
    color: #bb2a45 !important;
    caret-color: #bb2a45 !important;
    text-decoration: unset !important;
    text-decoration-color: transparent !important;
    font-size: 18px !important;
    margin-top: -2px;
    padding-right: 3px;
    height: 16px !important;
    overflow: hidden;
  }

  .red-malicious-alert::before {
    border: unset !important;
  }

  .malicious-style {
    .red-malicious-alert:not(:first-child) {
      display: none !important;
    }
  }
  .user-wrapper {
    width: 100%;
    height: auto;
    margin: auto;
  }
}
</style>
