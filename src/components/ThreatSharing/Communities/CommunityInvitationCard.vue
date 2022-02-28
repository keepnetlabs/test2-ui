<template>
  <div class="community-invitation-card">
    <div class="ts-header">
      <div
        id="threat-sharing-communities-ts-title-community-button"
        class="ts-title"
        @click="onClickCommunityName"
      >
        {{ community.name }}
      </div>
      <div class="flex-grow-1"></div>
      <div class="ts-header-btn-1">
        <div class="request-btns flex-grow-1">
          <v-btn
            id="threat-sharing-communities-refuse-button"
            class="refuse-btn"
            block
            rounded
            medium
            @click="onRefuseRequest"
          >
            CANCEL
          </v-btn>
          <v-btn
            class="accept-btn"
            :disabled="community['disabled']"
            block
            rounded
            medium
            id="threat-sharing-communities-accept-join-request"
            @click="onAcceptRequest"
          >
            JOIN
          </v-btn>
        </div>
      </div>
    </div>
    <div class="ts-user-comp">
      <div class="ts-user-comp-detail">
        <v-icon class="ts-people-icon pr-1">mdi-account-multiple</v-icon>
        <span class="pr-2">{{ community.memberCount }}</span>
        &#8226;
        <span class="ts-community-industry pl-2 pr-2">
          {{ community.industryName || "Industry" }}
        </span>
        &#8226;
        <span
          class="ts-community-industry pl-2"
          v-if="!!community.privacyStatusName"
          >{{ community.privacyStatusName }}</span
        >
      </div>
      <div
        v-if="community && community.lastPostTime"
        class="ts-community-date pt-1"
      >
        Last update:
        {{ community.lastPostTime }}
      </div>
    </div>
    <div class="ts-body">
      <v-clamp autoresize :max-lines="3">
        {{ community.description }}
      </v-clamp>
    </div>
  </div>
</template>

<script>
import VClamp from "vue-clamp";
export default {
  name: "CommunityInvitationCard",
  components: {
    VClamp,
  },
  props: {
    community: {
      type: Object,
      required: true,
    },
  },
  emits: ["communityNameClick", "refuseRequest", "acceptRequest"],
  methods: {
    onClickCommunityName() {
      this.$emit("communityNameClick");
    },
    onRefuseRequest() {
      this.$emit("refuseRequest");
    },
    onAcceptRequest() {
      this.$emit("acceptRequest");
    },
  },
};
</script>