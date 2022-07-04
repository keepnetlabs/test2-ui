<template>
  <div class="">
    <div class="">
      <div class="">
        <div class="">
          <div class="d-flex justify-space-between">
            <div class="d-flex">
              <div>
                <v-text-field
                  v-model.trim="search"
                  placeholder="Search"
                  outlined
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  style="
                    max-width: 328px;
                    min-width: 328px;
                    width: 100%;
                    padding-right: 4px !important;
                  "
                ></v-text-field>
              </div>
              <div>
                <KSelect
                  v-model="scenarioType"
                  placeholder="Scenario Type"
                  outlined
                  persistent-hint
                  style="padding-right: 4px !important; padding-left: 4px !important;"
                  :items="scenarioTypeItems"
                />
              </div>
              <div>
                <KSelect
                  v-model="language"
                  placeholder="Language"
                  outlined
                  persistent-hint
                  style="padding-right: 4px !important; padding-left: 4px !important;"
                  :items="languageItems"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'SendTrainingSelectUsersByCampaign',
  components: { KSelect },
  data() {
    return {
      search: '',
      scenarioType: '',
      language: '',
      scenarioTypeItems: [],
      languageItems: []
    }
  }
}
</script>
<style lang="scss"></style>
