<template>
  <nav>
    <!--<v-toolbar-side-icon class="grey--text" @click="drawer != drawer"></v-toolbar-side-icon>-->
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' }
      ],
      mini: true
    }
  }
}
</script>
