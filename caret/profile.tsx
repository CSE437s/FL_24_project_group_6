import { useState } from "react" 
import React from "react";
import { Button } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
    userName: string;
}

const Profile: React.FC<ProfileProps> = ({ userName }) => {
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/home");
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Profile</h1>
                <Button variant="contained" color="primary" onClick={handleHomeClick}>
                    Home
                </Button>
            </div>
            <h2>{userName}</h2>
            <div>
                <ToggleButton
                    value="check"
                    selected={toggle1}
                    onChange={() => setToggle1(!toggle1)}
                >
                    Toggle 1
                </ToggleButton>
                <ToggleButton
                    value="check"
                    selected={toggle2}
                    onChange={() => setToggle2(!toggle2)}
                >
                    Toggle 2
                </ToggleButton>
            </div>
            <Button
                variant="contained"
                color="secondary"
                onClick={function (): void{}}
                style={{ marginTop: "20px" }}
            >
                Delete Account
            </Button>
        </div>
    );
};

export default Profile;