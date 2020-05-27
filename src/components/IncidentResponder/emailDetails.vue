<template>
    <div class="single-post">
        <span class="single-post-header">Email Details - File Format Exploit</span>
        <v-expansion-panel-content
                eager
                class="expand-body member-company-body pa-0"
        >
            <v-tabs v-model="tab" class="tab-bar">
                <v-tab id="expansion-details">Details</v-tab>
                <v-tab id="expansion-preview">Email Preview</v-tab>
                <v-tab id="expansion-url">URL Analysis</v-tab>
                <v-tab id="expansion-attachment">Attachment Analysis</v-tab>
            </v-tabs>

            <v-tabs-items v-show="postDetail.Data && postDetail.IsSuccess" v-model="tab">
                <v-tab-item>
                    <div class="details-content">
                        <div class="details-content--item mb-4">
                            <div class="details-content--item--key">
                                To
                            </div>
                            <div class="details-content--item--value">
                                sedatozdemirtest3@outlook.com
                            </div>
                        </div>
                        <div class="details-content--item mb-4">
                            <div class="details-content--item--key">
                                From
                            </div>
                            <div class="details-content--item--value">
                                ets@securelogout.com
                            </div>
                        </div>
                        <div class="details-content--item mb-4">
                            <div class="details-content--item--key">
                                Subject
                            </div>
                            <div class="details-content--item--value">
                                File Format Exploits
                            </div>
                        </div>
                        <div class="details-content--item mb-4">
                            <div class="details-content--item--key">
                                Analysis Date
                            </div>
                            <div class="details-content--item--value">
                                7/26/2019 5:22:30 PM
                            </div>
                        </div>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="preview-header pt-0 mt-0">
                        <h2
                                v-for="(el, ind) of shareSettings.subject"
                                :key="ind + el.Id"
                                :id="'detail-subject-' + el.Id"
                                v-if="
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
                                    <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
                                </template>
                                <span>The subject has been reported as a threat source</span>
                            </v-tooltip>
                        </h2>
                        <h2
                                v-for="(el, ind) of shareSettings.subject"
                                :key="ind + el.Id"
                                v-else-if="
                postDetail.Data.CommunityPostEmails[0] &&
                  postDetail.Data.CommunityPostEmails[0].Subject.length &&
                  !el.IsShow
              "
                                :id="'detail-subject-' + el.Id"
                        >
              <span :class="[el.IsMalicious ? 'malicious-style' : '']"
              >Subject: hidden by owner</span
              >
                            <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                                <template v-slot:activator="{ on }">
                                    <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
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
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
                                    </template>
                                    <span>This email address has been reported as a threat source</span>
                                </v-tooltip>
                                <br/>
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
                >From: hidden by owner</span
                >
                                <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
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
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
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
                                <span :class="[el.IsMalicious ? 'malicious-style' : '']">To: hidden by owner</span>
                                <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
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
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
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
                                <span :class="[el.IsMalicious ? 'malicious-style' : '']">CC: hidden by owner</span>
                                <v-tooltip v-if="el.IsMalicious" bottom opacity="1">
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
                                    </template>
                                    <span>This email address has been reported as a threat source</span>
                                </v-tooltip>
                            </div>
                            <div id="details-post-date" v-if="postDetail.Data.CommunityPostEmails[0]">
                                Date:
                                {{ postDetail.Data.CommunityPostEmails[0].ReceivedDate.slice(0, 10) }}
                                {{ postDetail.Data.CommunityPostEmails[0].ReceivedDate.slice(11, 16) }}
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div id="single-post-body" class="preview-body">
                        <k-shadow-frame
                                id="sframe"
                                v-bind:content="postDetail.Data.CommunityPostEmails[0].Body"
                        />
                    </div>
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
                                    <v-tooltip v-if="att.IsMalicious" bottom opacity="1" z-index="9999">
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on" class="attach-icon red-icon">
                                                <v-icon color="white" style="font-size: 20px">mdi-alert</v-icon>
                                            </div>
                                        </template>
                                        <span>This attachment has been reported as a malicious file</span>
                                    </v-tooltip>
                                    <div v-else class="attach-icon blue-icon">
                                        <v-icon color="white" style="font-size: 20px">mdi-paperclip</v-icon>
                                    </div>
                                    <v-tooltip bottom opacity="1" z-index="9999">
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on" v-if="att.IsShow" class="file-name max-char pl-2">
                                                {{ att.Name }}
                                            </div>
                                            <div v-on="on" v-if="!att.IsShow" class="file-name max-char pl-2">
                                                hidden by owner
                                            </div>
                                        </template>
                                        <span>{{ att.IsShow ? att.Name : 'hidden by owner' }}</span>
                                    </v-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div>
                        <datatable
                                id="urlAnaylsisTable"
                                :refName="'urlAnaylysisTable'"
                                :columns="columns"
                                :table="tableData"
                                :countRow="5"
                                :pageSizes="pageSizes"
                                :defaultSort="'date'"
                                :selectable="false"
                                :filterable="true"
                                :options="true"
                                :empty="iEmpty"
                                :selectEvent="selectEvent"
                                :sizeable="true"
                        />
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="attachment-analysis-item">
                        <div class="ed-title">
                            <v-tooltip bottom opacity="1">
                                <template v-slot:activator="{ on }">
                                    <div class="d-flex">
                                        <p class="mr-6 attachment-name">Attachment Name</p>
                                        <p class="mr-6 wrf">watermark_master.wcf</p>
                                        <p class="mr-6 cursor-pointer download">
                                            <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
                                            Download file
                                        </p>
                                    </div>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="flex-grow-1"></div>
                        <div class="ed-header-btn-1 collapse-details">
                            <v-expansion-panel-header
                                    class="pa-0"
                                    style="min-height: 36px;"
                                    disable-icon-rotate
                                    id="email-details-expansion-header"
                            >
                                <template v-slot:actions mandatory="true">
                                    <v-btn
                                            v-if="showFirstCollapse"
                                            @click.native="showFirstCollapse = false"
                                            outlined
                                            rounded
                                            medium
                                            color="blue"
                                    >COLLAPSE
                                    </v-btn>
                                    <v-btn
                                            v-else
                                            @click.native="showFirstCollapse = true"
                                            outlined
                                            rounded
                                            medium
                                            color="blue"
                                    >EXPAND
                                    </v-btn>
                                </template>
                            </v-expansion-panel-header>
                        </div>
                        <v-expansion-panel-content
                                v-if="showFirstCollapse"
                                eager
                                transition="scale-transition"
                                class="pa-0 no-shadow"
                        >
                            <div class="details-content">
                                <div class="details-content--item mb-4 mt-4">
                                    <div class="details-content--item--key text-right">
                                        SHA512

                                    </div>
                                    <div class="details-content--item--value">
                                        ad332bacf12da20cdcf84c6ed5dd590a8cb428acd1f636fc1a5c9fb4cf06e584b3b3c2fc97b6e0bab2d27cea60d13cd053ade7e7f2cb0aaa7117d9b1401a37a0
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        MD5
                                    </div>
                                    <div class="details-content--item--value">
                                        1f0e84c265ebe2911565c091afa36df9
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Content Type
                                    </div>
                                    <div class="details-content--item--value">
                                        application/octet-stream
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        VirusTotal
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: rgba(219, 37, 37, 0.87)" >Phishing</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                    </span>
                                        <a>DETAILS</a>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Valkyrie
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status">Clean</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Roksit
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: rgba(219, 37, 37, 0.87)" >Phishing</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                    </span>
                                        <a>DETAILS</a>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        PhishTank
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status">Clean</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                                <div class="details-content--item">
                                    <div class="details-content--item--key text-right">
                                        Hybrid Analysis
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: #b06000">Malicious</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </v-expansion-panel-content>
                    </div>
                    <div class="attachment-analysis-item">
                        <div class="ed-title">
                            <v-tooltip bottom opacity="1">
                                <template v-slot:activator="{ on }">
                                    <div class="d-flex">
                                        <p class="mr-6 attachment-name">Attachment Name</p>
                                        <p class="mr-6 wrf">watermark_master.wcf</p>
                                        <p class="mr-6 cursor-pointer download">
                                            <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
                                            Download file
                                        </p>
                                        <p class="mr-6 cursor-pointer not-found">*This file was not uploaded to any integration</p>
                                    </div>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="flex-grow-1"></div>
                        <div class="ed-header-btn-1 collapse-details">
                            <v-expansion-panel-header
                                    class="pa-0"
                                    style="min-height: 36px;"
                                    disable-icon-rotate
                                    id="email-details-expansion-header"
                            >
                                <template v-slot:actions mandatory="true">
                                    <v-btn
                                            v-if="showSecondCollapse"
                                            @click.native="showSecondCollapse = false"
                                            outlined
                                            rounded
                                            medium
                                            color="blue"
                                    >COLLAPSE
                                    </v-btn>
                                    <v-btn
                                            v-else
                                            @click.native="showSecondCollapse = true"
                                            outlined
                                            rounded
                                            medium
                                            color="blue"
                                    >EXPAND
                                    </v-btn>
                                </template>
                            </v-expansion-panel-header>
                        </div>
                        <v-expansion-panel-content
                                v-if="showSecondCollapse"
                                eager
                                transition="scale-transition"
                                class="pa-0 no-shadow"
                        >
                            <div class="details-content">
                                <div class="details-content--item mb-4 mt-4">
                                    <div class="details-content--item--key text-right">
                                        SHA512

                                    </div>
                                    <div class="details-content--item--value">
                                        ad332bacf12da20cdcf84c6ed5dd590a8cb428acd1f636fc1a5c9fb4cf06e584b3b3c2fc97b6e0bab2d27cea60d13cd053ade7e7f2cb0aaa7117d9b1401a37a0
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        MD5
                                    </div>
                                    <div class="details-content--item--value">
                                        1f0e84c265ebe2911565c091afa36df9
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Content Type
                                    </div>
                                    <div class="details-content--item--value">
                                        application/octet-stream
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        VirusTotal
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: rgba(219, 37, 37, 0.87)" >Phishing</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                    </span>
                                        <a>DETAILS</a>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Valkyrie
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status">Clean</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        Roksit
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: rgba(219, 37, 37, 0.87)" >Phishing</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                    </span>
                                        <a>DETAILS</a>
                                    </div>
                                </div>
                                <div class="details-content--item mb-4">
                                    <div class="details-content--item--key text-right">
                                        PhishTank
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status">Clean</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                                <div class="details-content--item">
                                    <div class="details-content--item--key text-right">
                                        Hybrid Analysis
                                    </div>
                                    <div class="details-content--item--value">
                                        <span class="details-content--item--value--status" style="color: #b06000">Malicious</span>
                                        <span class="details-content--item--value--icon">
                                        <v-icon color="#757575" class="selection-icons">mdi-attachment</v-icon>
                                        <v-icon color="#757575" class="selection-icons">mdi-pound</v-icon>
                                        <v-icon color="#e0e0e0" class="selection-icons">mdi-file</v-icon>
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </v-expansion-panel-content>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </v-expansion-panel-content>
    </div>
