// Loading.jsx (cleaned)
import css from "./Button.module.css";

const Loading = () => (
  <div
    className={`d-flex justify-content-center ${css.spinner}`}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div
      className="spinner-border text-primary"
      style={{ width: "4rem", height: "4rem" }}
      aria-hidden="true"
    />
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default Loading;
