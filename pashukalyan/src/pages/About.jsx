import React from "react";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About PashuKalyan</h1>
        <p className="tagline">
          A simple initiative for the welfare and adoption of stray animals
        </p>
      </div>

      <div className="about-section">
        <div className="image-container">
          <img
            src="/images/about-dogs.jpg"
            alt="Stray dogs at the shelter"
            className="about-image"
          />
        </div>
        <div className="content-container">
          <h2>Our Mission</h2>
          <p>
            PashuKalyan is a college project developed with the aim to assist in
            the adoption and care of stray animals. We believe every animal deserves
            a safe and loving home.
          </p>
          <p>
            Through this platform, users can view animals available for adoption,
            apply for adoption, and get involved in supporting stray animal welfare.
            Admins can manage adoptions and ensure proper verification.
          </p>
          <p>
            While simple in scope, this project reflects our passion for animal care
            and serves as a digital step toward building more compassionate communities.
          </p>
        </div>
      </div>

      <div className="about-section reverse">
        <div className="image-container">
          <img
            src="/images/adoption.jpg"
            alt="Person adopting a dog"
            className="about-image"
          />
        </div>
        <div className="content-container">
          <h2>Adoption Process</h2>
          <p>
            Users can browse a list of animals available for adoption and submit an application
            for the one they wish to adopt.
          </p>
          <p>
            Once an application is submitted, it is reviewed by the admin. If approved, the
            animal is marked as adopted, and the user is notified.
          </p>
          <p>
            This system ensures a simple and transparent adoption workflow that benefits both
            the animals and potential adopters.
          </p>
        </div>
      </div>

      <div className="about-section">
        <div className="image-container">
          <img
            src="/images/donation.jpg"
            alt="Dog food donation"
            className="about-image"
          />
        </div>
        <div className="content-container">
          <h2>Support & Donations</h2>
          <p>
            Even small gestures can go a long way. If you're unable to adopt, you can still help!
            We accept donations in the form of pet food, blankets, or other basic supplies.
          </p>
          <p>
            Your contribution helps us feed and care for the animals waiting to be adopted. 
            To support, you can reach out through our <a href="/contact">contact page</a> or visit 
            our donation partner links.
          </p>
        </div>
      </div>

      <div className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-container">
          <div className="value-card">
            <h3>Compassion</h3>
            <p>
              We believe in showing love and care to animals who can't speak for themselves.
            </p>
          </div>
          <div className="value-card">
            <h3>Responsibility</h3>
            <p>
              Adoption comes with responsibility — we aim to promote responsible pet ownership.
            </p>
          </div>
          <div className="value-card">
            <h3>Awareness</h3>
            <p>
              Our project also seeks to raise awareness about stray animal welfare.
            </p>
          </div>
          <div className="value-card">
            <h3>Community</h3>
            <p>
              We believe that a caring community can make a real difference in the lives of animals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
