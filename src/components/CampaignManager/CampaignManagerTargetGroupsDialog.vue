<template>
  <AppDialog
    icon="mdi-account-group"
    icon-color="#2196f3"
    :title="labels.TargetGroups"
    :status="status"
    :max-height="true"
    max-height-size="500px"
    custom-size="900"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="campaign-manager-target-groups-dialog">
        <div
          v-if="infoMessage"
          class="campaign-manager-target-groups-dialog__alert"
        >
          <AlertBox
            :text="infoMessage"
            icon-name="mdi-information"
            icon-color="#2196f3"
          />
        </div>
        <div class="campaign-manager-target-groups-dialog__content">
          <div class="campaign-manager-target-groups-dialog__content-header">
            Current Target Groups
          </div>
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <div
            v-else-if="targetGroups.length"
            class="campaign-manager-target-groups-dialog__grid"
          >
            <div
              v-for="(group, index) in targetGroups"
              :key="group.name || index"
              class="campaign-manager-target-groups-dialog__item"
            >
              <div class="campaign-manager-target-groups-dialog__item-name">
                {{ getGroupName(group) }}
              </div>
              <div class="campaign-manager-target-groups-dialog__item-count">
                {{ getGroupCount(group) }}
              </div>
            </div>
          </div>
          <div v-else class="campaign-manager-target-groups-dialog__empty">
            <h2 class="campaign-manager-target-groups-dialog__empty-text">
              {{ labels.NoTargetGroupsForCampaign }}
            </h2>
          </div>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'
import AlertBox from '@/components/AlertBox'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import labels from '@/model/constants/labels'
import { getCampaignTargetGroups } from '@/api/phishingsimulator'
import { CAMPAIGN_TYPE } from '@/components/CampaignManager/utils'

const GROUP_COUNT_KEYS = ['count', 'usersCount', 'userCount']

function parseGroupsFromResponse(response) {
  const body = response?.data
  const data = body?.data ?? body
  const groups = data?.groups ?? data?.targetGroups ?? (Array.isArray(data) ? data : [])
  return Array.isArray(groups) ? groups : []
}

function getGroupCount(group) {
  for (const key of GROUP_COUNT_KEYS) {
    if (group[key] != null) return group[key]
  }
  const domainCount = group?.domainAllowList?.find((r) => r.status === 'Verified')?.count
  return domainCount ?? 0
}

export default {
  name: 'CampaignManagerTargetGroupsDialog',
  components: {
    AppDialog,
    AppDialogFooterWithClose,
    AlertBox,
    DatatableLoading
  },
  props: {
    status: { type: Boolean, default: false },
    campaignResourceId: { type: String, default: '' },
    instanceGroup: { type: String, default: '' },
    campaignType: { type: Number, default: CAMPAIGN_TYPE.Phishing },
    infoMessage: {
      type: String,
      default: 'The exact target user count will be determined when the campaign starts.'
    }
  },
  data() {
    return {
      labels,
      targetGroups: [],
      isLoading: false
    }
  },
  watch: {
    status: {
      handler(val) {
        if (val && this.campaignResourceId) {
          this.fetchTargetGroups()
        } else {
          this.targetGroups = []
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchTargetGroups() {
      if (!this.campaignResourceId) return
      this.isLoading = true
      this.targetGroups = []
      try {
        const response = await getCampaignTargetGroups(this.campaignResourceId, {
          campaignType: this.campaignType,
          instanceGroup: this.instanceGroup || undefined
        })
        this.targetGroups = parseGroupsFromResponse(response)
      } catch {
        this.targetGroups = []
      } finally {
        this.isLoading = false
      }
    },
    getGroupCount,
    getGroupName(group) {
      return group.name || group.targetGroupName || ''
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="scss" scoped>
.campaign-manager-target-groups-dialog {
  &__alert {
    margin-bottom: 16px;

    ::v-deep .alert-box {
      background: var(--Aqua-Aqua-Light, #f1f8fe);
    }
  }

  &__content-header {
    color: var(--Black-Black, #383b41);
    font-feature-settings: "liga" off, "clig" off;
    font-family: "Open Sans", sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 16px 24px;
    border-bottom: 1px solid #e0e0e0;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 33.333%;
    width: 33.333%;
    max-width: 33.333%;
    font-size: 14px;
    color: #383b41;
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 24px;
    box-sizing: border-box;

    &:not(:nth-child(3n)) {
      border-right: 1px solid #e0e0e0;
    }
  }

  &__item-name {
    flex: 1;
    min-width: 0;
  }

  &__item-count {
    flex-shrink: 0;
    margin-left: 8px;
    font-weight: 600;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    padding: 24px;
    text-align: center;
  }

  &__empty-text {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.29;
    letter-spacing: normal;
    color: var(--Black-Black, #383b41);
    margin: 0;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }
}
</style>
