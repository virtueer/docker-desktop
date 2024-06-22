import "./infinite-loading.css";

export default function InfiniteLoading({ width }: { width: string }) {
  return (
    <div className="loader" style={{ width }}>
      <div className="loaderBar"></div>
    </div>
  );
}
