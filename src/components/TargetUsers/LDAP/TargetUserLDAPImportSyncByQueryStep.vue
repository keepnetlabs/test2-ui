<template>
  <div>
    <vue-query-builder
      v-model="query"
      id="target-user-ldap-query-builder"
      class="w-100"
      :max-depth="1"
      :labels="label"
      :rules="rules"
    >
      <template #default="slotProps">
        <v-form ref="refForm" lazy-validation>
          <query-builder-group
            v-bind="slotProps"
            ref="queryBuilderGroup"
            hide-first-group-header
            :query.sync="query"
          >
            <template #group-footer>
              <div
                class="w-100"
                style="position: absolute; bottom: 58px; text-align: right; right: 46px;"
              >
                <v-btn
                  class="fw-600 no-box-shadow"
                  color="#2196F3"
                  rounded
                  outlined
                  @click="handleViewUsers"
                >
                  <v-icon left>mdi-account-multiple</v-icon>
                  VIEW USERS
                </v-btn>
              </div>
            </template>
          </query-builder-group>
        </v-form>
      </template>
    </vue-query-builder>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../../Common/QueryBuilder/CustomGroup'
export default {
  name: 'TargetUserLDAPImportSyncByQueryStep',
  components: {
    VueQueryBuilder,
    QueryBuilderGroup
  },
  data() {
    return {
      query: {
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
      ],
      label: {
        matchType: 'Match Type',
        matchTypes: [
          { id: 'OR', label: 'OR' },
          { id: 'AND', label: 'AND' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD ANOTHER CONDITION SET',
        textInputPlaceholder: 'value'
      }
    }
  },
  methods: {
    handleViewUsers() {}
  }
}
</script>
