<template>
  <v-container class="group-operator" fluid>
    <v-row>
      <v-col>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              {{ groupOperator.currentOperator }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="operator in groupOperator.operators"
              :key="operator.identifier"
              @click="selectOperator(operator.identifier)"
            >
              <v-list-item-title>{{ operator.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['groupOperator'],
  data() {
    return {
      expanded: false
    }
  },
  methods: {
    selectOperator(operator) {
      this.expanded = false
      this.groupOperator.updateCurrentOperator(operator)
    }
  }
}
</script>

<style scoped>
.group-operator {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
