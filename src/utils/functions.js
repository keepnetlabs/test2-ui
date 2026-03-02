import store from "@/store";
import labels from "@/model/constants/labels";
import { COMMON_CONSTANTS } from "@/model/constants/commonConstants";
export function getBtnStatusColor(type) {
  let _type = type;
  if (typeof _type === "boolean" && _type) {
    _type = "yes";
  } else if (typeof _type === "boolean" && !_type) {
    _type = "no";
  }
  if (typeof _type !== "number") {
    _type = _type.toLowerCase();
  }

  const statusColorMap = {
    pending: "#00bcd4",
    clean: "#00bcd4",
    active: "#1173C1",
    deferred: "#B6791D",
    dropped: "#F56C6C",
    deleted: "#F56C6C",
    blocked: "#F56C6C",
    rejected: "#757575",
    inactive: "#b83a3a",
    sending: "#1173C1",
    scheduled: "#1173C1",
    finished: "#217124",
    executed: "#217124",
    warning: "#b6791d",
    processing: "#1173C1",
    processed: "#217124",
    delivered: "#217124",
    clicked: "#217124",
    opened: "#217124",
    bounced: "#F56C6C",
    blocks: "#F56C6C",
    spam_report: "#F56C6C",
    malicious: "#b83a3a",
    unsubscribes: "#B6791D",
    group_unsubscribe: "#B6791D",
    group_resubscribe: "#B6791D",
    nonmalicious: "#00bcd4",
    offline: "#B83A3A",
    expired: "#B6791D",
    paused: "#B6791D",
    passive: "#b83a3a",
    cancelled: "#B6791D",
    canceled: "#B6791D",
    quequed: "#0198AC", // Assuming this was a typo for 'queued'
    queued: "#0198AC",
    phishing: "#b83a3a",
    idle: "#0198AC",
    excluded: "#757575",
    disabled: "#b83a3a",
    "network error": "#b83a3a",
    quedued: "#00bcd4", // Assuming this was a typo for 'queued'
    "in queue": "#1173C1",
    inqueue: "#1173C1", // Added to handle both 'in queue' and 'inqueue'
    "waiting for approval": "#1173C1",
    none: "#00bcd4",
    running: "#1173C1",
    "not running": "#B83A3A", // Corrected from #1173C1 to #B83A3A as per previous logic
    "not delivered": "#757575",
    completed: "#217124",
    complete: "#217124",
    // 'finished' is already defined
    successful: "#217124",
    success: "#217124",
    online: "#217124",
    deactivated: "#757575",
    notinstalled: "#757575",
    "user unavailable": "#757575",
    completedwitherror: "#6d6d6d",
    itemnotfound: "#fafafa",
    failed: "#b83a3a",
    "n/a": "#00bcd4",
    stopped: "#b83a3a",
    error: "#B83A3A",
    exist: "#1173C1",
    new: "#217124",
    undetected: "#1173C1",
    listed: "#b83a3a",
    low: "#0198AC",
    verylow: "#757575",
    custom: "#f56c6c",
    system: "#1173C1",
    yes: "#1173c1",
    no: "#757575",
    easy: "rgba(33, 113, 36, 1)",
    medium: "rgba(17, 115, 193, 1)",
    hard: "rgba(184, 58, 58, 1)",
    "no match": "#757575",
    "not in use": "#757575",
    "in use": "#1173C1",
    passed: "#217124",
    "not started": "#E6A23C",
    notstarted: "#E6A23C",
    "not completed": "#F56C6C",
    notcompleted: "#F56C6C",
    "not responded": "#E6A23C",
    notresponded: "#E6A23C"
  };

  if (!_type) return "#00bcd4"; // Default for empty or null type after processing

  return statusColorMap[_type] || "#00bcd4"; // Return color from map or default
}

