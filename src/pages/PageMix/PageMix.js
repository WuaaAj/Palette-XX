import { useState, useEffect } from "react";
import styles from "./PageMix.module.css";
import MixColorList from "../../components/MixColorList";
import MixCurrentState from "../../components/MixCurrentState";
import { ButtonBase } from "@material-ui/core";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import butt from "../../components/SoundEffect/barbutton.mp3";
import confirm from "../../components/SoundEffect/confirm.mp3";

function cusColor(red, green, blue) {
  var rr = Math.min(255, red), gg = Math.min(255, green), bb = Math.min(255, blue);
  var rgbstring = "RGB(" + rr + ", " + gg + ", " + bb + ")";
  return {
    rgb: rgbstring, 
    r: rr, 
    g: gg,
    b: bb, 
    cssString: { backgroundColor: rgbstring }
  };
}

function randomColor() {
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);
  return cusColor(red, green, blue);
}

function PageMix(props) {
  const { collection, setCollection, mixColl, setMixColl, sEffect } = props;
  const [choices, setChoices] = useState([
    {color: randomColor(), pct: 0}, 
    {color: randomColor(), pct: 0}, 
    {color: randomColor(), pct: 0}]);

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("/collection").doc(uid).set({ collection: collection });
    db.collection("/mixColl").doc(uid).set({ mixColl: mixColl });
  }, [mixColl, collection]);

  function generateMix() {
    var i, red = 0, green = 0, blue = 0;
    for(i = 0; i < choices.length; i++) {
      red += choices[i].color.r * choices[i].pct;
      green += choices[i].color.g * choices[i].pct;
      blue += choices[i].color.b * choices[i].pct;
    }
    red = Math.floor(red);
    green = Math.floor(green);
    blue = Math.floor(blue);
    return cusColor(red, green, blue);
  }

  function handleSubmit() {
    ConfirmSound();
    alert("Added to Collection!");
    var c = generateMix();
    setMixColl([...mixColl, collection.length]);
    setCollection([...collection, c]);
    playAgain();
  }

  function playAgain() {
    var newChoices = [];
    ButtSound();
    for(var i = 0; i < choices.length; i++) {
      newChoices.push({color: randomColor(), pct: choices[i].pct});
    }
    setChoices(newChoices);
  }

  function addChoice() {
    ButtSound();
    setChoices([...choices, {color: randomColor(), pct: 0}]);
  }

  function ConfirmSound() {
    var sound = document.getElementById("confirm");
    sound.volume="0.6";
    sEffect && sound.play();
  } 

  function ButtSound() {
    var sound = document.getElementById("butt");
    sound.volume="1.0";
    sEffect && sound.play();
  } 


  return (
    <>
      <audio id="butt" src={butt} autostart="0" />
      <audio id="confirm" src={confirm} autostart="0" />
      <div className={styles.bg}></div>
      <div className={styles.container}>
        <div className={styles.box}>
          <MixCurrentState current={generateMix()} />
          <div className={styles.box2}>
            <h1 className={styles.title1}>Feel free to create your own color!</h1>
            <div className={styles.colorList}>
              <MixColorList choices={choices} setChoices={setChoices} sEffect={sEffect}/>
            </div>
            <div className={styles.containerRow}>
              <div className={styles.buttonBG}>
                <ButtonBase
                  className={styles.base}
                  onClick={handleSubmit} 
                >
                  <p className={styles.text}>Submit</p>
                </ButtonBase>
              </div>
              <div className={styles.buttonBG}>
                <ButtonBase
                  className={styles.base}
                  onClick={playAgain}
                >
                  <p className={styles.text}>Play Again</p>
                </ButtonBase>
              </div>
              <div className={styles.buttonBG}>
                <ButtonBase
                  className={styles.base}
                  onClick={addChoice}
                >
                  <p className={styles.text}>Add Choice</p>
                </ButtonBase>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
  
export default PageMix;
