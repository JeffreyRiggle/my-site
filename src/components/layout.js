import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";
import SEO from './SEO';

import './layout.css';
import '../images/github.png';

const Layout = ({ children, title }) => {
  return (
    <>
      <SEO title={title}/>
      <header className="page-header">
        <div>
          <h1>
            <Link to="/" className="header-link">
              Home
            </Link>
            <Link to="/projects" className="header-link">
              Projects
            </Link>
            <Link to="/blogs" className="header-link">
              Blogs
            </Link>
          </h1>
        </div>
      </header>
      <div className="content-area">
        <main className="main-content">{children}</main>
        <footer className="content-footer">
          <a href="https://github.com/JeffreyRiggle">
            <StaticImage 
              layout="fixed"
              src="../images/github.png"
              alt="github"
              width={32}
              height={32} />
          </a>
          <a href="mailto:jeffreyriggle@gmail.com">
            <StaticImage 
              layout="fixed"
              src="../images/email.png"
              alt="email"
              width={32}
              height={32} />
          </a><span>Jeff Riggle</span>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Layout
