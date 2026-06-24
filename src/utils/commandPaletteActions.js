/**
 * Builds the ninja-keys action list from the Vue Router config.
 *
 * Phase 1 — navigation only:
 *  - Only authenticated, statically-navigable pages are included
 *    (routes with dynamic params like `:id` are detail pages and are skipped).
 *  - Entries respect the same permission gate the router guard uses
 *    (`meta.permissionStoreKey`), so the palette never lists a page the
 *    current user would be bounced away from.
 *  - Pages are grouped under their top-level area via `section`, mirroring
 *    the left-menu structure. Page titles use the route `name` as-is.
 */

import {
  mdiHome,
  mdiHook,
  mdiPhoneInTalk,
  mdiFlag,
  mdiBook,
  mdiBriefcaseVariant,
  mdiFlash,
  mdiAccountVoice,
  mdiEqualizer,
  mdiShieldHalfFull,
  mdiFileDocumentOutline,
  mdiPlus,
  mdiFilterVariant,
  mdiCog,
  mdiLock,
  mdiSwapHorizontal,
  mdiBackupRestore,
  mdiLogoutVariant,
  mdiBookOpenVariant,
  mdiLifebuoy,
  mdiCogOutline
} from "@mdi/js";

// Product documentation portal (same target the nav-drawer footer opens).
const DOCUMENTATION_URL = "https://doc.keepnetlabs.com";

// Company-settings deep-links. The Company Settings view is a single route
// with `?tab=<name>` deep-link support (see CompanySettings.vue), so each tab
// is surfaced here as its own command. Permission keys mirror the per-tab
// gates the view itself uses, so the palette never lists a tab the user
// cannot open. Titles follow the verb-led "Open …" convention.
const SETTINGS_ACTIONS = [
  {
    id: "settings-smtp",
    title: "Open SMTP settings",
    keywords: "company settings smtp mail server email sending outbound",
    tab: "smtp-settings",
    permission: "permissions/getSMTPSettingsSearchPermissions"
  },
  {
    id: "settings-direct-email-creation",
    title: "Open direct email creation",
    keywords:
      "company settings direct email creation dec google workspace microsoft",
    tab: "direct-email-creation",
    permission: "permissions/getDirectEmailCreationSearchPermissions"
  },
  {
    id: "settings-notification-templates",
    title: "Open notification templates",
    keywords: "company settings notification templates email messages",
    tab: "notification-template",
    permission: "permissions/getNotificationTemplatesSearchPermissions"
  },
  {
    id: "settings-microsoft-teams",
    title: "Open Microsoft Teams settings",
    keywords: "company settings microsoft teams integration chat",
    tab: "microsoft-teams-settings",
    permission: "permissions/getMicrosoftTeamsSettingsGetPermissions"
  },
  {
    id: "settings-google-provisioning",
    title: "Open Google user provisioning",
    keywords: "company settings google user provisioning sync directory",
    tab: "google-user-provisioning",
    permission: "permissions/getGoogleUserProvisionGetPermissions"
  },
  {
    id: "settings-ip-restrictions",
    title: "Open IP restrictions",
    keywords: "company settings ip restrictions allowlist network access",
    tab: "ip-restrictions",
    permission: "permissions/getCompanyIpRestrictionsGetPermissions"
  },
  {
    id: "settings-custom-api",
    title: "Open custom API settings",
    keywords: "company settings custom api rest token integration developer",
    tab: "custom-api",
    permission: "permissions/getRestApiSearchPermissions"
  },
  {
    id: "settings-white-labeling",
    title: "Open white labeling settings",
    keywords: "company settings white labeling branding logo theme",
    tab: "white-labeling",
    permission: "permissions/getWhiteLabelingGetPermissions"
  },
  {
    id: "settings-proxy",
    title: "Open proxy settings",
    keywords: "company settings proxy network gateway",
    tab: "proxy-settings",
    permission: "permissions/getProxySettingsSearchPermissions"
  },
  {
    id: "settings-saml",
    title: "Open SAML settings",
    keywords: "company settings saml sso single sign on identity provider",
    tab: "saml-settings",
    permission: "permissions/getSAMLIntegrationSearchPermissions"
  },
  {
    id: "settings-scim",
    title: "Open SCIM settings",
    keywords: "company settings scim provisioning identity sync",
    tab: "scim-settings",
    permission: "permissions/getSCIMSettingsSearchPermissions"
  },
  {
    id: "settings-siem",
    title: "Open SIEM integrations",
    keywords: "company settings siem integration logging splunk security",
    tab: "siem-integrations",
    permission: "permissions/getSIEMIntegrationSearchPermissions"
  },
  {
    id: "settings-ldap",
    title: "Open LDAP settings",
    keywords: "company settings ldap directory active directory sync",
    tab: "ldap-settings",
    permission: "permissions/getLDAPDetailPermission"
  },
  {
    id: "settings-allowed-list",
    title: "Open allowed list",
    keywords: "company settings allowed list allowlist safelist whitelist",
    tab: "allowed-list",
    permission: "permissions/getAllowListPermissionsSearch"
  },
  {
    id: "settings-ai-ally",
    title: "Open AI Ally settings",
    keywords: "company settings ai ally assistant",
    tab: "ai-ally-settings",
    permission: "permissions/getAIAllySettingsGetPermissions"
  },
  {
    id: "settings-privacy",
    title: "Open privacy settings",
    keywords: "company settings privacy data account",
    tab: "privacy",
    permission: "permissions/getAccountPrivacyPermission"
  },
  {
    id: "settings-agentic-ai",
    title: "Open Agentic AI settings",
    keywords: "company settings agentic ai automation",
    tab: "agentic-ai-settings",
    permission: "login/getHasAgenticAILicense"
  }
];

