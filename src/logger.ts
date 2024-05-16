import * as winston from "winston";
import { Syslog } from "winston-syslog";

export type LoggerOptions = {
  level?: string;
  env?: string;
  syslogOptions?: {
    appName: string;
    port: number;
    host: string;
  };
};

export function createLogger(options: LoggerOptions) {
  const level = options.level?.toLowerCase() ?? "info";
  const env = options.env?.toLowerCase() ?? "development";

  const logger = winston.createLogger({
    level,
    levels: winston.config.syslog.levels,
  });

  logger.add(
    new winston.transports.Console({
      level,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ level, message, timestamp, [Symbol.for("splat")]: metadata }) => {
            let output = `${timestamp} ${level}: ${message}`;

            if (metadata?.length) {
              for (const item of metadata) {
                if (item instanceof Error) {
                  output += `\n${item.stack}`;
                } else {
                  output += `\n${JSON.stringify(item, null, 2)}`;
                }
              }
            }

            return output;
          },
        ),
      ),
    }),
  );

  if (
    env === "production" &&
    Object.keys(options.syslogOptions ?? {}).length > 0
  ) {
    logger.add(
      new Syslog({
        ...options.syslogOptions,
        level,
        protocol: "udp4",
      }),
    );
  }

  return logger;
}
