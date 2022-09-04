import { useMemo } from "react";
import "./styles.css";
import fibRange from "fibonacci-range";
import RT from "@yaireo/relative-time";
const relativeTime = new RT();

const now = Date.now();
const fib = fibRange(20);

const RelativeTime = ({ time }: { time: number }) => {
  return relativeTime.from(time);
};

const useRecentArticles = () =>
  useMemo(
    () =>
      new Array(10).fill(0).map((_, i) => ({
        title: "Article " + i,
        createdAt: now - 1000 * fib[i]
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
        title: "Comment " + i,
        createdAt: now - 1000 * fib[i]
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
