import { Route, Routes } from "react-router-dom"

import {Login} from "./login"
import {Home} from "./home"
import {Profile} from "./profile"
import {Signup} from "./signup"

export const Routing = () => (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  )