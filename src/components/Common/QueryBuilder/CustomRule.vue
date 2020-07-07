<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule rounded-xl">
    <v-row>
      <!-- <label class="mr-5">{{ rule.label }}</label> -->
      <v-col cols="2" class="mr-2">
        <!-- List of operands (optional) -->
        <v-select v-model="query.operand" :items="rule.operands" outlined hide-details />
      </v-col>
      <v-col
        cols="2"
        class="mr-2"
        v-if="typeof rule.operators !== 'undefined' && rule.operators.length > 1"
      >
        <!-- List of operators (e.g. =, !=, >, <) -->
        <v-select v-model="query.operator" :items="rule.operators" outlined hide-details />
      </v-col>
      <v-col cols="2" v-if="query.operand == 'From'">
        <!-- List of "From" operands-->
        <v-select
          v-model="query.format"
          :items="rule.operandsFrom"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="2" v-if="query.operand == 'To'">
        <!-- List of "From" operands-->
        <v-select
          v-model="query.format"
          :items="rule.operandsTo"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="2" v-if="query.operand == 'Analysis result'">
        <!-- List of "Analysis result" operands-->
        <v-select
          v-model="query.value"
          :items="rule.operandsAnalysisResult"
          class="mr-2"
          outlined
          hide-details
        />
      </v-col>
      <v-col v-if="rule.type == 'conditions' && query.operand != 'Analysis result'">
        <!-- Condition text input-->
        <v-text-field
          v-model="query.value"
          :placeholder="labels.textInputPlaceholder"
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="auto" class="text-right">
        <!-- Remove rule button -->
        <v-btn icon class="" @click="remove">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <!-- Basic text input
      <v-text-field
        v-if="rule.inputType === 'text'"
        v-model="query.value"
        class="mr-2"
        :placeholder="labels.textInputPlaceholder"
        outlined
        hide-details
      />-->

      <!-- Basic number input
      <input
        v-if="rule.inputType === 'number'"
        v-model="query.value"
        class="form-control"
        type="number"
      />-->

      <!-- Datepicker
      <input
        v-if="rule.inputType === 'date'"
        v-model="query.value"
        class="form-control"
        type="date"
      />-->

      <!-- Custom component input
      <div v-if="isCustomComponent" class="vqb-custom-component-wrap">
        <component :is="rule.component" :value="query.value" @input="updateQuery" />
      </div>
      -->
      <!-- Checkbox input
      <template v-if="rule.inputType === 'checkbox'">
        <div
          v-for="choice in rule.choices"
          :key="choice.value"
          class="form-check form-check-inline"
        >
          <input
            :id="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
            v-model="query.value"
            type="checkbox"
            :value="choice.value"
            class="form-check-input"
          />
          <label
            class="form-check-label"
            :for="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
          >
            {{ choice.label }}
          </label>
        </div>
      </template>
      -->
      <!-- Radio input
      <template v-if="rule.inputType === 'radio'">
        <div
          v-for="choice in rule.choices"
          :key="choice.value"
          class="form-check form-check-inline"
        >
          <input
            :id="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
            v-model="query.value"
            :name="'depth' + depth + '-' + rule.id + '-' + index"
            type="radio"
            :value="choice.value"
            class="form-check-input"
          />
          <label
            class="form-check-label"
            :for="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
          >
            {{ choice.label }}
          </label>
        </div>
      </template>
      -->
      <!-- Select without groups
      <select
        v-if="rule.inputType === 'select' && !hasOptionGroups"
        v-model="query.value"
        class="form-control"
        :multiple="rule.type === 'multi-select'"
      >
        <option v-for="option in selectOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      -->
      <!-- Select with groups
      <select
        v-if="rule.inputType === 'select' && hasOptionGroups"
        v-model="query.value"
        class="form-control"
        :multiple="rule.type === 'multi-select'"
      >
        <optgroup
          v-for="(option, option_key) in selectOptions"
          :key="option_key"
          :label="option_key"
        >
          <option v-for="sub_option in option" :key="sub_option.value" :value="sub_option.value">
            {{ sub_option.label }}
          </option>
        </optgroup>
      </select>
      -->
    </v-row>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
export default {
  extends: QueryBuilderRule
}
</script>
