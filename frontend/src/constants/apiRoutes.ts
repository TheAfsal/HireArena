export const BASE_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000";

export const SERVICES = {
  USER_SERVICE_FOR_AUTH: "/user-service/auth/api",
  USER_SERVICE: "/user-service/api",
  JOB_SERVICE: "/job-service/api",
  INTERVIEW_SERVICE: "/interview-mgmt-service/api",
  ADMIN_SERVICE: "/admin-service/api",
  CHAT_SERVICE: "/chat-service/api",
  NOTIFICATION_SERVICE: "/notification-service/api",
};

export const AUTH_ROUTES = {
  VERIFY_BY_ADMIN: `${SERVICES.USER_SERVICE}/admin/verify`,
  LOGIN_JOBSEEKER: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/login`,
  SIGNUP_JOBSEEKER: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/signup`,
  LOGIN_COMPANY: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/company-login`,
  SIGNUP_COMPANY: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/company-signup`,
  LOGIN_ADMIN: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/admin-login`,
  VERIFY_EMAIL: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/verify-email`,
  INVITATION_BY_COMPANY: `${SERVICES.USER_SERVICE}/company/invite`,
  GOOGLE_TOKEN: `${SERVICES.USER_SERVICE}/auth/refresh-token-google`,
  ACCEPT_INVITATION: `${SERVICES.USER_SERVICE_FOR_AUTH}/company/accept-invite`,
  FORGOT_PASSWORD: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/forgot-password`,
  CONFIRM_FORGOT_PASSWORD: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/forgot-password-token`,
};

export const INTERVIEW_ROUTES = {
  FETCH_APTITUDE_QUESTION: `${SERVICES.INTERVIEW_SERVICE}/interviews`,
  SUBMIT_APTITUDE_QUESTION: `${SERVICES.INTERVIEW_SERVICE}/interviews/aptitude/submit`,
  FETCH_APTITUDE_RESULT: `${SERVICES.INTERVIEW_SERVICE}/interviews/aptitude-result`,
  FETCH_MACHINE_TASK_BY_JOB: `${SERVICES.INTERVIEW_SERVICE}/machine-task/job`,
  FETCH_MACHINE_TASK: `${SERVICES.INTERVIEW_SERVICE}/machine-task`,
  START_MACHINE_TASK: `${SERVICES.INTERVIEW_SERVICE}/machine-task/start-task`,
  SUBMIT_MACHINE_TASK: `${SERVICES.INTERVIEW_SERVICE}/machine-task/submit`,
  FETCH_ALL_APPLICATIONS: `${SERVICES.INTERVIEW_SERVICE}/interviews/company-applications`,
  FETCH_ALL_APPLICATIONS_DASHBOARD: `${SERVICES.INTERVIEW_SERVICE}/interviews/company-applications-dashboard`,
  FETCH_JOB_APPLICATIONS: `${SERVICES.INTERVIEW_SERVICE}/interviews/job-applications`,
  SCHEDULE_INTERVIEW: `${SERVICES.INTERVIEW_SERVICE}/interviews/schedule`,
  FETCH_MY_SCHEDULE: `${SERVICES.INTERVIEW_SERVICE}/interviews/schedule`,
  SUBMIT_VIDEO_INTERVIEW: `${SERVICES.INTERVIEW_SERVICE}/interviews/submit-video-call-interview`,
  FETCH_MY_APPLICATIONS: `${SERVICES.INTERVIEW_SERVICE}/interviews/`,
  APPLY_INTERVIEW: `${SERVICES.INTERVIEW_SERVICE}/interviews/apply`,
  FETCH_APPLIED_JOBS_STATUS: `${SERVICES.INTERVIEW_SERVICE}/interviews/status`,
};

