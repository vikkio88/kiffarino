export type RouteParams<T> = {
  result: {
    path: {
      params: T;
    };
  };
};

export type QueryParams<T> = {
  result: {
    querystring: {
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
export function getQueryParam<T extends object, K extends keyof T>(
  route: QueryParams<T>,
  key: K
): T[K] | undefined {
  return route.result.querystring.params[key];
}
