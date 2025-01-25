"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { auth, db } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { imageData } from "@/data/imageData"; // adjust the path as needed
import "./signmodal.css";

const SignInSignUpModal = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for sign-out
  const [rememberMe, setRememberMe] = useState(false); // Add state for "Remember Me"

  const { data: session } = useSession();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset your password");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset link sent! Check your email.");
    } catch (err) {
      setError("Error sending password reset email: " + err.message);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }

    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setError("Username is already taken");
        return;
      }

      // Select a random hashtag from imageData
      const hashtags = Object.keys(imageData.hashtags);
      const randomHashtag =
        hashtags[Math.floor(Math.random() * hashtags.length)];

      // Select a random image from the selected hashtag
      const selectedImages = imageData.hashtags[randomHashtag].images;
      const randomImage =
        selectedImages[Math.floor(Math.random() * selectedImages.length)];

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email,
        username,
        randomImage,
        timeOfJoining: Timestamp.now(), // Store the timestamp when the user signs up
      });

      // Sign in with NextAuth after successful sign up
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult.error) {
        setError("Error signing in after sign up: " + signInResult.error);
      } else {
        clearFields(); // Clear input fields after successful sign up
      }
    } catch (err) {
      setError("Error signing up: " + err.message);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true); // Start loading
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Now also sign in with NextAuth
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult.error) {
        setError("Error signing in: " + signInResult.error);
      } else {
        clearFields(); // Clear input fields after successful sign in
      }
    } catch (err) {
      setError("Error signing in with Firebase: " + err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSignOut = async () => {
    setLoading(true); // Start loading
    try {
      await signOut(); // Sign out user using NextAuth
    } catch (err) {
      setError("Error signing out: " + err.message); // Handle sign out error
    } finally {
      setLoading(false); // End loading
    }
  };

  const checkUsernameExists = async (username) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <>
      <div
        className="modal"
        style={{
          zIndex: props.logIsOpen ? 100 : -100,
          opacity: props.logIsOpen ? 1 : 0,
        }}
        onClick={() => props.setLogIsOpen(false)}
      >
        <div
          className="modal-content"
          style={{
            transform: props.logIsOpen
              ? "translateX(-0px)"
              : "translateX(1000px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {session ? (
            <>
              <p className="heddio">Welcome, {session.user.username}</p>
              <button onClick={handleSignOut} disabled={loading}>
                {loading ? "Signing Out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <div className="heddp">
                <h2 className="heddio">
                  {isSignUp ? "Create an Account" : "Welcome back!"}
                </h2>
              </div>

              {isSignUp && (
                <div className="midO">
                  <div className="midOT">USERNAME</div>
                  <input
                    type="text"
                    className="midOI"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}
              <div className="midO">
                <div className="midOT">EMAIL ADDRESS</div>
                <input
                  type="email"
                  className="midOI"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="midO">
                <div className="midOT">PASSWORD</div>
                <input
                  type="password"
                  className="midOI"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="midI">
                <label className="kinto">
                  <input
                    type="checkbox"
                    className="checki"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
                <button
                  onClick={handleForgotPassword}
                  className="kinto forget-pass"
                >
                  Forgot Password?
                </button>
              </div>

              {error && <p style={{ color: "#ff9999" }}>{error}</p>}

              {isSignUp ? (
                <div className="btiom">
                  <button className="btio" onClick={handleSignUp}>
                    Resister
                  </button>
                </div>
              ) : (
                <div className="btiom" onClick={handleSignIn}>
                  <button className="btio">
                    {loading ? "Hang in there..." : "Login"}
                  </button>
                </div>
              )}

              <div className="line-up">
                {isSignUp ? (
                  <div className="kinto">
                    <div>Already have an account?</div>
                    <div className="forget-pass" onClick={toggleMode}>
                      Login
                    </div>
                  </div>
                ) : (
                  <div className="kinto">
                    <div>Don't have an account?</div>
                    <div className="forget-pass" onClick={toggleMode}>
                      Resister
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignInSignUpModal;
