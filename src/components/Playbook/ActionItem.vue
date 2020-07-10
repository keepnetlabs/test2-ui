<template>
  <div class="vqb-rule rounded-xl">
    <!-- <p>{{ id }}</p> -->
    <v-row>
      <v-col cols="2" class="mr-2">
        <v-select v-model="actionItemType" :items="act.actionTypes" outlined hide-details />
      </v-col>
      <v-col v-if="actionItemType == 'Mark as'" cols="2" class="mr-2">
        <v-select v-model="markAsOpts" :items="act.markAsOpts" outlined hide-details />
      </v-col>
      <v-col class="text-right">
        <!-- Remove act button -->
        <v-btn icon @click="$emit('remove', id)">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ActionItem',
  props: {
    act: Object,
    id: Number
  },
  data() {
    return {
      actionItemType: '',
      markAsOpts: ''
    }
  },
  mounted() {
    //console.log(this)
  },
  methods: {}
}
</script>

<style></style>
