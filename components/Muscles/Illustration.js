import React, { useEffect } from "react";
import muscleMap from "../muscle-male.svg";
import styles from "./Muscles.module.css";

export default function Illustration({ toggleMuscle, selectedMuscles }) {
  useEffect(() => {
    const svgObject = document.getElementById("muscle-svg");
    const handleLoad = () => {
      const svgDoc = svgObject.contentDocument;
      if (!svgDoc) return;
      const muscles = svgDoc.querySelectorAll(".muscle");
      muscles.forEach((muscle) => {
        muscle.addEventListener("click", handleClick);
      });
    };
    svgObject.addEventListener("load", handleLoad);
    return () => {
      svgObject.removeEventListener("load", handleLoad);
    };
  }, [toggleMuscle]);

  const handleClick = (event) => {
    const dataElemValue = event.target.dataset.elem;
    if (dataElemValue) {
      toggleMuscle(dataElemValue); // ✅ Always selectable
    }
  };

  return (
    <object
      id="muscle-svg"
      type="image/svg+xml"
      data={muscleMap}
      className={styles.muscleMap}
    />
  );
}
