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

function requiresProject(type) {
    return type === 'Bug' || type === 'Feature request';
}

const FeedbackPage = () => {
  const projects = sortProjects(useStaticQuery(graphql`query {
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
  `).github.viewer.repositories.nodes)

  const [feedbackType, setFeedbackType] = React.useState(feedbackTypes[0])
  const [name, setName] = React.useState('')
  const [project, setProject] = React.useState(projects[0].name)
  const [summary, setSummary] = React.useState('')
  const [detail, setDetail] = React.useState('')
  const [posted, setPosted] = React.useState('')
  const [error, setError] = React.useState('')

  function sendFeedback() {
    const request = new Request('http://localhost:8080/sona/v1/incidents', {
        method: 'POST',
        body: JSON.stringify({
            reporter: name,
            description: detail,
            attributes: {
                project,
                summary
            }
        })
    })

    fetch(request).then(() => {
        setPosted(true)
    }).catch(() => {
        setError(true)
    });
  }

  function clearState() {
      if (posted || error) {
        setPosted(false)
        setError(false)
      }
  }

  return (
    <Layout title="feedback">
        <h1>Feedback</h1>
        <div>
            <label>Name</label>
            <input type="text" value={name} onChange={(event) => {
                setName(event.target.value)
                clearState()
            }}/>
        </div>
        <div>
            <label>Feedback type</label>
            <select value={feedbackType} onChange={(event) => {
                setFeedbackType(event.target.value)
                clearState()
            }}>
                {feedbackTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        { requiresProject(feedbackType) && (
                <div>
                    <select value={project} onChange={(event) => {
                        setProject(event.target.value)
                        clearState()
                    }}>
                        {projects.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
            )
        }
        <div>
            <label>Feedback Summary</label>
            <input type="text" value={summary} onChange={(event) => {
                setSummary(event.target.value)
                clearState()
            }}/>
        </div>
        <div>
            <label>Feedback Full Detail</label>
            <textarea value={detail} onChange={(event) => {
                setDetail(event.target.value)
                clearState()
            }}/>
        </div>
        <button onClick={sendFeedback}>Submit</button>
        {
            posted && <h3>Your feedback has been submitted.</h3>
        }
        {
            error && <h3>Your feedback submission has failed try again later.</h3>
        }
    </Layout>
  );
}

export default FeedbackPage
