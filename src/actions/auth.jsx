import authService from "src/services/auth.service";

import {
    LOGOUT,
    LOGIN_FAIL,
    SET_MESSAGE,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    REGISTER_SUCCESS,
} from "./types";





export const logout = () => (dispatch) => {
    authService.logout();
    dispatch({
        type: LOGOUT,
    });
};



export const register = (first_name, last_name, email, password) => dispatch => authService.register(first_name,
    last_name, email, password).then(
        (data) => {

            dispatch({
                type: REGISTER_SUCCESS

            });
            return Promise.resolve()
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.detail) ||
                error.message ||
                error.toString();
            dispatch({
                type: REGISTER_FAIL,
            });
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )

export const login = (email, password) => dispatch => authService.login(email, password).then(
    (data) => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { user: data },
        });
        return Promise.resolve()
    },
    (error) => {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.detail) ||
            error.message ||
            error.toString();
        dispatch({
            type: LOGIN_FAIL,
        });
        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });

        return Promise.reject();
    }
)
