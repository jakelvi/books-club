import toast from "react-hot-toast";

function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email is required...!");
  } else if (values.email.includes(" ") || !values.email.includes("@")) {
    error.email = toast.error("Invalid email format. Please try again...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address. Please try again...!");
  }
}

export default emailVerify;
