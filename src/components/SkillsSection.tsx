
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const SkillsSection = () => {
  const [loadedSkills, setLoadedSkills] = useState<string[]>([]);

  const skillCategories = [
    {
      name: "PROGRAMMING",
      skills: [
        { name: "Python", level: 92 },
        { name: "JavaScript", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Java", level: 78 },
        { name: "C/C++", level: 75 },
      ]
    },
    {
      name: "ML/DATA SCIENCE",
      skills: [
        { name: "Scikit-learn", level: 88 },
        { name: "Pandas", level: 90 },
        { name: "Numpy", level: 90 },
        { name: "PyTorch", level: 82 },
        { name: "TensorFlow", level: 80 },
      ]
    },
    {
      name: "TOOLS & FRAMEWORKS",
      skills: [
        { name: "Flask", level: 85 },
        { name: "Node.js", level: 78 },
        { name: "AWS", level: 76 },
        { name: "Docker", level: 80 },
        { name: "Git/GitHub", level: 88 },
      ]
    },
    {
      name: "DATABASES",
      skills: [
        { name: "MongoDB", level: 82 },
        { name: "MySQL", level: 84 },
        { name: "SQLite", level: 86 },
        { name: "Oracle", level: 75 },
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
      <h2 className="text-2xl font-press-start text-arcade-neonPink mb-6">TECH SKILLS</h2>
      
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
          {["HuggingFace", "BeautifulSoup", "Data Visualization", "Machine Learning", 
            "Feature Engineering", "REST API Design", "Database Design", "Azure"].map((skill, index) => (
            <div key={index} className="px-3 py-2 border border-arcade-purple/40 rounded text-center 
              bg-gradient-to-r from-arcade-darkPurple to-black hover:from-black hover:to-arcade-darkPurple 
              transition-colors cursor-pointer">
              {skill}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 border border-arcade-pink/30 rounded-md bg-black/30">
        <h3 className="font-press-start text-sm text-arcade-cyan mb-2">PROJECTS</h3>
        
        <div className="space-y-4 mt-4">
          <div className="border border-arcade-purple/40 rounded p-3 bg-arcade-darkPurple/40">
            <div className="flex justify-between items-start">
              <h4 className="font-press-start text-arcade-neonPink text-sm">Summary Chrome Extension (HackSC)</h4>
              <span className="text-xs text-arcade-cyan">Nov 2024</span>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              <li>Built a Chrome extension leveraging LLMs (OpenAI API) to summarize and answer questions on web content</li>
              <li>Added text-to-speech for visually impaired users, reducing completion time by 3x</li>
              <li>Deployed to 100+ users during HackSC; received award for best ease of use and accessibility</li>
            </ul>
          </div>
          
          <div className="border border-arcade-purple/40 rounded p-3 bg-arcade-darkPurple/40">
            <div className="flex justify-between items-start">
              <h4 className="font-press-start text-arcade-neonPink text-sm">Stock Sentiment Tracker</h4>
              <span className="text-xs text-arcade-cyan">Aug 2024</span>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              <li>Developed a web-based tool to scrape Reddit and X for stock posts</li>
              <li>Used FinBERT to classify sentiment by ticker; tracked trends across thousands of posts</li>
              <li>Built a dashboard to monitor sentiment changes ahead of earnings reports</li>
            </ul>
          </div>
          
          <div className="border border-arcade-purple/40 rounded p-3 bg-arcade-darkPurple/40">
            <div className="flex justify-between items-start">
              <h4 className="font-press-start text-arcade-neonPink text-sm">Campus Event Explorer</h4>
              <span className="text-xs text-arcade-cyan">Feb-May 2024</span>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              <li>Built interactive maps and filters for exploring campus events</li>
              <li>Used PostGIS and R to identify low-attendance zones and inform planning</li>
              <li>Adopted by 500+ students and staff in the first month</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
