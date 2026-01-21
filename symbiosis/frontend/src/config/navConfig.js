export const navConfig = {
    PUBLIC: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Admissions", path: "/admissions" },
        { name: "Gallery", path: "/gallery" },
        { name: "Contact", path: "/contact" },
    ],
    ADMIN: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Students", path: "/dashboard/students" },
        { name: "Staff", path: "/dashboard/staff" },
        { name: "Notices", path: "/dashboard/notices" },
    ],
    TEACHER: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Assignments", path: "/dashboard/assignments" },
        { name: "Attendance", path: "/dashboard/attendance" },
        { name: "Marks", path: "/dashboard/marks" },
    ],
    STUDENT: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "My Assignments", path: "/dashboard/my-assignments" },
        { name: "Notices", path: "/dashboard/notices" },
    ]
};
