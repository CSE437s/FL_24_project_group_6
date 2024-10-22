import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Link, FormControl } from "@mui/material";
import { reset_password } from "~api";
import { Storage } from "@plasmohq/storage"


export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        // Replace with your reset password logic
        try {
            // Example API call to reset password with token
            const response = await reset_password(email, newPassword, token)
            const storage = new Storage({
                copiedKeyList: ["shield-modulation"], 
              })
            await storage.set("awaiting_reset", false);
            navigate("/"); // Navigate to login page after successful reset
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    };

    const handleLoginClick = async () => {
        const storage = new Storage({
            copiedKeyList: ["shield-modulation"], 
          })
        await storage.set("awaiting_reset", false);
        navigate("/"); // Navigate to login page
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 320, height: 400, padding: 20 }}>
            <Box>
                <Typography component="h1" color="secondary"> Reset Your Password
                </Typography>
                <Typography component="h2"> Enter your email, new password, and the token received.
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
                    <TextField
                        fullWidth
                        id="new-password"
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        id="token"
                        label="Reset Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
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
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            </FormControl>
            <Link
                component="button"
                variant="body2"
                onClick={handleLoginClick}
            >
                Back to login
            </Link>
            
        </Box>
    );
};
