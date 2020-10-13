<template>
  <div class="test-connection">
    <div
      :class="{
        'test-connection__disabled-text': getTestConnectionDisableStatus()
      }"
      class="new-integration__api-key__text"
      @click="testConnection(false)"
    >
      <div v-if="isLoading" class="test-connection">
        <v-icon class="ml-1 loading-spin" color="#00bcd4" left medium>mdi-rotate-left </v-icon>
        TESTING CONNECTION
      </div>
      <div class="test-connection">
        TEST CONNECTION
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestConnection',
  data() {
    return {
      loadingState: false
    }
  },
  computed: {
    isLoading() {
      return false
    }
  },
  methods: {
    testConnection() {}
  }
}
</script>

<style lang="scss">
.text-connection {
  &__button {
    border-radius: 18px;
    border: solid 1px #2196f3;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }
}
</style>
