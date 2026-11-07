import React, { useState, useEffect } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import TeamCard from '../../components/TeamCard/TeamCard';
import CTASection from '../../components/CTASection/CTASection';
import { team, getTeam } from '../../data/team';
import { subscribeToDataUpdates } from '../../admin/services/adminStorage';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState(() => (getTeam ? getTeam() : team));

  useEffect(() => {
    return subscribeToDataUpdates(() => {
      setTeamMembers(getTeam ? getTeam() : team);
    });
  }, []);

  return (
    <div className="team-page pt-20">
      <div className="container">
        <SectionTitle 
          title="Meet The Team" 
          subtitle="We are a group of creative thinkers, strategists, and technologists."
          centered
        />
        
        <div className="team-grid mb-20 mt-12">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
      
      <CTASection />
    </div>
  );
};

export default Team;
