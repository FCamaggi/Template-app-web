import * as React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export const FormField = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
};

interface FormItemProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
}

export const FormItem = ({ children, label, description }: FormItemProps) => {
  const { name } = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const error = formState.errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {children}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {error?.message && (
        <p className="text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
