<template>
  <div class="workshop">
    <v-layout wrap class="workshop__container">
      <v-card class="workshop__container-card">
        <v-form ref="form1" lazy-validation>
          <v-row>
            <v-col cols="5"><InputPhone v-model="formData.inputFirstName" /></v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>{{ formData.inputFirstName }}</p>
              <v-btn rounded color="primary" @click="submit">
                SAVE
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import InputPhone from '@/components/Common/Inputs/InputPhone'

export default {
  name: 'Workshop',
  props: {},
  components: { InputPhone },
  data() {
    return {
      formData: {
        inputFirstName: null
      }
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs.form1.validate()
      alert(this.$refs.form1.validate())
    }
  }
}
</script>

<style lang="scss">
.workshop {
  min-height: 80vh !important;
  padding-top: 10px;
  &__container {
    padding: 0 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
