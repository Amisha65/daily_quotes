// src/Componantas/Home.jsx
import { useEffect, useState, useRef } from "react";
import css from "./Home.module.css";
import SaveLike from "./SaveLike";
import QouteBody from "./QouteBody";
import QuoteSave from "./QuoteSave";
import AuthModal from "./AuthModal";
import { isLoggedIn, getUser, clearToken, authFetch } from "../auth";

const Home = () => {
  const [fetching, setFetching] = useState(false);
  const [qoute, setQoute] = useState("");
  const [author, setAuthor] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [toShowSaved, setToShowSaved] = useState(false);

  const [red, setRed] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());
  const [showAuth, setShowAuth] = useState(false);

  const [pendingSave, setPendingSave] = useState(false);
  const [pendingViewSaved, setPendingViewSaved] = useState(false);

  const qouteRef = useRef(qoute);
  useEffect(() => {
    qouteRef.current = qoute;
  }, [qoute]);

  // FETCH RANDOM QUOTE
  const handeleNewQoute = async () => {
    setFetching(true);
    setShowButton(false);

    try {
      const response = await fetch("https://thequoteshub.com/api/random-quote");

      if (!response.ok) {
        setQoute("Could not load a quote — try again.");
        setAuthor("");
        return;
      }

      const data = await response.json();

      if (!data || !data.text) {
        setQoute("No quote received — please try again.");
        setAuthor("");
        return;
      }

      if (data.text.length > 500) {
        setQoute(data.text.slice(0, 500) + "...");
      } else {
        setQoute(data.text);
      }

      setAuthor(data.author || "Unknown");
      checkIfSaved(data.text);
    } catch {
      setQoute("Network error while loading quote.");
      setAuthor("");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    handeleNewQoute();
  }, []);

  const handleShareButton = () => setShowButton(true);

  // Listen for deletion from saved section
  useEffect(() => {
    const onQuoteDeleted = (e) => {
      try {
        const deletedQuoteText = e?.detail?.qoute;
        const deletedId = e?.detail?.id;

        if (deletedId && savedId && deletedId === savedId) {
          setSavedId(null);
          setRed(false);
          return;
        }

        if (deletedQuoteText && qouteRef.current) {
          if (deletedQuoteText.trim() === qouteRef.current.trim()) {
            setSavedId(null);
            setRed(false);
          }
        }
      } catch {}
    };

    window.addEventListener("quoteDeleted", onQuoteDeleted);
    return () => window.removeEventListener("quoteDeleted", onQuoteDeleted);
  }, [savedId]);

  // CHECK IF SAVED
  const checkIfSaved = async (quoteText) => {
    try {
      if (!quoteText || !loggedIn) {
        setSavedId(null);
        setRed(false);
        return;
      }

      const res = await authFetch("/api/quotes");
      if (!res.ok) {
        setSavedId(null);
        setRed(false);
        return;
      }

      const list = await res.json();
      const found = list.find((item) => item.qoute === quoteText);

      if (found) {
        setSavedId(found._id);
        setRed(true);
      } else {
        setSavedId(null);
        setRed(false);
      }
    } catch {
      setSavedId(null);
      setRed(false);
    }
  };

  // SAVE QUOTE
  const saveQuoteToServer = async (force = false) => {
    if (!qoute) return null;
    if (!loggedIn && !force) return null;

    try {
      const res = await authFetch("/api/quotes", {
        method: "POST",
        body: JSON.stringify({ qoute, author }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok) return null;

      if (data && data._id) {
        setSavedId(data._id);
        setRed(true);
        window.dispatchEvent(new Event("quotesUpdated"));
        return data;
      }

      return null;
    } catch {
      return null;
    }
  };

  // DELETE QUOTE
  const deleteQuote = async (id, quoteText) => {
    if (!id) return false;

    try {
      const res = await authFetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (!res.ok) return false;

      window.dispatchEvent(
        new CustomEvent("quoteDeleted", { detail: { qoute: quoteText, id } })
      );

      return true;
    } catch {
      return false;
    }
  };

  // HEART CLICK
  const toggleHnadler = () => {
    if (!loggedIn) {
      setPendingSave(true);
      requestAuth();
      return;
    }

    // UNLIKE
    if (red) {
      const oldId = savedId;
      setRed(false);
      setSavedId(null);

      (async () => {
        const ok = await deleteQuote(oldId, qouteRef.current);
        if (!ok) {
          setRed(true);
          setSavedId(oldId);
        }
      })();

      return;
    }

    // LIKE (optimistic)
    setRed(true);

    (async () => {
      const saved = await saveQuoteToServer();
      if (!saved || !saved._id) {
        setRed(false);
        alert("Could not save quote. Try again.");
      }
    })();
  };

  // LOGIN SUCCESS
  const handleAuthSuccess = async (user) => {
    setLoggedIn(true);
    setUser(user);
    setShowAuth(false);

    // Case: user clicked saved icon before login
    if (pendingViewSaved) {
      setPendingViewSaved(false);
      setToShowSaved(true);
      return;
    }

    // Case: user clicked heart before login
    if (pendingSave) {
      setPendingSave(false);
      const saved = await saveQuoteToServer(true);
      if (saved && saved._id) {
        setSavedId(saved._id);
        setRed(true);
      } else {
        alert("Could not save quote after login.");
      }
    }
  };

  const handleAuthCancel = () => {
    setShowAuth(false);
    setPendingSave(false);
    setPendingViewSaved(false);
  };

  // SAVED SECTION ICON CLICK
  const handleSavedIconClick = () => {
    if (!loggedIn) {
      setPendingViewSaved(true);
      requestAuth();
      return;
    }
    setToShowSaved(true);
  };

  // LOGOUT
  const logout = () => {
    clearToken();
    setLoggedIn(false);
    setUser(null);
    setSavedId(null);
    setRed(false);
    setToShowSaved(false);
    setShowAuth(false);
    setPendingSave(false);
    setPendingViewSaved(false);
  };

  const requestAuth = () => setShowAuth(true);

  // UI
  return (
    <div className={`${css.mainContainer} container-fluid`}>
      <div className={css.topBar}>
        {loggedIn && (
          <button onClick={logout} className={css.logoutBtn}>
            Logout
          </button>
        )}
      </div>

      <div className="container d-flex align-items-center justify-content-center">
        <div
          className={`${css.roww} ${toShowSaved ? css.savedView : "shadow mb-5"}`}
          style={{ position: "relative" }}
        >
          <SaveLike
            qoute={qoute}
            author={author}
            onToggleLike={toggleHnadler}
            onRequestSavedView={handleSavedIconClick}
            setToShowSaved={setToShowSaved}
            toShowSaved={toShowSaved}
            red={red}
            setRed={setRed}
            isLoggedIn={loggedIn}
            requestAuth={requestAuth}
          />

          <div className={`${css.cardInner} ${toShowSaved ? css.savedCardInner : ""}`}>
            {showAuth ? (
              <AuthModal
                onSuccess={handleAuthSuccess}
                onCancel={handleAuthCancel}
              />
            ) : toShowSaved ? (
              <QuoteSave setRed={setRed} requestAuth={requestAuth} />
            ) : (
              <QouteBody
                fetching={fetching}
                handleShareButton={handleShareButton}
                showButton={showButton}
                qoute={qoute}
                author={author}
                handeleNewQoute={handeleNewQoute}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
