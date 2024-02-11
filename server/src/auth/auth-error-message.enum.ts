export enum AuthErrorMessage {
  WrongPassEmail = 'Wrong password or email',
  UserWithEmailAlreadyExists = 'User with this email already exists',
  UserNotFound = 'User not found',
  UserNotAuthorized = 'User is not authorized',
  NoRefreshToken = 'No refresh token',
  RefreshTokenExpired = 'Refresh token expired',
}
