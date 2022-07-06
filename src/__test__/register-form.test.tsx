import "whatwg-fetch";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { RegisterForm } from "../RegisterForm";
import { register } from "../api";

const password = faker.internet.password(8);
const id = faker.database.mongodbObjectId();

const registerFormInfo = () => {
  return {
    email: faker.internet.email(),
    password: password,
    repeat: password,
  };
};

jest.mock("../api");
const mockedRegister = register as jest.MockedFunction<typeof register>;

afterEach(() => jest.clearAllMocks());

function renderRegisterForm() {
  render(<RegisterForm />);
  const userInput = registerFormInfo();
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const repeatInput = screen.getByLabelText(/repeat/i);
  const submitButton = screen.getByText(/submit/i);
  return { userInput, emailInput, passwordInput, repeatInput, submitButton };
}

describe("register form test suite", () => {
  test("register an user", async () => {
    const { userInput, emailInput, passwordInput, repeatInput, submitButton } =
      renderRegisterForm();

    mockedRegister.mockResolvedValueOnce({
      success: true,
      data: {
        id: id,
        ...userInput,
      },
    });
    expect(submitButton).toHaveAttribute("type", "submit");

    userEvent.type(emailInput, userInput.email);
    userEvent.type(passwordInput, userInput.password);
    userEvent.type(repeatInput, userInput.password);
    userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole(/row/i)).toHaveTextContent(`${id}`);
    });
    expect(submitButton).not.toBeDisabled();
  });

  test("register failed", async () => {
    const { userInput, emailInput, passwordInput, repeatInput, submitButton } =
      renderRegisterForm();

    mockedRegister.mockRejectedValueOnce(new Error("internal server error"));

    userEvent.type(emailInput, userInput.email);
    userEvent.type(passwordInput, userInput.password);
    userEvent.type(repeatInput, userInput.password);
    userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole(/alert/i)).toHaveTextContent(
        `internal server error`
      );
    });

    expect(submitButton).not.toBeDisabled();
  });
});
