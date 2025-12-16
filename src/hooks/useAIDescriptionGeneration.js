export default {
  methods: {
    /**
     * Prepares AI description generation payload from form data
     * @returns {Object} Payload object with name, category, compliance, behaviour, and role
     */
    getAIDescriptionPayload() {
      return {
        name: this.formData?.name || '',
        category: this.formData?.category || '',
        compliance: this.formData?.compliances || [],
        behaviour: this.formData?.behaviours || [],
        role: this.formData?.targetAudience || ''
      }
    }
  }
}
