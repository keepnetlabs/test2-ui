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
import { mdiChevronRight } from "@mdi/js";
export default {
  name: "Breadcrumb",
  props: {
    baseName: {
      default: "Company",
      type: String
    }
  },
  data() {
    return {
      breadcrumb: [],
      mdiChevronRight
    };
  },
  mounted() {
    this.generate();
  },
  watch: {
    // call again the method if the route changes
    $route: "generate",
    "$store.state.common.activeTrainingType": "generate"
  },
  methods: {
    generate() {
      const type = this.$store?.state?.common?.activeTrainingType;
      const safeType = typeof type === "string" ? type : "";
      const currentRouteName =
        typeof this.$route?.name === "string" ? this.$route.name : "";
      const trainingReportName =
        !safeType || safeType.startsWith("SCORM") ? "Training Report" : `${safeType} Report`;
      const routeName =
        currentRouteName === "Training Report" ? trainingReportName : currentRouteName;
      this.breadcrumb = [routeName];
      let parent = this.$route.meta.parentName;
      while (parent) {
        parent && this.breadcrumb.unshift(parent);
        const resolved = this.$router.resolve({ name: parent });
        parent = resolved.route.meta.parentName;
      }
    },
    getItemId(item = "") {
      const safeItem = typeof item === "string" ? item : String(item || "");
      return `breadcrumb-link--${safeItem.replace(/\s/g, "")}`;
    }
  }
};
</script>
