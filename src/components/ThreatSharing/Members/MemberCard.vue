<template>
  <v-expansion-panel class="threat-sharing-content">
    <div class="ts-header">
      <div class="ts-title">
        <img
          :id="`item--threat-sharing-member-logo-${index}`"
          class="threat-sharing-content__logo d-flex"
          :src="memberImage"
          alt="logo"
        />
        <div class="community-info-wrapper">
          <h2 :id="`item--threat-sharing-member-company-name-${index}`">
            {{ member.companyName }}
          </h2>
          <div class="community-sub-info">
            <div class="pa-0">
              <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
              <span
                :id="`item--threat-sharing-member-user-count-${index}`"
                class="company-mini-info"
                >{{ member.userCount }} users</span
              >
            </div>
            <div class="pl-4 pa-0">
              <v-icon class="company-mini-icon">mdi-domain</v-icon>
              <span
                :id="`item--threat-sharing-member-industry-name-${index}`"
                class="company-mini-info"
                >{{ member.industryName || 'Unknown' }}</span
              >
            </div>
            <div class="pl-4 pa-0">
              <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
              <span
                :id="`item--threat-sharing-member-post-count-${index}`"
                class="company-mini-info"
                >{{ member.postCount }} threat posts</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex-grow-1"></div>
      <v-menu offset-y transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon color="blue" v-on="on" style="order: 2;">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <div class="notification-wrapper notification-wrapper__override">
          <v-list dense flat class="notification-wrapper__v-list">
            <v-list-item-group color="primary">
              <v-list-item
                id="threat-sharing-members-see-incidents-list-button"
                @click="onSeePostedIncidents"
              >
                <v-list-item-icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    :id="`item--threat-sharing-member-see-posted-incidents-${index}`"
                    >See posted incidents</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="onAppointNewOwner"
                id="threat-sharing-members-appoint-a-new-owner-button"
                v-if="canAppointNewOwner"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title :id="`item--threat-sharing-member-assign-as-owner-${index}`"
                    >Assign as owner</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="canRemoveFromCommunity"
                id="threat-sharing-members-remove-from-community-button"
                @click="onRemoveFromCommunity"
              >
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    :id="`item--threat-sharing-member-remove-from-community-${index}`"
                    >Remove from community</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-menu>
    </div>
    <v-expansion-panel-content class="expand-body member-company-body">
      <div class="members-posts">
        <div
          :id="`item--threat-sharing-member-top-posts-in-community-${index}`"
          class="members-posts-header"
        >
          Top posts in community
        </div>
        <div class="members-post-list">
          <a href="#">Harmful xls file</a>
          <a href="#">Whatsapp phishing attempt</a>
          <a href="#">Win a prize</a>
        </div>
        <div class="members-post-see-all pt-1">
          <a href="#">SEE ALL POSTS</a>
        </div>
      </div>
      <div class="members-pie">
        <pie :key="series[0]" :data="series" />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'MemberCard',
  components: { Pie },
  props: {
    member: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    memberImage: {
      type: String,
      required: true
    },
    canAppointNewOwner: {
      type: Boolean,
      required: true
    },
    canRemoveFromCommunity: {
      type: Boolean,
      required: true
    },
    series: {
      type: Array,
      required: true
    }
  },
  emits: ['seePostedIncidents', 'appointNewOwner', 'removeFromCommunity'],
  methods: {
    onSeePostedIncidents() {
      this.$emit('seePostedIncidents')
    },
    onAppointNewOwner() {
      this.$emit('appointNewOwner')
    },
    onRemoveFromCommunity() {
      this.$emit('removeFromCommunity')
    }
  }
}
</script>
