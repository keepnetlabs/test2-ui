<template>
  <section class="workshop">
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select :items="items" :menu-props="{ offsetY: true }" outlined></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field hint="www.example.com/page" persistent-hint outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field label="Outlined" outlined></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field label="Outlined" placeholder="Placeholder" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'Workshop',
  props: {},
  data: () => ({
    items: ['Foo', 'Bar', 'Fizz', 'Buzz']
  }),
  computed: {},
  created: () => {},
  methods: {},
  watch: {}
}
</script>
<style lang="scss">
.workshop {
  background: white;
  padding: 30px 30px;
}
</style>
