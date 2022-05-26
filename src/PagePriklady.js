/**
 *    /\
 *   /??\
 *  ======
 *	Logika samotnych prikladov
 *
 */

import {useEffect, useState} from 'react';

/* xml-file, axios, xmlparser */
import XMLData from './priklady/priklady.xml';
import axios from 'axios';
import XMLParser from 'react-xml-parser';

function PagePriklady() {
  const [problemsList, setProblemsList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [input, setInput] = useState('');
  const [taskNumber, setTaskNumber] = useState(NaN);
  const [answMessage, setAnswMessage] = useState({correct: false, shouldDisplay: false});

  useEffect(() => {
    /* nacitanie prikladov */
    var rawXmlData = '';
    axios
      .get(XMLData, {
        'Content-Type': 'application/xml; charset=utf-8',
      })
      .then((response) => {
        rawXmlData = response.data;
        parseXmlData(rawXmlData);
      });

    setImageList(importAllImages(require.context('./priklady/zadania', false, /.png/)));

    /* prvotne vygenerovanie prikladu */
    genNewTask();
  }, []);

  const parseXmlData = (rawXmlData) => {
    const xml = new XMLParser().parseFromString(rawXmlData);
    setProblemsList(xml.children);
  };

  const importAllImages = (r) => {
    let images = {};
    r.keys().map((item) => (images[item.replace('./', '')] = r(item)));
    return images;
  };

  const genNewTask = () => {
    setTaskNumber(Math.floor(Math.random() * 300));
  };

  const checkAnswer = async (answer) => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    console.log(problemsList[taskNumber].children[2].value);

    if (problemsList[taskNumber].children[2].value === answer) {
      setAnswMessage({correct: true, shouldDisplay: true});
      await delay(1500);
      genNewTask();
    } else {
      setAnswMessage({correct: false, shouldDisplay: true});
    }
  };

  const handleListClick = (e) => {
    checkAnswer(e.currentTarget.id);
  };

  const renderTask = () => {
    if (isNaN(taskNumber)) return;

    return (
      <div>
        <h1>{problemsList[taskNumber].attributes.id}</h1>
        <img src={imageList[taskNumber + 1 + '.png']} alt="Zadanie úlohy" />
        {problemsList[taskNumber].children[1].value === '0' ? (
          <div>
            <label>
              Odpoved
              <input
                type="text"
                name="name"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
            </label>
            <button
              type="submit"
              value="Submit"
              onClick={(e) => {
                e.preventDefault();
                checkAnswer(input);
              }}
            >
              Potvrdit
            </button>
          </div>
        ) : (
          <div>
            <ul>
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
            </ul>
          </div>
        )}
        <button
          type="submit"
          value="Submit"
          onClick={(e) => {
            e.preventDefault();
            genNewTask();
          }}
        >
          Dalsia
        </button>
        {answMessage.shouldDisplay && <h2>{answMessage.correct ? 'spravna odpoved' : 'nespravna odpoved'}</h2>}
      </div>
    );
  };

  return <header>{renderTask()}</header>;
}

export default PagePriklady;
