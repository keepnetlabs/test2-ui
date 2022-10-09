<template>
  <div class="member-requests ts-header">
    <div class="ts-title">
      <img src="../../../assets/img/logo-min.png" alt="logo" />
      <div class="community-info-wrapper">
        <h2>{{ request.companyName }}</h2>
        <div class="community-sub-info">
          <div class="pa-0">
            <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
            <span class="company-mini-info">{{ request.userCount }} users</span>
          </div>
          <div class="pl-4 pa-0">
            <v-icon class="company-mini-icon">mdi-domain</v-icon>
            <span class="company-mini-info"
              >{{ request.industryName || 'No Category defined' }}
            </span>
          </div>
          <div class="pl-4 pa-0">
            <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
            <span class="company-mini-info">{{ request.postCount }} threat posts</span>
          </div>
        </div>
      </div>
    </div>
    <div class="request-btns flex-grow-1">
      <v-btn
        class="refuse-btn"
        block
        rounded
        medium
        id="threat-sharing-members-refuse-request-button"
        @click="onRefuseRequest(request.communityRequestResourceId)"
      >
        Refuse
      </v-btn>
      <v-btn
        class="accept-btn"
        block
        rounded
        medium
        id="threat-sharing-members-accept-request-button"
        @click="onAcceptRequesst(request.communityRequestResourceId)"
      >
        Accept
      </v-btn>
    </div>
    <v-expansion-panel-header style="display: none;" @click="toggle = !toggle" disable-icon-rotate>
      <template v-slot:actions> &nbsp; </template>
    </v-expansion-panel-header>
  </div>
</template>

<script>
export default {
  name: 'RequestCard',
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  emits: ['refuseRequest', 'acceptRequest', 'togglePanel'],
  methods: {
    onRefuseRequest() {
      this.$emit('refuseRequest')
    },
    onAcceptRequesst() {
      this.$emit('acceptRequest')
    }
  }
}
</script>
