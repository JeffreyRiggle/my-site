import React from "react"

const ProjectPage = ({pageContext}) => {
    return (
        <div>
            <h1>{pageContext.projectName}</h1>
            <div dangerouslySetInnerHTML={{ __html: pageContext.content }}></div>
        </div>
    );
}

export default ProjectPage;