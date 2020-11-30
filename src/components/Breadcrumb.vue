<template>
  <div class="breadcrumb">
    <template v-for="(item, index) in breadcrumb">
      <router-link :key="index" :to="{ name: item }">
        {{ index === 0 ? baseName : item }}
      </router-link>
      <v-icon
        v-if="index + 1 < breadcrumb.length"
        :key="index + 'a'"
        style="color: #fff; font-size: 16px; line-height: 0.25;"
        >mdi-chevron-right
      </v-icon>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    baseName: {
      default: 'Company',
      type: String
    }
  },
  data() {
    return {
      breadcrumb: []
    }
  },
  mounted() {
    this.generate()
  },
  watch: {
    // call again the method if the route changes
    $route: 'generate'
  },
  methods: {
    generate() {
      this.breadcrumb = [this.$route.name]
      let parent = this.$route.meta.parentName
      while (parent) {
        parent && this.breadcrumb.unshift(parent)
        const resolved = this.$router.resolve({ name: parent })
        parent = resolved.route.meta.parentName
      }
      //this.breadcrumb.unshift(this.baseName)
      //console.log('breadcrumb', this.breadcrumb)
    }
  }
}
</script>

<style lang="scss">
#app {
  .breadcrumb {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    a {
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      color: rgb(255, 255, 255);
      text-decoration-line: none;
      &.active-link {
        opacity: 0.7;
      }
    }
  }
}
</style>
