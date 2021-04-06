<template>
  <div class="switch-account__container">
    <DatatableLoading v-if="loading" :loading="loading" />
    <template v-show="!loading" v-for="(item, i) in items">
      <v-lazy
        transition="none"
        :key="i"
        :options="{
          threshold: 0
        }"
        :min-height="48"
      >
        <v-treeview dense item-text="title" item-key="id" :items="[item]">
          <template v-slot:prepend="{ item }">
            <img
              :src="item.logoUrl || require('../assets/img/no-logo.png')"
              alt=""
              style="width: 32px; height: 32px;"
            />
          </template>
        </v-treeview>
      </v-lazy>
    </template>
  </div>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
export default {
  name: 'SwitchAccountTreeView',
  components: { DatatableLoading },
  props: {
    items: {
      type: Array
    },
    loading: {
      type: Boolean
    }
  }
}
</script>
