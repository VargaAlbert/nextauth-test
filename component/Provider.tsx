"use client"

import { SessionProvider } from "next-auth/react";
import { createContext, useContext } from "react"

const AuthContext = createContext