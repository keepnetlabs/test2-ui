<template>
  <section id="advanced-settings-attachments">
    <CompanySettingsHeader :title="labels.Attachments" :subTitle="labels.AttachmentsSubtitle" />
    <div class="mt-n2">
      <v-checkbox
        v-model="values"
        id="input--advanced-settings-attachment-archive"
        color="#2196f3"
        label="Archive files (.zip, .rar)"
        value="Archive"
      />
      <v-checkbox
        v-model="values"
        id="input--advanced-settings-attachment-image"
        color="#2196f3"
        label="Image files (.jpg, .png, .gif, .bmp)"
        value="Image"
      />
      <v-checkbox
        v-model="values"
        id="input--advanced-settings-attachment-office"
        color="#2196f3"
        label="Microsoft Office files (.doc, .docx, .xls, .xlsx, .ppt, .pptx, etc.)"
        value="MSOffice"
      />
      <v-checkbox
        v-model="values"
        id="input--advanced-settings-attachment-portable"
        color="#2196f3"
        label="Portable executable files (exe, .dll, .sys, etc.)"
        value="PEExtensions"
      />
      <v-btn
        id="btn-save--advanced-settings-url"
        class="white--text btn-util btn-save-changes mb-6"
        color="#2196f3"
        style="margin-top: 14px;"
        rounded
        :disabled="isActionButtonDisabled"
        @click="handleSaveChanges"
      >
        {{ labels.SaveChanges }}
      </v-btn>
    </div>
  </section>
</template>

<script>
import labels from '@/model/constants/labels'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
export default {
  name: 'AdvancedSettingsAttachments',
  components: {
    CompanySettingsHeader
  },
  props: {
    formData: {
      type: Array
    }
  },

  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      values: []
    }
  },
  watch: {
    formData(val = []) {
      this.setFormDataToAttachment(val)
    }
  },
  created() {
    this.setFormDataToAttachment()
  },
  methods: {
    handleSaveChanges() {
      const payload = this.createPayload()
      this.$emit('on-submit', payload, 'AttacmentExtension')
    },
    setFormDataToAttachment(val = this.formData) {
      this.values = val.reduce((acc, item) => {
        const { attachmentExtensionType, exclusionType } = item
        if (exclusionType === 'AttacmentExtension') acc.push(attachmentExtensionType)
        return acc
      }, [])
    },
    createPayload() {
      return this.values.reduce((acc, item) => {
        acc.push({
          attachmentExtensionType: item,
          exclusionType: 'AttacmentExtension',
          value: null
        })
        return acc
      }, [])
    }
  }
}
</script>
