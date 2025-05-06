import React from 'react';
import Image from 'next/image';

const MainPage = () => {
  return (
    <main className="bg-gradient-to-b from-background via-background-dark to-background min-h-screen w-full text-text">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 mb-12">
        <Image
          src="/hero-bg.jpg"
          alt="Hero background"
          fill
          priority
          style={{ objectFit: 'cover', zIndex: 0 }}
          className="absolute inset-0 -z-10 opacity-40"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4 relative z-10 drop-shadow-lg">
          Unravel Your Financial Anveshan with <span className="text-accent-dark">Power of Arthashastra.</span>
        </h1>
        <p className="text-lg md:text-xl text-text mb-8 max-w-2xl relative z-10">
          Take control of your financial journey. Combining modern technology with ancient wisdom, our expense tracker empowers you to align your daily expenses with long-term prosperity.
        </p>
        <a
          href="#"
          className="bg-primary hover:bg-primary-dark text-background font-semibold px-6 py-3 rounded shadow relative z-10 transition-colors"
        >
          Get Started
        </a>
      </section>

      {/* Featured Projects */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-accent">Featured Projects</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
          {/* Project 1 */}
          <div className="bg-card rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Smart Spend</h3>
            <Image src="/project1.png" alt="Expense Manager" width={96} height={96} className="mb-4" />
            <p className="text-sm text-text mb-4 text-center">Manage your expenses with ease using our comprehensive solution.</p>
            <button className="px-4 py-1 bg-primary hover:bg-primary-dark text-background rounded">View project</button>
          </div>
          {/* Project 2 */}
          <div className="bg-card rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Smart Budgeting</h3>
            <Image src="/project2.png" alt="Smart Budgeting" width={96} height={96} className="mb-4" />
            <p className="text-sm text-text mb-4 text-center">Create and track budgets effortlessly with our intuitive tool.</p>
            <button className="px-4 py-1 bg-primary hover:bg-primary-dark text-background rounded">View project</button>
          </div>
          {/* Project 3 */}
          <div className="bg-card rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Report Generator</h3>
            <Image src="/project3.png" alt="Report Generator" width={96} height={96} className="mb-4" />
            <p className="text-sm text-text mb-4 text-center">Generate detailed financial reports with customizable options.</p>
            <button className="px-4 py-1 bg-primary hover:bg-primary-dark text-background rounded">View project</button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-12 bg-card">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-accent">About us</h2>
        <p className="text-center text-text max-w-2xl mx-auto mb-8">
          SmartSpend is dedicated to simplifying your financial management with innovative solutions tailored to your needs. Our team of experts is committed to delivering intuitive tools that help you track and optimize your expenses efficiently.
        </p>
        <div className="flex justify-center">
          <Image src="/about.png" alt="Team working" width={600} height={300} className="rounded-lg shadow-lg w-full max-w-2xl object-cover" />
        </div>
      </section>

      {/* Our Services */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-accent">Our Services</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
          {/* Service 1 */}
          <div className="bg-card rounded-lg shadow p-6 w-64 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Budget Tool</h3>
            <Image src="/service1.png" alt="Budget Tool" width={64} height={64} className="mb-4" />
            <p className="text-sm text-text text-center">Our platform provides intuitive budget management tools that help you allocate and track your expenses effectively.</p>
          </div>
          {/* Service 2 */}
          <div className="bg-card rounded-lg shadow p-6 w-64 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Bill Reminder</h3>
            <Image src="/service2.png" alt="Bill Reminder" width={64} height={64} className="mb-4" />
            <p className="text-sm text-text text-center">Stay on top of your financial commitments with our calendar feature that reminds you of upcoming payments and bills.</p>
          </div>
          {/* Service 3 */}
          <div className="bg-card rounded-lg shadow p-6 w-64 flex flex-col items-center border border-border">
            <h3 className="font-semibold text-lg mb-2 text-accent-dark">Spending Insight</h3>
            <Image src="/service3.png" alt="Spending Insight" width={64} height={64} className="mb-4" />
            <p className="text-sm text-text text-center">Gain insights into your spending patterns with our detailed analytics and reporting tools.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-card">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-accent">Hear from our awesome users!</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
          {/* Testimonial 1 */}
          <div className="bg-background rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <div className="flex items-center mb-2">
              <Image src="/user1.jpg" alt="Alice Johnson" width={40} height={40} className="rounded-full mr-2" />
              <div>
                <span className="font-semibold text-accent-dark">Alice Johnson</span>
                <div className="text-accent text-xs">★★★★★</div>
              </div>
            </div>
            <p className="text-sm text-text text-center">ExpenseWise has streamlined our budgeting process.</p>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-background rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <div className="flex items-center mb-2">
              <Image src="/user2.jpg" alt="Michael Smith" width={40} height={40} className="rounded-full mr-2" />
              <div>
                <span className="font-semibold text-accent-dark">Michael Smith</span>
                <div className="text-accent text-xs">★★★★★</div>
              </div>
            </div>
            <p className="text-sm text-text text-center">A must-have tool for any business owner.</p>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-background rounded-lg shadow p-6 w-72 flex flex-col items-center border border-border">
            <div className="flex items-center mb-2">
              <Image src="/user3.jpg" alt="Sophia Lee" width={40} height={40} className="rounded-full mr-2" />
              <div>
                <span className="font-semibold text-accent-dark">Sophia Lee</span>
                <div className="text-accent text-xs">★★★★★</div>
              </div>
            </div>
            <p className="text-sm text-text text-center">Incredible features and easy to use interface.</p>
          </div>
        </div>
        {/* Carousel dots (static for now) */}
        <div className="flex justify-center mt-6 space-x-2">
          <span className="w-2 h-2 bg-accent rounded-full inline-block" />
          <span className="w-2 h-2 bg-border rounded-full inline-block" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-accent">Ready to work with us?</h2>
        <p className="text-center text-text mb-6">Join our network to streamline your expense management and maximize your savings.</p>
        <div className="flex justify-center">
          <button className="px-6 py-2 bg-primary hover:bg-primary-dark rounded text-background font-semibold shadow">Get In Touch</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-background via-background-dark to-background text-text pt-10 pb-4 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-8">
            <div className="mb-6 md:mb-0">
              <span className="font-bold text-lg text-accent">ExpenseTracker</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:underline hover:text-accent">Pricing</a>
              <a href="#" className="hover:underline hover:text-accent">About us</a>
              <a href="#" className="hover:underline hover:text-accent">Features</a>
              <a href="#" className="hover:underline hover:text-accent">Help Center</a>
              <a href="#" className="hover:underline hover:text-accent">Contact us</a>
              <a href="#" className="hover:underline hover:text-accent">FAQs</a>
              <a href="#" className="hover:underline hover:text-accent">Careers</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center border-t border-border pt-4">
            <div className="mb-4 md:mb-0">
              <span className="text-xs">© 2024 Brand, Inc. • Privacy • Terms • Sitemap</span>
            </div>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter"><Image src="/x.svg" alt="Twitter" width={20} height={20} /></a>
              <a href="#" aria-label="Facebook"><Image src="/facebook.svg" alt="Facebook" width={20} height={20} /></a>
              <a href="#" aria-label="LinkedIn"><Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} /></a>
              <a href="#" aria-label="YouTube"><Image src="/youtube.svg" alt="YouTube" width={20} height={20} /></a>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs">Copyright @2025</span>
            </div>
            <div>
              <select className="bg-background text-accent text-xs rounded px-2 py-1">
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default MainPage;
