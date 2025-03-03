import { v4 as uuidv4 } from "uuid";

// Mock Employees Data
export const mockEmployees = [
  {
    id: "emp-001",
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@company.com",
    phone: "555-123-4567",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-002",
    name: "Sarah Johnson",
    position: "Product Manager",
    department: "Product",
    email: "sarah.johnson@company.com",
    phone: "555-234-5678",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-003",
    name: "Michael Chen",
    position: "UX Designer",
    department: "Design",
    email: "michael.chen@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-004",
    name: "Emily Rodriguez",
    position: "Frontend Developer",
    department: "Engineering",
    email: "emily.rodriguez@company.com",
    phone: "555-345-6789",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-005",
    name: "David Kim",
    position: "Backend Developer",
    department: "Engineering",
    email: "david.kim@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-006",
    name: "Jessica Lee",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "jessica.lee@company.com",
    phone: "555-456-7890",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-007",
    name: "Robert Taylor",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "robert.taylor@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-008",
    name: "Amanda Wilson",
    position: "HR Manager",
    department: "Human Resources",
    email: "amanda.wilson@company.com",
    phone: "555-567-8901",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-009",
    name: "Thomas Brown",
    position: "Data Scientist",
    department: "Data",
    email: "thomas.brown@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-010",
    name: "Lisa Garcia",
    position: "QA Engineer",
    department: "Engineering",
    email: "lisa.garcia@company.com",
    phone: "555-678-9012",
    imageUrl:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-011",
    name: "Kevin Martinez",
    position: "Full Stack Developer",
    department: "Engineering",
    email: "kevin.martinez@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-012",
    name: "Sophia Patel",
    position: "Project Manager",
    department: "Product",
    email: "sophia.patel@company.com",
    phone: "555-789-0123",
    imageUrl:
      "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-013",
    name: "James Wilson",
    position: "Systems Administrator",
    department: "IT",
    email: "james.wilson@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-014",
    name: "Olivia Thompson",
    position: "Content Strategist",
    department: "Marketing",
    email: "olivia.thompson@company.com",
    phone: "555-890-1234",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-015",
    name: "Daniel Jackson",
    position: "Security Engineer",
    department: "Engineering",
    email: "daniel.jackson@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-016",
    name: "Natalie Wright",
    position: "UI Designer",
    department: "Design",
    email: "natalie.wright@company.com",
    phone: "555-901-2345",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-017",
    name: "Ryan Cooper",
    position: "Mobile Developer",
    department: "Engineering",
    email: "ryan.cooper@company.com",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "emp-018",
    name: "Emma Davis",
    position: "Customer Success",
    department: "Support",
    email: "emma.davis@company.com",
    phone: "555-012-3456",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
];

// Create initial seat map
export const mockSeatMap = {
  id: "map-001",
  name: "Main Office",
  seats: [
    // Main Area - First Row
    { id: "seat-001", row: 1, column: 1, employeeId: "emp-001" },
    { id: "seat-002", row: 1, column: 2, employeeId: "emp-002" },
    { id: "seat-003", row: 1, column: 3, employeeId: "emp-003" },

    // Main Area - Second Row
    { id: "seat-004", row: 1, column: 4, employeeId: "emp-004" },
    { id: "seat-005", row: 1, column: 5, employeeId: "emp-005" },
    { id: "seat-006", row: 1, column: 6, employeeId: "emp-006" },

    // Main Area - Third Row
    { id: "seat-007", row: 2, column: 1, employeeId: "emp-007" },
    { id: "seat-008", row: 2, column: 2, employeeId: "emp-008" },
    { id: "seat-009", row: 2, column: 3, employeeId: "emp-009" },

    // Main Area - Fourth Row
    { id: "seat-010", row: 2, column: 4, employeeId: "emp-010" },
    { id: "seat-011", row: 2, column: 5, employeeId: "emp-011" },
    { id: "seat-012", row: 2, column: 6, employeeId: "emp-012" },

    // Secondary Area - Development Team
    { id: "seat-013", row: 3, column: 1, employeeId: "emp-013" },
    { id: "seat-014", row: 3, column: 2, employeeId: "emp-014" },
    { id: "seat-015", row: 3, column: 3, employeeId: "emp-015" },
    { id: "seat-016", row: 3, column: 4, employeeId: "emp-016" },
    { id: "seat-017", row: 3, column: 5, employeeId: "emp-017" },
    { id: "seat-018", row: 3, column: 6, employeeId: "emp-018" },

    // Empty seats
    { id: "seat-019", row: 3, column: 7 },
    { id: "seat-020", row: 3, column: 8 },
  ],
};

// Helper function to get employee by ID
export const getEmployeeById = (id) => {
  return mockEmployees.find((employee) => employee.id === id);
};

// Helper function to simulate API call to fetch attendance data
export const fetchAttendanceData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attendanceData = mockSeatMap.seats.map((seat) => {
        if (seat.employeeId) {
          return {
            ...seat,
            isPresent: Math.random() > 0.3,
          };
        }
        return seat;
      });

      resolve(attendanceData);
    }, 1500);
  });
};

