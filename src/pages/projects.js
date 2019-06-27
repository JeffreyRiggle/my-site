import React from "react";
import Layout from "../components/layout";
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby";

const ProjectsPage = () => {
    const result = useStaticQuery(graphql`query {
        github {
          viewer {
            name
            repositories(last: 100) {
              nodes {
                name
              }
            }
          }
        }
      }          
    `);

    return (
        <Layout>
          <h1>Projects</h1>
          <ul>
              {result.github.viewer.repositories.nodes.map(node => {
                  return <li><Link to={`/${node.name}`}>{node.name}</Link></li>;
              })}
          </ul>
        </Layout>
    );
}

export default ProjectsPage
