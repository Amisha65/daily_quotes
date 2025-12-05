// QouteBody.jsx — cleaned (overwrite)
import Loading from "./Loading";
import Buttons from "./Buttons";
import css from "./Home.module.css";

const QouteBody = ({
  fetching = false,
  handleShareButton = () => {},
  showButton = false,
  qoute = "",
  author = "",
  handeleNewQoute = () => {},
}) => {
  return (
    <>
      <div className={`col-12 d-flex justify-content-center ${css.heading}`}>
        <h1 className="mt-3">Quote of the Day</h1>
      </div>

      <div className="col-12 quoteText pt-3">
        <blockquote id={css.qoute} aria-live="polite">
          <span>{fetching ? <Loading /> : qoute}</span>
        </blockquote>

        <p id={css.author} aria-label={`Author: ${author}`}>
          {author}
        </p>
      </div>

      <div className={`col-12 d-flex justify-content-center gap-4 pt-4`}>
        <span className={`${css.quoteButtons}`}>
          <button
            id={css.newQoute}
            onClick={handeleNewQoute}
            disabled={fetching}
            aria-disabled={fetching}
            aria-label="Get a new quote"
          >
            {fetching ? "Loading..." : "New Quote"}
          </button>
        </span>

        {!showButton ? (
          <button
            onClick={handleShareButton}
            className={`${css.homeShareButtond}`}
            aria-label="Open share options"
          >
            Share
          </button>
        ) : (
          <Buttons qoute={qoute} author={author} />
        )}
      </div>
    </>
  );
};

export default QouteBody;
