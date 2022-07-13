<template>
  <div>
    <FormGroup :title="labels.ContentType">
      <KSelect
        v-model.trim="formData.type"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        hint="*Required"
        placeholder="Select content type"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="contentTypeItems"
      ></KSelect>
    </FormGroup>
    <FormGroup>
      <v-checkbox
        v-model="formData.hasQuiz"
        id="input--new-training-modal-quiz"
        class="mb-8"
        label="Quiz"
        color="#2196f3"
        hide-details
      >
      </v-checkbox>
    </FormGroup>
    <FormGroup :title="labels.Content" :sub-title="labels.ContentSub">
      <div v-for="index in formData.contentByLanguage.length" :key="index">
        <NewTrainingContentByLanguage
          v-model="formData.contentByLanguage[index - 1]"
          :class="['mb-4', index > 0 && 'mt-6']"
          :language-items="languages"
          :training-resource-id="resourceId"
          :is-removable="index > 1"
          @on-file-start="$emit('update:isActionButtonDisabled', true)"
          @on-file-end="$emit('update:isActionButtonDisabled', false)"
          @on-remove="handleRemove(index - 1)"
        />
      </div>
      <div class="d-flex mt-2 ml-4 cursor-pointer" @click="handleAddLanguage">
        <v-icon color="#2196f3">mdi-plus</v-icon>
        <div class="ml-2 new-integration__api-key__text" style="width: 150px;">
          ADD LANGUAGE
        </div>
      </div>
    </FormGroup>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage'
export default {
  name: 'NewTrainingTrainingContent',
  components: { NewTrainingContentByLanguage, KSelect, FormGroup },
  props: {
    isActionButtonDisabled: {
      type: Boolean
    },
    resourceId: {
      type: String
    }
  },
  inject: {
    getLanguages: {
      type: Function
    }
  },
  data() {
    return {
      labels,
      Validations,
      contentTypeItems: ['SCORM12'],
      formData: {
        type: 'SCORM12',
        hasQuiz: false,
        contentByLanguage: [{ file: null, languageId: this.languages[0].value || '' }]
      }
    }
  },
  computed: {
    languages() {
      return this.getLanguages()
    }
  },
  methods: {
    handleAddLanguage() {
      this.formData.contentByLanguage.unshift({
        file: null,
        languageId: this.languages[0].value || ''
      })
    },
    setFormData(formData = {}) {
      this.formData = {
        ...this.formData,
        ...formData
      }
    },
    handleRemove(index) {
      this.formData.contentByLanguage.splice(index, 1)
    }
  }
}
</script>
