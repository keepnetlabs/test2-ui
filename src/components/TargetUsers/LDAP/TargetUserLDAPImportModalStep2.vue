<template>
  <div>
    <KButtonRadioGroup :items="radioGroupItems" />
  </div>
</template>

<script>
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
export default {
  name: 'TargetUserLDAPImportModalStep2',
  components: { KButtonRadioGroup },
  data() {
    return {
      radioGroupItems: [{ label: 'MANUALLY' }, { label: 'SYNC BY QUERY' }]
    }
  }
}
</script>
