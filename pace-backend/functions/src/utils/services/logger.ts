import { logger } from "firebase-functions";

/**
 * PaceLoggingService - Centralized logging for MyMonii
 */
class PaceLoggingService {
  private static instance: PaceLoggingService;

  /**
   * PaceLoggingService constructor
   * @private
   */
  private constructor() {}

  /**
   * getInstance
   * @return {PaceLoggingService}
   */
  public static getInstance(): PaceLoggingService {
    if (PaceLoggingService.instance) {
      return PaceLoggingService.instance;
    }
    return (PaceLoggingService.instance = new PaceLoggingService());
  }

  /**
   * Writes INFO severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public log(message: string, metadata?: { [key: string]: any }) {
    logger.log(message, metadata ? metadata : {});
  }

  /**
   * Writes DEBUG severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public debug(message: string, metadata?: { [key: string]: any }) {
    logger.debug(message, JSON.stringify(metadata));
  }

  /**
   * Writes INFO severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public info(message: string, metadata?: { [key: string]: any }) {
    logger.info(message, metadata);
  }

  /**
   * Writes WARNING severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public warn(message: string, metadata?: { [key: string]: any }) {
    logger.warn(message, metadata);
  }

  /**
   * Writes ERROR severity in the log
   * @param {string} message
   * @param {Object | undefined} metadata
   */
  public error(message: string, metadata?: { [key: string]: any }) {
    logger.error(message, metadata);
  }
}

export const paceLoggingService = PaceLoggingService.getInstance();
