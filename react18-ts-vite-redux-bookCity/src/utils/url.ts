import queryString from 'query-string';

// 添加url参数
export const setUrlParams = (params: [string, string][], basePath = '/') => {
  if (!Array.isArray(params) || params.length === 0) return;

  const qs = queryString.parse(window.location.search);
  params.forEach((param) => {
    qs[param[0]] = param[1];
  });

  window.history.replaceState(null, '', `${basePath}?${queryString.stringify(qs)}`);
};

// 删除url参数
// params: ['a', 'b'],要删除对象里面的key值
export const removeUrlParams = (params: string[], basePath = '/') => {
  if (!Array.isArray(params) || params.length === 0) return;

  const qs = queryString.parse(window.location.search);

  params.forEach((param) => {
    delete qs[param];
  });

  const str = queryString.stringify(qs);

  window.history.replaceState(null, '', str ? `${basePath}?${str}` : basePath);
};
