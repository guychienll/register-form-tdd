import React, { FormEvent, useCallback, useState } from "react";
import { register } from "./api";

export function RegisterForm() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    repeat: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<any>(null);

  const handleChange = (e: { target: { value: string; name: string } }) => {
    const { value, name } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const resp = await register(values);
      setResult(resp);
    } catch (e: any) {
      setError({
        message: e.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        onChange={handleChange}
        name="email"
        id="email"
        type="text"
        value={values.email}
      />

      <label htmlFor="password">Password</label>
      <input
        onChange={handleChange}
        name="password"
        id="password"
        type="text"
        value={values.password}
      />

      <label htmlFor="repeat">Repeat</label>
      <input
        onChange={handleChange}
        name="repeat"
        id="repeat"
        type="text"
        value={values.repeat}
      />

      {result ? <div role="row">{JSON.stringify(result)}</div> : null}
      {error ? <div role="alert">{error.message}</div> : null}
      <button disabled={isSubmitting} type="submit">
        submit
      </button>
    </form>
  );
}
