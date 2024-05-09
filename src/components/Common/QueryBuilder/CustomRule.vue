<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule" :id="`query-builder-rule-${index}-${getParentIndex}`">
    <div
      v-if="getBadgeRender"
      :id="`playbook-query-builder-rule-logical-operator-custom-group-badge-${index}-${getParentIndex}`"
      class="custom-rule-badge"
      :style="{ left: $parent.query.logicalOperator === 'AND' ? '-60px' : '-57px' }"
    >
      {{ $parent.query.logicalOperator }}
    </div>
    <v-row>
      <v-col md="2">
        <k-select
          v-model.trim="query.operand"
          :id="`input--query-builder-rule-operand-${index}-${getParentIndex}`"
          :items="rule.operands"
          outlined
          min-width-type="small"
          nudge-width="20"
          @input="handleOperandChange"
        />
      </v-col>
      <v-col
        md="2"
        v-if="
          typeof rule.operators !== 'undefined' &&
          query.operand !== 'SenderIp' &&
          query.operand !== 'AttachmentHash' &&
          query.operand !== 'TimeZoneId' &&
          rule.operators.length > 1
        "
      >
        <k-select
          v-model="query.operator"
          :id="`input--query-builder-rule-operator-${index}-${getParentIndex}`"
          :items="query.operand === 'Keyword' ? rule.keywordOperators : rule.operators"
          outlined
          item-value="value"
          min-width-type="small"
          item-text="text"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'AttachmentHash'">
        <k-select
          v-model.trim="query.operator"
          :id="`input--query-builder-rule-operator-${index}-${getParentIndex}`"
          :items="rule.operandsAttachmentHash"
          outlined
          min-width-type="small"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'SenderIp'">
        <k-select
          v-model.trim="query.operator"
          :id="`input--query-builder-rule-operator-${index}-${getParentIndex}`"
          :items="rule.operandsSenderIP"
          outlined
          min-width-type="small"
        />
      </v-col>
      <template v-if="isOperatorExists">
        <v-col md="2" v-if="query.operand === 'From'">
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-format-${index}-${getParentIndex}`"
            v-model.trim="query.format"
            :items="rule.operandsFrom"
            outlined
            hide-details
          />
        </v-col>

        <v-col md="2" v-if="query.operand === 'To'">
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-format-${index}-${getParentIndex}`"
            v-model.trim="query.format"
            :items="rule.operandsTo"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'CC'">
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-format-${index}-${getParentIndex}`"
            v-model.trim="query.format"
            :items="rule.operandsCC"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'SenderIp'">
          <k-select
            v-model.trim="query.format"
            min-width-type="small"
            :id="`input--query-builder-rule-format-${index}-${getParentIndex}`"
            :items="rule.operatorSenderIP"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'Analysis result'">
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-operand-${index}-${getParentIndex}`"
            v-model="query.value"
            :items="rule.operandsAnalysisResult"
            outlined
          />
        </v-col>
        <v-col md="4" v-if="query.operand === 'TimeZoneId'">
          <InputTimezone
            v-model.trim="query.value"
            class="black-placeholder"
            isBlock
            isBlankSelectable
          />
        </v-col>
        <v-col
          v-if="
            rule.type === 'conditions' &&
            query.operand !== 'Analysis result' &&
            query.operand !== 'SenderIp' &&
            query.operand !== 'Subject' &&
            query.operand !== 'Keyword' &&
            query.operand !== 'AttachmentName' &&
            query.operand !== 'AttachmentExtension' &&
            query.operand !== 'AttachmentHash' &&
            query.operand !== 'TimeZoneId'
          "
          md=""
          sm="10"
        >
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            :placeholder="getPlaceholder()"
            outlined
            persistent-hint
            hint="*Required"
            autocomplete="disabled"
            :rules="getRules()"
          />
        </v-col>
        <v-col v-if="query.operand === 'SenderIp'">
          <InputIpAddress
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            :placeholder="query.format === 'Ip' ? 'Enter IP address' : 'Enter regular expression'"
            :rules="
              query.format === 'Ip'
                ? [
                    (v) => validations.required(v, 'Required'),
                    (v) => validations.startsWithSpace(v, 'Cannot start with space'),
                    (v) => validations.ip(v, 'Invalid ip address')
                  ]
                : [(v) => validations.required(v, 'Required')]
            "
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'Subject'">
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter subject or a regular expression"
            outlined
            persistent-hint
            hint="*Required"
            :rules="getSubjectRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'Keyword'">
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter keywords or a regular expression to search in email body"
            outlined
            persistent-hint
            hint="*Required"
            :rules="getKeywordRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentName'">
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter file name or a regular expression"
            outlined
            persistent-hint
            hint="*Required"
            :rules="getAttachmentNameRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentExtension'">
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter file extension (tar.gz) without the starting dot"
            outlined
            persistent-hint
            hint="*Required"
            :rules="getAttachmentExtensionRules()"
            autocomplete="disabled"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentHash'">
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter SHA512 or MD5 hash"
            outlined
            :rules="getAttachmentHashRules()"
            autocomplete="disabled"
            persistent-hint
            hint="*Required"
          />
        </v-col>
      </template>

      <v-col
        :md="query.operand === 'Analysis result' ? '6' : !isOperatorExists ? '8' : 'auto'"
        sm="2"
        class="text-right"
        style="
          padding-top: 18px !important;
          padding-left: 10px !important;
          padding-right: 18px !important;
        "
      >
        <v-btn
          icon
          v-if="isDeleteRuleButton()"
          :id="`btn--query-builder-close-${index}-${getParentIndex}}`"
          @click="removeRule"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as validations from '../../../utils/validations'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
