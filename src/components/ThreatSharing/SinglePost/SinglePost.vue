<template>
  <div
    :id="`card--threat-sharing-single-post-${postIndex}`"
    class="component-single-post"
    :key="$route.query.postId || '1'"
  >
    <div style="z-index: 999999;">
      <new-investigation
        v-if="isWantToAddNewInvestigation"
        ref="refNewInvestigation"
        :status="isWantToAddNewInvestigation"
        :selected-mail="selectedEmail"
        :is-ts="true"
        style="z-index: 999999;"
        @closeAdd="closeNewInvestigationModal($event)"
      />
    </div>
    <SinglePostDeletePostDialog
      v-if="isWantToDelete"
      :status="isWantToDelete"
      :delete-incident-community-name="deleteIncidentCommunityName"
      :delete-incident-name="deleteIncidentName"
      :delete-incident-id="deleteIncidentId"
      @on-close="isWantToDelete = false"
      @on-delete="deleteIncidentConfirm"
    />
    <SinglePostShareDialog
      v-if="openShareModal"
      :status="openShareModal"
      :shared-incited-id="sharedIncitedId"
      @on-close="openShareModal = false"
    />
    <div class="single-post">
      <div class="threat-sharing-content">
        <div class="ts-header">
          <div class="ts-title">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-clamp
                  v-if="post.title"
                  v-on="on"
                  id="text--threat-sharing-single-post-title"
                  autoresize
                  :max-lines="2"
                >
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
              id="single-post-expansion-header"
              class="pa-0"
              style="min-height: 36px;"
              disable-icon-rotate
            >
              <template #actions>
                <v-btn
                  v-if="post.isToggle"
                  :id="'threat-sharing-single-post' + post.communityPostResourceId"
                  :key="'single-post-collapse' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  :disabled="!getPostPermission"
                  @click.native="getPostDetails(post.communityPostResourceId, postIndex, false)"
                  >COLLAPSE
                </v-btn>
                <v-btn
                  v-else
                  :id="'threat-sharing-single-post' + post.communityPostResourceId"
                  :key="'single-post-details' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  :disabled="!getPostPermission"
                  @click.native="
                    getPostDetails(post.communityPostResourceId, postIndex, true, post)
                  "
                  >DETAILS
                </v-btn>
              </template>
            </v-expansion-panel-header>
          </div>
          <v-menu offset-y transition="scale-transition">
            <template #activator="{ on }">
              <v-btn
                :id="'threat-sharing-single-post-dots' + post.communityPostResourceId"
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
              <v-list dense flat class="notification-wrapper__v-list">
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="getPostPermission && canEdit(post)"
                    :id="'threat-sharing-single-post-edit-button' + post.communityPostResourceId"
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
                    v-if="getInvestigationPermissions.POST.hasPermission"
                    :id="
                      'threat-sharing-single-post-investigate-button' + post.communityPostResourceId
                    "
                    @click="openInvestigate(post)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-magnify</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Investigate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="getSharePostPermission && post.communityPrivacyStatusId !== 1"
                    style="cursor: not-allowed; opacity: 0.3;"
                    :id="'threat-sharing-single-post-share-button' + post.communityPostResourceId"
                  >
                    <v-tooltip bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-list-item-icon v-on="on">
                          <v-icon>mdi-send</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content v-on="on">
                          <v-list-item-title> Share </v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <span class="tooltip-span">
                        You cannot share incident from private or hidden communities
                      </span>
                    </v-tooltip>
                  </v-list-item>
                  <v-list-item
                    v-else
                    :id="'threat-sharing-single-post-share-button' + post.communityPostResourceId"
                    @click="openShareModalFunc(post)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-send</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title> Share </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="getDeletePostPermission && canDelete(post)"
                    :id="'threat-sharing-single-post-delete-button' + post.communityPostResourceId"
                    @click="deleteIncident(post)"
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
            <b v-if="post.postedUserFullName" :id="post.postedUserFullName" class="pl-1 pr-1">{{
              post.postedUserFullName
            }}</b>
            <b v-else class="pl-1 pr-1">User Name</b> from
            <b
              v-if="post.postedUserCompanyName"
              :id="post.postedUserCompanyName"
              class="pl-1 pr-1"
              >{{ post.postedUserCompanyName }}</b
            >
            <b v-else class="pl-1 pr-1">Company Name</b> on
            <a
              v-if="post.communityName"
              :id="`threat-sharing-incidents-list-go-to-community-details${post.communityName}`"
              class="pl-1"
              @click="goToCommunityDetails(post)"
              >{{ post.communityName }}</a
            >
            <a v-else class="pl-1 pr-1">Community Name</a>
          </div>
          <div class="ts-user-date font-weight-medium">
            <span :id="'date' + post.postedTime" v-if="post.postedTime">{{ post.postedTime }}</span>
            <span v-else>04.05.2019</span>
          </div>
          <div
            v-if="post.securityLabelResourceIdArray && post.securityLabelResourceIdArray.length"
            class="ts-user-tlc"
          >
            <div
              class="ts-user-tlc__item"
              v-for="(tlc, index) of post.securityLabelResourceIdArray"
              :key="index"
            >
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="ts-user-tlc__item-item" :class="getTlcClass(tlc)">
                    {{ getTlcName(tlc) }}
                  </div>
                </template>
                <span class="tooltip-span">{{ getTlcTooltip(tlc) }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <div class="ts-body">
          <v-clamp
            v-if="post.description"
            :id="'single-post-description-body' + post.communityPostResourceId"
            autoresize
            :max-lines="3"
            >{{ post.description }}
          </v-clamp>
        </div>
        <div
          :id="'single-post-footer' + post.communityPostResourceId"
          class="ts-footer d-flex row wrap"
        >
          <div class="ts-like mt-1">
            <v-btn
              :id="'threat-sharing-single-post-like' + post.communityPostResourceId"
              text
              x-small
              icon
              color="grey"
              @click="
                postDetails && !postDetails.isLikedByUser
                  ? userLikePost(post.communityPostResourceId, post.communityResourceId)
                  : userUnlikePost(post.communityPostResourceId, post.communityResourceId)
              "
              style="cursor: pointer;"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{
              (postDetails && postDetails.likeCount) || post.likeCount
            }}</span>
          </div>
          <div class="ts-message mt-1">
            <v-btn
              :id="'threat-sharing-single-post-reply' + post.communityPostResourceId"
              text
              x-small
              icon
              color="grey"
              @click="commentOpened = !commentOpened"
            >
              <v-icon>mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{
              (comments && comments.length) ||
              (!getCommentDetails && post.commentCount ? post.commentCount : 0)
            }}</span>
          </div>
          <div :id="'single-post-harmful' + post.communityPostResourceId" class="ts-harmful mt-1">
            <v-btn
              id="threat-sharing-single-post-harmful-items"
              readonly
              v-if="post.harmfulItemCount"
              text
              x-small
              icon
              color="red"
            >
              <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
            </v-btn>
            <span class="ts-actions">{{ post.harmfulItemCount }} harmful item(s)</span>
          </div>
          <div class="flex-grow-1"></div>
          <div class="ts-tags">
            <v-btn
              v-if="post.hasAttachment"
              id="threat-sharing-single-post-badge-attachment"
              text
              small
              rounded
              outlined
              class="tag-btn text-none"
            >
              <span v-if="post.categoryResourceIdArray.length === 1">Attachment</span>
              <span v-else-if="post.categoryResourceIdArray.length > 1">Attachments</span>
            </v-btn>
            <v-btn
              v-if="post.categoryResourceIdArray && post.categoryResourceIdArray.length"
              id="threat-sharing-single-post-badge--category"
              text
              small
              rounded
              outlined
              class="tag-btn ml-1 text-none"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[0]) &&
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
              id="threat-sharing-single-post-badge"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[1]) &&
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
                :id="
                  'tooltip-btn' + post.categoryResourceIdArray && post.categoryResourceIdArray[0]
                "
                @mouseover="hoverTool = true"
                @mouseleave="hoverTool = false"
              >
                <span
                  >+{{
                    getAttachmentLength(post.hasAttachment, post.categoryResourceIdArray)
                  }}</span
                >
              </v-btn>
              <div
                v-if="
                  hoverTool &&
                  post.categoryResourceIdArray &&
                  post.categoryResourceIdArray.length >= 1
                "
                class="tooltip-wrapper"
              >
                <div
                  v-if="
                    post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length === 4
                  "
                >
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[3]) }}</span>
                </div>
                <div v-else-if="post.hasAttachment">
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
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                </div>
                <div v-else-if="!post.hasAttachment">
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[3]) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-expansion-panel-content
          v-if="emailData && post.isToggle"
          eager
          class="expand-body member-company-body pa-0 mt-4"
          :id="`post-content${post.communityPostResourceId}`"
        >
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            class="v-tabs-bar__details-tab"
          >
            <v-tab id="threat-sharing-single-post-email-preview-button">Email Preview</v-tab>
            <v-tab id="threat-sharing-single-post-email-details-button">Details</v-tab>
          </v-tabs>
          <v-tabs-items v-show="emailData && post.isToggle" v-model="tab">
            <v-tab-item>
              <PreviewHeaderForSinglePost :uploadRespond="emailData" />
              <div id="single-post-body" class="preview-body">
                <k-shadow-frame
                  :id="`sframe${post.communityPostResourceId}`"
                  v-bind:content="emailData.visibleBody"
                />
              </div>
              <div
                class="preview-footer mt-2"
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
                      <AttachmentsPreview :att="att" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="preview-buttons">
                <v-btn
                  v-if="postDetails && !postDetails.isLikedByUser"
                  @click="userLikePost(post.communityPostResourceId, post.communityResourceId)"
                  :class="{
                    'active-act': postDetails && postDetails.isLikedByUser
                  }"
                  :id="'like-btn' + post.communityPostResourceId"
                >
                  <v-icon
                    :class="{
                      'active-act': postDetails && postDetails.isLikedByUser
                    }"
                    >mdi-thumb-up</v-icon
                  >
                  Useful ({{ (postDetails && postDetails.likeCount) || post.likeCount }})
                </v-btn>
                <v-btn
                  v-else-if="postDetails && postDetails.isLikedByUser"
                  :class="{ 'active-act': postDetails.isLikedByUser }"
                  :id="'unlike-btn' + post.communityPostResourceId"
                  @click="userUnlikePost(post.communityPostResourceId, post.communityResourceId)"
                >
                  <v-icon class="active-act">mdi-thumb-up</v-icon>
                  Useful ({{ (postDetails && postDetails.likeCount) || post.likeCount }})
                </v-btn>
                <v-btn
                  :id="'comments-btn' + post.communityPostResourceId"
                  :class="{ 'active-act': commentOpened }"
                  @click="commentOpened = !commentOpened"
                >
                  <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                  Comments ({{
                    (comments && comments.length) ||
                    (!getCommentDetails && post.commentCount ? post.commentCount : 0)
                  }})
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="single-post__details">
                <h1 class="detected-items" v-if="emailData && emailData.subject">
                  <span> Subject: {{ emailData.subject }} </span>
                </h1>
                <div id="last-detail-parts" class="detail-parts">
                  <p
                    v-if="
                      (emailData.subject && emailData.isSubjectFlagged) ||
                      (!!emailData.from && emailData.isFromFlagged) ||
                      (emailData.to && !!emailData.to.length && emailData.isToFlagged) ||
                      (emailData.cc && !!emailData.cc.length && emailData.isCcFlagged) ||
                      (emailData.bcc && !!emailData.bcc.length && emailData.isBccFlagged)
                    "
                    class="detail-black disc-header single-post__details__section-header"
                  >
                    Header
                  </p>
                  {{ /* Subject  */  }}
                  <div
                    class="detail-part-item"
                    v-if="emailData && emailData.subject && emailData.isSubjectFlagged"
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          Subject:
                          <span class="detail-part-item__hide-overflow">
                            {{ emailData.subject }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(emailData.subject)">
                          <v-icon>mdi-content-copy</v-icon>Copy Subject
                        </span>
                      </div>
                    </div>

                    <div class="detail-part-item__col--warning">
                      Subject from this sender may include harmful content
                    </div>
                  </div>
                  {{ /* From  */  }}
                  <div
                    class="detail-part-item"
                    v-if="emailData && emailData.from && emailData.isFromFlagged"
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          From:
                          <span class="detail-part-item__hide-overflow">
                            {{ emailData.from }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(emailData.from)">
                          <v-icon>mdi-content-copy</v-icon>Copy Email Address
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      Emails from this sender may include harmful content
                    </div>
                  </div>
                  {{ /* To  */  }}
                  <div
                    class="detail-part-item"
                    v-if="emailData && emailData.to && emailData.isToFlagged"
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          To:
                          <span class="detail-part-item__hide-overflow">
                            {{ emailData.to.toString() }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(emailData.to.toString())">
                          <v-icon>mdi-content-copy</v-icon>Copy Email Address
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      This email address may be targeted by emails include harmful content
                    </div>
                  </div>
                  {{ /* Cc  */  }}
                  <div
                    class="detail-part-item"
                    v-if="
                      emailData && emailData.cc && !emailData.isCcHidden && emailData.isCcFlagged
                    "
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          CC:
                          <span class="detail-part-item__hide-overflow">
                            {{ emailData.cc.toString() }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(emailData.cc.toString())">
                          <v-icon>mdi-content-copy</v-icon>Copy Email Address
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      This email address may be targeted by emails include harmful content
                    </div>
                  </div>
                  {{ /* Bcc  */  }}
                  <div
                    class="detail-part-item"
                    v-if="
                      emailData && emailData.bcc && !emailData.isBccHidden && emailData.isBccFlagged
                    "
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          BCC:
                          <span class="detail-part-item__hide-overflow">
                            {{ emailData.bcc.toString() }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(emailData.bcc.toString())">
                          <v-icon>mdi-content-copy</v-icon>Copy Email Address
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      This email address may be targeted by emails include harmful content
                    </div>
                  </div>
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
                    class="detail-black single-post__details__section-header"
                  >
                    Body
                  </p>

                  {{ /* Links  */  }}
                  <div
                    class="detail-part-item"
                    v-for="(el, ind) of emailData.urls"
                    :key="ind + el.url"
                    v-if="el && !el.isHidden && el.isFlagged"
                    :id="'detail-links-' + el.name"
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          Link:
                          <span class="detail-part-item__hide-overflow">
                            {{ el.url }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(el.url)">
                          <v-icon>mdi-content-copy</v-icon>Copy Url
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      This link has been reported as phishing
                    </div>
                  </div>
                </div>
                <div
                  class="preview-attch-wrapper detail-parts"
                  v-if="
                    emailData.attachments &&
                    emailData.attachments.length &&
                    emailData.attachments.some((a) => !a.isHidden && a.isFlagged)
                  "
                >
                  <p class="detail-black single-post__details__section-header">
                    Attachments
                  </p>
                  {{ /* Attachments  */  }}
                  <div
                    class="detail-part-item"
                    v-for="(att, ind) of emailData.attachments"
                    :key="ind + att.name"
                    v-if="att.isFlagged"
                  >
                    <div class="detail-part-item__col--wrapper">
                      <div class="detail-part-item__col--major">
                        <div class="detail-part-item__text">
                          <span class="detail-part-item__hide-overflow pl-0">
                            {{ !att.isHidden ? att.name : 'Hidden by Owner' }}
                          </span>
                        </div>
                      </div>
                      <div class="detail-part-item__col--slight">
                        <span class="copy-link" @click="contentCopy(att.sha512)">
                          <v-icon>mdi-content-copy</v-icon>Copy SHA 512 Hash
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--warning">
                      This file has been reported as malicious content
                    </div>
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
                    <div class="impact-right">
                      {{ postDetails && postDetails.scope }}
                    </div>
                  </div>
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-expansion-panel-content>
        <div class="d-flex w-100 p-4" v-if="commentOpened">
          <SinglePostComments
            v-if="commentOpened"
            :commentOpened="commentOpened"
            :post="post"
            :comments="comments"
            :seeComments="seeComments"
            @changeCommentsValue="changeCommentsValue"
            class="mt-6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VClamp from 'vue-clamp'
import NewInvestigation from '@/components/Investigation/NewInvestigation'
import KShadowFrame from '@/components/KShadowFrame'
import labels from '@/model/constants/labels'
import vueCustomElement from 'vue-custom-element'
import {
  getComments,
  getCommunityPost,
  getCommunityPostPreview,
  likePost
} from '@/api/threatSharing'
import {
  incidenPostReviewElementBind,
  isOwner,
  isPostedByMe,
  scrollToComponent,
  copyToClipboard
} from '@/utils/functions'
import PreviewHeaderForSinglePost from '@/components/ThreatSharing/PreviewHeaderForSinglePost'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import SinglePostComments from '@/components/ThreatSharing/SinglePost/SinglePostComments'
import SinglePostDeletePostDialog from '@/components/ThreatSharing/SinglePost/SinglePostDeletePostDialog'
import SinglePostShareDialog from '@/components/ThreatSharing/SinglePost/SinglePostShareDialog'
import {
  findCategory,
  getCategories,
  getTlcClass,
  getTlcName,
  getTlcTooltip
} from '@/components/ThreatSharing/SinglePost/utils'

Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}
.malicious-style,
.malicious-link {
     color: #f56c6d !important;
    border-color: #f56c6d !important;
    background-color: #f3e1e5 !important;
    text-decoration: none !important;

    position: relative;
  text-decoration: none !important;
  border-bottom: 0 solid;
  position:relative;
  .share-setting-text {
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    text-decoration-style: unset !important;
    border: none !important;
    border-bottom: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
  }
}
[data-title]:hover:after {
    opacity: 1;

    visibility: visible;
}
[data-title]:after {
     content: attr(data-title);
    position: absolute;
    padding: 4px 8px;
    bottom: -40px;
    left: 0;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
  border-radius: 4px;
    line-height: 1.33;
    min-height: 24px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
        font-weight: normal;

}
[data-title] {
    position: relative;
}
.malicious-style {
   color: #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;

  text-decoration: none !important;
  border-bottom: 1px solid;
  position:relative;
      text-indent: 0;
}

.malicious-icon {
 top: 0px;
  background: transparent;
  color: #f56c6c;
  font-size: inherit !important;
  padding: 0;
}

.red-malicious-alert {
   color: #f56c6c !important;
    caret-color: #f56c6c !important;
    text-decoration: unset !important;
    text-decoration-color: transparent !important;
    font-size: inherit !important;
    overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}

.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}

.url-badge{
  font-family: "Open Sans", sans-serif;
    position: absolute;
    top: -8px;
    right: -8px;
    color: white;
    background-color: #757575c2;
    height: 10px;
    width: 10px;
    text-align: center;
    border-radius: 30px;
    font-size: 8px;
    font-weight: 900;
    line-height: 1.2 !important;
}
a{position:relative}
 `
})
export default {
  components: {
    SinglePostShareDialog,
    SinglePostDeletePostDialog,
    SinglePostComments,
    PreviewHeaderForSinglePost,
    VClamp,
    NewInvestigation,
    AttachmentsPreview
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
    refreshData: {
      required: false
    },
    searchValues: {
      default: {}
    },
    incidents: {
      default: []
    }
  },
  data: () => ({
    isEditCommentButtonDisabled: false,
    getCommentDetails: false,
    shareButtonDisabled: false,
    labels,
    openShareModal: false,
    deleteIncidentId: null,
    deleteIncidentName: null,
    deleteIncidentCommunityName: null,
    isWantToDelete: false,
    isWantToAddNewInvestigation: false,
    postDetails: {},
    comments: [],
    emailData: null,
    categories: getCategories(),
    commentOpened: false,
    sharedIncitedId: '',
    tab: 0,
    seeComments: false,
    hasPermission: false,
    hoverTool: false,
    details: {},
    shareSettings: {},
    addCommentValue: '',
    selectedEmail: {}
  }),
  computed: {
    ...mapGetters({
      getInvestigationPermissions: 'permissions/getInvestigationPermissions',
      getPostPermission: 'permissions/getThreatSharingGetPostPermission',
      getSharePostPermission: 'permissions/getThreatSharingSharePostPermission',
      getDeletePostPermission: 'permissions/getThreatSharingDeletePostPermission',
      getEditCommentPermission: 'permissions/getThreatSharingEditCommentPermission',
      getDeleteCommentPermission: 'permissions/getThreatSharingDeleteCommentPermission'
    })
  },
  watch: {
    '$route.query.postId'() {
      this.getPostDetails(this.$route.query.postId, 0, true)
    }
  },
  mounted() {
    if (this.$route.query.postId) {
      this.getPostDetails(this.$route.query.postId, 0, true)
    }
  },
  methods: {
    getTlcClass,
    getTlcTooltip,
    getTlcName,
    findCategory,
    changeCommentsValue(comments, postId) {
      this.comments = comments
      if (this.incidents.length) {
        const post = this.incidents.find((item) => item.communityPostResourceId === postId)
        if (post) {
          post.comments = comments
          post.commentCount = comments.length
        }
      }
      this.$forceUpdate()
    },
    getAttachmentLength(hasAttachment, categories) {
      if (hasAttachment) {
        return categories.length - 1
      } else {
        return categories.length - 2
      }
    },
    contentCopy(contentBody) {
      copyToClipboard(contentBody)
    },
    openShareModalFunc(post) {
      this.sharedIncitedId = post.communityPostResourceId
      this.openShareModal = true
    },
    goToCommunityDetails(post) {
      if (post.communityResourceId) {
        localStorage.setItem('communityName', post.communityName)
        localStorage.setItem('communityResourceIdForRedirect', post.communityResourceId)
        let incidentsData = {
          tableData: this.incidents,
          searchValues: this.searchValues,
          type: 'incident'
        }
        let communitiesData = null
        this.$store.dispatch('incidents/setIncidents', {
          key: 'incidents',
          incidentsData
        })
        this.$store.dispatch('communities/setCommunities', {
          key: 'communities',
          communitiesData
        })
        if (post.communityResourceId !== this.$route.params.id) {
          this.$router.push({
            path: `/threat-sharing/community/${post.communityResourceId}`
          })
        }
      }
    },
    closeNewInvestigationModal() {
      this.$emit('refreshData')
      this.isWantToAddNewInvestigation = false
      document.getElementById('component-incidents').style.zIndex = 6
    },
    deleteIncidentConfirm() {
      this.$emit('refreshData')
      this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
    },
    openInvestigate(post) {
      getCommunityPost(post.communityPostResourceId).then((response) => {
        this.selectedEmail = response.data.data.communityPostEmail
        this.isWantToAddNewInvestigation = true
        document.getElementById('component-incidents').style.zIndex = 8
      })
    },
    getPostDetails(postId, ind, bool) {
      this.post.isToggle = bool
      if (bool) {
        this.getComments(this.post.communityPostResourceId)
        getCommunityPostPreview(this.post.communityPostResourceId).then((response) => {
          const comId = this.post.communityPostResourceId
          this.postDetails = response.data.data
          this.emailData = response.data.data.communityPostEmail
          this.emailData.urls = this.emailData.urls.map((item) => {
            return {
              ...item,
              url: item.url.replace('&amp;', '&')
            }
          })
          setTimeout(() => {
            let recrusiveFunctionForDom = () =>
              document.getElementById(`sframe${comId}`)?.shadowRoot
            if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
            for (let url of response.data.data.communityPostEmail.urls) {
              let recrusiveFunctionForDom = () => document.getElementById(`sframe${comId}`)
              if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
              incidenPostReviewElementBind(url, null, `sframe${comId}`, true)
              const el = document.getElementById(`post-content${postId}`)
              scrollToComponent(el)
              this.$forceUpdate()
            }
          }, 500)
        })
      }
    },
    userLikePost(postId) {
      likePost(postId).then(() => {
        getCommunityPost(this.post.communityPostResourceId).then((response) => {
          this.postDetails = response.data.data
          this.post.likeCount = response.data.data.likeCount
          if (this.$store.state['incidents'].incidents.incidentsData) {
            const postIndex = this.$store.state[
              'incidents'
            ].incidents.incidentsData.tableData.findIndex(
              (item) => item.communityPostResourceId === postId
            )
            if (postIndex !== -1) {
              this.$store.state['incidents'].incidents.incidentsData.tableData[
                postIndex
              ].likeCount = response.data.data.likeCount
            }
          }
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        })
      })
    },
    userUnlikePost(postId) {
      likePost(postId).then(() => {
        getCommunityPost(this.post.communityPostResourceId).then((response) => {
          this.postDetails = response.data.data
          this.post.likeCount = response.data.data.likeCount
          if (this.$store.state['incidents'].incidents.incidentsData) {
            const postIndex = this.$store.state[
              'incidents'
            ].incidents.incidentsData.tableData.findIndex(
              (item) => item.communityPostResourceId === postId
            )
            if (postIndex !== -1) {
              this.$store.state['incidents'].incidents.incidentsData.tableData[
                postIndex
              ].likeCount = response.data.data.likeCount
            }
          }
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        })
      })
    },
    getComments(id) {
      this.isEditCommentButtonDisabled = true
      getComments(id)
        .then((response) => {
          const { data } = response
          this.getCommentDetails = true
          this.comments = data.data
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.comments = []
          }
        })
        .finally(() => (this.isEditCommentButtonDisabled = false))
    },
    editIncident(post) {
      this.$emit('openEditPopupItem', post)
    },
    deleteIncident(post) {
      this.deleteIncidentId = post.communityPostResourceId
      this.deleteIncidentName = post.title
      this.deleteIncidentCommunityName = post.communityName
      this.isWantToDelete = true
    },
    canDelete(post) {
      return isOwner(post.myMembershipStatusId) || isPostedByMe(post.isPostedByMe)
    },
    canEdit(post) {
      return isOwner(post.myMembershipStatusId) || isPostedByMe(post.isPostedByMe)
    }
  }
}
</script>
