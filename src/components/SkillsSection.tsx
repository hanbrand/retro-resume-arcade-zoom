
import { useState, useEffect } from 'react';

const SkillsSection = () => {
  const [loadedSkills, setLoadedSkills] = useState<string[]>([]);

  const skillCategories = [
    {
      name: "PROGRAMMING",
      skills: [
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "React", level: 92 },
        { name: "Node.js", level: 80 },
        { name: "HTML/CSS", level: 95 },
      ]
    },
    {
      name: "TOOLS",
      skills: [
        { name: "Git", level: 88 },
        { name: "Docker", level: 75 },
        { name: "AWS", level: 70 },
        { name: "Figma", level: 78 },
        { name: "VS Code", level: 92 },
      ]
    },
    {
      name: "SOFT SKILLS",
      skills: [
        { name: "Team Collaboration", level: 95 },
        { name: "Problem Solving", level: 92 },
        { name: "Communication", level: 88 },
        { name: "Project Management", level: 82 },
        { name: "Adaptability", level: 90 },
      ]
    }
  ];

  useEffect(() => {
    // Gradually reveal skills for animation effect
    const allSkills = skillCategories.flatMap(category => 
      category.skills.map(skill => skill.name)
    );
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < allSkills.length) {
        setLoadedSkills(prev => [...prev, allSkills[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white font-vt323">
      <h2 className="text-2xl font-press-start text-arcade-neonPink mb-6">SKILL LEVELS</h2>
      
      <div className="space-y-8">
        {skillCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="font-press-start text-sm text-arcade-cyan mb-4">{category.name}</h3>
            
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => {
                const isLoaded = loadedSkills.includes(skill.name);
                
                return (
                  <div key={skillIndex} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-lg">{skill.name}</span>
                      <span className={`${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
                        {skill.level}/100
                      </span>
                    </div>
                    
                    <div className="w-full h-6 bg-arcade-darkPurple border border-arcade-cyan/50 rounded-sm overflow-hidden">
                      <div 
                        className={`h-full ${
                          skill.level > 85 
                            ? "bg-arcade-cyan" 
                            : skill.level > 70 
                            ? "bg-arcade-purple" 
                            : "bg-arcade-pink"
                        } transition-all duration-1000 ease-out flex items-center`}
                        style={{ 
                          width: isLoaded ? `${skill.level}%` : "0%",
                        }}
                      >
                        {/* Pixelated progress bar */}
                        <div className="h-full w-full opacity-30" 
                          style={{
                            backgroundImage: "linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.4) 50%)",
                            backgroundSize: "4px 4px"
                          }} 
                        />
                      </div>
                    </div>
                    
                    {/* Achievement indicators */}
                    {isLoaded && skill.level >= 90 && (
                      <div className="absolute -top-2 -right-2 text-xs font-press-start text-arcade-orange animate-pulse">
                        ★ MASTER ★
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 border border-arcade-cyan/30 rounded-md bg-black/30">
        <h3 className="font-press-start text-sm text-arcade-orange mb-2">BONUS SKILLS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Responsive Design", "SEO Optimization", "Performance Tuning", "Accessibility", 
            "UI Animation", "REST API Design", "Database Design", "State Management"].map((skill, index) => (
            <div key={index} className="px-3 py-2 border border-arcade-purple/40 rounded text-center 
              bg-gradient-to-r from-arcade-darkPurple to-black hover:from-black hover:to-arcade-darkPurple 
              transition-colors cursor-pointer">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