// Icon per top-level area, mirroring the left-menu icons in Main.vue.
// Callback / Smishing / Quishing / Threat Intelligence ship as custom SVGs in
// the menu and are embedded verbatim below (see CUSTOM_AREA_ICONS).
const AREA_ICONS = {
  Dashboard: mdiHome,
  "Phishing Simulator": mdiHook,
  "Vishing Simulator": mdiPhoneInTalk,
  "Threat Sharing": mdiFlag,
  "Awareness Educator": mdiBook,
  Company: mdiBriefcaseVariant,
  "Incident Responder": mdiFlash,
  "Phishing Reporter": mdiAccountVoice,
  Reports: mdiEqualizer,
  "Email Threat Simulator": mdiShieldHalfFull
};

// Exact menu icons that ship as custom SVG components (src/components/
// CustomIcons). Embedded verbatim so the palette matches the nav 1:1.
//  - fillMode "fill": paths have no fill attr and inherit the svg fill.
//  - fillMode "currentColor": inner markup uses fill="currentColor"; we set
//    the svg's color so it resolves to the same gray.
// NOTE: these are copies — a web component can't render Vue icon components, so
// the markup is duplicated from CustomIcons/{Callback,SmishingSimulator,
// ThreatIntelligence}.vue and assets/img/qr-code.svg. If those source icons
// change, update the matching entry here too (kept in sync by hand).
const CUSTOM_AREA_ICONS = {
  "Callback Simulator": {
    viewBox: "0 0 22 22",
    fillMode: "fill",
    inner:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.3333 14.2083C17.1875 14.2083 16.0875 14.025 15.0608 13.6858C14.74 13.585 14.3825 13.6583 14.1258 13.9058L12.1092 15.9225C9.515 14.6025 7.38833 12.485 6.06833 9.88167L8.085 7.85583C8.34167 7.6175 8.415 7.26 8.31417 6.93917C7.975 5.9125 7.79167 4.8125 7.79167 3.66667C7.79167 3.1625 7.37917 2.75 6.875 2.75H3.66667C3.1625 2.75 2.75 3.1625 2.75 3.66667C2.75 12.2742 9.72583 19.25 18.3333 19.25C18.8375 19.25 19.25 18.8375 19.25 18.3333V15.125C19.25 14.6208 18.8375 14.2083 18.3333 14.2083Z"></path>' +
      '<path d="M15.3263 6.13462L15.3263 4.44231L16.9763 4.44231C18.4927 4.44231 19.7263 5.70759 19.7263 7.26282C19.7263 8.81805 18.4927 10.0833 16.9763 10.0833L13.9169 10.0833C13.5664 8.93905 12.5244 8.10897 11.293 8.10897C9.77414 8.10897 8.54297 9.37177 8.54297 10.9295C8.54297 12.4872 9.77414 13.75 11.293 13.75C12.5244 13.75 13.5664 12.9199 13.9169 11.7756L16.9763 11.7756C19.4064 11.7756 21.3763 9.75519 21.3763 7.26282C21.3763 4.77045 19.4064 2.75 16.9763 2.75L10.3763 2.75L15.3263 6.13462ZM12.393 10.9295C12.393 11.5525 11.9005 12.0577 11.293 12.0577C10.6854 12.0577 10.193 11.5525 10.193 10.9295C10.193 10.3064 10.6854 9.80128 11.293 9.80128C11.9005 9.80128 12.393 10.3064 12.393 10.9295Z"></path>'
  },
  "Smishing Simulator": {
    viewBox: "0 0 22 22",
    fillMode: "fill",
    inner:
      '<path d="M15.2508 12.02C12.44 12.02 10.1546 9.7346 10.1546 6.92383H2V18.1367H4.54811V19.9995L8.09554 18.1367H19.3296V9.97915C18.3997 11.217 16.9173 12.02 15.2508 12.02ZM4.61755 8.96171H8.69634V9.98216H4.61755V8.96171ZM4.61755 11.0026H8.69634V12.0231H4.61755V11.0026ZM16.8479 16.0988H4.61755V15.0784H16.8509V16.0988H16.8479ZM16.8479 14.061H4.61755V13.0405H16.8509V14.061H16.8479Z"></path>' +
      '<path d="M16.543 10.5714C15.6946 10.5714 14.8463 10.5714 13.9979 10.5714C13.9828 10.5654 13.9677 10.5593 13.9496 10.5563C13.6839 10.4869 13.5118 10.2997 13.4937 10.0249C13.4786 9.7985 13.4847 9.56905 13.4847 9.3396C13.4847 9.27922 13.4665 9.25205 13.4092 9.23393C13.0439 9.11619 12.6786 8.99241 12.3163 8.87164C11.9328 8.74182 11.7034 8.4218 11.7034 8.01724C11.7034 7.2202 11.7004 6.42316 11.7064 5.62311C11.7064 5.42083 11.7155 5.21553 11.7487 5.01627C11.9057 4.06224 12.3706 3.28633 13.1465 2.7127C14.0492 2.04247 15.0606 1.84925 16.1505 2.11493C16.9868 2.32022 17.654 2.78818 18.1612 3.47955C18.5899 4.06526 18.8254 4.72342 18.8375 5.448C18.8496 6.30542 18.8435 7.16586 18.8435 8.0263C18.8435 8.41878 18.6111 8.74182 18.2367 8.86862C17.8714 8.99241 17.5031 9.11619 17.1347 9.23393C17.0774 9.25205 17.0562 9.27922 17.0593 9.3396C17.0623 9.53584 17.0683 9.72906 17.0593 9.9253C17.0532 10.031 17.0351 10.1427 16.9928 10.2393C16.9053 10.4295 16.7392 10.5231 16.543 10.5714ZM13.9617 7.95384C14.5504 7.95384 15.0304 7.47381 15.0334 6.88508C15.0365 6.29636 14.5564 5.81633 13.9647 5.81331C13.3699 5.81029 12.8899 6.29032 12.8929 6.88508C12.8929 7.47381 13.3729 7.95384 13.9617 7.95384ZM16.5822 7.95384C17.177 7.95082 17.654 7.46777 17.648 6.87301C17.645 6.28127 17.1619 5.80727 16.5732 5.81331C15.9814 5.81935 15.5044 6.29938 15.5074 6.8881C15.5135 7.47682 15.9965 7.95686 16.5822 7.95384ZM15.2689 7.71231C15.0878 7.99913 14.9006 8.26481 14.807 8.58181C14.7587 8.75088 14.8463 8.95014 15.0002 9.05581C15.1602 9.16751 15.3837 9.16751 15.5437 9.05581C15.6976 8.94712 15.7852 8.74786 15.7339 8.58181C15.6403 8.26783 15.4531 7.99913 15.2689 7.71231Z"></path>'
  },
  "Quishing Simulator": {
    viewBox: "0 0 22 22",
    fillMode: "fill",
    inner:
      '<g clip-path="url(#cp-qr-clip)">' +
      '<path d="M3.42224 2.44434C3.16291 2.44434 2.91421 2.54735 2.73084 2.73072C2.54747 2.91409 2.44446 3.16279 2.44446 3.42211V7.33323H7.33335V2.44434H3.42224ZM6.11112 6.111H3.66668V3.66656H6.11112V6.111Z" fill="#757575"></path>' +
      '<path d="M2.44446 18.5779C2.44446 18.8372 2.54747 19.0859 2.73084 19.2693C2.91421 19.4526 3.16291 19.5556 3.42224 19.5556H7.33335V14.6667H2.44446V18.5779ZM3.66668 15.889H6.11112V18.3334H3.66668V15.889Z" fill="#757575"></path>' +
      '<path d="M14.6666 19.5556H18.5777C18.8371 19.5556 19.0858 19.4526 19.2691 19.2693C19.4525 19.0859 19.5555 18.8372 19.5555 18.5779V14.6667H14.6666V19.5556ZM15.8888 15.889H18.3333V18.3334H15.8888V15.889Z" fill="#757575"></path>' +
      '<path d="M18.5777 2.44434H14.6666V7.33323H19.5555V3.42211C19.5555 3.16279 19.4525 2.91409 19.2691 2.73072C19.0858 2.54735 18.8371 2.44434 18.5777 2.44434ZM18.3333 6.111H15.8888V3.66656H18.3333V6.111Z" fill="#757575"></path>' +
      '<path d="M12.2223 6.11114V4.88892H9.77783V7.33336H11.0001V6.11114H12.2223Z" fill="#757575"></path>' +
      '<path d="M7.33337 7.33325H8.5556V8.55547H7.33337V7.33325Z" fill="#757575"></path>' +
      '<path d="M8.55554 8.55566H11V9.77789H8.55554V8.55566Z" fill="#757575"></path>' +
      '<path d="M12.2222 3.66656V4.88878H13.4444V2.44434H8.55554V4.88878H9.77776V3.66656H12.2222Z" fill="#757575"></path>' +
      '<path d="M2.44446 8.55566H3.66668V11.0001H2.44446V8.55566Z" fill="#757575"></path>' +
      '<path d="M7.33335 9.77789V11.0001H6.11112V8.55566H4.8889V11.0001H3.66668V12.2223H2.44446V13.4446H4.8889V12.2223H6.11112V13.4446H7.33335V12.2223H8.55557V9.77789H7.33335Z" fill="#757575"></path>' +
      '<path d="M12.2222 9.77775H13.4444V11H14.6667V9.77775H15.8889V8.55553H13.4444V6.11108H12.2222V7.33331H11V8.55553H12.2222V9.77775Z" fill="#757575"></path>' +
      '<path d="M11 18.3333H8.55554V19.5555H13.4444V18.3333H12.2222V17.1111H11V18.3333Z" fill="#757575"></path>' +
      '<path d="M13.4445 12.2223V11.0001H12.2223V9.77783H11.0001V11.0001H9.77783V12.2223H11.0001V13.4445H12.2223V12.2223H13.4445Z" fill="#757575"></path>' +
      '<path d="M18.3334 12.2222H19.5556V13.4444H18.3334V12.2222Z" fill="#757575"></path>' +
      '<path d="M13.4445 12.2222H17.1111V13.4444H13.4445V12.2222Z" fill="#757575"></path>' +
      '<path d="M18.3334 8.55566H17.1111V9.77789H15.8889V11.0001H17.1111V12.2223H18.3334V11.0001H19.5556V9.77789H18.3334V8.55566Z" fill="#757575"></path>' +
      '<path d="M12.2222 13.4443H13.4444V17.111H12.2222V13.4443Z" fill="#757575"></path>' +
      '<path d="M8.55554 17.1111H9.77776V15.8888H11V14.6666H9.77776V12.2222H8.55554V17.1111Z" fill="#757575"></path>' +
      "</g>" +
      '<defs><clipPath id="cp-qr-clip"><rect width="22" height="22" fill="white"></rect></clipPath></defs>'
  },
  "Threat Intelligence": {
    viewBox: "0 0 22 22",
    fillMode: "currentColor",
    inner:
      '<mask id="cp-ti-mask" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="20" height="20">' +
      '<g clip-path="url(#cp-ti-clip)">' +
      '<path d="M20.0173 17.7376L15.1996 12.7022C14.9915 12.4846 14.6449 12.4806 14.4317 12.6937L14.0604 13.0651L12.7628 11.6738C13.5649 10.6404 14.0433 9.34365 14.0433 7.93717C14.0433 4.57079 11.3045 1.83203 7.93815 1.83203C4.57176 1.83203 1.83301 4.57079 1.83301 7.93717C1.83301 11.3036 4.57176 14.0423 7.93815 14.0423C9.51113 14.0423 10.947 13.4442 12.0306 12.4637L13.3003 13.8252L12.9125 14.213C12.706 14.4195 12.7023 14.7532 12.9042 14.9642L17.7218 19.9996C17.9299 20.2171 18.2766 20.2212 18.4897 20.008L20.009 18.4887C20.2155 18.2823 20.2192 17.9486 20.0173 17.7376ZM5.27051 5.23372H8.49316C8.78979 5.23372 9.03027 5.47421 9.03027 5.77083C9.03027 6.06746 8.78979 6.30794 8.49316 6.30794H5.27051C4.97388 6.30794 4.7334 6.06746 4.7334 5.77083C4.7334 5.47421 4.97388 5.23372 5.27051 5.23372ZM5.27051 7.38216H5.80762C6.10424 7.38216 6.34473 7.62264 6.34473 7.91927C6.34473 8.2159 6.10424 8.45638 5.80762 8.45638H5.27051C4.97388 8.45638 4.7334 8.2159 4.7334 7.91927C4.7334 7.62264 4.97388 7.38216 5.27051 7.38216ZM8.49316 10.6406H5.27051C4.97388 10.6406 4.7334 10.4001 4.7334 10.1035C4.7334 9.80689 4.97388 9.56641 5.27051 9.56641H8.49316C8.78979 9.56641 9.03027 9.80689 9.03027 10.1035C9.03027 10.4001 8.78979 10.6406 8.49316 10.6406ZM10.6416 10.6764H10.1045C9.80786 10.6764 9.56738 10.436 9.56738 10.1393C9.56738 9.84269 9.80786 9.60221 10.1045 9.60221H10.6416C10.9382 9.60221 11.1787 9.84269 11.1787 10.1393C11.1787 10.436 10.9382 10.6764 10.6416 10.6764ZM10.6416 8.45638H7.41894C7.12232 8.45638 6.88184 8.2159 6.88184 7.91927C6.88184 7.62264 7.12232 7.38216 7.41894 7.38216H10.6416C10.9382 7.38216 11.1787 7.62264 11.1787 7.91927C11.1787 8.2159 10.9382 8.45638 10.6416 8.45638ZM10.6416 6.34375H10.1045C9.80786 6.34375 9.56738 6.10327 9.56738 5.80664C9.56738 5.51001 9.80786 5.26953 10.1045 5.26953H10.6416C10.9382 5.26953 11.1787 5.51001 11.1787 5.80664C11.1787 6.10327 10.9382 6.34375 10.6416 6.34375Z" fill="black"></path>' +
      "</g></mask>" +
      '<g mask="url(#cp-ti-mask)">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M-11.917 -11.918H33.9163V33.9154H-11.917V-11.918Z" fill="currentColor"></path>' +
      "</g><defs>" +
      '<clipPath id="cp-ti-clip"><rect width="18.3333" height="18.3333" fill="white" transform="translate(1.83301 1.83203)"></rect></clipPath>' +
      "</defs>"
  }
};

const ROOT_PARENT = "Dashboard";

// Match the left-menu's default icon color (neutral gray). We hardcode the
// fill rather than use currentColor so titles stay dark/readable while icons
// stay gray — the same contrast the navigation menu uses.
const ICON_COLOR = "#757575";

// margin-right gives the icon/title gap (ninja-keys only spaces its own font
// icons, not custom SVG); flex-shrink:0 keeps the glyph from squashing.
const ICON_STYLE_TAIL = "display:block;flex-shrink:0;margin-right:0.85em;";

// Wrap inner SVG markup in a consistently sized/spaced/colored <svg>.
// colorCss is either `fill:<c>` (paths inherit) or `color:<c>` (for inner
// markup that paints with currentColor).
function wrapSvg(viewBox, colorCss, inner) {
  return (
    '<svg viewBox="' +
    viewBox +
    '" width="18" height="18" aria-hidden="true" style="' +
    colorCss +
    ";" +
    ICON_STYLE_TAIL +
    '">' +
    inner +
    "</svg>"
  );
}

function svgIcon(path) {
  return wrapSvg("0 0 24 24", "fill:" + ICON_COLOR, '<path d="' + path + '"></path>');
}

// Wrap verbatim custom-icon markup (copied from CustomIcons/*.vue).
function rawSvgIcon(entry) {
  const colorCss =
    entry.fillMode === "currentColor"
      ? "color:" + ICON_COLOR
      : "fill:" + ICON_COLOR;
  return wrapSvg(entry.viewBox, colorCss, entry.inner);
}

