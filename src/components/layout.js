import React from 'react';
import PropTypes from 'prop-types';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import SEO from './SEO';
import './layout.css';
import '../images/github.png';

const Layout = ({ children, title }) => {
  const data = useStaticQuery(graphql`
    query {
      github: file(relativePath: { eq: "github.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      email: file(relativePath: { eq: "email.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  const githubImage = data.github.childImageSharp.fixed;
  const emailImage = data.email.childImageSharp.fixed;

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
          <a href="https://github.com/JeffreyRiggle"><Img fixed={githubImage} alt="github"></Img></a><a href="mailto:jeffreyriggle@gmail.com"><Img fixed={emailImage} alt="email"></Img></a><span>Jeffrey Riggle</span>
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
