import React from 'react';
import Layout from '../components/layout';
import { Link, useStaticQuery, graphql } from 'gatsby';

const BlogPage = () => {
    const result = useStaticQuery(graphql`
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
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

    return (
        <Layout>
          <h1>Blog Posts</h1>
          <ul className="project-list">
              {result.allMarkdownRemark.edges.map(edge => {
                  return <li><Link to={`/${edge.node.fields.slug}`}>{edge.node.frontmatter.title} - {edge.node.frontmatter.date}</Link></li>;
              })}
          </ul>
        </Layout>
    );
}

export default BlogPage
