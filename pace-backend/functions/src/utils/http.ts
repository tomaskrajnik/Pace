import { HttpStatusCode } from "../shared/enums/http-status-codes.enum";
import { paceLoggingService } from "./services/logger";

/**
 * Sending response
 * @param {any} res
 * @param {HttpStatusCode} status
 * @param {any} data
 */
export function sendResponse(res: any, status: HttpStatusCode, data: any) {
  paceLoggingService.info("Sending response", { status, data });
  res.status(status).json(data.error ? data : { data });
}
