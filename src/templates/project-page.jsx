import React from 'react';
import Layout from '../components/layout';
import { Link } from 'gatsby';

function getLinkPath(projectName, page, index) {
    if (page === index) {
        return `/${projectName}`;
    }

    return `/${projectName}/${page}`;
}

const ProjectPage = ({pageContext}) => {
    return (
        <Layout title={pageContext.projectName}>
            <h1 className="project-title"><a href={pageContext.projectUrl}>{pageContext.projectName}</a></h1>
            <div className="project">
                <div className="project-sidebar">
                    <ul>
                        {Object.keys(pageContext.pages).map(page => {
                            return <li><Link to={getLinkPath(pageContext.projectName, page, pageContext.index)}>{page}</Link></li>
                        })}
                        {pageContext.hasApi && <li><Link to={`/${pageContext.projectName}/apidocs`}>Api Documentation</Link></li>}
                    </ul>
                </div>
                <div className="project-area">
                    <div className="project-content-page" dangerouslySetInnerHTML={{ __html: pageContext.pages[pageContext.currentPage] }}></div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectPage;