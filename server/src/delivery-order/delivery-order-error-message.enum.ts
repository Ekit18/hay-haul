export enum DeliveryOrderErrorMessage {
  YouCannotCreateNotYourDeliveryOrder = 'You cannot create a delivery order for auction that is not yours',
  FailedToGetOrders = 'Failed to get orders',
  FailedToGetOrder = 'Failed to get order',
  UnauthorizedDeleteDeliveryOrder = 'You are not authorized to delete this delivery order',
  CannotDeleteActiveDeliveryOrder = 'You cannot delete an active delivery order',
  FailedToDeleteDeliveryOrder = 'Failed to delete delivery order',
  FailedToStartDeliveryOrder = 'Failed to start delivery order',
  CannotStartActiveDeliveryOrder = 'You cannot start an active delivery order',
  UnauthorizedStartDeliveryOrder = 'You are not authorized to start this delivery order',
  FailedToUpdateDeliveryOrder = 'Failed to update delivery order',
  CannotUpdateActiveDeliveryOrder = 'You cannot update an active delivery order',
  UnauthorizedUpdateDeliveryOrder = 'You are not authorized to update this delivery order',
}
