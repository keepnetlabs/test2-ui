<!-- eslint-disable prettier/prettier -->
<template>
    <VMenu close-on-content-click bottom :offset="10" :nudge-bottom="28">
        <template #activator="{ on }">
        <div id="appendable-merge-tag" class="d-flex align-center cursor-pointer" v-on="on">
            <VIcon color="#757575">mdi-tag-plus</VIcon>
            <span class="ml-1" style="font-size: 12px; color: #757575;font-weight: 600;">
            Merge Tag
            </span>
        </div>
        </template>
        <VList>
            <VListItem v-for="tag in mergeTags" :key="tag.value" @click="addMergeTag(tag.value)">
                <VListItemTitle>
                    {{ tag.value }}
                </VListItemTitle>
            </VListItem>
        </VList>
    </VMenu>
</template>

<script>
export default {
  name: 'AppendableMergeTag',
  data() {
    return {
      mergeTags: [
        { name: 'Email', value: '{EMAIL}' }
      ]
    }
  },
  methods: {
    addMergeTag(tag) {
      this.$emit('on-add-merge-tag', tag)
    }
  }
}
</script>
