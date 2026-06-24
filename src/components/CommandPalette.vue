<template>
  <ninja-keys
    ref="ninja"
    class="command-palette"
    placeholder="Go to or search…"
    hideBreadcrumbs
  ></ninja-keys>
</template>

<script>
// ninja-keys registers the <ninja-keys> custom element as a side effect.
import "ninja-keys";
import {
  buildNavigationActions,
  buildCommandActions,
  buildFilterActions,
  buildSettingsActions,
  buildAccountActions,
  buildHelpActions,
  buildRecentActions
} from "@/utils/commandPaletteActions";
import { recordRecentPage, getRecentPageNames } from "@/utils/recentPages";

export default {
  name: "CommandPalette",
  props: {
    // Dispatcher for account/session commands — the host view's
    // changeDropdownItem(value). When omitted, no "Account" section is shown.
    accountAction: {
      type: Function,
      default: null
    },
    // Visibility flags mirroring the avatar dropdown's conditional items.
    canSwitchCompany: {
      type: Boolean,
      default: false
    },
    canReturnToMainAccount: {
      type: Boolean,
      default: false
    },
    // Whitelabel gate for the documentation entry (mirrors the nav footer).
    helpDocumentationEnabled: {
      type: Boolean,
      default: true
    },
    // Support e-mail for the "Contact support" entry; empty hides it.
    supportEmail: {
      type: String,
      default: ""
    }
  },
  mounted() {
    const el = this.$refs.ninja;
    if (!el) {
      return;
    }
    // We pass inline SVG icons, so skip loading the Material Icons web font.
    el.noAutoLoadMdIcons = true;
    el.addEventListener("selected", this.onSelected);
    // Build the static part (Navigation + Actions) once: it changes only with
    // permissions, which are already loaded when this layout mounts (same
    // source the nav menu uses). Stored non-reactively — large + never mutated.
    // Order: pages lead (this is a "Go to" palette); commands sit last.
    const navigate = location => this.navigate(location);
    this.routes = this.$router.options.routes;
    this.staticActions = [
      ...buildNavigationActions(this.routes, this.$store, navigate),
      ...buildCommandActions(this.$store, navigate),
      ...buildFilterActions(this.$store, navigate),
      ...buildSettingsActions(this.$store, navigate),
      ...buildAccountActions(this.accountAction, {
        canSwitchCompany: this.canSwitchCompany,
        canReturnToMainAccount: this.canReturnToMainAccount
      }),
      ...buildHelpActions(this.openExternalUrl, {
        documentationEnabled: this.helpDocumentationEnabled,
        supportEmail: this.supportEmail
      })
    ];
    this.recordCurrentPage();
    this.applyData();
  },
  beforeDestroy() {
    const el = this.$refs.ninja;
    if (el) {
      el.removeEventListener("selected", this.onSelected);
    }
  },
  watch: {
    // Refresh "Recent" as the user navigates so it's current for the next open
    // (the global hotkey opens the element directly, bypassing our open()).
    "$route.name"() {
      this.recordCurrentPage();
      this.applyData();
    }
  },
  methods: {
    // Record the current page if it's a navigable target (authenticated,
    // named, no dynamic params — so it can be re-opened by name).
    recordCurrentPage() {
      const route = this.$route;
      if (
        route &&
        route.name &&
        route.meta &&
        route.meta.isAuthenticated &&
        Object.keys(route.params || {}).length === 0
      ) {
        recordRecentPage(route.name);
      }
    },
    // Recompose the list: Recent (fresh) + the memoized static part.
    applyData() {
      const el = this.$refs.ninja;
      if (!el) {
        return;
      }
      const navigate = location => this.navigate(location);
      const recent = buildRecentActions(this.routes, this.$store, navigate, {
        recentNames: getRecentPageNames(),
        currentName: this.$route && this.$route.name
      });
      el.data = [...recent, ...this.staticActions];
    },
    open() {
      if (this.$refs.ninja) {
        this.$refs.ninja.open();
      }
    },
    navigate(location) {
      // location is a vue-router target: a { name } object for pages or a
      // path string (possibly with a query) for actions.
      const isSameRoute =
        typeof location === "string"
          ? this.$route.fullPath === location || this.$route.path === location
          : this.$route.name === location.name;
      if (!isSameRoute) {
        this.$router.push(location).catch(() => {});
      }
    },
    // Opens an external URL (or mailto) the same way the nav-drawer footer
    // does: a transient anchor click. New tabs get noopener for safety;
    // mailto must stay in-page so the OS mail client takes over.
    openExternalUrl(url) {
      if (!url) {
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      if (url.indexOf("mailto:") !== 0) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      link.click();
    },
    onSelected() {
      // Reserved for future analytics / action handling.
    }
  }
};
</script>

<style>
/* Theme ninja-keys to match the app. Variables are exposed by the
   web component; we only override colors/typography here. */
.command-palette {
  --ninja-z-index: 2400; /* above Vuetify app-bar (default ~ 6-8) */
  --ninja-width: 640px;
  --ninja-font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  --ninja-font-size: 15px;
  /* Brand palette (matches app: primary #2196f3, text #383b41) */
  --ninja-accent-color: #2196f3;
  --ninja-overflow-background: rgba(56, 59, 65, 0.45);
  --ninja-text-color: #383b41;
  --ninja-keys-text-color: #383b41;
  --ninja-secondary-text-color: #757575;
  --ninja-secondary-background-color: #f5f7fa;
  --ninja-selected-background: #f1f8fe;
  --ninja-selected-text-color: #1173c1;
  --ninja-icon-color: #757575;
  --ninja-icon-size: 18px;
  --ninja-separate-border: 1px solid #e0e0e0;
  --ninja-modal-background: #ffffff;
  --ninja-modal-shadow: 0 12px 48px rgba(56, 59, 65, 0.18);
  --ninja-actions-height: 360px;
  --ninja-group-text-color: #9aa5b1;
  --ninja-footer-background: #fafafa;
  --ninja-placeholder-color: #9aa5b1;
}
</style>
