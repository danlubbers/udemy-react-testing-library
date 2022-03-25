import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("inputs should be initially empty", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox");
  expect(emailInputElement.value).toBe("");

  const passwordInputElement = screen.getByLabelText("Password");
  expect(passwordInputElement.value).toBe("");

  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  expect(confirmPasswordInputElement.value).toBe("");
});

test("should be able to type an email", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });

  userEvent.type(emailInputElement, "selena@gmail.com");
  expect(emailInputElement.value).toBe("selena@gmail.com");
});

test("should be able to type a password", () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText("Password");

  userEvent.type(passwordInputElement, "password-test");
  expect(passwordInputElement.value).toBe("password-test");
});

test("should be able to type in confirm password", () => {
  render(<App />);
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  userEvent.type(confirmPasswordInputElement, "password-test");
  expect(confirmPasswordInputElement.value).toBe("password-test");
});

test("should show email error message on invalid email", () => {
  render(<App />);

  // Initially Null
  const emailErrorElementNull = screen.queryByText(
    /The email you input is invalid/i
  );
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const submitBtn = screen.getByRole("button", { name: /submit/i });

  expect(emailErrorElementNull).not.toBeInTheDocument();

  userEvent.type(emailInputElement, "selenagmail.com");
  userEvent.click(submitBtn);

  // Not null after userEvent.click
  const emailErrorElement = screen.queryByText(
    /The email you input is invalid/i
  );

  expect(emailErrorElement).toBeInTheDocument();
});

test("should show password error message with 5 characters or less", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox");
  const passwordErrorElementNull = screen.queryByText(
    /the password you entered should contain 5 or more characters./i
  );

  const passwordInputElement = screen.getByLabelText("Password");
  const submitBtn = screen.getByRole("button", { name: /submit/i });

  userEvent.type(emailInputElement, "selena@gmail.com");
  expect(passwordErrorElementNull).not.toBeInTheDocument();

  userEvent.type(passwordInputElement, "fail");
  userEvent.click(submitBtn);

  const passwordErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters./i
  );

  expect(passwordErrorElement).toBeInTheDocument();
});

test("should show confirm password error message if passwords do not match", () => {
  render(<App />);

  const emailInputElement = screen.getByRole("textbox");
  const confirmPasswordErrorElementNull = screen.queryByText(
    /confirm password does not match password./i
  );

  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm Password/i);
  const submitBtn = screen.getByRole("button", { name: /submit/i });

  userEvent.type(emailInputElement, "selena@gmail.com");
  userEvent.type(passwordInputElement, "passing");

  expect(confirmPasswordErrorElementNull).not.toBeInTheDocument();

  userEvent.type(confirmPasswordInputElement, "failing");
  userEvent.click(submitBtn);

  const confirmPasswordErrorElement = screen.queryByText(
    /confirm password does not match password./i
  );

  expect(confirmPasswordInputElement.value).not.toEqual(
    passwordInputElement.value
  );
  expect(confirmPasswordErrorElement).toBeInTheDocument();
});

test("should show no error message if every input is valid", () => {
  render(<App />);

  const emailErrorElement = screen.queryByText(
    /The email you input is invalid/i
  );
  const passwordErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters./i
  );
  const confirmPasswordErrorElement = screen.queryByText(
    /confirm password does not match password./i
  );

  const emailInputElement = screen.getByRole("textbox");
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm Password/i);

  const submitBtn = screen.getByRole("button", { name: /submit/i });

  userEvent.type(emailInputElement, "selena@gmail.com");
  userEvent.type(passwordInputElement, "passing");
  userEvent.type(confirmPasswordInputElement, "passing");
  userEvent.click(submitBtn);

  expect(confirmPasswordInputElement.value).toEqual(passwordInputElement.value);
  expect(emailErrorElement).not.toBeInTheDocument();
  expect(passwordErrorElement).not.toBeInTheDocument();
  expect(confirmPasswordErrorElement).not.toBeInTheDocument();
});
