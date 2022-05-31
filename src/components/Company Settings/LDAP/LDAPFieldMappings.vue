<template>
  <div>
    <MapTable ref="refMapTable" :map-table-data="mappingData" />
  </div>
</template>

<script>
import MapTable from '@/components/TargetUsers/subcomponents/MapTable'
export default {
  name: 'LDAPFieldMappings',
  components: { MapTable },
  data() {
    return {
      mappingData: {
        columns: [],
        headers: [],
        tableData: []
      }
    }
  }
}
</script>
