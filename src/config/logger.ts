import pino from 'pino';
import * as moment from 'moment';

const logLevel = process.env.LOG_LEVEL || 'info';
const logConfig = {
  name: 'VAPT API SERVER',
  level: logLevel,
  timestamp: () => `,"time":"${moment()}"`,
  formatters: {
    level(lable: string) {
      return { level: lable };
    },
  },
  serializers: {
    res(reply: any) {
      return {
        url: reply.request.url,
        method: reply.request.method,
        statusCode: reply.statusCode,
      };
    },
    req(request: any) {
      return {
        url: request.url,
        method: request.method,
        hostname: request.hostname,
        remotePort: request.socket.remotePort,
        contentType: request.headers['content-type'],
        remoteAddress: request.ip,
      };
    },
  },
};

const logger = pino(logConfig);

export default logger;
