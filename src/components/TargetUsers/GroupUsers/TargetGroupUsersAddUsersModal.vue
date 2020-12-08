<template>
  <AppModal
    :status="status"
    v-if="status"
    :title="getTitle"
    icon-name="mdi-account-plus"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="Add Users To Group"
        sub-title="Select Users and add them to your group"
      />
      <TargetGroupUsersTable
        :custom-fields="customFields"
        :table-data="tableData"
        :has-row-actions="false"
        :has-add-button="false"
        @handleSelectionChange="handleSelectionChange"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
export default {
  name: 'TargetGroupUsersAddUsersModal',
  components: { TargetGroupUsersTable, AppModalBodyHeader, AppModal },
  props: {
    customFields: {
      type: Array
    },
    tableData: {
      type: Array
    },
    status: {
      type: Boolean
    },
    groupName: {
      type: String,
      required: true
    }
  },
  emits: ['closeOverlay'],
  data() {
    return {
      selections: []
    }
  },
  computed: {
    getTitle() {
      return `Add Users To “${this.groupName}” Group`
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      console.log('this.selections', this.selections)
    },
    handleSelectionChange(selections = []) {
      this.selections = selections
    }
  }
}
</script>
