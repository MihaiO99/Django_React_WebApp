import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Form.css"
import LoadingIndicator from "../components/LoadingIndicator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
// import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [formerrors, setErrors] = useState({});
    // const [reCaptchaToken, setReCaptchaToken] = useState("");
    const navigate = useNavigate();
    // const recaptchaRef = React.createRef();

    const onSubmit = async (e) => {
        setLoading(true);
        try {
            await api.post("api/user/register/", { first_name, last_name, username, email, password })
            navigate("/login")
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                setEmail("");
                setUsername("");
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <body>
            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
                <h1>Register</h1>
                <div className = "form-input">
                    <TextField
                        label="First Name"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("first_name", {
                            required: "First name is required",
                        })}
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.first_name}
                        helperText={errors.first_name ? errors.first_name.message : formerrors.first_name}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("last_name", {
                            required: "Last name is required",
                        })}
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.last_name}
                        helperText={errors.last_name ? errors.last_name.message : formerrors.last_name}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Username"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("username", {
                            required: "Username is required",
                        })}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!errors.username}
                        helperText={errors.username ? errors.username.message : formerrors.username}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Email"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address",
                            },
                        })}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : formerrors.email}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("password", {
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                                message: "Password must have the following requirements: minimum 8 characters, at least one uppercase, at least one lowercase and at least one digit",
                            },
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : formerrors.password}
                    />
                </div>
                {/* <ReCAPTCHA 
                    ref = {recaptchaRef}
                    sitekey={import.meta.env.VITE_OASIS_SITE_KEY}
                    onChange={(e) => setReCaptchaToken(e.target.value)}
                /> */}
                {errors.recaptcha && <p>{errors.recaptcha}</p>}
                {loading && <LoadingIndicator />}
                <Button style={{marginTop: 15}} type="submit" variant="contained" color="secondary">
                    Register
                </Button>
                <Link to="/login" variant="body2" style={{margin: 15}}>
                    Already have an accound? Sing in!
                </Link>
            </form>
        </body>
    );
}

export default Register