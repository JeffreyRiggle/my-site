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
      <p>You have stumbled upon my site, welcome.</p>
      <p>This site is filled with random projects I have worked on in my free time. 
      Please look around and see what you can find.</p>
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
