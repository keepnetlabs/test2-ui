<template>
  <v-menu bottom left offset-y transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" class="btn-hover ml-1" icon>
        <v-icon>mdi-dots-vertical </v-icon>
      </v-btn>
    </template>
    <slot></slot>
  </v-menu>
</template>

<script>
export default {
  name: 'RowActionsMenu'
}
</script>