// Function to mark an employee as present
export const markEmployeePresent = (seatId, isPresent) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedSeat = mockSeatMap.seats.find((seat) => seat.id === seatId);
      if (updatedSeat && updatedSeat.employeeId) {
        updatedSeat.isPresent = isPresent;
        resolve(updatedSeat);
      } else {
        throw new Error("Seat not found or not assigned to an employee");
      }
    }, 800);
  });
};

// Function to assign an employee to a seat
export const assignEmployeeToSeat = (seatId, employeeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const seat = mockSeatMap.seats.find((s) => s.id === seatId);
      if (seat) {
        seat.employeeId = employeeId;
        seat.isPresent = false;
        resolve(seat);
      } else {
        throw new Error("Seat not found");
      }
    }, 800);
  });
};

// Function to unassign an employee from a seat
export const unassignEmployeeFromSeat = (seatId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const seat = mockSeatMap.seats.find((s) => s.id === seatId);
      if (seat) {
        seat.employeeId = undefined;
        seat.isPresent = undefined;
        resolve(seat);
      } else {
        throw new Error("Seat not found");
      }
    }, 800);
  });
};

// Function to get attendance statistics
export const getAttendanceStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const assignedSeats = mockSeatMap.seats.filter((seat) => seat.employeeId);
      const presentEmployees = assignedSeats.filter((seat) => seat.isPresent);

      const totalEmployees = assignedSeats.length;
      const presentCount = presentEmployees.length;
      const absentCount = totalEmployees - presentCount;
      const presentPercentage =
        totalEmployees > 0
          ? Math.round((presentCount / totalEmployees) * 100)
          : 0;

      resolve({
        totalEmployees,
        presentCount,
        absentCount,
        presentPercentage,
      });
    }, 800);
  });
};

// Function to get attendance history (simulated)
export const getAttendanceHistory = (employeeId, days = 7) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const history = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        history.push({
          date: date.toISOString().split("T")[0],
          isPresent: Math.random() > 0.2,
        });
      }

      resolve(history);
    }, 1000);
  });
};

// Function to add a new seat to the map
export const addSeatToMap = (row, column) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSeat = {
        id: `seat-${uuidv4().substring(0, 8)}`,
        row,
        column,
      };

      mockSeatMap.seats.push(newSeat);
      resolve(newSeat);
    }, 800);
  });
};

// Function to remove a seat from the map
export const removeSeatFromMap = (seatId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockSeatMap.seats.length;
      mockSeatMap.seats = mockSeatMap.seats.filter(
        (seat) => seat.id !== seatId
      );

      resolve(mockSeatMap.seats.length < initialLength);
    }, 800);
  });
};
// Function to get all departments with attendance stats
export const getDepartmentStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get all departments
      const departments = [
        ...new Set(mockEmployees.map((emp) => emp.department)),
      ];

      // Calculate stats for each department
      const stats = departments.map((department) => {
        const departmentEmployees = mockEmployees.filter(
          (emp) => emp.department === department
        );
        const departmentEmployeeIds = departmentEmployees.map((emp) => emp.id);

        // Filter the seats for the assigned department employees
        const assignedSeats = mockSeatMap.seats.filter(
          (seat) =>
            seat.employeeId && departmentEmployeeIds.includes(seat.employeeId)
        );

        // Count the employees who are present
        const presentEmployees = assignedSeats.filter((seat) => seat.isPresent);

        const totalEmployees = departmentEmployees.length;
        const presentCount = presentEmployees.length;
        const presentPercentage =
          totalEmployees > 0
            ? Math.round((presentCount / totalEmployees) * 100)
            : 0;

        return {
          department,
          totalEmployees,
          presentCount,
          presentPercentage,
        };
      });

      resolve(stats);
    }, 1200);
  });
};
