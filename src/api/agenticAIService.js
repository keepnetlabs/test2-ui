import axios from "axios";
import AuthenticationService from "@/services/authentication";

const BASE_URL = globalThis.location?.hostname?.includes("localhost")
  ? "http://localhost:4111"
  : "https://agentic-ai-agent.keepnetlabs.com";

const headers = { "Content-Type": "application/json" };

function getBaseApiUrl() {
  const url = APP_CONFIG?.VUE_APP_ROOT_API || "https://api.keepnetlabs.com";
  return url.replace(/\/api\/?$/, "");
}

function getActiveCompanyId() {
  if (typeof localStorage === "undefined") return "";
  return (
    localStorage.getItem("companyRequestId") ||
    localStorage.getItem("companyResourceId") ||
    localStorage.getItem("companyId") ||
    ""
  );
}

/**
 * Send autonomous AI action for a single user.
 */
export function sendAutonomous({
  preferredLanguage,
  targetUserResourceId,
  departmentName,
  actions,
  sendAfterPhishingSimulation = false,
  companyId = getActiveCompanyId()
}) {
  const body = {
    token: AuthenticationService.getToken(),
    preferredLanguage,
    targetUserResourceId,
    departmentName,
    actions,
    sendAfterPhishingSimulation,
    companyId
  };
  return axios.post(`${BASE_URL}/autonomous`, body, { headers });
}

/**
 * Send batch autonomous AI action for a group.
 */
export function sendBatchAutonomous({
  targetGroupResourceId,
  actions,
  sendAfterPhishingSimulation = false,
  companyId = getActiveCompanyId()
}) {
  const body = {
    token: AuthenticationService.getToken(),
    targetGroupResourceId,
    actions,
    sendAfterPhishingSimulation,
    companyId
  };
  return axios.post(`${BASE_URL}/batch-autonomous`, body, { headers });
}

/**
 * Retry a rejected/errored autonomous AI activity.
 */
export function retryAutonomous({
  targetUserResourceId,
  firstName,
  lastName,
  departmentName,
  actions,
  sendAfterPhishingSimulation = false,
  preferredLanguage,
  batchResourceId,
  rejectingReason,
  rejectedScenarioResourceId,
  retryOfActivityResourceId,
  companyId = getActiveCompanyId()
}) {
  const body = {
    token: AuthenticationService.getToken(),
    baseApiUrl: getBaseApiUrl(),
    targetUserResourceId,
    firstName,
    lastName,
    departmentName,
    actions,
    sendAfterPhishingSimulation,
    preferredLanguage,
    batchResourceId,
    rejectingReason,
    rejectedScenarioResourceId,
    companyId
  };
  if (retryOfActivityResourceId) {
    body.retryOfActivityResourceId = retryOfActivityResourceId;
  }
  return axios.post(`${BASE_URL}/autonomous`, body, { headers });
}