export default {
  extends: QueryBuilderRule,
  components: {
    InputIpAddress,
    KSelect,
    InputTimezone
  },
  data() {
    return {
      validations: validations,
      attachId: null,
      getBadgeRender: false
    }
  },
  watch: {
    'query.operator'(newVal = '', oldVal = '') {
      if (newVal === 'Exists' || newVal === 'DoesNotExist') {
        this.query.format = ''
        this.query.value = ''
      }
      if (
        (oldVal === 'Exists' || oldVal === 'DoesNotExist') &&
        newVal !== 'Exists' &&
        newVal !== 'DoesNotExists'
      ) {
        if (this.query.operand === 'SenderIp') {
          this.query.format = 'Ip'
        } else {
          this.query.format = 'Email'
        }
      }
    },
    'query.operand'(newVal = '') {
      if (newVal === 'AttachmentHash') {
        if (this.query.operator !== 'Equal' || this.query.operator !== 'IsNotEqual') {
          this.query.operator = 'Equal'
        }
      }
    },
    '$parent.query.children'() {
      const { $children } = this.$parent
      this.getBadgeRender =
        $children && $children.length && $children[$children.length - 1].attachId !== this.attachId
    }
  },
  computed: {
    isOperatorExists() {
      return this.query.operator !== 'Exists' && this.query.operator !== 'DoesNotExist'
    },
    getParentIndex() {
      if (this.$parent && this.$parent.$parent && this.$parent.$parent.index) {
        return this.$parent.$parent.index
      } else {
        return '0'
      }
    }
  },
  created() {
    this.attachId = `id-${createRandomCryptStringNumber()}`
    if (!this.query.format) {
      this.query.format = 'Email'
    }
  },
  methods: {
    getRules() {
      if (!this.query) return []
      const { format, operator } = this.query
      if (format === 'Email') {
        const emailValidationArray = [
          (v) => this.validations.required(v, labels.Required),
          (v) =>
            this.validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.EmailAddress, 320))
        ]
        if (operator !== 'Contains' && operator !== 'DoesNotContain') {
          emailValidationArray.push((v) => this.validations.mail(v, labels.InvalidEmailAddress))
          emailValidationArray.push((v) => {
            if (this.validations.email(v)) {
              return this.validations.controlEmailLength(v) || labels.InvalidEmailAddress
            }
            return false
          })
        }
        return emailValidationArray
      }
      if (format === 'Domain') {
        const domainValidationArray = [
          (v) => this.validations.required(v, labels.Required),
          (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Domain', 256))
        ]
        if (operator !== 'Contains' && operator !== 'DoesNotContain') {
          domainValidationArray.push((v) => this.validations.domain(v, labels.InvalidDomainName))
        }
        return domainValidationArray
      }
      if (format === 'Regex') {
        return [
          (v) => this.validations.required(v, labels.Required),
          (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Regex', 256))
        ]
      }
      if (format === 'Group') {
        return [
          (v) => this.validations.required(v, labels.Required),
          (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Group'))
        ]
      }
      return [(v) => this.validations.required(v, labels.Required)]
    },
    getPlaceholder() {
      if (!this.query?.format) return 'Enter custom field value'
      if (this.query.format === 'Email') return 'Enter an email address'
      if (this.query.format === 'Domain') return 'Enter a domain address'
      if (this.query.format === 'Regex') return 'Enter a regular expression'
      if (this.query.format === 'Group') return 'Enter a group name'
      return 'Enter custom field value'
    },
    getSubjectRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 512, labels.getMaxLengthMessage('Subject', 512))
      ]
    },
    getKeywordRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Keyword', 64))
      ]
    },
    getAttachmentNameRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('AttachmentName', 64))
      ]
    },
    getAttachmentExtensionRules() {
      return [
        (v) => this.validations.minLength(v, 1, 'Extension must have at least 1 character'),
        (v) => this.validations.extension(v, labels.InvalidExtension),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Extension', 64))
      ]
    },
    getAttachmentHashRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) =>
          this.validations.maxLength(v, 128, labels.getMaxLengthMessage('Attachment hash', 128))
      ]
    },
    handleOperandChange(value) {
      if (value === 'SenderIp') {
        this.query.operator = 'Equal'
        this.query.format = 'Ip'
      } else if (value === 'Analysis result') {
        this.query.value = 'Phishing'
      } else if (value === 'To' || value === 'CC' || value === 'From') {
        this.query.format = 'Email'
      } else if (value === 'Keyword') {
        this.query.operator = 'Contains'
      } else {
        this.query.format = 'Custom'
      }
    },
    removeRule() {
      this.remove()
    },
    isDeleteRuleButton() {
      let ruleCount = 0
      this.$parent.$parent.query.children.map((obj) => {
        if (obj.type === 'query-builder-rule') {
          ruleCount++
        }
      })
      return ruleCount > 1
    }
  }
}
</script>
