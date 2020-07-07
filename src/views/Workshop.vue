<template>
  <section class="workshop">
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12">
          <vue-query-builder
            :max-depth="2"
            class="w-100"
            :labels="label"
            :rules="rules"
            v-model="query"
          >
            <template v-slot:default="slotProps">
              <query-builder-group v-bind="slotProps" :query.sync="query" />
            </template>
          </vue-query-builder>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <pre>{{ JSON.stringify(this.query, null, 2) }}</pre>
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
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../components/Common/QueryBuilder/CustomGroup'

export default {
  name: 'Workshop',
  components: { VueQueryBuilder, QueryBuilderGroup },
  props: {},
  data: () => ({
    label: {
      matchType: 'Match Type',
      matchTypes: [
        { id: 'and', label: 'AND' },
        { id: 'or', label: 'OR' }
      ],
      addRule: 'ADD CONDITION',
      addGroup: 'ADD NEW CONDITION SET',
      textInputPlaceholder: 'value'
    },
    operators: [
      'contains',
      'does not contain',
      'is equal to',
      'is not equal to',
      'exist',
      'does not exist'
    ],
    rules: [
      {
        type: 'conditions',
        id: 'conditions',
        label: 'Conditions',
        operands: [
          'From',
          'To',
          'CC',
          'Sender IP',
          'Subject',
          'Keyword',
          'Attachment name',
          'Attachment hash',
          'Attachment extension',
          'Custom syntax',
          'Analysis result'
        ],
        operandsFrom: ['Email', 'Domain', 'Regex'],
        operandsTo: ['Email', 'Group', 'Domain', 'Regex'],
        operandsAnalysisResult: ['Phising', 'Malicious', 'Non-malicious'],
        operators: [
          'contains',
          'does not contain',
          'is equal to',
          'is not equal to',
          'exist',
          'does not exist'
        ]
      }
    ],
    query: {
      logicalOperator: 'AND',
      children: [
        {
          type: 'query-builder-group',
          query: {
            logicalOperator: 'AND',
            children: [
              {
                type: 'query-builder-rule',
                query: {
                  rule: 'conditions',
                  operator: 'contains',
                  operand: 'From',
                  format: 'Domain',
                  value: null
                }
              }
            ]
          }
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
