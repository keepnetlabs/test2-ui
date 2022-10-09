<template>
  <KContainer id="email-threat-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane v-if="getEtsQuickScanPermissionSearch" label="Scans" name="scans" id="tab-scans">
        <scans v-if="tab === 'scans'" ref="refScans" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getEtsAttackVectorPermissionSearch"
        label="Attacks Vectors"
        name="attacksVectors"
        id="tab-attacks-vectors"
      >
        <attacks-vectors v-if="tab === 'attacksVectors'" ref="refAttacksVectors" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import AttacksVectors from '@/components/EmailThreatSmulator/AttacksVectors'
import Scans from '@/components/EmailThreatSmulator/Scans'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'EMailThreatSimulator',
  components: {
    KContainer,
    AttacksVectors,
    Scans
  },
  data() {
    return {
      tab: 'scans'
    }
  },
  computed: {
    ...mapGetters({
      getEtsQuickScanPermissionSearch: 'permissions/getEtsQuickScanPermissionSearch',
      getEtsAttackVectorPermissionSearch: 'permissions/getEtsAttackVectorPermissionSearch'
    })
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  },
  created() {
    if (!this.getEtsQuickScanPermissionSearch && this.getEtsAttackVectorPermissionSearch) {
      this.tab = 'attacksVectors'
    } else if (this.getEtsQuickScanPermissionSearch && !this.getEtsAttackVectorPermissionSearch) {
      this.tab = 'scans'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refScans, refAttacksVectors } = this.$refs
    if (refScans && refScans.modalStatus) {
      refScans.checkIfCanCLoseNewModal()
      next(false)
    } else if (refAttacksVectors && refAttacksVectors.modalStatus) {
      refAttacksVectors.checkIfCanCLoseNewModal()
      next(false)
    } else {
      next()
    }
  }
}
</script>
