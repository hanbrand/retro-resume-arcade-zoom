
import { useState } from 'react';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const projects = [
    {
      title: "E-Commerce Platform",
      image: "shopping-cart",
      description: "A full-featured online store built with React, Node.js, and MongoDB. Includes user authentication, product catalog, shopping cart, and payment processing.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
      link: "#"
    },
    {
      title: "Real-time Chat App",
      image: "chat",
      description: "A real-time messaging application with private chats, group conversations, and file sharing capabilities.",
      technologies: ["React", "Socket.io", "Express", "Redis", "AWS S3"],
      link: "#"
    },
    {
      title: "Task Management Dashboard",
      image: "tasks",
      description: "A Kanban-style project management tool with drag-and-drop interface, task assignments, due dates, and progress tracking.",
      technologies: ["React", "TypeScript", "Redux", "Firebase"],
      link: "#"
    }
  ];

  const showProjectDetails = (index: number) => {
    setSelectedProject(selectedProject === index ? null : index);
  };

  return (
    <div className="text-white font-vt323">
      <h2 className="text-2xl font-press-start text-arcade-neonPink mb-6">PROJECTS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index}
            className={`border-2 ${selectedProject === index ? 'border-arcade-cyan neon-blue-border' : 'border-arcade-purple/30'} 
              rounded-md overflow-hidden cursor-pointer transition-all duration-300`}
            onClick={() => showProjectDetails(index)}
          >
            {/* Project image/icon placeholder */}
            <div className="h-40 bg-gradient-to-br from-arcade-darkPurple to-black flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-arcade-darkPurple border-2 border-arcade-cyan flex items-center justify-center text-4xl">
                {project.image === "shopping-cart" && "🛒"}
                {project.image === "chat" && "💬"}
                {project.image === "tasks" && "📋"}
              </div>
            </div>
            
            <div className="p-4 bg-black/80">
              <h3 className="font-press-start text-sm text-arcade-cyan">{project.title}</h3>
              
              <p className="mt-2 text-sm line-clamp-2">
                {project.description}
              </p>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-arcade-neonPink animate-pulse">
                  {selectedProject === index ? "< HIDE DETAILS >" : "< VIEW DETAILS >"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProject !== null && (
        <div className="mt-6 p-4 border-2 border-arcade-cyan bg-black/60 rounded-md animate-fade-in">
          <h3 className="font-press-start text-lg text-arcade-neonPink mb-4">{projects[selectedProject].title}</h3>
          
          <p className="mb-4">{projects[selectedProject].description}</p>
          
          <div className="mb-4">
            <h4 className="font-press-start text-sm text-arcade-cyan mb-2">TECHNOLOGIES</h4>
            <div className="flex flex-wrap gap-2">
              {projects[selectedProject].technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-3 py-1 bg-arcade-darkPurple border border-arcade-purple/40 rounded-md text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <a 
              href={projects[selectedProject].link}
              className="inline-block px-6 py-2 bg-arcade-cyan text-black font-press-start text-sm rounded-md hover:bg-arcade-neonPink transition-colors duration-300"
            >
              VIEW PROJECT
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 border border-arcade-pink/30 rounded-md bg-gradient-to-r from-black to-arcade-darkPurple">
        <h3 className="font-press-start text-sm text-arcade-orange mb-2">GITHUB ACTIVITY</h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, index) => {
            const randomLevel = Math.floor(Math.random() * 4);
            let bgColor;
            
            switch(randomLevel) {
              case 0: bgColor = "bg-arcade-darkPurple"; break;
              case 1: bgColor = "bg-arcade-purple/30"; break;
              case 2: bgColor = "bg-arcade-purple/60"; break;
              case 3: bgColor = "bg-arcade-purple"; break;
              default: bgColor = "bg-arcade-darkPurple";
            }
            
            return (
              <div 
                key={index} 
                className={`w-full aspect-square ${bgColor} rounded-sm`}
                title={`${randomLevel * 2} contributions`}
              ></div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-center">
          <span className="text-arcade-cyan">150+ contributions</span> in the last year
        </p>
      </div>
    </div>
  );
};

export default ProjectsSection;