export function getBtnPriorityColor(type) {
  if (type.toLowerCase() === "active") return "#00bcd4";
  if (type.toLowerCase() === "inactive") return "#b83a3a";
  if (type.toLowerCase() === "low") return "#0198AC";
  if (type.toLowerCase() === "very low") return "#757575";
  if (type.toLowerCase() === "verylow") return "#757575";
  if (type.toLowerCase() === "medium") return "#1173C1";
  if (type.toLowerCase() === "high") return "#b6791d";
  if (type.toLowerCase() === "very high") return "#b83a3a";
  if (type.toLowerCase() === "veryhigh") return "#b83a3a";
  if (type.toLowerCase() === "n/a") return "#00bcd4";
  if (type.toLowerCase() === "error") return "#b83a3a";
  if (type.toLowerCase() === "exist") return "#1173C1";
  if (type.toLowerCase() === "new") return "#217124";
  if (type.toLowerCase() === "excluded") return "#757575";
}

export function getTextColor(type) {
  if (type.toLowerCase() === "open") return "#f56c6c";
  if (type.toLowerCase() === "in progress") return "#2196f3";
  if (type.toLowerCase() === "false positive") return "#e6a23c";
  if (type.toLowerCase() === "closed") return "#43a047";
  if (type.toLowerCase() === "very high") return "#43a047";
  if (type.toLowerCase() === "medium") return "#00bcd4";
  if (type.toLowerCase() === "low") return "#e6a23c";
  if (type.toLowerCase() === "very low") return "#f56c6c";
}

export function getDataTableFieldLabel(field = "") {
  const defField = String(field).trim();
  const normalizedField = defField
    .toLowerCase()
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\s+/g, " ");
  const compactField = normalizedField.replaceAll(/\s+/g, "");

  const fieldMap = {
    beinganalyzed: "Being Analyzed",
    inprogress: "In Progress",
    falsepositive: "False Positive",
    nonmalicious: "Clean",
    veryhigh: "Very High",
    verylow: "Very Low",
    completedwitherror: "Completed with error",
    itemnotfound: "Item not found",
    running: "Running",
    "not running": "Not Running",
    "n/a": "N/A",
    notinstalled: "Not Installed",
    waitingresponse: "Waiting Response",
    unknown: "N/A",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    "not in use": "Not In Use",
    "in use": "In Use",
    "waiting for approval": "Waiting for Approval"
  };
  if (fieldMap[normalizedField]) {
    return fieldMap[normalizedField];
  }
  if (fieldMap[compactField]) {
    return fieldMap[compactField];
  }
  if (/^[A-Za-z0-9]+$/.test(defField) && /[a-z][A-Z]/.test(defField)) {
    return defField.replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2");
  }
  return defField;
}

export function isOwnerOrMember(membershipStatusId) {
  return membershipStatusId === 1 || membershipStatusId === 2;
}

export function isOwner(membershipStatusId) {
  return membershipStatusId == 1;
}

export function isPostedByMe(isPostedByMe) {
  return isPostedByMe;
}

export function setGlobalUserData(userData) {
  let currentUserData = {};
  currentUserData = {
    id: userData.user_company_resourceid,
    name: userData.user_company_name,
    surname: userData.family_name,
    email: userData.email,
    fullName: userData.name,
    countryCode: null,
    phone: userData.phone_number,
    firstName: userData.given_name,
    status: null,
    userCompany: {
      id: userData.user_company_resourceid,
      name: userData.user_company_name,
      logoPath: userData.user_company_logopath,
      businessCategoryId: userData.user_company_industry_resourceid,
      resellerId: userData.user_company_parentcompany_resourceid,
      timeZone: userData?.user_dateformat,
      isDemo: false,
      timeFormat: userData?.user_timeformat
    },
    role: {
      name: userData?.role?.toString?.() || ""
    }
  };
  localStorage.setItem("companyId", currentUserData.userCompany.id);
  localStorage.setItem("companyRequestId", currentUserData.userCompany.id);
  localStorage.setItem("companyResourceId", currentUserData.userCompany.id);
  localStorage.setItem("companyName", currentUserData.userCompany.name);
  localStorage.setItem("userId", currentUserData.id);
  localStorage.setItem(
    "businessCatId",
    currentUserData.userCompany.businessCategoryId
  );
  localStorage.setItem("userName", userData.name || currentUserData.name);
  localStorage.setItem("hostId", userData["user_id"]);
  return currentUserData;
}

export function strReverse(oldString = "") {
  let newString = "";
  for (let s = 0; s < oldString.length; s++) {
    newString = oldString.charAt(s) + newString;
  }
  return newString;
}

export function passwordComplexity(pwd) {
  let nScore = 0,
    nLength = 0,
    nAlphaUC = 0,
    nAlphaLC = 0,
    nNumber = 0,
    nSymbol = 0,
    nMidChar = 0,
    nRequirements = 0,
    nUnqChar = 0,
    nRepChar = 0,
    nRepInc = 0,
    nConsecAlphaUC = 0,
    nConsecAlphaLC = 0,
    nConsecNumber = 0,
    nConsecSymbol = 0,
    nConsecCharType = 0,
    nSeqAlpha = 0,
    nSeqNumber = 0,
    nSeqSymbol = 0,
    nSeqChar = 0,
    nReqChar = 0;
  let nMultMidChar = 2,
    nMultConsecAlphaUC = 2,
    nMultConsecAlphaLC = 2,
    nMultConsecNumber = 2;
  let nMultSeqAlpha = 3,
    nMultSeqNumber = 3,
    nMultSeqSymbol = 3;
  let nMultLength = 4,
    nMultNumber = 4;
  let nMultSymbol = 6;
  let nTmpAlphaUC = "",
    nTmpAlphaLC = "",
    nTmpNumber = "",
    nTmpSymbol = "";
  const sAlphas = "abcdefghijklmnopqrstuvwxyz";
  const sNumerics = "01234567890";
  const sSymbols = ")!@#$%^&*()";
  const nMinPwdLen = 8;
  if (pwd) {
    nScore = Number.parseInt(pwd.length * nMultLength);
    nLength = pwd.length;
    let arrPwd = pwd.replaceAll(/\s+/g, "")?.split(/\s*/);
    let arrPwdLen = arrPwd.length;

    /* Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches */
    for (let a = 0; a < arrPwdLen; a++) {
      if (arrPwd[a].match(/[A-Z]/g)) {
        if (nTmpAlphaUC !== "") {
          if (nTmpAlphaUC + 1 == a) {
            nConsecAlphaUC++;
            nConsecCharType++;
          }
        }
        nTmpAlphaUC = a;
        nAlphaUC++;
      } else if (arrPwd[a].match(/[a-z]/g)) {
        if (nTmpAlphaLC !== "") {
          if (nTmpAlphaLC + 1 == a) {
            nConsecAlphaLC++;
            nConsecCharType++;
          }
        }
        nTmpAlphaLC = a;
        nAlphaLC++;
      } else if (arrPwd[a].match(/\d/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++;
        }
        if (nTmpNumber !== "") {
          if (nTmpNumber + 1 == a) {
            nConsecNumber++;
            nConsecCharType++;
          }
        }
        nTmpNumber = a;
        nNumber++;
      } else if (arrPwd[a].match(/\W/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++;
        }
        if (nTmpSymbol !== "") {
          if (nTmpSymbol + 1 == a) {
            nConsecSymbol++;
            nConsecCharType++;
          }
        }
        nTmpSymbol = a;
        nSymbol++;
      }
      /* Internal loop through password to check for repeat characters */
      let bCharExists = false;
      for (let b = 0; b < arrPwdLen; b++) {
        if (arrPwd[a] == arrPwd[b] && a != b) {
          /* repeat character exists */
          bCharExists = true;
          /*
      Calculate icrement deduction based on proximity to identical characters
      Deduction is incremented each time a new match is discovered
      Deduction amount is based on total password length divided by the
      difference of distance between currently selected match
      */
          nRepInc += Math.abs(arrPwdLen / (b - a));
        }
      }
      if (bCharExists) {
        nRepChar++;
        nUnqChar = arrPwdLen - nRepChar;
        nRepInc = nUnqChar ? Math.ceil(nRepInc / nUnqChar) : Math.ceil(nRepInc);
      }
    }

    /* Check for sequential alpha string patterns (forward and reverse) */
    for (let s = 0; s < 23; s++) {
      let sFwd = sAlphas.substring(s, Number.parseInt(s + 3));
      let sRev = strReverse(sFwd);
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqAlpha++;
        nSeqChar++;
      }
    }
    /* Check for sequential numeric string patterns (forward and reverse) */
    for (let s = 0; s < 8; s++) {
      let sFwd = sNumerics.substring(s, Number.parseInt(s + 3));
      let sRev = strReverse(sFwd);
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqNumber++;
        nSeqChar++;
      }
    }
    /* Check for sequential symbol string patterns (forward and reverse) */
    for (let s = 0; s < 8; s++) {
      let sFwd = sSymbols.substring(s, Number.parseInt(s + 3));
      let sRev = strReverse(sFwd);
      if (
        pwd.toLowerCase().indexOf(sFwd) !== -1 ||
        pwd.toLowerCase().indexOf(sRev) !== -1
      ) {
        nSeqSymbol++;
        nSeqChar++;
      }
    }

    /* General point assignment */
    if (nAlphaUC > 0 && nAlphaUC < nLength) {
      nScore = Number.parseInt(nScore + (nLength - nAlphaUC) * 2);
    }
    if (nAlphaLC > 0 && nAlphaLC < nLength) {
      nScore = Number.parseInt(nScore + (nLength - nAlphaLC) * 2);
    }
    if (nNumber > 0 && nNumber < nLength) {
      nScore = Number.parseInt(nScore + nNumber * nMultNumber);
    }
    if (nSymbol > 0) {
      nScore = Number.parseInt(nScore + nSymbol * nMultSymbol);
    }
    if (nMidChar > 0) {
      nScore = Number.parseInt(nScore + nMidChar * nMultMidChar);
    }

    /* Point deductions for poor practices */
    if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {
      // Only Letters
      nScore = Number.parseInt(nScore - nLength);
    }
    if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {
      // Only Numbers
      nScore = Number.parseInt(nScore - nLength);
    }
    if (nRepChar > 0) {
      // Same character exists more than once
      nScore = Number.parseInt(nScore - nRepInc);
    }
    if (nConsecAlphaUC > 0) {
      // Consecutive Uppercase Letters exist
      nScore = Number.parseInt(nScore - nConsecAlphaUC * nMultConsecAlphaUC);
    }
    if (nConsecAlphaLC > 0) {
      // Consecutive Lowercase Letters exist
      nScore = Number.parseInt(nScore - nConsecAlphaLC * nMultConsecAlphaLC);
    }
    if (nConsecNumber > 0) {
      // Consecutive Numbers exist
      nScore = Number.parseInt(nScore - nConsecNumber * nMultConsecNumber);
    }
    if (nSeqAlpha > 0) {
      // Sequential alpha strings exist (3 characters or more)
      nScore = Number.parseInt(nScore - nSeqAlpha * nMultSeqAlpha);
    }
    if (nSeqNumber > 0) {
      // Sequential numeric strings exist (3 characters or more)
      nScore = Number.parseInt(nScore - nSeqNumber * nMultSeqNumber);
    }
    if (nSeqSymbol > 0) {
      // Sequential symbol strings exist (3 characters or more)
      nScore = Number.parseInt(nScore - nSeqSymbol * nMultSeqSymbol);
    }
    /* Determine if mandatory requirements have been met and set image indicators accordingly */
    const arrChars = [nLength, nAlphaUC, nAlphaLC, nNumber, nSymbol];
    const arrCharsIds = [
      "nLength",
      "nAlphaUC",
      "nAlphaLC",
      "nNumber",
      "nSymbol"
    ];
    const arrCharsLen = arrChars.length;
    for (let c = 0; c < arrCharsLen; c++) {
      let minVal =
        arrCharsIds[c] === "nLength" ? Number.parseInt(nMinPwdLen - 1) : 0;
      if (
        arrChars[c] === Number.parseInt(minVal + 1) ||
        arrChars[c] > Number.parseInt(minVal + 1)
      ) {
        nReqChar++;
      }
    }
    nRequirements = nReqChar;
    let nMinReqChars = pwd.length >= nMinPwdLen ? 3 : 4;
    if (nRequirements > nMinReqChars) {
      nScore = Number.parseInt(nScore + nRequirements * 2);
    }
    /* Determine complexity based on overall score */
    if (nScore > 100) {
      nScore = 100;
    } else if (nScore < 0) {
      nScore = 0;
    }
    return nScore;
  }
}

