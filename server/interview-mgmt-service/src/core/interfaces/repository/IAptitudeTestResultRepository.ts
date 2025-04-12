import { IAptitudeTestResult } from "model/AptitudeTestResult";

export default interface IAptitudeTestResultRepository {
  saveResults(results: Partial<IAptitudeTestResult>): Promise<IAptitudeTestResult>
}
