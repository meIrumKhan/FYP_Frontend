import * as Yup from "yup";

export const SignInSchema = Yup.object({
  email: Yup.string().email().required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});


export const LocationSchema = Yup.object({
  city: Yup.string().required("City is Required"),
  country: Yup.string().required("Country is Required"),
});



export const SignUpShema = Yup.object({
  name : Yup.string().required("Name is Required"),
  email: Yup.string().email().required("Email is Required"),
  password: Yup.string().required("Password is Required"),
  phno: Yup.string()
    .matches(/^\d{10,}$/, "Phone number must be at least 12 digits.")
    .required("Phone number is required."),
});



export const RouteSchema = Yup.object({
  origin:  Yup.string().required("Origin is Required"),
  destination: Yup.string().required("Destination is Required"),
  duration: Yup.string().required("Duration is Required"),
  distance: Yup.number().positive().required("Distance is Required"),
});

export const AirlineSchema = Yup.object({
  
  airline:  Yup.string().required("Airline name is Required"),
  code:  Yup.string().required("Airline code is Required"), //PIA
});

export const FlightsSchema = Yup.object({
  airline:  Yup.string().required("Airline name is Required"),
  route:  Yup.string().required("Route is Required"), 
  flightNumber:  Yup.string().required("flight no is Required"), 
  departureTime:  Yup.string().required("departure time is Required"), 
  departureDate:  Yup.string().required("departure date is Required"), 
  total:  Yup.number().positive().required("Total seats is Required"),
  price:  Yup.number().positive().required("Price is Required"),
});




