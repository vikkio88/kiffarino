export type RouteParams<T> = {
  result: {
    path: {
      params: T;
    };
  };
};

export function getParam<T extends object, K extends keyof T>(
  route: RouteParams<T>,
  key: K
): T[K] | undefined {
  return route.result.path.params[key];
}
