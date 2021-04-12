<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <matching-incident-modal
          :status="showMatchingModal"
          :selectedMatch="selectedMatch"
          v-if="showMatchingModal"
          @closeOverlay="toggleMatchingIncidentModal"
        />
        <widget-header
          button-id="btn-link--top-rules"
          close-button-id="btn-close--top-rules"
          :editMode="editMode"
          :title="getTitle"
          :link="{ href: '/playbook', text: 'Playbook' }"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:ruleName="{ value, row, rowIndex }">
              <span
                class="k-widget-list__item cursor-pointer"
                :id="`text--top-rules-rule-name${rowIndex}`"
                @click="handleRuleNameClick(row)"
                >{{ value }}
              </span>
            </template>

            <template v-slot:matchCount="{ value, row, rowIndex }">
              <span
                :id="`text--top-rules-match-count-${rowIndex}`"
                class="k-widget-list__no-match"
                v-if="value === 0"
              >
                No Match
              </span>
              <span
                v-else
                class="k-widget-list__item cursor-pointer"
                :id="`text--top-rules-match-count-${rowIndex}`"
                @click="handleSelectMatch(row)"
              >
                {{ getValue(value) }}
              </span>
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import { getTopRules } from '@/api/incidentResponder'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
export default {
  name: 'TopRules',
  components: {
    WidgetBody,
    WidgetLoading,
    WidgetHeader,
    WidgetList,
    WidgetContainer,
    MatchingIncidentModal
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  computed: {
    getTitle() {
      return labels.TopRules
    }
  },

  data() {
    return {
      isLoading: true,
      tableData: [],
      showPlaybookModal: false,
      showMatchingModal: false,
      selectedMatch: null,
      columns: [
        {
          property: PROPERTY_STORE.RULENAME,
          label: LABEL_STORE.RULENAME,
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: PROPERTY_STORE.MATCHCOUNT,
          align: 'left',
          label: labels.MatchingIncidents,
          emptyText: labels.NoMatchEmptyText,
          thStyle: { textAlign: 'center' },
          tdStyle: { textAlign: 'center' }
        }
      ],
      empty: {
        message: labels.EmptyTopRulesWidget
      }
    }
  },
  created() {
    this.callForTopRules()
  },
  methods: {
    callForTopRules() {
      getTopRules()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.tableData = data || []
        })
        .finally(() => (this.isLoading = false))
    },
    handleRuleNameClick({ resourceId = '' }) {
      this.$emit('handleSelectPlaybookId', { resourceId, callback: this.callForTopRules })
    },
    handleSelectMatch(row) {
      this.selectedMatch = row
      this.toggleMatchingIncidentModal()
    },
    toggleMatchingIncidentModal() {
      this.showMatchingModal = !this.showMatchingModal
    },
    getValue(value) {
      //`${value} ${value === 1 ? 'Match' : 'Matches'}`
      return `${value} match(es)`
    }
  }
}
</script>

<style lang="scss"></style>
