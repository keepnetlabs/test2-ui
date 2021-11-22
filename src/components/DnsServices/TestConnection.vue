<template>
  <div class="test-connection">
    <div
      id="btn-test-connection--mail-configuration"
      :class="{
        'test-connection__disabled-text': isLoading,
        '': isAllSuccess
      }"
      class="new-integration__api-key__text"
      @click="testConnection(false)"
    >
      <div v-if="isLoading" class="test-connection__button">
        TESTING CONNECTION
        <v-icon class="ml-2 loading-spin" color="#2196f3" left medium>mdi-rotate-left </v-icon>
      </div>
      <div :style="!isLoading && { maxWidth: '160px' }" class="test-connection__button" v-else>
        TEST CONNECTION
      </div>
    </div>
    <div class="test-connection__testing-content" v-if="isLoadingStarted">
      <div class="test-connection__testing-content__item" id="test-connection-item-authenticating">
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkApiConnectivity"
            :message="checkApiConnectivityMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestConnectivityStatus from './TestConnectivityStatus'
import { testConnection } from '@/api/dnsServices'
export default {
  inheritAttrs: true,
  name: 'TestConnection',
  components: {
    TestConnectivityStatus
  },
  props: ['values', 'isValidate', 'isEdit'],
  data() {
    return {
      isSave: false,
      checkApiConnectivity: null,
      isLoadingStarted: false,
      checkApiConnectivityMessage: null
    }
  },
  computed: {
    isLoading() {
      let isLoading = this.checkApiConnectivity !== 'loading'
      if (isLoading) {
        this.$emit('loading')
      }
      return !isLoading
    }
  },
  methods: {
    isAllSuccess() {
      let isSuccess = this.checkApiConnectivity === 'success'
      this.$emit('testConnectionValues', isSuccess, this.isSave)
      return isSuccess
    },
    testConnection(isSave) {
      this.isSave = isSave
      this.isLoadingStarted = true
      this.setLoadingStates()
      let payload = {
        dnsServiceProviderTypeId: this.values.dnsServiceProviderTypeId,
        username: this.values.username,
        password: this.values.password,
        resourceId: this.values.resourceId
      }
      testConnection(payload, this.values.resourceId)
        .then((response) => {
          this.checkApiConnectivity = 'success'
          this.checkApiConnectivityMessage = 'Connected successfully '
          this.isAllSuccess(true)
        })
        .catch((error) => {
          this.checkApiConnectivity = 'error'
          this.checkApiConnectivityMessage =
            (error.response.data.validationMessages && error.response.data.validationMessages[0]) ||
            error.response.data.message
          this.isAllSuccess(false)
        })
    },
    setLoadingStates() {
      this.checkApiConnectivity = 'loading'
    }
  }
}
</script>

<style lang="scss">
.test-connection {
  &__button {
    width: 230px;
    height: 36px;
    border-radius: 18px;
    border: solid 1px #2196f3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
    margin-bottom: 8px;
  }
  &__testing-content {
    &__item {
      display: flex;
      padding: 0 5px;
      margin-top: 2px;
      &--label {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-right: 8px;
        min-width: 202px;
      }
    }
  }
}
</style>
