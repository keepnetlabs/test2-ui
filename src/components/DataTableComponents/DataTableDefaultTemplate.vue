<template>
  <span class="notification-templates__name-column">
    <span>{{ scope.row.name }}</span>
    <v-tooltip v-if="scope.row.isDefault" bottom>
      <template #activator="{ on }">
        <v-icon v-on="on" size="20" color="#1173C1" class="pl-2">mdi-star-circle</v-icon>
      </template>
      <span>{{ getTooltip }}</span>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  name: 'DataTableDefaultTemplate',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    getTooltip() {
      if (this.scope?.row?.typeName)
        return `Default option for  “${this.scope.row.typeName}"  template type`
      return 'Default option'
    }
  }
}
</script>
