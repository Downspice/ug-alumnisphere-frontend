import { gql } from "@apollo/client";

export const GET_HEALTH = gql`
  query GetHealth {
    health {
      status
      timestamp
      database
      uptime
    }
  }
`;

export const GET_EXAMS = gql`
  query GetExams($isPublished: Boolean) {
    exams(isPublished: $isPublished) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
      createdAt
      updatedAt
      questions {
        questionText
        options
        correctOptionIndex
        points
      }
    }
  }
`;

export const GET_EXAM = gql`
  query GetExam($id: ID!) {
    exam(id: $id) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
      createdAt
      updatedAt
      questions {
        questionText
        options
        correctOptionIndex
        points
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      accountStatus
      verificationStatus
      createdAt
    }
  }
`;

export const DIRECTORY_USER_FIELDS = gql`
  fragment DirectoryUserFields on User {
    id
    name
    email
    role
    verificationStatus
    headline
    about
    location
    graduationYear
    programme
    department
    faculty
    industry
    company
    jobTitle
    skills
    openToWork
    openToMentor
    avatarUrl
  }
`;

export const GET_ALUMNI_DIRECTORY = gql`
  query GetAlumniDirectory(
    $filter: DirectoryFilter
    $sort: DirectorySort
    $page: Int
    $pageSize: Int
  ) {
    alumniDirectory(filter: $filter, sort: $sort, page: $page, pageSize: $pageSize) {
      total
      page
      pageSize
      hasNextPage
      items {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_PUBLIC_PROFILE = gql`
  query GetPublicProfile($id: ID!) {
    publicProfile(id: $id) {
      ...DirectoryUserFields
      createdAt
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_MY_VERIFICATION = gql`
  query GetMyVerification {
    myVerificationRequest {
      id
      graduationYear
      programme
      studentNumber
      notes
      documentFileName
      documentDownloadUrl
      status
      rejectionReason
      createdAt
    }
  }
`;

export const GET_VERIFICATION_REQUESTS = gql`
  query GetVerificationRequests($status: VerificationStatus) {
    verificationRequests(status: $status) {
      id
      graduationYear
      programme
      studentNumber
      notes
      documentFileName
      documentDownloadUrl
      status
      rejectionReason
      createdAt
      applicant {
        id
        name
        email
        role
        verificationStatus
        programme
        graduationYear
      }
    }
  }
`;

export const GET_MY_CONNECTIONS = gql`
  query GetMyConnections {
    myConnections {
      id
      status
      updatedAt
      requester {
        ...DirectoryUserFields
      }
      addressee {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_PENDING_CONNECTIONS = gql`
  query GetPendingConnections {
    pendingConnectionRequests {
      id
      status
      createdAt
      requester {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_SENT_CONNECTIONS = gql`
  query GetSentConnections {
    sentConnectionRequests {
      id
      status
      createdAt
      addressee {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_SUGGESTED_CONNECTIONS = gql`
  query GetSuggestedConnections {
    suggestedConnections {
      reasons
      user {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_CONNECTION_STATUS = gql`
  query GetConnectionStatus($userId: ID!) {
    connectionStatus(userId: $userId) {
      id
      status
      requester {
        id
      }
      addressee {
        id
      }
    }
  }
`;

export const CONVERSATION_FIELDS = gql`
  fragment ConversationFields on Conversation {
    id
    lastMessagePreview
    lastMessageAt
    unreadCount
    participants {
      ...DirectoryUserFields
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations($search: String) {
    conversations(search: $search) {
      ...ConversationFields
    }
  }
  ${CONVERSATION_FIELDS}
`;

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      ...ConversationFields
    }
  }
  ${CONVERSATION_FIELDS}
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id
      body
      createdAt
      sender {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const COMMUNITY_FIELDS = gql`
  fragment CommunityFields on Community {
    id
    name
    slug
    description
    isPrivate
    memberCount
    myRole
    joinRequestPending
    createdAt
    owner {
      id
      name
    }
  }
`;

export const GET_COMMUNITIES = gql`
  query GetCommunities($search: String, $mine: Boolean) {
    communities(search: $search, mine: $mine) {
      ...CommunityFields
    }
  }
  ${COMMUNITY_FIELDS}
`;

export const GET_COMMUNITY = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      ...CommunityFields
    }
  }
  ${COMMUNITY_FIELDS}
`;

export const GET_COMMUNITY_MEMBERS = gql`
  query GetCommunityMembers($communityId: ID!) {
    communityMembers(communityId: $communityId) {
      id
      role
      createdAt
      user {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_COMMUNITY_JOIN_REQUESTS = gql`
  query GetCommunityJoinRequests($communityId: ID!) {
    communityJoinRequests(communityId: $communityId) {
      id
      status
      createdAt
      user {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    type
    body
    imageUrl
    linkUrl
    pollQuestion
    pollOptions {
      text
      voteCount
    }
    pollClosesAt
    pollClosed
    pollTotalVotes
    myPollVote
    likeCount
    commentCount
    likedByMe
    savedByMe
    createdAt
    updatedAt
    author {
      ...DirectoryUserFields
    }
    community {
      id
      name
      isPrivate
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_FEED = gql`
  query GetFeed($communityId: ID) {
    feed(communityId: $communityId) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(postId: $postId) {
      id
      parentId
      body
      createdAt
      author {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_SAVED_POSTS = gql`
  query GetSavedPosts {
    savedPosts {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

export const JOB_FIELDS = gql`
  fragment JobFields on Job {
    id
    title
    company
    location
    type
    industry
    description
    requirements
    applicationUrl
    status
    savedByMe
    applicationCount
    createdAt
    postedBy {
      id
      name
    }
    myApplication {
      id
      status
      coverNote
      createdAt
    }
  }
`;

export const GET_JOBS = gql`
  query GetJobs(
    $search: String
    $type: JobType
    $location: String
    $industry: String
    $sort: JobSort
  ) {
    jobs(
      search: $search
      type: $type
      location: $location
      industry: $industry
      sort: $sort
    ) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const GET_SAVED_JOBS = gql`
  query GetSavedJobs {
    savedJobs {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const GET_MY_POSTED_JOBS = gql`
  query GetMyPostedJobs {
    myPostedJobs {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const GET_MY_JOB_APPLICATIONS = gql`
  query GetMyJobApplications {
    myJobApplications {
      id
      status
      coverNote
      resumeFileName
      resumeDownloadUrl
      createdAt
      job {
        ...JobFields
      }
    }
  }
  ${JOB_FIELDS}
`;

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications($jobId: ID!) {
    jobApplications(jobId: $jobId) {
      id
      status
      coverNote
      resumeFileName
      resumeDownloadUrl
      createdAt
      applicant {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_MENTORS = gql`
  query GetMentors($search: String, $industry: String, $location: String) {
    mentors(search: $search, industry: $industry, location: $location) {
      ...DirectoryUserFields
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_MENTORSHIP_REQUEST_STATUS = gql`
  query GetMentorshipRequestStatus($userId: ID!) {
    mentorshipRequestStatus(userId: $userId) {
      id
      status
      message
      mentee {
        id
      }
      mentor {
        id
      }
    }
  }
`;

export const GET_INCOMING_MENTORSHIP = gql`
  query GetIncomingMentorship {
    incomingMentorshipRequests {
      id
      status
      message
      createdAt
      mentee {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_SENT_MENTORSHIP = gql`
  query GetSentMentorship {
    sentMentorshipRequests {
      id
      status
      message
      createdAt
      mentor {
        ...DirectoryUserFields
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const GET_MY_MENTORSHIPS = gql`
  query GetMyMentorships {
    myMentorships {
      id
      status
      createdAt
      mentor {
        ...DirectoryUserFields
      }
      mentee {
        ...DirectoryUserFields
      }
      goals {
        id
        text
        done
      }
    }
  }
  ${DIRECTORY_USER_FIELDS}
`;

export const EVENT_FIELDS = gql`
  fragment EventFields on Event {
    id
    title
    description
    location
    startsAt
    endsAt
    capacity
    status
    registeredCount
    registeredByMe
    createdAt
    createdBy {
      id
      name
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents($search: String, $location: String, $includeUnpublished: Boolean) {
    events(
      search: $search
      location: $location
      includeUnpublished: $includeUnpublished
    ) {
      ...EventFields
    }
  }
  ${EVENT_FIELDS}
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFields
    }
  }
  ${EVENT_FIELDS}
`;

export const GET_MY_EVENT_REGISTRATIONS = gql`
  query GetMyEventRegistrations {
    myEventRegistrations {
      id
      createdAt
      event {
        ...EventFields
      }
    }
  }
  ${EVENT_FIELDS}
`;

export const CAMPAIGN_FIELDS = gql`
  fragment CampaignFields on Campaign {
    id
    title
    description
    goalAmount
    raisedAmount
    remainingAmount
    progressPercent
    contributorCount
    deadline
    status
    createdAt
    createdBy {
      id
      name
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($search: String, $includeUnpublished: Boolean) {
    campaigns(search: $search, includeUnpublished: $includeUnpublished) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS}
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS}
`;

export const GET_CAMPAIGN_CONTRIBUTIONS = gql`
  query GetCampaignContributions($campaignId: ID!) {
    campaignContributions(campaignId: $campaignId) {
      id
      amount
      anonymous
      note
      status
      createdAt
      contributor {
        id
        name
      }
    }
  }
`;

export const GET_MY_CONTRIBUTIONS = gql`
  query GetMyContributions {
    myContributions {
      id
      amount
      anonymous
      note
      status
      createdAt
      campaign {
        ...CampaignFields
      }
    }
  }
  ${CAMPAIGN_FIELDS}
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      title
      body
      href
      read
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationCount {
    unreadNotificationCount
  }
`;

export const GET_ADMIN_OVERVIEW = gql`
  query GetAdminOverview {
    adminOverview {
      users
      jobs
      applications
      events
      registrations
      communities
      campaigns
      contributions
      openReports
      pendingVerifications
    }
  }
`;

export const GET_ADMIN_ANALYTICS = gql`
  query GetAdminAnalytics {
    adminAnalytics {
      source
      usersByRole {
        label
        value
      }
      jobsByType {
        label
        value
      }
      eventsByStatus {
        label
        value
      }
      campaignProgress {
        label
        value
        goal
      }
      contributionsByMonth {
        label
        value
      }
    }
  }
`;

export const GET_CONTENT_REPORTS = gql`
  query GetContentReports($status: String) {
    contentReports(status: $status) {
      id
      targetType
      targetId
      reason
      status
      createdAt
      reporter {
        id
        name
        email
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      accountStatus
      verificationStatus
      verificationRejectionReason
      headline
      about
      location
      graduationYear
      programme
      department
      faculty
      industry
      company
      jobTitle
      skills
      openToWork
      openToMentor
      avatarUrl
      createdAt
      updatedAt
    }
  }
`;
