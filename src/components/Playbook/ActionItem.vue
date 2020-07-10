<template>
  <div class="vqb-rule rounded-xl">
    <!-- <p>{{ id }}</p> -->
    <v-row>
      <v-col md="2" class="mr-2">
        <v-select v-model="actionItemType" :items="act.actionTypes" outlined hide-details />
      </v-col>
      <v-col v-if="actionItemType == 'Mark as'" md="2" class="mr-2">
        <v-select v-model="markAsOpts" :items="act.markAsOpts" outlined hide-details />
      </v-col>
      <v-col v-if="actionItemType == 'Tag'" md="auto" class="mr-2 flex-grow-1">
        <v-combobox
          v-model="tags"
          :items="[]"
          chips
          deletable-chips
          :search-input.sync="tagsearch"
          @keyup.tab="updateTags"
          @paste="updateTags"
          outlined
          class="hide-caret"
          multiple
          dense
          persistent-hint
          small-chips
          :return-object="false"
          required
          hide-details="auto"
        ></v-combobox>
      </v-col>
      <v-col v-if="notifyType == 'A user'" md="2" class="mr-2">
        <v-autocomplete
          v-model="targetUsers"
          :items="targets"
          :search-input.sync="search"
          chips
          clearable
          item-text="name"
          item-value="symbol"
          label="Select users, groups, departments or companies"
          class="first-select input-select"
          solo
          :rules="autocomplete"
          required
        >
          <template v-slot:selection="{ attr, on, item, selected }">
            <v-chip
              v-bind="attr"
              :input-value="selected"
              color="#2196f3"
              class="white--text"
              v-on="on"
            >
              {{ item }}
            </v-chip>
          </template>
          <template v-slot:item="{ item }">
            {{ item }}
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col v-if="actionItemType == 'Notify'" md="2" class="mr-2">
        <v-select
          v-model="notifyTemplate"
          :items="act.notifyTemplates"
          item-value="value"
          item-text="label"
          outlined
          hide-details
        />
      </v-col>
      <v-spacer v-if="actionItemType != 'Tag'" />
      <v-col class="text-right flex-grow-0">
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
      markAsOpts: '',
      tagsearch: '',
      tags: [],
      notifyType: '',
      notifyTemplate: '',
      searchUser: '',
      searchGroup: '',
      targets: [],
      targetUsers: ''
    }
  },
  mounted() {
    //console.log(this)
  },
  methods: {
    updateTags() {
      this.$nextTick(() => {
        this.tags.push(...this.tagsearch.split(','))
        this.$nextTick(() => {
          this.tagsearch = ''
        })
      })
    }
  }
}
</script>

<style></style>
