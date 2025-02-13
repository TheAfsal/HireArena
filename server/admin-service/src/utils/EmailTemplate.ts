export const getVerificationEmailTemplate = (url: string): string => `
  <p>Click the link below to verify your email:</p>
  <a href="${url}">${url}</a>
`;
