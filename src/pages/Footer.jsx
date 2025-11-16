import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-6 mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Blog d'Ursule. Tous droits réservés.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/contact" className="hover:text-white transition duration-300 text-sm">Contact</a>
          <a href="/mentions-legales" className="hover:text-white transition duration-300 text-sm">Mentions légales</a>
          <a href="https://github.com/ursldv" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300 text-sm">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
