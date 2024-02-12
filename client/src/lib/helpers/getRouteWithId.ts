export const getRouteWithId = (route: string, id: number) => {
  return route.replace(':id', String(id));
};
