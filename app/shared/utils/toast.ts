import { toast } from "sonner";

export interface ApiError {
  status_code: number;
  detail: string;
  message: string;
  errors?: string[];
  field_errors?: Record<string, string>;
}

export const toastError = (error: ApiError | any) => {
  const message = error.message || "An error occurred";
  const { status_code, errors, field_errors } = error;

  toast.error(message, {
    description: status_code ? `Status: ${status_code}` : undefined,
  });

  if (field_errors && Object.keys(field_errors).length > 0) {
    const fieldErrorMessages = Object.entries(field_errors)
      .map(([field, error]) => `${field}: ${error}`)
      .join(", ");

    toast.error("Field Errors", {
      description: fieldErrorMessages,
    });
  }

  if (errors && errors.length > 0) {
    errors.forEach((errorMsg: string) => {
      toast.error("Validation Error", {
        description: errorMsg,
      });
    });
  }
};

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};
