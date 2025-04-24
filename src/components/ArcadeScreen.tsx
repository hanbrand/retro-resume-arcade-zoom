import { useEffect, useState } from 'react';
import { Gamepad, Headphones, Disc, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import RetroController from './RetroController';

const ArcadeScreen = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState("about");

  useEffect(() => {
    // Simulate loading time for the retro effect
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center bg-arcade-darkPurple overflow-x-hidden">
      {/* CRT overlay effect */}
      <div className="absolute inset-0 pointer-events-none crt z-10">
        <div className="scanline"></div>
      </div>

      {/* Content container */}
      <div className="relative w-full max-w-5xl px-4 py-8 z-0">
        {!loaded ? (
          <div className="h-screen flex flex-col items-center justify-center">
            <div className="text-4xl font-press-start text-arcade-pink animate-pulse mb-8">
              LOADING...
            </div>
            <div className="w-64 h-4 bg-arcade-darkPurple border border-arcade-cyan">
              <div className="h-full bg-arcade-cyan animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl md:text-4xl font-press-start neon-text mb-2">RESUME ARCADE</h1>
              <p className="text-sm md:text-base font-vt323 text-arcade-cyan">PLAYER 1 - READY</p>
            </div>

            {/* Main content */}
            <Tabs defaultValue="about" value={currentSection} onValueChange={setCurrentSection} className="w-full">
              <div className="border-2 border-arcade-neonPink/50 rounded-md p-3 mb-8 bg-black/40 backdrop-blur">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent gap-2">
                  <TabsTrigger
                    value="about"
                    className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-purple data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-purple/50`}
                  >
                    <Gamepad size={16} />
                    <span className="hidden sm:inline">About</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-pink data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-pink/50`}
                  >
                    <Disc size={16} />
                    <span className="hidden sm:inline">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-cyan data-[state=active]:text-black bg-arcade-darkPurple text-white/70 border border-arcade-cyan/50`}
                  >
                    <Clock size={16} />
                    <span className="hidden sm:inline">Experience</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className={`font-press-start text-xs flex gap-2 items-center data-[state=active]:bg-arcade-orange data-[state=active]:text-white bg-arcade-darkPurple text-white/70 border border-arcade-orange/50`}
                  >
                    <Headphones size={16} />
                    <span className="hidden sm:inline">Contact</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="border-2 border-arcade-cyan/50 rounded-md p-4 bg-black/40 backdrop-blur min-h-[50vh]">
                <TabsContent value="about" className="mt-0">
                  <div className="text-white font-vt323 space-y-4">
                    <h2 className="text-2xl font-press-start text-arcade-cyan mb-4">ABOUT ME</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 flex justify-center">
                        <div className="w-48 h-48 border-4 border-arcade-neonPink relative overflow-hidden">
                          {/* Placeholder for profile image - pixelated avatar */}
                          <div className="w-full h-full bg-gradient-to-br from-arcade-purple to-arcade-pink flex items-center justify-center">
                            <div className="text-6xl font-press-start text-white">?</div>
                          </div>
                          
                          {/* Scanline effect */}
                          <div className="absolute inset-0 scanline pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-4">
                        <p className="text-xl">
                          Welcome to my interactive resume! I'm a passionate developer with a love for creating amazing digital experiences.
                        </p>
                        
                        <p>
                          This portfolio showcases my skills and experience through a retro arcade interface. Navigate through the different sections using the tabs above or the arcade controls.
                        </p>
                        
                        <div className="bg-arcade-darkPurple/50 border border-arcade-cyan/30 p-4 rounded-md">
                          <h3 className="text-arcade-cyan font-press-start text-sm mb-2">PLAYER STATS</h3>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Full-stack Developer with 5+ years experience</li>
                            <li>Specialized in React, TypeScript, and Node.js</li>
                            <li>Passionate about creative UI/UX design</li>
                            <li>Constantly learning new technologies</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 border border-arcade-purple/30 rounded-md bg-gradient-to-r from-arcade-darkPurple to-black">
                      <h3 className="text-arcade-purple font-press-start text-sm mb-2">CHEAT CODE</h3>
                      <p>Press the tab buttons above to navigate through my resume or use the arrow keys for a true arcade experience!</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <SkillsSection />
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <ExperienceSection />
                </TabsContent>

                <TabsContent value="contact" className="mt-0">
                  <ContactSection />
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer */}
            <div className="mt-8 text-center text-arcade-cyan font-vt323">
              <p className="animate-pulse">&copy; 2025 RESUME ARCADE - INSERT COIN TO CONTINUE</p>
            </div>
          </>
        )}
      </div>
      
      {/* Ambient corners lighting */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-arcade-pink/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-arcade-cyan/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Add RetroController */}
      <RetroController />
    </div>
  );
};

export default ArcadeScreen;
