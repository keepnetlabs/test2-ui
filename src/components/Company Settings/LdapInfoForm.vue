<template>
  <v-form lazy-validation ref="refForm">
    <form-group title="Integration Name" has-hint>
      <v-text-field
        placeholder="Enter integration name"
        outlined
        dense
        v-model.trim="formValues.name"
        hint="*Required"
        persistent-hint
        :rules="[(v) => validations.required(v, 'Required')]"
      ></v-text-field>
    </form-group>
    <form-group title="URL" has-hint>
      <InputUrl placeholder="Enter Active Directory URL" v-model.trim="formValues.url" />
    </form-group>
    <form-group title="Username" has-hint>
      <v-text-field
        placeholder="Enter username"
        outlined
        dense
        v-model.trim="formValues.userName"
        hint="*Required"
        persistent-hint
        :rules="[(v) => validations.required(v, 'Required')]"
      ></v-text-field>
    </form-group>
    <form-group title="Password" has-hint>
      <v-text-field
        placeholder="Enter password"
        outlined
        dense
        v-model.trim="formValues.password"
        hint="*Required"
        persistent-hint
        type="password"
        :rules="[(v) => validations.required(v, 'Required')]"
      ></v-text-field>
    </form-group>
    <form-group title="Filter">
      <v-text-field
        placeholder="Use a query to filter"
        outlined
        dense
        v-model.trim="formValues.filter"
      ></v-text-field>
    </form-group>
    <form-group title="Status">
      <div class="ldap-info__status">
        <v-btn
          @click="handleTestConnection"
          outlined
          rounded
          medium
          color="#2196f3"
          class="ldap-info__btn"
          >Test Connection
        </v-btn>
        <svg
          v-if="isLoading"
          class="add-in-settings__spinner ldap-info__status-loader"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="26"
          height="26"
          viewBox="0 0 24 24"
        >
          <defs>
            <path
              id="prefix__a"
              d="M5.553 16.134c0 .41-.15.758-.45 1.048-.301.29-.664.434-1.089.434-.416 0-.777-.147-1.081-.44-.305-.293-.457-.64-.457-1.042 0-.409.15-.758.45-1.047.301-.29.664-.434 1.088-.434.425 0 .788.144 1.088.434.3.29.45.638.45 1.047zm5.985 2.385c0 .408-.15.758-.45 1.047-.3.29-.663.434-1.088.434-.425 0-.787-.145-1.088-.434-.3-.29-.45-.639-.45-1.047 0-.41.15-.759.45-1.048.3-.29.663-.434 1.088-.434.425 0 .787.145 1.088.434.3.29.45.639.45 1.048zM3.077 10.37c0 .41-.15.758-.45 1.048-.301.29-.664.434-1.089.434-.424 0-.787-.145-1.087-.434-.3-.29-.451-.639-.451-1.048 0-.409.15-.758.45-1.047.301-.29.664-.434 1.088-.434.425 0 .788.145 1.088.434.3.29.45.638.45 1.047zm14.447 5.764c0 .401-.152.749-.457 1.042-.304.293-.665.44-1.081.44-.425 0-.788-.145-1.088-.434-.3-.29-.45-.639-.45-1.048 0-.409.15-.758.45-1.047.3-.29.663-.434 1.088-.434.424 0 .787.144 1.087.434.3.29.451.638.451 1.047zM5.937 4.606c0 .51-.188.946-.564 1.308-.377.363-.83.544-1.359.544-.528 0-.981-.181-1.358-.544-.376-.362-.565-.798-.565-1.308 0-.509.189-.945.565-1.307.377-.363.83-.544 1.358-.544.53 0 .982.181 1.359.544.376.362.564.798.564 1.307zM20 10.37c0 .41-.15.758-.45 1.048-.301.29-.664.434-1.088.434-.425 0-.788-.145-1.088-.434-.3-.29-.45-.639-.45-1.048 0-.409.15-.758.45-1.047.3-.29.663-.434 1.088-.434.424 0 .787.145 1.087.434.3.29.451.638.451 1.047zm-7.692-8.148c0 .618-.225 1.142-.673 1.574-.45.432-.994.648-1.635.648s-1.186-.216-1.635-.648c-.448-.432-.673-.956-.673-1.574 0-.617.225-1.142.673-1.574C8.815.216 9.36 0 10 0s1.186.216 1.635.648c.448.432.673.957.673 1.574zm6.37 2.384c0 .718-.265 1.33-.793 1.835-.53.505-1.162.758-1.9.758-.745 0-1.38-.253-1.904-.758-.525-.505-.788-1.117-.788-1.835 0-.71.263-1.319.788-1.828.524-.51 1.16-.764 1.905-.764.737 0 1.37.255 1.899.764.528.509.793 1.119.793 1.828z"
            />
          </defs>
          <g fill-rule="evenodd" transform="translate(2 2)">
            <mask id="prefix__b" fill="#fff">
              <use xlink:href="#prefix__a" />
            </mask>
            <use fill="#000" fill-rule="nonzero" xlink:href="#prefix__a" />
            <g fill="#fff" mask="url(#prefix__b)">
              <path fill="#00bcd4" d="M0 0H50V50H0z" transform="translate(-15 -15)" />
            </g>
          </g>
        </svg>
      </div>
    </form-group>
  </v-form>
</template>

<script>
import { mail, maxLength, required, url } from '@/utils/validations'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'

export default {
  name: 'LdapInfoForm',
  components: {
    FormGroup,
    InputUrl
  },
  data() {
    return {
      formValues: {
        name: '',
        url: '',
        userName: '',
        password: '',
        filter: ''
      },
      validations: {
        maxLength,
        required,
        url,
        mail
      },
      isLoading: false
    }
  },
  methods: {
    handleTestConnection() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.ldap-info {
  &__list-item {
    min-height: auto !important;
    max-width: 554px;
    &:not(:last-child) {
      margin-bottom: 14px;
    }
    .v-list-item__content {
      padding: 0;
      overflow: visible;
    }
    .v-card-headline {
      white-space: normal;
    }
  }
  &__btn {
    border-radius: 18px !important;
    border: solid 1px #2196f3 !important;
    max-width: 160px;
    .v-btn__content {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #2196f3;
    }
  }
  &__status {
    display: flex;
    align-items: center;
    &-loader {
      fill: #00bcd4;
    }
  }
}
</style>
