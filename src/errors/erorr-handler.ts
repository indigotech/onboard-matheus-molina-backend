import { GraphQLError } from "graphql";
import { CustomError } from "./login-error-class";

export function formatError(error: GraphQLError) {
  if (error.originalError instanceof CustomError) {
    return {
      message: error.originalError.message,
      code: error.originalError.code,
      additionalInfo: error.originalError.additionalInfo,
    };
  } else {
    return {
      message: "Erro Interno, por favor, tente novamente",
      code: 500,
      additionalInfo: error.message,
    };
  }
}
