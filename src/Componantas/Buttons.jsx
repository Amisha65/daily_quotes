// Buttons.jsx (cleaned)
import { FaWhatsapp } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import css from "./Button.module.css";

const Buttons = ({ qoute = "", author = "" }) => {
  const webPageUrl = "https://daily-quotes-j8qw.vercel.app/";

  const openWindow = (url) =>
    window.open(url, "ShareWindow", "width=600,height=400");

  const whatsApp = () =>
    openWindow(
      `https://wa.me/?text=${encodeURIComponent(
        `${qoute}\n\n---by ${author}\n\nFor more Quotes:\n${webPageUrl}`
      )}`
    );

  const linkedin = () =>
    openWindow(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
        `${qoute}\n\n---by ${author}\n\nFor more Quotes:\n${webPageUrl}`
      )}`
    );

  const tweet = () =>
    openWindow(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${qoute}\n\n---by ${author}\n\nFor more Quotes:\n${webPageUrl}`
      )}`
    );

  return (
    <div className={`${css.shareButtond} d-flex gap-3`}>
      <button
        type="button"
        onClick={whatsApp}
        id={css.whatsApp}
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp />
      </button>

      <button
        type="button"
        onClick={linkedin}
        id={css.linkedin}
        aria-label="Share on LinkedIn"
      >
        <FaLinkedin />
      </button>

      <button
        type="button"
        onClick={tweet}
        id={css.tweet}
        aria-label="Share on X"
      >
        <FaSquareXTwitter />
      </button>
    </div>
  );
};

export default Buttons;
