export interface UnreadNotificationsResponse {
  data: any[];
  count: number;
}

export type NotificationsQuery = {
  limit?: number;
  offset?: number;
};

export type NotificationsListResponse = {
  data: any[];
  count: number;
};
