import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),


  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),

  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Required"),
});
export const signinSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

export const addResortSchema = Yup.object().shape({
  name: Yup.string()
    .required("Resort name is required"),
  location: Yup.string()
    .required("Location is required"),
  description: Yup.string()
    .required("Description is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  facilities: Yup.string()
    .matches(/^([a-zA-Z0-9]+)(,\s?[a-zA-Z0-9]+)*$/, "Valid format (e.g., f1,f2,f3)")
    .required("Facilities are required"),
});


export const updateResortSchema = Yup.object().shape({
  name: Yup.string()
    .required("Resort name is required"),
  location: Yup.string()
    .required("Location is required"),
  description: Yup.string()
    .required("Description is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  facilities: Yup.string()
    .matches(/^([a-zA-Z0-9]+)(,\s?[a-zA-Z0-9]+)*$/, "Valid format (e.g., f1,f2,f3)")
    .required("Facilities are required"),
});


export const addResortImgSchema = Yup.object().shape({

  resortImgUrl: Yup.mixed()
    .nullable()
    .test("fileSize", "Image size must be less than 2MB", (value) => {
      if (!value) return true; // image is optional
      return value.size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Only JPG, PNG, or JPEG allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});




export const bookingSchema = Yup.object({
  guestName: Yup.string()
    .min(2, "Guest name is too short")
    .required("Guest name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  numOfPersons: Yup.number()
    .typeError("Must be a number")
    .min(1, "At least 1 person is required")
    .required("Number of persons is required"),

  numOfDays: Yup.number()
    .typeError("Must be a number")
    .min(1, "Minimum 1 day stay required")
    .required("Number of days is required"),

  checkInDate: Yup.string()
    .required("Check-in date is required"),
});

export const userUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!") 
    .max(50, "Too Long!")
    .required("Required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Required"),
});
