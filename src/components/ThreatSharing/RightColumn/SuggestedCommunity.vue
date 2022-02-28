<template>
  <div class="suggested-row">
    <div class="suggested-com-name" cols="12">
      <div
        :id="`text--threat-sharing-right-column-suggest-communities-item-community-name-${index}`"
        class="suggested-title`"
      >
        {{ community.communityName }}
      </div>
      <div class="suggested-com-detail">
        <v-icon class="suggested-people-icon pr-1">mdi-account-multiple</v-icon>
        <b
          :id="`text--threat-sharing-right-column-suggest-communities-item-member-count-${index}`"
          >{{ community.memberCount }}</b
        ><span class="suggested-row__seperator">•</span>
        <span
          :id="`text--threat-sharing-right-column-suggest-communities-item-industry-name-${index}`"
          class="suggested-company"
          >{{ community.industryName }}
        </span>
        <span class="suggested-row__seperator">•</span>
        <span
          :id="`text--threat-sharing-right-column-suggest-communities-item-privacy-status-name-${index}`"
          class="suggested-company"
          >{{ community.privacyStatusName }}
        </span>
      </div>
    </div>
    <div class="suggested-right-action">
      <v-btn
        id="threat-sharing-right-column-is-joined"
        class="suggested-btn"
        rounded
        v-if="community.isJoined"
      >
        <v-icon class="pl-2 pr-1">mdi-account-circle</v-icon>
        <span class="pr-2">Member</span>
      </v-btn>
      <v-btn
        @click="onJoinCommunity"
        class="suggested-btn"
        :id="`btn--threat-sharing-right-column-suggest-communities-item-${index}`"
        block
        rounded
        v-else
        :disabled="community.isJoined || isJoinCommunityButtonDisabled"
        style="background-color: #2196f3 !important"
      >
        <v-icon v-if="!community.isJoined" class="mr-2"
          >mdi-account-circle
        </v-icon>
        <v-icon
          v-if="community.isJoined"
          class="mr-2"
          style="color: #fff !important"
          >mdi-account-clock
        </v-icon>
        <div
          v-if="community.privacyStatusName != 'Private'"
          :key="community.resourceId"
        >
          JOIN
        </div>
        <div v-else-if="community.isJoined" :key="community.resourceId">
          Request Sent
        </div>
        <div v-else :key="community.resourceId">Request to join</div>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuggestedCommunity",
  props: {
    community: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ["joinCommunity"],
  methods: {
    onJoinCommunity() {
      this.$emit("joinCommunity");
    },
  },
};
</script>