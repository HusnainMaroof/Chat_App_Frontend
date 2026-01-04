import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authMe, login, reSendOTP, reSetPassLink, reSetPassword, signUp, updateProfile, verifyOTP, logoutMe } from "./authService";

const initialState = {
    // Stores the authenticated user object
    user: null,

    // Status states for all async operations
    signUpStates: { loading: false, error: false, success: false, result: null },
    loginStates: { loading: false, error: false, success: false, result: null },
    verifyOtpStates: { loading: false, error: false, success: false, result: null },
    ReSendOtpStates: { loading: false, error: false, success: false, result: null },
    // 💡 MISSING CASES WERE FOR THIS STATE OBJECT
    ReSetPasswrodStates: { loading: false, error: false, success: false, result: null },
    ReSetPassLinkStates: { loading: false, error: false, success: false, result: null },
    UpdateProfileStates: { loading: false, error: false, success: false, result: null },
    authMeStates: { loading: false, error: false, success: false, result: null },
    logoutStates: { loading: false, error: false, success: false, result: null },

}

// --- ASYNC THUNKS (Action Creators) ---

// SIGN UP
export const signUpFun = createAsyncThunk("auth/signUp", async (data, thunkAPI) => {
    try {
        return await signUp(data)

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

// Login
export const loginFun = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {

        // Assuming login returns the user data or token/session info
        return await login(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// verifyOTP
export const verifyOTPFun = createAsyncThunk("auth/verify_OTP", async (data, thunkAPI) => {
    try {
        return await verifyOTP(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// reSendOTP
export const reSendOTPFun = createAsyncThunk("auth/reSend_OTP", async (data, thunkAPI) => {
    try {
        return await reSendOTP(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// reSet Pass Link (Send reset email)
export const reSetPassLinkFun = createAsyncThunk("auth/reSet_Pass_Link", async (data, thunkAPI) => {
    try {
        return await reSetPassLink(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// reSet Password (Final step using link/token)
export const reSetPasswordFun = createAsyncThunk("auth/reSetPassword", async (data, thunkAPI) => {
    try {
        let password = data.password
        let Link = data.Link

        // Assuming reSetPassword service takes (password, link/token)
        return await reSetPassword(password, Link)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// authMe (Fetch current user details)
export const authMeFun = createAsyncThunk("auth/auth_Me", async (_, thunkAPI) => {
    try {
        // Assuming this returns the user object directly
        return await authMe()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})

// updateProfile
export const updateProfileFun = createAsyncThunk("auth/update_Profile", async (data, thunkAPI) => {
    try {
        return await updateProfile(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})
export const logoutFun = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        return await logoutMe()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
})


// --- AUTH SLICE ---

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        logout: (state) => {
            state.user = null;
            state.loginStates = { loading: false, error: false, success: false, result: null };
            state.authMeStates = { loading: false, error: false, success: false, result: null };
        },


        passLinkStatesReset: (state) => {
            state.ReSetPassLinkStates = { loading: false, error: false, success: false, result: null };
        },
        passwordReSetStates: (state) => {
            state.ReSetPasswrodStates = { loading: false, error: false, success: false, result: null };
        },
        signUpStatesReset: (state) => {
            state.signUpStates = { loading: false, error: false, success: false, result: null }
        },
        updateProfileStatesReset: (state) => {
            state.UpdateProfileStates = { loading: false, error: false, success: false, result: null }
        },
        resetAllStates: (state) => {
            state.ReSendOtpStates = { loading: false, error: false, success: false, result: null }
            state.ReSetPassLinkStates = { loading: false, error: false, success: false, result: null }
            state.ReSetPasswrodStates = { loading: false, error: false, success: false, result: null }
            state.UpdateProfileStates = { loading: false, error: false, success: false, result: null }
            state.authMeStates = { loading: false, error: false, success: false, result: null }
            state.loginStates = { loading: false, error: false, success: false, result: null }
            state.logoutStates = { loading: false, error: false, success: false, result: null }
            state.signUpStates = { loading: false, error: false, success: false, result: null }
            state.verifyOtpStates = { loading: false, error: false, success: false, result: null }
            state.user = null
        }

    },
    extraReducers: (bulider) => {

        bulider
            // SignUp
            .addCase(signUpFun.pending, (state) => {
                state.signUpStates.loading = true
            })
            .addCase(signUpFun.rejected, (state, action) => {
                state.signUpStates.loading = false
                state.signUpStates.error = true
                state.signUpStates.result = action.payload
            })
            .addCase(signUpFun.fulfilled, (state, action) => {
                state.signUpStates.loading = false
                state.signUpStates.error = false
                state.signUpStates.success = true
                state.signUpStates.result = action.payload
            })


            // Login
            .addCase(loginFun.pending, (state) => {
                state.loginStates.loading = true
            })
            .addCase(loginFun.rejected, (state, action) => {
                state.loginStates.loading = false
                state.loginStates.error = true
                state.loginStates.result = action.payload
            })
            .addCase(loginFun.fulfilled, (state, action) => {
                state.loginStates.loading = false
                state.loginStates.error = false
                state.loginStates.success = true
                state.loginStates.result = action.payload

            })

            // verifyOTP
            .addCase(verifyOTPFun.pending, (state) => {
                state.verifyOtpStates.loading = true
            })
            .addCase(verifyOTPFun.rejected, (state, action) => {
                state.verifyOtpStates.loading = false
                state.verifyOtpStates.error = true
                state.verifyOtpStates.result = action.payload
            })
            .addCase(verifyOTPFun.fulfilled, (state, action) => {
                state.verifyOtpStates.loading = false
                state.verifyOtpStates.error = false
                state.verifyOtpStates.success = true
                state.verifyOtpStates.result = action.payload
            })

            // reSendOTP
            .addCase(reSendOTPFun.pending, (state) => {
                state.ReSendOtpStates.loading = true
            })
            .addCase(reSendOTPFun.rejected, (state, action) => {
                state.ReSendOtpStates.loading = false
                state.ReSendOtpStates.error = true
                state.ReSendOtpStates.result = action.payload
            })
            .addCase(reSendOTPFun.fulfilled, (state, action) => {
                state.ReSendOtpStates.loading = false
                state.ReSendOtpStates.error = false
                state.ReSendOtpStates.success = true
                state.ReSendOtpStates.result = action.payload
            })


            // ReSet Password Link
            .addCase(reSetPassLinkFun.pending, (state) => {
                state.ReSetPassLinkStates.loading = true
            })
            .addCase(reSetPassLinkFun.rejected, (state, action) => {
                state.ReSetPassLinkStates.loading = false
                state.ReSetPassLinkStates.error = true
                state.ReSetPassLinkStates.result = action.payload
            })
            .addCase(reSetPassLinkFun.fulfilled, (state, action) => {
                state.ReSetPassLinkStates.loading = false
                state.ReSetPassLinkStates.error = false
                state.ReSetPassLinkStates.success = true
                state.ReSetPassLinkStates.result = action.payload
            })

            // ReSet Password
            .addCase(reSetPasswordFun.pending, (state) => {
                state.ReSetPasswrodStates.loading = true
            })
            .addCase(reSetPasswordFun.rejected, (state, action) => {
                state.ReSetPasswrodStates.loading = false
                state.ReSetPasswrodStates.error = true
                state.ReSetPasswrodStates.result = action.payload
            })
            .addCase(reSetPasswordFun.fulfilled, (state, action) => {
                state.ReSetPasswrodStates.loading = false
                state.ReSetPasswrodStates.error = false
                state.ReSetPasswrodStates.success = true
                state.ReSetPasswrodStates.result = action.payload
            })


            // authMe
            .addCase(authMeFun.pending, (state) => {
                state.authMeStates.loading = true
            })
            .addCase(authMeFun.rejected, (state, action) => {
                state.authMeStates.loading = false
                state.authMeStates.error = true
                state.authMeStates.result = action.payload
                // 💡 GOOD PRACTICE: Clear user on failed auth
                state.user = null;
            })
            .addCase(authMeFun.fulfilled, (state, action) => {
                state.authMeStates.loading = false
                state.authMeStates.error = false
                state.authMeStates.success = true
                state.authMeStates.result = action.payload
                state.user = action.payload
            })

            // updateProfile
            .addCase(updateProfileFun.pending, (state) => {
                state.UpdateProfileStates.loading = true
            })
            .addCase(updateProfileFun.rejected, (state, action) => {
                state.UpdateProfileStates.loading = false
                state.UpdateProfileStates.error = true
                state.UpdateProfileStates.result = action.payload
            })
            .addCase(updateProfileFun.fulfilled, (state, action) => {
                state.UpdateProfileStates.loading = false
                state.UpdateProfileStates.error = false
                state.UpdateProfileStates.success = true
                state.UpdateProfileStates.result = action.payload

            })
            // logout cases
            .addCase(logoutFun.pending, (state) => {
                state.logoutStates.loading = true
            })
            .addCase(logoutFun.rejected, (state, action) => {
                state.logoutStates.loading = false
                state.logoutStates.error = true
                state.logoutStates.result = action.payload
            })
            .addCase(logoutFun.fulfilled, (state, action) => {
                state.logoutStates.loading = false
                state.logoutStates.error = false
                state.logoutStates.success = true
                state.logoutStates.result = action.payload

            })

    }
})

// Export the synchronous actions defined in `reducers`
export const { passLinkStatesReset, logout, passwordReSetStates, signUpStatesReset, updateProfileStatesReset, resetAllStates } = authSlice.actions;

export default authSlice.reducer