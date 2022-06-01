/**
 *    /\
 *   /??\
 *  ======
 *	Header a jeho logika
 *
 */
import React, {useState} from 'react';
import {animated, useSpring} from 'react-spring';
import {Link} from 'react-router-dom';
import '../css/Header.css';

import {FiBox, FiUser, FiBook, FiLogOut, FiEdit} from 'react-icons/fi';
import ArrowIcon from '../obrazky/svgs/header-arrow-svg.js';
import PiIcon from '../obrazky/svgs/header-pi-logo-svg';

function Header() {
  const [arrowClick, setArrowClick] = useState(true);

  const animNavbar = useSpring({
    height: arrowClick ? '50px' : '550px',
    borderRadius: arrowClick ? '5rem' : '1rem',
  });
  const animHeaderArrow = useSpring({
    transform: arrowClick ? 'rotateX(0deg)' : 'rotateX(180deg)',
  });

  return (
    <animated.div style={animNavbar} className="navbar-main-container">
      <animated.div className="nav-arrow-cont" style={animHeaderArrow} onClick={() => setArrowClick(!arrowClick)}>
        <ArrowIcon click={arrowClick} />
      </animated.div>
      <ul className="nav-links">
        <li>
          <Link to="#" className="link">
            <FiBox />
          </Link>
          <h6>Index</h6>
        </li>
        <li>
          <Link to="/" className="link">
            <FiBook />
          </Link>
          <h6>Study</h6>
        </li>
        <li>
          <Link to="/" className="link">
            <FiEdit />
          </Link>
          <h6>Notes</h6>
        </li>
        <li>
          <Link to="/userpage" className="link">
            <FiUser />
          </Link>
          <h6>Login</h6>
        </li>
      </ul>
      <div className="profile-pic-nav">
        <Link to="/profile"></Link>
        <PiIcon />
      </div>
    </animated.div>
  );
}

export default Header;
