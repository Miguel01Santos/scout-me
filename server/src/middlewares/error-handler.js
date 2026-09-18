import { ZodError } from 'zod';
import { HttpError } from '../http-error.js';

export function errorHandler(error, request, response, next) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      message: 'Dados inválidos',
      issues: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);

  return response.status(500).json({ message: 'Erro interno do servidor' });
}
