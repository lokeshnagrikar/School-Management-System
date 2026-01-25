const API_URL = 'http://localhost:5000/api';

const verifyCreateExam = async () => {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@isbm.com',
                password: 'adminpassword'
            })
        });

        if (!loginRes.ok) {
            console.error('Login Failed:', await loginRes.text());
            return;
        }

        const { token, role } = await loginRes.json();
        console.log('Logged in as:', role);

        console.log('2. Fetching Classes to assign...');
        const classesRes = await fetch(`${API_URL}/academic/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const classes = await classesRes.json();
        const classIds = classes.slice(0, 2).map(c => c._id); // Pick first 2 classes
        console.log(`Assigning to ${classIds.length} classes.`);

        console.log('3. Creating New Exam...');
        const examData = {
            name: "Test Exam 2026",
            academicYear: "2025-2026",
            term: "Term 1",
            classes: classIds,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString()
        };

        const createRes = await fetch(`${API_URL}/exams`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(examData)
        });

        if (!createRes.ok) {
            console.error('Create Exam Failed:', await createRes.text());
            return;
        }

        const newExam = await createRes.json();
        console.log('✅ Exam Created Successfully!');
        console.log('ID:', newExam._id);
        console.log('Name:', newExam.name);

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyCreateExam();