const DEFAULT_SCROLL_OPTIONS = { behavior: "smooth", block: "center", inline: "center" }

export function scrollToComponent(el, options = DEFAULT_SCROLL_OPTIONS) {
  if (!el) return;

  if (globalThis.safari || navigator.vendor.match(/apple/i)) {
    el.scrollIntoView();
  } else {
    el.scrollIntoView(options);
  }
}

export function setSafariClusterFix(obj = {}, param = "") {
  if (obj.column.property === param) {
    return "safari-cluster-icon-fix";
  }
}
export function handleIsSafari() {
  return globalThis.safari || navigator.vendor.match(/apple/i);
}

export function incidenPostReviewElementBind(url, id, rootId, isReview) {
  let els;
  if (url.url === "Hidden by Owner" || url.isHidden) {
    els = document
      .getElementById(rootId || "last-preview-body-shadow-root")
      ?.shadowRoot?.querySelectorAll("[data-post-item-hidden]");
    if (!els.length) {
      els = document
        .getElementById(rootId || "last-preview-body-shadow-root")
        ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]');
    }
  } else {
    els = document
      .getElementById(rootId || "last-preview-body-shadow-root")
      ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]');
  }

  if (els?.length) {
    for (let i = 0, l = els.length; i < l; i++) {
      let el = els[i];
      el.setAttribute("target", "_blank");
      if (url.isHidden) {
        url.isFlagged = false;
        el.style.backgroundColor = "#757575";
        el.style.color = "#ffffff";
        el.style.position = "relative";
        el.innerHTML = "Hidden by Owner";
      } else if (!!url && !!url.name) {
        el.innerHTML = url.name;
        el.setAttribute("href", url.url);
        el.style.backgroundColor = "inherit";
        el.style.color = "inherit";
      } else if (!!url && !!url.urlHtml) {
        el.innerHTML = url.urlHtml;
        el.setAttribute("href", url.url);
        el.style.backgroundColor = "inherit";
        el.style.color = "inherit";
      }
      if (url.isFlagged) {
        el.setAttribute("target", "_blank");
        el.setAttribute(
          "data-title",
          "This link has been reported as a phishing"
        );
        el.style.backgroundColor = "#f3e1e5";
        el.style.color = "#bb2a45";
        el.innerHTML =
          el.innerHTML + `<span class="malicious-link mdi mdi-alert"></span>`;
        el.style.cursor = "default";
        el.setAttribute("onclick", "return false;");
        //el.appendChild(iEl)
      } else if (!url.isFlagged && !url.isHidden) {
        !isReview && (el.innerHTML = url.urlHtml || url.name || url.url);
        el.style.backgroundColor = "inherit";
        el.style.color = "inherit";
      }
      if (url.isHidden) {
        el.setAttribute("target", "_self");
      }
    }
  }
  let hiddenEls = document.getElementsByClassName(url.url);
  if (hiddenEls?.length) {
    for (let i = 0, l = hiddenEls.length; i < l; i++) {
      let hiddenEl = hiddenEls[i];
      hiddenEl.setAttribute("target", "_blank");
      if (url.isHidden) {
        hiddenEl.innerHTML = "Hidden by Owner";
        hiddenEl.setAttribute("href", "#");
      }
      if (url.isFlagged) {
        hiddenEl.classList.add("malicious-link");
        let iEl = document.createElement("span");
        iEl.className +=
          "red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light";
        hiddenEl.appendChild(iEl);
      }
    }
  }
}