function iconFor(area) {
  if (CUSTOM_AREA_ICONS[area]) {
    return rawSvgIcon(CUSTOM_AREA_ICONS[area]);
  }
  return svgIcon(AREA_ICONS[area] || mdiFileDocumentOutline);
}

// Flatten the router config into a name -> route lookup of app pages.
function collectPages(routes) {
  const byName = {};
  const walk = list => {
    list.forEach(route => {
      if (route.name && route.meta && route.meta.isAuthenticated) {
        byName[route.name] = route;
      }
      if (Array.isArray(route.children)) {
        walk(route.children);
      }
    });
  };
  walk(routes);
  return byName;
}

// Walk up parentName chain to find the top-level menu area for grouping.
function topAreaName(route, byName) {
  let current = route;
  let guard = 0;
  while (
    current &&
    current.meta &&
    current.meta.parentName &&
    current.meta.parentName !== ROOT_PARENT &&
    byName[current.meta.parentName] &&
    guard++ < 10
  ) {
    current = byName[current.meta.parentName];
  }
  return current ? current.name : route.name;
}

function isNavigable(route, store) {
  // Detail/edit pages carry dynamic segments — not directly navigable.
  if (typeof route.path === "string" && route.path.includes(":")) {
    return false;
  }
  // Mirror the router guard: Dashboard is always allowed.
  if (route.name === "Dashboard") {
    return true;
  }
  return hasPermission(store, route.meta && route.meta.permissionStoreKey);
}

