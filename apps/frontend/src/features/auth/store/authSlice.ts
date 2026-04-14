import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import  { ApolloError } from '@apollo/client';


import type { User, AuthState } from '../../../core/auth/types';
import { apolloClient, resetApolloStore } from '../../../core/api';
import {
  clearAuthStorage,
  clearTokens,
  getStoredUser,
  hasValidTokens,
  setStoredUser,
  setTokens,
} from '../../../core/auth/token';
import { LOGIN_MUTATION, LOGOUT_MUTATION, SIGNUP_MUTATION } from '../api';
import type { SignupFormData } from '../types';

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthMutationResponse {
  login?: AuthPayload;
  signUp?: AuthPayload;
}

export interface AuthSliceState extends AuthState {
  signupDraft: SignupFormData;
}

const emptySignupDraft: SignupFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  accountType: 'CANDIDATE'
};

export const initializeAuth = createAsyncThunk<User | null>('auth/initializeAuth', async () => {
  if (!hasValidTokens()) {
    clearAuthStorage();
    return null;
  }

  const storedUser = getStoredUser<User>();
  return storedUser ?? null;
});

export const loginThunk = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data, errors } = await apolloClient.mutate<AuthMutationResponse>({
        mutation: LOGIN_MUTATION,
        variables: { input: credentials },
      }); 

      if (errors?.length) {
        return rejectWithValue(errors[0]?.message ?? 'Login failed');
      }

      if (!data?.login) {
        return rejectWithValue('Login failed');
      }
  

      const { accessToken, refreshToken, user } = data.login;
      setTokens(accessToken, refreshToken);
      setStoredUser(user);
      return user;
    } catch (error) {

      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        return rejectWithValue(error.graphQLErrors[0]?.message ?? 'Login failed');
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);
 
export const signupThunk = createAsyncThunk<
  User,
  { email: string; password: string; firstName: string; lastName: string },
  { rejectValue: string }
>('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const normalizedPayload = normalizeSignupInputs(payload as SignupFormData);

    const { data, errors } = await apolloClient.mutate<AuthMutationResponse>({
      mutation: SIGNUP_MUTATION,
      variables: { input: normalizedPayload },
    });

    if (errors?.length) {
      return rejectWithValue(errors[0]?.message ?? 'Signup failed');
    }

    if (!data?.signUp) {
      return rejectWithValue('Signup failed');
    }

    const { accessToken, refreshToken, user } = data.signUp;
    setTokens(accessToken, refreshToken);
    setStoredUser(user);
    return user;
  } catch (error) {
    if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
      return rejectWithValue(error.graphQLErrors[0]?.message ?? 'Signup failed');
    }

    return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
  }
});

function normalizeSignupInputs(payload: SignupFormData) {
  const { confirmPassword, ...rest } = payload;

  return  rest;
}

export const logoutThunk = createAsyncThunk<void>('auth/logout', async () => {
  try {
    await apolloClient.mutate({ mutation: LOGOUT_MUTATION });
  } catch (error) {
    // Logout should still clear local auth state even if API call fails.
    console.error('Logout mutation failed:', error);
  } finally {
    clearTokens();
    await resetApolloStore();
  }
});

const initialState: AuthSliceState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: true,
  error: null,
  signupDraft: emptySignupDraft,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitializing = false;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isInitializing = false;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.isLoading = false;
      state.error = null;
    },
    setSignupDraft: (state, action: PayloadAction<Partial<SignupFormData>>) => {
      state.signupDraft = { ...state.signupDraft, ...action.payload };
    },
    resetSignupDraft: (state) => {
      state.signupDraft = emptySignupDraft;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitializing = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed3';
      })
      .addCase(signupThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.signupDraft = emptySignupDraft;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload ?? 'Signup failed';
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setLoading, setUser, setError, clearAuth, setSignupDraft, resetSignupDraft } = authSlice.actions;
export default authSlice.reducer;
