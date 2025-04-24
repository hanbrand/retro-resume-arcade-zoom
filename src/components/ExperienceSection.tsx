
import { useState } from 'react';

const ExperienceSection = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  
  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      period: "2022 - Present",
      description: "Led the development of a complex web application using React, TypeScript, and Tailwind CSS. Improved performance by 40% through code optimization and modern build techniques.",
      achievements: [
        "Implemented CI/CD pipeline using GitHub Actions",
        "Reduced bundle size by 30% through code splitting and lazy loading",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    {
      title: "Full-Stack Developer",
      company: "Digital Solutions Ltd",
      period: "2019 - 2022",
      description: "Worked on various client projects using React, Node.js, and MongoDB. Developed and maintained RESTful APIs for multiple client applications.",
      achievements: [
        "Built a real-time chat application with WebSockets",
        "Integrated third-party payment gateways",
        "Implemented complex state management solutions using Redux"
      ]
    },
    {
      title: "Junior Developer",
      company: "StartUp Innovations",
      period: "2017 - 2019",
      description: "Started as an intern and quickly progressed to a full-time role. Worked on front-end development using HTML, CSS, and JavaScript.",
      achievements: [
        "Contributed to the company's design system",
        "Developed responsive email templates",
        "Created interactive data visualizations using D3.js"
      ]
    }
  ];

  return (
    <div className="text-white font-vt323">
      <h2 className="text-2xl font-press-start text-arcade-cyan mb-6">WORK HISTORY</h2>
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div 
            key={index}
            className={`border-2 ${activeItem === index ? 'border-arcade-neonPink neon-border' : 'border-arcade-purple/30'} 
              rounded-md p-4 bg-black/40 transition-all duration-300 cursor-pointer`}
            onClick={() => setActiveItem(activeItem === index ? null : index)}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <h3 className="text-xl font-press-start text-arcade-cyan">{exp.title}</h3>
                <p className="text-arcade-neonPink">{exp.company}</p>
              </div>
              <div className="mt-2 sm:mt-0 px-3 py-1 bg-arcade-darkPurple border border-arcade-cyan/30 rounded-md inline-block">
                {exp.period}
              </div>
            </div>
            
            <p className="mt-4">{exp.description}</p>
            
            {activeItem === index && (
              <div className="mt-4 pl-4 border-l-2 border-arcade-cyan/50 animate-fade-in">
                <h4 className="font-press-start text-sm text-arcade-orange mb-2">ACHIEVEMENTS</h4>
                <ul className="list-disc list-inside space-y-2">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="ml-2">{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-sm text-center">
              <p className="text-arcade-cyan animate-pulse">
                {activeItem === index ? "< CLICK TO COLLAPSE >" : "< CLICK FOR DETAILS >"}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-black to-arcade-darkPurple p-4 rounded-md border border-arcade-orange/30">
        <h3 className="font-press-start text-sm text-arcade-orange mb-2">EDUCATION</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h4 className="text-lg">Bachelor of Computer Science</h4>
              <p>University of Technology</p>
            </div>
            <div className="mt-1 sm:mt-0 text-arcade-cyan">2013 - 2017</div>
          </div>
          
          <div>
            <h4 className="font-press-start text-xs text-arcade-neonPink mt-4 mb-2">CERTIFICATIONS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
                AWS Certified Developer
              </div>
              <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
                React Advanced Patterns
              </div>
              <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
                TypeScript Professional
              </div>
              <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
                UI/UX Design Fundamentals
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
