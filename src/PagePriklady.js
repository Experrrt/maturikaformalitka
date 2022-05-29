/**
 *    /\
 *   /??\
 *  ======
 *	Logika samotnych prikladov
 *
 */
import './css/PagePriklady.css';
import {useEffect, useRef, useState} from 'react';
import {useSpring, animated} from 'react-spring';

/* xml-file, axios, xmlparser */
import XMLData from './priklady/priklady.xml';
import axios from 'axios';
import XMLParser from 'react-xml-parser';

function PagePriklady() {
  const problemsList = useRef([]);
  const imageList = useRef([]);
  const [input, setInput] = useState('');
  const [taskNumber, setTaskNumber] = useState(NaN);
  const [answMessage, setAnswMessage] = useState({correct: false, shouldDisplay: false});

  useEffect(() => {
    /* nacitanie prikladov */
    let rawXmlData = '';
    axios
      .get(XMLData, {
        'Content-Type': 'application/xml; charset=utf-8',
      })
      .then((response) => {
        rawXmlData = response.data;
        parseXmlData(rawXmlData);
        imageList.current = importAllImages(require.context('./priklady/zadania', false, /.png/));
        genNewTask();
      });
  }, []);

  const parseXmlData = (rawXmlData) => {
    const xml = new XMLParser().parseFromString(rawXmlData);
    problemsList.current = xml.children;
  };

  const importAllImages = (r) => {
    let images = {};
    r.keys().map((item) => (images[item.replace('./', '')] = r(item)));
    return images;
  };

  const genNewTask = () => {
    let newNumber = Math.floor(Math.random() * 300);
    setTaskNumber(newNumber);
    switchAnswerForm(newNumber);
  };

  const switchAnswerForm = (taskNumber) => {
    if (problemsList.current[taskNumber].children[1].value === '0') {
      setAnimFormABC({translateY: '0px'});
      setAnimFormInput({translateY: '300px'});
    } else {
      setAnimFormABC({translateY: '300px'});
      setAnimFormInput({translateY: '0px'});
    }
  };

  const checkAnswer = async (answer) => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    console.log(problemsList.current[taskNumber].children[2].value);

    if (problemsList.current[taskNumber].children[2].value === answer) {
      setAnswMessage({correct: true, shouldDisplay: true});
      setAnimTaskCont.start({transform: 'scale(0.00)'});
      setInput('');

      await delay(500);
      genNewTask();
      await delay(1000);

      setAnimTaskCont.start({transform: 'scale(1.00)'});
    } else {
      setAnswMessage({correct: false, shouldDisplay: true});
      setAnimTaskCont.start({boxShadow: '0px 0px 9px 3px rgba(255, 0, 0, 0.5)'});

      await delay(1000);

      setAnimTaskCont.start({boxShadow: '0px 0px 0px 5px rgba(255, 0, 0, 0.0)'});
    }
    setAnswMessage({correct: false, shouldDisplay: false});
  };

  const handleListClick = (e) => {
    checkAnswer(e.currentTarget.id);
  };

  const [animTaskCont, setAnimTaskCont] = useSpring(() => ({
    transform: 'scale(1.00)',
    config: {mass: 1, tension: 170, friction: 24},
    boxShadow: '0px 0px 0px 5px rgba(255, 0, 0, 0.0)',
    onResolve: () => {
      console.log('kokotko');
    },
  }));

  const {x: animCheckMark} = useSpring({
    from: {x: 0},
    x: answMessage.correct & answMessage.shouldDisplay ? 1 : 0,
    config: {duration: 1000},
    delay: 460,
  });

  const [animFormInput, setAnimFormInput] = useSpring(() => ({
    translateY: '0px',
    config: {mass: 1, tension: 170, friction: 24},
  }));

  const [animFormABC, setAnimFormABC] = useSpring(() => ({
    translateY: '300px',
    config: {mass: 1, tension: 170, friction: 24},
  }));

  const TaskWindow = () => {
    if (isNaN(taskNumber)) return;

    return (
      <div className="priklady-main-header">
        <h1 className="priklady-task-number">Príklad {parseInt(problemsList.current[taskNumber].attributes.id)}</h1>
        <div className="priklady-center-check">
          <animated.div
            className="checkmark-cont"
            style={{
              scale: animCheckMark.to({
                range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.9, 1],
                output: [1, 0.77, 0.7, 1.3, 0.7, 1.3, 1.23, 1.1, 1],
              }),
            }}
          >
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </animated.div>
          <animated.div style={animTaskCont} className="priklady-task-cont">
            <img className="priklady-task-img" src={imageList.current[taskNumber + 1 + '.png']} alt="Zadanie úlohy" />
          </animated.div>
        </div>
        <div className="ansert-cont">
          <animated.div className="priklady-answer-type" style={animFormABC}>
            <input
              className="priklady-main-input"
              type="text"
              name="name"
              value={input}
              autoComplete="off"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button
              className="priklady-submit-button"
              type="submit"
              value="Submit"
              onClick={(e) => {
                e.preventDefault();
                checkAnswer(input);
              }}
            >
              Potvrdit
            </button>
          </animated.div>
          <animated.div style={animFormInput}>
            <ul className="priklady-ABCDlist">
              <li id="A" onClick={handleListClick}>
                A
              </li>
              <li id="B" onClick={handleListClick}>
                B
              </li>
              <li id="C" onClick={handleListClick}>
                C
              </li>
              <li id="D" onClick={handleListClick}>
                D
              </li>
              <li id="E" onClick={handleListClick}>
                E
              </li>
            </ul>
          </animated.div>

          {answMessage.shouldDisplay && <h2>{answMessage.correct ? 'spravna odpoved' : 'nespravna odpoved'}</h2>}
        </div>
      </div>
    );
  };

  return <>{TaskWindow()}</>;
}

export default PagePriklady;
