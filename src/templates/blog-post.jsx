import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { previous, next } = this.props.pageContext

    return (
      <Layout title={post.frontmatter.title}>
        <div className="blog-post">
          <h1>{post.frontmatter.title}</h1>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="blog-selector">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
              Last post ({previous.frontmatter.title})
              </Link>
            )}
            {next && (
              <Link to={next.fields.slug} rel="next">
                Next post ({next.frontmatter.title})
              </Link>
            )}
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`