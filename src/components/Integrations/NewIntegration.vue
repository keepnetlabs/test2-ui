<template>
  <div class="new-integration">
    <v-overlay
      :style="showConfirmModal ? 'background-color:white' : ''"
      :value="showConfirmModal"
      :z-index="9999"
      class="new-integration__confirm-modal"
      fixed
    >
      <v-card class="new-integration__confirm-modal__container" light>
        <h2 class="new-integration__confirm-modal__header">
          Are you sure to upload files to this service?
        </h2>
        <p class="new-integration__confirm-modal__content">
          Files may carry sensitive information about your company
        </p>
        <div class="new-integration__confirm-modal__footer">
          <button
            class="new-integration__confirm-modal__btn-continue mr-3"
            @click="saveButtonClickOnConfirmModal"
          >
            YES, CONTINUE
          </button>
          <button
            class="new-integration__confirm-modal__btn-cancel"
            @click="cancelClickOnConfirmModal"
          >
            {{ labels.Cancel }}
          </button>
        </div>
      </v-card>
    </v-overlay>
    <app-dialog
      v-if="isShowErrorMessage"
      title="Error Occurred"
      icon="mdi-alert"
      className="integration-error-message-popup"
      :status="isShowErrorMessage"
      :body="errorMessageOfApiKey"
      @changeStatus="isShowErrorMessage = false"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            id="btn-close--phishing-reporter-settings-download-history-modal"
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isShowErrorMessage = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <app-modal
      v-if="showModal"
      icon-name="mdi-plus"
      title-id="text--new-integration-modal-title"
      :status="showModal"
      :title="integrationId ? 'Edit Integration' : 'New Integration'"
    >
      <template v-slot:overlay-body>
        <app-modal-body-header
          :title="integrationId ? 'Edit Integration' : 'Add New Integration'"
          sub-title="Add new integration to your Incident Responder"
        />
        <v-form ref="form" lazy-validation>
          <form-group title="Integration Name" has-hint>
            <InputEntityName
              v-model.trim="formValues.name"
              id="input--integration-name"
              entityName="integration name"
              initialPlaceholder="Enter integration name"
            />
          </form-group>
          <form-group title="Description">
            <InputDescription
              v-model.trim="formValues.description"
              id="input--integration-description"
              initialPlaceholder="Enter description"
              rows="2"
              height="80"
              :maxLength="300"
            />
          </form-group>
          <form-group title="Integration Type" has-hint>
            <k-select
              v-model.trim="formValues.analysisEngineTypeResourceId"
              id="input--integration-type"
              :items="integrationTypes"
              :rules="[integrationTypeRules.required]"
              hint="*Required"
              persistent-hint
              dense
              item-text="name"
              item-value="resourceId"
              outlined
              placeholder="Select integration type"
              no-data-text="No integration available"
              :disabled="integrationTypeDisabled"
              @input="handleIntegrationTypeChange"
            ></k-select>
          </form-group>
          <form-group title="API URL" has-hint>
            <v-text-field
              id="input--integration-api-url"
              v-model.trim="formValues.apiUrl"
              :rules="[apiUrlRules.required, apiUrlRules.format, apiUrlRules.maxLength]"
              hint="*Required"
              persistent-hint
              dense
              outlined
              placeholder="Enter API URL"
              required
              @input="handleApiKeyChange"
            ></v-text-field>
          </form-group>
          <form-group :title="labels.ClientId" has-hint v-if="isCustomIntegration">
            <div class="copy-to-clipboard__container">
              <v-text-field
                :placeholder="labels.GeneratedClientId"
                id="input--integration-client-id"
                outlined
                dense
                hint="*Required"
                persistent-hint
                class="auth-key__textfield"
                v-model.trim="formValues.apiKey"
                required
                :rules="[nameValidation.required, nameValidation.empty]"
              ></v-text-field>
            </div>
          </form-group>
          <form-group
            :title="labels.ClientSecret"
            has-hint
            v-if="isCustomIntegration"
            class-name="client-secret"
          >
            <div class="copy-to-clipboard__container mb-0">
              <v-text-field
                v-model.trim="formValues.password"
                id="input--integration-client-secret"
                :placeholder="labels.GeneratedClientSecret"
                outlined
                dense
                hint="*Required"
                persistent-hint
                class="auth-key__textfield mb-0"
                required
                :rules="[nameValidation.required, nameValidation.empty]"
              ></v-text-field>
            </div>
            <div
              v-if="customIntegrationTestLoadingStatus === 'failed'"
              class="connection-error-state"
              style="top: 73px;"
            >
              <span> {{ customIntegrationTestLoadingStatusMessage }}</span>
            </div>
          </form-group>
          <v-list-item
            class="px-0"
            v-if="
              isVmrayVirusTotalOrAnyRun ||
              isIbmXForce ||
              isGoogleSafeBrowser ||
              isCustomIntegration ||
              isRoksit ||
              isGoogleWebRisk ||
              isOPSWAT
            "
          >
            <v-list-item-content>
              <v-list-item-title class="new-integration__label" v-if="!isCustomIntegration">
                API Key
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="!isCustomIntegration"
                class="new-integration__api-key__subtitle"
              >
                Enter API Key {{ isIbmXForce ? 'and Password' : '' }} generated by the provider
              </v-list-item-subtitle>
              <div
                v-if="!isCustomIntegration"
                v-for="(item, index) in formValues.apiKeys"
                :key="item.status"
                :id="`integration-api-key-container-${index}`"
                class="position-relative new-integration__api-keys"
              >
                <div class="max-width__form">
                  <v-text-field
                    v-if="!isIbmXForce"
                    v-model.trim="item.value"
                    :id="`input--integration-api-key-${index}`"
                    :class="item.status === 'failed' ? 'connection-error-state__border' : ''"
                    :rules="[apiKeyRules.required, apiKeyRules.format, apiKeyRules.maxLength]"
                    class="new-integration__textfield new-integration__api-key__textfield mt-2"
                    dense
                    height="40"
                    outlined
                    hint="*Required"
                    persistent-hint
                    placeholder="Enter API Key"
                    required
                    @input="handleApiKeyChange"
                  ></v-text-field>
                  <div v-else style="display: flex; align-items: center;">
                    <v-text-field
                      v-model.trim="item.value"
                      :id="`input--integration-api-key-${index}`"
                      :class="item.status === 'failed' ? 'connection-error-state__border' : ''"
                      :rules="[apiKeyRules.required, apiKeyRules.format, apiKeyRules.maxLength]"
                      class="new-integration__textfield new-integration__api-key__textfield mt-2"
                      dense
                      height="40"
                      outlined
                      hint="*Required"
                      persistent-hint
                      placeholder="Enter API Key"
                      required
                      @input="handleApiKeyChange"
                    ></v-text-field>
                    <v-text-field
                      v-model.trim="item.password"
                      id="input--integration-password"
                      style="margin-top: -5px;"
                      placeholder="Enter password"
                      outlined
                      dense
                      hide-details
                      :type="showPasswords[index] ? 'text' : 'password'"
                      :append-icon="
                        integrationId
                          ? ''
                          : showPasswords[index]
                          ? 'mdi-eye-outline'
                          : 'mdi-eye-off-outline'
                      "
                      class="ml-2 username-field input-group--focused"
                      @click:append="handlePasswordToggle(index)"
                    ></v-text-field>
                  </div>
                  <div
                    v-if="item.status === 'failed' && item.value.length > 0"
                    :id="`btn--integration-api-key-see-error-message-${index}`"
                    class="connection-error-state"
                    :style="isIbmXForce && { top: '49px !important' }"
                  >
                    <span>{{ getErrorMessageOfApiKey(item) }}</span>
                    <span
                      v-if="isShowSeeMore(item)"
                      style="cursor: pointer;"
                      @click="showErrorMessage(item)"
                      >See error message</span
                    >
                  </div>
                  <div
                    v-if="!!item.status"
                    class="new-integration__api-keys__connection-status"
                    :style="isIbmXForce && { top: '16px' }"
                  >
                    <v-icon
                      v-if="item.status === 'loading'"
                      :id="`btn--integration-api-key-loading-${index}`"
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      >mdi-rotate-left
                    </v-icon>
                    <v-icon
                      v-if="item.status === 'success'"
                      :id="`btn--integration-api-key-check-${index}`"
                      class="ml-1"
                      color="#43a047"
                      left
                      medium
                      >mdi-check
                    </v-icon>
                    <v-icon
                      v-if="item.status === 'failed' && loadingState.length"
                      :id="`btn--integration-api-key-close-${index}`"
                      class="ml-1"
                      color="#f56c6c"
                      left
                      medium
                      >mdi-close
                    </v-icon>
                    <div v-if="item.status === 'failed' && !loadingState.length">
                      <button
                        :id="`btn--integration-api-key-retry-${index}`"
                        :class="{
                          'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                        }"
                        class="retry-button"
                        @click="retryTestConnection(item)"
                      >
                        RETRY
                      </button>
                    </div>
                  </div>
                  <div
                    :id="`btn--integration-api-key-delete-${index}`"
                    :style="{
                      right: item.status ? '-100px' : '-40px',
                      top: isIbmXForce ? '8px' : '-2px'
                    }"
                    class="new-integration__api-keys__delete"
                  >
                    <v-icon
                      v-if="formValues.apiKeys.length > 1"
                      class="ml-2"
                      left
                      medium
                      @click="handleApiKeyDelete(index)"
                      >mdi-delete
                    </v-icon>
                  </div>
                </div>
              </div>
              <div></div>
              <div
                id="integration-api-key-footer"
                class="new-integration__api-key__footer"
                :style="[
                  (isCustomIntegration || isRoksit) && {
                    justifyContent: 'flex-end'
                  }
                ]"
              >
                <div
                  v-if="!isCustomIntegration && !isRoksit"
                  id="integration-api-key-footer-add-api-key"
                  class="new-integration__api-key__footer-left-side"
                  @click="addApiKey"
                >
                  <v-icon color="#2196f3" style="cursor: pointer !important;">mdi-plus</v-icon>
                  <div class="ml-2 new-integration__api-key__text">
                    ADD API KEY {{ isIbmXForce ? 'AND PASSWORD' : '' }}
                  </div>
                </div>
                <div
                  :class="{
                    'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                  }"
                  class="new-integration__api-key__text p-relative"
                  :style="[loadingState.length && { cursor: 'default' }]"
                  @click="testConnection(false)"
                >
                  <div
                    id="integration-api-key-footer-testing-connection"
                    v-if="loadingState.length"
                    class="test-connection new-integration__api-key__disabled-text"
                    style="cursor: default !important;"
                  >
                    <v-icon
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      disabled
                      style="cursor: default !important;"
                      >mdi-rotate-left
                    </v-icon>
                    TESTING CONNECTION
                  </div>
                  <div v-if="customIntegrationTestLoading">
                    <v-icon
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      style="
                        cursor: default !important;
                        position: absolute;
                        top: -66px;
                        right: -45px;
                      "
                      >mdi-rotate-left
                    </v-icon>
                  </div>
                  <div
                    v-else-if="!loadingState.length"
                    id="integration-api-key-footer-test-connection"
                    :class="{
                      'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                    }"
                    class="test-connection p-relative"
                  >
                    TEST CONNECTION
                    <div
                      v-if="isCustomIntegration && customIntegrationTestLoading === 'failed'"
                      :id="`btn--integration-api-key-see-error-message-${index}`"
                      :style="isIbmXForce && { top: '49px !important' }"
                      class="connection-error-state"
                    >
                      <span>{{ getErrorMessageOfApiKey(item) }}</span>
                      <span
                        v-if="isShowSeeMore(item)"
                        style="cursor: pointer;"
                        @click="showErrorMessage(item)"
                        >See error message</span
                      >
                    </div>
                    <div
                      v-if="isCustomIntegration && customIntegrationTestLoadingStatus"
                      class="new-integration__api-keys__connection-status"
                    >
                      <v-icon
                        v-if="
                          isCustomIntegration && customIntegrationTestLoadingStatus === 'success'
                        "
                        :id="`btn--integration-api-key-check-${index}`"
                        class="ml-1"
                        color="#43a047"
                        left
                        medium
                        style="top: -75px;"
                        >mdi-check
                      </v-icon>
                      <div
                        v-if="
                          isCustomIntegration && customIntegrationTestLoadingStatus === 'failed'
                        "
                        style="top: -73px; position: absolute; right: -10px;"
                      >
                        <button
                          :id="`btn--integration-api-key-retry-${index}`"
                          :class="{
                            'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                          }"
                          class="retry-button"
                          @click="retryTestConnection(item)"
                        >
                          RETRY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="px-0" v-if="isSpamHouse">
            <v-list-item-content>
              <div
                id="integration-api-key-footer-spam"
                class="new-integration__api-key__footer"
                :style="{ justifyContent: 'flex-start', marginTop: '-20px' }"
              >
                <div
                  :class="{
                    'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                  }"
                  class="new-integration__api-key__text p-relative"
                  style="width: 100%;"
                  :style="[loadingState.length && { cursor: 'default' }]"
                  @click="testConnection(false)"
                >
                  <div
                    id="integration-api-key-footer-testing-connection-api"
                    v-if="loadingState.length"
                    class="test-connection new-integration__api-key__disabled-text text-left"
                    style="cursor: default !important;"
                    :style="{ justifyContent: 'flex-end', display: 'flex' }"
                  >
                    <v-icon
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      disabled
                      style="cursor: default !important;"
                      >mdi-rotate-left
                    </v-icon>
                    TESTING CONNECTION
                  </div>
                  <div v-if="spamHouseTestLoading">
                    <v-icon
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      style="
                        cursor: default !important;
                        position: absolute;
                        top: -66px;
                        right: -45px;
                      "
                      >mdi-rotate-left
                    </v-icon>
                  </div>
                  <div
                    v-else-if="!loadingState.length"
                    id="integration-api-key-footer-test-connection-spam"
                    :class="{
                      'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                    }"
                    :style="{ justifyContent: 'flex-end', display: 'flex' }"
                    class="test-connection p-relative text-left"
                  >
                    TEST CONNECTION
                    <div
                      v-if="isSpamHouse && spamHouseTestLoading === 'failed'"
                      :id="`btn--integration-api-key-see-error-message-${index}`"
                      class="connection-error-state"
                    >
                      <span>{{ getErrorMessageOfApiKey(item) }}</span>
                      <span
                        v-if="isShowSeeMore(item)"
                        style="cursor: pointer;"
                        @click="showErrorMessage(item)"
                        >See error message</span
                      >
                    </div>
                    <div
                      v-if="isSpamHouse && spamHouseTestLoadingStatus"
                      class="new-integration__api-keys__connection-status"
                    >
                      <v-icon
                        v-if="isSpamHouse && spamHouseTestLoadingStatus === 'success'"
                        :id="`btn--integration-api-key-check-${index}`"
                        class="ml-1 spamHouseSuccess"
                        color="#43a047"
                        left
                        medium
                        style="top: -75px;"
                        >mdi-check
                      </v-icon>
                      <div
                        v-if="isSpamHouse && spamHouseTestLoadingStatus === 'failed'"
                        style="top: -73px; position: absolute; right: -10px;"
                      >
                        <button
                          :id="`btn--integration-api-key-retry-${index}`"
                          :class="{
                            'new-integration__api-key__disabled-text': getTestConnectionDisableStatus()
                          }"
                          class="retry-button"
                          @click="retryTestConnection(item)"
                        >
                          RETRY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <form-group title="Username" has-hint v-if="isFortiNet">
            <v-text-field
              v-model.trim="formValues.userName"
              id="input--integration-username"
              hint="*Required"
              persistent-hint
              dense
              height="40"
              outlined
              placeholder="Enter username"
              required
            ></v-text-field>
          </form-group>
          <form-group title="Password" has-hint v-if="isFortiNet">
            <v-text-field
              id="input--integration-password"
              placeholder="Enter password"
              outlined
              dense
              v-model.trim="formValues.password"
              hint="*Required"
              persistent-hint
              :type="showPassword ? 'text' : 'password'"
              :append-icon="
                integrationId ? '' : showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              class="username-field input-group--focused"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <div
              v-if="isFortiNet"
              id="integration-forti-net-container"
              :class="{
                'new-integration__api-key__disabled-text': isFortiNetConnectionDisabled
              }"
              class="new-integration__api-key__text"
              :style="[
                {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  maxHeight: '23px'
                },
                isFortiNetConnectionDisabled && { cursor: 'default' }
              ]"
              @click="testFortiNetConnection(false)"
            >
              <div
                v-if="isFortiNetTestingConnection"
                id="integration-forti-net-testing-connection"
                class="test-connection new-integration__api-key__disabled-text"
                style="cursor: default !important;"
              >
                <v-icon
                  class="ml-1 loading-spin"
                  color="#00bcd4"
                  left
                  medium
                  disabled
                  style="cursor: default !important;"
                  >mdi-rotate-left
                </v-icon>
                TESTING CONNECTION
              </div>
              <div
                v-else
                :class="{
                  'new-integration__api-key__disabled-text': isFortiNetConnectionDisabled
                }"
                class="test-connection"
              >
                <v-icon
                  v-if="isFortiNetConnected && isFortiNetConnectionSended"
                  id="integration-forti-net-check"
                  color="#43a047"
                  class="ml-1"
                  style="margin-top: -2px; font-size: 22px;"
                  left
                  medium
                  >mdi-check
                </v-icon>
                <v-icon
                  v-if="!isFortiNetConnected && isFortiNetConnectionSended"
                  id="integration-forti-net-close"
                  class="ml-1"
                  style="margin-top: -2px; font-size: 22px;"
                  color="#f56c6c"
                  left
                  medium
                  >mdi-close
                </v-icon>
                <span>TEST CONNECTION </span>
              </div>
            </div>
          </form-group>
          <form-group
            v-if="isVirusTotal"
            title="Detection Threshold"
            sub-title="Set the minimum number of required analysis engines that return a positive result to mark an email as malicious"
            hint
            class="my-3"
          >
            <InputNumber
              v-model="formValues.detectionThreshold"
              entity-name="Detection Threshold"
              initial-placeholder="Enter a number"
              :initialRules="detectionThresholdRules"
            />
          </form-group>
          <v-list-item :class="['px-0', { 'mt-3': isVmrayVirusTotalOrAnyRun }]">
            <v-list-item-content>
              <v-list-item-title class="new-integration__label">
                Tags
              </v-list-item-title>
              <v-list-item-subtitle class="new-integration__api-key__subtitle">
                Use enter key to use tags
              </v-list-item-subtitle>
              <div class="max-width__form new-integration__api-key__combobox">
                <k-select
                  v-model.trim="formValues.tags"
                  type="combobox"
                  id="input--integration-tags"
                  :items="[]"
                  :return-object="false"
                  class="edit-select standard-height mt-2"
                  deletable-chips
                  dense
                  item-text="name"
                  multiple
                  outlined
                  persistent-hint
                  placeholder="Enter Tag"
                  small-chips
                  @input="handleTagItemChange"
                />
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :class="['px-0']">
            <v-list-item-content>
              <v-list-item-title class="new-integration__label">
                Proxy
              </v-list-item-title>
              <div class="max-width__form new-integration__api-key__combobox">
                <v-autocomplete
                  v-model="formValues.proxyResourceId"
                  id="input--new-integration-proxy"
                  :items="proxyItems"
                  no-data-text="No proxy available"
                  class="company-groups-select-company mt-2"
                  autocomplete="off"
                  item-value="resourceId"
                  item-text="name"
                  outlined
                  persistent-hint
                  placeholder="Select proxy"
                ></v-autocomplete>
                <div
                  id="integration-api-key-footer-test-connection-proxy"
                  class="test-connection p-relative"
                  style="text-align: right;"
                  v-if="false"
                >
                  <span
                    style="text-align: right; cursor: pointer;"
                    :class="{
                      'new-integration__api-key__disabled-text':
                        proxyTestLoadingStatus === 'loading'
                    }"
                    @click="getProxyTestConnection"
                  >
                    <v-icon
                      v-if="proxyTestLoadingStatus === 'loading'"
                      :id="`btn--integration-api-key-loading-${index}`"
                      class="ml-1 loading-spin"
                      color="#00bcd4"
                      left
                      medium
                      :class="{
                        'new-integration__api-key__disabled-text':
                          proxyTestLoadingStatus === 'loading'
                      }"
                      >mdi-rotate-left </v-icon
                    >{{
                      proxyTestLoadingStatus === 'loading'
                        ? 'TESTING CONNECTION'
                        : 'TEST CONNECTION'
                    }}</span
                  >
                  <div
                    v-if="proxyTestLoadingStatus === 'failed'"
                    :id="`btn--integration-api-key-see-error-message-${index}`"
                    class="connection-error-state"
                    style="top: -23px;"
                  >
                    <span>{{ proxyTestStatusMessage }}</span>
                  </div>
                  <div class="new-integration__api-keys__connection-status">
                    <v-icon
                      v-if="proxyTestLoadingStatus === 'success'"
                      :id="`btn--integration-api-key-check-${index}`"
                      class="ml-1"
                      color="#43a047"
                      left
                      medium
                      style="top: -66px;"
                      >mdi-check
                    </v-icon>
                    <div
                      v-if="proxyTestLoadingStatus === 'failed'"
                      style="top: -60px; position: absolute; right: -10px;"
                    >
                      <button
                        :id="`btn--integration-api-key-retry-${index}`"
                        class="retry-button"
                        @click="getProxyTestConnection"
                      >
                        RETRY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="px-0">
            <v-list-item-content>
              <label class="new-integration__label" for="input--integration-is-send-url"
                >URLs</label
              >
              <div class="mt-1">
                <v-checkbox
                  v-model="formValues.isSendUrl"
                  id="input--integration-is-send-url"
                  color="#2196f3"
                  :label="`Share URLs in emails with integrated service`"
                  :disabled="!selectedIntegrationType.isSendUrl"
                  @change="handleSendUrlChange"
                />
              </div>
              <div
                class="new-integration__api-key__subtitle__upload-subtitle position-relative checkbox-tooltip"
              >
                <v-checkbox
                  v-model="formValues.isHideUrlParameter"
                  id="input--integration-is-hide-url-parameter"
                  color="#2196f3"
                  :label="`Hide URL Parameters`"
                  :disabled="!formValues.isSendUrl || !selectedIntegrationType.isSendUrl"
                ></v-checkbox>
                <v-tooltip bottom opacity="1">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-icon
                      v-on="{ ...tooltip }"
                      :disabled="!formValues.isSendUrl || !selectedIntegrationType.isSendUrl"
                      >mdi-help-circle</v-icon
                    >
                  </template>
                  <span class="tooltip-span" style="max-width: 50px;">{{
                    'Send URLs without query string parameters'
                  }}</span>
                </v-tooltip>
              </div>
            </v-list-item-content>
          </v-list-item>
          <form-group title="Sender IP" class-name="mt-4">
            <div>
              <v-checkbox
                v-model="formValues.isSendIp"
                id="input--integration-is-send-ip"
                label="Scan sender IP address"
                color="#2196f3"
                style="margin-top: 2px;"
                :disabled="
                  isSpamHouse || (!selectedIntegrationType.isSendIp && !isCustomIntegration)
                "
              ></v-checkbox>
            </div>
          </form-group>
          <form-group
            v-if="isVmrayOrVirusTotal"
            title="Cache"
            class-name="mt-4"
            style="max-width: max-content;"
          >
            <div class="campaign-manager-advanced-settings__other-settings-last">
              <v-checkbox
                v-model="formValues.isCachingEnabled"
                id="input--integration-caching"
                color="#2196f3"
                hide-details
              >
              </v-checkbox>
              <span>Enable caching and enter duration (hours)</span>
              <v-text-field
                :value="formValues.cacheDuration"
                v-mask="'###'"
                ref="refInputCacheDuration"
                id="input--integrations-cache-duration"
                outlined
                class="mx-2 absolute-text-input-error"
                style="max-width: 64px;"
                :disabled="!formValues.isCachingEnabled"
                :rules="formValues.isCachingEnabled ? numberValidation : []"
                @input="handleCacheDurationChange"
              ></v-text-field>
              <span>and query count</span>
              <v-text-field
                :value="formValues.cacheQueryCount"
                v-mask="'#######'"
                ref="refInputCacheQueryCount"
                id="input--integrations-cache-query-count"
                outlined
                class="ml-2 absolute-text-input-error"
                style="max-width: 64px;"
                :disabled="!formValues.isCachingEnabled"
                :rules="formValues.isCachingEnabled ? numberValidationQuery : []"
                @input="handleCacheQueryCountChange"
              ></v-text-field>
            </div>
          </form-group>
          <v-list-item class="px-0 mt-6 mb-6">
            <v-list-item-content>
              <v-list-item-title class="new-integration__label">
                Attachments
              </v-list-item-title>
              <v-list-item-subtitle class="new-integration__api-key__subtitle">
                Uploading originally attached files to integrated services may lead sensitive
                information to be compromised
              </v-list-item-subtitle>
              <v-checkbox
                v-model="formValues.isSendFileHash"
                id="input--integration-is-send-file-hash"
                style="margin-top: 10px;"
                color="#2196f3"
                label="Scan file hashes"
                :disabled="!selectedIntegrationType.isSendFileHash"
              ></v-checkbox>
              <div>
                <v-checkbox
                  v-model="formValues.isUploadExecutableFile"
                  id="input--integration-is-upload-executable-file"
                  label="Upload PE files"
                  color="#2196f3"
                  style="margin-top: 2px;"
                  :disabled="!selectedIntegrationType.isSendFile"
                ></v-checkbox>
                <div
                  class="new-integration__api-key__subtitle__upload-subtitle position-relative ml-8"
                  style="font-size: 14px; line-height: 1.5;"
                  :style="
                    !selectedIntegrationType.isSendFile && {
                      opacity: '0.5 !important'
                    }
                  "
                >
                  Portable executable files (exe, .dll, .sys, etc.)
                </div>
                <div>
                  <v-checkbox
                    v-model="formValues.isUploadOtherFileType"
                    id="input--integration-is-upload-other-file-type"
                    :label="`Upload other file types`"
                    color="#2196f3"
                    :disabled="!selectedIntegrationType.isSendFile"
                    @change="handleUploadOtherFileChange"
                  />
                </div>
                <div
                  class="new-integration__api-key__subtitle__upload-subtitle position-relative checkbox-tooltip"
                >
                  <div class="ml-8 mt-1">
                    <div class="d-flex align-center">
                      <span
                        class="mr-4 type-text"
                        :style="
                          (!selectedIntegrationType.isSendFile ||
                            !formValues.isUploadOtherFileType) && {
                            opacity: 0.6
                          }
                        "
                        >File Types</span
                      >
                      <k-select
                        v-model.trim="formValues.uploadFileTypes"
                        id="input--integration-upload-file-types"
                        class="new-integration__select"
                        dense
                        multiple
                        outlined
                        hide-details
                        placeholder="Select integration type"
                        required
                        style="margin-top: 2px;"
                        :items="uploadFileTypes"
                        :disabled="
                          !selectedIntegrationType.isSendFile || !formValues.isUploadOtherFileType
                        "
                      ></k-select>
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="px-0">
            <v-list-item-content class="pl-3">
              <v-list-item-title class="new-integration__label">
                Status
              </v-list-item-title>
              <v-list-item-subtitle class="new-integration__api-key__subtitle">
                Activate and deactivate integration
              </v-list-item-subtitle>
              <v-switch
                id="input--switch-integration-status"
                class="playbook-rule-form__switch mt-4"
                v-model="formValues.isActive"
                :label="formValues.isActive ? 'Active' : 'Inactive'"
                color="#2196f3"
              />
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <v-btn
          id="btn-cancel--integrations-modal"
          class="new-integration__footer-btn-cancel"
          rounded
          @click="closeOverlay"
        >
          {{ labels.Cancel }}
        </v-btn>
        <div class="new-integration__footer__right-col">
          <v-btn
            id="btn-save--integrations-modal"
            class="new-integration__footer-btn-save white--text"
            color="#2196f3"
            rounded
            @click="submit"
            :disabled="saveDisable"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import {
  createIntegration,
  getIntegrationDetails,
  testAnalysis,
  updateIntegration,
  getAnalysisEngineFormOptions
} from '@/api/integrations'
import { INTEGRATION_TYPES, INTEGRATION_LABELS } from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import AppDialog from '@/components/AppDialog'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputNumber from '@/components/Common/Inputs/InputNumber'
export default {
  name: 'NewIntegration',
  components: {
    AppDialog,
    KSelect,
    FormGroup,
    AppModal,
    AppModalBodyHeader,
    InputEntityName,
    InputDescription,
    InputNumber
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    integrationId: {
      type: String
    }
  },
  data() {
    return {
      showPasswords: [false],
      isRoksitTestingConnection: false,
      proxyTestStatusMessage: null,
      proxyTestLoadingStatus: 'initial',
      proxyLoading: false,
      proxyItems: [],
      defaultProxyItems: [],
      customIntegrationTestLoading: false,
      customIntegrationTestLoadingStatus: null,
      customIntegrationTestLoadingStatusMessage: null,
      spamHouseTestLoading: false,
      spamHouseTestLoadingStatus: null,
      spamHouseTestLoadingStatusMessage: null,
      saveDisable: false,
      showPassword: false,
      integrationTypeDisabled: false,
      errorMessageOfApiKey: '',
      isShowErrorMessage: false,
      labels,
      isFortiNetTestingConnection: false,
      loadingState: [],
      initialFormValues: null,
      formValues: {
        isCachingEnabled: false,
        userName: '',
        password: '',
        description: null,
        analysisEngineTypeResourceId: null,
        cacheDuration: 4,
        cacheQueryCount: 4,
        detectionThreshold: '1',
        tags: [],
        isActive: true,
        isSendUrl: false,
        isSendFileHash: false,
        isSendIp: false,
        isUploadExecutableFile: false,
        isUploadOtherFileType: false,
        apiKeys: [{ value: '', status: null, resourceId: null }],
        isHideUrlParameter: false,
        uploadFileTypes: [],
        name: null,
        apiUrl: null,
        apiKey: null,
        apiCreditionalResourceId: null,
        proxyResourceId: ''
      },
      selectedIntegrationType: {
        isSendUrl: false,
        isSendFileHash: false,
        isSendFile: false,
        isSendIp: false
      },
      isFortiNetConnected: false,
      isFortiNetConnectionSended: false,
      integrationTypes: [],
      uploadFileTypes: [],
      isTestConnectionDisabled: true,
      showConfirmModal: false,
      numberValidation: [
        (v) => Validations.required(v, 'Enter a number higher than 0'),
        (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
        (v) => v < 1000 || `${v} cannot exceed ${1000}`
      ],
      numberValidationQuery: [
        (v) => Validations.required(v, 'Enter a number higher than 0'),
        (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
        (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
      ],
      detectionThresholdRules: [
        (v) => Validations.required(v, 'Enter a number between 1 and 50'),
        (v) => Validations.numberRangeRule(v, 1, 50)
      ],
      nameValidation: {
        required: (v) => Validations.required(v),
        maxLength: (v) =>
          Validations.maxLength(v, 64, labels.getMaxLengthMessage('Integration name')),
        empty: (v) => Validations.startsWithSpace(v)
      },
      descriptionValidation: {
        maxLength: (v) =>
          Validations.maxLength(v, 300, labels.getMaxLengthMessage('Description', 300)),
        empty: (v) => Validations.startsWithSpace(v)
      },
      integrationTypeRules: {
        required: (v) => Validations.required(v),
        format: (v) => Validations.startsWithSpace(v)
      },
      apiUrlRules: {
        required: (v) => Validations.required(v),
        format: (v) => {
          return (
            /[(http(s)?):  \/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
              v
            ) || 'Invalid URL'
          )
        },
        maxLength: (v) => Validations.maxLength(v, 5000, labels.getMaxLengthMessage('URL', 5000))
      },
      apiKeyRules: {
        required: (v) => Validations.required(v),
        format: (v) => Validations.startsWithSpace(v),
        maxLength: (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage('Api key', 256))
      }
    }
  },
  computed: {
    isVirusTotal() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.VIRUSTOTAL
    },
    isFortiNet() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.FORTINET
    },
    isVmrayVirusTotalOrAnyRun() {
      return [
        INTEGRATION_TYPES.VIRUSTOTAL,
        INTEGRATION_TYPES.VMRAY,
        INTEGRATION_TYPES.ANYRUN
      ].includes(this.selectedIntegrationType.name)
    },
    isVmrayOrVirusTotal() {
      return [INTEGRATION_TYPES.VIRUSTOTAL, INTEGRATION_TYPES.VMRAY].includes(
        this.selectedIntegrationType.name
      )
    },
    isOPSWAT() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.OPSWAT
    },
    isGoogleWebRisk() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.GOOGLEWEBRISK
    },
    isIbmXForce() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE
    },
    isRoksit() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.ROKSIT
    },
    isCustomIntegration() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.CUSTOMINTEGRATION
    },
    isGoogleSafeBrowser() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.GOOGLESAFEBROWSER
    },
    isSpamHouse() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.SPAMHOUSE
    },
    isFortiNetConnectionDisabled() {
      const { userName, password, apiUrl } = this.formValues
      return !(userName && password && apiUrl)
    }
  },
  watch: {
    formValues(val) {
      this.selectedIntegrationType =
        this.integrationTypes.find(
          (item) => item.resourceId === val.analysisEngineTypeResourceId
        ) || {}
    }
  },
  created() {
    if (!this.integrationId) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    this.getFormOptions()
  },
  methods: {
    handleCacheDurationChange(val) {
      if (!val || /^\d{1,3}$/.test(val)) {
        this.formValues.cacheDuration = Number(val)
      } else {
        this.$refs.refInputCacheDuration.initialValue = Number(this.formValues.cacheDuration)
        this.$refs.refInputCacheDuration.lazyValue = Number(this.formValues.cacheDuration)
      }
    },
    handleCacheQueryCountChange(val) {
      if (!val || /^\d{1,7}$/.test(val)) {
        this.formValues.cacheQueryCount = Number(val)
      } else {
        this.$refs.refInputCacheQueryCount.initialValue = Number(this.formValues.cacheQueryCount)
        this.$refs.refInputCacheQueryCount.lazyValue = Number(this.formValues.cacheQueryCount)
      }
    },
    handleApiKeyDelete(index) {
      this.formValues.apiKeys.splice(index, 1)
      if (this.showPasswords.length && this.isIbmXForce) {
        this.showPasswords.splice(index, 1)
      }
    },
    handlePasswordToggle(index) {
      this.$set(this.showPasswords, index, !this.showPasswords[index])
    },
    getFormOptions() {
      this.proxyLoading = true
      const promises = []
      promises.push(getAnalysisEngineFormOptions())
      if (this.integrationId) promises.push(this.callForData(this.integrationId))
      Promise.all(promises).then((response) => {
        const { engineTypes, lookups, proxies } = response[0].data.data
        this.integrationTypes = engineTypes.data.map((item) => {
          return {
            ...item,
            userFriendlyName: this.getFriendlyName(item.name),
            name: item.name
          }
        })
        this.uploadFileTypes = lookups.data.map((item) => {
          if (item.name === 'Archive') {
            return { text: 'Archive files (.zip, .rar)', value: item.name }
          }
          if (item.name === 'Image') {
            return {
              text: 'Image files (.jpg, .png, .gif, .bmp)',
              value: item.name
            }
          }
          if (item.name === 'Microsoft Office') {
            return {
              text: 'Microsoft Office files (.doc, .docx, .xls, .xlsx, .ppt, .pptx, etc.)',
              value: item.name
            }
          }
          if (item.name === 'Other') {
            return { text: 'Other', value: item.name }
          }
          return { text: item.name, value: item.name }
        })
        this.addProxyItems(proxies.data.results, true)
        if (response[1]) this.updateModels(response[1])
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    },
    getProxyTestConnection() {
      if (this.proxyTestLoadingStatus === 'loading') return false
      this.proxyTestLoadingStatus = 'loading'
      const payload = {
        proxyResourceId: this.formValues.proxyResourceId,
        apiCredential: {
          proxyResourceId: this.formValues.proxyResourceId
        }
      }
      testAnalysis(this.formValues.proxyResourceId, payload)
        .then(() => {
          this.proxyTestLoadingStatus = 'success'
        })
        .catch((error) => {
          this.proxyTestLoadingStatus = 'failed'
          this.proxyTestStatusMessage = error.response.data.message || error.response.data.Message
        })
        .finally(() => {})
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    addProxyItems(proxyItems, isDefault) {
      proxyItems.unshift({
        name: 'Default proxy',
        resourceId: ''
      })
      proxyItems.unshift({
        name: 'No proxy',
        resourceId: '382e06ccbbde'
      })
      this.proxyItems = proxyItems
      if (isDefault) {
        this.defaultProxyItems = JSON.parse(JSON.stringify(proxyItems))
        if (!this.integrationId) {
          const item = proxyItems.find((item) => item.isDefault === 'Yes')
          this.formValues.proxyResourceId = item ? item.resourceId : ''
          if (!this.formValues.proxyResourceId) {
            this.formValues.proxyResourceId = ''
          }
        }
      }
    },
    getFriendlyName(name) {
      let label
      if (name === INTEGRATION_TYPES.FORTINET) {
        label = INTEGRATION_LABELS.FORTINET
      }
      if (name === INTEGRATION_TYPES.VIRUSTOTAL) {
        label = INTEGRATION_LABELS.VIRUSTOTAL
      }
      if (name === INTEGRATION_TYPES.VMRAY) {
        label = INTEGRATION_LABELS.VMRAY
      }
      if (name === INTEGRATION_TYPES.IBMXFORCE) {
        label = INTEGRATION_LABELS.IBMXFORCE
      }
      if (name === INTEGRATION_TYPES.SPAMHOUSE) {
        label = INTEGRATION_LABELS.SPAMHOUSE
      }
      if (name === INTEGRATION_TYPES.CUSTOMINTEGRATION) {
        label = INTEGRATION_LABELS.CUSTOMINTEGRATION
      }
      if (name === INTEGRATION_TYPES.GOOGLESAFEBROWSER) {
        label = INTEGRATION_LABELS.GOOGLESAFEBROWSER
      }
      if (name === INTEGRATION_TYPES.ROKSIT) {
        label = INTEGRATION_LABELS.CyberXRay
      }
      if (name === INTEGRATION_TYPES.GOOGLEWEBRISK) {
        label = INTEGRATION_TYPES.GOOGLEWEBRISK
      }
      return label
    },
    getErrorMessageOfApiKey(item) {
      const message = item?.errorMessage || 'Error'
      return `${message.substring(0, 75)}...`
    },
    isShowSeeMore(item) {
      const message = item.errorMessage || 'Error'
      return message.length > 75
    },
    showErrorMessage(item) {
      this.isShowErrorMessage = true
      this.errorMessageOfApiKey = item.errorMessage || 'Error'
    },
    handleUploadOtherFileChange(val = false) {
      if (!val) {
        this.formValues.uploadFileTypes = []
      }
    },
    handleSendUrlChange(val = false) {
      if (!val) {
        this.formValues.isHideUrlParameter = false
      }
    },
    saveIntegration() {
      let data = { ...this.formValues }
      if (!this.isVmrayOrVirusTotal) {
        delete data.isCachingEnabled
        delete data.cacheDuration
        delete data.cacheQueryCount
      }
      this.integrationTypeDisabled = true
      if (
        [
          INTEGRATION_TYPES.ANYRUN,
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER,
          INTEGRATION_TYPES.GOOGLEWEBRISK,
          INTEGRATION_TYPES.OPSWAT
        ].includes(this.selectedIntegrationType.name)
      ) {
        if (this.isVirusTotal) {
          data = {
            ...data,
            detectionThreshold:
              data.detectionThreshold === '' ? null : parseInt(data.detectionThreshold)
          }
        } else if (this.formValues.hasOwnProperty('detectionThreshold')) {
          delete data['detectionThreshold']
        }
        data.apiKeys = data.apiKeys.map((i) => i.value)
        data.apiCredentials = data.apiKeys.map((apiKey, index) => {
          const obj = {
            apiKey,
            resourceId: data.analysisEngineTypeResourceId,
            proxyResourceId: this.formValues.proxyResourceId
          }
          if (this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE) {
            obj['password'] = this.formValues.apiKeys[index]?.password
          }

          return obj
        })
      } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.FORTINET) {
        data.apiCredentials = [
          {
            userName: this.formValues.userName,
            password: this.formValues.password,
            resourceId: this.formValues.analysisEngineTypeResourceId,
            proxyResourceId: this.formValues.proxyResourceId
          }
        ]
      } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.CUSTOMINTEGRATION) {
        data.apiCredentials = [
          {
            apiKey: this.formValues.apiKey,
            password: this.formValues.password,
            resourceId: this.formValues.analysisEngineTypeResourceId,
            proxyResourceId: this.formValues.proxyResourceId
          }
        ]
      } else if (this.isRoksit) {
        data.apiCredentials = [
          {
            apiKey: this.formValues.apiKeys[0].value,
            resourceId: this.formValues.analysisEngineTypeResourceId,
            proxyResourceId: this.formValues.proxyResourceId
          }
        ]
      }

      delete data.apiKeys
      delete data.userName
      delete data.password
      if (this.integrationId) {
        updateIntegration(this.integrationId, data)
          .then(() => {
            this.saveDisable = false
            this.showConfirmModal = false
            this.$emit('closeOverlay', false, true)
          })
          .catch(() => {
            this.saveDisable = false
          })
          .finally(() => {
            this.integrationTypeDisabled = false
          })
      } else {
        createIntegration(data)
          .then(() => {
            this.showConfirmModal = false
            this.$emit('closeOverlay', false, true)
          })
          .finally(() => {
            this.saveDisable = false
            this.integrationTypeDisabled = false
          })
      }
    },
    testFortiNetConnection(callApi = false) {
      this.isFortiNetTestingConnection = true
      const payload = {
        apiUrl: this.formValues.apiUrl,
        proxyResourceId: this.formValues.proxyResourceId,
        apiCredential: {
          userName: this.formValues.userName,
          password: this.formValues.password,
          resourceId: this.formValues.resourceId
        }
      }
      testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
        .then(() => {
          if (callApi) {
            this.saveIntegration()
          }
          this.isFortiNetConnected = true
          this.saveDisable = false
        })
        .catch(() => {
          this.saveDisable = false
          this.isFortiNetConnected = false
        })
        .finally(() => {
          this.isFortiNetTestingConnection = false
          this.isFortiNetConnectionSended = true
        })
    },
    testRoksitConnection(isSave) {
      this.isRoksitTestingConnection = true
      this.formValues.apiKeys[0].status = 'loading'
      this.loadingState.push('loading')
      testAnalysis(this.formValues.analysisEngineTypeResourceId, {
        apiUrl: this.formValues.apiUrl,
        proxyResourceId: this.formValues.proxyResourceId,
        apiCredential: {
          apiKey: this.formValues.apiKeys[0].value,
          resourceId: this.formValues.apiKeys[0].resourceId
        }
      })
        .then((response) => {
          if (response.data.status === 'FAILED') {
            this.formValues.apiKeys[0].status = 'failed'
            this.formValues.apiKeys[0].errorMessage = response.data.message
          } else {
            if (isSave) this.saveIntegration()
            this.formValues.apiKeys[0].status = 'success'
          }
        })
        .catch(() => {
          this.formValues.apiKeys[0].status = 'failed'
        })
        .finally(() => {
          this.isRoksitTestingConnection = false
          this.loadingState.shift()
        })
    },
    handleTagItemChange(value) {
      value[value.length - 1] = value[value.length - 1]
        ? value[value.length - 1].substring(0, 20)
        : ''
    },
    submit() {
      const refForm = this.$refs.form
      const isValidForm = refForm.validate()
      if (isValidForm) {
        this.saveDisable = true
        this.testConnection(true)
      } else {
        return this.$nextTick(() => {
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeOverlay', false, true)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          return this.$emit('closeOverlay', false, true)
        }
      })
    },
    getTestConnectionDisableStatus() {
      if (
        [
          INTEGRATION_TYPES.ANYRUN,
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER,
          INTEGRATION_TYPES.GOOGLEWEBRISK,
          INTEGRATION_TYPES.OPSWAT
        ].includes(this.selectedIntegrationType.name) &&
        this.formValues.apiUrl &&
        this.formValues.apiKeys[0] &&
        this.formValues.apiKeys[0].value &&
        this.formValues.apiKeys[0].value.length > 0 &&
        typeof this.apiUrlRules.format(this.formValues.apiUrl) !== 'string'
      ) {
        return false
      } else {
        if (
          this.selectedIntegrationType.name === INTEGRATION_TYPES.CUSTOMINTEGRATION ||
          this.selectedIntegrationType.name === INTEGRATION_TYPES.SPAMHOUSE
        ) {
          return !(
            this.formValues.apiUrl.length > 0 &&
            typeof this.apiUrlRules.format(this.formValues.apiUrl) !== 'string'
          )
        } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.ROKSIT) {
          return !(
            this.formValues.apiKeys[0] &&
            this.formValues.apiKeys[0].value &&
            this.formValues.apiKeys[0].value.length
          )
        }
        return true
      }
    },
    saveButtonClickOnConfirmModal() {
      this.showConfirmModal = false
    },
    addApiKey() {
      this.isTestConnectionDisabled = true
      this.formValues.apiKeys.push({
        value: '',
        status: null,
        resourceId: null
      })
    },
    handleApiKeyChange() {
      if (!this.formValues.apiUrl) return true
      if (!!this.formValues.apiKeys) {
        this.formValues.apiKeys.map((item) => {
          this.isTestConnectionDisabled = false
          if (!item.value.length) {
            this.isTestConnectionDisabled = true
            return true
          }
        })
      }
    },
    cancelClickOnConfirmModal() {
      this.formValues.uploadFileTypes = []
      this.formValues.isUploadOtherFileType = false
      this.showConfirmModal = false
    },
    callForData(id) {
      return getIntegrationDetails(id)
    },
    updateModels(response = {}) {
      this.selectedIntegrationType =
        this.integrationTypes.find(
          (item) => item.resourceId === response['data'].data.analysisEngineTypeResourceId
        ) || {}
      if (
        [
          INTEGRATION_TYPES.ANYRUN,
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER,
          INTEGRATION_TYPES.SPAMHOUSE,
          INTEGRATION_TYPES.ROKSIT,
          INTEGRATION_TYPES.GOOGLEWEBRISK,
          INTEGRATION_TYPES.OPSWAT
        ].includes(this.selectedIntegrationType.name)
      ) {
        response['data'].data.apiKeys = response['data'].data['apiCredentials'].map((item) => {
          const obj = {
            value: item.apiKey,
            status: null,
            resourceId: item.resourceId,
            proxyResourceId: item.proxyResourceId
          }
          if (this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE) {
            obj.password = item?.password
          }
          return obj
        })

        response['data'].data.apiKeys = response['data'].data.apiKeys.length
          ? response['data'].data.apiKeys
          : [{ value: '', status: null, resourceId: null }]
        if (this.selectedIntegrationType.name === INTEGRATION_TYPES.VIRUSTOTAL) {
          if (!!response?.data?.data?.detectionThreshold?.toString()) {
            response.data.data.detectionThreshold = response?.data?.data?.detectionThreshold?.toString()
          } else {
            response.data.data.detectionThreshold = '1'
          }
        }
        if (this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE) {
          response.data.data.password = response['data'].data['apiCredentials'].length
            ? response['data'].data['apiCredentials'][0].password
            : ''
        }
      } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.FORTINET) {
        const { userName, password, resourceId, proxyResourceId } = response['data'].data[
          'apiCredentials'
        ][0]
        response.data.data.userName = userName
        response.data.data.password = password
        response.data.data.resourceId = resourceId
        response.data.data.proxyResourceId = proxyResourceId
      } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.CUSTOMINTEGRATION) {
        const { apiKey, password, resourceId, proxyResourceId } = response['data'].data[
          'apiCredentials'
        ][0]
        response.data.data.apiKey = apiKey
        response.data.data.password = password
        response.data.data.resourceId = resourceId
        response.data.data.apiCreditionalResourceId = resourceId
        response.data.data.proxyResourceId = proxyResourceId
      }
      delete response['data'].data['apiCredentials']
      this.formValues = response['data'].data
      if (!this.formValues.proxyResourceId && !this.integrationId) {
        this.formValues.proxyResourceId = this.defaultProxyItems.find(
          (item) => item.isDefault === 'Yes'
        )?.resourceId
      }
    },
    resetValues() {
      this.formValues = {
        description: null,
        analysisEngineTypeResourceId: null,
        tags: null,
        isActive: true,
        isSendUrl: false,
        isSendFileHash: true,
        isUploadExecutableFile: true,
        isUploadOtherFileType: false,
        apiKeys: [{ value: '', status: null, resourceId: null }],
        isHideUrlParameter: false,
        uploadFileTypes: [],
        name: null,
        apiUrl: null
      }
    },
    retryTestConnection(item) {
      if (!item) return
      item.status = 'loading'
      this.loadingState.push('loading')
      const payload = {
        apiUrl: this.formValues.apiUrl,
        apiCredential: {
          apiKey: item.value
        }
      }
      if (this.isIbmXForce) {
        payload['apiCredential']['password'] = item.password
      }
      testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
        .then((response) => {
          item.status = response.data.status === 'FAILED' ? 'failed' : 'success'
        })
        .catch((error) => {
          item.status = 'failed'
          if (error?.response?.data?.Message === 'Internal server error') {
            item.errorMessage = 'Error when testing connections!'
          } else {
            item.errorMessage = error.response.data.message || error.response.data.Message
          }
        })
        .finally(() => this.loadingState.shift())
    },
    testConnection(isSave) {
      if (
        [
          INTEGRATION_TYPES.ANYRUN,
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER,
          INTEGRATION_TYPES.GOOGLEWEBRISK,
          INTEGRATION_TYPES.OPSWAT
        ].includes(this.selectedIntegrationType.name)
      ) {
        for (const item of this.formValues.apiKeys) {
          item.status = 'loading'
          this.loadingState.push('loading')
          let payload = {
            apiUrl: this.formValues.apiUrl,
            proxyResourceId: this.formValues.proxyResourceId,
            apiCredential: {
              apiKey: item.value,
              resourceId: item.resourceId
            }
          }
          if (this.isVirusTotal) {
            payload = {
              ...payload,
              detectionThreshold:
                this.formValues.detectionThreshold === ''
                  ? null
                  : parseInt(this.formValues.detectionThreshold)
            }
          } else if (this.formValues.hasOwnProperty('detectionThreshold')) {
            delete payload['detectionThreshold']
          }
          if (this.isIbmXForce) payload['apiCredential']['password'] = item.password
          testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
            .then((response) => {
              if (response.data.status === 'FAILED') {
                item.status = 'failed'
                item.errorMessage = response.data.message
              } else item.status = 'success'
              this.saveDisable = false
            })
            .catch((error) => {
              this.saveDisable = false
              item.status = 'failed'
              if (error?.response?.data?.Message === 'Internal server error') {
                item.errorMessage = 'Error when testing connections!'
              } else {
                item.errorMessage = error.response.data.message || error.response.data.Message
              }
            })
            .finally(() => {
              this.loadingState.shift()
              if (
                isSave &&
                !this.loadingState.length &&
                !this.formValues.apiKeys.find((item) => item.status === 'failed')
              )
                this.saveIntegration()
            })
        }
      } else if (this.selectedIntegrationType.name === INTEGRATION_TYPES.FORTINET) {
        this.testFortiNetConnection(true)
      } else if (this.isRoksit) {
        this.testRoksitConnection(isSave)
      } else if (this.isCustomIntegration) {
        let payload = {
          apiUrl: this.formValues.apiUrl,
          proxyResourceId: this.formValues.proxyResourceId,
          apiCredential: {
            apiKey: this.formValues.apiKey,
            resourceId: this.formValues.apiCreditionalResourceId,
            password: this.formValues.password
          }
        }
        this.customIntegrationTestLoading = true
        this.customIntegrationTestLoadingStatus = 'loading'
        this.loadingState.push('loading')
        this.customIntegrationTestLoadingStatusMessage = null
        testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
          .then(() => {
            this.saveDisable = false
            this.customIntegrationTestLoadingStatus = 'success'
          })
          .catch((error) => {
            this.saveDisable = false
            this.customIntegrationTestLoadingStatus = 'failed'
            this.customIntegrationTestLoadingStatusMessage =
              error.response.data.message || error.response.data.Message
          })
          .finally(() => {
            this.loadingState.shift()
            if (isSave && !this.loadingState.length) this.saveIntegration()
            this.customIntegrationTestLoading = false
          })
      } else if (this.isSpamHouse) {
        let payload = {
          apiUrl: this.formValues.apiUrl,
          proxyResourceId: this.formValues.proxyResourceId,
          apiCredential: {
            apiUrl: this.formValues.apiUrl,
            resourceId: this.formValues.apiCreditionalResourceId
          }
        }
        this.spamHouseTestLoading = true
        this.spamHouseTestLoadingStatus = 'loading'
        this.loadingState.push('loading')
        this.spamHouseTestLoadingStatusMessage = null
        testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
          .then(() => {
            this.saveDisable = false
            this.spamHouseTestLoadingStatus = 'success'
          })
          .catch((error) => {
            this.saveDisable = false
            this.spamHouseTestLoadingStatus = 'failed'
            this.spamHouseTestLoadingStatusMessage =
              error.response.data.message || error.response.data.Message
          })
          .finally(() => {
            this.loadingState.shift()
            if (isSave && !this.loadingState.length) this.saveIntegration()
            this.spamHouseTestLoading = false
          })
      }
    },
    resetApiKeysAndCredentials() {
      if (!this.formValues.apiKeys) {
        this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
      }
      this.formValues.userName = ''
      this.formValues.password = ''
    },
    handleIntegrationTypeChange(val) {
      this.selectedIntegrationType = this.integrationTypes.find((item) => item.resourceId === val)
      const {
        name,
        isSendFile,
        isSendFileHash,
        isSendUrl,
        isSendIp,
        isHideUrlParameter
      } = this.selectedIntegrationType

      this.formValues.isSendUrl = isSendUrl
      this.formValues.isHideUrlParameter = isHideUrlParameter
      this.formValues.isSendFileHash = isSendFileHash
      this.formValues.isSendFile = isSendFile
      this.formValues.isSendIp = isSendIp

      if (!isSendFile) {
        this.formValues.isUploadExecutableFile = false
        this.formValues.isUploadOtherFileType = false
        this.formValues.uploadFileTypes = []
      }

      if (name === INTEGRATION_TYPES.VIRUSTOTAL) {
        this.formValues.apiUrl = 'https://www.virustotal.com/api/v3'
        this.resetApiKeysAndCredentials()
      } else if (name === INTEGRATION_TYPES.GOOGLEWEBRISK) {
        this.formValues.apiUrl = 'https://webrisk.googleapis.com/v1'
        this.resetApiKeysAndCredentials()
      } else if (name === INTEGRATION_TYPES.ROKSIT) {
        this.formValues.apiUrl = 'https://reputation.roksit.com/api/query/'
      } else if (name === INTEGRATION_TYPES.VMRAY) {
        this.formValues.apiUrl = 'https://cloud.vmray.com'
        this.resetApiKeysAndCredentials()
      } else if (name === INTEGRATION_TYPES.ANYRUN) {
        this.formValues.apiUrl = 'https://api.any.run/v1/analysis'
        this.resetApiKeysAndCredentials()
      } else if (name === INTEGRATION_TYPES.IBMXFORCE) {
        if (this.formValues) {
          this.formValues.apiUrl = 'https://exchange.xforce.ibmcloud.com'
          this.formValues.userName = ''
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
      } else if (name === INTEGRATION_TYPES.CUSTOMINTEGRATION) {
        if (this.formValues) {
          this.formValues.apiUrl = window.location.origin
          this.formValues.apiKey = ''
          this.formValues.password = ''
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
      } else if (name === INTEGRATION_TYPES.GOOGLESAFEBROWSER) {
        this.formValues.apiUrl = 'https://safebrowsing.googleapis.com'
      } else if (name === INTEGRATION_TYPES.SPAMHOUSE) {
        this.formValues.apiUrl = 'zen.spamhaus.org'
      } else if (name === INTEGRATION_TYPES.OPSWAT) {
        this.formValues.apiUrl = 'https://api.metadefender.com/v4/'
      } else if (this.formValues) {
        this.formValues.apiUrl = ''
      }
    }
  }
}
</script>
