<template>
  <v-container fluid class="group-ctrl-slot">
    <v-row>
      <v-col cols="auto">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              {{ ruleName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="rule in groupCtrl.rules"
              :key="rule.identifier"
              @click="setRule(rule.identifier)"
            >
              <v-list-item-title>{{ rule.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn :disabled="selectedRule === ''" @click="addRule">
          Add Rule
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="groupCtrl.newGroup"> Add Group</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ['groupCtrl'],
  data() {
    return {
      selectedRule: '',
      expanded: false
    }
  },
  computed: {
    ruleName() {
      if (this.selectedRule === '') {
        return 'Select a Rule'
      }

      return this.groupCtrl.rules.find((r) => r.identifier === this.selectedRule).name
    }
  },
  methods: {
    setRule(rule) {
      this.expanded = false
      this.selectedRule = rule
    },
    addRule(rule) {
      if (!this.selectedRule) {
        return
      }

      this.groupCtrl.addRule(this.selectedRule)
      this.selectedRule = ''
    }
  }
}
</script>

<style scoped>
.group-ctrl-slot {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
