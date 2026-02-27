import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactElement<{ id?: string }>;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>{label}</label>
      {React.cloneElement(children, { id: htmlFor })}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
