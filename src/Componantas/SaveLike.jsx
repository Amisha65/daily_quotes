import { GoHeartFill } from "react-icons/go";
import { TbBrandAppgallery } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import css from "./Home.module.css";

const SaveLike = ({
  onToggleLike,
  setToShowSaved,
  toShowSaved,
  red,
  isLoggedIn,
  requestAuth,
  onRequestSavedView,
}) => {
  // Saved section icon handler
  const handleToShowSaved = () => {
    if (!isLoggedIn) {
      onRequestSavedView();
      return;
    }
    setToShowSaved(true);
  };

  // Back arrow handler
  const handleGoBack = () => {
    setToShowSaved(false);
  };

  // Heart click handler
  const handleHeartClick = () => {
    if (typeof onToggleLike === "function") {
      onToggleLike();
    }

    if (!isLoggedIn) {
      requestAuth();
    }
  };

  return (
    <div
      className={css.topRightIcons}
      role="toolbar"
      aria-label="Quote actions"
    >
      {!toShowSaved ? (
        <>
          <TbBrandAppgallery
            className={css.icon}
            onClick={handleToShowSaved}
            title="View saved quotes"
            role="button"
          />

          <GoHeartFill
            className={css.icon}
            onClick={handleHeartClick}
            style={{
              color: red ? "rgba(223, 19, 19, 0.948)" : "rgb(161, 157, 157)",
            }}
            title={red ? "Unlike" : "Like"}
            aria-pressed={!!red}
          />
        </>
      ) : (
        <IoIosArrowBack
          className={css.icon}
          onClick={handleGoBack}
          title="Back to quote"
          role="button"
        />
      )}
    </div>
  );
};

export default SaveLike;