export const SKILL_ROUTES = {
  ADD_CATEGORY_TYPE: `${SERVICES.JOB_SERVICE}/categories/create`,
  EDIT_CATEGORY_TYPE: `${SERVICES.JOB_SERVICE}/categories/update`,
  CATEGORY_TYPE: `${SERVICES.JOB_SERVICE}/categories/`,
  CREATE_CATEGORIES: `${SERVICES.JOB_SERVICE}/job-categories/create`,
  EDIT_CATEGORIES: `${SERVICES.JOB_SERVICE}/job-categories/update`,
  CATEGORIES: `${SERVICES.JOB_SERVICE}/job-categories/`,
  ADD_TECH_STACK: `${SERVICES.JOB_SERVICE}/tech-stacks/create`,
  EDIT_TECH_STACK: `${SERVICES.JOB_SERVICE}/tech-stacks/update`,
  TECH_STACK: `${SERVICES.JOB_SERVICE}/tech-stacks`,
  ADD_SKILLS: `${SERVICES.JOB_SERVICE}/skills/create`,
  EDIT_SKILLS: `${SERVICES.JOB_SERVICE}/skills/update`,
  SKILLS: `${SERVICES.JOB_SERVICE}/skills`,
};

export const CHAT_ROUTES = {
  MY_CHATS: `${SERVICES.CHAT_SERVICE}/chats`,
  COMPANY_CHATS: `${SERVICES.CHAT_SERVICE}/chats/company`,
};

export const COMPANY_ROUTES = {
  FETCH_COMPANIES: `${SERVICES.USER_SERVICE}/admin/companies`,
  COMPANIES_EMPLOYEES: `${SERVICES.USER_SERVICE}/company/employees`,
};

export const ADMIN_ROUTES = {
  FETCH_CANDIDATES_BY_ADMIN: `${SERVICES.ADMIN_SERVICE}/admin/candidates`,
  UPDATE_CANDIDATES_STATUS_BY_ADMIN: `${SERVICES.USER_SERVICE}/admin/candidates`,
};

export const USER_ROUTES = {
  JOB_SEEKER_PROFILE: `${SERVICES.USER_SERVICE}/job-seeker/profile`,
  JOB_SEEKER_MINIMAL_PROFILE: `${SERVICES.USER_SERVICE}/job-seeker/profile/minimal`,
  COMPANY_PROFILE: `${SERVICES.USER_SERVICE}/company/profile`,
  COMPANY_MEDIA_LINK: `${SERVICES.USER_SERVICE}/company/media-links`,
  CHANGE_JOB_SEEKER_PASSWORD: `${SERVICES.USER_SERVICE}/job-seeker/change-password`,
  FETCH_JOB_SEEKER_ID: `${SERVICES.USER_SERVICE}/job-seeker/userId`,
  REFRESH_TOKEN: `${SERVICES.USER_SERVICE_FOR_AUTH}/auth/refresh-token`,
};

export const JOB_ROUTES = {
  JOB: `${SERVICES.JOB_SERVICE}/jobs`,
  JOB_LIST_BRIEF: `${SERVICES.JOB_SERVICE}/jobs/brief`,
  POSTED_JOBS: `${SERVICES.JOB_SERVICE}/jobs/company`,
  FILTER_JOBS: `${SERVICES.JOB_SERVICE}/jobs/filter`,
};

export const SUBSCRIPTION_ROUTES = {
  SUBSCRIPTION: `${SERVICES.ADMIN_SERVICE}/subscriptions`,
  SUBSCRIBE_CANDIDATE: `${SERVICES.USER_SERVICE}/subscription/create-checkout-session`,
  VERIFY_SUBSCRIPTION: `${SERVICES.USER_SERVICE}/subscription/verify?session_id`,
  MY_SUBSCRIPTION: `${SERVICES.USER_SERVICE}/subscription`,
  FETCH_SUBSCRIPTION_HISTORY: `${SERVICES.USER_SERVICE}/subscription/user`,
  FETCH_SUBSCRIPTION_BY_ADMIN: `${SERVICES.USER_SERVICE}/admin/subscriptions`,
};

export const NOTIFICATION_ROUTES = {
  NOTIFICATION: `${SERVICES.NOTIFICATION_SERVICE}/notification`,
  MARK_AS_DONE: `${SERVICES.NOTIFICATION_SERVICE}/notification/read`,
};
