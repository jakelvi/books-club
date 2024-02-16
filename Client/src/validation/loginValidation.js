import toast from "react-hot-toast";

export async function loginVerify({ username, password }) {
  let errors = {};
  errors = usernameVerify(errors, { username });
  const passwordErrors = await passwordVerify({ password });
  errors = { ...errors, ...passwordErrors };
  return errors;
}

export function usernameVerify(error = {}, { username }) {
  if (!username) {
    error.username = toast.error("Username Required...!");
  } else if (username.includes(" ")) {
    error.username = toast.error("Invalid Username...!");
  }
  return error;
}

export async function passwordVerify({ password }) {
  const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?~`]/;
  const errors = {};
  if (!password) {
    errors.password = "Password Required...!";
  } else if (password.includes(" ")) {
    errors.password = "Password cannot contain spaces...!";
  } else if (password.length < 8) {
    errors.password = "Password must be more than 7 characters long";
  } else if (!specialChars.test(password)) {
    errors.password = "Password must have special characters";
  }
  await Promise.all(
    Object.values(errors).map((errorMessage) => toast.error(errorMessage))
  );
  return errors;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}
