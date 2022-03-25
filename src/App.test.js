import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm Password/i);

  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const submitBtnClick = () => {
  const submitBtnElement = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitBtnElement);
};

describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("inputs should be initially empty", () => {
    expect(screen.getByRole("textbox", { name: /email/i }).value).toBe("");
    expect(screen.getByLabelText("Password").value).toBe("");
    expect(screen.getByLabelText(/confirm password/i).value).toBe("");
  });

  test("should be able to type an email", () => {
    const { emailInputElement } = typeIntoForm({ email: "selena@gmail.com" });
    expect(emailInputElement.value).toBe("selena@gmail.com");
  });

  test("should be able to type a password", () => {
    const { passwordInputElement } = typeIntoForm({
      password: "password-test",
    });
    expect(passwordInputElement.value).toBe("password-test");
  });

  test("should be able to type in confirm password", () => {
    const { confirmPasswordInputElement } = typeIntoForm({
      confirmPassword: "password-test",
    });
    expect(confirmPasswordInputElement.value).toBe("password-test");
  });

  describe("Error handling", () => {
    test("should show email error message on invalid email", () => {
      expect(
        screen.queryByText(/The email you input is invalid/i)
      ).not.toBeInTheDocument();

      typeIntoForm({ email: "selenagmail.com" });
      submitBtnClick();

      expect(
        screen.getByText(/The email you input is invalid/i)
      ).toBeInTheDocument();
    });

    test("should show password error message with 5 characters or less", () => {
      const passwordErrorElementNull = screen.queryByText(
        /the password you entered should contain 5 or more characters./i
      );

      typeIntoForm({ email: "selena@gmail.com" });
      expect(passwordErrorElementNull).not.toBeInTheDocument();

      typeIntoForm({ password: "fail" });
      submitBtnClick();

      expect(
        screen.getByText(
          /the password you entered should contain 5 or more characters./i
        )
      ).toBeInTheDocument();
    });

    test("should show confirm password error message if passwords do not match", () => {
      const { passwordInputElement, confirmPasswordInputElement } =
        typeIntoForm({
          email: "selena@gmail.com",
          password: "passing",
          confirmPassword: "failing",
        });

      expect(
        screen.queryByText(/confirm password does not match password./i)
      ).not.toBeInTheDocument();

      submitBtnClick();

      expect(confirmPasswordInputElement.value).not.toEqual(
        passwordInputElement.value
      );
      expect(
        screen.getByText(/confirm password does not match password./i)
      ).toBeInTheDocument();
    });

    test("should show no error message if every input is valid", () => {
      const emailErrorElement = screen.queryByText(
        /The email you input is invalid/i
      );
      const passwordErrorElement = screen.queryByText(
        /the password you entered should contain 5 or more characters./i
      );
      const confirmPasswordErrorElement = screen.queryByText(
        /confirm password does not match password./i
      );

      const { passwordInputElement, confirmPasswordInputElement } =
        typeIntoForm({
          email: "selena@gmail.com",
          password: "passing",
          confirmPassword: "passing",
        });
      submitBtnClick();

      expect(confirmPasswordInputElement.value).toEqual(
        passwordInputElement.value
      );
      expect(emailErrorElement).not.toBeInTheDocument();
      expect(passwordErrorElement).not.toBeInTheDocument();
      expect(confirmPasswordErrorElement).not.toBeInTheDocument();
    });
  });
});
