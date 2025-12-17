<template>
  <VueQueryBuilder
    v-model="query"
    :key="queryBuilderKey"
    id="investigation-query-builder"
    class="w-100"
    :max-depth="4"
    :labels="label"
    :rules="rules"
  >
    <template #default="slotProps">
      <VForm ref="refForm" lazy-validation>
        <QueryBuilderGroup
          v-bind="slotProps"
          ref="queryBuilderGroup"
          :query.sync="query"
          @logical-operator-change="handleCheckFiltersForDisableItems"
        />
      </VForm>
    </template>
  </VueQueryBuilder>
</template>

<script>
import VueQueryBuilder from "vue-query-builder";
import QueryBuilderGroup from "@/components/Investigation/InvestigationQueryGroup";
import * as Validations from "@/utils/validations";
import labels from "@/model/constants/labels";
import { createRandomCryptStringNumber } from "@/utils/functions";
export default {
  name: "NewInvestigationFilters",
  components: {
    VueQueryBuilder,
    QueryBuilderGroup,
  },
  data() {
    return {
      label: {
        matchType: "Match Type",
        matchTypes: [
          { id: "OR", label: "OR" },
          { id: "AND", label: "AND" },
        ],
        addRule: "ADD CONDITION",
        textInputPlaceholder: "value",
      },
      rules: [
        {
          type: "conditions",
          id: "conditions",
          label: "Conditions",
          operands: [
            {
              label: "Header",
              id: "header",
              isDefaultExpanded: true,
              children: [
                { label: "Subject", id: "subject" },
                { label: "From", id: "from", isDisabled: false },
                { label: "To", id: "to" },
                { label: "CC", id: "cc" },
                { label: "BCC", id: "bcc" },
                { label: "Sender Name", id: "senderName" },
                { label: "Sender IP", id: "ip", isDisabled: false },
              ],
            },
            {
              label: "Body",
              id: "body",
              isDefaultExpanded: true,
              children: [
                { label: "Keyword", id: "keyword" },
                { label: "Domain", id: "url" },
                { label: "Regex", id: "regex" },
              ],
            },
            {
              label: "Attachment",
              id: "attachment",
              isDefaultExpanded: true,
              children: [
                { label: "File Name", id: "name" },
                { label: "File Size", id: "size" },
                { label: "File Extension", id: "extension" },
                { label: "SHA512", id: "sha512" },
                { label: "MD5", id: "md5" },
              ],
            },
          ],
          placeholders: {
            ip: "Enter an ip address ",
            from: "Enter an email address",
            to: "Enter an email address",
            cc: "Enter an email address",
            bcc: "Enter an email address",
            subject: "Enter a subject",
            senderName: "Enter a from name",
            url: "Enter a domain name",
            keyword: "Enter a keyword",
            size: "Enter file size(byte)",
            name: "Enter a file name(case sensitive)",
            sha512: "Enter a sha512 key",
            md5: "Enter a md5 key",
            extension: "Enter an file extension",
            regex: "Enter a regular expression",
          },
          textFieldValidations: {
            emailOrDomain: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.emailOrDomain(v),
            ],
            email: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.email(v),
              (v) =>
                Validations.maxLength(
                  v,
                  320,
                  labels.getMaxLengthMessage(labels.EmailAddress, 320)
                ),
              (v) => {
                if (Validations.email(v)) {
                  return Validations.controlEmailLength(v) || labels.InvalidEmailAddress;
                }
                return false;
              },
            ],
            ip: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.ip(v),
              (v) =>
                Validations.maxLength(
                  v,
                  15,
                  labels.getMaxLengthMessage(labels.IpAddress, 15)
                ),
            ],
            subject: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(
                  v,
                  512,
                  labels.getMaxLengthMessage(labels.Subject, 512)
                ),
            ],
            senderName: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(
                  v,
                  64,
                  labels.getMaxLengthMessage(labels.SenderName)
                ),
            ],
            url: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(
                  v,
                  5000,
                  labels.getMaxLengthMessage(labels.Domain, 5000)
                ),
              (v) => Validations.urlOrIpAddress(v, labels.InvalidDomain),
            ],
            keyword: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Keyword)),
            ],
            size: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) => Validations.isNumber(v),
              (v) =>
                Validations.maxLength(
                  v,
                  320,
                  labels.getMaxLengthMessage(labels.Size, 320)
                ),
            ],
            name: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name)),
            ],
            sha512: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.minLength(
                  v,
                  128,
                  labels.getMinLengthMessage(labels.SHA512, 128)
                ),
              (v) =>
                Validations.maxLength(
                  v,
                  128,
                  labels.getMaxLengthMessage(labels.SHA512, 128)
                ),
            ],
            md5: [
              (v) => Validations.startsWithSpace(v),
              (v) => Validations.required(v),
              (v) =>
                Validations.maxLength(v, 32, labels.getMaxLengthMessage(labels.MD5, 32)),
              (v) =>
                Validations.minLength(v, 32, labels.getMinLengthMessage(labels.MD5, 32)),
            ],
            extension: [
              (v) => Validations.startsWithSpace(v),
              (v) =>
                Validations.minLength(
                  v,
                  3,
                  labels.getMinLengthMessage(labels.Extension, 3)
                ),
              (v) =>
                Validations.maxLength(
                  v,
                  10,
                  labels.getMaxLengthMessage(labels.Extension, 10)
                ),
              (v) => Validations.extension(v, labels.InvalidExtension),
              (v) =>
                Validations.isFileExtensionSpecialCharacter(v, labels.InvalidExtension),
            ],
            regex: [
              (v) => Validations.startsWithSpace(v),
              (v) =>
                Validations.maxLength(
                  v,
                  2000,
                  labels.getMaxLengthMessage(labels.Regex, 10)
                ),
            ],
          },
          errorMessages: [],
        },
      ],
      query: {
        logicalOperator: "AND",
        children: [],
      },
      queryBuilderKey: `key-${createRandomCryptStringNumber()}`,
    };
  },
  methods: {
    validateForm() {
      return {
        formValid: this.$refs.refForm.validate(),
        queryValid: this.checkIsQueryValid(),
        filtersValid: this.handleCheckFiltersForDisableItems(this.query.logicalOperator),
      };
    },
    checkIsQueryValid() {
      return this.query.children.every(
        (child) => child.query.value && child.query.operand
      );
    },
    getErrorMessage() {
      if (this.query.children.length === 1 && !this.query.children[0].operand)
        return labels.EmptyFilterSingleError;
      else if (!this.query.children.every((child) => child.operand)) {
        return labels.EmptyFilterMultipleError;
      }
      return "";
    },
    handleCheckFiltersForDisableItems(logicalOperator = "") {
      const state = {
        fromValid: true,
        ipValid: true,
      };
      if (logicalOperator !== "AND") return state;
      if (
        this.query.children.filter((child) => child.query.operand === "from").length > 1
      )
        state.fromValid = false;
      if (this.query.children.filter((child) => child.query.operand === "ip").length > 1)
        state.ipValid = false;

      return state;
    },
    setQuery(query = {}) {
      this.query = query;
      this.queryBuilderKey = `key-${createRandomCryptStringNumber()}`;
    },
  },
};
</script>
