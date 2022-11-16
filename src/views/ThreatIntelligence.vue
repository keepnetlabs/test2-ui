<template>
  <KContainer id="threat-intelligence">
    <threat-intelligence-list ref="refThreatIntelligence" />
  </KContainer>
</template>

<script>
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
  }
}
</script>
