import React from 'react';
import Layout from '../components/layout';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { sortProjects } from '../util/util';

const ProjectsPage = () => {
    const result = useStaticQuery(graphql`{
      githubData {
        data {
          viewer {
            repositories {
              nodes {
                name
                description
                first {
                  text
                }
              }
            }
          }
        }
      }
    }        
    `);

    let projects = result.githubData.data.viewer.repositories.nodes.filter(node => {
      return node.first && node.first.text;
    });

    return (
        <Layout title="projects">
          <h1>Projects</h1>
          <ul className="project-list">
              {sortProjects(projects).map(node => {
                  return (
                    <li>
                      <Link to={`/${node.name}`}>{node.name}</Link>
                      {node.description && <div className="description">{node.description}</div>}
                    </li>
                  );
              })}
          </ul>
        </Layout>
    );
}

export default ProjectsPage
