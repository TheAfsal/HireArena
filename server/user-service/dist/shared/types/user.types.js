"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["JOB_SEEKER"] = "JOB_SEEKER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["COMPANY"] = "COMPANY";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (exports.UserRole = UserRole = {}));
var CompanyRole;
(function (CompanyRole) {
    CompanyRole["OWNER"] = "OWNER";
    CompanyRole["HR"] = "HR";
    CompanyRole["MANAGER"] = "MANAGER";
    CompanyRole["INTERVIEWER"] = "INTERVIEWER";
    CompanyRole["EMPLOYEE"] = "EMPLOYEE";
})(CompanyRole || (exports.CompanyRole = CompanyRole = {}));
