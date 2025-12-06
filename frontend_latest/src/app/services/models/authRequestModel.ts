/**
 * model for auth requests
 */
export interface AuthRequestModel<T> {
    data: {
        attributes: T,
        type: 'user'
    };
}
