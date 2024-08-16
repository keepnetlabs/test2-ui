<template>
  <AppDialog
    icon="mdi-account-group"
    title="Target Groups"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div class="mb-6">Target Groups</div>
      <div class="common-report-target-groups">
        <div v-for="(tg, index) in targetGroups" :key="index">
          <div class="common-report-target-group">
            <span class="common-report-target-group__name">{{ tg.name }}</span>
          </div>
          <hr
            v-if="index !== targetGroups.length - 1"
            class="common-report-target-group__divider"
          />
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
    targetGroups: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    }
  }
}
</script>
