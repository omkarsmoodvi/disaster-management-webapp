import "../assets/CSS/Landing.css";
import { Statistics } from "../components/Statistics";

const landingBgStyle = {
  minHeight: '100vh',
  width: '100vw',
  background: 'url("/background.jpg") no-repeat center center fixed',
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column'
};

const Landing = () => {
  return (
    <div className="landing-bg" style={landingBgStyle}>
      <main className="landing-main">
        <h2 className="neon-title">Statistics</h2>
        <Statistics />
      </main>
    </div>
  );
};

export default Landing;
