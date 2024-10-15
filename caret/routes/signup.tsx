import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import { Button, TextField, Box, Typography, FormControl, IconButton, Link} from "@material-ui/core";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
    });
    const handleBack = () => {
        navigate("/");
    };
    const handleSignup = async () => {
        if (email && username && password) {
            const data = { username, email, password };
            console.log(data);
            await axios
                .post("http://localhost:8000/users/", data)
                .then(function (response) {
                    console.log(response.data.token, "response.data.token");
                    storage.set("access_token", response.data.token);
                    console.log("stored");
                    navigate("/");
                })
                .catch(function (error) {
                    console.log(error, "error");
                });
        } else {
            alert("Please ensure all fields are filled out");
        }
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 320, height: 400, padding: 20 }}>
            <Box sx={{ display: "flex", justifyContent: "left" }}>
                <IconButton
                    aria-label="back" color="primary" className="back" size="small" onClick={handleBack}>
                </IconButton>
            </Box>
            <FormControl variant="standard" fullWidth>
                <Box>
                    <Typography component="h1"> Create Your Caret Account!
                    </Typography>
                    <TextField fullWidth
                        id="email"
                        label="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField fullWidth
                        id="username"
                        label="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField fullWidth
                        id="password"
                        label="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Box>
                    <Button
                        onClick={handleSignup}
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
                    </Button>
                </Box>
            </FormControl>
            <Link
								component="button"
								variant="body2"
								onClick={handleBack}
						>
								Back to login
						</Link>
        </Box>
    );
};
