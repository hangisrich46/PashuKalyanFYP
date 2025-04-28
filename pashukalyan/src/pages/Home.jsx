import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DevSessionCheck from "../components/DevSessionCheck"; // make sure the path is correct

const Home = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <DevSessionCheck /> {/* Logs session info on page load */}

      {/* Hero Section */}
      <section className="w-full bg-[#f0f0f0] py-16">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">PASHUKALYAN</h1>
            <p className="text-lg md:text-xl text-black mb-6">
              A animal welfare organization dedicated in serving the needy pets out there
            </p>
            <p className="text-xl md:text-2xl font-medium text-black mb-8">&#39; TOGETHER WE CAN &#39;</p>
            <a
              href="/about"
              className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              ABOUT US
            </a>
          </div>
          <div className="md:w-1/2">
            <img
              src="rescue.jpg"
              alt="Volunteers with rescued dogs"
              className="w-full h-auto rounded-md shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Volunteers+with+Dogs";
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feeding Campaign */}
            <div className="bg-[#f0f0f0] p-4 rounded-md">
              <img
                src="feed.png"
                alt="Feeding campaign"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium text-black mb-2">How can you be a part of our fooding campaign?</h3>
              <a href="/feeding-campaign" className="text-black font-medium hover:underline">
                Read...
              </a>
            </div>

            {/* Adoption */}
            <div className="bg-[#f0f0f0] p-4 rounded-md">
              <img
                src="kalu.JPG"
                alt="Dog for adoption"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium text-black mb-2">Want to give them a home?</h3>
              <a href="/adopt" className="text-black font-medium hover:underline">
                Adopt
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-12 bg-[#f0f0f0]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">DONATE NOW</h2>
          <p className="text-lg text-black mb-6">Help them with anything you can</p>
          <a
            href="/donate"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Donate
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
