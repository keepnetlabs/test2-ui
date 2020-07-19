<template>
  <v-card class="pop-up-card pt-4 pl-6 pr-6" light min-height="300">
    <v-btn
      v-if="$route.path == '/threat-sharing'"
      class="create-com-btn"
      @click="createNewCommunity"
      block
      rounded
      id="create-community-btn"
      >CREATE COMMUNITY
    </v-btn>
    <v-btn
      v-if="$route.name == 'Community'"
      class="create-com-btn"
      @click="postIncident"
      block
      rounded
      id="post-inc-btn"
      >POST INCIDENT
    </v-btn>
    <v-btn
      v-else-if="false"
      class="create-com-btn"
      @click="joinCommunity()"
      block
      rounded
      id="join-community-btn"
      >JOIN
    </v-btn>
    <div class="right-side-content wrapper pt-8 pb-4">
      <div v-if="$route.name == 'Community'">
        <div class="about-community right-side-title">
          About Community
          <v-menu content-class="right-col-commun-settings" offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-cog</v-icon>
            </template>
            <div class="notification-wrapper">
              <v-list dense flat>
                <v-list-item-group v-if="isOwnerOfTheCommunity()" color="primary">
                  <v-list-item id="right-col-edit-commun" @click="editCommunity()">
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit Community</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group color="primary">
                  <v-list-item id="right-col-notification-settings" @click="openNotifications()">
                    <v-list-item-icon>
                      <v-icon>mdi-bell</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Notification Settings</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group color="primary">
                  <v-list-item id="right-col-leave-commun" @click="leaveCommunity()">
                    <v-list-item-icon>
                      <v-icon>mdi-exit-to-app</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Leave</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group v-if="isOwnerOfTheCommunity()" color="primary">
                  <v-list-item id="right-col-delete-commun" @click="deleteCommunity()">
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-menu>
        </div>
        <div class="right-side-post-container pt-2 pb-9">
          <span class="about-community-statement">{{ communityDetails.description }}</span>
          <v-row>
            <v-col cols="12" sm="6" class="about-community-table-td pb-0">
              <span class="right-col-semibold-label">Owner</span>
            </v-col>
            <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
              {{ communityDetails.ownerCompanyName }}
            </v-col>
          </v-row>
          <div class="about-community-table pt-8">
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Members</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
                {{ communityDetails.memberCount }}
                <a
                  v-if="ownerDetails && ownerDetails.membershipStatusId === 1"
                  href="#"
                  class="pl-4"
                  @click="isWantToAddMembers()"
                  >+Invite</a
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Industry</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
                {{ communityDetails.industryName }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Total Incidents</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0"
                >{{ communityDetails.incidentCount }}
              </v-col>
            </v-row>
            <v-row v-if="false">
              <!-- Made by Burak Turan Ülker -->
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">You investigated</v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">21</v-col>
            </v-row>
            <v-row v-if="false">
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">Eliminated</v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">48 threats</v-col>
            </v-row>
          </div>
        </div>
      </div>
      <div v-if="$route.name !== 'Community'" class="right-side-title pt-1">Your Posts</div>
      <div
        class="pb-4"
        v-if="$route.name !== 'Community' && yourPosts.Data && yourPosts.Data.length > 0"
      >
        <div v-for="(post, ind) of yourPosts.Data" :key="ind + Math.floor(Math.random() * 10000)">
          <div class="pt-2">
            <div class="right-side-sub-title pb-1">
              <a href="#">{{ post.Title }}</a>
            </div>
            <div class="right-side-desc pb-1">
              by
              <a href="#">{{ post.CompanyName }}</a>
            </div>
            <div class="right-side-like-comment-wrapper">
              <div class="right-side-like">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span class="like-count">{{ post.LikeCount }}</span>
              </div>
              <div class="right-side-message pl-2">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-btn>
                <span class="comment-count">{{ post.CommentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-side-title pt-4">Top Posts from your communities</div>
      <div v-if="topPosts.Data && topPosts.Data.length">
        <div v-for="(post, ind) of topPosts.Data" :key="ind + Math.floor(Math.random() * 10000)">
          <div class="right-side-post-container pt-2">
            <div class="right-side-sub-title pb-1">
              <a href="#">{{ post.Title }}</a>
            </div>
            <div class="right-side-desc pb-1">
              by
              <a href="#">{{ post.CompanyName }}</a>
            </div>
            <div class="right-side-like-comment-wrapper">
              <div class="right-side-like">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span class="like-count">{{ post.LikeCount }}</span>
              </div>
              <div class="right-side-message pl-2">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-btn>
                <span class="comment-count">{{ post.CommentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-posts pt-1">
        No incident has been posted in your communities, yet
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { getCommunityDetails } from '../../api/threadSharing'

export default {
  data() {
    return {
      communityDetails: {},
      ownerDetails: null,
      yourPosts: {
        Data: [
          {
            CommunityPostId: '28636006-8bca-4841-9264-458ac5c1f723',
            CommunityId: '14d05964-3bb1-4e4f-b332-dd80d33d1eff',
            CompanyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
            CompanyName: 'Keepnet Labs',
            Title: 'IncidentTitle--qvcDeKGatC',
            Description: 'IncidentDescription--qvcDeKGatC',
            AttachmentStream: null,
            AttachmentPath: 'C:\\Attachments\\Temp\\6fdc03ac-a215-4c38-9ab1-6db1649a4c9e.eml',
            DiscoveryAndDetection: 'IncidentDiscoverqvcDeKGatC',
            AffectArea: null,
            Scope: 'IncidentScopeqvcDeKGatC',
            CounterMeasures: null,
            IsActive: true,
            CreateDate: '2020-05-20T20:43:19.173',
            ModifyDate: null,
            CreateUserId: 'e960d8c1-ede4-4b50-a5bc-afd2ac848712',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 3,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 3,
            HiddenLinkCount: 0,
            ShownLinkCount: 3,
            AttachmentCount: 1,
            MaliciousAttachmentCount: 1,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 1,
            IsAnonymous: false,
            HarmfulItems: 3,
            IsPreview: true,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: '2e540f19-e035-4de6-90ce-585c73493bc8',
            CommunityId: '1476360d-860d-4015-ae81-a11925f2716e',
            CompanyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
            CompanyName: 'Anonymous',
            Title: 'Anonim Test Muss 1',
            Description: 'Anonim Test Muss 1',
            AttachmentStream: null,
            AttachmentPath:
              'C:\\Users\\Public\\Keepnetlabs\\Api\\e7102163-c63c-40a2-b832-423d82e2f890\\e7102163-c63c-40a2-b832-423d82e2f890.msg',
            DiscoveryAndDetection: 'Anonim Test Muss 1',
            AffectArea: null,
            Scope: 'Anonim Test Muss 1',
            CounterMeasures: null,
            IsActive: true,
            CreateDate: '2020-05-20T17:16:13.397',
            ModifyDate: null,
            CreateUserId: 'e960d8c1-ede4-4b50-a5bc-afd2ac848712',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 4,
            LinkCount: 12,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 12,
            HiddenLinkCount: 0,
            ShownLinkCount: 12,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: true,
            HarmfulItems: 2,
            IsPreview: true,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: '6faca0be-a90c-4215-b4e9-706aa82302af',
            CommunityId: 'd21df83e-c8fc-4df4-961a-364785ce61f2',
            CompanyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
            CompanyName: 'Keepnet Labs',
            Title: 'Facebook Scam',
            Description: 'Facebook Scam',
            AttachmentStream: null,
            AttachmentPath:
              'C:\\Users\\Public\\Keepnetlabs\\Api\\e7102163-c63c-40a2-b832-423d82e2f890\\e7102163-c63c-40a2-b832-423d82e2f890.msg',
            DiscoveryAndDetection: 'asdasda asdasda',
            AffectArea: 'enduser, computer',
            Scope: 'adasdaadadad',
            CounterMeasures: null,
            IsActive: true,
            CreateDate: '2020-06-10T16:06:48.987',
            ModifyDate: null,
            CreateUserId: 'e960d8c1-ede4-4b50-a5bc-afd2ac848712',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 0,
            LinkCount: 12,
            MaliciousLinkCount: 1,
            UnMaliciousLinkCount: 11,
            HiddenLinkCount: 2,
            ShownLinkCount: 10,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 2,
            IsPreview: true,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: '9160a7af-9529-4d37-a009-7679ab0bc299',
            CommunityId: '3c7ad830-3c6e-48cc-8478-a0441a917b51',
            CompanyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
            CompanyName: 'Keepnet Labs',
            Title: 'Preview Bugs',
            Description: 'Preview Bugs',
            AttachmentStream: null,
            AttachmentPath:
              'C:\\Users\\Public\\Keepnetlabs\\Api\\e7102163-c63c-40a2-b832-423d82e2f890\\e7102163-c63c-40a2-b832-423d82e2f890.msg',
            DiscoveryAndDetection: 'Preview Bugs',
            AffectArea: null,
            Scope: 'Preview Bugs',
            CounterMeasures: null,
            IsActive: true,
            CreateDate: '2020-05-13T12:08:37.11',
            ModifyDate: null,
            CreateUserId: 'e960d8c1-ede4-4b50-a5bc-afd2ac848712',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 12,
            MaliciousLinkCount: 2,
            UnMaliciousLinkCount: 10,
            HiddenLinkCount: 0,
            ShownLinkCount: 12,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 4,
            IsPreview: true,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: '6b2d89a8-54ed-470d-8d82-800d6c87401f',
            CommunityId: '1476360d-860d-4015-ae81-a11925f2716e',
            CompanyId: 'f4a5cd1b-6eb2-4be8-80e1-f70f266f4da5',
            CompanyName: 'Keepnet Labs',
            Title: 'ffsafdffadf',
            Description: 'fafdadfdfadf',
            AttachmentStream: null,
            AttachmentPath: 'C:\\Attachments\\Temp\\86a5f75e-0acc-4c63-86e1-182b8a4b653c.eml',
            DiscoveryAndDetection: 'dfasdf',
            AffectArea: 'dfadfa',
            Scope: 'fafadfasd',
            CounterMeasures: null,
            IsActive: true,
            CreateDate: '2020-05-16T00:12:47.48',
            ModifyDate: null,
            CreateUserId: 'e960d8c1-ede4-4b50-a5bc-afd2ac848712',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 3,
            MaliciousLinkCount: 1,
            UnMaliciousLinkCount: 2,
            HiddenLinkCount: 0,
            ShownLinkCount: 3,
            AttachmentCount: 1,
            MaliciousAttachmentCount: 1,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 1,
            IsAnonymous: false,
            HarmfulItems: 4,
            IsPreview: true,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          }
        ],
        IsSuccess: true,
        ResultType: 1,
        Message: ''
      },
      topPosts: {
        Data: [
          {
            CommunityPostId: '9b9b578e-dffe-4fff-a57c-fe7d44cfb995',
            CommunityId: '00000000-0000-0000-0000-000000000000',
            CompanyId: '00000000-0000-0000-0000-000000000000',
            CompanyName: 'Anonymous',
            Title: 'Anonymious Test',
            Description: null,
            AttachmentStream: null,
            AttachmentPath: null,
            DiscoveryAndDetection: null,
            AffectArea: null,
            Scope: null,
            CounterMeasures: null,
            IsActive: false,
            CreateDate: '0001-01-01T00:00:00',
            ModifyDate: null,
            CreateUserId: '00000000-0000-0000-0000-000000000000',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 2,
            CommentCount: 3,
            LinkCount: 0,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 0,
            HiddenLinkCount: 0,
            ShownLinkCount: 0,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 0,
            IsPreview: false,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: 'cf519747-7b6e-4060-a170-fe7f1f82d992',
            CommunityId: '00000000-0000-0000-0000-000000000000',
            CompanyId: '00000000-0000-0000-0000-000000000000',
            CompanyName: 'Keepnet Labs',
            Title: 'asdasda',
            Description: null,
            AttachmentStream: null,
            AttachmentPath: null,
            DiscoveryAndDetection: null,
            AffectArea: null,
            Scope: null,
            CounterMeasures: null,
            IsActive: false,
            CreateDate: '0001-01-01T00:00:00',
            ModifyDate: null,
            CreateUserId: '00000000-0000-0000-0000-000000000000',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 0,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 0,
            HiddenLinkCount: 0,
            ShownLinkCount: 0,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 0,
            IsPreview: false,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: 'a529f67d-4ec5-438c-8f08-9d87eb3d4f35',
            CommunityId: '00000000-0000-0000-0000-000000000000',
            CompanyId: '00000000-0000-0000-0000-000000000000',
            CompanyName: 'Keepnet Labs',
            Title: 'Popup Deneme',
            Description: null,
            AttachmentStream: null,
            AttachmentPath: null,
            DiscoveryAndDetection: null,
            AffectArea: null,
            Scope: null,
            CounterMeasures: null,
            IsActive: false,
            CreateDate: '0001-01-01T00:00:00',
            ModifyDate: null,
            CreateUserId: '00000000-0000-0000-0000-000000000000',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 0,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 0,
            HiddenLinkCount: 0,
            ShownLinkCount: 0,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 0,
            IsPreview: false,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: '871a293c-8fa5-4e17-87cf-fdd68047669a',
            CommunityId: '00000000-0000-0000-0000-000000000000',
            CompanyId: '00000000-0000-0000-0000-000000000000',
            CompanyName: 'Okan CM',
            Title: 'asdadsdasd',
            Description: null,
            AttachmentStream: null,
            AttachmentPath: null,
            DiscoveryAndDetection: null,
            AffectArea: null,
            Scope: null,
            CounterMeasures: null,
            IsActive: false,
            CreateDate: '0001-01-01T00:00:00',
            ModifyDate: null,
            CreateUserId: '00000000-0000-0000-0000-000000000000',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 0,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 0,
            HiddenLinkCount: 0,
            ShownLinkCount: 0,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 0,
            IsPreview: false,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          },
          {
            CommunityPostId: 'e6334b82-7752-45cd-bb57-a3a991504ae4',
            CommunityId: '00000000-0000-0000-0000-000000000000',
            CompanyId: '00000000-0000-0000-0000-000000000000',
            CompanyName: 'Keepnet Labs',
            Title: 'asaasas',
            Description: null,
            AttachmentStream: null,
            AttachmentPath: null,
            DiscoveryAndDetection: null,
            AffectArea: null,
            Scope: null,
            CounterMeasures: null,
            IsActive: false,
            CreateDate: '0001-01-01T00:00:00',
            ModifyDate: null,
            CreateUserId: '00000000-0000-0000-0000-000000000000',
            CreateUserName: null,
            ModifyUserId: null,
            CommunityName: null,
            LikeCount: 1,
            CommentCount: 1,
            LinkCount: 0,
            MaliciousLinkCount: 0,
            UnMaliciousLinkCount: 0,
            HiddenLinkCount: 0,
            ShownLinkCount: 0,
            AttachmentCount: 0,
            MaliciousAttachmentCount: 0,
            UnMaliciousAttachmentCount: 0,
            HiddenAttachmentCount: 0,
            ShownAttachmentCount: 0,
            IsAnonymous: false,
            HarmfulItems: 0,
            IsPreview: false,
            UserLiked: false,
            CommunityPostEmails: null,
            CommunityPostComments: null,
            CommunityPostCategory: null
          }
        ],
        IsSuccess: true,
        ResultType: 1,
        Message: ''
      }
    }
  },
  props: {
    pageView: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created() {
    this.getCommunityDetails()
  },
  computed: {
    ...mapGetters({
      suggestedCommunities: 'threadSharing/suggestedCommunGetter',
      myCommunities: 'threadSharing/myCommunitiesGetter',
      communityGetter: 'threadSharing/communityGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      getSelectedCompany: 'dashboard/getSelectedCompany',
      userGetter: 'auth/userGetter',
      requests: 'threadSharing/requestsGetter'
    }),
    ...mapState({
      companyInformation: (state) => state.dashboard.companyInformation
    }),
    communityDescription() {
      return this.selectedCommunity.description || localStorage.getItem('communityDesc')
    },
    communityIndustry() {
      return this.selectedCommunity.industry || localStorage.getItem('communityCat')
    }
  },
  methods: {
    getCommunityDetails() {
      if (this.$route.name == 'Community') {
        this.ownerDetails = this.$route.params.item
        getCommunityDetails(this.$route.params.id).then((response) => {
          this.communityDetails = response.data.data
        })
      }
    },
    closeCommunityInfo() {
      // this.$emit('closeCommunity')
    },
    createNewCommunity() {
      this.$emit('createCommunityAction')
      this.closeCommunityInfo()
    },
    isWantToAddMembers() {
      this.$emit('addMembers')
      this.closeCommunityInfo()
    },
    editCommunity() {
      this.$emit('editCommunity')
      this.closeCommunityInfo()
    },
    postIncident() {
      this.$emit('postIncident')
      this.closeCommunityInfo()
    },
    joinCommunity(communityId, creatorId, name, isPrivate) {
      if (!communityId && !creatorId) {
        this.$store
          .dispatch('threadSharing/joinCommunity', {
            CommunityId: localStorage.getItem('communityId'),
            CreatorId: localStorage.getItem('creatorId')
          })
          .then(() => {
            this.refreshCommunities()
            this.refreshRequests()
          })
      } else {
        this.$store
          .dispatch('threadSharing/joinCommunity', {
            CommunityId: communityId,
            CreatorId: creatorId,
            Name: name,
            IsPrivate: isPrivate
          })
          .then(() => {
            this.refreshCommunities()
            this.refreshRequests()
          })
      }
    },
    isOwnerOfTheCommunity() {},
    openNotifications() {
      this.$emit('openNotifications')
      this.$store.dispatch('threadSharing/getNotifications', localStorage.getItem('communityId'))
      this.closeCommunityInfo()
    },
    isJoined(id) {
      if (id && id != null && this.myCommunities && this.myCommunities.length) {
        return this.myCommunities.some((cId) => cId.CommunityId == id)
      }
    },
    leaveCommunity() {
      this.$emit('leaveCommunity')
      this.closeCommunityInfo()
    },
    deleteCommunity() {
      this.$emit('deleteCommunity')
      this.closeCommunityInfo()
    },
    isRequestSent(communId) {
      return this.requests.some((cId) => cId.CommunityId == communId)
    },
    refreshCommunities() {
      this.$store.dispatch('threadSharing/getCommunities')
    },
    refreshRequests() {
      this.$store.dispatch('threadSharing/getRequestsCompany', localStorage.getItem('companyId'))
    }
  }
}
</script>
<style lang="scss" scoped>
.notification-wrapper {
  padding: 0 !important;
  width: 100%;
  box-shadow: 0 8px 10px -3px rgba(255, 255, 255, 0.14), 0 2px 4px 0 rgba(255, 255, 255, 0.14),
    0 3px 14px 2px rgba(255, 255, 255, 0.12);
}

.right-column-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 !important;

  .header-p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
    margin-bottom: 0 !important;
  }
}

.right-col-sub-header {
  font-family: Helvetica;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #000;
  padding-bottom: 20px !important;
}

.pop-up-card {
  width: 100%;
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
  background-color: #fff;
}

@media only screen and (max-width: 1023px) {
  ::-webkit-scrollbar {
    -webkit-overflow-scrolling: auto;
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}

.create-com-btn {
  background-color: #2196f3 !important;
  color: #fff;
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

::v-deep .suggested-card > .suggested-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.right-side- {
  &title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}

.ts-tags {
  align-items: center;
}

.ts-footer {
  display: flex;
  margin-top: 10px;
  margin-left: 0px;
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
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-message {
  margin-right: 40px;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-harmful {
  margin-right: 15px;
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

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-body {
  margin-top: 8px;
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
    font-weight: bold;
  }
}

// Threat sharing Content
.threat-sharing-content {
  min-height: 200px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);
  background-color: #ffffff;
  padding: 29px 32px 16px 32px;
}

.ts-header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
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
}

// Threat sharing Content End

.v-tab {
  padding: 0 !important;
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(0, 0, 0, 0.87);
  text-align: left !important;
}

::v-deep .v-slide-group__wrapper {
  padding-left: 20px !important;
}

.v-card.v-sheet.theme--light {
  padding-top: 0;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 20px;
}

//search Input css
::v-deep .v-label--active {
  transform: translateY(-15px) scale(0.75);
}

::v-deep .v-text-field--outlined .v-label {
  top: 11px;
}

::v-deep .v-input__slot {
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  min-height: 40px !important;
}

::v-deep label.v-label.theme--light {
  font-size: 12px;
}

.v-input {
  font-size: 13px !important;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

// end search input

::v-deep .v-slide-group__content {
  border-bottom: 2px solid #e4e7ed;
  margin-right: 20px;
}

::v-deep .v-tabs-slider-wrapper {
  bottom: -1px !important;
  color: #0486fe !important;
}

::v-deep .v-tabs-bar {
  height: 60px !important;

  .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
    font-weight: 600;
    margin-right: 48px;
  }
}

::v-deep .community-selector {
  .v-tabs-bar {
    height: 44px !important;
  }
}

::v-deep .community-selector .v-slide-group__wrapper {
  background-color: #f5f7fa !important;
  height: 44px !important;
  padding-left: 0 !important;

  .v-tab {
    font-weight: 400;
    font-size: 14px !important;
    margin-top: 6px;
    margin-right: 32px !important;
  }
}

::v-deep .community-selector .v-slide-group__wrapper > div {
  height: 100%;
  margin-right: 0 !important;
}

::v-deep .v-text-field--outlined fieldset {
  border-radius: 6px !important;
}

.search-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > div {
    padding-right: 10px;
  }

  .filter-icon {
    color: rgba(0, 0, 0, 0.34) !important;
    cursor: pointer;
  }
}

.filter-field {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

.create-com-btn {
  background-color: #2196f3 !important;
  color: #fff;
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

.ts-community-industry {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
}

.ts-people-icon {
  font-size: 16px;
}

.notification-wrapper {
  background-color: #fff;
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
}

::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}

::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

// Right Column
.right-side-content {
  a {
    text-decoration: none !important;
  }

  a:hover {
    text-decoration: underline !important;
  }
}

.right-side-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.right-side-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2196f3;
}

.about-community {
  display: flex;
  justify-content: space-between;
}

.about-community-statement {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.about-community-table-td {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.about-community-table-td-sec {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

::v-deep .right-side-like .v-icon,
::v-deep .right-side-message .v-icon {
  height: 14px !important;
  width: 14px !important;
  font-size: 14px !important;
}

.right-side-like-comment-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.like-count,
.comment-count {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  padding-left: 2px;
}

.suggested-card {
  display: flex;
  flex-direction: row;
  position: relative;
  min-height: 76px;
  margin-bottom: 8px;
  border-radius: 4px !important;
  border: none !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;

  .suggested-row {
    align-items: stretch;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    max-height: 220px;
    width: 100%;
    padding: 16px;
    padding-bottom: 4px;
  }

  .suggested-com-name {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 100%;

    .suggested-title {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 0;
      padding-bottom: 8px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: block;
      max-width: 100%;
    }

    .suggested-com-detail {
      font-size: 12px;

      .suggested-people-icon {
        font-size: 14px !important;
      }

      .suggested-industry {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }
  }

  .suggested-right-action {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin: 13px 0;
    width: min-content;

    .suggested-btn {
      align-items: center;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize;
      width: min-content;

      @media only screen and (max-width: 500px) {
        padding: 0 3px !important;
      }
    }
  }
}

.community-notification-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #000;
}

.community-notification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  .community-notification-switch {
    align-items: center;
    display: flex;
    height: 25px !important;
    margin-top: 10px !important;
  }
}

.community-notification-row:first-child {
  border-bottom: 1px solid gray !important;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #2196f3;
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

.delete-info {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
}

.invite-sub-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

::v-deep .invite-input > .v-input__control > .v-input__slot {
  align-items: center;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-shadow: unset !important;
  display: flex;

  .v-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
    display: flex;
    align-items: center;
  }

  .invite-chip {
    border-radius: 18px !important;

    > span > span {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
    }
  }

  .mdi-menu-down {
    display: none !important;
  }
}

.newCommunityOverlay {
  background-color: #fff !important;
  overflow: auto !important;
  height: 100% !important;
  max-width: 100vw !important;
  width: 100% !important;
  display: block !important;
  justify-content: center !important;
  align-items: center !important;

  > ::v-deep .v-overlay__content {
    height: auto;
    width: 100%;
  }
}

.empty-posts {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #212121;
  display: block;
}

.empty-suggested-span {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
}

.create-first-btn {
  min-width: 70% !important;
  width: 221px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  font-stretch: normal !important;
  font-style: normal !important;
  line-height: 1.71 !important;
  letter-spacing: normal !important;
}

.right-col-semibold-label {
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: 600;
}

@media only screen and (max-width: 1023px) {
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}
</style>