// A page with no permission key is always allowed; otherwise gate on the
// store getter (same getters the router guard and left menu use).
function hasPermission(store, key) {
  if (!key) {
    return true;
  }
  return Boolean(store && store.getters && store.getters[key]);
}

// Search synonyms so intent queries find pages whose title doesn't contain the
// term (ninja-keys matches title + keywords). Keyed by route name.
const NAV_ALIASES = {
  "Target Users": "people recipients members audience employees",
  "Target Group Users": "people group members",
  "System Users": "admins accounts team staff",
  "Job Log": "logs jobs history background tasks",
  Audit: "audit logs activity trail",
  Companies: "tenants organizations accounts",
  "Company Settings": "configuration preferences",
  Settings: "configuration smtp domains dns sending",
  "Smishing Settings": "configuration sms sender",
  "Quishing Settings": "configuration qr",
  "Callback Settings": "configuration phone numbers",
  "Threat Intelligence": "threat intel feed cti",
  "Threat Sharing": "community share iocs",
  "Phishing Reporter": "report button add-in plugin outlook",
  "Incident Responder": "ir soc investigation triage",
  "Awareness Educator": "training courses learning lms education",
  "Training Library": "courses content catalog",
  Enrollments: "assignments learners enrolled",
  Certificates: "certificate completion",
  "Email Threat Simulator": "ets email security scan",
  Reports: "analytics dashboards metrics",
  "Executive Reports": "exec summary report",
  "Gamification Report": "leaderboard points badges ranking"
};

