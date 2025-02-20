"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationEmailTemplate = void 0;
const getVerificationEmailTemplate = (url) => `
  <p>Click the link below to verify your email:</p>
  <a href="${url}">${url}</a>
`;
exports.getVerificationEmailTemplate = getVerificationEmailTemplate;