</template>

<script>
    import VClamp from 'vue-clamp'
    import {mapGetters} from 'vuex'
    import vueCustomElement from 'vue-custom-element'
    import KShadowFrame from '../KShadowFrame'

    Vue.customElement('k-shadow-frame', KShadowFrame, {
        shadow: true,
        shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
[data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[data-title]:after {
    content: attr(data-title);
    position: absolute;
    padding:5px 16px;
    bottom: -1.6em;
    left: 100%;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
    border-radius: 4px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
}
[data-title] {
    position: relative;
}
.malicious-style {
  background-color: #f3e1e5 !important;
  color: #bb2a45 !important;
  text-decoration: underline !important;
}

.malicious-icon {
  margin: 4px;
  font-size: 18px !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
}

.red-malicious-alert {
  border: unset !important;
  border-color: transparent !important;
  border-bottom-color: transparent !important;
  border-image: none !important;
  border-image-width: 0 !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
  text-decoration: unset !important;
  text-decoration-color: transparent !important;
  font-size: 18px !important;
  margin-top: -2px;
  padding-right: 3px;
  height: 16px !important;
  overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}


.malicious-style  .red-malicious-alert:not(:first-child) {
    display: none !important;
  }
 `
    })
    import Datatable from "../../components/DataTable";

    export default {

        components: {
            VClamp,
            Datatable
        },
        props: {
            post: {
                type: Object,
                required: false,
                default: () => ({})
            },
            postIndex: {
                type: Number,
                required: true
            },
            totalPostCount: {
                type: Number,
                required: true
            }
        },
        computed: {
            ...mapGetters({
                selectedCommunity: 'threadSharing/selectedCommunityGetter',
                fetchedCommunity: 'threadSharing/fetchedCommunGetter',
                userGetter: 'auth/userGetter',
                postDetail: 'threadSharing/postDetailGetter',
                myCommunities: 'threadSharing/myCommunitiesGetter',
                getSelectedCompany: 'dashboard/getSelectedCompany',
                toggle: 'threadSharing/collapsesGetter'
            })
        },
        data: () => ({
            showFirstCollapse: false,
            showSecondCollapse: false,
            expanded: false,
            commentOpened: false,
            isWantToShareIncident: false,
            isWantToInvestigate: false,
            isWantToPostIncident: false,
            tab: 1,
            showAllTags: false,
            seeComments: false,
            rules: {
                required: v =>
                    (!!v && v.length >= 5 && v.length <= 300) || 'Minimum 5 characters - Maximum 300 character',
                regex: v =>
                    /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
                    'Only use letters, digits, period, comma, underline and hyphen'
            },
            likeCount: 15,
            userLiked: false,
            hasPermission: false,
            valid: false,
            userComment: '',
            comments: [],
            hoverTool: false,
            details: {},
            shareSettings: {},
            addCommentValue: '',
            showDatatable: true,
            columns: [
                // Should be defined to show the table
                {
                    property: "url",
                    align: "left",
                    editable: false,
                    label: "Url",
                    fixed: "left",
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 350,
                    //minWidth: 80
                },
                {
                    property: "status",
                    align: "center",
                    editable: false,
                    label: "Status",
                    fixed: 'right',
                    sortable: true,
                    show: true,
                    type: "status",
                    width: 180,
                    //minWidth: 80
                },
                {
                    property: "Valkyrie",
                    align: "left",
                    editable: false,
                    label: "Valkyrie",
                    fixed: false,
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 180,
                    //minWidth: 80
                },
                {
                    property: "Roksit",
                    align: "left",
                    editable: false,
                    label: "Roksit",
                    fixed: false,
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 180,
                    //minWidth: 80
                },
                {
                    property: "Phishtank",
                    align: "left",
                    editable: false,
                    label: "Phishtank",
                    fixed: false,
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 180,
                    //minWidth: 80
                },
                {
                    property: "UrlVoid",
                    align: "left",
                    editable: false,
                    label: "Url Void",
                    fixed: false,
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 180,
                    //minWidth: 80
                },
                {
                    property: "VirusTotal",
                    align: "left",
                    editable: false,
                    label: "Virus Total",
                    fixed: false,
                    sortable: true,
                    show: true,
                    type: "text",
                    width: 180,
                    //minWidth: 80
                },
            ],
            title: {
                icon: "mdi-tab-unselected",
                title: "Investigations",
                subTitle: ""
            },
            pageSizes: [5, 10, 25, 50, 100],
            iEmpty: {
                message: "No Data",
            },
            selectEvent: {
                clipboard: true,
                download: true
            },
            tableData: [{
                url: "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd",
                status: "Clean",
                Valkyrie: "Clean",
                Roksit: "Clean",
                Phishtank: "Clean",
                UrlVoid: "Clean",
                VirusTotal: "Clean",
            }, {
                url: "http://www.w3.org/1999/xhtml",
                status: "Clean",
                Valkyrie: "Clean",
                Roksit: "Clean",
                Phishtank: "Clean",
                UrlVoid: "Clean",
                VirusTotal: "Clean",
            }, {
                url: "http://webapplayers.com/.../email_templates/styles.css",
                status: "Clean",
                Valkyrie: "Clean",
                Roksit: "Clean",
                Phishtank: "Clean",
                UrlVoid: "Clean",
                VirusTotal: "Clean",
            }, {
                url: "https://dashboard.keepnetlabs.com/.../keepnetla...png",
                status: "Clean",
                Valkyrie: "Clean",
                Roksit: "Clean",
                Phishtank: "Clean",
                UrlVoid: "Clean",
                VirusTotal: "Clean",
            }, {
                url: "http://zinfaudioplayer221_pls.pl",
                status: "Phishing",
                Valkyrie: "Clean",
                Roksit: "Clean",
                Phishtank: "Clean",
                UrlVoid: "Clean",
                VirusTotal: "Clean",
            }]
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
                            f => f.Type === 'SenderInfo'
                        ),
                        subject: datas.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'Subject'),
                        receiverInfo: datas.CommunityPostEmails[0].ShareSettings.filter(
                            f => f.Type === 'ReceiverInfo'
                        ),
                        attachments: datas.CommunityPostEmails[0].ShareSettings.filter(
                            f => f.Type === 'Attachment'
                        ),
                        links: datas.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'Link')
                    }
                    if (ShareSettings.links && ShareSettings.links.length) {
                        setTimeout(function () {
                            for (let a of ShareSettings.links) {
                                var els = document
                                    .getElementById('sframe')
                                    .shadowRoot.querySelectorAll('[href="' + a.Value + '"]')
                                for (var i = 0, l = els.length; i < l; i++) {
                                    var el = els[i]
                                    el.setAttribute('target', '_blank')
                                    el.setAttribute('data-title', 'This link has been reported as a phishing')
                                    if (!a.IsShow) {
                                        if (!el.hasChildNodes()) {
                                            el.innerHTML = 'hidden by owner'
                                        } else {
                                            el.lastChild.innerHTML = 'hidden by owner'
                                        }
                                        el.setAttribute('href', '#')
                                    }
                                    if (a.IsMalicious) {
                                        el.classList.add('malicious-style')
                                        var iEl = document.createElement('i')
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
        mounted() {
            this.getPostDetails('', 0, true)
        },
        methods: {
            openInvestigate() {
                this.$emit('openInvestigateModal', {status: true, title: this.post.Title})
            },
            shareIncident(postId, creatorUserId) {
                this.$store.state.threadSharing.isWantToShareIncident = true
                this.$store.state.threadSharing.sharedPost = postId
                this.$store.state.threadSharing.postCreatorId = creatorUserId
            },
            userLike() {
                this.userLiked = !this.userLiked
                this.userLiked ? (this.likeCount = this.likeCount + 1) : (this.likeCount = this.likeCount - 1)
            },
            addComment() {
                if (this.$refs.comment.validate()) {
                    const commentObj = {
                        comment: this.userComment,
                        name: this.$store.state.auth.user.fullName,
                        company: this.$store.state.auth.user.currentCompany.name
                    }
                    this.comments.push(commentObj)
                    this.userComment = ''
                }
            },
            openDetails() {
                this.panel.push(0)
            },
            getPostDetails(postId, ind, bool) {
                const postDetailObj = {
                    companyId: this.getSelectedCompany.companyId || localStorage.getItem('companyId'),
                    communPostId: 'cf519747-7b6e-4060-a170-fe7f1f82d992'
                }
                this.$store.dispatch('threadSharing/getPostDetail', postDetailObj)

                if (this.toggle && this.toggle.length < 1) {
                    let arr = []
                    for (let a = 0; a < this.totalPostCount; a++) {
                        arr.push(false)
                    }
                    arr[ind] = bool
                    this.$store.commit('threadSharing/SET_COLLAPSES', arr)
                } else {
                    let newToggle = this.toggle
                    for (let b = 0; b < newToggle.length; b++) {
                        newToggle[b] = false
                    }
                    newToggle[ind] = bool
                    this.$store.commit('threadSharing/SET_COLLAPSES', newToggle)
                }
                if (this.bool === true) {
                }
            },
            userLikePost(postId, communId) {
                if (this.isJoined(communId)) {
                    const likeObj = {
                        communPostId: postId,
                        createUserId: this.userGetter.id || localStorage.getItem('userId'),
                        companyId: this.getSelectedCompany.companyId || localStorage.getItem('companyId'),
                        communId: communId
                    }
                    this.$store.dispatch('threadSharing/likePost', likeObj)
                    this.post.LikeCount = this.post.LikeCount + 1
                    this.postDetail.Data.LikeCount = this.postDetail.Data.LikeCount + 1
                    const refThis = this
                    setTimeout(() => {
                        refThis.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
                        const yourPostsObj = {
                            compId: localStorage.getItem('companyId'),
                            userId: localStorage.getItem('userId')
                        }
                        refThis.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
                    }, 500)
                }
            },
            userUnlikePost(postId, communId) {
                if (this.isJoined(communId)) {
                    const unlikeObj = {
                        communPostId: postId,
                        createUserId: this.userGetter.id || localStorage.getItem('userId'),
                        companyId: this.getSelectedCompany.companyId || localStorage.getItem('companyId'),
                        communId: communId
                    }
                    this.$store.dispatch('threadSharing/unlikePost', unlikeObj)
                    this.post.LikeCount = this.post.LikeCount - 1
                    this.postDetail.Data.LikeCount = this.postDetail.Data.LikeCount - 1
                    const refThis = this
                    setTimeout(() => {
                        refThis.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
                        const yourPostsObj = {
                            compId: localStorage.getItem('companyId'),
                            userId: localStorage.getItem('userId')
                        }
                        refThis.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
                    }, 500)
                }
            },
            addPostComment(postId, communId) {
                const commentObj = {
                    communPostId: postId,
                    comment: this.addCommentValue,
                    createUserId: this.userGetter.id || localStorage.getItem('userId'),
                    companyId: this.getSelectedCompany.companyId,
                    communId: communId
                }
                if (
                    this.addCommentValue.length >= 5 &&
                    this.addCommentValue.length <= 300 &&
                    this.isJoined(communId) &&
                    this.regexChar(this.addCommentValue)
                ) {
                    this.$store.dispatch('threadSharing/addComment', commentObj)
                    this.addCommentValue = ''
                    const refThis = this
                    this.post.CommentCount = this.post.CommentCount + 1;
                    setTimeout(() => {
                        refThis.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
                        const yourPostsObj = {
                            compId: localStorage.getItem('companyId'),
                            userId: localStorage.getItem('userId')
                        }
                        refThis.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
                    }, 500)
                }
            },
            editIncident(postId, communityName) {
                this.$store.commit('threadSharing/SET_INCIDENT_EDIT_STATUS', true)
                this.$emit('edit-incident', {postId, communityName})
            },
            deleteIncident(postId, name, postCommunityId) {
                this.$emit('delete-incident', {
                    postId: postId,
                    name: name,
                    postCommunityId: postCommunityId
                })
            },
            isJoined(communId) {
                if (this.myCommunities && this.myCommunities.length) {
                    return this.myCommunities.some(cId => cId.CommunityId === communId)
                } else {
                    return false
                }
            },
            isOwnerOfTheCommunity() {
                const creator = localStorage.getItem('communityCompanyId')
                const user = localStorage.getItem('companyId')
                if (
                    user == creator ||
                    this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId
                ) {
                    return true
                } else {
                    return false
                }
            },
            regexChar(val) {
                return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
            },
            canDelete(compId) {
                if (
                    this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId ||
                    localStorage.getItem('companyId') === localStorage.getItem('communityCompanyId') ||
                    this.getSelectedCompany.companyId === compId
                ) {
                    return true
                } else {
                    return false
                }
            },
            canEdit(compId) {
                if (
                    this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId ||
                    localStorage.getItem('companyId') === localStorage.getItem('communityCompanyId') ||
                    this.getSelectedCompany.companyId === compId
                ) {
                    return true
                } else {
                    return false
                }
            },
            maliciousFound() {
                return this.shareSettings.attachments.some(at => at.IsMalicious === true)
            }
        }
    }
</script>

<style lang="scss" scoped>

    .mdi-attachment{
        transform: rotate(90deg);
    }
    .attachment-analysis-item {
        border-radius: 20px;
        box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14), 0 3px 1px -2px rgba(80, 80, 80, 0.12);
        background-color: #ffffff;
        padding: 26px;
        position: relative;
        &:first-child{
            margin-bottom: 16px;
        }
    }

    .v-application p {
        margin-bottom: 0;
    }

    .wrap-padding {
        padding: 28px !important;
    }

    .collapse-details {
        position: absolute;
        top: 19px;
        right: 24px;
    }

    .attachment-name {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
    }

    .wrf {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
    }

    .not-found{
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(219, 37, 37, 0.87);
    }

    .download {
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        color: #2196f3;
    }

    .details-content {
        &--item {
            display: flex;

            &--value {
                font-family: 'Open Sans', sans-serif !important;
                font-size: 14px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.5;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87);

                a {
                    font-size: 14px;
                    font-weight: 600;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #2196f3;
                }

                &--status {
                    min-width: 80px;
                    display: inline-block;
                }

                &--icon {
                    min-width: 100px;
                    display: inline-block;
                    margin-right: 28px;
                    .v-icon{
                       font-size: 12px;
                        object-fit: contain;
                    }
                }
            }

            &--key {
                height: 24px;
                font-family: 'Open Sans', sans-serif !important;
                font-size: 14px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.71;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87);
                min-width: 104px;
                margin-right: 24px;
            }
        }
    }

    .cursor-pointer {
        cursor: pointer;
    }

    // Threat sharing Content
    ::v-deep .v-slide-group__content.v-tabs-bar__content:after {
        content: '';
        height: 2px;
        width: 100%;
        background-color: #e4e7ed;
        bottom: 0px;
        left: 0;
        position: absolute;
    }

    .single-post {
        margin: 15px !important;
        border-radius: 12px;
        border-radius: 12px;
        box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
        background-color: #ffffff;
        padding: 24px;
    }

    .single-post-header {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: normal;
        color: #2196f3;
        margin-top: 24px;
        margin-bottom: 40px;
        display: block;
    }

    ::v-deep .v-window-item {
        margin-top: 24px;
    }

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
        align-items: flex-start;
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
            color: var(--black-87);
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

        a:not(:last-child) {
            text-decoration: none;
            display: block;
            width: max-content;
            min-width: max-content;
        }

        a:last-child {
            width: unset !important;
            max-width: 100%;
            display: block;
            overflow: hidden;
            text-decoration: none;
            text-overflow: ellipsis;
            white-space: nowrap;
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
        border-radius: 0 !important;
        margin-top: 24px;
        display: inline-block;

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
            width: auto;
            height: 27px;
            font-family: Lato;
            font-size: 22px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: 0.3px;
            color: #434343 !important;
            padding-left: 0px;
            padding-right: 0px;
            margin-right: 48px;
            text-transform: capitalize !important;
        }

        ::v-deep .v-tab--active {
            color: #2196f3 !important;
        }

        ::v-deep .v-tabs-bar {
            height: 48px !important;
            border-radius: 0 !important;
            margin-top: 24px;
        }
    }

    ::v-deep .v-window {
        border-radius: 20px !important;
    }

    ::v-deep .v-expansion-panel-content {
        border-radius: 20px !important;
        display: block !important;
        font-family: 'Open Sans', sans-serif !important;
    }

    ::v-deep .v-expansion-panel-content__wrap {
        border-radius: 12px;
        background-color: #ffffff;
        box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
        background-color: #ffffff;
    }

    ::v-deep .no-shadow .v-expansion-panel-content__wrap {
        border-radius: 0;
        box-shadow: none;
        background-color: #ffffff;
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

        span:nth-child(2) {
            padding-top: 4px;
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
        font-size: 18px !important;
        color: #bb2a45 !important;
        caret-color: #bb2a45 !important;
    }

    ::v-deep .red-malicious-alert {
        border: unset !important;
        border-color: transparent !important;
        border-bottom-color: transparent !important;
        border-image: none !important;
        border-image-width: 0 !important;
        color: #bb2a45 !important;
        caret-color: #bb2a45 !important;
        text-decoration: unset !important;
        text-decoration-color: transparent !important;
        font-size: 18px !important;
        margin-top: -2px;
        padding-right: 3px;
        height: 16px !important;
        overflow: hidden;
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