export function datePrettier(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-US", options);
}

export function getTimeZone(isDate, fallback) {
  let timeZone =
    localStorage.getItem("selectedDateFormat") || fallback?.dateFormat || "";
  let timeFormat =
    localStorage.getItem("selectedTimeFormat") || fallback?.timeFormat || "";
  let is12H = timeFormat === "12h";
  timeFormat = is12H ? "hh" : "HH";

  if (isDate) {
    if (timeZone === "DD/MM/YYYY") timeZone = `dd/MM/yyyy`;
    //timeZone = `yyyy-MM-dd HH:mm:ss`
    if (timeZone === "MM/DD/YYYY") timeZone = `MM/dd/yyyy`;

    //timeZone = `yyyy-MM-dd HH:mm:ss`
    if (timeZone === "YYYY/MM/DD") timeZone = `yyyy/MM/dd`;
    //timeZone = `yyyy-MM-dd HH:mm:ss`
    return timeZone;
  }
  const timeZoneRightText = is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`;
  if (timeZone === "DD/MM/YYYY") timeZone = `dd/MM/yyyy ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`
  if (timeZone === "MM/DD/YYYY") timeZone = `MM/dd/yyyy ${timeZoneRightText}`;

  //timeZone = `yyyy-MM-dd HH:mm:ss`
  if (timeZone === "YYYY/MM/DD") timeZone = `yyyy/MM/dd ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`
  return timeZone;
}

export function getTimeValueFormatZone() {
  let timeZone = localStorage.getItem("selectedDateFormat");
  let timeFormat = localStorage.getItem("selectedTimeFormat");
  let is12H = timeFormat === "12h";

  if (is12H) {
    timeFormat = "hh";
  } else {
    timeFormat = "HH";
  }
  const timeZoneRightText = is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`;

  if (timeZone === "DD/MM/YYYY") timeZone = `dd/MM/yyyy ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`

  if (timeZone === "MM/DD/YYYY") timeZone = `MM/dd/yyyy ${timeZoneRightText}`;

  //timeZone = `yyyy-MM-dd HH:mm:ss`

  if (timeZone === "YYYY/MM/DD") timeZone = `yyyy/MM/dd ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`

  return timeZone;
}
export function getTimeZoneForMoment(fallback) {
  let timeZone =
    localStorage.getItem("selectedDateFormat") || fallback?.dateFormat || "";
  let timeFormat =
    localStorage.getItem("selectedTimeFormat") || fallback?.timeFormat || "";

  let is12H = timeFormat === "12h";

  if (is12H) {
    timeFormat = "hh";
  } else {
    timeFormat = "HH";
  }
  const timeZoneRightText = is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`;

  if (timeZone === "DD/MM/YYYY") timeZone = `DD/MM/YYYY ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`
  if (timeZone === "MM/DD/YYYY") timeZone = `MM/DD/YYYY ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`
  if (timeZone === "YYYY/MM/DD") timeZone = `YYYY/MM/DD ${timeZoneRightText}`;
  //timeZone = `yyyy-MM-dd HH:mm:ss`

  return timeZone;
}

export function deepCopyArray(data) {
  return structuredClone(data);
}

export function getDefaultFilter() {
  return deepCopyArray({
    filter: {
      Condition: "AND",
      SearchInputTextValue: "",
      FilterGroups: [
        {
          Condition: "AND",
          FilterItems: [],
          FilterGroups: []
        },
        {
          Condition: "OR",
          FilterItems: [],
          FilterGroups: []
        }
      ]
    }
  });
}

export function getDefaultAxiosPayload(props, defaultOrderBy = null) {
  return deepCopyArray({
    pageNumber: 1,
    pageSize: 10,
    orderBy: defaultOrderBy === null ? "CreateTime" : defaultOrderBy,
    ascending: false,
    filter: getDefaultFilter().filter,
    ...props
  });
}

export function getSelectSearchPayload(
  payload = {},
  search = "",
  key = "name",
  extraFilterItems = []
) {
  const copyOfPayload = structuredClone(payload);
  copyOfPayload.pageSize = 100;
  copyOfPayload.pageNumber = 1;
  copyOfPayload.filter.FilterGroups[1].FilterItems.push(
    {
      Value: search,
      FieldName: key,
      Operator: "Contains"
    },
    ...extraFilterItems
  );
  return copyOfPayload;
}

export function isDifferent(a, b) {
  return (
    !a ||
    !b ||
    Object.keys(a).some((key) => {
      if (Array.isArray(a[key]) && Array.isArray(b[key])) {
        return a[key].length !== b[key].length;
      }
      if (
        typeof a[key] === "object" &&
        a[key] !== null &&
        typeof b[key] === "object" &&
        b[key] !== null
      ) {
        return isDifferent(a[key], b[key]);
      }
      return a[key] !== b[key];
    })
  );
}

export function getInvestigationStatusTooltipText(type) {
  if (type === "Queued")
    return "This investigation will start when others before it are finished";
  if (type === "Running") return "Investigation will finish on expiry date";
  if (type === "No match")
    return "This email does not match properties required by the rule: No attachment";
  if (type === "Finished")
    return "Investigation of all target users are completed and expired";
  if (type === "Canceled") return "Investigation was cancelled manually";
  if (type === "Expired")
    return "Investigation expired before completing investigation for all target users";
}

export function createCopyToClipboardSnackbar() {
  store.dispatch("common/createSnackBar", {
    message: labels.CopiedToClipboard,
    color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
    icon: "mdi-checkbox-marked-circle "
  });
}

function createCopyToClipboardErrorSnackbar() {
  store.dispatch("common/createSnackBar", {
    message: "Failed to copy to clipboard",
    color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
    icon: "mdi-close-circle"
  });
}

function copyToClipboardWithExecCommand(textToCopy) {
  try {
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const isCopied = document.execCommand("copy");
    textArea.remove();
    return isCopied;
  } catch (e) {
    return false;
  }
}
export function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  try {
    const normalizedText = textToCopy == null ? "" : String(textToCopy);

    if (navigator.clipboard && globalThis.isSecureContext) {
      // navigator clipboard api method
      return navigator.clipboard
        .writeText(normalizedText)
        .then(() => {
          createCopyToClipboardSnackbar();
          return true;
        })
        .catch(() => {
          const isFallbackCopied = copyToClipboardWithExecCommand(
            normalizedText
          );
          if (isFallbackCopied) {
            createCopyToClipboardSnackbar();
            return true;
          }
          createCopyToClipboardErrorSnackbar();
          return false;
        });
    }

    const isCopied = copyToClipboardWithExecCommand(normalizedText);
    if (isCopied) {
      createCopyToClipboardSnackbar();
      return Promise.resolve(true);
    }

    createCopyToClipboardErrorSnackbar();
    return Promise.resolve(false);
  } catch (e) {
    createCopyToClipboardErrorSnackbar();
    return Promise.resolve(false);
  }
}

export function formatSeconds(seconds = 0) {
  const secondType = typeof seconds;
  if (secondType === "number" || secondType === "string") {
    seconds = Number.parseInt(seconds);
    const minute = Math.floor(seconds / 60);
    seconds = seconds - minute * 60;
    return ("0" + minute).slice(-2) + ":" + ("0" + seconds).slice(-2);
  } else {
    return "00:00";
  }
}
export const getErrorMessage = (error) => {
  return (
    (error?.response?.data?.validationMessages?.length &&
      error?.response?.data?.validationMessages[0]) ||
    error?.response?.data?.message ||
    error?.response?.data?.Message ||
    error.message ||
    "Something Went Wrong"
  );
};

export const getDifficultyBadgeColor = (text = "") => {
  if (text.toLowerCase() === "easy") return "#217124";
  if (text.toLowerCase() === "medium") return "#2196f3";
  if (text.toLowerCase() === "hard") return "#f56c6c";
  return "#2196f3";
};

export function createRandomCryptNumber() {
  const crypto = globalThis.crypto || globalThis.msCrypto;
  if (!crypto) return Date.now(); // Fallback when crypto API unavailable (legacy browsers)
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array)[0];
}

export function createRandomCryptStringNumber() {
  return createRandomCryptNumber().toString();
}

export function cancellableAxiosRequest(fn) {
  let isAborted = false;
  let controller = new AbortController();
  return (...params) => {
    //that means if there is next call without resolving it would be aborted
    if (isAborted) {
      controller.abort();
      controller = new AbortController();
    }
    isAborted = true;
    return fn(...params, {
      signal: controller.signal
    }).then((response) => {
      if (Object.keys(response).length) {
        isAborted = false;
        controller = new AbortController();
      }
      return response;
    });
  };
}

export function logFormData(formData) {
  for (let pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
}
export function fileToBase64(file) {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      if ("Blob" in globalThis && file instanceof Blob) reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  return toBase64(file);
}

/**
 * HTML içeriğini yeni pencerede açar. Title ekler, encoding sorunlarını çözer ve click eventlerini engeller.
 * @param {string} htmlContent - Açılacak HTML içeriği
 */
export function openHtmlInNewWindow(htmlContent) {
  if (!htmlContent) return;

  let processedHtml = htmlContent;

  // UTF-8 meta tag ekle (encoding problemi için)
  if (!processedHtml.includes("charset")) {
    if (processedHtml.includes("<head>")) {
      processedHtml = processedHtml.replace(
        "<head>",
        '<head><meta charset="UTF-8">'
      );
    } else if (processedHtml.includes("<html>")) {
      processedHtml = processedHtml.replace(
        "<html>",
        '<html><head><meta charset="UTF-8"></head>'
      );
    } else {
      processedHtml = `<head><meta charset="UTF-8"></head>${processedHtml}`;
    }
  }

  // Title ekle veya güncelle
  if (!processedHtml.includes("<title>")) {
    if (processedHtml.includes("<head>")) {
      processedHtml = processedHtml.replace(
        "<head>",
        "<head><title>Landing Page Template Preview</title>"
      );
    } else if (processedHtml.includes("<html>")) {
      processedHtml = processedHtml.replace(
        "<html>",
        "<html><head><title>Landing Page Template Preview</title></head>"
      );
    } else {
      processedHtml = `<head><title>Landing Page Template Preview</title></head>${processedHtml}`;
    }
  } else {
    processedHtml = processedHtml.replace(
      /<title>.*?<\/title>/i,
      "<title>Landing Page Template Preview</title>"
    );
  }

  // Prevent click script'i ekle
  const { getPreventClickScript } = require("./preventClickScript");
  const preventScript = getPreventClickScript();
  if (processedHtml.includes("</body>")) {
    processedHtml = processedHtml.replace("</body>", `${preventScript}</body>`);
  } else {
    processedHtml += preventScript;
  }

  // Blob oluştur ve aç
  const blob = new Blob([processedHtml], { type: "text/html;charset=UTF-8" });
  const url = globalThis.URL.createObjectURL(blob);
  globalThis.open(url, "_blank");
  setTimeout(() => globalThis.URL.revokeObjectURL(url), 100);
}

/**
 * Red flag göstermek için kullanılan CSS
 */
export const FLAGGED_AREA_CSS = `
  <style>
    .flagged-area {
      position: relative;
      display: inline-block;
      border: 1px solid #e00;
      border-radius: 4px;
      padding-left:2em !important;
      margin: 0.5em 0.1em;
    }
    .flagged-area:not(a):not(button):not(.button):not(.flagged-area-img) {
      background-color: rgba(255, 0, 0, 0.1);
      padding: 0.2em 2em;
    }

    .flagged-area::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0.5em;
      transform: translateY(-50%);
      width: 1em;
      height: 1em;
      background: url('https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2ef43b16-8d47-46c6-2d2c-e861a3bb6500/public') no-repeat center/contain;
    }
    .flagged-area:hover::after {
      content: attr(data-flag-tooltip);
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      margin-top: 0.4em;
      padding: 4px 8px;
      background:#B83A3A;
      color: #fff;
      font-size: 12px;
      line-height: 1.33;
      font-family:"Open Sans", sans-serif;
      white-space: normal;
      word-break: break-word;
      max-width: 240px;
      min-width: 240px;
      border-radius: 4px;
      z-index: 9999;
    }
    .flagged-area:has(.flagged-area:hover)::after {
      content: none;
    }
    .email-container,.container,.email-container-wrapper{
      overflow:visible !important;
    }
  </style>
`;
