const API_URL = 'http://localhost:5000/api';

const verifyStudentResults = async () => {
    try {
        console.log('1. Logging in as Admin to find Student credentials...');
        const adminLogin = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@isbm.com', password: 'adminpassword' })
        });
        const adminData = await adminLogin.json();
        const adminToken = adminData.token;

        // Get Grade 10 students to find Aarav
        const classesRes = await fetch(`${API_URL}/academic/classes`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const classes = await classesRes.json();
        const grade10 = classes.find(c => c.name === 'Grade 10');
        
        const studentsRes = await fetch(`${API_URL}/students?class=${grade10._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const students = await studentsRes.json();
        const aaravStudent = students.find(s => s.name.includes('Aarav'));

        if (!aaravStudent) { console.error('Aarav not found'); return; }

        // We need his User Email. Student model has `email` field usually copied or populated user?
        // Let's assume Student.email is the user email.
        console.log(`Found Aarav: ${aaravStudent.name} (${aaravStudent.email})`);

        console.log('2. Logging in as Student (Aarav)...');
        // Assuming default password 'password123'
        const studentLogin = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: aaravStudent.email, password: 'password123' })
        });

        if (!studentLogin.ok) {
            console.error('Student Login Failed:', await studentLogin.text());
            return;
        }

        const studentData = await studentLogin.json();
        console.log('Logged in as:', studentData.role);

        console.log('3. Fetching My Results...');
        const resultsRes = await fetch(`${API_URL}/exams/results/student/me`, {
            headers: { Authorization: `Bearer ${studentData.token}` }
        });

        if (!resultsRes.ok) {
            console.error('Fetch Results Failed:', await resultsRes.text());
            return;
        }

        const results = await resultsRes.json();
        console.log(`Results found: ${results.length}`);
        
        if (results.length > 0) {
            results.forEach(r => {
                console.log(`\nReport Card: ${r.exam.name} (${r.exam.term})`);
                console.log(`- Grade: ${r.grade}`);
                console.log(`- Percentage: ${r.percentage}%`);
                r.subjects.forEach(s => {
                     console.log(`  * ${s.subject.name}: ${s.marksObtained}/${s.totalMarks}`);
                });
            });
        } else {
            console.log('⚠️ No results found for this student yet.');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyStudentResults();
