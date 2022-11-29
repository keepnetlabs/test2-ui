<template>
  <div class="community-card">
    <div class="ts-header">
      <div
        class="ts-title"
        id="threat-sharing-communities-ts-title-button"
        :style="{ cursor: isOwnerOrMember ? 'pointer' : 'text' }"
        @click="onClickDetails"
      >
        {{ community.communityName }}
      </div>
      <div class="flex-grow-1"></div>
      <div class="ts-header-btn-1">
        <v-btn
          class="ts-header-btn-1__status"
          v-if="community.membershipStatusId == 1"
          outlined
          rounded
          medium
          color="blue"
        >
          OWNER
        </v-btn>
        <v-btn
          v-else-if="community.membershipStatusId == 3"
          outlined
          disabled
          rounded
          medium
          color="757575"
          style="cursor: default; opacity: 1; color: #757575 !important; font-weight: 600;"
        >
          REQUEST SENT
        </v-btn>
        <v-btn
          v-else-if="community.membershipStatusId == 2"
          outlined
          rounded
          medium
          color="blue"
          class="ts-header-btn-1__status"
        >
          MEMBER
        </v-btn>
        <v-btn
          v-else-if="isPrivateCommunity"
          outlined
          rounded
          medium
          :disabled="isRequestToJoinDisabled"
          class="join-button"
          id="threat-sharing-communities-request-to-join-button"
          @click="onRequestJoin"
        >
          <v-icon style="font-size: 20px; margin-right: 8px;" color="#fff">mdi-account-plus</v-icon>
          REQUEST TO JOIN
        </v-btn>
        <v-btn
          v-else-if="isPublicCommunity"
          outlined
          rounded
          :disabled="isRequestToJoinDisabled"
          medium
          class="join-button"
          id="threat-sharing-communities-join-button"
          @click="onJoin"
        >
          <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus</v-icon>
          JOIN
        </v-btn>
        <v-btn
          v-else-if="isRequestDeclined"
          disabled
          outlined
          rounded
          medium
          color="#757575"
          style="cursor: default; opacity: 1; color: #757575 !important; font-weight: 600;"
        >
          Request Declined
        </v-btn>
        <v-btn
          v-else-if="community.membershipStatusId == 4"
          outlined
          rounded
          medium
          color="blue"
          id="threat-sharing-communities-invited-button"
          @click="onClickInvited"
        >
          INVITED
        </v-btn>
      </div>
      <v-menu
        v-if="isOwnerOrMember || community.membershipStatusId == 3"
        offset-y
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon color="#757575">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <div class="communities__notification-wrapper">
          <v-list dense flat class="notification-wrapper__v-list">
            <v-list-item-group color="primary">
              <v-list-item
                v-if="canEditCommunity"
                id="threat-sharing-communities-edit-community-button"
                @click="onEditCommunity"
              >
                <v-list-item-icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Edit Community</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="isOwnerOrMember"
                id="threat-sharing-communities-notification-setting-button"
                @click="onClickNotificationSettings"
              >
                <v-list-item-icon>
                  <v-icon>mdi-bell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Notification Settings</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="canLeaveCommunity"
                id="threat-sharing-communities-leave-from-community-button"
                @click="onLeaveCommunity"
              >
                <v-list-item-icon>
                  <v-icon>mdi-exit-to-app</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Leave</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="canDeleteCommunity"
                id="threat-sharing-communities-delete-community-button"
                @click="onDeleteCommunity"
              >
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="community.membershipStatusId == 3"
                id="threat-sharing-communities-cancel-request-button"
                @click="onCancelRequest"
              >
                <v-list-item-icon>
                  <v-icon>mdi-close-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Cancel Request</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-menu>
    </div>
    <div class="ts-user-comp">
      <div class="ts-user-comp-detail">
        <v-icon class="pr-1" style="font-size: 16px;">mdi-account-multiple</v-icon>
        <span class="pr-2">{{ community.memberCount }}</span>
        &#8226;
        <span class="ts-community-industry pl-2 pr-2">
          {{ community.industryName || 'Industry' }}
        </span>
        &#8226;
        <span class="ts-community-industry pl-2" v-if="!!community.privacyStatusName">{{
          community.privacyStatusName
        }}</span>
      </div>
      <div v-if="community && community.createTime" class="ts-community-date pt-1">
        Last update:
        {{ community.lastPostTime ? community.lastPostTime : community.createTime }}
      </div>
    </div>
    <div class="ts-body">
      <v-clamp autoresize :max-lines="3">
        {{ community.communityDescription }}
      </v-clamp>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp'
export default {
  name: 'CommunityCard',
  components: {
    VClamp
  },
  props: {
    isOwnerOrMember: {
      type: Boolean,
      required: true
    },
    community: {
      type: Object,
      required: true
    },
    isRequestToJoinDisabled: {
      type: Boolean,
      required: true,
      default: false
    },
    canEditCommunity: {
      type: Boolean,
      required: true,
      default: false
    },
    canLeaveCommunity: {
      type: Boolean,
      required: true,
      default: true
    },
    canDeleteCommunity: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: [
    'detailsClick',
    'requestJoin',
    'join',
    'invitedClick',
    'editCommunity',
    'notificationSettingsClick',
    'leaveCommunity',
    'deleteCommunity',
    'cancelRequest'
  ],
  computed: {
    isPrivateCommunity() {
      return (
        !this.community?.membershipStatusId &&
        (this.community?.privacyStatusName === 'Private' ||
          (this.community?.membershipStatusId == 5 &&
            this.community?.privacyStatusName === 'Private'))
      )
    },
    isPublicCommunity() {
      return (
        !this.community?.membershipStatusId &&
        (this.community?.privacyStatusName === 'Public' ||
          (this.community?.membershipStatusId == 5 &&
            this.community?.privacyStatusName === 'Public'))
      )
    },
    isRequestDeclined() {
      return (
        this.community?.membershipStatusId &&
        this.community?.membershipStatusId == 5 &&
        (this.community?.privacyStatusName === 'Private' ||
          this.community?.privacyStatusName === 'Public')
      )
    }
  },
  methods: {
    onClickDetails() {
      this.$emit('detailsClick')
    },
    onRequestJoin() {
      this.$emit('requestJoin')
    },
    onJoin() {
      this.$emit('join')
    },
    onClickInvited() {
      this.$emit('invitedClick')
    },
    onEditCommunity() {
      this.$emit('editCommunity')
    },
    onClickNotificationSettings() {
      this.$emit('notificationSettingsClick')
    },
    onLeaveCommunity() {
      this.$emit('leaveCommunity')
    },
    onDeleteCommunity() {
      this.$emit('deleteCommunity')
    },
    onCancelRequest() {
      this.$emit('cancelRequest')
    }
  }
}
</script>
