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
      <!-- <label class="mr-5">{{ rule.label }}</label> -->
      <v-col md="2">
        <!-- List of operands (optional) -->
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
          rule.operators.length > 1
        "
      >
        <!-- List of operators (e.g. =, !=, >, <) -->
        <k-select
          v-model="query.operator"
          :id="`input--query-builder-rule-operator-${index}-${getParentIndex}`"
          :items="rule.operators"
          outlined
          item-value="value"
          min-width-type="small"
          item-text="text"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'AttachmentHash'">
        <!-- List of "From" operands-->
        <k-select
          v-model.trim="query.operator"
          :id="`input--query-builder-rule-operator-${index}-${getParentIndex}`"
          :items="rule.operandsAttachmentHash"
          outlined
          min-width-type="small"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'SenderIp'">
        <!-- List of "From" operands-->
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
          <!-- List of "From" operands-->
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
          <!-- List of "From" operands-->
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
          <!-- List of "From" operands-->
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-format-${index}-${getParentIndex}`"
            v-model.trim="query.format"
            :items="rule.operandsCC"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'Analysis result'">
          <!-- List of "Analysis result" operands-->
          <k-select
            min-width-type="small"
            :id="`input--query-builder-rule-operand-${index}-${getParentIndex}`"
            v-model="query.value"
            :items="rule.operandsAnalysisResult"
            outlined
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
            query.operand !== 'AttachmentHash'
          "
          md=""
          sm="10"
        >
          <!-- Condition text input-->
          <v-text-field
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            :placeholder="getPlaceholder()"
            outlined
            persistent-hint
            hint="*Required"
            :rules="getRules()"
            autocomplete="disabled"
          />
        </v-col>
        <v-col v-if="query.operand === 'SenderIp'">
          <!-- Condition text input-->
          <InputIpAddress
            v-model.trim="query.value"
            :id="`input--query-builder-value-${index}-${getParentIndex}`"
            placeholder="Enter IP address"
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.startsWithSpace(v, 'Cannot start with space'),
              (v) => validations.ip(v, 'Invalid ip address')
            ]"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'Subject'">
          <!-- Condition text input-->
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
          <!-- Condition text input-->
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
          <!-- Condition text input-->
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
        <!-- Remove rule button -->
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
import * as Validations from '@/utils/validations'
export default {
  extends: QueryBuilderRule,
  components: {
    InputIpAddress,
    KSelect
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
        this.query.format = 'Email'
      }
    },
    'query.operand'(newVal = '', oldVal = '') {
      if (newVal === 'AttachmentHash') {
        if (this.query.operator !== 'Equal' || this.query.operator !== 'IsNotEqual') {
          this.query.operator = 'Equal'
        }
      }
    },
    '$parent.query.children'(children) {
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
        return `${Math.floor(Math.random() * 10000).toString()}`
      }
    }
  },
  methods: {
    getAttachedItem(item) {
      item = `.${item}`
      return document.querySelector(item)
    },
    getRules() {
      if (this.query) {
        const { format, operator } = this.query
        switch (format) {
          case 'Email':
            const emailValidationArray = [
              (v) => this.validations.required(v, labels.Required),
              (v) =>
                this.validations.maxLength(
                  v,
                  320,
                  labels.getMaxLengthMessage(labels.EmailAddress, 320)
                )
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
          case 'Domain':
            const domainValidationArray = [
              (v) => this.validations.required(v, labels.Required),
              (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Domain', 256))
            ]
            if (operator !== 'Contains' && operator !== 'DoesNotContain') {
              domainValidationArray.push((v) =>
                this.validations.domain(v, labels.InvalidDomainName)
              )
            }
            return domainValidationArray
          case 'Regex':
            return [
              (v) => this.validations.required(v, labels.Required),
              (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Regex'))
            ]
          case 'Group':
            return [
              (v) => this.validations.required(v, labels.Required),
              (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Group'))
            ]
          default:
            break
        }
      }
    },
    getPlaceholder() {
      switch (this.query && this.query.format) {
        case 'Email':
          return 'Enter an email address'
        case 'Domain':
          return 'Enter a domain address'
        case 'Regex':
          return 'Enter a regular expression'
        case 'Group':
          return 'Enter a group name'
      }
    },
    getSenderIpRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.ip(v, 'Invalid ip address')
      ]
    },
    getSubjectRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Subject', 64))
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
        (v) => this.validations.minLength(v, 3, labels.getMinLengthMessage('Extension', 3)),
        (v) => this.validations.extension(v, labels.InvalidExtension),
        (v) => this.validations.maxLength(v, 10, labels.getMaxLengthMessage('Extension', 10))
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
  },
  created() {
    this.attachId = `id-${Math.floor(Math.random() * 10000).toString()}`
    if (!this.query.format) {
      this.query.format = 'Email'
    }
  }
}
</script>
<style lang="scss">
.custom-rule-badge {
  @media (max-width: 896px) {
    top: 137px;
  }
  position: absolute;
  left: -57px;
  top: 64px;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1.33;
  font-weight: 600;
  background-color: #e3f2fd;
  font-size: 12px;
  border: solid 1px rgba(100, 181, 246, 0.5);
  color: #2196f3;
  z-index: 9;
}
</style>
