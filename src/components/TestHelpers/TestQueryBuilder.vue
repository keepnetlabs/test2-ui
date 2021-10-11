<template>
  <vue-query-builder
    v-model="query"
    id="test-query-builder"
    class="w-100"
    :max-depth="maxDepth"
    :labels="label"
    :rules="rules"
  >
    <template v-if="hasSlot" v-slot:default="slotProps">
      <v-form ref="refStep2Form" lazy-validation>
        <query-builder-group ref="queryBuilderGroup" v-bind="slotProps" :query.sync="query" />
      </v-form>
    </template>
  </vue-query-builder>
</template>

<script>
import QueryBuilderGroup from '@/components/Common/QueryBuilder/CustomGroup'
import VueQueryBuilder from 'vue-query-builder'
export default {
  name: 'TestQueryBuilder',
  props: {
    maxDepth: {
      type: Number,
      default: 4
    },
    defaultQuery: {
      type: Object
    },
    hasSlot: {
      type: Boolean,
      default: false
    }
  },
  components: {
    QueryBuilderGroup,
    VueQueryBuilder
  },
  data() {
    return {
      query: this.defaultQuery || {
        logicalOperator: 'AND',
        children: [
          {
            type: 'query-builder-group',
            query: {
              logicalOperator: 'AND',
              children: []
            }
          }
        ]
      },
      label: {
        matchType: 'Match Type',
        matchTypes: [
          { id: 'OR', label: 'OR' },
          { id: 'AND', label: 'AND' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD ANOTHER CONDITION SET',
        textInputPlaceholder: 'value'
      },
      rules: [
        {
          type: 'conditions',
          id: 'conditions',
          label: 'Conditions',
          operands: [
            'From',
            'To',
            'CC',
            { text: 'Sender IP', value: 'SenderIp' },
            'Subject',
            'Keyword',
            { text: 'Attachment name', value: 'AttachmentName' },
            { text: 'Attachment hash', value: 'AttachmentHash' },
            { text: 'Attachment extension', value: 'AttachmentExtension' }
          ],
          operandsFrom: ['Email', 'Domain', 'Regex'],
          operandsTo: ['Email', 'Domain', 'Regex'],
          operandsCC: ['Email', 'Domain', 'Regex'],
          operandsAnalysisResult: ['Phishing', 'Malicious', 'Non-malicious'],
          operandsSenderIP: [
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
          ],
          operandsAttachmentHash: [
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' }
          ],
          operators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' },
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
          ],
          keywordOperators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' }
          ]
        }
      ]
    }
  }
}
</script>
