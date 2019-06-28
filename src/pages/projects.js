import React from 'react';
import Layout from '../components/layout';
import { Link, useStaticQuery, graphql } from 'gatsby';

const ProjectsPage = () => {
    const result = useStaticQuery(graphql`query {
        github {
          viewer {
            name
            repositories(last: 100) {
              nodes {
                name
                description
                first: object(expression: "master:README.md") {
                  id
                  ... on Github_Blob {
                    text
                  }
                }
              }
            }
          }
        }
      }          
    `);

    let projects = result.github.viewer.repositories.nodes.filter(node => {
      return node.first && node.first.text;
    });

    return (
        <Layout>
          <h1>Projects</h1>
          <ul>
              {projects.map(node => {
                  return <li><Link to={`/${node.name}`}>{node.name}</Link>{node.description && <span> - {node.description}</span>}</li>;
              })}
          </ul>
        </Layout>
    );
}

export default ProjectsPage