// Build one ninja-keys action for a page route.
// Navigate by name, not path: nested routes (e.g. Awareness Educator children)
// use relative paths that router.push would mis-resolve.
function pageAction(route, byName, navigate, opts) {
  const area = topAreaName(route, byName);
  const o = opts || {};
  return {
    id: (o.idPrefix || "") + route.name,
    title: route.name,
    section: o.section || area,
    // Enrich search: path + area (so "phishing" finds all phishing pages) +
    // intent synonyms.
    keywords: [route.path, area, NAV_ALIASES[route.name]]
      .filter(Boolean)
      .join(" "),
    icon: iconFor(area),
    handler: () => navigate({ name: route.name })
  };
}

/**
 * Builds the navigation pages, grouped by top-level area, Dashboard first.
 * @param {Array} routes  router.options.routes
 * @param {Object} store   vuex store (for permission getters)
 * @param {Function} navigate  (location) => void — a vue-router push target
 *   (route name object for pages, path string for actions)
 * @returns {Array} INinjaAction[]
 */
export function buildNavigationActions(routes, store, navigate) {
  const byName = collectPages(routes);

  return Object.keys(byName)
    .map(name => byName[name])
    .filter(route => isNavigable(route, store))
    .map(route => pageAction(route, byName, navigate))
    .sort((a, b) => {
      // Keep areas together, Dashboard first, then alphabetical within area.
      if (a.section !== b.section) {
        if (a.section === ROOT_PARENT) return -1;
        if (b.section === ROOT_PARENT) return 1;
        return a.section.localeCompare(b.section);
      }
      return a.title.localeCompare(b.title);
    });
}

/**
 * Builds the "Recent" section from previously-visited page names, newest
 * first. Skips the current page and anything no longer visible/navigable.
 * @param {Array} routes  router.options.routes
 * @param {Object} store   vuex store (for permission getters)
 * @param {Function} navigate  (location) => void
 * @param {Object} opts  { recentNames: string[], currentName: string }
 * @returns {Array} INinjaAction[]
 */
export function buildRecentActions(routes, store, navigate, opts) {
  const o = opts || {};
  const recentNames = o.recentNames || [];
  const byName = collectPages(routes);

  return recentNames
    .map(name => byName[name])
    .filter(Boolean) // route still exists and is an app page
    .filter(route => route.name !== o.currentName) // not the page you're on
    .filter(route => isNavigable(route, store))
    .map(route =>
      pageAction(route, byName, navigate, {
        idPrefix: "recent:",
        section: "Recent"
      })
    );
}

