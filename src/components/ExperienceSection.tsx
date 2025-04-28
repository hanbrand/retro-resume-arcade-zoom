
import { useState } from 'react';

const ExperienceSection = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  
  const experiences = [
    {
      title: "Research Laboratory Manager",
      company: "University of California, Los Angeles",
      period: "January 2019 - December 2023",
      description: "Led development of automated data processing systems for over 300 screening assays, collaborating closely with 70+ clients to develop and implement robotics and high volume liquid handlers.",
      achievements: [
        "Developed modular pipelines for feature extraction using AI-based quality scoring; integrated risk detection and model evaluation in safety-critical workflows",
        "Secured $1.2M+ in funding to build scalable AI infrastructure, enabling safe, high-throughput inference pipelines with reliability and performance optimizations",
        "Trained and mentored 120+ lab members and clients in advanced data collection using AI-assisted programs and motorized high volume liquid handlers",
        "Created and optimized an antibody Covid test for over 2,000 patient samples used in early pandemic treatment",
        "Ran weekly workshops that up-skilled researchers on data visualization and end-to-end pipelines"
      ]
    },
    {
      title: "Workforce Development Program Manager",
      company: "COPE Health Solutions",
      period: "January 2016 - December 2019",
      description: "Coordinated and trained 200 volunteers in onboarding and learning essential patient-care skills.",
      achievements: [
        "Partnered with nursing leadership to streamline onboarding paperwork, shaving 48 hrs off of average onboarding time"
      ]
    }
  ];
  
  const education = [
    {
      degree: "Master of Science, Computer Science",
      institution: "University of Southern California",
      location: "Los Angeles, CA",
      period: "Expected December 2025",
      gpa: "3.8/4.0",
      courses: "Advanced Databases, Algorithms, Machine Learning, Deep Learning & Optimization, Web Technologies"
    },
    {
      degree: "Bachelor of Science, Biochemistry",
      institution: "University of California, Los Angeles",
      location: "Los Angeles, CA",
      period: "January 2017 - December 2019",
      gpa: "3.6/4.0"
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
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="pb-4 border-b border-arcade-purple/30 last:border-0">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h4 className="text-lg">{edu.degree}</h4>
                  <p>{edu.institution}</p>
                  <p className="text-arcade-cyan/80">{edu.location}</p>
                  {edu.gpa && <p className="text-sm text-arcade-neonPink">GPA: {edu.gpa}</p>}
                </div>
                <div className="mt-2 sm:mt-0 text-arcade-cyan">{edu.period}</div>
              </div>
              
              {edu.courses && (
                <div className="mt-3">
                  <p className="text-sm text-arcade-neonPink">Relevant Courses:</p>
                  <p className="text-sm">{edu.courses}</p>
                </div>
              )}
            </div>
          ))}
        </div>
          
        <div>
          <h4 className="font-press-start text-xs text-arcade-neonPink mt-4 mb-2">CERTIFICATIONS</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
              AWS Certified Developer
            </div>
            <div className="px-3 py-2 border border-arcade-purple/40 rounded bg-black/20">
              Machine Learning Specialization
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-2 border-arcade-pink/20 p-4 rounded-md bg-black/30">
        <h3 className="font-press-start text-sm text-arcade-cyan mb-2">CONTACT INFO</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-arcade-neonPink">📍</span>
            <span>Los Angeles, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-arcade-neonPink">📱</span>
            <span>626-404-4082</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-arcade-neonPink">📧</span>
            <span>brandonh4n@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-arcade-neonPink">🌐</span>
            <span>linkedin.com/in/brandon-han-63b061239/</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-arcade-neonPink">💻</span>
            <span>github.com/hanbrand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
