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
            <v-text-field
              id="input--integration-name"
              v-model.trim="formValues.name"
              :rules="[nameValidation.required, nameValidation.empty, nameValidation.maxLength]"
              dense
              hint="*Required"
              persistent-hint
              outlined
              placeholder="Enter Name"
              required
            ></v-text-field>
          </form-group>
          <form-group title="Description">
            <v-textarea
              id="input--integration-description"
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.description"
              :rules="[descriptionValidation.empty, descriptionValidation.maxLength]"
              dense
              outlined
              placeholder="Enter description"
            ></v-textarea>
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
              isVmrayOrVirusTotal ||
              isIbmXForce ||
              isGoogleSafeBrowser ||
              isCustomIntegration ||
              isRoksit
            "
          >
            <v-list-item-content>
              <v-list-item-title class="new-integration__label" v-if="!isCustomIntegration">
                API Key
              </v-list-item-title>
              <v-list-item-subtitle
                class="new-integration__api-key__subtitle"
                v-if="!isCustomIntegration"
              >
                Enter API Key generated by the provider
              </v-list-item-subtitle>
              <div
                v-for="(item, index) in formValues.apiKeys"
                :key="item.status"
                :id="`integration-api-key-container-${index}`"
                class="position-relative new-integration__api-keys"
                v-if="!isCustomIntegration"
              >
                <div class="max-width__form">
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
                  <div
                    v-if="item.status === 'failed' && item.value.length > 0"
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
                  <div v-if="!!item.status" class="new-integration__api-keys__connection-status">
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
                    :style="{ right: item.status ? '-100px' : '-40px' }"
                    class="new-integration__api-keys__delete"
                  >
                    <v-icon
                      v-if="formValues.apiKeys.length > 1"
                      class="ml-2"
                      left
                      medium
                      @click="formValues.apiKeys.splice(index, 1)"
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
                  (isIbmXForce || isCustomIntegration || isRoksit) && { justifyContent: 'flex-end' }
                ]"
              >
                <div
                  v-if="!isIbmXForce && !isCustomIntegration && !isRoksit"
                  id="integration-api-key-footer-add-api-key"
                  class="new-integration__api-key__footer-left-side"
                  @click="addApiKey"
                >
                  <v-icon color="#2196f3" style="cursor: pointer !important;">mdi-plus</v-icon>
                  <div class="ml-2 new-integration__api-key__text">ADD API KEY</div>
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
          <form-group title="Password" has-hint v-if="isFortiNet || isIbmXForce">
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
                  style="cursor: default !important; font-size: '2px';"
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
          <v-list-item :class="['px-0', { 'mt-3': isVmrayOrVirusTotal }]">
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
                  no-data-text="No proxy displayed"
                  :search-input.sync="search"
                  class="company-groups-select-company mt-2"
                  autocomplete="off"
                  item-value="resourceId"
                  item-text="name"
                  outlined
                  persistent-hint
                  placeholder="Select proxy"
                  @click="() => (proxyItems = defaultProxyItems)"
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
              <label class="new-integration__label">URLs</label>
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
                  class="black--text"
                  color="#2196f3"
                  :label="`Hide URL Parameters`"
                  :disabled="!formValues.isSendUrl || !selectedIntegrationType.isSendUrl"
                ></v-checkbox>
                <v-tooltip bottom opacity="1">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-icon v-on="{ ...tooltip }">mdi-help-circle</v-icon>
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
                :disabled="!selectedIntegrationType.isSendIp && !isCustomIntegration"
              ></v-checkbox>
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
                  :style="!selectedIntegrationType.isSendFile && { opacity: '0.5 !important' }"
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
                            !formValues.isUploadOtherFileType) && { opacity: 0.6 }
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
          @click="$emit('closeOverlay', false, false)"
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
  getProxyItems,
  getAnalysisEngineFormOptions
} from '@/api/integrations'
import { INTEGRATION_TYPES, INTEGRATION_LABELS } from '@/model/constants/commonConstants'
import AppModal from '../AppModal'
import { scrollToComponent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'NewIntegration',
  components: {
    AppDialog,
    KSelect,
    FormGroup,
    AppModal,
    AppModalBodyHeader
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
      isRoksitTestingConnection: false,
      proxyTestStatusMessage: null,
      proxyTestLoadingStatus: 'initial',
      proxyLoading: false,
      proxyItems: [],
      defaultProxyItems: [],
      search: null,
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
      formValues: {
        userName: '',
        password: '',
        description: null,
        analysisEngineTypeResourceId: null,
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
        proxyResourceId: null
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
          const isValid =
            /[(http(s)?):  \/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
              v
            ) || 'Invalid URL'
          return isValid
        },
        maxLength: (v) => Validations.maxLength(v, 1000, labels.getMaxLengthMessage('URL', 1000))
      },
      apiKeyRules: {
        required: (v) => Validations.required(v),
        format: (v) => Validations.startsWithSpace(v),
        maxLength: (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage('Api key', 256))
      },
      proxyBodyData: {
        pageNumber: 1,
        pageSize: 100,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'IsDefault',
                  Operator: 'Include',
                  Value: ''
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                {
                  FieldName: 'Name',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'Address',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'Port',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'AuthenticationType',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'CreateTime',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'IsDefault',
                  Operator: 'Contains',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  computed: {
    isFortiNet() {
      return this.selectedIntegrationType.name === INTEGRATION_TYPES.FORTINET
    },
    isVmrayOrVirusTotal() {
      return [INTEGRATION_TYPES.VIRUSTOTAL, INTEGRATION_TYPES.VMRAY].includes(
        this.selectedIntegrationType.name
      )
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
  created() {
    this.getFormOptions()
  },
  methods: {
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
            name: item.name === INTEGRATION_TYPES.ROKSIT ? INTEGRATION_LABELS.CyberXRay : item.name
          }
        })
        this.uploadFileTypes = lookups.data.map((item) => {
          switch (item.name) {
            case 'Archive':
              return { text: 'Archive files (.zip, .rar)', value: item.name }
            case 'Image':
              return { text: 'Image files (.jpg, .png, .gif, .bmp)', value: item.name }
            case 'Microsoft Office':
              return {
                text: 'Microsoft Office files (.doc, .docx, .xls, .xlsx, .ppt, .pptx, etc.)',
                value: item.name
              }
            case 'Other':
              return { text: 'Other', value: item.name }
            default:
              return { text: item.name, value: item.name }
          }
        })
        this.addProxyItems(proxies.data.results, true)
        if (response[1]) this.updateModels(response[1])
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
    getProxyItems(searchValue = '', isDefault) {
      this.debounce(() => {
        if (!isDefault) this.proxyLoading = true
        this.proxyBodyData.filter.FilterGroups[1].FilterItems[0].Value = searchValue
        getProxyItems(this.proxyBodyData)
          .then((response) => {
            let proxyItems = response.data.data.results
            this.addProxyItems(proxyItems, isDefault)
          })
          .finally(() => {
            if (!isDefault) {
              this.proxyLoading = false
            }
          })
      }, 500)
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
      switch (name) {
        case INTEGRATION_TYPES.FORTINET:
          label = INTEGRATION_LABELS.FORTINET
          break
        case INTEGRATION_TYPES.VIRUSTOTAL:
          label = INTEGRATION_LABELS.VIRUSTOTAL
          break
        case INTEGRATION_TYPES.VMRAY:
          label = INTEGRATION_LABELS.VMRAY
          break
        case INTEGRATION_TYPES.IBMXFORCE:
          label = INTEGRATION_LABELS.IBMXFORCE
          break
        case INTEGRATION_TYPES.SPAMHOUSE:
          label = INTEGRATION_LABELS.SPAMHOUSE
          break
        case INTEGRATION_TYPES.CUSTOMINTEGRATION:
          label = INTEGRATION_LABELS.CUSTOMINTEGRATION
          break
        case INTEGRATION_TYPES.GOOGLESAFEBROWSER:
          label = INTEGRATION_LABELS.GOOGLESAFEBROWSER
          break
        case INTEGRATION_TYPES.ROKSIT:
          label = INTEGRATION_LABELS.CyberXRay
          break
        default:
          return
      }
      return label
    },
    getErrorMessageOfApiKey(item) {
      const message = item.errorMessage || 'Error'
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
      const data = { ...this.formValues }
      this.integrationTypeDisabled = true
      if (
        [
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER
        ].includes(this.selectedIntegrationType.name)
      ) {
        data.apiKeys = data.apiKeys.map((i) => i.value)
        data.apiCredentials = data.apiKeys.map((i) => {
          const obj = {
            apiKey: i,
            resourceId: data.analysisEngineTypeResourceId,
            proxyResourceId: this.formValues.proxyResourceId
          }
          if (this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE) {
            obj['password'] = this.formValues.password
          }

          return obj
        })
      } else if (this.selectedIntegrationType.name === 'FortiNet') {
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
            this.closeOverlay()
            this.showConfirmModal = false
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
            this.closeOverlay()
            this.showConfirmModal = false
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
          this.loadingState.shift('loading')
        })
    },
    handleTagItemChange(value) {
      value[value.length - 1] = value[value.length - 1].substring(0, 20)
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
      this.$emit('closeOverlay', false, true)
    },
    getTestConnectionDisableStatus() {
      if (
        [
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER
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
          if (
            this.formValues.apiUrl.length > 0 &&
            typeof this.apiUrlRules.format(this.formValues.apiUrl) !== 'string'
          ) {
            return false
          }
          return true
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
      this.formValues.apiKeys.push({ value: '', status: null, resourceId: null })
    },
    handleApiKeyChange() {
      if (!this.formValues.apiUrl) return true
      this.formValues.apiKeys.map((item) => {
        this.isTestConnectionDisabled = false
        if (!item.value.length) {
          this.isTestConnectionDisabled = true
          return true
        }
      })
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
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER,
          INTEGRATION_TYPES.SPAMHOUSE,
          INTEGRATION_TYPES.ROKSIT
        ].includes(this.selectedIntegrationType.name)
      ) {
        response['data'].data.apiKeys = response['data'].data['apiCredentials'].map((item) => {
          return {
            value: item.apiKey,
            status: null,
            resourceId: item.resourceId,
            proxyResourceId: item.proxyResourceId
          }
        })

        response['data'].data.apiKeys = response['data'].data.apiKeys.length
          ? response['data'].data.apiKeys
          : [{ value: '', status: null, resourceId: null }]

        if (this.selectedIntegrationType.name === INTEGRATION_TYPES.IBMXFORCE) {
          response.data.data.password = response['data'].data['apiCredentials'].length
            ? response['data'].data['apiCredentials'][0].password
            : ''
          response.data.data.proxyResourceId = response['data'].data.proxyResourceId
        }
      } else if (this.selectedIntegrationType.name === 'FortiNet') {
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
      if (!this.formValues.proxyResourceId) {
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
      item.status = 'loading'
      this.loadingState.push('loading')
      const payload = {
        apiUrl: this.formValues.apiUrl,
        apiCredential: {
          apiKey: item.value
        }
      }
      if (this.isIbmXForce) {
        payload['apiCredential']['password'] = this.formValues.password
      }
      testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
        .then((response) => {
          if (response.data.status === 'FAILED') {
            item.status = 'failed'
            this.formValues.apiKeys[i].errorMessage = response.data.message
          } else {
            item.status = 'success'
          }
          item.status = 'success'
        })
        .catch((error) => {
          item.status = 'failed'
          if (error.response.data.Message === 'Internal server error') {
            item.errorMessage = 'Error when testing connections!'
          } else {
            item.errorMessage = error.response.data.message || error.response.data.Message
          }
        })
        .finally(() => this.loadingState.shift('loading'))
    },
    testConnection(isSave) {
      if (
        [
          INTEGRATION_TYPES.VIRUSTOTAL,
          INTEGRATION_TYPES.VMRAY,
          INTEGRATION_TYPES.IBMXFORCE,
          INTEGRATION_TYPES.GOOGLESAFEBROWSER
        ].includes(this.selectedIntegrationType.name)
      ) {
        for (let i = 0; i < this.formValues.apiKeys.length; i++) {
          const item = this.formValues.apiKeys[i]
          this.formValues.apiKeys[i].status = 'loading'
          this.loadingState.push('loading')
          let payload = {
            apiUrl: this.formValues.apiUrl,
            proxyResourceId: this.formValues.proxyResourceId,
            apiCredential: {
              apiKey: item.value,
              resourceId: item.resourceId
            }
          }
          if (this.isIbmXForce) {
            payload['apiCredential']['password'] = this.formValues.password
          }
          testAnalysis(this.formValues.analysisEngineTypeResourceId, payload)
            .then((response) => {
              if (response.data.status === 'FAILED') {
                this.formValues.apiKeys[i].status = 'failed'
                this.formValues.apiKeys[i].errorMessage = response.data.message
              } else {
                this.formValues.apiKeys[i].status = 'success'
              }
              this.saveDisable = false
            })
            .catch((error) => {
              this.saveDisable = false
              this.formValues.apiKeys[i].status = 'failed'
              if (error.response.data.Message === 'Internal server error') {
                this.formValues.apiKeys[i].errorMessage = 'Error when testing connections!'
              } else {
                this.formValues.apiKeys[i].errorMessage =
                  error.response.data.message || error.response.data.Message
              }
            })
            .finally(() => {
              this.loadingState.shift('loading')
              if (
                isSave &&
                !this.loadingState.length &&
                !this.formValues.apiKeys.find((item) => item.status === 'failed')
              )
                this.saveIntegration()
            })
        }
      } else if (this.selectedIntegrationType.name === 'FortiNet') {
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
          .then((response) => {
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
            this.loadingState.shift('loading')
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
          .then((response) => {
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
            this.loadingState.shift('loading')
            if (isSave && !this.loadingState.length) this.saveIntegration()
            this.spamHouseTestLoading = false
          })
      }
    },
    handleIntegrationTypeChange(val) {
      this.selectedIntegrationType = this.integrationTypes.find((item) => item.resourceId === val)
      const { name, isSendFile, isSendFileHash, isSendUrl } = this.selectedIntegrationType

      this.formValues.isSendUrl = isSendUrl
      this.formValues.isSendFileHash = isSendFileHash
      this.formValues.isSendFile = isSendFile

      if (!isSendFile) {
        this.formValues.isUploadExecutableFile = false
        this.formValues.isUploadOtherFileType = false
        this.formValues.uploadFileTypes = []
      }

      if (name === INTEGRATION_TYPES.VIRUSTOTAL) {
        this.formValues.apiUrl = 'https://www.virustotal.com/vtapi/v2'
        if (!this.formValues.apiKeys) {
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
        this.formValues.userName = ''
        this.formValues.password = ''
      } else if (name === INTEGRATION_TYPES.ROKSIT) {
        this.formValues.apiUrl = 'https://reputation.roksit.com/api/query/'
      } else if (name === INTEGRATION_TYPES.VMRAY) {
        if (this.formValues) {
          this.formValues.apiUrl = 'https://cloud.vmray.com'
        }
        if (!this.formValues.apiKeys) {
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
        this.formValues.userName = ''
        this.formValues.password = ''
      } else if (name === INTEGRATION_TYPES.IBMXFORCE) {
        if (this.formValues) {
          this.formValues.apiUrl = 'https://exchange.xforce.ibmcloud.com'
          this.formValues.userName = ''
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
      } else if (name === INTEGRATION_TYPES.CUSTOMINTEGRATION) {
        if (this.formValues) {
          this.formValues.apiUrl = 'https://dev-api.devkeepnet.com'
          this.formValues.apiKey = ''
          this.formValues.password = ''
          this.$set(this.formValues, 'apiKeys', [{ value: '', status: null, resourceId: null }])
        }
      } else if (name === INTEGRATION_TYPES.GOOGLESAFEBROWSER) {
        this.formValues.apiUrl = 'https://safebrowsing.googleapis.com'
      } else if (name === INTEGRATION_TYPES.SPAMHOUSE) {
        this.formValues.apiUrl = 'zen.spamhaus.org'
      } else {
        if (this.formValues) {
          this.formValues.apiUrl = ''
        }
      }
    }
  },
  destroyed() {},
  watch: {
    formValues(val) {
      this.selectedIntegrationType =
        this.integrationTypes.find(
          (item) => item.resourceId === val.analysisEngineTypeResourceId
        ) || {}
    },
    search(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getProxyItems(newVal)
      }
    }
  }
}
</script>

<style lang="scss">
.loading-spin {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.position-relative {
  position: relative;
}

.max-width__form {
  position: relative;
  max-width: 554px !important;
}

.new-integration {
  .p-relative {
    position: relative;
  }
  .client-secret {
    .k-form-group__content {
      margin-bottom: 0 !important;
    }
  }
  .menuable__content__active.k-select__menu {
    z-index: 99999999 !important;
  }
  .edit-select {
    .v-input__append-inner {
      display: none;
    }
  }
  &__select {
    .v-menu__content {
      z-index: 900000 !important;
    }
  }
  .v-list-item {
    //margin-bottom: 1px;
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }

  .new-integration__api-key__textfield {
    .v-text-field__details {
      margin-bottom: 0;
    }
  }

  .connection-error-state {
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    background: white;
    color: #ff5252 !important;

    position: absolute;
    top: 42px;
    left: 13px;

    &__border {
      fieldset {
        border-color: #d0021b;
      }
    }
  }

  .test-connection {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #00bcd4;
  }

  .retry-button {
    color: #f56c6c;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }

  &__container {
    padding: 24px 0 0 96px !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  &__api-keys {
    &:hover {
      .new-integration__api-keys__delete {
        display: flex;
      }
    }

    &__connection-status {
      width: 44px;
      height: 40px;
      color: #757575;
      position: absolute;
      right: -50px;
      top: 6px;
      justify-content: center;
    }

    &__delete {
      width: 44px;
      height: 40px;
      color: #757575;
      position: absolute;
      right: -40px;
      top: -2px;
      justify-content: center;
      display: none;
    }
  }

  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      background-color: white;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      padding-bottom: 68px !important;
    }
  }

  &__title {
    font-family: 'Open Sans', sans-serif !important;
    opacity: 0.9;
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29 !important;
    margin-top: 31px !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__subtitle {
    opacity: 0.9;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  &__select {
    max-width: 554px !important;
  }

  &__textfield {
    max-width: 554px !important;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 86px;
      height: 36px !important;
    }

    &-btn-save {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: #2196f3;
    }
  }

  &__api-key {
    &__subtitle {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5 !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;

      &__upload-subtitle {
        margin-left: 30px;
      }
    }

    &__combobox {
      .v-chip {
        margin: 4px !important;
      }
    }

    &__textfield {
      ::v-deep .v-text-field__details {
        display: none !important;
      }
    }

    &__footer {
      display: flex;
      max-width: 554px !important;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      margin-bottom: 12px;

      &-left-side {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    &__text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
      cursor: pointer;
    }

    &__test-text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #757575 !important;
      opacity: 0.8;
    }

    &__disabled-text {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #757575 !important;
      opacity: 0.8;
      pointer-events: none !important;
    }
  }

  &.v-card {
    padding: 24px 0 0 96px !important;
  }

  .v-input--switch {
    .v-label {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .type-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .v-list-item__content {
    padding: 0 !important;
  }

  .v-input--checkbox {
    .v-messages {
      display: none;
    }
  }

  .checkbox-tooltip {
    .mdi-help-circle {
      position: absolute;
      top: 3px;
      left: 180px;
    }
  }
}

.new-integration__confirm-modal {
  .v-overlay__scrim {
    opacity: 0 !important;
    background-color: white !important;
  }

  &__header {
    padding: 32px 24px;
    font-size: 20px;
    font-weight: 600;

    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3;
  }

  &__content {
    font-size: 13px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
    padding: 8px 24px;
  }

  &__footer {
    padding: 16px 24px;
    text-align: right;
  }

  &__btn-continue {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
  }

  &__btn-cancel {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #f56c6c;
  }
}
.integration-error-message-popup {
  .k-dialog__header {
    padding: 12px 24px !important;
    .v-cart-icon-wrapper {
      display: none;
    }
  }

  .k-dialog__title {
    color: #f56c6c !important;
  }
}
</style>
