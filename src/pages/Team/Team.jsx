import React from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import TeamCard from '../../components/TeamCard/TeamCard';
import CTASection from '../../components/CTASection/CTASection';
import { team, getTeam } from '../../data/team';

const Team = () => {
  const teamMembers = getTeam ? getTeam() : team;

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
