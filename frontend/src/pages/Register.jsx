import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Form.css"
import LoadingIndicator from "../components/LoadingIndicator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import ReCAPTCHA from 'react-google-recaptcha';

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
    const [reCaptchaToken, setReCaptchaToken] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        setLoading(true);
        try {
            if (!reCaptchaToken) {
                alert("Perform reCAPTCHA check!")
            }
            else {
                await api.post("api/user/register/", { last_name, first_name, username, email, password })
                navigate("/login")
            }
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

    const handleRecaptchaChange = (value) => {
        setReCaptchaToken(value);
    };

    return (
        <body>
            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
                <h1>Înregistrare</h1>
                <div className = "form-input">
                    <TextField
                        label="Nume de familie"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("last_name", {
                            required: "Introduceți numele de familie",
                        })}
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.last_name}
                        helperText={errors.last_name ? errors.last_name.message : formerrors.last_name}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Prenume"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("first_name", {
                            required: "Introduceți prenumele",
                        })}
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.first_name}
                        helperText={errors.first_name ? errors.first_name.message : formerrors.first_name}
                    />
                </div>
                <div className = "form-input">
                    <TextField
                        label="Nume de utilizator"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("username", {
                            required: "Introduceți numele de utilizator",
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
                            required: "Introduceți adresa de email",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Introduceți o adresă de email validă (exemplu@gmail.com)",
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
                        label="Parolaa"
                        type="password"
                        variant="outlined"
                        inputProps={{style: {fontSize: 14}}}
                        InputLabelProps={{style: {fontSize: 14}}}
                        fullWidth
                        {...register("password", {
                            required: "Introduceți parola",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "Parola trebuie să îndeplinească următoarele cerințe: minim 8 caractere, cel puțin o majusculă, cel puțin o literă mică, cel puțin o cifră și cel puțin un carcater special",
                            },
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : formerrors.password}
                    />
                </div>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_OASIS_SITE_KEY}
                    onChange={handleRecaptchaChange}
                />
                {loading && <LoadingIndicator />}
                <Button style={{marginTop: 15}} type="submit" variant="contained" color="secondary">
                    Înregistrare
                </Button>
                <Link to="/login" variant="body2" style={{margin: 15}}>
                    Aveți deja un cont? Autentificați-vă!
                </Link>
            </form>
        </body>
    );
}

export default Register