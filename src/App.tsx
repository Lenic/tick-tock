import type { FC } from 'react';

import RT from '@yaireo/relative-time';
import fibRange from 'fibonacci-range';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import './styles.css';
import { resigter } from './utils';

const now = Date.now();
const fib = fibRange(20);
const relativeTime = new RT();

const RelativeTimeLogic: FC<{ time: number }> = ({ time }) => {
  const getValue = useCallback(() => relativeTime.from(new Date(time)), [time]);

  const [value, setValue] = useState(getValue);

  useEffect(() => resigter(time, () => setValue(getValue())), [getValue, time]);

  return <>{value}</>;
};
const RelativeTime = memo(RelativeTimeLogic);

const useRecentArticles = () =>
  useMemo(
    () =>
      new Array(10).fill(0).map((_, i) => ({
        title: 'Article ' + i,
        createdAt: now - 1000 * fib[i],
      })),
    []
  );

const RecentArticles = () => {
  const ariticles = useRecentArticles();
  return (
    <>
      <h2>Recent articles</h2>
      <ul>
        {ariticles.map((article) => (
          <li key={article.title}>
            {article.title}, <RelativeTime time={article.createdAt} />
          </li>
        ))}
      </ul>
    </>
  );
};

const useRecentComments = () =>
  useMemo(
    () =>
      new Array(20).fill(0).map((_, i) => ({
        title: 'Comment ' + i,
        createdAt: now - 1000 * fib[i],
      })),
    []
  );

const RecentComments = () => {
  const comments = useRecentComments();
  return (
    <>
      <h2>Recent comments</h2>
      <ul>
        {comments.map((article) => (
          <li key={article.title}>
            {article.title}, <RelativeTime time={article.createdAt} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>My blog</h1>
      <RecentArticles />
      <RecentComments />
    </div>
  );
}
