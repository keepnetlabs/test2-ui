<template>
  <div class="incident-wrapper">
    <div class="incident-container">
      <div class="incident-inner">
        <v-card
          id="post-incident-card"
          light
          class="incident-card pb-4 pa-6"
          style="border-radius: 0 !important;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-send</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title class="v-card-headline">Post an Incident</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div id="incident-step-container" class="incident-steps">
            <div id="step-one-container" class="steps">
              <div v-if="step < 2" :class="{ 'active-step': step === 1 }" class="step-number">
                1
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 1,
                  'hide-step': step === 3 || step === 4 || step === 5
                }"
                class="step-name"
                >Select Incident</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-two-container" class="steps">
              <div v-if="step < 3" :class="{ 'active-step': step === 2 }" class="step-number">
                2
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 2,
                  'hide-step': step === 1 || step === 4 || step === 5
                }"
                class="step-name"
                >General Info</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-three-container" class="steps">
              <div v-if="step < 4" :class="{ 'active-step': step === 3 }" class="step-number">
                3
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 3,
                  'hide-step': step === 1 || step === 2 || step === 5
                }"
                class="step-name"
                >Incident Details</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-four-container" class="steps">
              <div v-if="step < 5" :class="{ 'active-step': step === 4 }" class="step-number">
                4
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 4,
                  'hide-step': step === 1 || step === 2 || step === 3
                }"
                class="step-name"
                >Attributes</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-five-container" class="steps">
              <div v-if="step < 6" :class="{ 'active-step': step === 5 }" class="step-number">
                5
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 5,
                  'hide-step': step === 1 || step === 2 || step === 3 || step === 4
                }"
                class="step-name"
                >Preview</span
              >
            </div>
          </div>
          <div id="post-step-one" v-if="step === 1">
            <div class="incident-header pb-6">
              <p>Select Incident</p>
              <span
                >Search for the reported incident or upload an email to post as an incident</span
              >
            </div>
            <div v-if="!selectedEmail" class="incident-content">
              <div class="input-header">Find Incident</div>
              <div class="input-sub">Search and find emails among reported incidents</div>
              <input style="display: none;" type="text" name="fakeusernameremembered" />
              <v-autocomplete
                id="select-incident-autocomplete"
                v-model="selectedEmail"
                :search-input.sync="searchIncident"
                :items="listData"
                chips
                clearable
                hide-selected
                label="Search for incident name or status"
                class="first-select input-select mb-6"
                solo
                :rules="autocomplete"
                required
                @change="getSelectedEmailPreview"
              >
                <template v-slot:selection="{ attrs, item }">
                  <v-chip
                    id="select-inc-chip"
                    v-bind="attrs"
                    color="#2196f3"
                    :input-value="item.subject"
                    label
                    small
                  >
                    <span class="pr-2">{{ item.subject }}</span>
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  <div class="select-row-wrap">
                    <div class="email-name">{{ item.subject }}</div>
                    <div class="select-row-inline">
                      <div class="file-type-wrap">
                        <v-icon
                          :style="{
                            visibility: item.attachmentCount != 0 ? 'visible' : 'hidden'
                          }"
                          class="email-icon"
                          >mdi-paperclip
                        </v-icon>
                        <div
                          class="email-type"
                          :class="[
                            item.result === 'BeingAnalyzed' ? 'btn-pending' : '',
                            item.result === 'Malicious' ? 'btn-cancelled' : '',
                            item.result === 'non-malicious' ? 'btn-active' : '',
                            item.result === 'Phishing' ? 'btn-warning' : ''
                          ]"
                        >
                          <span>{{ item.result }}</span>
                        </div>
                      </div>
                      <div id="email-time" class="email-time">{{ item.createDate }}</div>
                    </div>
                  </div>
                </template>
              </v-autocomplete>
              <div class="input-header mb-6">- or -</div>
              <div class="input-header">Upload Email</div>
              <div class="input-sub">.eml or .msg files only.</div>
              <div class="upload-wrapper">
                <div
                  class="v-input up-btn v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--placeholder"
                  id="upload-btn"
                >
                  <div class="v-input__prepend-outer">
                    <div class="v-input__icon v-input__icon--prepend">
                      <i
                        role="button"
                        tabindex="0"
                        class="v-icon notranslate v-icon--link material-icons theme--light"
                        >false</i
                      >
                    </div>
                  </div>
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-input__prepend-inner">
                        <div class="v-input__icon v-input__icon--prepend-inner">
                          <i class="v-icon notranslate mdi mdi-upload theme--light"></i>
                        </div>
                      </div>
                      <div class="v-text-field__slot">
                        <div class="v-file-input__text v-file-input__text--placeholder">Upload</div>
                        <input
                          name="file"
                          id="upload-file-input"
                          type="file"
                          @change="uploadFile"
                          accept=".eml,.msg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <span
                id="post-first-error"
                v-if="selectedEmail || msgEmlFile == null"
                class="select-error"
                >Please select an incident or upload an email</span
              >
            </div>
            <div id="post-first-preview-container" class="mt-2" v-else-if="selectedEmail">
              <v-card
                id="post-first-preview-card"
                light
                class="pb-4 pt-0 mt-2 pa-6 investigation-content"
                style="width: 600px;"
              >
                <div class="mail-preview pt-0">
                  <v-icon
                    id="post-first-preview-close"
                    :disabled="!!editItem"
                    class="close-incident"
                    @click="closePreview()"
                    >mdi-close-circle
                  </v-icon>
                  <div class="preview-header pt-0">
                    <h2
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-if="!uploadRespond.isSubjectHidden && !!uploadRespond.subject"
                    >
                      Subject: {{ uploadRespond.subject }}
                    </h2>
                    <h2
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-else-if="uploadRespond.isSubjectHidden"
                    >
                      Subject: Hidden by owner
                    </h2>
                    <div class="header-info pb-5">
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-if="!uploadRespond.isFromHidden && !!uploadRespond.from"
                      >
                        From: {{ uploadRespond.from }}
                      </div>
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-else-if="uploadRespond.isFromHidden"
                      >
                        From: Hidden by owner
                      </div>
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-if="
                          !uploadRespond.isToHidden &&
                          uploadRespond.to &&
                          !!uploadRespond.to.toString()
                        "
                      >
                        To: {{ uploadRespond.to && uploadRespond.to.toString() }}
                      </div>
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-else-if="uploadRespond.isToHidden"
                      >
                        To: Hidden by owner
                      </div>
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-if="
                          !uploadRespond.isCcHidden &&
                          uploadRespond.cc &&
                          !!uploadRespond.cc.toString()
                        "
                      >
                        CC: {{ uploadRespond.cc && uploadRespond.cc.toString() }}
                      </div>
                      <div
                        style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        v-else-if="uploadRespond.isCcHidden"
                      >
                        CC: Hidden by owner
                      </div>
                      <div>
                        Date: {{ uploadRespond.sentTime }}
                        <br />
                      </div>
                    </div>
                  </div>
                  <div id="previewed-body" class="preview-body">
                    <k-shadow-frame id="incident-preview-1" :content="uploadRespond.body" />
                  </div>
                  <div
                    id="preview-footer-container"
                    class="preview-footer"
                    v-if="
                      !!uploadRespond &&
                      uploadRespond.attachments &&
                      uploadRespond.attachments.length
                    "
                  >
                    <h2>Attachments</h2>
                    <div class="attachment-wrapper">
                      <div
                        v-for="(att, ind) of uploadRespond.attachments"
                        :key="ind + att.id"
                        :id="'attachment-' + att.name"
                        class="attachment red-attach"
                        :class="[
                          att.isFlagged ? 'red-attach' : '',
                          !att.isFlagged ? 'blue-attach' : '',
                          !att.isHidden ? 'clean-attach' : ''
                        ]"
                      >
                        <div v-if="att.isFlagged" class="attach-icon red-icon">
                          <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                        </div>
                        <div v-else class="attach-icon blue-icon">
                          <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                        </div>
                        <v-tooltip bottom opacity="1" z-index="9999">
                          <template v-slot:activator="{ on }">
                            <div v-on="on" v-if="!att.isHidden" class="file-name max-char pl-2">
                              {{ att.name }}
                            </div>
                            <div v-on="on" v-if="att.isHidden" class="file-name max-char pl-2">
                              hidden by owner
                            </div>
                          </template>
                          <span>{{ !att.isHidden ? att.name : 'hidden by owner' }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
          <div id="post-step-two" class="step-container" v-if="step === 2">
            <div class="incident-header">
              <p>General Info</p>
              <span>
                Include title, description of incident and neccessary files(pics, documents, or
                code)
              </span>
            </div>
            <div class="incident-content">
              <div class="input-header">Title</div>
              <v-form v-model="valid" ref="titleInput">
                <v-text-field
                  id="post-title-text-field"
                  @mouseover.native="hover = true"
                  label="Title"
                  outlined
                  dense
                  class="title-field filter-field pt-4"
                  v-model="uploadRespond.Title"
                  solo
                  requied
                  validate-on-blur
                  :rules="[titleRule.default, titleRule.regex, titleRule.required, titleRule.empty]"
                ></v-text-field>
              </v-form>
              <!--<span class="required">*Required</span>-->
              <div class="input-header pt-6">Description</div>
              <div class="input-sub pb-1">Describe the incident briefly (Max. 300 characters)</div>
              <v-form v-model="valid" ref="descriptionInput">
                <v-textarea
                  id="post-description-textarea"
                  @mouseover.native="hover = true"
                  outlined
                  dense
                  auto-grow
                  class="comment-input"
                  rows="5"
                  row-height="15"
                  solo
                  validate-on-blur
                  :rules="[descRule.required, descRule.regex, descRule.empty, descRule.default]"
                  v-model="uploadRespond.Description"
                ></v-textarea>
              </v-form>

              <div class="input-header pt-6">Category</div>
              <div class="input-sub pb-1">Select threat categories</div>
              <v-form v-model="categoryValid" ref="categoryInput">
                <v-select
                  id="post-category-select"
                  class="cat-select"
                  v-model="uploadRespond.CategoryResourceIdArray"
                  :items="categories"
                  item-value="resourceId"
                  item-text="name"
                  requied
                  solo
                  multiple
                  outlined
                  required
                  :rules="category"
                  :class="{
                    'errored-selectbox':
                      uploadRespond &&
                      uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length < 1
                  }"
                >
                  <template v-slot:append-item></template>
                </v-select>
              </v-form>
              <!--<span class="required">*Required</span>-->
            </div>
          </div>
          <div id="post-step-three" class="step-container" v-if="step === 3">
            <div class="incident-header">
              <p>Incident Details</p>
              <span>
                Enter information on discovery of threat, how it affects and how to fight against
              </span>
            </div>
            <div class="incident-content">
              <div class="input-header">Discovery and Detection</div>
              <div class="input-sub">
                Explain how the threat was detected and what tools were used?
              </div>
              <v-form v-model="validDisc" ref="discoveryInput">
                <v-textarea
                  id="post-discovery-textarea"
                  v-model="uploadRespond.DiscoveryAndDetection"
                  @mouseover.native="hover = true"
                  outlined
                  dense
                  auto-grow
                  class="comment-input"
                  rows="5"
                  row-height="15"
                  validate-on-blur
                  :rules="[
                    explanationRules.default,
                    explanationRules.regex,
                    explanationRules.required,
                    explanationRules.empty
                  ]"
                  requied
                  solo
                ></v-textarea>
              </v-form>

              <div class="input-header pb-5 pt-7">Impact Range</div>
              <div class="input-sec-header">Affect Area</div>
              <div class="input-sub">Which systems and programs are affected by the threat?</div>
              <v-form v-model="validAffect" ref="affectInput">
                <v-combobox
                  id="post-affect-area-combobox"
                  v-model="uploadRespond.AffectArea"
                  :search-input.sync="affectSearch"
                  label="Windows 10 etc."
                  multiple
                  :clearable="true"
                  append-icon
                  chips
                  deletable-chips
                  class="affect-combobox affect-input"
                  @keyup.tab="updateTags"
                  @paste="false"
                  solo
                  outlined
                  dense
                  validate-on-blur
                  onPaste="return false"
                  @blur="validateAffectArea"
                  :rules="[affectRules.regex]"
                ></v-combobox>
              </v-form>

              <div class="input-sec-header pt-3">Scope</div>
              <div class="input-sub">How does it work and affect your systems?</div>
              <v-form v-model="validScope" ref="scopeInput">
                <v-text-field
                  id="post-scope-textfield"
                  @mouseover.native="hover = true"
                  label="Explain"
                  outlined
                  dense
                  class="filter-field"
                  v-model="uploadRespond.Scope"
                  solo
                  validate-on-blur
                  ref="scopeTextField"
                  required
                  :rules="[
                    scopeRules.default,
                    scopeRules.regex,
                    scopeRules.required,
                    scopeRules.empty
                  ]"
                ></v-text-field>
              </v-form>
            </div>
          </div>
          <div id="post-step-four" v-if="step === 4">
            <div class="investigate-header">
              <p>Attributes</p>
              <span>
                Select the information you want to share, and hide others. Select at least 1
                attribute.
              </span>
            </div>
            <div class="investigation-content">
              <div class="mail-preview">
                <div class="preview-header pt-0">
                  <h2
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    v-if="!uploadRespond.isSubjectHidden && !!uploadRespond.subject"
                    :class="{ 'malicious-style': uploadRespond.isSubjectFlagged }"
                  >
                    Subject: {{ uploadRespond.subject }}
                  </h2>
                  <h2
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    v-else-if="uploadRespond.isSubjectHidden && !!uploadRespond.subject"
                    :class="{ 'malicious-style': uploadRespond.isSubjectFlagged }"
                  >
                    Subject: Hidden by owner
                  </h2>
                  <div class="header-info pb-5">
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-if="!uploadRespond.isFromHidden && !!uploadRespond.from"
                      :class="{ 'malicious-style': uploadRespond.isFromFlagged }"
                    >
                      From: {{ uploadRespond.from }}
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-else-if="uploadRespond.isFromHidden && !!uploadRespond.from"
                      :class="{ 'malicious-style': uploadRespond.isFromFlagged }"
                    >
                      From: Hidden by owner
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-if="
                        !uploadRespond.isToHidden && uploadRespond.to && !!uploadRespond.to.length
                      "
                      :class="{ 'malicious-style': uploadRespond.isToFlagged }"
                    >
                      To: {{ uploadRespond.to && uploadRespond.to.toString() }}
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-else-if="
                        uploadRespond.isToHidden && uploadRespond.to && !!uploadRespond.to.length
                      "
                      :class="{ 'malicious-style': uploadRespond.isToFlagged }"
                    >
                      To: Hidden by owner
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-if="
                        !uploadRespond.isCcHidden && uploadRespond.cc && !!uploadRespond.cc.length
                      "
                      :class="{ 'malicious-style': uploadRespond.isCcFlagged }"
                    >
                      CC: {{ uploadRespond.cc && uploadRespond.cc.toString() }}
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-else-if="uploadRespond.isCcHidden && !!uploadRespond.cc.length"
                      :class="{ 'malicious-style': uploadRespond.isCcFlagged }"
                    >
                      CC: Hidden by owner
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-if="
                        !uploadRespond.isCcHidden && uploadRespond.bcc && !!uploadRespond.bcc.length
                      "
                      :class="{ 'malicious-style': uploadRespond.isBccFlagged }"
                    >
                      CC: {{ uploadRespond.bcc && uploadRespond.bcc.toString() }}
                    </div>
                    <div
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                      v-else-if="uploadRespond.isBccHidden && !!uploadRespond.bcc.length"
                      :class="{ 'malicious-style': uploadRespond.isBccFlagged }"
                    >
                      BCC: Hidden by owner
                    </div>
                    <div>
                      Date: {{ uploadRespond.sentTime }}
                      <br />
                    </div>
                  </div>
                </div>
                <div id="last-preview-body" class="preview-body">
                  <k-shadow-frame
                    id="last-preview-body-shadow-root"
                    :content="uploadRespond.body"
                  />
                </div>
                <div
                  id="preview-footer-container-att"
                  class="preview-footer"
                  v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                >
                  <h2>Attachments</h2>
                  <div class="attachment-wrapper">
                    <div
                      v-for="(att, ind) of uploadRespond.attachments"
                      :key="ind + att.id"
                      :id="'attachment-' + att.name"
                      class="attachment red-attach"
                      :class="[
                        att.isFlagged ? 'red-attach' : '',
                        !att.isFlagged ? 'blue-attach' : '',
                        !att.isHidden ? 'clean-attach' : ''
                      ]"
                    >
                      <div v-if="att.isFlagged" class="attach-icon red-icon">
                        <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                      </div>
                      <div v-else class="attach-icon blue-icon">
                        <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                      </div>
                      <v-tooltip bottom opacity="1" z-index="9999">
                        <template v-slot:activator="{ on }">
                          <div v-on="on" v-if="!att.isHidden" class="file-name max-char pl-2">
                            {{ att.name }}
                          </div>
                          <div v-on="on" v-if="att.isHidden" class="file-name max-char pl-2">
                            hidden by owner
                          </div>
                        </template>
                        <span>{{ !att.isHidden ? att.name : 'hidden by owner' }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="post-filters"
                :class="{ 'minify-filter': !filterOpened }"
                class="investigation-filters"
              >
                <div :class="{ 'minify-part': !filterOpened }" class="filter-header">
                  <div class="select-header" v-if="filterOpened">Select Attributes</div>
                  <v-icon @click="filterOpened = true" :class="{ 'display-none': filterOpened }"
                    >mdi-arrow-left
                  </v-icon>
                  <v-icon @click="filterOpened = false" :class="{ 'display-none': !filterOpened }"
                    >mdi-arrow-right
                  </v-icon>
                </div>
                <div :class="{ 'minify-part': !filterOpened }" class="filter-part">
                  <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                    <div class="img-wrapper">
                      <img src="../../assets/img/filter-icons/header-all.svg" />
                    </div>
                    <v-switch v-model="allHeader" @change="headerValChange"></v-switch>
                    <label v-if="filterOpened">All Header</label>
                  </div>
                  <div
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                    v-if="uploadRespond.subject"
                  >
                    <div v-if="!uploadRespond.isSubjectFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/short-text.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img
                        srcset="../../assets/img/filter-icons/short-text.svg"
                        src="../../assets/img/filter-icons/short-text.svg"
                      />
                    </div>
                    <v-switch
                      v-model="uploadRespond.isSubjectHidden"
                      @change="subjectValChange"
                    ></v-switch>
                    <label v-if="filterOpened">Subject</label>
                    <v-menu v-model="subSettings" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': subSettings }"
                            v-on="on"
                            @click="subSettings = !subSettings"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isSubjectFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!uploadRespond.isSubjectFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isSubjectFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="uploadRespond.isSubjectFlagged">mdi-check</v-icon>
                            </div>
                            Flagged Subject
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                    v-if="uploadRespond.from"
                  >
                    <div v-if="!uploadRespond.isFromFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-in.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-in.svg" />
                    </div>
                    <v-switch
                      v-model="uploadRespond.isFromHidden"
                      @change="fromValChange"
                    ></v-switch>
                    <label v-if="filterOpened">From</label>
                    <v-menu v-model="fromSettings" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': fromSettings }"
                            v-on="on"
                            @click="fromSettings = !fromSettings"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isFromFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!uploadRespond.isFromFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isFromFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="uploadRespond.isFromFlagged">mdi-check</v-icon>
                            </div>
                            Flagged From
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                    v-if="uploadRespond.to && !!uploadRespond.to.length"
                  >
                    <div v-if="!uploadRespond.isToFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <v-switch v-model="uploadRespond.isToHidden" @change="toValChange"></v-switch>
                    <label v-if="filterOpened">To</label>
                    <v-menu v-model="toSettings" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': toSettings }"
                            v-on="on"
                            @click="toSettings = !toSettings"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isToFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!uploadRespond.isToFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isToFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="uploadRespond.isToFlagged">mdi-check</v-icon>
                            </div>
                            Flagged To
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                    v-if="uploadRespond.cc && !!uploadRespond.cc.length"
                  >
                    <div v-if="!uploadRespond.isCcFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <v-switch v-model="uploadRespond.isCcHidden" @change="ccValChange"></v-switch>
                    <label v-if="filterOpened">CC</label>
                    <v-menu v-model="ccSettings" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': ccSettings }"
                            v-on="on"
                            @click="ccSettings = !ccSettings"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isCcFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!uploadRespond.isCcFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isCcFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="uploadRespond.isCcFlagged">mdi-check</v-icon>
                            </div>
                            Flagged CC
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                    v-if="uploadRespond.bcc && !!uploadRespond.bcc.length"
                  >
                    <div v-if="!uploadRespond.isBccFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/user-out.svg" />
                    </div>
                    <v-switch v-model="uploadRespond.isBccHidden" @change="bccValChange"></v-switch>
                    <label v-if="filterOpened">BCC</label>
                    <v-menu v-model="bccSettings" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': bccSettings }"
                            v-on="on"
                            @click="bccSettings = !bccSettings"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isBccFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!uploadRespond.isBccFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="uploadRespond.isBccFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="uploadRespond.isBccFlagged">mdi-check</v-icon>
                            </div>
                            Flagged BCC
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
                <div
                  :class="{ 'minify-part': !filterOpened }"
                  class="filter-part pt-5"
                  v-if="uploadRespond.urls && !!uploadRespond.urls.length"
                >
                  <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                    <div class="img-wrapper">
                      <img src="../../assets/img/filter-icons/link.svg" />
                    </div>
                    <v-switch v-model="allLinks" @change="allUrlsValChange"></v-switch>
                    <label v-if="filterOpened">All Links</label>
                  </div>
                  <div
                    v-for="(url, ind) of uploadRespond.urls"
                    :key="ind + url.url + 'url'"
                    :id="ind + url.url + 'url'"
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                  >
                    <div v-if="!url.isFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/link.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/link-red.svg" />
                    </div>
                    <v-switch
                      :id="'attach-switch-' + url.url"
                      v-model="url.isHidden"
                      @change="urlSwitchChange(url, ind)"
                    ></v-switch>
                    <v-tooltip bottom opacity="1" z-index="9999">
                      <template v-slot:activator="{ on }">
                        <label v-on="on" v-if="filterOpened">{{ url.url || url.url }}</label>
                      </template>
                      <span>{{ url.url || url.url }}</span>
                    </v-tooltip>
                    <v-menu v-model="attcChevron[ind]" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': attcChevron[ind] }"
                            v-on="on"
                            @click="attcChevron[ind] = !attcChevron[ind]"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="url.isFlagged = false"
                          @change="urlSwitchChange(url, ind)"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!url.isFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="url.isFlagged = true"
                          @change="urlSwitchChange(url, ind)"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="url.isFlagged">mdi-check</v-icon>
                            </div>
                            Phishing Link
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>

                <div
                  :class="{ 'minify-part': !filterOpened }"
                  class="filter-part pt-5"
                  v-if="uploadRespond.attachments && !!uploadRespond.attachments.length"
                >
                  <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                    <div class="img-wrapper">
                      <img src="../../assets/img/filter-icons/header-all.svg" />
                    </div>
                    <v-switch v-model="allAttachments" @change="allAttachmentsValChange"></v-switch>
                    <label v-if="filterOpened">All Attachments</label>
                  </div>
                  <div
                    v-for="(attachment, ind) of uploadRespond.attachments"
                    :key="ind + attachment.name"
                    :class="{ 'minify-switch': !filterOpened }"
                    class="switch-row"
                  >
                    <div v-if="!attachment.isFlagged" class="img-wrapper">
                      <img src="../../assets/img/filter-icons/attach-file.svg" />
                    </div>
                    <div v-else class="img-wrapper">
                      <img src="../../assets/img/filter-icons/attach-red.svg" />
                    </div>
                    <v-switch
                      :id="'attach-switch-' + attachment.name"
                      v-model="attachment.isHidden"
                    ></v-switch>
                    <label v-if="filterOpened">{{ attachment.name }}</label>
                    <v-menu v-model="urls[ind]" right offset-x transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-btn class="chevron-btn-menu" icon>
                          <v-icon
                            :class="{ 'chevron-down': urls[ind] }"
                            v-on="on"
                            @click="urls[ind] = !urls[ind]"
                            >mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="attachment.isFlagged = false"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="!attachment.isFlagged">mdi-check</v-icon>
                            </div>
                            None
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="pl-1 mal-list-wrapper"
                          @click="attachment.isFlagged = true"
                        >
                          <v-list-item-title class="mal-list-row">
                            <div class="mal-icon-wrapper">
                              <v-icon v-if="attachment.isFlagged">mdi-check</v-icon>
                            </div>
                            Malicious File
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
                <span v-if="allFiltersClosed()" class="filter-no-selected" id="select-one-attr"
                  >Please select at least 1 attribute</span
                >
              </div>
            </div>
          </div>
          <div id="post-step-five" v-if="step === 5">
            <div class="incident-header pb-8">
              <p>Preview</p>
              <span>See how your post will look like</span>
            </div>
            <v-checkbox
              class="is-anonym-check"
              v-model="isAnonym"
              label="Post as anonymous"
              color="#2196f3"
              id="anonym-check"
            ></v-checkbox>
            <div id="last-preview-post" class="post-wrapper">
              <v-expansion-panels :multiple="false" v-model="panel" class="mb-4">
                <v-expansion-panel>
                  <div class="threat-sharing-content">
                    <div class="ts-header">
                      <div id="last-preview-title" class="ts-title">
                        <span v-if="uploadRespond.subject">{{ uploadRespond.subject }}</span>
                        <span v-else>Post Title</span>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div class="ts-header-btn-1">
                        <v-expansion-panel-header
                          id="last-preview-collapse-container"
                          class="pa-0"
                          style="min-height: 36px;"
                          @click="toggle = !toggle"
                          disable-icon-rotate
                          ref="expandIncident"
                        >
                          <template v-slot:actions mandatory="true">
                            <v-btn
                              id="last-preview-collapse"
                              v-if="!toggle"
                              outlined
                              rounded
                              medium
                              color="blue"
                              >COLLAPSE
                            </v-btn>
                            <v-btn
                              id="last-preview-details"
                              v-else
                              outlined
                              rounded
                              medium
                              color="blue"
                              >DETAILS
                            </v-btn>
                          </template>
                        </v-expansion-panel-header>
                      </div>
                    </div>

                    <div class="ts-user-comp">
                      <div id="last-prev-user-comp" class="ts-user-comp-detail">
                        by
                        <a v-if="uploadRespond.from" href="#" class="pl-1 pr-1">
                          <span v-if="!isAnonym">{{ uploadRespond.from }}</span>
                          <span v-else>Anonymous</span>
                        </a>
                        <a v-else href="#" class="pl-1 pr-1">{{ uploadRespond.from }}</a> from
                        <a v-if="currentCompany" :id="currentCompany" href="#" class="pl-1 pr-1">
                          <span v-if="!isAnonym">{{ currentCompany }}</span>
                          <span v-else>Anonymous</span>
                        </a>
                        <a v-else class="pl-1 pr-1">Company Name</a> on
                        <a class="pl-1 pr-1">
                          {{ currentCommunityName }}
                        </a>
                      </div>
                      <div class="ts-user-date">
                        <span>{{ uploadRespond.sentTime }}</span>
                      </div>
                    </div>
                    <div class="ts-body">
                      <v-clamp
                        v-if="uploadRespond.Description"
                        :id="uploadRespond.Description"
                        autoresize
                        :max-lines="3"
                        >{{ uploadRespond.Description }}
                      </v-clamp>
                    </div>
                    <div id="post-inc-preview-footer" class="ts-footer d-flex row wrap">
                      <div class="ts-like mt-1">
                        <v-btn text x-small icon color="grey">
                          <v-icon>mdi-thumb-up</v-icon>
                        </v-btn>
                        <span class="ts-action-counter">0</span>
                      </div>
                      <div class="ts-message mt-1">
                        <v-btn text x-small icon color="grey">
                          <v-icon>mdi-message-reply-text</v-icon>
                        </v-btn>
                        <span class="ts-action-counter">0</span>
                      </div>
                      <div class="ts-harmful mt-1">
                        <v-btn v-if="maliciousCount" text x-small icon color="red">
                          <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
                        </v-btn>
                        <span class="ts-actions">{{ maliciousCount }} harmful items</span>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div class="ts-tags">
                        <v-btn
                          v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn text-none"
                          id="post-inc-last-prev-attach"
                        >
                          <span v-if="uploadRespond.attachments.length === 1">Attachment</span>
                          <span v-else-if="uploadRespond.attachments.length > 1">Attachments</span>
                        </v-btn>
                        <v-btn
                          v-if="
                            uploadRespond.CategoryResourceIdArray &&
                            uploadRespond.CategoryResourceIdArray.length
                          "
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          id="incident-badge"
                          >{{ findCategory(uploadRespond.CategoryResourceIdArray[0]) }}
                        </v-btn>
                        <v-btn
                          v-if="
                            uploadRespond.CategoryResourceIdArray &&
                            uploadRespond.CategoryResourceIdArray.length > 1 &&
                            uploadRespond.attachments &&
                            !uploadRespond.attachments.length
                          "
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          id="incident-badge-attach"
                          >{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}
                        </v-btn>
                        <div style="position: relative;">
                          <v-btn
                            v-if="
                              (uploadRespond.attachments &&
                                uploadRespond.attachments.length &&
                                uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length > 1) ||
                              (uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length > 2)
                            "
                            text
                            small
                            rounded
                            outlined
                            class="tag-btn ml-1 text-none"
                            @mouseover="hoverTool = true"
                            @mouseleave="hoverTool = false"
                            id="post-inc-last-prev-with-tooltip"
                          >
                            <span
                              v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                              >+{{ uploadRespond.CategoryResourceIdArray.length - 1 }}</span
                            >
                            <span v-else
                              >+{{ uploadRespond.CategoryResourceIdArray.length - 2 }}</span
                            >
                          </v-btn>
                          <div
                            v-if="
                              uploadRespond.CategoryResourceIdArray &&
                              uploadRespond.CategoryResourceIdArray.length >= 1
                            "
                            v-show="hoverTool"
                            class="tooltip-wrapper"
                          >
                            <div
                              v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                            >
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[1])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                            </div>
                            <div
                              v-if="
                                uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length === 1
                              "
                            >
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[1])
                              }}</span>
                            </div>
                            <div
                              v-else-if="
                                uploadRespond.attachments && !uploadRespond.attachments.length
                              "
                            >
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <v-expansion-panel-content
                    eager
                    class="expand-body member-company-body pb-3 pa-0"
                  >
                    <v-tabs
                      v-model="tab"
                      background-color="transparent"
                      color="basil"
                      class="tab-bar v-tabs-bar__details-tab"
                      id="last-prev-tabs"
                    >
                      <v-tab>Details</v-tab>
                      <v-tab>Email Preview</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item>
                        <div id="last-detail-parts" class="detail-parts">
                          <p
                            v-if="
                              (uploadRespond.subject &&
                                !uploadRespond.isSubjectHidden &&
                                uploadRespond.isSubjectFlagged) ||
                              (!!uploadRespond.from &&
                                !uploadRespond.isFromHidden &&
                                uploadRespond.isFromFlagged) ||
                              (uploadRespond.to &&
                                !!uploadRespond.to.length &&
                                !uploadRespond.isToHidden &&
                                uploadRespond.isToFlagged) ||
                              (uploadRespond.cc &&
                                !!uploadRespond.cc.length &&
                                !uploadRespond.isCcHidden &&
                                uploadRespond.isCcFlagged) ||
                              (uploadRespond.bcc &&
                                !!uploadRespond.bcc.length &&
                                !uploadRespond.isBccHidden &&
                                uploadRespond.isBccFlagged)
                            "
                            class="detail-black disc-header"
                          >
                            Header
                          </p>
                          <div>
                            <p
                              v-if="uploadRespond.subject && uploadRespond.isSubjectFlagged"
                              :id="uploadRespond.subject"
                              class="detail-black detail-red"
                            >
                              Subject:
                              {{
                                !uploadRespond.isSubjectHidden
                                  ? uploadRespond.subject
                                  : 'hidden by owner'
                              }}
                            </p>
                            <p
                              v-if="
                                uploadRespond &&
                                uploadRespond.subject &&
                                uploadRespond.isSubjectFlagged
                              "
                              id="harmful-Subject"
                              class="detail-black"
                            >
                              The Subject is harmful
                            </p>
                          </div>
                          <div>
                            <p
                              v-if="uploadRespond.from && uploadRespond.isFromFlagged"
                              :id="uploadRespond.from"
                              class="detail-black detail-red"
                            >
                              From:
                              {{
                                !uploadRespond.isFromHidden ? uploadRespond.from : 'hidden by owner'
                              }}
                            </p>
                            <p
                              v-if="
                                uploadRespond && uploadRespond.from && uploadRespond.isFromFlagged
                              "
                              id="harmful-sender"
                              class="detail-black"
                            >
                              The from email address has been reported as harmful email.
                            </p>
                          </div>
                          <div>
                            <p
                              v-if="uploadRespond.to && uploadRespond.isToFlagged"
                              class="detail-black detail-red"
                            >
                              To:
                              {{
                                !uploadRespond.isToHidden
                                  ? uploadRespond.to.toString()
                                  : 'hidden by owner'
                              }}
                            </p>
                            <p
                              v-if="uploadRespond && uploadRespond.to && uploadRespond.isToFlagged"
                              id="harmful-to"
                              class="detail-black"
                            >
                              The To email address has been reported as harmful email.
                            </p>
                          </div>
                          <div>
                            <p
                              v-if="uploadRespond.cc && uploadRespond.isCcFlagged"
                              class="detail-black detail-red"
                            >
                              CC:
                              {{
                                !uploadRespond.isCcHidden
                                  ? uploadRespond.cc.toString()
                                  : 'hidden by owner'
                              }}
                            </p>
                            <p
                              v-if="uploadRespond && uploadRespond.cc && uploadRespond.isCcFlagged"
                              id="harmful-cc"
                              class="detail-black"
                            >
                              The CC email address has been reported as harmful email.
                            </p>
                          </div>
                          <div>
                            <p
                              v-if="uploadRespond.bcc && uploadRespond.isBccFlagged"
                              class="detail-black detail-red"
                            >
                              CC:
                              {{
                                !uploadRespond.isBccHidden
                                  ? uploadRespond.bcc.toString()
                                  : 'hidden by owner'
                              }}
                            </p>
                            <p
                              v-if="
                                uploadRespond && uploadRespond.bcc && uploadRespond.isBccFlagged
                              "
                              id="harmful-bcc"
                              class="detail-black"
                            >
                              The BCC email address has been reported as harmful email.
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="uploadRespond && uploadRespond.urls && uploadRespond.urls.length"
                          class="detail-parts"
                          id="last-part-detail-links"
                        >
                          <p
                            v-if="uploadRespond.urls.some((a) => !a.isHidden && a.isFlagged)"
                            class="detail-black"
                          >
                            Body
                          </p>
                          <p
                            v-for="(el, ind) of uploadRespond.urls"
                            :key="ind + el.url"
                            v-if="el && !el.isHidden && el.isFlagged"
                            class="detail-black detail-red"
                          >
                            Link: {{ el.url }}
                            <br />
                            <span style="color: #000 !important;"
                              >This link has been reported as a phising link</span
                            >
                          </p>
                        </div>
                        <div id="last-part-preview-footer" class="detail-parts">
                          <div
                            class="preview-footer"
                            v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                          >
                            <h2>Attachments</h2>
                            <div class="attachment-wrapper">
                              <div
                                v-for="(att, ind) of uploadRespond.attachments"
                                :key="ind + att.name"
                                class="attachment red-attach"
                                :id="'attachment-wrapper-' + att.name"
                                :class="[
                                  att.isFlagged ? 'red-attach' : '',
                                  !att.isFlagged ? 'blue-attach' : ''
                                ]"
                              >
                                <div v-if="att.isFlagged" class="attach-icon red-icon">
                                  <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                                </div>
                                <div v-else class="attach-icon blue-icon">
                                  <v-icon color="white" style="font-size: 20px;"
                                    >mdi-paperclip</v-icon
                                  >
                                </div>
                                <div
                                  :id="'name-' + att.name"
                                  v-if="!att.isHidden"
                                  class="file-name max-char"
                                >
                                  {{ att.name }}
                                </div>
                                <div
                                  :id="'hidden-' + att.name"
                                  v-if="att.isHidden"
                                  class="file-name max-char"
                                >
                                  hidden by owner
                                </div>
                                <p
                                  id="harmful-attachment"
                                  v-if="att.isFlagged"
                                  class="detail-black"
                                  style="position: absolute; max-width: 185px; bottom: -38px;"
                                >
                                  <!--The sender email address has been reported as harmful email
                                  sender.-->
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="detail-discovery pb-4">
                          <div
                            :id="'detail-discovery-empty'"
                            v-if="uploadRespond.DiscoveryAndDetection"
                            class="disc-header"
                          >
                            Discovery and Detection
                          </div>
                          <p
                            :id="'detail-discovery'"
                            v-if="uploadRespond.DiscoveryAndDetection"
                            class="discovery-p"
                          >
                            {{ uploadRespond.DiscoveryAndDetection }}
                          </p>
                          <div v-if="uploadRespond.AffectArea" class="disc-header mb-1">
                            Impact Range
                          </div>
                          <div
                            :id="'detail-effect-area'"
                            v-if="uploadRespond.AffectArea"
                            class="impact-row"
                          >
                            <div class="impact-left">Effect area:</div>
                            <div
                              style="width: max-content; padding-right: 13px;"
                              class="impact-right"
                            >
                              {{ uploadRespond.AffectArea.toString() }}
                            </div>
                          </div>
                          <div
                            :id="'detail-scope' + uploadRespond.Scope"
                            v-if="uploadRespond.Scope"
                            class="impact-row"
                          >
                            <div class="impact-left">Scope:</div>
                            <div class="impact-right">{{ uploadRespond.Scope }}</div>
                          </div>
                        </div>
                      </v-tab-item>
                      <v-tab-item>
                        <div class="mail-preview">
                          <div class="preview-header pt-0">
                            <h2
                              style="padding: 0 2px; border-bottom: 1px solid transparent;"
                              v-if="!uploadRespond.isSubjectHidden && !!uploadRespond.subject"
                              :class="{ 'malicious-style': uploadRespond.isSubjectFlagged }"
                            >
                              Subject: {{ uploadRespond.subject }}
                            </h2>
                            <h2
                              style="padding: 0 2px; border-bottom: 1px solid transparent;"
                              v-else-if="uploadRespond.isSubjectHidden && !!uploadRespond.subject"
                              :class="{ 'malicious-style': uploadRespond.isSubjectFlagged }"
                            >
                              Subject: Hidden by owner
                            </h2>
                            <div class="header-info pb-5">
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-if="!uploadRespond.isFromHidden && !!uploadRespond.from"
                                :class="{ 'malicious-style': uploadRespond.isFromFlagged }"
                              >
                                From: {{ uploadRespond.from }}
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-else-if="uploadRespond.isFromHidden && !!uploadRespond.from"
                                :class="{ 'malicious-style': uploadRespond.isFromFlagged }"
                              >
                                From: Hidden by owner
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-if="
                                  !uploadRespond.isToHidden &&
                                  uploadRespond.to &&
                                  !!uploadRespond.to.length
                                "
                                :class="{ 'malicious-style': uploadRespond.isToFlagged }"
                              >
                                To: {{ uploadRespond.to && uploadRespond.to.toString() }}
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-else-if="
                                  uploadRespond.isToHidden &&
                                  uploadRespond.to &&
                                  !!uploadRespond.to.length
                                "
                                :class="{ 'malicious-style': uploadRespond.isToFlagged }"
                              >
                                To: Hidden by owner
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-if="
                                  !uploadRespond.isCcHidden &&
                                  uploadRespond.cc &&
                                  !!uploadRespond.cc.length
                                "
                                :class="{ 'malicious-style': uploadRespond.isCcFlagged }"
                              >
                                CC: {{ uploadRespond.cc && uploadRespond.cc.toString() }}
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-else-if="uploadRespond.isCcHidden && !!uploadRespond.cc.length"
                                :class="{ 'malicious-style': uploadRespond.isCcFlagged }"
                              >
                                CC: Hidden by owner
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-if="
                                  !uploadRespond.isCcHidden &&
                                  uploadRespond.bcc &&
                                  !!uploadRespond.bcc.length
                                "
                                :class="{ 'malicious-style': uploadRespond.isBccFlagged }"
                              >
                                CC: {{ uploadRespond.bcc && uploadRespond.bcc.toString() }}
                              </div>
                              <div
                                style="padding: 0 2px; border-bottom: 1px solid transparent;"
                                v-else-if="uploadRespond.isBccHidden && !!uploadRespond.bcc.length"
                                :class="{ 'malicious-style': uploadRespond.isBccFlagged }"
                              >
                                BCC: Hidden by owner
                              </div>
                              <div>
                                Date: {{ uploadRespond.sentTime }}
                                <br />
                              </div>
                            </div>
                          </div>
                          <div id="last-preview-body-preview" class="preview-body">
                            <k-shadow-frame
                              id="last-preview-body-shadow-root"
                              :content="uploadRespond.body"
                            />
                          </div>
                          <div
                            id="preview-footer-container-att-preview"
                            class="preview-footer"
                            v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                          >
                            <h2>Attachments</h2>
                            <div class="attachment-wrapper">
                              <div
                                v-for="(att, ind) of uploadRespond.attachments"
                                :key="ind + att.id"
                                :id="'attachment-' + att.name"
                                class="attachment red-attach"
                                :class="[
                                  att.isFlagged ? 'red-attach' : '',
                                  !att.isFlagged ? 'blue-attach' : '',
                                  !att.isHidden ? 'clean-attach' : ''
                                ]"
                              >
                                <div v-if="att.isFlagged" class="attach-icon red-icon">
                                  <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                                </div>
                                <div v-else class="attach-icon blue-icon">
                                  <v-icon color="white" style="font-size: 20px;"
                                    >mdi-paperclip</v-icon
                                  >
                                </div>
                                <v-tooltip bottom opacity="1" z-index="9999">
                                  <template v-slot:activator="{ on }">
                                    <div
                                      v-on="on"
                                      v-if="!att.isHidden"
                                      class="file-name max-char pl-2"
                                    >
                                      {{ att.name }}
                                    </div>
                                    <div
                                      v-on="on"
                                      v-if="att.isHidden"
                                      class="file-name max-char pl-2"
                                    >
                                      hidden by owner
                                    </div>
                                  </template>
                                  <span>{{ !att.isHidden ? att.name : 'hidden by owner' }}</span>
                                </v-tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="last-step-preview-buttons" class="preview-buttons">
                          <v-btn id="last-step-useful-btn">
                            <v-icon>mdi-thumb-up</v-icon>
                            Useful 0
                          </v-btn>
                          <v-btn
                            id="last-step-comment-opened"
                            :class="{ 'active-act': commentOpened }"
                          >
                            <!-- @click="commentOpened = !commentOpened" -->
                            <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                            Comments (0)
                          </v-btn>
                        </div>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-card>
        <div id="post-footer-actions" class="footer-actions">
          <v-btn
            id="post-cancel-btn"
            class="cancel-btn"
            text
            color="#f56c6c"
            @click="onCancelClicked"
            >Cancel
          </v-btn>
          <div>
            <v-btn
              v-if="step === 2 || step === 3 || step === 4 || step === 5"
              id="post-previous-btn"
              class="previous-btn mr-4"
              text
              color="#2196f3"
              @click="onPreviousButtonClick(step)"
              >Previous
            </v-btn>
            <v-btn
              v-if="step === 1"
              id="post-next-btn"
              :disabled="!selectedEmail && !uploadRespond.IsActive"
              :class="{ 'disabled-cursor': !selectedEmail && !uploadRespond.IsActive }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onContinue"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 2"
              id="post-step-two-next-btn"
              :class="{ 'disabled-cursor': !stepTwoDisabled() }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onSecondStep"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 3"
              :class="{ 'disabled-cursor': !stepThreeDisabled() }"
              id="post-step-three-next-btn"
              class="create-btn"
              text
              color="#2196f3"
              @click="onThirdStep"
              >Next
            </v-btn>
            <v-btn
              id="post-step-four-next-btn"
              v-if="step === 4"
              :class="{ 'disabled-cursor': allFiltersClosed() }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onBeforeLastStep"
              >Next
            </v-btn>
            <v-btn
              id="post-step-five-next-btn"
              v-if="step === 5"
              class="create-btn"
              text
              color="#2196f3"
              @click="onFinish"
              >Post
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VClamp from 'vue-clamp'
import {
  getSelectedEmailPreview,
  searchNotifiedMail,
  uploadEmlOrMsg,
  listThreatCategories,
  createCommunityPost,
  updateCommunityPost,
  getCommunityPost
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import KShadowFrame from '../KShadowFrame'

Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');

.malicious-style,
.malicious-link {
   color: #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;

  .share-setting-text {
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    text-decoration-style: unset !important;
    border: none !important;
    border-bottom: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
  }
}
[data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[data-title]:after {
     content: attr(data-title);
    position: absolute;
    padding: 8px 16px 8px 16px;
    bottom: -40px;
    left: 0;
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
   color: #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;
}

.malicious-icon {
  margin: 4px;
  font-size: 18px !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
  position: absolute !important;
    top: 2px;
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
 `
})

export default {
  components: {
    VClamp
  },
  props: {
    editItem: {
      type: Object,
      required: false
    },
    updatePost: {
      type: String,
      required: false
    },
    isEditMode: {
      type: Boolean,
      required: false,
      default: false
    },
    communityName: {
      type: String
    },
    refreshData: {
      required: false
    }
  },
  computed: {
    maliciousCount() {
      let count = 0
      if (this.uploadRespond.isFromFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isSubjectFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isToFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isCcFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isBccFlagged) {
        count = count + 1
      }
      count =
        count +
        this.uploadRespond.urls.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      count =
        count +
        this.uploadRespond.attachments.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      return count
    }
  },
  data: () => ({
    fromSettings: false,
    toSettings: false,
    ccSettings: false,
    bccSettings: false,
    subSettings: false,
    currentCompany: null,
    listData: [],
    step: 1,
    search: '',
    searchIncident: '',
    items: [],
    categories: ['Malicious', 'Non-malicious', 'Phishing'],
    model: [],
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    nonce: 1,
    menu: false,
    x: 0,
    warnItem: true,
    selectedEmail: '',
    affectSearch: null,
    emails: [
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      }
    ],
    header: {
      allHeader: true,
      subject: true,
      sender: true,
      receiver: true
    },
    body: {
      allLinks: true,
      phishingLinks: true,
      phishing1: true,
      phishing2: false
    },
    footer: {
      allAttachments: true,
      attachment1: true,
      attachment2: true
    },
    valid: false,
    categoryValid: false,
    validDisc: false,
    validAffect: false,
    validScope: false,
    autocomplete: [(v) => (!!v && /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v)) || ''],
    title: [(v) => !!v || 'Title is required'],
    category: [(v) => (!!v && v.length >= 1) || 'Category is required'],
    titleRule: {
      default: (v) => !!v || 'Title is required',
      required: (v) =>
        (!!v && v.length >= 4 && v.length <= 80) ||
        'Title must be between 4 and 80 characters long',
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
    },
    descRule: {
      default: (v) => !!v || 'Description is required',
      required: (v) => {
        if (!v) return true
        return (v && v.length <= 300) || 'Description should not be more than 300 characters long'
      },
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => {
        if (!v) return true

        return (v && !v.startsWith(' ')) || 'Description cannot start with space'
      }
    },
    explanationRules: {
      default: (v) => !!v || 'Explanation is required',
      required: (v) =>
        (!!v && v.length >= 5 && v.length <= 300) ||
        'Explanation should be between 5 - 300 characters long',
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
    },
    scopeRules: {
      default: (v) => !!v || 'Scope is required',
      required: (v) =>
        (!!v && v.length >= 5 && v.length <= 200) ||
        'Explanation should be between 5 - 200 characters long',
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
    },
    affectRules: {
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    createInc: {
      postId: '',
      title: 'Subject: Subject comes here',
      description: '',
      category: '',
      discovery: '',
      affect: [],
      affectSearch: null,
      scope: '',
      select: ['add-tags-with', 'enter', 'tab', 'paste'],
      items: [],
      search: '',
      createUser: '',
      createCompany: '',
      onPreview: true
    },
    filterOpened: true,
    flagData: {
      subject: false,
      sender: false,
      receiver: false,
      phishing: false,
      link: false,
      attachment: false
    },
    subChevron: false,
    fromChevron: false,
    toChevron: false,
    linkChevron: [],
    attcChevron: [],
    urls: [],
    msgEmlFile: null,
    toggle: false,
    panel: 0,
    expanded: false,
    tab: 1,
    commentOpened: false,
    userComment: '',
    comments: [],
    hoverTool: false,
    seeComments: false,
    date: new Date().toISOString().slice(0, 10),
    uploadRespond: {
      DiscoveryAndDetection: ' '
    },
    shareSettings: {},
    allHeader: false,
    allLinks: false,
    allAttachments: false,
    isAnonym: false
  }),
  watch: {
    searchIncident(val) {
      if (!val) {
        this.listData = this.backupListData
      } else {
        if (this.listData && this.backupListData) {
          this.listData = this.backupListData.reduce((acc, item) => {
            Object.values(item).find((i) => {
              if (typeof i === 'string' && i.toLocaleLowerCase().includes(val.toLocaleLowerCase()))
                return acc.push(item)
            })
            return acc
          }, [])
        }
        this.$forceUpdate()
      }
      this.$forceUpdate()
    }
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
  },
  methods: {
    findCategory(id) {
      switch (id) {
        case 'Ps0SSyl7rVNe':
          return 'Malicious'
        case 'bEuAD1pdbRXF':
          return 'Non-Malicious'
        case 'NGLCc9UCxJvw':
          return 'Phishing'
        default:
          return ''
      }
    },
    urlSwitchChange(url) {
      let els = document
        .getElementById('last-preview-body-shadow-root')
        .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
      if (els && els.length) {
        for (let i = 0, l = els.length; i < l; i++) {
          let el = els[i]
          el.setAttribute('target', '_blank')
          if (url.isHidden) {
            el.innerHTML = 'hidden by owner'
          } else if (!!url && !!url.name) {
            el.innerHTML = url.name
          } else if (!!url && !!url.urlHtml) {
            el.innerHTML = url.urlHtml
          }
          if (url.isFlagged) {
            const el = els[i]
            el.setAttribute('target', '_blank')
            el.setAttribute('data-title', 'This link has been reported as a phishing')
            /*if (!a.IsShow) {
                if (!el.hasChildNodes()) {
                  el.innerHTML = 'hidden by owner'
                } else {
                  el.lastChild.innerHTML = 'hidden by owner'
                }
                el.setAttribute('href', '#')
              }*/
            //if (a) {
            el.classList.add('malicious-style')
            const iEl = document.createElement('i')
            iEl.className +=
              'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
            el.appendChild(iEl)
            // }
          } else {
            const el = els[i]
            el.classList.remove('malicious-style')
          }
        }
      }
      let hiddenEls = document.getElementsByClassName(url.url)
      if (hiddenEls && hiddenEls.length) {
        for (let i = 0, l = hiddenEls.length; i < l; i++) {
          let hiddenEl = hiddenEls[i]
          hiddenEl.setAttribute('target', '_blank')
          if (url.isHidden) {
            hiddenEl.innerHTML = 'hidden by owner'
            hiddenEl.setAttribute('href', '#')
          } else if (!!url && !!url.urlHtml) {
            hiddenEl.innerHTML = url.urlHtml
            hiddenEl.setAttribute('href', url.url)
          }
          if (url.isFlagged) {
            hiddenEl.classList.add('malicious-link')
            let iEl = document.createElement('span')
            iEl.className +=
              'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
            hiddenEl.appendChild(iEl)
          }
        }
      }
    },

    setShadowRootMalicousLink(id) {
      setTimeout(() => {
        this.uploadRespond.urls = this.uploadRespond.urls.map((item) => {
          let urlItem = document
            .getElementById(id)
            .shadowRoot.querySelectorAll('[href="' + item.url + '"]')
          return {
            ...item,
            url: item.url.replace('&amp;', '&'),
            name: item.name,
            urlHtml: !!urlItem.length && urlItem[0].innerHTML ? urlItem[0].innerHTML : null
          }
        })
        for (let url of this.uploadRespond.urls) {
          let els = document
            .getElementById(id)
            .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
          if (els && els.length) {
            for (let i = 0, l = els.length; i < l; i++) {
              let el = els[i]
              el.setAttribute('target', '_blank')
              if (url.isHidden) {
                el.innerHTML = 'hidden by owner'
              } else if (!!url && !!url.name) {
                el.innerHTML = url.name
              } else if (!!url && !!url.urlHtml) {
                el.innerHTML = url.urlHtml
              }
              if (url.isFlagged) {
                const el = els[i]
                el.setAttribute('target', '_blank')
                el.setAttribute('data-title', 'This link has been reported as a phishing')
                /*if (!a.IsShow) {
                    if (!el.hasChildNodes()) {
                      el.innerHTML = 'hidden by owner'
                    } else {
                      el.lastChild.innerHTML = 'hidden by owner'
                    }
                    el.setAttribute('href', '#')
                  }*/
                //if (a) {
                el.classList.add('malicious-style')
                const iEl = document.createElement('i')
                iEl.className +=
                  'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
                el.appendChild(iEl)
                // }
              } else {
                const el = els[i]
                el.classList.remove('malicious-style')
              }
            }
          }
          let hiddenEls = document.getElementsByClassName(url.url)
          if (hiddenEls && hiddenEls.length) {
            for (let i = 0, l = hiddenEls.length; i < l; i++) {
              let hiddenEl = hiddenEls[i]
              hiddenEl.setAttribute('target', '_blank')
              if (url.isHidden) {
                hiddenEl.innerHTML = 'hidden by owner'
                hiddenEl.setAttribute('href', '#')
              } else if (!!url && !!url.name) {
                hiddenEl.innerHTML = url.name
              } else if (!!url && !!url.urlHtml) {
                hiddenEl.innerHTML = url.urlHtml
                hiddenEl.setAttribute('href', url.url)
              }
              if (url.isFlagged) {
                hiddenEl.classList.add('malicious-link')
                let iEl = document.createElement('span')
                iEl.className +=
                  'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
                hiddenEl.appendChild(iEl)
              }
            }
          }
        }
      }, 250)
    },
    allUrlsValChange(val) {
      this.uploadRespond.urls = this.uploadRespond.urls.map((item) => {
        item.isHidden = val
        this.urlSwitchChange(item)
        return { ...item, isHidden: val }
      })
    },
    allAttachmentsValChange(val) {
      this.uploadRespond.attachments = this.uploadRespond.attachments.map((item) => {
        return { ...item, isHidden: val }
      })
    },
    headerValChange(val) {
      this.uploadRespond.isSubjectHidden = val
      this.uploadRespond.isFromHidden = val
      this.uploadRespond.isToHidden = val
      this.uploadRespond.isCcHidden = val
      this.uploadRespond.isBccHidden = val
    },
    checkAllHeaderCheck() {
      this.allHeader =
        (!this.uploadRespond.subject || this.uploadRespond.isSubjectHidden) &&
        (!this.uploadRespond.from || this.uploadRespond.isFromHidden) &&
        (!this.uploadRespond.to.length || this.uploadRespond.isToHidden) &&
        (!this.uploadRespond.cc.length || this.uploadRespond.isCcHidden) &&
        (!this.uploadRespond.bcc.length || this.uploadRespond.isBccHidden)
    },
    subjectValChange(val) {
      this.checkAllHeaderCheck()
    },
    fromValChange(val) {
      this.checkAllHeaderCheck()
    },
    toValChange(val) {
      this.checkAllHeaderCheck()
    },
    ccValChange(val) {
      this.checkAllHeaderCheck()
    },
    bccValChange(val) {
      this.checkAllHeaderCheck()
    },
    getListThreatCategories() {
      listThreatCategories()
        .then((response) => {
          this.categories = response.data.data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting threat categories'
          })
        })
    },
    uploadFile(e) {
      this.msgEmlFile = e.target.files || e.dataTransfer.files
      const extensionName = this.msgEmlFile[0].name.slice(-3)
      if (extensionName != 'msg' && extensionName != 'eml') {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting details of uploaded file'
        })
      } else {
        uploadEmlOrMsg(this.msgEmlFile[0])
          .then((response) => {
            this.selectedEmail = response.data.data.from
            this.uploadRespond = response.data.data
            this.uploadRespond.body = response.data.data.body
            this.setShadowRootMalicousLink('incident-preview-1')
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting details of uploaded file'
            })
          })
      }
    },
    searchNotifiedMail() {
      const payload = {
        pageNumber: 1,
        pageSize: 500000,
        orderBy: 'createDate',
        ascending: false
      }
      searchNotifiedMail(payload).then((response) => {
        const { data } = response
        this.listData = data.data.results
        this.backupListData = JSON.parse(JSON.stringify(data.data.results))
      })
    },
    getSelectedEmailPreview(selectedItem) {
      const _this = this
      if (_this.editItem) {
        getCommunityPost(_this.editItem.communityPostResourceId)
          .then((response) => {
            const { data } = response
            _this.uploadRespond = data.data.communityPostEmail
            if (_this.editItem) {
              _this.uploadRespond.CommunityPostResourceId = _this.editItem.communityPostResourceId
              _this.uploadRespond.Title = _this.editItem.title
              _this.uploadRespond.Description = _this.editItem.description
              _this.uploadRespond.DiscoveryAndDetection = _this.editItem.discoveryAndDetection
              _this.uploadRespond.Scope = _this.editItem.scope
              _this.uploadRespond.CategoryResourceIdArray = _this.editItem.categoryResourceIdArray
              _this.uploadRespond.PostedUserFullName = _this.editItem.postedUserFullName
              _this.uploadRespond.PostedUserCompanyName = _this.editItem.postedUserCompanyName
              _this.uploadRespond.PostedTime = _this.editItem.postedTime
              _this.uploadRespond.LikeCount = _this.editItem.likeCount
              _this.uploadRespond.CommentCount = _this.editItem.commentCount
              _this.uploadRespond.HarmfulItemCount = _this.editItem.harmfulItemCount
              _this.uploadRespond.HasAttachment = _this.editItem.hasAttachment
              _this.uploadRespond.CommunityResourceId = _this.editItem.communityResourceId
              _this.uploadRespond.CommunityName = this.editItem.communityName
            }
            if (!_this.uploadRespond.bcc) _this.uploadRespond.bcc = []
            if (!_this.uploadRespond.cc) _this.uploadRespond.cc = []
            if (!_this.uploadRespond.to) _this.uploadRespond.to = []
            this.setShadowRootMalicousLink('incident-preview-1')
            //this.listData = data.data.results
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting all community list data'
            })
          })
      } else {
        getSelectedEmailPreview(selectedItem.resourceId)
          .then((response) => {
            const { data } = response
            this.uploadRespond = data.data
            // this.setShadowRootMalicousLink('incident-preview-1')
            //this.listData = data.data.results
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting all community list data'
            })
          })
      }
    },
    onCancelClicked() {
      this.$emit('closeIncidentModal')
    },
    stepChange(num) {
      this.step = num
    },
    onContinue() {
      return this.step++
    },
    onSecondStep() {
      if (
        !this.$refs.titleInput.validate() ||
        !this.$refs.descriptionInput.validate() ||
        !this.$refs.categoryInput.validate() ||
        !this.stepTwoDisabled()
      ) {
        this.$refs.titleInput.validate()
        this.$refs.descriptionInput.validate()
        this.$refs.categoryInput.validate()
        return false
      } else {
        this.step++
      }
    },
    onThirdStep() {
      if (
        !this.$refs.affectInput.validate() ||
        !this.$refs.discoveryInput.validate() ||
        !this.stepThreeDisabled()
      ) {
        this.$refs.scopeInput.validate()
        this.$refs.discoveryInput.validate()
        return false
      } else {
        this.step++
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      }
    },
    onBeforeLastStep() {
      this.step++
      this.setShadowRootMalicousLink('last-preview-body-shadow-root')
    },
    onPreviousButtonClick() {
      this.step = this.step - 1
      if (this.step == 4) {
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      } else if (this.step == 1) {
        this.setShadowRootMalicousLink('incident-preview-1')
      }
    },
    onFinish() {
      //CommunityResourceId: this.$route.params.id,

      if (this.editItem) {
        const payload = {
          CommunityResourceId: this.$route.params.id || this.editItem.communityResourceId,
          Title: this.uploadRespond.Title,
          Description: this.uploadRespond.Description,
          CategoryResourceIdArray: this.uploadRespond.CategoryResourceIdArray,
          DiscoveryAndDetection: this.uploadRespond.DiscoveryAndDetection,
          AffectArea: this.uploadRespond.AffectArea,
          Scope: this.uploadRespond.Scope,
          IsAnonymous: this.isAnonym,
          CommunityPostEmail: {
            resourceId: this.uploadRespond.resourceId,
            from: this.uploadRespond.from,
            isFromHidden: this.uploadRespond.isFromHidden,
            isFromFlagged: this.uploadRespond.isFromFlagged,
            subject: this.uploadRespond.subject,
            isSubjectHidden: this.uploadRespond.isSubjectHidden,
            isSubjectFlagged: this.uploadRespond.isSubjectFlagged,
            to: this.uploadRespond.to,
            isToHidden: this.uploadRespond.isToHidden,
            isToFlagged: this.uploadRespond.isToFlagged,
            cc: this.uploadRespond.cc,
            isCcHidden: this.uploadRespond.isCcHidden,
            isCcFlagged: this.uploadRespond.isCcFlagged,
            bcc: this.uploadRespond.bcc,
            isBccHidden: this.uploadRespond.isBccHidden,
            isBccFlagged: this.uploadRespond.isBccFlagged,
            sentTime: this.uploadRespond.sentTime,
            urls: this.uploadRespond.urls,
            attachments: this.uploadRespond.attachments,
            emailTexts: []
          }
        }
        //CommunityResourceId:this.$route.params.id ,
        updateCommunityPost(this.editItem.communityPostResourceId, payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Community has been updated'
            })
            this.onCancelClicked()
            this.$emit('refreshData')
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when updated a community post'
            })
          })
      } else {
        const payload = {
          CommunityResourceId: this.$route.params.id,
          Title: this.uploadRespond.Title,
          Description: this.uploadRespond.Description,
          CategoryResourceIdArray: this.uploadRespond.CategoryResourceIdArray,
          DiscoveryAndDetection: this.uploadRespond.DiscoveryAndDetection,
          AffectArea: this.uploadRespond.AffectArea,
          Scope: this.uploadRespond.Scope,
          IsAnonymous: this.isAnonym,
          EmailPreview: {
            body: this.uploadRespond.body,
            from: this.uploadRespond.from,
            isFromHidden: this.uploadRespond.isFromHidden,
            isFromFlagged: this.uploadRespond.isFromFlagged,
            subject: this.uploadRespond.subject,
            isSubjectHidden: this.uploadRespond.isSubjectHidden,
            isSubjectFlagged: this.uploadRespond.isSubjectFlagged,
            to: this.uploadRespond.to,
            isToHidden: this.uploadRespond.isToHidden,
            isToFlagged: this.uploadRespond.isToFlagged,
            cc: this.uploadRespond.cc,
            isCcHidden: this.uploadRespond.isCcHidden,
            isCcFlagged: this.uploadRespond.isCcFlagged,
            bcc: this.uploadRespond.bcc,
            isBccHidden: this.uploadRespond.isBccHidden,
            isBccFlagged: this.uploadRespond.isBccFlagged,
            sentTime: this.uploadRespond.sentTime,
            urls: this.uploadRespond.urls,
            attachments: this.uploadRespond.attachments,
            emailTexts: []
          }
        }
        createCommunityPost(payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Post has been created'
            })
            this.$emit('closeIncidentModal')
            this.$emit('refreshData')
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when creating a new community post'
            })
          })
      }
    },
    updateTags() {
      /*
          if (this.uploadRespond && this.uploadRespond.AffectArea && this.uploadRespond.AffectArea.length) {
            for (let [ind, tag] of [this.uploadRespond.AffectArea].entries()) {
              if (!this.regexChar(tag[ind])) this.uploadRespond.AffectArea.splice(ind, 1)
            }
          }
          */
      this.$nextTick(() => {
        this.createInc.select.push(...this.createInc.search.split(','))
        this.$nextTick(() => {
          this.search = ''
        })
      })
    },
    updateRightCol() {
      if (this.$router.currentRoute.name !== 'Community') {
        this.$router.push('/community/' + localStorage.getItem('communityName'))
      } else {
        this.$store.dispatch('threadSharing/getCommunityInfo')
        this.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
        const yourPostsObj = {
          compId: localStorage.getItem('companyId'),
          userId: localStorage.getItem('userId')
        }
        this.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
      }
    },
    closePreview() {
      this.selectedEmail = ''
      this.uploadRespond = {}
      this.msgEmlFile = null
      this.shareSettings = {}
    },
    stepTwoDisabled() {
      if (
        this.uploadRespond &&
        this.uploadRespond.Title &&
        this.uploadRespond.Title.length >= 4 &&
        this.uploadRespond.Title.length <= 80 &&
        this.regexChar(this.uploadRespond.Title) &&
        this.uploadRespond.CategoryResourceIdArray &&
        this.uploadRespond.CategoryResourceIdArray &&
        this.uploadRespond.CategoryResourceIdArray.length > 0
      ) {
        return true
      } else {
        return false
      }
    },
    stepThreeDisabled() {
      if (
        this.uploadRespond &&
        this.uploadRespond.DiscoveryAndDetection &&
        this.uploadRespond.DiscoveryAndDetection.length >= 5 &&
        this.uploadRespond.DiscoveryAndDetection.length <= 300 &&
        this.regexChar(this.uploadRespond.DiscoveryAndDetection) &&
        this.uploadRespond.Scope &&
        this.uploadRespond.Scope.length >= 5 &&
        this.uploadRespond.Scope.length <= 200 &&
        this.regexChar(this.uploadRespond.Scope) &&
        this.regexChar(this.uploadRespond.AffectArea)
      ) {
        return true
      } else {
        return false
      }
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    validateAffectArea() {
      const refThis = this
      setTimeout(function () {
        if (refThis.uploadRespond && refThis.uploadRespond.AffectArea) {
          let i = refThis.uploadRespond.AffectArea.length
          while (i--) {
            if (!refThis.regexChar(refThis.uploadRespond.AffectArea[i])) {
              refThis.uploadRespond.AffectArea.splice(i, 1)
            }
          }
        }
      }, 300)
    },
    allFiltersClosed() {
      /*
      if (
        this.shareSettings.subject[0].IsShow === false &&
        this.shareSettings.senderInfo[0].IsShow === false &&
        this.shareSettings.receiverInfo.every((item) => item.IsShow === false) &&
        ((this.shareSettings.attachments.length &&
          this.shareSettings.attachments.every((item) => item.IsShow === false)) ||
          !this.shareSettings.attachments.length) &&
        ((this.shareSettings.links.length &&
          this.shareSettings.links.every((item) => item.IsShow === false)) ||
          !this.shareSettings.links.length)
      ) {
        return true
      } else {
        return false
      }*/
    }
  },
  mounted() {
    if (this.editItem) {
      this.selectedEmail = this.editItem.communityPostResourceId
      //let val = { resourceId: '4pDtxLYSG0mb' }
      let val = { resourceId: this.editItem.communityPostResourceId }
      this.getSelectedEmailPreview(val)
    }
    this.searchNotifiedMail()
    this.getListThreatCategories()
    this.currentCompany = localStorage.getItem('companyName')
    this.currentCommunityName = localStorage.getItem('communityName')
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = 'initial'
  }
}
</script>
<style lang="scss">
.incident-wrapper {
  .incident-container {
    min-height: 100vh;
    width: 100%;

    .incident-inner {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;

      .incident-card {
        width: 100%;
        min-height: 100vh;
        padding: 0 !important;
        padding: 32px 96px !important;
        padding-bottom: 100px !important;
      }

      .incident-steps {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #f5f7fa;
        margin: 25px -96px;
        padding-left: 96px;
        height: 57px;

        .active-step {
          border: solid 1px #409eff !important;
          color: #409eff !important;
        }

        .steps {
          align-items: center;
          display: flex;
          flex-direction: row;
          margin-right: 10px;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.5);

          .step-number {
            align-items: center;
            display: flex;
            justify-content: center;
            border-radius: 50%;
            border: solid 1px #909399;
            width: 24px;
            height: 24px;
            margin-right: 8px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.87);
          }

          .active-step-num {
            border: solid 1px rgba(0, 0, 0, 0.87) !important;
          }

          .active-step-span {
            color: rgba(0, 0, 0, 0.87) !important;
          }

          hr {
            width: 69px;
            height: 1px;
            border: 1px solid #757575;
            margin: 0 10px;
            @media only screen and (max-width: 1025px) {
              width: 32px !important;
              margin: 0 4px;
            }
          }
        }
      }

      .incident-header {
        p {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          margin-bottom: 0 !important;
        }

        span {
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
    }
  }

  .footer-actions {
    align-items: center;
    bottom: 0;
    background-color: #f5f7fa;
    display: flex;
    left: 0;
    position: fixed;
    justify-content: space-between;
    padding: 0 96px;
    height: 68px;
    width: 100%;
    z-index: 9999;

    .cancel-btn {
      background-color: transparent !important;
      border-radius: 18px !important;
      border: solid 1px #f56c6c !important;
      color: #f56c6c !important;
      z-index: 9999;
    }

    .previous-btn {
      border-radius: 18px !important;
      border: solid 1px #2196f3 !important;
      color: #2196f3 !important;
      z-index: 9999;
    }

    .create-btn {
      border-radius: 18px !important;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      z-index: 9999;
    }
  }

  .v-text-field--outlined.error--text fieldset {
    border: 1px solid #ff5252 !important;
  }

  .v-text-field--outlined.errored-selectbox fieldset {
    border: 1px solid #ff5252 !important;
  }

  .v-autocomplete.affect-combobox .v-input__slot {
    height: auto !important;
  }

  .v-autocomplete.affect-combobox {
    .v-messages__message {
      color: #f56c6c !important;
    }
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #000;
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .edit-name-textfield,
  .edit-description,
  .edit-select {
    font-size: 13px !important;
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .incident-header {
    p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 0 !important;
    }

    span {
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

  .incident-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 24px;

    .input-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }

    .input-sec-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }

    .input-sub {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 10px;
    }

    .input-select {
      max-width: 205px;
      color: rgba(0, 0, 0, 0.72);
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px !important;
      margin-bottom: 32px;
    }

    .first-select {
      max-width: 554px;
    }

    .input-select > .v-input__control {
      max-width: 554px !important;
      align-items: center;
      display: flex;
      height: 40px !important;
    }

    .date-row {
      max-width: 390px !important;
    }
  }

  .v-input {
    .v-input__slot {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.72);
      border-radius: 8px !important;
    }
  }

  .v-text-field {
    .v-input__slot {
      box-shadow: unset !important;
    }
  }

  .v-select {
    .v-input__slot {
      box-shadow: unset !important;
      height: 40px !important;
    }
  }

  .v-autocomplete {
    .v-input__slot {
      border: 1px solid rgba(0, 0, 0, 0.16) !important;
      box-shadow: unset !important;
      height: 40px !important;
    }
  }

  .upload-wrapper {
    max-width: 109px;
    margin-top: -2px;
    border: unset !important;
    position: relative;

    .up-btn {
      align-items: center;
      border-radius: 18px !important;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      text-transform: none !important;
      padding: 0 !important;
      display: flex !important;
      justify-content: center !important;
      max-height: 36px !important;
      width: 100%;

      .v-input__prepend-outer {
        display: none !important;
      }

      .v-input__control {
        cursor: pointer !important;

        .v-input__prepend-inner {
          margin-left: 8px !important;
          margin-right: 0 !important;
          margin-top: 7px;

          i {
            color: #fff !important;
          }
        }

        .v-btn__content {
          margin-left: -5px !important;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.71;
          letter-spacing: normal;
        }

        .v-input__slot {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0 !important;
          cursor: pointer !important;

          .v-text-field__slot {
            flex: unset !important;
            position: absolute;
            width: 100%;
            text-align: left;
            z-index: 13;
          }

          .v-file-input__text {
            color: #fff !important;
            display: block !important;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-left: 42px;
            padding-top: 8px;
            height: 35px;
            width: 100%;
            border-radius: 20px;
          }

          .v-input__icon {
            min-width: 15px !important;
            width: 16px !important;
            position: absolute;
            left: 23px;
            z-index: 12;
          }
        }

        .v-input__slot::before,
        .v-input__slot::after {
          display: none !important;
        }

        i {
          font-size: 18px !important;
          margin-top: -22px !important;
          padding-right: 10px !important;
        }

        .v-text-field__details {
          position: absolute;
          bottom: -17px;
        }
      }
    }

    .v-input__append-inner {
      display: none !important;
    }
  }

  .step-container {
    max-width: 554px;
  }

  .investigate-header {
    p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 0 !important;
    }

    span {
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

  .investigation-content {
    border-radius: 12px !important;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .mail-preview {
      width: 100%;
      max-width: 600px;
      position: relative;
    }

    .investigation-filters {
      width: 300px;
      background-color: white;
      box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
        0 3px 1px -2px rgba(80, 80, 80, 0.12);
      align-items: center;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      margin-left: 32px;
      transition: all 0.3s ease-in-out;
      position: relative;

      @media only screen and (max-width: 1025px) {
        position: absolute;
        top: 170px;
        right: 0;
        z-index: 99999;
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
          0 1px 1px -1px rgba(204, 204, 204, 0.12);
        border: solid 1px #2196f3;
      }

      .filter-part {
        border-bottom: 1px solid #b3d4fc;
        display: flex;
        flex-direction: column;
        padding-top: 24px;
        padding-bottom: 30px;
        width: 240px;
        max-height: 300px;
        overflow-y: auto;
        transition: all 0.3s ease-in-out;

        @supports (overflow: -webkit-marquee) and (justify-content: inherit) {
          overflow: scroll;
          -webkit-overflow-scrolling: touch;
        }

        .v-input--selection-controls.v-input {
          margin-top: 10px !important;
        }

        .select-header {
          transition: all 0.3s ease-in-out;
        }

        .switch-row {
          align-items: center;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;

          .img-wrapper {
            align-items: center;
            display: flex;
            min-width: 40px;
            max-width: 40px;

            img {
              padding-top: 25%;
              padding-right: 8px;
            }
          }

          label {
            margin-top: 10px;
            margin-left: 5px;
            max-width: 170px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
          height: 25px !important;
          min-height: 25px !important;
          margin-bottom: 0 !important;
          max-width: 210px;

          label {
            height: 24px !important;
            margin-left: 8px !important;
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

        .accent--text {
          color: #2196f3 !important;
        }

        .theme--light.v-messages {
          display: none !important;
        }
      }

      .filter-part:last-child {
        border-bottom: unset !important;
      }

      .filter-part:nth-child(2) {
        height: auto;
        max-height: 300px;
        overflow: auto;
      }

      .filter-part:first-child {
        padding-top: 14.2px !important;
      }

      .attr-error {
        position: absolute;
        bottom: -20px;
        right: 0;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 9px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #d0021b;
      }
    }
  }

  .filters-content {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    .input-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }

    .input-sub {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .input-select {
      max-width: 205px;
      color: rgba(0, 0, 0, 0.72);
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px !important;
      margin-bottom: 32px;
    }

    .first-select {
      max-width: 554px;
    }

    .input-select > .v-input__control {
      max-width: 554px !important;
      align-items: center;
      display: flex;
      height: 40px !important;
    }

    .date-row {
      max-width: 390px !important;
    }
  }

  .underlined-warn {
    border-bottom: 1px solid #f56c6c;
    color: inherit;

    .icon {
      color: #f56c6c !important;
      font-size: 24px !important;
      text-decoration: none !important;
      margin-left: 20px;
      margin-bottom: 7px;
    }
  }

  .post-wrapper {
    max-width: 696px;
  }

  .select-error {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #d0021b;
    margin-left: 8px;
    margin-top: 17px;
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #000;
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .edit-name-textfield,
  .edit-description,
  .edit-select {
    font-size: 13px !important;
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .preview-header {
    margin-top: 24px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
      width: 100%;
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-height: 80px;
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
      padding-bottom: 43px;
      border-bottom: 1px solid #b3d4fc;
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
    border-bottom: 1px solid #b3d4fc;
    position: relative;
    padding-bottom: 24px;
    min-height: auto;
    max-height: 500px;
    overflow: auto;

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
    }

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

    a {
      display: block !important;
      min-width: max-content !important;
    }
  }

  .bodyExpanded {
    height: 100% !important;
    max-height: 100% !important;
    padding-bottom: 56px;
  }

  .preview-footer {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    padding-bottom: 24px;
    overflow: auto;
    max-width: 100%;
    height: auto;

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
    }

    .attachment-wrapper {
      display: flex;
      flex-direction: row;

      .attachment {
        width: 182px;
        height: 32px;
        align-items: center;
        display: flex;
        flex-direction: row;
        margin-right: 16px;
        border: 1px solid transparent;

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

        .file-name {
          width: 142px;
          text-align: left;
          display: block;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.58;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          padding-left: 7px;
        }
      }

      .red-attach {
        border: 1px solid #bb2a45;
      }

      .blue-attach {
        border: 1px solid #2196f3;
      }
    }
  }

  .unselected-warn {
    border-bottom: 1px solid #bb2a45;
    color: #bb2a45;
    padding: 0 2px !important;
  }

  .v-autocomplete {
    .v-input__slot {
      box-shadow: unset !important;
      border: 1px solid rgba(0, 0, 0, 0.24) !important;
    }
  }

  .v-text-field.v-text-field--enclosed .v-input__append-inner {
    margin-top: 0 !important;
    display: flex;
    align-items: center;
  }

  .first-date {
    .v-input__slot {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-right: none !important;

      label {
        padding-left: 65px !important;
      }
    }
  }

  .sec-date {
    .v-input__slot {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border-left: none !important;

      label {
        padding-left: 60px !important;
      }
    }
  }

  .date-picker {
    font-family: 'Open Sans', sans-serif !important;

    .v-input__slot {
      box-shadow: unset !important;
      border: 1px solid rgba(0, 0, 0, 0.24);
      border-radius: 4px;
      text-align: center;

      input {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.54);
        padding-left: 50px !important;
        padding-top: 8px !important;
      }

      label {
        padding-top: 0 !important;
      }
    }

    .v-input__slot::after,
    .v-input__slot::before {
      display: none;
    }
  }

  .date-col {
    position: relative;
  }

  .date-icon {
    top: 12px;
    left: 25px;
    position: absolute;
    font-size: 18px !important;
    z-index: 99;
  }

  .date-to {
    position: absolute;
    left: 0;
    top: 11px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    z-index: 13;
  }

  .max-char {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    max-width: 100%;
  }

  .v-input > .v-input__control > .v-text-field__details {
    // error messages.
  }

  .v-application input {
    border-radius: 8px !important;
    border: solid 1px rgba(0, 0, 0, 0.16) !important;
  }

  .required {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 9px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #474747;
    margin-left: 6px;
    margin-top: -2px;
  }

  .close-incident {
    position: absolute;
    right: -13px;
    top: 13px;
  }

  .affect-input.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
    border: none !important;
  }

  .row-with-icon {
    align-items: center;
    display: flex;
    flex-direction: row;
  }

  .icon-btn {
    margin-top: unset;
    margin-left: -5px;
    height: 25px !important;
    width: 25px !important;
  }

  .step-name {
    width: max-content;
  }

  .filter-header {
    align-items: center;
    display: none;
    justify-content: space-between;
    padding-top: 24px;
    width: 240px;
    transition: all 0.3s ease-in-out;

    .select-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      transition: all 0.3s ease-in-out;
    }

    i {
      margin-top: 3px;
      font-size: 27px;
    }
  }

  .minify-filter {
    width: 120px !important;
  }

  .minify-part,
  .minify-switch {
    padding-left: 10px;
    width: 100% !important;
  }

  // Email Preview css
  .preview-header {
    margin-top: 24px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
      width: 100%;
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-height: 80px;
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
    border-bottom: 1px solid #b3d4fc;
    position: relative;
    padding-bottom: 24px;
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

  .preview-footer {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    position: relative;

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
    }

    .attachment-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      max-width: 100%;

      .attachment {
        width: 182px;
        height: 32px;
        align-items: center;
        display: flex;
        flex-direction: row;
        margin-right: 16px;
        margin-bottom: 8px;

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
    }
  }

  .preview-buttons {
    margin-top: 24px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;

    .v-btn {
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
    .v-slide-group__content {
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

        .v-input__slot {
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
        margin-top: 5px;

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
    // post incident (0) min-height: 226px;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
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
      padding-left: 16px !important;
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

  .v-btn--contained {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
  }

  .v-data-footer {
    margin-top: 24px !important;
  }

  .v-data-footer__select {
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

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
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

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .v-window {
    border-radius: 20px !important;
    margin: 0 24px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .title-field {
    .v-text-field__details {
      margin-bottom: 0 !important;
    }
  }

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 8px;
  }

  .disabled-cursor,
  button:disabled {
    cursor: no-drop !important;
    pointer-events: all !important;
  }

  .file-name {
    padding-left: 7px;
  }

  #upload-file-input {
    opacity: 0;
    position: absolute;
  }

  input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
    /* chromes and blink button */
    cursor: pointer !important;
  }

  @media only screen and (max-width: 1025px) {
    .hide-step {
      display: none !important;
    }
    .filter-header {
      display: flex;
    }
  }

  .display-none {
    display: none !important;
  }

  #share-settings-links {
    display: block;
  }

  .chevron-down {
    transition: 0.3s all ease-in-out;
    transform: rotate(180deg);

    i {
      text-decoration: none !important;
    }
  }

  .v-btn--icon.v-size--default.chevron-btn-menu {
    height: 30px !important;
    width: 30px !important;
    margin-top: 10px;

    i {
      height: 30px !important;
      width: 30px !important;
    }
  }

  .is-anonym-check {
    height: 28px !important;
    margin-bottom: 24px;
    margin-top: 0 !important;

    label {
      height: 26px !important;
    }
  }

  .malicious-icon {
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

  .malicious-style {
    .red-malicious-alert:not(:first-child) {
      display: none !important;
    }
  }

  .filter-no-selected {
    position: absolute;
    bottom: -20px;
    right: 20px;
    color: #d0021b;
    font-family: 'Open Sans', sans-serif;
    font-size: 9px;
  }
}

.select-row-wrap {
  display: flex;
  width: 100%;
  padding: 0 2px;

  .email-name {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    display: block;
    width: 220px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .email-icon {
    font-size: 19px !important;
    padding-right: 24px;
  }

  .email-type {
    height: 25px;
    border-radius: 4px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 6px;
    min-width: 100px;
    margin-right: 15px;
  }

  .btn-pending {
    background-color: #00bcd4;
  }

  .btn-active {
    background-color: #2196f3;
  }

  .btn-inactive {
    background-color: #757575;
  }

  .btn-warning {
    background-color: #e6a23c;
  }

  .btn-cancelled {
    background-color: #f56c6c;
  }

  .email-time {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .select-row-inline {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;

    .file-type-wrap {
      display: flex;
      justify-content: space-between;
    }
  }
}
.malicious-style,
.malicious-link {
  .share-setting-text {
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    text-decoration-style: unset !important;
    border: none !important;
    border-bottom: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
  }
}

.text-selected {
  border-radius: 1px !important;
  background-color: #d1e9fc !important;
  border-bottom: 1px solid #2196f3 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  width: max-content;
  max-width: 100%;
}

.clean-link {
  padding: 0 2px !important;
  border-radius: 1px !important;
  border-bottom: 1px solid #2196f3 !important;
  color: #2196f3 !important;
}

.selected-link {
  background-color: #d1e9fc !important;
}

.phishing-link {
  background-color: #f3e1e5 !important;
  border-bottom: 1px solid #bb2a45 !important;
  color: #bb2a45 !important;
  width: max-content;
}

.clean-attach {
  background-color: #f1f8fe;
  border: 1px solid transparent !important;
}

.malicious-attach {
  background-color: #f3e1e5;
  border: 1px solid transparent !important;
}

.mal-list-wrapper {
  .mal-list-row {
    align-items: center;
    display: flex;
    flex-direction: row;

    .mal-icon-wrapper {
      height: 35px;
      width: 35px;
      padding-top: 5px;
    }
  }
}

.mal-list-wrapper:hover,
.mal-list-wrapper:active,
.mal-list-wrapper:focus {
  background-color: #f2f2f2;
  transition: all 0.2s ease-in-out;
}

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
</style>
