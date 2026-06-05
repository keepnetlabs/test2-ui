<template>
  <div class="input-phishing-link-mini-wrapper">
    <div class="input-phishing-link-mini">
      <div class="input-phishing-link-mini__inputs">
        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Protocol"
            :value="value.urlSchemaTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select URL schema"
            :menu-props="{ offsetY: true }"
            :items="getUrlSchemaTypesModified"
            @change="handleInputChange($event, 'urlSchemaTypeId')"
          ></KSelect>
        </div>

        <div class="input-phishing-link-mini__input-group">
          <VTextField
            label="Subdomain"
            :value="value.subDomain"
            ref="refSubdomain"
            required
            placeholder="subdomain"
            outlined
            dense
            persistent-hint
            hide-details
            :rules="subdomainRules"
            @input="handleInputChange($event, 'subDomain')"
          />
        </div>

        <div class="input-phishing-link-mini__input-group">
          <KSelect
            label="Domain"
            class="domain-suggest-field"
            :value="value.domainRecordId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select domain record"
            required
            :slots="{ append: true }"
            :menu-props="{ offsetY: true }"
            :items="domainRecords"
            :rules="[(v) => Validations.required(v, labels.Required)]"
            @input="handleChangeDomainRecord($event)"
          >
            <template #append>
              <VTooltip bottom max-width="240" z-index="9999999">
                <template #activator="{ on, attrs }">
                  <VIcon
                    v-if="domainSuggestIcon"
                    v-bind="attrs"
                    size="20"
                    color="#2196f3"
                    :class="['domain-suggest-icon', { 'domain-suggest-icon--spin': domainSuggest.isLoading }]"
                    v-on="on"
                    @click.stop="suggestDomain"
                    @mousedown.stop.prevent
                  >{{ domainSuggestIcon }}</VIcon>
                </template>
                <span>Suggest a safe, content-matched domain</span>
              </VTooltip>
              <VIcon class="domain-suggest-chevron">mdi-menu-down</VIcon>
            </template>
          </KSelect>
          <div v-if="domainSuggestNote" class="domain-suggest-note">
            <VIcon x-small color="#2196f3" class="mr-1">mdi-auto-fix</VIcon>{{ domainSuggestNote }}
          </div>
          <div v-if="blocklistWarning" class="blocklist-hint">
            <span
              class="blocklist-hint__text"
              :style="{ color: blocklistWarning.status === 'malicious' ? '#f44336' : '#ff9800' }"
            >
              {{ blocklistWarning.reason }}
              <a
                class="blocklist-hint__link"
                :class="{ 'blocklist-hint__link--loading': domainSuggest.isLoading }"
                @click.prevent="suggestDomain"
              >
                <VIcon
                  small
                  color="#2196f3"
                  class="mr-1"
                  :class="{ 'domain-suggest-icon--spin': domainSuggest.isLoading }"
                >{{ domainSuggest.isLoading ? 'mdi-loading' : 'mdi-auto-fix' }}</VIcon
                ><span class="blocklist-hint__link-label">Suggest clean domain</span>
              </a>
            </span>
          </div>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Path"
            :value="value.pathTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="/path"
            :items="pathTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'pathTypeId')"
          ></KSelect>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Extension"
            :value="value.extensionTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="extension"
            :items="extensionTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'extensionTypeId')"
          ></KSelect>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Parameter"
            :value="value.parameterTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select Parameter"
            :items="parameterTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'parameterTypeId')"
          ></KSelect>
        </div>
      </div>

      <div class="input-phishing-link-mini__simulation-link">
        <VTextField
          label="Simulation Link"
          v-model.trim="disabledLabel"
          outlined
          dense
          persistent-hint
          hide-details
          readonly
          class="input-phishing-link-mini__simulation-link-input"
        />
      </div>

      <div v-if="showCaptchaOption" class="input-phishing-link-mini__captcha">
        <VCheckbox
          :input-value="captchaEnabled"
          color="#2196f3"
          hide-details
          dense
          class="mt-2"
          @change="$emit('captcha-change', $event)"
        >
          <template #label>
            <span class="body-2">Stop bots to prevent false clicks.</span>
            <VTooltip bottom max-width="260">
              <template #activator="{ on, attrs }">
                <VIcon size="20" class="ml-1" v-bind="attrs" v-on="on" @click.stop>mdi-information</VIcon>
              </template>
              <span>When enabled, bot activity is detected and blocked, preventing false clicks.</span>
            </VTooltip>
          </template>
        </VCheckbox>
      </div>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import domainSuggest from '@/mixins/domainSuggest'
