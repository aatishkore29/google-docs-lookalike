import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import "react-quill/dist/quill.snow.css";
import { throttle } from "lodash";
import "../App.css";

function TextEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const quillRef = useRef(null);
  const documentRef = doc(db, "documents", "example-doc");

  // change was made by the local user
  const isLocalChange = useRef(false);

  // save content to Firestore 
  const saveContent = throttle(() => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log("Saving content to Firestore:", content);
      setDoc(documentRef, { content: content.ops }, { merge: true })
        .then(() => console.log("Content saved successfully"))
        .catch(console.error);
      isLocalChange.current = false; // Reset localChange after saving
    }
  }, 1000);

  useEffect(() => {
    if (quillRef.current) {
      // Load initial content from Firestore
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const savedContent = docSnap.data().content;
            if (savedContent) {
              quillRef.current.getEditor().setContents(savedContent);
            }
          } else {
            console.log("No text found, starting with empty ediotr.");
          }
        })
        .catch(console.error);

      // Listen for Firestore document updates in real-time
      const unsubscribe = onSnapshot(documentRef, (snapshot) => {
        if (snapshot.exists()) {
          const newContent = snapshot.data().content;

          if (!isEditing) {
            const editor = quillRef.current.getEditor();
            const currentCursorPosition = editor.getSelection()?.index || 0; // Get current cursor position

            // Apply content update silently to avoid triggering `text-change`
            editor.setContents(newContent, "silent");

            // Restore cursor position after content update
            editor.setSelection(currentCursorPosition);
          }
        }
      });

      // Listen for local text changes and save to Firestore
      const editor = quillRef.current.getEditor();
      editor.on("text-change", (source) => {
        if (source === "user") {
          isLocalChange.current = true; // Mark change as local
          setIsEditing(true);
          saveContent();

          // Reset editing state after 5 seconds of inactivity
          setTimeout(() => setIsEditing(false), 5000);
        }
      });

      return () => {
        unsubscribe();
        editor.off("text-change");
      };
    }
  }, []);

  return (
    <div className="docs-editor">
      <ReactQuill ref={quillRef} />
    </div>
  );
}

export default TextEdit;