// Phase 2 — route-less "do something" commands grouped under "Actions".
// Each maps to an existing entry point in the app; permission gates mirror the
// ones used by the corresponding menu / page.
// The `?status=create` query is handled by each campaign-manager view's
// $route.query watcher, which opens the add-campaign modal then strips the
// query. (Adding a new create action requires that view to handle "create".)
const COMMAND_ACTIONS = [
  {
    id: "action-new-phishing-campaign",
    title: "Create phishing campaign",
    keywords: "new create phishing simulation campaign",
    path: "/phishing-simulator/campaign-manager?status=create",
    permission: "permissions/getCampaignManagerLeftMenuPermissions"
  },
  {
    id: "action-new-smishing-campaign",
    title: "Create smishing campaign",
    keywords: "new create smishing sms campaign",
    path: "/smishing-simulator/campaign-manager?status=create",
    permission: "permissions/getSmishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "action-new-callback-campaign",
    title: "Create callback campaign",
    keywords: "new create callback campaign",
    path: "/callback-simulator/campaign-manager?status=create",
    permission: "permissions/getCallbackCampaignManagerLeftMenuPermissions"
  },
  {
    id: "action-new-quishing-campaign",
    title: "Create quishing campaign",
    keywords: "new create quishing qr campaign",
    path: "/quishing-simulator/campaign-manager?status=create",
    permission: "permissions/getQuishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "action-new-executive-report",
    title: "Create executive report",
    keywords: "new create executive report",
    path: "/reports/executive-reports/new",
    permission: "permissions/getReportsLeftMenuPermissions"
  },
  {
    id: "action-new-investigation",
    title: "Start investigation",
    keywords: "new create start incident responder investigation soc",
    path: "/incident-responder/investigations?status=create",
    permission: "permissions/getInvestigationsSearchPermission"
  }
];

/**
 * Builds the "Actions" command list (route-less verbs).
 * @param {Object} store    vuex store (for permission getters)
 * @param {Function} navigate  (path) => void
 * @returns {Array} INinjaAction[]
 */
export function buildCommandActions(store, navigate) {
  return COMMAND_ACTIONS.filter(action =>
    hasPermission(store, action.permission)
  ).map(action => ({
    id: action.id,
    title: action.title,
    section: "Actions",
    keywords: action.keywords,
    icon: svgIcon(mdiPlus),
    handler: () => navigate(action.path)
  }));
}

// Phase 3 — contextual filter presets. Each navigates to a campaign-manager
// page with a `?filterStatus=` query that the page's $route.query watcher
// applies as a TRANSIENT filter (does not touch the user's saved-filter
// localStorage). Covers all four simulators.
const FILTER_ACTIONS = [
  {
    id: "filter-phishing-running",
    title: "Show running phishing campaigns",
    keywords: "filter show phishing campaign manager running active status",
    path: "/phishing-simulator/campaign-manager?filterStatus=Running",
    permission: "permissions/getCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-phishing-completed",
    title: "Show completed phishing campaigns",
    keywords: "filter show phishing campaign manager completed finished status",
    path: "/phishing-simulator/campaign-manager?filterStatus=Completed",
    permission: "permissions/getCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-smishing-running",
    title: "Show running smishing campaigns",
    keywords: "filter show smishing sms campaign manager running active status",
    path: "/smishing-simulator/campaign-manager?filterStatus=Running",
    permission: "permissions/getSmishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-smishing-completed",
    title: "Show completed smishing campaigns",
    keywords: "filter show smishing sms campaign manager completed finished status",
    path: "/smishing-simulator/campaign-manager?filterStatus=Completed",
    permission: "permissions/getSmishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-callback-running",
    title: "Show running callback campaigns",
    keywords: "filter show callback campaign manager running active status",
    path: "/callback-simulator/campaign-manager?filterStatus=Running",
    permission: "permissions/getCallbackCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-callback-completed",
    title: "Show completed callback campaigns",
    keywords: "filter show callback campaign manager completed finished status",
    path: "/callback-simulator/campaign-manager?filterStatus=Completed",
    permission: "permissions/getCallbackCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-quishing-running",
    title: "Show running quishing campaigns",
    keywords: "filter show quishing qr campaign manager running active status",
    path: "/quishing-simulator/campaign-manager?filterStatus=Running",
    permission: "permissions/getQuishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-quishing-completed",
    title: "Show completed quishing campaigns",
    keywords: "filter show quishing qr campaign manager completed finished status",
    path: "/quishing-simulator/campaign-manager?filterStatus=Completed",
    permission: "permissions/getQuishingCampaignManagerLeftMenuPermissions"
  },
  {
    id: "filter-investigations-running",
    title: "Show running investigations",
    keywords: "filter show incident responder investigations running active status",
    path: "/incident-responder/investigations?filterStatus=Running",
    permission: "permissions/getInvestigationsSearchPermission"
  },
  {
    id: "filter-investigations-finished",
    title: "Show finished investigations",
    keywords: "filter show incident responder investigations finished completed status",
    path: "/incident-responder/investigations?filterStatus=Finished",
    permission: "permissions/getInvestigationsSearchPermission"
  }
];

