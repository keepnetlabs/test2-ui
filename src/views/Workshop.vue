<template>
  <section class="workshop">
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12">
          <query-builder :config="config" v-model="query">
            <template #groupOperator="props">
              <group-operator-slot :group-operator="props" />
            </template>

            <template #groupControl="props">
              <group-ctrl-slot :group-ctrl="props" />
            </template>

            <template #rule="props">
              <rule-slot :rules="config.rules" :ruleCtrl="props" />
            </template>
          </query-builder>
        </v-col>
      </v-row>
    </v-container>
  </section>
  <!--
  <section class="workshop">
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select :items="items" :menu-props="{ offsetY: true }" outlined></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field hint="www.example.com/page" persistent-hint outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field label="Outlined" outlined></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field label="Outlined" placeholder="Placeholder" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </section>-->
</template>

<script>
import QueryBuilder from 'query-builder-vue'
import GroupOperatorSlot from '../components/Common/QueryBuilder/GroupOperatorSlot'
import GroupCtrlSlot from '../components/Common/QueryBuilder/GroupCtrlSlot'
import RuleSlot from '../components/Common/QueryBuilder/RuleSlot'
import VTextField from 'vuetify/lib/components/VTextField/VTextField'
export default {
  name: 'Workshop',
  components: { QueryBuilder, GroupOperatorSlot, GroupCtrlSlot, RuleSlot },
  props: {},
  data: () => ({
    query: null,

    config: {
      operators: [
        {
          name: 'AND',
          identifier: 'AND'
        },
        {
          name: 'OR',
          identifier: 'OR'
        }
      ],
      rules: [
        {
          identifier: 'txt',
          name: 'Text Selection',
          component: VTextField,
          initialValue: ''
        },
        {
          identifier: 'num',
          name: 'Number Selection',
          component: VTextField,
          initialValue: 10
        }
      ]
    }
  }),
  computed: {},
  created: () => {},
  methods: {},
  watch: {}
}
</script>
<style lang="scss">
.workshop {
  background: white;
  padding: 30px 30px;
}
</style>
