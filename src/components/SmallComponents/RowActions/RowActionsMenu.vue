<template>
  <v-menu bottom left offset-y transition="scale-transition">
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...menu, ...tooltip }" class="btn-hover ml-1" icon>
            <v-icon>mdi-dots-vertical </v-icon>
          </v-btn>
        </template>
        <span>More</span>
      </v-tooltip>
    </template>
    <v-list>
      <slot></slot>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'RowActionsMenu'
}
</script>
