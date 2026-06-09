<template>
  <FormGroup
    class-name="email-template input-phishing-link mt-2 p-4"
    :title="title"
    :sub-title="subtitle"
  >
    <div class="d-flex" style="max-width: 980px;">
      <KSelect
        :value="value.urlSchemaTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        style="max-width: 102px;"
        placeholder="Select URL schema"
        :menu-props="{ offsetY: true }"
        :items="getUrlSchemaTypesModified"
        @change="handleInputChange($event, 'urlSchemaTypeId')"
      ></KSelect>
      <VTextField
        :value="value.subDomain"
        ref="refSubdomain"
        required
        placeholder="subdomain"
        hint="*Required"
        outlined
        dense
        persistent-hint
        class="same-width"
        :rules="subdomainRules"
        @input="handleInputChange($event, 'subDomain')"
      />
      <KSelect
        :value="value.domainRecordId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        label="Domain"
        class="same-width domain-suggest-field"
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
      <KSelect
        :value="value.pathTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        placeholder="/path"
        :items="pathTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'pathTypeId')"
      ></KSelect>
      <KSelect
        :value="value.extensionTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        placeholder="extension"
        :items="extensionTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'extensionTypeId')"
      ></KSelect>
      <KSelect
        :value="value.parameterTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        label="Parameter"
        class="same-width"
        placeholder="Select Parameter"
        :items="parameterTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'parameterTypeId')"
      ></KSelect>
    </div>
    <div v-if="domainSuggestNote" class="domain-suggest-note mb-2" style="max-width: 980px;">
      <VIcon x-small color="#2196f3" class="mr-1">mdi-auto-fix</VIcon>{{ domainSuggestNote }}
    </div>
    <div v-if="blocklistWarning" class="blocklist-hint mb-2" style="max-width: 980px;">
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
    <div style="max-width: 980px;">
      <VTextField
        v-model.trim="disabledLabel"
        style="max-width: 100% !important;"
        outlined
        dense
        persistent-hint
        disabled
        label="Your link is"
      />
    </div>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import domainSuggest from '@/mixins/domainSuggest'
import { getDomainBlocklistStatus, getCleanDomainSuggestions } from '@/api/domainBlocklist'
export default {
  name: 'InputPhishingLink',
  components: { KSelect, FormGroup },
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
    contentText: {
      type: String,
      default: ''
    },
    // Language name of the template being edited (e.g. "Turkish (Türkiye)"); sent to the AI
    // domain-suggest worker as a hint. Read by the domainSuggest mixin's ensureAiPreferred.
    suggestLanguage: {
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
      this.checkSchemaTypes(this.value.domainRecordId)
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
      this.checkSchemaTypes(value, { syncProtocol: false })
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
    checkSchemaTypes(value, options = {}) {
      this.$nextTick(() => {
        const domainRecord = this.getDomainRecord(value)
        const schemaInfo = this.getDomainSchemaInfo(domainRecord)
        this.urlSchemaTypesModified = this.getUrlSchemaTypesModified.map((schema) => {
          schema.disabled = this.isSchemaDisabled(schema, schemaInfo)
          return schema
        })
        if (options.syncProtocol !== false) this.syncProtocolWithDomain(schemaInfo)
        if (this.isEdit) return
        this.$emit('invisible-captcha', !domainRecord?.extraDatas?.[1]?.value)
        this.$emit('captcha-default-value', domainRecord?.extraDatas?.[1]?.value)
      })
    }
  }
}
</script>
