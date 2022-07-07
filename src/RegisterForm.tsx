import React, { FormEvent, useCallback, useState } from "react";
import { register } from "./api";
import styled from "styled-components";

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
    <StyledRegisterForm onSubmit={handleSubmit}>
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

      <button disabled={isSubmitting} type="submit">
        submit
      </button>

      {result ? <div role="row">{JSON.stringify(result, null, 2)}</div> : null}

      {error ? <div role="alert">{error.message}</div> : null}
    </StyledRegisterForm>
  );
}

const StyledRegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  letter-spacing: 1.1px;
  & > label {
    font-size: 12px;
    margin-bottom: 4px;
  }
  & > input {
    margin-bottom: 12px;
  }
  & > div[role="row"] {
    word-break: break-word;
    white-space: pre-line;
    text-align: left;
  }
  & > div[role="alert"] {
    font-size: 14px;
    color: mediumvioletred;
    font-weight: 500;
    word-break: break-word;
  }
  & > button[type="submit"] {
    box-sizing: border-box;
    outline: 2px solid #000;
    background-color: #fff;
    padding: 4px 12px;
    margin-bottom: 12px;
    letter-spacing: 1.1px;
    &:focus {
      outline: 1px solid #000;
    }
  }
`;
