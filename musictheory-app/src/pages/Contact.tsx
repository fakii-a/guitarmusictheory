import React from 'react';

const PageName: React.FC = () => {
  return (
    <div className="page-content">
      <h1 className="page-title">Page Title</h1>
      
      <section>
        <h2>Section Heading</h2>
        <p>Your content goes here. Add text, images, or any other elements you need.</p>
        
        <button className="cta-button">Action Button</button>
      </section>

      <section>
        <h2>Another Section</h2>
        <ul>
          <li>List item one</li>
          <li>List item two</li>
          <li>List item three</li>
        </ul>
      </section>
    </div>
  );
};

export default PageName;