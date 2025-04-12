import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import IAptitudeTestResultRepository from "@core/interfaces/repository/IAptitudeTestResultRepository";
import AptitudeTestResultModel, { IAptitudeTestResult } from "model/AptitudeTestResult";
class AptitudeTestResultRepository
  extends BaseRepository<IAptitudeTestResult, string>
  implements IAptitudeTestResultRepository
{
  constructor(aptitudeTestResultModel: Model<IAptitudeTestResult> = AptitudeTestResultModel) {
    super(aptitudeTestResultModel);
  }

   async saveResults(
      results: Partial<IAptitudeTestResult>
    ): Promise<IAptitudeTestResult> {
      return await this.save(results);
    }
}

export default AptitudeTestResultRepository;
