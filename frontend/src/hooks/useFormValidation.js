// hooks/useFormValidation.js
import { useState } from "react";


/**
 * Generic Zod-based form validation hook (JSX version)
 *
 * @param {z.ZodObject} schema - Zod schema for validation
 * @param {Object} initialValues - Initial form values
 */
const useFormValidation = (schema, initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Convert ZodError into { field: message }
  const flattenZodError = (zodError) => {
    const formattedErrors = {};

    zodError.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (path) {
        formattedErrors[path] = issue.message;
      }
    });

    return formattedErrors;
  };

  // Validate full form
  const validateForm = () => {
    const result = schema.safeParse(values);

    if (!result.success) {
      setErrors(flattenZodError(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  // Handle input change (field-level validation)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate only the changed field
    const fieldSchema = schema.pick({ [name]: true });
    const result = fieldSchema.safeParse({ [name]: value });

    setErrors((prev) => {
      if (!result.success) {
        return {
          ...prev,
          [name]: result.error.issues[0]?.message,
        };
      }

      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  // Reset form
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  // Programmatic update of values
  const setValuesWrapper = (newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    validateForm,
    resetForm,
    setValues: setValuesWrapper,
  };
};

export default useFormValidation;
