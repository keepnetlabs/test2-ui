<template>
  <v-footer class="k-footer d-flex">
    <div class="footer-item__primary">
      Copyright Keepnet Labs &copy; {{ new Date().getFullYear() }}
    </div>
    <div class="footer-item__secondary footer-links">
      <a class="footer-item__secondary--1" href="#">Privacy Policy</a>
      <div>&bull;</div>
      <a class="footer-item__secondary--2" href="#">Terms and Conditions</a>
      <div class="footer-item__secondary--3">&bull;</div>
    </div>
    <div class="footer-item__third footer-links">
      <a class="footer-item__third--1" href="#">Cookie Policy</a>
      <div>&bull;</div>
      <a class="footer-item__third--2" href="#">EULA</a>
    </div>
    <div class="footer-item__fourth">Designed by Keepnet Labs</div>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style lang="scss">
.k-footer {
  background-color: white !important;
  box-shadow: 0 2px 20px 0 rgba(205, 205, 205, 0.5) !important;
  flex-wrap: wrap;
  @media only screen and (max-width: 1025px) {
    justify-content: center;
    padding-bottom: 16px;
  }
  &.v-footer {
    align-items: center;
    display: flex;
    height: 47px;
    position: absolute;
    bottom: -40px;
    width: 100%;
    @media (max-width: 719px) {
      height: 144px !important;
    }
    @media (max-width: 1025px) and (min-width: 719px) {
      height: 84px !important;
    }
  }
}

.footer-links {
  align-items: center;
  display: flex;

  a {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    text-decoration: none;
    padding: 0 16px;
    @media only screen and (min-width: 719px) and (max-width: 1025px) {
      padding: 0 8px;
    }
  }
}

.footer-item {
  flex: 1;
  &__primary {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: normal;
    color: #000000;
    order: 1;
    flex-grow: 1;
    @media only screen and (max-width: 1025px) and (min-width: 719px) {
      flex-grow: 0;
      order: 3;
      flex-basis: 52%;
      justify-content: flex-end;
      display: flex;
      padding-right: 24px;
    }
    @media only screen and (max-width: 719px) {
      flex-grow: 0;
      order: 3;
      padding: 0 25px;
    }
  }

  &__secondary {
    order: 2;
    @media only screen and (max-width: 1025px) and (min-width: 719px) {
      order: 1;
      flex-basis: 55%;
      justify-content: flex-end;
    }
    @media only screen and (max-width: 719px) {
      order: 1;
      flex-basis: 100%;
      justify-content: center;
    }
    &--1 {
      @media only screen and (max-width: 719px) {
        order: 2;
      }
    }
    &--2 {
      @media only screen and (max-width: 719px) {
        order: -1;
      }
    }
    &--3 {
      @media only screen and (max-width: 719px) {
        display: none;
      }
    }
  }

  &__third {
    order: 3;
    flex-grow: 1;
    @media only screen and (max-width: 1025px) and (min-width: 719px) {
      flex-grow: 0;
      order: 2;
      flex-basis: 45%;
    }
    @media only screen and (max-width: 719px) {
      flex-grow: 0;
      order: 2;
      flex-basis: 100%;
      justify-content: center;
    }

    &--1 {
      order: 2;
      @media only screen and (max-width: 1025px) and (min-width: 719px) {
        order: -1;
      }
    }

    &--2 {
      order: -1;
      @media only screen and (max-width: 1025px) and (min-width: 719px) {
        order: 2;
      }
    }
  }

  &__fourth {
    order: 4;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: normal;
    color: #000000 !important;
    @media only screen and (max-width: 1025px) and (min-width: 719px) {
      flex-basis: 48%;
    }
    @media only screen and (max-width: 719px) {
      padding: 0 25px;
      flex-basis: 100%;
      justify-content: center;
      display: flex;
    }
  }
}
</style>
