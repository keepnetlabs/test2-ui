<template>
  <div class="test-connection">
    <div
      id="btn-test-connection--mail-configuration"
      :class="{
        'd-flex': true,
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
      <v-icon
        v-if="isAllSuccess && !isLoading"
        :id="`btn--siem-integration-api-key-check`"
        class="ml-2 mb-7 mr-0"
        color="#43a047"
        left
        medium
        >mdi-check
      </v-icon>
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
import TestConnectivityStatus from '@/components/Settings/DnsServices/TestConnectivityStatus'
import { testDomainConnection } from '@/api/domains'
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
        this.$emit('loading', true)
      } else {
        this.$emit('loading', false)
      }
      return !isLoading
    },
    isAllSuccess() {
      let isSuccess = this.checkApiConnectivity === 'success'

      return isSuccess
    }
  },
  methods: {
    checkIfAllSuccess() {
      const isSuccess = this.isAllSuccess
      this.$emit('testConnectionValues', isSuccess, this.isSave)
      return isSuccess
    },
    testConnection(isSave) {
      this.$emit('save-button-disabled', true)
      this.isSave = isSave
      this.isLoadingStarted = true
      this.setLoadingStates()
      let payload = {
        dnsServiceProviderId: this.values.dnsServiceProviderId,
        zoneId: this.values.zoneId
      }
      testDomainConnection(payload)
        .then(() => {
          this.checkApiConnectivity = 'success'
          this.checkApiConnectivityMessage = 'Connected successfully '
          this.checkIfAllSuccess(true)
          this.$emit('save-button-disabled', false)
        })
        .catch((error) => {
          this.checkApiConnectivity = 'error'
          this.checkApiConnectivityMessage =
            (error.response.data.validationMessages && error.response.data.validationMessages[0]) ||
            error.response.data.message
          this.checkIfAllSuccess(false)
          this.$emit('save-button-disabled', true)
        })
    },
    setLoadingStates() {
      this.checkApiConnectivity = 'loading'
    }
  }
}
</script>
