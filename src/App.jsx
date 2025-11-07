import { useEffect } from "react";
import { auth } from "./firebase-config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import TextEdit from "./components/TextEdit";

const App = () => {
  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User sign in: ", user.uid);
      }
    });
  }, []);
  return (
    <>
      <div className="App">
        <header>
          <h1>Google Docs</h1>
        </header>
        <TextEdit />
      </div>
    </>
  );
};

export default App;
