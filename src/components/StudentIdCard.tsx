
import { useApp } from '@/contexts/AppContext';
import { BadgeCheck, QrCode, User } from 'lucide-react';

const StudentIdCard = () => {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="text-[400px] font-bold text-primary rotate-45 select-none">A</div>
        </div>
        
        <div className="px-6 py-8 relative z-10">
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-primary/30 mb-4">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={`${currentUser.name}'s avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-1 text-center">{currentUser.name}</h2>
            <div className="flex items-center text-muted-foreground mb-6">
              <span>Student</span>
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mx-2"></div>
              <span>ID: {currentUser.studentId}</span>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Verified Student</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Grade</p>
              <p className="font-medium">{currentUser.grade}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Section</p>
              <p className="font-medium">{currentUser.section}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{currentUser.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="font-medium">{currentUser.joinedOn}</p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="p-3 border border-border rounded-lg">
              <QrCode className="h-24 w-24" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>This digital ID card is for illustration purposes.</p>
        <p>Please contact administration for your official school ID.</p>
      </div>
    </div>
  );
};

export default StudentIdCard;
