<template>
  <div class="page">
    <header>
      <div class="wrapper">
        <div class="v-responsive">
          <img style="max-width: 178px; max-height: 64px;" src="../assets/img/logo-kep.png" />
        </div>
        <div class="header-list">
          <v-menu v-model="chevron" bottom offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <div v-on="on" @click="chevron = !chevron" class="header-list-item">
                Keepnet Labs
                <v-icon :class="{ 'chevron-down': chevron }">mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <a href="https://www.keepnetlabs.com/why-keepnet-labs/" target="_blank"
                    >Holistic Approach</a
                  >
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <a href="https://www.keepnetlabs.com/artificial-intelligence/" target="_blank"
                    >Artifical Intelligence</a
                  >
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <a href="http://www.keepnetlabs.com/key-difference/" target="_blank"
                    >Key Differences</a
                  >
                </v-list-item-title>
              </v-list-item>
              <v-menu open-on-hover right offset-x>
                <template v-slot:activator="{ on }">
                  <v-list-item v-on="on">
                    <v-list-item-title>
                      <a href="http://www.keepnetlabs.com/company/" target="_blank">Company</a>
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <a href="http://www.keepnetlabs.com/careers/" target="_blank">Careers</a>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <a href="https://www.keepnetlabs.com/company/contact/" target="_blank"
                        >Contact Us</a
                      >
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <a href="http://www.keepnetlabs.com/for-investors" target="_blank"
                        >For Investors</a
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list>
          </v-menu>
        </div>
        <div class="header-list">
          <div class="header-list-item">
            <v-menu v-model="chevronTwo" bottom offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <div v-on="on" @click="chevronTwo = !chevronTwo" class="header-list-item">
                  Solutions
                  <v-icon :class="{ 'chevron-down': chevronTwo }">mdi-chevron-down</v-icon>
                </div>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <a href="https://www.keepnetlabs.com/incident-responder/" target="_blank"
                      >Incident Responder</a
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <a href="https://www.keepnetlabs.com/email-threat-simulator/" target="_blank"
                      >Email Threat Simulator</a
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <a href="https://www.keepnetlabs.com/threat-intelligence/" target="_blank"
                      >Threat Intelligence</a
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <a href="https://www.keepnetlabs.com/phishing-simulator/" target="_blank"
                      >Phishing Simulator</a
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <a href="https://www.keepnetlabs.com/awareness-educator/" target="_blank"
                      >Awereness Educator</a
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div class="header-list btn-wrapper">
          <v-btn class="outlined-btn">
            <router-link to="/login" class="menu-link-default">
              SIGN IN
            </router-link>
          </v-btn>
        </div>
        <div class="header-list btn-wrapper">
          <a href="https://www.keepnetlabs.com/free-trial/" target="_blank">
            <v-btn class="filled-btn">
              REQUEST DEMO
            </v-btn>
          </a>
        </div>
      </div>
    </header>
    <section class="body">
      <div class="wrapper">
        <h1 class="page-header">Shared Incident from Keepnet Labs</h1>
        <p class="sub-header">Shared by User Name (username@domain.com)</p>
        <v-card v-if="postDetail && postDetail.Data">
          <v-tabs v-model="tabModel" class="community-selector">
            <v-tab>Details</v-tab>
            <v-tab>Email Preview</v-tab>
          </v-tabs>

          <v-tabs-items v-show="postDetail.Data && postDetail.IsSuccess" v-model="tabModel">
            <v-tab-item>
              <h1
                v-if="
                  (shareSettings &&
                    shareSettings.senderInfo &&
                    shareSettings.senderInfo[0] &&
                    shareSettings.senderInfo[0].IsMalicious) ||
                  (shareSettings.receiverInfo &&
                    shareSettings.receiverInfo[0] &&
                    shareSettings.receiverInfo[0].IsMalicious) ||
                  (shareSettings.links && shareSettings.links.some((a) => a.IsMalicious)) ||
                  (shareSettings.attachments &&
                    shareSettings.attachments.some((a) => a.IsMalicious))
                "
                class="detected-items"
              >
                Detected Items
              </h1>
              <div class="detail-parts">
                <p
                  v-if="
                    (shareSettings &&
                      shareSettings.senderInfo &&
                      shareSettings.senderInfo[0] &&
                      shareSettings.senderInfo[0].IsShow &&
                      shareSettings.senderInfo[0].IsMalicious) ||
                    (shareSettings.receiverInfo &&
                      shareSettings.receiverInfo[0] &&
                      shareSettings.receiverInfo[0].IsShow &&
                      shareSettings.receiverInfo[0].IsMalicious)
                  "
                  class="detail-black"
                >
                  Header
                </p>
                <p
                  v-if="
                    shareSettings &&
                    shareSettings.senderInfo &&
                    shareSettings.senderInfo[0] &&
                    shareSettings.senderInfo[0].IsShow &&
                    shareSettings.senderInfo[0].IsMalicious
                  "
                  :id="'from' + postDetail.Data.CommunityPostEmails[0].From"
                  class="detail-black detail-red"
                >
                  From: {{ postDetail.Data.CommunityPostEmails[0].From }}
                </p>
                <p
                  v-if="
                    shareSettings &&
                    shareSettings.senderInfo &&
                    shareSettings.senderInfo[0] &&
                    shareSettings.senderInfo[0].IsShow &&
                    shareSettings.senderInfo[0].IsMalicious
                  "
                  class="detail-black"
                >
                  The sender email address has been reported as harmful email sender.
                </p>
              </div>
              <div class="detail-parts">
                <p
                  v-if="
                    shareSettings &&
                    shareSettings.receiverInfo &&
                    shareSettings.receiverInfo[0] &&
                    shareSettings.receiverInfo[0].IsShow &&
                    shareSettings.receiverInfo[0].IsMalicious
                  "
                  :id="'from' + postDetail.Data.CommunityPostEmails[0].From"
                  class="detail-black detail-red"
                >
                  To: {{ postDetail.Data.CommunityPostEmails[0].From }}
                </p>
                <p
                  v-if="
                    shareSettings &&
                    shareSettings.receiverInfo &&
                    shareSettings.receiverInfo[0] &&
                    shareSettings.receiverInfo[0].IsShow &&
                    shareSettings.receiverInfo[0].IsMalicious
                  "
                  class="detail-black"
                >
                  The receiver email address has been reported as harmful email sender.
                </p>
              </div>
              <div
                v-if="shareSettings && shareSettings.links && shareSettings.links.length"
                class="preview-attch-wrapper detail-parts"
              >
                <p
                  v-if="
                    shareSettings &&
                    shareSettings.links &&
                    shareSettings.links.some((a) => a.IsShow && a.IsMalicious)
                  "
                  class="detail-black"
                >
                  Body
                </p>
                <p
                  v-for="(el, ind) of shareSettings.links"
                  :key="ind + el.Id"
                  v-if="el && el.Type == 'Link' && el.IsShow && el.IsMalicious"
                  :id="'detail-links-' + el.Id"
                  class="detail-black detail-red"
                >
                  Link: {{ el.Value }} <br />
                </p>
                <div
                  v-for="(att, ind) of shareSettings.attachments"
                  :key="ind + att.Id"
                  :id="'detail-malicious-' + att.Id"
                  v-if="att.IsMalicious"
                >
                  <p class="attach-found-malicious" v-if="ind === 0">
                    This link<span v-if="shareSettings.links.length > 1">s</span> has been reported
                    as a phising link
                  </p>
                </div>
              </div>
              <div
                class="details-attchments-wrapper preview-footer"
                v-if="shareSettings.attachments && shareSettings.attachments.length"
              >
                <div
                  v-for="(att, ind) of shareSettings.attachments"
                  :key="ind + att.Id"
                  v-if="att.IsMalicious"
                  class="preview-attch-wrapper details-attachments"
                >
                  <h2 v-if="ind === 0">Attachments</h2>
                  <div>
                    <div :id="'detail-attachs-' + att.Id" class="attachment">
                      <div
                        :id="'detail-name-' + att.Id"
                        v-if="att.IsShow"
                        class="file-name max-char"
                      >
                        {{ att.Name }}
                      </div>
                      <div
                        :id="'detail-name-' + att.Id"
                        v-if="!att.IsShow"
                        class="file-name max-char"
                      >
                        Hidden by Owner
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(att, ind) of shareSettings.attachments"
                  :key="ind + att.Id"
                  :id="'detail-malicious-' + att.Id"
                  v-if="att.IsMalicious"
                >
                  <p class="attach-found-malicious detail-black" v-if="ind === 0">
                    This file<span v-if="shareSettings.attachments.length > 1">s</span> has been
                    reported as a malicious
                  </p>
                </div>
              </div>
              <div v-if="postDetail && postDetail.Data" class="detail-discovery pb-4">
                <div
                  :id="'detail-discovery-empty'"
                  v-if="postDetail.Data.DiscoveryAndDetection"
                  class="disc-header"
                >
                  Discovery and Detection
                </div>
                <p
                  :id="'detail-discovery'"
                  v-if="postDetail.Data.DiscoveryAndDetection"
                  class="discovery-p"
                >
                  {{ postDetail.Data.DiscoveryAndDetection }}
                </p>
                <div v-if="postDetail.Data.AffectArea" class="disc-header mb-1">Impact Range</div>
                <div
                  :id="'detail-effect-area'"
                  v-if="postDetail.Data.AffectArea"
                  class="impact-row"
                >
                  <div class="impact-left">Effect area:</div>
                  <div style="width: max-content; padding-right: 13px;" class="impact-right">
                    {{ postDetail.Data.AffectArea }}
                  </div>
                </div>
                <div
                  :id="'detail-scope' + postDetail.Data.Scope"
                  v-if="postDetail.Data.Scope"
                  class="impact-row"
                >
                  <div class="impact-left">Scope:</div>
                  <div class="impact-right">{{ postDetail.Data.Scope }}</div>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="preview-header pt-0">
                <h2
                  v-for="(el, ind) of shareSettings.subject"
                  :key="ind + el.Id"
                  :id="'detail-subject-' + el.Id"
                  v-if="
                    postDetail &&
                    postDetail.Data &&
                    postDetail.Data.CommunityPostEmails[0] &&
                    postDetail.Data.CommunityPostEmails[0].Subject.length &&
                    el.IsShow
                  "
                >
                  <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                    >Subject: {{ postDetail.Data.CommunityPostEmails[0].Subject }}</span
                  >
                  <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </h2>
                <h2
                  v-for="(el, ind) of shareSettings.subject"
                  :key="ind + el.Id"
                  v-else-if="
                    postDetail &&
                    postDetail.Data &&
                    postDetail.Data.CommunityPostEmails[0] &&
                    postDetail.Data.CommunityPostEmails[0].Subject.length &&
                    !el.IsShow
                  "
                  :id="'detail-subject-' + el.Id"
                >
                  <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                    >Subject: Hidden by Owner</span
                  >
                  <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                        >mdi-alert</v-icon
                      >
                    </template>
                    <span>This email address has been reported as a threat source</span>
                  </v-tooltip>
                </h2>
                <div class="header-info pb-5">
                  <div
                    v-for="(el, ind) of shareSettings.senderInfo"
                    :key="ind + el.Id"
                    :id="'detail-sender-' + el.Id"
                    v-if="
                      postDetail &&
                      postDetail.Data &&
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].From.length &&
                      el.IsShow
                    "
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >From: {{ postDetail.Data.CommunityPostEmails[0].From }}</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                    <br />
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.senderInfo"
                    :key="ind + el.Id"
                    v-else-if="
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].From.length &&
                      !el.IsShow
                    "
                    :id="'detail-from-' + el.Id"
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >From: Hidden by Owner</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    :id="'detail-to-' + el.Id"
                    v-if="
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].To.length &&
                      el.IsShow
                    "
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >To: {{ postDetail.Data.CommunityPostEmails[0].To }}</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    v-else-if="
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].To.length &&
                      !el.IsShow
                    "
                    :id="'detail-to-' + el.Id"
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >To: Hidden by Owner</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    v-if="
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].Cc.length &&
                      el.IsShow
                    "
                    :id="'detail-cc-' + el.Id"
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >CC: {{ postDetail.Data.CommunityPostEmails[0].Cc }}</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    v-else-if="
                      postDetail.Data.CommunityPostEmails[0] &&
                      postDetail.Data.CommunityPostEmails[0].Cc.length &&
                      !el.IsShow
                    "
                    :id="'detail-cc-' + el.Id"
                  >
                    <span :class="[el.IsMalicious ? 'malicious-style' : '']"
                      >CC: Hidden by Owner</span
                    >
                    <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon"
                          >mdi-alert</v-icon
                        >
                      </template>
                      <span>This email address has been reported as a threat source</span>
                    </v-tooltip>
                  </div>
                  <div id="details-post-date" v-if="postDetail.Data.CommunityPostEmails[0]">
                    Date:
                    {{ postDetail.Data.CommunityPostEmails[0].ReceivedDate.slice(0, 10) }}
                    {{ postDetail.Data.CommunityPostEmails[0].ReceivedDate.slice(11, 16) }}
                    <br />
                  </div>
                </div>
              </div>
              <div
                id="single-post-body"
                class="preview-body"
                v-html="postDetail.Data.CommunityPostEmails[0].Body"
              ></div>
              <div
                class="preview-footer"
                v-if="shareSettings.attachments && shareSettings.attachments.length"
              >
                <h2>Attachments</h2>
                <div
                  v-for="(att, ind) of shareSettings.attachments"
                  :key="ind + att.Id"
                  class="preview-attch-wrapper"
                >
                  <div class="attachment-wrapper">
                    <div
                      class="attachment red-attach"
                      :id="'single-post-attachments-' + att.Id"
                      :class="[
                        att.IsMalicious ? 'red-attach malicious-style' : '',
                        !att.IsMalicious ? 'blue-attach' : ''
                      ]"
                    >
                      <v-tooltip v-if="att.IsMalicious" bottom opacity="1">
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="attach-icon red-icon">
                            <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                          </div>
                        </template>
                        <span>This attachment has been reported as a malicious file</span>
                      </v-tooltip>
                      <div v-else class="attach-icon blue-icon">
                        <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                      </div>
                      <div v-if="att.IsShow" class="file-name max-char pl-2">{{ att.Name }}</div>
                      <div v-if="!att.IsShow" class="file-name max-char pl-2">Hidden by Owner</div>
                    </div>
                  </div>
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <v-card class="info-card">
          <div class="card-header">
            <span class="header-name">
              Join Keepnet Labs today
            </span>
            <a href="https://www.keepnetlabs.com/free-trial/" target="_blank">
              <v-btn class="filled-btn">
                REQUEST DEMO
              </v-btn>
            </a>
          </div>
          <div class="card-body">
            <p class="card-p">
              95% of successful attacks on corporations are based on phishing emails! <br />
              97% of people don’t notice a complicated phishing email <br />
              Only 3% of those who notice phishing emails inform management <br />
              Cybercrimes and data leakage are projected to cost organisations 2.1 trillion dollars
              in 2019 <br />
              <br />

              Our cybersecurity experience and anti-phishing solutions are based on our extensive
              experience in critical sectors, such as finance, energy, government agencies. We use
              this experience, together with hundreds of penetration tests, forensics and incident
              responses to anticipate and combat security risks.
            </p>
          </div>
        </v-card>
      </div>
    </section>
    <v-footer class="footer d-flex">
      <div class="footer-item__primary footer-copyright">
        Copyright Keepnet Labs &copy; {{ new Date().getFullYear() }}
      </div>
      <div class="footer-middle">
        <div class="footer-item__secondary footer-links">
          <a href="#">Privacy Policy</a> &#8226;
          <a href="https://www.keepnetlabs.com/terms-conditions/" target="_blank"
            >Terms and Conditions</a
          >
          &#8226;
        </div>
        <div class="footer-item__third footer-links">
          <a href="#">Cookie Policy</a> &#8226;
          <a href="#">EULA</a>
        </div>
      </div>
      <div class="footer-item__fourth footer-designedby">Designed by Keepnet Labs</div>
    </v-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    chevron: false,
    chevronTwo: false,
    tabModel: 'tab-1',
    hasPermission: false,
    valid: false,
    userComment: '',
    comments: [],
    hoverTool: false,
    details: {},
    shareSettings: {},
    addCommentValue: '',
    tab: null
  }),
  watch: {
    postDetail(val) {
      const datas = val.Data
      if (
        datas &&
        datas.CommunityPostEmails[0] &&
        datas.CommunityPostEmails[0].ShareSettings.length
      ) {
        const ShareSettings = {
          senderInfo: datas.CommunityPostEmails[0].ShareSettings.filter(
            (f) => f.Type === 'SenderInfo'
          ),
          subject: datas.CommunityPostEmails[0].ShareSettings.filter((f) => f.Type === 'Subject'),
          receiverInfo: datas.CommunityPostEmails[0].ShareSettings.filter(
            (f) => f.Type === 'ReceiverInfo'
          ),
          attachments: datas.CommunityPostEmails[0].ShareSettings.filter(
            (f) => f.Type === 'Attachment'
          ),
          links: datas.CommunityPostEmails[0].ShareSettings.filter((f) => f.Type === 'Link')
        }
        if (ShareSettings.links && ShareSettings.links.length) {
          setTimeout(function () {
            for (let a of ShareSettings.links) {
              var els = document.querySelectorAll('[href="' + a.Value + '"]')
              for (var i = 0, l = els.length; i < l; i++) {
                var el = els[i]
                if (!a.IsShow) {
                  el.innerHTML = 'Hidden by Owner'
                  el.setAttribute('href', '#')
                }
                if (a.IsMalicious) {
                  el.classList.add('malicious-style')
                  var iEl = document.createElement('span')
                  iEl.className +=
                    'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
                  el.appendChild(iEl)
                }
              }
            }
          }, 0)
        }
        this.shareSettings = ShareSettings
      }
    }
  },
  computed: {
    ...mapGetters({
      postDetail: 'threadSharing/postDetailGetter'
    })
  },
  created() {
    const postDetailObj = {
      companyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
      communPostId: '155a87ff-14ba-4dfe-9125-c9f92a578cd8'
    }
    this.$store.dispatch('threadSharing/getPostDetail', postDetailObj)
  },
  mounted() {
    if (this.$route.query) {
      // TO-DO
      // Incident posted email email come here.
      // You have to getIncident dispatch here apply it to the page.
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  display: block;
  position: relative;
  height: 100%;
  width: 100%;

  header {
    align-items: center;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    height: 112px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #fff;
    z-index: 13;

    .v-responsive {
      align-items: center;
    }
    .header-list {
      align-items: center;
      display: flex;
      position: relative;
      padding: 0 24px;

      a {
        text-decoration: none !important;
        color: inherit !important;
      }

      .header-list-item {
        cursor: pointer;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.15;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .btn-wrapper {
      padding: 0 20px;
    }
  }

  .wrapper {
    display: flex;
    position: relative;
    width: 1123px;
  }

  .outlined-btn {
    background-color: #fff !important;
    box-shadow: unset !important;
    height: 36px;
    border-radius: 18px;
    border: solid 1px #2196f3;
    color: #2196f3;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    height: 36px !important;
  }
  .filled-btn {
    background-color: #2196f3 !important;
    box-shadow: unset !important;
    color: #fff;
    border-radius: 18px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: unset !important;
  }
  .body {
    padding-top: 112px;
    position: relative;
    height: 100%;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;

    .wrapper {
      height: 100%;
      flex-direction: column;

      .page-header {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 34px;
        color: #2196f3;
        font-weight: 400;
        padding-top: 35px;
      }
      .sub-header {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        color: #2196f3;
        font-weight: 600;
        padding-bottom: 16px;
      }

      ::v-deep .v-slide-group__content {
        border-bottom: 2px solid #e4e7ed;
        margin-right: 20px;
      }
      ::v-deep .v-tabs-slider-wrapper {
        bottom: 0 !important;
        color: #0486fe !important;
      }

      ::v-deep .v-tabs-bar {
        height: 60px !important;

        .v-tab {
          font-family: 'Open Sans', sans-serif !important;
          letter-spacing: 0.3px;
          font-weight: 400;
          font-size: 22px !important;
          line-height: 31px;
          margin-right: 48px;
          color: #434343;
          text-align: left;
          padding: 0 !important;
          text-transform: capitalize !important;
        }
      }

      ::v-deep .v-card {
        border-radius: 20px !important;
        -webkit-box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
        box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
        background-color: #fff !important;
        height: 100%;
        padding: 24px !important;
        margin-bottom: 16px;
      }

      .info-card {
        background-color: #fff !important;
        padding-top: 26px !important;
        .card-header {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding-bottom: 16px;

          .header-name {
            font-family: 'Open Sans', sans-serif !important;
            font-size: 24px;
            line-height: 1.29;
            color: #2196f3;
          }

          a {
            text-decoration: none;
          }
        }
        .card-p {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.87);
          max-width: 82%;
        }
      }
    }
  }
  footer {
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    display: flex;
    justify-content: space-between;
    height: 47px;
    width: 100%;

    .footer-designedby {
      height: 17px;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
    }

    .footer-copyright {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
    }

    .footer-middle {
      display: flex;
      flex-direction: row;
      width: 450px;
    }

    .footer-links {
      align-items: center;
      display: flex;

      a {
        height: 19px;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: #000;
        text-decoration: none;
        padding: 0 16px;
      }
    }
  }
}
.chevron-down {
  transition: 0.3s all ease-in-out;
  transform: rotate(180deg);
}
::v-deep .v-list-item__title {
  a {
    text-decoration: none !important;
  }
}
::v-deep .v-list-item {
  .v-list-item__title {
    width: 100%;
    height: 46px;

    a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.87);
      font-family: 'Open Sans', sans-serif !important;
    }
  }
}
::v-deep .v-list-item:hover {
  background-color: #f2f2f2;
  cursor: pointer;
  transition: all ease-in-out 0.2s;
}

