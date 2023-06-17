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
      @click="handleTestConnectionClick"
    >
      <div v-if="isLoading" class="test-connection__button">
        TESTING CONNECTION
        <v-icon class="ml-2 loading-spin" color="#2196f3" left medium>mdi-rotate-left </v-icon>
      </div>
      <div
        :style="!isLoading && { maxWidth: '200px', width: isAllSuccess ? '200px' : '160px' }"
        class="test-connection__button"
        v-else
      >
        TEST CONNECTION
        <v-icon v-if="isAllSuccess && !isLoading" class="ml-2 mr-0" color="#43a047" left medium
          >mdi-check
        </v-icon>
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
import TestConnectivityStatus from '@/components/Settings/DnsServices/TestConnectivityStatus'
import SmishingService from '@/api/smishing'
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
      return this.checkApiConnectivity === 'success'
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
      SmishingService.testDomainConnection(payload)
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
    },
    handleTestConnectionClick() {
      this.$emit('testConnectionClicked')
    }
  }
}
</script>
