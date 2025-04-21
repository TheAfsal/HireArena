"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
class CompanyService {
    constructor(companyEmployeeRoleRepository, companyRepository) {
        this.getCompanyIdByUserId = (userId, callback) => {
            this.companyEmployeeRoleRepository
                .findCompanyByUserId(userId)
                .then((details) => {
                if (details) {
                    callback(null, { companyId: details.companyId });
                }
                else {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    });
                }
            })
                .catch((err) => {
                callback({
                    code: grpc.status.INTERNAL,
                    details: err.message,
                });
            });
        };
        this.companyEmployeeRoleRepository = companyEmployeeRoleRepository;
        this.companyRepository = companyRepository;
    }
    async getAllCompanies(skip, take, search) {
        return await this.companyRepository.findMany(skip, take, search);
    }
    async getCompaniesCount(search) {
        return await this.companyRepository.count(search);
    }
    // async getAllCompanies(): Promise<ICompany[]> {
    //   return await this.companyRepository.findMany();
    // }
    async getCompanyDetailsById(companyIds, callback) {
        try {
            const details = await this.companyRepository.findByIds(companyIds);
            console.log("@@ ********************", details);
            if (!details.length) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Companies not found",
                });
            }
            const companies = details.map((company) => ({
                id: company.id,
                companyName: company.companyName,
                location: company.location,
                logo: company.logo,
            }));
            callback(null, { companies });
        }
        catch (err) {
            callback({
                code: grpc.status.INTERNAL,
                details: err.message,
            });
        }
    }
    async verifyCompanyProfile(companyId, status, rejectReason) {
        if (status === "Rejected" && !rejectReason) {
            throw new Error("Rejection reason is required when rejecting.");
        }
        return this.companyRepository.update(companyId, {
            status,
            reject_reason: rejectReason || null,
        });
    }
    async getEmployeesByCompanyId(companyId) {
        if (!companyId) {
            throw new Error('Company ID is required');
        }
        return this.companyEmployeeRoleRepository.findEmployeesByCompanyId(companyId);
    }
}
exports.default = CompanyService;
