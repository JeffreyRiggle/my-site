import React from 'react';
import Layout from '../components/layout';
import { Link, useStaticQuery, graphql } from 'gatsby';

const ScenesPage = () => {
  // Reminder to future self because I will almost certainly forget. There is a
  // hidden convention here the path in scenes needs to match the path in static
    const result = useStaticQuery(graphql`
      {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/(content/scenes)/" } }
          sort: { frontmatter: {date: DESC} }
          limit: 1000
        ) {
          edges {
            node {
              html
              fields {
                slug
              }
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `);

    // TODO create correct layout
    return (
        <Layout title="Scenes">
          <h1>Scenes</h1>
          <p>This is a place where I study animation. Do a better job here</p>
          <ul className="project-list">
              {result.allMarkdownRemark.edges.map(edge => {
                  return (
                  <li>
                    <Link to={edge.node.fields.slug}>{edge.node.frontmatter.title} - {edge.node.frontmatter.date}</Link>
                    <div dangerouslySetInnerHTML={{ __html: edge.node.html }} />
                  </li>);
              })}
          </ul>
        </Layout>
    );
}

export default ScenesPage
