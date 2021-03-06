import React from 'react';
import Layout from '../components/layout';
import 'prismjs/themes/prism-tomorrow.css';
import ProjectItems from '../components/project-items';
import 'font-awesome/css/font-awesome.min.css';

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
    const [popup, setPopup] = React.useState(false);

    return (
        <Layout title={pageContext.projectName}>
            <h1 className="project-title">
                <button onClick={() => setPopup(!popup)} aria-label="Additional pages"><i className="fa fa-book"></i></button>
                <a href={pageContext.projectUrl}>{pageContext.projectName}</a>
            </h1>
            { popup && (
                <div className="popup-projects">
                    <h1><button onClick={() => setPopup(false)} aria-label="Close">x</button></h1>
                    <ProjectItems
                        pages={pageContext.pages}
                        projectName={pageContext.projectName}
                        index={pageContext.index}
                        hasApi={pageContext.hasApi}
                    />
                </div>
                
            )}
            <div className="project">
                <div className="project-sidebar">
                    <ProjectItems
                        pages={pageContext.pages}
                        projectName={pageContext.projectName}
                        index={pageContext.index}
                        hasApi={pageContext.hasApi}
                    />
                </div>
                <div className="project-area">
                    <div className="project-content-page" dangerouslySetInnerHTML={{ __html: getPageContent(pageContext.pages, pageContext.currentPage) }}></div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectPage;