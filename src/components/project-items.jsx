import React from 'react';
import { Link } from 'gatsby';

function getLinkPath(projectName, page, index) {
    if (page === index) {
        return `/${projectName}`;
    }

    return `/${projectName}/${page}`;
}

const ProjectItems = ({pages, projectName, index, hasApi}) => {
    return (
        <ul>
            {Object.keys(pages).map(page => {
                const content = pages[page];

                if (typeof content === 'string' || content instanceof String) {
                    return <li><Link to={getLinkPath(projectName, page, index)}>{page}</Link></li>;
                }

                return (
                    <li>
                        {page}
                        <ul className="nested">
                            {content.children.map(childPage => {
                                return <li><Link to={getLinkPath(projectName, childPage.displayName, index)}>{childPage.displayName}</Link></li>;
                            })}
                        </ul>
                    </li>
                )
            })}
            {hasApi && <li><Link to={`/${projectName}/apidocs`}>Api Documentation</Link></li>}
        </ul>
    );
}

export default ProjectItems;