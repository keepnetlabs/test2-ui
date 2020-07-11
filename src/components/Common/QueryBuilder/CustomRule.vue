<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule rounded-xl">
    <v-row>
      <!-- <label class="mr-5">{{ rule.label }}</label> -->
      <v-col md="2" class="mr-2">
        <!-- List of operands (optional) -->
        <v-select v-model="query.operand" :items="rule.operands" outlined hide-details />
      </v-col>
      <v-col
        md="2"
        class="mr-2"
        v-if="typeof rule.operators !== 'undefined' && rule.operators.length > 1"
      >
        <!-- List of operators (e.g. =, !=, >, <) -->
        <v-select v-model="query.operator" :items="rule.operators" outlined hide-details />
      </v-col>
      <v-col md="2" v-if="query.operand === 'From'">
        <!-- List of "From" operands-->
        <v-select
          v-model="query.format"
          :items="rule.operandsFrom"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'To'">
        <!-- List of "From" operands-->
        <v-select
          v-model="query.format"
          :items="rule.operandsTo"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'CC'">
        <!-- List of "From" operands-->
        <v-select
          v-model="query.format"
          :items="rule.operandsCC"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'Analysis result'">
        <!-- List of "Analysis result" operands-->
        <v-select
          v-model="query.value"
          :items="rule.operandsAnalysisResult"
          class="mr-2"
          outlined
        />
      </v-col>
      <v-col
        v-if="
          rule.type === 'conditions' &&
          query.operand !== 'Analysis result' &&
          query.operand !== 'Sender IP' &&
          query.operand !== 'Subject' &&
          query.operand !== 'Keyword' &&
          query.operand !== 'Attachment name' &&
          query.operand !== 'Attachment extension' &&
          query.operand !== 'Attachment hash'
        "
      >
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          :placeholder="getPlaceholder()"
          outlined
          :rules="getRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Sender IP'">
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          placeholder="Enter IP or a regular expression"
          outlined
          :rules="getSenderIpRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Subject'">
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          placeholder="Enter subject or a regular expression"
          outlined
          :rules="getSubjectRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Keyword'">
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          placeholder="Enter keywords or a regular expression to search in email body"
          outlined
          :rules="getKeywordRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Attachment name'">
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          placeholder="Enter file name or a regular expression"
          outlined
          :rules="getAttachmentNameRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Attachment extension'">
        <v-text-field
          v-model="query.value"
          placeholder="Enter file extension"
          outlined
          :rules="getAttachmentExtensionRules()"
        />
      </v-col>
      <v-col v-if="query.operand === 'Attachment hash'">
        <v-text-field
          v-model="query.value"
          placeholder="Enter SHA512 or MD5 hash"
          outlined
          :rules="getAttachmentHashRules()"
        />
      </v-col>
      <v-col md="auto" class="text-right">
        <!-- Remove rule button -->
        <v-btn icon class="" @click="remove">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
import { mail, required, ip, domain, extension } from '../../../utils/validations'
export default {
  extends: QueryBuilderRule,
  data() {
    return {
      validations: {
        required,
        mail,
        ip,
        domain,
        extension
      }
    }
  },
  methods: {
    getRules() {
      switch (this.query && this.query.format) {
        case 'Email':
          return [
            (v) => this.validations.required(v, 'Required'),
            (v) => this.validations.mail(v, 'Invalid email address')
          ]
        case 'Domain':
          return [
            (v) => this.validations.required(v, 'Required'),
            (v) => this.validations.domain(v, 'Invalid domain name')
          ]
        case 'Regex':
          return [(v) => this.validations.required(v, 'Required')]
        case 'Group':
          return [(v) => this.validations.required(v, 'Required')]
        default:
          break
      }
    },
    getPlaceholder() {
      switch (this.query && this.query.format) {
        case 'Email':
          return 'Enter sender’s email address'
        case 'Domain':
          return 'Enter domain address'
        case 'Regex':
          return 'Enter regular expression'
        case 'Group':
          return 'Enter group name'
      }
    },
    getSenderIpRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.ip(v, 'Invalid Ip')
      ]
    },
    getSubjectRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getKeywordRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getAttachmentNameRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getAttachmentExtensionRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getAttachmentHashRules() {
      return [(v) => this.validations.required(v, 'Required')]
    }
  }
}
</script>
