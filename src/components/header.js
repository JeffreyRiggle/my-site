import { Link } from "gatsby"
import React from "react"

const Header = () => (
  <header>
    <div>
      <h1>
        <Link to="/">
          Home
        </Link>
        <Link to="/projects">
          Projects
        </Link>
        <Link to="/blogs">
          Blogs
        </Link>
      </h1>
    </div>
  </header>
)

export default Header
