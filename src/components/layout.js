import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <>
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
      <div>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
