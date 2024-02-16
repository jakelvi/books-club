import emailVerify from "./emailValidation";
import { usernameVerify, passwordVerify } from "./loginValidation";

async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

export default registerValidation;
