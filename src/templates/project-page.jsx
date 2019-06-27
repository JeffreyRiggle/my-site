import React from 'react';
import Header from '../components/header';

const ProjectPage = ({pageContext}) => {
    return (
        <div>
            <Header />
            <h1>{pageContext.projectName}</h1>
            <div dangerouslySetInnerHTML={{ __html: pageContext.content }}></div>
        </div>
    );
}

export default ProjectPage;