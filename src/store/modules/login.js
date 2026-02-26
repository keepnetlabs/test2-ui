import { resetPassword, twoStepLogin } from "@/api/auth";
import AuthenticationService from "../../services/authentication";
import { COMMON_CONSTANTS } from "@/model/constants/commonConstants";
import { getWhiteLabelByUrl } from "@/api/whitelabel";
import { getCompanyByID, getAgenticAIStatus } from "@/api/company";
import { updateFavicon } from "@/utils/favicon";
const login = {
  namespaced: true,
  state: {
    pageNumber: 1,
    wrongLoginAttempt: 0,
    company: null,
    hasAgenticAILicense: false,
    agenticAIEnabled: false,
    agenticAIExecutionMode: 'ApprovalGated',
    loginWhiteLabel: {
      brandName: "",
      favIconUrl: "",
      mainLogoUrl: ""
    }
  },
  getters: {
    getPageNumber: (state) => state.pageNumber,
    loginWhiteLabel: (state) => state.loginWhiteLabel,
    getCurrentCompany: (state) => state.company,
    getHasAgenticAILicense: (state) => state.hasAgenticAILicense,
    getAgenticAIEnabled: (state) => state.agenticAIEnabled,
    getAgenticAIExecutionMode: (state) => state.agenticAIExecutionMode
  },
  mutations: {
    SET_PAGE_NUMBER(state, payload) {
      state.pageNumber = payload;
    },
    SET_LOGIN_WHITELABEL(state, payload) {
      for (const key of Object.keys(state.loginWhiteLabel)) {
        if (key === "favIconUrl" && payload["faviconUrl"]) {
          updateFavicon(payload["faviconUrl"]);
          state.loginWhiteLabel[key] = payload["faviconUrl"];
        } else if (key === "brandName" && payload[key]) {
          document.title = payload[key];
          state.loginWhiteLabel[key] = payload[key];
        } else {
          state.loginWhiteLabel[key] = payload[key];
        }
      }
    },
    SET_COMPANY(state, payload) {
      state.company = payload;
    },
    SET_HAS_AGENTIC_AI_LICENSE(state, payload) {
      state.hasAgenticAILicense = !!payload;
    },
    SET_AGENTIC_AI_ENABLED(state, payload) {
      state.agenticAIEnabled = !!payload;
    },
    SET_AGENTIC_AI_EXECUTION_MODE(state, payload) {
      state.agenticAIExecutionMode = payload;
    }
  },
  actions: {
    twoStepLogin({ commit, dispatch }, payload) {
      const jtwToken = AuthenticationService.getToken().token;
      dispatch("common/activateLoader", COMMON_CONSTANTS.ENABLELOADER, {
        root: true
      });
      twoStepLogin({
        code: payload.code,
        token: jtwToken
      })
        .then((response) => {
          const result = response.data;
          AuthenticationService.setToken(
            result.token,
            result.expiredIn,
            result.status
          );
          dispatch("common/activateLoader", COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          });
          commit("common/SET_ERROR_STATE", false, { root: true });
          dispatch("setPageNumber", 1);
          payload.router.push("/");
        })
        .catch((response) => {
          const result = response.response.data;
          const errorMessage = result.errors[0].message;
          dispatch("common/activateLoader", COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          });
          commit("common/SET_ERROR_STATE", true, { root: true });
          commit("common/SET_ERROR_MESSAGE", errorMessage, { root: true });
        });
    },
    resetPassword({ commit, dispatch }, payload) {
      resetPassword(payload).then((response) => {
        const result = response.data.Result;
        dispatch("common/setSnackStatus", true, { root: true });
        if (result) {
          dispatch(
            "common/setErrorMessage",
            "An email to with a link to reset your password is sent if a matched user account is found",
            { root: true }
          );
        } else {
          dispatch(
            "common/setErrorMessage",
            "No user found with that email address",
            {
              root: true
            }
          );
        }
        commit("common/SET_SNACKBAR_COLOR", "green", { root: true });
      });
    },
    setPageNumber({ commit }, payload) {
      commit("SET_PAGE_NUMBER", payload);
    },
    getWhiteLabelByUrl({ commit }) {
      const formData = new FormData();
      formData.append("DomainUrl", window.location.origin);
      getWhiteLabelByUrl(formData).then((response) => {
        if (response?.data?.data) {
          const {
            data: { data }
          } = response;
          commit("SET_LOGIN_WHITELABEL", data);
        }
      });
    },
    getCurrentCompany({ commit }) {
      return getCompanyByID(localStorage.getItem("companyRequestId")).then(
        (response) => {
          const company = response?.data?.data || null;
          commit("SET_COMPANY", company);
          // Use backend-provided flag as source of truth
          const hasLicense = !!company?.hasAgenticAILicense;
          commit("SET_HAS_AGENTIC_AI_LICENSE", hasLicense);
          if (!hasLicense) commit("SET_AGENTIC_AI_ENABLED", false);
        }
      );
    },
    getAgenticAIEnabled({ commit, state }) {
      // default to false until backend says true
      commit("SET_AGENTIC_AI_ENABLED", false);
      if (!state.hasAgenticAILicense) return Promise.resolve(false);
      return getAgenticAIStatus()
        .then((response) => {
          const data = response?.data?.data;
          const enabled = !!data?.agenticAIEnabled;
          commit("SET_AGENTIC_AI_ENABLED", enabled);
          if(data?.executionMode) {
             commit("SET_AGENTIC_AI_EXECUTION_MODE", data.executionMode);
          }
          return enabled;
        })
        .catch(() => {
          commit("SET_AGENTIC_AI_ENABLED", false);
          return false;
        });
    },
    setAgenticAIEnabled({ commit }, payload) {
      commit("SET_AGENTIC_AI_ENABLED", payload);
    }
  }
};

export default login;
