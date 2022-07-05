<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.ContentLanguage">
      <KSelect
        v-model.trim="formData.contentLanguage"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        hint="*Required"
        placeholder="All Languages"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="contentLanguageItems"
      ></KSelect>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
export default {
  name: 'SendTrainingSettings',
  components: { KSelect, FormGroup },
  data() {
    return {
      labels,
      Validations,
      contentLanguage: '',
      contentLanguageItems: []
    }
  }
}
</script>