/**
 * Builds the "Filters" command list (preset list filters).
 * @param {Object} store    vuex store (for permission getters)
 * @param {Function} navigate  (path) => void
 * @returns {Array} INinjaAction[]
 */
export function buildFilterActions(store, navigate) {
  return FILTER_ACTIONS.filter(action =>
    hasPermission(store, action.permission)
  ).map(action => ({
    id: action.id,
    title: action.title,
    section: "Filters",
    keywords: action.keywords,
    icon: svgIcon(mdiFilterVariant),
    handler: () => navigate(action.path)
  }));
}

// Account / session commands. These mirror the user-avatar dropdown in
// Main.vue; each `value` is dispatched through that view's existing
// `changeDropdownItem(value)` handler, so behaviour stays identical to the
// menu (no duplicated logic). Switch-company / return-to-main-account are
// conditional in the menu and gated the same way here (see `opts`).
const ACCOUNT_ACTIONS = [
  {
    id: "account-settings",
    title: "Open settings",
    keywords: "account settings preferences configuration profile",
    value: "changeSettings",
    icon: mdiCog
  },
  {
    id: "account-change-password",
    title: "Change password",
    keywords: "account security password credentials reset",
    value: "changePassword",
    icon: mdiLock
  },
  {
    id: "account-switch-company",
    title: "Switch company",
    keywords: "account switch change company tenant organization",
    value: "switchCompany",
    icon: mdiSwapHorizontal,
    visibleKey: "canSwitchCompany"
  },
  {
    id: "account-return-to-main-account",
    title: "Return to main account",
    keywords: "account return main parent company back",
    value: "returnToMainAccount",
    icon: mdiBackupRestore,
    visibleKey: "canReturnToMainAccount"
  },
  {
    id: "account-logout",
    title: "Log out",
    keywords: "account log out logout sign out exit session",
    value: "logout",
    icon: mdiLogoutVariant
  }
];

/**
 * Builds the "Account" command list (session / account verbs).
 * @param {Function} run   (value) => void — the view's changeDropdownItem
 * @param {Object} [opts]  { canSwitchCompany, canReturnToMainAccount }
 *                         visibility flags mirroring the avatar dropdown
 * @returns {Array} INinjaAction[]
 */
export function buildAccountActions(run, opts) {
  if (typeof run !== "function") {
    return [];
  }
  const flags = opts || {};
  return ACCOUNT_ACTIONS.filter(
    action => !action.visibleKey || Boolean(flags[action.visibleKey])
  ).map(action => ({
    id: action.id,
    title: action.title,
    section: "Account",
    keywords: action.keywords,
    icon: svgIcon(action.icon),
    handler: () => run(action.value)
  }));
}

/**
 * Builds the "Help" command list (documentation + support).
 * @param {Function} openUrl  (url) => void — opens an external URL / mailto
 * @param {Object} [opts]  { documentationEnabled, supportEmail }
 *                         documentationEnabled defaults to true (mirrors the
 *                         nav-drawer footer's whitelabel gate); the support
 *                         entry only appears when a support e-mail is set.
 * @returns {Array} INinjaAction[]
 */
export function buildHelpActions(openUrl, opts) {
  if (typeof openUrl !== "function") {
    return [];
  }
  const o = opts || {};
  const actions = [];
  if (o.documentationEnabled !== false) {
    actions.push({
      id: "help-documentation",
      title: "Open documentation",
      section: "Help",
      keywords: "help documentation docs guide manual knowledge base",
      icon: svgIcon(mdiBookOpenVariant),
      handler: () => openUrl(DOCUMENTATION_URL)
    });
  }
  if (o.supportEmail) {
    actions.push({
      id: "help-contact-support",
      title: "Contact support",
      section: "Help",
      keywords: "help contact support email assistance ticket",
      icon: svgIcon(mdiLifebuoy),
      handler: () => openUrl("mailto:" + o.supportEmail)
    });
  }
  return actions;
}

/**
 * Builds the "Settings" command list (Company Settings tab deep-links).
 * @param {Object} store    vuex store (for permission getters)
 * @param {Function} navigate  (path) => void
 * @returns {Array} INinjaAction[]
 */
export function buildSettingsActions(store, navigate) {
  return SETTINGS_ACTIONS.filter(action =>
    hasPermission(store, action.permission)
  ).map(action => ({
    id: action.id,
    title: action.title,
    section: "Settings",
    keywords: action.keywords,
    icon: svgIcon(mdiCogOutline),
    handler: () =>
      navigate("/company/company-settings?tab=" + action.tab)
  }));
}
