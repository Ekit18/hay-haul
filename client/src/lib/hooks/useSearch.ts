import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSearch = <T extends { [key: string]: any }>(query: string, items: T[], field: keyof T) => {
  const searchedItems = useMemo(() => {
    return items.filter((item) => item[field].toLowerCase().search(new RegExp(query.toLowerCase())) !== -1);
  }, [items, query, field]);
  return searchedItems;
};

export { useSearch };