// Single Post Css
//////////////////

// Threat sharing Content
.threat-sharing-content {
  min-height: 200px;
  width: 100%;
  padding: 24px !important;
  background-color: #ffffff;
  border-radius: 20px !important;

  @media only screen and (max-width: 500px) {
    padding: 16px !important;
  }
}
.ts-header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.ts-header-btn-1 {
  display: flex;
}
.ts-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  max-width: 79%;
  position: relative;
  display: flex;

  @media only screen and (max-width: 1450px) {
    max-width: 70%;
  }
}
// Threat sharing Content End

.notification-wrapper {
  background-color: #fff;
  padding: 0;
}
.v-menu__content {
  border-radius: 8px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

  .v-list-item {
    padding-left: 29px !important;
    padding-right: 16px !important;
  }
  .v-list-item__title {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}

.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px !important;
}
.ts-user-comp-detail {
  align-items: center;
  display: flex;
  margin-top: 8px;
}
::v-deep .v-btn--contained {
  border-radius: 18px !important;
  box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
}
::v-deep .v-data-footer {
  margin-top: 24px !important;
}
::v-deep .v-data-footer__select {
  .v-select {
    margin: 0 !important;
    margin-top: 3px !important;
    margin-left: 32px !important;
    height: 30px !important;
  }
  .v-text-field > .v-input__control > .v-input__slot:after {
    border: none !important;
    display: none !important;
  }
  .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border: none !important;
  }
  .v-input__append-inner {
    margin-left: 0 !important;
    margin-top: 3px !important;
    margin-right: 5px !important;
    padding-left: 0 !important;
  }
  .v-select__slot {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 27px !important;
    background-color: #f2f2f2 !important;

    .v-select__selections {
      margin-left: 10px;
    }
  }
  .v-input__icon {
    width: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
  }
}
::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}
::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

