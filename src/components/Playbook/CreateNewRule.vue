<template>
  <div class="create-new-rule">
    <v-card flat light class="header">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-btn__icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline">Create New Rule</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-stepper light v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Rule Info</v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="e1 > 2" step="2">Condutions</v-stepper-step>
        <v-divider />
        <v-stepper-step step="3">Actions</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <div class="body"><h1>BB MRB</h1></div>
          <div class="footer">
            <v-btn outlined rounded color="error">Cancel</v-btn>
            <v-btn rounded color="primary" @click="e1 = 2">
              NEXT
              <v-icon right dark>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12">
            <h1>BB MRB</h1>
          </v-card>

          <v-btn color="primary" @click="e1 = 3">
            Continue
          </v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12">
            <h1>BB MRB</h1>
          </v-card>

          <v-btn color="primary" @click="e1 = 1">
            Continue
          </v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
  name: 'CreateNewRule',
  data() {
    return {
      e1: 1
    }
  }
}
</script>
<style lang="scss">
.create-new-rule {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .v-stepper {
    align-self: stretch;
    box-shadow: none;
    .v-stepper__header {
      justify-content: flex-start;
      padding: 0 6rem;
      height: 4rem;
      box-shadow: none;
      background-color: #f5f7fa;

      .v-divider {
        max-width: 65px;
        border-color: #757575 !important;
        margin: 0px -8px;
      }

      & > div:nth-child(1) {
        padding-left: 0;
      }

      .v-stepper__step {
        padding: 0 24px;

        .v-stepper__step__step {
          font-size: 1rem;
        }
      }

      .v-stepper__step--active {
        .v-stepper__step__step {
          background-color: transparent !important;
          color: #2196f3 !important;
          border: 1.5px solid #2196f3 !important;
        }
      }

      .v-stepper__step--inactive {
        .v-stepper__step__step {
          background-color: transparent !important;
          color: #909399 !important;
          border: 1.5px solid #909399 !important;
        }

        .v-stepper__label {
          color: rgba(0, 0, 0, 0.87) !important;
        }
      }

      .v-stepper__step--complete {
        .v-stepper__step__step {
          background-color: #2196f3 !important;
          color: white !important;
          border: 1.5px solid #2196f3 !important;
          height: 20px;
          min-width: 20px;
          width: 20px;

          .v-icon.v-icon {
            font-size: 1.325rem;
          }
        }

        .v-stepper__label {
          color: rgba(0, 0, 0, 0.87) !important;
        }
      }

      .v-stepper__label {
        font-size: 16px;
      }
    }

    .v-stepper__content {
      padding: 0 !important;

      .body {
        display: flex;
        padding-left: 2rem 4rem;
        width: 100%;
        height: 100%;
      }

      .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 4rem;
        height: 5rem;
        align-items: center;
        background-color: #f5f7fa;
      }
    }
  }

  .v-card.header {
    padding: 2rem 6rem !important;

    .v-btn__icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      margin-right: 24px;
      box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
      border: solid 1px rgba(100, 181, 246, 0.5);
      background-color: #e3f2fd;
    }

    .v-list-item__title {
      font-size: 20px;
      font-weight: 600;
      color: #2196f3;
    }
  }
}
</style>
