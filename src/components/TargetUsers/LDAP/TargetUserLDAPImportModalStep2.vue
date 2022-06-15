<template>
  <div>
    <KButtonRadioGroup
      v-if="!isLoading"
      v-model="selectedRadioGroupIndex"
      :items="radioGroupItems"
    />
    <div>
      <TargetUserLDAPImportLoader
        v-if="isLoading"
        class="mt-6"
        :processed-user-count="processedUserCount"
        :is-idle="isIdle"
      />
      <TargetUserLdapImportManuallyStep
        ref="refManually"
        v-else-if="!isEdit && selectedRadioGroupIndex === 0"
      />
      <TargetUserLDAPImportSyncByQueryStep
        ref="refQuery"
        v-else-if="isEdit ? selectedRadioGroupIndex === 0 : selectedRadioGroupIndex === 1"
      />
    </div>
  </div>
</template>

<script>
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
import TargetUserLdapImportManuallyStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStep'
import TargetUserLDAPImportSyncByQueryStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryStep'
import TargetUserLDAPImportLoader from '@/components/TargetUsers/LDAP/TargetUserLDAPImportLoader'
import LDAPService from '@/api/ldap'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

const TRANSACTION_STATUSES = {
  IDLE: 0,
  RUNNING: 1,
  WAITING_RESPONSE: 2,
  EXPIRED: 3,
  FINISHED: 4,
  FINISHED_WITH_ERROR: 5
}

export default {
  name: 'TargetUserLDAPImportModalStep2',
  components: {
    TargetUserLDAPImportLoader,
    TargetUserLDAPImportSyncByQueryStep,
    TargetUserLdapImportManuallyStep,
    KButtonRadioGroup
  },
  props: {
    selectedLDAPItems: {
      type: Array,
      default: () => []
    },
    step2Step: {
      type: Number,
      default: 0
    },
    step1Step: {
      type: Number
    }
  },
  inject: ['resourceId', 'isEdit', 'setSelectedUsers'],
  provide() {
    return {
      getTransactionId: () => this.transactionId,
      getMappingObject: () => this.mappingObject
    }
  },
  data() {
    const radioGroupItems = [
      {
        label: 'SYNC BY QUERY',
        infoText:
          'Select this option to sync users by criteria. The synchronization process will repeat every 24 hours.'
      }
    ]
    if (!this.isEdit)
      radioGroupItems.unshift({
        label: 'SELECT Manually',
        infoText: 'Select this option to import users manually without auto-sync.'
      })
    if (this.step1Step === 0) {
      radioGroupItems.push({
        label: 'SYNC ALL USERS',
        infoText:
          'Select this option to sync all users in your active directory. The synchronization process will repeat every 24 hours.'
      })
    }
    return {
      radioGroupItems,
      selectedRadioGroupIndex: radioGroupItems.length === 1 ? 0 : this.step2Step || 0,
      processedUserCount: 0,
      isLoading: false,
      activeStatus: 0,
      transactionId: '',
      mappingObject: {},
      groupFilterValues: []
    }
  },
  computed: {
    isIdle() {
      return this.activeStatus === TRANSACTION_STATUSES.IDLE
    }
  },
  watch: {
    selectedRadioGroupIndex(val) {
      this.setSelectedUsers([])
      this.$emit('update:step2Step', val)
    }
  },
  created() {
    this.createLDAPMapping()
  },
  methods: {
    createLDAPMapping() {
      this.isLoading = true
      this.groupFilterValues = this.selectedLDAPItems.map((item) => item.filterValue)
      LDAPService.createLDAPMapping({
        ldapSettingId: this.resourceId,
        groupFilterValues: this.groupFilterValues
      })
        .then((response) => {
          this.transactionId = response?.data?.data?.transactionId
          this.checkLDAPMappingStatus(this.transactionId)
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    checkLDAPMappingStatus(transactionId = '') {
      LDAPService.checkLDAPMappingStatus(transactionId).then((response) => {
        const {
          data: { data }
        } = response
        const { existingUserCount, newUserCount, invalidUserCount, status } = data
        this.processedUserCount = existingUserCount + newUserCount + invalidUserCount
        this.mappingObject = data
        this.activeStatus = status
        if (status === TRANSACTION_STATUSES.FINISHED_WITH_ERROR) {
          this.$store.dispatch('common/createSnackBar', {
            message: 'Something went wrong. Finished With Error',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          this.$emit('on-error')
        } else if (status === TRANSACTION_STATUSES.EXPIRED) {
          this.$store.dispatch('common/createSnackBar', {
            message: 'Expired',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          this.$emit('on-error')
        } else if (status === TRANSACTION_STATUSES.FINISHED) {
          this.isLoading = false
        } else {
          setTimeout(() => {
            this.checkLDAPMappingStatus(transactionId)
          }, 2500)
        }
      })
    }
  }
}
</script>
