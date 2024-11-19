<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <widget-container class="campaign-manager-scenario-statistics-widget">
        <widget-header
          button-id="btn-link--recently-posted-threats"
          close-button-id="btn-close--recently-posted-threats"
          :title="getTitle"
          :subtitle="getSubtitle"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #title="{ value }">
              <span v-if="value" class="campaign-manager-scenario-statistics-widget__column">
                {{ value }}
              </span>
            </template>
            <template #communityName="{ value }">
              <span>
                <span class="campaign-manager-scenario-statistics-widget__column">
                  {{ '150' }}
                </span>
                <span
                  class="campaign-manager-scenario-statistics-widget__bar"
                  style="width: 45%;"
                ></span>
                <span class="campaign-manager-scenario-statistics-widget__percentage">45%</span>
              </span>
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import { getIncidentList } from '@/api/threatSharing'
import labels from '@/model/constants/labels'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'CampaignManagerStatisticsEmotionalTrigger',
  components: {
    WidgetLoading,
    WidgetContainer,
    WidgetList,
    WidgetBody,
    WidgetHeader
  },
  props: {
    editMode: {
      type: Boolean
    }
  },

  data() {
    return {
      isLoading: true,
      columns: [
        {
          property: PROPERTY_STORE.TITLE,
          label: LABEL_STORE.NAME,
          thStyle: {
            width: '30%'
          },
          tdStyle: {
            width: '30%'
          }
        },
        {
          property: PROPERTY_STORE.COMMUNITYNAME,
          label: labels.NumberOfTemplates
        }
      ],
      tableData: [],
      empty: {
        message: labels.EmptyRecentlyPostedThreats
      }
    }
  },
  created() {
    this.callForRecentlyPostedThreats()
  },
  computed: {
    getTitle() {
      return 'Emotional Trigger'
    },
    getSubtitle() {
      return 'Number of phishing templates by emotional trigger'
    }
  },
  methods: {
    callForRecentlyPostedThreats() {
      const payload = {
        postedCompanyResourceId: '',
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'PostedTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  Value: '',
                  FieldName: 'Title',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'Description',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'DiscoveryAndDetection',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'Scope',
                  Operator: 'Contains'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'CategoryResourceId',
                  Operator: 'Include',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      getIncidentList(payload)
        .then((response) => {
          const {
            data: {
              data: { results = [] }
            }
          } = response
          this.tableData = [...results, ...results.slice(0, 1)]
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleTitleSelection(row) {
      localStorage.setItem('communityName', row.communityName)
      localStorage.setItem('communityResourceIdForRedirect', row.communityResourceId)
      this.$router.push({
        path: `/threat-sharing/community/${row.communityResourceId}`,
        query: {
          postId: row.communityPostResourceId,
          communityName: localStorage.getItem('communityName'),
          communityId: localStorage.getItem('communityResourceIdForRedirect')
        }
      })
    },
    handleCommunitySelection(row) {
      localStorage.setItem('communityName', row.communityName)
      localStorage.setItem('communityResourceIdForRedirect', row.communityResourceId)
      this.$router.push({
        path: `/threat-sharing/community/${row.communityResourceId}`
      })
    }
  }
}
</script>
