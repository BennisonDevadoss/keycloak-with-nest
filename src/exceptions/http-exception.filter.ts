import logger from 'src/config/logger';

import { AxiosError } from 'axios';
import { AbstractHttpAdapter } from '@nestjs/core';

import {
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}

  catch(exception: any, host: ArgumentsHost): void {
    console.log(exception);
    logger.error(exception);
    let errorMessage: unknown;
    let responseObject: any;
    let httpStatus: number;
    const httpAdapter = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse();
    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        httpStatus = 422;
        responseObject = exception.getResponse();
        errorMessage = responseObject['message'];
      } else {
        httpStatus = exception.getStatus();
        responseObject = exception.getResponse();
        console.log(responseObject);
        errorMessage = responseObject['message'];
      }
    } else if (exception instanceof PrismaClientRustPanicError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
      httpStatus = 404;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (exception instanceof PrismaClientInitializationError) {
      httpStatus = 400;
      errorMessage = exception.message;
    } else if (exception instanceof AxiosError) {
      httpStatus = exception.response?.status
        ? exception.response?.status
        : 500;

      if (exception.response?.data.errorMessage) {
        errorMessage = exception.response?.data.errorMessage;
      } else if (exception.response?.data.error_description) {
        errorMessage = exception.response?.data.error_description;
      }
    } else if (exception.errors) {
      httpStatus = 401;
      errorMessage = exception.errors;
    } else {
      httpStatus = 500;
      errorMessage = [
        'Sorry! something went to wrong on our end, Please try again later',
      ];
    }
    const errorResponse = {
      errors: typeof errorMessage === 'string' ? [errorMessage] : errorMessage,
    };
    console.log('ERROR RESPONSE', errorResponse);
    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
