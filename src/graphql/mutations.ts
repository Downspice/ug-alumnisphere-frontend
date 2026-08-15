import { gql } from "@apollo/client";

export const CREATE_EXAM = gql`
  mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
      id
      title
      description
      durationMinutes
      totalMarks
      passingMarks
      isPublished
      createdAt
    }
  }
`;

export const DELETE_EXAM = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
        accountStatus
        verificationStatus
        headline
        avatarUrl
        createdAt
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
        accountStatus
        verificationStatus
        headline
        avatarUrl
        createdAt
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const SUBMIT_VERIFICATION = gql`
  mutation SubmitVerification($input: SubmitVerificationInput!) {
    submitVerification(input: $input) {
      id
      status
      programme
      graduationYear
      documentFileName
      createdAt
    }
  }
`;

export const REVIEW_VERIFICATION = gql`
  mutation ReviewVerification($id: ID!, $approve: Boolean!, $rejectionReason: String) {
    reviewVerification(id: $id, approve: $approve, rejectionReason: $rejectionReason) {
      id
      status
      rejectionReason
    }
  }
`;

export const SEND_CONNECTION_REQUEST = gql`
  mutation SendConnectionRequest($userId: ID!) {
    sendConnectionRequest(userId: $userId) {
      id
      status
    }
  }
`;

export const ACCEPT_CONNECTION_REQUEST = gql`
  mutation AcceptConnectionRequest($id: ID!) {
    acceptConnectionRequest(id: $id) {
      id
      status
    }
  }
`;

export const DECLINE_CONNECTION_REQUEST = gql`
  mutation DeclineConnectionRequest($id: ID!) {
    declineConnectionRequest(id: $id) {
      id
      status
    }
  }
`;

export const REMOVE_CONNECTION = gql`
  mutation RemoveConnection($userId: ID!) {
    removeConnection(userId: $userId)
  }
`;

export const START_CONVERSATION = gql`
  mutation StartConversation($userId: ID!) {
    startConversation(userId: $userId) {
      id
      lastMessagePreview
      unreadCount
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: ID!, $body: String!) {
    sendMessage(conversationId: $conversationId, body: $body) {
      id
      body
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const MARK_CONVERSATION_READ = gql`
  mutation MarkConversationRead($conversationId: ID!) {
    markConversationRead(conversationId: $conversationId) {
      id
      unreadCount
    }
  }
`;

export const CREATE_COMMUNITY = gql`
  mutation CreateCommunity($input: CreateCommunityInput!) {
    createCommunity(input: $input) {
      id
      name
      slug
      isPrivate
      memberCount
      myRole
    }
  }
`;

export const JOIN_COMMUNITY = gql`
  mutation JoinCommunity($id: ID!) {
    joinCommunity(id: $id) {
      id
      memberCount
      myRole
      joinRequestPending
      isPrivate
    }
  }
`;

export const LEAVE_COMMUNITY = gql`
  mutation LeaveCommunity($id: ID!) {
    leaveCommunity(id: $id)
  }
`;

export const REVIEW_JOIN_REQUEST = gql`
  mutation ReviewJoinRequest($id: ID!, $approve: Boolean!) {
    reviewJoinRequest(id: $id, approve: $approve) {
      id
      status
    }
  }
