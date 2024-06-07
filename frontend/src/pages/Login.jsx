import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "../components/LoadingIndicator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm} from "react-hook-form";

function Login() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [formerrors, setErrors] = useState({});
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        setLoading(true);
        try {
            const res = await api.post("/api/token/", { username, password })
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/")
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
            setUsername("");
            setPassword("");
        } finally {
            setLoading(false)
        }
    };

    return (
        <body>
            <form style ={{marginTop: 150}} onSubmit={handleSubmit(onSubmit)} className="form-container">
                <h1>Login</h1>
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
                                message: "Password must met the following requirements:\n- minimum 8 characters\n- at least one uppercase\n- at least one lowercase\n- at least one digit",
                            },
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : formerrors.password}
                    />
                </div>
                {loading && <LoadingIndicator />}
                <Button style={{marginTop: 15}} type="submit" variant="contained" color="secondary">
                    Login
                </Button>
                <Link to="/register" variant="body2" style={{margin: 15}}>
                    Don't have an account? Register here!
                </Link>
            </form>
        </body>
    );
}

export default Login