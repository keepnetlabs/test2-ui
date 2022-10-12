<template>
  <KContainer id="threat-intelligence">
    <threat-intelligence-list ref="refThreatIntelligence" />
  </KContainer>
</template>

<script>
import Scans from '@/components/EmailThreatSmulator/Scans'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import ThreatIntelligenceList from '@/components/ThreatIntelligence/ThreatIntelligenceList'

export default {
  name: 'ThreatIntelligence',
  components: {
    KContainer,
    ThreatIntelligenceList
  },
  data() {
    return {
      tab: 'scans'
    }
  },
  computed: {},
  methods: {},
  created() {}
}
</script>
