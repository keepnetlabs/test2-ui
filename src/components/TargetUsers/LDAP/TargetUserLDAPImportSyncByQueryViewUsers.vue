<template>
  <AppDialog
    title-id="text--ldap-import-snyc-by-query-view-users-popup-title"
    subtitle-id="text--cldap-import-snyc-by-query-view-users-popup-subtitle"
    icon="mdi-email"
    title="Users filtered by criteria"
    :status="status"
    maxHeightSize="665"
    :custom-size="'1000'"
    :subtitle="getSubtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <TargetUserLDAPImportManuallyStepTable
        ref="refTable"
        hide-filter
        :total-number-of-records.sync="totalNumberOfRecords"
      />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import TargetUserLDAPImportManuallyStepTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStepTable'
export default {
  name: 'TargetUserLDAPImportSyncByQueryViewUsers',
  components: { TargetUserLDAPImportManuallyStepTable, AppDialog },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      totalNumberOfRecords: 0
    }
  },
  computed: {
    getSubtitle() {
      return `${this.totalNumberOfRecords} users found.`
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
