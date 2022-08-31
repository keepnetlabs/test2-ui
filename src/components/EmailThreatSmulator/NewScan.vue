<template>
  <div>
    <app-dialog
      v-if="permissionModalStatus"
      :status="permissionModalStatus"
      className="email-threat-simulator-warning"
      icon="mdi-information"
      iconColor="#f56c6c"
      title="Warning!"
      subtitle="Do not use your real email accounts"
      body="We recommend creating a test account and even using virtual machine because of the potential security problems."
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="permissionModalStatus = false"
              >I UNDERSTAND
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-modal :status="status" icon-name="mdi-shield-half-full" :title="pageTitle">
      <template v-slot:overlay-body>
        <v-stepper light v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
              >Email Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
              >Scan and Delivery
            </v-stepper-step>
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
              >User Agreement
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="k-stepper__items">
            <v-stepper-content class="k-stepper__content" :step="1">
              <div class="ets-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      Email Login Information</v-list-item-title
                    >
                    <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                      >Enter email information</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-alert
                  v-if="emailLoginStatus"
                  dense
                  color="rgba(245, 108, 108, 0.2)"
                  class="mt-8"
                  max-width="600"
                >
                  <v-container fill-height fluid size="14">
                    <v-icon class="pa-2" size="24" marig color="#f56c6c"> mdi-close-circle </v-icon>
                    <strong
                      class="pa-2"
                      v-if="submitError.isArray"
                      v-for="(error, index) in submitError.message"
                      :key="index"
                    >
                      {{ error }}
                    </strong>
                    <strong class="pa-2" v-if="!submitError.isArray">{{
                      submitError.message
                    }}</strong>
                  </v-container>
                </v-alert>
                <v-form ref="refFormStep1" lazy-validation class="mt-8">
                  <form-group
                    title="Test Email Address"
                    sub-title="Enter email address that you created for test purposes"
                    hint
                  >
                    <InputEmail
                      v-model.trim="emailSettingsValues.email"
                      entityName="email address"
                      initialPlaceholder="Email address"
                      hint
                    />
                  </form-group>
                  <form-group
                    title="Choose an Option"
                    sub-title="Automate the scan via entering the password to your account or choose the manual <br/> method to manually find penetrated emails."
                  >
                    <div class="radio-btn-list">
                      <v-radio-group
                        class="option-radio"
                        v-model="emailSettingsValues.scanType"
                        :mandatory="false"
                        row
                        hide-details
                      >
                        <v-radio
                          v-for="(item, index) in scanOptions"
                          :key="index"
                          :value="item.value"
                          :label="item.label"
                          color="#2196f3"
                        />
                      </v-radio-group>
                    </div>
                  </form-group>
                  <form-group
                    class-name="mt-4"
                    v-if="emailSettingsValues.scanType == 'Manual'"
                    title="Manual"
                    sub-title="You must open manually every email that you received from <br/>
                     noreply@emailthreatsimulator.com and click 'Report as failed'.
                     <br/>(We don’t recommend this option)"
                  >
                  </form-group>
                  <form-group
                    title="Password"
                    sub-title="Use your account password"
                    has-hint
                    class-name="mt-8"
                  >
                    <v-text-field
                      v-bind="commonRules(emailSettingsValues.scanType == 'Manual' ? false : true)"
                      v-model="emailSettingsValues.password"
                      outlined
                      dense
                      placeholder="Password"
                      hint=""
                      type="password"
                      place
                      :disabled="emailSettingsValues.scanType == 'Manual' ? true : false"
                    />
                    <v-checkbox
                      v-model="emailSettingsValues.owa"
                      color="#2196f3"
                      label="OWA"
                      :disabled="emailSettingsValues.scanType == 'Manual' ? true : false"
                    />
                    <div v-if="emailSettingsValues.owa" class="label-left-form">
                      <label>OWA URL</label>
                      <v-text-field
                        class="ml-2"
                        v-bind="commonRules(emailSettingsValues.owa)"
                        v-model="emailSettingsValues.owaUrl"
                        outlined
                        hint=""
                        placeholder="OWA URL"
                      />
                    </div>
                    <div v-if="emailSettingsValues.owa" class="label-left-form">
                      <label>Username</label>
                      <v-text-field
                        class="ml-2"
                        v-bind="commonRules(emailSettingsValues.owa)"
                        v-model="emailSettingsValues.username"
                        outlined
                        hint=""
                        placeholder="Username"
                      />
                    </div>
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <div class="ets-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      Scan and Delivery Settings</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-alert
                  v-if="continuosScanErrortext !== ''"
                  type="error"
                  class="mt-8"
                  max-width="600"
                >
                  {{ continuosScanErrortext }}
                </v-alert>

                <v-form ref="refFormStep2" lazy-validation class="mt-8">
                  <form-group title="Continuos Scan" hint>
                    <v-checkbox
                      v-model="scanAndDeliveryValues.continuousScan"
                      color="#2196f3"
                      label="Scan with new attack vectors when added"
                      @change="getTotalCounts($event)"
                    />
                    <v-alert
                      v-if="scanAndDeliveryValues.continuousScan && totalCountMassage != ''"
                      dense
                      border="left"
                      type="warning"
                      icon="mdi-alert-outline"
                    >
                      {{ totalCountMassage }}
                    </v-alert>
                  </form-group>
                  <form-group
                    title="Distribution"
                    sub-title="Send emails with selected intervals or over a specified time period. Limit number of emails to be sent in each batch."
                    class="mt-8"
                  >
                    <div class="label-left-form">
                      <label class="little">Sending Limit</label>
                      <v-text-field
                        v-model="scanAndDeliveryValues.sendingLimit"
                        class="shrink mx-1"
                        type="number"
                        outlined
                        hint=""
                        placeholder="Sending Limit"
                        :disabled="
                          scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP' ? false : true
                        "
                      />
                    </div>
                    <v-radio-group
                      class="option-radio my-0"
                      v-model="scanAndDeliveryValues.sendingLoopType.loopType"
                      :mandatory="false"
                      column
                      hide-details
                    >
                      <div>
                        <v-radio
                          active-class="active"
                          value="SMTP"
                          label="Send emails with SMTP Delay every"
                          color="#2196f3"
                          class="float-md-left pt-1"
                        />
                        <div class="loop-type-input-container">
                          <div class="float-md-left left-input">
                            <v-text-field
                              v-model="scanAndDeliveryValues.sendingLoopType.smtpTimeMinute"
                              class="shrink mx-5"
                              type="number"
                              outlined
                              hint=""
                              placeholder="Sending Limit"
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? false
                                  : true
                              "
                            />
                          </div>
                          <div class="float-md-left right-input">
                            <v-select
                              v-model="scanAndDeliveryValues.sendingLoopType.smtpTimeType"
                              :items="smtpTimeTypes"
                              item-disabled="disabled"
                              item-text="text"
                              item-value="value"
                              outlined
                              required
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? false
                                  : true
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <v-radio
                          active-class="active"
                          value="DistributeEmails"
                          label="Distribute emails over "
                          color="#2196f3"
                          class="float-md-left pt-1"
                        />
                        <div class="loop-type-input-container">
                          <div class="float-md-left left-input">
                            <v-text-field
                              v-model="scanAndDeliveryValues.sendingLoopType.distributeTimeMinute"
                              class="shrink mx-5"
                              type="number"
                              outlined
                              hint=""
                              placeholder="Sending Limit"
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? true
                                  : false
                              "
                            />
                          </div>
                          <div class="float-md-left right-input">
                            <v-select
                              v-model="scanAndDeliveryValues.sendingLoopType.distributeTimeType"
                              :items="timeTypes"
                              item-disabled="disabled"
                              item-text="text"
                              item-value="value"
                              outlined
                              required
                              persistent-hint
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? true
                                  : false
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </v-radio-group>
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="3">
              <div class="ets-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      User Agreement</v-list-item-title
                    >
                    <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                      >Accept user agreement to start the scan</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-form ref="refFormStep3" lazy-validation>
                  <form-group hint class-name="mt-8">
                    <div class="user-agreement-container">
                      <strong>Keepnet Labs Limited</strong><br />
                      <strong>End User License Agreement (EULA)</strong><br />
                      PLEASE READ CAREFULLY BEFORE EXECUTING. This End User License Agreement
                      (“EULA”) is a binding legal agreement between (a) the entity for which you are
                      an authorised representative (“You”, Your”, “End User” or “Licensee”), and (b)
                      Keepnet Labs Limited, a United Kingdom corporation (“Keepnet” or “KNL”), that
                      governs the use of Keepnet’s email defence software, appliances, and other
                      products and solutions, (collectively, the “Product”), maintenance and support
                      services, professional services packages and training.
                      <br />
                      BY EXECUTING BELOW, YOU (1) REPRESENT THAT YOU ARE AN AUTHORISED
                      REPRESENTATIVE OF THE END USER LICENSING THE PRODUCT AND MAY ENTER INTO THIS
                      EULA ON ITS BEHALF, AND (2) ON BEHALF OF THE END USER, AGREE THAT END USER
                      WILL BE BOUND BY THE TERMS OF THIS EULA. IF YOU DO NOT ACCEPT THE EULA TERMS
                      ON BEHALF OF THE END USER, DO NOT EXECUTE.
                      <br />
                      1. LICENSE GRANT. The Product includes (1) software that is owned by KNL (and
                      may include associated media, and “online” or electronic documentation), (2)
                      other software provided by third parties and used in conjunction with the
                      Product (“Third Party Software”), and (3) appliances, all of which is detailed
                      at www.keepnetlabs.com/legal/products. KNL grants End User the following
                      non-exclusive rights provided End User agrees to, and complies with, all terms
                      and conditions of this EULA.
                      <br />
                      a. PERMISSIBLE USE. End User may use the Product for the number of user
                      licenses purchased hereby. End User may not use the Product beyond the number
                      of user licenses purchased and End User does not have the right to distribute
                      the Product. End User agrees to only use the Product as expressly permitted
                      herein.
                      <br />
                      b. RESERVATION OF RIGHTS. The Product is licensed, not sold, to End User by
                      KNL. KNL owns all right, title and interest in and to the Product and reserves
                      all rights not expressly granted to End User in this EULA. End User agrees to
                      refrain from any action that would diminish such rights.
                      <br />
                      c. THIRD PARTY SOFTWARE. Notwithstanding the terms and conditions of this
                      EULA, all or any portion of the Product which constitutes Third Party
                      Software, is licensed to End User subject to the terms and conditions of the
                      software license agreements between KNL and the third-party licensors. Use of
                      the Third Party Software by End User shall be governed entirely by the terms
                      and conditions of third party licenses.
                      <br />
                      2. ENTERPRISE SUPPORT; PROFESSIONAL SERVICES PACKAGES. Enterprise support and
                      maintenance for the Product is described in detail and available for review at
                      www.keepnetlabs.com/support/terms. Maintenance and support is included in the
                      license fees for the Product, including upgrades to the latest software
                      release; provided, however, if you have customised appliances, then the annual
                      fee for continuously upgrading the customised appliances to the latest
                      software release is twenty percent of the original development cost of each
                      customised appliance. Support is available 24/7/365 via e-mail at
                      support@keepnetlabs.com. Professional services shall be provided in accordance
                      with the terms and conditions of the Professional Services Package (“PSP”)
                      located at www.keepnetlabs.com/ legal/psp. Additional training may be
                      purchased in accordance with the training order form found at
                      www.keepnetlabs.com/legal/training.
                      <br />
                      3. TRANSFER. The Product may only be utilised by entities associated with the
                      End User (“Affiliates”). In the event of the sale or merger of End User to
                      another entity, the resultant entity will be obligated to comply with all of
                      the EULA terms.
                      <br />
                      4. RESTRICTIONS. End User may not sublicense, assign or transfer the license
                      or Product except as expressly provided in this EULA.
                      <br />
                      5. PROPRIETARY RIGHTS. All intellectual property rights in the Product and
                      user documentation (“Documentation”) are owned by KNL and are protected by
                      law, including but not limited to patent, copyright, trade secret, and
                      trademark law, as well as other applicable laws and international treaty
                      provisions.
                      <br />
                      6. LIMITATION ON REVERSE ENGINEERING. End User is not permitted, and agrees
                      not to, reverse engineer, decompile, disassemble or create derivative works of
                      or modify the Product. Nothing contained herein shall be construed, expressly
                      or implicitly, as transferring any right, license or title to End User other
                      than those explicitly granted under this EULA. KNL reserves all rights in its
                      intellectual property not expressly agreed to herein. Unauthorised copying of
                      the Product or failure to comply with the restrictions in this EULA (or other
                      breach of the license herein) will result in automatic termination of this
                      EULA and End User agrees that any unauthorised use will constitute immediate,
                      irreparable harm to KNL for which monetary damages would be an inadequate
                      remedy, and that injunctive relief will be an appropriate remedy for such
                      breach.
                      <br />
                      7. TERM. This EULA is effective for the initial term of the license, and shall
                      automatically renew for successive one (1) year terms unless End User notifies
                      KNL in writing of its intention to cancel the Agreement no less than 90 days
                      prior to conclusion of a term (“Initial Term” and “Successive Term” shall
                      collectively be referred to herein as the “Term”). KNL will notify End User in
                      writing of the upcoming expiration of this EULA no less than ninety (90) days
                      prior to the conclusion of the Initial Term or Successive Term, as the case
                      may be. End User may terminate this EULA in the event KNL materially breaches
                      this Agreement and fails to cure such breach within thirty (30) days of
                      receiving notice thereof. KNL may terminate End User’s license in the event
                      End User materially breaches the terms of this Agreement and End User fails to
                      cure such breach within thirty (30) days of receiving notice thereof. Upon
                      such termination, End User shall promptly return or destroy all copies of the
                      Product and the Documentation. In the case of the latter, End User shall
                      provide written confirmation thereof.
                      <br />
                      8. CONSENT TO USE OF DATA. End User agrees that KNL and its affiliates or
                      suppliers may collect and use statistics on End User’s use of the Product in
                      performing backup operations and technical information End User provides,
                      solely in relation to support services related to the Product. KNL agrees not
                      to use this information in a form that personally identifies End User except
                      to the extent necessary to provide such services.
                      <br />
                      9. WARRANTIES. The Product will perform in substantial accordance with the
                      Documentation. The Product, and any updates or upgrades thereto provided by
                      KNL, will not, at the time KNL delivers it to End User, contain any viruses,
                      worms, spyware, time bombs or other malware or programming devices that are
                      designed to modify, delete, damage, disable or deactivate any software,
                      hardware, data or systems of End User. KNL shall not be responsible for any
                      infections to the Product by viruses, worms, spyware, time bombs or other
                      malware that occur after the Software has been delivered to End User. KNL will
                      monitor data security industry information to identify any systemic threats to
                      the authentication architecture used by KNL, will immediately notify End User
                      of any such threats, and will use commercially reasonable efforts to modify
                      the Product as required to eliminate such threats. KNL has implemented
                      disaster recovery procedures to ensure that all Software-related services
                      provided to End User under this Agreement will resume with full functionality
                      within 48 hours following any disaster. If the Product does not perform as
                      warranted, KNL shall promptly use commercially reasonable efforts to correct
                      the Product, or if the correction of the Product is not reasonably possible,
                      replace all applicable portions of the Product, free of charge, with
                      replacement software that contains at least the equivalent performance and
                      functionality of the affected Product. If neither of the foregoing is
                      commercially practicable or if neither have been achieved within 30 days after
                      the earlier of the date on which either KNL or End User identifies the
                      performance deficiency, either party may, in its sole discretion, terminate
                      this Agreement with respect to the non- conforming program or programs, and in
                      such event KNL shall refund the monies paid by End User attributable to such
                      non-conforming Product. The foregoing are the sole and exclusive remedies of
                      End User for breach of the warranty set forth in this Section 9. The
                      warranties set forth above are made to and for the benefit of End User and its
                      Affiliates and will be enforceable against KNL only if the Product has been
                      used at all times in substantial accordance with the instructions for such use
                      set forth in the Documentation and, except as authorised by KNL in writing,
                      End User has not made or caused to be made modifications, alterations or
                      additions to the Product that cause it to deviate from the Documentation in a
                      manner that causes the breach of the warranty.
                      <br />
                      10. DISCLAIMER OF WARRANTIES. EXCEPT AS OTHERWISE EXPRESSLY WARRANTED IN THIS
                      EULA, KNL DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED OR STATUTORY, INCLUDING
                      WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A
                      PARTICULAR PURPOSE (EVEN IF KNL HAD BEEN INFORMED OF SUCH PURPOSE), OR ANY
                      WARRANTIES ARISING FROM COURSE OF DEALING, COURSE OF PERFORMANCE, OR UKNLGE OF
                      TRADE. LICENSEE HEREBY ACKNOWLEDGES AND AGREES THAT IN EACH JURISDICTION IN
                      WHICH ANY SUCH DISCLAIMER IS UNENFORCEABLE, THE DURATION OF ANY SUCH IMPLIED
                      SOFTWARE PERFORMANCE WARRANTIES IS LIMITED
                      <br />
                      TO THIRTY (30) DAYS FROM THE DELIVERY DATE OF THE PRODUCT; PROVIDED, HOWEVER,
                      THAT THE SOLE REMEDY OF LICENSEE FOR BREACH OF ANY SUCH IMPLIED SOFTWARE
                      PERFORMANCE WARRANTY SHALL BE THAT KNL WILL, AT ITS OPTION, REPAIR OR REPLACE
                      THE COPY OF THE PRODUCT HELD BY LICENSEE, OR TERMINATE THIS AGREEMENT AND
                      REFUND AMOUNTS ALREADY PAID THEREFOR BY LICENSEE. IN ADDITION, KEEPNET
                      PROVIDES NON-KEEPNET PRODUCTS WITHOUT WARRANTIES OF ANY KIND, UNLESS KEEPNET
                      SPECIFIES
                      <br />
                      IN WRITING OTHERWISE; PROVIDED, HOWEVER, THE NON-KEEPNET MANUFACTURERS,
                      SUPPLIERS, OR PUBLISHERS MAY PROVIDE THEIR OWN WARRANTIES, AND KEEPNET AGREES
                      TO INFORM LICENSEE, UPON REQUEST (1) WHICH PRODUCTS ARE NON-KEEPNET PRODUCTS,
                      (2) THE MANUFACTURER OR SUPPLIER WHO IS RESPONSIBLE FOR WARRANTY (IF ANY)
                      RELATING THERETO, AND (3) THE PROCEDURE TO OBTAIN ANY WARRANTY SERVICE
                      THEREON.
                      <br />
                      11. LIMITATION OF LIABILITY. EXCEPT FOR ANY CLAIMS ARISING UNDER SECTIONS 9
                      (WARRANTIES) OR 12 (INDEMNIFICATION), OR WHICH ARE BASED UPON GROSS NEGLIGENCE
                      OR INTENTIONAL MISCONDUCT, REGARDLESS OF WHETHER ANY REMEDY SET FORTH HEREIN
                      FAILS OF ITS ESSENTIAL PURPOSE OR OTHERWISE, TO THE EXTENT PERMITTED BY THE
                      LAW OF THE JURISDICTION IN WHICH END USER PROCURED THIS LICENSE: (A) KNL AND
                      END USER (INCLUDING ANY AFFILIATES OF END USER) WILL NOT BE LIABLE FOR ANY
                      INDIRECT,EXEMPLARY, SPECIAL, CONSEQUENTIAL, OR INCIDENTAL DAMAGES OF ANY
                      CHARACTER, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR COMPUTER MALFUNCTION,
                      LOSS OF INFORMATION, LOST PROFITS AND BUSINESS INTERRUPTION, AND THE COST TO
                      OBTAIN A SUBSTITUTE PRODUCT, ARISING IN ANY WAY OUT OF THIS AGREEMENT OR THE
                      USE OF (OR INABILITY TO USE) THE PRODUCT, HOWEVER CAUSED, AND WHETHER ARISING
                      UNDER A THEORY OF CONTRACT, TORT OR ANY OTHER LEGAL THEORY, EVEN IF KNL OR END
                      USER WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES; (B) IN NO EVENT WILL
                      KNL’S TOTAL LIABILITY TO END USER RELATING TO THIS AGREEMENT OR THE USE (OR
                      INABILITY TO USE) THE PRODUCT EXCEED THE LARGER OF THE SUM OF ONE MILLION
                      DOLLARS ($1,000,000.00) OR THE CUMULATIVE AMOUNT PAID BY END USER UNDER THIS
                      AGREEMENT; AND (C) IN NO EVENT WILL END USER’S TOTAL LIABILITY TO KNL RELATING
                      TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID BY END USER UNDER THIS
                      AGREEMENT. SOME STATES OR JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR
                      LIMITATION OF INCIDENTAL, CONSEQUENTIAL OR SPECIAL DAMAGES, SO THE ABOVE
                      LIMITATIONS MAY NOT APPLY TO END USER; PROVIDED, HOWEVER, KNL IS LICENSING THE
                      SOFTWARE TO END USER ON THE EXPRESS CONDITION THAT END USER AGREES TO THE
                      “DISCLAIMER
                      <br />
                      OF WARRANTIES” AND “LIMITATION OF LIABILITY” PROVISIONS IN THIS AGREEMENT. NO
                      EMPLOYEE, AGENT, REPRESENTATIVE OR AFFILIATE OF KNL HAS THE AUTHORITY TO BIND
                      KNL TO ANY ORAL REPRESENTATIONS OR WARRANTY CONCERNING THE PRODUCT. ANY
                      WRITTEN REPRESENTATIONS OR WARRANTY NOT EXPRESSLY CONTAINED IN THIS AGREEMENT
                      ARE UNENFORCEABLE.
                      <br />
                      12. INDEMNIFICATION. End User agrees to indemnify and hold KNL and its
                      officers, directors, employees, agents, representatives and licensors harmless
                      from any claim or demand (including but not limited to reasonable legal fees)
                      made by a third party due to or arising out of or related to End User’s
                      violation of the terms and conditions of this Agreement, End User’s violation
                      of any laws, regulations or third party rights or End User’s gross negligence
                      or wilful misconduct. KNL agrees to indemnify, defend and hold End User and
                      its Affiliates harmless,
                      <br />
                      at KNL’s expense, from any claims, demands, actions, suits, damages, losses,
                      liabilities, costs or expenses of any nature, including, without limitation,
                      reasonable attorneys’ fees, incurred by End User or its Affiliate(s) as a
                      result of any breach of this Agreement by KNL or any of the representations or
                      warranties contained in this Agreement. In the event of an infringement claim,
                      KNL shall have no obligation pursuant to this Section 12 to the extent the
                      claim is caused by the modification of the Product by End User or its agents,
                      without KNL’s prior written consent, that cause it to deviate from the
                      Documentation, or to the extent the infringement is caused by the use of other
                      than the most current version of the Product if the current version would be
                      non-infringing, has been made available in a timely manner to End User at no
                      additional charge, and End User has had sufficient time to install, execute
                      and operate
                      <br />
                      such current version without impacting its business operations. If the
                      unmodified Product becomes, or in KNL’s opinion is likely to become, the
                      subject of a claim of infringement or misappropriation, KNL shall, at its
                      option and expense, promptly either: (i) modify or replace the Product to be
                      non-infringing while giving equivalent performance and functionality, or (ii)
                      obtain for End User the right to continue using the Product under terms
                      substantially similar to those then in effect under this Agreement.
                      <br />
                      13. AUDIT. Keepnet may, at its expense, upon reasonable prior written notice
                      to End User and during standard business hours, audit End User with respect to
                      its compliance with the terms of this Agreement no more than once per year.
                      You understand and acknowledge that Keepnet utilizes a number of methods to
                      verify and support software use by its customers. These methods may include
                      technological features of the Product that prevent unauthorised use and
                      provide software deployment verification. Upon reasonable request, you will
                      provide a system-generated report verifying your deployment of the Product,
                      including the number of unique users of the Product. The foregoing request
                      shall not occur more than once per year, and Keepnet will not unreasonably
                      interfere with the conduct of your business in connection with any audit.
                      <br />
                      14. EXPORT CONTROLS. You acknowledge that the Product is subject to U.K. and,
                      when applicable, European Union and other export regulations. You shall comply
                      with applicable export and import laws and regulations for the jurisdiction in
                      which the Product will be imported and/or exported. You shall not export the
                      Product to any individual, entity or country prohibited by applicable law or
                      regulation. You are responsible, at your own expense, for any local government
                      permits, licenses or approvals required for importing and/or exporting the
                      Product.
                      <br />
                      15. APPLICABLE LAW. This EULA is governed by the laws of the United Kingdom
                      exclusive of conflict of law provisions and End User agrees to the
                      jurisdiction of the courts of Dover County, State of Delaware, with respect to
                      any proceedings arising from this EULA. The parties hereby agree that this
                      Agreement is not governed by the United Nations Convention on Contracts for
                      the International sale of Goods.
                      <br />
                      16. MISCELLANEOUS. This EULA, along with the quote provided by KNL and
                      executed by End User, is the entire agreement between End User and KNL
                      relating to the Product and it supersedes all prior or contemporaneous oral or
                      written communications, proposals and representations with respect to the
                      Product or any other subject matter covered by this EULA. If any provision of
                      this EULA is held by a court of competent jurisdiction to be contrary to law,
                      such provision will be changed and interpreted so as to best accomplish the
                      objectives of the original provision to the fullest extent allowed by law and
                      the remaining provision of the EULA will remain in force and effect. If you
                      issue an order to a reseller of Keepnet or to Keepnet directly and the terms
                      and conditions of the order conflict with the terms and conditions of this
                      Agreement, then the terms and conditions specified in this Agreement shall
                      control. This Agreement may not be modified except by a written addendum
                      issued by a duly authorised representative of Keepnet. No provision hereof
                      shall be deemed waived unless such waiver shall be in writing and signed by
                      Keepnet. All notices, requests, demands and determinations for Keepnet under
                      this Agreement (other than routine operational communications) shall be sent
                      to: Keepnet Labs Limited, Future Business Centre, King’s Hedges Road,
                      Cambridge, CB4 2HY, United Kingdom, Attn: Legal Dept. Sections 3, 4, 5, 6, 9,
                      10, 11, 12, 14 and 15 shall survive termination of this EULA.
                      <br />
                      The only warranties for the Product are set forth herein. Nothing herein
                      should be construed as constituting an additional warranty. KNL shall not be
                      liable for technical or editorial errors or omissions contained herein.
                      Portions of the Product include technology used under third party license.
                    </div>
                    <v-checkbox
                      v-model="acceptRule"
                      color="#2196f3"
                      label="I accept the user agreement"
                      :rules="validateCheckbox"
                    />
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template #overlay-footer>
        <StepperFooter
          :max-step="3"
          :step.sync="step"
          :disabled-statuses="{ nextButton: isSubmitDisabled, submitButton: !acceptRule }"
          @on-cancel="closeNewScanPopup"
          @on-back="backStep"
          @on-next="nextStep(+1)"
          @on-submit="submit"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '../AppModal'
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import StepperFooter from '@/components/Stepper/StepperFooter'
import {
  getValidateContinuousScan,
  getQuickScanCount,
  getQuickScanCreate
} from '@/api/emailThreatSimlator'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'NewScan',
  components: {
    StepperFooter,
    AppModal,
    AppDialog,
    FormGroup,
    InputEmail
  },
  data() {
    return {
      selectedTab: '1',
      emailLoginStatus: false,
      smtpTimeTypes: ['seconds', 'minutes', 'hours'],
      timeTypes: ['hours', 'minutes'],
      scanOptions: [
        {
          value: 'Automate',
          label: 'Automate with password'
        },
        {
          value: 'Manual',
          label: 'Manual (no password is required)'
        }
      ],
      labels,
      step: 1,
      Validations: Validations,
      emailSettingsValues: {
        email: '',
        scanType: 'Automate',
        password: '',
        owa: false,
        owaUrl: '',
        username: '',
        methodTypeId: '1'
      },
      scanAndDeliveryValues: {
        continuousScan: false,
        sendingLimit: 50,
        sendingLoopType: {
          loopType: 'SMTP',
          smtpTimeMinute: 20,
          smtpTimeType: 'seconds',
          distributeTimeMinute: 20,
          distributeTimeType: 'hours'
        }
      },
      acceptRule: false,
      baseRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(''))
        ]
      },
      permissionModalStatus: true,
      isSubmitDisabled: false,
      continuosScanErrortext: '',
      pageTitle: 'Create New Scan',
      submitError: {
        isArray: false,
        message: ''
      },
      isFormValuesChanged: false,
      totalCountMassage: ''
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    scanDetails: {
      required: true,
      type: Object
    }
  },
  methods: {
    commonRules(isNeed) {
      if (isNeed) {
        return this.baseRules
      }
    },
    getTotalCounts(val) {
      if (val) {
        getQuickScanCount().then((response) => {
          const data = response.data
          this.totalCountMassage = data.message
        })
      }
    },
    nextStep() {
      const currentStep = JSON.parse(JSON.stringify(this.step))
      if (currentStep === 1) {
        if (this.$refs.refFormStep1.validate()) {
          this.step += 1
        } else {
          const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
          scrollToComponent(el)
        }
      }
      if (currentStep === 2) {
        this.continuosScanErrortext = ''
        if (this.scanAndDeliveryValues.continuousScan) {
          getValidateContinuousScan({
            email: this.emailSettingsValues.email
          })
            .then((response) => {
              if (response.data.data.isValidateContinuousScan) {
                this.step += 1
              }
            })
            .catch((error) => {
              this.continuosScanErrortext = error.response.data.message
            })
        } else {
          this.step += 1
        }
      }
    },
    backStep() {
      this.step -= 1
      this.isSubmitDisabled = false
    },
    closeNewScanPopup() {
      if (!this.isFormValuesChanged) {
        return this.$emit('changeNewScanModalStatus', false)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('changeNewScanModalStatus', false)
        }
      })
    },
    calculateTimeType(time, type, isDelayEvery) {
      const t = parseInt(time)
      if (isDelayEvery) {
        if (type === 'minutes') {
          return t * 60
        } else if (type === 'hours') {
          return t * 60 * 60
        }
        return t
      } else {
        if (type === 'hours') {
          return t * 60
        }
        return t
      }
    },
    submit() {
      if (this.$refs.refFormStep3.validate()) {
        this.emailLoginStatus = false
        const requestBody = {
          email: '',
          password: '',
          mailTestType: '2',
          owaUrl: '',
          owaUsername: '',
          isContinuousScan: false,
          delaySeconds: 0,
          sendingLimit: 0,
          distributeEmailOverMinutes: 0
        }
        requestBody.email = this.emailSettingsValues.email
        requestBody.password = this.emailSettingsValues.password
        if (this.emailSettingsValues.scanType === 'Manual') {
          requestBody.mailTestType = '0'
        } else {
          requestBody.mailTestType = this.emailSettingsValues.owa ? '1' : '2'
        }
        requestBody.owaUrl = this.emailSettingsValues.owaUrl
        requestBody.owaUsername = this.emailSettingsValues.username
        requestBody.isContinuousScan = this.scanAndDeliveryValues.continuousScan
        requestBody.sendingLimit = this.scanAndDeliveryValues.sendingLimit

        if (this.scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP') {
          requestBody.distributeEmailOverMinutes = 0
          requestBody.delaySeconds = this.calculateTimeType(
            this.scanAndDeliveryValues.sendingLoopType.smtpTimeMinute,
            this.scanAndDeliveryValues.sendingLoopType.smtpTimeType,
            true
          )
        } else {
          requestBody.sendingLimit = 0
          requestBody.delaySeconds = 0
          requestBody.distributeEmailOverMinutes = this.calculateTimeType(
            this.scanAndDeliveryValues.sendingLoopType.distributeTimeMinute,
            this.scanAndDeliveryValues.sendingLoopType.distributeTimeType,
            false
          )
        }
        getQuickScanCreate(requestBody)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              message: this.isDuplicate ? 'Scan successfully updated.' : 'Scan successfully added.',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.$emit('changeNewScanModalStatus', false, true)
          })
          .catch((error) => {
            this.emailLoginStatus = true
            const errorResponse = error.response.data
            this.submitError.isArray = false
            this.submitError.message = errorResponse.message
            if (errorResponse.validationMessages.length > 0) {
              this.submitError.isArray = true
              this.submitError.message = errorResponse.validationMessages
            }
            this.step = 1
          })
      }
    }
  },
  watch: {
    emailSettingsValues: {
      handler: function (value) {
        this.isFormValuesChanged = true
        if (value.scanType === 'Manual') {
          this.emailSettingsValues.password = ''
          this.emailSettingsValues.owa = false
          this.emailSettingsValues.owaUrl = ''
          this.emailSettingsValues.username = ''
        }
      },
      deep: true
    }
  },
  computed: {
    validateCheckbox() {
      return [this.acceptRule === true || labels.Required]
    }
  },
  created() {
    if (this.isDuplicate) {
      this.pageTitle = 'Duplicate Scan'
      this.emailSettingsValues.email = this.scanDetails.email
      this.emailSettingsValues.password = this.scanDetails.password
      if (this.scanDetails.owaUrl !== '') {
        this.emailSettingsValues.scanType = 'Automate'
        this.emailSettingsValues.owa = true
        this.emailSettingsValues.owaUrl = this.scanDetails.owaUrl
        this.emailSettingsValues.username = this.scanDetails.owaUsername
      } else {
        this.emailSettingsValues.scanType = 'Manual'
      }
      this.scanAndDeliveryValues.continuousScan = this.scanDetails.isContinuousScan
      this.scanAndDeliveryValues.sendingLimit = this.scanDetails.sendingLimit
      if (this.scanDetails.distributeEmailOverMinutes > 0) {
        this.scanAndDeliveryValues.sendingLoopType.loopType = 'DistributeEmails'
        this.scanAndDeliveryValues.sendingLoopType.distributeTimeMinute = this.scanDetails.distributeEmailOverMinutes
        this.scanAndDeliveryValues.sendingLoopType.distributeTimeType = 'minutes'
      } else {
        this.scanAndDeliveryValues.sendingLoopType.loopType = 'SMTP'
        this.scanAndDeliveryValues.sendingLoopType.smtpTimeMinute = this.scanDetails.delaySeconds
        this.scanAndDeliveryValues.sendingLoopType.smtpTimeType = 'seconds'
      }
    }
  }
}
</script>
<style lang="scss">
.radio-btn-list {
  .v-input--selection-controls {
    margin-top: 5px;
  }
}
.email-threat-simulator-warning {
  .v-cart-icon-wrapper {
    background-color: #fef7f7 !important;
    border: 1px solid #f56c6c !important;
  }
  .k-dialog__title {
    color: #f56c6c !important;
  }
  .k-dialog__button {
    background-color: white !important;
    width: 120px;
  }
  .k-dialog__button:hover {
    background-color: white !important;
  }
}
</style>
<style lang="scss" scoped>
.label-left-form {
  width: 80%;
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  label {
    padding-top: 9px;
    margin-right: 30px;
    min-width: 80px;
    &.little {
      font-size: 14px;
    }
  }
}
.loop-type-input-container {
  height: 36px;
  margin-bottom: 10px;
  .left-input {
    width: 100px;
  }
  .right-input {
    width: 120px;
  }
}
.user-agreement-container {
  max-width: 554px;
  height: 345px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  padding: 11px 16px 11px 10px;
  overflow: auto;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 18px;
  scroll-padding: 50px 0 0 50px;
  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #757575;
  }
}
.email-login-error {
  max-width: 554px;
  background: rgba(245, 108, 108, 0.2);
}
</style>
