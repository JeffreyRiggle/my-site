import React from "react"
import Layout from "../components/layout"
import { startAnimation, stopAnimation } from "../util/home-animation"

const IndexPage = () => {
  let [showCanvas, setShowCanvas] = React.useState(false)
  let [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    if (showCanvas) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [showCanvas]);

  const buttonText = isHover ? 'Or not?' : 'Press Me';
  
  return (
    <Layout title="home">
      <h1>Home page</h1>
      <p>Welcome to my corner of the internet.</p>
      <p>A public playground where I conduct small projects, technical experiments, and write-ups across a varied set of programming interests.</p>
      {
        !showCanvas && (
          <div className="animation-button">
            <button data-text={ buttonText }
              onClick={() => setShowCanvas(true)}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}>
              { buttonText }
            </button>
          </div>
        )
      }
    </Layout>
  )
}

export default IndexPage
