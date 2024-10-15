import React from "react";
import { useState } from "react";
import { Storage } from "@plasmohq/storage";
import { fetch_token, get_me } from "~api";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Link, FormControl } from "@material-ui/core";

export const Login = ({setUser, setIsLoggedIn }) => {
		const [username, setUsername] = useState("");
		const [password, setPassword] = useState("");
		const navigate = useNavigate();
		const storage = new Storage({
				copiedKeyList: ["shield-modulation"],
		});
		const handleLogin = async () => {
				try {
						let response = await fetch_token(username, password);
						let token = response.data["access_token"];
						await storage.set("access_token", token);
						await storage.set("username", username);
						console.log("stored");
						setUser(username);
						setIsLoggedIn(true)
						navigate("/profile");
				} catch {
						console.log("log in error");
				}
		};
		const handleSignUpClick = () => {
				navigate("/signup");
		};
		const handleForgotClick = () => {
			navigate("/request_email_reset")
		}
		return (
				<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 320, height: 400, padding: 20 }}>
						<Box>
								<Typography component="h1" color="secondary"> Welcome to Caret
								</Typography>
								<Typography component="h2"> Comments for the Internet!
								</Typography>
						</Box>
						<FormControl variant="standard" fullWidth>
								<Box sx={{ margin: 2, display: "flex", flexDirection: "column" }}>
										<TextField fullWidth
												id="username"
												label="Username"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												variant="outlined"
												margin="normal"
										/>

										<TextField fullWidth
												id="password"
												label="Password"
												type="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												variant="outlined"
												margin="normal"
										/>
										<Box>
												<Button fullWidth
														onClick={handleLogin}
														variant="contained"
														color="primary"
												>
														Login
												</Button>
										</Box>
								</Box>
						</FormControl>
						<Link
								component="button"
								variant="body2"
								onClick={handleForgotClick}
						>
								Forgot Password?
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
