import { useState } from 'react';
import { Disc } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      email: !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      message: formData.message.trim() === ''
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsHighScore(true);
        
        toast({
          title: "Message sent!",
          description: "I'll get back to you as soon as possible.",
          className: "bg-black border-2 border-arcade-cyan text-white font-vt323"
        });
        
        setFormData({ name: '', email: '', message: '' });
      }, 2000);
    }
  };

  return (
    <div className="text-white font-vt323">
      <h2 className="text-2xl font-press-start text-arcade-orange mb-6">CONTACT ME</h2>
      
      {!isHighScore ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="border-2 border-arcade-neonPink p-4 bg-black/40 rounded-md">
              <h3 className="font-press-start text-sm text-arcade-cyan mb-4">CONNECT</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-arcade-darkPurple flex items-center justify-center">
                  <span className="text-xl">🌐</span>
                </div>
                <a href="https://www.linkedin.com/in/brandon-han-63b061239/" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-arcade-cyan transition-colors">
                  linkedin.com/in/brandon-han-63b061239/
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-arcade-darkPurple flex items-center justify-center">
                  <span className="text-xl">💻</span>
                </div>
                <a href="https://github.com/hanbrand" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-arcade-cyan transition-colors">
                  github.com/hanbrand
                </a>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-press-start text-sm text-arcade-neonPink mb-4">LOCATION</h3>
              
              <div className="border border-arcade-cyan/30 p-4 rounded-md bg-arcade-darkPurple/50">
                <div className="mb-2 text-arcade-cyan">Los Angeles, CA</div>
                <p>Available for opportunities in Los Angeles and remote positions worldwide.</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border-2 border-arcade-cyan p-4 bg-black/40 rounded-md relative overflow-hidden">
              <h3 className="font-press-start text-sm text-arcade-neonPink mb-4">SEND MESSAGE</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 bg-arcade-darkPurple border ${formErrors.name ? 'border-arcade-orange' : 'border-arcade-purple/50'} rounded-sm text-white font-vt323`}
                  />
                  {formErrors.name && <p className="text-arcade-orange text-sm mt-1">Please enter your name</p>}
                </div>
                
                <div>
                  <label className="block mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 bg-arcade-darkPurple border ${formErrors.email ? 'border-arcade-orange' : 'border-arcade-purple/50'} rounded-sm text-white font-vt323`}
                  />
                  {formErrors.email && <p className="text-arcade-orange text-sm mt-1">Please enter a valid email</p>}
                </div>
                
                <div>
                  <label className="block mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-2 bg-arcade-darkPurple border ${formErrors.message ? 'border-arcade-orange' : 'border-arcade-purple/50'} rounded-sm text-white font-vt323`}
                  />
                  {formErrors.message && <p className="text-arcade-orange text-sm mt-1">Please enter a message</p>}
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 font-press-start text-sm ${
                      isSubmitting 
                        ? 'bg-arcade-darkPurple text-arcade-cyan/50' 
                        : 'bg-arcade-neonPink text-white hover:bg-arcade-orange'
                    } rounded-md transition-colors`}
                  >
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                </div>
              </form>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-arcade-pink/10 rounded-full blur-xl"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-arcade-cyan/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-arcade-cyan p-6 bg-black/60 rounded-md text-center animate-fade-in">
          <h3 className="font-press-start text-xl text-arcade-pink mb-6">NEW HIGH SCORE!</h3>
          
          <div className="flex justify-center mb-8">
            <Disc className="w-16 h-16 text-arcade-cyan animate-float" />
          </div>
          
          <p className="text-xl mb-4">Thanks for your message!</p>
          <p>I'll get back to you as soon as possible.</p>
          
          <div className="mt-10 mb-2">
            <table className="mx-auto border-separate border-spacing-2">
              <thead>
                <tr className="text-arcade-cyan">
                  <th className="font-press-start text-xs">RANK</th>
                  <th className="font-press-start text-xs">NAME</th>
                  <th className="font-press-start text-xs">SCORE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-arcade-darkPurple/40">
                  <td className="px-3 py-1 border border-arcade-purple/20">1</td>
                  <td className="px-3 py-1 border border-arcade-purple/20">YOU</td>
                  <td className="px-3 py-1 border border-arcade-purple/20 text-arcade-orange">9999</td>
                </tr>
                <tr>
                  <td className="px-3 py-1 border border-arcade-purple/20">2</td>
                  <td className="px-3 py-1 border border-arcade-purple/20">CPU</td>
                  <td className="px-3 py-1 border border-arcade-purple/20">5000</td>
                </tr>
                <tr>
                  <td className="px-3 py-1 border border-arcade-purple/20">3</td>
                  <td className="px-3 py-1 border border-arcade-purple/20">CPU</td>
                  <td className="px-3 py-1 border border-arcade-purple/20">2500</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <button
            onClick={() => setIsHighScore(false)}
            className="mt-8 px-6 py-3 font-press-start text-sm bg-arcade-cyan text-black hover:bg-arcade-neonPink hover:text-white rounded-md transition-colors"
          >
            SEND ANOTHER MESSAGE
          </button>
        </div>
      )}
      
      <div className="mt-8 p-4 border border-arcade-neonPink/30 bg-gradient-to-r from-arcade-darkPurple to-black rounded-md">
        <h3 className="font-press-start text-sm text-arcade-orange mb-2">AVAILABLE FOR</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="px-3 py-2 border border-arcade-purple/40 rounded text-center bg-black/20">
            Full-time Roles
          </div>
          <div className="px-3 py-2 border border-arcade-purple/40 rounded text-center bg-black/20">
            ML Engineering
          </div>
          <div className="px-3 py-2 border border-arcade-purple/40 rounded text-center bg-black/20">
            Data Science
          </div>
          <div className="px-3 py-2 border border-arcade-purple/40 rounded text-center bg-black/20">
            Research Projects
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
