import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiFilter } from 'react-icons/fi';

const mockTeamData = [
  {
    id: 1,
    email: 'john.doe@example.com',
    fullname: 'John Doe',
    role: 'user',
    team: 'team1'
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    fullname: 'Jane Smith',
    role: 'user',
    team: 'team1'
  },
  // Add more mock data as needed
];

const TeamView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [teamData, setTeamData] = useState(mockTeamData); // Set the initial team data to mockTeamData
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    return `${username.charAt(0)}${username.slice(1).replace(/./g, '*')}@${domain}`;
  };

  // Fetch the team data from API
  useEffect(() => {
    const fetchTeamData = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        console.error("No token found in localStorage");
        setError("No token found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:5000/get-teams', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token as Bearer
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }

        const data = await response.json();
        // Append the fetched team data to the mock data
        setTeamData(prevData => [...prevData, ...data]);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData(); // Call fetch team data when component mounts
  }, []);

  // Filter team data based on search and filter
  const filteredTeam = teamData.filter((member) => {
    // Ensure member.fullname and member.team exist before calling toLowerCase
    const memberName = member.fullname && typeof member.fullname === 'string' ? member.fullname.toLowerCase() : '';
    const memberTeam = member.team && typeof member.team === 'string' ? member.team.toLowerCase() : '';
  
    const matchesSearch =
      memberName.includes(searchTerm.toLowerCase()) || memberTeam.includes(searchTerm.toLowerCase());
  
    const matchesTeam = filterTeam === 'all' || memberTeam === filterTeam.toLowerCase();
  
    console.log({
      matchesSearch,
      matchesTeam,
      searchTerm,
      filterTeam,
      memberName,
      memberTeam,
    });
  
    return matchesSearch && matchesTeam;
  });
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                >
                  <option value="all">All Teams</option>
                  <option value="team1">Team 1</option>
                  <option value="team2">Team 2</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.fullname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{maskEmail(member.email)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.team}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamView;
