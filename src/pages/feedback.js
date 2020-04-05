import React from "react"
import Layout from "../components/layout"
import { useStaticQuery, graphql } from 'gatsby';
import { sortProjects } from '../util/util'

const feedbackTypes = [
    'Bug',
    'Contact',
    'Feature request',
    'General',
];

const FeedbackPage = () => {
  const projects = useStaticQuery(graphql`query {
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
  `).github.viewer.repositories.nodes;

  return (
    <Layout title="feedback">
        <h1>Feedback</h1>
        <form>
            <label>Name</label>
            <input type="text" />
            <label>Feedback type</label>
            <select>
                {feedbackTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select>
                {sortProjects(projects).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <label>Feedback Summary</label>
            <input type="text" />
            <label>Feedback Full Detail</label>
            <textarea />
        </form>
    </Layout>
  );
}

export default FeedbackPage
