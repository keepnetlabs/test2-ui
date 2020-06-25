<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        {{ ruleName }}
      </v-col>
      <v-col cols="10">
        <component
          :is="ruleCtrl.ruleComponent"
          :value="ruleCtrl.ruleData"
          @input="ruleCtrl.updateRuleData"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ['rules', 'ruleCtrl'],
  computed: {
    ruleName() {
      return this.rules.find((r) => r.component === this.ruleCtrl.ruleComponent).name
    }
  }
}
</script>