.ts-tags {
  align-items: center;
  display: flex;
  flex-direction: row;
  max-width: max-content;

  > .tag-btn,
  > div > .tag-btn {
    border-radius: 18px;
    border: solid 1.5px #c0c4cc;
    background-color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    height: 32px !important;
  }
}
.ts-footer {
  align-items: center;
  display: flex;
  margin-top: 22px;
  margin-left: 0;
  margin-right: 0;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.ts-like {
  margin-right: 10px;
  align-items: center;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
    margin-left: 4px;
  }
}
.ts-message {
  margin-right: 40px;
  align-items: center;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
    margin-left: 4px;
  }
}
.ts-harmful {
  margin-right: 15px;
  align-items: center;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-success {
  display: flex;
  align-items: center;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-body {
  margin-top: 10px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.ts-user-comp {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  a {
    text-decoration: none;
  }

  .ts-user-date {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.ts-action-counter {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
}
.ts-actions {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-left: 3px;
}
::v-deep .v-expansion-panel {
  border-radius: 20px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
  background-color: #fff;
  border: unset !important;
}
::v-deep .v-expansion-panel::before {
  box-shadow: unset !important;
}
::v-deep .v-expansion-panel-header {
  box-shadow: unset !important;
  border: unset !important;
}

.tab-bar {
  width: 100%;
  height: 48px;
  padding: 0;
  background-color: #f5f7fa;
  border-radius: 0 !important;

  ::v-deep .v-slide-group__wrapper {
    padding-left: 0 !important;
  }
  ::v-deep .v-slide-group__content {
    margin-right: 0 !important;
  }
  ::v-deep .v-tab--active {
    color: #2196f3 !important;
  }
  ::v-deep .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center !important;
    margin-right: 32px !important;
    padding: 0 !important;
    padding-right: 3px !important;
    min-width: auto !important;
  }
  ::v-deep .v-tabs-bar {
    padding: 0 24px;
    height: 48px !important;
    border-radius: 0 !important;
  }
}
::v-deep .v-window {
  border-radius: 20px !important;
  margin: 0 24px !important;
}
::v-deep .v-expansion-panel-content {
  border-radius: 20px !important;
  font-family: 'Open Sans', sans-serif !important;
}
::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}

// Email Preview css
.preview-header {
  margin-top: 32px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }

  .header-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.preview-body {
  margin-top: 24px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  position: relative;
  min-height: auto;
  max-height: 500px;
  overflow: auto;

  .company-img {
    display: flex;
    position: absolute;
    right: 0;
    top: 20px;
    width: 84px;
    height: 84px;

    img {
      width: 100%;
      height: auto;
    }
  }
}
.bodyExpanded {
  height: 100% !important;
  max-height: 100% !important;
  padding-bottom: 56px;
}
.details-attchments-wrapper {
  display: flex;
  flex-direction: column;

  .details-attachments {
    width: auto !important;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 4px !important;
    }

    .file-name {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(219, 37, 37, 0.87);
    }
  }
}
.attach-found-malicious {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-top: 4px;
}
.preview-footer {
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;

  .preview-attch-wrapper {
    width: max-content;
  }

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
    width: 100%;
    padding-top: 13px;
  }
  .attachment-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: max-content;
    min-height: auto;

    .attachment {
      width: 182px;
      min-width: 182px;
      height: 32px;
      align-items: center;
      display: flex;
      flex-direction: row;
      margin: 16px;
      margin-left: 0;
      margin-top: 0;

      .attach-icon {
        min-width: 40px;
        height: 32px;
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .red-icon {
        background-color: #bb2a45 !important;
      }
      .blue-icon {
        background-color: #2196f3 !important;
      }
      span {
        width: 100%;
        text-align: center;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .red-attach {
      background-color: #f3e1e5;
    }
    .blue-attach {
      background-color: #f1f8fe;
    }
    .file-name {
      display: block;
      max-width: 93%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.preview-buttons {
  margin-top: 24px;
  padding-bottom: 13px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #b3d4fc;
  padding-top: 24px;

  ::v-deep .v-btn {
    border-radius: 18px !important;
    border: solid 1px #909399;
    box-shadow: unset !important;
    background-color: #fff !important;
    margin-right: 16px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 16px !important;

    .v-icon {
      color: #909399;
      font-size: 19px !important;
      margin-right: 8px;
      margin-top: 1px;
      border: unset !important;
    }
  }
  .active-act {
    color: #2196f3 !important;
    border: solid 1px #2196f3 !important;
  }
}
.preview-border {
  border-top: 1px solid #b3d4fc;
  padding-top: 24px;
}

// Details css
.detail-parts:first-child {
  margin-top: 24px !important;
}
.detail-parts {
  margin-top: 16px;

  .detail-black {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 4px !important;
  }
  .detail-red {
    color: rgba(219, 37, 37, 0.87) !important;
  }
}
.detail-discovery {
  margin-top: 24px;

  .disc-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 8px;
  }
  .discovery-p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.impact-row {
  display: flex;
  flex-direction: row;
  padding-bottom: 8px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  .impact-left {
    min-width: 100px;
    font-weight: 600 !important;
  }
  .impact-right {
    margin-top: 2px;
    max-width: 80%;
  }
}
.border-padding {
  padding-bottom: 8px;
  border-bottom: 1px solid #b3d4fc;
}
.member-company-body {
  ::v-deep .v-slide-group__content {
    border-bottom: unset !important;
  }
}
.expand-contaniner {
  width: 100%;
  height: 50px;
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  bottom: 0;
  background-image: linear-gradient(to bottom, transparent, #fff 50%);

  button,
  .v-btn:not(.v-btn--round).v-size--default {
    width: auto !important;
    height: 24px !important;
    border-radius: 12px !important;
    background-color: #409eff !important;
    box-shadow: unset !important;
    color: #fff;
    text-transform: capitalize !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    padding-left: 13px !important;

    i {
      width: 18px !important;
    }
  }
}
.opacityExpanded {
  background-image: none !important;
}
.preview-comments {
  height: 0;
  opacity: 0;
  transition: max-height 0.25s ease-in;
  overflow: hidden;

  .comment-row {
    display: flex;
    flex-direction: row;
    padding-top: 6px;

    .comment-input {
      margin-top: 3px;
      margin-right: 16px;

      ::v-deep .v-input__slot {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 13px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.54);
        padding-left: 24px !important;
        max-height: 70px;
        min-height: 40px;

        textarea {
          max-height: 70px;
          overflow: auto;
          margin-bottom: 5px;
          margin-top: 2px;
          margin-right: 2px;
        }
        label {
          top: 10px;
        }
        fieldset {
          padding-left: 18px !important;
        }
      }
    }
    .send-btn {
      border-radius: 18px !important;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      height: 36px !important;
      margin: 3px;

      i {
        font-size: 18px !important;
        padding-right: 8px;
      }
    }
  }
  .comment-row {
    border-radius: 4px;
    background-color: #f5f7fa;
    display: flex;
    padding: 16px;
    margin-bottom: 8px;

    .user-wrapper {
      display: block;
      max-width: 100%;

      .username,
      .company-name {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        padding-right: 4px;
        cursor: pointer;
      }
      .company-name {
        padding-left: 4px;
      }
    }
    .the-comment {
      margin-bottom: 0 !important;
      padding-top: 8px !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
      max-width: 100%;
    }
  }
  .see-all-comments {
    padding-top: 16px;
    padding-bottom: 24px;

    span {
      text-decoration: none;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #2196f3;
      cursor: pointer;
    }
  }
}
.open-comments {
  height: auto !important;
  transition: max-height 0.25s ease-in;
  padding-bottom: 24px;
  opacity: 1;
  z-index: -5;
}
.add-comment {
  background-color: #fff !important;
  height: 60px;
  padding: 0 !important;
}
.unselected-warn {
  border-bottom: 1px solid #bb2a45;
  color: #bb2a45;
  padding: 0 2px !important;
}
.hide-buttons {
  opacity: 0;
  padding: 0 !important;
  height: 20px !important;
}
.display-none {
  display: none !important;
}
.tooltip-wrapper {
  display: block;
  max-width: 250px;
  width: 130px;
  height: 50px;
  border-radius: 4px;
  background-color: #6d6d6d;
  position: absolute;
  top: -55px;
  left: -35px;
  border-radius: 4px;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
  padding: 8px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 34px;
  }

  span {
    color: rgba(255, 255, 255, 0.87) !important;
    font-size: 12px !important;
    line-height: 1.33 !important;
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
  }
}
.add-comment-row {
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  .comment-input {
    max-width: 80%;
  }
  .send-btn {
    border-radius: 18px !important;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
    background-color: #2196f3 !important;
    color: #fff !important;
    height: 36px !important;

    i {
      font-size: 18px !important;
      padding-right: 8px;
    }
  }
}
.file-name {
  padding-left: 7px;
}
#incident-badge {
  padding: 4px 12px;
}
.detected-items {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 16px;
  padding-top: 24px;
}
::v-deep .malicious-style {
  background-color: #f3e1e5 !important;
  color: #bb2a45 !important;
  text-decoration: underline !important;
}
.malicious-icon {
  top: 0px;
  background: transparent;
  color: #f56c6c;
  font-size: inherit !important;
  padding: 0;
}
::v-deep .red-malicious-alert::before {
  border: unset !important;
}
::v-deep .malicious-style {
  .red-malicious-alert:not(:first-child) {
    display: none !important;
  }
}
</style>