import { getDomainBlocklistStatus, getCleanDomainSuggestions } from '@/api/domainBlocklist'
export default {
  name: 'InputPhishingLinkMini',
  components: { KSelect },
  mixins: [domainSuggest],
  props: {
    value: {
      type: Object,
      default() {
        return {
          urlSchemaTypeId: '',
          subDomain: '',
          domainRecordId: '',
          pathTypeId: '',
          extensionTypeId: '',
          parameterTypeId: ''
        }
      }
    },
    title: {
      type: String,
      default: 'Phishing Link'
    },
    subtitle: {
      type: String,
      default: 'Create a phishing link for users to click and be directed to the landing page'
    },
    parameterTypes: {
      type: Array,
      default: () => []
    },
    extensionTypes: {
      type: Array,
      default: () => []
    },
    pathTypes: {
      type: Array,
      default: () => []
    },
    domainRecords: {
      type: Array,
      default: () => []
    },
    urlSchemaTypes: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    showCaptchaOption: {
      type: Boolean,
      default: false
    },
    captchaEnabled: {
      type: Boolean,
      default: false
    },
    contentText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Validations,
      labels,
      urlSchemaTypesModified: [],
      disabledLabel: '',
      blocklistWarning: null,
      cleanSuggestions: [],
      isSuggestionsLoading: false,
      subdomainRules: [],
      httpRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlocklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ],
      httpsRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlocklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ]
    }
  },
  computed: {
    getUrlSchemaTypesModified() {
      const baseList = this.urlSchemaTypesModified.length
        ? this.urlSchemaTypesModified
        : this.urlSchemaTypes
      return baseList
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler() {
        this.changeDisabledLabel()
        this.$nextTick(() => {
          if (this.$refs.refSubdomain) {
            this.$refs.refSubdomain.validate()
          }
        })
      }
    },
    disabledLabel(val) {
      this.$emit('link-change', val)
    },
    'value.urlSchemaTypeId': {
      immediate: true,
      handler(val) {
        this.subdomainRules = val === '1' ? this.httpRules : this.httpsRules
        this.$nextTick(() => {
          if (this.$refs.refSubdomain) {
            this.$refs.refSubdomain.validate()
          }
        })
      }
    },
    'value.domainRecordId'(val) {
      this.changeDisabledLabel()
      if (val) {
        this.checkSchemaTypes(val)
        // Edit: template API loads after mount — mounted ran with empty id; run blocklist when id arrives.
        if (this.isEdit) this.checkDomainBlocklist(val)
      }
    },
    'value.parameterTypeId'() {
      this.changeDisabledLabel()
    },
    'value.subDomain'() {
      this.changeDisabledLabel()
    },
    'value.pathTypeId'() {
      this.changeDisabledLabel()
    },
    domainRecords(newVal, oldVal) {
      if (!newVal?.length) return
      const wasEmpty = !oldVal?.length
      if (!wasEmpty) return
      if (!this.isEdit && !this.value.domainRecordId) {
        this.setDefaultValue()
        return
      }
      if (this.value.domainRecordId) {
        this.checkDomainBlocklist(this.value.domainRecordId)
      }
    }
  },
  mounted() {
    if (!this.isEdit) this.setDefaultValue()
    if (this.isEdit && this.value?.domainRecordId) {
      this.checkSchemaTypes(this.value.domainRecordId, false)
      this.checkDomainBlocklist(this.value.domainRecordId)
    }
  },
  methods: {
    handleInputChange(value, key) {
      this.$emit('input', {
        ...this.value,
        [key]: value?.trim?.() || ''
      })
      this.changeDisabledLabel()
    },
    setDefaultValue() {
      this.$emit('input', {
        ...this.value,
        urlSchemaTypeId: this.getUrlSchemaTypesModified[0]?.value || '',
        subDomain: 'www',
        domainRecordId: this.domainRecords[0]?.value || '',
        pathTypeId: this.pathTypes[0]?.value || '',
        extensionTypeId: this.extensionTypes[0]?.value || '',
        parameterTypeId: this.parameterTypes[0]?.value || ''
      })
      this.$emit('invisible-captcha', !this.domainRecords[0]?.extraDatas[1]?.value)
      this.$emit('captcha-default-value', this.domainRecords[0]?.extraDatas[1]?.value)
      this.checkSchemaTypes(this.domainRecords[0]?.value)
      this.checkDomainBlocklist(this.domainRecords[0]?.value)
    },
    changeDisabledLabel() {
      this.disabledLabel = `${
        this.getUrlSchemaTypesModified.find(
          (item) => item.value === this.value.urlSchemaTypeId?.toString() || ''
        )?.text
      }${this.value.subDomain || 'subDomain'}.${
        this.domainRecords.find(
          (item) => item.value === this.value.domainRecordId?.toString() || ''
        )?.text || 'noDomain'
      }/${
        this.pathTypes.find((item) => item.value === this.value.pathTypeId?.toString() || '')
          ?.text || 'noPath'
      }${
        this.extensionTypes.find(
          (item) => item.value === this.value.extensionTypeId?.toString() || ''
        )?.text || 'noExtension'
      }?${
        this.parameterTypes.find(
          (item) => item.value === this.value.parameterTypeId?.toString() || ''
        )?.text
      }=${createRandomCryptStringNumber()}`
    },
    handleChangeDomainRecord(value) {
      const schemaInfo = this.getDomainSchemaInfo(this.getDomainRecord(value))
      const protocolValue = this.getProtocolValueForDomain(schemaInfo)
      this.$emit('input', {
        ...this.value,
        domainRecordId: value?.trim?.() || '',
        ...(protocolValue ? { urlSchemaTypeId: protocolValue } : {})
      })
      this.checkSchemaTypes(value, true, { syncProtocol: false })
      this.changeDisabledLabel()
      this.checkDomainBlocklist(value)
    },
    checkDomainBlocklist(domainRecordId) {
      this.blocklistWarning = null
      this.cleanSuggestions = []
      const domainRecord = this.domainRecords.find(
        (item) => String(item.value) === String(domainRecordId)
      )
      if (!domainRecord) return
      const domainName = domainRecord.text
      getDomainBlocklistStatus(domainName)
        .then((response) => {
          const data = response.data
          if (data.status === 'malicious' || data.status === 'suspicious') {
            this.blocklistWarning = { status: data.status, reason: data.reason }
          }
        })
        .catch(() => {})
    },
    handleSwitchDomain() {
      this.isSuggestionsLoading = true
      getCleanDomainSuggestions()
        .then((response) => {
          const suggestions = response.data.suggestions || []
          this.cleanSuggestions = suggestions.filter((s) =>
            this.domainRecords.some((d) =>
              d.text === s.domain || d.text?.includes(s.domain) || s.domain?.includes(d.text)
            )
          )
        })
        .catch(() => {})
        .finally(() => { this.isSuggestionsLoading = false })
    },
    selectCleanDomain(domain) {
      const match = this.domainRecords.find((d) => d.text === domain)
      if (match) {
        this.handleChangeDomainRecord(match.value)
      }
    },
    getDomainRecord(value) {
      return this.domainRecords.find((item) => item.value === value)
    },
    getDomainSchemaInfo(domainRecord) {
      const activeSchema = domainRecord?.extraDatas?.[0] || {}
      const schemaText = activeSchema?.text?.toLowerCase?.() || ''
      const rawActiveVal = activeSchema?.value?.toString()
      const isBothSchema = schemaText === 'both'
      const isHttpsSchema = schemaText.includes('https')
      const isHttpSchema = schemaText.includes('http') && !isHttpsSchema
      const activeVal = isHttpsSchema
        ? this.getSchemaValueByProtocol('https') || rawActiveVal
        : isHttpSchema
        ? this.getSchemaValueByProtocol('http') || rawActiveVal
        : rawActiveVal

      return { activeVal, isBothSchema, isHttpsSchema }
    },
    getSchemaValueByProtocol(protocol) {
      const schema = this.getUrlSchemaTypesModified.find((item) =>
        item.text?.toLowerCase?.().startsWith(`${protocol}://`)
      )
      return schema?.value?.toString()
    },
    isCreateMode() {
      return !this.isEdit || this.isDuplicate
    },
    isSchemaDisabled(schema, { activeVal, isBothSchema, isHttpsSchema }) {
      if (isBothSchema || (this.isCreateMode() && isHttpsSchema)) return false
      return activeVal !== schema.value?.toString()
    },
    getProtocolValueForDomain({ activeVal, isBothSchema }) {
      if (
        !this.isDuplicate &&
        this.isEdit &&
        activeVal === '1' &&
        this.value?.urlSchemaTypeId?.toString() !== '1'
      ) {
        return '1'
      }

      if (this.isCreateMode()) {
        return isBothSchema ? '2' : activeVal
      }

      return ''
    },
    syncProtocolWithDomain({ activeVal, isBothSchema }) {
      const protocolValue = this.getProtocolValueForDomain({ activeVal, isBothSchema })
      if (protocolValue) this.handleInputChange(protocolValue, 'urlSchemaTypeId')
    },
    checkSchemaTypes(value, isDomainChange = false, options = {}) {
      this.$nextTick(() => {
        const domainRecord = this.getDomainRecord(value)
        const schemaInfo = this.getDomainSchemaInfo(domainRecord)
        this.urlSchemaTypesModified = this.getUrlSchemaTypesModified.map((schema) => {
          schema.disabled = this.isSchemaDisabled(schema, schemaInfo)
          return schema
        })
        if (options.syncProtocol !== false) this.syncProtocolWithDomain(schemaInfo)
        this.$emit('invisible-captcha', !domainRecord?.extraDatas?.[1]?.value)
        if (!this.isEdit || isDomainChange) {
          this.$emit('captcha-default-value', domainRecord?.extraDatas?.[1]?.value)
        } else if (!domainRecord?.extraDatas?.[1]?.value) {
          this.$emit('captcha-default-value', false)
        }
      })
    }
  }
}
</script>
