import homeImgLeslangue from '../assets/leslangue.jpg';
import homeImgDawlond from '../assets/dawlond.jpg';
import './Home.css';
function Home() {
  return (
    <div className="page">
      <h2>مرحبًا بك في منصة تعليم اللغات</h2>
      <div className="images-container">
        <img src={homeImgLeslangue} alt="Les Langue" className="main-img" />
        <img src={homeImgDawlond} alt="Dawlond" className="main-img" />
      </div>
    </div>
  );
}

export default Home;