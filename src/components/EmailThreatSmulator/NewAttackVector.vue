<template>
  <div class="new-attack-vector">
    <app-modal :status="status" icon-name="mdi-shield-half-full" :title="pageTitle">
      <template v-slot:overlay-body>
        <v-form ref="refAttackVectorForm">
          <app-modal-body-header
            class="mt-8"
            :title="isEdit ? 'Edit Attack Vector' : 'Add New Attack Vector'"
            sub-title="Enter attack vector information and upload file"
          />
          <form-group title="Vector Name" hint>
            <v-text-field
              v-model="formValues.name"
              outlined
              hint=""
              placeholder="Enter a name for the vector"
              v-bind="commonRules(true)"
              required
            />
          </form-group>
          <form-group title="Category" sub-title="Select type of the vector" hint>
            <v-select
              v-model="formValues.categoryResourceId"
              :items="categoryResources"
              item-text="name"
              item-value="resourceId"
              outlined
              required
            />
          </form-group>
          <form-group
            title="Severity"
            sub-title="Enter between 1-10 (1 being the lowest and 10 being the highest)"
            hint
          >
            <v-text-field
              v-model="formValues.riskFactor"
              outlined
              hint=""
              placeholder="Enter a name for the vector"
              type="number"
              v-bind="setNumberRangeRule(true)"
              pattern="^[\d]+$"
              required
            />
          </form-group>
          <form-group title="Upload file" sub-title="Upload attack vector file" hint>
            <file-upload
              width="216"
              hint="Max. file size 200MB"
              ref="refFileUpload"
              :extensions="['txt', 'zip']"
              @inputFile="onFileChanged"
              :size="200"
              required
            />
          </form-group>
          <form-group
            className="mt-8"
            title="Status"
            sub-title="This attack vector will be included to continous scans and new scans."
            hint
          >
            <v-switch v-model="formValues.isActive" color="#2196F3" hide-details>
              <template #prepend>
                <v-label>
                  <span v-if="formValues.isActive" class="is-active-label">ENABLED</span>
                  <span v-else class="is-active-label passive">DISABLED</span>
                </v-label>
              </template>
            </v-switch>
          </form-group>
        </v-form>
      </template>
      <template v-slot:overlay-footer>
        <v-btn class="add-user-overlay__footer-btn-cancel" rounded @click="closeNewScanPopup">
          {{ labels.Cancel }}
        </v-btn>
        <v-btn
          class="add-user-overlay__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
          :disabled="saveDisable"
        >
          {{ labels.Save }}
        </v-btn>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from "../AppModal";
import AppModalBodyHeader from "@/components/SmallComponents/AppModalBodyHeader";
import labels from "@/model/constants/labels";
import FormGroup from "@/components/SmallComponents/FormGroup";
import FileUpload from "@/components/Common/FileUpload/FileUpload";
import * as Validations from "@/utils/validations";
import {
  getAttackVectorCreate,
  getAttackVectorUpdate,
  getAttackVectorById,
} from "@/api/emailThreatSimlator";
import { getLookupListByTypeId } from "@/api/common";
import { COMMON_CONSTANTS } from "@/model/constants/commonConstants";

export default {
  name: "NewScan",
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    FileUpload,
  },
  data() {
    return {
      saveDisable: false,
      categoryResources: [],
      labels,
      Validations: Validations,
      formValues: {
        name: "",
        categoryResourceId: null,
        description: "",
        content: "",
        riskFactor: 1,
        isActive: false,
      },
      baseRules: {
        hint: "*Required",
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.TemplateName)),
        ],
      },
      numberRangeRule: {
        hint: "*Required",
        persistentHint: true,
        rules: [(v) => Validations.numberRangeRule(v, 1, 10)],
      },
      isSubmitDisabled: false,
      isFormValuesChanged: false,
    };
  },
  props: {
    status: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    attackVectorDetails: {
      required: true,
      type: Object,
    },
  },
  methods: {
    commonRules(isNeed) {
      if (isNeed) {
        return this.baseRules;
      }
    },
    setNumberRangeRule(isNeed) {
      if (isNeed) {
        return this.numberRangeRule;
      }
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.content = "";
      } else {
        this.formValues.content = file;
      }
    },
    closeNewScanPopup() {
      if (!this.isFormValuesChanged) {
        return this.$emit("changeNewScanModalStatus", false);
      }
      this.$store.dispatch("common/setIsShowLeavingDialog", {
        show: true,
        callback: () => {
          this.$emit("changeNewScanModalStatus", false);
        },
      });
    },
    submit() {
      if (this.$refs.refAttackVectorForm.validate()) {
        const {
          name,
          categoryResourceId,
          description,
          content,
          riskFactor,
          isActive,
        } = this.formValues;
        const formData = {
          name,
          categoryResourceId,
          description,
          content,
          riskFactor,
          isActive,
        };
        const payload = this.createFormDataPayload(formData);
        const requestFunc = this.isEdit
          ? getAttackVectorUpdate(payload, this.attackVectorDetails.resourceId)
          : getAttackVectorCreate(payload);
        requestFunc
          .then((response) => {
            this.$store.dispatch("common/createSnackBar", {
              message: this.isEdit
                ? "Attack Vector successfully updated."
                : "Attack Vector successfully added.",
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: "mdi-alert-circle",
            });
            this.$emit("changeNewScanModalStatus", false, true);
          })
          .catch((error) => {
            const errorResponse = error.response.data;
            let msg = errorResponse.message;
            if (errorResponse.validationMessages.length > 0) {
              let msg = "";
              for (let i = 0; i < errorResponse.validationMessages.length; i++) {
                const listMsg = errorResponse.validationMessages[i];
                msg += listMsg + ", ";
              }
              msg = msg.slice(0, -1);
            }
            this.$store.dispatch("common/createSnackBar", {
              message: msg,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: "mdi-alert-circle",
            });
          });
      }
    },
    createFormDataPayload(payload = {}) {
      const formData = new FormData();
      for (const key of Object.keys(payload)) {
        formData.append(key.slice(0, 1).toUpperCase() + key.slice(1), payload[key]);
      }
      return formData;
    },
  },
  watch: {
    formValues: {
      handler: function (value) {
        this.isFormValuesChanged = true;
        if (this.formValues.riskFactor != "") {
          this.formValues.riskFactor = value.riskFactor?.toString().replace(/[^0-9]*/g, "");
        }
      },
      deep: true,
    },
  },
  computed: {
    pageTitle() {
      return this.isEdit ? "Edit Attack Vector" : "Create Attack Vector";
    },
  },
  created() {
    getLookupListByTypeId(24).then((categories) => {
      const categoryList = categories.data.data;
      this.categoryResources = categoryList;
      this.formValues.categoryResourceId = categoryList[0].resourceId;
      if (this.isEdit) {
        getAttackVectorById(this.attackVectorDetails.resourceId).then((response) => {
          const details = response.data.data;
          this.formValues.categoryResourceId = categoryList.find(
            (x) => x.resourceId == details.categoryResourceId
          ).resourceId;
          details.isActive = details.status == "Enabled" ? true : false;
          this.formValues = details;
        });
      }
    });
  },
};
</script>
<style lang="scss">
.new-attack-vector {
  .k-form-group .v-list-item__content > *:not(:last-child) {
    margin-top: 3px;
  }
  .k-file-uploads__wrapper {
    width: 220px;
  }
  .is-active-label {
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: #2196f3;
    &.passive {
      color: #383b41;
    }
  }
}
</style>