`;

export const ASSIGN_MODERATOR = gql`
  mutation AssignModerator($communityId: ID!, $userId: ID!, $makeModerator: Boolean!) {
    assignModerator(
      communityId: $communityId
      userId: $userId
      makeModerator: $makeModerator
    ) {
      id
      role
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      type
      body
      imageUrl
      createdAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      id
      likeCount
      likedByMe
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $body: String!, $parentId: ID) {
    addComment(postId: $postId, body: $body, parentId: $parentId) {
      id
      body
      parentId
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const TOGGLE_SAVE_POST = gql`
  mutation ToggleSavePost($postId: ID!) {
    toggleSavePost(postId: $postId)
  }
`;

export const REPORT_CONTENT = gql`
  mutation ReportContent($targetType: String!, $targetId: ID!, $reason: String!) {
    reportContent(targetType: $targetType, targetId: $targetId, reason: $reason)
  }
`;

export const VOTE_POLL = gql`
  mutation VotePoll($postId: ID!, $optionIndex: Int!) {
    votePoll(postId: $postId, optionIndex: $optionIndex) {
      id
      pollOptions {
        text
        voteCount
      }
      pollTotalVotes
      myPollVote
      pollClosed
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      title
      status
    }
  }
`;

export const CLOSE_JOB = gql`
  mutation CloseJob($id: ID!) {
    closeJob(id: $id) {
      id
      status
    }
  }
`;

export const APPLY_TO_JOB = gql`
  mutation ApplyToJob($jobId: ID!, $coverNote: String!, $resumeFileId: ID) {
    applyToJob(jobId: $jobId, coverNote: $coverNote, resumeFileId: $resumeFileId) {
      id
      status
      resumeFileName
    }
  }
`;

export const WITHDRAW_APPLICATION = gql`
  mutation WithdrawApplication($id: ID!) {
    withdrawApplication(id: $id) {
      id
      status
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const TOGGLE_SAVE_JOB = gql`
  mutation ToggleSaveJob($jobId: ID!) {
    toggleSaveJob(jobId: $jobId)
  }
`;

export const REQUEST_MENTORSHIP = gql`
  mutation RequestMentorship($mentorId: ID!, $message: String!) {
    requestMentorship(mentorId: $mentorId, message: $message) {
      id
      status
    }
  }
`;

export const ACCEPT_MENTORSHIP = gql`
  mutation AcceptMentorshipRequest($id: ID!) {
    acceptMentorshipRequest(id: $id) {
      id
      status
    }
  }
`;

export const DECLINE_MENTORSHIP = gql`
  mutation DeclineMentorshipRequest($id: ID!) {
    declineMentorshipRequest(id: $id) {
      id
      status
    }
  }
`;

export const ADD_MENTORSHIP_GOAL = gql`
  mutation AddMentorshipGoal($mentorshipId: ID!, $text: String!) {
    addMentorshipGoal(mentorshipId: $mentorshipId, text: $text) {
      id
      goals {
        id
        text
        done
      }
    }
  }
`;

export const TOGGLE_MENTORSHIP_GOAL = gql`
  mutation ToggleMentorshipGoal($mentorshipId: ID!, $goalId: ID!) {
    toggleMentorshipGoal(mentorshipId: $mentorshipId, goalId: $goalId) {
      id
      goals {
        id
        text
        done
      }
    }
  }
`;

export const CLOSE_MENTORSHIP = gql`
  mutation CloseMentorship($id: ID!) {
    closeMentorship(id: $id) {
      id
      status
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      status
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      status
    }
  }
`;

export const PUBLISH_EVENT = gql`
  mutation PublishEvent($id: ID!) {
    publishEvent(id: $id) {
      id
      status
    }
  }
`;

export const CANCEL_EVENT = gql`
  mutation CancelEvent($id: ID!) {
    cancelEvent(id: $id) {
      id
      status
    }
  }
`;

export const REGISTER_FOR_EVENT = gql`
  mutation RegisterForEvent($eventId: ID!) {
    registerForEvent(eventId: $eventId) {
      id
    }
  }
`;

export const CANCEL_EVENT_REGISTRATION = gql`
  mutation CancelEventRegistration($eventId: ID!) {
    cancelEventRegistration(eventId: $eventId)
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      status
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      title
      status
    }
  }
`;

export const PUBLISH_CAMPAIGN = gql`
  mutation PublishCampaign($id: ID!) {
    publishCampaign(id: $id) {
      id
      status
    }
  }
`;

export const CLOSE_CAMPAIGN = gql`
  mutation CloseCampaign($id: ID!) {
    closeCampaign(id: $id) {
      id
      status
    }
  }
`;

export const RECORD_CONTRIBUTION = gql`
  mutation RecordContribution(
    $campaignId: ID!
    $amount: Float!
    $anonymous: Boolean
    $note: String
  ) {
    recordContribution(
      campaignId: $campaignId
      amount: $amount
      anonymous: $anonymous
      note: $note
    ) {
      id
      amount
      status
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

export const SET_USER_ACCOUNT_STATUS = gql`
  mutation SetUserAccountStatus($id: ID!, $status: AccountStatus!) {
    setUserAccountStatus(id: $id, status: $status) {
      id
      accountStatus
    }
  }
`;

export const REVIEW_REPORT = gql`
  mutation ReviewReport($id: ID!) {
    reviewReport(id: $id) {
      id
      status
    }
  }
`;

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      email
      role
      accountStatus
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
      updatedAt
    }
  }
`;
