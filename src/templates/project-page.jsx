import React from 'react';
import Layout from '../components/layout';
import { Link } from 'gatsby';

function getLinkPath(projectName, page, index) {
    if (page === index) {
        return `/${projectName}`;
    }

    return `/${projectName}/${page}`;
}

function getPageContent(pages, currentPage) {
    let retVal = pages[currentPage];

    if (retVal) {
        return retVal;
    }

    for (const pageId in pages) {
        const page = pages[pageId];
        if (!page.children) {
            continue;
        }

        for (const childPageId in page.children) {
            const childPage = page.children[childPageId];
            if (childPage.displayName === currentPage) {
                return childPage.content;
            }
        }
    }

    return '';
}

const ProjectPage = ({pageContext}) => {
    return (
        <Layout title={pageContext.projectName}>
            <h1 className="project-title"><a href={pageContext.projectUrl}>{pageContext.projectName}</a></h1>
            <div className="project">
                <div className="project-sidebar">
                    <ul>
                        {Object.keys(pageContext.pages).map(page => {
                            const content = pageContext.pages[page];

                            if (typeof content === 'string' || content instanceof String) {
                                return <li><Link to={getLinkPath(pageContext.projectName, page, pageContext.index)}>{page}</Link></li>;
                            }

                            return (
                                <li>
                                    {page}
                                    <ul className="nested">
                                        {content.children.map(childPage => {
                                            return <li><Link to={getLinkPath(pageContext.projectName, childPage.displayName, pageContext.index)}>{childPage.displayName}</Link></li>;
                                        })}
                                    </ul>
                                </li>
                            )
                        })}
                        {pageContext.hasApi && <li><Link to={`/${pageContext.projectName}/apidocs`}>Api Documentation</Link></li>}
                    </ul>
                </div>
                <div className="project-area">
                    <div className="project-content-page" dangerouslySetInnerHTML={{ __html: getPageContent(pageContext.pages, pageContext.currentPage) }}></div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectPage;