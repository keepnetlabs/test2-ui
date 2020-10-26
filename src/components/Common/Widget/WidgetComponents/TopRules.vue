<template>
  <DatatableLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <matching-incident-modal
          :status="showMatchingModal"
          :selectedMatch="selectedMatch"
          v-if="showMatchingModal"
          @closeOverlay="toggleMatchingIncidentModal"
        />
        <widget-header
          :editMode="editMode"
          title="Top Rules"
          @deleteWidget="$emit('deleteWidget')"
          :link="{ href: '/playbook', text: 'Playbook' }"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:ruleName="{ value, row }">
              <span class="k-widget-list__item cursor-pointer" @click="handleRuleNameClick(row)"
                >{{ value }}
              </span>
            </template>

            <template v-slot:matchCount="{ value, row }">
              <span class="k-widget-list__no-match" v-if="value === 0">
                No Match
              </span>
              <span
                @click="handleSelectMatch(row)"
                v-else
                class="k-widget-list__item cursor-pointer"
              >
                {{ getValue(value) }}
              </span>
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </DatatableLoading>
</template>

<script>
import { getTopRules } from '@/api/incidentResponder'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
export default {
  name: 'TopRules',
  components: {
    WidgetBody,
    DatatableLoading,
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

  data() {
    return {
      isLoading: true,
      tableData: [],
      showPlaybookModal: false,
      showMatchingModal: false,
      selectedMatch: null,
      columns: [
        {
          property: 'ruleName',
          label: 'Rule Name',
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: 'matchCount',
          align: 'left',
          label: 'Matching Incidents',
          emptyText: 'No Match',
          thStyle: { textAlign: 'center' },
          tdStyle: { textAlign: 'center' }
        }
      ],
      empty: {
        message: "There isn't any top rules, yet"
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
          this.isLoading = false
          const {
            data: { data, status }
          } = response
          this.tableData = data || []
        })
        .catch((error) => {
          /*
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting the top rules!'
          })
          */
          this.isLoading = false
        })
    },
    handleRuleNameClick({ resourceId = '' }) {
      this.$router.push({
        name: 'Playbook',
        params: {
          playbookId: resourceId
        }
      })
    },
    handleSelectMatch(row) {
      this.selectedMatch = row
      this.toggleMatchingIncidentModal()
    },
    toggleMatchingIncidentModal() {
      this.showMatchingModal = !this.showMatchingModal
    },
    getValue(value) {
      return `${value} ${value === 1 ? 'Match' : 'Matches'}`
    }
  }
}
</script>

<style lang="scss"></style>
