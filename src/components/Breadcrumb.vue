<template>
  <div class="breadcrumb">
    <template v-for="(item, index) in breadcrumb">
      <router-link
        :id="getItemId(item)"
        :key="index"
        :to="{ name: item }"
        :style="[
          [
            'Company',
            'Phishing Simulator',
            'Reports',
            'Awareness Educator',
            'Vishing Simulator',
            'Smishing Simulator',
            'Quishing Simulator',
            'Campaign Reports',
            'Training Report',
            'Survey Report',
            'Poster Report',
            'Infographic Report',
            'Learning Path Report',
            'Screensaver Report'
          ].includes(item) && {
            pointerEvents: 'none',
            opacity: 0.7
          }
        ]"
      >
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
import { mdiChevronRight } from '@mdi/js'
import { mapGetters } from 'vuex'
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
      breadcrumb: [],
      mdiChevronRight
    }
  },
  mounted() {
    this.generate()
  },
  watch: {
    // call again the method if the route changes
    $route: 'generate',
    '$store.state.common.activeTrainingType': 'generate'
  },
  methods: {
    generate() {
      const type = this.$store?.state?.common?.activeTrainingType
      const routeName =
        this.$route.name === 'Training Report'
          ? type.startsWith('SCORM')
            ? 'Training Report'
            : type + ' Report'
          : this.$route.name
      this.breadcrumb = [routeName]
      let parent = this.$route.meta.parentName
      while (parent) {
        parent && this.breadcrumb.unshift(parent)
        const resolved = this.$router.resolve({ name: parent })
        parent = resolved.route.meta.parentName
      }
    },
    getItemId(item = '') {
      return `breadcrumb-link--${item.replace(/\s/, '')}`
    }
  }
}
</script>
