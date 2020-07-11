<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule rounded-xl">
    <v-form ref="refForm" lazy-validation>
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
        <v-col md="2" v-if="query.operand === 'Analysis result'">
          <!-- List of "Analysis result" operands-->
          <v-select
            v-model="query.value"
            :items="rule.operandsAnalysisResult"
            class="mr-2"
            outlined
            hide-details
          />
        </v-col>
        <v-col v-if="rule.type === 'conditions' && query.operand !== 'Analysis result'">
          <!-- Condition text input-->
          <v-text-field
            v-model="query.value"
            :placeholder="labels.textInputPlaceholder"
            outlined
            :rules="getRules()"
          />
        </v-col>
        <v-col md="auto" class="text-right">
          <!-- Remove rule button -->
          <v-btn icon class="" @click="remove">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
import { mail, required } from '../../../utils/validations'
export default {
  extends: QueryBuilderRule,
  data() {
    return {
      validations: {
        required,
        mail
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
          return [(v) => this.validations.required(v, 'Required')]
        case 'Regex':
          return [(v) => this.validations.required(v, 'Required')]
        default:
          break
      }
    }
  }
}
</script>
