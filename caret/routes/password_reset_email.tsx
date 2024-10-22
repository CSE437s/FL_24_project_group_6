import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Link, FormControl } from "@mui/material";
import { request_password_reset } from "~api";
import { Storage } from "@plasmohq/storage"


export const EmailPasswordReset = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        // Replace with your reset password logic
        try {
            const result = await request_password_reset(email);

            console.log("Password reset email sent");
            // You can add a success message here or navigate to another page
            navigate("/reset_password");
            const storage = new Storage({
                copiedKeyList: ["shield-modulation"], 
              })
            await storage.set("awaiting_reset", true);
        } catch (error) {
            console.error("Error sending password reset email:", error);
        }
    };

    const handleLoginClick = () => {
        navigate("/"); // Navigate to login page
    };

    const handleSignUpClick = () => {
        navigate("/signup"); // Navigate to signup page
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 320, height: 400, padding: 20 }}>
            <Box>
                <Typography component="h1" color="secondary"> Reset Your Password
                </Typography>
                <Typography component="h2"> Enter your email address to reset your password.
                </Typography>
            </Box>
            <FormControl variant="standard" fullWidth>
                <Box sx={{ margin: 2, display: "flex", flexDirection: "column" }}>
                    <TextField
                        fullWidth
                        id="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <Box>
                        <Button
                            fullWidth
                            onClick={handleResetPassword}
                            variant="contained"
                            color="primary"
                        >
                            Send Reset Email
                        </Button>
                    </Box>
                </Box>
            </FormControl>
            <Link
                component="button"
                variant="body2"
                onClick={handleLoginClick}
            >
                Back to Login
            </Link>
            <Link
                component="button"
                variant="body2"
                onClick={handleSignUpClick}
            >
                Don't have an account? Sign Up
            </Link>
        </Box>
    );
};
