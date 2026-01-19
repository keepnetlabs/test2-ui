<template>
  <AppDialog
    icon="mdi-account-group"
    :title="title"
    :subtitle="subtitle"
    :status="status"
    max-height-size="1200"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div class="common-report-target-groups-container">
        <div class="common-report-target-groups-search-container">
          <v-text-field
            v-model.trim="search"
            class="filter-field"
            placeholder="Search"
            outlined
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </div>
        <div class="common-report-target-groups">
          <div v-if="getTargetGroups.length">
            <div v-for="(tg, index) in getTargetGroups" :key="index">
              <div class="common-report-target-group">
                <span class="common-report-target-group__name">{{ tg.name }}</span>
              </div>
              <hr
                v-if="index !== getTargetGroups.length - 1"
                class="common-report-target-group__divider"
              />
            </div>
          </div>
          <div v-else class="common-report-target-group">Sorry, that search has no results.</div>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="closeModal" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'

export default {
  name: 'CommonReportViewTargetGroupsModal',
  components: {
    AppDialog,
    AppDialogFooterWithClose
  },
  props: {
    status: {
      type: Boolean
    },
    title: {
      type: String,
      default: 'Target Groups'
    },
    subtitle: {
      type: String,
      default: ''
    },
    targetGroups: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    getTargetGroups() {
      if (this.search) {
        return this.targetGroups.filter((tg) =>
          tg.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
        )
      }
      return this.targetGroups
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    }
  }
}
</script>
